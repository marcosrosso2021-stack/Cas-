/* Tests du rangement par espace du serveur casô (étape 1 du plan « un espace par abonné »).
   Lancer : node tests/serveur-espaces.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-espaces-'));
const monte=o=>new Promise(r=>{const s=createServer(Object.assign({noTimers:true,pushSend:async()=>({status:201})},o));s.server.listen(0,'127.0.0.1',()=>r(s.server))});
function req(srv,o){return new Promise((res,ko)=>{const body=o.body?JSON.stringify(o.body):null;
 const r=http.request({host:'127.0.0.1',port:srv.address().port,method:o.method||(body?'POST':'GET'),path:o.path,headers:Object.assign(body?{'content-type':'application/json'}:{},o.headers||{})},
  x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j=null;try{j=JSON.parse(d)}catch(e){}res({status:x.statusCode,body:d,json:j})})});
 r.on('error',ko);if(body)r.write(body);r.end()})}
const ferme=s=>new Promise(r=>s.close(r));
const attends=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 /* 1. dossier neuf : les données de l'entreprise vont dans espaces/e1 */
 let d=path.join(tmp,'neuf'),S=await monte({dataDir:d});
 let r=await req(S,{path:'/api/setup',body:{user:'Marcos',password:'motdepasse1'}});
 ok('dossier neuf : compte patron créé',r.status===200,r.status);
 await attends(300);
 ok('le fichier est dans espaces/e1',fs.existsSync(path.join(d,'espaces','e1','data.json')));
 ok('rien n\'est écrit à l\'ancien endroit',!fs.existsSync(path.join(d,'data.json')));
 const jeton=r.json&&r.json.token;
 /* 2. deux espaces dans le même dossier ne se voient pas */
 const S2=await monte({dataDir:d,espace:'e2'});
 r=await req(S2,{path:'/api/state'});
 ok('un autre espace du même dossier est vide',r.json&&r.json.needsSetup===true,r.body.slice(0,80));
 r=await req(S2,{path:'/api/sync',headers:{authorization:'Bearer '+jeton},body:{since:0,changes:{},tomb:[]}});
 ok('le jeton de l\'espace e1 est refusé dans l\'espace e2',r.status===401,r.status);
 r=await req(S,{path:'/api/sync',headers:{authorization:'Bearer '+jeton},body:{since:0,changes:{clients:[{id:'c1',nom:'Martin',updatedAt:Date.now()}]},tomb:[]}});
 ok('le même jeton marche dans son espace',r.status===200,r.status);
 await attends(300);
 ok('la fiche envoyée dans e1 n\'est pas dans le fichier de e2',!/Martin/.test(fs.existsSync(path.join(d,'espaces','e2','data.json'))?fs.readFileSync(path.join(d,'espaces','e2','data.json'),'utf8'):''));
 ok('un nom d\'espace piégé retombe sur e1',(()=>{try{const x=createServer({dataDir:path.join(tmp,'piege'),espace:'../../x',noTimers:true});return fs.existsSync(path.join(tmp,'piege','espaces','e1'))&&!fs.existsSync(path.join(tmp,'x'))}catch(e){return false}})());
 await ferme(S);await ferme(S2);
 /* 3. ancien rangement : le fichier est repris dans l'espace e1, l'ancien est gardé tel quel */
 d=path.join(tmp,'ancien');const A=await monte({dataDir:path.join(tmp,'src')});
 await req(A,{path:'/api/setup',body:{user:'Paul',password:'motdepasse1'}});await attends(300);await ferme(A);
 fs.mkdirSync(d,{recursive:true});fs.copyFileSync(path.join(tmp,'src','espaces','e1','data.json'),path.join(d,'data.json'));
 const avant=fs.readFileSync(path.join(d,'data.json'),'utf8');
 let M=await monte({dataDir:d});
 r=await req(M,{path:'/api/state'});
 ok('ancien data.json : l\'entreprise est retrouvée',r.json&&r.json.needsSetup===false,r.body.slice(0,80));
 r=await req(M,{path:'/api/login',body:{user:'Paul',password:'motdepasse1'}});
 ok('le patron se connecte comme avant',r.status===200,r.status);
 await attends(300);
 ok('l\'ancien fichier n\'a pas changé',fs.readFileSync(path.join(d,'data.json'),'utf8')===avant);
 ok('la copie est dans espaces/e1',fs.existsSync(path.join(d,'espaces','e1','data.json')));
 await ferme(M);
 /* 4. redémarrage : l'espace n'est pas écrasé par l'ancien fichier resté en place */
 const apres=fs.readFileSync(path.join(d,'espaces','e1','data.json'),'utf8');
 M=await monte({dataDir:d});await attends(200);
 ok('au redémarrage, le fichier de l\'espace est gardé',fs.readFileSync(path.join(d,'espaces','e1','data.json'),'utf8')===apres&&!fs.readdirSync(path.join(d,'espaces','e1')).some(f=>/avant-/.test(f)));
 await ferme(M);
 /* 5. retour au code d'avant puis de nouveau celui-ci : l'ancien fichier, plus récent, est repris ; la version de l'espace est mise de côté */
 const j=JSON.parse(avant);j.counter=4242;const futur=new Date(Date.now()+60000);
 fs.writeFileSync(path.join(d,'data.json'),JSON.stringify(j));fs.utimesSync(path.join(d,'data.json'),futur,futur);
 M=await monte({dataDir:d});await attends(200);
 ok('ancien fichier plus récent : repris dans l\'espace',JSON.parse(fs.readFileSync(path.join(d,'espaces','e1','data.json'),'utf8')).counter===4242);
 ok('la version d\'avant de l\'espace est mise de côté',fs.readdirSync(path.join(d,'espaces','e1')).some(f=>/^data\.json\.avant-\d+$/.test(f)));
 await ferme(M);
 console.log(R.join('\n'));const f=R.filter(x=>x.startsWith('FAIL')).length;console.log(f?f+' échec(s)':'Tous les essais passent ('+R.length+').');process.exit(f?1:0);
})().catch(e=>{console.error(e);process.exit(1)});

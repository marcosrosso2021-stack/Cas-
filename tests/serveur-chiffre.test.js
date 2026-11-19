/* Tests du chiffrement au repos du serveur casô (serveur/chiffre.js, phrase CASO_CLE_DONNEES).
   Lancer : node tests/serveur-chiffre.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer}=require('../serveur/server.js');
const chiffre=require('../serveur/chiffre.js'),sauvegarde=require('../serveur/sauvegarde.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-chiffre-'));
const CLE='une phrase secrète de test assez longue';
const monte=o=>new Promise(r=>{const s=createServer(Object.assign({noTimers:true,pushSend:async()=>({status:201})},o));s.server.listen(0,'127.0.0.1',()=>r(s.server))});
function req(srv,o){return new Promise((res,ko)=>{const body=o.body?JSON.stringify(o.body):null;
 const r=http.request({host:'127.0.0.1',port:srv.address().port,method:o.method||(body?'POST':'GET'),path:o.path,headers:Object.assign(body?{'content-type':'application/json'}:{},o.headers||{})},
  x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j=null;try{j=JSON.parse(d)}catch(e){}res({status:x.statusCode,body:d,json:j})})});
 r.on('error',ko);if(body)r.write(body);r.end()})}
const ferme=s=>new Promise(r=>s.close(r));
const attends=ms=>new Promise(r=>setTimeout(r,ms));
/* tous les fichiers du dossier (sous-dossiers compris), hors sauvegardes */
const tout=d=>{const L=[];(function v(x){for(const n of fs.readdirSync(x)){const p=path.join(x,n);if(fs.statSync(p).isDirectory()){if(n!=='sauvegardes')v(p)}else L.push(p)}})(d);return L};
const contient=(d,mot)=>tout(d).filter(f=>fs.readFileSync(f).includes(mot)).map(f=>path.relative(d,f));
const sync=(S,jeton,nom)=>req(S,{path:'/api/sync',headers:{authorization:'Bearer '+jeton},body:{since:0,changes:{clients:[{id:'c1',nom,updatedAt:Date.now()}]},tomb:[]}});
const leve=f=>{try{f();return ''}catch(e){return e.message||String(e)}};

(async()=>{
 /* 1. sans phrase : rien ne change, le fichier reste du JSON lisible */
 let d=path.join(tmp,'clair'),S=await monte({dataDir:d,cleDonnees:''});
 let r=await req(S,{path:'/api/setup',body:{user:'Marcos',password:'motdepasse1'}});
 await sync(S,r.json.token,'Client Clair');await attends(300);await ferme(S);
 const F=path.join(d,'espaces','e1','data.json');
 ok('sans phrase : data.json reste en clair',/Client Clair/.test(fs.readFileSync(F,'utf8')));

 /* 2. la phrase est posée : au démarrage, data.json et comptes.json sont réécrits chiffrés ; plus rien en clair */
 fs.writeFileSync(path.join(d,'data.json'),fs.readFileSync(F));// ancienne copie en clair à la racine (rangement d'avant les espaces)
 fs.writeFileSync(path.join(d,'comptes.json'),JSON.stringify({n:1,comptes:{'google:1':{id:'google:1',email:'paul@exemple.fr'}},sessions:{},essais:{}}));
 S=await monte({dataDir:d,cleDonnees:CLE});
 ok('avec phrase : data.json est chiffré dès le démarrage',chiffre.estChiffre(fs.readFileSync(F)));
 ok('comptes.json est chiffré dès le démarrage',chiffre.estChiffre(fs.readFileSync(path.join(d,'comptes.json'))));
 ok('l\'ancienne copie en clair à la racine est retirée',!fs.existsSync(path.join(d,'data.json')));
 r=await req(S,{path:'/api/login',body:{user:'Marcos',password:'motdepasse1'}});
 ok('le compte d\'avant marche toujours (données relues)',r.status===200&&!!(r.json&&r.json.token),r.status);
 await sync(S,r.json.token,'Client Secret');await attends(300);
 ok('aucun fichier ne contient un nom de client en clair',contient(d,'Client Secret').length===0&&contient(d,'Client Clair').length===0,contient(d,'Client').join(','));
 ok('aucun fichier ne contient l\'e-mail d\'un compte en clair',contient(d,'paul@exemple.fr').length===0,contient(d,'paul@exemple.fr').join(','));
 await ferme(S);

 /* 3. redémarrage avec la même phrase : tout est relu */
 S=await monte({dataDir:d,cleDonnees:CLE});
 r=await req(S,{path:'/api/login',body:{user:'Marcos',password:'motdepasse1'}});
 ok('redémarrage : connexion acceptée',r.status===200,r.status);
 r=await req(S,{path:'/api/sync',headers:{authorization:'Bearer '+r.json.token},body:{since:0,changes:{},tomb:[]}});
 ok('redémarrage : la fiche chiffrée est rendue',/Client Secret/.test(r.body),r.body.slice(0,80));
 await ferme(S);
 const lu=chiffre.creer(CLE).lire(F,'espaces/e1/data.json');
 ok('le fichier se déchiffre avec la phrase',lu&&/Client Secret/.test(lu.texte));

 /* 4. mauvaise phrase, ou pas de phrase : le serveur refuse de démarrer, rien n'est écrasé */
 const avant=fs.readFileSync(F);
 let m=leve(()=>createServer({dataDir:d,cleDonnees:'une autre phrase bien longue',noTimers:true}));
 ok('mauvaise phrase : démarrage refusé avec un message clair',/CASO_CLE_DONNEES incorrecte/.test(m),m);
 m=leve(()=>createServer({dataDir:d,cleDonnees:'',noTimers:true}));
 ok('phrase absente : démarrage refusé avec un message clair',/il faut la phrase secrète CASO_CLE_DONNEES/.test(m),m);
 ok('après ces refus, le fichier est intact',fs.readFileSync(F).equals(avant));
 m=leve(()=>chiffre.creer('court'));
 ok('phrase trop courte : refusée',/12 caractères/.test(m),m);

 /* 5. un fichier recopié d'un espace dans un autre est refusé (le nom du fichier est authentifié) */
 const E2=path.join(d,'espaces','abcdef123456');fs.mkdirSync(E2,{recursive:true});fs.copyFileSync(F,path.join(E2,'data.json'));
 m=leve(()=>createServer({dataDir:d,espace:'abcdef123456',cleDonnees:CLE,noTimers:true}));
 ok('fichier d\'un autre espace : refusé',/illisibles/.test(m),m);
 fs.rmSync(E2,{recursive:true,force:true});

 /* 6. sauvegarde et restauration d'un dossier chiffré */
 const s=await sauvegarde.creer(d,{cle:'phrase des sauvegardes'});
 const v=(()=>{try{return sauvegarde.verifier(s.chemin,{cle:'phrase des sauvegardes'})}catch(e){return{erreur:e.message}}})();
 ok('sauvegarde d\'un dossier chiffré : contrôle accepté',v.ok===true,v.erreur);
 fs.writeFileSync(F,'abîmé');
 sauvegarde.restaurer(s.chemin,d,{cle:'phrase des sauvegardes'});
 S=await monte({dataDir:d,cleDonnees:CLE});
 r=await req(S,{path:'/api/login',body:{user:'Marcos',password:'motdepasse1'}});
 ok('après restauration : le serveur redémarre et relit les données',r.status===200,r.status);
 await ferme(S);

 /* 7. chaque écriture change de vecteur : deux écritures du même contenu ne se ressemblent pas */
 const c=chiffre.creer(CLE),a=c.chiffrer('même texte','x'),b=c.chiffrer('même texte','x');
 ok('deux écritures identiques donnent deux fichiers différents',!a.equals(b));

 fs.rmSync(tmp,{recursive:true,force:true});
 console.log(R.join('\n'));const n=R.filter(x=>x.startsWith('OK')).length;console.log('\n'+n+'/'+R.length+' contrôles réussis');
 process.exit(n===R.length?0:1);
})().catch(e=>{console.error(e);process.exit(1)});

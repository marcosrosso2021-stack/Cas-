/* Tests du stockage du serveur casô (audit du 17 nov. 2026, points 6 et 7) :
   écriture sans blocage, plafond de taille, un seul serveur écrit pendant un déploiement.
   Lancer : node tests/serveur-stockage.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer,prendreLaMain}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-stock-'));const pause=ms=>new Promise(r=>setTimeout(r,ms));
const neuf=o=>new Promise(r=>{const s=createServer(Object.assign({noTimers:true,pushSend:async()=>({status:201})},o));s.server.listen(0,'127.0.0.1',()=>r(s))});
function req(S,p,body,tok){return new Promise((res,ko)=>{const b=body?JSON.stringify(body):null;
 const r=http.request({host:'127.0.0.1',port:S.server.address().port,method:b?'POST':'GET',path:p,headers:Object.assign(b?{'content-type':'application/json'}:{},tok?{authorization:'Bearer '+tok}:{})},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j=null;try{j=JSON.parse(d)}catch(e){}res({status:x.statusCode,j})})});
 r.on('error',ko);if(b)r.write(b);r.end()})}
const cli=(id,nom)=>({since:0,changes:{clients:[{id,nom,updatedAt:Date.now()}]}});
const disque=d=>JSON.parse(fs.readFileSync(path.join(d,'espaces','e1','data.json'),'utf8'));

(async()=>{
 /* ---- point 6 : écriture ---- */
 let d=path.join(tmp,'a'),S=await neuf({dataDir:d});
 const tok=(await req(S,'/api/setup',{user:'Marcos',password:'motdepasse1'})).j.token;
 ok('compte créé : le jeton est déjà sur le disque quand la réponse arrive',Object.keys(disque(d).tokens).length===1);
 let r=await req(S,'/api/sync',cli('c1','Dupont'),tok);
 ok('enregistrement confirmé = déjà écrit sur le disque',r.status===200&&!!disque(d).recs.clients.c1);
 let ecritures=0;const wf=fs.promises.writeFile;fs.promises.writeFile=function(){ecritures++;return wf.apply(this,arguments)};
 const a=await Promise.all(Array.from({length:60},(_,i)=>req(S,'/api/sync',cli('p'+i,'Client '+i),tok)));
 fs.promises.writeFile=wf;const D=disque(d);
 ok('60 enregistrements en même temps : tous confirmés et tous sur le disque',a.every(x=>x.status===200)&&Array.from({length:60},(_,i)=>'p'+i).every(k=>D.recs.clients[k]));
 ok('écritures regroupées (moins d’écritures que de demandes)',ecritures>0&&ecritures<60,ecritures+' écritures pour 60 demandes');
 // le serveur répond pendant une écriture : un ping passe sans attendre la fin
 const gros='x'.repeat(3e6);const t0=Date.now();
 const lent=req(S,'/api/sync',{since:0,changes:{clients:[{id:'gros',nom:gros,updatedAt:Date.now()}]}},tok);
 const ping=await req(S,'/api/ping');const tPing=Date.now()-t0;await lent;
 ok('le serveur répond aux autres pendant une grosse écriture',ping.status===200,tPing+' ms');
 S.server.close();await S.flush();
 const S1=await neuf({dataDir:d});r=await req(S1,'/api/sync',{since:0,changes:{}},tok);
 ok('après redémarrage : tout est relu',r.status===200&&(r.j.changes.clients||[]).length===62,String((r.j.changes.clients||[]).length));
 S1.server.close();

 /* ---- point 6 : plafond de taille ---- */
 d=path.join(tmp,'b');S=await neuf({dataDir:d,dataMaxMo:0.002});   // 2 Ko pour le test
 const t2=(await req(S,'/api/setup',{user:'Marcos',password:'motdepasse1'})).j.token;
 r=await req(S,'/api/sync',{since:0,changes:{clients:[{id:'g1',nom:'y'.repeat(3000),updatedAt:Date.now()}]}},t2);
 ok('sous le plafond : accepté',r.status===200);
 r=await req(S,'/api/sync',cli('g2','Encore'),t2);
 ok('au-dessus du plafond : un nouvel enregistrement est refusé (507)',r.status===507&&/plein/.test(r.j.error),r.status+' '+(r.j&&r.j.error));
 r=await req(S,'/api/sync',{since:0,changes:{}},t2);
 ok('plein : lire reste possible',r.status===200&&r.j.changes.clients.length===1);
 r=await req(S,'/api/sync',{since:0,changes:{},tomb:[{c:'clients',id:'g1',at:Date.now()+1000}]},t2);
 ok('plein : supprimer reste possible',r.status===200&&!disque(d).recs.clients.g1);
 r=await req(S,'/api/sync',cli('g2','Encore'),t2);
 ok('place libérée : les enregistrements repassent',r.status===200&&!!disque(d).recs.clients.g2,String(r.status));
 S.server.close();

 /* ---- point 7 : deux serveurs pendant un déploiement ---- */
 d=path.join(tmp,'c');
 let p=await prendreLaMain(d,'A');ok('premier serveur : prend la main sans attendre',p.attendu===false);
 const A=await neuf({dataDir:d,verrou:'A',verrouPas:80});
 const ta=(await req(A,'/api/setup',{user:'Marcos',password:'motdepasse1'})).j.token;
 await req(A,'/api/sync',cli('r1','Avant'),ta);
 const prise=prendreLaMain(d,'B',{pas:40});                 // le nouveau serveur démarre…
 const tard=await req(A,'/api/sync',cli('r2','Pendant'),ta); // …l'ancien reçoit encore une demande
 p=await prise;
 ok('nouveau serveur : attend que l’ancien ait fini d’écrire, puis prend la main',p.attendu===true&&p.ok===true,JSON.stringify(p));
 const B=await neuf({dataDir:d,verrou:'B',verrouPas:80});
 r=await req(B,'/api/sync',{since:0,changes:{}},ta);
 const noms=(r.j.changes.clients||[]).map(c=>c.nom).sort().join(',');
 ok('le nouveau serveur a tout, y compris ce que l’ancien a confirmé pendant la bascule',r.status===200&&(tard.status!==200||/Pendant/.test(noms))&&/Avant/.test(noms),'ancien='+tard.status+' → '+noms);
 r=await req(A,'/api/sync',cli('r3','Trop tard'),ta);
 ok('l’ancien serveur ne traite plus rien : « réessaie » (503)',r.status===503&&A.cede()===true,String(r.status));
 await req(B,'/api/sync',cli('r4','Après'),ta);await pause(400);
 const F=disque(d);ok('l’ancien serveur n’écrase pas le fichier du nouveau',!!F.recs.clients.r4&&!F.recs.clients.r3);
 r=await req(A,'/',null);ok('l’ancien serveur sert encore la page de l’appli',r.status===200);
 A.server.close();B.server.close();

 d=path.join(tmp,'e');fs.mkdirSync(d);fs.writeFileSync(path.join(d,'data.lock'),JSON.stringify({id:'X',at:Date.now()-6e4}));fs.writeFileSync(path.join(d,'data.vivant'),JSON.stringify({id:'X',at:Date.now()-6e4}));
 let t1=Date.now();p=await prendreLaMain(d,'Y');
 ok('ancien serveur arrêté depuis longtemps : pas d’attente',p.attendu===false&&Date.now()-t1<200);
 fs.writeFileSync(path.join(d,'data.vivant'),JSON.stringify({id:'Y',at:Date.now()}));t1=Date.now();p=await prendreLaMain(d,'Z',{attente:500,pas:50});
 ok('ancien serveur bloqué qui ne répond pas : démarrage après le délai',p.attendu===true&&p.ok===false&&Date.now()-t1>=450&&Date.now()-t1<1500,(Date.now()-t1)+' ms');

 console.log(R.join('\n'));fs.rmSync(tmp,{recursive:true,force:true});
 if(R.some(l=>l.startsWith('FAIL')))process.exit(1);
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

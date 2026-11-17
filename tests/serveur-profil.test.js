/* Tests du profil d'entreprise sur le serveur casô (audit du 17 nov. 2026, points 4 et 5).
   Lancer : node tests/serveur-profil.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-profil-'));const envois=[];
const S=createServer({dataDir:tmp,noTimers:true,pushAnyHost:true,pushSend:async(sub,msg)=>{envois.push(msg);return{status:201}}});
function req(p,body,tok){return new Promise((res,ko)=>{const b=body?JSON.stringify(body):null;
 const r=http.request({host:'127.0.0.1',port:S.server.address().port,method:b?'POST':'GET',path:p,headers:Object.assign(b?{'content-type':'application/json'}:{},tok?{authorization:'Bearer '+tok}:{})},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j=null;try{j=JSON.parse(d)}catch(e){}res({status:x.statusCode,j})})});
 r.on('error',ko);if(b)r.write(b);r.end()})}
const LOGO='data:image/png;base64,'+Buffer.from('logo').toString('base64');
const prof=(v,at)=>({since:0,changes:{prof:[{id:'prof',v,updatedAt:at}]}});
const lire=async tok=>{const r=await req('/api/sync',{since:0,changes:{}},tok);return ((r.j.changes.prof||[])[0]||{}).v||{}};
const pause=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
 await new Promise(r=>S.server.listen(0,'127.0.0.1',r));
 const patron=(await req('/api/setup',{user:'Marcos',password:'motdepasse1'})).j.token;
 await req('/api/users',{user:'Karim',password:'motdepasse2',role:'chef'},patron);
 const chef=(await req('/api/login',{user:'Karim',password:'motdepasse2'})).j.token;
 ok('comptes patron et chef créés',!!patron&&!!chef);
 const sub=await req('/api/push/sub',{sub:{endpoint:'https://push.example/abc',keys:{p256dh:'k',auth:'a'}},lang:'fr'},patron);
 const t=Date.now()-60000;

 await req('/api/sync',prof({nom:'Ent',iban:'FR7630006000011234567890189',bic:'AGRIFRPP',siret:'12345678900012',siren:'123456789',logo:LOGO},t),patron);
 let v=await lire(patron);
 ok('patron : profil enregistré avec IBAN et logo',v.iban==='FR7630006000011234567890189'&&v.logo===LOGO);
 ok('premier enregistrement : pas d’alerte',envois.length===0,String(envois.length));

 // un chef tente de changer l'IBAN, le BIC, le SIRET et de glisser du code dans le logo
 await req('/api/sync',prof({nom:'Ent Chef',tel:'0600000000',iban:'FR7611111111111111111111111',bic:'VOLEURXX',siret:'99999999900099',siren:'999999999',logo:'x" onerror="alert(1)'},t+1000),chef);
 v=await lire(patron);
 ok('chef : IBAN, BIC, SIRET et SIREN du patron conservés',v.iban==='FR7630006000011234567890189'&&v.bic==='AGRIFRPP'&&v.siret==='12345678900012'&&v.siren==='123456789',JSON.stringify([v.iban,v.bic,v.siret]));
 ok('chef : les autres champs passent (nom, téléphone)',v.nom==='Ent Chef'&&v.tel==='0600000000');
 ok('logo qui n’est pas une image : retiré par le serveur',!('logo' in v),String(v.logo));
 await pause(50);ok('tentative du chef : pas d’alerte IBAN (rien n’a changé)',envois.length===0,String(envois.length));

 await req('/api/sync',prof({nom:'Ent',logo:'data:image/svg+xml;base64,PHN2Zy8+'},t+2000),chef);
 ok('logo SVG refusé (peut contenir du code)',!('logo' in (await lire(patron))));
 await req('/api/sync',prof({nom:'Ent',logo:LOGO},t+3000),chef);
 v=await lire(patron);ok('logo image valide accepté ; IBAN toujours celui du patron',v.logo===LOGO&&v.iban==='FR7630006000011234567890189');

 // le patron change l'IBAN : accepté, et ses appareils sont prévenus
 await req('/api/sync',prof({nom:'Ent',iban:'FR7622222222222222222222222',bic:'AGRIFRPP',logo:LOGO},t+4000),patron);
 v=await lire(chef);await pause(50);
 ok('patron : nouvel IBAN accepté et reçu par l’équipe',v.iban==='FR7622222222222222222222222');
 ok('patron prévenu par notification',sub.status===200&&envois.length===1&&/IBAN/.test(envois[0].body),sub.status+' '+JSON.stringify(envois.map(e=>e.body)));
 await req('/api/sync',prof({nom:'Ent 2',iban:'FR76 2222 2222 2222 2222 2222 222',bic:'AGRIFRPP',logo:LOGO},t+5000),patron);
 await pause(50);ok('même IBAN écrit avec des espaces : pas de nouvelle alerte',envois.length===1,String(envois.length));
 await req('/api/sync',prof('pas un objet',t+6000),patron);
 ok('profil qui n’est pas un objet : ignoré',(await lire(patron)).nom==='Ent 2');

 S.server.close();console.log(R.join('\n'));fs.rmSync(tmp,{recursive:true,force:true});
 if(R.some(l=>l.startsWith('FAIL')))process.exit(1);
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

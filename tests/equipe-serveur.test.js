/* Mon équipe sur le serveur de l'entreprise : qui a rejoint, et ce que gagnent les collaborateurs n'est vu et écrit que par le patron.
   Lancer : node tests/equipe-serveur.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-equipe-'));
const S=createServer({dataDir:tmp,noTimers:true,pushSend:async()=>({status:201})});
function req(p,body,tok){return new Promise((res,ko)=>{const b=body?JSON.stringify(body):null;
 const r=http.request({host:'127.0.0.1',port:S.server.address().port,method:b?'POST':'GET',path:p,headers:Object.assign(b?{'content-type':'application/json'}:{},tok?{authorization:'Bearer '+tok}:{})},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j={};try{j=JSON.parse(d)}catch(e){}res({s:x.statusCode,j})})});
 r.on('error',ko);if(b)r.write(b);r.end()})}
const people=async tok=>((await req('/api/sync',{since:0,changes:{}},tok)).j.changes.people||[]);
(async()=>{
 await new Promise(r=>S.server.listen(0,'127.0.0.1',r));
 const patron=(await req('/api/setup',{user:'Marcos',password:'motdepasse1'})).j.token;
 /* invitation : le compte existe, mais la personne n'a pas encore rejoint */
 const inv=await req('/api/invite',{user:'Karim',role:'ouvrier'},patron);
 let U=(await req('/api/users',null,patron)).j;
 ok('invité : listé, pas encore « rejoint »',inv.s===200&&U.some(u=>u.name==='Karim'&&u.joined===false),JSON.stringify(U));
 ok('le patron est toujours « rejoint »',U.some(u=>u.name==='Marcos'&&u.joined===true));
 const karim=(await req('/api/join',{code:inv.j.code})).j.token;
 U=(await req('/api/users',null,patron)).j;
 ok('invitation utilisée : « rejoint »',!!karim&&U.some(u=>u.name==='Karim'&&u.joined===true),JSON.stringify(U));
 /* un chef (compte avec mot de passe) */
 await req('/api/users',{user:'Ali',password:'motdepasse2',role:'chef'},patron);
 const chef=(await req('/api/login',{user:'Ali',password:'motdepasse2'})).j.token;
 const t=Date.now()-60000;
 await req('/api/sync',{since:0,changes:{people:[
  {id:'pK',nom:'Karim',role:'ouvrier',tel:'0612345678',taux:15,pays:[{id:'x1',amt:300,d:'2026-11-18'}],updatedAt:t},
  {id:'pA',nom:'Ali',role:'chef',taux:22,pays:[{id:'x2',amt:500,d:'2026-11-18'}],updatedAt:t}]}},patron);
 let L=await people(patron);
 ok('patron : prix de l\'heure et paiements de chacun',L.find(p=>p.id==='pK').taux===15&&L.find(p=>p.id==='pA').pays.length===1);
 L=await people(chef);const pk=L.find(p=>p.id==='pK'),pa=L.find(p=>p.id==='pA');
 ok('chef : voit Karim sans son prix de l\'heure ni ses paiements',pk&&pk.tel==='0612345678'&&pk.taux===undefined&&pk.pays===undefined,JSON.stringify(pk));
 ok('chef : sa propre fiche entière',pa&&pa.taux===22&&pa.pays.length===1);
 L=await people(karim);
 ok('ouvrier : seulement sa fiche',L.length===1&&L[0].id==='pK'&&L[0].taux===15);
 /* le chef modifie la fiche de Karim (sans les champs qu'il ne reçoit pas) : rien n'est perdu */
 await req('/api/sync',{since:0,changes:{people:[{id:'pK',nom:'Karim',role:'ouvrier',tel:'0699999999',updatedAt:Date.now()}]}},chef);
 L=await people(patron);const k2=L.find(p=>p.id==='pK');
 ok('chef qui modifie Karim : le téléphone change, le prix de l\'heure et les paiements restent',k2.tel==='0699999999'&&k2.taux===15&&k2.pays.length===1,JSON.stringify(k2));
 await req('/api/sync',{since:0,changes:{people:[{id:'pK',nom:'Karim',role:'ouvrier',taux:99,pays:[],updatedAt:Date.now()+1000}]}},chef);
 L=await people(patron);
 ok('chef : ne peut pas changer le prix de l\'heure ni effacer les paiements',L.find(p=>p.id==='pK').taux===15&&L.find(p=>p.id==='pK').pays.length===1);
 await new Promise(r=>S.server.close(r));fs.rmSync(tmp,{recursive:true,force:true});
 console.log(R.join('\n'));const ko=R.filter(x=>x.startsWith('FAIL')).length;console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');process.exit(ko?1:0)
})().catch(e=>{console.error(e);process.exit(1)});

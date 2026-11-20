/* Abonnement contrôlé par le serveur dans l'espace d'une entreprise (relié au compte casô du patron) :
   sans le module Devis (essai fini, pas d'abonnement), 1 devis envoyé à signer par mois et pas de numéro de facture.
   Pendant l'essai, tout passe ; l'espace d'origine (racine) n'est pas concerné.
   Lancer : node tests/espace-abonnement.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const PNG='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-espabo-'));
const S=createServer({dataDir:dir,noTimers:true,pushSend:async()=>({status:201})});
function req(p,body,tok){return new Promise((res,ko)=>{const b=body?JSON.stringify(body):null;
 const r=http.request({host:'127.0.0.1',port:S.server.address().port,method:b?'POST':'GET',path:p,headers:Object.assign(b?{'content-type':'application/json'}:{},tok?{authorization:'Bearer '+tok}:{})},
  x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j={};try{j=JSON.parse(d)}catch(e){}res({s:x.statusCode,j})})});
 r.on('error',ko);if(b)r.write(b);r.end()})}
const devis=id=>({doc:{quote:{id,client:'Martin',num:'D-'+id,date:new Date().toISOString().slice(0,10),lines:[{label:'Carrelage',qty:1,pu:100,tva:10}]},prof:{nom:'Rosso',valid:30}},img:PNG,name:'Marcos'});
(async()=>{
 await new Promise(r=>S.server.listen(0,'127.0.0.1',r));
 const id='0123456789ab',x=S.espaceDe(id,true),tk=await x.patronJeton('Marcos'),tok=tk.token||tk,pre='/e/'+id;
 /* le compte casô du patron, relié à l'espace */
 const D=S.auth._d();D.comptes.c1={id:'c1',via:'mail',email:'marcos@rosso.fr',mode:'artisan',creeLe:Date.now()-40*864e5,essaiFin:Date.now()+5*864e5,espace:id};
 ok('pendant l\'essai : plusieurs devis envoyés à signer',(await req(pre+'/api/sign/new',devis('q1'),tok)).s===200&&(await req(pre+'/api/sign/new',devis('q2'),tok)).s===200);
 ok('pendant l\'essai : numéro de facture',(await req(pre+'/api/inv/next',{key:'F2026'},tok)).s===200);
 /* essai fini, pas d'abonnement */
 D.comptes.c1.essaiFin=Date.now()-864e5;
 const r3=await req(pre+'/api/sign/new',devis('q3'),tok);
 ok('sans le module Devis : déjà 2 devis ce mois-ci → refusé, avec le module à prendre',r3.s===403&&r3.j.module==='devis',JSON.stringify(r3));
 ok('le même devis (remplacé) peut repartir',(await req(pre+'/api/sign/new',devis('q1'),tok)).s===200);
 const f=await req(pre+'/api/inv/next',{key:'F2026'},tok);
 ok('sans le module Devis : pas de numéro de facture',f.s===403&&f.j.module==='devis',JSON.stringify(f));
 /* un autre espace, essai fini, aucun devis encore ce mois-ci : 1 gratuit */
 const id2='ba9876543210',y=S.espaceDe(id2,true),tk2=await y.patronJeton('Julie'),tok2=tk2.token||tk2;
 D.comptes.c2={id:'c2',via:'mail',email:'julie@autre.fr',mode:'artisan',creeLe:Date.now()-40*864e5,essaiFin:Date.now()-864e5,espace:id2};
 ok('socle gratuit : 1 devis par mois',(await req('/e/'+id2+'/api/sign/new',devis('a1'),tok2)).s===200&&(await req('/e/'+id2+'/api/sign/new',devis('a2'),tok2)).s===403);
 /* l'espace d'origine (sans compte relié) : inchangé */
 const p0=(await req('/api/setup',{user:'Ancien',password:'motdepasse1'})).j.token;
 ok('espace d\'origine : pas de contrôle',(await req('/api/sign/new',devis('z1'),p0)).s===200&&(await req('/api/sign/new',devis('z2'),p0)).s===200&&(await req('/api/inv/next',{key:'F2026'},p0)).s===200);
 await new Promise(r=>S.server.close(r));fs.rmSync(dir,{recursive:true,force:true});
 console.log(R.join('\n'));const ko=R.filter(x=>x.startsWith('FAIL')).length;console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');process.exit(ko?1:0)
})().catch(e=>{console.log(R.join('\n'));console.error(e);process.exit(1)});

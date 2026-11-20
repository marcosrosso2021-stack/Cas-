/* Prix en ligne pendant l'essai : 5 recherches, puis le module Fournisseurs (serveur/server.js, serveur/auth.js prixEssai).
   Lancer : node tests/prix-essai.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x!==undefined&&!c?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-prixessai-'));let T=Date.UTC(2026,10,20,9);let appels=0;
const prix={chercher:async()=>{appels++;return [200,[{produit:'Placo BA13',magasin:'X',prix:9.9}]]},image:async()=>[404,{}],reste:()=>300};
const monte=o=>new Promise(r=>{const s=createServer(Object.assign({noTimers:true,pushSend:async()=>({status:201})},o));s.server.listen(0,'127.0.0.1',()=>r(s.server))});
function req(srv,o){return new Promise((res,ko)=>{const body=o.body?JSON.stringify(o.body):null;
 const r=http.request({host:'127.0.0.1',port:srv.address().port,method:body?'POST':'GET',path:o.path,headers:Object.assign(body?{'content-type':'application/json'}:{},o.headers||{})},
  x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j=null;try{j=JSON.parse(d)}catch(e){}res({status:x.statusCode,body:d,json:j})})});
 r.on('error',ko);if(body)r.write(body);r.end()})}
(async()=>{
 const S=await monte({dataDir:tmp,prix,maintenant:()=>T,auth:{maintenant:()=>T}});
 let r=await req(S,{path:'/api/auth/mail/creer',body:{email:'a@b.fr',preuve:'a'.repeat(64),prenom:'A'}});const H={authorization:'Bearer '+r.json.jeton};
 await req(S,{path:'/api/auth/profil',headers:H,body:{mode:'artisan',nom:'A',siret:'55210055400013'}});
 const res=[];for(let i=0;i<6;i++){r=await req(S,{path:'/api/prix?q=placo'+i,headers:H});res.push(r.status)}
 ok('essai : 5 recherches acceptées',res.slice(0,5).every(s=>s===200),res.join(','));
 ok('6e recherche : refusée, module Fournisseurs, message d\'essai',res[5]===403&&r.json&&r.json.essai===true&&r.json.module==='fournisseurs'&&/5 recherches/.test(r.json.error),r.body);
 ok('la recherche refusée n\'a pas été faite',appels===5,appels);
 const r2=await req(S,{path:'/api/prix?q=placo'});
 ok('sans compte : pas concerné par la limite d\'essai',r2.status===200,r2.status);
 await new Promise(x=>S.close(x));fs.rmSync(tmp,{recursive:true,force:true});
 console.log(R.join('\n'));const n=R.filter(x=>x.startsWith('OK')).length;console.log('\n'+n+'/'+R.length+' contrôles réussis');process.exit(n===R.length?0:1);
})().catch(e=>{console.error(e);process.exit(1)});

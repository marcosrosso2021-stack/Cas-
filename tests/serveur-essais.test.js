/* Tests des limites d'essais du serveur casô (audit du 17 nov. 2026, points élevés).
   Lancer : node tests/serveur-essais.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
process.env.CASO_CLE_IA='cle-test';
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-essais-'));
let seq=0;
const neuf=o=>new Promise(r=>{const s=createServer(Object.assign({dataDir:path.join(tmp,'d'+(++seq)),noTimers:true,pushSend:async()=>({status:201})},o));s.server.listen(0,'127.0.0.1',()=>r(s.server))});
function req(srv,o){return new Promise((res,ko)=>{const body=o.body?JSON.stringify(o.body):null;
 const r=http.request({host:'127.0.0.1',port:srv.address().port,method:o.method||(body?'POST':'GET'),path:o.path,
  headers:Object.assign(body?{'content-type':'application/json'}:{},o.headers||{})},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res({status:x.statusCode,body:d}))});
 r.on('error',ko);if(body)r.write(body);r.end()})}
const compte=(a,c)=>a.filter(x=>x.status===c).length;
const H=ip=>({'x-forwarded-proto':'https','x-forwarded-for':ip});

(async()=>{
 /* ---- 1. connexion : la limite tient face à des requêtes envoyées en même temps ---- */
 let S=await neuf({hosted:true,setupCode:'abc'});
 let r=await req(S,{path:'/api/setup',headers:H('9.9.9.9'),body:{user:'Marcos',password:'motdepasse1',code:'abc'}});
 ok('compte patron créé',r.status===200,r.status);
 let a=await Promise.all(Array.from({length:60},()=>req(S,{path:'/api/login',headers:H('5.5.5.5'),body:{user:'Marcos',password:'faux'}})));
 ok('60 mauvais mots de passe en même temps : 10 étudiés au plus, les autres refusés (429)',compte(a,401)<=10&&compte(a,429)>=50,'401='+compte(a,401)+' 429='+compte(a,429));
 r=await req(S,{path:'/api/login',headers:H('5.5.5.5'),body:{user:'Marcos',password:'motdepasse1'}});
 ok('cette adresse reste bloquée, même avec le bon mot de passe',r.status===429,r.status);
 a=[];for(let i=0;i<15;i++)a.push(await req(S,{path:'/api/login',headers:H('6.6.6.6'),body:{user:'Marcos',password:'motdepasse1'}}));
 ok('15 connexions réussies de suite : aucune comptée comme essai',compte(a,200)===15,'200='+compte(a,200));
 a=await Promise.all(Array.from({length:30},()=>req(S,{path:'/api/login',headers:H('6.6.6.7'),body:{user:'Marcos',password:'motdepasse1'}})));
 ok('30 connexions réussies en même temps : au moins 10 passent, aucune erreur de mot de passe',compte(a,200)>=10&&compte(a,401)===0,'200='+compte(a,200)+' 429='+compte(a,429));
 S.close();

 /* ---- 1b. limite par compte, quelle que soit l'adresse ---- */
 S=await neuf({hosted:true,setupCode:'abc'});
 await req(S,{path:'/api/setup',headers:H('9.9.9.9'),body:{user:'Marcos',password:'motdepasse1',code:'abc'}});
 a=[];for(let i=0;i<24;i++)a.push(await req(S,{path:'/api/login',headers:H('7.7.'+i+'.1'),body:{user:'Marcos',password:'faux'+i}}));
 ok('24 adresses différentes sur le même compte : 20 essais puis blocage du compte',compte(a,401)===20&&compte(a,429)===4,'401='+compte(a,401)+' 429='+compte(a,429));
 r=await req(S,{path:'/api/login',headers:H('7.8.1.1'),body:{user:'inconnu',password:'x'}});
 ok('un autre identifiant n’est pas bloqué',r.status===401,r.status);
 S.close();

 /* ---- 1c. deux créations du compte patron en même temps ---- */
 S=await neuf({hosted:true,setupCode:'abc'});
 a=await Promise.all([1,2,3].map(i=>req(S,{path:'/api/setup',headers:H('9.9.9.'+i),body:{user:'Patron'+i,password:'motdepasse1',code:'abc'}})));
 ok('3 créations du compte patron en même temps : une seule réussit',compte(a,200)===1&&compte(a,409)===2,a.map(x=>x.status).join(','));
 S.close();

 /* ---- 2. clé du propriétaire sur /api/incompris ---- */
 S=await neuf({hosted:true});
 a=[];for(let i=0;i<12;i++)a.push(await req(S,{path:'/api/incompris',headers:Object.assign(H('4.4.4.4'),{'x-caso-cle':'essai'+i})}));
 ok('/api/incompris : 10 mauvaises clés puis blocage (429)',compte(a,404)===10&&compte(a,429)===2,'404='+compte(a,404)+' 429='+compte(a,429));
 r=await req(S,{path:'/api/incompris',headers:Object.assign(H('4.4.4.4'),{'x-caso-cle':'cle-test'})});
 ok('adresse bloquée : même la bonne clé est refusée',r.status===429,r.status);
 r=await req(S,{path:'/api/incompris',headers:Object.assign(H('4.4.4.5'),{'x-caso-cle':'cle-test'})});
 ok('bonne clé depuis une autre adresse : accès',r.status===200&&/"e"/.test(r.body),r.status);
 r=await req(S,{path:'/api/veille/etat',headers:Object.assign(H('4.4.4.6'),{'x-caso-cle':'cle-test'})});
 ok('/api/veille : la bonne clé ouvre toujours',r.status===200,r.status);
 r=await req(S,{path:'/api/veille/etat',headers:Object.assign(H('4.4.4.7'),{'x-caso-cle':'cle-tesT'})});
 ok('/api/veille : clé presque bonne refusée',r.status===404,r.status);
 r=await req(S,{path:'/api/incompris',headers:H('4.4.4.8')});
 ok('sans clé : introuvable',r.status===404,r.status);
 S.close();

 /* ---- 3. TRUST_CF : l'en-tête cf-connecting-ip n'est cru que derrière Cloudflare ---- */
 S=await neuf({trustCf:true,setupCode:'abc'});
 await req(S,{path:'/api/setup',headers:H('9.9.9.9'),body:{user:'Marcos',password:'motdepasse1',code:'abc'}});
 a=[];for(let i=0;i<14;i++)a.push(await req(S,{path:'/api/login',headers:Object.assign(H('8.8.8.8'),{'cf-connecting-ip':'1.2.3.'+i}),body:{user:'x'+i,password:'faux'}}));
 ok('sans Cloudflare devant : fausse adresse ignorée, la limite s’applique à la vraie',compte(a,401)===10&&compte(a,429)===4,'401='+compte(a,401)+' 429='+compte(a,429));
 a=[];for(let i=0;i<14;i++)a.push(await req(S,{path:'/api/login',headers:Object.assign(H('3.3.3.3, 173.245.48.5'),{'cf-connecting-ip':'1.2.4.'+i}),body:{user:'y'+i,password:'faux'}}));
 ok('via Cloudflare (IPv4) : l’adresse du visiteur donnée par Cloudflare est utilisée',compte(a,401)===14,'401='+compte(a,401)+' 429='+compte(a,429));
 a=[];for(let i=0;i<12;i++)a.push(await req(S,{path:'/api/login',headers:Object.assign(H('3.3.3.3, 2a06:98c1:50::ac40:1'),{'cf-connecting-ip':'1.2.5.'+i}),body:{user:'z'+i,password:'faux'}}));
 ok('via Cloudflare (IPv6) : reconnu aussi',compte(a,401)===12,'401='+compte(a,401));
 a=[];for(let i=0;i<12;i++)a.push(await req(S,{path:'/api/login',headers:Object.assign(H('3.3.3.3, 2a06:98c8::1'),{'cf-connecting-ip':'1.2.6.'+i}),body:{user:'w'+i,password:'faux'}}));
 ok('adresse IPv6 voisine mais hors Cloudflare : ignorée',compte(a,429)===2,'429='+compte(a,429));
 S.close();

 console.log(R.join('\n'));fs.rmSync(tmp,{recursive:true,force:true});
 if(R.some(l=>l.startsWith('FAIL')))process.exit(1);
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

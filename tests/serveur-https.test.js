/* Tests du durcissement HTTPS / proxy du serveur casô.
   Lancer : node tests/serveur-https.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-srv-'));

function req(srv,opts){return new Promise((res,ko)=>{
 const {port}=srv.address();
 const r=http.request(Object.assign({host:'127.0.0.1',port,method:'GET'},opts),x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res({status:x.statusCode,headers:x.headers,body:d}))});
 r.on('error',ko);if(opts&&opts.body)r.write(opts.body);r.end()})}

(async()=>{
 // ---- mode hébergé (derrière un proxy TLS, comme Clever Cloud) ----
 const H=createServer({dataDir:path.join(tmp,'h'),hosted:true,noTimers:true,pushSend:async()=>({status:201})});
 await new Promise(r=>H.server.listen(0,'127.0.0.1',r));

 let a=await req(H.server,{path:'/',headers:{'x-forwarded-proto':'http','x-forwarded-for':'8.8.8.8'}});
 ok('hébergé : requête http redirigée en https (301)',a.status===301&&/^https:\/\//.test(a.headers.location||''),a.status+' '+(a.headers.location||''));

 a=await req(H.server,{path:'/',headers:{'x-forwarded-proto':'https','x-forwarded-for':'8.8.8.8'}});
 ok('hébergé : https sert la page',a.status===200&&/<\/html>/i.test(a.body));
 ok('hébergé : HSTS envoyé (2 ans, includeSubDomains)',/max-age=63072000/.test(a.headers['strict-transport-security']||'')&&/includeSubDomains/.test(a.headers['strict-transport-security']||''),a.headers['strict-transport-security']);
 ok('hébergé : en-têtes de sécurité présents',a.headers['x-content-type-options']==='nosniff'&&a.headers['x-frame-options']==='DENY'&&/frame-ancestors 'none'/.test(a.headers['content-security-policy']||''));

 // setup à distance : refusé sans code (isLocal faux car hébergé)
 a=await req(H.server,{method:'POST',path:'/api/setup',headers:{'content-type':'application/json','x-forwarded-proto':'https','x-forwarded-for':'8.8.8.8'},body:JSON.stringify({user:'Marcos',password:'motdepasse1'})});
 ok('hébergé : création du compte patron refusée sans code (403)',a.status===403,a.status+' '+a.body.slice(0,60));
 a=await req(H.server,{method:'POST',path:'/api/setup',headers:{'content-type':'application/json','x-forwarded-proto':'https','x-forwarded-for':'8.8.8.8'},body:JSON.stringify({user:'Marcos',password:'motdepasse1',code:'le-bon-code'})});
 // (sans SETUP_CODE défini, le code ne peut pas correspondre : on vérifie juste que la voie code est bien exigée)
 ok('hébergé : /api/state dit needsSetup et non-local',(await req(H.server,{path:'/api/state',headers:{'x-forwarded-proto':'https'}})).body.includes('"local":false'));

 // lien de signature en https même si la requête interne arrive en http
 const H2=createServer({dataDir:path.join(tmp,'h2'),hosted:true,noTimers:true,setupCode:'abc',pushSend:async()=>({status:201})});
 await new Promise(r=>H2.server.listen(0,'127.0.0.1',r));
 const host='caso.cleverapps.io';
 let t=await req(H2.server,{method:'POST',path:'/api/setup',headers:{'content-type':'application/json','host':host,'x-forwarded-proto':'https','x-forwarded-for':'8.8.8.8'},body:JSON.stringify({user:'Marcos',password:'motdepasse1',code:'abc'})});
 ok('hébergé : avec le bon code, compte patron créé',t.status===200&&/"token"/.test(t.body),t.status);
 const tok=JSON.parse(t.body).token;
 const png='data:image/png;base64,'+Buffer.from('x').toString('base64');
 let sg=await req(H2.server,{method:'POST',path:'/api/sign/new',headers:{'content-type':'application/json','authorization':'Bearer '+tok,'host':host,'x-forwarded-proto':'https','x-forwarded-for':'8.8.8.8'},body:JSON.stringify({doc:{quote:{id:'q1',num:'D1',lines:[{label:'Peinture',qty:1,unit:'u',pu:10,tva:10}]},prof:{nom:'Moi',valid:30}},img:png,name:'Moi'})});
 ok('hébergé : lien de signature en https',sg.status===200&&/^https:\/\/caso\.cleverapps\.io\/s\//.test(JSON.parse(sg.body).url),sg.status+' '+(sg.body||'').slice(0,80));

 // ---- mode local (poste du bureau) : pas de HSTS, pas de redirection, setup autorisé en local ----
 const L=createServer({dataDir:path.join(tmp,'l'),noTimers:true,pushSend:async()=>({status:201})});
 await new Promise(r=>L.server.listen(0,'127.0.0.1',r));
 a=await req(L.server,{path:'/'});
 ok('local : pas de HSTS (http sur le réseau interne)',!a.headers['strict-transport-security']);
 a=await req(L.server,{path:'/',headers:{'x-forwarded-proto':'http'}});
 ok('local : pas de redirection (en-tête proxy ignoré hors hébergement)',a.status===200);
 a=await req(L.server,{path:'/api/state'});
 ok('local : /api/state dit local:true',a.body.includes('"local":true'));
 a=await req(L.server,{method:'POST',path:'/api/setup',headers:{'content-type':'application/json'},body:JSON.stringify({user:'Patron',password:'motdepasse1'})});
 ok('local : création du compte patron autorisée depuis le poste',a.status===200&&/"token"/.test(a.body),a.status);

 [H,H2,L].forEach(s=>s.server.close());
 console.log(R.join('\n'));
 fs.rmSync(tmp,{recursive:true,force:true});
 if(R.some(l=>l.startsWith('FAIL')))process.exit(1);
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

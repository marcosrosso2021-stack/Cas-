/* Tests de la déconnexion côté serveur (audit du 17 nov. 2026, point 8).
   Lancer : node tests/serveur-jetons.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-jetons-'));
const S=createServer({dataDir:tmp,noTimers:true,pushSend:async()=>({status:201})});
function req(p,body,tok){return new Promise((res,ko)=>{const b=body?JSON.stringify(body):null;
 const r=http.request({host:'127.0.0.1',port:S.server.address().port,method:b?'POST':'GET',path:p,headers:Object.assign(b?{'content-type':'application/json'}:{},tok?{authorization:'Bearer '+tok}:{})},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j=null;try{j=JSON.parse(d)}catch(e){}res({status:x.statusCode,j})})});
 r.on('error',ko);if(b)r.write(b);r.end()})}
const sync=tok=>req('/api/sync',{since:0,changes:{}},tok).then(r=>r.status);
const login=(u,p)=>req('/api/login',{user:u,password:p}).then(r=>r.j.token);

(async()=>{
 await new Promise(r=>S.server.listen(0,'127.0.0.1',r));
 const p1=(await req('/api/setup',{user:'Marcos',password:'motdepasse1'})).j.token;
 await req('/api/users',{user:'Karim',password:'motdepasse2',role:'chef'},p1);
 const p2=await login('Marcos','motdepasse1'),p3=await login('Marcos','motdepasse1'),k1=await login('Karim','motdepasse2');
 ok('trois appareils du patron et un du chef connectés',[await sync(p1),await sync(p2),await sync(p3),await sync(k1)].every(c=>c===200));

 let r=await req('/api/logout',{},p2);
 ok('déconnexion : acceptée',r.status===200&&r.j.n===1,JSON.stringify(r.j));
 ok('le jeton déconnecté ne marche plus',await sync(p2)===401);
 ok('les autres appareils restent connectés',await sync(p1)===200&&await sync(p3)===200&&await sync(k1)===200);
 r=await req('/api/logout',{},p2);
 ok('un jeton déjà déconnecté ne peut plus rien demander',r.status===401,r.status);
 r=await req('/api/logout',{});
 ok('sans jeton : refusé',r.status===401,r.status);

 r=await req('/api/logout',{all:true},p1);
 ok('« tous mes appareils » : les deux jetons restants du patron annulés',r.status===200&&r.j.n===2&&await sync(p1)===401&&await sync(p3)===401,JSON.stringify(r.j));
 ok('le chef n’est pas touché',await sync(k1)===200);
 const p4=await login('Marcos','motdepasse1');
 ok('le patron peut se reconnecter avec son mot de passe',await sync(p4)===200);

 // conservé après redémarrage : le jeton annulé ne revient pas
 S.server.close();
 const S2=createServer({dataDir:tmp,noTimers:true,pushSend:async()=>({status:201})});
 await new Promise(r=>S2.server.listen(0,'127.0.0.1',r));
 const again=tok=>new Promise(res=>{const b=JSON.stringify({since:0,changes:{}});const q=http.request({host:'127.0.0.1',port:S2.server.address().port,method:'POST',path:'/api/sync',headers:{'content-type':'application/json',authorization:'Bearer '+tok}},x=>{x.resume();res(x.statusCode)});q.write(b);q.end()});
 ok('après redémarrage du serveur : jeton annulé toujours refusé, jeton valide accepté',await again(p2)===401&&await again(p4)===200);
 S2.server.close();console.log(R.join('\n'));fs.rmSync(tmp,{recursive:true,force:true});
 if(R.some(l=>l.startsWith('FAIL')))process.exit(1);
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

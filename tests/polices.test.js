/* La police de l'appli (Inter, dossier fonts/) est servie par le serveur, gardée hors ligne, et autorisée sur les pages publiques.
   Lancer : node tests/polices.test.js */
'use strict';
const fs=require('fs'),os=require('os'),path=require('path'),http=require('http');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x!==undefined&&!c?'  ['+x+']':''));
const get=(port,url)=>new Promise((res,rej)=>http.get({host:'127.0.0.1',port,path:url,headers:{'x-forwarded-proto':'https','x-forwarded-for':'8.8.8.8'}},r=>{const b=[];r.on('data',d=>b.push(d));r.on('end',()=>res({status:r.statusCode,h:r.headers,body:Buffer.concat(b)}))}).on('error',rej));
(async()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-pol-'));
 const H=createServer({dataDir:tmp,hosted:true,noTimers:true,pushSend:async()=>({status:201})});
 await new Promise(r=>H.server.listen(0,'127.0.0.1',r));const port=H.server.address().port;
 for(const w of [400,500,600,700]){const r=await get(port,'/fonts/inter-'+w+'.woff');
  ok('police '+w+' servie (WOFF)',r.status===200&&r.h['content-type']==='font/woff'&&r.body.slice(0,4).toString()==='wOFF',r.status+' '+r.h['content-type'])}
 ok('rien d\'autre dans /fonts/',(await get(port,'/fonts/inter.LICENSE')).status!==200&&(await get(port,'/fonts/..%2Fpackage.json')).status!==200);
 const sw=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');
 ok('polices gardées hors ligne (sw.js)',/fonts\\\/inter-\\d\{3\}\\\.woff/.test(sw));
 const srv=fs.readFileSync(path.join(__dirname,'..','serveur','server.js'),'utf8');
 ok('pages publiques : police autorisée (font-src \'self\')',/CSP_PUB="[^"]*font-src 'self'/.test(srv));
 ok('licence de la police présente',fs.existsSync(path.join(__dirname,'..','fonts','inter.LICENSE')));
 for(const f of ['index.html','devis.html','lib/m3d.html','conditions.html','confidentialite.html','serveur/client.html','serveur/signer.html','serveur/facture.html','serveur/verif.html','serveur/veille.html'])
  ok(f+' : police Inter',/inter-400\.woff/.test(fs.readFileSync(path.join(__dirname,'..',f),'utf8')));
 await new Promise(r=>H.server.close(r));fs.rmSync(tmp,{recursive:true,force:true});
 console.log(R.join('\n'));const n=R.filter(x=>x.startsWith('OK')).length;console.log('\n'+n+'/'+R.length+' contrôles réussis');process.exit(n===R.length?0:1);
})();

/* Tests du serveur casô : apprentissage partagé du chat 3D et phrases incomprises.
   Lancer : node tests/ia-partage.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-ia-'));
function req(srv,opts){return new Promise((res,ko)=>{const {port}=srv.address();
 const r=http.request(Object.assign({host:'127.0.0.1',port,method:'GET'},opts),x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j=null;try{j=JSON.parse(d)}catch(e){}res({status:x.statusCode,body:j})})});
 r.on('error',ko);if(opts&&opts.body)r.write(opts.body);r.end()})}
const post=(S,p,b,ip)=>req(S,{path:p,method:'POST',headers:{'content-type':'application/json','x-forwarded-for':ip,'x-forwarded-proto':'https'},body:JSON.stringify(b)});
const ID='0123456789abcdef0123456789abcdef';
(async()=>{
 process.env.CASO_CLE_IA='cle-test';
 const S=createServer({dataDir:tmp,hosted:true,noTimers:true});await new Promise(r=>S.server.listen(0,'127.0.0.1',r));
 /* chat 3D : un mot appris par un seul usager n'est pas publié ; par deux, si */
 let a=await post(S.server,'/api/appris',{d:'3d',id:ID,syn:{'clic clac':'sofa','Dupont':'bed','rue 12':'bed'},col:{'vert sapin':'#1f4d3a','x':'rouge'}},'1.1.1.1');
 ok('3D : envoi accepté, seuls les mots valides comptent',a.status===200&&a.body.ok===2,JSON.stringify(a.body));
 a=await req(S.server,{path:'/api/appris?d=3d',headers:{'x-forwarded-proto':'https'}});
 ok('3D : un seul usager → rien de publié',a.status===200&&!Object.keys(a.body.sh.syn).length,JSON.stringify(a.body));
 await post(S.server,'/api/appris',{d:'3d',id:ID,syn:{'clic clac':'sofa'},col:{'vert sapin':'#1f4d3a'}},'2.2.2.2');
 a=await req(S.server,{path:'/api/appris?d=3d',headers:{'x-forwarded-proto':'https'}});
 ok('3D : deux usagers → publié',a.body.sh.syn['clic clac']&&a.body.sh.syn['clic clac'].sofa===2&&a.body.sh.col['vert sapin']['#1f4d3a']===2,JSON.stringify(a.body));
 ok('3D : nom propre et chiffres refusés',!a.body.sh.syn.Dupont&&!a.body.sh.syn['rue 12']);
 /* incompris : masqués, lisibles avec la clé, à partir de 3 usagers */
 a=await post(S.server,'/api/incompris',{id:ID,e:[{l:'fr',t:'mets le truc machin',s:'chat'},{l:'fr',t:'appelle Dupont au 0612'},{l:'xx',t:'abc def'}]},'3.3.3.3');
 ok('incompris : texte avec majuscules ou chiffres refusé',a.status===200&&a.body.ok===1,JSON.stringify(a.body));
 for(const ip of ['4.4.4.4','5.5.5.5'])await post(S.server,'/api/incompris',{id:ID,e:[{l:'fr',t:'mets le truc machin',s:'chat'},{l:'fr',t:'une autre phrase',s:'3d'}]},ip);
 a=await req(S.server,{path:'/api/incompris',headers:{'x-forwarded-proto':'https'}});
 ok('incompris : sans clé, rien (404)',a.status===404);
 a=await req(S.server,{path:'/api/incompris',headers:{'x-caso-cle':'cle-test','x-forwarded-proto':'https'}});
 const fr=(a.body&&a.body.e&&a.body.e.fr)||[];
 ok('incompris : avec la clé, seulement les phrases de 3 usagers ou plus',fr.length===1&&fr[0].t==='mets le truc machin'&&fr[0].n===3,JSON.stringify(fr));
 S.server.close();console.log(R.join('\n'));process.exit(R.some(x=>x.startsWith('FAIL'))?1:0);
})().catch(e=>{console.error(e);process.exit(1)});

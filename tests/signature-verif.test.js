/* Tests du serveur casô : signature enregistrée de l'artisan et page publique ouverte par le QR.
   Lancer : node tests/signature-verif.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-sig-'));
function req(srv,opts){return new Promise((res,ko)=>{const {port}=srv.address();
 const r=http.request(Object.assign({host:'127.0.0.1',port,method:'GET'},opts),x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j=null;try{j=JSON.parse(d)}catch(e){}res({status:x.statusCode,body:j,text:d,headers:x.headers})})});
 r.on('error',ko);if(opts&&opts.body)r.write(opts.body);r.end()})}
const H={'content-type':'application/json','x-forwarded-proto':'https','x-forwarded-for':'8.8.8.8'};
const post=(S,p,b,tok)=>req(S,{path:p,method:'POST',headers:Object.assign({},H,tok?{authorization:'Bearer '+tok}:{}),body:JSON.stringify(b)});
const get=(S,p)=>req(S,{path:p,headers:H});
/* même calcul que l'appli (sgIdOf) */
const AL='0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const idOf=h=>{const c=h.slice(0,16).match(/../g).map(x=>AL[parseInt(x,16)%32]);return 'CS-'+c.slice(0,4).join('')+'-'+c.slice(4,8).join('')+'-'+AL[c.reduce((s,x,i)=>s+AL.indexOf(x)*(i+1),0)%32]};
const PNG='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const reg=(seed,extra)=>{const hash=crypto.createHash('sha256').update(seed).digest('hex');
 return Object.assign({id:idOf(hash),hash,at:'2026-11-16T10:00:00.000Z',faceid:'cred-1',img:PNG,nom:'Marc Dupont',
  entreprise:{nom:'Dupont Rénovation',forme:'EI',siret:'732 829 320 00074',adresse:'12 rue des Lilas, 69003 Lyon',tel:'06 11 22 33 44',email:'contact@dupont.fr',rm:'RM 732 829 320',assur:'SMABTP n° 123456',iban:'FR76 SECRET'}},extra||{})};
(async()=>{
 process.env.SETUP_CODE='code-de-test-casô';
 const S=createServer({dataDir:tmp,hosted:true,noTimers:true});await new Promise(r=>S.server.listen(0,'127.0.0.1',r));
 let a=await post(S.server,'/api/setup',{user:'Marc',password:'motdepasse1',code:'code-de-test-casô'});
 const tok=a.body&&a.body.token;ok('compte créé',!!tok,JSON.stringify(a.body));
 const r1=reg('premiere');
 a=await post(S.server,'/api/sig/register',r1);ok('sans connexion : refusé',a.status===401,a.status);
 a=await post(S.server,'/api/sig/register',Object.assign({},r1,{id:'CS-AAAA-AAAA-A'}),tok);ok('identifiant qui ne correspond pas à l\'empreinte : refusé',a.status===400,a.status);
 a=await post(S.server,'/api/sig/register',Object.assign({},r1,{faceid:''}),tok);ok('sans Face ID : refusé',a.status===400,a.status);
 a=await post(S.server,'/api/sig/register',r1,tok);ok('enregistrement accepté, lien /v/ renvoyé',a.status===200&&/\/v\/CS-/.test(a.body.url),JSON.stringify(a.body));
 a=await get(S.server,'/api/v/'+r1.id);
 const v=a.body||{};
 ok('fiche publique : signataire, qualité, entreprise',a.status===200&&v.status==='active'&&v.signataire.nom==='Marc Dupont'&&v.signataire.qualite==='Dirigeant'&&v.entreprise.nom==='Dupont Rénovation'&&v.entreprise.siret==='73282932000074',JSON.stringify(v).slice(0,200));
 ok('fiche publique : rien de privé (IBAN, empreinte, clé, compte)',!JSON.stringify(v).includes('SECRET')&&!('hash' in v)&&!('pk' in v)&&!('user' in v)&&!('faceid' in v&&typeof v.faceid!=='boolean'));
 a=await get(S.server,'/v/'+r1.id);ok('page /v/ servie, non indexée, CSP stricte',a.status===200&&/Signature casô/.test(a.text)&&a.headers['x-robots-tag']==='noindex'&&/default-src 'none'/.test(a.headers['content-security-policy']||''));
 a=await get(S.server,'/api/v/CS-ZZZZ-ZZZZ-Z');ok('identifiant inconnu : 404',a.status===404);
 a=await get(S.server,'/api/v/..%2F..%2Fdata.json');ok('chemin piégé : refusé, aucune donnée',(a.status===404||a.status===401)&&!/users|tokens|sigreg/.test(a.text),a.status);
 const r2=reg('seconde');
 a=await post(S.server,'/api/sig/register',r2,tok);ok('nouvelle signature acceptée',a.status===200);
 a=await get(S.server,'/api/v/'+r1.id);ok('l\'ancienne passe en « remplacée » avec sa date',a.body.status==='remplacee'&&!!a.body.replacedAt,JSON.stringify(a.body&&a.body.status));
 a=await get(S.server,'/api/v/'+r2.id);ok('la nouvelle est active',a.body.status==='active');
 S.server.close();
 const S2=createServer({dataDir:tmp,hosted:true,noTimers:true});await new Promise(r=>S2.server.listen(0,'127.0.0.1',r));
 a=await get(S2.server,'/api/v/'+r2.id);ok('conservée après redémarrage du serveur',a.status===200&&a.body.status==='active');
 S2.server.close();console.log(R.join('\n'));process.exit(R.some(x=>x.startsWith('FAIL'))?1:0);
})().catch(e=>{console.error(e);process.exit(1)});

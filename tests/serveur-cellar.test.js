/* Tests de la copie des sauvegardes hors du serveur (Cellar de Clever Cloud, compatible S3).
   La signature est contrôlée contre les exemples publiés par Amazon ; l'envoi, contre un faux dépôt local
   qui refuse toute demande mal signée. Le vrai Cellar se vérifie une fois l'add-on lié.
   Lancer : node tests/serveur-cellar.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path'),crypto=require('crypto');
process.env.CASO_CLE_IA='cle-proprio-test';
const {createServer}=require('../serveur/server.js');
const SV=require('../serveur/sauvegarde.js'),{signer}=require('../serveur/s3.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-cellar-'));const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const CLE={keyId:'CLE-TEST',secret:'secret-de-test/abc+123'};

/* faux dépôt : garde les objets en mémoire, recalcule la signature et refuse si elle ne correspond pas */
const objets=new Map(),journal=[];let panne=false;
const depot=http.createServer((q,res)=>{const c=[];q.on('data',d=>c.push(d));q.on('end',()=>{
 const corps=Buffer.concat(c),u=new URL(q.url,'http://x'),a=q.headers.authorization||'';
 const m=/^AWS4-HMAC-SHA256 Credential=([^/]+)\/(\d{8})\/([^/]+)\/s3\/aws4_request,SignedHeaders=([^,]+),Signature=([0-9a-f]{64})$/.exec(a);
 const fin=(code,txt)=>{journal.push(q.method+' '+u.pathname+' '+code);res.writeHead(code,{'content-type':'application/xml'});res.end(txt||'')};
 if(panne)return fin(500,'<Error/>');
 if(!m||m[1]!==CLE.keyId)return fin(403,'<Error><Code>AccessDenied</Code></Error>');
 const entetes={};m[4].split(';').forEach(n=>{entetes[n]=q.headers[n]});
 const s=signer({methode:q.method,chemin:decodeURIComponent(u.pathname),query:u.search.slice(1),entetes,corpsSha:q.headers['x-amz-content-sha256'],keyId:CLE.keyId,secret:CLE.secret,region:m[3],date:q.headers['x-amz-date']});
 if(s.signature!==m[5]||sha(corps)!==q.headers['x-amz-content-sha256'])return fin(403,'<Error><Code>SignatureDoesNotMatch</Code></Error>');
 const cle=decodeURIComponent(u.pathname).replace(/^\/[^/]+\/?/,'');
 if(q.method==='PUT'){objets.set(cle,corps);return fin(200)}
 if(q.method==='DELETE'){const e=objets.delete(cle);return fin(e?204:404)}
 if(q.method==='GET'&&cle){const o=objets.get(cle);journal.push('GET '+u.pathname+' '+(o?200:404));res.writeHead(o?200:404);return res.end(o||'')}
 if(q.method==='GET'&&!cle){const p=u.searchParams.get('prefix')||'';return fin(200,'<ListBucketResult>'+[...objets.keys()].filter(k=>k.startsWith(p)).map(k=>'<Contents><Key>'+k+'</Key></Contents>').join('')+'</ListBucketResult>')}
 fin(404)})});
const neuf=o=>new Promise(r=>{const s=createServer(Object.assign({noTimers:true,pushSend:async()=>({status:201})},o));s.server.listen(0,'127.0.0.1',()=>r(s))});
function req(S,p,body,h){return new Promise((res,ko)=>{const b=body?JSON.stringify(body):null;
 const r=http.request({host:'127.0.0.1',port:S.server.address().port,method:b?'POST':'GET',path:p,headers:Object.assign(b?{'content-type':'application/json'}:{},h||{})},x=>{const c=[];x.on('data',d=>c.push(d));x.on('end',()=>{let j=null;try{j=JSON.parse(Buffer.concat(c).toString())}catch(e){}res({status:x.statusCode,j})})});
 r.on('error',ko);if(b)r.write(b);r.end()})}

(async()=>{
 /* ---- signature : exemples publiés par Amazon (Signature Version 4) ---- */
 const K={keyId:'AKIAIOSFODNN7EXAMPLE',secret:'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',region:'us-east-1',date:'20130524T000000Z'},vide=sha('');
 let s=signer(Object.assign({methode:'GET',chemin:'/test.txt',entetes:{host:'examplebucket.s3.amazonaws.com',range:'bytes=0-9','x-amz-content-sha256':vide,'x-amz-date':K.date},corpsSha:vide},K));
 ok('signature : exemple « lire un objet »',s.signature==='f0e8bdb87c964420e857bd35b5d6ed310bd44f0170aba48dd91039c6036bdb41');
 const b=sha('Welcome to Amazon S3.');
 s=signer(Object.assign({methode:'PUT',chemin:'/test$file.text',entetes:{date:'Fri, 24 May 2013 00:00:00 GMT',host:'examplebucket.s3.amazonaws.com','x-amz-content-sha256':b,'x-amz-date':K.date,'x-amz-storage-class':'REDUCED_REDUNDANCY'},corpsSha:b},K));
 ok('signature : exemple « envoyer un objet »',s.signature==='98ad721746da40c64f1a55b78f14c238d841ea1380cd77a1b5971af0ece108bd');
 s=signer(Object.assign({methode:'GET',chemin:'/',query:'max-keys=2&prefix=J',entetes:{host:'examplebucket.s3.amazonaws.com','x-amz-content-sha256':vide,'x-amz-date':K.date},corpsSha:vide},K));
 ok('signature : exemple « lister »',s.signature==='34b48302e7b5fa45bde8084f4b7868a86f0a534bc59db6670ed5711ef69dc6f7');

 await new Promise(r=>depot.listen(0,'127.0.0.1',r));
 const S3=Object.assign({url:'http://127.0.0.1:'+depot.address().port,bucket:'caso-sauvegardes'},CLE);

 /* ---- envoi après chaque sauvegarde ---- */
 let d=path.join(tmp,'a'),S=await neuf({dataDir:d,cleSauvegarde:'phrase de test',s3:S3});
 await req(S,'/api/setup',{user:'Marcos',password:'motdepasse1'});
 const s1=await S.sauvegarder(true);
 const recu=objets.get('sauvegardes/'+s1.nom);
 ok('la sauvegarde chiffrée arrive dans le dépôt, octet pour octet',!!recu&&recu.equals(fs.readFileSync(s1.chemin)),journal.join(' | '));
 ok('ce qui est envoyé est illisible sans la phrase, lisible avec',!/Marcos/.test(recu.toString('latin1'))&&(()=>{const f=path.join(tmp,'r.caso');fs.writeFileSync(f,recu);return SV.verifier(f,{cle:'phrase de test'}).ok})());
 let r=await req(S,'/api/proprio/sauvegardes',null,{'x-caso-cle':'cle-proprio-test'});
 ok('le propriétaire voit que la copie est partie',r.j.distant.actif===true&&r.j.distant.dernier===s1.nom&&r.j.distant.erreur===null,JSON.stringify(r.j.distant));
 const n0=journal.length;await S.sauvegarder();
 ok('pas de second envoi de la même sauvegarde',journal.length===n0);

 /* ---- dépôt en panne : la sauvegarde locale est faite, l'envoi est rejoué ---- */
 panne=true;await new Promise(x=>setTimeout(x,1100));const s2=await S.sauvegarder(true);
 ok('dépôt en panne : sauvegarde locale faite quand même, erreur notée',!!s2&&!objets.has('sauvegardes/'+s2.nom)&&/500/.test(S.distant().erreur||''),S.distant().erreur);
 panne=false;await S.sauvegarder();
 ok('dépôt revenu : l’envoi est rejoué tout seul',objets.has('sauvegardes/'+s2.nom)&&S.distant().erreur===null);
 S.server.close();

 /* ---- mauvaise clé du dépôt : refus, rien n'est envoyé ---- */
 d=path.join(tmp,'b');S=await neuf({dataDir:d,cleSauvegarde:'phrase de test',s3:Object.assign({},S3,{secret:'mauvais'})});
 await req(S,'/api/setup',{user:'Marcos',password:'motdepasse1'});const avant=objets.size;await S.sauvegarder(true);
 ok('mauvaise clé du dépôt : refusé (403), rien d’écrit',objets.size===avant&&/403/.test(S.distant().erreur||''),S.distant().erreur);
 S.server.close();

 /* ---- sans phrase secrète : rien ne part ---- */
 d=path.join(tmp,'c');S=await neuf({dataDir:d,cleSauvegarde:'',s3:S3});
 await req(S,'/api/setup',{user:'Marcos',password:'motdepasse1'});const n1=journal.length,s3c=await S.sauvegarder(true);
 ok('sauvegarde en clair : jamais envoyée hors du serveur',!!s3c&&s3c.chiffre===false&&journal.length===n1&&S.distant().actif===false);
 S.server.close();

 /* ---- rotation : ce qui est supprimé ici l'est aussi dans le dépôt ---- */
 d=path.join(tmp,'e');fs.mkdirSync(d);fs.writeFileSync(path.join(d,'data.json'),'{"rev":1,"users":{}}');
 const vieux=[];for(let j=20;j>=1;j--){const x=await SV.creer(d,{cle:'phrase de test',date:new Date(Date.now()-j*864e5)});vieux.push(x.nom);objets.set('sauvegardes/'+x.nom,Buffer.from('x'))}
 fs.writeFileSync(path.join(SV.dossier(d),'.envoyees'),JSON.stringify(vieux));
 S=await neuf({dataDir:d,cleSauvegarde:'phrase de test',s3:S3});const s4=await S.sauvegarder(true);
 const locaux=SV.lister(d).map(x=>x.nom),distants=[...objets.keys()].filter(k=>vieux.concat(s4.nom).includes(k.slice(12))).map(k=>k.slice(12));
 ok('rotation : le dépôt garde les mêmes sauvegardes que le serveur',locaux.length>=14&&locaux.every(n=>distants.includes(n))&&distants.every(n=>locaux.includes(n)),locaux.length+' ici, '+distants.length+' dans le dépôt');
 S.server.close();

 /* ---- stockage du serveur perdu : la sauvegarde revient du dépôt, puis le serveur démarre dessus ---- */
 const {rapatrier}=require('../serveur/server.js');
 d=path.join(tmp,'neuf');                                                    // dossier de données vide, comme un stockage neuf
 const rap=await rapatrier({dataDir:d,s3:S3,restaurer:s2.nom});
 ok('stockage perdu : la sauvegarde demandée est rapportée depuis le dépôt',rap===s2.nom&&fs.existsSync(path.join(SV.dossier(d),s2.nom)));
 S=await neuf({dataDir:d,cleSauvegarde:'phrase de test',s3:S3,restaurer:s2.nom});
 r=await req(S,'/api/state');
 ok('le serveur redémarre sur ces données (le compte patron existe de nouveau)',r.status===200&&r.j.needsSetup===false,JSON.stringify(r.j).slice(0,80));
 S.server.close();
 ok('rien à rapporter si la sauvegarde est déjà là, ou sans dépôt',(await rapatrier({dataDir:d,s3:S3,restaurer:s2.nom}))===null&&(await rapatrier({dataDir:path.join(tmp,'z'),s3:null,restaurer:'derniere'}))===null);
 depot.close();

 console.log(R.join('\n'));fs.rmSync(tmp,{recursive:true,force:true});
 if(R.some(l=>l.startsWith('FAIL')))process.exit(1);
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

/* Tests des sauvegardes du serveur casô (Security Hardening V2, lot 1) :
   sauvegarde chiffrée, détection d'un fichier abîmé, rotation, restauration après corruption (essai 10),
   arrêt brutal pendant une écriture (essai 4), routes du propriétaire.
   Lancer : node tests/serveur-sauvegarde.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path'),{spawn}=require('child_process');
process.env.CASO_CLE_IA='cle-proprio-test';
const {createServer}=require('../serveur/server.js');
const SV=require('../serveur/sauvegarde.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-sauv-'));const pause=ms=>new Promise(r=>setTimeout(r,ms));
const PHRASE='phrase secrète de test 2026';
const neuf=o=>new Promise(r=>{const s=createServer(Object.assign({noTimers:true,pushSend:async()=>({status:201})},o));s.server.listen(0,'127.0.0.1',()=>r(s))});
function req(S,p,body,h){return new Promise((res,ko)=>{const b=body?JSON.stringify(body):null;
 const r=http.request({host:'127.0.0.1',port:S.server.address().port,method:(h&&h.method)||(b?'POST':'GET'),path:p,headers:Object.assign(b?{'content-type':'application/json'}:{},h&&h.headers||{})},x=>{const c=[];x.on('data',d=>c.push(d));x.on('end',()=>{const buf=Buffer.concat(c);let j=null;try{j=JSON.parse(buf.toString())}catch(e){}res({status:x.statusCode,j,buf,headers:x.headers})})});
 r.on('error',ko);if(b)r.write(b);r.end()})}
const tk=t=>({headers:{authorization:'Bearer '+t}});
const cli=(id,nom)=>({since:0,changes:{clients:[{id,nom,updatedAt:Date.now()}]}});
const essaie=f=>{try{f();return null}catch(e){return e.code||e.message}};

(async()=>{
 /* ---- sauvegarde chiffrée ---- */
 let d=path.join(tmp,'a'),S=await neuf({dataDir:d,cleSauvegarde:PHRASE});
 const tok=(await req(S,'/api/setup',{user:'Marcos',password:'motdepasse1'})).j.token;
 await req(S,'/api/sync',cli('c1','Client Sauvegarde Secret'),tk(tok));
 fs.writeFileSync(path.join(d,'comptes.json'),JSON.stringify({comptes:{x:{email:'secret@test.fr'}}}));
 let s1=await S.sauvegarder(true);
 ok('sauvegarde créée, chiffrée, au bon nom',!!s1&&s1.chiffre===true&&SV.NOM.test(s1.nom)&&s1.fichiers.includes('espaces/e1/data.json')&&!s1.fichiers.includes('data.json')&&s1.fichiers.includes('comptes.json'),s1&&s1.nom);
 const brut=fs.readFileSync(s1.chemin);
 ok('rien de lisible dans le fichier (client, e-mail, identifiant)',!/Client Sauvegarde Secret|secret@test\.fr|Marcos/.test(brut.toString('latin1')));
 let v=essaie(()=>{const r=SV.verifier(s1.chemin,{cle:PHRASE});if(!r.ok||r.fichiers.length!==2)throw new Error('contenu')});
 ok('avec la phrase secrète : sauvegarde lisible et complète',v===null,String(v));
 ok('sans la phrase : refusée',essaie(()=>SV.lire(s1.chemin,{}))==='cle');
 ok('mauvaise phrase : refusée',essaie(()=>SV.lire(s1.chemin,{cle:'autre phrase'}))==='cle');
 const ab=Buffer.from(brut);ab[ab.length-40]^=1;const fa=path.join(tmp,'abime.caso');fs.writeFileSync(fa,ab);
 ok('un seul octet changé : sauvegarde refusée',essaie(()=>SV.lire(fa,{cle:PHRASE}))==='cle');
 const te=Buffer.from(brut),i=te.indexOf('"le":"')+7;te[i]=te[i]===0x32?0x33:0x32;fs.writeFileSync(fa,te);
 ok('en-tête modifié (date) : sauvegarde refusée',essaie(()=>SV.lire(fa,{cle:PHRASE}))==='cle');
 ok('pas de nouvelle sauvegarde avant 20 h',(await S.sauvegarder())===null&&SV.lister(d).length===1);

 /* ---- routes du propriétaire ---- */
 const P={headers:{'x-caso-cle':'cle-proprio-test'}};
 let r=await req(S,'/api/proprio/sauvegardes');
 ok('liste sans la clé du propriétaire : introuvable',r.status===404);
 r=await req(S,'/api/proprio/sauvegardes',null,P);
 ok('liste avec la clé',r.status===200&&r.j.chiffrement===true&&r.j.sauvegardes.length===1&&r.j.sauvegardes[0].chiffre===true&&!('chemin' in r.j.sauvegardes[0]),JSON.stringify(r.j).slice(0,90));
 r=await req(S,'/api/proprio/sauvegarde/'+s1.nom,null,P);
 ok('téléchargement : le même fichier, octet pour octet',r.status===200&&r.buf.equals(brut)&&/attachment/.test(r.headers['content-disposition']||''));
 r=await req(S,'/api/proprio/sauvegarde/derniere',null,P);ok('« derniere » rend la plus récente',r.status===200&&r.buf.equals(brut));
 r=await req(S,'/api/proprio/sauvegarde/'+encodeURIComponent('../data.json'),null,P);ok('nom hors du dossier : refusé',r.status===404,String(r.status));
 await pause(1100);r=await req(S,'/api/proprio/sauvegardes',null,{method:'POST',headers:P.headers});
 ok('création à la demande',r.status===200&&r.j.chiffre===true&&SV.lister(d).length===2,JSON.stringify(r.j));

 /* ---- essai 10 : restauration après corruption ---- */
 await req(S,'/api/sync',cli('c2','Après la sauvegarde'),tk(tok));
 S.server.close();await S.flush();
 fs.writeFileSync(path.join(d,'espaces','e1','data.json'),'{"rev":12,"users":{"marc');            // fichier abîmé
 let e=essaie(()=>createServer({dataDir:d,noTimers:true}));
 ok('fichier de données abîmé : le serveur refuse de démarrer, sans rien écraser',/illisible/.test(String(e)),String(e).slice(0,60));
 const mis=fs.readdirSync(path.join(d,'espaces','e1')).filter(n=>/^data\.json\.illisible-/.test(n));ok('le fichier abîmé est mis de côté',mis.length===1);
 const der=SV.trouver(d,'derniere');const rr=SV.restaurer(der.chemin,d,{cle:PHRASE});
 ok('restauration de la dernière sauvegarde',rr.fichiers.includes('espaces/e1/data.json')&&fs.existsSync(rr.avant));
 S=await neuf({dataDir:d,cleSauvegarde:PHRASE});
 r=await req(S,'/api/sync',{since:0,changes:{}},tk(tok));
 ok('le serveur redémarre avec les données de la sauvegarde (connexion comprise)',r.status===200&&(r.j.changes.clients||[]).some(c=>c.nom==='Client Sauvegarde Secret'));
 ok('ce qui a été écrit après la sauvegarde est perdu (limite connue : une sauvegarde par jour)',!(r.j.changes.clients||[]).some(c=>c.nom==='Après la sauvegarde'));
 ok('sans la phrase secrète, pas de restauration',essaie(()=>SV.restaurer(der.chemin,path.join(tmp,'x'),{}))==='cle'&&!fs.existsSync(path.join(tmp,'x','data.json')));
 S.server.close();await S.flush();

 /* ---- restauration demandée au démarrage (variable RESTAURER) ---- */
 d=path.join(tmp,'b');S=await neuf({dataDir:d,cleSauvegarde:PHRASE});
 const t2=(await req(S,'/api/setup',{user:'Marcos',password:'motdepasse1'})).j.token;
 await req(S,'/api/sync',cli('r1','Dans la sauvegarde'),tk(t2));const sb=await S.sauvegarder(true);
 await req(S,'/api/sync',cli('r2','Erreur à annuler'),tk(t2));S.server.close();await S.flush();
 S=await neuf({dataDir:d,cleSauvegarde:PHRASE,restaurer:'derniere'});
 r=await req(S,'/api/sync',{since:0,changes:{}},tk(t2));let noms=(r.j.changes.clients||[]).map(c=>c.nom).join(',');
 ok('RESTAURER=derniere : le serveur démarre sur la sauvegarde',noms==='Dans la sauvegarde',noms);
 ok('les fichiers d’avant sont gardés à côté',fs.readdirSync(d).some(n=>/^avant-restauration-/.test(n)));
 await req(S,'/api/sync',cli('r3','Nouveau travail'),tk(t2));S.server.close();await S.flush();
 S=await neuf({dataDir:d,cleSauvegarde:PHRASE,restaurer:'derniere'});               // variable oubliée en place
 r=await req(S,'/api/sync',{since:0,changes:{}},tk(t2));noms=(r.j.changes.clients||[]).map(c=>c.nom).sort().join(',');
 ok('variable laissée en place : la restauration n’est pas rejouée, le nouveau travail reste',/Nouveau travail/.test(noms),noms);
 S.server.close();await S.flush();
 ok('sauvegarde demandée introuvable : le serveur refuse de démarrer',/introuvable/.test(String(essaie(()=>createServer({dataDir:d,noTimers:true,restaurer:'2020-01-01T00-00-00Z.caso'})))));
 ok('mauvaise phrase au démarrage : rien n’est touché',essaie(()=>createServer({dataDir:d,noTimers:true,cleSauvegarde:'fausse',restaurer:sb.nom}))==='cle'&&fs.existsSync(path.join(d,'espaces','e1','data.json')));

 /* ---- sans phrase secrète : sauvegarde locale en clair, jamais téléchargeable ---- */
 d=path.join(tmp,'c');S=await neuf({dataDir:d,cleSauvegarde:''});
 await req(S,'/api/setup',{user:'Marcos',password:'motdepasse1'});const sc=await S.sauvegarder(true);
 ok('sans phrase secrète : sauvegarde locale non chiffrée',!!sc&&sc.chiffre===false&&SV.verifier(sc.chemin,{}).ok);
 r=await req(S,'/api/proprio/sauvegarde/'+sc.nom,null,P);
 ok('une sauvegarde en clair ne sort pas du serveur',r.status===409,String(r.status));
 S.server.close();

 /* ---- espaces : chaque espace est sauvegardé ; l'ancien data.json de la racine ne l'est plus ; une sauvegarde d'avant se restaure encore ---- */
 d=path.join(tmp,'esp');fs.mkdirSync(path.join(d,'espaces','e1'),{recursive:true});fs.mkdirSync(path.join(d,'espaces','e2'),{recursive:true});fs.mkdirSync(path.join(d,'espaces','..x'),{recursive:true});
 fs.writeFileSync(path.join(d,'data.json'),'{"rev":1,"vieux":1}');fs.writeFileSync(path.join(d,'espaces','e1','data.json'),'{"rev":5,"qui":"e1"}');fs.writeFileSync(path.join(d,'espaces','e2','data.json'),'{"rev":7,"qui":"e2"}');
 const se=await SV.creer(d,{cle:PHRASE});
 ok('deux espaces : les deux sont dans la sauvegarde, pas la vieille copie de la racine',se.fichiers.join()==='espaces/e1/data.json,espaces/e2/data.json',se.fichiers.join());
 fs.writeFileSync(path.join(d,'espaces','e1','data.json'),'{"rev":9,"qui":"abime"}');fs.mkdirSync(path.join(d,'espaces','e3'));fs.writeFileSync(path.join(d,'espaces','e3','data.json'),'{"rev":1,"qui":"e3"}');
 const re=SV.restaurer(se.chemin,d,{cle:PHRASE}),lisj=(...p)=>JSON.parse(fs.readFileSync(path.join(...p),'utf8'));
 ok('restauration : chaque espace retrouve son fichier, sans mélange',lisj(d,'espaces','e1','data.json').qui==='e1'&&lisj(d,'espaces','e2','data.json').qui==='e2'&&lisj(d,'data.json').vieux===1);
 ok('ce qui était en place est rangé à côté, espace par espace',lisj(re.avant,'espaces','e1','data.json').qui==='abime'&&lisj(re.avant,'espaces','e3','data.json').qui==='e3'&&!fs.existsSync(path.join(d,'espaces','e3','data.json')));
 d=path.join(tmp,'vieux');fs.mkdirSync(d);fs.writeFileSync(path.join(d,'data.json'),JSON.stringify({rev:3,counter:0,users:{},tokens:{},invites:{},recs:{clients:{c9:{id:'c9',nom:'Ancien rangement',updatedAt:1,rev:3}}},tombs:[]}));
 const sv0=await SV.creer(d,{cle:PHRASE});                                         // sauvegarde faite avant les espaces
 ok('sauvegarde d’avant les espaces : elle contient data.json',sv0.fichiers.join()==='data.json');
 S=await neuf({dataDir:d,cleSauvegarde:PHRASE});S.data().recs.clients.c9.nom='Modifié depuis';await S.persist();S.server.close();await S.flush();
 await pause(1200);S=await neuf({dataDir:d,cleSauvegarde:PHRASE,restaurer:sv0.nom});
 ok('elle se restaure encore : le serveur repart sur ses données',S.data().recs.clients.c9.nom==='Ancien rangement',S.data().recs.clients.c9&&S.data().recs.clients.c9.nom);
 S.server.close();await S.flush();

 /* ---- rotation ---- */
 d=path.join(tmp,'r');fs.mkdirSync(d);fs.writeFileSync(path.join(d,'data.json'),'{"rev":1}');
 for(let j=0;j<70;j++)await SV.creer(d,{date:new Date(Date.UTC(2026,10,17,3,0,0)-j*864e5)});
 const suppr=SV.elaguer(d,{jours:14,mois:6}),reste=SV.lister(d).map(x=>x.nom);
 ok('rotation : 14 jours gardés, plus la dernière de chaque mois',reste.length===16&&reste[0].startsWith('2026-11-17')&&reste.includes('2026-10-31T03-00-00Z.caso')&&reste.includes('2026-09-30T03-00-00Z.caso')&&suppr.length===54,reste.length+' gardées, '+suppr.length+' supprimées');

 /* ---- essai 4 : arrêt brutal du serveur pendant une écriture ---- */
 d=path.join(tmp,'k');let valides=0,lus=0,tours=6;
 const enfant=`const {createServer}=require(${JSON.stringify(path.join(__dirname,'..','serveur','server.js'))});
  const s=createServer({dataDir:${JSON.stringify(d)},noTimers:true});const D=s.data();D.recs.clients=D.recs.clients||{};let n=0;
  const gros='x'.repeat(200000);(function f(){for(let i=0;i<40;i++)D.recs.clients['c'+(n++)]={id:'c'+n,nom:gros,updatedAt:Date.now()};D.rev=n;
   s.persist().then(()=>{process.stdout.write('.');setImmediate(f)})})();`;
 for(let t=0;t<tours;t++){
  const c=spawn(process.execPath,['-e',enfant],{stdio:['ignore','pipe','ignore']});let ecrits=0;c.stdout.on('data',x=>{ecrits+=x.length});
  await pause(250+t*130);c.kill('SIGKILL');await new Promise(r=>c.on('exit',r));
  let lis=null;try{lis=JSON.parse(fs.readFileSync(path.join(d,'espaces','e1','data.json'),'utf8'))}catch(e){lis=fs.existsSync(path.join(d,'espaces','e1','data.json'))?null:'absent'}
  if(lis&&lis!=='absent')lus++;if(lis&&(lis==='absent'||typeof lis.rev==='number'))valides++}
 ok('serveur tué '+tours+' fois en pleine écriture : le fichier de données reste toujours entier',valides===tours&&lus>=tours-1,valides+'/'+tours+', '+lus+' fichiers relus');
 e=essaie(()=>{const s=createServer({dataDir:d,noTimers:true});if(typeof s.data().rev!=='number')throw new Error('rev')});
 ok('après ces arrêts brutaux, le serveur redémarre sur un fichier lisible',e===null,String(e));

 console.log(R.join('\n'));fs.rmSync(tmp,{recursive:true,force:true});
 if(R.some(l=>l.startsWith('FAIL')))process.exit(1);
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

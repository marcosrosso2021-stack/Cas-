/* casô collaborateur : plusieurs entreprises sur le même serveur casô (navigateur, vrai serveur).
   Un patron (compte casô) invite un collaborateur : son espace d'équipe est créé tout seul (/e/<espace>/) ; le collaborateur rejoint
   de n'importe où par le lien, voit son pointage, son planning, ses heures et ses paiements ; deux entreprises ne se voient pas.
   Lancer : node tests/espaces.test.js   (demande playwright ; démarre son propre serveur casô) */
'use strict';
const os=require('os'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const {createServer}=require('../serveur/server.js');
const mailLib=require('../serveur/mail.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-esp-'));
(async()=>{
 const envois=[],KEY='k'.repeat(32);
 const S=createServer({dataDir:dir,noTimers:true,mailjetCle:KEY,mailReponses:'reponses.rosso.fr',pushSend:async()=>({status:201}),mail:{pret:()=>true,html:mailLib.html,envoyer:async m=>{envois.push(m);return{id:'m'}}}});
 await new Promise(r=>S.server.listen(0,'127.0.0.1',r));const B='http://127.0.0.1:'+S.server.address().port;
 const br=await chromium.launch(),errs=[];
 async function tel(url){const c=await br.newContext({viewport:{width:390,height:844},locale:'fr-FR'}),p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(b=>{window.CASO_AUTH_SRV=b;window.CASO_APPRIS=b;localStorage.setItem('caso_test','1')},B);
  await p.goto(url);await p.waitForFunction(()=>typeof eqChat==='function'&&!document.body.classList.contains('starting'),null,{timeout:30000});return p}
 /* 1. le patron : compte casô, puis il invite Karim */
 const pa=await tel(B+'/');
 await pa.evaluate(async()=>{await accountCreate({prenom:'Marcos',email:'marcos@rosso.fr',pass:'motdepasse1',ent:'Rosso Rénovation',co:false,cgu:true})});
 await pa.waitForFunction(()=>CasoAuth.connecte(),null,{timeout:15000});
 await pa.evaluate(()=>{db.prof=Object.assign({},db.prof,{nom:'Rosso Rénovation'});db.profAt=Date.now();db.people.push({id:'pk',nom:'Karim',role:'ouvrier'});save()});
 const c1=await pa.evaluate(async()=>{const c=await eqInviter('pk');return{lien:c&&c.url,sync:getSync()}});
 ok('première invitation : l\'espace d\'équipe du patron est créé tout seul (/e/<espace>)',/\/e\/[a-f0-9]{12}$/.test(c1.sync.url)&&c1.sync.role==='patron',JSON.stringify(c1.sync.url));
 ok('le lien d\'invitation mène à cet espace',/\/e\/[a-f0-9]{12}\/\?join=[a-f0-9]{16}$/.test(c1.lien||''),c1.lien);
 const esp=c1.sync.url.match(/[a-f0-9]{12}/)[0];
 const compte=JSON.parse(fs.readFileSync(path.join(dir,'comptes.json'),'utf8'));
 ok('l\'espace est lié au compte casô du patron',Object.values(compte.comptes).some(c=>c.email==='marcos@rosso.fr'&&c.espace===esp));
 const c2=await pa.evaluate(async()=>{const s0=getSync();setSync({});await eqEspace();return getSync().url===s0.url});
 ok('le même compte retrouve toujours le même espace',c2);
 /* rendez-vous de Karim et paiement */
 await pa.evaluate(()=>{const d=ymdL();db.events.push({id:'ev1',t:'rdv',d,a:'08:00',b:'12:00',title:'Pose',who:['pk'],adr:'3 rue des Lilas'},{id:'ev2',t:'rdv',d,a:'14:00',b:'15:00',title:'Patron seul'});
  const k=db.people.find(x=>x.id==='pk');k.taux=15;k.pays=[{id:'x1',amt:120,d:ymdL(),note:'virement'}];k.at=Date.now();save()});
 await pa.evaluate(()=>syncNow());await pa.waitForTimeout(800);
 /* 2. Karim ouvre le lien sur son téléphone : un bouton, il rejoint */
 const ka=await tel(c1.lien.replace(/^https?:\/\/[^/]+/,B));
 await ka.waitForSelector('#joinScr .join-go',{timeout:15000}).catch(()=>{});
 const je=await ka.evaluate(()=>{const s=document.getElementById('joinScr');return s?s.innerText.replace(/\s+/g,' '):''});
 ok('Karim voit l\'entreprise et « Rejoindre l\'équipe »',/Rosso Rénovation/.test(je)&&/Karim, rejoins l'équipe/.test(je),je);
 await ka.click('#joinScr .join-go');await ka.waitForFunction(()=>!!getSync().token,null,{timeout:10000}).catch(()=>{});
 await ka.evaluate(()=>syncNow());await ka.waitForTimeout(1200);
 const kv=await ka.evaluate(()=>({sync:getSync(),ouv:document.body.classList.contains('role-ouvrier'),ev:db.events.filter(e=>e.t==='rdv').map(e=>e.title),
  devis:getComputedStyle(document.querySelector('nav [data-pat]')).display,pt:getComputedStyle(document.querySelector('nav button[onclick^="tab(\'pt\'"]')).display!=='none'}));
 ok('Karim est dans l\'espace de son patron, en ouvrier',kv.sync.url.endsWith('/e/'+esp)&&kv.sync.role==='ouvrier',JSON.stringify(kv.sync));
 ok('Karim reçoit seulement ses rendez-vous',kv.ev.join()==='Pose',kv.ev.join());
 ok('écran collaborateur : Pointage visible, Devis et Historique cachés',kv.ouv&&kv.devis==='none'&&kv.pt,JSON.stringify({o:kv.ouv,d:kv.devis,p:kv.pt}));
 await ka.evaluate(()=>{go('pt');ptPage('h')});await ka.waitForTimeout(300);
 const moi=await ka.evaluate(()=>{const c=document.querySelector('.eq-moi');return c?c.innerText.replace(/\s+/g,' '):''});
 ok('« Moi » : ses heures, dû, reçu (120 €) et ses paiements',/Karim/.test(moi)&&/Reçu/.test(moi)&&/120,00/.test(moi)&&/virement/.test(moi),moi);
 await pa.evaluate(()=>loadTeam());await pa.waitForTimeout(500);
 ok('côté patron : Karim « Dans l\'équipe »',await pa.evaluate(()=>eqStatut(db.people.find(x=>x.id==='pk'))==='equipe'));
 /* espace client (casô client final) : depuis la fiche du client, une carte prête avec le lien personnel */
 const ce=await pa.evaluate(async()=>{db.clients.push({id:'cli1',nom:'Martin',adr:'3 rue Victor Hugo'});save();cliEdit('cli1');await cliEspace();
  const c=document.querySelector('#cliEsp .env');return c?{t:c.innerText.replace(/\s+/g,' '),u:(ENV['cli-cli1']||{}).url||'',m:(ENV['cli-cli1']||{}).msg||''}:{t:document.getElementById('cliEsp').innerText}});
 ok('fiche client : « Espace client » prépare le lien et le message',new RegExp('/e/'+esp+'/c/[a-f0-9]{32}$').test(ce.u)&&/Copier le message/.test(ce.t)&&/Bonjour Martin, voici votre espace client Rosso Rénovation/.test(ce.m),JSON.stringify(ce));
 const pc=await (await br.newContext()).newPage();await pc.goto(ce.u.replace(/^https?:\/\/[^/]+/,B));await pc.waitForSelector('#devis',{timeout:10000}).catch(()=>{});
 ok('le client ouvre son espace',/Bonjour Martin/.test(await pc.evaluate(()=>document.body.innerText)));
 /* 3. une autre entreprise ne voit rien de la première */
 const pb=await tel(B+'/');
 await pb.evaluate(async()=>{await accountCreate({prenom:'Julie',email:'julie@autre.fr',pass:'motdepasse2',ent:'Autre',co:false,cgu:true})});
 await pb.waitForFunction(()=>CasoAuth.connecte(),null,{timeout:15000});
 await pb.evaluate(async()=>{await eqEspace();await syncNow()});await pb.waitForTimeout(800);
 const vb=await pb.evaluate(()=>({url:getSync().url,ev:db.events.filter(e=>e.t==='rdv').length,people:db.people.map(p=>p.nom)}));
 ok('deuxième entreprise : son propre espace, rien de la première',vb.url.endsWith('/e/'+esp)===false&&/\/e\/[a-f0-9]{12}$/.test(vb.url)&&vb.ev===0&&!vb.people.includes('Karim'),JSON.stringify(vb));
 const vol=await pb.evaluate(async([b,e])=>{const r=await fetch(b+'/e/'+e+'/api/sync',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+getSync().token},body:'{"since":0,"changes":{}}'});return r.status},[B,esp]);
 ok('la clé d\'une entreprise n\'ouvre pas l\'espace d\'une autre',vol===401,String(vol));
 /* 4. l'espace d'origine (racine) marche comme avant ; un e-mail de devis d'un espace porte son espace */
 const racine=await pa.evaluate(async b=>(await fetch(b+'/api/state')).status,B);
 ok('racine (espace e1) inchangée',racine===200);
 ok('espace inconnu : 404',(await pa.evaluate(async b=>(await fetch(b+'/e/000000000000/api/state')).status,B))===404);
 ok('aucune erreur JavaScript',!errs.length,errs.join(' | '));
 await br.close();await new Promise(r=>S.server.close(r));fs.rmSync(dir,{recursive:true,force:true});
 console.log(R.join('\n'));const ko=R.filter(x=>x.startsWith('FAIL')).length;console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');process.exit(ko?1:0)
})().catch(e=>{console.log(R.join('\n'));console.error(e);process.exit(1)});

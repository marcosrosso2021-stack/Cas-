/* Compte par e-mail rattaché au serveur casô (essai, abonnement), dans un vrai navigateur.
   Lancer : node tests/compte-mail.test.js   (demande playwright ; démarre son propre serveur casô) */
'use strict';
const os=require('os'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-mail-'));
(async()=>{
 const S=createServer({dataDir:dir,noTimers:true,pushSend:async()=>({status:201})});
 await new Promise(r=>S.server.listen(0,'127.0.0.1',r));
 const B='http://127.0.0.1:'+S.server.address().port;
 const comptes=()=>{try{return Object.values(JSON.parse(fs.readFileSync(path.join(dir,'comptes.json'),'utf8')).comptes)}catch(e){return[]}};
 const br=await chromium.launch();
 async function tel(){const c=await br.newContext(),p=await c.newPage(),errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(b=>{window.CASO_AUTH_SRV=b;try{localStorage.setItem('caso_test','1')}catch(e){}},B);
  await p.goto(B+'/');await p.waitForFunction(()=>typeof accountCreate==='function'&&window.CasoAuth&&CasoAuth.mail,null,{timeout:30000});
  return{c,p,errs}}
 const session=p=>p.waitForFunction(()=>CasoAuth.connecte(),null,{timeout:20000}).then(()=>true,()=>false);

 /* 1. création du compte sur le téléphone : le compte casô est créé sur le serveur */
 {const {c,p,errs}=await tel();
  await p.evaluate(()=>accountCreate({prenom:'Paul',email:'Paul@Exemple.fr',pass:'motdepasse1',ent:'',co:false}));
  ok('création : session casô ouverte',await session(p));
  const L=comptes();ok('création : un compte e-mail sur le serveur',L.length===1&&L[0].via==='mail'&&L[0].email==='paul@exemple.fr'&&L[0].prenom==='Paul');
  ok('création : ni le mot de passe ni la preuve dans comptes.json',!fs.readFileSync(path.join(dir,'comptes.json'),'utf8').includes('motdepasse1'));
  ok('création : aucune erreur JavaScript',!errs.length,errs.join(' | '));await c.close()}

 /* 2. autre téléphone, même e-mail et même mot de passe : même compte casô, pas de doublon */
 {const {c,p}=await tel();
  await p.evaluate(()=>CasoAuth.mail('paul@exemple.fr','motdepasse1'));
  ok('autre téléphone : connecté au même compte',await session(p)&&comptes().length===1);
  const r=await p.evaluate(()=>CasoAuth.compte().via);ok('autre téléphone : compte e-mail',r==='mail');await c.close()}

 /* 3. mauvais mot de passe : pas de session, pas de nouveau compte */
 {const {c,p}=await tel();
  const e=await p.evaluate(()=>CasoAuth.mail('paul@exemple.fr','mauvais-mdp').then(()=>'',e=>String(e.code)));
  ok('mauvais mot de passe : refusé (401), rien créé',e==='401'&&!(await p.evaluate(()=>CasoAuth.connecte()))&&comptes().length===1);await c.close()}

 /* 4. mot de passe changé sur le téléphone : le serveur suit */
 {const {c,p}=await tel();
  await p.evaluate(()=>CasoAuth.mail('paul@exemple.fr','motdepasse1'));await session(p);
  await p.evaluate(()=>CasoAuth.mailMdp('nouveau-mdp-2'));await c.close()}
 {const {c,p}=await tel();
  const a=await p.evaluate(()=>CasoAuth.mail('paul@exemple.fr','motdepasse1').then(()=>'ok',e=>String(e.code)));
  await p.evaluate(()=>CasoAuth.mail('paul@exemple.fr','nouveau-mdp-2').catch(()=>{}));
  ok('mot de passe changé : l\'ancien est refusé, le nouveau accepté',a==='401'&&await session(p));await c.close()}

 /* 6. compte e-mail du téléphone pas encore relié (ouvert par Face ID, créé hors ligne) : le mot de passe est demandé une fois */
 {const {c,p,errs}=await tel();
  await p.evaluate(async()=>{const s=crypto.getRandomValues(new Uint8Array(16));
   accountPut({v:1,id:'u9',prenom:'Zoé',email:'zoe@exemple.fr',algo:'pbkdf2-sha256',iter:1000,salt:hex(s),hash:await pwHash('motdepasse1',s,1000),createdAt:Date.now()})});
  await p.reload();await p.waitForFunction(()=>typeof aboRelier==='function',null,{timeout:30000});
  ok('pas relié : la fiche « Relier mon compte » s\'ouvre toute seule',await p.waitForFunction(()=>!$('relSh').hidden,null,{timeout:8000}).then(()=>true,()=>false));
  await p.fill('#relPw','mauvais');await p.click('#relGo');await p.waitForTimeout(800);
  ok('pas relié : mauvais mot de passe refusé sur le téléphone, rien envoyé',await p.evaluate(()=>!$('relErr').hidden&&!CasoAuth.connecte())&&!comptes().some(x=>x.email==='zoe@exemple.fr'));
  await p.fill('#relPw','motdepasse1');await p.click('#relGo');
  ok('pas relié : bon mot de passe → compte casô créé et session ouverte',await session(p)&&comptes().some(x=>x.email==='zoe@exemple.fr'&&x.via==='mail'));
  await p.evaluate(()=>{localStorage.removeItem('caso_auth')});await p.reload();await p.waitForFunction(()=>typeof aboRelier==='function',null,{timeout:30000});await p.waitForTimeout(5000);
  ok('pas relié : demandé une seule fois ; ensuite « Relier mon compte » reste dans le profil',await p.evaluate(()=>$('relSh').hidden&&$('dwPlanGo').dataset.k==='rel'&&!$('dwPlanGo').hidden));
  ok('pas relié : aucune erreur JavaScript',!errs.length,errs.join(' | '));await c.close()}

 /* 5. sans serveur joignable : l'appli continue, rien ne casse */
 {const c=await br.newContext(),p=await c.newPage(),errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{window.CASO_AUTH_SRV='http://127.0.0.1:9';try{localStorage.setItem('caso_test','1')}catch(e){}});
  await p.goto(B+'/');await p.waitForFunction(()=>typeof accountCreate==='function',null,{timeout:30000});
  const a=await p.evaluate(()=>accountCreate({prenom:'Léa',email:'lea@exemple.fr',pass:'motdepasse1',ent:'',co:false}).then(x=>!!(x&&x.email)));
  await p.waitForTimeout(1500);
  ok('hors ligne : compte créé sur le téléphone, pas de session, aucune erreur',a&&!(await p.evaluate(()=>CasoAuth.connecte()))&&!errs.length,errs.join(' | '));await c.close()}

 await br.close();await new Promise(r=>S.server.close(r));
 console.log(R.join('\n'));const ko=R.filter(x=>x.startsWith('FAIL')).length;
 console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');
 fs.rmSync(dir,{recursive:true,force:true});process.exit(ko?1:0)
})().catch(e=>{console.error(e);process.exit(1)});

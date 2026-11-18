/* Abonnement par module dans l'appli (navigateur) : verrous, lecture seule, devis gratuit du mois, newsletter non chargée.
   Lancer : node tests/abonnement.test.js   (demande playwright ; sert lui-même l'appli, aucun accès à Internet) */
'use strict';
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const ROOT=path.join(__dirname,'..');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.png':'image/png'};
const J=864e5,TOUS=['devis','planning','pointage','paiement','3d','renovation','fournisseurs','veille'];
(async()=>{
 const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end()}
  r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));const B='http://127.0.0.1:'+srv.address().port;
 const br=await chromium.launch();
 /* téléphone avec un compte casô (session) : compte = ce que le serveur a renvoyé la dernière fois */
 async function tel(compte){const c=await br.newContext({viewport:{width:390,height:844},locale:'fr-FR'}),p=await c.newPage(),errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(cp=>{window.CASO_AUTH_SRV='http://127.0.0.1:9';try{localStorage.setItem('caso_test','1');
   if(cp)localStorage.setItem('caso_auth',JSON.stringify({jeton:'a'.repeat(64),compte:cp,vu:Date.now()}))}catch(e){}},compte);
  await p.goto(B+'/index.html');
  await p.waitForFunction(()=>typeof go==='function'&&typeof db==='object'&&typeof aboOuvert==='function'&&!document.body.classList.contains('starting'),null,{timeout:30000});
  await p.evaluate(()=>{db.clients.push({id:'c1',nom:'Martin'});
   db.invoices.push({id:'f1',kind:'facture',num:'F2026-001',date:ymdL(),client:{nom:'Martin'},lines:[{label:'Carrelage',qty:20,unit:'m²',pu:45,tva:10}],pays:[]});save()});
  return{c,p,errs}}
 const verrous=p=>p.evaluate(()=>[...document.querySelectorAll('.abo-lk')].map(l=>(/^(?:drawerGo|tab)\('([^']+)'/.exec(l.closest('button').getAttribute('onclick'))||[])[1]).sort().join(','));
 const fin={mode:'artisan',offre:'artisan_fin_essai',essaiFin:Date.now()-J,modules:[]};

 /* 1. après l'essai, sans abonnement : socle gratuit seulement */
 {const {c,p,errs}=await tel(fin);
  ok('sans abonnement : cadenas sur Encaissements, Fournisseurs, Newsletter et Pointage (Planning et Mes services ouverts)',await verrous(p)==='enc,fou,news,pt',await verrous(p));
  await p.waitForFunction(()=>typeof casoPont!=='undefined'||window.casoPont,null,{timeout:10000}).catch(()=>{});await p.waitForTimeout(500);
  ok('sans abonnement : la newsletter n\'est pas chargée',await p.evaluate(()=>!window.casoVeille&&!document.querySelector('script[src="modules/newsletter.js"]')));
  ok('socle gratuit : chat, clients et rendez-vous ouverts',await p.evaluate(()=>aboOuvert('chat')&&aboOuvert('clients')&&aboOuvert('rdv')));
  await p.evaluate(()=>go('pt'));
  ok('écran Pointage : lisible, bandeau « lecture seule » avec « Ajouter »',await p.evaluate(()=>{const b=$('s-pt').previousElementSibling;if(!b||!b.classList.contains('abo-ro'))return false;return !!b&&$('s-pt').classList.contains('on')&&/Pointage/.test(b.textContent)&&!!b.querySelector('button')}));
  await p.evaluate(()=>go('cli'));ok('écran Clients : pas de bandeau',await p.evaluate(()=>!document.querySelector('.abo-ro')));
  /* une action venant de l'usager (appui) : « On construit le plan » s'ouvre tout de suite, le module coché, avec un petit mot */
  const plan=()=>p.evaluate(()=>({on:!$('abSh').hidden,sel:[...ABO.sel],mot:$('abMot').hidden?'':$('abMot').textContent}));
  await p.evaluate(()=>{const b=document.createElement('button');b.id='essai';b.textContent='x';b.style.cssText='position:fixed;top:300px;left:10px;z-index:99';b.onclick=()=>faPayOpen();document.body.appendChild(b)});
  await p.click('#essai');let pl=await plan();
  ok('encaissement depuis un écran : le plan s\'ouvre, Encaissements coché, petit mot',pl.on&&pl.sel.includes('paiement')&&/argent/.test(pl.mot)&&await p.evaluate(()=>$('faPay').hidden),JSON.stringify(pl));
  await p.evaluate(()=>{aboClose();$('essai').onclick=()=>tab('news')});await p.waitForTimeout(300);await p.click('#essai');pl=await plan();
  ok('menu : la newsletter ouvre le plan, Newsletter cochée',!(await p.evaluate(()=>$('s-news').classList.contains('on')))&&pl.on&&pl.sel.includes('veille')&&/règles/.test(pl.mot),JSON.stringify(pl));
  await p.evaluate(()=>aboClose());await p.waitForTimeout(300);
  ok('profil : pastille discrète « On construit le plan », sans « Mon abonnement »',await p.evaluate(()=>{const g=$('dwPlanGo');return !g.hidden&&/On construit le plan/.test(g.textContent)&&!/abonnement/i.test(document.getElementById('dwR').textContent)}));
  /* chat : « Martin a payé 100 € » → le plan s'ouvre, rien d'enregistré */
  await p.evaluate(()=>go('chat'));
  await p.fill('#chatIn','Martin a payé 100 €');await p.click('.cmp-send');await p.waitForTimeout(1200);
  await p.locator('#s-chat button',{hasText:/^Oui$/}).last().click();await p.waitForTimeout(800);
  pl=await plan();const pays=await p.evaluate(()=>db.invoices[0].pays.length);
  ok('chat : encaissement arrêté, le plan s\'ouvre avec Encaissements, rien enregistré',pays===0&&pl.on&&pl.sel.includes('paiement'),JSON.stringify({pays,pl}));
  await p.evaluate(()=>aboClose());
  /* devis : 1 gratuit par mois */
  const dv=await p.evaluate(()=>{aboClose();const n=()=>Object.assign(newObj(),{client:'Martin',lines:[{label:'Carrelage',qty:1,unit:'m²',pu:45,tva:10}]});
   const a=storeQ(n()),b=storeQ(n());const old=Object.assign(n(),{date:'2026-01-10',num:'D2026-001'});db.quotes.push(JSON.parse(JSON.stringify(old)));
   old.lines[0].pu=99;const e=storeQ(old);return{a,b,e,pu:db.quotes.find(x=>x.id===old.id).lines[0].pu,n:db.quotes.length}});
  ok('devis : le 1er du mois est gratuit, le 2e demande le module',dv.a===true&&dv.b===false,JSON.stringify(dv));
  ok('devis : un ancien devis reste lisible mais n\'est plus modifié',dv.e===false&&dv.pu===45);
  ok('sans abonnement : aucune erreur JavaScript',!errs.length,errs.join(' | '));await c.close()}

 /* 2. abonnement Paiement + Newsletter */
 {const {c,p,errs}=await tel(Object.assign({},fin,{offre:'plan',modules:['paiement','veille']}));
  ok('plan Encaissements + Newsletter : plus de cadenas sur ces deux-là',await verrous(p)==='fou,pt',await verrous(p));
  ok('plan : la newsletter est chargée',await p.waitForFunction(()=>!!window.casoVeille,null,{timeout:10000}).then(()=>true,()=>false));
  await p.evaluate(()=>go('enc'));ok('plan : Encaissements sans bandeau',await p.evaluate(()=>!document.querySelector('.abo-ro')));
  ok('plan : le paiement s\'enregistre',await p.evaluate(()=>{faPayAll('f1');return db.invoices[0].pays.length===1}));
  ok('plan : aucune erreur JavaScript',!errs.length,errs.join(' | '));await c.close()}

 /* 3. pendant l'essai, et sans compte casô : rien n'est verrouillé */
 for(const [nom,cp] of [['en essai',{mode:'artisan',offre:'artisan_curieux',essaiFin:Date.now()+10*J,modules:TOUS}],['sans compte casô',null],['Bricoleur',{mode:'bricoleur',offre:'bricoleur',modules:[]}]]){
  const {c,p,errs}=await tel(cp);
  const r=await p.evaluate(()=>{go('pt');const a=!document.querySelector('.abo-ro');const n=()=>Object.assign(newObj(),{client:'Martin',lines:[{label:'x',qty:1,unit:'u',pu:1,tva:10}]});return a&&storeQ(n())&&storeQ(n())&&storeQ(n())});
  const nv=await p.waitForFunction(()=>!!window.casoVeille,null,{timeout:10000}).then(()=>true,()=>false),vr=await verrous(p);
  ok(nom+' : rien de verrouillé (pas de cadenas, ni bandeau, devis libres)',r&&vr===''&&nv,JSON.stringify({r,vr,nv}));
  ok(nom+' : aucune erreur JavaScript',!errs.length,errs.join(' | '));await c.close()}

 await br.close();srv.close();
 console.log(R.join('\n'));const ko=R.filter(x=>x.startsWith('FAIL')).length;
 console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');process.exit(ko?1:0)
})().catch(e=>{console.error(e);process.exit(1)});

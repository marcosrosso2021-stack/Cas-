/* Chantiers sur plusieurs jours (navigateur) : le chat les comprend et les cale sur les jours et créneaux de travail libres ;
   la fiche « Nouveau rendez-vous » les crée et les modifie à la main.
   Lancer : node tests/planning-chantier.test.js   (demande playwright ; sert lui-même l'appli, horloge fixée au mercredi 18 novembre 2026, 10 h) */
'use strict';
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const ROOT=path.join(__dirname,'..');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.png':'image/png'};
(async()=>{
 const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end()}
  r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));const B='http://127.0.0.1:'+srv.address().port;
 const br=await chromium.launch(),c=await br.newContext({viewport:{width:390,height:844},locale:'fr-FR'}),p=await c.newPage(),errs=[];
 p.on('pageerror',e=>errs.push(e.message));
 await p.clock.install({time:new Date('2026-11-18T10:00:00')});
 await p.addInitScript(()=>{localStorage.setItem('caso_test','1')});
 await p.goto(B+'/index.html');
 await p.waitForFunction(()=>typeof agChat==='function'&&typeof agPlanSerie==='function'&&!document.body.classList.contains('starting'),null,{timeout:30000});
 const dit=t=>p.evaluate(t=>{agChat(t);const m=CHAT.m[CHAT.m.length-1];return m&&m.html?m.html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim():''},t);
 const de=nom=>p.evaluate(n=>db.events.filter(e=>e.t==='rdv'&&(db.clients.find(c=>c.id===e.cid)||{}).nom===n).sort((a,b)=>a.d.localeCompare(b.d)).map(e=>e.d+' '+e.a+'-'+e.b+(e.g?'':' (seul)')+' '+e.title),nom);
 await dit('mes créneaux de travail sont de 8h à 12h et de 13h à 17h du lundi au vendredi');

 let r=await dit('chantier chez Martin 3 jours à partir de lundi'),L=await de('Martin');
 ok('« 3 jours à partir de lundi » : lundi, mardi, mercredi, journées entières',L.join()==='2026-11-23 08:00-17:00 Chantier,2026-11-24 08:00-17:00 Chantier,2026-11-25 08:00-17:00 Chantier',L.join(' | '));
 ok('réponse courte : dates, nombre de jours, heures sans la pause',/Chantier calé/.test(r)&&/3 jours/.test(r)&&/24 h/.test(r)&&r.length<120,r);

 await dit('rdv chez Dupont jeudi 26 à 9h');L=await de('Dupont');
 ok('« jeudi 26 » : le 26, pas le jeudi qui vient',L.length===1&&L[0].startsWith('2026-11-26 09:00-10:00'),L.join());

 r=await dit('pose carrelage chez Petit 20 h de travail à partir de mercredi');L=await de('Petit');
 const h=await p.evaluate(()=>agSerieH(db.events.filter(e=>e.g&&(db.clients.find(c=>c.id===e.cid)||{}).nom==='Petit'))/60);
 ok('« 20 h de travail » : réparties sur les jours libres, 20 h au total',h===20&&L.length===3&&L.every(x=>/Pose carrelage$/.test(x)),L.join(' | '));
 ok('le calage évite les rendez-vous déjà pris',await p.evaluate(()=>db.events.filter(e=>e.g).every(e=>!agCheck(e,e.d).over.length)));

 await p.evaluate(()=>{db.clients.push({id:'cD',nom:'Durand'});db.quotes.push({id:'qD',num:'D2026-009',client:'Durand',status:'accepte',date:'2026-11-10',lines:[{label:'Peinture',qty:40,unit:'m²',pu:20,tva:10},{label:"Main d'œuvre",qty:12,unit:'h',pu:45,tva:10}]});save()});
 r=await dit('planifie le chantier de Durand');
 ok('« planifie le chantier de Durand » : les 12 h de main-d\'œuvre de son devis',/D2026-009/.test(r)&&await p.evaluate(()=>agSerieH(db.events.filter(e=>e.g&&e.cid==='cD'))===720),r);
 ok('pas de bout de journée de moins de 2 h',await p.evaluate(()=>db.events.filter(e=>e.g).every((e,i,A)=>(e.h||0)>=120||A.filter(x=>x.g===e.g).sort((a,b)=>a.d.localeCompare(b.d)).pop()===e)));

 await dit('chantier chez Leroy du 7 au 9 décembre');L=await de('Leroy');
 ok('« du 7 au 9 décembre » : un rendez-vous par jour',L.length===3&&L[0].startsWith('2026-12-07')&&L[2].startsWith('2026-12-09'),L.join(' | '));
 await p.evaluate(()=>agUndoLast());ok('annuler la dernière action (chat) : les 3 jours partent',(await de('Leroy')).length===0);

 await dit('chantier chez Moreau pendant 2 semaines à partir du 1er décembre');L=await de('Moreau');
 ok('« 2 semaines » : 10 jours de travail, sans week-end',L.length===10&&await p.evaluate(()=>db.events.filter(e=>e.g&&(db.clients.find(c=>c.id===e.cid)||{}).nom==='Moreau').every(e=>agJourTravail(e.d))),String(L.length));

 r=await dit('décale le chantier de Martin au 30 novembre');L=await de('Martin');
 ok('« décale le chantier de Martin au 30 » : tout le chantier recalé',/recalé/.test(r)&&L.length===3&&L[0].startsWith('2026-11-30'),L.join(' | '));
 r=await dit('annule le chantier de Martin');
 ok('« annule le chantier de Martin » : les 3 jours',/Chantier annulé/.test(r)&&(await de('Martin')).length===0,r);

 /* fiche à la main */
 await p.evaluate(()=>{go('agenda');agSel='2026-12-21';agPage('jour');agEdit(null,'2026-12-21','08:00')});
 await p.fill('#agEti','Rénovation cuisine');await p.fill('#agEcl','Bernard');await p.fill('#agEj','3');await p.dispatchEvent('#agEj','change');await p.fill('#agEb','17:00');
 ok('fiche : « Nouveau chantier », pas de répétition avec plusieurs jours',await p.evaluate(()=>$('agEt').textContent==='Nouveau chantier'&&$('agErr').closest('.row').hidden));
 await p.click('#agSh .btn');await p.waitForTimeout(300);L=await de('Bernard');
 ok('fiche : 3 jours créés aux heures saisies',L.join()==='2026-12-21 08:00-17:00 Rénovation cuisine,2026-12-22 08:00-17:00 Rénovation cuisine,2026-12-23 08:00-17:00 Rénovation cuisine',L.join(' | '));
 ok('planning : « 1/3 » sur le jour, pas marqué hors créneaux malgré la pause',await p.evaluate(()=>{const b=document.querySelector('#agGrid .ag-ev');return !!b&&/1\/3/.test(b.textContent)&&!b.classList.contains('hors')}));
 await p.evaluate(()=>{const e=db.events.filter(x=>x.g&&x.d==='2026-12-22')[0];agEdit(e.id,e.d)});
 ok('fiche d\'un jour : « Chantier · 2/3 », 3 jours',await p.evaluate(()=>$('agEt').textContent==='Chantier · 2/3'&&$('agEj').value==='3'));
 await p.fill('#agEti','Cuisine Bernard');await p.fill('#agEa','09:00');await p.click('#agSh .btn');await p.waitForTimeout(300);L=await de('Bernard');
 ok('fiche : titre changé pour les 3 jours, heure pour ce jour seulement',L.every(x=>/Cuisine Bernard$/.test(x))&&L[1].startsWith('2026-12-22 09:00')&&L[0].startsWith('2026-12-21 08:00'),L.join(' | '));
 await p.evaluate(()=>{const e=db.events.filter(x=>x.g&&x.d==='2026-12-21')[0];agEdit(e.id,e.d)});await p.fill('#agEj','2');await p.click('#agSh .btn');await p.waitForTimeout(300);
 ok('fiche : passer à 2 jours recale le chantier',(await de('Bernard')).length===2);
 await p.evaluate(()=>{const e=db.events.filter(x=>x.g&&x.d==='2026-12-22')[0];agEdit(e.id,e.d)});await p.evaluate(()=>{window.confirm=()=>true;agDelOne()});
 ok('fiche : « Supprimer ce jour seulement »',(await de('Bernard')).length===1);
 ok('aucune erreur JavaScript',!errs.length,errs.join(' | '));
 await br.close();srv.close();
 console.log(R.join('\n'));const ko=R.filter(x=>x.startsWith('FAIL')).length;
 console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');process.exit(ko?1:0)
})().catch(e=>{console.error(e);process.exit(1)});

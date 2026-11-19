/* Mon équipe dans l'appli (navigateur, vrai serveur casô) : le chat ajoute un collaborateur dans toutes les langues, demande ses
   coordonnées, prépare l'invitation ; la fiche donne heures, à payer, payé, reste ; paiement à la main, par le chat ou avec un document.
   Lancer : node tests/equipe.test.js   (demande playwright ; démarre son propre serveur casô) */
'use strict';
const os=require('os'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-eq-'));
(async()=>{
 const S=createServer({dataDir:dir,noTimers:true,pushSend:async()=>({status:201})});
 await new Promise(r=>S.server.listen(0,'127.0.0.1',r));const B='http://127.0.0.1:'+S.server.address().port;
 const br=await chromium.launch(),c=await br.newContext({viewport:{width:390,height:844},locale:'fr-FR'}),p=await c.newPage(),errs=[];
 p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('caso_test','1')});
 await p.goto(B+'/');await p.waitForFunction(()=>typeof eqChat==='function'&&!document.body.classList.contains('starting'),null,{timeout:30000});
 /* le premier message attend le correcteur de fautes : on attend la réponse à CE message */
 const dit=async t=>{await p.evaluate(t=>{$('chatIn').value=t;chatSend(t)},t);
  await p.waitForFunction(t=>{const i=CHAT.m.map(m=>m.who==='me'?(m.orig||m.text):null).lastIndexOf(t);return i>=0&&CHAT.m.slice(i+1).some(m=>m.who==='bot')},t,{timeout:15000}).catch(()=>{});
  return p.evaluate(()=>{const m=CHAT.m[CHAT.m.length-1];return m&&m.html?m.html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim():''})};
 const P=n=>p.evaluate(n=>{const x=db.people.find(y=>y.nom===n);return x?JSON.parse(JSON.stringify(x)):null},n);

 /* 1. le chat, sans espace d'équipe */
 let r=await dit('Karim est dans mon équipe');
 ok('« Karim est dans mon équipe » : ajouté, coordonnées demandées',/Karim ajouté à ton équipe/.test(r)&&/numéro ou son e-mail/.test(r),r);
 r=await dit('06 12 34 56 78');let k=await P('Karim');
 await p.waitForTimeout(400);r=await p.evaluate(()=>{const m=CHAT.m[CHAT.m.length-1];return m.html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')});
 ok('le numéro donné au chat : enregistré, carte d\'invitation (Copier le message, Partager)',k.tel==='06 12 34 56 78'&&k.inv&&/Invitation · Karim/.test(r)&&/Copier le message/.test(r)&&/Partager/.test(r)&&await p.evaluate(()=>/Karim/.test(EQ.last.txt)),r);
 const L={'add Ali to my team, ali@test.com':'Ali','Añade a Pedro a mi equipo':'Pedro','Aggiungi Luca alla mia squadra':'Luca','Yeni çalışan Mehmet':'Mehmet','أضف علي إلى فريقي':'علي','Добавь Олега в мою команду':'Олега'};
 for(const [t,n] of Object.entries(L)){r=await dit(t);ok('chat ('+n+') : « '+t+' »',!!(await P(n))&&/ajouté à ton équipe/.test(r),r.slice(0,80))}
 ok('e-mail dans la même phrase : gardé, carte d\'invitation prête',(await P('Ali')).email==='ali@test.com'&&await p.evaluate(()=>/Ali/.test(EQ.last.txt)));
 r=await dit('Karim 15 € de l\'heure');ok('« Karim 15 € de l\'heure »',(await P('Karim')).taux===15,r);
 r=await dit('j\'ai payé Karim 300 €');ok('« j\'ai payé Karim 300 € » : paiement enregistré',(await P('Karim')).pays.length===1&&(await P('Karim')).pays[0].amt===300,r);
 r=await dit('Martin a payé 500 €');ok('« Martin a payé 500 € » (un client) : pas pour l\'équipe',(await P('Martin'))===null);
 const nb=await p.evaluate(()=>db.people.length);await dit('Karim est dans mon équipe');
 ok('déjà dans l\'équipe : pas de doublon',await p.evaluate(()=>db.people.length)===nb);

 /* 2. la fiche */
 await p.evaluate(()=>{const k=db.people.find(x=>x.nom==='Karim');db.pts.push({id:'t1',c:'ch',p:k.id,t:'in',ts:Date.now()-5*36e5},{id:'t2',c:'ch',p:k.id,t:'out',ts:Date.now()-36e5});save();cptPage('team')});
 ok('liste : chaque collaborateur avec son statut',await p.evaluate(()=>[...document.querySelectorAll('#eqList .eq-r')].length===7&&/Invité/.test($('eqList').textContent)&&/À inviter/.test($('eqList').textContent)));
 await p.evaluate(()=>eqOpen(db.people.find(x=>x.nom==='Karim').id));
 const tiles=await p.evaluate(()=>[...document.querySelectorAll('.eq-tiles b')].map(b=>b.textContent.trim()));
 ok('fiche : heures pointées, à payer (heures × prix), payé, reste',tiles[0]==='4 h 00'&&/60,00/.test(tiles[1])&&/300,00/.test(tiles[2])&&/0,00/.test(tiles[3]),tiles.join(' | '));
 /* paiement à la main avec un document */
 await p.evaluate(()=>{$('eqAdd').open=true;$('eqAmt').value='120';$('eqNote').value='virement'});
 await p.setInputFiles('#eqDoc',{name:'recu.png',mimeType:'image/png',buffer:Buffer.from('89504e470d0a1a0a','hex')});
 await p.evaluate(()=>eqPayAdd(db.people.find(x=>x.nom==='Karim').id));
 await p.waitForFunction(()=>db.people.find(x=>x.nom==='Karim').pays.length===2,null,{timeout:5000}).catch(()=>{});
 k=await P('Karim');ok('paiement à la main avec un document joint',k.pays.length===2&&k.pays.some(x=>x.amt===120&&x.doc&&/^data:image\/png;base64,/.test(x.doc.u)));
 ok('le document s\'ouvre depuis la fiche',await p.evaluate(()=>!!document.querySelector('.eq-pays a.eq-doc[download="recu.png"]')));
 const sale=await p.evaluate(()=>{const r=recClean('people',{id:'pz',nom:'Z',pays:[{id:'y1',amt:1,d:'2026-11-18',doc:{n:'x',u:'javascript:alert(1)'}}]});return !r.pays[0].doc});
 ok('document reçu de la synchro : jamais un lien javascript:',sale);
 /* saisie à la main */
 await p.evaluate(()=>eqEdit());await p.fill('#eqNom','Sami Benali');await p.fill('#eqTel','07 11 22 33 44');await p.fill('#eqTaux','18');
 await p.evaluate(()=>segOn('eqRole','chef'));await p.evaluate(()=>eqSave());const s=await P('Sami Benali');
 await p.waitForTimeout(400);ok('saisie à la main : chef, 18 €/h, carte d\'invitation dans la fiche',s&&s.role==='chef'&&s.taux===18&&s.inv&&await p.evaluate(()=>/Invitation · Sami Benali/.test($('eqSh').innerText)));
 ok('Pointage : plus de liste « Personnes » en double, un lien vers Mon équipe',await p.evaluate(()=>{ptPage&&go('pt');ptPage('set');return !document.querySelector('#pnNew')&&!!document.querySelector('.eq-lien')}));

 /* 3. avec l'espace d'équipe du patron : un lien personnel pour rejoindre */
 const st=await p.evaluate(async b=>{const r=await fetch(b+'/api/setup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user:'Marcos',password:'motdepasse1'})});const j=await r.json();
  setSync({url:b,token:j.token,user:j.name,role:j.role,rev:0,lastPush:0});return r.status},B);
 await p.evaluate(()=>eqInviter(db.people.find(x=>x.nom==='Pedro').id));await p.evaluate(()=>{const x=db.people.find(y=>y.nom==='Pedro');x.tel='0600000001';return eqInviter(x.id)});
 const lien=await p.evaluate(()=>EQ.last&&EQ.last.txt);
 ok('espace d\'équipe : lien personnel pour rejoindre (?join=)',st===200&&/\?join=[a-f0-9]{16}/.test(lien||''),lien);
 const code=(lien.match(/join=([a-f0-9]+)/)||[])[1];
 const j=await p.evaluate(async([b,c])=>{const r=await fetch(b+'/api/join',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:c})});return r.status},[B,code]);
 await p.evaluate(()=>loadTeam());await p.waitForTimeout(500);
 ok('Pedro a rejoint : « Dans l\'équipe »',j===200&&await p.evaluate(()=>eqStatut(db.people.find(x=>x.nom==='Pedro'))==='equipe'));
 ok('aucune erreur JavaScript',!errs.length,errs.join(' | '));
 await br.close();await new Promise(r=>S.server.close(r));fs.rmSync(dir,{recursive:true,force:true});
 console.log(R.join('\n'));const ko=R.filter(x=>x.startsWith('FAIL')).length;console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');process.exit(ko?1:0)
})().catch(e=>{console.log(R.join("\n"));console.error(e);process.exit(1)});

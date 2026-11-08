/* Tests du coffre casô, suite : membres d'équipe, pointage pendant le verrouillage, sauvegarde chiffrée, IBAN.
   Lancer depuis la racine du dépôt : python3 -m http.server 8765 &   puis   node tests/coffre-equipe.test.js */
const {chromium}=require('playwright');
const B='http://localhost:8765/';
const R=[];const ok=(n,c,x)=>{R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const br=await chromium.launch();
 async function ctx(){const c=await br.newContext();const p=await c.newPage();const errs=[];
  p.on('pageerror',e=>errs.push('pageerror: '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
  p.on('dialog',d=>d.accept());return {c,p,errs}}
 const raw=p=>p.evaluate(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=VAULT.raw.get(k)}return o});
 const appUp=p=>p.waitForFunction(()=>typeof db!=='undefined'&&typeof init==='function',null,{timeout:20000});
 const locked=p=>p.evaluate(()=>document.getElementById('s-start').classList.contains('on')&&typeof db==='undefined');
 const noErr=errs=>errs.filter(e=>!/Failed to load resource|net::ERR|favicon/.test(e));
 async function newAccount(p,pw){await p.evaluate(async pw=>{document.getElementById('acNom').value='Jean';document.getElementById('acMail').value='jean@test.fr';document.getElementById('acPass').value=pw;await acSubmit();await new Promise(r=>setTimeout(r,800))},pw)}
 async function modal(p,pw){await p.waitForSelector('.pwask input',{timeout:5000});await p.fill('.pwask input',pw);await p.click('.pwask button[type=submit]')}

 /* ===== 4. membre d'équipe sans compte ===== */
 {const {p,errs}=await ctx();await p.goto(B);await appUp(p);
  await p.evaluate(()=>{localStorage.setItem('devis_sync',JSON.stringify({url:'https://srv.example',token:'TOKEN-EQUIPE',user:'Pierre',role:'ouvrier'}));
   db.chantiers=[{id:'ch9',nom:'Chantier Équipe Secret'}];save()});
  await p.reload();await sleep(800);
  const s=await p.evaluate(()=>({on:document.getElementById('s-start').classList.contains('on'),btn:document.getElementById('lgGo').textContent,mail:document.getElementById('lgMail').hidden,app:typeof db}));
  ok('4.1 membre déjà relié (avant la mise à jour) : mot de passe du téléphone demandé',s.on&&s.btn==='Valider'&&s.mail&&s.app==='undefined',JSON.stringify(s));
  await p.fill('#lgPass','court');await p.click('#lgGo');await sleep(300);
  ok('4.2 mot de passe trop court refusé',await p.evaluate(()=>/8 caractères/.test(document.getElementById('lgErr').textContent)));
  await p.fill('#lgPass','equipe-123');await p.click('#lgGo');await appUp(p);await sleep(1500);
  const J=JSON.stringify(await raw(p));
  ok('4.3 coffre créé, jeton et chantier chiffrés',!/TOKEN-EQUIPE|Chantier Équipe Secret/.test(J)&&/caso_vault/.test(J));
  ok('4.4 l’appli fonctionne (jeton relu)',await p.evaluate(()=>getSync().token==='TOKEN-EQUIPE'&&db.chantiers[0].nom==='Chantier Équipe Secret'));
  await p.reload();await sleep(800);
  const u=await p.evaluate(()=>({mail:document.getElementById('lgMail').hidden,lab:document.querySelector('label[for="lgMail"]').hidden,btn:document.getElementById('lgGo').textContent,fg:!document.getElementById('lgForgot').hidden}));
  ok('4.5 au rechargement : écran sans e-mail, bouton Connexion, « oublié » proposé',u.mail&&u.lab&&u.btn==='Connexion'&&u.fg,JSON.stringify(u));
  await p.fill('#lgPass','equipe-123');await p.click('#lgGo');await appUp(p);
  ok('4.6 déverrouillage par le mot de passe du téléphone',await p.evaluate(()=>getSync().token==='TOKEN-EQUIPE'));
  ok('4.7 aucune erreur JavaScript',noErr(errs).length===0,noErr(errs).slice(0,3).join(' || '));
 }
 /* ===== 4b. invitation pendant que l'appli tourne ===== */
 {const {p,errs}=await ctx();await p.goto(B);await appUp(p);
  await p.evaluate(()=>{setSync({url:'https://srv.example',token:'TOKEN-INV',user:'Ali',role:'ouvrier'});vaultSetup()});await sleep(800);
  ok('4b.1 après l’invitation : mot de passe du téléphone demandé',await p.evaluate(()=>document.getElementById('s-start').classList.contains('on')&&!document.getElementById('lgForm').hidden&&document.getElementById('lgMail').hidden&&document.getElementById('acForm').hidden));
  await p.fill('#lgPass','invite-456');await p.click('#lgGo');await sleep(2000);
  const st=await p.evaluate(()=>({on:VAULT.on,mail:document.getElementById('lgMail').hidden,tok:getSync().token}));
  ok('4b.2 coffre actif, écran rendu comme avant',st.on&&!st.mail&&st.tok==='TOKEN-INV',JSON.stringify(st));
  ok('4b.3 jeton chiffré',!/TOKEN-INV/.test(JSON.stringify(await raw(p))));
  ok('4b.4 aucune erreur JavaScript',noErr(errs).length===0,noErr(errs).slice(0,3).join(' || '));
 }

 /* ===== 5. pointage pendant le verrouillage ===== */
 {const {p,errs}=await ctx();await p.goto(B);await appUp(p);await newAccount(p,'motdepasse1');
  await p.goto(B+'?p=ch1&n=Chantier%20A&u=Pierre');await sleep(800);
  const n=await p.evaluate(()=>({lock:typeof db==='undefined',note:(document.querySelector('.vnote')||{}).textContent||'',url:location.search,q:VAULT.raw.get('caso_pq')}));
  ok('5.1 verrouillé : pointage noté avec l’heure, lien effacé',n.lock&&/Pointage noté à \d\d:\d\d/.test(n.note)&&n.url===''&&/"p":"ch1"/.test(n.q||''),n.note);
  const t0=JSON.parse(n.q)[0].t;await sleep(2500);
  await p.fill('#lgMail','jean@test.fr');await p.fill('#lgPass','motdepasse1');await p.click('#lgGo');await appUp(p);await sleep(1500);
  const r=await p.evaluate(()=>({pts:db.pts.map(e=>({c:e.c,t:e.t,ts:e.ts})),ch:db.chantiers.map(c=>c.nom),pe:db.people.map(x=>x.nom),q:VAULT.raw.get('caso_pq'),note:!!document.querySelector('.vnote')}));
  ok('5.2 au déverrouillage : entrée enregistrée à l’heure du passage',r.pts.length===1&&r.pts[0].c==='ch1'&&r.pts[0].t==='in'&&r.pts[0].ts===t0,JSON.stringify(r.pts));
  ok('5.3 chantier et ouvrier créés, file vidée',r.ch.includes('Chantier A')&&r.pe.includes('Pierre')&&r.q===null&&!r.note);
  ok('5.4 aucune erreur JavaScript',noErr(errs).length===0,noErr(errs).slice(0,3).join(' || '));
 }

 /* ===== 6. sauvegarde chiffrée + 7. IBAN ===== */
 {const {p,errs}=await ctx();await p.goto(B);await appUp(p);await newAccount(p,'motdepasse1');
  await p.evaluate(()=>{db.quotes.push({id:'qx',client:'Client Export Secret',lines:[]});db.prof.iban='FR7630006000011234567890189';save();window.dl=(n,t)=>{window.__dl=t};ibanShow()});
  await p.evaluate(()=>{exportAll()});await modal(p,'mauvais');await sleep(2500);
  ok('6.1 export : mauvais mot de passe, pas de fichier',await p.evaluate(()=>!window.__dl));
  await p.evaluate(()=>{exportAll()});await modal(p,'motdepasse1');await p.waitForFunction(()=>!!window.__dl,null,{timeout:15000});
  const f=await p.evaluate(()=>window.__dl);
  ok('6.2 fichier de sauvegarde chiffré',/"caso":"sauvegarde-chiffree"/.test(f)&&!/Client Export Secret|FR7630006000011234567890189/.test(f));
  await p.evaluate(()=>{db.quotes=db.quotes.filter(q=>q.id!=='qx');save();importAll({files:[new File([window.__dl],'s.json')],value:''})});
  await modal(p,'motdepasse1');await sleep(3500);
  ok('6.3 import du fichier chiffré : données retrouvées',await p.evaluate(()=>db.quotes.some(q=>q.client==='Client Export Secret')));
  const m0=await p.evaluate(()=>{ibanShow();return document.getElementById('eIban').value});
  ok('7.1 IBAN masqué dans Mon entreprise',m0==='FR76 •••• •••• 0189',m0);
  await p.evaluate(()=>saveProf());ok('7.2 enregistrer avec l’IBAN masqué ne l’abîme pas',await p.evaluate(()=>db.prof.iban==='FR7630006000011234567890189'));
  await p.evaluate(()=>{go('cpt')});await sleep(300);
  await p.evaluate(()=>document.getElementById('eIban').focus());await modal(p,'faux');await sleep(2500);
  ok('7.3 mauvais mot de passe : IBAN reste masqué',await p.evaluate(()=>document.getElementById('eIban').value==='FR76 •••• •••• 0189'));
  await p.evaluate(()=>document.getElementById('eIban').focus());await modal(p,'motdepasse1');await sleep(2500);
  ok('7.4 bon mot de passe : IBAN visible et modifiable',await p.evaluate(()=>document.getElementById('eIban').value==='FR7630006000011234567890189'));
  await p.fill('#eIban','FR7611111111111111111111111');await p.evaluate(()=>{const e=document.getElementById('eIban');e.dispatchEvent(new Event('change'));e.blur()});await sleep(300);
  ok('7.5 nouvel IBAN enregistré puis remasqué',await p.evaluate(()=>db.prof.iban==='FR7611111111111111111111111'&&document.getElementById('eIban').value==='FR76 •••• •••• 1111'));
  await p.evaluate(()=>{ibanSet('FR7622222222222222222222222')});await modal(p,'motdepasse1');await sleep(2500);
  ok('7.6 IBAN dicté dans le chat : enregistré après mot de passe',await p.evaluate(()=>db.prof.iban==='FR7622222222222222222222222'));
  ok('7.7 aucune erreur JavaScript',noErr(errs).length===0,noErr(errs).slice(0,3).join(' || '));
 }
 console.log(R.join('\n'));await br.close();
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

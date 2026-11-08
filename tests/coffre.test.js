/* Tests du coffre casô (navigateur Chromium via Playwright).
   Lancer depuis la racine du dépôt : python3 -m http.server 8765 &   puis   node tests/coffre.test.js */
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
 const bk=p=>p.evaluate(()=>new Promise(ok=>{const q=indexedDB.open('caso_bk',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>{const t=q.result.transaction('kv').objectStore('kv').get('snap');t.onsuccess=()=>ok(JSON.stringify(t.result||null))}}));
 const appUp=p=>p.waitForFunction(()=>typeof db!=='undefined'&&typeof init==='function',null,{timeout:20000});
 const locked=p=>p.evaluate(()=>document.getElementById('s-start').classList.contains('on')&&typeof db==='undefined'&&!!document.querySelector('script[type="text/x-caso"]'));
 async function login(p,mail,pw){await p.fill('#lgMail',mail);await p.fill('#lgPass',pw);await p.click('#lgGo')}
 const noErr=errs=>errs.filter(e=>!/Failed to load resource|net::ERR|favicon/.test(e));

 /* ===== 1. nouveau compte ===== */
 {const {p,errs}=await ctx();await p.goto(B);await appUp(p);
  ok('1.0 sans compte : l’appli démarre normalement, pas de coffre',await p.evaluate(()=>!VAULT.on&&!VAULT.has()&&typeof db!=='undefined'));
  const code=await p.evaluate(async()=>{document.getElementById('acNom').value='Jean Dupont';document.getElementById('acMail').value='jean@test.fr';document.getElementById('acPass').value='motdepasse1';
   await acSubmit();db.quotes.push({id:'qsecret',client:'Marie Dupont Secret',lines:[],date:'2026-11-08'});db.prof.iban='FR7612345678901234567890123';save();
   localStorage.setItem('devis_sync',JSON.stringify({url:'https://srv.example',token:'TOKEN-SECRET-123'}));
   await new Promise(r=>setTimeout(r,1500));return ONB.code});
  ok('1.1 code de secours créé',/^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(code||''),code);
  const r=await raw(p),J=JSON.stringify(r);
  ok('1.2 coffre créé (mot de passe + code de secours)',(()=>{const m=JSON.parse(r.caso_vault||'null');return !!(m&&m.p&&m.r)})());
  ok('1.3 plus de devisbtp en clair',!('devisbtp' in r)&&/^v1\./.test(r.caso_x_devisbtp||''));
  ok('1.4 client, IBAN, jeton introuvables en clair dans le stockage',!/Marie Dupont Secret|FR7612345678901234567890123|TOKEN-SECRET-123/.test(J));
  await sleep(800);const b=await bk(p);
  ok('1.5 copie de secours IndexedDB sans données en clair',b!=='null'&&!/Marie Dupont Secret|FR761234|TOKEN-SECRET/.test(b),b.length+' car.');
  const ph=await p.evaluate(async()=>{await PH.put('t1','data:image/png;base64,SECRETPHOTO');const v=await PH.get('t1');
   const rawv=await new Promise(ok=>{const q=indexedDB.open('caso_ph',1);q.onsuccess=()=>{const t=q.result.transaction('ph').objectStore('ph').get('t1');t.onsuccess=()=>ok(t.result)}});return [v,String(rawv).slice(0,3)]});
  ok('1.6 photo de plan chiffrée et relue',ph[0]==='data:image/png;base64,SECRETPHOTO'&&ph[1]==='v1.',ph.join(' | '));
  await p.evaluate(()=>dvOpen());await sleep(2500);
  const dv=await p.evaluate(async()=>{const f=document.querySelector('#dvx iframe');const A=f&&f.contentWindow.CasoDevis;if(!A)return 'pas d’API';
   await A.creerDevis({client:'Client Iframe Secret',lignes:[{des:'Peinture',qte:'2',unite:'u',pu:'10',tva:10}],ouvrir:false});await new Promise(r=>setTimeout(r,800));
   const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=VAULT.raw.get(k)}return JSON.stringify(o)});
  ok('1.7 module devis : données chiffrées aussi',dv!=='pas d’API'&&!/Client Iframe Secret/.test(dv)&&!/"caso_dv_/.test(dv)&&/caso_x_caso_dv_/.test(dv),dv==='pas d’API'?dv:'');
  await p.evaluate(()=>{try{dvClose()}catch(e){}});
  await p.reload();await sleep(800);
  ok('1.8 au rechargement : écran de connexion, appli pas lancée',await locked(p));
  await login(p,'jean@test.fr','mauvais');await sleep(2500);
  ok('1.9 mauvais mot de passe refusé',await p.evaluate(()=>!document.getElementById('lgErr').hidden&&typeof db==='undefined'),await p.textContent('#lgErr'));
  await login(p,'autre@test.fr','motdepasse1');await sleep(300);
  ok('1.10 mauvais e-mail refusé',await p.evaluate(()=>typeof db==='undefined'));
  await login(p,'jean@test.fr','motdepasse1');await appUp(p);await sleep(1500);
  const st=await p.evaluate(()=>({q:db.quotes.some(q=>q.client==='Marie Dupont Secret'),iban:db.prof.iban,tok:getSync().token,start:document.body.classList.contains('starting'),on:[...document.querySelectorAll('section.on')].map(s=>s.id)}));
  ok('1.11 bon mot de passe : données retrouvées',st.q&&st.iban==='FR7612345678901234567890123'&&st.tok==='TOKEN-SECRET-123',JSON.stringify(st));
  ok('1.12 l’appli s’affiche (plus d’écran de connexion)',!st.start&&st.on.length>0&&!st.on.includes('s-start'),st.on.join(','));
  const ph2=await p.evaluate(()=>PH.get('t1'));ok('1.13 photo relue après réouverture',ph2==='data:image/png;base64,SECRETPHOTO');
  await p.evaluate(()=>{window.confirm=()=>true;logout()});await sleep(1500);
  ok('1.14 se déconnecter verrouille le coffre',await locked(p));
  await p.click('#lgForgot');await p.fill('#fgCode',code.toLowerCase());await p.fill('#fgPass','nouveau-mdp-9');await p.click('#fgForm button[type=submit]');
  await appUp(p);await sleep(1500);
  ok('1.15 code de secours : coffre ouvert, données là',await p.evaluate(()=>db.quotes.some(q=>q.client==='Marie Dupont Secret')));
  ok('1.16 nouveau code de secours affiché',await p.evaluate(()=>!document.getElementById('rcBox').hidden&&/^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(document.getElementById('rcCode').textContent)));
  await p.reload();await sleep(500);await login(p,'jean@test.fr','motdepasse1');await sleep(2500);
  ok('1.17 ancien mot de passe refusé',await p.evaluate(()=>typeof db==='undefined'));
  await login(p,'jean@test.fr','nouveau-mdp-9');await appUp(p);
  ok('1.18 nouveau mot de passe accepté',await p.evaluate(()=>db.quotes.some(q=>q.client==='Marie Dupont Secret')));
  ok('1.19 ancien code de secours n’ouvre plus le coffre',await p.evaluate(async c=>{try{await VAULT.unlockCode(c.replace(/[^A-Z0-9]/g,''));return false}catch(e){return true}},code));
  await p.evaluate(()=>{VAULT.IDLE=1;VAULT._last=0;VAULT.tick()});await sleep(2000);
  ok('1.20 inactivité : verrouillage automatique',await locked(p));
  for(let i=0;i<5;i++){await login(p,'jean@test.fr','faux'+i);await sleep(2300)}
  const lk=await p.textContent('#lgErr');ok('1.21 5 essais ratés : attente imposée',/Trop d'essais/.test(lk),lk);
  ok('1.22 aucune erreur JavaScript',noErr(errs).length===0,noErr(errs).slice(0,4).join(' || '));
 }

 /* ===== 2. compte existant (avant la mise à jour) : mise en place du coffre ===== */
 {const {p,errs}=await ctx();await p.goto(B);await appUp(p);
  await p.evaluate(async()=>{const enc=new TextEncoder(),salt=crypto.getRandomValues(new Uint8Array(16)),hx=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
   const k=await crypto.subtle.importKey('raw',enc.encode('ancienmdp1'),'PBKDF2',false,['deriveBits']);
   const h=hx(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:1000},k,256));
   const rs=crypto.getRandomValues(new Uint8Array(16)),k2=await crypto.subtle.importKey('raw',enc.encode('ABCDE23456'),'PBKDF2',false,['deriveBits']);
   const rh=hx(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:rs,iterations:1000},k2,256));
   localStorage.clear();
   localStorage.setItem('caso_account',JSON.stringify({v:1,id:'u1',prenom:'Paul',email:'paul@test.fr',algo:'pbkdf2-sha256',iter:1000,salt:hx(salt),hash:h,rsalt:hx(rs),riter:1000,rhash:rh,mode:'artisan'}));
   localStorage.setItem('devisbtp',JSON.stringify({prices:[],quotes:[{id:'q1',client:'Paul Martin Secret',lines:[]}],counter:1,prof:{nom:'Entreprise Paul'},hist:[]}));
   localStorage.setItem('devis_sync',JSON.stringify({url:'https://srv.example',token:'TOKEN-PAUL'}));
   localStorage.setItem('m3d_projs','[{"nom":"Maison Secret Rue"}]');localStorage.setItem('caso_sig','data:image/png;base64,SIGNATURESECRET');localStorage.setItem('caso_ts',String(Date.now()));
  });
  await p.reload();await sleep(800);
  ok('2.1 compte existant : connexion demandée une fois',await locked(p));
  await login(p,'paul@test.fr','ancienmdp1');await appUp(p);await sleep(2500);
  const J=JSON.stringify(await raw(p));
  ok('2.2 anciennes données chiffrées (devis, jeton, croquis 3D, signature)',!/Paul Martin Secret|TOKEN-PAUL|Maison Secret Rue|SIGNATURESECRET/.test(J)&&/caso_x_devisbtp/.test(J)&&/caso_x_m3d_projs/.test(J));
  ok('2.3 données toujours là dans l’appli',await p.evaluate(()=>db.quotes[0].client==='Paul Martin Secret'&&getSync().token==='TOKEN-PAUL'&&localStorage.getItem('caso_sig')==='data:image/png;base64,SIGNATURESECRET'));
  ok('2.4 nouveau code de secours donné',await p.evaluate(()=>!document.getElementById('rcBox').hidden));
  const c=await p.textContent('#rcCode');await p.reload();await sleep(500);
  await p.click('#lgForgot');await p.fill('#fgCode',c);await p.fill('#fgPass','paul-nouveau');await p.click('#fgForm button[type=submit]');await appUp(p);
  ok('2.5 ce code de secours ouvre bien le coffre',await p.evaluate(()=>db.quotes[0].client==='Paul Martin Secret'));
  await sleep(800);const b=await bk(p);ok('2.6 copie de secours sans données en clair',!/Paul Martin Secret|TOKEN-PAUL|SIGNATURESECRET/.test(b));
  ok('2.7 aucune erreur JavaScript',noErr(errs).length===0,noErr(errs).slice(0,4).join(' || '));
 }

 /* ===== 3. Face ID / empreinte (authentificateur virtuel avec PRF) ===== */
 {const {c,p,errs}=await ctx();const cdp=await c.newCDPSession(p);let va=null;
  try{await cdp.send('WebAuthn.enable');va=await cdp.send('WebAuthn.addVirtualAuthenticator',{options:{protocol:'ctap2',transport:'internal',hasResidentKey:true,hasUserVerification:true,isUserVerified:true,automaticPresenceSimulation:true,hasPrf:true}})}catch(e){ok('3.0 authentificateur virtuel',false,e.message)}
  if(va){await p.goto(B);await appUp(p);
   await p.evaluate(async()=>{document.getElementById('acNom').value='Lea';document.getElementById('acMail').value='lea@test.fr';document.getElementById('acPass').value='motdepasse2';await acSubmit();db.quotes.push({id:'qb',client:'Bio Secret',lines:[]});save();await new Promise(r=>setTimeout(r,800))});
   const on=await p.evaluate(async()=>{try{return await VAULT.bioOn(accountGet())}catch(e){return 'ERR '+e.message}});
   ok('3.1 Face ID activé',on===true,String(on));
   await p.reload();await sleep(1500);
   if(await p.evaluate(()=>typeof db==='undefined'))await p.click('#lgBio');
   await appUp(p);ok('3.2 Face ID ouvre le coffre',await p.evaluate(()=>db.quotes.some(q=>q.client==='Bio Secret')));
   await p.evaluate(()=>VAULT.bioOff());await p.reload();await sleep(800);
   ok('3.3 Face ID désactivé : bouton masqué, mot de passe demandé',await p.evaluate(()=>document.getElementById('lgBio').hidden&&typeof db==='undefined'));
   ok('3.4 aucune erreur JavaScript',noErr(errs).length===0,noErr(errs).slice(0,4).join(' || '));}
 }
 console.log(R.join('\n'));await br.close();
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

/* Tests du coffre dans l'appli installée (Android / iPhone) : Face ID ou l'empreinte passe par la clé gardée par le téléphone
   (plugin natif CasoBio), ici remplacé par un faux trousseau. Le vrai plugin se vérifie sur un téléphone.
   Lancer depuis la racine du dépôt : python3 -m http.server 8765 &   puis   node tests/coffre-natif.test.js */
const {chromium}=require('playwright');
const B='http://localhost:8765/';
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* faux téléphone : Capacitor présent, trousseau dans sessionStorage (il survit au rechargement, comme le vrai) */
const FAUX=()=>{
 const T={get:()=>sessionStorage.getItem('__trousseau'),set:v=>sessionStorage.setItem('__trousseau',v),del:()=>sessionStorage.removeItem('__trousseau')};
 const J=k=>{try{return JSON.parse(sessionStorage.getItem(k)||'null')}catch(e){return null}};
 const note=a=>{const l=J('__appels')||[];l.push(a);sessionStorage.setItem('__appels',JSON.stringify(l))};
 const etat=()=>J('__etat')||{};
 const bio={
  disponible:async()=>{note('disponible');return{ok:etat().absent!==true,type:'face'}},
  creer:async()=>{note('creer');if(etat().refuse)throw new Error('annule');const b=crypto.getRandomValues(new Uint8Array(32));const s=btoa(String.fromCharCode.apply(null,b));T.set(s);return{secret:s}},
  lire:async()=>{note('lire');if(etat().refuse)throw new Error('annule');if(etat().invalide)throw new Error('invalide');const s=T.get();if(!s)throw new Error('absente');return{secret:s}},
  effacer:async()=>{note('effacer');T.del()}};
 const autre=new Proxy({},{get:()=>async()=>({})});
 window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'ios',registerPlugin:n=>n==='CasoBio'?bio:autre};
 const cr=navigator.credentials;if(cr){const c=cr.create.bind(cr),g=cr.get.bind(cr);cr.create=function(){note('passkey');return c.apply(null,arguments)};cr.get=function(){note('passkey');return g.apply(null,arguments)}}
};
(async()=>{
 const br=await chromium.launch();
 async function ctx(){const c=await br.newContext();await c.addInitScript(FAUX);const p=await c.newPage();const errs=[];
  p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());return{p,errs}}
 const appUp=p=>p.waitForFunction(()=>typeof db!=='undefined'&&typeof init==='function',null,{timeout:30000});
 const locked=p=>p.evaluate(()=>document.getElementById('s-start').classList.contains('on')&&typeof db==='undefined');
 const appels=p=>p.evaluate(()=>JSON.parse(sessionStorage.getItem('__appels')||'[]'));
 const etat=(p,o)=>p.evaluate(o=>sessionStorage.setItem('__etat',JSON.stringify(o)),o);
 const brut=p=>p.evaluate(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=VAULT.raw.get(k)}return JSON.stringify(o)});

 /* ===== compte avec mot de passe, Face ID activé ensuite ===== */
 {const {p,errs}=await ctx();await p.goto(B);await appUp(p);
  await p.evaluate(async()=>{document.getElementById('acCgu').checked=true;document.getElementById('acNom').value='Jean';document.getElementById('acMail').value='jean@test.fr';document.getElementById('acPass').value='motdepasse1';await acSubmit();
   db.quotes.push({id:'qn',client:'Client Natif Secret',lines:[]});save();await new Promise(r=>setTimeout(r,800))});
  ok('appli installée : Face ID proposé par le téléphone',await p.evaluate(()=>VAULT.bioOk()));
  const on=await p.evaluate(async()=>{try{return await VAULT.bioOn(accountGet())}catch(e){return 'ERR '+e.message}});
  let m=await p.evaluate(()=>JSON.parse(VAULT.raw.get('caso_vault')));
  ok('Face ID activé avec la clé du téléphone (pas de passkey)',on===true&&m.b&&m.b.nat===1&&!m.b.c&&!m.b.s&&!(await appels(p)).includes('passkey'),JSON.stringify(Object.keys(m.b||{})));
  const secret=await p.evaluate(()=>sessionStorage.getItem('__trousseau'));
  ok('le secret biométrique n’est écrit nulle part dans le stockage de l’appli',!!secret&&!(await brut(p)).includes(secret));
  await p.reload();await sleep(1500);
  if(await p.evaluate(()=>typeof db==='undefined'))await p.click('#lgBio');
  await appUp(p);
  ok('réouverture : Face ID ouvre le coffre, données retrouvées',await p.evaluate(()=>db.quotes.some(q=>q.client==='Client Natif Secret'))&&(await appels(p)).includes('lire'));
  ok('confirmation d’une action sensible par Face ID',await p.evaluate(()=>VAULT.bioCheck())===true);
  // Face ID refusé : le coffre reste fermé, le mot de passe marche toujours
  await etat(p,{refuse:true});await p.reload();await sleep(1200);
  const vis=await p.evaluate(()=>!document.getElementById('lgBio').hidden);await p.click('#lgBio');await sleep(600);
  ok('Face ID refusé : coffre toujours fermé',vis&&await locked(p));
  await p.fill('#lgMail','jean@test.fr');await p.fill('#lgPass','motdepasse1');await p.click('#lgGo');await appUp(p);
  ok('le mot de passe ouvre toujours',await p.evaluate(()=>db.quotes.some(q=>q.client==='Client Natif Secret')));
  // visages ou empreintes du téléphone changés : la clé native est invalide
  await etat(p,{invalide:true});await p.reload();await sleep(1200);await p.click('#lgBio');await sleep(600);
  ok('empreintes changées sur le téléphone : Face ID n’ouvre plus',await locked(p));
  await p.fill('#lgMail','jean@test.fr');await p.fill('#lgPass','motdepasse1');await p.click('#lgGo');await appUp(p);
  await etat(p,{});
  await p.evaluate(()=>VAULT.bioOff());await sleep(200);m=await p.evaluate(()=>JSON.parse(VAULT.raw.get('caso_vault')));
  ok('Face ID désactivé : clé effacée du téléphone',!m.b&&(await appels(p)).includes('effacer')&&await p.evaluate(()=>sessionStorage.getItem('__trousseau'))===null);
  ok('aucune erreur JavaScript',errs.length===0,errs.slice(0,3).join(' | '));
 }

 /* ===== compte sans mot de passe (Google / Outlook) : Face ID seul ===== */
 {const {p,errs}=await ctx();await p.goto(B);await appUp(p);
  const cr=await p.evaluate(async()=>{db.quotes.push({id:'qg',client:'Client Google Secret',lines:[]});save();
   try{return await VAULT.createBio({email:'lea@test.fr',prenom:'Lea'})}catch(e){return 'ERR '+e.message}});
  await sleep(1200);const m=await p.evaluate(()=>JSON.parse(VAULT.raw.get('caso_vault')));
  ok('compte sans mot de passe : coffre créé avec la clé du téléphone',cr===true&&m.b&&m.b.nat===1&&!m.p,String(cr));
  ok('données chiffrées',!/Client Google Secret/.test(await brut(p)));
  const lu=await p.evaluate(async()=>{const k=JSON.parse(VAULT.raw.get('caso_vault'));const d=await VAULT.bioCheck();return d});
  ok('Face ID confirme',lu===true);
  ok('aucune erreur JavaScript',errs.length===0,errs.slice(0,3).join(' | '));
 }

 /* ===== téléphone sans biométrie ===== */
 {const {p}=await ctx();await p.goto(B);await appUp(p);await etat(p,{absent:true});
  ok('téléphone sans Face ID ni empreinte : non proposé',await p.evaluate(()=>VAULT.bioOk())===false);
  await etat(p,{refuse:true});
  const cr=await p.evaluate(async()=>{try{return await VAULT.createBio({email:'x@test.fr'})}catch(e){return 'ERR'}});
  ok('création refusée par Face ID : aucun coffre laissé derrière',cr==='ERR'&&await p.evaluate(()=>!VAULT.on&&!VAULT.has()));
 }
 console.log(R.join('\n'));await br.close();if(R.some(l=>l.startsWith('FAIL')))process.exit(1);
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

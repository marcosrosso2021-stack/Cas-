// Reprise d'une analyse vidéo : on recharge la page au milieu (comme le verrouillage de casô ou l'appli fermée par le téléphone)
// node reprise.js <bricoleur|artisan> <secondes avant la coupure>
const {chromium}=require('playwright');
const MODE=process.argv[2]||'bricoleur',CUT=+(process.argv[3]||100),URL0='http://127.0.0.1:8790/index.html',VID='/home/claude/mod/_t/test.webm';
(async()=>{
  const b=await chromium.launch({proxy:{server:process.env.HTTPS_PROXY,bypass:'127.0.0.1,localhost'},args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const ctx=await b.newContext({serviceWorkers:'block',viewport:{width:430,height:860}}),p=await ctx.newPage();
  const errs=[],logs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{const t=m.text();if(/\[vid\]/.test(t))logs.push(t.slice(0,160))});
  await p.addInitScript(m=>{localStorage.setItem('caso_account',JSON.stringify({prenom:'Test',email:'t@e.fr',mode:m,lang:'fr'}));localStorage.setItem('caso_lang','fr');},MODE);
  await p.goto(URL0);await p.waitForTimeout(3500);
  if(MODE==='artisan'){await p.evaluate(()=>m3dOpen());await p.waitForTimeout(2500)}
  const clic=async sel=>{for(let k=0;k<20;k++){for(const f of p.frames()){const c=await f.$(sel).catch(()=>null);if(c&&await c.isVisible().catch(()=>false)){await c.click().catch(()=>{});return f}}await p.waitForTimeout(400)}return null};
  const F=await clic('[data-sec="reno"]');if(!F){console.log('rénovation introuvable');process.exit(1)}
  await p.waitForTimeout(1500);await F.evaluate(()=>{window.__vdebug=true});
  const t0=Date.now();await F.setInputFiles('#rv-vid',VID);
  let last='';while(Date.now()-t0<CUT*1000){last=await F.evaluate(()=>{const b=document.getElementById('busy');return b&&!b.hidden?document.getElementById('busy-t').textContent:''}).catch(()=>'');await p.waitForTimeout(1000)}
  console.log('coupure après',CUT,'s, étape :',last);
  await p.reload();const t1=Date.now();await p.waitForTimeout(1500);
  let G=null;for(let k=0;k<60&&!G;k++){for(const f of p.frames())if(f!==p.mainFrame()&&await f.evaluate(()=>!!document.getElementById('busy')&&!!document.getElementById('toast')).catch(()=>false))G=f;if(!G)await p.waitForTimeout(500)}
  if(!G){console.log('module pas rouvert');process.exit(1)}
  await G.evaluate(()=>{window.__vdebug=true});
  const pill=async()=>p.evaluate(()=>{const b=document.getElementById('m3d-pill');return b&&!b.hidden?b.textContent:''});
  let seen=false,steps=[],pl='';while(Date.now()-t1<900e3){const st=await G.evaluate(()=>{const b=document.getElementById('busy');return b&&!b.hidden?document.getElementById('busy-t').textContent:''}).catch(()=>'');
    if(st){seen=true;if(steps[steps.length-1]!==st)steps.push(st)}const q=await pill();if(q)pl=q;if(seen&&!st)break;if(!seen&&Date.now()-t1>40e3)break;await p.waitForTimeout(1000)}
  await p.waitForTimeout(2500);
  const R=await G.evaluate(async()=>{const sp=window.__vidSpec,S=window.__m3dS;const job=await new Promise(ok=>{const r=indexedDB.open('caso_vjob',1);r.onsuccess=()=>{const q=r.result.transaction('s').objectStore('s').getAllKeys();q.onsuccess=()=>ok(q.result)};r.onerror=()=>ok('err')});
    return{room:sp&&[sp.room.width,sp.room.depth,sp.room.wallHeight],n:sp&&sp.objects.length,eqs:S?S.eqs.filter(e=>e.vid).length:0,restes:job}}).catch(e=>({err:String(e)}));
  console.log(JSON.stringify({mode:MODE,repriseVue:seen,apresReprise_s:Math.round((Date.now()-t1)/1000),etapes:steps.length,premiere:steps[0],pastille:pl,R,errs:errs.slice(0,3)}));
  console.log(logs.filter(l=>/reprise|durée/.test(l)).map(l=>l.replace('[vid] ','')).join(' | '));
  await b.close()})();

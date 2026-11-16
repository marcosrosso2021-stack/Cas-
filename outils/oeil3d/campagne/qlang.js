// Essai rapide du chat 3D : projet issu d'une vraie analyse vidéo (référence du 14/11), session vierge, phrases enchaînées
const {chromium}=require('playwright'),fs=require('fs');
const ref=JSON.parse(fs.readFileSync('ref_bricoleur.json','utf8')),projs=ref.lsTop.m3d_projs;
const msgs=JSON.parse(fs.readFileSync(process.argv[2]||'qlang.json','utf8'));
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext({serviceWorkers:'block',viewport:{width:430,height:860}}),p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.route('**/lib/m3d.html',async rt=>{const r=await rt.fetch();let s=await r.text();s=s.replace('function chatSend(raw){','window.__m3dS=S;window.__open=id=>openProj(id);window.__chatSend=x=>chatSend(x);window.__toFr=x=>toFr(x);window.__gp=x=>genParse(x);function chatSend(raw){');rt.fulfill({response:r,body:s})});
 await p.addInitScript(pj=>{localStorage.setItem('caso_account',JSON.stringify({prenom:'T',email:'t@e.fr',mode:process.env.MODE||'bricoleur',lang:'fr'}));localStorage.setItem('caso_lang','fr');},projs);
 await p.goto('http://127.0.0.1:8790/index.html');await p.waitForTimeout(4000);
 await p.evaluate(m=>{if(typeof m3dOpen==='function'&&!window.M3D)m3dOpen(m)},(process.env.MODE||'bricoleur')==='bricoleur').catch(()=>{});let F=null;for(let k=0;k<30&&!F;k++){for(const f of p.frames())if(f!==p.mainFrame()&&await f.evaluate(()=>!!window.__m3dS).catch(()=>false))F=f;if(!F)await p.waitForTimeout(500)}
 if(process.env.SEC)await F.click('[data-sec="'+process.env.SEC+'"]').catch(()=>{});await p.waitForTimeout(2500);
 let ok=0;for(const [m,l] of msgs){const t=await F.evaluate(x=>window.__toFr(x),m);const g=t.lang===l;ok+=g;if(!g)console.log('ERREUR',m,'attendu',l,'lu',t.lang,'→',t.txt)}console.log('bonnes',ok,'/',msgs.length);await b.close()})();

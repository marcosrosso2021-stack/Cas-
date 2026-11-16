// Sonde D-FINE : scores d'une classe Objects365 sur les images de la vidéo
const {chromium}=require('playwright'),fs=require('fs');
const ids=(process.argv[2]||'81').split(',').map(Number),thr=+(process.argv[3]||0.1);
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const p=await (await b.newContext({serviceWorkers:'block'})).newPage();
 await p.route('**/lib/m3d.html',async rt=>{const r=await rt.fetch();let s=await r.text();s=s.replace('function chatSend(raw){','window.__visRaw=(c,i,t)=>visRaw(c,i,t);window.__visLoad=()=>visLoad();function chatSend(raw){');rt.fulfill({response:r,body:s})});
 await p.addInitScript(()=>{localStorage.setItem('caso_account',JSON.stringify({prenom:'T',email:'t@e.fr',mode:'bricoleur',lang:'fr'}));localStorage.setItem('caso_lang','fr')});
 await p.goto('http://127.0.0.1:8790/index.html');await p.waitForTimeout(4000);
 await p.evaluate(()=>{if(typeof m3dOpen==='function'&&!window.M3D)m3dOpen(true)}).catch(()=>{});
 let F=null;for(let k=0;k<30&&!F;k++){for(const f of p.frames())if(f!==p.mainFrame()&&await f.evaluate(()=>!!window.__visRaw).catch(()=>false))F=f;if(!F)await p.waitForTimeout(500)}
 if(!F){console.log('pas de cadre');process.exit(1)}
 const files=fs.readdirSync(process.env.IMAGES||'tmpfr').filter(f=>f.endsWith('.jpg')).sort();
 for(const f of files){const o=await F.evaluate(async([u,ids,thr])=>{await window.__visLoad();const im=new Image();im.src=u;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;c.getContext('2d').drawImage(im,0,0);const r=await window.__visRaw(c,ids,thr);return r&&r.map(d=>[d.id,+d.sc.toFixed(2),Math.round(d.cx),Math.round(d.cy),Math.round(d.w),Math.round(d.h)])},['/'+(process.env.IMAGES_URL||'tmpfr')+'/'+f,ids,thr]);
   console.log(f,JSON.stringify(o))}
 await b.close()})();

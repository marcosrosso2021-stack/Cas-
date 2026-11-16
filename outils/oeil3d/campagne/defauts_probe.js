// Essai des détecteurs de défauts (peinture écaillée, carreau fendu) sur des murs redressés de synthèse
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const p=await (await b.newContext({serviceWorkers:'block'})).newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.route('**/lib/m3d.html',async rt=>{const r=await rt.fetch();let s=await r.text();s=s.replace('function chatSend(raw){','window.__rs={rsPeel,rsCracks};function chatSend(raw){');rt.fulfill({response:r,body:s})});
 await p.addInitScript(()=>{localStorage.setItem('caso_account',JSON.stringify({prenom:'T',email:'t@e.fr',mode:'bricoleur',lang:'fr'}));localStorage.setItem('caso_lang','fr')});
 await p.goto('http://127.0.0.1:8790/index.html');await p.waitForTimeout(4000);
 await p.evaluate(()=>{if(typeof m3dOpen==='function'&&!window.M3D)m3dOpen(true)}).catch(()=>{});
 let F=null;for(let k=0;k<30&&!F;k++){for(const f of p.frames())if(f!==p.mainFrame()&&await f.evaluate(()=>!!window.__rs).catch(()=>false))F=f;if(!F)await p.waitForTimeout(500)}
 const res=await F.evaluate(()=>{const ppm=200,L=4,Hm=2.5,W=L*ppm,Hh=Hm*ppm;let seed=3;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  const mk=draw=>{const c=document.createElement('canvas');c.width=W;c.height=Hh;const x=c.getContext('2d');draw(x);const d=x.getImageData(0,0,W,Hh).data;
    for(let j=0;j<d.length;j+=4){const nz=(rnd()-0.5)*10;d[j]+=nz;d[j+1]+=nz;d[j+2]+=nz}return d};
  const paint=x=>{x.fillStyle='rgb(200,190,170)';x.fillRect(0,0,W,Hh);const g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'rgba(0,0,0,0.06)');g.addColorStop(1,'rgba(255,255,255,0.05)');x.fillStyle=g;x.fillRect(0,0,W,Hh)};
  const blob=(x,cx,cy,r,col)=>{x.fillStyle=col;x.beginPath();const k=30;for(let i=0;i<=k;i++){const a=i/k*Math.PI*2,rr=r*(0.3+rnd()*1.1);x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}x.fill()};
  const tiles=(x,m)=>{x.fillStyle='rgb(235,235,232)';x.fillRect(0,0,W,Hh);x.strokeStyle='rgb(150,150,145)';x.lineWidth=3;for(let X=0;X<W;X+=m*ppm){x.beginPath();x.moveTo(X,0);x.lineTo(X,Hh);x.stroke()}for(let Y=Hh;Y>0;Y-=m*ppm){x.beginPath();x.moveTo(0,Y);x.lineTo(W,Y);x.stroke()}};
  const n=W*Hh,IN=new Uint8Array(n).fill(1),OUT=new Uint8Array(n),F=new Uint8Array(n),top=()=>0,R={};
  const run=(nm,d,tile)=>{R[nm]={peel:window.__rs.rsPeel(d,W,Hh,IN,OUT,F,ppm,Hm,[],top,null),cr:tile?window.__rs.rsCracks(d,W,Hh,IN,OUT,F,ppm,Hm,[],top,tile):window.__rs.rsCracks(d,W,Hh,IN,OUT,F,ppm,Hm,[],top)}};
  run('mur propre',mk(paint));
  run('écaillage (1,0 ; 1,4)',mk(x=>{paint(x);for(let i=0;i<9;i++)blob(x,1.0*ppm+(rnd()-0.5)*0.4*ppm,(Hm-1.4)*ppm+(rnd()-0.5)*0.3*ppm,0.03*ppm+rnd()*0.04*ppm,i%2?'rgb(238,236,230)':'rgb(160,150,135)')}));
  run('écaillage clair seul (2,8 ; 0,9)',mk(x=>{paint(x);for(let i=0;i<6;i++)blob(x,2.8*ppm+(rnd()-0.5)*0.35*ppm,(Hm-0.9)*ppm+(rnd()-0.5)*0.25*ppm,0.03*ppm+rnd()*0.03*ppm,'rgb(240,238,232)')}));
  run('un trou rond (2 ; 1,2)',mk(x=>{paint(x);x.fillStyle='rgb(60,55,50)';x.beginPath();x.arc(2*ppm,(Hm-1.2)*ppm,0.02*ppm,0,7);x.fill()}));
  run('une fissure (1,5 ; 1,5)',mk(x=>{paint(x);x.strokeStyle='rgb(110,100,90)';x.lineWidth=2;x.beginPath();x.moveTo(1.2*ppm,(Hm-1.3)*ppm);x.lineTo(1.5*ppm,(Hm-1.5)*ppm);x.lineTo(1.8*ppm,(Hm-1.8)*ppm);x.stroke()}));
  run('papier peint à motif',mk(x=>{paint(x);for(let X=10;X<W;X+=40)for(let Y=10;Y<Hh;Y+=40)blob(x,X,Y,8,'rgb(150,140,120)')}));
  run('carrelage intact',mk(x=>tiles(x,0.3)),0.3);
  run('carreau fendu (1,05 ; 1,35)',mk(x=>{tiles(x,0.3);x.strokeStyle='rgb(90,90,88)';x.lineWidth=2;x.beginPath();x.moveTo(0.95*ppm,(Hm-1.25)*ppm);x.lineTo(1.05*ppm,(Hm-1.33)*ppm);x.lineTo(1.15*ppm,(Hm-1.45)*ppm);x.stroke()}),0.3);
  return R});
 for(const k in res)console.log(k.padEnd(32),'écaillage',JSON.stringify(res[k].peel),' traits',JSON.stringify(res[k].cr));console.log('erreurs',errs.slice(0,3));await b.close()})();

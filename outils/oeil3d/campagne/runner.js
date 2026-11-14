/* Campagne ŒIL 3D : exécute chaque utilisateur dans une session de navigateur vierge (contexte isolé, stockage vide),
   sur l'appli casô réelle (serveur de test local, aucune donnée de production).
   Le module 3D reçoit une sonde de lecture (window.__m3dS, window.__chatSend) injectée au chargement dans l'environnement de test ;
   le code du logiciel n'est pas modifié.
   node runner.js [ids…]   → journal/<id>.json + journal/<id>.png */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const SC=require('./scenarios.js'),D=path.join(__dirname,'data'),J=path.join(__dirname,process.env.JOURNAL||'journal');fs.mkdirSync(J,{recursive:true});
const URL0='http://127.0.0.1:8790/index.html';
const ids=process.argv.slice(2).map(Number).filter(Boolean),todo=ids.length?SC.filter(s=>ids.includes(s.id)):SC;
const SEED=fs.readFileSync(path.join(__dirname,'seed.js'),'utf8');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function run(b,sc){
  const R={id:sc.id,debut:new Date().toISOString(),etapes:[],erreurs:[],console:[],main:null,m3d:null,t:{}};
  const ctx=await b.newContext({serviceWorkers:'block',viewport:{width:430,height:860},acceptDownloads:true}),p=await ctx.newPage();
  p.on('pageerror',e=>R.erreurs.push(e.message.slice(0,300)));
  p.on('console',m=>{const t=m.text();if(m.type()==='error'&&!/Failed to load resource|ERR_TUNNEL|net::|VerifyOutputSizes/.test(t))R.erreurs.push('console: '+t.slice(0,200));if(/\[vid\]/.test(t))R.console.push(t.slice(0,200))});
  await p.route('**/lib/m3d.html',async rt=>{const r=await rt.fetch();let s=await r.text();
    s=s.replace('function chatSend(raw){','window.__m3dS=S;window.__chatSend=x=>chatSend(x);function chatSend(raw){');rt.fulfill({response:r,body:s})});
  await p.addInitScript(([m])=>{localStorage.setItem('caso_account',JSON.stringify({prenom:'Test',email:'t@e.fr',mode:m,lang:'fr'}));localStorage.setItem('caso_lang','fr');window.__vdebug=true},[sc.mode==='a'?'artisan':'bricoleur']);
  const T0=Date.now();await p.goto(URL0);await sleep(3500);
  await p.evaluate(()=>{document.body.classList.remove('starting')}).catch(()=>{});
  // 1) appli principale : le chat de casô (là où un artisan écrit d'abord)
  const hasMain=await p.evaluate(()=>typeof chatSend==='function'&&typeof tab==='function').catch(()=>false);
  if(hasMain&&(sc.mode==='a'||sc.sec==='main')){
    try{await p.evaluate(()=>tab('chat'));await p.waitForFunction(()=>window.casoPont&&casoPont.ready,null,{timeout:20000});
      if(sc.mode==='a')await p.evaluate(s=>eval(s),SEED);
      const n=await p.evaluate(()=>CHAT.m.length),t=Date.now();await p.evaluate(x=>chatSend(x),sc.texte);await sleep(900);
      await p.waitForFunction(()=>!window.chatMulti||!chatMulti.busy,null,{timeout:15000}).catch(()=>{});await sleep(400);
      const rep=await p.evaluate(n=>CHAT.m.slice(n).filter(m=>m.who==='bot').map(m=>String(m.html||'').replace(/<[^>]+>/g,' ').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/\s+/g,' ').trim()),n);
      const vis=await p.evaluate(()=>({m3d:!!(document.getElementById('m3d')&&!document.getElementById('m3d').hidden)}));
      R.main={reponses:rep,ms:Date.now()-t,ouvre3d:vis.m3d};R.etapes.push('chat principal : '+rep.length+' réponse(s)');
      await p.screenshot({path:path.join(J,sc.id+'_main.png')});
    }catch(e){R.main={err:String(e).slice(0,200)};R.etapes.push('chat principal indisponible : '+String(e).slice(0,80))}
  }
  if(sc.sec==='main'){R.t.total=Date.now()-T0;await ctx.close();return R}
  // 2) module 3D (ŒIL 3D)
  try{
    await p.evaluate(m=>{if(typeof m3dOpen==='function'&&!window.M3D)m3dOpen(m)},sc.mode==='b').catch(()=>{});
    let F=null;for(let k=0;k<40&&!F;k++){for(const f of p.frames())if(f!==p.mainFrame()&&await f.evaluate(()=>!!window.__m3dS).catch(()=>false))F=f;if(!F)await sleep(500)}
    if(!F)throw new Error('module 3D non chargé');
    const clic=async sel=>{for(let k=0;k<12;k++){const c=await F.$(sel).catch(()=>null);if(c&&await c.isVisible().catch(()=>false)){await c.click().catch(()=>{});return true}await sleep(300)}return false};
    const state=()=>F.evaluate(()=>{const S=window.__m3dS;const cut=(k,v)=>['walls','vid','cv','img','src','pts','q','canvas','photo','photos','data','orig','graphe'].includes(k)?undefined:v;
      return{screen:S.screen,W:S.W,scale:S.scale,walls:(S.walls||[]).length,ops:(S.ops||[]).map(o=>o.type),eqs:(S.eqs||[]).map(e=>({t:e.type,vid:e.vid?1:0,lab:e.lab||'',cls:e.vcls||'',x:e.x,y:e.y,sw:e.sw,sh:e.sh,col:e.col})),
        finish:JSON.stringify(S.finish||[]),wallDef:JSON.stringify(S.wallDef||null),floorDef:JSON.stringify(S.floorDef||null),roof:JSON.stringify(S.roof||null),ext:JSON.stringify(S.ext||null),lvl:JSON.stringify(S.lvl||null),
        rooms:(S.roomNames||[]).length,piece:(S.rooms||[]).map(r=>({n:r.name||'',m2:+(r.areaPx*(S.scale||0)**2).toFixed(1)})),bbox:(()=>{const w=S.walls||[];if(!w.length||!S.scale)return null;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const q of w){if(q.o==='h'){y0=Math.min(y0,q.p);y1=Math.max(y1,q.p);x0=Math.min(x0,q.a);x1=Math.max(x1,q.b)}else{x0=Math.min(x0,q.p);x1=Math.max(x1,q.p);y0=Math.min(y0,q.a);y1=Math.max(y1,q.b)}}return[+((x1-x0)*S.scale).toFixed(2),+((y1-y0)*S.scale).toFixed(2)]})(),rnv:S.rnv?JSON.stringify(S.rnv,cut).slice(0,6000):null,rnvKeys:S.rnv?Object.keys(S.rnv):[],pid:S.pid||null,nchat:document.querySelectorAll('#chat-l > *').length}});
    const okSec=await clic(`[data-sec="${sc.sec}"]`);R.etapes.push('section '+sc.sec+(okSec?' ouverte':' introuvable'));await sleep(800);
    R.t.init=Date.now()-T0;
    // données de test
    const media=sc.media;R.donnees=media;
    if(media==='video'){await clic('#b-room');const t=Date.now();await F.setInputFiles('#rv-vid',path.join(D,'chambre.webm'));const steps=[];
      while(Date.now()-t<1500e3){const st=await F.evaluate(()=>{const b=document.getElementById('busy');return b&&!b.hidden?document.getElementById('busy-t').textContent:''}).catch(()=>'');
        if(st&&steps[steps.length-1]!==st)steps.push(st);if(!st&&Date.now()-t>20e3)break;await sleep(1000)}
      R.t.reconstruction=Date.now()-t;R.reco={etapes:steps.length,toast:await F.evaluate(()=>(document.querySelector('.toast')||{}).textContent||''),
        spec:await F.evaluate(()=>{const sp=window.__vidSpec;return sp?{room:sp.room,notes:sp.notes,openings:sp.openings,objects:sp.objects.map(o=>({label:o.label,cls:o.cls,type:o.type,x:o.x,z:o.z,y:o.y,w:o.w,d:o.d,h:o.h,statut:o.mes&&o.mes.largeur&&o.mes.largeur.statut}))}:null})};
      R.etapes.push('vidéo analysée en '+Math.round(R.t.reconstruction/1000)+' s');}
    else if(media==='photos'){await clic('#b-room');const ins=await F.evaluate(()=>[...document.querySelectorAll('input[type=file]')].filter(i=>i.offsetParent||i.closest('label')&&i.closest('label').offsetParent).map(i=>i.id+':'+i.accept));
      R.entrees_fichier=ins;const imgIn=ins.map(x=>x.split(':')).find(([id,a])=>/image/.test(a)&&id!=='in-file');
      if(imgIn){await F.setInputFiles('#'+imgIn[0],[1,3,5,7,9].map(i=>path.join(D,'photo_'+i+'.png')));await sleep(4000);R.etapes.push('photos données à #'+imgIn[0])}
      else R.etapes.push('aucune entrée ne prend des photos ici (entrées : '+ins.join(', ')+')');}
    else if(media==='plan'){const t=Date.now();await F.setInputFiles('#in-file',path.join(D,'plan_main.jpg'));const seen=[];
      for(let k=0;k<25;k++){await sleep(1500);const s=await F.evaluate(()=>{const S=window.__m3dS,b=document.getElementById('busy');return{sc:S.screen,busy:b&&!b.hidden,scale:S.scale}});
        if(s.busy)continue;if(seen[seen.length-1]!==s.sc)seen.push(s.sc);if(s.sc==='3d')break;
        if(s.sc==='crop')await clic('#b-crop');else if(s.sc==='plan'){if(!s.scale){const ai=await F.$('#ask-in');if(ai&&!R.cote){R.cote=1;await F.fill('#ask-in','10');await clic('#ask-ok');R.etapes.push('cote donnée par l\'utilisateur : mur en jaune = 10 m');continue}R.etapes.push('le plan demande une cote');break}await clic('#b-result')}else if(s.sc==='result')await clic('#b-3d,.btn');}
      R.t.reconstruction=Date.now()-t;R.plan={ecrans:seen,etat:await state()};R.etapes.push('plan : '+seen.join(' → '));}
    else R.etapes.push(media==='none'?'aucune donnée nécessaire':'donnée adaptée indisponible : '+media.replace('absent:',''));
    const before=await state();R.avant=before;
    // 3) la demande, telle qu'un utilisateur la tape dans le chat du module
    const chatVis=await F.$eval('#chat-in',e=>!!(e.offsetWidth||e.offsetHeight)).catch(()=>false);R.chat_visible=chatVis;
    const ask=async txt=>{const n=await F.evaluate(()=>document.querySelectorAll('#chat-l > *').length);const t=Date.now();
      if(chatVis){await F.fill('#chat-in',txt);await F.press('#chat-in','Enter')}else await F.evaluate(x=>window.__chatSend(x),txt);
      await sleep(1600);const b=await F.evaluate(()=>{const x=document.getElementById('busy');return x&&!x.hidden});if(b){for(let k=0;k<120;k++){await sleep(1000);if(!(await F.evaluate(()=>{const x=document.getElementById('busy');return x&&!x.hidden})))break}}
      const rep=await F.evaluate(n=>[...document.querySelectorAll('#chat-l > *')].slice(n).map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean),n);return{rep,ms:Date.now()-t}};
    const a1=await ask(sc.texte);const after=await state();R.m3d={reponses:a1.rep,ms:a1.ms,apres:after};
    await p.screenshot({path:path.join(J,sc.id+'.png')});
    if(sc.suite){const a2=await ask(sc.suite);R.suite={reponses:a2.rep,ms:a2.ms,apres:await state()};await p.screenshot({path:path.join(J,sc.id+'_suite.png')})}
    // fonctions existantes non perturbées : le module répond encore à une demande simple, l'annulation marche
    const z=await ask('annule');R.annule={reponses:z.rep};
  }catch(e){R.erreurs.push('exécution : '+String(e).slice(0,300));R.etapes.push('arrêt : '+String(e).slice(0,100))}
  R.t.total=Date.now()-T0;await ctx.close();return R}
(async()=>{const W=+process.env.WORKERS||1,q=todo.slice();
  const worker=async k=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
    while(q.length){const sc=q.shift();let R;try{R=await run(b,sc)}catch(e){R={id:sc.id,erreurs:['harnais : '+String(e)]}}
      R.scenario=sc;fs.writeFileSync(path.join(J,sc.id+'.json'),JSON.stringify(R,null,1));
      console.log(new Date().toISOString().slice(11,19),'#'+sc.id,sc.titre,'|',(R.etapes||[]).join(' ; '),'|',((R.m3d&&R.m3d.reponses)||(R.main&&R.main.reponses)||[]).join(' / ').slice(0,160),'| err',(R.erreurs||[]).length)}
    await b.close()};
  await Promise.all([...Array(W)].map((_,k)=>worker(k)))})();

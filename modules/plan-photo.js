/* casô · Plan à partir d'une photo et tour de la pièce
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Plan à partir d'une photo ----------
   Tout se fait sur le téléphone : la photo n'est envoyée nulle part.
   Repérage (vision par ordinateur, sans bibliothèque) : flou, gradients de Sobel, segments verticaux
   (angles de mur, montants de portes et fenêtres), lignes horizontales (sol, plafond, linteaux).
   Les cotes tirées d'une seule photo sont des ESTIMATIONS : chaque cote garde sa source
   (est = estimée, cal = calibrée au laser, der = recalculée, trc = tracée au doigt, def = valeur type,
   las = mesurée au laser, man = saisie) et n'est exacte qu'une fois validée par l'artisan (ok). */
const PL_H0=2.5;                       // hauteur sous plafond courante, base de l'estimation
const PH={_d:null,
 open(){if(!this._d)this._d=new Promise((ok,ko)=>{try{const r=indexedDB.open('caso_ph',1);r.onupgradeneeded=()=>r.result.createObjectStore('ph');r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)}catch(e){ko(e)}});return this._d},
 async put(k,v){if(window.VAULT&&VAULT.on&&typeof v==='string')v=await VAULT.encStr('ph:'+k,v);const d=await this.open();return new Promise((ok,ko)=>{const t=d.transaction('ph','readwrite');t.objectStore('ph').put(v,k);t.oncomplete=()=>ok();t.onerror=()=>ko(t.error)})},
 async get(k){const d=await this.open();const v=await new Promise((ok,ko)=>{const r=d.transaction('ph').objectStore('ph').get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)});
  return typeof v==='string'&&v.startsWith('v1.')&&window.VAULT&&VAULT.on?VAULT.decStr('ph:'+k,v):v},
 async del(k){const d=await this.open();return new Promise(ok=>{const t=d.transaction('ph','readwrite');t.objectStore('ph').delete(k);t.oncomplete=()=>ok();t.onerror=()=>ok()})}};
const PL_MEM={};
let PL=null,PLB='devis',PLS=null,PLVB=null,PL_TMP=null,plCur='plan',PLDRAG=null;
const r5=v=>Math.round(v*20)/20;
const plF=(v,d=2)=>(+v||0).toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d});
const plL=i=>String.fromCharCode(65+i);
const plLen=(P,i)=>{const a=P[i],b=P[(i+1)%P.length];return Math.hypot(b[0]-a[0],b[1]-a[1])};
function plArea(P){let s=0;for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];s+=a[0]*b[1]-b[0]*a[1]}return Math.abs(s)/2}
function plInside(P,x,y){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
function plNum(s){
 s=String(s||'').trim().toLowerCase().replace(/\s+/g,'');
 let m=s.match(/^(\d+)m(\d{1,2})$/);if(m)return +m[1]+(+m[2])/(m[2].length===1?10:100);
 m=s.match(/^(\d+(?:[.,]\d+)?)(mm|cm|m)?$/);if(!m)return NaN;
 let v=parseFloat(m[1].replace(',','.'));
 if(m[2]==='mm')v/=1000;else if(m[2]==='cm')v/=100;else if(!m[2]){if(v>=1000)v/=1000;else if(v>=30)v/=100}
 return v}
const PL_SRC={est:'Estimée sur la photo',cal:'Calibrée au laser',der:'Recalculée',trc:'Tracée au doigt',vis:'Visée au téléphone',fit:'Recalée sur tes mesures',def:'Valeur type',las:'Mesurée au laser',man:'Saisie à la main'};
const PL_OT={porte:'Porte',pfen:'Porte-fenêtre',fen:'Fenêtre'};

/* ---- 1. Repérage dans la photo ---- */
function plDetect(img){
 const M=360,iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,r=Math.min(1,M/Math.max(iw,ih));
 const W=Math.max(16,Math.round(iw*r)),H=Math.max(16,Math.round(ih*r)),N=W*H;
 const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,W,H);
 const d=x.getImageData(0,0,W,H).data;
 let g=new Float32Array(N);for(let i=0;i<N;i++)g[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];
 const lum=g.slice();
 const blur=a=>{const o=new Float32Array(N);for(let y=0;y<H;y++)for(let X=0;X<W;X++){let s=0,n=0;for(let dy=-1;dy<=1;dy++){const yy=y+dy;if(yy<0||yy>=H)continue;for(let dx=-1;dx<=1;dx++){const xx=X+dx;if(xx<0||xx>=W)continue;s+=a[yy*W+xx];n++}}o[y*W+X]=s/n}return o};
 g=blur(blur(g));
 const gx=new Float32Array(N),gy=new Float32Array(N),mg=new Float32Array(N);let mx=1;
 for(let y=1;y<H-1;y++)for(let X=1;X<W-1;X++){const i=y*W+X;
  const a=g[i-W-1],b=g[i-W],cc=g[i-W+1],dd=g[i-1],f=g[i+1],h=g[i+W-1],k=g[i+W],l=g[i+W+1];
  const sx=(cc+2*f+l)-(a+2*dd+h),sy=(h+2*k+l)-(a+2*b+cc);gx[i]=sx;gy[i]=sy;const m=Math.hypot(sx,sy);mg[i]=m;if(m>mx)mx=m}
 const hist=new Uint32Array(256);for(let i=0;i<N;i++)hist[Math.min(255,mg[i]/mx*255|0)]++;
 let acc=0,t=0;for(;t<255;t++){acc+=hist[t];if(acc>=N*.82)break}
 const thr=Math.max(mx*t/255,16),V=new Uint8Array(N),Hh=new Uint8Array(N);
 for(let i=0;i<N;i++){if(mg[i]<thr)continue;const ax=Math.abs(gx[i]),ay=Math.abs(gy[i]);if(ax>ay*2)V[i]=1;else if(ay>ax*1.2)Hh[i]=1}
 // segments verticaux (bande de 3 colonnes, petits trous tolérés)
 const segs=[],gapMax=Math.max(3,H*.015);
 for(let X=1;X<W-1;X++){let y0=-1,gap=0,last=-1;
  for(let y=0;y<=H;y++){const on=y<H&&(V[y*W+X]||V[y*W+X-1]||V[y*W+X+1]);
   if(on){if(y0<0)y0=y;last=y;gap=0}
   else if(y0>=0){gap++;if(gap>gapMax||y===H){if(last-y0>=H*.12)segs.push({x:X,y0,y1:last,len:last-y0});y0=-1;gap=0}}}}
 segs.sort((a,b)=>b.len-a.len);const vs=[];
 for(const s of segs){if(vs.some(k=>Math.abs(k.x-s.x)<=Math.max(3,W*.015)&&Math.min(k.y1,s.y1)-Math.max(k.y0,s.y0)>.5*Math.min(k.len,s.len)))continue;vs.push(s)}
 // lignes horizontales : sol (bas) et plafond (haut)
 const row=new Float32Array(H);for(let y=1;y<H-1;y++){let n=0;for(let X=0;X<W;X++)if(Hh[y*W+X]||Hh[(y-1)*W+X]||Hh[(y+1)*W+X])n++;row[y]=n}
 const best=(a,b)=>{let by=-1,bv=0;for(let y=Math.max(1,a|0);y<Math.min(H-1,b|0);y++)if(row[y]>bv){bv=row[y];by=y}return bv>=W*.18?by:null};
 const floorY=best(H*.5,H-1),ceilY=best(1,H*.4);
 const top=ceilY!=null?ceilY:0,bot=floorY!=null?floorY:H,wp=Math.max(bot-top,H*.3);
 // angles de mur : segments longs qui montent jusqu'au plafond et descendent jusqu'au sol
 const corners=[];
 vs.filter(s=>s.len>=wp*.6&&s.x>W*.03&&s.x<W*.97&&s.y0<=top+wp*.18&&s.y1>=bot-wp*.18)
  .forEach(s=>{if(corners.length<3&&!corners.some(k=>Math.abs(k.x-s.x)<W*.08))corners.push(s)});
 corners.sort((a,b)=>a.x-b.x);
 // ouvertures : deux montants de même hauteur, un linteau entre les deux
 const cand=vs.filter(s=>!corners.includes(s)&&s.len>=wp*.15&&s.len<=wp*.92),ops=[];
 const hcov=(y,x0,x1)=>{let n=0;for(let X=x0;X<=x1;X++){let on=0;for(let dy=-2;dy<=2;dy++){const yy=y+dy;if(yy>0&&yy<H&&Hh[yy*W+X])on=1}n+=on}return n/Math.max(1,x1-x0+1)};
 const mean=(x0,y0,x1,y1)=>{let s=0,n=0;for(let y=Math.max(0,y0|0);y<Math.min(H,y1|0);y+=2)for(let X=Math.max(0,x0|0);X<Math.min(W,x1|0);X+=2){s+=lum[y*W+X];n++}return n?s/n:0};
 for(let i=0;i<cand.length;i++)for(let j=0;j<cand.length;j++){const a=cand[i],b=cand[j];if(b.x<=a.x)continue;
  const dx=b.x-a.x;if(dx<W*.05||dx>W*.5)continue;
  if(Math.abs(a.y0-b.y0)>H*.07||Math.abs(a.y1-b.y1)>H*.1)continue;
  if(corners.some(k=>k.x>a.x&&k.x<b.x))continue;
  const yT=Math.round((a.y0+b.y0)/2),yB=Math.round((a.y1+b.y1)/2),cov=hcov(yT,a.x,b.x);if(cov<.35)continue;
  let tp=null;
  if(yB>=bot-wp*.1&&yB-yT>=wp*.5)tp='porte';
  else if(yB<bot-wp*.12&&yT>top+wp*.02)tp='fen';
  if(!tp)continue;
  const inn=mean(a.x+2,yT+2,b.x-2,yB-2),out=(mean(a.x-dx*.3,yT,a.x-2,yB)+mean(b.x+2,yT,b.x+dx*.3,yB))/2;
  let sc=cov+(a.len+b.len)/(2*wp);if(tp==='fen'&&inn>out+12)sc+=.4;
  if(tp==='porte'&&yB-yT>wp*.92)tp='pfen';
  ops.push({t:tp,x0:a.x,x1:b.x,y0:yT,y1:yB,sc})}
 ops.sort((a,b)=>b.sc-a.sc);const keep=[];
 const iou=(a,b)=>{const ix=Math.max(0,Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0)),iy=Math.max(0,Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0)),I=ix*iy;return I/((a.x1-a.x0)*(a.y1-a.y0)+(b.x1-b.x0)*(b.y1-b.y0)-I)};
 for(const o of ops){if(keep.length>=4)break;if(!keep.some(k=>iou(k,o)>.15||(o.x0<k.x1&&o.x1>k.x0)))keep.push(o)}
 return{w:W,h:H,floor:floorY!=null?floorY/H:null,ceil:ceilY!=null?ceilY/H:null,
  corners:corners.map(s=>({x:s.x/W,on:true})),
  ops:keep.map(o=>({t:o.t,x0:o.x0/W,x1:o.x1/W,y0:o.y0/H,y1:o.y1/H,on:true}))}}

/* ---- 2. Du repérage au plan (estimations) ---- */
function plBuild(det){
 const Wp=det.w,Hp=det.h,fl=(det.floor!=null?det.floor:.92)*Hp,ce=(det.ceil!=null?det.ceil:0)*Hp,wp=Math.max(fl-ce,Hp*.3),s=PL_H0/wp;
 const cs=det.corners.filter(c=>c.on).map(c=>c.x*Wp).sort((a,b)=>a-b),bd=[0,...cs,Wp];
 const sg=[];for(let i=0;i<bd.length-1;i++)sg.push({a:bd[i],b:bd[i+1],w:bd[i+1]-bd[i],full:i>0&&i<bd.length-2});
 let mi=0;const full=sg.filter(x=>x.full);
 if(full.length){const m=full.reduce((p,x)=>x.w>p.w?x:p);mi=sg.indexOf(m)}else sg.forEach((x,i)=>{if(x.w>sg[mi].w)mi=i});
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const L=r5(clamp(sg[mi].w*s*(sg[mi].full?1:1.15),1.5,12));
 const side=Math.max(mi>0?sg[mi-1].w:0,mi<sg.length-1?sg[mi+1].w:0);
 const D=r5(side?clamp(side*s*2.5,1.8,10):clamp(L*.8,1.8,10));
 const pts=[[0,0],[L,0],[L,D],[0,D]],wm=pts.map(()=>({src:'est',ok:false})),ops=[];
 det.ops.filter(o=>o.on).forEach(o=>{
  const x0=o.x0*Wp,x1=o.x1*Wp,cx=(x0+x1)/2,si=sg.findIndex(q=>cx>=q.a&&cx<=q.b);
  const wid=r5(clamp((x1-x0)*s,.4,4)),hgt=r5(clamp((o.y1-o.y0)*Hp*s,.3,3)),sill=o.t==='fen'?r5(clamp((fl-o.y1*Hp)*s,0,2)):0;
  let w=0,off;
  if(si===mi||si<0){off=r5(clamp((x0-sg[mi].a)*s,0,Math.max(0,L-wid)))}
  else{w=si<mi?3:1;const len=w===1?D:D;off=r5(Math.max(0,(len-wid)/2))}
  ops.push({id:uid(),w,t:o.t,off,wid,hgt,sill,src:'est',ok:false})});
 return{pts,wm,ops,h:{v:PL_H0,src:'est',ok:false},cal:false,k:1}}

/* ---- 3. Point d'entrée : la feuille « Plan à partir d'une photo » ---- */
function plSheet(on){const s=$('plSh'),b=$('plShBg');if(on){b.hidden=false;s.hidden=false;requestAnimationFrame(()=>{s.classList.add('on');b.classList.add('on')})}
 else{s.classList.remove('on');b.classList.remove('on');setTimeout(()=>{s.hidden=true;b.hidden=true},200)}}
function plStep(st){document.querySelectorAll('#plSh [data-st]').forEach(e=>e.hidden=e.dataset.st!==st)}
function plStart(cli){
 PL_TMP={cli:cli||''};plStep('src');$('plPrj').innerHTML='';
 let las=false;try{las=localStorage.getItem('caso_laser')==='1'}catch(e){}$('plLas').checked=las;
 const R=db.plans.slice().sort((a,b)=>(b.date||0)-(a.date||0)).slice(0,3);
 $('plRecent').innerHTML=R.length?`<h2 class="grp"><span>Plans récents</span></h2><div class="lst">`+R.map(p=>plItem(p,'devis')).join('')+'</div>':'';
 plSheet(true)}
function plItem(p,back){const c=db.clients.find(x=>x.id===p.cid),todo=plTodoOf(p);
 return `<button class="it it-main pl-it" onclick="plSheet(false);plOpen('${p.id}','${back}')">${p.th?`<img src="${p.th}" alt="">`:`<span class="pl-noimg"><svg class="i"><use href="#i-plan"/></svg></span>`}
 <span class="pl-it-b"><span class="it-t"><b data-noi18n>${esc(p.nom)}</b><span class="mut" data-noi18n>${todo?'~':''}${plF(plArea(p.pts),1)} m²</span></span>
 <span class="mut it-s"><span data-noi18n>${esc(c?c.nom:'')}</span> · <span class="tag ${todo?'pl-tw':'pl-tk'}">${todo?'À vérifier':'Cotes validées'}</span></span></span></button>`}
function plLasPref(v){try{localStorage.setItem('caso_laser',v?'1':'0')}catch(e){}}
function plPick(cam){const i=$(cam?'plCam':'plImp');i.value='';i.click()}
function plLoadImg(src){return new Promise((ok,ko)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>ko(new Error('image'));im.src=src})}
function plShrink(im,max,qual){const r=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');
 c.width=Math.round(im.naturalWidth*r);c.height=Math.round(im.naturalHeight*r);c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c.toDataURL('image/jpeg',qual)}
async function plPicked(inp){
 const f=inp.files&&inp.files[0];if(!f)return;
 try{
  const url=URL.createObjectURL(f),im=await plLoadImg(url);URL.revokeObjectURL(url);
  const img=plShrink(im,1600,.82),th=plShrink(im,240,.6),im2=await plLoadImg(img);
  Object.assign(PL_TMP,{img,th,el:im2,iw:im2.naturalWidth,ih:im2.naturalHeight});
 }catch(e){toast(i18nT('Photo illisible. Essaie une autre photo.'));return}
 PL_TMP.tour=false;$('plPrev').hidden=false;$('plPrev').src=PL_TMP.th;
 $('plCli').value=PL_TMP.cli||q.client||'';
 $('plCliDl').innerHTML=db.clients.map(c=>`<option value="${esc(c.nom)}">`).join('');
 $('plRoom').value='';$('plPrjN').value='';$('plRoom').placeholder=i18nT('Ex. Salon, Cuisine, Chambre 1');
 plPrjFill();plStep('who');setTimeout(()=>{if(!$('plCli').value)$('plCli').focus()},250)}
function plPrjFill(){
 const c=findBy(db.clients,$('plCli').value),P=c?db.projects.filter(p=>p.cid===c.id):[];
 const sel=$('plPrj'),cur=sel.value;
 sel.innerHTML=P.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).map(p=>`<option value="${p.id}" data-noi18n>${esc(p.nom)}</option>`).join('')+`<option value="__new" data-noi18n>${esc(i18nT('Nouveau projet'))}</option>`;
 if([...sel.options].some(o=>o.value===cur))sel.value=cur;
 plPrjNew()}
function plPrjDef(){const c=findBy(db.clients,$('plCli').value);return (c&&c.adr)||(q.client&&nameKey(q.client)===nameKey($('plCli').value)&&q.adr)||('Projet du '+dFR())}
function plPrjNew(){const n=$('plPrj').value==='__new';$('plPrjNW').hidden=!n;$('plPrjN').placeholder=plPrjDef()}
function plCtx(){return{nm:$('plCli').value.trim(),pid:$('plPrj').value,prjN:$('plPrjN').value.trim()||plPrjDef(),room:$('plRoom').value.trim(),laser:$('plLas').checked}}
function plOwner(c){
 const {x:cl}=upsert('clients',{nom:c.nm,adr:q.client&&nameKey(q.client)===nameKey(c.nm)?q.adr:''});
 let pr=c.pid&&c.pid!=='__new'?db.projects.find(p=>p.id===c.pid&&p.cid===cl.id):null;
 if(!pr){pr={id:uid(),cid:cl.id,nom:c.prjN,adr:cl.adr||'',createdAt:Date.now()};db.projects.push(pr)}
 return{cl,pr}}
function plTour(){PL_TMP=Object.assign(PL_TMP||{},{tour:true,img:null,th:null});
 $('plPrev').hidden=true;$('plCli').value=PL_TMP.cli||q.client||'';
 $('plCliDl').innerHTML=db.clients.map(c=>`<option value="${esc(c.nom)}">`).join('');
 $('plRoom').value='';$('plPrjN').value='';$('plRoom').placeholder=i18nT('Ex. Salon, Cuisine, Chambre 1');
 plPrjFill();plStep('who');setTimeout(()=>{if(!$('plCli').value)$('plCli').focus()},250)}
async function plCreate(){
 const nm=$('plCli').value.trim();
 if(!nm){$('plCli').setAttribute('aria-invalid','true');$('plCli').focus();toast(i18nT('Indique le client : chaque plan est rangé dans un client.'));return}
 if(PL_TMP&&PL_TMP.tour){const c=plCtx();plSheet(false);PL_TMP=null;trOpen(c);return}
 const ctx=plCtx(),{cl,pr}=plOwner(ctx);
 const nP=db.plans.filter(p=>p.pid===pr.id).length;
 const p={id:uid(),pid:pr.id,cid:cl.id,nom:ctx.room||('Pièce '+(nP+1)),date:Date.now(),th:PL_TMP.th,iw:PL_TMP.iw,ih:PL_TMP.ih,laser:$('plLas').checked};
 plStep('run');
 await new Promise(r=>setTimeout(r,40));
 let det;try{det=plDetect(PL_TMP.el)}catch(e){det={w:PL_TMP.iw,h:PL_TMP.ih,floor:null,ceil:null,corners:[],ops:[]}}
 p.det=det;Object.assign(p,plBuild(det));
 PL_MEM[p.id]=PL_TMP.img;try{await PH.put(p.id,PL_TMP.img)}catch(e){}
 db.plans.push(p);save();
 const nd=det.corners.length,no=det.ops.length;
 chatPush({who:'bot',html:`<p><svg class="i i-sm"><use href="#i-plan"/></svg> <span>Plan créé</span> : <b data-noi18n>${esc(p.nom)}</b> · <span data-noi18n>${esc(cl.nom)}</span> · <span data-noi18n>${esc(pr.nom)}</span></p><p class="mut" data-noi18n>${esc(i18nT('Dimensions estimées : à vérifier.'))}</p><div class="sugg"><button class="btn sm" onclick="plOpen('${p.id}','devis')"><svg class="i i-sm"><use href="#i-plan"/></svg>Ouvrir le plan</button></div>`});
 plSheet(false);PL_TMP=null;
 plOpen(p.id,'devis');
 toast(i18nT(nd||no?'Repérage terminé : vérifie les cotes.':'Rien de sûr repéré : plan type à mesurer.'))}

/* ---- 4. Écran du plan ---- */
async function plOpen(id,back){
 PL=db.plans.find(p=>p.id===id);if(!PL)return;PLB=back||'devis';PLS=null;PLVB=null;
 $('plImg').removeAttribute('src');$('plNoPh').hidden=true;
 go('plan');plPage(PL.laser&&!PL.cal?'plan':'plan');
 let src=PL_MEM[id];if(!src){try{src=await PH.get(id)}catch(e){}}
 if(PL&&PL.id===id){if(src){$('plImg').src=src;for(const k in PL_MEM)if(k!==id)delete PL_MEM[k];PL_MEM[id]=src}else $('plNoPh').hidden=false;plRenderPhoto()}}
function plBack(){if(PLB==='clif'&&cliCur)cliEdit(cliCur.id);else go('devis')}
function plPage(p){plCur=p;segOn('plSeg',p);document.querySelectorAll('#s-plan [data-pl]').forEach(e=>{e.style.display=e.dataset.pl===p?'':'none'});plRender()}
function plSave(){if(!PL)return;PL.upd=Date.now();save()}
function plTodoOf(p){return p.wm.filter(m=>!m.ok).length+(p.h.ok?0:1)+p.ops.filter(o=>!o.ok).length}
function plRender(){
 if(!PL||!$('s-plan').classList.contains('on'))return;
 const c=db.clients.find(x=>x.id===PL.cid),pr=db.projects.find(x=>x.id===PL.pid);
 $('plT').textContent=PL.nom;$('plSub').textContent=[c&&c.nom,pr&&pr.nom].filter(Boolean).join(' · ');
 const todo=plTodoOf(PL);
 $('plWarn').hidden=!todo;$('plOkB').hidden=!!todo;
 $('plWarnT').textContent=PL.laser&&!PL.cal?i18nT('Plan non calibré : mesure le mur A au laser.'):i18nT('{1} cote(s) à vérifier. Dimensions estimées, non vérifiées.').replace('{1}',todo);
 if(plCur==='photo')plRenderPhoto();
 if(plCur==='plan'){plRenderCal();plRenderSvg();plRenderPanel()}
 if(plCur==='qty')plRenderQty()}
function plRenderCal(){
 plRenderTour();
 const on=PL.laser&&!PL.cal;$('plCalP').textContent=i18nT(PL.tour?'Mesure le mur A (entre les angles visés 1 et 2). Tout le plan sera mis à l\'échelle.':'Mesure le mur A (le mur du fond sur la photo). Tout le plan sera mis à l\'échelle.');$('plCal').hidden=!on;$('plLasOn').hidden=PL.laser;
 $('plHB').innerHTML=`<svg class="i i-sm"><use href="#i-height"/></svg><span>Hauteur sous plafond</span><b data-noi18n>${PL.h.ok?'':'~'}${plF(PL.h.v)} m</b>${PL.h.ok?'<svg class="i i-sm ok-c"><use href="#i-check"/></svg>':''}`;
 $('plHB').classList.toggle('pl-est',!PL.h.ok);$('plHB').classList.toggle('sel',!!PLS&&PLS.k==='h')}
function plRenderPhoto(){
 const d=PL&&PL.det,sv=$('plOv');$('plRedoW').hidden=!d;$('plDetH').hidden=!d;
 if(!d){sv.innerHTML='';$('plDetT').innerHTML=PL&&PL.tour?`<span class="pl-chip"><svg class="i i-sm"><use href="#i-360"/></svg><span>Plan fait par le tour de la pièce</span></span>`:'';return}
 const R=Math.round(1000*d.h/d.w),fl=(d.floor!=null?d.floor:.92)*R,ce=(d.ceil!=null?d.ceil:0)*R;sv.setAttribute('viewBox',`0 0 1000 ${R}`);
 let h='';
 if(d.floor!=null)h+=`<line x1="0" x2="1000" y1="${fl}" y2="${fl}" class="ov-fl"/>`;
 if(d.ceil!=null)h+=`<line x1="0" x2="1000" y1="${ce}" y2="${ce}" class="ov-fl"/>`;
 d.corners.forEach((c,i)=>{const x=c.x*1000;h+=`<g class="ov-c ${c.on?'':'off'}" data-dk="c" data-i="${i}"><line x1="${x}" x2="${x}" y1="${ce}" y2="${fl}" class="hit"/><line x1="${x}" x2="${x}" y1="${ce}" y2="${fl}"/></g>`});
 d.ops.forEach((o,i)=>{const x=o.x0*1000,y=o.y0*R,w=(o.x1-o.x0)*1000,hh=(o.y1-o.y0)*R;
  h+=`<g class="ov-o ${o.on?'':'off'}" data-dk="o" data-i="${i}"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6"/><text x="${x+w/2}" y="${y-10}" text-anchor="middle" data-noi18n>${esc(i18nT(PL_OT[o.t]))}</text></g>`});
 sv.innerHTML=h;
 const n=k=>d[k].filter(x=>x.on).length,nd=d.ops.filter(o=>o.on&&o.t!=='fen').length,nf=d.ops.filter(o=>o.on&&o.t==='fen').length;
 $('plDetT').innerHTML=(d.corners.length||d.ops.length)?
  `<span class="pl-chip"><svg class="i i-sm"><use href="#i-plan"/></svg><span data-noi18n>${esc(i18nT('{1} angle(s) de mur').replace('{1}',n('corners')))}</span></span><span class="pl-chip"><svg class="i i-sm"><use href="#i-door"/></svg><span data-noi18n>${esc(i18nT('{1} porte(s)').replace('{1}',nd))}</span></span><span class="pl-chip"><svg class="i i-sm"><use href="#i-win"/></svg><span data-noi18n>${esc(i18nT('{1} fenêtre(s)').replace('{1}',nf))}</span></span>`
  :`<span class="mut" data-noi18n>${esc(i18nT('Rien de sûr repéré : plan type à mesurer.'))}</span>`}
function plOvTap(e){const g=e.target.closest('[data-dk]');if(!g||!PL||!PL.det)return;const L=g.dataset.dk==='c'?PL.det.corners:PL.det.ops,it=L[+g.dataset.i];it.on=!it.on;plSave();plRenderPhoto()}
function plRedo(){
 if(!PL||!PL.det)return;
 const typed=PL.wm.some(m=>m.src==='las'||m.src==='man')||PL.ops.some(o=>o.src==='las'||o.src==='man')||PL.h.src==='las'||PL.h.src==='man';
 if(typed&&!confirm(i18nT('Le plan sera recalculé depuis la photo et tes mesures seront perdues. Continuer ?')))return;
 Object.assign(PL,plBuild(PL.det));PLS=null;PLVB=null;plSave();plPage('plan');toast(i18nT('Plan recalculé : vérifie les cotes.'))}
function plLaserOn(){PL.laser=true;plSave();plRender();setTimeout(()=>$('plCalL').focus(),50)}
function plLaserOff(){PL.laser=false;plSave();plRender()}
function plCalibrate(){
 const L=plNum($('plCalL').value),Hm=$('plCalH').value.trim()?plNum($('plCalH').value):null;
 if(!(L>.3&&L<60)){$('plCalL').setAttribute('aria-invalid','true');toast(i18nT('Mesure illisible. Ex. 3,45 ou 345 cm'));return}
 if(Hm!=null&&!(Hm>1.5&&Hm<12)){$('plCalH').setAttribute('aria-invalid','true');toast(i18nT('Mesure illisible. Ex. 3,45 ou 345 cm'));return}
 if(plCanRefit()){PL.wm[0]={src:'las',ok:true,v:Math.round(L*100)/100};if(Hm)PL.h={v:Math.round(Hm*100)/100,src:'las',ok:true};PL.cal=true;plRefit();return}
 const k=L/plLen(PL.pts,0),hFix=PL.h.src==='las'||PL.h.src==='man'||(PL.tour&&PL.h.src==='est'),hv=hFix?PL.h.v:PL.h.v*k,kv=Hm?Hm/hv*k:k;
 PL.pts.forEach(p=>{p[0]=Math.round(p[0]*k*1000)/1000;p[1]=Math.round(p[1]*k*1000)/1000});
 PL.wm=PL.wm.map((m,i)=>i===0?{src:'las',ok:true}:{src:'cal',ok:false});
 PL.ops.forEach(o=>{if(o.src==='las'||o.src==='man')return;o.off=r5(o.off*k);o.wid=r5(o.wid*k);o.hgt=r5(o.hgt*kv);o.sill=r5(o.sill*kv);o.src='cal';o.ok=false});
 if(Hm)PL.h={v:Math.round(Hm*100)/100,src:'las',ok:true};else if(!PL.h.ok&&!(PL.tour&&PL.h.src==='est'))PL.h={v:r5(PL.h.v*k),src:'cal',ok:false};
 PL.cal=true;PL.k=k;PLVB=null;plClampOps();plSave();plRender();toast(i18nT('Plan calibré. Les autres cotes restent à vérifier.'))}

/* ---- 5. Dessin du plan (SVG, cm) ---- */
function plRenderSvg(keep){
 plTouchShim();
 const P=PL.pts,n=P.length,S=100,sv=$('plSvg');
 if(!keep||!PLVB){let a=1e9,b=1e9,c=-1e9,d=-1e9;P.forEach(p=>{a=Math.min(a,p[0]);b=Math.min(b,p[1]);c=Math.max(c,p[0]);d=Math.max(d,p[1])});
  const pad=Math.max(70,.2*Math.max(c-a,d-b)*S);PLVB=[a*S-pad,b*S-pad,(c-a)*S+2*pad,(d-b)*S+2*pad]}
 sv.setAttribute('viewBox',PLVB.join(' '));
 const fs=Math.max(PLVB[2],PLVB[3])/21,sel=(k,i)=>PLS&&PLS.k===k&&PLS.i===i?' sel':'';
 let h=`<polygon class="pl-room" points="${P.map(p=>p[0]*S+','+p[1]*S).join(' ')}"/>`;
 const lab=[];
 for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n],m=PL.wm[i],L=plLen(P,i);if(!L)continue;
  const ux=(b[0]-a[0])/L,uy=(b[1]-a[1])/L;let nx=-uy,ny=ux;const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
  if(plInside(P,mx+nx*.05,my+ny*.05)){nx=-nx;ny=-ny}
  h+=`<g data-k="w" data-i="${i}"><line class="hit" x1="${a[0]*S}" y1="${a[1]*S}" x2="${b[0]*S}" y2="${b[1]*S}"/><line class="pl-w ${m.ok?'ok':'est'}${sel('w',i)}" x1="${a[0]*S}" y1="${a[1]*S}" x2="${b[0]*S}" y2="${b[1]*S}"/></g>`;
  let ang=Math.atan2(uy,ux)*180/Math.PI;if(ang>90)ang-=180;if(ang<-90)ang+=180;
  const tx=(mx+nx*.42)*S,ty=(my+ny*.42)*S;
  const tt=`${plL(i)} · ${m.ok?'':'~'}${plF(L)}`,tw=fs*(.62*tt.length+1.1);
  lab.push(`<g data-k="w" data-i="${i}" class="pl-lb ${m.ok?'ok':'est'}${sel('w',i)}" transform="translate(${tx} ${ty}) rotate(${ang})"><rect x="${-tw/2}" y="${-fs*.78}" width="${tw}" height="${fs*1.56}" rx="${fs*.4}"/><text y="${fs*.36}" text-anchor="middle" font-size="${fs}">${tt}</text></g>`)}
 PL.ops.forEach((o,j)=>{const i=o.w%n,a=P[i],b=P[(i+1)%n],L=plLen(P,i);if(!L)return;
  const ux=(b[0]-a[0])/L,uy=(b[1]-a[1])/L;let nx=-uy,ny=ux;if(!plInside(P,(a[0]+b[0])/2+nx*.05,(a[1]+b[1])/2+ny*.05)){nx=-nx;ny=-ny}
  const p0=[a[0]+ux*o.off,a[1]+uy*o.off],p1=[a[0]+ux*(o.off+o.wid),a[1]+uy*(o.off+o.wid)],cls=`pl-o ${o.ok?'ok':'est'}${sel('o',j)}`;
  let g=`<line class="pl-gap" x1="${p0[0]*S}" y1="${p0[1]*S}" x2="${p1[0]*S}" y2="${p1[1]*S}"/>`;
  if(o.t==='fen'){[-4,0,4].forEach(e=>{g+=`<line class="${cls}" x1="${p0[0]*S+nx*e}" y1="${p0[1]*S+ny*e}" x2="${p1[0]*S+nx*e}" y2="${p1[1]*S+ny*e}"/>`})}
  else{const lf=[p0[0]+nx*o.wid,p0[1]+ny*o.wid],sw=(ux*ny-uy*nx)>0?1:0;
   g+=`<line class="${cls}" x1="${p0[0]*S}" y1="${p0[1]*S}" x2="${lf[0]*S}" y2="${lf[1]*S}"/><path class="${cls} arc" d="M${lf[0]*S} ${lf[1]*S} A${o.wid*S} ${o.wid*S} 0 0 ${sw} ${p1[0]*S} ${p1[1]*S}"/>`;
   if(o.t==='pfen')g+=`<line class="${cls}" x1="${p0[0]*S}" y1="${p0[1]*S}" x2="${p1[0]*S}" y2="${p1[1]*S}"/>`}
  g+=`<line class="hit" x1="${p0[0]*S}" y1="${p0[1]*S}" x2="${p1[0]*S}" y2="${p1[1]*S}"/>`;
  const cx=(p0[0]+p1[0])/2*S+nx*fs*1.15,cy=(p0[1]+p1[1])/2*S+ny*fs*1.15;
  h+=`<g data-k="o" data-i="${j}">${g}<text class="pl-ot ${o.ok?'ok':'est'}" x="${cx}" y="${cy+fs*.3}" text-anchor="middle" font-size="${fs*.8}">${o.ok?'':'~'}${plF(o.wid)}</text></g>`});
 h+=lab.join('');
 let cx=0,cy=0;P.forEach(p=>{cx+=p[0];cy+=p[1]});cx/=n;cy/=n;
 const ok=PL.wm.every(m=>m.ok);
 if(!plInside(P,cx,cy)){cx=P[0][0]+.6;cy=P[0][1]+.6}
 h+=`<text class="pl-area ${ok?'ok':'est'}" x="${cx*S}" y="${cy*S}" text-anchor="middle" font-size="${fs*1.15}">${ok?'':'~'}${plF(plArea(P),1)} m²</text>`;
 P.forEach((p,i)=>{h+=`<g data-k="v" data-i="${i}"><circle class="hit" cx="${p[0]*S}" cy="${p[1]*S}" r="${fs*1.3}"/><circle class="pl-v${sel('v',i)}" cx="${p[0]*S}" cy="${p[1]*S}" r="${fs*.42}"/></g>`});
 sv.innerHTML=h}
function plPt(e){const sv=$('plSvg'),m=sv.getScreenCTM();if(!m)return null;const p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const r=p.matrixTransform(m.inverse());return[r.x/100,r.y/100]}
function plDown(e){
 const g=e.target.closest('[data-k]');
 if(!g){PLS=null;plRenderSvg(true);plRenderPanel();plRenderCal();return}
 const k=g.dataset.k,i=+g.dataset.i;PLS={k,i};
 if(k==='v'){PLDRAG={i,id:e.pointerId,moved:false,start:plPt(e)};try{$('plSvg').setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()}
 plRenderSvg(true);plRenderPanel();plRenderCal()}
function plMove(e){
 if(!PLDRAG||e.pointerId!==PLDRAG.id)return;const p=plPt(e);if(!p)return;
 if(!PLDRAG.moved&&Math.hypot(p[0]-PLDRAG.start[0],p[1]-PLDRAG.start[1])<.06)return;
 const P=PL.pts,n=P.length,i=PLDRAG.i,pr=P[(i-1+n)%n],nx=P[(i+1)%n];
 let x=r5(p[0]),y=r5(p[1]);
 [pr,nx].forEach(q=>{if(Math.abs(x-q[0])<.15)x=q[0];if(Math.abs(y-q[1])<.15)y=q[1]});
 if(x===P[i][0]&&y===P[i][1])return;
 P[i][0]=x;P[i][1]=y;PLDRAG.moved=true;if(PL.raw)PL.raw.free=true;
 [(i-1+n)%n,i].forEach(j=>{PL.wm[j]={src:'trc',ok:false}});
 plRenderSvg(true)}
function plUp(e){if(!PLDRAG||e.pointerId!==PLDRAG.id)return;const mv=PLDRAG.moved;PLDRAG=null;if(mv){plClampOps();plSave();PLVB=null;plRender()}}

/* ---- 6. Panneau de modification ---- */
function plTag(m){return `<span class="tag ${m.ok?'pl-tk':'pl-tw'}">${m.ok?'Validée':'À vérifier'}</span> <span class="mut pl-src" data-noi18n>${esc(i18nT(PL_SRC[m.src]||''))}</span>`}
function plRenderPanel(){
 const el=$('plPanel'),s=PLS,P=PL.pts,n=P.length,ph=PL.laser?'Mesure au laser':'Mesure';
 const numIn=(id,v,lbl)=>`<label for="${id}">${lbl}</label><div class="pl-in"><input id="${id}" inputmode="decimal" autocomplete="off" value="${plF(v)}" data-noi18n onfocus="this.select()" onkeydown="if(event.key==='Enter'){event.preventDefault();this.closest('.pl-pn').querySelector('.pl-save').click()}"><span class="mut">m</span></div>`;
 if(!s){
  const todo=[],wo=PL.wm.map((m,i)=>i).filter(i=>!PL.wm[i].ok).sort((a,b)=>(plErr(b)||0)-(plErr(a)||0));
  wo.forEach(i=>{const e=plErr(i);todo.push(`<button class="pl-chip est" onclick="plSel('w',${i})"><span>Mur</span> ${plL(i)}${e!=null?` <small data-noi18n>±${Math.max(1,Math.round(e*100))} cm</small>`:''}</button>`)});
  if(!PL.h.ok)todo.push(`<button class="pl-chip est" onclick="plSel('h',0)"><svg class="i i-sm"><use href="#i-height"/></svg><span>Hauteur</span></button>`);
  PL.ops.forEach((o,j)=>{if(!o.ok)todo.push(`<button class="pl-chip est" onclick="plSel('o',${j})"><svg class="i i-sm"><use href="#i-${o.t==='fen'?'win':'door'}"/></svg><span>${esc(PL_OT[o.t])}</span> ${j+1}</button>`)});
  el.innerHTML=`<p class="mut pl-hint">Touche un mur, une ouverture ou un angle pour le modifier. Fais glisser un angle pour corriger le plan.</p>`+(todo.length?`<div class="pl-todo"><b>À vérifier</b><div class="pl-chips">${todo.join('')}</div></div>`:`<p class="pl-allok"><svg class="i i-sm ok-c"><use href="#i-check"/></svg> <span>Toutes les cotes sont validées.</span></p>`);return}
 if(s.k==='w'){const m=PL.wm[s.i],L=plLen(P,s.i);
  el.innerHTML=`<div class="pl-pn"><div class="pl-pt"><b><span>Mur</span> ${plL(s.i)}</b>${plTag(m)}</div>
   ${plErr(s.i)!=null&&!m.ok?`<p class="pl-prec" data-noi18n>${esc(i18nT('Précision estimée : ± {1} cm').replace('{1}',Math.max(1,Math.round(plErr(s.i)*100))))}</p>`:''}
   ${numIn('plLenIn',L,ph)}<p class="mut pl-ex">Ex. 3,45 ou 345 cm</p>
   <button class="btn pl-save" onclick="plSaveLen()"><svg class="i"><use href="#i-ruler"/></svg>Enregistrer la mesure</button>
   ${m.ok?'':`<button class="btn sec" onclick="plOk('w',${s.i})"><svg class="i"><use href="#i-check"/></svg>Valider cette cote</button>`}
   <div class="pl-2"><button class="btn sec" onclick="plAddOp('porte')"><svg class="i"><use href="#i-door"/></svg>Porte</button><button class="btn sec" onclick="plAddOp('fen')"><svg class="i"><use href="#i-win"/></svg>Fenêtre</button></div>
   <button class="btn sec" onclick="plSplit(${s.i})"><svg class="i"><use href="#i-plus"/></svg>Ajouter un angle au milieu</button>
   <button class="lnk sheet-x" onclick="plSel()">Fermer</button></div>`}
 else if(s.k==='h'){const m=PL.h;
  el.innerHTML=`<div class="pl-pn"><div class="pl-pt"><b>Hauteur sous plafond</b>${plTag(m)}</div>
   ${numIn('plHIn',m.v,ph)}<p class="mut pl-ex">Ex. 3,45 ou 345 cm</p>
   <button class="btn pl-save" onclick="plSaveH()"><svg class="i"><use href="#i-ruler"/></svg>Enregistrer la mesure</button>
   ${m.ok?'':`<button class="btn sec" onclick="plOk('h',0)"><svg class="i"><use href="#i-check"/></svg>Valider cette cote</button>`}
   <button class="lnk sheet-x" onclick="plSel()">Fermer</button></div>`}
 else if(s.k==='o'){const o=PL.ops[s.i];if(!o){PLS=null;return plRenderPanel()}
  el.innerHTML=`<div class="pl-pn"><div class="pl-pt"><b>${esc(PL_OT[o.t])} <span data-noi18n>${s.i+1}</span> · <span>Mur</span> ${plL(o.w%n)}</b>${plTag(o)}</div>
   <label for="plOT">Type</label><select id="plOT" onchange="plOpType(this.value)">${Object.keys(PL_OT).map(t=>`<option value="${t}"${t===o.t?' selected':''}>${PL_OT[t]}</option>`).join('')}</select>
   <div class="row"><div>${numIn('plOW',o.wid,'Largeur')}</div><div>${numIn('plOH',o.hgt,'Hauteur')}</div></div>
   <div class="row"><div>${numIn('plOO',o.off,'Depuis le début du mur')}</div><div ${o.t==='fen'?'':'hidden'}>${numIn('plOS',o.sill,'Allège')}</div></div>
   <button class="btn pl-save" onclick="plSaveOp()"><svg class="i"><use href="#i-ruler"/></svg>Enregistrer les mesures</button>
   ${o.ok?'':`<button class="btn sec" onclick="plOk('o',${s.i})"><svg class="i"><use href="#i-check"/></svg>Valider ces cotes</button>`}
   <button class="btn sec ko" onclick="plDelOp(${s.i})">Supprimer l'ouverture</button>
   <button class="lnk sheet-x" onclick="plSel()">Fermer</button></div>`}
 else if(s.k==='v'){
  el.innerHTML=`<div class="pl-pn"><div class="pl-pt"><b><span>Angle</span> ${plL(s.i)}</b></div>
   <p class="mut pl-hint">Fais glisser l'angle pour corriger le plan. Les murs touchés passent « à vérifier ».</p>
   ${n>3?`<button class="btn sec ko" onclick="plDelV(${s.i})">Supprimer cet angle</button>`:''}
   <button class="lnk sheet-x" onclick="plSel()">Fermer</button></div>`}}
function plSel(k,i){PLS=k?{k,i}:null;plRenderSvg(true);plRenderPanel();plRenderCal();if(k)setTimeout(()=>{const e=$('plPanel');if(e&&e.scrollIntoView)e.scrollIntoView({block:'nearest',behavior:'smooth'})},30)}
function plReadNum(id,min,max){const e=$(id),v=plNum(e.value);if(!(v>=min&&v<=max)){e.setAttribute('aria-invalid','true');e.focus();toast(i18nT('Mesure illisible. Ex. 3,45 ou 345 cm'));return null}e.removeAttribute('aria-invalid');return Math.round(v*100)/100}
function plSaveLen(){const i=PLS.i,v=plReadNum('plLenIn',.1,60);if(v==null)return;
 if(plCanRefit()){PL.wm[i]={src:PL.laser?'las':'man',ok:true,v};plRefit();return}
 const P=PL.pts,n=P.length,a=P[i],b=P[(i+1)%n],cur=plLen(P,i);if(!cur)return;
 const ux=(b[0]-a[0])/cur,uy=(b[1]-a[1])/cur,dl=v-cur;let hit=null;
 if(Math.abs(dl)>.001){
  if(n===3){b[0]+=ux*dl;b[1]+=uy*dl;hit=(i+1)%n}
  else{const fw=(i+2)%n,bk=(i-2+n)%n,useBk=PL.wm[fw].ok&&!PL.wm[bk].ok;
   if(!useBk){[(i+1)%n,(i+2)%n].forEach(j=>{P[j][0]+=ux*dl;P[j][1]+=uy*dl});hit=fw}
   else{[i,(i-1+n)%n].forEach(j=>{P[j][0]-=ux*dl;P[j][1]-=uy*dl});hit=bk}}
  P.forEach(p=>{p[0]=Math.round(p[0]*1000)/1000;p[1]=Math.round(p[1]*1000)/1000})}
 const was=hit!=null&&PL.wm[hit].ok;
 if(hit!=null&&hit!==i)PL.wm[hit]={src:'der',ok:false};
 PL.wm[i]={src:PL.laser?'las':'man',ok:true,v};
 plClampOps();PLVB=null;plSave();plRender();
 toast(was?i18nT('Mur {1} recalculé : revérifie-le.').replace('{1}',plL(hit)):i18nT('Mesure enregistrée.'))}
function plSaveH(){const v=plReadNum('plHIn',1.5,12);if(v==null)return;PL.h={v,src:PL.laser?'las':'man',ok:true};if(plCanRefit()&&PL.raw.h){plRefit();return}plSave();plRender();toast(i18nT('Mesure enregistrée.'))}
function plSaveOp(){const o=PL.ops[PLS.i],L=plLen(PL.pts,o.w%PL.pts.length);
 const w=plReadNum('plOW',.2,8);if(w==null)return;const h=plReadNum('plOH',.2,6);if(h==null)return;const f=plReadNum('plOO',0,60);if(f==null)return;
 let s=0;if(o.t==='fen'){s=plReadNum('plOS',0,5);if(s==null)return}
 if(f+w>L+.005){$('plOO').setAttribute('aria-invalid','true');toast(i18nT("L'ouverture dépasse du mur."));return}
 Object.assign(o,{wid:w,hgt:h,off:f,sill:s,src:PL.laser?'las':'man',ok:true});plSave();plRender();toast(i18nT('Mesure enregistrée.'))}
function plOpType(t){const o=PL.ops[PLS.i];o.t=t;if(t!=='fen')o.sill=0;plSave();plRender()}
function plOk(k,i){
 const m=k==='w'?PL.wm[i]:k==='h'?PL.h:PL.ops[i];
 if(['est','cal','der','trc','def','vis','fit'].includes(m.src)&&!confirm(i18nT("Cette cote n'a pas été mesurée. Tu l'as vérifiée sur place ?")))return;
 m.ok=true;plSave();PLS=null;plRender();toast(i18nT('Cote validée.'))}
function plAddOp(t){const i=PLS.i,L=plLen(PL.pts,i),wid=t==='fen'?Math.min(1.2,L*.8):Math.min(.83,L*.8);
 PL.ops.push({id:uid(),w:i,t,off:r5(Math.max(0,(L-wid)/2)),wid:r5(wid),hgt:t==='fen'?1.15:2.04,sill:t==='fen'?.95:0,src:'def',ok:false});
 PLS={k:'o',i:PL.ops.length-1};plSave();plRender()}
function plDelOp(j){if(!confirm(i18nT("Supprimer l'ouverture ?")))return;PL.ops.splice(j,1);PLS=null;plSave();plRender()}
function plSplit(i){if(PL.raw)PL.raw.free=true;const P=PL.pts,n=P.length,a=P[i],b=P[(i+1)%n],L=plLen(P,i);
 P.splice(i+1,0,[r5((a[0]+b[0])/2),r5((a[1]+b[1])/2)]);PL.wm.splice(i,1,{src:'trc',ok:false},{src:'trc',ok:false});
 PL.ops.forEach(o=>{if(o.w>i)o.w++;else if(o.w===i&&o.off>=L/2){o.w=i+1;o.off=r5(o.off-L/2)}});
 PLS={k:'v',i:i+1};plClampOps();plSave();plRender();toast(i18nT("Fais glisser le nouvel angle à sa place."))}
function plDelV(i){const P=PL.pts,n=P.length;if(n<=3)return;if(PL.raw)PL.raw.free=true;
 const pv=(i-1+n)%n;P.splice(i,1);PL.wm.splice(i,1);PL.wm[(i-1+P.length)%P.length]={src:'trc',ok:false};
 PL.ops.forEach(o=>{if(o.w===i)o.w=pv;if(o.w>i)o.w--});
 PL.ops.forEach(o=>{o.w=Math.min(o.w,P.length-1)});
 PLS=null;plClampOps();PLVB=null;plSave();plRender()}
function plClampOps(){const n=PL.pts.length;PL.ops.forEach(o=>{o.w=((o.w%n)+n)%n;const L=plLen(PL.pts,o.w);let ch=0;if(o.wid>L){o.wid=r5(L*.9);ch=1}if(o.off+o.wid>L){o.off=Math.max(0,Math.round((L-o.wid)*100)/100);ch=1}if(ch&&o.ok){o.ok=false;o.src='der'}})}
function plRename(){const v=prompt(i18nT('Nom de la pièce'),PL.nom);if(v&&v.trim()){PL.nom=v.trim();plSave();plRender()}}
async function plDelete(){if(!confirm(i18nT('Supprimer ce plan ?')))return;const id=PL.id;db.plans=db.plans.filter(p=>p.id!==id);delete PL_MEM[id];try{await PH.del(id)}catch(e){}save();PL=null;plBack()}

/* ---- 7. Surfaces, périmètres, quantités ---- */
function plQty(p){
 const P=p.pts,n=P.length,per=P.reduce((s,_,i)=>s+plLen(P,i),0),ar=plArea(P),h=p.h.v;
 const op=p.ops.reduce((s,o)=>s+o.wid*o.hgt,0),doors=p.ops.filter(o=>o.t!=='fen'),wins=p.ops.filter(o=>o.t==='fen');
 const wOk=p.wm.every(m=>m.ok),oOk=p.ops.every(o=>o.ok),dOk=doors.every(o=>o.ok);
 return[
  {k:'sol',lab:'Sol',v:ar,u:'m²',ok:wOk,ic:'area'},
  {k:'pla',lab:'Plafond',v:ar,u:'m²',ok:wOk,ic:'area'},
  {k:'mur',lab:'Murs (ouvertures déduites)',v:Math.max(0,per*h-op),u:'m²',ok:wOk&&oOk&&p.h.ok,ic:'bricks'},
  {k:'per',lab:'Périmètre',v:per,u:'ml',ok:wOk,ic:'ruler'},
  {k:'pli',lab:'Plinthes (portes déduites)',v:Math.max(0,per-doors.reduce((s,o)=>s+o.wid,0)),u:'ml',ok:wOk&&dOk,ic:'ruler'},
  {k:'por',lab:'Portes',v:doors.length,u:'u',ok:oOk,ic:'door'},
  {k:'fen',lab:'Fenêtres',v:wins.length,u:'u',ok:oOk,ic:'win'}]}
const PL_KW={sol:/carrel|parquet|(^|[^a-z])sols?([^a-z]|$)|chape|ragr|lino|moquette/,pla:/plafond/,mur:/peint|enduit|fa[iï]en|placo|papier|mur/,pli:/plinthe/,por:/porte/,fen:/fen[eê]tre/,per:/corniche|joint/};
function plRenderQty(){
 const Q=plQty(PL),todo=plTodoOf(PL),pr=db.prices;
 $('plQ').innerHTML=Q.map(x=>`<div class="pl-q ${x.ok?'':'est'}"><svg class="i"><use href="#i-${x.ic}"/></svg><span class="pl-ql">${esc(x.lab)}</span><b data-noi18n>${x.ok||x.u==='u'?'':'~'}${x.u==='u'?x.v:plF(x.v)} ${x.u}</b></div>`).join('')
  +`<p class="mut pl-ex"><span data-noi18n>${esc(i18nT('Hauteur sous plafond'))} : </span><span data-noi18n>${PL.h.ok?'':'~'}${plF(PL.h.v)} m</span></p>`;
 $('plAdd').innerHTML=Q.filter(x=>x.v>0&&x.k!=='per').map(x=>{const kw=PL_KW[x.k],guess=pr.find(p=>kw&&kw.test(vnNorm(p.nom)));
  return `<div class="pl-ar"><label class="pl-ck"><input type="checkbox" data-q="${x.k}" ${guess?'checked':''}> <span>${esc(x.lab)}</span> <b data-noi18n>${x.u==='u'?x.v:plF(x.v)} ${x.u}</b></label>
  <select data-qs="${x.k}" aria-label="Service"><option value="" data-noi18n>${esc(i18nT('Ligne libre (prix à saisir)'))}</option>${pr.map(p=>`<option value="${p.id}"${guess&&guess.id===p.id?' selected':''} data-noi18n>${esc(pDisp(p))} · ${eur(p.prix)}/${esc(p.unit)}</option>`).join('')}</select></div>`}).join('');
 $('plAddB').disabled=!!todo;
 $('plAddN').textContent=todo?i18nT('Valide d\'abord les {1} cote(s) à vérifier : aucune dimension n\'entre au devis sans ta validation.').replace('{1}',todo):i18nT('Toutes les cotes sont validées.');
 $('plAddN').classList.toggle('pl-warnt',!!todo)}
function plToQuote(){
 if(plTodoOf(PL)){toast(i18nT('Valide d\'abord toutes les cotes.'));plPage('plan');return}
 const Q=plQty(PL),sel=[...document.querySelectorAll('#plAdd input[data-q]:checked')].map(i=>i.dataset.q);
 if(!sel.length){toast(i18nT('Coche au moins une quantité.'));return}
 const cl=db.clients.find(x=>x.id===PL.cid),pr=db.projects.find(x=>x.id===PL.pid);
 if(cl&&q.client&&nameKey(q.client)!==nameKey(cl.nom))chatNew();
 if(cl){q.client=cl.nom;q.tel=q.tel||cl.tel||'';q.adr=q.adr||(pr&&pr.adr)||cl.adr||''}
 const room=PL.nom;let n=0;
 q.planRows=Q.filter(x=>x.v>0).map(x=>({lab:x.lab,v:Math.round(x.v*100)/100,u:x.u,ok:!!x.ok}));q.planFrom=room;q.planAt=ymdL();
 sel.forEach(k=>{const x=Q.find(y=>y.k===k);if(!x)return;const pid=document.querySelector(`#plAdd select[data-qs="${k}"]`).value,p=db.prices.find(y=>y.id===pid);
  const qty=x.u==='u'?x.v:Math.round(x.v*100)/100;
  if(p)q.lines.push({label:p.nom+' — '+room,qty,unit:p.unit,pu:p.prix,tva:p.tva,loc:p.loc&&p.loc.l===I18N.lang?p.loc.t:undefined,plan:PL.id});
  else q.lines.push({label:x.lab+' — '+room,qty,unit:x.u,pu:0,tva:20,plan:PL.id});n++});
 fillForm();store();
 chatPush({who:'bot',html:`<p><svg class="i i-sm"><use href="#i-plan"/></svg> <b data-noi18n>${esc(room)}</b> <span data-noi18n>: ${esc(i18nT('{1} ligne(s) ajoutée(s) au devis depuis le plan validé.').replace('{1}',n))}</span></p>`});
 toast(i18nT('Ajouté au devis.'));go('devis')}

/* ---- 8. Fiche client : projets et plans ---- */
function plCliBlock(){
 if(!cliCur)return;const el=$('cliMore');if(!el||el.querySelector('.pl-cli'))return;
 const P=db.projects.filter(p=>p.cid===cliCur.id).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
 let h=`<div class="pl-cli"><button class="btn sec" onclick="plStart(cliCur.nom)"><svg class="i"><use href="#i-plan"/></svg>Plan à partir d'une photo</button>`;
 if(P.length){h+=`<h2 class="grp"><span>Projets</span><span class="cnt">${P.length}</span></h2>`;
  P.forEach(p=>{const L=db.plans.filter(x=>x.pid===p.id).sort((a,b)=>(a.date||0)-(b.date||0));
   h+=`<div class="pl-prj"><div class="pl-prj-t"><svg class="i i-sm"><use href="#i-building"/></svg><b data-noi18n>${esc(p.nom)}</b><span class="cnt">${L.length}</span></div><div class="lst">${L.map(x=>plItem(x,'clif')).join('')||'<div class="lst-empty mut">Aucun plan.</div>'}</div></div>`})}
 const f=el.firstElementChild;if(f&&f.tagName==='BUTTON')f.insertAdjacentHTML('afterend',h+'</div>');else el.insertAdjacentHTML('afterbegin',h+'</div>')}

/* iPhone sous iOS 12 : pas de Pointer Events → le plan se manipule au toucher */
function plTouchShim(){const sv=$('plSvg');if(!sv||window.PointerEvent||sv._ts)return;sv._ts=1;
 const w=(f,e)=>{const t=(e.changedTouches||[])[0];if(!t)return;f({target:e.type==='touchstart'?e.target:(document.elementFromPoint(t.clientX,t.clientY)||e.target),clientX:t.clientX,clientY:t.clientY,pointerId:1,preventDefault(){e.preventDefault()}})};
 sv.addEventListener('touchstart',e=>w(plDown,e),{passive:false});sv.addEventListener('touchmove',e=>{e.preventDefault();w(plMove,e)},{passive:false});sv.addEventListener('touchend',e=>w(plUp,e))}

/* ---------- Tour de la pièce : l'artisan tourne sur lui-même et vise les angles au sol ----------
   Mesure : orientation du téléphone (gyroscope) → direction visée par l'appareil photo (centre de l'image).
   Distance d'un point au sol = hauteur du téléphone / tan(inclinaison sous l'horizon).
   Calibrage :
   1. visée stabilisée : chaque visée moyenne ~0,6 s d'échantillons et refuse un téléphone qui bouge ;
   2. étalonnage de la hauteur du téléphone avant le tour (pied puis haut d'un mur, hauteur sous plafond connue) ;
   3. mise d'équerre des angles proches de 90° (droites passant par le milieu des murs, recoupées) ;
   4. recalage fin sur les mesures de l'artisan : hauteur du téléphone + biais d'inclinaison ajustés
      par moindres carrés à partir des visées brutes gardées dans le plan ; le biais appris est gardé
      sur le téléphone pour les tours suivants ;
   5. précision estimée (± cm) pour chaque mur, à partir de la géométrie de chaque visée.
   Sans gyroscope (ex. Galaxy A10) : mode « mur par mur », on vise le pied de chaque mur bien en face. */
const TR={ph:'off',mode:'ang',hc:1.5,b0:0,buf:[],ebuf:[],noYaw:false,src:'',last:0,c:[],w:[],ops:[],opA:null,opT:'porte',h:null,hcal:null,calA:null,hold:null,stream:null,img:null,th:null,ctx:null,raf:0};
const trIOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const DEG=Math.PI/180;
function trVec(a,b,g){const cA=Math.cos(a*DEG),sA=Math.sin(a*DEG),cB=Math.cos(b*DEG),sB=Math.sin(b*DEG),cG=Math.cos(g*DEG),sG=Math.sin(g*DEG);
 return[-(cA*sG+cG*sA*sB),-(sA*sG-cA*cG*sB),-(cB*cG)]}           // axe de l'appareil photo (dos du téléphone) dans le repère du monde
function trCal(){try{return JSON.parse(localStorage.getItem('caso_tourcal')||'{}')||{}}catch(e){return{}}}
function trCalPut(o){try{localStorage.setItem('caso_tourcal',JSON.stringify(Object.assign(trCal(),o)))}catch(e){}}

/* ---- capteurs ---- */
function trPush(v,el){
 if(TR.ph==='nosens'&&!TR.denied){TR.mode=TR.noYaw?'mur':'ang';TR.ph=TR.mode;setTimeout(trUI)}
 TR.ebuf.push(el);if(TR.ebuf.length>8)TR.ebuf.shift();if(v){TR.buf.push(v);if(TR.buf.length>8)TR.buf.shift()}
 if(TR.hold)TR.hold.S.push({el,v});
 if(!TR.raf)TR.raf=requestAnimationFrame(()=>{TR.raf=0;trLive()})}
function trOri(e){if(e.beta==null)return;TR.last=Date.now();TR.src='o';
 const v=trVec(e.alpha||0,e.beta,e.gamma||0),el=Math.asin(Math.max(-1,Math.min(1,v[2])));
 if(e.alpha==null){TR.noYaw=true;trPush(null,el)}else{TR.noYaw=false;trPush(v,el)}}
function trMot(e){if(TR.src==='o'&&Date.now()-TR.last<700)return;const a=e.accelerationIncludingGravity;if(!a||a.z==null)return;
 const n=Math.hypot(a.x||0,a.y||0,a.z);if(!n)return;const z=(trIOS?1:-1)*a.z/n;
 TR.src='m';TR.noYaw=true;trPush(null,Math.asin(Math.max(-1,Math.min(1,z))))}
function trMean(S){ // moyenne d'inclinaison et de direction + dispersion (radians)
 const E=S.map(s=>s.el),el=E.reduce((a,b)=>a+b,0)/E.length,sdE=Math.sqrt(E.reduce((a,b)=>a+(b-el)**2,0)/E.length);
 const V=S.filter(s=>s.v);if(!V.length)return{el,az:null,sdE,sdA:0};
 let x=0,y=0;V.forEach(s=>{const h=Math.hypot(s.v[0],s.v[1])||1;x+=s.v[0]/h;y+=s.v[1]/h});
 const R=Math.hypot(x,y)/V.length;return{el,az:Math.atan2(x,y),sdE,sdA:Math.sqrt(Math.max(0,-2*Math.log(Math.max(1e-9,R))))}}
function trDir(){if(!TR.ebuf.length)return null;const m=trMean(TR.ebuf.map((el,i)=>({el,v:TR.noYaw?null:TR.buf[i]})));
 return trRay({az:m.az,el:m.el},TR.b0)}
function trRay(s,b){return{el:s.el+(b||0),d:s.az==null?null:[Math.sin(s.az),-Math.cos(s.az)]}}   // nord du monde = haut du plan

/* ---- géométrie ---- */
const trR2=v=>Math.round(v*100)/100;
function trFloor(D){return D&&D.el<-.05?TR.hc/Math.tan(-D.el):null}
function trPt(s,hc,b){const D=trRay(s,b),t=hc/Math.tan(Math.max(.02,-D.el));return[D.d[0]*t,D.d[1]*t]}
function trHitP(P,D,hc,only){if(!D||!D.d)return null;let best=null;const n=P.length;
 for(let i=0;i<n;i++){if(only!=null&&i!==only)continue;const A=P[i],B=P[(i+1)%n],ex=B[0]-A[0],ey=B[1]-A[1],dx=D.d[0],dy=D.d[1],det=-dx*ey+ex*dy;if(Math.abs(det)<1e-9)continue;
  const t=(-A[0]*ey+ex*A[1])/det,s=(dx*A[1]-dy*A[0])/det;
  if(t>.05&&(only!=null||(s>=-.02&&s<=1.02))&&(!best||t<best.t))best={i,t,s,L:Math.hypot(ex,ey),z:hc+t*Math.tan(D.el)}}
 return best}
function trHit(D,only){return TR.c.length>2?trHitP(TR.c.map(s=>trPt(s,TR.hc,TR.b0)),D,TR.hc,only):null}
function trSquare(P,tol){
 tol=tol||6*DEG;const n=P.length;if(n<4)return{P,n:0};
 const th=[],len=[];for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n];th.push(Math.atan2(b[1]-a[1],b[0]-a[0]));len.push(Math.hypot(b[0]-a[0],b[1]-a[1]))}
 let sx=0,sy=0;th.forEach((t,i)=>{sx+=len[i]*Math.cos(4*t);sy+=len[i]*Math.sin(4*t)});const phi=Math.atan2(sy,sx)/4,Q4=Math.PI/2;
 const dir=th.map(t=>{let d=t-phi;d-=Math.round(d/Q4)*Q4;return Math.abs(d)<tol?{t:t-d,s:1}:{t,s:0}});
 const L=dir.map((d,i)=>{const a=P[i],b=P[(i+1)%n];return{m:[(a[0]+b[0])/2,(a[1]+b[1])/2],u:[Math.cos(d.t),Math.sin(d.t)]}});
 const proj=(l,p)=>{const k=(p[0]-l.m[0])*l.u[0]+(p[1]-l.m[1])*l.u[1];return[l.m[0]+l.u[0]*k,l.m[1]+l.u[1]*k]};
 const Q=[];let cnt=0;
 for(let j=0;j<n;j++){const A=L[(j-1+n)%n],B=L[j],cr=A.u[0]*B.u[1]-A.u[1]*B.u[0];
  if(Math.abs(cr)<.2){const pa=proj(A,P[j]),pb=proj(B,P[j]);Q.push([(pa[0]+pb[0])/2,(pa[1]+pb[1])/2])}
  else{const dx=B.m[0]-A.m[0],dy=B.m[1]-A.m[1],t=(dx*B.u[1]-dy*B.u[0])/cr;Q.push([A.m[0]+A.u[0]*t,A.m[1]+A.u[1]*t])}
  if(dir[(j-1+n)%n].s&&dir[j].s&&Math.abs(cr)>.9)cnt++}
 const mv=Math.max(...Q.map((q,i)=>Math.hypot(q[0]-P[i][0],q[1]-P[i][1])));
 if(!(mv<.4)||Q.some(q=>!isFinite(q[0])||!isFinite(q[1])))return{P,n:0};
 return{P:Q,n:cnt}}
// plan complet depuis les visées brutes : murs, ouvertures, hauteur, précision
function trGeom(R,hc,b,sq){
 let P,d=null,nsq=0;
 if(R.mode==='ang')P=R.c.map(s=>trPt(s,hc,b));
 else{d=R.w.map(s=>hc/Math.tan(Math.max(.02,-(s.el+b))));P=[[-d[3],-d[0]],[d[1],-d[0]],[d[1],d[2]],[-d[3],d[2]]]}
 const P0=P.map(p=>p.slice());
 if(sq&&R.mode==='ang'){const r=trSquare(P);P=r.P;nsq=r.n}
 const ops=[];
 if(R.mode==='ang')(R.ops||[]).forEach((o,k)=>{
  const A=trHitP(P,trRay(o.a,b),hc,null);if(!A)return;const B=trHitP(P,trRay(o.b,b),hc,A.i);if(!B)return;
  const L=A.L,s0=Math.max(0,Math.min(A.s,B.s)),s1=Math.min(1,Math.max(A.s,B.s)),z0=Math.min(A.z,B.z),z1=Math.max(A.z,B.z),fen=o.t==='fen';
  ops.push({rawi:k,w:A.i,t:o.t,off:trR2(s0*L),wid:trR2((s1-s0)*L),hgt:trR2(fen?z1-z0:z1),sill:fen?trR2(Math.max(0,z0)):0})});
 let h=null;
 if(R.h){if(R.mode==='ang'){const H=trHitP(P,trRay(R.h,b),hc,null);h=H?trR2(H.z):null}else h=trR2(hc+d[0]*Math.tan(R.h.el+b))}
 // précision : erreur d'inclinaison et de hauteur du téléphone propagées sur chaque angle
 const sE=(R.np>=2?.25:.4)*DEG,sA=.6*DEG,sH=R.np>=1||R.hcal?.01:.06,err=[];
 if(R.mode==='ang'){
  const C=P0.map((p,i)=>{const s=R.c[i],dd=Math.hypot(p[0],p[1])||1e-6,el=-(s.el+b),sd=hc/Math.pow(Math.sin(Math.max(.02,el)),2)*Math.hypot(sE,s.sd||0),sR=Math.hypot(sd,dd*sH/hc),sL=dd*Math.hypot(sA,s.sa||0);
   return{r:[p[0]/dd,p[1]/dd],sR,sL}});
  for(let i=0;i<P.length;i++){const a=P[i],c=P[(i+1)%P.length],L=Math.hypot(c[0]-a[0],c[1]-a[1])||1,u=[(c[0]-a[0])/L,(c[1]-a[1])/L];
   let v=0;[C[i],C[(i+1)%P.length]].forEach(k=>{const cr=u[0]*k.r[0]+u[1]*k.r[1],cp=-u[0]*k.r[1]+u[1]*k.r[0];v+=(cr*k.sR)**2+(cp*k.sL)**2});err.push(Math.sqrt(v))}}
 else{const e=R.w.map((s,i)=>{const el=-(s.el+b);return Math.hypot(hc/Math.pow(Math.sin(Math.max(.02,el)),2)*Math.hypot(sE,s.sd||0),d[i]*sH/hc)});
  err.push(Math.hypot(e[3],e[1]),Math.hypot(e[0],e[2]),Math.hypot(e[3],e[1]),Math.hypot(e[0],e[2]))}
 // mur A à l'horizontale, pièce sous le mur A, origine en haut à gauche
 const an=Math.atan2(P[1][1]-P[0][1],P[1][0]-P[0][0]),co=Math.cos(-an),si=Math.sin(-an);
 P=P.map(([x,y])=>[x*co-y*si,x*si+y*co]);
 const cy=P.reduce((t,p)=>t+p[1],0)/P.length;if(cy<P[0][1])P=P.map(([x,y])=>[-x,-y]);
 const mx=Math.min(...P.map(p=>p[0])),my=Math.min(...P.map(p=>p[1]));P=P.map(([x,y])=>[Math.round((x-mx)*1000)/1000,Math.round((y-my)*1000)/1000]);
 return{pts:P,ops,h,err,nsq}}
// recalage : hauteur du téléphone (échelle) + biais d'inclinaison, par moindres carrés sur les mesures
function trFit(R,cons,sq){
 const b0=R.b0||0,pairs=b=>{const g=trGeom(R,1,b,sq),P=[];
  cons.walls.forEach(c=>{if(g.pts.length>c.i)P.push([c.L,plLen(g.pts,c.i)])});
  if(cons.h!=null&&g.h)P.push([cons.h,g.h]);
  if(R.hcal){const t=1/Math.tan(Math.max(.02,-(R.hcal.a.el+b)));P.push([R.hcal.H,1+t*Math.tan(R.hcal.b.el+b)])}
  return P};
 const ev=b=>{const P=pairs(b);let num=0,den=0;P.forEach(([L,l])=>{const w=1/(L*L);num+=w*L*l;den+=w*l*l});const hc=den?num/den:R.hc0;
  let r=0;P.forEach(([L,l])=>{r+=((hc*l-L)/L)**2});return{hc,b,r:r+((b-b0)/DEG)**2*1e-5,n:P.length}};
 const nv=(cons.h!=null?1:0)+(R.hcal?1:0),nh=cons.walls.length;
 let best=ev(b0);best.fitB=false;if(!((nv>=1&&nh>=1)||nh>=3))return best;
 for(let x=-4;x<=4.001;x+=.1){const e=ev(b0+x*DEG);if(e.r<best.r)best=e}
 const c=best.b;for(let x=-.1;x<=.1001;x+=.01){const e=ev(c+x*DEG);if(e.r<best.r)best=e}
 best.fitB=true;return best}

/* ---- ouverture / fermeture ---- */
function trOpen(ctx){
 const k=trCal();
 Object.assign(TR,{ph:'start',mode:'ang',buf:[],ebuf:[],noYaw:false,src:'',c:[],w:[],ops:[],opA:null,opT:'porte',h:null,hcal:null,calA:null,hold:null,img:null,th:null,hTyped:null,calH:null,denied:false,ctx,b0:(k.b||0)*DEG});
 const hc=+k.hc||(()=>{try{return +localStorage.getItem('caso_camh')}catch(e){return 0}})()||1.5;
 $('trHc').value=plF(hc);$('trNoCam').hidden=true;$('tour').hidden=false;document.body.classList.add('tr-on');trUI()}
function trStop(){
 window.removeEventListener('deviceorientation',trOri);window.removeEventListener('devicemotion',trMot);
 if(TR.stream){TR.stream.getTracks().forEach(t=>{try{t.stop()}catch(e){}});TR.stream=null}
 const v=$('trVid');if(v)v.srcObject=null}
function trClose(force){
 if(!force&&(TR.c.length||TR.w.length)&&!confirm(i18nT('Abandonner le tour ? Les visées seront perdues.')))return;
 trStop();TR.ph='off';TR.hold=null;$('tour').hidden=true;document.body.classList.remove('tr-on')}
function trStart(){
 const hc=plNum($('trHc').value);
 if(!(hc>.5&&hc<2.6)){$('trHc').setAttribute('aria-invalid','true');toast(i18nT('Hauteur du téléphone : entre 0,50 et 2,50 m.'));return}
 TR.hc=hc;try{localStorage.setItem('caso_camh',String(hc))}catch(e){}
 // iPhone : la permission doit être demandée tout de suite, dans le geste de l'utilisateur
 let po=Promise.resolve('granted'),pm=Promise.resolve('granted');
 try{if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function')po=DeviceOrientationEvent.requestPermission()}catch(e){po=Promise.resolve('denied')}
 try{if(window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission==='function')pm=DeviceMotionEvent.requestPermission()}catch(e){}
 const cam=navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false}).catch(()=>null):Promise.resolve(null);
 if(TR.stream){try{TR.stream.getTracks().forEach(t=>t.stop())}catch(e){}TR.stream=null}window.removeEventListener('deviceorientation',trOri);window.removeEventListener('devicemotion',trMot);TR.denied=false;
 const tok=TR.tok=(TR.tok||0)+1;
 TR.ph='wait';trUI();
 Promise.all([po.catch(()=>'denied'),pm.catch(()=>'denied'),cam]).then(([o,m,st])=>{
  if(TR.ph==='off'||tok!==TR.tok){if(st)st.getTracks().forEach(t=>t.stop());return}
  if(st){TR.stream=st;const v=$('trVid');v.srcObject=st;v.setAttribute('playsinline','');v.muted=true;const p=v.play();if(p&&p.catch)p.catch(()=>{})}else $('trNoCam').hidden=false;
  window.addEventListener('deviceorientation',trOri);window.addEventListener('devicemotion',trMot);
  setTimeout(()=>{if(TR.ph!=='wait')return;
   if(!TR.ebuf.length){TR.ph='nosens';TR.denied=o==='denied'||m==='denied'||trIOS}
   else{TR.mode=TR.noYaw?'mur':'ang';TR.ph=TR.mode}
   trUI()},1300)})}
function trGrab(){
 if(TR.img)return;const v=$('trVid');if(!v||!v.videoWidth)return;
 try{const c=document.createElement('canvas'),r=Math.min(1,1600/Math.max(v.videoWidth,v.videoHeight));c.width=Math.round(v.videoWidth*r);c.height=Math.round(v.videoHeight*r);
  c.getContext('2d').drawImage(v,0,0,c.width,c.height);TR.img=c.toDataURL('image/jpeg',.8);
  const t=document.createElement('canvas'),k=240/Math.max(c.width,c.height);t.width=Math.round(c.width*k);t.height=Math.round(c.height*k);t.getContext('2d').drawImage(c,0,0,t.width,t.height);TR.th=t.toDataURL('image/jpeg',.6)}catch(e){}}
function trBuzz(){try{navigator.vibrate&&navigator.vibrate(30)}catch(e){}const a=$('trAim');a.classList.remove('shot');void a.offsetWidth;a.classList.add('shot')}

/* ---- une visée : contrôle rapide, puis 0,6 s de téléphone immobile ---- */
function trTap(){
 if(TR.hold)return;const D=trDir();if(!D){toast(i18nT('Capteurs pas encore prêts.'));return}
 const ph=TR.ph;
 if(ph==='ang'||ph==='mur'||(ph==='calh'&&!TR.calA)){const t=trFloor(D);if(t==null){toast(i18nT('Vise plus bas : le pied du mur, au sol.'));return}if(t>20){toast(i18nT('Trop loin : rapproche-toi du centre de la pièce.'));return}}
 if((ph==='pla'||(ph==='calh'&&TR.calA))&&D.el<.03){toast(i18nT('Vise plus haut : la jonction mur-plafond.'));return}
 if(ph==='calh'&&!TR.calA){const H=plNum($('trCh').value);if(!(H>1.8&&H<8)){$('trCh').setAttribute('aria-invalid','true');toast(i18nT('Indique la hauteur sous plafond (ex. 2,50).'));return}TR.calH=H}
 if(ph==='ang'&&!D.d){toast(i18nT('Capteurs pas encore prêts.'));return}
 TR.hold={t0:Date.now(),S:[],tries:0};$('trShotW').classList.add('hold');$('trHoldT').textContent=i18nT('Ne bouge plus…');
 setTimeout(trHoldEnd,650)}
function trHoldEnd(){
 const H=TR.hold;if(!H||TR.ph==='off')return;
 const S=H.S.length>=4?H.S:TR.ebuf.map((el,i)=>({el,v:TR.noYaw?null:TR.buf[i]}));
 if(!S.length){TR.hold=null;$('trShotW').classList.remove('hold');return}
 const m=trMean(S);
 if((m.sdE>.6*DEG||m.sdA>.9*DEG)&&H.tries<2){H.tries++;H.S=[];$('trHoldT').textContent=i18nT('Le téléphone bouge : tiens-le immobile.');setTimeout(trHoldEnd,650);return}
 TR.hold=null;$('trShotW').classList.remove('hold');$('trHoldT').textContent='';
 trCommit({az:m.az,el:m.el,sd:m.sdE/Math.sqrt(Math.max(1,S.length/4)),sa:m.sdA/Math.sqrt(Math.max(1,S.length/4)),shaky:m.sdE>.6*DEG})}
function trCommit(s){
 const D=trRay(s,TR.b0),ph=TR.ph;
 if(ph==='ang'||ph==='mur'){
  const t=trFloor(D);if(t==null){toast(i18nT('Vise plus bas : le pied du mur, au sol.'));return}
  trGrab();
  if(ph==='ang'){if(!D.d)return;TR.c.push(s)}
  else{TR.w.push(s);if(TR.w.length===4)TR.ph=TR.hcal?'end':'pla'}
  if(t>6)toast(i18nT('Angle lointain : précision réduite, mesure ce mur au laser.'));
  else if(s.shaky)toast(i18nT('Visée un peu tremblée : précision réduite.'))}
 else if(ph==='calb'){
  if(!TR.calA){TR.calA=s}
  else{const A=TR.calA;TR.calA=null;
   if(A.az!=null&&s.az!=null){let dA=Math.abs(A.az-s.az);dA=Math.min(dA,2*Math.PI-dA);if(dA>3*DEG){toast(i18nT('Ce n\'est pas le même repère : recommence.'));trUI();return}}
   const bb=(s.el-A.el)/2;if(Math.abs(bb)>5*DEG){toast(i18nT('Écart trop grand : recommence en visant bien le même repère.'));trUI();return}
   TR.b0=bb;trCalPut({b:bb/DEG,n:5,bt:Date.now()});TR.ph=TR.mode;
   toast(i18nT('Téléphone étalonné : inclinaison corrigée de {1}°.').replace('{1}',(bb>=0?'+':'')+plF(bb/DEG,1)))}}
 else if(ph==='calh'){
  if(!TR.calA){TR.calA=s}
  else{const A=TR.calA;TR.calA=null;
   if(A.az!=null&&s.az!=null){let dA=Math.abs(A.az-s.az);dA=Math.min(dA,2*Math.PI-dA);if(dA>4*DEG){toast(i18nT('Vise le haut du même mur, juste au-dessus du pied.'));trUI();return}}
   const ta=Math.tan(-(A.el+TR.b0)),tb=Math.tan(s.el+TR.b0),hc=TR.calH*ta/(tb+ta);
   if(!(hc>.6&&hc<2.4)){toast(i18nT('Étalonnage impossible : recommence en visant bien le pied puis le haut du mur.'));trUI();return}
   TR.hc=trR2(hc);TR.hcal={a:A,b:s,H:TR.calH};TR.hTyped=TR.calH;
   try{localStorage.setItem('caso_camh',String(TR.hc))}catch(e){}trCalPut({hc:TR.hc});$('trHc').value=plF(TR.hc);
   TR.ph=TR.mode;toast(i18nT('Hauteur du téléphone étalonnée : {1} m.').replace('{1}',plF(TR.hc)))}}
 else if(ph==='ops'){
  if(!TR.opA){const h=trHit(D);if(!h){toast(i18nT('Vise un mur de la pièce.'));return}TR.opA={h,s}}
  else{const B=trHit(D,TR.opA.h.i);if(!B){toast(i18nT('Vise un mur de la pièce.'));return}
   if(Math.abs(B.s-TR.opA.h.s)*B.L<.3){toast(i18nT('Ouverture trop étroite : vise le coin opposé.'));return}
   TR.ops.push({t:TR.opT,a:TR.opA.s,b:s});TR.opA=null}}
 else if(ph==='pla'){
  let t=null;if(TR.mode==='ang'){const h=trHit(D);t=h&&h.t}else t=trFloor(trRay(TR.w[0],TR.b0));
  if(!t){toast(i18nT('Vise un mur de la pièce.'));return}
  const z=TR.hc+t*Math.tan(D.el);if(z<1.8||z>8){toast(i18nT('Hauteur peu probable : vise la jonction mur-plafond.'));return}
  TR.h=s;trBuzz();return trFinish()}
 else return;
 trBuzz();trUI();if(TR.ph==='end')trFinish()}
function trUndo(){
 if(TR.ph==='ops'){if(TR.opA)TR.opA=null;else TR.ops.pop()}
 else if(TR.ph==='ang')TR.c.pop();
 else if(TR.ph==='mur')TR.w.pop();
 else if(TR.ph==='calh'||TR.ph==='calb')TR.calA=null;
 else if(TR.ph==='pla'&&TR.mode==='mur'){TR.w.pop();TR.ph='mur'}
 trUI()}
function trNext(){
 if(TR.ph==='ang'){if(TR.c.length<3)return;TR.ph='ops'}
 else if(TR.ph==='ops'){TR.opA=null;if(TR.hcal)return trFinish();TR.ph='pla'}
 else if(TR.ph==='pla')return trFinish();
 else if(TR.ph==='calh'||TR.ph==='calb'){TR.calA=null;TR.ph=TR.mode}
 trUI()}
function trCalB(){TR.ph='calb';TR.calA=null;trUI()}
function trCalStart(){TR.ph='calh';TR.calA=null;trUI();setTimeout(()=>{const e=$('trCh');if(e&&!e.value)e.focus()},50)}
function trType(t){TR.opT=t;TR.opA=null;trUI()}

/* ---- affichage ---- */
function trLive(){
 if(TR.ph==='off')return;const D=trDir(),o=$('trD');if(!o)return;let s='';
 if(D){const ph=TR.ph;
  if(ph==='ang'||ph==='mur'||(ph==='calh'&&!TR.calA)){const t=trFloor(D);s=t!=null&&t<=20?'~'+plF(t)+' m':'↓'}
  else if(ph==='calh')s=D.el>.03?'↑':'↑';
  else if(ph==='ops'||ph==='pla'){const h=TR.mode==='ang'?trHit(D,ph==='ops'&&TR.opA?TR.opA.h.i:null):null;
   if(ph==='pla'&&TR.mode==='mur'&&D.el>.03)s='~'+plF(TR.hc+trFloor(trRay(TR.w[0],TR.b0))*Math.tan(D.el))+' m';
   else if(h)s=(ph==='pla'?'':plL(h.i)+' · ')+'~'+plF(ph==='pla'?h.z:Math.max(0,h.z))+' m'}}
 o.textContent=s;trMap(D)}
function trMap(D){
 const sv=$('trMap');if(!sv)return;let pts=[];
 if(TR.mode==='ang')pts=TR.c.map(s=>trPt(s,TR.hc,TR.b0));else{const w=TR.w.map(s=>trFloor(trRay(s,TR.b0))||0);pts=[[0,-(w[0]||0)],[w[1]||0,0],[0,w[2]||0],[-(w[3]||0),0]]}
 const ext=Math.max(2.5,...pts.map(p=>Math.max(Math.abs(p[0]),Math.abs(p[1]))))*1.15,k=90/ext;
 let h='<circle cx="0" cy="0" r="4" class="tr-me"/>';
 if(TR.mode==='ang'&&pts.length){h+=`<polyline class="tr-pl" points="${pts.map(p=>p[0]*k+','+p[1]*k).join(' ')}${TR.ph!=='ang'&&pts.length>2?' '+pts[0][0]*k+','+pts[0][1]*k:''}"/>`;pts.forEach(p=>{h+=`<circle cx="${p[0]*k}" cy="${p[1]*k}" r="4" class="tr-pt"/>`})}
 if(TR.mode==='mur')TR.w.forEach((d,i)=>{const p=pts[i];h+=`<line class="tr-pl" x1="0" y1="0" x2="${p[0]*k}" y2="${p[1]*k}"/><circle cx="${p[0]*k}" cy="${p[1]*k}" r="4" class="tr-pt"/>`});
 if(D&&D.d){const f=trFloor(D),t=Math.min(ext,f!=null?f:ext);h+=`<line class="tr-ray" x1="0" y1="0" x2="${D.d[0]*t*k}" y2="${D.d[1]*t*k}"/>`}
 sv.innerHTML=h}
function trUI(){
 const ph=TR.ph,n=TR.c.length,shoot=['ang','mur','ops','pla','calh','calb'].includes(ph),bt=!!trCal().bt;
 $('trStartP').hidden=ph!=='start';$('trShotW').hidden=!shoot;$('trTypes').hidden=ph!=='ops';$('trAim').hidden=!shoot;
 $('trWait').hidden=ph!=='wait';$('trNoSens').hidden=ph!=='nosens';$('trCalP').hidden=ph!=='calh';
 let T='Tour de la pièce',S='',I='',B='',sec='';
 const btn=(f,t,c)=>`<button type="button" class="tr-b${c?' '+c:''}" onclick="${f}" data-noi18n>${esc(i18nT(t))}</button>`;
 const calOk=TR.hcal?' · '+i18nT('hauteur étalonnée'):'';
 if(ph==='start'){I='Mets-toi au milieu de la pièce. Tiens le téléphone droit, à hauteur de poitrine, et ne bouge plus les pieds.'}
 else if(ph==='wait')I='Autorise l\'appareil photo et les mouvements du téléphone.';
 else if(ph==='nosens'){I=TR.denied?'Accès aux mouvements refusé. Sur iPhone : Réglages > Safari > Mouvement et orientation, puis réessaie.':'Ce téléphone ne donne pas son inclinaison ici. Utilise « Plan photo » ou saisis les cotes à la main.'}
 else if(ph==='calb'){S=i18nT('Étalonnage du téléphone (une seule fois)');I=TR.calA?'Retourne le téléphone tête en bas et vise exactement le même repère.':'Vise un repère bien net (une prise, un coin de porte), téléphone à l\'endroit.';
  B=i18nT(TR.calA?'Tête en bas':'À l\'endroit');sec+=btn('trNext()','Annuler','')}
 else if(ph==='calh'){S=i18nT('Étalonnage de la hauteur');I=TR.calA?'Sans bouger les pieds, vise le haut du même mur, à la jonction avec le plafond.':'Indique la hauteur sous plafond, puis vise le pied d\'un mur, droit devant.';
  B=i18nT(TR.calA?'Haut du mur':'Pied du mur');sec+=btn('trNext()','Annuler','')}
 else if(ph==='ang'){S=i18nT('{1} angle(s) visé(s)').replace('{1}',n)+calOk;I=n?'Tourne-toi vers l\'angle suivant au sol, place le viseur dessus et touche le bouton.':'Vise un angle de la pièce au ras du sol, viseur bien dessus, et touche le bouton.';
  B=i18nT('Angle {1}').replace('{1}',n+1);if(!n&&!bt)sec+=btn('trCalB()','Étalonner le téléphone (une fois)','');if(!n&&!TR.hcal)sec+=btn('trCalStart()','Étalonner la hauteur (conseillé)','');if(n)sec+=btn('trUndo()','Annuler le dernier','');if(n>=3)sec+=btn('trNext()','Fermer la pièce','ok')}
 else if(ph==='mur'){const k=TR.w.length;S=i18nT('Mode mur par mur · {1}/4').replace('{1}',k)+calOk;
  I=k?'Tourne-toi d\'un quart de tour vers la droite, face au mur suivant, et vise son pied, droit devant.':'Ce téléphone ne sait pas dans quelle direction il tourne : mets-toi bien face à un mur et vise son pied, droit devant.';
  B=i18nT('Mur {1}').replace('{1}',k+1);if(!k&&!bt)sec+=btn('trCalB()','Étalonner le téléphone (une fois)','');if(!k&&!TR.hcal)sec+=btn('trCalStart()','Étalonner la hauteur (conseillé)','');if(k)sec+=btn('trUndo()','Annuler le dernier','')}
 else if(ph==='ops'){S=i18nT('Portes et fenêtres (facultatif)');I=TR.opA?'Vise maintenant le coin en haut à droite de l\'ouverture.':'Choisis le type, puis vise le coin en bas à gauche de l\'ouverture.';
  B=i18nT(TR.opA?'Coin haut droit':'Coin bas gauche');
  if(TR.opA||TR.ops.length)sec+=btn('trUndo()','Annuler le dernier','');sec+=btn('trNext()',TR.ops.length?'Suivant':'Passer','ok');
  $('trTypes').querySelectorAll('[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===TR.opT));
  if(TR.ops.length)S+=' · '+TR.ops.length}
 else if(ph==='pla'){S=i18nT('Hauteur sous plafond (facultatif)');I=TR.mode==='mur'?'Vise le haut du premier mur visé, à la jonction avec le plafond.':'Vise le haut d\'un mur, à la jonction avec le plafond.';B=i18nT('Plafond');
  if(TR.mode==='mur')sec+=btn('trUndo()','Annuler le dernier','');sec+=btn('trFinish()','Passer','ok')}
 $('trT').textContent=i18nT(T);$('trS').textContent=S;$('trI').textContent=i18nT(I);$('trBtnT').textContent=B;$('trSec').innerHTML=sec;trLive()}

/* ---- fin : le plan ---- */
async function trFinish(){
 const nw=TR.mode==='ang'?TR.c.length:TR.w.length;
 if(TR.mode==='ang'?nw<3:nw<4){toast(i18nT('Vise au moins 3 angles.'));return}
 const R={mode:TR.mode,c:TR.c.slice(),w:TR.w.slice(),ops:TR.ops.slice(),h:TR.h,hcal:TR.hcal,hc0:TR.hc,hc:TR.hc,b0:TR.b0,b:TR.b0,np:0,sq:true,nw};
 const g=trGeom(R,R.hc,R.b,true);
 const ctx=TR.ctx,{cl,pr}=plOwner(ctx),nP=db.plans.filter(p=>p.pid===pr.id).length;
 const hh=TR.hTyped?{v:TR.hTyped,src:'man',ok:true}:(g.h?{v:g.h,src:'vis',ok:false}:{v:PL_H0,src:'est',ok:false});
 const p={id:uid(),pid:pr.id,cid:cl.id,nom:ctx.room||('Pièce '+(nP+1)),date:Date.now(),th:TR.th||'',laser:ctx.laser,tour:TR.mode,det:null,raw:R,err:g.err,nsq:g.nsq,
  pts:g.pts,wm:g.pts.map(()=>({src:'vis',ok:false})),ops:g.ops.map(o=>Object.assign({id:uid(),src:'vis',ok:false},o)),h:hh,cal:false,k:1};
 if(TR.img){PL_MEM[p.id]=TR.img;try{await PH.put(p.id,TR.img)}catch(e){}}
 db.plans.push(p);save();trClose(true);TR.hTyped=null;
 chatPush({who:'bot',html:`<p><svg class="i i-sm"><use href="#i-plan"/></svg> <span>Plan créé</span> : <b data-noi18n>${esc(p.nom)}</b> · <span data-noi18n>${esc(cl.nom)}</span> · <span data-noi18n>${esc(pr.nom)}</span></p><p class="mut" data-noi18n>${esc(i18nT('Dimensions estimées : à vérifier.'))}</p><div class="sugg"><button class="btn sm" onclick="plOpen('${p.id}','devis')"><svg class="i i-sm"><use href="#i-plan"/></svg>Ouvrir le plan</button></div>`});
 plOpen(p.id,'devis');toast(i18nT(g.nsq?'Tour terminé : {1} angle(s) mis d\'équerre, vérifie les cotes.':'Tour terminé : vérifie les cotes.').replace('{1}',g.nsq))}

/* ---- dans l'écran du plan : recalage sur les mesures de l'artisan ---- */
function plCanRefit(){const R=PL&&PL.raw;return !!R&&!R.free&&PL.pts.length===R.nw}
function plForce(i,L){ // met le mur i à la longueur L en bougeant le moins de murs mesurés possible
 const P=PL.pts,n=P.length,a=P[i],b=P[(i+1)%n],cur=plLen(P,i);if(!cur)return;
 const ux=(b[0]-a[0])/cur,uy=(b[1]-a[1])/cur,dl=L-cur;if(Math.abs(dl)<.001)return;
 const typed=j=>['las','man'].includes(PL.wm[j].src);
 if(n===3){b[0]+=ux*dl;b[1]+=uy*dl;return}
 const fw=(i+2)%n,bk=(i-2+n)%n,useBk=typed(fw)&&!typed(bk);
 if(!useBk)[(i+1)%n,(i+2)%n].forEach(j=>{P[j][0]+=ux*dl;P[j][1]+=uy*dl});else[i,(i-1+n)%n].forEach(j=>{P[j][0]-=ux*dl;P[j][1]-=uy*dl})}
function plRefit(quiet){
 const R=PL.raw,typed=m=>m.src==='las'||m.src==='man',cons={walls:[],h:null};
 PL.wm.forEach((m,i)=>{if(typed(m)&&m.v)cons.walls.push({i,L:m.v})});
 if(typed(PL.h)&&R.h)cons.h=PL.h.v;
 const f=trFit(R,cons,R.sq!==false);R.hc=f.hc;R.b=f.b;R.np=cons.walls.length+(cons.h!=null?1:0);
 const old=PL.pts.map((_,i)=>plLen(PL.pts,i)),g=trGeom(R,R.hc,R.b,R.sq!==false);
 PL.pts=g.pts;PL.err=g.err;PL.nsq=g.nsq;
 const any=cons.walls.length||cons.h!=null||R.hcal;
 PL.wm=PL.wm.map((m,i)=>{if(typed(m))return m;const ch=Math.abs(plLen(PL.pts,i)-old[i])>.01;return m.ok&&!ch?m:{src:any?'fit':'vis',ok:false}});
 PL.wm.forEach((m,i)=>{if(typed(m)&&m.v)plForce(i,m.v)});
 {const L2=PL.pts.map((_,i)=>plLen(PL.pts,i));PL.wm=PL.wm.map((m,i)=>typed(m)?(m.v&&Math.abs(L2[i]-m.v)>.01?{src:'der',ok:false}:m):(m.ok&&Math.abs(L2[i]-old[i])>.01?{src:any?'fit':'vis',ok:false}:m))}
 const keep=PL.ops.filter(o=>o.rawi==null);
 PL.ops=g.ops.map(o=>{const prev=PL.ops.find(x=>x.rawi===o.rawi);if(prev&&typed(prev))return Object.assign(prev,{w:o.w});
  const ch=!prev||['off','wid','hgt','sill'].some(k=>Math.abs((prev[k]||0)-(o[k]||0))>.01);
  return Object.assign({id:prev?prev.id:uid(),src:any?'fit':'vis',ok:prev&&prev.ok&&!ch},o,{t:prev?prev.t:o.t})}).concat(keep);
 if(!typed(PL.h)&&g.h){const ch=Math.abs(PL.h.v-g.h)>.01;PL.h=PL.h.ok&&!ch?PL.h:{v:g.h,src:any?'fit':'vis',ok:false}}
 if(f.fitB&&!trCal().bt){const k=trCal(),n=Math.min(k.n||0,9);trCalPut({b:((k.b||0)*n+R.b/DEG)/(n+1),n:n+1})}
 if(R.np)trCalPut({hc:trR2(R.hc)});
 plClampOps();PLVB=null;plSave();plRender();
 if(!quiet)toast(i18nT('Plan recalé sur tes mesures : hauteur du téléphone {1} m, inclinaison corrigée de {2}°.').replace('{1}',plF(R.hc)).replace('{2}',(R.b/DEG>=0?'+':'')+plF(R.b/DEG,1)))}
function plSq(on){if(!plCanRefit())return;PL.raw.sq=on;plRefit(true);toast(i18nT(on?'Angles proches de 90° mis d\'équerre.':'Angles gardés tels que visés.'))}
function plRenderTour(){
 const el=$('plTourC');if(!el)return;const R=PL&&PL.raw;el.hidden=!R;if(!R)return;
 const can=plCanRefit();
 el.innerHTML=`<label class="pl-ck"><input type="checkbox" ${R.sq!==false?'checked':''} ${can&&R.mode==='ang'?'':'disabled'} onchange="plSq(this.checked)"> <span>Mettre d'équerre les angles proches de 90°</span></label>
  <p class="mut pl-ex" data-noi18n>${esc(Math.abs(R.b)<.0009&&!trCal().bt?i18nT('Hauteur du téléphone {1} m · inclinaison non étalonnée').replace('{1}',plF(R.hc)):i18nT('Hauteur du téléphone {1} m · inclinaison corrigée de {2}°').replace('{1}',plF(R.hc)).replace('{2}',(R.b/DEG>=0?'+':'')+plF(R.b/DEG,1)))}${R.np?' · '+esc(i18nT('recalé sur {1} mesure(s)').replace('{1}',R.np)):''}${can?'':' · '+esc(i18nT('plan retouché à la main'))}</p>`}
function plErr(i){return PL&&PL.err&&PL.err[i]!=null&&plCanRefit()?PL.err[i]:null}

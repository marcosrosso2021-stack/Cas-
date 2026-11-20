/* casô · Synchronisation : QR code, serveur, équipe, démarrage de l'appli
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- QR code (sans dépendance : octets, correction M, versions 1 à 10) ---------- */
const QR_T=[null,[26,10,1,16,0,0],[44,16,1,28,0,0],[70,26,1,44,0,0],[100,18,2,32,0,0],[134,24,2,43,0,0],[172,16,4,27,0,0],[196,18,4,31,0,0],[242,22,2,38,2,39],[292,22,3,36,2,37],[346,26,4,43,1,44]];
const QR_ALIGN=[null,[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50]];
const QR_EXP=new Array(512),QR_LOG=new Array(256);
(function(){let x=1;for(let i=0;i<255;i++){QR_EXP[i]=x;QR_LOG[x]=i;x<<=1;if(x&256)x^=0x11d}for(let i=255;i<512;i++)QR_EXP[i]=QR_EXP[i-255]})();
const qrMul=(a,b)=>a&&b?QR_EXP[QR_LOG[a]+QR_LOG[b]]:0;
function qrRs(data,n){
 let g=[1];
 for(let i=0;i<n;i++){const ng=new Array(g.length+1).fill(0);g.forEach((c,j)=>{ng[j]^=c;ng[j+1]^=qrMul(c,QR_EXP[i])});g=ng}
 const r=new Array(n).fill(0);
 data.forEach(d=>{const f=d^r[0];r.shift();r.push(0);if(f)for(let i=0;i<n;i++)r[i]^=qrMul(g[i+1],f)});
 return r}
function qrCodewords(bytes,v){
 const [,ec,b1,d1,b2,d2]=QR_T[v],cap=b1*d1+b2*d2,bits=[];
 const put=(val,len)=>{for(let i=len-1;i>=0;i--)bits.push((val>>i)&1)};
 put(4,4);put(bytes.length,v<10?8:16);bytes.forEach(b=>put(b,8));
 for(let i=0;i<4&&bits.length<cap*8;i++)bits.push(0);
 while(bits.length%8)bits.push(0);
 const cw=[];
 for(let i=0;i<bits.length;i+=8){let b=0;for(let j=0;j<8;j++)b=b<<1|bits[i+j];cw.push(b)}
 for(let p=0xEC;cw.length<cap;p^=0xFD)cw.push(p);
 const blocks=[];let k=0;
 for(let i=0;i<b1+b2;i++){const len=i<b1?d1:d2,d=cw.slice(k,k+len);k+=len;blocks.push({d,e:qrRs(d,ec)})}
 const out=[],maxD=Math.max(d1,d2);
 for(let i=0;i<maxD;i++)blocks.forEach(b=>{if(i<b.d.length)out.push(b.d[i])});
 for(let i=0;i<ec;i++)blocks.forEach(b=>out.push(b.e[i]));
 return out}
function qrPenalty(m){
 const n=m.length;let p=0;
 const runs=get=>{for(let a=0;a<n;a++){let len=1;for(let b=1;b<=n;b++){if(b<n&&get(a,b)===get(a,b-1))len++;else{if(len>=5)p+=3+len-5;len=1}}}};
 runs((a,b)=>m[a][b]);runs((a,b)=>m[b][a]);
 for(let y=0;y<n-1;y++)for(let x=0;x<n-1;x++){const c=m[y][x];if(c===m[y][x+1]&&c===m[y+1][x]&&c===m[y+1][x+1])p+=3}
 const pat=[1,0,1,1,1,0,1,0,0,0,0],rev=pat.slice().reverse();
 const finders=get=>{for(let a=0;a<n;a++)for(let b=0;b<=n-11;b++){let o1=true,o2=true;for(let k=0;k<11;k++){const c=get(a,b+k);if(c!==pat[k])o1=false;if(c!==rev[k])o2=false}if(o1)p+=40;if(o2)p+=40}};
 finders((a,b)=>m[a][b]);finders((a,b)=>m[b][a]);
 let dark=0;for(let y=0;y<n;y++)for(let x=0;x<n;x++)dark+=m[y][x];
 return p+Math.floor(Math.abs(dark*100/(n*n)-50)/5)*10}
const QR_MASKS=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
function qrMatrix(text,force){
 const bytes=Array.from(new TextEncoder().encode(text));
 let v=1;
 while(v<=10){const [,,b1,d1,b2,d2]=QR_T[v];if(4+(v<10?8:16)+8*bytes.length<=(b1*d1+b2*d2)*8)break;v++}
 if(v>10)throw new Error('Texte trop long pour le QR code');
 if(force&&force.version)v=force.version;
 const size=17+4*v,m=[],fn=[];
 for(let i=0;i<size;i++){m.push(new Array(size).fill(0));fn.push(new Array(size).fill(false))}
 const set=(x,y,d)=>{m[y][x]=d?1:0;fn[y][x]=true};
 for(let i=0;i<size;i++){set(6,i,i%2===0);set(i,6,i%2===0)}
 [[3,3],[size-4,3],[3,size-4]].forEach(([cx,cy])=>{
  for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
   const x=cx+dx,y=cy+dy;if(x<0||y<0||x>=size||y>=size)continue;
   const d=Math.max(Math.abs(dx),Math.abs(dy));set(x,y,d!==2&&d!==4)}});
 const ap=QR_ALIGN[v],na=ap.length;
 for(let i=0;i<na;i++)for(let j=0;j<na;j++){
  if((i===0&&j===0)||(i===0&&j===na-1)||(i===na-1&&j===0))continue;
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(ap[i]+dx,ap[j]+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}
 const fmt=mask=>{
  let r=mask<<10;for(let i=14;i>=10;i--)if((r>>i)&1)r^=0x537<<(i-10);
  const bits=((mask<<10)|r)^0x5412,b=i=>((bits>>i)&1)===1;
  for(let i=0;i<=5;i++)set(8,i,b(i));
  set(8,7,b(6));set(8,8,b(7));set(7,8,b(8));
  for(let i=9;i<15;i++)set(14-i,8,b(i));
  for(let i=0;i<8;i++)set(size-1-i,8,b(i));
  for(let i=8;i<15;i++)set(8,size-15+i,b(i));
  set(8,size-8,true)};
 fmt(0);
 if(v>=7){
  let r=v<<12;for(let i=17;i>=12;i--)if((r>>i)&1)r^=0x1F25<<(i-12);
  const bits=(v<<12)|r;
  for(let i=0;i<18;i++){const bt=((bits>>i)&1)===1,a=size-11+i%3,b=Math.floor(i/3);set(a,b,bt);set(b,a,bt)}}
 const cw=qrCodewords(bytes,v);let idx=0;
 for(let right=size-1;right>=1;right-=2){
  if(right===6)right=5;
  for(let vert=0;vert<size;vert++)for(let j=0;j<2;j++){
   const x=right-j,y=((right+1)&2)===0?size-1-vert:vert;
   if(!fn[y][x]&&idx<cw.length*8){m[y][x]=(cw[idx>>3]>>(7-(idx&7)))&1;idx++}}}
 const base=m.map(r=>r.slice());let best=null,bestP=Infinity;
 for(let k=0;k<8;k++){
  if(force&&force.mask!==undefined&&force.mask!==k)continue;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++)m[y][x]=base[y][x]^((!fn[y][x]&&QR_MASKS[k](x,y))?1:0);
  fmt(k);
  const p=qrPenalty(m);
  if(p<bestP){bestP=p;best=m.map(r=>r.slice())}}
 return best}
function qrSvg(text,mod){
 mod=mod||6;
 const m=qrMatrix(text),n=m.length,q=4,s=(n+2*q)*mod;let d='';
 for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(m[y][x])d+='M'+((x+q)*mod)+' '+((y+q)*mod)+'h'+mod+'v'+mod+'h-'+mod+'z';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+s+' '+s+'" width="100%" style="max-width:320px;background:#fff" shape-rendering="crispEdges"><rect width="'+s+'" height="'+s+'" fill="#fff"/><path d="'+d+'" fill="#000"/></svg>'}

/* ---------- Synchronisation avec le serveur local ---------- */
const SYNC_COLL=['prices','quotes','hist','chantiers','people','pts','clients','suppliers','projects','plans','events','invoices','memo','rapports'];
function getSync(){try{return JSON.parse(localStorage.getItem('devis_sync'))||{}}catch(e){return {}}}
function setSync(o){try{localStorage.setItem('devis_sync',JSON.stringify(o))}catch(e){}}

/* ce qui a changé ici depuis le dernier envoi */
function collectChanges(d,since){
 const ch={};
 SYNC_COLL.forEach(c=>{const l=(d[c]||[]).filter(r=>r.updatedAt>since);if(l.length)ch[c]=l});
 if((d.profAt||0)>since)ch.prof=[{id:'prof',v:d.prof||{},updatedAt:d.profAt}];
 return{changes:ch,tomb:(d.tomb||[]).filter(t=>t.at>since)}}

/* ce qui vient du serveur : le plus récent gagne ; une suppression ne l'emporte pas sur une modification plus récente */
let qRemote=null;
/* toute fiche reçue d'ailleurs est remise en forme : nombres en nombres, dates en dates, valeurs connues seulement, images vérifiées */
const RC_D=v=>v==null||v===''||(typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)),RC_T=v=>v==null||v===''||(typeof v==='string'&&/^\d{2}:\d{2}$/.test(v));
const rcN=v=>typeof v==='number'?(Number.isFinite(v)?v:0):(v===''||v==null?v:(Number.isFinite(+v)?+v:0));
const rcImg=v=>typeof CVD!=='undefined'&&CVD.okSrc?CVD.okSrc(v):/^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+\/=]+$/.test(String(v||''));
/* HTML d'un devis envoyé (q.dv.snapshot) reçu d'ailleurs : remis à plat (balises et attributs de renderDoc seulement, document inerte) */
const rcHtml=(()=>{
 const T=/^(aside|b|br|div|i|img|main|p|span|table|tbody|td|th|thead|tfoot|tr|colgroup|col|caption|strong|em|sup|sub|small|hr|ul|li|h1|h2|h3|h4|section|header|footer|figure|figcaption)$/i;
 const A=/^(class|colspan|rowspan|alt|src|style|data-[a-z-]+)$/i;
 const IMG=/^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,[A-Za-z0-9+\/=]+$/;
 const P=/^(--[\w-]+|color|background(-color)?|font(-size|-weight|-style|-family)?|line-height|letter-spacing|text-(align|transform)|width|height|min-(width|height)|max-(width|height)|margin(-[a-z]+)?|padding(-[a-z]+)?|border(-[a-z]+)*|display|flex(-[a-z]+)?|gap|grid(-[a-z]+)*|opacity|vertical-align|white-space)$/i;
 const style=v=>String(v).split(';').map(s=>s.trim()).filter(s=>{const i=s.indexOf(':');if(i<1)return false;const k=s.slice(0,i).trim(),x=s.slice(i+1);return P.test(k)&&!/url\s*\(|expression|@import|javascript:|[\\<>]/i.test(x)}).join(';');
 return html=>{const doc=new DOMParser().parseFromString('<body>'+String(html==null?'':html),'text/html');
  [...doc.body.querySelectorAll('*')].forEach(n=>{
   if(!T.test(n.tagName)){n.remove();return}
   [...n.attributes].forEach(a=>{const k=a.name;
    if(!A.test(k)||(k==='src'&&!(n.tagName==='IMG'&&IMG.test(a.value))))return n.removeAttribute(k);
    if(k==='style'){const s=style(a.value);if(s)n.setAttribute('style',s);else n.removeAttribute('style')}})});
  return doc.body.innerHTML}})();
function rcLines(L){return Array.isArray(L)?L.filter(l=>l&&typeof l==='object').map(l=>Object.assign(l,{qty:rcN(l.qty),pu:rcN(l.pu),tva:rcN(l.tva)})):[]}
/* profil d'entreprise reçu d'ailleurs : objet simple ; le logo n'est gardé que si c'est une image (png, jpeg, webp) */
function profClean(v){const o={};if(!v||typeof v!=='object'||Array.isArray(v))return o;
 for(const k of Object.keys(v)){if(k==='__proto__'||k==='constructor'||k==='prototype')continue;const x=v[k];
  if(k==='logo'){if(rcImg(x))o.logo=x;continue}
  if(typeof x==='string')o[k]=x.length>4000&&!/^data:image\//.test(x)?x.slice(0,4000):x;
  else if(typeof x==='number'||typeof x==='boolean'||x===null)o[k]=x;
  else if(typeof x==='object'){try{o[k]=JSON.parse(JSON.stringify(x))}catch(e){}}}
 return o}
/* dans une équipe, l'IBAN, le BIC et le SIRET de l'entreprise ne se changent que depuis le compte du patron */
function profVerrou(){try{const c=getSync();return !!(c&&c.token&&c.role&&c.role!=='patron')}catch(e){return false}}
function recClean(c,r){if(!r||typeof r!=='object'||!okId(r.id))return null;
 const D=k=>{if(!RC_D(r[k]))r[k]=''};
 if(c==='quotes'){r.lines=rcLines(r.lines);r.remise=rcN(r.remise);r.acompte=rcN(r.acompte);D('date');
  if(r.status!=null&&!(r.status in ST))r.status='brouillon';if(r.proSig&&!rcImg(r.proSig))delete r.proSig;
  if(r.sign&&typeof r.sign==='object'){if(r.sign.url&&!/^https?:\/\/[^\s"'<>]+$/.test(r.sign.url))delete r.sign.url;
   /* réponses du client (texte venu d'un e-mail) : bornées ; affichées échappées */
   if(r.sign.reponses!=null)r.sign.reponses=(Array.isArray(r.sign.reponses)?r.sign.reponses:[]).filter(x=>x&&typeof x==='object').slice(-20).map(x=>({at:rcN(x.at)||0,de:String(x.de||'').slice(0,160),sujet:String(x.sujet||'').slice(0,200),texte:String(x.texte||'').slice(0,4000)}));
   if(r.sign.suivi!=null&&(typeof r.sign.suivi!=='object'||Array.isArray(r.sign.suivi)))delete r.sign.suivi}else if(r.sign!=null)delete r.sign
  if(r.dv&&typeof r.dv==='object'&&!Array.isArray(r.dv)){if(r.dv.snapshot!=null){if(typeof r.dv.snapshot==='string')r.dv.snapshot=rcHtml(r.dv.snapshot);else delete r.dv.snapshot}}else if(r.dv!=null)delete r.dv}
 else if(c==='invoices'){r.lines=rcLines(r.lines);['remise','ret','pct'].forEach(k=>{if(r[k]!=null)r[k]=rcN(r[k])});['date','done','due'].forEach(D);
  if(typeof r.kind!=='string'||!/^\w{1,12}$/.test(r.kind))r.kind='facture';
  r.pays=(Array.isArray(r.pays)?r.pays:[]).filter(x=>x&&typeof x==='object').map(x=>Object.assign(x,{amt:rcN(x.amt)||0,d:RC_D(x.d)&&x.d?x.d:agToday(),mode:x.mode in FA_MODE?x.mode:'vir'}))}
 else if(c==='prices'){r.prix=rcN(r.prix);r.tva=rcN(r.tva)}
 else if(c==='events'){if(!['rdv','off','dispo'].includes(r.t))r.t='rdv';['d','d2'].forEach(D);if(r.t!=='dispo'&&!r.d)return null;
  ['a','b'].forEach(k=>{if(!RC_T(r[k]))r[k]=null});if(r.who!=null)r.who=Array.isArray(r.who)?r.who.filter(okId):[];if(r.cid!=null&&!okId(r.cid))delete r.cid;
  if(r.ex!=null)r.ex=Array.isArray(r.ex)?r.ex.filter(x=>RC_D(x)&&x):[]}
 else if(c==='pts'){if(!okId(r.c)||!okId(r.p))return null;r.ts=rcN(r.ts)||0;if(typeof r.t!=='string'||!/^\w{1,10}$/.test(r.t))return null}
 else if(c==='plans'){if(r.th&&!rcImg(r.th))delete r.th}
 /* équipe : coordonnées en texte, prix de l'heure en nombre, paiements bornés ; un document joint n'est qu'une image ou un PDF */
 else if(c==='people'){if(typeof r.nom!=='string')return null;['tel','email'].forEach(k=>{if(r[k]!=null)r[k]=String(r[k]).slice(0,120)});if(r.role!=='chef')r.role='ouvrier';
  if(r.taux!=null){r.taux=rcN(r.taux);if(!(r.taux>0))delete r.taux}
  if(r.pays!=null)r.pays=(Array.isArray(r.pays)?r.pays:[]).filter(x=>x&&typeof x==='object'&&okId(x.id)).slice(0,500).map(x=>({id:x.id,at:rcN(x.at)||0,amt:rcN(x.amt)||0,d:RC_D(x.d)&&x.d?x.d:agToday(),note:String(x.note||'').slice(0,200),doc:typeof eqDocOk==='function'&&eqDocOk(x.doc)?x.doc:undefined}))}
 /* mémoire du chat et rapports d'intervention : du texte seulement, de longueur bornée ; un mot appris n'est jamais une commande (vérifié à l'usage, dans chat/reponses.js) */
 else if(c==='memo'){if(!['fait','mot','regle'].includes(r.k))return null;const S=(k,n)=>{if(r[k]!=null)r[k]=String(r[k]).slice(0,n)};S('t',400);S('a',200);S('mot',120);S('b',300);S('de',120);
  if(r.k==='fait'&&!r.t||r.k!=='fait'&&(!r.a||!r.b))return null;return {id:r.id,k:r.k,t:r.t,a:r.a,mot:r.mot,b:r.b,de:r.de,updatedAt:r.updatedAt}}
 else if(c==='rapports'){if(!RC_D(r.date)||!r.date)return null;if(r.cid!=null&&!okId(r.cid))delete r.cid;const L=v=>(Array.isArray(v)?v:[]).slice(0,30).map(x=>String(x).slice(0,400));const o=r.r&&typeof r.r==='object'?r.r:{};
  return {id:r.id,cid:r.cid,client:String(r.client||'').slice(0,120),date:r.date,texte:String(r.texte||'').slice(0,4000),r:{fait:L(o.fait),obs:L(o.obs),sit:L(o.sit),suite:L(o.suite)},updatedAt:r.updatedAt}}
 return r}
function applyRemote(d,resp){
 let n=0;qRemote=null;
 SYNC_COLL.forEach(c=>{
  ((resp.changes&&resp.changes[c])||[]).forEach(r=>{
   if(!r||!okId(r.id))return;
   const {rev,...rec0}=r,rec=recClean(c,rec0);if(!rec)return;
   const list=d[c]||(d[c]=[]);
   const i=list.findIndex(x=>x.id===rec.id);
   if(i<0)list.push(rec);
   else if(rec.updatedAt>list[i].updatedAt)list[i]=rec;
   else return;
   (snap[c]||(snap[c]={}))[rec.id]=fp(rec);n++;if(c==='quotes'&&typeof q!=='undefined'&&q&&q.id===rec.id&&d===db)qRemote=rec})});
 const pr=resp.changes&&resp.changes.prof&&resp.changes.prof[0];
 if(pr&&pr.updatedAt>(d.profAt||0)){d.prof=profClean(pr.v);d.profAt=pr.updatedAt;n++}
 (resp.tomb||[]).forEach(t=>{
  const l=d[t.c];if(!l)return;
  const i=l.findIndex(x=>x.id===t.id);
  if(i>=0&&l[i].updatedAt<=t.at){l.splice(i,1);if(snap[t.c])delete snap[t.c][t.id];n++}});
 if(qRemote){q=JSON.parse(JSON.stringify(qRemote));qRemote=null;try{if($('s-devis')&&$('s-devis').classList.contains('on'))fillForm();if($('s-chat')&&$('s-chat').classList.contains('on'))chatTop()}catch(e){}}
 if(resp.counter>(d.counter||0))d.counter=resp.counter;
 return n}

let syncBusy=false,syncTimer=null;
function syncSoon(){
 const c=getSync();if(!c.url||!c.token)return;
 clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncNow(),3000)}
async function syncNow(){
 if(typeof qAutoT!=='undefined'&&qAutoT)qFlush();
 const cfg=getSync();
 if(!cfg.url||!cfg.token)return;
 if(syncBusy){syncEncore=true;return}/* demandée pendant une autre : refaite juste après (rien n'attend la suivante) */
 syncBusy=true;setSyncMsg('Synchronisation…');
 const started=Date.now();
 try{
  const {changes,tomb}=collectChanges(db,cfg.lastPush||0);
  const r=await fetch(cfg.url+'/api/sync',{method:'POST',
   headers:{'content-type':'application/json',authorization:'Bearer '+cfg.token},
   body:JSON.stringify({since:cfg.rev||0,changes,tomb,counter:db.counter||0})});
  if(r.status===401){cfg.token='';setSync(cfg);renderSync();throw new Error('Session expirée : reconnecte-toi.')}
  if(r.status===503){clearTimeout(syncTimer);syncTimer=setTimeout(syncNow,3000);throw new Error('Synchronisation…')}   // serveur en cours de mise à jour : nouvel essai tout seul
  if(r.status===507)throw new Error('L\'espace de l\'entreprise sur le serveur est plein.');
  if(!r.ok)throw new Error('Le serveur a répondu par une erreur ('+r.status+').');
  const resp=await r.json().catch(()=>({}));
  const n=applyRemote(db,resp);
  stamp();Store.persist(db);                 // enregistre ce qui vient du serveur, sans le renvoyer
  cfg.rev=resp.rev;cfg.lastPush=started-1;cfg.last=Date.now();setSync(cfg);
  if(n)refreshViews();
  checkSigned();
  setSyncMsg('Synchronisé à '+fmtT(Date.now())+(n?' · '+n+' changement(s) reçu(s)':''));
 }catch(e){
  setSyncMsg(e instanceof TypeError?'Entreprise injoignable. Tes données restent sur ce téléphone et seront envoyées plus tard.':String(e.message||e))}
 finally{syncBusy=false;if(syncEncore){syncEncore=false;setTimeout(()=>syncNow(),0)}}}
let syncEncore=false;

/* --- interface de synchronisation --- */
function setSyncMsg(t){const e=document.getElementById('syMsg');if(e)e.textContent=t}
function fillProf(){try{if(typeof logoProfil==='function')logoProfil()}catch(e){}
 const p=db.prof||{};
 $('eNom').value=p.nom||'';$('eAdr').value=p.adr||'';$('eSiret').value=p.siret||'';$('eSiren').value=p.siren||String(p.siret||'').replace(/\D/g,'').slice(0,9);
 $('eTel').value=p.tel||'';$('eAssur').value=p.assur||'';$('eValid').value=p.valid||30;
 $('eForme').value=p.forme||'';$('eMetier').value=p.metier||'';$('eRm').value=p.rm||'';$('eTvai').value=p.tvai||'';$('eMail').value=p.email||'';$('eZone').value=p.zone||'';ibanShow();$('eBic').value=p.bic||'';$('eDelai').value=p.delai==null||p.delai===''?'30':p.delai;
 $('eCapital').value=p.capital||'';$('eFranch').checked=!!p.franchise;$('eRcpro').value=p.rcpro||'';$('eMed').value=p.mediateur||'';$('eTauxH').value=p.tauxH||'';$('eDepl').value=p.depl||'';$('eAccT').value=p.acompteType||'Acompte';$('eAccP').value=p.acomptePct==null||p.acomptePct===''?'30':p.acomptePct;if(typeof entExtra==='function')entExtra()}
function refreshViews(){
 renderQuick();renderPrices();fillProf();fillSup();
 const act=document.querySelector('section.on'),id=act?act.id:'';
 if(id==='s-histo')renderHisto();else if(id==='s-four')renderFour();else if(id==='s-pt')renderPt();
 try{if(typeof envNouvelles==='function')envNouvelles()}catch(e){}}
let srvInfo=null;
async function probeServer(){
 if(!/^https?:$/.test(location.protocol))return null;
 try{const r=await fetch(ICI()+'/api/state');const j=await r.json().catch(()=>({}));if(typeof j.needsSetup==='boolean')return j}catch(e){}
 return null}
let SY_MAN=0;
function renderSync(){
 try{if(typeof roleUI==='function')roleUI()}catch(e){}
 const c=getSync(),on=!!(c.url&&c.token);
 $('syForm').style.display=on?'none':'block';
 $('syOn').style.display=on?'block':'none';
 if(on){
  $('syWho').textContent=c.user+' ('+c.role+') · '+c.url;
  $('syAdmin').style.display=c.role==='patron'?'block':'none';
  if(c.role==='patron')loadTeam();
  return}
 const first=!!(srvInfo&&srvInfo.needsSetup&&srvInfo.local);
 $('syFirst').style.display=first?'block':'none';
 $('syLogin').style.display=first?'none':'block';
 $('syUrlBox').style.display=srvInfo?'none':'block';
 if(first&&!$('fsName').value){const ac=accountGet();if(ac)$('fsName').value=ac.prenom}
 $('syJoinHint').style.display='block';{const m=!!srvInfo||SY_MAN;$('syMan').style.display=m?'block':'none';$('syManB').style.display=m?'none':''}
 if(!$('syUrl').value)$('syUrl').value=c.url||(srvInfo?ICI():'')}
async function initServer(){
 srvInfo=await probeServer();
 renderSync();
 if(srvInfo&&srvInfo.needsSetup&&srvInfo.local&&!getSync().token&&!document.body.classList.contains('starting')){go('cpt')}}
async function firstSetup(){
 const user=$('fsName').value.trim(),password=$('fsPass').value;
 if(user.length<2){setSyncMsg('Écris ton prénom.');return}
 if(password.length<8){setSyncMsg('Mot de passe : 8 caractères minimum.');return}
 try{
  setSyncMsg('Création…');
  let r=await fetch(ICI()+'/api/setup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user,password})});
  if(r.status===403){const code=prompt('Code de configuration (donné par l\'hébergeur) :');if(!code){setSyncMsg('');return}
   r=await fetch(ICI()+'/api/setup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user,password,code:code.trim()})})}
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(j.error||'Erreur.');
  setSync({url:ICI(),token:j.token,user:j.name,role:j.role,rev:0,lastPush:0});
  srvInfo.needsSetup=false;$('fsPass').value='';renderSync();syncNow();vaultSetup();
  setSyncMsg('C\'est prêt. Invite ton équipe ci-dessous.');
 }catch(e){setSyncMsg(e instanceof TypeError?'Entreprise introuvable. Vérifie que le poste est allumé et le Wi-Fi.':String(e.message||e))}}
/* adresse du serveur saisie à la main : https obligatoire (http seulement en local) ; un domaine nouveau doit être confirmé avant d'y envoyer le mot de passe */
function syncUrlOk(url){let U,K=null;try{U=new URL(url)}catch(e){return false}
 if(U.origin===location.origin)return true;
 const loc=/^(localhost|127\.0\.0\.1|\[::1\])$/.test(U.hostname);
 if(U.protocol!=='https:'&&!(loc&&U.protocol==='http:'))return false;
 try{const c=getSync();if(c.url)K=new URL(c.url).origin}catch(e){}
 return U.origin===K||confirm('Envoyer ton mot de passe à '+U.host+' ?')}
async function syncLogin(){
 const url=$('syUrl').value.trim().replace(/\/+$/,''),user=$('syUser').value.trim(),password=$('syPass').value;
 if(!url||!user||!password){setSyncMsg('Écris l\'adresse, ton prénom et ton mot de passe.');return}
 if(!syncUrlOk(url)){setSyncMsg('L\'adresse doit commencer par https://');return}
 try{
  setSyncMsg('Connexion…');
  const r=await fetch(url+'/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user,password})});
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(j.error||'Connexion refusée.');
  setSync({url,token:j.token,user:j.name,role:j.role,rev:0,lastPush:0});
  $('syPass').value='';renderSync();syncNow();vaultSetup();
 }catch(e){setSyncMsg(e instanceof TypeError?'Entreprise introuvable. Vérifie l\'adresse, que le poste est allumé et que tu es sur le même Wi-Fi.':String(e.message||e))}}
/* membre d'équipe sans compte : mot de passe de ce téléphone, pour le coffre */
function vaultSetup(){try{if(window.VAULT&&!VAULT.on&&!accountGet()&&getSync().token)setTimeout(()=>VAULT.setup(),300)}catch(e){}}
/* le jeton est aussi annulé sur le serveur : un jeton copié ne sert plus à rien après la déconnexion */
function syncLogout(){const c=getSync();
 if(c.url&&c.token)try{fetch(c.url+'/api/logout',{method:'POST',headers:authHdr(c),body:'{}',keepalive:true}).catch(()=>{})}catch(e){}
 setSync({url:c.url});renderSync();setSyncMsg('')}
/* --- équipe : invitation par QR code --- */
let teamCache=[],inviteLink='';
function authHdr(c){return{'content-type':'application/json',authorization:'Bearer '+c.token}}
async function apiTeam(path,body){
 const c=getSync();
 const r=await fetch(c.url+path,{method:body===undefined?'GET':'POST',headers:authHdr(c),body:body===undefined?undefined:JSON.stringify(body)});
 const j=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(j.error||'Erreur.');
 return j}
async function loadTeam(){
 try{teamCache=await apiTeam('/api/users');paintTeam();if(typeof eqRender==='function')eqRender()}catch(e){}}
function paintTeam(){
 const me=(getSync().user||'').toLowerCase(),lab={patron:'Patron',chef:'Chef',ouvrier:'Ouvrier'};
 $('teamList').innerHTML=teamCache.map((u,i)=>'<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid #ddd"><div style="flex:1"><b>'+esc(u.name)+'</b> · '+esc(lab[u.role]||u.role)+'</div>'+
  (u.name.toLowerCase()===me?'':'<button class="btn sec" style="width:auto;padding:6px 10px" onclick="reinvite('+i+')">QR code</button><button class="btn sec" style="width:auto;padding:6px 10px" onclick="removeUser('+i+')">Retirer</button>')+'</div>').join('')}
/* adresse que le téléphone de l'employé doit utiliser : jamais « localhost » */
async function inviteBase(){
 const c=getSync();let u;
 try{u=new URL(c.url)}catch(e){return c.url}
 if(!/^(localhost|127\.|\[?::1)/.test(u.hostname))return c.url;
 try{
  const j=await fetch(c.url+'/api/info').then(r=>r.json());
  if(j.ips&&j.ips.length)return u.protocol+'//'+j.ips[0]+':'+(j.port||u.port||80)+u.pathname.replace(/\/+$/,'')}catch(e){}/* le chemin de l'espace (/e/<espace>) est gardé */
 return null}
async function showInvite(name,role){
 try{
  const j=await apiTeam('/api/invite',{user:name,role});
  const base=await inviteBase();
  if(!base){setSyncMsg('Impossible de créer le QR code. Vérifie que le poste de l\'entreprise est connecté au Wi-Fi.');return}
  inviteLink=base+'/?join='+j.code;
  $('invQr').innerHTML=qrSvg(inviteLink);
  $('invTxt').innerHTML='<b>'+esc(j.name)+'</b> scanne ce QR code avec l\'appareil photo de son téléphone (même Wi-Fi que le poste de l\'entreprise). Valable '+j.days+' jours, une seule fois.';
  $('invShare').style.display=navigator.share?'inline-block':'none';
  $('invBox').style.display='block';
  $('invBox').scrollIntoView({behavior:'smooth',block:'center'});
  setSyncMsg('');loadTeam();
 }catch(e){setSyncMsg(String(e.message||e))}}
function invite(){
 const name=$('nuName').value.trim();
 if(name.length<2){setSyncMsg('Écris le prénom de la personne.');return}
 showInvite(name,$('nuRole').value);$('nuName').value=''}
function reinvite(i){const u=teamCache[i];if(u)showInvite(u.name,u.role)}
async function removeUser(i){
 const u=teamCache[i];if(!u||!confirm('Retirer '+u.name+' ? Il n\'aura plus accès à l\'entreprise.'))return;
 try{await apiTeam('/api/users/remove',{user:u.name});setSyncMsg(u.name+' a été retiré.');$('invBox').style.display='none';loadTeam()}
 catch(e){setSyncMsg(String(e.message||e))}}
function copyInvite(){
 if(navigator.clipboard)navigator.clipboard.writeText(inviteLink).then(()=>setSyncMsg('Lien copié.'),()=>setSyncMsg(inviteLink));
 else setSyncMsg(inviteLink)}
function shareInvite(){try{navigator.share({title:'casô',text:'Ton invitation casô :',url:inviteLink})}catch(e){}}

/* --- l'employé arrive par le QR code --- */
async function handleJoin(){
 const q=new URLSearchParams(location.search),code=q.get('join');
 if(!code)return;
 try{history.replaceState(null,'',location.pathname)}catch(e){}
 /* écran « Rejoindre l'équipe » (modules/envoi.js, chargé après ce fichier) : montré quand tous les modules sont là */
 if(/^[a-f0-9]{16}$/.test(code)){setTimeout(()=>{if(typeof joinEcran==='function')joinEcran(code)},0);return}
 try{
  const r=await fetch(ICI()+'/api/join',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code})});
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(j.error||'Invitation refusée.');
  setSync({url:ICI(),token:j.token,user:j.name,role:j.role,rev:0,lastPush:0});
  renderSync();go(j.role==='ouvrier'?'pt':'cpt');
  setSyncMsg('Bienvenue '+j.name+' ! Ce téléphone est connecté.');
  alert('Bienvenue '+j.name+' ! Ce téléphone est connecté à l\'entreprise.');
  syncNow();vaultSetup();
 }catch(e){go('cpt');setSyncMsg(e instanceof TypeError?'Entreprise introuvable. Vérifie le Wi-Fi.':String(e.message||e))}}

window.addEventListener('online',()=>syncNow());
window.addEventListener('pageshow',e=>{if(e.persisted)syncNow()});
/* l'appli s'ouvre aussi sans réseau : sw.js garde une copie de la page */
try{if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)&&!localStorage.getItem('caso_test'))(document.readyState==='complete'?f=>f():f=>window.addEventListener('load',f))(()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})})}catch(e){}


function init(){
 fillSup();supHint();renderSync();bkRefresh();
 $('eNom').value=db.prof.nom||'';$('eAdr').value=db.prof.adr||'';$('eSiret').value=db.prof.siret||'';$('eSiren').value=db.prof.siren||String(db.prof.siret||'').replace(/\D/g,'').slice(0,9);
 $('eTel').value=db.prof.tel||'';$('eAssur').value=db.prof.assur||'';$('eValid').value=db.prof.valid||30;
 renderQuick();renderPrices();fillForm();
}
try{localStorage.removeItem('devis_key')}catch(e){}
init();

vnInit();sigInit();chatLoad();renderAcct();
try{if(localStorage.getItem('caso_locked')==='1'&&accountGet())setTimeout(showLogin,0);else{const a=accountGet();if(a&&a.mode==='bricoleur')setTimeout(modeEnter,0)}}catch(e){}
setTimeout(()=>{if($('s-chat').classList.contains('on'))chatRender(false)},0);
if(/[?&]q=/.test(location.search))setTimeout(()=>{syncNow();go('histo')},300);{let T=null;try{T=localStorage.getItem('caso_test')}catch(e){}
 if(!T&&!/[?&]q=/.test(location.search)){
  if(!accountGet()&&!getSync().token)startOpen();
  else{const sp=$('splash');if(sp&&!sp.dataset.done){sp.dataset.done=1;sp.hidden=false;window.__splashGo&&__splashGo();setTimeout(splashEnd,matchMedia('(prefers-reduced-motion: reduce)').matches?500:1200)}}}}
handleJoin().then(initServer);

#!/usr/bin/env node
/* Serveur local casô
   - aucune dépendance : il suffit de Node.js (version 18 ou plus)
   - sert l'application (devis.html) et la synchronisation des données
   - lancement :  node server.js
   - variables facultatives : PORT (défaut 8787, 8080 sur Clever Cloud), DATA_DIR (défaut : dossier « donnees »),
     OPEN_BROWSER=1 pour ouvrir la page automatiquement.
   - en ligne (pour les liens de signature envoyés aux clients) :
     PUBLIC_URL=https://mon-adresse   adresse publique utilisée dans les liens
     SETUP_CODE=un-code-secret        permet de créer le compte du patron à distance
     TRUST_PROXY=1                    si le serveur est derrière un hébergeur (adresse IP réelle du client)
   Le même fichier peut être embarqué dans une application (voir createServer / start). */
'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto'),os=require('os');
const webpush=require('./webpush.js');

const COLL=['prices','quotes','hist','chantiers','people','pts','prof','clients','suppliers','projects','plans','events','invoices'];
const ROLE_PUSH={patron:COLL,chef:COLL,ouvrier:['pts']};
const ROLE_PULL={patron:COLL,chef:COLL,ouvrier:['chantiers','people','pts','events']};
const ROLES=Object.keys(ROLE_PUSH);
// rappels du planning : la veille à 18h (v) et 1 h avant (h)
const REM_TXT={fr:['Demain {h} : {t}','Dans 1 h ({h}) : {t}','Rendez-vous'],pt:['Amanhã {h}: {t}','Daqui a 1 h ({h}): {t}','Marcação'],es:['Mañana {h}: {t}','En 1 h ({h}): {t}','Cita'],it:['Domani {h}: {t}','Tra 1 ora ({h}): {t}','Appuntamento'],ro:['Mâine {h}: {t}','Peste 1 oră ({h}): {t}','Programare'],tr:['Yarın {h}: {t}','1 saat sonra ({h}): {t}','Randevu'],pl:['Jutro {h}: {t}','Za 1 godz. ({h}): {t}','Wizyta'],en:['Tomorrow {h}: {t}','In 1 hour ({h}): {t}','Appointment'],ar:['غدًا {h}: {t}','بعد ساعة ({h}): {t}','موعد'],ru:['Завтра {h}: {t}','Через 1 ч ({h}): {t}','Встреча']};
const TOKEN_DAYS=30,INVITE_DAYS=7;
/* texte de la notification « le client a signé », dans la langue de l'usager */
const PUSH_TXT={fr:'{c} a signé le devis {n}.',pt:'{c} assinou o orçamento {n}.',es:'{c} ha firmado el presupuesto {n}.',it:'{c} ha firmato il preventivo {n}.',ro:'{c} a semnat devizul {n}.',tr:'{c}, {n} numaralı teklifi imzaladı.',pl:'{c} podpisał(a) wycenę {n}.',en:'{c} signed quote {n}.',ru:'{c} подписал(а) смету {n}.',ar:'وقّع {c} على عرض السعر {n}.'};

/* adresses du réseau local, les plus probables en premier */
function lanAddresses(){
 const out=[];
 Object.values(os.networkInterfaces()).forEach(l=>(l||[]).forEach(n=>{if(n.family==='IPv4'&&!n.internal)out.push(n.address)}));
 const rank=a=>/^192\.168\./.test(a)?0:/^10\./.test(a)?1:/^172\.(1[6-9]|2\d|3[01])\./.test(a)?2:3;
 return out.sort((a,b)=>rank(a)-rank(b))}

function createServer(opts={}){
 const DIR=opts.dataDir||process.env.DATA_DIR||(process.env.APP_HOME?path.join(process.env.APP_HOME,'donnees'):path.join(__dirname,'donnees'));// Clever Cloud : dossier « donnees » monté par le FS Bucket
 fs.mkdirSync(DIR,{recursive:true});
 const FILE=path.join(DIR,'data.json');
 // dans le dépôt : l'appli (index.html, module devis.html, chat/, lib/) est un dossier au-dessus du serveur
 const ROOT=path.join(__dirname,'..'),NEWL=!opts.appFile&&fs.existsSync(path.join(ROOT,'index.html'));
 const APP=opts.appFile||(NEWL?path.join(ROOT,'index.html'):path.join(__dirname,'devis.html'));
 const lan=opts.lan||lanAddresses;

 let data={rev:0,counter:0,users:{},tokens:{},invites:{},recs:{},tombs:[],signs:{},subs:[],vapid:null};
 {let raw=null;try{raw=fs.readFileSync(FILE,'utf8')}catch(e){if(e.code!=='ENOENT')throw e}
  if(raw!==null){let d;try{d=JSON.parse(raw)}catch(e){const bad=FILE+'.illisible-'+Date.now();try{fs.renameSync(FILE,bad)}catch(_){}
    throw new Error('Le fichier de données est illisible. Il a été mis de côté ('+path.basename(bad)+') et rien n\'a été écrasé. Restaure une sauvegarde avant de relancer.')}
   data=Object.assign(data,d)}}
 for(const k of ['users','tokens','invites','recs','signs','invShares','ics','invSeq','remSent'])if(data[k]&&typeof data[k]==='object')Object.setPrototypeOf(data[k],null);
 COLL.forEach(c=>{if(!data.recs[c])data.recs[c]=Object.create(null);else Object.setPrototypeOf(data.recs[c],null)});
 if(!data.invIds)data.invIds={};
 if(!data.signs)data.signs={};if(!data.subs)data.subs=[];if(!data.remSent)data.remSent={};if(!data.invSeq)data.invSeq={};if(!data.invShares)data.invShares={};if(!data.ics)data.ics={};
 if(!data.vapid){data.vapid=webpush.vapidKeys();try{const t=FILE+'.tmp';fs.writeFileSync(t,JSON.stringify(data));fs.renameSync(t,FILE)}catch(e){}}
 const pushSend=opts.pushSend||((sub,payload)=>webpush.send(sub,payload,data.vapid,{subject:process.env.VAPID_SUBJECT}));
 const SIGNER=opts.signerFile||path.join(__dirname,'signer.html');
 const FACTURE=opts.factureFile||path.join(__dirname,'facture.html');

 function tidy(){const now=Date.now();
  for(const t in data.tokens)if(data.tokens[t].exp<now)delete data.tokens[t];
  for(const k in data.signs){const x=data.signs[k];if((x.status==='replaced'||x.status==='cancelled')&&now-(x.replacedAt||x.sentAt||0)>30*864e5)delete data.signs[k]}
  data.tombs=data.tombs.filter(t=>now-t.at<180*864e5)}
 tidy();
 if(!opts.noTimers){const it=setInterval(()=>{tidy();persist()},864e5);if(it.unref)it.unref()}
 function persist(){
  const tmp=FILE+'.tmp';
  fs.writeFileSync(tmp,JSON.stringify(data));
  fs.renameSync(tmp,FILE)}

 /* --- comptes --- */
 const tokH=t=>'h'+crypto.createHash('sha256').update(String(t)).digest('hex');
 const hash=(pw,salt)=>crypto.scryptSync(String(pw),salt,32).toString('hex');
 function makeUser(name,pw,role){
  const salt=crypto.randomBytes(16).toString('hex');
  data.users[name.toLowerCase()]={name,role,salt,hash:hash(pw,salt)}}
 function checkPw(u,pw){
  const a=Buffer.from(hash(pw,u.salt),'hex'),b=Buffer.from(u.hash,'hex');
  return a.length===b.length&&crypto.timingSafeEqual(a,b)}
 const validName=n=>/^[\p{L}\p{N} ._-]{2,30}$/u.test(n);
 function newToken(u){
  const token=crypto.randomBytes(32).toString('hex');
  data.tokens[tokH(token)]={user:u.name.toLowerCase(),exp:Date.now()+TOKEN_DAYS*864e5,at:Date.now()};
  persist();
  return{token,name:u.name,role:u.role}}

 /* --- limite d'essais (connexion, invitation) --- */
 const tries=new Map();
 function tooMany(ip){
  if(tries.size>5000){const old=Date.now()-60000;for(const [k,v] of tries)if(v.at<old)tries.delete(k)}
  const t=tries.get(ip)||{n:0,at:Date.now()};
  if(Date.now()-t.at>60000){t.n=0;t.at=Date.now()}
  tries.set(ip,t);return t.n>=10}
 const fail=ip=>{const t=tries.get(ip)||{n:0,at:Date.now()};t.n++;tries.set(ip,t)};
 const isLocal=req=>!process.env.TRUST_PROXY&&!process.env.TRUST_CF&&!req.headers['x-forwarded-for']&&!req.headers['cf-connecting-ip']&&['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
 const sameSecret=(a,b)=>{const x=crypto.createHash('sha256').update(String(a)).digest(),y=crypto.createHash('sha256').update(String(b)).digest();return crypto.timingSafeEqual(x,y)};

 function authUser(req){
  const m=(req.headers.authorization||'').match(/^Bearer ([a-f0-9]{64})$/);
  if(!m)return null;
  const h=tokH(m[1]),t=own(data.tokens,h)?data.tokens[h]:own(data.tokens,m[1])?data.tokens[m[1]]:null;
  if(!t||t.exp<Date.now())return null;
  return data.users[t.user]||null}

 /* --- synchronisation --- */
 const okId=id=>typeof id==='string'&&/^[\w-]{1,64}$/.test(id)&&!/^(__proto__|constructor|prototype)$/.test(id);
 const okRec=r=>r&&typeof r==='object'&&okId(r.id)&&typeof r.updatedAt==='number'&&Number.isFinite(r.updatedAt);
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 const payKey=p=>p&&(p.id||[p.d,p.amt,p.mode].join('|'));
 function mergePays(a,b){const out=(Array.isArray(a)?a:[]).slice(),seen=new Set(out.map(payKey));(Array.isArray(b)?b:[]).forEach(p=>{const k=payKey(p);if(p&&!seen.has(k)){seen.add(k);out.push(p)}});return out}
 const SIGNED_KEEP=['lines','remise','acompte','franchise','client','tel','adr','num','date','cv','proSig','sign'];
 // une facture émise (numérotée) ne change plus : seuls les paiements s'ajoutent, et une correction passe par un avoir
 const INV_KEEP=['num','kind','date','done','due','client','chantier','lines','remise','ret','franchise','autoliq','pct','ded','ref','qid','qnum','seller','issuedAt','seal','red','red55','calc'];
 const MAX_PUSH=2000;
 function doSync(user,body){
  const canPush=ROLE_PUSH[user.role]||[],canPull=ROLE_PULL[user.role]||[];
  const since=Number(body.since)||0;
  const changes=body.changes&&typeof body.changes==='object'?body.changes:{};
  const tomb=Array.isArray(body.tomb)?body.tomb.slice(0,MAX_PUSH):[];
  let dirty=false;const now=Date.now(),tIdx=new Map();data.tombs.forEach(t=>{const k=t.c+'|'+t.id;if(!tIdx.has(k)||tIdx.get(k).at<t.at)tIdx.set(k,t)});
  const me=nk(user.name),myPeople=new Set(Object.values(data.recs.people).filter(x=>x&&nk(x.nom)===me).map(x=>x.id));
  for(const c of canPush){
   const list=Array.isArray(changes[c])?changes[c].slice(0,MAX_PUSH):[];
   for(const r of list){
    if(!okRec(r))continue;
    if(r.updatedAt>now+5*60e3)r.updatedAt=now;   // une date dans le futur figerait l'enregistrement
    const cur=data.recs[c][r.id];
    // un ouvrier ne touche qu'à ses propres pointages
    if(c==='pts'&&user.role==='ouvrier'&&(!myPeople.has(r.p)||(cur&&!myPeople.has(cur.p))))continue;
    const tb=tIdx.get(c+'|'+r.id);
    if(tb&&tb.at>=r.updatedAt)continue;           // supprimé plus tard que cette version
    if(cur&&cur.updatedAt>=r.updatedAt){          // le serveur a déjà plus récent…
     if(c==='invoices'&&Array.isArray(r.pays)){const m=mergePays(cur.pays,r.pays);if(m.length>(cur.pays||[]).length){cur.pays=m;cur.rev=++data.rev;dirty=true}}  // …mais on ne perd aucun paiement
     continue}
    const {rev,...rec}=r;
    if(c==='invoices'&&cur){rec.pays=mergePays(cur.pays,rec.pays);if(cur.num)INV_KEEP.forEach(k=>{if(own(cur,k))rec[k]=cur[k];else delete rec[k]})}
    // un devis signé par le client garde exactement ce qui a été signé
    if(c==='quotes'&&cur&&cur.sign&&cur.sign.st==='signed'){SIGNED_KEEP.forEach(k=>{if(own(cur,k))rec[k]=cur[k];else delete rec[k]});rec.status=rec.status==='paye'?'paye':'accepte'}
    data.recs[c][r.id]=Object.assign(rec,{rev:++data.rev});dirty=true}}
  for(const t of tomb){
   if(!t||!canPush.includes(t.c)||!okId(t.id)||typeof t.at!=='number'||!Number.isFinite(t.at))continue;
   if(t.at>now)t.at=now;                            // une date dans le futur bloquerait cet identifiant pour toujours
   if(!data.recs[t.c][t.id])continue;                // rien à supprimer
   if(t.c==='pts'&&user.role==='ouvrier'){const x=data.recs.pts[t.id];if(x&&!myPeople.has(x.p))continue}
   if(t.c==='quotes'){const x=data.recs.quotes[t.id];if(x&&x.sign&&x.sign.st==='signed')continue}  // un devis signé ne s'efface pas
   if(t.c==='invoices'){const x=data.recs.invoices[t.id];if(x&&x.num)continue}                      // une facture émise non plus
   const cur=data.recs[t.c][t.id];
   if(cur&&cur.updatedAt>t.at)continue;            // modifié après la suppression : on garde
   if(cur)delete data.recs[t.c][t.id];
   {const k=t.c+'|'+t.id,o=tIdx.get(k);if(!o||o.at<t.at){const nt={c:t.c,id:t.id,at:t.at,rev:++data.rev};data.tombs.push(nt);tIdx.set(k,nt)}}
   dirty=true}
  if(user.role!=='ouvrier'&&Number.isFinite(body.counter)&&body.counter>data.counter&&body.counter<=data.counter+1000){data.counter=body.counter;dirty=true}
  const out={};
  for(const c of canPull){
   let l=Object.values(data.recs[c]).filter(r=>r.rev>since);
   if(user.role==='ouvrier'){
    if(c==='pts')l=l.filter(r=>myPeople.has(r.p));
    else if(c==='events')l=l.filter(r=>Array.isArray(r.who)&&r.who.some(id=>myPeople.has(id)));
    else if(c==='people')l=l.filter(r=>myPeople.has(r.id))}
   if(l.length)out[c]=l}
  const tout=data.tombs.filter(t=>t.rev>since&&canPull.includes(t.c));
  if(dirty)persist();
  return{rev:data.rev,counter:data.counter,changes:out,tomb:tout}}

/* --- signature des devis --- */
 const privIp=a=>/^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1$|f[cd]|fe80|::ffff:(10\.|127\.|192\.168\.))/i.test(a);
 const clientIp=req=>{if(process.env.TRUST_CF&&req.headers['cf-connecting-ip'])return String(req.headers['cf-connecting-ip']).slice(0,64);if(process.env.TRUST_PROXY){const L=String(req.headers['x-forwarded-for']||'').split(',').map(x=>x.trim()).filter(Boolean);
   for(let i=L.length-1;i>=0;i--)if(!privIp(L[i]))return L[i];if(L.length)return L[0]}return req.socket.remoteAddress||'?'};
 function baseUrl(req){
  const pub=opts.publicUrl||process.env.PUBLIC_URL;if(pub)return pub.replace(/\/+$/,'');
  const proto=process.env.TRUST_PROXY&&req.headers['x-forwarded-proto']?String(req.headers['x-forwarded-proto']).split(',')[0]:'http';
  return proto+'://'+(req.headers.host||'localhost')}
 const okPng=v=>typeof v==='string'&&v.length<400000&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(v);
 const cut=(v,n)=>String(v==null?'':v).slice(0,n);
 const CV_T=new Set(['head','title','client','lines','totals','text','image','qty','legal','sign','sep','space']);
 function cvVal(v,d){if(typeof v==='string')return cut(v,4000);if(typeof v==='number')return Number.isFinite(v)?v:0;if(typeof v==='boolean')return v;
  if(v==null||d>2)return undefined;
  if(Array.isArray(v))return v.slice(0,40).map(x=>cvVal(x,d+1)).filter(x=>x!==undefined);
  if(typeof v==='object'){const o={};Object.keys(v).slice(0,30).forEach(k=>{if(/^[a-z0-9]{1,12}$/i.test(k)){const x=cvVal(v[k],d+1);if(x!==undefined)o[k]=x}});return o}
  return undefined}
 function cleanCv(c){
  if(!c||typeof c!=='object'||!Array.isArray(c.blocks))return undefined;
  const blocks=c.blocks.slice(0,80).filter(b=>b&&typeof b==='object'&&CV_T.has(b.t)).map(b=>{const o=cvVal(b,0);o.t=b.t;o.id=cut(b.id,32);return o});
  const st={};if(c.st&&typeof c.st==='object')['ac','ff','fs','th','hd','gp'].forEach(k=>{if(typeof c.st[k]==='string')st[k]=cut(c.st[k],12)});
  const imgs={};let tot=0;
  if(c.imgs&&typeof c.imgs==='object')Object.keys(c.imgs).slice(0,8).forEach(k=>{const v=c.imgs[k];
   if(/^[a-z0-9]{1,20}$/i.test(k)&&typeof v==='string'&&v.length<700000&&/^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+\/=]+$/.test(v)&&tot+v.length<3e6){imgs[k]=v;tot+=v.length}});
  return{v:1,st,blocks,imgs}}
 const invKey=d=>{if(!d||typeof d!=='object')return sha('');const {pays,share,sent,viewedAt,updatedAt,rev,cert,relances,...rest}=d;return sha(JSON.stringify(rest,Object.keys(rest).sort()).length+'|'+JSON.stringify(Object.keys(rest).sort().map(k=>[k,rest[k]])))};
 function cleanDoc(d){
  d=d&&typeof d==='object'?d:{};const q=d.quote&&typeof d.quote==='object'?d.quote:{},p=d.prof&&typeof d.prof==='object'?d.prof:{};
  const num=v=>Number.isFinite(+v)?+v:0;
  return{
   quote:{id:cut(q.id,64),num:cut(q.num,40),date:cut(q.date,10),client:cut(q.client,120),tel:cut(q.tel,40),adr:cut(q.adr,200),
    remise:num(q.remise),acompte:num(q.acompte),franchise:!!q.franchise,
    lines:(Array.isArray(q.lines)?q.lines:[]).slice(0,300).map(l=>({label:cut(l&&l.label,300),qty:num(l&&l.qty),unit:cut(l&&l.unit,20),pu:num(l&&l.pu),tva:num(l&&l.tva)})),cv:cleanCv(q.cv)},
   prof:{nom:cut(p.nom,120),adr:cut(p.adr,200),siret:cut(p.siret,40),tel:cut(p.tel,40),email:cut(p.email,120),assur:cut(p.assur,200),valid:num(p.valid)||30,forme:cut(p.forme,120),rm:cut(p.rm,80),tvai:cut(p.tvai,40)}}}
 const sha=o=>crypto.createHash('sha256').update(typeof o==='string'?o:JSON.stringify(o)).digest('hex');
 function publicSign(sg){
  return{status:sg.status,doc:sg.doc,docHash:sg.docHash,sentAt:sg.sentAt,expires:sg.expires,
   pro:{img:sg.pro.img,name:sg.pro.name,at:sg.pro.at},
   client:sg.client?{img:sg.client.img,name:sg.client.name,at:sg.client.at}:null,proof:sg.proof||null}}
 async function notifySigned(sg){
  const q=sg.doc.quote,n=q.num||'',c=(sg.client&&sg.client.name)||q.client||'';
  const who=Object.values(data.users).filter(u=>u.role==='patron'||u.role==='chef').map(u=>u.name.toLowerCase());
  const subs=data.subs.filter(s=>who.includes(s.user));let dead=false;
  await Promise.all(subs.map(async s=>{
   const txt=(PUSH_TXT[s.lang]||PUSH_TXT.fr).replace('{c}',c).replace('{n}',n);
   const r=await pushSend(s.sub,{title:'casô',body:txt,url:'/?q='+encodeURIComponent(q.id||''),tag:'sign-'+sg.token});
   if(r&&(r.status===404||r.status===410)){s.dead=1;dead=true}}));
  if(dead){data.subs=data.subs.filter(s=>!s.dead);persist()}}
 /* --- rappels du planning --- */
 const nk=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/^(m\.|mme|mlle|monsieur|madame)\s+/,'').trim();
 function usersFor(ev){ // patron et chef, plus les ouvriers affectés au rendez-vous
  const out=new Set(Object.values(data.users).filter(u=>u.role==='patron'||u.role==='chef').map(u=>u.name.toLowerCase()));
  (ev.who||[]).forEach(id=>{const p=data.recs.people[id];if(!p)return;const u=Object.values(data.users).find(x=>nk(x.name)===nk(p.nom));if(u)out.add(u.name.toLowerCase())});
  return out}
 async function remindTick(now){
  now=now||Date.now();let dirty=false;const jobs=[];
  for(const ev of Object.values(data.recs.events||{})){
   if(!ev||ev.t!=='rdv'||!Array.isArray(ev.rem))continue;
   for(const x of ev.rem){
    if(!Array.isArray(x))continue;const [t,k,d]=x,key=ev.id+'|'+k+'|'+d;
    if(typeof t!=='number'||t>now||now-t>30*60e3||data.remSent[key])continue;
    data.remSent[key]=now;dirty=true;
    const who=usersFor(ev),cl=ev.cid&&data.recs.clients[ev.cid];
    for(const s of data.subs.filter(s=>who.has(s.user))){
     const T=REM_TXT[s.lang]||REM_TXT.fr,title=(ev.title||T[2])+(cl&&cl.nom?' · '+cl.nom:'');
     const body=(k==='v'?T[0]:T[1]).replace('{h}',ev.a||'').replace('{t}',title).replace(/\s+:/,' :').trim()+(ev.adr?' — '+ev.adr:'');
     jobs.push(pushSend(s.sub,{title:'casô',body,url:'/?agenda='+encodeURIComponent(d),tag:'rem-'+key}).then(r=>{if(r&&(r.status===404||r.status===410))s.dead=1}).catch(()=>{}))}}}
  Object.keys(data.remSent).forEach(k=>{if(now-data.remSent[k]>4*864e5){delete data.remSent[k];dirty=true}});
  await Promise.all(jobs);
  if(data.subs.some(s=>s.dead))data.subs=data.subs.filter(s=>!s.dead);
  if(dirty)persist();return jobs.length}
 if(!opts.noTimers){const iv=setInterval(()=>{remindTick().catch(()=>{})},60e3);if(iv.unref)iv.unref()}

 /* --- abonnement d'agenda (.ics) --- */
 const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 const dOf=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
 function occurs(e,d){
  if(!e||e.t==='dispo')return false;
  if(!e.rr)return e.d<=d&&(e.d2||e.d)>=d;
  if(d<e.d||(e.rr.u&&d>e.rr.u)||(e.ex||[]).includes(d))return false;
  const x=dOf(d),s0=dOf(e.d);
  if(e.rr.f==='d')return true;if(e.rr.f==='m')return x.getDate()===s0.getDate();
  return (e.rr.days&&e.rr.days.length?e.rr.days:[s0.getDay()]).includes(x.getDay())}
 function icsFor(user){
  const all=user.role!=='ouvrier',me=Object.values(data.recs.people).filter(p=>nk(p.nom)===nk(user.name)).map(p=>p.id);
  const okD=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v),okT=v=>typeof v==='string'&&/^\d{2}:\d{2}$/.test(v);
  const E=Object.values(data.recs.events||{}).filter(e=>e&&(e.t==='rdv'||e.t==='off')&&okD(e.d)&&(!e.d2||okD(e.d2))&&(!e.a||okT(e.a))&&(!e.b||okT(e.b))&&(!e.rr||typeof e.rr==='object')&&(all||(Array.isArray(e.who)?e.who:[]).some(id=>me.includes(id))));
  const esc2=s=>String(s||'').replace(/\r/g,'').replace(/[\\,;]/g,m=>'\\'+m).replace(/\n/g,'\\n'),st=(d,t)=>d.replace(/-/g,'')+(t?'T'+t.replace(':','')+'00':'');
  const stamp=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z',V=[],t0=new Date();t0.setDate(t0.getDate()-31);
  for(let k=0;k<214;k++){const x=new Date(t0);x.setDate(x.getDate()+k);const d=ymd(x);
   for(const e of E){if(!occurs(e,d)||(e.d2&&!e.rr&&d!==e.d))continue;const cl=e.cid&&data.recs.clients[e.cid];
    const a=e.a,b=e.b||(a?String(Math.min(23,+a.slice(0,2)+1)).padStart(2,'0')+a.slice(2):null),dn=new Date(dOf(e.d2&&!e.rr?e.d2:d));dn.setDate(dn.getDate()+1);
    V.push(['BEGIN:VEVENT','UID:'+e.id+'-'+d+'@caso','DTSTAMP:'+stamp,(a?'DTSTART:':'DTSTART;VALUE=DATE:')+st(d,a),(a?'DTEND:':'DTEND;VALUE=DATE:')+(a?st(d,b):st(ymd(dn))),
     'SUMMARY:'+esc2((e.title||(e.t==='off'?'Indisponible':'Rendez-vous'))+(cl&&cl.nom?' – '+cl.nom:'')),e.adr?'LOCATION:'+esc2(e.adr):'',e.note?'DESCRIPTION:'+esc2(e.note):'','END:VEVENT'].filter(Boolean).join('\r\n'))}}
  const tz=(data.ics.tz||'Europe/Paris').replace(/[^\w/+-]/g,'');
  return['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//caso//planning//FR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:casô','X-WR-TIMEZONE:'+tz,'REFRESH-INTERVAL;VALUE=DURATION:PT1H','X-PUBLISHED-TTL:PT1H',...V,'END:VCALENDAR'].join('\r\n')+'\r\n'}

 const SW=`const CACHE='caso-app-3',APP=/(\\/|\\/index\\.html|\\/devis\\.html|\\/manifest\\.webmanifest|\\/(?:icon-[a-z0-9-]+|favicon-32)\\.png)$/;
const home=()=>new URL('./',self.registration.scope).pathname;
const fromCache=u=>caches.open(CACHE).then(x=>x.match(u.pathname).then(m=>m||(/\\.(?:png|webmanifest)$/.test(u.pathname)?null:x.match(home()))));
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>fetch(self.registration.scope,{cache:'reload'}).then(r=>{if(r.ok)return c.put(home(),r)})).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('caso-app-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
const LIB=/^https:\\/\\/cdn\\.jsdelivr\\.net\\/npm\\/(?:tesseract\\.js@5\\.1\\.1|tesseract\\.js-core@5\\.1\\.1|@tesseract\\.js-data\\/fra@1\\.0\\.0|pdfjs-dist@3\\.11\\.174)\\//;
const LIB2=/^https:\\/\\/cdnjs\\.cloudflare\\.com\\/ajax\\/libs\\/(?:three\\.js\\/r128|pdf\\.js\\/2\\.16\\.105)\\//;
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;
 if(LIB.test(q.url)||LIB2.test(q.url)){e.respondWith(caches.open('caso-lib-1').then(c=>c.match(q.url).then(m=>m||fetch(q).then(r=>{if(r.ok||r.type==='opaque')c.put(q.url,r.clone());return r}))));return}const u=new URL(q.url);if(u.origin!==location.origin||!APP.test(u.pathname))return;
 e.respondWith(new Promise(res=>{let done=false;const end=r=>{if(!done&&r){done=true;res(r)}};
  const t=setTimeout(()=>fromCache(u).then(end),4000);
  fetch(q.url,{cache:'no-cache'}).then(r=>{clearTimeout(t);if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(u.pathname,c))}end(r)})
   .catch(()=>{clearTimeout(t);fromCache(u).then(m=>{end(m||Response.error())})})}))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){d={title:'casô',body:e.data?e.data.text():''}}
 e.waitUntil(self.registration.showNotification(d.title||'casô',{body:d.body||'',tag:d.tag,data:{url:d.url||'/'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=(e.notification.data&&e.notification.data.url)||'/';
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c){c.postMessage({type:/agenda=/.test(u)?'agenda':'signed',url:u});return c.focus()}}return self.clients.openWindow(u)}))});`;

 /* --- HTTP --- */
 const cors={'access-control-allow-origin':'*','access-control-allow-headers':'content-type, authorization','access-control-allow-methods':'GET, POST, OPTIONS'};
 const SEC={'x-content-type-options':'nosniff','referrer-policy':'no-referrer','x-frame-options':'DENY','permissions-policy':'geolocation=(), payment=(), usb=()','cross-origin-opener-policy':'same-origin'};
 if(process.env.TRUST_PROXY||process.env.TRUST_CF)SEC['strict-transport-security']='max-age=31536000; includeSubDomains';
 const CSP_APP="default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/ https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1/ https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/ https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/ https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob: mediastream:; font-src 'self' data:; connect-src 'self' https:; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
 const CSP_PUB="default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
 function send(res,code,obj,extra){
  const isHtml=typeof obj==='string';
  res.writeHead(code,Object.assign({'content-type':isHtml?'text/html; charset=utf-8':'application/json; charset=utf-8','cache-control':'no-store'},SEC,isHtml?{'content-security-policy':CSP_APP}:cors,extra||{}));
  res.end(isHtml?obj:JSON.stringify(obj))}
 function readBody(req){return new Promise((ok,ko)=>{
  let n=0;const chunks=[];
  const pub=m=>Object.assign(new Error(m),{pub:true});
  req.on('data',c=>{n+=c.length;if(n>5e6){ko(pub('Envoi trop gros.'));req.destroy()}else chunks.push(c)});
  req.on('end',()=>{try{const v=JSON.parse(Buffer.concat(chunks).toString()||'{}');if(!v||typeof v!=='object'||Array.isArray(v))return ko(pub('Requête invalide.'));ok(v)}catch(e){ko(pub('JSON invalide.'))}});
  req.on('error',ko)})}

 const server=http.createServer(async(req,res)=>{
  const url=req.url.split('?')[0],ip=clientIp(req),POST=req.method==='POST';
  try{
   if(req.method==='OPTIONS'){res.writeHead(204,cors);return res.end()}
   if(NEWL&&req.method==='GET'&&url==='/devis.html'){/* module Devis, ouvert dans un cadre de l'appli */
    let html;try{html=fs.readFileSync(path.join(ROOT,'devis.html'),'utf8')}catch(e){return send(res,404,{error:'introuvable'})}
    return send(res,200,html,{'content-security-policy':CSP_APP.replace("frame-ancestors 'none'","frame-ancestors 'self'"),'x-frame-options':'SAMEORIGIN'})}
   if(NEWL&&req.method==='GET'&&/^\/(?:chat|lib)\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.(?:js|json|wasm|mjs)$/.test(url)){/* fichiers du chat et bibliothèques */
    let b;try{b=fs.readFileSync(path.join(ROOT,url))}catch(e){return send(res,404,{error:'introuvable'})}
    const ty=url.endsWith('.json')?'application/json; charset=utf-8':url.endsWith('.wasm')?'application/wasm':'text/javascript; charset=utf-8';
    res.writeHead(200,Object.assign({'content-type':ty,'cache-control':'no-cache'},SEC));return res.end(b)}
   if(NEWL&&req.method==='GET'&&url==='/sw.js'){let b;try{b=fs.readFileSync(path.join(ROOT,'sw.js'))}catch(e){b=null}
    if(b){res.writeHead(200,{'content-type':'text/javascript; charset=utf-8','cache-control':'no-cache','service-worker-allowed':'/'});return res.end(b)}}
   if(req.method==='GET'&&(url==='/'||url==='/index.html'||(!NEWL&&url==='/devis.html'))){
    let html;try{html=fs.readFileSync(APP,'utf8')}catch(e){return send(res,404,{error:'devis.html introuvable à côté du serveur'})}
    return send(res,200,html)}

   /* abonnement d'agenda (lien secret) */
   {const mm=req.method==='GET'&&url.match(/^\/ics\/([a-f0-9]{48})\.ics$/);
    if(mm){const own=data.ics[mm[1]],u=own&&data.users[own.user];if(!u)return send(res,404,{error:'introuvable'});
     const body=icsFor(u);res.writeHead(200,Object.assign({'content-type':'text/calendar; charset=utf-8','cache-control':'no-cache','x-robots-tag':'noindex'},SEC));return res.end(body)}}

   /* page de la facture pour le client */
   if(req.method==='GET'&&/^\/f\/[a-f0-9]{32}$/.test(url)){
    let html;try{html=fs.readFileSync(FACTURE,'utf8')}catch(e){return send(res,404,{error:'facture.html introuvable'})}
    res.writeHead(200,Object.assign({'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex','content-security-policy':CSP_PUB},SEC));return res.end(html)}
   {const mf=url.match(/^\/api\/f\/([a-f0-9]{32})(\/certify)?$/);
    if(mf){const sh=data.invShares[mf[1]];if(!sh)return send(res,404,{error:'Ce lien n\'existe pas.'});
     if(req.method==='GET'&&!mf[2]){if(!sh.viewedAt){sh.viewedAt=Date.now();persist()}return send(res,200,{doc:sh.doc,cert:sh.cert?{name:sh.cert.name,at:sh.cert.at}:null,viewedAt:sh.viewedAt})}
     if(POST&&mf[2]){
      if(tooMany(ip))return send(res,429,{error:'Trop d\'essais, patientez une minute.'});
      if(sh.cert)return send(res,409,{error:'Déjà certifié.'});
      const b=await readBody(req),name=cut(b.name,80).trim();
      if(name.length<2){fail(ip);return send(res,400,{error:'Écrivez votre nom.'})}
      if(b.agree!==true)return send(res,400,{error:'Cochez la case pour certifier.'});
      if(sh.cert)return send(res,409,{error:'Déjà certifié.'});
      sh.cert={docKey:invKey(sh.doc),name,at:Date.now(),ip:clientIp(req),ua:cut(req.headers['user-agent'],300)};persist();
      return send(res,200,{cert:{name,at:sh.cert.at}})}
     return send(res,405,{error:'méthode'})}}

   /* page de signature du client et service de notifications */
   if(req.method==='GET'&&/^\/s\/[a-f0-9]{32}$/.test(url)){
    let html;try{html=fs.readFileSync(SIGNER,'utf8')}catch(e){return send(res,404,{error:'signer.html introuvable'})}
    res.writeHead(200,Object.assign({'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex','content-security-policy':CSP_PUB},SEC));return res.end(html)}
   {const m=req.method==='GET'&&/^\/(manifest\.webmanifest|icon-(?:180|192|512|maskable-512)\.png|favicon-32\.png)$/.exec(url);
    if(m){let b;try{b=fs.readFileSync(path.join(path.dirname(APP),m[1]))}catch(e){return send(res,404,{error:'introuvable'})}
     res.writeHead(200,{'content-type':m[1].endsWith('.png')?'image/png':'application/manifest+json; charset=utf-8','cache-control':'no-cache','x-content-type-options':'nosniff'});return res.end(b)}}/* PWA_FILES */
   if(req.method==='GET'&&url==='/sw.js'){res.writeHead(200,{'content-type':'text/javascript; charset=utf-8','cache-control':'no-cache','service-worker-allowed':'/'});return res.end(SW)}
   let m=url.match(/^\/api\/s\/([a-f0-9]{32})(\/sign)?$/);
   if(m){
    const sg=data.signs[m[1]];
    if(!sg)return send(res,404,{error:'Ce lien n\'existe pas.'});
    if(req.method==='GET'){if(!sg.viewedAt&&sg.status==='sent'){sg.viewedAt=Date.now();persist()}return send(res,200,publicSign(sg))}
    if(POST&&m[2]){
     if(tooMany(ip))return send(res,429,{error:'Trop d\'essais, patientez une minute.'});
     if(sg.status==='signed')return send(res,409,{error:'Ce devis est déjà signé.'});
     if(sg.status!=='sent')return send(res,410,{error:'Ce devis a été remplacé ou annulé. Contactez l\'entreprise.'});
     if(sg.expires&&Date.now()>sg.expires)return send(res,410,{error:'Ce devis a expiré. Contactez l\'entreprise.'});
     const b=await readBody(req),name=cut(b.name,80).trim();
     if(name.length<2){fail(ip);return send(res,400,{error:'Écrivez votre nom.'})}
     if(b.agree!==true)return send(res,400,{error:'Cochez « Bon pour accord ».'});
     if(!okPng(b.img)){fail(ip);return send(res,400,{error:'Signature manquante.'})}
     if(sg.status!=='sent')return send(res,409,{error:'Ce devis est déjà signé.'});
     const at=Date.now();
     sg.client={img:b.img,name,at,ip:clientIp(req),ua:cut(req.headers['user-agent'],300)};
     sg.status='signed';
     sg.proof=sha({docHash:sg.docHash,pro:sha(sg.pro.img),proAt:sg.pro.at,client:sha(b.img),name,at});
     // le devis passe en « validé » pour toute l'équipe (synchronisation)
     const qid=sg.doc.quote.id;
     if(qid){const cur=data.recs.quotes[qid]||Object.assign({},sg.doc.quote,{id:qid}),dq=sg.doc.quote;
      data.recs.quotes[qid]=Object.assign({},cur,{lines:dq.lines,remise:dq.remise,acompte:dq.acompte,franchise:dq.franchise,client:dq.client,tel:dq.tel,adr:dq.adr,num:dq.num,date:dq.date},dq.cv?{cv:dq.cv}:{},{status:'accepte',sign:Object.assign({},cur.sign||{},{token:sg.token,url:sg.url,st:'signed',signedAt:at,clientName:name,proof:sg.proof}),updatedAt:at,rev:++data.rev})}
     persist();
     notifySigned(sg).catch(()=>{});
     return send(res,200,publicSign(sg))}
    return send(res,405,{error:'méthode'})}

   /* ouvert à tous : état du serveur et adresses */
   if(req.method==='GET'&&url==='/api/ping')return send(res,200,{ok:true,app:'devis-btp',schema:3,sign:true});
   if(req.method==='GET'&&url==='/api/state')return send(res,200,{needsSetup:!Object.keys(data.users).length,local:isLocal(req)});
   if(req.method==='GET'&&url==='/api/info')return isLocal(req)?send(res,200,{port:server.address()?server.address().port:null,ips:lan()}):send(res,200,{port:null,ips:[]});

   /* premier lancement : le patron crée son compte, depuis l'ordinateur du serveur uniquement */
   if(POST&&url==='/api/setup'){
    if(Object.keys(data.users).length)return send(res,409,{error:'Le serveur est déjà configuré.'});
    if(tooMany(ip))return send(res,429,{error:'Trop d\'essais, patiente une minute.'});
    const b=await readBody(req),name=String(b.user||'patron').trim();
    const code=process.env.SETUP_CODE||opts.setupCode;
    if(!isLocal(req)&&!(code&&sameSecret(b.code||'',code))){fail(ip);return send(res,403,{error:'La première configuration se fait depuis l\'ordinateur qui héberge le serveur (ou avec le code de configuration).'})}
    if(!validName(name))return send(res,400,{error:'Prénom invalide (2 à 30 caractères).'});
    if(String(b.password||'').length<8)return send(res,400,{error:'Mot de passe : 8 caractères minimum.'});
    makeUser(name,b.password,'patron');
    return send(res,200,newToken(data.users[name.toLowerCase()]))}

   if(POST&&url==='/api/login'){
    if(tooMany(ip))return send(res,429,{error:'Trop d\'essais, patiente une minute.'});
    const b=await readBody(req);
    const uk=String(b.user||'').toLowerCase(),u=own(data.users,uk)?data.users[uk]:null;
    if(!u){hash(String(b.password||''),'00000000000000000000000000000000');fail(ip);return send(res,401,{error:'Identifiant ou mot de passe incorrect.'})}
    if(!checkPw(u,b.password||'')){fail(ip);return send(res,401,{error:'Identifiant ou mot de passe incorrect.'})}
    return send(res,200,newToken(u))}

   /* l'employé qui scanne le QR code */
   if(POST&&url==='/api/join'){
    if(tooMany(ip))return send(res,429,{error:'Trop d\'essais, patiente une minute.'});
    const b=await readBody(req),code=String(b.code||'');
    const inv=own(data.invites,code)?data.invites[code]:null;
    if(!inv||inv.exp<Date.now()){fail(ip);return send(res,404,{error:'Invitation invalide ou expirée. Demande un nouveau QR code.'})}
    delete data.invites[code];
    const u=data.users[inv.user];
    if(!u)return send(res,404,{error:'Ce compte n\'existe plus.'});
    return send(res,200,newToken(u))}

   m=null;
   const user=authUser(req);
   if(!url.startsWith('/api/'))return send(res,404,{error:'introuvable'});
   if(!user)return send(res,401,{error:'Non connecté.'});

   if(POST&&url==='/api/sync')return send(res,200,doSync(user,await readBody(req)));

   /* suppression du compte : un employé supprime son compte ; le patron supprime tout l'espace de l'entreprise */
   if(POST&&url==='/api/account/delete'){
    const b=await readBody(req);if(b.confirm!=='SUPPRIMER')return send(res,400,{error:'Confirmation manquante.'});
    const me=user.name.toLowerCase();
    if(user.role==='patron'){
     if(tooMany(ip))return send(res,429,{error:'Trop d\'essais, patiente une minute.'});
     if(!checkPw(user,String(b.password||''))){fail(ip);return send(res,403,{error:'Mot de passe du serveur incorrect.'})}
     const keep={vapid:data.vapid,invSeq:data.invSeq};
     data={rev:(data.rev||0)+1,counter:0,users:Object.create(null),tokens:Object.create(null),invites:Object.create(null),recs:Object.create(null),tombs:[],signs:Object.create(null),subs:[],
      invShares:Object.create(null),ics:Object.create(null),invSeq:Object.assign(Object.create(null),keep.invSeq||{}),invIds:{},remSent:Object.create(null),vapid:keep.vapid};
     COLL.forEach(c=>{data.recs[c]=Object.create(null)});
     persist();return send(res,200,{ok:true,scope:'entreprise'})}
    delete data.users[me];
    Object.keys(data.tokens).forEach(t=>{if(data.tokens[t].user===me)delete data.tokens[t]});
    Object.keys(data.invites).forEach(c=>{if(data.invites[c].user===me)delete data.invites[c]});
    data.subs=data.subs.filter(x=>x.user!==me);
    Object.keys(data.ics).forEach(k=>{if(k!=='tz'&&data.ics[k]&&data.ics[k].user===me)delete data.ics[k]});
    persist();return send(res,200,{ok:true,scope:'compte'})}

   /* notifications */
   if(req.method==='GET'&&url==='/api/push/key')return send(res,200,{key:data.vapid.pub});
   if(POST&&url==='/api/push/sub'){
    const b=await readBody(req),sub=b.sub;
    let host='';try{const U=new URL(String(sub&&sub.endpoint||''));host=U.protocol==='https:'?U.hostname:''}catch(e){}
    const okHost=opts.pushAnyHost||/(^|\.)(push\.apple\.com|fcm\.googleapis\.com|android\.googleapis\.com|push\.services\.mozilla\.com|notify\.windows\.com)$/.test(host);
    if(!sub||!okHost||!sub.keys||!sub.keys.p256dh||!sub.keys.auth)return send(res,400,{error:'Abonnement invalide.'});
    data.subs=data.subs.filter(s=>s.sub.endpoint!==sub.endpoint);
    {const mine=data.subs.filter(s=>s.user===user.name.toLowerCase());if(mine.length>=5){const old=mine.sort((a,b)=>a.at-b.at)[0];data.subs=data.subs.filter(s=>s!==old)}}
    data.subs.push({user:user.name.toLowerCase(),lang:cut(b.lang,5)||'fr',sub:{endpoint:cut(sub.endpoint,1000),keys:{p256dh:cut(sub.keys.p256dh,200),auth:cut(sub.keys.auth,100)}},at:Date.now()});
    persist();return send(res,200,{ok:true})}

   /* envoyer une facture par lien (mise à jour à chaque paiement) */
   if(POST&&url==='/api/inv/share'){
    if(user.role==='ouvrier')return send(res,403,{error:'Réservé au patron et au chef.'});
    const b=await readBody(req),d=b.doc;
    if(!d||typeof d!=='object'||typeof d.id!=='string'||!/^[FA]\d{4}-\d{4,}$/.test(String(d.num||''))||!Array.isArray(d.lines)||!d.lines.every(l=>l&&typeof l==='object'&&Number.isFinite(+l.qty)&&Number.isFinite(+l.pu)&&Number.isFinite(+l.tva)))return send(res,400,{error:'Facture invalide.'});
    ['remise','ret'].forEach(k=>{if(d[k]!=null&&!Number.isFinite(+d[k]))d[k]=0});
    const doc=JSON.parse(JSON.stringify(d));if(JSON.stringify(doc).length>200000)return send(res,413,{error:'Trop gros.'});
    let tok=Object.keys(data.invShares).find(k=>data.invShares[k].id===doc.id);
    if(!tok){tok=crypto.randomBytes(16).toString('hex');data.invShares[tok]={id:doc.id,at:Date.now()}}
    {const sh0=data.invShares[tok];if(sh0.cert&&sh0.cert.docKey&&sh0.cert.docKey!==invKey(doc)){sh0.certOld=sh0.cert;delete sh0.cert}}
    data.invShares[tok].doc=doc;data.invShares[tok].upd=Date.now();persist();
    const sh=data.invShares[tok];
    return send(res,200,{url:baseUrl(req)+'/f/'+tok,token:tok,viewedAt:sh.viewedAt||null,cert:sh.cert?{name:sh.cert.name,at:sh.cert.at}:null})}

   /* numéro de facture : suite continue, sans trou ni doublon, tenue par le serveur */
   if(POST&&url==='/api/inv/next'){
    if(user.role==='ouvrier')return send(res,403,{error:'Réservé au patron et au chef.'});
    const b=await readBody(req),key=String(b.key||'');if(!/^[FA]\d{4}$/.test(key))return send(res,400,{error:'Clé invalide.'});
    const iid=typeof b.inv==='string'?cut(b.inv,64):'';if(iid&&own(data.invIds,key+'|'+iid))return send(res,200,{n:data.invIds[key+'|'+iid]});
    const cur=own(data.invSeq,key)?data.invSeq[key]:0,loc=Math.max(0,Math.floor(Number(b.local)||0));
    const n=Math.max(cur,Math.min(loc,cur?cur+20:500))+1;  // rattrape les numéros émis hors ligne, sans saut volontaire  // jamais derrière un numéro déjà émis par ce téléphone (pas de doublon)
data.invSeq[key]=n;if(iid)data.invIds[key+'|'+iid]=n;persist();return send(res,200,{n})}

   /* abonnement d'agenda : un lien secret par personne */
   if(POST&&(url==='/api/ics'||url==='/api/ics/reset')){
    const b=await readBody(req),me=user.name.toLowerCase();
    if(user.role!=='ouvrier'&&b.tz&&typeof b.tz==='string')data.ics.tz=cut(b.tz,40);
    let tok=Object.keys(data.ics).find(k=>k!=='tz'&&data.ics[k].user===me);
    if(url==='/api/ics/reset'&&tok){delete data.ics[tok];tok=null}
    if(!tok){tok=crypto.randomBytes(24).toString('hex');data.ics[tok]={user:me,at:Date.now()}}
    persist();const base=baseUrl(req),u=base+'/ics/'+tok+'.ics';
    return send(res,200,{url:u,webcal:u.replace(/^https?:/,'webcal:')})}

   /* devis à signer */
   if(url.startsWith('/api/sign/')){
    if(user.role==='ouvrier')return send(res,403,{error:'Réservé au patron et au chef.'});
    if(POST&&url==='/api/sign/new'){
     const b=await readBody(req),doc=cleanDoc(b.doc);
     if(!doc.quote.lines.length)return send(res,400,{error:'Le devis est vide.'});
     if(!okPng(b.img))return send(res,400,{error:'Signature manquante.'});
     const at=Date.now(),token=crypto.randomBytes(16).toString('hex');
     // un seul lien actif par devis : l'ancien est remplacé
     Object.values(data.signs).forEach(x=>{if(x.status==='sent'&&doc.quote.id&&x.doc.quote.id===doc.quote.id){x.status='replaced';x.replacedAt=at}});
     const d0=new Date(doc.quote.date||at);const exp=isNaN(d0)?null:d0.getTime()+(doc.prof.valid+1)*864e5;
     const sg={token,doc,docHash:sha(doc),pro:{img:b.img,name:cut(b.name||user.name,80),user:user.name,at},status:'sent',sentAt:at,expires:exp,url:baseUrl(req)+'/s/'+token};
     data.signs[token]=sg;
     const qid=doc.quote.id;
     if(qid&&data.recs.quotes[qid]&&data.recs.quotes[qid].status!=='accepte'){
      data.recs.quotes[qid]=Object.assign({},data.recs.quotes[qid],{status:'envoye',sign:{token,url:sg.url,st:'sent',sentAt:at},updatedAt:at,rev:++data.rev})}
     persist();return send(res,200,{token,url:sg.url,docHash:sg.docHash})}
    if(req.method==='GET'&&url==='/api/sign/list'){
     return send(res,200,Object.values(data.signs).map(x=>({token:x.token,quoteId:x.doc.quote.id,num:x.doc.quote.num,status:x.status,url:x.url,sentAt:x.sentAt,viewedAt:x.viewedAt||null,signedAt:x.client?x.client.at:null,clientName:x.client?x.client.name:null})))}
    if(POST&&url==='/api/sign/cancel'){
     const b=await readBody(req),x=data.signs[String(b.token||'')];
     if(!x)return send(res,404,{error:'introuvable'});
     if(x.status==='sent'){x.status='cancelled';persist()}
     return send(res,200,{ok:true,status:x.status})}
    return send(res,404,{error:'introuvable'})}

   /* gestion de l'équipe : patron seulement */
   if(url.startsWith('/api/users')||url==='/api/invite'){
    if(user.role!=='patron')return send(res,403,{error:'Réservé au patron.'});
    if(req.method==='GET'&&url==='/api/users')return send(res,200,Object.values(data.users).map(u=>({name:u.name,role:u.role})));
    if(POST&&url==='/api/invite'){
     const b=await readBody(req),name=String(b.user||'').trim();
     if(!validName(name))return send(res,400,{error:'Prénom invalide (2 à 30 caractères).'});
     let u=data.users[name.toLowerCase()];
     if(!u){
      if(!ROLES.includes(b.role))return send(res,400,{error:'Rôle inconnu.'});
      makeUser(name,crypto.randomBytes(16).toString('hex'),b.role);   // mot de passe inconnu de tous : on entre par le QR code
      u=data.users[name.toLowerCase()]}
     Object.keys(data.invites).forEach(k=>{if(data.invites[k].exp<Date.now()||data.invites[k].user===name.toLowerCase())delete data.invites[k]});
     const code=crypto.randomBytes(8).toString('hex');
     data.invites[code]={user:name.toLowerCase(),exp:Date.now()+INVITE_DAYS*864e5};
     persist();
     return send(res,200,{code,name:u.name,role:u.role,days:INVITE_DAYS})}
    if(POST&&url==='/api/users/remove'){
     const b=await readBody(req),key=String(b.user||'').toLowerCase();
     if(!data.users[key])return send(res,404,{error:'Compte introuvable.'});
     if(key===user.name.toLowerCase())return send(res,400,{error:'Tu ne peux pas retirer ton propre compte.'});
     delete data.users[key];
     Object.keys(data.tokens).forEach(t=>{if(data.tokens[t].user===key)delete data.tokens[t]});
     Object.keys(data.invites).forEach(c=>{if(data.invites[c].user===key)delete data.invites[c]});
     data.subs=data.subs.filter(x=>x.user!==key);Object.keys(data.ics).forEach(k=>{if(k!=='tz'&&data.ics[k]&&data.ics[k].user===key)delete data.ics[k]});
     persist();return send(res,200,{ok:true})}
    if(POST&&url==='/api/users'){      // création avec mot de passe (usage avancé)
     const b=await readBody(req),name=String(b.user||'').trim();
     if(!validName(name))return send(res,400,{error:'Identifiant invalide (2 à 30 caractères).'});
     if(String(b.password||'').length<8)return send(res,400,{error:'Mot de passe : 8 caractères minimum.'});
     if(!ROLES.includes(b.role))return send(res,400,{error:'Rôle inconnu.'});
     if(data.users[name.toLowerCase()])return send(res,409,{error:'Cet identifiant existe déjà.'});
     makeUser(name,b.password,b.role);persist();
     return send(res,200,{ok:true})}}
   return send(res,404,{error:'introuvable'});
  }catch(e){if(!e||!e.pub)console.error('[casô]',req.method,url,e&&e.stack||e);if(!res.headersSent)send(res,400,{error:e&&e.pub?e.message:'Requête invalide.'});else try{res.destroy()}catch(_){}}});

 return{server,data:()=>data,remindTick,icsFor};
}

/* Démarrage prêt à l'emploi : utilisable depuis un lanceur ou depuis une application */
function start(opts={}){
 const port=opts.port!==undefined?opts.port:(Number(process.env.PORT)||(process.env.APP_HOME?8080:8787));
 const s=createServer(opts);
 return new Promise((ok,ko)=>{
  s.server.once('error',ko);
  s.server.listen(port,'0.0.0.0',()=>ok(Object.assign(s,{port:s.server.address().port,addresses:lanAddresses()})))})}

module.exports={createServer,start,lanAddresses}; // srvfix-v1 srvsec-v1

if(require.main===module){
 start().then(s=>{
  console.log('\n  casô est prêt.\n');
  console.log('  1. Sur cet ordinateur, ouvre : http://localhost:'+s.port);
  console.log('  2. Pour ajouter un employé : dans l\'appli, Compte > Équipe > Créer le QR code.');
  console.log('     Il le scanne avec l\'appareil photo de son téléphone : rien à taper.');
  if(s.addresses.length)console.log('\n  Si le QR code ne marche pas, l\'employé tape cette adresse dans son navigateur :\n     http://'+s.addresses[0]+':'+s.port);
  console.log('\n  Laisse cette fenêtre ouverte. Pour arrêter : ferme-la.\n');
  if(process.env.OPEN_BROWSER){
   const {exec}=require('child_process'),u='http://localhost:'+s.port;
   exec(process.platform==='win32'?'start "" '+u:process.platform==='darwin'?'open '+u:'xdg-open '+u,()=>{})}
 }).catch(e=>{
  console.error(e.code==='EADDRINUSE'?'\n  Le serveur est déjà lancé (ou le port est occupé). Ferme l\'autre fenêtre et réessaie.\n':e);
  process.exit(1)});
}

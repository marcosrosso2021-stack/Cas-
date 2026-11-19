/* casô · Compte : premier lancement, compte, sauvegarde
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Premier lancement ---------- */
document.addEventListener('click',e=>{const sp=document.getElementById('splash');if(sp&&!sp.hidden&&sp.contains(e.target))splashEnd()});
function splashEnd(){const e=$('splash');if(!e||e.hidden)return;e.classList.add('gone');setTimeout(()=>{e.hidden=true;e.remove()},460)}
function startOpen(){
 const sp=$('splash');if(sp&&!sp.dataset.done){sp.dataset.done=1;sp.hidden=false;window.__splashGo&&__splashGo();setTimeout(splashEnd,matchMedia('(prefers-reduced-motion: reduce)').matches?900:3800)}
 document.body.classList.add('starting');
 document.querySelectorAll('section').forEach(x=>x.classList.remove('on'));
 $('s-start').classList.add('on');stShow('lg')}
/* ---------- Compte ----------
   Le compte est gardé sur ce téléphone, à part des données synchronisées (clé caso_account) :
   le mot de passe n'est jamais stocké, seulement son empreinte PBKDF2-SHA256 avec un sel aléatoire. */
const ACC_KEY='caso_account';
function accountGet(){try{return JSON.parse(localStorage.getItem(ACC_KEY))}catch(e){return null}}
function accountPut(a){try{localStorage.setItem(ACC_KEY,JSON.stringify(a));return true}catch(e){return false}}
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const unhex=h=>new Uint8Array(h.match(/../g).map(x=>parseInt(x,16)));
/* SHA-256 en JS, si le navigateur n'offre pas crypto.subtle (page ouverte en http sur le réseau) */
function sha256(m){
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
 const l=m.length,n=((l+9+63)>>6)<<6,b=new Uint8Array(n);b.set(m);b[l]=0x80;
 const dv=new DataView(b.buffer);dv.setUint32(n-4,l*8>>>0);dv.setUint32(n-8,Math.floor(l/0x20000000));
 const w=new Uint32Array(64),r=(x,k)=>(x>>>k)|(x<<(32-k));
 for(let o=0;o<n;o+=64){
  for(let i=0;i<16;i++)w[i]=dv.getUint32(o+i*4);
  for(let i=16;i<64;i++){const a=w[i-15],c=w[i-2];w[i]=(w[i-16]+(r(a,7)^r(a,18)^(a>>>3))+w[i-7]+(r(c,17)^r(c,19)^(c>>>10)))>>>0}
  let [A,B,C,D,E,F,G,Hh]=H;
  for(let i=0;i<64;i++){const t1=(Hh+(r(E,6)^r(E,11)^r(E,25))+((E&F)^(~E&G))+K[i]+w[i])>>>0,t2=((r(A,2)^r(A,13)^r(A,22))+((A&B)^(A&C)^(B&C)))>>>0;Hh=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0}
  H[0]=(H[0]+A)>>>0;H[1]=(H[1]+B)>>>0;H[2]=(H[2]+C)>>>0;H[3]=(H[3]+D)>>>0;H[4]=(H[4]+E)>>>0;H[5]=(H[5]+F)>>>0;H[6]=(H[6]+G)>>>0;H[7]=(H[7]+Hh)>>>0}
 const out=new Uint8Array(32),ov=new DataView(out.buffer);H.forEach((h,i)=>ov.setUint32(i*4,h));return out}
function hmac256(key,msg){
 if(key.length>64)key=sha256(key);
 const k=new Uint8Array(64);k.set(key);
 const ip=new Uint8Array(64+msg.length),op=new Uint8Array(96);
 for(let i=0;i<64;i++){ip[i]=k[i]^0x36;op[i]=k[i]^0x5c}
 ip.set(msg,64);op.set(sha256(ip),64);return sha256(op)}
function pbkdf2js(pw,salt,iter){
 const s1=new Uint8Array(salt.length+4);s1.set(salt);s1[salt.length+3]=1;
 let u=hmac256(pw,s1);const t=u.slice();
 for(let i=1;i<iter;i++){u=hmac256(pw,u);for(let j=0;j<32;j++)t[j]^=u[j]}
 return t}
async function pwHash(pw,salt,iter){
 const p=new TextEncoder().encode(pw);
 if(window.crypto&&crypto.subtle){
  const k=await crypto.subtle.importKey('raw',p,'PBKDF2',false,['deriveBits']);
  return hex(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:iter},k,256))}
 return hex(pbkdf2js(p,salt,iter))}
const ACC_ITER=()=>(window.crypto&&crypto.subtle)?600000:8000; // PBKDF2-SHA256 : 600 000 tours (recommandation OWASP)
/* nom ou SIRET : un numéro (SIREN 9 chiffres, SIRET 14, ou n° RCS / RM qui contient le SIREN) → recherche de l'entreprise */
const acLook={t:0,n:null,seq:0,co:null,dir:''};
function luhnOk(n){let s=0;for(let i=0;i<n.length;i++){let d=+n[n.length-1-i];if(i%2){d*=2;if(d>9)d-=9}s+=d}return s%10===0}
function acTva(siren){const k=(12+3*(Number(siren)%97))%97;return 'FR'+String(k).padStart(2,'0')+siren}
function acForme(c){c=String(c||'');return c==='1000'?'EI':c==='5498'?'EURL':/^54/.test(c)?'SARL':c==='5720'?'SASU':/^57/.test(c)?'SAS':''}
function acCap(t){return String(t||'').toLowerCase().replace(/(^|[\s'’(-])(\p{Ll})/gu,(m,a,b)=>a+b.toUpperCase())}
function acSt(t,cls){const e=$('acCoSt');e.textContent=t?i18nT(t):'';e.hidden=!t;e.className='ac-cost'+(cls?' '+cls:'')}
function acNomIn(){const d=$('acNom').value.replace(/\D/g,'');clearTimeout(acLook.t);
 if(d.length<9){acLook.n=null;acLook.co=null;acLook.seq++;$('acCo').hidden=true;acSt('');return}
 const n=d.length>=14?d.slice(0,14):d.slice(0,9);if(n===acLook.n)return;acLook.n=n;acLook.co=null;acLook.dir='';
 if(!luhnOk(n.slice(0,9))&&!/^356000000/.test(n)){$('acCo').hidden=true;acSt('Ce numéro ne semble pas valide : vérifie-le.','ko');return}
 acSt('Recherche de ton entreprise…');acLook.t=setTimeout(()=>acFind(n),350)}
async function acFind(n){const seq=++acLook.seq,siren=n.slice(0,9);let co=null,fail=false;
 try{const ctl=window.AbortController?new AbortController():null,tm=setTimeout(()=>ctl&&ctl.abort(),7000);
  const r=await fetch('https://recherche-entreprises.api.gouv.fr/search?q='+n+'&page=1&per_page=1',ctl?{signal:ctl.signal}:{});clearTimeout(tm);
  if(!r.ok)throw new Error('http');const j=await r.json();const x=(j.results||[])[0];if(x&&x.siren===siren)co=x}catch(e){fail=true}
 if(seq!==acLook.seq)return;
 const f=(k,v)=>{const e=$(k);if(e&&v!=null)e.value=v};
 if(co){const et=(co.matching_etablissements||[]).find(m=>m.siret===n)||co.siege||{};
  const pp=(co.dirigeants||[]).find(x=>x.type_dirigeant==='personne physique'&&x.prenoms);
  acLook.co=co;acLook.dir=pp?acCap(String(pp.prenoms).split(/[\s,]+/)[0]):'';
  f('acCoSiren',co.siren||siren);f('acCoNom',acCap(co.nom_complet||co.nom_raison_sociale||''));f('acCoAdr',acCap(et.adresse||''));f('acCoSiret',et.siret||(co.siege&&co.siege.siret)||(n.length===14?n:''));
  f('acCoForme',acForme(co.nature_juridique));f('acCoTva',(co.tva&&co.tva[0])||acTva(siren));
  acSt(co.etat_administratif==='C'?'Attention : cette entreprise est indiquée comme fermée. Vérifie le numéro.':'Entreprise trouvée : vérifie les informations.',co.etat_administratif==='C'?'ko':'ok')}
 else{f('acCoSiren',siren);f('acCoNom','');f('acCoAdr','');f('acCoSiret',n.length===14?n:'');f('acCoForme','');f('acCoTva',acTva(siren));
  acSt(fail?'Pas de connexion : remplis les informations de ton entreprise.':'Numéro introuvable : remplis les informations de ton entreprise.','ko')}
 $('acCo').hidden=false}
function acCheck(d){
 if(accountGet())return['acMail','Il y a déjà un compte sur ce téléphone. Connecte-toi.'];
 if(d.num&&!d.co)return['acNom','Recherche de ton entreprise en cours, patiente une seconde.'];
 if(!d.co&&d.prenom.length<2)return['acNom','Écris ton nom ou ton numéro SIRET.'];
 if(d.co&&d.ent.length<2)return['acCoNom',"Écris le nom de ton entreprise."];
 if(d.co&&d.siren&&(!sirenOk(d.siren)||(d.siret&&d.siret.slice(0,9)!==d.siren)))return['acNom','Ce numéro ne semble pas valide : vérifie-le.'];
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email))return['acMail','E-mail invalide.'];
 if(d.pass.length<8)return['acPass','8 caractères minimum.'];
 if(!d.cgu)return['acCgu','Accepte les conditions et la politique de confidentialité pour créer ton compte.'];
 return null}
async function accountCreate(d){
 const salt=crypto.getRandomValues(new Uint8Array(16)),iter=ACC_ITER();
 const acc={v:1,id:'u'+uid(),prenom:d.prenom,email:d.email.toLowerCase(),algo:'pbkdf2-sha256',iter,salt:hex(salt),hash:await pwHash(d.pass,salt,iter),createdAt:Date.now()};
 if(!accountPut(acc))throw new Error('stockage');
 try{if(window.VAULT)await VAULT.create(d.pass)}catch(e){}
 casoMail(acc.email,d.pass,d.prenom);
 db.me=Object.assign({},db.me||{},{prenom:d.prenom});
 db.prof=Object.assign({},db.prof||{},{nom:d.ent,email:acc.email});
 db.profAt=Date.now();save();
 return acc}
/* compte casô sur le serveur (essai, abonnement) : ouvert à chaque mot de passe saisi, sans bloquer l'appli */
function casoMail(email,pass,prenom){window.__casoMdpVu=1;try{if(window.CasoAuth&&CasoAuth.mail)CasoAuth.mail(email,pass,prenom).catch(()=>{})}catch(e){}}
function casoMailMdp(pass){try{if(window.CasoAuth&&CasoAuth.mailMdp)CasoAuth.mailMdp(pass).catch(()=>{})}catch(e){}}
async function accountCheck(email,pass){
 const a=accountGet();if(!a||a.email!==String(email).trim().toLowerCase())return false;
 return (await pwHash(pass,unhex(a.salt),a.iter))===a.hash}
let acBusy=false;
async function acSubmit(){
 if(acBusy)return;
 const v=$('acNom').value.trim(),num=v.replace(/\D/g,'').length>=9,co=!$('acCo').hidden;
 const ent=co?$('acCoNom').value.trim():v;
 const d={prenom:co?(acLook.dir||ent):v,ent,email:$('acMail').value.trim(),pass:$('acPass').value,num,co,siren:co?$('acCoSiren').value.replace(/\D/g,''):'',siret:co?$('acCoSiret').value.replace(/\D/g,''):'',cgu:$('acCgu').checked};
 document.querySelectorAll('#acForm input').forEach(i=>i.removeAttribute('aria-invalid'));
 const bad=acCheck(d);
 if(bad){$('acErr').textContent=i18nT(bad[1]);$('acErr').hidden=false;const f=$(bad[0]);f.setAttribute('aria-invalid','true');if(bad[0]==='acCgu')f.closest('label').classList.add('bad');f.focus();return}
 /* notifications : la demande part tout de suite (le téléphone ne la montre que pendant l'appui), l'abonnement après la création */
 const notifP=$('acNotif').checked&&window.Notification&&Notification.permission==='default'?Notification.requestPermission().catch(()=>'default'):Promise.resolve(window.Notification?Notification.permission:'default');
 acBusy=true;const btn=$('acGo');btn.disabled=true;btn.textContent='…';
 try{await accountCreate(d);if(co){db.prof=Object.assign({},db.prof||{},{adr:$('acCoAdr').value.trim(),siren:d.siren||d.siret.slice(0,9),siret:$('acCoSiret').value.replace(/\s/g,''),forme:$('acCoForme').value,tvai:$('acCoTva').value.replace(/\s/g,'').toUpperCase()});db.profAt=Date.now();save()}}
 catch(e){$('acErr').textContent="Impossible d'enregistrer sur ce téléphone.";$('acErr').hidden=false;acBusy=false;btn.disabled=false;btn.textContent='Créer mon compte';return}
 $('acPass').value='';fillProf();renderAcct();bkSet('devis_welcomed',1);
 {const a=accountGet();if(a){a.cgu={v:'2026-11-19',at:Date.now()};a.notif=$('acNotif').checked;accountPut(a)}}
 notifP.then(p=>{if(p==='granted'&&$('acNotif').checked&&typeof newsNotif==='function')newsNotif()});
 try{ONB.code=await rcSet()}catch(e){ONB.code=null}
 acBusy=false;btn.disabled=false;btn.textContent=i18nT('Créer mon compte');modeOpen(false)}
function renderAcct(){const a=accountGet(),c=$('acctCard');if(!c)return;c.hidden=!a;bioRender()}
/* ouvrir casô avec Face ID / empreinte : la passkey du téléphone ouvre le coffre (le mot de passe reste valable) */
const bioNom=()=>/iPhone|iPad|Macintosh/.test(navigator.userAgent)?'Face ID':'empreinte';
async function bioRender(){const b=$('bioBtn');if(!b)return;const V=window.VAULT;if(!V||!V.on||!V.hasPw()||!(await V.bioOk())){b.hidden=true;return}
 b.lastChild.textContent=i18nT(V.bioSet()?'Ne plus ouvrir avec {1}':'Ouvrir casô avec {1}').replace('{1}',bioNom());b.hidden=false}
async function bioToggle(){const V=window.VAULT;if(!V||!V.on)return;
 if(V.bioSet()){if(!V.hasPw())return;V.bioOff();bioRender();return}
 try{await V.bioOn(accountGet());toast(i18nT('Enregistré.'))}catch(e){toast(i18nT('{1} n’est pas disponible sur ce téléphone.').replace('{1}',bioNom()))}bioRender()}
/* ---------- Sauvegarde ---------- */
function bkGet(k){try{return Number(localStorage.getItem(k))||0}catch(e){return 0}}
function bkSet(k,v){try{localStorage.setItem(k,String(v))}catch(e){}}
function bkHasData(){return (db.quotes&&db.quotes.length)||(db.chantiers&&db.chantiers.length)||(db.prices&&db.prices.some(p=>!/^def-/.test(p.id)))||(db.pts&&db.pts.length)}
function bkAgo(t){
 const d=Math.floor((Date.now()-t)/864e5);
 return d<=0?"aujourd'hui":d===1?'hier':'il y a '+d+' jours'}
function bkRefresh(){
 const last=bkGet('devis_lastbackup'),st=$('bkStatus'),bn=$('bkBanner');
 if(st)st.textContent=last?'Dernière sauvegarde : '+bkAgo(last):'Aucune sauvegarde pour le moment.';
 if(!bn)return;
 const due=bkHasData()&&(!last||Date.now()-last>7*864e5)&&Date.now()>bkGet('devis_bksnooze');
 bn.style.display=due?'block':'none';
 if(due)$('bkBannerTxt').textContent=last?'Dernière sauvegarde '+bkAgo(last)+'.':'Aucune sauvegarde.'}
function bkSnooze(){bkSet('devis_bksnooze',Date.now()+864e5);bkRefresh()}
async function backupNow(){
 const day=ymdL(),name='devis-btp-'+day+'.json';
 const text=JSON.stringify(db);
 try{
  const f=new File([text],name,{type:'application/json'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){
   await navigator.share({files:[f],title:'Sauvegarde casô'});
   bkSet('devis_lastbackup',Date.now());bkRefresh();return}
 }catch(e){if(e&&e.name==='AbortError')return}      // l'utilisateur a fermé la fenêtre de partage : pas de sauvegarde
 dl(name,text,'application/json');
 bkSet('devis_lastbackup',Date.now());bkRefresh();
 alert('Fichier enregistré. Garde-le ailleurs que sur ce téléphone.')}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)bkRefresh()});

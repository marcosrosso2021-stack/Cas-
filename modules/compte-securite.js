/* casô · Compte : code de secours, suppression du compte, signature enregistrée
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Code de secours (mot de passe oublié) ---------- */
/* ---------- Supprimer mon compte (exigé par Apple et Google) ---------- */
function delOpen(){const c=getSync();
 $('delTx').textContent=c.token&&c.role==='patron'?"Ton compte, toutes les données de ce téléphone et tout l'espace de ton entreprise sur le serveur (équipe, devis, factures) seront effacés. Ça ne peut pas être annulé."
  :c.token?"Ton compte et les données de ce téléphone seront effacés. Les données de l'entreprise restent chez ton patron."
  :"Ton compte et toutes les données de ce téléphone (devis, factures, clients, planning) seront effacés. Ça ne peut pas être annulé.";
 {const np=sansMdp();$('delPw').hidden=np;$('delPw').previousElementSibling.hidden=np}
 $('delPw').value='';$('delSrv').value='';$('delSrvB').hidden=!(c.token&&c.role==='patron');$('delErr').hidden=true;$('delBg').hidden=false;$('delSh').hidden=false;requestAnimationFrame(()=>{$('delSh').classList.add('on');$('delBg').classList.add('on')})}
function delClose(){$('delSh').classList.remove('on');$('delBg').classList.remove('on');setTimeout(()=>{$('delSh').hidden=true;$('delBg').hidden=true},200)}
async function delGo(){const a=accountGet(),err=t=>{$('delErr').textContent=t;$('delErr').hidden=false};
 {const w=lkWait();if(w){err(lkMsg(w));return}}
 if(sansMdp()){if(!a||!(await bioConf()))return}
 else if(!a||!(await accountCheck(a.email,$('delPw').value))){lkFail();const w=lkWait();err(w?lkMsg(w):'Mot de passe incorrect.');return}
 lkOk();
 const c=getSync(),b=$('delGo');b.disabled=true;
 if(window.CasoAuth&&CasoAuth.connecte()){try{await CasoAuth.supprimer()}catch(e){b.disabled=false;err('Pas de connexion.');return}}
 if(c.url&&c.token){try{const r=await fetch(c.url+'/api/account/delete',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+c.token},body:JSON.stringify({confirm:'SUPPRIMER',password:$('delSrv').value})});
   if(r.status===403){b.disabled=false;err('Mot de passe du serveur incorrect.');return}
   if(r.status===429){b.disabled=false;err(lkMsg(60));return}
   if(!r.ok&&r.status!==401)throw new Error('srv')}catch(e){b.disabled=false;err("Pas de connexion au serveur de l'entreprise : réessaie avec du réseau.");return}}
 try{const g=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();const sub=g&&g.pushManager&&await g.pushManager.getSubscription();if(sub)await sub.unsubscribe()}catch(e){}
 let lang=null;try{lang=localStorage.getItem('caso_lang');localStorage.clear();sessionStorage.clear();if(lang)localStorage.setItem('caso_lang',lang)}catch(e){}
 clearTimeout(Store._t);Store._ts=0;if(typeof CBK!=='undefined')CBK.wipe();try{indexedDB.deleteDatabase('caso_ph')}catch(e){}
 location.reload()}
function rcMake(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',b=crypto.getRandomValues(new Uint8Array(10));let o='';b.forEach((x,i)=>{o+=A[x%A.length];if(i===4)o+='-'});return o}
const rcNorm=c=>String(c||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
async function rcSet(){
 const a=accountGet();if(!a)return null;
 const code=rcMake(),salt=crypto.getRandomValues(new Uint8Array(16));
 a.rsalt=hex(salt);a.riter=a.iter;a.rhash=await pwHash(rcNorm(code),salt,a.iter);accountPut(a);
 try{if(window.VAULT&&VAULT.on)await VAULT.wrapCode(rcNorm(code))}catch(e){}return code}
function rcShow(code){
 $('rcCode').textContent=code;$('rcBox').hidden=false;$('rcBg').hidden=false}
function rcClose(){$('rcBox').hidden=true;$('rcBg').hidden=true}
function rcCopy(){(navigator.clipboard?navigator.clipboard.writeText($('rcCode').textContent):Promise.reject()).then(()=>toast(i18nT('Code copié.')),()=>{})}
async function rcNew(){const c=await rcSet();if(c)rcShow(c)}
function forgotOpen(){$('lgForm').hidden=true;$('fgForm').hidden=false;$('fgErr').hidden=true;$('fgCode').value='';$('fgPass').value=''}
function forgotBack(){$('fgForm').hidden=true;$('lgForm').hidden=false}
async function forgotSubmit(){
 const a=accountGet(),err=m=>{$('fgErr').textContent=m;$('fgErr').hidden=false};
 if(!a)return;
 const pw=$('fgPass').value;if(pw.length<8)return err('8 caractères minimum.');
 {const w=lkWait();if(w)return err(lkMsg(w))}
 if(!a.rhash||(await pwHash(rcNorm($('fgCode').value),unhex(a.rsalt),a.riter||a.iter))!==a.rhash){lkFail();const w=lkWait();return err(w?lkMsg(w):'Code de secours incorrect.')}
 lkOk();const salt=crypto.getRandomValues(new Uint8Array(16));a.iter=Math.max(a.iter||0,ACC_ITER());a.salt=hex(salt);a.hash=await pwHash(pw,salt,a.iter);accountPut(a);
 try{if(window.VAULT){if(VAULT.on)await VAULT.wrapPass(pw);else await VAULT.create(pw)}}catch(e){}
 casoMailMdp(pw);
 const code=await rcSet();
 try{localStorage.removeItem('caso_locked')}catch(e){}
 $('fgForm').hidden=true;document.body.classList.remove('starting');go('devis');toast(i18nT('Mot de passe changé.'));
 if(code)setTimeout(()=>rcShow(code),400)}
function forgotWipe(){
 if(!confirm('Effacer le compte et les données de ce téléphone ? Si ton téléphone est relié à ton entreprise, tu retrouveras tes données en la rejoignant.'))return;
 let lang=null;try{lang=localStorage.getItem('caso_lang');localStorage.clear();if(lang)localStorage.setItem('caso_lang',lang)}catch(e){}
 clearTimeout(Store._t);Store._ts=0;if(typeof CBK!=='undefined')CBK.wipe();location.reload()}

/* ---------- Signature enregistrée (menu profil) ----------
   Tracé → Face ID / empreinte (passkey, la clé privée ne quitte jamais le téléphone) → enregistrement électronique :
   identifiant CS-… dérivé de l'empreinte SHA-256 (e-mail du compte | date | tracé), QR affiché sur les devis.
   Stocké ici : caso_sig (tracé), caso_sig_reg (identifiant, e-mail, date, empreinte, n° de clé Face ID, clé publique).
   Sauvegardé avec le reste de casô (Store.flush) et envoyé au serveur casô (/api/sig/register) : le QR ouvre /v/CS-…,
   page publique qui décrit le signataire et l'entreprise (données de « Mon entreprise »). */
let SPAD=null;
const sgVerify=()=>{const c=getSync();return String(c.url||location.origin).replace(/\/+$/,'')+'/v/'};
function sgReg(){try{return JSON.parse(localStorage.getItem('caso_sig_reg')||'null')}catch(e){return null}}
function sgOk(){const r=sgReg();return sgSigImg()&&r&&r.faceid?r:null}
const sgHex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sgB64=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const sgUnb64=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0));
function sgIdOf(h){const A='0123456789ABCDEFGHJKMNPQRSTVWXYZ',c=h.slice(0,16).match(/../g).map(x=>A[parseInt(x,16)%32]);
 return 'CS-'+c.slice(0,4).join('')+'-'+c.slice(4,8).join('')+'-'+A[c.reduce((s,x,i)=>s+A.indexOf(x)*(i+1),0)%32]}
function sgDate(iso){return new Date(iso).toLocaleDateString('fr-FR',{timeZone:'Europe/Paris'})}
function sgQrImg(r,mod){return 'data:image/svg+xml;base64,'+btoa(qrSvg(sgVerify()+r.id,mod||3))}
async function sgFaceId(hash,prev){
 let ok=false;try{ok=!!window.PublicKeyCredential&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch(e){}
 if(!ok)throw new Error('nofid');
 const ch=Uint8Array.from(hash.match(/../g),x=>parseInt(x,16));
 if(prev){try{await navigator.credentials.get({publicKey:{challenge:ch,rpId:location.hostname,userVerification:'required',allowCredentials:[{type:'public-key',id:sgUnb64(prev)}],timeout:60000}});return{credential_id:prev}}
  catch(e){if(e&&e.name==='NotAllowedError')throw e}}
 const a=accountGet()||{},mail=a.email||(db.prof&&db.prof.email)||'casô';
 const c=await navigator.credentials.create({publicKey:{rp:{id:location.hostname,name:'casô'},user:{id:new TextEncoder().encode(mail),name:mail,displayName:a.prenom||mail},challenge:ch,
  pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required',residentKey:'preferred'},attestation:'none',timeout:60000}});
 return{credential_id:sgB64(c.rawId),public_key:c.response.getPublicKey&&c.response.getPublicKey()?sgB64(c.response.getPublicKey()):null}}
let sgPushing=false;
async function sgPush(force){
 const r=sgReg(),c=getSync();if(!r||!r.faceid||!c.url||!c.token||sgPushing)return;
 const p=db.prof||{};if(!force&&r.srv&&(r.srvAt||0)>=(db.profAt||0))return;
 sgPushing=true;
 try{await apiTeam('/api/sig/register',{id:r.id,hash:r.hash,at:r.at,faceid:r.faceid,pk:r.pk||null,img:sgSigImg(),nom:(accountGet()||{}).prenom||c.user||'',
   entreprise:{nom:p.nom,forme:p.forme,siret:p.siret,adresse:p.adr,tel:p.tel,email:p.email||r.email,rm:p.rm,assur:p.assur,zone:p.zone}});
  const r2=sgReg();if(r2&&r2.id===r.id){r2.srv=1;r2.srvAt=Date.now();try{localStorage.setItem('caso_sig_reg',JSON.stringify(r2))}catch(e){}}}
 catch(e){}finally{sgPushing=false}}
function spState(){const e=!SPAD||SPAD.empty();$('spGo').disabled=e;$('spHint').hidden=!e}
function spRender(){
 const r=sgOk(),done=r&&!spRender.redo;
 $('spNew').hidden=!!done;$('spDone').hidden=!done;
 if(done){sgPush();$('spImg').src=sgSigImg();$('spQr').innerHTML=qrSvg(sgVerify()+r.id,4);$('spId').textContent=r.id;$('spAt').textContent=(r.email?r.email+' · ':'')+sgDate(r.at);return}
 setTimeout(()=>{const cv=$('spPad');if(!SPAD){SPAD=SigPad(cv);['pointerdown','pointerup','pointercancel','pointerleave'].forEach(t=>cv.addEventListener(t,()=>setTimeout(spState,0)))}
  SPAD.size();SPAD.clear();const old=sgSigImg();if(old&&!spRender.redo){SPAD.load(old);setTimeout(spState,150)}spState()},60)}
function spClear(){if(SPAD)SPAD.clear();spState()}
function spRedo(){spRender.redo=true;spRender()}
async function spSave(){
 if(!SPAD||SPAD.empty()){toast(i18nT('Signe ici avec le doigt'));return}
 const b=$('spGo');b.disabled=true;
 const png=SPAD.png(),at=new Date().toISOString(),a=accountGet()||{},mail=a.email||(db.prof&&db.prof.email)||'',r0=sgReg();
 const hash=sgHex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(mail+'|'+at+'|'+png)));
 let f;try{f=await sgFaceId(hash,r0&&r0.faceid)}
 catch(e){b.disabled=false;toast(i18nT(e&&e.message==='nofid'?'Active Face ID ou l’empreinte sur ce téléphone.':'Face ID non confirmé. Réessaie.'));return}
 try{localStorage.setItem('caso_sig',png);localStorage.setItem('caso_sig_reg',JSON.stringify({id:sgIdOf(hash),email:mail,at,hash,faceid:f.credential_id,pk:f.public_key||(r0&&r0.pk)||null}))}catch(e){}
 Store.mirror(null,Date.now());
 spRender.redo=false;toast(i18nT('Signature enregistrée.'));spRender()}
function spDelete(){try{localStorage.removeItem('caso_sig');localStorage.removeItem('caso_sig_reg')}catch(e){}spRender()}
function entSigRender(){const el=$('entSig');if(!el)return;const r=sgOk();
 const w=$('entSigW');if(w)w.hidden=!r;
 if(!r){el.innerHTML='';return}
 sgPush();
 el.innerHTML=`<div class="sg-ro" aria-readonly="true"><img src="${esc(sgSigImg())}" alt=""><div class="sg-qr">${qrSvg(sgVerify()+r.id,4)}</div><div class="sg-meta"><b data-noi18n>${esc(r.id)}</b><span data-noi18n>${esc(r.email||'')}${r.email?' · ':''}${sgDate(r.at)}<svg class="i sg-lk"><use href="#i-lock"/></svg></span></div></div>`}

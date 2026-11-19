/* casô · Interface : notifications, menus latéraux, choix du module, sous-écrans
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Notifications ---------- */
function notifOn(){try{return localStorage.getItem('caso_notif')==='1'&&window.Notification&&Notification.permission==='granted'}catch(e){return false}}
function renderNotif(){
 const c=getSync(),card=$('notifCard');if(!card)return;
 card.hidden=!(c.url&&c.token);
 $('notifSt').innerHTML=notifOn()?'<svg class="i i-sm ok-c"><use href="#i-check"/></svg> Notifications activées':'';$('notifBtn').hidden=notifOn()}
function askNotif(){
 if(notifOn()||!window.Notification||Notification.permission==='denied')return;
 let asked=null;try{asked=localStorage.getItem('caso_notif_asked')}catch(e){}
 if(asked)return;try{localStorage.setItem('caso_notif_asked','1')}catch(e){}
 if(confirm('Veux-tu être prévenu quand le client signe ?'))enableNotif()}
function b64ToU8(s){s=s.replace(/-/g,'+').replace(/_/g,'/');s+='='.repeat((4-s.length%4)%4);const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
async function enableNotif(){
 const c=getSync();
 if(!c.url||!c.token){alert('Connecte d\'abord casô au service en ligne (Compte › Équipe).');return false}
 if(!('Notification' in window)||!('serviceWorker' in navigator)||!('PushManager' in window)){alert('Sur iPhone, ajoute d\'abord casô à l\'écran d\'accueil (Partager › Sur l\'écran d\'accueil), puis réessaie.');return false}
 try{
  const perm=await Notification.requestPermission();
  if(perm!=='granted'){alert('Notifications refusées. Autorise-les dans les réglages du téléphone.');return false}
  const reg=await navigator.serviceWorker.register('sw.js');await navigator.serviceWorker.ready;
  const {key}=await apiTeam('/api/push/key');
  let sub=await reg.pushManager.getSubscription();
  if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64ToU8(key)});
  await apiTeam('/api/push/sub',{sub:sub.toJSON(),lang:I18N.lang,metier:(db.prof||{}).metier||''});
  try{localStorage.setItem('caso_notif','1')}catch(e){}
  toast(i18nT('Notifications activées'));renderNotif();return true
 }catch(e){alert('Erreur d\'envoi : '+(e.message||e));return false}}
/* newsletter : notifications pour tout usager (sans espace d'équipe), auprès du serveur casô ; le métier seulement */
const NEWS_SRV=()=>String(window.CASO_APPRIS||'https://app-e6c6e91c-8623-4524-95ef-2cefb8b67f7b.cleverapps.io').replace(/\/+$/,'');
async function newsNotif(){try{
 if(!('serviceWorker' in navigator)||!('PushManager' in window)||!window.Notification||Notification.permission!=='granted')return false;
 const reg=await navigator.serviceWorker.register('sw.js');await navigator.serviceWorker.ready;
 let sub=await reg.pushManager.getSubscription();
 if(!sub){const {key}=await fetch(NEWS_SRV()+'/api/push/cle').then(r=>r.json());sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64ToU8(key)})}
 const r=await fetch(NEWS_SRV()+'/api/push/news',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sub:sub.toJSON(),lang:I18N.lang,metier:(db.prof||{}).metier||''})});
 if(r.ok){try{localStorage.setItem('caso_news_push','1')}catch(e){}}return r.ok}catch(e){return false}}
/* au démarrage : un téléphone qui a déjà autorisé les notifications reste abonné à la newsletter (métier à jour) */
setTimeout(()=>{try{const a=accountGet();if(a&&a.notif!==false&&window.Notification&&Notification.permission==='granted'&&!localStorage.getItem('caso_test'))newsNotif()}catch(e){}},6000);
/* un devis vient d'être signé : prévenir (l'appli ouverte, ou en complément de la notification) */
function seenSigned(){try{return JSON.parse(localStorage.getItem('caso_seen_sig')||'[]')}catch(e){return[]}}
function checkSigned(){
 const seen=seenSigned();let ch=false;
 db.quotes.forEach(x=>{if(x.sign&&x.sign.st==='signed'&&x.sign.token&&!seen.includes(x.sign.token)){
  seen.push(x.sign.token);ch=true;
  const m=i18nT('{1} a signé le devis {2} !'.replace('{1}','\u0001').replace('{2}','\u0002')).replace('\u0001',x.sign.clientName||x.client||'').replace('\u0002',x.num||'');
  toast(m);
  if(document.hidden&&window.Notification&&Notification.permission==='granted'&&!notifOn()){try{new Notification('casô',{body:m,tag:'sign-'+x.sign.token})}catch(e){}}}});
 if(ch){try{localStorage.setItem('caso_seen_sig',JSON.stringify(seen.slice(-200)))}catch(e){}if($('s-histo').classList.contains('on'))renderHisto()}}
try{
 setInterval(()=>{if(!document.hidden)syncNow()},60000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncNow()});
 
 if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='signed')syncNow()});
}catch(e){}


/* ---------- Menus latéraux ---------- */
function dwLocked(){
 if(document.body.classList.contains('starting'))return true;
 const st=$('s-start');if(st&&st.classList.contains('on'))return true;
 try{if(localStorage.getItem('caso_locked')==='1')return true}catch(e){}
 return false}
/* module AUTH (lib/auth.js) : « Continuer avec Google / Outlook » sur les écrans Connexion et Créer mon compte ; l'offre en une ligne dans le menu profil */
/* plus d'offres toutes faites : l'usager construit son abonnement ; la ligne dit seulement où il en est */
/* logo de l'entreprise : en haut à gauche du menu profil (un appui ouvre Mon entreprise) et à la place de l'icône du profil.
   Sans logo : une icône discrète d'entreprise, qui mène à Mon entreprise pour l'ajouter. */
function logoProfil(){const l=(db.prof||{}).logo,ok=typeof rcImg==='function'?rcImg(l):/^data:image\//.test(l||''),e=$('dwEnt'),b=$('hdAcct');
 if(e){e.classList.toggle('logo',!!ok);e.innerHTML=ok?`<img src="${l}" alt="">`:'<svg class="i"><use href="#i-building"/></svg>'}
 if(b){b.classList.toggle('logo',!!ok);b.innerHTML=ok?`<img src="${l}" alt="">`:'<svg class="i"><use href="#i-user"/></svg>'}}
/* pastille discrète au-dessus du compte (profil) : où en est l'usager ; un appui ouvre « On construit le plan » */
function authLigne(){
 const A=window.CasoAuth,c=A&&A.compte(),go=$('dwPlanGo');if(!go)return;
 const n=($('dwName')||{}).textContent||'',ini=$('dwIni');if(ini)ini.textContent=(n.trim()[0]||'·').toUpperCase();
 /* pas de session casô : compte e-mail → « Relier mon compte » ; Google / Outlook expiré → « Se reconnecter » */
 if(!c){const a=accountGet();const r=!!(a&&a.email&&(a.hash||a.sso)&&window.CasoAuth);go.hidden=!r;go.dataset.k=r?(a.sso?'sso':'rel'):'';
  if(r){const lc=typeof aboCompte==='function'?aboCompte():null,j=lc&&lc.local?Math.ceil((lc.essaiFin-Date.now())/864e5):0;
   $('dwPlanA').textContent=j>0?i18nT('Essai'):i18nT(a.sso?'Se reconnecter':'Relier mon compte');$('dwPlanB').textContent=j>0?j+' '+i18nT('j'):''}return}
 go.dataset.k='plan';go.hidden=!(c.mode&&window.CasoPlan);if(go.hidden)return;
 const nb=((c.plan&&c.plan.modules)||[]).length,prix=c.plan&&c.plan.total?CasoPlan.euros(c.plan.total):'';
 let a,b='';
 if(c.offre==='artisan_curieux'&&c.essaiFin){a=i18nT('Essai');b=Math.max(1,Math.ceil((c.essaiFin-Date.now())/864e5))+' '+i18nT('j')}
 else if(c.offre==='bricoleur'){a=i18nT('Bricoleur')}
 else if(nb){a=nb+' '+i18nT(nb>1?'modules':'module');b=prix}
 else a=i18nT('On construit le plan');
 $('dwPlanA').textContent=a;$('dwPlanB').textContent=b}
function dwPlanTap(){const k=$('dwPlanGo').dataset.k;if(k==='rel')return aboRelier();if(k==='sso'){const a=accountGet();return authVia(a&&a.sso)}aboOpen()}
/* petit menu du compte (au-dessus de la ligne du bas) */
function dwPopToggle(){const p=$('dwPop');p.hidden?dwPopOpen():dwPopClose()}
function dwPopOpen(){const p=$('dwPop');p.hidden=false;aboMenuEtat();$('dwMe').setAttribute('aria-expanded','true');requestAnimationFrame(()=>p.classList.add('on'));
 setTimeout(()=>document.addEventListener('pointerdown',dwPopOut,true),0);document.addEventListener('keydown',dwPopEsc)}
function dwPopClose(){const p=$('dwPop');if(!p||p.hidden)return;p.classList.remove('on');$('dwMe').setAttribute('aria-expanded','false');
 document.removeEventListener('pointerdown',dwPopOut,true);document.removeEventListener('keydown',dwPopEsc);setTimeout(()=>{if(!p.classList.contains('on'))p.hidden=true},150)}
function dwPopOut(e){if(!e.target.closest('.dw-acc'))dwPopClose()}
function dwPopEsc(e){if(e.key==='Escape')dwPopClose()}
/* « On construit le plan » (lib/plan.js) : tuiles à cocher, total en direct ; le serveur recalcule et garde le choix */
const ABO={sel:new Set(),mode:'artisan',busy:false};
const ABO_IC={devis:'quote',planning:'cal',pointage:'helmet',paiement:'tag','3d':'blocks',renovation:'cam',fournisseurs:'truck',veille:'mail',verification:'shield',estimation:'calc'};
function aboOpen(mot){
 const A=window.CasoAuth,c=A&&A.compte();if(!c||!c.mode||!window.CasoPlan)return;
 const mt=$('abMot');if(mt){mt.textContent=mot||'';mt.hidden=!mot}
 ABO.mode=c.mode==='bricoleur'?'bricoleur':'artisan';
 ABO.sel=new Set(((c.plan&&c.plan.modules)||[]).filter(Boolean));
 drawerClose();aboDraw();
 $('abBg').hidden=false;$('abSh').hidden=false;requestAnimationFrame(()=>{$('abSh').classList.add('on');$('abBg').classList.add('on')})}
function aboClose(){$('abSh').classList.remove('on');$('abBg').classList.remove('on');setTimeout(()=>{$('abSh').hidden=true;$('abBg').hidden=true},200)}
function aboDraw(){
 const C=CasoPlan.catalogue(ABO.mode),calc=CasoPlan.calcul(ABO.mode,[...ABO.sel],!!(CasoAuth.compte()||{}).fondateur);
 const g=$('abGrid');g.textContent='';
 C.modules.forEach(m=>{const t=document.createElement('button'),on=ABO.sel.has(m.id);
  t.type='button';t.className='ab-t';t.setAttribute('role','checkbox');t.setAttribute('aria-checked',String(on));t.dataset.m=m.id;
  t.innerHTML='<svg class="i"><use href="#i-'+(ABO_IC[m.id]||'blocks')+'"/></svg><span class="ab-ck"><svg viewBox="0 0 12 12"><path d="M2.5 6.2 5 8.6l4.5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><b></b><em></em>';
  t.querySelector('b').textContent=i18nT(m.nom);t.querySelector('em').textContent=CasoPlan.euros(m.prix);
  t.onclick=()=>{on?ABO.sel.delete(m.id):ABO.sel.add(m.id);aboDraw();const n=$('abGrid').querySelector('[data-m="'+m.id+'"]');if(n)n.focus()};
  g.appendChild(t)});
 /* plafond : l'ancien total barré, le total plafonné à côté ; pas de texte en plus */
 const br=$('abBrut');br.hidden=!calc.plafonne;br.textContent=calc.plafonne?CasoPlan.euros(calc.brut):'';
 $('abTot').textContent=CasoPlan.euros(calc.total);
 $('abUnit').textContent=i18nT(C.unite)+' / '+i18nT('mois');
 $('abGo').disabled=ABO.busy}
async function aboSave(){
 if(ABO.busy)return;
 if(navigator.onLine===false){toast(i18nT('Pas de connexion.'));return}
 ABO.busy=true;$('abGo').disabled=true;
 try{await CasoAuth.plan([...ABO.sel]);authLigne();
  /* paiement branché sur le serveur : page de paiement Stripe la première fois, sinon changement au prorata */
  let st=null;try{st=CasoAuth.abo&&ABO.sel.size?await CasoAuth.abo():null}catch(e){}
  if(st&&st.paiement){const r=await CasoAuth.payer();if(r&&r.url){location.assign(r.url);return}}
  toast(i18nT('Plan enregistré.'));aboClose()}
 catch(e){toast(i18nT(e&&e.code===0?'Pas de connexion.':'Plan non enregistré.'))}
 ABO.busy=false;$('abGo').disabled=false}
/* abonnement payant : menu du compte, résiliation en trois appuis (menu, récapitulatif, confirmation), reprise, portail Stripe */
const RS={a:null,busy:false};
async function aboMenuEtat(){const ids=['dwAboPay','dwAboRes','dwAboRep'];ids.forEach(i=>{const e=$(i);if(e)e.hidden=true});
 let a=null;try{a=window.CasoAuth&&CasoAuth.jeton()&&navigator.onLine!==false?await CasoAuth.abo():null}catch(e){}
 RS.a=a;if(!a||!a.abonne)return;$('dwAboPay').hidden=false;$(a.annule?'dwAboRep':'dwAboRes').hidden=false}
const aboDate=t=>new Date(t).toLocaleDateString(I18N&&I18N.lang?I18N.lang:'fr-FR',{day:'numeric',month:'long',year:'numeric'});
function aboResOpen(){const a=RS.a;if(!a||!a.abonne)return;
 $('rsTxt').textContent=a.periodeFin?i18nT('Fin le')+' '+aboDate(a.periodeFin):'';
 $('rsTot').textContent=CasoPlan.euros(a.total);$('rsUnit').textContent=i18nT(a.unite||'HT')+' / '+i18nT('mois');
 $('rsGo').hidden=false;$('rsGo').disabled=false;drawerClose();
 $('rsBg').hidden=false;$('rsSh').hidden=false;requestAnimationFrame(()=>{$('rsSh').classList.add('on');$('rsBg').classList.add('on')})}
function aboResClose(){$('rsSh').classList.remove('on');$('rsBg').classList.remove('on');setTimeout(()=>{$('rsSh').hidden=true;$('rsBg').hidden=true},200)}
async function aboResGo(){if(RS.busy)return;if(navigator.onLine===false){toast(i18nT('Pas de connexion.'));return}
 RS.busy=true;$('rsGo').disabled=true;
 try{const a=await CasoAuth.resilier();RS.a=a;$('rsTxt').textContent=i18nT('Résiliation enregistrée.')+' '+(a.periodeFin?i18nT('Fin le')+' '+aboDate(a.periodeFin):'');$('rsGo').hidden=true}
 catch(e){toast(i18nT(e&&e.code===0?'Pas de connexion.':(e&&e.message)||'Erreur.'));$('rsGo').disabled=false}
 RS.busy=false}
async function aboReprendre(){try{RS.a=await CasoAuth.reprendre();toast(i18nT('Abonnement repris.'))}catch(e){toast(i18nT(e&&e.code===0?'Pas de connexion.':(e&&e.message)||'Erreur.'))}}
async function aboPortail(){try{const u=await CasoAuth.portail();if(u)location.assign(u)}catch(e){toast(i18nT(e&&e.code===0?'Pas de connexion.':(e&&e.message)||'Erreur.'))}}
/* retour de la page de paiement Stripe : #abo=ok */
if(/^#abo=/.test(location.hash)){const okp=location.hash==='#abo=ok';try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
 if(okp)setTimeout(()=>{try{toast(i18nT('Abonnement activé.'));CasoAuth.rafraichir()}catch(e){}},1500)}
function authVia(k){if(navigator.onLine===false){toast(i18nT('Pas de connexion.'));return}window.CasoAuth&&CasoAuth.connecter(k)}
window.CasoAuthProfil=()=>{const a=accountGet()||{};return{mode:a.mode==='bricoleur'?'bricoleur':'artisan',nom:db.prof.nom||'',siret:db.prof.siret||''}};
window.addEventListener('caso-auth',e=>{const d=e.detail||{};authLigne();if(d.erreur)toast(i18nT(d.erreur));if(d.retour&&d.compte&&!accountGet())ssoBegin(d.compte)});
/* retour de Google / Outlook sans compte sur ce téléphone : le compte est créé sans mot de passe, Face ID (ou l'empreinte) ouvre le coffre.
   Un seul appui, sur le bouton Face ID de l'écran Connexion. Téléphone sans Face ID : on retombe sur « Créer mon compte », e-mail déjà rempli. */
const SSO={c:null,busy:false};
async function ssoBegin(c){SSO.c=c;let bio=false;
 try{bio=!!(window.VAULT&&!VAULT.on&&!VAULT.has()&&await VAULT.bioOk())}catch(e){}
 if(!bio){ssoFallback();return}
 stScreen('s-start');stShow('lg');const b=$('lgBio');$('lgForm').classList.add('sso');
 b.lastChild.textContent=/iPhone|iPad|Macintosh/.test(navigator.userAgent)?'Face ID':i18nT('Empreinte');b.hidden=false;b.onclick=ssoGo}
function ssoEnd(){const b=$('lgBio');$('lgForm').classList.remove('sso');b.hidden=true;b.disabled=false;b.onclick=null}
function ssoFallback(){ssoEnd();stScreen('s-start');stShow('ac');$('acMail').value=(SSO.c&&SSO.c.email)||'';
 $('acErr').textContent=i18nT('{1} n’est pas disponible sur ce téléphone.').replace('{1}',bioNom());$('acErr').hidden=false}
async function ssoGo(){if(SSO.busy)return;SSO.busy=true;const c=SSO.c,b=$('lgBio');b.disabled=true;$('lgErr').hidden=true;
 const mail=String(c.email||'').toLowerCase();
 const acc={v:1,id:'u'+uid(),prenom:c.prenom||mail.split('@')[0]||'casô',email:mail,sso:c.via,iter:ACC_ITER(),createdAt:Date.now(),cgu:{v:'2026-11-19',at:Date.now(),via:'sso'}};
 try{if(!accountPut(acc))throw new Error('stockage');if(!(await VAULT.createBio(acc)))throw new Error('coffre')}
 catch(e){try{localStorage.removeItem(ACC_KEY)}catch(x){}SSO.busy=false;b.disabled=false;
  if(e&&e.name==='NotAllowedError'){$('lgErr').textContent=i18nT('Face ID non confirmé. Réessaie.');$('lgErr').hidden=false;return}/* annulé : on reste là */
  ssoFallback();return}
 db.me=Object.assign({},db.me||{},{prenom:acc.prenom});db.prof=Object.assign({},db.prof||{},{email:acc.email});db.profAt=Date.now();save();
 ssoEnd();fillProf();renderAcct();bkSet('devis_welcomed',1);
 try{ONB.code=await rcSet()}catch(e){ONB.code=null}
 SSO.busy=false;modeOpen(false)}
/* compte sans mot de passe : une action sensible se confirme avec Face ID */
const sansMdp=()=>!!(window.VAULT&&VAULT.on&&!VAULT.hasPw());
async function bioConf(){try{return await VAULT.bioCheck()}catch(e){toast(i18nT('Face ID non confirmé. Réessaie.'));return false}}
function drawer(side){
 if(dwLocked()){drawerClose(true);return}
 const d=$(side==='L'?'dwL':'dwR');if(!d)return;
 if(side==='R'){const a=accountGet()||{},c=getSync();$('dwName').textContent=a.prenom||c.user||'';$('dwMail').textContent=a.email||'';authLigne()}
 $('dwBg').hidden=false;d.hidden=false;requestAnimationFrame(()=>{$('dwBg').classList.add('on');d.classList.add('on')});
 document.body.classList.add('dw-open')}
function drawerClose(now){
 try{dwPopClose()}catch(e){}
 ['dwL','dwR'].forEach(id=>{const d=$(id);if(d)d.classList.remove('on')});const bg=$('dwBg');if(bg)bg.classList.remove('on');
 document.body.classList.remove('dw-open');
 const end=()=>{['dwL','dwR','dwBg'].forEach(id=>{const d=$(id);if(d)d.hidden=true})};if(now)end();else setTimeout(end,220)}
function drawerGo(t){
 drawerClose(true);
 if(t==='cv'){cvStart();return}
 if(t==='devis'){chatNew();go('devis');return}
 if(t.startsWith('cpt:')){cptPage(t.slice(4));return}
 go(t)}
let cptCur='ent';
function cptPage(pg){
 cptCur=pg;go('cpt');
 const T={ent:'Mon entreprise',team:'Mon équipe',bk:'Sauvegarde',app:'Langue et notifications'};$('cptT').textContent=T[pg]||'';
 document.querySelectorAll('#s-cpt [data-cp]').forEach(c=>{c.style.display=c.dataset.cp===pg?'':'none'});
 if(pg==='ent'||pg==='app'){renderNotif()}if(pg==='ent')entSigRender();if(pg==='team'&&typeof eqRender==='function'){eqRender();const c=getSync();$('eqEsp').open=!!(c.token&&c.role!=='patron')||!!(srvInfo&&srvInfo.needsSetup&&srvInfo.local)}}
async function logout(){
 drawerClose(true);
 if(!confirm('Se déconnecter ? Tes données restent sur ce téléphone.'))return;
 try{localStorage.setItem('caso_locked','1')}catch(e){}
 if(window.VAULT&&VAULT.on){VAULT.lockNow();return}
 showLogin()}
function stShow(w){if(w==='ac'&&accountGet()){$('lgForm').hidden=false;$('acForm').hidden=true;$('lgErr').textContent='Il y a déjà un compte sur ce téléphone. Connecte-toi, ou touche « Mot de passe oublié ? ».';$('lgErr').hidden=false;$('lgForgot').hidden=false;return}
 $('lgForm').hidden=w!=='lg';$('acForm').hidden=w!=='ac';$('fgForm').hidden=true;['lgErr','acErr'].forEach(k=>$(k).hidden=true);
 if(w==='lg'){const a=accountGet();$('lgForgot').hidden=!a;if(a&&!$('lgMail').value)$('lgMail').value=a.email||''}
 document.querySelectorAll('.st-sso').forEach(e=>e.hidden=!!accountGet());
 window.scrollTo(0,0)}
function pwEye(b,id){const i=$(id),on=i.type==='password';i.type=on?'text':'password';b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Masquer le mot de passe':'Afficher le mot de passe')}
function showLogin(){
 const a=accountGet();
 if(!a){startOpen&&startOpen();return}
 document.body.classList.add('starting');
 document.querySelectorAll('section').forEach(x=>x.classList.remove('on'));$('s-start').classList.add('on');
 $('lgMail').value=a.email||'';$('lgPass').value='';stShow('lg')}
/* trop d'essais de mot de passe ou de code : attente croissante (30 s, 1 min, 2 min… jusqu'à 15 min) */
function lkGet(){try{return JSON.parse(localStorage.getItem('caso_lk'))||{n:0,u:0}}catch(e){return{n:0,u:0}}}
function lkWait(){const k=lkGet(),w=Math.ceil((k.u-Date.now())/1000);return w>0?w:0}
function lkFail(){const k=lkGet();k.n++;if(k.n>=5)k.u=Date.now()+Math.min(900,30*2**(k.n-5))*1000;try{localStorage.setItem('caso_lk',JSON.stringify(k))}catch(e){}}
function lkOk(){try{localStorage.removeItem('caso_lk')}catch(e){}}
function lkMsg(w){return i18nT("Trop d'essais. Réessaie dans {1}.").replace('{1}',w>=60?Math.ceil(w/60)+' min':w+' s')}
async function accUpgrade(pass){const a=accountGet(),it=ACC_ITER();if(!a||!(a.iter<it))return;
 if(a.rhash&&!a.riter)a.riter=a.iter;const salt=crypto.getRandomValues(new Uint8Array(16));a.salt=hex(salt);a.iter=it;a.hash=await pwHash(pass,salt,it);accountPut(a)}
async function loginSubmit(){
 {const w=lkWait();if(w){$('lgErr').textContent=lkMsg(w);$('lgErr').hidden=false;return}}
 if(!accountGet()){$('lgErr').textContent='Aucun compte sur ce téléphone. Crée ton compte, ou utilise ton invitation.';$('lgErr').hidden=false;return}
 const ok=await accountCheck($('lgMail').value,$('lgPass').value);
 if(!ok){lkFail();const w=lkWait();$('lgErr').textContent=w?lkMsg(w):'E-mail ou mot de passe incorrect.';$('lgErr').hidden=false;return}
 lkOk();try{await accUpgrade($('lgPass').value)}catch(e){}
 casoMail(accountGet().email,$('lgPass').value);
 let neuf=false;try{if(window.VAULT&&!VAULT.on)neuf=await VAULT.create($('lgPass').value)}catch(e){}
 try{localStorage.removeItem('caso_locked')}catch(e){}
 $('lgPass').value='';modeEnter();
 {const a=accountGet();if(a&&(!a.rhash||neuf)){const c=await rcSet();if(c)setTimeout(()=>rcShow(c),300)}}}


/* ---------- Choix du module après la création du compte ----------
   a.mode : 'artisan' ou 'bricoleur' (gardé dans le compte du téléphone) */
const ONB={code:null,change:false};
function stScreen(id){document.body.classList.add('starting');drawerClose&&drawerClose(true);document.querySelectorAll('section').forEach(x=>x.classList.remove('on'));$(id).classList.add('on');window.scrollTo(0,0)}
function modeOpen(){ONB.change=false;['mdArt','mdBri'].forEach(k=>$(k).classList.remove('on'));$('mdSir').hidden=true;{const p=db.prof||{};$('mdSiret').value=p.siret||'';$('mdSiren').value=p.siren||(p.siret||'').slice(0,9)}$('mdErr').hidden=true;
 stScreen('s-mode')}
function sirenOk(n){n=String(n||'').replace(/\D/g,'');return /^\d{9}$/.test(n)&&(n==='356000000'||luhnOk(n))}
/* SIREN = 9 premiers chiffres du SIRET : on tient les deux champs d'accord */
function sirSync(e,o){const d=e.value.replace(/\D/g,''),t=$(o),td=t.value.replace(/\D/g,'');
 if(/Siret$/.test(e.id)){if(d.length>=9)t.value=d.slice(0,9)}
 else if(d.length===9&&td.slice(0,9)!==d)t.value=d+td.slice(9)}
function sirOk(n){n=String(n||'').replace(/\s/g,'');return /^\d{14}$/.test(n)&&(/^356000000/.test(n)||(luhnOk(n.slice(0,9))&&luhnOk(n)))}
async function mdSirOk(){const n=$('mdSiret').value.replace(/\D/g,''),sr=$('mdSiren').value.replace(/\D/g,''),e=$('mdErr'),b=$('mdSirGo'),bad=t=>{e.textContent=i18nT(t);e.hidden=false;$('mdSiret').setAttribute('aria-invalid','true');$('mdSiret').focus()};
 e.hidden=true;$('mdSiret').removeAttribute('aria-invalid');
 if(!sirOk(n)||(sr&&sr!==n.slice(0,9)))return bad('Ce numéro ne semble pas valide : vérifie-le.');
 b.disabled=true;let co=null,net=true;
 try{const ctl=window.AbortController?new AbortController():null,tm=setTimeout(()=>ctl&&ctl.abort(),7000);
  const q=await fetch('https://recherche-entreprises.api.gouv.fr/search?q='+n+'&page=1&per_page=1',ctl?{signal:ctl.signal}:{});clearTimeout(tm);
  if(!q.ok)throw 0;const x=((await q.json()).results||[])[0];if(x&&x.siren===n.slice(0,9))co=x}catch(x){net=false}
 b.disabled=false;
 if(net&&!co)return bad('Ce numéro ne semble pas valide : vérifie-le.');
 if(co&&co.etat_administratif==='C')return bad('Attention : cette entreprise est indiquée comme fermée. Vérifie le numéro.');
 const P=db.prof=Object.assign({},db.prof||{});P.siret=n;P.siren=n.slice(0,9);
 if(co){const et=(co.matching_etablissements||[]).find(m=>m.siret===n)||co.siege||{};
  if(!P.adr)P.adr=acCap(et.adresse||'');if(!P.forme)P.forme=acForme(co.nature_juridique);if(!P.tvai)P.tvai=(co.tva&&co.tva[0])||acTva(n.slice(0,9))}
 db.profAt=Date.now();save();try{fillProf()}catch(x){}
 modePick('artisan')}
function modePick(m){if(m==='artisan'&&!sirOk((db.prof||{}).siret)){$('mdArt').classList.add('on');$('mdSir').hidden=false;$('mdSiret').focus();return}
 const a=accountGet();if(a){a.mode=m;delete a.wait;accountPut(a)}
 if(ONB.code){$('rc2Code').textContent=ONB.code;stScreen('s-rc');return}
 modeEnter()}
function rc2Copy(){const c=$('rc2Code').textContent;
 (navigator.clipboard?navigator.clipboard.writeText(c):Promise.reject()).then(()=>{toast(i18nT('Code copié.'));$('rc2Copy').classList.add('done')},()=>{try{getSelection().selectAllChildren($('rc2Code'))}catch(e){}})}
function rc2Next(){ONB.code=null;$('rc2Code').textContent='';modeEnter()}
function modeEnter(){const a=accountGet();try{window.CasoAuth&&CasoAuth.profil()}catch(e){}
 if(a&&a.mode==='bricoleur'){stScreen('s-mode');m3dOpen(true);return}
 document.body.classList.remove('starting');go('devis')}

/* ---------- Sous-écrans ---------- */
let prCur='list',ptCur='go';
function segOn(id,p){document.querySelectorAll('#'+id+' [data-p]').forEach(b=>{const on=b.dataset.p===p;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)})}
function prPage(p){prCur=p;segOn('prSeg',p);document.querySelectorAll('#s-prix [data-pp]').forEach(e=>{e.style.display=e.dataset.pp===p?'':'none'})}
function ptPage(p,quiet){
 if(p==='j')p='h';if(p!=='h'&&p!=='set')p='go';
 ptCur=p;segOn('ptSeg',p);
 document.querySelectorAll('#ptBody>[data-pg]').forEach(e=>{e.hidden=e.dataset.pg!==p});
 if(!quiet)window.scrollTo(0,0)}

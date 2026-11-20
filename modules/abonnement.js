/* casô · Abonnement : chaque usager n'a que les modules qu'il a choisis
   (règles : lib/plan.js, droits() ; plan de travail : docs/plan-abonnement-modules.md)
   - pendant l'essai, sans compte casô sur le serveur, ou en mode Bricoleur : rien n'est verrouillé ;
   - après l'essai : les modules du plan + le socle gratuit (chat, clients, rendez-vous simples, 1 devis par mois) ;
   - un module non pris : ses écrans restent lisibles (lecture seule, avec un bandeau « Ajouter ») ; ses actions ouvrent « On construit le plan »,
     le module déjà coché, avec un petit mot selon le module ;
   - sans réseau : la dernière liste connue est gardée (on ne verrouille jamais tout parce que le téléphone est hors ligne).
   Chargé après les autres modules : il entoure les fonctions des modules payants d'un contrôle, sans les modifier. */

/* le compte qui compte pour les droits :
   - le compte casô du serveur quand il a choisi le mode Artisan (essai et plan tenus par le serveur) ;
   - sinon (pas encore relié au serveur, ou SIRET pas encore donné) : un essai de 30 jours tenu par le téléphone,
     qui démarre à la création du compte ; après, le socle gratuit seulement, jusqu'à l'abonnement.
   Les collaborateurs (équipe d'un patron) et le mode Bricoleur ne sont pas verrouillés. */
const ABO_ESSAI_J=30;
function aboCompte(){let c=null;try{c=window.CasoAuth?CasoAuth.compte():null}catch(e){}
 if(c&&c.mode)return c;
 const sy=typeof getSync==='function'?getSync():{};if(sy&&sy.token&&sy.role&&sy.role!=='patron')return null;
 const a=typeof accountGet==='function'?accountGet():null;if(!a||a.mode==='bricoleur')return c;
 if(!a.essaiLocal){a.essaiLocal=a.createdAt||Date.now();try{accountPut(a)}catch(e){}}
 const fin=a.essaiLocal+ABO_ESSAI_J*864e5,tous=window.CasoPlan?CasoPlan.catalogue('artisan').modules.map(m=>m.id):[];
 return{mode:'artisan',local:true,essaiFin:fin,offre:Date.now()<fin?'artisan_curieux':'artisan_fin_essai',modules:Date.now()<fin?tous:[]}}
function aboDroits(){return window.CasoPlan?CasoPlan.droits(aboCompte()):{tout:true,ouvert:()=>true,devisGratuits:Infinity}}
function aboOuvert(m){return aboDroits().ouvert(m)}
function aboNom(m){const x=window.CasoPlan&&CasoPlan.catalogue('artisan').modules.find(y=>y.id===m);return i18nT(x?x.nom:m)}

/* un module non pris : « On construit le plan » s'ouvre tout de suite, le module déjà coché, avec un petit mot selon le module.
   Rien à l'écran si l'action ne vient pas de l'usager (pointage automatique, reprise en arrière-plan). */
const ABO_STOP='abo-stop';
const ABO_MOTS={
 devis:"Un devis bien fait, c'est déjà un chantier à moitié signé.",
 planning:"Ton agenda mérite mieux qu'un bout de carton sur le tableau de bord.",
 pointage:"Fini les heures notées au crayon sur le coin du mur.",
 paiement:"L'argent qui rentre, ça se suit de près. On garde l'œil dessus ?",
 '3d':"Montrer le chantier avant de le faire, ça aide le client à dire oui.",
 renovation:"L'avant-après, les clients adorent. Toi aussi, tu verras.",
 fournisseurs:"Le bon prix est quelque part. On va le trouver pour toi."};
function aboVerrou(m,mot){
 if(aboOuvert(m))return false;
 const ua=navigator.userActivation;if(ua&&!ua.isActive)return true;
 aboAjouter(m,mot);return true}
/* « Ajouter » : « On construit le plan », le module déjà coché */
function aboAjouter(m,mot){if(typeof aboOpen!=='function')return;
 aboOpen(i18nT(mot||ABO_MOTS[m]||''));if(m&&ABO.sel&&!ABO.sel.has(m)){ABO.sel.add(m);aboDraw()}}

/* écrans rattachés à un module : lisibles sans le module (bandeau) */
const ABO_ECRANS={pt:'pointage',enc:'paiement',fou:'fournisseurs',fouf:'fournisseurs',four:'fournisseurs',imp:'fournisseurs',plan:'3d',fact:'devis'};
/* ouverts dans le socle gratuit : Mon planning (rendez-vous simples) et Mes services (le devis gratuit du mois s'en sert) */
function aboBandeau(n){
 document.querySelectorAll('.abo-ro').forEach(x=>x.remove());
 const m=ABO_ECRANS[n],s=$('s-'+n);if(!m||!s||aboOuvert(m))return;
 const d=document.createElement('div');d.className='abo-ro';d.setAttribute('role','note');
 d.innerHTML=`<svg class="i"><use href="#i-lock"/></svg><span>${esc(i18nT('Lecture seule : le module {0} n\'est pas dans ton abonnement.').replace('{0}',aboNom(m)))}</span><button type="button" class="btn sm" onclick="aboAjouter('${m}')">${esc(i18nT('Ajouter'))}</button>`;
 s.before(d)}/* à côté de l'écran, pas dedans : l'écran peut se redessiner */

/* menu et barre du bas : un petit cadenas à côté des modules non pris */
const ABO_MENU={enc:'paiement',fou:'fournisseurs',pt:'pointage'};
function aboMenu(){
 document.querySelectorAll('[onclick^="drawerGo(\'"],nav button[onclick^="tab(\'"]').forEach(b=>{
  const k=(/^(?:drawerGo|tab)\('([^']+)'/.exec(b.getAttribute('onclick'))||[])[1],m=ABO_MENU[k];if(!m)return;
  let l=b.querySelector('.abo-lk');const ferme=!aboOuvert(m);
  if(ferme&&!l){l=document.createElementNS('http://www.w3.org/2000/svg','svg');l.setAttribute('class','i abo-lk');l.setAttribute('aria-label',i18nT('Pas dans ton abonnement'));
   l.innerHTML='<use href="#i-lock"/>';const c=b.querySelector('.dw-c');c?b.insertBefore(l,c):b.appendChild(l)}
  else if(!ferme&&l)l.remove()})}

/* contrôles posés autour des fonctions des modules payants (les écrans et le chat appellent ces mêmes fonctions) */
function aboGarde(nom,m,strict){const f=window[nom];if(typeof f!=='function'||f.aboG)return;
 const g=function(){if(aboVerrou(m)){if(strict){const e=new Error(ABO_STOP);e.aboStop=true;throw e}return}return f.apply(this,arguments)};g.aboG=true;window[nom]=g}
[['faPayOpen','paiement'],['faPaySave','paiement'],['faPayAll','paiement'],['faAvoir','paiement'],['faRelance','paiement'],['faPayAdd','paiement',true],
 ['punch','pointage',true],['ptToujours','pointage'],['addCh','pointage'],['ptQuickCh','pointage'],['ptChCli','pointage'],['ptQuickP','pointage'],['addPerson','pointage'],['addForgot','pointage'],['manualPunch','pointage'],
 ['agIcs','planning'],
 ['fouEdit','fournisseurs'],['fouSave','fournisseurs'],['prxGo','fournisseurs'],['impPick','fournisseurs'],['achSave','fournisseurs'],
 ['plSheet','3d'],['faNew','devis']].forEach(x=>aboGarde(x[0],x[1],x[2]));
/* une action arrêtée parce que le module n'est pas pris n'est pas une erreur */
window.addEventListener('error',e=>{if(e.error&&e.error.aboStop)e.preventDefault()});
window.addEventListener('unhandledrejection',e=>{if(e.reason&&e.reason.aboStop)e.preventDefault()});

/* 3D (artisan) : avec le module 3D Construction ou Rénovation */
{const f=window.m3dOpen;if(typeof f==='function')window.m3dOpen=function(cli){
 if(!cli&&!aboOuvert('3d')&&!aboOuvert('renovation')){aboVerrou('3d');return}return f.apply(this,arguments)}}

/* devis : sans le module, 1 devis gratuit par mois (créé ce mois-ci) ; les autres restent lisibles */
const aboMois=x=>{const t=x.creeLe?new Date(x.creeLe):null;return t&&!isNaN(t)?ymdL(t).slice(0,7):String(x.date||'').slice(0,7)};
{const f=window.qGuard;if(typeof f==='function')window.qGuard=function(o){
 if(!f(o))return false;
 const d=aboDroits();if(d.ouvert('devis'))return true;
 const mois=ymdL().slice(0,7),pv=db.quotes.find(x=>x.id===o.id);
 if(pv){if(aboMois(pv)===mois)return true;
  aboVerrou('devis',"Ce devis est en lecture seule. Avec le module Devis, tu peux le reprendre quand tu veux.");
  if(pv!==o)Object.assign(o,JSON.parse(JSON.stringify(pv)));return false}
 const faits=db.quotes.filter(x=>aboMois(x)===mois).length;
 if(CasoPlan.devisRestants(d,faits)>0){o.creeLe=Date.now();return true}
 aboVerrou('devis',"Ton devis gratuit du mois est fait. Pour les suivants, on ajoute le module Devis ?");return false}}

/* navigation : bandeau de lecture seule */
{const f=window.tab;window.tab=function(n,b){f.apply(this,arguments);aboBandeau(n)}}

window.addEventListener('caso-auth',()=>{aboMenu();const s=document.querySelector('section.on');if(s)aboBandeau(s.id.slice(2))});
aboMenu();
/* compte e-mail pas encore relié au serveur casô (ouvert par Face ID, ou créé hors ligne) : le mot de passe est demandé
   une seule fois, au démarrage ; ensuite « Relier mon compte » reste dans le profil */
function aboRelier(){const a=accountGet();if(!a||!a.hash)return;$('relMail').value=a.email;$('relPw').value='';$('relErr').hidden=true;
 $('relBg').hidden=false;$('relSh').hidden=false;requestAnimationFrame(()=>{$('relSh').classList.add('on');$('relBg').classList.add('on')});setTimeout(()=>{try{$('relPw').focus()}catch(e){}},250)}
function aboRelierFermer(){const s=$('relSh'),b=$('relBg');if(!s||s.hidden)return;s.classList.remove('on');b.classList.remove('on');setTimeout(()=>{s.hidden=true;b.hidden=true},200)}
async function aboRelierGo(){const a=accountGet(),pw=$('relPw').value,btn=$('relGo'),err=t=>{$('relErr').textContent=i18nT(t);$('relErr').hidden=false};
 if(!a||!pw)return;if(navigator.onLine===false)return err('Pas de connexion.');
 btn.disabled=true;
 try{if(!(await accountCheck(a.email,pw))){err('Mot de passe incorrect.');return}
  await CasoAuth.mail(a.email,pw,a.prenom);aboRelierFermer();authLigne();toast(i18nT('Compte relié.'))}
 catch(e){err(e&&e.code===401?'Ce compte casô a un autre mot de passe : utilise celui de ton premier téléphone.':e&&e.code===0?'Pas de connexion.':'Ça n\'a pas marché. Réessaie dans un instant.')}
 finally{btn.disabled=false}}
setTimeout(()=>{try{const a=accountGet();if(!a||!a.hash||a.sso||window.__casoMdpVu||!window.CasoAuth||CasoAuth.connecte()||navigator.onLine===false)return;
 if(localStorage.getItem('caso_relie_vu'))return;localStorage.setItem('caso_relie_vu',String(Date.now()));
 if(!document.body.classList.contains('starting'))aboRelier()}catch(e){}},4000);
/* la pastille du profil : dessinée aussi au démarrage (la session casô a pu répondre avant que l'appli soit prête) */
try{authLigne()}catch(e){}
try{logoProfil()}catch(e){}
/* lib/auth.js peut arriver après les modules : la pastille est redessinée dès qu'il est prêt */
(function attente(n){if(window.CasoAuth){try{authLigne();aboMenu()}catch(e){}return}if(n<100)setTimeout(()=>attente(n+1),100)})(0);

/* casô · Abonnement : chaque usager n'a que les modules qu'il a choisis
   (règles : lib/plan.js, droits() ; plan de travail : docs/plan-abonnement-modules.md)
   - pendant l'essai, sans compte casô sur le serveur, ou en mode Bricoleur : rien n'est verrouillé ;
   - après l'essai : les modules du plan + le socle gratuit (chat, clients, rendez-vous simples, 1 devis par mois) ;
   - un module non pris : ses écrans restent lisibles (lecture seule, avec un bandeau « Ajouter ») ; ses actions ouvrent « On construit le plan »,
     le module déjà coché, avec un petit mot selon le module ;
   - sans réseau : la dernière liste connue est gardée (on ne verrouille jamais tout parce que le téléphone est hors ligne).
   Chargé après les autres modules : il entoure les fonctions des modules payants d'un contrôle, sans les modifier. */

function aboCompte(){try{return window.CasoAuth?CasoAuth.compte():null}catch(e){return null}}
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
 fournisseurs:"Le bon prix est quelque part. On va le trouver pour toi.",
 veille:"Les règles changent sans prévenir. Nous, on te prévient."};
function aboVerrou(m,mot){
 if(aboOuvert(m))return false;
 const ua=navigator.userActivation;if(ua&&!ua.isActive)return true;
 aboAjouter(m,mot);return true}
/* « Ajouter » : « On construit le plan », le module déjà coché */
function aboAjouter(m,mot){if(typeof aboOpen!=='function')return;
 aboOpen(i18nT(mot||ABO_MOTS[m]||''));if(m&&ABO.sel&&!ABO.sel.has(m)){ABO.sel.add(m);aboDraw()}}

/* écrans rattachés à un module : lisibles sans le module (bandeau), sauf la newsletter, qui n'a rien de l'usager à montrer */
const ABO_ECRANS={pt:'pointage',enc:'paiement',fou:'fournisseurs',fouf:'fournisseurs',four:'fournisseurs',imp:'fournisseurs',news:'veille',plan:'3d',fact:'devis'};
/* ouverts dans le socle gratuit : Mon planning (rendez-vous simples) et Mes services (le devis gratuit du mois s'en sert) */
function aboBandeau(n){
 document.querySelectorAll('.abo-ro').forEach(x=>x.remove());
 const m=ABO_ECRANS[n],s=$('s-'+n);if(!m||!s||aboOuvert(m))return;
 const d=document.createElement('div');d.className='abo-ro';d.setAttribute('role','note');
 d.innerHTML=`<svg class="i"><use href="#i-lock"/></svg><span>${esc(i18nT('Lecture seule : le module {0} n\'est pas dans ton abonnement.').replace('{0}',aboNom(m)))}</span><button type="button" class="btn sm" onclick="aboAjouter('${m}')">${esc(i18nT('Ajouter'))}</button>`;
 s.before(d)}/* à côté de l'écran, pas dedans : l'écran peut se redessiner */

/* menu et barre du bas : un petit cadenas à côté des modules non pris */
const ABO_MENU={enc:'paiement',fou:'fournisseurs',news:'veille',pt:'pointage'};
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
 ['punch','pointage',true],['ptToujours','pointage'],
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

/* navigation : bandeau de lecture seule ; la newsletter demande le module */
{const f=window.tab;window.tab=function(n,b){if(n==='news'&&aboVerrou('veille'))return;f.apply(this,arguments);aboBandeau(n)}}

window.addEventListener('caso-auth',()=>{aboMenu();const s=document.querySelector('section.on');if(s)aboBandeau(s.id.slice(2))});
aboMenu();
/* la pastille du profil : dessinée aussi au démarrage (la session casô a pu répondre avant que l'appli soit prête) */
try{authLigne()}catch(e){}

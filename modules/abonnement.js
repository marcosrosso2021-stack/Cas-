/* casô · Abonnement : chaque usager n'a que les modules qu'il a choisis
   (règles : lib/plan.js, droits() ; plan de travail : docs/plan-abonnement-modules.md)
   - pendant l'essai, sans compte casô sur le serveur, ou en mode Bricoleur : rien n'est verrouillé ;
   - après l'essai : les modules du plan + le socle gratuit (chat, clients, rendez-vous simples, 1 devis par mois) ;
   - un module non pris : ses écrans restent lisibles (lecture seule, avec un bandeau « Ajouter »), ses actions demandent de l'ajouter ;
   - sans réseau : la dernière liste connue est gardée (on ne verrouille jamais tout parce que le téléphone est hors ligne).
   Chargé après les autres modules : il entoure les fonctions des modules payants d'un contrôle, sans les modifier. */

function aboCompte(){try{return window.CasoAuth?CasoAuth.compte():null}catch(e){return null}}
function aboDroits(){return window.CasoPlan?CasoPlan.droits(aboCompte()):{tout:true,ouvert:()=>true,devisGratuits:Infinity}}
function aboOuvert(m){return aboDroits().ouvert(m)}
function aboNom(m){const x=window.CasoPlan&&CasoPlan.catalogue('artisan').modules.find(y=>y.id===m);return i18nT(x?x.nom:m)}

/* un module non pris : dans le chat, une réponse avec « Ajouter » ; ailleurs, une fiche. Rien à l'écran si l'action ne vient pas de l'usager. */
const ABO_STOP='abo-stop';
function aboVerrou(m,pourquoi){
 if(aboOuvert(m))return false;
 const ua=navigator.userActivation;if(ua&&!ua.isActive)return true;
 const t=pourquoi||i18nT('Le module {0} n\'est pas dans ton abonnement.').replace('{0}',aboNom(m));
 if($('s-chat')&&$('s-chat').classList.contains('on')&&typeof chatPush==='function'){
  chatPush({who:'bot',html:`<p><svg class="i i-sm"><use href="#i-lock"/></svg> <span>${esc(t)}</span></p><div class="msg-act"><button class="btn sm" onclick="aboAjouter('${m}')"><svg class="i"><use href="#i-plus"/></svg>${esc(i18nT('Ajouter à mon abonnement'))}</button></div>`});return true}
 $('alkT').textContent=t;$('alkGo').onclick=()=>{aboVerrouFermer();aboAjouter(m)};
 $('alkBg').hidden=false;$('alkSh').hidden=false;requestAnimationFrame(()=>{$('alkSh').classList.add('on');$('alkBg').classList.add('on')});
 return true}
function aboVerrouFermer(){const s=$('alkSh'),b=$('alkBg');if(!s)return;s.classList.remove('on');b.classList.remove('on');setTimeout(()=>{s.hidden=true;b.hidden=true},200)}
/* « Ajouter à mon abonnement » : « On construit le plan », le module déjà coché */
function aboAjouter(m){if(typeof aboOpen!=='function')return;aboOpen();if(m&&ABO.sel&&!ABO.sel.has(m)){ABO.sel.add(m);aboDraw()}}

/* écrans rattachés à un module : lisibles sans le module (bandeau), sauf la newsletter, qui n'a rien de l'usager à montrer */
const ABO_ECRANS={agenda:'planning',pt:'pointage',enc:'paiement',fou:'fournisseurs',fouf:'fournisseurs',four:'fournisseurs',imp:'fournisseurs',news:'veille',plan:'3d',fact:'devis',prix:'devis'};
function aboBandeau(n){
 document.querySelectorAll('.abo-ro').forEach(x=>x.remove());
 const m=ABO_ECRANS[n],s=$('s-'+n);if(!m||!s||aboOuvert(m))return;
 const d=document.createElement('div');d.className='abo-ro';d.setAttribute('role','note');
 d.innerHTML=`<svg class="i"><use href="#i-lock"/></svg><span>${esc(i18nT('Lecture seule : le module {0} n\'est pas dans ton abonnement.').replace('{0}',aboNom(m)))}</span><button type="button" class="btn sm" onclick="aboAjouter('${m}')">${esc(i18nT('Ajouter'))}</button>`;
 s.before(d)}/* à côté de l'écran, pas dedans : l'écran peut se redessiner */

/* menu et barre du bas : un petit cadenas à côté des modules non pris */
const ABO_MENU={agenda:'planning',enc:'paiement',fou:'fournisseurs',news:'veille'};
function aboMenu(){
 document.querySelectorAll('[onclick^="drawerGo(\'"],nav button[onclick^="tab(\'"]').forEach(b=>{
  const k=(/^(?:drawerGo|tab)\('([^']+)'/.exec(b.getAttribute('onclick'))||[])[1],m=ABO_MENU[k]||(k==='pt'?'pointage':'');if(!m)return;
  let l=b.querySelector('.abo-lk');const ferme=!aboOuvert(m);
  if(ferme&&!l){l=document.createElementNS('http://www.w3.org/2000/svg','svg');l.setAttribute('class','i abo-lk');l.setAttribute('aria-label',i18nT('Pas dans ton abonnement'));
   l.innerHTML='<use href="#i-lock"/>';const c=b.querySelector('.dw-c');c?b.insertBefore(l,c):b.appendChild(l)}
  else if(!ferme&&l)l.remove()})}

/* contrôles posés autour des fonctions des modules payants (les écrans et le chat appellent ces mêmes fonctions) */
function aboGarde(nom,m,strict){const f=window[nom];if(typeof f!=='function'||f.aboG)return;
 const g=function(){if(aboVerrou(m)){if(strict){const e=new Error(ABO_STOP);e.aboStop=true;throw e}return}return f.apply(this,arguments)};g.aboG=true;window[nom]=g}
[['faPayOpen','paiement'],['faPaySave','paiement'],['faPayAll','paiement'],['faAvoir','paiement'],['faRelance','paiement'],['faPayAdd','paiement',true],
 ['punch','pointage',true],
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
  aboVerrou('devis',i18nT('Ce devis est en lecture seule : le module {0} n\'est pas dans ton abonnement.').replace('{0}',aboNom('devis')));
  if(pv!==o)Object.assign(o,JSON.parse(JSON.stringify(pv)));return false}
 const faits=db.quotes.filter(x=>aboMois(x)===mois).length;
 if(CasoPlan.devisRestants(d,faits)>0){o.creeLe=Date.now();return true}
 aboVerrou('devis',i18nT('Ton devis gratuit du mois est déjà fait. Ajoute le module {0} pour en faire d\'autres.').replace('{0}',aboNom('devis')));return false}}

/* navigation : bandeau de lecture seule ; la newsletter demande le module */
{const f=window.tab;window.tab=function(n,b){if(n==='news'&&aboVerrou('veille'))return;f.apply(this,arguments);aboBandeau(n)}}

window.addEventListener('caso-auth',()=>{aboMenu();const s=document.querySelector('section.on');if(s)aboBandeau(s.id.slice(2))});
aboMenu();

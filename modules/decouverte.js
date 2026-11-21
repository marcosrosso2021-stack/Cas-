/* casô · Mode découverte : essayer casô sans compte.
   - à l'ouverture, sans compte sur ce téléphone (et sans équipe) : l'Accueil, directement ;
   - rien n'est enregistré sur le téléphone tant que le compte n'est pas créé (tout reste en mémoire, et part à la fermeture) ;
   - limites : 2 clients, 2 rendez-vous, 1 devis (pas d'envoi), 2 fournisseurs, 2 chantiers, 1 plan ; Mes services libres ;
     encaissements, factures, équipe, signature : avec un compte ;
   - menu profil : l'icône sans identité, « Créer ton compte » à la place de la pastille d'essai, « Se connecter » ;
   - dans le chat, après quelques messages, une petite ligne propose de créer le compte (deux fois au plus) ;
   - à la création du compte, ce qui a été fait pendant la découverte est enregistré, puis le coffre le protège.
   Ancien démarrage (écran Connexion d'abord) : DEC_ACCUEIL='compte' (ou localStorage caso_accueil=compte). Chargé en dernier. */
const DEC_ACCUEIL=(()=>{try{return localStorage.getItem('caso_accueil')||'decouverte'}catch(e){return 'decouverte'}})();
const DEC={on:false,msgs:0,vus:0,ferme:0,prx:0,
 lim:{clients:2,events:2,quotes:1,suppliers:2,chantiers:2,plans:1,projects:1,invoices:0}};
/* ce qui n'est pas écrit sur le téléphone sans compte : les données, le chat et ce qu'il apprend, la signature, les recherches.
   Le compte lui-même (caso_account, coffre, session) s'écrit normalement : c'est lui qui met fin à la découverte. */
const DEC_RIEN=/^(devisbtp|caso_ts$|caso_chat|caso_journal|caso_ia$|caso_lex|caso_chan|caso_prx_rec|caso_sig|caso_camh|caso_tourcal)/;
const decSans=()=>{try{return !accountGet()&&!(typeof getSync==='function'&&(getSync()||{}).token)}catch(e){return false}};
let decSet=null;

function decStart(){
 if(DEC.on)return;DEC.on=true;document.body.classList.add('decouverte');
 /* aucune écriture des données sur le téléphone */
 decSet=Storage.prototype.setItem;
 Storage.prototype.setItem=function(k,v){if(this===window.localStorage&&DEC.on&&DEC_RIEN.test(String(k))&&decSans())return;return decSet.call(this,k,v)};
 decGarder();
 document.body.classList.remove('starting');
 try{go('home')}catch(e){}
 decMenu()}

/* fin de la découverte : le compte vient d'être créé (ou une équipe rejointe) ; on enregistre ce qui a été fait */
function decFin(){
 if(!DEC.on)return;DEC.on=false;document.body.classList.remove('decouverte');
 /* le filtre d'écriture reste en place mais ne fait plus rien (le coffre a pu s'y brancher par-dessus) */
 Object.keys(DEC.lim).forEach(k=>{const a=db[k];if(Array.isArray(a)&&Object.prototype.hasOwnProperty.call(a,'push'))delete a.push});
 document.querySelectorAll('.dec-chat').forEach(x=>x.remove());
 try{chatSave()}catch(e){}
 try{authLigne()}catch(e){}}

/* limites : posées sur les listes elles-mêmes, pour tous les chemins (écrans, chat, import) */
function decGarder(){
 if(!DEC.on)return;
 Object.keys(DEC.lim).forEach(k=>{if(!Array.isArray(db[k]))db[k]=[];const a=db[k];if(Object.prototype.hasOwnProperty.call(a,'push'))return;
  Object.defineProperty(a,'push',{configurable:true,writable:true,enumerable:false,value:function(){
   if(DEC.on&&this.length+arguments.length>DEC.lim[k]){decCompte();return this.length}
   return Array.prototype.push.apply(this,arguments)}})})}

/* fonctions qui demandent un compte : envoi du devis, facture, encaissements, équipe, signature */
const decVrai={save:window.save};
window.save=function(){if(DEC.on&&!decSans())decFin();if(DEC.on){decGarder();return true}return decVrai.save.apply(this,arguments)};
/* prix en ligne : une recherche pour découvrir */
['prxGo','prxMag'].forEach(n=>{const f=window[n];if(typeof f!=='function')return;
 window[n]=function(){if(DEC.on){const q=($('fouQ')||{}).value||'';if(q.trim().length>=2){if(DEC.prx>=1){decCompte();return}DEC.prx++}}return f.apply(this,arguments)}});
['goSign','envDevis','faNew','faPayOpen','eqOpen','eqSave','eqInviter','eqLien','addPerson','sgOpenPad'].forEach(n=>{const f=window[n];if(typeof f!=='function')return;
 window[n]=function(){if(DEC.on){decCompte();return}return f.apply(this,arguments)}});
{const g=window.go;window.go=function(n){if(DEC.on&&['enc','sigp','fact'].includes(n)){decCompte();return}return g.apply(this,arguments)}}
{const d=window.drawerGo;window.drawerGo=function(t){if(DEC.on&&['cpt:team','cpt:acc','cpt:bk','sigp','enc'].includes(t)){drawerClose(true);decCompte();return}return d.apply(this,arguments)}}
{const c=window.chatSave;window.chatSave=function(){if(DEC.on)return;return c.apply(this,arguments)}}

/* la fenêtre qui propose le compte : une ligne, un bouton */
function decCompte(){
 const s=$('decSh');if(!s){decCreer();return}
 $('decBg').hidden=false;s.hidden=false;requestAnimationFrame(()=>{s.classList.add('on');$('decBg').classList.add('on')})}
function decFerme(){const s=$('decSh');if(!s)return;s.classList.remove('on');$('decBg').classList.remove('on');setTimeout(()=>{s.hidden=true;$('decBg').hidden=true},200)}
/* aller créer le compte ou se connecter ; « Retour » ramène au chat sans rien perdre */
function decCreer(){decFerme();drawerClose&&drawerClose(true);stScreen('s-start');stShow('ac')}
function decConnexion(){decFerme();drawerClose&&drawerClose(true);stScreen('s-start');stShow('lg')}
function decRetour(){document.body.classList.remove('starting');go('home')}

/* menu profil : icône sans identité, « Créer ton compte », « Se connecter » */
function decMenu(){const ini=$('dwIni');if(ini&&DEC.on)ini.innerHTML='<svg class="i"><use href="#i-user"/></svg>'}

/* chat : après le 3e puis le 8e message, une petite ligne sous la conversation */
function decChat(){
 if(!DEC.on||DEC.vus>=2||DEC.ferme>=2)return;DEC.vus++;
 document.querySelectorAll('.dec-chat').forEach(x=>x.remove());
 const box=$('composer');if(!box)return;
 const p=document.createElement('p');p.className='dec-chat';
 p.innerHTML='<button type="button" class="lnk" onclick="decCreer()"></button><button type="button" class="dec-x" aria-label="'+esc(i18nT('Fermer'))+'"><svg class="i"><use href="#i-x"/></svg></button>';
 p.firstChild.textContent=i18nT('Crée ton compte pour garder ton travail.');
 p.lastChild.onclick=()=>{DEC.ferme++;p.remove()};
 box.insertBefore(p,box.firstChild)}
(function brancher(n){const cs=window.chatSend;if(typeof cs!=='function'){if(n<100)setTimeout(()=>brancher(n+1),100);return}
 if(cs.dec)return;const w=function(){const r=cs.apply(this,arguments);if(DEC.on){DEC.msgs++;if(DEC.msgs===3||DEC.msgs===8)setTimeout(decChat,600)}return r};
 Object.assign(w,cs);w.dec=1;window.chatSend=w})(0);

/* démarrage : le téléphone sans compte et sans équipe attend ce fichier (synchro.js, DEC_ATTENTE) */
if(window.DEC_ATTENTE&&decSans()&&DEC_ACCUEIL!=='compte')decStart();
else if(window.DEC_ATTENTE&&decSans())startOpen();
window.addEventListener('caso-auth',()=>{if(DEC.on&&!decSans())decFin()});

/* newsletter du visiteur : pas encore d'entreprise, donc les sources officielles pour en créer une dans le bâtiment */
const DEC_SOURCES=[
 ['Les conditions pour exercer','Qualification pour chaque métier, immatriculation, assurance décennale avant les travaux.','https://entreprendre.service-public.gouv.fr/vosdroits/F39041','service-public.gouv.fr'],
 ['Créer une micro-entreprise','Les démarches en ligne pour te lancer en micro-entrepreneur.','https://entreprendre.service-public.gouv.fr/vosdroits/F36746','service-public.gouv.fr'],
 ['Créer une entreprise individuelle','Les démarches pour immatriculer ton entreprise individuelle.','https://entreprendre.service-public.gouv.fr/vosdroits/F36763','service-public.gouv.fr'],
 ['Le guichet unique des formalités','Le site officiel où se déclare la création de toute entreprise.','https://www.inpi.fr/formalites-entreprises/guichet-unique','inpi.fr'],
 ['Les règles du métier','Qualifications, assurances, sécurité, déchets : la fiche de l\'artisan du bâtiment.','https://bpifrance-creation.fr/activites-reglementees/artisan-du-batiment','bpifrance-creation.fr'],
 ['Se faire accompagner','Conseils, guide, formation de chef d\'entreprise et réseau près de chez toi.','https://www.capeb.fr/nos-services/je-cree-mon-entreprise','capeb.fr']];
function decNews(){const z=$('newsList');if(!z)return;
 z.innerHTML='<div class="nv-top"><span class="nv-chip">'+esc(i18nT('Créer son entreprise dans le BTP'))+'</span></div>'+
  DEC_SOURCES.map(x=>'<a class="dec-src" href="'+x[2]+'" target="_blank" rel="noopener"><b>'+esc(i18nT(x[0]))+'</b><span>'+esc(i18nT(x[1]))+'</span><small data-noi18n>'+x[3]+'</small></a>').join('')}
/* la page est dessinée par modules/newsletter.js (après chargement) : on la remplace dès qu'elle change */
{const z=$('newsList');if(z&&window.MutationObserver)new MutationObserver(()=>{if(DEC.on&&!z.querySelector('.dec-src'))decNews()}).observe(z,{childList:true})}

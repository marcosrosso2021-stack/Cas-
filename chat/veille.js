/* casô : la newsletter réglementaire dans le chat
   - l'appli lit les textes que le propriétaire de casô a validés et choisi d'envoyer (GET /api/veille/lettre) ; rien n'est envoyé par le téléphone
   - « Ça me concerne ? » ouvre trois lignes : Pour qui, Quand, À faire. « Pour qui » est calculé ici, depuis « Mon entreprise »
   - une carte reste en haut du chat tant qu'elle n'a pas été ouverte ; elle revient quand l'échéance approche (90, 30 puis 7 jours)
   - le texte des cartes reste en français, comme les textes officiels */
(function(racine){
'use strict';
var BASE=(racine.CASO_APPRIS||'https://api.caso.fr'),K='caso_veille',PERIODE=6*36e5;
/* les métiers de « Mon entreprise » : les mêmes mots que l'analyse du serveur */
var METIERS=['électriciens','plombiers-chauffagistes','maçons','couvreurs','menuisiers','peintres','diagnostiqueurs'];
var MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function jour(d){return (d||new Date()).toISOString().slice(0,10)}
function delai(date,auj){return Math.round((Date.parse(date+'T00:00:00Z')-Date.parse(auj+'T00:00:00Z'))/864e5)}
function dateFr(d){var j=+d.slice(8,10);return (j===1?'1er':j)+' '+MOIS[+d.slice(5,7)-1]+' '+d.slice(0,4)}

/* Pour qui : oui, non ou peut-être, d'après ce que « Mon entreprise » sait. Ce qu'on ne sait pas ne se devine pas. */
function concerne(prof,item){
 prof=prof||{};var pros=(item.pros||[]).filter(Boolean),micro=/micro/i.test(prof.forme||'')||prof.franchise===true,formeConnue=!!prof.forme;
 if(!pros.length||pros.indexOf('artisans du bâtiment')>=0)return {etat:'oui',texte:'Oui, toi'};
 var oui=false,inconnu=[],metier=prof.metier||'';
 pros.forEach(function(p){
  if(p==='micro-entrepreneurs'){if(micro)oui=true;else if(!formeConnue)inconnu.push(p)}
  else if(METIERS.indexOf(p)>=0){if(metier===p)oui=true;else if(!metier||metier==='plusieurs')inconnu.push(p)}   // un autre métier choisi : ce n'est pas lui
  else inconnu.push(p)});
 if(oui)return {etat:'oui',texte:'Oui, toi : '+pros.join(', ')};
 if(!inconnu.length)return {etat:'non',texte:'Non, pas toi'};
 return {etat:'peut',texte:'Si tu fais partie des '+inconnu.join(', ')};
}
function quand(item,auj){
 if(item.categorie==='proposition')return 'Pas encore voté : rien ne change pour l\'instant';
 if(!item.dateVigueur)return '';
 var d=delai(item.dateVigueur,auj);
 return d>1?dateFr(item.dateVigueur)+', dans '+d+' jours':d===1?dateFr(item.dateVigueur)+', demain':d===0?'Aujourd\'hui':'Depuis le '+dateFr(item.dateVigueur);
}
/* où en est l'échéance : 0 loin ou sans date, 1 à 90 jours, 2 à 30 jours, 3 à 7 jours, 4 en vigueur */
function palier(item,auj){if(!item.dateVigueur||item.categorie==='proposition')return 0;var d=delai(item.dateVigueur,auj);return d<=0?4:d<=7?3:d<=30?2:d<=90?1:0}
/* les cartes à montrer : jamais vues, ou vues avant un palier franchi depuis (rappel d'échéance) ; pas celles qui ne concernent pas l'artisan */
function aMontrer(items,vus,prof,auj){
 return (items||[]).filter(function(it){
  if(!it||!it.id||!it.titre||concerne(prof,it).etat==='non')return false;
  var v=vus&&Object.prototype.hasOwnProperty.call(vus,it.id)?vus[it.id]:null;
  if(v==null)return true;var p=palier(it,auj);return p>v&&p<4;
 }).slice(0,5);
}
/* « rappel » : la carte a déjà été lue et revient parce que l'échéance approche */
function carte(it,ouvert,prof,auj,t,rappel){
 t=t||function(x){return x};var c=concerne(prof,it),q=quand(it,auj);
 var h='<div class="msg bot" data-veille-carte="'+esc(it.id)+'"><p style="font-size:.8em;opacity:.7;margin:0 0 4px">'+esc(t(rappel?'Une échéance approche':'Du nouveau pour ton métier'))+'</p>'
  +'<p data-noi18n lang="fr" style="font-weight:700;margin:0 0 10px">'+esc(it.titre)+'</p>';
 if(!ouvert)return h+'<button type="button" data-veille="'+esc(it.id)+'" style="background:var(--acc,#ffc21a);color:#18181a;border:0;border-radius:999px;padding:8px 14px;font:inherit;font-weight:700;cursor:pointer">'+esc(t('Ça me concerne ?'))+'</button></div>';
 var l=function(k,v){return v?'<div style="display:flex;gap:10px;margin:4px 0"><span style="flex:0 0 5em;opacity:.7">'+esc(t(k))+'</span><span data-noi18n lang="fr" style="min-width:0">'+esc(v)+'</span></div>':''};
 h+=l('Pour qui',c.texte)+l('Quand',q)+l('À faire',it.aFaire);
 if(/^https:\/\//.test(it.url||''))h+='<p style="margin:10px 0 0"><a href="'+esc(it.url)+'" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;text-underline-offset:3px">'+esc(t('Texte officiel'))+'</a></p>';
 return h+'</div>';
}

var api={concerne:concerne,quand:quand,palier:palier,aMontrer:aMontrer,carte:carte,dateFr:dateFr};
if(typeof module!=='undefined'&&module.exports){module.exports=api;return}

/* ---- dans l'appli ---- */
var doc=racine.document,ouverts={},session={},revenu={};
function lit(){try{var s=JSON.parse(racine.localStorage.getItem(K)||'null');if(s&&typeof s==='object')return s}catch(e){}return {}}
function ecrit(s){try{racine.localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
function artisan(){try{var a=racine.accountGet&&racine.accountGet();return !a||a.mode!=='bricoleur'}catch(e){return true}}
function prof(){try{return (typeof db!=='undefined'&&db&&db.prof)||{}}catch(e){return {}}}   // « db » est une variable de l'appli, pas une propriété de window
function tr(x){try{return racine.i18nT?racine.i18nT(x):x}catch(e){return x}}
function dessiner(){
 var log=doc.getElementById('chatLog');if(!log||!artisan())return;
 Array.prototype.forEach.call(log.querySelectorAll('[data-veille-carte]'),function(e){e.remove()});
 var s=lit(),auj=jour(),L=aMontrer(s.items,s.vus||{},prof(),auj).concat((s.items||[]).filter(function(it){return session[it.id]}));
 var vu={},h='';L.forEach(function(it){if(vu[it.id])return;vu[it.id]=1;
  if(!Object.prototype.hasOwnProperty.call(revenu,it.id))revenu[it.id]=!!(s.vus&&Object.prototype.hasOwnProperty.call(s.vus,it.id));   // lue avant cette ouverture de l'appli : c'est un rappel
  h+=carte(it,!!ouverts[it.id],prof(),auj,tr,revenu[it.id])});
 if(h)log.insertAdjacentHTML('afterbegin',h);
}
function ouvrir(id){
 var s=lit(),it=(s.items||[]).filter(function(x){return x.id===id})[0];if(!it)return;
 ouverts[id]=true;session[id]=true;s.vus=s.vus||{};s.vus[id]=palier(it,jour());ecrit(s);dessiner();
}
function charger(){
 var s=lit();if(!artisan()||(racine.navigator&&racine.navigator.onLine===false)||(s.at&&Date.now()-s.at<PERIODE))return;
 racine.fetch(BASE+'/api/veille/lettre').then(function(r){return r.ok?r.json():null}).then(function(j){
  if(!Array.isArray(j))return;var n=lit();n.items=j.slice(0,50);n.at=Date.now();
  var garde={};n.items.forEach(function(it){if(n.vus&&Object.prototype.hasOwnProperty.call(n.vus,it.id))garde[it.id]=n.vus[it.id]});n.vus=garde;ecrit(n);dessiner();
 }).catch(function(){});
}
doc.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-veille]');if(b)ouvrir(b.getAttribute('data-veille'))});
/* les cartes reviennent en haut du chat à chaque fois que le chat se redessine */
var avant=racine.chatRender;
if(typeof avant==='function')racine.chatRender=function(){var r=avant.apply(this,arguments);try{dessiner()}catch(e){}return r};
racine.casoVeille={charger:charger,dessiner:dessiner,ouvrir:ouvrir};
dessiner();charger();
doc.addEventListener('visibilitychange',function(){if(!doc.hidden)charger()});
})(typeof window!=='undefined'?window:globalThis);

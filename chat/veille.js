/* casô : la newsletter réglementaire
   - l'appli lit les textes que le propriétaire de casô a validés et choisi d'envoyer (GET /api/veille/lettre)
   - ils sont rangés dans la page « Newsletter » du menu, triés pour le métier de l'artisan ; une pastille signale le non lu
   - « Ça me concerne ? » ouvre trois lignes : Pour qui, Quand, À faire. « Pour qui » est calculé ici, depuis « Mon entreprise »
   - rien n'est posé dans le chat : il répond seulement, en phrases simples, quand l'artisan demande ce qui change
   - un texte lu redevient « à lire » quand l'échéance approche (90, 30 puis 7 jours)
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

function plat(x){return String(x||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[’`]/g,"'")}
/* une question sur les nouveautés ? (seulement des tournures de question : une commande de devis ne passe pas ici) */
var DEMANDE=/quoi de neuf|nouveaute|newsletter|actualite|qu'?est[- ]ce qui change|ca change quoi|quoi change|qui change|des changements|nouvelles? (?:loi|regle|obligation)|reglementation|quoi de nouveau|du nouveau/;
function demande(t){return DEMANDE.test(plat(t))}
/* les mots du sujet demandé (« tva », « facture »…), hors mots de la question */
var CREUX=/^(quoi|neuf|nouveau|nouveaute|nouveautes|newsletter|actualite|actualites|change|changement|changements|pour|avec|dans|cette|cette|quel|quelle|quelles|quels|est|qui|que|les|des|sur|mon|mes|ton|tes|moi|loi|lois|regle|regles|reglementation|nouvelle|nouvelles|obligation|obligations|metier|semaine|mois|annee|il|ya|y|a|la|le|de|du|en|ce|ca)$/;
function sujets(t){var out=[];plat(t).split(/[^a-z0-9]+/).forEach(function(m){if(m.length>=3&&!CREUX.test(m)&&out.indexOf(m)<0)out.push(m)});return out.slice(0,6)}

var api={concerne:concerne,quand:quand,palier:palier,aMontrer:aMontrer,carte:carte,dateFr:dateFr,demande:demande,sujets:sujets};
if(typeof module!=='undefined'&&module.exports){module.exports=api;return}

/* ---- dans l'appli ---- */
var doc=racine.document,ouverts={},revenu={};
function lit(){try{var s=JSON.parse(racine.localStorage.getItem(K)||'null');if(s&&typeof s==='object')return s}catch(e){}return {}}
function ecrit(s){try{racine.localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
function artisan(){try{var a=racine.accountGet&&racine.accountGet();return !a||a.mode!=='bricoleur'}catch(e){return true}}
function prof(){try{return (typeof db!=='undefined'&&db&&db.prof)||{}}catch(e){return {}}}   // « db » est une variable de l'appli, pas une propriété de window
function tr(x){try{return racine.i18nT?racine.i18nT(x):x}catch(e){return x}}
/* la pastille : il y a du nouveau à lire (dans le menu et sur le logo) */
function pastille(){
 var s=lit(),n=artisan()?aMontrer(s.items,s.vus||{},prof(),jour()).length:0,d=doc.getElementById('newsDot'),t=doc.querySelector('#hd .ttl');
 if(d)d.hidden=!n;
 if(t){var p=doc.getElementById('newsDotHd');if(n&&!p){p=doc.createElement('i');p.id='newsDotHd';p.setAttribute('aria-hidden','true');
   p.style.cssText='position:absolute;top:-3px;inset-inline-start:29px;width:10px;height:10px;border-radius:50%;background:#e5484d;border:2px solid var(--bg,#f2f2ef)';
   if(racine.getComputedStyle&&racine.getComputedStyle(t).position==='static')t.style.position='relative';t.appendChild(p)}
  if(p)p.hidden=!n}
}
/* la page Newsletter : ce qui concerne l'artisan, le non lu d'abord */
function page(){
 var z=doc.getElementById('newsList');if(!z)return;var s=lit(),auj=jour(),p=prof(),neufs={};
 aMontrer(s.items,s.vus||{},p,auj).forEach(function(it){neufs[it.id]=1});
 var L=(s.items||[]).filter(function(it){return it&&it.id&&it.titre&&concerne(p,it).etat!=='non'});
 L.sort(function(a,b){return (neufs[b.id]||0)-(neufs[a.id]||0)||(a.publieLe<b.publieLe?1:a.publieLe>b.publieLe?-1:0)});
 if(!artisan()||!L.length){z.innerHTML='<p class="mut" style="text-align:center;padding:28px 12px">'+esc(tr('Rien de nouveau pour ton métier.'))+'</p>';return}
 var h='';L.slice(0,30).forEach(function(it){
  if(!Object.prototype.hasOwnProperty.call(revenu,it.id))revenu[it.id]=!!(neufs[it.id]&&s.vus&&Object.prototype.hasOwnProperty.call(s.vus,it.id));
  h+=carte(it,!!ouverts[it.id]||!neufs[it.id],p,auj,tr,revenu[it.id]).replace('class="msg bot"','class="card" style="margin-bottom:10px'+(neufs[it.id]&&!ouverts[it.id]?';border-color:var(--acc,#ffc21a)':'')+'"')});
 z.innerHTML=h;
}
function ouvrir(id){
 var s=lit(),it=(s.items||[]).filter(function(x){return x.id===id})[0];if(!it)return;
 ouverts[id]=true;s.vus=s.vus||{};s.vus[id]=palier(it,jour());ecrit(s);page();pastille();
}
function charger(force){
 var s=lit();if(!artisan()||(racine.navigator&&racine.navigator.onLine===false)||(!force&&s.at&&Date.now()-s.at<PERIODE))return;
 racine.fetch(BASE+'/api/veille/lettre').then(function(r){return r.ok?r.json():null}).then(function(j){
  if(!Array.isArray(j))return;var n=lit();n.items=j.slice(0,50);n.at=Date.now();
  var garde={};n.items.forEach(function(it){if(n.vus&&Object.prototype.hasOwnProperty.call(n.vus,it.id))garde[it.id]=n.vus[it.id]});n.vus=garde;ecrit(n);pastille();page();
 }).catch(function(){});
}
/* dans le chat : une question sur ce qui change reçoit une réponse courte, en phrases ; le reste suit son chemin habituel */
function reponse(texte){
 var s=lit(),p=prof(),auj=jour(),L=(s.items||[]).filter(function(it){return it&&it.id&&it.titre&&concerne(p,it).etat!=='non'}),q=sujets(texte);
 if(q.length){var P=L.filter(function(it){var t=plat(it.titre+' '+(it.resume||''));return q.some(function(m){return t.indexOf(m)>=0})});if(P.length)L=P}
 if(!L.length)return '<p>'+esc(tr('Rien de nouveau pour ton métier.'))+'</p>';
 return L.slice(0,3).map(function(it){var c=concerne(p,it),w=quand(it,auj);
  return '<p data-noi18n lang="fr"><b>'+esc(it.titre)+'</b>'+(w?'<br>'+esc(w)+'.':'')+(c.etat==='peut'?'<br>'+esc(c.texte)+'.':'')+(it.aFaire?'<br>'+esc(tr('À faire'))+' : '+esc(it.aFaire):'')+'</p>'}).join('')
  +(L.length>3?'<p>'+esc(tr('Le reste est dans Newsletter.'))+'</p>':'');
}
doc.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-veille]');if(b)ouvrir(b.getAttribute('data-veille'))});
var envoi=racine.chatSend;
if(typeof envoi==='function')racine.chatSend=function(texte){
 var inp=doc.getElementById('chatIn'),t=String(texte==null?(inp?inp.value:''):texte).trim();
 if(!t||!artisan()||!demande(t)||typeof racine.chatPush!=='function')return envoi.apply(this,arguments);
 if(inp){inp.value='';try{racine.chatGrow&&racine.chatGrow(inp);racine.qkUpdate&&racine.qkUpdate()}catch(e){}}
 racine.chatPush({who:'me',text:t});racine.chatPush({who:'bot',html:reponse(t)});
};
racine.casoVeille={charger:charger,page:page,ouvrir:ouvrir,pastille:pastille,reponse:reponse};
pastille();charger();
/* la notification ouvre la page Newsletter */
if(/[?&]news=/.test(String(racine.location&&racine.location.search||'')))racine.setTimeout(function(){try{charger(true);racine.go('news')}catch(e){}},700);
doc.addEventListener('visibilitychange',function(){if(!doc.hidden)charger()});
})(typeof window!=='undefined'?window:globalThis);

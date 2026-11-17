/* casô : la newsletter réglementaire
   - l'appli lit les textes que le propriétaire de casô a validés et choisi d'envoyer (GET /api/veille/lettre)
   - ils sont rangés dans la page « Newsletter » du menu, triés pour le métier de l'artisan ; une pastille signale le non lu
   - « Ça me concerne ? » ouvre trois lignes : Pour qui, Quand, À faire. « Pour qui » est calculé ici, depuis « Mon entreprise »
   - rien n'est posé dans le chat : il répond seulement, en phrases simples, quand l'artisan demande ce qui change
   - un texte lu redevient « à lire » quand l'échéance approche (90, 30 puis 7 jours)
   - le texte des cartes reste en français, comme les textes officiels */
(function(racine){
'use strict';
var BASE=(racine.CASO_APPRIS||'https://app-e6c6e91c-8623-4524-95ef-2cefb8b67f7b.cleverapps.io'),K='caso_veille',PERIODE=36e5;   // en arrière-plan : une fois par heure ; à l'ouverture de la page : à chaque fois
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
var DEMANDE=/quoi de neuf|nouveaute|newsletter|actualite|qu'?est[- ]ce qui change|ca change quoi|quoi change|qui change|des changements|nouvelles? (?:loi|regle|obligation)|reglementation|quoi de nouveau|(?:^|il y a |y a |y a-t-il |as-tu |t'as |tu as )du nouveau|du nouveau\s*(?:\?|$)/;
function demande(t){return DEMANDE.test(plat(t))}
/* « ouvre la newsletter », « newsletter » : c'est la page qu'on demande, pas une réponse dans le chat */
var PAGE=/^(?:(?:ouvr\w*|affich\w*|montr\w*|voir|lire|lis|va (?:dans|sur|a)|open|show|see|read|abr\w*|ver|mostra\w*|apri\w*|vedi|deschide|arata|otworz|pokaz|ac|goster|открой|покажи|افتح|اعرض)\s+)?(?:moi\s+|me\s+)?(?:la |ma |les |the |my |el |a |o |il |le )?newsletters?\s*[.!]*$/;
function page0(t){return PAGE.test(plat(t).trim())}
/* les mots du sujet demandé (« tva », « facture »…), hors mots de la question */
var CREUX=/^(quoi|neuf|nouveau|nouveaute|nouveautes|newsletter|actualite|actualites|change|changement|changements|pour|avec|dans|cette|cette|quel|quelle|quelles|quels|est|qui|que|les|des|sur|mon|mes|ton|tes|moi|loi|lois|regle|regles|reglementation|nouvelle|nouvelles|obligation|obligations|metier|semaine|mois|annee|il|ya|y|a|la|le|de|du|en|ce|ca)$/;
function sujets(t){var out=[];plat(t).split(/[^a-z0-9]+/).forEach(function(m){if(m.length>=3&&!CREUX.test(m)&&out.indexOf(m)<0)out.push(m)});return out.slice(0,6)}

var api={concerne:concerne,quand:quand,palier:palier,aMontrer:aMontrer,carte:carte,dateFr:dateFr,demande:demande,sujets:sujets,page:page0,titreCourt:titreCourt};
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
/* la page Newsletter : ce qui concerne l'artisan ; le plus important à lire en grand, le reste en lignes, le déjà lu en bas */
/* presse du métier : la source est toujours nommée, ce n'est pas un texte officiel */
var SOURCES={capeb:'CAPEB',batiactu:'Batiactu'};
var NOMS={'électriciens':'Électricien','plombiers-chauffagistes':'Plombier-chauffagiste','maçons':'Maçon','couvreurs':'Couvreur','menuisiers':'Menuisier','peintres':'Peintre','diagnostiqueurs':'Diagnostiqueur'};
var CSS='#newsList{--nv:cubic-bezier(.2,.8,.2,1)}'
+'.nv-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:-6px 0 16px}'
+'.nv-chip{font-size:13px;line-height:1;padding:7px 11px;border-radius:999px;background:var(--soft,#f0f0ed);color:var(--mut,#6b6b70)}'
+'.nv-chip.on{background:var(--acc,#ffc21a);color:#18181a;font-weight:700}'
+'.nv-une{position:relative;overflow:hidden;border-radius:26px;padding:22px 20px 20px;margin:0 0 18px;background:var(--ink,#18181a);color:var(--bg,#f2f2ef)}'
+'.nv-une::after{content:"";position:absolute;inset-inline-end:-70px;top:-70px;width:190px;height:190px;border-radius:50%;background:var(--acc,#ffc21a);opacity:.16;pointer-events:none}'
+'.nv-sur{display:flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.72;margin:0 0 12px}'
+'.nv-sur i{width:8px;height:8px;border-radius:50%;background:var(--acc,#ffc21a);animation:nvp 1.8s ease-in-out infinite}'
+'.nv-une h2{margin:0 0 14px;font-size:20px;line-height:1.25;font-weight:800;letter-spacing:-.01em;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden;overflow-wrap:anywhere}.nv-une h2.ouv{display:block;font-size:17px;-webkit-line-clamp:unset}.nv-nat{margin:0 0 6px;font-size:12.5px;font-weight:600;opacity:.7}'
+'.nv-j{display:flex;align-items:baseline;gap:8px;margin:0 0 8px}.nv-j b{font-size:34px;line-height:1;font-weight:800;color:var(--acc,#ffc21a);letter-spacing:-.02em}.nv-j span{font-size:14px;opacity:.75}'
+'.nv-bar{height:5px;border-radius:5px;background:color-mix(in srgb,currentColor 18%,transparent);overflow:hidden;margin:0 0 18px}.nv-bar i{display:block;height:100%;border-radius:5px;background:var(--acc,#ffc21a);transform-origin:left;animation:nvb .9s var(--nv) both}'
+'[dir=rtl] .nv-bar i{transform-origin:right}'
+'.nv-go{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;background:var(--acc,#ffc21a);color:#18181a;font:inherit;font-weight:800;padding:13px 20px;min-height:48px;cursor:pointer}'
+'.nv-go:active,.nv-l:active{transform:scale(.98)}'
+'.nv-f{margin:0}.nv-a{margin:0;font-size:16px;line-height:1.45}.nv-q{margin:6px 0 0;font-size:14px;opacity:.7}'
+'.nv-m{margin:10px 0 0;font-size:13.5px;opacity:.7;display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center}.nv-m a{color:inherit;text-decoration:underline;text-underline-offset:3px}'
+'.nv-une .nv-f{margin-top:2px}'
+'.nv-in{animation:nvi .34s var(--nv) both}'
+'.nv-t{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut,#6b6b70);margin:22px 4px 8px}'
+'.nv-l{display:block;width:100%;text-align:start;border:1px solid var(--line,#e2e1dc);background:var(--card,#fbfbfa);color:inherit;font:inherit;border-radius:20px;padding:14px 16px;margin:0 0 8px;cursor:pointer;transition:transform .12s}'
+'.nv-h{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center}'
+'.nv-b{min-width:54px;text-align:center;border-radius:13px;padding:8px 6px;background:var(--soft,#f0f0ed);font-size:13px;font-weight:800;line-height:1.1}.nv-b small{display:block;font-size:10px;font-weight:500;color:var(--mut,#6b6b70);margin-top:2px}'
+'.nv-b.proche{background:var(--acc,#ffc21a);color:#18181a}.nv-b.proche small{color:#18181a;opacity:.7}'
+'.nv-n{font-weight:700;line-height:1.3;font-size:15.5px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;overflow-wrap:anywhere}.nv-n.ouv{display:block}.nv-n u{text-decoration:none;display:inline-block;width:8px;height:8px;border-radius:50%;background:#e5484d;margin-inline-end:7px;vertical-align:1px}'
+'.nv-c{width:18px;height:18px;color:var(--mut,#6b6b70);transition:transform .25s var(--nv)}.nv-l[aria-expanded=true] .nv-c{transform:rotate(90deg)}'
+'.nv-l .nv-f{margin-top:10px;padding-inline-start:66px}.nv-l.lu{opacity:.78}'
+'.nv-vide{text-align:center;padding:44px 16px;color:var(--mut,#6b6b70)}.nv-vide span{width:60px;height:60px;border-radius:20px;background:var(--acc,#ffc21a);color:#18181a;display:grid;place-items:center;margin:0 auto 14px}.nv-vide span svg{width:28px;height:28px}.nv-vide b{display:block;color:var(--ink,#18181a);font-size:19px;margin-bottom:4px}'
+'.nv-anim>*{animation:nvi .45s var(--nv) both}.nv-anim>*:nth-child(2){animation-delay:.05s}.nv-anim>*:nth-child(3){animation-delay:.1s}.nv-anim>*:nth-child(4){animation-delay:.15s}.nv-anim>*:nth-child(n+5){animation-delay:.2s}'
+'@keyframes nvi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes nvb{from{transform:scaleX(0)}to{transform:none}}@keyframes nvp{50%{opacity:.35;transform:scale(.8)}}'
+'@media (prefers-reduced-motion:reduce){.nv-anim>*,.nv-in,.nv-bar i,.nv-sur i{animation:none}}';
var ic=function(n){return '<svg class="i" aria-hidden="true"><use href="#i-'+n+'"/></svg>'};
/* le délai, en court : « J-15 », « Demain », « En vigueur », « Projet » */
/* titre officiel trop long : « Arrêté du 12 novembre 2026 relatif aux … » → nature et date à part, le sujet en clair */
function titreCourt(t){
 t=String(t||'').replace(/\s+/g,' ').trim();
 var m=t.match(/^(Arrêté|Décret|Loi|Ordonnance|Décision|Délibération|Circulaire|Avis|Instruction)(?: n° ?[\w.\-\/]+)? du (\d{1,2}(?:er)? \S+ \d{4}),? (.+)$/i);
 if(!m)return {nat:'',t:t};
 var r=m[3].replace(/^(?:relatif|relative|relatifs|relatives) (?:à l'|à la |à |au |aux )/i,'').replace(/^portant /i,'');
 return {nat:m[1].charAt(0).toUpperCase()+m[1].slice(1).toLowerCase()+' du '+m[2],t:r.charAt(0).toUpperCase()+r.slice(1)};
}
function court(it,auj){
 if(it.categorie==='proposition')return {t:'Projet',s:'',p:0};
 if(!it.dateVigueur)return {t:it.datePub?it.datePub.slice(8,10)+'/'+it.datePub.slice(5,7):'•',s:'',p:0};
 var d=delai(it.dateVigueur,auj);return d>1?{t:'J-'+d,s:it.dateVigueur.slice(8,10)+'/'+it.dateVigueur.slice(5,7),p:d<=30?1:0}:d===1?{t:'Demain',s:'',p:1}:d===0?{t:'Auj.',s:'',p:1}:{t:'En vigueur',s:'',p:0};
}
/* la partie dépliée, courte : ce qu'il y a à faire, puis une ligne discrète (la date si elle n'est pas déjà affichée, le lien officiel).
   « Pour qui » n'apparaît que s'il y a quelque chose à préciser (un métier, ou « si tu fais partie des… »). */
function faits(it,p,auj,une){
 var c=concerne(p,it),q=quand(it,auj),h='<div class="nv-f nv-in">';
 if(it.aFaire)h+='<p class="nv-a" data-noi18n lang="fr">'+esc(it.aFaire)+'</p>';else if(q)h+='<p class="nv-a" data-noi18n lang="fr">'+esc(q)+'.</p>';
 if(c.texte!=='Oui, toi')h+='<p class="nv-q" data-noi18n lang="fr">'+esc(c.texte)+'</p>';
 var dj=it.dateVigueur?delai(it.dateVigueur,auj):null;var m=((!une&&it.aFaire&&it.dateVigueur||une&&it.dateVigueur&&!(dj>0))&&it.categorie!=='proposition'?'<span data-noi18n lang="fr">'+esc(dateFr(it.dateVigueur))+'</span>':'')
  +(/^https:\/\//.test(it.url||'')?'<a href="'+esc(it.url)+'" target="_blank" rel="noopener noreferrer">'+esc(it.categorie==='nouveaute'?tr('Lire l\'article')+' · '+(SOURCES[it.source]||it.source||''):tr('Texte officiel'))+'</a>':'');
 return h+(m?'<p class="nv-m">'+m+'</p>':'')+'</div>';
}
var dejaAnime=false,lus={};
function page(){
 var z=doc.getElementById('newsList');if(!z)return;var s=lit(),auj=jour(),p=prof(),neufs={};
 if(!doc.getElementById('nvCss')&&doc.createElement&&doc.head){var st=doc.createElement('style');st.id='nvCss';st.textContent=CSS;doc.head.appendChild(st)}
 aMontrer(s.items,s.vus||{},p,auj).forEach(function(it){neufs[it.id]=1});
 Object.keys(lus).forEach(function(id){neufs[id]=1});   // lu pendant cette visite : il garde sa place
 var L=(s.items||[]).filter(function(it){return it&&it.id&&it.titre&&concerne(p,it).etat!=='non'});
 var PR={P0:0,P1:1,P2:2,P3:3},rang=function(it){return (neufs[it.id]?0:10)+(Object.prototype.hasOwnProperty.call(PR,it.priorite)?PR[it.priorite]:3)};
 var proche=function(it){var d=it.dateVigueur?delai(it.dateVigueur,auj):9999;return d<0?9999:d};   // à priorité égale, l'échéance la plus proche d'abord
 L.sort(function(a,b){return rang(a)-rang(b)||proche(a)-proche(b)||(a.publieLe<b.publieLe?1:a.publieLe>b.publieLe?-1:0)});L=L.slice(0,30);
 var N=L.filter(function(it){return neufs[it.id]}),V=L.filter(function(it){return !neufs[it.id]}),anime=dejaAnime?'':' class="nv-anim"';dejaAnime=true;
 var aLire=N.filter(function(it){return !lus[it.id]}).length;
 var h='<div class="nv-top"><span class="nv-chip">'+esc(tr(NOMS[p.metier]||'Artisan du bâtiment'))+'</span>'+(aLire?'<span class="nv-chip on">'+aLire+' '+esc(tr('à lire'))+'</span>':'')+'</div>';
 if(!artisan()||!L.length){z.innerHTML='<div class="nv-vide nv-in"><span>'+ic('check')+'</span><b>'+esc(tr('Tu es à jour'))+'</b>'+esc(tr('Rien de nouveau pour ton métier.'))+'</div>';return}
 var une=N[0];
 if(une){var d=une.dateVigueur?delai(une.dateVigueur,auj):null,tot=une.dateVigueur&&une.datePub?Math.max(1,delai(une.dateVigueur,une.datePub)):0,fait=tot&&d!=null?Math.min(100,Math.max(4,Math.round((tot-Math.max(0,d))/tot*100))):0;
  h+='<article class="nv-une"><p class="nv-sur"><i></i>'+esc(tr(une.categorie==='nouveaute'?'Nouveauté du métier':une.priorite==='P0'||une.priorite==='P1'?'Important':'Du nouveau pour ton métier'))+'</p>'+(function(){var k=titreCourt(une.titre);return (k.nat?'<p class="nv-nat" data-noi18n lang="fr">'+esc(k.nat)+'</p>':'')+'<h2 data-noi18n lang="fr"'+(ouverts[une.id]?' class="ouv"':'')+'>'+esc(ouverts[une.id]?une.titre:k.t)+'</h2>'})()
   +(d!=null&&d>0&&une.categorie!=='proposition'?'<p class="nv-j"><b>J-'+d+'</b><span data-noi18n lang="fr">'+esc(dateFr(une.dateVigueur))+'</span></p><div class="nv-bar"><i style="width:'+fait+'%"></i></div>':'')
   +(ouverts[une.id]?faits(une,p,auj,true):'<button type="button" class="nv-go" data-veille="'+esc(une.id)+'">'+esc(tr('Ça me concerne ?'))+ic('arrow')+'</button>')+'</article>'}
 var ligne=function(it,lu){var o=!!ouverts[it.id],c=court(it,auj);
  return '<button type="button" class="nv-l'+(lu?' lu':'')+'" data-veille="'+esc(it.id)+'" aria-expanded="'+o+'"><span class="nv-h"><span class="nv-b'+(c.p?' proche':'')+'">'+esc(tr(c.t))+(c.s?'<small>'+esc(c.s)+'</small>':'')+'</span>'
   +'<span class="nv-n'+(o?' ouv':'')+'" data-noi18n lang="fr">'+(lu||lus[it.id]?'':'<u></u>')+esc(o?it.titre:titreCourt(it.titre).t)+'</span><svg class="i nv-c i-flip" aria-hidden="true"><use href="#i-chev"/></svg></span>'+(o?faits(it,p,auj):'')+'</button>'};
 var reste=N.slice(1);if(reste.length)h+='<p class="nv-t">'+esc(tr('À lire aussi'))+'</p>'+reste.map(function(it){return ligne(it,false)}).join('');
 if(V.length)h+='<p class="nv-t">'+esc(tr('Déjà lu'))+'</p>'+V.map(function(it){return ligne(it,true)}).join('');
 z.innerHTML='<div'+anime+'>'+h+'</div>';
}
/* toucher une ligne l'ouvre ou la referme ; ce qui a été ouvert garde sa place à l'écran jusqu'à la prochaine visite, sans la pastille */
function ouvrir(id){
 var s=lit(),it=(s.items||[]).filter(function(x){return x.id===id})[0];if(!it)return;
 ouverts[id]=!ouverts[id];if(ouverts[id]&&!lus[id]){lus[id]=1;s.vus=s.vus||{};s.vus[id]=palier(it,jour());ecrit(s)}page();pastille();
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
 racine.chatPush({who:'me',text:t});
 if(page0(t)&&typeof racine.go==='function'){racine.chatPush({who:'bot',text:tr('Newsletter')});setTimeout(function(){try{racine.go('news')}catch(e){}},250);return}
 racine.chatPush({who:'bot',html:reponse(t)});
};
racine.casoVeille={charger:charger,page:page,ouvrir:ouvrir,pastille:pastille,reponse:reponse};
pastille();charger();
/* la notification ouvre la page Newsletter */
if(/[?&]news=/.test(String(racine.location&&racine.location.search||'')))racine.setTimeout(function(){try{charger(true);racine.go('news')}catch(e){}},700);
doc.addEventListener('visibilitychange',function(){if(!doc.hidden)charger()});
})(typeof window!=='undefined'?window:globalThis);

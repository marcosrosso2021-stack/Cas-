/* casô · fiche chantier, lexique du bâtiment, historique des modifications (nov. 2026)
   Rien n'est ajouté à l'écran : tout passe par les réponses du chat. Chargé après chat/intel.js et chat/lexique.js.
   - fiche chantier : « fiche du chantier Martin », « photos du chantier Martin », « documents de Martin »,
     « qu'est-ce que j'ai fait chez Martin », « qu'est-ce qu'il reste chez Martin », « rapport du chantier Martin »,
     « reprends le chantier de la semaine dernière », « montre les chantiers de la semaine prochaine » ;
   - lexique : « c'est quoi un ragréage », « ragréage avant le parquet », « ordre des travaux » (10 langues) ;
   - historique : chaque enregistrement de l'appli note qui a changé quoi, et quand (dans ce téléphone, 400 dernières
     modifications) ; la fiche modifiée garde le prénom de son auteur pour l'équipe. « historique », « qui a modifié le devis de Martin ». */
(function(){
"use strict";
var P=window.casoPont;if(!P)return;
function B(){return P.B;}
function hn(s){return CasoBrain.hn(String(s||""));}
function cle(n){return hn(n).replace(/^(m|mme|mlle|monsieur|madame|mr|mrs)\s+/,"").trim();}
function e(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function T(t,a){return P.tr(t,a);}
function lang(){return (typeof I18N!=="undefined"&&I18N.lang)||"fr";}
function langue(){try{B().setLangue(lang());}catch(x){}}
function E(x){return P.B.eurFr(Math.round(x*100)/100);}
function N(x){return P.B.fnumFr(Math.round(x*10)/10);}
function fr(t){try{return B().translate(t);}catch(x){return {p:hn(t),n:hn(t),lang:"fr"};}}
function p(s){return '<p dir="auto">'+e(s)+'</p>';}
function bulle(t,h){CHAT.m.push({who:"me",text:t});CHAT.m.push({who:"bot",html:'<div data-noi18n>'+h+'</div>'});chatSave();chatRender(true);}
function cliDe(id){return (db.clients||[]).filter(function(c){return c.id===id;})[0]||null;}
function cliNom(n){var k=cle(n);return (db.clients||[]).filter(function(c){return cle(c.nom)===k;})[0]||null;}
function cliTexte(t){var h=" "+cle(t)+" ",best=null;(db.clients||[]).forEach(function(c){var n=cle(c.nom||"");if(n.length>=2&&h.indexOf(" "+n+" ")>=0&&(!best||n.length>cle(best.nom).length))best=c;});return best;}
function client(t){var n=null;try{n=P.clientDans(t);}catch(x){}return (n&&cliNom(n))||cliTexte(t);}
var ACT=/^\s*(nouveau|nouvelle|ajoute|rajoute|mets|met|enleve|retire|supprime|efface|note|cree|envoie|change|modifie|remplace|commande|achete|appelle|ecris|relance|facture|signe|annule|deplace|planifie|prevois|chiffre|ouvre|calcule|applique)\b/;

/* ================= lexique du bâtiment ================= */
var LX=window.CASO_LEXIQUE,IDX=null;
function nrm(s){return " "+hn(s).replace(/\s+/g," ").trim()+" ";}
function index(){if(IDX)return IDX;IDX=[];if(!LX)return IDX;Object.keys(LX.t).forEach(function(k){var n=LX.t[k].n;Object.keys(n).forEach(function(l){n[l].split("|").forEach(function(a){var x=nrm(a).trim();if(x.length>=2)IDX.push({k:k,a:x});});});});
  IDX.sort(function(a,b){return b.a.length-a.a.length;});return IDX;}
/* termes trouvés dans la phrase, dans l'ordre où ils sont dits ; le nom le plus long d'abord (« chape » dans « sapa autonivelanta » ne compte pas) */
function termes(s){var u=s,out=[];index().forEach(function(x){var i=u.indexOf(" "+x.a+" ");if(i<0)return;u=u.slice(0,i+1)+new Array(x.a.length+1).join("\u0001")+u.slice(i+1+x.a.length);if(!out.some(function(o){return o.k===x.k;}))out.push({k:x.k,i:i});});
  return out.sort(function(a,b){return a.i-b.i;}).map(function(o){return o.k;});}
function nomL(k){var n=LX.t[k].n,l=lang();return (n[l]||n.fr).split("|")[0];}
function maj(s){return s.charAt(0).toUpperCase()+s.slice(1);}
var QDEF=/ (c est quoi|qu est ce que|qu est ce qu|c est quoi|que veut dire|ca veut dire|veut dire quoi|definition|definis|explique|a quoi sert|sert a quoi|signifie|what is|what s|whats|what are|meaning|define|que es|que son|que significa|o que e|o que sao|o que significa|cos e|che cos e|cosa e|cosa significa|che significa|ce este|ce e|ce inseamna|co to jest|co to|co znaczy|czym jest|nedir|ne demek|ne ise yarar|что такое|что значит|что означает|ما هو|ما هي|ماذا يعني|ما معنى) /;
var QORD=/ (avant|apres|d abord|en premier|en dernier|ordre|before|after|first|order|antes|despues|primero|depois|primeiro|prima|dopo|ordine|inainte|dupa|ordinea|przed|najpierw|kolejnosc|once|sonra|sira|до|после|сначала|порядок|قبل|بعد|اولا|ترتيب) /;
var QGEN=/ (ordre des travaux|ordre de travaux|dans quel ordre|order of works|order of work|orden de los trabajos|ordem dos trabalhos|ordine dei lavori|ordinea lucrarilor|kolejnosc prac|is sirasi|порядок работ|ترتيب الاعمال) /;
var AVANT=null;function avants(){if(AVANT)return AVANT;AVANT={};LX.o.forEach(function(r){(AVANT[r[0]]=AVANT[r[0]]||[]).push(r[1]);});return AVANT;}
function avant(a,b){if(a===b)return false;if(a==="depose")return true;if(b==="depose")return false;var vu={},pile=[a],A=avants();
  while(pile.length){var x=pile.pop();if(vu[x])continue;vu[x]=1;var L=A[x]||[];for(var i=0;i<L.length;i++){if(L[i]===b)return true;pile.push(L[i]);}}return false;}
P.lexique=function(t){if(!LX||!P.ready)return false;var raw=nrm(t),c=fr(t),s=nrm(c.p);
  if(/\d/.test(t)||ACT.test(c.p))return false;
  var K=termes(raw);if(!K.length)termes(s).forEach(function(k){if(K.indexOf(k)<0)K.push(k);});
  langue();
  /* ordre général des travaux */
  if((QGEN.test(raw)||QGEN.test(s))&&K.length<2){bulle(t,p(T("Ordre habituel des travaux : {0}.",[LX.g.map(nomL).join(" → ")])));return true;}
  if(!K.length)return false;
  /* ordre entre deux travaux : « ragréage avant le parquet », « on fait d'abord la peinture ou le parquet ? » */
  if(K.length>=2&&(QORD.test(raw)||QORD.test(s))){
    if(K.length>2){var G=LX.g;if(!K.every(function(k){return G.indexOf(k)>=0;}))return false;
      var S=K.slice().sort(function(a,b){return G.indexOf(a)-G.indexOf(b);});
      for(var i=0;i+1<S.length;i++)if(!avant(S[i],S[i+1]))return false;
      bulle(t,p(T("Dans l’ordre : {0}.",[S.map(nomL).join(" → ")])));return true;}
    var a=K[0],b=K[1];
    if(avant(a,b))bulle(t,p(T("D’abord {0}, puis {1}.",[nomL(a),nomL(b)])));
    else if(avant(b,a))bulle(t,p(T("D’abord {0}, puis {1}.",[nomL(b),nomL(a)])));
    else bulle(t,p(T("Pas d’ordre fixe entre {0} et {1}.",[nomL(a),nomL(b)])));
    return true;}
  /* définition : « c'est quoi un ragréage », ou le mot seul suivi de « ? » */
  var k=K[0],d=LX.t[k].d;if(!d||/\b(prix|cout|coute|combien|tarif|stock|quantite|delai|duree|temps|marge|fournisseur|devis|facture|m2|metres?)\b/.test(s))return false;
  var reste=raw;index().forEach(function(x){if(x.k===k)reste=reste.split(" "+x.a+" ").join(" ");});
  var seul=/\?\s*$/.test(t)&&reste.trim().split(" ").filter(function(w){return w.length>3;}).length===0;
  if(!(QDEF.test(raw)||QDEF.test(s)||seul))return false;
  bulle(t,p(maj(nomL(k))+(lang()==="fr"?" : ":": ")+(d[lang()]||d.fr)));TOUR.t=null;return true;};

/* ================= historique des modifications ================= */
var JK="caso_journal",TOUR={t:null,at:0},DIST=false;
function jLit(){try{return JSON.parse(localStorage.getItem(JK)||"[]")||[];}catch(x){return [];}}
function jEcrit(L){try{localStorage.setItem(JK,JSON.stringify(L.slice(-400)));}catch(x){}}
function moi(){var a={};try{a=JSON.parse(localStorage.getItem("caso_account")||"null")||{};}catch(x){}return String((db.me&&db.me.prenom)||a.prenom||"").trim();}
/* ce qui désigne la fiche : un nom, un numéro, une date ; et le client concerné */
function ident(c,r){var cl="",n="";if(!r)return null;
  if(c==="clients"){n=r.nom||"";cl=r.nom||"";}
  else if(c==="quotes"){n=r.num||"";cl=r.client||"";}
  else if(c==="invoices"){n=r.num||"";cl=r.client&&r.client.nom||"";}
  else if(c==="events"){if(r.id==="dispo")return null;n=(r.d||"")+(r.a?" "+r.a:"");var x=cliDe(r.cid);cl=x?x.nom:"";if(r.title)n+=" "+r.title;}
  else if(c==="plans"){n=r.nom||"";var y=cliDe(r.cid);cl=y?y.nom:"";}
  else if(c==="projects"){n=r.nom||"";var z=cliDe(r.cid);cl=z?z.nom:"";}
  else if(c==="chantiers"){n=r.nom||"";var w=cliDe(r.cid);cl=w?w.nom:"";}
  else if(c==="pts"){var pe=(db.people||[]).filter(function(x){return x.id===r.p;})[0];n=(pe&&pe.nom||"")+(r.t==="in"?" ↘":" ↗");}
  else n=r.nom||r.num||"";
  return {c:c,n:String(n).slice(0,60),cl:String(cl).slice(0,60)};}
var AUTO={updatedAt:1,at:1,by:1,rem:1,tz:1,_c:1};
function pareil(a,b){try{var x=JSON.parse(a),y=JSON.parse(b);Object.keys(AUTO).forEach(function(k){delete x[k];delete y[k];});return JSON.stringify(x)===JSON.stringify(y);}catch(z){return false;}}
function noter(chg,via,qui){if(!chg.length)return;var L=jLit(),now=Date.now(),last=L[L.length-1],cl=function(x){return x.c+"|"+x.id;};
  /* une fiche qu'on est en train de taper : une seule ligne, mise à jour */
  if(last&&last.via===via&&last.qui===qui&&now-last.at<10*60000&&chg.every(function(x){return x.k==="~";})&&
     chg.every(function(x){return last.ch.some(function(y){return cl(y)===cl(x);});})){last.at=now;chg.forEach(function(x){last.ch.filter(function(y){return cl(y)===cl(x);})[0].n=x.n;});jEcrit(L);return;}
  var o={at:now,qui:qui,via:via,ch:chg.slice(0,20)};if(via==="chat"&&TOUR.t)o.ph=String(TOUR.t).slice(0,120);L.push(o);jEcrit(L);}
function brancherJournal(){
  if(typeof window.stamp!=="function"||typeof COLL==="undefined"||typeof snap==="undefined"||window.stamp.journal)return !!(window.stamp&&window.stamp.journal);
  var st0=window.stamp;
  window.stamp=function(){var old={};try{COLL.forEach(function(c){old[c]=snap[c]||{};});}catch(x){}
    var r=st0.apply(this,arguments);
    try{var via=DIST?"equipe":(TOUR.t&&Date.now()-TOUR.at<4000?"chat":"appli"),je=moi(),chg=[],auteurs={};
      COLL.forEach(function(c){if(c==="hist")return;var nv=snap[c]||{},av=old[c]||{};if(nv===av)return;
        (db[c]||[]).forEach(function(it){if(!it||!it.id||av[it.id]===nv[it.id]||(it.id in av)&&pareil(av[it.id],nv[it.id]))return;var id0=ident(c,it);if(!id0)return;id0.id=it.id;id0.k=it.id in av?"~":"+";chg.push(id0);
          /* l'équipe voit qui a fait la dernière modification de la fiche */
          if(DIST){if(it.by)auteurs[it.by]=1;}else if(je&&it.by!==je){it.by=je;try{nv[it.id]=fp(it);}catch(x){}}});
        Object.keys(av).forEach(function(id){if(id in nv)return;var it0=null;try{it0=JSON.parse(av[id]);}catch(x){}var id1=ident(c,it0);if(!id1)return;id1.id=id;id1.k="-";chg.push(id1);});});
      if(chg.length)noter(chg,via,DIST?Object.keys(auteurs).join(", "):je);}catch(x){if(window.console)console.error(x);}
    return r;};
  window.stamp.journal=true;
  if(typeof window.applyRemote==="function"&&!window.applyRemote.journal){var ar0=window.applyRemote;window.applyRemote=function(){DIST=true;try{return ar0.apply(this,arguments);}finally{setTimeout(function(){DIST=false;},0);}};window.applyRemote.journal=true;}
  return true;}
/* la phrase du chat qui a provoqué la modification */
function brancherChat(){if(typeof window.chatSend!=="function"||window.chatSend.journal)return typeof window.chatSend==="function";
  var cs=window.chatSend;window.chatSend=function(t){try{var x=typeof t==="string"?t:(document.getElementById("chatIn")||{}).value;if(x){TOUR.t=String(x).trim();TOUR.at=Date.now();}}catch(y){}return cs.apply(this,arguments);};
  for(var k in cs)if(Object.prototype.hasOwnProperty.call(cs,k))window.chatSend[k]=cs[k];window.chatSend.journal=true;return true;}
(function attendre(n){var a=brancherJournal(),b=brancherChat();if((!a||!b)&&n<120)setTimeout(function(){attendre(n+1);},500);})(0);
var TYPE={clients:"Client {0}",quotes:"Devis {0}",invoices:"Facture {0}",events:"Rendez-vous {0}",prices:"Prix {0}",suppliers:"Fournisseur {0}",people:"Équipe {0}",plans:"Plan {0}",projects:"Projet {0}",chantiers:"Chantier {0}",pts:"Pointage {0}"};
var GESTE={"+":"ajout","~":"modification","-":"suppression"};
function quand(ms){var d=new Date(ms),z=function(x){return (x<10?"0":"")+x;};return z(d.getDate())+"/"+z(d.getMonth()+1)+" "+z(d.getHours())+":"+z(d.getMinutes());}
function ligneJ(o,filtre){var ch=o.ch.filter(filtre||function(){return true;});if(!ch.length)return "";
  var quoi=ch.slice(0,3).map(function(x){return (TYPE[x.c]?T(TYPE[x.c],[x.n||""]).trim():x.c+" "+x.n)+(x.cl&&x.c!=="clients"&&x.n.indexOf(x.cl)<0?" ("+x.cl+")":"")+" : "+T(GESTE[x.k]);}).join(" · ")+(ch.length>3?" · +"+(ch.length-3):"");
  return '<div class="ml"><div><b data-noi18n>'+e(quoi)+'</b><div class="mut" dir="auto">'+e(quand(o.at)+(o.qui?" · "+o.qui:"")+(o.ph?" · « "+o.ph+" »":""))+'</div></div></div>';}
var HIST=W("historique|journal|qui a (?:modifie|change|supprime|cree|ajoute|touche|efface|fait)|(?:dernieres?|recentes?) (?:modifications?|changements?)|(?:modifications?|changements?) (?:recentes?|d aujourd hui|du jour|de la semaine)|qu est ce qui a (?:change|ete modifie|bouge)|history|change log|changelog|who (?:changed|modified|edited|deleted)|recent changes|historial|quien (?:cambio|modifico)|historico|quem (?:alterou|mudou)|cronologia|storico|chi ha (?:modificato|cambiato)|istoric\\p{L}*|cine a modificat|historia zmian|kto zmienil|gecmis\\p{L}*|kim degistir\\p{L}*|истори\\p{L}*|кто изменил|السجل|سجل التعديلات|من عدل|من غير"),
 PRIXH=W("prix|tarifs?|price|prices|precio|precios|preco|precos|prezzo|prezzi|pret|preturi|cena|ceny|fiyat\\p{L}*|цен\\p{L}*|سعر|اسعار");
P.historique=function(t){if(!P.ready||typeof db==="undefined")return false;var c0=fr(t),s=" "+c0.p+" "+nrm(t)+" ";if(!HIST.test(s)||PRIXH.test(s)||ACT.test(c0.p))return false;langue();TOUR.t=null;
  var L=jLit().slice().reverse(),c=client(t),f=null;
  if(c){var kc=cle(c.nom);f=function(x){return cle(x.cl)===kc||cle(x.n)===kc;};}
  var col=/\bdevis\b/.test(s)?"quotes":/\bfactures?\b/.test(s)?"invoices":/\b(rendez vous|rdv|planning)\b/.test(s)?"events":null;
  if(col){var f0=f;f=function(x){return x.c===col&&(!f0||f0(x));};}
  if(/\baujourd hui\b/.test(s)){var d0=new Date();d0.setHours(0,0,0,0);L=L.filter(function(o){return o.at>=d0.getTime();});}
  var rows=[];for(var i=0;i<L.length&&rows.length<8;i++){var h=ligneJ(L[i],f);if(h)rows.push(h);}
  bulle(t,rows.length?'<div class="msg-lines">'+rows.join("")+'</div>':p(T("Aucune modification enregistrée.")));return true;};

/* ================= fiche chantier ================= */
function ymd(d){return d.getFullYear()+"-"+(d.getMonth()<9?"0":"")+(d.getMonth()+1)+"-"+(d.getDate()<10?"0":"")+d.getDate();}
function aujourdhui(){return typeof agToday==="function"?agToday():ymd(new Date());}
function heures(cid){var h=0;try{var C=(db.chantiers||[]).filter(function(c){return c.cid===cid;}).map(function(c){return c.id;});if(C.length&&typeof sessions==="function")sessions().forEach(function(x){if(x.a&&x.b&&C.indexOf(x.c)>=0)h+=(x.b-x.a)/36e5;});}catch(x){}return h;}
function achatHT(a){return a.ht!=null&&a.ht!==""?+a.ht:(+a.ttc||0)/1.2;}
function etatFa(f){try{return faState(f);}catch(x){return "";}}
var ETFA={payee:"payée",attente:"en attente",retard:"en retard",partielle:"payée en partie",brouillon:"brouillon",avoir:"avoir",annulee:"annulée"};
var ETDV={brouillon:"brouillon",envoye:"envoyé",accepte:"accepté",refuse:"refusé",paye:"payé",signe:"signé"};
function occ(ev){try{return ev.rr?agNextOcc(ev,ev.d):ev.d;}catch(x){return ev.d;}}
function heuresEntre(cid,r){var h=0;try{var C=(db.chantiers||[]).filter(function(c){return !cid||c.cid===cid;}).map(function(c){return c.id;}),A=new Date(r.a+"T00:00").getTime(),Bf=new Date(r.b+"T23:59").getTime();
  if(C.length&&typeof sessions==="function")sessions().forEach(function(x){if(x.a&&x.b&&C.indexOf(x.c)>=0&&x.a>=A&&x.a<=Bf)h+=(x.b-x.a)/36e5;});}catch(x){}return Math.round(h*10)/10;}
function jour(d){try{return agFmtD(d,{weekday:"short",day:"numeric",month:"numeric"});}catch(x){return d;}}
function heure(ev){try{return ev.a?agFmtR(ev):"";}catch(x){return ev.a||"";}}
function ml(titre,sous,droite,clic){return '<div class="ml"'+(clic?' role="button" tabindex="0" style="cursor:pointer" onclick="'+clic+'"':'')+'><div><b data-noi18n>'+e(titre)+'</b>'+(sous?'<div class="mut" dir="auto">'+e(sous)+'</div>':'')+'</div>'+(droite?'<b data-noi18n>'+e(droite)+'</b>':'')+'</div>';}
/* rapports d'intervention rangés chez ce client (chat/reponses.js) */
function rapportsDe(c){return (Array.isArray(db.rapports)?db.rapports:[]).filter(function(x){return x&&x.cid===c.id&&x.r;}).sort(function(a,b){return String(b.date).localeCompare(String(a.date));});}
function jj(d){var z=String(d||"").split("-");return z.length===3?z[2]+"/"+z[1]+"/"+z[0]:"";}
function lR(x){var r=x.r||{},un=(r.fait||[]).concat(r.obs||[]).join(" ; "),bas=[(r.sit||[]).join(" ; "),(r.suite||[]).length?T("Suite à prévoir")+" : "+r.suite.join(" ; "):""].filter(Boolean).join(" · ");return ml(un||(r.sit||[]).join(" ; "),bas,jj(x.date),"");}
function bloc(titre,L){return L.length?'<p class="mut" dir="auto">'+e(T(titre))+'</p><div class="msg-lines">'+L.join("")+'</div>':"";}
function donnees(c){var k=cle(c.nom),auj=aujourdhui();
  var Q=(db.quotes||[]).filter(function(o){return o&&cle(o.client)===k&&((o.lines||[]).length||o.num);}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""));});
  var F=(db.invoices||[]).filter(function(f){return f&&f.client&&cle(f.client.nom)===k;}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""));});
  var EV=(db.events||[]).filter(function(x){return x&&x.cid===c.id&&x.t==="rdv";});
  var passe=EV.filter(function(x){return !x.rr&&x.d<auj;}).sort(function(a,b){return String(b.d).localeCompare(String(a.d));});
  var avenir=EV.map(function(x){return {e:x,d:occ(x)};}).filter(function(x){return x.d&&x.d>=auj;}).sort(function(a,b){return String(a.d).localeCompare(String(b.d));});
  var PL=(db.plans||[]).filter(function(x){return x&&x.cid===c.id;});
  /* rénovations (œil 3D) liées à ce client — jamais celles d'un autre */
  var M3=(db.maq3d||[]).filter(function(x){return x&&x.cli&&cle(x.cli)===k&&x.d&&x.d.estimation;}).sort(function(a,b){return (b.at||0)-(a.at||0);});
  var ach=(db.achats||[]).filter(function(a){return a.cid===c.id&&a.type!=="devis";}).reduce(function(s,a){return s+achatHT(a);},0);
  var facQ={};F.forEach(function(f){if(f.qid)facQ[f.qid]=1;});
  var aFac=Q.filter(function(o){return /^(accepte|signe)$/.test(o.status||"")&&!facQ[o.id];});
  var du=F.filter(function(f){return f.num&&f.kind!=="avoir";}).reduce(function(s,f){try{return s+Math.max(0,faDue(f));}catch(x){return s;}},0);
  return {Q:Q,F:F,passe:passe,avenir:avenir,PL:PL,M3:M3,ach:ach,h:heures(c.id),aFac:aFac,du:du};}
function lQ(o){var tt=0;try{tt=totals(o).ttc;}catch(x){}return ml(T("Devis {0}",[o.num||""]).trim(),[o.date?dFR(o.date):"",T(ETDV[o.status||"brouillon"]||o.status||"")].filter(Boolean).join(" · "),E(tt)+" TTC","casoPont.voir('"+e(o.id)+"')");}
function lF(f){var tt=0;try{tt=faTot(f).ttc;}catch(x){}return ml(T("Facture {0}",[f.num||""]).trim(),[f.date?dFR(f.date):"",T(ETFA[etatFa(f)]||"")].filter(Boolean).join(" · "),E(tt)+" TTC",typeof faShow==="function"?"faShow('"+e(f.id)+"')":"");}
function lE(x,d){return ml(jour(d),[heure(x),x.title||"",x.adr||""].filter(Boolean).join(" · "),"",typeof agOpen==="function"?"agOpen('"+e(d)+"')":"");}
function lP(x){return ml(T("Plan {0}",[x.nom||""]).trim(),x.date?dFR(new Date(x.date).toISOString()):"","",typeof plOpen==="function"?"plOpen('"+e(x.id)+"','chat')":"");}
function lM(x){var es=x.d.estimation,n=(es.lignes||[]).length,mi=+es.total_min||0,ma=+es.total_max||0;return ml(T("Rénovation 3D"),[x.at?dFR(x.at):"",T("{0} postes",[n])].filter(Boolean).join(" · "),mi||ma?E(mi)+" – "+E(ma):"","");}
function lignesTravaux(Q){var L=[];Q.filter(function(o){return /^(accepte|signe|paye)$/.test(o.status||"");}).forEach(function(o){(o.lines||[]).forEach(function(l){if(l.label&&L.indexOf(l.label)<0)L.push(l.label);});});return L;}
function photos(c,D){var I=[];(Array.isArray(db.photosCh)?db.photosCh:[]).forEach(function(x){if(x&&x.cid===c.id&&/^data:image\//.test(x.th||""))I.push({src:x.th,clic:"casoPont.photoVoir('"+e(x.id)+"')"});});D.PL.forEach(function(x){if(x.th)I.push({src:x.th,clic:typeof plOpen==="function"?"plOpen('"+e(x.id)+"','chat')":""});});
  D.Q.forEach(function(o){var im=o.cv&&o.cv.imgs||{};Object.keys(im).forEach(function(k){if(/^data:image\//.test(im[k]||""))I.push({src:im[k],clic:"casoPont.voir('"+e(o.id)+"')"});});});
  return I.slice(0,12);}
function derniereModif(c){var k=cle(c.nom),L=jLit();for(var i=L.length-1;i>=0;i--){var o=L[i];if(o.ch.some(function(x){return cle(x.cl)===k||cle(x.n)===k;}))return T("Dernière modification : {0}",[quand(o.at)+(o.qui?" · "+o.qui:"")]);}return "";}
function fiche(t,c,mode,r){langue();TOUR.t=null;var D=donnees(c),h=[],tete='<p dir="auto"><b>'+e(T("Chantier {0}",[c.nom]))+'</b>'+(c.adr?'<br><span class="mut">'+e(c.adr)+'</span>':'')+'</p>';
  if(mode==="photos"){var I=photos(c,D);if(!I.length){bulle(t,p(T("Pas de photo pour {0}.",[c.nom])));return true;}
    bulle(t,tete+'<div style="display:flex;flex-wrap:wrap;gap:6px">'+I.map(function(x){return '<img src="'+e(x.src)+'" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:8px'+(x.clic?';cursor:pointer" onclick="'+x.clic:'')+'">';}).join("")+'</div>');return true;}
  if(mode==="docs"){h.push(bloc("Devis",D.Q.slice(0,6).map(lQ)),bloc("Factures",D.F.slice(0,6).map(lF)),bloc("Plans",D.PL.slice(0,6).map(lP)),bloc("Rénovations 3D",D.M3.slice(0,3).map(lM)));}
  else if(mode==="fait"){var RF=rapportsDe(c).filter(function(x){return !r||x.date>=r.a&&x.date<=r.b;}).slice(0,3);if(RF.length)h.push(bloc("Rapports d’intervention",RF.map(lR)));
    /* « la semaine dernière » : seulement les passages et les heures de cette période */
    var PS=r?D.passe.filter(function(x){return x.d>=r.a&&x.d<=r.b;}):D.passe,hr=r?heuresEntre(c.id,r):0;
    h.push(bloc("Travaux faits",lignesTravaux(D.Q).slice(0,8).map(function(l){return ml(l,"","","");})),bloc(r?"Passages":"Derniers passages",PS.slice(0,8).map(function(x){return lE(x,x.d);})));
    if(r&&hr)h.push('<p class="mut" dir="auto">'+e(T("Heures pointées : {0} h",[N(hr)]))+'</p>');
    if(r&&!PS.length&&!hr)h.push(p(T("Aucun passage sur cette période.")));
    if(D.h>=0.5)h.push(p(T("Heures pointées : {0} h",[N(D.h)])));if(D.F.length)h.push(bloc("Factures",D.F.slice(0,4).map(lF)));}
  else if(mode==="reste"){var RS=rapportsDe(c).filter(function(x){return x.r&&(x.r.suite||[]).length;}).slice(0,2);if(RS.length)h.push(bloc("Suite à prévoir",RS.map(function(x){return ml(x.r.suite.join(" ; "),jj(x.date),"","");})));
    h.push(bloc("Prochains rendez-vous",D.avenir.slice(0,3).map(function(x){return lE(x.e,x.d);})));
    if(D.aFac.length)h.push(bloc("Reste à facturer",D.aFac.map(lQ)));if(D.du>0.005)h.push(p(T("Reste dû : {0}",[E(D.du)])));}
  else{/* fiche complète, rapport */
    h.push(bloc("Prochains rendez-vous",D.avenir.slice(0,2).map(function(x){return lE(x.e,x.d);})),bloc("Derniers passages",D.passe.slice(0,2).map(function(x){return lE(x,x.d);})),
      bloc("Devis",D.Q.slice(0,4).map(lQ)),bloc("Factures",D.F.slice(0,4).map(lF)),bloc("Plans",D.PL.slice(0,4).map(lP)),bloc("Rénovations 3D",D.M3.slice(0,2).map(lM)),bloc("Rapports d’intervention",rapportsDe(c).slice(0,3).map(lR)));
    var ch=[];if(D.h>=0.5)ch.push(T("Heures pointées : {0} h",[N(D.h)]));if(D.ach>0.005)ch.push(T("Achats : {0} HT",[E(D.ach)]));
    if(D.aFac.length)ch.push(T("Reste à facturer : {0} HT",[E(D.aFac.reduce(function(s,o){try{return s+totals(o).ht;}catch(x){return s;}},0))]));
    if(D.du>0.005)ch.push(T("Reste dû : {0}",[E(D.du)]));var dm=derniereModif(c);if(dm)ch.push(dm);
    if(c.note)ch.push(c.note);h.push(ch.map(p).join(""));}
  var corps=h.filter(Boolean).join("");
  bulle(t,tete+(corps||p(T("Rien d’enregistré pour {0}.",[c.nom]))));return true;}
/* mots dits dans les 10 langues (phrase tapée, sans accents) ou dans sa traduction française */
function W(l){return new RegExp("(?:^|[^\\p{L}\\p{N}])(?:"+l+")(?![\\p{L}\\p{N}])","u");}
var SP=W("semaine prochaine|next week|semana que viene|proxima semana|semana proxima|semana que vem|prossima settimana|settimana prossima|saptamana viitoare|przyszlym tygodniu|przyszly tydzien|gelecek hafta\\p{L}*|следующеи неделе|следующая неделя|الاسبوع القادم|الاسبوع المقبل"),
 SD=W("semaine derniere|semaine passee|last week|semana pasada|semana passada|settimana scorsa|saptamana trecuta|zeszlym tygodniu|ostatnim tygodniu|gecen hafta\\p{L}*|прошлои неделе|прошлая неделя|الاسبوع الماضي"),
 CS=W("cette semaine|this week|esta semana|questa settimana|saptamana aceasta|saptamana asta|tym tygodniu|bu hafta\\p{L}*|этои неделе|эта неделя|هذا الاسبوع"),
 AD=W("apres demain|day after tomorrow|pasado manana|depois de amanha|dopodomani|poimaine|pojutrze|obur gun|послезавтра|بعد غد"),
 DE=W("demain|tomorrow|manana|amanha|domani|maine|jutro|yarin|завтра|غدا|الغد"),
 AH=W("avant hier|day before yesterday|anteayer|anteontem|l altro ieri|altroieri|alaltaieri|przedwczoraj|evvelsi gun|позавчера|اول امس"),
 HI=W("hier|yesterday|ayer|ontem|ieri|wczoraj|dun|вчера|امس|الامس"),
 AU=W("aujourd hui|today|hoy|hoje|oggi|azi|astazi|dzis|dzisiaj|bugun|сегодня|اليوم");
/* plages de dates dites dans la phrase (semaine prochaine…) */
function plage(s){if(typeof agWeekStart!=="function"||typeof agAdd!=="function")return null;var a=aujourdhui(),ws=agWeekStart(a);
  if(SP.test(s))return {a:agAdd(ws,7),b:agAdd(ws,13),k:"sp"};
  if(SD.test(s))return {a:agAdd(ws,-7),b:agAdd(ws,-1),k:"sd"};
  if(CS.test(s))return {a:ws,b:agAdd(ws,6),k:"cs"};
  if(AD.test(s))return {a:agAdd(a,2),b:agAdd(a,2),k:"ad"};
  if(AH.test(s))return {a:agAdd(a,-2),b:agAdd(a,-2),k:"ah"};
  if(DE.test(s))return {a:agAdd(a,1),b:agAdd(a,1),k:"de"};
  if(HI.test(s))return {a:agAdd(a,-1),b:agAdd(a,-1),k:"hi"};
  if(AU.test(s))return {a:a,b:a,k:"au"};return null;}
var TITRE={sp:"Chantiers de la semaine prochaine :",sd:"Chantiers de la semaine dernière :",cs:"Chantiers de cette semaine :",ad:"Chantiers d’après-demain :",de:"Chantiers de demain :",ah:"Chantiers d’avant-hier :",hi:"Chantiers d’hier :",au:"Chantiers d’aujourd’hui :"};
var AUCUN={sp:"Aucun chantier la semaine prochaine.",sd:"Aucun chantier la semaine dernière.",cs:"Aucun chantier cette semaine.",ad:"Aucun chantier après-demain.",de:"Aucun chantier demain.",ah:"Aucun chantier avant-hier.",hi:"Aucun chantier hier.",au:"Aucun chantier aujourd’hui."};
function evenements(r){var out=[];if(typeof agDayEvents!=="function")return out;for(var d=r.a;d<=r.b;d=agAdd(d,1))agDayEvents(d).forEach(function(x){if(x.t==="rdv")out.push({e:x,d:d});});return out;}
var PREVU=W("j ai quoi|quoi de prevu|qu est ce que j ai|qu est ce qu il y a|qu est ce qui est prevu|de prevu|mon programme|what do i have|what s on|what have i got|que tengo|o que tenho|cosa ho|che ho|ce am|co mam|neyim var|ne var|что у меня|ماذا لدي|ماذا عندي"),
 HRS=W("combien d heures|nombre d heures|heures pointees|heures faites|heures passees|how many hours|hours worked|cuantas horas|quantas horas|quante ore|cate ore|ile godzin|kac saat|сколько часов|كم ساعة"),
 RIEN={sp:"Rien de prévu la semaine prochaine.",sd:"Rien au planning la semaine dernière.",cs:"Rien de prévu cette semaine."};
var JOB=W("chantiers?|travaux|jobs?|sites?|obras?|cantier[ei]|lucrar\\p{L}*|santier\\p{L}*|budow\\p{L}*|prac\\p{L}*|isler\\p{L}*|isi|santiye\\p{L}*|объект\\p{L}*|работ\\p{L}*|ورش\\p{L}*|الورش\\p{L}*"),
 JOBS=W("chantiers|jobs|sites|obras|cantieri|lucrarile|lucrari|santiere|budowy|prace|isler\\p{L}*|объекты|работы|ورشات|الورشات"),
 FICHE=W("fiche|dossier|rapport|bilan|resume|recap\\p{L}*|etat|suivi|infos?|informations?|tout sur|report|summary|overview|informe|resumen|ficha|relatorio|resumo|rapporto|riepilogo|scheda|raport|fisa|rezumat|podsumowanie|rapor|ozet|отчет|сводк\\p{L}*|карточк\\p{L}*|تقرير|ملخص|ملف"),
 PHOTOS=W("photos?|images?|pictures?|pics|fotos?|fotografi\\p{L}*|imagini|poze|zdjeci\\p{L}*|fotograflar\\p{L}*|resimler\\p{L}*|фото\\p{L}*|صور|الصور"),
 DOCS=W("documents?|docs?|papiers|pieces jointes|fichiers?|files|paperwork|documentos|documenti|documente|dokumenty|belgeler\\p{L}*|evrak\\p{L}*|документ\\p{L}*|مستندات|وثائق|الوثائق"),
 FAIT=W("(?:qu est ce que|qu est ce qu|ce que|ce qu|quoi) (?:j ai|on a|nous avons|l equipe a|ils ont|il a) (?:fait|realise|termine)|j ai fait quoi|on a fait quoi|qu est ce qui a ete fait|travaux faits|what did (?:i|we) do|what have (?:i|we) done|what was done|que hice|que hicimos|que he hecho|o que fiz|o que fizemos|cosa ho fatto|che ho fatto|cosa abbiamo fatto|ce am facut|co zrobil\\p{L}*|ne yapt\\p{L}*|что (?:я|мы) сделал\\p{L}*|что сделано|ماذا فعلت|ماذا انجزت"),
 RESTE=W("reste a faire|reste a facturer|qu est ce qu il reste|ce qu il reste|il reste quoi|reste quoi|qu est ce qui reste|what s left|what is left|left to do|still to do|que queda|lo que falta|que falta|o que falta|cosa resta|cosa manca|ce a ramas|ce mai (?:e|este) de facut|co zostalo|ne kald\\p{L}*|что осталось|ماذا بقي|ما المتبقي|ما الباقي"),
 REPR=W("reprends?|reprenons|reprendre|retourne|retournons|continue|continuons|resume|pick up|go back to|retoma|retomar|retomemos|riprendi|riprendiamo|reia|reluam|wznow|wracamy|devam|kaldigimiz|продолж\\p{L}*|вернемся|استانف|نكمل|اكمل"),
 MONTRE=W("montre|affiche|liste|donne|quels?|quelles?|tous|toutes|j ai quoi|qu est ce que j ai|voir|ou sont|show|list|what|which|all|muestra|ensename|cuales|todas|mostra|mostrami|quali|tutti|arata|care|toate|pokaz|jakie|wszystkie|goster|hangi|tum|покажи|какие|все|ارني|اعرض|ما هي"),
 FINI=W("termine|terminee|fini|finie|acheve|commence|demarre|reporte|annule|decale|finished|done|started|cancelled|postponed|terminad[ao]|acabad[ao]|finito|terminato|gata|terminat|skonczon\\p{L}*|bitti|закончен\\p{L}*|انتهى|انتهت");
P.chantier=function(t){if(!P.ready||typeof db==="undefined")return false;var c=fr(t),s=" "+c.p+" "+nrm(t)+" ";if(ACT.test(c.p))return false;
  var r=plage(s),cl=client(t);
  /* « reprends le chantier de la semaine dernière » : le client du dernier chantier de cette période */
  if(r&&JOB.test(s)&&(REPR.test(s)||(/\ble chantier\b/.test(s)&&!JOBS.test(s)))&&!cl){var L=evenements(r).filter(function(x){return x.e.cid&&cliDe(x.e.cid);});
    if(!L.length){langue();bulle(t,p(T(AUCUN[r.k])));return true;}
    var dern=L[L.length-1],noms=[];L.forEach(function(x){var n=cliDe(x.e.cid).nom;if(noms.indexOf(n)<0)noms.push(n);});
    if(noms.length>1&&!/\bdernier\b/.test(s)){langue();bulle(t,p(T("Plusieurs chantiers : {0}. Lequel ?",[noms.join(", ")])));return true;}
    return fiche(t,cliDe(dern.e.cid),"fiche");}
  /* « montre-moi tous les chantiers de la semaine prochaine » */
  if(r&&(JOB.test(s)||/\binterventions?\b/.test(s))&&!cl&&(MONTRE.test(s)||JOBS.test(s))){langue();var V=evenements(r);
    if(!V.length){bulle(t,p(T(AUCUN[r.k])));return true;}
    bulle(t,p(T(TITRE[r.k]))+'<div class="msg-lines">'+V.slice(0,20).map(function(x){var n=x.e.cid&&cliDe(x.e.cid);return ml(jour(x.d)+(x.e.a?" · "+heure(x.e):""),[n?n.nom:"",x.e.title||"",x.e.adr||""].filter(Boolean).join(" · "),"",typeof agOpen==="function"?"agOpen('"+e(x.d)+"')":"");}).join("")+'</div>');return true;}
  /* « j'ai quoi cette semaine ? », « qu'est-ce que j'ai de prévu la semaine prochaine ? » : la liste, pas seulement l'écran */
  if(r&&!cl&&/^(sp|sd|cs)$/.test(r.k)&&PREVU.test(s)){langue();TOUR.t=null;var V2=evenements(r);
    if(!V2.length){bulle(t,p(T(RIEN[r.k])));return true;}
    bulle(t,'<div class="msg-lines">'+V2.slice(0,20).map(function(x){var n=x.e.cid&&cliDe(x.e.cid);return ml(jour(x.d)+(x.e.a?" · "+heure(x.e):""),[n?n.nom:"",x.e.title&&(!n||cle(x.e.title)!==cle(n.nom))?x.e.title:"",x.e.adr||""].filter(Boolean).join(" · "),"",typeof agOpen==="function"?"agOpen('"+e(x.d)+"')":"");}).join("")+'</div>');return true;}
  /* « combien d'heures chez Martin ? », « combien d'heures cette semaine ? » : les heures pointées */
  if(HRS.test(s)&&(cl||r)){langue();TOUR.t=null;var hh=r?heuresEntre(cl?cl.id:null,r):Math.round(heures(cl.id)*10)/10;
    bulle(t,p(cl?T("Heures pointées chez {0} : {1} h",[cl.nom,N(hh)]):T("Heures pointées : {0} h",[N(hh)])));return true;}
  if(/\d/.test(t))return false;
  /* « montre-moi Martin », « affiche Martin » : la fiche du chantier (pas « mettre à jour la fiche ») */
  if(cl&&MONTRE.test(s)&&!(" "+c.p+" ").replace(/\b(montre|montrez|affiche|voir|moi|m|le|la|les|l|du|de|d|chantier|client|fiche|dossier|chez|tout|sur|show|me|display)\b/g," ").split(" "+cle(cl.nom)+" ").join(" ").trim())return fiche(t,cl,"fiche");
  if(!cl&&/\bce (chantier|client)\b/.test(s)&&typeof q!=="undefined"&&q&&q.client)cl=cliNom(q.client);
  if(!cl)return false;
  if(PHOTOS.test(s))return fiche(t,cl,"photos");
  if(DOCS.test(s))return fiche(t,cl,"docs");
  if(FAIT.test(s))return fiche(t,cl,"fait",r);
  if(RESTE.test(s))return fiche(t,cl,"reste");
  if((FICHE.test(s)&&(JOB.test(s)||/\b(chez|client)\b/.test(s)||FICHE.test(" "+c.p+" "))||/\bchantiers? (de|chez|du) /.test(s))&&!FINI.test(s))return fiche(t,cl,"fiche");
  return false;};

/* ================= conflits de planning ================= */
/* « y a-t-il des conflits dans mon planning ? » : deux rendez-vous à la même heure, sur 30 jours (ou la période dite) */
var CONF=W("conflits?|chevauch\\p{L}*|en meme temps|a la meme heure|deux rendez vous|doublons?|overlap\\p{L}*|conflicts?|clash\\p{L}*|double booked|conflictos?|solap\\p{L}*|a la misma hora|conflitos?|sobrepo\\p{L}*|mesma hora|conflitti|sovrappo\\p{L}*|stessa ora|conflicte|conflict|suprapun\\p{L}*|aceeasi ora|konflikt\\p{L}*|nakladaj\\p{L}*|kolizj\\p{L}*|cakis\\p{L}*|ayni saat\\p{L}*|конфликт\\p{L}*|пересека\\p{L}*|накладк\\p{L}*|тоже время|تعارض|تداخل|نفس الوقت");
function mn(h){var m=String(h||"").match(/^(\d{1,2}):(\d{2})/);return m?+m[1]*60+ +m[2]:null;}
P.conflits=function(t){if(!P.ready||typeof db==="undefined"||typeof agDayEvents!=="function")return false;var c=fr(t),s=" "+c.p+" "+nrm(t)+" ";
  if(!CONF.test(s)||ACT.test(c.p))return false;langue();TOUR.t=null;
  var r=plage(s),a=r?r.a:aujourdhui(),b=r?r.b:agAdd(aujourdhui(),29),C=[];
  for(var d=a;d<=b;d=agAdd(d,1)){var L=agDayEvents(d).filter(function(x){return x.t==="rdv"&&mn(x.a)!=null;});
    for(var i=0;i<L.length;i++)for(var j=i+1;j<L.length;j++){var x=L[i],y=L[j],xa=mn(x.a),xb=mn(x.b)!=null?mn(x.b):xa+60,ya=mn(y.a),yb=mn(y.b)!=null?mn(y.b):ya+60;
      if(xa<yb&&ya<xb)C.push({d:d,x:x,y:y});}}
  var nom=function(ev){var n=ev.cid&&cliDe(ev.cid);return [heure(ev),n?n.nom:(ev.title||"")].filter(Boolean).join(" ");};
  if(!C.length){bulle(t,p(r?T("Aucun conflit sur cette période."):T("Aucun conflit dans ton planning sur les 30 prochains jours.")));return true;}
  bulle(t,p(T(C.length>1?"{0} conflits dans ton planning :":"1 conflit dans ton planning :",[C.length]))+'<div class="msg-lines">'+C.slice(0,12).map(function(k){return ml(jour(k.d),nom(k.x)+" / "+nom(k.y),"","agOpen('"+e(k.d)+"')");}).join("")+'</div>');return true;};

/* ================= branchement : avant les questions sur l'activité ================= */
(function brancher(n){if(typeof P.question!=="function"){if(n<120)setTimeout(function(){brancher(n+1);},500);return;}if(P.question.chantier)return;
  var q0=P.question;P.question=function(t){try{if(P.lexique(t)||P.historique(t)||P.conflits(t)||P.chantier(t))return true;}catch(x){if(window.console)console.error(x);}return q0.apply(this,arguments);};P.question.chantier=true;})(0);
})();

/* casô · chat plus malin (nov. 2026), branché sur casoPont :
   - plusieurs demandes dans une phrase (chatSend → chatMulti) ;
   - renvois : « le client d'hier », « la dame de la rue des Lilas » ;
   - devis depuis une description (« salle de bain 6 m², dépose carrelage, faïence, receveur ») ;
   - contrôle du devis : oublis, prix inhabituels, vente sous le prix d'achat ;
   - durée d'un travail d'après les anciens chantiers, et les jours libres ;
   - questions sur l'activité : fournisseur le moins cher, chantiers rentables, achats, meilleurs clients ;
   - apprentissage partagé : ce qu'un usager apprend au chat sert aux autres (rien n'est affiché, rien de personnel ne part). */
(function(){
"use strict";
var P=window.casoPont;if(!P)return;
function B(){return P.B;}
function hn(s){return CasoBrain.hn(String(s||""));}
function cle(n){return hn(n).replace(/^(m|mme|mlle|monsieur|madame|mr|mrs)\s+/,"").trim();}
function e(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function T(t,a){return P.tr(t,a);}
/* les réponses dans la langue de l'appli (comme casoPont.essaie) */
function langue(){try{B().setLangue((typeof I18N!=="undefined"&&I18N.lang)||"fr");}catch(x){}}
function E(x){return P.B.eurFr(Math.round(x*100)/100);}
function N(x){return P.B.fnumFr(Math.round(x*10)/10);}
function fr(t){try{return B().translate(t);}catch(x){return {p:hn(t),n:hn(t),lang:"fr"};}}
function bulle(t,h,o,brut){CHAT.m.push({who:"me",text:t});CHAT.m.push(Object.assign({who:"bot",html:brut?h:'<div data-noi18n>'+h+'</div>'},o||{}));chatSave();chatRender(true);}
function p(s){return '<p dir="auto">'+e(s)+'</p>';}
function mots(s){return hn(s).split(/[^\p{L}\p{N}]+/u).filter(function(w){return w.length>=3&&!VIDE.test(w);});}
var VIDE=/^(les|des|une|pour|avec|sur|dans|chez|par|que|qui|quoi|est|ton|ta|tes|mon|ma|mes|son|sa|ses|le|la|du|de|un|et|ou|au|aux|moins|plus|cher|chere|prix|fourniture|fournitures|pose|ml|m2|kg|sac|sacs|pot|pots|unite|pieces?)$/;
function proche(a,b){var A=mots(a),Bm=mots(b);if(!A.length||!Bm.length)return 0;var n=0;A.forEach(function(w){if(Bm.some(function(x){return x===w||w.length>=5&&x.length>=5&&(x.indexOf(w)===0||w.indexOf(x)===0);}))n++;});return n/Math.max(A.length,1);}
function ht(f){try{return faTot(f).ht;}catch(x){return 0;}}
function cliDe(id){return (db.clients||[]).filter(function(c){return c.id===id;})[0]||null;}
function cliNom(n){var k=cle(n);return (db.clients||[]).filter(function(c){return cle(c.nom)===k;})[0]||null;}

/* ---------- plusieurs demandes dans une phrase ---------- */
var POUR={fr:"pour",en:"for",es:"para",pt:"para",it:"per",ro:"pentru",pl:"dla",ru:"для"};
P.decoupe=function(t){if(!P.ready)return null;try{return B().decoupe(t);}catch(x){return null;}};
P.langue=function(t){return fr(t).lang||"fr";};
P.sujet=function(n){try{B().sujet(n);}catch(x){}};
P.clientDans=function(t){try{return B().clientDans(t);}catch(x){return null;}};
/* « rendez-vous mardi 9h » après « crée le client Dupont » : le rendez-vous est pour Dupont */
P.avecClient=function(t,nom,lg){try{if(!B().sansClient(t))return t;}catch(x){return t;}
  if(lg==="tr")return t+" "+nom+" için";if(lg==="ar")return t+" لـ"+nom;return t+" "+(POUR[lg]||"pour")+" "+nom;};
/* « non » après une action du chat : la phrase ne refera plus la même chose, la suivante lui apprend ce qui était voulu */
P.refuser=function(){try{var r=B().refuser();garder();return r;}catch(x){return false;}};
function garder(){try{P.garderIA&&P.garderIA();}catch(x){}}

/* ---------- renvois : le client d'hier, la dame de la rue des Lilas ---------- */
var QUI="(le |la |l |mon |ma |du |de la |de l |au |a la )?(?:client|cliente|dame|monsieur|madame|famille|gars|type|proprio|proprietaire|chantier|maison)";
var RE_JOUR=new RegExp("(?:^|\\s)"+QUI+"\\s+(?:d |de |du )?(avant hier|hier|ce matin|cet apres midi|aujourd hui|apres demain|demain|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)( dernier| prochain)?(?=\\s|$)");
var RE_RUE=new RegExp("(?:^|\\s)"+QUI+"\\s+(?:de la |du |de l |des |de |d |au |a la )?((?:rue|avenue|av|boulevard|bd|chemin|impasse|place|allee|route|quai|cours|lotissement|residence)\\s+(?:de la |du |de l |des |de |d )?[\\p{L}0-9]+(?: [\\p{L}0-9]+)?)","u");
var JOURS=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
function ymd(d){return d.getFullYear()+"-"+(d.getMonth()<9?"0":"")+(d.getMonth()+1)+"-"+(d.getDate()<10?"0":"")+d.getDate();}
function jourDe(w,suite){var d=new Date();d.setHours(12,0,0,0);var off={"avant hier":-2,"hier":-1,"ce matin":0,"cet apres midi":0,"aujourd hui":0,"demain":1,"apres demain":2}[w];
  if(off!=null){d.setDate(d.getDate()+off);return d;}var j=JOURS.indexOf(w);if(j<0)return null;var dd=(j-d.getDay()+7)%7;
  if(/prochain/.test(suite||""))d.setDate(d.getDate()+(dd||7));else d.setDate(d.getDate()-((d.getDay()-j+7)%7));return d;}
function clientsDuJour(d,quand){var s=ymd(d),ids=[];
  (db.events||[]).forEach(function(ev){if(ev.t!=="rdv"||ev.d!==s||!ev.cid)return;var a=String(ev.a||"08:00");if(quand==="ce matin"&&a>="12:00"||quand==="cet apres midi"&&a<"12:00")return;if(ids.indexOf(ev.cid)<0)ids.push(ev.cid);});
  var a0=new Date(s+"T00:00:00").getTime(),a1=a0+864e5;
  (db.pts||[]).forEach(function(x){if(x.ts<a0||x.ts>=a1)return;var ch=(db.chantiers||[]).filter(function(c){return c.id===x.c;})[0];if(ch&&ch.cid&&ids.indexOf(ch.cid)<0)ids.push(ch.cid);});
  return ids.map(cliDe).filter(Boolean);}
function clientsDeLaRue(rue){var W=mots(rue).filter(function(w){return !/^(rue|avenue|boulevard|chemin|impasse|place|allee|route|quai|cours|lotissement|residence)$/.test(w);}),T0=hn(rue).split(" ")[0];if(!W.length)return [];
  var ok=function(a){var h=" "+hn(a)+" ";return h.indexOf(" "+T0+" ")>=0&&W.every(function(w){return h.indexOf(" "+w+" ")>=0;});},L=[];
  (db.clients||[]).forEach(function(c){if(c.adr&&ok(c.adr))L.push(c);});
  (db.chantiers||[]).forEach(function(ch){if(ch.adr&&ok(ch.adr)){var c=cliDe(ch.cid);if(c&&L.indexOf(c)<0)L.push(c);}});return L;}
var ART={"du ":"de ","de la ":"de ","de l ":"de ","au ":"à ","a la ":"à "};
/* motif trouvé dans la phrase traduite → même passage dans la phrase tapée (accents, apostrophes, majuscules) */
function motifTape(m){var cls={a:"[aàâä]",e:"[eéèêë]",i:"[iîï]",o:"[oôö]",u:"[uùûü]",c:"[cç]",y:"[yÿ]"};
  return new RegExp(m.trim().split(" ").map(function(w){return w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/[aeiouyc]/g,function(ch){return cls[ch];});}).join("[\\s'’-]+"),"iu");}
var ATT=null;
P.renvoi=function(t){if(!P.ready||typeof db==="undefined")return null;
  /* réponse à « Lequel ? » : le nom choisi remplace le renvoi dans la demande de départ */
  if(ATT){var a=ATT;ATT=null;var k=cle(t).replace(/^(c est |plutot |)/,"");if(Date.now()-a.at<5*60000&&k.split(" ").length<=3){var ch=a.L.filter(function(x){return cle(x.nom)===k||cle(x.nom).split(" ").indexOf(k)>=0;})[0];if(ch)return a.ref(ch);}}
  var c=fr(t),s=" "+c.p+" ",m,qui=null;
  if((m=s.match(RE_JOUR))){var d=jourDe(m[2],m[3]),L=d?clientsDuJour(d,m[2]):[];if(L.length===1)qui=L[0];
    /* aucun client ou plusieurs ce jour-là : le chat le dit, au lieu de prendre « De Mardi » pour un nom */
    else if(d){langue();var jt=P.B.fdate(d),m0=m;if(L.length)ATT={at:Date.now(),L:L,ref:function(ch){return remplace(t,c,s,m0,ch);}};bulle(t,p(L.length?T("Le {0} : {1}. Lequel ?",[jt,L.map(function(x){return x.nom;}).join(", ")]):T("Aucun client au planning le {0}.",[jt])));return true;}}
  if(!qui&&(m=s.match(RE_RUE))){var L2=clientsDeLaRue(m[2]);if(L2.length===1)qui=L2[0];}
  if(!qui)return null;return remplace(t,c,s,m,qui);};
function remplace(t,c,s,m,qui){var rep=(ART[m[1]||""]||"")+qui.nom,brut=m[0].trim();
  if(c.lang==="fr"||!c.lang){var re=motifTape(brut),x=String(t).match(re);if(x)return String(t).replace(re,rep);}
  return s.replace(m[0]," "+rep).trim();}

/* ---------- contrôle du devis : oublis, prix inhabituels, vente à perte ---------- */
var AVEC=[[/\b(carrelage|faience|carreaux?|mosaique)\b/,[[/\bcolle\b/,"colle"],[/\bjoints?\b/,"joint"]]],
  [/\bparquet\b|\bstratifie\b/,[[/sous couche|sous-couche|isolant/,"sous-couche"],[/plinthes?/,"plinthes"]]],
  [/\b(placo|plaque de platre|ba13|ba 13|cloison|doublage)\b/,[[/\bbandes?\b/,"bandes"],[/\benduit\b/,"enduit"]]],
  [/\bpeinture\b/,[[/sous couche|sous-couche|impression/,"sous-couche"]]]];
var MATIERE=/\b(sacs?|pots?|rouleaux?|kg|litres?|boites?|paquets?)\b|\bfournitures?\b/;
var VU={};
function medianne(v){v=v.slice().sort(function(a,b){return a-b;});return v.length?v[Math.floor(v.length/2)]:null;}
P.verifier=function(o){langue();if(!o||!(o.lines||[]).length)return "";var L=o.lines.filter(function(l){return l.label;}),txt=L.map(function(l){return hn(l.label);}).join(" | "),out=[];
  /* fournitures oubliées : seulement si le devis détaille déjà ses fournitures */
  var detaille=L.some(function(l){return MATIERE.test(hn(l.label))||/^(sac|pot|rouleau|kg|l|litre|boite|paquet)$/.test(hn(l.unit));});
  if(detaille)AVEC.forEach(function(r){if(!r[0].test(txt))return;var m=r[1].filter(function(x){return !x[0].test(txt);}).map(function(x){return T(x[1]);});if(m.length)out.push({k:"oubli:"+m.join(","),t:T("pas de {0}",[m.join(T(" ni "))])});});
  if(/\b(depose|demolition|arrachage|casse)\b/.test(txt)&&!/\b(gravats?|evacuation|benne|decheterie|dechets?)\b/.test(txt))out.push({k:"gravats",t:T("pas d’évacuation des gravats")});
  /* prix bien plus bas que d'habitude, ou sous le prix d'achat */
  L.forEach(function(l){var pu=+l.pu;if(!pu||!l.label)return;var k=cle(l.label),u=l.unit||"";
    var vus=[];(db.quotes||[]).forEach(function(x){if(x.id===o.id)return;(x.lines||[]).forEach(function(y){if(cle(y.label)===k&&(y.unit||"")===u&&+y.pu>0)vus.push(+y.pu);});});
    var pr=(db.prices||[]).filter(function(x){return cle(x.nom)===k&&+x.prix>0;})[0],ref=vus.length>=2?medianne(vus):pr?+pr.prix:null;
    if(ref&&pu<ref*0.7)out.push({k:"bas:"+k+":"+pu,t:T("{0} à {1}, d’habitude {2}",[l.label,E(pu),E(ref)])});
    var ach=(db.hist||[]).filter(function(h){return cle(h.nom)===k&&+h.prix>0&&(!h.unit||!u||h.unit===u);}).sort(function(a,b){return String(b.date).localeCompare(String(a.date));})[0];
    if(ach&&pu<+ach.prix)out.push({k:"perte:"+k+":"+pu,t:T("{0} : vendu {1}, acheté {2}",[l.label,E(pu),E(+ach.prix)])});});
  var deja=VU[o.id]||(VU[o.id]={}),neuf=out.filter(function(x){return !deja[x.k];});neuf.forEach(function(x){deja[x.k]=1;});
  if(!neuf.length)return "";return '<p class="vn-w" dir="auto">'+e(T("À vérifier : {0}.",[neuf.map(function(x){return x.t;}).join(" · ")]))+'</p>';};

/* ---------- devis depuis une description ---------- */
var PIECES=/\b(salle de bains?|salle d eau|sdb|cuisine|chambre|salon|sejour|wc|toilettes|entree|couloir|bureau|buanderie|cellier|garage|piece)\b/;
var TRAV=[["mur",/\b(faience|peinture (des )?murs|papier peint|toile de verre|enduit|lambris|placo|plaque de platre|ba13|doublage|cloison|credence)\b/],
  ["sol",/\b(carrelage|parquet|stratifie|lino|vinyle|moquette|sol|chape|ragreage|(?:depose|enleve|retire|arrache) (?:du |le |la |les )?(?:carrelage|sol|parquet|moquette)|isolation (du )?sol|plancher)\b/],
  ["plafond",/\b(plafond|faux plafond)\b/],["peinture",/\bpeinture\b/],["perim",/\b(plinthes?|corniches?|baguettes?|joint silicone)\b/],
  ["u",/\b(receveur|douche|baignoire|wc|lavabo|vasque|meuble|robinet|robinetterie|mitigeur|porte|fenetre|radiateur|prises?|interrupteurs?|spots?|luminaires?|seche serviettes?|vmc|chauffe eau|ballon|evier|plan de travail|hotte|colonne de douche|paroi)\b/],
  ["forfait",/\b(evacuation|gravats|nettoyage|deplacement|protection|benne)\b/]];
function genre(l){for(var i=0;i<TRAV.length;i++)if(TRAV[i][1].test(l))return TRAV[i][0];return null;}
function piece(nom){var M=null;try{var L=(db.maq3d||[]).filter(function(x){return x&&x.d&&x.d.projet&&x.d.projet.rooms&&x.d.projet.scale;}).sort(function(a,b){return (b.at||0)-(a.at||0);});
  for(var i=0;i<L.length&&!M;i++){var pj=L[i].d.projet,sc=+pj.scale,H=+(pj.params&&pj.params.H)||2.5;(pj.rooms||[]).forEach(function(r){if(!M&&r.name&&nom&&hn(r.name).indexOf(nom)>=0&&r.areaPx)M={a:r.areaPx*sc*sc,per:(r.perimPx||0)*sc,h:H,src:"maq",nom:r.name};});}}catch(x){}return M;}
P.decrire=function(t){langue();if(!P.ready||typeof db==="undefined"||typeof q==="undefined")return false;var c=fr(t),s=c.p;
  if(B().isQuestion&&B().isQuestion(t))return false;
  var surf=s.match(/(\d+(?:\.\d+)?)\s*(?:m2|m²|metres? carres?)/g)||[];if(surf.length!==1)return false;
  var A=parseFloat(surf[0]),pc=s.match(PIECES),items=[],autreQte=false,perdu=false;
  /* chaque morceau de la phrase tapée (virgules, « et », « avec », « + »), traduit en français */
  String(t).split(/\s*(?:[,;+]|\s(?:et|puis|avec|plus|and|y|e|și|i|ve|и|و|with|con|com|cu|z|ile|с)\s)\s*/i).forEach(function(b0){var b=fr(b0).p,aSurf=/(\d+(?:\.\d+)?)\s*(?:m2|m²|metres? carres?)/.test(b);
    if(!aSurf&&/\d+(?:\.\d+)?\s*(?:m2|m²|m3|ml|m|h|heures?|kg|l|sacs?|pots?|jours?)\b/.test(b))autreQte=true;
    var x=b.replace(/(\d+(?:\.\d+)?)\s*(?:m2|m²|metres? carres?)/," ").replace(PIECES," ").replace(/\b(devis|pour|chez|une?|la|le|les|de|du|des|d|l|a|faire|refaire|fais|prevoir|mettre|mets|met|ajoute|rajoute|installe|installer|remplace|remplacer|change|changer|pose de|pose|poser|nouveau|nouvelle|neuf|neuve|complete?|total|totale|salle|bain|bains)\b/g," ").replace(/\s+/g," ").trim();
    var g=genre(" "+b+" ");if(!x)return;if(!g){if(!aSurf&&!PIECES.test(" "+b+" ")&&!/^(?:pour|chez)\s/.test(b))perdu=true;return;}var nb=x.match(/^(\d+)\s+/);if(/\d/.test(x.replace(/^\d+\s+/,""))&&g!=="u"){perdu=true;return;}
    var lab=x.replace(/^\d+\s+/,"");
    /* libellé en français tel qu'il est tapé (accents) quand la phrase est en français */
    if((fr(t).lang||"fr")==="fr"){var r0=String(b0).replace(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|mètres? carrés?|metres? carres?)/i," ").replace(/^\s*(?:\d+\s+)?(?:(?:la|le|les|l['’]|une?|des?|du|d['’])\s*)*(?:pose\s+(?:de\s+|d['’])?|poser\s+)?/i,"").replace(/\s+/g," ").trim();if(r0&&hn(r0)===lab)lab=r0;}
    items.push({lab:lab,g:g,n:nb?+nb[1]:1});});
  if(autreQte||perdu)return false;
  if(items.length<2||!pc&&items.length<3)return false;
  /* mesures : la pièce de la maquette, sinon une pièce carrée de cette surface (2,50 m sous plafond) */
  var mq=piece(pc?pc[1]:null),aire=A,per=mq&&mq.per?mq.per:4*Math.sqrt(A),H=mq?mq.h:2.5,murs=Math.max(0,per*H-1.6);if(mq&&Math.abs(mq.a-A)/A>0.25)mq=null;
  if(!mq){per=4*Math.sqrt(A);H=2.5;murs=Math.max(0,per*H-1.6);}
  var before=JSON.stringify(q),out=[],cl=P.clientDans(t);
  if(cl&&cliNom(cl)){q.client=cliNom(cl).nom;}
  q.lines=q.lines.filter(function(l){return l.label||l.pu;});
  var nouv=[];items.forEach(function(it){var qte,un;if(it.g==="mur"){qte=murs;un="m²";}else if(it.g==="sol"||it.g==="plafond"){qte=aire;un="m²";}else if(it.g==="peinture"){qte=murs+aire;un="m²";}else if(it.g==="perim"){qte=per-0.8;un="ml";}else if(it.g==="forfait"){qte=1;un="forfait";}else{qte=it.n;un="u";}
    var pr=null,bs=0,dep=/\b(depose|demolition|arrachage|enleve|retire|arrache)\b/;(db.prices||[]).forEach(function(x){if(dep.test(hn(it.lab))!==dep.test(hn(x.nom)))return;var v=Math.min(proche(it.lab,x.nom),proche(x.nom,it.lab)+0.5);if(v>bs){bs=v;pr=x;}});if(bs<0.5)pr=null;
    if(pr&&pr.unit&&pr.unit!==un&&!(un==="u"&&/^(u|forfait)$/.test(pr.unit))&&!(un==="forfait"&&pr.unit==="u"))pr=null;
    var lab=pr?pr.nom:it.lab.charAt(0).toUpperCase()+it.lab.slice(1);qte=Math.round(qte*10)/10;
    var l={label:lab,qty:qte,unit:pr&&pr.unit?pr.unit:un,pu:pr?nombre(pr.prix):null,tva:pr&&pr.tva!=null?pr.tva:10};q.lines.push(l);nouv.push(l);});
  fillForm();store();var tt=totals(q);
  /* même bulle que les lignes dictées : les textes fixes sont traduits par casô, le reste ne bouge pas */
  out.push('<div class="msg-lines">'+nouv.map(function(l){return '<div class="ml"><div><b data-noi18n lang="fr">'+e(l.label)+'</b><div class="mut" data-noi18n>'+e(N(l.qty)+" "+l.unit)+(l.pu?' × '+e(E(l.pu)):'')+'</div>'+(l.pu?'':'<div class="vn-w">Pas dans tes prix : prix à remplir</div>')+'</div><b data-noi18n>'+(l.pu?e(E(l.qty*l.pu)):'')+'</b></div>';}).join("")+'</div>');
  out.push('<p class="mut" dir="auto" data-noi18n>'+e(mq?T("Mesures de la maquette ({0}).",[mq.nom]):T("Murs et plinthes estimés pour une pièce carrée de {0} m².",[N(A)]))+'</p>');
  var vf=P.verifier(q);if(vf)out.push(vf.replace("<p ","<p data-noi18n "));
  out.push('<div class="msg-tot"><span>Total du devis</span><b data-noi18n>'+e(E(tt.ttc))+' TTC</b></div><div class="msg-act"><button class="btn sm sec" onclick="go(\'edit\')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>');
  bulle(t,out.join(""),{undo:before},true);return true;};
function nombre(v){if(v===""||v==null)return null;var x=+String(v).replace(",",".");return isNaN(x)?null:x;}

/* ---------- durée d'un travail, d'après les anciens chantiers ---------- */
var DUREE=/^(?:et |mais |alors )?(?:en )?(?:combien de temps|combien d heures|combien de jours|il (?:me |te )?faut combien(?: de temps| d heures| de jours)?|ca (?:me )?prend combien(?: de temps)?|quel temps)\b/;
function heuresChantier(cid){var h=0;try{var C=(db.chantiers||[]).filter(function(c){return c.cid===cid;}).map(function(c){return c.id;});sessions().forEach(function(x){if(x.a&&x.b&&C.indexOf(x.c)>=0)h+=(x.b-x.a)/36e5;});}catch(x){}return h;}
function joursLibres(n){if(typeof agGaps!=="function"||typeof agToday!=="function")return null;var d=agToday(),run=[],dp=typeof agHours==="function"&&agHours();
  for(var i=1;i<=45&&run.length<n;i++){var j=agAdd(d,i),wd=new Date(j+"T12:00:00").getDay();if(!dp&&(wd===0||wd===6)){run=[];continue;}
    var g=agGaps(j,60),lib=g.reduce(function(s,x){return s+(x[1]-x[0]);},0);if(lib>=360)run.push(j);else run=[];}
  return run.length===n?run:null;}
P.duree=function(t){langue();if(!P.ready||typeof db==="undefined")return false;var c=fr(t),s=c.p;if(!DUREE.test(s))return false;
  if(/^\s*(ajoute|rajoute|mets|met|enleve|retire|change|modifie|note|cale|prends|rdv|rendez vous)\b/.test(s))return false;
  var m=s.match(/(\d+(?:\.\d+)?)\s*(m2|m²|ml|metres? lineaires?|m|u|pieces?)?\s*(?:de |d )?([\p{L} ]{3,40})/u);if(!m)return false;
  var Q=parseFloat(m[1]),un=/^m2|m²$/.test(m[2]||"")?"m²":/^ml|lineaire/.test(m[2]||"")?"ml":(m[2]?"u":"m²"),lab=m[3].replace(/\b(de|du|des|la|le|les|pour|sur|en|a|au|of|the)\b/g," ").replace(/\s+/g," ").trim();if(!lab)return false;
  /* chaque ancien devis où ce travail est le poste principal : heures du devis (lignes en h), sinon heures pointées sur ses chantiers */
  var R=[];(db.quotes||[]).forEach(function(o){var L=(o.lines||[]).filter(function(l){return +l.qty>0;}),w=L.filter(function(l){var u=String(l.unit||"").replace(/^m2$/,"m²");return u!=="h"&&(!un||u===un||un==="u"&&!/^(m²|ml)$/.test(u))&&proche(lab,l.label)>=0.5;})[0];if(!w)return;
    var autres=L.filter(function(l){return l!==w&&(l.unit||"")!=="h";}),val=function(l){return (+l.qty||0)*(+l.pu||0);};if(autres.some(function(l){return val(l)>val(w)&&!MATIERE.test(hn(l.label));}))return;
    var h=L.filter(function(l){return l.unit==="h";}).reduce(function(s2,l){return s2+(+l.qty||0);},0);if(!h){var cx=cliNom(o.client);if(cx)h=heuresChantier(cx.id);}
    if(h>0)R.push(h/(+w.qty));});
  if(!R.length){bulle(t,p(T("Je n’ai pas encore de chantier avec des heures pour estimer « {0} ».",[lab])));return true;}
  var hh=Math.round(medianne(R)*Q*2)/2,jj=Math.max(1,Math.ceil(hh/7)),txt=[T("Environ {0} h de travail ({1} j), d’après tes anciens chantiers.",[N(hh),jj])],lib=joursLibres(jj);
  if(lib)txt.push(T("Libre à partir du {0}.",[P.B.fdate(new Date(lib[0]+"T12:00:00"))]));
  bulle(t,txt.map(p).join(""));return true;};

/* ---------- devis de la rénovation : l'estimation de la Rénovation (postes cochés, quantités de la maquette) devient un devis,
   avec les prix de « Mes services » quand ils correspondent, sinon le milieu de la fourchette indicative (TTC → HT, TVA 10 %) ---------- */
var RENO=/\b(devis|chiffre|chiffrer|chiffrage)\b.*\b(renovation|reno|estimation|maquette|piece photographiee)\b|\b(estimation|renovation)\b.*\ben devis\b|\b(mets|met|ajoute|rajoute|passe|reporte)\b.*\b(renovation|estimation|maquette|photo|fissures?|anomalies?|travaux de la photo)\b.*\bdevis\b/;
P.renoDevis=function(t){if(!P.ready||typeof db==="undefined"||typeof q==="undefined")return false;var c=fr(t),s=c.p;if(!RENO.test(s)||/^\s*(combien|quel|quelle|ou)\b/.test(s))return false;langue();
  var M=(db.maq3d||[]).filter(function(x){return x&&x.d&&x.d.estimation&&(x.d.estimation.lignes||[]).length;}).sort(function(a,b){return (b.at||0)-(a.at||0);})[0];
  if(!M){bulle(t,p(T("Aucune rénovation enregistrée.")));return true;}
  /* « … sur le devis de Martin » : le devis en cours de Martin s'il en a un (brouillon), sinon un nouveau devis */
  var before=JSON.stringify(q),cl=P.clientDans(t),nc=cl&&cliNom(cl)?cliNom(cl).nom:null,brouil=function(o){return o&&(!o.status||o.status==="brouillon");},cib=null;
  if(nc&&!(q.client===nc&&brouil(q)))cib=(db.quotes||[]).filter(function(o){return brouil(o)&&o.client===nc;}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""));})[0];
  if(cib)q=JSON.parse(JSON.stringify(cib));else if(!(nc&&q.client===nc&&brouil(q))&&(q.lines||[]).some(function(l){return l.label||l.pu;})){if(typeof newQuote==="function")newQuote();}
  if(nc)q.client=nc;
  var ind=[],nouv=[];M.d.estimation.lignes.forEach(function(r){if(!r||!r.poste)return;var pr=null,bs=0;(db.prices||[]).forEach(function(x){var v=Math.min(proche(r.poste,x.nom),proche(x.nom,r.poste)+0.5);if(v>bs){bs=v;pr=x;}});
    var u=String(r.unite||"u").replace(/^m2$/,"m²");if(bs<0.5||pr&&pr.unit&&String(pr.unit).replace(/^m2$/,"m²")!==u)pr=null;
    var pu=pr?nombre(pr.prix):Math.round(((+r.prix_min||0)+(+r.prix_max||+r.prix_min||0))/2/1.1*100)/100;if(!pr)ind.push(r.poste);
    var l={label:pr?pr.nom:r.poste,qty:Math.round((+r.quantite||1)*10)/10,unit:pr&&pr.unit?pr.unit:u,pu:pu||null,tva:pr&&pr.tva!=null?pr.tva:10};q.lines.push(l);nouv.push(l);});
  if(!nouv.length){bulle(t,p(T("Aucune rénovation enregistrée.")));return true;}
  q.lines=q.lines.filter(function(l){return l.label||l.pu;});fillForm();store();CHAT.qid=q.id;var tt=totals(q),out=[];
  out.push('<div class="msg-lines">'+nouv.map(function(l){return '<div class="ml"><div><b data-noi18n>'+e(l.label)+'</b><div class="mut" data-noi18n>'+e(N(l.qty)+" "+l.unit)+(l.pu?' × '+e(E(l.pu)):'')+'</div></div><b data-noi18n>'+(l.pu?e(E(l.qty*l.pu)):'')+'</b></div>';}).join("")+'</div>');
  if(ind.length)out.push('<p class="mut" dir="auto" data-noi18n>'+e(T("Prix indicatifs pour : {0}.",[ind.join(", ")]))+'</p>');
  var vf=P.verifier(q);if(vf)out.push(vf.replace("<p ","<p data-noi18n "));
  out.push('<div class="msg-tot"><span>Total du devis</span><b data-noi18n>'+e(E(tt.ttc))+' TTC</b></div><div class="msg-act"><button class="btn sm sec" onclick="go(\'edit\')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>');
  bulle(t,out.join(""),{undo:before},true);return true;};

/* ---------- marge sur le devis : « ajoute une marge de 10 % », « 15 % de marge sur la fourniture » ---------- */
var MARGE=/^(?:ajoute|rajoute|mets|met|applique|prends|fais)?\s*(?:une |un |ma |la |de la )?(?:marge (?:de )?(\d+(?:\.\d+)?) ?(?:%|pour ?cent)|(\d+(?:\.\d+)?) ?(?:%|pour ?cent) de marge)(?: sur (?:le devis|tout|tout le devis|(la |les )?(fournitures?|materiaux|materiel|main d oeuvre|pose)))?$/;
P.marge=function(t){if(!P.ready||typeof q==="undefined")return false;var s=fr(t).p.trim(),m=s.match(MARGE);if(!m)return false;langue();
  var x=parseFloat(m[1]||m[2]),cible=m[4]||"";if(!(x>0&&x<=300))return false;
  var L=(q.lines||[]).filter(function(l){if(!(+l.pu>0)||!l.label)return false;var lab=hn(l.label),u=hn(l.unit);
    if(/fourniture|materia/.test(cible))return MATIERE.test(lab)||/^(sac|pot|rouleau|kg|l|boite|paquet)$/.test(u)||(db.hist||[]).some(function(h){return cle(h.nom)===cle(l.label);});
    if(/main|pose/.test(cible))return u==="h"||/main d|pose/.test(lab);return true;});
  if(!L.length){bulle(t,p(T("Le devis n’a pas encore de lignes.")));return true;}
  var before=JSON.stringify(q);L.forEach(function(l){l.pu=Math.round(+l.pu*(1+x/100)*100)/100;});fillForm();store();
  bulle(t,'<div data-noi18n>'+p(T("Marge de {0} % ajoutée sur {1} ligne(s).",[N(x),L.length]))+'</div><div class="msg-tot"><span>Total du devis</span><b data-noi18n>'+e(E(totals(q).ttc))+' TTC</b></div>',{undo:before},true);return true;};

/* ---------- questions sur l'activité ---------- */
var MOINS_CHER=/\b(moins cher|meilleur prix|prix le plus bas|plus bas prix|cheaper|cheapest)\b/;
var RENTABLE=/\b(plus rentables?|rapporte le plus|meilleure marge|plus de marge|rentabilite|quelle marge|combien de marge|combien j ai gagne|combien m a rapporte|ca m a rapporte|benefices?|marge (?:du|de|chez|sur)|gagne combien)\b/;
/* coût d'une heure de travail (salaire et charges), pour le vrai bénéfice d'un chantier : demandé une fois dans le chat */
var COUTH=/\b(?:mon heure|une heure de travail|cout horaire|cout de l heure|heure de travail)\b.*?(\d+(?:[.,]\d+)?)\s*(?:€|euros?|eur)?/;
function cliTexte(t){var h=" "+cle(t)+" ",best=null;(db.clients||[]).forEach(function(c){var n=cle(c.nom||"");if(n.length>=2&&h.indexOf(" "+n+" ")>=0&&(!best||n.length>cle(best).length))best=c.nom;});return best;}
function coutH(){var v=db.prof&&+db.prof.coutH;return v>0?v:0;}
var MOISN=["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];
function periode(s){var d=new Date(),m;if(/\bce mois\b/.test(s))return {a:new Date(d.getFullYear(),d.getMonth(),1),b:new Date(d.getFullYear(),d.getMonth()+1,1),t:T(" ce mois-ci")};
  if(/\bcette annee\b/.test(s))return {a:new Date(d.getFullYear(),0,1),b:new Date(d.getFullYear()+1,0,1),t:T(" cette année")};
  for(var i=0;i<12;i++)if(new RegExp("\\b(en |au mois de |de )?"+MOISN[i]+"\\b").test(s)){var y=i>d.getMonth()?d.getFullYear()-1:d.getFullYear();return {a:new Date(y,i,1),b:new Date(y,i+1,1),t:" "+T("en {0}",[moisNom(i)])};}return null;}
var LOCS={fr:"fr-FR",en:"en-GB",es:"es-ES",pt:"pt-PT",it:"it-IT",ro:"ro-RO",pl:"pl-PL",tr:"tr-TR",ru:"ru-RU",ar:"ar"};
function moisNom(i){var l=(typeof I18N!=="undefined"&&I18N.lang)||"fr";try{return new Intl.DateTimeFormat(LOCS[l]||"fr-FR",{month:"long"}).format(new Date(2026,i,15));}catch(x){return MOISN[i];}}
function dans(per,dt){if(!per)return true;var x=Date.parse(dt);return x>=per.a.getTime()&&x<per.b.getTime();}
function achatHT(a){return a.ht!=null&&a.ht!==""?+a.ht:(+a.ttc||0)/1.2;}
function parClient(){var M={};function m(id,nom){var k=id||cle(nom);return M[k]||(M[k]={nom:nom,id:id,ca:0,ach:0,h:0});}
  var fact={};(db.invoices||[]).forEach(function(f){if(!f.num||f.kind==="avoir"||!f.client||!f.client.nom)return;var c=cliNom(f.client.nom);m(c?c.id:null,c?c.nom:f.client.nom).ca+=ht(f);fact[cle(f.client.nom)]=1;});
  (db.quotes||[]).forEach(function(o){if(!o.client||fact[cle(o.client)]||!/^(accepte|paye)$/.test(o.status||""))return;var c=cliNom(o.client);m(c?c.id:null,c?c.nom:o.client).ca+=totals(o).ht;});
  (db.achats||[]).forEach(function(a){if(!a.cid||a.type==="devis")return;var c=cliDe(a.cid);if(c)m(c.id,c.nom).ach+=achatHT(a);});
  Object.keys(M).forEach(function(k){var x=M[k];if(x.id)x.h=heuresChantier(x.id);x.marge=x.ca-x.ach;});return Object.keys(M).map(function(k){return M[k];}).filter(function(x){return x.ca>0;});}
function ligneMarge(x){var ch=coutH();if(ch&&x.h>=0.5){var bn=x.ca-x.ach-x.h*ch;return T("{0} : {1} HT, {2} d’achats, {3} h à {4} : bénéfice {5} ({6} %)",[x.nom,E(x.ca),E(x.ach),N(x.h),E(ch),E(bn),Math.round(bn/x.ca*100)]);}
  var s=T("{0} : {1} HT, {2} d’achats, marge {3}",[x.nom,E(x.ca),E(x.ach),E(x.marge)]);if(x.h>=1)s+=T(" · {0} h ({1}/h)",[N(x.h),E(x.marge/x.h)]);return s;}
var ATTCH=false;function demanderCH(M){if(coutH()||ATTCH||!M.some(function(x){return x.h>=0.5;}))return "";ATTCH=true;return p(T("Combien te coûte une heure de travail (salaire et charges) ? Je l’enlève de la marge."));}
function poserCH(v){db.prof=db.prof||{};db.prof.coutH=v;try{save();}catch(x){}ATTCH=false;}
P.question=function(t){langue();if(!P.ready||typeof db==="undefined")return false;var c=fr(t),s=" "+c.p+" ";
  /* une demande d'action (« ajoute une marge de 10 % », « mets le prix le moins cher ») n'est pas une question sur l'activité */
  if(/^\s*(ajoute|rajoute|mets|met|applique|enleve|retire|change|modifie|fais|cree|envoie|supprime|note|retiens)\b/.test(s)||/%/.test(s))return false;
  /* raisons des devis refusés */
  if(/\b(pourquoi|raisons?)\b.*\b(refus\w*|perd\w*|rate\w*)\b/.test(s)){var Rq=(db.quotes||[]).filter(function(o){return o&&o.status==="refuse";}),cnt={prix:0,delai:0,autre:0};Rq.forEach(function(o){if(cnt[o.refus]!=null)cnt[o.refus]++;});
    var parts=[];if(cnt.prix)parts.push(T("{0} pour le prix",[cnt.prix]));if(cnt.delai)parts.push(T("{0} pour le délai",[cnt.delai]));if(cnt.autre)parts.push(T("{0} pour une autre raison",[cnt.autre]));
    bulle(t,p(parts.length?T("Devis refusés : {0}.",[parts.join(", ")]):T("Aucune raison de refus notée.")));return true;}
  /* fournisseur le moins cher pour un produit */
  if(MOINS_CHER.test(s)){
    var H=(db.hist||[]).filter(function(h){return h.four&&+h.prix>0;}),HW=H.map(function(h){return mots(h.nom);});
    /* le produit : les mots de la question qu'on retrouve dans les achats (« ba13 », « faïence »…) */
    var pw=mots(s.replace(MOINS_CHER," ")).filter(function(w){return HW.some(function(L){return L.indexOf(w)>=0;});});
    if(!pw.length){if(!/\b(ou|qui|quel|quelle|chez|fournisseur|acheter|achete)\b/.test(s))return false;var pr0=mots(s.replace(MOINS_CHER," ").replace(/\b(ou|qui|quel|quelle|chez|fournisseurs?|acheter|achete|trouver|prendre|meilleur)\b/g," ")).join(" ");if(!pr0)return false;bulle(t,p(T("Je n’ai pas d’achat de « {0} » chez tes fournisseurs.",[pr0])));return true;}
    var prod=pw.join(" "),best={};H.forEach(function(h,i){if(!pw.every(function(w){return HW[i].indexOf(w)>=0;}))return;var k=cle(h.four),o=best[k];if(!o||String(h.date)>String(o.date))best[k]={four:h.four,prix:+h.prix,unit:h.unit,date:h.date};});
    var L=Object.keys(best).map(function(k){return best[k];}).sort(function(a,b){return a.prix-b.prix;});
    bulle(t,p(T("Le moins cher pour « {0} » : {1}.",[prod,L.slice(0,4).map(function(x){return x.four+" "+E(x.prix)+(x.unit&&x.unit!=="u"?" / "+x.unit:"")+(x.date?" ("+String(x.date).slice(8,10)+"/"+String(x.date).slice(5,7)+")":"");}).join(" · ")])));return true;}
  /* chantiers rentables, marge d'un client */
  /* coût de l'heure : réponse à la question, ou dit directement (« mon heure me coûte 28 € ») */
  {var mh=s.match(COUTH)||(ATTCH&&s.match(/^\s*(\d+(?:[.,]\d+)?)\s*(?:€|euros?|eur)?(?:\s*(?:de l heure|l heure|par heure|\/h))?\s*$/));
   if(mh){var vh=parseFloat(String(mh[1]).replace(",","."));if(vh>0&&vh<500){poserCH(vh);bulle(t,p(T("Heure de travail : {0}. C’est noté.",[E(vh)])));return true;}}}
  if(RENTABLE.test(s)&&(/\b(chantiers?|clients?|travaux|chez|sur|job|avec)\b/.test(s)||P.clientDans(t))){var M=parClient(),qui=P.clientDans(t)||cliTexte(t),k=qui?cle(qui):null;
    if(k){var x=M.filter(function(y){return cle(y.nom)===k;})[0];bulle(t,p(x?ligneMarge(x):T("Rien de facturé pour {0}.",[qui]))+(x?demanderCH([x]):""));return true;}
    if(!M.length){bulle(t,p(T("Pas encore de chantier facturé.")));return true;}
    var ch0=coutH();M.forEach(function(y){y.bn=ch0?y.ca-y.ach-y.h*ch0:y.marge;});
    M.sort(function(a,b){if(ch0)return b.bn-a.bn;var ra=a.h>=1?a.marge/a.h:null,rb=b.h>=1?b.marge/b.h:null;return ra!=null&&rb!=null?rb-ra:b.marge-a.marge;});
    bulle(t,p(T("Les plus rentables :"))+M.slice(0,3).map(function(y){return p(ligneMarge(y));}).join("")+demanderCH(M));return true;}
  /* achats chez un fournisseur */
  if(/\bcombien\b/.test(s)&&/\b(depense|achete|paye|claque|lache)\b/.test(s)&&/\bchez\b/.test(s)){var per=periode(s),fo=(db.suppliers||[]).filter(function(f){return f.nom&&(" "+s+" ").indexOf(" "+cle(f.nom)+" ")>=0;})[0];if(!fo)return false;
    var tot=(db.achats||[]).filter(function(a){return a.type!=="devis"&&cle(a.four)===cle(fo.nom)&&dans(per,a.date);}).reduce(function(s2,a){return s2+(+a.ttc||0);},0);
    bulle(t,p(T("Achats chez {0}{1} : {2} TTC.",[fo.nom,per?per.t:"",E(tot)])));return true;}
  /* meilleurs clients */
  if(/\b(meilleurs? clients?|plus gros clients?|clients? qui (me )?rapporte(nt)? le plus|top clients?)\b/.test(s)){var M2=parClient().sort(function(a,b){return b.ca-a.ca;});
    if(!M2.length){bulle(t,p(T("Pas encore de chantier facturé.")));return true;}
    bulle(t,p(T("Tes meilleurs clients :"))+M2.slice(0,3).map(function(y){return p(y.nom+" : "+E(y.ca)+" HT");}).join(""));return true;}
  return false;};

/* ---------- apprentissage partagé (aucun affichage, rien de personnel) ---------- */
var URL0=(window.CASO_APPRIS||"https://api.caso.fr")+"/api/appris",AK="caso_ia_partage";
function etat(){try{return JSON.parse(localStorage.getItem(AK)||"null")||{};}catch(x){return {};}}
function etatSet(o){try{localStorage.setItem(AK,JSON.stringify(o));}catch(x){}}
function idAppareil(o){if(!o.id){var a=new Uint8Array(16);(window.crypto||{}).getRandomValues?crypto.getRandomValues(a):a.forEach(function(v,i){a[i]=Math.random()*256|0;});o.id=Array.prototype.map.call(a,function(b){return (b<16?"0":"")+b.toString(16);}).join("");}return o.id;}
function envoyer(){if(!P.ready||!navigator.onLine)return;var o=etat(),L;try{L=B().partageables(o.env||{});}catch(x){return;}if(!L.length)return;
  var lot=L.slice(0,20),id=idAppareil(o);etatSet(o);
  fetch(URL0,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:id,e:lot})}).then(function(r){if(!r.ok)return;var x=etat();x.env=x.env||{};lot.forEach(function(y){x.env[y.l+"|"+y.m]=1;});etatSet(x);}).catch(function(){});}
function recevoir(){if(!P.ready||!navigator.onLine)return;var o=etat();if(o.recu&&Date.now()-o.recu<20*36e5)return;var lg=(typeof I18N!=="undefined"&&I18N.lang)||"fr";
  fetch(URL0+"?l="+encodeURIComponent(lg)).then(function(r){return r.ok?r.json():null;}).then(function(j){if(!j||!Array.isArray(j.e))return;try{B().partage(j.e);garder();}catch(x){}var x=etat();x.recu=Date.now();etatSet(x);}).catch(function(){});}
function plusTard(){var go=function(){try{recevoir();envoyer();}catch(x){}};if("requestIdleCallback" in window)requestIdleCallback(go,{timeout:8000});else setTimeout(go,3000);}
(function attendre(n){if(P.ready){setTimeout(plusTard,15000);setInterval(plusTard,30*60000);return;}if(n<120)setTimeout(function(){attendre(n+1);},500);})(0);
P.partagerMaintenant=function(){envoyer();};
})();
/* ---------- apprendre du geste : après « Je n'ai pas compris », l'écran que l'usager ouvre lui-même ---------- */
(function(){var P=window.casoPont;if(!P)return;function B(){return P.B;}function garder(){try{P.garderIA&&P.garderIA();}catch(x){}}
 var INC=null,ECR={cli:[{m:"clients",a:"ouvrir",args:{}}],prix:[{m:"services",a:"ouvrir",args:{}}],fou:[{m:"fournisseurs",a:"ouvrir",args:{}}],
  fact:[{m:"factures",a:"ouvrir",args:{client:null}}],agenda:[{m:"planning",a:"ouvrir",args:{date:null,semaine:false}}],pt:[{m:"pointage",a:"ouvrir",args:{}}],
  devis:[{m:"devis",a:"liste",args:{filtre:null}}],cpt:[{m:"app",a:"compte",args:{}}]};
 function incompris(){var m=CHAT&&CHAT.m&&CHAT.m[CHAT.m.length-1];if(!m||m.who!=="bot")return false;var h=String(m.html||"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
  try{var a=P.tr("Je n’ai pas compris."),b=P.tr("Je n'ai pas bien compris. Pouvez-vous le dire autrement ?");return h===a||h===b||h.indexOf(a)===0&&h.length<a.length+4;}catch(x){return false;}}
 function brancher(){if(typeof window.chatSend!=="function"||typeof window.go!=="function"||window.chatSend.geste)return false;
  var cs=window.chatSend,g=window.go;
  window.chatSend=function(t){try{if(!cs.multi&&!(window.chatMulti&&chatMulti.busy)){var t0=String(t==null?(document.getElementById("chatIn")||{}).value||"":t).trim();if(t0)INC={t:t0,at:Date.now()};}}catch(x){}return cs.apply(this,arguments);};
  Object.keys(cs).forEach(function(k){try{window.chatSend[k]=cs[k];}catch(x){}});
  Object.defineProperty(window.chatSend,"multi",{get:function(){return cs.multi;},set:function(v){cs.multi=v;}});
  ["att","renv"].forEach(function(k){Object.defineProperty(window.chatSend,k,{get:function(){return cs[k];},set:function(v){cs[k]=v;}});});
  window.chatSend.geste=1;
  window.go=function(sc){try{if(INC&&Date.now()-INC.at<120000&&ECR[sc]&&P.ready&&incompris()){if(B().geste(INC.t,ECR[sc]))garder();INC=null;}}catch(x){}return g.apply(this,arguments);};
  return true;}
 (function essai(n){if(!brancher()&&n<60)setTimeout(function(){essai(n+1);},500);})(0);})();

/* ---------- enchaînements (feuille de route, étape 2) ---------- */
(function(){var P=window.casoPont;if(!P)return;function B(){return P.B;}
 function hn(x){return CasoBrain.hn(String(x||""));}function e(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
 function T(t,a){return P.tr(t,a);}function E(x){return P.B.eurFr(Math.round(x*100)/100);}
 function langue(){try{B().setLangue((typeof I18N!=="undefined"&&I18N.lang)||"fr");}catch(x){}}
 function ymd(d){return d.getFullYear()+"-"+(d.getMonth()<9?"0":"")+(d.getMonth()+1)+"-"+(d.getDate()<10?"0":"")+d.getDate();}
 function bot(h,o){CHAT.m.push(Object.assign({who:"bot",html:'<div data-noi18n>'+h+'</div>'},o||{}));chatSave();chatRender(true);}
 function bouton(lab,fn){return '<div class="msg-act"><button class="btn sm" onclick="casoPont.'+fn+'()">'+e(lab)+'</button></div>';}
 var ATT=null;/* une seule question en attente : {quoi, faire()} */
 var OUI=/^(oui|ok|d accord|vas y|go|yes|yep|si|sí|sim|tak|evet|да|نعم|da)\b/;
 P.oui=function(t){if(!ATT)return false;var a=ATT,k=hn(t);if(Date.now()-a.at>10*60000){ATT=null;return false;}
  if(OUI.test(k)){ATT=null;CHAT.m.push({who:"me",text:t});a.faire();return true;}
  if(/^(non|no|nao|nie|hayir|нет|لا|nu)\b/.test(k)){ATT=null;CHAT.m.push({who:"me",text:t});langue();bot('<p>'+e(T("D’accord."))+'</p>');return true;}
  ATT=null;return false;};
 P.ouiBouton=function(){if(!ATT)return;var a=ATT;ATT=null;a.faire();};
 function demander(h,faire){ATT={at:Date.now(),faire:faire};bot(h+bouton(T("Oui"),"ouiBouton"));}

 /* message d'un client collé dans le chat → rendez-vous proposé */
 var JOURS="lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|demain|apres demain";
 P.messageClient=function(t){if(!P.ready||typeof db==="undefined")return false;var raw=String(t||"");if(raw.length<50)return false;
  var c=B().translate(raw),s=" "+c.p+" ";if(!/\b(bonjour|bonsoir|salut|cordialement|merci|bonne journee|bien a vous)\b/.test(s))return false;
  var j=s.match(new RegExp("\\b("+JOURS+")\\b")),h=s.match(/\b(\d{1,2})\s*(?:h|heures?|:)\s*(\d{2})?\b/);if(!j||!h||+h[1]>21||+h[1]<6)return false;
  var nom=P.clientDans(raw);if(!nom){var sg=raw.match(/(?:cordialement|bien à vous|merci)[\s,.!]*\n?\s*((?:M\.|Mme|Mr|Madame|Monsieur)?\s*\p{Lu}[\p{L}'-]+(?:\s+\p{Lu}[\p{L}'-]+)?)\s*$/iu);if(sg)nom=sg[1].trim();}
  var quand=j[1].replace("apres demain","après-demain")+" "+(+h[1])+"h"+(h[2]||"");langue();
  CHAT.m.push({who:"me",text:raw});
  demander('<p>'+e(nom?T("Rendez-vous {0} avec {1} ?",[quand,nom]):T("Rendez-vous {0} ?",[quand]))+'</p>',function(){var x="rendez-vous "+quand+(nom?" avec "+nom:"");chatSend(x);for(var i=CHAT.m.length-1;i>=0;i--){if(CHAT.m[i].who==="me"&&CHAT.m[i].text===x){CHAT.m.splice(i,1);break;}}chatSave();chatRender(false);});
  var inp=document.getElementById("chatIn");if(inp){inp.value="";try{chatGrow(inp);qkUpdate();}catch(x){}}return true;};

 /* devis signé → facture d'acompte et jours de chantier au planning */
 function joursLibres(n){if(typeof agGaps!=="function"||typeof agToday!=="function")return null;var d=agToday(),run=[],dp=typeof agHours==="function"&&agHours();
  for(var i=1;i<=45&&run.length<n;i++){var jj=agAdd(d,i),wd=new Date(jj+"T12:00:00").getDay();if(!dp&&(wd===0||wd===6)){run=[];continue;}var g=agGaps(jj,60),lib=g.reduce(function(a,x){return a+(x[1]-x[0]);},0);if(lib>=360)run.push(jj);else run=[];}
  return run.length===n?run:null;}
 function signes(){var lim=Date.now()-30*864e5;return (db.quotes||[]).filter(function(o){return o&&o.status==="accepte"&&!o.ench&&o.lines&&o.lines.length&&o.sign&&+o.sign.signedAt>lim;});}
 function proposerSigne(o){var h=(o.lines||[]).filter(function(l){return l.unit==="h";}).reduce(function(a,l){return a+(+l.qty||0);},0),n=Math.max(1,Math.min(10,Math.ceil((h||7)/7))),L=joursLibres(n),pc=o.acompte>0?o.acompte:30;
  o.ench=1;try{storeQ(o);}catch(x){save();}langue();
  var txt=L?T("Devis {0} de {1} signé : facture d’acompte de {2} % et {3} j de chantier au planning à partir du {4} ?",[o.num||"",o.client||"",pc,n,P.B.fdate(new Date(L[0]+"T12:00:00"))]):T("Devis {0} de {1} signé : facture d’acompte de {2} % ?",[o.num||"",o.client||"",pc]);
  demander('<p>'+e(txt)+'</p>',function(){var c=(db.clients||[]).filter(function(x){return hn(x.nom)===hn(o.client);})[0];
   (L||[]).forEach(function(d){db.events.push({id:uid(),src:"main",t:"rdv",d:d,a:"08:00",b:"17:00",title:T("Chantier")+" "+(o.client||""),cid:c?c.id:undefined,qid:o.id,adr:o.adr||"",at:Date.now()});});save();
   bot('<p>'+e(T("C’est fait."))+'</p>');if(typeof faNew==="function")setTimeout(function(){faNew(o.id,"acompte");},400);});}

 /* à l'ouverture (une fois par jour) : une ligne de rappel, puis les devis signés */
 function rappels(){var out=[],auj=ymd(new Date()),now=Date.now();
  var R=(db.events||[]).filter(function(x){return x.t==="rdv"&&x.d===auj&&x.a;}).sort(function(a,b){return String(a.a).localeCompare(String(b.a));}).map(function(x){var c=x.cid&&(db.clients||[]).filter(function(y){return y.id===x.cid;})[0];return String(x.a).replace(/^0/,"").replace(":00","h").replace(":","h")+" "+(c?c.nom:x.title||"");});
  if(R.length)out.push(T("Rendez-vous aujourd’hui : {0}.",[R.join(", ")]));
  var Q0=(db.quotes||[]).filter(function(o){var d=o.sign&&+o.sign.sentAt||Date.parse(o.date),r=(o.relances||[]).slice(-1)[0]||0;return o.status==="envoye"&&d&&now-d>=7*864e5&&now-r>=7*864e5;}),Q=Q0.map(function(o){return o.client||o.num;}).filter(Boolean);
  REL=Q0.slice(0,4).map(function(o){return o.id;});if(Q.length)out.push(T("À relancer : {0}.",[Q.slice(0,4).join(", ")]));
  var F=(db.invoices||[]).filter(function(f){if(!f.num||f.kind==="avoir"||!f.due||f.due>=auj)return false;var t=0;try{t=faTot(f).ttc;}catch(x){}var p=(f.pays||[]).reduce(function(a,y){return a+(+y.amt||0);},0);f._reste=t-p;return f._reste>0.5;}).map(function(f){return f.num+" "+E(f._reste);});
  if(F.length)out.push(T("Factures en retard : {0}.",[F.slice(0,3).join(", ")]));
  /* acompte demandé il y a 7 jours ou plus, pas encore reçu (sans attendre l'échéance) */
  var A=(db.invoices||[]).filter(function(f){if(!f.num||f.kind!=="acompte"||f.due&&f.due<auj)return false;var d=Date.parse(f.date);if(!d||now-d<7*864e5)return false;var t=0;try{t=faTot(f).ttc;}catch(x){}var p=(f.pays||[]).reduce(function(a,y){return a+(+y.amt||0);},0);f._reste=t-p;return f._reste>0.5;});
  if(A.length)ACO=A[0].id;if(A.length)out.push(T("Acompte non reçu : {0}.",[A.slice(0,3).map(function(f){return f.num+" "+((f.client&&f.client.nom)||"")+" "+E(f._reste);}).join(", ")]));return out;}
 /* devis envoyés sans réponse depuis 7 jours : le message de relance prêt, par SMS, WhatsApp ou e-mail */
 var REL=[];P.relancerDevis=function(){var L=REL;REL=[];langue();L.forEach(function(id){var o=(db.quotes||[]).filter(function(x){return x.id===id;})[0];if(!o)return;
   var c=(db.clients||[]).filter(function(x){return hn(x.nom)===hn(o.client);})[0]||{},d=o.sign&&+o.sign.sentAt?new Date(+o.sign.sentAt):new Date(o.date);
   var msg=T("Bonjour {0}, je reviens vers vous au sujet du devis {1} envoyé le {2}. L’avez-vous bien reçu ? Je reste à votre disposition pour en parler.",[o.client||"",o.num||"",P.B.fdate(d)])+(o.sign&&o.sign.url?" "+o.sign.url:"");
   var tel=String(c.tel||o.tel||"").replace(/[^\d+]/g,""),b=encodeURIComponent(msg),ios=/iP(hone|ad)/.test(navigator.userAgent);
   var lien=function(h,lab){return '<a class="btn sm sec" href="'+e(h)+'" onclick="casoPont.relance(\''+o.id+'\')">'+e(lab)+'</a>';};
   bot('<p dir="auto">'+e(msg)+'</p><div class="msg-act">'+(tel?lien("sms:"+tel+(ios?"&":"?")+"body="+b,T("SMS"))+lien("https://wa.me/"+tel.replace(/^0/,"33").replace(/^\+/,"")+"?text="+b,"WhatsApp"):"")+lien("mailto:"+encodeURIComponent(c.email||"")+"?subject="+encodeURIComponent(T("Devis")+" "+(o.num||""))+"&body="+b,T("E-mail"))+'</div>');});};
 P.relance=function(id){var o=(db.quotes||[]).filter(function(x){return x.id===id;})[0];if(!o)return;o.relances=(o.relances||[]).concat(Date.now());try{storeQ(o);}catch(x){save();}};
 var ACO=null;P.relancer=function(){var id=ACO;ACO=null;if(!id||typeof faShow!=="function")return;faShow(id);if(typeof faRelance==="function")setTimeout(faRelance,400);};
 /* fin de chantier : le dernier jour au planning est passé → facture (de solde s'il y a eu un acompte) */
 function finis(){var auj=ymd(new Date());return (db.quotes||[]).filter(function(o){if(!o||o.status!=="accepte"||o.ench2)return false;var E2=(db.events||[]).filter(function(x){return x.qid===o.id;});if(!E2.length)return false;
   if(E2.some(function(x){return x.d>=auj;}))return false;return !(typeof faOfQuote==="function"&&faOfQuote(o.id).some(function(f){return f.kind!=="acompte"&&f.kind!=="avoir";}));});}
 function proposerFin(o){o.ench2=1;try{storeQ(o);}catch(x){save();}langue();var t=0,ac=0;try{t=totals(o).ttc;ac=faOfQuote(o.id).filter(function(f){return f.kind==="acompte";}).reduce(function(a,f){return a+faTot(f).ttc;},0);}catch(x){}
  var txt=ac>0?T("Chantier de {0} terminé : facture de solde de {1} ?",[o.client||"",E(t-ac)]):T("Chantier de {0} terminé : facture de {1} ?",[o.client||"",E(t)]);
  demander('<p>'+e(txt)+'</p>',function(){if(typeof faNew==="function")faNew(o.id);});}
 /* devis refusé : la raison, une seule question (prix, délai, autre) ; sert à « pourquoi mes devis sont refusés » */
 function refuses(){return (db.quotes||[]).filter(function(o){return o&&o.status==="refuse"&&!o.refus&&!o.ench3;});}
 var REF=null;function demanderRefus(o){o.ench3=1;try{storeQ(o);}catch(x){save();}langue();REF=o.id;
  bot('<p>'+e(T("Devis {0} de {1} refusé : pour quelle raison ?",[o.num||"",o.client||""]))+'</p><div class="msg-act">'+[["prix","Prix"],["delai","Délai"],["autre","Autre"]].map(function(r){return '<button class="btn sm sec" onclick="casoPont.raison(\''+r[0]+'\')">'+e(T(r[1]))+'</button>';}).join("")+'</div>');}
 P.raison=function(r){var o=(db.quotes||[]).filter(function(x){return x.id===REF;})[0];REF=null;if(!o)return;o.refus=r;try{storeQ(o);}catch(x){save();}langue();bot('<p>'+e(T("Noté."))+'</p>');};
 function ouverture(){try{if(!P.ready||typeof db==="undefined")return;langue();var k="caso_rappel_jour",auj=ymd(new Date()),v=null;try{v=localStorage.getItem(k);}catch(x){}
  if(v!==auj){var L=rappels();try{localStorage.setItem(k,auj);}catch(x){}if(L.length)bot(L.map(function(x){return '<p dir="auto">'+e(x)+'</p>';}).join("")+(REL.length||ACO?'<div class="msg-act">'+(REL.length?'<button class="btn sm" onclick="casoPont.relancerDevis()">'+e(T("Relancer les devis"))+'</button>':'')+(ACO?'<button class="btn sm sec" onclick="casoPont.relancer()">'+e(T("Relancer l’acompte"))+'</button>':'')+'</div>':""));}
  if(!ATT){var S=signes();if(S.length){proposerSigne(S[0]);return;}var Fn=finis();if(Fn.length){proposerFin(Fn[0]);return;}}
  if(!REF){var Rf=refuses();if(Rf.length)demanderRefus(Rf[0]);}}catch(x){}}
 (function attendre(n){if(P.ready&&typeof CHAT!=="undefined"&&typeof chatRender==="function"){setTimeout(ouverture,1500);setInterval(function(){if(!ATT&&(signes().length||finis().length))ouverture();},10*60000);document.addEventListener("visibilitychange",function(){if(!document.hidden)setTimeout(ouverture,800);});return;}if(n<120)setTimeout(function(){attendre(n+1);},500);})(0);
})();

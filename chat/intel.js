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
function bulle(t,h,o,brut){if(t!=null)CHAT.m.push({who:"me",text:t});CHAT.m.push(Object.assign({who:"bot",html:brut?h:'<div data-noi18n>'+h+'</div>'},o||{}));chatSave();chatRender(true);}
function p(s){return '<p dir="auto">'+e(s)+'</p>';}
function mots(s){return hn(s).split(/[^\p{L}\p{N}]+/u).filter(function(w){return w.length>=3&&!VIDE.test(w);});}
var VIDE=/^(les|des|une|pour|avec|sur|dans|chez|par|que|qui|quoi|est|ton|ta|tes|mon|ma|mes|son|sa|ses|le|la|du|de|un|et|ou|au|aux|moins|plus|cher|chere|prix|fourniture|fournitures|pose|ml|m2|kg|sac|sacs|pot|pots|unite|pieces?)$/;
function proche(a,b){var A=mots(a),Bm=mots(b);if(!A.length||!Bm.length)return 0;var n=0;A.forEach(function(w){if(Bm.some(function(x){return x===w||w.length>=5&&x.length>=5&&(x.indexOf(w)===0||w.indexOf(x)===0);}))n++;});return n/Math.max(A.length,1);}
function ht(f){try{return faTot(f).ht;}catch(x){return 0;}}
function cliDe(id){return (db.clients||[]).filter(function(c){return c.id===id;})[0]||null;}
/* le client nommé dans la phrase : celui du moteur, sinon un client de la base écrit avec sa majuscule (« Martin », pas « un petit carrelage ») */
function clientDe(t){var n=P.clientDans(t);if(n)return n;var c=cliTexte(t);if(!c)return null;var nm=String(c).trim();return String(t).indexOf(nm.charAt(0).toUpperCase()+nm.slice(1))>=0?nm:null;}
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
P.avecClientForce=function(t,nom,lg){if(lg==="tr")return t+" "+nom+" için";if(lg==="ar")return t+" لـ"+nom;return t+" "+(POUR[lg]||"pour")+" "+nom;};
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
  /* « finalement annule », « en fait laisse tomber » juste après une action : comme « non » */
  try{var dm=typeof CHAT!=="undefined"&&CHAT.m&&CHAT.m[CHAT.m.length-1];if(dm&&dm.who==="bot"&&(dm.undo||dm.agUndo||dm.pUndo||dm.prUndo||dm.mUndo)&&/^(?:(?:finalement|en fait|non|bon)[ ,]+(?:annule|laisse tomber|oublie)(?: ca| le| la| tout)?|laisse tomber|oublie(?: ca)?)$/.test(hn(t).replace(/[.!]+/g,"").trim()))return "non";}catch(x){}
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
  /* surface ou longueur pas encore donnée : la ligne ne compte pas */
  L.forEach(function(l){if(P.qteInc&&P.qteInc(l))out.push({k:"qte:"+cle(l.label),t:T("{0} : quantité à préciser",[l.label])});});
  var deja=VU[o.id]||(VU[o.id]={}),neuf=out.filter(function(x){return !deja[x.k];});neuf.forEach(function(x){deja[x.k]=1;});
  if(!neuf.length)return "";return '<p class="vn-w" dir="auto">'+e(T("À vérifier : {0}.",[neuf.map(function(x){return x.t;}).join(" · ")]))+'</p>';};

/* ---------- devis depuis une description ---------- */
var PIECES=/\b(salle de bains?|salle d eau|sdb|cuisine|chambre|salon|sejour|wc|toilettes|entree|couloir|bureau|buanderie|cellier|garage|piece)\b/;
var TRAV=[["mur",/\b(carrelage (?:mural|murale|murs?|aux murs)|faience|peinture (des )?murs|papier peint|toile de verre|enduit|lambris|placo|plaque de platre|ba13|doublage|cloison|credence)\b/],
  ["sol",/\b(carrelage|parquet|stratifie|lino|vinyle|moquette|sol|chape|ragreage|(?:depose|enleve|retire|arrache) (?:du |le |la |les )?(?:carrelage|sol|parquet|moquette)|isolation (du )?sol|plancher)\b/],
  ["plafond",/\b(plafond|faux plafond)\b/],["peinture",/\bpeinture\b/],["perim",/\b(plinthes?|corniches?|baguettes?|joint silicone)\b/],
  ["u",/\b(receveur|douche|baignoire|wc|lavabo|vasque|meuble|robinet|robinetterie|mitigeur|porte|fenetre|radiateur|prises?|interrupteurs?|spots?|luminaires?|seche serviettes?|vmc|chauffe eau|ballon|evier|plan de travail|hotte|colonne de douche|paroi)\b/],
  ["forfait",/\b(evacuation|gravats|nettoyage|deplacement|protection|benne)\b/]];
/* « douche italienne » n'est pas « receveur de douche » : chacun a un mot que l'autre n'a pas */
function autreChose(a,b){var A=mots(a),Bm=mots(b),pas=function(L,M){return L.some(function(w){return w.length>=4&&!M.some(function(x){return x===w||x.indexOf(w)===0||w.indexOf(x)===0;});});};return pas(A,Bm)&&pas(Bm,A);}
function genre(l){for(var i=0;i<TRAV.length;i++)if(TRAV[i][1].test(l))return TRAV[i][0];return null;}
function piece(nom,cli,seul){var M=null;try{var L=(db.maq3d||[]).filter(function(x){return x&&x.d&&x.d.projet&&x.d.projet.rooms&&x.d.projet.scale&&(x.cli?!cli||cle(x.cli)===cle(cli):!seul);}).sort(function(a,b){return (b.at||0)-(a.at||0);});
  for(var i=0;i<L.length&&!M;i++){var pj=L[i].d.projet,sc=+pj.scale,H=+(pj.params&&pj.params.H)||2.5;(pj.rooms||[]).forEach(function(r){if(!M&&r.name&&nom&&hn(r.name).indexOf(nom)>=0&&r.areaPx)M={a:r.areaPx*sc*sc,per:(r.perimPx||0)*sc,h:H,src:"maq",nom:r.name};});}}catch(x){}return M;}
/* lignes ajoutées sans quantité : la réponse suivante (« 20 m² », « 4 m sur 3,5 m ») les calcule */
var SUITE=null;
function suite(t,s){var S0=SUITE;if(!S0)return false;if(Date.now()-S0.at>15*60000||typeof q==="undefined"||q.id!==S0.qid){SUITE=null;return false;}
  var x=s.replace(/^\s*(?:la |ma |sa )?(?:piece|surface|pièce)\s*(?:fait|de|est de|mesure)?\s*|^\s*(?:ca fait|c est|environ|elle fait|il fait)\s*/,"").trim(),A=null,per=null,dims=null,m;
  if((m=x.match(/^(\d+(?:\.\d+)?)\s*(?:m2|m²|metres? carres?)$/)))A=+m[1];
  else if((m=x.match(/^(\d+(?:\.\d+)?)\s*m?\s*(?:x|par|sur|\*)\s*(\d+(?:\.\d+)?)\s*m?$/))){dims=[+m[1],+m[2]];A=dims[0]*dims[1];per=2*(dims[0]+dims[1]);}
  if(S0.direct){var md=x.match(/^(\d+(?:[.,]\d+)?)\s*(m2|m²|metres? carres?|ml|m|u|h)?$/);if(!md)return false;var vd=parseFloat(md[1].replace(",",".")),ld=(q.lines||[]).filter(function(y){return y.label===S0.lignes[0].label&&!(+y.qty>0);})[0];if(!ld||!(vd>0))return false;
    SUITE=null;langue();var bd=JSON.stringify(q);ld.qty=vd;fillForm();store();CHAT.qid=q.id;bulle(t,carteL(ld)+piedDevis(),{undo:bd},true);return true;}
  if(!(A>0&&A<10000))return false;SUITE=null;langue();
  if(per==null)per=4*Math.sqrt(A);var H=2.5,murs=Math.max(0,per*H-1.6),before=JSON.stringify(q),faits=[];
  S0.lignes.forEach(function(r){var l=(q.lines||[]).filter(function(y){return y.label===r.label&&y.unit===r.unit&&!(+y.qty>0);})[0];if(!l)return;
    var g=genre(" "+hn(l.label)+" ");var v=r.unit==="ml"||g==="perim"?per-0.8:g==="mur"?murs:g==="peinture"?murs+A:A;l.qty=Math.round(v*10)/10;faits.push(l);});
  if(!faits.length)return false;
  fillForm();store();CHAT.qid=q.id;var tt=totals(q),out=[];
  out.push('<div class="msg-lines">'+faits.map(function(l){return '<div class="ml"><div><b data-noi18n lang="fr">'+e(l.label)+'</b><div class="mut" data-noi18n>'+e(N(l.qty)+" "+l.unit)+(l.pu?' × '+e(E(l.pu)):'')+'</div></div><b data-noi18n>'+(l.pu?e(E(l.qty*l.pu)):'')+'</b></div>';}).join("")+'</div>');
  if(faits.some(function(l){var g=genre(" "+hn(l.label)+" ");return g==="mur"||g==="peinture"||!dims&&(l.unit==="ml"||g==="perim");}))
    out.push('<p class="mut" dir="auto" data-noi18n>'+e(dims?T("Murs estimés avec 2,50 m sous plafond."):T("Murs et plinthes estimés pour une pièce carrée de {0} m².",[N(A)]))+'</p>');
  var vf=P.verifier(q);if(vf)out.push(vf.replace("<p ","<p data-noi18n "));
  out.push('<div class="msg-tot"><span>Total du devis</span><b data-noi18n>'+e(E(tt.ttc))+' TTC</b></div><div class="msg-act"><button class="btn sm sec" onclick="go(\'edit\')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>');
  bulle(t,out.join(""),{undo:before},true);return true;}
/* la phrase décrit-elle des travaux pour le devis ? {A, pc, items, cl0} ou null (sans rien changer) */
/* morceaux qui disent ce qu'il faut faire du reste, sans être un travail : « prépare un devis », « calcule les surfaces », « la rénovation de la salle de bain » */
var META=/^(?:(?:calcule|calculer|fais le calcul|fais|faire)\s+(?:de |des |les |la )?(?:surfaces?|quantites?|metres?|mesures?|metre)|(?:prepare|preparer|fais|faire|etablis|etablir|redige|rediger)\s+(?:moi\s+)?(?:un |le |mon )?devis|(?:ajoute|rajoute|fais|faire|prevois|prevoir|mets|met)?\s*(?:la |une |sa )?renovation(?:\s+(?:de|du|des)\b.*)?)$/;
/* plusieurs demandes dont une description de travaux (« nouveau devis pour Dupont et ajoute du carrelage ») : morceaux à mettre sur le devis */
var PARTS=null;
function marque(t){var P0=PARTS;if(!P0||Date.now()-P0.at>60000)return false;var h=hn(t);return P0.L.some(function(x){return h.indexOf(x)===0;});}
function ote(x){return String(x).replace(/\b(devis|pour|chez|une?|la|le|les|de|du|des|d|l|a|faire|refaire|fais|prevoir|prevois|prevoit|mettre|mets|met|ajoute|rajoute|installe|installer|remplace|remplacer|change|changer|pose de|pose|poser|nouveau|nouvelle|neuf|neuve|complete?|total|totale|salle|bain|bains|il|faut|aussi|ensuite|egalement|au|aux|chantier|s|remettre|remets|remet|reposer|creer|cree|realiser|realisation)\b/g," ").replace(/\s+/g," ").trim();}
function lire(t,force){var c=fr(t),s=c.p;if(B().isQuestion&&B().isQuestion(t))return null;
  var surf=s.match(/(\d+(?:\.\d+)?)\s*(?:m2|m²|metres? carres?)/g)||[];if(surf.length>1)return false;
  var A=surf.length?parseFloat(surf[0]):null,pc=s.match(PIECES),items=[],autreQte=false,perdu=false,cl0=clientDe(t),ncl=cl0?hn(cl0):"";
  /* chaque morceau de la phrase tapée (virgules, « et », « avec », « + »), traduit en français */
  var LG=window.CASO_LANGAGE,BA={"10":"badix","13":"batreize","15":"baquinze","18":"badixhuit"};
  String(t).split(/\s*(?:[,;+]|\s(?:et|puis|avec|plus|and|y|e|și|i|ve|и|و|with|con|com|cu|z|ile|с)\s)\s*/i).forEach(function(b0){var b=fr(b0).p,aSurf=/(\d+(?:\.\d+)?)\s*(?:m2|m²|metres? carres?)/.test(b);
    /* « BA13 » est un nom de plaque, pas une quantité ; « déposer l'ancien carrelage » = « dépose carrelage » */
    b=b.replace(/\bba ?(10|13|15|18)\b/g,function(_,n){return BA[n];}).replace(/\bdeposer\b/g,"depose").replace(/\b(?:l |le |la |les |de l )?(?:ancien|ancienne|anciens|anciennes|vieux|vieille|vieilles|existante?s?)\b/g," ").replace(/\s+/g," ").trim();
    b=b.replace(/\s*:\s*/g," ").replace(/^(?:et|puis|ensuite|aussi) /,"").trim();var tm=LG?(LG.terme(b0)||LG.terme(b)):null;
    if(!aSurf&&/\d+(?:\.\d+)?\s*(?:m2|m²|m3|ml|m|h|heures?|kg|l|sacs?|pots?|jours?)\b/.test(b))autreQte=true;
    /* une autre commande dans la phrase (nouveau devis, rendez-vous, envoi…) : ce n'est pas qu'une description de travaux */
    if(/\b(nouveau|nouvelle|cree|creer|envoie|envoyer|rendez vous|rdv|facture|facturer|appelle|rappelle|signe|duplique|acompte|tva|remise|marge|enleve|enlever|retire|retirer|supprime|supprimer|efface|effacer|deplace|annule|au lieu)\b/.test(" "+b+" "))perdu=true;
    /* « remplace le carrelage » = refaire le carrelage ; « remplace le carrelage par du parquet » = changer une ligne */
    if(/\b(remplace|remplacer|change|changer|modifie|modifier)\b.*\b(par|avec|en)\b/.test(b))perdu=true;
    if(META.test(b.replace(PIECES," ").replace(/\s+/g," ").trim()))return;
    var x=b.replace(/(\d+(?:\.\d+)?)\s*(?:m2|m²|metres? carres?)/," ").replace(PIECES," ").replace(/\b(devis|pour|chez|une?|la|le|les|de|du|des|d|l|a|faire|refaire|fais|prevoir|prevois|prevoit|mettre|mets|met|ajoute|rajoute|installe|installer|remplace|remplacer|change|changer|pose de|pose|poser|nouveau|nouvelle|neuf|neuve|complete?|total|totale|salle|bain|bains|il|faut|aussi|ensuite|egalement|au|aux|chantier|s|remettre|remets|remet|reposer|creer|cree|realiser|realisation)\b/g," ");x=x.replace(/\s+/g," ").trim();if(ncl)x=(" "+x+" ").split(" "+ncl+" ").join(" ").replace(/\s+/g," ").trim();
    var g=genre(" "+b+" ");
    /* un mot du lexique de chantier (chauffe-eau, bandes à joint, ligne électrique…) : la ligne est acceptée, avec sa façon de compter */
    if(tm&&!g)g=tm.g;
    if(!x)return;if(!g){if(!aSurf&&!PIECES.test(" "+b+" ")&&!/^(?:pour|chez)\s/.test(b))perdu=true;return;}var nb=x.match(/^(\d+)\s+/);if(/\d/.test(x.replace(/^\d+\s+/,""))&&g!=="u"){perdu=true;return;}
    var lab=x.replace(/^\d+\s+/,"");
    /* libellé en français tel qu'il est tapé (accents) quand la phrase est en français */
    if((fr(t).lang||"fr")==="fr"||tm){var r0=String(b0).replace(/^.*:\s*/,"").replace(/^\s*(?:et|puis|ensuite|aussi)\s+/i,"").replace(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|mètres? carrés?|metres? carres?)/i," ").replace(/^\s*(?:(?:il\s+)?(?:faut|faudra|faudrait)\s+)?(?:(?:faire|refaire|fais|mettre|remettre|mets|met|poser|reposer|installer|installe|prévoir|prevoir|prévois|prevois|prévoit|ajoute|rajoute|changer|change|remplacer|remplace|créer|creer)\s+)?(?:\d+\s+)?(?:(?:de la|les|la|le|une?|des|du|de)\s+|(?:de l|l|d)['’]\s*)*(?:pose\s+(?:de\s+|d['’])?|poser\s+)?/i,"").replace(/[.!;]+\s*$/,"").replace(/\s+/g," ").trim();
      /* le libellé tapé, avec ses accents et ses petits mots (« laine de verre dans les combles ») */
      if(r0&&(hn(r0)===lab||ote(hn(r0))===lab))lab=r0;}
    lab=lab.replace(/\b(badix|batreize|baquinze|badixhuit)\b/g,function(w){return w==="badix"?"BA10":w==="batreize"?"BA13":w==="baquinze"?"BA15":"BA18";});
    /* le mot écrit avec ses accents (« chauffe-eau », « fenêtres ») quand la ligne n'est que ce mot */
    if(tm&&LG&&LG.nz(lab)===tm.k)lab=tm.ecrit;
    /* phrase dans une autre langue : le nom français du lexique (« chauffe-eau »), sans les mots restés autour */
    else if(tm&&!enFr()&&!SYNTH&&tm.type!=="piece")lab=tm.ecrit;
    lab=lab.replace(/^depose\b/,"dépose");
    /* la surface dite avec ce travail est la sienne (« dépose placo 20 m² ») ; celle d'un sol est aussi celle de la pièce */
    var own=aSurf&&x&&!/^(?:piece|surface)$/.test(x)?parseFloat((b.match(/(\d+(?:\.\d+)?)\s*(?:m2|m²|metres? carres?)/)||[])[1]):null;
    items.push({lab:lab,g:g,n:nb?+nb[1]:1,dit:!!nb,own:own!=null&&!PIECES.test(" "+b+" ")?own:null});});
  if(A!=null&&items.some(function(it){return it.own!=null&&it.g!=="sol";}))A=null;
  if(autreQte||perdu)return null;
  /* « refaire le sol … mettre du carrelage » : le carrelage dit déjà comment refaire le sol */
  ["sol","mur","murs"].forEach(function(gen){var g0=gen==="sol"?"sol":"mur";if(items.some(function(it){return it.g===g0&&hn(it.lab)!==gen;}))items=items.filter(function(it){return !(it.g===g0&&hn(it.lab)===gen);});});
  if(A==null){/* sans surface : seulement pour un devis (client nommé ou « devis » dit) ; les quantités restent à préciser */
    if(!(cl0||/\bdevis\b/.test(s)||force||marque(t))||!items.length)return null;}
  else if(!((force||marque(t))&&items.length)&&(items.length<2||!pc&&items.length<3&&!items.some(function(it){return it.own!=null;})))return null;
  return {A:A,pc:pc,items:items,cl0:cl0};}
/* « salle de bain 6 m², dépose carrelage… » ou « ajoute du carrelage et des plinthes au devis de Martin » : une seule demande, pas plusieurs */
var dec0=P.decoupe;P.decoupe=function(t){try{if(P.ready&&typeof db!=="undefined"&&typeof q!=="undefined"){if(lire(t))return null;var m=melange(t);if(m)return m;}}catch(x){}return dec0(t);};
/* « nouveau devis pour Dupont et ajoute du carrelage » : la commande d'abord, puis la description pour le devis (le moteur la prenait pour la maquette 3D) */
function melange(t){var s=fr(t).p,nv=String(t).match(/\b(?:client|cliente|klient|müşteri|клиент|عميل)\s+(\p{Lu}[\p{L}'’-]+)/u),nc=clientDe(t)||(nv?nv[1]:null);if(!(nc||/\bdevis\b/.test(s)))return null;
  var M=String(t).split(/\s*(?:[,;]|\s(?:et|puis|ensuite|and|then|y|e|și|i|ve|и|و|poi|potem|sonra|затем|ثم)\s)\s*/i).filter(function(x){return x.trim();});if(M.length<2)return null;
  /* « pour le chantier Martin » seul : il dit le client du morceau qui suit */
  var N0=new RegExp("^(?:pour|chez|sur)?\\s*(?:le |la |l )?(?:chantier|client|devis)?\\s*(?:de |d )?"+(nc?hn(nc):"\\uffff")+"$");
  var K=M.map(function(x){return N0.test(hn(fr(x).p))?"n":lire(x,true)?"d":"c";});if(K.indexOf("d")<0||K.indexOf("c")<0)return null;
  var out=[],dsc=[],att="";M.forEach(function(x,i){if(K[i]==="n"){att+=(att?" ":"")+x+",";return;}
    if(K[i]==="d"){var j=out.length-1;if(j>=0&&K[i-1]==="d"&&!att)out[j]+=", "+x;else{out.push((att?att+" ":"")+x);dsc.push(out.length-1);}}else out.push((att?att+" ":"")+x);att="";});
  if(att)return null;
  /* la description garde le client de la phrase (« crée le client Bernard et ajoute de la faïence » : sur le devis de Bernard) */
  if(nc){var lg=fr(t).lang||"fr";dsc.forEach(function(i){if((" "+hn(out[i])+" ").indexOf(" "+hn(nc)+" ")<0)out[i]=P.avecClient?P.avecClientForce(out[i],nc,lg):out[i];});}
  PARTS={at:Date.now(),L:dsc.map(function(i){return hn(out[i]);})};return out;}
/* « remplace le carrelage de cette salle de bain par du parquet imitation bois » : la ligne du devis change, la quantité reste */
var REMPL=/^\s*(?:remplace|remplacer|change|changer|substitue)\s+(?:le |la |les |l |du |de la |des |un |une )?(.+?)\s+(?:par|avec)\s+(?:du |de la |de l |des |un |une |le |la |les |l )?(.+?)\s*$/;
/* dans les autres langues, sur la phrase tapée (la traduction mot à mot rend mal « replace … with … ») */
var REMPLX=[/^\s*(?:replace|swap|change|switch)\s+(?:the\s+)?(.+?)\s+(?:with|by|for|to)\s+(?:some\s+|a\s+|an\s+|the\s+)?(.+?)\s*$/,
 /^\s*(?:cambia|reemplaza|sustituye|cambiar|reemplazar)\s+(?:el\s+|la\s+|los\s+|las\s+)?(.+?)\s+por\s+(?:un\s+|una\s+|el\s+|la\s+)?(.+?)\s*$/,
 /^\s*(?:substitui|substituir|troca|trocar|muda|mudar)\s+(?:o\s+|a\s+|os\s+|as\s+)?(.+?)\s+por\s+(?:um\s+|uma\s+|o\s+|a\s+)?(.+?)\s*$/,
 /^\s*(?:sostituisci|cambia|rimpiazza|sostituire)\s+(?:il\s+|la\s+|lo\s+|i\s+|le\s+|gli\s+|l\s+)?(.+?)\s+con\s+(?:il\s+|la\s+|un\s+|una\s+|del\s+|della\s+)?(.+?)\s*$/,
 /^\s*(?:inlocuieste|schimba|inlocuiti)\s+(.+?)\s+cu\s+(.+?)\s*$/,
 /^\s*(?:zamien|wymien|zmien)\s+(.+?)\s+na\s+(.+?)\s*$/,
 /^\s*(.+?)\s+yerine\s+(.+?)\s+(?:koy|kullan|yaz)\s*$/,
 /^\s*(?:замени|заменить|поменяй)\s+(.+?)\s+на\s+(.+?)\s*$/,
 /^\s*(?:استبدل|غير|بدل)\s+(.+?)\s+(?:ب|بـ)\s*(.+?)\s*$/];
var LEXN=null;function lexFr(x){try{var L=window.CASO_LEXIQUE;if(!L)return null;if(!LEXN){LEXN=[];Object.keys(L.t).forEach(function(k){var n=L.t[k].n,fr0=String(n.fr).split("|")[0];Object.keys(n).forEach(function(lg){String(n[lg]).split("|").forEach(function(a){LEXN.push([hn(a),fr0]);});});});LEXN.sort(function(a,b){return b[0].length-a[0].length;});}
  var h=" "+hn(x)+" ";for(var i=0;i<LEXN.length;i++)if(LEXN[i][0]&&h.indexOf(" "+LEXN[i][0]+" ")>=0)return LEXN[i][1];}catch(e){}return null;}
P.remplacer=function(t){var c=fr(t),s=c.p.replace(/[.!]+$/,"").trim(),m=(c.lang||"fr")==="fr"?s.match(REMPL):null,etr=false,enEn=false;
  if(!m&&(c.lang||"fr")==="fr"&&(m=s.match(/^\s*(?:change|transforme|passe)\s+(?:le |la |les |l )?(.+?)\s+en\s+(.+?)\s*$/)))enEn=true;
  if(!m&&(c.lang||"fr")!=="fr"){var raw0=String(t).toLowerCase().replace(/[’']/g," ").replace(/[.!?]+\s*$/,"").replace(/\s+/g," ").trim();for(var ri=0;ri<REMPLX.length&&!m;ri++)m=raw0.match(REMPLX[ri]);etr=!!m;}
  if(!m)return false;
  var cl=clientDe(t),nc=cl&&cliNom(cl)?cliNom(cl).nom:null,cible=null;
  var net=function(x){return x.replace(/\s+(?:a|au|dans|sur|pour|de|du|en)\s+(?:\S+\s+){0,3}(?:devis|quote)\b.*$/,"").replace(/\b(?:dans|sur|pour|chez|de|du|des|en)\s+(?:le |la |les |l |ce |cette |cet |mon |ma )?(?:devis|chantier|client)\b.*$/,"").replace(/\s+(?:de|du|dans|pour|chez)\s+(?:la |le |l |cette |ce |cet |sa |son )?(?:salle de bains?|salle d eau|cuisine|chambre|salon|sejour|wc|toilettes|entree|couloir|bureau|piece)\b.*$/,"").replace(/\s+(?:chez|pour)\s+\S+$/,"").trim();};
  /* en français, le nouveau libellé garde les accents tapés (« faïence », pas « faience ») */
  if((c.lang||"fr")==="fr"&&!enEn){var raw=String(t).toLowerCase().replace(/[’']/g," ").replace(/[.!]+\s*$/,"").replace(/\s+/g," ").trim(),mr=raw.match(/\s(?:par|avec)\s+(?:du |de la |de l |des |un |une |le |la |les |l )?(.+)$/);if(mr)m[2]=mr[1];}
  var X=net(m[1]),Y=net(m[2]);
  if(etr){var kc=nc?hn(nc):"";var netx=function(x){return hn(x).replace(/\s+(?:in|on|for|en|el|del|de|do|da|nel|della|del|din|w|na|в|для|في)\s+.*$/,"").replace(kc?new RegExp("\\b"+kc+"\\b.*$"):/$^/,"").trim();};
    var Xf=lexFr(X)||fr(netx(X)).p,Yf=lexFr(Y);X=Xf;Y=Yf||netx(Y);}
  if(nc){var kn=hn(nc);X=(" "+X+" ").split(" "+kn+" ").join(" ").trim();Y=(" "+Y+" ").split(" "+kn+" ").join(" ").trim();}
  if(!X||!Y||/\d/.test(X+Y))return false;
  if(nc){cible=q&&q.client===nc&&brouil(q)?q:(db.quotes||[]).filter(function(o){return brouil(o)&&o.client===nc;}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""));})[0]||null;}
  else cible=typeof q!=="undefined"&&q&&(q.lines||[]).length?q:null;
  langue();
  if(!cible){if(enEn)return false;bulle(t,p(nc?T("Aucun devis en cours pour {0}.",[nc]):T("Le devis n’a pas encore de lignes.")));return true;}
  if(!brouil(cible)){bulle(t,p(T("Ce devis est déjà envoyé : je ne le change pas.")));return true;}
  var bs=0,li=-1;(cible.lines||[]).forEach(function(l,i){var v=Math.max(proche(X,l.label||""),cle(l.label||"")===cle(X)?1:0);if(v>bs){bs=v;li=i;}});
  if(bs<0.5){if(enEn)return false;bulle(t,p(T("Je ne trouve pas « {0} » dans le devis.",[X])));return true;}
  if(cible!==q)q=JSON.parse(JSON.stringify(cible));var before=JSON.stringify(cible),l=q.lines[li],ancien=l.label;
  var pr=null,b2=0;(db.prices||[]).forEach(function(x){if(autreChose(Y,x.nom))return;var v=Math.min(proche(Y,x.nom),proche(x.nom,Y)+0.5);if(v>b2){b2=v;pr=x;}});if(b2<0.75)pr=null;
  var un=pr&&pr.unit?pr.unit:l.unit;
  l.label=pr?pr.nom:Y.charAt(0).toUpperCase()+Y.slice(1);l.pu=pr?nombre(pr.prix):null;if(pr&&pr.tva!=null)l.tva=pr.tva;
  /* même unité : la quantité reste ; autre unité (m² → ml) : à préciser */
  if(String(un||"")!==String(l.unit||""))l.qty=null;l.unit=un;
  fillForm();store();CHAT.qid=q.id;var tt=totals(q),out=[];
  out.push('<p dir="auto" data-noi18n>'+e(T("{0} remplacé par {1}.",[ancien,l.label]))+'</p>');
  out.push('<div class="msg-lines"><div class="ml"><div><b data-noi18n lang="fr">'+e(l.label)+'</b><div class="mut" data-noi18n>'+e((l.qty==null?"":N(l.qty)+" ")+l.unit)+(l.pu?' × '+e(E(l.pu)):'')+'</div>'+(l.pu?'':'<div class="vn-w">Pas dans tes prix : prix à remplir</div>')+'</div><b data-noi18n>'+(l.pu&&l.qty!=null?e(E(l.qty*l.pu)):'')+'</b></div></div>');
  var vf=P.verifier(q);if(vf)out.push(vf.replace("<p ","<p data-noi18n "));
  out.push('<div class="msg-tot"><span>Total du devis</span><b data-noi18n>'+e(E(tt.ttc))+' TTC</b></div><div class="msg-act"><button class="btn sm sec" onclick="go(\'edit\')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>');
  bulle(t,out.join(""),{undo:before},true);return true;};
P.decrire=function(t,opts){langue();if(!P.ready||typeof db==="undefined"||typeof q==="undefined")return false;
  /* « je suis carreleur » dit un métier, pas un travail à chiffrer */
  if(/^\s*(?:je suis|on est|nous sommes)\s+\S+\s*[.!]*$/i.test(String(t||"")))return false;
  opts=opts&&typeof opts==="object"?opts:null;
  if(!opts){if(P.remplacer(t))return true;
    if(suite(t,fr(t).p))return true;}
  var L0=lire(t,!!opts);if(!L0)return false;var A=L0.A,pc=L0.pc,items=L0.items,cl0=L0.cl0;
  /* mesures : la pièce de la maquette, sinon une pièce carrée de cette surface (2,50 m sous plafond) */
  var mq=pc?piece(pc[1],cl0,A==null):null;if(A==null&&mq)A=mq.a;
  var aire=A,per=mq&&mq.per?mq.per:4*Math.sqrt(A||0),H=mq?mq.h:2.5,murs=Math.max(0,per*H-1.6);if(mq&&Math.abs(mq.a-A)/A>0.25)mq=null;
  if(!mq){per=4*Math.sqrt(A||0);H=2.5;murs=Math.max(0,per*H-1.6);}
  var inconnu=A==null;
  var before=JSON.stringify(q),out=[],cl=clientDe(t),nc=cl&&cliNom(cl)?cliNom(cl).nom:null;choisirDevis(nc);
  if(nc)q.client=nc;
  q.lines=q.lines.filter(function(l){return l.label||l.pu;});
  var nouv=[],aMesurer=[];items.forEach(function(it){var qte,un;if(it.dit&&it.own==null&&/^(mur|sol|plafond|peinture|surf)$/.test(it.g)){/* « 10 plaques de BA13 » : un nombre dit se compte à l'unité */qte=it.n;un="u";}else if(it.own!=null&&it.g!=="sol"){qte=it.own;un="m²";}else if(it.g==="surf"){qte=null;un="m²";}else if(it.g==="lin"){qte=null;un="ml";}else if(it.g==="vol"){qte=null;un="m³";}else if(it.g==="mur"){qte=murs;un="m²";}else if(it.g==="sol"||it.g==="plafond"){qte=aire;un="m²";}else if(it.g==="peinture"){qte=murs+aire;un="m²";}else if(it.g==="perim"){qte=per-0.8;un="ml";}else if(it.g==="forfait"){qte=1;un="forfait";}else{qte=it.n;un="u";}
    if(inconnu&&un!=="u"&&un!=="forfait"&&!(it.own!=null&&it.g!=="sol"))qte=null;
    /* projet décrit en plusieurs messages : les murs ne sont pas devinés d'après le sol */
    if(opts&&opts.sansEstim&&!mq&&it.own==null&&/^(mur|peinture|perim)$/.test(it.g))qte=null;
    var pr=null,bs=0,dep=/\b(depose|demolition|arrachage|enleve|retire|arrache)\b/;(db.prices||[]).forEach(function(x){if(dep.test(hn(it.lab))!==dep.test(hn(x.nom)))return;if(autreChose(it.lab,x.nom))return;var v=Math.min(proche(it.lab,x.nom),proche(x.nom,it.lab)+0.5);if(v>bs){bs=v;pr=x;}});if(bs<0.5)pr=null;
    /* « joints de carrelage » n'est pas « Carrelage » : le premier mot de la ligne doit être dans le nom du service */
    if(pr){var w0=mots(it.lab)[0],MP=mots(pr.nom);if(w0&&w0.length>=4&&!MP.some(function(x){return x===w0||x.indexOf(w0.slice(0,5))===0||w0.indexOf(x.slice(0,5))===0;}))pr=null;}
    if(pr&&pr.unit&&pr.unit!==un&&!(un==="u"&&/^(u|forfait)$/.test(pr.unit))&&!(un==="forfait"&&pr.unit==="u"))pr=null;
    var lab=pr?pr.nom:it.lab.charAt(0).toUpperCase()+it.lab.slice(1);if(qte!=null)qte=Math.round(qte*10)/10;
    /* « carrelage mural » garde son nom, même chiffré au prix du carrelage */
    if(pr&&/\b(mural|murale|murs|plafond)\b/.test(hn(it.lab))&&!/\b(mural|murale|murs?|plafond)\b/.test(hn(pr.nom)))lab=it.lab.charAt(0).toUpperCase()+it.lab.slice(1);
    var l={label:lab,qty:qte,unit:pr&&pr.unit?pr.unit:un,pu:pr?nombre(pr.prix):null,tva:pr&&pr.tva!=null?pr.tva:10,g:it.g};q.lines.push(l);nouv.push(l);if(qte==null)aMesurer.push(l);});
  nouv.forEach(function(l){delete l.g;});
  fillForm();store();CHAT.qid=q.id;var tt=totals(q);
  /* même bulle que les lignes dictées : les textes fixes sont traduits par casô, le reste ne bouge pas */
  out.push('<div class="msg-lines">'+nouv.map(function(l){return '<div class="ml"><div><b data-noi18n lang="fr">'+e(l.label)+'</b><div class="mut" data-noi18n>'+e((l.qty==null?"":N(l.qty)+" ")+l.unit)+(l.pu?' × '+e(E(l.pu)):'')+'</div>'+(l.pu?'':'<div class="vn-w">Pas dans tes prix : prix à remplir</div>')+'</div><b data-noi18n>'+(l.pu&&l.qty!=null?e(E(l.qty*l.pu)):'')+'</b></div>';}).join("")+'</div>');
  SUITE=null;
  if(aMesurer.length){var vu=VU[q.id]||(VU[q.id]={});aMesurer.forEach(function(l){vu["qte:"+cle(l.label)]=1;});
    out.push('<p class="vn-w" dir="auto" data-noi18n>'+e(T("Quantités à préciser : {0}.",[aMesurer.map(function(l){return l.label+" ("+l.unit+")";}).join(", ")]))+'</p>');
    if(opts&&opts.sansEstim&&A!=null){/* la surface du sol est connue : il manque autre chose (les murs…) ; une seule ligne → sa quantité est demandée */
      if(aMesurer.length===1){out.push(p(T("Donne la quantité pour {0} (par exemple « 18 {1} »).",[aMesurer[0].label,aMesurer[0].unit])));SUITE={qid:q.id,at:Date.now(),direct:true,lignes:aMesurer.map(function(l){return {label:l.label,unit:l.unit};})};}}
    else{out.push(p(T("Donne la surface de la pièce (par exemple « 20 m² » ou « 4 m sur 3,5 m ») et je les calcule.")));
    SUITE={qid:q.id,at:Date.now(),lignes:aMesurer.map(function(l){return {label:l.label,unit:l.unit};})};}}
  else if(A!=null&&(mq||nouv.some(function(l){var g=genre(" "+hn(l.label)+" ");return g==="mur"||g==="peinture"||g==="perim";}))){SUITE=null;out.push('<p class="mut" dir="auto" data-noi18n>'+e(mq?T("Mesures de la maquette ({0}).",[mq.nom]):T("Murs et plinthes estimés pour une pièce carrée de {0} m².",[N(A)]))+'</p>');}
  var vf=P.verifier(q);if(vf)out.push(vf.replace("<p ","<p data-noi18n "));
  out.push('<div class="msg-tot"><span>Total du devis</span><b data-noi18n>'+e(E(tt.ttc))+' TTC</b></div><div class="msg-act"><button class="btn sm sec" onclick="go(\'edit\')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>');
  bulle(opts&&opts.aff!=null?opts.aff:t,out.join(""),{undo:before},true);return true;};
/* le devis où écrire : jamais celui d'un autre client, jamais un devis déjà envoyé ou signé.
   Client nommé : son devis ouvert s'il est en brouillon, sinon son dernier brouillon, sinon un nouveau devis. */
function brouil(o){return !!o&&(!o.status||o.status==="brouillon");}
function choisirDevis(nc){var plein=(q.lines||[]).some(function(l){return l.label||l.pu;});
  if(nc){if(q.client===nc&&brouil(q))return;var cib=(db.quotes||[]).filter(function(o){return brouil(o)&&o.client===nc;}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""));})[0];
    if(cib){q=JSON.parse(JSON.stringify(cib));return;}if((plein||q.client&&q.client!==nc||!brouil(q))&&typeof newQuote==="function")newQuote();return;}
  if(!brouil(q)&&typeof newQuote==="function"){var c0=q.client;newQuote();if(c0)q.client=c0;}}
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
P.renoDevis=function(t){if(!P.ready||typeof db==="undefined"||typeof q==="undefined")return false;var c=fr(t),s=c.p;if(!RENO.test(s)||/^\s*(combien|quel|quelle|ou)\b/.test(s))return false;
  /* « ajoute la rénovation de la salle de bain, prévois une douche italienne… » : des travaux à chiffrer, pas l'estimation de la maquette */
  if(lire(t))return false;langue();
  var LM=(db.maq3d||[]).filter(function(x){return x&&x.d&&x.d.estimation&&(x.d.estimation.lignes||[]).length;}).sort(function(a,b){return (b.at||0)-(a.at||0);});
  if(!LM.length){bulle(t,p(T("Aucune rénovation enregistrée.")));return true;}
  /* jamais la rénovation d'un autre client : celle du client du devis ; une rénovation liée à personne est d'abord proposée */
  var cl=clientDe(t),nc=cl&&cliNom(cl)?cliNom(cl).nom:null,brouil=function(o){return o&&(!o.status||o.status==="brouillon");},cible=nc||(brouil(q)&&q.client)||null,M=null;
  if(cible){M=LM.filter(function(x){return x.cli&&cle(x.cli)===cle(cible);})[0];
    if(!M){var M0=LM.filter(function(x){return !x.cli;})[0];
      if(!M0){bulle(t,p(T("Aucune rénovation enregistrée pour {0}.",[cible])));return true;}
      if(!P.demander)return false;CHAT.m.push({who:"me",text:t});
      P.demander(p(T("La dernière rénovation ({0}) n’est liée à aucun client. La mettre sur le devis de {1} ?",[dFR(M0.at||Date.now()),cible])),function(){M0.cli=cible;try{save();}catch(x){}renoVers(null,M0,cible);});return true;}}
  else M=LM[0];
  renoVers(t,M,cible);return true;};
function renoVers(t,M,nc){
  /* « … sur le devis de Martin » : le devis en cours de Martin s'il en a un (brouillon), sinon un nouveau devis */
  var before=JSON.stringify(q);if(!nc&&(q.lines||[]).some(function(l){return l.label||l.pu;})){if(typeof newQuote==="function")newQuote();}else choisirDevis(nc);
  if(nc)q.client=nc;else if(M.cli&&!q.client)q.client=M.cli;
  if(!M.cli&&q.client){M.cli=q.client;try{save();}catch(x){}}
  var ind=[],nouv=[];M.d.estimation.lignes.forEach(function(r){if(!r||!r.poste)return;var pr=null,bs=0;(db.prices||[]).forEach(function(x){var v=Math.min(proche(r.poste,x.nom),proche(x.nom,r.poste)+0.5);if(v>bs){bs=v;pr=x;}});
    var u=String(r.unite||"u").replace(/^m2$/,"m²");if(bs<0.5||pr&&pr.unit&&String(pr.unit).replace(/^m2$/,"m²")!==u)pr=null;
    var pu=pr?nombre(pr.prix):Math.round(((+r.prix_min||0)+(+r.prix_max||+r.prix_min||0))/2/1.1*100)/100;if(!pr)ind.push(r.poste);
    var l={label:pr?pr.nom:r.poste,qty:Math.round((+r.quantite||1)*10)/10,unit:pr&&pr.unit?pr.unit:u,pu:pu||null,tva:pr&&pr.tva!=null?pr.tva:10};q.lines.push(l);nouv.push(l);});
  if(!nouv.length){bulle(t,p(T("Aucune rénovation enregistrée.")));return;}
  q.lines=q.lines.filter(function(l){return l.label||l.pu;});fillForm();store();CHAT.qid=q.id;var tt=totals(q),out=[];
  out.push('<div class="msg-lines">'+nouv.map(function(l){return '<div class="ml"><div><b data-noi18n>'+e(l.label)+'</b><div class="mut" data-noi18n>'+e(N(l.qty)+" "+l.unit)+(l.pu?' × '+e(E(l.pu)):'')+'</div></div><b data-noi18n>'+(l.pu?e(E(l.qty*l.pu)):'')+'</b></div>';}).join("")+'</div>');
  if(ind.length)out.push('<p class="mut" dir="auto" data-noi18n>'+e(T("Prix indicatifs pour : {0}.",[ind.join(", ")]))+'</p>');
  var vf=P.verifier(q);if(vf)out.push(vf.replace("<p ","<p data-noi18n "));
  out.push('<div class="msg-tot"><span>Total du devis</span><b data-noi18n>'+e(E(tt.ttc))+' TTC</b></div><div class="msg-act"><button class="btn sm sec" onclick="go(\'edit\')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>');
  bulle(t,out.join(""),{undo:before},true);}

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
/* ---------- finesse d'usage : le devis en cours, les prix, l'état d'un devis ---------- */
function enCours(){return typeof q!=="undefined"&&q&&brouil(q)&&(q.lines||[]).some(function(l){return l.label;});}
/* la ligne du devis dont on parle (« la colle » → « Colle carrelage ») ; le même nom exact d'abord */
function ligneDe(X,L){var bs=0,li=-1;(L||[]).forEach(function(l,i){var n=l.label||l.nom;if(!n)return;var v=cle(n)===cle(X)?2:Math.max(proche(X,n),proche(n,X)*0.9);if(v>bs){bs=v;li=i;}});return bs>=0.5?li:-1;}
function carteL(l){return '<div class="msg-lines"><div class="ml"><div><b data-noi18n lang="fr">'+e(l.label)+'</b><div class="mut" data-noi18n>'+e((l.qty==null?"":N(l.qty)+" ")+(l.unit||""))+(l.pu?' × '+e(E(l.pu)):'')+'</div></div><b data-noi18n>'+(l.pu&&l.qty!=null?e(E(l.qty*l.pu)):'')+'</b></div></div>';}
function piedDevis(){var tt=totals(q),vf=P.verifier(q);return (vf?vf.replace("<p ","<p data-noi18n "):"")+'<div class="msg-tot"><span>Total du devis</span><b data-noi18n>'+e(E(tt.ttc))+' TTC</b></div><div class="msg-act"><button class="btn sm sec" onclick="go(\'edit\')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>';}
function uni(u){u=hn(String(u||""));return /^(m2|m²|metres? carres?)$/.test(u)?"m2":/^(h|heures?)$/.test(u)?"h":/^(sacs?)$/.test(u)?"sac":/^(pots?)$/.test(u)?"pot":/^(jours?|j)$/.test(u)?"jour":u;}
var QN="(\\d+(?:[.,]\\d+)?)\\s*(m2|m²|metres? carres?|ml|m3|m|h|heures?|sacs?|pots?|kg|jours?|u)",
 CORR="(?:en fait|finalement|plutot|non|pardon|correction|erreur|je me suis trompe|au final)",
 Q0=new RegExp("^"+CORR+"[ ,:]*(?:mets|met|c est|ce sera|fais|il y a|ca fait|il faut|plutot)?\\s*(\\d+(?:[.,]\\d+)?)$"),
 Q1=new RegExp("^"+CORR+"[ ,:]*(?:mets|met|c est|ce sera|fais|il y a|ca fait|il faut)?\\s*"+QN+"(?:\\s+(?:de |d |pour le |pour la |pour les |pour l )(.+))?$"),
 Q2=new RegExp("^(?:"+CORR+"[ ,:]*)?(?:le |la |les |l )?(.+?)\\s+(?:en fait |finalement )?(?:c est|ca fait|fait|ce sera|il y a|il faut)\\s+"+QN+"(?:\\s+(?:pas|et pas|au lieu de|et non|non pas)\\s+\\d.*)?$"),
 Q3=new RegExp("^(?:"+CORR+"[ ,:]*)?(?:mets|met|passe|change|modifie)\\s+(?:le |la |les |l )?(.+?)\\s+a\\s+"+QN+"$"),
 TOT1=/^(?:et |alors )?(?:c est quoi |quel est |donne moi |dis moi |on en est ou sur )?(?:le |mon )?(?:total|montant)(?: du devis| de ce devis)?(?: en)?(?: ht| ttc)?$/,
 TOT2=/^(?:et |alors )?(?:ca|cela|on en est a|on est a|le devis|ce devis|tout ca)?\s*(?:nous )?(?:fait|donne|monte a|est a|fera|coute)?\s*combien(?: ca fait| ca donne| on en est| (?:fait |coute )?(?:le|ce) devis| le total| ca coute)?(?: en tout| au total| pour l instant)?(?: en)?(?: ht| ttc)?$/,
 SUPL=/^(?:enleve|enlever|retire|retirer|supprime|supprimer|efface|effacer|vire|ote)\s+(?:moi\s+)?(?:la ligne (?:de |du |des |d )?|la |le |les |l |du |des )?(.+?)(?:\s+(?:du|au|dans le|sur le|de ce) devis)?$/,
 PRX1=/^(?:quel est |c est quoi |donne moi |dis moi |rappelle moi )?(?:le |mon )?(?:prix|tarif) (?:de la |de l |du |des |de |d |pour la |pour le |pour les |pour l |pour )(.+)$/,
 PRX2=/^(?:le |la |les |l )?(.+?) (?:est|c est|sont|je (?:le |la |les )?(?:fais|facture|vends)) a combien$/,
 PRX4=/^combien (?:ca )?coutent? (?:une? |le |la |les |l |du |de la |des )?(.+)$/,
 PRX3=/^(?:a )?combien (?:est|sont|coute|coutent|je fais|je prends pour|je facture|je vends) (?:le |la |les |l |du |de la |des )?(.+)$/,
 ETAT=/\b(?:est|a ete|a|passe|mets|marque|note)\b.*\b(signe|signee|accepte|acceptee|valide|validee|dit oui|d accord|refuse|refusee|dit non|decline|perdu)\b/;
/* ---------- un projet décrit en plusieurs messages (« Je dois refaire ma salle de bain. » … « Fais-moi le devis. ») ---------- */
var SYNTH=false,PROJET=null,PJ_OUV=/^(?:je dois|il faut|faut|on doit|je vais|on va|j ai a|il y a a)?\s*(?:refaire|renover|retaper|reprendre|faire)\s+(?:toute la |tout le |ma |la |une |sa |le |un |mon |son )(.+)$/,
 PJ_DEVIS=/^(?:fais|fait|prepare|sors|etablis|chiffre|envoie)(?: moi| nous)?(?: le| un| ce| mon)? ?(?:devis|chiffrage|ca)?$|^(?:le )?devis$/,
 PJ_DEP=/\b(?:enleve|enlever|enleves|retire|retirer|arrache|arracher|vire|virer|casse|casser|depose|deposer|demonte|demonter|pete|peter|degage|degager)\b/;
function capit(x){x=String(x||"");return x.charAt(0).toUpperCase()+x.slice(1);}
/* la langue de l'usager : celle de l'appli (le moteur se trompe parfois sur une phrase courte) */
function enFr(c){var ui="fr";try{ui=(typeof I18N!=="undefined"&&I18N.lang)||"fr";}catch(x){}return ui==="fr";}
/* ---- le même projet dans les 9 autres langues : le traducteur du moteur rend les noms (carrelage, sol, murs, salle de bain, devis, m2) ;
   les verbes (refaire, enlever) sont reconnus sur la phrase tapée. Les lignes du devis restent en français, comme toujours. ---- */
var X_PIECE=[[/bathroom|ba[nñ]o|banheiro|casa de banho|bagno|\bbaie\b|\bbaia\b|[łl]azienk|banyo|ванн|حمام/i,"salle de bain"],[/kitchen|cocina|cozinha|cucina|buc[aă]t[aă]ri|kuchni|mutfa[kğ]|кухн|مطبخ/i,"cuisine"],[/bedroom|dormitorio|habitaci[oó]n|quarto|camera da letto|dormitor|sypialni|yatak oda|спальн|غرفة النوم/i,"chambre"],[/living ?room|sal[oó]n|sala de estar|soggiorno|salotto|sufragerie|salon|oturma oda|гостин|غرفة المعيشة|الصالون/i,"salon"]],
 X_REFAIRE=/\b(?:redo|renovat\w*|refurbish\w*|remodel\w*|reform\w*|renov\w*|rehac\w*|refaz\w*|remodel\w*|rifa\w*|ristruttur\w*|rinnov\w*|refac\w*|renovez\w*|wyremont\w*|remont\w*|odnowi\w*|yenile\w*|tadilat\w*)\b|передел|отремонтир|ремонт|اجدد|أجدد|تجديد|ترميم|refaire|renover|renovation/i,
 X_OTER=/\b(?:remov\w*|rip\w*|tear\w*|strip\w*|take (?:out|off|up)|demolish\w*|quit\w*|arranc\w*|retir\w*|levant\w*|demol\w*|sac[ao]\w*|tir[ao]\w*|togli\w*|rimuov\w*|rimoz\w*|strapp\w*|smantell\w*|scoat\w*|scot\w*|indepart\w*|zryw\w*|usuw\w*|skuw\w*|demont\w*|wyburz\w*|zdejm\w*|s[oö]k\w*|kald[ıi]r\w*|y[ıi]k\w*)\b|сним|убир|демонт|сбив|слом|удал|نزيل|ازال|إزال|نزع|هدم|نخلع|enleve|depose|retire/i,
 X_SOL=/\bfloor|suelo|\bpiso\b|ch[aã]o|paviment|\bpodea|\bjos\b|pod[lł]o[dg]|zemin|\byer[ei]?\b|\bпол\b|полу|الأرض|الارض/i,X_MUR=/\bwalls?\b|pared|parete|pareti|pere[tț]|[sś]cian|duvar|стен|جدار|جدران|الجدر/i,
 X_ETAT=/damaged|broken|ruined|rotten|cracked|worn out|\bdead\b|da[nñ]ad\w*|\brot[ao]s?\b|estropead\w*|agrietad\w*|podrid\w*|danificad\w*|partid\w*|estragad\w*|\bpodres?\b|rachad\w*|rovinat\w*|\brott[aoie]\b|danneggiat\w*|marci[ao]\w*|crepat\w*|deteriorat\w*|stricat\w*|\brupt\w*|cr[aă]pat\w*|putred\w*|uszkodzon\w*|zepsut\w*|p[eę]kni[eę]t\w*|zniszczon\w*|zgni[lł]\w*|hasarl[ıi]|k[ıi]r[ıi]k|bozuk|[cç]atlak|[cç][uü]r[uü]k|поврежд|сломан|треснут|гнил|испорчен|تالف|مكسور|متضرر|متشقق|مهترئ/i;
function projetX(t,s,c){var m,LG=window.CASO_LANGAGE,raw=String(t);if(typeof q==="undefined"||!LG)return false;
  if(PROJET&&Date.now()-PROJET.at>20*60000)PROJET=null;
  var mots=s.split(/\s+/).filter(Boolean),tm=LG.terme(s),chiffre=/\d/.test(s),pm=(" "+s+" ").match(PIECES),pc=pm?(pm[1]==="sdb"?"salle de bain":pm[1]):null;
  if(!pc)for(var i=0;i<X_PIECE.length&&!pc;i++)if(X_PIECE[i][0].test(raw))pc=X_PIECE[i][1];
  /* ouverture : une pièce à refaire, sans autre détail */
  if(pc&&X_REFAIRE.test(raw+" "+s)&&!chiffre&&!/\bdevis\b/.test(s)&&!(tm&&tm.type!=="piece")&&mots.length<=10&&!(B().isQuestion&&B().isQuestion(t))){var cl=clientDe(t);
    PROJET={pc:pc,cl:cl&&cliNom(cl)?cliNom(cl).nom:null,A:null,items:[],mat:null,at:Date.now()};bulle(t,p(T("C’est noté. Donne la surface et les travaux, puis demande le devis.")));return true;}
  if(!PROJET)return false;var P0=PROJET;
  /* la surface : un seul nombre, avec m² */
  var nums=s.replace(/\bm[2²]\b|m²/g," ").match(/\d+(?:[.,]\d+)?/g)||[];
  if(nums.length===1&&/\b(?:m2|m²|surface)\b|m²/.test(s)&&!tm&&mots.length<=6){P0.A=parseFloat(nums[0].replace(",","."));P0.at=Date.now();bulle(t,p(T("Surface : {0} m².",[N(P0.A)])));return true;}
  /* le devis */
  if(/\bdevis\b/.test(s)&&!chiffre&&!(tm&&tm.type==="mat")&&mots.length<=6&&!clientDe(t)){if(!P0.items.length){bulle(t,p(T("Dis-moi d’abord les travaux à faire.")));return true;}
    var ph=P0.pc+(P0.A!=null?" "+String(P0.A).replace(".",",")+" m²":"")+", "+P0.items.join(", ")+(P0.cl?" pour "+P0.cl:"");PROJET=null;
    SYNTH=true;var okd=false;try{okd=P.decrire(ph,{aff:t,sansEstim:true});}finally{SYNTH=false;}if(okd)return true;PROJET=P0;return false;}
  /* un travail : un matériau ou un équipement du lexique, enlevé ou posé, au sol ou aux murs */
  if(chiffre||B().isQuestion&&B().isQuestion(t)||!tm||tm.type==="piece"||/\b(devis|client|rdv|rendez vous|facture|prix)\b/.test(s))return false;
  var dep=X_OTER.test(raw+" "+s),lieux=[],nouv=[];if(/\bsol\b/.test(s)||X_SOL.test(raw))lieux.push("sol");if(/\bmurs?\b/.test(s)||X_MUR.test(raw))lieux.push("mur");if(/\bplafond\b/.test(s))lieux.push("plafond");
  /* les matériaux de la phrase d'abord (« gresie pe jos și faianță pe pereți » : chacun le sien) */
  var tous=[],T1=null;s.split(/\s+/).forEach(function(w){var x=LG.terme(w);if(x&&x.type==="mat"&&tous.indexOf(x.ecrit.toLowerCase())<0){tous.push(x.ecrit.toLowerCase());if(!T1)T1=x;}});
  if(T1)tm=T1;else if(/^(mur|dalle)$/.test(tm.id)&&lieux.length)tm=null;
  if(!tm)return false;var mat=tm.ecrit.toLowerCase();
  if(dep)nouv.push("dépose "+mat);
  else if(tous.length>1)tous.forEach(function(x){nouv.push(x);});
  else if(tm.type==="mat"&&(lieux.length>1||lieux[0]==="mur"&&/carrelage|parquet|vinyle/.test(mat)))lieux.forEach(function(l){nouv.push(l==="mur"?(mat==="carrelage"?"carrelage mural":mat+" murs"):l==="plafond"?mat+" plafond":mat);});
  else nouv.push(mat);
  nouv.forEach(function(n){if(P0.items.indexOf(n)<0)P0.items.push(n);});P0.at=Date.now();
  bulle(t,p(T("Noté : {0}.",[nouv.join(", ")])));return true;}
/* un constat dans une autre langue : la phrase de l'artisan est gardée telle quelle dans les remarques du devis */
function constatX(t,s){var LG=window.CASO_LANGAGE,raw=String(t).trim();if(!LG||typeof q==="undefined"||/\d/.test(s)||B().isQuestion&&B().isQuestion(t))return false;
  if(!X_ETAT.test(raw)||s.split(/\s+/).length>8||!(LG.terme(s)||/\b(sol|murs?|plafond|porte|fenetre|toit)\b/.test(s)||X_SOL.test(raw)||X_MUR.test(raw))||/\b(devis|client|facture|prix|rdv)\b/.test(s)||clientDe(t))return false;
  var txt=capit(raw.replace(/[.!]+$/,""));q.notes=(q.notes||[]).concat({k:"rem",t:txt,o:raw});store();try{qNotesR();}catch(x){}noteBulle(t,"rem",txt);return true;}
function projet(t,s,c){var m,LG=window.CASO_LANGAGE;if(typeof q==="undefined")return false;if(!enFr(c))return projetX(t,s,c);
  if(PROJET&&Date.now()-PROJET.at>20*60000)PROJET=null;
  /* ouverture : une pièce à refaire, sans autre détail */
  if((m=s.match(PJ_OUV))){var cl=clientDe(t),r0=m[1],pm=(" "+r0+" ").match(PIECES);
    if(pm){var reste=(" "+r0+" ").replace(PIECES," ").replace(/\b(de|du|chez|pour|a|la|le|l|d|m|mme|monsieur|madame)\b/g," ");if(cl)reste=reste.split(hn(cl)).join(" ");
      if(!reste.trim()){PROJET={pc:pm[1]==="sdb"?"salle de bain":pm[1],cl:cl&&cliNom(cl)?cliNom(cl).nom:null,A:null,items:[],mat:null,at:Date.now()};
        bulle(t,p(T("{0} : je note. Donne la surface et les travaux, puis dis « fais le devis ».",[capit(PROJET.pc)])));return true;}}}
  if(!PROJET)return false;var P0=PROJET;
  /* la surface de la pièce */
  var x=s.replace(/^(?:elle|il|ca|la piece|la surface|c est)\s*/,"").replace(/^(?:fait|mesure|est de|de)\s*/,"").replace(/\s*(?:environ|a peu pres)\s*/," ").trim();
  if((m=x.match(/^(\d+(?:[.,]\d+)?)\s*(?:m2|m²|metres? carres?)$/))){P0.A=parseFloat(m[1].replace(",","."));P0.at=Date.now();bulle(t,p(capit(P0.pc)+" : "+N(P0.A)+" m²."));return true;}
  if((m=x.match(/^(\d+(?:[.,]\d+)?)\s*m?\s*(?:x|par|sur)\s*(\d+(?:[.,]\d+)?)\s*m?$/))){P0.A=Math.round(parseFloat(m[1].replace(",","."))*parseFloat(m[2].replace(",","."))*100)/100;P0.at=Date.now();bulle(t,p(capit(P0.pc)+" : "+N(P0.A)+" m²."));return true;}
  /* « fais-moi le devis » : tout ce qui a été noté devient un devis ; rien n'est deviné */
  if(PJ_DEVIS.test(s)){if(!P0.items.length){bulle(t,p(T("Dis-moi d’abord les travaux à faire dans la {0}.",[P0.pc])));return true;}
    var ph=P0.pc+(P0.A!=null?" "+String(P0.A).replace(".",",")+" m²":"")+", "+P0.items.join(", ")+(P0.cl?" pour "+P0.cl:"");PROJET=null;
    SYNTH=true;var okd=false;try{okd=P.decrire(ph,{aff:t,sansEstim:true});}finally{SYNTH=false;}if(okd)return true;PROJET=P0;return false;}
  /* un travail : « on enlève tout le carrelage », « on met du nouveau au sol et aux murs », « changer le lavabo » */
  if(B().isQuestion&&B().isQuestion(t))return false;
  if(/^(?:nouveau|nouvelle|rdv|rendez vous|envoie|ouvre|montre|affiche|supprime|annule|relance|combien|client)\b/.test(s)||/\d\s*(?:€|euros?)/.test(s))return false;
  /* plusieurs travaux dans le message (« dépose carrelage, pose faïence, receveur ») : chacun est lu à part */
  var nouv=[],brutS=[];String(t).split(/\s*[,;]\s*/).forEach(function(m0){if(!m0.trim())return;var sub=m0.split(/\s+(?:et|puis)\s+/);
    /* « un receveur et une paroi » : deux travaux ; « au sol et aux murs » : un seul */
    if(sub.length>1&&LG&&sub.every(function(x){return !!LG.terme(x);}))sub.forEach(function(x){brutS.push(x);});else brutS.push(m0);});
  brutS.forEach(function(t1){var s1=hn(t1).replace(/[’']/g," ").replace(/[.!?]+/g," ").replace(/\s+/g," ").trim();
  var y=s1.replace(/^(?:et |puis |ensuite |aussi )?(?:on (?:va |doit )?|il faut |faut |je (?:vais |dois )?|faudra )/,"").replace(/\b(?:tout le|toute la|tous les|toutes les)\b/g,"le").trim(),dep=PJ_DEP.test(y);
  var lieux=[];if(/\b(?:au |le |du |par )?sol\b/.test(y))lieux.push("sol");if(/\b(?:aux? |les? |des |sur les )?murs?\b|\bmural/.test(y))lieux.push("mur");if(/\bplafond\b/.test(y))lieux.push("plafond");
  var tm=LG?LG.terme(t1):null;
  /* « dépose carrelage » : le travail est la dépose, le terme est ce qu'on dépose */
  if(dep&&LG&&(!tm||/^d[ée]pose/i.test(tm.ecrit||""))){var t2=String(t1).replace(/(?:d[ée]poser?|enlever|retirer|virer|arracher|d[ée]molir)/ig," "),tm2=LG.terme(t2);if(tm2&&!/^d[ée]pose/i.test(tm2.ecrit||""))tm=tm2;}
  if(tm&&/^(mur|dalle)$/.test(tm.id)&&lieux.length)tm=null;var mat=tm&&tm.type==="mat"?tm.ecrit.toLowerCase():null;
  /* « du nouveau », « du neuf » : le dernier matériau dit */
  if(!tm&&/\b(?:du |le |un )?(?:nouveau|neuf|pareil|meme)\b/.test(y)&&P0.mat)mat=P0.mat;
  if(mat){if(tm&&tm.type==="mat")P0.mat=mat;
    if(dep)nouv.push("dépose "+mat);
    else if(lieux.length>1||lieux[0]==="mur"&&/carrelage|parquet|vinyle/.test(mat))lieux.forEach(function(l){nouv.push(l==="mur"?(mat==="carrelage"?"carrelage mural":mat+" murs"):l==="plafond"?mat+" plafond":mat);});
    else nouv.push(mat);}
  else if(tm&&!(dep&&/^d[ée]pose/i.test(tm.ecrit||""))){nouv.push((dep?"dépose ":"")+tm.ecrit.toLowerCase());}
  });
  nouv=nouv.filter(function(n,i){return nouv.indexOf(n)===i;});
  if(!nouv.length)return false;
  nouv.forEach(function(n){if(P0.items.indexOf(n)<0)P0.items.push(n);});P0.at=Date.now();
  bulle(t,p(T("Noté : {0}.",[nouv.join(", ")])));return true;}
/* ---------- dernier recours avant « Je n'ai pas compris » : un travail dit sans « faut » ----------
   « refaire la gouttière », « poser un IPN pour l'ouverture », « évacuation des gravats à la benne » : un verbe à l'infinitif
   ou un nom de travail, et un mot du lexique. Gardé dans les notes À faire du devis (jamais envoyées au client). Le message est déjà affiché. */
var TRAVAIL=/^(?:refaire|faire|poser|reposer|mettre|remettre|changer|remplacer|installer|reprendre|deposer|monter|demonter|prevoir|evacuer|couler|isoler|peindre|repeindre|enduire|reparer|demolir|casser|percer|raccorder|brancher|fixer|coller|jointer|poncer|vitrifier|lessiver|reboucher|ragreer|carreler|plaquer|doubler|cloisonner|etancher|nettoyer|proteger|ramoner|deboucher|purger|regler|controler|verifier|depose|pose|evacuation|demolition|refection|remplacement|reprise|isolation|peinture|installation|creation|reparation|raccordement|nettoyage|protection|fourniture|ouverture|percement|demol)\b/;
P.travail=function(t){try{var LG=window.CASO_LANGAGE,c=fr(t);if(!LG||!enFr(c)||typeof q==="undefined")return false;
    var net=LG.nettoie(t).t.trim().replace(/[.!]+$/,""),k=LG.nz(net).replace(/^(?:il faut|faut|a faire) /,"");
    if(!TRAVAIL.test(k)||/\d/.test(k)||k.split(" ").length>14||B().isQuestion&&B().isQuestion(t)||clientDe(t))return false;
    var tm=LG.terme(net);if(!tm||tm.type==="piece")return false;
    var txt=capit(net.replace(/^(?:il faut|faut)\s+/i,""));if(String(t)===String(t).toUpperCase())txt=capit(txt.toLowerCase());
    if(!(q.notes||[]).some(function(n){return n.t===txt;}))q.notes=(q.notes||[]).concat({k:"todo",t:txt});store();try{qNotesR();}catch(x){}CHAT.qid=q.id;
    CHAT.m.push({who:"bot",html:'<p class="mut"><b>À faire</b> : <span data-noi18n dir="auto">'+e(txt)+'</span></p><div class="msg-act"><button class="btn sm sec" onclick="go(\'edit\')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>'});return true;}catch(x){if(window.console)console.error(x);return false;}};
/* ---------- constats : « Le mur est abîmé. » « Celui de droite. » « Il faut le reprendre aussi derrière la porte. » ----------
   Un constat reste un constat : il est gardé dans les notes du devis (jamais envoyées au client), sans cause ni travaux déduits. */
var SUJET=null;
/* « mort », « foutue », « pourris » → le mot du compte rendu, accordé comme le mot tapé */
function etatPro(typed,art){var D=window.CASO_LEXBTP,k=hn(typed).replace(/^(?:tout|toute|completement|bien|tres|trop|un peu|assez) /,""),avant=hn(typed).slice(0,hn(typed).length-k.length),L=D&&D.etatPro||[];
  for(var i=0;i<L.length;i++){var F=L[i][0].split("|"),j=F.indexOf(k);if(j<0)continue;var pro=L[i][1];if(pro.charAt(0)!=="*")return (avant?String(typed).slice(0,avant.length):"")+pro;
    pro=pro.slice(1);var base=F[0],sing=k.replace(/s$/,""),fem=sing===base+"e",plu=k!==base&&/s$/.test(k)||art==="les";
    return (avant?String(typed).slice(0,avant.length):"")+pro+(fem&&!/e$/.test(pro)?"e":"")+(plu?"s":"");}
  return typed;}
function noteBulle(t,k,txt){CHAT.qid=q.id;bulle(t,'<p class="mut"><b>'+e(T(k==="todo"?"À faire":"Remarques"))+'</b> : <span data-noi18n dir="auto">'+e(txt)+'</span></p><div class="msg-act"><button class="btn sm sec" onclick="go(\'edit\')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>',null,true);}
function constat(t,s){var D=window.CASO_LEXBTP,m;if(!D||typeof q==="undefined")return false;if(!enFr(fr(t)))return constatX(t,s);
  if(SUJET&&Date.now()-SUJET.at>10*60000)SUJET=null;
  var ET="(?:tout |toute |completement |bien |tres |trop |un peu |assez )?("+D.etat+"|abime|abimee|abimes|abimees|fissure|fissuree|fissures|humide|humides|moisi|moisie|decolle|decollee|gonfle|gonflee|use|usee|rouille|rouillee|a changer|a reprendre)";
  if((m=s.match(new RegExp("^(le|la|les|l) (.{2,40}?) (?:est|sont|c est) "+ET+"$")))&&!/\b(devis|client|facture|prix|rdv|rendez vous|planning|total)\b/.test(m[2])&&!clientDe(t)){
    var raw=String(t).trim().replace(/[.!]+$/,""),mr=raw.match(/^(?:les|le|la|l['’])\s*(.+?)\s+(?:est|sont)\s+(.+)$/i),nom=mr?mr[1]:m[2],etat=etatPro(mr?mr[2]:m[3],m[1]),before=JSON.stringify(q),txt=capit(nom)+" "+etat;
    /* la phrase de l'artisan est gardée avec la note (o) */
    q.notes=(q.notes||[]).concat({k:"rem",t:txt,o:raw});store();try{qNotesR();}catch(x){}
    SUJET={art:m[1],nom:nom,etat:etat,txt:txt,qid:q.id,at:Date.now()};noteBulle(t,"rem",txt);return true;}
  if(!SUJET||SUJET.qid!==q.id)return false;
  /* « Celui de droite. » : précise le constat d'avant */
  if((m=s.match(/^(?:celui|celle|ceux|celles)(?: la| ci)? (?:(?:de|du|d|des|a|au|dans|sous|sur|derriere|devant|pres|cote) .{2,40}|en .{2,30})$/))){
    var prec=String(t).trim().replace(/[.!]+$/,"").replace(/^(?:celui|celle|ceux|celles)(?:[- ]l[aà]|[- ]ci)?\s+/i,""),n0=(q.notes||[]).filter(function(n){return n.t===SUJET.txt;})[0],nt=capit(SUJET.nom)+" "+prec+" "+SUJET.etat;
    if(n0)n0.t=nt;else q.notes=(q.notes||[]).concat({k:"rem",t:nt});SUJET.txt=nt;SUJET.nom=SUJET.nom+" "+prec;SUJET.at=Date.now();store();try{qNotesR();}catch(x){}noteBulle(t,"rem",nt);return true;}
  /* « Il faut le reprendre aussi derrière la porte. » : « le » = ce dont on vient de parler */
  if((m=s.match(/^(?:il faut|faut|faudra|on doit|il faudrait) (?:le|la|les|l) ([a-z]+er|[a-z]+ir|[a-z]+re)\b(.*)$/))){
    var rw=String(t).trim().replace(/[.!]+$/,"").match(/^(?:il\s+)?(?:faut|faudra|faudrait|on doit)\s+(?:le|la|les|l['’])\s*(\S+)\s*(.*)$/i),verbe=rw?rw[1]:m[1],suite2=rw?rw[2]:m[2].trim();
    var td=capit(verbe)+" "+(SUJET.art==="l"?"l'":SUJET.art+" ")+SUJET.nom+(suite2?", "+suite2:"");q.notes=(q.notes||[]).concat({k:"todo",t:td});SUJET.at=Date.now();store();try{qNotesR();}catch(x){}noteBulle(t,"todo",td);return true;}
  return false;}
var STN={brouillon:"brouillon",envoye:"envoyé",accepte:"accepté",paye:"payé",refuse:"refusé",expire:"expiré"};
function listeDevis(L,avecClient){return '<div class="msg-lines">'+L.map(function(o){return '<div class="ml" role="button" tabindex="0" style="cursor:pointer" onclick="casoPont.voir(\''+e(o.id)+'\')"><div><b data-noi18n>'+e(avecClient&&o.client?o.client:T("Devis {0}",[o.num||""]).trim())+'</b><div class="mut" data-noi18n>'+e([avecClient&&o.num?o.num:"",o.date?dFR(o.date):"",T(STN[o.status||"brouillon"]||"brouillon")].filter(Boolean).join(" · "))+'</div></div><b data-noi18n>'+e(E(totals(o).ttc))+' TTC</b></div>';}).join("")+'</div>';}
function usage(t,c){var s=c.p.replace(/[?!.…]+/g," ").replace(/\s+/g," ").trim(),m,cl;
  /* « rdv Petit vendredi 8h pour le métré de la cuisine » : un rendez-vous, pas un plan de pièce */
  if(/^(?:rdv|rendez vous)\b/.test(s)&&/ pour (?:le |la |l |un |une |du |des )/.test(" "+s)&&typeof agChat==="function")return !!agChat(t);
  /* « Martin a tout payé », « Petit a réglé le solde » : l'encaissement des factures (avant, la phrase créait une ligne de devis) */
  if(projet(t,s,c))return true;
  if(constat(t,s))return true;
  /* « Martin a tout payé », « Petit a réglé sa facture » (sans montant) : le reste dû est encaissé après un Oui */
  if((m=s.match(/^(.+?) (?:m a |a |ont )(?:deja |bien )?(?:tout (?:paye|regle|vire|solde)|(?:paye|regle|vire|solde) (?:tout|le reste|le solde|la totalite|sa facture|toute sa facture|toute la facture|la facture))(?: (?:en |par )(?:especes?|liquide|cheque|carte|cb|virement))?$/))&&(cl=clientDe(t))&&cliNom(cl)&&P.demander&&typeof faDue==="function"&&typeof faPayAdd==="function"){
    var np=cliNom(cl).nom,FP=(db.invoices||[]).filter(function(x){return x&&x.num&&x.kind!=="avoir"&&x.client&&cle(x.client.nom)===cle(np)&&faDue(x)>0.005;}).sort(function(a,b){return String(a.date).localeCompare(String(b.date));});
    if(!FP.length){bulle(t,p(T("Aucune facture à encaisser pour {0}.",[np])));return true;}
    var fx=FP[0],am=faDue(fx),mode=/cheque/.test(s)?"chq":/espece|liquide/.test(s)?"esp":/carte|\bcb\b/.test(s)?"cb":"vir";CHAT.m.push({who:"me",text:t});
    P.demander(p(T("Enregistrer le paiement du reste dû par {0} : {1} ({2}) ?",[np,E(am),fx.num])),function(){faPayAdd(fx,{d:agToday(),amt:am,mode:mode});try{faAfterPay(fx);}catch(x){}try{save();}catch(x){}try{faShareSync(fx).catch(function(){});}catch(x){}
      bulle(null,p(T("Paiement enregistré : {0} · {1}.",[E(am),fx.num])));});return true;}
  /* « relance Martin » */
  if((m=s.match(/^(?:relance|relancer|envoie une relance a|fais une relance a|fais une relance pour)\s+(.+)$/))&&(cl=clientDe(t))&&cliNom(cl)&&P.relanceCible){var nr=cliNom(cl).nom,cb=P.relanceCible(nr);
    if(!cb){bulle(t,p(T("Rien à relancer pour {0}.",[nr])));return true;}
    bulle(t,p(cb.f?T("Relance de la facture {0} ({1} restant dû).",[cb.num,E(cb.du)]):T("Relance du devis de {0}.",[nr])));try{P.relanceFaire(cb);}catch(x){if(window.console)console.error(x);}return true;}
  /* « nouveau client : Mme Leroy, 06 11 22 33 44, 5 rue des Roses à Lyon » : nom, téléphone, adresse (avant : un client « Lyon ») */
  if((m=String(t).match(/^\s*(?:nouveau client|nouvelle cliente|nouveau contact|(?:ajoute|ajouter|cr[ée]e|cr[ée]er|enregistre)\s+(?:le |la |un |une )?(?:nouveau |nouvelle )?client(?:e)?)\s*:?\s+(.+)$/i))&&/,|\d{2}[\s.]?\d{2}|@/.test(m[1])&&typeof upsert==="function"){
    var rest=m[1],tel=(rest.match(/(?:\+\d{2}\s?|0)[1-9](?:[\s.-]?\d{2}){4}/)||[])[0]||"",mail=(rest.match(/[^\s,;]+@[^\s,;]+\.[^\s,;]+/)||[])[0]||"";
    if(tel)rest=rest.replace(tel," , ");if(mail)rest=rest.replace(mail," , ");
    var parts=rest.split(/\s*[,;]\s*/).map(function(x){return x.replace(/^(?:tel|tél|téléphone|telephone|portable|mail|email|e-mail|adresse|habite|au)\s*:?\s*$/i,"").replace(/\s+(?:tel|tél|téléphone|portable|au)\s*:?\s*$/i,"").trim();}).filter(Boolean);
    var nom=(parts.shift()||"").replace(/^(m\.|mme|mlle|monsieur|madame|mr|mrs)\s+/i,"").trim(),adr=parts.join(", ").replace(/^(?:adresse|habite|au)\s*:?\s+/i,"").trim();
    if(nom&&nom.split(/\s+/).length<=4&&/^[\p{L}' -]+$/u.test(nom)){nom=nom.split(/\s+/).map(function(w){return w.charAt(0).toUpperCase()+w.slice(1);}).join(" ");
      var r0=upsert("clients",{nom:nom,tel:tel,adr:adr,email:mail}),dt=[tel,mail,adr].filter(Boolean).join(" · ");try{save();}catch(x){}
      bulle(t,p(r0.isNew?T("Nouveau client : {0}.",[nom]).replace(/\.\s*$/,"")+(dt?" · "+dt:"")+".":T("Fiche de {0} à jour{1}.",[r0.x.nom,dt?" : "+dt:""])));return true;}}
  /* « mes devis en attente », « les devis pas signés », « le dernier devis de Petit » */
  if(/^(?:montre moi |montre |affiche |liste |quels sont |ou sont )?(?:mes |les |tous mes |tous les )?devis (?:en attente|en cours|pas (?:encore )?signes?|non signes?|sans reponse|envoyes?|a relancer|pas (?:encore )?acceptes?)$/.test(s)){
    var LA=(db.quotes||[]).filter(function(o){return o&&/^(|brouillon|envoye)$/.test(o.status||"")&&(o.lines||[]).some(function(l){return l.label;})&&(!/envoye|sans reponse|a relancer/.test(s)||o.status==="envoye");}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""));});
    bulle(t,LA.length?listeDevis(LA.slice(0,8),true):p(T("Aucun devis en attente.")));return true;}
  if(/^(?:le |mon |ouvre le |montre le |montre moi le |affiche le |c est quoi le |quel est le )?dernier devis (?:de|du|d|pour|chez)\b/.test(s)&&(cl=clientDe(t))&&cliNom(cl)){var nd=cliNom(cl).nom,LD=(db.quotes||[]).filter(function(o){return o&&o.client===nd&&(o.lines||[]).some(function(l){return l.label;});}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""));});
    bulle(t,LD.length?listeDevis(LD.slice(0,1)):p(T("Aucun devis pour {0}.",[nd])));return true;}
  /* juste après un rendez-vous ajouté : « mets-le plutôt à 10h » le déplace (avant : un deuxième rendez-vous « Mets-le plutôt ») */
  var der=null;if(typeof CHAT!=="undefined"&&CHAT.m)for(var di=CHAT.m.length-1;di>=0&&di>=CHAT.m.length-3;di--){var dm=CHAT.m[di];if(dm.who!=="bot")break;if(dm.ev){der=dm;break;}}
  if(der&&der.who==="bot"&&der.ev&&(m=s.match(/^(?:(?:mets|met|decale|deplace|change|passe|fais) (?:le|la)|plutot|en fait|finalement|non)[ ,]*(?:plutot |en fait |finalement )?(?:a |pour |vers )?(\d{1,2}) ?h ?(\d{2})?$/))&&+m[1]<24&&typeof agCard==="function"){
    var ev=(db.events||[]).filter(function(x){return x.id===der.ev;})[0];
    if(ev){var old=JSON.stringify(ev),mn=function(h){var z=String(h||"").split(":");return (+z[0]||0)*60+(+z[1]||0);},hm=function(n){n=Math.min(1439,n);return (n<600?"0":"")+Math.floor(n/60)+":"+(n%60<10?"0":"")+n%60;},dur=ev.a&&ev.b?mn(ev.b)-mn(ev.a):60,na=(+m[1])*60+(+(m[2]||0));
      ev.a=hm(na);ev.b=hm(na+dur);ev.at=Date.now();try{agRemCompute(ev);}catch(x){}try{save();}catch(x){}
      CHAT.m.push({who:"me",text:t});CHAT.m.push({who:"bot",html:'<p><svg class="i i-sm"><use href="#i-clock"/></svg> <span>Rendez-vous déplacé</span></p>'+agCard(ev,agCheck(ev)),agUndo:"mod:"+old,ev:ev.id});chatSave();chatRender(true);
      var ip=document.getElementById("chatIn");if(ip){ip.value="";try{chatGrow(ip);qkUpdate();}catch(x){}}return true;}}
  /* « arrondis à 600 € » : pas un nouveau service nommé « Arrondis » */
  if(/^arrondi[srt]?\b/.test(s)||/^\s*arrondi[srt]?\b/i.test(t)){bulle(t,p(T("Je ne sais pas arrondir un devis. Dis par exemple « remise de 5 % ».")));return true;}
  /* le devis en cours */
  if(enCours()){
    var etr=(c.lang||"fr")!=="fr";
    if(TOT1.test(s)||TOT2.test(s)&&/combien/.test(s)||etr&&/\b(combien|total)\b/.test(s)&&!/\d/.test(s)&&s.split(" ").length<=5&&ligneDe(s.replace(/\b(combien|total|prix|le|la|dans|est)\b/g," "),db.prices||[])<0){var tt=totals(q);bulle(t,p(q.client?T("Devis en cours ({0}) : {1} HT, {2} TTC.",[q.client,E(tt.ht),E(tt.ttc)]):T("Devis en cours : {0} HT, {1} TTC.",[E(tt.ht),E(tt.ttc)]))+(function(){var vf=P.verifier(q);return vf?vf.replace("<p ","<p data-noi18n "):"";})());return true;}
    if((m=s.match(SUPL))&&!/\d/.test(m[1])&&!/^(devis|client|rendez vous|rdv|remise|acompte|tva|tout|marge|note|remarque)/.test(m[1])&&!clientDe(t)){var li=ligneDe(m[1],q.lines);
      if(li>=0){var before=JSON.stringify(q),l0=q.lines[li];q.lines.splice(li,1);fillForm();store();CHAT.qid=q.id;
        bulle(t,'<p dir="auto" data-noi18n>'+e(T("{0} retiré du devis.",[l0.label]))+'</p>'+piedDevis(),{undo:before},true);return true;}
      /* un de mes services qui n'est pas dans ce devis : le dire (avant, la phrase ajoutait la ligne) */
      if(ligneDe(m[1],db.prices||[])>=0){bulle(t,p(T("Je ne trouve pas « {0} » dans le devis.",[m[1]])));return true;}}
    var X=null,n=null,u=null;
    if((m=s.match(Q1))){n=m[1];u=m[2];X=m[3]||null;}else if((m=s.match(Q3))||(m=s.match(Q2))){X=m[1];n=m[2];u=m[3];}
    if(n==null&&(m=s.match(Q0))){n=m[1];u=null;}
    if(n!=null&&u==null){var lk=q.lines.length-1;while(lk>=0&&!q.lines[lk].label)lk--;if(lk>=0)u=q.lines[lk].unit;}
    if(n!=null){var v=parseFloat(String(n).replace(",",".")),lj=-1;
      if(X)lj=ligneDe(X.replace(/\s+(?:du|au|dans le|sur le) devis$/,""),q.lines);
      else for(var i=q.lines.length-1;i>=0&&lj<0;i--)if(q.lines[i].label&&uni(q.lines[i].unit)===uni(u))lj=i;
      if(lj>=0&&v>0&&uni(q.lines[lj].unit)===uni(u)){var bf=JSON.stringify(q),l1=q.lines[lj];l1.qty=v;fillForm();store();CHAT.qid=q.id;bulle(t,carteL(l1)+piedDevis(),{undo:bf},true);return true;}}
  }
  /* « quel est le prix du carrelage ? », « le carrelage est à combien ? » : mon prix enregistré */
  if((m=s.match(PRX1)||s.match(PRX2)||s.match(PRX3)||s.match(PRX4))&&!/\b(devis|facture|chantier|client|total)\b/.test(m[1])){
    var four=null;(db.suppliers||[]).forEach(function(f){if(f&&f.nom&&(" "+s+" ").indexOf(" "+hn(f.nom)+" ")>=0)four=f.nom;});
    var achat=!!four||/\b(chez|fournisseurs?|achat|achete|achetes?|paye|payes?|moins cher|meilleur|magasin)\b/.test(s),X0=m[1].replace(/\s+(?:chez|au|a|en) .*$/,"").trim();
    if(!achat&&!/\d/.test(X0)){var pi=ligneDe(X0,db.prices||[]);
      if(pi>=0){var pr=db.prices[pi];bulle(t,'<p dir="auto" data-noi18n><b lang="fr">'+e(pr.nom)+'</b> : '+e(E(nombre(pr.prix))+" HT"+(pr.unit?" / "+pr.unit:""))+'</p>');return true;}}
    /* pas un de mes services : le prix payé chez mes fournisseurs (factures d'achat) */
    var H=(db.hist||[]).filter(function(h){return h.four&&+h.prix>0&&(!four||cle(h.four)===cle(four));}),HW=H.map(function(h){return mots(h.nom);}),pw=mots(X0).filter(function(w){return HW.some(function(L){return L.indexOf(w)>=0;});});
    if(pw.length){var best={};H.forEach(function(h,i){if(!pw.every(function(w){return HW[i].indexOf(w)>=0;}))return;var k=cle(h.four),o=best[k];if(!o||String(h.date)>String(o.date))best[k]={four:h.four,prix:+h.prix,unit:h.unit,date:h.date};});
      var LB=Object.keys(best).map(function(k){return best[k];}).sort(function(a,b){return a.prix-b.prix;});
      if(LB.length){bulle(t,p(T("Prix d’achat de « {0} » : {1}.",[pw.join(" "),LB.slice(0,4).map(function(x){return x.four+" "+E(x.prix)+(x.unit&&x.unit!=="u"?" / "+x.unit:"")+(x.date?" ("+String(x.date).slice(8,10)+"/"+String(x.date).slice(5,7)+")":"");}).join(" · ")])));return true;}}
    if(s.match(PRX1)&&!achat&&(c.lang||"fr")==="fr"&&X0.split(" ").length<=4&&!/\d/.test(X0)){bulle(t,p(T("« {0} » n’est pas dans tes services.",[X0])));return true;}}
  else if((c.lang||"fr")!=="fr"&&/\bprix\b/.test(s)&&!/\d/.test(s)&&!/\b(devis|facture|total)\b/.test(s)){var pj=ligneDe(s.replace(/^.*\bprix\b/,"").replace(/\b\p{L}{1,3}\b/gu," "),db.prices||[]);
    if(pj>=0){var pr2=db.prices[pj];bulle(t,'<p dir="auto" data-noi18n><b lang="fr">'+e(pr2.nom)+'</b> : '+e(E(nombre(pr2.prix))+" HT"+(pr2.unit?" / "+pr2.unit:""))+'</p>');return true;}}
  /* « est-ce que Martin a signé le devis ? », « où en est le devis de Martin ? » : l'état de ses devis */
  if(/\bdevis\b/.test(s)&&(B().isQuestion&&B().isQuestion(t)&&(ETAT.test(s)||/\b(ou en est|etat|statut|envoye|repondu|reponse|des nouvelles)\b/.test(s))||/^(?:est ce|ou en est)\b/.test(s)||/^(?:le |quel est le )?(?:prix|montant) (?:du|des) devis\b/.test(s))&&(cl=clientDe(t))&&cliNom(cl)){
    var nq=cliNom(cl).nom,LQ=(db.quotes||[]).filter(function(x){return x.client===nq&&(x.lines||[]).some(function(l){return l.label;});}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""));});
    if(!LQ.length){bulle(t,p(T("Aucun devis pour {0}.",[nq])));return true;}
    bulle(t,listeDevis(LQ.slice(0,5)));return true;}
  /* « le devis de Martin est signé », « Martin a refusé le devis » : l'état change après un Oui */
  if(/\bdevis\b/.test(s)&&(m=s.match(ETAT))&&!(B().isQuestion&&B().isQuestion(t))&&!/^(?:est ce|si|quand|des que)\b/.test(s)&&(cl=clientDe(t))&&cliNom(cl)&&P.demander){
    var nc=cliNom(cl).nom,ref=/^(refuse|refusee|dit non|decline|perdu)$/.test(m[1]),att=function(o){return o&&(o.lines||[]).some(function(l){return l.label;})&&/^(|brouillon|envoye)$/.test(o.status||"")&&!(o.sign&&o.sign.st==="signed");};
    var o=typeof q!=="undefined"&&q&&q.client===nc&&att(q)&&(db.quotes||[]).filter(function(x){return x.id===q.id;})[0]||(db.quotes||[]).filter(function(x){return x.client===nc&&att(x);}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""));})[0];
    if(!o){bulle(t,p(T("Je ne trouve pas de devis en attente pour {0}.",[nc])));return true;}
    CHAT.m.push({who:"me",text:t});var tt2=totals(o),nv=ref?"refuse":"accepte";
    P.demander(p(T(ref?"Passer le devis de {0} ({1} TTC) en « refusé » ?":"Passer le devis de {0} ({1} TTC) en « accepté » ?",[nc,E(tt2.ttc)])),function(){o.status=nv;if(typeof q!=="undefined"&&q&&q.id===o.id)q.status=nv;try{save();}catch(x){}
      bulle(null,p(T(ref?"Devis de {0} : refusé.":"Devis de {0} : accepté.",[nc])));});return true;}
  return false;}
P.question=function(t){langue();if(!P.ready||typeof db==="undefined")return false;var c=fr(t),s=" "+c.p+" ";
  try{if(usage(t,c))return true;}catch(x){if(window.console)console.error(x);}
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
var URL0=(window.CASO_APPRIS||"https://app-e6c6e91c-8623-4524-95ef-2cefb8b67f7b.cleverapps.io")+"/api/appris",AK="caso_ia_partage";
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
 P.demander=demander;

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
 /* « relance Martin » : sa facture en retard d'abord (message prêt à envoyer), sinon son devis envoyé sans réponse */
 P.relanceCible=function(nc){var k=hn(nc),F=(db.invoices||[]).filter(function(x){return x&&x.num&&x.kind!=="avoir"&&x.client&&hn(x.client.nom)===k&&typeof faDue==="function"&&faDue(x)>0.005;}).sort(function(a,b){return String(a.date).localeCompare(String(b.date));})[0];
  if(F)return {f:F.id,num:F.num,du:faDue(F)};
  var Q=(db.quotes||[]).filter(function(o){return o&&o.status==="envoye"&&hn(o.client)===k;}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""));})[0];return Q?{q:Q.id}:null;};
 P.relanceFaire=function(c){if(c.f){ACO=c.f;P.relancer();}else if(c.q){REL=[c.q];P.relancerDevis();}};
 P.relance=function(id){var o=(db.quotes||[]).filter(function(x){return x.id===id;})[0];if(!o)return;o.relances=(o.relances||[]).concat(Date.now());try{storeQ(o);}catch(x){save();}};
 var ACO=null;P.relancer=function(){var id=ACO;ACO=null;if(!id||typeof faShow!=="function")return;faShow(id);if(typeof faRelance==="function")setTimeout(faRelance,400);};
 /* fin de chantier : le dernier jour au planning est passé → facture (de solde s'il y a eu un acompte) */
 function finis(){var auj=ymd(new Date());return (db.quotes||[]).filter(function(o){if(!o||o.status!=="accepte"||o.ench2)return false;var E2=(db.events||[]).filter(function(x){return x.qid===o.id;});if(!E2.length)return false;
   if(E2.some(function(x){return x.d>=auj;}))return false;return !(typeof faOfQuote==="function"&&faOfQuote(o.id).some(function(f){return f.kind!=="acompte"&&f.kind!=="avoir";}));});}
 function proposerFin(o){o.ench2=1;try{storeQ(o);}catch(x){save();}langue();var t=0,ac=0;try{t=totals(o).ttc;ac=faOfQuote(o.id).filter(function(f){return f.kind==="acompte";}).reduce(function(a,f){return a+faTot(f).ttc;},0);}catch(x){}
  var txt=ac>0?T("Chantier de {0} terminé : facture de solde de {1} ?",[o.client||"",E(t-ac)]):T("Chantier de {0} terminé : facture de {1} ?",[o.client||"",E(t)]);
  demander('<p>'+e(txt)+'</p>',function(){if(typeof faNew==="function")faNew(o.id);});}
 /* pointage par la position, appli ouverte (iPhone, site web ; l'appli Android pointe seule en arrière-plan) :
    sur un chantier du jour → « je pointe ton arrivée ? » ; loin du chantier en cours → « je pointe ta sortie ? » */
 function natif(){try{return !!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());}catch(x){return false;}}
 function moiPt(){var P0=db.people||[],a=(typeof accountGet==="function"&&accountGet())||{},u="";try{u=String((getSync()||{}).user||"").trim().toLowerCase();}catch(x){}
  var n=u||String(a.prenom||"").split(" ")[0].toLowerCase(),f=P0.filter(function(p){return String(p.nom||"").toLowerCase()===n;})[0];return f?f.id:P0.length===1?P0[0].id:null;}
 function dist(a,b){var R=6371e3,r=Math.PI/180,dl=(b.lat-a.lat)*r,dn=(b.lng-a.lng)*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)*Math.sin(dn/2);return 2*R*Math.asin(Math.sqrt(x));}
 function geoChantier(c,adr){if(c.geo)return Promise.resolve(c.geo);var q=adr||c.adr||c.nom;if(!q||!navigator.onLine)return Promise.resolve(null);
  return fetch("https://data.geopf.fr/geocodage/search?limit=1&q="+encodeURIComponent(q)).then(function(r){return r.ok?r.json():null;}).then(function(j){var f=j&&(j.features||[])[0];if(!f||!f.geometry)return null;
   c.geo={lat:f.geometry.coordinates[1],lng:f.geometry.coordinates[0]};if(!c.rayon)c.rayon=100;save();return c.geo;}).catch(function(){return null;});}
 function chantiersDuJour(me){var auj=typeof agToday==="function"?agToday():ymd(new Date()),now=Date.now(),L=[];if(typeof agDayEvents!=="function")return L;
  agDayEvents(auj).forEach(function(ev){if(ev.t!=="rdv"||!ev.a||(ev.who||[]).indexOf(me)<0)return;var cl=ev.cid&&(db.clients||[]).filter(function(c){return c.id===ev.cid;})[0],adr=ev.adr||(cl&&cl.adr)||"";if(!adr&&!ev.ch)return;
   var t0=new Date(auj+"T"+ev.a+":00").getTime(),t1=ev.b?new Date(auj+"T"+ev.b+":00").getTime():t0+36e5;if(now<t0-36e5||now>t1+2*36e5)return;
   var cid=typeof agChFor==="function"?agChFor(ev):ev.ch;if(cid)L.push({cid:cid,adr:adr});});return L;}
 function ouvert(me){var last=null;(db.pts||[]).forEach(function(x){if(x.p===me&&(!last||x.ts>last.ts))last=x;});return last&&last.t==="in"?last:null;}
 var GPSV=0;function gps(){if(ATT||natif()||!navigator.geolocation||typeof db==="undefined"||!db.people||!db.pts||Date.now()-GPSV<4*60000)return;var me=moiPt();if(!me)return;
  var cur=ouvert(me),L=chantiersDuJour(me);if(!cur&&!L.length)return;GPSV=Date.now();
  var lire=function(){navigator.geolocation.getCurrentPosition(function(pos){var here={lat:pos.coords.latitude,lng:pos.coords.longitude},acc=Math.min(pos.coords.accuracy||50,200),hh=function(){var d=new Date();return d.getHours()+"h"+(d.getMinutes()<10?"0":"")+d.getMinutes();};
    var ch=function(id){return (db.chantiers||[]).filter(function(c){return c.id===id;})[0];};
    if(cur){var c0=ch(cur.c);if(c0&&c0.geo&&dist(here,c0.geo)>Math.max(300,(c0.rayon||100)+acc)){langue();demander('<p>'+e(T("Tu as quitté le chantier {0} ? Je pointe ta sortie à {1} ?",[c0.nom||"",hh()]))+'</p>',function(){db.pts.push({id:uid(),c:cur.c,p:me,t:"out",ts:Date.now(),note:"position (casô ouvert)"});save();bot('<p>'+e(T("C’est fait."))+'</p>');});}return;}
    (function suivant(i){if(i>=L.length)return;var c=ch(L[i].cid);if(!c)return suivant(i+1);geoChantier(c,L[i].adr).then(function(g){if(g&&dist(here,g)<=(c.rayon||100)+acc){langue();
      demander('<p>'+e(T("Tu es sur le chantier {0} : je pointe ton arrivée à {1} ?",[c.nom||"",hh()]))+'</p>',function(){db.pts.push({id:uid(),c:c.id,p:me,t:"in",ts:Date.now(),note:"position (casô ouvert)"});save();bot('<p>'+e(T("C’est fait."))+'</p>');});}else suivant(i+1);});})(0);
   },function(){},{enableHighAccuracy:true,timeout:15000,maximumAge:0});};
  var ok=null;try{ok=localStorage.getItem("caso_gps");}catch(x){}
  if(ok==="1")return lire();if(ok==="0"||!L.length)return;
  (navigator.permissions&&navigator.permissions.query?navigator.permissions.query({name:"geolocation"}).then(function(r){return r.state;}).catch(function(){return "prompt";}):Promise.resolve("prompt")).then(function(st){
   if(st==="granted"){try{localStorage.setItem("caso_gps","1");}catch(x){}return lire();}if(st==="denied")return;langue();
   demander('<p>'+e(T("Chantier aujourd’hui : je regarde ta position quand casô est ouvert, pour pointer ton arrivée et ta sortie ?"))+'</p>',function(){try{localStorage.setItem("caso_gps","1");}catch(x){}GPSV=0;lire();});});}
 P.position=function(){GPSV=0;gps();};
 /* devis refusé : la raison, une seule question (prix, délai, autre) ; sert à « pourquoi mes devis sont refusés » */
 function refuses(){return (db.quotes||[]).filter(function(o){return o&&o.status==="refuse"&&!o.refus&&!o.ench3;});}
 var REF=null;function demanderRefus(o){o.ench3=1;try{storeQ(o);}catch(x){save();}langue();REF=o.id;
  bot('<p>'+e(T("Devis {0} de {1} refusé : pour quelle raison ?",[o.num||"",o.client||""]))+'</p><div class="msg-act">'+[["prix","Prix"],["delai","Délai"],["autre","Autre"]].map(function(r){return '<button class="btn sm sec" onclick="casoPont.raison(\''+r[0]+'\')">'+e(T(r[1]))+'</button>';}).join("")+'</div>');}
 P.raison=function(r){var o=(db.quotes||[]).filter(function(x){return x.id===REF;})[0];REF=null;if(!o)return;o.refus=r;try{storeQ(o);}catch(x){save();}langue();bot('<p>'+e(T("Noté."))+'</p>');};
 function ouverture(){try{if(!P.ready||typeof db==="undefined")return;langue();var k="caso_rappel_jour",auj=ymd(new Date()),v=null;try{v=localStorage.getItem(k);}catch(x){}
  if(v!==auj){var L=rappels();try{localStorage.setItem(k,auj);}catch(x){}if(L.length)bot(L.map(function(x){return '<p dir="auto">'+e(x)+'</p>';}).join("")+(REL.length||ACO?'<div class="msg-act">'+(REL.length?'<button class="btn sm" onclick="casoPont.relancerDevis()">'+e(T("Relancer les devis"))+'</button>':'')+(ACO?'<button class="btn sm sec" onclick="casoPont.relancer()">'+e(T("Relancer l’acompte"))+'</button>':'')+'</div>':""));}
  if(!ATT){var S=signes();if(S.length){proposerSigne(S[0]);return;}var Fn=finis();if(Fn.length){proposerFin(Fn[0]);return;}}
  if(!REF){var Rf=refuses();if(Rf.length){demanderRefus(Rf[0]);return;}}
  gps();}catch(x){}}
 (function attendre(n){if(P.ready&&typeof CHAT!=="undefined"&&typeof chatRender==="function"){setTimeout(ouverture,1500);setInterval(function(){if(!ATT&&(signes().length||finis().length))ouverture();},10*60000);setInterval(function(){if(!document.hidden)try{gps();}catch(x){}},5*60000);document.addEventListener("visibilitychange",function(){if(!document.hidden)setTimeout(ouverture,800);});return;}if(n<120)setTimeout(function(){attendre(n+1);},500);})(0);
})();

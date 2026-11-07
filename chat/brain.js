/* casô : le cerveau du chat, autonome (aucun service extérieur).
   Une phrase (10 langues) -> traduction vers le français -> commandes structurées {m,a,args}
   -> phrase précise de ce qui est compris -> exécution dans le module (en arrière-plan) ou ouverture de son écran.
   Quand il ne comprend pas : il corrige les fautes, cherche une demande proche dans ce qu'il a déjà appris, ou devine à partir
   des éléments reconnus, puis fait confirmer. Chaque confirmation, correction ou reformulation est apprise (phrases et mots). */
(function(root){
"use strict";
var MOIS=["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];
var MOISD=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
var JOURS=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
var NUMW={un:1,une:1,deux:2,trois:3,quatre:4,cinq:5,six:6,sept:7,huit:8,neuf:9,dix:10,douze:12,quinze:15,vingt:20,trente:30,cinquante:50,cent:100};
var UNITS=[["m²",/^(?:m2|m²|metres? carres?|metre carre|mc|sqm|m2s|square meters?|metros? quadrados?|metros? cuadrados?|metri quadri|metri patrati|metrekare|metrow kwadratowych|кв м|м2|م2|متر مربع)$/],["ml",/^(?:ml|metres? lineaires?|metre lineaire)$/],["m³",/^(?:m3|m³|metres? cubes?|м3)$/],["h",/^(?:h|heures?|hours?|hrs?|horas?|ore|ora|saat|godzin\p{L}*|godz|час\p{L}*|ساعات|ساعة)$/u],["jour",/^(?:jours?|j|journees?|days?|dias?|giorni|giorno|zile|zi|gun|dni|dzien|дн\p{L}*|день|ايام|يوم)$/u],["forfait",/^(?:forfaits?|flat|fixed)$/],["kg",/^(?:kilos?|kg|kilogrammes?)$/],["km",/^(?:km|kilometres?)$/],["l",/^(?:litres?|l|liters?)$/],["sac",/^(?:sacs?|bags?|sacos?|sacchi|saci|torba|workow|мешк\p{L}*)$/u],["pot",/^(?:pots?)$/],["rouleau",/^(?:rouleaux?)$/],["boite",/^(?:boites?)$/],["paquet",/^(?:paquets?)$/],["u",/^(?:unites?|u|pieces?|points?|pce|units?)$/],["ml",/^(?:metres?|m)$/]];
var QRE=/(\d+(?:\.\d+)?)\s*(m2|m²|m3|m³|ml|sqm|metres? carres?|metres? lineaires?|metres? cubes?|metres?|square meters?|metros? quadrados?|metros? cuadrados?|metri quadri|metrekare|кв м|м2|м3|heures?|hours?|hrs?|horas?|ore|saat|godzin\p{L}*|час\p{L}*|h|jours?|days?|dias?|giorni|zile|dni|дн\p{L}*|kg|kilos?|km|sacs?|bags?|sacos?|sacchi|saci|torba|pots?|rouleaux?|boites?|paquets?|litres?|l|unites?|pieces?|points?|pce|forfaits?)(?![\p{L}0-9])/gu;
function unitOf(w){w=(w||"").trim();for(var i=0;i<UNITS.length;i++)if(UNITS[i][1].test(w))return UNITS[i][0];return null;}
/* normalisation : garde toutes les lettres (latin, cyrillique, arabe), les nombres décimaux, € et % */
function hn(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ًͯ-ٰٕ]/g,"")
  .replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/ı/g,"i").replace(/ł/g,"l").replace(/ß/g,"ss")
  .replace(/œ/g,"oe").replace(/æ/g,"ae").replace(/€/g," € ").replace(/\//g," par ").replace(/(\d)\s*[.,]\s*(\d)/g,"$1.$2")
  .replace(/(\d)\s*h\s*(\d{2})\b/g,"$1h$2").replace(/[^\p{L}\p{N}²³€%.:#@ ]/gu," ").replace(/(^|\s)\.+(?=\s|$)/g," ").replace(/\.(?=\s|$)/g," ").replace(/\s+/g," ").trim();}
function pnum(s){return parseFloat(String(s).replace(",","."));}
/* ---------- langue de l'interface : réglée sur l'écran de connexion de casô (hors du chat) ----------
   Les réponses passent par tr("modèle français {0}", [valeurs]) : le français sert de clé, chaque langue a son catalogue.
   Les devis et factures restent en français (fnumFr, eurFr, fdateFr). */
var LANG="fr",I18N={},PSEUDO=false,PKEYS=null,NFC={};
var LOC={fr:"fr-FR",en:"en-GB",es:"es-ES",pt:"pt-PT",it:"it-IT",ro:"ro-RO",pl:"pl-PL",tr:"tr-TR",ru:"ru-RU",ar:"ar-u-nu-latn"};
function look(v){var c=I18N[LANG];if(!c)return null;if(Object.prototype.hasOwnProperty.call(c,v))return c[v];
  var u=v.charAt(0).toUpperCase()+v.slice(1);if(u!==v&&Object.prototype.hasOwnProperty.call(c,u)){var x=c[u];return x.charAt(0).toLowerCase()+x.slice(1);}return null;}
/* une valeur qui est un mot connu (statut, couleur, pièce, mode de paiement…) est traduite elle aussi */
function trv(v){if(typeof v!=="string"||!v)return v;if(PSEUDO)return PKEYS&&(PKEYS[v]||PKEYS[v.charAt(0).toUpperCase()+v.slice(1)])?"⟦"+v+"⟧":v;if(LANG==="fr")return v;var x=look(v);return x==null?v:x;}
function tr(t,a){var s=LANG!=="fr"&&!PSEUDO&&I18N[LANG]&&I18N[LANG][t]||t;
  if(PSEUDO)return s.split(/(\{\d+\})/).map(function(x){if(/^\{\d+\}$/.test(x)){var v=a&&a[+x.slice(1,-1)];return v==null?"":String(trv(v));}return x?"⟦"+x+"⟧":"";}).join("");
  /* arabe : les valeurs en écriture latine (noms, montants, unités) sont isolées pour que le sens de lecture reste juste */
  return a?s.replace(/\{(\d+)\}/g,function(m,k){var v=a[+k];if(v==null)return "";v=String(trv(v));return LANG==="ar"&&/[A-Za-z0-9]/.test(v)?"\u2068"+v+"\u2069":v;}):s;}
function trw(w){if(w==null||w==="")return w;w=String(w);if(PSEUDO)return "⟦"+w+"⟧";if(LANG==="fr")return w;var x=look(w);return x==null?w:x;}
function nfmt(k,o){if(NFC[k]!==undefined)return NFC[k];try{NFC[k]=new Intl.NumberFormat(LOC[LANG],o);}catch(e){NFC[k]=null;}return NFC[k];}
function fnumFr(x){var r=Math.round(x*100)/100,s=String(Math.abs(r)).split("."),i=s[0].replace(/\B(?=(\d{3})+(?!\d))/g," ");return (r<0?"-":"")+i+(s[1]?","+s[1]:"");}
function eurFr(x){var r=Math.round(x*100)/100;return (r%1?fnumFr(r).replace(/,(\d)$/,",$10"):fnumFr(r))+" €";}
function fnum(x){if(LANG==="fr")return fnumFr(x);var f=nfmt("n"+LANG,{maximumFractionDigits:2});return f?f.format(Math.round(x*100)/100):fnumFr(x);}
function eur(x){if(LANG==="fr")return eurFr(x);var r=Math.round(x*100)/100,f=nfmt("e"+LANG+(r%1?2:0),{style:"currency",currency:"EUR",currencyDisplay:"narrowSymbol",minimumFractionDigits:r%1?2:0,maximumFractionDigits:2});return f?f.format(r):eurFr(x);}
var UPL={sac:"sacs",pot:"pots",rouleau:"rouleaux",boite:"boîtes",paquet:"paquets",jour:"jours",forfait:"forfaits"};
function qty(q,u,nom){var f=fnum(q);if(LANG!=="fr"||PSEUDO){var uw=!u||u==="u"?"":trw(q>1&&UPL[u]?UPL[u]:u),nw=nom?String(trw(nom)).toLowerCase():"";return nom?(uw?tr("{0} {1} de {2}",[f,uw,nw]):f+" "+nw):f+(uw?" "+uw:"");}
  if(!u||u==="u")return f+" "+(nom||"");var uu=q>1&&UPL[u]?UPL[u]:u;return f+" "+uu+(nom?(/^[aeiouyhéèê]/i.test(nom)?" d’":" de ")+nom.toLowerCase():"");}
function esc(s){return String(s).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}
function cap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
function rxParse(s){var m=String(s).match(/^\/([\s\S]*)\/([a-z]*)$/);try{return m?new RegExp(m[1],m[2].replace("g","")+(m[2].indexOf("u")<0?"":"")):null;}catch(e){return null;}}
function clone(o){return JSON.parse(JSON.stringify(o));}
function pad(x){return x<10?"0"+x:""+x;}
function iso(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());}
function fromIso(s){var m=String(s||"").match(/^(\d{4})-(\d{2})-(\d{2})/);return m?new Date(+m[1],+m[2]-1,+m[3]):null;}
function sod(d){var x=new Date(d.getTime());x.setHours(0,0,0,0);return x;}
function addDays(d,k){var x=new Date(d.getTime());x.setDate(x.getDate()+k);return x;}
function fdateFr(d){return JOURS[d.getDay()]+" "+d.getDate()+" "+MOISD[d.getMonth()];}
function fdate(d){if(LANG==="fr")return fdateFr(d);try{return new Intl.DateTimeFormat(LOC[LANG],{weekday:"long",day:"numeric",month:"long"}).format(d);}catch(e){return fdateFr(d);}}
function moisNom(i){if(LANG==="fr")return MOISD[i];try{return new Intl.DateTimeFormat(LOC[LANG],{month:"long"}).format(new Date(2026,i,15));}catch(e){return MOISD[i];}}
function jourNom(i){if(PSEUDO)return "⟦"+JOURS[i]+"⟧";if(LANG==="fr")return JOURS[i];try{return new Intl.DateTimeFormat(LOC[LANG],{weekday:"long"}).format(new Date(2026,10,1+i));}catch(e){return JOURS[i];}}
function ftime(h,m){return LANG==="fr"?h+"h"+(m?pad(m):""):pad(h)+":"+pad(m||0);}
function has(re,s){return re.test(s);}
function wordRe(phrase){ /* phrase normalisée -> regex mot entier ; '*' = suite de lettres */
  var p=esc(phrase).replace(/\\\*/g,"\\p{L}*");return new RegExp("(^|[^\\p{L}\\p{N}])("+p+")(?=$|[^\\p{L}\\p{N}])","u");}

function create(E,X,saved,opts){
  opts=opts||{};
  var B={},M=X.m3d||{},norm=E.norm;
  /* ---------- état ---------- */
  var S={v:3,mode:"artisan",tva:20,services:(X.services0||[]).map(function(s){return {nom:s.nom,unite:s.unite,prix:null};}),
    clients:{},devis:[],cur:null,rdv:[],absences:[],factures:[],paiements:[],pointages:[],fournisseurs:[],commandes:[],
    scene:null,metres:[],courses:[],notes:[],modeles:[],maSignature:null,
    phrases:{},journal:[],unrec:[],neg:{},syn:{},roomw:{},colw:{},lex:{},iaLLM:null,
    last:{room:null,client:null,type:null},nid:1};
  if(saved)Object.keys(saved).forEach(function(k){if(k in S)S[k]=saved[k];});
  function newScene(){return {lv:0,levels:[{rooms:{}}],roof:null,ext:{jardin:false,route:false,allee:false,haie:false,cloture:null,items:[]},terrain:null,facade:null,wallH:2.5,wallT:0.2,low:false,night:false,view:"ensemble",style:null};}
  if(!S.scene)S.scene=newScene();
  B.S=S;B.now=function(){return new Date();};B.events=[];
  function id(){return S.nid++;}
  function emit(mod,act,payload){var ev={module:mod,action:act,payload:payload,at:Date.now()};B.events.push(ev);if(B.events.length>80)B.events.shift();
    try{if(typeof root.casoBridge==="function")root.casoBridge(ev);}catch(e){}}

  /* ---------- lexiques 3D ---------- */
  var TYPES={},TLIST=M.types||[];
  TLIST.forEach(function(t){TYPES[t[0]]={type:t[0],fr:t[1],pose:t[2],d:t[3],g:t[4]};});
  var EQ=[];
  function buildEq(){
    var seen={};EQ=[];
    function add(p,t){p=hn(p);if(!p||seen[p]||!TYPES[t])return;seen[p]=1;EQ.push([p,t]);}
    Object.keys(M.syn||{}).forEach(function(k){add(k,M.syn[k]);});
    TLIST.forEach(function(t){add(t[1],t[0]);add(t[1].split(/\s*[\/(]/)[0],t[0]);});
    [["fenetre","window"],["fenetres","window"],["porte","door"],["portes","door"],["porte fenetre","door"],["baie vitree","window"],["velux","window"],["meuble de cuisine","kitchen"],["meubles de cuisine","kitchen"],["lumiere","light"],["lumieres","light"],["spot","light"],["spots","light"],["plaque de cuisson","hob"],["plaques","hob"],["douche italienne","shower"],["frigo","fridge"],["seche serviette","towel"],["lave linge","washer"],["seche linge","dryer"],["lave vaisselle","dish"]].forEach(function(x){add(x[0],x[1]);});
    Object.keys(S.syn).forEach(function(k){add(k,S.syn[k]);});
    EQ.sort(function(a,b){return b[0].length-a[0].length;});
    EQ.forEach(function(e){e[2]=wordRe(e[0]);});
  }
  TYPES.window={type:"window",fr:"Fenêtre",pose:"wall",d:[1.2,0.1,1.25],g:"ouv"};
  TYPES.door={type:"door",fr:"Porte",pose:"wall",d:[0.9,0.1,2.1],g:"ouv"};
  buildEq();
  var ROOMS=[];
  function buildRooms(){ROOMS=[];(M.rooms||[]).forEach(function(g){g[1].forEach(function(s){ROOMS.push([hn(s),g[0]]);});});
    [["salle de sejour","sejour"],["salle a manger","sejour"],["toilettes","wc"],["toilette","wc"],["exterieur","exterieur"],["jardin","exterieur"]].forEach(function(x){ROOMS.push([x[0],x[1]]);});
    Object.keys(S.roomw).forEach(function(k){ROOMS.push([hn(k),S.roomw[k]]);});
    ROOMS.sort(function(a,b){return b[0].length-a[0].length;});ROOMS.forEach(function(r){r[2]=wordRe(r[0]);});}
  buildRooms();
  var ROOMNAME=Object.assign({exterieur:"Extérieur"},M.roomNames||{});
  function roomLabel(r){return r==null?"":ROOMNAME[r]||cap(r);}
  var COLORS=[];
  function buildColors(){COLORS=(M.colors||[]).map(function(c){return [hn(c[0]),c[0],c[1]];});
    Object.keys(M.accords||{}).forEach(function(k){var base=hn(M.accords[k]),c=COLORS.filter(function(x){return x[0]===base;})[0];if(c)COLORS.push([hn(k),c[1],c[2]]);});
    [["bleu ciel","bleu ciel","#9cc9e8"],["dore","doré","#c9a64a"],["argente","argenté","#c0c0c0"],["bois","bois","#a87b4f"]].forEach(function(x){if(!COLORS.some(function(c){return c[0]===x[0];}))COLORS.push(x);});
    Object.keys(S.colw).forEach(function(k){COLORS.push([hn(k),S.colw[k][0],S.colw[k][1]]);});
    COLORS.sort(function(a,b){return b[0].length-a[0].length;});COLORS.forEach(function(c){c[3]=wordRe(c[0]);});}
  buildColors();
  var MATCOL={parquet:"#b98a5a",carrelage:"#d9d5cc","beton cire":"#a9a49b",vinyle:"#c8b79b",moquette:"#8d8a84",marbre:"#ebe8e2",tomette:"#b5603e",stratifie:"#bf9a6c",lino:"#c4b8a0",chene:"#b98a5a",bois:"#a87b4f",brique:"#a8543c",pierre:"#b8ad9a",crepi:"#e6dfd2",enduit:"#e6dfd2",ardoise:"#4f5459",tuile:"#a8543c",tuiles:"#a8543c",zinc:"#8d9396",gazon:"#6a9a4a",gravier:"#b9b2a4",paves:"#8f8a82",beton:"#9d9a94",zellige:"#3f7f7a",metro:"#f0efea",terre:"#8a6a4a"};
  var MATS=[];
  (function(){var seen={};function add(p,kind){p=hn(p);if(seen[p])return;seen[p]=1;MATS.push([p,kind,wordRe(p)]);}
    ["parquet chene","parquet","carrelage","beton cire","vinyle","moquette","marbre","tomette","tomettes","stratifie","lino","jonc de mer"].forEach(function(x){add(x,"sol");});
    Object.keys((M.tex||{}).textures||{}).forEach(function(k){add(k,"tex");});
    ["crepi","enduit","ardoise","tuile","tuiles","zinc","bac acier"].forEach(function(x){add(x,"tex");});
    MATS.sort(function(a,b){return b[0].length-a[0].length;});})();
  function matColor(name){var n=hn(name);for(var k in MATCOL)if(n.indexOf(k)>=0)return MATCOL[k];return "#b9b2a4";}
  var THEMES=[];Object.keys(M.themes||{}).forEach(function(k){var t=M.themes[k],re=t.re?rxParse(t.re):null;THEMES.push([k,re||wordRe(k),t]);});
  var SITU=(M.situ||[]).map(function(s){return [s[0],rxParse(s[1])];}).filter(function(s){return s[1];});


  /* vocabulaire des modules de travail (devis, agenda, paiements) par langue : expression régulière normalisée -> français */
  var WORK={
   en:[["when is my next appointment|when is my next meeting|when is my next visit","quand est mon prochain rdv"],["my next appointment|my next meeting|next appointment|next meeting","mon prochain rdv"],["when is|when s","quand est"],["who owes me money|who owes me","qui me doit"],["how much does (\\p{L}+) owe me","combien me doit $1"],["how much did i earn|how much have i earned|how much did i make|how much i earned","combien j ai gagne"],["this month","ce mois"],["this week","cette semaine"],["this year","cette annee"],["what is the total of|what s the total of","quel est le total du"],["what is (\\p{L}+) s (?:phone )?number|what s (\\p{L}+) s (?:phone )?number","c est quoi le numero de $1$2"],["am i free","je suis libre"],["how many hours","combien d heures"],["send a text to|text","envoie un sms a"],["tell (\\p{L}+) that","dis a $1 que"],["call","appelle"],["quote|estimate|quotation","devis"],["for","pour"],["has paid|have paid|paid|payed|settled","a paye"],["appointment|meeting|site visit|visit","rdv"],["tomorrow","demain"],["today|tonight","aujourd hui"],["at (\\d{1,2}) ?pm","a +12:$1h"],["at (\\d{1,2}) ?am","a $1h"],["at (\\d{1,2})(?::(\\d{2}))? ?o ?clock","a $1h"],["at (\\d{1,2}):(\\d{2})","a $1h$2"],["at (\\p{L}+) s","chez $1"],["labour|labor","main d oeuvre"],["tiling|tiles|tile","carrelage"],["invoice","facture"],["deposit","acompte"],["final invoice","facture finale"],["send the quote|send quote","envoie le devis"],["by cheque|by check","par cheque"],["cash","especes"],["hours|hrs|hour","h"],["my clients|my customers","mes clients"],["my suppliers","mes fournisseurs"],["my schedule|my calendar|my agenda","mon planning"]],
   pt:[["quando e a minha proxima marcacao|quando e a minha proxima consulta","quand est mon prochain rdv"],["proxima marcacao|proxima consulta|proxima visita","prochain rdv"],["quem me deve dinheiro|quem me deve","qui me doit"],["quanto ganhei","combien j ai gagne"],["este mes","ce mois"],["esta semana","cette semaine"],["estou livre","je suis libre"],["orcamento","devis"],["para","pour"],["pagou|ja pagou|pago","a paye"],["marcacao|consulta|visita|reuniao|encontro","rdv"],["amanha","demain"],["as (\\d{1,2})h?(\\d{2})?","a $1h$2"],["em casa d[oae]|na casa d[oae]","chez"],["mao de obra","main d oeuvre"],["azulejos?|ladrilhos?","carrelage"],["fatura","facture"],["sinal","acompte"],["horas","h"]],
   es:[["cuando es mi proxima cita|cuando es mi siguiente cita","quand est mon prochain rdv"],["mi proxima cita|proxima cita","mon prochain rdv"],["quien me debe dinero|quien me debe","qui me doit"],["cuanto he ganado|cuanto gane","combien j ai gagne"],["este mes","ce mois"],["esta semana","cette semaine"],["estoy libre","je suis libre"],["presupuesto","devis"],["para","pour"],["ha pagado|pago|pagado","a paye"],["cita|visita|reunion","rdv"],["manana","demain"],["a las (\\d{1,2})(?::(\\d{2}))?","a $1h$2"],["con(?= \\p{L}+$)","chez"],["en casa de","chez"],["mano de obra","main d oeuvre"],["alicatado|azulejos?|baldosas?","carrelage"],["factura","facture"],["horas","h"]],
   it:[["quando e il mio prossimo appuntamento","quand est mon prochain rdv"],["prossimo appuntamento","prochain rdv"],["chi mi deve dei soldi|chi mi deve","qui me doit"],["quanto ho guadagnato","combien j ai gagne"],["questo mese","ce mois"],["questa settimana","cette semaine"],["sono libero|sono libera","je suis libre"],["preventivo","devis"],["per","pour"],["ha pagato|pagato|ha saldato","a paye"],["appuntamento|sopralluogo|visita|riunione","rdv"],["domani","demain"],["alle (\\d{1,2})(?::(\\d{2}))?","a $1h$2"],["da(?= \\p{L}+$)","chez"],["manodopera|mano d opera","main d oeuvre"],["piastrelle|piastrellatura","carrelage"],["fattura","facture"],["ore","h"]],
   ro:[["cand este urmatoarea programare|cand e urmatoarea programare","quand est mon prochain rdv"],["urmatoarea programare","prochain rdv"],["cine imi datoreaza bani|cine imi datoreaza","qui me doit"],["cat am castigat","combien j ai gagne"],["luna asta|luna aceasta","ce mois"],["saptamana asta|saptamana aceasta","cette semaine"],["deviz|oferta","devis"],["pentru","pour"],["a platit|platit","a paye"],["programare|intalnire|vizita","rdv"],["maine","demain"],["la ora (\\d{1,2})(?::(\\d{2}))?","a $1h$2"],["la(?= \\p{L}+$)","chez"],["manopera","main d oeuvre"],["gresie|faianta","carrelage"],["factura","facture"],["ore","h"]],
   pl:[["kiedy jest moje nastepne spotkanie|kiedy mam nastepne spotkanie","quand est mon prochain rdv"],["nastepne spotkanie|nastepna wizyta","prochain rdv"],["kto jest mi winien pieniadze|kto mi jest winien|kto mi wisi","qui me doit"],["ile zarobilem|ile zarobilam","combien j ai gagne"],["w tym miesiacu","ce mois"],["w tym tygodniu","cette semaine"],["kosztorys|wycena|oferta","devis"],["dla","pour"],["zaplacil\\p{L}*|oplacil\\p{L}*","a paye"],["spotkanie|wizyta|termin","rdv"],["o (\\d{1,2})(?::(\\d{2}))?","a $1h$2"],["u(?= \\p{L}+$)","chez"],["robocizna","main d oeuvre"],["plytki|plytek|glazura","carrelage"],["faktura","facture"],["godzin\\p{L}*","h"]],
   tr:[["bir sonraki randevum ne zaman|sonraki randevum ne zaman","quand est mon prochain rdv"],["sonraki randevu|siradaki randevu","prochain rdv"],["bana kim borclu","qui me doit"],["ne kadar kazandim","combien j ai gagne"],["bu ay","ce mois"],["bu hafta","cette semaine"],["teklif|fiyat teklifi","devis"],["(\\p{L}+) icin","pour $1"],["odedi|odeme yapti","a paye"],["randevu|ziyaret|toplanti","rdv"],["yarin","demain"],["saat (\\d{1,2})(?::(\\d{2}))?","a $1h$2"],["iscilik","main d oeuvre"],["fayans|seramik","carrelage"],["fatura","facture"],["saat","h"],["mavi\\p{L}*","bleu"],["beyaz\\p{L}*","blanc"],["gri\\p{L}*","gris"],["yesil\\p{L}*","vert"],["kirmizi\\p{L}*","rouge"],["siyah\\p{L}*","noir"]],
   ru:[["когда моя следующая встреча|когда следующая встреча","quand est mon prochain rdv"],["следующая встреча","prochain rdv"],["кто мне должен","qui me doit"],["сколько я заработал\\p{L}*","combien j ai gagne"],["в этом месяце","ce mois"],["на этой неделе","cette semaine"],["смета|расчет|предложение","devis"],["для","pour"],["заплатил\\p{L}*|оплатил\\p{L}*","a paye"],["встреча|визит|приём|прием","rdv"],["завтра","demain"],["в (\\d{1,2})(?::(\\d{2}))?(?= |$)","a $1h$2"],["у(?= \\p{L}+$)","chez"],["плитк\\p{L}*","carrelage"],["м2|кв м|м²","m2"],["счет|счёт","facture"],["час\\p{L}*","h"]],
   ar:[["متى موعدي القادم|متى الموعد القادم","quand est mon prochain rdv"],["موعدي القادم|الموعد القادم","prochain rdv"],["من يدين لي","qui me doit"],["كم ربحت","combien j ai gagne"],["هذا الشهر","ce mois"],["عرض سعر|تسعيره","devis"],["ل","pour"],["دفع|سدد","a paye"],["موعد|زياره","rdv"],["غدا","demain"],["الساعه (\\d{1,2})","a $1h"],["عند","chez"],["بلاط|سيراميك","carrelage"],["فاتوره","facture"],["اطل\\p{L}*|اطلي|ادهن","peins"],["باللون","en"]]
  };
  /* ---------- traduction vers le français ---------- */
  var LANGS=["en","pt","es","it","ro","pl","tr","ru","ar"],TR={};
  function trTable(L){
    if(TR[L])return TR[L];var rows=[];
    Object.keys(M.cmd||{}).forEach(function(fr){(M.cmd[fr][L]||[]).forEach(function(p){var h=hn(String(p).replace(/\*/g,"qqstar")).replace(/qqstar/g,"*");if(h)rows.push([h,hn(fr)]);});});
    Object.keys(M.names||{}).forEach(function(t){var nm=M.names[t];if(nm&&nm[L]&&TYPES[t]){var h=hn(nm[L]);if(h)rows.push([h,hn(TYPES[t].fr)]);}});
    if(L==="ar")rows.slice().forEach(function(r){if(r[0]&&r[0].indexOf(" ")<0){rows.push(["ال"+r[0],r[1]]);rows.push(["بال"+r[0],r[1]]);}});
    /* vocabulaire de chaque langue (i18n/comprendre-XX.json, fusionné dans les données) : avant WORK, les expressions longues d’abord */
    ((X.workL&&X.workL[L])||[]).concat(WORK[L]||[]).forEach(function(w){if(w&&w[0]&&w[1]!=null)rows.push([null,w[1],w[0],null,1]);});
    (X.agTr&&X.agTr[L]||[]).forEach(function(pair){rows.push([null,String(pair[1]).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/['’-]/g," "),pair[0]]);});
    rows.forEach(function(r){if(r[4]==null)r[4]=r[0]?1:2;else r[4]=0;});
    rows=rows.filter(function(r){return !(r[0]&&/^(m2|m²|m3|m|cm|h)$/.test(r[0]));});
    rows.sort(function(a,b){return a[4]-b[4]||(b[0]||"").length-(a[0]||"").length;});
    rows.forEach(function(r){if(r[0])r[3]=new RegExp("(^|[^\\p{L}\\p{N}])"+esc(r[0]).replace(/\\\*/g,"\\p{L}*")+"(?=$|[^\\p{L}\\p{N}])","gu");
      else{try{var src=String(r[2]).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[A-ZÀ-Ý]/g,function(ch,i,str){return str[i-1]==="{"||str[i-2]==="{"?ch:ch.toLowerCase();});r[3]=new RegExp("(^|[^\\p{L}\\p{N}])(?:"+src+")(?=$|[^\\p{L}\\p{N}])","gu");}catch(e){r[3]=null;}}});
    return TR[L]=rows;
  }
  var FRW=/(^|\s)(le|la|les|du|des|pour|avec|chez|dans|sur|et|une|je|tu|il|mon|ma|mes|demain|devis|facture|forfait|rdv|rendez vous|paye|ajoute|mets|enleve|peins|depose|pose|travaux|chantier|client|fournisseur|prix|remise|mur|murs|sol)(?=\s|$)/g;
  var FRKEYS=Object.keys(M.cmd||{}).map(function(k){return wordRe(hn(k));});
  function detectLang(n,hint){
    if(/[Ѐ-ӿ]/.test(n))return "ru";if(/[؀-ۿ]/.test(n))return "ar";
    var best=null,bs=0;
    LANGS.forEach(function(L){if(L==="ru"||L==="ar")return;var s=langScore(L,n);if(s>bs){bs=s;best=L;}});
    var fs=0;FRKEYS.forEach(function(re){if(re.test(n))fs++;});var fw=n.match(FRW);if(fw)fs+=fw.length;
    /* égalité entre deux langues : la langue de l'interface l'emporte */
    if(hint&&hint!=="fr"&&hint!=="perso"&&LANGS.indexOf(hint)>=0&&bs>0&&hint!==best){var hs=0;trTable(hint).forEach(function(r){if(r[0]&&r[3]){r[3].lastIndex=0;if(r[3].test(n))hs++;}});if(hs>=bs)best=hint,bs=hs;else if(langScore(hint,n)>=bs)best=hint;}
    return bs>fs?best:"fr";
  }
  function langScore(L,n){var s=0;trTable(L).forEach(function(r){if(!r[3])return;r[3].lastIndex=0;
      if(r[0]){if(r[0].length>=3&&r[3].test(n))s+=r[0].length>=6?2:1;}else if(r[4]===0&&String(r[2]).replace(/\(\?[=!<][^)]*\)/g,"").replace(/\\.|[()?:|\[\]+*$^]/g,"").replace(/\s+/g," ").trim().length>=4&&r[3].test(n))s+=2;});return s;}
  function toFr(n,L){
    if(!L||L==="fr")return n;var p=" "+n+" ";
    trTable(L).forEach(function(r){if(!r[3])return;r[3].lastIndex=0;
      if(r[4]!==0){p=p.split(/(\u0001[^\u0002]*\u0002)/).map(function(seg){if(seg.charAt(0)==="\u0001")return seg;r[3].lastIndex=0;return (" "+seg+" ").replace(r[3],function(){var g=[].slice.call(arguments,1,-2);var pre=g.shift()||"";return pre+" "+r[1].replace(/\$(\d)/g,function(x,i){return g[i-1]||"";})+" ";});}).join("");return;}
      p=p.replace(r[3],function(){var g=[].slice.call(arguments,1,-2);var pre=g.shift()||"";return pre+" \u0001"+r[1].replace(/\+12:\$(\d)/,function(x,i){var h=+(g[i-1]||0);return String(h<12?h+12:h);}).replace(/\$(\d)/g,function(x,i){return g[i-1]||"";})+"\u0002 ";});});
    p=p.replace(/[\u0001\u0002]/g," ");
    return p.replace(/\s+/g," ").trim();
  }
  /* mots du bâtiment (vocabulaire des devis) : remplace l'alias étranger par le terme français */
  function vocabFr(p,a,L){
    (a.mentions||[]).forEach(function(m){var c=E.concepts[m.c];if(!c||(m.lang==="fr")||m.lang==="perso"&&false)return;if(L==="fr"&&m.lang!=="perso")return;
      var sp=hn(m.span);if(!sp||sp.length<3)return;p=p.replace(wordRe(sp),function(x,pre){return pre+hn(c.fr);});});
    return p;
  }
  function applyLex(p){var ks=Object.keys(S.lex);if(!ks.length)return p;ks.sort(function(a,b){return b.length-a.length;});ks.forEach(function(k){p=p.replace(wordRe(k),function(m,pre){return pre+S.lex[k];});});return p;}
  function buildEqLex(){VOC=null;}
  /* vocabulaire casô : corrections d'expressions (« rendez vous », « main d'oeuvre »…), abréviations SMS des 10 langues, nombres en lettres */
  var CORR=(X.corrFr||[]).map(function(x){var m=String(x[0]).match(/^\/([\s\S]*)\/(\w*)$/);try{return m?[new RegExp(m[1],m[2].indexOf("g")<0?m[2]+"g":m[2]),x[1]]:null;}catch(e){return null;}}).filter(Boolean);
  function corrRaw(raw){var t=String(raw);CORR.forEach(function(c){t=t.replace(c[0],c[1]);});return t;}
  var ABR={};Object.keys(X.abbr||{}).forEach(function(l){var m={};(X.abbr[l]||[]).forEach(function(p){if(p[0]&&p[1]&&p[0]!==p[1]&&!/^\d+$/.test(p[0]))m[p[0]]=p[1];});ABR[l]=m;});
  function expandAbbr(n,L){var mp=Object.assign({},ABR.fr||{},L&&L!=="fr"?ABR[L]||{}:{}),t=n.split(" ");
    return t.map(function(w,i){var e=mp[w];if(e==null||/^\d/.test(w))return w;var ew=e.split(" ");if(ew[0]===w&&ew.slice(1).every(function(x,k){return t[i+1+k]===x;}))return w;return e;}).join(" ");}
  var NUMS=Object.assign({},X.num||{});["dix sept:17","dix huit:18","dix neuf:19","soixante dix:70","quatre vingt:80","quatre vingts:80","quatre vingt dix:90","cents:100"].forEach(function(s){var a=s.split(":");NUMS[a[0]]=+a[1];});
  var UNITW=/^(m2|m²|m3|m³|ml|metres?|carres?|heures?|h|jours?|kg|kilos?|km|sacs?|pots?|rouleaux?|litres?|l|unites?|pieces?|points?|forfaits?|€|euros?|eur|%|pour|semaines?|mois|minutes?|min|ans?|personnes?|fois|portes?|fenetres?|prises?|chaises?|carreaux?|plaques?)$/;
  function words2num(n){
    var t=n.split(" "),out=[],i=0;
    function val(k){var w=t[k];if(w==null)return null;if(NUMS[w]!=null&&w!=="un"&&w!=="une")return NUMS[w];return null;}
    while(i<t.length){
      /* « un/une » ne deviennent un chiffre que devant une unité ou un prix */
      if((t[i]==="un"||t[i]==="une")&&t[i+1]&&/^(m2|m²|metres?|heures?|h|jours?|sacs?|pots?|rouleaux?|litres?|forfaits?|€|euros?)$/.test(t[i+1])){out.push("1");i++;continue;}
      var v=val(i);if(v==null){out.push(t[i]);i++;continue;}
      var total=v===1000?1000:0,cur=v===1000?0:v,j=i+1,used=1;
      while(j<t.length){var w=t[j],x=val(j);
        if(w==="et"&&t[j+1]==="demi"){cur+=0.5;j+=2;used+=2;continue;}
        if(w==="et"&&(t[j+1]==="un"||t[j+1]==="une")&&cur>=20){cur+=1;j+=2;used+=2;continue;}
        if(w==="et"&&val(j+1)!=null&&val(j+1)<10){j++;continue;}
        if(x==null)break;
        if(cur===0&&x<1000){cur=x;}else if(x===100){cur=(cur||1)*100;}else if(x===1000){total+=(cur||1)*1000;cur=0;}else if(x>=20&&cur>=60&&cur<100&&x<20){cur+=x;}else if(cur%100===0&&cur>0&&x<100){cur+=x;}else if(cur>=20&&cur<100&&cur%10===0&&x<20){cur+=x;}else if(cur===4&&x===20){cur=80;}else break;
        j++;used++;}
      var num=total+cur,next=t[j]||"";
      if(used>1||num>=10||UNITW.test(next)){out.push(String(num));i=j;}else{out.push(t[i]);i++;}
    }
    return out.join(" ");
  }
  B.words2num=words2num;
  B.translate=function(raw0){var raw=corrRaw(raw0),n=hn(raw),a=E.analyze(raw),L=detectLang(n,LANG!=="fr"&&(!a.lang||a.lang==="fr"||a.lang==="perso")?LANG:a.lang);n=expandAbbr(n,L);if(L==="fr")n=words2num(n);var p=toFr(n,L);p=vocabFr(p,a,L);p=applyLex(p);if(L!=="fr")p=words2num(p);return {n:n,p:p,lang:L,a:a};};

  /* ---------- entités ---------- */
  var POSREF=/\b(pres d(?:u|e la|e l|es|e)|sous|devant|a cote d(?:u|e la|e l|es|e)|en face d(?:u|e la|e l|es|e)|contre)\s+(?:la |le |l |les )?([\p{L}]+(?: [\p{L}]+)?)/gu;
  function findEquip(p,keepRefs){
    var out=[],used=[];if(!keepRefs){p=p.replace(POSREF,function(m,a,b){return m.slice(0,m.length-b.length)+b.replace(/[^ ]/g,"~");});}ROOMS.forEach(function(r){if(r[0].indexOf(" ")>0&&p.indexOf(r[0])>=0)p=p.split(r[0]).join(r[0].replace(/[^ ]/g,"~"));});
    EQ.forEach(function(e){var re=new RegExp(e[2].source,"gu"),m;while((m=re.exec(p))){var i=m.index+m[1].length,j=i+m[2].length;
      if(used.some(function(u){return i<u[1]&&j>u[0];}))continue;
      if(e[1]==="desk"&&/\b(dans|au|du|de)\s+(le\s+|la\s+|l\s+)?$/.test(p.slice(0,i)))continue;
      if(e[1]==="kitchen"&&e[0]==="cuisine")continue;
      used.push([i,j]);out.push({type:e[1],i:i,len:j-i,span:e[0]});}});
    out.sort(function(a,b){return a.i-b.i;});return out;
  }
  function findRoom(p){for(var k=0;k<ROOMS.length;k++){var m=p.match(ROOMS[k][2]);if(m){var i=m.index+m[1].length;
      if(ROOMS[k][1]==="bureau"&&/\b(un|une|le|mon|ce)\s+$/.test(p.slice(0,i))&&!/\b(dans|au)\s+(le\s+)?$/.test(p.slice(0,i)))continue;
      return {id:ROOMS[k][1],i:i,len:m[2].length};}}
    var n=p.match(/\bpiece\s+(\d)\b/);if(n)return {id:"piece "+n[1],i:n.index,len:n[0].length};return null;}
  function findColor(p){for(var k=0;k<COLORS.length;k++){var m=p.match(COLORS[k][3]);if(m)return {name:COLORS[k][1],hex:COLORS[k][2],i:m.index+m[1].length,len:m[2].length};}return null;}
  function findMat(p){for(var k=0;k<MATS.length;k++){var m=p.match(MATS[k][2]);if(m)return {name:MATS[k][0],kind:MATS[k][1],i:m.index+m[1].length};}return null;}
  var POS=[["a gauche",/\b(a gauche|vers la gauche|sur la gauche)\b/],["a droite",/\b(a droite|vers la droite|sur la droite)\b/],["au fond",/\b(au fond|du fond|contre le mur du fond)\b/],["en haut",/\b(en haut|vers le haut|au nord)\b/],["en bas",/\b(en bas|vers le bas|au sud)\b/],["au centre",/\b(au centre|au milieu)\b/],["dans le coin",/\b(dans (le|un) coin|dans l angle|en angle)\b/],["pres de la fenetre",/\b(pres de la fenetre|sous la fenetre|devant la fenetre)\b/],["contre le mur",/\b(contre le mur|le long du mur|au mur)\b/]];
  function findPos(p){for(var i=0;i<POS.length;i++)if(POS[i][1].test(p))return POS[i][0];var m=p.match(/\b(a cote d|pres d|en face d|devant)(?:u|e la|e l|es|e)?\s+(.+)$/);if(m){var eq=findEquip(m[2]);if(eq.length)return (/face|devant/.test(m[1])?"en face du ":"à côté du ")+TYPES[eq[0].type].fr.toLowerCase();}return null;}
  function countAt(p,i){var pre=p.slice(Math.max(0,i-24),i),m=pre.match(/(\d+|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\s+(?:grands?|grandes?|petits?|petites?|beaux?|belles?|nouveaux?|nouvelles?|autres?)?\s*$/);if(!m)return 1;return /^\d+$/.test(m[1])?+m[1]:NUMW[m[1]]||1;}

  /* ---------- extraction (devis, agenda, clients…) ---------- */
  function money(n){var s=String(n).replace(/\b(\d{1,3})((?:[ \u202f]\d{3})+)(?=\s*(?:k(?![a-z])|€|euros?\b|eur\b|balles\b|boules\b))/g,function(x){return x.replace(/[ \u202f]/g,"");}),m;
    if((m=s.match(/(\d+(?:\.\d+)?)\s*k(?![a-z\d])\s*(?:€|euros?|eur|balles)?/)))return Math.round(pnum(m[1])*100000)/100;
    m=s.match(/(\d+(?:\.\d{1,2})?)\s*(?:€|euros?|eur|balles|boules)(?![\p{L}])/u);return m?pnum(m[1]):null;}
  function qtys(n){var out=[],m;QRE.lastIndex=0;while((m=QRE.exec(n))){var u=unitOf(m[2]);if(u)out.push({q:pnum(m[1]),u:u,i:m.index,len:m[0].length});}return out;}
  function stripTimes(n){return n.replace(/\b(?:a|vers|des)\s*\d{1,2}\s*(?:h|heures?)(?:\s*\d{2})?(?:\s+(?:et\s+)?(?:demie?|quart)|\s+moins\s+(?:le\s+)?quart)?(?:\s+(?:du matin|de l apres midi|du soir))?\b/g," ").replace(/\b(?:a|vers)\s+(?:midi|minuit)(?:\s+(?:et\s+)?(?:demie?|quart))?\b/g," ").replace(/\b\d{1,2}h\d{2}\b/g," ").replace(/\b(?:de|entre)\s*\d{1,2}\s*h(?:\s*\d{2})?\s*(?:a|et)\s*\d{1,2}\s*h(?:\s*\d{2})?\b/g," ");}
  function clientKey(s){return hn(s).replace(/^(m|mme|mlle|monsieur|madame|mr|mrs)\s+/,"").trim();}
  var NOTNAME=/^(le|la|les|un|une|des|du|de|demain|aujourd|ce|cette|mon|ma|mes|lui|elle|moi|toi|nous|vous|eux|il|on|chantier|client|cliente|devis|facture|rdv|the|my|o|a|el|ora|living|kitchen)$/i;
  /* « chez Léon Demain » : un mot de temps n'est pas une partie du nom */
  var TEMPS=/\s+(?:demain|apres demain|aujourd hui|ce soir|ce matin|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|matin|soir|midi|prochain|prochaine|semaine|maintenant|tot|tard)$/;
  function findClient(raw,n){var k=findClient0(raw,n);if(k)while(TEMPS.test(k))k=k.replace(TEMPS,"");if(!k||S.clients[k])return k;var e=sameName(k);if(e)return e;
    /* « u Nowaka », « dla Kowalskiego » : le nom est décliné après ces prépositions */
    if(/(?:^|\s)(?:u|dla|od|do|z|ze|o|у|для|от|до|к|ко|о|об|с|со|про)\s+\p{Lu}/u.test(raw)){var st=k.replace(/(owi|iego|ego|em|a|u|y|ie)$/,"");if(st.length>=3&&S.clients[st])return st;
      var ds=declined(k,false);for(var i=0;i<ds.length;i++){if(S.clients[ds[i]])return ds[i];var e2=sameName(ds[i]);if(e2)return e2;}}return k;}
  /* nom décliné (polonais, russe) -> formes de base possibles : Duponta, Duponcie, Martinowi, Иванову */
  function declined(k,bare){var out=[],R=bare?[["owi",""],["iemu",""],["emu",""],["ому",""],["ему",""],["у",""],["ю",""]]:
      [["owi",""],["iego",""],["ego",""],["em",""],["cie","t"],["dzie","d"],["rze","r"],["ie",""],["a",""],["u",""],["y",""],["e",""],["ому",""],["ему",""],["ым",""],["им",""],["ом",""],["ем",""],["ой",""],["ей",""],["у",""],["ю",""],["а",""],["я",""],["е",""]];
    R.forEach(function(r){if(k.length>=r[0].length+3&&k.slice(-r[0].length)===r[0])out.push(k.slice(0,-r[0].length)+r[1]);});return out;}
  function sameName(k){var keys=Object.keys(S.clients),e=findKey&&findKey(k);if(e&&stemKey(e)===stemKey(k))return e;
    var part=keys.filter(function(x){return x.split(" ").indexOf(k)>=0||k.split(" ").length===1&&x.split(" ").some(function(w){return stemKey(w)===stemKey(k);});});return part.length===1?part[0]:null;}
  function findClient0(raw,n){
    var keys=Object.keys(S.clients);
    var nn=" "+String(n).replace(/:/g," ")+" ";/* « Dupont: » : les deux-points collés au nom */
    for(var i=0;i<keys.length;i++){if(nn.indexOf(" "+keys[i]+" ")>=0)return keys[i];}
    var m=raw.match(/(?:^|[\s(])(?:chez|avec|client(?:e)?|pour|de|mme|madame|monsieur|mlle|mr|m\.|for|at|para|con|per|da|pentru|la|dla|u|do|od|z|ze|o|для|у|от|до|к|ко|о|об|с|со|про|عند|pan|pani|panu|pana|domnul|doamna|senor|señor|señora|sr|sra|signor|signora|sig|bay|bayan|господин|госпожа|السيد|السيدة|mister|miss|mrs|ms)\s+(?:M\.\s*|Mme\s*|Madame\s*|Monsieur\s*|o\s+|a\s+)?(\p{Lu}[\p{L}'’-]+(?:\s+\p{Lu}[\p{L}'’-]+)?)/u);
    if(m&&!NOTNAME.test(m[1].split(/\s+/)[0])){var w=m[1].split(/\s+/);if(w.length>1&&(vocab()[hn(w[1])]||E.isStop(norm(w[1]))||/^(A|Au|Le|La|Pour|Demain|Ce)$/.test(w[1])||!/^\p{Lu}\p{Ll}/u.test(w[1])))m[1]=w[0];return clientKey(m[1]);}
    var m2=n.match(/\b(?:chez|client|cliente)\s+([\p{L}][\p{L}'-]{2,})/u);
    if(m2&&!E.isKnown(m2[1])&&!E.isStop(m2[1])&&!NOTNAME.test(m2[1]))return m2[1];
    var m3=raw.match(/^(?:o |a |el |la |il )?(\p{Lu}[\p{L}'’-]+)\s+(?:m'a |m’a |a |nous a |has |ha |ja )?(?:payé|paye|réglé|regle|viré|vire|versé|signé|signe|accepté|accepte|refusé|refuse|habite|demeure|paid|payed|pagou|pagó|pago|pagato|plătit|platit|zapłacił|zaplacil|ödedi|odedi|заплатил|оплатил)/u);
    var m5=raw.match(/(\p{Lu}[\p{L}'’-]+)\s+(?:için|icin)(?![\p{L}])|(\p{Lu}[\p{L}'’-]+)\s+randevu/u);if(!m3&&m5)return clientKey(m5[1]||m5[2]);
    if(m3)return clientKey(m3[1]);
    var m7=raw.match(/\b(?:me doit|me doivent|doit encore)\s+(?:M\.\s*|Mme\s+)?(\p{Lu}[\p{L}'’-]+)|(\p{Lu}[\p{L}'’-]+)\s+(?:me doit|doit encore|a-t-il|a-t-elle)\b/u);
    if(m7&&!NOTNAME.test(m7[1]||m7[2]))return clientKey(m7[1]||m7[2]);
    var m8=raw.match(/(\p{Lu}[\p{L}'’-]+)\s+(?:a|m['’]a|nous a)\s+(?:tout |déjà |deja |bien |enfin )?(?:payé|paye|réglé|regle|soldé|solde|viré|vire)(?![\p{L}])/u);
    if(m8&&!NOTNAME.test(m8[1])&&!/^(Il|Elle|On|Qui|Est|Tout)$/.test(m8[1]))return clientKey(m8[1]);
    var m6=n.match(/^(?:m |mme |madame |monsieur )?([\p{L}][\p{L}'-]{2,})\s+(?:m a |nous a |a )?(?:paye|regle|vire|verse|signe|accepte|refuse)\b/u);
    if(m6&&!E.isStop(m6[1])&&!vocab()[m6[1]]&&!NOTNAME.test(m6[1])&&!/^(je|j|il|elle|on|nous|vous|ils|elles|client|cliente|tout|qui|personne)$/.test(m6[1]))return m6[1];
    var m4=raw.match(/\b(?:numéro|numero|téléphone|telephone|tel|mail|e-mail|email|adresse)\s+(?:de|du|d')\s*(?:M\.\s*|Mme\s*)?([A-ZÀ-Ý][\p{L}'’-]+)/u);
    if(m4)return clientKey(m4[1]);
    /* « Martinowi », « Иванову » : client existant au datif, sans préposition */
    var bt=raw.match(/\p{Lu}[\p{L}'’-]+/gu)||[];for(var j=0;j<bt.length;j++){var ds=declined(clientKey(bt[j]),true);for(var q=0;q<ds.length;q++)if(S.clients[ds[q]])return ds[q];}
    return null;
  }
  function clientName(k){var c=S.clients[k]||S.archives&&S.archives[k];return c?c.nom:tcase(k||"");}
  /* phrase d'une autre langue : la structure se lit sur la traduction (c.p) ; les noms et le texte libre gardent l'écriture d'origine */
  function horsFr(c){return !!(c&&c.lang&&c.lang!=="fr"&&c.lang!=="perso"&&c.p);}
  function rawToks(raw){var t=[];String(raw||"").replace(/[\p{L}\p{N}]+/gu,function(w,i){t.push({w:w,h:hn(w),i:i});return w;});return t;}
  /* passage normalisé de la traduction -> le même passage dans la phrase d'origine (null s'il n'y est pas) */
  function origOf(raw,frag){var w=String(frag||"").trim().split(/\s+/).filter(Boolean),t=rawToks(raw);if(!w.length)return null;
    for(var a=0;a+w.length<=t.length;a++){var ok=true;for(var b=0;b<w.length&&ok;b++)ok=t[a+b].h===w[b];
      if(ok){var z=t[a+w.length-1];return String(raw).slice(t[a].i,z.i+z.w.length);}}return null;}
  /* texte libre (note, « retiens ») : après les deux-points de la phrase d'origine, sinon à partir du premier mot resté tel quel */
  function origTail(raw,frag){raw=String(raw||"");var i=raw.indexOf(":");if(i>=0&&raw.slice(i+1).trim())return raw.slice(i+1).trim();
    var w=String(frag||"").trim().split(/\s+/),t=rawToks(raw);for(var a=0;a<w.length;a++)for(var b=0;b<t.length;b++)if(t[b].h===w[a])return raw.slice(t[b].i).trim();return String(frag||"").trim();}
  function tcase(s){return String(s||"").replace(/(^|[\s'’-])(\p{L})/gu,function(m0,a,b){return a+b.toUpperCase();});}
  function contact(raw){
    var o={},m;
    if((m=raw.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)))o.email=m[0];
    if((m=raw.match(/(?:\+33\s?|0)\s?[1-9](?:[\s.-]?\d{2}){4}/)))o.tel=m[0].replace(/\D/g,"").replace(/^33/,"0").replace(/(\d{2})(?=\d)/g,"$1 ");
    if((m=raw.match(/\b(\d+\s*(?:bis|ter)?\s*,?\s*(?:rue|avenue|av|boulevard|bd|chemin|impasse|place|allée|allee|route|traverse|cours|quai|montée|lotissement|résidence)\s+[\p{L}' -]+?)(?=\s+(?:à|a)\s|\s*,|\.|$|\s+pour\b)/iu)))o.adresse=m[1].trim();
    if((m=raw.match(/\b(\d{5})\s+([A-ZÀ-Ý][\p{L}'-]+)/u)))o.adresse=(o.adresse?o.adresse+", ":"")+m[1]+" "+m[2];
    return o;
  }
  function parseDate(p){
    var base=sod(B.now()),m;
    if(/\bapres demain\b/.test(p))return addDays(base,2);
    if(/\bdemain\b/.test(p))return addDays(base,1);
    if(/\baujourd ?hui\b|\bce soir\b|\bce matin\b|\bcet apres midi\b/.test(p))return base;
    if((m=p.match(/\bdans (\d+) (jours?|semaines?|mois)\b/)))return /mois/.test(m[2])?new Date(base.getFullYear(),base.getMonth()+ +m[1],base.getDate()):addDays(base,+m[1]*(/sem/.test(m[2])?7:1));
    if((m=p.match(new RegExp("\\b("+JOURS.join("|")+")\\s+en\\s+(huit|8|quinze|15)\\b")))){var i0=JOURS.indexOf(m[1]);return addDays(base,(i0-base.getDay()+7)%7+(/huit|8/.test(m[2])?7:14));}
    if((m=p.match(/\ble (\d{1,2})(?:er)?\s+(?:du mois prochain|du mois suivant)\b/)))return new Date(base.getFullYear(),base.getMonth()+1,+m[1]);
    if((m=p.match(/\ble (\d{1,2})(?:er)?\s+(?:de ce mois(?: ci)?|du mois)\b/)))return new Date(base.getFullYear(),base.getMonth(),+m[1]);
    if(/\bdebut de (?:la )?semaine prochaine\b/.test(p))return addDays(base,(8-base.getDay())%7||7);
    if(/\bfin de (?:la )?semaine prochaine\b/.test(p))return addDays(base,((8-base.getDay())%7||7)+4);
    if(/\bfin de (?:la |cette )?semaine\b/.test(p))return addDays(base,(5-base.getDay()+7)%7);
    if(/\bdebut du mois prochain\b/.test(p))return workday(new Date(base.getFullYear(),base.getMonth()+1,1),1);
    if(/\bfin du mois prochain\b/.test(p))return workday(new Date(base.getFullYear(),base.getMonth()+2,0),-1);
    if(/\bfin (?:du|de ce) mois\b/.test(p))return workday(new Date(base.getFullYear(),base.getMonth()+1,0),-1);
    if(/\b(?:ce|le) week end(?: prochain)?\b/.test(p)){var sa=(6-base.getDay()+7)%7;if(/prochain/.test(p)&&sa<2)sa+=7;return addDays(base,sa);}
    if(/\bsemaine prochaine\b/.test(p))return addDays(base,(8-base.getDay())%7||7);
    if(/\bmois prochain\b/.test(p))return workday(new Date(base.getFullYear(),base.getMonth()+1,1),1);
    var mo=p.match(new RegExp("\\b(\\d{1,2})\\s*(?:er)?\\s*("+MOIS.join("|")+")(?:\\s*(\\d{4}))?"));
    if(mo){var y=mo[3]?+mo[3]:base.getFullYear(),d=new Date(y,MOIS.indexOf(mo[2]),+mo[1]);if(!mo[3]&&d<base)d=new Date(y+1,d.getMonth(),d.getDate());return d;}
    var sl=p.match(/\b(\d{1,2})[\/.](\d{1,2})(?:[\/.](\d{2,4}))?\b/);
    if(sl&&+sl[2]>=1&&+sl[2]<=12&&+sl[1]<=31){var y2=sl[3]?(+sl[3]<100?2000+ +sl[3]:+sl[3]):base.getFullYear(),d2=new Date(y2,+sl[2]-1,+sl[1]);if(!sl[3]&&d2<base)d2=new Date(y2+1,d2.getMonth(),d2.getDate());return d2;}
    for(var i=0;i<7;i++){if(new RegExp("\\b"+JOURS[i]+"\\b").test(p)){var diff=(i-base.getDay()+7)%7;if(diff===0)diff=7;return addDays(base,diff);}}
    if((m=p.match(/\ble (\d{1,2})(?:er)?(?=\s+(?:a|vers)\s+\d{1,2}\s*h|\s+(?:au matin|le matin|matin|apres midi|soir)\b)/))&&+m[1]>=1&&+m[1]<=31){var dm=new Date(base.getFullYear(),base.getMonth(),+m[1]);if(dm<base)dm=new Date(base.getFullYear(),base.getMonth()+1,+m[1]);return dm;}
    return null;
  }
  function workday(d,dir){while(d.getDay()===0||d.getDay()===6)d=addDays(d,dir);return d;}
  function parseTime(p){
    var m,h=null,mi=0;
    if((m=p.replace(/\bapres midi\b/g,"apresmidi").match(/\b(midi|minuit)(?:\s+(?:et\s+)?(demie?|quart)\b|\s+moins\s+(?:le\s+)?quart\b)?/))){h=m[1]==="midi"?12:0;mi=m[2]?(/quart/.test(m[2])?15:30):0;if(/moins/.test(m[0])){h=h?h-1:23;mi=45;}return {h:h,m:mi};}
    if((m=p.match(/\b(\d{1,2})\s*(?:h|heures?)\s*(?:et\s+)?(demie?|quart)\b/))){h=+m[1];mi=/quart/.test(m[2])?15:30;}
    else if((m=p.match(/\b(\d{1,2})\s*(?:h|heures?)\s*moins\s+(?:le\s+)?quart\b/))){h=+m[1]-1;mi=45;}
    else if((m=p.match(/\b(\d{1,2})\s*(?:h|heures?|:)\s*(\d{2})?(?!\d)/))){h=+m[1];mi=m[2]?+m[2]:0;}
    if(h!=null&&h<=23){var after=p.slice(m.index+m[0].length,m.index+m[0].length+30);if(h<12&&/^\s*(?:de l apres midi|de l aprem|du soir|pm)\b/.test(after))h+=12;return {h:h,m:mi};}
    if(/\bapres midi\b/.test(p))return {h:14,m:0};if(/\bmidi\b/.test(p))return {h:12,m:0};if(/\bmatin\b/.test(p))return {h:9,m:0};if(/\bsoir\b/.test(p))return {h:18,m:0};
    return null;
  }
  function parseDur(p){
    var m=p.match(/\b(?:de|entre)\s*(\d{1,2})\s*h\s*(\d{2})?\s*(?:a|et|-)\s*(\d{1,2})\s*h\s*(\d{2})?/);
    if(m){var s=+m[1]*60+(+m[2]||0),e=+m[3]*60+(+m[4]||0);if(e>s)return {start:{h:+m[1],m:+m[2]||0},min:e-s};}
    m=p.match(/\b(?:pendant|duree|pour|durant)\s*(\d+(?:\.\d+)?)\s*(heures?|h|min|minutes?)\b/);
    if(m){var v=pnum(m[1]);return {min:/min/.test(m[2])?v:v*60};}
    m=p.match(/\b(?:toute la journee|journee entiere)\b/);if(m)return {start:{h:8,m:0},min:540};
    return null;
  }
  var LABSTOP=/\b(?:fourniture|fournitures|prevoir|chiffre|chiffrer|compte|compter|moi|rajoute|prevois|de|du|des|d|la|le|les|l|un|une|au|aux|en|pour|faire|refaire|fais|pose|poser|mets|ajoute|ajouter|prix|tarif|service|mon|ma|mes|il|y|a|devis|nouveau|nouvelle|client|cliente|chez|fournisseur|avec|sur|total|ht|ttc|et|puis|faut|me|pour|il me faut|besoin|achete|acheter|enleve|enlever|retire|retirer|ote|oter|moins|plus|encore|supplementaires?|rajoute|rajouter)\b/g;
  function cleanLabel(s){return s.replace(/\bmain d ?oeuvre\b/g,"maindoeuvre").replace(LABSTOP," ").replace(/\bmaindoeuvre\b/g,"main d oeuvre").replace(/[^\p{L}0-9²³ ]/gu," ").replace(/\s+/g," ").trim();}
  function parsePrice(n){
    var m=n.match(/^(.*?)(?:\s*[:=]|\s+(?:a|est de|est a|vaut|coute|coutent|c est|au prix de|passe a|passe de))?\s*(\d+(?:\.\d{1,2})?)\s*(?:€|euros?|eur)\s*(?:ht|ttc)?\s*(?:(?:le|la|les|par|per|de l|de|l|du)\s+)?([\p{L}²³0-9]{0,14})?\s*$/u);
    if(!m)return null;var lab=cleanLabel(m[1]);if(!lab)return null;return {libelle:lab,prix:pnum(m[2]),unite:unitOf(m[3]||"")||null};
  }
  var LABV=null;
  function labVocab(){if(LABV)return LABV;LABV={};(X.metierFr||[]).concat(S.services.map(function(s){return s.nom;})).concat(("colle joint enduit plaque sac rail montant vis cheville peinture sous couche primaire carreau carreaux faience parquet plinthe depose pose nettoyage evacuation gravats ragreage isolation laine placo bande mortier sable ciment beton gaine prise interrupteur tableau disjoncteur robinet mitigeur lavabo evier douche bonde siphon tuyau raccord cuivre multicouche radiateur ballon fenetre porte volet serrure poignee menuiserie main oeuvre deplacement fournitures petites carrelage tapisserie papier peint lame stratifie dalle chape terrasse cloison doublage faux plafond spot luminaire").split(" ")).forEach(function(w){hn(w).split(" ").forEach(function(x){if(x.length>=3)LABV[x]=1;});});return LABV;}
  function fixLabel(l){var V=labVocab(),ks=Object.keys(V);return String(l||"").split(" ").map(function(w){if(w.length<4||V[w]||/^\d/.test(w)||E.isStop(w))return w;var best=null,bd=9,max=w.length<=7?1:2;
      ks.forEach(function(v){if(Math.abs(v.length-w.length)>max)return;var d=E.dl(w,v,max);if(d<bd){bd=d;best=v;}});return best&&bd<=max?best:w;}).join(" ");}
  function devisLines(c,k){
    var rest=c.p.replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g," ").replace(/(?:\+33\s?|0)\s?[1-9](?:[\s.-]?\d{2}){4}/g," ");
    (k||"").split(" ").filter(Boolean).forEach(function(w){rest=rest.replace(wordRe(w),"$1 ");});
    var lignes=[],afaire=[];
    rest.split(/[,;]|\bet\b|\bpuis\b|\+/).forEach(function(seg){
      seg=stripTimes(seg.trim());if(!seg)return;var qs=qtys(seg);
      if(!qs.length){var w=cleanLabel(seg.replace(/\b(client|cliente|chez|nouveau|devis|fournisseur)\b.*$/,""));
        if(w&&w.split(" ").length<=4&&(c.a.mentions||[]).some(function(m){var kk=E.concepts[m.c].kind;return (kk==="métier"||kk==="équipement"||kk==="matière")&&seg.indexOf(hn(m.span))>=0||seg.indexOf(hn(E.concepts[m.c].fr))>=0;}))afaire.push(w);return;}
      var q=qs[0],label=cleanLabel((seg.slice(0,q.i)+" "+seg.slice(q.i+q.len)).replace(/\d+(?:\.\d+)?\s*(?:€|euros?)(?:\s*(?:le|la|par|l)?\s*[\p{L}²]+)?/u,""));
      label=fixLabel(label);if(!label&&q.u==="h")label="main d oeuvre";if(!label)label=q.u==="forfait"?"forfait":"travaux";
      if(label.split(" ").length>4)lignes.unsure=true;
      var pr=money(seg);if(pr!=null&&/\bttc\b/.test(seg))pr=Math.round(pr/(1+S.tva/100)*100)/100;
      lignes.push({libelle:label,quantite:q.q,unite:q.u,prix:pr});
    });
    return {lignes:lignes,afaire:afaire};
  }
  var hasDevis=/\b(devis|deviz|quote|presupuesto|orcamento|preventivo|teklif|kosztorys|smeta|smeta)\b/;
  function C(m,a,args){return {m:m,a:a,args:args||{}};}

  function parseSys(c){
    var n=c.p,raw=c.raw.trim(),m;
    if(/^(aide|help|\?|que sais tu faire|que peux tu faire|qu est ce que tu sais faire|tu sais faire quoi|comment ca marche)$/.test(n))return [C("bibliotheque","ouvrir",{})];
    if(/^(merci|merci beaucoup|super|parfait|top|ok|okay|d accord|daccord|ca marche|nickel|cool)$/.test(n))return [C("sys","politesse",{type:"merci",mot:n})];
    if(/^(bonjour|salut|bonsoir|coucou|hello|hey|hi|hola|ola|ciao|buongiorno|merhaba|czesc|buna)\b/.test(n)&&n.split(" ").length<=3)return [C("sys","politesse",{type:"bonjour"})];
    if(/\b(mode bricoleur|bricoleur du dimanche|je suis (un )?bricoleur|je suis (un )?particulier|passe en bricoleur|version bricoleur|mode particulier)\b/.test(n))return [C("sys","mode",{mode:"bricoleur"})];
    if(/\b(mode artisan|mode pro|je suis (un )?artisan|passe en artisan|version artisan|version pro|je suis (un )?professionnel)\b/.test(n))return [C("sys","mode",{mode:"artisan"})];
    if(/^(ferme|fermer|ferme l ecran|ferme le module|ferme ca|retour|retour au chat|cache|masque|reduis)$/.test(n))return [C("sys","fermer")];
    if(/^(annule|annuler|annule ca|annule la derniere( action| modification)?|defais|defaire|oups|retour arriere|reviens en arriere|undo|ctrl z|non annule)$/.test(n))return [C("sys","annuler")];
    if((m=n.match(/^(?:annule|annuler|defais|defaire)\s+(?:les\s+|mes\s+)?(\d{1,2}|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\s+(?:dernieres?\s+)?(?:actions?|modifications?|choses?|etapes?|changements?|operations?)(?:\s+dernieres?)?$/)))return [C("sys","annuler",{n:Math.min(30,/^\d/.test(m[1])?+m[1]:["deux","trois","quatre","cinq","six","sept","huit","neuf","dix"].indexOf(m[1])+2)})];
    if((m=raw.match(/^(?:oublie|désapprends|desapprends|efface)\s+(?:la phrase|l['’]expression|le mot|ce que veut dire|ce que signifie)\s*:?\s*[«"“]?\s*(.+?)\s*[»"”]?\s*$/i)))return [C("memoire","desapprendre",{texte:m[1]})];
    if(/^(oublie ca|oublie ce que tu viens d apprendre|tu as mal appris|desapprends ca|n apprends pas ca|oublie cette phrase)$/.test(n))return [C("memoire","desapprendre",{dernier:true})];
    if(/^(refais|refaire|retablis|retablir|redo|remets le|remets la)$/.test(n))return [C("sys","refaire")];
    if(/^(memoire|ta memoire|mes souvenirs|souvenirs|ce que tu sais|ce que tu as appris|qu as tu appris|mots appris|montre ta memoire)$/.test(n))return [C("memoire","ouvrir")];
    if(/\b(active|activer|telecharge|telecharger|installe|installer|allume)\b.*\b(modele|ia|intelligence)\b/.test(n))return [C("sys","ia",{on:true})];
    if(/\b(desactive|desactiver|coupe|arrete|eteins)\b.*\b(modele|ia|intelligence)\b/.test(n))return [C("sys","ia",{on:false})];
    if(/^(mesure|mesure toi|teste toi|test de recherche)$/.test(n))return [C("sys","mesure")];
    if(/^(entraine|entraine toi|entrainement|ameliore toi)$/.test(n))return [C("sys","entraine")];
    if(/^(sauvegarde|sauvegarder|backup)\b|\b(la|ma|une) sauvegarde\b/.test(n))return [C("sys","sauvegarde")];
    if(/^(remise a zero|remets tout a zero|reinitialise tout|efface tout|tout effacer|reset total)$/.test(n))return [C("sys","reinit")];
    if((m=raw.match(/^(?:oublie|supprime de ta memoire|efface de ta memoire)\s+(.+)$/i))&&!/\b(devis|rdv|rendez|facture|client|canap|lit|meuble)\b/i.test(m[1]))return [C("memoire","oublier",{texte:m[1].trim()})];
    var tm=raw.match(/^(?:retiens|apprends|mémorise|memorise|note bien|souviens toi)\s*(?:que\s+|:\s*)?(.+)$/i);
    /* autre langue : « remember: … », « запомни: … » */
    var hf=!tm&&horsFr(c)&&n.match(/^(?:retiens|apprends|memorise|note bien|souviens toi)\s*(?:que\s+|:\s*)?(.+)$/);
    if(hf){var bt=hf[1].trim(),pt=bt.match(/^(.{2,48}?)\s*(?:=|\bsignifie\b|\bveut dire\b|\bc est\b)\s*(.+)$/);
      if(pt&&pt[1].split(/\s+/).length<=4&&!/\b(je|mon|ma|mes|nous|notre)\b/.test(pt[1]))return [C("mot","apprendre",{mot:pt[1].replace(/^(?:le|la|les|un|une|l)\s+/,"").trim(),sens:pt[2].trim()})];
      /* « lajota = płytki » : le signe = disparaît à la normalisation, on le lit dans la phrase d'origine */
      var rt=origTail(raw,bt),eq=rt.split("=");
      if(eq.length===2&&eq[0].trim()&&eq[1].trim()&&eq[0].trim().split(/\s+/).length<=4){var mo=hn(eq[0]).trim();return [C("mot","apprendre",{mot:mo,sens:bt.indexOf(mo+" ")===0?bt.slice(mo.length).trim():hn(eq[1]).trim()})];}
      return [C("memoire","retenir",{fait:rt})];}
    if(tm){var body=tm[1].trim(),pr=body.match(/^(.{2,48}?)\s*(?:=|\bsignifie\b|\bveut dire\b|\bc['’]est\b|:)\s*(.+)$/i);
      if(pr&&pr[1].split(/\s+/).length<=4&&!/\b(je|mon|ma|mes|nous|notre)\b/i.test(pr[1]))return [C("mot","apprendre",{mot:pr[1].replace(/^(?:le|la|les|un|une|l['’])\s*/i,"").trim(),sens:pr[2].trim()})];
      return [C("memoire","retenir",{fait:body})];}
    var pr2=raw.match(/^(.{2,30}?)\s*=\s*(.+)$/);if(pr2)return [C("mot","apprendre",{mot:pr2[1].trim(),sens:pr2[2].trim()})];
    if((m=n.match(/\btva\s*(?:a|de|en)?\s*(\d+(?:\.\d+)?)\s*%?\s*(?:sur|pour|de|du|des)\s+(?:la |le |les |l )?(.+?)(?:\s+(?:seulement|uniquement|aussi))?$/))&&!/^(tout|toute|tous|le devis|ce devis|devis)$/.test(m[2]))return [C("devis","tva",{taux:pnum(m[1]),libelle:cleanLabel(m[2])||m[2]})];
    if((m=n.match(/^(?:mets |met )?(?:la |le |les |l )?(.+?)\s+(?:a|en)\s+(\d+(?:\.\d+)?)\s*%?\s*(?:de\s+)?tva\b/))&&!/\b(devis|tout)\b/.test(m[1]))return [C("devis","tva",{taux:pnum(m[2]),libelle:cleanLabel(m[1])||m[1]})];
    if((m=n.match(/\btva\s*(?:a|de|en)?\s*(\d+(?:\.\d+)?)\s*%?/)))return [C("devis","tva",{taux:pnum(m[1])})];
    return null;
  }

  function parseWork(c){
    var n=c.p,raw=c.raw,mo=money(n)!=null,nt=stripTimes(n),qn=qtys(nt).length,k=findClient(raw,c.n),art=S.mode==="artisan",m;
    var verbOpen=/\b(montre|montre moi|affiche|ouvre|ouvrir|voir|vois|consulte|ou en est|ou en sont|fais voir|regarde)\b/;
    /* paiements et factures */
    if(/\b(paye|payee|regle|reglee|vire|verse|encaisse|recu)\b/.test(n)&&mo){
      var mode=/cheque/.test(n)?"chèque":/espece|liquide|cash/.test(n)?"espèces":/carte|cb/.test(n)?"carte":/virement|vire/.test(n)?"virement":null;
      return [C("factures","paiement",{client:k||S.last.client,montant:money(n),mode:mode})];}
    if(/\bfacture\b/.test(n)&&!verbOpen.test(n)&&!/\b(statut|combien)\b/.test(n)){
      var pc=n.match(/(\d{1,2})\s*(?:%|pour ?cent)/);
      return [C("factures","creer",{client:k||S.last.client,type:/acompte/.test(n)?"acompte":"finale",montant:/acompte/.test(n)?money(n):null,pourcentage:pc?+pc[1]:null})];}
    if(/\b(reste a payer|solde|combien (?:il )?(?:me doit|reste)|paiements?|factures?)\b/.test(n))return [C("factures","ouvrir",{client:k||null})];
    /* signature */
    if(/\b(a signe|ont signe|est signe|vient de signer)\b/.test(n)&&hasDevis.test(n))return [C("devis","valider",{client:k})];
    if(/\b(signature|signer|signe|fais signer|faire signer|signez)\b/.test(n)&&!/\b(a signe)\b/.test(n))
      return [C("signature","ouvrir",{qui:/\b(client|fais signer|faire signer|qu il signe|qu elle signe)\b/.test(n)||(k&&!/\bje\b/.test(n))?"client":"artisan"})];
    /* devis : cycle */
    if(/\b(envoie|envoyer|envoi|transmets|transmettre|expedie)\b/.test(n)&&hasDevis.test(n))return [C("devis","envoyer",{})];
    if(hasDevis.test(n)&&/\b(refuse|decline|rejete|pas accepte)\b/.test(n))return [C("devis","refuser",{client:k})];
    if(hasDevis.test(n)&&/\b(accepte|valide|ok pour)\b/.test(n))return [C("devis","valider",{client:k})];
    if(/\bnouveau devis\b|\bcommence un devis\b|\bnouveau chantier\b/.test(n)&&!qn)return [C("devis","nouveau",{client:k})];
    if(/\b(mes devis|liste des devis|tous les devis|devis (?:accept|valide|refus|en cours)\w*)\b/.test(n)&&!qn)return [C("devis","liste",{filtre:/accept|valide/.test(n)?"validé":/refus/.test(n)?"refusé":null})];
    if(hasDevis.test(n)&&(verbOpen.test(n)||/^(le |mon )?devis( de \S+| pour \S+)?$/.test(n))&&!qn)return [C("devis","ouvrir",{client:k})];
    if((m=n.match(/\b(?:enleve|retire|supprime|efface)\s+(?:la ligne\s+)?(.+?)\s+du devis\b/)))return [C("devis","supprimer_ligne",{libelle:cleanLabel(m[1])})];
    /* services / prix */
    if(/\b(mes services|mes prix|mes tarifs|liste des prix|grille tarifaire|tarifs)\b/.test(n)&&!mo)return [C(art?"services":"courses","ouvrir",{})];
    if(mo&&!qn){var pr=parsePrice(n);if(pr&&(S.clients[clientKey(pr.libelle)]||/^\p{Lu}/u.test(raw.trim())&&pr.libelle.split(" ").length===1&&!E.isKnown(pr.libelle)&&!findService(pr.libelle)))return null;if(pr&&/\bttc\b/.test(n)){pr.ttc=pr.prix;pr.prix=Math.round(pr.prix/(1+S.tva/100)*100)/100;}if(pr)return [art?C("services","definir",{nom:pr.libelle,prix:pr.prix,unite:pr.unite,ttc:pr.ttc||null}):C("courses","prix",{nom:pr.libelle,prix:pr.prix,unite:pr.unite})];}
    /* planning */
    var rdvw=/\b(rdv|rendez vous|visite|intervention|reunion|livraison|creneau|chantier chez)\b/;
    if(/\b(annule|annuler|desiste|supprime)\b/.test(n)&&(rdvw.test(n)||/\bchez\b/.test(n)))return [C("planning","annuler",{client:k,date:(parseDate(n)?iso(parseDate(n)):null)})];
    if(/\b(decale|decaler|reporte|reporter|repousse|deplace|deplacer|avance|avancer|change l heure)\b/.test(n)&&(rdvw.test(n)||/\bchez\b/.test(n))){
      var part=n.split(/\b(?:a|au|pour|vers)\b(?=\s+(?:demain|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|\d))/),nd=parseDate(part.length>1?part.slice(1).join(" "):n),nt2=parseTime(part.length>1?part.slice(1).join(" "):n);
      return [C("planning","deplacer",{client:k,date:nd?iso(nd):null,heure:nt2?pad(nt2.h)+":"+pad(nt2.m):null})];}
    if(/\b(trouve|trouver|cherche|propose)\b.*\b(creneaux?|trou|moment|dispo|place|date)\b|\bcreneaux? libres?\b|\bquand (?:suis je|je suis|est ce que je suis) (libre|dispo)\b/.test(n)){var du0=parseDur(n),d0=parseDate(n);return [C("planning","libre",{date:d0?iso(d0):null,duree_min:du0?du0.min:60})];}
    if(/\b(pas dispo|indisponible|absent|en conges?|vacances|ferme le|je ne travaille pas|jour off)\b/.test(n)){
      var r=n.match(new RegExp("\\bdu (\\d{1,2})(?: ("+MOIS.join("|")+"))? au (\\d{1,2}) ("+MOIS.join("|")+")"));
      if(r){var y=B.now().getFullYear(),f=new Date(y,MOIS.indexOf(r[2]||r[4]),+r[1]),t=new Date(y,MOIS.indexOf(r[4]),+r[3]);if(t<sod(B.now())){f.setFullYear(y+1);t.setFullYear(y+1);}return [C("planning","absence",{du:iso(f),au:iso(t),motif:(n.match(/(vacances|conges?|ferie|formation|repos)/)||[0,"indisponible"])[1]})];}
      var d1=parseDate(n);if(d1)return [C("planning","absence",{du:iso(d1),au:iso(d1),motif:(n.match(/(vacances|conges?|ferie|formation|repos)/)||[0,"indisponible"])[1]})];}
    if(/\b(qu est ce que j ai|j ai quoi|quoi de prevu|mon planning|mon agenda|planning|agenda|mes rdv|mes rendez vous|mon programme|je fais quoi|emploi du temps|ma semaine|ma journee)\b/.test(n)&&!/\b(ajoute|mets|prends|cale|note)\b/.test(n)){var d2=parseDate(n);return [C("planning","ouvrir",{date:d2?iso(d2):null,semaine:/semaine/.test(n)})];}
    if((rdvw.test(n)&&(parseDate(n)||parseTime(n)||k||/\b(rdv|rendez vous)\b/.test(n))||(/\b(cale|prends|prendre|note|bloque|reserve|planifie|prevois|programme)\b/.test(n)&&(parseDate(n)||parseTime(n))))&&(!qn||rdvw.test(n)&&parseDate(n)&&parseTime(n))&&!/\bdevis\b/.test(n)&&(parseDate(n)||parseTime(n)||rdvw.test(n))){
      var d3=parseDate(n),t3=parseTime(n),du3=parseDur(n);if(du3&&du3.start&&!t3)t3=du3.start;
      var tit=(n.match(/\b(visite|intervention|reunion|livraison|pose|chantier|metre|devis)\b/)||[0,"rendez-vous"])[1];
      /* « … pour sa salle de bain » : l'objet du rendez-vous devient son titre (le chat s'en sert pour préparer le devis) */
      if(tit==="rendez-vous"){var ob=(c.lang==="fr"?raw:n).match(/\bpour\s+(?:sa|son|ses|la|le|les|l['’ ]|une|un|refaire\s+(?:sa|son|ses|la|le|les))\s*([\p{L}'’ -]{3,40})/iu);
        if(ob){var obt=ob[1].split(/\s+(?:demain|apr[eè]s demain|aujourd|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|[àa]|vers|chez|avec|le|la)\b/i)[0].trim();if(obt.length>=3&&!E.isStop(hn(obt)))tit=obt;}}
      return [C("planning","ajouter",{date:d3?iso(d3):null,heure:t3?pad(t3.h)+":"+pad(t3.m):null,duree_min:du3?du3.min:60,client:k,titre:cap(tit)})];}
    /* pointage */
    if(/\b(pointe|pointer|j arrive|j arrive sur|j ai commence|debut de chantier|je commence|je suis sur le chantier|je suis arrive)\b/.test(n))if(!/\b(dire|dis|previens|prevenir|sms|texto|message|ecris|mail|whatsapp)\b/.test(n)&&!/\bj arrive dans\b/.test(n))return [C("pointage","entree",{client:k||S.last.client})];
    if(/\b(fin de chantier|j ai fini|j ai termine|je pars|je quitte|fin du pointage|depointe|depointer|je rentre)\b/.test(n)&&!hasDevis.test(n))return [C("pointage","sortie",{})];
    if(/\b(mes heures|heures de la semaine|temps de travail|combien d heures|pointages?)\b/.test(n))return [C("pointage","ouvrir",{})];
    /* métré */
    if((m=n.match(/\b(\d+(?:\.\d+)?)\s*(?:m|metres?)?\s*(?:x|par|sur|fois)\s*(\d+(?:\.\d+)?)\s*(?:m|metres?)?\b/))&&/\b(piece|salle|chambre|sejour|cuisine|surface|sol|mur|metre|calcule|fait|fais|mesure)\b/.test(n)&&!mo&&!/\bterrain\b/.test(n)){
      var hm=n.match(/hauteur\s*(?:de|sous plafond)?\s*(\d+(?:\.\d+)?)/);var rm=findRoom(n);
      return [C("metre","calculer",{longueur:pnum(m[1]),largeur:pnum(m[2]),hauteur:hm?pnum(hm[1]):null,piece:rm?rm.id:null})];}
    /* clients */
    if(/\b(mes clients|liste des clients|tous les clients|carnet clients?|fichier clients?)\b/.test(n))return [C("clients","ouvrir",{})];
    var ct=contact(raw);
    if(k&&Object.keys(ct).length&&!qn&&!hasDevis.test(n))return [C("clients","maj",Object.assign({nom:clientName(k)},ct))];
    if(k&&/\b(fiche|infos?|coordonnees|numero|telephone|adresse|mail)\b/.test(n)&&!qn&&!hasDevis.test(n))return [C("clients","ouvrir",{nom:clientName(k)})];
    if((m=raw.match(/\b(?:nouveau client|nouvelle cliente|ajoute (?:le |la )?client(?:e)?)\s*:?\s*([A-ZÀ-Ý][\p{L}'’-]+(?:\s+[A-ZÀ-Ý][\p{L}'’-]+)?)/u)))return [C("clients","maj",Object.assign({nom:m[1]},ct))];
    /* fournisseurs */
    if((m=raw.match(/\bfournisseur(?:s)?\s+(?:de|d'|pour (?:le |la |les )?)\s*([\p{L}' ]+?)\s*(?:c'est|c’est|est|:|=)\s*([\p{L}0-9'’ .-]+?)\s*$/iu)))return [C("fournisseurs","ajouter",{nom:m[2].trim(),specialite:m[1].trim()})];
    if((m=raw.match(/\b(?:mon|nouveau) fournisseur\s*(?:c'est|c’est|est|:)?\s*([\p{L}0-9'’ .-]+?)\s*$/iu)))return [C("fournisseurs","ajouter",{nom:m[1].trim(),specialite:null})];
    if(horsFr(c)){var fo;
      if((m=n.match(/\bfournisseurs?\s+(?:de|d|pour (?:le |la |les )?)\s*([\p{L} ]+?)\s*(?:c est|est|:|=)\s*([\p{L}0-9 .-]+?)\s*$/u))&&(fo=origOf(raw,m[2])))return [C("fournisseurs","ajouter",{nom:fo,specialite:m[1].trim()})];
      if((m=n.match(/\b(?:mon|nouveau) fournisseur\s*(?:c est|est|:)?\s*([\p{L}0-9 .-]+?)\s*$/u))&&(fo=origOf(raw,m[1])))return [C("fournisseurs","ajouter",{nom:fo,specialite:null})];}
    if(/\b(mes fournisseurs|liste des fournisseurs|fournisseurs)\b/.test(n)&&!qn&&!/\bcommande\b/.test(n))return [C("fournisseurs","ouvrir",{})];
    if((m=raw.match(/\bcommande[rs]?\s+(.+?)\s+(?:chez|a|à)\s+([A-ZÀ-Ý][\p{L}0-9'’ .-]+)$/u)))return orderCmd(m[1],m[2].trim());
    /* autre langue : le fournisseur est le premier nom écrit avec une majuscule (ou déjà connu) après « chez », « à », « de »… */
    if(horsFr(c)&&(m=n.match(/\bcommande[rs]?\s+(.+)$/))){var oc=orderSplit(raw,m[1]);if(oc)return orderCmd(oc.what,oc.nom);}
    /* bricoleur : courses, calculs de matériaux, demande de devis */
    if(/\b(liste de courses|mes courses|ma liste|courses|budget|mon budget|ce que je dois acheter|quoi acheter)\b/.test(n)&&!qn)return [C("courses","ouvrir",{})];
    var trav=n.match(/\b(carrel\w*|carrelage|peindre|peinture|parquet|stratifie|placo|enduit|tapisserie|papier peint|lino|vinyle|faience|beton|chape|ragreage)\b/);
    var sq=n.match(/(\d+(?:\.\d+)?)\s*(?:m2|m²|metres? carres?)/);
    if(trav){trav[1]=/^carrel/.test(trav[1])?"carrelage":/^(peindre|peinture)$/.test(trav[1])?"peinture":trav[1];}
    if(trav&&sq&&(!art||/\b(combien|il me faut|il faut|quoi acheter|quantite|calcule|prevoir)\b/.test(n)))return [C("courses","calcul",{travail:trav[1],surface:pnum(sq[1])})];
    if(/\b(demande de devis|trouve(r)? un artisan|faire faire|je veux un devis|demander un devis)\b/.test(n)&&!art)return [C("projet","demande",{})];
    if(!art&&qn&&/\b(achete|acheter|il me faut|il faut|ajoute|prends|besoin|liste)\b/.test(n)){var arts2=qtys(nt).map(function(q,ix,all){var nxt=all[ix+1];var seg=nt.slice(q.i+q.len,nxt?nxt.i:nt.length);return {nom:cleanLabel(seg.split(/,|\bet\b/)[0])||"article",quantite:q.q,unite:q.u};});return [C("courses","ajouter",{articles:arts2})];}
    return null;
  }
  function orderCmd(what,nom){var cn=hn(what),arts=qtys(cn).map(function(q){return {nom:cleanLabel(cn.slice(q.i+q.len).split(/,|\bet\b/)[0])||"article",quantite:q.q,unite:q.u};});
    if(!arts.length){var mm=cn.match(/^(\d+)\s+(.+)$/);arts=[mm?{nom:cleanLabel(mm[2]),quantite:+mm[1],unite:"u"}:{nom:cleanLabel(cn),quantite:1,unite:"u"}];}
    return [C("fournisseurs","commande",{nom:nom,articles:arts})];}
  function orderSplit(raw,rest){var re=/\s(?:chez|aupres de|dans le|dans la|dans|a|de|da|le|la|en)\s/g,x;
    while((x=re.exec(rest))){var o=origOf(raw,rest.slice(x.index+x[0].length));if(o&&(/^\p{Lu}/u.test(o)||FOURNOK(o)))return {what:rest.slice(0,x.index),nom:o};re.lastIndex=x.index+1;}return null;}
  /* « rajoute 2 h », « 3 m² en plus » : on ajoute à la ligne existante ; « enlève 2 h » : on retire */
  function lineOp(n){return /\b(rajoute|rajouter|ajoute|ajouter|en plus|de plus|supplementaires?|encore|en rab)\b/.test(n)?"+":/\b(enleve|enlever|retire|retirer|retranche|deduis|deduire|moins)\b/.test(n)?"-":null;}
  function parseDevisBuild(c){
    var n=c.p,nt=stripTimes(n),qn=qtys(nt).length,k=findClient(c.raw,c.n),ct=contact(c.raw);
    if(S.mode!=="artisan"){if(!qn)return null;var arts=qtys(nt).map(function(q,ix,all){var nxt=all[ix+1];var seg=nt.slice(q.i+q.len,nxt?nxt.i:nt.length),pre=nt.slice(ix?all[ix-1].i+all[ix-1].len:0,q.i);var lab=cleanLabel(seg.split(/,|\bet\b/)[0])||cleanLabel(pre)||"article";return {nom:lab,quantite:q.q,unite:q.u};});return [C("courses","ajouter",{articles:arts})];}
    if(!(qn>0||(hasDevis.test(n)&&(k||Object.keys(ct).length))||(Object.keys(ct).length&&k)||/\bfournisseur\b/.test(n)&&hasDevis.test(n)))return null;
    var out=[],L=devisLines(c,k);if(L.lignes.unsure)return null;
    if(k||Object.keys(ct).length)out.push(C("devis","client",Object.assign({nom:k?clientName(k):null},ct)));
    var fm=c.raw.match(/\bfournisseur\s*(?:c'est|c’est|est|:)?\s*(\p{L}[\p{L}'-]+(?:\s+(?!(?:et|pour|a|au|il|le|la|les|de|du)(?![\p{L}]))\p{L}[\p{L}'-]+)?)/u);
    if(fm)out.push(C("devis","fournisseur",{nom:fm[1]}));
    var op=lineOp(n);
    if(L.lignes.length)out.push(C("devis","lignes",Object.assign({client:k?clientName(k):null,lignes:L.lignes},op?{op:op}:{})));
    if(L.afaire.length)out.push(C("devis","afaire",{taches:L.afaire}));
    var rem=c.raw.match(/\b(?:remarque|note|attention)\s*:?\s*(.+)$/i);if(rem)out.push(C("devis","remarque",{texte:rem[1].trim()}));
    return out.length?out:null;
  }

  /* ---------- module 3D : phrase -> commandes ---------- */
  var EXT_TYPES={terrace:1,pool:1,gtable:1,lounger:1,parasol:1,tree:1};
  var RE={
    rm:/\b(enlev|retir|supprim|vire|ote|efface|jette|elimin|degage|enleve)\w*|\b(pas de|sans|plus de)\b(?!\s+(lumiere|meubles?|place|espace))/,
    rot:/\b(tourn|pivot|orient|retourn|rotation)\w*/,mv:/\b(deplac|bouge|decal|pouss|glisse|rapproch|eloign|place le|place la|mets le|mets la)\w*/,
    rep:/\b(remplac|echang|substitu|troqu|transforme)\w*/,
    add:/\b(ajout\w*|rajout\w*|mets|mettre|met|placer?|placez|poser?|posez|install\w*|veux|voudrais|voulais|voulait|aimerais|faut|faudrait|souhait\w*|besoin|prevoi\w*|donne|cree|creer|fais|faire)\b/,
    again:/\b(encore un|encore une|un autre|une autre|duplique|un deuxieme|une deuxieme|un second|une seconde|pareil|idem)\b/,
    big:/\b(plus grand|plus large|plus long|agrandi\w*|elargi\w*|allonge\w*|plus gros|plus grande)\b/,small:/\b(plus petit|plus petite|moins grand|plus etroit|plus court|reduis|reduit|retreci\w*|raccourci\w*|diminue\w*)\b/,
    paint:/\b(peins|peindre|peint|repeins|repeindre|peinture|colore|teinte|vernis|couleur)\w*/,
    furnish:/\b(meuble|meubler|amenage|amenager|equipe|equiper|remplis|decore|decorer)\s+(la|le|l|les|toute|tout|ma|mon|cette|ce)\b/,
    empty:/\b(vide|vider|videz)\b|\b(supprime|enleve|efface|retire) tout\b|\btout supprimer\b/};
  function parseScene(c){
    var n=c.p,out=[],m;
    if(/^(comme au debut|recommence la maquette|reinitialise la maquette|remets tout comme avant|maquette a zero|efface la maquette)$/.test(n))return [C("scene","reinit")];
    if(/\bvue de dessus\b|\bvue du dessus\b|\bvue en plan\b|\ben plan\b/.test(n))return [C("scene","vue",{vue:"dessus"})];
    if(/\bvue interieure\b|\bvisite\b|\bvue de l interieur\b/.test(n)){var r0=findRoom(n);return [C("scene","vue",{vue:"interieure",piece:r0?r0.id:null})];}
    if(/\bvue d ensemble\b|\bvue generale\b|\bvue 3d\b/.test(n))return [C("scene","vue",{vue:"ensemble"})];
    if(/\bmode nuit\b|\bambiance nuit\b|\beteins\b/.test(n))return [C("scene","ambiance",{nuit:true})];
    if(/\bmode jour\b|\bambiance jour\b|\ballume\b/.test(n))return [C("scene","ambiance",{nuit:false})];
    if(/\bmurs bas\b|\bbaisse les murs\b/.test(n))return [C("scene","murs",{bas:true})];
    if(/\bmurs hauts\b|\bremonte les murs\b/.test(n))return [C("scene","murs",{bas:false})];
    if((m=n.match(/\bhauteur(?: sous plafond)?\s*(?:de|a)?\s*(\d+(?:\.\d+)?)\s*(m|cm)?\b/))&&!findEquip(n).length)return [C("scene","reglage",{hauteur:m[2]==="cm"?pnum(m[1])/100:pnum(m[1])})];
    if((m=n.match(/\bepaisseur(?: des murs)?\s*(?:de|a)?\s*(\d+(?:\.\d+)?)\s*(cm|m)?\b/)))return [C("scene","reglage",{epaisseur:m[2]==="m"?pnum(m[1]):pnum(m[1])/100})];
    if(/\bterrain\b/.test(n)){if((m=n.match(/(\d+(?:\.\d+)?)\s*(?:m)?\s*(?:x|par|sur)\s*(\d+(?:\.\d+)?)/)))return [C("scene","terrain",{largeur:pnum(m[1]),longueur:pnum(m[2])})];
      if((m=n.match(/(\d+(?:\.\d+)?)\s*(?:m2|m²|metres? carres?)/)))return [C("scene","terrain",{surface:pnum(m[1])})];}
    if((m=n.match(/\brenomme\s+(?:la |le |l )?(.+?)\s+en\s+(.+)$/))){var rr=findRoom(m[1]);if(rr)return [C("scene","renommer",{piece:rr.id,nom:m[2]})];}
    /* étages */
    if(/\bplain pied\b/.test(n))return [C("scene","etage",{action:"plainpied"})];
    if(/\brez de chaussee\b/.test(n))return [C("scene","etage",{action:"aller",niveau:0})];
    if((m=n.match(/\b(?:va|aller|vas|passe)\s+(?:a |au )?(?:l )?etage\s*(\d)\b/)))return [C("scene","etage",{action:"aller",niveau:+m[1]})];
    if(/^(monte|monter|en haut|etage du dessus)$/.test(n))return [C("scene","etage",{action:"monter"})];
    if(/^(descends|descendre|en bas|etage du dessous)$/.test(n))return [C("scene","etage",{action:"descendre"})];
    if(/\betages?\b/.test(n)&&!findEquip(n).length){if(RE.rm.test(n))return [C("scene","etage",{action:"enlever"})];if(RE.add.test(n)||/\b(deuxieme|second|troisieme|un)\b/.test(n))return [C("scene","etage",{action:"ajouter"})];}
    /* toit */
    if(/\btoit(ure)?\b/.test(n)&&!/\b(est|sont|etait|sur le toit|monte sur|chat|oiseau|pigeon)\b/.test(n)){
      if(RE.rm.test(n))return [C("scene","toit",{enlever:true})];
      var forme=/\bplat\b/.test(n)?"plat":/\b(4|quatre) pans\b/.test(n)?"4 pans":/\b(2|deux) pans\b/.test(n)?"2 pans":null,mt=findMat(n),col=findColor(n);
      return [C("scene","toit",{forme:forme||"2 pans",matiere:mt?mt.name:(col?col.name:null)})];}
    /* extérieur (jardin, route, allée, haie, clôture) */
    var EXT=[["jardin",/\bjardin\b/],["route",/\b(route|rue|chemin d acces|acces sur la route|acces)\b/],["allee",/\ballee\b/],["haie",/\bhaies?\b/],["cloture",/\b(clotures?|grillage|portail)\b/]];
    var exts=EXT.filter(function(e){return e[1].test(n);}).map(function(e){return e[0];});
    if(exts.length&&!findEquip(n).length&&!/\bdans le jardin\b/.test(n)){
      if(RE.rm.test(n))return [C("scene","exterieur",{enlever:exts})];
      if(exts.indexOf("route")>=0&&exts.indexOf("jardin")>=0)exts.push("allee");
      var mt2=findMat(n);return [C("scene","exterieur",{ajouter:exts,matiere:mt2?mt2.name:(/\bbois\b/.test(n)?"bois":null)})];}
    /* façade */
    if(/\b(facade|facades|murs? exterieurs?|crepi exterieur)\b/.test(n)){var col2=findColor(n),mt3=findMat(n);if(col2&&mt3&&hn(col2.name)===mt3.name)col2=null;if(col2||mt3)return [C("scene","facade",{couleur:col2?col2.name:null,matiere:mt3?mt3.name:null})];}
    /* information */
    if(/\b(combien|nombre de)\b/.test(n)){var eqq=findEquip(n);if(eqq.length)return [C("scene","info",{quoi:"nombre",type:eqq[0].type})];}
    if(/\bsurface\b/.test(n)&&!/\bsurface de \d/.test(n)){var r1=findRoom(n);return [C("scene","info",{quoi:"surface",piece:r1?r1.id:null})];}
    if(/\b(prix|cout|coute|budget|combien ca coute|tarif)\b/.test(n)&&!money(n))return [C("scene","info",{quoi:"prix"})];
    var eq=findEquip(n),room=findRoom(n),color=findColor(n),mat=findMat(n),pos=findPos(n),all=/\b(partout|toute la maison|tous les murs|toutes les pieces|tous les sols|toute la surface)\b/.test(n);
    var lastT=S.last.type;
    if(RE.empty.test(n)&&!eq.length){return [C("scene","vider",{piece:room?room.id:(/\b(tout|maison)\b/.test(n)?"maison":S.last.room||"maison")})];}
    if(RE.furnish.test(n)||/^meuble (toute la maison|tout|la maison)$/.test(n)){return [C("scene","meubler",{piece:room?room.id:"maison"})];}
    if(RE.rep.test(n)&&eq.length>=2)return [C("scene","remplacer",{de:eq[0].type,par:eq[1].type,piece:room?room.id:null})];
    if(RE.rm.test(n)&&eq.length){return eq.map(function(e){return C("scene","enlever",{type:e.type,piece:room?room.id:null,tous:/\b(tous|toutes|les)\s+$/.test(n.slice(Math.max(0,e.i-8),e.i))||/\btous les\b|\btoutes les\b/.test(n)});});}
    var surf=/\b(murs?|cloisons?|parois?|plafond)\b/.test(n),sol=/\b(sol|sols|par terre|plancher|revetement)\b/.test(n);
    if((RE.paint.test(n)||surf||sol)&&(color||mat)&&!(eq.length&&!surf&&!sol)){
      if((sol||mat&&mat.kind==="sol"&&!surf))return [C("scene","sol",{piece:all?"partout":(room?room.id:null),matiere:mat?mat.name:null,couleur:color?color.name:null})];
      return [C("scene","peindre",{cible:/\bplafond\b/.test(n)?"plafond":"murs",piece:all?"partout":(room?room.id:null),couleur:color?color.name:null,matiere:mat&&!color?mat.name:null})];}
    if(mat&&mat.kind==="sol"&&!eq.length&&(room||all||RE.add.test(n)||n.split(" ").length<=5))return [C("scene","sol",{piece:all?"partout":(room?room.id:null),matiere:mat.name,couleur:color?color.name:null})];
    if(color&&(eq.length||lastT)&&(RE.paint.test(n)||/\b(en|couleur)\b/.test(n))&&!RE.add.test(n.replace(/\bmets\s+(le|la|les|l)\b/,""))||color&&eq.length&&/\b(mets|met)\s+(le|la|les|l)\b/.test(n))
      return [C("scene","couleur",{type:eq.length?eq[0].type:lastT,couleur:color.name,piece:room?room.id:null})];
    if(RE.rot.test(n)&&(eq.length||lastT)){var deg=(n.match(/\b(\d{2,3})\s*(?:degres?|°)?/)||[])[1];return [C("scene","tourner",{type:eq.length?eq[0].type:lastT,angle:deg?+deg:(/demi tour/.test(n)?180:90)})];}
    if((RE.big.test(n)||RE.small.test(n)||/\ba \d+(?:\.\d+)?\s*(m|cm)\b/.test(n)&&/\bagrandi|allonge|elargi|redui|retreci/.test(n))&&(eq.length||lastT)){
      var lm=n.match(/\b(?:a|de|en)\s+(\d+(?:\.\d+)?)\s*(m|cm)\b/);return [C("scene","taille",{type:eq.length?eq[0].type:lastT,sens:RE.small.test(n)?"moins":"plus",longueur:lm?(lm[2]==="cm"?pnum(lm[1])/100:pnum(lm[1])):null})];}
    if(RE.mv.test(n)&&(eq.length||lastT)&&(pos||room)&&!/\b(un|une|des|deux|trois)\s+\S+/.test(n.replace(/\b(mets|met|place)\s+(le|la|les|l)\b.*/,""))){
      return [C("scene","deplacer",{type:eq.length?eq[0].type:lastT,position:pos,piece:room&&!pos?room.id:null})];}
    for(var t=0;t<THEMES.length;t++){if(THEMES[t][1]&&THEMES[t][1].test(n)&&!eq.length)return [C("scene","style",{theme:THEMES[t][0],piece:room?room.id:null})];}
    if(RE.again.test(n)&&(eq.length||lastT))return [C("scene","ajouter",{items:[{type:eq.length?eq[0].type:lastT,nombre:1,piece:room?room.id:null}]})];
    var unk=n.split(" ").filter(function(w){return w.length>=3&&!knownWord(w);});
    if(eq.length&&(RE.add.test(n)||(room||n.split(" ").length<=6)&&!unk.length)&&!qtys(stripTimes(n)).some(function(q){return q.u!=="u";})){
      var col=eq.length===1?color:null;
      return [C("scene","ajouter",{items:eq.map(function(e){return {type:e.type,nombre:countAt(n,e.i),piece:room?room.id:null,couleur:col?col.name:null,position:eq.length===1?pos:null};})})];}
    for(var s=0;s<SITU.length;s++){if(SITU[s][1].test(n))return [C("scene","situation",{code:SITU[s][0],piece:room?room.id:null})];}
    if(/^(ajoute|ajouter|mets|rajoute|ajoute moi|mets moi|place)$/.test(n))return [C("sys","question",{texte:tr("Ajouter quoi, et dans quelle pièce ?"),pour:"scene"})];
    if(room&&n.split(" ").length<=3&&!eq.length)return [C("scene","vue",{vue:"interieure",piece:room.id})];
    return null;
  }

  /* ---------- outils d'exécution ---------- */
  function findService(label){
    var ln=hn(label);if(!ln)return null;var best=null,bs=0;
    S.services.forEach(function(s){var sn=hn(s.nom),sc=0;
      if(sn===ln)sc=2;else if((" "+ln+" ").indexOf(" "+sn+" ")>=0||(" "+sn+" ").indexOf(" "+ln+" ")>=0)sc=1.5;else sc=sim(ln,sn);
      if(sc>bs){bs=sc;best=s;}});
    return bs>=0.62?best:null;
  }
  function sim(a,b){var x=E.embed(a),y=E.embed(b),s=0;for(var i=0;i<x.length;i++)s+=x[i]*y[i];return s;}
  function setService(nom,prix,unite){var s=findService(nom),act;
    if(s){act="modifié";s.prix=prix;if(unite)s.unite=unite;}else{act="ajouté";s={nom:cap(nom),unite:unite||"forfait",prix:prix};S.services.push(s);}
    emit("services","definir",{nom:s.nom,prix:prix,unite:s.unite});return {s:s,act:act};}
  function ensureClient(nom,extra){if(!nom)return null;var k=clientKey(nom),c=S.clients[k];
    if(!c){var nm0=String(nom).trim();c=S.clients[k]={nom:/\p{Lu}/u.test(nm0)?cap(nm0):tcase(nm0),tel:"",email:"",adresse:"",notes:[],created:Date.now()};emit("clients","creer",{client:c.nom});}
    if(extra)["tel","email","adresse"].forEach(function(f){if(extra[f])c[f]=extra[f];});if(extra&&extra.note)c.notes.push(extra.note);
    S.last.client=k;return k;}
  function getCur(){return S.devis.filter(function(d){return d.id===S.cur;})[0]||null;}
  function newDevis(k){var d={id:id(),num:"D-"+B.now().getFullYear()+"-"+pad(S.devis.length+1),client:k||null,lignes:[],afaire:[],fournisseurs:[],remarques:[],statut:"brouillon",sig:{},created:Date.now()};S.devis.push(d);S.cur=d.id;return d;}
  function curDevis(k){var d=getCur();
    if(!d||(k&&d.client&&d.client!==k)||d.statut!=="brouillon"&&k&&d.client!==k){
      var ex=k&&S.devis.filter(function(x){return x.client===k&&x.statut==="brouillon";}).slice(-1)[0];
      if(ex){S.cur=ex.id;d=ex;}else d=newDevis(k);}
    if(k&&!d.client)d.client=k;return d;}
  function brutHT(d){return d.lignes.reduce(function(a,l){return a+(l.prix!=null?l.prix*l.quantite:0);},0);}
  function totalHT(d){var b=brutHT(d);if(d.remise&&d.remise.valeur)b-=d.remise.type==="%"?b*d.remise.valeur/100:d.remise.valeur;return Math.max(0,Math.round(b*100)/100);}
  function rateOf(d,l){return l&&l.tva!=null?+l.tva:d&&d.tva!=null?+d.tva:S.tva;}
  /* TVA par taux (la remise est répartie au prorata des lignes) */
  function tvaParTaux(d){var b=brutHT(d),f=b>0?totalHT(d)/b:1,by={};d.lignes.forEach(function(l){if(l.prix==null)return;var t=rateOf(d,l),base=l.prix*l.quantite*f;by[t]=by[t]||{taux:t,base:0,tva:0};by[t].base+=base;by[t].tva+=base*t/100;});
    return Object.keys(by).map(function(k){var x=by[k];x.base=Math.round(x.base*100)/100;x.tva=Math.round(x.tva*100)/100;return x;}).sort(function(a,b){return b.taux-a.taux;});}
  function totalTTC(d){var L=tvaParTaux(d);if(!L.length)return totalHT(d)*(1+rateOf(d,null)/100);return Math.round(L.reduce(function(s,x){return s+x.base+x.tva;},0)*100)/100;}
  function devisOf(k){var all=S.devis.filter(function(d){return (!k||d.client===k)&&d.lignes.length;});var v=all.filter(function(d){return d.statut==="validé";});return (v.length?v:all).slice(-1)[0]||null;}
  function paid(k){return S.paiements.filter(function(p){return p.client===k;}).reduce(function(a,p){return a+p.montant;},0);}
  function lastSent(k){var r=S.devis.filter(function(d){return (d.statut==="envoyé"||d.statut==="signé")&&(!k||d.client===k);});return r[r.length-1]||null;}
  function overlaps(s,e,except){return S.rdv.filter(function(r){return r.id!==except&&r.start<e&&r.start+r.min*60000>s;});}
  function absentAt(s,e){return S.absences.filter(function(a){return a.from<e&&a.to>s;})[0]||null;}
  function fmtRdv(r){var d=new Date(r.start);return tr("{0} à {1} · {2}{3}",[fdate(d),ftime(d.getHours(),d.getMinutes()),r.titre,(r.client?" · "+clientName(r.client):"")]);}
  function resolveType(x){if(!x)return null;if(TYPES[x])return x;var e=findEquip(hn(x));return e.length?e[0].type:null;}
  function resolveRoom(x){if(!x)return null;if(x==="partout"||x==="maison")return x;var h=hn(x);if(ROOMNAME[h]||h==="exterieur")return h;var r=findRoom(h);return r?r.id:h;}
  function colorHex(name){if(!name)return null;if(/^#[0-9a-f]{6}$/i.test(name))return name;var c=findColor(hn(name));return c?c.hex:null;}
  function nom3d(t){var nm=M.names&&M.names[t];if(!PSEUDO&&nm&&nm[LANG])return nm[LANG];return trw(TYPES[t]?TYPES[t].fr:t);}
  function tname(t,n){if(LANG!=="fr"||PSEUDO){var g=String(nom3d(t)).toLowerCase();return n>1?n+" × "+g:g;}var f=(TYPES[t]?TYPES[t].fr:t).toLowerCase();return n>1?n+" "+f.replace(/^(\S+)/,function(w){return /[sx]$/.test(w)?w:w+"s";}):f;}
  function art(t){if(LANG!=="fr"||PSEUDO)return String(nom3d(t)).toLowerCase();var f=(TYPES[t]?TYPES[t].fr:t).toLowerCase();return /^[aeiouyhéèêî]/.test(f)?"l’"+f:(/^(table|chaise|baignoire|douche|plante|armoire|bibliothèque|cheminée|lampe|commode|prise|fenêtre|porte|piscine|terrasse|hotte|chaudière|arrivée|cuisinière)/.test(f)?"la "+f:"le "+f);}
  /* scène */
  var SC=function(){return S.scene;};
  function level(){var s=SC();if(!s.levels[s.lv])s.lv=0;return s.levels[s.lv];}
  function room(id){var lv=level();if(!lv.rooms[id])lv.rooms[id]={name:roomLabel(id),w:id==="sejour"?5:id==="wc"?1.5:id==="salle de bain"?2.5:id==="entree"?2:id==="cellier"?2:4,l:id==="sejour"?4.5:id==="wc"?1.2:id==="salle de bain"?2.2:id==="entree"?3:id==="cellier"?2:3.5,items:[],murs:null,sol:null,theme:null};return lv.rooms[id];}
  function roomsOf(p){var lv=level();if(!p||p==="partout"||p==="maison")return Object.keys(lv.rooms);return [p];}
  function pickRoom(type,explicit){if(explicit)return explicit;if(EXT_TYPES[type])return "exterieur";var pp=(M.ppt||{})[type];if(pp)return pp;return S.last.room||"sejour";}
  function itemsOf(type,piece){var lv=level(),out=[];Object.keys(lv.rooms).forEach(function(r){if(piece&&piece!=="partout"&&r!==piece)return;lv.rooms[r].items.forEach(function(it){if(!type||it.type===type)out.push({it:it,r:r});});});
    if(!piece||piece==="exterieur")SC().ext.items.forEach(function(it){if(!type||it.type===type)out.push({it:it,r:"exterieur"});});return out;}
  function addItem(type,r,opt){var it={id:id(),type:type,couleur:opt.couleur||null,pos:opt.position||null,rot:0,scale:1};
    if(r==="exterieur")SC().ext.items.push(it);else room(r).items.push(it);return it;}
  function removeIt(x){if(x.r==="exterieur"){var a=SC().ext.items;a.splice(a.indexOf(x.it),1);}else{var b=level().rooms[x.r].items;b.splice(b.indexOf(x.it),1);}}
  /* « Bureau » : la pièce (bureau = office) n’a pas la même traduction que le meuble (bureau = desk) */
  function trRoom(n){if(LANG!=="fr"&&!PSEUDO&&/^bureau$/i.test(String(n||""))){var x=tr("Bureau (pièce)");if(x!=="Bureau (pièce)")return x;}return trw(n);}
  function roomName(r){return trRoom(roomLabel(r));}
  function where(r){if(LANG!=="fr"||PSEUDO)return r==="exterieur"?tr("à l’extérieur"):tr("dans {0}",[String(roomName(r)).toLowerCase()]);return r==="exterieur"?"à l’extérieur":"dans "+(/^[aeiouyhé]/i.test(roomLabel(r))?"l’":(/^(chambre|cuisine|salle|entrée|piece)/i.test(roomLabel(r))?"la ":"le "))+roomLabel(r).toLowerCase();}
  function deRoom(r){if(LANG!=="fr"||PSEUDO)return tr("de {0}",[String(roomName(r)).toLowerCase()]);var L=String(roomLabel(r)||"").toLowerCase();return /^[aeiouyhé]/.test(L)?"de l’"+L:/^(chambre|cuisine|salle|piece|pièce)/.test(L)?"de la "+L:"du "+L;}
  function roomArea(r){var o=level().rooms[r];return o?o.w*o.l:0;}
  function wallArea(r){var o=level().rooms[r];return o?2*(o.w+o.l)*SC().wallH:0;}
  /* calcul de matériaux pour le bricoleur (estimations) */
  function materials(trav,S2){
    var t=hn(trav),L=[],c=Math.ceil;
    if(/carrel|faience/.test(t)){L.push(["Carreaux",fnum(Math.round(S2*1.1*10)/10),"m²","10 % de chutes compris"]);L.push(["Colle à carrelage",c(S2*5/25),"sac","sacs de 25 kg, 5 kg/m²"]);L.push(["Joint",c(S2*0.5/5),"sac","sacs de 5 kg"]);L.push(["Croisillons",c(S2/10),"paquet",""]);}
    else if(/peint/.test(t)){var lit=S2*2/10;L.push(["Peinture",c(lit/2.5),"pot","pots de 2,5 L, 2 couches, 10 m²/L"]);L.push(["Sous-couche",c(S2/10/2.5),"pot","pots de 2,5 L"]);L.push(["Rouleau",1,"u",""]);L.push(["Ruban de masquage",c(S2/25),"rouleau",""]);L.push(["Bâche",1,"u",""]);}
    else if(/parquet|stratifie/.test(t)){L.push(["Lames",fnum(Math.round(S2*1.07*10)/10),"m²","7 % de chutes compris"]);L.push(["Sous-couche",c(S2/15),"rouleau","rouleaux de 15 m²"]);}
    else if(/placo/.test(t)){L.push(["Plaques de plâtre",c(S2/3*1.05),"u","plaques de 2,5 × 1,2 m"]);L.push(["Vis",c(S2/10),"boite",""]);L.push(["Bande à joint",c(S2/15),"rouleau",""]);L.push(["Enduit à joint",c(S2/15),"sac","sacs de 5 kg"]);}
    else if(/papier peint|tapisserie/.test(t)){L.push(["Rouleaux de papier peint",c(S2/5*1.1),"rouleau","5 m² par rouleau"]);L.push(["Colle",c(S2/25),"paquet",""]);}
    else if(/lino|vinyle/.test(t)){L.push(["Revêtement",fnum(Math.round(S2*1.1*10)/10),"m²",""]);L.push(["Colle ou adhésif",c(S2/20),"pot",""]);}
    else if(/ragreage/.test(t)){L.push(["Ragréage",c(S2*1.5*3/25),"sac","3 mm, sacs de 25 kg"]);L.push(["Primaire d’accrochage",c(S2/20),"pot",""]);}
    else if(/enduit/.test(t)){L.push(["Enduit",c(S2/5),"sac","sacs de 5 kg"]);}
    else if(/chape|beton/.test(t)){L.push(["Béton ou chape (5 cm)",fnum(Math.round(S2*0.05*100)/100),"m³",""]);}
    return L;
  }
  function addCourse(nom,q,u,prix,note){var k=hn(nom),ex=S.courses.filter(function(x){return hn(x.nom)===k;})[0];
    if(ex){ex.quantite=q;ex.unite=u||ex.unite;if(prix!=null)ex.prix=prix;}else S.courses.push({id:id(),nom:cap(nom),quantite:q,unite:u||"u",prix:prix==null?null:prix,note:note||"",fait:false});}

  /* ---------- exécution : une commande -> effet dans le module + réponse courte ---------- */
  var X_={};
  function R(say,open){return {say:say,open:open||null};}
  /* devis */
  X_["devis.client"]=function(a){var k=ensureClient(a.nom||(getCur()&&getCur().client&&clientName(getCur().client)),a);if(!k)return R(tr("Il me faut le nom du client."));var d=curDevis(k);emit("devis","client",{id:d.id,client:k});var info=[a.tel,a.email,a.adresse].filter(Boolean);return R(info.length?tr("Fiche de {0} : {1}.",[clientName(k),info.join(", ")]):"");};
  X_["devis.lignes"]=function(a){
    var k=a.client?ensureClient(a.client):(getCur()&&getCur().client)||null;var d=curDevis(k),miss=[],added=[],changed=[],notFound=[];
    (a.lignes||[]).forEach(function(l){var lab=hn(l.libelle||"travaux"),q=+l.quantite||1,u=l.unite||"u",pu=l.prix!=null&&l.prix!==""?+l.prix:null;
      var sv=findService(lab);if(pu!=null&&!sv)sv=setService(String(l.libelle).replace(/\bmain d oeuvre\b/i,"main d’œuvre"),pu,u).s;else if(pu!=null&&sv&&sv.prix==null)sv.prix=pu;
      if(pu==null&&sv&&sv.prix!=null)pu=sv.prix;
      var label=cap(sv?sv.nom:String(l.libelle)).replace(/^Main d ?oeuvre$/i,"Main d’œuvre"),ex=d.lignes.filter(function(x){return hn(x.libelle)===hn(label)&&x.unite===u;})[0];
      if(a.op==="-"){if(!ex){notFound.push(label);return;}var q0=ex.quantite;ex.quantite=Math.max(0,Math.round((ex.quantite-q)*1000)/1000);changed.push(label+" : "+fnum(q0)+" "+u+" − "+fnum(q)+" "+u+" = "+fnum(ex.quantite)+" "+u);if(!ex.quantite)d.lignes.splice(d.lignes.indexOf(ex),1);return;}
      if(ex&&a.op==="+"){var q1=ex.quantite;ex.quantite=Math.round((ex.quantite+q)*1000)/1000;if(pu!=null)ex.prix=pu;changed.push(label+" : "+fnum(q1)+" "+u+" + "+fnum(q)+" "+u+" = "+fnum(ex.quantite)+" "+u);}
      else if(ex){ex.quantite=q;if(pu!=null)ex.prix=pu;}else d.lignes.push({libelle:label,quantite:q,unite:u,prix:pu});
      added.push(label+" "+fnum(q)+" "+u);if(pu==null&&!(ex&&ex.prix!=null))miss.push({libelle:label,unite:u});});
    emit("devis","lignes",{id:d.id,lignes:d.lignes.length});
    if(notFound.length&&!changed.length&&!added.length)return R(tr("Je ne trouve pas « {0} » dans le devis.",[notFound.join(", ")]));
    var say=tr("{0}Devis {1}à jour : {2} HT.",[(changed.length?changed.join(" ; ")+". ":""),(d.client?tr("de {0} ",[clientName(d.client)]):""),eur(totalHT(d))]);
    if(miss.length){S.pending={type:"prix",lignes:miss,devis:d.id};say+=tr(" Quel est ton prix pour « {0} » (en € par {1}) ?",[miss[0].libelle,miss[0].unite]);}
    return R(say);};
  X_["devis.afaire"]=function(a){var d=curDevis(null);(a.taches||[]).forEach(function(t){if(d.afaire.indexOf(t)<0)d.afaire.push(t);});return R(tr("Noté sur le devis : {0}.",[(a.taches||[]).join(", ")]));};
  X_["devis.fournisseur"]=function(a){var d=curDevis(null);if(d.fournisseurs.indexOf(a.nom)<0)d.fournisseurs.push(cap(a.nom));if(!S.fournisseurs.some(function(f){return hn(f.nom)===hn(a.nom);}))S.fournisseurs.push({id:id(),nom:cap(a.nom),specialite:null,tel:""});return R(tr("Fournisseur {0} lié au devis.",[cap(a.nom)]));};
  X_["devis.remarque"]=function(a){var d=curDevis(null);d.remarques.push(a.texte);return R(tr("Remarque ajoutée au devis."));};
  X_["devis.tva"]=function(a){var d=getCur(),t=+a.taux,warn=[20,10,5.5,2.1,0].indexOf(t)<0?tr(" Attention : les taux français sont 20 %, 10 %, 5,5 % et 2,1 %."):"";
    if(a.libelle){if(!d)return R(tr("Pas de devis en cours."));var h0=hn(a.libelle),L=d.lignes.filter(function(l){var x=hn(l.libelle);return x.indexOf(h0)>=0||h0.indexOf(x)>=0||sim(x,h0)>=0.75;});
      if(!L.length)return R(tr("Je ne trouve pas « {0} » dans le devis.",[a.libelle]));L.forEach(function(l){l.tva=t;});emit("devis","tva",{id:d.id,lignes:L.map(function(l){return l.libelle;}),taux:t});
      return R(tr("TVA à {0} % sur : {1}. Devis : {2} TTC.{3}",[fnum(t),L.map(function(l){return l.libelle.toLowerCase();}).join(", "),eur(totalTTC(d)),warn]));}
    S.tva=t;if(d&&d.statut==="brouillon")d.tva=t;
    if(d&&d.statut!=="brouillon"&&d.tva!=null&&d.tva!==t)return R(tr("TVA à {0} % pour tes prochains devis. Le devis {1}{2} est déjà {3} : il reste à {4} %.{5}",[fnum(t),d.num,(d.client?tr(" de {0}",[clientName(d.client)]):""),d.statut,fnum(d.tva),warn]));
    return R(tr("TVA à {0} %.{1}{2}",[fnum(t),(d?tr(" Devis : {0} TTC.",[eur(totalTTC(d))]):""),warn]));};
  X_["devis.supprimer_ligne"]=function(a){var d=getCur();if(!d)return R(tr("Pas de devis en cours."));var b=d.lignes.length;d.lignes=d.lignes.filter(function(l){return hn(l.libelle).indexOf(hn(a.libelle))<0&&sim(hn(l.libelle),hn(a.libelle))<0.75;});return R(b===d.lignes.length?tr("Je ne trouve pas « {0} » dans le devis.",[a.libelle]):tr("Ligne retirée. Total : {0} HT.",[eur(totalHT(d))]));};
  X_["devis.nouveau"]=function(a){var k=a.client?ensureClient(a.client):null;newDevis(k);return R(tr("Nouveau devis{0}.",[(k?tr(" pour {0}",[clientName(k)]):"")]),{screen:"devis"});};
  X_["devis.ouvrir"]=function(a){var k=a.client?clientKey(a.client):null;if(k){var d=S.devis.filter(function(x){return x.client===k;}).slice(-1)[0];if(d)S.cur=d.id;}var cur=getCur();return R(cur?"":tr("Aucun devis pour l’instant."),cur?{screen:"devis"}:null);};
  X_["devis.liste"]=function(a){return R(S.devis.length?"":tr("Aucun devis pour l’instant."),S.devis.length?{screen:"devis-liste",arg:a.filtre||null}:null);};
  X_["devis.envoyer"]=function(){var d=getCur();if(!d||!d.lignes.length)return R(tr("Il n’y a pas de devis à envoyer."));
    if(d.lignes.some(function(l){return l.prix==null;}))return R(tr("Il manque des prix sur ce devis : je ne l’envoie pas."),{screen:"devis"});
    if(!d.sig.artisan)return R(tr("Le devis doit d’abord porter ta signature."),{screen:"signature",arg:"artisan"});
    d.statut="envoyé";if(d.tva==null)d.tva=S.tva;emit("devis","envoyer",{id:d.id,client:d.client});return R(tr("Devis envoyé{0} pour signature.",[(d.client?tr(" à {0}",[clientName(d.client)]):"")]));};
  X_["devis.valider"]=function(a){var k=a.client?clientKey(a.client):S.last.client,d=lastSent(k)||getCur();if(!d||!d.lignes.length)return R(tr("Je ne trouve pas de devis à valider."));d.statut="validé";if(d.tva==null)d.tva=S.tva;d.valideLe=B.now().getTime();emit("devis","valider",{id:d.id});return R(tr("Devis de {0} validé : {1} TTC.",[clientName(d.client),eur(totalTTC(d))]));};
  X_["devis.refuser"]=function(a){var k=a.client?clientKey(a.client):S.last.client,d=lastSent(k)||getCur();if(!d)return R(tr("Je ne trouve pas ce devis."));d.statut="refusé";emit("devis","refuser",{id:d.id});return R(tr("Devis de {0} classé en non accepté.",[clientName(d.client)]));};
  X_["signature.ouvrir"]=function(a){var d=getCur();if(!d||!d.lignes.length)return R(tr("Il n’y a pas encore de devis à signer."));if(d.lignes.some(function(l){return l.prix==null;}))return R(tr("Il manque des prix : je ne fais pas signer ce devis."),{screen:"devis"});
    if(a.qui==="client"&&!d.sig.artisan)return R(tr("Signe d’abord le devis toi-même."),{screen:"signature",arg:"artisan"});return R("",{screen:"signature",arg:a.qui||"artisan"});};
  B.sign=function(qui,png){var d=getCur();if(!d)return null;B.snapshot();d.sig[qui]=png;if(qui==="artisan")S.maSignature=png;d.statut=qui==="client"?"validé":(d.statut==="brouillon"?"signé":d.statut);if(qui==="client")d.valideLe=B.now().getTime();emit("signature",qui,{id:d.id});
    log("signature "+qui,[C("signature","signer",{qui:qui})],"écran");return qui==="client"?tr("Devis signé par le client : il passe en validé."):tr("Devis signé.");};
  /* services */
  X_["services.definir"]=function(a){var r=setService(a.nom,+a.prix,a.unite);var d=getCur();if(d)d.lignes.forEach(function(l){if(l.prix==null&&findService(l.libelle)===r.s)l.prix=r.s.prix;});return R(tr("Prix {0} : {1} à {2} HT / {3}{4}.",[r.act,r.s.nom,eur(r.s.prix),r.s.unite,(a.ttc?tr(" ({0} TTC)",[eur(+a.ttc)]):"")]));};
  X_["services.ouvrir"]=function(){return R("",{screen:"services"});};
  /* planning */
  function createRdv(d,t,min,k,titre){
    var start=new Date(d.getFullYear(),d.getMonth(),d.getDate(),t.h,t.m).getTime(),end=start+min*60000,ab=absentAt(start,end);
    if(ab)return R(tr("Ce jour-là tu es indisponible ({0}) : je ne place rien.",[ab.motif]));
    var cf=overlaps(start,end);if(cf.length)return R(tr("Créneau déjà pris : {0}.",[fmtRdv(cf[0])]));
    var r={id:id(),start:start,min:min,titre:titre||"Rendez-vous",client:k||null};S.rdv.push(r);S.rdv.sort(function(a,b){return a.start-b.start;});emit("planning","ajouter",r);return R(tr("Noté : {0}.",[fmtRdv(r)]));}
  X_["planning.ajouter"]=function(a){var k=a.client?ensureClient(a.client):null,d=fromIso(a.date),t=a.heure?{h:+a.heure.slice(0,2),m:+a.heure.slice(3,5)}:null;
    if(!d){S.pending={type:"rdv",cmd:a};return R(tr("Pour quel jour ?"));}
    if(!t){S.pending={type:"rdv",cmd:a};return R(tr("À quelle heure ?"));}
    return createRdv(d,t,+a.duree_min||60,k,a.titre);};
  function findRdv(a){var k=a.client?clientKey(a.client):null,d=fromIso(a.date);
    var l=S.rdv.filter(function(r){return (!k||r.client===k)&&(!d||sod(new Date(r.start)).getTime()===d.getTime());});if(!k&&!d)l=S.rdv.filter(function(r){return r.start>=B.now().getTime();});return l[0]||null;}
  X_["planning.annuler"]=function(a){var r=findRdv(a);if(!r)return R(tr("Je ne trouve pas ce rendez-vous."));S.rdv=S.rdv.filter(function(x){return x!==r;});emit("planning","annuler",r);return R(tr("Annulé : {0}.",[fmtRdv(r)]));};
  X_["planning.deplacer"]=function(a){var r=findRdv({client:a.client});if(!r)return R(tr("Je ne trouve pas le rendez-vous à déplacer."));
    var old=new Date(r.start),nd=fromIso(a.date)||sod(old),nt=a.heure?{h:+a.heure.slice(0,2),m:+a.heure.slice(3,5)}:{h:old.getHours(),m:old.getMinutes()};
    var start=new Date(nd.getFullYear(),nd.getMonth(),nd.getDate(),nt.h,nt.m).getTime();if(overlaps(start,start+r.min*60000,r.id).length)return R(tr("Le nouveau créneau est déjà pris."));
    r.start=start;S.rdv.sort(function(x,y){return x.start-y.start;});emit("planning","deplacer",r);return R(tr("Déplacé : {0}.",[fmtRdv(r)]));};
  X_["planning.libre"]=function(a){var now=B.now(),d=fromIso(a.date)||sod(now),min=+a.duree_min||60,found=[];
    for(var i=0;i<14&&found.length<3;i++){var day=addDays(d,i);if(day.getDay()===0)continue;
      var H0=S.horaires&&S.horaires.debut?(+S.horaires.debut.slice(0,2))*60+(+S.horaires.debut.slice(3,5)):480,H1=S.horaires&&S.horaires.fin?(+S.horaires.fin.slice(0,2))*60+(+S.horaires.fin.slice(3,5)):1080;
      for(var h=H0;h+min<=H1&&found.length<3;h+=30){var s=new Date(day.getFullYear(),day.getMonth(),day.getDate(),0,h).getTime();if(s<now.getTime())continue;if(!overlaps(s,s+min*60000).length&&!absentAt(s,s+min*60000)){found.push(s);h+=min-30;}}}
    if(!found.length)return R(tr("Pas de créneau libre dans les deux semaines."));
    return R(tr("Libre : {0}.",[found.map(function(s){var x=new Date(s);return tr("{0} à {1}",[fdate(x),ftime(x.getHours(),x.getMinutes())]);}).join(" ; ")]));};
  X_["planning.absence"]=function(a){var f=fromIso(a.du),t=fromIso(a.au)||f;if(!f)return R(tr("Quels jours ?"));S.absences.push({id:id(),from:f.getTime(),to:addDays(t,1).getTime(),motif:a.motif||"indisponible"});emit("planning","absence",a);
    return R(tr("Indisponible {0} ({1}).",[(a.au&&a.au!==a.du?tr("du {0} au {1}",[fdate(f),fdate(t)]):tr("le {0}",[fdate(f)])),(a.motif||tr("indisponible"))]));};
  X_["planning.ouvrir"]=function(a){return R("",{screen:"planning",arg:a.date||null});};
  /* factures */
  X_["factures.paiement"]=function(a){if(!a.client||a.montant==null)return R(tr("Qui a payé, et combien ?"));var k=ensureClient(a.client);
    if(a.montant==="reste"){var dd=devisOf(k);if(!dd)return R(tr("Je ne trouve pas de devis pour {0} : dis-moi le montant payé.",[clientName(k)]));a=Object.assign({},a,{montant:Math.round((totalTTC(dd)-paid(k))*100)/100});if(a.montant<=0)return R(tr("{0} a déjà tout payé.",[clientName(k)]));}
    S.paiements.push({id:id(),client:k,montant:+a.montant,mode:a.mode||"non précisé",date:B.now().getTime()});emit("factures","paiement",a);
    var d=devisOf(k),tot=d&&totalTTC(d)>0?totalTTC(d):null;return R(tr("Paiement de {0}{1} enregistré pour {2}.{3}",[eur(+a.montant),(a.mode?" ("+trw(a.mode)+")":""),clientName(k),(tot!=null?tr(" Reste {0} sur {1} TTC.{2}",[eur(Math.max(0,tot-paid(k))),eur(tot),(paid(k)-tot>0.009?tr(" Attention : c’est {0} de plus que le devis.",[eur(paid(k)-tot)]):"")]):"")]));};
  X_["factures.creer"]=function(a){var k=a.client?clientKey(a.client):S.last.client;if(!k)return R(tr("Pour quel client ?"));var d=devisOf(k);if(!d)return R(tr("Je ne trouve pas de devis pour {0}.",[clientName(k)]));
    var tot=totalTTC(d),pd=paid(k);
    if(a.type==="acompte"){var amt=a.montant!=null?+a.montant:(a.pourcentage?tot*a.pourcentage/100:null);if(amt==null){S.pending={type:"acompte",client:k,total:tot};return R(tr("Acompte de combien ? (montant ou pourcentage, devis de {0} TTC)",[eur(tot)]));}
      var f={id:id(),num:numFacture(),client:k,type:"acompte",montant:amt,devis:d.id,payee:pd>=amt};S.factures.push(f);emit("factures","creer",f);return R(tr("Facture d’acompte {0} de {1} préparée pour {2}. Le PDF sera disponible après le paiement.",[f.num,eur(amt),clientName(k)]));}
    var reste=tot-pd;if(reste>0.009)return R(tr("Il reste {0} à payer sur {1} : la facture finale ne sort qu’après le paiement complet.",[eur(reste),eur(tot)]));
    var ff={id:id(),num:numFacture(),client:k,type:"finale",montant:tot,devis:d.id,payee:true};S.factures.push(ff);emit("factures","pdf",ff);return R(tr("Facture finale {0} de {1} prête pour {2}.",[ff.num,eur(tot),clientName(k)]),{screen:"factures",arg:clientName(k)});};
  function numFacture(){var y=B.now().getFullYear(),n=S.factures.filter(function(f){return f.num&&f.num.indexOf("F-"+y+"-")===0;}).length+1;return "F-"+y+"-"+("000"+n).slice(-4);}
  X_["factures.ouvrir"]=function(a){return R("",{screen:"factures",arg:a.client||null});};
  /* clients et fournisseurs */
  X_["clients.maj"]=function(a){var k=ensureClient(a.nom,a);if(!k)return R(tr("Quel client ?"));var c=S.clients[k];return R(tr("Fiche de {0} à jour{1}.",[c.nom,([a.tel,a.email,a.adresse].filter(Boolean).length?" : "+[a.tel,a.email,a.adresse].filter(Boolean).join(", "):"")]));};
  X_["clients.ouvrir"]=function(a){if(a.nom){var k=clientKey(a.nom);if(!S.clients[k])return R(tr("Je ne connais pas de client {0}.",[cap(a.nom)]));return R("",{screen:"client",arg:k});}return R(Object.keys(S.clients).length?"":tr("Aucun client pour l’instant : ils se créent seuls avec un devis ou un rendez-vous."),Object.keys(S.clients).length?{screen:"clients"}:null);};
  X_["fournisseurs.ajouter"]=function(a){var f=S.fournisseurs.filter(function(x){return hn(x.nom)===hn(a.nom);})[0];if(!f){f={id:id(),nom:cap(a.nom),specialite:a.specialite||null,tel:a.tel||""};S.fournisseurs.push(f);}else{if(a.specialite)f.specialite=a.specialite;if(a.tel)f.tel=a.tel;}
    emit("fournisseurs","ajouter",f);return R(tr("Fournisseur enregistré : {0}{1}.",[f.nom,(f.specialite?tr(" pour {0}",[f.specialite]):"")]));};
  X_["fournisseurs.ouvrir"]=function(){return R("",{screen:"fournisseurs"});};
  X_["fournisseurs.commande"]=function(a){X_["fournisseurs.ajouter"]({nom:a.nom});var o={id:id(),fournisseur:cap(a.nom),articles:a.articles||[],date:B.now().getTime(),statut:"à passer"};S.commandes.push(o);emit("fournisseurs","commande",o);
    return R(tr("Commande notée chez {0} : {1}.",[o.fournisseur,o.articles.map(function(x){return qty(x.quantite,x.unite,x.nom);}).join(", ")]));};
  /* pointage, métré */
  X_["pointage.entree"]=function(a){var open=S.pointages.filter(function(p){return !p.fin;})[0];if(open)return R(tr("Tu es déjà pointé depuis {0}.",[ftime(new Date(open.debut).getHours(),new Date(open.debut).getMinutes())]));
    var k=a.client?clientKey(a.client):null;S.pointages.push({id:id(),client:k,debut:B.now().getTime(),fin:null});emit("pointage","entree",{client:k});var t=B.now();return R(tr("Arrivée pointée à {0}{1}.",[ftime(t.getHours(),t.getMinutes()),(k?tr(" chez {0}",[clientName(k)]):"")]));};
  X_["pointage.sortie"]=function(){var open=S.pointages.filter(function(p){return !p.fin;})[0];if(!open)return R(tr("Tu n’es pas pointé."));open.fin=B.now().getTime();emit("pointage","sortie",open);return R(tr("Sortie pointée. Durée : {0} h.",[fnum((open.fin-open.debut)/3600000)]));};
  X_["pointage.ouvrir"]=function(){return R("",{screen:"pointage"});};
  X_["metre.calculer"]=function(a){var L=+a.longueur,l=+a.largeur,h=+a.hauteur||SC().wallH,aire=L*l,per=2*(L+l);S.metres.push({id:id(),L:L,l:l,h:h,piece:a.piece||null});
    if(a.piece&&a.piece!=="exterieur"){var o=room(a.piece);o.w=L;o.l=l;}
    S.last.surface=aire;S.last.murs=per*h;emit("metre","calculer",{L:L,l:l,h:h});
    return R(tr("{0}{1} m², plinthes {2} ml, murs {3} m² (hauteur {4} m).",[(a.piece?tr("{0} : sol ",[roomLabel(a.piece)]):tr("Sol ")),fnum(aire),fnum(per),fnum(per*h),fnum(h)]));};
  /* courses (bricoleur) */
  X_["courses.ajouter"]=function(a){(a.articles||[]).forEach(function(x){addCourse(x.nom,+x.quantite||1,x.unite,x.prix);});emit("courses","ajouter",a);return R(tr("Ajouté à ta liste : {0}.",[(a.articles||[]).map(function(x){return qty(+x.quantite||1,x.unite,x.nom);}).join(", ")]));};
  X_["courses.prix"]=function(a){var k=hn(a.nom),ex=S.courses.filter(function(x){return hn(x.nom).indexOf(k)>=0||k.indexOf(hn(x.nom))>=0;})[0];if(ex){ex.prix=+a.prix;}else addCourse(a.nom,1,a.unite,+a.prix);return R(tr("Prix noté : {0} à {1}{2}. Budget : {3}.",[cap(a.nom),eur(+a.prix),(a.unite?" / "+trw(a.unite):""),eur(budget())]));};
  function budget(){return S.courses.reduce(function(s,x){return s+(x.prix!=null?x.prix*x.quantite:0);},0);}
  X_["courses.calcul"]=function(a){var L=materials(a.travail,+a.surface);if(!L.length)return R(tr("Je ne sais pas encore calculer les matériaux pour « {0} ».",[a.travail]));L.forEach(function(x){addCourse(x[0],+String(x[1]).replace(",",".").replace(/ /g,""),x[2],null,x[3]);});
    return R(tr("Pour {0} m² de {1} : {2}. C’est dans ta liste (estimation).",[fnum(+a.surface),a.travail,L.map(function(x){return qty(+String(x[1]).replace(",",".").replace(/\u202f/g,""),x[2],x[0]);}).join(", ")]));};
  X_["courses.ouvrir"]=function(){return R(S.courses.length?"":tr("Ta liste est vide."),S.courses.length?{screen:"courses"}:null);};
  X_["projet.demande"]=function(){return R("",{screen:"demande"});};
  /* mémoire */
  X_["memoire.retenir"]=function(a){var r=E.addFact(a.fait);return R(r.action==="noop"?tr("Je le savais déjà."):r.action==="update"?tr("Mis à jour."):tr("C’est retenu."));};
  X_["memoire.oublier"]=function(a){var f=E.forgetFact(a.texte);if(f)return R(tr("Oublié : {0}",[f.text]));var u=unlearn({texte:a.texte});return R(/^Oublié/.test(u)?u:tr("Je n’ai rien trouvé qui ressemble à « {0} ».",[a.texte]));};
  X_["memoire.desapprendre"]=function(a){return R(unlearn(a));};
  X_["memoire.ouvrir"]=function(){return R("",{screen:"memoire"});};
  X_["mot.apprendre"]=function(a){return R(learnWord(a.mot,a.sens));};
  /* système */
  X_["sys.aide"]=function(){return R(S.mode==="artisan"?tr("Parle-moi normalement : « devis pour Dupont, carrelage 14 m² », « rdv demain 14h chez Dupont », « Dupont a payé 500 € », « fais signer le client », « ajoute un canapé dans le séjour », « mes fournisseurs ». Dis « non » si je me trompe : je corrige et je retiens."):tr("Parle-moi normalement : « ajoute un canapé dans le séjour », « peins la chambre en vert sauge », « il me faut quoi pour carreler 12 m² », « ma liste de courses ». Dis « non » si je me trompe : je corrige et je retiens."));};
  X_["sys.politesse"]=function(a){return R(a.type==="merci"?(/^(ok|okay|d accord|daccord|ca marche)$/.test(a.mot||"")?tr("D’accord."):tr("Avec plaisir.")):tr("Bonjour. Je t’écoute."));};
  X_["sys.mode"]=function(a){S.mode=a.mode;return R(a.mode==="bricoleur"?tr("Mode Bricoleur du dimanche : maquette 3D, métré, liste de courses et budget, planning de tes travaux."):tr("Mode Artisan : devis, planning, clients, fournisseurs, signature, factures, pointage et maquette 3D."));};
  X_["sys.fermer"]=function(){return R("",{close:true});};
  X_["sys.ia"]=function(a){if(!a.on){S.iaLLM="non";return R(tr("Modèle de langage désactivé : je continue avec ma mémoire et mon modèle de sens."));}
    if(!B.ia||!B.ia.llmCapable())return R(tr("Ce téléphone ne peut pas faire tourner le modèle de langage (il faut WebGPU et assez de mémoire). Je continue avec ma mémoire et mon modèle de sens."));
    S.iaLLM="oui";return {say:tr("Je télécharge mon modèle de langage."),ui:"iadl"};};
  X_["sys.question"]=function(a){S.pending={type:"complete",pour:a.pour||null,base:a.base||""};return R(a.texte);};
  X_["sys.annuler"]=function(a){return {say:"",ui:"annuler",n:a&&a.n||1};};
  ["sys.refaire","sys.mesure","sys.entraine","sys.sauvegarde","sys.reinit"].forEach(function(k){X_[k]=function(){return {say:"",ui:k.split(".")[1]};};});

  /* ---------- exécution 3D ---------- */
  X_["scene.ajouter"]=function(a){var parts=[];(a.items||[]).forEach(function(x){var t=resolveType(x.type);if(!t)return;var r=pickRoom(t,resolveRoom(x.piece)),n=Math.max(1,Math.min(20,+x.nombre||1));
      for(var i=0;i<n;i++)addItem(t,r,{couleur:x.couleur,position:x.position});S.last.room=r==="exterieur"?S.last.room:r;S.last.type=t;parts.push(tname(t,n)+(x.couleur?" "+trw(x.couleur):"")+" "+where(r));});
    if(!parts.length)return R(tr("Je ne connais pas cet équipement. Dis-moi à quoi il ressemble (« retiens : mot = canapé »)."));emit("3d","ajouter",a);return R(tr("Ajouté : {0}.",[parts.join(", ")]));};
  X_["scene.enlever"]=function(a){var t=resolveType(a.type),L=itemsOf(t,resolveRoom(a.piece));if(!L.length)return R(tr("Je ne trouve pas {0} dans la maquette.",[(t?art(t):tr("cet élément"))]));
    if(a.tous)L.forEach(removeIt);else{var pref=L.filter(function(x){return x.r===S.last.room;});removeIt((pref.length?pref:L)[ (pref.length?pref:L).length-1]);}
    S.last.type=t;emit("3d","enlever",a);return R(a.tous&&L.length>1?tr("Enlevé : {0}.",[tname(t,L.length)]):tr("Enlevé : {0}.",[tname(t,1)]));};
  X_["scene.remplacer"]=function(a){var de=resolveType(a.de),par=resolveType(a.par),L=itemsOf(de,resolveRoom(a.piece));if(!L.length||!par)return R(tr("Je ne trouve pas {0}.",[(de?art(de):tr("cet élément"))]));L[0].it.type=par;S.last.type=par;emit("3d","remplacer",a);return R(tr("Remplacé : {0} → {1}.",[tname(de,1),tname(par,1)]));};
  X_["scene.couleur"]=function(a){var t=resolveType(a.type),L=itemsOf(t,resolveRoom(a.piece));if(!L.length){if(!t)return R(tr("Je ne trouve pas cet élément."));return X_["scene.ajouter"]({items:[{type:t,nombre:1,piece:a.piece,couleur:a.couleur}]});}var hex=colorHex(a.couleur);L.forEach(function(x){x.it.couleur=a.couleur;x.it.hex=hex;});S.last.type=t;emit("3d","couleur",a);return R(cap(tname(t,1))+" : "+trw(a.couleur)+".");};
  X_["scene.tourner"]=function(a){var t=resolveType(a.type),L=itemsOf(t);if(!L.length)return R(tr("Je ne trouve pas {0}.",[(t?art(t):tr("cet élément"))]));var it=L[L.length-1].it;it.rot=((it.rot||0)+(+a.angle||90))%360;S.last.type=t;emit("3d","tourner",a);return R(tr("{0} : rotation de {1}°.",[cap(tname(t,1)),(+a.angle||90)]));};
  X_["scene.taille"]=function(a){var t=resolveType(a.type),L=itemsOf(t);if(!L.length)return R(tr("Je ne trouve pas {0}.",[(t?art(t):tr("cet élément"))]));var it=L[L.length-1].it,d=TYPES[t].d;
    if(a.longueur){it.scale=Math.max(0.3,Math.min(4,+a.longueur/d[0]));}else it.scale=Math.round(((it.scale||1)*(a.sens==="moins"?0.8:1.2))*100)/100;S.last.type=t;emit("3d","taille",a);
    return R(cap(tname(t,1))+(a.longueur?tr(" : {0} m de long.",[fnum(+a.longueur)]):a.sens==="moins"?tr(" : 20 % plus petit."):tr(" : 20 % plus grand.")));};
  function posLabel(p){if(LANG==="fr"&&!PSEUDO)return p;var m=String(p).match(/^(en face du|à côté du) (.+)$/);
    if(m){var t=Object.keys(TYPES).filter(function(k){return TYPES[k].fr.toLowerCase()===m[2];})[0];return tr(m[1]==="en face du"?"en face de {0}":"à côté de {0}",[t?String(nom3d(t)).toLowerCase():m[2]]);}return trw(p);}
  X_["scene.deplacer"]=function(a){var t=resolveType(a.type),L=itemsOf(t);if(!L.length)return R(tr("Je ne trouve pas {0}.",[(t?art(t):tr("cet élément"))]));var x=L[L.length-1];
    if(a.piece&&resolveRoom(a.piece)!==x.r){var to=resolveRoom(a.piece);removeIt(x);(to==="exterieur"?SC().ext.items:room(to).items).push(x.it);S.last.room=to;}if(a.position)x.it.pos=a.position;S.last.type=t;emit("3d","deplacer",a);
    return R(cap(tname(t,1))+" :"+(a.position?" "+(LANG!=="fr"||PSEUDO?posLabel(a.position):a.position.replace(/^a /,"à ").replace("pres","près").replace("fenetre","fenêtre")):" "+where(resolveRoom(a.piece)))+".");};
  X_["scene.peindre"]=function(a){var rs=roomsOf(resolveRoom(a.piece)||S.last.room||"sejour");if(a.piece!=="partout"&&a.piece!=="maison")rs.forEach(room);var hex=colorHex(a.couleur)||(a.matiere?matColor(a.matiere):null);if(!hex)return R(tr("Quelle couleur ?"));
    rs.forEach(function(r){var o=room(r);if(a.cible==="plafond")o.plafond=hex;else{o.murs=hex;o.mursNom=a.couleur||a.matiere;}});if(rs[0])S.last.room=rs[0];emit("3d","peindre",a);
    return R(tr("{0} {1} en {2}.",[(a.cible==="plafond"?tr("Plafond"):tr("Murs")),(a.piece==="partout"||a.piece==="maison"||rs.length>1?tr("de toutes les pièces"):deRoom(rs[0])),(a.couleur||a.matiere)]));};
  X_["scene.sol"]=function(a){var rs=roomsOf(resolveRoom(a.piece)||S.last.room||"sejour");if(a.piece!=="partout"&&a.piece!=="maison")rs.forEach(room);var hex=colorHex(a.couleur)||matColor(a.matiere||"");
    rs.forEach(function(r){var o=room(r);o.sol=hex;o.solNom=[a.matiere,a.couleur].filter(Boolean).map(trw).join(" ");});if(rs[0])S.last.room=rs[0];emit("3d","sol",a);
    return R(tr("Sol {0} : {1}.",[(rs.length>1?tr("de toutes les pièces"):deRoom(rs[0])),[a.matiere,a.couleur].filter(Boolean).map(trw).join(" ")]));};
  X_["scene.facade"]=function(a){SC().facade={hex:colorHex(a.couleur)||matColor(a.matiere||""),nom:[a.matiere,a.couleur].filter(Boolean).map(trw).join(" ")};emit("3d","facade",a);return R(tr("Façade : {0}.",[SC().facade.nom]));};
  X_["scene.style"]=function(a){var th=(M.themes||{})[a.theme];if(!th)return R(tr("Je ne connais pas ce style."));var rs=roomsOf(resolveRoom(a.piece));if(!rs.length){rs=["sejour"];room("sejour");}
    rs.forEach(function(r){var o=room(r);o.theme=a.theme;o.murs=th.w;o.mursNom=a.theme;if(th.furn)o.items.forEach(function(it){if(!it.couleur)it.hex=th.fab||th.furn;});});SC().style=a.theme;emit("3d","style",a);
    return R(tr("Style {0} appliqué {1}.",[a.theme,(rs.length>1?tr("à toute la maison"):tr("à {0}",[roomLabel(rs[0]).toLowerCase()]))]));};
  function furnish(r){var pre=(M.preset||{})[r]||[];var o=room(r);pre.forEach(function(t){if(!o.items.some(function(i){return i.type===t;})||pre.filter(function(x){return x===t;}).length>o.items.filter(function(i){return i.type===t;}).length)addItem(t,r,{});});return pre.length;}
  X_["scene.meubler"]=function(a){var p=resolveRoom(a.piece);var rs=p&&p!=="maison"&&p!=="partout"?[p]:Object.keys(level().rooms);
    if(!rs.length)rs=["sejour","cuisine","chambre","salle de bain","wc"];rs.forEach(furnish);emit("3d","meubler",a);return R(rs.length>1?tr("Toute la maison est meublée ({0}).",[rs.map(roomName).join(", ").toLowerCase()]):tr(/^(chambre|cuisine|salle|entrée)/i.test(roomLabel(rs[0]))?"{0} meublée.":"{0} meublé.",[roomName(rs[0])]));};
  X_["scene.vider"]=function(a){var p=resolveRoom(a.piece);var rs=p&&p!=="maison"&&p!=="partout"?[p]:Object.keys(level().rooms);var n=0;rs.forEach(function(r){var o=level().rooms[r];if(o){n+=o.items.length;o.items=[];}});if(!p||p==="maison"){n+=SC().ext.items.length;SC().ext.items=[];}emit("3d","vider",a);
    return R(n?(rs.length>1?tr("Maquette vidée ({0} éléments enlevés).",[n]):tr(/^(chambre|cuisine|salle|entrée)/i.test(roomLabel(rs[0]))?"{0} vidée.":"{0} vidé.",[roomName(rs[0])])):tr("Il n’y avait rien à enlever."));};
  X_["scene.info"]=function(a){var lv=level();
    if(a.quoi==="nombre"){var t=resolveType(a.type),n=0,lvls=SC().levels;lvls.forEach(function(L){Object.keys(L.rooms).forEach(function(r){n+=L.rooms[r].items.filter(function(i){return i.type===t;}).length;});});n+=SC().ext.items.filter(function(i){return i.type===t;}).length;return R(n?tr("Il y a {0}.",[tname(t,n)]):tr(/^(la |l’)/.test(art(t))&&!/^l’/.test(art(t))?"Aucune {0} pour l’instant.":"Aucun {0} pour l’instant.",[tname(t,1)]));}
    if(a.quoi==="surface"){var p=resolveRoom(a.piece);if(p&&lv.rooms[p])return R(roomName(p)+" : "+fnum(roomArea(p))+" m² ("+fnum(lv.rooms[p].w)+" × "+fnum(lv.rooms[p].l)+" m).");
      var tot=0;SC().levels.forEach(function(L){Object.keys(L.rooms).forEach(function(r){tot+=L.rooms[r].w*L.rooms[r].l;});});return R(tot?tr("Surface totale : {0} m²{1}.",[fnum(tot),(SC().levels.length>1?tr(" sur {0} niveaux",[SC().levels.length]):"")]):tr("La maquette n’a pas encore de pièce."));}
    if(a.quoi==="prix"){var lines=[],miss=[],sum=0;Object.keys(lv.rooms).forEach(function(r){var o=lv.rooms[r];
        if(o.solNom){var s=findService(o.solNom.split(" ")[0]);if(s&&s.prix!=null){sum+=s.prix*roomArea(r);}else miss.push(o.solNom.split(" ")[0]);}
        if(o.murs){var s2=findService("peinture");if(s2&&s2.prix!=null)sum+=s2.prix*wallArea(r);else miss.push("peinture");}});
      if(S.mode!=="artisan"){var b=budget();return R(b?tr("Budget de ta liste : {0}.",[eur(b)]):tr("Aucun prix dans ta liste."));}
      miss=miss.filter(function(x,i){return miss.indexOf(x)===i;});
      if(!sum&&!miss.length)return R(tr("Rien à chiffrer : choisis d’abord des sols ou des peintures."));
      return R((sum?tr("Estimation des travaux : {0} HT.",[eur(sum)]):"")+(miss.length?tr(" Il me manque ton prix pour : {0}.",[miss.join(", "),miss[0]]):""));}
    return R("");};
  X_["scene.reglage"]=function(a){if(a.hauteur)SC().wallH=+a.hauteur;if(a.epaisseur)SC().wallT=+a.epaisseur;emit("3d","reglage",a);return R(a.hauteur?tr("Hauteur sous plafond : {0} m.",[fnum(+a.hauteur)]):tr("Épaisseur des murs : {0} cm.",[fnum(+a.epaisseur*100)]));};
  X_["scene.terrain"]=function(a){var w=+a.largeur,l=+a.longueur;if(!w&&a.surface){w=Math.round(Math.sqrt(+a.surface/1.5)*10)/10;l=Math.round(+a.surface/w*10)/10;}SC().terrain={w:w,l:l};SC().ext.jardin=true;emit("3d","terrain",SC().terrain);return R(tr("Terrain de {0} × {1} m ({2} m²).",[fnum(w),fnum(l),fnum(w*l)]));};
  X_["scene.renommer"]=function(a){var r=resolveRoom(a.piece);if(!r||r==="maison"||r==="partout")return R(tr("Quelle pièce ?"));var o=room(r);o.name=cap(a.nom);return R(tr("{0} s’appelle maintenant « {1} ».",[roomLabel(r),o.name]));};
  X_["scene.etage"]=function(a){var s=SC(),act=a.action;
    if(act==="ajouter"){s.levels.push({rooms:{}});return R(tr("Étage {0} ajouté.",[(s.levels.length-1)]));}
    if(act==="monter"){if(s.lv>=s.levels.length-1)return R(tr("Il n’y a pas d’étage au-dessus."));s.lv++;return R(tr("Tu es à l’étage {0}.",[s.lv]));}
    if(act==="descendre"){if(s.lv===0)return R(tr("Tu es déjà au rez-de-chaussée."));s.lv--;return R(s.lv?tr("Tu es à l’étage {0}.",[s.lv]):tr("Tu es au rez-de-chaussée."));}
    if(act==="aller"){var k=+a.niveau||0;if(k>=s.levels.length)return R(tr("Il n’y a pas d’étage {0}.",[k]));s.lv=k;return R(k?tr("Tu es à l’étage {0}.",[k]):tr("Tu es au rez-de-chaussée."));}
    if(act==="enlever"){if(s.levels.length<2)return R(tr("Il n’y a pas d’étage à enlever."));s.levels.pop();s.lv=Math.min(s.lv,s.levels.length-1);return R(tr("Dernier étage enlevé."));}
    if(act==="plainpied"){s.levels=[s.levels[0]];s.lv=0;return R(tr("Maison de plain-pied."));}
    return R("");};
  X_["scene.toit"]=function(a){if(a.enlever){SC().roof=null;return R(tr("Toit enlevé."));}SC().roof={forme:a.forme||"2 pans",matiere:a.matiere||"tuiles",hex:colorHex(a.matiere)||matColor(a.matiere||"tuile")};emit("3d","toit",SC().roof);return R(tr("Toit {0} en {1}.",[SC().roof.forme,SC().roof.matiere]));};
  X_["scene.exterieur"]=function(a){var e=SC().ext,lab={jardin:"jardin",route:"route",allee:"allée",haie:"haie",cloture:"clôture"};
    (a.ajouter||[]).forEach(function(k){e[k]=k==="cloture"?(a.matiere||"bois"):true;});(a.enlever||[]).forEach(function(k){e[k]=k==="cloture"?null:false;});
    if((a.ajouter||[]).length&&!SC().terrain)SC().terrain={w:20,l:30};emit("3d","exterieur",a);
    return R((a.ajouter||[]).length?tr("Ajouté : {0}.",[a.ajouter.map(function(k){return trw(lab[k])+(k==="cloture"&&a.matiere?tr(" en {0}",[a.matiere]):"");}).join(", ")]):tr("Enlevé : {0}.",[(a.enlever||[]).map(function(k){return lab[k];}).join(", ")]));};
  X_["scene.vue"]=function(a){SC().view=a.vue||"ensemble";if(a.piece)S.last.room=resolveRoom(a.piece);return R("",{screen:"scene"});};
  X_["scene.ambiance"]=function(a){SC().night=!!a.nuit;return R(a.nuit?tr("Mode nuit."):tr("Mode jour."));};
  X_["scene.murs"]=function(a){SC().low=!!a.bas;return R(a.bas?tr("Murs bas : on voit l’intérieur."):tr("Murs hauts."));};
  X_["scene.reinit"]=function(){S.scene=newScene();S.last.room=null;S.last.type=null;return R(tr("Maquette remise comme au début."));};
  X_["scene.ouvrir"]=function(){return R("",{screen:"scene"});};
  var SITUACT={bright:[["peindre",{cible:"murs",couleur:"blanc"}],["ajouter",{items:[{type:"light",nombre:2}]}]],dim:[["ambiance",{nuit:true}]],empty:[["meubler",{}]],
    clutter:[["alleger",{}]],baby:[["ajouter",{items:[{type:"crib",nombre:1,piece:"chambre"}]}]],kid:[["ajouter",{items:[{type:"bed1",nombre:1,piece:"chambre"},{type:"desk",nombre:1,piece:"chambre"}]}]],
    work:[["ajouter",{items:[{type:"desk",nombre:1},{type:"chair",nombre:1},{type:"lamp2",nombre:1}]}]],guests:[["ajouter",{items:[{type:"table",nombre:1,piece:"sejour"},{type:"sofa",nombre:1,piece:"sejour"}]}]],
    cold:[["ajouter",{items:[{type:"rad",nombre:1}]}]],hot:[["ajouter",{items:[{type:"clim",nombre:1}]}]],cook:[["ajouter",{items:[{type:"island",nombre:1,piece:"cuisine"}]}]],storage:[["ajouter",{items:[{type:"ward",nombre:1},{type:"shelf",nombre:1}]}]],price:[["info",{quoi:"prix"}]]};
  X_["scene.alleger"]=function(a){var r=resolveRoom(a.piece)||S.last.room||"sejour",o=level().rooms[r];if(!o||o.items.length<2)return R(tr("La pièce n’est pas chargée."));var k=Math.ceil(o.items.length/3);o.items.splice(o.items.length-k,k);return R(tr("{0} allégé : {1} élément{2} en moins.",[roomLabel(r),k,(k>1?"s":"")]));};
  X_["scene.situation"]=function(a){var acts=SITUACT[a.code]||[];var out=[];acts.forEach(function(x){var args=clone(x[1]);if(a.piece){if(args.items)args.items.forEach(function(i){if(!i.piece)i.piece=a.piece;});else args.piece=a.piece;}var r=X_["scene."+x[0]](args);if(r.say)out.push(r.say);});return R(out.join(" "));};

  /* ---------- phrase précise de ce qui est compris ---------- */
  function D(c){var a=c.args||{},k=c.m+"."+c.a;
    function cl(x){return x?tr(" de {0}",[cap(x)]):"";}
    switch(k){
      case "devis.client":return tr("Client du devis : {0}",[[a.nom,a.tel,a.email,a.adresse].filter(Boolean).join(", ")]);
      case "devis.lignes":return (a.op==="-"?tr("Retirer du devis"):tr("Ajouter au devis"))+cl(a.client)+" : "+(a.lignes||[]).map(function(l){return String(l.libelle).replace(/\bmain d oeuvre\b/i,"main d’œuvre")+" "+fnum(+l.quantite||1)+" "+trw(l.unite||"")+(l.prix!=null?tr(" à {0}",[eur(+l.prix)]):"");}).join(", ");
      case "devis.afaire":return tr("Noter sur le devis : {0}",[(a.taches||[]).join(", ")]);case "devis.fournisseur":return tr("Lier le fournisseur {0} au devis",[a.nom]);case "devis.remarque":return tr("Remarque sur le devis");
      case "devis.tva":return tr("Mettre la TVA à {0} %",[fnum(+a.taux)]);case "devis.supprimer_ligne":return tr("Retirer « {0} » du devis",[a.libelle]);case "devis.nouveau":return tr("Commencer un nouveau devis{0}",[(a.client?tr(" pour {0}",[a.client]):"")]);
      case "devis.preparer":return tr("Préparer le devis{0}",[cl(a.client)]);case "devis.modele":return tr("Enregistrer le devis comme modèle");case "devis.ouvrir":return tr("Ouvrir le devis{0}",[cl(a.client)]);case "devis.liste":return tr("Ouvrir la liste des devis");case "devis.envoyer":return tr("Envoyer le devis au client");case "devis.valider":return tr("Le client a accepté le devis{0}",[cl(a.client)]);case "devis.refuser":return tr("Le client a refusé le devis{0}",[cl(a.client)]);
      case "signature.ouvrir":return a.qui==="client"?tr("Faire signer le devis par le client"):tr("Signer le devis");case "signature.signer":return tr("Signature");
      case "services.definir":return tr("Prix de « {0} » : {1}{2}",[a.nom,eur(+a.prix),(a.unite?" / "+trw(a.unite):"")]);case "services.ouvrir":return tr("Ouvrir mes services et prix");
      case "planning.ajouter":var d=fromIso(a.date);return tr("Rendez-vous{0}{1}{2}{3}",[(d?" "+fdate(d):""),(a.heure?tr(" à {0}",[ftime(+a.heure.slice(0,2),+a.heure.slice(3,5))]):""),(a.client?tr(" chez {0}",[cap(a.client)]):""),(a.titre&&a.titre!=="Rendez-vous"?" ("+a.titre.toLowerCase()+")":"")]);
      case "planning.annuler":return tr("Annuler le rendez-vous{0}{1}",[(a.client?tr(" de {0}",[cap(a.client)]):""),(a.date?tr(" du {0}",[fdate(fromIso(a.date))]):"")]);case "planning.deplacer":return tr("Déplacer le rendez-vous{0}{1}{2}",[(a.client?tr(" de {0}",[cap(a.client)]):""),(a.date?tr(" au {0}",[fdate(fromIso(a.date))]):""),(a.heure?tr(" à {0}",[ftime(+a.heure.slice(0,2),+a.heure.slice(3,5))]):"")]);
      case "planning.libre":return tr("Chercher un créneau libre{0}",[(a.date?tr(" à partir du {0}",[fdate(fromIso(a.date))]):"")]);case "planning.absence":return tr("Marquer une indisponibilité");case "planning.ouvrir":return tr("Ouvrir le planning{0}",[(a.date?tr(" du {0}",[fdate(fromIso(a.date))]):"")]);
      case "factures.paiement":return a.montant==="reste"?tr("{0} a tout payé (solde)",[cap(a.client||tr("le client"))]):tr("Paiement de {0}{1}{2}",[eur(+a.montant||0),(a.client?tr(" par {0}",[cap(a.client)]):""),(a.mode?" ("+trw(a.mode)+")":"")]);case "factures.creer":return tr("Préparer la facture {0}{1}",[(a.type==="acompte"?tr("d’acompte"):tr("finale")),(a.client?tr(" de {0}",[cap(a.client)]):"")]);case "factures.ouvrir":return tr("Ouvrir les factures{0}",[cl(a.client)]);
      case "clients.maj":return tr("Mettre à jour la fiche client de {0}",[cap(a.nom||"")]);case "clients.ouvrir":return a.nom?tr("Ouvrir la fiche de {0}",[cap(a.nom)]):tr("Ouvrir mes clients");
      case "fournisseurs.ajouter":return tr("Enregistrer le fournisseur {0}{1}",[a.nom,(a.specialite?" ("+a.specialite+")":"")]);case "fournisseurs.ouvrir":return tr("Ouvrir mes fournisseurs");case "fournisseurs.commande":return tr("Commande chez {0}",[a.nom]);
      case "pointage.entree":return tr("Pointer l’arrivée{0}",[(a.client?tr(" chez {0}",[cap(a.client)]):"")]);case "pointage.sortie":return tr("Pointer la sortie");case "pointage.ouvrir":return tr("Ouvrir mes heures");
      case "metre.calculer":return tr("Métré {0} × {1} m{2}",[fnum(+a.longueur),fnum(+a.largeur),(a.piece?" ("+roomLabel(a.piece).toLowerCase()+")":"")]);
      case "courses.ajouter":return tr("Ajouter à la liste de courses");case "courses.prix":return tr("Prix de « {0} » : {1}",[a.nom,eur(+a.prix)]);case "courses.calcul":return tr("Calculer les matériaux : {0}, {1} m²",[a.travail,fnum(+a.surface)]);case "courses.ouvrir":return tr("Ouvrir ma liste de courses");case "projet.demande":return tr("Préparer une demande de devis pour un artisan");
      case "memoire.retenir":return tr("Retenir : {0}",[a.fait]);case "memoire.oublier":return tr("Oublier : {0}",[a.texte]);case "memoire.ouvrir":return tr("Ouvrir la mémoire");case "mot.apprendre":return tr("Apprendre : « {0} » = {1}",[a.mot,a.sens]);
      case "scene.ajouter":return tr("Maquette 3D : ajouter {0}",[(a.items||[]).map(function(x){var t=resolveType(x.type);return tname(t||x.type,+x.nombre||1)+(x.couleur?" "+trw(x.couleur):"")+(x.piece?" "+where(resolveRoom(x.piece)):"");}).join(", ")]);
      case "scene.enlever":return tr("Maquette 3D : enlever {0}{1}",[(a.tous?tr("les "):""),tname(resolveType(a.type)||a.type,a.tous?2:1).replace(/^\d+ /,"")]);case "scene.remplacer":return tr("Maquette 3D : remplacer {0} par {1}",[tname(resolveType(a.de)||a.de,1),tname(resolveType(a.par)||a.par,1)]);
      case "scene.couleur":return tr("Maquette 3D : {0} en {1}",[tname(resolveType(a.type)||a.type,1),a.couleur]);case "scene.tourner":return tr("Maquette 3D : tourner {0}",[art(resolveType(a.type)||a.type)]);case "scene.taille":return tr("Maquette 3D : {0}",[(a.longueur?tr("mettre {0} à {1} m",[art(resolveType(a.type)||a.type),fnum(+a.longueur)]):(a.sens==="moins"?tr("réduire "):tr("agrandir "))+art(resolveType(a.type)||a.type))]);
      case "scene.deplacer":return tr("Maquette 3D : déplacer {0} {1}",[art(resolveType(a.type)||a.type),(a.position?posLabel(a.position):where(resolveRoom(a.piece)))]);
      case "scene.peindre":return tr("Maquette 3D : {0}{1} en {2}",[(a.cible==="plafond"?tr("plafond"):tr("murs")),(a.piece==="partout"?tr(" de toutes les pièces"):a.piece?" "+deRoom(resolveRoom(a.piece)):""),(a.couleur||a.matiere)]);
      case "scene.sol":return tr("Maquette 3D : sol{0} en {1}",[(a.piece==="partout"?tr(" partout"):a.piece?" "+deRoom(resolveRoom(a.piece)):""),[a.matiere,a.couleur].filter(Boolean).map(trw).join(" ")]);
      case "scene.facade":return tr("Maquette 3D : façade en {0}",[[a.matiere,a.couleur].filter(Boolean).map(trw).join(" ")]);case "scene.style":return tr("Maquette 3D : style {0}{1}",[a.theme,(a.piece?tr(" pour {0}",[roomLabel(resolveRoom(a.piece)).toLowerCase()]):"")]);
      case "scene.meubler":return tr("Maquette 3D : meubler {0}",[(a.piece&&a.piece!=="maison"?roomLabel(resolveRoom(a.piece)).toLowerCase():tr("toute la maison"))]);case "scene.vider":return tr("Maquette 3D : vider {0}",[(a.piece&&a.piece!=="maison"?roomLabel(resolveRoom(a.piece)).toLowerCase():tr("toute la maquette"))]);
      case "scene.info":return a.quoi==="nombre"?tr("Compter : {0}",[tname(resolveType(a.type)||a.type,2).replace(/^\d+ /,"")]):a.quoi==="surface"?tr("Surface {0}",[(a.piece?deRoom(resolveRoom(a.piece)):tr("totale"))]):tr("Estimer le prix");
      case "scene.reglage":return a.hauteur?tr("Hauteur sous plafond : {0} m",[fnum(+a.hauteur)]):tr("Épaisseur des murs : {0} cm",[fnum(+a.epaisseur*100)]);case "scene.terrain":return tr("Terrain {0}",[(a.surface?fnum(+a.surface)+" m²":fnum(+a.largeur)+" × "+fnum(+a.longueur)+" m")]);
      case "scene.renommer":return tr("Renommer {0} en « {1} »",[roomLabel(resolveRoom(a.piece)).toLowerCase(),a.nom]);case "scene.etage":return {ajouter:tr("Ajouter un étage"),monter:tr("Monter d’un étage"),descendre:tr("Descendre d’un étage"),aller:(+a.niveau?tr("Aller à l’étage {0}",[a.niveau]):tr("Aller au rez-de-chaussée")),enlever:tr("Enlever le dernier étage"),plainpied:tr("Maison de plain-pied")}[a.action]||tr("Étages");
      case "scene.toit":return a.enlever?tr("Enlever le toit"):tr("Toit {0}{1}",[(a.forme||""),(a.matiere?tr(" en {0}",[a.matiere]):"")]);case "scene.exterieur":return (a.ajouter||[]).length?tr("Extérieur : ajouter {0}",[a.ajouter.map(trw).join(", ")]):tr("Extérieur : enlever {0}",[(a.enlever||[]).map(trw).join(", ")]);
      case "scene.vue":return tr("Ouvrir la maquette 3D{0}",[(a.vue==="dessus"?tr(" en vue de dessus"):a.vue==="interieure"?tr(" en vue intérieure"):"")]);case "scene.ambiance":return a.nuit?tr("Mode nuit"):tr("Mode jour");case "scene.murs":return a.bas?tr("Murs bas"):tr("Murs hauts");case "scene.reinit":return tr("Remettre la maquette comme au début");case "scene.ouvrir":return tr("Ouvrir la maquette 3D");
      case "scene.situation":return tr("Adapter la maquette : {0}",[({bright:"plus de lumière",dim:"ambiance plus douce",empty:"meubler",clutter:"alléger",baby:"chambre de bébé",kid:"coin enfant",work:"coin bureau",guests:"recevoir",cold:"chauffage",hot:"rafraîchir",cook:"cuisine",storage:"rangement",price:"prix"}[a.code]||a.code)]);
      case "sys.ia":return a.on?tr("Activer le modèle de langage"):tr("Désactiver le modèle de langage");case "sys.mode":return a.mode==="bricoleur"?tr("Passer en mode Bricoleur du dimanche"):tr("Passer en mode Artisan");case "sys.annuler":return tr("Annuler la dernière action");case "sys.refaire":return tr("Rétablir la dernière action");
      case "sys.fermer":case "sys.politesse":case "sys.aide":case "sys.question":return "";case "sys.mesure":return tr("Mesurer la recherche");case "sys.entraine":return tr("M’entraîner");case "sys.sauvegarde":return tr("Sauvegarde");case "sys.reinit":return tr("Tout effacer");
    }
    return c.m+" · "+c.a;
  }
  B.describe=function(cmds){return cmds.map(function(c){var x=B.describeExtra?B.describeExtra(c):null;return x!=null?x:D(c);}).filter(Boolean).join(" ; ");};

  /* =====================================================================
     Fonctions casô ajoutées au chat (reprises du projet : parseNote, faChat, svcChat, agChat, prixChat,
     dictée « casô note », import/export, pointage NFC, « Créer mon devis », module 3D dimEdit…)
     ===================================================================== */
  ["entreprise","horaires","fournPrix","liens","relances","nfc","imports","messages","archives"].forEach(function(k){if(!(k in S))S[k]=saved&&saved[k]!=null?saved[k]:k==="entreprise"||k==="nfc"||k==="imports"||k==="archives"?{}:k==="horaires"?{debut:"08:00",fin:"18:00",jours:[1,2,3,4,5]}:[];});
  function hm(t){return t?pad(t.h)+":"+pad(t.m):null;}
  function curLine(lab){var d=getCur();if(!d)return null;var h0=hn(lab);return d.lignes.filter(function(l){var x=hn(l.libelle);return x===h0||x.indexOf(h0)>=0||h0.indexOf(x)>=0||sim(x,h0)>=0.8;})[0]||null;}
  /* ---------- reconnaissance des phrases de ces fonctions ---------- */
  function parseExtra(c){
    var pp=parsePreparer(c)||parseModele(c);if(pp)return pp;
    var n=c.p,raw=c.raw,m,k=findClient(raw,c.n)||null,art=S.mode==="artisan";
    /* bibliothèque des fonctions */
    if(/^(aide|help|\?|bibliotheque|ta bibliotheque|que sais tu faire|que peux tu faire|qu est ce que tu sais faire|tu sais faire quoi|fonctions|tes fonctions|liste des commandes|commandes|comment ca marche|qu est ce que je peux te demander)$/.test(n))return [C("bibliotheque","ouvrir",{})];
    /* dictée vocale : « casô note » … « casô fin » */
    if(WAKE_DEB&&WAKE_DEB.test(raw))return [C("dictee","debut",{texte:raw.replace(WAKE_DEB,"$1").trim()})];
    if(WAKE_FIN&&WAKE_FIN.test(raw))return [C("dictee","fin",{})];
    if(/^(dictee|dicter|mode dictee|je veux dicter|active la dictee|lance la dictee)$/.test(n))return [C("dictee","debut",{texte:""})];
    /* questions, messages et appels, suppression d'une fiche */
    var qa=parseLire(c)||parseAsk(c)||parsePay(c)||parseMsg(c)||parseDel(c);if(qa)return qa;
    /* juste le nom d'un client : sa fiche */
    if(n.split(" ").length<=3){var k1=findKey(n.replace(/^(?:m|mme|madame|monsieur|client|cliente|fiche)\s+/,""));if(k1&&S.clients[k1])return [C("clients","ouvrir",{nom:clientName(k1)})];}
    /* import / export */
    if(/\b(importe|importer|import)\b/.test(n))return [C("fichiers","importer",{quoi:/fournisseur|facture/.test(n)?"fournisseur":/prix|tarif|service/.test(n)?"prix":/client/.test(n)?"clients":"fichier"})];
    if((/\b(exporte|exporter|export|telecharge|telecharger)\b/.test(n)||/\b(en fichier|dans un fichier|en csv|en excel|fichier csv|tableur)\b/.test(n))&&!/\bmodele\b/.test(n)&&!/\b(importe|import)\b/.test(n))return [C("fichiers","exporter",{quoi:/client/.test(n)?"clients":/devis/.test(n)?"devis":/prix|tarif|service/.test(n)?"prix":/paiement|facture/.test(n)?"paiements":/fournisseur/.test(n)?"fournisseurs":/heure|pointage/.test(n)?"heures":"tout"})];
    /* pointage NFC */
    if(/\b(nfc|badge|tag|puce)\b/.test(n)){if(/\b(associe|associer|lie|lier|attribue|enregistre|programme|configure)\b/.test(n)||k)return [C("pointage","nfc",{action:"associer",client:k?clientName(k):null})];return [C("pointage","nfc",{action:"scanner"})];}
    /* « Créer mon devis » : modèle de l'entreprise */
    if(/\b(mon modele de devis|modele de devis|creer mon devis|mon entreprise|ma societe|mon en tete|mes infos pro|mes informations professionnelles|ma raison sociale)\b/.test(n)&&!/\b(c est|est|:|=)\b/.test(n.replace(/^(?:ouvre|montre|affiche|voir)\s+/,"")))return [C("entreprise","ouvrir",{})];
    var ent={};
    if((m=raw.match(/\bsiret\s*(?:\p{L}{1,4}\s+)?(?:c'est|c’est|est|:|=)?\s*([\d\s]{14,20})/iu)))ent.siret=m[1].replace(/\s/g,"").replace(/(\d{3})(\d{3})(\d{3})(\d{5})/,"$1 $2 $3 $4");
    if((m=raw.match(/\b(?:nom de (?:mon|l')\s*entreprise|nom de ma soci[ée]t[ée]|raison sociale|mon entreprise s'appelle|ma soci[ée]t[ée] s'appelle|mon entreprise c'est)\s*(?:c'est|c’est|est|:|=)?\s*(.+)$/i)))ent.nom=m[1].trim();
    if((m=raw.match(/\b(?:tva intra(?:communautaire)?|num[ée]ro de tva)\s*(?:c'est|est|:|=)?\s*([A-Z]{2}\s?[\dA-Z\s]{8,14})/i)))ent.tva_intra=m[1].replace(/\s/g,"");
    if((m=raw.match(/\b(?:adresse (?:pro|de l'entreprise|de ma soci[ée]t[ée]|du si[èe]ge))\s*(?:c'est|est|:|=)?\s*(.+)$/i)))ent.adresse=m[1].trim();
    if((m=raw.match(/\b(?:t[ée]l[ée]phone pro|num[ée]ro pro|mon t[ée]l[ée]phone professionnel)\s*(?:c'est|est|:|=)?\s*((?:\+33\s?|0)\s?[1-9](?:[\s.-]?\d{2}){4})/i)))ent.tel=m[1];
    if((m=raw.match(/\b(?:mail pro|e-?mail pro|adresse mail pro)\s*(?:c'est|est|:|=)?\s*([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/i)))ent.email=m[1];
    if((m=raw.match(/\b(?:conditions? de (?:paiement|r[èe]glement))\s*(?:c'est|sont|est|:|=)?\s*(.+)$/i)))ent.conditions=m[1].trim();
    if((m=n.match(/\bvalidite (?:des |du |de mes )?devis\s*(?:de |a |:)?\s*(\d+)\s*jours?\b/))||(m=n.match(/\bdevis valables?\s*(\d+)\s*jours?\b/)))ent.validite=+m[1];
    if((m=raw.match(/\b(?:assurance d[ée]cennale|d[ée]cennale)\s*(?:c'est|chez|:|=)?\s*(.+)$/i)))ent.decennale=m[1].trim();
    if(Object.keys(ent).length)return [C("entreprise","maj",ent)];
    if(!art&&/\b(siret|decennale)\b/.test(n))return null;
    /* devis : remise, forfait, dimensions, modification, duplication, PDF */
    if(/\b(remise|reduction|rabais|ristourne|geste commercial)\b/.test(n)){var pc=n.match(/(\d+(?:\.\d+)?)\s*(?:%|pour ?cent)/),mt=money(n);if(pc||mt!=null)return [C("devis","remise",pc?{pourcentage:pnum(pc[1])}:{montant:mt})];if(/\b(enleve|supprime|retire|annule|plus de|sans)\b/.test(n))return [C("devis","remise",{montant:0})];}
    if(/\bforfait\b/.test(n)&&money(n)!=null&&!/\b(deplacement|main d oeuvre|petites fournitures)\b.*\b(le|par|c est)\b/.test(n)){
      var fm=n.match(/\bforfait\s*(?:de\s+)?\d+(?:\.\d+)?\s*(?:€|euros?)\s*(?:pour|de|du|des|d)?\s*(?:la |le |les |l )?(.*)$/)||n.match(/^(?:ajoute |mets )?(?:un |le )?(.*?)\s+(?:au |en |a )?forfait\b/);
      var lab=fm?cleanLabel(fm[1]||""):"";return [C("devis","lignes",{client:k?clientName(k):null,lignes:[{libelle:lab||"forfait",quantite:1,unite:"forfait",prix:money(n)}]})];}
    var dims={},dm,dre=/(\d+(?:\.\d+)?)\s*(m|cm|metres?)?\s*(?:de\s+|d\s+)?(largeur|hauteur|longueur|profondeur|large|haut|long|profond)\b|\b(largeur|hauteur|longueur|profondeur)\s*(?:de\s+|:\s*)?(\d+(?:\.\d+)?)\s*(m|cm|metres?)?/g;
    while((dm=dre.exec(n))){var key=(dm[3]||dm[4]).replace(/^large$/,"largeur").replace(/^haut$/,"hauteur").replace(/^long$/,"longueur").replace(/^profond$/,"profondeur"),val=pnum(dm[1]||dm[5]),u=dm[2]||dm[6]||"m";dims[key]=u==="cm"?val/100:val;}
    if(Object.keys(dims).length){var eqd=findEquip(n);if(eqd.length||/\b(canape|lit|table|meuble|armoire)\b/.test(n))return [C("scene","dimension",Object.assign({type:eqd.length?eqd[0].type:null},dims))];
      if(!/\b(terrain|plafond)\b/.test(n))return [C("devis","dimension",Object.assign({piece:(findRoom(n)||{}).id||null},dims))];}
    if((m=n.match(/\b(?:le |la |les )?(\S+(?: \S+)?) fait (\d+(?:\.\d+)?)\s*(m|cm)?\s*(?:de (long|large|haut|profondeur))?(?:\s*(?:sur|x|par)\s*(\d+(?:\.\d+)?)\s*(m|cm)?)?/))){var eqf=findEquip(m[1]);if(eqf.length){var L1=pnum(m[2])/(m[3]==="cm"?100:1),o={type:eqf[0].type};o[m[4]==="large"?"largeur":m[4]==="haut"?"hauteur":m[4]==="profondeur"?"profondeur":"longueur"]=L1;if(m[5])o.profondeur=pnum(m[5])/(m[6]==="cm"?100:1);return [C("scene","dimension",o)];}}
    if(/\b(duplique|dupliquer|copie|copier|reprends|reprendre)\b.*\bdevis\b|\b(meme devis|devis identique)\b/.test(n)){var kk=null;var mm=raw.match(/\b(?:pour|à|a)\s+(\p{Lu}[\p{L}'’-]+)/u);if(mm)kk=mm[1];return [C("devis","dupliquer",{source:k&&(!kk||clientKey(kk)!==k)?clientName(k):null,client:kk})];}
    if(/\bpdf\b/.test(n)&&/\b(devis|facture)\b/.test(n))return [C(/facture/.test(n)?"factures":"devis","pdf",{client:k?clientName(k):null})];
    if(art&&getCur()&&!/\b(ajoute|rajoute|ajouter)\b/.test(n)){var q=qtys(stripTimes(n)),mo2=money(n);
      if((q.length||mo2!=null)&&/\b(change|changer|modifie|modifier|corrige|corriger|finalement|au lieu|plutot|en fait|passe|passer|remplace|mets|met)\b/.test(n)){
        var d=getCur(),hit=d.lignes.filter(function(l){var x=hn(l.libelle);return x.length>2&&(n.indexOf(x)>=0||x.split(" ").some(function(w){return w.length>4&&n.indexOf(w)>=0;}));})[0];
        if(hit){var o2={libelle:hit.libelle};if(q.length)o2.quantite=q[q.length-1].q;if(mo2!=null&&/\b(prix|€|euros?)\b/.test(n))o2.prix=mo2;return [C("devis","modifier_ligne",o2)];}}}
    /* services : supprimer */
    if((m=n.match(/\b(?:supprime|enleve|retire|efface|zappe|vire|degage|oublie)\s+(?:le service |la prestation |le prix (?:du |de la |de l |des )?)(.+?)(?: de mes (?:prix|services))?$/))||(m=n.match(/\b(?:supprime|enleve|retire|efface|zappe|vire|degage)\s+(?:le |la |l |les )?(.+?) de mes (?:prix|services|tarifs)$/)))return [C("services","supprimer",{nom:cleanLabel(m[1])})];
    /* horaires de travail */
    if((m=n.match(/\bje (?:travaille|bosse|suis dispo|suis disponible|taffe)\s+(?:de|entre)\s+(\d{1,2})\s*h\s*(\d{2})?\s*(?:a|et|-)\s*(\d{1,2})\s*h\s*(\d{2})?/))||(m=n.match(/\bmes horaires?\s*(?:c est|sont|:)?\s*(?:de\s+)?(\d{1,2})\s*h\s*(\d{2})?\s*(?:a|-|et)\s*(\d{1,2})\s*h\s*(\d{2})?/)))return [C("planning","horaires",{debut:pad(+m[1])+":"+pad(+m[2]||0),fin:pad(+m[3])+":"+pad(+m[4]||0)})];
    if((m=n.match(/\bje (?:commence|demarre|ouvre)\s+(?:a|des)\s+(\d{1,2})\s*h\s*(\d{2})?/)))return [C("planning","horaires",{debut:pad(+m[1])+":"+pad(+m[2]||0)})];
    if((m=n.match(/\bje (?:finis|termine|ferme|m arrete)\s+(?:a|vers)\s+(\d{1,2})\s*h\s*(\d{2})?/)))return [C("planning","horaires",{fin:pad(+m[1])+":"+pad(+m[2]||0)})];
    if(/\b(mes horaires|mes heures de travail|mes creneaux de travail|mes dispos)\b/.test(n))return [C("planning","ouvrir",{})];
    /* rendez-vous récurrents : « tous les lundis à 8h », « chaque mardi » */
    if((m=n.match(new RegExp("\\b(?:tous les|chaque|toutes les semaines le)\\s+("+JOURS.join("|")+")s?\\b")))){var tr=parseTime(n),sauf=n.match(/\bsauf\b.*$/);
      return [C("planning","recurrent",{jour:JOURS.indexOf(m[1]),heure:tr?hm(tr):null,client:k?clientName(k):null,titre:(n.match(/\b(chantier|visite|reunion|livraison|pose|intervention|rdv|rendez vous)\b/)||[0,"Rendez-vous"])[1].replace("rendez vous","rendez-vous"),semaines:(n.match(/\bpendant\s+(\d+)\s+semaines\b/)||[0,8])[1]})];}
    /* paiements : tout payé, lien de paiement Stripe, relance */
    if(k&&/\b(a tout paye|a tout regle|a solde|a paye le reste|a regle le reste|a paye le solde|a regle le solde|a tout vire|a paye la totalite|a paye l integralite|a tout regle)\b/.test(n))return [C("factures","paiement",{client:clientName(k),montant:"reste",mode:/cheque/.test(n)?"chèque":/espece|liquide|cash/.test(n)?"espèces":/carte|cb/.test(n)?"carte":/vire|virement/.test(n)?"virement":null})];
    if(/\b(lien de paiement|lien stripe|stripe|payer par carte|paiement en ligne|lien pour payer|qu il paie en ligne|fais le payer|fais la payer)\b/.test(n))return [C("factures","lien",{client:k?clientName(k):(S.last.client?clientName(S.last.client):null),montant:money(n)})];
    if(/\b(relance|relancer|rappelle|rappeler)\b/.test(n)&&(k||/\b(impayes?|retard|tous|clients)\b/.test(n))&&!/\b(rdv|rendez vous|demain|lundi|mardi|mercredi|jeudi|vendredi|samedi)\b/.test(n))return [C("factures","relance",{client:k?clientName(k):null})];
    /* note sur un client */
    if(k&&(m=raw.match(/\b(?:note|retiens|remarque|info)\s+(?:sur|pour|à propos de|a propos de|concernant)\s+(?:M\.\s*|Mme\s*)?[\p{L}'’-]+\s*[:,-]?\s*(.+)$/iu)))return [C("clients","note",{nom:clientName(k),texte:m[1].trim()})];
    if(k&&horsFr(c)&&(m=n.match(/\b(?:note|retiens|remarque|info)\s+(?:sur|pour|a propos de|concernant)\s+(?:m\s+|mme\s+)?[\p{L}'-]+\s*[:,-]?\s*(.+)$/u))){var ntx=origTail(raw,m[1]);if(ntx)return [C("clients","note",{nom:clientName(k),texte:ntx})];}
    /* prix chez un fournisseur */
    var fp=fournPrice(raw);
    /* autre langue : « en Point P … », « da Point P … » -> « chez Point P … » sur la traduction */
    if(!fp&&horsFr(c)){fp=fournPrice(n.replace(/^(?:dans le|dans la|dans|da|de|en|a|le|la)\s+/,"chez "));if(fp)fp.nom=origOf(raw,hn(fp.nom))||fp.nom;}
    if(fp)return [C("fournisseurs","prix",fp)];
    if((m=raw.match(/^([\p{Lu}][\p{L}0-9'’ .-]*?)\s+(?:vend|fait|propose)\s+(?:le |la |les |l')?(.+?)\s+(?:à |a )?(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?)\s*(?:(?:le|la|les|par|l')\s*(\S+))?/u))&&FOURNOK(m[1]))return [C("fournisseurs","prix",{nom:m[1].trim(),article:cleanLabel(hn(m[2])),prix:pnum(m[3]),unite:unitOf(hn(m[4]||""))||null})];
    /* 3D : envoyer la maquette au client */
    if(/\b(envoie|envoyer|partage|partager|transmets|montre)\b.*\b(maquette|3d|plan 3d)\b/.test(n)&&!/\b(montre moi|montre la maquette)\b/.test(n))return [C("scene","envoyer",{client:k?clientName(k):null})];
    /* devis : à faire, remarques (mots de parseNote) */
    if(art&&/^(?:il faut|faut|a faire|penser a|pense a|rappeler|acheter|commander|ne pas oublier|n oublie pas|a prevoir|prevoir de)\b/.test(n)&&!qtys(stripTimes(n)).length)return [C("devis","afaire",{taches:[raw.replace(/^\s*(?:il faut|faut|à faire|a faire|penser à|penser a|pense à|pense a|ne pas oublier de|ne pas oublier|n'oublie pas de|n'oublie pas|à prévoir|a prevoir|prévoir de|prevoir de)\s*:?\s*/i,"").trim()||raw.trim()]})];
    if(art&&/^(?:attention|remarque|note|probleme|humidite|fissure|acces|parking|etage|ascenseur|amiante|plomb|delai|urgent|cle|cles)\b/.test(n)&&getCur())return [C("devis","remarque",{texte:raw.trim()})];
    return null;
  }
  function fournNames(){var L=(X.fourn||[]).concat(S.fournisseurs.map(function(f){return f.nom;}));return L.filter(function(x,i){return L.indexOf(x)===i;}).sort(function(a,b){return b.length-a.length;});}
  function fournPrice(raw){var low=raw.toLowerCase(),names=fournNames();
    for(var i=0;i<names.length;i++){var nm=names[i],pos=low.indexOf(nm.toLowerCase());if(pos<0)continue;var before=low.slice(0,pos),after=raw.slice(pos+nm.length);
      if(/\bchez\s*$/.test(before)||/^\s*$/.test(before)){var m=after.match(/^\s*,?\s*(?:(?:vend|fait|propose|a)\s+)?(?:le |la |les |l'|l’)?(.+?)\s+(?:est |sont |coûte |coute |coûtent |coutent |vaut |valent )?(?:à |a )?(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?)\s*(?:(?:le|la|les|par|l'|l’)\s*(\S+))?/i);
        if(m&&!/^(m'a|a payé|a paye)/i.test(after.trim()))return {nom:nm,article:cleanLabel(hn(m[1]))||hn(m[1]),prix:pnum(m[2]),unite:unitOf(hn(m[3]||""))||null};}}
    return null;}
  function FOURNOK(name){var h0=hn(name);return (X.fourn||[]).some(function(f){return hn(f)===h0;})||S.fournisseurs.some(function(f){return hn(f.nom)===h0;});}
  var WAKE_DEB=null,WAKE_FIN=null;try{if(X.wake){WAKE_DEB=new RegExp(X.wake.debut,X.wake.flags);WAKE_FIN=new RegExp(X.wake.fin,X.wake.flags);}}catch(e){}

  /* ---------- exécution de ces fonctions ---------- */
  X_["bibliotheque.ouvrir"]=function(){return R("",{screen:"bibliotheque"});};
  X_["dictee.debut"]=function(a){S.dictee={on:true,texte:a.texte||""};return {say:tr("Je t’écoute. Dis « casô fin » quand tu as terminé."),ui:"dictee-debut"};};
  X_["dictee.fin"]=function(){var t=S.dictee&&S.dictee.texte||"";S.dictee=null;if(!t.trim())return {say:tr("Dictée arrêtée."),ui:"dictee-fin"};return {say:tr("Note terminée, je la traite."),ui:"dictee-fin",relance:t};};
  X_["fichiers.importer"]=function(a){return R("",{screen:"import",arg:a.quoi||"fichier"});};
  X_["fichiers.exporter"]=function(a){return {say:"",ui:"export",quoi:a.quoi||"tout"};};
  X_["pointage.nfc"]=function(a){return {say:"",ui:"nfc",nfc:a};};
  B.nfcTag=function(serial){/* appelé par l'écran quand un badge est lu */
    var t=S.nfc[serial];if(S.nfcAssoc){var k=S.nfcAssoc;S.nfcAssoc=null;S.nfc[serial]={client:k};emit("pointage","nfc-associer",{tag:serial,client:k});return "Badge associé au chantier "+clientName(k)+". Un passage du téléphone dessus pointe l’arrivée, le suivant la sortie.";}
    if(!t)return "Badge inconnu. Dis « associe ce badge au chantier Dupont » puis repasse le téléphone dessus.";
    var open=S.pointages.filter(function(p){return !p.fin;})[0];B.snapshot("pointage NFC");
    if(open){open.fin=B.now().getTime();emit("pointage","sortie",open);return "Sortie pointée ("+clientName(t.client)+"). Durée : "+fnum((open.fin-open.debut)/3600000)+" h.";}
    S.pointages.push({id:id(),client:t.client,debut:B.now().getTime(),fin:null,nfc:serial});emit("pointage","entree",{client:t.client,nfc:serial});var d=B.now();return "Arrivée pointée à "+ftime(d.getHours(),d.getMinutes())+" chez "+clientName(t.client)+".";};
  X_["entreprise.ouvrir"]=function(){return R("",{screen:"entreprise"});};
  X_["entreprise.maj"]=function(a){Object.keys(a).forEach(function(k){if(a[k]!=null&&a[k]!=="")S.entreprise[k]=a[k];});emit("entreprise","maj",a);
    var lab={nom:"nom",siret:"SIRET",tva_intra:"TVA intracommunautaire",adresse:"adresse",tel:"téléphone",email:"e-mail",conditions:"conditions de paiement",validite:"validité",decennale:"décennale"};
    return R(tr("Modèle de devis à jour : {0}.",[Object.keys(a).map(function(k){return trw(lab[k])+" "+(k==="validite"?tr("{0} jours",[a[k]]):a[k]);}).join(", ")]));};
  X_["devis.remise"]=function(a){var d=getCur();if(!d)return R(tr("Pas de devis en cours."));if(!a.pourcentage&&!a.montant){d.remise=null;return R(tr("Remise enlevée. Total : {0} HT.",[eur(totalHT(d))]));}
    d.remise=a.pourcentage?{type:"%",valeur:+a.pourcentage}:{type:"€",valeur:+a.montant};emit("devis","remise",d.remise);return R(tr("Remise de {0} appliquée. Total : {1} HT.",[(a.pourcentage?fnum(+a.pourcentage)+" %":eur(+a.montant)),eur(totalHT(d))]));};
  X_["devis.dimension"]=function(a){var d=curDevis(null);d.dims=d.dims||[];var o={};["longueur","largeur","hauteur","profondeur"].forEach(function(k){if(a[k])o[k]=+a[k];});if(a.piece)o.piece=a.piece;d.dims.push(o);
    var s=o.longueur&&o.largeur?o.longueur*o.largeur:o.largeur&&o.hauteur?o.largeur*o.hauteur:o.longueur&&o.hauteur?o.longueur*o.hauteur:null;emit("devis","dimension",o);
    return R(tr("Dimensions notées : {0}{1}.",[Object.keys(o).filter(function(k){return k!=="piece";}).map(function(k){return k+" "+fnum(o[k])+" m";}).join(", "),(s?tr(" (surface {0} m²)",[fnum(Math.round(s*100)/100)]):"")]));};
  X_["devis.modifier_ligne"]=function(a){var l=curLine(a.libelle);if(!l)return R(tr("Je ne trouve pas « {0} » dans le devis.",[a.libelle]));if(a.quantite!=null)l.quantite=+a.quantite;if(a.prix!=null)l.prix=+a.prix;var d=getCur();emit("devis","modifier",{libelle:l.libelle});
    return R(tr("{0} : {1} {2}{3}. Total : {4} HT.",[l.libelle,fnum(l.quantite),l.unite,(l.prix!=null?" × "+eur(l.prix):""),eur(totalHT(d))]));};
  X_["devis.dupliquer"]=function(a){var src=a.source?S.devis.filter(function(x){return x.client===clientKey(a.source);}).slice(-1)[0]:getCur();if(!src||!src.lignes.length)return R(tr("Je ne trouve pas de devis à dupliquer."));
    var k=a.client?ensureClient(a.client):null,d=newDevis(k);d.lignes=clone(src.lignes);d.afaire=clone(src.afaire||[]);d.fournisseurs=clone(src.fournisseurs||[]);d.remise=src.remise?clone(src.remise):null;emit("devis","dupliquer",{de:src.id,vers:d.id});
    return R(tr("Devis dupliqué{0} : {1} ligne{2}, {3} HT.",[(k?tr(" pour {0}",[clientName(k)]):""),d.lignes.length,(d.lignes.length>1?"s":""),eur(totalHT(d))]),{screen:"devis"});};
  X_["devis.pdf"]=function(a){var k=a.client?clientKey(a.client):null,d=k?S.devis.filter(function(x){return x.client===k;}).slice(-1)[0]:getCur();if(!d)return R(tr("Je ne trouve pas ce devis."));
    if(d.statut!=="validé")return R(tr("Le PDF du devis n’est fait qu’après la signature du client (règle casô). Ce devis est « {0} ».",[d.statut]));emit("devis","pdf",{id:d.id});return R(tr("PDF du devis {0} prêt dans casô.",[d.num]));};
  X_["factures.pdf"]=function(a){var k=a.client?clientKey(a.client):S.last.client;if(!k)return R(tr("Pour quel client ?"));var d=devisOf(k),tot=d?totalTTC(d):0;if(tot-paid(k)>0.009)return R(tr("La facture PDF n’est faite qu’après le paiement complet : il reste {0}.",[eur(tot-paid(k))]));emit("factures","pdf",{client:k});return R(tr("Facture PDF prête pour {0}.",[clientName(k)]));};
  X_["services.supprimer"]=function(a){var s=findService(a.nom);if(!s)return R(tr("Je ne trouve pas « {0} » dans tes services.",[a.nom]));S.services.splice(S.services.indexOf(s),1);emit("services","supprimer",{nom:s.nom});return R(tr("Service supprimé : {0}.",[s.nom]));};
  X_["planning.horaires"]=function(a){if(a.debut)S.horaires.debut=a.debut;if(a.fin)S.horaires.fin=a.fin;emit("planning","horaires",S.horaires);var f=function(x){return ftime(+x.slice(0,2),+x.slice(3,5));};return R(tr("Horaires de travail : {0} – {1}. J’en tiens compte pour les créneaux libres.",[f(S.horaires.debut),f(S.horaires.fin)]));};
  X_["planning.recurrent"]=function(a){if(a.jour==null||a.jour<0)return R(tr("Quel jour de la semaine ?"));if(!a.heure){S.pending={type:"rdv-rec",cmd:a};return R(tr("À quelle heure ?"));}
    var base=sod(B.now()),diff=(a.jour-base.getDay()+7)%7||7,first=addDays(base,diff),n=Math.max(1,Math.min(26,+a.semaines||8)),ok=0,skip=0,k=a.client?ensureClient(a.client):null,h=+a.heure.slice(0,2),mi=+a.heure.slice(3,5);
    for(var i=0;i<n;i++){var d=addDays(first,7*i),start=new Date(d.getFullYear(),d.getMonth(),d.getDate(),h,mi).getTime(),end=start+60*60000;if(absentAt(start,end)||overlaps(start,end).length){skip++;continue;}S.rdv.push({id:id(),start:start,min:60,titre:cap(a.titre||"Rendez-vous"),client:k,serie:true});ok++;}
    S.rdv.sort(function(x,y){return x.start-y.start;});emit("planning","recurrent",a);
    return R(tr("{0} rendez-vous ajoutés : chaque {1} à {2}{3}, à partir du {4}.{5}",[ok,jourNom(a.jour),ftime(h,mi),(k?tr(" chez {0}",[clientName(k)]):""),fdate(first),(skip?tr(" {0} semaine{1} sautée{2} (créneau pris ou absence).",[skip,(skip>1?"s":""),(skip>1?"s":"")]):"")]));};
  X_["factures.lien"]=function(a){var k=a.client?clientKey(a.client):S.last.client;if(!k)return R(tr("Pour quel client ?"));var d=devisOf(k),tot=d?totalTTC(d):0,reste=Math.max(0,tot-paid(k)),mt=a.montant!=null?+a.montant:reste;
    if(!mt)return R(tr("Rien à payer pour {0}.",[clientName(k)]));var l={id:id(),client:k,montant:mt,date:B.now().getTime(),statut:"envoyé"};S.liens.push(l);emit("factures","stripe-lien",l);
    return R(tr("Lien de paiement Stripe de {0} envoyé à {1} dans casô. Je note le paiement dès qu’il arrive.",[eur(mt),clientName(k)]));};
  X_["factures.relance"]=function(a){var ks=a.client?[clientKey(a.client)]:Object.keys(S.clients).filter(function(k){var d=devisOf(k);return d&&d.statut==="validé"&&totalTTC(d)-paid(k)>0.009;});
    if(!ks.length)return R(tr("Aucun impayé à relancer."));ks.forEach(function(k){S.relances.push({client:k,date:B.now().getTime()});emit("factures","relance",{client:k});});
    return R(tr("Relance envoyée dans casô à {0}.",[ks.map(clientName).join(", ")]));};
  X_["clients.note"]=function(a){var k=ensureClient(a.nom);S.clients[k].notes=S.clients[k].notes||[];S.clients[k].notes.push(a.texte);emit("clients","note",{client:k});return R(tr("Noté sur la fiche de {0}.",[clientName(k)]));};
  X_["fournisseurs.prix"]=function(a){X_["fournisseurs.ajouter"]({nom:a.nom});S.fournPrix.push({fournisseur:cap(a.nom),article:a.article,prix:+a.prix,unite:a.unite||null,date:B.now().getTime()});emit("fournisseurs","prix",a);
    var others=S.fournPrix.filter(function(x){return hn(x.article)===hn(a.article)&&hn(x.fournisseur)!==hn(a.nom);}),best=others.sort(function(x,y){return x.prix-y.prix;})[0];
    return R(tr("Prix noté chez {0} : {1} à {2}{3}.{4}",[cap(a.nom),a.article,eur(+a.prix),(a.unite?" / "+trw(a.unite):""),(best&&best.prix<+a.prix?tr(" Moins cher chez {0} ({1}).",[best.fournisseur,eur(best.prix)]):"")]));};
  X_["scene.dimension"]=function(a){var t=resolveType(a.type)||S.last.type,L=itemsOf(t);if(!L.length)return R(tr("Je ne trouve pas cet équipement dans la maquette."));var it=L[L.length-1].it,d=(TYPES[t]||{d:[1,1,1]}).d;
    it.dims=it.dims||d.slice();if(a.longueur)it.dims[0]=+a.longueur;if(a.largeur){if(a.longueur)it.dims[1]=+a.largeur;else it.dims[0]=+a.largeur;}if(a.profondeur)it.dims[1]=+a.profondeur;if(a.hauteur)it.dims[2]=+a.hauteur;S.last.type=t;emit("3d","dimension",a);
    return R(tr("{0} : {1} × {2} m, hauteur {3} m.",[cap(tname(t,1)),fnum(it.dims[0]),fnum(it.dims[1]),fnum(it.dims[2])]));};
  X_["scene.envoyer"]=function(a){var k=a.client?clientKey(a.client):(getCur()&&getCur().client)||S.last.client;if(!k)return R(tr("À quel client ?"));emit("3d","envoyer",{client:k});var d=S.devis.filter(function(x){return x.client===k;}).slice(-1)[0];if(d){d.maquette=true;}
    return R(tr("Maquette 3D envoyée à {0} avec le devis. Il pourra la modifier et tu seras prévenu de ses changements.",[clientName(k)]));};
  var D2={
    "bibliotheque.ouvrir":function(){return "";},"dictee.debut":function(){return tr("Dictée vocale");},"dictee.fin":function(){return tr("Fin de la dictée");},
    "fichiers.importer":function(a){return tr("Importer un fichier{0}",[({fournisseur:tr(" de fournisseur"),prix:tr(" de prix"),clients:tr(" de clients")}[a.quoi]||"")]);},"fichiers.exporter":function(a){return tr("Exporter {0}",[({clients:"les clients",devis:"les devis",prix:"les prix",paiements:"les paiements",fournisseurs:"les fournisseurs",heures:"les heures"}[a.quoi]||tr("toutes les données"))]);},
    "pointage.nfc":function(a){return a.action==="associer"?tr("Associer un badge NFC{0}",[(a.client?tr(" au chantier {0}",[a.client]):"")]):tr("Lire un badge NFC");},
    "entreprise.ouvrir":function(){return tr("Ouvrir mon modèle de devis");},"entreprise.maj":function(a){var lab={nom:"nom de l’entreprise",siret:"SIRET",tva_intra:"TVA intracommunautaire",adresse:"adresse",tel:"téléphone",email:"e-mail",conditions:"conditions de paiement",validite:"validité des devis",decennale:"assurance décennale"};return tr("Mon modèle de devis : {0}",[Object.keys(a).map(function(k){return trw(lab[k]||k);}).join(", ")]);},
    "devis.remise":function(a){return a.pourcentage?tr("Remise de {0} % sur le devis",[fnum(+a.pourcentage)]):a.montant?tr("Remise de {0} sur le devis",[eur(+a.montant)]):tr("Enlever la remise");},
    "devis.dimension":function(a){return tr("Dimensions : {0}",[["longueur","largeur","hauteur","profondeur"].filter(function(k){return a[k];}).map(function(k){return k+" "+fnum(+a[k])+" m";}).join(", ")]);},
    "devis.modifier_ligne":function(a){return tr("Modifier « {0} »{1}{2}",[a.libelle,(a.quantite!=null?" : "+fnum(+a.quantite):""),(a.prix!=null?tr(" à {0}",[eur(+a.prix)]):"")]);},
    "devis.dupliquer":function(a){return tr("Dupliquer le devis{0}{1}",[(a.source?tr(" de {0}",[a.source]):""),(a.client?tr(" pour {0}",[a.client]):"")]);},"devis.pdf":function(){return tr("PDF du devis");},"factures.pdf":function(a){return tr("Facture PDF{0}",[(a.client?tr(" de {0}",[a.client]):"")]);},
    "services.supprimer":function(a){return tr("Supprimer le service « {0} »",[a.nom]);},"planning.horaires":function(a){var f=function(x){return ftime(+x.slice(0,2),+x.slice(3,5));};return tr("Horaires de travail{0}{1}",[(a.debut?tr(" à partir de {0}",[f(a.debut)]):""),(a.fin?tr(" jusqu’à {0}",[f(a.fin)]):"")]);},
    "planning.recurrent":function(a){return tr("Rendez-vous chaque {0}{1}{2}",[jourNom(a.jour),(a.heure?tr(" à {0}",[ftime(+a.heure.slice(0,2),+a.heure.slice(3,5))]):""),(a.client?tr(" chez {0}",[a.client]):"")]);},
    "factures.lien":function(a){return tr("Lien de paiement Stripe{0}",[(a.client?tr(" pour {0}",[a.client]):"")]);},"factures.relance":function(a){return tr("Relancer {0}",[(a.client||tr("les impayés"))]);},
    "clients.note":function(a){return tr("Note sur {0}",[a.nom]);},"fournisseurs.prix":function(a){return tr("Prix chez {0} : {1} {2}",[a.nom,a.article,eur(+a.prix)]);},
    "scene.dimension":function(a){return tr("Maquette 3D : dimensions de {0}",[tname(resolveType(a.type)||S.last.type||"meuble",1)]);},"scene.envoyer":function(a){return tr("Envoyer la maquette 3D{0}",[(a.client?tr(" à {0}",[a.client]):tr(" au client"))]);}};
  B.describeExtra=function(c){var f=D2[c.m+"."+c.a];return f?f(c.args||{}):null;};

  /* ---------- registre des fonctions (écran « bibliothèque » et documentation) ---------- */
  B.clientKey=clientKey;
  B.FONCTIONS=[
   ["Devis","Créer un devis (client, travaux, quantités, prix)","parseNote",["devis pour Dupont carrelage 14 m² et main d'œuvre 8 h","quinze mètres carrés de faïence pour Martin"]],
   ["Devis","Coordonnées du client (adresse, téléphone, e-mail)","parseNote",["Dupont habite 12 rue des Lilas à Marseille","le numéro de Dupont c'est 06 12 34 56 78"]],
   ["Devis","Dimensions (largeur, hauteur, longueur)","parseNote",["largeur 3 m longueur 4,5 m"]],
   ["Devis","À faire et remarques du chantier","parseNote",["il faut commander la colle","attention parking difficile"]],
   ["Devis","Forfait, remise, TVA","prParse",["forfait de 300 € pour la dépose","remise de 10 %","TVA 10 %"]],
   ["Devis","Modifier ou retirer une ligne","parseNote",["le carrelage c'est 18 m² finalement","enlève la faïence du devis"]],
   ["Devis","Fournisseur du chantier","findSuppliers",["fournisseur Point P"]],
   ["Devis","Signature (toi, puis le client)","signature",["signe le devis","fais signer le client"]],
   ["Devis","Envoyer, accepté, refusé, historique","devis",["envoie le devis","Dupont a accepté le devis","mes devis acceptés"]],
   ["Devis","Dupliquer, PDF après validation","devis",["duplique le devis de Dupont pour Martin","PDF du devis"]],
   ["Devis","Mon modèle de devis (Créer mon devis)","creerMonDevis",["mon siret c'est 123 456 789 00012","validité des devis 30 jours","mon modèle de devis"]],
   ["Prix","Mes services et prix","svcChat / prixChat",["carrelage 45 € le m²","main d'œuvre 50 € de l'heure","supprime le service ragréage","mes prix"]],
   ["Planning","Rendez-vous : ajouter, décaler, annuler","agChat",["rdv demain à 14h chez Dupont","décale le rdv de Dupont à jeudi 10h","annule le rdv de Dupont"]],
   ["Planning","Planning, créneaux libres, horaires","agChat / agFree",["qu'est-ce que j'ai demain","trouve-moi un créneau libre lundi","je travaille de 8h à 17h"]],
   ["Planning","Rendez-vous chaque semaine, absences","agChat / agParse",["tous les lundis à 8h chantier Dupont","je suis en vacances du 20 au 27 décembre"]],
   ["Paiements","Paiements reçus (chèque, espèces, virement, carte)","faChat",["Dupont a payé 500 € par chèque","Dupont a tout payé"]],
   ["Paiements","Factures d'acompte et finale (PDF après paiement)","faChat",["facture d'acompte Dupont 30 %","facture finale Dupont"]],
   ["Paiements","Lien de paiement Stripe, relances","Stripe",["envoie le lien de paiement à Dupont","relance les impayés"]],
   ["Clients","Fiches clients, notes, historique","knownClient",["mes clients","fiche Dupont","note sur Dupont : il a un chien"]],
   ["Fournisseurs","Fournisseurs, commandes, prix","findSuppliers",["mon fournisseur de carrelage c'est Point P","commande 20 sacs de colle chez Point P","chez Point P la colle est à 25 € le sac"]],
   ["Pointage","Pointage chantier (et badge NFC)","pointage NFC",["j'arrive sur le chantier Dupont","j'ai fini","associe ce badge au chantier Dupont","mes heures"]],
   ["Métré","Métré d'une pièce","métré",["pièce de 4 par 3,5"]],
   ["Fichiers","Importer, exporter","import / export",["importe une facture fournisseur","exporte mes clients"]],
   ["Dictée","Note vocale « casô note » … « casô fin »","mot_reveil_dictee",["casô note","casô fin"]],
   ["Maquette 3D","Ajouter, enlever, déplacer, tourner, remplacer","doClause",["ajoute un canapé dans le séjour","déplace le canapé contre le mur","remplace le canapé par un fauteuil"]],
   ["Maquette 3D","Couleurs, sols, murs, façade, styles","colorFromText / floorFromText",["peins les murs du séjour en vert sauge","sol en marbre partout","style scandinave"]],
   ["Maquette 3D","Dimensions des meubles et des pièces","dimEdit / sizeOf",["le canapé fait 2,20 m de long","agrandis la table à 2 m","hauteur sous plafond 2,70 m"]],
   ["Maquette 3D","Étages, toit, jardin, terrain","toit / etage / outPos",["ajoute un étage","toit 4 pans en ardoise","fais un jardin autour avec un accès sur la route"]],
   ["Maquette 3D","Meubler, vider, situations, vues","situ / vue",["meuble toute la maison","il fait froid dans la chambre","vue de dessus"]],
   ["Maquette 3D","Envoyer la maquette au client","chatSendX",["envoie la maquette 3D à Dupont"]],
   ["Bricoleur","Liste de courses, budget, matériaux","courses",["il me faut quoi pour carreler 12 m²","ma liste de courses","demande de devis"]],
   ["Mémoire","Retenir, oublier, apprendre un mot","ulexLearn",["retiens : Dupont préfère être appelé le matin","retiens : lajota = carrelage","mémoire"]],
   ["Réglages","Mode, annuler, sauvegarde","système",["mode bricoleur","annule","sauvegarde"]]];

  /* ---------- import : lecture par colonnes avec mémoire du format par fournisseur ---------- */
  B.readTable=function(text,fournisseur){
    var lines=String(text||"").split(/\r?\n/).map(function(l){return l.trim();}).filter(Boolean);if(!lines.length)return {rows:[],fmt:null};
    var mem=fournisseur&&S.imports[hn(fournisseur)];
    var sep=mem?mem.sep:[";","\t",",","|"].map(function(s){return [s,lines.slice(0,10).filter(function(l){return l.split(s).length>=2;}).length];}).sort(function(a,b){return b[1]-a[1];})[0];
    sep=mem?sep:(sep[1]>=Math.min(3,lines.length)?sep[0]:"  ");
    var cells=lines.map(function(l){return (sep==="  "?l.split(/\s{2,}/):l.split(sep)).map(function(c){return c.trim().replace(/^"|"$/g,"");});});
    var num=function(c){var m=String(c).replace(/\s/g,"").replace(/€/g,"").replace(",",".").match(/^-?\d+(?:\.\d+)?(?=$|[^\d.])/);return m?parseFloat(m[0]):null;};
    var unitIn=function(c){var r=String(c||"").replace(/^[\s\d.,]+/,"").replace(/€|eur|ht|ttc|\/|par|le|la|l'/gi," ");return unitOf(hn(r));};
    var fmt=mem?mem.cols:null,head=cells[0].map(function(x){return hn(x);});
    var hcol=function(re){for(var j=0;j<head.length;j++)if(re.test(head[j]))return j;return null;};
    if(!fmt&&head.some(function(h){return /^(designation|libelle|article|description|produit|reference|ref)/.test(h);})){
      fmt={lib:hcol(/^(designation|libelle|article|description|produit)/),prix:hcol(/^(pu|p u|prix unitaire|prix u|prix ht|prix|tarif|unit price)/),qte:hcol(/^(qte|qt|quantite|quantity|nb|nombre)/),unite:hcol(/^(unite|u|unit)$/)};if(fmt.lib==null)fmt.lib=0;cells=cells.slice(1);}
    if(!fmt){var ncol=Math.max.apply(null,cells.map(function(r){return r.length;})),stats=[];
      for(var j=0;j<ncol;j++){var nums=cells.map(function(r){return num(r[j]);}).filter(function(x){return x!=null;}),txt=cells.filter(function(r){return r[j]&&num(r[j])==null&&/\p{L}{3,}/u.test(r[j]);}).length;stats.push({j:j,n:nums.length,txt:txt,ints:nums.filter(function(x){return x%1===0;}).length,avg:nums.length?nums.reduce(function(a,b){return a+b;},0)/nums.length:0});}
      var lib=stats.slice().sort(function(a,b){return b.txt-a.txt;})[0],numc=stats.filter(function(s){return s.n>=Math.max(1,cells.length*0.5)&&s.j!==lib.j;});
      var prix=numc.length?numc.slice().sort(function(a,b){return (b.ints<b.n?1:0)-(a.ints<a.n?1:0)||b.j-a.j;})[0]:null,qte=numc.filter(function(s){return !prix||s.j!==prix.j;}).sort(function(a,b){return b.ints-a.ints;})[0]||null;
      var unitCol=stats.filter(function(s){return cells.filter(function(r){return r[s.j]&&unitOf(hn(r[s.j]));}).length>=cells.length*0.5;})[0];
      fmt={lib:lib?lib.j:0,prix:prix?prix.j:null,qte:qte?qte.j:null,unite:unitCol?unitCol.j:null};}
    var rows=cells.map(function(r){var p=fmt.prix!=null?num(r[fmt.prix]):null;return {lib:r[fmt.lib]||"",qte:fmt.qte!=null?num(r[fmt.qte]):null,prix:p,unite:fmt.unite!=null?unitOf(hn(r[fmt.unite]||""))||r[fmt.unite]:(fmt.prix!=null?unitIn(r[fmt.prix]):null)};})
      .filter(function(x){return x.lib&&/\p{L}/u.test(x.lib)&&x.prix!=null&&!/^(total|tva|sous total|remise|net a payer|montant)/i.test(hn(x.lib));});
    return {rows:rows,fmt:{sep:sep,cols:fmt}};
  };
  B.importRows=function(rows,quoi,fournisseur,fmt){B.snapshot("import");var n=0;
    rows.forEach(function(x){if(quoi==="prix"){setService(x.lib,x.prix,unitOf(hn(x.unite||""))||null);n++;}
      else{S.fournPrix.push({fournisseur:cap(fournisseur||"Import"),article:hn(x.lib),prix:x.prix,unite:unitOf(hn(x.unite||""))||null,date:B.now().getTime()});n++;}});
    if(fournisseur&&quoi!=="prix"){X_["fournisseurs.ajouter"]({nom:fournisseur});if(fmt)S.imports[hn(fournisseur)]=fmt;}
    emit("fichiers","importer",{quoi:quoi,n:n,fournisseur:fournisseur||null});
    return quoi==="prix"?n+" prix ajoutés à tes services.":n+" prix notés pour "+cap(fournisseur||"ce fournisseur")+(fournisseur?" (je garde le format de ses factures pour la prochaine fois)":"")+".";};
  /* ---------- export CSV ---------- */
  B.csv=function(quoi){var q=function(v){v=v==null?"":String(v);return /[;"\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;},L=[],add=function(r){L.push(r.map(q).join(";"));};
    if(quoi==="clients"||quoi==="tout"){add(["Client","Téléphone","E-mail","Adresse","Payé (€)"]);Object.keys(S.clients).forEach(function(k){var c=S.clients[k];add([c.nom,c.tel,c.email,c.adresse,fnum(paid(k))]);});L.push("");}
    if(quoi==="devis"||quoi==="tout"){add(["Devis","Client","Statut","Libellé","Quantité","Unité","Prix unitaire HT","Total HT"]);S.devis.forEach(function(d){d.lignes.forEach(function(l){add([d.num,d.client?clientName(d.client):"",d.statut,l.libelle,fnum(l.quantite),l.unite,l.prix==null?"":fnum(l.prix),l.prix==null?"":fnum(l.prix*l.quantite)]);});});L.push("");}
    if(quoi==="prix"||quoi==="tout"){add(["Service","Prix HT","Unité"]);S.services.forEach(function(s){add([s.nom,s.prix==null?"":fnum(s.prix),s.unite]);});L.push("");}
    if(quoi==="paiements"||quoi==="tout"){add(["Date","Client","Montant","Mode"]);S.paiements.forEach(function(p){add([iso(new Date(p.date)),clientName(p.client),fnum(p.montant),p.mode]);});L.push("");}
    if(quoi==="fournisseurs"||quoi==="tout"){add(["Fournisseur","Article","Prix","Unité","Date"]);S.fournPrix.forEach(function(p){add([p.fournisseur,p.article,fnum(p.prix),p.unite||"",iso(new Date(p.date))]);});S.fournisseurs.forEach(function(f){if(!S.fournPrix.some(function(p){return p.fournisseur===f.nom;}))add([f.nom,f.specialite||"","","",""]);});L.push("");}
    if(quoi==="heures"||quoi==="tout"){add(["Jour","Client","Arrivée","Sortie","Heures"]);S.pointages.forEach(function(p){var a=new Date(p.debut),b=p.fin?new Date(p.fin):null;add([iso(a),p.client?clientName(p.client):"",ftime(a.getHours(),a.getMinutes()),b?ftime(b.getHours(),b.getMinutes()):"",b?fnum((p.fin-p.debut)/36e5):""]);});}
    return {filename:"caso-"+quoi+"-"+iso(B.now())+".csv",data:"﻿"+L.join("\r\n")};};

  /* =====================================================================
     Questions (réponse directe dans le chat), messages et appels aux clients,
     suppression d'une fiche client, confirmation avant tout envoi.
     ===================================================================== */
  /* « tu peux… », « est-ce que tu pourrais… » : ce sont des demandes, pas des questions */
  var QREQ=/^(?:est ce que |est ce qu )?(?:tu peux|tu pourrais|tu veux bien|peux tu|pourrais tu|vous pouvez|pouvez vous|peut on|on peut|je peux|je voudrais|j aimerais)\b(?! me dire| nous dire)/;
  var QWH=/^(?:(?:dis|donne|rappelle|indique) moi |(?:est ce que )?(?:tu peux|tu pourrais|peux tu|pourrais tu|tu sais) me dire |sais tu |je (?:voudrais|veux) savoir |dis moi )?(?:quel|quelle|quels|quelles|quand|combien|qui|ou|c est quoi|c est combien|c est quand|c est qui|a quelle heure|a combien|qu est ce que j ai|est ce que (?!tu (?:peux|pourrais|veux))|est ce qu (?!on peut)|ai je|suis je|y a t il|il y a combien)\b/;
  function isQ(c){return QWH.test(c.p)&&!QREQ.test(c.p);}
  B.isQuestion=function(raw){return isQ(ctxOf(raw));};
  function hm2(t){return t?pad(t.h)+":"+pad(t.m):null;}

  /* ---------- périodes : « ce mois-ci », « la semaine dernière », « en octobre »… ---------- */
  function periodeKey(n,def){
    if(/\b(aujourd hui|ce jour|de la journee|ma journee)\b/.test(n))return "jour";if(/\bhier\b/.test(n))return "hier";
    if(/\bsemaine (?:derniere|passee|precedente)\b/.test(n))return "semaine-1";if(/\bsemaine\b/.test(n))return "semaine";
    if(/\bmois (?:dernier|passe|precedent)\b/.test(n))return "mois-1";
    if(/\b(?:annee|an) (?:derniere|dernier|passee|passe)\b/.test(n))return "annee-1";if(/\b(cette annee|l annee|de l annee|depuis janvier|depuis le debut de l annee|annuel|cet an)\b/.test(n))return "annee";
    var mm=n.match(new RegExp("\\b("+MOIS.join("|")+")\\b"));if(mm)return "m"+MOIS.indexOf(mm[1]);
    if(/\bmois\b/.test(n))return "mois";return def||"mois";}
  function rangeOf(key){var t=sod(B.now()),y=t.getFullYear(),mo=t.getMonth(),f,e,lab;
    if(key==="jour"){f=t;e=addDays(t,1);lab=tr("aujourd’hui");}
    else if(key==="hier"){f=addDays(t,-1);e=t;lab=tr("hier");}
    else if(key==="semaine"||key==="semaine-1"){f=addDays(t,-((t.getDay()+6)%7));if(key==="semaine-1")f=addDays(f,-7);e=addDays(f,7);lab=key==="semaine"?tr("cette semaine"):tr("la semaine dernière");}
    else if(key==="mois-1"){f=new Date(y,mo-1,1);e=new Date(y,mo,1);lab=tr("en {0}",[moisNom(f.getMonth())]);}
    else if(key==="annee"){f=new Date(y,0,1);e=new Date(y+1,0,1);lab=tr("en {0}",[y]);}
    else if(key==="annee-1"){f=new Date(y-1,0,1);e=new Date(y,0,1);lab=tr("en {0}",[y-1]);}
    else if(/^m\d+$/.test(key)){var mi=+key.slice(1),yy=mi>mo?y-1:y;f=new Date(yy,mi,1);e=new Date(yy,mi+1,1);lab=tr("en {0}",[moisNom(mi)]);}
    else{f=new Date(y,mo,1);e=new Date(y,mo+1,1);lab=tr("ce mois-ci");}
    return {from:f.getTime(),to:e.getTime(),lab:lab};}

  /* ---------- questions ---------- */
  function parseAsk(c){
    var n=c.p,raw=c.raw,m,k=findClient(raw,c.n)||null,q=isQ(c),qn=qtys(stripTimes(n)).length,hasCt=Object.keys(contact(raw)).length>0,nom=k?clientName(k):null;
    var change=/\b(ajoute|rajoute|mets|met|cale|note|prends|planifie|bloque|reserve|decale|decaler|reporte|deplace|annule|avance|repousse|supprime|enleve|change|modifie)\b/;
    /* chiffre d'affaires, encaissements */
    if(/\b(chiffre d affaires?|mon ca|le ca|ca du mois|ca de la semaine|ca de l annee|mes gains|mes recettes|mes revenus|mes encaissements|combien j ai (?:gagne|encaisse|facture|touche|vendu|empoche|rentre|fait rentrer|fait)|j ai (?:gagne|encaisse|facture|touche) combien|combien (?:d argent )?(?:est )?rentre|combien ca m a rapporte|combien m a rapporte)\b/.test(n)&&!/\bheures?\b/.test(n))return [C("stats","ca",{periode:periodeKey(n)})];
    /* qui me doit de l'argent */
    if(/\b(qui me doit|qui (?:ne )?m a pas (?:encore )?paye|qui n a pas (?:encore )?(?:paye|regle)|qui doit (?:encore )?(?:me )?payer|impayes?|combien (?:on|ils|les clients) me doi(?:t|vent)|combien me doit on|ce qu on me doit|l argent qu on me doit|reste a encaisser|a encaisser|qui est en retard de paiement|retards? de paiement)\b/.test(n)&&!/\b(relance|relancer|rappelle|rappeler)\b/.test(n))return [C("factures","impayes",{})];
    if(k&&(q||/\?\s*$/.test(raw))&&/\b(a (?:tout |deja |bien |fini de )?(?:paye|regle)|a t (?:il|elle) (?:tout |deja |bien )?(?:paye|regle)|(?:il|elle) a (?:tout |deja |bien )?(?:paye|regle))\b/.test(n)&&!money(n))return [C("factures","impayes",{client:nom})];
    if(k&&/\b(combien (?:il |elle )?me doit|me doit (?:encore )?combien|me doit encore|me doit quoi|combien (?:il |elle )?(?:lui )?reste|reste a payer|il reste combien|a t (?:il|elle) (?:tout )?paye|est ce qu (?:il|elle) a (?:tout )?paye|(?:il|elle) a paye combien|a paye combien|combien (?:il |elle )?(?:m )?a (?:deja )?paye|ou en est (?:le|son) paiement|son solde|le solde)\b/.test(n))return [C("factures","impayes",{client:nom})];
    /* devis : total, nombre */
    if(/\bcombien (?:de|d) devis\b|\bcombien j ai de devis\b|\bnombre de devis\b/.test(n))return [C("devis","compte",{})];
    if(hasDevis.test(n)&&!qn&&!hasCt&&!change.test(n)&&(/\b(total|montant)\b/.test(n)||q&&/\b(combien|prix|cout|coute|monte|eleve|fait)\b/.test(n)||/\bdevis\b.*\b(fait|coute|monte) combien\b/.test(n)))return [C("devis","total",{client:nom})];
    /* prochain rendez-vous */
    if((/\b(prochain|prochaine|suivant|suivante)s?\b.*\b(rdv|rendez vous|chantier|intervention|visite|client)\b|\b(rdv|rendez vous)\b.*\b(prochain|suivant)\b/.test(n))&&!change.test(n)&&!parseTime(n))return [C("planning","prochain",{client:nom})];
    if((q||/^c est quand\b/.test(n))&&/\b(quand|a quelle heure|quel jour|c est quand)\b/.test(n)&&(/\b(rdv|rendez vous|chantier|intervention|visite)\b/.test(n)||k&&/\b(chez|avec|vois|passe|vais|voir)\b/.test(n))&&!/\b(libre|dispo|disponible)\b/.test(n)&&!change.test(n))return [C("planning","prochain",{client:nom})];
    /* suis-je libre tel jour, à telle heure */
    if(/\b(je suis libre|suis je libre|je suis dispo|suis je dispo|je suis disponible|suis je disponible|j ai quelque chose|j ai un rdv|j ai rdv|j ai un rendez vous|c est libre|c est pris|est ce libre|y a quelque chose|il y a quelque chose|je suis pris|suis je pris)\b/.test(n)&&(parseDate(n)||parseTime(n))&&!/\bquand\b/.test(n)&&(q||/\?\s*$/.test(raw)||/^(?:dis moi si|regarde si)\b/.test(n))){var d=parseDate(n),t=parseTime(n);return [C("planning","dispo",{date:d?iso(d):null,heure:hm2(t)})];}
    /* heures travaillées */
    if(/\b(combien d heures|j ai (?:fait|bosse|travaille|pointe) combien|combien (?:j ai )?(?:bosse|travaille|pointe)|mon temps de travail|total (?:de mes |des )?heures|heures (?:faites|travaillees|pointees))\b/.test(n))return [C("pointage","total",{periode:periodeKey(n,"semaine")})];
    /* fiche client : numéro, adresse, e-mail, notes */
    if(k&&!hasCt&&!qn&&/\b(numero|telephone|tel|portable|mobile|mail|e mail|email|adresse|habite|coordonnees|notes?|remarques?)\b/.test(n)&&!/\b(change|modifie|nouveau|nouvelle|c est le|est le|est au|mets a jour|ajoute|envoie|ecris|appelle|note sur|remarque sur|retiens)\b/.test(n)){
      var ch=/\b(mail|e mail|email)\b/.test(n)?"email":/\b(adresse|habite)\b/.test(n)?"adresse":/\b(notes?|remarques?)\b/.test(n)?"notes":/\bcoordonnees\b/.test(n)?"tout":"tel";
      return [C("clients","info",{nom:nom,champ:ch})];}
    if(k&&/\b(ou habite|habite ou|ou est le chantier|le chantier est ou|ou se trouve|c est ou)\b/.test(n))return [C("clients","info",{nom:nom,champ:"adresse"})];
    /* mon prix pour un service */
    if((m=n.match(/\b(?:quel est mon (?:prix|tarif)|c est quoi mon (?:prix|tarif)|mon (?:prix|tarif)|combien je (?:facture|prends|compte|fais payer|mets|vends)|je (?:facture|prends|compte|vends) combien|a combien je (?:facture|fais|vends|mets))\s+(?:pour |de |du |des |de la |de l |le |la |les |l )?(.+?)$/))&&!qn&&!/\b\d/.test(n)){var lab=cleanLabel(m[1]);if(lab)return [C("services","info",{nom:lab})];}
    if(q&&(m=n.match(/^(?:c est )?combien (?:coute |coutent |c est |pour |est |sont )?(?:le |la |les |l |un |une |mon |ma |mes )?(.+?)$/))&&!qn&&!hasDevis.test(n)&&!findEquip(n).length){var lab2=cleanLabel(m[1]);if(lab2&&findService(lab2))return [C("services","info",{nom:lab2})];}
    return null;}

  /* ---------- messages, appels ---------- */
  function cliIn(raw){var n=hn(raw),k=null,m=raw.match(/(?:^|\s)(?:à|a|au|aux|avec|chez)\s+(?:M\.\s*|Mme\s+|Monsieur\s+|Madame\s+)?(\p{Lu}[\p{L}'’-]+)/u);
    if(m&&!NOTNAME.test(m[1]))return clientKey(m[1]);
    k=findClient(raw,n);if(k)return k;
    m=raw.match(/^\s*(?:préviens|previens|prévenir|prevenir|avertis|avertir|informe|informer|appelle|appeler|rappelle|rappeler|textote|écris|ecris)\s+(?:M\.\s*|Mme\s+|Monsieur\s+|Madame\s+)?(\p{L}[\p{L}'’-]+)/iu);
    if(m&&!NOTNAME.test(m[1])&&!/^(le|la|les|lui|leur|moi|nous|tout|tous|un|une)$/i.test(m[1]))return clientKey(m[1]);
    return null;}
  function nextClientToday(){var now=B.now().getTime(),end=addDays(sod(B.now()),1).getTime(),r=S.rdv.filter(function(x){return x.client&&x.start+x.min*60000>=now&&x.start<end;})[0];return r?r.client:null;}
  /* troisième personne -> vouvoiement : « qu'il doit vider la pièce » -> « vous devez vider la pièce » */
  var VOUS=[[/^(?:il|elle) doit\b/i,"vous devez"],[/^(?:il|elle) peut\b/i,"vous pouvez"],[/^(?:il|elle) est\b/i,"vous êtes"],[/^(?:il|elle) a\b/i,"vous avez"],[/^(?:il|elle) va\b/i,"vous allez"],[/^(?:il|elle) sera\b/i,"vous serez"],[/^(?:il|elle) aura\b/i,"vous aurez"],[/^(?:il|elle) fait\b/i,"vous faites"],[/^(?:il|elle) devra\b/i,"vous devrez"],[/^(?:il|elle) pourra\b/i,"vous pourrez"],[/^(?:il|elle) (\p{L}{3,})e\b/iu,"vous $1ez"]];
  var HELLO={fr:"Bonjour, ",en:"Hello, ",es:"Hola, ",pt:"Olá, ",it:"Buongiorno, ",ro:"Bună ziua, ",pl:"Dzień dobry, ",tr:"Merhaba, ",ru:"Здравствуйте, ",ar:"مرحبا، "};
  function msgText(t,lang){lang=HELLO[lang]?lang:"fr";if(lang!=="fr"){t=String(t||"").trim().replace(/^[«"“]\s*|\s*[»"”]$/g,"");if(!t)return "";return HELLO[lang]+(lang==="ar"||lang==="ru"?t:t.charAt(0).toLowerCase()+t.slice(1))+(/[.?!]$/.test(t)?"":".");}
    t=String(t||"").trim().replace(/^[«"“]\s*|\s*[»"”]$/g,"").replace(/[\s.]+$/,"");if(!t)return "";
    t=t.replace(/^(?:lui |leur )?(?:dire |dis )?(?:que |qu['’]\s*)?/i,"").trim();if(!t)return "";
    for(var i=0;i<VOUS.length;i++)if(VOUS[i][0].test(t)){t=t.replace(VOUS[i][0],VOUS[i][1]);break;}
    t=t.replace(/\b(son|sa)\b/gi,"votre").replace(/\bses\b/gi,"vos").replace(/\blui\b/gi,"vous");
    if(/^(?:Je|J['’]|Le|La|Les|L['’]|On|Nous|Vous|Il|Elle|Ils|C['’]|Ce|Cette|Ça|Ca|Votre|Vos|Mon|Ma|Mes|Un|Une|Des|Demain|Aujourd|Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche|Tout|Pas|Merci|Bien|Pour|Si)\b/.test(t))t=t.charAt(0).toLowerCase()+t.slice(1);
    return HELLO.fr+t+(/[?!]$/.test(t)?"":".");}
  function rdvText(k,rappel){var now=B.now().getTime(),r=S.rdv.filter(function(x){return x.client===k&&x.start>=now;})[0];if(!r)return null;var d=new Date(r.start);
    return rappel?tr("Bonjour, petit rappel : notre rendez-vous est {0} à {1}.",[fdate(d),ftime(d.getHours(),d.getMinutes())]):tr("Bonjour, je vous confirme notre rendez-vous {0} à {1}.",[fdate(d),ftime(d.getHours(),d.getMinutes())]);}
  var PROCHE=/\b(?:ma|mon|mes|a ma|a mon)\s+(?:femme|mari|mere|pere|fils|fille|frere|soeur|copine|copain|pote|potes|ami|amie|amis|patron|collegue|associe|cousin|cousine|oncle|tante|famille|parents|maman|papa|compagne|compagnon|voisin|voisine)\b/;
  X_["sys.info"]=function(a){return R(a.texte||"");};
  function parseMsg(c){
    var n=c.p,raw=c.raw,m;
    /* « j'arrive dans 10 minutes », « je suis en retard » : prévenir le client du moment */
    if(/^(?:je suis en retard|j aurai du retard|j ai du retard|je vais etre en retard|je serai en retard|j arrive dans|je serai la dans|je suis la dans|je suis en route|je suis sur la route|je suis bloque dans les bouchons|je pars maintenant)\b/.test(n)){
      var k0=cliIn(raw)||nextClientToday()||S.last.client;if(!k0)return null;
      var body=raw.replace(new RegExp("\\s*(?:chez|pour|à|a)\\s+(?:M\\.?\\s*|Mme\\s+)?"+clientName(k0).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b","i"),"");
      return [C("clients","message",{nom:clientName(k0),canal:"sms",texte:msgText(body,c.lang)})];}
    if(/^(?:appelle|appeler|telephone a|telephoner a|rappelle|rappeler)\b/.test(n)&&PROCHE.test(n))return [C("sys","info",{texte:tr("Depuis casô, j’appelle seulement tes clients.")})];
    /* appeler un client */
    if(/^(?:appelle|appeler|telephone a|telephoner a|passe un coup de fil a|passe un coup de telephone a|rappelle|rappeler|compose le numero de)\b(?! moi\b)/.test(n)&&!/\b(paiement|payer|paye|facture|impaye|argent|regler|relance|rdv|rendez vous)\b/.test(n)){
      var k1=cliIn(raw)||(/\b(le|la|lui)\b/.test(n)?S.last.client:null);if(!k1&&!/^(?:appelle|appeler)\b/.test(n))return null;
      return [C("clients","appeler",{nom:k1?clientName(k1):null})];}
    var canal=/\b(mail|email|e mail|courriel)\b/.test(n)?"mail":/\bwhatsapp\b/.test(n)?"whatsapp":"sms";
    var hasCanal=/\b(sms|texto|message|whatsapp|mail|email|e mail|courriel)\b/.test(n),dire=/\b(previens|prevenir|avertis|avertir|informe|informer|fais savoir|fait savoir)\b|\b(?:dis|dire|ecris|ecrire|reponds|repondre)(?: a| au| lui| leur)\b/.test(n);
    if(!hasCanal&&!dire)return null;
    if(hasCanal&&!dire&&!/\b(envoie|envoyer|envoi|ecris|ecrire|fais|fait|textote|laisse|mets|redige|prepare)\b/.test(n))return null;
    var tm=raw.match(/^(.*?)(?:\s*:\s*|\s+pour (?:lui |leur )?(?:dire|annoncer|signaler|préciser|preciser|expliquer) (?:que |qu['’]\s*)?|\s+(?:que|qu['’]|that|che|că|ca|że|что)\s*)(.+)$/iu);
    var head=tm?tm[1]:raw,text=tm?tm[2].trim():"",h0=hn(head);
    if(/\b(devis|maquette|3d|facture|lien|pdf|plan|photos?)\b/.test(h0)&&!/\b(sms|texto|message|whatsapp)\b/.test(h0))return null;
    if(/\b(envoie|envoyer|ecris|dis|fais|fait)[ -]?moi\b/.test(h0))return null;
    if(PROCHE.test(h0))return [C("sys","info",{texte:tr("Depuis casô, j’écris seulement à tes clients.")})];
    var k2=cliIn(head)||(/\b(lui|leur|le|la)\b/.test(h0)?S.last.client:null);if(!k2)return null;
    var tx=text?msgText(text,c.lang):"";
    var o2={nom:clientName(k2),canal:canal,texte:tx};if(!tx&&(m=n.match(/\bpour (?:lui )?(confirmer|rappeler) (?:le |son |notre |leur |ce )?(?:rdv|rendez vous)\b/)))o2.rdv=m[1]==="rappeler"?"rappel":"confirmer";
    return [C("clients","message",o2)];}

  /* ---------- plusieurs clients dans un paiement ---------- */
  function modeOf(n){return /cheque/.test(n)?"chèque":/espece|liquide|cash/.test(n)?"espèces":/carte|cb/.test(n)?"carte":/virement|vire/.test(n)?"virement":null;}
  function payName(nm){var kk=findKey(nm)||clientKey(nm);return S.clients[kk]?clientName(kk):cap(nm);}
  function parsePay(c){var raw=c.raw,n=c.p,m,x;
    if(!/\b(paye|payee|payes|regle|reglee|vire|verse|donne|recu)\b/.test(n))return null;
    /* « Dupont a payé 250 € et Martin 150 € » */
    var pairs=[],re=/(\p{Lu}[\p{L}'’-]+)\s+(?:(?:m['’]\s*)?a\s+(?:payé|paye|réglé|regle|viré|vire|versé|verse|donné|donne)\s+)?(\d+(?:[.,]\d+)?)\s*(k\s*)?(?:€|euros?|balles)/gu;
    while((x=re.exec(raw)))if(!NOTNAME.test(x[1]))pairs.push([x[1],pnum(x[2])*(x[3]?1000:1)]);
    if(pairs.length>=2)return pairs.map(function(pp){return C("factures","paiement",{client:payName(pp[0]),montant:pp[1],mode:modeOf(n)});});
    /* « Dupont et Martin ont payé 200 € chacun » */
    if(!/\b(ont|m ont)\b/.test(n))return null;var head=raw.split(/\s+(?:ont|m['’]ont)\s+/)[0]||"",names=[],r2=/(\p{Lu}[\p{L}'’-]+)/gu;
    while((x=r2.exec(head)))if(!NOTNAME.test(x[1]))names.push(x[1]);if(names.length<2)return null;
    var mo=money(n);if(mo==null)return null;var cm=names.map(function(nm){return C("factures","paiement",{client:payName(nm),montant:mo,mode:modeOf(n)});});
    if(/\b(chacun|chacune|par personne|par tete|chaque)\b/.test(n))return cm;
    return [C("sys","confirmer",{texte:tr("C’est {0} chacun ?",[eur(mo)]),cmds:cm,non:tr("D’accord. Quel montant pour {0} et pour {1} ?",[names[0],names[1]])})];}
  X_["sys.confirmer"]=function(a){S.pending={type:"sure",cmds:a.cmds,raw:"",non:a.non||null};return R(a.texte);};

  /* ---------- lecture à voix haute ---------- */
  function parseLire(c){var n=c.p,m;
    if(/^(reponds|parle|parle moi|reponds moi|lis|lis moi)\s+(?:toujours\s+)?(?:a voix haute|a haute voix|en vocal|avec ta voix)$|^(active|allume|mets) (?:la voix|le mode vocal|la lecture)$|^mode (?:vocal|mains libres)$/.test(n))return [C("sys","voix",{on:true})];
    if(/^(tais toi|chut|silence|arrete de parler|ne parle plus|plus de voix|coupe la voix|desactive la voix|stop la voix|arrete la lecture)$/.test(n))return [C("sys","voix",{on:false})];
    if(!(m=n.match(/^(?:lis moi a voix haute|lis a voix haute|dis moi a voix haute|relis moi|lis moi|annonce moi|relis|lis)\s+(.+)$/)))return null;var r=m[1].trim();
    if(/^(?:ma journee|mon programme|mon planning du jour|aujourd hui|ce que j ai aujourd hui|mes rdv du jour)$/.test(r))r="qu est ce que j ai aujourd hui";
    else if(/^(?:ma journee de |mon programme de |mon planning de )?demain$/.test(r))r="qu est ce que j ai demain";
    else if(/^(?:ma semaine|mon planning de la semaine)$/.test(r))r="mon planning de la semaine";
    else if(/^(?:mes impayes|qui me doit|ce qu on me doit)$/.test(r))r="qui me doit";
    var cc=ctxOf(r),cm=localParse(cc);if(!cm||!askSafe(cm))return null;
    cm=cm.map(function(x){if(x.m==="devis"&&x.a==="total")x.args.detail=true;if(x.m==="devis"&&x.a==="ouvrir")return C("devis","total",{client:x.args.client||null,detail:true});return x;});
    return cm.concat([C("sys","lire",{})]);}
  X_["sys.lire"]=function(){return {say:"",ui:"lire"};};
  X_["sys.voix"]=function(a){S.voix=!!a.on;return {say:a.on?tr("D’accord, je te lis mes réponses."):tr("D’accord, je ne parle plus."),ui:"voix"};};

  /* ---------- supprimer une fiche client ---------- */
  function parseDel(c){var raw=c.raw,m;
    if((m=raw.match(/\b(?:supprime|supprimer|efface|effacer|enlève|enleve|retire|vire|dégage|degage)[sz]?(?:-moi)?\s+(?:le |la |l['’]\s*)?(?:fiche(?:\s+client)?\s+(?:de\s+|d['’]\s*)?|client(?:e)?\s+|contact\s+)(?:M\.\s*|Mme\s+|Monsieur\s+|Madame\s+)?([\p{L}'’-]+)/iu))||
       (m=raw.match(/\b(?:supprime|efface|enlève|enleve|retire|vire)\s+(?:M\.\s*|Mme\s+)?([\p{L}'’-]+)\s+(?:de|des)\s+(?:mes|la liste des|mon carnet de|la liste de mes)\s+clients\b/iu)))
      if(!NOTNAME.test(m[1]))return [C("clients","supprimer",{nom:cap(m[1])})];
    return null;}
  /* retrouver une fiche même écrite autrement (Ivanov / Иванова, Dupond / Dupont) */
  var CYR={"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"e","ж":"j","з":"z","и":"i","й":"i","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"ts","ч":"tch","ш":"ch","щ":"ch","ъ":"","ы":"y","ь":"","э":"e","ю":"iou","я":"ia"};
  function translit(s){return hn(s).replace(/[а-яё]/g,function(ch){return CYR[ch]||"";});}
  /* déclinaisons russes : « у Иванова » = chez Ivanov */
  function stem(s){var t=translit(s);if(/[а-яё]/i.test(s)){var r=t.replace(/(ogo|omu|oi|ou|ym|om|a|e|u|y)$/,"");if(r.length>=4)return r;}return t;}
  function stemKey(s){return stem(s);}
  function findKey(nom){if(!nom)return null;var k=clientKey(nom);if(S.clients[k])return k;var st=stem(nom),keys=Object.keys(S.clients);
    for(var i=0;i<keys.length;i++)if(stem(keys[i])===st&&st.length>=3)return keys[i];
    for(i=0;i<keys.length;i++)if(keys[i].length>=5&&E.dl(keys[i],translit(nom),1)<=1)return keys[i];return null;}
  B.findKey=findKey;B.translit=translit;

  /* ---------- exécution ---------- */
  function owes(k){var d=devisOf(k);if(!d)return null;var pd=paid(k);if(d.statut!=="validé"&&pd<=0)return null;var tot=totalTTC(d);return {devis:d,total:tot,paye:pd,reste:Math.max(0,Math.round((tot-pd)*100)/100)};}
  function relanceList(){return Object.keys(S.clients).filter(function(k){var o=owes(k);return o&&o.reste>0.009&&o.devis.statut==="validé";});}
  function dayRdv(d){var s=sod(d).getTime(),e=addDays(sod(d),1).getTime();return S.rdv.filter(function(r){return r.start>=s&&r.start<e;});}
  function rdvShort(r){var x=new Date(r.start);return ftime(x.getHours(),x.getMinutes())+" "+trw(r.titre)+(r.client?" · "+clientName(r.client):"");}
  function hfmt(h){var H=Math.floor(h+1e-9),mn=Math.round((h-H)*60);if(mn===60){H++;mn=0;}return H+" h"+(mn?" "+pad(mn):"");}
  B.dayRdv=dayRdv;B.rdvShort=rdvShort;
  X_["devis.total"]=function(a){var k=a.client?findKey(a.client)||clientKey(a.client):null,d=k?(S.devis.filter(function(x){return x.client===k&&x.lignes.length;}).slice(-1)[0]||null):getCur();
    if(!d)return R(k?tr("Je ne trouve pas de devis pour {0}.",[clientName(k)]):tr("Pas de devis en cours."));if(!d.lignes.length)return R(tr("Le devis {0}est vide.",[(d.client?tr("de {0} ",[clientName(d.client)]):"")]));
    var miss=d.lignes.filter(function(l){return l.prix==null;}).length,det=a.detail?" "+d.lignes.map(function(l){return l.libelle+" "+qty(l.quantite,l.unite,"").trim()+(l.prix!=null?tr(" à {0}",[eur(l.prix)]):"");}).join(", ")+".":"";
    return R(tr("Devis {0}({1}) : {2} HT, {3} TTC{4}.{5}{6}",[(d.client?tr("de {0} ",[clientName(d.client)]):""),d.statut,eur(totalHT(d)),eur(totalTTC(d)),(d.remise&&d.remise.valeur?tr(", remise comprise"):""),det,(miss?tr(" {0} ligne{1} sans prix.",[miss,(miss>1?"s":"")]):"")]));};
  X_["devis.compte"]=function(){var D=S.devis.filter(function(d){return d.lignes.length;});if(!D.length)return R(tr("Aucun devis pour l’instant."));var by={};D.forEach(function(d){by[d.statut]=(by[d.statut]||0)+1;});
    return R(tr("{0} devis : {1}.",[D.length,Object.keys(by).map(function(s){return by[s]+" "+trw(by[s]>1&&!/s$/.test(s)?s+"s":s);}).join(", ")]));};
  X_["planning.prochain"]=function(a){var k=a.client?findKey(a.client)||clientKey(a.client):null,now=B.now().getTime(),L=S.rdv.filter(function(r){return r.start+r.min*60000>now&&(!k||r.client===k);});
    if(!L.length)return R(k?tr("Aucun rendez-vous prévu avec {0}.",[clientName(k)]):tr("Aucun rendez-vous à venir."));var r=L[0],dd=Math.round((sod(new Date(r.start))-sod(B.now()))/864e5);
    return R((k?tr("Prochain rendez-vous avec {0}",[clientName(k)]):tr("Prochain rendez-vous"))+" : "+fmtRdv(r)+(dd===0?tr(" (aujourd’hui)"):dd===1?tr(" (demain)"):"")+".");};
  X_["planning.dispo"]=function(a){var d=fromIso(a.date)||sod(B.now());
    if(a.heure){var h=+a.heure.slice(0,2),mi=+a.heure.slice(3,5),s=new Date(d.getFullYear(),d.getMonth(),d.getDate(),h,mi).getTime(),e=s+(+a.duree_min||60)*60000,ab=absentAt(s,e),ov=overlaps(s,e);
      if(ab)return R(tr("Non : {0}, tu es indisponible ({1}).",[fdate(d),ab.motif]));if(ov.length)return R(tr("Non : {0}.",[fmtRdv(ov[0])]));return R(tr("Oui, {0} à {1} est libre.",[fdate(d),ftime(h,mi)]));}
    var ab2=absentAt(d.getTime(),addDays(d,1).getTime());if(ab2)return R(tr("{0} : indisponible ({1}).",[cap(fdate(d)),ab2.motif]));var L=dayRdv(d);
    return R(L.length?cap(fdate(d))+" : "+L.map(rdvShort).join(" ; ")+".":tr("Rien de prévu {0}.",[fdate(d)]));};
  var _po=X_["planning.ouvrir"];X_["planning.ouvrir"]=function(a){var r=_po(a);if(a.date&&!a.semaine){var d=fromIso(a.date),L=dayRdv(d);r.say=L.length?tr("{0} : {1}.",[cap(fdate(d)),L.map(rdvShort).join(" ; ")]):tr("Rien de prévu {0}.",[fdate(d)]);}return r;};
  X_["factures.impayes"]=function(a){
    if(a.client){var k=findKey(a.client)||clientKey(a.client),d=devisOf(k);if(!S.clients[k]&&!d)return R(tr("Je ne connais pas de client {0}.",[cap(a.client)]));
      if(!d)return R(tr("{0} n’a pas de devis : rien à payer pour l’instant.{1}",[clientName(k),(paid(k)?tr(" Déjà reçu : {0}.",[eur(paid(k))]):"")]));
      var tot=totalTTC(d),pd=paid(k),re=Math.max(0,Math.round((tot-pd)*100)/100);if(re<=0.009)return R(tr("{0} a tout payé ({1} TTC).",[clientName(k),eur(tot)]));
      return R(tr("{0} te doit encore {1} sur {2} TTC{3}{4}.",[clientName(k),eur(re),eur(tot),(pd?tr(" (déjà payé : {0})",[eur(pd)]):""),(d.statut!=="validé"?tr(". Devis pas encore signé par le client"):"")]));}
    var L=Object.keys(S.clients).map(function(k2){var o=owes(k2);return o&&o.reste>0.009?[k2,o.reste]:null;}).filter(Boolean).sort(function(x,y){return y[1]-x[1];});
    if(!L.length)return R(tr("Personne ne te doit d’argent."));var tot2=L.reduce(function(s,x){return s+x[1];},0);
    return R((L.length===1?tr("1 client te doit "):tr("{0} clients te doivent ",[L.length]))+eur(tot2)+" : "+L.map(function(x){return clientName(x[0])+" "+eur(x[1]);}).join(", ")+".");};
  X_["stats.ca"]=function(a){var r=rangeOf(a.periode||"mois"),P=S.paiements.filter(function(p){return p.date>=r.from&&p.date<r.to;}),enc=P.reduce(function(s,p){return s+p.montant;},0);
    var V=S.devis.filter(function(d){return d.statut==="validé"&&d.valideLe&&d.valideLe>=r.from&&d.valideLe<r.to;}),sig=V.reduce(function(s,d){return s+totalTTC(d);},0);
    return R(tr("{0} : {1} encaissés{2}{3}.",[cap(r.lab),eur(enc),(P.length?tr(" ({0} paiement{1})",[P.length,(P.length>1?"s":"")]):""),(V.length?tr(", {0} devis signé{1} pour {2} TTC",[V.length,(V.length>1?"s":""),eur(sig)]):"")]));};
  X_["pointage.total"]=function(a){var r=rangeOf(a.periode||"semaine"),now=B.now().getTime(),P=S.pointages.filter(function(p){return p.debut>=r.from&&p.debut<r.to;}),ms=P.reduce(function(s,p){return s+((p.fin||now)-p.debut);},0),open=S.pointages.filter(function(p){return !p.fin;})[0];
    return R(cap(r.lab)+" : "+hfmt(ms/36e5)+(P.length?tr(" ({0} pointage{1})",[P.length,(P.length>1?"s":"")]):"")+"."+(open?tr(" Tu es pointé depuis {0}{1}.",[ftime(new Date(open.debut).getHours(),new Date(open.debut).getMinutes()),(open.client?tr(" chez {0}",[clientName(open.client)]):"")]):""));};
  X_["services.info"]=function(a){var s=findService(a.nom||"");if(!s)return R(tr("Je n’ai pas de prix pour « {0} ».",[a.nom,a.nom]));
    return R(s.prix!=null?s.nom+" : "+eur(s.prix)+" / "+s.unite+".":tr("{0} : pas encore de prix.",[s.nom,s.nom.toLowerCase(),s.unite]));};
  X_["clients.info"]=function(a){var k=findKey(a.nom||""),c=k&&S.clients[k];if(!c)return R(tr("Je ne connais pas de client {0}.",[cap(a.nom||"")]));
    var ch=a.champ||"tout",lab={tel:"le numéro",email:"l’e-mail",adresse:"l’adresse"};
    if(ch==="notes")return R(c.notes&&c.notes.length?c.nom+" : "+c.notes.join(" · ")+".":tr("Pas de note sur {0}.",[c.nom]));
    if(ch==="tout"){var t=[c.tel,c.email,c.adresse].filter(Boolean);return R(t.length?c.nom+" : "+t.join(" · ")+".":tr("Je n’ai pas encore les coordonnées de {0}.",[c.nom]));}
    if(c[ch])return R(c.nom+" : "+c[ch]+".");S.pending={type:"contact",client:k,champ:ch};return R(ch==="adresse"?tr("Je n’ai pas encore l’adresse de {0}. Tu me la donnes ?",[c.nom]):ch==="email"?tr("Je n’ai pas encore l’e-mail de {0}. Tu me le donnes ?",[c.nom]):tr("Je n’ai pas encore le numéro de {0}. Tu me le donnes ?",[c.nom]));};
  X_["clients.message"]=function(a){var k=a.nom?(findKey(a.nom)||ensureClient(a.nom)):S.last.client;if(!k)return R(tr("À quel client ?"));S.last.client=k;var c=S.clients[k],canal=a.canal||"sms";
    if(!a.texte&&a.rdv){a=Object.assign({},a,{texte:rdvText(k,a.rdv==="rappel")});if(!a.texte)return R(tr("Je ne trouve pas de rendez-vous à venir avec {0}.",[clientName(k)]));}
    if(!a.texte){S.pending={type:"msg",cmd:{nom:clientName(k),canal:canal}};return R(tr("Qu’est-ce que je dis à {0} ?",[clientName(k)]));}
    var to=canal==="mail"?c.email:c.tel;
    if(!to){S.pending={type:"contact",client:k,champ:canal==="mail"?"email":"tel",then:C("clients","message",{nom:clientName(k),canal:canal,texte:a.texte})};return R(tr("Je n’ai pas {0} de {1}. Tu me le donnes ?",[(canal==="mail"?tr("l’e-mail"):tr("le numéro")),clientName(k)]));}
    var msg={id:id(),client:k,canal:canal,texte:a.texte,to:to,date:B.now().getTime(),statut:"préparé"};S.messages.push(msg);if(S.messages.length>200)S.messages.shift();emit("clients","message",msg);
    return {say:tr("{0} pour {1} : « {2} »",[(canal==="mail"?tr("E-mail"):canal==="whatsapp"?tr("WhatsApp"):tr("SMS")),clientName(k),a.texte]),ui:"message",msg:msg};};
  X_["clients.appeler"]=function(a){var k=a.nom?findKey(a.nom):S.last.client,c=k&&S.clients[k];if(!c)return R(a.nom?tr("Je ne connais pas de client {0}.",[cap(a.nom)]):tr("Qui veux-tu appeler ?"));S.last.client=k;
    if(!c.tel){S.pending={type:"contact",client:k,champ:"tel",then:C("clients","appeler",{nom:c.nom})};return R(tr("Je n’ai pas le numéro de {0}. Tu me le donnes ?",[c.nom]));}
    emit("clients","appel",{client:k});return {say:tr("Appeler {0} : {1}.",[c.nom,c.tel]),ui:"appel",tel:c.tel};};
  X_["clients.supprimer"]=function(a){var k=findKey(a.nom);if(!k)return R(tr("Je ne connais pas de client {0}.",[cap(a.nom||"")]));var nm=clientName(k),now=B.now().getTime(),fut=S.rdv.filter(function(r){return r.client===k&&r.start>=now;});
    S.rdv=S.rdv.filter(function(r){return fut.indexOf(r)<0;});S.archives[k]={nom:nm,le:now};delete S.clients[k];if(S.last.client===k)S.last.client=null;emit("clients","supprimer",{client:k});
    var nd=S.devis.filter(function(d){return d.client===k;}).length+S.paiements.filter(function(p){return p.client===k;}).length;
    return R(tr("Fiche de {0} supprimée{1}.{2}",[nm,(fut.length?tr(" ({0} rendez-vous à venir annulé{1})",[fut.length,(fut.length>1?"s":"")]):""),(nd?tr(" Ses devis et paiements restent dans l’historique."):"")]));};
  /* relance : un impayé, ou un devis envoyé qui attend la signature du client */
  function devisAttente(k){return S.devis.filter(function(d){return d.client===k&&d.statut==="envoyé";}).slice(-1)[0]||null;}
  var _rel=X_["factures.relance"];X_["factures.relance"]=function(a){if(a.client){var k=findKey(a.client)||clientKey(a.client),o=owes(k);
    if(!o||o.reste<=0.009){var dv=devisAttente(k);if(dv){S.relances.push({client:k,type:"devis",devis:dv.id,date:B.now().getTime()});emit("devis","relance",{client:k,devis:dv.id});return R(tr("Relance envoyée dans casô à {0} pour signer le devis {1}.",[clientName(k),dv.num]));}
      var br=S.devis.filter(function(d){return d.client===k&&d.statut==="brouillon"&&d.lignes.length;}).slice(-1)[0];
      return R(br?tr("Le devis de {0} n’a pas encore été envoyé : rien à relancer.",[clientName(k)]):tr("{0} ne te doit rien et n’a pas de devis en attente : pas de relance.",[clientName(k)]));}}return _rel(a);};

  /* ---------- confirmation avant d'envoyer, de supprimer ou de solder ---------- */
  var SENS={"devis.envoyer":1,"scene.envoyer":1,"factures.lien":1,"factures.relance":1,"clients.supprimer":1};
  function sensitive(x){var k=x.m+"."+x.a;return !!SENS[k]||k==="factures.paiement"&&x.args&&x.args.montant==="reste";}
  /* la question à poser, ou null quand l'action sera de toute façon refusée (rien à envoyer, rien à payer…) */
  function sureText(x){var a=x.args||{},k,d;
    switch(x.m+"."+x.a){
      case "devis.envoyer":d=getCur();if(!d||!d.lignes.length||d.lignes.some(function(l){return l.prix==null;})||!d.sig.artisan)return null;return tr("J’envoie le devis {0}{1} ({2} TTC) pour signature ?",[d.num,(d.client?tr(" à {0}",[clientName(d.client)]):""),eur(totalTTC(d))]);
      case "scene.envoyer":k=a.client?clientKey(a.client):(getCur()&&getCur().client)||S.last.client;if(!k)return null;return tr("J’envoie la maquette 3D à {0} ?",[clientName(k)]);
      case "factures.lien":k=a.client?clientKey(a.client):S.last.client;if(!k)return null;d=devisOf(k);var mt=a.montant!=null?+a.montant:Math.max(0,(d?totalTTC(d):0)-paid(k));if(!mt)return null;return tr("J’envoie à {0} un lien de paiement de {1} ?",[clientName(k),eur(mt)]);
      case "factures.relance":var ks=a.client?[findKey(a.client)||clientKey(a.client)]:relanceList();ks=ks.filter(function(kk){var o=owes(kk);return o&&o.reste>0.009||a.client&&devisAttente(kk);});if(!ks.length)return null;
        return tr("Je relance {0} ?",[ks.map(function(kk){var o=owes(kk);return o&&o.reste>0.009?tr("{0} ({1} à payer)",[clientName(kk),eur(o.reste)]):tr("{0} (devis {1} à signer)",[clientName(kk),devisAttente(kk).num]);}).join(", ")]);
      case "clients.supprimer":k=findKey(a.nom);if(!k)return null;return tr("Je supprime la fiche de {0} ?{1}",[clientName(k),(S.devis.some(function(dv){return dv.client===k;})?tr(" Ses devis et paiements restent dans l’historique."):"")]);
      case "factures.paiement":k=a.client?findKey(a.client)||clientKey(a.client):null;d=k&&devisOf(k);if(!d)return null;var rs=Math.round((totalTTC(d)-paid(k))*100)/100;if(rs<=0)return null;return tr("J’enregistre le solde de {0} : {1} ?",[clientName(k),eur(rs)]);}
    return null;}
  B.sensitive=sensitive;B.sureText=sureText;

  var D3={"devis.total":function(a){return tr("Total du devis{0}",[(a.client?tr(" de {0}",[clientName(clientKey(a.client))]):"")]);},"devis.compte":function(){return tr("Nombre de devis");},
    "planning.prochain":function(a){return tr("Prochain rendez-vous{0}",[(a.client?tr(" avec {0}",[a.client]):"")]);},
    "planning.dispo":function(a){return tr("Disponibilité{0}{1}",[(a.date?" "+fdate(fromIso(a.date)):""),(a.heure?tr(" à {0}",[ftime(+a.heure.slice(0,2),+a.heure.slice(3,5))]):"")]);},
    "factures.impayes":function(a){return a.client?tr("Ce que me doit {0}",[a.client]):tr("Qui me doit de l’argent");},"stats.ca":function(a){return tr("Encaissements {0}",[rangeOf(a.periode||"mois").lab]);},
    "clients.info":function(a){return tr("{0} de {1}",[({tel:tr("Numéro"),email:tr("E-mail"),adresse:tr("Adresse"),notes:tr("Notes"),tout:tr("Coordonnées")}[a.champ]||tr("Fiche")),(a.nom||tr("client"))]);},
    "pointage.total":function(a){return tr("Heures travaillées {0}",[rangeOf(a.periode||"semaine").lab]);},"services.info":function(a){var sv=findService(a.nom||"");return tr("Mon prix pour « {0} »",[(sv?sv.nom.toLowerCase():a.nom)]);},
    "clients.message":function(a){return tr("{0} à {1}",[(a.canal==="mail"?tr("E-mail"):a.canal==="whatsapp"?tr("WhatsApp"):tr("SMS")),(a.nom||tr("client"))]);},"clients.appeler":function(a){return tr("Appeler {0}",[(a.nom||tr("le client"))]);},
    "clients.supprimer":function(a){return tr("Supprimer la fiche de {0}",[(a.nom||tr("client"))]);},
    "memoire.desapprendre":function(a){return a.dernier?tr("Oublier la dernière phrase apprise"):tr("Oublier « {0} »",[a.texte]);},"sys.lire":function(){return "";},"sys.voix":function(){return "";},"sys.info":function(){return "";},"sys.confirmer":function(){return "";}};
  var _dx=B.describeExtra;B.describeExtra=function(c){var f=D3[c.m+"."+c.a];return f?f(c.args||{}):_dx(c);};
  B.FONCTIONS.push(
   ["Questions","Total d’un devis, qui me doit, chiffre du mois","réponse directe",["quel est le total du devis de Dupont ?","qui me doit de l’argent ?","combien j’ai encaissé ce mois-ci ?"]],
   ["Questions","Prochain rendez-vous, disponibilités, heures faites","réponse directe",["quand est mon prochain rdv ?","je suis libre demain à 14h ?","combien d’heures cette semaine ?"]],
   ["Questions","Numéro, adresse, prix d’un service","réponse directe",["c’est quoi le numéro de Dupont ?","Dupont habite où ?","quel est mon prix pour le carrelage ?"]],
   ["Clients","SMS, e-mail, appel","message",["envoie un SMS à Dupont pour lui dire que j’arrive","préviens Martin que le chantier commence lundi","appelle Dupont"]],
   ["Clients","Supprimer une fiche (avec confirmation)","clients",["supprime le client Martin"]]);
  /* ---------- devis prêt : le chat lit la base de prix et les modèles, choisit le meilleur pour le client et prépare le devis ----------
     « fais un devis pour mon prochain travail », « prépare le devis pour Mme Martin », « devis pour mon prochain rdv »
     Les modèles viennent de trois sources : ceux que l'artisan a enregistrés (« enregistre ce devis comme modèle salle de bain »),
     ses anciens devis, et des modèles par métier qui ne servent que de données au chat. Les styles visuels restent dans le module devis. */
  var MODELES0=[
    {nom:"Salle de bain",mots:"salle de bain sdb douche baignoire faience carrelage lavabo vasque wc sanitaire receveur",lignes:[["Dépose de l’existant",1,"forfait"],["Carrelage sol",6,"m²"],["Faïence",18,"m²"],["Receveur de douche",1,"u"],["Plomberie",1,"forfait"],["Main d’œuvre",24,"h"]]},
    {nom:"Carrelage sol",mots:"carrelage carreler sol carreau carreaux dalle chape ragreage",lignes:[["Ragréage",20,"m²"],["Carrelage",20,"m²"],["Plinthes",16,"ml"],["Main d’œuvre",16,"h"]]},
    {nom:"Peinture",mots:"peinture peindre repeindre murs mur plafond chambre salon sejour enduit",lignes:[["Préparation des murs",40,"m²"],["Peinture",40,"m²"],["Peinture plafond",12,"m²"],["Main d’œuvre",14,"h"]]},
    {nom:"Cuisine",mots:"cuisine credence evier plan de travail electromenager meubles",lignes:[["Dépose de l’existant",1,"forfait"],["Pose des meubles",1,"forfait"],["Crédence",4,"m²"],["Plomberie",1,"forfait"],["Main d’œuvre",20,"h"]]},
    {nom:"Cloison placo",mots:"placo placoplatre cloison plaque platre doublage isolation ba13",lignes:[["Cloison placo",15,"m²"],["Bandes et enduit",15,"m²"],["Main d’œuvre",10,"h"]]},
    {nom:"Parquet",mots:"parquet stratifie plancher bois",lignes:[["Sous-couche",20,"m²"],["Parquet",20,"m²"],["Plinthes",18,"ml"],["Main d’œuvre",12,"h"]]}];
  var MVIDE={de:1,du:1,des:1,la:1,le:1,les:1,un:1,une:1,et:1,pour:1,chez:1,avec:1,sur:1,en:1,au:1,aux:1,fais:1,faire:1,prepare:1,devis:1,mon:1,ma:1,mes:1,prochain:1,prochaine:1,travail:1,chantier:1,rdv:1,rendez:1,vous:1,client:1,cliente:1,madame:1,monsieur:1,mme:1,mr:1,main:1,oeuvre:1,forfait:1};
  function motsDe(t){var o={};hn(String(t||"")).split(" ").forEach(function(w){if(w.length>=3&&!MVIDE[w]&&!/^\d/.test(w))o[w.length>5?w.slice(0,5):w]=1;});return o;}
  function communs(a,b){var n=0;Object.keys(a).forEach(function(w){if(b[w])n++;});return n;}
  /* le prochain rendez-vous avec un client */
  function prochainRdv(k){var now=B.now().getTime();return S.rdv.filter(function(r){return r.start>=now-30*60000&&r.client&&(!k||r.client===k);}).sort(function(a,b){return a.start-b.start;})[0]||null;}
  /* tous les modèles possibles, notés pour ce client */
  function modelesPour(k,texte,rdv){var c=k&&S.clients[k],ctx=motsDe([texte,rdv&&rdv.titre,c&&(c.notes||[]).join(" ")].join(" ")),L=[];
    (S.modeles||[]).forEach(function(m){L.push({nom:m.nom,lignes:m.lignes.map(function(l){return [l.libelle,l.quantite,l.unite,l.prix];}),mots:m.nom+" "+m.lignes.map(function(l){return l.libelle;}).join(" "),src:"modele",n:m.n||0});});
    S.devis.forEach(function(d){if(!d.lignes.length)return;L.push({nom:d.modele||d.num,lignes:d.lignes.map(function(l){return [l.libelle,l.quantite,l.unite,l.prix];}),mots:(d.modele||"")+" "+d.lignes.map(function(l){return l.libelle;}).join(" "),src:"devis",client:d.client,at:d.created||0});});
    MODELES0.forEach(function(m){L.push({nom:m.nom,lignes:m.lignes,mots:m.nom+" "+m.mots,src:"metier"});});
    var tot=L.length;L.forEach(function(m,i){var mw=motsDe(m.mots),prix=m.lignes.filter(function(l){return l[3]!=null||findService(l[0]);}).length/Math.max(1,m.lignes.length);
      m.ctx=communs(ctx,mw);m.score=m.ctx*3+(m.client&&m.client===k?3:0)+(m.src==="modele"?1.5+Math.min(1,(m.n||0)/5):m.src==="devis"?0.5+i/tot*0.4:0)+prix*2;});
    return L.sort(function(a,b){return b.score-a.score;});}
  /* remplir le devis à partir du modèle choisi : les prix de la base d'abord, sinon ceux du modèle */
  function devisDepuis(k,m){var d=newDevis(k);d.modele=m.nom;if(S.maSignature)d.sig.artisan=S.maSignature;if(d.sig.artisan)d.statut="signé";
    m.lignes.forEach(function(l){var sv=findService(l[0]),p=sv&&sv.prix!=null?sv.prix:(l[3]!=null?l[3]:null);d.lignes.push({libelle:l[0],quantite:l[1],unite:l[2]||"forfait",prix:p});});
    if(m.src==="modele")(S.modeles||[]).forEach(function(x){if(x.nom===m.nom)x.n=(x.n||0)+1;});return d;}
  X_["devis.preparer"]=function(a){var k=a.client?ensureClient(a.client):null,rdv=null;
    if(!k&&a.prochain){rdv=prochainRdv(null);if(!rdv)return R(tr("Aucun rendez-vous à venir avec un client."));k=rdv.client;}
    if(!k){S.pending={type:"complete",base:"fais un devis pour"};return R(tr("Pour quel client ?"));}
    if(!rdv)rdv=prochainRdv(k);var L=modelesPour(k,a.texte||"",rdv);
    /* rien ne dit de quel travail il s'agit (ni les mots, ni le rendez-vous, ni un ancien devis du client) : on demande */
    if(!L.length||!L[0].ctx&&L[0].client!==k){
      /* déjà demandé juste avant : pas de deuxième question, on le dit simplement */
      if(S.prepDemande&&Date.now()-S.prepDemande<5*60000){S.prepDemande=0;return R(tr("Je n’ai pas de modèle pour ce travail."));}
      S.prepDemande=Date.now();S.pending={type:"complete",base:"fais un devis pour "+clientName(k)};return R(tr("Pour quel travail ?"));}
    S.prepDemande=0;
    var d=devisDepuis(k,L[0]),manque=d.lignes.filter(function(l){return l.prix==null;}).map(function(l){return l.libelle;});S.last.client=k;
    emit("devis","preparer",{id:d.id,client:clientName(k),modele:d.modele});
    return {say:manque.length?tr("Il manque ton prix pour : {0}.",[manque.join(", ")]):"",ui:"devis-carte",devis:d.id};};
  X_["devis.modele"]=function(a){var d=getCur();if(!d||!d.lignes.length)return R(tr("Il n’y a pas de devis à enregistrer comme modèle."));var nom=cap(String(a.nom||d.modele||(d.client?clientName(d.client):d.num)).trim());
    S.modeles=(S.modeles||[]).filter(function(m){return hn(m.nom)!==hn(nom);});S.modeles.push({nom:nom,lignes:clone(d.lignes),n:0,at:Date.now()});d.modele=nom;emit("devis","modele",{nom:nom});
    return R(tr("Modèle « {0} » enregistré.",[nom]));};
  /* « fais un devis pour mon prochain travail », « prépare le devis de Mme Martin » (sans lignes : le chat choisit le modèle) */
  function parsePreparer(c){var n=c.p;if(!/\bdevis\b/.test(n)||/\b(nouveau|nouvelle|envoie|envoyer|ouvre|montre|affiche|signe|valide|refuse|relance|supprime|duplique|dupliquer|copie|copier|lis|combien|total|mes devis)\b/.test(n))return null;
    if(qtys(stripTimes(n)).length||money(n)!=null)return null;
    var veut=/\b(fais|fait|faire|fais moi|prepare|preparer|prepare moi|etablis|redige|monte|cree|creer|sors|propose|je veux|il me faut)\b/.test(n),proch=/\bprochain(?:e)?s?\s+(?:travail|travaux|chantier|rdv|rendez vous|client|cliente|intervention|visite|job)\b/.test(n);
    if(!veut&&!proch)return null;var k=findClient(c.raw,c.n);if(!proch&&!k)return null;
    if(proch&&!k){var rv=prochainRdv(null);if(rv)k=rv.client;}
    return [C("devis","preparer",{client:k?(S.clients[k]?clientName(k):cap(k)):null,prochain:proch&&!k,texte:c.p})];}
  function parseModele(c){if(!/\b(?:enregistre|garde|sauve|sauvegarde|memorise)\b.*\b(?:comme|en)\s+modele\b/.test(c.p))return null;var m=String(c.raw).match(/(?:comme|en)\s+mod[èe]le\b\s*(?:de\s+|d[’']\s*|pour\s+|:\s*)?(.*)$/i);
    return [C("devis","modele",{nom:m&&m[1].trim()?m[1].trim().replace(/[.!]+$/,""):null})];}
  /* données de la carte affichée dans la conversation */
  B.devisCarte=function(id){var d=S.devis.filter(function(x){return x.id===id;})[0];if(!d)return null;
    return {id:d.id,num:d.num,client:d.client?clientName(d.client):null,modele:d.modele||null,statut:d.statut,signe:!!d.sig.artisan,
      lignes:d.lignes.map(function(l){return {libelle:l.libelle,quantite:l.quantite,unite:l.unite,prix:l.prix,total:l.prix==null?null:Math.round(l.prix*l.quantite*100)/100};}),
      ht:totalHT(d),ttc:totalTTC(d),manque:d.lignes.some(function(l){return l.prix==null;})};};
  /* envoi par lien casô, après la vérification d'identité faite par l'appli (Face ID) */
  B.envoyerDevis=function(id,opts){opts=opts||{};var d=S.devis.filter(function(x){return x.id===id;})[0];if(!d)return {ok:false,say:tr("Je ne trouve pas ce devis.")};
    if(!d.client)return {ok:false,say:tr("Ce devis n’a pas de client.")};
    if(d.lignes.some(function(l){return l.prix==null;}))return {ok:false,say:tr("Il manque des prix sur ce devis : je ne l’envoie pas."),screen:"devis"};
    if(!d.sig.artisan&&S.maSignature)d.sig.artisan=S.maSignature;if(!d.sig.artisan)return {ok:false,say:tr("Le devis doit d’abord porter ta signature."),screen:"signature"};
    B.snapshot(tr("Envoyer le devis au client"));d.statut="envoyé";if(d.tva==null)d.tva=S.tva;d.envoyeLe=B.now().getTime();
    d.jeton=d.jeton||(Date.now().toString(36)+Math.random().toString(36).slice(2,10));d.lien=(opts.base||"")+d.jeton;
    var c=S.clients[d.client]||{};emit("devis","envoyer",{id:d.id,client:clientName(d.client),lien:d.lien,mode:"lien",tel:c.tel||null,email:c.email||null,verifie:opts.verifie||null});
    log("envoi par lien "+d.num,[C("devis","envoyer",{id:d.id})],"carte");S.cur=d.id;
    return {ok:true,say:tr("Devis envoyé à {0} : il le signera dans casô.",[clientName(d.client)]),lien:d.lien};};

  /* ---------- apprentissage des mots ---------- */
  function learnWord(mot,sens){
    var w=hn(mot),sn=hn(sens);if(!w||!sn)return tr("Il me faut le mot et son sens.");
    var t=resolveType(sens);if(t&&findEquip(sn).length&&findEquip(sn)[0].len>=sn.length-3){S.syn[w]=t;buildEq();return tr("Retenu : « {0} » = {1} (maquette 3D).",[mot,TYPES[t].fr.toLowerCase()]);}
    var r=findRoom(sn);if(r&&r.len>=sn.length-3){S.roomw[w]=r.id;buildRooms();return tr("Retenu : « {0} » = {1}.",[mot,roomLabel(r.id).toLowerCase()]);}
    var c=findColor(sn);if(c&&c.len>=sn.length-3){S.colw[w]=[c.name,c.hex];buildColors();return tr("Retenu : « {0} » = {1}.",[mot,c.name]);}
    var a=E.analyze(sens);if(a.mentions.length&&norm(sens).split(" ").length<=4){var ci=a.mentions[0].c;E.addAlias(ci,mot,"perso");return tr("Retenu : « {0} » = {1}.",[mot,E.concepts[ci].fr]);}
    E.addConcept(mot,sens);return tr("Retenu : « {0} » veut dire « {1} ».",[mot,sens]);
  }
  B.learnWord=learnWord;
  /* langue de l'interface : donnée par l'écran de connexion de casô (window.casoConfig.langue, ou réglage enregistré) */
  /* hors français : pas d’espace avant « : ; ! ? » (typographie française) */
  function typoS(s){return typeof s==="string"?s.replace(/[ \u00a0\u202f]+([:;!?])(?=[\s.,)\]»”"]|$)/g,"$1"):s;}
  function typo(r){if(LANG==="fr"||PSEUDO||!r)return r;if(typeof r==="string")return typoS(r);if(Array.isArray(r.says))r.says=r.says.map(typoS);if(typeof r.explain==="string")r.explain=typoS(r.explain);if(typeof r.say==="string")r.say=typoS(r.say);return r;}
  B.setLangue=function(l){l=String(l||"fr").slice(0,2).toLowerCase();LANG=LOC[l]?l:"fr";NFC={};return LANG;};
  B.langue=function(){return LANG;};B.addCatalog=function(l,cat){I18N[l]=Object.assign(I18N[l]||{},cat||{});};
  B.tr=tr;B.trw=trw;B.trRoom=trRoom;B._pseudo=function(on,keys){PSEUDO=!!on;PKEYS=on?keys||null:null;};
  B.fdateL=fdate;B.eurL=eur;B.fnumL=fnum;B.ftimeL=ftime;B.moisNom=moisNom;B.eurFr=eurFr;B.fnumFr=fnumFr;B.fdateFr=fdateFr;
  /* désapprendre une phrase ou un mot appris par erreur */
  function unlearn(a){var gone=[];
    if(a.dernier){var lk=S.lastLearned;if(lk&&S.phrases[lk]){gone.push(S.phrases[lk].ex||lk);delete S.phrases[lk];}S.lastLearned=null;PV=null;return gone.length?tr("Oublié : « {0} ».",[gone[0]]):tr("Je n’ai rien appris récemment.");}
    var t=String(a.texte||"").trim(),c=ctxOf(t),mk=mask(c),h0=hn(t);
    Object.keys(S.phrases).forEach(function(k){var e=S.phrases[k];if(k===mk.m||e.ex&&hn(e.ex)===h0){gone.push(e.ex||k);delete S.phrases[k];}});
    var w=h0;[S.lex,S.syn,S.roomw,S.colw].forEach(function(o){if(o&&o[w]!=null){delete o[w];gone.push(w);}});Object.keys(S.lex).forEach(function(k){if(S.lex[k]===w&&k.length>2){}});
    if(gone.length){PV=null;VOC=null;try{buildEq();buildRooms();buildColors();buildEqLex();}catch(e){}}
    return gone.length?tr("Oublié : « {0} ». La prochaine fois, je te demanderai.",[t]):tr("Je n’avais rien appris pour « {0} ».",[t]);}
  B.unlearn=unlearn;

  /* ---------- annulation universelle ---------- */
  var KEEP=["phrases","journal","unrec","neg","syn","roomw","colw","lex","iaLLM","prev","prevs"],HIST=[],REDO=[];
  function snap(){var o={};Object.keys(S).forEach(function(k){if(KEEP.indexOf(k)<0)o[k]=S[k];});return JSON.stringify(o);}
  function restore(js){var o=JSON.parse(js);Object.keys(o).forEach(function(k){S[k]=o[k];});}
  B.snapshot=function(desc){HIST.push({s:snap(),d:desc||""});if(HIST.length>30)HIST.shift();REDO=[];};
  function undo(){var h=HIST.pop();if(!h)return null;REDO.push({s:snap(),d:h.d});restore(h.s);return h.d||"la dernière action";}
  function redo(){var h=REDO.pop();if(!h)return null;HIST.push({s:snap(),d:h.d});restore(h.s);return h.d||"l’action";}
  var READONLY=/\.(ouvrir|liste|info|vue|libre|pdf|total|compte|prochain|dispo|impayes|appeler)$|^stats\.|^sys\.|^memoire\.(?:ouvrir|desapprendre)$|^signature\.ouvrir$|^projet\.|^bibliotheque\.|^fichiers\.|^dictee\.|^pointage\.nfc$/;
  function mutating(cmds){return cmds.some(function(c){return !READONLY.test(c.m+"."+c.a)||c.m==="sys"&&c.a==="mode";});}

  /* ---------- base de phrases apprises ---------- */
  function nums(n){return (n.match(/\d+(?:\.\d+)?/g)||[]).map(Number);}
  function capName(raw){var w=raw.split(/\s+/);for(var i=0;i<w.length;i++){var x=w[i].replace(/[^\p{L}'’-]/gu,"");if(i===0&&(vocab()[hn(x)]||E.isStop(norm(x))||E.isKnown(norm(x))&&!/^(m'|m’|a$|nous|vient|est|doit|veut|habite|pay|regl|vir|vers|accept|refus|sign)/i.test(w[1]||"")))continue;if(/^\p{Lu}\p{Ll}+/u.test(x)&&!E.isStop(norm(x))&&!NOTNAME.test(x)&&x.length>2&&!findEquip(hn(x)).length&&!findRoom(hn(x)))return clientKey(x);}return null;}
  function mask(c){var k=findClient(c.raw,c.n)||capName(c.raw),m=" "+c.n+" ";if(k)m=m.replace(wordRe(k),"$1@c");
    m=m.replace(/\b(demain|apres demain|aujourd hui|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/g,"@d").replace(new RegExp("\\b("+MOIS.join("|")+")\\b","g"),"@m");
    return {m:m.replace(/\d+(?:\.\d+)?/g,"#").replace(/\s+/g," ").trim(),k:k};}
  function template(cmds,c,mk){var N=nums(c.n),k=mk.k,s=JSON.stringify(cmds);
    var o=JSON.parse(s,function(key,v){if(typeof v==="number"){var i=N.indexOf(v);if(i>=0)return {$n:i};}
      if(typeof v==="string"){if(k&&clientKey(v)===k)return {$c:1};if(key==="date"&&/^\d{4}-/.test(v))return {$d:Math.round((fromIso(v)-sod(B.now()))/864e5)};if(key==="heure")return {$h:v};}return v;});
    return JSON.stringify(o);}
  function fill(t,c,mk){var N=nums(c.n),ok=true,d=parseDate(c.p),tm=parseTime(stripTimes(c.p)===c.p?"":c.p);
    var o=JSON.parse(t,function(key,v){if(v&&typeof v==="object"&&!Array.isArray(v)){
      if("$n" in v){if(N[v.$n]==null){ok=false;return null;}return N[v.$n];}
      if("$c" in v){if(!mk.k){ok=false;return null;}return S.clients[mk.k]?clientName(mk.k):cap(mk.k);}
      if("$d" in v)return iso(d||addDays(sod(B.now()),v.$d));
      if("$h" in v){return tm?pad(tm.h)+":"+pad(tm.m):v.$h;}}return v;});
    return ok?o:null;}
  function remember(c,cmds,src,prov){if(!cmds||!cmds.length||cmds.every(function(x){return x.m==="sys";}))return;var mk=mask(c);if(!mk.m||mk.m.length<2)return;
    var e=S.phrases[mk.m];S.phrases[mk.m]={t:template(cmds,c,mk),n:(e?e.n:0)+1,src:src,ex:c.raw,at:Date.now()};if(prov)S.phrases[mk.m].p=1;if(src!=="local")S.lastLearned=mk.m;
    var keys=Object.keys(S.phrases);if(keys.length>800){keys.sort(function(a,b){return S.phrases[a].at-S.phrases[b].at;});delete S.phrases[keys[0]];}PV=null;}
  var PV=null;
  function recall(c){var mk=mask(c),e=S.phrases[mk.m],via="memoire";
    if(!e){if(!PV)PV=Object.keys(S.phrases).filter(function(k){return S.phrases[k].src!=="local";}).map(function(k){return [k,E.embed(k)];});
      var q=E.embed(mk.m),best=null,bs=0,hc=(mk.m.match(/#/g)||[]).length;
      PV.forEach(function(p){if((p[0].match(/#/g)||[]).length!==hc||(p[0].indexOf("@c")>=0)!==(mk.m.indexOf("@c")>=0))return;var s=0;for(var i=0;i<q.length;i++)s+=q[i]*p[1][i];if(s>bs){bs=s;best=p[0];}});
      if(best&&bs>=0.9){e=S.phrases[best];via="memoire-proche";}}
    if(!e)return null;var cmds=fill(e.t,c,mk);if(!cmds)return null;e.n++;e.at=Date.now();return {cmds:cmds,via:via,prov:!!e.p};}

  /* ---------- compréhension locale ---------- */
  var SPLIT=/\s*(?:,|;|\bpuis\b|\bensuite\b|\bapres ca\b)\s*|\s+et\s+(?=(?:ajoute|rajoute|mets|enleve|retire|peins|tourne|deplace|remplace|agrandis|fais|supprime|change|envoie|envoyer|signe|relance|note|cale|prends|annule|decale|appelle|previens|exporte|importe|ouvre|montre|commande|pointe|calcule|cree|duplique|facture)\b)/;
  var QOK=/^(courses\.calcul|metre\.calculer)$/;
  function askSafe(cmds){return cmds&&cmds.every(function(x){var k=x.m+"."+x.a;return READONLY.test(k)&&!(x.m==="sys"&&x.a==="mode")||QOK.test(k);})?cmds:null;}
  /* le même découpage sur la phrase d'origine (accents, majuscules), pour garder les noms et les messages intacts */
  var SPLITR=new RegExp(SPLIT.source.replace(/[aeiouc]/g,function(ch){return {a:"[aàâ]",e:"[eéèêë]",i:"[iîï]",o:"[oôö]",u:"[uùûü]",c:"[cç]"}[ch];}).replace(/\\s\+et\\s\+/,"[\\s-]+et\\s+").replace(/\\b\(\?:/g,"\\b(?:"),"iu");
  function rawParts(raw,n){var r=String(raw).split(new RegExp(SPLITR.source,"giu")).filter(function(x){return x&&x.trim();});return r.length===n?r:null;}
  function localParse(c){
    var r=parseSys(c);if(r)return r;var q=isQ(c);
    var parts=c.p.split(SPLIT).filter(function(x){return x&&x.trim();}),rp=parts.length>1?rawParts(c.raw,parts.length):null;
    var sub=function(x,i){return Object.assign({},c,{p:x,n:x,raw:rp?rp[i]:c.raw});};
    /* plusieurs demandes dans la même phrase : chacune doit être comprise */
    if(parts.length>1&&parts.every(function(x){return x.split(" ").length>=2;})){var al=[],ok1=true,lk=S.last.client;
      /* « … chez Dupont et envoie-lui un SMS » : « lui » = le client nommé juste avant */
      parts.forEach(function(x,i){var cc=sub(x,i),q1=parseExtra(cc)||parseWork(cc)||parseScene(cc)||parseDevisBuild(cc);if(q1){al=al.concat(q1);var kc=q1.map(function(y){var a=y.args||{};return y.m!=="fournisseurs"&&(a.client||(y.m==="clients"||y.m==="devis")&&a.nom);}).filter(function(v){return typeof v==="string"&&v;})[0];if(kc)S.last.client=clientKey(kc);}else ok1=false;});
      S.last.client=lk;
      if(ok1&&al.length&&(!q||askSafe(al)))return al;}
    r=parseExtra(c);if(r&&(!q||askSafe(r)))return r;
    if(q)return askSafe(parseWork(c)||parseScene(c));
    /* des quantités avec unités et un prix (ou le mot devis) : c'est un devis, pas la maquette 3D */
    if(S.mode==="artisan"&&parts.length<=1&&qtys(stripTimes(c.p)).some(function(x){return x.u!=="u";})&&(money(c.p)!=null||hasDevis.test(c.p)))return parseWork(c)||parseDevisBuild(c)||parseScene(c);
    if(parts.length>1&&parts.every(function(x){return x.split(" ").length>=2;})){
      var all=[],okAll=true;parts.forEach(function(x,i){var cc=sub(x,i);var q=parseExtra(cc)||parseWork(cc)||parseScene(cc)||parseDevisBuild(cc);if(q)all=all.concat(q);else okAll=false;});
      var whole=parseWork(c)||parseScene(c)||parseDevisBuild(c);
      if(all.length&&(okAll||!whole))return all;if(whole)return whole;return all.length?all:null;}
    return parseWork(c)||parseScene(c)||parseDevisBuild(c);
  }
  function ctxOf(raw){var t=B.translate(raw);return {raw:raw,n:t.n,p:t.p,lang:t.lang,a:t.a};}
  B.parse=function(raw){var c=ctxOf(raw);return localParse(c);};

  /* ---------- exécution d'un lot de commandes ---------- */
  function log(raw,cmds,via){S.journal.push({t:raw,d:B.describe(cmds),via:via,at:Date.now()});if(S.journal.length>300)S.journal.shift();}
  function run(cmds,c,via,learnAs){
    var desc=B.describe(cmds),out={explain:desc,says:[],open:null,ui:null,via:via,cmds:cmds},before=Object.keys(S.clients);
    var mut=mutating(cmds);if(mut)B.snapshot(desc);
    cmds.forEach(function(cmd){var f=X_[cmd.m+"."+cmd.a];if(!f){out.says.push(tr("Je ne sais pas encore faire ça."));return;}
      var r;try{r=f(cmd.args||{});}catch(e){r={say:tr("Je n’ai pas réussi cette action.")};if(root.console)console.error(e);}
      if(r.ui==="annuler"){var us=[],u;for(var ui=0;ui<(r.n||1);ui++){u=undo();if(!u)break;us.push(/^\p{Lu}\p{Ll}/u.test(u)?u.charAt(0).toLowerCase()+u.slice(1):u);}out.says.push(us.length?tr("Annulé : {0}.",[us.join(" ; ")]):tr("Rien à annuler."));if(us.length&&us.length<(r.n||1))out.says.push(tr("Il n’y avait que {0} action{1} à annuler.",[us.length,(us.length>1?"s":"")]));out.explain="";}
      else if(r.ui==="refaire"){var rd=redo();out.says.push(rd?tr("Rétabli : {0}{1}.",[rd.charAt(0).toLowerCase(),rd.slice(1)]):tr("Rien à rétablir."));out.explain="";}
      else if(r.ui==="lire")out.lire=true;
      else if(r.ui)out.ui=r.ui;
      if(r.say)out.says.push(r.say);if(r.open)out.open=r.open;["quoi","nfc","relance","msg","tel","devis"].forEach(function(k){if(r[k]!=null)out[k]=r[k];});});
    if(out.lire){out.ui="lire";out.texte=out.says.filter(Boolean).join(" ");}
    if(cmds.every(function(x){return x.m==="sys";}))out.explain="";
    Object.keys(S.clients).filter(function(k){return before.indexOf(k)<0;}).forEach(function(k){var near=before.filter(function(b){return b.length>=4&&E.dl(b,k,1)<=1;})[0];if(near)out.says.push(tr("Nouveau client : {0} (tu as aussi {1}).",[clientName(k),clientName(near)]));});
    S.lastTurn={raw:c?c.raw:"",mut:mut,cmds:cmds,via:via};if(cmds.some(function(x){return x.m!=="sys";})){S.prev={raw:c?c.raw:"",cmds:clone(cmds),mut:mut,at:Date.now()};S.prevs=(S.prevs||[]).concat([S.prev]).slice(-6);}
    if(c&&via!=="memoire"&&via!=="memoire-proche")remember(c,cmds,"local");
    if(learnAs)remember(learnAs,cmds,"user");
    if(c)log(c.raw,cmds,via);
    if(c&&c.a)E.noteLang(c.a);
    return out;
  }

  /* exécuter, mais demander « je l'envoie ? » avant tout envoi, suppression ou solde */
  function ambig(cmds){var out=null;(cmds||[]).forEach(function(x){if(out||x.m==="fournisseurs")return;var a=x.args||{};["client","nom"].forEach(function(f){if(out||typeof a[f]!=="string")return;var k=clientKey(a[f]);if(S.clients[k])return;
      var part=Object.keys(S.clients).filter(function(y){return y.split(" ").indexOf(k)>=0;});if(part.length>1)out={nom:a[f],choix:part};});});return out;}
  function exec(cmds,c,via,learnAs){
    var am=ambig(cmds);if(am){S.pending={type:"choix",cmds:cmds,raw:c?c.raw:"",nom:am.nom,choix:am.choix,via:via};S.lastTurn=null;return {explain:B.describe(cmds),says:[tr("Quel {0} : {1} ?",[cap(am.nom),am.choix.map(clientName).join(tr(" ou "))])],open:null,via:via};}
    var sens=cmds.filter(function(x){return sensitive(x)&&sureText(x);});if(!sens.length)return run(cmds,c,via,learnAs);
    var safe=cmds.filter(function(x){return sens.indexOf(x)<0;}),o=safe.length?run(safe,c,via,learnAs):{explain:"",says:[],open:null,via:via,cmds:[]};
    if(c&&via!=="memoire"&&via!=="memoire-proche")remember(c,cmds,"local");if(learnAs)remember(learnAs,cmds,"user");
    S.pending={type:"sure",cmds:sens,raw:c?c.raw:""};S.lastTurn=null;
    o.says.push(sens.map(sureText).join(" "));o.explain=[o.explain,B.describe(sens)].filter(Boolean).join(" ; ");o.via=via;return o;}
  B.exec=function(cmds,raw){return exec(cmds,raw?ctxOf(raw):null,"local");};
  var CMDSTART=/^(appelle|rappelle|ajoute|rajoute|mets|met|envoie|supprime|annule|enleve|retire|ouvre|montre|affiche|fais|cree|nouveau|nouvelle|rdv|rendez vous|devis|facture|relance|peins|deplace|tourne|remplace|signe|exporte|importe|mode|mes|ma|mon)\b/;
  var SUREYES=/^(?:(?:oui|ouais|ouep|ok|okay|vas y|go|d accord|c est bon|confirme|valide|parfait|bien sur|absolument|exact|yes|yep|si|da|tak|evet|sim)\b|(?:envoie|envoie le|envoie la|envoie lui|supprime|supprime le|supprime la|enregistre|enregistre le|relance|relance le|relance la|vas y envoie)$)/;
  var SURENO=/^(non|nan|no|nie|hayir|нет|لا|pas maintenant|plus tard|annule|laisse|laisse tomber|attends|stop|surtout pas|pas encore|non merci|pas tout de suite)\b/;
  /* ---------- point d'entrée ---------- */
  var NON=/^(non|pas ca|c est pas ca|ce n est pas ca|c est faux|faux|mauvais|erreur|tu t es trompe|tu te trompes|pas du tout)\b\s*(?:non\s*)?(?:,\s*)?(?:je voulais (?:dire )?|je veux |plutot |mais )?/;
  B.handle=function(raw){
    var c=ctxOf(raw),pd=S.pending,m;
    /* réponses aux questions de confirmation et aux demandes de précision */
    if(pd&&pd.type==="sure"){S.pending=null;
      if(SUREYES.test(c.n)){var os=run(pd.cmds,null,"local");log(pd.raw,pd.cmds,"confirmé");return os;}
      if(SURENO.test(c.n))return {explain:"",says:[pd.non?pd.non:pd.cmds.some(function(x){return x.a==="supprimer";})?tr("D’accord, je ne supprime rien."):pd.cmds.some(function(x){return x.a==="paiement";})?tr("D’accord, je n’enregistre rien."):tr("D’accord, je n’envoie rien.")],open:null};
      pd=null;}
    if(pd&&pd.type==="choix"){S.pending=null;var pick=pd.choix.filter(function(k){return k.split(" ").some(function(w){return w!==clientKey(pd.nom)&&(" "+c.n+" ").indexOf(" "+w+" ")>=0;});});
      if(!pick.length&&/^(le |la )?(premier|1er|1)\b/.test(c.n))pick=[pd.choix[0]];if(!pick.length&&/^(le |la )?(deuxieme|second|2e|2)\b/.test(c.n))pick=[pd.choix[1]];
      if(pick.length===1){var nm=clientName(pick[0]),cm2=clone(pd.cmds);cm2.forEach(function(x){var a=x.args||{};["client","nom"].forEach(function(f){if(typeof a[f]==="string"&&clientKey(a[f])===clientKey(pd.nom))a[f]=nm;});});return exec(cm2,ctxOf(pd.raw),pd.via||"local");}
      pd=null;}
    if(pd&&pd.type==="msg"){S.pending=null;if(SURENO.test(c.n)&&c.n.split(" ").length<=3)return {explain:"",says:[tr("D’accord, je n’envoie rien.")],open:null};
      var tx=CMDSTART.test(c.n)&&localParse(c)?"":msgText(raw,c.lang);if(tx)return run([C("clients","message",Object.assign({},pd.cmd,{texte:tx}))],null,"local");pd=null;}
    if(pd&&pd.type==="contact"){var ctc=contact(raw);if(ctc[pd.champ]){S.pending=null;var cm0=[C("clients","maj",Object.assign({nom:clientName(pd.client)},ctc))];if(pd.then)cm0.push(pd.then);return run(cm0,null,"local");}
      if(pd.champ==="adresse"&&c.n.split(" ").length>=3&&/\d/.test(c.n)&&!localParse(c)){S.pending=null;var cm1=[C("clients","maj",{nom:clientName(pd.client),adresse:raw.trim()})];if(pd.then)cm1.push(pd.then);return run(cm1,null,"local");}
      S.pending=null;pd=null;}
    /* correction : « non … » juste après une action */
    if(NON.test(c.n)&&S.lastTurn&&S.lastTurn.cmds&&S.lastTurn.cmds.length&&!(pd&&pd.type==="prix")){
      var orig=S.lastTurn.raw,wasMut=S.lastTurn.mut;if(wasMut)undo();if(/^memoire/.test(S.lastTurn.via||""))forgetLearned(orig,S.lastTurn.cmds,S.lastTurn.via);
      var rest=c.raw.replace(/^\s*(non|pas ça|pas ca|c'est pas ça|c’est pas ça|ce n'est pas ça|c'est faux|faux|mauvais|erreur|tu t'es trompé|tu te trompes|pas du tout)\s*[,.!]*\s*(non\s*)?(je voulais (dire )?|je veux |plutôt |plutot |mais )?/i,"").trim();
      S.pending=null;
      if(rest){var rc=ctxOf(rest),cm=recall(rc)||{cmds:localParse(rc),via:"local"};
        if(!cm.cmds&&S.prev){var fx=retargetFU(S.prev.cmds,rc);if(fx){var of=exec(fx,null,"suite");of.says.unshift(wasMut?tr("Corrigé."):"");of.says=of.says.filter(Boolean);return of;}}
        if(cm.cmds){miniLearn(orig,cm.cmds);var o=run(cm.cmds,rc,"appris",ctxOf(orig));o.says.unshift(wasMut?tr("Corrigé."):"");o.says=o.says.filter(Boolean);return o;}
        return unknown(rc,orig,wasMut?"J’ai annulé.":"");}
      forgetLearned(orig,S.lastTurn.cmds,S.lastTurn.via);
      S.pending={type:"reformuler",raw:orig,at:Date.now()};S.lastTurn=null;
      return {explain:"",says:[tr("{0}Qu’est-ce que tu voulais ?",[(wasMut?tr("D’accord, j’ai annulé. "):"")])],open:null};
    }
    if(pd){S.pending=null;
      if((/^(non|annule|laisse|laisse tomber|plus tard|stop|rien)$/.test(c.n)||PLUSTARD.test(c.n)||PLUSTARD.test(c.p))&&pd.type!=="reformuler"&&pd.type!=="confirm")return {explain:"",says:[tr("D’accord, je laisse ça de côté.")],open:null};
      if(pd.type==="prix"&&/^\d+(?:\.\d{1,2})?\s*(?:€|euros?|eur)?(?:\s*(?:ht|ttc))?(?:\s*(?:le|la|l|par|du|de l)\s*[\p{L}²]+)?$/u.test(c.n)){var v=money(c.n);if(v==null&&(m=c.n.match(/^(\d+(?:\.\d{1,2})?)\s*(?:euros?|€)?$/)))v=pnum(m[1]);
        if(v!=null){var L0=pd.lignes[0],sv=setService(L0.libelle,v,L0.unite).s,d=S.devis.filter(function(x){return x.id===pd.devis;})[0];
          if(d)d.lignes.forEach(function(l){if(hn(l.libelle)===hn(L0.libelle)&&l.prix==null)l.prix=v;});pd.lignes.shift();
          var say=tr("Prix retenu : {0} à {1} / {2}.",[sv.nom,eur(v),L0.unite]);
          if(pd.lignes.length){S.pending=pd;say+=tr(" Et pour « {0} » (en € par {1}) ?",[pd.lignes[0].libelle,pd.lignes[0].unite]);}else if(d)say+=tr(" Devis : {0} HT.",[eur(totalHT(d))]);
          return {explain:"",says:[say],open:null};}}
      if(pd.type==="rdv"){var a=clone(pd.cmd),dd=parseDate(c.p),tt=parseTime(c.p);if(dd&&!a.date)a.date=iso(dd);if(tt)a.heure=pad(tt.h)+":"+pad(tt.m);
        if((dd||tt)&&c.n.split(" ").length<=6)return run([C("planning","ajouter",a)],null,"local");}
      if(pd.type==="rdv-rec"){var tr2=parseTime(c.p);if(tr2&&c.n.split(" ").length<=5){var ac=clone(pd.cmd);ac.heure=pad(tr2.h)+":"+pad(tr2.m);return run([C("planning","recurrent",ac)],null,"local");}}
      if(pd.type==="acompte"){var am=money(c.n),pc=c.n.match(/(\d{1,2})\s*(?:%|pour ?cent)/),val=am!=null?am:pc?pd.total*+pc[1]/100:(c.n.match(/^(\d+(?:\.\d+)?)$/)?pnum(c.n):null);
        if(val!=null)return run([C("factures","creer",{client:clientName(pd.client),type:"acompte",montant:val})],null,"local");}
      if(pd.type==="complete"&&c.n.split(" ").length<=8){
        /* une vraie demande à part entière (pas un simple complément) n'est pas collée à la question */
        var own0=localParse(c);if(!(own0&&own0.some(function(x){return x.m!=="scene";}))){
        var merged=ctxOf((pd.base||"ajoute")+" "+(c.lang&&c.lang!=="fr"?c.p:raw)),q=localParse(merged);if(q)return run(q,merged,"local");}}
      if(pd.type==="iadl"){if(YES.test(c.n)){S.iaLLM="oui";return {explain:"",says:[tr("Je télécharge mon modèle de langage. Je te réponds dès qu’il est prêt.")],open:null,ui:"iadl",raw:pd.raw};}
        if(/^(non|pas maintenant|plus tard|nan|no)(\s|$)/.test(c.n)){S.iaLLM="non";return guess(ctxOf(pd.raw));}}
      if(pd.type==="confirm"){if(YES.test(c.n)){var oc=ctxOf(pd.raw),ro2=run(pd.cmds,oc,"appris",null);remember(oc,pd.cmds,"guess");miniLearn(pd.raw,pd.cmds);if(pd.teach)miniLearn(pd.teach,pd.cmds);if(pd.teach)remember(ctxOf(pd.teach),pd.cmds,"user");return ro2;}
        /* « pas pour l'instant », « plus tard » : la proposition était juste, mais pas maintenant */
        if(PLUSTARD.test(c.n)||PLUSTARD.test(c.p)){S.pending=null;S.lastTurn=null;return {explain:"",says:[tr("D’accord.")],open:null};}
        if(/^(non|pas ca|faux|mauvais|pas du tout|nan|no|nie|hayir|нет|لا)(\s|$)/.test(c.n)){reject(pd.raw,pd.cmds);if(pd.mem)forgetLearned(pd.raw,pd.cmds,"memoire");var alt=(pd.alt||[]).filter(function(x){return !rejected(ctxOf(pd.raw),x);});
          if(alt.length)return propose(ctxOf(pd.raw),alt[0],pd.teach,"",alt.slice(1));
          S.pending={type:"reformuler",raw:pd.teach||pd.raw,at:Date.now()};return {explain:"",says:[tr("D’accord. Qu’est-ce que tu voulais ?")],open:null};}
        var corr=/^(non |pas |plutot |je voulais |je veux dire |en fait |c est |je parlais |je disais )/.test(c.n),own=recall(c)||localParse(c);
        /* une autre phrase sur le même sujet au lieu de « oui » : c'est la bonne formulation, la piste proposée était fausse */
        if(related(pd,c)&&(corr||!own||!sameAction(own,pd.cmds))){if(own&&!sameAction(own,pd.cmds))reject(pd.raw,pd.cmds);pd={type:"reformuler",raw:pd.raw};}else pd={type:"aucun"};}
      if(pd.type==="reformuler"&&(LAISSE.test(c.n)||LAISSE.test(c.p)))return {explain:"",says:[tr("D’accord.")],open:null};
      var fort=pd.type==="reformuler"&&related(pd,c);
      if(pd.type==="reformuler"&&!fort){var rq0=recall(c),cm0=rq0&&!rq0.prov?rq0.cmds:localParse(c);if(!soonAction(pd,c,cm0))pd={type:"aucun"};}
      if(pd.type==="reformuler"){var rq=recall(c)||{cmds:localParse(c),via:"local"};if(rq.cmds&&B.isQuestion(pd.raw)&&!askSafe(rq.cmds))return exec(rq.cmds,c,"local");if(rq.cmds){var ro=exec(rq.cmds,c,"appris",null);learnFrom(pd.raw,c,rq.cmds,!!pd.prov||!fort,fort);return ro;}return unknown(c);}
    }
    var fu=followUp(c,false);if(fu)return fu;
    /* « pas pour l'instant », « non merci » sans question en cours : rien à faire */
    if(PLUSTARD.test(c.n)||PLUSTARD.test(c.p)||/^(non|non merci|laisse|laisse tomber|rien|tant pis)$/.test(c.n)){S.lastTurn=null;return {explain:"",says:[tr("D’accord.")],open:null,cmds:[C("sys","politesse",{})]};}
    var mem=recall(c);if(mem&&mem.prov&&!rejected(c,mem.cmds))return propose(c,mem.cmds,null,"",null,true);if(mem&&!mem.prov)return exec(mem.cmds,c,mem.via);
    var loc=localParse(c);if(loc)return exec(loc,c,"local");
    fu=followUp(c,true);if(fu)return fu;
    return unknown(c);
  };
  /* ---------- suite de conversation : « et pour Martin aussi », « pareil dans la chambre », « plutôt à 15h » ---------- */
  var SUITE_FORT=/\b(pareil|idem|la meme chose|meme chose|de meme|meme topo)\b/;
  var SUITE_ET=/^(?:et|puis|ensuite)\s+(?:(?:pour|chez|avec|a|au|en|dans|le|la|les)\s+)?[\p{L}0-9'’ -]{1,30}?\s*(?:aussi|egalement|alors|du coup)?\s*$/u;
  var CORR_DEB=/^(?:(?:non|en fait|finalement|plutot|pardon|je veux dire|je voulais dire|euh|oups|enfin)\s+)+/;
  function followUp(c,weak){var pv=S.prev;if(!pv||!pv.cmds||!pv.cmds.length||Date.now()-pv.at>30*60000)return null;
    var p=c.p,corr=CORR_DEB.test(p),strong=SUITE_FORT.test(p),et=SUITE_ET.test(p)&&p.split(" ").length<=7,aussi=/\b(aussi|egalement)\b/.test(p);
    if(weak?!(et||aussi||corr):!(strong||corr&&!localParse(c)))return null;
    var p2=p.replace(CORR_DEB,""),cc=Object.assign({},c,{p:p2,n:c.n.replace(CORR_DEB,"")}),cmds=retargetFU(pv.cmds,cc);
    /* « la même chose » : remonter aux dernières actions jusqu'à celle qui se laisse reprendre */
    if(!cmds&&strong)(S.prevs||[]).slice(0,-1).reverse().some(function(x){if(Date.now()-x.at>30*60000)return true;cmds=retargetFU(x.cmds,cc);if(cmds)pv=x;return !!cmds;});
    if(!cmds)return null;
    var o;if(corr&&!strong){if(pv.mut&&S.lastTurn&&S.lastTurn.mut)undo();o=exec(cmds,null,"suite");o.says.unshift(tr("Corrigé."));}else o=exec(cmds,null,"suite");
    log(c.raw,cmds,"suite");return o;}
  /* reprendre la dernière action en changeant ce que la nouvelle phrase précise (client, date, heure, pièce, couleur, quantité, montant) */
  function retargetFU(cmds,c){var p=c.p,kk=findClient(c.raw,c.n)||capName(c.raw),k=kk?(S.clients[kk]?clientName(kk):cap(kk)):null;
    var d=parseDate(p),t=parseTime(p),rm=findRoom(p),col=findColor(p),eq=findEquip(p),qs=qtys(stripTimes(p)),mo=money(p),changed=false,out=clone(cmds||[]).filter(function(x){return x.m!=="sys";});
    out.forEach(function(x){var a=x.args=x.args||{};
      if(k&&x.m!=="fournisseurs"){["client","nom"].forEach(function(f){if(f in a&&(f!=="nom"||x.m==="clients"||x.m==="devis")){a[f]=k;changed=true;}});
        if(x.m==="devis"&&(x.a==="client"||x.a==="lignes")){a[x.a==="client"?"nom":"client"]=k;delete a.tel;delete a.email;delete a.adresse;changed=true;}}
      if(d&&x.m==="planning"){if(x.a==="absence"){a.du=a.au=iso(d);}else a.date=iso(d);changed=true;}
      if(t&&x.m==="planning"&&x.a!=="ouvrir"&&x.a!=="absence"){a.heure=pad(t.h)+":"+pad(t.m);changed=true;}
      if(x.m==="scene"){if(rm){if(a.items)a.items.forEach(function(i){i.piece=rm.id;});else a.piece=rm.id;changed=true;}
        if(col){if(a.items)a.items.forEach(function(i){i.couleur=col.name;});else a.couleur=col.name;changed=true;}
        if(eq.length){if(a.items)a.items=a.items.map(function(i,ix){return Object.assign({},i,{type:(eq[ix]||eq[0]).type});});else if(a.type)a.type=eq[0].type;changed=true;}}
      if(x.m==="devis"&&x.a==="lignes"&&a.lignes&&a.lignes.length===1){if(qs.length){a.lignes[0].quantite=qs[0].q;changed=true;}if(mo!=null){a.lignes[0].prix=mo;changed=true;}}
      if(mo!=null&&("montant" in a)&&a.montant!=="reste"){a.montant=mo;changed=true;}
      if((x.m==="stats"||x.m==="pointage"&&x.a==="total")&&/\b(semaine|mois|annee|aujourd hui|hier|janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)\b/.test(p)){a.periode=periodeKey(p);changed=true;}
      x._ch=changed;changed=false;});
    /* seulement les actions que la nouvelle phrase modifie (jamais un envoi resté tel quel) */
    out=out.filter(function(x){var ch=x._ch;delete x._ch;return ch;});return out.length?out:null;}
  /* quand rien ne permet de deviner : demander de reformuler, puis retenir la reformulation */
  B.notUnderstood=function(r){var c=r.c;S.unrec.push({t:c.raw,l:c.lang,at:Date.now()});if(S.unrec.length>200)S.unrec.shift();
    S.pending={type:"reformuler",raw:r.teach||c.raw,at:Date.now(),prov:true};S.lastTurn=null;
    return {explain:"",says:[tr("Je n’ai pas compris.")],open:null};};

  /* ---------- IA interne : deviner, faire confirmer, apprendre ---------- */
  var VOC=null;
  function vocab(){if(VOC)return VOC;var set={};
    EQ.forEach(function(e){e[0].split(" ").forEach(function(w){if(w.length>=3)set[w]=1;});});ROOMS.forEach(function(r){r[0].split(" ").forEach(function(w){if(w.length>=3)set[w]=1;});});
    COLORS.forEach(function(c){c[0].split(" ").forEach(function(w){if(w.length>=3)set[w]=1;});});MATS.forEach(function(m){m[0].split(" ").forEach(function(w){if(w.length>=3)set[w]=1;});});
    ("voulais voulait voudrais veux aimerais souhaite faut besoin ajoute mets enleve retire supprime peins tourne deplace remplace agrandis reduis annule refais devis facture acompte paye regle rdv rendez vous demain aujourd lundi mardi mercredi jeudi vendredi samedi dimanche "+
     "chez pour client clients fournisseur fournisseurs commande signe signature envoie valide refuse planning agenda creneau libre vacances pointe chantier heures metre surface murs sol plafond facade toit etage jardin route "+
     "haie cloture terrain piscine terrasse style meuble vide combien prix tarif services liste courses budget memoire retiens oublie ferme montre ouvre carrelage peinture parquet placo main oeuvre deplacement fournitures").split(" ").forEach(function(w){set[w]=1;});
    return VOC=set;}
  function knownWord(w){return vocab()[w]||E.isKnown(w)||E.isStop(w)||/^\d/.test(w)||S.lex[w];}
  function repair(p,raw){var changed=false,V=vocab(),prot={};Object.keys(S.clients).forEach(function(k){k.split(" ").forEach(function(w){prot[w]=1;});});
    if(raw)String(raw).split(/\s+/).forEach(function(w,i){var x=w.replace(/[^\p{L}'’-]/gu,"");if(/^\p{Lu}\p{Ll}/u.test(x)&&(i>0||!V[hn(x)]))prot[hn(x)]=1;});
    var out=p.split(" ").map(function(w){if(w.length<3||V[w]||/^\d/.test(w)||E.isStop(w)||prot[w])return w;
      if(S.lex[w]){changed=true;return S.lex[w];}
      var best=null,bd=9,max=w.length<=6?1:2;Object.keys(V).forEach(function(v){if(Math.abs(v.length-w.length)>max)return;var d=E.dl(w,v,max);if(d<bd){bd=d;best=v;}});
      if(best&&bd<=max){changed=true;return best;}
      if(w.length>=4){var pre=Object.keys(V).filter(function(v){return v.length>w.length&&v.indexOf(w)===0;});if(pre.length===1){changed=true;return pre[0];}}
      return w;});
    return changed?out.join(" "):null;}
  function entityGuess(c){var n=c.p,k=findClient(c.raw,c.n)||capName(c.raw),mo=money(n),d=parseDate(n),t=parseTime(n),eq=findEquip(n),rm=findRoom(n),col=findColor(n);
    if(k&&mo!=null)return [C("factures","paiement",{client:k?(S.clients[k]?clientName(k):cap(k)):null,montant:mo})];
    if(k&&(d||t))return [C("planning","ajouter",{client:S.clients[k]?clientName(k):cap(k),date:d?iso(d):null,heure:t?pad(t.h)+":"+pad(t.m):null,duree_min:60,titre:"Rendez-vous"})];
    if(eq.length)return [C("scene","ajouter",{items:eq.map(function(e){return {type:e.type,nombre:countAt(n,e.i),piece:rm?rm.id:null};})})];
    if(col&&rm)return [C("scene","peindre",{cible:"murs",piece:rm.id,couleur:col.name})];
    if(k&&S.clients[k])return [C("clients","ouvrir",{nom:clientName(k)})];
    if(rm)return [C("scene","vue",{vue:"interieure",piece:rm.id})];
    return null;}
  function historyGuess(c){var mk=mask(c),q=E.embed(mk.m),best=null,bs=0;
    Object.keys(S.phrases).forEach(function(k){var v=E.embed(k),s=0;for(var i=0;i<q.length;i++)s+=q[i]*v[i];if(s>bs){bs=s;best=k;}});
    if(best&&bs>=0.7){var cm=fill(S.phrases[best].t,c,mk);if(cm)return cm;}return null;}
  function guess(c,teach,prefix){var L=pistes(c);if(L.length)return propose(c,L[0],teach,prefix,L.slice(1));return B.notUnderstood({c:c,teach:teach});}
  /* ---------- moteur d'apprentissage : il apprend de chaque demande incomprise, sans le dire dans le chat ----------
     - toute phrase incomprise est notée (S.unrec) ; la phrase suivante, si elle parle de la même chose, en donne le sens ;
     - une phrase apprise ainsi reste « à confirmer » : la première fois, le chat propose l'action avant de la faire ;
     - « oui » confirme ; « non » retient le refus (cette action n'est plus proposée pour cette phrase) et passe à la piste suivante ;
     - « non » juste après une action venue de la mémoire efface ce qui avait été appris ;
     - les mots inconnus remplacés par un mot connu deviennent des synonymes ; le mini modèle apprend chaque sens confirmé. */
  var SYNO=[[/\b(?:creneaux?|plages? horaires?|interventions?|visites?|passages?|rencards?)\b/g,"rdv"],[/\b(?:estimations?|estimatifs?|chiffrages?|cotations?|offres? de prix|propositions? de prix)\b/g,"devis"],
    [/\b(?:agenda|calendrier|emploi du temps)\b/g,"planning"],[/\b(?:acheteurs?|proprios?|proprietaires?)\b/g,"client"],[/\b(?:grossistes?|negoces?|negociants?)\b/g,"fournisseur"],
    [/\b(?:reglements?|versements?)\b/g,"paiement"],[/\b(?:tarifs?|couts?)\b/g,"prix"]];
  function parseAs(c,p){var rc=Object.assign({},c,{p:p,n:p}),r=recall(rc);return r&&!r.prov?r.cmds:localParse(rc);}
  function synRescue(c){var q=" "+c.p+" ";SYNO.forEach(function(s){q=q.replace(s[0],s[1]);});q=q.replace(/\s+/g," ").trim();if(q===c.p)return null;var cm=parseAs(c,q);return cm&&cm.length&&!cm.every(function(x){return x.m==="sys";})?cm:null;}
  /* toutes les pistes pour une phrase incomprise, de la plus sûre à la moins sûre, sans celles déjà refusées */
  function pistes(c){var L=[],seen={},add=function(cm){if(!cm||!cm.length||cm.every(function(x){return x.m==="sys";}))return;var l=labelOf(cm);if(!l||seen[l]||rejected(c,cm))return;seen[l]=1;L.push(cm);};
    var rp=repair(c.p,c.raw);if(rp)add(parseAs(c,rp));add(synRescue(c));add(historyGuess(c));add(entityGuess(c));return L.slice(0,3);}
  function propose(c,cmds,teach,prefix,alt,mem){S.pending={type:"confirm",cmds:cmds,raw:c.raw,teach:teach||null,alt:alt||[],mem:!!mem};S.lastTurn=null;
    var d=B.describe(cmds).replace(/^Maquette 3D : /,"").replace(/[.?!]+$/,"");if(labelOf(cmds)==="planning.ajouter"&&cmds.length===1){var rd=B.describe(cmds),r0=tr("Rendez-vous{0}{1}{2}{3}",["","","",""]);d=tr("Ajouter un rendez-vous{0}",[rd.indexOf(r0)===0?rd.slice(r0.length):""]);}
    return {explain:"",says:[tr("{0}Tu veux : {1}{2} ?",[(prefix?prefix+" ":""),d.charAt(0).toLowerCase(),d.slice(1)])],open:null,via:"devine"};}
  function rejected(c,cmds){var L=S.neg&&S.neg[mask(c).m];return !!(L&&cmds&&L.indexOf(labelOf(cmds))>=0);}
  function reject(raw,cmds){var k=mask(ctxOf(raw)).m,l=labelOf(cmds);if(!k||!l)return;S.neg=S.neg||{};var L=S.neg[k]=S.neg[k]||[];if(L.indexOf(l)<0)L.push(l);var ks=Object.keys(S.neg);if(ks.length>400)delete S.neg[ks[0]];}
  function forgetLearned(raw,cmds,via){if(!raw)return;var k=mask(ctxOf(raw)).m,e=S.phrases[k];if(e&&e.src!=="local"){delete S.phrases[k];PV=null;}if(cmds)reject(raw,cmds);}
  /* la nouvelle phrase reprend-elle la demande incomprise ? (mêmes mots de sens, ou même verbe d'action dans une vraie phrase) */
  var VERBES=[/\b(ajoute|rajoute|mets|met|cree|creer|ajouter|bloque|reserve|cale|prends|programme|planifie|nouveau|nouvelle)\b/,/\b(supprime|enleve|retire|annule|efface|vire)\b/,/\b(montre|ouvre|affiche|liste|voir)\b/,/\b(envoie|envoyer|transmets|relance)\b/,/\b(change|modifie|decale|deplace|remplace)\b/];
  function verbe(p){for(var i=0;i<VERBES.length;i++)if(VERBES[i].test(p))return i;return -1;}
  function related(pd,c){if(pd.at&&Date.now()-pd.at>10*60000)return false;var o=ctxOf(pd.raw);if(overlap(content(pd.raw),content(c.raw))||overlap(content(o.p),content(c.p)))return true;
    var v=verbe(o.p);return v>=0&&v===verbe(c.p)&&c.p.split(" ").length>=2;}
  /* juste après un « je n'ai pas compris », une vraie action (pas l'ouverture d'un écran) est sans doute la bonne formulation */
  function soonAction(pd,c,cmds){return !!(pd.at&&Date.now()-pd.at<2*60000&&c.p.split(" ").length>=2&&cmds&&cmds.length&&cmds.every(function(x){return x.m!=="sys"&&!/^(ouvrir|liste)$/.test(x.a);}));}
  var PLUSTARD=/^(?:non\s+)?(?:pas (?:pour )?(?:l )?instant|pas maintenant|plus tard|pas tout de suite|pas encore|non merci|une autre fois|on verra|pas besoin|pas aujourd hui|not now|not yet|later|maybe later|no thanks|ahora no|mas tarde|todavia no|agora nao|mais tarde|ainda nao|non ora|piu tardi|non ancora|nu acum|mai tarziu|nie teraz|pozniej|jeszcze nie|simdi degil|sonra|daha sonra|не сейчас|потом|позже|ليس الان|لاحقا|بعدين)(?:\s|$)/;
  var LAISSE=/^(non|nan|no|nope|nah|nie|hayir|нет|لا|laisse|laisse tomber|rien|oublie|oublie ca|pas grave|stop|tant pis|c est pas grave|never mind|forget it)$/;
  /* apprendre la phrase incomprise à partir de sa reformulation */
  function learnFrom(origRaw,c,cmds,prov,fort){var oc=ctxOf(origRaw);if(fort)miniLearn(origRaw,cmds);var lw=align(origRaw,c.raw);if(lw.length)buildEqLex();
    var extra=(parseDate(c.p)&&!parseDate(oc.p))||(parseTime(c.p)&&!parseTime(oc.p))||nums(c.n).some(function(x){return nums(oc.n).indexOf(x)<0;});
    if(!extra&&sameClients(origRaw,cmds))remember(oc,cmds,"user",prov);
    S.unrec.forEach(function(u){if(u.t===origRaw&&!u.ok)u.ok=labelOf(cmds);});}
  /* alignement des mots : ce que tu as dit d'abord / ce que tu as dit ensuite -> mots appris */
  var SW={les:1,des:1,une:1,dans:1,pour:1,avec:1,sur:1,moi:1,toi:1,nous:1,vous:1,mon:1,mes:1,ton:1,tes:1,son:1,ses:1,aux:1,par:1,que:1,qui:1,est:1,cette:1,ces:1,cet:1,"svp":1,"stp":1,"merci":1,"aussi":1,"encore":1,"puis":1,"vers":1};
  function align(origRaw,newRaw){var o=hn(origRaw).split(" "),r=hn(newRaw).split(" "),learned=[];
    var oo=o.filter(function(w){return w.length>=3&&!/^\d/.test(w)&&r.indexOf(w)<0&&!SW[w];}),rr=r.filter(function(w){return w.length>=3&&!/^\d/.test(w)&&o.indexOf(w)<0&&!SW[w];});
    if(oo.length&&oo.length===rr.length&&oo.length<=3)oo.forEach(function(w,i){if(!knownWord(w)&&vocab()[rr[i]]){S.lex[w]=rr[i];var rw=newRaw.split(/\s+/).filter(function(x){return hn(x)===rr[i];})[0]||rr[i];learned.push([w,rw.replace(/[^\p{L}’'-]/gu,"")]);}});
    return learned;}
  /* mots qui portent le sens (sans les noms de clients, les nombres ni les mots trop généraux) */
  var GEN={devis:1,client:1,clients:1,cliente:1,facture:1,factures:1,chantier:1,planning:1,maquette:1,rendez:1,vous:1,ajoute:1,mets:1};
  function content(raw){var names={},k=findClient(raw,hn(raw))||capName(raw);if(k)k.split(" ").forEach(function(w){names[w]=1;});Object.keys(S.clients).forEach(function(x){names[x]=1;});
    raw.split(/\s+/).forEach(function(w,i){if(i&&/^\p{Lu}/u.test(w))names[hn(w)]=1;});
    return hn(raw).split(" ").filter(function(w){return w.length>=4&&!SW[w]&&!/^\d/.test(w)&&!names[w]&&!GEN[w];});}
  function overlap(a,b){return a.some(function(w){return b.some(function(x){return x===w||w.length>=5&&x.length>=5&&x.slice(0,5)===w.slice(0,5);});});}
  function sameAction(a,b){var f=function(L){return (L||[]).filter(function(x){return x.m!=="sys";}).map(function(x){return x.m+"."+x.a;});},fa=f(a),fb=f(b);return fa.some(function(m){return fb.indexOf(m)>=0;});}
  /* une phrase apprise ne doit pas porter le client d'une autre phrase */
  function sameClients(origRaw,cmds){var ko=findClient(origRaw,hn(origRaw))||capName(origRaw),ok=true;
    (cmds||[]).forEach(function(x){if(x.m==="fournisseurs")return;var a=x.args||{};["client","nom"].forEach(function(f){if(typeof a[f]==="string"&&a[f]&&clientKey(a[f])!==ko)ok=false;});});return ok;}
  var YES=/^(oui|ouais|ouep|ok|okay|vas y|d accord|exact|exactement|c est ca|voila|yes|yep|si|sim|da|tak|evet|confirme|parfait|bien sur|absolument)\b/;


  /* ---------- branchement des modèles (module caso-ia) ---------- */
  /* ---------- casô-mini : le petit modèle maison (intention + éléments) ---------- */
  function labelOf(cmds){var x=(cmds||[]).filter(function(k){return k.m!=="sys";}).slice(-1)[0];return x?x.m+"."+x.a:null;}
  function miniLearn(raw,cmds){try{var l=labelOf(cmds);if(B.mini&&l&&B.mini.intents.indexOf(l)>=0){B.mini.learn(raw,l);B.miniDirty=true;}}catch(e){}}
  B.miniLearn=miniLearn;
  function buildIntent(r,c){
    var sl=r.slots||{},p=c.p,tx=function(k){return (sl[k]||[]).map(function(x){return x.text;});},fr=function(t){return B.translate(t).p;};
    var eqs=[];tx("EQ").forEach(function(t){var e=findEquip(fr(t));if(e.length)eqs.push({type:e[0].type,i:p.indexOf(e[0].span)});});if(!eqs.length)eqs=findEquip(p).map(function(e){return {type:e.type,i:e.i};});
    var rmT=tx("PIECE").map(function(t){var x=findRoom(fr(t));return x&&x.id;}).filter(Boolean)[0]||(findRoom(p)||{}).id||null;
    var colT=tx("COUL").map(function(t){var x=findColor(fr(t));return x&&x.name;}).filter(Boolean)[0]||(findColor(p)||{}).name||null;
    var matT=tx("MAT").map(function(t){var x=findMat(fr(t));return x&&x.name;}).filter(Boolean)[0]||(findMat(p)||{}).name||null;
    var cl=tx("CLIENT")[0]||null;if(cl)cl=cl.replace(/^(m\.|mme|madame|monsieur)\s+/i,"");if(!cl){var k0=findClient(c.raw,c.n)||capName(c.raw);if(k0)cl=S.clients[k0]?clientName(k0):cap(k0);}
    var num=function(t){var m=String(t||"").replace(",",".").match(/\d+(?:\.\d+)?/);return m?+m[0]:null;};
    var prix=num(tx("PRIX")[0]);if(prix==null)prix=money(c.n);
    var dt=parseDate(fr(tx("DATE").join(" ")))||parseDate(p),hr=parseTime(fr(tx("HEURE").join(" ")))||parseTime(p);
    var nbw=tx("NB")[0],nb=nbw?(num(nbw)||NUMW[hn(fr(nbw))]||1):1;
    var lastT=S.last.type,T0=eqs.length?eqs[0].type:lastT;
    function need(x){return x==null||x===""?null:x;}
    switch(r.intent){
      case "scene.ajouter":if(!eqs.length)return null;return [C("scene","ajouter",{items:eqs.map(function(e,i){return {type:e.type,nombre:i===0?nb:1,piece:rmT,couleur:eqs.length===1?colT:null,position:eqs.length===1?findPos(p):null};})})];
      case "scene.enlever":return T0?[C("scene","enlever",{type:T0,piece:rmT,tous:/\b(tous|toutes|les)\b/.test(p)})]:null;
      case "scene.couleur":return T0&&colT?[C("scene","couleur",{type:T0,couleur:colT,piece:rmT})]:null;
      case "scene.peindre":return colT?[C("scene","peindre",{cible:/plafond/.test(p)?"plafond":"murs",piece:/\b(tous|partout|toute)\b/.test(p)?"partout":rmT,couleur:colT})]:null;
      case "scene.sol":return matT||colT?[C("scene","sol",{piece:/\bpartout\b/.test(p)?"partout":rmT,matiere:matT,couleur:colT})]:null;
      case "scene.deplacer":return T0?[C("scene","deplacer",{type:T0,position:findPos(p),piece:findPos(p)?null:rmT})]:null;
      case "scene.tourner":return T0?[C("scene","tourner",{type:T0})]:null;
      case "scene.taille":return T0?[C("scene","taille",{type:T0,sens:RE.small.test(p)||/\b(petit|reduis|retreci|raccourci|moins)\w*/.test(p)?"moins":"plus",longueur:null})]:null;
      case "scene.remplacer":return eqs.length>=2?[C("scene","remplacer",{de:eqs[0].type,par:eqs[1].type})]:null;
      case "scene.meubler":return [C("scene","meubler",{piece:rmT||"maison"})];
      case "scene.vider":return [C("scene","vider",{piece:rmT||"maison"})];
      case "scene.style":var th=THEMES.filter(function(t){return t[1]&&t[1].test(p);})[0];return th?[C("scene","style",{theme:th[0],piece:rmT})]:null;
      case "scene.vue":return [C("scene","vue",{vue:/dessus|plan/.test(p)?"dessus":rmT?"interieure":"ensemble",piece:rmT})];
      case "scene.info":return [C("scene","info",/surface|m2|m²/.test(p)?{quoi:"surface",piece:rmT}:/prix|cout|coute|combien coute/.test(p)?{quoi:"prix"}:T0?{quoi:"nombre",type:T0}:{quoi:"surface"})];
      case "scene.toit":return [C("scene","toit",RE.rm.test(p)?{enlever:true}:{forme:/plat/.test(p)?"plat":/(4|quatre)/.test(p)?"4 pans":"2 pans",matiere:matT})];
      case "scene.etage":return [C("scene","etage",{action:/plain pied/.test(p)?"plainpied":RE.rm.test(p)?"enlever":/\b(monte|en haut)\b/.test(p)?"monter":/\b(descend\w*|en bas)\b/.test(p)?"descendre":/rez/.test(p)?"aller":"ajouter",niveau:0})];
      case "scene.exterieur":var ex=["jardin","route","allee","haie","cloture"].filter(function(k){return new RegExp(k==="cloture"?"clotur":k).test(p);});if(!ex.length)return null;return [C("scene","exterieur",RE.rm.test(p)?{enlever:ex}:{ajouter:ex,matiere:/bois/.test(p)?"bois":null})];
      case "devis.lignes":var Q=tx("QTE"),U=tx("UNITE"),Lb=tx("LIB"),lg=[];Q.forEach(function(q,i){lg.push({libelle:hn(fr(Lb[i]||Lb[0]||(unitOf(hn(U[i]||""))==="h"?"main d oeuvre":"travaux"))),quantite:num(q)||1,unite:unitOf(hn(fr(U[i]||U[0]||"")))||"u",prix:i===0?prix:null});});
        if(!lg.length){var DL=devisLines(c,cl&&clientKey(cl));if(!DL.lignes.length)return null;lg=DL.lignes;}var op2=lineOp(p);return [C("devis","lignes",Object.assign({client:cl,lignes:lg},op2?{op:op2}:{}))];
      case "devis.ouvrir":return [C("devis","ouvrir",{client:cl})];case "devis.envoyer":return [C("devis","envoyer",{})];
      case "devis.valider":return [C("devis","valider",{client:cl})];case "devis.refuser":return [C("devis","refuser",{client:cl})];
      case "signature.ouvrir":return [C("signature","ouvrir",{qui:/client/.test(p)||cl?"client":"artisan"})];
      case "services.definir":var lb=tx("LIB")[0];return lb&&prix!=null?[C("services","definir",{nom:hn(fr(lb)),prix:prix,unite:unitOf(hn(fr(tx("UNITE")[0]||"")))||(/heure/.test(p)?"h":/m2|m²|metre carre/.test(p)?"m²":null)})]:null;
      case "services.ouvrir":return [C(S.mode==="artisan"?"services":"courses","ouvrir",{})];
      case "planning.ajouter":return [C("planning","ajouter",{date:dt?iso(dt):null,heure:hr?pad(hr.h)+":"+pad(hr.m):null,duree_min:60,client:cl,titre:"Rendez-vous"})];
      case "planning.annuler":return [C("planning","annuler",{client:cl,date:dt?iso(dt):null})];
      case "planning.deplacer":return [C("planning","deplacer",{client:cl,date:dt?iso(dt):null,heure:hr?pad(hr.h)+":"+pad(hr.m):null})];
      case "planning.ouvrir":return [C("planning","ouvrir",{date:dt?iso(dt):null})];
      case "planning.libre":return [C("planning","libre",{date:dt?iso(dt):null,duree_min:60})];
      case "planning.absence":return dt?[C("planning","absence",{du:iso(dt),au:iso(dt),motif:/vacances|conge/.test(p)?"vacances":"indisponible"})]:null;
      case "factures.paiement":var md=hn(fr(tx("MODE")[0]||""));return cl&&prix!=null?[C("factures","paiement",{client:cl,montant:prix,mode:/cheque/.test(md+p)?"chèque":/espece|liquide|cash|nakit|efectivo|contanti|dinheiro/.test(md+p)?"espèces":/vire|virement|transfer/.test(md+p)?"virement":/carte|cb|card/.test(md+p)?"carte":null})]:null;
      case "factures.creer":var pc=num(tx("POURC")[0]);return cl?[C("factures","creer",{client:cl,type:/acompte/.test(p)?"acompte":"finale",montant:null,pourcentage:pc})]:null;
      case "factures.ouvrir":return [C("factures","ouvrir",{client:cl})];
      case "clients.maj":var ct=contact(c.raw);return cl?[C("clients","maj",Object.assign({nom:cl},ct))]:null;
      case "clients.ouvrir":return [C("clients","ouvrir",{nom:/\b(mes clients|liste)\b/.test(p)?null:cl})];
      case "fournisseurs.ajouter":var fn=tx("FOURN")[0];return fn?[C("fournisseurs","ajouter",{nom:fn,specialite:tx("LIB")[0]||null})]:null;
      case "fournisseurs.commande":var fn2=tx("FOURN")[0];if(!fn2)return null;var q2=num(tx("QTE")[0]||tx("NB")[0])||1;return [C("fournisseurs","commande",{nom:fn2,articles:[{nom:tx("LIB")[0]||"article",quantite:q2,unite:unitOf(hn(fr(tx("UNITE")[0]||"")))||"u"}]})];
      case "fournisseurs.ouvrir":return [C("fournisseurs","ouvrir",{})];
      case "pointage.entree":return [C("pointage","entree",{client:cl})];case "pointage.sortie":return [C("pointage","sortie",{})];case "pointage.ouvrir":return [C("pointage","ouvrir",{})];
      case "metre.calculer":var ns=nums(c.n);return ns.length>=2?[C("metre","calculer",{longueur:ns[0],largeur:ns[1],hauteur:ns[2]||null,piece:rmT})]:null;
      case "courses.calcul":var tv=(p.match(/\b(carrel\w*|peint\w*|parquet|stratifie|placo|papier peint|tapisserie|lino|vinyle|ragreage|enduit|chape|beton)\b/)||[])[1],sf=num(tx("QTE")[0])||nums(c.n)[0];
        return tv&&sf?[C("courses","calcul",{travail:/^carrel/.test(tv)?"carrelage":/^peint/.test(tv)?"peinture":tv,surface:sf})]:null;
      case "courses.ajouter":var q3=num(tx("QTE")[0]||tx("NB")[0])||nums(c.n)[0]||1;var nm=(c.p.match(/\b(?:de |d )?(colle|peinture|papier peint|joint|placo|rouleaux?|pots?|sacs?)\b.*$/)||[""])[0];return [C("courses","ajouter",{articles:[{nom:cleanLabel(nm)||"article",quantite:q3,unite:"u"}]})];
      case "courses.ouvrir":return [C("courses","ouvrir",{})];case "memoire.ouvrir":return [C("memoire","ouvrir",{})];
      case "bibliotheque.ouvrir":return [C("bibliotheque","ouvrir",{})];case "entreprise.ouvrir":return [C("entreprise","ouvrir",{})];
      case "devis.remise":var pc2=num(tx("POURC")[0])||(p.match(/(\d+(?:\.\d+)?)\s*(?:%|pour ?cent)/)||[])[1];if(pc2)return [C("devis","remise",{pourcentage:+pc2})];if(prix!=null)return [C("devis","remise",{montant:prix})];if(RE.rm.test(p))return [C("devis","remise",{montant:0})];return null;
      case "devis.dupliquer":var cls=tx("CLIENT");return [C("devis","dupliquer",{source:cls.length>1?cls[0]:null,client:cls.length?cls[cls.length-1]:null})];
      case "devis.pdf":return [C("devis","pdf",{client:cl})];case "factures.pdf":return cl?[C("factures","pdf",{client:cl})]:null;
      case "factures.lien":return [C("factures","lien",{client:cl,montant:null})];case "factures.relance":return [C("factures","relance",{client:cl})];
      case "fichiers.importer":return [C("fichiers","importer",{quoi:/prix|tarif|price|precio|preco|prezz/.test(p)?"prix":"fournisseur"})];
      case "fichiers.exporter":return [C("fichiers","exporter",{quoi:/client|klient|клиент|cliente|musteri|zakaz/.test(c.n)?"clients":/devis|quote|presupuesto|orcamento|preventivo|deviz|teklif|kosztorys|смет/.test(c.n)?"devis":/prix|price|precio|preco|prezz|tarif/.test(c.n)?"prix":/paiement|payment|pago|pagament/.test(c.n)?"paiements":/heure|hour|hora|ore|saat/.test(c.n)?"heures":"tout"})];
      case "pointage.nfc":return [C("pointage","nfc",{action:/associe|lie|programme|nouveau|attribue/.test(p)||cl?"associer":"scanner",client:cl})];
      case "scene.envoyer":return [C("scene","envoyer",{client:cl})];
      case "services.supprimer":var lb2=tx("LIB")[0];return lb2?[C("services","supprimer",{nom:hn(fr(lb2))})]:null;
      case "planning.horaires":var hs=tx("HEURE").map(function(h){return parseTime(fr(h));}).filter(Boolean);if(!hs.length&&hr)hs=[hr];if(!hs.length)return null;
        return [C("planning","horaires",hs.length>1?{debut:pad(hs[0].h)+":"+pad(hs[0].m),fin:pad(hs[1].h)+":"+pad(hs[1].m)}:/fini|termine|ferme|arrete/.test(p)?{fin:pad(hs[0].h)+":"+pad(hs[0].m)}:{debut:pad(hs[0].h)+":"+pad(hs[0].m)})];
      case "planning.recurrent":var jr=-1;JOURS.forEach(function(j,ix){if(new RegExp("\\b"+j+"s?\\b").test(p))jr=ix;});return jr>=0?[C("planning","recurrent",{jour:jr,heure:hr?pad(hr.h)+":"+pad(hr.m):null,client:cl,titre:"Rendez-vous",semaines:8})]:null;
      case "clients.note":var tn=c.raw.split(/\s*:\s*/).slice(1).join(" : ").trim();return cl&&tn?[C("clients","note",{nom:cl,texte:tn})]:null;
      case "fournisseurs.prix":var fn3=tx("FOURN")[0],lb3=tx("LIB")[0];return fn3&&lb3&&prix!=null?[C("fournisseurs","prix",{nom:fn3,article:hn(fr(lb3)),prix:prix,unite:null})]:null;
      case "devis.afaire":return S.mode==="artisan"?[C("devis","afaire",{taches:[c.raw.trim()]})]:null;case "devis.remarque":return S.mode==="artisan"?[C("devis","remarque",{texte:c.raw.trim()})]:null;
      case "devis.modifier_ligne":var lb4=tx("LIB")[0],ln=lb4&&curLine(hn(fr(lb4)));if(!ln)return null;var q4=num(tx("QTE").slice(-1)[0]);return [C("devis","modifier_ligne",{libelle:ln.libelle,quantite:q4,prix:null})];
      case "devis.dimension":var dx=parseExtra(Object.assign({},c,{p:repair(p)||p}));return dx&&labelOf(dx)==="devis.dimension"?dx:null;
      case "entreprise.maj":var ex2=parseExtra(c);return ex2&&labelOf(ex2)==="entreprise.maj"?ex2:null;
      case "devis.total":return [C("devis","total",{client:cl})];case "devis.compte":return [C("devis","compte",{})];
      case "planning.prochain":return [C("planning","prochain",{client:cl})];
      case "planning.dispo":return dt||hr?[C("planning","dispo",{date:dt?iso(dt):null,heure:hr?pad(hr.h)+":"+pad(hr.m):null})]:null;
      case "factures.impayes":return [C("factures","impayes",{client:cl})];
      case "stats.ca":return [C("stats","ca",{periode:periodeKey(p)})];
      case "pointage.total":return [C("pointage","total",{periode:periodeKey(p,"semaine")})];
      case "clients.info":return cl?[C("clients","info",{nom:cl,champ:/mail/.test(p)?"email":/adresse|habite|ou est|chantier/.test(p)?"adresse":/note|remarque/.test(p)?"notes":/coordonnee/.test(p)?"tout":"tel"})]:null;
      case "services.info":var lb5=tx("LIB")[0];return lb5?[C("services","info",{nom:hn(fr(lb5))})]:null;
      case "clients.message":var pm=parseMsg(c);if(pm)return pm;return cl?[C("clients","message",{nom:cl,canal:/mail|courriel/.test(p)?"mail":/whatsapp/.test(p)?"whatsapp":"sms",texte:""})]:null;
      case "clients.appeler":return cl?[C("clients","appeler",{nom:cl})]:null;
      case "clients.supprimer":return cl?[C("clients","supprimer",{nom:cl})]:null;
      case "memoire.desapprendre":var mo5=c.raw.match(/(?:la phrase|le mot|l['’]expression)\s*:?\s*(.+)$/i);return [C("memoire","desapprendre",mo5?{texte:mo5[1].trim()}:{dernier:true})];
      case "scene.dimension":if(!T0)return null;var qs=tx("QTE").map(function(t2,ix){var v2=num(t2);return /cm/.test(p.slice(p.indexOf(hn(t2))))&&v2>5?v2/100:v2;});if(!qs.length)return null;var od={type:T0};if(/large|largeur/.test(p))od.largeur=qs[0];else if(/haut|hauteur/.test(p))od.hauteur=qs[0];else if(/profond/.test(p))od.profondeur=qs[0];else od.longueur=qs[0];if(qs[1])od.profondeur=qs[1];return [C("scene","dimension",od)];
    }
    return null;
  }
  function miniRead(c){if(!B.mini)return null;var r;try{r=B.mini.read(c.raw);}catch(e){return null;}if(!r)return null;if(r.intent==="hors")return r.p>=0.6?{hors:true}:null;if(r.p<0.45||r.p<0.8&&!Object.keys(r.slots||{}).length)return null;
    var cmds=null;try{cmds=buildIntent(r,c);}catch(e){cmds=null;}if(!cmds||!cmds.length)return null;return {cmds:cmds,p:r.p,intent:r.intent};}
  B.miniRead=function(raw){return miniRead(ctxOf(raw));};
  function unknown(c,teach,prefix){
    /* un nom seul qu'on ne connaît pas : pas de devinette */
    var w0=c.raw.trim().split(/\s+/),nw0=w0[w0.length-1].replace(/[^\p{L}'’-]/gu,"");if(!teach&&w0.length<=2&&/^\p{Lu}\p{Ll}/u.test(nw0)&&!vocab()[hn(nw0)]&&!E.isStop(hn(nw0))&&!NOTNAME.test(nw0)&&!findEquip(c.p).length&&!findRoom(c.p)&&!findColor(c.p)){S.lastTurn=null;var nm=tcase(nw0),nc=[C("clients","maj",{nom:nm})];if(!rejected(c,nc))return propose(c,nc,null,"");}
    var mr=miniRead(c);
    if(mr&&mr.hors&&!teach){S.unrec.push({t:c.raw,l:c.lang,at:Date.now()});S.lastTurn=null;return {explain:"",says:[tr("Ça ne fait pas partie de casô.")],open:null,via:"mini"};}
    if(mr&&mr.hors)mr=null;
    if(mr&&rejected(c,mr.cmds))mr=null;
    if(!mr&&!teach){var sy=synRescue(c);if(sy&&!rejected(c,sy))return propose(c,sy,null,prefix,pistes(c).filter(function(x){return labelOf(x)!==labelOf(sy);}));}
    if(mr){if(mr.p>=0.97&&!teach){var o=exec(mr.cmds,c,"appris",null);remember(c,mr.cmds,"mini");if(prefix)o.says.unshift(prefix);o.via="mini";return o;}
      var po=propose(c,mr.cmds,teach,prefix,pistes(c).filter(function(x){return labelOf(x)!==labelOf(mr.cmds);}));po.via="mini";return po;}
    if(B.ia&&B.ia.available())return {need:"ia",c:c,teach:teach||null,prefix:prefix||""};return guess(c,teach,prefix);}
  var SEEDP=["devis pour Dupont carrelage 14 m² et main d'oeuvre 8 h","ajoute 3 h de main d'oeuvre au devis","carrelage 45 € le m²","montre le devis","envoie le devis","signe le devis","fais signer le client","le client a signé le devis","nouveau devis pour Martin",
   "rdv demain à 14h chez Dupont","décale le rdv de Dupont à jeudi 10h","annule le rdv de Dupont","qu'est-ce que j'ai demain","trouve-moi un créneau libre lundi","je suis en vacances du 20 au 27 décembre",
   "Dupont a payé 500 € par chèque","facture d'acompte Dupont 30 %","facture finale Dupont","combien me doit Dupont","le numéro de Dupont c'est 06 12 34 56 78","Dupont habite 12 rue des Lilas à Marseille","fiche Dupont","mes clients",
   "mon fournisseur de carrelage c'est Point P","commande 20 sacs de colle chez Point P","mes fournisseurs","mes services","j'arrive sur le chantier Dupont","j'ai fini","mes heures de la semaine","pièce de 4 par 3,5",
   "il me faut quoi pour carreler 12 m²","combien de peinture pour 30 m²","ma liste de courses","la colle coûte 25 € le sac","demande de devis","retiens : Dupont préfère être appelé le matin","mode bricoleur","mode artisan",
   "quel est le total du devis de Dupont ?","qui me doit de l'argent ?","quand est mon prochain rdv ?","combien j'ai encaissé ce mois-ci ?","c'est quoi le numéro de Dupont ?","je suis libre demain à 14h ?",
   "envoie un SMS à Dupont pour lui dire que j'arrive","appelle Dupont","combien d'heures cette semaine ?","quel est mon prix pour le carrelage ?"];
  var SEEDS=null;
  function seeds(){if(SEEDS)return SEEDS;SEEDS=[];var mode=S.mode;
    SEEDP.concat((M.ex||[]).slice(0,80)).forEach(function(p){try{if(/^mode /.test(p))return;var c=ctxOf(p),cm=localParse(c);if(!cm||cm.every(function(x){return x.m==="sys";}))return;SEEDS.push({ex:p,t:template(cm,c,mask(c)),src:"exemple"});}catch(e){}});
    S.mode=mode;return SEEDS;}
  B.templates=function(){var L=seeds().slice();Object.keys(S.phrases).forEach(function(k){var e=S.phrases[k];if(e.ex)L.push({ex:e.ex,t:e.t,src:e.src});});return L;};
  /* un gabarit appris porte des éléments concrets (canapé, séjour, bleu…) : on les remplace par ceux de la nouvelle phrase */
  function retarget(cmds,c){
    var p=repair(c.p,c.raw)||c.p,eq=findEquip(p),rm=findRoom(p),col=findColor(p),mat=findMat(p),ok=true;
    cmds.forEach(function(x){var a=x.args||{};
      if(x.m==="scene"){
        if(a.items){if(!eq.length){ok=false;return;}a.items=eq.map(function(e){return {type:e.type,nombre:countAt(p,e.i),piece:rm?rm.id:null,couleur:eq.length===1&&col?col.name:null,position:eq.length===1?findPos(p):null};});}
        if(a.type){if(eq.length)a.type=eq[0].type;else ok=false;}
        if(a.de){if(eq.length>=2){a.de=eq[0].type;a.par=eq[1].type;}else ok=false;}
        if(a.piece&&a.piece!=="partout"&&a.piece!=="maison")a.piece=rm?rm.id:null;
        if(a.couleur){if(col)a.couleur=col.name;else ok=false;}
        if(a.matiere){if(mat)a.matiere=mat.name;else if(!a.couleur)ok=false;else a.matiere=null;}
        if(a.theme){var th=THEMES.filter(function(t){return t[1]&&t[1].test(p);})[0];if(th)a.theme=th[0];else ok=false;}}
      if(x.m==="devis"&&x.a==="lignes"){var L=devisLines(c,findClient(c.raw,c.n));if(!L.lignes.length||L.lignes.unsure)ok=false;else a.lignes=L.lignes;}
      if(x.m==="courses"&&(x.a==="ajouter")){var q=parseDevisBuild&&S.mode!=="artisan"?null:null;}
      ["client","nom"].forEach(function(k){if(typeof a[k]==="string"&&x.m!=="fournisseurs"){var kk=findClient(c.raw,c.n)||capName(c.raw);if(kk&&clientKey(a[k])!==kk)a[k]=S.clients[kk]?clientName(kk):cap(kk);}});
    });
    return ok?cmds:null;}
  B.fillFor=function(t,raw){var c=ctxOf(raw),cm=fill(t,c,mask(c));return cm?retarget(cm,c):null;};
  B.confirmFor=function(r,cmds,compris){if(!cmds||!cmds.length)return guess(r.c,r.teach,r.prefix);S.pending={type:"confirm",cmds:cmds,raw:r.c.raw,teach:r.teach||null};S.lastTurn=null;
    /* « compris » du modèle de langage est en français : hors français, on décrit nous-mêmes les commandes */
    var d=(LANG==="fr"&&compris)||B.describe(cmds).replace(/^Maquette 3D : /,"");return {explain:"",says:[tr("{0}Tu veux : {1}{2} ?",[(r.prefix?r.prefix+" ":""),d.charAt(0).toLowerCase(),d.slice(1).replace(/[.?!]+$/,"")])],open:null,via:"modele"};};
  B.execFor=function(r,cmds,via){var o=exec(cmds,r.c,"appris",r.teach&&sameClients(r.teach,cmds)?ctxOf(r.teach):null);remember(r.c,cmds,via||"sens");if(r.prefix)o.says.unshift(r.prefix);return o;};
  B.ctx=function(raw){return ctxOf(raw);};
  /* demande modifiée dans le chat (la dernière) : l'action précédente est annulée, la nouvelle phrase est traitée ;
     si les deux parlent de la même chose, la première phrase prend le sens de la seconde (sans le dire) */
  B.corriger=function(raw){var lt=S.lastTurn;S.pending=null;S.lastTurn=null;if(lt&&lt.mut)undo();var r=B.handle(raw);
    try{if(lt&&lt.raw&&r&&r.cmds&&r.cmds.length&&related({raw:lt.raw},ctxOf(raw)))learnFrom(lt.raw,ctxOf(raw),r.cmds,false,true);}catch(e){}return r;};
  B.guessFrom=function(r){return guess(r.c,r.teach,r.prefix);};
  B.askDownload=function(r,taille){S.pending={type:"iadl",raw:r.c.raw};S.lastTurn=null;return {explain:"",says:[tr("Je n’ai pas compris « {0} » avec ce que je sais. Je peux télécharger mon modèle de langage pour mieux comprendre ({1}, une seule fois, ensuite il marche sans réseau). Je le fais ?",[r.c.raw,taille])],open:null};};
  var CATALOG=[
   "devis.lignes {client?, lignes:[{libelle, quantite, unite(m²|ml|m³|h|jour|forfait|u|kg|l|sac), prix?}]}","devis.client {nom, tel?, email?, adresse?}","devis.supprimer_ligne {libelle}","devis.nouveau {client?}","devis.ouvrir {client?}","devis.envoyer {}","devis.valider {client?}","devis.refuser {client?}","devis.tva {taux}",
   "signature.ouvrir {qui: artisan|client}","services.definir {nom, prix, unite?}","services.ouvrir {}",
   "planning.ajouter {date:AAAA-MM-JJ, heure:HH:MM, duree_min?, client?, titre?}","planning.annuler {client?, date?}","planning.deplacer {client?, date?, heure?}","planning.libre {date?, duree_min?}","planning.absence {du, au, motif?}","planning.ouvrir {date?}",
   "factures.paiement {client, montant, mode?}","factures.creer {client, type: acompte|finale, montant?, pourcentage?}","factures.ouvrir {client?}",
   "clients.maj {nom, tel?, email?, adresse?, note?}","clients.ouvrir {nom?}","fournisseurs.ajouter {nom, specialite?, tel?}","fournisseurs.commande {nom, articles:[{nom, quantite, unite}]}","fournisseurs.ouvrir {}",
   "pointage.entree {client?}","pointage.sortie {}","pointage.ouvrir {}","metre.calculer {longueur, largeur, hauteur?, piece?}",
   "courses.ajouter {articles:[{nom, quantite, unite, prix?}]}","courses.prix {nom, prix, unite?}","courses.calcul {travail, surface}","courses.ouvrir {}","projet.demande {}",
   "scene.ajouter {items:[{type, nombre, piece?, couleur?, position?}]}","scene.enlever {type, piece?, tous?}","scene.remplacer {de, par}","scene.couleur {type, couleur}","scene.tourner {type, angle?}","scene.taille {type, sens: plus|moins, longueur?}","scene.deplacer {type, position?, piece?}",
   "scene.peindre {cible: murs|plafond, piece?, couleur}","scene.sol {piece?, matiere?, couleur?}","scene.facade {couleur?, matiere?}","scene.style {theme, piece?}","scene.meubler {piece?}","scene.vider {piece?}","scene.info {quoi: nombre|surface|prix, type?, piece?}",
   "scene.etage {action: ajouter|monter|descendre|aller|enlever, niveau?}","scene.toit {forme?, matiere?, enlever?}","scene.exterieur {ajouter?:[jardin|route|allee|haie|cloture], enlever?:[...]}","scene.vue {vue: dessus|interieure|ensemble, piece?}",
   "memoire.retenir {fait}","mot.apprendre {mot, sens}",
   "devis.remise {pourcentage?|montant?}","devis.dimension {longueur?, largeur?, hauteur?, piece?}","devis.modifier_ligne {libelle, quantite?, prix?}","devis.dupliquer {source?, client?}","devis.pdf {client?}","devis.afaire {taches:[texte]}","devis.remarque {texte}",
   "entreprise.maj {nom?, siret?, adresse?, tel?, email?, conditions?, validite?, tva_intra?, decennale?}","entreprise.ouvrir {}","services.supprimer {nom}","planning.horaires {debut?:HH:MM, fin?:HH:MM}","planning.recurrent {jour:0-6, heure:HH:MM, client?, titre?, semaines?}",
   "factures.lien {client, montant?}","factures.relance {client?}","factures.pdf {client}","clients.note {nom, texte}","fournisseurs.prix {nom, article, prix, unite?}","fichiers.importer {quoi?}","fichiers.exporter {quoi: clients|devis|prix|paiements|fournisseurs|heures|tout}",
   "pointage.nfc {action: scanner|associer, client?}","scene.dimension {type, longueur?, largeur?, profondeur?, hauteur?}","scene.envoyer {client?}","bibliotheque.ouvrir {}",
   "devis.total {client?}","devis.compte {}","planning.prochain {client?}","planning.dispo {date?, heure?}","factures.impayes {client?}","stats.ca {periode: jour|semaine|mois|annee|mois-1}","clients.info {nom, champ: tel|email|adresse|notes|tout}",
   "pointage.total {periode?}","services.info {nom}","clients.message {nom, canal: sms|mail|whatsapp, texte}","clients.appeler {nom}","clients.supprimer {nom}"];
  var ALLOWED={};CATALOG.forEach(function(l){ALLOWED[l.split(" ")[0]]=1;});
  B.llmSystem=function(){var now=B.now(),cur=getCur();
    return "Tu traduis un message d’artisan (n’importe quelle langue, avec des fautes) en commandes JSON pour l’appli casô. Réponds seulement avec un objet JSON {\"compris\":\"phrase courte en français\",\"commandes\":[{\"m\":\"…\",\"a\":\"…\",\"args\":{…}}]}. "+
      "Si le message ne concerne pas l’appli ou s’il manque une information indispensable, réponds {\"compris\":\"\",\"commandes\":[]}. N’invente aucune valeur.\n"+
      "Commandes (m.a {arguments}) :\n"+CATALOG.join("\n")+
      "\nTypes 3D : "+TLIST.map(function(t){return t[0]+"="+t[1];}).join(", ")+", window=Fenêtre, door=Porte. Pièces : sejour, chambre, cuisine, salle de bain, wc, entree, bureau, garage, cellier, exterieur.\n"+
      "Aujourd’hui : "+iso(now)+" ("+JOURS[now.getDay()]+"). Mode : "+S.mode+". Clients : "+(Object.keys(S.clients).map(clientName).slice(0,20).join(", ")||"aucun")+". Devis en cours : "+(cur&&cur.client?clientName(cur.client):"aucun")+".\n"+
      "Exemples :\nmessage : rajoute-moi deux chaises dans la cuisine\n{\"compris\":\"Ajouter 2 chaises dans la cuisine\",\"commandes\":[{\"m\":\"scene\",\"a\":\"ajouter\",\"args\":{\"items\":[{\"type\":\"chair\",\"nombre\":2,\"piece\":\"cuisine\"}]}}]}\n"+
      "message : Martin m’a filé 200 balles en liquide\n{\"compris\":\"Paiement de 200 € en espèces par Martin\",\"commandes\":[{\"m\":\"factures\",\"a\":\"paiement\",\"args\":{\"client\":\"Martin\",\"montant\":200,\"mode\":\"espèces\"}}]}";};
  B.validate=function(obj){if(!obj||typeof obj!=="object")return null;
    var cmds=(Array.isArray(obj.commandes)?obj.commandes:[]).filter(function(x){return x&&ALLOWED[x.m+"."+x.a];}).map(function(x){return {m:x.m,a:x.a,args:x.args&&typeof x.args==="object"?clone(x.args):{}};});
    cmds.forEach(function(x){var a=x.args;if(x.m==="scene"){if(Array.isArray(a.items))a.items=a.items.map(function(i){i=i||{};i.type=resolveType(i.type)||i.type;if(i.piece)i.piece=resolveRoom(i.piece);return i;}).filter(function(i){return TYPES[i.type];});["type","de","par"].forEach(function(k){if(a[k])a[k]=resolveType(a[k])||a[k];});if(a.piece)a.piece=resolveRoom(a.piece);}
      if(a.date&&!/^\d{4}-\d{2}-\d{2}$/.test(a.date))delete a.date;if(a.heure&&!/^\d{2}:\d{2}$/.test(a.heure))delete a.heure;});
    cmds=cmds.filter(function(x){return !(x.m==="scene"&&x.a==="ajouter"&&!(x.args.items||[]).length);});
    return cmds.length?cmds:null;};
  /* ---------- données pour les écrans ---------- */
  B.qty=qty;B.TYPES=TYPES;B.roomLabel=roomLabel;B.totalHT=totalHT;B.totalTTC=totalTTC;B.tvaParTaux=tvaParTaux;B.getCur=getCur;B.clientName=clientName;B.paid=paid;B.devisOf=devisOf;B.budget=budget;B.fdate=fdate;B.ftime=ftime;B.fnum=fnum;B.eur=eur;B.matColor=matColor;B.colorHex=colorHex;B.level=level;B.fromIso=fromIso;B.iso=iso;B.sod=sod;B.addDays=addDays;B.undo=undo;
  B.dump=function(){var s=clone(S);s.pending=null;s.lastTurn=null;return s;};
  /* l'historique d'annulation survit au rechargement de la page (10 dernières actions) */
  B.dumpHist=function(){return HIST.slice(-10);};B.loadHist=function(h){if(Array.isArray(h))HIST=h.filter(function(x){return x&&typeof x.s==="string";}).slice(-10);};
  B.stats=function(){var ph=Object.keys(S.phrases);return {phrases:ph.length,guess:ph.filter(function(k){return S.phrases[k].src==="guess";}).length,sens:ph.filter(function(k){return S.phrases[k].src==="sens";}).length,mini:ph.filter(function(k){return S.phrases[k].src==="mini";}).length,lex:Object.keys(S.lex).length,user:ph.filter(function(k){return S.phrases[k].src==="user";}).length,journal:S.journal.length,mots:Object.keys(S.syn).length+Object.keys(S.roomw).length+Object.keys(S.colw).length};};
  /* réponses hors français : typographie de la langue */
  ["handle","sign","importRows","guessFrom","nfcTag"].forEach(function(k){var f=B[k];if(typeof f==="function")B[k]=function(){return typo(f.apply(this,arguments));};});
  return B;
}
root.CasoBrain={create:create,hn:hn};
if(typeof module!=="undefined")module.exports=root.CasoBrain;
})(typeof window!=="undefined"?window:globalThis);

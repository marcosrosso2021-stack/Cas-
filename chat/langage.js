/* casô · langage de chantier (étape 1) — se place DEVANT le moteur, sans le changer.
   La phrase de l'artisan est nettoyée (fautes sur les mots du métier, abréviations, parler familier),
   puis le chat la traite comme avant. Le texte tapé reste affiché tel quel dans la conversation.
   - français seulement pour l'instant ;
   - seuls les mots du métier sont touchés : une commande de l'appli sort d'ici identique ;
   - un synonyme n'est pas remplacé (« cumulus » reste « cumulus ») : seules les fautes et les abréviations le sont ;
   - comprendre un mot ne donne aucune commande : ce fichier ne fait que réécrire une phrase.
   Données : chat/lexique-btp.js. Chargé après chat/intel.js. */
(function(){
var D=window.CASO_LEXBTP;if(!D)return;
function nz(x){return String(x||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[’'\-]/g," ").replace(/\s+/g," ").trim();}
function dist(a,b){if(Math.abs(a.length-b.length)>2)return 9;var m=a.length,n=b.length,d=[],i,j;for(i=0;i<=m;i++){d[i]=[i];}for(j=0;j<=n;j++)d[0][j]=j;
  for(i=1;i<=m;i++)for(j=1;j<=n;j++){var c=a.charAt(i-1)===b.charAt(j-1)?0:1;d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);
    if(i>1&&j>1&&a.charAt(i-1)===b.charAt(j-2)&&a.charAt(i-2)===b.charAt(j-1))d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);}return d[m][n];}
function pluriel(a,b){return a===b+"s"||b===a+"s"||a===b+"x"||b===a+"x";}

/* ---------- table des formes : forme sans accent → {terme, écrit, sorte} ---------- */
var TERMES={},FORMES={},MAXN=1;
function pose(k,ecrit,sorte,o,force){if(!k)return;var x=FORMES[k];
  if(!x||force)FORMES[k]={t:o,ecrit:ecrit,sorte:sorte};
  /* la même forme écrite avec ses accents ou son trait d'union (« fenetre » → « fenêtre ») */
  else if(x.t===o&&x.sorte!=="faute"&&x.sorte!=="abr"&&/[^\x00-\x7f]/.test(ecrit)&&!/[^\x00-\x7f]/.test(x.ecrit)&&ecrit.indexOf("-")<0)x.ecrit=ecrit;
  MAXN=Math.max(MAXN,k.split(" ").length);}
D.t.forEach(function(l){var c=l.split("|"),o={id:c[0],nom:c[1],metier:c[2],type:c[3].replace("?",""),amb:/\?$/.test(c[3]),g:c[4]};TERMES[o.id]=o;
  var vars=(c[5]||"").split(";").filter(Boolean),ref=nz(o.nom).indexOf(" ")<0?o.nom:(vars[0]||o.nom),kr=nz(ref);
  pose(nz(o.nom),o.nom,"nom",o);
  vars.forEach(function(v){/* « *lavabeau » : une faute dite comme telle */
    if(v.charAt(0)==="*"){pose(nz(v.slice(1)),ref,"faute",o);return;}var k=nz(v);
    /* une faute : un seul mot, tout près du mot de référence (et pas son pluriel) → on écrit le mot de référence */
    if(k.indexOf(" ")<0&&k!==kr&&!pluriel(k,kr)){var dd=dist(k,kr);if(dd===1&&k.length>=4||dd===2&&k.length>=5){pose(k,ref,"faute",o);return;}}
    pose(k,v,"var",o);});
  (c[6]||"").split(";").filter(Boolean).forEach(function(v){pose(nz(v),/\d/.test(v)?v.replace(/\s+/g,"").toUpperCase():o.nom,"abr",o,true);});
  (c[7]||"").split(";").filter(Boolean).forEach(function(v){pose(nz(v),v,"fam",o);});});
/* une faute s'écrit comme le mot de référence, avec ses accents */
Object.keys(FORMES).forEach(function(k){var f=FORMES[k];if(f.sorte==="faute"){var r=FORMES[nz(f.ecrit)];if(r&&r.sorte!=="faute")f.ecrit=r.ecrit;}});

/* les mots de la phrase, avec leur place dans le texte tapé */
function jetons(t){var out=[],re=/[\p{L}\p{N}][\p{L}\p{N}.]*(?:['’\-][\p{L}\p{N}]+)*/gu,m;while((m=re.exec(t))){var w=m[0].replace(/\.+$/,"");
    /* « l'ancien », « d'eau » : l'article élidé est un mot à part */
    var el=w.match(/^([ldnsmtcjLDNSMTCJ]|qu|Qu)['’](.+)$/);if(el){out.push({w:el[1],a:m.index,b:m.index+el[1].length+1,k:nz(el[1])});out.push({w:el[2],a:m.index+el[1].length+1,b:m.index+w.length,k:nz(el[2])});}
    else out.push({w:w,a:m.index,b:m.index+w.length,k:nz(w)});}return out;}
/* les termes du métier trouvés dans une phrase (le plus long d'abord) */
function trouve(t){var J=jetons(t),hits=[],i=0;while(i<J.length){var pris=null;for(var n=Math.min(MAXN,J.length-i);n>=1&&!pris;n--){var k=J.slice(i,i+n).map(function(x){return x.k;}).join(" ").replace(/\s+/g," ");var f=FORMES[k];if(f)pris={f:f,i:i,n:n,a:J[i].a,b:J[i+n-1].b,k:k};}
    if(pris){hits.push(pris);i+=pris.n;}else i++;}return {J:J,hits:hits};}

var ACT=[],EXPR=[];
D.actions.forEach(function(r){r[0].split("|").forEach(function(v){ACT.push([nz(v),r[1]]);});});ACT.sort(function(a,b){return b[0].length-a[0].length;});
D.expr.forEach(function(r){r[0].split("|").forEach(function(v){EXPR.push([nz(v),r[1]]);});});EXPR.sort(function(a,b){return b[0].length-a[0].length;});
var VERBE=/ (faut|faudra|faudrait|doit|dois|ajoute|rajoute|mets|met|enleve|retire|supprime|note|cree|nouveau|nouvelle|envoie|change|modifie|remplace|ouvre|montre|affiche|combien|quel|quelle|c est|est ce|calcule|prix|client|rdv|rendez) /;
var DET=/^(le|la|les|l|du|des|de|d|un|une|tout|toute|tous|toutes|ce|cet|cette|ces|ca|mon|ma|mes|son|sa|ses|leur|leurs)$/;
var ANC=new RegExp("^(?:"+D.ancien+")$");

/* remplace des morceaux du texte tapé, de la fin vers le début */
function applique(t,R){R.sort(function(a,b){return b.a-a.a;});var der=Infinity;R.forEach(function(r){if(r.b>der)return;t=t.slice(0,r.a)+r.par+t.slice(r.b);der=r.a;});return t;}
function casse(src,par){return /^\p{Lu}/u.test(src)&&!/^[A-Z0-9]+$/.test(par)?par.charAt(0).toUpperCase()+par.slice(1):par;}

/* ---------- le nettoyage ---------- */
function nettoie(t){var brut=String(t||""),R=[],X=trouve(brut),J=X.J,H=X.hits,i;
  if(!J.length)return {t:brut,change:false,termes:[],amb:[]};
  var parJeton={};H.forEach(function(h){for(var k=0;k<h.n;k++)parJeton[h.i+k]=h;});
  var kk=J.map(function(x){return x.k;}),devis=kk.indexOf("devis")>=0,faut=kk.some(function(w){return /^(faut|faudra|faudrait)$/.test(w);});
  /* 1. expressions entières (« tirer une ligne », « faire les bandes », « dep comp ») */
  var exprVu=0;for(i=0;i<J.length;i++){for(var e=0;e<EXPR.length;e++){var w=EXPR[e][0].split(" ");if(kk.slice(i,i+w.length).join(" ")===EXPR[e][0]){
      /* « faire les joints » : seulement s'il n'est pas déjà dit de quoi */
      if(/joints de carrelage|bandes a joint/.test(nz(EXPR[e][1]))&&J[i+w.length]&&/^(de|du|des|d|a|au|placo|silicone|carrelage)$/.test(kk[i+w.length]))continue;
      R.push({a:J[i].a,b:J[i+w.length-1].b,par:casse(J[i].w,EXPR[e][1])});exprVu++;for(var z=0;z<w.length;z++)parJeton[i+z]={expr:1};i+=w.length-1;break;}}}
  /* 2. fautes et abréviations sur les mots du métier */
  var nb=H.length+exprVu;
  H.forEach(function(h){if(parJeton[h.i]&&parJeton[h.i].expr)return;var f=h.f,src=brut.slice(h.a,h.b);
    if(f.sorte==="abr"){/* une abréviation seule ne suffit pas : il faut un devis, ou un autre mot du métier dans la phrase */
      if(nb<2&&!devis&&!faut)return;
      /* « dep » : seulement devant ce qu'on dépose */
      if(h.k==="dep"&&!(J[h.i+1]&&(parJeton[h.i+1]||/^(du|de|des|sol|mur|murs|complete|totale?)$/.test(kk[h.i+1]))))return;
      if(nz(src)!==nz(f.ecrit)||src!==f.ecrit)R.push({a:h.a,b:h.b,par:f.ecrit});return;}
    if(f.sorte==="faute"){R.push({a:h.a,b:h.b,par:casse(src,f.ecrit)});return;}
    /* accents remis (« fenetre » → « fenêtre »), pluriel gardé */
    if(nz(src)===nz(f.ecrit)&&src.toLowerCase()!==f.ecrit.toLowerCase())R.push({a:h.a,b:h.b,par:casse(src,f.ecrit)});});
  /* 3. parler familier : « péter le vieux carrelage » → « déposer l'ancien carrelage » (seulement devant un mot du métier) */
  var actVu=0,prem=-1;
  for(i=0;i<J.length;i++){if(parJeton[i])continue;var pris=null;for(var a=0;a<ACT.length&&!pris;a++){var aw=ACT[a][0].split(" ");if(kk.slice(i,i+aw.length).join(" ")===ACT[a][0])pris={n:aw.length,par:ACT[a][1]};}
    if(!pris)continue;var j=i+pris.n;if(!(J[j]&&(DET.test(kk[j])||i>0&&kk[i-1]==="tout"&&/^(dans|sur|sous|au|a)$/.test(kk[j]))))continue;
    /* l'objet : un mot du métier dans les 4 mots qui suivent */
    var obj=false;for(var q2=j;q2<Math.min(J.length,j+5);q2++)if(parJeton[q2]&&!parJeton[q2].expr){obj=true;break;}
    if(!obj)continue;
    /* « monte le prix de la faïence » parle d'un prix, pas d'un ouvrage */
    if(kk.slice(j,Math.min(J.length,j+5)).some(function(w){return /^(prix|tarif|tarifs|quantite|quantites|ligne|lignes|devis|client|facture|rdv|tva|remise|marge|total)$/.test(w);})&&!/ligne electrique/.test(kk.slice(j,j+6).join(" ")))continue;
    /* « change le carrelage par du parquet » est une commande : on n'y touche pas */
    R.push({a:J[i].a,b:J[i+pris.n-1].b,par:casse(J[i].w,pris.par)});actVu++;if(prem<0)prem=i;}
  /* 4. « le vieux carrelage » → « l'ancien carrelage » (devant un mot du métier) */
  for(i=0;i<J.length-1;i++){if(!ANC.test(kk[i])||!parJeton[i+1]||parJeton[i+1].expr||/^(ancien|ancienne|anciens|anciennes|existante?s?)$/.test(kk[i]))continue;
    var fem=/^vieill/.test(kk[i]),plu=/s$|x$/.test(kk[i])&&kk[i]!=="vieux"||i>0&&/^(les|des)$/.test(kk[i-1]),mot="ancien"+(fem?"ne":"")+(plu?"s":"");
    if(i>0&&/^(le|la)$/.test(kk[i-1])&&!plu)R.push({a:J[i-1].a,b:J[i].b,par:casse(J[i-1].w,"l'"+mot)});
    else if(i>0&&kk[i-1]==="du"&&!plu)R.push({a:J[i-1].a,b:J[i].b,par:"de l'"+mot});
    else R.push({a:J[i].a,b:J[i].b,par:mot});}
  /* 5. « remettre du neuf » : du neuf de quoi ? le dernier matériau dit ; « neuf » n'est jamais le chiffre 9 ici */
  for(i=0;i<J.length;i++){if(kk[i]!=="neuf"||!(i>0&&/^(du|de|d|en|a|le|tout)$/.test(kk[i-1])))continue;if(kk[i-1]==="a"||kk[i-1]==="tout")continue;
    var mat=null;for(var b2=i-1;b2>=0&&!mat;b2--)if(parJeton[b2]&&!parJeton[b2].expr&&parJeton[b2].f.t.type==="mat")mat=parJeton[b2].f;
    if(kk[i-1]==="du"||kk[i-1]==="de"||kk[i-1]==="d")R.push({a:J[i-1].a,b:J[i].b,par:mat?"du "+(mat.sorte==="abr"?mat.ecrit:mat.ecrit.toLowerCase()):"du nouveau"});}
  /* « un carrelage neuf » : poser dit déjà que c'est du neuf, et le moteur lirait le chiffre 9 */
  for(i=1;i<J.length;i++)if(/^(neuf|neuve|neufs|neuves)$/.test(kk[i])&&parJeton[i-1]&&!parJeton[i-1].expr&&!(J[i+1]&&/^(m2|m²|m|ml|h|u|sacs?|pots?|kg|heures?|jours?)$/.test(kk[i+1])))R.push({a:J[i-1].b,b:J[i].b,par:""});
  /* 6. « + » entre deux travaux */
  var plus=/\s\+\s|\s\+(?=\p{L})|(?<=\p{L})\+\s/u;
  var out=applique(brut,R);
  if((nb>=1||devis)&&plus.test(out))out=out.replace(/\s*\+\s*(?=\p{L})/gu,devis?", ":" et ");
  /* une phrase qui commence par l'action familière, sans « faut » : c'est un travail à faire */
  if(actVu&&prem===0&&!/\b(faut|faudra|faudrait|doit|dois|devis)\b/.test(nz(out)))out="il faut "+out.charAt(0).toLowerCase()+out.slice(1);
  /* des abréviations de chantier sans verbe (« dep comp sol sdb + pose carrelage ») : des travaux à faire, pas une commande */
  else if(out!==brut&&nb>=2&&H.some(function(h){return h.f.sorte==="abr";})&&!devis&&!VERBE.test(" "+nz(out)+" "))out="il faut "+out;
  var ids=[],amb=[];H.forEach(function(h){if(ids.indexOf(h.f.t.id)<0)ids.push(h.f.t.id);if(h.f.t.amb&&amb.indexOf(h.f.t.id)<0)amb.push(h.f.t.id);});
  return {t:out,change:out!==brut,termes:ids,amb:amb};}

/* un mot du métier dans un morceau de phrase : {id, nom, ecrit, g, type, amb} — pour les lignes de devis */
function terme(x){var H=trouve(String(x||"")).hits.filter(function(h){return h.f.t.type!=="piece";});if(!H.length)return null;
  H.sort(function(a,b){return b.n-a.n||a.i-b.i;});var h=H[0],o=h.f.t;return {id:o.id,nom:o.nom,ecrit:h.f.sorte==="fam"?o.nom:h.f.ecrit,g:o.g,type:o.type,amb:o.amb,metier:o.metier,k:h.k};}

/* ---------- mots à plusieurs sens ----------
   leve(id, contexte) → {sur:"bâti de porte"|null, choix:[noms]} : un seul sens désigné par le contexte → il est sûr. */
var SENS=D.sens||{};
function leve(id,ctx,fort){var S=SENS[id];if(!S)return {sur:null,choix:[]};var c=" "+nz(ctx).replace(/[^a-z0-9]+/g," ")+" ",vus=S.filter(function(x){return x[1].split("|").some(function(w){var f=w.charAt(0)==="!";if(fort&&!f)return false;return c.indexOf(" "+(f?w.slice(1):w)+" ")>=0;});});
  return {sur:vus.length===1?vus[0][0]:null,choix:S.map(function(x){return x[0];})};}
/* le mot seul (« bâti », « rail ») dans une phrase : [{id, a, b, mot}] */
function ambigus(t){var X=trouve(String(t||"")),out=[];X.hits.forEach(function(h){var o=h.f.t;if(!o.amb||!SENS[o.id])return;
    /* « rail de cloison », « bâti de porte » sont déjà précis */
    if(SENS[o.id].some(function(x){return nz(x[0])===h.k;})||h.n>1)return;out.push({id:o.id,a:h.a,b:h.b,mot:String(t).slice(h.a,h.b),k:h.k});});return out;}

window.CASO_LANGAGE={nettoie:nettoie,terme:terme,termes:TERMES,nz:nz,nombre:Object.keys(TERMES).length,leve:leve,ambigus:ambigus};

/* ---------- branchement : la phrase nettoyée passe par le chemin habituel du chat ---------- */
var P=window.casoPont;if(!P)return;
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function cap(x){x=String(x||"");return x.charAt(0).toUpperCase()+x.slice(1);}
/* ce qui entoure la phrase : le devis en cours et les trois derniers messages de l'artisan */
function contexte(t){var L=t==null?[]:[String(t)];try{if(typeof q!=="undefined"&&q){(q.lines||[]).forEach(function(l){if(l.label)L.push(l.label);});(q.notes||[]).forEach(function(n){L.push(n.t);});}
    if(typeof CHAT!=="undefined"&&CHAT.m)CHAT.m.filter(function(m){return m.who==="me";}).slice(-3).forEach(function(m){L.push(m.text);});}catch(x){}return L.join(" . ");}
/* la question en attente : {id, k, choix, qid, at} */
var AMB=null;
function demande(a){var S=SENS[a.id];if(!S||typeof CHAT==="undefined")return;AMB={id:a.id,k:a.k,mot:a.mot,choix:S.map(function(x){return x[0];}),qid:typeof q!=="undefined"&&q?q.id:null,at:Date.now()};
  CHAT.m.push({who:"bot",html:'<div data-noi18n><p dir="auto">« '+esc(cap(a.mot))+' » : '+esc(AMB.choix.map(function(c,i){return (i===AMB.choix.length-1&&i>0?"ou ":"")+c;}).join(AMB.choix.length>2?", ":" "))+' ?</p><div class="msg-act">'+AMB.choix.map(function(c,i){return '<button class="btn sm'+(i?" sec":"")+'" onclick="casoPont.sens('+i+')">'+esc(cap(c))+'</button>';}).join("")+'</div></div>'});
  try{chatSave();chatRender(true);}catch(x){}}
/* la réponse : la ligne du devis (ou la note) qui porte le mot seul prend le nom précis */
function applique2(i){var a=AMB;AMB=null;if(!a||typeof q==="undefined"||!q||q.id!==a.qid)return false;var nom=a.choix[i];if(!nom)return false;var fait=null,avant=JSON.stringify(q);
  (q.lines||[]).forEach(function(l){if(!fait&&l.label&&nz(l.label)===a.k){l.label=cap(nom);fait={l:l};}});
  if(!fait)(q.notes||[]).forEach(function(n){if(fait)return;var J=jetons(n.t),h=J.filter(function(x){return x.k===a.k;})[0];if(h){n.t=n.t.slice(0,h.a)+nom+n.t.slice(h.b);fait={n:n};}});
  if(!fait)return false;try{fillForm();store();}catch(x){}
  var h2=fait.l?'<div class="msg-lines"><div class="ml"><div><b data-noi18n lang="fr">'+esc(fait.l.label)+'</b><div class="mut" data-noi18n>'+esc((fait.l.qty==null?"":String(fait.l.qty).replace(".",",")+" ")+(fait.l.unit||""))+'</div></div></div></div>'
    :'<p class="mut"><b>'+esc(P.tr(fait.n.k==="todo"?"À faire":"Remarques"))+'</b> : <span data-noi18n dir="auto">'+esc(fait.n.t)+'</span></p>';
  CHAT.m.push({who:"bot",html:h2,undo:avant});try{chatSave();chatRender(true);}catch(x){}return true;}
P.sens=function(i){if(!AMB)return;var c=AMB.choix[i];if(typeof CHAT!=="undefined"&&c)CHAT.m.push({who:"me",text:cap(c)});applique2(i);};
/* réponse tapée : « de porte », « porte », « fenêtre », « le premier » */
var oui0=P.oui;
P.oui=function(t){if(AMB&&Date.now()-AMB.at<10*60000){var k=nz(t).replace(/[.!?]+/g,"").replace(/^(c est |celui |le |la |un |une )?(de |du |d )?/,"").trim(),i=-1;
    if(/^(1|premier|premiere|le premier|la premiere)$/.test(nz(t)))i=0;else if(/^(2|deuxieme|second|seconde|le deuxieme)$/.test(nz(t)))i=1;else if(/^(3|troisieme|le troisieme|dernier)$/.test(nz(t)))i=AMB.choix.length-1;
    else if(k&&k.length>=3){var V=AMB.choix.map(function(c,j){var w=nz(c).replace(new RegExp("^"+AMB.k+"\\b"),"").replace(/\b(de|du|d|ou|a|support)\b/g," ").trim().split(/\s+/);return k.split(/\s+/).every(function(x){return w.some(function(y){return y===x||y.indexOf(x)===0&&x.length>=4;});})?j:-1;}).filter(function(j){return j>=0;});if(V.length===1)i=V[0];}
    if(i>=0){if(typeof CHAT!=="undefined")CHAT.m.push({who:"me",text:String(t)});if(applique2(i))return true;}
    else if(nz(t).split(" ").length>3)AMB=null;}
  return oui0?oui0.apply(this,arguments):false;};
var rv0=P.renvoi;
P.renvoi=function(t){var r=null,aDemander=null;try{var lg=(P.B&&P.B.translate?P.B.translate(String(t)).lang:"fr")||"fr",ui="fr";try{ui=(typeof I18N!=="undefined"&&I18N.lang)||"fr";}catch(x){}if(lg==="fr"||ui==="fr"&&lg!=="en"){var n=nettoie(t),txt=n.t;
      /* un mot à plusieurs sens : le contexte tranche, sinon la question vient après la réponse du chat */
      /* ce qui tranche : le mot qui suit (« le rail du placard »), sinon le devis en cours et les messages d'avant.
         Un autre travail cité dans la même phrase (« refaire le bâti et changer 2 fenêtres ») ne suffit pas : la question est posée. */
      var A=ambigus(txt);if(A.length){var ctx=contexte(null),R2=[];A.forEach(function(a){var apres=txt.slice(a.b).split(/[,;.]|\s(?:et|puis|avec)\s/)[0].split(/\s+/).slice(0,5).join(" "),v=leve(a.id,apres);
          /* « le rail du placard », « 10 plaques de BA13 » : la suite du mot le précise déjà — ni réécriture, ni question */
          if(v.sur)return;
          v=leve(a.id,txt.slice(0,a.a)+" "+txt.slice(a.b),true);if(!v.sur)v=leve(a.id,ctx);if(v.sur)R2.push({a:a.a,b:a.b,par:v.sur});else if(!aDemander)aDemander=a;});if(R2.length)txt=applique(txt,R2);}
      if(txt!==String(t))r=txt;}}catch(x){if(window.console)console.error(x);}
  if(aDemander){var n0=typeof CHAT!=="undefined"&&CHAT.m?CHAT.m.length:0,essais=0,att=function(){essais++;try{var M=CHAT.m,der=M[M.length-1];
        /* la réponse du chat est arrivée : la question suit, si le mot est bien resté sur une ligne ou une note */
        if(M.length>n0&&der&&der.who==="bot"){var la=typeof q!=="undefined"&&q&&((q.lines||[]).some(function(l){return l.label&&nz(l.label)===aDemander.k;})||(q.notes||[]).some(function(x){return jetons(x.t).some(function(j){return j.k===aDemander.k;});}));if(la)demande(aDemander);return;}}catch(x){return;}
      if(essais<25)setTimeout(att,250);};setTimeout(att,250);}
  if(r){var r2=null;try{r2=rv0?rv0.call(this,r):null;}catch(x){}return r2===true?true:(r2||r);}
  return rv0?rv0.apply(this,arguments):null;};
})();

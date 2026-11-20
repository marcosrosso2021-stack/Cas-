/* casô · Planning : compréhension des phrases (planning dicté)
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* Compréhension des phrases : planning dicté (module séparé pour les vieux iPhone) */
function agScan(F){
 const o={F,W:agFold(F),times:[],ranges:[],dates:[],days:null,period:null,allday:false,dur:null,drange:null},now=new Date(),td=agToday();
 // écritures d'heures : 15 h 30, 15:30, 15.30h, midi, minuit, 1er
 o.W=o.W.replace(/(\d{1,2})\s*(?:h|heures?)\s*(\d{2})(?!\d)/g,(m,h,mi)=>(h+'h'+mi).padEnd(m.length,' ')).replace(/(\d{1,2})\s+(h|heures?)(?![\p{L}])/gu,(m,h)=>(h+'h').padEnd(m.length,' '))
  .replace(/(?<![\d/.])(\d{1,2}):(\d{2})(?![\d/])/g,(m,h,mi)=>(h+'h'+mi).padEnd(m.length,' ')).replace(/(\d{1,2})heures?/g,(m,h)=>(h+'h').padEnd(m.length,' '))
  .replace(/(?<![-\p{L}])midi(?![-\p{L}])/gu,'12h ').replace(/(?<![-\p{L}])minuit(?![-\p{L}])/gu,'0h    ').replace(/(\d)(?:er|eme|e)(?![\p{L}])/gu,(m,d)=>d.padEnd(m.length,' '));
 const T=(h,mi)=>{h=+h;mi=+(mi||0);return h<24&&mi<60?agHm(h*60+mi):null};
 // plages horaires : de 15h à 19h, 15h-19h, entre 8 et 12h
 agEach(o,/(?:(?<![\p{L}])(?:de|des|entre)\s+)?(\d{1,2})(h(\d{2})?)?\s*(?:a|-|–|et|jusqu'a|au)\s*(\d{1,2})(h(\d{2})?)?(?![\p{L}\d/.,])(?!\s*(?:m|ml|m2|m²|cm|kg|%|€|euros?|jours?|semaines?|mois|ans?|pieces?|unites?|rue|avenue|av|bd|boulevard|chemin|place|allee|impasse|route|quai|cours|residence|lotissement|bis|ter)(?![\p{L}]))/gu,m=>{
  let a=T(m[1],m[3]),b=T(m[4],m[6]);const pre=/(^|[^\p{L}])(de|des|entre)\s/u.test(m[0].slice(0,4)+' ');if(!a||!b)return false;
  if(agMin(b)<=agMin(a)){if(+m[4]<12&&agMin(a)<12*60)b=T(+m[4]+12,m[6]);if(!b||agMin(b)<=agMin(a))return false}
  if(!m[2]&&!m[5])return pre?o.ranges.push([a,b])&&undefined:false;
  if(!m[2]&&!pre)return false;o.ranges.push([a,b])});
 agEach(o,/(?<![\p{L}])(?:a|vers)\s+(\d{1,2})(?![\d\p{L}/.,'])(?!\s*(?:m|ml|m2|m²|cm|kg|%|€|euros?|jours?|semaines?|mois|ans?|pieces?|unites?|personnes?|rue|avenue|av|bd|boulevard|chemin|place|allee|impasse|route|quai|cours|residence|lotissement|bis|ter)(?![\p{L}]))/gu,m=>{const h=+m[1];if(h<6||h>21)return false;o.times.push(agHm(h*60))});
 // durée : pendant 3h, pour 2 heures
 agEach(o,/(?<![\p{L}])(?:pendant|pour|durant)\s+(\d{1,2})\s*h(?:eures?)?(\d{2})?/gu,m=>{o.dur=(+m[1])*60+(+(m[2]||0))});
 // heures seules : à 7h, 7h30 (pas « 6 h de main d'œuvre »)
 agEach(o,/(?:(?<![\p{L}])(?:a|vers|des|pour|aux alentours de)\s+)?(\d{1,2})h(\d{2})?(?![\p{L}\d])(?!\s*(?:de|d'|du)(?![\p{L}]))/gu,m=>{const a=T(m[1],m[2]);if(!a)return false;o.times.push(a)});
 // moments de la journée
 agEach(o,/(?<![\p{L}])(?:toute la journee|la journee entiere|journee complete)(?![\p{L}])/gu,()=>{o.allday=true});
 agEach(o,/(?<![\p{L}])(?:le |ce |du |en |dans l')?(matin|apres-midi|apres midi|aprem|soir|soiree)(?![\p{L}])/gu,m=>{o.period=/matin/.test(m[1])?['08:00','12:00']:/soir/.test(m[1])?['18:00','21:00']:['14:00','18:00'];if(/(^|[^\p{L}])(ce|cet) $/u.test(m[0].slice(0,m[0].length-m[1].length))&&!o.dates.includes(td))agPD(o,td)});
 // ensembles de jours : du lundi au vendredi, en semaine, le week-end, tous les jours
 agEach(o,new RegExp('(?<![\\p{L}])(?:du |de |le )?('+AG_DRX+')s?\\s*(?:au|a|-|–|jusqu\'au|jusqu\'a)\\s*('+AG_DRX+')s?(?![\\p{L}])','gu'),m=>{const a=AG_DAYS.indexOf(m[1]),b=AG_DAYS.indexOf(m[2]);const D=[];for(let i=a;;i=(i+1)%7){D.push(i);if(i===b||D.length>7)break}o.days=D});
 agEach(o,/(?<![\p{L}])(?:en semaine|les jours de semaine|jours ouvres)(?![\p{L}])/gu,()=>{o.days=[1,2,3,4,5]});
 agEach(o,/(?<![\p{L}])tous les jours(?![\p{L}])/gu,()=>{o.days=[0,1,2,3,4,5,6];o.rr=o.rr||{f:'d'}});
 agEach(o,/(?<![\p{L}])(?:le |ce |les )?week-?end(?![\p{L}])/gu,()=>{if(!o.days)o.wkend=true});
 // répétition : tous les lundis, chaque semaine, tous les jours, chaque mois
 agEach(o,new RegExp('(?<![\\p{L}])(?:tous les|toutes les|chaque|les)\\s+((?:(?:'+AG_DRX+')s?(?:\\s*(?:,|et)\\s*)?)+|jours?|semaines?|mois)(?![\\p{L}])','gu'),m=>{
  const w=m[1];if(/^jour/.test(w)){o.rr={f:'d'};return}if(/^semaine/.test(w)){o.rr={f:'w'};return}if(/^mois/.test(w)){o.rr={f:'m'};return}
  if(/^les\s/.test(m[0])&&!/s(\s|$)/.test(w))return false;
  const D=[...w.matchAll(new RegExp(AG_DRX,'g'))].map(x=>AG_DAYS.indexOf(x[0]));if(!D.length)return false;o.rr={f:'w',days:[...new Set(D)]};o.dayNames=(o.dayNames||[]).concat(D)});
 // jusqu'au 20 décembre / jusqu'au 20/12 / jusqu'à vendredi
 agEach(o,new RegExp('(?<![\\p{L}])jusqu\'(?:au|a)\\s+(?:(\\d{1,2})(?:/(\\d{1,2})(?:/(\\d{2,4}))?|\\s+('+AG_MRX+')(?:\\s+(\\d{4}))?)|('+AG_DRX+'))(?![\\p{L}\\d])','gu'),m=>{
  let d=null;if(m[6]){const k=AG_DAYS.indexOf(m[6]);d=agAdd(td,((k-now.getDay()+7)%7)||7)}else if(m[2])d=agMk(+m[1],+m[2]-1,m[3]);else if(m[4])d=agMk(+m[1],AG_MONTHS.indexOf(m[4]),m[5]);else d=agMk(+m[1],null);
  if(!d)return false;o.until=d});
 // dates relatives
 agEach(o,/(?<![\p{L}-])apres-demain(?![\p{L}])/gu,()=>{agPD(o,agAdd(td,2))});
 agEach(o,/(?<![\p{L}-])demain(?![\p{L}])/gu,()=>{agPD(o,agAdd(td,1))});
 agEach(o,/(?<![\p{L}])(?:aujourd'hui|aujourdhui|ce soir|ce matin|cet apres-midi)(?![\p{L}])/gu,m=>{agPD(o,td);if(/soir/.test(m[0])&&!o.period)o.period=['18:00','21:00'];if(/matin/.test(m[0])&&!o.period)o.period=['08:00','12:00']});
 agEach(o,/(?<![\p{L}])dans\s+(\d{1,3})\s+jours?(?![\p{L}])/gu,m=>{agPD(o,agAdd(td,+m[1]))});
 agEach(o,/(?<![\p{L}])(?:la )?semaine prochaine(?![\p{L}])/gu,()=>{const d=new Date();const k=(8-d.getDay())%7||7;o.nwMon=agAdd(td,k);agPD(o,o.nwMon);o.nextWeek=true});
 // plages de dates : du 24 au 31 décembre
 agEach(o,new RegExp('(?<![\\p{L}])du\\s+(\\d{1,2})(?:/(\\d{1,2}))?(?:\\s+('+AG_MRX+'))?\\s+au\\s+(\\d{1,2})(?:/(\\d{1,2}))?(?:\\s+('+AG_MRX+'))?(?:\\s+(\\d{4}))?','gu'),m=>{
  const mo2=m[5]?+m[5]-1:m[6]?AG_MONTHS.indexOf(m[6]):null,mo1=m[2]?+m[2]-1:m[3]?AG_MONTHS.indexOf(m[3]):mo2;
  if(mo1==null&&mo2==null){const d1=+m[1],d2=+m[4],Y=m[7]?+m[7]:now.getFullYear(),M0=m[7]?now.getMonth():now.getMonth();
   const mk=(mo,d)=>{const x=new Date(Y,mo,d);return x.getDate()===d?agYmd(x):null};
   for(let k=0;k<3;k++){const a=mk(M0+k,d1),b=d2>=d1?mk(M0+k,d2):mk(M0+k+1,d2);if(a&&b&&(m[7]||b>=td)){o.drange=[a,b];return}}return false}
  const a=agMk(+m[1],mo1,m[7]),b=agMk(+m[4],mo2,m[7]);if(!a||!b)return false;o.drange=[a,b<a?agMk(+m[4],mo2,(+(m[7]||now.getFullYear()))+1):b]});
 // dates : 12 novembre (2026), 12/11(/2026), le 12
 agEach(o,new RegExp('(?<![\\p{L}\\d])(\\d{1,2})\\s+('+AG_MRX+')(?:\\s+(\\d{4}))?(?![\\p{L}])','gu'),m=>{const d=agMk(+m[1],AG_MONTHS.indexOf(m[2]),m[3]);if(!d)return false;agPD(o,d)});
 agEach(o,/(?<![\d/])(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?(?![\d/])/g,m=>{const d=agMk(+m[1],+m[2]-1,m[3]);if(!d)return false;agPD(o,d)});
 agEach(o,/(?<![\p{L}])le\s+(\d{1,2})(?![\d\p{L}h/])/gu,m=>{const d=agMk(+m[1],null);if(!d)return false;agPD(o,d)});
 /* « jeudi 26 » (sans mois) : le 26, ce mois-ci ou le suivant */
 agEach(o,new RegExp('(?<![\\p{L}])(?:ce |le )?(?:'+AG_DRX+')\\s+(?:le\\s+)?(\\d{1,2})(?:er)?(?![\\d\\p{L}h/:])(?!\\s+(?:'+AG_MRX+'))','gu'),m=>{const d=agMk(+m[1],null);if(!d)return false;agPD(o,d)});
 // jours de la semaine : lundi, lundi prochain, ce mardi
 agEach(o,new RegExp('(?<![\\p{L}])(?:ce |le |cette )?('+AG_DRX+')(\\s+prochain|\\s+qui vient)?(?![\\p{L}])','gu'),m=>{
  const k=AG_DAYS.indexOf(m[1]);if(o.listDays){o.listDays.push(k);return}
  o.dayNames=(o.dayNames||[]).concat(k);
  /* « lundi 14 décembre », « mardi 10/11 » : la date suit le jour, c'est elle qui compte */
  if(o.dates.length&&m.index!=null&&/^\s+(?:le\s+)?\d{1,2}(?:er)?(?:\s|\/|$)/.test(agFold(o.F).slice(m.index+m[0].length)))return;
  if(o.nextWeek&&o.nwMon){const d=agAdd(o.nwMon,(k+6)%7),ix=o.dates.indexOf(o.nwMon);if(ix>=0)o.dates[ix]=d;else agPD(o,d);o.nwMon=null;return}
  let n=(k-now.getDay()+7)%7;if(m[2]&&n===0)n=7;agPD(o,agAdd(td,n))});
 if(o.dp&&o.dp.length===o.dates.length){const I=o.dates.map((d,k)=>k).sort((x,y)=>o.dp[x]-o.dp[y]);o.dates=I.map(k=>o.dates[k]);o.dp=I.map(k=>o.dp[k])}
 o.date=o.dates[0]||null;
 agEach(o,/(?<![\p{L}])cette semaine(?![\p{L}])/gu,()=>{o.thisWeek=true});
 return o}
function agName(o){
 // premier « chez / pour / avec … Nom » valable (« pour une terrasse chez Baptiste » → Baptiste), sinon « Mme Brown » seul
 const okM=m=>{if(!m)return false;const civ=m[2],w1=m[3];if(AG_STOP.has(agFold(w1))||/^\d/.test(w1))return false;
  if(m[1]==='pour'&&!civ&&!/^\p{Lu}/u.test(o.F.substr(m.index+m[0].indexOf(w1,m[1].length),1)))return false;
  if(!m[1]&&/^m\./.test(civ)&&!/^\p{Lu}/u.test(o.F.substr(m.index+civ.length,1)))return false;return true};
 let m=null;
 {const re=/(?<![\p{L}])(chez|client|cliente|avec|pour le compte de|pour)\s+((?:m\.|mme|mlle|monsieur|madame|mr)\s+)?([\p{L}][\p{L}'-]*)(?:\s+([\p{L}][\p{L}'-]*))?/gu;let x;
  while((x=re.exec(o.W))){if(okM(x)){m=x;break}re.lastIndex=x.index+x[1].length}}
 if(!m)for(const x of o.W.matchAll(/(?<![\p{L}])()((?:m\.|mme|mlle|monsieur|madame)\s+)([\p{L}][\p{L}'-]*)(?:\s+([\p{L}][\p{L}'-]*))?/gu))if(okM(x)){m=x;break}
 if(!m)return null;
 const civ=m[2],w1=m[3],w2=m[4];
 const i1=m.index+m[0].indexOf(w1,m[1].length+(civ||'').length);let len=w1.length,end=i1+len;
 if(w2&&!AG_STOP.has(agFold(w2))&&/^\p{Lu}/u.test(o.F.substr(m.index+m[0].lastIndexOf(w2),1))){end=m.index+m[0].lastIndexOf(w2)+w2.length}
 const cap=s=>s.replace(/(^|[\s'-])(\p{Ll})/gu,(x,a,b)=>a+b.toUpperCase());
 let nom=cap(o.F.slice(i1,end).trim());
 if(civ){const c=agFold(civ).replace(/\s+/g,'');nom=(/^(mme|madame)$/.test(c)?'Mme ':/^mlle$/.test(c)?'Mlle ':'M. ')+nom}
 agBlank(o,m.index,end-m.index);return{nom,kw:m[1]}}
const AG_BOOKV=/(?<![\p{L}])(reserve|reserver|reserves|bloque|bloquer|prends|prendre|cale|caler|mets|mettre|garde|garder|planifie|planifier|fixe|fixer|book|cale-moi|mets-moi|prends-moi|reserve-moi|bloque-moi|trouve-moi et reserve)(?![\p{L}])/u,
 AG_BOOKN=/(?<![\p{L}])(prochain|prochaine|premier|premiere|1er|1ere)\s+(creneau|dispo|disponibilite|trou|moment|place)|(?<![\p{L}])(un|le|mon|ma|une)\s+(creneau|dispo|trou)(\s+libre|\s+dispo)?(?![\p{L}])/u;
function agBookTitle(t){let s=' '+String(t||'')+' ';
 s=s.replace(/(?<![\p{L}])(reserve|réserve|prochain|prochaine|premier|première|créneau|creneau|libre|dispo|disponible)(?![\p{L}])/giu,' ');
 const E=/^(le|la|les|l'|un|une|pour|de|du|des|the|for|a|an|el|los|las|una|para|um|uma|il|lo|per|pentru|dla|na|для|на|o)\s+|\s+(le|la|les|un|une|pour|de|du|des|the|for|a|an|el|para|per|pentru|dla|для|na|o)$/iu;
 s=s.replace(/\s+/g,' ').trim();for(let k=0;k<8;k++){const s0=s;s=s.replace(E,'').trim();if(s===s0)break}
 return s?s[0].toUpperCase()+s.slice(1):''}
/* chantier sur plusieurs jours : « 3 jours », « pendant 2 semaines », « 20 h de travail », « du lundi au jeudi »,
   ou « planifie le chantier de Martin » (heures de main-d'œuvre de son devis) */
const AG_NB={un:1,une:1,deux:2,trois:3,quatre:4,cinq:5,six:6,sept:7,huit:8,neuf:9,dix:10,onze:11,douze:12,quinze:15,vingt:20};
const AG_SER_V=/(?<![\p{L}])(planifie|planifier|programme|programmer|cale|caler|prevois|prevoir|organise|organiser|lance|lancer)(?:-moi)?\s+(?:le |les |mon |ce |un |une )?chantiers?(?![\p{L}])/u;
function agSerieDe(f,o,cl){const nb=x=>AG_NB[x]||+x,N='(\\d{1,2}|'+Object.keys(AG_NB).join('|')+')';
 let m=new RegExp('(?<![\\p{L}])(?<!dans |il y a |y a )'+N+'\\s*(jours?|j|semaines?)(?![\\p{L}])(\\s*et demi)?','u').exec(f);
 if(m&&!/(?<![\p{L}])(prochaine?s?|derniere?s?)$/u.test(f.slice(m.index+m[0].length).trim().split(/\s+/)[0]||'')){const n=nb(m[1]);
  if(/^s/.test(m[2]))return{semaines:n};if(m[3])return{heures:(n+0.5)*7};if(n>1)return{jours:n};return null}
 m=/(?<![\p{L}\d])(\d{1,3})\s*h(?:eures?)?\s*(?:de travail|de boulot|de chantier|de taf|de main d'oeuvre|de main d'œuvre)/u.exec(f);if(m&&+m[1]>0)return{heures:+m[1]};
 if(o.drange&&o.drange[1]>o.drange[0])return{d1:o.drange[1]};
 if(AG_SER_V.test(f)&&cl){/* devis du client : les lignes à l'heure (main-d'œuvre) */
  const D=(db.quotes||[]).filter(x=>nameKey(x.client)===nameKey(cl.nom)).sort((a,b)=>(['accepte','paye'].includes(b.status)?1:0)-(['accepte','paye'].includes(a.status)?1:0)||String(b.date||'').localeCompare(String(a.date||'')))[0];
  const h=D?(D.lines||[]).filter(l=>String(l.unit||'').trim()==='h').reduce((s,l)=>s+(+l.qty||0),0):0;if(h>0)return{heures:h,devis:D.num||''}}
 return null}
/* titre du chantier : sans la durée ni « à partir de » */
function agSerieTitre(t){const N='(?:\\d{1,3}|'+Object.keys(AG_NB).join('|')+')';
 return t.replace(new RegExp('(?:pendant|sur|durant|en|pour)?\\s*'+N+'\\s*(?:jours?|j|semaines?)(?:\\s*et demi)?(?![\\p{L}])','giu'),' ')
  .replace(/(?:\d{1,3}\s*(?:h(?:eures?)?)?\s*)?de (?:travail|boulot|chantier|taf|main d['’](?:oe|œ)uvre)/giu,' ')
  .replace(/(?<![\p{L}])(?:à|a) partir(?: de| du| d['’])?(?![\p{L}])/giu,' ').replace(/^(?:le |les |un |une )?chantiers?\s*(?:de |chez |pour )?/i,'')
  .replace(/[,;:–-]+/g,' ').replace(/\s+/g,' ').replace(/^\s*(?:pendant|sur|en|de|du)\s+|\s+(?:pendant|sur|en|de|du)\s*$/gi,'').trim()}
function agIntent(f,o){
 const has=re=>re.test(f);
 if(AG_SER_V.test(f)&&!has(/(?<![\p{L}])(annule|supprime|decale|deplace|reporte)(?![\p{L}])/u))return'rdv';
 if(/(?<![\p{L}])(chez|chantier)(?![\p{L}])/u.test(f)&&/(?<![\p{L}])(?<!dans |il y a )(\d{1,2}|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\s*(jours|semaines?)(?![\p{L}])|\d\s*h(eures?)? de (travail|boulot|chantier)/u.test(f))return'rdv';
 if(has(AG_BOOKV)&&has(AG_BOOKN)&&!o.ranges.length&&!/(?<![\p{L}])(a|vers)\s+\d{1,2}\s*h/u.test(f))return'book';
 const rdvN=has(/(?<![\p{L}])(rdv|rendez-vous|rendez vous|rendezvous|creneau|reunion|visite|intervention|passage|chantier prevu|planning)(?![\p{L}])/u);
 if(has(/(?<![\p{L}])(annule|annuler|desiste|decommande)(?![\p{L}])/u)||rdvN&&has(/(?<![\p{L}])(supprime|supprimer|enleve|efface|retire|laisse tomber|oublie|vire|zappe)(?![\p{L}])/u))return'cancel';
 if(has(/(?<![\p{L}])(decale|decaler|reporte|reporter|repousse)(?![\p{L}])/u)||rdvN&&has(/(?<![\p{L}])(deplace|deplacer|avance|avancer|change l'heure|change|changer|bouge|bouger|recule|reculer|mets plutot)(?![\p{L}])/u))return'move';
 if(has(/(?<![\p{L}])(trouve|trouver|cherche|chercher|propose|proposer)(-moi|-nous)? (un |une |du |des )?(creneaux?|trou|moment|place|temps|dispo)|(creneaux?|moments?) libres?|quand (suis-je|je suis|est-ce que je suis|j'ai du temps|ai-je du temps|puis-je|je peux)|suis-je (libre|dispo)|je suis (libre|dispo) (quand|a quelle heure)|est-ce que je suis (libre|dispo)|j'ai (un |du )?(trou|creneau|temps libre|de la place)|il me reste (du temps|un creneau)/u))return'free';
 if(has(/(?<![\p{L}])(qu'est-ce que j'ai|qu'est ce que j'ai|j'ai quoi|quoi de prevu|qu'ai-je|mon planning|mon agenda|mes rdv|mes rendez-vous|mon programme|je fais quoi|je suis libre quand|suis-je libre|qu'est-ce qui est prevu|qu'est ce qui est prevu|il y a quoi|y a quoi|ma journee|mes chantiers|montre(?:-moi| moi)? (?:mon |le )?planning|affiche (?:mon |le )?planning|c'est quoi mon planning|c'est quoi le programme|j'ai qui|je vois qui)(?![\p{L}])/u)&&!o.ranges.length)return'list';
 const dispo=has(/(?<![\p{L}])(creneaux?|horaires?|heures?|plages?) (de travail|d'ouverture|de boulot|de dispo)|je (travaille|travailles|travail|bosse|bosses|taffe|taff|suis dispo|suis disponible)|mes dispos|disponibilites|je commence a|j'ouvre/u);
 const off=has(/(?<![\p{L}])(pas dispo|indisponible|pas disponible|absent|conge|conges|vacances|ferme|repos|je ne travaille pas|je travaille pas|je travail pas|je ne travail pas|je bosse pas|jour off|day off|je suis off)(?![\p{L}])/u);
 if(off&&(o.date||o.drange||o.dayNames||o.wkend))return'off';
 if(dispo&&(o.ranges.length||o.period)&&!(o.date&&!o.dayNames)&&!agName(o))return'dispo';
 const quant=/(\d)\s*(m2|m²|ml|m3|metres?|mètres?|unites?|u\b|€|euros?)/i.test(f);
 const when=o.date||o.drange||o.rr,clock=o.times.length||o.ranges.length||o.period||o.allday;
 if(when&&clock)return'rdv';
 if(o.times.length&&/(?<![\p{L}])(a|vers|des)\s+\d{1,2}\s*h/u.test(f)&&/(?<![\p{L}])(chez|mme|madame|monsieur|mlle|m\.)\s*\p{L}/u.test(f))return'rdv';
 if(clock&&!quant&&(o.times.length||o.ranges.length)&&/(?<![\p{L}])(a|vers|des|de|entre|rdv|rendez-vous|chez|chantier|visite)(?![\p{L}])/u.test(f))return'rdv';
 if(when&&!quant&&/(?<![\p{L}])(chez|rdv|rendez-vous|chantier|visite|intervention|passer|passage|pose|mise|livraison|reunion)(?![\p{L}])/u.test(f))return'rdv';
 return null}
function agParse(t,lang){
 const F=agNorm(t,lang),o=agScan(F),f=agFold(F),intent=agIntent(f,o);if(!intent)return null;
 if(intent==='dispo'){const D=o.listDays||[];
  // liste de jours seuls : lundi, mardi et jeudi
  if(!o.days&&o.dayNames)o.days=[...new Set(o.dayNames)].sort();
  const ex=/(?<![\p{L}])sauf (?:le |les )?(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/u.exec(agFold(F));
  let days=o.days||(o.wkend?[6,0]:[1,2,3,4,5]);if(ex)days=days.filter(d=>d!==AG_DAYS.indexOf(ex[1]));
  const R=o.ranges.length?o.ranges:[o.period];return{intent,days,ranges:R}}
 const team=[];(db.people||[]).filter(pp=>!pp.parti).forEach(pp=>{const k=agFold(pp.nom).trim();if(k.length<2)return;const re=new RegExp('(?<![\\p{L}])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}])','gu');agEach(o,re,()=>{if(!team.includes(pp.id))team.push(pp.id)})});
 o.W=o.W.replace(/(?<![\p{L}])avec(\s+(?:et\s+)?)+(?=\s*$|\s+(?:demain|a|chez|pour|le|la))/gu,m=>' '.repeat(m.length));
 const who=agName(o);
 // titre : ce qui reste une fois les dates, heures et noms retirés
 let title='';{const W=o.W;let s='';for(let i=0;i<o.F.length;i++)s+=W[i]===' '&&o.F[i]!==' '?' ':o.F[i];
  title=s.replace(/[,.;:!?–]+/g,' ').replace(/\s+/g,' ').trim();
  const LEAD=/^(reserve|réserve|réserver|reserver|réserves|bloque|bloquer|prends|prendre|cale|caler|garde|fixe|cale-moi|mets-moi|prends-moi|réserve-moi|reserve-moi|bloque-moi|moi|nous|prochain|prochaine|premier|première|premiere|1er|créneau|creneau|créneaux|libre|dispo|trou|moment|avec|j'ai|j ai|il y a|on a|y a|je dois|je vais|je serai|j'ai un|prevu|prévu|prevue|prévue|ajoute|note|noter|planifie|planifier|mets|met|rdv|rendez-vous|un|une|le|la|les|au|aux|a|à|de|du|des|et|pour|ce|cette|annule|annuler|supprime|supprimer|déplace|deplace|décale|decale|reporte|stp|svp|s'il te plait|s'il te plaît)\s+/i,TRAIL=/\s+(a|à|au|aux|le|la|les|de|du|des|d'|et|pour|chez|vers|entre|avec|ce|cette|prevu|prévu|stp|svp)$/i;
  for(let k=0;k<12;k++){const t0=title;title=(title+' ').replace(LEAD,'').trim();title=title.replace(TRAIL,'').trim();if(t0===title)break}
  if(/^(rdv|rendez-vous|rendez vous)$/i.test(title))title='';
  title=title.replace(/^(d'|l')/i,'').trim();if(title)title=title[0].toUpperCase()+title.slice(1)}
 return{intent,o,who,title,F,team}}

function agChat(t){
 let P=null;const LS=[(typeof VN!=='undefined'&&VN.lang)||'fr','fr'];try{const dt=vlDetect(t);if(dt&&dt.score>=3)LS.push(dt.l)}catch(e){}
 for(const l of [...new Set(LS)]){try{P=agParse(t,l)}catch(e){P=null}if(P)break}
 if(!P)return false;
 if(CHAT.qid!==q.id)CHAT={qid:q.id,m:[]};
 CHAT.m.push({who:'me',text:t});
 const out=[],o=P.o,act=[];let undo=null;
 const goBtn=d=>`<button class="btn sm sec" onclick="agOpen('${d||''}')"><svg class="i"><use href="#i-cal"/></svg>Voir dans Mon planning</button>`;
 if(P.intent==='book'){const f=agFold(P.F),dur=agDurOf(f,o);let d=o.date&&o.date>=agToday()?o.date:agToday(),g=null;
  for(let k=0;k<60&&!g;k++){const G=agGaps(d,dur);if(G.length)g=G[0];else d=agAdd(d,1)}
  if(!g){CHAT.m.push({who:'bot',html:`<p>Aucun créneau libre assez long dans les 2 prochains mois.</p>`});chatSave();chatRender(true);return true}
  P.title=agBookTitle(P.title);
  o.date=d;o.drange=null;o.rr=null;o.until=null;o.times=[];o.ranges=[[agHm(g[0]),agHm(Math.min(1439,g[0]+dur))]];o.period=null;o.allday=false;o.dur=dur;P.intent='rdv'}
 if(P.intent==='dispo'){
  let dp=agDispo();undo=dp?JSON.stringify(dp):'none';
  if(!dp){dp={id:'dispo',t:'dispo',w:[]};db.events.push(dp)}
  dp.w=dp.w.filter(w=>!w.d.some(d=>P.days.includes(d)));dp.w.push({d:P.days,r:P.ranges});
  out.push(`<p><svg class="i i-sm"><use href="#i-clock"/></svg> <span>Créneaux de travail enregistrés</span> : <b data-noi18n>${esc(agDispoTxt({w:[{d:P.days,r:P.ranges}]}))}</b></p><p class="mut">En dehors de ces horaires, ton planning affiche « Indisponible ».</p>`);
  act.push(goBtn())}
 else if(P.intent==='off'){
  const d=o.drange?o.drange[0]:o.date||(o.wkend?agAdd(agToday(),(6-new Date().getDay()+7)%7):agToday()),d2=o.drange?o.drange[1]:(o.wkend?agAdd(d,1):null);
  const r=o.ranges[0]||o.period||(o.times[0]?[o.times[0],agHm(agMin(o.times[0])+60)]:null);
  const why=/(vacances|conges?|ferie|maladie|formation)/.exec(agFold(P.F)),ev={id:uid(),t:'off',d,d2:d2||undefined,a:r?r[0]:null,b:r?r[1]:null,title:why?why[1][0].toUpperCase()+why[1].slice(1):'',src:'chat',at:Date.now()};
  db.events.push(ev);undo='add:'+ev.id;
  out.push(`<p><svg class="i i-sm"><use href="#i-cal"/></svg> <span>Noté comme indisponible</span></p>`+agCard(ev));act.push(goBtn(d))}
 else if(P.intent==='list'){
  const d=o.date||agToday(),d2=o.date?d:agAdd(d,6);
  const L=[];for(let x=d;x<=d2;x=agAdd(x,1))agDayEvents(x).forEach(e=>{if(!e.d2||x===d||x===e.d)L.push([e,x])});
  out.push(`<p><svg class="i i-sm"><use href="#i-cal"/></svg> <b data-noi18n>${esc(o.date?agFmtD(d):i18nT('Les 7 prochains jours'))}</b></p>`+(L.length?L.map(([e,x])=>agCard(e,null,x)).join(''):`<p class="mut">Rien de prévu.</p>`)+(agDispo()?`<p class="mut"><span>Créneaux de travail</span> : <span data-noi18n>${esc(agDispoTxt(agDispo()))}</span></p>`:''));act.push(goBtn(d))}
 else if(P.intent==='cancel'||P.intent==='move'){
  /* « décale le rdv de Martin à jeudi 14h » : Martin est dans le titre ; sans lui, on déplaçait le premier rendez-vous venu */
  const clT=!P.who&&P.title?(findBy(db.clients,P.title)||knownClient(P.title)):null,cl=P.who?findBy(db.clients,P.who.nom):clT;
  if(P.intent==='move'&&o.ranges.length===1&&o.times.length<2){o.times=[o.ranges[0][0],o.ranges[0][1]];o.ranges=[]}   // « de 14h à 16h » = déplacer de 14h vers 16h
  const narrow=!!(cl||P.who||o.date||o.times.length||(P.team&&P.team.length));
  let C=narrow?db.events.filter(e=>e.t==='rdv').map(e=>({e,n:agNextOcc(e,agToday())})).filter(x=>x.n):[];
  if(cl)C=C.filter(x=>x.e.cid===cl.id||(!x.e.cid&&nameKey(x.e.title).includes(nameKey(cl.nom))));else if(P.who)C=C.filter(x=>nameKey(x.e.title).includes(nameKey(P.who.nom)));
  else if(P.title&&/^\p{Lu}/u.test(P.title)){const k=nameKey(P.title),Cn=C.filter(x=>nameKey(x.e.title).includes(k));if(Cn.length||t.trim().indexOf(P.title)>0)C=Cn}
  if(P.team&&P.team.length&&!cl)C=C.filter(x=>(x.e.who||[]).some(id=>P.team.includes(id)));
  if(P.intent==='cancel'&&o.date)C=C.filter(x=>agOccurs(x.e,o.date)).map(x=>({e:x.e,n:o.date}));
  if(P.intent==='move'&&o.dates.length>1)C=C.filter(x=>agOccurs(x.e,o.dates[0])).map(x=>({e:x.e,n:o.dates[0]}));
  if(o.times.length>1&&P.intent==='move')C=C.filter(x=>x.e.a===o.times[0]);
  if(o.times.length&&P.intent==='cancel')C=C.filter(x=>x.e.a===o.times[0]);
  C.sort((a,b)=>(a.n+(a.e.a||'')).localeCompare(b.n+(b.e.a||'')));
  const ev=C[0]&&C[0].e,occ=C[0]&&C[0].n,all=/(?<![\p{L}])(tous|toutes|serie|chaque|tout)(?![\p{L}])/u.test(agFold(P.F));
  /* chantier sur plusieurs jours : annulé ou recalé en entier (sauf « ce jour-là » / jour précis à annuler) */
  if(ev&&ev.g&&!(P.intent==='cancel'&&(o.date||/(?<![\p{L}])(ce jour|seulement|juste)(?![\p{L}])/u.test(agFold(P.F))))&&!(P.intent==='move'&&!o.dates.length)){const S=agSerie(ev);
   if(P.intent==='cancel'){undo='sers:'+JSON.stringify(S)+'|';db.events=db.events.filter(e=>e.g!==ev.g);out.push(`<p><svg class="i i-sm"><use href="#i-x"/></svg> <span>Chantier annulé</span></p>`+agSerieCard(S))}
   else{const N=agSerieRecale(S,o.dates[o.dates.length-1]);
    if(!N)out.push(`<p>Aucun jour de travail libre à partir de cette date.</p>`);
    else{undo='sers:'+JSON.stringify(S)+'|'+N[0].g;out.push(`<p><svg class="i i-sm"><use href="#i-clock"/></svg> <span>Chantier recalé</span></p>`+agSerieCard(N));act.push(goBtn(N[0].d))}}}
  else if(!ev)out.push(narrow?`<p>Je ne trouve pas ce rendez-vous dans ton planning.</p>`:`<p>Précise le rendez-vous : le client, le jour ou l'heure.</p>`);
  else if(P.intent==='cancel'&&ev.rr&&!all){undo='mod:'+JSON.stringify(ev);ev.ex=(ev.ex||[]).concat(occ);ev.at=Date.now();agRemCompute(ev);out.push(`<p><svg class="i i-sm"><use href="#i-x"/></svg> <span>Rendez-vous annulé pour ce jour-là (la répétition continue)</span></p>`+agCard(ev,null,occ))}
  else if(P.intent==='cancel'){undo='del:'+JSON.stringify(ev);db.events=db.events.filter(e=>e!==ev);out.push(`<p><svg class="i i-sm"><use href="#i-x"/></svg> <span>Rendez-vous annulé</span></p>`+agCard(ev,null,occ))}
  else if(ev.rr){undo='mod:'+JSON.stringify(ev);const nd=o.dates.length?o.dates[o.dates.length-1]:occ,nt=o.times.length?o.times[o.times.length-1]:(o.ranges[0]?o.ranges[0][0]:ev.a),dur=ev.a&&ev.b?agMin(ev.b)-agMin(ev.a):60;
   ev.ex=(ev.ex||[]).concat(occ);const ne=Object.assign({},ev,{id:uid(),rr:undefined,ex:undefined,d:nd,a:nt,b:nt?agHm(Math.min(1439,agMin(nt)+dur)):ev.b,at:Date.now()});delete ne.rr;delete ne.ex;
   if(o.ranges[0])ne.b=o.ranges[0][1];db.events.push(ne);agRemCompute(ev);agRemCompute(ne);undo='mv2:'+JSON.stringify(ev)+'|'+ne.id;
   out.push(`<p><svg class="i i-sm"><use href="#i-clock"/></svg> <span>Rendez-vous déplacé pour ce jour-là</span></p>`+agCard(ne,agCheck(ne)));act.push(goBtn(nd))}
  else{undo='mod:'+JSON.stringify(ev);const nd=o.dates.length?o.dates[o.dates.length-1]:ev.d,nt=o.times.length?o.times[o.times.length-1]:(o.ranges[0]?o.ranges[0][0]:ev.a);
   const dur=ev.a&&ev.b?agMin(ev.b)-agMin(ev.a):60;ev.d=nd;if(nt){ev.a=nt;ev.b=agHm(Math.min(1439,agMin(nt)+dur))}if(o.ranges[0])ev.b=o.ranges[0][1];ev.at=Date.now();agRemCompute(ev);
   out.push(`<p><svg class="i i-sm"><use href="#i-clock"/></svg> <span>Rendez-vous déplacé</span></p>`+agCard(ev,agCheck(ev)));act.push(goBtn(nd))}}
 else if(P.intent==='free'){const R=agFree(P);out.push(R.html);act.push(goBtn(R.d))}
 else if(P.intent==='rdv'){
  let d=o.drange?o.drange[0]:o.date,a=null,b=null;
  if(o.ranges[0]){a=o.ranges[0][0];b=o.ranges[0][1]}else if(o.times[0]){a=o.times[0];const work=/(pose|mise|chantier|travaux|installation|renovation|peinture|carrelage|demolition|montage)/i.test(agFold(P.title));b=agHm(Math.min(1439,agMin(a)+(o.dur||(work?120:60))))}
  else if(o.period&&!o.allday){a=o.period[0];b=o.period[1]}
  if(o.allday){a=null;b=null}
  const rr=o.rr?Object.assign({},o.rr,o.until?{u:o.until}:{}):null;
  if(!d&&rr){const now=new Date(),nm=now.getHours()*60+now.getMinutes();d=agNextOcc({t:'rdv',d:agToday(),rr},a&&agMin(a)>nm?agToday():agAdd(agToday(),1))}
  if(!d){const now=new Date(),nm=now.getHours()*60+now.getMinutes();d=a&&agMin(a)>nm?agToday():agAdd(agToday(),1)}
  let cl=null,isNew=false,sup=null,pickM=null;
  if(P.who){sup=findBy(db.suppliers,P.who.nom);if(!sup){const M=cliMatches(P.who.nom);
   if(M.length===1&&!M.fz)cl=M[0];else if(M.length)pickM=M;else{const r=upsert('clients',{nom:chatCasse(P.who.nom)});cl=r.x;isNew=r.isNew}}}
  else{const kc=knownClient(t);if(kc){const M=cliMatches(kc.nom);if(M.length>1)pickM=M;else cl=kc}}
  if(cl&&P.title){const k=nameKey(cl.nom),w=P.title.split(/\s+/),nb=cl.nom.trim().split(/\s+/).length;
   if(nameKey(w.slice(0,nb).join(' '))===k&&w.length>nb){const r=w.slice(nb).join(' ').replace(/^(?:pour|:|-)\s*(?:le\s+|la\s+|les\s+|l['’]\s*|un\s+|une\s+|du\s+|des\s+)?/i,'').trim();if(r)P.title=r.charAt(0).toUpperCase()+r.slice(1)}}
  /* chantier sur plusieurs jours : calé tout seul sur les jours et créneaux de travail libres */
  const se=!rr&&!sup?agSerieDe(agFold(P.F),o,cl):null;
  if(se){const d0=o.drange?o.drange[0]:(o.date||agAdd(agToday(),1));
   const PL=agPlanSerie({d0,jours:se.jours,heures:se.heures,d1:se.d1||(se.semaines?agAdd(d0,se.semaines*7-1):null),a:o.ranges[0]?o.ranges[0][0]:null,b:o.ranges[0]?o.ranges[0][1]:null});
   if(PL.length){let tt=agSerieTitre(P.title||'');if(cl&&nameKey(tt)===nameKey(cl.nom))tt='';
    const S=agSerieCree(PL,{title:tt?tt[0].toUpperCase()+tt.slice(1):i18nT('Chantier'),cid:cl?cl.id:undefined,adr:cl&&cl.adr||'',who:P.team&&P.team.length?P.team.slice():undefined,src:'chat'});
    undo='ser:'+S[0].g+(isNew?':'+cl.id:'');P._ev=S[0].id;
    out.push(`<p><svg class="i i-sm"><use href="#i-cal"/></svg> <span>Chantier calé</span>${se.devis?` <span class="mut">· <span>d'après le devis</span> <span data-noi18n>${esc(se.devis)}</span></span>`:''}</p>`+agSerieCard(S));
    if(pickM)out.push(cliPickHtml(P.who?P.who.nom:pickM[0].nom,pickM,'ev:'+S[0].id));
    act.push(goBtn(S[0].d));save();out.push(`<div class="msg-act">${act.join('')}</div>`);
    CHAT.m.push({who:'bot',html:out.join(''),agUndo:undo,ev:P._ev});chatSave();chatRender(true);
    if(typeof agRender==='function'&&$('s-agenda')&&$('s-agenda').classList.contains('on'))agRender();return true}}
  const ev={id:uid(),t:'rdv',d,d2:o.drange?o.drange[1]:undefined,a,b,title:P.title||(sup?sup.nom:'')||(pickM&&P.who?P.who.nom:''),cid:cl?cl.id:undefined,adr:cl&&cl.adr||'',src:'chat',at:Date.now()};
  if(rr)ev.rr=rr;if(P.team&&P.team.length)ev.who=P.team.slice();agRemCompute(ev);
  if(sup&&!/chez/i.test(ev.title))ev.title=(P.title?P.title+' · ':'')+sup.nom;
  db.events.push(ev);undo='add:'+ev.id+(isNew?':'+cl.id:'');P._ev=ev.id;
  out.push(`<p><svg class="i i-sm"><use href="#i-cal"/></svg> <span>Ajouté à ton planning</span></p>`+agCard(ev,agCheck(ev)));
  if(cl)out.push(`<p><svg class="i i-sm"><use href="#i-user"/></svg> <span>Client</span> : <b data-noi18n>${esc(cl.nom)}</b> <span class="pill-s ${isNew?'new':''}">${isNew?'Nouveau, ajouté à tes clients':'Déjà dans tes clients'}</span></p>`);
  if(pickM)out.push(cliPickHtml(P.who?P.who.nom:pickM[0].nom,pickM,'ev:'+ev.id));
  if(cl)out.push(agAskQuote(cl,ev));else act.push(goBtn(d));
  }
 save();
 out.push(`<div class="msg-act">${act.join('')}</div>`);
 CHAT.m.push({who:'bot',html:out.join(''),agUndo:undo,ev:P._ev});chatSave();chatRender(true);
 if(typeof agRender==='function'&&$('s-agenda')&&$('s-agenda').classList.contains('on'))agRender();
 return true}
function agDurOf(f,o){
 let m=/(?<![\p{L}])(?:de |d'|pendant |pour |durant )?(\d{1,2})\s*h(?:eures?)?\s*(\d{2})?(?![\p{L}\d])/u.exec(f.replace(/(?<![\p{L}])(?:a|vers|des)\s+\d{1,2}\s*h(\d{2})?/gu,' '));
 if(o.dur)return o.dur;if(m)return (+m[1])*60+(+(m[2]||0));
 if(/demi-?\s?journee/.test(f))return 240;if(/(?<![\p{L}])(une |la |toute la )?journee/u.test(f))return 480;if(/une heure|1 heure/.test(f))return 60;return 60}
function agFree(P){
 const o=P.o,f=agFold(P.F),dur=agDurOf(f,o),cl=P.who?findBy(db.clients,P.who.nom)||{nom:P.who.nom}:null;
 // question précise : « suis-je libre jeudi à 14h ? »
 const at=/(?<![\p{L}])(a|vers)\s+\d{1,2}\s*h/u.test(f)&&o.times[0];
 if(at){const d=o.date||agToday(),a=agMin(o.times[0]),b=a+(/\d\s*h.*\d\s*h/.test(f)&&o.dur?o.dur:60),ok=agGaps(d,1).some(([x,y])=>a>=x&&b<=y),busy=agDayEvents(d).filter(e=>e.t==='rdv'&&e.a&&agMin(e.a)<b&&(e.b?agMin(e.b):agMin(e.a)+60)>a);
  return{d,html:`<p><svg class="i i-sm"><use href="#i-${ok?'check':'warn'}"/></svg> <b data-noi18n>${esc(agFmtD(d))} · ${esc(agH(o.times[0]))}</b> : <span>${ok?'Tu es libre.':busy.length?'Tu as déjà un rendez-vous.':'En dehors de tes créneaux de travail.'}</span></p>`+busy.map(e=>agCard(e,null,d)).join('')+(ok?`<div class="msg-act"><button class="btn sm" onclick="agBook('${d}','${o.times[0]}','${agHm(Math.min(1439,b))}',${esc(JSON.stringify(cl?cl.nom:''))})"><svg class="i"><use href="#i-plus"/></svg>Réserver ce créneau</button></div>`:'')}}
 let d0=agToday(),d1=agAdd(d0,6);
 if(o.date&&!o.nextWeek){d0=o.date;d1=o.date}
 else if(o.nextWeek){d0=o.date;d1=agAdd(o.date,6)}
 else if(o.thisWeek){d1=agAdd(agWeekStart(d0),6)}
 if(d0<agToday())d0=agToday();
 const S=[];for(let d=d0;d<=d1&&S.length<6;d=agAdd(d,1)){agGaps(d,dur).slice(0,2).forEach(([a,b])=>{if(S.length<6)S.push({d,a,b})})}
 const lc=I18N.lang==='fr'?'fr-FR':I18N.lang;
 const h=`<p><svg class="i i-sm"><use href="#i-search"/></svg> <span>Créneaux libres</span> <b data-noi18n>(${esc(agH(agHm(dur)))})</b>${cl?` · <span data-noi18n>${esc(cl.nom)}</span>`:''}</p>`+
  (S.length?`<div class="ag-slots">`+S.map(x=>`<button class="ag-slot" onclick="agBook('${x.d}','${agHm(x.a)}','${agHm(Math.min(1439,x.a+dur))}',${esc(JSON.stringify(cl?cl.nom:''))})"><b data-noi18n>${esc(agDate(x.d).toLocaleDateString(lc,{weekday:'short',day:'numeric',month:'short'}))}</b><span data-noi18n>${esc(agH(agHm(x.a))+'–'+agH(agHm(Math.min(1439,x.a+dur))))}</span>${x.b-x.a>dur+30?`<small data-noi18n>${esc(i18nT('libre jusqu\'à {1}').replace('{1}',agH(agHm(x.b))))}</small>`:''}</button>`).join('')+`</div><p class="mut">Touche un créneau pour le réserver.</p>`
  :`<p class="mut">Aucun créneau libre assez long sur cette période.</p>`)+(agDispo()?'':`<p class="mut">Sans créneaux de travail réglés, je cherche entre 8h et 18h.</p>`);
 return{d:d0,html:h}}

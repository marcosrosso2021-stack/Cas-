/* casô : veille réglementaire — le vérificateur juridique
   Il lit ce que le texte dit : nature, statut, référence, dates, articles. Ce qu'il ne trouve pas reste vide et va dans « manque » ;
   aucune date, aucun numéro n'est déduit d'autre chose que du texte officiel.
   Verifie : {officiel, reference, nature, statut ('adopte'|'projet'|'doctrine'|'info'), datePub, dateVigueur, differe, articles, manque} */
'use strict';
const {hoteAdmis}=require('./sources.js');

const MOIS={janvier:1,fevrier:2,'février':2,mars:3,avril:4,mai:5,juin:6,juillet:7,aout:8,'août':8,septembre:9,octobre:10,novembre:11,decembre:12,'décembre':12};
const DATE='(\\d{1,2})(?:er)?\\s+('+Object.keys(MOIS).join('|')+')\\s+(\\d{4})|(\\d{2})/(\\d{2})/(\\d{4})';
const p2=n=>String(n).padStart(2,'0');
/* les groupes d'une date trouvée -> AAAA-MM-JJ, ou '' si la date n'existe pas */
function iso(g){const j=+(g[0]||g[3]),m=g[1]?MOIS[g[1].toLowerCase()]:+g[4],a=+(g[2]||g[5]);
 const d=new Date(Date.UTC(a,m-1,j));return d.getUTCFullYear()===a&&d.getUTCMonth()===m-1&&d.getUTCDate()===j?a+'-'+p2(m)+'-'+p2(j):''}
function lendemain(d){const x=new Date(d+'T00:00:00Z');if(isNaN(x))return '';x.setUTCDate(x.getUTCDate()+1);return x.toISOString().slice(0,10)}
function dates(texte,avant){const re=new RegExp('(?:'+avant+')\\s+(?:'+DATE+')','gi'),out=new Set();let m;
 while((m=re.exec(texte))){const d=iso(m.slice(1));if(d)out.add(d)}return [...out]}

const VIGUEUR='entr(?:e|ent|era|eront)\\s+en\\s+vigueur\\s+(?:le|au|à\\s+compter\\s+du|a\\s+compter\\s+du)';
const COMPTER='(?:à|a)\\s+compter\\s+du';
const FLOU=/(?:à|a)\s+une\s+date\s+(?:fixée|fixee|déterminée|determinee|prévue|prevue)\s+par\s+(?:décret|decret|arrêté|arrete|voie réglementaire)|au\s+plus\s+tard\s+le/i;
const LENDEMAIN=/lendemain\s+de\s+(?:sa|leur|la)\s+publication/i;
const MENTION=/en\s+vigueur|(?:à|a)\s+compter\s+d|applicables?\s+(?:à|a|aux)\b|s['’]appliquent?\b/i;
const CODES='général des impôts|general des impots|de la consommation|civil|de la construction et de l\'habitation|du travail|de l\'urbanisme|de l\'environnement|de commerce|des assurances|de l\'énergie|de l\'energie|de la sécurité sociale|de la securite sociale|de la commande publique|monétaire et financier|rural et de la pêche maritime';
const ARTICLE=new RegExp('[Aa]rticles?\\s+(?:[LRDA]\\.?\\s*\\*?\\s*)?\\d[\\d-]*(?:\\s+(?:bis|ter|quater|quinquies|sexies|septies|octies|nonies))?(?:\\s+[A-Z]{1,2}\\b)?(?:\\s+du\\s+code\\s+(?:'+CODES+'))?','g');
const PROJET=/projet\s+de\s+loi|proposition\s+de\s+loi|projet\s+de\s+d[ée]cret|projet\s+d['’]ordonnance|projet\s+d['’]arr[êe]t[ée]|consultation\s+publique/i;

function nature(b){
 const t=String(b.titre||'');
 if((!b.nature||b.nature==='ACTU')&&PROJET.test(t))return 'PROJET';
 if(b.nature)return b.nature;
 if(/^\s*loi\b/i.test(t)||/\bloi\s+(?:organique\s+)?n°/i.test(t))return 'LOI';
 if(/^\s*ordonnance\b/i.test(t))return 'ORDONNANCE';
 if(/^\s*d[ée]cret\b/i.test(t))return 'DECRET';
 if(/^\s*arr[êe]t[ée]\b/i.test(t))return 'ARRETE';
 return ''}

function verifier(b,opts={}){
 const aujourdhui=opts.aujourdhui||new Date().toISOString().slice(0,10),texte=String(b.texte||'').replace(/\s+/g,' '),titre=String(b.titre||''),manque=[];
 const nat=nature(b),statut=/^(LOI|ORDONNANCE|DECRET|ARRETE)$/.test(nat)?'adopte':nat==='PROJET'?'projet':nat==='DOCTRINE'?'doctrine':nat==='METIER'?'metier':'info';
 const reference=String(b.numero||'')||((titre.match(/n°\s*(\d{4}-\d+)/)||[])[1]||'')||String(b.nor||'')||(((b.idSource||'')+' '+titre).match(/ACTU-\d{4}-\d{5}/)||[''])[0]
  ||(/^JORFTEXT\d{12}$/.test(b.idSource||'')?b.idSource:'');
 if(statut==='adopte'&&!reference)manque.push('reference');
 if(!/^\d{4}-\d\d-\d\d$/.test(b.datePub||''))manque.push('datePub');

 let dateVigueur='';
 if(statut!=='projet'){
  if(/^\d{4}-\d\d-\d\d$/.test(b.dateVigueur||''))dateVigueur=b.dateVigueur;
  else if(FLOU.test(texte)){if(statut==='adopte')manque.push('dateVigueur')}
  else{
   let d=dates(texte,VIGUEUR);if(!d.length)d=dates(texte,COMPTER);
   if(d.length===1)dateVigueur=d[0];
   else if(d.length>1){if(statut==='adopte')manque.push('dateVigueur')}      // plusieurs dates : à lire par un humain
   else if(statut==='adopte'){
    if(LENDEMAIN.test(texte))dateVigueur=lendemain(b.datePub||'');             // écrit dans le texte
    else if(b.complet===false||MENTION.test(texte))manque.push('dateVigueur'); // texte complet non lu, ou entrée en vigueur dite autrement : rien à déduire
    else dateVigueur=lendemain(b.datePub||'');                                // le texte n'en dit rien : règle générale, le lendemain de la publication
    if(!dateVigueur&&!manque.includes('dateVigueur'))manque.push('dateVigueur')}
   else if(LENDEMAIN.test(texte))dateVigueur=lendemain(b.datePub||'')}}

 const articles=[];let m;ARTICLE.lastIndex=0;
 while((m=ARTICLE.exec(texte))&&articles.length<30){const a=m[0].replace(/\s+/g,' ').trim();if(!articles.includes(a))articles.push(a)}
 return {officiel:hoteAdmis(b.url),reference,nature:nat,statut,datePub:b.datePub||'',dateVigueur,differe:!!dateVigueur&&dateVigueur>aujourdhui,articles,manque}}

module.exports={verifier,lendemain};

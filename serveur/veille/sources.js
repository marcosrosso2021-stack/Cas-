/* casô : veille réglementaire — le collecteur (sources officielles seulement)
   - BOFiP et Entreprendre.service-public : flux publics, sans clé
   - Légifrance (Journal officiel) : API PISTE, gratuite après inscription ; variables PISTE_CLIENT_ID et PISTE_CLIENT_SECRET.
     Sans elles la source est inactive, sans erreur.
   Une source en panne n'arrête pas les autres : l'erreur est rendue dans « erreurs ».
   Brut : {source, idSource, titre, url, datePub, resume, texte, nature, numero, nor, dateVigueur, complet} */
'use strict';

const HOTES=new Set(['legifrance.gouv.fr','www.legifrance.gouv.fr','bofip.impots.gouv.fr','www.service-public.gouv.fr',
 'entreprendre.service-public.gouv.fr','entreprendre.service-public.fr','www.service-public.fr','service-public.fr',
 'www.vie-publique.fr','vie-publique.fr','www.ecologie.gouv.fr','ecologie.gouv.fr','www.cnil.fr','cnil.fr','www.economie.gouv.fr','economie.gouv.fr','travail-emploi.gouv.fr','www.travail-emploi.gouv.fr','rt-re-batiment.developpement-durable.gouv.fr']);
const BOFIP='https://bofip.impots.gouv.fr/bofip/ext/rss.xml?actualites=1&series=TVA:TVA-CHAMP:TVA-BASE:TVA-LIQ:TVA-DED:TVA-DECLA:TVA-PROCD:TVA-SECT:TVA-IMM:BIC:IS&maxR=50&maxJ=14';
const ENTREPRENDRE='https://www.service-public.gouv.fr/abonnements/rss/actu-actu-pro.rss';
/* les autres sources officielles, toutes en flux publics sans clé :
   - particuliers : actualités Service-Public pour les particuliers (aides à la rénovation, DPE, droits des clients)
   - viepublique : panorama des lois de la DILA (projets et lois votées : ce qui va changer)
   - ecologie : ministère de la Transition écologique (rénovation, RE2020, déchets, énergie)
   - cnil : protection des données (clients, géolocalisation, photos)
   - economie : ministère de l'Économie (facturation, TVA, aides aux entreprises, arnaques)
   - travail : ministère du Travail (salariés, apprentis, sécurité au travail)
   - re2020 : portail officiel des réglementations énergétiques des bâtiments (RE2020, RT) */
const AUTRES=[['particuliers','https://www.service-public.gouv.fr/abonnements/rss/actu-actualites-particuliers.rss'],['viepublique','https://www.vie-publique.fr/lois-feeds.xml'],
 ['ecologie','https://www.ecologie.gouv.fr/rss-actualites.xml'],['cnil','https://www.cnil.fr/fr/rss.xml'],
 ['economie','https://www.economie.gouv.fr/rss/toutesactualites'],['travail','https://travail-emploi.gouv.fr/rss.xml'],['re2020','https://rt-re-batiment.developpement-durable.gouv.fr/spip.php?page=backend']];
/* les sources du métier (nouveaux outils, matériels, techniques, règles de l'art) : presse professionnelle et organisation des artisans.
   Elles ne prouvent jamais une obligation : leurs articles sont rangés à part (« nouveauté du métier ») et renvoient vers l'article. */
const METIER=[['capeb','https://www.capeb.fr/rss'],['batiactu','https://www.batiactu.com/accueil.rss'],
 ['batimentartisanal','https://www.lebatimentartisanal.com/feed'],['batijournal','https://batijournal.com/index.php/feed/']];
const HOTES_METIER=new Set(['www.capeb.fr','capeb.fr','www.batiactu.com','batiactu.com','www.lebatimentartisanal.com','lebatimentartisanal.com','batijournal.com','www.batijournal.com']);
const PISTE_JETON='https://oauth.piste.gouv.fr/api/oauth/token',PISTE_API='https://api.piste.gouv.fr/dila/legifrance/lf-engine-app';
/* sans accents, en minuscules ; un mot compte s'il commence un mot du titre ou du résumé */
const MOTS=['batiment','construction','travaux','renovation','artisan','tva','taxe sur la valeur ajoutee','facture','facturation electronique','devis',
 'sous-traitance','decennale','assurance construction','performance energetique','maprimerenov','economies d\'energie','amiante','plomb','accessibilite',
 'urbanisme','permis de construire','declaration prealable','dechets','chantier','re2020','donnees personnelles','signature electronique','micro-entrepr','cotisations',
 'loi de finances','dpe','diagnostic de performance','renovation energetique'];

const ENT={amp:'&',lt:'<',gt:'>',quot:'"',apos:'\'',nbsp:' ',eacute:'é',egrave:'è',ecirc:'ê',euml:'ë',agrave:'à',acirc:'â',ccedil:'ç',ocirc:'ô',ucirc:'û',ugrave:'ù',
 icirc:'î',iuml:'ï',oelig:'œ',laquo:'«',raquo:'»',rsquo:'’',lsquo:'‘',ndash:'–',mdash:'—',hellip:'…',deg:'°',euro:'€',Eacute:'É',Agrave:'À'};
const entites=s=>s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(m,k)=>{
 if(k[0]==='#'){const n=k[1]==='x'||k[1]==='X'?parseInt(k.slice(2),16):parseInt(k.slice(1),10);return n>31&&n<0x110000?String.fromCodePoint(n):' '}
 return Object.prototype.hasOwnProperty.call(ENT,k)?ENT[k]:m});
/* texte d'un flux -> texte simple : ni balises, ni scripts, ni entités */
function propre(s,n){
 s=entites(String(s==null?'':s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1'));
 s=s.replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi,' ').replace(/<[^>]*>/g,' ');
 return entites(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,n||4000)}
const plat=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[’`]/g,'\'');

function hoteMetier(url){try{const u=new URL(String(url||''));return u.protocol==='https:'&&HOTES_METIER.has(u.hostname)}catch(e){return false}}
function hoteAdmis(url){try{const u=new URL(String(url||''));return u.protocol==='https:'&&HOTES.has(u.hostname)}catch(e){return false}}
/* les sources larges (ministère, CNIL, lois, particuliers) parlent de tout : seul le titre compte, sans les mots trop généraux */
const LARGES=new Set(['particuliers','viepublique','ecologie','cnil','economie','travail','re2020']),GENERAUX=new Set(['travaux','construction','chantier','cotisations','plomb','facture','artisan']);
function pertinentStrict(titre){const t=' '+plat(titre)+' ';
 return MOTS.filter(m=>!GENERAUX.has(m)).some(m=>{let i=-1;while((i=t.indexOf(m,i+1))>=0)if(!/[a-z0-9]/.test(t[i-1]))return true;return false})}
/* métier : outils, matériels, techniques, sécurité, règles de l'art ; pas la vie des grandes entreprises */
const MOTS_METIER=['outil','outillage','materiel','materiau','innovation','nouveaute','nouveau produit','logiciel','application','regles de l\'art','technique',
 'securite','oppbtp','silice','amiante','chantier','isolation','pompe a chaleur','menuiserie','carrel','maconn','plomberie','electricite','peinture','couverture','charpente','bois','beton','humidite','solaire'];
const HORS_METIER=['deces','nomination','nomme','contrat','chiffre d\'affaires','resultats','rachat','acquisition','cession','bourse','au maroc','presidentielle','candidat'];
function pertinentMetier(titre){const t=' '+plat(titre)+' ';if(HORS_METIER.some(m=>t.includes(m)))return false;
 return pertinentStrict(titre)||MOTS_METIER.some(m=>{let i=-1;while((i=t.indexOf(m,i+1))>=0)if(!/[a-z0-9]/.test(t[i-1]))return true;return false})}
function pertinent(titre,resume){const t=' '+plat(titre)+' '+plat(resume)+' ';
 return MOTS.some(m=>{let i=-1;while((i=t.indexOf(m,i+1))>=0)if(!/[a-z0-9]/.test(t[i-1]))return true;return false})}

const NATURE={capeb:'METIER',batiactu:'METIER',batimentartisanal:'METIER',batijournal:'METIER',economie:'ACTU',travail:'ACTU',re2020:'ACTU',bofip:'DOCTRINE',entreprendre:'ACTU',particuliers:'ACTU',ecologie:'ACTU',cnil:'ACTU',viepublique:''};
function dateFlux(bloc,desc){
 const iso=(bloc.match(/<(?:dc:date|updated|published)[^>]*>\s*(\d{4}-\d\d-\d\d)/i)||[])[1];if(iso)return iso;
 const p=(bloc.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)||[])[1];
 if(p){const d=new Date(p.trim());if(!isNaN(d))return d.toISOString().slice(0,10)}
 const f=desc.match(/publié le (\d\d)\/(\d\d)\/(\d{4})/i);return f?f[3]+'-'+f[2]+'-'+f[1]:''}

/* un flux RSS (ou Atom) -> Brut[] ; un article sans date ou sans identifiant n'est pas rendu */
function lireRss(xml,source){
 xml=String(xml||'');if(!/<(rss|feed|rdf:RDF)[\s>]/i.test(xml))throw new Error('ce n\'est pas un flux');
 const out=[],vus=new Set(),blocs=xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi)||[];
 const champ=(b,n)=>{const m=b.match(new RegExp('<'+n+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+n+'>','i'));return m?m[1]:''};
 for(const b of blocs){
  const titre=propre(champ(b,'title'),400),resume=propre(champ(b,'description')||champ(b,'summary')||champ(b,'content'),4000);
  const lien=propre(champ(b,'link'),600)||((b.match(/<link[^>]*href="([^"]+)"/i)||[])[1]||''),guid=propre(champ(b,'guid')||champ(b,'id'),300);
  const url=hoteAdmis(lien)||(NATURE[source]==='METIER'&&hoteMetier(lien))?(LARGES.has(source)||NATURE[source]==='METIER'?lien.split(/[?#]/)[0]:lien):'',datePub=dateFlux(b,resume);
  let idSource=guid||url,numero='';
  if(source==='bofip'){const m=(lien+' '+resume+' '+guid).match(/ACTU-\d{4}-\d{5}/);if(m)idSource=numero=m[0]}
  if(source==='entreprendre'||source==='particuliers'){const m=(guid+' '+lien).match(/\bA\d{4,}\b/);if(m)idSource=m[0]}   // l'identifiant de l'article, pas celui du jour
  if(!titre||!idSource||!datePub||vus.has(idSource))continue;
  if(NATURE[source]==='METIER'&&!url)continue;   // presse : un article sans lien vers le site lui-même est une publicitévus.add(idSource);
  const o={source,idSource,titre,url,datePub,resume,texte:resume,nature:NATURE[source]||'',numero,nor:'',dateVigueur:''};
  if(source==='viepublique')o.complet=false;   // une fiche de suivi, pas le texte : aucune date d'entrée en vigueur n'en est déduite
  out.push(o)}
 return out}

/* Journal officiel : tous les textes d'un sommaire, hors mesures nominatives */
function lireJorf(json,datePub){
 const out=[],vus=new Set();
 (function voir(o,nominatif){
  if(Array.isArray(o))return o.forEach(x=>voir(x,nominatif));
  if(!o||typeof o!=='object')return;
  const titre=typeof o.titre==='string'?o.titre:typeof o.title==='string'?o.title:'';
  if(/mesures nominatives/i.test(titre))nominatif=true;
  if(typeof o.id==='string'&&/^JORFTEXT\d{12}$/.test(o.id)&&titre&&!nominatif&&!vus.has(o.id)){vus.add(o.id);
   out.push({source:'legifrance',idSource:o.id,titre:propre(titre,400),url:'https://www.legifrance.gouv.fr/jorf/id/'+o.id,datePub,resume:'',texte:propre(titre,400),
    nature:/^(LOI|ORDONNANCE|DECRET|ARRETE)$/.test(o.nature)?o.nature:'',numero:'',nor:typeof o.nor==='string'?propre(o.nor,20):'',dateVigueur:'',complet:false})}
  for(const k of Object.keys(o))voir(o[k],nominatif)})(json,false);
 return out}
/* le texte complet d'une fiche du Journal officiel : tout ce qui se lit */
function texteJorf(json){const m=[];(function voir(o,k){
  if(typeof o==='string'){if(/^(content|notice|texte|visa|nota|titre|title)$/i.test(k||'')&&o.length>3)m.push(o);return}
  if(Array.isArray(o))return o.forEach(x=>voir(x,k));
  if(o&&typeof o==='object')for(const c of Object.keys(o))voir(o[c],c)})(json,'');
 return propre(m.join(' '),40000)}
const jourMs=v=>{const d=typeof v==='number'?new Date(v):new Date(String(v||''));return isNaN(d)?'':d.toISOString().slice(0,10)};

function creer(opts={}){
 const env=opts.env||process.env,F=opts.fetch||globalThis.fetch,log=opts.log||console.error;
 const ID=env.PISTE_CLIENT_ID||'',SEC=env.PISTE_CLIENT_SECRET||'';
 const actives=()=>['bofip','entreprendre'].concat(AUTRES.map(x=>x[0]),METIER.map(x=>x[0]),ID&&SEC?['legifrance']:[]);
 async function appel(url,init){const ac=new AbortController(),to=setTimeout(()=>ac.abort(),20000);
  try{const r=await F(url,Object.assign({signal:ac.signal},init||{}));if(!r.ok)throw new Error('réponse '+r.status);return r}finally{clearTimeout(to)}}
 async function flux(url,source){const r=await appel(url,{headers:{accept:'application/rss+xml, application/xml, text/xml'}});return lireRss(await r.text(),source)}

 let jeton='',fin=0;
 async function piste(chemin,corps){
  if(!jeton||Date.now()>fin){
   const r=await appel(PISTE_JETON,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'client_credentials',client_id:ID,client_secret:SEC,scope:'openid'}).toString()});
   const j=await r.json();if(!j||typeof j.access_token!=='string')throw new Error('jeton refusé');
   jeton=j.access_token;fin=Date.now()+Math.max(60,(+j.expires_in||3600)-120)*1000}
  const r=await appel(PISTE_API+chemin,{method:'POST',headers:{authorization:'Bearer '+jeton,'content-type':'application/json',accept:'application/json'},body:JSON.stringify(corps)});
  return r.json()}
 async function legifrance(){
  const dern=await piste('/consult/lastNJo',{nbElement:3}),out=[];
  const conts=(dern&&(dern.containers||dern.results||dern.items)||[]).filter(c=>c&&typeof c.id==='string').slice(0,3);
  if(!conts.length)throw new Error('aucun Journal officiel rendu');
  for(const c of conts){
   const som=await piste('/consult/jorfCont',{id:c.id,pageNumber:1,pageSize:100});
   out.push(...lireJorf(som,jourMs(c.datePubli||c.dateParution||c.date)).filter(b=>b.datePub&&pertinent(b.titre,'')))}
  /* le texte complet des textes gardés (30 au plus par passage) : sans lui, aucune date d'entrée en vigueur n'est déduite */
  for(const b of out.slice(0,30)){try{const t=texteJorf(await piste('/consult/jorf',{textCid:b.idSource}));if(t.length>=40&&t!==b.texte){b.texte=t;b.complet=true}}
   catch(e){log('[casô] veille : texte complet non lu',b.idSource)}}
  return out}

 async function collecter(){
  const bruts=[],erreurs=[],L=[['bofip',()=>flux(BOFIP,'bofip')],['entreprendre',()=>flux(ENTREPRENDRE,'entreprendre')]].concat(AUTRES.map(([s,u])=>[s,()=>flux(u,s)]),METIER.map(([s,u])=>[s,()=>flux(u,s)]));
  if(ID&&SEC)L.push(['legifrance',legifrance]);
  const vus=new Set();   // un même article Service-Public peut être dans les flux pros et particuliers : gardé une fois
  for(const [source,lire] of L){
   try{const v=await lire();bruts.push(...(source==='legifrance'?v:v.filter(b=>NATURE[source]==='METIER'?pertinentMetier(b.titre):LARGES.has(source)?pertinentStrict(b.titre):pertinent(b.titre,b.resume))).filter(b=>{
    const k=(b.source==='particuliers'?'entreprendre':b.source)+':'+b.idSource;if(vus.has(k))return false;vus.add(k);return true}))}
   catch(e){const erreur=String(e&&e.name==='AbortError'?'délai dépassé':e&&e.message||'erreur').slice(0,120);erreurs.push({source,erreur});log('[casô] veille : source en erreur',source,erreur)}}
  return {bruts,erreurs}}
 return {collecter,actives};
}

module.exports={creer,AUTRES,METIER,LARGES,pertinentStrict,pertinentMetier,hoteMetier,lireRss,lireJorf,texteJorf,pertinent,hoteAdmis,propre,HOTES,MOTS};

/* casô : veille réglementaire — le passage quotidien
   collecte -> base -> vérification -> contrôle. Rien n'est envoyé aux artisans ici : chaque texte attend la validation du propriétaire.
   Variables : PISTE_CLIENT_ID, PISTE_CLIENT_SECRET (Légifrance, facultatives). Fichiers : veille.json, veille.json.bak, veille-preuves/. */
'use strict';
const baseLib=require('./base.js'),sourcesLib=require('./sources.js'),{verifier}=require('./verif.js'),{classer,bilan,CAT}=require('./controle.js');
const {analyser,apprendre,MODULES,PRIORITES,DOMAINES}=require('./analyse.js');

/* le lundi qui suit une date (jamais le jour même) */
function lundi(d){const x=new Date(d+'T00:00:00Z');do{x.setUTCDate(x.getUTCDate()+1)}while(x.getUTCDay()!==1);return x.toISOString().slice(0,10)}

function creer(opts={}){
 const maintenant=opts.maintenant||(()=>new Date()),log=opts.log||console.error;
 const base=baseLib.ouvrir(opts.dir,{maintenant,log}),src=opts.sources||sourcesLib.creer({env:opts.env,fetch:opts.fetch,log});
 let enCours=null;

 async function faire(){
  const {bruts,erreurs}=await src.collecter(),auj=maintenant().toISOString().slice(0,10),res=[];
  for(const e of erreurs)base.journal('erreur',e);
  const V=bruts.map(b=>({b,v:verifier(b,{aujourdhui:auj})}));
  let nouveaux=0,modifies=0,bloques=0;
  for(const x of V){
   const r=base.recevoir(Object.assign({},x.b,{dateVigueur:x.v.dateVigueur})),f=base.lire(r.id);
   const autres=x.v.reference?V.filter(y=>y!==x&&y.v.reference===x.v.reference).map(y=>y.v):[];
   const c=classer(x.v,{etat:r.etat,dejaValide:f.validation==='valide',autres});res.push(c);
   const fiche={numero:x.v.reference,dateVigueur:x.v.dateVigueur,articles:x.v.articles,nature:x.v.nature,statut:x.v.statut,categorie:c.categorie,bloque:c.bloque,raisons:c.raisons,dateVerif:auj};
   if(r.etat==='nouveau'){base.completer(r.id,fiche);base.completer(r.id,analyse(f,auj));nouveaux++;if(c.bloque)bloques++}
   else if(r.etat==='modifie'){f.corrige=[];f.lettre=false;f.publieLe='';f.pousse=false;base.noter(r.id,fiche,'controle');base.completer(r.id,analyse(f,auj));modifies++;if(c.bloque)bloques++}
   else if(c.categorie!==CAT.aucun&&c.categorie!==f.categorie)base.noter(r.id,{categorie:c.categorie,dateVerif:auj},'controle');
   else base.vu(r.id,auj)}
  /* la priorité suit le délai : elle est recalculée chaque jour pour les textes gardés, sauf si le propriétaire l'a fixée */
  for(const g of base.liste()){if(g.validation==='refuse'||!g.categorie)continue;const n=analyse(g,auj);
   if(n.priorite!==g.priorite&&!(g.corrige||[]).includes('priorite')){base.journal('priorite',{id:g.id,de:g.priorite,a:n.priorite});base.completer(g.id,{priorite:n.priorite})}}
  const b=bilan(res),out={nouveaux,modifies,bloques,erreurs:erreurs.length};
  base.journal('passage',Object.assign({nouveautes:b.nouveautes},out));base.passage(maintenant().toISOString());
  try{base.enregistrer()}catch(e){log('[casô] veille : base non enregistrée',e&&e.code)}
  return out}
 /* l'analyse d'une fiche, sans toucher à ce que le propriétaire a corrigé */
 function analyse(f,auj){const n=analyser(f,{aujourdhui:auj,appris:base.appris()}),p={},c=f.corrige||[];
  for(const k of ['domaines','pros','modules','actions','priorite'])if(!c.includes(k))p[k]=n[k];return p}
 /* la décision du propriétaire : valider, refuser, avec ou sans corrections. Sans elle, rien ne part. */
 function decider(id,decision,corr){
  const f=base.lire(id);if(!f)return [404,{error:'Texte inconnu.'}];
  if(decision!=='valide'&&decision!=='refuse'&&decision!=='attente')return [400,{error:'Décision inconnue.'}];
  corr=corr&&typeof corr==='object'?corr:{};const p={},corrige=(f.corrige||[]).slice(),liste=(v,ok,n)=>Array.isArray(v)?[...new Set(v.map(x=>String(x).trim().slice(0,200)).filter(x=>x&&(!ok||ok.includes(x))))].slice(0,n):null;
  if(corr.categorie!==undefined){if(!Object.prototype.hasOwnProperty.call(CAT,corr.categorie)||corr.categorie===CAT.aucun)return [400,{error:'Catégorie inconnue.'}];p.categorie=corr.categorie}
  if(corr.priorite!==undefined){if(!PRIORITES.includes(corr.priorite))return [400,{error:'Priorité inconnue.'}];p.priorite=corr.priorite}
  if(corr.dateVigueur!==undefined){const dv=String(corr.dateVigueur);if(dv&&(!/^\d{4}-\d\d-\d\d$/.test(dv)||isNaN(Date.parse(dv+'T00:00:00Z'))))return [400,{error:'Date invalide.'}];p.dateVigueur=dv}
  for(const [k,ok,n] of [['modules',MODULES,13],['domaines',Object.keys(DOMAINES),8],['pros',null,12],['actions',null,12]])if(corr[k]!==undefined){const v=liste(corr[k],ok,n);if(!v)return [400,{error:'Liste invalide.'}];p[k]=v}
  if(corr.nouvelle!==undefined)p.nouvelle=String(corr.nouvelle).replace(/\s+/g,' ').trim().slice(0,2000);
  /* la newsletter : la ligne « À faire » écrite par le propriétaire, et son accord pour l'envoi aux artisans */
  if(corr.aFaire!==undefined)p.aFaire=String(corr.aFaire).replace(/\s+/g,' ').trim().slice(0,240);
  if(corr.lettre!==undefined)p.lettre=corr.lettre===true;
  const cat=p.categorie||f.categorie;
  /* une information non confirmée ou une date manquante ne se valide pas telle quelle : il faut la corriger ou la refuser */
  if(decision==='valide'){
   if(cat===CAT.non_confirme)return [409,{error:'Texte non confirmé : change sa catégorie ou refuse-le.'}];
   if((cat===CAT.confirme||cat===CAT.echeance)&&!(p.dateVigueur!==undefined?p.dateVigueur:f.dateVigueur))return [409,{error:'Date d\'entrée en vigueur manquante.'}];
   p.bloque=false;p.raisons=[]}
  for(const k of Object.keys(p))if(k!=='bloque'&&k!=='raisons'&&!corrige.includes(k))corrige.push(k);
  if(p.modules)apprendre(base.appris(),f,f.modules||[],p.modules);
  const auj=maintenant().toISOString().slice(0,10);
  base.noter(id,Object.assign(p,{validation:decision,corrige,dateValidation:decision==='attente'?'':auj}),'proprietaire');
  if(p.priorite===undefined)base.completer(id,analyse(base.lire(id),auj));
  /* date d'envoi : tout de suite pour un texte critique, sinon le lundi suivant ; retirée si l'accord est retiré */
  {const g=base.lire(id),envoi=g.validation==='valide'&&g.lettre===true;
   if(!envoi)base.completer(id,{publieLe:'',pousse:false});
   else if(!g.publieLe)base.completer(id,{publieLe:g.priorite==='P0'?auj:lundi(auj),pousse:false})}
  base.journal('decision',{id,decision,champs:Object.keys(corr).slice(0,10)});
  try{base.enregistrer()}catch(e){log('[casô] veille : base non enregistrée',e&&e.code)}
  return [200,voir(base.lire(id))]}
 /* la newsletter telle que l'appli la lit : seulement ce que le propriétaire a validé et choisi d'envoyer, à partir de sa date d'envoi */
 const publies=auj=>base.liste({validation:'valide'}).filter(f=>f.lettre===true&&!f.bloque&&f.publieLe&&f.publieLe<=auj&&f.categorie!==CAT.non_confirme);
 function lettre(){const auj=maintenant().toISOString().slice(0,10);
  return publies(auj).sort((x,y)=>x.publieLe<y.publieLe?1:x.publieLe>y.publieLe?-1:0).slice(0,50).map(f=>({id:f.id,titre:f.titre,resume:String(f.nouvelle||'').slice(0,600),url:f.url,datePub:f.datePub,
   dateVigueur:f.dateVigueur,categorie:f.categorie,priorite:f.priorite,pros:f.pros||[],aFaire:f.aFaire||'',publieLe:f.publieLe}))}
 /* ce qui est sorti et n'a pas encore été annoncé par notification */
 function aAnnoncer(){const auj=maintenant().toISOString().slice(0,10);return publies(auj).filter(f=>!f.pousse).map(f=>({id:f.id,titre:f.titre,priorite:f.priorite,pros:f.pros||[]}))}
 function annonce(ids){for(const id of ids)base.completer(id,{pousse:true});try{base.enregistrer()}catch(e){log('[casô] veille : base non enregistrée',e&&e.code)}}
 /* une fiche telle que le tableau de bord la montre : avec son délai du jour */
 function voir(f){const auj=maintenant().toISOString().slice(0,10);
  return Object.assign({},f,{delaiJours:f.dateVigueur?Math.round((Date.parse(f.dateVigueur+'T00:00:00Z')-Date.parse(auj+'T00:00:00Z'))/864e5):null})}
 /* un seul passage à la fois : le second appel attend le premier */
 function passer(){if(!enCours)enCours=faire().finally(()=>{enCours=null});return enCours}
 /* un passage par jour, à partir de 5 h (heure universelle) */
 function aFaire(d){return d.getUTCHours()>=5&&String(base.etat().dernierPassage).slice(0,10)!==d.toISOString().slice(0,10)}
 /* « erreursDernier » : les sources en erreur au dernier passage seulement */
 const etat=()=>{const p=base.dernieres(200).find(x=>x.type==='passage');return Object.assign(base.etat(),{sources:src.actives(),erreursDernier:p&&p.detail?p.detail.erreurs||0:0})};
 const liste=fi=>base.liste(fi).filter(f=>!fi||((!fi.priorite||f.priorite===fi.priorite)&&(!fi.domaine||(f.domaines||[]).includes(fi.domaine)))).map(voir);
 return {passer,aFaire,etat,liste,lire:id=>base.lire(id),decider,journal:n=>base.dernieres(n||50),lettre,aAnnoncer,annonce};
}

module.exports={creer,lundi,CAT,MODULES,PRIORITES,DOMAINES:Object.keys(DOMAINES)};

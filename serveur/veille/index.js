/* casô : veille réglementaire — le passage quotidien
   collecte -> base -> vérification -> contrôle. Rien n'est envoyé aux artisans ici : chaque texte attend la validation du propriétaire.
   Variables : PISTE_CLIENT_ID, PISTE_CLIENT_SECRET (Légifrance, facultatives). Fichiers : veille.json, veille.json.bak, veille-preuves/. */
'use strict';
const baseLib=require('./base.js'),sourcesLib=require('./sources.js'),{verifier}=require('./verif.js'),{classer,bilan,CAT}=require('./controle.js');

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
   if(r.etat==='nouveau'){base.completer(r.id,fiche);nouveaux++;if(c.bloque)bloques++}
   else if(r.etat==='modifie'){base.noter(r.id,fiche,'controle');modifies++;if(c.bloque)bloques++}
   else if(c.categorie!==CAT.aucun&&c.categorie!==f.categorie)base.noter(r.id,{categorie:c.categorie,dateVerif:auj},'controle');
   else base.vu(r.id,auj)}
  const b=bilan(res),out={nouveaux,modifies,bloques,erreurs:erreurs.length};
  base.journal('passage',Object.assign({nouveautes:b.nouveautes},out));base.passage(maintenant().toISOString());
  try{base.enregistrer()}catch(e){log('[casô] veille : base non enregistrée',e&&e.code)}
  return out}
 /* un seul passage à la fois : le second appel attend le premier */
 function passer(){if(!enCours)enCours=faire().finally(()=>{enCours=null});return enCours}
 /* un passage par jour, à partir de 5 h (heure universelle) */
 function aFaire(d){return d.getUTCHours()>=5&&String(base.etat().dernierPassage).slice(0,10)!==d.toISOString().slice(0,10)}
 const etat=()=>Object.assign(base.etat(),{sources:src.actives()});
 return {passer,aFaire,etat,liste:f=>base.liste(f),lire:id=>base.lire(id)};
}

module.exports={creer,CAT};

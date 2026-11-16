/* casô : veille réglementaire — l'analyste réglementaire et l'analyste produit
   Il range un texte par domaine, dit quels professionnels et quels modules de casô sont touchés, et calcule la priorité.
   Tout vient de tables fixes et de ce que le propriétaire a corrigé : aucune phrase n'est rédigée, aucune obligation n'est déduite.
   Apprentissage : un mot du titre compte quand deux corrections au moins vont dans le même sens. */
'use strict';
const plat=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[’`]/g,'\'');
const a=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const dans=(t,mots)=>mots.some(m=>{let i=-1;while((i=t.indexOf(m,i+1))>=0)if(!/[a-z0-9]/.test(t[i-1]||' '))return true;return false});

/* les 8 filtres du tableau de bord */
const DOMAINES={
 fiscalite:['tva','taxe sur la valeur ajoutee','impot','fiscal','cotisation fonciere','credit d\'impot','autoliquidation','franchise en base','bofip','declaration de chiffre'],
 facturation:['facture','facturation','devis','acompte','avoir','e-reporting','e-invoicing','plateforme agreee','mentions obligatoires','mention obligatoire','archivage'],
 assurance:['decennale','assurance','responsabilite civile','dommages-ouvrage','garantie de parfait achevement','garantie biennale'],
 construction:['construction','re2020','batiment neuf','chantier','securite des chantiers','materiaux','dtu','reception des travaux','sous-traitance','sous-traitant'],
 renovation:['renovation','maprimerenov','economies d\'energie','performance energetique','dpe','diagnostic','amiante','plomb','rge','isolation','pompe a chaleur','chauffage'],
 urbanisme:['urbanisme','permis de construire','declaration prealable','plan local d\'urbanisme','accessibilite','dechets'],
 numerique:['signature electronique','intelligence artificielle','cybersecurite','logiciel','numerique','plateforme','dematerialis','en ligne'],
 donnees:['donnees personnelles','rgpd','cnil','geolocalisation','conservation des donnees','hebergement des donnees','photographies']};
/* professionnels concernés : ce que le texte nomme ; sinon « artisans du bâtiment » */
const PROS={
 'micro-entrepreneurs':['micro-entrepr','auto-entrepr','franchise en base'],
 'sous-traitants':['sous-traitan','autoliquidation'],
 'entreprises RGE':['rge','maprimerenov','economies d\'energie'],
 'employeurs':['salarie','employeur','cotisations','urssaf','prime de transport'],
 'électriciens':['electricien','installation electrique','borne de recharge'],
 'plombiers-chauffagistes':['plombier','chauffagiste','chauffage','pompe a chaleur','chaudiere'],
 'couvreurs':['couvreur','toiture','couverture'],
 'maçons':['macon','maconnerie','gros oeuvre'],
 'menuisiers':['menuisier','menuiserie','fenetre'],
 'peintres':['peintre','peinture'],
 'diagnostiqueurs':['diagnostiqueur','dpe','diagnostic amiante']};
/* sujet -> modules de casô et action à prévoir (côté logiciel) */
const SUJETS=[
 {cle:'mentions-devis',mots:['mentions obligatoires','mention obligatoire','mentions des devis','devis de travaux'],modules:['devis'],action:'Vérifier les mentions du générateur de devis.'},
 {cle:'tva',mots:['tva','taxe sur la valeur ajoutee','taux reduit','autoliquidation','franchise en base'],modules:['tva','devis','facture'],action:'Vérifier les taux et les règles du moteur de TVA.'},
 {cle:'facture-electronique',mots:['facturation electronique','facture electronique','factures electroniques','e-reporting','plateforme agreee','format structure'],modules:['facture'],action:'Adapter le connecteur de plateforme agréée et le format des factures.'},
 {cle:'facture',mots:['facture','factures','avoir','acompte','facture de situation'],modules:['facture','paiement'],action:'Vérifier les mentions et le parcours des factures.'},
 {cle:'signature',mots:['signature electronique','preuve numerique','horodatage'],modules:['signature'],action:'Vérifier la signature électronique et sa preuve.'},
 {cle:'donnees',mots:['donnees personnelles','rgpd','cnil','conservation des donnees','hebergement des donnees'],modules:['securite','auth'],action:'Vérifier la conservation des données, les permissions et le journal.'},
 {cle:'geolocalisation',mots:['geolocalisation'],modules:['pointage'],action:'Vérifier le pointage par GPS et l\'information des salariés.'},
 {cle:'ia',mots:['intelligence artificielle','reglement europeen sur l\'ia'],modules:['chat','3d'],action:'Vérifier l\'information donnée sur l\'IA du chat et de la 3D.'},
 {cle:'photos',mots:['photographies','droit a l\'image'],modules:['3d'],action:'Vérifier l\'usage des photos et vidéos de chantier.'},
 {cle:'aides',mots:['maprimerenov','certificats d\'economies d\'energie','economies d\'energie','prime renov'],modules:['devis'],action:'Vérifier les mentions d\'aides et de qualification sur les devis.'},
 {cle:'assurance',mots:['decennale','assurance construction','responsabilite civile professionnelle'],modules:['devis','entreprise'],action:'Vérifier les mentions d\'assurance de « Mon entreprise » et des devis.'},
 {cle:'dechets',mots:['dechets'],modules:['devis'],action:'Vérifier la mention de gestion des déchets sur les devis.'},
 {cle:'reception',mots:['reception des travaux','proces-verbal de reception','levee de reserves'],modules:['devis','facture'],action:'Prévoir ou vérifier le document de réception des travaux.'},
 {cle:'paiement',mots:['delais de paiement','penalites de retard','paiement en especes'],modules:['paiement','facture'],action:'Vérifier les délais, pénalités et plafonds du module Paiement.'}];
const MODULES=['devis','facture','tva','paiement','signature','pointage','planning','fournisseurs','chat','3d','auth','securite','entreprise'];
const PRIORITES=['P0','P1','P2','P3'];
const VIDES=new Set(['relatif','relative','relatifs','relatives','portant','modifiant','fixant','decret','arrete','ordonnance','novembre','decembre','janvier','fevrier','juillet','septembre','octobre','entreprises','professionnels','nouveau','nouvelle','application','applicable','conditions','dispositions','diverses','concernant','annee','publication']);
/* les mots du titre qui peuvent porter un apprentissage */
function mots(titre){const out=[];for(const m of plat(titre).split(/[^a-z0-9']+/))if(m.length>=6&&!VIDES.has(m)&&!/^\d+$/.test(m)&&!out.includes(m))out.push(m);return out.slice(0,12)}
const jours=(de,a_)=>Math.round((Date.parse(a_+'T00:00:00Z')-Date.parse(de+'T00:00:00Z'))/864e5);

/* P0 critique, P1 élevée, P2 moyenne, P3 faible : la catégorie, le délai avant application et les modules touchés */
function priorite(categorie,dateVigueur,nModules,aujourdhui){
 if(categorie!=='confirme'&&categorie!=='echeance')return categorie==='clarification'&&nModules?'P2':'P3';
 if(!nModules)return 'P3';
 const d=dateVigueur?jours(aujourdhui,dateVigueur):0;
 return d<=30?'P0':d<=90?'P1':'P2'}

function analyser(f,ctx={}){
 const aujourdhui=ctx.aujourdhui||new Date().toISOString().slice(0,10),appris=ctx.appris||{},t=' '+plat(f.titre)+' '+plat(f.nouvelle||f.resume||'')+' ';
 const domaines=Object.keys(DOMAINES).filter(k=>dans(t,DOMAINES[k]));
 let pros=Object.keys(PROS).filter(k=>dans(t,PROS[k]));if(!pros.length)pros=['artisans du bâtiment'];
 const suj=SUJETS.filter(s=>dans(t,s.mots)),modules=[],actions=[];
 for(const s of suj){for(const m of s.modules)if(!modules.includes(m))modules.push(m);if(!actions.includes(s.action))actions.push(s.action)}
 /* ce que les corrections ont appris : un module s'ajoute ou se retire quand les mots du titre le portent */
 const M=appris.modules||{},score=Object.create(null);
 for(const w of mots(f.titre))if(a(M,w))for(const m of Object.keys(M[w]))if(MODULES.includes(m)&&Math.abs(M[w][m])>=2)score[m]=(score[m]||0)+M[w][m];
 for(const m of Object.keys(score)){const i=modules.indexOf(m);if(score[m]>=2&&i<0)modules.push(m);if(score[m]<=-2&&i>=0)modules.splice(i,1)}
 const delaiJours=f.dateVigueur?jours(aujourdhui,f.dateVigueur):null;
 return {domaines,pros,modules,actions,priorite:priorite(f.categorie,f.dateVigueur,modules.length,aujourdhui),delaiJours}}

/* une correction du propriétaire : chaque mot du titre retient les modules ajoutés (+1) et retirés (-1) */
function apprendre(appris,f,modulesAvant,modulesApres){
 const M=appris.modules||(appris.modules={}),plus=modulesApres.filter(m=>!modulesAvant.includes(m)),moins=modulesAvant.filter(m=>!modulesApres.includes(m));
 if(!plus.length&&!moins.length)return 0;
 for(const w of mots(f.titre)){if(!a(M,w)){if(Object.keys(M).length>=5000)continue;M[w]={}}
  for(const m of plus)M[w][m]=Math.min(20,(M[w][m]||0)+1);for(const m of moins)M[w][m]=Math.max(-20,(M[w][m]||0)-1)}
 return plus.length+moins.length}

module.exports={analyser,apprendre,priorite,mots,DOMAINES,MODULES,PRIORITES};

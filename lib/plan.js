/* casô — « On construit le plan » : catalogue des modules, prix, plafond, droits.
   Un seul fichier, lu par le serveur (serveur/auth.js) et par l'appli (index.html), pour que le total affiché soit toujours celui facturé.
   Prix en centimes. Artisan : HT. Bricoleur : TTC. Le total ne dépasse jamais le plafond ; remise fixe à vie pour les membres fondateurs. */
(function(g){
'use strict';
var CATALOGUE={
 artisan:{
  plafond:2500,unite:'HT',
  modules:[
   {id:'devis',nom:'Devis et factures',prix:900},
   {id:'planning',nom:'Planning',prix:300},
   {id:'pointage',nom:'Pointage',prix:300},
   {id:'paiement',nom:'Paiement',prix:500},
   {id:'3d',nom:'3D Construction',prix:600},
   {id:'renovation',nom:'Rénovation',prix:600},
   {id:'fournisseurs',nom:'Fournisseurs',prix:400},
   {id:'veille',nom:'Newsletter et veille',prix:200}]},
 bricoleur:{
  plafond:1000,unite:'TTC',
  modules:[
   {id:'3d',nom:'3D illimitée',prix:600},
   {id:'renovation',nom:'Rénovation',prix:500},
   {id:'verification',nom:'Vérification produits et artisans',prix:300},
   {id:'estimation',nom:'Estimation de prix',prix:300}]}};
/* Pas d'offres toutes faites : chaque usager construit son abonnement module par module. */
var REMISE_FONDATEUR=30;/* % à vie, sur le total (100 premiers abonnés artisans) */

function cat(mode){return CATALOGUE[mode==='bricoleur'?'bricoleur':'artisan']}
/* modules valides, sans doublon, dans l'ordre du catalogue */
function nettoyer(mode,ids){
 var c=cat(mode),set={};(Array.isArray(ids)?ids:[]).forEach(function(i){set[String(i)]=1});
 return c.modules.filter(function(m){return set[m.id]}).map(function(m){return m.id})}
/* total du plan : brut, plafond appliqué, remise fondateur, lignes */
function calcul(mode,ids,fondateur){
 var c=cat(mode),sel=nettoyer(mode,ids),brut=0,lignes=[];
 c.modules.forEach(function(m){if(sel.indexOf(m.id)>=0){brut+=m.prix;lignes.push({id:m.id,nom:m.nom,prix:m.prix})}});
 var plafonne=Math.min(brut,c.plafond),remise=fondateur&&plafonne?Math.round(plafonne*REMISE_FONDATEUR/100):0;
 return{modules:sel,lignes:lignes,brut:brut,plafond:c.plafond,plafonne:brut>c.plafond,total:plafonne-remise,remise:remise,unite:c.unite}}
/* un module est-il ouvert pour ce compte ? (compte : sortie de CasoAuth.compte() / serveur pub()) */
function peut(compte,module){return !!(compte&&Array.isArray(compte.modules)&&compte.modules.indexOf(module)>=0)}

/* Socle gratuit (mode Artisan, après l'essai et sans abonnement) : le chat, le carnet de clients, les rendez-vous simples
   et 1 devis par mois. Ce ne sont pas des modules du catalogue : ils ne se paient pas. */
var GRATUIT=['chat','clients','rdv'],DEVIS_GRATUITS_MOIS=1;
/* Droits d'un compte (sortie de pub() du serveur ou de CasoAuth.compte()).
   compte.modules vient du serveur : pendant l'essai, il contient déjà tout le mode Artisan.
   Sans compte serveur, sans mode choisi, ou en mode Bricoleur : rien n'est verrouillé (comme avant). */
function droits(compte,now){
 now=now||Date.now();
 if(!compte||compte.mode!=='artisan')return{tout:true,essai:false,modules:cat('artisan').modules.map(function(m){return m.id}),
  ouvert:function(){return true},devisGratuits:Infinity};
 var mods=nettoyer('artisan',compte.modules),essai=!!(compte.essaiFin&&now<compte.essaiFin);
 function ouvert(m){return GRATUIT.indexOf(m)>=0||mods.indexOf(m)>=0}
 return{tout:false,essai:essai,essaiFin:compte.essaiFin||null,modules:mods,ouvert:ouvert,devisGratuits:ouvert('devis')?Infinity:DEVIS_GRATUITS_MOIS}}
/* devis encore possibles ce mois-ci : faits = nombre de devis créés depuis le 1er du mois */
function devisRestants(d,faits){return d.devisGratuits===Infinity?Infinity:Math.max(0,d.devisGratuits-(+faits||0))}
function euros(cts){var e=cts/100;return(e%1?e.toFixed(2).replace('.',','):String(e))+' €'}

var API={CATALOGUE:CATALOGUE,REMISE_FONDATEUR:REMISE_FONDATEUR,GRATUIT:GRATUIT,DEVIS_GRATUITS_MOIS:DEVIS_GRATUITS_MOIS,
 catalogue:cat,nettoyer:nettoyer,calcul:calcul,peut:peut,droits:droits,devisRestants:devisRestants,euros:euros};
if(typeof module!=='undefined'&&module.exports)module.exports=API;
else{g.CasoPlan=API;g.CasoAbo={peut:function(m){var A=g.CasoAuth,c=A&&A.compte();return !!(c&&c.frais!==false&&peut(c,m))}}}
})(typeof window!=='undefined'?window:globalThis);

/* Veille réglementaire, les 10 scénarios du cahier des charges : node tests/veille-scenarios.test.js
   Chaque scénario passe par le vérificateur puis par le contrôleur. Les « actions recommandées » sont contrôlées avec l'analyse (plan 2). */
'use strict';
const assert=require('assert'),os=require('os'),fs=require('fs'),path=require('path');
const {verifier}=require('../serveur/veille/verif.js'),{classer,bilan,CAT}=require('../serveur/veille/controle.js'),{ouvrir}=require('../serveur/veille/base.js');
let ok=0;const t=(nom,f)=>{f();ok++;console.log('✓',nom)};
const J={aujourdhui:'2026-11-16'};
const jo=(n,o)=>Object.assign({source:'legifrance',idSource:'JORFTEXT00005200'+n,titre:'',url:'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT00005200'+n,datePub:'2026-11-11',resume:'',texte:'',nature:'',numero:'',nor:'',dateVigueur:''},o);
const passe=(b,ctx)=>{const v=verifier(b,J);return {v,c:classer(v,Object.assign({etat:'nouveau',dejaValide:false,autres:[]},ctx))}};

t('1. loi publiée, pas encore applicable',()=>{
 const {v,c}=passe(jo('1001',{titre:'LOI n° 2026-1500 du 9 novembre 2026 relative à la rénovation énergétique des bâtiments',texte:'La présente loi entre en vigueur le 1er juillet 2027.'}));
 assert.deepStrictEqual([c.categorie,c.bloque,v.differe,v.dateVigueur,v.reference],[CAT.confirme,false,true,'2027-07-01','2026-1500'])});
t('2. décret entré en vigueur immédiatement',()=>{
 const {v,c}=passe(jo('1002',{titre:'Décret n° 2026-1501 du 10 novembre 2026 relatif à la sécurité des chantiers',texte:'Le présent décret entre en vigueur le lendemain de sa publication.'}));
 assert.deepStrictEqual([c.categorie,c.bloque,v.differe,v.dateVigueur],[CAT.confirme,false,false,'2026-11-12'])});
t('3. taux de TVA : précision de l\'administration',()=>{
 const {v,c}=passe({source:'bofip',idSource:'ACTU-2026-00170',titre:'TVA - Taux réduit de 5,5 % applicable aux travaux de rénovation énergétique',url:'https://bofip.impots.gouv.fr/bofip/1-PGP.html/ACTU-2026-00170',datePub:'2026-11-10',resume:'',texte:'TVA - Taux réduit',nature:'DOCTRINE',numero:'ACTU-2026-00170',nor:'',dateVigueur:''});
 assert.deepStrictEqual([c.categorie,c.bloque,v.reference,v.officiel],[CAT.clarification,false,'ACTU-2026-00170',true])});
t('4. nouvelle mention obligatoire des devis',()=>{
 const {v,c}=passe(jo('1004',{titre:'Décret n° 2026-1234 du 10 novembre 2026 relatif aux mentions obligatoires des devis de travaux',texte:'L\'article R. 111-1 du code de la consommation est complété par une mention. Le présent décret entre en vigueur le 1er janvier 2027.'}));
 assert.strictEqual(c.categorie,CAT.confirme);assert.deepStrictEqual(v.articles,['article R. 111-1 du code de la consommation']);assert.strictEqual(v.dateVigueur,'2027-01-01')});
t('5. échéance de facturation électronique déjà validée, revue sans changement',()=>{
 const b=jo('1005',{titre:'Décret n° 2026-900 du 1er mars 2026 relatif à la facturation électronique',texte:'Les entreprises émettent leurs factures sous forme électronique. Le présent décret entre en vigueur le 1er septembre 2027.'});
 const {c}=passe(b,{etat:'inchange',dejaValide:true});assert.deepStrictEqual([c.categorie,c.bloque],[CAT.echeance,false]);
 assert.strictEqual(passe(b,{etat:'inchange',dejaValide:false}).c.categorie,CAT.aucun)});
t('6. proposition de loi non adoptée : jamais une obligation',()=>{
 const {v,c}=passe({source:'entreprendre',idSource:'A19000',titre:'Proposition de loi sur la TVA des travaux : ce qui est prévu',url:'https://www.service-public.gouv.fr/particuliers/actualites/A19000',datePub:'2026-11-12',resume:'',texte:'Le taux s\'appliquerait à compter du 1er janvier 2027.',nature:'ACTU',numero:'',nor:'',dateVigueur:''});
 assert.deepStrictEqual([c.categorie,c.bloque,v.dateVigueur],[CAT.proposition,false,''])});
t('7. information d\'un site secondaire : jamais confirmée',()=>{
 const {c}=passe(jo('1007',{titre:'Décret n° 2026-1600 du 12 novembre 2026 supprimant la TVA à 10 %',url:'https://blog-artisan.example/tva-supprimee',texte:'Le décret entre en vigueur le 1er décembre 2026.'}));
 assert.deepStrictEqual([c.categorie,c.bloque,c.raisons],[CAT.non_confirme,true,['source non officielle']])});
t('8. texte existant modifié : l\'ancienne version reste, la validation repart',()=>{
 const base=ouvrir(fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-')),{log:()=>{}});
 const b=jo('1008',{titre:'Décret n° 2026-1700 du 5 novembre 2026 relatif aux déchets de chantier',texte:'Le présent décret entre en vigueur le 1er janvier 2027.'});
 const r=base.recevoir(b);base.completer(r.id,{categorie:CAT.confirme,validation:'valide',dateVigueur:'2027-01-01'});
 const b2={...b,texte:'Le présent décret entre en vigueur le 1er avril 2027.'},r2=base.recevoir(b2),f=base.lire(r.id);
 assert.strictEqual(r2.etat,'modifie');assert.strictEqual(f.historique.length,1);assert.strictEqual(f.validation,'attente');assert.strictEqual(f.historique[0].dateVigueur,'2027-01-01');
 const {v,c}=passe(b2,{etat:r2.etat});assert.deepStrictEqual([c.categorie,v.dateVigueur],[CAT.confirme,'2027-04-01'])});
t('9. deux sources officielles en désaccord : bloqué',()=>{
 const a=verifier(jo('1009',{titre:'Décret n° 2026-1800 du 8 novembre 2026 relatif au diagnostic amiante',texte:'Le présent décret entre en vigueur le 1er janvier 2027.'}),J);
 const b={source:'entreprendre',idSource:'A19001',titre:'Diagnostic amiante : ce qui change',url:'https://www.service-public.gouv.fr/particuliers/actualites/A19001',datePub:'2026-11-12',resume:'',texte:'La mesure s\'applique à compter du 1er mars 2027.',nature:'ACTU',numero:'2026-1800',nor:'',dateVigueur:''};
 const {c}=passe(b,{autres:[a]});assert.deepStrictEqual([c.categorie,c.bloque,c.raisons],[CAT.non_confirme,true,['sources en désaccord']]);
 assert.strictEqual(classer(a,{etat:'nouveau',autres:[verifier(b,J)]}).bloque,true);
 assert.strictEqual(classer(a,{etat:'nouveau',autres:[a]}).categorie,CAT.confirme)});
t('10. aucune nouveauté : aucune alerte',()=>{
 const res=[1,2,3].map(()=>passe(jo('1002',{titre:'Décret n° 2026-1501 du 10 novembre 2026',texte:'Article 1.'}),{etat:'inchange'}).c);
 assert.ok(res.every(c=>c.categorie===CAT.aucun&&!c.bloque));assert.deepStrictEqual(bilan(res),{nouveautes:0,bloques:0,alerte:false});
 assert.deepStrictEqual(bilan([{categorie:CAT.confirme,bloque:false},{categorie:CAT.non_confirme,bloque:true},{categorie:CAT.echeance,bloque:false}]),{nouveautes:2,bloques:1,alerte:false})});
t('date introuvable : bloqué avec sa raison',()=>{
 const {c}=passe(jo('1011',{titre:'Décret n° 2026-1900 du 8 novembre 2026 relatif aux devis',texte:'Ces dispositions entrent en vigueur à une date fixée par décret.'}));
 assert.deepStrictEqual([c.categorie,c.bloque,c.raisons],[CAT.non_confirme,true,['date d\'entrée en vigueur à lire dans le texte']])});
console.log(ok+' contrôles réussis');

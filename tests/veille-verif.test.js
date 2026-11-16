/* Veille réglementaire, le vérificateur juridique : node tests/veille-verif.test.js */
'use strict';
const assert=require('assert');
const {verifier}=require('../serveur/veille/verif.js');
let ok=0;const t=(nom,f)=>{f();ok++;console.log('✓',nom)};
const J={aujourdhui:'2026-11-16'};
const D={source:'legifrance',idSource:'JORFTEXT1',titre:'Décret n° 2026-1234 du 10 novembre 2026 relatif aux mentions des devis',url:'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT1',datePub:'2026-11-11',resume:'',texte:'L\'article R. 111-1 du code de la consommation est modifié. Le présent décret entre en vigueur le 1er janvier 2027.',nature:'',numero:'',nor:'',dateVigueur:''};

t('décret : nature, statut, numéro, date écrite, article',()=>{const v=verifier(D,J);
 assert.deepStrictEqual([v.officiel,v.nature,v.statut,v.reference,v.dateVigueur,v.differe],[true,'DECRET','adopte','2026-1234','2027-01-01',true]);
 assert.deepStrictEqual(v.articles,['article R. 111-1 du code de la consommation']);assert.deepStrictEqual(v.manque,[])});
t('lendemain de la publication, écrit ou règle générale',()=>{
 assert.strictEqual(verifier({...D,texte:'Le présent décret entre en vigueur le lendemain de sa publication.'},J).dateVigueur,'2026-11-12');
 const v=verifier({...D,texte:'Article 1.'},J);assert.strictEqual(v.dateVigueur,'2026-11-12');assert.strictEqual(v.differe,false);
 assert.strictEqual(verifier({...D,datePub:'2026-12-31',texte:'Article 1.'},J).dateVigueur,'2027-01-01')});
t('date renvoyée à plus tard : rien n\'est deviné',()=>{
 const x=verifier({...D,texte:'Ces dispositions entrent en vigueur à une date fixée par décret, et au plus tard le 1er septembre 2027.'},J);
 assert.strictEqual(x.dateVigueur,'');assert.ok(x.manque.includes('dateVigueur'));assert.strictEqual(x.differe,false)});
t('plusieurs dates, ou texte complet non lu : à lire par un humain',()=>{
 const x=verifier({...D,texte:'L\'article 1 entre en vigueur le 1er janvier 2027. L\'article 2 entre en vigueur le 1er juillet 2027.'},J);
 assert.strictEqual(x.dateVigueur,'');assert.ok(x.manque.includes('dateVigueur'));
 const y=verifier({...D,texte:D.titre,complet:false},J);assert.strictEqual(y.dateVigueur,'');assert.ok(y.manque.includes('dateVigueur'))});
t('autres écritures de date ; date impossible ignorée',()=>{
 assert.strictEqual(verifier({...D,texte:'Les dispositions s\'appliquent aux devis émis à compter du 15 mars 2027.'},J).dateVigueur,'2027-03-15');
 assert.strictEqual(verifier({...D,texte:'Le présent arrêté entre en vigueur le 01/09/2027.'},J).dateVigueur,'2027-09-01');
 for(const tx of ['Il entre en vigueur le 31 février 2027.','Le présent décret entre en vigueur le premier jour du troisième mois suivant sa publication.','Ces dispositions sont applicables aux contrats conclus après la publication.']){
  const z=verifier({...D,texte:tx},J);assert.strictEqual(z.dateVigueur,'',tx);assert.ok(z.manque.includes('dateVigueur'),tx)}
 assert.strictEqual(verifier({...D,dateVigueur:'2027-02-01'},J).dateVigueur,'2027-02-01')});
t('projet : jamais adopté, aucune date',()=>{
 const v=verifier({...D,titre:'Projet de loi de finances pour 2027',texte:'Le taux entre en vigueur le 1er janvier 2027.'},J);
 assert.deepStrictEqual([v.statut,v.nature,v.dateVigueur],['projet','PROJET','']);
 assert.strictEqual(verifier({...D,nature:'ACTU',titre:'Proposition de loi sur la TVA des travaux : ce qui est prévu'},J).statut,'projet')});
t('source non officielle, référence manquante',()=>{
 assert.strictEqual(verifier({...D,url:'https://blog-artisan.example/tva'},J).officiel,false);
 assert.ok(verifier({...D,titre:'Décret relatif aux devis'},J).manque.includes('reference'));
 assert.strictEqual(verifier({...D,idSource:'JORFTEXT000052000103',titre:'Arrêté du 9 novembre 2026 relatif aux déchets',nor:''},J).reference,'JORFTEXT000052000103')});
t('doctrine et actualité : référence BOFiP, pas de date par défaut',()=>{
 const v=verifier({source:'bofip',idSource:'ACTU-2026-00169',titre:'TVA - Taux réduit des travaux',url:'https://bofip.impots.gouv.fr/bofip/1-PGP.html/ACTU-2026-00169',datePub:'2026-11-04',resume:'',texte:'TVA - Taux réduit',nature:'DOCTRINE',numero:'ACTU-2026-00169',nor:'',dateVigueur:''},J);
 assert.deepStrictEqual([v.statut,v.reference,v.dateVigueur,v.manque.length],['doctrine','ACTU-2026-00169','',0]);
 const a=verifier({source:'entreprendre',idSource:'A1',titre:'Facture électronique',url:'https://www.service-public.gouv.fr/x',datePub:'2026-11-04',resume:'',texte:'L\'obligation s\'applique à compter du 1er septembre 2027.',nature:'ACTU',numero:'',nor:'',dateVigueur:''},J);
 assert.deepStrictEqual([a.statut,a.dateVigueur,a.differe],['info','2027-09-01',true])});
t('articles : plusieurs, sans doublon, sans avaler la phrase',()=>{
 const v=verifier({...D,texte:'Aux articles 278-0 bis A et 279-0 bis du code général des impôts, le taux est modifié. L\'article 279-0 bis du code général des impôts est complété. Voir l\'article 2.'},J);
 assert.deepStrictEqual(v.articles,['articles 278-0 bis A','article 279-0 bis du code général des impôts','article 2'])});
console.log(ok+' contrôles réussis');

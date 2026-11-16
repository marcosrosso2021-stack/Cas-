/* Veille réglementaire, la base : node tests/veille-base.test.js */
'use strict';
const assert=require('assert'),os=require('os'),fs=require('fs'),path=require('path');
const {ouvrir}=require('../serveur/veille/base.js');
let ok=0;const t=(nom,f)=>{f();ok++;console.log('✓',nom)};
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-'));
const B={source:'bofip',idSource:'ACTU-2026-00100',titre:'TVA - Travaux',url:'https://bofip.impots.gouv.fr/bofip/1-PGP.html',datePub:'2026-11-10',resume:'r',texte:'t1',nature:'DOCTRINE',numero:'',nor:'',dateVigueur:''};
const b=ouvrir(dir,{maintenant:()=>new Date('2026-11-16T06:00:00Z')});

t('nouveau, puis inchangé sans doublon ni historique',()=>{
 assert.deepStrictEqual(b.recevoir(B),{id:'bofip:ACTU-2026-00100',etat:'nouveau'});
 assert.strictEqual(b.recevoir(B).etat,'inchange');assert.strictEqual(b.liste().length,1);
 assert.strictEqual(b.lire('bofip:ACTU-2026-00100').historique.length,0)});
t('modifié : l\'ancienne version est gardée, la validation repart en attente',()=>{
 b.completer('bofip:ACTU-2026-00100',{validation:'valide',categorie:'clarification'});
 assert.strictEqual(b.recevoir({...B,texte:'t2',resume:'r2'}).etat,'modifie');
 const f=b.lire('bofip:ACTU-2026-00100');assert.strictEqual(f.historique.length,1);assert.strictEqual(f.validation,'attente');
 assert.strictEqual(f.ancienne,'r');assert.strictEqual(f.nouvelle,'r2');assert.strictEqual(f.historique[0].categorie,'clarification');
 assert.ok(fs.existsSync(path.join(dir,'veille-preuves',f.historique[0].empreinte+'.txt')));
 assert.strictEqual(fs.readFileSync(path.join(dir,'veille-preuves',f.preuve),'utf8'),'t2')});
t('noter garde l\'état d\'avant ; l\'identifiant et l\'historique ne se remplacent pas',()=>{
 const f=b.noter('bofip:ACTU-2026-00100',{categorie:'confirme',id:'x',historique:[]},'controle');
 assert.strictEqual(f.id,'bofip:ACTU-2026-00100');assert.strictEqual(f.historique.length,2);assert.strictEqual(f.historique[1].par,'controle');
 assert.strictEqual(b.noter('inconnu',{},'x'),null)});
t('filtres, journal limité, état',()=>{
 b.recevoir({...B,idSource:'ACTU-2026-00101',datePub:'2026-11-12'});
 assert.deepStrictEqual(b.liste().map(f=>f.datePub),['2026-11-12','2026-11-10']);
 assert.strictEqual(b.liste({categorie:'confirme'}).length,1);assert.strictEqual(b.liste({bloque:true}).length,0);
 for(let i=0;i<2100;i++)b.journal('info',{i});b.journal('erreur',{source:'bofip'});
 b.passage('2026-11-16T06:00:00.000Z');assert.deepStrictEqual(b.etat(),{textes:2,dernierPassage:'2026-11-16T06:00:00.000Z',erreurs:1})});
t('identifiant piégé : rangé comme un texte ordinaire',()=>{
 const r=b.recevoir({...B,source:'bofip',idSource:'__proto__'});assert.strictEqual(r.etat,'nouveau');assert.strictEqual(b.liste().length,3);assert.strictEqual({}.titre,undefined)});
t('enregistrer puis rouvrir',()=>{b.enregistrer();assert.strictEqual(ouvrir(dir).liste().length,3)});
t('fichier abîmé : reprise de la copie, et c\'est dit',()=>{
 fs.writeFileSync(path.join(dir,'veille.json'),'{cassé');const logs=[];
 assert.strictEqual(ouvrir(dir,{log:m=>logs.push(m)}).liste().length,3);assert.ok(logs.length>0);
 fs.writeFileSync(path.join(dir,'veille.json.bak'),'[]');const l2=[];
 assert.strictEqual(ouvrir(dir,{log:m=>l2.push(m)}).liste().length,0);assert.ok(l2.length>0)});
console.log(ok+' contrôles réussis');

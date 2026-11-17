/* Veille réglementaire, l'analyse (domaines, professionnels, modules de casô, priorités, apprentissage) : node tests/veille-analyse.test.js */
'use strict';
const assert=require('assert'),os=require('os'),fs=require('fs'),path=require('path'),http=require('http');
const {analyser,apprendre,priorite,mots}=require('../serveur/veille/analyse.js'),{creer}=require('../serveur/veille/index.js');
let ok=0;const t=async(nom,f)=>{await f();ok++;console.log('✓',nom)};
const J={aujourdhui:'2026-11-16'};
const F=o=>Object.assign({titre:'',nouvelle:'',categorie:'confirme',dateVigueur:'2027-01-01'},o);

(async()=>{
await t('actions du cahier des charges : mention des devis, TVA, facture électronique',()=>{
 const a=analyser(F({titre:'Décret n° 2026-1234 relatif aux mentions obligatoires des devis de travaux'}),J);
 assert.deepStrictEqual(a.modules,['devis']);assert.deepStrictEqual(a.actions,['Vérifier les mentions du générateur de devis.']);assert.ok(a.domaines.includes('facturation'));
 const b=analyser(F({titre:'TVA - Taux réduit applicable aux travaux de rénovation énergétique',categorie:'clarification',dateVigueur:''}),J);
 assert.deepStrictEqual(b.modules,['tva','devis','facture']);assert.ok(b.domaines.includes('fiscalite')&&b.domaines.includes('renovation'));assert.strictEqual(b.priorite,'P2');assert.strictEqual(b.delaiJours,null);
 const c=analyser(F({titre:'Décret relatif à la facturation électronique entre entreprises',dateVigueur:'2027-09-01'}),J);
 assert.ok(c.modules.includes('facture'));assert.ok(c.actions[0].includes('plateforme agréée'));assert.strictEqual(c.delaiJours,289)});
await t('professionnels : ceux que le texte nomme, sinon les artisans du bâtiment',()=>{
 assert.deepStrictEqual(analyser(F({titre:'Arrêté relatif aux déchets de chantier'}),J).pros,['artisans du bâtiment']);
 assert.deepStrictEqual(analyser(F({titre:'Franchise en base de TVA des micro-entrepreneurs et sous-traitance'}),J).pros,['micro-entrepreneurs','sous-traitants'])});
await t('priorités : catégorie, délai, modules touchés',()=>{
 assert.strictEqual(priorite('confirme','2026-11-20',2,'2026-11-16'),'P0');assert.strictEqual(priorite('confirme','2026-11-01',1,'2026-11-16'),'P0');
 assert.strictEqual(priorite('confirme','2027-01-15',1,'2026-11-16'),'P1');assert.strictEqual(priorite('echeance','2027-09-01',1,'2026-11-16'),'P2');
 assert.strictEqual(priorite('confirme','2026-11-20',0,'2026-11-16'),'P3');assert.strictEqual(priorite('proposition','2026-11-20',3,'2026-11-16'),'P3');
 assert.strictEqual(priorite('non_confirme','',3,'2026-11-16'),'P3');assert.strictEqual(priorite('clarification','',0,'2026-11-16'),'P3')});
await t('apprentissage : deux corrections dans le même sens, pas une seule',()=>{
 const ap={},f1=F({titre:'Arrêté relatif aux échafaudages roulants de chantier'}),f2=F({titre:'Décret sur le contrôle des échafaudages'}),f3=F({titre:'Nouvelles règles pour les échafaudages fixes'});
 assert.deepStrictEqual(analyser(f3,{...J,appris:ap}).modules,[]);
 apprendre(ap,f1,[],['planning']);assert.deepStrictEqual(analyser(f3,{...J,appris:ap}).modules,[]);
 apprendre(ap,f2,[],['planning']);assert.deepStrictEqual(analyser(f3,{...J,appris:ap}).modules,['planning']);
 const g=F({titre:'Devis de travaux : précision sur les échafaudages'});assert.ok(analyser(g,{...J,appris:ap}).modules.includes('devis'));
 const q={};apprendre(q,F({titre:'Devis de travaux des paysagistes'}),['devis'],[]);apprendre(q,F({titre:'Devis de travaux pour paysagistes indépendants'}),['devis'],[]);
 assert.deepStrictEqual(analyser(F({titre:'Devis de travaux : paysagistes'}),{...J,appris:q}).modules,[]);
 assert.ok(!mots('Décret n° 2026-1234 du 10 novembre 2026 relatif aux échafaudages').some(m=>/decret|novembre|relatif|2026/.test(m)));
 assert.strictEqual(JSON.stringify(apprendre({},F({titre:'__proto__ constructor prototype'}),[],['devis'])),'1');assert.strictEqual({}.devis,undefined)});

await t('tri préparé : envoyer, garder, écarter, avec une phrase prudente',()=>{
 const a=analyser(F({titre:'Décret relatif aux mentions obligatoires des devis de travaux'}),J);assert.deepStrictEqual([a.tri,a.aFaireProp],['envoyer','Vérifie tes modèles de devis avant la date d\'application.']);
 const b=analyser(F({titre:'TVA - Taux réduit des travaux de rénovation',categorie:'clarification',dateVigueur:''}),J);assert.strictEqual(b.tri,'envoyer');assert.ok(/TVA/.test(b.aFaireProp));
 assert.deepStrictEqual(analyser(F({titre:'Proposition de loi sur la sous-traitance',categorie:'proposition'}),J).tri,'garder');
 assert.strictEqual(analyser(F({titre:'Arrêté relatif à la sécurité des chantiers'}),J).tri,'garder');
 assert.strictEqual(analyser(F({titre:'Nomination au conseil d\'administration'}),J).tri,'ecarter');
 assert.strictEqual(analyser(F({titre:'Décret relatif aux devis',categorie:'non_confirme',bloque:true}),J).tri,'');
 const {A_FAIRE}=require('../serveur/veille/analyse.js');for(const k of Object.keys(A_FAIRE))assert.ok(!/obligatoire|doit|interdit|sanction/i.test(A_FAIRE[k]),k)});

/* de bout en bout : collecte, analyse, décision du propriétaire, serveur */
const rep=c=>({ok:true,status:200,text:async()=>c,json:async()=>JSON.parse(c)});
const item=(id,titre,texte)=>'<item><title>'+titre+'</title><link>https://www.service-public.gouv.fr/particuliers/actualites/'+id+'</link><description>'+texte+'</description><guid>'+id+'_x</guid><dc:date>2026-11-12T00:00:00+01:00</dc:date></item>';
let items=item('A20001','TVA des travaux : ce qui change pour les devis','Le taux réduit de TVA s\'applique à compter du 1er décembre 2026.')+item('A20002','Proposition de loi sur la sous-traitance dans le bâtiment','Le texte est en discussion.');
const flux=async u=>rep(/actu-actu-pro/.test(String(u))?'<rss><channel>'+items+'</channel></rss>':'<rss><channel></channel></rss>');
let heure='2026-11-16T06:00:00Z';const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-'));
const v=creer({dir,env:{},fetch:flux,log:()=>{},maintenant:()=>new Date(heure)});

await t('passage : chaque texte reçoit domaines, professionnels, modules, priorité, délai',async()=>{
 await v.passer();const a=v.liste().find(f=>f.id==='entreprendre:A20001'),b=v.liste().find(f=>f.id==='entreprendre:A20002');
 assert.deepStrictEqual([a.categorie,a.priorite,a.delaiJours,a.dateVigueur],['clarification','P2',15,'2026-12-01']);assert.deepStrictEqual(a.modules,['tva','devis','facture']);
 assert.deepStrictEqual([b.categorie,b.priorite,b.pros.join()],['proposition','P3','sous-traitants']);
 assert.strictEqual(v.liste({priorite:'P2'}).length,1);assert.strictEqual(v.liste({domaine:'fiscalite'}).length,1)});
await t('décision : valider avec corrections, gardées aux passages suivants ; refus des valeurs inconnues',async()=>{
 assert.strictEqual(v.decider('inconnu','valide')[0],404);assert.strictEqual(v.decider('entreprendre:A20001','publie')[0],400);
 assert.strictEqual(v.decider('entreprendre:A20001','valide',{priorite:'P9'})[0],400);assert.strictEqual(v.decider('entreprendre:A20001','valide',{dateVigueur:'2026-13-45'})[0],400);
 assert.strictEqual(v.decider('entreprendre:A20001','valide',{categorie:'aucun'})[0],400);
 const [c,f]=v.decider('entreprendre:A20001','valide',{priorite:'P1',modules:['tva','devis','piège']});assert.strictEqual(c,200);
 assert.deepStrictEqual([f.validation,f.priorite,f.modules.join(),f.bloque],['valide','P1','tva,devis',false]);assert.ok(f.corrige.includes('priorite')&&f.corrige.includes('modules'));
 assert.strictEqual(f.historique[f.historique.length-1].par,'proprietaire');
 heure='2026-11-25T06:00:00Z';await v.passer();const g=v.liste().find(x=>x.id===f.id);assert.deepStrictEqual([g.validation,g.priorite,g.modules.join()],['valide','P1','tva,devis'])});
await t('non confirmé ou sans date : pas de validation telle quelle',async()=>{
 const w=creer({dir:fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-')),env:{},log:()=>{},maintenant:()=>new Date(heure),
  sources:{actives:()=>['test'],collecter:async()=>({erreurs:[],bruts:[{source:'legifrance',idSource:'JORFTEXT000052000900',titre:'Décret n° 2026-1900 du 8 novembre 2026 relatif aux mentions obligatoires des devis',url:'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052000900',datePub:'2026-11-11',resume:'',texte:'Ces dispositions entrent en vigueur à une date fixée par décret.',nature:'DECRET',numero:'',nor:'',dateVigueur:''}]})}});
 await w.passer();const id='legifrance:JORFTEXT000052000900';assert.deepStrictEqual([w.lire(id).categorie,w.lire(id).bloque,w.lire(id).priorite],['non_confirme',true,'P3']);
 assert.strictEqual(w.decider(id,'valide')[0],409);assert.strictEqual(w.decider(id,'valide',{categorie:'confirme'})[0],409);
 const [c,f]=w.decider(id,'valide',{categorie:'confirme',dateVigueur:'2026-12-01'});assert.strictEqual(c,200);
 assert.deepStrictEqual([f.categorie,f.bloque,f.priorite,f.modules.join(),f.delaiJours],['confirme',false,'P0','devis',6]);
 assert.strictEqual(w.decider(id,'refuse')[1].validation,'refuse')});
await t('texte modifié à la source : la validation et les corrections repartent',async()=>{
 items=item('A20001','TVA des travaux : ce qui change pour les devis','Le taux réduit de TVA s\'applique à compter du 1er janvier 2027.');
 await v.passer();const f=v.liste().find(x=>x.id==='entreprendre:A20001');
 assert.deepStrictEqual([f.validation,f.dateVigueur,f.corrige.length,f.modules.join()],['attente','2027-01-01',0,'tva,devis,facture']);assert.ok(/1er décembre/.test(f.ancienne))});
await t('appliquer le tri : un geste, et les textes bloqués restent à vérifier',async()=>{
 const B=(n,titre,texte,x)=>Object.assign({source:'legifrance',idSource:'JORFTEXT00005200'+n,titre,url:'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT00005200'+n,datePub:'2026-11-11',resume:'',texte,nature:'DECRET',numero:'',nor:'',dateVigueur:''},x||{});
 const w=creer({dir:fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-')),env:{},log:()=>{},maintenant:()=>new Date('2026-11-17T06:00:00Z'),sources:{actives:()=>['test'],collecter:async()=>({erreurs:[],bruts:[
  B('5001','Décret n° 2026-5001 du 10 novembre 2026 relatif aux mentions obligatoires des devis','Le présent décret entre en vigueur le 1er décembre 2026.'),
  B('5002','Décret n° 2026-5002 du 10 novembre 2026 relatif à la sécurité des chantiers','Le présent décret entre en vigueur le 1er juin 2027.'),
  B('5003','Décret n° 2026-5003 du 10 novembre 2026 portant nomination au conseil','Le présent décret entre en vigueur le 1er juin 2027.'),
  B('5004','Décret n° 2026-5004 du 10 novembre 2026 relatif aux devis','Ces dispositions entrent en vigueur à une date fixée par décret.')]})}});
 await w.passer();const r=w.trier();assert.deepStrictEqual(r,{envoyes:1,gardes:1,ecartes:1,laisses:0});
 const L=id=>w.lire('legifrance:JORFTEXT00005200'+id);
 assert.deepStrictEqual([L('5001').validation,L('5001').lettre,L('5001').aFaire,L('5001').publieLe],['valide',true,'Vérifie tes modèles de devis avant la date d\'application.','2026-11-17']);
 assert.deepStrictEqual([L('5002').validation,L('5002').lettre||false],['valide',false]);assert.strictEqual(L('5003').validation,'refuse');
 assert.deepStrictEqual([L('5004').validation,L('5004').bloque],['attente',true]);assert.deepStrictEqual(w.lettre().map(x=>x.id),['legifrance:JORFTEXT000052005001'])});
await t('la priorité suit le délai, jour après jour',async()=>{
 const w=creer({dir:fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-')),env:{},log:()=>{},maintenant:()=>new Date(heure),
  sources:{actives:()=>['test'],collecter:async()=>({erreurs:[],bruts:[{source:'legifrance',idSource:'JORFTEXT000052000901',titre:'Décret n° 2026-1901 du 8 novembre 2026 relatif à la facturation électronique',url:'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052000901',datePub:'2026-11-11',resume:'',texte:'Le présent décret entre en vigueur le 1er mars 2027.',nature:'DECRET',numero:'',nor:'',dateVigueur:''}]})}});
 heure='2026-11-16T06:00:00Z';await w.passer();assert.strictEqual(w.liste()[0].priorite,'P2');
 heure='2026-12-15T06:00:00Z';await w.passer();assert.strictEqual(w.liste()[0].priorite,'P1');
 heure='2027-02-10T06:00:00Z';await w.passer();assert.strictEqual(w.liste()[0].priorite,'P0');assert.strictEqual(w.liste()[0].historique.length,0)});
await t('serveur : page privée, décisions et collecte avec la clé seulement, essais limités',async()=>{
 const {createServer}=require('../serveur/server.js');process.env.CASO_CLE_IA='cle-test';
 const s=createServer({dataDir:dir,veille:v,noTimers:true,appFile:path.join(__dirname,'..','index.html')}),srv=s.server||s;
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port;
 const req=(m,u,h,b)=>new Promise((ok,ko)=>{const r=http.request({host:'127.0.0.1',port,path:u,method:m,headers:Object.assign(b?{'content-type':'application/json'}:{},h||{})},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j=d;try{j=JSON.parse(d)}catch(e){}ok([x.statusCode,j,x.headers])})});r.on('error',ko);r.end(b?JSON.stringify(b):undefined)});
 const K={'x-caso-cle':'cle-test'};
 const [c,html,h]=await req('GET','/veille');assert.strictEqual(c,200);assert.ok(/Veille casô/.test(html));assert.ok(/default-src 'none'/.test(h['content-security-policy']));assert.strictEqual(h['x-robots-tag'],'noindex');assert.ok(!/cle-test/.test(html));
 const e=(await req('GET','/api/veille/etat',K))[1];assert.ok(e.modules.includes('devis')&&e.domaines.includes('fiscalite'));
 assert.strictEqual((await req('POST','/api/veille/decider',{},{id:'entreprendre:A20002',decision:'valide'}))[0],404);
 const [c2,f]=await req('POST','/api/veille/decider',K,{id:'entreprendre:A20002',decision:'refuse'});assert.strictEqual(c2,200);assert.strictEqual(f.validation,'refuse');
 assert.strictEqual((await req('GET','/api/veille/textes?validation=refuse',K))[1].length,1);assert.ok((await req('GET','/api/veille/textes?priorite=P3',K))[1].every(x=>x.priorite==='P3'));
 const [c3,r]=await req('POST','/api/veille/passer',K,{});assert.strictEqual(c3,200);assert.strictEqual(typeof r.nouveaux,'number');
 assert.ok((await req('GET','/api/veille/journal',K))[1].some(x=>x.type==='decision'));assert.strictEqual((await req('GET','/api/veille/autre',K))[0],404);
 let dernier=0;for(let i=0;i<11;i++)dernier=(await req('GET','/api/veille/etat',{'x-caso-cle':'faux'}))[0];assert.strictEqual(dernier,429);
 assert.strictEqual((await req('GET','/api/veille/etat',K))[0],429);
 await new Promise(r=>srv.close(r))});
console.log(ok+' contrôles réussis');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});

/* Veille réglementaire, le passage quotidien et le serveur : node tests/veille-serveur.test.js (sans réseau) */
'use strict';
const assert=require('assert'),os=require('os'),fs=require('fs'),path=require('path'),http=require('http');
const {creer}=require('../serveur/veille/index.js');
let ok=0;const t=async(nom,f)=>{await f();ok++;console.log('✓',nom)};
const ext=n=>fs.readFileSync(path.join(__dirname,'veille',n),'utf8');
const rep=(corps,st)=>({ok:(st||200)<300,status:st||200,text:async()=>corps,json:async()=>JSON.parse(corps)});
const flux=async u=>{u=String(u);return rep(ext(/bofip/.test(u)?'bofip.rss':/actu-actu-pro/.test(u)?'entreprendre.rss':/particuliers/.test(u)?'particuliers.rss':/vie-publique/.test(u)?'viepublique.rss':/ecologie/.test(u)?'ecologie.rss':/capeb/.test(u)?'capeb.rss':/batiactu/.test(u)?'batiactu.rss':/economie\.gouv/.test(u)?'economie.rss':/travail-emploi/.test(u)?'travail.rss':/rt-re-batiment/.test(u)?'re2020.rss':/batimentartisanal/.test(u)?'batimentartisanal.rss':/batijournal/.test(u)?'batijournal.rss':'cnil.rss'))};
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-'));
let heure='2026-11-16T06:00:00Z';
const v=creer({dir,env:{},fetch:flux,log:()=>{},maintenant:()=>new Date(heure)});
const vue=()=>JSON.stringify(v.liste().map(f=>[f.id,f.categorie,f.historique.length,f.validation]));

(async()=>{
await t('premier passage : chaque texte est vérifié, classé, en attente',async()=>{
 const r=await v.passer();assert.ok(r.nouveaux>0);assert.deepStrictEqual([r.modifies,r.erreurs],[0,0]);
 assert.ok(v.liste().every(f=>f.categorie&&f.categorie!=='aucun'&&f.validation==='attente'&&f.dateVerif==='2026-11-16'&&f.historique.length===0));
 assert.ok(v.liste().every(f=>['clarification','proposition','non_confirme','nouveaute'].includes(f.categorie)));   // des flux d'actualité ne confirment aucune obligation
 assert.ok(fs.existsSync(path.join(dir,'veille.json')));assert.deepStrictEqual(v.etat().sources,['bofip','entreprendre','particuliers','viepublique','ecologie','cnil','economie','travail','re2020','capeb','batiactu','batimentartisanal','batijournal'])});
await t('le lendemain, rien de neuf : ni doublon, ni historique, ni changement',async()=>{
 const avant=vue();heure='2026-11-17T06:00:00Z';const r=await v.passer();
 assert.deepStrictEqual([r.nouveaux,r.modifies,r.bloques],[0,0,0]);assert.strictEqual(vue(),avant);assert.ok(v.liste().every(f=>f.dateVerif==='2026-11-17'))});
await t('deux passages demandés ensemble : un seul tourne',async()=>{let n=0;
 const w=creer({dir:fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-')),env:{},log:()=>{},fetch:async u=>{n++;return flux(u)}});
 const [a,b]=await Promise.all([w.passer(),w.passer()]);assert.strictEqual(a,b);assert.strictEqual(n,13)});
await t('une source en panne : comptée, les autres textes sont gardés',async()=>{
 const w=creer({dir:fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-')),env:{},log:()=>{},fetch:async u=>/bofip/.test(String(u))?rep('',503):flux(u)});
 const r=await w.passer();assert.strictEqual(r.erreurs,1);assert.ok(r.nouveaux>0);assert.strictEqual(w.etat().erreurs,1)});
await t('un passage par jour, à partir de 5 h',()=>{
 assert.strictEqual(v.aFaire(new Date('2026-11-17T09:00:00Z')),false);assert.strictEqual(v.aFaire(new Date('2026-11-18T04:00:00Z')),false);assert.strictEqual(v.aFaire(new Date('2026-11-18T05:10:00Z')),true)});
await t('serveur : lecture réservée au propriétaire',async()=>{
 const {createServer}=require('../serveur/server.js');process.env.CASO_CLE_IA='cle-test';
 const s=createServer({dataDir:dir,veille:v,noTimers:true,appFile:path.join(__dirname,'..','index.html')}),srv=s.server||s;
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port;
 const get=(u,h)=>new Promise((ok,ko)=>http.get({host:'127.0.0.1',port,path:u,headers:h||{}},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>ok([r.statusCode,JSON.parse(d)]))}).on('error',ko));
 assert.strictEqual((await get('/api/veille/etat'))[0],404);assert.strictEqual((await get('/api/veille/textes',{'x-caso-cle':'faux'}))[0],404);
 const [c,b]=await get('/api/veille/etat',{'x-caso-cle':'cle-test'});assert.strictEqual(c,200);assert.ok(b.textes>0);assert.deepStrictEqual(b.sources,['bofip','entreprendre','particuliers','viepublique','ecologie','cnil','economie','travail','re2020','capeb','batiactu','batimentartisanal','batijournal']);assert.ok(b.dernierPassage);
 const [c2,L]=await get('/api/veille/textes',{'x-caso-cle':'cle-test'});assert.strictEqual(c2,200);assert.strictEqual(L.length,b.textes);
 assert.ok((await get('/api/veille/textes?bloque=1',{'x-caso-cle':'cle-test'}))[1].every(f=>f.bloque));
 assert.ok((await get('/api/veille/textes?categorie=clarification',{'x-caso-cle':'cle-test'}))[1].every(f=>f.categorie==='clarification'));
 delete process.env.CASO_CLE_IA;assert.strictEqual((await get('/api/veille/etat',{'x-caso-cle':''}))[0],404);
 await new Promise(r=>srv.close(r))});
console.log(ok+' contrôles réussis');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});

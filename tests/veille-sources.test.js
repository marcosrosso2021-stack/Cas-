/* Veille réglementaire, le collecteur : node tests/veille-sources.test.js (sans réseau, extraits réels des flux dans tests/veille/) */
'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const {creer,lireRss,lireJorf,pertinent,hoteAdmis}=require('../serveur/veille/sources.js');
let ok=0;const t=async(nom,f)=>{await f();ok++;console.log('✓',nom)};
const ext=n=>fs.readFileSync(path.join(__dirname,'veille',n),'utf8');
const rep=(corps,st)=>({ok:(st||200)<300,status:st||200,text:async()=>corps,json:async()=>JSON.parse(corps)});

(async()=>{
await t('BOFiP réel : identifiant ACTU, date lue dans le résumé, lien officiel',()=>{
 const v=lireRss(ext('bofip.rss'),'bofip');assert.ok(v.length>0);
 assert.ok(v.every(x=>/^\d{4}-\d\d-\d\d$/.test(x.datePub)&&/^ACTU-\d{4}-\d{5}$/.test(x.idSource)&&x.numero===x.idSource&&hoteAdmis(x.url)&&x.nature==='DOCTRINE'));
 assert.strictEqual(v[0].datePub,'2026-11-04')});
await t('Entreprendre réel : identifiant de l\'article, date du jour local, texte sans balises',()=>{
 const v=lireRss(ext('entreprendre.rss'),'entreprendre');assert.strictEqual(v.length,15);
 assert.ok(v.every(x=>/^A\d+$/.test(x.idSource)&&/^\d{4}-\d\d-\d\d$/.test(x.datePub)&&hoteAdmis(x.url)&&!/[<>]|&[a-z]+;/.test(x.titre+x.resume)));
 assert.strictEqual(v[0].idSource,'A18926');assert.strictEqual(v[0].datePub,'2026-11-13')});
await t('flux piégé : balises, entités, script, lien javascript',()=>{
 const p=lireRss('<rss><channel><item><title>TVA &amp; travaux &lt;b&gt;</title><link>javascript:alert(1)</link><description><![CDATA[<script>x</script>Taux r&eacute;duit]]></description><pubDate>Mon, 09 Nov 2026 08:00:00 GMT</pubDate><guid>g1</guid></item><item><title>Sans date</title><guid>g2</guid></item></channel></rss>','bofip');
 assert.strictEqual(p.length,1);assert.strictEqual(p[0].titre,'TVA & travaux');assert.strictEqual(p[0].url,'');assert.strictEqual(p[0].resume,'Taux réduit');assert.strictEqual(p[0].datePub,'2026-11-09');
 assert.throws(()=>lireRss('<html>Maintenance</html>','bofip'))});
await t('hôtes admis et filtre du bâtiment',()=>{
 assert.strictEqual(hoteAdmis('https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052000101'),true);
 assert.strictEqual(hoteAdmis('http://www.legifrance.gouv.fr/x'),false);assert.strictEqual(hoteAdmis('https://legifrance.gouv.fr.exemple.com/x'),false);assert.strictEqual(hoteAdmis('n\'importe quoi'),false);
 assert.strictEqual(pertinent('Nomination d\'un préfet',''),false);assert.strictEqual(pertinent('Décret relatif à la rénovation énergétique',''),true);
 assert.strictEqual(pertinent('Taux de TVA applicable','') ,true);assert.strictEqual(pertinent('Activation du compte',''),false);assert.strictEqual(pertinent('','Les micro-entrepreneurs sont concernés'),true)});
await t('une source en panne : l\'autre continue, l\'erreur est rendue',async()=>{
 const f=async u=>/bofip/.test(u)?rep('<html>Maintenance</html>'):rep(ext('entreprendre.rss'));
 const r=await creer({env:{},fetch:f,log:()=>{}}).collecter();
 assert.deepStrictEqual(r.erreurs.map(e=>e.source),['bofip']);assert.ok(r.bruts.length>0&&r.bruts.every(x=>x.source==='entreprendre'&&pertinent(x.titre,x.resume)));
 const r2=await creer({env:{},fetch:async()=>rep('',503),log:()=>{}}).collecter();assert.strictEqual(r2.erreurs.length,2);assert.strictEqual(r2.bruts.length,0);
 const r3=await creer({env:{},fetch:async()=>{throw new Error('réseau coupé')},log:()=>{}}).collecter();assert.strictEqual(r3.erreurs.length,2)});
await t('sans clés PISTE : Légifrance inactive, aucun appel vers PISTE',async()=>{const appels=[];
 const s=creer({env:{},fetch:async u=>{appels.push(String(u));return rep(ext('bofip.rss'))},log:()=>{}});
 assert.deepStrictEqual(s.actives(),['bofip','entreprendre']);await s.collecter();assert.ok(!appels.some(u=>/piste/.test(u)))});
await t('Journal officiel : textes du bâtiment seulement, hors mesures nominatives',()=>{
 const v=lireJorf(JSON.parse(ext('jorf.json')),'2026-11-11');
 assert.deepStrictEqual(v.map(x=>x.idSource),['JORFTEXT000052000101','JORFTEXT000052000102','JORFTEXT000052000103']);
 assert.strictEqual(v[0].nature,'DECRET');assert.strictEqual(v[0].nor,'ECOC2612345D');assert.strictEqual(v[0].complet,false);assert.ok(hoteAdmis(v[0].url))});
await t('Légifrance : jeton une seule fois, texte complet lu, clé jamais rendue ni journalisée',async()=>{const logs=[],appels=[];
 const g=async(u,i)=>{u=String(u);appels.push(u);
  if(/oauth/.test(u)){assert.ok(/client_secret=S3CR3Tzq/.test(i.body));return rep(JSON.stringify({access_token:'JTN9x7',expires_in:3600}))}
  if(!/piste/.test(u))return rep(/bofip/.test(u)?ext('bofip.rss'):ext('entreprendre.rss'));
  assert.strictEqual(i.headers.authorization,'Bearer JTN9x7');
  if(/lastNJo/.test(u))return rep(JSON.stringify({containers:[{id:'JORFCONT000052000001',datePubli:Date.UTC(2026,10,11,12)}]}));
  if(/jorfCont/.test(u))return rep(ext('jorf.json'));
  if(/consult\/jorf$/.test(u)){if(/000103/.test(i.body))return rep('',500);
   return rep(JSON.stringify({articles:[{content:'<p>Le présent décret entre en vigueur le 1er janvier 2027. Il modifie les mentions des devis.</p>'}]}))}
  return rep(/bofip/.test(u)?ext('bofip.rss'):ext('entreprendre.rss'))};
 const src=creer({env:{PISTE_CLIENT_ID:'id',PISTE_CLIENT_SECRET:'S3CR3Tzq'},fetch:g,log:(...m)=>logs.push(m.join(' '))});
 assert.deepStrictEqual(src.actives(),['bofip','entreprendre','legifrance']);
 const s=await src.collecter();assert.deepStrictEqual(s.erreurs,[]);const L=s.bruts.filter(x=>x.source==='legifrance');
 assert.deepStrictEqual(L.map(x=>x.idSource),['JORFTEXT000052000101','JORFTEXT000052000103']);assert.strictEqual(L[0].datePub,'2026-11-11');
 assert.strictEqual(L[0].complet,true);assert.ok(/entre en vigueur le 1er janvier 2027/.test(L[0].texte));assert.strictEqual(L[1].complet,false);
 assert.strictEqual(appels.filter(u=>/oauth/.test(u)).length,1);assert.ok(!JSON.stringify([s,logs]).includes('S3CR3Tzq'));const fu=JSON.stringify(s),ix=fu.indexOf('JTN9x7');assert.ok(ix<0,fu.slice(Math.max(0,ix-200),ix+50))});
await t('Légifrance refusée : erreur rendue, les flux restent lus',async()=>{
 const g=async u=>/piste/.test(String(u))?rep('{"error":"invalid_client"}',401):rep(/bofip/.test(u)?ext('bofip.rss'):ext('entreprendre.rss'));
 const s=await creer({env:{PISTE_CLIENT_ID:'id',PISTE_CLIENT_SECRET:'S3CR3Tzq'},fetch:g,log:()=>{}}).collecter();
 assert.deepStrictEqual(s.erreurs.map(e=>e.source),['legifrance']);assert.ok(s.bruts.length>0);assert.ok(!JSON.stringify(s).includes('S3CR3Tzq'))});
console.log(ok+' contrôles réussis');
})().catch(e=>{console.error(e);process.exit(1)});

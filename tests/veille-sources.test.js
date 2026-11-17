/* Veille réglementaire, le collecteur : node tests/veille-sources.test.js (sans réseau, extraits réels des flux dans tests/veille/) */
'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const {creer,lireRss,lireJorf,pertinent,hoteAdmis}=require('../serveur/veille/sources.js');
let ok=0;const t=async(nom,f)=>{await f();ok++;console.log('✓',nom)};
const ext=n=>fs.readFileSync(path.join(__dirname,'veille',n),'utf8');
/* chaque adresse reçoit son extrait réel */
const EXT=u=>{u=String(u);return ext(/bofip/.test(u)?'bofip.rss':/actu-actu-pro/.test(u)?'entreprendre.rss':/particuliers/.test(u)?'particuliers.rss':/vie-publique/.test(u)?'viepublique.rss':/ecologie/.test(u)?'ecologie.rss':/capeb/.test(u)?'capeb.rss':/batiactu/.test(u)?'batiactu.rss':/economie\.gouv/.test(u)?'economie.rss':/travail-emploi/.test(u)?'travail.rss':/rt-re-batiment/.test(u)?'re2020.rss':/batimentartisanal/.test(u)?'batimentartisanal.rss':/batijournal/.test(u)?'batijournal.rss':/zepros/.test(u)?'zepros.rss':/impots\.gouv\.fr\/toutes/.test(u)?'impots.html':/anah\.gouv/.test(u)?'anah.html':/inrs\.fr/.test(u)?'inrs.html':/preventionbtp/.test(u)?'oppbtp.html':/qualibat/.test(u)?'qualibat.html':/ffbatiment/.test(u)?'ffb.html':/batiweb/.test(u)?'batiweb.html':'cnil.rss')};
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
await t('nouvelles sources officielles : lues, liens propres, filtre strict sur le titre',()=>{
 const {pertinentStrict,AUTRES}=require('../serveur/veille/sources.js');
 assert.deepStrictEqual(AUTRES.map(x=>x[0]),['particuliers','viepublique','ecologie','cnil','economie','travail','re2020']);
 for(const s of ['particuliers','viepublique','ecologie','cnil','economie','travail','re2020']){const v=lireRss(ext(s+'.rss'),s);assert.ok(v.length>0,s);assert.ok(v.every(x=>hoteAdmis(x.url)&&!/[?#]/.test(x.url)&&x.idSource&&/^\d{4}-\d\d-\d\d$/.test(x.datePub)),s)}
 assert.ok(lireRss(ext('viepublique.rss'),'viepublique').every(x=>x.complet===false),'vie publique : aucune date déduite');
 assert.ok(lireRss(ext('particuliers.rss'),'particuliers').every(x=>/^A\d+$/.test(x.idSource)));
 for(const t of ['MaPrimeRénov : ce qui change en 2027','Diagnostic de performance énergétique : nouveau calcul','Données personnelles : la CNIL sanctionne','Projet de loi de finances pour 2027'])assert.ok(pertinentStrict(t),t);
 for(const t of ['Fermeture du tunnel de Saint-Cloud','Prix du carburant : entreprises de travaux forestiers','Ordre du jour de la séance plénière'])assert.ok(!pertinentStrict(t),t)});
await t('presse du métier : nouveauté nommée, jamais une obligation, publicités écartées',()=>{
 const {pertinentMetier,METIER}=require('../serveur/veille/sources.js'),{verifier}=require('../serveur/veille/verif.js'),{classer}=require('../serveur/veille/controle.js');
 assert.deepStrictEqual(METIER.map(x=>x[0]),['capeb','batiactu','batimentartisanal','batijournal','zepros']);
 const c=lireRss(ext('capeb.rss'),'capeb'),b=lireRss(ext('batiactu.rss'),'batiactu');
 assert.ok(c.length>0&&c.every(x=>/^https:\/\/www\.capeb\.fr\//.test(x.url)&&x.nature==='METIER'));
 assert.ok(b.every(x=>/^https:\/\/www\.batiactu\.com\//.test(x.url)),'liens publicitaires écartés');
 for(const [n,h] of [['batimentartisanal','www.lebatimentartisanal.com'],['batijournal','batijournal.com']]){const v=lireRss(ext(n+'.rss'),n);assert.ok(v.length>0&&v.every(x=>x.url.startsWith('https://'+h+'/')&&x.nature==='METIER'&&x.datePub),n)}assert.ok(!b.some(x=>/assureur/i.test(x.titre)));
 for(const x of c.concat(b)){const v=verifier(x,{aujourdhui:'2026-11-17'});assert.strictEqual(v.officiel,false);const k=classer(v,{etat:'nouveau'});assert.deepStrictEqual([k.categorie,k.bloque],['nouveaute',false])}
 assert.ok(pertinentMetier('Maçons-Carreleurs : nouvelles règles de l\'art pour les terrasses'));assert.ok(pertinentMetier('Bosch : de nouveaux outils pour les électriciens'));
 for(const t of ['Décès de Maurice Manceau, ancien directeur général','Au Maroc, Colas Rail décroche un nouveau contrat'])assert.ok(!pertinentMetier(t),t)});
await t('sites sans flux : la page d\'actualités donne titres et liens du site ; page changée ou piégée : erreur, rien d\'inventé',()=>{
 const {PAGES,lirePage}=require('../serveur/veille/sources.js');assert.deepStrictEqual(PAGES.map(x=>x[0]),['anah','impots','inrs','oppbtp','qualibat','ffb','batiweb']);
 for(const [s,u,c] of PAGES){const v=lirePage(ext(s+'.html'),s,u,c,'2026-11-17'),h=new URL(u).origin+'/';assert.ok(v.length>=5,s);
  assert.ok(v.every(x=>x.url.startsWith(h)&&!/[?#]/.test(x.url)&&x.titre.length>=20&&!/</.test(x.titre)&&/^\d{4}-\d\d-\d\d$/.test(x.datePub)&&x.complet===false&&x.nature===(s==='anah'||s==='impots'?'ACTU':'METIER')),s);
  assert.strictEqual(new Set(v.map(x=>x.idSource)).size,v.length,s)}
 const i=lirePage(ext('inrs.html'),'inrs',PAGES[2][1],PAGES[2][2],'2026-11-17');assert.ok(i.some(x=>x.datePub==='2026-11-16')&&!i.some(x=>/^\d\d\//.test(x.titre)),'date lue sur la page, retirée du titre');
 assert.ok(!lirePage(ext('batiweb.html'),'batiweb',PAGES[6][1],PAGES[6][2],'2026-11-17').some(x=>/ - Batiweb$/.test(x.titre)));
 const P='<html><body><a href="https://mechant.example/actualites/un-article-qui-vient-d-ailleurs">Un article qui vient d\'un autre site</a><a href="javascript:alert(1)">Un lien piégé qui ne mène nulle part</a><a href="/actualites/titre-avec-script"><script>alert(1)</script>Un titre <b>avec</b> des balises dedans</a><a href="/contact">Nous contacter pour toute question</a></body></html>';
 const v=lirePage(P,'anah',PAGES[0][1],PAGES[0][2],'2026-11-17');assert.strictEqual(v.length,1);assert.strictEqual(v[0].titre,'Un titre avec des balises dedans');assert.strictEqual(v[0].url,'https://www.anah.gouv.fr/actualites/titre-avec-script');
 assert.throws(()=>lirePage('<html><body><a href="/autre/chose">Une page refaite, sans articles reconnus</a></body></html>','anah',PAGES[0][1],PAGES[0][2],'2026-11-17'),/aucun article/);
 assert.throws(()=>lirePage('{"erreur":1}','anah',PAGES[0][1],PAGES[0][2],'2026-11-17'),/pas une page/)});
await t('un même article Service-Public dans deux flux : gardé une fois',async()=>{
 const it='<item><title>TVA des travaux de rénovation : ce qui change</title><link>https://www.service-public.gouv.fr/particuliers/actualites/A20500</link><description>x</description><guid>A20500_2026-11-16</guid><pubDate>Mon, 16 Nov 2026 08:00:00 GMT</pubDate></item>';
 const r=await creer({env:{},log:()=>{},fetch:async u=>rep(/actu-actu-pro|particuliers/.test(String(u))?'<rss><channel>'+it+'</channel></rss>':'<rss><channel></channel></rss>')}).collecter();
 assert.deepStrictEqual(r.bruts.map(x=>x.source+':'+x.idSource),['entreprendre:A20500'])});
await t('une source en panne : l\'autre continue, l\'erreur est rendue',async()=>{
 const f=async u=>/bofip/.test(u)?rep('<html>Maintenance</html>'):rep(EXT(u));
 const r=await creer({env:{},fetch:f,log:()=>{}}).collecter();
 assert.deepStrictEqual(r.erreurs.map(e=>e.source),['bofip']);assert.ok(r.bruts.length>0&&r.bruts.every(x=>x.source!=='bofip'));assert.ok(r.bruts.filter(x=>x.source==='entreprendre').every(x=>pertinent(x.titre,x.resume)));
 const r2=await creer({env:{},fetch:async()=>rep('',503),log:()=>{}}).collecter();assert.strictEqual(r2.erreurs.length,21);assert.strictEqual(r2.bruts.length,0);
 const r3=await creer({env:{},fetch:async()=>{throw new Error('réseau coupé')},log:()=>{}}).collecter();assert.strictEqual(r3.erreurs.length,21)});
await t('sans clés PISTE : Légifrance inactive, aucun appel vers PISTE',async()=>{const appels=[];
 const s=creer({env:{},fetch:async u=>{appels.push(String(u));return rep(ext('bofip.rss'))},log:()=>{}});
 assert.deepStrictEqual(s.actives(),['bofip','entreprendre','particuliers','viepublique','ecologie','cnil','economie','travail','re2020','capeb','batiactu','batimentartisanal','batijournal','zepros','anah','impots','inrs','oppbtp','qualibat','ffb','batiweb']);await s.collecter();assert.ok(!appels.some(u=>/piste/.test(u)))});
await t('Journal officiel : textes du bâtiment seulement, hors mesures nominatives',()=>{
 const v=lireJorf(JSON.parse(ext('jorf.json')),'2026-11-11');
 assert.deepStrictEqual(v.map(x=>x.idSource),['JORFTEXT000052000101','JORFTEXT000052000102','JORFTEXT000052000103']);
 assert.strictEqual(v[0].nature,'DECRET');assert.strictEqual(v[0].nor,'ECOC2612345D');assert.strictEqual(v[0].complet,false);assert.ok(hoteAdmis(v[0].url))});
await t('Légifrance : jeton une seule fois, texte complet lu, clé jamais rendue ni journalisée',async()=>{const logs=[],appels=[];
 const g=async(u,i)=>{u=String(u);appels.push(u);
  if(/oauth/.test(u)){assert.ok(/client_secret=S3CR3Tzq/.test(i.body));return rep(JSON.stringify({access_token:'JTN9x7',expires_in:3600}))}
  if(!/piste/.test(u))return rep(EXT(u));
  assert.strictEqual(i.headers.authorization,'Bearer JTN9x7');
  if(/lastNJo/.test(u))return rep(JSON.stringify({containers:[{id:'JORFCONT000052000001',datePubli:Date.UTC(2026,10,11,12)}]}));
  if(/jorfCont/.test(u))return rep(ext('jorf.json'));
  if(/consult\/jorf$/.test(u)){if(/000103/.test(i.body))return rep('',500);
   return rep(JSON.stringify({articles:[{content:'<p>Le présent décret entre en vigueur le 1er janvier 2027. Il modifie les mentions des devis.</p>'}]}))}
  return rep(EXT(u))};
 const src=creer({env:{PISTE_CLIENT_ID:'id',PISTE_CLIENT_SECRET:'S3CR3Tzq'},fetch:g,log:(...m)=>logs.push(m.join(' '))});
 assert.deepStrictEqual(src.actives(),['bofip','entreprendre','particuliers','viepublique','ecologie','cnil','economie','travail','re2020','capeb','batiactu','batimentartisanal','batijournal','zepros','anah','impots','inrs','oppbtp','qualibat','ffb','batiweb','legifrance']);
 const s=await src.collecter();assert.deepStrictEqual(s.erreurs,[]);const L=s.bruts.filter(x=>x.source==='legifrance');
 assert.deepStrictEqual(L.map(x=>x.idSource),['JORFTEXT000052000101','JORFTEXT000052000103']);assert.strictEqual(L[0].datePub,'2026-11-11');
 assert.strictEqual(L[0].complet,true);assert.ok(/entre en vigueur le 1er janvier 2027/.test(L[0].texte));assert.strictEqual(L[1].complet,false);
 assert.strictEqual(appels.filter(u=>/oauth/.test(u)).length,1);assert.ok(!JSON.stringify([s,logs]).includes('S3CR3Tzq'));const fu=JSON.stringify(s),ix=fu.indexOf('JTN9x7');assert.ok(ix<0,fu.slice(Math.max(0,ix-200),ix+50))});
await t('Légifrance refusée : erreur rendue, les flux restent lus',async()=>{
 const g=async u=>/piste/.test(String(u))?rep('{"error":"invalid_client"}',401):rep(EXT(u));
 const s=await creer({env:{PISTE_CLIENT_ID:'id',PISTE_CLIENT_SECRET:'S3CR3Tzq'},fetch:g,log:()=>{}}).collecter();
 assert.deepStrictEqual(s.erreurs.map(e=>e.source),['legifrance']);assert.ok(s.bruts.length>0);assert.ok(!JSON.stringify(s).includes('S3CR3Tzq'))});
console.log(ok+' contrôles réussis');
})().catch(e=>{console.error(e);process.exit(1)});

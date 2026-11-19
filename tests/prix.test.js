/* Prix des matériaux en ligne : node tests/prix.test.js (sans réseau, le service est simulé) */
'use strict';
const assert=require('assert'),os=require('os'),fs=require('fs'),path=require('path'),http=require('http');
const {creer,convertir}=require('../serveur/prix.js');
let ok=0;const t=async(nom,f)=>{await f();ok++;console.log('✓',nom)};

const REP={shopping_results:[
 {title:'Plaque de plâtre BA13 2500x1200',price:'9,45 €',extracted_price:9.45,source:'Leroy Merlin',product_link:'https://www.google.com/shopping/product/1'},
 {title:'Plaque BA13 Placo 2,50 m',price:'8,90 €',source:'Castorama',link:'https://www.castorama.fr/x'},
 {title:'Sans prix',source:'X'},
 {title:'Sans magasin',extracted_price:3},
 {title:'Lien piégé',extracted_price:5,source:'Y',link:'javascript:alert(1)'},
 {title:'Plaque BA13 Placo 2,50 m',extracted_price:8.9,source:'Castorama'}]};
function faux(rep,st){const appels=[];const f=async(u)=>{appels.push(String(u));return{ok:(st||200)<300,status:st||200,json:async()=>rep}};f.appels=appels;return f}

(async()=>{
await t('convertir : prix, magasin, doublons, liens https seulement, tri',()=>{
 const v=convertir(REP,'EUR');
 assert.deepStrictEqual(v.map(x=>[x.magasin,x.prix]),[['Y',5],['Castorama',8.9],['Leroy Merlin',9.45]]);
 assert.strictEqual(v[0].url,'');assert.strictEqual(v[1].url,'https://www.castorama.fr/x');
 assert.ok(/^\d{4}-\d\d-\d\d$/.test(v[0].maj));assert.strictEqual(v[0].devise,'EUR');
});
await t('sans clé : 503, aucun appel',async()=>{const f=faux(REP),p=creer({env:{},fetch:f});
 const [c]=await p.chercher('placo','FR','1');assert.strictEqual(c,503);assert.strictEqual(f.appels.length,0)});
await t('SearchApi en priorité, pays et langue, clé jamais renvoyée',async()=>{const f=faux(REP),p=creer({env:{SEARCHAPI_KEY:'sa',SERPAPI_KEY:'sp'},fetch:f});
 const [c,b]=await p.chercher('placo BA13','ES','1');assert.strictEqual(c,200);
 assert.ok(f.appels[0].startsWith('https://www.searchapi.io/api/v1/search?'));assert.ok(/gl=es&hl=es/.test(f.appels[0]));assert.ok(/api_key=sa/.test(f.appels[0]));
 assert.ok(!JSON.stringify(b).includes('sa"'));});
await t('SerpApi si seule clé, pays inconnu → France',async()=>{const f=faux(REP),p=creer({env:{SERPAPI_KEY:'sp'},fetch:f});
 await p.chercher('placo','ZZ','1');assert.ok(f.appels[0].startsWith('https://serpapi.com/search.json?'));assert.ok(/gl=fr&hl=fr/.test(f.appels[0]))});
await t('cache : même recherche payée une fois (casse et espaces)',async()=>{const f=faux(REP),p=creer({env:{SEARCHAPI_KEY:'k'},fetch:f});
 await p.chercher('Placo BA13','FR','1');await p.chercher('  placo   ba13 ','FR','2');assert.strictEqual(f.appels.length,1)});
await t('limites : par adresse et par jour',async()=>{const f=faux(REP),p=creer({env:{SEARCHAPI_KEY:'k',PRIX_IP:'2',PRIX_JOUR:'3'},fetch:f});
 assert.strictEqual((await p.chercher('a1','FR','A'))[0],200);assert.strictEqual((await p.chercher('a2','FR','A'))[0],200);
 assert.strictEqual((await p.chercher('a3','FR','A'))[0],429);
 assert.strictEqual((await p.chercher('b1','FR','B'))[0],200);assert.strictEqual((await p.chercher('b2','FR','B'))[0],429);
 assert.strictEqual(f.appels.length,3)});
await t('recherche trop courte : 400 ; service en panne : 502 sans détail',async()=>{const p=creer({env:{SEARCHAPI_KEY:'k'},log:()=>{},fetch:faux({error:'Invalid API key k'},401)});
 assert.strictEqual((await p.chercher('a','FR','1'))[0],400);const [c,b]=await p.chercher('placo','FR','1');assert.strictEqual(c,502);assert.ok(!/k\b|Invalid/.test(b.error))});
await t('SerpApi « aucun résultat » : liste vide, pas une panne',async()=>{const p=creer({env:{SERPAPI_KEY:'k'},log:()=>{},fetch:faux({error:"Google hasn't returned any results for this query."})});
 const [c,b]=await p.chercher('xyzxyz','FR','1');assert.strictEqual(c,200);assert.deepStrictEqual(b,[])});
await t('photos : petite image ou hôte du service seulement',async()=>{
 const v=convertir({shopping_results:[
  {title:'A',extracted_price:1,source:'S',thumbnail:'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:x'},
  {title:'B',extracted_price:2,source:'S',thumbnail:'https://pirate.example/x.jpg',serpapi_thumbnail:'https://serpapi.com/images/url/abc'},
  {title:'C',extracted_price:3,source:'S',thumbnail:'data:image/jpeg;base64,AAAA'},
  {title:'D',extracted_price:4,source:'S',thumbnail:'data:text/html;base64,AAAA'},
  {title:'E',extracted_price:5,source:'S',thumbnail:'http://encrypted-tbn0.gstatic.com/x'},
  {title:'F',extracted_price:6,source:'S',thumbnail:'https://gstatic.com.pirate.example/x'}]},'EUR');
 assert.deepStrictEqual(v.map(x=>x.photo),['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:x','https://serpapi.com/images/url/abc','data:image/jpeg;base64,AAAA','','','']);
 const img=(type,n)=>async()=>({ok:true,status:200,headers:{get:()=>type},arrayBuffer:async()=>new Uint8Array(n).buffer});
 const p=creer({env:{SEARCHAPI_KEY:'k'},fetch:img('image/jpeg; charset=x',10)});
 assert.strictEqual((await p.image('https://pirate.example/x.jpg'))[0],400);
 assert.strictEqual((await p.image('http://127.0.0.1/x'))[0],400);
 const [c,o]=await p.image('https://encrypted-tbn0.gstatic.com/shopping?q=tbn:x');assert.strictEqual(c,200);assert.strictEqual(o.type,'image/jpeg');assert.strictEqual(o.buf.length,10);
 assert.strictEqual((await creer({env:{},fetch:img('text/html',10)}).image('https://serpapi.com/a'))[0],502);
 assert.strictEqual((await creer({env:{},fetch:img('image/png',5e5)}).image('https://serpapi.com/a'))[0],502)});
await t('tous les magasins restent : plus de 30 offres, et un magasin cher n\'est pas écarté',()=>{
 const L=[];for(let i=0;i<150;i++)L.push({title:'Vis '+i,extracted_price:1+i/100,source:'Pas cher'});
 L.push({title:'Marteau pro',extracted_price:89,source:'Point.P'},{title:'Marteau',extracted_price:45,source:'Leroy Merlin'});
 const v=convertir({shopping_results:L},'EUR');
 assert.strictEqual(v.length,120);assert.ok(v.some(x=>x.magasin==='Point.P'));assert.ok(v.some(x=>x.magasin==='Leroy Merlin'));
 assert.ok(v.every((x,i)=>!i||v[i-1].prix<=x.prix));
 const w=convertir({shopping_results:Array.from({length:45},(_,i)=>({title:'P'+i,extracted_price:i+1,source:'M'+(i%9)}))},'EUR');assert.strictEqual(w.length,45)});
await t('un magasin précis : ses offres Google Shopping, sinon les pages de son site avec un prix',async()=>{
 const appels=[];const f=rep=>async u=>{appels.push(String(u));const e=new URL(u).searchParams.get('engine');return{ok:true,status:200,json:async()=>rep[e]}};
 // 1. l'enseigne est dans Google Shopping : une seule recherche, seules ses offres
 let p=creer({env:{SERPAPI_KEY:'k'},fetch:f({google_shopping:{shopping_results:[{title:'Marteau A',extracted_price:12,source:'Bricoman'},{title:'Marteau B',extracted_price:9,source:'Amazon.fr'}]}})});
 let [c,v]=await p.chercher('marteau','FR','1','bricoman.fr','Bricoman');
 assert.strictEqual(c,200);assert.deepStrictEqual(v.map(x=>x.magasin),['Bricoman']);assert.strictEqual(appels.length,1);assert.ok(/q=marteau\+Bricoman/.test(appels[0]));
 // 2. absente : deuxième recherche sur son site ; on ne garde que les pages du site, avec un prix en euros
 appels.length=0;
 p=creer({env:{SERPAPI_KEY:'k',PRIX_IP:'10'},fetch:f({google_shopping:{shopping_results:[{title:'Marteau B',extracted_price:9,source:'Amazon.fr'}]},google:{organic_results:[
  {title:'Marteau de coffreur 600 g',link:'https://www.pointp.fr/p/marteau-1',thumbnail:'https://encrypted-tbn0.gstatic.com/images?q=tbn:a',rich_snippet:{bottom:{detected_extensions:{price:24.9,currency:'€'},extensions:['24,90 €']}}},
  {title:'Massette',link:'https://www.pointp.fr/p/massette',rich_snippet:{top:{detected_extensions:{price:'18,50',currency:'€'}}}},
  {title:'Sans prix',link:'https://www.pointp.fr/p/x',rich_snippet:{bottom:{detected_extensions:{rating:4}}}},
  {title:'Autre site',link:'https://pointp.fr.pirate.example/p',rich_snippet:{bottom:{detected_extensions:{price:1,currency:'€'}}}},
  {title:'En dollars',link:'https://www.pointp.fr/p/y',rich_snippet:{bottom:{detected_extensions:{price:5,currency:'$'}}}}]}})});
 [c,v]=await p.chercher('marteau','FR','1','pointp.fr','Point.P');
 assert.strictEqual(c,200);assert.deepStrictEqual(v.map(x=>[x.produit,x.prix,x.magasin,x.src]),[['Massette',18.5,'Point.P','site'],['Marteau de coffreur 600 g',24.9,'Point.P','site']]);
 assert.strictEqual(appels.length,2);assert.ok(/engine=google&/.test(appels[1])&&/site%3Apointp\.fr/.test(appels[1]));
 assert.strictEqual(p.etat().jour,2);
 await p.chercher('marteau','FR','2','pointp.fr','Point.P');assert.strictEqual(appels.length,2);// cache
 assert.strictEqual((await p.chercher('marteau','FR','1','pas un domaine','X'))[0],400);
 assert.strictEqual((await p.chercher('marteau','FR','1','pointp.fr',''))[0],400)});
await t('compte : 300 recherches payantes par mois, le cache ne compte pas, refus clair au-delà',async()=>{
 const f=faux(REP),p=creer({env:{SEARCHAPI_KEY:'k',PRIX_MOIS:'3'},fetch:f});
 for(const q of ['a1','a2','a3'])assert.strictEqual((await p.chercher(q,'FR','1','','','c1'))[0],200);
 assert.strictEqual((await p.chercher('a1','FR','1','','','c1'))[0],200,'déjà en cache : gratuit');
 const [c,b]=await p.chercher('a4','FR','1','','','c1');assert.strictEqual(c,429);assert.ok(/mois/.test(b.error));assert.strictEqual(b.limite,3);
 assert.strictEqual(f.appels.length,3);assert.strictEqual(p.reste('c1'),0);
 assert.strictEqual((await p.chercher('a4','FR','1','','','c2'))[0],200,'autre compte : son propre quota');
 assert.strictEqual((await p.chercher('a1','FR','9','','','c3'))[0],200,'recherche d\'un autre déjà en cache : gratuite');
 assert.strictEqual(p.reste('c3'),3)});
await t('compte : les limites anonymes (jour, adresse) ne s\'appliquent pas',async()=>{
 const p=creer({env:{SEARCHAPI_KEY:'k',PRIX_IP:'1',PRIX_JOUR:'1'},fetch:faux(REP)});
 assert.strictEqual((await p.chercher('b1','FR','1'))[0],200);assert.strictEqual((await p.chercher('b2','FR','1'))[0],429);
 assert.strictEqual((await p.chercher('b3','FR','1','','','c1'))[0],200);assert.strictEqual((await p.chercher('b4','FR','1','','','c1'))[0],200)});
await t('enseigne : chaque étape payante compte pour le compte',async()=>{
 const f=faux({shopping_results:[]}),p=creer({env:{SEARCHAPI_KEY:'k',PRIX_MOIS:'2'},fetch:f});
 assert.strictEqual((await p.chercher('vis','FR','1','pointp.fr','Point.P','c1'))[0],200);
 assert.strictEqual(f.appels.length,2);assert.strictEqual(p.reste('c1'),0);
 assert.strictEqual((await p.chercher('clou','FR','1','pointp.fr','Point.P','c1'))[0],429)});
await t('cache et compteurs gardés sur disque : relus après redémarrage, sans les images incluses',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-prix-'));
 const R2={shopping_results:[{title:'Seau',extracted_price:3,source:'Brico',thumbnail:'data:image/png;base64,AAAA'}]};
 const f1=faux(R2),p1=creer({dir,env:{SEARCHAPI_KEY:'k',PRIX_MOIS:'5'},fetch:f1});
 await p1.chercher('seau','FR','1','','','c1');p1.ecrire();
 const o=JSON.parse(fs.readFileSync(path.join(dir,'prix.json'),'utf8'));assert.strictEqual(o.cache['FR|seau'].v[0].photo,'');
 const f2=faux(R2),p2=creer({dir,env:{SEARCHAPI_KEY:'k',PRIX_MOIS:'5'},fetch:f2});
 const [c,b]=await p2.chercher('seau','FR','1','','','c2');assert.strictEqual(c,200);assert.strictEqual(b[0].magasin,'Brico');
 assert.strictEqual(f2.appels.length,0,'après redémarrage : réponse prise dans le cache');assert.strictEqual(p2.reste('c1'),4);
 fs.writeFileSync(path.join(dir,'prix.json'),'{pas du json');assert.doesNotThrow(()=>creer({dir,env:{SEARCHAPI_KEY:'k'},fetch:faux(R2)}));
 fs.rmSync(dir,{recursive:true,force:true})});
await t('cache expiré non relu ; taille du cache bornée',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-prix-'));
 fs.writeFileSync(path.join(dir,'prix.json'),JSON.stringify({mois:'2000-01',comptes:{c1:299},cache:{'FR|vieux':{t:Date.now()-13*36e5,v:[]}}}));
 const f=faux(REP),p=creer({dir,env:{SEARCHAPI_KEY:'k',PRIX_CACHE_N:'2'},fetch:f});
 await p.chercher('vieux','FR','1');assert.strictEqual(f.appels.length,1);assert.strictEqual(p.reste('c1'),300,'autre mois : compteur remis à zéro');
 await p.chercher('x1','FR','1');await p.chercher('x2','FR','1');assert.strictEqual(p.etat().cache,2);
 fs.rmSync(dir,{recursive:true,force:true})});
await t('serveur : GET /api/prix sans compte',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-prix-'));
 const {createServer}=require('../serveur/server.js');
 const prix=creer({env:{SEARCHAPI_KEY:'k'},fetch:faux(REP)});
 const s=createServer({dataDir:dir,prix,appFile:path.join(__dirname,'..','index.html')});const srv=s.server||s;
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port;
 const get=u=>new Promise((ok,ko)=>http.get({host:'127.0.0.1',port,path:u},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>ok([r.statusCode,JSON.parse(d),r.headers]))}).on('error',ko));
 const [c,b,h]=await get('/api/prix?q=placo%20BA13&pays=FR');
 assert.strictEqual(c,200);assert.strictEqual(b[0].magasin,'Y');assert.strictEqual(h['access-control-allow-origin'],'*');
 assert.strictEqual((await get('/api/prix?q=a'))[0],400);
 const getA=(u,j)=>new Promise((ok,ko)=>http.get({host:'127.0.0.1',port,path:u,headers:{authorization:'Bearer '+j}},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>ok([r.statusCode,JSON.parse(d)]))}).on('error',ko));
 assert.strictEqual((await getA('/api/prix?q=placo%20BA14','f'.repeat(64)))[0],200,'jeton inconnu : traité comme anonyme');
 /* jeton valide : compté pour ce compte, pas pour l'adresse */
 const c1=s.auth._d();c1.comptes.cX={id:'cX',via:'google',mode:'artisan',essaiFin:Date.now()+10*864e5};const j='a'.repeat(64);
 c1.sessions[require('crypto').createHash('sha256').update(j).digest('hex')]={id:'cX',exp:Date.now()+864e5,vu:Date.now()};
 assert.strictEqual((await getA('/api/prix?q=placo%20BA15',j))[0],200);assert.strictEqual(prix.reste('cX'),299);
 /* après l'essai, sans le module Fournisseurs : refusé, rien de décompté */
 c1.comptes.cX.essaiFin=Date.now()-864e5;const [c4,b4]=await getA('/api/prix?q=placo%20BA16',j);
 assert.strictEqual(c4,403);assert.strictEqual(b4.module,'fournisseurs');assert.strictEqual(prix.reste('cX'),299);
 srv.close();fs.rmSync(dir,{recursive:true,force:true})});
console.log(ok+' contrôles OK');
})().catch(e=>{console.error('✗',e);process.exit(1)});

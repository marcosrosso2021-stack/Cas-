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
 srv.close();fs.rmSync(dir,{recursive:true,force:true})});
console.log(ok+' contrôles OK');
})().catch(e=>{console.error('✗',e);process.exit(1)});

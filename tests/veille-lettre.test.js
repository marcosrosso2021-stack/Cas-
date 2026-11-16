/* Veille réglementaire, la newsletter (ce que l'appli lit, « Ça me concerne ? », envoi, notifications) : node tests/veille-lettre.test.js */
'use strict';
const assert=require('assert'),os=require('os'),fs=require('fs'),path=require('path'),http=require('http');
const {creer,lundi}=require('../serveur/veille/index.js'),V=require('../chat/veille.js');
let ok=0;const t=async(nom,f)=>{await f();ok++;console.log('✓',nom)};
const A='2026-11-16';

(async()=>{
await t('Pour qui : oui, non, ou « si tu fais partie de… » quand on ne sait pas',()=>{
 assert.deepStrictEqual(V.concerne({},{pros:['artisans du bâtiment']}),{etat:'oui',texte:'Oui, toi'});assert.strictEqual(V.concerne(null,{}).etat,'oui');
 assert.strictEqual(V.concerne({forme:'Micro-entreprise'},{pros:['micro-entrepreneurs']}).etat,'oui');assert.strictEqual(V.concerne({franchise:true},{pros:['micro-entrepreneurs']}).etat,'oui');
 assert.deepStrictEqual(V.concerne({forme:'SARL'},{pros:['micro-entrepreneurs']}),{etat:'non',texte:'Non, pas toi'});
 assert.strictEqual(V.concerne({},{pros:['micro-entrepreneurs']}).etat,'peut');
 assert.deepStrictEqual(V.concerne({forme:'SARL'},{pros:['sous-traitants','employeurs']}),{etat:'peut',texte:'Si tu fais partie des sous-traitants, employeurs'});
 assert.strictEqual(V.concerne({forme:'SARL'},{pros:['micro-entrepreneurs','sous-traitants']}).etat,'peut')});
await t('Quand : date en clair et délai ; une proposition ne change rien',()=>{
 assert.strictEqual(V.quand({dateVigueur:'2027-01-01'},A),'1er janvier 2027, dans 46 jours');assert.strictEqual(V.quand({dateVigueur:'2026-11-17'},A),'17 novembre 2026, demain');
 assert.strictEqual(V.quand({dateVigueur:'2026-11-16'},A),'Aujourd\'hui');assert.strictEqual(V.quand({dateVigueur:'2026-11-04'},A),'Depuis le 4 novembre 2026');
 assert.strictEqual(V.quand({},A),'');assert.ok(/Pas encore voté/.test(V.quand({categorie:'proposition',dateVigueur:'2027-01-01'},A)))});
await t('cartes à montrer : les nouvelles, pas celles déjà ouvertes, de retour à 90, 30 et 7 jours',()=>{
 const it={id:'a',titre:'T',dateVigueur:'2027-09-01',pros:[]},non={id:'b',titre:'U',pros:['micro-entrepreneurs']};
 assert.deepStrictEqual(V.aMontrer([it,non],{},{forme:'SARL'},A).map(x=>x.id),['a']);
 assert.strictEqual(V.aMontrer([it],{a:0},{},A).length,0);assert.strictEqual(V.aMontrer([it],{a:0},{},'2027-06-10').length,1);
 assert.strictEqual(V.aMontrer([it],{a:1},{},'2027-06-10').length,0);assert.strictEqual(V.aMontrer([it],{a:1},{},'2027-08-05').length,1);assert.strictEqual(V.aMontrer([it],{a:2},{},'2027-08-27').length,1);
 assert.strictEqual(V.aMontrer([it],{a:3},{},'2027-09-02').length,0);assert.strictEqual(V.aMontrer([{id:'c'},null,{titre:'x'}],{},{},A).length,0);
 assert.strictEqual(V.aMontrer([it],{__proto__:null},{},A).length,1);assert.strictEqual(V.aMontrer([1,2,3,4,5,6,7].map(i=>({id:'k'+i,titre:'T'})),{},{},A).length,5)});
await t('carte : fermée = titre et bouton ; ouverte = trois lignes ; rien d\'exécutable',()=>{
 const it={id:'x"><img src=x onerror=alert(1)>',titre:'<script>alert(1)</script> Devis',dateVigueur:'2027-01-01',pros:[],aFaire:'Rien : casô <b>met</b> à jour',url:'javascript:alert(1)'};
 const f=V.carte(it,false,{},A),o=V.carte(it,true,{},A);
 assert.ok(/Ça me concerne \?/.test(f)&&!/Pour qui/.test(f));assert.ok(/Pour qui/.test(o)&&/Quand/.test(o)&&/À faire/.test(o)&&!/Ça me concerne/.test(o));
 for(const h of [f,o]){assert.ok(!/<script|<img|<b>|javascript:/.test(h));assert.ok(/&lt;script&gt;/.test(h))}
 assert.ok(/href="https:\/\/www\.legifrance\.gouv\.fr\/x"/.test(V.carte({...it,url:'https://www.legifrance.gouv.fr/x'},true,{},A)));
 assert.ok(!/À faire/.test(V.carte({...it,aFaire:''},true,{},A)));assert.ok(/Une échéance approche/.test(V.carte({id:'a',titre:'T',dateVigueur:'2026-12-01'},false,{},A)))});

await t('dans l\'appli (faux navigateur) : la carte arrive en haut du chat, s\'ouvre au toucher, ne revient pas ; rien en mode Bricoleur',async()=>{
 const vm=require('vm'),src=fs.readFileSync(path.join(__dirname,'..','chat','veille.js'),'utf8');
 const monter=(mode,items)=>{const mem={},ecoute={},log={html:'',querySelectorAll:()=>[],insertAdjacentHTML(p,h){this.html=h+this.html}};let rendus=0;
  const w={CASO_APPRIS:'https://serveur.test',navigator:{onLine:true},db:{prof:{forme:'SARL'}},accountGet:()=>({mode}),i18nT:x=>x,
   localStorage:{getItem:k=>k in mem?mem[k]:null,setItem:(k,v)=>{mem[k]=v}},
   document:{hidden:false,getElementById:i=>i==='chatLog'?log:null,addEventListener:(n,f)=>{ecoute[n]=f}},
   fetch:async u=>{w.appel=u;return {ok:true,json:async()=>items}},chatRender(){rendus++;log.html='<div class="msg bot">Bonjour</div>'}};
  w.window=w;vm.runInNewContext(src,w);return {w,log,ecoute,mem,rendus:()=>rendus}};
 const items=[{id:'legifrance:A',titre:'Devis : nouvelle mention',dateVigueur:'2099-01-01',pros:[],aFaire:'Rien.',url:'https://www.legifrance.gouv.fr/x'},{id:'legifrance:B',titre:'Micro seulement',pros:['micro-entrepreneurs']}];
 const a=monter('artisan',items);await new Promise(r=>setTimeout(r,20));
 assert.strictEqual(a.w.appel,'https://serveur.test/api/veille/lettre');assert.ok(/Devis : nouvelle mention/.test(a.log.html)&&/Ça me concerne/.test(a.log.html));assert.ok(!/Micro seulement/.test(a.log.html));
 a.w.chatRender();assert.ok(a.log.html.indexOf('Devis : nouvelle mention')<a.log.html.indexOf('Bonjour'));
 a.ecoute.click({target:{closest:()=>({getAttribute:()=>'legifrance:A'})}});assert.ok(/Pour qui/.test(a.log.html)&&/Rien\./.test(a.log.html)&&/Texte officiel/.test(a.log.html));
 assert.strictEqual(JSON.parse(a.mem.caso_veille).vus['legifrance:A'],0);
 a.w.chatRender();assert.ok(/Pour qui/.test(a.log.html));
 const b=monter('bricoleur',items);await new Promise(r=>setTimeout(r,20));assert.strictEqual(b.w.appel,undefined);assert.strictEqual(b.log.html,'')});

/* côté serveur */
const brut=(n,titre,texte)=>({source:'legifrance',idSource:'JORFTEXT00005200'+n,titre,url:'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT00005200'+n,datePub:'2026-11-11',resume:'',texte,nature:'DECRET',numero:'',nor:'',dateVigueur:''});
let bruts=[brut('2001','Décret n° 2026-2001 du 10 novembre 2026 relatif aux mentions obligatoires des devis','Le présent décret entre en vigueur le 1er mars 2027.'),
 brut('2002','Décret n° 2026-2002 du 10 novembre 2026 relatif à la TVA des travaux','Le présent décret entre en vigueur le 1er décembre 2026.'),
 brut('2003','Décret n° 2026-2003 du 10 novembre 2026 relatif aux déchets de chantier','Le présent décret entre en vigueur le 1er juin 2027.')];
let heure='2026-11-18T09:00:00Z';const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-'));
const v=creer({dir,env:{},log:()=>{},maintenant:()=>new Date(heure),sources:{actives:()=>['test'],collecter:async()=>({erreurs:[],bruts})}});
const I=n=>'legifrance:JORFTEXT00005200'+n;

await t('rien ne sort sans validation et sans accord d\'envoi',async()=>{
 await v.passer();assert.deepStrictEqual(v.lettre(),[]);assert.strictEqual(lundi('2026-11-18'),'2026-11-23');assert.strictEqual(lundi('2026-11-23'),'2026-11-30');
 v.decider(I('2003'),'valide');assert.deepStrictEqual(v.lettre(),[]);
 assert.strictEqual(v.decider(I('2001'),'attente',{lettre:true,aFaire:'Rien : casô mettra tes devis à jour.'})[1].publieLe,'');assert.deepStrictEqual(v.lettre(),[])});
await t('texte critique : sort tout de suite ; les autres le lundi suivant',async()=>{
 const p0=v.decider(I('2002'),'valide',{lettre:true,aFaire:'Vérifie le taux de TVA de tes devis en cours.'})[1];assert.deepStrictEqual([p0.priorite,p0.publieLe],['P0','2026-11-18']);
 const p2=v.decider(I('2001'),'valide',{lettre:true})[1];assert.deepStrictEqual([p2.priorite,p2.publieLe,p2.aFaire],['P2','2026-11-23','Rien : casô mettra tes devis à jour.']);
 const L=v.lettre();assert.deepStrictEqual(L.map(x=>x.id),[I('2002')]);
 assert.deepStrictEqual(Object.keys(L[0]).sort(),['aFaire','categorie','datePub','dateVigueur','id','priorite','pros','publieLe','resume','titre','url']);
 assert.deepStrictEqual(v.aAnnoncer().map(x=>x.id),[I('2002')]);v.annonce([I('2002')]);assert.deepStrictEqual(v.aAnnoncer(),[]);
 heure='2026-11-23T07:00:00Z';assert.deepStrictEqual(v.lettre().map(x=>x.id),[I('2001'),I('2002')]);assert.deepStrictEqual(v.aAnnoncer().map(x=>x.id),[I('2001')])});
await t('accord retiré, refus, ou texte modifié à la source : la carte ne sort plus',async()=>{
 v.decider(I('2002'),'valide',{lettre:false});assert.deepStrictEqual(v.lettre().map(x=>x.id),[I('2001')]);
 bruts=[brut('2001','Décret n° 2026-2001 du 10 novembre 2026 relatif aux mentions obligatoires des devis','Le présent décret entre en vigueur le 1er avril 2027.')];
 await v.passer();assert.deepStrictEqual(v.lettre(),[]);const f=v.lire(I('2001'));assert.deepStrictEqual([f.validation,f.lettre,f.publieLe],['attente',false,'']);
 assert.strictEqual(v.decider(I('2001'),'valide')[1].publieLe,'');assert.deepStrictEqual(v.lettre(),[])});
await t('serveur : newsletter lisible sans clé, notification aux abonnés pour un texte critique, une seule fois',async()=>{
 const {createServer}=require('../serveur/server.js');process.env.CASO_CLE_IA='cle-test';const envois=[];
 const d2=fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-'));
 fs.writeFileSync(path.join(d2,'data.json'),JSON.stringify({users:{},subs:[{user:'a',sub:{endpoint:'https://push.example/1'}},{user:'b',sub:{endpoint:'https://push.example/2'}}]}));
 const s=createServer({dataDir:d2,veille:v,noTimers:true,appFile:path.join(__dirname,'..','index.html'),pushSend:async(sub,p)=>{envois.push([sub.endpoint,p]);return {status:sub.endpoint.endsWith('2')?410:201}}}),srv=s.server||s;
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port;
 const req=(m,u,h,b)=>new Promise((ok,ko)=>{const r=http.request({host:'127.0.0.1',port,path:u,method:m,headers:Object.assign(b?{'content-type':'application/json'}:{},h||{})},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>ok([x.statusCode,JSON.parse(d),x.headers]))});r.on('error',ko);r.end(b?JSON.stringify(b):undefined)});
 const [c,L,h]=await req('GET','/api/veille/lettre');assert.strictEqual(c,200);assert.deepStrictEqual(L,[]);assert.strictEqual(h['access-control-allow-origin'],'*');
 heure='2026-11-24T09:00:00Z';
 const [c2,f]=await req('POST','/api/veille/decider',{'x-caso-cle':'cle-test'},{id:I('2002'),decision:'valide',corrections:{lettre:true}});
 assert.strictEqual(c2,200);assert.deepStrictEqual([f.priorite,f.publieLe],['P0','2026-11-24']);await new Promise(r=>setTimeout(r,50));
 assert.strictEqual(envois.length,2);assert.ok(/Du nouveau pour ton métier : Décret n° 2026-2002/.test(envois[0][1].body));assert.strictEqual(envois[0][1].tag,'veille');
 await req('POST','/api/veille/decider',{'x-caso-cle':'cle-test'},{id:I('2002'),decision:'valide',corrections:{aFaire:'Vérifie tes devis.'}});await new Promise(r=>setTimeout(r,50));
 assert.strictEqual(envois.length,2);
 const L2=(await req('GET','/api/veille/lettre'))[1];assert.deepStrictEqual(L2.map(x=>[x.id,x.aFaire]),[[I('2002'),'Vérifie tes devis.']]);assert.ok(!JSON.stringify(L2).includes('historique'));
 await new Promise(r=>srv.close(r))});
console.log(ok+' contrôles réussis');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});

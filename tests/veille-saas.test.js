/* Tableau de bord du propriétaire (onglet « casô » de /veille) : node tests/veille-saas.test.js */
'use strict';
const assert=require('assert'),os=require('os'),fs=require('fs'),path=require('path'),http=require('http');
let ok=0;const t=async(nom,f)=>{await f();ok++;console.log('✓',nom)};
(async()=>{
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-saas-')),T=Date.now(),J=864e5;
const c=(id,mode,jours,x)=>Object.assign({id,cle:'cle-'+id,via:'google',email:id+'@secret.example',prenom:'Prénom-'+id,mode,creeLe:T-jours*J,essaiFin:mode==='artisan'?T-jours*J+30*J:0},x||{});
fs.writeFileSync(path.join(dir,'comptes.json'),JSON.stringify({n:5,comptes:{c1:c('c1','artisan',2),c2:c('c2','artisan',40),c3:c('c3','bricoleur',10,{via:'microsoft'}),c4:c('c4',null,1),c5:c('c5','artisan',26,{abo:{offre:'artisan_pro'}})},
 sessions:{a:{id:'c1',exp:T+J,vu:T-J},b:{id:'c3',exp:T+J,vu:T-20*J},c:{id:'c2',exp:T-J,vu:T-J}},essais:{}}));
fs.writeFileSync(path.join(dir,'data.json'),JSON.stringify({users:{},signs:{x:{status:'sent',sentAt:T-J},y:{status:'signed',sentAt:T-30*J}},subs:[{user:'u',sub:{endpoint:'https://p/1'}}]}));
const {createServer}=require('../serveur/server.js');process.env.CASO_CLE_IA='cle-test';
const s=createServer({dataDir:dir,noTimers:true,appFile:path.join(__dirname,'..','index.html')}),srv=s.server||s;
await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port;
const get=(u,h)=>new Promise((ok,ko)=>http.get({host:'127.0.0.1',port,path:u,headers:h||{}},r=>{let d='';r.on('data',x=>d+=x);r.on('end',()=>ok([r.statusCode,d]))}).on('error',ko));
await t('sans la clé : introuvable',async()=>{assert.strictEqual((await get('/api/veille/saas'))[0],404)});
await t('avec la clé : les nombres, et aucun nom, aucune adresse, aucune clé de compte',async()=>{
 const [code,brut]=await get('/api/veille/saas',{'x-caso-cle':'cle-test'}),r=JSON.parse(brut),k=r.comptes;assert.strictEqual(code,200);
 assert.deepStrictEqual([k.total,k.artisan,k.bricoleur,k.sansChoix,k.google,k.microsoft],[5,3,1,1,4,1]);
 assert.deepStrictEqual([k.nouveaux7,k.nouveaux30,k.actifs7,k.actifs30,k.essaisFin7],[2,4,1,2,0]);
 assert.deepStrictEqual(k.offres,{artisan_curieux:1,artisan_fin_essai:1,bricoleur:1,sans_choix:1,artisan_pro:1});
 assert.strictEqual(k.parJour.length,14);assert.strictEqual(k.parJour.reduce((a,x)=>a+x.n,0),3);
 assert.deepStrictEqual(r.signatures,{envoyees7:1,signees:1,enAttente:1});assert.strictEqual(r.notifications,1);assert.strictEqual(typeof r.serveur.memoireMo,'number');
 assert.ok(!/secret\.example|Prénom-|cle-c|cle-test|endpoint/.test(brut))});
await t('page : le logo casô et les deux modes',async()=>{const h=(await get('/veille'))[1];assert.ok(/src="\/icon-192\.png" alt="casô"/.test(h)&&/data-m="saas"/.test(h));
 assert.strictEqual((await get('/icon-192.png'))[0],200)});
await new Promise(r=>srv.close(r));console.log(ok+' contrôles réussis');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});

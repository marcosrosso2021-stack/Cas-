/* casô client final : l'espace du client de l'artisan (vrai serveur, navigateur).
   Un lien personnel par client (/c/<jeton>) : ses devis à signer ou signés, ses factures (payé, reste), ses rendez-vous et ses rapports.
   Rien des autres clients, ni brouillons, ni notes ; le lien marche aussi dans l'espace d'une entreprise (/e/<espace>/c/…),
   comme les pages de signature et de facture.
   Lancer : node tests/client-final.test.js   (demande playwright ; démarre son propre serveur casô) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const {createServer}=require('../serveur/server.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const PNG='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-cli-'));
const S=createServer({dataDir:dir,noTimers:true,pushSend:async()=>({status:201})});
function req(p,body,tok){return new Promise((res,ko)=>{const b=body?JSON.stringify(body):null;
 const r=http.request({host:'127.0.0.1',port:S.server.address().port,method:b?'POST':'GET',path:p,headers:Object.assign(b?{'content-type':'application/json'}:{},tok?{authorization:'Bearer '+tok}:{})},
  x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j={};try{j=JSON.parse(d)}catch(e){}res({s:x.statusCode,j,t:d})})});
 r.on('error',ko);if(b)r.write(b);r.end()})}
const jour=n=>{const d=new Date(Date.now()+n*864e5);return d.toISOString().slice(0,10)};
async function remplir(pre,tok){const t=Date.now()-1000;
 await req(pre+'/api/sync',{since:0,changes:{
  prof:[{id:'prof',v:{nom:'Rosso Rénovation',tel:'06 11 22 33 44',email:'contact@rosso.fr',adr:'1 rue du Port, Marseille'},updatedAt:t}],
  clients:[{id:'cM',nom:'Martin',adr:'3 rue Victor Hugo, Lyon',note:'code portail 4521',updatedAt:t},{id:'cD',nom:'Dupont',updatedAt:t}],
  quotes:[{id:'q1',client:'M. Martin',num:'D2026-001',date:jour(-3),status:'envoye',lines:[{label:'Carrelage',qty:10,pu:40,tva:10}],updatedAt:t},
   {id:'q2',client:'Martin',num:'',date:jour(0),status:'brouillon',lines:[{label:'Brouillon secret',qty:1,pu:999,tva:20}],updatedAt:t},
   {id:'q3',client:'Dupont',num:'D2026-002',date:jour(0),status:'envoye',lines:[{label:'Peinture',qty:1,pu:300,tva:20}],updatedAt:t}],
  invoices:[{id:'f1',num:'F2026-0001',cid:'cM',client:{nom:'Martin'},date:jour(-2),due:jour(28),lines:[{label:'Carrelage',qty:10,pu:40,tva:10}],
   pays:[{id:'p1',d:jour(-1),amt:200,mode:'vir'},{id:'p2',d:jour(-1),amt:50,mode:'chq'},{id:'p3',d:jour(0),amt:-50,mode:'chq',cancels:'p2'}],updatedAt:t},
   {id:'f2',num:'F2026-0002',cid:'cD',client:{nom:'Dupont'},date:jour(-1),lines:[{label:'Peinture',qty:1,pu:300,tva:20}],updatedAt:t}],
  events:[{id:'e1',t:'rdv',d:jour(2),a:'08:00',b:'12:00',title:'Pose des plinthes',cid:'cM',updatedAt:t},{id:'e2',t:'rdv',d:jour(-5),a:'09:00',b:'17:00',title:'Pose carrelage',cid:'cM',updatedAt:t},
   {id:'e3',t:'rdv',d:jour(1),a:'10:00',b:'11:00',title:'Chez Dupont',cid:'cD',updatedAt:t}],
  rapports:[{id:'r1',cid:'cM',client:'Martin',date:jour(-5),texte:'…',r:{fait:['Posé le carrelage'],obs:['Humidité derrière'],sit:[],suite:['Revenir pour les joints']},updatedAt:t}]}},tok);
 const doc=q=>({quote:q,prof:{nom:'Rosso Rénovation',valid:30}});
 const s1=await req(pre+'/api/sign/new',{doc:doc({id:'q1',client:'M. Martin',num:'D2026-001',date:jour(-3),lines:[{label:'Carrelage',qty:10,pu:40,tva:10}]}),img:PNG,name:'Marcos'},tok);
 await req(pre+'/api/sign/new',{doc:doc({id:'q3',client:'Dupont',num:'D2026-002',date:jour(0),lines:[{label:'Peinture',qty:1,pu:300,tva:20}]}),img:PNG,name:'Marcos'},tok);
 return s1.j}
(async()=>{
 await new Promise(r=>S.server.listen(0,'127.0.0.1',r));const B='http://127.0.0.1:'+S.server.address().port;
 const patron=(await req('/api/setup',{user:'Marcos',password:'motdepasse1'})).j.token;
 const s1=await remplir('',patron);
 /* 1. le lien du client */
 const l0=await req('/api/client/lien',{cid:'cX'},patron);
 ok('client pas encore synchronisé : refusé proprement',l0.s===404);
 const l1=(await req('/api/client/lien',{cid:'cM'},patron)).j,l2=(await req('/api/client/lien',{cid:'cM'},patron)).j;
 ok('un lien par client, toujours le même',/\/c\/[a-f0-9]{32}$/.test(l1.url)&&l1.url===l2.url,l1.url);
 const inv=await req('/api/invite',{user:'Karim',role:'ouvrier'},patron),karim=(await req('/api/join',{code:inv.j.code})).j.token;
 ok('un ouvrier ne crée pas de lien client',(await req('/api/client/lien',{cid:'cM'},karim)).s===403);
 /* 2. ce que voit le client */
 const v=(await req('/api/c/'+l1.token)).j;
 ok('entreprise et client',v.client==='Martin'&&v.entreprise.nom==='Rosso Rénovation'&&v.entreprise.tel==='06 11 22 33 44',JSON.stringify(v.entreprise));
 ok('ses devis envoyés, avec le lien de signature (même écrit « M. Martin »)',v.devis.length===1&&v.devis[0].num==='D2026-001'&&v.devis[0].etat==='attente'&&v.devis[0].ttc===440&&v.devis[0].url===s1.url,JSON.stringify(v.devis));
 const tout=JSON.stringify(v);
 ok('rien des brouillons, des notes ni des autres clients',!/Brouillon secret|4521|Dupont|D2026-002|F2026-0002|Chez Dupont/.test(tout));
 ok('facture : total, payé (paiement annulé déduit), reste',v.factures.length===1&&v.factures[0].total===440&&v.factures[0].paye===200&&v.factures[0].reste===240,JSON.stringify(v.factures));
 ok('rendez-vous à venir et derniers passages',v.rdv.avenir.length===1&&v.rdv.avenir[0].titre==='Pose des plinthes'&&v.rdv.passes.length===1,JSON.stringify(v.rdv));
 ok('rapport d\'intervention',v.rapports.length===1&&v.rapports[0].fait[0]==='Posé le carrelage'&&v.rapports[0].suite[0]==='Revenir pour les joints');
 ok('jeton inconnu : 404',(await req('/api/c/'+'0'.repeat(32))).s===404);
 /* 3. le client signe depuis son espace : l'espace le dit */
 await req('/api/s/'+s1.token+'/sign',{name:'Jean Martin',agree:true,img:PNG});
 const v2=(await req('/api/c/'+l1.token)).j;
 ok('devis signé : « Signé »',v2.devis[0].etat==='signe'&&!!v2.devis[0].signeLe);
 /* 4. nouveau lien : l'ancien ne marche plus */
 const l3=(await req('/api/client/lien',{cid:'cM',nouveau:true},patron)).j;
 ok('« Nouveau lien » coupe l\'ancien',l3.token!==l1.token&&(await req('/api/c/'+l1.token)).s===404&&(await req('/api/c/'+l3.token)).s===200);
 /* 5. la page, sur un téléphone */
 const br=await chromium.launch(),errs=[];
 const page=async url=>{const c=await br.newContext({viewport:{width:390,height:844},locale:'fr-FR'}),p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(url);return p};
 let p=await page(l3.url.replace(/^https?:\/\/[^/]+/,B));await p.waitForSelector('#devis',{timeout:10000}).catch(()=>{});
 let t=await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' '));
 ok('page : bonjour, devis signé, facture avec reste, chantier, rapport, contact',/Bonjour Martin/.test(t)&&/Signé/.test(t)&&/Reste 240,00 €/.test(t)&&/Pose des plinthes/.test(t)&&/Posé le carrelage/.test(t)&&/Appeler/.test(t),t.slice(0,400));
 ok('page : rien sur les autres clients',!/Dupont/.test(t));
 /* 6. dans l'espace d'une entreprise : /e/<espace>/c/…, et la page de signature de cet espace marche (avant : elle appelait l'espace racine) */
 const id='abcdef123456',x=S.espaceDe(id,true),pj=await x.patronJeton('Julie'),tj=pj.token||pj;
 const sE=await remplir('/e/'+id,tj);
 const lE=(await req('/e/'+id+'/api/client/lien',{cid:'cM'},tj)).j;
 ok('espace d\'entreprise : lien /e/<espace>/c/…',new RegExp('/e/'+id+'/c/[a-f0-9]{32}$').test(lE.url||''),JSON.stringify(lE));
 ok('le lien d\'un espace n\'ouvre rien à la racine',(await req('/api/c/'+lE.token)).s===404);
 p=await page(lE.url.replace(/^https?:\/\/[^/]+/,B));await p.waitForSelector('#devis',{timeout:10000}).catch(()=>{});
 t=await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' '));
 ok('page client dans l\'espace : ses devis',/Bonjour Martin/.test(t)&&/Lire et signer/.test(t),t.slice(0,300));
 await p.click('a.btn');await p.waitForLoadState();await p.waitForTimeout(1500);
 t=await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' '));
 ok('« Lire et signer » ouvre le devis de cet espace',p.url()===sE.url.replace(/^https?:\/\/[^/]+/,B)&&/D2026-001/.test(t)&&!/n'existe pas/.test(t),t.slice(0,300));
 ok('aucune erreur JavaScript',!errs.length,errs.join(' | '));
 await br.close();await new Promise(r=>S.server.close(r));fs.rmSync(dir,{recursive:true,force:true});
 console.log(R.join('\n'));const ko=R.filter(x=>x.startsWith('FAIL')).length;console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');process.exit(ko?1:0)
})().catch(e=>{console.log(R.join('\n'));console.error(e);process.exit(1)});

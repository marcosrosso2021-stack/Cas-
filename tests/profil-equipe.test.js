/* Tests du profil d'entreprise dans l'appli (audit du 17 nov. 2026, points 4 et 5) : logo reçu de l'équipe, IBAN réservé au patron.
   Lancer depuis la racine du dépôt : python3 -m http.server 8765 &   puis   node tests/profil-equipe.test.js */
const {chromium}=require('playwright');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
(async()=>{const br=await chromium.launch();const p=await (await br.newContext()).newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
 await p.goto('http://localhost:8765/');await p.waitForFunction(()=>typeof db!=='undefined'&&typeof applyRemote==='function',null,{timeout:30000});
 const LOGO='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
 let r=await p.evaluate(()=>{window.__x=0;applyRemote(db,{changes:{prof:[{id:'prof',v:{nom:'Ent <b>',logo:'x" onerror="window.__x=1',__proto__:{pollue:1}},updatedAt:Date.now()+1000}]}});entExtra();
  return new Promise(res=>setTimeout(()=>res({logo:db.prof.logo,nom:db.prof.nom,x:window.__x,img:document.getElementById('eLogoV').innerHTML,pol:({}).pollue}),300))});
 ok('logo piégé reçu de l’équipe : retiré, rien ne s’exécute',r.logo===undefined&&r.x===0&&r.img===''&&r.pol===undefined,JSON.stringify(r));
 ok('les autres champs du profil sont gardés',r.nom==='Ent <b>');
 r=await p.evaluate(L=>{applyRemote(db,{changes:{prof:[{id:'prof',v:{nom:'Ent',logo:L,cvModel:{v:1,blocks:[{t:'head'}]}},updatedAt:Date.now()+2000}]}});entExtra();
  return{logo:db.prof.logo===L,img:/<img src="data:image\/png/.test(document.getElementById('eLogoV').innerHTML),cv:db.prof.cvModel&&db.prof.cvModel.blocks.length}},LOGO);
 ok('vrai logo (image) gardé et affiché, modèle de devis gardé',r.logo&&r.img&&r.cv===1,JSON.stringify(r));
 r=await p.evaluate(()=>{const a=profClean({logo:'data:image/svg+xml;base64,PHN2Zy8+',n:3,b:true,f(){}}),b=profClean('texte'),c=profClean([1]);return{a,b,c}});
 ok('profClean : SVG refusé, valeurs simples gardées, entrée invalide → profil vide',!('logo' in r.a)&&r.a.n===3&&r.a.b===true&&!('f' in r.a)&&Object.keys(r.b).length===0&&Object.keys(r.c).length===0,JSON.stringify(r));
 // chef d'équipe : IBAN, BIC, SIRET verrouillés
 r=await p.evaluate(async()=>{setSync({url:'https://srv.example',token:'T',user:'Karim',role:'chef'});
  db.prof=Object.assign({},db.prof,{iban:'FR7630006000011234567890189',bic:'AGRIFRPP',siret:'12345678900012',siren:'123456789'});init();
  const e=document.getElementById('eIban');e.dataset.open='1';e.value='FR7611111111111111111111111';document.getElementById('eBic').value='VOLEURXX';document.getElementById('eSiret').value='99999999900099';document.getElementById('eTel').value='0611111111';
  saveProf();const a={iban:db.prof.iban,bic:db.prof.bic,siret:db.prof.siret,siren:db.prof.siren,tel:db.prof.tel};
  await ibanSet('FR7622222222222222222222222');e.dataset.open='';await ibanOpen(e);
  return Object.assign(a,{iban2:db.prof.iban,ouvert:e.dataset.open,modal:!!document.querySelector('.pwask'),verrou:profVerrou()})});
 ok('chef : IBAN, BIC et SIRET non modifiables, le reste oui',r.verrou&&r.iban==='FR7630006000011234567890189'&&r.bic==='AGRIFRPP'&&r.siret==='12345678900012'&&r.siren==='123456789'&&r.tel==='0611111111',JSON.stringify(r));
 ok('chef : IBAN ni ouvert ni changé par le chat',r.iban2==='FR7630006000011234567890189'&&r.ouvert!=='1'&&!r.modal);
 r=await p.evaluate(()=>{setSync({url:'https://srv.example',token:'T',user:'Marcos',role:'patron'});
  const e=document.getElementById('eIban');e.dataset.open='1';e.value='FR7633333333333333333333333';saveProf();return{iban:db.prof.iban,verrou:profVerrou()}});
 ok('patron : IBAN modifiable',!r.verrou&&r.iban==='FR7633333333333333333333333',JSON.stringify(r));
 r=await p.evaluate(()=>{setSync({});return profVerrou()});
 ok('sans équipe : pas de verrou',r===false);
 ok('aucune erreur JavaScript',errs.length===0,errs.slice(0,3).join(' | '));
 console.log(R.join('\n'));await br.close();if(R.some(l=>l.startsWith('FAIL')))process.exit(1);
})().catch(e=>{console.log(R.join('\n'));console.log('EXC',e);process.exit(1)});

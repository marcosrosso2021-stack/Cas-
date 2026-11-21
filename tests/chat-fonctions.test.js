/* Le chat comprend et exécute les fonctions de casô (navigateur, appli servie depuis le dépôt).
   Prix en ligne, espace client, GPS, pointage chez un client, abonnement, paramètres, champs de « Mon entreprise »,
   équipe (inviter, heures), et l'adresse dictée dont la ville arrive mal écrite (vérifiée auprès de la Base Adresse Nationale,
   simulée ici).
   Lancer : node tests/chat-fonctions.test.js   (demande playwright ; démarre son propre petit serveur) */
'use strict';
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const ROOT=path.join(__dirname,'..'),R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.png':'image/png','.webmanifest':'application/manifest+json','.wasm':'application/wasm'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);
 if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end()}
 r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
const DONNEES=()=>{db.clients.push({id:'c1',nom:'Martin',tel:'0611111111',adr:'3 rue Victor Hugo, Lyon'},{id:'c2',nom:'Dupont',tel:'0622222222',adr:'12 rue des Lilas, Marseille'});
 db.people=db.people||[];db.people.push({id:'pk',nom:'Karim',role:'ouvrier'});db.chantiers=db.chantiers||[];db.pts=db.pts||[];save()};
(async()=>{
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));const B='http://127.0.0.1:'+srv.address().port+'/index.html';
 const br=await chromium.launch(),errs=[];
 async function page(){const c=await br.newContext({serviceWorkers:'block'}),p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{localStorage.setItem('caso_account',JSON.stringify({prenom:'Paul',email:'t@e.fr',mode:'artisan',lang:'fr'}));localStorage.setItem('caso_lang','fr');window.ADR_VERIF=1});
  /* la Base Adresse Nationale, simulée : « ex en provence » est rendu « Aix-en-Provence » */
  await p.route('https://data.geopf.fr/**',rt=>{const q=new URL(rt.request().url()).searchParams.get('q')||'';
   const f=/solari/i.test(q)?[{properties:{label:'42 Avenue Philippe Solari 13090 Aix-en-Provence',score:0.82,city:'Aix-en-Provence',postcode:'13090'},geometry:{coordinates:[5.43,43.53]}}]:[];
   rt.fulfill({status:200,contentType:'application/json',body:JSON.stringify({features:f})})});
  await p.goto(B);await p.waitForTimeout(1200);await p.evaluate(()=>{document.body.classList.remove('starting');tab('chat')});
  await p.waitForFunction(()=>window.casoPont&&casoPont.ready&&casoPont.question,null,{timeout:20000});await p.evaluate(DONNEES);return p}
 async function dit(p,t){const n=await p.evaluate(()=>CHAT.m.length);await p.evaluate(t=>{go('chat');chatSend(t)},t);await p.waitForTimeout(900);
  await p.waitForFunction(()=>!chatMulti.busy,null,{timeout:15000}).catch(()=>{});await p.waitForTimeout(300);
  return p.evaluate(n=>({rep:CHAT.m.slice(n).filter(m=>m.who==='bot').map(m=>String(m.html||m.text||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()).join(' / '),scr:(document.querySelector('section.on')||{}).id}),n)}
 const CAS=[
  ['Cherche le prix de vis chez Leroy Merlin',r=>r.scr==='s-fou'&&/Prix en ligne : vis/.test(r.rep)],
  ['combien coûte un sac de ciment',r=>r.scr==='s-fou'&&/sac de ciment/.test(r.rep)],
  ['trouve-moi des vis à bois 5x50',r=>r.scr==='s-fou'&&/vis a bois 5x50/.test(r.rep)],
  ['lien client de Martin',r=>r.scr==='s-clif'&&/espace client de Martin/.test(r.rep)&&!/supprimer/i.test(r.rep)],
  ['envoie l\'espace client à Dupont',r=>r.scr==='s-clif'&&/Dupont/.test(r.rep)],
  ['active le GPS',r=>r.scr==='s-pt'&&/GPS/.test(r.rep)],
  ['mon abonnement',r=>/abonnement/.test(r.rep)],
  ['mes paramètres',r=>r.scr==='s-cpt'],
  ['mon numéro de TVA est FR12345678901',r=>/FR12345678901/.test(r.rep)],
  ['mon siret est 123 456 789 00011',r=>/123 456 789 00011/.test(r.rep)],
  ['invite Karim dans mon équipe',r=>/Karim/.test(r.rep)&&/numéro ou son e-mail/.test(r.rep)],
  ['combien d\'heures a fait Karim ce mois',r=>/Karim · ce mois-ci : 0 h 00/.test(r.rep)],
  ['j\'ai fini',r=>/pas pointé/.test(r.rep)],
  ['pointe-moi chez Martin',r=>/Entrée pointée à \d\d:\d\d · Martin/.test(r.rep)]];
 const p=await page();
 for(const [t,f] of CAS){const r=await dit(p,t);ok('« '+t+' »',f(r),'['+r.scr+'] '+r.rep.slice(0,140));
  if(r.scr!=='s-chat')await p.evaluate(()=>{try{drawerClose(true)}catch(e){}go('chat')})}
 ok('pointé chez Martin : son chantier avec l\'adresse, la personne « moi »',await p.evaluate(()=>{const c=db.chantiers.find(x=>/Martin/.test(x.nom));return !!c&&c.adr==='3 rue Victor Hugo, Lyon'&&db.pts.some(e=>e.c===c.id&&e.p==='moi'&&e.t==='in')}));
 /* adresse dictée, ville mal écrite : la commune et le code postal officiels sont repris, l'écrit d'origine gardé */
 const p2=await page();
 await dit(p2,'nouveau client Menina 42 avenue philippe solari ex en provence');await p2.waitForTimeout(3500);
 const v=await p2.evaluate(()=>{const c=db.clients.find(x=>x.nom==='Menina');return c&&{adr:c.adr,saisie:c.adrSaisie,ok:c.adrOk}});
 ok('adresse dictée : « ex en provence » devient « 13090 Aix-en-Provence »',v&&v.adr==='42 Avenue Philippe Solari 13090 Aix-en-Provence'&&/ex en provence/i.test(v.saisie||'')&&v.ok===1,JSON.stringify(v));
 const v2=await p2.evaluate(()=>db.clients.find(x=>x.nom==='Martin').adr);
 ok('les adresses non touchées ne changent pas',v2==='3 rue Victor Hugo, Lyon',v2);
 ok('aucune erreur JavaScript',!errs.length,errs.join(' | '));
 await br.close();srv.close();
 console.log(R.join('\n'));const ko=R.filter(x=>x.startsWith('FAIL')).length;console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');process.exit(ko?1:0)
})().catch(e=>{console.log(R.join('\n'));console.error(e);process.exit(1)});

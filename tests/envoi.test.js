/* Envoi (navigateur, vrai serveur casô, faux Mailjet) : carte du devis prête, envoi par e-mail en un appui ou par le chat,
   e-mail professionnel rédigé tout seul ; invitation d'équipe avec « Copier le message » et « Partager » ; écran « Rejoindre l'équipe » ;
   côté client : demande de modification ; serveur sans clés Mailjet : rien ne part, l'appli propose le partage.
   Lancer : node tests/envoi.test.js   (demande playwright ; démarre son propre serveur casô) */
'use strict';
const os=require('os'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const {createServer}=require('../serveur/server.js');
const mailLib=require('../serveur/mail.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-env-'));
const PNG='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
(async()=>{
 /* le module Mailjet lui-même, avec un faux service */
 {const vus=[];const m=mailLib.creer({env:{MJ_APIKEY_PUBLIC:'pub',MJ_APIKEY_PRIVATE:'priv',MAIL_FROM:'devis@caso.fr'},fetch:async(u,o)=>{vus.push({u,o});return{ok:true,json:async()=>({Messages:[{Status:'success',To:[{MessageUUID:'u-1'}]}]})}}});
  const r=await m.envoyer({to:'Client@Exemple.fr',toName:'Martin',fromName:'Rosso Rénovation',replyTo:'contact@rosso.fr',subject:'Devis\nX',text:'Bonjour',html:'<p>x</p>'});
  const b=JSON.parse(vus[0].o.body).Messages[0];
  ok('Mailjet : API v3.1, authentification, expéditeur au nom de l\'entreprise, réponses vers l\'artisan',vus[0].u==='https://api.mailjet.com/v3.1/send'&&vus[0].o.headers.authorization==='Basic '+Buffer.from('pub:priv').toString('base64')&&b.From.Email==='devis@caso.fr'&&b.From.Name==='Rosso Rénovation'&&b.ReplyTo.Email==='contact@rosso.fr'&&b.To[0].Email==='client@exemple.fr'&&r.id==='u-1');
  ok('Mailjet : pas de retour à la ligne dans l\'objet (en-tête)',!/\n/.test(b.Subject));
  const off=mailLib.creer({env:{}});let e=null;try{await off.envoyer({to:'a@b.fr'})}catch(x){e=x}
  ok('Mailjet sans clés : rien ne part (503)',!off.pret()&&e&&e.code===503&&e.off);
  ok('e-mail HTML : texte échappé, bouton vers le lien',/&lt;script&gt;/.test(mailLib.html({text:'<script>',lien:'https://x/s/1',bouton:'Voir'}))&&/href="https:\/\/x\/s\/1"/.test(mailLib.html({text:'a',lien:'https://x/s/1'})))}

 const envois=[];
 const S=createServer({dataDir:dir,noTimers:true,pushSend:async()=>({status:201}),mail:{pret:()=>true,html:mailLib.html,envoyer:async m=>{envois.push(m);return{id:'m'+envois.length}}}});
 await new Promise(r=>S.server.listen(0,'127.0.0.1',r));const B='http://127.0.0.1:'+S.server.address().port;
 const br=await chromium.launch(),c=await br.newContext({viewport:{width:390,height:844},locale:'fr-FR'}),p=await c.newPage(),errs=[];
 p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('caso_test','1')});
 await p.goto(B+'/');await p.waitForFunction(()=>typeof envChat==='function'&&!document.body.classList.contains('starting'),null,{timeout:30000});
 await p.evaluate(async b=>{const r=await fetch(b+'/api/setup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user:'Marcos',password:'motdepasse1'})});const j=await r.json();
  setSync({url:b,token:j.token,user:j.name,role:j.role,rev:0,lastPush:0});
  db.prof=Object.assign({},db.prof||{},{nom:'Rosso Rénovation',tel:'06 11 22 33 44',email:'contact@rosso.fr',valid:30});db.profAt=Date.now();db.me={prenom:'Marcos'};
  db.clients.push({id:'c1',nom:'Thomas Martin',email:'thomas@exemple.fr'},{id:'c2',nom:'Dupont'});
  try{localStorage.setItem('caso_sig',arguments[1])}catch(e){}save()},B);
 /* 1. l'artisan valide le devis : la carte prête apparaît */
 await p.evaluate(png=>{newQuote();Object.assign(q,{client:'Thomas Martin',acompte:30,lines:[{label:'Faïence murale',qty:18,unit:'m²',pu:85,tva:10},{label:'Receveur et paroi',qty:1,unit:'u',pu:1430,tva:10}]});fillForm();goSign();SIG_USE=png},PNG);
 await p.evaluate(()=>signSend());await p.waitForFunction(()=>!$('sentBox').hidden,null,{timeout:10000});
 await p.waitForFunction(()=>!!document.querySelector('#sentEnv .env-ml'),null,{timeout:8000}).catch(()=>{});
 const carte=await p.evaluate(()=>document.querySelector('#sentEnv').innerText.replace(/\s+/g,' '));
 ok('carte prête : devis n°, client, travaux, total TTC, lien',/Devis n°/.test(carte)&&/Thomas Martin/.test(carte)&&/Faïence murale/.test(carte)&&/Total TTC/.test(carte)&&/\/s\/[a-f0-9]{32}/.test(carte)&&/Prêt/.test(carte),carte);
 ok('trois actions : Envoyer par e-mail (adresse du client connue), Copier le message, Partager',/Envoyer par e-mail/.test(carte)&&/thomas@exemple\.fr/.test(carte)&&/Copier le message/.test(carte)&&/Partager/.test(carte));
 const tx=await p.evaluate(()=>{const o=db.quotes.find(x=>x.client==='Thomas Martin');return dvMail(o)});
 ok('e-mail pro rédigé tout seul : formule, travaux, total, acompte, validité, signature',/^Bonjour Thomas Martin,/.test(tx.texte)&&/faïence murale/i.test(tx.texte)&&/TTC/.test(tx.texte)&&/acompte de 30 %/.test(tx.texte)&&/valable jusqu’au/.test(tx.texte)&&/Bien cordialement,\nMarcos\nRosso Rénovation/.test(tx.texte)&&/Votre devis/.test(tx.sujet),tx.texte);
 if(process.env.SHOTS)await p.screenshot({path:process.env.SHOTS+'/env-devis.png'});
 await p.click('#sentEnv .env-ml');await p.waitForFunction(()=>/Envoyé/.test(document.querySelector('#sentEnv').innerText),null,{timeout:8000}).catch(()=>{});
 ok('un appui : e-mail parti au client, au nom de l\'entreprise, réponses vers l\'artisan, lien dans le bouton',envois.length===1&&envois[0].to==='thomas@exemple.fr'&&envois[0].fromName==='Rosso Rénovation'&&envois[0].replyTo==='contact@rosso.fr'&&/\/s\/[a-f0-9]{32}/.test(envois[0].html)&&/Voir et signer le devis/.test(envois[0].html),JSON.stringify(envois[0]&&{to:envois[0].to,from:envois[0].fromName}));
 ok('carte : « Envoyé », bouton « Renvoyer par e-mail »',await p.evaluate(()=>/Envoyé/.test($('sentEnv').innerText)&&/Renvoyer par e-mail/.test($('sentEnv').innerText)));
 /* 2. par le chat */
 const dit=async t=>{await p.evaluate(t=>{go('chat');$('chatIn').value=t;chatSend(t)},t);await p.waitForTimeout(900);return p.evaluate(()=>{const m=CHAT.m[CHAT.m.length-1];if(!m||!m.html)return'';const d=document.createElement('div');d.innerHTML=m.html.replace(/</g,' <');return d.textContent.replace(/\s+/g,' ').trim()})};
 let r=await dit('renvoie le devis à Thomas Martin');
 ok('chat : « renvoie le devis à Thomas Martin » → parti',envois.length===2&&/Devis envoyé à thomas@exemple\.fr/.test(r)&&/^Bonjour Thomas Martin,\n\nJe reviens vers vous/.test(envois[1].text),r);
 await p.evaluate(png=>{newQuote();Object.assign(q,{client:'Dupont',lines:[{label:'Peinture',qty:20,unit:'m²',pu:25,tva:10}]});fillForm();goSign();SIG_USE=png},PNG);await p.evaluate(()=>signSend());await p.waitForTimeout(800);
 r=await dit('envoie le devis à Dupont');
 ok('chat : client sans e-mail → le chat le demande',/L'e-mail de Dupont/.test(r),r);
 r=await dit('dupont@exemple.fr');
 ok('chat : l\'adresse donnée → parti, gardée dans la fiche du client',envois.length===3&&envois[2].to==='dupont@exemple.fr'&&await p.evaluate(()=>db.clients.find(c=>c.nom==='Dupont').email==='dupont@exemple.fr'),r);
 await p.evaluate(()=>{newQuote();Object.assign(q,{client:'Petit',lines:[{label:'Placo',qty:5,unit:'m²',pu:30,tva:10}]});fillForm()});
 r=await dit('envoie le devis');ok('chat : devis pas encore signé par l\'artisan → « Valider le devis »',/Valider le devis/.test(r),r);
 /* 3. côté client : demande de modification */
 const url=await p.evaluate(()=>db.quotes.find(x=>x.client==='Thomas Martin').sign.url);const tok=url.match(/[a-f0-9]{32}/)[0];
 const mo=await p.evaluate(async([b,t])=>{const r=await fetch(b+'/api/s/'+t+'/modif',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({msg:'Pouvez-vous ajouter la peinture du plafond ?'})});return [r.status,(await r.json()).modif]},[B,tok]);
 ok('client : demande de modification enregistrée, le lien reste ouvert',mo[0]===200&&!!mo[1]);
 await p.evaluate(()=>syncNow());await p.waitForTimeout(800);
 ok('l\'artisan reçoit la demande (synchronisation du devis)',await p.evaluate(()=>{const o=db.quotes.find(x=>x.client==='Thomas Martin');return !!(o.sign&&o.sign.modif&&/plafond/.test(o.sign.modif.msg))}));
 /* 4. invitation d'équipe : carte, Copier le message, Partager */
 await p.evaluate(()=>{db.people.push({id:'pk',nom:'Karim',role:'ouvrier'});save();cptPage('team');eqOpen('pk')});
 await p.evaluate(()=>eqInviter('pk'));await p.waitForTimeout(500);
 const inv=await p.evaluate(()=>{const e=document.querySelector('#eqSh .env');return e?e.innerText.replace(/\s+/g,' '):''});
 ok('fiche : carte d\'invitation, lien pour rejoindre, Copier le message, Partager',/Invitation · Karim/.test(inv)&&/\?join=[a-f0-9]{16}/.test(inv)&&/Copier le message/.test(inv)&&/Partager/.test(inv),inv);
 if(process.env.SHOTS)await p.screenshot({path:process.env.SHOTS+'/env-inv.png'});
 await p.evaluate(()=>{window.__share=null;navigator.share=d=>{window.__share=d;return Promise.resolve()}});await p.click('#eqSh .env-sh');
 ok('Partager : la feuille de partage du téléphone reçoit le message avec le lien',await p.evaluate(()=>!!window.__share&&/Karim/.test(window.__share.text)&&/\?join=/.test(window.__share.text)));
 /* 5. l'invité ouvre le lien : un bouton « Rejoindre l'équipe » */
 const lien=await p.evaluate(()=>EQ.last.url);const p2=await (await br.newContext({viewport:{width:390,height:844},locale:'fr-FR'})).newPage();
 await p2.addInitScript(()=>{localStorage.setItem('caso_test','1')});await p2.goto(lien.replace(/^https?:\/\/[^/]+/,B));
 await p2.waitForSelector('#joinScr .join-go',{timeout:15000}).catch(()=>{});
 const je=await p2.evaluate(()=>{const s=document.getElementById('joinScr');return s?s.innerText.replace(/\s+/g,' '):''});
 ok('écran de l\'invité : l\'entreprise et un seul bouton « Rejoindre l\'équipe »',/Rosso Rénovation/.test(je)&&/Karim, rejoins l'équipe/.test(je)&&await p2.evaluate(()=>document.querySelectorAll('#joinScr button').length===1),je);
 if(process.env.SHOTS)await p2.screenshot({path:process.env.SHOTS+'/env-join.png'});
 await p2.click('#joinScr .join-go');await p2.waitForFunction(()=>!!getSync().token,null,{timeout:8000}).catch(()=>{});
 ok('un appui : Karim est dans l\'équipe',await p2.evaluate(()=>getSync().user==='karim'||getSync().user==='Karim'));
 /* 6. serveur sans clés Mailjet : rien ne part */
 const S2=createServer({dataDir:path.join(dir,'b'),noTimers:true,pushSend:async()=>({status:201}),mail:mailLib.creer({env:{}})});await new Promise(r=>S2.server.listen(0,'127.0.0.1',r));
 const B2='http://127.0.0.1:'+S2.server.address().port;
 const t2=(await (await fetch(B2+'/api/setup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user:'Marcos',password:'motdepasse1'})})).json()).token;
 const e2=await (await fetch(B2+'/api/sign/mail',{headers:{authorization:'Bearer '+t2}})).json();
 ok('serveur sans clés Mailjet : l\'appli le sait (et propose le partage)',e2.pret===false);
 ok('aucune erreur JavaScript',!errs.length,errs.join(' | '));
 await br.close();await new Promise(r=>S.server.close(r));await new Promise(r=>S2.server.close(r));fs.rmSync(dir,{recursive:true,force:true});
 console.log(R.join('\n'));const ko=R.filter(x=>x.startsWith('FAIL')).length;console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');process.exit(ko?1:0)
})().catch(e=>{console.log(R.join('\n'));console.error(e);process.exit(1)});

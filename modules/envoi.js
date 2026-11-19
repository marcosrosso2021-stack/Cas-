/* casô · Envoi : la carte « prêt à envoyer » (invitation d'équipe, devis), « Copier le message », « Partager »
   (feuille de partage du téléphone : e-mail, WhatsApp, SMS…), l'envoi du devis par e-mail (Mailjet, par le serveur)
   avec un e-mail professionnel rédigé tout seul, l'envoi demandé au chat, et l'écran « Rejoindre l'équipe ».
   (chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */

/* ---------- carte d'envoi ---------- */
const ENV={};
/* o : {id, ico, titre, chip, lignes:[[libellé,valeur]], url, msg, sujet, mail:{to,qid}} */
function envCarte(o){ENV[o.id]=o;
 return `<div class="env" data-env="${esc(o.id)}"><div class="env-c"><div class="env-h"><svg class="i"><use href="#i-${o.ico||'doc'}"/></svg><b data-noi18n>${esc(o.titre)}</b>${o.chip?`<span class="env-chip">${esc(i18nT(o.chip))}</span>`:''}</div>
  ${(o.lignes||[]).filter(x=>x[1]).map(x=>`<div class="env-l"><span>${esc(i18nT(x[0]))} :</span> <span data-noi18n>${esc(x[1])}</span></div>`).join('')}
  ${o.url?`<a class="env-u" href="${esc(o.url)}" target="_blank" rel="noopener" data-noi18n>${esc(o.url.replace(/^https?:\/\//,''))} <svg class="i i-sm"><use href="#i-arrow"/></svg></a>`:''}</div>
  ${o.mail?`<div class="env-m" id="envM-${esc(o.id)}"></div>`:''}
  <button type="button" class="btn env-cp" onclick="envCopier('${esc(o.id)}')"><svg class="i"><use href="#i-clip"/></svg>${esc(i18nT('Copier le message'))}</button>
  <button type="button" class="btn sec env-sh" onclick="envPartager('${esc(o.id)}')"><svg class="i"><use href="#i-share"/></svg>${esc(i18nT('Partager'))}</button></div>`}
function envCopier(id){const o=ENV[id];if(!o)return;const t=o.msg;
 (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast(i18nT('Message copié.')),()=>prompt(i18nT('Copie ce message :'),t))}
/* la feuille de partage du téléphone (e-mail, WhatsApp, SMS…) ; sans elle, le message est copié */
function envPartager(id){const o=ENV[id];if(!o)return;
 if(navigator.share){navigator.share({title:o.sujet||o.titre,text:o.msg}).catch(()=>{});return}
 envCopier(id)}

/* ---------- invitation d'équipe ---------- */
function envInvitation(p,lien){const ent=((db.prof||{}).nom||'').trim(),moi=((db.me||{}).prenom||'').trim();
 const msg=i18nT('Bonjour {1}, {2} t\'invite à rejoindre son équipe sur casô : {3}').replace('{1}',p.nom.split(' ')[0]).replace('{2}',ent||moi||'casô').replace('{3}',lien);
 return{id:'inv-'+p.id,ico:'users',titre:i18nT('Invitation')+' · '+p.nom,chip:'Prêt',lignes:[['Équipe',ent||moi],['Rôle',i18nT(p.role==='chef'?'Chef':'Ouvrier')]],url:lien,msg,sujet:i18nT('Invitation casô')}}

/* ---------- devis : e-mail professionnel rédigé tout seul ----------
   À partir du devis et de « Mon entreprise » : formule selon le client, travaux résumés, total, acompte, validité, signature.
   (rédaction sur le téléphone, sans service d'IA en ligne ; l'artisan peut relire et changer le texte avant l'envoi) */
function dvTravaux(o){const L=(o.lines||[]).filter(l=>l.label&&String(l.unit||'')!=='h').map(l=>({l:l.label,v:(+l.qty||0)*(+l.pu||0)})).sort((a,b)=>b.v-a.v);
 if(o.titre)return o.titre;if(!L.length)return'';const t=L.slice(0,2).map(x=>x.l.charAt(0).toLowerCase()+x.l.slice(1));
 return (t.join(' et ')+(L.length>2?'…':'')).replace(/^./,c=>c.toUpperCase())}
function dvCivil(nom){const n=String(nom||'').trim();if(!n)return'Madame, Monsieur,';
 const m=/^(m\.|mr|monsieur)\s+/i.test(n)?'Monsieur':/^(mme|madame|mlle|mademoiselle)\s+/i.test(n)?'Madame':'';
 const nm=n.replace(/^(m\.|mr|monsieur|mme|madame|mlle|mademoiselle)\s+/i,'').trim(),fam=nm.split(/\s+/).slice(-1)[0];
 return m?`Bonjour ${m} ${fam},`:`Bonjour ${nm},`}
function dvMail(o){const p=db.prof||{},t=totals(o),tr=dvTravaux(o),deja=!!(o.sign&&o.sign.mailedAt);
 const val=new Date(agDate(o.date||ymdL()).getTime()+(parseInt(p.valid)||30)*864e5);
 const sujet=(deja?'Rappel · ':'')+'Votre devis '+(o.num||'')+(tr?' · '+tr:'')+(p.nom?' · '+p.nom:'');
 const L=[dvCivil(o.client),'',
  deja?`Je reviens vers vous au sujet du devis ${o.num||''}${tr?' pour '+tr.charAt(0).toLowerCase()+tr.slice(1):''}, que je vous ai transmis récemment.`
      :`Suite à notre échange, je vous prie de trouver ci-dessous mon devis ${o.num||''}${tr?' pour '+tr.charAt(0).toLowerCase()+tr.slice(1):''}${o.adr?', '+o.adr:''}.`,'',
  `Montant total : ${eur(t.ttc)} TTC${o.franchise?'':' ('+eur(t.ht)+' HT)'}.`+(o.acompte?` Un acompte de ${o.acompte} % (${eur(t.acompte!=null?t.acompte:t.ttc*o.acompte/100)}) est demandé à la signature.`:''),
  `Ce devis est valable jusqu’au ${val.toLocaleDateString('fr-FR')}.`,'',
  'Vous pouvez le consulter, poser une question ou demander une modification, et le signer en ligne en quelques secondes depuis le lien ci-dessous.','',
  'Je reste à votre disposition pour tout renseignement.','','Bien cordialement,',
  [((db.me||{}).prenom||(accountGet()||{}).prenom||'').trim(),p.nom,p.tel].filter(Boolean).join('\n')];
 return{sujet,texte:L.join('\n').replace(/\n{3,}/g,'\n\n').trim()}}

/* ---------- devis : carte prête après validation, envoi par e-mail en un appui ---------- */
let ENV_MAIL=null;/* le serveur sait-il envoyer des e-mails ? */
async function envMailPret(){if(ENV_MAIL!=null)return ENV_MAIL;try{ENV_MAIL=!!(await apiTeam('/api/sign/mail')).pret}catch(e){ENV_MAIL=false}return ENV_MAIL}
function dvCliMail(o){const c=findBy(db.clients,o.client||'');return c&&c.email||''}
function envDevis(o){const t=totals(o),p=db.prof||{},m=dvMail(o);
 const msg='Bonjour'+(o.client?' '+o.client:'')+', voici votre devis n° '+o.num+(p.nom?' de '+p.nom:'')+'. Vous pouvez le lire et le signer ici : '+o.sign.url;
 return{id:'dv-'+o.id,ico:'doc',titre:i18nT('Devis')+' n°'+o.num,chip:o.sign.st==='signed'?'Signé':o.sign.mailedAt?'Envoyé':'Prêt',
  lignes:[['Client',o.client],['Travaux',dvTravaux(o)],['Total TTC',eur(t.ttc)]],url:o.sign.url,msg,sujet:m.sujet,mail:{qid:o.id}}}
/* dessine la partie e-mail de la carte : bouton « Envoyer par e-mail » (adresse à saisir si le client n'en a pas) ; aperçu modifiable */
async function envMailUI(id){const o=ENV[id],box=$('envM-'+id);if(!o||!box||!o.mail)return;
 const q0=db.quotes.find(x=>x.id===o.mail.qid);if(!q0||!q0.sign||q0.sign.st!=='sent'){box.innerHTML='';return}
 if(!(await envMailPret())){box.innerHTML='';return}
 const to=dvCliMail(q0),m=dvMail(q0);
 box.innerHTML=`${to?'':`<input type="email" inputmode="email" id="envTo-${esc(id)}" placeholder="${esc(i18nT('E-mail du client'))}" aria-label="${esc(i18nT('E-mail du client'))}" data-noi18n>`}
  <button type="button" class="btn env-ml" onclick="envMailEnvoyer('${esc(id)}')"><svg class="i"><use href="#i-mail"/></svg><span>${esc(i18nT(q0.sign.mailedAt?'Renvoyer par e-mail':'Envoyer par e-mail'))}</span>${to?` <span class="env-to" data-noi18n>${esc(to)}</span>`:''}</button>
  <details class="env-ap"><summary>${esc(i18nT('Voir l\'e-mail'))}</summary><input id="envSj-${esc(id)}" value="${esc(m.sujet)}" aria-label="${esc(i18nT('Objet'))}" data-noi18n><textarea id="envTx-${esc(id)}" rows="9" aria-label="${esc(i18nT('Message'))}" data-noi18n>${esc(m.texte)}</textarea></details>`}
async function envMailEnvoyer(id){const o=ENV[id];if(!o)return;const q0=db.quotes.find(x=>x.id===o.mail.qid);if(!q0||!q0.sign)return;
 const inp=$('envTo-'+id),to=(inp?inp.value:dvCliMail(q0)).trim().toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)){toast(i18nT('E-mail invalide.'));if(inp)inp.focus();return}
 const m=dvMail(q0),sj=$('envSj-'+id),tx=$('envTx-'+id),b=document.querySelector(`[data-env="${CSS.escape(id)}"] .env-ml`);if(b)b.disabled=true;
 try{await apiTeam('/api/sign/mail',{token:q0.sign.token,to,subject:sj?sj.value:m.sujet,text:tx?tx.value:m.texte});
  if(inp){const c=findBy(db.clients,q0.client||'');if(c&&!c.email){c.email=to;c.at=Date.now()}}
  q0.sign.mailedAt=Date.now();q0.sign.mailTo=to;storeQ(q0);save();toast(i18nT('Devis envoyé à {1}.').replace('{1}',to));
  const card=document.querySelector(`[data-env="${CSS.escape(id)}"]`);if(card){card.outerHTML=envCarte(envDevis(q0));envMailUI(id)}return true}
 catch(e){toast(String(e.message||e));if(b)b.disabled=false;return false}}

/* ---------- le chat : « envoie le devis à Martin », « envoie le devis par mail » ---------- */
const ENV_V=/(^|[^\p{L}])(envoie|envoyer|envoies|renvoie|renvoyer|transmets|send|resend|envia|enviar|manda|invia|inviare|manda|trimite|gonder|gönder|wyslij|wyślij|отправь|отправить|ارسل|أرسل)(?=[^\p{L}]|$)/u;
const ENV_D=/(devis|quote|estimate|presupuesto|orcamento|orçamento|preventivo|oferta|teklif|kosztorys|смет|عرض)/;
let ENV_ATT=null;
function envChat(t){if(typeof db==='undefined')return false;const f=String(t).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase(),mail=(String(t).match(/[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}/)||[])[0];
 /* réponse à « son e-mail ? » */
 if(ENV_ATT&&mail&&Date.now()-ENV_ATT.at<15*60e3){const o=db.quotes.find(x=>x.id===ENV_ATT.qid);ENV_ATT=null;if(o)return envChatEnvoi(t,o,mail.toLowerCase())}
 if(!ENV_V.test(f)||!ENV_D.test(f))return false;
 const kc=knownClient(t),c=kc?findBy(db.clients,kc.nom):null;
 let o=c?db.quotes.filter(x=>nameKey(x.client)===nameKey(c.nom)).sort((a,b)=>(b.sign?1:0)-(a.sign?1:0)||String(b.date||'').localeCompare(String(a.date||'')))[0]:null;
 if(!o)o=db.quotes.find(x=>x.id===q.id)||(q&&q.lines&&q.lines.length?q:null);
 if(!o)return envBulle(t,`<p>${esc(i18nT('Quel devis ? Dis-moi le nom du client.'))}</p>`);
 if(o.sign&&o.sign.st==='signed')return envBulle(t,`<p>${esc(i18nT('Ce devis est déjà signé par le client.'))}</p>`);
 if(!o.sign||o.sign.st!=='sent'){if(o.id!==q.id){q=JSON.parse(JSON.stringify(o));try{fillForm()}catch(e){}}
  return envBulle(t,`<p>${esc(i18nT('Signe-le d\'abord, puis il part tout seul.'))}</p><div class="msg-act"><button class="btn sm" onclick="goSign()"><svg class="i"><use href="#i-pen"/></svg>${esc(i18nT('Valider le devis'))}</button></div>`)}
 const to=(mail||dvCliMail(o)).toLowerCase();
 if(!to){ENV_ATT={qid:o.id,at:Date.now()};return envBulle(t,`<p>${esc(i18nT('L\'e-mail de {1} ?').replace('{1}',o.client||i18nT('ton client')))}</p>`)}
 return envChatEnvoi(t,o,to)}
function envChatEnvoi(t,o,to){const id='dv-'+o.id;
 envBulle(t,`<p class="mut">${esc(i18nT('Envoi…'))}</p>`);const m=CHAT.m[CHAT.m.length-1];
 (async()=>{let html;
  if(!(await envMailPret())){ENV[id]=envDevis(o);html=`<p>${esc(i18nT('L\'envoi par e-mail n\'est pas encore branché : partage le lien.'))}</p>`+envCarte(envDevis(o))}
  else{try{await apiTeam('/api/sign/mail',{token:o.sign.token,to,subject:dvMail(o).sujet,text:dvMail(o).texte});
    const c=findBy(db.clients,o.client||'');if(c&&!c.email){c.email=to;c.at=Date.now()}o.sign.mailedAt=Date.now();o.sign.mailTo=to;storeQ(o);save();
    html=`<p><svg class="i i-sm ok-c"><use href="#i-check"/></svg> <span>${esc(i18nT('Devis envoyé à {1}.').replace('{1}',to))}</span></p>`+envCarte(envDevis(o))}
   catch(e){html=`<p>${esc(String(e.message||e))}</p>`+envCarte(envDevis(o))}}
  m.html=html;chatSave();chatRender(true)})();return true}
function envBulle(t,html){if(CHAT.qid!==q.id)CHAT={qid:q.id,m:[]};CHAT.m.push({who:'me',text:t});CHAT.m.push({who:'bot',html});chatSave();chatRender(true);return true}

/* ---------- l'invité ouvre le lien : un écran, un bouton « Rejoindre l'équipe » ---------- */
async function joinEcran(code){
 let info=null,err='';
 try{const r=await fetch(location.origin+'/api/join/'+code);const j=await r.json().catch(()=>({}));if(r.ok)info=j;else err=j.error||'Invitation invalide ou expirée.'}
 catch(e){err='Entreprise introuvable. Vérifie ta connexion.'}
 let s=$('joinScr');if(!s){s=document.createElement('section');s.id='joinScr';s.className='join';document.body.appendChild(s)}
 s.innerHTML=`<div class="join-c"><svg class="join-lg" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#ffc21a"/><path d="M32 13 13 27v4h4v18h30V31h4v-4L32 13Z" fill="#18181a"/><rect x="25" y="34" width="14" height="9" rx="3" fill="#ffc21a"/></svg>
  ${info?`<p class="mut" data-noi18n>${esc(info.entreprise||'casô')}</p><h1 data-noi18n>${esc(i18nT('{1}, rejoins l\'équipe').replace('{1}',info.name))}</h1>
   <button type="button" class="btn join-go" onclick="joinGo('${esc(code)}',this)"><svg class="i"><use href="#i-users"/></svg>${esc(i18nT('Rejoindre l\'équipe'))}</button>`
   :`<h1>${esc(i18nT('Invitation'))}</h1><p class="mut">${esc(i18nT(err))}</p><button type="button" class="btn sec" onclick="$('joinScr').remove()">${esc(i18nT('Continuer'))}</button>`}</div>`;
 document.body.classList.add('join-on')}
async function joinGo(code,b){if(b)b.disabled=true;
 try{const r=await fetch(location.origin+'/api/join',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code})});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Invitation refusée.');
  setSync({url:location.origin,token:j.token,user:j.name,role:j.role,rev:0,lastPush:0});
  const s=$('joinScr');if(s){s.querySelector('.join-c').innerHTML=`<svg class="i join-ok"><use href="#i-check"/></svg><h1 data-noi18n>${esc(i18nT('Bienvenue {1} !').replace('{1}',j.name))}</h1>`;setTimeout(()=>{s.remove();document.body.classList.remove('join-on')},1400)}
  renderSync();go(j.role==='ouvrier'?'pt':'chat');syncNow();vaultSetup()}
 catch(e){toast(String(e.message||e));if(b)b.disabled=false}}

/* casô · Mon équipe : les collaborateurs (db.people, la même liste que le pointage et le planning),
   leurs coordonnées, l'invitation à rejoindre l'équipe, leurs heures pointées et ce qui leur est payé.
   (chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md)
   Personne : {id, nom, role:'ouvrier'|'chef', tel, email, taux (€/h), inv:{at,via,equipe}, pays:[{id,d,amt,note,doc:{n,t,u}}]} */

const EQ={cur:null,per:'month',mode:'voir'};
const EQ_PER={week:'Semaine',month:'Mois',all:'Tout'};
/* document joint : une image ou un PDF en data:, rien d'autre (jamais un lien) */
const eqDocOk=d=>!!(d&&typeof d==='object'&&typeof d.u==='string'&&d.u.length<3e6&&/^data:(image\/(png|jpe?g|webp|heic)|application\/pdf);base64,[A-Za-z0-9+/=]+$/.test(d.u));
const eqP=id=>(ensurePt(),db.people.find(p=>p.id===id));
const eqTel=v=>String(v||'').replace(/[^\d+]/g,'');
const eqMailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v||'').trim());
const eqTelOk=v=>eqTel(v).replace(/^\+/,'').length>=8;
function eqHeures(pid,per){const st=periodStart(per);return sessions().filter(s=>s.p===pid&&!s.open&&!s.warn&&(s.a||s.b)>=st).reduce((m,s)=>m+(s.b-s.a),0)}
function eqPaye(p,per){const st=periodStart(per);return faR2((p.pays||[]).filter(x=>agDate(x.d).getTime()>=st).reduce((s,x)=>s+(+x.amt||0),0))}
function eqEstime(p,per){return p.taux?faR2(eqHeures(p.id,per)/36e5*p.taux):null}
/* où en est la personne : dans l'équipe (a rejoint), invitée, ou pas encore invitée */
function eqStatut(p){const tc=typeof teamCache!=='undefined'&&Array.isArray(teamCache)?teamCache:[];
 if(tc.some(u=>u&&u.name&&nameKey(u.name)===nameKey(p.nom)&&u.joined))return'equipe';
 return p.inv?'invite':'aucun'}
const EQ_ST={equipe:'Dans l\'équipe',invite:'Invité',aucun:'À inviter'};

/* ---------- liste ---------- */
function eqRender(){const box=$('eqList');if(!box)return;ensurePt();
 const L=db.people.filter(p=>!p.moi&&!p.parti).sort((a,b)=>a.nom.localeCompare(b.nom));/* « moi » (l'artisan, pour son propre pointage) n'est pas un collaborateur */
 box.innerHTML=L.length?`<div class="eq-l">`+L.map(p=>{const st=eqStatut(p),h=eqHeures(p.id,'month');
  return `<button type="button" class="eq-r" onclick="eqOpen('${p.id}')"><span class="eq-av" aria-hidden="true">${esc((p.nom.trim()[0]||'·').toUpperCase())}</span>
   <span class="eq-t"><b data-noi18n>${esc(p.nom)}</b><span class="mut"><span>${esc(i18nT(p.role==='chef'?'Chef':'Ouvrier'))}</span>${h?` · <span data-noi18n>${esc(fmtH(h))}</span>`:''}</span></span>
   <span class="eq-s ${st}">${esc(i18nT(EQ_ST[st]))}</span></button>`}).join('')+`</div>`
  :`<p class="mut eq-vide">Dis-le au chat : « Karim est dans mon équipe ».</p>`}

/* ---------- fiche d'un collaborateur ---------- */
function eqOpen(id){EQ.cur=id;EQ.mode='voir';eqSheet();eqShow()}
function eqEdit(id){EQ.cur=id||null;EQ.mode='modif';eqSheet();eqShow();setTimeout(()=>{const i=$(id?'eqTel':'eqNom');try{i&&i.focus()}catch(e){}},250)}
function eqShow(){$('eqBg').hidden=false;$('eqSh').hidden=false;requestAnimationFrame(()=>{$('eqSh').classList.add('on');$('eqBg').classList.add('on')})}
function eqClose(){const s=$('eqSh'),b=$('eqBg');if(!s||s.hidden)return;s.classList.remove('on');b.classList.remove('on');setTimeout(()=>{s.hidden=true;b.hidden=true},200);eqRender()}
function eqSheet(){const p=EQ.cur?eqP(EQ.cur):null,S=$('eqSh');
 if(EQ.mode==='modif'||!p){const v=p||{nom:'',role:'ouvrier'};
  S.innerHTML=`<div class="sheet-grip"></div><div class="ag-sh-h"><h3>${esc(i18nT(p?'Modifier':'Nouveau collaborateur'))}</h3><button type="button" class="ag-sh-b" onclick="${p?`eqOpen('${p.id}')`:'eqClose()'}" aria-label="Fermer"><svg class="i"><use href="#i-x"/></svg></button></div>
   <input id="eqNom" placeholder="${esc(i18nT('Prénom et nom'))}" aria-label="${esc(i18nT('Prénom et nom'))}" autocapitalize="words" value="${esc(v.nom)}" data-noi18n>
   <div class="ag-cli"><input id="eqTel" type="tel" inputmode="tel" placeholder="${esc(i18nT('Téléphone'))}" aria-label="${esc(i18nT('Téléphone'))}" value="${esc(v.tel||'')}" data-noi18n><input id="eqMail" type="email" inputmode="email" placeholder="E-mail" aria-label="E-mail" value="${esc(v.email||'')}" data-noi18n></div>
   <div class="row"><div><label>${esc(i18nT('Rôle'))}</label><div class="seg eq-role" id="eqRole"><button type="button" data-p="ouvrier" onclick="segOn('eqRole','ouvrier')">${esc(i18nT('Ouvrier'))}</button><button type="button" data-p="chef" onclick="segOn('eqRole','chef')">${esc(i18nT('Chef'))}</button></div></div>
    <div class="eq-tx"><label for="eqTaux">${esc(i18nT('€ / heure'))}</label><input id="eqTaux" type="number" min="0" step="0.5" inputmode="decimal" value="${v.taux||''}"></div></div>
   <div id="eqErr" class="err" hidden role="alert"></div>
   <button class="btn" type="button" onclick="eqSave()"><svg class="i"><use href="#i-check"/></svg>${esc(i18nT(p?'Enregistrer':'Ajouter'))}</button>`;
  segOn('eqRole',v.role==='chef'?'chef':'ouvrier');return}
 const st=eqStatut(p),per=EQ.per,h=eqHeures(p.id,per),est=eqEstime(p,per),pay=eqPaye(p,per),P=(p.pays||[]).slice().sort((a,b)=>b.d.localeCompare(a.d)),st0=periodStart(per);
 const ct=[p.tel?`<a class="eq-c" href="tel:${esc(eqTel(p.tel))}"><svg class="i"><use href="#i-phone"/></svg><span data-noi18n>${esc(p.tel)}</span></a>`:'',p.email?`<a class="eq-c" href="mailto:${esc(p.email)}"><svg class="i"><use href="#i-mail"/></svg><span data-noi18n>${esc(p.email)}</span></a>`:''].join('');
 S.innerHTML=`<div class="sheet-grip"></div><div class="ag-sh-h"><span class="eq-av" aria-hidden="true">${esc((p.nom.trim()[0]||'·').toUpperCase())}</span><h3 data-noi18n>${esc(p.nom)}</h3><button type="button" class="ag-sh-b" onclick="eqEdit('${p.id}')" aria-label="${esc(i18nT('Modifier'))}"><svg class="i"><use href="#i-edit"/></svg></button><button type="button" class="ag-sh-b" onclick="eqClose()" aria-label="Fermer"><svg class="i"><use href="#i-x"/></svg></button></div>
  <div class="eq-ct">${ct||`<button type="button" class="lnk" onclick="eqEdit('${p.id}')">${esc(i18nT('Ajouter un numéro ou un e-mail'))}</button>`}</div>
  <div class="eq-inv"><span class="eq-s ${st}">${esc(i18nT(EQ_ST[st]))}${p.inv&&st==='invite'?` · <span data-noi18n>${esc(agFmtD(ymdL(new Date(p.inv.at)),{weekday:undefined,month:'short'}))}</span>`:''}</span>
   ${st!=='equipe'?`<button type="button" class="btn sm${p.inv?' sec':''}" onclick="eqInviter('${p.id}')"><svg class="i"><use href="#i-send"/></svg>${esc(i18nT(p.inv?'Renvoyer':'Inviter'))}</button>`:''}</div>
  ${EQ.carte&&EQ.carte.id==='inv-'+p.id&&st!=='equipe'?envCarte(EQ.carte):''}
  <div class="seg eq-per" id="eqPer">${Object.keys(EQ_PER).map(k=>`<button type="button" data-p="${k}" onclick="EQ.per='${k}';eqSheet()">${esc(i18nT(EQ_PER[k]))}</button>`).join('')}</div>
  <div class="eq-tiles">
   <div><span>${esc(i18nT('Heures'))}</span><b data-noi18n>${esc(fmtH(h))}</b></div>
   <div><span>${esc(i18nT('À payer'))}</span><b data-noi18n>${est==null?`<button type="button" class="lnk" onclick="eqEdit('${p.id}')">${esc(i18nT('€ / heure'))}</button>`:esc(eur(est))}</b></div>
   <div><span>${esc(i18nT('Payé'))}</span><b data-noi18n>${esc(eur(pay))}</b></div>
   <div><span>${esc(i18nT('Reste'))}</span><b data-noi18n class="${est!=null&&est-pay>0.005?'eq-du':''}">${est==null?'—':esc(eur(Math.max(0,faR2(est-pay))))}</b></div></div>
  <div class="lst eq-pays">${P.filter(x=>agDate(x.d).getTime()>=st0).map(x=>`<div class="it"><span class="it-t"><b data-noi18n>${esc(eur(+x.amt||0))}</b><span class="mut"><span data-noi18n>${esc(agFmtD(x.d,{weekday:undefined,month:'short'}))}</span>${x.note?` · <span data-noi18n>${esc(x.note)}</span>`:''}</span></span>${eqDocOk(x.doc)?`<a class="eq-doc" href="${esc(x.doc.u)}" download="${esc(x.doc.n||'document')}" aria-label="${esc(i18nT('Document'))}"><svg class="i"><use href="#i-clip"/></svg></a>`:''}<button type="button" class="ag-sh-b ko" onclick="eqPayDel('${p.id}','${x.id}')" aria-label="${esc(i18nT('Supprimer'))}"><svg class="i"><use href="#i-trash"/></svg></button></div>`).join('')}</div>
  <details class="eq-add" id="eqAdd"><summary><svg class="i"><use href="#i-plus"/></svg>${esc(i18nT('Paiement'))}</summary>
   <div class="row"><div><input id="eqAmt" type="number" min="0" step="0.01" inputmode="decimal" placeholder="${esc(i18nT('Montant'))}" aria-label="${esc(i18nT('Montant'))}" value="${est!=null&&est-pay>0.005?faR2(est-pay):''}"></div><div><input id="eqDt" type="date" value="${agToday()}" aria-label="Date"></div></div>
   <input id="eqNote" placeholder="${esc(i18nT('Note (virement, espèces…)'))}" aria-label="Note" data-noi18n>
   <label class="btn sec sm eq-file"><svg class="i"><use href="#i-clip"/></svg><span id="eqDocN">${esc(i18nT('Joindre un document'))}</span><input type="file" id="eqDoc" accept="image/*,application/pdf" hidden onchange="$('eqDocN').textContent=this.files[0]?this.files[0].name:''"></label>
   <button class="btn" type="button" onclick="eqPayAdd('${p.id}')"><svg class="i"><use href="#i-check"/></svg>${esc(i18nT('Enregistrer'))}</button></details>
  <div class="ag-sh-f"><span></span><button type="button" class="lnk ko" onclick="eqDel('${p.id}')">${esc(i18nT('Retirer de l\'équipe'))}</button></div>`;
 segOn('eqPer',per)}

function eqSave(){const nom=typeof chatCasse==='function'?chatCasse($('eqNom').value.trim()):$('eqNom').value.trim(),tel=$('eqTel').value.trim(),mail=$('eqMail').value.trim(),err=t=>{$('eqErr').textContent=i18nT(t);$('eqErr').hidden=false};
 if(nom.length<2)return err('Écris le prénom.');if(tel&&!eqTelOk(tel))return err('Numéro de téléphone incomplet.');if(mail&&!eqMailOk(mail))return err('E-mail invalide.');
 ensurePt();let p=EQ.cur?eqP(EQ.cur):db.people.find(x=>nameKey(x.nom)===nameKey(nom));const neuf=!p;
 if(!p){p={id:uid()};db.people.push(p)}
 const role=(document.querySelector('#eqRole .on')||{}).dataset;Object.assign(p,{nom,tel:tel||undefined,email:mail?mail.toLowerCase():undefined,role:role&&role.p==='chef'?'chef':'ouvrier',taux:+$('eqTaux').value>0?+$('eqTaux').value:undefined,at:Date.now()});
 save();EQ.cur=p.id;EQ.mode='voir';eqSheet();eqRender();
 if(neuf&&(p.tel||p.email))eqInviter(p.id)}
function eqDel(id){const p=eqP(id);if(!p||!confirm(i18nT('Retirer {1} de l\'équipe ? Ses heures pointées restent.').replace('{1}',p.nom)))return;
 db.people=db.people.filter(x=>x!==p);save();
 try{if(typeof teamCache!=='undefined'){const i=teamCache.findIndex(u=>u&&nameKey(u.name)===nameKey(p.nom));if(i>=0&&getSync().role==='patron')apiTeam('/api/users/remove',{user:teamCache[i].name}).then(loadTeam,()=>{})}}catch(e){}
 eqClose()}

/* ---------- paiements : saisie, chat, document joint ---------- */
function eqPayAdd(id){const p=eqP(id),amt=faR2(parseFloat(String($('eqAmt').value).replace(',','.'))||0);if(!p)return;
 if(!(amt>0)){toast(i18nT('Écris le montant.'));return}
 const f=$('eqDoc').files[0],fin=doc=>{eqPayPush(p,{d:$('eqDt').value||agToday(),amt,note:$('eqNote').value.trim(),doc});eqSheet();toast(i18nT('Enregistré.'))};
 if(!f)return fin();if(f.size>2e6){toast(i18nT('Document trop lourd (2 Mo au plus).'));return}
 const r=new FileReader();r.onload=()=>fin({n:f.name,t:f.type,u:r.result});r.readAsDataURL(f)}
function eqPayPush(p,x){p.pays=(p.pays||[]).concat(Object.assign({id:uid(),at:Date.now()},x));p.at=Date.now();save()}
function eqPayDel(id,xid){const p=eqP(id);if(!p||!confirm(i18nT('Supprimer ce paiement ?')))return;p.pays=(p.pays||[]).filter(x=>x.id!==xid);p.at=Date.now();save();eqSheet()}

/* ---------- invitation : un lien pour rejoindre l'équipe, envoyé par SMS ou par e-mail ----------
   Avec l'espace d'équipe du patron (serveur de l'entreprise) : lien personnel, une seule fois.
   Sans espace d'équipe : lien vers casô (le collaborateur installe l'appli ; il rejoindra l'équipe quand l'espace existera).
   Le SMS ou l'e-mail s'ouvre déjà écrit : il reste à appuyer sur Envoyer. */
/* le patron n'a pas encore d'espace d'équipe : le serveur casô lui en donne un (lié à son compte casô), sans rien régler */
async function eqEspace(){const c=getSync();if(c.token)return true;const A=window.CasoAuth;if(!A||!A.connecte())return false;
 try{const r=await fetch(A.serveur()+'/api/espace',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+A.jeton()},body:JSON.stringify({nom:((db.me||{}).prenom||(accountGet()||{}).prenom||'').split(' ')[0]})});
  const j=await r.json().catch(()=>({}));if(!r.ok||!j.token)return false;
  setSync({url:j.url,token:j.token,user:j.name,role:j.role,rev:0,lastPush:0});try{renderSync()}catch(e){}syncNow();return true}catch(e){return false}}
async function eqLien(p){await eqEspace();const c=getSync();
 if(c.token&&c.role==='patron'){try{const j=await apiTeam('/api/invite',{user:p.nom,role:p.role==='chef'?'chef':'ouvrier'});const b=await inviteBase();if(b){loadTeam();return{lien:b+'/?join='+j.code,equipe:true}}}catch(e){}}
 return{lien:location.origin+location.pathname,equipe:false}}
/* l'invitation : une carte prête (lien), « Copier le message » et « Partager » (e-mail, WhatsApp, SMS… au choix du téléphone) */
async function eqInviter(id){const p=eqP(id);if(!p)return null;
 p.inv={at:Date.now(),via:'partage'};p.at=Date.now();save();
 const {lien,equipe}=await eqLien(p);p.inv.equipe=equipe;save();
 const c=envInvitation(p,lien);EQ.carte=c;EQ.last={url:lien,txt:c.msg};
 if(!$('eqSh').hidden&&EQ.cur===id)eqSheet();eqRender();return c}
/* chat : la bulle s'affiche tout de suite, la carte d'invitation la complète */
function eqBulleInv(t,tete,p){eqBulle(t,tete+`<p class="mut">…</p>`);const m=CHAT.m[CHAT.m.length-1];
 eqInviter(p.id).then(c=>{m.html=tete+(c?envCarte(c):'');chatSave();chatRender(true)});return true}

/* ---------- le chat : « Karim est dans mon équipe », « 06 12 34 56 78 », « Karim 15 € de l'heure », « j'ai payé Karim 300 € » (toutes les langues de casô) ---------- */
const eqFold=s=>String(s||'').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/ı/g,'i');/* accents, hamza et ı turc retirés : « أضف » → « اضف » */
const EQ_TEAM=/(equipe|team|equipo|equipa|squadra|echipa|ekib|ekip|zespol|zespole|zespolu|فريق|команд)/;
const EQ_COLLAB=/(collaborateur|collaboratrice|ouvrier|ouvriere|employe|employee|salarie|salariee|apprenti|apprentie|compagnon|coworker|colleague|worker|employee|empleado|empleada|trabajador|operario|colaborador|funcionario|operaio|dipendente|collaboratore|angajat|muncitor|colaborator|isci|calisan|pracownik|pracownica|عامل|موظف|рабочий|сотрудник|работник)/;
const EQ_ADD=/(^|[^\p{L}])(ajoute|ajouter|rajoute|mets|inscris|add|put|anade|agrega|pon|adiciona|coloca|aggiungi|metti|adauga|pune|ekle|dodaj|добавь|добавить|أضف|اضف)(?=[^\p{L}]|$)/u;
const EQ_IS=/(^|[^\p{L}])(est|fait partie|travaille|bosse|is|joins|works|esta|forma parte|trabaja|e|fa parte|lavora|este|lucreaza|face parte|var|calisiyor|jest|pracuje|يعمل|работает|теперь)(?=[^\p{L}]|$)/u;
const EQ_NEW=/(^|[^\p{L}])(nouveau|nouvelle|new|nuevo|nueva|novo|nova|nuovo|nuova|nou|noua|yeni|nowy|nowa|новый|новая|جديد)(?=[^\p{L}]|$)/u;
const EQ_PAY=/(^|[^\p{L}])(paye|regle|verse|vire|paid|pay|payed|pague|pagado|pagamos|paguei|pagato|pagata|platit|platesc|odedim|odendi|zaplacilem|zaplacilam|zaplacone|دفعت|заплатил|заплатила|выплатил)(?=[^\p{L}]|$)/u;
const EQ_HEURE=/(de l'heure|l'heure|par heure|\/ ?h\b|de l heure|an hour|per hour|\/hour|la hora|por hora|a hora|all'ora|l'ora|per ora|pe ora|ora\b|saatlik|saati|saatte|na godzine|za godzine|godzinowo|في الساعة|в час|за час)/;
const EQ_STOP=new Set('ajoute ajouter rajoute mets inscris add put anade agrega pon adiciona coloca aggiungi metti adauga pune ekle dodaj добавь добавить nouveau nouvelle new nuevo nueva novo nova nuovo nuova nou noua yeni nowy nowa новый новая collaborateur collaboratrice ouvrier ouvriere employe salarie apprenti compagnon worker employee empleado trabajador operario colaborador operaio dipendente angajat muncitor isci calisan pracownik рабочий сотрудник работник chef mon ma mes my mi mio mia meu minha meu mon il el la le les de du des dans a au avec in to into the team equipe equipo equipa squadra echipa ekip zespol команда est is esta e este jest et and y i ve oraz и paye paid pague pagato platit odedim zaplacilem заплатил j je i yo eu io eu ben ja я lundi mardi mercredi jeudi vendredi samedi dimanche aujourd hier demain'.split(' ').map(eqFold));
let EQ_ATT=null;
/* le nom : mots en majuscule (ou le mot après « ajoute »), hors mots de la phrase */
function eqNomDe(t){const W=t.replace(/[0-9+@][^\s]*/g,' ').split(/[\s,.;:!?()«»"]+/).filter(Boolean);
 const ok=w=>w.length>1&&!EQ_STOP.has(eqFold(w))&&!EQ_TEAM.test(eqFold(w))&&!EQ_COLLAB.test(eqFold(w))&&!/^(€|eur|euros?)$/i.test(w);
 const conn=new Set(['de','du','van','von','da','di','le','la','el','ben','ibn','al']);
 for(let i=0;i<W.length;i++){if(/^[\p{Lu}]/u.test(W[i])&&ok(W[i])&&!(i===0&&EQ_ADD.test(eqFold(W[0])))){let n=[W[i]];for(let j=i+1;j<W.length&&n.length<3;j++){if(/^[\p{Lu}]/u.test(W[j])&&ok(W[j]))n.push(W[j]);else if(conn.has(W[j].toLowerCase())&&W[j+1]&&/^[\p{Lu}]/u.test(W[j+1]))n.push(W[j]);else break}return n.join(' ')}}
 const f=W.map(eqFold);for(let i=0;i<f.length-1;i++)if(EQ_ADD.test(f[i])&&ok(W[i+1]))return W[i+1][0].toUpperCase()+W[i+1].slice(1);
 return''}
function eqConnu(t){const f=eqFold(t);ensurePt();return db.people.filter(p=>p.nom&&new RegExp('(^|[^\\p{L}])'+eqFold(p.nom.split(' ')[0]).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=[^\\p{L}]|$)','u').test(f)).sort((a,b)=>b.nom.length-a.nom.length)[0]||null}
function eqCoord(t){const m=String(t).match(/[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}/),tel=String(t).replace(/[^\d+\s.()-]/g,' ').match(/\+?\d[\d\s.()-]{6,}\d/);
 return{email:m?m[0].toLowerCase():'',tel:tel&&eqTelOk(tel[0])?tel[0].trim():''}}
function eqMontant(f){const m=f.match(/(\d[\d\s]*(?:[.,]\d{1,2})?)\s*(€|eur|euros?|e\b)/)||f.match(/(?:€|eur)\s*(\d[\d\s]*(?:[.,]\d{1,2})?)/);return m?parseFloat(m[1].replace(/\s/g,'').replace(',','.')):null}
function eqBulle(t,html){if(CHAT.qid!==q.id)CHAT={qid:q.id,m:[]};CHAT.m.push({who:'me',text:t});CHAT.m.push({who:'bot',html});chatSave();chatRender(true);return true}
function eqCarte(p){const st=eqStatut(p);return `<div class="ag-card eq-cd" onclick="cptPage('team');eqOpen('${p.id}')"><div class="ag-ct"><b data-noi18n>${esc(p.nom)}</b><span class="mut"><span>${esc(i18nT(p.role==='chef'?'Chef':'Ouvrier'))}</span>${p.tel?` · <span data-noi18n>${esc(p.tel)}</span>`:''}${p.email?` · <span data-noi18n>${esc(p.email)}</span>`:''}${p.taux?` · <span data-noi18n>${esc(eur(p.taux))}/h</span>`:''}</span></div><span class="eq-s ${st}">${esc(i18nT(EQ_ST[st]))}</span></div>`}
function eqChat(t){if(typeof db==='undefined')return false;const f=eqFold(t),c=eqCoord(t);
 /* réponse à « son numéro ou son e-mail ? » */
 if(EQ_ATT&&Date.now()-EQ_ATT.at<15*60e3){const p=eqP(EQ_ATT.id);
  if(p&&(c.tel||c.email)&&!EQ_TEAM.test(f)&&!EQ_PAY.test(f)){EQ_ATT=null;if(c.tel)p.tel=c.tel;if(c.email)p.email=c.email;p.at=Date.now();save();
   return eqBulleInv(t,'',p)}
  if(/^(non|no|nao|nu|nie|hayir|нет|لا|plus tard|later|apres)\b/.test(f.trim())){EQ_ATT=null;return eqBulle(t,`<p>${esc(i18nT('D\'accord. Tu pourras l\'inviter depuis Mon équipe.'))}</p>`)}
  EQ_ATT=null}
 /* « j'ai payé Karim 300 € » */
 const pc=eqConnu(t);
 if(pc&&EQ_PAY.test(f)&&!/(^|[^\p{L}])(m'a|ma|a paye|has paid|me pago|mi ha)(?=[^\p{L}]|$)/u.test(f)){const amt=eqMontant(f);if(amt>0){eqPayPush(pc,{d:agToday(),amt:faR2(amt),note:i18nT('chat')});const est=eqEstime(pc,'month'),pay=eqPaye(pc,'month');
  return eqBulle(t,`<p><svg class="i i-sm ok-c"><use href="#i-check"/></svg> <span>Payé à</span> <b data-noi18n>${esc(pc.nom)}</b> : <b data-noi18n>${esc(eur(amt))}</b>${est!=null?` · <span class="mut"><span>reste ce mois</span> <span data-noi18n>${esc(eur(Math.max(0,faR2(est-pay))))}</span></span>`:''}</p>`)}}
 /* « Karim 15 € de l'heure » */
 if(pc&&EQ_HEURE.test(f)&&!EQ_PAY.test(f)){const amt=eqMontant(f);if(amt>0){pc.taux=faR2(amt);pc.at=Date.now();save();return eqBulle(t,`<p><svg class="i i-sm ok-c"><use href="#i-check"/></svg> <span data-noi18n>${esc(pc.nom)} · ${esc(eur(pc.taux))}/h</span></p>`)}}
 /* « Karim est dans mon équipe », « ajoute Ali à l'équipe », « nouveau collaborateur Paul 06… » */
 const veut=(EQ_TEAM.test(f)&&(EQ_ADD.test(f)||EQ_IS.test(f)||c.tel||c.email))||(EQ_COLLAB.test(f)&&(EQ_NEW.test(f)||EQ_ADD.test(f)));
 if(!veut||/(^|[^\p{L}])(retire|enleve|supprime|remove|quita|elimina|rimuovi|sterge|cikar|usun|удали)(?=[^\p{L}]|$)/u.test(f))return false;
 let nom=eqNomDe(t);if(!nom&&pc)nom=pc.nom;if(!nom)return false;nom=typeof chatCasse==='function'?chatCasse(nom):nom;
 ensurePt();let p=db.people.find(x=>nameKey(x.nom)===nameKey(nom))||(pc&&nameKey(pc.nom.split(' ')[0])===nameKey(nom.split(' ')[0])?pc:null);const neuf=!p;
 if(!p){p={id:uid(),nom,role:'ouvrier'};db.people.push(p)}
 if(/(chef|foreman|capataz|encarregado|caposquadra|sef|brygadzista|бригадир|رئيس)/.test(f))p.role='chef';
 if(c.tel)p.tel=c.tel;if(c.email)p.email=c.email;if(EQ_HEURE.test(f)){const a=eqMontant(f);if(a>0)p.taux=faR2(a)}p.at=Date.now();save();eqRender();
 const tete=`<p><svg class="i i-sm"><use href="#i-users"/></svg> <b data-noi18n>${esc(p.nom)}</b> <span>${neuf?'ajouté à ton équipe':'est déjà dans ton équipe'}</span></p>`;
 if(eqStatut(p)==='equipe')return eqBulle(t,tete+eqCarte(p));
 if(p.tel||p.email)return eqBulleInv(t,tete,p);
 EQ_ATT={id:p.id,at:Date.now()};
 return eqBulle(t,tete+`<p><span>Son numéro ou son e-mail ? Je lui envoie l'invitation pour rejoindre l'équipe.</span></p>`)}

/* ---------- casô collaborateur : ce que voit un ouvrier de l'équipe ----------
   Pointage, son planning, et « Moi » : ses heures, ce qui lui est dû (heures × son prix de l'heure) et ce qu'il a reçu.
   Les écrans du patron (devis, clients, factures, fournisseurs, équipe, abonnement) lui sont cachés. */
function roleUI(){const c=getSync(),ouv=!!(c.token&&c.role==='ouvrier');document.body.classList.toggle('role-ouvrier',ouv);
 if(ouv){const s=document.querySelector('section.on');if(s&&/^s-(chat|devis|histo|cli|prix|fou|enc|fact|cpt)$/.test(s.id)&&s.id!=='s-cpt')go('pt')}}
function eqMoi(){const c=getSync();if(!c.token||c.role==='patron')return null;ensurePt();
 const u=String(c.user||'').toLowerCase();return db.people.find(p=>String(p.nom||'').toLowerCase().split(' ')[0]===u.split(' ')[0])||(db.people.length===1?db.people[0]:null)}
function eqMoiCarte(){const p=eqMoi();if(!p)return'';const h=eqHeures(p.id,'month'),est=eqEstime(p,'month'),pay=eqPaye(p,'month'),P=(p.pays||[]).slice().sort((a,b)=>b.d.localeCompare(a.d)).slice(0,6);
 return `<div class="card eq-moi"><h2><span class="hi"><svg class="i"><use href="#i-user"/></svg></span><span data-noi18n>${esc(p.nom)}</span> · <span>${esc(i18nT('ce mois-ci'))}</span></h2>
  <div class="eq-tiles"><div><span>${esc(i18nT('Heures'))}</span><b data-noi18n>${esc(fmtH(h))}</b></div><div><span>${esc(i18nT('Dû'))}</span><b data-noi18n>${est==null?'—':esc(eur(est))}</b></div>
  <div><span>${esc(i18nT('Reçu'))}</span><b data-noi18n>${esc(eur(pay))}</b></div><div><span>${esc(i18nT('Reste'))}</span><b data-noi18n>${est==null?'—':esc(eur(Math.max(0,faR2(est-pay))))}</b></div></div>
  ${P.length?`<div class="lst eq-pays">${P.map(x=>`<div class="it"><span class="it-t"><b data-noi18n>${esc(eur(+x.amt||0))}</b><span class="mut"><span data-noi18n>${esc(agFmtD(x.d,{weekday:undefined,month:'short'}))}</span>${x.note?` · <span data-noi18n>${esc(x.note)}</span>`:''}</span></span></div>`).join('')}</div>`:''}</div>`}
/* sortie du mode collaborateur (par exemple le patron qui a ouvert son propre lien d'invitation sur son téléphone) */
function eqSortie(){const c=getSync();if(!c.token||c.role!=='ouvrier')return'';
 return `<p class="eq-out"><button type="button" class="lnk" onclick="eqQuitter()">${esc(i18nT('Quitter l\'équipe sur ce téléphone'))}</button></p>`}
function eqQuitter(){if(!confirm(i18nT('Ce téléphone quitte l\'équipe. Tes données restent sur le serveur de l\'entreprise. Continuer ?')))return;
 syncLogout();roleUI();try{go('chat')}catch(e){}}
/* ---------- collaborateur : Mon profil (ce que l'entreprise a noté ; modifiable par le patron) ---------- */
function eqProfilRender(){const p=eqMoi(),c=getSync(),ent=((db.prof||{}).nom||'').trim(),box=$('cpMoi');if(!box)return;
 const L=[['Prénom et nom',p?p.nom:c.user],['Rôle',i18nT(c.role==='chef'?'Chef':'Ouvrier')],['Entreprise',ent],['Téléphone',p&&p.tel],['E-mail',p&&p.email]].filter(x=>x[1]);
 box.innerHTML=`<div class="card"><div class="eq-pf"><span class="eq-ini" data-noi18n>${esc(String((p&&p.nom)||c.user||'·').trim()[0]||'·').toUpperCase()}</span><b data-noi18n>${esc((p&&p.nom)||c.user||'')}</b></div>
  ${L.map(x=>`<div class="tot"><span>${esc(i18nT(x[0]))}</span><b data-noi18n>${esc(x[1])}</b></div>`).join('')}
  <p class="mut">${esc(i18nT('Pour changer ces informations, demande à ton entreprise.'))}</p></div>
  <div class="sec-d"><button class="lnk ac-del" type="button" onclick="eqSupprimer()">${esc(i18nT('Supprimer mon compte'))}</button></div>`}
/* le collaborateur supprime son compte : il quitte l'équipe, l'entreprise est prévenue ; ses heures restent chez elle */
async function eqSupprimer(){const ent=((db.prof||{}).nom||'').trim()||i18nT('ton entreprise');
 if(!confirm(i18nT('Supprimer ton compte ? Tu quittes l\'équipe de {1}, qui est prévenue. Tes heures déjà pointées restent chez elle.').replace('{1}',ent)))return;
 try{await apiTeam('/api/account/delete',{confirm:'SUPPRIMER'})}catch(e){toast(String(e.message||e));return}
 setSync({});['events','chantiers','pts','people'].forEach(k=>db[k]=[]);db.prof={};db.profAt=0;save();roleUI();toast(i18nT('Compte supprimé.'));
 try{drawerClose(true)}catch(e){}if(typeof accountGet==='function'&&!accountGet()&&typeof startOpen==='function')startOpen();else go('chat')}
/* ---------- collaborateur : Ma rentabilité (ses heures, ce qui lui est dû, ce qu'il a reçu, par chantier) ---------- */
let EQ_RPER='month';
function eqRentRender(per){if(per)EQ_RPER=per;const p=eqMoi(),box=$('cpRent');if(!box)return;
 if(!p){box.innerHTML=`<div class="card"><p class="mut">${esc(i18nT('Ta fiche n\'est pas encore arrivée. Ouvre casô avec du réseau.'))}</p></div>`;return}
 const per0=EQ_RPER,h=eqHeures(p.id,per0),est=eqEstime(p,per0),pay=eqPaye(p,per0),st=periodStart(per0),par={};
 sessions().filter(s=>s.p===p.id&&!s.open&&!s.warn&&(s.a||s.b)>=st).forEach(s=>{par[s.c]=(par[s.c]||0)+(s.b-s.a)});
 const P=(p.pays||[]).filter(x=>agDate(x.d).getTime()>=st).sort((a,b)=>b.d.localeCompare(a.d));
 box.innerHTML=`<div class="card eq-moi"><div class="chips" style="margin-bottom:10px">${[['week','Semaine'],['month','Mois'],['all','Tout']].map(([k,l])=>`<span class="chip${per0===k?' on':''}" style="${per0===k?'background:var(--acc);color:var(--ink)':''}" onclick="eqRentRender('${k}')">${esc(i18nT(l))}</span>`).join('')}</div>
  <div class="eq-tiles"><div><span>${esc(i18nT('Heures'))}</span><b data-noi18n>${esc(fmtH(h))}</b></div><div><span>${esc(i18nT('Dû'))}</span><b data-noi18n>${est==null?'—':esc(eur(est))}</b></div>
  <div><span>${esc(i18nT('Reçu'))}</span><b data-noi18n>${esc(eur(pay))}</b></div><div><span>${esc(i18nT('Reste'))}</span><b data-noi18n>${est==null?'—':esc(eur(Math.max(0,faR2(est-pay))))}</b></div></div>
  ${p.taux?`<p class="mut"><span>${esc(i18nT('Prix de l\'heure'))}</span> : <span data-noi18n>${esc(eur(p.taux))}</span></p>`:`<p class="mut">${esc(i18nT('Ton prix de l\'heure n\'est pas encore noté par ton entreprise.'))}</p>`}</div>
  <div class="card"><h2><span class="hi"><svg class="i"><use href="#i-pin"/></svg></span>${esc(i18nT('Par chantier'))}</h2>${Object.keys(par).length?Object.keys(par).map(cid=>`<div class="tot"><span data-noi18n>${esc(chName(cid))}</span><b data-noi18n>${esc(fmtH(par[cid]))}</b></div>`).join(''):`<p class="mut">${esc(i18nT('Aucune heure.'))}</p>`}</div>
  <div class="card"><h2><span class="hi"><svg class="i"><use href="#i-chart"/></svg></span>${esc(i18nT('Paiements reçus'))}</h2>${P.length?P.map(x=>`<div class="tot"><span data-noi18n>${esc(agFmtD(x.d,{weekday:undefined,month:'short'}))}${x.note?' · '+esc(x.note):''}</span><b data-noi18n>${esc(eur(+x.amt||0))}</b></div>`).join(''):`<p class="mut">${esc(i18nT('Aucun paiement.'))}</p>`}</div>`}
/* ---------- « Passer à mon compte pro » : il crée son compte comme tout artisan, et garde l'équipe de son patron ----------
   Le lien avec l'équipe est mis de côté (caso_equipe_ext) : « Chantiers chez <entreprise> » montre ses rendez-vous et ses chantiers là-bas. */
const EQ_EXT='caso_equipe_ext';
function eqExt(){try{const x=JSON.parse(localStorage.getItem(EQ_EXT)||'null');return x&&x.url&&x.token?x:null}catch(e){return null}}
function eqPro(){const c=getSync(),ent=((db.prof||{}).nom||'').trim();if(!c.token)return;syncEncore=false;
 if(!confirm(i18nT('Tu crées ton compte pro, comme tout artisan. Tu restes dans l\'équipe de {1} : tes chantiers chez eux restent visibles. Continuer ?').replace('{1}',ent||i18nT('ton entreprise'))))return;
 try{localStorage.setItem(EQ_EXT,JSON.stringify({url:c.url,token:c.token,user:c.user,role:c.role,entreprise:ent,logo:(db.prof||{}).logo||''}))}catch(e){}
 setSync({});/* le jeton de l'équipe n'est pas annulé : il sert à « Chantiers chez … » */
 ['events','chantiers','pts','people'].forEach(k=>db[k]=[]);db.prof={};db.profAt=0;save();roleUI();
 if(typeof accountGet==='function'&&accountGet()){if(typeof modeOpen==='function')modeOpen()}else if(typeof startOpen==='function')startOpen()}
/* « Chantiers chez <entreprise> » : lecture seule, depuis le serveur de l'équipe */
async function eqExtRender(){const x=eqExt(),box=$('cpExt');if(!box)return;if(!x){box.innerHTML='';return}
 box.innerHTML=`<div class="card"><p class="mut">${esc(i18nT('Chargement…'))}</p></div>`;
 try{const r=await fetch(x.url+'/api/sync',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+x.token},body:'{"since":0,"changes":{}}'});
  if(r.status===401){box.innerHTML=`<div class="card"><p>${esc(i18nT('Tu ne fais plus partie de cette équipe.'))}</p><button class="btn sec" onclick="eqExtOubli()">${esc(i18nT('Retirer'))}</button></div>`;return}
  const j=await r.json(),C=j.changes||{},auj=agToday();
  const E=(C.events||[]).filter(e=>e.t==='rdv'&&e.d>=auj).sort((a,b)=>(a.d+(a.a||'')).localeCompare(b.d+(b.a||''))).slice(0,30),CH=C.chantiers||[];
  const nomCh=id=>{const c=CH.find(y=>y.id===id);return c?c.nom:''};
  box.innerHTML=`<div class="card"><div class="eq-pf">${x.logo?`<img class="eq-ini" style="object-fit:contain;background:#fff" src="${esc(x.logo)}" alt="">`:`<span class="eq-ini"><svg class="i"><use href="#i-users"/></svg></span>`}<b data-noi18n>${esc(x.entreprise||'')}</b></div>
   <h2><span class="hi"><svg class="i"><use href="#i-cal"/></svg></span>${esc(i18nT('Mes prochains rendez-vous'))}</h2>
   ${E.length?E.map(e=>`<div class="tot"><span data-noi18n>${esc(agFmtD(e.d,{weekday:'short',day:'numeric',month:'short'}))}${e.a?' · '+esc(e.a):''} · ${esc(e.title||nomCh(e.ch)||'')}</span><span class="mut" data-noi18n>${esc(e.adr||nomCh(e.ch)||'')}</span></div>`).join(''):`<p class="mut">${esc(i18nT('Aucun rendez-vous prévu.'))}</p>`}</div>
   <div class="card"><h2><span class="hi"><svg class="i"><use href="#i-pin"/></svg></span>${esc(i18nT('Chantiers'))}</h2>${CH.length?CH.map(c=>`<div class="tot"><span data-noi18n>${esc(c.nom)}</span><span class="mut" data-noi18n>${esc(c.adr&&!String(c.nom).includes(c.adr)?c.adr:'')}</span></div>`).join(''):`<p class="mut">${esc(i18nT('Aucun chantier.'))}</p>`}</div>`}
 catch(e){box.innerHTML=`<div class="card"><p class="mut">${esc(i18nT('Pas de connexion. Réessaie plus tard.'))}</p></div>`}}
function eqExtOubli(){try{localStorage.removeItem(EQ_EXT)}catch(e){}drawerClose&&drawerClose(true);go('chat')}
try{roleUI()}catch(e){}

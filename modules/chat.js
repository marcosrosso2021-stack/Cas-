/* casô · Chat : enchaînement, écran principal, icônes des messages
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Le chat enchaîne tout seul (une question, une réponse) ----------
   Plan (photo ou PDF) → maquette 3D ; facture, devis, ticket ou bon d'un fournisseur → fournisseur + matériaux ;
   coordonnées (carte de visite) → client ou fournisseur ; adresse seule → chantier, puis client. */
let CH_ASK=null;
const CH_OUI=/^(oui|ouais|ok|okay|d ?accord|vas ?y|go|yes|yeah|yep|sure|si|sí|sim|claro|vale|certo|va bene|da|tak|evet|tamam|olur|да|ага|давай|نعم|اي|موافق)(?![\p{L}])/iu,
 CH_NON=/^(non|nan|no|não|nao|nu|nie|hayir|hayır|нет|لا|laisse|pas besoin)(?![\p{L}])/iu;
function chBot(html,extra){const m=Object.assign({who:'bot',html},extra||{});CHAT.m.push(m);chatSave();chatRender(true);return m}
/* la question posée disparaît de sa bulle une fois répondue */
function chAsked(){const last=[...CHAT.m].reverse().find(m=>m.who==='bot'&&m.html&&m.html.includes('<!--ask-->'));
 if(last){last.html=last.html.replace(/<!--ask-->[\s\S]*?<!--\/ask-->/,'');if(!last.html.replace(/<[^>]*>/g,'').trim())CHAT.m.splice(CHAT.m.indexOf(last),1)}}
const chB=(lab,fn,sec)=>`<button class="btn sm${sec?' sec':''}" onclick="${fn}">${lab}</button>`;
/* ce qu'est le document : plan, document fournisseur, coordonnées, ou on demande */
function chKind(T){const t=vnNorm(T),nw=t.split(/\s+/).filter(w=>/\p{L}{2,}/u.test(w)).length,M=docMeta(T);let inv=0,plan=0;
 if(/\b(facture|devis|bon de livraison|bl n|avoir|ticket|proforma|invoice)\b/.test(t))inv+=2;
 if(/\b(total|ttc|tva|ht|net a payer|montant|sous total|prix unitaire|pu ht|qte)\b/.test(t))inv+=2;
 if((T.match(/\d[\d\s.,]*\s?(?:€|eur)\b/gi)||[]).length>=2)inv+=2;
 if(M.four)inv++;if(M.siret)inv++;if(M.ttc!=null)inv++;
 const rooms=(t.match(/\b(sejour|salon|cuisine|chambre|ch \d|sdb|salle de bain|salle d eau|wc|entree|degagement|garage|cellier|bureau|buanderie|dressing|placard|terrasse|balcon|couloir|living|kitchen|bedroom|bathroom)\b/g)||[]).length;
 plan+=rooms>=2?3:rooms;if(/\b(plan|echelle|niveau|rdc|r \d|etage|facade|coupe|surface habitable|shab|cotes?)\b/.test(t))plan+=2;
 if((t.match(/\b\d+[.,]\d+\b/g)||[]).length>=4&&!/€/.test(T))plan++;if(nw<8)plan+=2;
 const ct=ctParse(T);if(nw<8&&inv===0)return 'plan';if(inv>=4&&inv>plan)return 'doc';if(plan>=3&&plan>inv)return 'plan';if((ct.tel||ct.email)&&inv<4&&nw<80)return 'contact';return '?'}
function chatFilePick(){const i=$('chatFileIn');if(i)i.click()}
function chatFileOk(f){return f&&(/^image\//.test(f.type)||f.type==='application/pdf'||/\.pdf$/i.test(f.name||''))}
document.addEventListener('paste',e=>{if(!e.target||e.target.id!=='chatIn')return;const f=[...(e.clipboardData&&e.clipboardData.files||[])].find(chatFileOk);if(f){e.preventDefault();chatFile({files:[f],value:''})}});
document.addEventListener('dragover',e=>{if(e.target&&e.target.closest&&e.target.closest('#s-chat'))e.preventDefault()});
document.addEventListener('drop',e=>{if(!(e.target&&e.target.closest&&e.target.closest('#s-chat')))return;const f=[...(e.dataTransfer&&e.dataTransfer.files||[])].find(chatFileOk);if(f){e.preventDefault();chatFile({files:[f],value:''})}});
async function chatFile(inp){const f=inp.files&&inp.files[0];if(!f)return;inp.value='';CH_ASK=null;
 const pdf=f.type==='application/pdf'||/\.pdf$/i.test(f.name||'');
 CHAT.m.push({who:'me',text:'📎 '+(f.name&&!/^image\.\w+$/i.test(f.name)?f.name:(pdf?'PDF':'Photo'))});
 const b=chBot(`<p class="mut"><span>Lecture du document…</span> <span data-noi18n class="ch-pc"></span></p>`);
 const pc=n=>{b.html=`<p class="mut"><span>Lecture du document…</span> <span data-noi18n>${n} %</span></p>`;chatRender(false)};
 let T=null,W=[];const sm=setImpMsg;setImpMsg=s=>{const m=/(\d+)\s*%/.exec(s||'');if(m)pc(m[1])};
 try{const r=pdf?await pdfRead(f):await ocrRun(await docImg(f),pc,'6');T=r.text||'';W=r.words||[]}catch(e){T=null}finally{setImpMsg=sm}
 CHAT.m.splice(CHAT.m.indexOf(b),1);
 const k=T==null?'?':chKind(T);
 /* une image sans texte lisible : un plan ou une photo de chantier. Avec une phrase déjà écrite (« ici, faut refaire le mur chez Martin »),
    c'est une photo de chantier, rangée avec ces mots ; sans phrase, une question. Rien n'est lu dans l'image. */
 const dit=(($('chatIn')||{}).value||'').trim(),nu=!pdf&&T!=null&&k==='plan'&&vnNorm(T).split(/\s+/).filter(w=>/\p{L}{2,}/u.test(w)).length<8,PC=window.casoPont&&casoPont.photoChantier;
 if(PC&&!pdf&&dit&&k!=='doc'&&k!=='contact'&&(k!=='plan'||nu)&&!/\b(plan|maquette|3d)\b/i.test(dit)){$('chatIn').value='';try{chatGrow($('chatIn'));qkUpdate()}catch(e){}CHAT.m[CHAT.m.length-1].text+=' '+dit;return casoPont.photoChantier(f,dit)}
 if(PC&&nu&&!dit){CH_ASK={k:'type',f};
  return chBot(`<p><span>C’est un plan ou une photo de chantier ?</span></p><!--ask--><div class="msg-act">${chB('<svg class="i"><use href="#i-plan"/></svg><span>Plan 3D</span>',"chType('plan')")}${chB('<svg class="i"><use href="#i-cam"/></svg><span>Photo de chantier</span>',"chType('photo')",1)}</div><!--/ask-->`)}
 if(k==='plan')return chPlan(f);
 if(k==='doc')return chDocAsk(f,T,W);
 if(k==='contact')return chContact(T);
 CH_ASK={k:'type',f};
 chBot(`<p><span>C’est un plan ou un document fournisseur ?</span></p><!--ask--><div class="msg-act">${chB('<svg class="i"><use href="#i-plan"/></svg><span>Plan 3D</span>',"chType('plan')")}${chB('<svg class="i"><use href="#i-truck"/></svg><span>Document fournisseur</span>',"chType('doc')",1)}${!pdf&&window.casoPont&&casoPont.photoChantier?chB('<svg class="i"><use href="#i-cam"/></svg><span>Photo de chantier</span>',"chType('photo')",1):''}</div><!--/ask-->`)}
function chType(k){const a=CH_ASK;if(!a||a.k!=='type')return;CH_ASK=null;chAsked();if(k==='plan')return chPlan(a.f);
 if(k==='photo')return casoPont.photoChantier(a.f,'');
 $('impFour').value='';go('imp');runImport({files:[a.f],value:''})}
/* plan → la maquette 3D le prend tout de suite (cadrage, puis les murs sont tracés) */
function chPlan(f){chBot(`<p><svg class="i i-sm"><use href="#i-plan"/></svg> <span>Plan envoyé à la maquette 3D.</span></p>`);
 if(typeof m3dOpen!=='function')return;m3dOpen();let n=0;(function essai(){const fr=document.querySelector('#m3d iframe');let w=null;try{w=fr&&fr.contentWindow}catch(e){}
  if(w&&w.casoModule&&w.casoModule.loadFile){try{w.casoModule.loadFile(f)}catch(e){}return}if(++n<40)setTimeout(essai,250)})()}
/* document d'un fournisseur : on dit ce qu'on a lu, une question, « oui » enregistre */
function chDocAsk(f,T,W){const M=docMeta(T);$('impFour').value=M.four||'';
 const rows=rowsFromWords(W,T).filter(r=>r.on!==false&&r.pu>0&&r.label&&/\p{L}{3}/u.test(r.label)&&!/\b(t[ée]l|siret|tva|total|iban|bic|capital|rcs|ape|net [àa] payer|acompte)\b/i.test(r.label)).map(r=>Object.assign(r,{label:r.label.replace(/[\[\]|]+.*$/,'').replace(/\s+/g,' ').trim()})).filter(r=>r.label.length>2);
 /* total lu de travers (photo floue) : affiché seulement s'il colle avec les lignes lues */
 if(M.ttc!=null&&rows.length){const S=rows.reduce((t,r)=>t+(r.qty||1)*r.pu,0);if(![1,1.055,1.1,1.2].some(k=>Math.abs(S*k-M.ttc)<=Math.max(1,M.ttc*.01)))M.ttc=null}
 CH_ASK={k:'doc',meta:M,rows,four:M.four||''};
 const ty={facture:'Facture',devis:'Devis',ticket:'Ticket',bl:'Bon de livraison'}[M.type]||'Document';
 const head=`<p><svg class="i i-sm"><use href="#i-truck"/></svg> <b>${ty}</b>${M.four?` · <b data-noi18n>${esc(M.four)}</b>`:''}${rows.length?` · <b data-noi18n>${rows.length}</b> <span>${rows.length>1?'lignes':'ligne'}</span>`:''}${M.ttc!=null?` · <b data-noi18n>${eur(M.ttc)}</b> <span>TTC</span>`:''}</p>`;
 if(!M.four)return chBot(head+`<!--ask--><div class="sugg"><label>De quel fournisseur ?</label><div class="sg-in"><input autocapitalize="words" placeholder="Point P" onkeydown="if(event.key==='Enter')chFour(this.nextElementSibling)"><button class="btn sm" onclick="chFour(this)"><svg class="i"><use href="#i-check"/></svg>OK</button></div></div><!--/ask-->`);
 chBot(head+chDocQ())}
function chDocQ(){const a=CH_ASK;return `<!--ask--><p><span>${a.rows.length?'J’enregistre ce fournisseur et j’ajoute les matériaux à tes prix ?':'Je l’enregistre chez ce fournisseur ?'}</span></p><div class="msg-act">${chB('<svg class="i"><use href="#i-check"/></svg><span>Oui</span>',"chDoc('prix')")}${a.rows.length?chB('<svg class="i"><use href="#i-quote"/></svg><span>Au devis</span>',"chDoc('devis')",1):''}</div><!--/ask-->`}
function chFour(btn){const i=btn.closest('.sugg').querySelector('input'),v=(i&&i.value||'').trim();if(!v){i&&i.focus();return}chFourSet(v)}
function chFourSet(v){const a=CH_ASK;if(!a||a.k!=='doc')return;a.four=ctCap(v);$('impFour').value=a.four;chAsked();chBot(`<p><svg class="i i-sm"><use href="#i-truck"/></svg> <b data-noi18n>${esc(a.four)}</b></p>`+chDocQ())}
function chDoc(dest){const a=CH_ASK;if(!a||a.k!=='doc'||!a.four)return;CH_ASK=null;chAsked();
 const M=a.meta,sel=a.rows,before=JSON.stringify({p:db.prices,s:db.suppliers,ql:q.lines,a:db.achats||[],h:db.hist.length});
 const {x,isNew}=upsert('suppliers',{nom:a.four,tel:M.tel||'',email:M.email||'',adr:M.adr||'',siret:M.siret||''});
 IMP_DOC=M;impDocShow();if(sel.length)learnFrom(x.nom,sel);achSave(x.nom,sel);IMP_DOC=null;impDocShow();
 const m=parseFloat(($('impMarge')||{}).value)||0,pareils=[],hausses=[];
 sel.forEach(r=>{const vente=Math.round(r.pu*(1+m/100)*100)/100;
  /* hausse chez ce fournisseur : dernier prix payé pour le même article, +5 % ou plus */
  {const k=vnNorm(r.label),pv=(db.hist||[]).filter(h=>h.four&&vnNorm(h.four)===vnNorm(x.nom)&&vnNorm(h.nom)===k&&+h.prix>0).sort((a,b)=>String(b.date).localeCompare(String(a.date)))[0];
   if(pv&&r.pu>=pv.prix*1.05)hausses.push(`${r.label} : +${Math.round((r.pu/pv.prix-1)*100)} % (${eur(pv.prix)} → ${eur(r.pu)})`)}
  logPrice(r.label,x.nom,r.pu,r.unit);
  if(dest==='prix'){let ex=db.prices.find(p=>p.nom.toLowerCase()===r.label.toLowerCase());if(!ex){ex=prixPareil(r.label,r.unit);if(ex)pareils.push([r.label,ex.nom])}
   if(ex){ex.prix=vente;ex.unit=r.unit;ex.tva=r.tva;ex.four=x.nom}else db.prices.push({id:uid(),nom:r.label,unit:r.unit,prix:vente,tva:r.tva,four:x.nom})}
  else q.lines.push({label:r.label,qty:r.qty,unit:r.unit,pu:vente,tva:r.tva})});
 if(dest==='devis'&&sel.length){fillForm();store()}else save();try{renderPrices();renderQuick()}catch(e){}
 chBot(`<p><svg class="i i-sm"><use href="#i-truck"/></svg> <span>Fournisseur</span> : <b data-noi18n>${esc(x.nom)}</b> <span class="pill-s ${isNew?'new':''}">${isNew?'Nouveau, ajouté à tes fournisseurs':'Déjà dans tes fournisseurs'}</span></p>`+
  (sel.length?`<p><b data-noi18n>${sel.length}</b> <span>${dest==='prix'?(sel.length>1?'matériaux ajoutés à tes prix':'matériau ajouté à tes prix'):(sel.length>1?'lignes ajoutées au devis':'ligne ajoutée au devis')}</span>${m?` <span class="mut" data-noi18n>(+${m} %)</span>`:''}</p>`+pareils.map(([a,b])=>`<p class="mut" data-noi18n>${esc(a)} → ${esc(b)}</p>`).join('')+hausses.map(h=>`<p class="vn-w" data-noi18n>↑ ${esc(h)}</p>`).join(''):`<p><span>Document enregistré.</span></p>`),{chUndo:{back:before,sNew:isNew?x.id:null}})}
/* « PLAQUE BA13 STD 2500x1200 » sur la facture = « Placo BA13 » de tes prix : même référence (BA13), ou tous les mots de ton
   libellé, pour un prix qui vient déjà d'un fournisseur (jamais un prix de pose) ; même unité */
function prixPareil(label,unit){const SYN={placo:'plaque',placoplatre:'plaque',platre:'plaque'},w=s=>vnNorm(s).split(/[^\p{L}\d]+/u).filter(x=>x.length>=3||/\d/.test(x)).map(x=>SYN[x]||x),A=w(label),code=x=>/\d/.test(x)&&/\p{L}/u.test(x)&&x.length>=3&&!/^\d+x\d+(x\d+)?$/.test(x),CA=A.filter(code);let best=null,bs=0;
 const U=u=>String(u||'').toLowerCase().replace(/^m2$/,'m²').replace(/^m3$/,'m³').replace(/^(u|unite|pce|piece)s?$/,'u');(db.prices||[]).forEach(p=>{if(p.unit&&unit&&U(p.unit)!==U(unit))return;const L=w(p.nom);if(!L.length)return;const CP=L.filter(code),MP=L.filter(x=>!code(x));
  if(CA.length&&CP.length&&!CP.some(c=>CA.includes(c)))return;const sc=L.filter(x=>A.includes(x)).length/L.length,mot=MP.some(x=>A.includes(x));
  if((CP.some(c=>CA.includes(c))&&mot||sc>=1&&p.four)&&sc>=bs){bs=sc;best=p}});return best}
/* coordonnées lues sur une photo : client ou fournisseur (même question que pour un nom tapé) */
function chContact(T){const c=ctParse(T);CH_PEND={tel:c.tel||'',adr:c.adr||'',email:c.email||''};if(c.nom)CH_ASK={k:'contact',nom:c.nom};
 const info=[c.tel,c.email,c.adr].filter(Boolean).map(esc).join(' · ');
 if(!c.nom)return chBot(`<p><svg class="i i-sm"><use href="#i-user"/></svg> <span data-noi18n>${info}</span></p><!--sg--><div class="sugg"><label>Nom du client pour ce chantier</label><div class="sg-in"><input autocapitalize="words" placeholder="M. Dupont" onkeydown="if(event.key==='Enter')chatAddAs('cli',this.nextElementSibling)"><button class="btn sm" onclick="chatAddAs('cli',this)"><svg class="i"><use href="#i-plus"/></svg>Ajouter</button></div></div><!--/sg-->`);
 chBot(`<p><svg class="i i-sm"><use href="#i-user"/></svg> <b data-noi18n>${esc(c.nom)}</b> · <span data-noi18n>${info}</span></p><!--sg--><div class="sugg"><p>« <b data-noi18n>${esc(c.nom)}</b> » : <span>c'est un client ou un fournisseur ?</span></p><div class="msg-act"><button class="btn sm" data-n="${esc(c.nom)}" onclick="chatAddAs('cli',this)"><svg class="i"><use href="#i-user"/></svg>Client</button><button class="btn sm sec" data-n="${esc(c.nom)}" onclick="chatAddAs('fou',this)"><svg class="i"><use href="#i-truck"/></svg>Fournisseur</button></div></div><!--/sg-->`)}
/* adresse seule : un chantier à cette adresse, puis le client (un nom tapé, ou « oui » si le client est déjà connu) */
/* message qui n'est qu'une adresse (« 12 rue de la Paix 75002 Paris », « chantier au 5 avenue Foch pour Martin ») : question chantier, pas le chat */
function chAdrSeule(t){try{const R=parseNote(t,db.prices,VN.lang);if(!R.adr||R.travaux.length||R.tel||R.email)return false;
 const w=s=>vnNorm(s).split(/[^\p{L}\d]+/u).filter(Boolean),A=new Set(w(R.adr+' '+(R.client||'')));
 return w(t).filter(x=>!A.has(x)&&!/^(adresse|adress|chantier|nouveau|nouvelle|c|est|l|au|a|le|la|les|du|de|des|d|chez|pour|sur|voici|ici|c'est)$/.test(x)).length===0}catch(e){return false}}
function chAdrAsk(R){const cl=q.client||'';const exist=(db.chantiers||[]).some(c=>c.adr&&vnNorm(c.adr)===vnNorm(R.adr));if(exist)return '';
 CH_ASK={k:'adr',adr:R.adr,tel:R.tel||'',email:R.email||'',client:cl};
 return cl?`<!--ask--><div class="sugg"><p><span>Nouveau chantier à cette adresse pour</span> <b data-noi18n>${esc(cl)}</b> ?</p><div class="msg-act">${chB('<svg class="i"><use href="#i-check"/></svg><span>Oui</span>',"chChantier()")}</div></div><!--/ask-->`
  :`<!--ask--><div class="sugg"><label>Nouveau chantier à cette adresse : pour quel client ?</label><div class="sg-in"><input autocapitalize="words" placeholder="M. Dupont" onkeydown="if(event.key==='Enter')chChantier(this.nextElementSibling)"><button class="btn sm" onclick="chChantier(this)" aria-label="Créer le chantier"><svg class="i"><use href="#i-check"/></svg>OK</button></div></div><!--/ask-->`}
function chChantier(btn){const a=CH_ASK;if(!a||a.k!=='adr')return;let nom=a.client;
 if(btn){const i=btn.closest('.sugg').querySelector('input');if(i){nom=i.value.trim();if(!nom){i.focus();return}}}chChantierGo(nom)}
function chChantierGo(nom){const a=CH_ASK;if(!a||!nom)return;CH_ASK=null;chAsked();ensurePt();const before=JSON.stringify({c:db.clients,ch:db.chantiers});
 const {x,isNew}=upsert('clients',{nom:ctCap(nom),tel:a.tel,email:a.email,adr:a.adr});if(!x.adr)x.adr=a.adr;
 const ch={id:uid().slice(-6),nom:x.nom+' – '+a.adr,adr:a.adr,cid:x.id};db.chantiers.push(ch);
 q.client=x.nom;q.adr=a.adr;if(!q.tel&&x.tel)q.tel=x.tel;fillForm();if(q.lines.length)store();else save();
 chBot(`<p><svg class="i i-sm"><use href="#i-pin"/></svg> <span>Chantier</span> : <b data-noi18n>${esc(ch.nom)}</b></p><p><svg class="i i-sm"><use href="#i-user"/></svg> <span>Client</span> : <b data-noi18n>${esc(x.nom)}</b> <span class="pill-s ${isNew?'new':''}">${isNew?'Nouveau, ajouté à tes clients':'Déjà dans tes clients'}</span></p>`,{chUndo:{back2:before}})}
/* réponse tapée à la question en cours ; sinon la question tombe et la phrase suit son chemin */
function chReponse(t){const a=CH_ASK;if(!a)return false;const n=vnNorm(t);
 if(CH_NON.test(t.trim())){CH_ASK=null;chAsked();CHAT.m.push({who:'me',text:t});chBot(`<p><span>D’accord.</span></p>`);return true}
 const oui=CH_OUI.test(t.trim()),nom=t.trim().split(/\s+/).length<=4&&!/\d/.test(t)&&/^\p{L}/u.test(t.trim())&&!(window.casoPont&&casoPont.pourPro(t));
 if(a.k==='adr'&&(oui&&a.client||nom&&!oui)){CHAT.m.push({who:'me',text:t});chChantierGo(oui?a.client:t.trim());return true}
 if(a.k==='adr'&&oui){CHAT.m.push({who:'me',text:t});chBot(`<p><span>Pour quel client ?</span></p>`);return true}
 if(a.k==='doc'){if(!a.four&&nom&&!oui){CHAT.m.push({who:'me',text:t});chFourSet(t.trim());return true}
  if(a.four&&(oui||/\b(prix|services?)\b/.test(n))){CHAT.m.push({who:'me',text:t});chDoc('prix');return true}
  if(a.four&&/\b(devis|quote|presupuesto|orcamento|preventivo|deviz|kosztorys|teklif|смет\S*)\b/.test(n)){CHAT.m.push({who:'me',text:t});chDoc('devis');return true}}
 if(a.k==='contact'){const f={dataset:{n:a.nom},closest:()=>null};if(/\b(client|cliente|customer|klient|musteri|клиент|عميل)\b/.test(n)){CH_ASK=null;CHAT.m.push({who:'me',text:t});chatAddAs('cli',f);return true}if(/\b(fournisseur|supplier|proveedor|fornecedor|fornitore|furnizor|dostawca|tedarikci|поставщик|مورد)\b/.test(n)){CH_ASK=null;CHAT.m.push({who:'me',text:t});chatAddAs('fou',f);return true}}
 if(a.k==='type'){if(/\b(plan|3d|maquette)\b/.test(n)){CHAT.m.push({who:'me',text:t});chType('plan');return true}if(/\b(fournisseur|facture|ticket|devis|document|supplier|invoice)\b/.test(n)){CHAT.m.push({who:'me',text:t});chType('doc');return true}}
 CH_ASK=null;chAsked();return false}
function chUndoGo(u){if(u.back){const b=JSON.parse(u.back);db.prices=b.p;db.suppliers=b.s;q.lines=b.ql;db.achats=b.a||[];db.hist.length=b.h;fillForm();if(q.lines.length)store();else save();try{renderPrices();renderQuick()}catch(e){}}
 if(u.back2){const b=JSON.parse(u.back2);db.clients=b.c;db.chantiers=b.ch;save()}
 const i=CHAT.m.length-1;if(i>=0&&CHAT.m[i].chUndo)CHAT.m.splice(i,1)}

/* ---------- Écran principal : chat ---------- */
let CHAT={qid:null,m:[]};
function chatLoad(){try{const c=JSON.parse(localStorage.getItem('caso_chat')||'null');if(c&&c.qid)CHAT=c}catch(e){}}
function chatSave(){CHAT.m.forEach((x,i)=>{if(i<CHAT.m.length-1&&x.undo)delete x.undo});try{localStorage.setItem('caso_chat',JSON.stringify({qid:CHAT.qid,m:CHAT.m.slice(-60)}))}catch(e){}}
function chatPush(msg){if(CHAT.qid!==q.id){CHAT={qid:q.id,m:[]}}CHAT.m.push(msg);chatSave();chatRender(true)}
function chatGreet(){const a=accountGet()||{},n=a.prenom||getSync().user||'';
 return{who:'bot',html:`<p>${esc(i18nT('Bonjour {1} !').replace('{1}',n)).replace(' !',n?' !':'!')}</p><p>Dis-moi le client, les travaux et les quantités : je prépare ton devis.</p>`}}
function chatGrow(t){t.style.height='auto';t.style.height=Math.min(t.scrollHeight,140)+'px'}
function chatTop(){const t=totals(q);$('ctNum').textContent=[q.client,q.num].filter(Boolean).join(' · ');$('ctTot').textContent=q.lines.length?eur(t.ttc)+' TTC':'';
 const e=$('ctNum').closest('.ct-q');e.hidden=!q.lines.length&&!q.client;e.parentNode.hidden=e.hidden}
function chatRender(scroll){
 if(CHAT.qid!==q.id){CHAT={qid:q.id,m:[]}}
 const log=$('chatLog');if(!log)return;
 const M=CHAT.m.length?CHAT.m:[chatGreet()];
 const ac=(i,me)=>CHAT.m.length?`<div class="acts${me?' acts-me':''}" data-i="${i}">${chatIc('copier',i)}${me?chatIc('renvoyer',i)+chatIc('modifier',i):''}</div>`:'';
 log.innerHTML=M.map((x,i)=>x.who==='me'?`<div class="msg me" dir="auto" data-noi18n data-i="${i}">${esc(x.text)}</div>${ac(i,1)}${x.orig?`<div class="msg-orig"><span>Tu as écrit</span> <span dir="auto" data-noi18n>« ${esc(x.orig)} »</span></div>`:''}`:`<div class="msg bot" data-i="${i}">${x.html}${x.agUndo&&i===M.length-1?`<button class="lnk" onclick="agUndoLast()"><svg class="i i-sm"><use href="#i-undo"/></svg> Annuler</button>`:''}${x.prUndo&&i===M.length-1?`<button class="lnk" onclick="prUndoLast()"><svg class="i i-sm"><use href="#i-undo"/></svg> Annuler</button>`:''}${x.undo&&i===M.length-1?`<button class="lnk" onclick="chatUndo()"><svg class="i i-sm"><use href="#i-undo"/></svg> Annuler</button>`:''}${x.mUndo&&i===M.length-1&&MULTI_UNDO?`<button class="lnk" onclick="chatMultiUndo()"><svg class="i i-sm"><use href="#i-undo"/></svg> Annuler</button>`:''}${x.pUndo&&i===M.length-1?`<button class="lnk" onclick="chatPontUndo()"><svg class="i i-sm"><use href="#i-undo"/></svg> Annuler</button>`:''}</div>${ac(i,0)}`).join('');
 chatTop();
 if(scroll!==false)requestAnimationFrame(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:scroll===true?'smooth':'auto'}))}
/* ---------- mini icônes des messages ---------- */
const CHAT_IC={copier:'<svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
 renvoyer:'<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>',
 modifier:'<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
 ok:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',non:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>'};
const CHAT_IC_T={copier:'Copier',renvoyer:'Renvoyer',modifier:'Modifier',ok:'Valider',non:'Annuler'};
function chatIcT(k){const t=CHAT_IC_T[k];return window.casoPont&&casoPont.ready?casoPont.tr(t):i18nT(t)}
function chatIc(k,i){const t=esc(chatIcT(k));return `<button type="button" class="ac-b" data-ac="${k}" data-i="${i}" title="${t}" aria-label="${t}" data-noi18n>${CHAT_IC[k]}</button>`}
function chatCopy(t,b){const fin=()=>{if(!b)return;const o=b.innerHTML;b.innerHTML=CHAT_IC.ok;b.classList.add('fait');setTimeout(()=>{b.innerHTML=o;b.classList.remove('fait')},1200)};
 const old=()=>{try{const a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();fin()}catch(e){}};
 try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(fin,old);return}}catch(e){}old()}
/* annuler ce que le chat autonome a écrit (devis préparé, client créé ou complété) */
function chatPontUndo(){const m=CHAT.m[CHAT.m.length-1];if(!m||!m.pUndo)return;if(window.casoPont){casoPont.annuler(m.pUndo);if(casoPont.refuser)casoPont.refuser()}CHAT.m.pop();
 const me=CHAT.m[CHAT.m.length-1];if(me&&me.who==='me')CHAT.m.pop();CHAT.qid=q.id;chatSave();chatRender()}
/* modifier : la dernière demande est corrigée sur place (ce qu'elle avait fait est annulé), une plus ancienne repart en bas */
function chatEdit(i){const el=document.querySelector('#chatLog .msg.me[data-i="'+i+'"]'),m=CHAT.m[i];if(!el||!m||el.isContentEditable)return;
 const bar=el.nextElementSibling&&el.nextElementSibling.classList.contains('acts')?el.nextElementSibling:null;
 el.contentEditable='true';el.classList.add('edit');el.focus();try{const r=document.createRange();r.selectNodeContents(el);const g=getSelection();g.removeAllRanges();g.addRange(r)}catch(e){}
 const kd=ev=>{if(ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();fin(true)}else if(ev.key==='Escape'){ev.preventDefault();fin(false)}};
 const fin=ok=>{el.removeEventListener('keydown',kd);el.contentEditable='false';el.classList.remove('edit');const t=(el.textContent||'').trim();
  if(!ok||!t||t===m.text){chatRender(false);return}
  let last=-1;CHAT.m.forEach((x,k)=>{if(x.who==='me')last=k});
  if(last===i){const b=CHAT.m[i+1];
   if(b&&b===CHAT.m[CHAT.m.length-1]){if(b.agUndo&&typeof agUndoLast==='function')agUndoLast();else if(b.prUndo&&typeof prUndoLast==='function')prUndoLast();else if(b.pUndo)chatPontUndo();else if(b.undo)chatUndo()}
   const j=CHAT.m.indexOf(m);if(j>=0)CHAT.m.splice(j);chatSave();if(window.casoPont)casoPont.corrige=true}
  $('chatIn').value='';chatSend(t)};
 el.addEventListener('keydown',kd);
 if(bar)bar.innerHTML=chatIc('non',i)+chatIc('ok',i),bar.classList.add('on'),bar.onclick=ev=>{const k=ev.target.closest('[data-ac]');if(!k)return;ev.stopPropagation();fin(k.dataset.ac==='ok')}}
document.addEventListener('click',ev=>{const b=ev.target.closest('#chatLog [data-ac]');if(!b||b.closest('.acts.on'))return;const i=+b.dataset.i,m=CHAT.m[i];if(!m)return;
 if(b.dataset.ac==='copier'){const x=document.querySelector('#chatLog .msg[data-i="'+i+'"]')||(b.closest('.acts')&&b.closest('.acts').previousElementSibling);chatCopy(m.who==='me'?m.text:(x?x.innerText:'').trim(),b)}
 else if(b.dataset.ac==='renvoyer')chatSend(m.text);
 else if(b.dataset.ac==='modifier')chatEdit(i)});
function chatNew(){newQuote();CHAT={qid:q.id,m:[]};chatSave();chatRender()}
function chatNonUndo(){const b=CHAT.m[CHAT.m.length-1];if(!b||b.who!=='bot')return false;if(b.mUndo)return chatMultiUndo();if(b.agUndo&&typeof agUndoLast==='function')agUndoLast();else if(b.prUndo&&typeof prUndoLast==='function')prUndoLast();else if(b.pUndo)chatPontUndo();else if(b.undo)chatUndo();else if(b.chUndo)chUndoGo(b.chUndo);else return false;return true}
function chatUndo(){const m=CHAT.m[CHAT.m.length-1];if(!m||!m.undo)return;{const cur=q;q=JSON.parse(m.undo);if(cur.num)q.num=cur.num;if(cur.sign)q.sign=cur.sign;if(cur.status)q.status=cur.status}fillForm();store();CHAT.m.pop();
 const me=CHAT.m[CHAT.m.length-1];if(me&&me.who==='me'){$('chatIn').value=me.text;CHAT.m.pop()}chatSave();chatRender()}
/* plusieurs demandes dans une phrase : chacune suit son chemin dans l'ordre ; le client nommé (ou créé) vaut pour les suivantes ;
   la phrase tapée s'affiche une fois, suivie de la réponse à chaque demande */
let MULTI_UNDO=null;
function chatMulti(t0,parts){const inp=$('chatIn');inp.value='';chatGrow(inp);qkUpdate();
 const C0=CHAT,n0=CHAT.m.length,lg=casoPont.langue(t0),av={db:JSON.stringify(db),q:JSON.stringify(q)};let sujet=null,i=0;chatMulti.busy=1;
 /* une demande après l'autre, avec le temps que la précédente finisse (nouveau devis, écran ouvert…) */
 const suite=()=>{try{let x=parts[i];const ids=new Set((db.clients||[]).map(c=>c.id));if(sujet){const x0=x;x=casoPont.avecClient(x,sujet,lg);/* « envoie-lui », « appelle-le » : le client dont on vient de parler */if(x!==x0||/(^|[\s'’-])(lui|leur|le|la|l)([\s'’-]|$)/i.test(x0))casoPont.sujet(sujet)}
   /* à partir du 2e morceau : une nouvelle demande, pas la réponse à la question du morceau d'avant */
   if(i)try{casoPont.B.S.pending=null;CH_ASK=null}catch(e){}
   chatSend.multi=1;chatSend(x);const nv=(db.clients||[]).filter(c=>!ids.has(c.id));sujet=nv.length?nv[nv.length-1].nom:(casoPont.clientDans(x)||sujet)}catch(e){try{console.error(e)}catch(_){}i=parts.length}
  finally{chatSend.multi=0}
  if(++i<parts.length)return setTimeout(suite,800);setTimeout(fin,500)};
 /* la phrase tapée une fois, puis la réponse à chaque demande ; « non » ou Annuler défait toute la phrase */
 const fin=()=>{chatMulti.busy=0;const add=(CHAT===C0?CHAT.m.slice(n0):CHAT.m).filter(m=>m.who!=='me').map(m=>{const o=Object.assign({},m);['undo','pUndo','agUndo','prUndo','chUndo'].forEach(k=>delete o[k]);return o});
  CHAT.m=(CHAT===C0?C0.m.slice(0,n0):[]).concat([{who:'me',text:t0}],add);
  if(add.length){add[add.length-1].mUndo=1;MULTI_UNDO={i:CHAT.m.length-add.length-1,db:av.db,q:av.q,qid:CHAT.qid}}
  chatSave();chatRender(true)};
 suite()}
function chatMultiUndo(){const m=CHAT.m[CHAT.m.length-1];if(!m||!m.mUndo||!MULTI_UNDO||MULTI_UNDO.qid!==CHAT.qid)return false;
 const o=JSON.parse(MULTI_UNDO.db);Object.keys(db).forEach(k=>{if(!(k in o))delete db[k]});Object.assign(db,o);q=JSON.parse(MULTI_UNDO.q);
 CHAT.m.splice(MULTI_UNDO.i);MULTI_UNDO=null;CHAT.qid=q.id;fillForm();save();try{renderPrices();renderQuick()}catch(e){}chatSave();chatRender();return true}
/* « FONTAINE » tapé en majuscules : Fontaine */
function chatCasse(n){return n&&n===n.toUpperCase()&&/\p{L}{2}/u.test(n)?n.toLowerCase().replace(/(^|[\s'’.-])(\p{L})/gu,(m,a,b)=>a+b.toUpperCase()):n}

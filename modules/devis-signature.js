/* casô · Devis : signature et envoi
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Signature et envoi du devis ---------- */
function SigPad(cv){
 const ctx=cv.getContext('2d');let drawing=false,last=null,n=0,img=null;
 function size(){const r=cv.getBoundingClientRect();if(!r.width)return;const k=window.devicePixelRatio||1;
  const W=Math.round(r.width*k),H=Math.round(r.height*k);if(cv.width===W&&cv.height===H)return;
  const keep=n>0&&cv.width?cv.toDataURL():null;
  cv.width=W;cv.height=H;
  ctx.setTransform(k,0,0,k,0,0);ctx.lineWidth=2.4;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#111';ctx.fillStyle='#111';
  if(keep){n=99;paint(keep)}else{n=0;if(img)paint(img)}}
 function paint(src){const i=new Image();i.onload=()=>{const r=cv.getBoundingClientRect();ctx.drawImage(i,0,0,r.width,r.height);n=99};i.src=src}
 const pt=e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 cv.addEventListener('pointerdown',e=>{if(!cv.width)size();drawing=true;last=pt(e);try{cv.setPointerCapture(e.pointerId)}catch(x){}ctx.beginPath();ctx.arc(last.x,last.y,1.1,0,7);ctx.fill();n++});
 cv.addEventListener('pointermove',e=>{if(!drawing)return;const p=pt(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;n++});
 ['pointerup','pointercancel','pointerleave'].forEach(t=>cv.addEventListener(t,()=>drawing=false));
 return{size,clear(){img=null;ctx.clearRect(0,0,cv.width,cv.height);n=0},empty:()=>n<4,load(src){img=src;ctx.clearRect(0,0,cv.width,cv.height);n=0;if(cv.width)paint(src);else size()},
  png(){const w=Math.min(cv.width,600),o=document.createElement('canvas');o.width=w;o.height=Math.round(cv.height*w/cv.width);const c=o.getContext('2d');
   c.fillStyle='#fff';c.fillRect(0,0,o.width,o.height);c.drawImage(cv,0,0,o.width,o.height);return o.toDataURL('image/png')}}}
let SIG=null;
function sgSigImg(){let v=null;try{v=localStorage.getItem('caso_sig')}catch(e){}return v}
let SIG_USE=null;
function sgPaint(){const saved=sgSigImg(),open=!$('sgPad').hidden;
 $('sgSigned').hidden=open||!SIG_USE;if(SIG_USE)$('sgSigImg').src=SIG_USE;
 $('sgChoice').hidden=open||!!SIG_USE||!saved;if(saved)$('sgSavedImg').src=saved;
 $('sgSignBtn').hidden=open||!!SIG_USE||!!saved}
function sgUseSaved(){SIG_USE=sgSigImg();sgPaint()}
function sgChange(){SIG_USE=null;sgPaint()}
function sgOpenPad(){$('sgPad').hidden=false;sgPaint();setTimeout(()=>{if(SIG){SIG.size();SIG.clear()}},40);
 $('sgPad').scrollIntoView({behavior:'smooth',block:'center'})}
function sgClosePad(){
 if(SIG&&!SIG.empty()){SIG_USE=SIG.png();if(!sgSigImg()){try{localStorage.setItem('caso_sig',SIG_USE)}catch(e){}}}
 $('sgPad').hidden=true;sgPaint()}
function sgReview(){
 const p=$('sgPreview'),b=$('sgRevBtn'),open=p.hidden;p.hidden=!open;b.setAttribute('aria-expanded',open);
 b.querySelector('span').textContent=open?'Masquer le devis':'Revoir le devis';
 if(!open)return;
 {const qq=cvWith(q);if(qq){p.innerHTML=`<div class="cv-mini" data-noi18n lang="fr" dir="ltr">${CVD.html(qq,{prof:db.prof||{},imgs:cvLogo(),noSign:true})}</div>`+(q.cv?'':`<button class="btn sec" onclick="cvStart()"><svg class="i"><use href="#i-blocks"/></svg>Modifier mon modèle</button>`);return}}
 const t=totals(q);
 p.innerHTML=q.lines.map(l=>`<div class="sg-l"><div><b data-noi18n lang="fr">${esc(l.label)}</b>${l.loc&&l.loc!==l.label?`<div class="mut" data-noi18n>${esc(l.loc)}</div>`:''}
   <div class="mut" data-noi18n>${String(l.qty).replace('.',',')} ${esc(l.unit)} × ${eur(l.pu)}</div></div><b>${eur(l.qty*l.pu)}</b></div>`).join('')
  +(q.remise?`<div class="tot"><span>Remise (%)</span><b>${q.remise}</b></div>`:'')
  +`<div class="tot"><span>Total HT</span><b>${eur(t.ht)}</b></div>`
  +(q.franchise?'':Object.keys(t.tv).map(k=>`<div class="tot mut"><span>TVA ${k} %</span><span>${eur(t.tv[k])}</span></div>`).join(''))
  +`<div class="tot big"><span>Total TTC</span><b>${eur(t.ttc)}</b></div>`
  +(q.adr?`<div class="tot mut"><span>Chantier</span><span data-noi18n>${esc(q.adr)}</span></div>`:'')}
function goSign(){
 readForm();
 if(!q.lines.length){toast(i18nT('Ajoute au moins une ligne.'));if(!$('s-chat').classList.contains('on'))go('devis');const c=$('chatIn');if(c)c.focus();return}
 {const pv=db.quotes.find(x=>x.id===q.id);if(pv&&pv.sign&&pv.sign.st==='signed'){toast(i18nT('Ce devis est déjà signé par le client.'));go('histo');return}}
 const t=totals(q);
 $('sgRecap').innerHTML=(q.client?`<div class="tot"><span>Client</span><b data-noi18n>${esc(q.client)}</b></div>`:`<label for="sgCli">Nom du client</label><input id="sgCli" autocapitalize="words" placeholder="M. Dupont" oninput="this.removeAttribute('aria-invalid')">`)+`
<div class="tot"><span>Total TTC</span><b>${eur(t.ttc)}</b></div>`;
 $('sentBox').hidden=true;$('sgCard').hidden=false;$('sgPreview').hidden=true;$('sgRevBtn').setAttribute('aria-expanded','false');
 $('sgRevBtn').querySelector('span').textContent='Revoir le devis';
 $('sgPad').hidden=true;SIG_USE=null;sgPaint();
 go('sign')}
function sigInit(){const cv=$('sigPad');if(!cv||SIG)return;SIG=SigPad(cv);let saved=null;try{saved=localStorage.getItem('caso_sig')}catch(e){}
 const go=()=>{if($('sgPad').hidden)return;SIG.size()};
 if(window.ResizeObserver){let w=0;new ResizeObserver(()=>{const r=cv.getBoundingClientRect().width;if(r&&r!==w){w=r;go()}}).observe(cv)}else setTimeout(go,300)}
function sigClear(){if(SIG)SIG.clear()}
function quoteDoc(o){if(o&&o!==q){const s0=q;q=o;try{return quoteDoc()}finally{q=s0}}
 const p=db.prof||{};
 return{quote:{id:q.id,num:q.num,date:q.date,client:q.client,tel:q.tel,adr:q.adr,remise:q.remise,acompte:q.acompte,franchise:q.franchise,
  lines:q.lines.map(l=>({label:l.label,qty:l.qty,unit:l.unit,pu:l.pu,tva:l.tva})),cv:cvWith(q)?cvDocOf(cvWith(q)):undefined},
  prof:{nom:p.nom,adr:p.adr,siret:p.siret,tel:p.tel,email:p.email||(accountGet()||{}).email,assur:p.assur,valid:p.valid,forme:p.forme,rm:p.rm,tvai:p.tvai}}}
async function signSend(){
 {const f=$('sgCli');if(f){const v=f.value.trim();if(!v){f.setAttribute('aria-invalid','true');f.focus();toast(i18nT('Indique le nom du client.'));return}$('cNom').value=v}}
 readForm();
 if(!q.lines.length){toast(i18nT('Ajoute au moins une ligne.'));return}
 if(!q.client){toast(i18nT('Indique le nom du client.'));return}
 if(!$('sgPad').hidden)sgClosePad();
 if(!SIG_USE){toast(i18nT('Signe d\'abord le devis.'));if(!sgSigImg())sgOpenPad();return}
 const c=getSync();
 if(!c.url||!c.token){alert('Pour envoyer un lien au client, connecte casô au service en ligne (Compte › Équipe).');return}
 {const pv=db.quotes.find(x=>x.id===q.id);if(pv&&pv.sign&&pv.sign.st==='signed'){alert('Ce devis est déjà signé par le client.');return}
  if(pv&&pv.sign&&pv.sign.st==='sent'&&!confirm('Ce devis a déjà été envoyé. Le renvoyer remplacera l\'ancien lien.'))return}
 const img=SIG_USE;
 const b=$('sigGo');b.disabled=true;b.textContent='Envoi…';
 try{
  const cur=q;if(!(cur.cv&&cur.cv.blocks)&&cvModel())cur.cv=cvFreeze(cur);cur.proSig=img;
  if(!store())return;await syncNow();
  // deux téléphones hors ligne ont pu donner le même numéro : on le change avant qu'il parte chez le client
  if(db.quotes.some(x=>x.id!==cur.id&&x.num===cur.num)){cur.num='';storeQ(cur)}
  try{upsert('clients',{nom:cur.client,tel:cur.tel,adr:cur.adr})}catch(e){}
  const j=await apiTeam('/api/sign/new',{doc:quoteDoc(cur),img,name:(accountGet()||{}).prenom||c.user||''});
  cur.sign={token:j.token,url:j.url,st:'sent',sentAt:Date.now()};if(cur.status!=='accepte')cur.status='envoye';storeQ(cur);syncSoon();
  showSent(j.url);
  setTimeout(askNotif,1500);
 }catch(e){if(e.module&&typeof aboAjouter==='function'){aboAjouter(e.module);return}/* le serveur dit que l'abonnement ne le permet pas */
  alert('Erreur d\'envoi : '+(e.message||e))}
 finally{b.disabled=false;b.textContent='Valider et envoyer'}}
let sentMsg='',sentUrl='';
function showSent(url){
 sentUrl=url;const p=db.prof||{};
 sentMsg='Bonjour'+(q.client?' '+q.client:'')+', voici votre devis n° '+q.num+(p.nom?' de '+p.nom:'')+'. Vous pouvez le lire et le signer ici : '+url;
 const tel=(q.tel||'').replace(/[^\d+]/g,''),intl=tel.startsWith('+')?tel.slice(1):tel.startsWith('0')?'33'+tel.slice(1):tel;
 const ios=/iP(hone|ad|od)/.test(navigator.userAgent);
 $('sentUrl').textContent=url;
 $('sentSms').href='sms:'+tel+(ios?'&':'?')+'body='+encodeURIComponent(sentMsg);
 $('sentWa').href='https://wa.me/'+(intl||'')+'?text='+encodeURIComponent(sentMsg);
 $('sentMail').href='mailto:?subject='+encodeURIComponent('Devis n° '+q.num+(p.nom?' – '+p.nom:''))+'&body='+encodeURIComponent(sentMsg);
 /* la carte prête : Envoyer par e-mail (un appui), Copier le message, Partager */
 try{const c=envDevis(q);$('sentEnv').innerHTML=envCarte(c);envMailUI(c.id)}catch(e){}
 $('sgCard').hidden=true;$('sentBox').hidden=false;window.scrollTo(0,0)}
function sheetOpen(){$('sheetBg').hidden=false;$('sheet').hidden=false;requestAnimationFrame(()=>{$('sheet').classList.add('on');$('sheetBg').classList.add('on')})}
function sheetClose(){$('sheet').classList.remove('on');$('sheetBg').classList.remove('on');setTimeout(()=>{$('sheet').hidden=true;$('sheetBg').hidden=true},200)}
function sendVia(c){
 try{localStorage.setItem('caso_chan',c)}catch(e){}
 if(c==='copy'){sentCopy();sheetClose();return}
 if(c==='share'){if(navigator.share)navigator.share({title:'Devis '+q.num,text:sentMsg}).catch(()=>{});else sentCopy();sheetClose();return}
 const a=$(c==='sms'?'sentSms':c==='wa'?'sentWa':'sentMail');sheetClose();if(a&&a.href)location.href=a.href}
function sentCopy(){(navigator.clipboard?navigator.clipboard.writeText(sentMsg):Promise.reject()).then(()=>toast(i18nT('Lien copié.')),()=>prompt('Copie ce lien :',sentMsg))}

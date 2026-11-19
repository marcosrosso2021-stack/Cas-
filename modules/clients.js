/* casô · Clients : fiches, mesures, noms
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Clients et fournisseurs ---------- */
const nameKey=n=>vnNorm(String(n||'').replace(/^(m\.|mme|mlle|monsieur|madame|mr|mrs)\s+/i,''));
function findBy(list,n){const k=nameKey(n);return k?list.find(x=>nameKey(x.nom)===k):null}
function upsert(kind,o){
 const list=db[kind];let x=findBy(list,o.nom),isNew=false;
 if(!x){x={id:uid(),nom:o.nom.trim(),tel:'',email:'',adr:'',note:''};list.push(x);isNew=true}
 ['tel','email','adr'].forEach(k=>{if(o[k]&&!x[k])x[k]=o[k]});
 return{x,isNew}}
function syncSuppliersFromPrices(){
 const n=new Set([...db.prices.map(p=>p.four),...(db.hist||[]).map(h=>h.four)].filter(Boolean));
 let ch=false;n.forEach(f=>{if(!findBy(db.suppliers,f)){db.suppliers.push({id:uid(),nom:f,tel:'',email:'',adr:'',note:''});ch=true}});if(ch)save()}
let cliCur=null;
function listHtml(list,q,sub){
 const k=vnNorm(q||'');
 const L=list.filter(x=>!k||vnNorm(x.nom+' '+(x.tel||'')+' '+(x.adr||'')).includes(k)).sort((a,b)=>a.nom.localeCompare(b.nom));
 return L.map(x=>`<button class="it it-main" data-sw="${sub}:${x.id}" onclick="${sub}Edit('${x.id}')"><span class="it-t"><b data-noi18n>${esc(x.nom)}</b><svg class="i dw-c i-flip"><use href="#i-chev"/></svg></span>
  ${x.tel||x.adr?`<span class="mut it-s" data-noi18n>${esc([x.tel,x.adr].filter(Boolean).join(' · '))}</span>`:''}</button>`).join('')||'<div class="lst-empty mut">Aucun résultat.</div>'}
function cliRender(){$('cliList').innerHTML=listHtml(db.clients,$('cliQ').value,'cli')}
function formFill(sid,x,title){
 $(sid+'FT').textContent=title;
 ['Nom','Tel','Mail','Adr','Note'].forEach(f=>{$(sid+f).value=x?(x[{Nom:'nom',Tel:'tel',Mail:'email',Adr:'adr',Note:'note'}[f]]||''):''});
 $(sid+'Del').hidden=!x}
function formRead(sid,x){x.nom=ctCap($(sid+'Nom').value);x.tel=ctTel($(sid+'Tel').value.trim());x.email=$(sid+'Mail').value.trim();x.adr=$(sid+'Adr').value.trim();x.note=$(sid+'Note').value.trim()}
function cliEdit(id){
 cliCur=id?db.clients.find(x=>x.id===id):null;formFill('cli',cliCur,cliCur?cliCur.nom:'Nouveau client');
 CF_K='cli';$('cfPasteBox').hidden=true;cfStatus('');$('cfPick').hidden=!(navigator.contacts&&navigator.contacts.select);$('cliActs').innerHTML=cliCur?cfActs(cliCur):'';$('cfBar').hidden=!!(cliCur&&cliCur.tel&&cliCur.adr&&cliCur.email);
 const Q=cliCur?db.quotes.filter(q=>nameKey(q.client)===nameKey(cliCur.nom)):[];
 $('cliMore').innerHTML=cliCur?`<button class="btn sec" onclick="cliQuote()"><svg class="i"><use href="#i-plus"/></svg>Nouveau devis pour ce client</button><button class="btn sec" onclick="cliEspace()"><svg class="i"><use href="#i-user"/></svg>${esc(i18nT('Espace client'))}</button><div id="cliEsp"></div>`+
  (Q.length?`<h2 class="grp"><span>Devis</span><span class="cnt">${Q.length}</span></h2><div class="lst">`+Q.map(x=>`<button class="it it-main" onclick="openQ('${x.id}')"><span class="it-t"><b data-noi18n>${esc(x.num||'')}</b><span class="tag ${x.status}">${ST[x.status]||''}</span></span><span class="mut it-s">${dFR(x.date)} · ${eur(totals(x).ttc)}</span></button>`).join('')+'</div>':''):'';
 go('clif')}
function cliSave(){
 const n=$('cliNom').value.trim();if(!n){alert('Écris le nom.');return}
 if(!cliCur){const dup=findBy(db.clients,n);cliCur=dup||{id:uid()};if(!dup)db.clients.push(cliCur)}
 formRead('cli',cliCur);save();toast(i18nT('Enregistré.'));go('cli')}
function cliDelete(){if(!cliCur||!confirm('Supprimer ce client ?'))return;db.clients=db.clients.filter(x=>x!==cliCur);save();go('cli')}
function cliQuote(){chatNew();q.client=cliCur.nom;q.tel=cliCur.tel||'';q.adr=cliCur.adr||'';fillForm();chatPush({who:'bot',html:`<p><svg class="i i-sm"><use href="#i-user"/></svg> <span>Client</span> : <b data-noi18n>${esc(cliCur.nom)}</b></p><p class="mut">Écris ou dicte les travaux pour ce client.</p>`});go('devis')}
/* ---------- Fiches client / fournisseur : moins de saisie ---------- */
/* lecture d'une photo (OCR) sur le téléphone : module gratuit chargé la première fois (internet), puis gardé */
const OCR_V={js:'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js',worker:'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',core:'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1',lang:'https://cdn.jsdelivr.net/npm/@tesseract.js-data/fra@1.0.0/4.0.0_best_int'};
async function ocrRun(src,prog,psm){
 await loadScript(OCR_V.js);
 const w=await Tesseract.createWorker('fra',1,{workerPath:OCR_V.worker,corePath:OCR_V.core,langPath:OCR_V.lang,logger:m=>{if(prog&&m.status==='recognizing text')prog(Math.round((m.progress||0)*100))}});
 try{await w.setParameters({tessedit_pageseg_mode:String(psm||'6'),preserve_interword_spaces:'1'});const res=await w.recognize(src);return{words:res.data.words||[],text:res.data.text||''}}
 finally{try{await w.terminate()}catch(e){}}}
/* coordonnées dans un texte libre (SMS, e-mail, signature, carte de visite, vCard) */
function ctTel(v){let d=String(v||'').replace(/[^\d+]/g,'');if(d.startsWith('00'))d='+'+d.slice(2);
 if(/^\+33\d{9}$/.test(d))d='0'+d.slice(3);
 if(/^0\d{9}$/.test(d))return d.replace(/(\d{2})(?=\d)/g,'$1 ');
 if(/^\+\d{8,15}$/.test(d))return d.replace(/^(\+\d{2,3})(\d)/,'$1 $2');return String(v||'').trim()}
function ctCap(v){v=String(v||'').trim().replace(/\s+/g,' ');return v&&v===v.toLowerCase()?v.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu,(m,a,b)=>a+b.toUpperCase()):v}
const CT_ST=/\b(rue|r\.|avenue|av\.?|boulevard|bd|chemin|ch\.|impasse|imp\.|place|pl\.|all[ée]e|route|rte|quai|cours|lotissement|lot\.|lieu[- ]dit|r[ée]sidence|hameau|square|sentier|voie|parc|zone|za|zi|zac|cit[ée]|faubourg|passage|mont[ée]e|traverse)\b/i;
function ctParse(txt){
 const o={nom:'',tel:'',email:'',adr:''};let T=String(txt||'').replace(/\r/g,'');
 if(/BEGIN:VCARD/i.test(T)){const g=k=>{const m=T.match(new RegExp('^'+k+'[^:\\n]*:(.*)$','im'));return m?m[1].trim():''};
  o.nom=g('FN')||g('N').split(';').filter(Boolean).reverse().join(' ');o.tel=ctTel(g('TEL'));o.email=g('EMAIL').toLowerCase();
  const a=g('ADR').split(';');if(a.length>=6)o.adr=[a[2],[a[5],a[3]].filter(Boolean).join(' ')].filter(Boolean).join(', ');return o}
 const em=T.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/);if(em){o.email=em[0].toLowerCase();T=T.replace(em[0],' ')}
 const tm=T.match(/(?:\+|00)\s?\d{2,3}[\s.\-()]*\d(?:[\s.\-]?\d{1,2}){4,5}|\b0\s?[1-9](?:[\s.\-]?\d{2}){4}\b/);if(tm){o.tel=ctTel(tm[0]);T=T.replace(tm[0],' ')}
 let L=T.split(/\n|\s{3,}|\s[|•·]\s/).map(x=>x.replace(/^\s*(?:t[ée]l(?:[ée]phone)?|portable|mobile|gsm|fixe|e-?mail|courriel|mail|adresse|adr|nom|client|soci[ée]t[ée]|entreprise)\s*\.?\s*:?\s*/i,'').replace(/[;,\s]+$/,'').trim()).filter(x=>x&&!/^https?:|^www\./i.test(x));
 // adresse : ligne de rue (+ ligne « code postal ville » qui suit), ou « code postal ville » seule
 const cpRe=/\b((?:0[1-9]|[1-8]\d|9[0-8]|2[ab])\d{3})\s+(\p{L}[\p{L}' -]{1,40})/iu;
 let si=L.findIndex(x=>/^\d{1,4}\s*(?:bis|ter|b)?\s*,?\s*/i.test(x)&&CT_ST.test(x)),ci=L.findIndex(x=>cpRe.test(x));
 if(si<0)si=L.findIndex(x=>CT_ST.test(x)&&/\d/.test(x)&&x.length<70);
 if(si>=0){let a=L[si];const m=a.match(cpRe);if(!m&&ci>=0&&ci!==si){a+=', '+L[ci].match(cpRe)[0]}else if(m)a=a.replace(/\s+(?=\d{5}\b)/,', ');
  o.adr=a.replace(/\s+/g,' ').replace(/,\s*,/g,',').trim();L=L.filter((x,i)=>i!==si&&!(ci!==si&&i===ci&&!m))}
 else if(ci>=0){o.adr=L[ci].match(cpRe)[0].trim();L=L.filter((x,i)=>i!==ci)}
 if(o.adr)o.adr=o.adr.replace(/(\d{5}\s+)(\p{L}[\p{L}' -]*)$/u,(m,a,b)=>a+ctCap(b));
 // nom : civilité d'abord, sinon première ligne faite seulement de lettres (2 à 5 mots)
 const civ=L.find(x=>/^(m\.|mr|mme|mlle|monsieur|madame|mademoiselle|sci|sarl|sas|eurl)\s+\p{L}/iu.test(x))||((T.match(/\b(?:M\.|Mr|Mme|Mlle|Monsieur|Madame|Mademoiselle)\s+\p{Lu}[\p{L}'’-]+(?:\s+\p{Lu}[\p{L}'’-]+)?/u)||[])[0]);
 const nm=civ||L.find(x=>/^[\p{L}][\p{L}'’.\- ]{1,48}$/u.test(x)&&x.split(/\s+/).length<=5&&!/^(bonjour|salut|merci|cordialement|bien|bonne|voici|ci-joint|envoy[ée]|de\s*:|le\s)/i.test(x));
 if(nm)o.nom=ctCap(nm.replace(/^(monsieur|mr)\s+/i,'M. ').replace(/^madame\s+/i,'Mme ').replace(/^mademoiselle\s+/i,'Mlle '));
 if(o.adr)o.adr=o.adr.replace(/^(\d+)\s*,\s*/,'$1 ');
 if(o.adr)o.adr=o.adr.replace(/\s+(?:date|t[ée]l|fax|n[°º]|page|siret|e-?mail|facture|devis|client)\b.*$/i,'').replace(/[\s:;,\-–—]+$/,'');
 return o}
let CF_K='cli';
function cfSet(k,o,quiet){CF_K=k;const F={nom:'Nom',tel:'Tel',email:'Mail',adr:'Adr'};let n=0;
 Object.keys(F).forEach(f=>{const el=$(k+F[f]);if(el&&o[f]&&!el.value.trim()){el.value=o[f];n++;el.classList.add('cf-new');setTimeout(()=>el.classList.remove('cf-new'),1600)}});
 cfStatus(n?i18nT('Fiche remplie : vérifie puis enregistre.'):i18nT('Aucune coordonnée trouvée.'));return n}
function cfStatus(t){const e=$('cfSt');if(!e)return;e.textContent=t||'';e.hidden=!t}
async function cfPaste(k){CF_K=k;let t='';
 try{if(navigator.clipboard&&navigator.clipboard.readText)t=await navigator.clipboard.readText()}catch(e){}
 const o=ctParse(t);
 if(t&&(o.tel||o.email||o.adr)){cfSet(k,o);return}
 $('cfPasteBox').hidden=false;$('cfPasteT').value='';$('cfPasteT').focus();cfStatus('')}
function cfPasteGo(){const t=$('cfPasteT').value;if(!t.trim())return;cfSet(CF_K,ctParse(t));$('cfPasteBox').hidden=true}
function cfCam(k){CF_K=k;$('cfCam').click()}
async function cfPhoto(inp){const f=inp.files[0];if(!f)return;inp.value='';
 cfStatus(i18nT('Lecture de la photo…'));
 try{const d=await loadImgData(f,1800,true);const r=await ocrRun(d,pc=>cfStatus(i18nT('Lecture de la photo…')+' '+pc+' %'),'3');cfSet(CF_K,ctParse(r.text))}
 catch(e){cfStatus(e&&e.message&&/connexion/.test(e.message)?e.message:i18nT('Photo illisible. Essaie plus près, avec plus de lumière.'))}}
async function cfContacts(k){if(!(navigator.contacts&&navigator.contacts.select))return;
 try{const props=await navigator.contacts.getProperties().catch(()=>['name','tel','email']);
  const [c]=await navigator.contacts.select(props.filter(x=>['name','tel','email','address'].includes(x)),{multiple:false});if(!c)return;
  const a=(c.address||[])[0];cfSet(k,{nom:(c.name||[])[0]||'',tel:ctTel((c.tel||[])[0]||''),email:((c.email||[])[0]||'').toLowerCase(),adr:a?[(a.addressLine||[]).join(' '),[a.postalCode,a.city].filter(Boolean).join(' ')].filter(Boolean).join(', '):''})}catch(e){}}
function cfTelFix(el){const v=el.value.trim();if(v)el.value=ctTel(v)}
function cfNameFix(el){const v=el.value.trim();if(v)el.value=ctCap(v)}
/* adresses proposées pendant la frappe (Base Adresse Nationale, service gratuit de l'État ; seulement avec internet) */
const ADR={t:0,ctl:null,el:null};
function adrBox(el){let b=el._adr;if(!b||!b.isConnected){b=document.createElement('div');b.className='adr-sug';b.hidden=true;b.setAttribute('role','listbox');b.setAttribute('data-noi18n','');const r=el.parentElement&&el.parentElement.classList.contains('row')?el.parentElement:el;r.after(b);el._adr=b}return b}
function adrHide(el){const b=el&&el._adr;if(b)b.hidden=true}
function adrInput(el){clearTimeout(ADR.t);const v=el.value.trim();
 if(v.length<5||!/\p{L}{3}/u.test(v)||navigator.onLine===false){adrHide(el);return}
 ADR.t=setTimeout(async()=>{try{if(ADR.ctl)ADR.ctl.abort();ADR.ctl=new AbortController();
  const r=await fetch('https://data.geopf.fr/geocodage/search?autocomplete=1&limit=4&q='+encodeURIComponent(v),{signal:ADR.ctl.signal});
  if(!r.ok)return;const j=await r.json();const L=[...new Set((j.features||[]).map(f=>f.properties&&f.properties.label).filter(Boolean))];
  if(el.value.trim()!==v||document.activeElement!==el)return;
  const b=adrBox(el);if(!L.length||L.length===1&&L[0].toLowerCase()===v.toLowerCase()){b.hidden=true;return}
  b.innerHTML=L.map(x=>`<button type="button" role="option"><svg class="i i-sm"><use href="#i-pin"/></svg><span>${esc(x)}</span></button>`).join('');
  b.querySelectorAll('button').forEach((x,i)=>x.addEventListener('pointerdown',ev=>{ev.preventDefault();el.value=L[i];b.hidden=true;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));adrHide(el)}));
  b.hidden=false}catch(e){}},350)}
document.addEventListener('input',e=>{const el=e.target;if(el&&el.matches&&el.matches('input[data-adr]')&&e.isTrusted)adrInput(el)});
document.addEventListener('focusout',e=>{const el=e.target;if(el&&el.matches&&el.matches('input[data-adr]'))setTimeout(()=>adrHide(el),150)});
/* actions rapides d'une fiche : appeler, SMS, e-mail, itinéraire */
function cfActs(x){if(!x)return'';const A=[];
 if(x.tel){const d=x.tel.replace(/[^\d+]/g,'');A.push(`<a href="tel:${esc(d)}"><svg class="i"><use href="#i-phone"/></svg><span>Appeler</span></a>`,`<a href="sms:${esc(d)}"><svg class="i"><use href="#i-sms"/></svg><span>SMS</span></a>`)}
 if(x.email)A.push(`<a href="mailto:${esc(x.email)}"><svg class="i"><use href="#i-mail"/></svg><span>E-mail</span></a>`);
 if(x.adr){const ios=/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)&&'ontouchend' in document;
  A.push(`<a href="${ios?'https://maps.apple.com/?daddr=':'https://www.google.com/maps/dir/?api=1&destination='}${encodeURIComponent(x.adr)}" target="_blank" rel="noopener"><svg class="i"><use href="#i-pin"/></svg><span>Itinéraire</span></a>`)}
 return A.length?`<div class="cf-act">${A.join('')}</div>`:''}

/* ---------- Barre des mesures ---------- */
const QK_W={fr:['de largeur','de hauteur','heures'],pt:['de largura','de altura','horas'],es:['de ancho','de alto','horas'],it:['di larghezza','di altezza','ore'],ro:['lățime','înălțime','ore'],tr:['genişlik','yükseklik','saat'],pl:['szerokości','wysokości','godzin'],en:['wide','high','hours'],ar:['عرض','ارتفاع','ساعات'],ru:['ширина','высота','часов']};
function qkNum(){const m=($('chatIn').value||'').match(/(\d+(?:[.,]\d+)?)\s*$/);return m?m[1]:null}
function qkUpdate(){const n=qkNum(),b=$('qk');if(!b)return;b.classList.toggle('live',!!n);
 b.querySelectorAll('.qk-n').forEach(x=>{const u=x.parentNode.dataset.u;x.textContent=n?(u==='w'||u==='h'?' '+n+' m':n+' '):''})}
function qkApply(u){
 const inp=$('chatIn'),v=inp.value,n=qkNum(),W=QK_W[I18N.lang]||QK_W.fr,M=I18N.lang==='ru'?'м':I18N.lang==='ar'?'متر':'m';
 const f={m2:x=>x+' m²',m:x=>x+' '+M,w:x=>x+' '+M+' '+W[0],h:x=>x+' '+M+' '+W[1],hr:x=>x+' '+W[2]}[u];
 if(n)inp.value=v.replace(/(\d+(?:[.,]\d+)?)\s*$/,f(n))+' ';
 else inp.value=(v&&!/\s$/.test(v)?v+' ':v)+f('').trim()+' ';
 chatGrow(inp);qkUpdate();inp.focus();try{inp.setSelectionRange(inp.value.length,inp.value.length)}catch(e){}}

/* ---------- Noms : client ou fournisseur ? ---------- */
let KW=null;
function chatKnown(){
 if(KW)return KW;KW=new Set();
 const add=x=>vnNorm(x).split(/[^\p{L}0-9]+/u).forEach(w=>{if(w)KW.add(w)});
 Object.values(VL).forEach(L=>{L.map.forEach((v,k)=>{add(k);add(v)});L.stopSet.forEach(w=>KW.add(w))});
 VN_STOP.forEach(w=>KW.add(w));
 ('bonjour salut merci oui non ok voila alors donc aussi ensuite puis apres avant demain aujourd hier lundi mardi mercredi jeudi vendredi samedi dimanche '+
  'client cliente chez pour monsieur madame rue avenue boulevard chemin place impasse allee route fournisseur devis attention remarque note faut '+
  'metres metre carres carre heures heure jours jour largeur hauteur longueur surface total prix euros euro tva ht ttc forfait caso note '+
  'ola hola ciao buna merhaba czesc hello hi привет مرحبا السلام').split(' ').forEach(w=>KW.add(vnNorm(w)));
 return KW}
function knownWord(w){const n=vnNorm(w);return n.length<3||/\d/.test(n)||chatKnown().has(n)||chatKnown().has(n.replace(/s$/,''))||
 db.prices.some(p=>vnTok(p.nom).includes(n.replace(/(s|x)$/,'')))}
const NC_VERB=new Set(['book','reserva','reservame','prenota','prenotami','rezerva','zarezerwuj','забронируй','зарезервируй','запиши','احجز','ayir','put','add','make','schedule','pon','metti','pune','dodaj','добавь','reserve','reserver','mets','met','mettre','ajoute','ajouter','fais','faire','prepare','preparer','cree','creer','note','noter','trouve','trouver','cherche','chercher','bloque','bloquer','prends','prendre','cale','caler','envoie','envoyer','annule','annuler','supprime','supprimer','change','changer','modifie','modifier','deplace','deplacer','decale','decaler','rappelle','rappeler','appelle','appeler','facture','facturer','planifie','planifier','garde','fixe','enregistre','enregistrer','refais','remets','oublie','pose','poser','demande','devis','rdv','rendez-vous','bonjour','salut','merci','ok','oui','non','stp','svp']);
function nameCand(t,R){
 const words=t.replace(/[.,;:!?()«»"]/g,' ').split(/\s+/).filter(Boolean);
 if(!words.length)return null;
 {const m=/(?:^|\s)(?:chez|client|cliente|pour)\s+((?:M\.|Mme|Mlle|Monsieur|Madame)\s+)?(\p{Lu}[\p{L}'-]+(?:\s+\p{Lu}[\p{L}'-]+)?)/u.exec(t.replace(/[.,;:!?()«»"]/g,' '));
  if(m&&!knownWord(m[2].split(/\s+/)[0])&&!NC_VERB.has(vnNorm(m[2].split(/\s+/)[0])))return m[2]}
 const adrN=vnNorm((R.adr||'')+' '+(R.objet||''));
 // message court, sans chiffre, rien d'autre de reconnu : c'est sûrement un nom
 // un nom s'écrit avec des majuscules : « blabla truc » n'en est pas un
 if(!R.travaux.length&&!(R.suppliers||[]).length&&!R.adr&&!/\d/.test(t)&&words.length<=3&&words.some(w=>!knownWord(w))&&words.filter(w=>!VN_STOP.has(vnNorm(w))).every(w=>/^\p{Lu}/u.test(w)))
  return words.filter(w=>!VN_STOP.has(vnNorm(w))&&!NC_VERB.has(vnNorm(w))).map(w=>vnCap(w)).join(' ')||null;
 let best=[];
 for(let i=0;i<words.length;i++){
  const w=words[i],n=vnNorm(w),prev=vnNorm(words[i-1]||'');
  if(!/^\p{Lu}/u.test(w)||NC_VERB.has(n)||knownWord(w)||adrN.includes(n)||/^(a|à|en|sur|vers|de)$/.test(prev))continue;
  const seq=[w];while(i+1<words.length&&/^\p{Lu}/u.test(words[i+1])&&!knownWord(words[i+1]))seq.push(words[++i]);
  if(seq.length>best.length)best=seq}
 return best.length?best.join(' '):null}
function knownClient(t){const n=' '+vnNorm(t).replace(/[^\p{L}0-9]+/gu,' ')+' ';
 return db.clients.find(c=>{const k=nameKey(c.nom);return k.length>2&&n.includes(' '+k+' ')})}
/* clients qui correspondent à un nom tapé : même nom, ou nom contenu (« Clément » → Clément Dupont, Clément Roy…) */
function cliMatches(nom){const k=nameKey(nom);if(!k||k.length<2)return[];const ws=k.split(' ').filter(w=>w.length>1);
 const ex=db.clients.filter(c=>nameKey(c.nom)===k);
 const pa=ws.length?db.clients.filter(c=>{const ck=nameKey(c.nom);return ck!==k&&ws.every(w=>(' '+ck+' ').includes(' '+w+' '))}):[];
 const R=ex.concat(pa);if(R.length||typeof fzD!=='function')return R;
 const tok=w=>{const f=fzF(w);return{f,mx:f.length<4?0:f.length<8?1:2}},Q=ws.map(tok);if(!Q.some(x=>x.mx))return R;
 const fz=db.clients.filter(c=>{const C=nameKey(c.nom).split(' ').filter(w=>w.length>1).map(w=>fzF(w));
  return Q.every(x=>C.some(y=>y===x.f||(x.mx&&fzD(x.f,y,x.mx)<=x.mx)))});
 fz.fz=true;return fz}
function cliSub(c){return [c.adr,c.tel].filter(Boolean).join(' · ')}
function cliPickHtml(nom,M,ctx){
 return `<!--sg--><div class="sugg cli-pick"><p><svg class="i i-sm"><use href="#i-users"/></svg> ${M.fz?`<span>Tu parles de ce client ?</span> « <b data-noi18n>${esc(nom)}</b> »`:`<span>Plusieurs clients correspondent à</span> « <b data-noi18n>${esc(nom)}</b> ». <span>Lequel ?</span>`}</p><div class="cli-pl">`+
  M.slice(0,8).map(c=>`<button class="cli-po" onclick="cliPick('${c.id}','${ctx}')"><svg class="i"><use href="#i-user"/></svg><span><b data-noi18n>${esc(c.nom)}</b>${cliSub(c)?`<small data-noi18n>${esc(cliSub(c))}</small>`:''}</span></button>`).join('')+
  `<button class="cli-po cli-new" data-n="${esc(nom)}" onclick="cliNew(this,'${ctx}')"><svg class="i"><use href="#i-plus"/></svg><span><b>Nouveau client</b><small data-noi18n>${esc(nom)}</small></span></button></div></div><!--/sg-->`}
function cliSgOff(){const last=[...CHAT.m].reverse().find(m=>m.who==='bot'&&m.html&&m.html.includes('<!--sg-->'));
 if(last)last.html=last.html.replace(/<!--sg-->[\s\S]*?<!--\/sg-->/,'')}
function cliUse(x,isNew,ctx){
 cliSgOff();
 const line=`<p><svg class="i i-sm"><use href="#i-user"/></svg> <span>Client</span> : <b data-noi18n>${esc(x.nom)}</b> <span class="pill-s ${isNew?'new':''}">${isNew?'Nouveau, ajouté à tes clients':'Déjà dans tes clients'}</span></p>`;
 if(String(ctx).startsWith('ev:')){const ev=db.events.find(e=>e.id===ctx.slice(3));
  if(ev){ev.cid=x.id;if(!ev.adr&&x.adr)ev.adr=x.adr}save();
  CHAT.m.push({who:'bot',html:line+agAskQuote(x,ev)});chatSave();chatRender(true);
  if(typeof agRender==='function'&&$('s-agenda')&&$('s-agenda').classList.contains('on'))agRender();return}
 q.client=x.nom;if(!q.tel&&x.tel)q.tel=x.tel;if(!q.adr&&x.adr)q.adr=x.adr;if(!x.adr&&q.adr)x.adr=q.adr;fillForm();if(q.lines.length)store();else save();
 CHAT.m.push({who:'bot',html:line});chatSave();chatRender(true)}
function cliPick(id,ctx){const x=db.clients.find(c=>c.id===id);if(x)cliUse(x,false,ctx)}
function cliNew(btn,ctx){const nom=(btn.dataset.n||'').trim();if(!nom)return;
 const x={id:uid(),nom,tel:'',email:'',adr:'',note:''};db.clients.push(x);cliUse(x,true,ctx)}
function agAskQuote(cl,ev){
 return `<div class="ag-ask"><div class="msg-act"><button class="btn sm" onclick="agQuote('${cl.id}','${ev?ev.id:''}')"><svg class="i"><use href="#i-quote"/></svg>Préparer le devis</button>${ev?`<button class="btn sm sec" onclick="agOpen('${ev.d}')"><svg class="i"><use href="#i-cal"/></svg>Voir dans Mon planning</button>`:''}</div></div>`}
let CH_PEND=null;
function chatAddAs(kind,btn){
 const box=btn.closest('.sugg');let name=(btn.dataset.n||'').trim();
 if(!name){const i=box&&box.querySelector('input');name=i?i.value.trim():'';if(!name){i&&i.focus();return}}
 const {x,isNew}=upsert(kind==='cli'?'clients':'suppliers',Object.assign({nom:name},CH_PEND||{}));CH_PEND=null;
 if(kind==='cli'){q.client=x.nom;if(!x.adr&&q.adr){x.adr=q.adr}if(!x.tel&&q.tel)x.tel=q.tel;if(!q.tel&&x.tel)q.tel=x.tel;if(!q.adr&&x.adr)q.adr=x.adr;fillForm();if(q.lines.length)store();else save()}else save();
 // retirer la proposition du message
 const last=[...CHAT.m].reverse().find(m=>m.who==='bot'&&m.html&&m.html.includes('<!--sg-->'));
 if(last){last.html=last.html.replace(/<!--sg-->[\s\S]*?<!--\/sg-->/,'');
  // la question était seule dans la bulle : pas de bulle vide
  if(!last.html.replace(/<[^>]*>/g,'').trim())CHAT.m.splice(CHAT.m.indexOf(last),1)}
 CHAT.m.push({who:'bot',html:kind==='cli'
  ?`<p><svg class="i i-sm"><use href="#i-user"/></svg> <span>Client</span> : <b data-noi18n>${esc(x.nom)}</b> <span class="pill-s ${isNew?'new':''}">${isNew?'Nouveau, ajouté à tes clients':'Déjà dans tes clients'}</span></p>`
  :`<p><svg class="i i-sm"><use href="#i-truck"/></svg> <span>Fournisseur</span> : <b data-noi18n>${esc(x.nom)}</b> <span class="pill-s ${isNew?'new':''}">${isNew?'Nouveau, ajouté à tes fournisseurs':'Déjà dans tes fournisseurs'}</span></p>`});
 chatSave();chatRender(true)}

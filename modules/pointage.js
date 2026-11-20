/* casô · Pointage : écran et actions
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Pointage ---------- */
function ensurePt(){if(!db.chantiers)db.chantiers=[];if(!db.people)db.people=[];if(!db.pts)db.pts=[]}
const FMT_T=new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit'}),FMT_D=new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'2-digit'});
const fmtT=ts=>FMT_T.format(new Date(ts));
const fmtD=ts=>FMT_D.format(new Date(ts));
const fmtH=ms=>{const m=Math.round(ms/60000);return Math.floor(m/60)+' h '+String(m%60).padStart(2,'0')};
const chName=id=>(db.chantiers.find(c=>c.id===id)||{}).nom||'?';
const pName=id=>(db.people.find(p=>p.id===id)||{}).nom||'?';
let ptPer='week',lastIds=[];

function lastEv(pid){
 const e=db.pts.filter(x=>x.p===pid).sort((a,b)=>a.ts-b.ts);return e[e.length-1]||null}

/* Une personne est « dedans » après une entrée, « dehors » après une sortie.
   Un tap alterne. Si elle est dedans sur un autre chantier, on la sort de celui-là. */
function punch(cid,pid,ts,note){
 ensurePt();
 const last=lastEv(pid),now=ts||Date.now();
 if(!ts&&last&&last.c===cid&&now-last.ts<20000)return{dup:true,ev:last};
 const evs=[];let type='in',auto=false,forgot=null;
 // entrée vieille de plus de 16 h : la sortie a été oubliée, ce tap est une nouvelle entrée
 const stale=last&&last.t==='in'&&(now-last.ts>16*3600*1000);
 if(stale)forgot=last;
 else if(last&&last.t==='in'){
  if(last.c===cid)type='out';
  else{evs.push({id:uid(),c:last.c,p:pid,t:'out',ts:now,note:'automatique (changement de chantier)'});auto=last.c}
 }
 evs.push({id:uid(),c:cid,p:pid,t:type,ts:now,note:note||''});
 evs.forEach(e=>db.pts.push(e));save();
 return{evs,ev:evs[evs.length-1],auto,forgot};
}

/* Reconstruit les périodes de présence à partir des entrées/sorties */
function sessions(){
 ensurePt();const by={};
 db.pts.slice().sort((a,b)=>a.ts-b.ts).forEach(e=>{
  const s=by[e.p]||(by[e.p]={open:null,list:[]});
  if(e.t==='in'){
   if(s.open)s.list.push({p:e.p,c:s.open.c,a:s.open.ts,b:null,warn:'sortie oubliée'});
   s.open=e;
  }else{
   if(s.open){s.list.push({p:e.p,c:s.open.c,a:s.open.ts,b:e.ts});s.open=null}
   else s.list.push({p:e.p,c:e.c,a:null,b:e.ts,warn:'entrée oubliée'});
  }});
 const all=[];
 Object.keys(by).forEach(p=>{by[p].list.forEach(x=>all.push(x));if(by[p].open)all.push({p,c:by[p].open.c,a:by[p].open.ts,b:null,open:true})});
 return all.sort((x,y)=>(x.a||x.b)-(y.a||y.b));
}
function periodStart(per){
 const d=new Date();d.setHours(0,0,0,0);
 if(per==='week'){const w=(d.getDay()+6)%7;d.setDate(d.getDate()-w);return d.getTime()}
 if(per==='month'){d.setDate(1);return d.getTime()}
 return 0}
function summarize(per){
 const start=periodStart(per),by={};let flags=0;const open=[];
 sessions().forEach(s=>{
  const t=s.a||s.b;if(t<start)return;
  if(s.open){open.push(s);return}
  if(s.warn){flags++;return}
  const c=by[s.c]||(by[s.c]={});c[s.p]=(c[s.p]||0)+(s.b-s.a)});
 return{by,flags,open};
}

function flash(html,color){
 $('ptFlash').innerHTML=`<div class="card" style="background:${color};color:#fff;text-align:center;padding:24px">${html}</div>`;
 window.scrollTo(0,0)}
function doPunch(cid,pid,ts){
 const r=punch(cid,pid,ts||undefined);
 if(r.dup){flash('<div style="font-size:24px;font-weight:800">Déjà pris en compte</div><div>à '+fmtT(r.ev.ts)+'</div>','#6b7585');renderPt();return}
 lastIds=r.evs.map(e=>e.id);
 const e=r.ev;let extra='';
 if(r.auto)extra+='<div>Sortie automatique de « '+esc(chName(r.auto))+' ».</div>';
 if(r.forgot)extra+='<div style="margin-top:6px"><svg class="i i-sm"><use href="#i-warn"/></svg> Sortie du '+fmtD(r.forgot.ts)+' non enregistrée. Corrige-la dans « Ajouter un oubli ».</div>';
 if(e.t==='out'){
  const prev=db.pts.filter(x=>x.p===pid&&x.t==='in'&&x.ts<e.ts&&x.c===cid).sort((a,b)=>b.ts-a.ts)[0];
  if(prev)extra+='<div>Durée : '+fmtH(e.ts-prev.ts)+'</div>';
 }
 flash(`<div style="font-size:30px;font-weight:800">${e.t==='in'?'ENTRÉE':'SORTIE'} <svg class="i i-lg"><use href="#i-check"/></svg></div>
  <div style="font-size:26px;margin:6px 0">${fmtT(e.ts)}</div>
  <div>${esc(pName(pid))} · ${esc(chName(cid))}</div>${extra}
  <button class="btn sec" onclick="undoPunch()">Annuler (erreur)</button>`,e.t==='in'?'#1e8e3e':'#e8710a');
 renderPt();
}
function undoPunch(){
 db.pts=db.pts.filter(e=>!lastIds.includes(e.id));lastIds=[];save();
 $('ptFlash').innerHTML='';renderPt()}

/* --- actions de l'écran --- */
function manualPunch(){
 const c=$('ptC').value,p=$('ptP').value;
 if(!c||!p){alert('Choisis un chantier et une personne.');return}
 doPunch(c,p)}

/* pointage : créer le chantier et la personne sans quitter l'écran */
function ptSetupHtml(){let h='';
 if(ptOuvrier())return `<p class="mut">${esc(i18nT('Tes chantiers arrivent tout seuls depuis le planning de ton entreprise.'))}</p>`;
 if(!db.chantiers.length){const C=(db.clients||[]).filter(c=>c.adr).slice(-4).reverse();
  h+=`<label for="ptQC">Chantier</label><div class="row"><input id="ptQC" placeholder="Nom ou adresse du chantier" data-adr autocomplete="off"><button class="btn sm" style="flex:0 0 auto" onclick="ptQuickCh()">Ajouter</button></div>`+
   (C.length?`<div class="chips pt-sug">${C.map(c=>`<button type="button" class="chip" onclick="ptChCli('${esc(c.id)}')"><svg class="i i-sm"><use href="#i-pin"/></svg><span data-noi18n>${esc(c.nom)}</span></button>`).join('')}</div>`:'')}
 if(!db.people.length){const a=accountGet&&accountGet();
  h+=`<label for="ptQP">Personne</label><div class="row"><input id="ptQP" placeholder="Prénom" autocapitalize="words" value="${esc((a&&a.prenom&&a.prenom.split(' ')[0])||'')}"><button class="btn sm" style="flex:0 0 auto" onclick="ptQuickP()">Ajouter</button></div>`}
 return h}
function ptQuickCh(){const v=($('ptQC').value||'').trim();if(!v){$('ptQC').focus();return}db.chantiers.push({id:uid().slice(-6),nom:v});save();renderPt()}
function ptChCli(id){const c=(db.clients||[]).find(x=>x.id===id);if(!c)return;db.chantiers.push({id:uid().slice(-6),nom:c.nom+(c.adr?' — '+c.adr:'')});save();renderPt()}
function ptQuickP(){const v=ctCap(($('ptQP').value||'').trim());if(!v){$('ptQP').focus();return}db.people.push({id:uid(),nom:v});save();renderPt()}

function addCh(){
 const n=$('chNew').value.trim();if(!n)return;
 db.chantiers.push({id:uid().slice(-6),nom:n});save();renderPt()}
function delCh(id){
 if(db.pts.some(e=>e.c===id)){alert('Ce chantier a des pointages : suppression impossible.');return}
 if(!confirm('Supprimer ce chantier ?'))return;
 db.chantiers=db.chantiers.filter(c=>c.id!==id);save();renderPt()}
function addPerson(){
 const n=$('pnNew').value.trim();if(!n)return;
 db.people.push({id:uid(),nom:n});save();renderPt()}
function delPerson(id){
 if(db.pts.some(e=>e.p===id)){alert('Cette personne a des pointages : suppression impossible.');return}
 if(!confirm('Supprimer cette personne ?'))return;
 db.people=db.people.filter(p=>p.id!==id);save();renderPt()}
function delEv(id){
 if(!confirm('Supprimer ce pointage ?'))return;
 db.pts=db.pts.filter(e=>e.id!==id);save();renderPt()}
function addForgot(){
 const c=$('fgC').value,p=$('fgP').value,t=$('fgT').value,d=$('fgD').value,n=$('fgN').value.trim();
 if(!c||!p||!d){alert('Chantier, personne et date/heure sont obligatoires.');return}
 if(!n){alert('Indique la raison (par exemple « oubli de sortie »).');return}
 db.pts.push({id:uid(),c,p,t,ts:new Date(d).getTime(),note:'ajout manuel : '+n});save();renderPt()}
function setPer(p){ptPer=p;renderPt()}
function exportPt(){
 const rows=['date;chantier;personne;entrée;sortie;durée (h)'];
 sessions().forEach(s=>{
  const t=s.a||s.b;if(t<periodStart(ptPer))return;
  rows.push([dFR(t),chName(s.c),pName(s.p),s.a?fmtT(s.a):'',s.b?fmtT(s.b):'',(s.a&&s.b)?((s.b-s.a)/3600000).toFixed(2).replace('.',','):''].join(';'))});
 dl('pointages.csv',rows.join('\n'),'text/csv')}
function ptToQuote(cid){
 const sm=summarize(ptPer).by[cid];if(!sm){alert('Aucune heure sur ce chantier pour cette période.');return}
 const ms=Object.values(sm).reduce((a,b)=>a+b,0);
 const mo=db.prices.find(p=>/main.?d.?(’|')?\s?(œ|oe)uvre/i.test(p.nom))||db.prices.find(p=>p.unit==='h');
 if(!mo){alert('Ajoute d\'abord un prix « Main d\'œuvre » (à l\'heure) dans Mes services.');return}
 q.lines.push({label:'Main d\'œuvre - '+chName(cid),qty:Math.round(ms/3600000*100)/100,unit:'h',pu:mo.prix,tva:mo.tva});
 renderLines();go('devis')}

/* écran Pointage : trois pages — Pointer (aujourd'hui), Heures (heures + journal), Chantiers (chantiers + personnes) */
function ptOpen(pid){const l=lastEv(pid);return l&&l.t==='in'&&Date.now()-l.ts<16*3600000?l:null}
function ptBtn(who){ // le bouton dit toujours ce qui va se passer : Entrée ou Sortie
 const c=$('ptC'),p=$('ptP'),b=$('ptGo');if(!c||!p||!b)return;
 const o=ptOpen(p.value);
 if(o&&who&&db.chantiers.some(x=>x.id===o.c))c.value=o.c; // une personne déjà sur place : on propose sa sortie
 const out=!!(o&&o.c===c.value);
 b.textContent=out?'Sortie':'Entrée';b.classList.toggle('out',out);
 const ctx=$('ptCtx');if(ctx)ctx.innerHTML=`<b data-noi18n>${esc(pName(p.value))}</b><span data-noi18n>${esc(chName(c.value))}${out?' · '+fmtH(Date.now()-o.ts):''}</span>`}
function ptTick(){ // met à jour la durée des présents sans redessiner l'écran
 document.querySelectorAll('#ptBody [data-since]').forEach(e=>{e.textContent=fmtH(Date.now()-(+e.dataset.since))})}
setInterval(()=>{if(document.getElementById('s-pt')&&document.getElementById('s-pt').classList.contains('on'))ptTick()},30000);

/* « GPS toujours » : le chantier est surveillé tous les jours, même sans rendez-vous au planning */
function ptToujours(id,on){const c=db.chantiers.find(x=>x.id===id);if(!c)return;c.toujours=!!on;c.at=Date.now();save();
 try{if(window.CasoAuto)CasoAuto.run()}catch(e){}toast(i18nT(on?'Ce chantier est surveillé tous les jours.':'Surveillé seulement les jours de rendez-vous.'))}
/* collaborateur de l'équipe (rôle ouvrier sur le serveur de l'entreprise) */
function ptOuvrier(){try{const c=getSync();return !!(c.token&&c.role==='ouvrier')}catch(e){return false}}
/* chantiers des rendez-vous à venir (30 jours) : créés tout seuls, avec l'adresse, pour les voir et pour le GPS */
function ptPlanCh(){if(typeof agDayEvents!=='function'||typeof agChFor!=='function'||!db.events)return;const t=agToday();
 for(let k=0;k<=30;k++)agDayEvents(agAdd(t,k)).forEach(e=>{if(e.t!=='rdv'||(e.ch&&db.chantiers.some(c=>c.id===e.ch)))return;
  const cl=e.cid&&(db.clients||[]).find(c=>c.id===e.cid);if(e.adr||(cl&&cl.adr))try{agChFor(e)}catch(x){}})}
/* les chantiers avec leur prochain passage ; le collaborateur ne voit que ceux de ses rendez-vous et de ses pointages */
function ptChListe(ouv){const t=agToday(),nx={};
 if(typeof agDayEvents==='function')for(let k=0;k<=60;k++){const d=agAdd(t,k);agDayEvents(d).forEach(e=>{if(e.t==='rdv'&&e.ch&&!nx[e.ch])nx[e.ch]={d,a:e.a}})}
 const vu=new Set(db.pts.map(x=>x.c));
 return db.chantiers.filter(c=>!ouv||nx[c.id]||vu.has(c.id)).map(c=>({c,nx:nx[c.id]||null}))
  .sort((a,b)=>(a.nx?0:1)-(b.nx?0:1)||(a.nx&&b.nx?(a.nx.d+(a.nx.a||'')).localeCompare(b.nx.d+(b.nx.a||'')):String(a.c.nom).localeCompare(String(b.c.nom))))}
function ptChLigne(x,AU,ouv){const c=x.c,gz=c.geo?['ok',i18nT('Zone GPS')+' '+(c.rayon||100)+' m']:c.adr?['wait',i18nT('Localisation de l\'adresse…')]:['no',i18nT('Sans adresse : pas de pointage GPS')];
 return `<div class="line pt-chl"${ouv?'':` data-sw="ch:${c.id}"`}><div class="t"><b data-noi18n>${esc(c.nom)}</b>${AU&&!ouv&&(c.adr||c.geo)?`<label class="pt-tj"><span>GPS toujours</span><input type="checkbox" role="switch" ${c.toujours?'checked':''} onchange="ptToujours('${c.id}',this.checked)"></label>`:''}</div>
  ${c.adr&&c.adr!==c.nom&&!String(c.nom).includes(c.adr)?`<div class="mut" data-noi18n>${esc(c.adr)}</div>`:''}
  ${x.nx?`<div class="mut"><span>${esc(i18nT('Prochain passage'))}</span> : <span data-noi18n>${esc(agFmtD(x.nx.d,{weekday:'short',day:'numeric',month:'short'})+(x.nx.a?' · '+(+x.nx.a.slice(0,2))+' h'+(x.nx.a.slice(3)!=='00'?' '+x.nx.a.slice(3):''):''))}</span></div>`:''}
  <div class="pt-gz ${gz[0]}"><svg class="i i-sm"><use href="#i-pin"/></svg><span>${esc(gz[1])}</span></div></div>`}
function renderPt(){
 ensurePt();
 const AU=window.CasoAuto,auto=!!(AU&&AU.active());
 const opt=(arr,sel)=>arr.map(x=>`<option value="${x.id}" ${x.id===sel?'selected':''}>${esc(x.nom)}</option>`).join('');
 const sm=summarize(ptPer);
 const keepC=($('ptC')&&$('ptC').value)||'',keepP=($('ptP')&&$('ptP').value)||'';
 const ready=db.chantiers.length&&db.people.length;
 const one=a=>a.length===1?' hidden':'';
 /* --- Pointer : le GPS d'abord ; à la main seulement si besoin (petit dépliant quand le GPS existe sur ce téléphone) --- */
 const man=ready?`<div id="ptCtx" class="pt-ctx"></div>
   <select id="ptC" aria-label="Chantier"${one(db.chantiers)} onchange="ptBtn()">${opt(db.chantiers,keepC)}</select>
   <select id="ptP" aria-label="Personne"${one(db.people)} onchange="ptBtn(1)">${opt(db.people,keepP)}</select>
   <button id="ptGo" class="btn pt-go" onclick="manualPunch()">Entrée</button>`:'';
 let go='';
 if(!ready)go+=`<div class="card pt-now">${ptSetupHtml()}</div>`;
 /* le GPS pointe vraiment tout seul : plus de pointage à la main ; sinon « Pointer à la main », déplié */
 if(AU){go+=AU.card();if(man&&!auto)go+=`<details class="pt-man" open><summary>Pointer à la main</summary><div class="card pt-now">${man}</div></details>`}
 else if(man)go+=agPtCard()+`<div class="card pt-now">${man}</div>`;
 go+=`<div class="card"><h2><span class="hi"><svg class="i"><use href="#i-users"/></span>Présents</h2>`+
  (sm.open.length?sm.open.map(s=>`<div class="tot"><span data-noi18n>${esc(pName(s.p))} · ${esc(chName(s.c))}</span><span><b>depuis ${fmtT(s.a)}</b> <span class="pt-els" data-noi18n data-since="${s.a}">${fmtH(Date.now()-s.a)}</span></span></div>`).join(''):'<div class="mut">Personne.</div>')+`</div>`;
 /* --- Heures et journal --- */
 /* collaborateur de l'équipe : ses heures et ses paiements en premier */
 let hh=(typeof eqMoiCarte==='function'?eqMoiCarte()+eqSortie():'')+`<div class="card"><h2><span class="hi"><svg class="i"><use href="#i-clock"/></svg></span>Heures</h2><div class="chips" style="margin-bottom:8px">`+
  [['week','Semaine'],['month','Mois'],['all','Tout']].map(([k,l])=>`<span class="chip" style="${ptPer===k?'background:var(--acc);color:var(--ink)':''}" onclick="setPer('${k}')">${l}</span>`).join('')+`</div>`;
 const cids=Object.keys(sm.by);
 hh+=cids.length?cids.map(c=>{
   const tot=Object.values(sm.by[c]).reduce((a,b)=>a+b,0);
   return `<div class="line"><div class="t"><span data-noi18n>${esc(chName(c))}</span><span>${fmtH(tot)}</span></div>`+
    Object.keys(sm.by[c]).map(p=>`<div class="tot mut"><span data-noi18n>${esc(pName(p))}</span><span>${fmtH(sm.by[c][p])}</span></div>`).join('')+
    `<button class="btn sm sec" data-pat data-c="${esc(c)}" onclick="ptToQuote(this.dataset.c)">Ajouter au devis (main d'œuvre)</button></div>`}).join(''):'<div class="mut">Aucune heure.</div>';
 if(sm.flags)hh+=`<div class="mut" style="color:#b06000;margin-top:8px"><svg class="i i-sm"><use href="#i-warn"/></svg> ${sm.flags} période(s) incomplète(s), non comptées.</div>`;
 hh+=`<button class="btn sec" onclick="exportPt()">Exporter en CSV (Excel)</button></div>`;
 const ev=db.pts.slice().sort((a,b)=>b.ts-a.ts).slice(0,30);
 hh+=`<div class="card"><h2><span class="hi"><svg class="i"><use href="#i-list"/></svg></span>Journal</h2>`+(ev.length?ev.map(e=>`<div class="line"><div class="t"><span>${e.t==='in'?'Entrée':'Sortie'} · <span data-noi18n>${esc(pName(e.p))}</span></span><span data-noi18n>${fmtD(e.ts)} ${fmtT(e.ts)}</span></div>
   <div class="mut" data-noi18n>${esc(chName(e.c))}${e.note?' · '+esc(e.note):''}</div>
   <button class="btn sm ko" data-pat onclick="delEv('${e.id}')">Supprimer</button></div>`).join(''):'<div class="mut">Aucun pointage.</div>')+
  `<details class="pt-adv"><summary>Ajouter un oubli</summary>
  <label>Chantier</label><select id="fgC">${opt(db.chantiers,'')}</select>
  <label>Personne</label><select id="fgP">${opt(db.people,'')}</select>
  <div class="row"><div><label>Type</label><select id="fgT"><option value="in">Entrée</option><option value="out">Sortie</option></select></div>
  <div><label>Date et heure</label><input id="fgD" type="datetime-local"></div></div>
  <label>Raison (obligatoire)</label><input id="fgN" placeholder="oubli de sortie, pas de réseau…">
  <button class="btn sec" onclick="addForgot()">Ajouter</button></details></div>`;
 /* --- Chantiers : ceux du planning (rendez-vous avec une adresse, 30 jours) et ceux ajoutés ; le GPS de ce téléphone en tête --- */
 ptPlanCh();const ouv=ptOuvrier();
 let st=`<div class="card au pt-gps"><div class="au-cap">${esc(i18nT('GPS de ce téléphone'))}</div>`+(AU&&AU.gpsLine?AU.gpsLine():`<div class="au-sub">${esc(i18nT('Le GPS se lance seulement sur un téléphone.'))}</div>`)+`</div>`;
 const L=ptChListe(ouv);
 st+=`<div class="card"><h2><span class="hi"><svg class="i"><use href="#i-pin"/></svg></span>${esc(i18nT(ouv?'Mes chantiers':'Chantiers'))}</h2>`+
  (ouv?'':`<div class="row"><input id="chNew" placeholder="Nouveau chantier" data-adr autocomplete="off"><button class="btn sm" style="flex:0 0 auto" onclick="addCh()">Ajouter</button></div>`)+
  (L.length?L.map(x=>ptChLigne(x,AU,ouv)).join(''):`<p class="mut">${esc(i18nT('Aucun chantier. Ils arrivent tout seuls depuis le planning (rendez-vous avec une adresse).'))}</p>`)+`</div>`;
 /* l'équipe se gère dans Mon équipe (une seule liste) ; pas pour le collaborateur */
 if(!ouv)st+=`<button type="button" class="card eq-lien" onclick="cptPage('team')"><span class="hi"><svg class="i"><use href="#i-users"/></svg></span><span class="eq-t"><b>Mon équipe</b><span class="mut" data-noi18n>${esc(db.people.filter(p=>!p.moi).map(p=>p.nom.split(' ')[0]).join(', '))}</span></span><svg class="i i-flip"><use href="#i-chev"/></svg></button>`;
 $('ptBody').innerHTML=`<div data-pg="go">${go}</div><div data-pg="h">${hh}</div><div data-pg="set">${st}</div>`;
 ptBtn();ptPage(ptCur,true);
}

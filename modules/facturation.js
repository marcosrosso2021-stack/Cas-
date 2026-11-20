/* casô · Facturation : factures, PDF, liste des factures
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Facturation ----------
   Devis validé → facture d'acompte, facture finale (acomptes déduits) ou facture complète.
   Une facture émise est figée (numéro continu, infos de l'entreprise copiées) ; on corrige par un avoir.
   Paiements, reste dû, retard, relance. La facture sort toujours en français. */
if(!db.invoices)db.invoices=[];
const FA_KIND={facture:'Facture',acompte:"Facture d'acompte",solde:'Facture finale',avoir:'Avoir'};
const FA_MODE={vir:'Virement',chq:'Chèque',esp:'Espèces',cb:'Carte bancaire'};
/* anti-fraude : à l'émission, la facture reçoit une empreinte SHA-256 de ce qui ne doit plus jamais changer ;
   chaque paiement aussi. Le contrôle d'intégrité recalcule tout et signale la moindre modification ou un trou de numérotation. */
const sealH=t=>hex(sha256(new TextEncoder().encode(t)));
function faSealStr(f){const c=f.client||{},v=f.seller||{};return JSON.stringify([1,f.id,f.kind,f.qid||'',f.qnum||'',f.num,f.date,f.done||'',f.due||'',c.nom||'',c.adr||'',!!c.pro,c.siren||'',c.tvai||'',f.chantier||'',+f.remise||0,!!f.franchise,!!f.autoliq,+f.ret||0,f.pct==null?null:+f.pct,JSON.stringify(f.ded==null?null:f.ded),(f.lines||[]).map(l=>[l.label||'',+l.qty||0,l.unit||'',+l.pu||0,+l.tva||0]),f.ref||'',v.nom||'',v.siret||'',f.issuedAt||0])}
const paySealStr=(f,p)=>JSON.stringify([1,f.num,p.id||'',p.d,+p.amt,p.mode,p.cancels||'']);
function faAudit(){const out={inv:0,pays:0,old:0,bad:[],gaps:[]},ser={};
 (db.invoices||[]).forEach(f=>{if(!f.num)return;out.inv++;
  if(f.seal){if(sealH(faSealStr(f))!==f.seal)out.bad.push({num:f.num,what:'facture'})}else out.old++;
  (f.pays||[]).forEach(p=>{out.pays++;if(p.h&&sealH(paySealStr(f,p))!==p.h)out.bad.push({num:f.num,what:'paiement'})});
  const m=/^([A-Z]+\d{4})-(\d+)$/.exec(f.num);if(m)(ser[m[1]]=ser[m[1]]||[]).push(+m[2])});
 for(const k in ser){const L=[...new Set(ser[k])].sort((a,b)=>a-b);for(let n=1;n<L[L.length-1];n++)if(!L.includes(n))out.gaps.push(k+'-'+String(n).padStart(4,'0'))}
 return out}
function faAuditHtml(){const a=faAudit(),okk=!a.bad.length&&!a.gaps.length;
 return `<div class="card fa-aud ${okk?'ok':'ko'}"><h2><span class="hi"><svg class="i"><use href="#i-shield"/></svg></span><span>Contrôle d'intégrité</span></h2>`+
  (okk?`<p><svg class="i i-sm ok-c"><use href="#i-check"/></svg> <span>Aucune modification après émission, numérotation continue.</span></p>`
   :`<p><svg class="i i-sm"><use href="#i-warn"/></svg> <b>Anomalie détectée.</b></p>`+a.bad.map(x=>`<p class="mut"><span data-noi18n>${esc(x.num)}</span> · <span>${x.what==='facture'?'facture modifiée après émission':'paiement modifié'}</span></p>`).join('')+(a.gaps.length?`<p class="mut"><span>Numéros manquants</span> : <span data-noi18n>${esc(a.gaps.slice(0,12).join(', '))}${a.gaps.length>12?'…':''}</span></p>`:''))+
  `<p class="mut"><span data-noi18n>${a.inv}</span> <span>factures</span> · <span data-noi18n>${a.pays}</span> <span>paiements</span>${a.old?` · <span data-noi18n>${a.old}</span> <span>émises avant le scellement</span>`:''}</p></div>`}
/* un paiement enregistré ne se modifie ni ne s'efface : une erreur s'annule par une écriture inverse, qui reste visible */
const faPk=p=>p.id||[p.d,p.amt,p.mode].join('|');
const faPayOff=(f,p)=>!!p.cancels||(f.pays||[]).some(x=>x.cancels===faPk(p));
function faPayAdd(f,p){const x=Object.assign({id:uid(),at:Date.now()},p);if(f.num)x.h=sealH(paySealStr(f,x));f.pays=(f.pays||[]).concat(x)}
function faPayCancel(i){const f=FA,p=f&&(f.pays||[])[i];if(!p||faPayOff(f,p))return;
 if(!confirm(i18nT("Annuler ce paiement de {1} ? Il reste visible, barré, dans l'historique des encaissements.").replace('{1}',eur(p.amt))))return;
 faPayAdd(f,{d:agToday(),amt:faR2(-p.amt),mode:p.mode,cancels:faPk(p)});
 if(faState(f)!=='payee'){const o=db.quotes.find(x=>x.id===f.qid);if(o&&o.status==='paye'){o.status='accepte';delete o.paidAt}}
 save();faRender();faShareSync(f).catch(()=>{});toast(i18nT('Paiement annulé.'))}
const faR2=v=>Math.round((+v||0)*100)/100;
const faYmd=d=>d.toISOString?agYmd(d):d;
let FA=null,faTab='devis';
function faTot(f){ // totaux d'une facture (HT, TVA par taux, TTC, déductions, net à payer)
 const r=(f.remise||0)/100,tv={};let ht=0;
 f.lines.forEach(l=>{const m=faR2(l.qty*l.pu*(1-r));ht+=m;const t=f.franchise||f.autoliq?0:l.tva;tv[t]=(tv[t]||0)+m*t/100});
 Object.keys(tv).forEach(k=>tv[k]=faR2(tv[k]));
 ht=faR2(ht);const tva=faR2(Object.values(tv).reduce((a,b)=>a+b,0)),ttc=faR2(ht+tva);
 const ded=(f.ded||[]).reduce((a,d)=>a+d.ttc,0),ret=faR2(ttc*(f.ret||0)/100);
 return{ht,tv,tva,ttc,ded:faR2(ded),ret,net:faR2(ttc-ded-ret)}}
function faPaidReal(f){return faR2((f.pays||[]).reduce((a,p)=>a+(+p.amt||0),0))}
function faCredited(f){return faR2(db.invoices.filter(a=>a.kind==='avoir'&&a.ref===f.id&&a.num).reduce((a,x)=>a+Math.abs(faTot(x).net),0))}
function faPaid(f){return faR2(faPaidReal(f)+faCredited(f))}
function faDue(f){return f.kind==='avoir'?0:faR2(faTot(f).net-faPaid(f))}
function faState(f){if(!f.num)return'brouillon';if(f.kind==='avoir')return'avoir';const d=faDue(f);if(d<=0.005)return faPaidReal(f)>0.005?'payee':'annulee';if(f.due&&f.due<agToday())return'retard';return faPaid(f)>0?'partielle':'attente'}
const FA_ST={brouillon:'Brouillon',attente:'À encaisser',partielle:'Payée en partie',payee:'Payée',retard:'En retard',avoir:'Avoir',annulee:'Annulée par avoir'};
function faOfQuote(qid){return db.invoices.filter(f=>f.qid===qid&&f.num)}
function faClient(nom){return findBy(db.clients,nom)||{nom}}
function faProf(){const p=db.prof||{};return{nom:p.nom||'',forme:p.forme||'',adr:p.adr||'',siret:p.siret||'',rm:p.rm||'',tva:p.tvai||'',tel:p.tel||'',email:p.email||'',iban:p.iban||'',bic:p.bic||'',assur:p.assur||'',zone:p.zone||'France métropolitaine',penal:p.penal||'3 fois le taux d\'intérêt légal'}}
function faDelai(){const v=(db.prof||{}).delai;return v===''||v==null?30:+v}

/* ---- composer une facture depuis un devis ---- */
function faNew(qid,kind){
 const o=db.quotes.find(x=>x.id===qid);if(!o)return;
 const prev=faOfQuote(qid).filter(f=>f.kind==='acompte'),c=faClient(o.client),t=totals(o);
 kind=kind||(prev.length?'solde':(o.acompte>0?'choix':'facture'));
 if(kind==='choix'){FA={choose:true,qid};return faOpen()}
 const today=agToday();
 const f={id:uid(),kind,qid,qnum:o.num||'',date:today,done:kind==='acompte'?'':today,due:agAdd(today,faDelai()),
  client:{nom:o.client||'',adr:c.adr||o.adr||'',tel:c.tel||o.tel||'',email:c.email||'',pro:!!c.pro,siren:c.siren||'',tvai:c.tvai||''},chantier:o.adr||'',
  remise:o.remise||0,franchise:!!o.franchise,autoliq:false,ret:0,pays:[],lines:[]};
 if(kind==='acompte'){
  const pc=o.acompte||30;f.pct=pc;
  Object.keys(t.tv).forEach(rate=>{const base=o.lines.filter(l=>(o.franchise?0:l.tva)==+rate).reduce((a,l)=>a+l.qty*l.pu*(1-(o.remise||0)/100),0);
   if(base)f.lines.push({label:`Acompte de ${pc} % sur le devis ${o.num||''}`+(Object.keys(t.tv).length>1?` (TVA ${rate} %)`:''),qty:1,unit:'forfait',pu:faR2(base*pc/100),tva:+rate})});
  f.remise=0}
 else{
  f.lines=o.lines.map(l=>({label:l.label,qty:l.qty,unit:l.unit,pu:l.pu,tva:l.tva}));
  if(kind==='solde')f.ded=prev.map(p=>({num:p.num,date:p.date,ttc:faR2(faTot(p).ttc-faCredited(p))})).filter(d=>d.ttc>0.005)}
 FA=f;faOpen()}
function faOpen(){go('fact');faRender()}
function faRender(){
 const el=$('faBody');if(!el||!FA)return;
 if(FA.choose){const o=db.quotes.find(x=>x.id===FA.qid);
  el.innerHTML=`<div class="card"><h2><span class="hi"><svg class="i"><use href="#i-doc"/></svg></span><span>Que veux-tu facturer ?</span></h2>
   <p class="mut"><span>Devis</span> <b data-noi18n>${esc(o.num||'')}</b> · <span data-noi18n>${esc(o.client||'')}</span> · <b data-noi18n>${eur(totals(o).ttc)}</b></p>
   <button class="btn" onclick="faNew('${o.id}','acompte')"><svg class="i"><use href="#i-calc"/></svg><span>Facture d'acompte</span> <span data-noi18n>(${o.acompte||30} % · ${eur(totals(o).ttc*(o.acompte||30)/100)})</span></button>
   <button class="btn sec" onclick="faNew('${o.id}','facture')"><svg class="i"><use href="#i-doc"/></svg>Facture complète</button></div>`;return}
 const f=FA,lock=!!f.num,t=faTot(f),st=faState(f),P=faProf(),red=!f.franchise&&!f.autoliq&&!f.client.pro&&f.lines.some(l=>l.tva===10||l.tva===5.5);
 const miss=faMissing(f);
 let h='';
 h+=`<div class="card fa-hd"><div class="fa-ht"><b data-noi18n>${esc(lock?f.num:i18nT('Nouvelle facture'))}</b><span class="tag fa-${st}">${FA_ST[st]}</span></div>
  <div class="mut"><span>${esc(FA_KIND[f.kind])}</span>${f.qnum?` · <span>Devis</span> <span data-noi18n>${esc(f.qnum)}</span>`:''}${f.ref?` · <span>sur la facture</span> <span data-noi18n>${esc((db.invoices.find(x=>x.id===f.ref)||{}).num||'')}</span>`:''}</div></div>`;
 if(lock){
  const due=faDue(f);
  h+=`<div class="card"><div class="tot"><span>Net à payer</span><b data-noi18n>${eur(t.net)}</b></div>${f.kind!=='avoir'?`<div class="tot"><span>Déjà payé</span><b data-noi18n>${eur(faPaid(f))}</b></div><div class="tot fa-due"><span>Reste dû</span><b data-noi18n>${eur(due)}</b></div><div class="mut fa-ech"><span>Échéance</span> : <span data-noi18n>${esc(agFmtD(f.due))}</span></div>`:''}
   <div class="fa-acts">
    ${faPdfOk(f)?`<button class="btn" onclick="faPdf()"><svg class="i"><use href="#i-doc"/></svg>${f.kind==='avoir'?'PDF':'PDF acquittée'}</button>`:''}
    <button class="btn ${faPdfOk(f)?'sec':''}" onclick="faSend()"><svg class="i"><use href="#i-send"/></svg>${f.sent?'Renvoyer le lien':'Envoyer au client'}</button>
    ${f.kind!=='avoir'&&due>0?`<button class="btn sec" onclick="faPayOpen()"><svg class="i"><use href="#i-check"/></svg>Enregistrer un paiement</button>`:''}
    ${f.kind!=='avoir'&&due>0&&st==='retard'?`<button class="btn sec ko" onclick="faRelance()"><svg class="i"><use href="#i-warn"/></svg>Relancer le client</button>`:''}
    ${f.kind!=='avoir'&&faTot(f).net-faCredited(f)>0.005?`<button class="btn sec" onclick="faAvoir()"><svg class="i"><use href="#i-undo"/></svg>Faire un avoir</button>`:''}
   </div>
   ${(f.pays||[]).length?`<h2 class="grp"><span>Paiements</span></h2><div class="lst">`+f.pays.map((p,i)=>p.cancels?'':`<div class="it fa-pl${faPayOff(f,p)?' off':''}"><span class="it-t"><span data-noi18n>${esc(agFmtD(p.d,{weekday:undefined}))} · ${esc(i18nT(FA_MODE[p.mode]||''))}</span><b data-noi18n>${eur(p.amt)}</b></span>${faPayOff(f,p)?`<span class="pill-s">Annulé</span>`:`<button class="lnk fa-pc" onclick="faPayCancel(${i})">Annuler</button>`}</div>`).join('')+'</div>':''}
   ${f.sent?`<p class="mut pl-ex"><span>Envoyée le</span> <span data-noi18n>${esc(dFR(f.sent))}</span>${f.viewedAt?` · <span>vue par le client le</span> <span data-noi18n>${esc(dFR(f.viewedAt))}</span>`:''}</p>`:''}
   ${f.red&&f.kind!=='avoir'?`<p class="mut pl-ex">${f.cert?`<svg class="i i-sm ok-c"><use href="#i-check"/></svg> <span>TVA réduite certifiée par le client</span> : <b data-noi18n>${esc(f.cert.name)}</b>`:`<span>TVA réduite : le client la certifie en ligne, depuis le lien de la facture.</span>`}</p>`:''}
   ${!faPdfOk(f)&&f.kind!=='avoir'?`<p class="mut pl-ex"><svg class="i i-sm"><use href="#i-shield"/></svg> <span>Le client reçoit un lien casô pour voir et régler la facture. Le PDF n'existe qu'une fois la facture payée.</span></p>`:''}
   <p class="mut pl-ex">Une facture émise ne se modifie plus : pour corriger, fais un avoir.</p></div>`}
 else{
  h+=`<div class="card"><h2><span class="hi"><svg class="i"><use href="#i-user"/></svg></span>Client</h2>
   <label for="faCn">Nom</label><input id="faCn" value="${esc(f.client.nom)}" oninput="FA.client.nom=this.value" data-noi18n>
   <label for="faCa">Adresse de facturation</label><input id="faCa" value="${esc(f.client.adr)}" oninput="FA.client.adr=this.value;faCheck()" data-noi18n>
   <label for="faCh">Adresse du chantier</label><input id="faCh" value="${esc(f.chantier)}" oninput="FA.chantier=this.value" data-noi18n>
   <label class="pl-ck"><input type="checkbox" ${f.client.pro?'checked':''} onchange="FA.client.pro=this.checked;if(!this.checked){FA.autoliq=false;FA.ret=0}faRender()"> <span>Client professionnel (entreprise)</span></label>
   ${f.client.pro?`<div class="row"><div><label for="faCs">SIREN</label><input id="faCs" inputmode="numeric" value="${esc(f.client.siren)}" oninput="FA.client.siren=this.value.replace(/\\s/g,'');faCheck()" data-noi18n></div><div><label for="faCt">N° TVA</label><input id="faCt" value="${esc(f.client.tvai)}" oninput="FA.client.tvai=this.value" data-noi18n></div></div>
   <label class="pl-ck"><input type="checkbox" ${f.autoliq?'checked':''} onchange="FA.autoliq=this.checked;faRender()"> <span>Sous-traitance BTP : autoliquidation de la TVA</span></label>
   <label for="faRet">Retenue de garantie</label><select id="faRet" onchange="FA.ret=+this.value;faRender()"><option value="0" ${!f.ret?'selected':''}>Aucune</option><option value="5" ${f.ret===5?'selected':''}>5 %</option></select>`:''}
  </div>
  <div class="card"><h2><span class="hi"><svg class="i"><use href="#i-clock"/></svg></span>Dates</h2>
   <div class="row"><div><label for="faD">Date de la facture</label><input id="faD" type="date" value="${f.date}" onchange="FA.date=this.value;FA.due=agAdd(this.value,faDelai());faRender()"></div>
   <div><label for="faDone">${f.kind==='acompte'?'Début des travaux':'Fin des travaux'}</label><input id="faDone" type="date" value="${f.done||''}" onchange="FA.done=this.value;faCheck()"></div></div>
   <label for="faDue">Échéance</label><select id="faDue" onchange="FA.due=agAdd(FA.date,+this.value);faRender()">${[[0,'À réception'],[15,'15 jours'],[30,'30 jours'],[45,'45 jours']].map(([n,l])=>`<option value="${n}" ${agAdd(f.date,n)===f.due?'selected':''}>${l}</option>`).join('')}</select>
  </div>`}
 // lignes et totaux
 h+=`<div class="card"><h2><span class="hi"><svg class="i"><use href="#i-list"/></svg></span>${esc(FA_KIND[f.kind])}</h2>`+f.lines.map(l=>`<div class="fa-l"><span data-noi18n lang="fr">${esc(l.label)}</span><span class="mut" data-noi18n>${fmtN(l.qty)} ${esc(l.unit)} × ${eur(l.pu)}${f.franchise||f.autoliq?'':' · TVA '+(+l.tva||0)+' %'}</span><b data-noi18n>${eur(faR2(l.qty*l.pu))}</b></div>`).join('')+
  `<div class="fa-t">${f.remise?`<div class="tot"><span>Remise</span><b data-noi18n>${+f.remise||0} %</b></div>`:''}<div class="tot"><span>Total HT</span><b data-noi18n>${eur(t.ht)}</b></div>`+
  (f.franchise?`<div class="mut">TVA non applicable, art. 293 B du CGI</div>`:f.autoliq?`<div class="mut">Autoliquidation : TVA due par le client</div>`:Object.keys(t.tv).map(k=>`<div class="tot"><span>TVA ${k} %</span><b data-noi18n>${eur(t.tv[k])}</b></div>`).join(''))+
  `<div class="tot fa-ttc"><span>Total TTC</span><b data-noi18n>${eur(t.ttc)}</b></div>`+(f.ded||[]).map(d=>`<div class="tot"><span><span>Acompte déjà facturé</span> <span data-noi18n>${esc(d.num)}</span></span><b data-noi18n>− ${eur(d.ttc)}</b></div>`).join('')+
  (f.ret?`<div class="tot"><span>Retenue de garantie ${+f.ret||0} %</span><b data-noi18n>− ${eur(t.ret)}</b></div>`:'')+(t.ded||t.ret?`<div class="tot fa-ttc"><span>Net à payer</span><b data-noi18n>${eur(t.net)}</b></div>`:'')+`</div>`+
  (red?`<p class="mut pl-ex fa-red"><svg class="i i-sm"><use href="#i-pen"/></svg> <span>TVA réduite : la facture contient la mention que le client certifie et signe (logement de plus de 2 ans).</span></p>`:'')+`</div>`;
 if(!lock){
  h+=`<div class="card" id="faMiss">${faMissHtml(miss)}</div>
   <button class="btn" id="faGo" onclick="faIssue()" ${miss.length?'disabled':''}><svg class="i"><use href="#i-check"/></svg>Émettre la facture</button>
   <p class="mut pl-ex">Une fois émise, la facture reçoit son numéro et ne peut plus être modifiée.</p>`}
 el.innerHTML=h}
function faMissing(f){const P=faProf(),m=[];
 if(!P.nom)m.push(['ent','Nom de ton entreprise']);if(!P.adr)m.push(['ent','Adresse de ton entreprise']);if(!/^\d{14}$/.test(P.siret.replace(/\s/g,'')))m.push(['ent','SIRET (14 chiffres)']);
 if(!P.assur)m.push(['ent','Assurance décennale']);if(!f.franchise&&!P.tva)m.push(['ent','N° de TVA intracommunautaire (ou franchise de TVA sur le devis)']);
 if(!f.client.nom.trim())m.push(['cli','Nom du client']);if(!f.client.adr.trim())m.push(['cli','Adresse de facturation du client']);
 if(f.client.pro&&!/^\d{9}$/.test((f.client.siren||'').replace(/\s/g,'')))m.push(['cli','SIREN du client (9 chiffres)']);
 if(f.autoliq&&!f.client.tvai)m.push(['cli','N° de TVA du client (autoliquidation)']);
 if(f.kind!=='acompte'&&!(f.kind==='avoir'&&(db.invoices.find(x=>x.id===f.ref)||{}).kind==='acompte')&&!f.done)m.push(['cli','Date de fin des travaux']);
 if(f.kind==='solde'&&faTot(f).net<0)m.push(['cli','Les acomptes dépassent le total']);
 return m}
function faMissHtml(m){return m.length?`<h2><span class="hi"><svg class="i"><use href="#i-warn"/></svg></span>À compléter avant d'émettre</h2>`+m.map(([k,t])=>`<p class="fa-miss"><span>${esc(t)}</span>${k==='ent'?`<button class="lnk" onclick="cptPage('ent')">Mon entreprise</button>`:''}</p>`).join(''):`<p class="fa-ok"><svg class="i i-sm ok-c"><use href="#i-check"/></svg> <span>Toutes les mentions obligatoires sont là.</span></p>`}
function faCheck(){if(!FA||FA.num)return;const m=faMissing(FA);const x=$('faMiss');if(x)x.innerHTML=faMissHtml(m);const b=$('faGo');if(b)b.disabled=!!m.length}
async function faNum(kind,date,inv){ // numérotation continue, par année ; le serveur numérote quand l'équipe est reliée
 const y=date.slice(0,4),pre=kind==='avoir'?'A':'F',k=pre+y,c=getSync();
 if(c.url&&c.token){const j=await apiTeam('/api/inv/next',{key:k,inv,local:(db.invSeq||{})[k]||0});db.invSeq=Object.assign(db.invSeq||{},{[k]:j.n});return pre+y+'-'+String(j.n).padStart(4,'0')}
 db.invSeq=db.invSeq||{};db.invSeq[k]=(db.invSeq[k]||0)+1;return pre+y+'-'+String(db.invSeq[k]).padStart(4,'0')}
async function faIssue(){
 const f=FA;if(!f||f.num||f._iss)return;if(faMissing(f).length){faCheck();return}
 if(!confirm('Émettre la facture ? Elle recevra un numéro et ne pourra plus être modifiée.'))return;
 f._iss=1;const b=$('faGo');if(b)b.disabled=true;
 try{f.num=await faNum(f.kind,f.date,f.id)}catch(e){if(e.module&&typeof aboAjouter==='function'){aboAjouter(e.module);return}toast(i18nT('Connexion au serveur nécessaire pour numéroter la facture.'));return}finally{delete f._iss;if(b&&!f.num)b.disabled=false}
 f.seller=faProf();f.issuedAt=Date.now();f.red=!f.franchise&&!f.autoliq&&!f.client.pro&&f.lines.some(l=>l.tva===10||l.tva===5.5);f.red55=f.lines.some(l=>l.tva===5.5);f.seal=sealH(faSealStr(f));
 // le client garde ses infos (adresse, SIREN…)
 try{const {x}=upsert('clients',{nom:f.client.nom,adr:f.client.adr,tel:f.client.tel});Object.assign(x,{pro:f.client.pro||undefined,siren:f.client.siren||x.siren,tvai:f.client.tvai||x.tvai});if(!x.adr)x.adr=f.client.adr}catch(e){}
 db.invoices.push(f);save();toast(i18nT('Facture émise.'));faRender();
 if(f.kind==='avoir'&&f.ref){const o=db.invoices.find(x=>x.id===f.ref);if(o){faAfterPay(o);save();faShareSync(o).catch(()=>{})}}}

/* ---- PDF (impression du téléphone → PDF) ---- */
const faPdfOk=f=>!!(f&&f.num&&(f.kind==='avoir'||faState(f)==='payee'));
function faPdf(noPrint){
 const f=FA;if(!faPdfOk(f)){toast(i18nT('Le PDF sera disponible une fois la facture payée.'));return}const t=faTot(f),P=f.seller||faProf(),D=s=>s?dFR(s):'';
 const ent=(P.nom||'')+(P.forme&&/^(EI|micro)/i.test(P.forme)&&!/\b(EI|entrepreneur individuel)\b/i.test(P.nom)?' EI':'');
 const ttl=f.kind==='avoir'?'AVOIR':f.kind==='acompte'?"FACTURE D'ACOMPTE":'FACTURE';
 const refInv=f.ref&&db.invoices.find(x=>x.id===f.ref);
 $('print').innerHTML=`
 <div style="display:flex;justify-content:space-between;gap:20px">
  <div><b style="font-size:20px">${esc(ent)}</b>${P.forme&&!/^(EI|micro)/i.test(P.forme)?`<br>${esc(P.forme)}`:''}<br>${esc(P.adr)}<br>SIRET : ${esc(P.siret)}${P.rm?`<br>${esc(P.rm)}`:''}${P.tva&&!f.franchise?`<br>N° TVA : ${esc(P.tva)}`:''}${P.tel?`<br>Tél : ${esc(P.tel)}`:''}${P.email?`<br>${esc(P.email)}`:''}</div>
  <div style="text-align:right">${f.kind!=='avoir'?`<div style="display:inline-block;border:3px solid #1e7a46;color:#1e7a46;font-weight:800;padding:3px 10px;border-radius:6px;transform:rotate(-3deg);margin-bottom:6px">ACQUITTÉE le ${D(faCalc(f).paidAt)}</div><br>`:''}<b style="font-size:22px">${ttl} ${esc(f.num)}</b><br>Date : ${D(f.date)}${f.qnum?`<br>Devis n° ${esc(f.qnum)}`:''}${refInv?`<br>Sur la facture n° ${esc(refInv.num)} du ${D(refInv.date)}`:''}${f.done?`<br>${f.kind==='acompte'?'Début des travaux':'Travaux réalisés le'} : ${D(f.done)}`:''}</div>
 </div>
 <p><b>Client :</b> ${esc(f.client.nom)}<br>${esc(f.client.adr)}${f.client.pro&&f.client.siren?`<br>SIREN : ${esc(f.client.siren)}`:''}${f.client.tvai?`<br>N° TVA : ${esc(f.client.tvai)}`:''}${f.chantier&&f.chantier!==f.client.adr?`<br><b>Chantier :</b> ${esc(f.chantier)}`:''}</p>
 <table><tr><th>Désignation</th><th class="r">Qté</th><th>Unité</th><th class="r">PU HT</th><th class="r">TVA</th><th class="r">Total HT</th></tr>
 ${f.lines.map(l=>`<tr><td>${esc(l.label)}</td><td class="r">${fmtN(l.qty)}</td><td>${esc(l.unit)}</td><td class="r">${eur(l.pu)}</td><td class="r">${f.franchise||f.autoliq?'-':l.tva+' %'}</td><td class="r">${eur(faR2(l.qty*l.pu))}</td></tr>`).join('')}
 </table>
 <div style="margin-left:auto;width:300px">
  ${f.remise?`<div>Remise : ${+f.remise||0} %</div>`:''}
  <div style="display:flex;justify-content:space-between"><span>Total HT</span><b>${eur(t.ht)}</b></div>
  ${f.franchise?'<div>TVA non applicable, art. 293 B du CGI</div>':f.autoliq?'<div>Autoliquidation : TVA due par le preneur, art. 283-2 nonies du CGI</div>':Object.keys(t.tv).map(k=>`<div style="display:flex;justify-content:space-between"><span>TVA ${k} %</span><span>${eur(t.tv[k])}</span></div>`).join('')}
  <div style="display:flex;justify-content:space-between;font-size:17px"><b>Total TTC</b><b>${eur(t.ttc)}</b></div>
  ${(f.ded||[]).map(d=>`<div style="display:flex;justify-content:space-between"><span>Acompte facturé n° ${esc(d.num)} du ${D(d.date)}</span><span>− ${eur(d.ttc)}</span></div>`).join('')}
  ${f.ret?`<div style="display:flex;justify-content:space-between"><span>Retenue de garantie ${+f.ret||0} %</span><span>− ${eur(t.ret)}</span></div>`:''}
  ${t.ded||t.ret?`<div style="display:flex;justify-content:space-between;font-size:17px"><b>Net à payer</b><b>${eur(t.net)}</b></div>`:''}
 </div>
 ${f.kind!=='avoir'?`<p style="margin-top:16px"><b>Échéance : ${f.due===f.date?'à réception':D(f.due)}</b>. Paiement par virement, chèque ou espèces.${P.iban?`<br>IBAN : ${esc(P.iban)}${P.bic?' · BIC : '+esc(P.bic):''}`:''}<br>
  Pas d'escompte pour paiement anticipé. En cas de retard, pénalités au taux de ${esc(P.penal)}${f.client.pro?', et indemnité forfaitaire pour frais de recouvrement de 40 € (art. L441-10 du Code de commerce)':''}.</p>`:''}
 ${P.assur?`<p>Assurance décennale : ${esc(P.assur)} — couverture : ${esc(P.zone)}.</p>`:''}
 ${f.red&&f.kind!=='avoir'?`<div style="border:1px solid #999;padding:8px;margin-top:10px;font-size:12px">Je soussigné(e) ................................................ certifie, en qualité de preneur de la prestation, que les travaux réalisés concernent des locaux à usage d'habitation achevés depuis plus de deux ans et qu'ils n'ont pas eu pour effet, sur une période de deux ans au plus, de concourir à la production d'un immeuble neuf ni d'entraîner une augmentation de la surface de plancher des locaux existants supérieure à 10 %${f.red55?" et qu'ils ont la nature de travaux de rénovation énergétique":''}.<br><br>${f.cert?`Certifié en ligne par ${esc(f.cert.name)} le ${new Date(f.cert.at).toLocaleString('fr-FR')}.`:'Date et signature du client :'}</div>`:''}
 ${f.kind!=='avoir'?`<p style="font-size:12px">Règlements : ${(f.pays||[]).filter(p=>!faPayOff(f,p)).map(p=>D(p.d)+' '+({vir:'virement',chq:'chèque',esp:'espèces',cb:'carte bancaire'}[p.mode]||'')+' '+eur(p.amt)).join(' · ')}</p>`:''}`;
 if(!noPrint)setTimeout(()=>window.print(),200)}

/* ---- liste des factures (Historique > Factures) ---- */
function faList(){
 const L=db.invoices.filter(f=>f.num).sort((a,b)=>(b.date+b.num).localeCompare(a.date+a.num));
 const G=[['retard','En retard'],['attente','À encaisser'],['partielle','Payées en partie'],['payee','Payées'],['avoir','Avoirs']];
 const due=L.filter(f=>f.kind!=='avoir').reduce((a,f)=>a+Math.max(0,faDue(f)),0),late=L.filter(f=>faState(f)==='retard');
 let h=`<div class="card fa-sum"><div class="tot"><span>À encaisser</span><b data-noi18n>${eur(due)}</b></div>${late.length?`<div class="tot fa-late"><span>En retard</span><b data-noi18n>${late.length} · ${eur(late.reduce((a,f)=>a+faDue(f),0))}</b></div>`:''}</div>`;
 G.forEach(([st,t])=>{const X=L.filter(f=>faState(f)===st);if(!X.length)return;
  h+=`<h2 class="grp"><span>${t}</span><span class="cnt">${X.length}</span></h2><div class="lst">`+X.map(f=>`<button class="it it-main" onclick="faShow('${f.id}')"><span class="it-t"><b data-noi18n>${esc(f.client.nom||'—')}</b><span class="tag fa-${st}">${FA_ST[st]}</span></span>
   <span class="mut it-s"><span data-noi18n>${esc(f.num)}</span> · <span>${esc(FA_KIND[f.kind])}</span> · <span data-noi18n>${dFR(f.date)} · ${eur(faTot(f).net)}${st==='partielle'||st==='retard'?' · '+i18nT('reste {1}').replace('{1}',eur(faDue(f))):''}</span></span></button>`).join('')+'</div>'});
 return L.length?h:`<div class="card mut">Aucune facture. Facture un devis validé depuis l'onglet Devis.</div>`}
function faShow(id){FA=db.invoices.find(f=>f.id===id);if(!FA)return;faOpen();if(FA.share&&faTeam())faShareSync(FA).then(()=>{if(FA&&FA.id===id)faRender()}).catch(()=>{})}
function faBack(){if(FA&&FA.num){faTab='fac'}histMode='hist';go('histo')}
// bannière à l'ouverture : factures en retard
setTimeout(()=>{try{const late=db.invoices.filter(f=>f.num&&faState(f)==='retard');if(!late.length||document.body.classList.contains('starting'))return;
 const k='caso_late_'+agToday();if(localStorage.getItem(k))return;localStorage.setItem(k,'1');
 agBanner('warn',i18nT('{1} facture(s) en retard').replace('{1}',late.length),eur(late.reduce((a,f)=>a+faDue(f),0)),`<button class="btn sm" onclick="agBanClose();faTab='fac';histMode='hist';go('histo')">${esc(i18nT('Voir les factures'))}</button>`,15000)}catch(e){}},3500);

/* ---- le chat : « facture Osvald », « Osvald a payé 500 € » ---- */
function faQuoteBadges(x){const F=faOfQuote(x.id);if(!F.length)return'';
 return `<span class="fa-qb">`+F.map(f=>`<button class="tag fa-${faState(f)}" onclick="faShow('${f.id}')" data-noi18n>${esc(f.num)} · ${esc(i18nT(FA_ST[faState(f)]))}</button>`).join(' ')+`</span>`}

/* casô · Le nouveau format : les écrans principaux de la barre du bas.
   Profil (une page, plus de menu latéral), Chantiers (liste, filtres, mode chantier), Documents (à encaisser, en retard,
   Factures · Devis · Échéances, Relancer), Clients (initiale et statut). Les fonctions restent celles des modules :
   ces écrans les présentent, ils ne recalculent rien et n'enregistrent rien eux-mêmes. */
const nfChev='<svg class="i nf-c i-flip"><use href="#i-chev"/></svg>';
const nfRow=(t,js,x)=>`<button type="button" class="nf-r" onclick="${js}"><span class="nf-g">${esc(i18nT(t))}</span>${x||''}${nfChev}</button>`;
const nfNom=x=>vnNorm(String(x&&typeof x==='object'?x.nom||'':x||''));
const nfQuand=n=>agFmtD(n.d,{weekday:'short',day:'numeric',month:'short'})+(n.a?' · '+(+n.a.slice(0,2))+' h'+(n.a.slice(3)!=='00'?' '+n.a.slice(3):''):'');

/* ---------- Profil ---------- */
function profRender(){const box=$('s-prof');if(!box)return;
 const a=accountGet()||{},p=db.prof||{},ouv=typeof ptOuvrier==='function'&&ptOuvrier(),inv=typeof DEC!=='undefined'&&DEC.on;
 try{const n=$('dwName'),c=getSync()||{};if(n)n.textContent=a.prenom||c.user||'';authLigne()}catch(e){}
 const plan=[($('dwPlanA')||{}).textContent,($('dwPlanB')||{}).textContent].filter(Boolean).join(' · '),dot=$('newsDot')&&!$('newsDot').hidden;
 const nouv=dot?`<span class="nf-t w">${esc(i18nT('Nouveau'))}</span>`:'';
 let h='';
 if(inv){h=`<div class="nf-card"><button type="button" class="nf-r" onclick="decConnexion()"><span class="nf-g"><b>${esc(i18nT('Se connecter'))}</b></span>${nfChev}</button>
   <button type="button" class="nf-r" onclick="decCreer()"><span class="nf-g"><b>${esc(i18nT('Créer ton compte'))}</b></span>${nfChev}</button></div>
  <div class="nf-card">${nfRow('Mes services',"go('prix')")}${nfRow('Fournisseurs',"go('fou')")}${nfRow('Newsletter',"go('news')")}${nfRow('Paramètres',"cptPage('app')")}</div>`}
 else{
  /* collaborateur : « Karim · Ouvrier » (dwIdRender) ; patron : son prénom et son nom */
  let nom=[a.prenom,a.nom].filter(Boolean).join(' ')||(getSync()||{}).user||'';if(ouv)try{dwIdRender();nom=($('dwIdN')||{}).textContent||nom}catch(e){}
  h=`<div class="nf-ph">${typeof homeLogo==='function'?homeLogo():''}<div class="nf-g"><b data-noi18n>${esc(nom)}</b>${p.nom?`<span data-noi18n>${esc(p.nom)}</span>`:''}</div>${plan&&!ouv?`<button type="button" class="nf-t w" onclick="dwPlanTap()">${esc(plan)}</button>`:''}</div>`;
  if(ouv)h+=`<div class="nf-card">${nfRow('Mon compte',"cptPage('moi')")}${nfRow('Ma rentabilité',"cptPage('rent')")}${nfRow('Paramètres',"cptPage('app')")}</div>
   <div class="nf-card">${nfRow('Créer mon compte entreprise','eqPro()')}</div>
   <div class="nf-card"><button type="button" class="nf-r" onclick="eqQuitter()"><span class="nf-g">${esc(i18nT('Se déconnecter'))}</span></button></div>`;
  else{const ext=typeof eqExt==='function'&&eqExt();
   h+=`<div class="nf-card">${nfRow('Mon entreprise',"cptPage('ent')")}${nfRow('Mon équipe',"cptPage('team')")}${nfRow('Ma signature',"go('sigp')")}${nfRow('Fournisseurs',"drawerGo('fou')")}${nfRow('Mes services',"go('prix')")}${ext?nfRow('Chantiers chez mon équipe',"cptPage('ext')"):''}</div>
   <div class="nf-card">${nfRow('Abonnement','dwPlanTap()')}${nfRow('Newsletter',"go('news')",nouv)}${nfRow('Paramètres',"cptPage('app')")}${nfRow('Mon compte',"cptPage('acc')")}${nfRow('Sauvegarde',"cptPage('bk')")}</div>
   <div class="nf-card"><button type="button" class="nf-r" onclick="logout()"><span class="nf-g">${esc(i18nT('Se déconnecter'))}</span></button>
    <button type="button" class="nf-r nf-ko" onclick="delOpen()"><span class="nf-g">${esc(i18nT('Supprimer mon compte'))}</span></button></div>`}}
 box.innerHTML=`<h1 class="pg-t">${esc(i18nT('Profil'))}</h1><div class="nf">${h}</div>`;try{aboMenu()}catch(e){}}

/* ---------- Chantiers ---------- */
let chsF='tous';
function chsEtat(x){const t=agToday(),ouvert=db.pts&&typeof summarize==='function'&&(()=>{try{return summarize('all').open.some(s=>s.c===x.c.id)}catch(e){return false}})();
 if(ouvert||(x.nx&&x.nx.d===t))return'cours';if(x.nx)return'venir';return db.pts.some(e=>e.c===x.c.id)?'fini':'venir'}
function chsRender(){const box=$('s-chs');if(!box)return;
 if(typeof ptOuvrier==='function'&&ptOuvrier()){go('pt');return}
 try{ptPlanCh()}catch(e){}
 let L=[];try{L=ptChListe(false).map(x=>Object.assign({e:chsEtat(x)},x))}catch(e){}
 const F=[['tous','Tous'],['cours','En cours'],['venir','À venir'],['fini','Terminés']],T={cours:['ok','En cours'],venir:['','À venir'],fini:['','Terminé']};
 const V=L.filter(x=>chsF==='tous'||x.e===chsF);
 box.innerHTML=`<div class="pg-h"><h1 class="pg-t">${esc(i18nT('Chantiers'))}</h1></div><div class="nf">
  <button type="button" class="nf-mc" onclick="go('mc')"><i><svg class="i"><use href="#i-helmet"/></svg></i><b>${esc(i18nT('Mode chantier'))}</b>${nfChev}</button>
  <div class="nf-ch">${F.map(f=>`<button type="button" class="${chsF===f[0]?'on':''}" onclick="chsF='${f[0]}';chsRender()">${esc(i18nT(f[1]))}</button>`).join('')}</div>
  <div class="nf-card">${V.length?V.map(x=>{const c=x.c,sub=[];
    const rue=String(c.adr||'').split(/\s\d{5}\b|,/)[0].trim().toLowerCase();if(c.adr&&!(rue&&String(c.nom).toLowerCase().includes(rue)))sub.push(esc(c.adr));
    if(x.nx)sub.push(esc(nfQuand(x.nx)));
    return `<button type="button" class="nf-r" onclick="go('pt');ptPage('set')"><span class="nf-g"><b data-noi18n>${esc(c.nom)}</b>${sub.length?`<span data-noi18n>${sub.join(' · ')}</span>`:''}</span><span class="nf-t ${T[x.e][0]}">${esc(i18nT(T[x.e][1]))}</span></button>`}).join('')
   :`<p class="nf-vide">${esc(i18nT('Aucun chantier.'))}</p>`}</div>
  <div class="nf-2">
   <button type="button" class="nf-tl" onclick="go('agenda')"><svg class="i"><use href="#i-cal"/></svg><b>${esc(i18nT('Planning'))}</b></button>
   <button type="button" class="nf-tl" onclick="drawerGo('pt')"><svg class="i"><use href="#i-clock"/></svg><b>${esc(i18nT('Heures'))}</b></button>
  </div>
  <button type="button" class="nf-tl" onclick="go('p3d')"><svg class="i"><use href="#i-plan"/></svg><b class="nf-g">${esc(i18nT('Plan et 3D'))}</b>${nfChev}</button>
  <button type="button" class="nf-b s" onclick="go('pt');ptPage('set');setTimeout(()=>{const i=$('chNew');i&&i.focus()},80)"><svg class="i"><use href="#i-plus"/></svg>${esc(i18nT('Nouveau chantier'))}</button>
 </div>`;try{aboMenu()}catch(e){}}

/* ---------- Mode chantier : quatre gros gestes, écran sombre ---------- */
function mcRender(){const box=$('s-mc');if(!box)return;const AU=window.CasoAuto,g=AU&&AU.gps?AU.gps():null;
 let ici='';try{const o=summarize('all').open[0];if(o)ici=chName(o.c)}catch(e){}
 const B=(ic,t,js)=>`<button type="button" class="mc-b" onclick="${js}"><svg class="i"><use href="#${ic}"/></svg>${esc(i18nT(t))}</button>`;
 box.innerHTML=`<button class="btn sec back" onclick="go('chs')">Retour</button><h1 class="pg-t">${esc(i18nT('Mode chantier'))}</h1>
  <div class="mc">${ici||g==='on'?`<div class="mc-top">${ici?`<b data-noi18n>${esc(ici)}</b>`:'<span></span>'}${g==='on'?`<span class="mc-gps">${esc(i18nT('GPS activé'))}</span>`:''}</div>`:''}
  <div class="mc-g">${B('i-mic','Dicter une note',"go('chat');setTimeout(vnRec,120)")}${B('i-cam','Prendre une photo',"go('chat');setTimeout(chatFilePick,120)")}${B('i-quote','Créer un devis','dvOpen()')}${B('i-clock','Noter mes heures',"go('pt');ptPage('go')")}</div>
  <button type="button" class="mc-go" onclick="go('chat');setTimeout(()=>{const i=$('chatIn');i&&i.focus()},60)"><svg class="i"><use href="#i-mic"/></svg>${esc(i18nT('Parler à casô'))}</button></div>`}

/* ---------- Documents : le haut de page et l'onglet Échéances (le reste est dessiné par renderHisto) ---------- */
function docsTop(){const z=$('docTop');if(!z)return;const p=typeof homePaiements==='function'?homePaiements():{tot:0,ret:0};
 z.innerHTML=`<button type="button" class="nf-2 nf-pay" onclick="drawerGo('enc')"><span><small>${esc(i18nT('À encaisser'))}</small><b class="hm-ok" data-noi18n>${eur(p.tot)}</b></span><span><small>${esc(i18nT('En retard'))}</small><b class="${p.ret>0?'hm-ko':''}" data-noi18n>${eur(p.ret)}</b></span></button>`}
function docsEcheances(){const L=encDues(),t=agToday();
 return L.length?`<div class="nf-card">`+L.map(f=>{const late=f.due&&f.due<t;
  return `<div class="nf-r"><button type="button" class="nf-g nf-in" onclick="faShow('${f.id}')"><b data-noi18n>${esc((f.client&&f.client.nom)||'')}</b><span data-noi18n>${esc(f.num)} · ${eur(faDue(f))}</span><span class="nf-t ${late?'ko':''}">${late?esc(i18nT('En retard')):'<span data-noi18n>'+esc(agFmtD(f.due||f.date,{weekday:undefined}))+'</span>'}</span></button>${late?`<button type="button" class="nf-rel" onclick="faShow('${f.id}');setTimeout(faRelance,150)">${esc(i18nT('Relancer'))}</button>`:nfChev}</div>`}).join('')+`</div>`
  :`<div class="nf-card"><p class="nf-vide">${esc(i18nT('Tout est payé'))}</p></div>`}
{const r=window.renderHisto;if(typeof r==='function'&&!r.nf){const w=function(){const open=histMode==='open';
  if(!open&&faTab==='ech'){$('hiSeg').hidden=false;segOn('hiSeg','ech');$('histoList').innerHTML=docsEcheances();if($('stats'))$('stats').hidden=true;if($('filtres'))$('filtres').hidden=true;docsTop();return}
  const x=r.apply(this,arguments);docsTop();return x};w.nf=1;window.renderHisto=w}}

/* ---------- Clients : initiale, statut ---------- */
function cliStatut(c){const n=nfNom(c.nom),t=agToday();
 const F=(db.invoices||[]).filter(f=>f.num&&f.kind!=='avoir'&&nfNom(f.client)===n&&faDue(f)>0.005);
 if(F.some(f=>f.due&&f.due<t))return['ko','Facture en retard'];
 if((db.events||[]).some(e=>e.t==='rdv'&&e.cid===c.id&&e.d===t))return['ok','Chantier en cours'];
 if(F.length)return['w','Facture en attente'];
 if((db.quotes||[]).some(q=>q.status==='envoye'&&nfNom(q.client)===n))return['w','Devis en attente'];
 return null}
{const r=window.cliRender;if(typeof r==='function'&&!r.nf){const w=function(){const z=$('cliList');if(!z)return;
  const k=vnNorm(($('cliQ')||{}).value||''),L=db.clients.filter(x=>!k||vnNorm(x.nom+' '+(x.tel||'')+' '+(x.adr||'')).includes(k)).sort((a,b)=>a.nom.localeCompare(b.nom));
  z.className='nf-card';z.innerHTML=L.map(x=>{const s=cliStatut(x),ini=(String(x.nom).replace(/^(m\.|mme|mlle|m|monsieur|madame)\s+/i,'').match(/\p{L}/u)||['?'])[0].toUpperCase();
   return `<button type="button" class="nf-r" data-sw="cli:${x.id}" onclick="cliEdit('${x.id}')"><span class="nf-av" data-noi18n>${esc(ini)}</span><span class="nf-g"><b data-noi18n>${esc(x.nom)}</b>${s?`<span class="nf-t ${s[0]}">${esc(i18nT(s[1]))}</span>`:x.tel||x.adr?`<span data-noi18n>${esc([x.tel,x.adr].filter(Boolean).join(' · '))}</span>`:''}</span>${nfChev}</button>`}).join('')
   ||`<p class="nf-vide">${esc(i18nT('Aucun résultat.'))}</p>`};w.nf=1;window.cliRender=w}}

/* pointage : pour le collaborateur, c'est son écran principal (pas de retour vers Chantiers) */
{const r=window.renderPt;if(typeof r==='function'&&!r.nf){const w=function(){const b=document.querySelector('#s-pt .back');if(b)b.hidden=!!(typeof ptOuvrier==='function'&&ptOuvrier());return r.apply(this,arguments)};w.nf=1;window.renderPt=w}}

/* ---------- Plan et 3D : les quatre façons de mesurer une pièce, puis les plans déjà faits ---------- */
function p3dRender(){const box=$('s-p3d');if(!box)return;
 const T=(ic,t,js)=>`<button type="button" class="p3-t" onclick="${js}"><svg class="i"><use href="#${ic}"/></svg><b>${esc(i18nT(t))}</b></button>`;
 const P=(db.plans||[]).slice().sort((a,b)=>(b.upd||b.date||0)-(a.upd||a.date||0)),d=P[0];
 /* le dernier plan : ses mesures, et le bouton pour les reprendre dans le devis (seulement s'il y a un plan) */
 let der='';if(d){let Q=[];try{Q=plQty(d).filter(x=>x.v>0).slice(0,3)}catch(e){}const c=db.clients.find(x=>x.id===d.cid);
  der=`<p class="nf-k" data-noi18n>${esc([d.nom,c&&c.nom].filter(Boolean).join(' · '))}</p>
  <div class="nf-card">${Q.map(x=>`<div class="nf-r"><span class="nf-g">${esc(x.lab)}</span><b data-noi18n>${x.ok||x.u==='u'?'':'~'}${x.u==='u'?x.v:plF(x.v)} ${esc(x.u)}</b></div>`).join('')}
   <button type="button" class="nf-r" onclick="plOpen('${d.id}','p3d')"><span class="nf-g">${esc(i18nT('Voir le plan'))}</span>${nfChev}</button></div>
  <button type="button" class="nf-b" onclick="plOpen('${d.id}','p3d').then(()=>plPage('qty'))">${esc(i18nT('Reprendre les mesures dans le devis'))}</button>`}
 box.innerHTML=`<h1 class="pg-t">${esc(i18nT('Plan et 3D'))}</h1><div class="nf">
  <div class="nf-2">${T('i-cam','Plan depuis une photo','plStart()')}${T('i-360','Tour de la pièce','plStart();plTour()')}${T('i-doc','Lire un plan',"go('chat');setTimeout(chatFilePick,120)")}${T('i-blocks','Vue 3D et vidéo','m3dOpen()')}</div>
  ${der}${P.length>1?`<p class="nf-k">${esc(i18nT('Plans récents'))}</p><div class="lst">${P.slice(1).map(p=>plItem(p,'p3d')).join('')}</div>`:''}</div>`}
{const b=window.plBack;if(typeof b==='function'&&!b.nf){const w=function(){if(typeof PLB!=='undefined'&&PLB==='p3d'){go('p3d');return}return b.apply(this,arguments)};w.nf=1;window.plBack=w}}

/* ---------- Planning, vue Jour : la liste du jour, le résumé, Ajouter, Dicter (la grille horaire n'est plus affichée) ---------- */
{const r=window.agRenderDay;if(typeof r==='function'&&!r.nf){const w=function(){const x=r.apply(this,arguments),z=$('agNf');if(!z)return x;
  const d=agSel,E=agDayEvents(d).slice().sort((a,b)=>(a.a||'').localeCompare(b.a||'')),ouv=typeof ptOuvrier==='function'&&ptOuvrier();
  const H=e=>e.a?(+e.a.slice(0,2))+' h'+(e.a.slice(3)!=='00'?' '+e.a.slice(3):''):'';
  let min=0;E.forEach(e=>{if(e.t==='rdv'&&e.a&&e.b)min+=Math.max(0,agMin(e.b)-agMin(e.a))});
  const rows=E.map(e=>{const c=e.cid&&db.clients.find(k=>k.id===e.cid),ch=e.ch&&db.chantiers.find(k=>k.id===e.ch),sub=[e.adr||(ch&&ch.adr)||(c&&c.adr)||(c&&c.nom)||'',agTeamTxt(e)].filter(Boolean).join(' · ');
   return `<button type="button" class="nf-r" onclick="agEdit('${e.id}','${d}')"><span class="ag-h" data-noi18n>${esc(H(e))}</span><span class="nf-g"><b data-noi18n dir="auto">${esc(e.title||i18nT(e.t==='off'?'Indisponible':'Rendez-vous'))}</b>${sub?`<span data-noi18n>${esc(sub)}</span>`:''}</span></button>`}).join('');
  z.innerHTML=`<div class="nf"><div class="nf-card">${rows||`<p class="nf-vide">${esc(i18nT('Aucun rendez-vous prévu.'))}</p>`}</div>
   ${min||!ouv?`<div class="nf-card">${min?`<div class="nf-r"><span class="nf-g">${esc(i18nT('Temps prévu'))}</span><b data-noi18n>${esc(agFmtH(min))}</b></div>`:''}
    ${ouv?'':nfRow('Tournée de la semaine sur la carte',"go('chat');chatSend('tournée de la semaine')")+nfRow('Rappels',"agPage('set')")}</div>`:''}
   ${ouv?'':`<div class="nf-3"><button type="button" class="nf-b" onclick="agEdit(null,agSel)">${esc(i18nT('Rendez-vous'))}</button><button type="button" class="nf-b s" onclick="agEdit(null,agSel);agTyp('off')">${esc(i18nT('Indisponible'))}</button><button type="button" class="nf-b s" onclick="go('chat');setTimeout(vnRec,120)">${esc(i18nT('Dicter'))}</button></div>`}</div>`;
  return x};w.nf=1;window.agRenderDay=w}}

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
  <button type="button" class="mc-go" onclick="go('chat');setTimeout(()=>{const i=$('chatIn');i&&i.focus()},60)"><svg class="i"><use href="#i-mic"/></svg>${esc(i18nT('Parler à l\'assistant'))}</button></div>`}

/* ---------- Mes paiements (écran Encaissements) : à encaisser, en retard, les échéances avec « Relancer » ;
   l'écran Documents ne garde que les factures et les devis ---------- */
function docsTop(){const z=$('docTop');if(!z)return;const p=typeof homePaiements==='function'?homePaiements():{tot:0,ret:0};
 z.innerHTML=`<div class="nf-2 nf-pay"><span><small>${esc(i18nT('À encaisser'))}</small><b class="hm-ok" data-noi18n>${eur(p.tot)}</b></span><span><small>${esc(i18nT('En retard'))}</small><b class="${p.ret>0?'hm-ko':''}" data-noi18n>${eur(p.ret)}</b></span></div>`}
function docsEcheances(){const L=encDues(),t=agToday();
 return L.length?`<p class="nf-k">${esc(i18nT('Échéances'))}</p><div class="nf-card">`+L.map(f=>{const late=f.due&&f.due<t;
  return `<div class="nf-r"><button type="button" class="nf-g nf-in" onclick="faShow('${f.id}')"><b data-noi18n>${esc((f.client&&f.client.nom)||'')}</b><span data-noi18n>${esc(f.num)} · ${eur(faDue(f))}</span><span class="nf-t ${late?'ko':''}">${late?esc(i18nT('En retard')):'<span data-noi18n>'+esc(agFmtD(f.due||f.date,{weekday:undefined}))+'</span>'}</span></button>${late?`<button type="button" class="nf-rel" onclick="faShow('${f.id}');setTimeout(faRelance,150)">${esc(i18nT('Relancer'))}</button>`:nfChev}</div>`}).join('')+`</div>`
  :''}
{const r=window.encRender;if(typeof r==='function'&&!r.nf){const w=function(){const x=r.apply(this,arguments);docsTop();const d=$('encDue');if(d)d.innerHTML=docsEcheances();return x};w.nf=1;window.encRender=w}}
{const r=window.renderHisto;if(typeof r==='function'&&!r.nf){const w=function(){if(faTab==='ech')faTab='fac';return r.apply(this,arguments)};w.nf=1;window.renderHisto=w}}

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

/* ---------- Plan et 3D : un plan et sa maquette par chantier, faits seulement si l'artisan le veut ----------
   Lire un plan : fichier, photothèque ou appareil photo (photo ou vidéo). casô reconnaît tout seul ce qu'il reçoit :
   un plan (dessin, PDF) est lu en arrière-plan par le module 3D, sans rien afficher ; une vidéo de pièce est relevée en arrière-plan ;
   une photo de pièce part dans « plan depuis une photo ». Ensuite : Vue 3D, Tour de la pièce, Éditer 3D ; avant : Dessiner le plan. */
let P3D_CH=null,P3D_LECT=null;
const p3dMaq=ch=>(db.maq3d||[]).filter(x=>x.ch===ch).sort((a,b)=>(b.at||0)-(a.at||0))[0]||null;
function p3dChantiers(){let L=[];try{ptPlanCh();L=ptChListe(false).map(x=>x.c)}catch(e){L=(db.chantiers||[]).slice()}return L}
function p3dCh(){const L=p3dChantiers();if(!L.some(c=>c.id===P3D_CH))P3D_CH=(L.find(c=>p3dMaq(c.id))||L[0]||{}).id||null;return L.find(c=>c.id===P3D_CH)||null}
function p3dChoix(id){P3D_CH=id;p3dRender()}
/* photo de pièce ou dessin de plan ? un plan est surtout du papier clair, presque sans couleur, traversé de traits foncés */
function p3dEstPlan(f){return new Promise(ok=>{const u=URL.createObjectURL(f),im=new Image();
 im.onload=()=>{try{const W=96,k=W/Math.max(im.naturalWidth,im.naturalHeight),c=document.createElement('canvas');c.width=Math.max(8,Math.round(im.naturalWidth*k));c.height=Math.max(8,Math.round(im.naturalHeight*k));
   const x=c.getContext('2d');x.drawImage(im,0,0,c.width,c.height);const d=x.getImageData(0,0,c.width,c.height).data;let clair=0,couleur=0,n=0;
   for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);n++;if(mx>200&&mx-mn<28)clair++;if(mx-mn>60)couleur++}
   URL.revokeObjectURL(u);ok(clair/n>0.5&&couleur/n<0.12)}catch(e){URL.revokeObjectURL(u);ok(false)}};
 im.onerror=()=>{URL.revokeObjectURL(u);ok(false)};im.src=u})}
function p3dLire(){const c=p3dCh();if(!c){toast(i18nT('Choisis d\'abord le chantier.'));return}
 const s=$('p3dSh'),b=$('p3dBg');b.hidden=false;s.hidden=false;requestAnimationFrame(()=>{s.classList.add('on');b.classList.add('on')})}
function p3dFerme(){const s=$('p3dSh'),b=$('p3dBg');if(!s)return;s.classList.remove('on');b.classList.remove('on');setTimeout(()=>{s.hidden=true;b.hidden=true},200)}
function p3dPrendre(k){p3dFerme();const i=$(k==='cam'?'p3dCam':k==='lib'?'p3dLib':'p3dDoc');if(i){i.value='';i.click()}}
async function p3dFichier(inp){const f=inp&&inp.files&&inp.files[0];if(!f)return;const c=p3dCh();if(!c)return;
 const pdf=f.type==='application/pdf'||/\.pdf$/i.test(f.name||''),vid=/^video\//.test(f.type||'');
 if(!pdf&&!vid&&!/^image\//.test(f.type||'')){toast(i18nT('Fichier non lu : choisis une photo, une vidéo ou un PDF.'));return}
 if(!pdf&&!vid&&!(await p3dEstPlan(f))){/* photo d'une pièce : le plan depuis la photo, rattaché au client du chantier */
  const cl=c.cid?db.clients.find(x=>x.id===c.cid):null;try{plStart(cl?cl.nom:'');plPicked({files:[f],value:''})}catch(e){}return}
 P3D_LECT={ch:c.id,video:vid,lbl:''};p3dRender();m3dCmd({k:vid?'video':'lire',file:f})}
function p3dBusy(m){if(!P3D_LECT)return;P3D_LECT.lbl=m.busy?(m.lbl||'')+(m.n?' · '+Math.min(m.n,m.done+1)+'/'+m.n:''):'';if(!m.busy&&P3D_LECT.video)m3dCmd({k:'data'});if($('s-p3d').classList.contains('on'))p3dRender()}
/* réponse du module : le plan lu (ou relevé) devient la maquette du chantier */
function p3dRecu(type,d){const ch=(P3D_LECT&&P3D_LECT.ch)||(M3D&&M3D.ch)||P3D_CH;
 if(type==='lu'&&!d.ok){P3D_LECT=null;toast(i18nT('Le plan n\'a pas pu être lu. Essaie une photo plus nette, ou dessine-le.'));p3dRender();return}
 if(d.proj&&d.proj.walls&&d.proj.walls.length&&ch){const L=db.maq3d=db.maq3d||[],o=L.find(x=>x.ch===ch)||{id:uid(),ch};
  Object.assign(o,{at:Date.now(),d:{projet:d.proj},mes:d.mesures||null,mini:d.mini||'',need:!!d.need});if(!L.includes(o))L.push(o);
  while(L.length>30)L.shift();M3D&&(M3D.ch=ch);save()}
 P3D_LECT=null;if($('s-p3d').classList.contains('on'))p3dRender()}
/* ouvrir le module sur la maquette du chantier (chargée d'abord si le module a été refermé entre-temps) */
async function p3dOuvrir(k){const c=p3dCh(),x=c&&p3dMaq(c.id);if(!x&&k!=='dessiner')return;
 if(x&&(!M3D||M3D.ch!==c.id)){await m3dCmd({k:'charger',proj:x.d.projet});if(M3D)M3D.ch=c.id}
 if(k==='dessiner'){P3D_LECT={ch:c.id,dessin:true};if(M3D)M3D.ch=c.id}
 m3dCmd({k},true)}
/* mesures → devis : l'artisan coche et choisit le service ; rien n'est ajouté sans lui */
const P3D_Q=[['sol','Sol','m²',/carrel|parquet|(^|[^a-z])sols?([^a-z]|$)|chape|ragr|lino|moquette/],['murs','Murs (peinture)','m²',/peint|enduit|fa[iï]en|placo|papier|mur/],['portes','Portes','u',/porte/],['fenetres','Fenêtres','u',/fen[eê]tre/]];
function p3dDevis(){const c=p3dCh(),x=c&&p3dMaq(c.id),M=x&&x.mes;if(!M)return;const pr=db.prices||[];
 $('p3dQ').innerHTML=P3D_Q.filter(r=>M[r[0]]>0).map(r=>{const g=pr.find(p=>r[3].test(vnNorm(p.nom)));
  return `<div class="pl-ar"><label class="pl-ck"><input type="checkbox" data-q="${r[0]}" ${g?'checked':''}> <span>${esc(i18nT(r[1]))}</span> <b data-noi18n>${r[2]==='u'?M[r[0]]:plF(M[r[0]])} ${r[2]}</b></label>
  <select data-qs="${r[0]}" aria-label="Service"><option value="" data-noi18n>${esc(i18nT('Ligne libre (prix à saisir)'))}</option>${pr.map(p=>`<option value="${p.id}"${g&&g.id===p.id?' selected':''} data-noi18n>${esc(pDisp(p))} · ${eur(p.prix)}/${esc(p.unit)}</option>`).join('')}</select></div>`}).join('');
 const s=$('p3dDv'),b=$('p3dDvBg');b.hidden=false;s.hidden=false;requestAnimationFrame(()=>{s.classList.add('on');b.classList.add('on')})}
function p3dDevisFerme(){const s=$('p3dDv'),b=$('p3dDvBg');if(!s)return;s.classList.remove('on');b.classList.remove('on');setTimeout(()=>{s.hidden=true;b.hidden=true},200)}
function p3dDevisOk(){const c=p3dCh(),x=c&&p3dMaq(c.id),M=x&&x.mes;if(!M)return;
 const sel=[...document.querySelectorAll('#p3dQ input[data-q]:checked')].map(i=>i.dataset.q);if(!sel.length){toast(i18nT('Coche au moins une quantité.'));return}
 const cl=c.cid?db.clients.find(k=>k.id===c.cid):null;if(cl&&q.client&&nameKey(q.client)!==nameKey(cl.nom))chatNew();
 if(cl){q.client=cl.nom;q.tel=q.tel||cl.tel||'';q.adr=q.adr||c.adr||cl.adr||''}else if(c.adr)q.adr=q.adr||c.adr;
 let n=0;sel.forEach(k=>{const r=P3D_Q.find(y=>y[0]===k),pid=document.querySelector(`#p3dQ select[data-qs="${k}"]`).value,p=(db.prices||[]).find(y=>y.id===pid),qty=r[2]==='u'?M[k]:Math.round(M[k]*100)/100;
  if(p)q.lines.push({label:p.nom+' — '+c.nom,qty,unit:p.unit,pu:p.prix,tva:p.tva,loc:p.loc&&p.loc.l===I18N.lang?p.loc.t:undefined});
  else q.lines.push({label:i18nT(r[1])+' — '+c.nom,qty,unit:r[2],pu:0,tva:20});n++});
 fillForm();store();p3dDevisFerme();toast(i18nT('Ajouté au devis.'));go('devis')}
function p3dRender(){const box=$('s-p3d');if(!box)return;
 const L=p3dChantiers(),c=p3dCh(),x=c&&p3dMaq(c.id),lect=P3D_LECT&&c&&P3D_LECT.ch===c.id&&!P3D_LECT.dessin,M=x&&x.mes;
 const T=(ic,t,js,on)=>`<button type="button" class="p3-t" onclick="${js}"${on?'':' disabled'}><svg class="i"><use href="#${ic}"/></svg><b>${esc(i18nT(t))}</b></button>`;
 let h=`<h1 class="pg-t">${esc(i18nT('Plan et 3D'))}</h1><div class="nf">`;
 if(!L.length){box.innerHTML=h+`<div class="nf-card"><p class="nf-vide">${esc(i18nT('Chaque plan est lié à un chantier : ajoute d\'abord le chantier.'))}</p></div>
   <button type="button" class="nf-b" onclick="go('pt');ptPage('set');setTimeout(()=>{const i=$('chNew');i&&i.focus()},80)">${esc(i18nT('Nouveau chantier'))}</button></div>`;return}
 h+=`<label class="p3-ch"><span>${esc(i18nT('Chantier'))}</span><select onchange="p3dChoix(this.value)" aria-label="${esc(i18nT('Chantier'))}">${L.map(k=>`<option value="${k.id}"${c&&k.id===c.id?' selected':''} data-noi18n>${esc(k.nom)}</option>`).join('')}</select></label>
  <div class="nf-2">${T('i-doc','Lire un plan','p3dLire()',!lect)}${T('i-360','Tour de la pièce',"p3dOuvrir('tour')",!!x&&!lect)}${T('i-blocks','Vue 3D',"p3dOuvrir('voir')",!!x&&!lect)}${x?T('i-edit','Éditer 3D',"p3dOuvrir('editer')",!lect):T('i-pen','Dessiner le plan',"p3dOuvrir('dessiner')",!lect)}</div>`;
 if(lect)h+=`<div class="nf-card p3-lec"><div class="nf-r"><span class="p3-sp" aria-hidden="true"></span><span class="nf-g"><b>${esc(i18nT(P3D_LECT.video?'Relevé de la pièce en cours':'Lecture du plan en cours'))}</b>${P3D_LECT.lbl?`<span data-noi18n>${esc(P3D_LECT.lbl)}</span>`:''}</span></div></div>`;
 else if(x){h+=`<div class="p3-mini" role="img" aria-label="${esc(i18nT('Plan'))}">${x.mini||''}</div>`;
  if(M)h+=`<div class="nf-card"><div class="nf-r"><span class="nf-g">${esc(i18nT('Sol'))}</span><b data-noi18n>${plF(M.sol,M.sol<10?1:0)} m²</b></div><div class="nf-r"><span class="nf-g">${esc(i18nT('Murs'))}</span><b data-noi18n>${plF(M.murs,0)} m²</b></div>
   <div class="nf-r"><span class="nf-g">${esc(i18nT('Portes et fenêtres'))}</span><span class="nf-v" data-noi18n>${M.portes} ${esc(i18nT(M.portes>1?'portes':'porte'))} · ${M.fenetres} ${esc(i18nT(M.fenetres>1?'fenêtres':'fenêtre'))}</span></div></div>
   <button type="button" class="nf-b" onclick="p3dDevis()">${esc(i18nT('Reprendre les mesures dans le devis'))}</button>`;
  else h+=`<div class="nf-card"><button type="button" class="nf-r" onclick="p3dOuvrir('editer')"><span class="nf-g"><b>${esc(i18nT('Indique une longueur'))}</b><span>${esc(i18nT('Une seule cote suffit pour calculer les surfaces.'))}</span></span>${nfChev}</button></div>`}
 /* plans faits depuis une photo de pièce pour le client de ce chantier */
 const PP=c&&c.cid?(db.plans||[]).filter(p=>p.cid===c.cid).sort((a,b)=>(b.upd||b.date||0)-(a.upd||a.date||0)):[];
 if(PP.length)h+=`<p class="nf-k">${esc(i18nT('Plans depuis une photo'))}</p><div class="lst">${PP.map(p=>plItem(p,'p3d')).join('')}</div>`;
 box.innerHTML=h+'</div>'}
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

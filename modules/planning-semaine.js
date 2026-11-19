/* casô · Planning de la semaine : carte, tournée, temps prévu, résumé
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- planning de la semaine : carte, tournée, temps prévu, résumé, chantier d'un jour, matériaux (15 novembre) ----------
   Réponses tirées des vraies données (rendez-vous, clients, chantiers, devis) ; rien n'est inventé. La carte s'ouvre dans l'appli de cartes du téléphone. */
function planRoute(t0){const r=' '+String(t0).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/['’]/g,' ').replace(/[?!.,;:]/g,' ').replace(/\s+/g,' ')+' ';
 const has=re=>re.test(r);if(!has(/\b(semaine|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|demain|creneau)\b/))return false;
 const P=n=>String(n).padStart(2,'0'),key=x=>x.getFullYear()+'-'+P(x.getMonth()+1)+'-'+P(x.getDate());
 const now=new Date();now.setHours(12,0,0,0);const mon=o=>{const x=new Date(now);x.setDate(x.getDate()-((x.getDay()+6)%7)+7*o);return x};
 const JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
 const wk=has(/\bsemaine prochaine\b/)?1:has(/\bsemaine (derniere|passee)\b/)?-1:0;
 const evs=(a,b)=>(db.events||[]).filter(e=>e.d>=a&&e.d<=b&&e.t!=='conge').sort((x,y)=>(x.d+(x.a||'')).localeCompare(y.d+(y.a||'')));
 const cli=e=>(db.clients||[]).find(c=>c.id===e.cid)||null,adr=e=>{const ch=(db.chantiers||[]).find(c=>c.cid===e.cid);return ch&&ch.adr||cli(e)&&cli(e).adr||''};
 const jour=d=>{const x=new Date(d+'T12:00:00');return JOURS[x.getDay()]+' '+x.getDate()+'/'+P(x.getMonth()+1)},hrs=e=>{const f=s=>{const m=/(\d{1,2}):(\d{2})/.exec(s||'');return m?+m[1]+m[2]/60:null};const a=f(e.a),b=f(e.b);return a!=null&&b!=null&&b>a?b-a:0};
 const maps=L=>'https://www.google.com/maps/dir/'+L.map(a=>encodeURIComponent(a)).join('/');
 const out=(html)=>{CHAT.m.push({who:'me',text:t0});CHAT.m.push({who:'bot',html:'<div data-noi18n>'+html+'</div>'});return true};
 // un jour précis : « lundi prochain », « mardi », « demain »
 let dayO=null;for(let i=0;i<7;i++)if(has(new RegExp('\\b'+JOURS[i]+'\\b'))){const base=mon(has(/\bprochain\b/)||wk===1?1:wk);const x=new Date(base);x.setDate(x.getDate()+((i+6)%7));if(!has(/\bprochain|semaine\b/)&&key(x)<key(now))x.setDate(x.getDate()+7);dayO=key(x)}
 if(has(/\bdemain\b/)){const x=new Date(now);x.setDate(x.getDate()+1);dayO=key(x)}
 // créneau urgent
 if(has(/\b(creneau|urgen\w*|libre|disponib\w*)\b/)&&dayO){const L=evs(dayO,dayO),matin=has(/\bmatin\b/),fin=matin?12:18;let t=8;const busyS=L.map(e=>[(/(\d+):(\d+)/.exec(e.a)||[0,8,0]),(/(\d+):(\d+)/.exec(e.b)||[0,9,0])]).map(([a,b])=>[+a[1]+a[2]/60,+b[1]+b[2]/60]).sort((x,y)=>x[0]-y[0]);
   let slot=null;for(const[a,b]of busyS){if(a-t>=1){slot=[t,a];break}t=Math.max(t,b)}if(!slot&&fin-t>=1)slot=[t,fin];const hh=v=>Math.floor(v)+' h'+(v%1?P(Math.round(v%1*60)):'');
   let nxt='';if(!slot){for(let k=1;k<=10&&!nxt;k++){const x=new Date(dayO+'T12:00:00');x.setDate(x.getDate()+k);if(x.getDay()===0||x.getDay()===6)continue;const kd=key(x),B=evs(kd,kd).map(e=>[(/(\d+):(\d+)/.exec(e.a)||[0,8,0]),(/(\d+):(\d+)/.exec(e.b)||[0,9,0])]).map(([a,b])=>[+a[1]+a[2]/60,+b[1]+b[2]/60]).sort((x,y)=>x[0]-y[0]);let u=8,sl=null;for(const[a,b]of B){if(a-u>=1){sl=[u,a];break}u=Math.max(u,b)}if(!sl&&fin-u>=1)sl=[u,fin];if(sl)nxt=`Prochain créneau ${matin?'le matin ':''}: ${jour(kd)} de ${hh(sl[0])} à ${hh(sl[1])}.`}}
   const we=/^(samedi|dimanche)/.test(jour(dayO));return out(`${nxt?'<p>'+nxt+'</p>':''}<p>${slot?`Créneau libre ${jour(dayO)} de ${hh(slot[0])} à ${hh(slot[1])}`:`${jour(dayO)} : pas de créneau libre ${matin?'le matin':''}`}${we?' (jour habituellement non travaillé)':''}.</p>${L.length?`<p>Déjà prévu ce jour-là : ${L.map(e=>esc((e.a||'')+' '+e.title)).join(' · ')}</p>`:''}<p>Dites « ajoute un rendez-vous ${jour(dayO).split(' ')[0]} à ${slot?hh(slot[0]):'8 h'} chez … » pour le réserver.</p>`)}
 if(dayO&&has(/\b(chantier|travaille|interviens|materiaux|fournitures|materiel|infos?|informations|montre|prevu)\b/)){const L=evs(dayO,dayO);if(!L.length)return out(`<p>Rien de prévu ${esc(jour(dayO))}.</p>`);
   const parts=L.map(e=>{const c=cli(e),q=c?(db.quotes||[]).filter(x=>x.client===c.nom).sort((a,b)=>String(b.date).localeCompare(String(a.date))):[];
     if(has(/\b(materiaux|fournitures|materiel)\b/)){const lines=q[0]?q[0].lines.filter(l=>!/main d|heure|deplacement/i.test(l.label)):[];return`<p><b>${esc(e.title)}</b> (${esc(c?c.nom:'')}) — d'après le devis ${q[0]?esc(q[0].num):'(aucun devis)'} :</p>${lines.length?'<ul>'+lines.map(l=>`<li>${esc(l.label)} : ${l.qty} ${esc(l.unit||'')}</li>`).join('')+'</ul>':'<p>Aucun matériau dans le devis.</p>'}`}
     return`<p><b>${esc(jour(dayO))}, ${esc(e.a||'')}–${esc(e.b||'')} : ${esc(e.title)}</b><br>${esc(c?c.nom:'')}${c&&c.tel?' · '+esc(c.tel):''}<br>${esc(adr(e))} — <a href="${maps([adr(e)])}" target="_blank" rel="noopener">voir sur la carte</a>${q.length?`<br>Devis : ${q.map(x=>esc(x.num+' ('+(x.status||'')+')')).join(', ')}`:''}</p>`});
   return out(parts.join(''))}
 if(!has(/\bsemaine\b/))return false;
 const a=key(mon(wk)),fri=new Date(mon(wk));fri.setDate(fri.getDate()+6);const b=key(fri),L=evs(a,b),lab=wk===1?'la semaine prochaine':wk===-1?'la semaine dernière':'cette semaine';
 /* seulement les demandes de planning : « combien d'heures cette semaine » (heures pointées) reste au pointage */
 const qT=has(/\b(combien de temps|temps prevu|duree|heures? (prevues?|planifiees?|de (travail|chantier) prevues?))\b/)||has(/\bheures?\b/)&&has(/\b(prevu\w*|planning|rendez|rdv|chantiers?|clients?|interventions?|passer|consacr\w*)\b/);
 if(!(qT||has(/\b(carte|lieux|adresses?|ou (je|j)|itineraire|tournee|trajets?|deplacements?|organise|ordre|photos?|mesures?|historique|retrouve|resume|recap\w*|bilan|rapport|synthese|projets?|maisons)\b/)))return false;
 if(!L.length)return out(`<p>Aucun rendez-vous ${lab}.</p>`);
 if(has(/\b(carte|lieux|adresses?|ou (je|j)|itineraire|tournee|trajets?|deplacements?|organise|ordre)\b/)){const A=L.map(adr).filter(Boolean),villes={};L.forEach(e=>{const v=(adr(e).split(',').pop()||'').trim()||'?';(villes[v]=villes[v]||[]).push(e)});
   const opt=has(/\b(limiter|optimis|organise|ordre|moins)\b/);
   return out(`<p>Vos lieux de travail ${lab} :</p><ul>${L.map(e=>`<li>${esc(jour(e.d))} ${esc(e.a||'')} — ${esc(cli(e)?cli(e).nom:e.title)} : ${esc(adr(e)||'adresse inconnue')}</li>`).join('')}</ul><p><a href="${maps(A)}" target="_blank" rel="noopener">Ouvrir l'itinéraire de la semaine sur la carte</a></p>${opt?`<p>${Object.keys(villes).length} villes : ${Object.entries(villes).map(([v,es])=>esc(v)+' ('+es.length+')').join(', ')}. ${Object.values(villes).some(es=>es.length>1)?'Regroupez les chantiers d\'une même ville sur des jours qui se suivent.':'Chaque chantier est dans une ville différente : l\'ordre ne se raccourcit qu\'en déplaçant des rendez-vous.'} Je n'ai pas les distances (aucun service de calcul d'itinéraire n'est relié) : la carte les donne.</p>`:''}`)}
 if(qT){const T={};L.forEach(e=>{const k=cli(e)?cli(e).nom:e.title;T[k]=(T[k]||0)+hrs(e)});const tot=Object.values(T).reduce((x,y)=>x+y,0);
   return out(`<p>Temps prévu ${lab} : ${planH(tot)}</p><ul>${Object.entries(T).map(([k,h])=>`<li>${esc(k)} : ${planH(h)}</li>`).join('')}</ul>`)}
 if(has(/\b(photos?|mesures?|historique|retrouve)\b/)){const cs=[...new Set(L.map(e=>e.cid))].map(id=>(db.clients||[]).find(c=>c.id===id)).filter(Boolean);return out(`<p>${lab[0].toUpperCase()+lab.slice(1)}, vous êtes intervenu chez : ${cs.map(c=>esc(c.nom)).join(', ')||'—'}.</p><ul>${L.map(e=>`<li>${esc(jour(e.d))} : ${esc(e.title)} — ${esc(adr(e))}</li>`).join('')}</ul><p>Photos et mesures : je ne trouve rien d’enregistré pour ${cs.length>1?'ces chantiers':'ce chantier'} dans casô. Les maquettes 3D filmées sont dans la Maquette 3D, avec leurs mesures.</p>`)}
 if(has(/\b(resume|recap\w*|bilan|rapport|synthese|projets?|maisons)\b/)){const cs=[...new Set(L.map(e=>e.cid))].map(id=>(db.clients||[]).find(c=>c.id===id)).filter(Boolean);
   const tot=L.reduce((x,e)=>x+hrs(e),0);return out(`<p>${lab[0].toUpperCase()+lab.slice(1)} : ${L.length} intervention${L.length>1?'s':''}, ${cs.length} chantier${cs.length>1?'s':''}, ${planH(tot)} prévues.</p><ul>${L.map(e=>`<li>${esc(jour(e.d))} ${esc(e.a||'')}–${esc(e.b||'')} : ${esc(e.title)} — ${esc(adr(e))}</li>`).join('')}</ul>${cs.map(c=>{const q=(db.quotes||[]).filter(x=>x.client===c.nom);return q.length?`<p>${esc(c.nom)} : devis ${q.map(x=>esc(x.num+' '+(x.status||''))).join(', ')}</p>`:''}).join('')}`)}
 return false}
function planH(h){const H=Math.floor(h),M=Math.round((h-H)*60);return H+' h'+(M?' '+String(M).padStart(2,'0'):'')}
function chatSend(text){
 const inp=$('chatIn');const t0=String(text??inp.value).trim();if(!t0)return;
 /* une phrase à plusieurs demandes est en cours : la suivante attend son tour */
 if(chatMulti.busy&&!chatSend.multi){inp.value='';setTimeout(()=>chatSend(t0),400);return}
 /* premier message : le modèle qui comprend les fautes doit être là */
 if(window.casoPont&&casoPont.ready&&!casoPont.miniOk&&casoPont.miniPret){if(!chatSend.att){chatSend.att=1;casoPont.miniPret().then(()=>{chatSend.att=0;chatSend(t0)})}return}
 /* « casô note » / « casô fin » tapés ou dictés : ce sont des commandes de la dictée, pas du texte */
 {const tn=t0.replace(VN_END,'$1').replace(new RegExp(VN_WAKE.source,'giu'),'$1').replace(/\s+/g,' ').trim();if(tn!==t0){if(tn)return chatSend(tn);inp.value='';chatGrow(inp);qkUpdate();if(VN_WAKE.test(t0)){if(VN.mode!=='note')vnRec()}else if(VN.mode==='note')vnStop();return}}
 /* réponse à la question que le chat vient de poser (chantier, fournisseur, plan ou document) */
 const adrSeule=chAdrSeule(t0);
 if(CH_ASK&&chReponse(t0)){inp.value='';chatGrow(inp);qkUpdate();chatSave();chatRender(true);return}
 /* planning de la semaine, d'un jour, créneau : réponses tirées des rendez-vous, clients et devis */
 {let pr=false;try{pr=!chatSend.multi&&planRoute(t0)}catch(e){try{console.error(e)}catch(_){}}if(pr){inp.value='';chatGrow(inp);qkUpdate();chatSave();chatRender(true);return}}
 /* ce qui se voit sur une vidéo ou des photos (inventaire, défauts, surfaces, cloisons, chantier filmé) : le travail de l'œil 3D */
 {const r=' '+t0.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’]/g,' ')+' ';
  if(!chatSend.multi&&/\b(identifie|analyse|inventaire|reconnais|reconstrui\w*|modele 3d|maquette 3d|representation 3d|fissures?|humidite|degradations?|surface (des murs|de cette|du sol|de la facade)|variantes? d amenagement|cloisons?|outils|machines|parpaings?|palettes?|materiaux visibles|equipements de securite|travaux .{0,20}realis\w*|zones de stockage)\b/.test(r)&&/\b(cette|ce|ces|cet|cette video|mes photos|ma|mon)\b/.test(r)&&!/\b(devis|facture|client|fournisseur|rendez|rdv|planning)\b/.test(r)){
   CHAT.m.push({who:'me',text:t0});CHAT.m.push({who:'bot',html:'<p data-noi18n>C’est un travail pour l’œil 3D. Ouvrez la Maquette 3D, partie Rénovation : filmez la pièce ou le chantier (ou choisissez une photo de face de chaque mur), puis reposez votre question dans son chat. Je vous donnerai alors les éléments, les surfaces ou les défauts repérés, avec leur niveau de confiance.</p>'});
   inp.value='';chatGrow(inp);qkUpdate();chatSave();chatRender(true);return}}
 /* « non » juste après une action : comme le bouton Annuler de sa bulle */
 if(/^(non|nan|no|não|nao|nu|nie|hayır|hayir|нет|لا)[.!]*$/i.test(t0)&&chatNonUndo()){inp.value='';chatGrow(inp);qkUpdate();CHAT.m.push({who:'me',text:t0});CHAT.m.push({who:'bot',html:`<p data-noi18n>${esc(window.casoPont&&casoPont.ready?casoPont.tr('D’accord, j’ai annulé. ').trim():'D’accord, j’ai annulé.')}</p>`});try{if(!(casoPont.refuser&&casoPont.refuser())){casoPont.B.S.lastTurn=null;casoPont.B.S.pending=null}}catch(e){}chatSave();chatRender(true);return}
 /* équipe : « Karim est dans mon équipe », son numéro, « j'ai payé Karim 300 € », « Karim 15 € de l'heure » */
 if(!adrSeule&&typeof eqChat==='function'&&eqChat(t0)){inp.value='';chatGrow(inp);qkUpdate();return}
 if(window.casoPont&&casoPont.ready&&!adrSeule){
  /* « le client d'hier », « la dame de la rue des Lilas » : le chat met le nom du client ; la phrase tapée reste affichée */
  if(casoPont.renvoi&&!chatSend.renv){const r=casoPont.renvoi(t0);if(r===true){inp.value='';chatGrow(inp);qkUpdate();return}if(r&&r!==t0){chatSend.renv=1;try{chatSend(r)}finally{chatSend.renv=0}
   for(let i=CHAT.m.length-1;i>=0;i--){const m=CHAT.m[i];if(m.who==='me'){if(m.text===r){m.text=t0;chatSave();chatRender(false)}break}}return}}
  /* plusieurs demandes dans la même phrase */
  if(casoPont.decoupe&&!chatSend.multi){const parts=casoPont.decoupe(t0);if(parts){chatMulti(t0,parts);return}}
  /* questions sur l'activité, durée d'un travail, devis depuis une description */
  if(casoPont.question&&(casoPont.oui(t0)||casoPont.messageClient(t0)||casoPont.renoDevis(t0)||casoPont.marge(t0)||casoPont.question(t0)||casoPont.duree(t0)||casoPont.decrire(t0))){inp.value='';chatGrow(inp);qkUpdate();return}}
 if(!adrSeule&&window.casoPont&&casoPont.essaie(t0)){inp.value='';chatGrow(inp);qkUpdate();return}
 let t=t0;try{let lg=VN.lang||'fr';const dt=vlDetect(t0);if(dt&&dt.score>=3)lg=dt.l;t=chatFix(t0,lg)}catch(e){t=t0}
 if(t!==t0)setTimeout(()=>{for(let i=CHAT.m.length-1;i>=0;i--){const m=CHAT.m[i];if(m.who==='me'){if(m.text===t&&!m.orig){m.orig=t0;chatSave();chatRender(false)}break}}},0);
 inp.value='';chatGrow(inp);qkUpdate();
 /* phrase corrigée (« أضف طابا » → « أضف طابق ») : le chat la reprend si la phrase tapée ne lui disait rien */
 if(t!==t0&&!adrSeule&&window.casoPont&&casoPont.essaie(t))return;
 if(typeof faChat==='function'&&faChat(t))return;
 if(typeof svcChat==='function'&&svcChat(t))return;
 if(typeof prixChat==='function'&&prixChat(t))return;
 if(typeof agChat==='function'&&agChat(t))return;
 if(!adrSeule&&window.casoPont&&casoPont.essaie(t,true))return;
 /* une consigne, une définition, un récit (« retiens… », « mets plutôt… », « on a déposé… ») : rien n'est écrit dans le devis */
 if(window.casoPont&&casoPont.pasTravail&&casoPont.pasTravail(t)){CHAT.m.push({who:'me',text:t});CHAT.m.push({who:'bot',html:`<p data-noi18n>${esc(casoPont.ready?casoPont.incompris():'Je n’ai pas compris.')}</p>`});chatSave();chatRender(true);return}
 const R=parseNote(t,db.prices,VN.lang);VN.last=R;
 /* « Lui Dire », « Carreler » : des mots de la phrase, pas un client ; « FONTAINE » tapé en majuscules : Fontaine */
 const nomOk=n=>!(window.casoPont&&casoPont.ready&&casoPont.pasUnNom(n)),casse=chatCasse;
 if(R.client)R.client=nomOk(R.client)?casse(R.client):null;
 const det=vlDetect(vnAfter(t));
 if(det&&det.l!==VN.lang&&det.score>=3){vnSetLang(det.l);toast(vlT(12).replace('{l}',VL_DEF[det.l].n))}
 if(!db.notes)db.notes=[];db.notes.unshift({id:uid(),date:new Date().toISOString(),texte:t});db.notes=db.notes.slice(0,30);
 readForm();const before=JSON.stringify(q);
 if(CHAT.qid!==q.id)CHAT={qid:q.id,m:[]};
 CHAT.m.push({who:'me',text:t});
 const out=[];let any=false;
 if(!R.client){const kc=knownClient(t);if(kc)R.client=kc.nom}
 let cand=R.client?null:nameCand(t,R),pick=null;if(cand)cand=nomOk(cand)?casse(cand):null;
 if(!R.client&&cand&&cliMatches(cand).length){R.client=cand;cand=null}
 if(R.client){const M=cliMatches(R.client);if(M.length===1&&!M.fz)R.client=M[0].nom;else if(M.length){pick=cliPickHtml(R.client,M,'q');R.client=null}}
 if(R.client){
  const {x,isNew}=upsert('clients',{nom:R.client,tel:R.tel,adr:R.adr,email:R.email});CH_PEND=null;
  q.client=x.nom;if(!q.tel)q.tel=x.tel||R.tel||'';if(!q.adr)q.adr=x.adr||R.adr||'';any=true;
  out.push(`<p><svg class="i i-sm"><use href="#i-user"/></svg> <span>Client</span> : <b data-noi18n>${esc(x.nom)}</b> <span class="pill-s ${isNew?'new':''}">${isNew?'Nouveau, ajouté à tes clients':'Déjà dans tes clients'}</span></p>`)}
 else{if(R.tel&&!q.tel)q.tel=R.tel;if(R.adr&&!q.adr)q.adr=R.adr;CH_PEND=(R.tel||R.adr||R.email)?{tel:R.tel||'',adr:R.adr||'',email:R.email||''}:null}
 if(pick)out.push(pick);
 if(R.email)out.push(`<p><svg class="i i-sm"><use href="#i-mail"/></svg> <span data-noi18n>${esc(R.email)}</span></p>`);
 if(R.adr)out.push(`<p><svg class="i i-sm"><use href="#i-pin"/></svg> <span data-noi18n>${esc(R.adr)}</span></p>`);
 (R.suppliers||[]).forEach(n=>{const {x,isNew}=upsert('suppliers',{nom:n});any=true;
  out.push(`<p><svg class="i i-sm"><use href="#i-truck"/></svg> <span>Fournisseur</span> : <b data-noi18n>${esc(x.nom)}</b> <span class="pill-s ${isNew?'new':''}">${isNew?'Nouveau, ajouté à tes fournisseurs':'Déjà dans tes fournisseurs'}</span></p>`)});
 if(R.objet)out.push(`<p class="mut" data-noi18n>${esc(R.objet)}</p>`);
 if(R.dims)out.push(`<p class="mut"><svg class="i i-sm"><use href="#i-area"/></svg> <span>Surface</span> : <span data-noi18n>${fmtN(R.dims.a)} m × ${fmtN(R.dims.b)} m = </span><b data-noi18n>${fmtN(R.dims.area)} m²</b></p>`);
 (R.dim1||[]).forEach(d=>out.push(`<p class="mut"><svg class="i i-sm"><use href="#i-${d.k==='largeur'?'width':d.k==='hauteur'?'height':'ruler'}"/></svg> <span>${d.k==='largeur'?'Largeur':d.k==='hauteur'?'Hauteur':'Longueur'}</span> : <span data-noi18n>${fmtN(d.v)} m</span></p>`));
 if(cand)out.push(`<!--sg--><div class="sugg"><p>« <b data-noi18n>${esc(cand)}</b> » : <span>c'est un client ou un fournisseur ?</span></p><div class="msg-act"><button class="btn sm" data-n="${esc(cand)}" onclick="chatAddAs('cli',this)"><svg class="i"><use href="#i-user"/></svg>Client</button><button class="btn sm sec" data-n="${esc(cand)}" onclick="chatAddAs('fou',this)"><svg class="i"><use href="#i-truck"/></svg>Fournisseur</button></div></div><!--/sg-->`);
 else if(!pick&&R.adr){const sa=chAdrAsk(R);if(sa)out.push(sa)}
 if(R.travaux.length){any=true;
  q.lines=q.lines.filter(l=>l.label||l.pu);
  R.travaux.forEach(l=>q.lines.push({label:l.label,qty:l.qty,unit:l.unit,pu:l.pu,tva:l.tva}));
  out.push(`<div class="msg-lines">`+R.travaux.map(l=>`<div class="ml"><div><b data-noi18n lang="fr">${esc(l.label)}</b><div class="mut" data-noi18n>${l.qty==null?'':fmtN(l.qty)+' '}${esc(l.unit)}${l.pu?' × '+eur(l.pu):''}</div>${l.ok||l.warn?'':'<div class="vn-w">Pas dans tes prix : prix à remplir</div>'}${l.warn?'<div class="vn-w">'+esc(l.warn)+'</div>':''}</div><b>${l.pu&&l.qty!=null?eur(l.qty*l.pu):''}</b></div>`).join('')+`</div>`);
  const vf=window.casoPont&&casoPont.verifier?casoPont.verifier(q):'';if(vf)out.push(vf)}
 if(cand)R.remarques=R.remarques.filter(x=>vnNorm(x)!==vnNorm(cand));
 if(R.remarques.length)out.push(`<p class="mut"><b>Remarques</b> : <span data-noi18n dir="auto">${esc(R.remarques.join(' · '))}</span></p>`);
 if(R.todo.length)out.push(`<p class="mut"><b>À faire</b> : <span data-noi18n dir="auto">${esc(R.todo.join(' · '))}</span></p>`);
 /* « il faut commander la colle », « attention humidité » : gardés sur le devis (Notes, jamais montrées au client) */
 const nts=R.todo.map(t=>({k:'todo',t})).concat((R.remOk||[]).filter(t=>!cand||vnNorm(t)!==vnNorm(cand)).map(t=>({k:'rem',t}))).filter(n=>!(q.notes||[]).some(x=>vnNorm(x.t)===vnNorm(n.t)));
 if(nts.length)q.notes=(q.notes||[]).concat(nts);
 if(nts.length&&!any){
  fillForm();store();
  out.push(`<div class="msg-act"><button class="btn sm sec" onclick="go('edit')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>`);
  CHAT.m.push({who:'bot',html:out.join(''),undo:before});
 }else if(any){
  fillForm();store();
  const tt=totals(q);
  out.push(`<div class="msg-tot"><span>Total du devis</span><b>${eur(tt.ttc)} TTC</b></div>
   <div class="msg-act"><button class="btn sm sec" onclick="go('edit')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button>${q.lines.length?`<button class="btn sm" onclick="goSign()"><svg class="i"><use href="#i-pen"/></svg>Valider le devis</button>`:''}</div>`);
  CHAT.m.push({who:'bot',html:out.join(''),undo:before});
 }else if(pick||cand||R.adr||R.dims||(R.dim1||[]).length){
  fillForm();save();CHAT.m.push({who:'bot',html:out.join('')});
 }else if(window.casoPont&&casoPont.travail&&casoPont.travail(t)){
  /* dernier recours : un travail dit sans « faut » (« refaire la gouttière ») est gardé dans les notes À faire du devis */
 }else{
  save();
  CHAT.m.push({who:'bot',html:`<p data-noi18n>${esc(window.casoPont&&casoPont.ready?casoPont.incompris():'Je n’ai pas compris.')}</p>`});
 }
 chatSave();chatRender(true)}

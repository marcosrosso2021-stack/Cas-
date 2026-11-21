/* casô · Accueil : l'essentiel en un coup d'œil.
   - le logo de l'entreprise (ou ses initiales) et « Bonjour <prénom> » ;
   - deux grandes actions : Nouveau devis, Nouvelle facture ;
   - Mes paiements (à encaisser, en retard) → Mes paiements ;
   - Planning, Pointage (le chantier pointé en ce moment), Mode chantier ;
   - Mes travaux en cours : la liste seule, sans bouton.
   C'est le premier écran pour tout le monde. Sans compte : le logo casô seul, sans « Bonjour ».
   Rien n'est calculé ici : les chiffres viennent des modules (paiement.js, pointage.js). */
function homeLogo(){const p=db.prof||{},ok=typeof rcImg==='function'&&rcImg(p.logo),ini=typeof mqInitiales==='function'?mqInitiales(p.nom):'';
 return ok?`<span class="hm-lg img"><img src="${p.logo}" alt=""></span>`:ini?`<span class="hm-lg" data-noi18n>${esc(ini)}</span>`:`<span class="hm-lg cso"><img src="icon-512.png" alt="casô"></span>`}
function homePaiements(){let tot=0,ret=0;const t=agToday();
 try{encDues().forEach(f=>{const d=faDue(f);tot+=d;if(f.due&&f.due<t)ret+=d})}catch(e){}
 return{tot:faR2(tot),ret:faR2(ret)}}
/* travaux en cours : le chantier pointé en ce moment ou prévu aujourd'hui (même règle que l'écran Chantiers) */
function homeTravaux(){let L=[];try{L=ptChListe(false).filter(x=>chsEtat(x)==='cours')}catch(e){}return L}
function homeRender(){const box=$('s-home');if(!box)return;
 const a=accountGet()||{},p=db.prof||{},pre=a.prenom||(typeof getSync==='function'&&(getSync()||{}).user)||'';
 const pay=homePaiements(),t=agToday();let auj=0,ici='';
 try{auj=agDayEvents(t).filter(e=>e.t==='rdv').length}catch(e){}
 try{const o=summarize('all').open[0];if(o)ici=chName(o.c)}catch(e){}
 const W=homeTravaux(),chev='<svg class="i i-flip"><use href="#i-chev"/></svg>';
 const tuile=(ic,ti,sub,js,on)=>`<button type="button" class="hm-tl${on?' on':''}" onclick="${js}"><i><svg class="i"><use href="#${ic}"/></svg></i><b>${esc(i18nT(ti))}</b>${sub?`<span>${sub}</span>`:''}</button>`;
 box.innerHTML=`<div class="hm">
  <div class="hm-h">${homeLogo()}${!(typeof mqCompte==='function'&&mqCompte())?'':`<div class="hm-w"><b>${esc(i18nT('Bonjour'))}${pre?' <span data-noi18n style="font:inherit;color:inherit">'+esc(pre)+'</span>':''}</b>${p.nom?`<span data-noi18n>${esc(p.nom)}</span>`:''}</div>`}</div>
  <div class="hm-2">
   <button type="button" class="hm-a" onclick="dvOpen()"><svg class="i"><use href="#i-quote"/></svg><span>${esc(i18nT('Nouveau devis'))}</span></button>
   <button type="button" class="hm-a d" onclick="go('fact')"><svg class="i"><use href="#i-doc"/></svg><span>${esc(i18nT('Nouvelle facture'))}</span></button>
  </div>
  <button type="button" class="hm-c" onclick="drawerGo('enc')"><span class="hm-t"><b>${esc(i18nT('Mes paiements'))}</b>${chev}</span>
   <span class="hm-m"><span><small>${esc(i18nT('À encaisser'))}</small><b class="hm-ok" data-noi18n>${eur(pay.tot)}</b></span><span><small>${esc(i18nT('En retard'))}</small><b class="${pay.ret>0?'hm-ko':''}" data-noi18n>${eur(pay.ret)}</b></span></span></button>
  <div class="hm-3">
   ${tuile('i-cal','Planning',auj?'<span data-noi18n>'+auj+'</span> '+esc(i18nT(auj>1?'passages':'passage')):'',"go('agenda')")}
   ${tuile('i-clock','Pointage',ici?'<span data-noi18n>'+esc(ici)+'</span>':'',"drawerGo('pt');ptPage('go')",!!ici)}
   ${tuile('i-helmet','Mode chantier','',"go('mc')")}
  </div>
  ${W.length?`<p class="hm-k">${esc(i18nT('Mes travaux en cours'))}</p><div class="hm-l">${W.map(x=>{const cl=homeClient(x.c);
   return `<div class="hm-li"><b data-noi18n>${esc(x.c.nom)}</b>${cl?`<span data-noi18n>${esc(cl)}</span>`:''}</div>`}).join('')}</div>`:''}
 </div>`;
 try{aboMenu()}catch(e){}}
/* client d'un chantier : la fiche liée (cid), sinon rien — le nom du chantier porte souvent déjà le client */
function homeClient(c){const x=c&&c.cid&&(db.clients||[]).find(k=>k.id===c.cid);if(!x||!x.nom)return'';
 return String(c.nom||'').toLowerCase().includes(String(x.nom).toLowerCase())?'':x.nom}
/* à l'ouverture : l'Accueil est l'écran affiché d'office (index.html) ; on le remplit. Le collaborateur arrive sur ses chantiers. */
setTimeout(()=>{try{if(document.body.classList.contains('starting')||!$('s-home').classList.contains('on'))return;
 if(typeof ptOuvrier==='function'&&ptOuvrier()){go('pt');return}
 go('home')}catch(e){}},0);

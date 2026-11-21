/* casô · Accueil : l'essentiel en un coup d'œil.
   - le logo de l'entreprise (ou ses initiales) et « Bonjour <prénom> » ;
   - deux grandes actions : Nouveau devis, Nouvelle facture ;
   - Mes paiements (à encaisser, en retard) → Encaissements ;
   - Mes chantiers (le prochain passage) → Chantiers ;
   - la barre « Écris ou parle à casô » → le chat.
   Rien n'est calculé ici : les chiffres viennent des modules (paiement.js, pointage.js). */
function homeLogo(){const p=db.prof||{},ok=typeof rcImg==='function'&&rcImg(p.logo),ini=typeof mqInitiales==='function'?mqInitiales(p.nom):'';
 return ok?`<span class="hm-lg img"><img src="${p.logo}" alt=""></span>`:ini?`<span class="hm-lg" data-noi18n>${esc(ini)}</span>`:`<span class="hm-lg"><svg class="i"><use href="#i-user"/></svg></span>`}
function homePaiements(){let tot=0,ret=0;const t=agToday();
 try{encDues().forEach(f=>{const d=faDue(f);tot+=d;if(f.due&&f.due<t)ret+=d})}catch(e){}
 return{tot:faR2(tot),ret:faR2(ret)}}
function homeRender(){const box=$('s-home');if(!box)return;
 const a=accountGet()||{},p=db.prof||{},pre=a.prenom||(typeof getSync==='function'&&(getSync()||{}).user)||'';
 const pay=homePaiements();let L=[];try{L=ptChListe(false).filter(x=>x.nx)}catch(e){}
 const x=L[0],quand=x?agFmtD(x.nx.d,{weekday:'short',day:'numeric',month:'short'})+(x.nx.a?' · '+(+x.nx.a.slice(0,2))+' h'+(x.nx.a.slice(3)!=='00'?' '+x.nx.a.slice(3):''):''):'';
 const chev='<svg class="i i-flip"><use href="#i-chev"/></svg>';
 box.innerHTML=`<div class="hm">
  <div class="hm-h">${homeLogo()}<div class="hm-w"><b>${esc(i18nT('Bonjour'))}${pre?' <span data-noi18n style="font:inherit;color:inherit">'+esc(pre)+'</span>':''}</b>${p.nom?`<span data-noi18n>${esc(p.nom)}</span>`:''}</div></div>
  <div class="hm-2">
   <button type="button" class="hm-a" onclick="dvOpen()"><svg class="i"><use href="#i-quote"/></svg><span>${esc(i18nT('Nouveau devis'))}</span></button>
   <button type="button" class="hm-a d" onclick="go('fact')"><svg class="i"><use href="#i-doc"/></svg><span>${esc(i18nT('Nouvelle facture'))}</span></button>
  </div>
  <button type="button" class="hm-c" onclick="drawerGo('enc')"><span class="hm-t"><b>${esc(i18nT('Mes paiements'))}</b>${chev}</span>
   <span class="hm-m"><span><small>${esc(i18nT('À encaisser'))}</small><b class="hm-ok" data-noi18n>${eur(pay.tot)}</b></span><span><small>${esc(i18nT('En retard'))}</small><b class="${pay.ret>0?'hm-ko':''}" data-noi18n>${eur(pay.ret)}</b></span></span></button>
  <button type="button" class="hm-c" onclick="go('pt');ptPage('set')"><span class="hm-t"><b>${esc(i18nT('Mes chantiers'))}</b>${L.length?`<span data-noi18n>${L.length}</span>`:chev}</span>
   ${x?`<span class="hm-r"><span class="hm-ri"><svg class="i"><use href="#i-helmet"/></svg></span><span class="hm-rt"><b data-noi18n>${esc(x.c.nom)}</b><span data-noi18n>${esc(quand)}</span></span></span>`:''}</button>
  <button type="button" class="hm-q" onclick="go('chat');setTimeout(()=>{const i=$('chatIn');i&&i.focus()},60)"><span>${esc(i18nT('Écris ou parle à casô'))}</span><i><svg class="i"><use href="#i-mic"/></svg></i></button>
 </div>`;
 try{aboMenu()}catch(e){}}
/* à l'ouverture, avec un compte : l'Accueil (le visiteur sans compte arrive sur le chat, le collaborateur sur ses chantiers) */
setTimeout(()=>{try{if(document.body.classList.contains('starting')||!$('s-chat').classList.contains('on'))return;
 if(typeof ptOuvrier==='function'&&ptOuvrier()){go('pt');return}
 if(accountGet())go('home')}catch(e){}},0);

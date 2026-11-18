/* casô · Fournisseurs : liste, fiche, prix en ligne, import intelligent, devis et factures des fournisseurs
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Fournisseurs : liste, fiche, prix en ligne ---------- */
let fouCur=null;
/* Fournisseurs : une seule barre, deux onglets. « Mes fournisseurs » filtre la liste ; « Prix en ligne » interroge le serveur casô
   (sa clé reste sur le serveur) : prix publics TTC, ajoutés à Mes prix en HT (TVA 20 %), le magasin devient le fournisseur */
let FOU_M='mes',PRX=[],PRX_N=0,PRX_B='',PRX_F='',PRX_NO=new Set();const PRX_C=new Map();
function prxPays(){const r=String(navigator.language||'').split('-')[1];return /^(FR|BE|CH|LU|ES|PT|IT|DE|NL|GB|US|CA|RO|PL|TR|MA)$/.test(r||'')?r:'FR'}
function prxPrix(x){if(x.devise==='EUR')return eur(x.prix);try{return new Intl.NumberFormat(document.documentElement.lang||'fr',{style:'currency',currency:x.devise}).format(x.prix)}catch(e){return x.prix+' '+x.devise}}
/* où est le serveur casô : celui qui a déjà répondu, l'adresse fixée, le site ouvert (appli servie par le serveur), le poste de l'entreprise, puis l'adresse par défaut */
function prxBases(){const L=[],a=u=>{u=String(u||'').replace(/\/+$/,'');if(/^https?:\/\//.test(u)&&!L.includes(u))L.push(u)};
 a(PRX_B);a(window.CASO_APPRIS);a(location.origin);try{a(getSync().url)}catch(e){}a('https://app-e6c6e91c-8623-4524-95ef-2cefb8b67f7b.cleverapps.io');return L}
/* connecté (Google / Outlook) : le serveur compte les recherches de ce compte au mois, pas de l'appareil au jour */
function prxAuth(){try{const j=window.CasoAuth&&CasoAuth.jeton();return j?{authorization:'Bearer '+j}:{}}catch(e){return {}}}
async function prxAsk(q,plus){let err='';
 for(const b of prxBases()){const ac=new AbortController(),to=setTimeout(()=>ac.abort(),22000);
  try{const r=await fetch(b+'/api/prix?q='+encodeURIComponent(q)+'&pays='+prxPays()+(plus||''),{signal:ac.signal,credentials:'omit',headers:prxAuth()}),v=await r.json().catch(()=>null);
   if(r.ok&&Array.isArray(v)){PRX_B=b;return {v}}
   /* le serveur sait que le module manque (essai fini, plan changé ailleurs) : liste des modules remise à jour, plan ouvert */
   if(r.status===403&&v&&v.module){PRX_B=b;try{CasoAuth.rafraichir()}catch(e){}if(typeof aboVerrou==='function')aboVerrou(v.module);return {err:v.error}}
   if(v&&typeof v.error==='string'&&r.status!==404&&r.status!==401){PRX_B=b;return {err:v.error}}
  }catch(e){}finally{clearTimeout(to)}}
 return {err:err||'Le service de prix ne répond pas, réessaie plus tard.'}}
function prxRecGet(){try{const v=JSON.parse(localStorage.getItem('caso_prx_rec'));return Array.isArray(v)?v.filter(x=>typeof x==='string').slice(0,6):[]}catch(e){return []}}
function prxRecAdd(q){try{const L=prxRecGet().filter(x=>x.toLowerCase()!==q.toLowerCase());L.unshift(q.slice(0,60));localStorage.setItem('caso_prx_rec',JSON.stringify(L.slice(0,6)))}catch(e){}}
function prxRecShow(){const L=prxRecGet();$('prxRec').innerHTML=$('fouQ').value.trim()?'':L.map((x,i)=>`<button type="button" class="chip" data-noi18n onclick="prxPick(${i})">${esc(x)}</button>`).join('')}
function prxPick(i){const x=prxRecGet()[i];if(!x)return;$('fouQ').value=x;prxGo()}
/* favoris : produits gardés depuis les prix en ligne (prix, magasin et date du relevé), affichés quand la barre est vide */
function favKey(x){return (x.produit+'|'+x.magasin).toLowerCase()}
function favList(){return Array.isArray(db.favs)?db.favs:(db.favs=[])}
/* une offre : la photo, le produit avec le magasin dessous, puis à droite le prix, l'étoile (favori) et le + (Mes prix). Toucher la ligne ouvre la page du magasin */
function prxRow(x,ref,o){const u=/^https:\/\//i.test(x.url||'')?x.url:'',fav=o.fav,on=fav||favList().some(f=>favKey(f)===favKey(x)),
  ex=db.prices.some(p=>p.nom.toLowerCase()===x.produit.slice(0,80).toLowerCase()&&p.four===x.magasin),r=fav?`'${x.id}'`:ref;
 return `<div class="it prx-it"${fav?` data-sw="fav:${x.id}"`:''} style="animation-delay:${Math.min(o.n||0,12)*35}ms"><${u?`a href="${esc(u)}" target="_blank" rel="noopener noreferrer"`:'span'} class="it-main"><span class="prx-ph"${x.photo?` data-ph="${esc(x.photo)}"`:''}><svg class="i i-sm"><use href="#i-tag"/></svg></span><span class="prx-n"><span data-noi18n>${esc(x.produit)}</span><span class="mut"><span data-noi18n>${esc(x.magasin)}</span>${x.src==='site'?'':' · <span>TTC</span>'}${fav&&x.maj?` · <span data-noi18n>${esc(dFR(x.maj))}</span>`:''}</span></span></${u?'a':'span'}>`+
  `<span class="prx-r"><b class="prx-p" data-noi18n>${esc(prxPrix(x))}</b><span class="prx-b"><button class="ib${on?' on':''}" type="button" aria-pressed="${on}" aria-label="${esc(i18nT('Mes favoris'))}" onclick="favToggle(${r},this)"><svg class="i i-sm"><use href="#i-star"/></svg></button>`+
  (x.devise==='EUR'?`<button class="ib" type="button" aria-label="${esc(i18nT('Ajouter à mes prix'))}" ${ex?'disabled':''} onclick="prxAdd(${r},this)"><svg class="i i-sm"><use href="#i-${ex?'check':'plus'}"/></svg></button>`:'')+'</span></span></div>'}
/* une seule liste, du moins cher au plus cher */
function prxListe(L,o){return '<div class="lst">'+L.map((x,i)=>({x,i})).filter(e=>!o.mag||e.x.magasin===o.mag).sort((a,b)=>a.x.prix-b.x.prix).map((e,n)=>prxRow(e.x,e.i,{fav:o.fav,n})).join('')+'</div>'}
/* photos : l'appli refuse les images d'autres sites ; une petite image vient dans la réponse, les autres passent par le serveur casô */
const PRX_IMG=new Map();
async function prxImg(u){if(u.startsWith('data:image/'))return u;if(PRX_IMG.has(u))return PRX_IMG.get(u);
 const p=(async()=>{for(const b of prxBases()){try{const r=await fetch(b+'/api/prix/img?u='+encodeURIComponent(u),{credentials:'omit'});
   if(r.ok&&/^image\//.test(r.headers.get('content-type')||'')){PRX_B=PRX_B||b;return URL.createObjectURL(await r.blob())}}catch(e){}}return ''})();
 PRX_IMG.set(u,p);return p}
let PRX_IO=null;
function prxPhoto(el){const u=el.dataset.ph;if(!u)return;el.removeAttribute('data-ph');prxImg(u).then(src=>{if(!src||!el.isConnected)return;
 const im=new Image();im.alt='';im.decoding='async';im.onload=()=>{el.textContent='';el.appendChild(im)};im.src=src})}
function prxPhotos(box){const L=box.querySelectorAll('[data-ph]');if(!('IntersectionObserver' in window))return L.forEach(prxPhoto);
 PRX_IO=PRX_IO||new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){PRX_IO.unobserve(e.target);prxPhoto(e.target)}}),{rootMargin:'400px'});L.forEach(el=>PRX_IO.observe(el))}
/* enseignes du pays absentes des résultats : un appui ouvre la recherche du produit sur leur site */
const PRX_ENS={FR:[['Leroy Merlin','leroymerlin.fr'],['Castorama','castorama.fr'],['Brico Dépôt','bricodepot.fr'],['Point.P','pointp.fr'],['Cedeo','cedeo.fr'],['Rexel','rexel.fr'],['Bricoman','bricoman.fr'],['Bricomarché','bricomarche.com'],['Mr.Bricolage','mr-bricolage.fr'],['Gedimat','gedimat.fr'],['Sonepar','sonepar.fr'],['Würth','wurth.fr'],['ManoMano','manomano.fr']],
 BE:[['Brico','brico.be'],['Gamma','gamma.be'],['Hubo','hubo.be']],CH:[['Jumbo','jumbo.ch'],['Hornbach','hornbach.ch'],['Bauhaus','bauhaus.ch']],
 ES:[['Leroy Merlin','leroymerlin.es'],['Bauhaus','bauhaus.es'],['ManoMano','manomano.es']],PT:[['Leroy Merlin','leroymerlin.pt']],IT:[['Leroy Merlin','leroymerlin.it'],['OBI','obi-italia.it'],['ManoMano','manomano.it']],
 DE:[['OBI','obi.de'],['Hornbach','hornbach.de'],['Bauhaus','bauhaus.info'],['toom','toom.de']],GB:[['Screwfix','screwfix.com'],['Toolstation','toolstation.com'],['Wickes','wickes.co.uk'],['B&Q','diy.com']]};
/* enseignes du pays absentes de la liste : un appui va chercher leurs prix (une recherche de plus) et les ajoute à la liste ;
   si l'enseigne n'en publie pas, sa pastille devient un lien vers la recherche du produit sur son site */
function prxAutres(q){const nk=t=>vnNorm(t).replace(/[^a-z0-9]/g,''),vus=PRX.map(x=>nk(x.magasin)),
  L=(PRX_ENS[prxPays()]||[]).filter(e=>{const k=nk(e[0]);return !vus.some(v=>v.includes(k)||k.includes(v))});
 return L.length?`<h2 class="grp"><span>Autres magasins</span></h2><div class="chips prx-aut">`+L.map(e=>PRX_NO.has(e[1])?
   `<a class="chip no" data-noi18n href="https://www.google.com/search?q=${encodeURIComponent(q+' site:'+e[1])}" target="_blank" rel="noopener noreferrer">${esc(e[0])}<svg class="i i-sm i-flip"><use href="#i-arrow"/></svg></a>`:
   `<button type="button" class="chip" data-noi18n data-d="${esc(e[1])}" data-n="${esc(e[0])}" onclick="prxMag(this)">${esc(e[0])}</button>`).join('')+'</div>':''}
async function prxMag(btn){const d=btn.dataset.d,nom=btn.dataset.n,q=$('fouQ').value.trim().replace(/\s+/g,' '),n=PRX_N;if(btn.disabled||q.length<2)return;
 if(navigator.onLine===false)return toast(i18nT('Pas de connexion.'));
 btn.disabled=true;btn.classList.add('wait');
 const r=await prxAsk(q,'&mag='+encodeURIComponent(d)+'&nom='+encodeURIComponent(nom));if(n!==PRX_N)return;
 if(r.err){btn.disabled=false;btn.classList.remove('wait');return toast(i18nT(r.err))}
 const v=r.v.filter(x=>x&&x.produit&&x.magasin&&+x.prix>0);
 if(!v.length){PRX_NO.add(d);prxShow(q,!PRX.length);return toast(nom+' : '+i18nT('Aucun résultat.'))}
 const vus=new Set(PRX.map(favKey));PRX=PRX.concat(v.filter(x=>!vus.has(favKey(x))));PRX_F=v[0].magasin;
 PRX_C.set(prxPays()+'|'+q.toLowerCase(),{t:Date.now(),v:PRX});prxShow(q);try{$('prxRes').scrollIntoView({block:'start',behavior:'smooth'})}catch(e){}}
function prxMags(){const M=new Map();PRX.forEach(x=>M.set(x.magasin,(M.get(x.magasin)||0)+1));if(M.size<2)return '';
 if(PRX_F&&!M.has(PRX_F))PRX_F='';
 return '<div class="chips prx-mag">'+`<button type="button" class="chip${PRX_F?'':' on'}" aria-pressed="${!PRX_F}" onclick="prxFiltre('')"><span>Tous</span> <span class="mut" data-noi18n>${PRX.length}</span></button>`+
  [...M].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([m,n])=>`<button type="button" class="chip${PRX_F===m?' on':''}" aria-pressed="${PRX_F===m}" data-noi18n data-m="${esc(m)}" onclick="prxFiltre(this.dataset.m)">${esc(m)} <span class="mut">${n}</span></button>`).join('')+'</div>'}
function prxFiltre(m){PRX_F=m||'';const q=$('fouQ').value.trim().replace(/\s+/g,' ');prxShow(q);const on=document.querySelector('#prxRes .prx-mag .chip.on');if(on&&on.scrollIntoView)try{on.scrollIntoView({inline:'center',block:'nearest'})}catch(e){}}
function prxShow(q,vide){const box=$('prxRes');box.innerHTML=(vide?`<div class="lst"><div class="lst-empty mut">${esc(i18nT('Aucun résultat.'))}</div></div>`:prxMags()+prxListe(PRX,{mag:PRX_F}))+prxAutres(q);prxPhotos(box)}
function favShow(){const L=favList(),box=$('prxFav');if(!box)return;
 box.innerHTML=!L.length||$('fouQ').value.trim()?'':`<h2 class="grp"><span>Mes favoris</span><span class="cnt" data-noi18n>${L.length}</span></h2>`+prxListe(L,{fav:true});prxPhotos(box)}
function favToggle(ref,btn){const L=favList(),x=typeof ref==='number'?PRX[ref]:L.find(f=>f.id===ref);if(!x)return;
 const k=favKey(x),i=L.findIndex(f=>favKey(f)===k);
 if(i>=0)L.splice(i,1);else L.unshift({id:uid(),produit:x.produit,prix:x.prix,devise:x.devise,magasin:x.magasin,url:x.url||'',maj:x.maj||ymdL(),photo:x.photo||''});
 save();if(typeof ref==='number'){btn.classList.toggle('on',i<0);btn.setAttribute('aria-pressed',i<0)}else favShow()}
function prxHome(){prxRecShow();favShow()}
async function prxGo(){
 const box=$('prxRes'),q=$('fouQ').value.trim().replace(/\s+/g,' '),n=++PRX_N,msg=t=>{if(n===PRX_N)box.innerHTML=`<div class="lst"><div class="lst-empty mut">${esc(i18nT(t))}</div></div>`};
 PRX=[];PRX_F='';PRX_NO=new Set();$('prxRec').innerHTML='';$('prxFav').innerHTML='';if(q.length<2){box.innerHTML='';prxHome();return}
 const k=prxPays()+'|'+q.toLowerCase(),c=PRX_C.get(k);
 if(c&&Date.now()-c.t<36e5){PRX=c.v;return prxShow(q)}
 if(navigator.onLine===false)return msg('Pas de connexion.');
 box.innerHTML='<div class="lst" role="status" aria-label="'+esc(i18nT('Recherche…'))+'">'+'<div class="prx-sk"><i></i><i></i></div>'.repeat(4)+'</div>';
 const r=await prxAsk(q);if(n!==PRX_N)return;
 if(r.err)return msg(r.err);
 PRX=r.v.filter(x=>x&&x.produit&&x.magasin&&+x.prix>0);if(!PRX.length)return prxShow(q,true);
 PRX_C.set(k,{t:Date.now(),v:PRX});prxRecAdd(q);prxShow(q)}
function prxAdd(ref,btn){const x=typeof ref==='number'?PRX[ref]:favList().find(f=>f.id===ref);if(!x)return;
 const nom=x.produit.slice(0,80),ht=Math.round(x.prix/1.2*100)/100,ex=db.prices.find(p=>p.nom.toLowerCase()===nom.toLowerCase());
 if(ex){ex.prix=ht;ex.four=x.magasin}else db.prices.push({id:uid(),nom,unit:'u',prix:ht,tva:20,four:x.magasin});
 save();try{renderPrices();renderQuick()}catch(e){}
 if(btn){btn.disabled=true;btn.innerHTML='<svg class="i i-sm"><use href="#i-check"/></svg>'}toast(i18nT('Ajouté à tes prix'))}
function fouMode(m){FOU_M=m==='web'?'web':'mes';const w=FOU_M==='web';
 [...$('fouSeg').children].forEach(b=>b.classList.toggle('on',b.dataset.m===FOU_M));$('fouMes').hidden=w;$('fouWeb').hidden=!w;
 $('fouAct').hidden=w;fouBtn();$('fouQ').placeholder=i18nT(w?"Prix d'un matériau en ligne":'Chercher');
 if(w){if($('fouQ').value.trim().length>1)prxGo();else{$('prxRes').innerHTML='';prxHome()}}else fouRender()}
/* la loupe est le bouton de recherche : elle s'allume dans « Prix en ligne » dès qu'il y a un mot à chercher */
function fouBtn(){$('fouBtn').classList.toggle('go',FOU_M==='web'&&$('fouQ').value.trim().length>1)}
function fouType(){fouBtn();if(FOU_M==='mes')return fouRender();if(!$('fouQ').value.trim()){PRX_N++;$('prxRes').innerHTML='';prxHome()}}
function fouGo(){if(FOU_M==='web'){try{$('fouQ').blur()}catch(e){}prxGo()}else fouRender()}
/* liste : rien quand il n'y a encore aucun fournisseur ; si le mot cherché n'est chez aucun fournisseur, on propose de le chercher en ligne */
function fouRender(){syncSuppliersFromPrices();const fd=$('fouDue');if(fd)fd.innerHTML=fouDueHtml();
 const q=$('fouQ').value.trim(),k=vnNorm(q),n=db.suppliers.filter(x=>!k||vnNorm(x.nom+' '+(x.tel||'')+' '+(x.adr||'')).includes(k)).length,box=$('fouList');
 if(FOU_M!=='mes')return;
 if(n){box.className='lst';box.innerHTML=db.suppliers.filter(x=>!k||vnNorm(x.nom+' '+(x.tel||'')+' '+(x.adr||'')).includes(k)).sort((a,b)=>a.nom.localeCompare(b.nom)).map(x=>
   `<div class="it fou-it" data-sw="fou:${x.id}"><button type="button" class="it-main" onclick="fouEdit('${x.id}')"><span class="av" data-noi18n aria-hidden="true">${esc((x.nom.trim()[0]||'?'))}</span><span class="fou-tx"><b data-noi18n>${esc(x.nom)}</b>${x.tel||x.adr?`<span class="mut it-s" data-noi18n>${esc([x.tel,x.adr].filter(Boolean).join(' · '))}</span>`:''}</span><svg class="i dw-c i-flip"><use href="#i-chev"/></svg></button></div>`).join('')}
 else if(q.length>1){box.className='lst';box.innerHTML=`<button type="button" class="it it-main" onclick="fouMode('web')"><span class="it-t"><b><span>Prix en ligne</span> : <span data-noi18n>${esc(q)}</span></b><svg class="i dw-c i-flip"><use href="#i-chev"/></svg></span></button>`}
 else{box.className='';box.innerHTML=''}}
function fouEdit(id){
 fouCur=id?db.suppliers.find(x=>x.id===id):null;formFill('fou',fouCur,fouCur?fouCur.nom:'Nouveau fournisseur');
 let h='';
 if(fouCur){const A=(db.achats||[]).filter(a=>nameKey(a.four)===nameKey(fouCur.nom));
  h+=`<button class="btn sec" onclick="fouPhoto()"><svg class="i"><use href="#i-cam"/></svg><span>Photo d'un devis ou d'une facture</span></button>`;
  if(A.length){const due=A.filter(a=>a.type!=='devis'&&!a.paid);h+=`<h2 class="grp"><span>Achats</span><span class="cnt">${A.length}</span></h2>`+(due.length?`<p class="mut ach-sum"><span>${i18nT('{1} à payer').replace('{1}',due.length)}</span> · <b data-noi18n>${eur(due.reduce((s,a)=>s+(a.ttc||0),0))}</b></p>`:'')+`<div class="lst">${achHtml(A.slice(0,30))}</div>`}}
 if(fouCur){const k=nameKey(fouCur.nom),P=db.prices.filter(p=>nameKey(p.four)===k),H=(db.hist||[]).filter(x=>nameKey(x.four)===k).slice().reverse().slice(0,12);
  if(P.length)h+=`<h2 class="grp"><span>Services</span><span class="cnt">${P.length}</span></h2><div class="lst">`+P.map(p=>`<div class="it"><span class="it-t"><b>${esc(pDisp(p))}</b><span>${eur(p.prix)} / ${esc(p.unit)}</span></span></div>`).join('')+'</div>';
  if(H.length)h+=`<h2 class="grp"><span>Historique des prix</span></h2><div class="lst">`+H.map(x=>`<div class="it"><span class="it-t"><span>${esc(x.nom)}</span><span>${eur(x.prix)} / ${esc(x.unit)}</span></span><span class="mut it-s">${dFR(x.date)}</span></div>`).join('')+'</div>'}
 $('fouMore').innerHTML=h;$('fouActs').innerHTML=fouCur?cfActs(fouCur):'';go('fouf')}
function fouSave(){
 const n=$('fouNom').value.trim();if(!n){alert('Écris le nom.');return}
 if(!fouCur){const dup=findBy(db.suppliers,n);fouCur=dup||{id:uid()};if(!dup)db.suppliers.push(fouCur)}
 formRead('fou',fouCur);save();toast(i18nT('Enregistré.'));go('fou')}
function fouDelete(){if(!fouCur||!confirm('Supprimer ce fournisseur ?'))return;db.suppliers=db.suppliers.filter(x=>x!==fouCur);save();go('fou')}




/* ---------- Fournisseurs ---------- */
function renderFour(){
 const by={};db.hist.forEach(h=>{(by[h.four]=by[h.four]||[]).push(h)});
 const names=Object.keys(by);
 $('fourList').innerHTML=names.map(f=>`<div class="line"><b>${esc(f)}</b>`+
  by[f].slice().reverse().slice(0,8).map(h=>`<div class="tot mut"><span>${esc(h.nom)} · ${dFR(h.date)}</span><span>${eur(h.prix)} / ${esc(h.unit)}</span></div>`).join('')+`</div>`).join('')
  ||'<div class="mut">Aucun fournisseur.</div>';
}

/* ---------- Import intelligent ---------- */
let impRows=[];
function setImpMsg(t){$('impMsg').textContent=t}

/* --- image --- */
function enhance(c){
 const x=c.getContext('2d'),im=x.getImageData(0,0,c.width,c.height),d=im.data,h=new Array(256).fill(0);
 for(let i=0;i<d.length;i+=4){const g=Math.round(.299*d[i]+.587*d[i+1]+.114*d[i+2]);d[i]=d[i+1]=d[i+2]=g;h[g]++}
 const tot=c.width*c.height;let acc=0,lo=0,hi=255;
 for(let i=0;i<256;i++){acc+=h[i];if(acc>=tot*.02){lo=i;break}}
 acc=0;for(let i=255;i>=0;i--){acc+=h[i];if(acc>=tot*.02){hi=i;break}}
 const k=hi>lo+10?255/(hi-lo):1;
 for(let i=0;i<d.length;i+=4){const v=Math.max(0,Math.min(255,(d[i]-lo)*k));d[i]=d[i+1]=d[i+2]=v}
 x.putImageData(im,0,0)}
/* photo ou capture d'un document → image propre pour la lecture : agrandie, papier égalisé, redressée, sans traits de tableau */
function docGray(c){const W=c.width,H=c.height,d=c.getContext('2d').getImageData(0,0,W,H).data,g=new Float32Array(W*H);
 for(let i=0,j=0;j<g.length;i+=4,j++)g[j]=.299*d[i]+.587*d[i+1]+.114*d[i+2];return g}
/* papier : clair par blocs lissé (l'encre disparaît, il reste l'éclairage) ; chaque point est ramené au blanc du papier */
function docFlat(g,W,H){const B=Math.max(16,Math.round(Math.max(W,H)/50)),bw=Math.ceil(W/B),bh=Math.ceil(H/B),bm=new Float32Array(bw*bh),sm=new Float32Array(bw*bh);
 for(let by=0;by<bh;by++)for(let bx=0;bx<bw;bx++){const v=[];for(let y=by*B;y<Math.min(H,by*B+B);y+=2)for(let x=bx*B;x<Math.min(W,bx*B+B);x+=2)v.push(g[y*W+x]);v.sort((a,b)=>b-a);bm[by*bw+bx]=v[Math.floor(v.length*.1)]||255}
 for(let by=0;by<bh;by++)for(let bx=0;bx<bw;bx++){let s=0,n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const yy=by+dy,xx=bx+dx;if(yy>=0&&yy<bh&&xx>=0&&xx<bw){s+=bm[yy*bw+xx];n++}}sm[by*bw+bx]=s/n}
 for(let y=0;y<H;y++){const fy=Math.min(bh-1,Math.max(0,y/B-.5)),y0=Math.floor(fy),y1=Math.min(bh-1,y0+1),ay=fy-y0;
  for(let x=0;x<W;x++){const fx=Math.min(bw-1,Math.max(0,x/B-.5)),x0=Math.floor(fx),x1=Math.min(bw-1,x0+1),ax=fx-x0;
   const bg=(sm[y0*bw+x0]*(1-ax)+sm[y0*bw+x1]*ax)*(1-ay)+(sm[y1*bw+x0]*(1-ax)+sm[y1*bw+x1]*ax)*ay;const j=y*W+x;g[j]=Math.min(255,g[j]/Math.max(40,bg)*255)}}}
function docOtsu(g){const h=new Array(256).fill(0);for(let j=0;j<g.length;j++)h[g[j]|0]++;let sum=0;for(let i=0;i<256;i++)sum+=i*h[i];let sB=0,wB=0,best=0,th=180;
 for(let i=0;i<256;i++){wB+=h[i];if(!wB)continue;const wF=g.length-wB;if(!wF)break;sB+=i*h[i];const mB=sB/wB,mF=(sum-sB)/wF,v=wB*wF*(mB-mF)*(mB-mF);if(v>best){best=v;th=i}}return th}
/* inclinaison des lignes de texte (−5° à 5°), mesurée sur l'encre */
function docAngle(g,W,H,th){const sc=Math.max(1,Math.round(W/600)),sw=Math.floor(W/sc),sh=Math.floor(H/sc),pts=[];
 for(let y=Math.floor(sh*.05);y<sh*.95;y++)for(let x=Math.floor(sw*.05);x<sw*.95;x++)if(g[(y*sc)*W+x*sc]<th)pts.push(x,y);
 if(pts.length<60)return 0;const score=a=>{const t=Math.tan(a*Math.PI/180),prof=new Float32Array(sh+sw);for(let i=0;i<pts.length;i+=2){const r=Math.round(pts[i+1]-pts[i]*t+sw*.1);if(r>=0&&r<prof.length)prof[r]++}let v=0;for(let r=1;r<prof.length;r++){const d=prof[r]-prof[r-1];v+=d*d}return v};
 let best=0,bv=-1;for(let a=-5;a<=5.001;a+=.25){const v=score(a);if(v>bv){bv=v;best=a}}
 for(let a=best-.2;a<=best+.2001;a+=.05){const v=score(a);if(v>bv){bv=v;best=a}}return Math.round(best*100)/100}
function docImgCanvas(im){
 const W0=im.naturalWidth||im.width,H0=im.naturalHeight||im.height;
 let k=Math.min(3,2400/Math.max(W0,H0));if(Math.max(W0,H0)*k<1000)k=1000/Math.max(W0,H0);
 const W=Math.round(W0*k),H=Math.round(H0*k);
 let c=document.createElement('canvas');c.width=W;c.height=H;let x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.fillStyle='#fff';x.fillRect(0,0,W,H);x.drawImage(im,0,0,W,H);
 let g=docGray(c);docFlat(g,W,H);let th=docOtsu(g);
 const ang=docAngle(g,W,H,th);
 if(Math.abs(ang)>=.3){const id=x.getImageData(0,0,W,H),d=id.data;for(let i=0,j=0;j<g.length;i+=4,j++){d[i]=d[i+1]=d[i+2]=g[j];d[i+3]=255}x.putImageData(id,0,0);
  const r=document.createElement('canvas');r.width=W;r.height=H;const rx=r.getContext('2d');rx.fillStyle='#fff';rx.fillRect(0,0,W,H);rx.translate(W/2,H/2);rx.rotate(-ang*Math.PI/180);rx.drawImage(c,-W/2,-H/2);rx.setTransform(1,0,0,1,0,0);
  c=r;x=rx;g=docGray(c);th=docOtsu(g)}
 /* traits de tableau : longues suites d'encre horizontales ou verticales effacées */
 {const minH=Math.max(80,W*.15),minV=Math.max(80,H*.06),tl=th+(255-th)*.45,ink=j=>g[j]<tl,er=[];
  for(let y=0;y<H;y++){let s=-1;for(let xx=0;xx<=W;xx++){const on=xx<W&&ink(y*W+xx);if(on&&s<0)s=xx;else if(!on&&s>=0){if(xx-s>=minH)er.push(y*W+s,y*W+xx,1);s=-1}}}
  for(let xx=0;xx<W;xx++){let s=-1;for(let y=0;y<=H;y++){const on=y<H&&ink(y*W+xx);if(on&&s<0)s=y;else if(!on&&s>=0){if(y-s>=minV)er.push(s*W+xx,y*W+xx,W);s=-1}}}
  for(let i=0;i<er.length;i+=3)for(let j=er[i];j<er[i+1];j+=er[i+2])g[j]=255}
 const id=x.getImageData(0,0,W,H),d=id.data;
 for(let i=0,j=0;j<g.length;i+=4,j++){const v=Math.round(g[j]);d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}
 x.putImageData(id,0,0);return c}
function docImg(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();
 im.onload=()=>{try{res(docImgCanvas(im).toDataURL('image/png'))}catch(e){rej(e)}finally{URL.revokeObjectURL(u)}};
 im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('Image illisible.'))};im.src=u})}
function loadImgData(file,max=1600,enh=false){return new Promise((res,rej)=>{
 const r=new FileReader();
 r.onload=()=>{const im=new Image();
  im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height));
   const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
   c.getContext('2d').drawImage(im,0,0,c.width,c.height);
   if(enh)enhance(c);
   res(c.toDataURL('image/jpeg',0.9))};
  im.onerror=()=>rej(new Error('Image illisible.'));im.src=r.result};
 r.onerror=()=>rej(new Error('Fichier illisible.'));r.readAsDataURL(file)})}
function fileB64(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(',')[1]);r.onerror=()=>rej(new Error('Fichier illisible.'));r.readAsDataURL(file)})}

/* --- mémoire par fournisseur (niveau 2) --- */
function supKey(n){return (n||'').trim().toLowerCase()}
function supGet(n,create){
 const k=supKey(n);if(!k)return null;
 if(!db.sup)db.sup={};
 if(!db.sup[k]&&create)db.sup[k]={name:n.trim(),docs:0,layouts:{},tva:{},labels:{},units:{}};
 return db.sup[k]||null}
function supHint(){
 const s=supGet($('impFour').value),v=$('impFour').value.trim();
 $('supHint').textContent='';
}
function fillSup(){
 $('supList').innerHTML=Object.values(db.sup||{}).map(s=>`<option value="${esc(s.name)}">`).join('')}
function bestLayout(sup){
 if(!sup)return null;
 const e=Object.entries(sup.layouts||{}).sort((a,b)=>b[1]-a[1])[0];if(!e)return null;
 const m=e[0].match(/q(-?\d+),p(-?\d+)/);return m?{q:+m[1],p:+m[2]}:null}
function bestTva(sup){
 if(!sup)return null;
 const e=Object.entries(sup.tva||{}).sort((a,b)=>b[1]-a[1])[0];return e?+e[0]:null}
function learnFrom(four,rows){
 const s=supGet(four,true);if(!s)return;
 s.docs++;
 rows.forEach(r=>{
  const raw=(r.rawLabel||'').trim(),lab=r.label.trim();
  if(raw&&lab!==raw)s.labels[raw.toLowerCase()]=lab;
  if(r.unit&&r.unit!=='u')s.units[lab.toLowerCase()]=r.unit;
  s.tva[r.tva]=(s.tva[r.tva]||0)+1;
  const v=r.nums||[],n=v.length;
  if(n>=2){
   const qi=v.findIndex(x=>Math.abs(x-r.qty)<1e-9);
   const pi=v.findIndex((x,i)=>i!==qi&&Math.abs(x-r.pu)<1e-9);
   if(qi>=0&&pi>=0){const k='q'+(qi-n)+',p'+(pi-n);s.layouts[k]=(s.layouts[k]||0)+1}
  }
 });
 const ks=Object.keys(s.labels);if(ks.length>200)ks.slice(0,ks.length-200).forEach(k=>delete s.labels[k]);
 fillSup();supHint();
}

/* --- vérification --- */
function near(a,b){return Math.abs(a-b)<=Math.max(0.02,0.006*Math.abs(b))}
function verify(v,qty,pu){
 const t=qty*pu;if(!(t>0))return false;
 const qi=v.findIndex(x=>Math.abs(x-qty)<1e-9);
 const pi=v.findIndex((x,i)=>i!==qi&&Math.abs(x-pu)<1e-9);
 return v.filter((x,i)=>i!==qi&&i!==pi).some(x=>near(x,t))}
/* virgule perdue à la lecture (« 6240 » pour 62,40, « 045 » pour 0,45) : rétablie si quantité × prix = total ne tombe juste qu'avec elle */
let DEC_NORM=false;
function decFix(nums){
 const v=nums.map(n=>n.v);if(v.length<3)return;
 const idx=nums.map((n,i)=>i).filter(i=>/^\d{3,}$/.test(nums[i].t)||/^0\d+$/.test(nums[i].t));
 if(!idx.length||idx.length>6)return;
 /* le calcul tombe juste sans virgule : on ne change rien, sauf si tout le document écrit ses prix avec centimes */
 if(pickByMath(v)){if(!DEC_NORM)return;const m=pickByMath(v),pi=v.indexOf(m.pu);if(pi<0||!idx.includes(pi))return;
  idx.forEach(i=>{if(i!==v.indexOf(m.qty))nums[i].v=Math.round(v[i])/100});return}
 let best=null;
 for(let m=1;m<(1<<idx.length);m++){const w=v.slice();let c=0;idx.forEach((i,b)=>{if(m>>b&1){w[i]=Math.round(v[i])/100;c++}});if(pickByMath(w)&&(!best||c<best.c))best={w,c}}
 if(best)nums.forEach((n,i)=>n.v=best.w[i])}
function pickByMath(v){
 const n=v.length;
 for(let k=n-1;k>=2;k--)for(let i=0;i<k;i++)for(let j=0;j<k;j++){
  if(i===j)continue;
  if(near(v[i]*v[j],v[k]))return{qty:v[i],pu:v[j]}}
 return null}

/* --- lecture par colonnes (niveau 1) --- */
const NUMRE=/^\d+(?:[.,]\d+)?$/;
const UNITRE=/^(u|un|pce|pièce|piece|pcs?|h|j|jour|jours|km|m|ml|m²|m2|m³|m3|kg|g|l|sac|sacs|lot|forfait|ens|paire|rouleau|palette|pal|t)$/i;
function numVal(s){return parseFloat(String(s).replace(',','.'))}
const HDR={
 label:/^(désignation|designation|libellé|libelle|article|description|produit|référence|reference)$/i,
 qty:/^(qté|qte|quantité|quantite|qt|quant\.?)$/i,
 unit:/^(unité|unite|un\.?)$/i,
 pu:/^(pu|p\.u\.?|prix|pu\.ht|puht|unitaire)$/i,
 tva:/^(tva|t\.v\.a\.?)$/i,
 total:/^(total|montant|mt)$/i};
function mergeTokens(ws){
 const out=[];
 for(let i=0;i<ws.length;i++){
  const w=ws[i],n=ws[i+1];
  if(n&&/^\d{1,3}$/.test(w.t)&&/^\d{3}[.,]\d{2}$/.test(n.t)&&n.x0-w.x1<(w.h||10)*0.9){out.push({...w,t:w.t+n.t,x1:n.x1});i++}
  else if(n&&/^\d+[.,]$/.test(w.t)&&/^\d{2}$/.test(n.t)&&n.x0-w.x1<(w.h||10)*1.2){out.push({...w,t:w.t+n.t,x1:n.x1});i++}
  else out.push(w)}
 return out}
function groupRows(words){
 const ws=words.filter(w=>w.text&&w.text.trim()).map(w=>({t:w.text.trim(),x0:w.bbox.x0,x1:w.bbox.x1,h:w.bbox.y1-w.bbox.y0,yc:(w.bbox.y0+w.bbox.y1)/2}));
 if(!ws.length)return [];
 const hs=ws.map(w=>w.h).sort((a,b)=>a-b),mh=hs[Math.floor(hs.length/2)]||10;
 ws.sort((a,b)=>a.yc-b.yc);
 const rows=[];
 ws.forEach(w=>{
  const r=rows[rows.length-1];
  if(r&&Math.abs(w.yc-r.yc)<mh*0.6){r.w.push(w);r.yc=(r.yc*(r.w.length-1)+w.yc)/r.w.length}
  else rows.push({yc:w.yc,w:[w]})});
 return rows.map(r=>mergeTokens(r.w.sort((a,b)=>a.x0-b.x0)));
}
function findHeader(rows){
 for(let i=0;i<rows.length;i++){
  const cols={};
  rows[i].forEach(w=>{
   const t=w.t.replace(/[.:]/g,'');
   for(const k in HDR){if(HDR[k].test(w.t)||HDR[k].test(t)){if(cols[k]==null)cols[k]=(w.x0+w.x1)/2;break}}});
  if(Object.keys(cols).length>=3&&(cols.qty!=null||cols.pu!=null))return{i,cols};
 }
 return null}

function parseRow(ws,hdr,sup){
 const text=ws.map(w=>w.t).join(' ');
 if(/^(sous-?total|tot[a-z]{0,3}\b|net|tva|acompte|remise|iban|siret|bic|page|reste|règlement|reglement|conditions|date|échéance)/i.test(text))return null;
 /* adresse (rue, code postal) : jamais une ligne d'achat */
 if(CT_ST.test(text)&&/\b\d{5}\b/.test(text))return null;
 const clean=t=>t.replace(/€|eur$/i,'');
 const isNum=t=>NUMRE.test(t),isPct=t=>/^\d+(?:[.,]\d+)?%$/.test(t);
 let s=ws.length;
 while(s>0){const t=clean(ws[s-1].t);if(t===''||t==='%'||isNum(t)||isPct(t)||UNITRE.test(t)||/^[x×*]$/i.test(t))s--;else break}
 /* « 14 x 8,95 » : le libellé s'arrête avant la quantité */
 for(let i=ws.length-2;i>0;i--)if(/^[x×*]$/i.test(ws[i].t)&&isNum(clean(ws[i-1].t))&&isNum(clean(ws[i+1].t))){s=i-1;break}
 if(hdr&&hdr.cols.qty!=null&&hdr.cols.label!=null&&hdr.cols.qty>hdr.cols.label){const bd=hdr.cols.qty-.3*(hdr.cols.qty-hdr.cols.label);while(s<ws.length-1&&(ws[s].x0+ws[s].x1)/2<bd)s++}
 const lab=ws.slice(0,s),tail=ws.slice(s);
 if(!tail.length||!lab.length)return null;
 let label=lab.map(w=>w.t).join(' ').trim().replace(/^(?:[A-Z]{0,3}\d{4,}[A-Z0-9\-]*|r[ée]f\.?\s*\S+)\s+(?=[A-Za-zÀ-ÿ])/i,'');
 if(!/[A-Za-zÀ-ÿ]{3}/.test(label))return null;
 const rawLabel=label;
 const nums=[];let tva=null,unit='';
 tail.forEach(w=>{
  const t=clean(w.t);
  if(t==='')return;
  if(isPct(t)){tva=numVal(t.slice(0,-1));return}
  if(t==='%'){if(nums.length)tva=nums.pop().v;return}
  if(isNum(t)){nums.push({v:numVal(t),x:(w.x0+w.x1)/2,t});return}
  if(UNITRE.test(t))unit=t});
 if(!nums.length)return null;
 decFix(nums);
 const v=nums.map(n=>n.v);
 let qty=null,pu=null,src='';
 // 1) colonnes de l'en-tête
 if(hdr){
  const roles=['qty','pu','tva','total'].filter(r=>hdr.cols[r]!=null),got={};let clash=false;
  nums.forEach(n=>{
   let best=null,bd=1e9;
   roles.forEach(r=>{const d=Math.abs(n.x-hdr.cols[r]);if(d<bd){bd=d;best=r}});
   if(best==null)return;
   if(best in got)clash=true;else got[best]=n.v});
  if(!clash&&(got.qty!=null||got.pu!=null)){
   if(got.tva!=null&&tva==null)tva=got.tva;
   qty=got.qty;pu=got.pu;
   const tot=got.total;
   if(qty==null&&pu!=null&&tot!=null){const q=Math.round(tot/pu);qty=(q>0&&near(tot/pu,q))?q:1}
   if(pu==null&&qty!=null&&tot!=null&&qty>0)pu=Math.round(tot/qty*100)/100;
   if(qty==null)qty=1;
   if(pu==null||qty==null){qty=null;pu=null}else src='hdr'}
 }
 // 2) ce que l'outil a appris de ce fournisseur
 if(!src){
  const lay=bestLayout(sup);
  if(lay&&v.length>=Math.max(-lay.q,-lay.p)){qty=v[v.length+lay.q];pu=v[v.length+lay.p];src='memo'}
 }
 // 3) calcul : quantité × prix = un autre chiffre de la ligne
 if(!src){const m=pickByMath(v);if(m){qty=m.qty;pu=m.pu;src='math'}}
 // 4) dernier recours : on devine
 if(!src){
  if(v.length>=3){qty=v[0];pu=v[1]}
  else if(v.length===2){if(Number.isInteger(v[0])&&v[0]<=999&&!Number.isInteger(v[1])){qty=v[0];pu=v[1]}else{qty=1;pu=v[0]}}
  else{qty=1;pu=v[0]}
  src='guess'}
 const ok=verify(v,qty,pu);
 const warn=ok?'':(src==='guess'?'ordre des colonnes incertain : vérifie quantité et prix':'quantité × prix introuvable dans les chiffres lus : vérifie');
 if(sup){
  const k=label.toLowerCase();
  if(sup.labels&&sup.labels[k])label=sup.labels[k];
  if(!unit&&sup.units&&sup.units[label.toLowerCase()])unit=sup.units[label.toLowerCase()];
 }
 if(tva==null)tva=bestTva(sup)??20;
 return{on:true,label,rawLabel,qty,unit:unit||'u',pu,tva,nums:v,ok,warn,src};
}
function parseText(t){
 const sup=supGet($('impFour').value);
 const out=[];
 t.split(/\r?\n/).forEach(line=>{
  const ws=[...line.matchAll(/\S+/g)].map(m=>({t:m[0],x0:m.index,x1:m.index+m[0].length,h:10}));
  if(ws.length<2)return;
  const r=parseRow(ws,null,sup);if(r)out.push(r)});
 return out}
function rowsFromWords(words,text){
 const sup=supGet($('impFour').value);
 const lines=words.length?groupRows(words):[];
 for(let i=0;i<lines.length-1;i++){const a=lines[i],b=lines[i+1],num=t=>/^\d+(?:[.,]\d+)?€?$/.test(t);
  const fois=b.some(w=>/^[x×*]$/i.test(w.t));
  if(!/\p{L}{3}/u.test(a.map(w=>w.t).join(' '))||(num(a[a.length-1].t)&&!fois))continue;
  if(b.some(w=>/\p{L}{3}/u.test(w.t))||b.filter(w=>num(w.t)).length<2)continue;
  if(/^(total|tva|cb|esp|rendu|net|sous)/i.test(a[0].t))continue;
  lines.splice(i,2,a.concat(b))}
 if(!lines.length)return parseText(text||'');
 const tk=words.map(w=>String(w.text||'').replace(/€$/,''));
 DEC_NORM=tk.filter(t=>/^\d+[.,]\d{2}$/.test(t)).length>=Math.max(3,2*tk.filter(t=>/^\d{3,}$/.test(t)).length);
 const hdr=findHeader(lines),out=[];
 lines.forEach((ws,i)=>{
  if(hdr&&i<=hdr.i)return;
  const r=parseRow(ws,hdr,sup);if(r)out.push(r)});
 return out}

function loadScript(src){return new Promise((res,rej)=>{
 if(window.Tesseract)return res();
 const s=document.createElement('script');s.src=src;s.onload=res;
 s.onerror=()=>rej(new Error('Module de lecture introuvable : une connexion est nécessaire la première fois.'));
 document.head.appendChild(s)})}
async function ocrExtract(f){
 if(f.type==='application/pdf'){const r=await pdfRead(f);return rowsFromWords(r.words||[],r.text||'')}
 await loadScript(OCR_V.js);
 const d=await docImg(f);
 const w=await Tesseract.createWorker('fra',1,{workerPath:OCR_V.worker,corePath:OCR_V.core,langPath:OCR_V.lang,logger:m=>{if(m.status)setImpMsg(m.status+' '+Math.round((m.progress||0)*100)+' %')}});
 try{
  await w.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'});
  const res=await w.recognize(d);
  return rowsFromWords(res.data.words||[],res.data.text||'');
 }finally{try{await w.terminate()}catch(e){}}
}

async function runImport(inp){
 const f=inp.files[0];if(!f)return;inp.value='';
 try{
  setImpMsg('Lecture en cours…');
  IMP_DOC=null;$('impDoc').hidden=true;
  const rows=await docExtract(f);
  impRows=rows;renderImp();
  const w=rows.filter(r=>r.warn).length;
  setImpMsg(rows.length?(rows.length+' lignes trouvées'+(w?', '+w+' à vérifier (orange).':'.')):(IMP_DOC&&IMP_DOC.ttc!=null?'':'Aucune ligne trouvée. Essaie une photo plus nette.'));
 }catch(e){setImpMsg(e&&/connexion/.test(e.message||'')?e.message:i18nT('Lecture impossible. Essaie une photo plus nette, à plat et avec de la lumière.'))}
}


/* ---------- Devis et factures des fournisseurs : photo ou PDF lu sur le téléphone ---------- */
let IMP_DOC=null,IMP_FOU='';
const PDF_V={js:'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/legacy/build/pdf.min.js',worker:'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js'};
function impPick(k,stay){if(!stay)IMP_FOU='';$(k==='cam'?'impCam':'impFile').click()}
function impGot(inp){const f=inp.files[0];if(!f)return;inp.value='';
 if(!$('s-imp').classList.contains('on')){$('impFour').value=IMP_FOU||'';supHint();go('imp')}
 IMP_FOU='';
 runImport({files:[f],value:''})}
function fouPhoto(){IMP_FOU=fouCur?fouCur.nom:'';$('impCam').click()}
function loadPdfJs(){return new Promise((res,rej)=>{if(window.pdfjsLib)return res(window.pdfjsLib);
 const s=document.createElement('script');s.src=PDF_V.js;s.onload=()=>res(window.pdfjsLib);
 s.onerror=()=>rej(new Error(i18nT('Module de lecture introuvable : une connexion est nécessaire la première fois.')));document.head.appendChild(s)})}
async function pdfRead(f){
 const L=await loadPdfJs();
 if(!L.GlobalWorkerOptions.workerSrc){try{const t=await (await fetch(PDF_V.worker)).text();L.GlobalWorkerOptions.workerSrc=URL.createObjectURL(new Blob([t],{type:'text/javascript'}))}catch(e){L.GlobalWorkerOptions.workerSrc=PDF_V.worker}}
 const doc=await L.getDocument({data:new Uint8Array(await f.arrayBuffer()),isEvalSupported:false}).promise;
 const words=[];let text='',y0=0;const N=Math.min(doc.numPages,4);
 for(let i=1;i<=N;i++){const pg=await doc.getPage(i),vp=pg.getViewport({scale:2}),tc=await pg.getTextContent();
  tc.items.forEach(it=>{const str=String(it.str||'');if(!str.trim())return;
   const x=it.transform[4]*2,yb=vp.height-it.transform[5]*2,h=Math.max(8,Math.abs(it.transform[3])*2),w=(it.width||str.length*h*.5)*2,cw=w/Math.max(1,str.length);
   let m;const re=/\S+/g;while((m=re.exec(str)))words.push({text:m[0],bbox:{x0:x+m.index*cw,x1:x+(m.index+m[0].length)*cw,y0:y0+yb-h,y1:y0+yb}})});
  const lines={};words.filter(w=>w.bbox.y1>y0).forEach(w=>{const k=Math.round(w.bbox.y1/6);(lines[k]=lines[k]||[]).push(w)});
  text+=Object.keys(lines).sort((a,b)=>a-b).map(k=>lines[k].sort((a,b)=>a.bbox.x0-b.bbox.x0).map(w=>w.text).join(' ')).join('\n')+'\n';
  y0+=vp.height+40}
 if(text.replace(/\s/g,'').length>=30)return{words,text};
 // PDF scanné : on lit l'image de la première page
 const pg=await doc.getPage(1),vp=pg.getViewport({scale:2.2}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
 await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;enhance(c);
 return ocrRun(c.toDataURL('image/jpeg',.9),pc=>setImpMsg(i18nT('Lecture en cours…')+' '+pc+' %'),'6')}
async function docExtract(f){
 const pdf=f.type==='application/pdf'||/\.pdf$/i.test(f.name||'');
 const r=pdf?await pdfRead(f):await ocrRun(await docImg(f),pc=>setImpMsg(i18nT('Lecture en cours…')+' '+pc+' %'),'6');
 IMP_DOC=docMeta(r.text||'');
 {const cur=$('impFour').value.trim();if(IMP_DOC.four&&(!cur||!vnNorm(r.text||'').includes(vnNorm(cur)))){$('impFour').value=IMP_DOC.four;supHint()}}
 impDocShow();
 return rowsFromWords(r.words||[],r.text||'')}
/* ce que dit l'en-tête et le bas du document */
const FOU_KNOWN='Point P|Point.P|Leroy Merlin|Brico Dépôt|Bricodépôt|Castorama|Cedeo|Gedimat|Big Mat|BigMat|Würth|Wurth|Rexel|Sonepar|Tout Faire|Chausson Matériaux|Prolians|Descours & Cabaud|Kiloutou|Loxam|Bricoman|Samse|Dispano|Plateforme du Bâtiment|Brossette|Richardson|Yesss Électrique|Trenois Decamps|Bricomarché|Mr Bricolage|Weldom|Brico Leclerc|Doras|Pum|Frans Bonhomme|Socoda|Comptoir Lyonnais|Lapeyre|Tollens|Seigneurie|Zolpan|Sikkens|Placoplatre|Wienerberger|Weber|Lafarge|Vicat|Gamm vert|Union Matériaux|Bois et Matériaux|Bauhaus|Hornbach';
function frNum(v){v=String(v||'').replace(/[\s\u00a0\u202f]/g,'').replace(/€|eur/i,'');if(/,\d{1,2}$/.test(v))v=v.replace(/\./g,'').replace(',','.');else v=v.replace(/,/g,'');const n=parseFloat(v);return isFinite(n)?n:null}
function docMeta(text){
 const T=String(text||''),L=T.split(/\n/).map(x=>x.trim()).filter(Boolean),o={type:'',num:'',date:'',ttc:null,ht:null,paid:false,four:'',tel:'',email:'',adr:'',siret:''};
 const head=L.slice(0,Math.max(8,Math.ceil(L.length*.4))).join('\n');
 const cnt=re=>(T.match(re)||[]).length;
 const nf=cnt(/\bfacture\b/gi),nd=cnt(/\bdevis\b|\bproposition (?:commerciale|de prix)\b|\boffre de prix\b/gi),nt=cnt(/\bticket\b|\bcaisse\b|\bmerci de votre visite\b/gi),nb=cnt(/\bbon de livraison\b|\bBL\s*n/gi);
 o.type=nf&&(nf>=nd||/^\s*facture\b/im.test(T))?'facture':nd?'devis':nt?'ticket':nb?'bl':'facture';
 if(/\b(?:FACTURE|DEVIS)\b/.test(T)){const up=T.match(/\b(FACTURE|DEVIS)\b/);o.type=up[1]==='FACTURE'?'facture':'devis'}
 const nm=T.match(/\b(?:facture|devis|ticket|bon de livraison|BL)\s*(?:n[°ºo]\.?|num[ée]ro|no\.?)?\s*:?\s*([A-Z]{0,4}[-\/]?\d[\w\-\/]{2,})/i)||T.match(/\bN[°º]\s*:?\s*([A-Z]{0,4}[-\/]?\d[\w\-\/]{2,})/);
 if(nm&&!/^(?:FR)?\d{11}$/.test(nm[1]))o.num=nm[1];
 const dm=T.match(/\bdate[^\n\d]{0,20}(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/i)||T.match(/\b(\d{1,2})[\/.](\d{1,2})[\/.](\d{4}|\d{2})\b/);
 if(dm){let y=+dm[3];if(y<100)y+=2000;const d=+dm[1],m=+dm[2];if(d>=1&&d<=31&&m>=1&&m<=12)o.date=y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0')}
 const MT='([\\d\\s\\u00a0\\u202f.,]*\\d[.,]\\d{2})';
 const tt=T.match(new RegExp('(?:total\\s*t\\.?t\\.?c\\.?|net\\s*[àa]\\s*payer(?:\\s*t\\.?t\\.?c\\.?)?|montant\\s*t\\.?t\\.?c\\.?|total\\s*[àa]\\s*payer|total\\s*(?:eur|€))[^\\d\\n]{0,12}'+MT,'i'));if(tt)o.ttc=frNum(tt[1]);
 const th=T.match(new RegExp('total\\s*(?:net\\s*)?h\\.?t\\.?[^\\d\\n]{0,12}'+MT,'i'));if(th)o.ht=frNum(th[1]);
 if(o.ttc==null){const tl=T.match(new RegExp('\\btotal\\b[^\\d\\n]{0,12}'+MT,'i'));if(tl)o.ttc=frNum(tl[1])}
 o.paid=o.type==='ticket'||/acquitt[ée]e?|\bpay[ée]e?\s+(?:le|par|en|comptant)|r[ée]gl[ée]e?\s+(?:le|par|en)|paiement\s+re[çc]u|d[ée]j[àa]\s+r[ée]gl[ée]|reste\s+[àa]\s+payer\s*:?\s*0[,.]00|\bsold[ée]e\b/i.test(T);
 if(o.type==='devis')o.paid=false;
 // fournisseur : déjà connu, enseigne connue, sinon première ligne de l'en-tête
 const nt0=vnNorm(head),me=vnNorm((db.prof&&db.prof.nom)||'');
 const kn=(db.suppliers||[]).map(x=>x.nom).filter(n=>n&&n.length>2).sort((a,b)=>b.length-a.length).find(n=>nt0.includes(vnNorm(n)));
 const br=!kn&&head.match(new RegExp('\\b('+FOU_KNOWN.replace(/\./g,'\\.').replace(/ /g,'[ .\\-]?')+')\\b','i'));
 if(kn)o.four=kn;else if(br){const b=FOU_KNOWN.split('|').find(x=>new RegExp('^'+x.replace(/\./g,'\\.').replace(/ /g,'[ .\\-]?')+'$','i').test(br[1]));o.four=b==='Point.P'?'Point P':(b||br[1])}
 else{const f=L.slice(0,6).find(x=>/\p{L}{3}/u.test(x)&&!/\b(facture|devis|ticket|date|client|tél|tel|siret|n[°º]|page|bon de)\b/i.test(x)&&!/\d{3}/.test(x)&&x.length<=40&&(!me||vnNorm(x)!==me));if(f)o.four=f.replace(/\s{2,}.*/,'').trim()}
 // coordonnées du fournisseur (dans l'en-tête, pas celles du client)
 const hd=L.slice(0,12).filter(x=>!/\bclient|\bfactur[ée] [àa]|\blivr[ée] [àa]|\bdestinataire/i.test(x)&&!(me&&vnNorm(x).includes(me))).join('\n');
 const c=ctParse(hd);o.tel=c.tel;o.email=c.email;o.adr=c.adr;
 const sm=T.match(/siret\s*:?\s*(\d[\d\s]{12,18}\d)/i);if(sm)o.siret=sm[1].replace(/\s/g,'').slice(0,14);
 return o}
function impDocShow(){const d=IMP_DOC,b=$('impDoc');if(!d){b.hidden=true;return}b.hidden=false;
 $('idT').value=d.type||'facture';$('idN').value=d.num||'';$('idD').value=d.date||'';$('idM').value=d.ttc!=null?d.ttc:'';$('idP').checked=!!d.paid;
 $('idC').innerHTML='<option value="">—</option>'+(db.clients||[]).slice().sort((a,b)=>a.nom.localeCompare(b.nom)).map(c=>`<option value="${esc(c.id)}" data-noi18n>${esc(c.nom)}</option>`).join('');
 const cq=q&&q.client&&(db.clients||[]).find(c=>nameKey(c.nom)===nameKey(q.client));$('idC').value=d.cid||(cq?cq.id:'');d.cid=$('idC').value;
 $('impBox').style.display='block'}
function impDocRead(){const d=IMP_DOC;if(!d)return;d.type=$('idT').value;d.num=$('idN').value.trim();d.date=$('idD').value;d.ttc=frNum($('idM').value);d.paid=$('idP').checked;d.cid=$('idC').value}
/* achats gardés par fournisseur */
const ACH_T={devis:'Devis',facture:'Facture',ticket:'Ticket de caisse',bl:'Bon de livraison'};
function achSave(four,lines){const d=IMP_DOC;if(!d)return null;impDocRead();
 if(!db.achats)db.achats=[];
 const k=nameKey(four||'');let a=d.num?db.achats.find(x=>nameKey(x.four)===k&&x.num===d.num&&x.type===d.type):null;
 const o={four:four||'',type:d.type,num:d.num,date:d.date||ymdL(),ttc:d.ttc,ht:d.ht,paid:!!d.paid&&d.type!=='devis',cid:d.cid||'',lines:lines.map(r=>({l:r.label,q:r.qty,u:r.unit,pu:r.pu,tva:r.tva})),at:Date.now()};
 if(a)Object.assign(a,o);else{a=Object.assign({id:uid()},o);db.achats.unshift(a)}
 if(four){const s=findBy(db.suppliers,four)||upsert('suppliers',{nom:four}).x;
  [['tel','tel'],['email','email'],['adr','adr']].forEach(([k,f])=>{if(d[k]&&!s[f])s[f]=d[k]});if(d.siret&&!s.siret)s.siret=d.siret}
 return a}
function achPaid(id){const a=(db.achats||[]).find(x=>x.id===id);if(!a)return;a.paid=true;a.paidAt=Date.now();save();if(fouCur)fouEdit(fouCur.id);toast(i18nT('Marqué payé.'))}
function achHtml(A){return A.map(a=>{const c=a.cid&&(db.clients||[]).find(x=>x.id===a.cid);
 return `<div class="it ach-it"><span class="it-t"><b><span>${esc(ACH_T[a.type]||a.type)}</span>${a.num?' <span data-noi18n>'+esc(a.num)+'</span>':''}</b><span data-noi18n>${a.ttc!=null?eur(a.ttc):''}</span></span>
 <span class="mut it-s"><span data-noi18n>${a.date?dFR(a.date):''}</span>${c?' · <span data-noi18n>'+esc(c.nom)+'</span>':''}${a.type==='devis'?'':a.paid?' · <span class="tag paid">Payé</span>':' · <span class="tag due">À payer</span>'}</span>
 ${a.type!=='devis'&&!a.paid?`<button class="btn sm sec" onclick="achPaid('${a.id}')"><svg class="i"><use href="#i-check"/></svg><span>Marquer payé</span></button>`:''}</div>`}).join('')}
function fouDueHtml(){const D=(db.achats||[]).filter(a=>a.type!=='devis'&&!a.paid);if(!D.length)return'';
 const t=D.reduce((s,a)=>s+(a.ttc||0),0);return `<div class="ach-due"><svg class="i"><use href="#i-warn"/></svg><span>${i18nT('{1} à payer').replace('{1}',D.length)}</span><b data-noi18n>${eur(t)}</b></div>`}

/* --- affichage et validation --- */
function statusOf(r){
 if(r.warn)return{c:'#e8710a',t:r.warn,ic:'warn'};
 if(r.ok===true)return{c:'#1e8e3e',t:''};
 return{c:'#dde1e7',t:''}}
function paintStatus(i){
 const r=impRows[i],s=statusOf(r),b=$('impL'+i),t=$('impS'+i);
 if(b)b.style.borderLeftColor=s.c;
 if(t){t.innerHTML=stHtml(s);t.style.color=s.c}}
function stHtml(s){return s.t?(s.ic?'<svg class="i i-sm"><use href="#i-'+s.ic+'"/></svg> ':'')+'<span>'+esc(s.t)+'</span>':''}
function impEdit(i,k,val){
 const r=impRows[i];
 if(k==='label'||k==='unit')r[k]=val;
 else r[k]=parseFloat(String(val).replace(',','.'))||0;
 if((k==='qty'||k==='pu')&&r.nums&&r.nums.length>=2){
  r.ok=verify(r.nums,r.qty,r.pu);r.warn=r.ok?'':'quantité × prix introuvable dans les chiffres lus : vérifie';
  paintStatus(i)}}
function renderImp(){
 $('impBox').style.display=impRows.length||IMP_DOC?'block':'none';
 $('impRows').innerHTML=impRows.map((r,i)=>{
  const s=statusOf(r);
  return `
 <div class="line" id="impL${i}" style="border-left:5px solid ${s.c};padding-left:8px">
  <div class="imp-l1"><input type="checkbox" aria-label="Garder cette ligne" ${r.on?'checked':''} onchange="impRows[${i}].on=this.checked;this.closest('.line').classList.toggle('off',!this.checked)"><input value="${esc(r.label)}" aria-label="Désignation" oninput="impEdit(${i},'label',this.value)"></div>
  <div class="row" style="margin-top:6px">
   <div><label>Qté</label><input type="number" inputmode="decimal" value="${r.qty}" oninput="impEdit(${i},'qty',this.value)"></div>
   <div><label>Unité</label><input value="${esc(r.unit)}" oninput="impEdit(${i},'unit',this.value)"></div>
   <div><label>Prix HT</label><input type="number" inputmode="decimal" value="${r.pu}" oninput="impEdit(${i},'pu',this.value)"></div>
   <div><label>TVA %</label><input type="number" inputmode="decimal" value="${r.tva}" oninput="impEdit(${i},'tva',this.value)"></div>
  </div>
  <div class="mut" id="impS${i}" style="color:${s.c}">${stHtml(s)}</div>
 </div>`}).join('');
}
function applyImp(){
 const sel=impRows.filter(r=>r.on&&r.label.trim());
 if(!sel.length&&!IMP_DOC){alert('Rien à ajouter.');return}
 const four=$('impFour').value.trim(),m=parseFloat($('impMarge').value)||0,dest=$('impDest').value;
 if(four&&sel.length)learnFrom(four,sel);
 const ach=achSave(four,sel);
 sel.forEach(r=>{
  const vente=Math.round(r.pu*(1+m/100)*100)/100;
  logPrice(r.label,four,r.pu,r.unit);
  if(dest==='rien')return;
  if(dest==='prix'){
   const ex=db.prices.find(p=>p.nom.toLowerCase()===r.label.toLowerCase());
   if(ex){ex.prix=vente;ex.unit=r.unit;ex.tva=r.tva;if(four)ex.four=four}
   else db.prices.push({id:uid(),nom:r.label,unit:r.unit,prix:vente,tva:r.tva,four});
  }else q.lines.push({label:r.label,qty:r.qty,unit:r.unit,pu:vente,tva:r.tva});
 });
 save();renderQuick();renderPrices();renderLines();
 const n=sel.length;impRows=[];IMP_DOC=null;$('impDoc').hidden=true;renderImp();
 setImpMsg(dest==='rien'||!n?i18nT('Document enregistré.'):n+' lignes ajoutées'+(dest==='prix'?' à tes prix.':' au devis.'));
 if(ach&&four){const s=findBy(db.suppliers,four);if(s){toast(i18nT('Document enregistré.'));setTimeout(()=>fouEdit(s.id),600)}}
}

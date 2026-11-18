/* casô · Listes : glisser une ligne vers la gauche pour la corbeille
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Listes : glisser une ligne vers la gauche fait apparaître la corbeille ----------
   Une ligne se déclare avec data-sw="type:id". Les factures et les encaissements ne sont jamais supprimables (obligation légale). */
function swQ(x){const st=x.status||'brouillon';return !(x.sign&&x.sign.st==='signed')&&st!=='accepte'&&st!=='paye'}
const SW_DEL={
 cli:id=>{const x=db.clients.find(c=>c.id===id);if(!x||!confirm(i18nT('Supprimer ce client ?')))return;db.clients=db.clients.filter(c=>c.id!==id);save();cliRender()},
 fou:id=>{const x=db.suppliers.find(c=>c.id===id);if(!x||!confirm(i18nT('Supprimer ce fournisseur ?')))return;db.suppliers=db.suppliers.filter(c=>c.id!==id);save();fouRender()},
 pr:id=>delPrice(id),
 fav:id=>{db.favs=favList().filter(f=>f.id!==id);save();favShow()},
 q:id=>{const x=db.quotes.find(y=>y.id===id);if(!x||!swQ(x)||!confirm(i18nT('Supprimer ce devis ?')))return;db.quotes=db.quotes.filter(y=>y.id!==id);save();renderHisto()},
 ch:id=>delCh(id),
 pe:id=>delPerson(id)};
let SW=null;
function swClose(ex){document.querySelectorAll('.sw.open').forEach(w=>{if(w!==ex){w.classList.remove('open');w.firstChild.style.transform=''}})}
function swWrap(el){if(el.parentNode&&el.parentNode.classList.contains('sw'))return el.parentNode;
 const w=document.createElement('div');w.className='sw';el.parentNode.insertBefore(w,el);w.appendChild(el);el.classList.add('sw-in');
 const b=document.createElement('button');b.type='button';b.className='sw-del';b.setAttribute('aria-label',i18nT('Supprimer'));b.innerHTML='<svg class="i"><use href="#i-trash"/></svg>';
 b.onclick=e=>{e.stopPropagation();const [t,id]=el.dataset.sw.split(':');swClose();const f=SW_DEL[t];if(f)f(id)};w.appendChild(b);return w}
document.addEventListener('pointerdown',e=>{const el=e.target.closest&&e.target.closest('[data-sw]');if(!el){if(!(e.target.closest&&e.target.closest('.sw-del')))swClose();return}
 if(e.button>0)return;SW={el,x:e.clientX,y:e.clientY,dx:0,on:false,open:!!(el.parentNode&&el.parentNode.classList.contains('open'))};swClose(el.parentNode)},true);
document.addEventListener('pointermove',e=>{if(!SW)return;const s=document.documentElement.dir==='rtl'?-1:1,dx=(e.clientX-SW.x)*s,dy=e.clientY-SW.y;
 if(!SW.on){if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){SW=null;return}if(Math.abs(dx)<10)return;SW.on=true;SW.w=swWrap(SW.el);SW.w.classList.add('drag')}
 const base=SW.open?-76:0,v=Math.max(-110,Math.min(0,base+dx));SW.dx=v;SW.el.style.transform=`translateX(${v*s}px)`},true);
function swEnd(){if(!SW)return;const s=SW;SW=null;if(!s.on)return;const w=s.w;w.classList.remove('drag');const open=s.dx<-38;
 w.classList.toggle('open',open);s.el.style.transform=open?`translateX(${document.documentElement.dir==='rtl'?76:-76}px)`:'';
 // évite que le glissement ouvre la fiche
 const stop=ev=>{ev.stopPropagation();ev.preventDefault()};document.addEventListener('click',stop,{capture:true,once:true});setTimeout(()=>document.removeEventListener('click',stop,{capture:true}),350)}
document.addEventListener('pointerup',swEnd,true);document.addEventListener('pointercancel',swEnd,true);

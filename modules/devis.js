/* casô · Devis : rendu, éditeur à blocs, devis, mes services, historique
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Créer mon devis : rendu du document (commun à l'appli, au PDF et à la page de signature) ---------- */
var CVD=(function(){
 var TAGS={div:1,span:1,b:1,p:1,h3:1,ul:1,li:1,table:1,thead:1,tbody:1,tr:1,th:1,td:1,img:1,hr:1,figure:1,figcaption:1,small:1};
 var ATTR={c:1,s:1,src:1,alt:1,colspan:1,'data-b':1};
 var CSSK={'--cv-ac':1,'--cv-ink':1,color:1,background:1,height:1,'text-align':1};
 function h(t,a,c){return{t:t,a:a||{},c:c==null?[]:(Array.isArray(c)?c:[c])}}
 function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
 var EURF=null;function eur(n){EURF=EURF||new Intl.NumberFormat('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2});return EURF.format(Math.round((+n||0)*100)/100)+'\u00a0€'}
 function num(n){return String(Math.round((+n||0)*100)/100).replace('.',',')}
 function dfr(s){var d=new Date(s);return isNaN(d)?'':d.toLocaleDateString('fr-FR')}
 function tot(o){var r=(o.remise||0)/100,ht=0,tv={};(o.lines||[]).forEach(function(l){var m=(+l.qty||0)*(+l.pu||0)*(1-r);ht+=m;var t=o.franchise?0:(+l.tva||0);tv[t]=(tv[t]||0)+m*t/100});
  var tva=0;Object.keys(tv).forEach(function(k){tva+=tv[k]});return{ht:ht,tv:tv,tva:tva,ttc:ht+tva,acompte:(ht+tva)*(o.acompte||0)/100}}
 function col(c){return /^#[0-9a-fA-F]{6}$/.test(c||'')?c:'#e0a800'}
 function ink(c){c=col(c);var r=parseInt(c.substr(1,2),16),g=parseInt(c.substr(3,2),16),b=parseInt(c.substr(5,2),16);return (0.299*r+0.587*g+0.114*b)>150?'#111111':'#ffffff'}
 function okSrc(v){return typeof v==='string'&&/^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+\/=]+$/.test(v)}
 function okCss(v){return typeof v==='string'&&v.length<60&&!/url\(|expression|[;{}<>"'\\]/i.test(v)}
 function lim(o,p){var v=parseInt(p.valid)||30,d=new Date(o.date);return isNaN(d)?'':dFR(d.getTime()+v*864e5)}
 function tok(s,x){var t=x.t;return String(s||'').replace(/\{(client|acompte|ttc|ht|date|num|validite)\}/g,function(_,k){
  return k==='client'?(x.q.client||''):k==='acompte'?((x.q.acompte||0)+' % ('+eur(t.acompte)+')'):k==='ttc'?eur(t.ttc):k==='ht'?eur(t.ht):k==='date'?dfr(x.q.date):k==='num'?(x.q.num||''):lim(x.q,x.prof)})}
 function para(s,x){var out=[],ul=null;String(s||'').split(/\n/).forEach(function(l){var m=/^\s*[-•]\s+(.*)$/.exec(l);
  if(m){if(!ul){ul=h('ul');out.push(ul)}ul.c.push(h('li',null,tok(m[1],x)))}else{ul=null;if(l.trim())out.push(h('p',null,tok(l,x)))}});return out}
 function ph(x,t){return x.edit?h('div',{c:'cv-ph'},x.tr(t)):null}
 function cap(t){return h('div',{c:'cv-cap'},t)}
 function hidden(b,k){return (b.hide||[]).indexOf(k)>=0}

 var R={};
 R.title=function(b,x){var q=x.q;return h('div',{c:'cv-ti al-'+(b.al||'r')},[
  h('div',{c:'cv-tt'},(b.txt||'DEVIS')+(q.num?' '+q.num:'')),
  q.num||!x.edit?null:h('div',{c:'cv-phs'},x.tr('N° attribué à l\'enregistrement')),
  h('div',null,'Date : '+dfr(q.date)),
  h('div',null,'Valable jusqu\'au '+lim(q,x.prof))])};
 R.head=function(b,x){var p=x.prof,band=x.st.hd==='band',ac=col(x.st.ac);
  var who=[h('div',{c:'cv-nm'},p.nom||(x.edit?x.tr('Nom de ton entreprise'):''))];
  [hidden(b,'adr')?'':p.adr,hidden(b,'siret')||!p.siret?'':'SIRET : '+p.siret,hidden(b,'tel')||!p.tel?'':'Tél : '+p.tel,hidden(b,'email')?'':p.email].forEach(function(t){if(t)who.push(h('div',null,t))});
  var L=[];if(b.logo&&okSrc(x.imgs.logo))L.push(h('img',{c:'cv-logo',src:x.imgs.logo,alt:''}));
  L.push(h('div',{c:'cv-who'},who));
  var k=[h('div',{c:'cv-hl'},L)];if(b.ti)k.push(R.title({al:'r',txt:b.txt},x));
  return h('div',{c:'cv-head al-'+(b.al||'l')+(band?' band':'')+(b.ti?' wti':''),s:band?{background:ac,color:ink(ac)}:null},k)};
 R.client=function(b,x){var q=x.q;
  if(!q.client&&!q.adr)return ph(x,'Touche pour indiquer le client et le chantier')||h('div');
  var a=[cap(b.lab||'Client'),h('div',{c:'cv-big'},q.client||'')];if(q.tel)a.push(h('div',null,q.tel));
  var k=[h('div',null,a)];if(q.adr)k.push(h('div',null,[cap(b.lab2||'Chantier'),h('div',null,q.adr)]));
  return h('div',{c:'cv-cli'},k)};
 R.lines=function(b,x){var q=x.q,L=q.lines||[],C=['qty','unit','pu','tva'].filter(function(k){return !hidden(b,k)&&!(k==='tva'&&q.franchise)});
  var out=[];if(b.h)out.push(h('h3',{c:'cv-h'},b.h));
  if(!L.length){out.push(ph(x,'Touche pour ajouter les prestations'));return h('div',null,out)}
  var H={qty:'Qté',unit:'Unité',pu:'PU HT',tva:'TVA'};
  var th=[h('th',null,'Désignation')].concat(C.map(function(k){return h('th',{c:k==='unit'?'':'r'},H[k])})).concat([h('th',{c:'r'},'Total HT')]);
  var rows=L.map(function(l){return h('tr',null,[h('td',null,l.label||'')].concat(C.map(function(k){
   return h('td',{c:k==='unit'?'':'r'},k==='qty'?num(l.qty):k==='unit'?(l.unit||''):k==='pu'?eur(l.pu):num(l.tva)+' %')})).concat([h('td',{c:'r'},eur((+l.qty||0)*(+l.pu||0)))]))});
  out.push(h('table',{c:'cvt th-'+(x.st.th||'lines')},[h('thead',null,h('tr',null,th)),h('tbody',null,rows)]));
  return h('div',null,out)};
 R.totals=function(b,x){var q=x.q,t=x.t,r=[];function row(k,v,c){r.push(h('div',{c:'cv-tr'+(c?' '+c:'')},[h('span',null,k),h('b',null,v)]))}
  if(q.remise)row('Remise',num(q.remise)+' %');
  row('Total HT',eur(t.ht));
  if(q.franchise)r.push(h('div',{c:'cv-tr sm'},'TVA non applicable, art. 293 B du CGI'));
  else Object.keys(t.tv).forEach(function(k){row('TVA '+num(k)+' %',eur(t.tv[k]),'sm')});
  row('Total TTC',eur(t.ttc),'big');
  if(q.acompte&&!hidden(b,'ac'))row('Acompte à la signature ('+num(q.acompte)+' %)',eur(t.acompte),'sm');
  return h('div',{c:'cv-tot al-'+(b.al||'r')},h('div',{c:'cv-tb'},r))};
 R.text=function(b,x){var k=[];if(b.h)k.push(h('h3',{c:'cv-h'},tok(b.h,x)));var P=para(b.body,x);
  if(P.length)k=k.concat(P);else if(!b.h)k.push(ph(x,'Touche pour écrire'));else if(x.edit)k.push(ph(x,'Touche pour écrire'));
  return h('div',{c:'cv-tx st-'+(b.st||'plain')+' al-'+(b.al||'l')+' fs-'+(b.fs||'m')},k)};
 R.image=function(b,x){var I=(b.imgs||[]).filter(function(id){return okSrc(x.imgs[id])});
  if(!I.length)return ph(x,'Touche pour ajouter des photos');var per=Math.min(3,Math.max(1,+b.per||Math.min(I.length,2)));
  var k=[];if(b.h)k.push(h('h3',{c:'cv-h'},b.h));
  k.push(h('div',{c:'cv-gal per-'+per},I.map(function(id){return h('figure',null,h('img',{src:x.imgs[id],alt:''}))})));
  if(b.cap)k.push(h('div',{c:'cv-fc'},b.cap));return h('div',null,k)};
 R.qty=function(b,x){var Q=b.rows&&b.rows.length?b.rows:(x.q.planRows||[]),from=b.rows&&b.rows.length?b.from:x.q.planFrom,at=b.rows&&b.rows.length?b.at:x.q.planAt;var k=[h('h3',{c:'cv-h'},b.h||'Surfaces et quantités')];
  if(!Q.length){if(!x.edit)return null;k.push(ph(x,'Touche pour reprendre les mesures d\'un plan'));return h('div',null,k)}
  k.push(h('table',{c:'cvt th-'+(x.st.th||'lines')},h('tbody',null,Q.map(function(r){return h('tr',null,[h('td',null,r.lab||''),h('td',{c:'r'},(r.ok||r.u==='u'?'':'~ ')+(r.u==='u'?String(r.v):num(r.v))+' '+(r.u||''))])}))));
  var n=[];if(from)n.push('Mesures du plan « '+from+' »'+(at?' relevées le '+dfr(at):'')+', validées par l\'entreprise.');
  if(Q.some(function(r){return !r.ok&&r.u!=='u'}))n.push('~ : valeur estimée, à confirmer sur place.');
  if(n.length)k.push(h('div',{c:'cv-fc'},n.join(' ')));return h('div',null,k)};
 R.legal=function(b,x){var p=x.prof,q=x.q,L=[];
  if(!hidden(b,'valid'))L.push('Devis valable '+(parseInt(p.valid)||30)+' jours à compter du '+dfr(q.date)+'.');
  if(q.franchise)L.push('TVA non applicable, art. 293 B du CGI.');
  if(!hidden(b,'assur')){if(p.assur)L.push('Assurance décennale : '+p.assur+'.');else if(x.edit)L.push('⚠ '+x.tr('Assurance décennale à renseigner dans Mon entreprise.'))}
  if(!hidden(b,'ent'))[p.forme,p.rm&&('RM / RCS : '+p.rm),p.tvai&&('N° TVA intracommunautaire : '+p.tvai)].forEach(function(t){if(t)L.push(t)});
  var k=L.map(function(t){return h('div',null,t)});if(b.x)k=k.concat(para(b.x,x));
  return h('div',{c:'cv-lg'},k)};
 R.sign=function(b,x){if(x.noSign)return null;var q=x.q,s=q.sign;
  var c=[cap('Bon pour accord, date et signature du client')];
  if(s&&s.st==='signed')c.push(h('div',null,'Signé électroniquement par '+(s.clientName||'')+' le '+new Date(s.signedAt).toLocaleString('fr-FR')));else c.push(h('div',{c:'cv-sz'}));
  var e=[cap('Signature de l\'entreprise')];if(okSrc(q.proSig))e.push(h('img',{c:'cv-sgi',src:q.proSig,alt:''}));else e.push(h('div',{c:'cv-sz'}));
  return h('div',{c:'cv-sg'},[h('div',null,c),h('div',null,e)])};
 R.sep=function(b,x){return h('hr',{c:'cv-hr'+(b.ac?' ac':'')})};
 R.space=function(b,x){return h('div',{c:'cv-sp',s:{height:({s:'10px',m:'24px',l:'48px'})[b.sz||'m']||'24px'}})};

 var EXB={client:1,lines:1,totals:1,qty:1};
 function tree(q,o){o=o||{};var cv=q.cv||{},st=cv.st||{};
  var x={q:q,prof:o.prof||{},imgs:Object.assign({},cv.imgs||{},o.imgs||{}),st:st,edit:!!o.edit,noSign:!!o.noSign,t:tot(q),tr:o.tr||function(s){return s}};
  var k=[];(cv.blocks||[]).forEach(function(b){var f=R[b.t];if(!f)return;var n=f(b,x);if(!n)return;
   k.push(h('div',{c:'cvb cvb-'+b.t+(o.sample&&EXB[b.t]?' cvb-ex':''),'data-b':String(b.id||'')},n))});
  var ac=col(st.ac);
  return h('div',{c:'cvd ff-'+(st.ff||'sans')+' fs-'+(st.fs||'m')+' gp-'+(st.gp||'n'),s:{'--cv-ac':ac,'--cv-ink':ink(ac)}},k)}
 function str(n){if(n==null||n===false)return'';if(typeof n!=='object')return esc(n);
  var t=TAGS[n.t]?n.t:'div',a='';
  for(var k in n.a){var v=n.a[k];if(v==null||!ATTR[k])continue;
   if(k==='s'){var ss='';for(var p in v)if(CSSK[p]&&v[p]!=null&&okCss(String(v[p])))ss+=p+':'+v[p]+';';if(ss)a+=' style="'+esc(ss)+'"'}
   else if(k==='src'){if(okSrc(v))a+=' src="'+v+'"'}
   else a+=' '+(k==='c'?'class':k)+'="'+esc(v)+'"'}
  if(t==='img'||t==='hr')return'<'+t+a+'>';
  return'<'+t+a+'>'+n.c.map(str).join('')+'</'+t+'>'}
 function dom(n,d){d=d||document;if(n==null||n===false)return null;if(typeof n!=='object')return d.createTextNode(String(n));
  var e=d.createElement(TAGS[n.t]?n.t:'div');
  for(var k in n.a){var v=n.a[k];if(v==null||!ATTR[k])continue;
   if(k==='s'){for(var p in v)if(CSSK[p]&&v[p]!=null&&okCss(String(v[p])))e.style.setProperty(p,v[p])}
   else if(k==='src'){if(okSrc(v))e.setAttribute('src',v)}
   else e.setAttribute(k==='c'?'class':k,String(v))}
  n.c.forEach(function(c){var x=dom(c,d);if(x)e.appendChild(x)});return e}
 return{html:function(q,o){return str(tree(q,o))},block:function(q,b,o){var t=tree(Object.assign({},q,{cv:Object.assign({},q.cv,{blocks:[b]})}),o);return t.c.length?str(t.c[0]):''},dom:function(q,o){return dom(tree(q,o))},tot:tot,col:col,ink:ink,okSrc:okSrc,R:R};
})();

/* ---------- Créer mon devis : éditeur à blocs ---------- */
const CV={on:false,q:null,sel:null,U:[],Rd:[],prev:false,ro:false,dirty:false,pend:false,tm:0,drag:null,eb:null,at:null,tpMode:'new'};
const CV_BN={head:'En-tête',title:'Titre du devis',client:'Client et chantier',lines:'Prestations',totals:'Totaux',text:'Texte',image:'Photos',qty:'Surfaces du plan',legal:'Mentions légales',sign:'Signatures',sep:'Séparateur',space:'Espace'};
const CV_MAND={head:1,client:1,lines:1,totals:1,legal:1,sign:1};
const CV_PRE={
 pres:{t:'text',h:'Présentation',body:''},
 obj:{t:'text',h:'Objet des travaux',body:''},
 pay:{t:'text',h:'Conditions de paiement',body:'Acompte de {acompte} à la signature du devis.\nSolde à la fin des travaux, par virement ou chèque.'},
 del:{t:'text',h:'Délais d\'exécution',body:'Début des travaux : à convenir ensemble.\nDurée estimée : à préciser.'},
 gar:{t:'text',h:'Garanties',body:'- Garantie de parfait achèvement : 1 an\n- Garantie biennale de bon fonctionnement : 2 ans\n- Garantie décennale : 10 ans'},
 box:{t:'text',st:'box',h:'À noter',body:''}};
const CV_ADD=[['text','edit','Texte','Un titre et un paragraphe libres'],['box','warn','Encadré','Un texte mis en avant'],['image','img','Photos','1 à 3 photos par ligne'],
 ['qty','area','Surfaces du plan','Les mesures validées d\'un plan'],['pay','doc','Conditions de paiement','Texte prêt, modifiable'],['del','clock','Délais d\'exécution','Texte prêt, modifiable'],
 ['gar','shield','Garanties','Texte prêt, modifiable'],['obj','quote','Objet des travaux','Décris le chantier'],['title','quote','Titre du devis','Numéro, date et validité'],
 ['sep','list','Séparateur','Un trait'],['space','height','Espace','Un espace vide']];
const CV_TPL={
 classique:{n:'Classique',d:'La mise en page habituelle, claire et complète.',st:{ac:'#e0a800',ff:'sans',fs:'m',th:'lines',hd:'plain',gp:'n'},b:[['head',{ti:1,logo:1}],['client'],['lines'],['totals'],['legal'],['sign']]},
 moderne:{n:'Moderne',d:'Bandeau de couleur et tableau rayé.',st:{ac:'#1f5fbf',ff:'sans',fs:'m',th:'zebra',hd:'band',gp:'n'},b:[['head',{ti:1,logo:1}],['client'],['obj'],['lines'],['totals'],['pay'],['legal'],['sign']]},
 epure:{n:'Épuré',d:'Police à empattements, beaucoup d\'air.',st:{ac:'#18181a',ff:'serif',fs:'m',th:'min',hd:'plain',gp:'a'},b:[['title',{al:'l'}],['head',{logo:1}],['sep'],['client'],['lines'],['totals'],['legal'],['sign']]},
 complet:{n:'Dossier complet',d:'Présentation, photos, mesures du plan, délais et garanties.',st:{ac:'#16854a',ff:'sans',fs:'m',th:'zebra',hd:'band',gp:'n'},b:[['head',{ti:1,logo:1}],['client'],['pres'],['image'],['qty'],['lines'],['totals'],['del'],['pay'],['gar'],['legal'],['sign']]},
 vide:{n:'Page blanche',d:'Seulement les blocs obligatoires, à toi de compléter.',st:{ac:'#e0a800',ff:'sans',fs:'m',th:'lines',hd:'plain',gp:'n'},b:[['head',{ti:1}],['client'],['lines'],['totals'],['legal'],['sign']]}};
const CV_SW=['#e0a800','#e8590c','#c62828','#b5179e','#1f5fbf','#0b7285','#16854a','#18181a'];
const cvJ=o=>JSON.parse(JSON.stringify(o));
function cvBlk(t,p){const pr=CV_PRE[t];return Object.assign({id:uid()},pr?cvJ(pr):{t},p||{})}
function cvMk(key){const T=CV_TPL[key]||(db.cvTpl||[]).find(x=>x.id===key)||CV_TPL.classique;
 return{v:1,tpl:key,st:cvJ(T.st),blocks:T.b.map(([t,p])=>cvBlk(t,p)),imgs:{}}}
function cvLogo(){const l=db.prof&&db.prof.logo;return l?{logo:l}:{}}
function cvDocOf(o){const c=o.cv,used={};c.blocks.forEach(b=>(b.imgs||[]).forEach(id=>{if(c.imgs[id])used[id]=c.imgs[id]}));
 if(c.blocks.some(b=>b.t==='head'&&b.logo)&&db.prof&&db.prof.logo)used.logo=db.prof.logo;
 return{v:1,st:cvJ(c.st||{}),blocks:cvJ(c.blocks),imgs:used}}
function cvRo(o){return ['accepte','paye'].includes(o.status)||!!(o.sign&&o.sign.st==='signed')}

/* --- ouverture --- */
/* « Créer mon devis » construit LE modèle de l'entreprise (sans client) ; chaque devis du chat sort avec ce modèle */
function cvModel(){const m=db.prof&&db.prof.cvModel;return m&&Array.isArray(m.blocks)?m:null}
function cvSampleQ(cv){const p=db.prof||{};return{id:'modele',num:'',date:ymdL(),client:'Nom du client',tel:'06 00 00 00 00',adr:'Adresse du chantier',
 lines:[{label:'Exemple de prestation',qty:10,unit:'m²',pu:40,tva:10},{label:'Main d\'œuvre',qty:8,unit:'h',pu:45,tva:10}],remise:0,acompte:30,franchise:false,
 planRows:[{lab:'Sol',v:12.4,u:'m²',ok:1},{lab:'Périmètre',v:14.2,u:'ml',ok:1}],planFrom:'Salle de bain',planAt:ymdL(),cv}}
function cvStart(){const m=cvModel();if(m)cvOpenModel(cvJ(m));else cvTpOpen('new')}
function cvOpenModel(m){if(!m.imgs)m.imgs={};CV.model=true;cvOpen(cvSampleQ(m))}
function cvModelSave(quiet){
 const c=CV.q.cv,used=new Set();c.blocks.forEach(b=>(b.imgs||[]).forEach(x=>used.add(x)));const imgs={};used.forEach(k=>{if(c.imgs[k])imgs[k]=c.imgs[k]});
 const blocks=cvJ(c.blocks).map(b=>{delete b.rows;delete b.from;delete b.at;return b});
 db.prof=Object.assign({},db.prof||{},{cvModel:{v:1,tpl:c.tpl,st:cvJ(c.st||{}),blocks,imgs,at:Date.now()}});db.profAt=Date.now();save();
 CV.dirty=false;cvBar();if(!quiet)toast('Modèle enregistré : il sera utilisé pour tous tes prochains devis.');return true}
function cvSaveBtn(){if(CV.model)cvModelSave();else cvSave()}
/* modèle figé dans le devis au moment de l'envoi : le client signe exactement ce qu'il a vu */
function cvFreeze(o){const m=cvModel();if(!m)return null;const c=cvJ(m);c.blocks.forEach(b=>{if(b.t==='qty'&&o.planRows){b.rows=cvJ(o.planRows);b.from=o.planFrom||'';b.at=o.planAt||''}});return c}
function cvWith(o){return o.cv&&o.cv.blocks?o:(cvModel()?Object.assign({},o,{cv:cvFreeze(o)}):null)}
function cvNew(key){
 const cur=$('cvTpCur'),use=cur&&!cur.hidden&&cur.querySelector('input').checked;
 const o=use?cvJ(q):newObj();if(use){delete o.cv}
 cvSheet('cvTp',false);if(CV.on&&CV.model){cvTpPick(key);return}cvOpenModel(cvMk(key));CV.dirty=true}
function cvOpen(o){
 Object.assign(CV,{q:o,sel:null,U:[],Rd:[],dirty:false,pend:false,on:true,eb:null});if(o.id!=='modele')CV.model=false;
 $('cvInfo').hidden=!CV.model;
 CV.ro=cvRo(o);CV.prev=CV.ro;
 $('cv').hidden=false;document.body.classList.add('cv-on');cvRender();$('cvStage').scrollTop=0}
function cvHas(){const o=CV.q;return !!(o.client||o.lines.length||Object.keys(o.cv.imgs).length||o.cv.blocks.some(b=>b.t==='text'&&b.body&&!Object.values(CV_PRE).some(p=>p.body===b.body)))}
function cvClose(){
 if(CV.model){if(CV.dirty)cvModelSave()}
 else if(CV.dirty&&!CV.ro&&cvHas()){cvStore();toast(('Brouillon enregistré dans Mes devis'))}
 ['cvSh','cvAdd','cvSt','cvTp'].forEach(s=>{if(!$(s).hidden)cvSheet(s,false)});
 CV.on=false;$('cv').hidden=true;document.body.classList.remove('cv-on');
 if($('s-histo')&&$('s-histo').classList.contains('on'))renderHisto()}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&CV.on&&CV.dirty&&!CV.ro){try{if(CV.model)cvModelSave(true);else if(cvHas())cvStore()}catch(e){}}});

/* --- rendu --- */
function cvRender(){if(!CV.on)return;
 const pg=$('cvPage'),ed=!CV.prev&&!CV.ro,o=CV.q;
 pg.innerHTML=CVD.html(o,{edit:ed,prof:db.prof||{},imgs:cvLogo(),tr:i18nT,sample:CV.model});pg.classList.toggle('ed',ed);
 const d=pg.firstElementChild;
 if(ed&&d){const B=[...d.querySelectorAll(':scope>.cvb')];
  const ins=i=>{const b=document.createElement('button');b.type='button';b.className='cv-ins';b.dataset.at=i;b.setAttribute('aria-label',i18nT('Insérer un bloc ici'));b.innerHTML='<span aria-hidden="true">+</span>';return b};
  B.forEach((e,i)=>{const b=o.cv.blocks.find(x=>x.id===e.dataset.b);e.tabIndex=0;e.setAttribute('role','button');e.setAttribute('aria-label',i18nT(CV_BN[b.t]));e.before(ins(i))});
  d.appendChild(ins(B.length));
  const s=CV.sel&&B.find(e=>e.dataset.b===CV.sel);
  if(s){const b=o.cv.blocks.find(x=>x.id===CV.sel);s.classList.add('sel');s.setAttribute('aria-pressed','true');
   const l=document.createElement('span');l.className='cv-lab';l.textContent=i18nT(CV_BN[b.t])+(CV_MAND[b.t]?' · '+i18nT('obligatoire'):'');s.appendChild(l);
   const g=document.createElement('button');g.type='button';g.className='cv-grip';g.setAttribute('aria-label',i18nT('Glisser pour déplacer'));
   g.innerHTML='<svg class="i"><use href="#i-menu"/></svg>';g.addEventListener('pointerdown',cvGripDown);s.appendChild(g)}
  else CV.sel=null}
 cvFit();cvBar();cvDock()}
function cvFit(){const pg=$('cvPage'),w=$('cvWrap'),a4=CV.prev||CV.ro;pg.classList.toggle('a4',a4);
 if(!a4){pg.style.transform='';w.style.height='';return}
 const s=Math.min(1,(w.clientWidth||360)/794);pg.style.transform='scale('+s+')';w.style.height=Math.ceil(pg.offsetHeight*s)+'px'}
window.addEventListener('resize',()=>{if(CV.on)cvFit()});
function cvBar(){const o=CV.q;
 if(CV.model){$('cvTt').textContent=i18nT('Mon modèle de devis');$('cvTs').textContent=i18nT(CV.dirty?'Modifications à enregistrer':cvModel()?'Utilisé pour tous tes devis':'Pas encore enregistré')}
 else{$('cvTt').textContent=o.client||i18nT('Nouveau devis');$('cvTs').textContent=(o.num||i18nT('Brouillon'))+' · '+eur(totals(o).ttc)}
 $('cvUn').disabled=!CV.U.length||CV.ro;$('cvRe').disabled=!CV.Rd.length||CV.ro;
 $('cvEye').classList.toggle('on',CV.prev);$('cvEye').setAttribute('aria-pressed',CV.prev);
 ['cvUn','cvRe','cvEye','cvSv'].forEach(i=>$(i).hidden=CV.ro)}
function cvDock(){const o=CV.q,b=CV.sel&&o.cv.blocks.find(x=>x.id===CV.sel),dk=$('cvDock');let h='';
 const A=(ic,t,fn,dis,cls)=>`<button type="button" class="cv-act${cls?' '+cls:''}" onclick="${fn}"${dis?' disabled':''}><svg class="i"><use href="#i-${ic}"/></svg><span>${t}</span></button>`;
 if(CV.ro){const ok=['accepte','paye'].includes(o.status);
  h=`<p class="cv-note mut"><svg class="i i-sm"><use href="#i-shield"/></svg><span>Devis validé par le client : la mise en page ne peut plus être modifiée.</span></p>`+(ok?`<button class="btn" onclick="cvPdf()"><svg class="i"><use href="#i-doc"/></svg>PDF</button>`:'')}
 else if(CV.prev)h=`<button class="btn sec" onclick="cvPrev(false)"><svg class="i"><use href="#i-edit"/></svg>Modifier</button>`+(CV.model?`<button class="btn" onclick="cvModelSave()"><svg class="i"><use href="#i-check"/></svg>Enregistrer mon modèle</button>`:`<button class="btn" onclick="cvSend()"><svg class="i"><use href="#i-send"/></svg>Envoyer pour signature</button>`);
 else if(b){const i=o.cv.blocks.indexOf(b),n=o.cv.blocks.length;
  h=`<div class="cv-acts">${A('chev','Monter','cvMove(-1)',i===0,'up')}${A('chev','Descendre','cvMove(1)',i===n-1,'dn')}${A('edit','Modifier','cvEdit(CV.sel)')}${A('plus','Dupliquer','cvDup()',CV_MAND[b.t]||b.t==='title')}${A('x','Supprimer','cvDel()',false,'ko'+(CV_MAND[b.t]?' lock':''))}</div>`}
 else h=`<button class="btn sec cv-stb" onclick="cvStOpen()"><svg class="i"><use href="#i-edit"/></svg>Style</button><button class="btn" onclick="cvAddOpen()"><svg class="i"><use href="#i-plus"/></svg>Ajouter un bloc</button>`;
 dk.innerHTML=h}
function cvPrev(on){CV.prev=on;if(on)CV.sel=null;cvRender();$('cvStage').scrollTop=0}

/* --- sélection, clavier --- */
function cvTap(e){
 if(CV.prev||CV.ro)return;
 const ins=e.target.closest('.cv-ins');if(ins){cvAddOpen(+ins.dataset.at);return}
 if(e.target.closest('.cv-grip'))return;
 const b=e.target.closest('.cvb');
 if(!b){if(CV.sel){CV.sel=null;cvRender()}return}
 const id=b.dataset.b;
 if(CV.sel===id||b.querySelector(':scope>.cv-ph,:scope>div>.cv-ph'))cvEdit(id);else{CV.sel=id;cvRender()}}
function cvKey(e){if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('cvb')){e.preventDefault();cvTap(e)}}
function cvScrollSel(){const e=CV.sel&&document.querySelector('#cvPage [data-b="'+CV.sel+'"]');if(e)e.scrollIntoView({block:'nearest',behavior:'smooth'})}

/* --- historique d'annulation --- */
function cvSer(){const im=CV.q.cv.imgs;CV.q.cv.imgs={};const t=JSON.stringify(CV.q);CV.q.cv.imgs=im;return t}
function cvDes(t){const im=CV.q.cv.imgs,o=JSON.parse(t);o.cv.imgs=im;return o}
function cvSnap(){CV.U.push(cvSer());if(CV.U.length>40)CV.U.shift();CV.Rd=[];CV.dirty=true}
function cvPre(){if(CV.pend){cvSnap();CV.pend=false}else CV.dirty=true}
function cvUndo(){if(!CV.U.length)return;CV.Rd.push(cvSer());CV.q=cvDes(CV.U.pop());CV.dirty=true;cvAfterHist()}
function cvRedo(){if(!CV.Rd.length)return;CV.U.push(cvSer());CV.q=cvDes(CV.Rd.pop());CV.dirty=true;cvAfterHist()}
function cvAfterHist(){if(CV.sel&&!CV.q.cv.blocks.some(b=>b.id===CV.sel))CV.sel=null;
 if(!$('cvSh').hidden)cvSheet('cvSh',false);cvRender()}

/* --- actions sur les blocs --- */
const cvIdx=id=>CV.q.cv.blocks.findIndex(b=>b.id===id);
function cvMove(d){const B=CV.q.cv.blocks,i=cvIdx(CV.sel),j=i+d;if(i<0||j<0||j>=B.length)return;cvSnap();[B[i],B[j]]=[B[j],B[i]];cvRender();cvScrollSel()}
function cvDup(){const B=CV.q.cv.blocks,i=cvIdx(CV.sel);if(i<0)return;const b=B[i];if(CV_MAND[b.t]||b.t==='title')return;
 cvSnap();const n=cvJ(b);n.id=uid();B.splice(i+1,0,n);CV.sel=n.id;cvRender();cvScrollSel()}
function cvDel(id){id=id||CV.sel;const B=CV.q.cv.blocks,i=cvIdx(id);if(i<0)return;
 if(CV_MAND[B[i].t]){toast(('Ce bloc est obligatoire sur un devis : tu peux le déplacer ou le modifier, pas le supprimer.'));return}
 cvSnap();B.splice(i,1);CV.sel=null;if(!$('cvSh').hidden)cvSheet('cvSh',false);cvRender();toast(('Bloc supprimé'))}
function cvAddOpen(at){CV.at=at==null?null:at;
 $('cvAddL').innerHTML=CV_ADD.map(([k,ic,t,d])=>`<button type="button" class="cv-ab" onclick="cvAdd('${k}')"><span class="hi"><svg class="i"><use href="#i-${ic}"/></svg></span><span><b>${t}</b>${d?`<small class="mut">${d}</small>`:''}</span></button>`).join('');
 cvSheet('cvAdd',true)}
function cvAdd(key){const B=CV.q.cv.blocks;
 if(key==='title'&&B.some(b=>b.t==='title')){toast(('Le titre du devis est déjà sur la page.'));return}
 cvSnap();const b=cvBlk(key);
 if(key==='title')B.forEach(x=>{if(x.t==='head')x.ti=0});
 let at=CV.at;if(at==null){const s=cvIdx(CV.sel);at=s>=0?s+1:(()=>{const l=B.findIndex(x=>x.t==='legal');return l>=0?l:B.length})()}
 B.splice(at,0,b);CV.sel=b.id;CV.at=null;cvSheet('cvAdd',false);cvRender();
 setTimeout(()=>{cvScrollSel();if(['text','image','qty'].includes(b.t)&&!b.body)cvEdit(b.id)},230)}

/* --- glisser-déposer (poignée du bloc sélectionné) --- */
function cvGripDown(e){const g=e.currentTarget,el=g.closest('.cvb');if(!el)return;e.preventDefault();e.stopPropagation();
 try{g.setPointerCapture(e.pointerId)}catch(_){}
 const st=$('cvStage');CV.drag={id:el.dataset.b,el,y0:e.clientY,y:e.clientY,s0:st.scrollTop,moved:false,to:null};el.classList.add('drag');
 const mv=ev=>{const D=CV.drag;if(!D)return;D.y=ev.clientY;if(Math.abs(D.y-D.y0)>4)D.moved=true;cvDragUpd()};
 const up=()=>{g.removeEventListener('pointermove',mv);g.removeEventListener('pointerup',up);g.removeEventListener('pointercancel',up);cvDragEnd()};
 g.addEventListener('pointermove',mv);g.addEventListener('pointerup',up);g.addEventListener('pointercancel',up);requestAnimationFrame(cvAuto)}
function cvDragUpd(){const D=CV.drag;if(!D)return;const st=$('cvStage');
 D.el.style.transform='translateY('+(D.y-D.y0+st.scrollTop-D.s0)+'px)';
 const O=[...document.querySelectorAll('#cvPage .cvd>.cvb')].filter(e=>e!==D.el);
 O.forEach(e=>e.classList.remove('dt','dte'));
 let to=O.findIndex(e=>{const r=e.getBoundingClientRect();return r.top+r.height/2>D.y});
 if(to<0){to=O.length;if(O.length)O[O.length-1].classList.add('dte')}else O[to].classList.add('dt');D.to=to}
function cvAuto(){const D=CV.drag;if(!D)return;const st=$('cvStage'),r=st.getBoundingClientRect();
 if(D.moved){if(D.y<r.top+70)st.scrollTop-=10;else if(D.y>r.bottom-70)st.scrollTop+=10;cvDragUpd()}
 requestAnimationFrame(cvAuto)}
function cvDragEnd(){const D=CV.drag;CV.drag=null;if(!D)return;
 if(D.moved&&D.to!=null){const B=CV.q.cv.blocks,i=cvIdx(D.id);if(i>=0){const O=B.filter(b=>b.id!==D.id);if(O.indexOf(B[i])<0&&!(D.to===i)){cvSnap();const b=B.splice(i,1)[0];B.splice(D.to,0,b)}}}
 cvRender()}

/* --- feuilles --- */
function cvSheet(id,on){const s=$(id),bg=$(id+'Bg');
 if(on){bg.hidden=false;s.hidden=false;requestAnimationFrame(()=>{s.classList.add('on');bg.classList.add('on')})}
 else{s.classList.remove('on');bg.classList.remove('on');setTimeout(()=>{if(!s.classList.contains('on')){s.hidden=true;bg.hidden=true}},230)}}
const cvL=(t,f)=>`<label${f?` for="${f}"`:''}>${t}</label>`;
const cvIn=(k,t,v,ph,x)=>`${cvL(t,'cvf_'+k)}<input id="cvf_${k}" data-k="${k}" value="${esc(v==null?'':v)}"${ph?` placeholder="${esc(ph)}"`:''} data-noi18n lang="fr"${x||''}>`;
const cvTa=(k,t,v,r)=>`${cvL(t,'cvf_'+k)}<textarea id="cvf_${k}" data-k="${k}" rows="${r||5}" data-noi18n lang="fr">${esc(v||'')}</textarea>`;
const cvSg=(k,t,O,v)=>`${cvL(t)}<div class="seg cv-seg" data-k="${k}" role="radiogroup" aria-label="${esc(t)}">${O.map(([a,b])=>`<button type="button" role="radio" data-v="${a}" class="${String(a)===String(v)?'on':''}" aria-checked="${String(a)===String(v)}">${b}</button>`).join('')}</div>`;
const cvCk=(k,t,on)=>`<label class="pl-ck cv-ck"><input type="checkbox" data-k="${k}"${on?' checked':''}> <span>${t}</span></label>`;
const cvShw=(f,t,b)=>`<label class="pl-ck cv-ck"><input type="checkbox" data-h="${f}"${(b.hide||[]).includes(f)?'':' checked'}> <span>${t}</span></label>`;
const AL=[['l','Gauche'],['c','Centre'],['r','Droite']];
function cvEdit(id){const b=CV.q.cv.blocks.find(x=>x.id===id);if(!b)return;CV.sel=id;CV.eb=b;CV.pend=true;
 $('cvShT').textContent=i18nT(CV_BN[b.t]);$('cvShB').innerHTML=cvForm(b);
 $('cvShDel').hidden=!!CV_MAND[b.t];$('cvShMand').hidden=!CV_MAND[b.t];
 cvSheet('cvSh',true);cvRender();if(b.t==='lines')cvLnRender();if(b.t==='image')cvImgList();if(b.t==='client')cvPrjOpts()}
function cvShClose(){cvSheet('cvSh',false);CV.eb=null;cvRender();setTimeout(cvScrollSel,240)}
function cvFormModel(b){const help=t=>`<p class="mut cv-help">${t}</p>`;switch(b.t){
 case'client':return help('Rempli automatiquement avec le client et l\'adresse du chantier de chaque devis.');
 case'lines':return help('Les prestations viennent de chaque devis (chat, dictée, plan).')+cvIn('h','Titre au-dessus du tableau',b.h,'Détail des prestations')+`<label>Colonnes du tableau</label>`+cvShw('qty','Quantité',b)+cvShw('unit','Unité',b)+cvShw('pu','Prix unitaire HT',b)+cvShw('tva','TVA',b);
 case'totals':return help('Les montants, la remise et l\'acompte sont calculés pour chaque devis.')+cvShw('ac','Afficher l\'acompte',b)+cvSg('al','Position',[['l','Gauche'],['r','Droite']],b.al||'r');
 case'qty':return cvIn('h','Titre',b.h,'Surfaces et quantités')+help('Rempli avec les mesures validées du plan, quand le devis vient d\'un plan. Sinon, ce bloc n\'apparaît pas sur le devis.');}
 return null}
function cvForm(b){if(CV.model){const M=cvFormModel(b);if(M!=null)return M}const o=CV.q,tok=`<p class="mut cv-help">Touche un bouton pour l'ajouter au texte : sur le devis, il sera remplacé par la vraie valeur.</p><div class="cv-toks">${[['client','Nom du client'],['ttc','Total TTC'],['acompte','Acompte'],['date','Date du devis'],['validite','Fin de validité']].map(([k,t])=>`<button type="button" class="cv-tok" data-tok="${k}"><span aria-hidden="true">+</span> <span>${t}</span></button>`).join('')}</div><p class="mut cv-help">Pour faire une liste, commence chaque ligne par un tiret (-).</p>`;
 switch(b.t){
 case'head':return cvSg('al','Alignement',[['l','Gauche'],['c','Centre']],b.al||'l')+cvCk('ti','Titre du devis à droite (numéro, date, validité)',b.ti)+(b.ti?cvIn('txt','Titre',b.txt,'DEVIS'):'')
  +`<label>Logo</label><div class="cv-logo-r">${db.prof&&CVD.okSrc(db.prof.logo)?`<img src="${db.prof.logo}" alt="" class="cv-lgi">`:''}<label class="btn sec sm cv-file"><svg class="i"><use href="#i-img"/></svg><span>${db.prof&&db.prof.logo?'Changer le logo':'Ajouter mon logo'}</span><input type="file" accept="image/*" onchange="cvLogoPick(this)"></label></div>`
  +(db.prof&&db.prof.logo?cvCk('logo','Afficher le logo',b.logo):'')
  +`<label>Coordonnées affichées</label>`+cvShw('adr','Adresse',b)+cvShw('siret','SIRET',b)+cvShw('tel','Téléphone',b)+cvShw('email','E-mail',b)
  +`<p class="mut cv-help">Ces informations viennent de « Mon entreprise ».</p><button type="button" class="btn sec" onclick="cvGoEnt()"><svg class="i"><use href="#i-building"/></svg>Modifier mes coordonnées</button>`;
 case'title':return cvIn('txt','Titre',b.txt,'DEVIS')+cvSg('al','Alignement',AL,b.al||'r');
 case'client':return `${cvL('Nom du client','cvf_q.client')}<input id="cvf_q.client" data-k="q.client" list="cvCliDl" autocapitalize="words" autocomplete="off" value="${esc(o.client)}" placeholder="M. Dupont" data-noi18n><datalist id="cvCliDl">${db.clients.map(c=>`<option value="${esc(c.nom)}">`).join('')}</datalist>`
  +cvIn('q.tel','Téléphone',o.tel,'',' type="tel" inputmode="tel"')+cvIn('q.adr','Adresse du chantier',o.adr)
  +`${cvL('Projet','cvPrj')}<select id="cvPrj" data-k="q.pid"></select><p class="mut cv-help">Un nouveau client est ajouté à tes clients à l'enregistrement.</p>`;
 case'lines':return cvIn('h','Titre au-dessus du tableau',b.h,'Détail des prestations')+`<div id="cvLn" class="cv-lns"></div>
  ${cvL('Ajouter depuis Mes services','cvLp')}<input id="cvLp" list="cvLpD" autocomplete="off" placeholder="Ex. Carrelage" onchange="cvLpAdd(this)" data-noi18n><datalist id="cvLpD">${db.prices.map(p=>`<option value="${esc(pDisp(p))}">`).join('')}</datalist>
  <button type="button" class="btn sec" onclick="cvLnAdd()"><svg class="i"><use href="#i-plus"/></svg>Ligne libre</button>
  <label>Colonnes du tableau</label>`+cvShw('qty','Quantité',b)+cvShw('unit','Unité',b)+cvShw('pu','Prix unitaire HT',b)+cvShw('tva','TVA',b);
 case'totals':return `<div class="row"><div>${cvIn('q.remise','Remise (%)',o.remise,'0',' type="number" inputmode="decimal" min="0" max="100"')}</div><div>${cvIn('q.acompte','Acompte (%)',o.acompte,'30',' type="number" inputmode="decimal" min="0" max="100"')}</div></div>`
  +cvCk('q.franchise','Sans TVA (franchise en base)',o.franchise)+cvShw('ac','Afficher l\'acompte',b)+cvSg('al','Position',[['l','Gauche'],['r','Droite']],b.al||'r');
 case'text':return cvIn('h','Titre',b.h)+cvTa('body','Texte',b.body,6)+tok+cvSg('st','Style',[['plain','Normal'],['box','Encadré'],['bar','Trait de couleur']],b.st||'plain')+cvSg('al','Alignement',AL,b.al||'l')+cvSg('fs','Taille',[['s','Petite'],['m','Normale'],['l','Grande']],b.fs||'m');
 case'image':return cvIn('h','Titre',b.h)+`<div id="cvImgs" class="cv-imgs"></div><label class="btn sec cv-file"><svg class="i"><use href="#i-cam"/></svg><span>Prendre ou choisir des photos</span><input type="file" accept="image/*" multiple onchange="cvImgAdd(this)"></label>`
  +cvSg('per','Photos par ligne',[[1,'1'],[2,'2'],[3,'3']],b.per||2)+cvIn('cap','Légende',b.cap);
 case'qty':{const c=findBy(db.clients,o.client),P=db.plans.slice().sort((x,y)=>((y.cid===(c&&c.id))-(x.cid===(c&&c.id)))||((y.date||0)-(x.date||0)));
  return cvIn('h','Titre',b.h,'Surfaces et quantités')+(P.length?`${cvL('Plan','cvQp')}<select id="cvQp" onchange="cvQtyChk()">${P.map(p=>{const cl=db.clients.find(x=>x.id===p.cid);return `<option value="${p.id}" data-noi18n>${esc((p.nom||p.name||i18nT('Plan'))+(cl?' – '+cl.nom:''))}</option>`}).join('')}</select>
   <p id="cvQn" class="mut cv-help" data-noi18n></p><button type="button" class="btn sec" id="cvQb" onclick="cvQtyGet()"><svg class="i"><use href="#i-area"/></svg>Reprendre les mesures</button>`
   :`<p class="mut cv-help">Aucun plan pour l'instant. Crée un plan à partir d'une photo depuis le bouton en haut à droite du chat.</p>`)}
 case'legal':return `<label>Mentions affichées</label>`+cvShw('valid','Durée de validité du devis',b)+cvShw('assur','Assurance décennale',b)+cvShw('ent','Forme juridique, RM / RCS, n° de TVA',b)
  +cvTa('x','Autres mentions',b.x,3)+`<p class="mut cv-help">La mention de TVA non applicable s'ajoute seule quand le devis est en franchise.</p>`;
 case'sign':return `<p class="mut cv-help">Le client signe en ligne quand tu envoies le devis pour signature. Ta signature est ajoutée au moment de l'envoi.</p>`;
 case'sep':return cvCk('ac','Trait de la couleur d\'accent',b.ac);
 case'space':return cvSg('sz','Hauteur',[['s','Petit'],['m','Moyen'],['l','Grand']],b.sz||'m');}
 return''}
function cvTgt(k){return k.startsWith('st.')?[CV.q.cv.st,k.slice(3)]:k.startsWith('q.')?[CV.q,k.slice(2)]:[CV.eb,k]}
function cvFin(e){const t=e.target;if(t.closest('.cv-lns')||t.id==='cvLp')return;
 if(t.dataset.h){const b=CV.eb;if(!b)return;cvPre();const H=b.hide||(b.hide=[]),i=H.indexOf(t.dataset.h);if(t.checked&&i>=0)H.splice(i,1);if(!t.checked&&i<0)H.push(t.dataset.h);cvRender();return}
 const k=t.dataset.k;if(!k)return;const [o,f]=cvTgt(k);if(!o)return;cvPre();
 let v=t.type==='checkbox'?(t.checked?1:0):t.value;
 if(f==='remise'||f==='acompte')v=Math.max(0,Math.min(100,parseFloat(String(v).replace(',','.'))||0));
 if(f==='franchise')v=!!v;
 o[f]=v;
 if(k==='q.client'){cvCliFill(t.value);cvPrjOpts()}
 if(k==='ti'){$('cvShB').innerHTML=cvForm(CV.eb)}
 const one=CV.eb&&!/^(st|q)\./.test(k)&&k!=='ti',bid=CV.eb&&CV.eb.id;clearTimeout(CV.tm);CV.tm=setTimeout(()=>one?cvRenderBlock(bid):cvRender(),t.tagName==='TEXTAREA'||t.type==='text'||t.tagName==='INPUT'&&!t.type.match(/checkbox|color/)?140:0)}
function cvRenderBlock(id){const pg=$('cvPage'),el=pg&&pg.querySelector('.cvd>.cvb[data-b="'+id+'"]'),b=CV.q.cv.blocks.find(x=>x.id===id);if(!el||!b||CV.prev||CV.ro){cvRender();return}
 const t=document.createElement('div');t.innerHTML=CVD.block(CV.q,b,{edit:true,prof:db.prof||{},imgs:cvLogo(),tr:i18nT,sample:CV.model});const n=t.firstElementChild;if(!n){cvRender();return}
 n.tabIndex=0;n.setAttribute('role','button');n.setAttribute('aria-label',i18nT(CV_BN[b.t]));const lab=el.querySelector(':scope>.cv-lab'),g=el.querySelector(':scope>.cv-grip');if(el.classList.contains('sel')){n.classList.add('sel');n.setAttribute('aria-pressed','true');if(lab)n.appendChild(lab);if(g)n.appendChild(g)}
 el.replaceWith(n);cvBar()}
function cvClk(e){const tk=e.target.closest('[data-tok]');if(tk){const ta=$('cvf_body');if(!ta)return;const v='{'+tk.dataset.tok+'}',a=ta.selectionStart==null?ta.value.length:ta.selectionStart,b=ta.selectionEnd==null?a:ta.selectionEnd;ta.value=ta.value.slice(0,a)+v+ta.value.slice(b);ta.focus();try{ta.setSelectionRange(a+v.length,a+v.length)}catch(_){}ta.dispatchEvent(new Event('input',{bubbles:true}));return}
 const s=e.target.closest('.cv-seg [data-v]');if(!s)return;const g=s.parentNode,[o,f]=cvTgt(g.dataset.k);if(!o)return;
 cvPre();const v=s.dataset.v;o[f]=/^\d$/.test(v)?+v:v;
 g.querySelectorAll('[data-v]').forEach(x=>{const on=x===s;x.classList.toggle('on',on);x.setAttribute('aria-checked',on)});
 if(g.dataset.k==='st.ac'){const c=$('cvStC');if(c)c.value=v}
 cvRender()}
function cvCliFill(n){const c=findBy(db.clients,n);if(!c)return;const o=CV.q;
 if(!o.tel&&c.tel){o.tel=c.tel;const f=$('cvf_q.tel');if(f)f.value=c.tel}
 if(!o.adr&&c.adr){o.adr=c.adr;const f=$('cvf_q.adr');if(f)f.value=c.adr}}
function cvPrjOpts(){const s=$('cvPrj');if(!s)return;const c=findBy(db.clients,CV.q.client),P=c?db.projects.filter(p=>p.cid===c.id):[];
 s.innerHTML=`<option value="">${esc(i18nT('Aucun'))}</option>`+P.map(p=>`<option value="${p.id}" data-noi18n>${esc(p.nom||'')}</option>`).join('');s.value=CV.q.pid||'';s.disabled=!P.length}
function cvGoEnt(){cvClose();drawerGo('cpt:ent')}

/* --- prestations --- */
function cvLnRender(){const el=$('cvLn');if(!el)return;const fr=I18N.lang==='fr',L=CV.q.lines;
 el.innerHTML=L.length?L.map((l,i)=>`<div class="cv-ln" data-i="${i}">
  ${fr?`<input data-l="label" value="${esc(l.label)}" placeholder="Désignation" aria-label="Désignation" data-noi18n lang="fr">`
   :`<input data-l="loc" value="${esc(l.loc==null?l.label:l.loc)}" placeholder="Désignation" aria-label="Désignation" data-noi18n><div class="lfr"><span>Ton client verra :</span><input data-l="fr" value="${esc(l.label)}" data-noi18n lang="fr"${l.frBad?' aria-invalid="true"':''}></div>`}
  <div class="cv-ln4"><label><span>Qté</span><input data-l="qty" type="number" inputmode="decimal" value="${l.qty}"></label><label><span>Unité</span><input data-l="unit" value="${esc(l.unit)}" data-noi18n></label>
  <label><span>Prix HT</span><input data-l="pu" type="number" inputmode="decimal" value="${l.pu}"></label><label><span>TVA %</span><input data-l="tva" type="number" inputmode="decimal" value="${l.tva}"></label></div>
  <div class="cv-lnf"><b class="cv-lnt" data-noi18n>${eur(l.qty*l.pu)} HT</b><span>
   <button type="button" class="cv-ib" data-a="up" aria-label="Monter"${i?'':' disabled'}><svg class="i cv-up"><use href="#i-chev"/></svg></button>
   <button type="button" class="cv-ib" data-a="dn" aria-label="Descendre"${i<L.length-1?'':' disabled'}><svg class="i cv-dn"><use href="#i-chev"/></svg></button>
   <button type="button" class="cv-ib ko" data-a="del" aria-label="Supprimer la ligne"><svg class="i"><use href="#i-x"/></svg></button></span></div></div>`).join('')
  :`<p class="mut cv-help">Aucune prestation pour l'instant.</p>`}
function cvLnIn(e){const t=e.target,k=t.dataset.l;if(!k)return;const r=t.closest('.cv-ln'),i=+r.dataset.i,l=CV.q.lines[i];if(!l)return;cvPre();
 if(k==='qty'||k==='pu'||k==='tva')l[k]=parseFloat(String(t.value).replace(',','.'))||0;
 else if(k==='label')l.label=t.value;else if(k==='unit')l.unit=t.value;
 else if(k==='fr'){l.label=t.value;l.frEd=1;l.frBad=0;t.removeAttribute('aria-invalid')}
 else if(k==='loc'){l.loc=t.value;if(!l.frEd){const x=frOf(t.value.trim());l.label=t.value.trim()?x.t:'';l.frBad=t.value.trim()&&!x.ok?1:0;const f=r.querySelector('[data-l="fr"]');if(f){f.value=l.label;if(l.frBad)f.setAttribute('aria-invalid','true');else f.removeAttribute('aria-invalid')}}}
 r.querySelector('.cv-lnt').textContent=eur(l.qty*l.pu)+' HT';clearTimeout(CV.tm);CV.tm=setTimeout(cvRender,160)}
function cvLnClk(e){const b=e.target.closest('[data-a]');if(!b)return;const i=+b.closest('.cv-ln').dataset.i,L=CV.q.lines;cvSnap();CV.pend=false;
 if(b.dataset.a==='del')L.splice(i,1);else{const j=i+(b.dataset.a==='up'?-1:1);if(j<0||j>=L.length)return;[L[i],L[j]]=[L[j],L[i]]}
 cvLnRender();cvRender()}
function cvLnAdd(){cvSnap();CV.pend=false;CV.q.lines.push({label:'',qty:1,unit:'u',pu:0,tva:CV.q.franchise?0:20});cvLnRender();cvRender();
 const r=document.querySelectorAll('#cvLn .cv-ln');const x=r[r.length-1];if(x){x.scrollIntoView({block:'nearest'});x.querySelector('input').focus()}}
function cvLpAdd(inp){const v=inp.value.trim();if(!v)return;const k=vnNorm(v),p=db.prices.find(x=>vnNorm(pDisp(x))===k||vnNorm(x.nom)===k);
 if(!p){toast(('Prix introuvable : ajoute une ligne libre.'));return}
 cvSnap();CV.pend=false;CV.q.lines.push({label:p.nom,qty:1,unit:p.unit,pu:p.prix,tva:CV.q.franchise?0:p.tva,loc:p.loc&&p.loc.l===I18N.lang?p.loc.t:undefined});
 inp.value='';cvLnRender();cvRender();toast(('Ligne ajoutée'))}

/* --- photos et logo --- */
function cvImgFile(f,max,cb){const r=new FileReader();r.onload=()=>{const im=new Image();
 im.onload=()=>{const s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*s));c.height=Math.max(1,Math.round(im.height*s));
  const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.72))};
 im.onerror=()=>toast(('Image illisible.'));im.src=r.result};r.readAsDataURL(f)}
function cvImgAdd(inp){const b=CV.eb;if(!b)return;const F=[...inp.files],n=Object.keys(CV.q.cv.imgs).length;inp.value='';
 if(n+F.length>6){toast(('6 photos au maximum par devis.'));F.splice(Math.max(0,6-n))}
 F.forEach(f=>cvImgFile(f,1000,u=>{cvPre();const id='p'+uid();CV.q.cv.imgs[id]=u;(b.imgs||(b.imgs=[])).push(id);cvImgList();cvRender()}))}
function cvImgList(){const el=$('cvImgs'),b=CV.eb;if(!el||!b)return;const I=(b.imgs||[]).filter(id=>CV.q.cv.imgs[id]);
 el.innerHTML=I.filter(id=>CVD.okSrc(CV.q.cv.imgs[id])&&okId(id)).map((id,i)=>`<div class="cv-im"><img src="${CV.q.cv.imgs[id]}" alt="${esc(i18nT('Photo'))} ${i+1}"><button type="button" class="cv-imx" aria-label="Retirer la photo" onclick="cvImgDel('${id}')"><svg class="i i-sm"><use href="#i-x"/></svg></button></div>`).join('')}
function cvImgDel(id){const b=CV.eb;if(!b)return;cvSnap();CV.pend=false;b.imgs=(b.imgs||[]).filter(x=>x!==id);cvImgList();cvRender()}
function cvLogoPick(inp){const f=inp.files[0];inp.value='';if(!f)return;cvImgFile(f,480,u=>{db.prof=Object.assign({},db.prof||{},{logo:u});db.profAt=Date.now();save();
 if(CV.eb){cvPre();CV.eb.logo=1;$('cvShB').innerHTML=cvForm(CV.eb)}cvRender();toast(('Logo enregistré dans Mon entreprise'))})}

/* --- mesures d'un plan --- */
function cvQtyChk(){const s=$('cvQp');if(!s)return;const p=db.plans.find(x=>x.id===s.value),n=p?plTodoOf(p):0;
 $('cvQb').disabled=!p||!!n;$('cvQn').textContent=n?i18nT('Valide d\'abord les {1} cote(s) à vérifier : aucune dimension n\'entre au devis sans ta validation.').replace('{1}',n):'';$('cvQn').classList.toggle('pl-warnt',!!n)}
function cvQtyGet(){const s=$('cvQp'),p=s&&db.plans.find(x=>x.id===s.value),b=CV.eb;if(!p||!b||plTodoOf(p))return;cvPre();
 b.rows=plQty(p).filter(r=>r.v>0).map(r=>({lab:r.lab,v:Math.round(r.v*100)/100,u:r.u,ok:!!r.ok}));b.from=p.nom||p.name||'';b.at=ymdL();
 cvRender();toast(('Mesures reprises du plan'))}

/* --- style et modèles --- */
function cvStOpen(){const st=CV.q.cv.st;CV.eb=null;CV.pend=true;
 $('cvStB').innerHTML=`<label>Couleur d'accent</label><div class="cv-seg cv-sw" data-k="st.ac" role="radiogroup" aria-label="Couleur d'accent">${CV_SW.map(c=>`<button type="button" role="radio" data-v="${c}" class="${c===st.ac?'on':''}" aria-checked="${c===st.ac}" style="--sw:${c}" aria-label="${c}"></button>`).join('')}<input type="color" id="cvStC" data-k="st.ac" value="${CVD.col(st.ac)}" aria-label="Autre couleur"></div>`
  +cvSg('st.ff','Police',[['sans','Moderne'],['serif','Classique'],['mono','Technique']],st.ff||'sans')
  +cvSg('st.fs','Taille du texte',[['s','Petite'],['m','Normale'],['l','Grande']],st.fs||'m')
  +cvSg('st.hd','En-tête',[['plain','Simple'],['band','Bandeau de couleur']],st.hd||'plain')
  +cvSg('st.th','Tableau',[['lines','Lignes'],['zebra','Rayé'],['min','Minimal']],st.th||'lines')
  +cvSg('st.gp','Espacement',[['c','Serré'],['n','Normal'],['a','Aéré']],st.gp||'n')
  +`<h3 class="cv-sh3">Modèles</h3><button type="button" class="btn sec" onclick="cvTpOpen('apply')"><svg class="i"><use href="#i-doc"/></svg>Repartir d'un autre modèle de départ</button>
`;
 cvSheet('cvSt',true)}
function cvMyT(){const el=$('cvMyT');if(!el)return;const T=db.cvTpl||[];
 el.innerHTML=T.length?`<label>Mes modèles</label>`+T.map(t=>`<div class="cv-myt"><span data-noi18n>${esc(t.n)}</span><button type="button" class="cv-ib ko" aria-label="Supprimer le modèle" onclick="cvTpDel('${t.id}')"><svg class="i"><use href="#i-x"/></svg></button></div>`).join(''):''}
function cvTpDel(id){if(!confirm(i18nT('Supprimer ce modèle ?')))return;db.cvTpl=(db.cvTpl||[]).filter(t=>t.id!==id);save();cvMyT()}
function cvSample(cv){return{id:'x',num:'D2026-014',date:ymdL(),client:'Mme Martin',tel:'06 12 34 56 78',adr:'12 rue des Lices, Marseille',
 lines:[{label:'Dépose de l\'ancien carrelage',qty:12,unit:'m²',pu:18,tva:10},{label:'Pose carrelage 60 x 60',qty:12,unit:'m²',pu:45,tva:10},{label:'Plinthes assorties',qty:14,unit:'ml',pu:9,tva:10}],remise:0,acompte:30,franchise:false,cv}}
function cvTpOpen(mode){CV.tpMode=mode;
 const all=Object.keys(CV_TPL).map(k=>[k,CV_TPL[k].n,CV_TPL[k].d,true]);
 $('cvTpL').innerHTML=all.map(([k,n,d,bi])=>{const cv=cvMk(k);cv.blocks.forEach(b=>{if(b.t==='image')b.imgs=[];if(b.t==='qty')b.rows=[{lab:'Sol',v:12.4,u:'m²',ok:1},{lab:'Périmètre',v:14.2,u:'ml',ok:1}]});
  return `<button type="button" class="cv-tc" onclick="cvTpPick('${k}')"><span class="cv-tpv" aria-hidden="true" data-noi18n lang="fr" dir="ltr"><span class="cv-tps">${CVD.html(cvSample(cv),{prof:Object.assign({nom:'Mon entreprise',adr:'Marseille',valid:30},db.prof||{}),imgs:cvLogo()})}</span></span>
  <span class="cv-tcn"><b${bi?'':' data-noi18n'}>${esc(n)}</b>${d?`<small class="mut">${d}</small>`:`<small class="mut">Mon modèle</small>`}</span></button>`}).join('');
 const cur=$('cvTpCur'),use=false;
 cur.hidden=!use;if(use){cur.querySelector('input').checked=true;cur.querySelector('[data-cur]').textContent=(q.client||i18nT('sans nom'))+' · '+q.lines.length+' '+i18nT('ligne(s)')}
 $('cvTpNote').hidden=mode!=='apply';cvSheet('cvTp',true);
 requestAnimationFrame(()=>document.querySelectorAll('#cvTpL .cv-tpv').forEach(v=>v.style.setProperty('--k',(v.clientWidth/520).toFixed(3))))}
function cvTpPick(k){if(CV.tpMode==='new'){cvNew(k);return}
 const c=CV.q.cv,old=c.blocks,n=cvMk(k);cvSnap();
 n.blocks.forEach(b=>{if(b.t==='text'){const o=old.find(x=>x.t==='text'&&x.h===b.h&&x.body);if(o)b.body=o.body}
  if(b.t==='image'){const o=old.find(x=>x.t==='image'&&x.imgs&&x.imgs.length);if(o){b.imgs=o.imgs.slice();b.cap=o.cap}}
  if(b.t==='qty'){const o=old.find(x=>x.t==='qty'&&x.rows);if(o){b.rows=o.rows;b.from=o.from;b.at=o.at}}});
 c.blocks=n.blocks;c.st=n.st;c.tpl=k;CV.sel=null;cvSheet('cvTp',false);cvSheet('cvSt',false);cvRender();toast(('Modèle appliqué'))}

/* --- enregistrer, envoyer, PDF --- */
function cvStore(){const o=CV.q;
 if(!qGuard(o)){CV.ro=cvRo(CV.q);CV.prev=CV.ro;CV.dirty=false;cvRender();return}
 if(o.client&&o.client.trim()){const c=findBy(db.clients,o.client);if(!c)db.clients.push({id:uid(),nom:o.client.trim(),tel:o.tel||'',adr:o.adr||'',createdAt:Date.now()})}
 if(!o.num)o.num=qNextNum(String(o.date||ymdL()).slice(0,4));
 const i=db.quotes.findIndex(x=>x.id===o.id);
 o.cv.at=Date.now();const c=cvJ(o);{const u=new Set();c.cv.blocks.forEach(b=>(b.imgs||[]).forEach(x=>u.add(x)));Object.keys(c.cv.imgs||{}).forEach(k=>{if(!u.has(k))delete c.cv.imgs[k]})}if(i>=0)db.quotes[i]=c;else db.quotes.push(c);
 if(typeof q!=='undefined'&&q&&q.id===o.id)q=cvJ(o);
 save();CV.dirty=false;cvBar()}
function cvSave(){if(CV.ro)return false;
 {const pv=db.quotes.find(x=>x.id===CV.q.id);if(pv&&cvRo(pv)){CV.q=JSON.parse(JSON.stringify(pv));CV.ro=true;CV.prev=true;cvRender();toast(i18nT('Ce devis est signé par le client : il ne peut plus être modifié. Duplique-le pour en faire un nouveau.'));return false}}
 if(!CV.q.client||!CV.q.client.trim()){toast(('Indique le nom du client.'));const b=CV.q.cv.blocks.find(x=>x.t==='client');if(b)cvEdit(b.id);return false}
 cvStore();toast(('Devis enregistré'));return true}
function cvSend(){if(!CV.q.lines.length){toast(('Ajoute au moins une ligne.'));CV.prev=false;const b=CV.q.cv.blocks.find(x=>x.t==='lines');cvRender();if(b)cvEdit(b.id);return}
 if(!cvSave())return;q=cvJ(CV.q);fillForm();CV.dirty=false;cvClose();goSign()}
function cvPdf(){const o=CV.q;if(!['accepte','paye'].includes(o.status)){toast(('Le PDF est disponible une fois le devis signé par le client.'));return}
 buildPrint(o);setTimeout(()=>window.print(),200)}

/* ---------- Devis ---------- */
function renderQuick(){
 $('quick').innerHTML=db.prices.map(p=>`<span class="chip" onclick="addFromPrice('${p.id}')"><svg class="i i-sm"><use href="#i-plus"/></svg>${esc(pDisp(p))}</span>`).join('')||'<span class="mut">Ajoute des services dans « Mes services ».</span>';
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function addFromPrice(id){
 const p=db.prices.find(x=>x.id===id);if(!p)return;
 q.lines.push({label:p.nom,qty:1,unit:p.unit,pu:p.prix,tva:p.tva,loc:p.loc&&p.loc.l===I18N.lang?p.loc.t:undefined});
 renderLines();
}
function addFree(){q.lines.push({label:'',qty:1,unit:'u',pu:0,tva:20});renderLines()}
function renderLines(){
 $('lines').innerHTML=q.lines.map((l,i)=>`
 <div class="line">
  ${I18N.lang==='fr'?`<input value="${esc(l.label)}" placeholder="Désignation" oninput="upd(${i},'label',this.value,false)">`
  :`<input value="${esc(l.loc??l.label)}" placeholder="Désignation" oninput="lineLoc(${i},this.value)">
  <div class="lfr"><span>Ton client verra :</span><input id="lf${i}" data-noi18n lang="fr" value="${esc(l.label)}"${l.frBad?' aria-invalid="true"':''} oninput="q.lines[${i}].frEd=1;q.lines[${i}].frBad=0;this.removeAttribute('aria-invalid');upd(${i},'label',this.value,false)" onchange="q.lines[${i}].loc&&ulexLearn(I18N.lang,q.lines[${i}].loc,this.value)"></div>`}
  <div class="row" style="margin-top:6px">
   <div><label>Quantité</label><input type="number" inputmode="decimal" value="${l.qty}" oninput="upd(${i},'qty',this.value)"></div>
   <div><label>Unité</label><input value="${esc(l.unit)}" oninput="upd(${i},'unit',this.value,false)"></div>
   <div><label>Prix HT</label><input type="number" inputmode="decimal" value="${l.pu}" oninput="upd(${i},'pu',this.value)"></div>
   <div><label>TVA %</label><input type="number" inputmode="decimal" value="${l.tva}" oninput="upd(${i},'tva',this.value)"></div>
  </div>
  <div class="t" style="margin-top:6px"><span class="mut" id="lt${i}">${eur(l.qty*l.pu)} HT</span>
   <button class="btn sm ko" onclick="delLine(${i})">Supprimer</button></div>
 </div>`).join('');
 calc();
}
let qAutoT=0;function qAuto(){clearTimeout(qAutoT);qAutoT=setTimeout(qFlush,700)}
function qFlush(){clearTimeout(qAutoT);qAutoT=0;try{if(q&&(q.lines.length||db.quotes.some(x=>x.id===q.id)))store()}catch(e){}}
addEventListener('pagehide',()=>{if(qAutoT)qFlush()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&qAutoT)qFlush()});
function upd(i,k,v,num=true){q.lines[i][k]=num?(parseFloat(String(v).replace(',','.'))||0):v;qAuto();
 const e=$('lt'+i);if(e)e.textContent=eur(q.lines[i].qty*q.lines[i].pu)+' HT';calc()}
function lineLoc(i,v){
 const l=q.lines[i];l.loc=v;if(l.frEd)return;
 const r=frOf(v.trim());l.label=v.trim()?r.t:'';l.frBad=v.trim()&&!r.ok?1:0;
 const f=$('lf'+i);if(f){f.value=l.label;if(l.frBad)f.setAttribute('aria-invalid','true');else f.removeAttribute('aria-invalid')}
}
function delLine(i){q.lines.splice(i,1);renderLines();qAuto()}

function totals(o){
 const r=(o.remise||0)/100;
 let ht=0,brut=0;const tv={};
 (o.lines||[]).forEach(l=>{brut+=r2(l.qty*l.pu);const m=r2(l.qty*l.pu*(1-r));ht+=m;const t=o.franchise?0:l.tva;tv[t]=(tv[t]||0)+m*t/100});
 Object.keys(tv).forEach(k=>tv[k]=r2(tv[k]));ht=r2(ht);brut=r2(brut);
 const tva=r2(Object.values(tv).reduce((a,b)=>a+b,0)),ttc=r2(ht+tva);
 return{ht,tv,tva,ttc,brut,rem:r2(brut-ht),acompte:r2(ttc*(o.acompte||0)/100)};
}
function readForm(){
 q.client=$('cNom').value;q.tel=$('cTel').value;q.adr=$('cAdr').value;
 q.remise=parseFloat($('remise').value)||0;q.acompte=parseFloat($('acompte').value)||0;
 q.franchise=$('franchise').checked;
}
function calc(){
 readForm();const t=totals(q);if(calc.on)qAuto();calc.on=1;
 let h=`<div class="tot"><span>Total HT</span><b>${eur(t.ht)}</b></div>`;
 if(!q.franchise)Object.keys(t.tv).forEach(k=>h+=`<div class="tot mut"><span>TVA ${k} %</span><span>${eur(t.tv[k])}</span></div>`);
 h+=`<div class="tot g"><span>Total TTC</span><span>${eur(t.ttc)}</span></div>
 <div class="tot mut"><span>Acompte ${q.acompte} %</span><span>${eur(t.acompte)}</span></div>`;
 $('totaux').innerHTML=h;
}
function fillForm(){
 $('cNom').value=q.client;$('cTel').value=q.tel;$('cAdr').value=q.adr;
 $('remise').value=q.remise;$('acompte').value=q.acompte;$('franchise').checked=q.franchise;
 renderLines();qNotesR();
}
/* notes du devis (à faire, remarques) : pour l'artisan seulement, elles ne partent pas au client */
function qNotesR(){const c=$('qNotesC');if(!c)return;const N=q.notes||[];c.hidden=!N.length;
 $('qNotes').innerHTML=['todo','rem'].map(k=>{const L=N.map((n,i)=>[n,i]).filter(([n])=>n.k===k);return L.length?`<label>${k==='todo'?'À faire':'Remarques'}</label>`+L.map(([n,i])=>`<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px"><span data-noi18n dir="auto">${esc(n.t)}</span><button type="button" class="cv-ib ko" aria-label="Supprimer" onclick="qNoteDel(${i})"><svg class="i"><use href="#i-x"/></svg></button></div>`).join(''):''}).join('')}
function qNoteDel(i){(q.notes||[]).splice(i,1);store();qNotesR()}
function newQuote(){q=newObj();fillForm()}
/* contenu qui engage le client : ce qu'il signe */
function qBody(o){return JSON.stringify([o.client||'',o.adr||'',+o.remise||0,+o.acompte||0,!!o.franchise,(o.lines||[]).map(l=>[l.label,+l.qty,l.unit,+l.pu,+l.tva]),o.cv?[o.cv.st,(o.cv.blocks||[]).map(b=>Object.assign({},b,{rows:undefined}))]:0])}
/* garde : un devis signé ne change plus ; un devis envoyé puis modifié repart en brouillon (l'ancien lien est annulé) */
function qGuard(o){
 const pv=db.quotes.find(x=>x.id===o.id);if(!pv||!pv.sign)return true;
 if(pv.sign.st==='signed'){
  if(qBody(pv)!==qBody(o)){toast(i18nT('Ce devis est signé par le client : il ne peut plus être modifié. Duplique-le pour en faire un nouveau.'));Object.assign(o,JSON.parse(JSON.stringify(pv)));return false}
  o.status=pv.status==='paye'?'paye':'accepte';o.sign=pv.sign;return true}
 if(pv.sign.st==='sent'&&qBody(pv)!==qBody(o)){
  const tk=pv.sign.token;delete o.sign;o.status='brouillon';
  if(tk&&typeof apiTeam==='function')apiTeam('/api/sign/cancel',{token:tk}).catch(()=>{});
  toast(i18nT('Devis modifié après l\'envoi : l\'ancien lien est annulé. Renvoie-le au client pour signature.'))}
 return true}
/* numéro de devis : jamais derrière un numéro déjà connu (devis reçus de l'équipe compris) */
function qNextNum(y){let mx=db.counter||0;db.quotes.forEach(x=>{const m=/^D(\d{4})-(\d+)$/.exec(x.num||'');if(m&&m[1]==y)mx=Math.max(mx,+m[2])});db.counter=mx+1;return 'D'+y+'-'+String(db.counter).padStart(3,'0')}
function storeQ(o){
 if(!qGuard(o))return false;
 if(!o.num)o.num=qNextNum(String(o.date||ymdL()).slice(0,4));
 const i=db.quotes.findIndex(x=>x.id===o.id);
 if(i>=0)db.quotes[i]=JSON.parse(JSON.stringify(o));else db.quotes.push(JSON.parse(JSON.stringify(o)));
 save();return true}
function store(){
 readForm();
 const okS=storeQ(q);if(!okS&&$('s-devis')&&$('s-devis').classList.contains('on'))fillForm();
 return okS;
}
function finish(){if(!['accepte','paye'].includes(q.status))return goSign();
 if(!q.lines.length){alert('Ajoute au moins une ligne.');return}
 if(!q.client){alert('Indique le nom du client.');return}
 store();buildPrint(q);
 setTimeout(()=>window.print(),200);
}
function buildPrint(o){
 if(o.cv&&o.cv.blocks){$('print').innerHTML=CVD.html(o,{prof:db.prof||{},imgs:cvLogo()});return}
 const t=totals(o),p=db.prof,v=parseInt(p.valid)||30;
 const d=new Date(o.date);const lim=dFR(d.getTime()+v*864e5);
 $('print').innerHTML=`
 <div style="display:flex;justify-content:space-between">
  <div><b style="font-size:20px">${esc(p.nom||'Mon entreprise')}</b><br>${esc(p.adr||'')}<br>SIRET : ${esc(p.siret||'')}<br>Tél : ${esc(p.tel||'')}</div>
  <div style="text-align:right"><b style="font-size:22px">DEVIS ${esc(o.num)}</b><br>Date : ${d.toLocaleDateString('fr-FR')}<br>Valable jusqu'au ${lim}</div>
 </div>
 <p><b>Client :</b> ${esc(o.client)}<br>${esc(o.tel)}<br><b>Chantier :</b> ${esc(o.adr)}</p>
 <table><tr><th>Désignation</th><th class="r">Qté</th><th>Unité</th><th class="r">PU HT</th><th class="r">TVA</th><th class="r">Total HT</th></tr>
 ${o.lines.map(l=>`<tr><td>${esc(l.label)}</td><td class="r">${l.qty}</td><td>${esc(l.unit)}</td><td class="r">${eur(l.pu)}</td><td class="r">${o.franchise?'-':l.tva+' %'}</td><td class="r">${eur(l.qty*l.pu)}</td></tr>`).join('')}
 </table>
 <div style="margin-left:auto;width:260px">
  ${o.remise?`<div style="display:flex;justify-content:space-between"><span>Total HT avant remise</span><span>${eur(t.brut)}</span></div><div style="display:flex;justify-content:space-between"><span>Remise ${+o.remise} %</span><span>− ${eur(t.rem)}</span></div>`:''}
  <div style="display:flex;justify-content:space-between"><span>Total HT</span><b>${eur(t.ht)}</b></div>
  ${o.franchise?'<div>TVA non applicable, art. 293 B du CGI</div>':Object.keys(t.tv).map(k=>`<div style="display:flex;justify-content:space-between"><span>TVA ${k} %</span><span>${eur(t.tv[k])}</span></div>`).join('')}
  <div style="display:flex;justify-content:space-between;font-size:18px"><b>Total TTC</b><b>${eur(t.ttc)}</b></div>
  <div style="display:flex;justify-content:space-between"><span>Acompte ${o.acompte} %</span><span>${eur(t.acompte)}</span></div>
 </div>
 <p style="margin-top:20px">${esc(p.assur?'Assurance décennale : '+p.assur:'')}</p>
 <div style="display:flex;justify-content:space-between;margin-top:40px">
  <div>Bon pour accord, date et signature du client :<br>${o.sign&&o.sign.st==='signed'?`Signé électroniquement par ${esc(o.sign.clientName||'')} le ${new Date(o.sign.signedAt).toLocaleString('fr-FR')}`:'<br><br>'}</div>
  <div>Signature de l'entreprise :<br>${o.proSig?`<img src="${o.proSig}" alt="" style="height:70px">`:'<br><br>'}</div>
 </div>`;
}

/* ---------- Mes services ---------- */
function pNomSync(){
 const fr=I18N.lang==='fr',b=$('pNomFrBox'),f=$('pNomFr');if(!b)return;b.hidden=fr;if(fr)return;
 if(f.dataset.edited)return;const v=$('pNom').value.trim();const r=frOf(v);f.value=v?r.t:'';
 if(v&&!r.ok)f.setAttribute('aria-invalid','true');else f.removeAttribute('aria-invalid');
}
function addPrice(){
 const typed=$('pNom').value.trim(),frn=I18N.lang!=='fr'?($('pNomFr').value.trim()||typed):typed;
 const nom=frn,prix=parseFloat($('pPrix').value.replace(',','.'));
 if(!nom||isNaN(prix)){alert('Désignation et prix obligatoires.');return}
 const np={id:uid(),nom,unit:$('pUnit').value,prix,tva:parseFloat($('pTva').value),four:$('pFour').value.trim()};
 if(I18N.lang!=='fr'&&typed&&vnNorm(typed)!==vnNorm(nom)){np.loc={l:I18N.lang,t:typed};ulexLearn(I18N.lang,typed,nom)}
 db.prices.push(np);
 logPrice(nom,$('pFour').value.trim(),prix,$('pUnit').value);
 save();$('pNom').value='';$('pPrix').value='';$('pFour').value='';$('pNomFr').value='';delete $('pNomFr').dataset.edited;pNomSync();renderPrices();renderQuick();
}
function logPrice(nom,four,prix,unit){if(four)db.hist.push({date:ymdL(),nom,four,prix,unit})}
function renderPrices(){
 const k=vnNorm(($('prQ')&&$('prQ').value)||'');
 $('priceList').innerHTML=db.prices.filter(p=>!k||vnNorm(p.nom+' '+pDisp(p)+' '+(p.four||'')).includes(k)).map(p=>`
 <div class="line pr-l" data-sw="pr:${p.id}"><button class="pr-e" onclick="editPrice('${p.id}')" aria-label="Modifier le prix"><span class="t"><span>${esc(pDisp(p))}</span><span>${eur(p.prix)} / ${esc(p.unit)}</span></span>
 <span class="mut">TVA ${p.tva} %${p.four?' · '+esc(p.four):''}</span></button></div>`).join('')||'<div class="mut">Aucun prix.</div>';
}
function editPrice(id){
 const p=db.prices.find(x=>x.id===id);const v=prompt('Nouveau prix HT pour '+p.nom,p.prix);
 if(v===null)return;const n=parseFloat(v.replace(',','.'));if(isNaN(n))return;
 p.prix=n;logPrice(p.nom,p.four,n,p.unit);save();renderPrices()}
function delPrice(id){if(!confirm('Supprimer ce prix ?'))return;db.prices=db.prices.filter(x=>x.id!==id);save();renderPrices();renderQuick()}
function dl(name,content,type){
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click()}
function exportCsv(){dl('mes-prix.csv',db.prices.map(p=>[p.nom,p.unit,p.prix,p.tva,p.four].join(';')).join('\n'),'text/csv')}
function importCsv(inp){
 const f=inp.files[0];if(!f)return;const r=new FileReader();
 r.onload=()=>{let n=0;r.result.split(/\r?\n/).forEach(row=>{
  const c=row.split(/[;\t]/);if(c.length<3)return;const prix=parseFloat(String(c[2]).replace(',','.'));if(isNaN(prix))return;
  db.prices.push({id:uid(),nom:c[0].trim(),unit:(c[1]||'u').trim(),prix,tva:parseFloat(c[3])||20,four:(c[4]||'').trim()});
  logPrice(c[0].trim(),(c[4]||'').trim(),prix,(c[1]||'u').trim());n++});
  save();renderPrices();renderQuick();alert(n+' prix importés. Vérifie-les avant usage.')};
 r.readAsText(f);inp.value='';
}
/* mot de passe demandé dans une petite fenêtre (champ masqué) */
function askPw(title){return new Promise(res=>{const w=document.createElement('div');w.className='pwask';
 w.innerHTML='<form class="card" novalidate><label>'+esc(title)+'</label><div class="pw"><input type="password" autocomplete="current-password" enterkeyhint="done"></div><div class="r"><button type="button" class="btn sec">'+esc(i18nT('Annuler'))+'</button><button class="btn" type="submit">OK</button></div></form>';
 const fin=v=>{w.remove();res(v)},i=w.querySelector('input');
 w.querySelector('form').onsubmit=e=>{e.preventDefault();fin(i.value)};w.querySelector('button[type=button]').onclick=()=>fin(null);
 document.body.appendChild(w);setTimeout(()=>i.focus(),50)})}
/* « Télécharger mes données » : fichier chiffré avec le mot de passe quand le coffre est actif */
async function exportAll(){const j=JSON.stringify(db);
 if(sansMdp()){if(!(await bioConf()))return;const pw=await askPw(i18nT('Mot de passe du fichier'));if(pw==null)return;
  if(pw.length<8){toast(i18nT('8 caractères minimum.'));return}
  dl('devis-btp-sauvegarde.json',await VAULT.seal(j,pw),'application/json');return}
 if(window.VAULT&&VAULT.on){const pw=await askPw(i18nT('Mot de passe'));if(pw==null)return;
  if(!(await VAULT.checkPw(pw))){toast(i18nT('Mot de passe incorrect.'));return}
  dl('devis-btp-sauvegarde.json',await VAULT.seal(j,pw),'application/json');return}
 dl('devis-btp-sauvegarde.json',j,'application/json')}
function importAll(inp){
 const f=inp.files[0];if(!f)return;const r=new FileReader();
 r.onload=async()=>{try{let d=JSON.parse(r.result);
  if(d&&d.caso==='sauvegarde-chiffree'){const pw=await askPw(i18nT('Mot de passe'));if(pw==null)return;
   try{d=JSON.parse(await VAULT.unseal(d,pw))}catch(e){alert(i18nT('Mot de passe incorrect.'));return}}
  if(!d.prices||!d.quotes)throw 0;
  if(!confirm('Remplacer toutes les données actuelles ?'))return;
  const now=Date.now();['prices','quotes','hist','chantiers','people','pts','clients','suppliers','projects','plans','events','invoices','cvTpl'].forEach(k=>{if(!Array.isArray(d[k]))d[k]=[];d[k]=d[k].filter(x=>x&&typeof x==='object'&&(x.id==null||okId(x.id)));d[k].forEach(x=>{if(x.id)x.updatedAt=now})});
  ['prices','quotes','pts','plans','events','invoices'].forEach(k=>{d[k]=d[k].map(x=>recClean(k,x)).filter(Boolean)});
  if(!d.sup||typeof d.sup!=='object')d.sup={};d.prof=profClean(d.prof);if(!(d.counter>=0))d.counter=0;
  db=d;ensurePt();initSnap();{const c=getSync();if(c.token)setSync(Object.assign(c,{rev:0,lastPush:0}))}save();try{init()}catch(e){location.reload()}}catch(e){alert('Fichier invalide.')}};
 r.readAsText(f);inp.value='';
}
let profT=0;function saveProfSoon(){clearTimeout(profT);profT=setTimeout(saveProf,500)}
addEventListener('pagehide',()=>{if(profT){clearTimeout(profT);saveProf()}});
/* IBAN : affiché masqué ; le voir ou le changer demande le mot de passe (un IBAN modifié détourne les virements) */
const ibanMask=v=>{v=String(v||'').replace(/\s+/g,'');return v.length>8?v.slice(0,4)+' •••• •••• '+v.slice(-4):v};
function ibanShow(){const e=$('eIban');if(!e)return;e.dataset.open='';e.value=ibanMask((db.prof||{}).iban)}
async function ibanOpen(e){if(e.dataset.open==='1'||e.dataset.ask)return;
 if(profVerrou()){e.blur();toast(i18nT('Réservé au patron.'));return}
 if(sansMdp()){e.dataset.ask='1';e.blur();const ok=await bioConf();delete e.dataset.ask;if(!ok)return}
 else if(window.VAULT&&VAULT.on){e.dataset.ask='1';e.blur();const pw=await askPw(i18nT('Mot de passe'));delete e.dataset.ask;
  if(pw==null)return;if(!(await VAULT.checkPw(pw))){toast(i18nT('Mot de passe incorrect.'));return}}
 e.dataset.open='1';e.value=(db.prof||{}).iban||'';e.focus()}
async function ibanSet(v){if(profVerrou()){toast(i18nT('Réservé au patron.'));return}

 if(sansMdp()){if(!(await bioConf()))return}
 else{const pw=await askPw(i18nT('Mot de passe'));if(pw==null)return;
  if(!(await VAULT.checkPw(pw))){toast(i18nT('Mot de passe incorrect.'));return}}
 db.prof=Object.assign({},db.prof||{},{iban:v});db.profAt=Date.now();save();ibanShow();toast(i18nT('Enregistré.'))}
function saveProf(){clearTimeout(profT);profT=0;setTimeout(()=>{try{window.CasoAuth&&CasoAuth.profil()}catch(e){}},0);const P0=db.prof||{};db.prof=Object.assign({},P0,{nom:$('eNom').value,adr:$('eAdr').value,siret:$('eSiret').value,siren:$('eSiren').value.replace(/\D/g,'')||$('eSiret').value.replace(/\D/g,'').slice(0,9),tel:$('eTel').value,assur:$('eAssur').value,valid:$('eValid').value,forme:$('eForme').value,metier:$('eMetier').value,rm:$('eRm').value,tvai:$('eTvai').value,email:$('eMail').value,zone:$('eZone').value,iban:$('eIban').dataset.open==='1'?$('eIban').value:((db.prof||{}).iban||''),bic:$('eBic').value,delai:$('eDelai').value,capital:$('eCapital').value,franchise:$('eFranch').checked,debits:$('eDebit').checked,cat:$('eCat').value||'PS',rcpro:$('eRcpro').value,mediateur:$('eMed').value,tauxH:$('eTauxH').value,depl:$('eDepl').value,acompteType:$('eAccT').value,acomptePct:$('eAccP').value},profVerrou()?{iban:P0.iban||'',bic:P0.bic||'',siret:P0.siret||'',siren:P0.siren||''}:{});if(typeof entExtra==='function')entExtra();db.profAt=Date.now();save()}

/* ---------- Historique ---------- */
const ST={brouillon:'Brouillon',envoye:'En cours de signature',accepte:'Validé',paye:'Payé',refuse:'Refusé',expire:'Expiré'};
let histMode='hist';
function markPaid(id){const x=db.quotes.find(y=>y.id===id);if(!x)return;x.status='paye';x.paidAt=Date.now();save();renderHisto();toast(i18nT('Payé'))}
let filt='tous';
function renderHisto(){
 const open=histMode==='open';
 $('hiSeg').hidden=open;segOn('hiSeg',open?'devis':faTab);
 if(!open&&faTab==='fac'){const pt=document.querySelector('#s-histo .pg-t');if(pt)pt.textContent='Documents';$('histoList').innerHTML=faList();if($('stats'))$('stats').hidden=true;if($('filtres'))$('filtres').hidden=true;return}
 const pt=document.querySelector('#s-histo .pg-t');if(pt)pt.textContent='Documents';
 const G=open?[['envoye','En cours de signature'],['brouillon','Brouillons']]
  :[['accepte','Validés, à encaisser'],['paye','Payés'],['refuse','Refusés ou expirés']];
 const when=x=>(x.sign&&(x.sign.signedAt||x.sign.sentAt))||Date.parse(x.date)||0;
 let h='';
 G.forEach(([st,t])=>{
  const L=db.quotes.filter(x=>{const z=x.status||'brouillon';return (z===st||(st==='refuse'&&z==='expire'))&&(x.lines&&x.lines.length||x.sign||x.cv)}).sort((a,b)=>when(b)-when(a));
  if(!L.length)return;
  h+=`<h2 class="grp"><span>${t}</span><span class="cnt">${L.length}</span></h2><div class="lst">`+L.map(x=>{
   const s=x.sign;
   return `<div class="it"${swQ(x)?` data-sw="q:${x.id}"`:''}>
   <button class="it-main" onclick="openQ('${x.id}')"><span class="it-t"><b>${esc(x.client||'—')}</b><span class="tag ${x.status}">${ST[x.status]||ST.brouillon}</span></span>
    <span class="mut it-s"><span data-noi18n>${esc(x.num||'')}</span> · ${dFR(x.date)} · ${eur(totals(x).ttc)}</span>
    ${s&&s.st==='signed'?`<span class="signed"><svg class="i"><use href="#i-pen"/></svg><span>Signé par ${esc(s.clientName||'')} le ${dFR(s.signedAt)}</span></span>`:''}</button>
   <div class="it-act">
    ${['accepte','paye'].includes(x.status)?faQuoteBadges(x):''}
    ${x.status==='accepte'?`<button class="btn sm" onclick="faNew('${x.id}')"><svg class="i"><use href="#i-doc"/></svg>Facturer</button><button class="btn sm sec" onclick="markPaid('${x.id}')"><svg class="i"><use href="#i-check"/></svg>Marquer comme payé</button>`:''}
    ${x.status==='paye'&&x.paidAt?`<span class="mut it-s">Payé · ${dFR(x.paidAt)}</span>`:''}
    ${['accepte','paye'].includes(x.status)?`<button class="btn sm sec" onclick="pdfQ('${x.id}')"><svg class="i"><use href="#i-doc"/></svg>PDF</button>`:''}
    ${s&&s.url?`<a class="btn sm sec" href="${/^https?:\/\//.test(s.url||'')?esc(s.url):'#'}" target="_blank" rel="noopener"><svg class="i"><use href="#i-link"/></svg>${s.st==='signed'?'Voir le devis signé':'Lien du devis'}</a>`:''}
    <button class="btn sm sec" onclick="dupQ('${x.id}')">Dupliquer</button>
    ${s&&s.st==='signed'||x.status==='paye'?'':`<select class="st-sel" aria-label="Statut" onchange="setSt('${x.id}',this.value)">${Object.keys(ST).map(k=>`<option value="${k}" ${k===x.status?'selected':''}>${ST[k]}</option>`).join('')}</select>`}
   </div></div>`}).join('')+'</div>'});
 $('histoList').innerHTML=h||`<div class="card mut">${open?'Aucun devis ouvert.':'Aucun devis dans l\'historique.'}</div>`;
 if($('stats'))$('stats').hidden=true;if($('filtres'))$('filtres').hidden=true;
}
function setSt(id,s){const x=db.quotes.find(y=>y.id===id);x.status=s;save();renderHisto()}
function openQ(id){q=JSON.parse(JSON.stringify(db.quotes.find(y=>y.id===id)));fillForm();go('edit')}
function dupQ(id){const o=JSON.parse(JSON.stringify(db.quotes.find(y=>y.id===id)));o.id=uid();o.num='';o.status='brouillon';o.date=ymdL();delete o.sign;delete o.paidAt;delete o.proSig;delete o.updatedAt;q=o;fillForm();go('edit')}
function pdfQ(id){const o=db.quotes.find(y=>y.id===id);if(!o||!['accepte','paye'].includes(o.status))return;buildPrint(o);setTimeout(()=>window.print(),200)}

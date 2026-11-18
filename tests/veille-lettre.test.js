/* Veille réglementaire, la newsletter (ce que l'appli lit, « Ça me concerne ? », envoi, notifications) : node tests/veille-lettre.test.js */
'use strict';
const assert=require('assert'),os=require('os'),fs=require('fs'),path=require('path'),http=require('http');
const {creer,lundi}=require('../serveur/veille/index.js'),V=require('../chat/veille.js');
let ok=0;const t=async(nom,f)=>{await f();ok++;console.log('✓',nom)};
const A='2026-11-16';

(async()=>{
await t('Pour qui : oui, non, ou « si tu fais partie de… » quand on ne sait pas',()=>{
 assert.deepStrictEqual(V.concerne({},{pros:['artisans du bâtiment']}),{etat:'oui',texte:'Oui, toi'});assert.strictEqual(V.concerne(null,{}).etat,'oui');
 assert.strictEqual(V.concerne({forme:'Micro-entreprise'},{pros:['micro-entrepreneurs']}).etat,'oui');assert.strictEqual(V.concerne({franchise:true},{pros:['micro-entrepreneurs']}).etat,'oui');
 assert.deepStrictEqual(V.concerne({forme:'SARL'},{pros:['micro-entrepreneurs']}),{etat:'non',texte:'Non, pas toi'});
 assert.strictEqual(V.concerne({},{pros:['micro-entrepreneurs']}).etat,'peut');
 assert.deepStrictEqual(V.concerne({forme:'SARL'},{pros:['sous-traitants','employeurs']}),{etat:'peut',texte:'Si tu fais partie des sous-traitants, employeurs'});
 assert.strictEqual(V.concerne({forme:'SARL'},{pros:['micro-entrepreneurs','sous-traitants']}).etat,'peut')});
await t('Pour qui, avec le métier de « Mon entreprise »',()=>{
 assert.deepStrictEqual(V.concerne({metier:'électriciens'},{pros:['électriciens']}),{etat:'oui',texte:'Oui, toi : électriciens'});
 assert.deepStrictEqual(V.concerne({metier:'peintres'},{pros:['électriciens']}),{etat:'non',texte:'Non, pas toi'});assert.strictEqual(V.concerne({metier:'autre'},{pros:['couvreurs','maçons']}).etat,'non');
 assert.strictEqual(V.concerne({},{pros:['électriciens']}).etat,'peut');assert.strictEqual(V.concerne({metier:'plusieurs'},{pros:['électriciens']}).etat,'peut');
 assert.strictEqual(V.concerne({metier:'peintres'},{pros:['électriciens','employeurs']}).texte,'Si tu fais partie des employeurs');
 assert.strictEqual(V.concerne({metier:'peintres',forme:'micro'},{pros:['électriciens','micro-entrepreneurs']}).etat,'oui');
 assert.strictEqual(V.concerne({metier:'peintres'},{pros:['artisans du bâtiment']}).etat,'oui');
 const A2=require('../serveur/veille/analyse.js'),html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),sel=html.match(/<select id="eMetier"[\s\S]*?<\/select>/)[0];
 const vals=[...sel.matchAll(/value="([^"]*)"/g)].map(m=>m[1]).filter(x=>x&&x!=='plusieurs'&&x!=='autre');
 assert.ok(vals.length===7&&vals.every(x=>A2.analyser({titre:'x',categorie:'confirme'},{}).pros&&Object.prototype.hasOwnProperty.call(require('../serveur/veille/analyse.js').PROS||{},x)))});
await t('Quand : date en clair et délai ; une proposition ne change rien',()=>{
 assert.strictEqual(V.quand({dateVigueur:'2027-01-01'},A),'1er janvier 2027, dans 46 jours');assert.strictEqual(V.quand({dateVigueur:'2026-11-17'},A),'17 novembre 2026, demain');
 assert.strictEqual(V.quand({dateVigueur:'2026-11-16'},A),'Aujourd\'hui');assert.strictEqual(V.quand({dateVigueur:'2026-11-04'},A),'Depuis le 4 novembre 2026');
 assert.strictEqual(V.quand({},A),'');assert.ok(/Pas encore voté/.test(V.quand({categorie:'proposition',dateVigueur:'2027-01-01'},A)))});
await t('cartes à montrer : les nouvelles, pas celles déjà ouvertes, de retour à 90, 30 et 7 jours',()=>{
 const it={id:'a',titre:'T',dateVigueur:'2027-09-01',pros:[]},non={id:'b',titre:'U',pros:['micro-entrepreneurs']};
 assert.deepStrictEqual(V.aMontrer([it,non],{},{forme:'SARL'},A).map(x=>x.id),['a']);
 assert.strictEqual(V.aMontrer([it],{a:0},{},A).length,0);assert.strictEqual(V.aMontrer([it],{a:0},{},'2027-06-10').length,1);
 assert.strictEqual(V.aMontrer([it],{a:1},{},'2027-06-10').length,0);assert.strictEqual(V.aMontrer([it],{a:1},{},'2027-08-05').length,1);assert.strictEqual(V.aMontrer([it],{a:2},{},'2027-08-27').length,1);
 assert.strictEqual(V.aMontrer([it],{a:3},{},'2027-09-02').length,0);assert.strictEqual(V.aMontrer([{id:'c'},null,{titre:'x'}],{},{},A).length,0);
 assert.strictEqual(V.aMontrer([it],{__proto__:null},{},A).length,1);assert.strictEqual(V.aMontrer([1,2,3,4,5,6,7].map(i=>({id:'k'+i,titre:'T'})),{},{},A).length,5)});
await t('carte : fermée = titre et bouton ; ouverte = trois lignes ; rien d\'exécutable',()=>{
 const it={id:'x"><img src=x onerror=alert(1)>',titre:'<script>alert(1)</script> Devis',dateVigueur:'2027-01-01',pros:[],aFaire:'Rien : casô <b>met</b> à jour',url:'javascript:alert(1)'};
 const f=V.carte(it,false,{},A),o=V.carte(it,true,{},A);
 assert.ok(/Ça me concerne \?/.test(f)&&!/Pour qui/.test(f));assert.ok(/Pour qui/.test(o)&&/Quand/.test(o)&&/À faire/.test(o)&&!/Ça me concerne/.test(o));
 for(const h of [f,o]){assert.ok(!/<script|<img|<b>|javascript:/.test(h));assert.ok(/&lt;script&gt;/.test(h))}
 assert.ok(/href="https:\/\/www\.legifrance\.gouv\.fr\/x"/.test(V.carte({...it,url:'https://www.legifrance.gouv.fr/x'},true,{},A)));
 assert.ok(!/À faire/.test(V.carte({...it,aFaire:''},true,{},A)));assert.ok(/Du nouveau pour ton métier/.test(V.carte({id:'a',titre:'T',dateVigueur:'2026-12-01'},false,{},A)));
 assert.ok(/Une échéance approche/.test(V.carte({id:'a',titre:'T',dateVigueur:'2026-12-01'},false,{},A,null,true)));assert.ok(/color:inherit/.test(V.carte({...it,url:'https://www.legifrance.gouv.fr/x'},true,{},A)))});

await t('dans l\'appli (faux navigateur) : page Newsletter et pastille, rien dans le chat ; le chat répond quand on demande',async()=>{
 const vm=require('vm'),src=fs.readFileSync(path.join(__dirname,'..','chat','veille.js'),'utf8');
 const monter=(mode,items,search)=>{const mem={},ecoute={},E={newsList:{innerHTML:''},newsDot:{hidden:true},chatIn:{value:''}},pousse=[],envois=[];
  const w={CASO_APPRIS:'https://serveur.test',navigator:{onLine:true},db:{prof:{forme:'SARL',metier:'peintres'}},accountGet:()=>({mode}),i18nT:x=>x,location:{search:search||''},setTimeout:f=>f(),
   localStorage:{getItem:k=>k in mem?mem[k]:null,setItem:(k,v)=>{mem[k]=v}},
   document:{hidden:false,getElementById:i=>E[i]||null,querySelector:()=>null,addEventListener:(n,f)=>{ecoute[n]=f}},
   fetch:async u=>{w.appel=u;return {ok:true,json:async()=>items}},chatPush:m=>pousse.push(m),chatSend(x){envois.push(x)},go:n=>{w.alle=n}};
  w.window=w;vm.runInNewContext(src,w);return {w,E,ecoute,mem,pousse,envois}};
 const items=[{id:'legifrance:A',titre:'Devis : nouvelle mention',dateVigueur:'2099-01-01',pros:[],aFaire:'Rien.',url:'https://www.legifrance.gouv.fr/x',publieLe:'2026-11-16'},
  {id:'legifrance:B',titre:'TVA des travaux de peinture',dateVigueur:'2099-02-01',pros:['peintres'],aFaire:'Vérifie tes devis.',publieLe:'2026-11-10'},{id:'legifrance:C',titre:'Électriciens seulement',pros:['électriciens']}];
 const a=monter('artisan',items);await new Promise(r=>setTimeout(r,20));
 assert.strictEqual(a.w.appel,'https://serveur.test/api/veille/lettre');assert.strictEqual(a.pousse.length,0);assert.strictEqual(a.E.newsDot.hidden,false);
 a.w.casoVeille.page();const h=a.E.newsList.innerHTML;assert.ok(/Devis : nouvelle mention/.test(h)&&/TVA des travaux de peinture/.test(h)&&/Ça me concerne/.test(h)&&!/Électriciens seulement/.test(h)&&!/msg bot/.test(h));
 a.ecoute.click({target:{closest:s=>s==='[data-nvf]'?null:({getAttribute:()=>'legifrance:A'})}});assert.ok(/Rien\./.test(a.E.newsList.innerHTML));assert.strictEqual(a.E.newsDot.hidden,false);
 a.ecoute.click({target:{closest:s=>s==='[data-nvf]'?null:({getAttribute:()=>'legifrance:B'})}});assert.strictEqual(a.E.newsDot.hidden,true);assert.ok(/Oui, toi : peintres/.test(a.E.newsList.innerHTML));
 a.w.chatSend('quoi de neuf pour la tva ?');assert.deepStrictEqual(a.pousse.map(m=>m.who),['me','bot']);assert.ok(/TVA des travaux de peinture/.test(a.pousse[1].html)&&!/nouvelle mention/.test(a.pousse[1].html)&&/À faire : Vérifie tes devis\./.test(a.pousse[1].html));
 a.w.chatSend('qu\'est-ce qui change ?');assert.ok(/nouvelle mention/.test(a.pousse[3].html)&&/TVA/.test(a.pousse[3].html)&&!/Électriciens/.test(a.pousse[3].html));
 a.w.chatSend('devis pour Martin peinture 30 m² TVA 10');assert.deepStrictEqual(a.envois,['devis pour Martin peinture 30 m² TVA 10']);assert.strictEqual(a.pousse.length,4);
 const b=monter('bricoleur',items);await new Promise(r=>setTimeout(r,20));assert.strictEqual(b.w.appel,undefined);b.w.chatSend('quoi de neuf');assert.deepStrictEqual(b.envois,['quoi de neuf']);
 const c=monter('artisan',items,'?news=1');assert.strictEqual(c.w.alle,'news');
 const e=monter('artisan',[{id:'x:1',titre:'Lointain',priorite:'P2',dateVigueur:'2099-01-01',pros:[]},{id:'x:2',titre:'Critique',priorite:'P0',dateVigueur:'2098-01-01',pros:[]},{id:'x:3',titre:'Plus proche',priorite:'P2',dateVigueur:'2090-01-01',pros:[]}]);
 await new Promise(r=>setTimeout(r,20));e.w.casoVeille.page();const he=e.E.newsList.innerHTML;
 assert.ok(/nv-une[\s\S]*Critique[\s\S]*À lire aussi[\s\S]*Plus proche[\s\S]*Lointain/.test(he),'le plus important en grand, puis l\'échéance la plus proche');assert.ok(/3 à lire/.test(he)&&/J-\d+/.test(he));
 e.ecoute.click({target:{closest:s=>s==='[data-nvf]'?null:({getAttribute:()=>'x:2'})}});const h2=e.E.newsList.innerHTML;assert.ok(/nv-une[\s\S]*Critique[\s\S]*nv-a/.test(h2)&&/2 à lire/.test(h2),'lu pendant la visite : garde sa place');assert.ok(!/Pour qui|Quand|Oui, toi/.test(h2),'partie dépliée courte');
 const d=monter('artisan',[]);await new Promise(r=>setTimeout(r,20));d.w.casoVeille.page();assert.ok(/Rien de nouveau pour ton métier/.test(d.E.newsList.innerHTML));d.w.chatSend('des nouveautés ?');assert.ok(/Rien de nouveau/.test(d.pousse[1].html))});
await t('liste entière : toutes les infos du métier, filtres Tout / Règles / Métier',async()=>{
 const vm=require('vm'),src=fs.readFileSync(path.join(__dirname,'..','chat','veille.js'),'utf8'),mem={},ecoute={},E={newsList:{innerHTML:''},newsDot:{hidden:true},chatIn:{value:''}};
 const items=[];for(let i=0;i<40;i++)items.push({id:'x:'+i,titre:(i<25?'Règle numéro ':'Nouvel outil de chantier numéro ')+i,categorie:i<25?'confirme':'nouveaute',priorite:i<25?'P2':'P3',pros:[],datePub:'2026-11-17',publieLe:'2026-11-18',url:'https://www.legifrance.gouv.fr/x'});
 const w={CASO_APPRIS:'https://serveur.test',navigator:{onLine:true},db:{prof:{metier:'peintres'}},accountGet:()=>({mode:'artisan'}),i18nT:x=>x,location:{search:''},setTimeout:f=>f(),
  localStorage:{getItem:k=>k in mem?mem[k]:null,setItem:(k,v)=>{mem[k]=v}},document:{hidden:false,getElementById:i=>E[i]||null,querySelector:()=>null,addEventListener:(n,f)=>{ecoute[n]=f}},
  fetch:async()=>({ok:true,json:async()=>items}),chatPush(){},chatSend(){},go(){}};
 w.window=w;vm.runInNewContext(src,w);await new Promise(r=>setTimeout(r,20));w.casoVeille.page();
 const n=h=>(h.match(/data-veille="x:/g)||[]).length,h0=E.newsList.innerHTML;assert.strictEqual(n(h0),40,'les 40 infos, pas une seule');
 assert.ok(/data-nvf=""[^>]*>Tout <b>40<\/b>/.test(h0)&&/>Règles <b>25<\/b>/.test(h0)&&/>Métier <b>15<\/b>/.test(h0));
 const fil=k=>ecoute.click({target:{closest:s=>s==='[data-nvf]'?{getAttribute:()=>k}:null}});
 fil('metier');let h=E.newsList.innerHTML;assert.strictEqual(n(h),15);assert.ok(!/Règle numéro/.test(h)&&/aria-pressed="true">Métier/.test(h));
 assert.ok(!/Déjà lu/.test(h0)&&/>40 à lire</.test(h0),'rien d\'ouvert : rien de « déjà lu »');fil('regle');h=E.newsList.innerHTML;assert.strictEqual(n(h),25);assert.ok(!/Nouvel outil/.test(h));fil('');assert.strictEqual(n(E.newsList.innerHTML),40)});
await t('titre officiel long : nature et date à part, sujet lisible ; titre complet une fois ouvert',async()=>{
 const T='Arrêté du 12 novembre 2026 relatif aux exigences de performance énergétique et environnementale des constructions de bâtiments en France métropolitaine et portant diverses dispositions';
 assert.deepStrictEqual(V.titreCourt(T),{nat:'Arrêté du 12 novembre 2026',t:'Exigences de performance énergétique et environnementale des constructions de bâtiments en France métropolitaine et portant diverses dispositions'});
 assert.deepStrictEqual(V.titreCourt('Décret n° 2026-1012 du 1er novembre 2026 portant modification du code de la construction'),{nat:'Décret du 1er novembre 2026',t:'Modification du code de la construction'});
 assert.deepStrictEqual(V.titreCourt('TVA des travaux : ce qui change'),{nat:'',t:'TVA des travaux : ce qui change'});
 const vm=require('vm'),src=fs.readFileSync(path.join(__dirname,'..','chat','veille.js'),'utf8'),mem={},ecoute={},E={newsList:{innerHTML:''},newsDot:{hidden:true},chatIn:{value:''}};
 const w={CASO_APPRIS:'https://serveur.test',navigator:{onLine:true},db:{prof:{metier:'peintres'}},accountGet:()=>({mode:'artisan'}),i18nT:x=>x,location:{search:''},setTimeout:f=>f(),
  localStorage:{getItem:k=>k in mem?mem[k]:null,setItem:(k,v)=>{mem[k]=v}},document:{hidden:false,getElementById:i=>E[i]||null,querySelector:()=>null,addEventListener:(n,f)=>{ecoute[n]=f}},
  fetch:async()=>({ok:true,json:async()=>[{id:'j:1',titre:T,priorite:'P1',dateVigueur:'2026-11-13',pros:[],aFaire:'Regarde si tes chantiers sont concernés.',url:'https://www.legifrance.gouv.fr/x',publieLe:'2026-11-17'}]}),chatPush(){},chatSend(){},go(){}};
 w.window=w;vm.runInNewContext(src,w);await new Promise(r=>setTimeout(r,20));w.casoVeille.page();let h=E.newsList.innerHTML;
 assert.ok(/nv-nat[^>]*>Arrêté du 12 novembre 2026</.test(h)&&/<h2[^>]*>Exigences de performance/.test(h),'sujet en titre, nature et date au-dessus');
 ecoute.click({target:{closest:s=>s==='[data-nvf]'?null:({getAttribute:()=>'j:1'})}});h=E.newsList.innerHTML;
 assert.ok(h.includes('nv-off" data-noi18n lang="fr">'+T+'</p>')&&/<h2[^>]*>Exigences/.test(h)&&/13 novembre 2026/.test(h)&&/Texte officiel/.test(h),'ouvert : le titre reste court, le titre officiel complet en petit, date et lien')});
await t('titre en clair : le thème reconnu et l\'objet, sinon rien ; déjà lu, l\'info reste en grand',async()=>{
 const A=require('../serveur/veille/analyse.js'),T='Arrêté du 13 novembre 2026 modifiant l\'arrêté du 6 novembre 2026 prévoyant des bonifications particulières pour les opérations relatives aux offres intégrées sélectionnées dans le cadre de l\'appel à candidatures « Offres intégrées pompes à chaleur » de l\'Agence de l\'environnement et de la maîtrise de l\'énergie, dans le cadre du dispositif des certificats d\'économies d\'énergie';
 assert.strictEqual(A.clair(T),'Aides à la rénovation : primes énergie (CEE), pompes à chaleur');
 assert.strictEqual(A.clair('Décret relatif au taux réduit de TVA pour les travaux'),'TVA : taux réduit');assert.strictEqual(A.clair('Arrêté relatif aux ascenseurs'),'');
 const vm=require('vm'),src=fs.readFileSync(path.join(__dirname,'..','chat','veille.js'),'utf8'),mem={},ecoute={},E={newsList:{innerHTML:''},newsDot:{hidden:true},chatIn:{value:''}};
 const it={id:'j:2',titre:T,clair:A.clair(T),priorite:'P0',dateVigueur:'2026-11-15',pros:[],aFaire:'Vérifie les nouvelles conditions.',url:'https://www.legifrance.gouv.fr/x',publieLe:'2026-11-17'};
 mem.caso_veille=undefined;
 const w={CASO_APPRIS:'https://serveur.test',navigator:{onLine:true},db:{prof:{metier:'peintres'}},accountGet:()=>({mode:'artisan'}),i18nT:x=>x,location:{search:''},setTimeout:f=>f(),
  localStorage:{getItem:k=>mem[k]!==undefined?mem[k]:null,setItem:(k,v)=>{mem[k]=v}},document:{hidden:false,getElementById:i=>E[i]||null,querySelector:()=>null,addEventListener:(n,f)=>{ecoute[n]=f}},
  fetch:async()=>({ok:true,json:async()=>[it]}),chatPush(){},chatSend(){},go(){}};
 w.window=w;vm.runInNewContext(src,w);await new Promise(r=>setTimeout(r,20));w.casoVeille.page();
 assert.ok(/<h2[^>]*>Aides à la rénovation : primes énergie \(CEE\), pompes à chaleur<\/h2>/.test(E.newsList.innerHTML));
 ecoute.click({target:{closest:s=>s==='[data-nvf]'?null:({getAttribute:()=>'j:2'})}});ecoute.click({target:{closest:s=>s==='[data-nvf]'?null:({getAttribute:()=>'j:2'})}});
 const w2=Object.assign({},w,{document:Object.assign({},w.document,{addEventListener(){}})});w2.window=w2;vm.runInNewContext(src,w2);await new Promise(r=>setTimeout(r,20));w2.casoVeille.page();
 const h=E.newsList.innerHTML;assert.ok(/nv-une/.test(h)&&/Aides à la rénovation/.test(h)&&!/Déjà lu/.test(h),'une seule info déjà lue : elle reste en grand, pas de liste vide')});
await t('question ou commande : seules les tournures de question vont à la newsletter',()=>{
 for(const q of ['quoi de neuf','Quoi de neuf pour la TVA ?','des nouveautés ?','qu\'est-ce qui change pour les devis','il y a une nouvelle loi ?','la réglementation a changé ? du nouveau ?','ma newsletter'])assert.ok(V.demande(q),q);
 for(const q of ['devis pour Martin carrelage 20 m²','ajoute un client neuf rue des Lilas','change le prix du placo','nouveau client Dupont','facture pour Mme Petit','TVA 10 % sur le devis'])assert.ok(!V.demande(q),q);
 assert.deepStrictEqual(V.sujets('Quoi de neuf pour la TVA ?'),['tva']);assert.deepStrictEqual(V.sujets('qu\'est-ce qui change ?'),[])});

/* côté serveur */
const brut=(n,titre,texte)=>({source:'legifrance',idSource:'JORFTEXT00005200'+n,titre,url:'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT00005200'+n,datePub:'2026-11-11',resume:'',texte,nature:'DECRET',numero:'',nor:'',dateVigueur:''});
let bruts=[brut('2001','Décret n° 2026-2001 du 10 novembre 2026 relatif aux mentions obligatoires des devis','Le présent décret entre en vigueur le 1er mars 2027.'),
 brut('2002','Décret n° 2026-2002 du 10 novembre 2026 relatif à la TVA des travaux','Le présent décret entre en vigueur le 1er décembre 2026.'),
 brut('2003','Décret n° 2026-2003 du 10 novembre 2026 relatif aux déchets de chantier','Le présent décret entre en vigueur le 1er juin 2027.')];
let heure='2026-11-18T09:00:00Z';const dir=fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-'));
const v=creer({dir,env:{},log:()=>{},maintenant:()=>new Date(heure),sources:{actives:()=>['test'],collecter:async()=>({erreurs:[],bruts})}});
const I=n=>'legifrance:JORFTEXT00005200'+n;

await t('rien ne sort sans validation et sans accord d\'envoi',async()=>{
 await v.passer();assert.deepStrictEqual(v.lettre(),[]);assert.strictEqual(lundi('2026-11-18'),'2026-11-23');assert.strictEqual(lundi('2026-11-23'),'2026-11-30');
 v.decider(I('2003'),'valide');assert.deepStrictEqual(v.lettre(),[]);
 assert.strictEqual(v.decider(I('2001'),'attente',{lettre:true,aFaire:'Rien : casô mettra tes devis à jour.'})[1].publieLe,'');assert.deepStrictEqual(v.lettre(),[])});
await t('newsletter à jour toute seule : tout texte validé sort le jour même, quelle que soit sa priorité',async()=>{
 const p0=v.decider(I('2002'),'valide',{lettre:true,aFaire:'Vérifie le taux de TVA de tes devis en cours.'})[1];assert.deepStrictEqual([p0.priorite,p0.publieLe],['P0','2026-11-18']);
 const p2=v.decider(I('2001'),'valide',{lettre:true})[1];assert.deepStrictEqual([p2.priorite,p2.publieLe,p2.aFaire],['P2','2026-11-18','Rien : casô mettra tes devis à jour.']);
 const L=v.lettre();assert.deepStrictEqual(L.map(x=>x.id).sort(),[I('2001'),I('2002')]);
 assert.deepStrictEqual(Object.keys(L[0]).sort(),['aFaire','categorie','clair','datePub','dateVigueur','id','priorite','pros','publieLe','resume','source','titre','url']);
 assert.deepStrictEqual(v.aAnnoncer().map(x=>x.id).sort(),[I('2001'),I('2002')]);v.annonce([I('2001'),I('2002')]);assert.deepStrictEqual(v.aAnnoncer(),[]);
 heure='2026-11-19T07:00:00Z';const q0=v.decider(I('2001'),'valide',{priorite:'P0'})[1];assert.deepStrictEqual([q0.priorite,q0.publieLe],['P0','2026-11-18'],'déjà sorti : la date ne change pas');
 v.decider(I('2001'),'valide',{priorite:'P2'});assert.deepStrictEqual(v.lettre().map(x=>x.id).sort(),[I('2001'),I('2002')])});
await t('accord retiré, refus, ou texte modifié à la source : la carte ne sort plus',async()=>{
 v.decider(I('2002'),'valide',{lettre:false});assert.deepStrictEqual(v.lettre().map(x=>x.id),[I('2001')]);
 bruts=[brut('2001','Décret n° 2026-2001 du 10 novembre 2026 relatif aux mentions obligatoires des devis','Le présent décret entre en vigueur le 1er avril 2027.')];
 await v.passer();assert.deepStrictEqual(v.lettre(),[]);const f=v.lire(I('2001'));assert.deepStrictEqual([f.validation,f.lettre,f.publieLe],['attente',false,'']);
 assert.strictEqual(v.decider(I('2001'),'valide')[1].publieLe,'');assert.deepStrictEqual(v.lettre(),[])});
await t('serveur : newsletter lisible sans clé, notification aux abonnés pour un texte critique, une seule fois',async()=>{
 const {createServer}=require('../serveur/server.js');process.env.CASO_CLE_IA='cle-test';const envois=[];
 const d2=fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-'));
 fs.writeFileSync(path.join(d2,'data.json'),JSON.stringify({users:{},subs:[{user:'a',sub:{endpoint:'https://push.example/1'}},{user:'b',sub:{endpoint:'https://push.example/2'}}]}));
 const s=createServer({dataDir:d2,veille:v,noTimers:true,appFile:path.join(__dirname,'..','index.html'),pushSend:async(sub,p)=>{envois.push([sub.endpoint,p]);return {status:sub.endpoint.endsWith('2')?410:201}}}),srv=s.server||s;
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port;
 const req=(m,u,h,b)=>new Promise((ok,ko)=>{const r=http.request({host:'127.0.0.1',port,path:u,method:m,headers:Object.assign(b?{'content-type':'application/json'}:{},h||{})},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>ok([x.statusCode,JSON.parse(d),x.headers]))});r.on('error',ko);r.end(b?JSON.stringify(b):undefined)});
 const [c,L,h]=await req('GET','/api/veille/lettre');assert.strictEqual(c,200);assert.deepStrictEqual(L,[]);assert.strictEqual(h['access-control-allow-origin'],'*');
 heure='2026-11-24T09:00:00Z';
 const [c2,f]=await req('POST','/api/veille/decider',{'x-caso-cle':'cle-test'},{id:I('2002'),decision:'valide',corrections:{lettre:true}});
 assert.strictEqual(c2,200);assert.deepStrictEqual([f.priorite,f.publieLe],['P0','2026-11-24']);await new Promise(r=>setTimeout(r,50));
 assert.strictEqual(envois.length,2);assert.ok(/Du nouveau pour ton métier : Décret n° 2026-2002/.test(envois[0][1].body));assert.strictEqual(envois[0][1].tag,'veille');assert.strictEqual(envois[0][1].url,'/?news=1');
 await req('POST','/api/veille/decider',{'x-caso-cle':'cle-test'},{id:I('2002'),decision:'valide',corrections:{aFaire:'Vérifie tes devis.'}});await new Promise(r=>setTimeout(r,50));
 assert.strictEqual(envois.length,2);
 const L2=(await req('GET','/api/veille/lettre'))[1];assert.deepStrictEqual(L2.map(x=>[x.id,x.aFaire]),[[I('2002'),'Vérifie tes devis.']]);assert.ok(!JSON.stringify(L2).includes('historique'));
 await new Promise(r=>srv.close(r))});
await t('notifications : important tout de suite et par métier ; le reste groupé, au plus tous les 14 jours',async()=>{
 const {createServer}=require('../serveur/server.js');process.env.CASO_CLE_IA='cle-test';const envois=[],d3=fs.mkdtempSync(path.join(os.tmpdir(),'caso-veille-'));
 fs.writeFileSync(path.join(d3,'data.json'),JSON.stringify({users:{},subs:[{user:'a',metier:'peintres',sub:{endpoint:'https://push.example/peintre'}},{user:'b',metier:'électriciens',sub:{endpoint:'https://push.example/elec'}},{user:'c',sub:{endpoint:'https://push.example/inconnu'}}]}));
 const B=(n,titre,texte)=>({source:'legifrance',idSource:'JORFTEXT00005200'+n,titre,url:'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT00005200'+n,datePub:'2026-11-11',resume:'',texte,nature:'DECRET',numero:'',nor:'',dateVigueur:''});
 let h2='2026-11-18T09:00:00Z';const w=creer({dir:d3,env:{},log:()=>{},maintenant:()=>new Date(h2),sources:{actives:()=>['test'],collecter:async()=>({erreurs:[],bruts:[
  B('4001','Décret n° 2026-4001 du 10 novembre 2026 relatif aux mentions obligatoires des devis des électriciens','Le présent décret entre en vigueur le 1er décembre 2026.'),
  B('4002','Décret n° 2026-4002 du 10 novembre 2026 relatif aux déchets de chantier','Le présent décret entre en vigueur le 1er septembre 2027.')]})}});
 await w.passer();const s=createServer({dataDir:d3,veille:w,noTimers:true,appFile:path.join(__dirname,'..','index.html'),pushSend:async(sub,p)=>{envois.push([sub.endpoint.split('/').pop(),p.body]);return {status:201}}}),srv=s.server||s;
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port;
 const post=b=>new Promise((ok,ko)=>{const r=http.request({host:'127.0.0.1',port,path:'/api/veille/decider',method:'POST',headers:{'content-type':'application/json','x-caso-cle':'cle-test'}},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>ok(JSON.parse(d)))});r.on('error',ko);r.end(JSON.stringify(b))});
 const f1=await post({id:'legifrance:JORFTEXT000052004001',decision:'valide',corrections:{lettre:true}});assert.deepStrictEqual([f1.priorite,f1.pros.join()],['P0','électriciens']);await new Promise(r=>setTimeout(r,50));
 assert.deepStrictEqual(envois.map(e=>e[0]),['elec']);
 const f2=await post({id:'legifrance:JORFTEXT000052004002',decision:'valide',corrections:{lettre:true}});assert.strictEqual(f2.priorite,'P2');await new Promise(r=>setTimeout(r,50));
 h2='2026-11-23T09:00:00Z';assert.strictEqual(w.aAnnoncer().length,1);assert.strictEqual(envois.length,1);   // pas important : attend la notification groupée
 await new Promise(r=>srv.close(r))});
console.log(ok+' contrôles réussis');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});

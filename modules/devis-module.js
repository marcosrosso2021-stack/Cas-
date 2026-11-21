/* casô · Module Devis (devis.html) branché sur le bouton Devis
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Module Devis (devis.html) branché sur le bouton Devis ----------
   Une seule liste : db.quotes. Le module lit et écrit les devis de casô, traduits à la volée.
   Les champs propres au module (sections, options, avenant, style…) sont rangés dans q.dv. */
const DV_ST={brouillon:'brouillon',envoye:'envoye',accepte:'valide',paye:'valide',refuse:'retracte',expire:'retracte'};
let DVF=null,DVA=null,DV_IDS=new Set(),DV_LAST={};
const dvN=x=>{const n=parseFloat(String(x==null?'':x).replace(/\s/g,'').replace(',','.'));return isNaN(n)?0:n};
const dvS=x=>x==null||x===''?'':String(x);
function dvLignesCaso(L){return (L||[]).filter(l=>l.sec===undefined&&!l.opt).map(l=>({label:l.des||'',qty:dvN(l.qte),unit:l.unite||'',pu:dvN(l.pu),tva:dvN(l.tva)}))}
function dvVersModule(x){const dv=x.dv||{},lc=x.lines||[];
 // si le chat a modifié les lignes depuis le dernier passage dans le module, on repart des lignes de casô
 const memes=dv.lignes&&JSON.stringify(dvLignesCaso(dv.lignes))===JSON.stringify(lc.map(l=>({label:l.label||'',qty:dvN(l.qty),unit:l.unit||'',pu:dvN(l.pu),tva:dvN(l.tva)})));
 const lignes=memes?dv.lignes:lc.map(l=>({id:uid(),des:l.label||'',qte:dvS(l.qty),unite:l.unit||'',pu:dvS(l.pu),tva:dvN(l.tva),fourni:false,ref:'',verif:false,opt:false}));
 const p=db.prof||{};
 return Object.assign({validiteJ:dvS(p.valid||30),acompteType:p.acompteType||'Acompte',payant:false,payantMontant:'',signature:'lien',debut:'',duree:'',prix:'',autoliq:false,format:'',avenant:null,layout:'',modeleId:'libre'},dv,{
  id:x.id,num:x.num||'',date:x.date||ymdL(),statut:DV_ST[x.status||'brouillon']||'brouillon',
  client:Object.assign({type:'part',chantier:''},dv.client||{},{nom:x.client||'',adr:x.adr||'',tel:x.tel||''}),
  lignes,acomptePct:dv.acomptePct!=null?dv.acomptePct:dvS(x.acompte==null?30:x.acompte),
  sig:dv.sig||{artisan:null,client:null}})}
function dvVersCaso(d){
 const x=db.quotes.find(y=>y.id===d.id)||{id:d.id,remise:0,franchise:false,status:'brouillon'};
 const st={brouillon:'brouillon',envoye:'envoye',valide:['accepte','paye'].includes(x.status)?x.status:'accepte',retracte:['refuse','expire'].includes(x.status)?x.status:'refuse'}[d.statut]||x.status||'brouillon';
 const dv=JSON.parse(JSON.stringify(d));['id','num','date','statut'].forEach(k=>delete dv[k]);dv.client={type:d.client.type,chantier:d.client.chantier||'',id:d.client.id||''};
 return Object.assign(JSON.parse(JSON.stringify(x)),{num:d.num||x.num||'',date:d.date||x.date,client:d.client.nom||'',adr:d.client.adr||'',tel:d.client.tel||x.tel||'',lines:dvLignesCaso(d.lignes),acompte:dvN(d.acomptePct),status:st,dv})}
function dvEnvoyer(){if(!DVA)return;const L=(db.quotes||[]).map(dvVersModule);DV_IDS=new Set(L.map(d=>d.id));DV_LAST={};L.forEach(d=>DV_LAST[d.id]=JSON.stringify(d));DVA.chargerDevis(L)}
function dvRecevoir(L){let ch=false;const ids=new Set();
 L.forEach(d=>{ids.add(d.id);const j=JSON.stringify(d);if(DV_LAST[d.id]===j)return;DV_LAST[d.id]=j;const o=dvVersCaso(d);
  const i=db.quotes.findIndex(y=>y.id===o.id);if(typeof qGuard==='function'&&!qGuard(o))return;if(!o.num)o.num=qNextNum(String(o.date||ymdL()).slice(0,4));
  if(i>=0)db.quotes[i]=o;else db.quotes.push(o);ch=true});
 DV_IDS.forEach(id=>{if(!ids.has(id)){const o=db.quotes.find(y=>y.id===id);if(o&&!(o.sign&&o.sign.st==='signed')){db.quotes=db.quotes.filter(y=>y.id!==id);ch=true}delete DV_LAST[id]}});
 DV_IDS=ids;if(ch){save();DV_SIG.q=JSON.stringify(db.quotes||[])}}
function dvProfil(){let sg='';try{sg=localStorage.getItem('caso_sig')||''}catch(e){}const r=sgOk();return Object.assign({},db.prof||{},{sigArtisan:sg,sigId:r?r.id:'',sigQr:r?sgQrImg(r):''})}
const DV_CHAMP={nom:'eNom',adr:'eAdr',siret:'eSiret',siren:'eSiren',tel:'eTel',forme:'eForme',rm:'eRm',tvai:'eTvai',email:'eMail',assur:'eAssur',zone:'eZone',rcpro:'eRcpro',mediateur:'eMed',capital:'eCapital',valid:'eValid'};
function dvBrancher(){const w=DVF.contentWindow,A=w&&w.CasoDevis;if(!A)return;DVA=A;const h=A.hooks;
 h.saveDevis=L=>dvRecevoir(L);
 h.saveProfil=p=>{const c=Object.assign({},p);delete c.sigArtisan;delete c.sigId;delete c.sigQr;db.prof=Object.assign({},db.prof||{},c);db.profAt=Date.now();save();DV_SIG.p=JSON.stringify(dvProfil())};
 h.getClients=()=>(db.clients||[]).map(c=>({id:c.id,nom:c.nom||'',adr:c.adr||'',tel:c.tel||'',chantier:c.chantier||'',type:c.type||'part'}));
 h.saveClient=c=>{if(!c||!c.nom)return;let x=(db.clients||[]).find(y=>y.id===c.id)||(db.clients||[]).find(y=>vnNorm(y.nom)===vnNorm(c.nom));
  if(!x){x={id:c.id||uid(),nom:c.nom,tel:c.tel||'',email:'',adr:c.adr||'',note:''};db.clients.push(x)}else{if(c.adr&&!x.adr)x.adr=c.adr}if(c.type)x.type=c.type;save()};
 h.getPrix=des=>{const p=(db.prices||[]).find(x=>vnNorm(x.nom)===vnNorm(des));return p?dvS(p.prix):undefined};
 h.numero=dt=>qNextNum(String(dt||ymdL()).slice(0,4));
 h.accueil=()=>dvClose();
 h.ouvrirEntreprise=k=>{dvClose(true);cptPage('ent');setTimeout(()=>{const el=$(DV_CHAMP[k]||'');if(el){el.scrollIntoView({block:'center'});el.focus()}},250)};
 A.integrer({entreprise:false,masquer:['valide','retracte'],ecran:'list'});
 dvSync()}
// n'envoie au module que ce qui a changé depuis la dernière ouverture (ouverture instantanée)
let DV_SIG={};
function dvSync(){if(!DVA)return;
 if(DV_SIG.l!==I18N.lang){DV_SIG.l=I18N.lang;try{DVA.langue({lang:I18N.lang,dir:I18N.lang==='ar'?'rtl':'ltr',t:x=>i18nT(x)})}catch(e){}}
 const p=dvProfil(),sp=JSON.stringify(p);if(DV_SIG.p!==sp){DV_SIG.p=sp;DVA.chargerProfil(p)}
 const sq=JSON.stringify(db.quotes||[]);if(DV_SIG.q!==sq){DV_SIG.q=sq;dvEnvoyer()}}
// le module est préchargé en arrière-plan au démarrage : le bouton Devis l'affiche sans attente
let DV_PEND=null;
function dvPrecharger(){if(DVF)return;DVF=document.createElement('iframe');DVF.title='casô Devis';DVF.src='devis.html';
 DVF.onload=()=>{dvBrancher();if(DV_PEND&&DVA){const id=DV_PEND;DV_PEND=null;if(id!==true)DVA.ouvrir(id)}};$('dvx').appendChild(DVF)}
function dvOpen(id){drawerClose(true);const box=$('dvx');box.hidden=false;document.body.classList.add('dv-on');
 if(!DVF||!DVA){DV_PEND=id||true;dvPrecharger();return}
 dvSync();DVA.aller('list');if(id)DVA.ouvrir(id)}
(function(){const go=()=>{try{dvPrecharger()}catch(e){}};/* après le démarrage du chat : le module Devis ne lui prend pas la connexion */const later=()=>setTimeout(()=>('requestIdleCallback' in window)?requestIdleCallback(go,{timeout:6000}):go(),6000);
 if(document.readyState==='complete')setTimeout(later,800);else addEventListener('load',()=>setTimeout(later,800))})();
function dvClose(rester){$('dvx').hidden=true;document.body.classList.remove('dv-on');if(!rester)go('home')}
function entLogo(inp){const f=inp.files[0];inp.value='';if(!f)return;const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,480/Math.max(i.naturalWidth,i.naturalHeight)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(i.naturalWidth*k));c.height=Math.max(1,Math.round(i.naturalHeight*k));c.getContext('2d').drawImage(i,0,0,c.width,c.height);
  db.prof=Object.assign({},db.prof||{},{logo:c.toDataURL('image/png'),couleurs:[],couleur:'',logoCle:''});db.profAt=Date.now();save();entExtra();toast(i18nT('Enregistré.'))};i.src=r.result};r.readAsDataURL(f)}
function entExtra(){try{logoProfil()}catch(e){}const p=db.prof||{},v=$('eLogoV');if(v)v.innerHTML=rcImg(p.logo)?`<img src="${p.logo}" alt="">`:'';const cw=$('eCapW');if(cw)cw.hidden=!p.forme||/^(EI|micro)$/i.test(p.forme);const tw=$('eTvaW');if(tw)tw.hidden=!!p.franchise}

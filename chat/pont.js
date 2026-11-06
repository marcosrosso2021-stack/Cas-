/* casô · pont entre le chat autonome (chat/brain.js) et les données de casô.
   Une seule liste de données : celles de casô (db). À chaque message, le chat reçoit une vue de travail des clients, prix,
   devis et rendez-vous, comprend la phrase (10 langues), et seules ses actions prises en charge ici sont écrites dans db.
   Le reste continue de passer par les modules de casô (planning, factures, prix, services, notes de devis).
   Le chat garde seulement ce qu'il apprend (phrases, mots, refus, modèles) sous la clé caso_ia. */
(function(){
"use strict";
var P={ready:false,B:null,E:null,corrige:false},LANGS=["en","es","pt","it","ro","pl","tr","ru","ar"],KEY="caso_ia";
var SRC=(document.currentScript&&document.currentScript.src)||"";
var APPRIS=["phrases","journal","unrec","neg","syn","roomw","colw","lex","modeles"];
window.casoPont=P;

/* ---------- chargement : le chat démarre sans bloquer casô ---------- */
function charger(){
  if(!window.CasoEngine||!window.CasoBrain)return;
  var base=SRC?SRC.replace(/[^/]*$/,""):"chat/";
  Promise.all([fetch(base+"data.json").then(function(r){return r.json();})].concat(LANGS.map(function(l){return fetch(base+"i18n/"+l+".json").then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});})))
  .then(function(L){var data=L[0],E=CasoEngine.create(data),sv=null;
    try{var o=JSON.parse(localStorage.getItem(KEY)||"null");if(o){if(o.e)E.load(o.e);sv=o.b||null;}}catch(e){}
    var B=CasoBrain.create(E,data,sv);LANGS.forEach(function(l,i){if(L[i+1])B.addCatalog(l,L[i+1]);});
    P.B=B;P.E=E;P.base=base;P.ready=true;
    setTimeout(function(){chargerMini(base);},5000);})
  .catch(function(e){if(window.console)console.error("chat casô",e);});
}
/* le mini modèle (5 Mo) se charge après coup, quand le téléphone a le temps */
function chargerMini(base){if(!window.CasoMini||!P.B||P.B.mini)return;
  fetch(base+"caso-mini-model.json").then(function(r){return r.json();}).then(function(m){P.B.mini=CasoMini.create(m);
    try{var h=localStorage.getItem("caso_ia_mini");if(h)P.B.mini.loadHead(JSON.parse(h));}catch(e){}}).catch(function(){});}
function garder(){if(!P.B)return;try{var s=P.B.dump(),b={};APPRIS.forEach(function(k){if(s[k]!=null)b[k]=s[k];});localStorage.setItem(KEY,JSON.stringify({e:P.E.dump(),b:b}));}catch(e){}
  try{if(P.B.mini&&P.B.miniDirty){localStorage.setItem("caso_ia_mini",JSON.stringify(P.B.mini.dumpHead()));P.B.miniDirty=false;}}catch(e){}}

/* ---------- vue de travail : les données de casô, au format du chat ---------- */
function cle(n){return CasoBrain.hn(String(n||"")).replace(/^(m|mme|mlle|monsieur|madame|mr|mrs)\s+/,"").trim();}
var STATUT={brouillon:"brouillon",envoye:"envoyé",accepte:"validé",paye:"validé",refuse:"refusé"};
function nombre(v){if(v===""||v==null)return null;var x=+String(v).replace(",",".");return isNaN(x)?null:x;}
function vue(){var S=P.B.S,idc={};S.mode="artisan";
  S.clients={};(db.clients||[]).forEach(function(c){var k=cle(c.nom);if(!k)return;idc[c.id]=k;S.clients[k]={nom:c.nom,tel:c.tel||"",email:c.email||"",adresse:c.adr||"",notes:c.note?[c.note]:[],created:0};});
  S.services=(db.prices||[]).map(function(p){return {nom:p.nom,unite:p.unit||"forfait",prix:nombre(p.prix)};});
  var Q=(db.quotes||[]).slice();if(q&&!Q.some(function(x){return x.id===q.id;})&&(q.lines.length||q.client))Q.push(q);
  S.devis=Q.map(function(x){return {id:x.id,num:x.num||"",client:x.client?cle(x.client):null,statut:STATUT[x.status]||"brouillon",sig:{},created:Date.parse(x.date)||0,
    lignes:(x.lines||[]).map(function(l){return {libelle:l.label,quantite:nombre(l.qty)||0,unite:l.unit||"u",prix:nombre(l.pu)};}),afaire:[],fournisseurs:[],remarques:[]};});
  S.cur=q?q.id:null;
  S.rdv=(db.events||[]).filter(function(e){return e.t==="rdv"&&e.d;}).map(function(e){var a=String(e.a||"08:00").split(":"),d=String(e.d).split("-"),st=new Date(+d[0],+d[1]-1,+d[2],+a[0]||0,+a[1]||0).getTime(),b=e.b?String(e.b).split(":"):null;
    return {id:e.id,start:st,min:b?Math.max(15,(+b[0]*60+(+b[1]||0))-((+a[0]||0)*60+(+a[1]||0))):60,titre:e.title||"Rendez-vous",client:e.cid&&idc[e.cid]||null};}).sort(function(x,y){return x.start-y.start;});
  S.fournisseurs=(db.suppliers||[]).map(function(s){return {nom:s.nom};});
  return {clients:JSON.parse(JSON.stringify(S.clients)),devis:S.devis.map(function(d){return d.id;}),rdv:S.rdv.map(function(r){return r.id;})};}

/* ---------- ce que le chat fait lui-même (le reste reste aux modules de casô) ---------- */
var PRIS=/^(devis\.(preparer|modele|total|compte|ouvrir|liste)|clients\.(info|message|appeler|maj|note|ouvrir)|planning\.(prochain|dispo|ouvrir)|services\.(info|ouvrir)|fournisseurs\.ouvrir|factures\.ouvrir|pointage\.ouvrir|memoire\.[a-z]+|mot\.apprendre|sys\.politesse)$/;
/* écrans du chat -> écrans de casô (le planning répond dans la conversation) */
var ECRAN={devis:"edit","devis-liste":"mes",clients:"cli",client:"cli",services:"prix",fournisseurs:"fou",factures:"fact",pointage:"pt"};
function libelles(c){return (c||[]).filter(function(x){return x.m!=="sys"||x.a==="politesse";}).map(function(x){return x.m+"."+x.a;});}
function pris(c){var L=libelles(c);return L.length>0&&L.every(function(l){return PRIS.test(l);});}

/* ---------- écrire dans casô ce que le chat a changé ---------- */
function ecrire(avant){var S=P.B.S,u={q:JSON.stringify(q),qAdd:[],cAdd:[],cMod:[]},carte=null;
  Object.keys(S.clients).forEach(function(k){var c=S.clients[k],a=avant.clients[k],ex=(db.clients||[]).filter(function(x){return cle(x.nom)===k;})[0];
    if(!ex){var n={id:uid(),nom:c.nom,tel:c.tel||"",email:c.email||"",adr:c.adresse||"",note:(c.notes||[]).join(" · ")};db.clients.push(n);u.cAdd.push(n.id);return;}
    var ch={};if(c.tel&&c.tel!==ex.tel)ch.tel=c.tel;if(c.email&&c.email!==ex.email)ch.email=c.email;if(c.adresse&&c.adresse!==ex.adr)ch.adr=c.adresse;
    var nn=(c.notes||[]).length>(a?a.notes.length:0)?(c.notes||[]).slice(a?a.notes.length:0):[];if(nn.length)ch.note=[ex.note].concat(nn).filter(Boolean).join(" · ");
    if(Object.keys(ch).length){u.cMod.push(JSON.stringify(ex));Object.assign(ex,ch);}});
  S.devis.forEach(function(d){if(avant.devis.indexOf(d.id)>=0)return;
    var vide=q&&!q.lines.length&&!q.client,o=vide?q:newObj(),c=d.client&&S.clients[d.client];
    o.client=c?c.nom:"";o.tel=o.tel||(c&&c.tel)||"";o.adr=o.adr||(c&&c.adresse)||"";o.modele=d.modele||"";
    o.lines=d.lignes.map(function(l){var p=(db.prices||[]).filter(function(x){return cle(x.nom)===cle(l.libelle);})[0];return {label:l.libelle,qty:l.quantite,unit:l.unite,pu:l.prix,tva:p&&p.tva!=null?p.tva:20};});
    q=o;if(typeof fillForm==="function")fillForm();storeQ(q);u.qAdd.push(q.id);carte=q.id;
    if(typeof CHAT!=="undefined")CHAT.qid=q.id;});
  /* rendez-vous pris par le chat (après une proposition ou une question) : dans le planning de casô */
  S.rdv.forEach(function(r){if(avant.rdv.indexOf(r.id)>=0)return;var d=new Date(r.start),f=new Date(r.start+(r.min||60)*60000),z=function(n){return (n<10?"0":"")+n;},
      c=r.client&&S.clients[r.client],cl=c?(db.clients||[]).filter(function(x){return cle(x.nom)===r.client;})[0]:null;
    var ev={id:uid(),t:"rdv",d:d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate()),a:z(d.getHours())+":"+z(d.getMinutes()),b:z(f.getHours())+":"+z(f.getMinutes()),
      title:r.titre&&r.titre!=="Rendez-vous"?r.titre:(cl?cl.nom:""),cid:cl?cl.id:undefined,adr:cl&&cl.adr||"",src:"chat",at:Date.now()};
    db.events.push(ev);try{if(typeof agRemCompute==="function")agRemCompute(ev);}catch(x){}u.eAdd=(u.eAdd||[]).concat(ev.id);});
  if(u.cAdd.length||u.cMod.length||u.eAdd)save();
  return {u:u,carte:carte};}
P.annuler=function(u){if(!u)return;try{db.quotes=db.quotes.filter(function(x){return u.qAdd.indexOf(x.id)<0;});db.clients=db.clients.filter(function(x){return u.cAdd.indexOf(x.id)<0;});
  if(u.eAdd)db.events=db.events.filter(function(x){return u.eAdd.indexOf(x.id)<0;});u.cMod.forEach(function(j){var c=JSON.parse(j),i=db.clients.findIndex(function(x){return x.id===c.id;});if(i>=0)db.clients[i]=c;});q=JSON.parse(u.q);if(typeof fillForm==="function")fillForm();if(typeof CHAT!=="undefined")CHAT.qid=q.id;save();}catch(e){}};

/* ---------- affichage dans la conversation de casô ---------- */
function e(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
var IC={oeil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  envoi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>',
  face:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M7 3H5a2 2 0 0 0-2 2v2M17 3h2a2 2 0 0 1 2 2v2M7 21H5a2 2 0 0 1-2-2v-2M17 21h2a2 2 0 0 0 2-2v-2"/><path d="M9 9v1.5M15 9v1.5M12 9v4h-1M9.5 16.5c1.5 1 3.5 1 5 0"/></svg>',
  ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'};
P.IC=IC;P.tr=function(t,a){return P.B?P.B.tr(t,a):t;};
function devisDe(id){return (db.quotes||[]).filter(function(x){return x.id===id;})[0]||(q&&q.id===id?q:null);}
function carte(id){var o=devisDe(id);if(!o)return "";var t=totals(o),manque=o.lines.some(function(l){return l.pu==null||l.pu==="";}),B=P.B,st=o.status;
  var h='<div class="pcard" data-qid="'+e(o.id)+'" dir="ltr" data-noi18n><div class="pc-h"><b>'+e(o.client||"")+'</b>'+(o.modele?'<span>'+e(o.modele)+'</span>':'')+'<i>'+e(o.num||"")+'</i></div>';
  o.lines.forEach(function(l){var x=nombre(l.pu);h+='<div class="pc-l'+(x==null?' miss':'')+'"><span>'+e(l.label)+'</span><span>'+e(B.fnumFr(+l.qty||0)+" "+(l.unit||""))+'</span><span>'+(x==null?"prix ?":e(B.eurFr(x*(+l.qty||0))))+'</span></div>';});
  h+='<div class="pc-t"><span>'+e(B.eurFr(t.ht))+' HT</span><b>'+e(B.eurFr(t.ttc))+' TTC</b></div><div class="pc-f">';
  if(st==="envoye"||st==="accepte"||st==="paye"||st==="refuse")h+='<span class="pc-st '+(st==="refuse"?"bad":st==="envoye"?"warn":"ok")+'">'+e(st==="envoye"?P.tr("en cours de signature"):P.B.trw(STATUT[st]))+'</span>';
  else h+='<button type="button" class="pc-ic pc-oeil" title="'+e(P.tr("Voir le devis"))+'" aria-label="'+e(P.tr("Voir le devis"))+'" onclick="casoPont.voir(\''+e(o.id)+'\')">'+IC.oeil+'</button><button type="button" class="pc-ic pc-env" title="'+e(P.tr("Envoyer au client"))+'" aria-label="'+e(P.tr("Envoyer au client"))+'"'+(manque?' disabled':'')+' onclick="casoPont.envoyer(\''+e(o.id)+'\')">'+IC.envoi+'</button>';
  return h+'</div></div>';}
P.carte=carte;
function lien(href,label){return '<div class="msg-act"><a class="btn sm" href="'+e(href)+'" target="_top" rel="noopener">'+e(label)+'</a></div>';}
function msgHref(m){var t=encodeURIComponent(m.texte||""),to=String(m.to||"");if(m.canal==="mail")return "mailto:"+encodeURIComponent(to)+"?body="+t;
  if(m.canal==="whatsapp")return "https://wa.me/"+to.replace(/\D/g,"").replace(/^0/,"33")+"?text="+t;return "sms:"+to.replace(/\s/g,"")+"?&body="+t;}
function html(r,id){var h="";if(r.explain)h+='<p class="mut" dir="auto">'+e(r.explain)+'</p>';
  (r.says||[]).filter(Boolean).forEach(function(s){h+='<p dir="auto">'+e(s)+'</p>';});
  if(id)h+="<!--carte-->"+carte(id)+"<!--/carte-->";
  if(r.ui==="message"&&r.msg)h+=lien(msgHref(r.msg),r.msg.canal==="mail"?P.tr("Ouvrir l’e-mail"):r.msg.canal==="whatsapp"?P.tr("Ouvrir WhatsApp"):P.tr("Envoyer le SMS"));
  if(r.ui==="appel"&&r.tel)h+=lien("tel:"+String(r.tel).replace(/\s/g,""),P.tr("Appeler"));
  return '<div data-noi18n>'+h+'</div>';}

/* ---------- un message : le chat le prend s'il sait le faire, sinon casô continue comme avant ---------- */
P.essaie=function(t){if(!P.ready||typeof db==="undefined"||typeof q==="undefined"||typeof CHAT==="undefined")return false;var B=P.B,r;
  var avantPend=B.S.pending&&B.S.pending.type;
  try{B.setLangue((typeof I18N!=="undefined"&&I18N.lang)||"fr");var avant=vue();r=P.corrige?B.corriger(t):B.handle(t);}catch(err){if(window.console)console.error(err);P.corrige=false;return false;}
  P.corrige=false;
  /* un rendez-vous compris directement reste au planning de casô (rappels, équipe, répétitions) ;
     le chat ne le prend que lorsqu'il a dû le deviner ou poser une question */
  var rdv=function(c){var L=libelles(c);return L.length>0&&L.every(function(l){return l==="planning.ajouter";});};
  var pend=B.S.pending,ok=pris(r.cmds)||(rdv(r.cmds)&&(r.via!=="local"||!!avantPend))||
    (pend&&pend.type==="confirm"&&(pris(pend.cmds)||rdv(pend.cmds))&&!(r.cmds||[]).length);
  if(!ok){if(!(pend&&pend.type==="reformuler"))B.S.pending=null;garder();return false;}
  var w=ecrire(avant);garder();
  if(CHAT.qid!==q.id)CHAT.qid=q.id;
  CHAT.m.push({who:"me",text:t});CHAT.m.push({who:"bot",html:html(r,w.carte),pUndo:(w.u.qAdd.length||w.u.cAdd.length||w.u.cMod.length||w.u.eAdd)?w.u:undefined});
  chatSave();chatRender(true);
  var sc=r.open&&r.open.screen&&ECRAN[r.open.screen];if(sc&&typeof go==="function")setTimeout(function(){if(sc==="edit")fillForm();go(sc);},250);
  return true;};
P.incompris=function(){return P.tr("Je n’ai pas compris.");};
P.voir=function(id){var o=devisDe(id);if(!o)return;if(q.id!==o.id){q=JSON.parse(JSON.stringify(o));CHAT.qid=q.id;}fillForm();go("edit");};

/* ---------- envoi : signature enregistrée, Face ID, puis lien casô (même service que l'écran de signature) ---------- */
function dire(t){CHAT.m.push({who:"bot",html:'<p data-noi18n dir="auto">'+e(t)+'</p>'});chatSave();chatRender(true);}
function majCarte(id){CHAT.m.forEach(function(m){if(m.who==="bot"&&m.html&&m.html.indexOf('data-qid="'+id+'"')>=0)m.html=m.html.replace(/<!--carte-->[\s\S]*?<!--\/carte-->/,"<!--carte-->"+carte(id)+"<!--/carte-->");});chatSave();chatRender(false);}
P.envoyer=function(id){var o=devisDe(id);if(!o)return;
  if(o.lines.some(function(l){return l.pu==null||l.pu==="";})){dire(P.tr("Il manque des prix sur ce devis : je ne l’envoie pas."));return;}
  if(o.sign&&o.sign.st==="signed"){toast(i18nT("Ce devis est déjà signé par le client."));return;}
  var img=typeof sgSigImg==="function"?sgSigImg():null;
  if(q.id!==o.id){q=JSON.parse(JSON.stringify(o));CHAT.qid=q.id;fillForm();}
  if(!img){goSign();return;}   /* première fois : l'écran de signature de casô, qui envoie aussi */
  var c=getSync();if(!c.url||!c.token){dire(i18nT("Pour envoyer un lien au client, connecte casô au service en ligne (Compte › Équipe)."));return;}
  verifier(o.client).then(function(v){if(v!=="ok")return;
    var cur=q;if(!(cur.cv&&cur.cv.blocks)&&typeof cvModel==="function"&&cvModel())cur.cv=cvFreeze(cur);cur.proSig=img;
    if(!storeQ(cur))return;
    return syncNow().then(function(){if(db.quotes.some(function(x){return x.id!==cur.id&&x.num===cur.num;})){cur.num="";storeQ(cur);}
      try{upsert("clients",{nom:cur.client,tel:cur.tel,adr:cur.adr});}catch(x){}
      return apiTeam("/api/sign/new",{doc:quoteDoc(cur),img:img,name:(accountGet()||{}).prenom||c.user||""});})
    .then(function(j){if(!j)return;cur.sign={token:j.token,url:j.url,st:"sent",sentAt:Date.now()};if(cur.status!=="accepte")cur.status="envoye";storeQ(cur);syncSoon();
      majCarte(cur.id);dire(P.tr("Devis envoyé à {0} : il le signera dans casô.",[cur.client]));if(typeof askNotif==="function")setTimeout(askNotif,1500);});
  }).catch(function(err){dire(i18nT("Erreur d'envoi : ")+(err&&err.message||err));});};

/* Face ID / empreinte : clé d'accès de l'appareil (WebAuthn) ; sans Face ID, une confirmation d'un geste */
var UVPA=false;try{if(window.PublicKeyCredential&&PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable)PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(function(v){UVPA=!!v;}).catch(function(){});}catch(x){}
function b64(buf){var s="",a=new Uint8Array(buf);for(var i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return btoa(s);}
function unb64(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;}
function vueFace(){var o=document.createElement("div");o.className="faceid";o.innerHTML=IC.face;document.body.appendChild(o);requestAnimationFrame(function(){o.classList.add("on");});
  return {fin:function(ok){if(ok){o.innerHTML=IC.ok;o.classList.add("vu");}setTimeout(function(){o.classList.remove("on");setTimeout(function(){o.remove();},250);},ok?650:0);}};}
function verifier(nom){var vu=vueFace(),p;
  try{if(!UVPA||!navigator.credentials)throw {indispo:true};var ch=crypto.getRandomValues(new Uint8Array(32)),k=null;try{k=localStorage.getItem("caso_cle");}catch(x){}
    p=k?navigator.credentials.get({publicKey:{challenge:ch,allowCredentials:[{type:"public-key",id:unb64(k),transports:["internal"]}],userVerification:"required",timeout:60000}})
      :navigator.credentials.create({publicKey:{challenge:ch,rp:{name:"casô"},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"artisan",displayName:"casô"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"discouraged"},timeout:60000}})
        .then(function(cr){try{localStorage.setItem("caso_cle",b64(cr.rawId));}catch(x){}return cr;});
    p=p.then(function(){return "ok";});}catch(x){p=Promise.reject(x);}
  return p.catch(function(x){if(x&&(x.indispo||x.name==="SecurityError"||x.name==="NotSupportedError"||/feature|policy|origin|not enabled/i.test(x.message||"")))return confirmer(nom);return "refus";})
    .then(function(v){vu.fin(v==="ok");return v;});}
function confirmer(nom){return new Promise(function(res){var f=document.createElement("div"),b=document.createElement("div"),t=document.createElement("p"),k=document.createElement("button");
  f.className="pc-sheet";b.className="pc-box";t.textContent=P.tr("Envoyer le devis à {0} ?",[nom||""]);t.setAttribute("data-noi18n","");k.type="button";k.className="pc-ic pc-env";k.innerHTML=IC.envoi;k.setAttribute("aria-label",P.tr("Envoyer au client"));
  var fin=function(v){f.remove();res(v);};k.addEventListener("click",function(ev){ev.stopPropagation();fin("ok");});f.addEventListener("click",function(ev){if(ev.target===f)fin("refus");});
  b.appendChild(t);b.appendChild(k);f.appendChild(b);document.body.appendChild(f);k.focus();});}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",charger);else charger();
})();

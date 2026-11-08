/* casô · pont entre le chat autonome (chat/brain.js) et les données de casô.
   Une seule liste de données : celles de casô (db). À chaque message, le chat reçoit une vue de travail des clients, prix,
   devis et rendez-vous, comprend la phrase (10 langues), et seules ses actions prises en charge ici sont écrites dans db.
   Le reste continue de passer par les modules de casô (planning, factures, prix, services, notes de devis).
   Le chat garde seulement ce qu'il apprend (phrases, mots, refus, modèles) sous la clé caso_ia. */
(function(){
"use strict";
var P={ready:false,B:null,E:null,corrige:false},LANGS=["en","es","pt","it","ro","pl","tr","ru","ar"],KEY="caso_ia";
var SRC=(document.currentScript&&document.currentScript.src)||"";
var APPRIS=["phrases","journal","unrec","neg","syn","roomw","colw","lex","modeles","courses"];
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
  /* le devis en cours (q) est toujours la version vivante, même vide */
  var Q=(db.quotes||[]).map(function(x){return q&&x.id===q.id?q:x;});if(q&&!Q.some(function(x){return x.id===q.id;}))Q.push(q);
  S.devis=Q.map(function(x){return {id:x.id,num:x.num||"",client:x.client?cle(x.client):null,statut:STATUT[x.status]||"brouillon",sig:{},created:Date.parse(x.date)||0,
    lignes:(x.lines||[]).map(function(l){return {libelle:l.label,quantite:nombre(l.qty)||0,unite:l.unit||"u",prix:nombre(l.pu)};}),afaire:[],fournisseurs:[],remarques:[]};});
  S.cur=q?q.id:null;
  S.rdv=(db.events||[]).filter(function(e){return e.t==="rdv"&&e.d;}).map(function(e){var a=String(e.a||"08:00").split(":"),d=String(e.d).split("-"),st=new Date(+d[0],+d[1]-1,+d[2],+a[0]||0,+a[1]||0).getTime(),b=e.b?String(e.b).split(":"):null;
    return {id:e.id,start:st,min:b?Math.max(15,(+b[0]*60+(+b[1]||0))-((+a[0]||0)*60+(+a[1]||0))):60,titre:e.title||"Rendez-vous",client:e.cid&&idc[e.cid]||null};}).sort(function(x,y){return x.start-y.start;});
  S.fournisseurs=(db.suppliers||[]).map(function(s){return {nom:s.nom};});
  /* paiements : ceux des factures de casô */
  S.paiements=[];(db.invoices||[]).forEach(function(f){if(f.kind==="avoir"||!f.num)return;(f.pays||[]).forEach(function(p){S.paiements.push({client:cle(f.client&&f.client.nom),montant:+p.amt||0,date:Date.parse(p.d)||0,mode:p.mode||""});});});
  return {clients:JSON.parse(JSON.stringify(S.clients)),devis:S.devis.map(function(d){return d.id;}),rdv:S.rdv.map(function(r){return r.id;})};}

/* ---------- ce que le chat fait lui-même (le reste reste aux modules de casô) ---------- */
var PRIS=/^(app\.[a-z0-9_]+|devis\.(nouveau|dupliquer|pdf)|factures\.pdf|clients\.supprimer|fournisseurs\.ajouter|services\.supprimer|fichiers\.importer|planning\.annuler|entreprise\.(ouvrir|maj)|signature\.ouvrir|metre\.calculer|dictee\.debut|pointage\.nfc|bibliotheque\.ouvrir|sys\.(sauvegarde|mode)|fichiers\.exporter|planning\.libre|factures\.(impayes|creer)|stats\.ca|courses\.(ajouter|calcul|ouvrir|vider|retirer)|pointage\.(entree|sortie)|devis\.(remise|envoyer)|scene\.[a-z_]+|devis\.(preparer|modele|total|compte|ouvrir|liste)|clients\.(info|message|appeler|maj|note|ouvrir)|planning\.(prochain|dispo|ouvrir|date)|services\.(info|ouvrir)|fournisseurs\.ouvrir|factures\.ouvrir|pointage\.ouvrir|memoire\.[a-z]+|mot\.apprendre|sys\.politesse)$/;
/* écrans du chat -> écrans de casô (le planning répond dans la conversation) */
var ECRAN={courses:null,devis:"edit","devis-liste":"mes",clients:"cli",client:"cli",services:"prix",fournisseurs:"fou",factures:"fact",pointage:"pt"};
function libelles(c){return (c||[]).filter(function(x){return x.m!=="sys"||x.a==="politesse"||x.a==="sauvegarde"||x.a==="mode";}).map(function(x){return x.m+"."+x.a;});}
function pris(c){var L=libelles(c);return L.length>0&&L.every(function(l){return PRIS.test(l);});}

/* ---------- écrire dans casô ce que le chat a changé ---------- */
/* « Léon » plutôt que « Leon » : le nom tel qu'il a été tapé */
function nomTape(t,nom){var w=CasoBrain.hn(nom).split(" ").filter(Boolean),T=[];String(t||"").replace(/[\p{L}\p{N}'’-]+/gu,function(x,i){T.push({x:x,h:CasoBrain.hn(x),i:i});return x;});
  for(var a=0;a+w.length<=T.length;a++){var ok=true;for(var b=0;b<w.length&&ok;b++)ok=T[a+b].h===w[b];if(ok){var z=T[a+w.length-1],o=String(t).slice(T[a].i,z.i+z.x.length);if(typeof chatCasse==="function")o=chatCasse(o);return o.charAt(0).toUpperCase()+o.slice(1);}}return nom;}
function ecrire(avant,t){var S=P.B.S,u={q:JSON.stringify(q),qAdd:[],cAdd:[],cMod:[]},carte=null;
  Object.keys(S.clients).forEach(function(k){var c=S.clients[k],a=avant.clients[k],ex=(db.clients||[]).filter(function(x){return cle(x.nom)===k;})[0];
    if(!ex){var n={id:uid(),nom:nomTape(t,c.nom),tel:c.tel||"",email:c.email||"",adr:c.adresse||"",note:(c.notes||[]).join(" · ")};db.clients.push(n);u.cAdd.push(n.id);return;}
    var ch={};if(c.tel&&c.tel!==ex.tel)ch.tel=c.tel;if(c.email&&c.email!==ex.email)ch.email=c.email;if(c.adresse&&c.adresse!==ex.adr)ch.adr=c.adresse;
    var nn=(c.notes||[]).length>(a?a.notes.length:0)?(c.notes||[]).slice(a?a.notes.length:0):[];if(nn.length)ch.note=[ex.note].concat(nn).filter(Boolean).join(" · ");
    if(Object.keys(ch).length){u.cMod.push(JSON.stringify(ex));Object.assign(ex,ch);}});
  S.devis.forEach(function(d){if(avant.devis.indexOf(d.id)>=0)return;
    var vide=q&&!q.lines.length&&!q.client,o=vide?q:newObj(),c=d.client&&S.clients[d.client];
    var cx=d.client?(db.clients||[]).filter(function(x){return cle(x.nom)===d.client;})[0]:null;o.client=cx?cx.nom:(c?c.nom:"");o.tel=o.tel||(c&&c.tel)||"";o.adr=o.adr||(c&&c.adresse)||"";o.modele=d.modele||"";
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
  if(u.eAdd)db.events=db.events.filter(function(x){return u.eAdd.indexOf(x.id)<0;});u.cMod.forEach(function(j){var c=JSON.parse(j),i=db.clients.findIndex(function(x){return x.id===c.id;});if(i>=0)db.clients[i]=c;});
  if(u.prof)db.prof=JSON.parse(u.prof);if(u.cDel)db.clients.push(JSON.parse(u.cDel));if(u.sAdd)db.suppliers=(db.suppliers||[]).filter(function(x){return x.id!==u.sAdd;});
  if(u.pDel)db.prices=db.prices.concat(JSON.parse(u.pDel));if(u.eDel)db.events=db.events.concat(JSON.parse(u.eDel));if(u.ptAdd)db.pts=(db.pts||[]).filter(function(x){return u.ptAdd.indexOf(x.id)<0;});q=JSON.parse(u.q);if(typeof fillForm==="function")fillForm();if(u.qMod&&typeof storeQ==="function")storeQ(q);if(typeof CHAT!=="undefined")CHAT.qid=q.id;save();}catch(e){}};

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
/* bouton d'action dans la bulle : le geste de l'usager lance l'action (le partage du téléphone l'exige) */
function bouton(act,label){return '<div class="msg-act"><button class="btn sm" type="button" onclick="casoPont.action(\''+act+'\')">'+e(label)+'</button></div>';}
function lien(href,label){return '<div class="msg-act"><a class="btn sm" href="'+e(href)+'" target="_top" rel="noopener">'+e(label)+'</a></div>';}
function msgHref(m){var t=encodeURIComponent(m.texte||""),to=String(m.to||"");if(m.canal==="mail")return "mailto:"+encodeURIComponent(to)+"?body="+t;
  if(m.canal==="whatsapp")return "https://wa.me/"+to.replace(/\D/g,"").replace(/^0/,"33")+"?text="+t;return "sms:"+to.replace(/\s/g,"")+"?&body="+t;}
function html(r,id){var h="";if(r.explain)h+='<p class="mut" dir="auto">'+e(r.explain)+'</p>';
  (r.says||[]).filter(Boolean).forEach(function(s){h+='<p dir="auto">'+e(s)+'</p>';});
  if(id)h+="<!--carte-->"+carte(id)+"<!--/carte-->";
  if(r.ui==="message"&&r.msg)h+=lien(msgHref(r.msg),r.msg.canal==="mail"?P.tr("Ouvrir l’e-mail"):r.msg.canal==="whatsapp"?P.tr("Ouvrir WhatsApp"):P.tr("Envoyer le SMS"));
  if(r.bouton)h+=bouton(r.bouton.act,r.bouton.label);
  if(r.ui==="appel"&&r.tel)h+=lien("tel:"+String(r.tel).replace(/\s/g,""),P.tr("Appeler"));
  return '<div data-noi18n>'+h+'</div>';}

/* sauvegarde, export, changement de mode : les fonctions de casô, au toucher du bouton */
function csv(v){v=String(v==null?"":v);return /[;"\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}
P.action=function(a){try{
  if(a==="sauvegarde"&&typeof backupNow==="function")return backupNow();
  if(a==="3d"&&typeof m3dOpen==="function")return m3dOpen();
  if(a==="prix"&&typeof exportCsv==="function")return exportCsv();
  if(a==="clients"&&typeof dl==="function"){var L=["Nom;Téléphone;E-mail;Adresse;Note"].concat((db.clients||[]).map(function(c){return [c.nom,c.tel,c.email,c.adr||c.adresse,c.note].map(csv).join(";");}));return dl("mes-clients.csv","\ufeff"+L.join("\n"),"text/csv");}
  if(a==="bricoleur"&&typeof modePick==="function"){if(typeof chatSave==="function")chatSave();return modePick("bricoleur");}
  if(a==="secours"&&typeof rcNew==="function"){go("cpt");return rcNew();}
  if(a==="deconnexion"&&typeof logout==="function")return logout();
  if(a==="notifs"&&typeof enableNotif==="function")return enableNotif();
  if(a==="restaurer"){var fj=document.getElementById("fJson");if(fj)return fj.click();}
  if(a==="dictee"&&typeof vnRec==="function")return vnRec();
  if(a.indexOf("avoir:")===0&&typeof faShow==="function"){faShow(a.slice(6));return setTimeout(function(){if(typeof faAvoir==="function")faAvoir();},300);}
  if(a==="encaissements"&&typeof encCsv==="function"){go("enc");return encCsv();}
  if(a==="contacts"&&typeof cfContacts==="function")return cfContacts("cli");
  if(a==="photo"&&typeof impPick==="function"){go("imp");return impPick("cam",1);}
 }catch(err){if(window.console)console.error(err);}};


var FORCE=/^(planning\.(ajouter|libre)|devis\.supprimer_ligne|factures\.relance|pointage\.total|fournisseurs\.commande|clients\.(ajouter|maj))$/;
function forcable(c){var L=libelles(c);return L.length>0&&L.every(function(l){return PRIS.test(l)||FORCE.test(l);});}
/* « Lui Dire », « Carreler », « L'instant » : des mots de la phrase, pas un nom de client */
P.pasUnNom=function(n){if(!P.ready)return false;var w=String(n||"").split(/[^\p{L}]+/u).filter(function(x){return x.length>1;});if(!w.length)return true;
  if(w.some(function(x){return /^(lui|leur|leurs|moi|toi|te|me|nous|vous|eux|elle|elles|ils)$/i.test(x);}))return true;
  if((db.clients||[]).some(function(c){return cle(c.nom)===cle(n);}))return false;
  return w.every(function(x){return P.B.motCmd(x);});};
/* un message : le chat le prend s'il sait le faire, sinon casô continue comme avant ;
   force : second passage, après les modules de casô (facture, prix, agenda) qui n'ont rien reconnu */
P.essaie=function(t,force){if(!P.ready||typeof db==="undefined"||typeof q==="undefined"||typeof CHAT==="undefined")return false;var B=P.B,r,avant,avantPend,attendait,g=P.garde;P.garde=null;
  if(force){if(!g||g.t!==t)return false;r=g.r;avant=g.avant;avantPend=g.avantPend;attendait=g.attendait;}
  else{if(g&&g.pend&&B.S.pending===g.pend)B.S.pending=null;
    /* réponse gardée mais pas reprise : casô a fait la demande précédente, le chat n'a rien à annuler */
    if(g)B.S.lastTurn=null;
    avantPend=B.S.pending&&B.S.pending.type;attendait=P.attente;
    try{B.setLangue((typeof I18N!=="undefined"&&I18N.lang)||"fr");avant=vue();r=P.corrige?B.corriger(t):B.handle(t);}catch(err){if(window.console)console.error(err);P.corrige=false;return false;}
    P.corrige=false;}
  /* un rendez-vous compris directement reste au planning de casô (rappels, équipe, répétitions) ;
     le chat ne le prend que lorsqu'il a dû le deviner ou poser une question */
  var rdv=function(c){var L=libelles(c);return L.length>0&&L.every(function(l){return l==="planning.ajouter";});};
  var pend=B.S.pending,ok=force||pris(r.cmds)||(rdv(r.cmds)&&(r.via==="devine"||r.via==="mini"||/^(confirm|rdv|complete|datechoix)$/.test(avantPend||"")))||
    (pend&&(pend.type==="confirm"||pend.type==="sure")&&(pris(pend.cmds)||rdv(pend.cmds))&&!(r.cmds||[]).length)||
    /* le chat venait de poser une question : sa réponse (« pas pour l'instant », « d'accord »…) reste dans le chat */
    (attendait&&!(r.cmds||[]).length&&(r.says||[]).length>0);
  if(!ok){
    /* compris, mais casô a peut-être mieux : on garde la réponse pour le second passage */
    if(forcable(r.cmds)||(pend&&pend.type==="confirm"&&forcable(pend.cmds)&&!(r.cmds||[]).length)||(pend&&/^(rdv|complete|datechoix)$/.test(pend.type))){P.garde={t:t,r:r,avant:avant,avantPend:avantPend,attendait:attendait,pend:pend};P.attente=false;garder();return false;}
    /* casô fait la demande lui-même : « non » juste après ne doit pas annoncer une annulation du chat */
    B.S.lastTurn=null;
    if(!(pend&&pend.type==="reformuler"))B.S.pending=null;P.attente=false;garder();return false;}
  var lab0=libelles(r.cmds).join(),a0=(r.cmds&&r.cmds[0]&&(r.cmds[0].args||r.cmds[0].a))||{},apres=null,q0=JSON.stringify(q),qMod=false;
  if(lab0==="factures.impayes"||lab0==="factures.relance"){var dd=du(lab0==="factures.relance"?{client:a0.client}:a0);if(dd){r.says=[dd];r.explain="";}}
  /* remise : sur le devis de casô (pourcentage) */
  if(lab0==="devis.remise"&&q){var br=(q.lines||[]).reduce(function(s2,l){return s2+(+l.qty||0)*(+l.pu||0);},0),pc=a0.pourcentage!=null?+a0.pourcentage:(a0.montant&&br?Math.round(a0.montant/br*10000)/100:0);
    if(q.lines.length){q.remise=pc||0;storeQ(q);fillForm();qMod=true;r.explain="";r.says=[pc?P.tr("Remise de {0} % sur le devis",[pc])+" · "+P.B.eurFr(totals(q).ttc)+" TTC":P.tr("Remise enlevée. Total : {0} HT.",[P.B.eurFr(totals(q).ht)])];}}
  /* enlever une ligne du devis ouvert */
  if(lab0==="devis.supprimer_ligne"&&q){var kl=cle(a0.libelle||""),av=q.lines.length;
    q.lines=q.lines.filter(function(l){var x=cle(l.label||"");return !(kl&&x&&(x===kl||x.indexOf(kl)===0||kl.indexOf(x)===0));});
    r.explain="";if(q.lines.length<av){storeQ(q);fillForm();qMod=true;r.says=[P.tr("Ligne retirée. Total : {0} HT.",[P.B.eurFr(totals(q).ht)])];}else r.says=[P.tr("Je ne trouve pas « {0} » dans le devis.",[a0.libelle])];}
  /* commande chez un fournisseur : le fournisseur et la commande sur sa fiche */
  if(lab0==="fournisseurs.commande"&&a0.nom&&typeof upsert==="function"){try{var fx=upsert("suppliers",{nom:nomTape(t,a0.nom)}).x;
    fx.cmd=(fx.cmd||[]).concat([{d:new Date().toISOString().slice(0,10),art:(a0.articles||[]).map(function(x){return (x.quantite?x.quantite+" ":"")+(x.unite?x.unite+" ":"")+x.nom;}).join(", ")}]);save();}catch(x){}}
  /* envoyer le devis : même chemin que la flèche de la carte (signature, Face ID, lien casô) */
  if(lab0==="devis.envoyer"){r.says=[];if(q&&q.lines.length){var qi=q.id;apres=function(){P.envoyer(qi);};}else r.says=[P.tr("Il n’y a pas de devis à envoyer.")];}
  /* facture : le module Factures de casô, à partir du dernier devis du client */
  if(lab0==="factures.creer"){var kc=cle(a0.client||""),dq=(db.quotes||[]).filter(function(x){return (!kc||cle(x.client)===kc)&&x.lines&&x.lines.length;}).sort(function(x,y){return (y.status==="accepte")-(x.status==="accepte")||String(y.date).localeCompare(String(x.date));})[0];
    if(dq&&typeof faNew==="function"){r.says=[];apres=function(){faNew(dq.id);};}}
  /* sauvegarde, export des clients ou des prix, passage en mode bricoleur : un bouton dans la bulle */
  if(lab0==="sys.sauvegarde"){r.says=[];r.explain="";r.bouton={act:"sauvegarde",label:P.B.describe(r.cmds)};}
  if(lab0==="fichiers.exporter"){var qx=a0.quoi==="clients"?"clients":a0.quoi==="prix"?"prix":"sauvegarde";r.says=[];r.explain="";r.bouton={act:qx,label:P.B.describe(qx==="sauvegarde"?[{m:"sys",a:"sauvegarde",args:{}}]:r.cmds)};}
  if(lab0==="sys.mode"&&a0.mode==="bricoleur"){r.explain="";r.bouton={act:"bricoleur",label:P.B.describe(r.cmds)};}
  /* pointage : le total s'affiche sur l'écran de pointage de casô */
  if(lab0==="pointage.total"){r.says=[];r.explain=P.B.describe([{m:"pointage",a:"ouvrir",args:{}}])||r.explain;r.open={screen:"pointage"};}
  /* fonctions de l'appli (réglages, équipe, module Devis, factures, import, planning, pointage, plan, 3D…) */
  var xa=/^app\./.test(lab0)?appFaire(lab0.slice(4),a0,r,t):autreFaire(lab0,a0,r,t,avant);
  if(xa){r.says=xa.says||[];r.explain=xa.explain||"";if(xa.bouton)r.bouton=xa.bouton;if(xa.apres){var ap0=apres;apres=function(){if(ap0)ap0();xa.apres();};}if(xa.qMod)qMod=true;}
  /* maquette 3D : le module 3D de casô reçoit la phrase */
  /* sans maquette enregistrée, le module 3D s'ouvrirait vide et la phrase serait perdue : on le dit, avec le bouton du plan */
  if(/^scene\./.test(lab0)){var mq=dernMaq();r.says=[];if(mq){r.explain=P.tr("Maquette 3D");apres=function(){vers3D(t,mq);};}else{r.explain="";r.says=[P.tr("Pour la maquette 3D, ajoute d’abord le plan.")];r.bouton={act:"3d",label:P.tr("Plan 3D")};}}
  var w=ecrire(avant,t);garder();P.attente=!!(B.S.pending&&B.S.pending.type!=="reformuler");
  if(qMod){w.u.q=q0;w.u.qMod=true;}
  if(xa&&xa.u)Object.keys(xa.u).forEach(function(k){w.u[k]=xa.u[k];});
  if(CHAT.qid!==q.id)CHAT.qid=q.id;
  CHAT.m.push({who:"me",text:t});CHAT.m.push({who:"bot",html:html(r,w.carte),pUndo:(w.u.qAdd.length||w.u.cAdd.length||w.u.cMod.length||w.u.eAdd||w.u.qMod||w.u.prof||w.u.cDel||w.u.sAdd||w.u.pDel||w.u.eDel||w.u.ptAdd)?w.u:undefined});
  chatSave();chatRender(true);if(apres)setTimeout(apres,200);
  var sc=r.open&&r.open.screen&&ECRAN[r.open.screen];if(sc&&typeof go==="function")setTimeout(function(){if(sc==="edit")fillForm();go(sc);},250);
  return true;};
/* ---------- les fonctions de l'appli demandées dans le chat (app.* et écrans) ---------- */
/* ouvrir un écran de casô et amener la carte voulue sous les yeux */
function ecran(sec,sel,fn){if(typeof go!=="function")return;setTimeout(function(){try{go(sec);if(fn)fn();}catch(x){}
  if(sel)setTimeout(function(){try{var el=document.querySelector(sel);if(el){(el.closest(".card")||el).scrollIntoView({block:"center",behavior:"smooth"});}}catch(x){}},150);},250);}
function devisCourant(){return q&&(q.lines.length||q.client)?q:null;}
function garderDevis(){try{storeQ(q);if(typeof fillForm==="function")fillForm();}catch(x){}}
var CHAMPS_ENT={nomEnt:"nom",telEnt:"tel",mailEnt:"email",adrEnt:"adr",med:"mediateur"};
function nb(v){var m=String(v||"").replace(",",".").match(/\d+(?:\.\d+)?/);return m?m[0].replace(".",","):"";}
/* la personne et le chantier du pointage, quand casô peut les savoir sans demander */
function quiPointe(){var P0=db.people||[],a=typeof accountGet==="function"?accountGet()||{}:{},pr=cle(a.prenom||"");
  var p=P0.filter(function(x){return pr&&cle(x.nom).split(" ")[0]===pr.split(" ")[0];})[0]||(P0.length===1?P0[0]:null);return p;}
function chantierDe(pid,sortie){var E0=(db.pts||[]).filter(function(x){return x.p===pid;}).sort(function(x,y){return y.ts-x.ts;});
  if(sortie){var o=E0[0];return o&&o.t==="in"?o.c:(E0.length?E0[0].c:null);}var C0=db.chantiers||[];return E0.length?E0[0].c:(C0.length===1?C0[0].id:null);}
function appFaire(a,o,r,t){var x={says:[],explain:r.explain};var cur=devisCourant(),pasDevis=function(){x.says=[P.tr("Il n’y a pas encore de devis.")];};
  switch(a){
    case "langue":if(o.l&&typeof vnSetLang==="function"){x.explain="";try{vnSetLang(o.l);P.B.setLangue(o.l);}catch(y){}x.says=[P.tr("C’est fait.")];}else ecran("cpt","#uiLang");break;
    case "compte":ecran("cpt",o.suppr?"#acctCard":"#acctName");break;
    case "secours":x.bouton={act:"secours",label:r.explain};x.explain="";break;
    case "deconnexion":x.bouton={act:"deconnexion",label:r.explain};x.explain="";break;
    case "entreprise":
      if(o.champ&&o.v){var k=CHAMPS_ENT[o.champ]||o.champ,v=o.v;if(/^(tauxH|depl|capital|valid)$/.test(k))v=nb(v);if(/^(iban|bic)$/.test(k))v=String(o.v).toUpperCase().replace(/[^A-Z0-9 ]/g,"").trim();
        if(!v){x.says=[P.tr("Je n’ai pas compris la valeur.")];break;}
        x.u={prof:JSON.stringify(db.prof||{})};db.prof=Object.assign({},db.prof||{});db.prof[k]=v;db.profAt=Date.now();save();x.says=[P.tr("C’est enregistré : {0}.",[v])];}
      else ecran("cpt",o.champ?"#e"+({tauxH:"TauxH",depl:"Depl",iban:"Iban",bic:"Bic",siret:"Siret",capital:"Capital",tvai:"Tvai",assur:"Assur",rcpro:"Rcpro",valid:"Valid",delai:"Delai",med:"Med",rm:"Rm",forme:"Forme",nomEnt:"Nom",telEnt:"Tel",mailEnt:"Mail",adrEnt:"Adr"}[o.champ]||"Nom"):"#eNom");break;
    case "notifs":if(o.on&&typeof enableNotif==="function"){x.bouton={act:"notifs",label:r.explain};x.explain="";}else ecran("cpt","#notifCard");break;
    case "restaurer":x.bouton={act:"restaurer",label:r.explain};x.explain="";break;
    case "traduction":ecran("tr");break;
    case "equipe":ecran("cpt","#teamList");break;
    case "inviter":ecran("cpt","#nuName",function(){setTimeout(function(){var i=document.getElementById("nuName");if(i&&i.offsetParent)i.focus();},500);});break;
    case "signature":ecran("sigp");break;
    case "dictee":x.bouton={act:"dictee",label:r.explain};x.explain="";break;
    case "devis_module":{var d=cur;if(o.quoi==="avenant"){var kc=cle(o.client||(cur&&cur.client)||"");d=(db.quotes||[]).filter(function(y){return (!kc||cle(y.client)===kc)&&(y.status==="accepte"||y.status==="paye"||(y.sign&&y.sign.st==="signed"));}).sort(function(y,z){return String(z.date).localeCompare(String(y.date));})[0]||null;
        if(!d){x.says=[P.tr("Un avenant se fait sur un devis signé : je n’en trouve pas.")];break;}}
      if(!d){pasDevis();break;}if(d===q)garderDevis();var di=d.id;x.apres=function(){if(typeof dvOpen==="function")dvOpen(di);};break;}
    case "payant":if(!cur){pasDevis();break;}x.qMod=true;q.dv=Object.assign({},q.dv||{},{payant:o.on!==false,payantMontant:o.on!==false&&o.montant?String(o.montant):""});garderDevis();x.says=[P.tr("C’est noté sur le devis.")];break;
    case "acompte":if(!cur){pasDevis();break;}x.qMod=true;q.acompte=+o.pct||0;garderDevis();x.says=[P.tr("C’est noté sur le devis.")];break;
    case "sanstva":if(!cur){pasDevis();break;}x.qMod=true;q.franchise=o.on!==false;garderDevis();x.says=[P.tr("C’est noté sur le devis.")+" "+P.tr("Total : {0} TTC.",[P.B.eurFr(totals(q).ttc)])];break;
    case "autoliq":if(!cur){pasDevis();break;}x.qMod=true;q.dv=Object.assign({},q.dv||{},{autoliq:o.on!==false});garderDevis();x.says=[P.tr("C’est noté sur le devis.")];break;
    case "debut":if(!cur){pasDevis();break;}if(!o.date&&!o.duree){x.says=[P.tr("Dis-moi la date, par exemple « début des travaux lundi pour 3 jours ».")];break;}
      x.qMod=true;var dv=Object.assign({},q.dv||{});if(o.date)dv.debut=o.date;if(o.duree)dv.duree=o.duree.n+" "+(o.duree.u==="semaine"?(o.duree.n>1?"semaines":"semaine"):o.duree.u==="mois"?"mois":(o.duree.n>1?"jours":"jour"));q.dv=dv;garderDevis();x.says=[P.tr("C’est noté sur le devis.")];break;
    case "valider":case "lien":if(!cur||!q.lines.length){pasDevis();break;}x.apres=function(){if(typeof goSign==="function")goSign();};break;
    case "modele":x.apres=function(){if(typeof dvOpen==="function")dvOpen();};break;
    case "avoir":{var kc2=cle(o.client||(cur&&cur.client)||""),F=(db.invoices||[]).filter(function(f){return f.num&&f.kind!=="avoir"&&(!kc2||cle(f.client&&f.client.nom)===kc2);}).sort(function(f,g){return String(g.date).localeCompare(String(f.date));})[0];
      if(!F){x.says=[P.tr("Je ne trouve pas de facture émise{0}.",[o.client?P.tr(" pour {0}",[o.client]):""])];break;}
      x.apres=function(){if(typeof faShow==="function")faShow(F.id);};x.bouton={act:"avoir:"+F.id,label:r.explain};x.explain=F.num+" · "+(F.client&&F.client.nom||"");break;}
    case "enc_export":ecran("enc");x.bouton={act:"encaissements",label:r.explain};x.explain="";break;
    case "encaissements":ecran("enc");break;
    case "histo":ecran("histo");break;
    case "client_nouveau":x.apres=function(){if(typeof cliEdit==="function"){go("clif");cliEdit();}};break;
    case "contacts":x.apres=function(){if(typeof cliEdit==="function"){go("clif");cliEdit();}};x.bouton={act:"contacts",label:r.explain};x.explain="";break;
    case "importer":ecran("imp");if(o.photo){x.bouton={act:"photo",label:r.explain};x.explain="";}break;
    case "ics":ecran("agenda",null,function(){if(typeof agIcs==="function")agIcs();});break;
    case "planning":ecran("agenda",null,function(){if(typeof agPage==="function")agPage(o.vue||"sem");});break;
    case "presents":ecran("pt",null,function(){ptPage("go");});break;
    case "journal":ecran("pt",null,function(){ptPage("j");});break;
    case "oubli":ecran("pt","#ptBody>.card:last-of-type",function(){ptPage("j",true);});break;
    case "chantiers":ecran("pt",null,function(){ptPage("set");});break;
    case "plan":ecran("plan");break;
    case "m3d":x.apres=function(){if(typeof m3dOpen==="function")m3dOpen();};break;
    case "aide":x.explain="";x.says=[P.tr("Je sais faire ce que fait casô : devis, factures et avoirs, clients et fournisseurs, prix, planning, pointage, plan et maquette 3D, encaissements, équipe et réglages. Dis-le comme tu veux, même avec des fautes.")];break;
  }return x;}
/* les autres demandes du moteur qui ont un écran ou une action dans casô */
function autreFaire(l,o,r,t,avant){var x=null;
  switch(l){
    case "devis.nouveau":x={apres:function(){if(typeof newQuote==="function"){newQuote();CHAT.qid=q.id;}},says:[],explain:r.explain};break;
    case "devis.dupliquer":{var ks=cle(o.source||""),src=(db.quotes||[]).filter(function(y){return y.lines&&y.lines.length&&(!ks||cle(y.client)===ks);}).sort(function(y,z){return String(z.date).localeCompare(String(y.date));})[0]||(q&&q.lines.length?q:null);
      if(!src){x={says:[P.tr("Je ne trouve pas de devis à dupliquer.")],explain:r.explain};break;}
      var sid=src.id,pour=o.client||null;if(src===q)garderDevis();x={says:[],explain:r.explain,apres:function(){if(typeof dupQ==="function"){dupQ(sid);if(pour){q.client=pour;var cx=(db.clients||[]).filter(function(c){return cle(c.nom)===cle(pour);})[0];if(cx){q.tel=cx.tel||"";q.adr=cx.adr||"";}fillForm();}CHAT.qid=q.id;}}};break;}
    case "clients.supprimer":{var kd=cle(o.nom||""),cd=(db.clients||[]).filter(function(c){return cle(c.nom)===kd;})[0];
      if(!cd){x={says:[P.tr("Je ne connais pas de client {0}.",[o.nom||""])],explain:""};break;}
      db.clients=db.clients.filter(function(c){return c!==cd;});save();x={says:[P.tr("Fiche de {0} supprimée.",[cd.nom])],explain:"",u:{cDel:JSON.stringify(cd)}};break;}
    case "fournisseurs.ajouter":if(o.nom&&typeof upsert==="function"){var ex=(db.suppliers||[]).some(function(s){return cle(s.nom)===cle(o.nom);});var fx=upsert("suppliers",{nom:nomTape(t,o.nom)}).x;["tel","email","adresse"].forEach(function(k){if(o[k])fx[k==="adresse"?"adr":k]=o[k];});save();
      x={says:[ex?P.tr("{0} est déjà dans tes fournisseurs.",[fx.nom]):P.tr("Fournisseur enregistré : {0}.",[fx.nom])],explain:"",u:ex?null:{sAdd:fx.id}};}break;
    case "services.supprimer":{var kn=cle(o.nom||""),pd=(db.prices||[]).filter(function(p){var y=cle(p.nom);return y===kn||y.indexOf(kn)===0;});
      if(!pd.length){x={says:[P.tr("Je ne trouve pas « {0} » dans tes services.",[o.nom])],explain:""};break;}
      db.prices=db.prices.filter(function(p){return pd.indexOf(p)<0;});save();x={says:[P.tr("Service supprimé : {0}.",[pd.map(function(p){return p.nom;}).join(", ")])],explain:"",u:{pDel:JSON.stringify(pd)}};break;}
    case "fichiers.importer":x={says:[],explain:r.explain};if(o.quoi==="prix")ecran("prix",null,function(){if(typeof prPage==="function")prPage("io");});else if(o.quoi==="clients")ecran("cli");else ecran("imp");break;
    case "planning.annuler":{var gone=avant.rdv.filter(function(id){return !P.B.S.rdv.some(function(z){return z.id===id;});});
      var evs=(db.events||[]).filter(function(ev){return gone.indexOf(ev.id)>=0;});if(evs.length){db.events=db.events.filter(function(ev){return evs.indexOf(ev)<0;});save();x={says:r.says,explain:r.explain,u:{eDel:JSON.stringify(evs)}};}break;}
    case "entreprise.ouvrir":ecran("cpt","#eNom");x={says:[],explain:P.B.describe([{m:"app",a:"entreprise",args:{}}])};break;
    case "entreprise.maj":{var map={nom:"nom",siret:"siret",tva_intra:"tvai",adresse:"adr",tel:"tel",email:"email",conditions:"delai",validite:"valid",decennale:"assur"},pr0=JSON.stringify(db.prof||{}),ch=[];db.prof=Object.assign({},db.prof||{});
      Object.keys(o).forEach(function(k){if(map[k]&&o[k]!=null&&o[k]!==""){db.prof[map[k]]=String(o[k]);ch.push(o[k]);}});if(ch.length){db.profAt=Date.now();save();x={says:[P.tr("C’est enregistré : {0}.",[ch.join(", ")])],explain:r.explain,u:{prof:pr0}};}break;}
    case "signature.ouvrir":if(o.qui==="client"){if(!q||!q.lines.length)x={says:[P.tr("Il n’y a pas encore de devis.")],explain:""};else x={says:[],explain:r.explain,apres:function(){goSign();}};}else{ecran("sigp");x={says:[],explain:P.B.describe([{m:"app",a:"signature",args:{}}])};}break;
    case "dictee.debut":x={says:[],explain:"",bouton:{act:"dictee",label:P.B.describe([{m:"app",a:"dictee",args:{}}])}};break;
    case "pointage.nfc":ecran("pt",null,function(){ptPage("set");});x={says:[],explain:P.B.describe([{m:"app",a:"chantiers",args:{}}])};break;
    case "bibliotheque.ouvrir":x=appFaire("aide",{},r,t);break;
    case "devis.pdf":case "factures.pdf":x={says:r.says,explain:r.explain};break;
    case "pointage.entree":case "pointage.sortie":{var pp=quiPointe(),so=l==="pointage.sortie",cid=pp?chantierDe(pp.id,so):null;
      if(!pp||!cid||typeof punch!=="function"){ecran("pt",null,function(){ptPage("go");});x={says:[],explain:P.B.describe([{m:"pointage",a:"ouvrir",args:{}}])};break;}
      {var le=(db.pts||[]).filter(function(e2){return e2.p===pp.id;}).sort(function(e2,e3){return e3.ts-e2.ts;})[0],dedans=le&&le.t==="in"&&Date.now()-le.ts<16*3600000;
        if(!so&&dedans){var h0=new Date(le.ts);x={says:[P.tr("Tu es déjà pointé depuis {0}.",[(h0.getHours()<10?"0":"")+h0.getHours()+":"+(h0.getMinutes()<10?"0":"")+h0.getMinutes()])],explain:""};break;}
        if(so&&!dedans){x={says:[P.tr("Tu n’es pas pointé.")],explain:""};break;}}
      var pr=punch(cid,pp.id);if(pr.dup){x={says:[P.tr("Déjà pris en compte.")],explain:""};break;}
      var ev=pr.ev,ch2=(db.chantiers||[]).filter(function(c){return c.id===ev.c;})[0],hh=new Date(ev.ts),z=function(n){return (n<10?"0":"")+n;};
      x={says:[P.tr(ev.t==="in"?"Entrée pointée à {0} · {1}":"Sortie pointée à {0} · {1}",[z(hh.getHours())+":"+z(hh.getMinutes()),ch2?ch2.nom:""])],explain:"",u:{ptAdd:pr.evs.map(function(e2){return e2.id;})}};
      if(typeof renderPt==="function")try{renderPt();}catch(y){}break;}
  }return x;}
/* « qui me doit de l'argent ? », « combien me doit Dupont ? » : d'après les factures émises dans casô et leurs paiements */
function du(a){if(typeof faDue!=="function")return null;var B=P.B,F=(db.invoices||[]).filter(function(f){return f.num&&f.kind!=="avoir";});
  if(a.client){var k=cle(a.client),c=(db.clients||[]).filter(function(x){return cle(x.nom)===k;})[0],nom=c?c.nom:String(a.client).charAt(0).toUpperCase()+String(a.client).slice(1),G=F.filter(function(f){return cle(f.client&&f.client.nom)===k;});
    if(!G.length)return i18nT("Aucune facture à encaisser pour")+" "+nom+".";var tot=0,re=0,pd=0;G.forEach(function(f){tot+=faTot(f).net;re+=faDue(f);pd+=faPaid(f);});
    if(re<=0.009)return B.tr("{0} a tout payé ({1} TTC).",[nom,B.eur(tot)]);
    return B.tr("{0} te doit encore {1} sur {2} TTC{3}{4}.",[nom,B.eur(re),B.eur(tot),(pd>0.009?B.tr(" (déjà payé : {0})",[B.eur(pd)]):""),""]);}
  var by={};F.forEach(function(f){var x=faDue(f);if(x>0.009){var n=f.client&&f.client.nom||"?";by[n]=(by[n]||0)+x;}});
  var L=Object.keys(by).map(function(n){return [n,by[n]];}).sort(function(x,y){return y[1]-x[1];});if(!L.length)return B.tr("Personne ne te doit d’argent.");
  var t=L.reduce(function(s,x){return s+x[1];},0);
  return (L.length===1?B.tr("1 client te doit "):B.tr("{0} clients te doivent ",[L.length]))+B.eur(t)+" : "+L.map(function(x){return x[0]+" "+B.eur(x[1]);}).join(", ")+".";}
/* dernière maquette 3D enregistrée dans casô (bouton « enregistrer » du module 3D) */
function dernMaq(){var L=(typeof db!=="undefined"&&db.maq3d||[]).filter(function(x){return x&&x.d&&x.d.projet&&x.d.projet.walls;});L.sort(function(a,b){return (b.at||0)-(a.at||0);});return L.length?L[0].d.projet:null;}
function vers3D(t,mq){if(typeof m3dOpen!=="function")return;try{m3dOpen();}catch(e){return;}var n=0,charge=!mq;(function essai(){var f=document.querySelector("#m3d iframe");var d=null,w=null;try{d=f&&f.contentDocument;w=f&&f.contentWindow;}catch(e){}
  if(!charge&&w&&w.casoModule){try{charge=w.casoModule.load(JSON.parse(JSON.stringify(mq)))!==false;}catch(e){charge=true;}}
  var i=d&&d.getElementById("chat-in"),g=d&&d.getElementById("chat-go");if(charge&&i&&g){i.value=t;g.click();return;}if(++n<40)setTimeout(essai,250);})();}
/* phrase du chat 3D non comprise là-bas : est-ce une demande pour le chat Pro (autre chose que la maquette) ? */
P.pourPro=function(t){if(!P.ready)return false;try{P.B.setLangue((typeof I18N!=="undefined"&&I18N.lang)||"fr");var c=P.B.parse(t);return libelles(c).some(function(l){return !/^scene\.|^metre\.|^bibliotheque\.|^sys\.politesse$/.test(l);});}catch(e){return false;}};
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
P.verifier=verifier;
function confirmer(nom){return new Promise(function(res){var f=document.createElement("div"),b=document.createElement("div"),t=document.createElement("p"),k=document.createElement("button");
  f.className="pc-sheet";b.className="pc-box";t.textContent=P.tr("Envoyer le devis à {0} ?",[nom||""]);t.setAttribute("data-noi18n","");k.type="button";k.className="pc-ic pc-env";k.innerHTML=IC.envoi;k.setAttribute("aria-label",P.tr("Envoyer au client"));
  var fin=function(v){f.remove();res(v);};k.addEventListener("click",function(ev){ev.stopPropagation();fin("ok");});f.addEventListener("click",function(ev){if(ev.target===f)fin("refus");});
  b.appendChild(t);b.appendChild(k);f.appendChild(b);document.body.appendChild(f);k.focus();});}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",charger);else charger();
})();

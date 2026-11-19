/* casô — module AUTH (serveur) : connexion directe avec Google ou Microsoft (Outlook, Hotmail, Microsoft 365), ou par e-mail et mot de passe.
   - aucun écran en plus, aucun mot de passe : l'appli envoie l'usager chez son fournisseur, qui le renvoie connecté
   - aucune dépendance (Node 18 ou plus) ; OpenID Connect, code d'autorisation + PKCE
   - rien de secret en clair : états, tickets et sessions sont hachés (SHA-256) ; le jeton ne passe jamais dans une adresse
   - fichier à part : comptes.json (les comptes d'équipe patron/chef/ouvrier de server.js ne changent pas)
   Variables : GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET,
               PUBLIC_URL (adresse du serveur, pour le retour du fournisseur), APP_ORIGINS (adresses de l'appli autorisées, séparées par des virgules).
   Chez le fournisseur, l'adresse de retour à déclarer est : PUBLIC_URL + /api/auth/retour/google  (ou /microsoft).
   Usage : const auth=require('./auth.js').creer({dir,hosted}); puis auth.traiter(req,res,{url,ip,send,readBody}). */
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const PLAN=require('../lib/plan.js');

const ETAT_MIN=10,TICKET_MIN=2,SESSION_JOURS=90,ESSAI_JOURS=30;
const sha=s=>crypto.createHash('sha256').update(String(s)).digest('hex');
const b64u=b=>Buffer.from(b).toString('base64url');
const cut=(v,n)=>String(v==null?'':v).slice(0,n);

const FOURNISSEURS={
 google:{nom:'Google',auth:'https://accounts.google.com/o/oauth2/v2/auth',jeton:'https://oauth2.googleapis.com/token',scope:'openid email profile',
  id:()=>process.env.GOOGLE_CLIENT_ID,secret:()=>process.env.GOOGLE_CLIENT_SECRET,
  iss:c=>c.iss==='https://accounts.google.com'||c.iss==='accounts.google.com',
  email:c=>c.email_verified===true||c.email_verified==='true'?c.email:''},
 microsoft:{nom:'Microsoft',auth:'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',jeton:'https://login.microsoftonline.com/common/oauth2/v2.0/token',scope:'openid email profile',
  id:()=>process.env.MICROSOFT_CLIENT_ID,secret:()=>process.env.MICROSOFT_CLIENT_SECRET,
  iss:c=>/^[0-9a-f-]{36}$/.test(c.tid||'')&&c.iss==='https://login.microsoftonline.com/'+c.tid+'/v2.0',
  /* chez Microsoft l'adresse n'est pas garantie vérifiée : elle sert d'affichage, jamais d'identifiant */
  email:c=>c.email||c.preferred_username||''}};

/* SIRET : 14 chiffres + clé de Luhn (La Poste, SIREN 356000000 : somme des chiffres multiple de 5). Contrôle de forme, pas d'existence. */
function siretOk(s){
 s=String(s||'').replace(/[\s.]/g,'');
 if(!/^\d{14}$/.test(s)||/^0{14}$/.test(s))return false;
 if(s.slice(0,9)==='356000000'){let t=0;for(const c of s)t+=+c;if(t%5===0)return true}
 let t=0;for(let i=0;i<14;i++){let d=+s[13-i];if(i%2){d*=2;if(d>9)d-=9}t+=d}
 return t%10===0}
const normSiret=s=>String(s||'').replace(/[\s.]/g,'');
const MAIL_OK=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* preuve du mot de passe (compte e-mail) : scrypt + sel ; comparaison à temps constant */
function mdpHache(preuve){const sel=crypto.randomBytes(16).toString('hex');return{sel,h:crypto.scryptSync(preuve,sel,32).toString('hex')}}
function mdpBon(m,preuve){const a=Buffer.from(m.h,'hex'),b=crypto.scryptSync(preuve,m.sel,32);return a.length===b.length&&crypto.timingSafeEqual(a,b)}

/* Offre du compte tant que les abonnements Stripe ne sont pas branchés : essai de 30 jours pour l'artisan, gratuit pour le bricoleur. */
function offre(c,now){
 now=now||Date.now();
 if(c.abo&&c.abo.offre&&(!c.abo.fin||c.abo.fin>now))return c.abo.offre;
 if(c.mode==='artisan'&&c.essaiFin&&now<c.essaiFin)return 'artisan_curieux';
 if(c.plan&&c.plan.modules&&c.plan.modules.length)return 'plan';/* « On construit le plan » : modules choisis */
 if(c.mode==='artisan')return 'artisan_fin_essai';
 return c.mode==='bricoleur'?'bricoleur':null}

/* Modules ouverts pour ce compte. Pendant l'essai : tous les modules Artisan. Ensuite : ceux de l'abonnement payé (c.abo.modules, posé par Stripe).
   Tant que le paiement n'est pas branché (paiement=false), les modules choisis sont ouverts tels quels : mode test, rien n'est facturé. */
function modulesDe(c,now,paiement){
 now=now||Date.now();
 if(c.mode==='artisan'&&c.essaiFin&&now<c.essaiFin)return PLAN.nettoyer('artisan',PLAN.catalogue('artisan').modules.map(m=>m.id));
 if(c.abo&&c.abo.modules&&(!c.abo.fin||c.abo.fin>now))return PLAN.nettoyer(c.mode,c.abo.modules);
 if(!paiement&&c.plan)return PLAN.nettoyer(c.mode,c.plan.modules);
 return[]}

function creer(opts){
 opts=opts||{};
 const DIR=opts.dir||path.join(__dirname,'donnees');
 fs.mkdirSync(DIR,{recursive:true});
 const FILE=path.join(DIR,'comptes.json');
 const now=opts.maintenant||(()=>Date.now());
 const HOSTED=!!opts.hosted;
 const F=opts.fournisseurs||FOURNISSEURS;
 const appelJeton=opts.fetch||((u,o)=>fetch(u,o));
 const publicUrl=()=>String(opts.publicUrl||process.env.PUBLIC_URL||'').replace(/\/+$/,'');
 let d={n:0,comptes:{},sessions:{},essais:{}};
 {let raw=null;try{raw=fs.readFileSync(FILE,'utf8')}catch(e){if(e.code!=='ENOENT')throw e}
  if(raw!==null){let v;try{v=JSON.parse(raw)}catch(e){const bad=FILE+'.illisible-'+Date.now();try{fs.renameSync(FILE,bad)}catch(_){}
    throw new Error('comptes.json est illisible. Il a été mis de côté ('+path.basename(bad)+'), rien n\'a été écrasé.')}
   d=Object.assign(d,v)}}
 for(const k of ['comptes','sessions','essais'])d[k]=Object.assign(Object.create(null),d[k]||{});
 function persist(){const t=FILE+'.tmp';fs.writeFileSync(t,JSON.stringify(d));fs.renameSync(t,FILE)}

 /* états (aller chez le fournisseur) et tickets (retour dans l'appli) : en mémoire seulement */
 const etats=new Map(),tickets=new Map(),freq=new Map();
 function menage(){const t=now();
  for(const [k,v] of etats)if(v.exp<t)etats.delete(k);
  for(const [k,v] of tickets)if(v.exp<t)tickets.delete(k);
  for(const [k,v] of freq)if(v.at+3600e3<t)freq.delete(k);
  let ch=false;for(const k of Object.keys(d.sessions))if(d.sessions[k].exp<t){delete d.sessions[k];ch=true}
  if(ch)persist()}
 function trop(cle,n){const t=now(),f=freq.get(cle);
  if(!f||f.at+3600e3<t){freq.set(cle,{n:1,at:t});return false}
  f.n++;return f.n>n}

 /* adresses de l'appli vers lesquelles on accepte de revenir */
 function origines(req){
  const l=String(opts.appOrigins||process.env.APP_ORIGINS||'').split(',').map(x=>x.trim().replace(/\/+$/,'')).filter(Boolean);
  if(publicUrl())try{l.push(new URL(publicUrl()).origin)}catch(e){}
  if(!HOSTED&&req.headers.host)l.push('http://'+req.headers.host);
  return l}
 function retourOk(u,req){let x;try{x=new URL(u)}catch(e){return null}
  if(!origines(req).includes(x.origin))return null;
  x.hash='';x.search='';return x.toString()}
 function baseServeur(req){return publicUrl()||(!HOSTED&&req.headers.host?'http://'+req.headers.host:'')}
 const dispo=k=>!!(F[k]&&F[k].id()&&F[k].secret());
 const PAIEMENT=!!(opts.paiement!==undefined?opts.paiement:process.env.CASO_PAIEMENT==='1');

 function pub(c){return{id:c.id,via:c.via,email:c.email||'',prenom:c.prenom||'',mode:c.mode||null,nom:c.nom||'',siret:c.siret||'',creeLe:c.creeLe,
  essaiFin:c.essaiFin||null,offre:offre(c,now()),
  modules:modulesDe(c,now(),PAIEMENT),plan:PLAN.calcul(c.mode,c.plan&&c.plan.modules,!!c.fondateur)}}
 function session(c){const j=crypto.randomBytes(32).toString('hex');
  d.sessions[sha(j)]={id:c.id,exp:now()+SESSION_JOURS*864e5,vu:now()};persist();
  return{jeton:j,compte:pub(c)}}
 function jetonDe(req){const m=/^Bearer ([a-f0-9]{64})$/.exec(String(req.headers.authorization||''));return m?m[1]:null}
 /* compte de la requête (ou null) ; la session est prolongée au plus une fois par jour */
 function compte(req){const j=typeof req==='string'?req:jetonDe(req);if(!j)return null;
  const s=d.sessions[sha(j)];if(!s||s.exp<now())return null;
  const c=d.comptes[s.id];if(!c)return null;
  if(now()-s.vu>864e5){s.vu=now();s.exp=now()+SESSION_JOURS*864e5;persist()}
  return c}
 /* l'essai de 30 jours n'est donné qu'une fois par personne et par SIRET (empreintes gardées après suppression du compte) */
 function debutEssai(c){const t=now(),k1='p'+sha(c.cle),k2='s'+sha(c.siret);
  const deja=Math.max(d.essais[k1]||0,d.essais[k2]||0);
  c.essaiFin=deja||t+ESSAI_JOURS*864e5;
  d.essais[k1]=c.essaiFin;d.essais[k2]=c.essaiFin}
 function parCle(cle){for(const k of Object.keys(d.comptes))if(d.comptes[k].cle===cle)return d.comptes[k];return null}
 function biscuit(req){const m=/(?:^|;\s*)caso_oauth=([a-f0-9]{32})/.exec(String(req.headers.cookie||''));return m?m[1]:''}
 function rediriger(res,vers,cookie){const h={location:vers,'cache-control':'no-store','referrer-policy':'no-referrer'};
  if(cookie!==undefined)h['set-cookie']='caso_oauth='+cookie+'; Path=/api/auth/; HttpOnly; SameSite=Lax'+(HOSTED?'; Secure':'')+(cookie?'; Max-Age='+ETAT_MIN*60:'; Max-Age=0');
  res.writeHead(302,h);res.end()}

 /* lit le jeton d'identité reçu directement du fournisseur (liaison TLS + secret du client : la signature n'a pas à être revérifiée, OpenID Connect Core 3.1.3.7) */
 function identite(k,idToken,nonce){
  const p=String(idToken||'').split('.');if(p.length!==3)return null;
  let c;try{c=JSON.parse(Buffer.from(p[1],'base64url').toString())}catch(e){return null}
  const f=F[k],aud=Array.isArray(c.aud)?c.aud:[c.aud];
  if(!c||!f.iss(c)||!aud.includes(f.id())||(aud.length>1&&c.azp!==f.id()))return null;
  if(typeof c.exp!=='number'||c.exp*1000<now()-60e3)return null;
  if(!c.nonce||c.nonce!==nonce||!c.sub)return null;
  return{cle:k+':'+cut(c.sub,200),email:cut(f.email(c),120).toLowerCase(),prenom:cut(c.given_name||c.name||'',60).trim()}}

 async function traiter(req,res,x){
  const url=x.url,send=x.send,ip=x.ip||'?',POST=req.method==='POST',GET=req.method==='GET';
  if(!url.startsWith('/api/auth/'))return false;
  menage();
  const q=new URLSearchParams(String(req.url||'').split('?')[1]||'');
  let m;
  try{
   /* fournisseurs configurés sur ce serveur */
   if(GET&&url==='/api/auth/fournisseurs')return send(res,200,{fournisseurs:Object.keys(F).filter(dispo)}),true;

   /* 1. l'appli envoie l'usager ici ; on le renvoie chez son fournisseur */
   if(GET&&(m=/^\/api\/auth\/via\/([a-z]+)$/.exec(url))){
    const k=m[1],retour=retourOk(q.get('retour')||'',req),base=baseServeur(req);
    if(!retour)return send(res,400,{error:'Adresse de retour refusée.'}),true;
    if(!Object.prototype.hasOwnProperty.call(F,k)||!dispo(k)||!base)return rediriger(res,retour+'#auth_erreur=indisponible'),true;
    if(trop('ip:'+ip,30))return rediriger(res,retour+'#auth_erreur=trop'),true;
    const etat=crypto.randomBytes(24).toString('hex'),verif=b64u(crypto.randomBytes(32)),nonce=crypto.randomBytes(16).toString('hex'),lien=crypto.randomBytes(16).toString('hex');
    etats.set(sha(etat),{k,verif,nonce,retour,lien:sha(lien),exp:now()+ETAT_MIN*60e3});
    const p=new URLSearchParams({client_id:F[k].id(),redirect_uri:base+'/api/auth/retour/'+k,response_type:'code',scope:F[k].scope,state:etat,nonce,
     code_challenge:b64u(crypto.createHash('sha256').update(verif).digest()),code_challenge_method:'S256',prompt:'select_account'});
    return rediriger(res,F[k].auth+'?'+p,lien),true}

   /* 2. retour du fournisseur : on échange le code, on trouve ou on crée le compte, on revient dans l'appli avec un ticket à usage unique */
   if(GET&&(m=/^\/api\/auth\/retour\/([a-z]+)$/.exec(url))){
    const cleEtat=sha(q.get('state')||''),e=etats.get(cleEtat);
    if(!e||e.exp<now()||e.k!==m[1])return send(res,400,{error:'Connexion expirée. Reviens dans casô et recommence.'}),true;
    etats.delete(cleEtat);
    const ko=r=>(rediriger(res,e.retour+'#auth_erreur='+r,''),true);
    if(!biscuit(req)||sha(biscuit(req))!==e.lien)return ko('navigateur');/* le retour doit arriver dans le navigateur qui est parti */
    if(q.get('error')||!q.get('code'))return ko(q.get('error')==='access_denied'?'annule':'refus');
    let r;try{r=await appelJeton(F[e.k].jeton,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded',accept:'application/json'},
      body:new URLSearchParams({grant_type:'authorization_code',code:q.get('code'),redirect_uri:baseServeur(req)+'/api/auth/retour/'+e.k,
       client_id:F[e.k].id(),client_secret:F[e.k].secret(),code_verifier:e.verif}).toString()})}catch(_){return ko('reseau')}
    let j=null;try{j=await r.json()}catch(_){}
    const qui=r.ok&&j?identite(e.k,j.id_token,e.nonce):null;
    if(!qui)return ko('refus');
    let c=parCle(qui.cle);
    if(!c){c={id:'c'+(++d.n)+crypto.randomBytes(4).toString('hex'),cle:qui.cle,via:e.k,email:qui.email,prenom:qui.prenom,mode:null,creeLe:now()};d.comptes[c.id]=c;persist()}
    else if(qui.email&&qui.email!==c.email){c.email=qui.email;persist()}
    const t=crypto.randomBytes(24).toString('hex');
    tickets.set(sha(t),{id:c.id,exp:now()+TICKET_MIN*60e3});
    return rediriger(res,e.retour+'#auth='+t,''),true}

   /* 3. l'appli échange son ticket contre une session */
   if(POST&&url==='/api/auth/session'){
    if(trop('ips:'+ip,60))return send(res,429,{error:'Trop d\'essais. Réessaie dans une heure.'}),true;
    const b=await x.readBody(req),h=sha(String(b.ticket||'')),t=tickets.get(h);
    tickets.delete(h);
    if(!t||t.exp<now()||!d.comptes[t.id])return send(res,401,{error:'Connexion expirée, recommence.'}),true;
    return send(res,200,session(d.comptes[t.id])),true}

   /* 4. compte par e-mail : même compte, même essai, même plan que Google / Microsoft.
      L'appli n'envoie jamais le mot de passe : seulement une preuve dérivée (PBKDF2, différente de la clé du coffre),
      que le serveur hache encore (scrypt, sel propre au compte). */
   if(POST&&(url==='/api/auth/mail/creer'||url==='/api/auth/mail/entrer')){
    const creer=url.endsWith('/creer');
    if(trop('mail-ip:'+ip,creer?10:30))return send(res,429,{error:'Trop d\'essais. Réessaie dans une heure.'}),true;
    const b=await x.readBody(req),email=cut(b.email,120).trim().toLowerCase(),preuve=String(b.preuve||'');
    if(!MAIL_OK.test(email))return send(res,400,{error:'E-mail invalide.'}),true;
    if(!/^[a-f0-9]{64}$/.test(preuve))return send(res,400,{error:'Demande invalide.'}),true;
    if(trop('mail:'+sha(email),creer?5:10))return send(res,429,{error:'Trop d\'essais. Réessaie dans une heure.'}),true;
    let c=parCle('mail:'+email);
    if(creer){
     if(c)return send(res,409,{error:'Un compte existe déjà avec cet e-mail. Connecte-toi.'}),true;
     c={id:'c'+(++d.n)+crypto.randomBytes(4).toString('hex'),cle:'mail:'+email,via:'mail',email,prenom:cut(b.prenom,60).trim(),mode:null,creeLe:now(),mdp:mdpHache(preuve)};
     d.comptes[c.id]=c;persist();return send(res,200,session(c)),true}
    if(!c)return send(res,404,{error:'Aucun compte casô avec cet e-mail.'}),true;
    if(!c.mdp||!mdpBon(c.mdp,preuve))return send(res,401,{error:'E-mail ou mot de passe incorrect.'}),true;
    return send(res,200,session(c)),true}

   /* --- à partir d'ici : connecté --- */
   const c=compte(req);
   if(!c)return send(res,401,{error:'Non connecté.'}),true;
   if(GET&&url==='/api/auth/moi')return send(res,200,{compte:pub(c)}),true;

   /* l'appli transmet ce qu'elle sait déjà (mode du compte, « Mon entreprise ») : aucune saisie en plus.
      Artisan : SIRET valide exigé, l'essai démarre. Un compte Artisan ne redevient pas Bricoleur. */
   if(POST&&url==='/api/auth/profil'){
    const b=await x.readBody(req);
    if(b.mode==='artisan'){
     const nom=cut(b.nom,120).trim(),siret=normSiret(b.siret);
     if(!siretOk(siret))return send(res,400,{error:'SIRET invalide (14 chiffres).',compte:pub(c)}),true;
     if(c.mode==='artisan'&&c.siret!==siret)debutEssaiSiret(c,siret);
     c.nom=nom;c.siret=siret;
     if(c.mode!=='artisan'){c.mode='artisan';debutEssai(c)}}
    else if(b.mode==='bricoleur'){if(!c.mode)c.mode='bricoleur'}
    else return send(res,400,{error:'Mode inconnu.'}),true;
    persist();return send(res,200,{compte:pub(c)}),true}

   /* « On construit le plan » : l'usager choisit ses modules ; le total (plafonné) est calculé ici, jamais par l'appli */
   if(POST&&url==='/api/auth/plan'){
    const b=await x.readBody(req);
    if(!c.mode)return send(res,400,{error:'Choisis d\'abord ton mode.'}),true;
    if(!Array.isArray(b.modules)||b.modules.length>50)return send(res,400,{error:'Plan invalide.'}),true;
    c.plan={modules:PLAN.nettoyer(c.mode,b.modules),le:now()};
    persist();return send(res,200,{compte:pub(c)}),true}

   /* mot de passe changé dans l'appli (compte e-mail) : la nouvelle preuve remplace l'ancienne */
   if(POST&&url==='/api/auth/mail/mdp'){
    const b=await x.readBody(req),preuve=String(b.preuve||'');
    if(c.via!=='mail')return send(res,400,{error:'Ce compte se connecte avec '+(c.via==='google'?'Google':'Microsoft')+'.'}),true;
    if(!/^[a-f0-9]{64}$/.test(preuve))return send(res,400,{error:'Demande invalide.'}),true;
    c.mdp=mdpHache(preuve);persist();return send(res,200,{ok:true}),true}

   if(POST&&url==='/api/auth/sortir'){delete d.sessions[sha(jetonDe(req))];persist();return send(res,200,{ok:true}),true}

   if(POST&&url==='/api/auth/supprimer'){
    const b=await x.readBody(req);if(b.confirm!=='SUPPRIMER')return send(res,400,{error:'Confirmation manquante.'}),true;
    delete d.comptes[c.id];
    for(const k of Object.keys(d.sessions))if(d.sessions[k].id===c.id)delete d.sessions[k];
    persist();return send(res,200,{ok:true}),true}

   return send(res,404,{error:'introuvable'}),true;
  }catch(e){
   if(e&&e.pub)return send(res,e.code||400,{error:e.message}),true;
   throw e}}
 /* changement de SIRET en cours d'essai : le nouveau SIRET hérite de la même date de fin (pas de nouvel essai) */
 function debutEssaiSiret(c,siret){const k='s'+sha(siret);const fin=Math.max(d.essais[k]||0,c.essaiFin||0);if(fin){d.essais[k]=fin;c.essaiFin=Math.min(c.essaiFin||fin,fin)}}

 /* résumé pour le propriétaire : des nombres seulement, aucun nom ni adresse */
 function resume(){const t=now(),J=864e5,C=Object.keys(d.comptes).map(k=>d.comptes[k]),vu={};
  for(const k of Object.keys(d.sessions)){const x=d.sessions[k];if(x.exp>t)vu[x.id]=Math.max(vu[x.id]||0,x.vu||0)}
  const offres={},parJour=[];for(const c of C){const o=offre(c,t)||'sans_choix';offres[o]=(offres[o]||0)+1}
  for(let i=13;i>=0;i--){const j=new Date(t-i*J).toISOString().slice(0,10);parJour.push({j,n:C.filter(c=>c.creeLe&&new Date(c.creeLe).toISOString().slice(0,10)===j).length})}
  return {total:C.length,artisan:C.filter(c=>c.mode==='artisan').length,bricoleur:C.filter(c=>c.mode==='bricoleur').length,sansChoix:C.filter(c=>!c.mode).length,
   google:C.filter(c=>c.via==='google').length,microsoft:C.filter(c=>c.via==='microsoft').length,mail:C.filter(c=>c.via==='mail').length,
   nouveaux7:C.filter(c=>c.creeLe&&t-c.creeLe<7*J).length,nouveaux30:C.filter(c=>c.creeLe&&t-c.creeLe<30*J).length,
   actifs7:C.filter(c=>vu[c.id]&&t-vu[c.id]<7*J).length,actifs30:C.filter(c=>vu[c.id]&&t-vu[c.id]<30*J).length,
   essaisFin7:C.filter(c=>c.mode==='artisan'&&!(c.abo&&c.abo.offre)&&c.essaiFin&&c.essaiFin>t&&c.essaiFin-t<7*J).length,offres,parJour}}

 /* l'espace d'équipe de l'entreprise de ce compte (serveur/server.js, /api/espace) */
 function lierEspace(id,esp){const c=d.comptes[id];if(!c)return false;c.espace=esp;persist();return true}
 return{traiter,compte,pub,offre:c=>offre(c,now()),resume,lierEspace,_d:()=>d};
}
module.exports={creer,siretOk,offre,modulesDe,FOURNISSEURS,ESSAI_JOURS,SESSION_JOURS};

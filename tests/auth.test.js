/* Tests du module AUTH (connexion directe Google / Microsoft, sans écran).
   Lancer : node tests/auth.test.js   (aucune dépendance, aucun accès à Internet : le fournisseur est simulé sur ce poste) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path');
const {createServer}=require('../serveur/server.js');
const authLib=require('../serveur/auth.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-auth-'));
const J=864e5,SIRET='73282932000074',SIRET2='55208131766522',APP='https://app.exemple.fr',TID='9188040d-6c67-4c5b-b2d0-6fdc7b7f7f7f';
let T=Date.UTC(2026,10,16,12),ipN=0;

/* faux fournisseur : /token rend un jeton d'identité fabriqué à partir de « qui » */
let qui={},vuToken=null,panne=false;
const jwt=c=>'e30.'+Buffer.from(JSON.stringify(c)).toString('base64url')+'.x';
const faux=http.createServer((q,s)=>{let b='';q.on('data',c=>b+=c);q.on('end',()=>{
 vuToken=Object.fromEntries(new URLSearchParams(b));
 if(panne){s.writeHead(500);return s.end('{}')}
 s.writeHead(200,{'content-type':'application/json'});s.end(JSON.stringify({id_token:jwt(qui.claims(vuToken))}))})});

function req(srv,p,o){o=o||{};return new Promise((res,ko)=>{
 const h=Object.assign({'x-forwarded-proto':'https','x-forwarded-for':o.ip||'9.9.9.'+(++ipN%250),host:'api.exemple.fr'},o.headers||{});
 if(o.body!==undefined)h['content-type']='application/json';if(o.jeton)h.authorization='Bearer '+o.jeton;
 const r=http.request({host:'127.0.0.1',port:srv.address().port,method:o.body===undefined?'GET':'POST',path:p,headers:h},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j={};try{j=JSON.parse(d)}catch(e){}res({status:x.statusCode,j,headers:x.headers,raw:d})})});
 r.on('error',ko);if(o.body!==undefined)r.write(JSON.stringify(o.body));r.end()})}

(async()=>{
 await new Promise(r=>faux.listen(0,'127.0.0.1',r));
 const FP='http://127.0.0.1:'+faux.address().port;
 const F={
  google:Object.assign({},authLib.FOURNISSEURS.google,{jeton:FP+'/token',id:()=>'id-google',secret:()=>'secret-google'}),
  microsoft:Object.assign({},authLib.FOURNISSEURS.microsoft,{jeton:FP+'/token',id:()=>'id-ms',secret:()=>'secret-ms'}),
  apple:Object.assign({},authLib.FOURNISSEURS.google,{id:()=>'',secret:()=>''})};
 const dir=path.join(tmp,'a');
 const monter=()=>createServer({dataDir:dir,hosted:true,allowHttp:true,noTimers:true,pushSend:async()=>({status:201}),maintenant:()=>T,
  auth:{fournisseurs:F,publicUrl:'https://api.exemple.fr',appOrigins:APP+', https://marcos.github.io'}});
 let S=monter();await new Promise(r=>S.server.listen(0,'127.0.0.1',r));
 const G=(p,o)=>req(S.server,p,o),P=(p,b,j)=>req(S.server,'/api/auth/'+p,{body:b,jeton:j});
 const nonceDe=loc=>new URL(loc).searchParams.get('nonce');
 /* parcours complet : via → (fournisseur) → retour → ticket */
 async function aller(k,o){o=o||{};
  const v=await G('/api/auth/via/'+k+'?retour='+encodeURIComponent(o.retour||APP+'/'),{ip:o.ip});
  const loc=v.headers.location||'',u=loc.startsWith('http')?new URL(loc):null;
  return{v,loc,etat:u&&u.searchParams.get('state'),nonce:u&&u.searchParams.get('nonce'),cookie:String((v.headers['set-cookie']||[''])[0]).split(';')[0]}}
 async function revenir(k,a,o){o=o||{};
  return G('/api/auth/retour/'+k+'?'+new URLSearchParams(Object.assign({state:a.etat,code:'code-123'},o.q||{})),{headers:o.sansCookie?{}:{cookie:o.cookie||a.cookie}})}
 const ticketDe=r=>(/#auth=([a-f0-9]{48})$/.exec(r.headers.location||'')||[])[1];
 const gClaims=(sub,email,plus)=>t=>Object.assign({iss:'https://accounts.google.com',aud:'id-google',sub,email,email_verified:true,given_name:'Marc',exp:Math.floor(T/1000)+3600,nonce:qui.nonce},plus||{});
 async function connecter(k,claims,o){const a=await aller(k,o);qui={nonce:a.nonce,claims};const r=await revenir(k,a);const t=ticketDe(r);
  if(!t)return{r};const s=await P('session',{ticket:t});return{r,t,s,jeton:s.j.jeton,compte:s.j.compte}}

 // ---- contrôles de forme ----
 ok('SIRET : valide accepté, faux refusé',authLib.siretOk(SIRET)&&authLib.siretOk('732 829 320 00074')&&!authLib.siretOk('73282932000075')&&!authLib.siretOk('1234')&&!authLib.siretOk('00000000000000'));
 let a=await G('/api/auth/fournisseurs');
 ok('fournisseurs : seuls ceux qui sont configurés',a.status===200&&a.j.fournisseurs.join()==='google,microsoft');

 // ---- départ chez le fournisseur ----
 let d=await aller('google');const u=new URL(d.loc);
 ok('via : redirection vers Google (302)',d.v.status===302&&d.loc.startsWith('https://accounts.google.com/o/oauth2/v2/auth?'));
 ok('via : paramètres OpenID (code, PKCE S256, état, nonce, adresse de retour)',u.searchParams.get('response_type')==='code'&&u.searchParams.get('client_id')==='id-google'&&u.searchParams.get('code_challenge_method')==='S256'&&u.searchParams.get('code_challenge').length===43&&/^[a-f0-9]{48}$/.test(d.etat)&&d.nonce.length===32&&u.searchParams.get('redirect_uri')==='https://api.exemple.fr/api/auth/retour/google'&&u.searchParams.get('scope')==='openid email profile');
 const sc=String(d.v.headers['set-cookie']);
 ok('via : cookie de liaison HttpOnly, Secure, SameSite=Lax',/^caso_oauth=[a-f0-9]{32}; Path=\/api\/auth\/; HttpOnly; SameSite=Lax; Secure; Max-Age=600$/.test(sc),sc);
 ok('via : le secret du client n\'est jamais dans l\'adresse',!d.loc.includes('secret-google'));
 a=await G('/api/auth/via/google?retour='+encodeURIComponent('https://pirate.exemple.com/'));
 ok('via : adresse de retour inconnue refusée (400)',a.status===400);
 a=await G('/api/auth/via/google?retour='+encodeURIComponent(APP+'.pirate.com/'));
 ok('via : adresse ressemblante refusée (400)',a.status===400);
 a=await G('/api/auth/via/apple?retour='+encodeURIComponent(APP+'/'));
 ok('via : fournisseur non configuré → retour avec « indisponible »',a.status===302&&a.headers.location===APP+'/#auth_erreur=indisponible');
 a=await G('/api/auth/via/constructor?retour='+encodeURIComponent(APP+'/'));
 ok('via : fournisseur inconnu → « indisponible »',a.status===302&&/#auth_erreur=indisponible$/.test(a.headers.location||''));
 a=await aller('google',{retour:'https://marcos.github.io/Cas-/?x=1#y'});
 qui={nonce:a.nonce,claims:gClaims('g-0','zero@gmail.com')};a=await revenir('google',a);
 ok('retour : l\'appli est rejointe à son adresse, sans paramètres parasites',/^https:\/\/marcos\.github\.io\/Cas-\/#auth=[a-f0-9]{48}$/.test(a.headers.location||''),a.headers.location);

 // ---- retour du fournisseur ----
 qui={nonce:d.nonce,claims:gClaims('g-1','Marc@Gmail.com')};
 a=await revenir('google',d,{sansCookie:true});
 ok('retour : sans le cookie du navigateur de départ → refusé',a.status===302&&/#auth_erreur=navigateur$/.test(a.headers.location));
 a=await revenir('google',d);
 ok('retour : un état ne sert qu\'une fois (400)',a.status===400);
 d=await aller('google');qui={nonce:d.nonce,claims:gClaims('g-1','Marc@Gmail.com')};
 a=await revenir('microsoft',d);
 ok('retour : état d\'un autre fournisseur refusé (400)',a.status===400);
 d=await aller('google');qui={nonce:d.nonce,claims:gClaims('g-1','Marc@Gmail.com')};
 a=await revenir('google',d);const tk=ticketDe(a);
 ok('retour : ticket dans le fragment, cookie effacé',!!tk&&a.headers.location===APP+'/#auth='+tk&&/Max-Age=0/.test(String(a.headers['set-cookie'])));
 ok('échange du code : PKCE, secret et adresse de retour envoyés au fournisseur',vuToken.grant_type==='authorization_code'&&vuToken.code==='code-123'&&vuToken.client_secret==='secret-google'&&vuToken.code_verifier.length===43&&vuToken.redirect_uri==='https://api.exemple.fr/api/auth/retour/google');
 ok('retour : le jeton de session n\'est jamais dans une adresse',!/[a-f0-9]{64}/.test(a.headers.location));

 // ---- session ----
 a=await P('session',{ticket:'faux'});
 ok('session : faux ticket refusé (401)',a.status===401);
 a=await P('session',{ticket:tk});const jA=a.j.jeton,cA=a.j.compte||{};
 ok('session : compte créé, sans mode tant que l\'appli n\'a rien transmis',a.status===200&&/^[a-f0-9]{64}$/.test(jA||'')&&cA.via==='google'&&cA.email==='marc@gmail.com'&&cA.prenom==='Marc'&&cA.mode===null&&cA.offre===null);
 a=await P('session',{ticket:tk});
 ok('session : un ticket ne sert qu\'une fois',a.status===401);
 d=await aller('google');qui={nonce:d.nonce,claims:gClaims('g-9','neuf@gmail.com')};a=await revenir('google',d);T+=3*60e3;
 ok('session : ticket expiré après 2 minutes',(await P('session',{ticket:ticketDe(a)})).status===401);
 const brut=()=>fs.readFileSync(path.join(dir,'comptes.json'),'utf8');
 ok('disque : jeton de session haché, jamais en clair',!brut().includes(jA)&&brut().includes('marc@gmail.com'));
 ok('moi : compte renvoyé ; sans jeton ou faux jeton → 401',(await P('moi',undefined,jA)).j.compte.email==='marc@gmail.com'&&(await P('moi')).status===401&&(await P('moi',undefined,'a'.repeat(64))).status===401);
 a=await req(S.server,'/api/sync',{body:{},jeton:jA});
 ok('le jeton AUTH n\'ouvre pas les données d\'équipe (/api/sync → 401)',a.status===401);

 // ---- jetons d'identité refusés ----
 const refus=async(n,claims,k)=>{const r=await connecter(k||'google',claims);ok('identité refusée : '+n,!r.t&&/#auth_erreur=refus$/.test(r.r.headers.location||''),r.r.headers.location)};
 await refus('émetteur inconnu',t=>Object.assign(gClaims('g-1','x@gmail.com')(t),{iss:'https://pirate.exemple.com'}));
 await refus('destinataire différent (aud)',t=>Object.assign(gClaims('g-1','x@gmail.com')(t),{aud:'autre-appli'}));
 await refus('nonce différent',t=>Object.assign(gClaims('g-1','x@gmail.com')(t),{nonce:'0'.repeat(32)}));
 await refus('jeton expiré',t=>Object.assign(gClaims('g-1','x@gmail.com')(t),{exp:Math.floor(T/1000)-3600}));
 await refus('sans identifiant (sub)',t=>Object.assign(gClaims('','x@gmail.com')(t)));
 await refus('Microsoft : émetteur qui ne correspond pas au locataire',t=>({iss:'https://login.microsoftonline.com/'+TID+'/v2.0',tid:'11111111-1111-1111-1111-111111111111',aud:'id-ms',sub:'m-1',exp:Math.floor(T/1000)+3600,nonce:qui.nonce}),'microsoft');
 panne=true;a=await connecter('google',gClaims('g-1','x@gmail.com'));panne=false;
 ok('fournisseur en panne : retour avec erreur, pas de session',!a.t&&/#auth_erreur=refus$/.test(a.r.headers.location));
 d=await aller('google');a=await revenir('google',d,{q:{error:'access_denied',code:''}});
 ok('l\'usager annule chez le fournisseur → « annule »',/#auth_erreur=annule$/.test(a.headers.location));

 // ---- reconnexion, autre appareil ----
 a=await connecter('google',gClaims('g-1','marc.nouveau@gmail.com'));const jA2=a.jeton;
 ok('reconnexion : même compte (identifiant du fournisseur), e-mail mis à jour',a.compte.id===cA.id&&a.compte.email==='marc.nouveau@gmail.com'&&jA2!==jA);
 a=await connecter('google',t=>Object.assign(gClaims('g-2','marc.nouveau@gmail.com')(t),{email_verified:false}));
 ok('Google : adresse non vérifiée → compte distinct, sans e-mail',a.compte.id!==cA.id&&a.compte.email==='');

 // ---- profil transmis par l'appli (rien à saisir) ----
 a=await P('profil',{mode:'artisan',nom:'Marc Peinture',siret:'73282932000075'},jA);
 ok('profil : artisan sans SIRET valide refusé (400), compte inchangé',a.status===400&&a.j.compte.mode===null);
 a=await P('profil',{mode:'patron'},jA);
 ok('profil : mode inconnu refusé (400)',a.status===400);
 a=await P('profil',{mode:'artisan',nom:'Marc Peinture',siret:'732 829 320 00074'},jA);
 const finA=a.j.compte.essaiFin;
 ok('profil : Artisan, essai de 30 jours démarré',a.status===200&&a.j.compte.mode==='artisan'&&a.j.compte.siret===SIRET&&a.j.compte.nom==='Marc Peinture'&&a.j.compte.offre==='artisan_curieux'&&finA===T+30*J);
 T+=5*J;
 a=await P('profil',{mode:'artisan',nom:'Marc Peinture SARL',siret:SIRET},jA);
 ok('profil : renvoyé plus tard, l\'essai ne redémarre pas',a.j.compte.essaiFin===finA&&a.j.compte.nom==='Marc Peinture SARL');
 a=await P('profil',{mode:'artisan',nom:'Marc Peinture SARL',siret:SIRET2},jA);
 ok('profil : changer de SIRET ne rallonge pas l\'essai',a.j.compte.siret===SIRET2&&a.j.compte.essaiFin===finA);
 a=await P('profil',{mode:'bricoleur'},jA);
 ok('profil : un Artisan ne redevient pas Bricoleur',a.j.compte.mode==='artisan');

 // ---- Microsoft (Outlook), Bricoleur → Artisan ----
 const msClaims=(sub,email)=>t=>({iss:'https://login.microsoftonline.com/'+TID+'/v2.0',tid:TID,aud:'id-ms',sub,preferred_username:email,exp:Math.floor(T/1000)+3600,nonce:qui.nonce});
 d=await aller('microsoft');
 ok('via : redirection vers Microsoft',d.loc.startsWith('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?')&&new URL(d.loc).searchParams.get('client_id')==='id-ms');
 a=await connecter('microsoft',msClaims('m-1','lea@outlook.fr'));const jB=a.jeton;
 ok('Outlook : compte créé',a.compte.via==='microsoft'&&a.compte.email==='lea@outlook.fr');
 a=await connecter('microsoft',msClaims('m-2','marc.nouveau@gmail.com'));
 ok('Microsoft : une adresse identique ne donne pas accès au compte d\'un autre',a.compte.id!==cA.id&&a.compte.mode===null);
 a=await P('profil',{mode:'bricoleur'},jB);
 ok('profil : Bricoleur, gratuit, sans essai',a.j.compte.mode==='bricoleur'&&a.j.compte.offre==='bricoleur'&&a.j.compte.essaiFin===null);
 a=await P('profil',{mode:'artisan',nom:'Léa Déco',siret:'35600000000048'},jB);
 ok('Bricoleur → Artisan : essai démarré',a.j.compte.mode==='artisan'&&a.j.compte.offre==='artisan_curieux'&&a.j.compte.essaiFin===T+30*J);

 // ---- « On construit le plan » : modules choisis, total plafonné ----
 a=await P('moi',undefined,jB);
 ok('essai : tous les modules Artisan ouverts',a.j.compte.modules.length===8&&a.j.compte.modules.includes('paiement'));
 a=await P('plan',{modules:['devis','planning','pointage','nimporte-quoi','devis']},jB);
 ok('plan : modules inconnus et doublons écartés, total 15 €',a.status===200&&JSON.stringify(a.j.compte.plan.modules)==='["devis","planning","pointage"]'&&a.j.compte.plan.total===1500&&a.j.compte.offre==='artisan_curieux');
 const T1=T;T+=31*J;
 a=await P('moi',undefined,jB);
 ok('après l\'essai : seuls les modules choisis restent ouverts (mode test, rien de facturé)',a.j.compte.offre==='plan'&&JSON.stringify(a.j.compte.modules)==='["devis","planning","pointage"]');
 a=await P('plan',{modules:['devis','planning','pointage','paiement','3d','renovation','fournisseurs','veille']},jB);
 ok('plan : tout coché = 25 € (plafond), jamais 38 €',a.j.compte.plan.brut===3800&&a.j.compte.plan.total===2500&&a.j.compte.plan.plafonne===true);
 a=await P('plan',{modules:[]},jB);
 ok('plan vide : aucun module, 0 €',a.status===200&&a.j.compte.modules.length===0&&a.j.compte.plan.total===0);
 ok('plan : corps invalide refusé (400)',(await P('plan',{modules:'devis'},jB)).status===400);
 ok('plan : sans jeton refusé (401)',(await P('plan',{modules:['devis']})).status===401);
 a=await connecter('google',gClaims('g-sans-mode','sansmode@gmail.com'));
 ok('plan : refusé tant que le mode n\'est pas choisi (400)',(await P('plan',{modules:['devis']},a.jeton)).status===400);
 a=await connecter('google',gClaims('g-bric','bric@gmail.com'));
 await P('profil',{mode:'bricoleur'},a.jeton);
 a=await P('plan',{modules:['3d','renovation','verification','estimation','devis']},a.jeton);
 ok('Bricoleur : catalogue à lui (devis écarté), 17 € plafonnés à 10 € TTC',a.j.compte.plan.brut===1700&&a.j.compte.plan.total===1000&&a.j.compte.plan.unite==='TTC'&&!a.j.compte.modules.includes('devis'));
 T=T1;

 // ---- fin d'essai, déconnexion, redémarrage ----
 const T0=T;T+=31*J;
 ok('après 30 jours : offre « artisan_fin_essai »',(await P('moi',undefined,jA2)).j.compte.offre==='artisan_fin_essai');T=T0;
 a=await P('sortir',{},jA);
 ok('sortir : session fermée, l\'autre appareil reste connecté',a.status===200&&(await P('moi',undefined,jA)).status===401&&(await P('moi',undefined,jA2)).status===200);
 await new Promise(r=>S.server.close(r));S=monter();await new Promise(r=>S.server.listen(0,'127.0.0.1',r));
 ok('redémarrage : compte et session conservés',(await P('moi',undefined,jA2)).j.compte.siret===SIRET2);

 // ---- suppression, pas de second essai gratuit ----
 ok('supprimer : confirmation exigée (400)',(await P('supprimer',{},jA2)).status===400);
 a=await P('supprimer',{confirm:'SUPPRIMER'},jA2);
 ok('supprimer : compte et sessions effacés',a.status===200&&(await P('moi',undefined,jA2)).status===401&&!brut().includes('"google:g-1"')&&!brut().includes('Marc Peinture SARL'));
 T+=10*J;
 a=await connecter('google',gClaims('g-1','marc.nouveau@gmail.com'));
 a=await P('profil',{mode:'artisan',nom:'Autre nom',siret:SIRET},a.jeton);
 ok('compte recréé par la même personne : l\'essai garde sa date de fin d\'origine',a.j.compte.essaiFin===finA,String(a.j.compte.essaiFin-finA));
 a=await connecter('google',gClaims('g-77','autre@gmail.com'));const jC=a.jeton;
 a=await P('profil',{mode:'artisan',nom:'Marc Peinture',siret:SIRET2},jC);
 ok('même SIRET sous un autre compte : pas de nouvel essai',a.j.compte.essaiFin===finA);

 // ---- session : 90 jours, prolongée à l'usage ----
 T+=80*J;ok('session encore valable à 80 jours',(await P('moi',undefined,jC)).status===200);
 T+=80*J;ok('session prolongée par l\'usage (160 jours)',(await P('moi',undefined,jC)).status===200);
 T+=91*J;ok('session expirée après 90 jours sans usage',(await P('moi',undefined,jC)).status===401);

 // ---- limites ----
 T+=J;let n=0;
 for(let i=0;i<32;i++){const r=await G('/api/auth/via/google?retour='+encodeURIComponent(APP+'/'),{ip:'7.7.7.7'});if(/#auth_erreur=trop$/.test(r.headers.location||''))n++}
 ok('au plus 30 départs par heure pour une adresse IP',n===2,String(n));
 d=await aller('google');T+=11*60e3;qui={nonce:d.nonce,claims:gClaims('g-5','cinq@gmail.com')};
 ok('état expiré après 10 minutes (400)',(await revenir('google',d)).status===400);
 ok('CORS présent sur /api/auth ; route inconnue → 401 sans session',(await P('moi',undefined,jC)).headers['access-control-allow-origin']==='*'&&(await P('inconnu',{})).status===401);

 // ---- compte par e-mail : même compte, même essai, même plan ----
 {const PR='a'.repeat(64),PR2='b'.repeat(64),SIRET3='40000000000002',PL=require('../lib/plan.js');
  a=await P('mail/creer',{email:'Paul@Exemple.fr',preuve:PR,prenom:'Paul'});
  ok('e-mail : création → session, compte sans mode',a.status===200&&/^[a-f0-9]{64}$/.test(a.j.jeton)&&a.j.compte.via==='mail'&&a.j.compte.email==='paul@exemple.fr'&&a.j.compte.mode===null);
  const jM=a.j.jeton;
  ok('e-mail : rien de secret dans la réponse',!/mdp|scrypt|"h"|sel/.test(JSON.stringify(a.j))&&!JSON.stringify(a.j).includes(PR));
  const brut=fs.readFileSync(path.join(dir,'comptes.json'),'utf8');
  ok('e-mail : la preuve n\'est pas gardée telle quelle',!brut.includes(PR));
  a=await P('mail/creer',{email:'paul@exemple.fr',preuve:PR2});ok('e-mail : deuxième création refusée (409)',a.status===409);
  a=await P('mail/entrer',{email:'PAUL@exemple.fr',preuve:PR});ok('e-mail : connexion avec la bonne preuve',a.status===200&&a.j.compte.email==='paul@exemple.fr');
  a=await P('mail/entrer',{email:'paul@exemple.fr',preuve:PR2});ok('e-mail : mauvaise preuve refusée (401)',a.status===401&&!a.j.jeton);
  a=await P('mail/entrer',{email:'personne@exemple.fr',preuve:PR});ok('e-mail : adresse inconnue (404)',a.status===404);
  a=await P('mail/creer',{email:'pas-un-mail',preuve:PR});ok('e-mail : adresse invalide refusée',a.status===400);
  a=await P('mail/creer',{email:'x@exemple.fr',preuve:'motdepasse'});ok('e-mail : mot de passe en clair refusé (preuve exigée)',a.status===400);
  a=await P('profil',{mode:'artisan',nom:'Paul Plomberie',siret:SIRET3},jM);
  ok('e-mail : même essai de 30 jours au SIRET, tout le mode Artisan ouvert',a.status===200&&a.j.compte.offre==='artisan_curieux'&&a.j.compte.essaiFin===T+30*J&&a.j.compte.modules.length===PL.catalogue('artisan').modules.length);
  ok('e-mail : droits() en essai, rien de fermé',PL.droits(a.j.compte,T).essai&&PL.droits(a.j.compte,T).ouvert('veille'));
  a=await req(S.server,'/api/prix?q=seau',{jeton:jM});ok('prix en ligne : ouverts pendant l\'essai',a.status!==403,String(a.status));
  a=await P('plan',{modules:['devis','pointage']},jM);ok('e-mail : plan enregistré',a.status===200&&a.j.compte.plan.modules.join()==='devis,pointage');
  T+=31*J;a=await P('moi',undefined,jM);const dr=PL.droits(a.j.compte,T);
  ok('e-mail : après l\'essai, plan + socle gratuit',a.j.compte.offre==='plan'&&!dr.essai&&dr.ouvert('devis')&&dr.ouvert('pointage')&&dr.ouvert('chat')&&dr.ouvert('clients')&&dr.ouvert('rdv')&&!dr.ouvert('veille')&&!dr.ouvert('planning'));
  a=await req(S.server,'/api/prix?q=seau',{jeton:jM});ok('prix en ligne : refusés après l\'essai sans le module Fournisseurs (403)',a.status===403&&a.j.module==='fournisseurs',String(a.status));
  await P('plan',{modules:['devis','fournisseurs']},jM);a=await req(S.server,'/api/prix?q=seau',{jeton:jM});ok('prix en ligne : ouverts avec le module Fournisseurs',a.status!==403,String(a.status));
  a=await req(S.server,'/api/prix?q=seau');ok('prix en ligne : sans compte, limites anonymes inchangées (pas de 403)',a.status!==403,String(a.status));
  a=await P('mail/mdp',{preuve:PR2},jM);ok('e-mail : mot de passe changé',a.status===200&&(await P('mail/entrer',{email:'paul@exemple.fr',preuve:PR2})).status===200&&(await P('mail/entrer',{email:'paul@exemple.fr',preuve:PR})).status===401);
  const jG=(await connecter('google',gClaims('g-88','g88@gmail.com'))).jeton;
  a=await P('mail/mdp',{preuve:PR},jG);ok('e-mail : changer de mot de passe refusé pour un compte Google',a.status===400);
  let n429=0;for(let i=0;i<12;i++){const r=await req(S.server,'/api/auth/mail/entrer',{body:{email:'cible@exemple.fr',preuve:PR},ip:'6.6.6.'+i});if(r.status===429)n429++}
  ok('e-mail : au plus 10 essais par heure pour une même adresse, même depuis plusieurs IP',n429===2,String(n429));
  a=await P('supprimer',{confirm:'SUPPRIMER'},jM);ok('e-mail : suppression du compte',a.status===200&&(await P('mail/entrer',{email:'paul@exemple.fr',preuve:PR2})).status===404)}
 await new Promise(r=>S.server.close(r));

 // ---- serveur sans clés : rien ne casse ----
 const sv={};for(const k of ['GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET','MICROSOFT_CLIENT_ID','MICROSOFT_CLIENT_SECRET','PUBLIC_URL','APP_ORIGINS']){sv[k]=process.env[k];delete process.env[k]}
 const H=createServer({dataDir:path.join(tmp,'h'),hosted:true,allowHttp:true,noTimers:true,pushSend:async()=>({status:201})});
 await new Promise(r=>H.server.listen(0,'127.0.0.1',r));
 a=await req(H.server,'/api/auth/fournisseurs');
 ok('sans clés : aucun fournisseur annoncé',a.status===200&&a.j.fournisseurs.length===0);
 a=await req(H.server,'/api/auth/via/google?retour='+encodeURIComponent(APP+'/'));
 ok('sans clés ni adresses autorisées : départ refusé (400)',a.status===400);
 await new Promise(r=>H.server.close(r));
 for(const k of Object.keys(sv))if(sv[k]!==undefined)process.env[k]=sv[k];

 faux.close();
 console.log(R.join('\n'));
 const ko=R.filter(x=>x.startsWith('FAIL')).length;
 console.log('\n'+(R.length-ko)+'/'+R.length+' contrôles réussis');
 fs.rmSync(tmp,{recursive:true,force:true});
 process.exit(ko?1:0);
})().catch(e=>{console.error(e);process.exit(1)});

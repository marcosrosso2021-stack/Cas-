/* Tests de l'abonnement payant (serveur/abo.js + routes /api/auth/abo/* de serveur/auth.js) avec un faux Stripe.
   Lancer : node tests/abo.test.js   (aucune dépendance, aucun réseau) */
'use strict';
const http=require('http'),os=require('os'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {createServer}=require('../serveur/server.js');
const abo=require('../serveur/abo.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x!==undefined&&!c?'  ['+x+']':''));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-abo-'));
let T=Date.UTC(2026,10,20,9);const J=864e5;
const WH='whsec_essai_casô';

/* ---------- faux Stripe : prix, remises, abonnements, pages de paiement ---------- */
const S={prix:{},coupons:{},subs:{},n:0,appels:[]};
const id=p=>p+'_'+(++S.n);
function lireForm(b){const o={};for(const kv of String(b||'').split('&').filter(Boolean)){const [k,v]=kv.split('=').map(decodeURIComponent);o[k]=v}return o}
async function faux(u,o){
 const url=new URL(u),ch=url.pathname.replace('/v1/',''),f=lireForm(o.body),M=o.method;S.appels.push(M+' '+ch);
 const rep=(st,j)=>({ok:st<400,status:st,json:async()=>j});
 if(!/^Bearer sk_test_/.test(o.headers.authorization))return rep(401,{error:{message:'clé'}});
 if(M==='GET'&&ch==='prices'){const ks=url.searchParams.getAll('lookup_keys[]');return rep(200,{data:Object.values(S.prix).filter(p=>ks.includes(p.lookup_key))})}
 if(M==='POST'&&ch==='prices'){const p={id:id('price'),lookup_key:f.lookup_key,unit_amount:+f.unit_amount,tax:f.tax_behavior};S.prix[p.id]=p;return rep(200,p)}
 let m;
 if(M==='GET'&&(m=/^coupons\/(.+)$/.exec(ch)))return S.coupons[m[1]]?rep(200,S.coupons[m[1]]):rep(404,{error:{code:'resource_missing'}});
 if(M==='POST'&&ch==='coupons'){S.coupons[f.id]={id:f.id,amount_off:+f.amount_off,duration:f.duration};return rep(200,S.coupons[f.id])}
 if(M==='POST'&&ch==='checkout/sessions'){S.dernier=f;return rep(200,{id:id('cs'),url:'https://checkout.stripe.com/c/pay/essai'})}
 if(M==='POST'&&ch==='billing_portal/sessions')return rep(200,{url:'https://billing.stripe.com/p/session/essai'});
 if((m=/^subscriptions\/(.+)$/.exec(ch))){const s=S.subs[m[1]];if(!s)return rep(404,{error:{}});
  if(M==='POST'){if(f.cancel_at_period_end!==undefined)s.cancel_at_period_end=f.cancel_at_period_end==='true';
   const del=new Set(),add=[];Object.keys(f).forEach(k=>{const x=/^items\[(\d+)\]\[(\w+)\]$/.exec(k);if(x&&x[2]==='deleted')del.add(f['items['+x[1]+'][id]']);if(x&&x[2]==='price')add.push(f[k])});
   s.items.data=s.items.data.filter(it=>!del.has(it.id)).concat(add.map(p=>({id:id('si'),price:S.prix[p]})));
   s.discount=f['discounts[0][coupon]']||null;S.maj=f}
  return rep(200,s)}
 return rep(400,{error:{message:'inconnu '+M+' '+ch}})}
/* crée l'abonnement que Stripe ferait après la page de paiement */
function abonnementPaye(compte,client,prixIds){const s={id:id('sub'),object:'subscription',customer:client,status:'active',cancel_at_period_end:false,
 current_period_end:Math.floor((T+30*J)/1000),metadata:{compte},items:{data:prixIds.map(p=>({id:id('si'),price:S.prix[p]}))}};S.subs[s.id]=s;return s}

const monte=o=>new Promise(r=>{const s=createServer(Object.assign({noTimers:true,pushSend:async()=>({status:201})},o));s.server.listen(0,'127.0.0.1',()=>r(s.server))});
function req(srv,o){return new Promise((res,ko)=>{const body=o.raw!==undefined?o.raw:(o.body?JSON.stringify(o.body):null);
 const r=http.request({host:'127.0.0.1',port:srv.address().port,method:o.method||(body!==null?'POST':'GET'),path:o.path,headers:Object.assign(body!==null?{'content-type':'application/json'}:{},o.headers||{})},
  x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>{let j=null;try{j=JSON.parse(d)}catch(e){}res({status:x.statusCode,body:d,json:j})})});
 r.on('error',ko);if(body!==null)r.write(body);r.end()})}
function signe(ev,secret,t){const corps=JSON.stringify(ev),ts=t||Math.floor(T/1000);
 return{corps,entete:'t='+ts+',v1='+crypto.createHmac('sha256',secret||WH).update(ts+'.'+corps).digest('hex')}}
const evt=(srv,type,obj,o)=>{const e={id:'evt_'+(++S.n),type,data:{object:obj}},s=signe(e,o&&o.secret,o&&o.t);
 return req(srv,{path:'/api/auth/abo/webhook',raw:s.corps,headers:{'content-type':'application/json','stripe-signature':o&&o.entete||s.entete}})};

(async()=>{
 const srv=await monte({dataDir:tmp,maintenant:()=>T,auth:{paiement:true,stripeCle:'sk_test_essai',stripeWebhook:WH,stripeFetch:faux,maintenant:()=>T,publicUrl:'https://casobtp.fr'}});
 const H=j=>({authorization:'Bearer '+j});
 let r=await req(srv,{path:'/api/auth/mail/creer',body:{email:'jean@exemple.fr',preuve:'a'.repeat(64),prenom:'Jean'}});
 const jt=r.json&&r.json.jeton;ok('compte créé',!!jt,r.body);
 r=await req(srv,{path:'/api/auth/profil',headers:H(jt),body:{mode:'artisan',nom:'Jean Dupont',siret:'55210055400013'}});
 ok('mode Artisan, essai démarré',r.json&&r.json.compte&&r.json.compte.offre==='artisan_curieux',r.body);
 r=await req(srv,{path:'/api/auth/abo',headers:H(jt)});
 ok('état : paiement disponible, pas encore abonné',r.json&&r.json.abo.paiement===true&&r.json.abo.abonne===false,r.body);

 /* 1. payer : prix créés une fois, remise = plafond + fondateur, page de paiement Stripe */
 r=await req(srv,{path:'/api/auth/abo/payer',headers:H(jt),body:{}});
 ok('payer sans module : refusé',r.status===400,r.status);
 const tous=['devis','planning','pointage','paiement','3d','renovation','fournisseurs','veille'];
 await req(srv,{path:'/api/auth/plan',headers:H(jt),body:{modules:tous}});
 r=await req(srv,{path:'/api/auth/abo/payer',headers:H(jt),body:{retour:'https://casobtp.fr/'}});
 ok('payer : adresse de la page de paiement Stripe',r.json&&/^https:\/\/checkout\.stripe\.com\//.test(r.json.url),r.body);
 ok('7 prix créés (un par module), hors taxes',Object.keys(S.prix).length===7&&Object.values(S.prix).every(p=>p.tax==='exclusive'),Object.keys(S.prix).length);
 const brut=3600,plafond=2500,total=Math.round(plafond*0.7);
 ok('remise unique : plafond (25 €) puis fondateur 30 % → total 17,50 €',S.coupons['caso_remise_artisan_'+(brut-total)]&&S.dernier['discounts[0][coupon]']==='caso_remise_artisan_'+(brut-total),Object.keys(S.coupons).join(','));
 ok('pendant l\'essai : premier prélèvement à la fin de l\'essai',+S.dernier['subscription_data[trial_end]']>Math.floor(T/1000)+25*86400,S.dernier['subscription_data[trial_end]']);
 ok('page de paiement : carte et prélèvement SEPA, e-mail du compte, retour vers l\'appli',S.dernier['payment_method_types[0]']==='card'&&S.dernier['payment_method_types[1]']==='sepa_debit'&&S.dernier.customer_email==='jean@exemple.fr'&&S.dernier.success_url==='https://casobtp.fr/#abo=ok',JSON.stringify(S.dernier).slice(0,200));
 const n0=S.appels.filter(a=>a==='POST prices').length;
 await req(srv,{path:'/api/auth/abo/payer',headers:H(jt),body:{}});
 ok('deuxième essai : les prix ne sont pas recréés',S.appels.filter(a=>a==='POST prices').length===n0);

 /* 2. webhook : signature contrôlée */
 const cid=JSON.parse(fs.readFileSync(path.join(tmp,'comptes.json'),'utf8').replace(/^﻿/,'')||'{}');
 const compteId=Object.keys(cid.comptes)[0];
 r=await evt(srv,'checkout.session.completed',{client_reference_id:compteId,customer:'cus_1',subscription:'sub_x'},{secret:'whsec_faux'});
 ok('évènement mal signé : refusé',r.status===400,r.status);
 r=await evt(srv,'checkout.session.completed',{client_reference_id:compteId,customer:'cus_1',subscription:'sub_x'},{t:Math.floor(T/1000)-3600});
 ok('évènement trop ancien (rejoué) : refusé',r.status===400,r.status);
 const sub=abonnementPaye(compteId,'cus_1',Object.keys(S.prix));
 r=await evt(srv,'checkout.session.completed',{client_reference_id:compteId,customer:'cus_1',subscription:sub.id});
 ok('paiement terminé : accepté',r.status===200,r.body);
 r=await evt(srv,'customer.subscription.created',sub);
 r=await req(srv,{path:'/api/auth/abo',headers:H(jt)});
 ok('abonné : 7 modules, total 17,50 € HT, membre fondateur',r.json&&r.json.abo.abonne&&r.json.abo.modules.length===7&&r.json.abo.total===total,r.body);

 /* 3. après l'essai : les modules viennent de l'abonnement payé */
 T+=31*J;
 r=await req(srv,{path:'/api/auth/moi',headers:H(jt)});
 ok('après l\'essai : modules de l\'abonnement ouverts',r.json&&r.json.compte.modules.length===7,r.body.slice(0,200));

 /* 4. changement de modules : au prorata, sans nouvelle page de paiement */
 await req(srv,{path:'/api/auth/plan',headers:H(jt),body:{modules:['devis','planning']}});
 r=await req(srv,{path:'/api/auth/abo/payer',headers:H(jt),body:{}});
 ok('moins de modules : abonnement modifié, pas de page de paiement',r.json&&!r.json.url&&r.json.abo&&r.json.abo.modules.join()==='devis,planning',r.body.slice(0,200));
 ok('prorata demandé, remise retirée sous le plafond… sauf fondateur (12 € → 8,40 €)',S.maj.proration_behavior==='create_prorations'&&S.maj['discounts[0][coupon]']==='caso_remise_artisan_'+(1200-840),JSON.stringify(S.maj).slice(0,240));

 /* 5. impayé : 7 jours de grâce, puis modules fermés */
 r=await evt(srv,'invoice.payment_failed',{customer:'cus_1'});
 T+=6*J;r=await req(srv,{path:'/api/auth/moi',headers:H(jt)});
 ok('impayé : modules encore ouverts pendant 7 jours',r.json&&r.json.compte.modules.length===2,r.body.slice(0,160));
 T+=2*J;r=await req(srv,{path:'/api/auth/moi',headers:H(jt)});
 ok('impayé depuis plus de 7 jours : modules fermés',r.json&&r.json.compte.modules.length===0,r.body.slice(0,160));
 r=await evt(srv,'invoice.paid',{customer:'cus_1'});
 r=await req(srv,{path:'/api/auth/moi',headers:H(jt)});
 ok('paiement régularisé : modules rouverts',r.json&&r.json.compte.modules.length===2,r.body.slice(0,160));

 /* 6. résiliation en fin de période, reprise, puis fin */
 S.subs[sub.id].current_period_end=Math.floor((T+20*J)/1000);/* période renouvelée par Stripe */
 r=await req(srv,{path:'/api/auth/abo/resilier',headers:H(jt),body:{}});
 ok('résilier : en fin de période, date de fin donnée',r.json&&r.json.abo.annule===true&&r.json.abo.periodeFin>T,r.body);
 r=await req(srv,{path:'/api/auth/moi',headers:H(jt)});
 ok('résilié : modules ouverts jusqu\'à la fin de la période payée',r.json&&r.json.compte.modules.length===2);
 r=await req(srv,{path:'/api/auth/abo/reprendre',headers:H(jt),body:{}});
 ok('reprendre : la résiliation est annulée',r.json&&r.json.abo.annule===false,r.body);
 await req(srv,{path:'/api/auth/abo/resilier',headers:H(jt),body:{}});
 S.subs[sub.id].status='canceled';S.subs[sub.id].ended_at=Math.floor(T/1000);
 await evt(srv,'customer.subscription.deleted',S.subs[sub.id]);
 T+=J;r=await req(srv,{path:'/api/auth/moi',headers:H(jt)});
 ok('abonnement terminé : modules fermés, compte gardé',r.json&&r.json.compte.modules.length===0&&r.json.compte.email==='jean@exemple.fr',r.body.slice(0,160));
 r=await req(srv,{path:'/api/auth/abo/resilier',headers:H(jt),body:{}});
 ok('résilier sans abonnement : refusé proprement',r.status===400,r.status);

 /* 7. portail Stripe (carte, factures) */
 r=await req(srv,{path:'/api/auth/abo/portail',headers:H(jt),body:{}});
 ok('moyen de paiement et factures : adresse du portail Stripe',r.json&&/^https:\/\/billing\.stripe\.com\//.test(r.json.url),r.body);

 /* 8. sans clé Stripe : message clair, rien n'est appelé */
 const s2=await monte({dataDir:path.join(tmp,'sans'),maintenant:()=>T,auth:{paiement:false,stripeCle:'',stripeWebhook:'',stripeFetch:faux,maintenant:()=>T}});
 r=await req(s2,{path:'/api/auth/mail/creer',body:{email:'paul@exemple.fr',preuve:'b'.repeat(64),prenom:'Paul'}});const j2=r.json.jeton;
 await req(s2,{path:'/api/auth/profil',headers:H(j2),body:{mode:'artisan',nom:'Paul',siret:'55210055400013'}});
 await req(s2,{path:'/api/auth/plan',headers:H(j2),body:{modules:['devis']}});
 r=await req(s2,{path:'/api/auth/abo/payer',headers:H(j2),body:{}});
 ok('sans clé Stripe : « Paiement indisponible »',r.status===503&&/indisponible/.test(r.body),r.status+' '+r.body);
 r=await req(s2,{path:'/api/auth/abo',headers:H(j2)});
 ok('sans clé Stripe : état « paiement » à faux',r.json&&r.json.abo.paiement===false,r.body);
 await new Promise(x=>s2.close(x));

 /* 9. encodage formulaire et signature, à part */
 ok('encodage formulaire imbriqué',abo.form({a:{b:{0:{c:'x y'}}},d:1})==='a%5Bb%5D%5B0%5D%5Bc%5D=x%20y&d=1');
 const sg=signe({id:'e'},WH,1000);
 ok('signature : bonne acceptée, autre secret refusé',abo.signatureOk(sg.corps,sg.entete,WH,1000e3)&&!abo.signatureOk(sg.corps,sg.entete,'autre',1000e3));

 await new Promise(x=>srv.close(x));fs.rmSync(tmp,{recursive:true,force:true});
 console.log(R.join('\n'));const n=R.filter(x=>x.startsWith('OK')).length;console.log('\n'+n+'/'+R.length+' contrôles réussis');
 process.exit(n===R.length?0:1);
})().catch(e=>{console.error(e);process.exit(1)});

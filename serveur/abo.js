'use strict';
/* casô — abonnement payant par Stripe (aucune dépendance, API REST de Stripe).

   Variables (Clever Cloud) :
     STRIPE_SECRET_KEY      clé secrète (sk_test_… pour les essais, sk_live_… en réel)
     STRIPE_WEBHOOK_SECRET  secret de signature du webhook (whsec_…), adresse : <PUBLIC_URL>/api/auth/abo/webhook
     CASO_PAIEMENT=1        les modules ne s'ouvrent qu'avec un abonnement payé (sinon : mode test, rien n'est facturé)

   Principe :
   - un prix Stripe par module et par tarif (clé de recherche « caso_<mode>_<module>_<centimes> »), créé au premier besoin ;
   - le plafond et la remise des membres fondateurs passent par une seule remise fixe (coupon « caso_remise_<mode>_<centimes> »),
     calculée par lib/plan.js : le total payé est toujours celui affiché ;
   - premier paiement : page de paiement Stripe (carte ou prélèvement SEPA) ; ensuite, changement de modules au prorata ;
   - résiliation : en fin de période payée (cancel_at_period_end), sans frais ;
   - l'état vient des évènements signés de Stripe (webhook) : jamais de l'appli. */
const crypto=require('crypto');
const PLAN=require('../lib/plan.js');
const API='https://api.stripe.com/v1/';
const GRACE_J=7;

function err(code,message){const e=new Error(message);e.code=code;e.pub=true;return e}

/* encodage « formulaire » de Stripe : a[b][0][c]=v */
function form(o,pre,out){out=out||[];
 for(const k of Object.keys(o)){const v=o[k],n=pre?pre+'['+k+']':k;
  if(v===undefined||v===null)continue;
  if(typeof v==='object')form(v,n,out);
  else out.push(encodeURIComponent(n)+'='+encodeURIComponent(String(v)))}
 return out.join('&')}

/* signature du webhook : en-tête « t=…,v1=… », HMAC-SHA256 de « t.corps » ; 5 minutes de tolérance */
function signatureOk(corps,entete,secret,maintenant){
 if(!secret||!entete)return false;
 const p={};String(entete).split(',').forEach(x=>{const i=x.indexOf('=');if(i>0){const k=x.slice(0,i).trim();(p[k]=p[k]||[]).push(x.slice(i+1).trim())}});
 const t=Number((p.t||[])[0]);if(!t||Math.abs((maintenant||Date.now())/1000-t)>300)return false;
 const attendu=crypto.createHmac('sha256',secret).update(t+'.'+corps).digest('hex');
 return (p.v1||[]).some(v=>v.length===attendu.length&&crypto.timingSafeEqual(Buffer.from(v),Buffer.from(attendu)))}

function creer(opts){
 opts=opts||{};
 const cle=()=>String(opts.cle!==undefined?opts.cle:(process.env.STRIPE_SECRET_KEY||''));
 const secret=()=>String(opts.webhook!==undefined?opts.webhook:(process.env.STRIPE_WEBHOOK_SECRET||''));
 const appelHttp=opts.fetch||((u,o)=>fetch(u,o));
 const now=opts.maintenant||(()=>Date.now());
 const pret=()=>/^sk_(test|live)_/.test(cle());

 async function stripe(methode,chemin,corps){
  if(!pret())throw err(503,'Paiement indisponible pour l\'instant.');
  let r,j;
  try{r=await appelHttp(API+chemin,{method:methode,headers:{authorization:'Bearer '+cle(),'content-type':'application/x-www-form-urlencoded','stripe-version':'2024-06-20'},
   body:corps?form(corps):undefined});j=await r.json()}
  catch(e){throw err(502,'Paiement indisponible pour l\'instant.')}
  if(!r.ok){const e=err(r.status===404?404:502,'Paiement indisponible pour l\'instant.');e.stripe=j&&j.error;throw e}
  return j}

 /* prix Stripe des modules choisis (créés au premier besoin) */
 const prixCache=new Map();
 const cleDe=(mode,m)=>'caso_'+mode+'_'+m.id+'_'+m.prix;
 async function prix(mode,ids){
  const C=PLAN.catalogue(mode),mods=C.modules.filter(m=>ids.includes(m.id)),manque=mods.filter(m=>!prixCache.has(cleDe(mode,m)));
  if(manque.length){
   const q=manque.map(m=>'lookup_keys[]='+encodeURIComponent(cleDe(mode,m))).join('&');
   const l=await stripe('GET','prices?active=true&limit=100&'+q);
   for(const p of l.data||[])if(p.lookup_key)prixCache.set(p.lookup_key,p.id);
   for(const m of manque)if(!prixCache.has(cleDe(mode,m))){
    const p=await stripe('POST','prices',{currency:'eur',unit_amount:m.prix,recurring:{interval:'month'},lookup_key:cleDe(mode,m),
     tax_behavior:mode==='bricoleur'?'inclusive':'exclusive',product_data:{name:'casô · '+m.nom},metadata:{caso_mode:mode,caso_module:m.id}});
    prixCache.set(cleDe(mode,m),p.id)}}
  return mods.map(m=>({module:m.id,prix:prixCache.get(cleDe(mode,m))}))}

 /* remise fixe = brut − total (plafond, membres fondateurs) ; null s'il n'y en a pas */
 async function remise(mode,calc){
  const r=calc.brut-calc.total;if(r<=0)return null;
  const id='caso_remise_'+mode+'_'+r;
  try{await stripe('GET','coupons/'+id);return id}catch(e){if(e.code!==404)throw e}
  await stripe('POST','coupons',{id,amount_off:r,currency:'eur',duration:'forever',name:'casô · plafond et remises'});
  return id}

 /* module d'un article d'abonnement (d'après la clé de recherche du prix) */
 function moduleDe(item){const k=item&&item.price&&item.price.lookup_key,m=/^caso_(artisan|bricoleur)_([a-z0-9]+)_\d+$/.exec(String(k||''));return m?m[2]:null}

 /* état de l'abonnement d'un compte d'après l'objet « subscription » de Stripe */
 function etatDe(s,ancien){
  ancien=ancien||{};
  const items=(s.items&&s.items.data)||[];
  const finPer=(s.current_period_end||(items[0]&&items[0].current_period_end)||0)*1000;
  const a={sub:s.id,client:s.customer,statut:s.status,modules:items.map(moduleDe).filter(Boolean),periodeFin:finPer||null,
   annule:!!s.cancel_at_period_end,impayeDepuis:ancien.impayeDepuis||null,offre:'abonne',fin:null};
  if(s.status==='past_due'){a.impayeDepuis=a.impayeDepuis||now();a.fin=a.impayeDepuis+GRACE_J*864e5}
  else if(!['active','trialing'].includes(s.status)){a.fin=s.ended_at?s.ended_at*1000:now();if(s.status!=='canceled')a.fin=now()}
  else a.impayeDepuis=null;
  return a}

 return{pret,stripe,prix,remise,etatDe,moduleDe,signatureOk:(corps,entete)=>signatureOk(corps,entete,secret(),now()),webhookPret:()=>!!secret(),GRACE_J}}

module.exports={creer,form,signatureOk,GRACE_J};

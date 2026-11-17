'use strict';
/* Dépôt d'objets compatible S3 (Cellar de Clever Cloud), sans dépendance : signature AWS version 4.
   Sert uniquement à envoyer les sauvegardes chiffrées hors du serveur (serveur/sauvegarde.js).

   Réglages lus par le serveur :
     CELLAR_ADDON_HOST, CELLAR_ADDON_KEY_ID, CELLAR_ADDON_KEY_SECRET  posés par Clever Cloud quand l'add-on Cellar est lié à l'appli
     SAUVEGARDE_BUCKET                                                  nom du « bucket » créé dans l'add-on
   Adresses « chemin » : https://<hôte>/<bucket>/<objet>. Cellar n'utilise pas la région ; elle entre seulement dans la signature. */
const https=require('https'),http=require('http'),crypto=require('crypto');

const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const hmac=(k,s)=>crypto.createHmac('sha256',k).update(s).digest();
// encodage d'adresse exigé par la signature : tout sauf A-Z a-z 0-9 - _ . ~
const enc=s=>encodeURIComponent(s).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());
const encChemin=p=>p.split('/').map(enc).join('/');

/* Calcule l'en-tête Authorization. entetes : tous les en-têtes signés (dont host et x-amz-date). */
function signer(o){
 const jour=o.date.slice(0,8),region=o.region||'us-east-1',noms=Object.keys(o.entetes).map(n=>n.toLowerCase()).sort();
 const val=n=>String(o.entetes[Object.keys(o.entetes).find(k=>k.toLowerCase()===n)]).trim().replace(/\s+/g,' ');
 const requete=[o.methode,encChemin(o.chemin),o.query||'',noms.map(n=>n+':'+val(n)+'\n').join(''),noms.join(';'),o.corpsSha].join('\n');
 const portee=jour+'/'+region+'/s3/aws4_request';
 const aSigner=['AWS4-HMAC-SHA256',o.date,portee,sha(requete)].join('\n');
 const k=hmac(hmac(hmac(hmac('AWS4'+o.secret,jour),region),'s3'),'aws4_request');
 return{signature:hmac(k,aSigner).toString('hex'),
  autorisation:'AWS4-HMAC-SHA256 Credential='+o.keyId+'/'+portee+',SignedHeaders='+noms.join(';')+',Signature='+hmac(k,aSigner).toString('hex')}}

const dateAmz=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d+Z$/,'Z');

/* cfg : {host, keyId, secret, bucket, region?, url?}. url (ex. http://127.0.0.1:9000) sert aux essais. */
function client(cfg){
 const base=cfg.url?new URL(cfg.url):new URL('https://'+String(cfg.host).replace(/^https?:\/\//,''));
 const lib=base.protocol==='http:'?http:https;
 function appel(methode,objet,corps,query){
  return new Promise((ok,ko)=>{
   const chemin='/'+cfg.bucket+(objet?'/'+objet:''),body=corps||Buffer.alloc(0),corpsSha=sha(body);
   const entetes={host:base.host,'x-amz-content-sha256':corpsSha,'x-amz-date':dateAmz(new Date())};
   const s=signer({methode,chemin,query:query||'',entetes,corpsSha,keyId:cfg.keyId,secret:cfg.secret,region:cfg.region,date:entetes['x-amz-date']});
   const r=lib.request({hostname:base.hostname,port:base.port||undefined,method:methode,path:encChemin(chemin)+(query?'?'+query:''),
    headers:Object.assign({},entetes,{authorization:s.autorisation,'content-length':body.length})},x=>{
     const c=[];x.on('data',d=>c.push(d));x.on('end',()=>{const b=Buffer.concat(c);ok({status:x.statusCode,corps:b,texte:b.subarray(0,200000).toString('utf8')})})});
   r.setTimeout(60000,()=>r.destroy(new Error('délai dépassé')));r.on('error',ko);r.end(body)})}
 const bon=(r,quoi)=>{if(r.status<200||r.status>=300)throw new Error(quoi+' : réponse '+r.status);return r};
 return{
  envoyer:async(objet,corps)=>bon(await appel('PUT',objet,corps),'envoi'),
  lire:async objet=>bon(await appel('GET',objet),'lecture').corps,
  supprimer:async objet=>{const r=await appel('DELETE',objet);if(r.status!==404)bon(r,'suppression');return r},
  lister:async prefixe=>{const r=bon(await appel('GET','',null,'list-type=2&prefix='+enc(prefixe||'')),'liste');
   return [...r.texte.matchAll(/<Key>([^<]+)<\/Key>/g)].map(m=>m[1])}}}

module.exports={client,signer,dateAmz};

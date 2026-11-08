/* Notifications « Web Push » sans dépendance (RFC 8291 + VAPID RFC 8292). */
'use strict';
const crypto=require('crypto'),https=require('https'),http=require('http');

const b64u=b=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const ub64=s=>Buffer.from(String(s).replace(/-/g,'+').replace(/_/g,'/'),'base64');
const hmac=(k,d)=>crypto.createHmac('sha256',k).update(d).digest();
// HKDF en une seule passe (longueur <= 32)
const hkdf=(salt,ikm,info,len)=>hmac(hmac(salt,ikm),Buffer.concat([info,Buffer.from([1])])).subarray(0,len);

/* Clés VAPID du serveur (P-256). Renvoie {pub (base64url, 65 octets), priv (base64url, 32 octets)} */
function vapidKeys(){
 const e=crypto.createECDH('prime256v1');e.generateKeys();
 return{pub:b64u(e.getPublicKey()),priv:b64u(e.getPrivateKey())}}

function privKeyObject(pubB64,privB64){
 const pub=ub64(pubB64);
 return crypto.createPrivateKey({key:{kty:'EC',crv:'P-256',d:b64u(ub64(privB64)),x:b64u(pub.subarray(1,33)),y:b64u(pub.subarray(33,65))},format:'jwk'})}

/* Chiffrement du message pour un abonnement (aes128gcm). salt et asKeys sont injectables pour les tests. */
function encrypt(plain,uaPubB64,authB64,opt={}){
 const ua=ub64(uaPubB64),auth=ub64(authB64);
 const as=crypto.createECDH('prime256v1');
 if(opt.asPriv)as.setPrivateKey(ub64(opt.asPriv));else as.generateKeys();
 const asPub=as.getPublicKey(),secret=as.computeSecret(ua);
 const ikm=hkdf(auth,secret,Buffer.concat([Buffer.from('WebPush: info\0'),ua,asPub]),32);
 const salt=opt.salt?ub64(opt.salt):crypto.randomBytes(16);
 const cek=hkdf(salt,ikm,Buffer.from('Content-Encoding: aes128gcm\0'),16);
 const nonce=hkdf(salt,ikm,Buffer.from('Content-Encoding: nonce\0'),12);
 const c=crypto.createCipheriv('aes-128-gcm',cek,nonce);
 const body=Buffer.concat([c.update(Buffer.concat([Buffer.from(plain),Buffer.from([2])])),c.final(),c.getAuthTag()]);
 const rs=Buffer.alloc(4);rs.writeUInt32BE(4096);
 return Buffer.concat([salt,rs,Buffer.from([asPub.length]),asPub,body])}

function vapidHeader(endpoint,keys,subject){
 const aud=new URL(endpoint).origin;
 const h=b64u(JSON.stringify({typ:'JWT',alg:'ES256'}));
 const p=b64u(JSON.stringify({aud,exp:Math.floor(Date.now()/1000)+12*3600,sub:subject||'mailto:contact@caso.app'}));
 const sig=crypto.sign('sha256',Buffer.from(h+'.'+p),{key:privKeyObject(keys.pub,keys.priv),dsaEncoding:'ieee-p1363'});
 return'vapid t='+h+'.'+p+'.'+b64u(sig)+', k='+keys.pub}

/* Envoie un message à un abonnement. Résout {status}. 404/410 = abonnement mort. */
function send(sub,payload,keys,opts={}){
 return new Promise(ok=>{
  try{
   const body=encrypt(JSON.stringify(payload),sub.keys.p256dh,sub.keys.auth);
   const u=new URL(sub.endpoint),lib=u.protocol==='http:'?http:https;
   const req=lib.request(u,{method:'POST',timeout:10000,headers:{
    'content-type':'application/octet-stream','content-encoding':'aes128gcm','content-length':body.length,
    ttl:String(opts.ttl||86400),urgency:'high',authorization:vapidHeader(sub.endpoint,keys,opts.subject)}},res=>{res.resume();ok({status:res.statusCode})});
   req.on('error',e=>ok({status:0,error:String(e.message||e)}));
   req.on('timeout',()=>{req.destroy();ok({status:0,error:'timeout'})});
   req.end(body);
  }catch(e){ok({status:0,error:String(e.message||e)})}})}

module.exports={vapidKeys,encrypt,vapidHeader,send,b64u,ub64};

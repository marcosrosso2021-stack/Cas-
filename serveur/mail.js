/* casô — envoi d'e-mails par Mailjet (API v3.1), sans dépendance.
   Variables (réglages de l'hébergement, jamais dans le code) :
     MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE  clés de l'API Mailjet
     MAIL_FROM                            adresse d'expédition validée chez Mailjet (ex. devis@caso.fr)
   L'e-mail part au nom de l'entreprise (nom affiché), depuis MAIL_FROM ; les réponses du client vont à l'artisan (Reply-To).
   Usage : const mail=require('./mail.js').creer({fetch?, env?}); mail.pret(); await mail.envoyer({to,toName,fromName,replyTo,subject,text,html}) */
'use strict';
const MAIL_OK=/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cut=(v,n)=>String(v==null?'':v).replace(/[\r\n]+/g,' ').slice(0,n);

/* e-mail en HTML simple : le texte de l'artisan (échappé), un bouton vers le lien, et la signature casô discrète */
function html({text,lien,bouton,entreprise}){
 const P=String(text||'').split(/\n{2,}/).map(p=>'<p style="margin:0 0 14px">'+esc(p).replace(/\n/g,'<br>')+'</p>').join('');
 const b=lien?'<p style="margin:22px 0"><a href="'+esc(lien)+'" style="display:inline-block;background:#ffc21a;color:#18181a;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:12px">'+esc(bouton||'Ouvrir')+'</a></p>':'';
 return '<!doctype html><html lang="fr"><body style="margin:0;background:#f2f2ef;padding:24px 12px;font:15px/1.55 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#18181a">'
  +'<div style="max-width:560px;margin:0 auto;background:#fbfbfa;border:1px solid #e2e1dc;border-radius:16px;padding:24px 22px">'
  +(entreprise?'<div style="font-weight:800;font-size:17px;margin:0 0 16px">'+esc(entreprise)+'</div>':'')+P+b+'</div>'
  +'<p style="max-width:560px;margin:14px auto 0;text-align:center;font-size:12px;color:#6b6b70">Envoyé avec casô · l’appli des artisans</p></body></html>'}

function creer(o){
 o=o||{};const env=o.env||process.env,fx=o.fetch||((u,x)=>fetch(u,x));
 const pub=()=>env.MJ_APIKEY_PUBLIC||'',priv=()=>env.MJ_APIKEY_PRIVATE||'',from=()=>env.MAIL_FROM||'';
 function pret(){return !!(pub()&&priv()&&MAIL_OK.test(from()))}
 async function envoyer(m){
  if(!pret()){const e=new Error('L\'envoi d\'e-mails n\'est pas encore branché sur ce serveur.');e.code=503;e.off=true;throw e}
  const to=String(m.to||'').trim().toLowerCase();
  if(!MAIL_OK.test(to)){const e=new Error('E-mail du destinataire invalide.');e.code=400;throw e}
  const msg={From:{Email:from(),Name:cut(m.fromName||'casô',80)},To:[{Email:to,Name:cut(m.toName,80)||undefined}],
   Subject:cut(m.subject,200),TextPart:String(m.text||'').slice(0,8000),HTMLPart:m.html||undefined,CustomID:cut(m.id,60)||undefined};
  if(m.replyTo&&MAIL_OK.test(String(m.replyTo).trim()))msg.ReplyTo={Email:String(m.replyTo).trim(),Name:cut(m.fromName,80)||undefined};
  let r;try{r=await fx('https://api.mailjet.com/v3.1/send',{method:'POST',headers:{'content-type':'application/json',authorization:'Basic '+Buffer.from(pub()+':'+priv()).toString('base64')},body:JSON.stringify({Messages:[msg]})})}
  catch(e){const x=new Error('Le service d\'e-mail ne répond pas. Réessaie dans un instant.');x.code=502;throw x}
  let j=null;try{j=await r.json()}catch(e){}
  const s=j&&j.Messages&&j.Messages[0];
  if(!r.ok||!s||s.Status!=='success'){const e=new Error('E-mail refusé par le service d\'envoi.');e.code=502;e.detail=s&&s.Errors;throw e}
  const t=s.To&&s.To[0];return{id:t&&(t.MessageUUID||t.MessageID)||null}}
 return{pret,envoyer,html}}
module.exports={creer,html,MAIL_OK};

/* casô · Paiement : factures et paiements dictés (« facture Osvald », « Osvald a payé 500 € »)
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* à part : ces phrases utilisent une syntaxe que les vieux iPhone ne lisent pas, une erreur ici n'arrête pas le reste */
function faChat(t){
 const f=agFold(t);let m;
 if((m=/^(?:(?:fais|fait|faire|prepare|preparer|cree|creer|genere|edite|etablis|emets|sors)(?:[ -]moi)? )?(?:la |une |ma )?facture(?: d'acompte| finale)?(?: (?:pour|de|a|du devis de|chez))?\s+(.+)$/.exec(f.trim()))){
  const nm=t.trim().slice(t.trim().length-m[1].length).replace(/[.!?]+$/,'');const c=findBy(db.clients,nm);if(!c)return false;
  const o=db.quotes.filter(x=>nameKey(x.client)===nameKey(c.nom)&&['accepte','paye'].includes(x.status)).sort((a,b)=>(b.date||'').localeCompare(a.date||''))[0];
  if(CHAT.qid!==q.id)CHAT={qid:q.id,m:[]};CHAT.m.push({who:'me',text:t});
  if(!o){CHAT.m.push({who:'bot',html:`<p><span>Pas de devis validé pour</span> <b data-noi18n>${esc(c.nom)}</b>. <span>Fais-le signer d'abord.</span></p>`});chatSave();chatRender(true);return true}
  chatSave();chatRender(true);faNew(o.id,/acompte/.test(f)?'acompte':/finale/.test(f)?'solde':undefined);return true}
 if((m=/(.+?)\s+(?:m'a |a )?(?:paye|regle|vire)(?:\s+(\d[\d\s]*(?:[.,]\d{1,2})?)\s*(?:€|euros?))?/.exec(f))&&!/(?<![\p{L}])(je|j'ai|on a)(?![\p{L}])/u.test(m[1])){
  const nm=t.trim().slice(0,m[1].length).replace(/^(le client|la cliente|client)\s+/i,'');const c=findBy(db.clients,nm);if(!c)return false;
  const F=db.invoices.filter(x=>x.num&&x.kind!=='avoir'&&nameKey(x.client.nom)===nameKey(c.nom)&&faDue(x)>0.005).sort((a,b)=>a.date.localeCompare(b.date));
  if(CHAT.qid!==q.id)CHAT={qid:q.id,m:[]};CHAT.m.push({who:'me',text:t});
  if(!F.length){CHAT.m.push({who:'bot',html:`<p><span>Aucune facture à encaisser pour</span> <b data-noi18n>${esc(c.nom)}</b>.</p>`});chatSave();chatRender(true);return true}
  const x=F[0];
  if(!m[2]&&!/(tout|facture|solde|totalite|integralite|le reste)/.test(f)){
   CHAT.m.push({who:'bot',html:`<p><b data-noi18n>${esc(c.nom)}</b> · <span data-noi18n>${esc(x.num)}</span> : <span>reste dû</span> <b data-noi18n>${eur(faDue(x))}</b>. <span>Combien a-t-il payé ?</span></p><div class="msg-act"><button class="btn sm" onclick="faPayAll('${x.id}')"><svg class="i"><use href="#i-check"/></svg>Tout le reste dû</button><button class="btn sm sec" onclick="faShow('${x.id}');setTimeout(faPayOpen,300)">Autre montant</button></div>`});chatSave();chatRender(true);return true}
  const amt=m[2]?faR2(parseFloat(m[2].replace(/\s/g,'').replace(',','.'))):faDue(x),mode=/cheque/.test(f)?'chq':/espece|liquide|cash/.test(f)?'esp':/carte|cb/.test(f)?'cb':'vir';
  faPayAdd(x,{d:agToday(),amt,mode});faAfterPay(x);save();faShareSync(x).catch(()=>{});
  CHAT.m.push({who:'bot',html:`<p><svg class="i i-sm ok-c"><use href="#i-check"/></svg> <span>Paiement enregistré</span> : <b data-noi18n>${eur(amt)}</b> · <span data-noi18n>${esc(x.num)}</span></p><p class="mut"><span>Reste dû</span> : <b data-noi18n>${eur(faDue(x))}</b></p><div class="msg-act"><button class="btn sm sec" onclick="faShow('${x.id}')"><svg class="i"><use href="#i-doc"/></svg>Voir la facture</button></div>`});
  chatSave();chatRender(true);return true}
 return false}

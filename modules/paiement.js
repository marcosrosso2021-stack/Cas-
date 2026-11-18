/* casô · Paiement : paiements reçus, relance, avoir, encaissements, export pour le comptable
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---- paiements, relance, avoir ---- */
/* ---- encaissements : total par période, export pour le comptable ---- */
function encRange(){const v=$('encP').value,t=agToday(),y=+t.slice(0,4),m=+t.slice(5,7),z=n=>String(n).padStart(2,'0');$('encC').hidden=v!=='c';
 const last=(Y,M)=>`${Y}-${z(M)}-${z(new Date(Y,M,0).getDate())}`;
 if(v==='m')return[`${y}-${z(m)}-01`,last(y,m)];if(v==='pm'){const Y=m===1?y-1:y,M=m===1?12:m-1;return[`${Y}-${z(M)}-01`,last(Y,M)]}
 if(v==='y')return[`${y}-01-01`,`${y}-12-31`];if(v==='py')return[`${y-1}-01-01`,`${y-1}-12-31`];
 return[$('encA').value||'0000-01-01',$('encB').value||'9999-12-31']}
function encRows(){const [a,b]=encRange(),R=[];
 (db.invoices||[]).forEach(f=>{if(f.kind==='avoir'||!f.num)return;(f.pays||[]).forEach(p=>{if(p.d>=a&&p.d<=b)R.push({d:p.d,num:f.num,client:(f.client&&f.client.nom)||'',mode:p.mode,amt:+p.amt||0,cancel:!!p.cancels,off:!p.cancels&&faPayOff(f,p)})})});
 return R.sort((x,y)=>y.d.localeCompare(x.d)||y.amt-x.amt)}
/* à encaisser : factures émises pas encore soldées, les plus en retard d'abord ; un appui ouvre la facture (encaisser, relancer, avoir) */
function encDues(){return(db.invoices||[]).filter(f=>f.num&&f.kind!=='avoir'&&faDue(f)>0.005).sort((x,y)=>(x.due||x.date||'').localeCompare(y.due||y.date||''))}
function encDuesHtml(){const L=encDues();if(!L.length)return'';const tot=faR2(L.reduce((s,f)=>s+faDue(f),0)),t=agToday();
 return `<div class="card enc-t enc-du"><span class="mut">À encaisser</span><b data-noi18n>${eur(tot)}</b></div><div class="lst">`+L.map(f=>{const late=f.due&&f.due<t;
  return `<button type="button" class="it enc-r${late?' late':''}" onclick="faShow('${f.id}')"><span class="it-t"><span><b data-noi18n>${esc((f.client&&f.client.nom)||'')}</b> <span class="mut" data-noi18n>${esc(f.num)}</span></span><span class="mut">${late?`<span class="enc-late">${esc(i18nT('En retard'))}</span> · `:''}<span data-noi18n>${esc(agFmtD(f.due||f.date,{weekday:undefined}))}</span></span></span><b data-noi18n>${eur(faDue(f))}</b></button>`}).join('')+`</div>`}
function encRender(){if(!$('encOut'))return;if($('encAud'))$('encAud').innerHTML=faAuditHtml();if($('encDue'))$('encDue').innerHTML=encDuesHtml();const R=encRows(),tot=faR2(R.reduce((s,x)=>s+x.amt,0)),by={};R.forEach(x=>{by[x.mode]=faR2((by[x.mode]||0)+x.amt)});
 $('encOut').innerHTML=`<div class="card enc-t"><span class="mut">Total encaissé</span><b data-noi18n>${eur(tot)}</b><div class="enc-m">`+Object.keys(FA_MODE).filter(k=>by[k]).map(k=>`<span><span>${esc(FA_MODE[k])}</span> <b data-noi18n>${eur(by[k])}</b></span>`).join('')+`</div></div>`+
  (R.length?`<div class="lst">`+R.map(x=>`<div class="it enc-r${x.off?' off':''}${x.cancel?' neg':''}"><span class="it-t"><span><b data-noi18n>${esc(x.client)}</b> <span class="mut" data-noi18n>${esc(x.num)}</span></span><span class="mut"><span data-noi18n>${esc(agFmtD(x.d,{weekday:undefined}))}</span> · <span>${esc(FA_MODE[x.mode]||'')}</span>${x.cancel?' · <span>annulation</span>':''}</span></span><b data-noi18n>${eur(x.amt)}</b></div>`).join('')+`</div>`:`<p class="mut">Aucun encaissement sur cette période.</p>`)}
function encCsv(){const R=encRows(),[a,b]=encRange(),q=v=>'"'+String(v).replace(/"/g,'""')+'"',n=v=>String(faR2(v)).replace('.',',');
 const L=['Date;Facture;Client;Mode;Montant (€);Type'].concat(R.slice().reverse().map(x=>[x.d,q(x.num),q(x.client),q(FA_MODE[x.mode]||x.mode),n(x.amt),x.cancel?'Annulation':x.off?'Paiement annulé':'Paiement'].join(';')));
 L.push(['','','','Total',n(R.reduce((s,x)=>s+x.amt,0)),''].join(';'));
 dl('encaissements-'+(a.startsWith('0000')?'debut':a)+'-'+(b.startsWith('9999')?'fin':b)+'.csv','\ufeff'+L.join('\n'),'text/csv')}
function faPayOpen(){const f=FA;$('faPa').value=String(faDue(f)).replace('.',',');$('faPd').value=agToday();$('faPm').value='vir';
 $('faPayBg').hidden=false;$('faPay').hidden=false;requestAnimationFrame(()=>{$('faPay').classList.add('on');$('faPayBg').classList.add('on')})}
function faPayClose(){$('faPay').classList.remove('on');$('faPayBg').classList.remove('on');setTimeout(()=>{$('faPay').hidden=true;$('faPayBg').hidden=true},200)}
function faPaySave(){
 const f=FA,a=faR2(parseFloat(String($('faPa').value).replace(/\s/g,'').replace(',','.'))),d=$('faPd').value;
 if(!(a>0)){toast(i18nT('Montant invalide.'));return}
 if(a>faDue(f)+0.005&&!confirm('Le montant dépasse le reste dû. Continuer ?'))return;
 faPayAdd(f,{d:d||agToday(),amt:a,mode:$('faPm').value});
 faAfterPay(f);save();faPayClose();faRender();faShareSync(f).catch(()=>{});toast(i18nT(faDue(f)<=0.005?'Facture payée.':'Paiement enregistré.'))}
function faAfterPay(f){ // devis payé quand la facture finale (ou complète) est soldée
 if(faState(f)!=='payee'||f.kind==='acompte')return;const o=db.quotes.find(x=>x.id===f.qid);
 if(o&&o.status!=='paye'){o.status='paye';o.paidAt=Date.now()}}
function faMsg(f,relance){const t=faTot(f),P=f.seller||faProf(),due=faDue(f),L=f.share&&f.share.url;
 return relance?`Bonjour ${f.client.nom},\n\nSauf erreur de notre part, la facture ${f.num} du ${dFR(f.date)} (${eur(due)} restant dû) est arrivée à échéance le ${dFR(f.due)}.\n${L?'Vous pouvez la consulter et la régler ici : '+L+'\n':''}${!L&&P.iban?'IBAN : '+P.iban+'\n':''}\nCordialement,\n${P.nom}${P.tel?'\n'+P.tel:''}`
  :`Bonjour ${f.client.nom},\n\n${f.kind==='avoir'?"Voici l'avoir":'Voici la facture'} ${f.num} d'un montant de ${eur(Math.abs(t.net))}${f.kind==='avoir'?'':', à régler '+(f.due===f.date?'à réception':'avant le '+dFR(f.due))}.\n${L?'Consultez-la ici : '+L+'\n':''}${!L&&P.iban&&f.kind!=='avoir'?'IBAN : '+P.iban+'\n':''}\nMerci,\n${P.nom}${P.tel?'\n'+P.tel:''}`}
function faCalc(f){const t=faTot(f),pays=f.pays||[];return Object.assign({},t,{paid:faPaidReal(f),credited:faCredited(f),due:faDue(f),state:faState(f),paidAt:faState(f)==='payee'?(pays.length?pays[pays.length-1].d:agToday()):null,
 avoirs:db.invoices.filter(a=>a.kind==='avoir'&&a.ref===f.id&&a.num).map(a=>({num:a.num,date:a.date,amt:Math.abs(faTot(a).net)}))})}
const faTeam=()=>{const c=getSync();return !!(c.url&&c.token)};
async function faShareSync(f,quiet){ // le lien du client reflète toujours la facture (paiements, avoirs)
 if(!f||!f.num||!faTeam())return null;
 const doc=Object.assign({},f,{calc:faCalc(f)});delete doc.share;
 const j=await apiTeam('/api/inv/share',{doc});f.share={url:j.url,token:j.token};if(j.viewedAt)f.viewedAt=j.viewedAt;if(j.cert)f.cert=j.cert;save();return j}
let faMsgTxt='';
async function faSend(relance){
 const f=FA;if(!f||!f.num)return;
 if(faTeam()){try{await faShareSync(f)}catch(e){toast(e.message||i18nT('Erreur.'));return}}
 faMsgTxt=faMsg(f,!!relance);
 const tel=(f.client.tel||'').replace(/[^\d+]/g,''),body=encodeURIComponent(faMsgTxt);
 $('faSms').href='sms:'+tel+(/iP(hone|ad)/.test(navigator.userAgent)?'&':'?')+'body='+body;
 $('faWa').href='https://wa.me/'+tel.replace(/^0/,'33').replace(/^\+/,'')+'?text='+body;
 $('faMail').href='mailto:'+encodeURIComponent(f.client.email||'')+'?subject='+encodeURIComponent((f.kind==='avoir'?'Avoir ':'Facture ')+f.num)+'&body='+body;
 $('faShNo').hidden=faTeam();FA._rel=!!relance;
 $('faShBg').hidden=false;$('faSh').hidden=false;requestAnimationFrame(()=>{$('faSh').classList.add('on');$('faShBg').classList.add('on')})}
function faShClose(){$('faSh').classList.remove('on');$('faShBg').classList.remove('on');setTimeout(()=>{$('faSh').hidden=true;$('faShBg').hidden=true},200)}
function faVia(c){
 const f=FA;faShClose();
 const done=()=>{if(FA._rel){f.relances=(f.relances||[]).concat(Date.now());toast(i18nT('Relance préparée.'))}else f.sent=Date.now();save();faRender()};
 if(c==='copy'){(navigator.clipboard?navigator.clipboard.writeText(f.share&&!FA._rel?f.share.url:faMsgTxt):Promise.reject()).then(()=>toast(i18nT('Lien copié.')),()=>{});done();return}
 if(c==='share'){if(navigator.share)navigator.share({title:(f.kind==='avoir'?'Avoir ':'Facture ')+f.num,text:faMsgTxt}).then(done).catch(()=>{});return}
 const a=$(c==='sms'?'faSms':c==='wa'?'faWa':'faMail');done();if(a&&a.href)location.href=a.href}
async function faRelance(){return faSend(true)}
function faAvoir(){
 const f=FA,due=faDue(f),cr=faCredited(f),tot=faR2(faTot(f).net-cr);
 if(tot<=0.005){toast(i18nT('Cette facture est déjà entièrement annulée par avoir.'));return}
 const v=prompt('Montant TTC de l\'avoir (le total de la facture pour tout annuler) :',String(Math.min(tot,due>0?due:tot)).replace('.',','));if(v===null)return;
 const a=faR2(parseFloat(String(v).replace(/\s/g,'').replace(',','.')));if(!(a>0)||a>tot+0.005){toast(i18nT('Montant invalide.'));return}
 const full=!cr&&Math.abs(a-tot)<0.005,t=faTot(f),today=agToday();
 const av={id:uid(),kind:'avoir',ref:f.id,qid:f.qid,qnum:f.qnum,date:today,done:f.done,due:today,client:Object.assign({},f.client),chantier:f.chantier,remise:full?f.remise:0,franchise:f.franchise,autoliq:f.autoliq,ret:full?(f.ret||0):0,ded:full?(f.ded||[]).map(d=>Object.assign({},d,{ttc:-d.ttc})):undefined,pays:[],
  lines:full?f.lines.map(l=>Object.assign({},l,{pu:-l.pu})):Object.keys(t.tv).length<=1||f.franchise||f.autoliq?[{label:`Avoir sur la facture ${f.num}`,qty:1,unit:'forfait',pu:-faR2(a/(1+((f.franchise||f.autoliq)?0:(+Object.keys(t.tv)[0]||0))/100)),tva:+(Object.keys(t.tv)[0]||0)}]
   :Object.keys(t.tv).map(k=>{const htk=f.lines.filter(l=>l.tva==+k).reduce((x,l)=>x+l.qty*l.pu*(1-(f.remise||0)/100),0),share=t.ttc?htk*(1+k/100)/t.ttc:0;return{label:`Avoir sur la facture ${f.num} (TVA ${k} %)`,qty:1,unit:'forfait',pu:-faR2(a*share/(1+k/100)),tva:+k}})};
 if(!full){const L0=av.lines[0],rt=(av.franchise||av.autoliq)?0:L0.tva;for(let k=0;k<3;k++){const d=faR2(-a-faTot(av).net);if(Math.abs(d)<0.005)break;L0.pu=faR2(L0.pu+d/(1+rt/100))}}
 FA=av;faRender();toast(i18nT('Vérifie puis émets l\'avoir.'))}

/* ---- le chat : « Osvald a payé » (bouton « Facture payée ») ---- */
function faPayAll(id){const x=db.invoices.find(f=>f.id===id);if(!x)return;const amt=faDue(x);if(amt<=0)return;
 faPayAdd(x,{d:agToday(),amt,mode:'vir'});faAfterPay(x);save();faShareSync(x).catch(()=>{});
 chatPush({who:'bot',html:`<p><svg class="i i-sm ok-c"><use href="#i-check"/></svg> <span>Facture payée.</span> <b data-noi18n>${eur(amt)}</b> · <span data-noi18n>${esc(x.num)}</span></p>`})}

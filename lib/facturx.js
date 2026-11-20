/* casô — facture électronique : données structurées au format CII (Factur-X, profil EN 16931).
   Le même fichier sert dans l'appli (window.CasoFacturX) et sur le serveur (require). Aucune dépendance.
   Entrée : une facture émise de casô (db.invoices, figée à l'émission : seller, client, lines, remise, franchise, autoliq, ded, ret,
   kind, num, date, done, due, chantier, cat, debits). Sortie : le XML CII, à joindre au PDF (Factur-X) ou à envoyer à la plateforme agréée.

   Règles reprises :
   - type : 380 facture, 386 facture d'acompte, 381 avoir ; montants de l'avoir en positif (le type porte le sens) ;
   - cadre de facturation (BT-23) : B1 biens, S1 services, M1 mixte ; à confirmer avec la plateforme agréée ;
   - TVA : catégorie S (taux normal, intermédiaire, réduit), E (franchise, art. 293 B du CGI), AE (autoliquidation) ;
     exigibilité (BT-8) : 5 = TVA sur les débits (option), 72 = TVA à l'encaissement (prestations de services, par défaut) ;
   - remise globale de casô (en %) : appliquée au prix net de chaque ligne, comme le calcul des totaux de l'appli ;
   - acomptes déjà facturés (ded) : montant déjà payé (BT-113) ; la retenue de garantie est rappelée en note. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory();
 else root.CasoFacturX=factory();
})(typeof self!=='undefined'?self:this,function(){
'use strict';
const R2=v=>Math.round((+v||0)*100)/100;
const M=v=>R2(v).toFixed(2);
const esc=s=>String(s==null?'':s).replace(/[<>&'"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));
const jour=d=>String(d||'').slice(0,10).replace(/-/g,'');
const chiffres=s=>String(s||'').replace(/\D/g,'');
/* unités courantes du bâtiment → codes de l'ONU (UN/ECE recommandation 20) ; C62 = unité */
const UNITES={'u':'C62','unité':'C62','unite':'C62','pce':'H87','pièce':'H87','piece':'H87','h':'HUR','heure':'HUR','heures':'HUR','j':'DAY','jour':'DAY','jours':'DAY',
 'm':'MTR','ml':'MTR','m2':'MTK','m²':'MTK','m3':'MTQ','m³':'MTQ','kg':'KGM','t':'TNE','l':'LTR','forfait':'C62','ens':'C62','lot':'C62'};
const unite=u=>UNITES[String(u||'').trim().toLowerCase()]||'C62';
const CADRE={LB:'B1',PS:'S1',LBPS:'M1'};
const TYPE={facture:'380',solde:'380',acompte:'386',avoir:'381'};

/* calcul identique à faTot() de l'appli, par ligne et par taux */
function calculer(f){
 const r=(+f.remise||0)/100,sign=f.kind==='avoir'?-1:1,cat=f.franchise?'E':f.autoliq?'AE':'S';
 const lignes=(f.lines||[]).map((l,i)=>{const av=f.kind==='avoir',pu0=av?Math.abs(+l.pu||0):(+l.pu||0),q=av?Math.abs(+l.qty||0):(+l.qty||0),pu=R2(pu0*(1-r)),ht=R2(q*pu0*(1-r));
  return{id:i+1,nom:l.label||'',q,unite:unite(l.unit),pu,ht,taux:cat==='S'?(+l.tva||0):0,cat}});
 const parTaux={};lignes.forEach(l=>{const k=l.cat+'|'+l.taux;(parTaux[k]=parTaux[k]||{cat:l.cat,taux:l.taux,base:0}).base+=l.ht});
 const tva=Object.values(parTaux).map(t=>({cat:t.cat,taux:t.taux,base:R2(t.base),montant:R2(t.base*t.taux/100)}));
 const ht=R2(lignes.reduce((a,l)=>a+l.ht,0)),totTva=R2(tva.reduce((a,t)=>a+t.montant,0)),ttc=R2(ht+totTva);
 const deja=R2((f.ded||[]).reduce((a,d)=>a+(+d.ttc||0),0));
 return{sign,lignes,tva,ht,totTva,ttc,deja,du:R2(ttc-deja),ret:R2(ttc*(+f.ret||0)/100)}}

/* les champs dont la plateforme a besoin : liste des manques (vide = la facture peut partir) */
function controler(f){
 const s=f.seller||{},c=f.client||{},m=[];
 if(!f.num)m.push('numéro de facture');if(!f.date)m.push('date de la facture');
 if(chiffres(s.siret).length!==14)m.push('SIRET de l\'entreprise');
 if(!s.nom)m.push('nom de l\'entreprise');if(!s.adr)m.push('adresse de l\'entreprise');
 if(!c.nom)m.push('nom du client');
 if(c.pro&&chiffres(c.siren).length!==9)m.push('SIREN du client');
 if(!(f.lines||[]).length)m.push('lignes de la facture');
 if(f.kind==='avoir'&&!f.refNum)m.push('facture d\'origine de l\'avoir');
 return m}

function xml(f){
 const s=f.seller||{},c=f.client||{},k=calculer(f),neg=v=>M(v);
 const siren=chiffres(s.siret).slice(0,9)||chiffres(s.siren),csiren=chiffres(c.siren).slice(0,9);
 const cadre=CADRE[f.cat]||'S1',exig=f.debits?'5':'72';
 const notes=[];
 if(f.franchise)notes.push(['TVA non applicable, art. 293 B du CGI','AAI']);
 if(f.autoliq)notes.push(['Autoliquidation : TVA due par le preneur (art. 283-2 nonies du CGI)','AAI']);
 if(f.debits)notes.push(['Option pour le paiement de la taxe d\'après les débits','AAI']);
 if(k.ret)notes.push(['Retenue de garantie de '+(+f.ret)+' % : '+M(k.ret)+' EUR','AAB']);
 if(s.penal)notes.push([s.penal,'PMD']);
 const raisonExo=t=>t.cat==='E'?'<ram:ExemptionReason>TVA non applicable, art. 293 B du CGI</ram:ExemptionReason><ram:ExemptionReasonCode>VATEX-FR-FRANCHISE</ram:ExemptionReasonCode>'
  :t.cat==='AE'?'<ram:ExemptionReason>Autoliquidation</ram:ExemptionReason><ram:ExemptionReasonCode>VATEX-EU-AE</ram:ExemptionReasonCode>':'';
 const adr=(a,pays)=>{a=String(a||'').trim();const cp=/(\d{5})\s+([^\d,]+)$/.exec(a);const l1=cp?a.slice(0,cp.index).replace(/[\s,]+$/,''):a;
  return '<ram:PostalTradeAddress>'+(cp?'<ram:PostcodeCode>'+cp[1]+'</ram:PostcodeCode>':'')+(l1?'<ram:LineOne>'+esc(l1)+'</ram:LineOne>':'')+(cp?'<ram:CityName>'+esc(cp[2].trim())+'</ram:CityName>':'')+'<ram:CountryID>'+(pays||'FR')+'</ram:CountryID></ram:PostalTradeAddress>'};
 const L=k.lignes.map(l=>'<ram:IncludedSupplyChainTradeLineItem>'+
  '<ram:AssociatedDocumentLineDocument><ram:LineID>'+l.id+'</ram:LineID></ram:AssociatedDocumentLineDocument>'+
  '<ram:SpecifiedTradeProduct><ram:Name>'+esc(l.nom)+'</ram:Name></ram:SpecifiedTradeProduct>'+
  '<ram:SpecifiedLineTradeAgreement><ram:NetPriceProductTradePrice><ram:ChargeAmount>'+M(l.pu)+'</ram:ChargeAmount></ram:NetPriceProductTradePrice></ram:SpecifiedLineTradeAgreement>'+
  '<ram:SpecifiedLineTradeDelivery><ram:BilledQuantity unitCode="'+l.unite+'">'+(+l.q.toFixed(4))+'</ram:BilledQuantity></ram:SpecifiedLineTradeDelivery>'+
  '<ram:SpecifiedLineTradeSettlement><ram:ApplicableTradeTax><ram:TypeCode>VAT</ram:TypeCode><ram:CategoryCode>'+l.cat+'</ram:CategoryCode><ram:RateApplicablePercent>'+l.taux+'</ram:RateApplicablePercent></ram:ApplicableTradeTax>'+
  '<ram:SpecifiedTradeSettlementLineMonetarySummation><ram:LineTotalAmount>'+M(l.ht)+'</ram:LineTotalAmount></ram:SpecifiedTradeSettlementLineMonetarySummation></ram:SpecifiedLineTradeSettlement>'+
  '</ram:IncludedSupplyChainTradeLineItem>').join('');
 const T=k.tva.map(t=>'<ram:ApplicableTradeTax><ram:CalculatedAmount>'+M(t.montant)+'</ram:CalculatedAmount><ram:TypeCode>VAT</ram:TypeCode>'+raisonExo(t)+
  '<ram:BasisAmount>'+M(t.base)+'</ram:BasisAmount><ram:CategoryCode>'+t.cat+'</ram:CategoryCode>'+(t.cat==='S'?'<ram:DueDateTypeCode>'+exig+'</ram:DueDateTypeCode>':'')+
  '<ram:RateApplicablePercent>'+t.taux+'</ram:RateApplicablePercent></ram:ApplicableTradeTax>').join('');
 const livr=f.chantier&&f.chantier!==c.adr?'<ram:ShipToTradeParty><ram:Name>'+esc(c.nom||'Chantier')+'</ram:Name>'+adr(f.chantier)+'</ram:ShipToTradeParty>':'';
 return '<?xml version="1.0" encoding="UTF-8"?>\n'+
 '<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100" xmlns:qdt="urn:un:unece:uncefact:data:standard:QualifiedDataType:100" xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">'+
 '<rsm:ExchangedDocumentContext><ram:BusinessProcessSpecifiedDocumentContextParameter><ram:ID>'+cadre+'</ram:ID></ram:BusinessProcessSpecifiedDocumentContextParameter>'+
 '<ram:GuidelineSpecifiedDocumentContextParameter><ram:ID>urn:cen.eu:en16931:2017</ram:ID></ram:GuidelineSpecifiedDocumentContextParameter></rsm:ExchangedDocumentContext>'+
 '<rsm:ExchangedDocument><ram:ID>'+esc(f.num)+'</ram:ID><ram:TypeCode>'+(TYPE[f.kind]||'380')+'</ram:TypeCode>'+
 '<ram:IssueDateTime><udt:DateTimeString format="102">'+jour(f.date)+'</udt:DateTimeString></ram:IssueDateTime>'+
 notes.map(n=>'<ram:IncludedNote><ram:Content>'+esc(n[0])+'</ram:Content><ram:SubjectCode>'+n[1]+'</ram:SubjectCode></ram:IncludedNote>').join('')+'</rsm:ExchangedDocument>'+
 '<rsm:SupplyChainTradeTransaction>'+L+
 '<ram:ApplicableHeaderTradeAgreement>'+(f.qnum?'<ram:BuyerReference>'+esc(f.qnum)+'</ram:BuyerReference>':'')+
  '<ram:SellerTradeParty><ram:Name>'+esc(s.nom)+'</ram:Name><ram:SpecifiedLegalOrganization><ram:ID schemeID="0002">'+siren+'</ram:ID></ram:SpecifiedLegalOrganization>'+adr(s.adr)+
  (s.email?'<ram:URIUniversalCommunication><ram:URIID schemeID="EM">'+esc(s.email)+'</ram:URIID></ram:URIUniversalCommunication>':'')+
  (s.tva&&!f.franchise?'<ram:SpecifiedTaxRegistration><ram:ID schemeID="VA">'+esc(s.tva)+'</ram:ID></ram:SpecifiedTaxRegistration>':'')+'</ram:SellerTradeParty>'+
  '<ram:BuyerTradeParty><ram:Name>'+esc(c.nom)+'</ram:Name>'+(c.pro&&csiren?'<ram:SpecifiedLegalOrganization><ram:ID schemeID="0002">'+csiren+'</ram:ID></ram:SpecifiedLegalOrganization>':'')+adr(c.adr)+
  (c.tvai?'<ram:SpecifiedTaxRegistration><ram:ID schemeID="VA">'+esc(c.tvai)+'</ram:ID></ram:SpecifiedTaxRegistration>':'')+'</ram:BuyerTradeParty>'+
  (f.qnum?'<ram:SellerOrderReferencedDocument><ram:IssuerAssignedID>'+esc(f.qnum)+'</ram:IssuerAssignedID></ram:SellerOrderReferencedDocument>':'')+
 '</ram:ApplicableHeaderTradeAgreement>'+
 '<ram:ApplicableHeaderTradeDelivery>'+livr+(f.done?'<ram:ActualDeliverySupplyChainEvent><ram:OccurrenceDateTime><udt:DateTimeString format="102">'+jour(f.done)+'</udt:DateTimeString></ram:OccurrenceDateTime></ram:ActualDeliverySupplyChainEvent>':'')+'</ram:ApplicableHeaderTradeDelivery>'+
 '<ram:ApplicableHeaderTradeSettlement><ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>'+
  (s.iban?'<ram:SpecifiedTradeSettlementPaymentMeans><ram:TypeCode>58</ram:TypeCode><ram:PayeePartyCreditorFinancialAccount><ram:IBANID>'+esc(String(s.iban).replace(/\s/g,''))+'</ram:IBANID></ram:PayeePartyCreditorFinancialAccount></ram:SpecifiedTradeSettlementPaymentMeans>':'')+
  T+
  (f.due?'<ram:SpecifiedTradePaymentTerms><ram:DueDateDateTime><udt:DateTimeString format="102">'+jour(f.due)+'</udt:DateTimeString></ram:DueDateDateTime></ram:SpecifiedTradePaymentTerms>':'')+
  '<ram:SpecifiedTradeSettlementHeaderMonetarySummation><ram:LineTotalAmount>'+neg(k.ht)+'</ram:LineTotalAmount><ram:TaxBasisTotalAmount>'+neg(k.ht)+'</ram:TaxBasisTotalAmount>'+
  '<ram:TaxTotalAmount currencyID="EUR">'+neg(k.totTva)+'</ram:TaxTotalAmount><ram:GrandTotalAmount>'+neg(k.ttc)+'</ram:GrandTotalAmount>'+
  (k.deja?'<ram:TotalPrepaidAmount>'+neg(k.deja)+'</ram:TotalPrepaidAmount>':'')+'<ram:DuePayableAmount>'+neg(k.du)+'</ram:DuePayableAmount></ram:SpecifiedTradeSettlementHeaderMonetarySummation>'+
  (f.kind==='avoir'&&f.refNum?'<ram:InvoiceReferencedDocument><ram:IssuerAssignedID>'+esc(f.refNum)+'</ram:IssuerAssignedID>'+(f.refDate?'<ram:FormattedIssueDateTime><qdt:DateTimeString format="102">'+jour(f.refDate)+'</qdt:DateTimeString></ram:FormattedIssueDateTime>':'')+'</ram:InvoiceReferencedDocument>':'')+
 '</ram:ApplicableHeaderTradeSettlement></rsm:SupplyChainTradeTransaction></rsm:CrossIndustryInvoice>'}

return{xml,calculer,controler,unite,CADRE,TYPE}});

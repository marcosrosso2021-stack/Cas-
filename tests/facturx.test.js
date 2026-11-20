/* Tests du format de facture électronique (lib/facturx.js, CII Factur-X EN 16931).
   Lancer : node tests/facturx.test.js   (xmllint, s'il est installé, contrôle que le XML est bien formé) */
'use strict';
const fs=require('fs'),os=require('os'),path=require('path'),{execFileSync}=require('child_process');
const FX=require('../lib/facturx.js');
const R=[];const ok=(n,c,x)=>R.push((c?'OK   ':'FAIL ')+n+(x!==undefined&&!c?'  ['+x+']':''));
const R2=v=>Math.round((+v||0)*100)/100;
/* totaux de l'appli (modules/facturation.js, faTot) : la référence */
function faTot(f){const r=(f.remise||0)/100,tv={};let ht=0;
 f.lines.forEach(l=>{const m=R2(l.qty*l.pu*(1-r));ht+=m;const t=f.franchise||f.autoliq?0:l.tva;tv[t]=(tv[t]||0)+m*t/100});
 Object.keys(tv).forEach(k=>tv[k]=R2(tv[k]));ht=R2(ht);const tva=R2(Object.values(tv).reduce((a,b)=>a+b,0)),ttc=R2(ht+tva);
 const ded=(f.ded||[]).reduce((a,d)=>a+d.ttc,0);return{ht,tva,ttc,net:R2(ttc-ded)}}
const val=(x,tag)=>{const m=new RegExp('<ram:'+tag+'(?: [^>]*)?>([^<]*)</ram:'+tag+'>').exec(x);return m?m[1]:null};
const tous=(x,tag)=>[...x.matchAll(new RegExp('<ram:'+tag+'(?: [^>]*)?>([^<]*)</ram:'+tag+'>','g'))].map(m=>m[1]);
let xmllint=true;try{execFileSync('xmllint',['--version'],{stdio:'ignore'})}catch(e){xmllint=false}
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caso-fx-'));
function bienForme(x,n){if(!xmllint)return true;const p=path.join(tmp,n+'.xml');fs.writeFileSync(p,x);try{execFileSync('xmllint',['--noout',p],{stdio:'pipe'});return true}catch(e){return false}}

const vendeur={nom:'Dupont Rénovation',adr:'12 rue des Lilas 75011 Paris',siret:'55210055400013',tva:'FR96552100554',iban:'FR76 3000 6000 0112 3456 7890 189',email:'contact@dupont.fr',penal:'Pénalités de retard : 3 fois le taux légal. Indemnité forfaitaire de 40 €.'};
const base={kind:'facture',num:'F2026-0007',date:'2026-11-20',done:'2026-11-18',due:'2026-12-20',qnum:'D2026-0012',seller:vendeur,cat:'PS',
 client:{nom:'SCI Les Tilleuls',adr:'4 avenue Foch 69006 Lyon',pro:true,siren:'732829320'},chantier:'8 rue Neuve 69003 Lyon',
 lines:[{label:'Dépose carrelage',qty:24.5,unit:'m²',pu:18.4,tva:20},{label:'Pose faïence & <joints>',qty:12,unit:'m2',pu:41.25,tva:10},{label:'Main-d\'œuvre',qty:7,unit:'h',pu:45,tva:20}],remise:5};
const cas=[
 ['facture deux taux, remise 5 %',base],
 ['franchise de TVA (293 B)',Object.assign({},base,{num:'F2026-0008',franchise:true,client:{nom:'M. Martin',adr:'3 rue Haute 13001 Marseille'}})],
 ['autoliquidation (sous-traitance)',Object.assign({},base,{num:'F2026-0009',autoliq:true})],
 ['facture finale, acompte déduit',Object.assign({},base,{num:'F2026-0010',kind:'solde',ded:[{num:'F2026-0005',ttc:300}],ret:5,debits:true})],
 ['avoir sur facture',Object.assign({},base,{num:'A2026-0001',kind:'avoir',refNum:'F2026-0007',refDate:'2026-11-20',lines:[{label:'Geste commercial',qty:1,unit:'forfait',pu:-50,tva:20}],remise:0})]];

for(const [nom,f] of cas){
 const x=FX.xml(f),t=faTot(f),k=FX.calculer(f),abs=Math.abs;
 ok(nom+' : XML bien formé',bienForme(x,f.num));
 ok(nom+' : total HT = celui de l\'appli',R2(abs(+val(x,'LineTotalAmount')===null?0:+tous(x,'LineTotalAmount').pop()))===R2(abs(t.ht)),tous(x,'LineTotalAmount').pop()+' / '+t.ht);
 ok(nom+' : TVA = celle de l\'appli',R2(+val(x,'TaxTotalAmount'))===R2(abs(t.tva)),val(x,'TaxTotalAmount')+' / '+t.tva);
 ok(nom+' : TTC = celui de l\'appli',R2(+val(x,'GrandTotalAmount'))===R2(abs(t.ttc)),val(x,'GrandTotalAmount')+' / '+t.ttc);
 const lignes=tous(x,'LineTotalAmount').slice(0,-1).reduce((a,v)=>a+ +v,0);
 ok(nom+' : somme des lignes = total HT (BR-CO-10)',R2(lignes)===R2(+tous(x,'LineTotalAmount').pop()));
 const bases=tous(x,'BasisAmount').reduce((a,v)=>a+ +v,0),taxes=tous(x,'CalculatedAmount').reduce((a,v)=>a+ +v,0);
 ok(nom+' : bases de TVA = total HT, TVA = somme par taux',R2(bases)===R2(+val(x,'TaxBasisTotalAmount'))&&R2(taxes)===R2(+val(x,'TaxTotalAmount')));
 ok(nom+' : net à payer = TTC − déjà payé (BR-CO-16)',R2(+val(x,'DuePayableAmount'))===R2(+val(x,'GrandTotalAmount')-(+val(x,'TotalPrepaidAmount')||0)));
 ok(nom+' : chaque prix net × quantité = montant de la ligne (à 1 centime près)',k.lignes.every(l=>Math.abs(R2(l.pu*l.q)-l.ht)<=0.01+0.005*l.q));
}
const x0=FX.xml(base);
ok('vendeur : SIREN (schéma 0002), n° TVA, IBAN',/schemeID="0002">552100554</.test(x0)&&/schemeID="VA">FR96552100554</.test(x0)&&/<ram:IBANID>FR7630006000011234567890189</.test(x0));
ok('client professionnel : SIREN présent',/schemeID="0002">732829320</.test(x0));
ok('adresse du chantier différente : adresse de livraison',/<ram:ShipToTradeParty>.*69003.*<\/ram:ShipToTradeParty>/.test(x0));
ok('adresse découpée : code postal, ville, pays',/<ram:PostcodeCode>75011<\/ram:PostcodeCode><ram:LineOne>12 rue des Lilas<\/ram:LineOne><ram:CityName>Paris<\/ram:CityName><ram:CountryID>FR/.test(x0));
ok('prestations de services : cadre S1, TVA à l\'encaissement (72)',/<ram:ID>S1<\/ram:ID>/.test(x0)&&/<ram:DueDateTypeCode>72</.test(x0));
ok('unités : m² → MTK, h → HUR',/unitCode="MTK"/.test(x0)&&/unitCode="HUR"/.test(x0));
ok('caractères spéciaux échappés',/Pose faïence &amp; &lt;joints&gt;/.test(x0));
const xf=FX.xml(cas[1][1]);
ok('franchise : catégorie E, motif 293 B, pas de n° TVA du vendeur',/<ram:CategoryCode>E</.test(xf)&&/VATEX-FR-FRANCHISE/.test(xf)&&!/schemeID="VA"/.test(xf));
ok('particulier : pas de SIREN client',(xf.match(/schemeID="0002"/g)||[]).length===1);
ok('autoliquidation : catégorie AE',/<ram:CategoryCode>AE</.test(FX.xml(cas[2][1])));
const xs=FX.xml(cas[3][1]);
ok('TVA sur les débits : exigibilité 5 et mention',/<ram:DueDateTypeCode>5</.test(xs)&&/d'après les débits|d&apos;après les débits/.test(xs));
ok('retenue de garantie rappelée en note',/Retenue de garantie de 5 %/.test(xs));
const xa=FX.xml(cas[4][1]);
ok('avoir : type 381, montants positifs, facture d\'origine',/<ram:TypeCode>381</.test(xa)&&!/>-\d/.test(xa)&&/<ram:InvoiceReferencedDocument><ram:IssuerAssignedID>F2026-0007/.test(xa));
ok('acompte : type 386',/<ram:TypeCode>386</.test(FX.xml(Object.assign({},base,{kind:'acompte'}))));
ok('contrôle : facture complète, rien ne manque',FX.controler(base).length===0,FX.controler(base).join(', '));
const manque=FX.controler(Object.assign({},base,{seller:Object.assign({},vendeur,{siret:''}),client:{nom:'X',pro:true}}));
ok('contrôle : SIRET du vendeur et SIREN du client pro signalés',manque.includes('SIRET de l\'entreprise')&&manque.includes('SIREN du client'),manque.join(', '));
ok('xmllint présent pour le contrôle du XML',xmllint);

fs.rmSync(tmp,{recursive:true,force:true});
console.log(R.join('\n'));const n=R.filter(x=>x.startsWith('OK')).length;console.log('\n'+n+'/'+R.length+' contrôles réussis');process.exit(n===R.length?0:1);

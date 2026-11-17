/* casô · des réponses qui tiennent compte de la situation (nov. 2026)
   Rien n'est ajouté à l'écran : tout passe par les réponses du chat. Chargé après chat/langage.js.
   Chaque réponse ne dit que ce qui est enregistré dans l'appli : aucun chiffre deviné, aucun conseil inventé.
   - le point : « où j'en suis », « fais le point » → aujourd'hui, demain, devis en cours, devis sans réponse, factures à encaisser ;
   - le point sur un client : « le point sur Martin », « où en est Martin » → ses devis, ce qu'il doit, son prochain rendez-vous ;
   - le contrôle du devis en cours : « c'est bon ? », « vérifie le devis », « il manque quelque chose ? » ;
   - la semaine : « ma semaine », « mes rendez-vous de la semaine » → la liste, jour par jour ;
   - « Martin a payé 50 » → le paiement, après un Oui ; « combien j'ai facturé ce mois » → facturé, encaissé, reste dû ;
   - « annule » défait la dernière action du chat ; « supprime la dernière ligne » ; « ajoute du carrelage » pendant un devis ;
   - la suite d'une question : « combien me doit Martin » puis « et Petit ? ». */
(function(){
"use strict";
var P=window.casoPont;if(!P)return;
function B(){return P.B;}
function hn(s){return CasoBrain.hn(String(s||""));}
function cle(n){return hn(n).replace(/^(m|mme|mlle|monsieur|madame|mr|mrs)\s+/,"").trim();}
function e(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function T(t,a){return P.tr(t,a);}
function lang(){return (typeof I18N!=="undefined"&&I18N.lang)||"fr";}
function langue(){try{B().setLangue(lang());}catch(x){}}
function E(x){return B().eurFr(Math.round(x*100)/100);}
function fr(t){try{return B().translate(t);}catch(x){return {p:hn(t),n:hn(t),lang:"fr"};}}
function nb(n,un,pl){return T(n>1?pl:un,[n]);}
function p(s){return '<p dir="auto">'+e(s)+'</p>';}
function li(a,b){return '<p dir="auto"><b>'+e(a)+'</b>'+(b?' '+e(b):'')+'</p>';}
function bulle(t,h,o){CHAT.m.push({who:"me",text:t});var m={who:"bot",html:'<div data-noi18n>'+h+'</div>'};if(o)for(var k in o)m[k]=o[k];CHAT.m.push(m);chatSave();chatRender(true);
  var ip=document.getElementById("chatIn");if(ip){ip.value="";try{chatGrow(ip);qkUpdate();}catch(x){}}}
function cliNom(n){var k=cle(n);return (db.clients||[]).filter(function(c){return cle(c.nom)===k;})[0]||null;}
function cliTexte(t){var h=" "+cle(t)+" ",best=null;(db.clients||[]).forEach(function(c){var n=cle(c.nom||"");if(n.length>=2&&h.indexOf(" "+n+" ")>=0&&(!best||n.length>cle(best.nom).length))best=c;});return best;}
function client(t){var n=null;try{n=P.clientDans(t);}catch(x){}return (n&&cliNom(n))||cliTexte(t);}
function nomDe(o){return o&&(typeof o.client==="string"?o.client:(o.client&&o.client.nom))||"";}
function tot(o){var r=(o.remise||0)/100,ht=0,tva=0,fra=!!(o.franchise||(db.prof&&db.prof.franchise));(o.lines||[]).forEach(function(l){var m=(+l.qty||0)*(+l.pu||0)*(1-r);ht+=m;if(!fra)tva+=m*(+l.tva||0)/100;});return {ht:ht,ttc:ht+tva};}
function brouil(o){return !!o&&(!o.status||o.status==="brouillon");}
function enCours(){return typeof q!=="undefined"&&q&&brouil(q)&&(q.lines||[]).some(function(l){return l.label;});}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function plus(d,n){var x=new Date(d+"T12:00");x.setDate(x.getDate()+n);return iso(x);}
function jours(d){return Math.round((new Date(agToday()+"T12:00")-new Date(String(d).slice(0,10)+"T12:00"))/864e5);}
function heure(h){var z=String(h||"").split(":");return z[0]?(+z[0])+"h"+(+z[1]?z[1]:""):"";}
function evs(a,b){return (db.events||[]).filter(function(x){return x&&x.d>=a&&x.d<=b&&x.t!=="conge";}).sort(function(x,y){return (x.d+(x.a||"")).localeCompare(y.d+(y.a||""));});}
function rdv(x){var c=x.cid&&(db.clients||[]).filter(function(k){return k.id===x.cid;})[0],n=c?c.nom:"",ti=x.title||"";return [heure(x.a),ti&&cle(ti)!==cle(n)?ti:"",n].filter(Boolean).join(" ");}
function jourNom(d){try{return new Date(d+"T12:00").toLocaleDateString(lang(),{weekday:"long",day:"numeric"});}catch(x){return d;}}
function dues(nom){return (db.invoices||[]).filter(function(f){return f&&f.num&&f.kind!=="avoir"&&(!nom||cle(nomDe(f))===cle(nom))&&faDue(f)>0.005;}).sort(function(a,b){return String(a.date).localeCompare(String(b.date));});}
function etat(o){return o.status==="accepte"?T("accepté"):o.status==="envoye"?T("envoyé"):o.status==="refuse"?T("refusé"):T("brouillon");}
function date(d){var z=String(d||"").slice(0,10).split("-");return z.length===3?z[2]+"/"+z[1]+"/"+z[0]:"";}

/* ================= le point ================= */
var POINT=/^(?:ou (?:j en suis|en suis je|on en est|est ce que j en suis)|(?:fais(?: moi)? |donne moi |c est quoi )?(?:le |un |mon )?(?:point|bilan|resume)(?: (?:de|sur|du) (?:la |ma |mon |le )?(?:journee|jour|semaine|situation|activite))?|quoi de prevu|j ai quoi (?:a faire|aujourd hui|de prevu))$/;
function point(t){var h=[],d0=agToday(),A=evs(d0,d0),D=evs(plus(d0,1),plus(d0,1));
  h.push(li(T("Aujourd’hui :"),A.length?A.map(rdv).join(" ; "):T("rien au planning.")));
  if(D.length)h.push(li(T("Demain :"),D.map(rdv).join(" ; ")));
  if(enCours()){var manq=q.lines.filter(function(l){return l.label&&(l.qty==null||l.qty==="");}).length;
    h.push(li(T("Devis en cours :"),[nomDe(q)||T("sans client"),E(tot(q).ttc)+" TTC"].concat(manq?[nb(manq,"{0} quantité à préciser","{0} quantités à préciser")]:[]).join(" · ")));}
  var Q=(db.quotes||[]).filter(function(o){return o&&(o.lines||[]).some(function(l){return l.label;})&&!(typeof q!=="undefined"&&q&&o.id===q.id&&enCours());}),
      ENV=Q.filter(function(o){return o.status==="envoye";}).sort(function(a,b){return String(a.date).localeCompare(String(b.date));}),BR=Q.filter(brouil);
  if(ENV.length)h.push(li(T("Devis envoyés sans réponse :"),ENV.length+" · "+E(ENV.reduce(function(a,o){return a+tot(o).ttc;},0))+" TTC · "+T("le plus ancien : {0}, il y a {1} j",[nomDe(ENV[0])||"—",jours(ENV[0].date)])));
  if(BR.length)h.push(li(T("Brouillons :"),BR.slice(0,4).map(function(o){return (nomDe(o)||T("sans client"))+" "+E(tot(o).ttc);}).join(" ; ")+(BR.length>4?" …":"")));
  var F=dues();
  if(F.length)h.push(li(T("À encaisser :"),E(F.reduce(function(a,f){return a+faDue(f);},0))+" · "+F.slice(0,4).map(function(f){return nomDe(f)+" "+E(faDue(f))+(f.due&&f.due<d0?" ("+T("en retard")+")":"");}).join(" ; ")+(F.length>4?" …":"")));
  bulle(t,h.join(""));return true;}

/* ================= le point sur un client ================= */
var PCLI=/^(?:(?:fais(?: moi)? )?(?:le |un )?(?:point|bilan|resume) (?:sur|avec|pour|chez|de)|ou (?:j en suis|on en est|en est on|en suis je) (?:avec|chez|pour)|ou en est) (.+)$/;
function pointClient(t,c){var h=['<p dir="auto"><b>'+e(c.nom)+'</b>'+(c.tel?' <span class="mut">'+e(c.tel)+'</span>':'')+'</p>'],d0=agToday();
  var Q=(db.quotes||[]).filter(function(o){return o&&cle(nomDe(o))===cle(c.nom)&&(o.lines||[]).some(function(l){return l.label;});}).sort(function(a,b){return String(b.date).localeCompare(String(a.date));});
  h.push(li(T("Devis :"),Q.length?Q.slice(0,3).map(function(o){return date(o.date)+" "+etat(o)+" "+E(tot(o).ttc)+" TTC";}).join(" ; ")+(Q.length>3?" …":""):T("aucun.")));
  var F=dues(c.nom);h.push(li(T("À encaisser :"),F.length?E(F.reduce(function(a,f){return a+faDue(f);},0))+" ("+F.map(function(f){return f.num;}).join(", ")+")":T("rien.")));
  var EV=(db.events||[]).filter(function(x){return x&&x.cid===c.id&&x.t!=="conge";}),AV=EV.filter(function(x){return x.d>=d0;}).sort(function(a,b){return (a.d+a.a).localeCompare(b.d+b.a);}),
      AP=EV.filter(function(x){return x.d<d0;}).sort(function(a,b){return (b.d+b.a).localeCompare(a.d+a.a);});
  if(AV.length)h.push(li(T("Prochain rendez-vous :"),jourNom(AV[0].d)+" "+heure(AV[0].a)+(AV[0].title&&cle(AV[0].title)!==cle(c.nom)?" · "+AV[0].title:"")));
  else if(AP.length)h.push(li(T("Dernier rendez-vous :"),date(AP[0].d)+(AP[0].title&&cle(AP[0].title)!==cle(c.nom)?" · "+AP[0].title:"")));
  bulle(t,h.join(""));return true;}

/* ================= le contrôle du devis en cours ================= */
var CTRL=/^(?:(?:c est|est ce que c est|c est tout|tout est) (?:bon|tout bon|correct|complet|ok)|(?:verifie|controle|relis|regarde)(?: moi)? (?:le |mon |ce )?devis|(?:est ce qu |qu est ce qu )?(?:il )?manque (?:quelque chose|quoi|un truc|rien)|(?:j ai|est ce que j ai|ai je) (?:rien |tout |pas )?oublie(?: quelque chose| un truc| quoi| rien)?|(?:le|mon|ce) devis est (?:bon|complet|pret|correct))$/;
function controle(t){if(!enCours()){bulle(t,p(T("Aucun devis en cours.")));return true;}
  var L=q.lines.filter(function(l){return l.label;}),A=[];
  if(!nomDe(q))A.push(T("pas de client"));
  var sq=L.filter(function(l){return l.qty==null||l.qty===""||+l.qty===0;});if(sq.length)A.push(T("quantité à préciser : {0}",[sq.map(function(l){return l.label;}).join(", ")]));
  var sp=L.filter(function(l){return !(+l.pu>0);});if(sp.length)A.push(T("pas de prix : {0}",[sp.map(function(l){return l.label;}).join(", ")]));
  L.forEach(function(l){var pr=(db.prices||[]).filter(function(x){return x&&cle(x.nom)===cle(l.label)&&+x.prix>0;})[0];
    if(pr&&+l.pu>0&&Math.abs(+l.pu-+pr.prix)/+pr.prix>0.3)A.push(T("{0} à {1}, d’habitude {2}",[l.label,E(+l.pu),E(+pr.prix)]));});
  var dbl={};L.forEach(function(l){var k=cle(l.label);dbl[k]=(dbl[k]||0)+1;});var dd=L.filter(function(l,i){return dbl[cle(l.label)]>1&&L.map(function(x){return cle(x.label);}).indexOf(cle(l.label))===i;});
  if(dd.length)A.push(T("en double : {0}",[dd.map(function(l){return l.label;}).join(", ")]));
  if(+q.remise>=30)A.push(T("remise de {0} %",[+q.remise]));
  var N=(q.notes||[]).filter(function(n){return n&&n.k==="todo"&&n.t;});if(N.length)A.push(T("noté, pas chiffré : {0}",[N.map(function(n){return n.t;}).join(", ")]));
  var to=tot(q),pied=nb(L.length,"{0} ligne","{0} lignes")+", "+E(to.ht)+" HT, "+E(to.ttc)+" TTC";
  bulle(t,A.length?'<p dir="auto"><b>'+e(T("À vérifier :"))+'</b></p>'+A.map(function(a){return '<p dir="auto">· '+e(a)+'</p>';}).join("")+'<p dir="auto" class="mut">'+e(pied)+'</p>':p(T("Rien à signaler : {0}.",[pied])));return true;}

/* ================= la semaine ================= */
var SEM=/^(?:(?:montre(?: moi)? |affiche |c est quoi |quels sont |donne moi )?(?:ma |la |mon |mes |le |les )?(?:semaine|planning de la semaine|programme de la semaine|rendez vous de (?:la|cette) semaine|rdv de (?:la|cette) semaine))$/;
function semaine(t){var d0=agToday(),fin=plus(agWeekStart(d0),6),L=evs(agWeekStart(d0),fin),J={};L.forEach(function(x){(J[x.d]=J[x.d]||[]).push(rdv(x));});
  bulle(t,L.length?Object.keys(J).sort().map(function(d){return li(jourNom(d)+" :",J[d].join(" ; "));}).join(""):p(T("Rien de prévu cette semaine.")));return true;}

/* ================= paiements et facturation ================= */
var PAYE=/^(.+?) (?:m a |a |ont |m ont )(?:deja |bien )?(?:paye|regle|verse|vire|donne) (\d+(?:[.,]\d+)?)(?: ?(?:€|euros?|e|balles))?(?: (?:en|par) (cheque|especes?|liquide|virement|carte|cb))?$/;
function paye(t,m){var c=client(m[1]);if(!c)return false;var F=dues(c.nom),am=parseFloat(m[2].replace(",","."));if(!(am>0))return false;
  if(!F.length){bulle(t,p(T("Aucune facture à encaisser pour {0}.",[c.nom])));return true;}
  var fx=F[0],du=faDue(fx);
  if(am>du+0.005){bulle(t,p(T("{0} ne doit plus que {1} ({2}).",[c.nom,E(du),fx.num])));return true;}
  var mode=/cheque/.test(m[3]||"")?"chq":/espece|liquide/.test(m[3]||"")?"esp":/carte|cb/.test(m[3]||"")?"cb":"vir";CHAT.m.push({who:"me",text:t});
  P.demander(p(T("Enregistrer un paiement de {0} par {1} sur {2} ?",[E(am),c.nom,fx.num])),function(){faPayAdd(fx,{d:agToday(),amt:am,mode:mode});try{faAfterPay(fx);}catch(x){}try{save();}catch(x){}
    CHAT.m.push({who:"bot",html:'<div data-noi18n>'+p(T("Paiement enregistré : {0} · {1}.",[E(am),fx.num])+" "+T("Reste dû : {0}.",[E(faDue(fx))]))+'</div>'});chatSave();chatRender(true);});return true;}
var FACT=/^combien (?:j ai|ai je|on a|est ce que j ai) facture(?: (ce mois(?: ci)?|cette annee|en (\d{4})|ce trimestre))?$/;
function facture(t,m){var d0=agToday(),a=d0.slice(0,7),b=null,lab=T("ce mois-ci");
  if(/annee/.test(m[1]||"")){a=d0.slice(0,4);lab=d0.slice(0,4);}else if(m[2]){a=m[2];lab=m[2];}
  else if(/trimestre/.test(m[1]||"")){var mo=+d0.slice(5,7),q1=Math.floor((mo-1)/3)*3+1;a=d0.slice(0,5)+String(q1).padStart(2,"0");b=d0.slice(0,5)+String(q1+2).padStart(2,"0")+"-31";lab=T("ce trimestre");}
  var F=(db.invoices||[]).filter(function(f){return f&&f.num&&f.date&&(b?f.date>=a&&f.date<=b:String(f.date).indexOf(a)===0);}),ttc=0,ht=0,du=0;
  F.forEach(function(f){var x=faTot(f),s=f.kind==="avoir"?-1:1;ttc+=s*Math.abs(x.net);ht+=s*Math.abs(x.ht);du+=faDue(f);});
  bulle(t,F.length?p(T("Facturé {0} : {1} HT, {2} TTC ({3}). Reste à encaisser : {4}.",[lab,E(ht),E(ttc),nb(F.length,"{0} facture","{0} factures"),E(du)])):p(T("Aucune facture {0}.",[lab])));return true;}

/* ================= le devis en cours : dernière ligne, « ajoute du carrelage » ================= */
var DERN=/^(?:supprime|enleve|retire|efface|vire|ote)(?: moi)? la derniere ligne(?: du devis)?$/,AJ=/^(?:ajoute|rajoute|mets|met)(?: moi)? (?:du |de la |de l |des )(\D+)$/;
function derniere(t){if(!enCours()){bulle(t,p(T("Aucun devis en cours.")));return true;}
  var i=q.lines.length-1;while(i>=0&&!q.lines[i].label)i--;var av=JSON.stringify(q),l0=q.lines[i];q.lines.splice(i,1);try{fillForm();store();}catch(x){}CHAT.qid=q.id;
  bulle(t,p(T("{0} retiré du devis.",[l0.label]))+p(T("Total du devis : {0} TTC",[E(tot(q).ttc)])),{undo:av});return true;}

/* ================= « annule » ================= */
var ANN=/^(?:annule|annuler|annule ca|annule la derniere action|annule ce que tu viens de faire|defais|defais ca|reviens en arriere)$/;
function annule(t){var b=CHAT.m[CHAT.m.length-1];
  if(b&&b.who==="bot"&&(b.undo||b.agUndo||b.pUndo||b.prUndo||b.mUndo||b.chUndo)&&typeof chatNonUndo==="function"){chatNonUndo();var ip=document.getElementById("chatIn");if(ip){ip.value="";try{chatGrow(ip);qkUpdate();}catch(x){}}return true;}
  bulle(t,p(T("Rien à annuler.")));return true;}

function reponse(t){if(!P.ready||typeof db==="undefined"||typeof CHAT==="undefined")return false;langue();
  var c=fr(t),s=String(c.p||"").replace(/[?!.…,]+/g," ").replace(/\s+/g," ").trim(),m,cl;
  if(ANN.test(s))return annule(t);
  if(POINT.test(s))return point(t);
  if((m=s.match(PCLI))&&!/\b(devis|facture|chantier|travaux|commande|rdv|rendez vous|video|analyse|maquette)\b/.test(m[1])&&(cl=client(m[1]))&&cle(m[1]).split(" ").length<=4)return pointClient(t,cl);
  if(CTRL.test(s))return controle(t);
  if(SEM.test(s))return semaine(t);
  if((m=hn(t).replace(/[?!.…]+/g," ").replace(/[’']/g," ").replace(/\s+/g," ").trim().match(PAYE)))return paye(t,m);
  if((m=s.match(FACT)))return facture(t,m);
  if(DERN.test(s))return derniere(t);
  /* « ajoute du carrelage » pendant un devis : une ligne à chiffrer, pas la maquette 3D */
  if(enCours()&&(m=s.match(AJ))&&!/\b(maquette|plan|3d|mur|murs|sol|piece|photo|note|client|remise|tva|acompte)\b/.test(m[1])&&typeof P.decrire==="function"){
    var ok=(db.prices||[]).some(function(x){return x&&x.nom&&cle(x.nom)===cle(m[1]);})||!!(window.CASO_LANGAGE&&CASO_LANGAGE.terme&&CASO_LANGAGE.terme(m[1]));
    if(ok)return !!P.decrire("il faut "+String(t).replace(/^\s*\S+(?:\s+moi)?\s+/i,""),{aff:t});}
  return false;}

/* la suite d'une question : « combien me doit Martin » puis « et Petit ? » → la même question pour Petit */
var SUITE=/^et (?:pour |chez |avec |celui de |celle de |ceux de |de |du cote de )?(.+)$/,ACTV=/^\s*(nouveau|nouvelle|ajoute|rajoute|mets|met|enleve|retire|supprime|efface|note|cree|envoie|change|modifie|remplace|commande|achete|appelle|ecris|relance|facture|signe|annule|deplace|planifie|prevois|chiffre|rdv|rendez)\b/;
var r0=P.renvoi;
P.renvoi=function(t){try{var s=hn(t).replace(/[?!.…]+/g," ").replace(/\s+/g," ").trim(),m=s.match(SUITE),c2=m&&cle(m[1]).split(" ").length<=3&&client(m[1]);
    if(c2){var av=null;for(var i=CHAT.m.length-1;i>=0&&i>=CHAT.m.length-4;i--)if(CHAT.m[i].who==="me"){av=CHAT.m[i].text;break;}
      var c1=av&&!ACTV.test(hn(av))&&!SUITE.test(hn(av))&&client(av);
      if(c1&&c1.id!==c2.id){var re=new RegExp(String(c1.nom).replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");if(re.test(av))return av.replace(re,c2.nom);}}
  }catch(x){if(window.console)console.error(x);}
  return r0?r0.apply(this,arguments):null;};

var q0=P.question;
P.question=function(t){try{if(reponse(t))return true;}catch(x){if(window.console)console.error(x);}return q0?q0.apply(this,arguments):false;};
P.reponse=reponse;
})();

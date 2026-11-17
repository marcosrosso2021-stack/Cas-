/* casô : veille réglementaire — le contrôleur de cohérence
   Il range chaque texte vérifié dans une catégorie et bloque ce qui n'est pas démontré. La première règle qui s'applique gagne.
   Une proposition n'est jamais rangée comme une obligation ; une source non officielle ne confirme rien. */
'use strict';
const CAT={confirme:'confirme',echeance:'echeance',clarification:'clarification',proposition:'proposition',non_confirme:'non_confirme',aucun:'aucun',nouveaute:'nouveaute'};
const NOMS={reference:'référence officielle introuvable',dateVigueur:'date d\'entrée en vigueur à lire dans le texte',datePub:'date de publication introuvable'};

function classer(v,ctx={}){
 const etat=ctx.etat||'nouveau',autres=ctx.autres||[],r=(categorie,bloque,raisons)=>({categorie,bloque:!!bloque,raisons:raisons||[]});
 if(etat==='inchange')return r(v.statut==='adopte'&&ctx.dejaValide&&v.differe?CAT.echeance:CAT.aucun);
 if(v.statut==='metier')return r(CAT.nouveaute);   // presse du métier : une nouveauté à découvrir, jamais une obligation
 if(!v.officiel)return r(CAT.non_confirme,true,['source non officielle']);
 if(v.statut==='projet')return r(CAT.proposition);
 if(v.manque&&v.manque.length)return r(CAT.non_confirme,true,v.manque.map(k=>NOMS[k]||k));
 if(autres.some(a=>a.dateVigueur&&v.dateVigueur&&a.dateVigueur!==v.dateVigueur))return r(CAT.non_confirme,true,['sources en désaccord']);
 return r(v.statut==='adopte'?CAT.confirme:CAT.clarification)}

/* ce qui compte comme une nouveauté : tout sauf « aucun » et le rappel d'une échéance déjà connue */
function bilan(res){const nouveautes=res.filter(x=>x.categorie!==CAT.aucun&&x.categorie!==CAT.echeance).length,bloques=res.filter(x=>x.bloque).length;
 return {nouveautes,bloques,alerte:false}}

module.exports={CAT,classer,bilan};

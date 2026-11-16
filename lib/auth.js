/* casô — module AUTH (appli) : connexion directe avec Google ou Microsoft, sans écran.
   L'appli appelle CasoAuth.connecter('google'|'microsoft') ; au retour, la session est rangée dans localStorage « caso_auth »
   ({jeton,compte,vu}) et l'évènement « caso-auth » est émis. Serveur : serveur/auth.js (/api/auth/*).
   Ce que l'appli sait déjà (mode du compte, « Mon entreprise ») est transmis par window.CasoAuthProfil(), sans rien redemander. */
(function(){
'use strict';
var CLE='caso_auth',HORS_LIGNE_J=7;
var ERR={annule:'',indisponible:'Connexion indisponible pour l\'instant.',trop:'Trop d\'essais. Réessaie dans une heure.',navigateur:'Connexion interrompue. Recommence.',refus:'Connexion refusée. Recommence.',reseau:'Connexion impossible. Réessaie.'};
function srv(){return String(window.CASO_AUTH_SRV!=null?window.CASO_AUTH_SRV:(window.CASO_APPRIS||'https://api.caso.fr')).replace(/\/+$/,'')}
function lire(){try{var v=JSON.parse(localStorage.getItem(CLE)||'null');return v&&v.jeton&&v.compte?v:null}catch(e){return null}}
function ecrire(v){try{if(v)localStorage.setItem(CLE,JSON.stringify(v));else localStorage.removeItem(CLE)}catch(e){}}
function dire(erreur,retour){try{window.dispatchEvent(new CustomEvent('caso-auth',{detail:{compte:API.compte(),erreur:erreur||'',retour:!!retour}}))}catch(e){}}
function poser(jeton,compte){ecrire({jeton:jeton,compte:compte,vu:Date.now()})}
function appel(chemin,corps,jeton){
 var h={};if(corps!==undefined)h['content-type']='application/json';if(jeton)h.authorization='Bearer '+jeton;
 return fetch(srv()+'/api/auth/'+chemin,{method:corps===undefined?'GET':'POST',headers:h,body:corps===undefined?undefined:JSON.stringify(corps),cache:'no-store',credentials:'omit'})
  .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok){var e=new Error(j.error||'Erreur.');e.code=r.status;e.corps=j;throw e}return j})},
        function(){var e=new Error('Pas de connexion.');e.code=0;throw e})}

/* envoie au serveur le mode et l'entreprise déjà saisis dans l'appli, seulement s'ils diffèrent du compte */
function profil(){
 var s=lire(),p=null;if(!s)return Promise.resolve(null);
 try{p=window.CasoAuthProfil&&window.CasoAuthProfil()}catch(e){}
 if(!p||!p.mode)return Promise.resolve(API.compte());
 var c=s.compte,siret=String(p.siret||'').replace(/[\s.]/g,'');
 if(p.mode==='bricoleur'?!!c.mode:(c.mode==='artisan'&&c.siret===siret&&(c.nom||'')===String(p.nom||'').trim()))return Promise.resolve(API.compte());
 if(p.mode==='artisan'&&!/^\d{14}$/.test(siret))return Promise.resolve(API.compte());/* SIRET pas encore rempli : on attend */
 return appel('profil',{mode:p.mode,nom:p.nom||'',siret:siret},s.jeton).then(function(r){poser(s.jeton,r.compte);return API.compte()},function(){return API.compte()})}

var API={
 version:2,
 /* part chez le fournisseur ; l'appli se recharge au retour */
 connecter:function(k){location.assign(srv()+'/api/auth/via/'+encodeURIComponent(k)+'?retour='+encodeURIComponent(location.origin+location.pathname))},
 connecte:function(){return !!lire()},
 jeton:function(){var s=lire();return s?s.jeton:null},
 /* compte gardé sur l'appareil ; « frais » passe à faux après 7 jours sans vérification auprès du serveur */
 compte:function(){var s=lire();if(!s)return null;var c={};for(var k in s.compte)c[k]=s.compte[k];c.frais=Date.now()-s.vu<HORS_LIGNE_J*864e5;return c},
 offre:function(){var c=API.compte();return c?c.offre:null},
 /* vérifie la session auprès du serveur ; hors ligne, garde le compte de l'appareil */
 rafraichir:function(){
  var s=lire();if(!s)return Promise.resolve(null);
  return appel('moi',undefined,s.jeton).then(function(r){poser(s.jeton,r.compte);return profil()},
   function(e){if(e.code===401){ecrire(null);return null}return API.compte()}).then(function(c){dire();return c})},
 /* à appeler quand « Mon entreprise » change */
 profil:function(){return profil().then(function(c){dire();return c})},
 deconnecter:function(){
  var j=API.jeton();if(!j)return Promise.resolve(true);
  return appel('sortir',{},j).then(function(){},function(){}).then(function(){ecrire(null);dire();return true})},
 supprimer:function(){
  var j=API.jeton();if(!j)return Promise.resolve(true);
  return appel('supprimer',{confirm:'SUPPRIMER'},j).then(function(){ecrire(null);dire();return true})},
 pret:null
};
window.CasoAuth=API;

/* retour du fournisseur : #auth=<ticket> (ou #auth_erreur=<raison>) ; l'adresse est nettoyée tout de suite */
function reprendre(){
 var m=/^#auth(_erreur)?=([A-Za-z0-9_-]{1,64})$/.exec(location.hash||'');
 if(!m)return API.rafraichir();
 try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
 if(m[1]){dire(ERR[m[2]]!==undefined?ERR[m[2]]:ERR.refus);return Promise.resolve(API.compte())}
 return appel('session',{ticket:m[2]}).then(function(r){poser(r.jeton,r.compte);return profil()},function(e){dire(e.code?ERR.refus:ERR.reseau);return null})
  .then(function(c){if(c)dire('',true);return c})}
API.pret=reprendre().then(function(){return API});
})();

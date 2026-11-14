/* casô · mémoire commune de l'IA (chat de l'appli, chat du module 3D)
   - Le chat du module 3D apprend sur le même serveur que le chat de l'appli, avec les mêmes règles :
     mots seulement (synonyme de meuble, nom de couleur), rien de personnel, publiés à partir de 2 usagers.
   - Les phrases que l'IA n'a pas comprises partent masquées (chiffres → #, noms et majuscules → @),
     pour corriger l'IA chaque semaine ; seules celles envoyées par au moins 3 usagers sont lisibles.
   Rien n'est affiché. Chargé après chat/intel.js. */
(function(){
var BASE=(window.CASO_APPRIS||"https://api.caso.fr"),AK="caso_ia_partage",K3="caso_ia_3d",KI="caso_ia_inc";
function lit(k,d){try{return JSON.parse(localStorage.getItem(k)||"null")||d;}catch(x){return d;}}
function ecrit(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(x){}}
function id(){var o=lit(AK,{});if(!o.id){var a=new Uint8Array(16);try{crypto.getRandomValues(a);}catch(x){for(var i=0;i<16;i++)a[i]=Math.random()*256|0;}
  o.id=Array.prototype.map.call(a,function(b){return (b<16?"0":"")+b.toString(16);}).join("");ecrit(AK,o);}return o.id;}
function hn(x){return String(x||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();}
function enLigne(){return navigator.onLine!==false;}
var M={};
/* ---------- chat du module 3D ---------- */
var MOT3=/^[\p{Ll}\p{Lo}\p{Mn}' -]{2,30}$/u;
function mots3(o,ok){var r={},n=0;for(var w in o||{}){var v=o[w];if(n>=30)break;if(MOT3.test(w)&&w.trim().split(/\s+/).length<=3&&ok(v)){r[w]=v;n++;}}return r;}
M.pour3d=function(){return {
  save:function(mine){try{var st=lit(K3,{}),syn=mots3(mine&&mine.syn,function(v){return /^[a-z][a-z0-9_]{1,19}$/.test(v);}),col=mots3(mine&&mine.col,function(v){return /^#[0-9a-f]{6}$/.test(v);});
    var cle=JSON.stringify([syn,col]);if(cle===st.env||(!Object.keys(syn).length&&!Object.keys(col).length))return;
    (mine.unk||[]).slice(-5).forEach(function(u){if(u&&u.t)M.incompris(u.l||"fr",u.t,"3d");});
    if(!enLigne())return;fetch(BASE+"/api/appris",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({d:"3d",id:id(),syn:syn,col:col})})
     .then(function(r){if(r.ok){var s=lit(K3,{});s.env=cle;ecrit(K3,s);}}).catch(function(){});}catch(x){}},
  load:function(){var st=lit(K3,{});if(!enLigne()||st.at&&Date.now()-st.at<6*36e5)return Promise.resolve(st.sh||null);
    return fetch(BASE+"/api/appris?d=3d").then(function(r){return r.ok?r.json():null;}).then(function(j){if(!j||!j.sh)return st.sh||null;var s=lit(K3,{});s.sh=j.sh;s.at=Date.now();ecrit(K3,s);return j.sh;}).catch(function(){return st.sh||null;});}
 };};
/* ---------- phrases incomprises, masquées ---------- */
function noms(){var s={};try{(window.db&&db.clients||[]).forEach(function(c){String(c.nom||"").split(/\s+/).forEach(function(w){w=hn(w);if(w.length>=2)s[w]=1;});});}catch(x){}return s;}
M.masque=function(t){t=String(t||"").trim();if(!t||t.length>160||/[@\/]|www|https?:|\d{4,}/i.test(t))return null;var N=noms(),out=[];
  t.replace(/[.,;:!?¿¡«»"()\[\]{}…]/g," ").split(/\s+/).filter(Boolean).forEach(function(w,i){var h=hn(w);
    if(/\d/.test(w))out.push("#");else if(N[h]||i>0&&/^\p{Lu}/u.test(w))out.push("@");else out.push(h);});
  if(!out.length||out.length>14)return null;var m=out.join(" ").replace(/(?:@ ?)+@/g,"@").replace(/(?:# ?)+#/g,"#");return /^[\p{Ll}\p{Lo}\p{Mn}@#²³%€' -]+$/u.test(m)?m:null;};
M.incompris=function(l,t,src){var m=M.masque(t);if(!m)return;var q=lit(KI,[]);if(q.some(function(x){return x.t===m&&x.l===l;}))return;q.push({l:l||"fr",t:m,s:src==="3d"?"3d":"chat"});ecrit(KI,q.slice(-40));};
function envoyerInc(){var q=lit(KI,[]);if(!q.length||!enLigne())return;var lot=q.slice(0,20);
  fetch(BASE+"/api/incompris",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:id(),e:lot})})
   .then(function(r){if(r.ok){var r2=lit(KI,[]).filter(function(x){return !lot.some(function(y){return y.t===x.t&&y.l===x.l;});});ecrit(KI,r2);}}).catch(function(){});}
setTimeout(envoyerInc,20000);setInterval(envoyerInc,10*60000);
/* le chat de l'appli : la phrase qui vient d'être dite, et « Je n'ai pas compris » */
(function brancher(n){var P=window.casoPont;if(!P||typeof window.chatSend!=="function"||!P.incompris){if(n<120)setTimeout(function(){brancher(n+1);},500);return;}
  var cs=window.chatSend;window.chatSend=function(t){try{if(typeof t==="string")M.dernier=t;else{var i=document.getElementById("chatIn");if(i&&i.value)M.dernier=i.value;}}catch(x){}return cs.apply(this,arguments);};
  for(var k in cs)if(Object.prototype.hasOwnProperty.call(cs,k))window.chatSend[k]=cs[k];
  var inc=P.incompris;P.incompris=function(){try{if(M.dernier)M.incompris((typeof I18N!=="undefined"&&I18N.lang)||"fr",M.dernier,"chat");}catch(x){}return inc.apply(this,arguments);};})(0);
window.casoMemoire=M;
})();

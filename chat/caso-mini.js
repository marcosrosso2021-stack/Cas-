/* casô-mini : le petit modèle de langage maison de casô.
   Il ne sait faire qu'une chose : lire une phrase (10 langues, fautes comprises) et dire
   1) quelle action de l'appli est demandée (l'intention),
   2) quels mots sont le client, la quantité, le prix, la date, l'équipement, la pièce, la couleur…
   Modèle : n-grammes de caractères hachés -> plongement moyen -> couche de sortie (type fastText), un pour l'intention,
   un pour les éléments mot par mot. Quelques Mo, sans réseau, réponse en quelques millisecondes.
   Il apprend en continu : chaque « oui », « non » ou reformulation corrige sa couche de sortie dans le téléphone. */
(function(root){
"use strict";
var TOK=/\d+(?:[.,]\d+)?(?:h\d{0,2})?|[\p{L}\p{N}²³'’-]+|€|%/gu;
function low(s){return String(s).toLowerCase().normalize("NFD").replace(/[̀-ًͯ-ٰٕ]/g,"")
  .replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/ı/g,"i").replace(/ł/g,"l").replace(/[’']/g,"'").replace(/œ/g,"oe");}
function tokenize(raw){return String(raw).match(TOK)||[];}
function fnv(s){var h=0x811c9dc5;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193);}return h>>>0;}
function shape(t){if(/^\d/.test(t))return /h\d*$/.test(t)?"H":/[.,]/.test(t)?"D":"N";if(t==="€")return "E";if(t==="%")return "P";if(/^\p{Lu}\p{Ll}/u.test(t))return "C";if(/^\p{Lu}+$/u.test(t)&&t.length>1)return "U";return "w";}
function grams(t,out,pre){var w="<"+t+">";for(var n=3;n<=4;n++)for(var i=0;i+n<=w.length;i++)out.push(pre+w.substr(i,n));}
/* caractéristiques de la phrase entière (intention) */
function sentFeats(toks,B){var L=toks.map(low),f=["bias"];
  L.forEach(function(t,i){var tt=/^\d/.test(t)?"#":t;f.push("w:"+tt);if(i)f.push("b:"+(/^\d/.test(L[i-1])?"#":L[i-1])+"_"+tt);if(tt!=="#"&&tt.length>1)grams(tt,f,"c:");f.push("s:"+shape(toks[i]));});
  if(L.length)f.push("first:"+(/^\d/.test(L[0])?"#":L[0]));return f.map(function(x){return fnv(x)%B;});}
/* caractéristiques d'un mot dans sa phrase (éléments) */
function tokFeats(toks,i,B){var L=toks.map(low),t=L[i],f=["bias"],nb=function(k){var j=i+k;return j<0?"^":j>=L.length?"$":(/^\d/.test(L[j])?"#":L[j]);};
  f.push("t:"+(/^\d/.test(t)?"#"+shape(toks[i]):t));if(!/^\d/.test(t)&&t.length>1)grams(t,f,"c:");f.push("s:"+shape(toks[i]));
  f.push("p1:"+nb(-1),"n1:"+nb(1),"p2:"+nb(-2),"n2:"+nb(2),"p1s:"+(i?shape(toks[i-1]):"^"),"n1s:"+(i<L.length-1?shape(toks[i+1]):"$"),"pp:"+nb(-2)+"_"+nb(-1),"nn:"+nb(1)+"_"+nb(2),"pos:"+Math.min(i,6));
  if(i===0)f.push("debut");return f.map(function(x){return fnv(x)%B;});}

function b64ToBytes(b){if(typeof atob==="function"){var s=atob(b),a=new Uint8Array(s.length);for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a;}return new Uint8Array(Buffer.from(b,"base64"));}
function bytesToB64(a){if(typeof btoa==="function"){var s="";for(var i=0;i<a.length;i+=8192)s+=String.fromCharCode.apply(null,a.subarray(i,i+8192));return btoa(s);}return Buffer.from(a).toString("base64");}
/* table de plongements quantifiée int8 (une échelle par ligne) */
function Table(spec){var q=b64ToBytes(spec.q),sc=spec.s,d=spec.d;this.d=d;this.B=spec.B;this.q=new Int8Array(q.buffer,q.byteOffset,q.byteLength);this.sc=Float32Array.from(sc);this.delta={};}
Table.prototype.mean=function(idx){var d=this.d,h=new Float32Array(d);for(var k=0;k<idx.length;k++){var r=idx[k],s=this.sc[r],o=r*d,dl=this.delta[r];if(s)for(var j=0;j<d;j++)h[j]+=this.q[o+j]*s;if(dl)for(j=0;j<d;j++)h[j]+=dl[j];}for(var j2=0;j2<d;j2++)h[j2]/=idx.length;return h;};
/* apprentissage des mots nouveaux : petites corrections gardées à part (la table d'origine ne change pas) */
Table.prototype.nudge=function(idx,g,lr){var d=this.d,fz=this.frozen;for(var k=0;k<idx.length;k++){var r=idx[k];if(fz&&(fz[r>>3]>>(r&7)&1))continue;var dl=this.delta[r]||(this.delta[r]=new Float32Array(d));for(var j=0;j<d;j++)dl[j]-=lr*g[j]/idx.length;}};
function Head(spec){this.K=spec.K;this.d=spec.d;this.W=Float32Array.from(spec.W);this.b=Float32Array.from(spec.b);}
Head.prototype.probs=function(h){var K=this.K,d=this.d,z=new Float32Array(K),m=-1e9;for(var k=0;k<K;k++){var s=this.b[k],o=k*d;for(var j=0;j<d;j++)s+=this.W[o+j]*h[j];z[k]=s;if(s>m)m=s;}var t=0;for(k=0;k<K;k++){z[k]=Math.exp(z[k]-m);t+=z[k];}for(k=0;k<K;k++)z[k]/=t;return z;};
Head.prototype.learn=function(h,y,lr){var p=this.probs(h),d=this.d,dh=new Float32Array(d);for(var k=0;k<this.K;k++){var g=(p[k]-(k===y?1:0)),o=k*d;for(var j=0;j<d;j++){dh[j]+=g*this.W[o+j];this.W[o+j]-=lr*g*h[j];}this.b[k]-=lr*g;}return {p:p[y],dh:dh};};

function create(model){
  var M={intents:model.intents,tags:model.tags,BI:model.intent.emb.B,BT:model.slots.emb.B};
  var EI=new Table(model.intent.emb);if(model.frozen)EI.frozen=b64ToBytes(model.frozen);var HI=new Head(model.intent.head),ET=new Table(model.slots.emb),HT=new Head(model.slots.head);
  M.version=model.version;M.stats=model.stats||null;
  /* analyse d'une phrase */
  M.read=function(raw){
    var toks=tokenize(raw);if(!toks.length)return {intent:"hors",p:1,probs:[],tokens:[],tags:[],slots:{}};
    var h=EI.mean(sentFeats(toks,M.BI)),p=HI.probs(h),best=0;for(var k=1;k<p.length;k++)if(p[k]>p[best])best=k;
    var tags=toks.map(function(t,i){var pt=HT.probs(ET.mean(tokFeats(toks,i,M.BT))),bt=0;for(var k=1;k<pt.length;k++)if(pt[k]>pt[bt])bt=k;return M.tags[bt];});
    /* corrige les I- orphelins puis regroupe les éléments */
    var slots={},cur=null;
    toks.forEach(function(t,i){var g=tags[i];if(g==="O"){cur=null;return;}var typ=g.slice(2);
      if(g.charAt(0)==="B"||!cur||cur.type!==typ){cur={type:typ,toks:[t],start:i};(slots[typ]=slots[typ]||[]).push(cur);}else cur.toks.push(t);});
    Object.keys(slots).forEach(function(k){slots[k]=slots[k].map(function(s){return {text:s.toks.join(" "),start:s.start};});});
    var top=[];for(k=0;k<p.length;k++)top.push([M.intents[k],p[k]]);top.sort(function(a,b){return b[1]-a[1];});
    return {intent:M.intents[best],p:p[best],top:top.slice(0,3),tokens:toks,tags:tags,slots:slots,_h:h};
  };
  /* apprentissage continu : une phrase confirmée renforce la bonne intention (plusieurs petits pas) */
  M.learn=function(raw,intent,steps){var y=M.intents.indexOf(intent);if(y<0)return false;var toks=tokenize(raw);if(!toks.length)return false;
    var f=sentFeats(toks,M.BI),n=steps||20,pr=0;
    for(var s=0;s<n;s++){var h=EI.mean(f),r=HI.learn(h,y,0.01);pr=r.p;if(pr>0.93)break;EI.nudge(f,r.dh,3.0);}
    var keys=Object.keys(EI.delta);if(keys.length>4000)keys.slice(0,keys.length-4000).forEach(function(k){delete EI.delta[k];});
    return pr;};
  /* sauvegarde de ce qui a été appris (seulement la couche de sortie, quelques Ko) */
  M.dumpHead=function(){var rows=Object.keys(EI.delta),buf=new Float32Array(rows.length*EI.d);rows.forEach(function(r,i){buf.set(EI.delta[r],i*EI.d);});
    return {v:M.version,W:bytesToB64(new Uint8Array(HI.W.buffer.slice(0))),b:Array.from(HI.b),rows:rows.map(Number),D:bytesToB64(new Uint8Array(buf.buffer))};};
  M.loadHead=function(o){if(!o||o.v!==M.version)return false;try{var a=b64ToBytes(o.W);HI.W=new Float32Array(a.buffer.slice(a.byteOffset,a.byteOffset+a.byteLength));HI.b=Float32Array.from(o.b);
    if(o.rows&&o.D){var z=b64ToBytes(o.D),f=new Float32Array(z.buffer.slice(z.byteOffset,z.byteOffset+z.byteLength));o.rows.forEach(function(r,i){EI.delta[r]=f.slice(i*EI.d,(i+1)*EI.d);});}return true;}catch(e){return false;}};
  return M;
}
root.CasoMini={create:create,tokenize:tokenize,sentFeats:sentFeats,tokFeats:tokFeats,low:low,fnv:fnv};
if(typeof module!=="undefined")module.exports=root.CasoMini;
})(typeof window!=="undefined"?window:globalThis);

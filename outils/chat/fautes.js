/* casô · fautes de frappe dans les 10 langues (lancé chaque semaine par GitHub, ou à la main : node outils/chat/fautes.js)
   Phrases tirées des traductions de l'appli : une faute (lettre inversée, oubliée ou doublée) sur un mot de 5 lettres ou plus.
   Compris = la phrase abîmée donne les mêmes actions que la phrase propre. Sortie 1 si une langue passe sous le seuil. */
const fs=require("fs"),path=require("path"),R=path.join(__dirname,"..","..","chat");
require(R+"/engine.js");require(process.env.BRAIN||R+"/brain.js");
const MINI=require(R+"/caso-mini.js"),mini=MINI.create(JSON.parse(fs.readFileSync(R+"/caso-mini-model.json","utf8")));
const DATA=JSON.parse(fs.readFileSync(R+"/data.json","utf8")),LANGS=["en","es","pt","it","ro","pl","tr","ru","ar"],CAT={};
LANGS.forEach(l=>CAT[l]=JSON.parse(fs.readFileSync(R+"/i18n/"+l+".json","utf8")));
const N=+(process.env.N||100),SEUIL=+(process.env.SEUIL||80);
function cerveau(l){const E=CasoEngine.create(DATA),B=CasoBrain.create(E,JSON.parse(JSON.stringify(DATA)),null);LANGS.forEach(x=>B.addCatalog(x,CAT[x]));B.mini=mini;B.now=()=>new Date(2026,10,6,9,30);B.setLangue(l);return B;}
/* tirage stable : chaque phrase a sa propre graine (son empreinte), et les phrases sont prises dans l'ordre de leur empreinte ;
   ajouter des traductions ne déplace presque pas l'échantillon */
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
const hash=t=>{let h=2166136261;for(const ch of t){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return h%2147483646+1;};
function abime(t){const w=t.split(" "),idx=w.map((x,i)=>[x,i]).filter(([x])=>[...x].length>=5&&/^\p{L}+$/u.test(x)&&x===x.toLowerCase());if(!idx.length)return null;
  const [x,i]=idx[Math.floor(rnd()*idx.length)],a=[...x],k=1+Math.floor(rnd()*(a.length-2)),m=Math.floor(rnd()*3);
  if(m===0)[a[k],a[k+1]]=[a[k+1],a[k]];else if(m===1)a.splice(k,1);else a.splice(k,0,a[k]);const y=a.join("");if(y===x)return null;w[i]=y;return w.join(" ");}
const sig=c=>JSON.stringify((c||[]).map(x=>[x.m,x.a]));
const res={},out=[];let bas=0;
LANGS.forEach(l=>{const T=[...new Set(Object.values(CAT[l]).filter(t=>typeof t==="string"&&!/\{\d\}/.test(t)&&t.length<80))].sort((a,b)=>hash(l+a)-hash(l+b)),B1=cerveau(l),B2=cerveau(l);let ok=0,n=0;
  for(let j=0;j<T.length&&n<N;j++){const t=T[j];seed=hash(t);const d=abime(t);if(!d)continue;const c=B1.parse(t);if(!c||!c.length)continue;n++;
    let r;try{r=B2.handle(d);}catch(e){r={};out.push("["+l+"] PLANTE "+d+" : "+e.message);}
    if(sig(c)===sig(r.cmds))ok++;else if(out.length<60)out.push("["+l+"] "+d+"   voulu "+sig(c)+"   eu "+sig(r.cmds));}
  res[l]=Math.round(100*ok/Math.max(1,n));if(res[l]<SEUIL)bas++;});
const rapport=["# Fautes de frappe dans les 10 langues","","Compris malgré une faute (sur "+N+" phrases par langue) : "+LANGS.map(l=>l+" "+res[l]+" %").join(", "),"Seuil : "+SEUIL+" %",""]
  .concat(process.env.V&&out.length?["```",out.join("\n"),"```"]:[]).join("\n");
console.log(rapport);if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,rapport+"\n");
process.exit(bas?1:0);

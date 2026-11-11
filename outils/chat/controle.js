/* casô · contrôle du chat (lancé chaque semaine par GitHub, ou à la main : node outils/chat/controle.js)
   1. Phrases de contrôle : chaque phrase doit donner la même réponse qu'à la dernière référence enregistrée.
   2. Exemples traduits : les exemples de l'aide, dans les 10 langues, doivent être compris comme leur version française.
   node outils/chat/controle.js            → compare (sortie 1 s'il y a une différence)
   node outils/chat/controle.js --base     → enregistre les réponses actuelles comme nouvelle référence (phrases et exemples français) */
const fs=require("fs"),path=require("path"),R=path.join(__dirname,"..","..","chat");
require(R+"/engine.js");require(R+"/brain.js");
const MINI=require(R+"/caso-mini.js"),mini=MINI.create(JSON.parse(fs.readFileSync(R+"/caso-mini-model.json","utf8")));
const DATA=JSON.parse(fs.readFileSync(R+"/data.json","utf8")),LANGS=["en","es","pt","it","ro","pl","tr","ru","ar"],CAT={};
LANGS.forEach(l=>CAT[l]=JSON.parse(fs.readFileSync(R+"/i18n/"+l+".json","utf8")));
const F=path.join(__dirname,"controle-donnees.json"),C=JSON.parse(fs.readFileSync(F,"utf8"));
function cerveau(D){const E=CasoEngine.create(D),B=CasoBrain.create(E,JSON.parse(JSON.stringify(D)),null);LANGS.forEach(l=>B.addCatalog(l,CAT[l]));B.mini=mini;B.now=()=>new Date(2026,10,6,9,30);return B;}
const dire=r=>(r.explain||"")+" | "+(r.says||[]).join(" ");
/* 1. phrases de contrôle, par lot (chaque lot est une conversation) */
let diff=0,tot=0;const base=process.argv.includes("--base"),out=[];
C.lots.forEach(L=>{const B=cerveau(DATA);L.phrases.forEach((t,i)=>{const s=dire(B.handle(t));tot++;if(base){L.attendu[i]=s;return;}
  if(s!==L.attendu[i]){diff++;out.push("["+L.nom+"] "+t+"\n   attendu : "+String(L.attendu[i]).slice(0,220)+"\n   obtenu  : "+s.slice(0,220));}});});
/* 2. exemples traduits */
function intents(t,l){const B=cerveau(DATA);B.setLangue("fr");C.avant.forEach(x=>B.handle(x));B.setLangue(l);const r=B.handle(t);return (r.cmds||[]).map(c=>c.m+"."+c.a).filter(x=>!/^sys\./.test(x)).sort().join("+")||"(pas compris)";}
const parL={};let exKo=0;
if(!base)C.exemples.forEach(e=>{const g=intents(e.t,e.l);parL[e.l]=parL[e.l]||[0,0];parL[e.l][1]++;if(g===e.want)parL[e.l][0]++;else{exKo++;out.push("[exemple "+e.l+" #"+e.id+"] "+e.t+"\n   compris : "+g+"   attendu : "+e.want);}});
/* la référence des exemples : ce que la phrase française comprend aujourd'hui */
if(base)C.exemples.forEach(e=>{if(e.l==="fr")e.want=intents(e.t,"fr");});
if(base){fs.writeFileSync(F,JSON.stringify(C));console.log("Référence enregistrée : "+tot+" phrases.");process.exit(0);}
const rapport=["# Contrôle du chat","","- Phrases de contrôle : "+(tot-diff)+" / "+tot+" identiques","- Exemples traduits : "+Object.keys(parL).map(l=>l+" "+parL[l][0]+"/"+parL[l][1]).join(", "),""].concat(out.length?["## Différences","","```",out.join("\n"),"```"]:["Aucune différence."]).join("\n");
console.log(rapport);if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,rapport+"\n");
process.exit(diff||exKo?1:0);

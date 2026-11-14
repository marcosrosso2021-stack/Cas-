/* casô · bilan de toute l'IA (lancé chaque lundi par GitHub, ou à la main : node outils/ia/bilan.js)
   Un score par partie, comparé aux seuils de outils/ia/seuils.json. Sortie 1 si une partie recule sous son seuil.
   Les essais dans le navigateur (chat de l'appli, chat du module 3D) sont lancés à part par le contrôle du lundi. */
const {spawnSync}=require("child_process"),fs=require("fs"),path=require("path");
const D=path.join(__dirname,".."),SEUILS=JSON.parse(fs.readFileSync(path.join(__dirname,"seuils.json"),"utf8"));
function run(f){const r=spawnSync(process.execPath,[path.join(D,f)],{encoding:"utf8",maxBuffer:64e6,env:Object.assign({},process.env,{GITHUB_STEP_SUMMARY:""})});return {code:r.status,out:(r.stdout||"")+(r.stderr||"")};}
const lignes=[],bas=[];
/* 1. commandes : phrases de contrôle et exemples traduits */
{const r=run("chat/controle.js"),ex=(r.out.match(/Exemples traduits : (.*)/)||[])[1]||"?";
 lignes.push(["Commandes (363 phrases, exemples traduits)",r.code===0?"aucune différence ; "+ex:"différences ; "+ex,r.code===0]);if(r.code!==0)bas.push("commandes");}
/* 2. questions du métier */
{const r=run("ia/metier.js"),l=(r.out.match(/Questions du métier : (.*)/)||[])[1]||"?";lignes.push(["Questions du métier",l,r.code===0]);if(r.code!==0)bas.push("métier");}
/* 3. fautes de frappe dans les 10 langues */
{const r=run("chat/fautes.js"),l=(r.out.match(/: ((?:[a-z]{2} \d+ %(?:, )?)+)/)||[])[1]||"",sc={};l.replace(/([a-z]{2}) (\d+) %/g,(m,a,b)=>sc[a]=+b);
 const sous=Object.keys(SEUILS.fautes).filter(k=>!(sc[k]>=SEUILS.fautes[k]));lignes.push(["Fautes de frappe (une faute, 100 phrases par langue)",l||"?",!sous.length]);
 if(sous.length)bas.push("fautes ("+sous.map(k=>k+" "+(sc[k]||0)+" % < "+SEUILS.fautes[k]+" %").join(", ")+")");}
const t=["# Bilan de l'IA de casô","","| Partie | Résultat | |","|---|---|---|"].concat(lignes.map(([a,b,ok])=>"| "+a+" | "+b+" | "+(ok?"✓":"✗ recul")+" |")).join("\n")+"\n";
console.log(t);if(bas.length)console.log("Recul : "+bas.join(" ; "));
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,t+(bas.length?"\nRecul : "+bas.join(" ; ")+"\n":""));
process.exit(bas.length?1:0);

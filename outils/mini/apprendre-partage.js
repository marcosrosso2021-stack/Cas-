/* casô · base d'apprentissage du mini modèle : ajoute les phrases que plusieurs usagers ont apprises au chat
   (serveur casô, /api/appris), comme corrections réelles (feedback.jsonl). Rien de personnel : les phrases arrivent
   masquées (« @c » client, « # » nombre, « @d » jour) et sont remplies ici avec des valeurs d'exemple.
   node outils/mini/apprendre-partage.js [adresse du serveur]   → écrit le nombre de phrases ajoutées */
const fs=require("fs"),path=require("path"),MINI=require("../../chat/caso-mini.js");
const SRV=(process.argv[2]||process.env.CASO_APPRIS||"https://api.caso.fr").replace(/\/$/,"");
const LAB=JSON.parse(fs.readFileSync(path.join(__dirname,"labels.json"),"utf8")),FB=path.join(__dirname,"feedback.jsonl");
const NOMS=["Martin","Dupont","Moreau","Lefebvre","García","Rossi","Kowalski","Yılmaz","Popescu","Silva"],JOURS={fr:"demain",en:"tomorrow",es:"mañana",pt:"amanhã",it:"domani",ro:"mâine",pl:"jutro",tr:"yarın",ru:"завтра",ar:"غدا"};
const vu=new Set(fs.readFileSync(FB,"utf8").split("\n").filter(Boolean).map(l=>{try{const x=JSON.parse(l);return x.lang+"|"+x.text}catch(e){return ""}}));
(async()=>{let add=[];
 for(const l of ["fr","en","es","pt","it","ro","pl","tr","ru","ar"]){let j;try{const r=await fetch(SRV+"/api/appris?l="+l,{signal:AbortSignal.timeout(15000)});if(!r.ok)continue;j=await r.json()}catch(e){continue}
  for(const x of (j&&j.e)||[]){if(!(+x.n>=2)||typeof x.m!=="string"||typeof x.t!=="string")continue;let c;try{c=JSON.parse(x.t)}catch(e){continue}
   const it=c&&c[0]&&c[0].m+"."+c[0].a;if(!LAB.intents.includes(it))continue;
   NOMS.slice(0,3).forEach((nom,i)=>{const text=x.m.replace(/@c/g,nom).replace(/@d/g,JOURS[l]).replace(/#/g,String([3,12,25][i])).replace(/@m/g,"");
    if(vu.has(l+"|"+text))return;vu.add(l+"|"+text);add.push({text,lang:l,intent:it,fi:MINI.sentFeats(MINI.tokenize(text),LAB.BI)});});}}
 if(add.length)fs.appendFileSync(FB,(fs.readFileSync(FB,"utf8").endsWith("\n")?"":"\n")+add.map(e=>JSON.stringify(e)).join("\n")+"\n");
 console.log(add.length);})();

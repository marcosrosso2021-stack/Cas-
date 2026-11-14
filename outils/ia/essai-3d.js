/* casô · essai du chat du module 3D dans l'appli (navigateur) : node outils/ia/essai-3d.js http://localhost:8767/index.html
   Mode Bricoleur, maquette d'exemple ; une phrase propre et une avec une faute de frappe par langue.
   Compris = une réponse arrive et ce n'est pas « Je n'ai pas compris » (dans les 10 langues). */
const {chromium}=require("playwright"),fs=require("fs"),path=require("path");
const URL0=process.argv[2]||"http://localhost:8767/index.html";
const P={fr:["ajoute un canapé","ajoute une lamep dans la chambre","anule"],en:["add a sofa","add a lamp in the bedroom"],es:["añade un sofá","pon una mesa en el salón"],
 pt:["adiciona um sofá","põe uma mesa na sala"],it:["aggiungi un divano","aggiungi una lampada in camera"],ro:["adaugă o canapea","pune o masă în sufragerie"],
 pl:["dodaj kanapę","postaw stół w salonie"],tr:["bir kanepe ekle","kaepeyi döndür"],ru:["добавь диван","отмни"],ar:["أضف أريكة","ضع طاولة في غرفة المعيشة"]};
/* textes « pas compris » du module 3D, lus dans lib/m3d.html */
const src=fs.readFileSync(path.join(__dirname,"..","..","lib","m3d.html"),"utf8");
const esc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const NONE=new RegExp(src.split("\n").filter(l=>/^chat_none\|/.test(l)).flatMap(l=>l.split("|").slice(1)).map(x=>esc(x.slice(0,18))).join("|"));
(async()=>{const b=await chromium.launch();const res={},rat=[];
 for(const l in P){const ctx=await b.newContext({serviceWorkers:"block",viewport:{width:390,height:844}}),p=await ctx.newPage();
  await p.addInitScript(l=>{localStorage.setItem("caso_account",JSON.stringify({prenom:"Test",email:"t@e.fr",mode:"bricoleur",lang:l}));localStorage.setItem("caso_lang",l);},l);
  await p.goto(URL0);await p.waitForTimeout(3500);
  const clic=async sel=>{for(let k=0;k<15;k++){for(const f of p.frames()){const c=await f.$(sel).catch(()=>null);if(c&&await c.isVisible().catch(()=>false)){await c.click().catch(()=>{});return true;}}await p.waitForTimeout(400);}return false;};
  await clic('[data-sec="cons"]');await p.waitForTimeout(1000);await clic("#b-example");await p.waitForTimeout(2500);
  const fr=p.frames().find(f=>f!==p.mainFrame());let ok=0;
  for(const t of P[l]){if(!fr){rat.push("["+l+"] module 3D introuvable");break;}
   const vis=await fr.$eval("#chat-in",e=>!!(e.offsetWidth||e.offsetHeight)).catch(()=>false);if(!vis){const o=await fr.$("#chat-c, #chat-x");if(o)await o.click().catch(()=>{});await p.waitForTimeout(200);}
   const av=await fr.$eval("#chat-l",e=>e.children.length).catch(()=>-1);
   await fr.fill("#chat-in",t).catch(()=>{});await fr.press("#chat-in","Enter").catch(()=>{});await p.waitForTimeout(900);
   const ap=await fr.$eval("#chat-l",e=>({n:e.children.length,txt:(e.lastElementChild&&e.lastElementChild.innerText||"").replace(/\s+/g," ").trim()})).catch(()=>({n:-1,txt:""}));
   if(ap.n>av&&!NONE.test(ap.txt))ok++;else rat.push("["+l+"] "+t+" → "+(ap.txt||"(aucune réponse)").slice(0,90));}
  res[l]=[ok,P[l].length];await ctx.close();}
 await b.close();const ligne="Chat du module 3D : "+Object.keys(P).map(l=>l+" "+res[l][0]+"/"+res[l][1]).join(", ");
 console.log(ligne);if(rat.length)console.log(rat.join("\n"));if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,"\n"+ligne+"\n"+(rat.length?"\n```\n"+rat.join("\n")+"\n```\n":""));
 process.exit(rat.length?1:0);})();

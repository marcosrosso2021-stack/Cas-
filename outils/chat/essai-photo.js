/* casô · essai de la photo de chantier envoyée par le trombone du chat (navigateur automatisé).
   Usage : NODE_PATH=$(npm root -g) node outils/chat/essai-photo.js [url]   (python3 -m http.server 8767 à la racine)
   Vérifie : une photo avec une phrase est rangée chez le client nommé ; sans phrase, une question puis « Quel client ? » ;
   « photos du chantier Martin » la montre ; la photo réduite est dans le coffre des photos, une vignette dans les données. */
const {chromium}=require("playwright"),fs=require("fs"),path=require("path");
const URL0=process.argv[2]||"http://localhost:8767/index.html";
const src=fs.readFileSync(path.join(__dirname,"essai-fiabilite.js"),"utf8"),D=src.slice(src.indexOf("const DONNEES=`")+15,src.indexOf("`;",src.indexOf("const DONNEES=`")));
const R=[],ok=(n,c,x)=>R.push((c?"ok   ":"RATÉ ")+n+(c||!x?"":"  ["+String(x).slice(0,200)+"]"));
(async()=>{const b=await chromium.launch(),p=await (await b.newContext({serviceWorkers:"block"})).newPage();let err=0;p.on("dialog",d=>d.dismiss().catch(()=>{}));p.on("pageerror",()=>err++);
 await p.addInitScript(()=>{localStorage.setItem("caso_account",JSON.stringify({prenom:"Paul",email:"t@e.fr",mode:"artisan",lang:"fr"}));localStorage.setItem("caso_lang","fr");localStorage.setItem("caso_ia_rappel",new Date().toISOString().slice(0,10));});
 await p.goto(URL0);await p.waitForTimeout(900);await p.evaluate(()=>{document.body.classList.remove("starting");tab("chat")});
 await p.waitForFunction(()=>window.casoPont&&casoPont.ready&&casoPont.photoChantier,null,{timeout:25000});await p.evaluate(D);
 const dernier=()=>p.evaluate(()=>{const m=CHAT.m[CHAT.m.length-1];return (m.text||(m.html||"").replace(/<img[^>]*>/g,"[img]").replace(/<[^>]+>/g," ")).replace(/\s+/g," ").trim()});
 const attends=async re=>{for(let i=0;i<60;i++){const t=await dernier();if(re.test(t))return t;await p.waitForTimeout(300)}return await dernier()};
 const envoie=dit=>p.evaluate(async dit=>{const c=document.createElement("canvas");c.width=800;c.height=600;const x=c.getContext("2d");x.fillStyle="#8a7";x.fillRect(0,0,800,600);const bl=await new Promise(r=>c.toBlob(r,"image/jpeg",.8));
   document.getElementById("chatIn").value=dit;chatFile({files:[new File([bl],"image.jpg",{type:"image/jpeg"})],value:""})},dit);
 await envoie("ici faut refaire le bas du mur chez Martin");let t=await attends(/Photo rangée/);
 ok("photo avec une phrase : rangée chez le client nommé",/\[img\] Photo rangée chez Martin\. ici faut refaire le bas du mur/.test(t),t);
 let d=await p.evaluate(async()=>{const x=(db.photosCh||[])[0]||{};const s=await PH.get("ch:"+x.id);return {n:(db.photosCh||[]).length,cid:x.cid,note:x.note,th:/^data:image\/jpeg/.test(x.th||""),plein:/^data:image\/jpeg/.test(s||"")&&String(s).length>String(x.th).length}});
 ok("une vignette dans les données, la photo dans le coffre des photos",d.n===1&&d.cid==="c1"&&d.th&&d.plein&&/bas du mur/.test(d.note),JSON.stringify(d));
 ok("le champ de saisie est vidé",await p.evaluate(()=>document.getElementById("chatIn").value===""));
 await envoie("");t=await attends(/plan ou une photo/);
 ok("photo sans phrase : une question, pas la maquette 3D",/C’est un plan ou une photo de chantier/.test(t)&&await p.evaluate(()=>document.getElementById("m3d").hidden!==false),t);
 await p.evaluate(()=>chType("photo"));t=await attends(/quel client/);ok("« Photo de chantier » : quel client ?",/quel client/.test(t),t);
 await p.evaluate(()=>chatSend("Petit"));t=await attends(/Photo rangée/);ok("le nom donné range la photo",/Photo rangée chez Petit/.test(t)&&await p.evaluate(()=>db.photosCh.length===2&&db.photosCh[0].cid==="c3"),t);
 await p.evaluate(()=>chatSend("photos du chantier Martin"));await p.waitForTimeout(1300);
 ok("« photos du chantier Martin » montre la photo",await p.evaluate(()=>{const h=CHAT.m[CHAT.m.length-1].html||"";return /casoPont\.photoVoir/.test(h)&&(h.match(/<img/g)||[]).length>=1}));
 await p.evaluate(()=>casoPont.photoVoir(db.photosCh[1].id));await p.waitForTimeout(900);t=await dernier();
 ok("toucher la vignette montre la photo et la phrase",/\[img\] Martin · .*bas du mur/.test(t),t);
 await envoie("le plan de la maison");await p.waitForTimeout(6000);
 ok("une phrase qui parle d'un plan : la photo n'est pas rangée comme photo de chantier",await p.evaluate(()=>db.photosCh.length===2));
 ok("aucune erreur de l'appli",err===0,err);
 await b.close();console.log(R.join("\n"));const f=R.filter(x=>x.startsWith("RATÉ")).length;console.log(f?f+" essai(s) raté(s).":"Tous les essais passent.");process.exit(f?1:0);
})().catch(e=>{console.error(e);process.exit(1)});

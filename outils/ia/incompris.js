/* casô · phrases que l'IA n'a pas comprises chez les vrais usagers (masquées, envoyées par au moins 3 usagers)
   CASO_CLE_IA=… node outils/ia/incompris.js [https://api.caso.fr]   (la même clé que la variable CASO_CLE_IA du serveur) */
const base=(process.argv[2]||"https://api.caso.fr").replace(/\/$/,""),cle=process.env.CASO_CLE_IA||"";
if(!cle){console.log("Il faut la clé : CASO_CLE_IA=… node outils/ia/incompris.js");process.exit(1);}
fetch(base+"/api/incompris",{headers:{"x-caso-cle":cle}}).then(r=>r.ok?r.json():Promise.reject(new Error("réponse "+r.status))).then(j=>{
  let n=0;for(const l in j.e){const L=j.e[l];if(!L.length)continue;console.log("\n["+l+"]");L.forEach(x=>{n++;console.log(String(x.n).padStart(3)+"  "+(x.s==="3d"?"3D   ":"chat ")+x.t);});}
  if(!n)console.log("Rien pour l'instant (une phrase apparaît quand 3 usagers au moins l'ont envoyée).");}).catch(e=>{console.log("Lecture impossible : "+e.message);process.exit(1);});

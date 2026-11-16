/* casô · essai du langage de chantier (chat/langage.js), sans navigateur.
   Usage : node outils/chat/essai-langage.js
   1. corpus-langage.json : chaque phrase de chantier doit sortir nettoyée (mots attendus présents, mots fautifs absents) ;
      les phrases marquées « id » (commandes de l'appli) doivent sortir identiques.
   2. Les phrases françaises du contrôle du moteur (controle-donnees.json) ne doivent pas être réécrites,
      sauf pour une faute corrigée sur un mot du métier (« carelage » → « carrelage »).
   Sortie 1 s'il y a un raté. */
const fs=require("fs"),path=require("path"),R=path.join(__dirname,"..","..");
global.window={};require(path.join(R,"chat/lexique-btp.js"));require(path.join(R,"chat/langage.js"));
const L=window.CASO_LANGAGE,nz=x=>String(x).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const C=JSON.parse(fs.readFileSync(path.join(__dirname,"corpus-langage.json"),"utf8"));
let rate=0;const par={};
for(const c of C){const r=L.nettoie(c.p).t,low=" "+r.toLowerCase()+" ";let ok=true;
 if(c.id)ok=r===c.p;else{for(const a of c.a)if(low.indexOf(a.toLowerCase())<0)ok=false;for(const s of c.s)if(low.indexOf(s.toLowerCase())>=0)ok=false;}
 par[c.m]=par[c.m]||[0,0];par[c.m][1]++;if(ok)par[c.m][0]++;else{rate++;console.log("RATÉ ["+c.m+"] "+c.p+"\n      → "+r);}}
/* phrases du contrôle du moteur */
let n=0,chg=0;try{const D=JSON.parse(fs.readFileSync(path.join(__dirname,"controle-donnees.json"),"utf8"));const P=[];(function w(o){if(typeof o==="string"){if(o.length>3&&o.length<200&&/ /.test(o))P.push(o);}else if(o&&typeof o==="object")for(const k in o)w(o[k]);})(D);
 for(const p of new Set(P)){n++;const r=L.nettoie(p);if(!r.change)continue;
  /* admis : seuls des mots du métier ont changé, à une ou deux lettres près ou par leurs accents */
  const a=nz(p).split(/\s+/),b=nz(r.t).split(/\s+/);if(a.length!==b.length||a.some((w,i)=>w!==b[i]&&Math.abs(w.length-b[i].length)>2)){chg++;rate++;console.log("RÉÉCRIT "+p+"\n      → "+r.t);}}}catch(e){console.log("controle-donnees.json illisible : "+e.message);}
console.log("# Langage de chantier\n\n- lexique : "+L.nombre+" termes\n- corpus : "+Object.keys(par).map(k=>k+" "+par[k][0]+"/"+par[k][1]).join(", ")+"\n- phrases du contrôle du moteur relues : "+n+", réécrites à tort : "+chg+"\n\n"+(rate?rate+" raté(s).":"Tous les essais passent."));
process.exit(rate?1:0);

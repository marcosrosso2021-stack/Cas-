/* casô · simulation d'usagers dans l'appli (navigateur automatisé).
   Usage : NODE_PATH=$(npm root -g) node outils/chat/simulation.js [url] [nombre] [graine]
     url     : http://localhost:8767/index.html par défaut (python3 -m http.server 8767 à la racine)
     nombre  : 100 usagers par défaut (60 % en français, les autres dans les 9 autres langues)
     graine  : 1 par défaut — même graine = mêmes messages, pour comparer deux versions de l'appli
   Chaque usager envoie 12 à 16 messages : commandes de l'appli, phrases de chantier (français), avec des fautes de frappe,
   du style SMS (accents perdus, minuscules) ou des majuscules ; plus un charabia et une demande hors sujet (non comptés).
   Mesures : messages compris, bulles vides, erreurs de l'appli, messages sans réponse.
   « Compris » = le chat a répondu autre chose que « Je n'ai pas compris ». Ce n'est pas « bien compris » :
   la justesse des réponses est vérifiée par les autres essais (essai-appli, essai-fiabilite, essai-langage). */
const {chromium}=require("playwright"),fs=require("fs"),path=require("path");
const URL0=process.argv[2]||"http://localhost:8767/index.html",N=+(process.argv[3]||100),GRAINE=+(process.argv[4]||1);
const C=JSON.parse(fs.readFileSync(path.join(__dirname,"controle-donnees.json"),"utf8"));
const CORPUS=JSON.parse(fs.readFileSync(path.join(__dirname,"corpus-langage.json"),"utf8")).filter(c=>!c.id).map(c=>c.p);
const LANGS=["en","es","pt","it","ro","pl","tr","ru","ar"];
function alea(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
/* phrases par langue : les exemples de l'aide (hors maquette 3D et hors actions qui quittent le chat) */
const HORS=/^(scene\.|app\.(mode|deconnexion|compte|reglages)|sys\.)/,EX={};
C.exemples.forEach(e=>{if(HORS.test(e.want)||e.want==="(pas compris)")return;(EX[e.l]=EX[e.l]||[]).push(e.t);});
/* en français : aussi les conversations de contrôle de l'artisan et les phrases de chantier */
const FR_LOTS=[].concat(...C.lots.filter(l=>/artisan|ia|para|q10|fonctions/.test(l.nom)).map(l=>l.phrases)).filter(t=>t.length>5&&t.length<120&&!/maquette|3d|meuble|canap|mode bricoleur|d[ée]connexion|supprime (mon|le) compte/i.test(t));
/* « casô note », « casô fin » sont des mots de la dictée : ils n'attendent pas de réponse */
const DICTEE=/^cas[oô] (note|fin)$/i;
const CHARABIA=["azfk qsdjl mwx","blorp zzt 77 kk","hhhhhh","lkjlkj poi"],HORSSUJET=["quel temps fait-il demain ?","raconte-moi une blague","qui a gagné le match hier ?","c'est quoi la capitale de l'Australie ?"];
function abime(t,r){const x=r();
  if(x<0.30){/* faute de frappe : deux lettres inversées ou une lettre oubliée, dans un mot de 5 lettres ou plus */
    const m=[...t.matchAll(/\p{L}{5,}/gu)];if(m.length){const w=m[Math.floor(r()*m.length)],i=w.index+1+Math.floor(r()*(w[0].length-2));return r()<0.5?t.slice(0,i)+t[i+1]+t[i]+t.slice(i+2):t.slice(0,i)+t.slice(i+1);}}
  if(x<0.45)return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[’']/g," ");
  if(x<0.50)return t.toUpperCase();
  return t;}
const DONNEES=`(function(){const uid2=()=>Math.random().toString(36).slice(2,10);
 db.clients.push({id:'c1',nom:'Martin',tel:'0611111111',adr:'3 rue Victor Hugo, Lyon'},{id:'c2',nom:'Dupont',tel:'0622222222',adr:''},{id:'c3',nom:'Petit',tel:'',adr:'8 avenue Foch, Lyon'});
 db.prices.push({id:'p1',nom:'Carrelage',unit:'m²',prix:45,tva:10},{id:'p2',nom:'Faïence',unit:'m²',prix:50,tva:10},{id:'p3',nom:'Main d\\'œuvre',unit:'h',prix:45,tva:10},{id:'p4',nom:'Peinture',unit:'m²',prix:22,tva:10});
 save();})()`;
async function usager(b,i,res){const lg=i<Math.round(N*0.6)?"fr":LANGS[(i-Math.round(N*0.6))%LANGS.length],r=alea(GRAINE*7919+i*104729);
  const pool=(lg==="fr"?FR_LOTS.concat(EX.fr||[],CORPUS,CORPUS):(EX[lg]||[])).filter(t=>!DICTEE.test(t.trim())),nb=12+Math.floor(r()*5),msgs=[];
  for(let k=0;k<nb;k++)msgs.push({t:abime(pool[Math.floor(r()*pool.length)],r),ok:true});
  msgs.splice(1+Math.floor(r()*(nb-1)),0,{t:CHARABIA[Math.floor(r()*CHARABIA.length)],ok:false});msgs.splice(1+Math.floor(r()*nb),0,{t:HORSSUJET[Math.floor(r()*HORSSUJET.length)],ok:false});
  if(process.env.SEULEMENT&&process.env.SEULEMENT!==lg)return;
  const ctx=await b.newContext({serviceWorkers:"block"}),p=await ctx.newPage(),R=res[lg]=res[lg]||{n:0,compris:0,vides:0,muets:0,erreurs:0,rates:[]};
  p.on("pageerror",e=>{R.erreurs++;if(res._err.length<12)res._err.push("["+lg+"] "+String(e.message).slice(0,160));});p.on("dialog",d=>d.dismiss().catch(()=>{}));
  await p.addInitScript(l=>{localStorage.setItem("caso_account",JSON.stringify({prenom:"Paul",email:"t@e.fr",mode:"artisan",lang:l}));localStorage.setItem("caso_lang",l);localStorage.setItem("caso_ia_rappel",new Date().toISOString().slice(0,10));},lg);
  try{await p.goto(URL0);await p.waitForTimeout(900);await p.evaluate(()=>{document.body.classList.remove("starting");tab("chat")});
    await p.waitForFunction(()=>window.casoPont&&casoPont.ready&&casoPont.question,null,{timeout:25000});await p.evaluate(DONNEES);
    const PAS=await p.evaluate(()=>casoPont.tr("Je n’ai pas compris."));
    for(const m of msgs){const n0=await p.evaluate(()=>CHAT.m.length);
      await p.evaluate(t=>{try{tab("chat")}catch(e){}chatSend(t)},m.t);
      let rep=null;for(let w=0;w<28&&rep==null;w++){await p.waitForTimeout(220);rep=await p.evaluate(n=>{const M=CHAT.m.slice(n).filter(x=>x.who==="bot");if(!M.length)return null;const d=document.createElement("div");d.innerHTML=M.map(x=>x.html||x.text||"").join(" ");return d.textContent.replace(/\s+/g," ").trim();},n0);}
      if(!m.ok)continue;R.n++;
      if(rep==null){R.muets++;R.rates.push("(sans réponse) "+m.t);}
      else if(!rep){R.vides++;R.rates.push("(bulle vide) "+m.t);}
      else if(rep.indexOf(PAS.replace(/[.!]+$/,""))>=0){R.rates.push(m.t);}
      else R.compris++;}
  }catch(e){R.erreurs++;if(res._err.length<12)res._err.push("["+lg+"] usager "+i+" : "+String(e.message).slice(0,160));}
  await ctx.close();}
(async()=>{const b=await chromium.launch(),res={_err:[]},file=[...Array(N).keys()],PAR=4;
  await Promise.all([...Array(PAR)].map(async()=>{while(file.length){const i=file.shift();await usager(b,i,res);}}));await b.close();
  const L=Object.keys(res).filter(k=>k!=="_err"),T=L.reduce((a,k)=>{for(const x of["n","compris","vides","muets","erreurs"])a[x]+=res[k][x];return a;},{n:0,compris:0,vides:0,muets:0,erreurs:0});
  const pc=(a,b)=>b?(Math.round(a/b*1000)/10+" %").replace(".",","):"—";
  const out=["# Simulation de "+N+" usagers (graine "+GRAINE+")","","| Langue | Messages | Compris | Bulles vides | Sans réponse | Erreurs |","|---|---|---|---|---|---|"]
    .concat(["fr"].concat(LANGS).filter(k=>res[k]).map(k=>"| "+k+" | "+res[k].n+" | "+pc(res[k].compris,res[k].n)+" | "+res[k].vides+" | "+res[k].muets+" | "+res[k].erreurs+" |"))
    .concat(["| **Total** | "+T.n+" | "+pc(T.compris,T.n)+" | "+T.vides+" | "+T.muets+" | "+T.erreurs+" |","","Messages non compris (extraits) :"])
    .concat(...["fr"].concat(LANGS).filter(k=>res[k]&&res[k].rates.length).map(k=>res[k].rates.slice(0,4).map(t=>"- ["+k+"] "+t)));
  /* SORTIE=fichier : tous les messages non compris, pour comparer deux versions */
  if(process.env.SORTIE)fs.writeFileSync(process.env.SORTIE,JSON.stringify(Object.fromEntries(L.map(k=>[k,res[k].rates])),null,1));
  if(res._err.length)out.push("","Erreurs de l'appli :",...res._err.map(e=>"- "+e));
  console.log(out.join("\n"));if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,out.join("\n")+"\n");
  process.exit(0);})();

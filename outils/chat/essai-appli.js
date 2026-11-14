/* casô · essai du chat dans l'appli (navigateur automatisé, Playwright).
   node outils/chat/essai-appli.js [adresse]   (par défaut http://localhost:8767/index.html ; casô servi depuis la racine du dépôt)
   Chaque essai part d'une appli neuve avec quelques données (clients, prix, devis, factures, achats), envoie ses phrases
   et vérifie que la réponse contient le texte attendu. Sortie 1 si un essai échoue. */
const {chromium}=require("playwright"),fs=require("fs");
const URL0=process.argv[2]||"http://localhost:8767/index.html";
const DONNEES=`(()=>{const d=n=>{const x=new Date();x.setDate(x.getDate()+n);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
db.clients.push({id:'c1',nom:'Martin',tel:'0611111111',adr:'3 rue Victor Hugo, Lyon'},{id:'c2',nom:'Dupont',tel:'0622222222',adr:'12 rue des Lilas, Marseille'},{id:'c3',nom:'Petit',tel:'0633333333',adr:'8 avenue Foch, Paris'});
db.prices.push({id:'p1',nom:'Carrelage',unit:'m²',prix:45,tva:10},{id:'p2',nom:'Faïence',unit:'m²',prix:50,tva:10},{id:'p3',nom:'Dépose carrelage',unit:'m²',prix:15,tva:10},{id:'p4',nom:'Receveur de douche',unit:'u',prix:350,tva:10},{id:'p5',nom:"Main d'œuvre",unit:'h',prix:45,tva:10},{id:'p6',nom:'Colle carrelage',unit:'sac',prix:18,tva:10});
db.quotes.push({id:'q1',num:'D2026-001',client:'Martin',date:'2026-10-20',status:'accepte',lines:[{label:'Carrelage',qty:20,unit:'m²',pu:45,tva:10},{label:'Colle carrelage',qty:4,unit:'sac',pu:18,tva:10},{label:"Main d'œuvre",qty:16,unit:'h',pu:45,tva:10}],remise:0},
 {id:'q2',num:'D2026-002',client:'Petit',date:'2026-09-10',status:'accepte',lines:[{label:'Carrelage',qty:30,unit:'m²',pu:42,tva:10},{label:"Main d'œuvre",qty:21,unit:'h',pu:45,tva:10}],remise:0});
db.invoices.push({id:'f1',kind:'facture',num:'F2026-001',qid:'q1',date:'2026-10-25',client:{nom:'Martin'},lines:[{label:'Carrelage',qty:20,unit:'m²',pu:45,tva:10}],pays:[{amt:900,d:'2026-10-25',mode:'virement'}],remise:0});
db.suppliers.push({id:'s1',nom:'Point P'},{id:'s2',nom:'Cedeo'});
db.achats=[{id:'a1',four:'Point P',type:'facture',date:'2026-10-14',ttc:300,ht:250,cid:'c1',lines:[]}];
db.hist.push({date:'2026-10-14',nom:'PLAQUE BA13 STD 2500x1200',four:'Point P',prix:8.95,unit:'u'},{date:'2026-10-02',nom:'Plaque BA13',four:'Cedeo',prix:9.4,unit:'u'},{date:'2026-10-14',nom:'Faïence',four:'Point P',prix:21,unit:'m²'});
db.events.push({id:'e1',t:'rdv',d:d(-1),a:'10:00',b:'11:00',title:'Dupont',cid:'c2'});
db.chantiers=db.chantiers||[];db.pts=db.pts||[];db.chantiers.push({id:'ch1',cid:'c1',nom:'Martin',adr:'3 rue Victor Hugo, Lyon'});
{const t0=new Date('2026-10-21T08:00:00').getTime();db.pts.push({id:'t1',c:'ch1',p:'moi',t:'in',ts:t0},{id:'t2',c:'ch1',p:'moi',t:'out',ts:t0+8*36e5},{id:'t3',c:'ch1',p:'moi',t:'in',ts:t0+864e5},{id:'t4',c:'ch1',p:'moi',t:'out',ts:t0+864e5+8*36e5});}
db.maq3d=[{id:'m1',at:Date.now(),d:{estimation:{lignes:[{poste:'Rebouchage de fissures',unite:'ml',quantite:3,prix_min:20,prix_max:40},{poste:'Peinture murs',unite:'m2',quantite:25,prix_min:15,prix_max:25}]}}}];save();})()`;
/* [langue, phrases, textes attendus dans les réponses (dans l'ordre des phrases ; "" = pas de contrôle)] */
const ESSAIS=[
 ["fr",["crée le client Durand, rendez-vous jeudi 9h et prépare le devis"],[/Nouveau client : Durand[\s\S]*Durand[\s\S]*devis de Durand/]],
 ["fr",["rappelle le client d'hier"],[/Dupont/]],
 ["fr",["appelle la dame de la rue des Lilas"],[/Dupont/]],
 ["fr",["fais le même devis que Martin pour Dupont"],[/Dupont[\s\S]*Carrelage/]],
 ["fr",["où j'achète le BA13 le moins cher"],[/Point P 8,95/]],
 ["fr",["mon chantier le plus rentable"],[/rentables[\s\S]*Martin/]],
 ["fr",["combien j'ai gagné chez Martin","mon heure me coûte 30 €","combien j'ai gagné chez Martin"],[/Martin : 900[\s\S]*marge[\s\S]*16 h[\s\S]*heure de travail/,/30 €/,/Martin : 900[\s\S]*16 h à 30[\s\S]*bénéfice 170[\s\S]*19 %/]],
 ["fr",["combien j'ai dépensé chez Point P en octobre"],[/300/]],
 ["fr",["combien de temps pour 25 m² de carrelage"],[/Environ \d+/]],
 ["fr",["salle de bain 6 m², dépose carrelage, pose faïence, receveur"],[/Faïence[\s\S]*Receveur de douche[\s\S]*gravats/]],
 ["fr",["nouveau devis pour Petit","faïence 10 m² à 18 €"],["",/À vérifier[\s\S]*acheté 21/]],
 ["es",["¿cuál es mi obra más rentable?"],[/rentables/]],
 ["en",["where is BA13 the cheapest"],[/Point P/]],
 ["fr",["devis pour Dupont carrelage 14 m² et main d'oeuvre 8 h"],[/Carrelage 14 m²[\s\S]*Main d.œuvre 8 h/]],
 ["fr",["rdv mardi 9h avec Dupont"],[/Dupont/]],
 ["fr",["rdv demain à 9h chez Dupont et envoie-lui un SMS pour confirmer le rdv"],[/Dupont[\s\S]*SMS/]],
 ["fr",["nouveau devis pour Petit, ajoute faïence 10 m² à 50 €"],[/Faïence/]],
 ["fr",["nouveau devis pour Petit","durée des travaux 5 jours sur le devis"],["",/[Dd]ébut des travaux/]],
 ["fr",["combien d'heures cette semaine"],[/heures/]],
 ["fr",["devis pour Martin carrelage 20 m² à 45 €"],[/Martin Déjà[\s\S]*Carrelage/]],
 ["fr",["dépose carrelage 20 m²"],[/Dépose carrelage[\s\S]*15,00/]],
 ["fr",["nouveau devis pour Petit","carrelage 20 m² à 40 €","ajoute une marge de 10 %"],["","",/Marge de 10 %/]],
 ["fr",["montre moi la paperasse"],[/compris/]],
 ["fr",["quel taux de tva pour une rénovation"],[/10 %[\s\S]*5,5 %/]],
 ["fr",["combien de parpaings pour un mur de 10 m²"],[/105 parpaings/]],
 ["es",["qué tipo de iva para una reforma"],[/IVA en una vivienda/]],
 ["fr",["nouveau devis pour Petit","carrelage 20 m² à 40 €","tva à 5,5 %"],["",/880,00/,/844/]],
 ["fr",["nouveau devis pour Petit","appelle ce client"],["",/Petit : 0633333333/]],
 ["fr",["nouveau devis pour Dupont","carrelage 10 m² à 40 €","nouveau devis pour Petit","mets la rénovation sur le devis de Dupont"],["","","",/Rebouchage de fissures[\s\S]*Peinture murs[\s\S]*Total du devis 1[\s\S]*€ TTC/]]
];
(async()=>{const b=await chromium.launch();let ko=0;const out=[];
 for(const [lg,phr,att] of ESSAIS){const ctx=await b.newContext({serviceWorkers:"block"}),p=await ctx.newPage();const err=[];p.on("pageerror",e=>err.push(e.message));
  await p.addInitScript(l=>{localStorage.setItem("caso_account",JSON.stringify({prenom:"Paul",email:"t@e.fr",mode:"artisan",lang:l}));localStorage.setItem("caso_lang",l);},lg);
  await p.goto(URL0);await p.waitForTimeout(1200);await p.evaluate(()=>{document.body.classList.remove("starting");tab("chat")});
  await p.waitForFunction(()=>window.casoPont&&casoPont.ready&&casoPont.question,null,{timeout:20000});await p.evaluate(s=>eval(s),DONNEES);
  for(let i=0;i<phr.length;i++){const n=await p.evaluate(()=>CHAT.m.length);await p.evaluate(t=>chatSend(t),phr[i]);await p.waitForTimeout(900);await p.waitForFunction(()=>!chatMulti.busy,null,{timeout:15000});await p.waitForTimeout(300);
   const rep=await p.evaluate(n=>CHAT.m.slice(n).filter(m=>m.who==="bot").map(m=>String(m.html||"").replace(/<[^>]+>/g," ").replace(/&#39;/g,"'").replace(/\s+/g," ")).join(" / "),n);
   const a=att[i],ok=!a||a.test(rep);if(!ok)ko++;out.push((ok?"ok   ":"RATÉ ")+"["+lg+"] "+phr[i]+(ok?"":"\n      réponse : "+rep.slice(0,300)+"\n      attendu : "+a));}
  if(err.length){ko++;out.push("ERREUR ["+lg+"] "+phr.join(" / ")+" : "+err.join(" ; "));}
  await ctx.close();}
 await b.close();const rapport="# Essai du chat dans l'appli\n\n```\n"+out.join("\n")+"\n```\n\n"+(ko?ko+" essai(s) raté(s).":"Tous les essais passent.");
 console.log(rapport);if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,rapport+"\n");process.exit(ko?1:0);})();

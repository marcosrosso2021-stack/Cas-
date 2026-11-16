/* casô · essai de la fiche chantier, du lexique du bâtiment et de l'historique dans l'appli (navigateur automatisé, Playwright).
   node outils/chat/essai-chantier.js [adresse]   (par défaut http://localhost:8767/index.html ; casô servi depuis la racine du dépôt)
   Chaque essai part d'une appli neuve avec quelques données (clients, devis, factures, rendez-vous, plan, pointage), envoie ses phrases
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
db.events.push({id:'e1',t:'rdv',d:agToday()===agWeekStart(agToday())?agToday():d(-1),/* jamais la semaine dernière : « reprends le chantier de la semaine dernière » doit rester Martin, même un lundi */a:'10:00',b:'11:00',title:'Dupont',cid:'c2'},{id:'e2',t:'rdv',d:agAdd(agWeekStart(agToday()),-5),a:'08:00',b:'17:00',title:'Pose carrelage',cid:'c1'},{id:'e3',t:'rdv',d:agAdd(agWeekStart(agToday()),8),a:'08:00',b:'12:00',title:'Plinthes',cid:'c1'},{id:'e4',t:'rdv',d:agAdd(agWeekStart(agToday()),9),a:'14:00',b:'16:00',title:'Devis cuisine',cid:'c3'});
db.plans.push({id:'pl1',pid:'pr1',cid:'c1',nom:'Salle de bain',date:Date.now()-864e5,th:'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',pts:[],wm:[],h:{ok:true},ops:[]});
db.quotes.push({id:'q3',num:'',client:'Martin',date:'2026-11-10',status:'brouillon',lines:[{label:'Peinture',qty:25,unit:'m²',pu:20,tva:10}],remise:0});
db.chantiers=db.chantiers||[];db.pts=db.pts||[];db.chantiers.push({id:'ch1',cid:'c1',nom:'Martin',adr:'3 rue Victor Hugo, Lyon'});
{const t0=new Date('2026-10-21T08:00:00').getTime();db.pts.push({id:'t1',c:'ch1',p:'moi',t:'in',ts:t0},{id:'t2',c:'ch1',p:'moi',t:'out',ts:t0+8*36e5},{id:'t3',c:'ch1',p:'moi',t:'in',ts:t0+864e5},{id:'t4',c:'ch1',p:'moi',t:'out',ts:t0+864e5+8*36e5});}
db.maq3d=[{id:'m1',at:Date.now(),d:{estimation:{lignes:[{poste:'Rebouchage de fissures',unite:'ml',quantite:3,prix_min:20,prix_max:40},{poste:'Peinture murs',unite:'m2',quantite:25,prix_min:15,prix_max:25}]}}}];save();})()`;
/* [langue, phrases, textes attendus dans les réponses (dans l'ordre des phrases ; "" = pas de contrôle)] */
const ESSAIS=[
 ["fr",["Il faut refaire le sol chez Martin, mettre du carrelage et prévoir les plinthes."],[/./]],
 ["fr",["Reprends le chantier de la semaine dernière."],[/Chantier Martin/]],
 ["fr",["Il faut faire un ragréage avant le parquet."],[/D’abord ragréage, puis parquet/]],
 ["fr",["ragréage avant le parquet"],[/D’abord ragréage, puis parquet/]],
 ["fr",["Montre-moi tous les chantiers de la semaine prochaine."],[/Chantiers de la semaine prochaine.*Martin.*Petit/]],
 ["fr",["c'est quoi un ragréage ?"],[/Ragréage : Mortier liquide/]],
 ["fr",["ordre des travaux"],[/Ordre habituel des travaux/]],
 ["fr",["on pose le parquet ou la peinture en premier ?"],[/D’abord peinture, puis parquet/]],
 ["fr",["carrelage avant peinture ?"],[/Pas d’ordre fixe/]],
 ["fr",["calcule la surface d'une pièce de 4 m sur 3,5 m"],[/14 m²/]],
 ["fr",["volume d'une dalle de 5 m par 4 m en 12 cm"],[/2,4 m³/]],
 ["fr",["combien de carrelage pour 20 m²"],[/22 m²/]],
 ["fr",["quels sont les documents du chantier Martin ?"],[/D2026-001.*F2026-001.*Salle de bain/]],
 ["fr",["montre les photos du chantier Martin"],[/Chantier Martin/]],
 ["fr",["qu'est-ce que j'ai fait chez Martin ?"],[/Carrelage.*Pose carrelage.*16 h/]],
 ["fr",["qu'est-ce qu'il reste chez Martin ?"],[/Plinthes/]],
 ["fr",["fais un rapport du chantier Martin"],[/Chantier Martin.*Plinthes.*D2026-001.*16 h.*Achats/]],
 ["fr",["fiche chantier Dupont"],[/Chantier Dupont/]],
 ["fr",["ajoute 10 m² de faïence au devis de Martin","historique","qui a modifié le devis de Martin ?"],[/./,/Devis.*Martin.*modification|Devis.*Martin.*ajout/,/Paul/]],
 ["fr",["crée le client Bernard","historique"],[/./,/Client Bernard : ajout/]],
 ["fr",["ajoute 20 m² de carrelage"],[/Carrelage/]],
 ["fr",["le chantier de Martin est terminé"],[/./]],
 ["en",["what is a screed?"],[/Screed: A layer of mortar/]],
 ["en",["self-levelling compound before parquet"],[/First self-levelling compound, then wood flooring/]],
 ["es",["¿qué es un trasdosado?"],[/Trasdosado: Revestimiento/]],
 ["pt",["o que é um rodapé?"],[/Rodapé: Tira/]],
 ["it",["cos'è il massetto?"],[/Massetto: Strato di malta/]],
 ["ro",["ce este un buiandrug?"],[/Buiandrug: Grindă/]],
 ["pl",["co to jest wylewka samopoziomująca?"],[/Wylewka samopoziomująca: Płynna/]],
 ["tr",["alçıpan nedir?"],[/Alçıpan: İki karton/]],
 ["ru",["что такое УЗО?"],[/УЗО: Устройство/]],
 ["ar",["ما هو البرايمر؟"],[/البرايمر: مادة/]],
 ["en",["show me all the jobs next week"],[/Jobs next week.*Martin/]],
 ["en",["Martin job report"],[/Job Martin.*D2026-001/]],
 ["en",["what did I do at Martin's?"],[/Job Martin/]],
 ["es",["muéstrame las obras de la semana que viene"],[/Obras de la semana que viene/]],
 ["es",["informe de la obra Martin"],[/Obra Martin/]],
 ["it",["mostrami i cantieri della prossima settimana"],[/Cantieri della prossima settimana/]],
 ["pt",["fotos da obra Martin"],[/Obra Martin/]],
 ["ro",["arată lucrările de săptămâna viitoare"],[/Lucrările de săptămâna viitoare/]],
 ["pl",["pokaż budowy w przyszłym tygodniu"],[/Budowy w przyszłym tygodniu/]],
 ["tr",["gelecek haftanın işlerini göster"],[/Gelecek haftanın işleri/]],
 ["ru",["покажи объекты на следующей неделе"],[/Объекты на следующей неделе/]],
 ["ar",["أرني ورشات الأسبوع القادم"],[/ورشات الأسبوع القادم/]],
 ["ru",["отчёт по объекту Martin"],[/Объект Martin/]],
 ["en",["history"],[/Price|Quote|Client/]],
 ["fr",["historique des prix du carrelage"],[/./]],
 ["fr",["envoie les photos à Martin"],[/./]]
];
(async()=>{const b=await chromium.launch();let ko=0;const out=[];
 for(const [lg,phr,att] of ESSAIS){const ctx=await b.newContext({serviceWorkers:"block"}),p=await ctx.newPage();const err=[];p.on("pageerror",e=>err.push(e.message));
  await p.addInitScript(l=>{localStorage.setItem("caso_account",JSON.stringify({prenom:"Paul",email:"t@e.fr",mode:"artisan",lang:l}));localStorage.setItem("caso_lang",l);},lg);
  await p.goto(URL0);await p.waitForTimeout(1200);await p.evaluate(()=>{document.body.classList.remove("starting");tab("chat")});
  await p.waitForFunction(()=>window.casoPont&&casoPont.ready&&casoPont.question,null,{timeout:20000});await p.evaluate(s=>eval(s),DONNEES);
  for(let i=0;i<phr.length;i++){const n=await p.evaluate(()=>CHAT.m.length);await p.evaluate(t=>chatSend(t),phr[i]);await p.waitForTimeout(900);await p.waitForFunction(()=>!chatMulti.busy,null,{timeout:15000});await p.waitForTimeout(300);
   const rep=await p.evaluate(n=>CHAT.m.slice(n).filter(m=>m.who==="bot").map(m=>String(m.html||"").replace(/<[^>]+>/g," ").replace(/&#39;/g,"'").replace(/\s+/g," ")).join(" / "),n);
   const a=att[i],ok=!a||a.test(rep);if(!ok)ko++;out.push((ok?"ok   ":"RATÉ ")+"["+lg+"] "+phr[i]+"\n      réponse : "+rep.slice(0,260));}
  if(err.length){ko++;out.push("ERREUR ["+lg+"] "+phr.join(" / ")+" : "+err.join(" ; "));}
  await ctx.close();}
 await b.close();const rapport="# Fiche chantier, lexique, historique\n\n```\n"+out.join("\n")+"\n```\n\n"+(ko?ko+" essai(s) raté(s).":"Tous les essais passent.");
 console.log(rapport);if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,rapport+"\n");process.exit(ko?1:0);})();

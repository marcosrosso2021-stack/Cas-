/* casô · titres des réponses sans carte de devis (pont.js : titre), dans les 10 langues. Sans navigateur.
   Usage : node outils/chat/essai-titres.js
   Prend les phrases du moteur qui commencent par un verbe d'ouverture (« Ouvrir le devis{0} ») dans chaque catalogue,
   y met un nom de client, et vérifie le titre attendu. */
const fs=require("fs"),path=require("path"),vm=require("vm");
const src=fs.readFileSync(path.join(__dirname,"../../chat/pont.js"),"utf8");
const ctx={window:{},console,setTimeout,clearTimeout,document:{addEventListener(){},querySelector(){return null},getElementById(){return null}},addEventListener(){},localStorage:{getItem:()=>null},fetch:()=>Promise.reject(),I18N:{lang:"fr"}};ctx.window=ctx;
vm.createContext(ctx);try{vm.runInContext(src,ctx);}catch(e){if(process.env.VOIR)console.log(e)}
const P=ctx.casoPont;if(!P||!P.titre){console.log("RATÉ titre() introuvable");process.exit(1);}
const A=[
 ["fr","Ouvrir le devis de Martin","Devis de Martin"],["fr","Ouvrir le planning du jeudi 19 novembre","Planning du jeudi 19 novembre"],["fr","Ouvrir mes clients","Mes clients"],["fr","Ouvrir la liste des devis","Liste des devis"],["fr","Acompte de 30 %","Acompte de 30 %"],
 ["en","Open the quote · Martin","Quote · Martin"],["en","Open the schedule on Thursday 19 November","Schedule on Thursday 19 November"],["en","Open my clients","My clients"],["en","Open Dupont’s record","Dupont’s record"],["en","Find a free slot","Free slot"],
 ["es","Abrir el presupuesto de Martin","Presupuesto de Martin"],["es","Abrir mis clientes","Mis clientes"],["es","Abrir la agenda del jueves, 19 de noviembre","Agenda del jueves, 19 de noviembre"],
 ["pt","Abrir o orçamento de Martin","Orçamento de Martin"],["pt","Abrir os meus clientes","Meus clientes"],["pt","Abrir a agenda de quinta-feira, 19 de novembro","Agenda de quinta-feira, 19 de novembro"],
 ["it","Aprire il preventivo","Preventivo"],["it","Aprire i miei clienti","I miei clienti"],["it","Aprire l'elenco dei preventivi","Elenco dei preventivi"],["it","Aprire la mia lista della spesa","La mia lista della spesa"],["it","Aprire l'agenda di giovedì 19 novembre","Agenda di giovedì 19 novembre"],
 ["ro","Deschide devizul","Devizul"],["ro","Deschide clienții mei","Clienții mei"],["ro","Deschide agenda din joi, 19 noiembrie","Agenda din joi, 19 noiembrie"],["ro","Caută un interval liber","Interval liber"],
 ["pl","Otwarcie kosztorysu","Kosztorys"],["pl","Otwarcie listy klientów","Lista klientów"],["pl","Otwarcie kalendarza (czwartek, 19 listopada)","Kalendarz (czwartek, 19 listopada)"],["pl","Otwarcie moich usług i cen","Moje usługi i ceny"],["pl","Otwarcie pamięci","Pamięć"],["pl","Szukanie wolnego terminu","Wolny termin"],["pl","Otwarcie szablonu kosztorysu","Szablon kosztorysu"],
 ["ru","Открыть смету","Смета"],["ru","Открыть список клиентов","Список клиентов"],["ru","Открыть расписание (четверг, 19 ноября)","Расписание (четверг, 19 ноября)"],["ru","Открыть карточку клиента Dupont","Карточка клиента Dupont"],
 ["tr","Teklifi aç","Teklif"],["tr","Müşterilerimi aç","Müşterilerim"],["tr","Ajandayı aç · 19 Kasım Perşembe","Ajanda · 19 Kasım Perşembe"],["tr","Teklif listesini aç","Teklif listesi"],["tr","Hizmetlerimi ve fiyatlarımı aç","Hizmetlerim ve fiyatlarım"],["tr","Dupont kartını aç","Dupont kartı"],["tr","Boş saat ara","Boş saat"],["tr","Hafızayı aç","Hafıza"],
 ["ar","فتح عرض السعر","عرض السعر"],["ar","فتح قائمة عملائي","قائمة عملائي"],["ar","فتح الجدول يوم الخميس","الجدول يوم الخميس"]];
const R=[];A.forEach(([l,x,w])=>{ctx.I18N.lang=l;const r=P.titre(x);R.push((r===w?"ok   ":"RATÉ ")+"["+l+"] "+x+" → "+r+(r===w?"":"   (attendu : "+w+")"));});
/* toutes les phrases d'ouverture des catalogues donnent un titre non vide et plus court */
const L=["en","es","pt","it","ro","pl","tr","ru","ar"],fr=Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname,"../../chat/i18n/en.json"),"utf8"))).filter(k=>/^Ouvrir\s/.test(k)&&!/^Ouvrir (?:l’e-mail|WhatsApp)$/.test(k));
let n=0,mal=[];L.forEach(l=>{const C=JSON.parse(fs.readFileSync(path.join(__dirname,"../../chat/i18n/"+l+".json"),"utf8"));ctx.I18N.lang=l;fr.forEach(k=>{if(!C[k])return;const x=C[k].replace(/\{0\}/g,"").replace(/\{1\}/g,""),r=P.titre(x);n++;if(!r||r===x||r.length>=x.length)mal.push(l+" : "+x+" → "+r);});});
R.push((mal.length?"RATÉ ":"ok   ")+"phrases d'ouverture des catalogues raccourcies en titre : "+(n-mal.length)+"/"+n+(mal.length?"\n      "+mal.join("\n      "):""));
console.log(R.join("\n"));const f=R.filter(x=>x.startsWith("RATÉ")).length;console.log(f?f+" essai(s) raté(s).":"Tous les essais passent.");process.exit(f?1:0);

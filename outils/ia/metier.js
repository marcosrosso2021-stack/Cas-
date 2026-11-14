/* casô · questions du métier dans les 10 langues : la bonne réponse sort-elle ? (node outils/ia/metier.js)
   Chaque phrase attend une clé de réponse (metier.info) ou un calcul (metier.calcul). Imprime un score par langue. */
const fs=require("fs"),path=require("path"),R=path.join(__dirname,"..","..","chat");
require(R+"/engine.js");require(process.env.BRAIN||R+"/brain.js");
const DATA=JSON.parse(fs.readFileSync(R+"/data.json","utf8")),LANGS=["fr","en","es","pt","it","ro","pl","tr","ru","ar"];
const Q={
fr:[["quel taux de tva pour une rénovation","tva"],["tva pour une isolation","tva_energie"],["c'est quoi la garantie décennale","decennale"],["délai de rétractation","retractation"],["quel acompte maximum","acompte"],["délai de paiement entre pros","paiement"],["quelle section de câble pour 32 a","elec"],["temps de séchage d'une chape","sechage"],["combien de parpaings pour un mur de 10 m²","parpaing"],["combien de carreaux 60x60 pour 15 m²","carreaux"],["combien fait 12 m² à 45 €","montant"]],
en:[["what VAT rate for a renovation","tva"],["what is the ten-year guarantee","decennale"],["cable size for 32 a","elec"],["drying time for a screed","sechage"],["payment terms between companies","paiement"]],
es:[["qué tipo de iva para una reforma","tva"],["garantía decenal","decennale"],["plazo de desistimiento","retractation"],["tiempo de secado de una solera","sechage"]],
pt:[["qual taxa de iva para uma renovação","tva"],["garantia decenal","decennale"],["prazo de pagamento entre empresas","paiement"]],
it:[["quale aliquota iva per una ristrutturazione","tva"],["garanzia decennale","decennale"],["diritto di recesso","retractation"],["sezione del cavo per 32 a","elec"]],
ro:[["ce cotă de tva pentru o renovare","tva"],["garanția decenală","decennale"],["dreptul de retragere","retractation"]],
pl:[["jaka stawka vat na remont","tva"],["gwarancja dziesięcioletnia","decennale"],["czas schnięcia wylewki","sechage"]],
tr:[["tadilat için kdv oranı ne","tva"],["on yıllık garanti","decennale"],["cayma hakkı","retractation"]],
ru:[["какая ставка ндс на ремонт","tva"],["десятилетняя гарантия","decennale"],["сечение кабеля для 32 а","elec"]],
ar:[["ما نسبة ضريبة القيمة المضافة للترميم","tva"],["الضمان العشري","decennale"],["مهلة العدول","retractation"]]};
const res={},rat=[];
for(const l of LANGS){const E=CasoEngine.create(DATA),B=CasoBrain.create(E,JSON.parse(JSON.stringify(DATA)),null);B.handle("mode artisan");B.setLangue(l);let ok=0;
  for(const [t,k] of Q[l]){const c=B.parse(t)||[],x=c[0]||{};if(/^metier\./.test(x.m+"."+x.a)&&x.args&&x.args.k===k)ok++;else rat.push("["+l+"] "+t+" → "+JSON.stringify(c.map(y=>y.m+"."+y.a+(y.args&&y.args.k?":"+y.args.k:""))));}
  res[l]=[ok,Q[l].length];}
const ligne="Questions du métier : "+LANGS.map(l=>l+" "+res[l][0]+"/"+res[l][1]).join(", ");
console.log(ligne);if(rat.length)console.log(rat.join("\n"));process.exit(rat.length?1:0);

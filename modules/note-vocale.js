/* casô · Note vocale « casô note »
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Note vocale « casô note » ---------- */
const VN={sr:null,mode:'off',wake:false,buf:'',timer:null,last:null,lang:'fr'};
function vnNorm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’']/g,"'").replace(/œ/g,'oe').replace(/æ/g,'ae').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\s+/g,' ').trim()}
const VN_W1="(?:[kc]a(?:s|ss|z)+e?\\s*(?:o|ô|ó|au|eau|ot|os|haut|oh)|chaos|casa|caso|kazo|كا?[سز]و|كاصو|ка[зс]+[оа]|кейс[оа]|каза|казо)";
const VN_WAKE=new RegExp('(^|[^\\p{L}])'+VN_W1+"\\s*,?\\s*(?:notes?|noter|notez|notte|nota|notă|notatk[aię]|not|نوت|نوط|نوته|نوتة|нот[аеуы]?|ноут|заметк[аи])(?![\\p{L}])",'iu');
const VN_END=new RegExp('(^|[^\\p{L}])(?:'+VN_W1+"\\s*,?\\s*(?:fin|fim|fine|stop|stopp|termine|terminer|bitti|koniec|sfarsit|sfârșit|gata|end|finish|ستوب|سالينا|كمل|انتهى|стоп|конец|финиш)|fin de (?:la )?note)(?![\\p{L}])",'iu');
function vnAfter(s){const m=String(s).match(VN_WAKE);return m?String(s).slice(m.index+m[0].length):String(s)}
const VN_NUM={zero:0,un:1,une:1,deux:2,trois:3,quatre:4,cinq:5,six:6,sept:7,huit:8,neuf:9,dix:10,onze:11,douze:12,treize:13,quatorze:14,quinze:15,seize:16,vingt:20,trente:30,quarante:40,cinquante:50,soixante:60,cent:100,mille:1000,demi:.5};
function vnWords2Num(t){
 // « vingt-cinq », « deux cents », « trois et demi » -> chiffres
 return t.replace(/\b((?:(?:zero|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingts?|trente|quarante|cinquante|soixante|cents?|mille|et)(?:[\s-]+|\b))+)/g,(m)=>{
  const ws=m.trim().split(/[\s-]+/).filter(w=>w&&w!=='et');if(!ws.length)return m;
  let tot=0,cur=0;
  for(let w of ws){w=w.replace(/s$/,'');const v=VN_NUM[w];if(v==null)return m;
   if(v===100){cur=(cur||1)*100}else if(v===1000){tot+=(cur||1)*1000;cur=0}else cur+=v}
  const n=tot+cur;
  return (ws.length===1&&(ws[0]==='un'||ws[0]==='une'))?m:n+' ';
 }).replace(/(\d+)\s+et\s+demi(e)?\b/g,(m,a)=>(+a+.5)+'').replace(/\s+/g,' ');
}
const VN_UNITS=[
 [/^(?:m2|m²|metres? carres?|metre carre|mc)(?![a-z0-9])/,'m²'],
 [/^(?:ml|metres? lineaires?|metre lineaire)(?![a-z0-9])/,'ml'],
 [/^(?:m3|m³|metres? cubes?)(?![a-z0-9])/,'m³'],
 [/^(?:h|heures?)(?![a-z0-9])/,'h'],[/^(?:jours?|j)(?![a-z0-9])/,'jour'],[/^(?:forfaits?)(?![a-z0-9])/,'forfait'],
 [/^(?:kilos?|kg|kilogrammes?)(?![a-z0-9])/,'kg'],[/^(?:km|kilometres?)(?![a-z0-9])/,'km'],
 [/^(?:litres?|l)(?![a-z0-9])/,'l'],[/^(?:sacs?)(?![a-z0-9])/,'sac'],[/^(?:unites?|u|pieces?|points?)(?![a-z0-9])/,'u'],
 [/^(?:metres?|m)(?![a-z0-9])/,'ml']
];
const VN_STOP=new Set(['de','des','du','d','la','le','les','l','un','une','et','a','au','aux','en','pour','sur','dans','avec','pose','fourniture','faire','refaire','mettre','il','faut','prevoir']);
function vnTok(s){return vnNorm(s).replace(/[^a-z0-9 ]/g,' ').split(' ').filter(w=>w&&!VN_STOP.has(w)).map(w=>w.length>3?w.replace(/(s|x)$/,''):w)}
const VN_DEP=/\b(depose|deposer|demolition|demolir|arrachage|arracher|enlevement|retrait)\b/;
function vnMatch(label,prices){
 const a=vnTok(label);if(!a.length)return null;let best=null,bs=0;const dep=VN_DEP.test(vnNorm(label));
 for(const p of prices||[]){const b=vnTok(p.nom);if(!b.length)continue;if(VN_DEP.test(vnNorm(p.nom))!==dep)continue;
  let hit=0;for(const w of b)if(a.some(x=>x===w||(w.length>4&&x.startsWith(w.slice(0,5)))))hit++;
  /* « dépose placo » n'est pas « Dépose carrelage » : chacun a un mot que l'autre n'a pas */
  const proche=(x,w)=>x===w||(w.length>4&&x.startsWith(w.slice(0,5)))||(x.length>4&&w.startsWith(x.slice(0,5)));
  if(hit<b.length&&a.some(x=>x.length>=4&&!b.some(w=>proche(x,w)))&&b.some(w=>w.length>=4&&!a.some(x=>proche(x,w))))continue;
  const s=hit/b.length;if(s>bs){bs=s;best=p}}
 return bs>=.5?best:null;
}
function vnCap(s){s=s.trim();return s?s[0].toUpperCase()+s.slice(1):s}
const VN_QU=/\d+(?:[.,]\d+)?\s*(?:m2|m²|metres?|ml|m3|m³|heures?|h|jours?|kg|kilos?|sacs?|litres?|unites?|pieces?)(?![a-z0-9])/g;
function vnClauses(t){
 const out=[];
 t.split(/[.;!?\n]+|,(?!\d)|\s+(?:ensuite|puis|et puis|apres ca|et aussi|en plus|aussi)\s+|\s+(?=(?:attention|remarque|il faut|faut|penser a|prevoir de|ne pas oublier|forfait)\b)/).forEach(c=>{
  c=(c||'').trim();if(!c)return;
  /* « carrelage 14 m² et main d'oeuvre 8 h » : deux quantités, « et » sépare les deux lignes */
  VN_QU.lastIndex=0;if((c.match(VN_QU)||[]).length>=2&&/\s+et\s+/.test(c)){c.split(/\s+et\s+/).forEach(x=>{x=x.trim();if(x)out.push(...vnClauses(x))});return}
  // « 20 m² carrelage 6 heures main d'oeuvre » : coupe avant chaque nouvelle quantité
  const pos=[];let m;VN_QU.lastIndex=0;while((m=VN_QU.exec(c)))pos.push(m.index);
  let from=0;pos.slice(1).forEach(i=>{if(i>from){out.push(c.slice(from,i).trim());from=i}});out.push(c.slice(from).trim());
 });
 return out.filter(Boolean);
}
const SUP_KNOWN=['Point P','Leroy Merlin','Brico Dépôt','Castorama','Cedeo','Gedimat','Bigmat','Würth','Rexel','Tout Faire','Plateforme du Bâtiment','Foussier','Prolians','Kiloutou','Loxam','Bricomarché','Weldom','Lapeyre','Sonepar','Richardson','Dispano','Raboni','Samse','Chausson'];
function supNames(){const o=new Map();[...SUP_KNOWN,...((typeof db!=='undefined'&&db.suppliers)||[]).map(x=>x.nom),...((typeof db!=='undefined'&&db.prices)||[]).map(x=>x.four)].forEach(n=>{if(n&&n.trim())o.set(vnNorm(n),n.trim())});return o}
function findSuppliers(t){
 const out=[],M=supNames();
 for(const [k,v] of M){if(k.length>2&&new RegExp('(^|[^\\p{L}])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}])','u').test(t))out.push(v)}
 const m=t.match(/\bfournisseur\s*(?:c'est|est|:)?\s*(\p{L}[\p{L}'-]+(?:\s+(?!(?:et|pour|a|au|il|le|la|les|de|du)(?![\p{L}]))\p{L}[\p{L}'-]+)?)/u);
 if(m){const n=m[1].replace(/\s+/g,' ').trim();if(!out.some(x=>vnNorm(x)===vnNorm(n)))out.push(n.split(' ').map(vnCap).join(' '))}
 return out}
function parseNote(raw,prices,lang){
 const R={client:'',tel:'',adr:'',objet:'',travaux:[],remarques:[],remOk:[],todo:[],texte:String(raw||'').trim(),lang:lang||VN.lang||'fr',miss:[]};
 raw=vnAfter(String(raw||'')).replace(VN_END,'$1 ');
 const det=vlDetect(raw);if(det&&(!lang||det.l===lang||det.score>=3))R.lang=det.l;
 if(R.lang!=='fr'){const tr=vlTranslate(raw,R.lang);raw=tr.t;R.miss=tr.miss;R.segs=tr.segs}
 {const em=String(raw||'').match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/);if(em){R.email=em[0].toLowerCase();raw=String(raw).replace(em[0],' ').replace(/\b(?:e-?mail|courriel|mail)\s*:?\s*(?=\s|$)/i,' ')}}
 const ORIG=String(raw||'').normalize('NFC').replace(/[’']/g,"'").replace(/\s+/g,' ').trim(),NO=ORIG.split('').map(ch=>{const n=vnNorm(ch);return n.length?n[0]:(/\s/.test(ch)?' ':ch.toLowerCase())}).join('');
 const O=s=>{s=String(s||'').trim();const i=s?NO.indexOf(s.toLowerCase()):-1;return vnCap(i>=0&&NO.length===ORIG.length?ORIG.slice(i,i+s.length):s)};
 let t=vnNorm(raw);
 R.suppliers=findSuppliers(t);
 // téléphone
 const tm=t.match(/(?:\+33\s?|0)\s?[1-9](?:[\s.-]?\d{2}){4}/);
 if(tm){let d=tm[0].replace(/\D/g,'');if(d.startsWith('33'))d='0'+d.slice(2);R.tel=d.replace(/(\d{2})(?=\d)/g,'$1 ');t=t.replace(tm[0],' ')}
 t=vnWords2Num(t);
 // mesures : largeur × hauteur (ou longueur) = surface
 {const re=/(\d+(?:[.,]\d+)?)\s*(?:metres?|m)?\s*(?:de\s+|d')?(largeur|hauteur|longueur)|(largeur|hauteur|longueur)\s*(?:de\s+|:\s*)?(\d+(?:[.,]\d+)?)\s*(?:metres?|m(?![a-z]))?/g;
  const D=[];let m;while((m=re.exec(t)))D.push({k:m[2]||m[3],v:parseFloat((m[1]||m[4]).replace(',','.')),s:m[0]});
  const w=D.find(x=>x.k==='largeur'),h=D.find(x=>x.k!=='largeur');
  if(w&&h){const a=Math.round(w.v*h.v*100)/100;R.dims={a:w.v,b:h.v,kb:h.k,area:a};
   t=t.replace(w.s,' '+a+' m2 ').replace(h.s,' ').replace(new RegExp(String(a).replace('.','\\.')+' m2\\s+(?:et\\s+)?(?:de\\s+|d\'|du\\s+|des\\s+)?'),a+' m2 de ');
   D.filter(x=>x!==w&&x!==h).forEach(x=>{t=t.replace(x.s,' ')})}
  else if(D.length){R.dim1=D.map(x=>({k:x.k,v:x.v}));D.forEach(x=>{t=t.replace(x.s,' ')})}}
 // client
 const cm=t.match(/\b(?:(?:(?:nouveau|nouvelle|nouv|un|une|mon|ma)\s+)?client(?:e)?|chez|pour)\s*(?:c'est|est|:)?\s*((?:monsieur|madame|mme|m\.|mr|mademoiselle)\s+)?(\p{L}[\p{L}'-]+(?:\s+(?!(?:et|au|a|rue|qui|il|pour|avec|le|la|de|du|tel|telephone|numero|chantier|adresse|portable|monsieur|madame|ensuite|refaire|renover)(?![\p{L}]))\p{L}[\p{L}'-]+)?)/u);
 if(cm&&!/^(le|la|les|un|une|des|faire|refaire|la salle|l|salle|cuisine)(\s|$)/.test(cm[2])){
  const civ=cm[1]?({monsieur:'M.',mr:'M.','m.':'M.',madame:'Mme',mme:'Mme',mademoiselle:'Mlle'}[cm[1].trim()]||''):'';
  let nm=cm[2],cut=cm[0];const ws=nm.split(' ');
  if(ws.length===2&&((db.clients||[]).some(c=>vnNorm(c.nom).replace(/^(m|mme|mlle)\.?\s+/,'')===vnNorm(ws[0]))||chatKnown().has(vnNorm(ws[1]))||vnMatch(ws[1],prices))){nm=ws[0];cut=cm[0].slice(0,cm[0].lastIndexOf(ws[1])).trimEnd()}
  const cn=vnNorm(nm);
  if(!R.suppliers.some(x=>{const k=vnNorm(x);return cn.startsWith(k)||k.startsWith(cn)})){R.client=(civ?civ+' ':'')+nm.split(' ').map(w=>O(w)).join(' ');t=t.replace(cut,' ')}
 }
 // client nommé avec civilité, sans le mot « client »
 if(!R.client){const cv=t.match(/(?:^|[^\p{L}])(monsieur|madame|mme|mr|mlle|mademoiselle|m\.)\s+(\p{L}[\p{L}'-]{1,})/u);
  if(cv&&!/^(le|la|les|de|du|des|et)$/.test(cv[2])){const cn=vnNorm(cv[2]);
   if(!R.suppliers.some(x=>vnNorm(x).startsWith(cn))){const civ={monsieur:'M.',mr:'M.','m.':'M.',madame:'Mme',mme:'Mme',mademoiselle:'Mlle',mlle:'Mlle'}[cv[1]]||'';R.client=civ+' '+O(cv[2]);t=t.replace(cv[0],' ')}}}
 // adresse
 const am=t.match(/\b(\d+\s*(?:bis|ter)?\s*,?\s*(?:rue|avenue|av|boulevard|bd|chemin|impasse|place|allee|route|traverse|cours|quai|montee|lotissement|residence)\s+[\p{L}' -]+?)(?=\s+a\s|\s*(?:,|\.|$|\bpour\b|\bclient|\btel|\bil faut|\bensuite|\b\d))(?:(?:\s+a\s+|\s*,(?!\s*(?:refaire|renover|poser|faire|creer|installer|remplacer|changer|reprendre|il|prevoir|penser|attention|remarque|client|tel|telephone)\b)\s*)([\p{L}' -]{2,30}?)(?=\s*(?:,|\.|$|\bpour\b|\bclient|\bensuite|\bpuis|\b\d)))?/u);
 if(am){R.adr=O(am[1].replace(/\s+/g,' ').replace(/\s*,\s*/,' '))+(am[2]&&!/^(faire|refaire|prevoir)/.test(am[2].trim())?', '+am[2].trim().split(' ').map(w=>vnCap(O(w))).join(' '):'');t=t.replace(am[0],' ')}
 else{const am2=t.match(/\b((?:rue|avenue|boulevard|place|chemin|impasse|allee|route|traverse|cours|quai)\s+[\p{L}' -]+?)\s*,?\s*(?:numero\s*)?(\d+(?:\s*(?:bis|ter))?)(?![\d.,]*\s*(?:m2|m²|metre|ml|m3|heure|h(?![\p{L}])|jour|kg|sac))(?:(?:\s+a\s+|\s*,\s*)(\p{L}[\p{L}' -]{1,28}?)(?=\s*(?:,|\.|$|\bpour\b|\bclient|\bensuite|\bpuis|\b\d)))?/u);
  if(am2){const st=O(am2[1].trim());R.adr=am2[2]+' '+st[0].toLowerCase()+st.slice(1)+(am2[3]&&!/^(faire|refaire|prevoir|il)/.test(am2[3].trim())?', '+am2[3].trim().split(' ').map(w=>vnCap(O(w))).join(' '):'');t=t.replace(am2[0],' ')}
  else{const cm2=t.match(/\b(?:chantier|adresse)\s*(?:est|:)?\s*(?:au|a|a la|en)?\s*([a-z0-9' -]{3,40}?)(?=\s*(?:,|\.|$|\bpour\b|\bclient))/);if(cm2){R.adr=O(cm2[1]);t=t.replace(cm2[0],' ')}}}
 // code postal + ville : « 69003 Lyon », « 13100 Aix-en-Provence »
 {const cp=t.match(/(?:^|[\s,])((?:0[1-9]|[1-8]\d|9[0-8])\d{3})\s+(?!(?:euros?|eur|e|m2|m|ml|m3|h|heures?|jours?|u|pieces?|unites?)(?![\p{L}]))(\p{L}[\p{L}'-]*(?:\s+cedex)?)(?=\s*(?:,|\.|$|\s))/u);
  if(cp&&(R.adr||((R.client||R.tel||R.email)&&!chatKnown().has(vnNorm(cp[2].split('-')[0]))))){
   const city=O(cp[2]).split(/([- ])/).map(w=>/^(en|sur|sous|les|le|la|de|du|des|aux|et|l|d|cedex)$/i.test(w)?w.toLowerCase():vnCap(w)).join('').replace(/\bcedex\b/,'Cedex');
   const base=R.adr?R.adr.replace(new RegExp(',\\s*'+city.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$','i'),''):'';
   R.adr=(base?base+', ':'')+cp[1]+' '+city;t=t.replace(cp[0],' ')}}
 // ville seule : « à Lyon », « à Saint-Étienne 42000 » (mot en majuscule, pas un mot du métier ni un client connu)
 if(!R.adr){const vm=ORIG.match(/(?:^|[\s,])(?:à|a|au|sur)\s+(\p{Lu}[\p{L}'’]+(?:-\p{L}[\p{L}'’]+)*)(?:\s+((?:0[1-9]|[1-8]\d|9[0-8])\d{3}))?(?=\s*(?:,|\.|$|\s))/u);
  if(vm){const w=vnNorm(vm[1]),k=vnNorm(vm[0]).trim();
   if(!/^(noel|paques|toussaint|midi|minuit|demain|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)$/.test(w)&&(vm[2]||(R.client&&!chatKnown().has(w.split('-')[0])&&!(db.clients||[]).some(c=>vnNorm(c.nom).split(' ').includes(w))))&&t.includes(k)){R.adr=(vm[2]?vm[2]+' ':'')+vm[1];t=t.replace(k,' ')}}}
 for(let c of vnClauses(t)){
  c=c.replace(/^(?:et|alors|donc|bon|euh)\s+/,'').trim();if(c.length<3)continue;
  if(/^(?:nouveau|nouvelle|nouv|un|une|mon|ma)$/.test(c))continue;
  if(/^(?:e-?mail|mail|courriel|tel|portable|mobile|adresse)$/.test(c))continue;
  if(/^(?:au|a|chez|pour|tel|telephone|numero)$/.test(c))continue;
  if(/^(?:le |du |au |chez (?:le )?)?fournisseur\b/.test(c)&&!/\d/.test(c))continue;
  if(!R.objet&&!/\d/.test(c)&&/^(?:refaire|renover|poser|creer|installer|remplacer|changer|faire|reprendre|amenager|construire|monter|isoler|repeindre|abattre|demolir)\b/.test(c)){R.objet=O(c);continue}
  if(/^(?:client|chez|telephone|tel|adresse|chantier)\b/.test(c)&&!/\d+\s*(?:m2|m²|metre|ml|m3|heure|h\b|jour|forfait)/.test(c))continue;
  if(/\b(?:il faut|faut|a faire|penser a|rappeler|acheter|commander|envoyer|passer|appeler|demander|recontacter|ne pas oublier|n'oublie pas|a prevoir)\b/.test(c)&&!/\d+\s*(?:m2|m²|metre|ml|m3)/.test(c)){R.todo.push(O(c.replace(/^(?:il )?faut\s+/,'')));continue}
  if(/\b(?:attention|remarque|note|probleme|humidite|fissure|acces|parking|etage|ascenseur|amiante|plomb|delai|urgent|disponible|libre|cle|cles)\b/.test(c)&&!/^\d/.test(c)&&!/\d+\s*(?:m2|m²|ml|m3|h\b|heure)/.test(c)){const v=O(c.replace(/^(?:remarque|note)\s*:?\s*/,""));R.remarques.push(v);if(!/^(?:ajoute|rajoute|mets|met|enleve|retire|supprime|fais|envoie|appelle|tourne|deplace|peins)\b/.test(c))R.remOk.push(v);continue}
  // travaux : « 20 m² de carrelage » ou « carrelage 20 m² » ou « forfait évacuation »
  let qty=null,unit='',label='',puDit=null;
  /* prix dit dans la phrase : « 20 m² de carrelage à 40 € », « carrelage 20 m² 40 € le m² » */
  {const pm=c.match(/\s*(?:\b(?:a|à|au prix de|pour|prix)\s+)?(\d+(?:[.,]\d+)?)\s*(?:€|euros?\b|eur\b)(?:\s*(?:ht|ttc)\b)?(?:\s*(?:le|la|l'|par|\/)\s*(?:m2|m²|ml|m|h|heure|jour|u|unite|piece|sac|forfait)\b)?/);
   if(pm&&/\d/.test(c.replace(pm[0],' '))){puDit=parseFloat(pm[1].replace(',','.'));c=(c.slice(0,pm.index)+' '+c.slice(pm.index+pm[0].length)).replace(/\s+/g,' ').trim()}}
  let m=c.match(/(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if(m){qty=parseFloat(m[1].replace(',','.'));let rest=m[2];
   for(const [re,u] of VN_UNITS){const um=rest.match(re);if(um){unit=u;rest=rest.slice(um[0].length);break}}
   rest=rest.replace(/^\s*(?:de|d'|du|des)\s*/,'').trim();
   const before=c.slice(0,m.index).replace(/\b(?:il y a|y a|environ|a peu pres|pour|sur|de|du|en tout|total|faire|refaire|poser|pose de|pose)\b/g,' ').trim().replace(/\s+(?:a|à|au|de|du|des|d')$/,'').trim();
   label=rest.length>=3?rest:before;
   if(!label||label.length<3){R.remarques.push(O(c.replace(/^(?:remarque|note)\s*:?\s*/,"")));continue}
  }else if(/\bforfait\b/.test(c)){qty=1;unit='forfait';label=c.replace(/\b(?:un|le)?\s*forfait\s*(?:de\s|d'|pour\s)?\s*/,'').trim()||c}
  else{const p=vnMatch(c,prices);if(p){qty=null;label=c}else{R.remarques.push(O(c.replace(/^(?:remarque|note)\s*:?\s*/,"")));continue}}
  label=label.replace(/\b(?:s'il te plait|voila|c'est tout)\b/g,'').replace(/\s+/g,' ').trim();
  const p=vnMatch(label,prices);
  const un0=unit||(p?p.unit:'u'),qInc=qty==null&&!/^(u|unite|piece|forfait|ens|lot)?$/.test(vnNorm(un0||''));
  /* quantité non dite : rien n'est inventé pour une surface ou une longueur (« du carrelage ») ; « une douche » compte pour 1 */
  const ln={label:p?p.nom:O(label),qty:qInc?null:(qty||1),unit:un0,pu:p?p.prix:0,tva:p?p.tva:20,ok:!!p};if(qInc)ln.warn='Quantité à préciser';
  if(p&&unit&&p.unit&&vnNorm(p.unit)!==vnNorm(unit)&&!(unit==='ml'&&vnNorm(p.unit)==='m')){
   if(unit==='jour'&&p.unit==='h'){ln.warn=fmtN(ln.qty)+' jour(s) comptés '+fmtN(ln.qty*8)+' h (8 h par jour)';ln.qty*=8;ln.unit='h'}
   else if(unit==='h'&&p.unit==='jour'){ln.warn=fmtN(ln.qty)+' h comptées '+fmtN(ln.qty/8)+' jour(s)';ln.qty=Math.round(ln.qty/8*100)/100;ln.unit='jour'}
   else{ln.warn='Dit en '+unit+', ton prix est en '+p.unit+' : vérifie';ln.pu=0;ln.ok=false;ln.label=p.nom}
  }
  if(!p&&R.miss.length){const nl=vnNorm(label);if(R.miss.some(w=>nl.includes(vnNorm(w))))ln.warn='Mot(s) à traduire en français';}
  if(puDit!=null&&puDit>0){ln.pu=puDit;ln.ok=true;if(ln.warn&&/^Dit en/.test(ln.warn))ln.warn='';}
  if(ln.label&&ln.label===ln.label.toUpperCase()&&/\p{L}{2}/u.test(ln.label))ln.label=ln.label.charAt(0)+ln.label.slice(1).toLowerCase();
  R.travaux.push(ln);
 }
 if(R.segs&&R.segs.length){const back=a=>{const out=[];a.forEach(x=>{const n=vnNorm(x).replace(/^(?:il faut|remarque)\s*/,'');const sg=R.segs.find(g=>g.t.includes(n.slice(0,Math.min(n.length,24))));const v=sg?sg.o:x;if(!out.includes(v))out.push(v)});return out};
  R.remarques=back(R.remarques);R.remOk=back(R.remOk);R.todo=back(R.todo)}
 return R;
}
function vnReportHtml(R){
 const li=a=>a.map(x=>`<li dir="auto">${esc(x)}</li>`).join('');
 let h='';
 const hd=R.lang&&R.lang!=='fr'?`<p class="vn-lg"><span dir="auto">${esc(vlT(10,R.lang))}</span><br><span dir="ltr"><bdi>${esc(VL_DEF[R.lang].n)}</bdi> <svg class="i i-sm i-flip"><use href="#i-arrow"/></svg> Français</span></p>`:'';
 const info=[['Client',R.client],['Téléphone',R.tel],['E-mail',R.email],['Chantier',R.adr]].filter(x=>x[1]);
 if(R.objet)info.push(['Travaux',R.objet]);
 if(info.length)h+=`<div class="vn-sec"><h3>Chantier</h3>${info.map(x=>`<div class="tot"><span>${x[0]}</span><b>${esc(x[1])}</b></div>`).join('')}</div>`;
 if(R.travaux.length){
  let ht=0;
  h+=`<div class="vn-sec"><h3>Travaux</h3>`+R.travaux.map(l=>{const tt=l.qty*l.pu;ht+=tt;
   return `<div class="vn-l"><div><b>${esc(l.label)}</b><span class="mut"> ${l.qty==null?'':fmtN(l.qty)+' '}${esc(l.unit)}${l.pu?' × '+eur(l.pu):''}</span>${l.ok||l.warn?'':'<div class="vn-w">Pas dans tes prix : prix à remplir</div>'}${l.warn?'<div class="vn-w">'+esc(l.warn)+'</div>':''}</div><b>${l.pu&&l.qty!=null?eur(tt):'–'}</b></div>`}).join('')
   +`<div class="tot"><span>Estimation HT</span><b>${eur(ht)}</b></div></div>`;
 }
 if(R.remarques.length)h+=`<div class="vn-sec"><h3>Remarques</h3><ul>${li(R.remarques)}</ul></div>`;
 if(R.todo.length)h+=`<div class="vn-sec"><h3>À faire</h3><ul class="vn-todo">${li(R.todo)}</ul></div>`;
 if(h)return hd+h;
 if(!h)h='<p class="mut">Rien de reconnu. Dis par exemple : « client Martin, 12 rue de la Paix à Marseille, 20 mètres carrés de carrelage, 6 heures de main d\'œuvre ».</p>';
 return h;
}
function fmtN(n){return String(Math.round(n*100)/100).replace('.',',')}
function vnState(mode,msg){
 VN.mode=mode;const b=$('vnRec');if(!b)return;
 const cp=$('composer');if(cp){cp.classList.toggle('rec',mode==='note');cp.classList.toggle('wake',mode!=='note'&&!!VN.wake)}
 clearInterval(VN.tick);if(mode==='note'){const t0=Date.now(),tm=$('vnTime');const f=()=>{const s=Math.floor((Date.now()-t0)/1000);if(tm)tm.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};f();VN.tick=setInterval(f,500)}
 b.classList.toggle('rec',mode==='note');b.setAttribute('aria-pressed',mode==='note');
 $('vnRecT').textContent=vlT(mode==='note'?1:0,'fr');
 $('vnSt').textContent=msg!=null?msg:(mode==='note'?vlT(3,'fr'):VN.wake?vlT(4,'fr'):'');
}
function vnSupported(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition)}
function vnStart(){
 const S=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!S){vnState('off',vlT(9,'fr'));$('chatIn').focus();return}
 try{VN.sr&&VN.sr.abort()}catch(e){}
 const r=new S();VN.sr=r;r.lang=VN.recLang||vlRec(VN.lang);r.continuous=true;r.interimResults=true;r.maxAlternatives=1;
 r.onresult=e=>{
  let fin='',tmp='';
  for(let i=e.resultIndex;i<e.results.length;i++){const s=e.results[i][0].transcript;if(e.results[i].isFinal)fin+=s+' ';else tmp+=s}
  const all=vnNorm(fin+' '+tmp);
  if(VN.mode!=='note'){
   if(VN_WAKE.test(all)){VN.buf='';vnState('note');if(navigator.vibrate)navigator.vibrate(60);if(fin)VN.buf=vnAfter(fin)+' ';vnShow(VN.buf);vnIdle()}
   return;
  }
  if(fin)VN.buf+=fin;vnShow(VN.buf+tmp);vnIdle();
  if(VN_END.test(vnNorm(VN.buf+' '+tmp)))vnStop();
 };
 r.onerror=e=>{if(e.error==='not-allowed'||e.error==='service-not-allowed'){VN.wake=false;$('vnWake').checked=false;vnState('off','Micro refusé. Autorise le micro pour ce site dans les réglages, ou utilise le micro du clavier.')}else if(e.error==='language-not-supported'&&VN.lang==='ar'&&VN.recLang!=='ar-SA'){VN.recLang='ar-SA';setTimeout(vnStart,100)}else if(e.error==='language-not-supported'){vnState('off',vlT(9));$('vnMore').open=true}else if(e.error==='network'){vnState('off','Pas de réseau : la dictée a besoin d\'internet. Utilise le micro du clavier.')}};
 r.onend=()=>{if(VN.sr!==r)return;if(VN.mode==='note'){vnStop();return}if(VN.wake){setTimeout(()=>{if(VN.wake&&VN.sr===r)try{r.start()}catch(e){vnStart()}},300)}};
 try{r.start()}catch(e){}
}
function vnIdle(){clearTimeout(VN.timer);VN.timer=setTimeout(()=>{if(VN.mode==='note')vnStop()},9000)}
function vnShow(s){const v=String(s).replace(VN_END,'$1').replace(/\s+/g,' ').trim();$('vnTxt').value=v;const c=$('chatIn');if(c){c.value=v;chatGrow(c)}}
function vnRec(){
 if(VN.mode==='note'){vnStop();return}
 VN.buf='';$('vnTxt').value='';vnState('note');
 if(!VN.sr||!VN.wake)vnStart();vnIdle();
}
function vnCancel(){VN.buf='';const t=$('vnTxt');if(t)t.value='';const c=$('chatIn');if(c){c.value='';chatGrow(c);qkUpdate()}vnStop()}
function vnStop(){
 clearTimeout(VN.timer);
 const was=VN.mode==='note';
 vnState(VN.wake?'wake':'off');
 if(!VN.wake){try{VN.sr&&VN.sr.stop()}catch(e){}}
 if(was&&$('vnTxt').value.trim())vnMake();
}
function vnWakeToggle(on){
 VN.wake=on;
 if(on){vnStart();vnState('wake')}else{try{VN.sr&&VN.sr.abort()}catch(e){}VN.sr=null;vnState('off')}
}
function vnMake(){
 const txt=($('vnTxt').value||$('chatIn').value).trim();$('vnTxt').value='';if(!txt){$('chatIn').focus();return}
 /* dictée : les nombres dits en lettres deviennent des chiffres (« quarante-cinq virgule cinquante » -> 45,50), puis comme une phrase tapée */
 if($('chatLog')){let t2=txt;try{if(window.casoPont&&casoPont.ready&&casoPont.B.dicte&&(VN.lang||'fr')==='fr')t2=casoPont.B.dicte(txt)}catch(e){}chatSend(t2);return}
 const R=parseNote(txt,db.prices,VN.lang);VN.last=R;
 const det=vlDetect(vnAfter(txt));
 if(det&&det.l!==VN.lang&&det.score>=3){vnSetLang(det.l);toast(vlT(12).replace('{l}',VL_DEF[det.l].n))}
 if(!db.notes)db.notes=[];
 db.notes.unshift({id:uid(),date:new Date().toISOString(),texte:txt});db.notes=db.notes.slice(0,30);Store.persist(db);
 $('vnRep').innerHTML=vnReportHtml(R);$('vnOut').hidden=false;
 $('vnOut').scrollIntoView({behavior:'smooth',block:'start'});
}
function vnApply(){
 const R=VN.last;if(!R)return;
 if(R.client&&!$('cNom').value)$('cNom').value=R.client;
 if(R.tel&&!$('cTel').value)$('cTel').value=R.tel;
 if(R.adr&&!$('cAdr').value)$('cAdr').value=R.adr;
 q.lines=q.lines.filter(l=>l.label||l.pu);
 R.travaux.forEach(l=>q.lines.push({label:l.label,qty:l.qty,unit:l.unit,pu:l.pu,tva:l.tva}));
 renderLines();calc();
 $('vnOut').hidden=true;$('vnTxt').value='';
 $('lines').scrollIntoView({behavior:'smooth',block:'center'});
 toast(R.travaux.length?vlT(11).replace('{n}',R.travaux.length):i18nT('Client rempli.'));
}
function vnCopy(){const R=VN.last;if(!R)return;
 const t=['Note casô '+dFR(),R.client&&'Client : '+R.client,R.tel&&'Tél : '+R.tel,R.adr&&'Chantier : '+R.adr,
 R.travaux.length&&'Travaux :\n'+R.travaux.map(l=>'- '+l.label+' : '+(l.qty==null?'? ':fmtN(l.qty)+' ')+l.unit).join('\n'),
 R.remarques.length&&'Remarques :\n'+R.remarques.map(x=>'- '+x).join('\n'),R.todo.length&&'À faire :\n'+R.todo.map(x=>'- '+x).join('\n')].filter(Boolean).join('\n');
 (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Rapport copié.'),()=>{$('vnTxt').value=t;$('vnTxt').select()})}
function toast(m){let t=$('toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2600)}

function vnSetLang(l){
 if(!VL_DEF[l])return;VN.lang=l;VN.recLang=null;vlSet(l);i18nApply(l);vnUI();
 try{renderQuick();renderPrices();renderLines();pNomSync()}catch(e){}
 if(VN.wake||VN.mode==='note'){const w=VN.wake;try{VN.sr&&VN.sr.abort()}catch(e){}VN.sr=null;if(w||VN.mode==='note')vnStart()}
}
function vnUI(){
 const l=VN.lang,d=VL_DEF[l];
 const set=(id,i)=>{const e=$(id);if(e){e.textContent=vlT(i,'fr');e.dir='auto'}};
 set('vnWakeT',2);set('vnMoreT',5);set('vnMakeB',6);set('vnFillB',7);set('vnCopyB',8);
 $('vnTxt').placeholder=vlT(13);{const ci=$('chatIn');if(ci)ci.placeholder=i18nT('Écris ici : client, travaux, quantités…')}$('vnTxt').dir='auto';
 document.querySelectorAll('.lang-sel').forEach(s=>s.value=l);
 vnState(VN.mode);
}
function vnInit(){
 vlBuild();VN.lang=vlGet();
 const opts=Object.keys(VL_DEF).map(k=>`<option value="${k}" lang="${k}">${VL_DEF[k].n}</option>`).join('');
 document.querySelectorAll('.lang-sel').forEach(s=>{s.innerHTML=opts;s.setAttribute('data-noi18n','')});
 if(!vnSupported())$('vnWakeL').hidden=true;
 i18nStart(VN.lang);vnUI();
 try{renderQuick();renderPrices();renderLines();pNomSync()}catch(e){}
}

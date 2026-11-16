/* Notation de la campagne ŒIL 3D à partir des journaux réels (run/<id>.json).
   Neuf critères (15/10/10/15/15/15/10/5/5). Un critère non applicable est N/A et sort du total :
   score = points obtenus / points applicables × 100. Statut : réussi ≥ 70, partiel 40–69, échec < 40.
   node evaluate.js [dossier] → rapport.json */
const fs=require('fs'),path=require('path');
const DIR=path.join(__dirname,process.argv[2]||'run');
const NONE=/c'est un client ou un fournisseur|Dans quelle pièce \? \(\)|^Voilà\.?$|pas compris|ne connais pas encore|dire autrement|n.ai pas bien compris|n’ai pas compris|chat_oops|Oups/i;
// inventaire de référence de la chambre filmée (relevé à la main sur les images de la vidéo)
const GT=[['lit',/\blit\b|lits/i],['rideau',/rideau/i],['fenêtre',/fen[eê]tre/i],['plafonnier',/lumi[eè]re|plafonnier|luminaire|r[ée]glette/i],['poteau',/poteau|pilier/i],
 ['porte-manteau',/porte.?manteau|patère/i],['poubelle',/poubelle/i],['réfrigérateur',/r[ée]frig|frigo/i],['micro-ondes',/micro|four/i],['radiateur',/radiateur|convecteur/i],
 ['table',/table|bureau/i],['chaise',/chaise/i],['carton',/carton/i],['ventilateur',/ventilateur/i],['prise',/prise/i],['panneau mural',/miroir|tableau|[ée]cran|t[ée]l[ée]/i]];
const GT_PLAN={W:10,D:8,rooms:[27,21,14,18]};
const ELEC_NEED=['plafonnier','prise'];
const num=s=>(s.match(/\d+(?:[,.]\d+)?/g)||[]).length;
function chk(R){const sc=R.scenario,A=R.avant||{},B=(R.m3d&&R.m3d.apres)||{},rep=[...((R.main&&R.main.reponses)||[]),...((R.m3d&&R.m3d.reponses)||[])].filter(x=>x&&x!==sc.texte),txt=rep.join(' / ');
  const changed=k=>A[k]!==undefined&&JSON.stringify(A[k])!==JSON.stringify(B[k]);
  const eqA=(A.eqs||[]),eqB=(B.eqs||[]);const added=eqB.length-eqA.length;
  const typeAdded=re=>eqB.filter(e=>re.test(e.t+' '+e.lab)).length>eqA.filter(e=>re.test(e.t+' '+e.lab)).length;
  const moved=eqB.some((e,i)=>eqA[i]&&(e.x!==eqA[i].x||e.y!==eqA[i].y));
  const finishChg=changed('finish')||changed('wallDef')||changed('floorDef')||(A.rnv!==B.rnv&&changed('rnv'));
  const asks=/film|vid[ée]o|photo|plan|envoie|ajoute.*(photo|vid)|prends/i.test(txt);
  const model=(B.walls||0)>=3;const g=sc.but;let ok=0,note='';
  const T=(c,n)=>{ok=c;note=n};
  switch(g.split(':')[0]){
    case 'finish+keepbed':T(finishChg&&eqB.some(e=>/bed|lit/i.test(e.t+e.lab))?1:finishChg?0.5:0,finishChg?'finitions changées':'rien de changé');break;
    case 'add':{const want=g.split(':')[1].split(','),re={sofa:/sofa|canap/i,tv:/tv|t[ée]l[ée]/i,island:/[iî]lot|island/i,shower:/douche|shower/i,wardrobe:/dressing|armoire|wardrobe|placard/i,bed2:/bed|lit/i,desk2:/desk|bureau/i};
      const got=want.filter(w=>w.endsWith('2')?eqB.filter(e=>re[w].test(e.t+' '+e.lab)).length-eqA.filter(e=>re[w].test(e.t+' '+e.lab)).length>=1:typeAdded(re[w]));T(got.length/want.length,got.length?'ajouté : '+got.join(', '):'aucun élément ajouté');break}
    case 'layout':T(added>0||moved?1:/rangement|place|lit|armoire/i.test(txt)&&!NONE.test(txt)?0.5:0,added>0||moved?'aménagement modifié':'pas de proposition');break;
    case 'rearrange':T(moved&&added===0?1:0,moved?'meubles déplacés':'aucun meuble déplacé');break;
    case 'floor_only':{const f=finishChg,others=added!==0||moved||changed('wallDef');T(f&&!others?1:f?0.5:0,f?(others?'sol changé mais autre chose aussi':'seul le sol a changé'):'sol inchangé');break}
    case 'variants3':case 'variants5':{const n=g==='variants5'?5:3;const opts=(txt.match(/blanc|beige|gris|bois|brique|pierre|b[ée]ton|papier|enduit|variante|proposition/gi)||[]).length;T(opts>=n?1:opts>0||finishChg?0.4:0,opts+' option(s) dans la réponse'+(finishChg?', une finition appliquée':''));break}
    case 'reco':case 'reco_nodup':case 'full':{T(model&&finishChg&&sc.but==='reco'?0.5:model&&!NONE.test(txt)?1:model?0.6:0,model?'maquette créée ('+B.walls+' murs, '+eqB.filter(e=>e.vid).length+' éléments captés)':'pas de maquette');break}
    case 'extension':T(changed('walls')||changed('lvl')?1:/extension/i.test(txt)&&!NONE.test(txt)?0.4:0,changed('walls')?'murs ajoutés':'pas d\'extension');break;
    case 'ext':T(changed('ext')&&model?1:0,changed('ext')?'extérieur modifié':'extérieur inchangé');break;
    case 'roof':T(changed('roof')&&model?1:0,changed('roof')&&!model?'« C\'est fait » annoncé alors qu\'aucune maison n\'existe (0 mur)':changed('roof')?'toiture modifiée':'toiture inchangée');break;
    case 'defects':{const said=!NONE.test(txt)&&/fissure|humidit|d[ée]faut|d[ée]grad|tache|cass|fuite|aucun|rien de visible/i.test(txt);T(said?0.5:0,said?'répond (aucun défaut) sans localisation, preuve ni confiance ; la pièce filmée n\'a pas de défaut de référence : détection non vérifiable':'pas de diagnostic');break}
    case 'compare':T(!NONE.test(txt)&&/compar|deux|avant|apr[eè]s/i.test(txt)?0.5:0,'comparaison impossible sans les deux jeux de données');break;
    case 'surface':case 'wall_dims':{const need={22:/mur/i,29:/fa[çc]ade/i,30:/mur|plafond/i,64:/m³|m3|volume/i}[sc.id];if(need&&!need.test(txt.replace(sc.texte,''))){T(0,'valeur donnée, mais pas la surface demandée : '+txt.slice(0,60));break}const v=[...txt.matchAll(/(\d+(?:[,.]\d+)?)\s?(m²|m2|m\b)/g)].map(x=>parseFloat(x[1].replace(',','.'))).filter(x=>x>0);T(!NONE.test(txt)&&v.length?1:0,v.length?'valeurs : '+v.join(', '):'aucune valeur non nulle');break}
    case 'partition':T(changed('walls')||typeAdded(/cloison/i)?1:!NONE.test(txt)&&/cloison|plaque/i.test(txt)?0.5:0,changed('walls')?'cloison ajoutée':'pas de cloison');break;
    case 'inventory':case 'inventory_elec':T(!NONE.test(txt)&&(txt.match(/,/g)||[]).length>=2?1:!NONE.test(txt)&&txt.length>40?0.4:0,'réponse : '+txt.slice(0,80));break;
    case 'door':T(changed('ops')?1:0,changed('ops')?'ouvertures modifiées':'ouvertures inchangées');break;
    case 'count':T(!NONE.test(txt)&&/palette|parpaing/i.test(txt)&&!/^Tu veux/.test(txt)?1:0,'réponse : '+txt.slice(0,80));break;
    case 'add_window':{const w=(B.ops||[]).filter(o=>o==='window').length-(A.ops||[]).filter(o=>o==='window').length;T(w>0?1:0,w>0?'fenêtre ajoutée':'pas de fenêtre ajoutée');break}
    case 'empty':{/* grille 2 : le bâti (poteau) reste quand on demande de garder la structure */const v=eqB.filter(e=>!/^F01\.|poteau|pilier/i.test((e.cls||'')+' '+(e.lab||''))).length;T(v===0&&model?1:v<eqA.length?0.5:0,eqA.length+' → '+v+' éléments');break}
    case 'calib':T(B.bbox&&A.bbox&&JSON.stringify(A.bbox)!==JSON.stringify(B.bbox)?1:0,'dimensions '+JSON.stringify(A.bbox)+' → '+JSON.stringify(B.bbox));break;
    case 'save':T(B.pid?1:0,B.pid?'projet enregistré ('+B.pid+')':'pas de projet enregistré');break;
    case 'missing':{const n=JSON.stringify((R.reco&&R.reco.spec&&R.reco.spec.notes)||[]);T(/non vu|derri/i.test(txt)?1:/non vu|derri/i.test(n)?0.5:0,'notes : '+n.slice(0,80));break}
    case 'plan':case 'move_room':{T(model?(g==='plan'?(sc.id===81?0.5:1):(changed('rooms')||changed('piece'))&&!/ne trouve pas/i.test(txt)?1:0.3):0,model?'maquette depuis le plan':'pas de maquette');break}
    case 'design':T(model?1:0,model?'maquette créée':'aucune maquette sans plan');break;
    case 'cost2':T((txt.match(/€/g)||[]).length>=2?1:/€/.test(txt)?0.5:0,'');break;
    case 'style':case 'style_budget':case 'light':T(finishChg||added>0?1:!NONE.test(txt)&&txt.length>30?0.4:0,finishChg?'finitions changées':'rien appliqué');break;
    default:T(!NONE.test(txt)&&rep.length&&new RegExp(sc.kw.source,'i').test(txt)?0.6:0,'réponse : '+txt.slice(0,80));}
  // appli principale : réponses fondées sur les données de test (rendez-vous, clients, adresses)
  if(sc.sec==='main'){const q=/^Tu veux|c'est un client ou un fournisseur/i.test(txt.trim());const M={planning_map:/(rue|avenue|boulevard|place)[\s\S]*(rue|avenue|boulevard|place)/i,route:/(ordre|trajet|itin|km)/i,planning:/Martin[\s\S]*(carrel|Victor Hugo)|(carrel|Victor Hugo)[\s\S]*Martin/i,materials:/fa[iï]ence|colle|joint/i,history:/photo|mesure|aucun/i,projects:/(Martin|Dupont|Petit|Bernard|Leroy)[\s\S]*(Martin|Dupont|Petit|Bernard|Leroy)[\s\S]*(Martin|Dupont|Petit|Bernard|Leroy)/,slot:/(cr[ée]neau|libre)[\s\S]{0,80}?\b\d{1,2} ?h/i,time:/\d+ ?h[\s\S]*(Martin|Dupont|Bernard|Leroy|Petit)/i,summary:/(Martin|Dupont|Petit)[\s\S]*(Martin|Dupont|Petit)/,chantier:/r[ée]alis|termin/i}[g];if(M){T(!NONE.test(txt)&&!q&&M.test(txt)?1:!NONE.test(txt)&&!q&&txt.length>30?0.3:0,'réponse : '+txt.slice(0,100))}}
  if(false){const data=/Martin|Dupont|Petit|Bernard|Leroy|rue|avenue|boulevard|place|\d{1,2} ?h|\d{1,2}:\d{2}/.test(txt);T(!NONE.test(txt)&&data?(g==='planning_map'&&!/carte|map|itin/i.test(txt)?0.5:g==='route'&&!/ordre|trajet|km|d[ée]placement/i.test(txt)?0.5:1):0,'réponse : '+txt.slice(0,100))}
  return{ok,note,txt,rep}}
function score(R){const sc=R.scenario,C=chk(R),txt=C.txt,B=(R.m3d&&R.m3d.apres)||{};const m=sc.media.split(':')[0];
  const und=C.rep.length>0&&!NONE.test(txt),rel=new RegExp(sc.kw.source,'i').test(txt)||C.ok>=0.5;
  const asks=/film|vid[ée]o|photo|plan|envoie|prends/i.test(txt);
  const pts={};
  pts.comprehension=[und&&C.ok>=0.5?15:und&&rel?8:und?4:0,15];
  pts.besoin=[C.ok>=1?10:C.ok>=0.5?7:m==='absent'&&asks&&und?6:C.ok>0?4:0,10];
  // outils : la bonne donnée traitée par le bon outil
  const recoOk=m==='video'?!!(R.reco&&R.reco.spec&&R.reco.spec.objects):m==='plan'?(R.plan&&R.plan.etat&&R.plan.etat.walls>=3):m==='photos'?((R.etapes||[]).some(e=>/photos données/.test(e))&&(B.walls||0)>=3):null;
  pts.outils=[recoOk===null?(m==='absent'?(asks&&und?10:0):(C.ok>=0.5?10:C.ok>0?5:0)):recoOk?(C.ok>=0.5?10:6):0,10];
  // reconnaissance : seulement si une vraie donnée a été traitée
  if(m==='video'&&R.reco&&R.reco.spec){const labs=R.reco.spec.objects.filter(o=>o.type!=='ceiling_light'||1).map(o=>o.label);
    const tp=labs.filter(l=>GT.some(([,re])=>re.test(l))).length,prec=labs.length?tp/labs.length:0,found=new Set();labs.forEach(l=>GT.forEach(([n,re])=>{if(re.test(l))found.add(n)}));
    (R.reco.spec.openings||[]).forEach(o=>{if(o.type==='window')found.add('fenêtre')});const rec=found.size/GT.length,f1=prec+rec?2*prec*rec/(prec+rec):0;
    R.detection={prec,rec,f1,trouves:[...found],faux:labs.filter(l=>!GT.some(([,re])=>re.test(l)))};
    let s=15*f1;if(sc.but==='inventory_elec')s=15*ELEC_NEED.filter(n=>found.has(n)).length/ELEC_NEED.length;if(sc.but==='defects')s=C.ok>=1&&!/fissure|humidit|tache/i.test(txt.replace(/aucun[^.]*|pas de[^.]*/gi,''))?15:0;
    pts.reconnaissance=[Math.round(s),15];}
  else if(m==='plan'&&R.plan&&R.plan.etat){const n=(R.plan.etat.piece||[]).length;pts.reconnaissance=[Math.round(15*Math.min(n,4)/Math.max(n,4)),15];}
  else if(m==='photos'&&(B.walls||0)>=3)pts.reconnaissance=null;/* photos traitées : pas d'inventaire de référence par photo, non mesuré */
  else if(m==='photos'||(m==='video'&&!R.reco))pts.reconnaissance=[0,15];
  else pts.reconnaissance=null;
  // géométrie : seulement là où la vérité terrain existe (le plan dessiné)
  if(m==='plan'&&R.plan&&R.plan.etat&&R.plan.etat.bbox){const [w,d]=R.plan.etat.bbox,e1=Math.abs(w-GT_PLAN.W)/GT_PLAN.W,e2=Math.abs(d-GT_PLAN.D)/GT_PLAN.D;
    const ar=(R.plan.etat.piece||[]).map(p=>p.m2).sort((a,b)=>b-a).slice(0,4),gt=GT_PLAN.rooms.slice().sort((a,b)=>b-a),ea=ar.length===4?ar.reduce((s,a,i)=>s+Math.abs(a-gt[i])/gt[i],0)/4:1;
    R.geometrie={largeur:w,profondeur:d,err_dims:(e1+e2)/2,surfaces:ar,err_surfaces:ea};pts.geometrie=[Math.round(15*Math.max(0,1-((e1+e2)/2)*5)*0.5+15*Math.max(0,1-ea*2)*0.5),15];}
  else if(m==='plan')pts.geometrie=[0,15];else pts.geometrie=null;
  // qualité 3D : maquette présente, éléments plausibles, demande visible
  if(sc.sec==='main')pts.qualite3d=null;
  else{const model=(B.walls||0)>=3,eqs=(B.eqs||[]).filter(e=>e.vid),bad=eqs.filter(e=>(e.sh||0)>3.2&&!/^F01\.|poteau|pilier/i.test((e.cls||'')+' '+(e.lab||''))).length;/* grille 2 : un poteau monte jusqu'au faîtage */const cnt={};eqs.forEach(e=>{cnt[e.lab]=(cnt[e.lab]||0)+1});const dup=Object.values(cnt).filter(v=>v>2).length;
    pts.qualite3d=[model?5+(eqs.length?Math.max(0,5-2*bad-dup):5)+(C.ok>=1?5:C.ok>=0.5?2:0):0,15];}
  pts.coherence=[Math.round(10*C.ok),10];
  const hedge=/estim|environ|à vérifier|non vu|incertain|approximati|supposé|\?|pouvez-vous|voulez-vous|filmez|ajoutez/i.test(txt)||(m==='video'&&R.reco&&R.reco.spec&&R.reco.spec.notes&&R.reco.spec.notes.length>0);
  pts.incertitudes=[hedge?5:0,5];
  const errs=(R.erreurs||[]).filter(e=>!/VerifyOutputSizes/.test(e)).length,slow=((R.m3d&&R.m3d.ms)||(R.main&&R.main.ms)||0)>4000;
  pts.ux=[Math.max(0,5-(errs?3:0)-(slow?1:0)-(sc.sec!=='main'&&R.chat_visible===false?1:0)-(C.rep.length?0:3)),5];
  let got=0,max=0;for(const k in pts)if(pts[k]){got+=pts[k][0];max+=pts[k][1]}
  const s=max?Math.round(100*got/max):0,statut=C.ok>=1&&s>=70?'réussi':(C.ok>=0.5&&s>=40)||(C.ok>=1)?'partiel':'échec';
  return{id:sc.id,cat:sc.cat,titre:sc.titre,demande:sc.texte,donnees:sc.media,compris:und&&rel,execute:C.ok>=0.5,score:s,statut,pts,note:C.note,reponse:txt.slice(0,240),
    suite:R.suite&&R.suite.reponses?R.suite.reponses.filter(x=>x!==sc.suite).join(' / ').slice(0,160):'',annule:R.annule&&R.annule.reponses?R.annule.reponses.filter(x=>x!=='annule').join(' '):'',
    t_total:R.t&&R.t.total,t_reco:R.t&&R.t.reconstruction,t_chat:(R.m3d&&R.m3d.ms)||(R.main&&R.main.ms)||null,detection:R.detection||null,geometrie:R.geometrie||null,erreurs:(R.erreurs||[]).filter(e=>!/VerifyOutputSizes/.test(e)),etapes:R.etapes}}
const files=fs.readdirSync(DIR).filter(f=>/^\d+\.json$/.test(f)).sort((a,b)=>parseInt(a)-parseInt(b));
const out=files.map(f=>score(JSON.parse(fs.readFileSync(path.join(DIR,f),'utf8'))));
fs.writeFileSync(path.join(__dirname,'rapport.json'),JSON.stringify(out,null,1));
const by=k=>{const o={};out.forEach(r=>{(o[r[k]]=o[r[k]]||[]).push(r)});return o};
console.log('scénarios',out.length,'réussis',out.filter(r=>r.statut==='réussi').length,'partiels',out.filter(r=>r.statut==='partiel').length,'échecs',out.filter(r=>r.statut==='échec').length,'moyenne',(out.reduce((s,r)=>s+r.score,0)/out.length).toFixed(1));
for(const [c,rs] of Object.entries(by('cat')))console.log(c,rs.length,(rs.reduce((s,r)=>s+r.score,0)/rs.length).toFixed(1));
for(const r of out)console.log(String(r.id).padStart(3),r.score,r.statut.padEnd(7),r.titre.padEnd(24),'|',r.note.slice(0,70),'|',r.reponse.slice(0,90));

/* Tests de l'œil 3D (moteur vidéo lib/vid3d.js, bibliothèque lib/oeil/taxonomie.json, export lib/oeil/ifc.js).
   Sans navigateur ni modèle : des pièces de synthèse dont la vérité est connue sont « filmées » (profondeur et étiquettes
   calculées par lancer de rayons, avec une erreur d'échelle par vue et du bruit), puis reconstruites.
   Métriques : erreur sur les dimensions de la pièce, précision et rappel des éléments, erreur de position, ouvertures,
   apprentissage par correction, validité de l'IFC (avec IfcOpenShell s'il est installé).
   Lancer depuis la racine du dépôt : node tests/oeil3d.test.js */
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const ROOT=path.join(__dirname,'..');
global.window={__vdebug:!!process.env.OEIL_DEBUG};global.document={createElement:()=>({getContext:()=>null})};
global.fetch=async u=>{const p=path.join(ROOT,u);return{ok:fs.existsSync(p),json:async()=>JSON.parse(fs.readFileSync(p,'utf8'))}};
new Function(fs.readFileSync(path.join(ROOT,'lib/vid3d.js'),'utf8'))();
const V=window.__vid3dTest,oeilIFC=require(path.join(ROOT,'lib/oeil/ifc.js'));
const R=[];let fails=0;const ok=(n,c,x)=>{R.push((c?'OK   ':'FAIL ')+n+(x?'  ['+x+']':''));if(!c)fails++};

/* ---------- rendu de synthèse (repère de la 1re vue : x droite, y bas, z devant) ---------- */
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
function scene(o){ // o : pièce, ouvertures et objets en coordonnées « pièce » (x est, z sud, y haut, sol à 0)
  const camH=o.camH,W=o.W,D=o.D,H=o.H,cx=o.cx,cz=o.cz; // position de la caméra dans la pièce
  // passage pièce → monde : X=x-cx, Y=camH-y, Z=-(z-cz) (nord = devant)
  const boxes=o.objs.map((b,i)=>({...b,i,x0:b.x-b.w/2-cx,x1:b.x+b.w/2-cx,y0:camH-(b.y+b.h),y1:camH-b.y,z0:-(b.z+b.d/2-cz),z1:-(b.z-b.d/2-cz)}));
  const planes=[{ax:1,v:camH,lab:190,col:[200,190,170]},{ax:1,v:camH-H,lab:186,col:[240,238,232]},
    {ax:0,v:-W/2-cx,lab:199,col:[225,220,210],wall:'west'},{ax:0,v:W/2-cx,lab:199,col:[225,220,210],wall:'east'},
    {ax:2,v:D/2+cz,lab:199,col:[225,220,210],wall:'north'},{ax:2,v:-(D/2-cz),lab:199,col:[225,220,210],wall:'south'}];
  const hitOpen=(wall,X,Y,Z)=>{for(const q of o.ops){if(q.wall!==wall)continue;const y=camH-Y,al=wall==='north'||wall==='south'?X+cx:-Z+cz;
    if(Math.abs(al-q.along)<q.width/2&&y>=(q.sill||0)&&y<=(q.sill||0)+q.height)return q}return null};
  return function cast(Oc,d){let best=1e9,lab=0,seg=-1,col=[0,0,0];
    for(const p of planes){const dv=d[p.ax];if(Math.abs(dv)<1e-9)continue;const t=(p.v-Oc[p.ax])/dv;if(t>0.05&&t<best){best=t;lab=p.lab;seg=90+p.ax;col=p.col;
      if(p.wall){const X=Oc[0]+t*d[0],Y=Oc[1]+t*d[1],Z=Oc[2]+t*d[2],q=hitOpen(p.wall,X,Y,Z);if(q){lab=q.type==='door'?112:181;seg=95;col=[120,110,100]}}}}
    for(const b of boxes){let t0=-1e9,t1=1e9;for(const [a,lo,hi] of [[0,b.x0,b.x1],[1,b.y0,b.y1],[2,b.z0,b.z1]]){if(Math.abs(d[a])<1e-12){if(Oc[a]<lo||Oc[a]>hi){t0=1e9;break}continue}
        let ta=(lo-Oc[a])/d[a],tb=(hi-Oc[a])/d[a];if(ta>tb)[ta,tb]=[tb,ta];t0=Math.max(t0,ta);t1=Math.min(t1,tb)}
      if(t0<=t1&&t0>0.05&&t0<best){best=t0;lab=b.lab;seg=b.i;col=b.col}}
    return{t:best,lab,seg,col}}}
const rotY=a=>[Math.cos(a),0,-Math.sin(a),0,1,0,Math.sin(a),0,Math.cos(a)],rotX=a=>[1,0,0,0,Math.cos(a),Math.sin(a),0,-Math.sin(a),Math.cos(a)];
const mm=(A,B)=>{const C=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++)C[i*3+j]=A[i*3]*B[j]+A[i*3+1]*B[3+j]+A[i*3+2]*B[6+j];return C};
function film(cast,poses,opt){const w=opt.w||360,h=opt.h||480,f=0.75*Math.max(w,h),keys=[];
  for(const ps of poses){const C=ps.C,O=ps.O,img=new Uint8ClampedArray(w*h*4),Z=new Float32Array(w*h),L=new Int16Array(w*h),S=new Int32Array(w*h),k0=1+(rnd()-0.5)*2*(opt.sc||0);
    for(let v=0;v<h;v++)for(let u=0;u<w;u++){const r=[(u-w/2)/f,(v-h/2)/f,1],d=[C[0]*r[0]+C[3]*r[1]+C[6]*r[2],C[1]*r[0]+C[4]*r[1]+C[7]*r[2],C[2]*r[0]+C[5]*r[1]+C[8]*r[2]];
      const hit=cast(O,d),i=v*w+u;Z[i]=hit.t*k0*(1+(rnd()-0.5)*0.02);L[i]=hit.lab;S[i]=hit.seg;img.set([hit.col[0],hit.col[1],hit.col[2],255],i*4)}
    const at=(u,v)=>Math.min(w*h-1,Math.max(0,Math.round(v)*w+Math.round(u)));
    keys.push({w,h,C,O:O.slice(),img:{data:img,width:w,height:h},depth:(u,v)=>Z[at(u,v)],seg:{get:(u,v)=>{const i=at(u,v);return[L[i],S[i]]}}})}
  return{keys,fR:0.75}}

/* ---------- la pièce de référence : chambrée (4,6 × 6,0 × 2,6 m) ---------- */
const ROOM={W:4.6,D:6.0,H:2.6,camH:1.1,cx:-1.2,cz:1.6,
  ops:[{type:'door',wall:'north',along:-1.0,width:0.9,height:2.04},{type:'window',wall:'west',along:0.2,width:1.2,height:1.2,sill:0.9}],
  objs:[{n:'lit',lab:65,x:-1.7,z:-0.3,y:0,w:0.9,d:1.9,h:0.5,col:[60,70,55]},
        {n:'table',lab:67,x:0.2,z:-2.2,y:0,w:1.4,d:0.8,h:0.75,col:[60,70,90]},
        {n:'chaise',lab:62,x:0.2,z:-1.45,y:0,w:0.45,d:0.45,h:0.9,col:[150,110,70]},
        {n:'réfrigérateur',lab:82,x:1.95,z:-2.4,y:0,w:0.6,d:0.62,h:1.6,col:[225,228,232]},
        {n:'poteau',lab:0,x:0.4,z:-0.2,y:0,w:0.3,d:0.3,h:2.6,col:[245,245,242]}]};
const GT_TYPE={lit:'bed',table:'table',chaise:'chair','réfrigérateur':'fridge',poteau:'pillar'};
function evaluate(name,spec){
  const r=spec.room,eW=Math.abs(r.width-ROOM.W)/ROOM.W,eD=Math.abs(r.depth-ROOM.D)/ROOM.D,eH=Math.abs(r.wallHeight-ROOM.H)/ROOM.H;
  ok(name+' : largeur de la pièce à 5 % près',eW<=0.05,r.width+' m pour '+ROOM.W);
  ok(name+' : profondeur de la pièce à 5 % près',eD<=0.05,r.depth+' m pour '+ROOM.D);
  ok(name+' : hauteur sous plafond à 5 % près',eH<=0.05,r.wallHeight+' m pour '+ROOM.H);
  // repère de la pièce reconstruite : centrée sur ses murs ; vérité recentrée de même
  if(process.env.OEIL_DEBUG)console.log(name,JSON.stringify(spec.objects.map(o=>[o.type,o.x,o.z,o.y,o.w,o.d,o.h])),JSON.stringify(spec.notes));
  const objs=spec.objects.filter(o=>o.type!=='ceiling_light');let hit=0,pe=[],de=[];const used=new Set();
  for(const g of ROOM.objs){const tp=GT_TYPE[g.n];let best=null,bd=0.6;for(const o of objs){if(used.has(o)||o.type!==tp)continue;const d=Math.hypot(o.x-g.x,o.z-g.z);if(d<bd){bd=d;best=o}}
    if(best){hit++;used.add(best);pe.push(bd);de.push(Math.abs(best.h-g.h)/g.h)}}
  const rec=hit/ROOM.objs.length,prec=objs.length?used.size/objs.length:0,mpe=pe.length?pe.reduce((a,b)=>a+b)/pe.length:9,mde=de.length?de.reduce((a,b)=>a+b)/de.length:9;
  ok(name+' : rappel des éléments ≥ 80 %',rec>=0.8,(rec*100).toFixed(0)+' %');
  ok(name+' : précision des éléments ≥ 70 %',prec>=0.7,(prec*100).toFixed(0)+' % ('+used.size+'/'+objs.length+')');
  ok(name+' : erreur moyenne de position ≤ 0,35 m',mpe<=0.35,mpe.toFixed(2)+' m');
  ok(name+' : erreur moyenne de hauteur des éléments ≤ 15 %',mde<=0.15,(mde*100).toFixed(0)+' %');
  const door=spec.openings.find(o=>o.type==='door'),win=spec.openings.find(o=>o.type==='window');
  ok(name+' : porte retrouvée sur le mur du fond',!!door&&door.wall==='north'&&Math.abs(door.width-0.9)<0.3,door?door.wall+' '+door.width+' m':'—');
  ok(name+' : fenêtre retrouvée sur le mur de gauche',!!win&&win.wall==='west',win?win.wall+' '+win.width+' m':'—');
  return{eW,eD,eH,rec,prec,mpe,mde}}

(async()=>{
  await V.taxLoad();
  // la bibliothèque
  const tax=JSON.parse(fs.readFileSync(path.join(ROOT,'lib/oeil/taxonomie.json'),'utf8'));let nc=0,nr=0,nt=0;const ids=new Set();let dup=0;
  for(const f of tax.familles)for(const c of f.categories)for(const x of c.classes){nc++;if(ids.has(x.id))dup++;ids.add(x.id);if(x.detr||x.owl||x.regle)nr++;if(x.owlt)nt++;if(x.owlt&&x.owlt.length>14)dup++}
  ok('bibliothèque : 15 familles',tax.familles.length===15);ok('bibliothèque : identifiants uniques',dup===0,nc+' classes');
  ok('bibliothèque : classes reconnues automatiquement',nr>=90,nr+' / '+nc+', '+nt+' questions OWLv2');

  const cast=scene(ROOM),Q={};
  // 1) caméra qui tourne sur place (balayage de 220°, un peu inclinée)
  {const poses=[];for(let a=-60;a<=160;a+=20)poses.push({C:mm(rotX(-0.12),rotY(a*Math.PI/180)),O:[0,0,0]});
   const tr=film(cast,poses,{sc:0.08}),cl=V.buildCloud(tr.keys,tr.fR);let spec=V.reconstruct(cl);
   const ks=spec.refs.map(r=>r.k).filter(k=>k>0.4&&k<2.5);
   // recentrer la vérité sur la pièce reconstruite : la caméra y est en spec.camera
   const sh={x:spec.camera.x-(ROOM.cx),z:spec.camera.z-(ROOM.cz)};spec.objects.forEach(o=>{o.x-=sh.x;o.z-=sh.z});
   Q.rot=evaluate('sur place',spec);
   ok('sur place : repères de taille trouvés',ks.length>=2,spec.refs.map(r=>r.name+' '+r.k.toFixed(2)).join(', '));
   // l'œil 3D : identifiants, mesures à statut, relations
   V.oeilEnrich(spec,tr,null);
   ok('œil 3D : chaque élément a un identifiant, une classe et des mesures à statut',spec.objects.every(o=>o.id&&o.mes&&o.mes.largeur.statut&&o.mes.largeur.u==='m'&&o.mes.largeur.methode));
   ok('œil 3D : aucune mesure présentée comme vérifiée',spec.objects.every(o=>!['mesuree','validee'].includes(o.mes.largeur.statut)));
   ok('œil 3D : relations (posé au sol, appartient à la pièce)',spec.objects.filter(o=>o.type!=='ceiling_light').every(o=>o.rel.some(r=>r.r==='appartient_piece')&&o.rel.some(r=>r.r==='pose_sol'||r.r==='pose_sur'||r.r==='fixe_mur')));
   const lit=spec.objects.find(o=>o.type==='bed');ok('œil 3D : lit rattaché à la classe de la bibliothèque',!!lit&&lit.cls==='F09.chambre.lits',lit&&lit.cls);
   // apprentissage : tailles corrigées deux fois, classe supprimée à chaque fois
   const spec2=JSON.parse(JSON.stringify(spec)),fr=spec2.objects.find(o=>o.type==='fridge');const h0=fr&&fr.h;
   const oe={ex:[{t:'size',cls:'F09.cuisine.refrigerateurs',r:[1,1,0.9]},{t:'size',cls:'F09.cuisine.refrigerateurs',r:[1,1,0.9]},{t:'del',cls:'F09.salon.chaises'},{t:'del',cls:'F09.salon.chaises'},{t:'del',cls:'F09.salon.chaises'}],n:{'F09.salon.chaises':3}};
   V.oeilEnrich(spec2,tr,oe);if(process.env.OEIL_DEBUG)console.log('fr',h0,JSON.stringify(spec2.objects.map(o=>[o.cls,o.h])));const fr2=spec2.objects.find(o=>o.type==='fridge');
   ok('apprentissage : hauteur corrigée appliquée (médiane des corrections)',!!fr2&&Math.abs(fr2.h-h0*0.9)<0.02,fr2&&(h0+' → '+fr2.h));
   ok('apprentissage : classe toujours supprimée écartée et signalée',!spec2.objects.some(o=>o.type==='chair')&&spec2.notes.some(n=>/écarté/.test(n)));
   Q.spec=spec;}
  // 2) caméra qui se déplace dans la pièce (1,6 m) en tournant
  {const poses=[];for(let i=0;i<10;i++){const a=(-40+i*22)*Math.PI/180;poses.push({C:mm(rotX(-0.1),rotY(a)),O:[0.16*i,0,-0.05*i]})}
   const tr=film(cast,poses,{sc:0.06}),T=tr.keys.map(k=>k.O.map(x=>x/2.5));tr.keys.forEach((k,i)=>{k.T=T[i]});   // déplacement connu à une échelle près (comme la série de photos)
   const s=V.sfmScale(tr.keys,tr.fR);ok('en marchant : échelle du déplacement retrouvée à 10 % près',Math.abs(s-2.5)/2.5<=0.1,s.toFixed(2)+' pour 2,50');
   const cl=V.buildCloud(tr.keys,tr.fR),spec=V.reconstruct(cl),sh={x:spec.camera.x-ROOM.cx,z:spec.camera.z-ROOM.cz};spec.objects.forEach(o=>{o.x-=sh.x;o.z-=sh.z});
   Q.walk=evaluate('en marchant',spec);}
  // 3) export IFC
  {const D={nom:'Essai œil 3D',H:2.6,ep:0.2,statut:'estimee',source:'video',walls:[{id:'w1',o:'h',p:0,a:0,b:4.6,ep:0.2,h:2.6},{id:'w2',o:'v',p:4.6,a:0,b:6,ep:0.2,h:2.6},{id:'w3',o:'h',p:6,a:0,b:4.6,ep:0.2,h:2.6},{id:'w4',o:'v',p:0,a:0,b:6,ep:0.2,h:2.6}],
     ops:[{type:'door',wall:'w1',c0:1,c1:1.9,al:0,h:2.04},{type:'window',wall:'w4',c0:2,c1:3.2,al:0.9,h:1.2}],
     items:Q.spec.objects.slice(0,6).map(o=>({id:o.id,nom:o.label,cls:o.cls,x:o.x+2.3,y:o.z+3,z:o.y||0,w:o.w,d:o.d,h:o.h,rot:o.rotation||0,mes:o.mes,vid:true}))};
   const txt=oeilIFC(D),out=path.join(require('os').tmpdir(),'oeil3d-test.ifc');fs.writeFileSync(out,txt);
   ok('IFC : en-tête IFC4 et entités attendues',/FILE_SCHEMA\(\('IFC4'\)\)/.test(txt)&&(txt.match(/IFCWALL\(/g)||[]).length===4&&/IFCDOOR\(/.test(txt)&&/IFCWINDOW\(/.test(txt)&&(txt.match(/IFCFURNITURE\(/g)||[]).length===D.items.length);
   ok('IFC : statut et méthode des mesures transmis',/Statut_largeur/.test(txt)&&/Methode/.test(txt)&&/Qto_Oeil3D/.test(txt));
   ok('IFC : texte ASCII (accents encodés)',/^[\x09\x0a\x0d\x20-\x7e]*$/.test(txt));
   const py=spawnSync('python3',['-c',`import ifcopenshell,sys
f=ifcopenshell.open(sys.argv[1]);print(len(f.by_type('IfcWall')),len(f.by_type('IfcDoor')),len(f.by_type('IfcWindow')),len(f.by_type('IfcFurniture')),len(f.by_type('IfcRelVoidsElement')))
import ifcopenshell.validate as v;l=ifcopenshell.validate.json_logger();v.validate(f,l);print(len(l.statements))`,out],{encoding:'utf8'});
   if(py.status===0){const[a,b]=py.stdout.trim().split('\n');ok('IFC : relu par IfcOpenShell',a==='4 1 1 '+D.items.length+' 2',a);ok('IFC : conforme au schéma IFC4 (validation IfcOpenShell)',b==='0',b+' écart(s)')}
   else R.push('SKIP IFC : IfcOpenShell absent ('+(py.stderr||'').split('\n').slice(-2)[0]+')');}
  console.log(R.join('\n'));
  console.log('\nMétriques');
  for(const[k,m]of Object.entries({'sur place':Q.rot,'en marchant':Q.walk}))if(m)console.log(`  ${k.padEnd(12)} pièce : ${(m.eW*100).toFixed(1)} % / ${(m.eD*100).toFixed(1)} % / ${(m.eH*100).toFixed(1)} %   rappel ${(m.rec*100).toFixed(0)} %   précision ${(m.prec*100).toFixed(0)} %   position ${m.mpe.toFixed(2)} m   hauteur ${(m.mde*100).toFixed(0)} %`);
  console.log(`\n${R.filter(x=>x.startsWith('OK')).length} OK, ${fails} échec(s)`);process.exit(fails?1:0)})();

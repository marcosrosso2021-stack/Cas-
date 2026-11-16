/* casô — Œil 3D : export IFC4 (texte STEP) de la maquette, sans dépendance.
   Murs extrudés, ouvertures découpées et remplies (portes, fenêtres), éléments (IfcFurniture) avec leurs mesures,
   leur classe de la bibliothèque, la méthode, la confiance et le statut (estimée, supposée, mesurée, validée).
   Repère : x du plan → X, y du plan (vers le bas) → −Y, hauteur → Z. Unités : mètre. */
(function(){
function oeilIFC(D){
  let n=0;const L=[];const E=s=>{n++;L.push('#'+n+'='+s+';');return '#'+n};
  const q=s=>"'"+String(s==null?'':s).replace(/\\/g,'\\\\').replace(/'/g,"''").replace(/[^\x20-\x7e]/g,c=>{const h=c.codePointAt(0).toString(16).toUpperCase();return h.length<=4?'\\X2\\'+h.padStart(4,'0')+'\\X0\\':'\\X4\\'+h.padStart(8,'0')+'\\X0\\'})+"'";
  const f=v=>{const x=Number(v);if(!isFinite(x))return '0.';const s=(Math.round(x*1e6)/1e6).toString();return /[.eE]/.test(s)?s:s+'.'};
  const gid=(()=>{const c='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$';return()=>{let s='';for(let i=0;i<22;i++)s+=c[i===0?Math.floor(Math.random()*4):Math.floor(Math.random()*64)];return q(s)}})();
  const P3=(x,y,z)=>E(`IFCCARTESIANPOINT((${f(x)},${f(y)},${f(z)}))`),P2=(x,y)=>E(`IFCCARTESIANPOINT((${f(x)},${f(y)}))`),Dr=(x,y,z)=>E(`IFCDIRECTION((${f(x)},${f(y)},${f(z)}))`);
  const AX=(p,dx)=>E(`IFCAXIS2PLACEMENT3D(${p},${Dr(0,0,1)},${dx||Dr(1,0,0)})`);
  // contexte, unités, projet
  const own=E(`IFCOWNERHISTORY(${E(`IFCPERSONANDORGANIZATION(${E("IFCPERSON($,'caso',$,$,$,$,$,$)")},${E("IFCORGANIZATION($,'caso',$,$,$)")},$)`)},${E(`IFCAPPLICATION(${E("IFCORGANIZATION($,'caso',$,$,$)")},'1','caso Oeil 3D','caso-oeil3d')`)},$,.ADDED.,$,$,$,${Math.floor(Date.now()/1000)})`);
  const ctx=E(`IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-05,${AX(P3(0,0,0))},$)`),body=E(`IFCGEOMETRICREPRESENTATIONSUBCONTEXT('Body','Model',*,*,*,*,${ctx},$,.MODEL_VIEW.,$)`);
  const units=E(`IFCUNITASSIGNMENT((${E('IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.)')},${E('IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.)')},${E('IFCSIUNIT(*,.VOLUMEUNIT.,$,.CUBIC_METRE.)')},${E('IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.)')}))`);
  const proj=E(`IFCPROJECT(${gid()},${own},${q(D.nom||'Maquette casô')},${q('Maquette casô ('+(D.source||'')+'), mesures : '+(D.statut||''))},$,$,$,(${ctx}),${units})`);
  const lp0=E(`IFCLOCALPLACEMENT($,${AX(P3(0,0,0))})`);
  const site=E(`IFCSITE(${gid()},${own},'Site',$,$,${lp0},$,$,.ELEMENT.,$,$,$,$,$)`),lp1=E(`IFCLOCALPLACEMENT(${lp0},${AX(P3(0,0,0))})`);
  const bld=E(`IFCBUILDING(${gid()},${own},${q('Bâtiment')},$,$,${lp1},$,$,.ELEMENT.,$,$,$)`),lp2=E(`IFCLOCALPLACEMENT(${lp1},${AX(P3(0,0,0))})`);
  const sto=E(`IFCBUILDINGSTOREY(${gid()},${own},'Niveau 0',$,$,${lp2},$,$,.ELEMENT.,0.)`);
  E(`IFCRELAGGREGATES(${gid()},${own},$,$,${proj},(${site}))`);E(`IFCRELAGGREGATES(${gid()},${own},$,$,${site},(${bld}))`);E(`IFCRELAGGREGATES(${gid()},${own},$,$,${bld},(${sto}))`);
  const shape=(solid)=>E(`IFCPRODUCTDEFINITIONSHAPE($,$,(${E(`IFCSHAPEREPRESENTATION(${body},'Body','SweptSolid',(${solid}))`)}))`);
  const box=(w,d,h,ox,oy)=>E(`IFCEXTRUDEDAREASOLID(${E(`IFCRECTANGLEPROFILEDEF(.AREA.,$,${E(`IFCAXIS2PLACEMENT2D(${P2(ox==null?w/2:ox,oy||0)},$)`)},${f(Math.max(0.005,w))},${f(Math.max(0.005,d))})`)},${AX(P3(0,0,0))},${Dr(0,0,1)},${f(Math.max(0.005,h))})`);
  const place=(x,y,z,ang)=>E(`IFCLOCALPLACEMENT(${lp2},${AX(P3(x,y,z),Dr(Math.cos(ang),Math.sin(ang),0))})`);
  const inStorey=[],props=[];
  const pset=(el,name,kv)=>{const ps=Object.entries(kv).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>E(`IFCPROPERTYSINGLEVALUE(${q(k)},$,${typeof v==='number'?`IFCREAL(${f(v)})`:`IFCLABEL(${q(v)})`},$)`));
    if(ps.length)E(`IFCRELDEFINESBYPROPERTIES(${gid()},${own},$,$,(${el}),${E(`IFCPROPERTYSET(${gid()},${own},${q(name)},$,(${ps.join(',')}))`)})`)};
  const qto=(el,kv)=>{const qs=Object.entries(kv).filter(([,v])=>v>0).map(([k,v])=>E(`IFCQUANTITYLENGTH(${q(k)},$,$,${f(v)},$)`));if(qs.length)E(`IFCRELDEFINESBYPROPERTIES(${gid()},${own},$,$,(${el}),${E(`IFCELEMENTQUANTITY(${gid()},${own},'Qto_Oeil3D',$,$,(${qs.join(',')}))`)})`)};
  // murs : ligne médiane du plan, épaisseur, hauteur
  const W={};
  for(const w of D.walls||[]){const len=Math.abs(w.b-w.a);if(!(len>0.01))continue;let x0,y0,ang;
    if(w.o==='h'){x0=Math.min(w.a,w.b);y0=-w.p;ang=0}else{x0=w.p;y0=-Math.min(w.a,w.b);ang=-Math.PI/2}
    const lp=place(x0,y0,0,ang),el=E(`IFCWALL(${gid()},${own},${q('Mur')},$,$,${lp},${shape(box(len,w.ep,w.h,len/2,0))},$,.STANDARD.)`);
    W[w.id]={el,lp,w,x0,len};inStorey.push(el);pset(el,'Pset_Oeil3D',{Statut:D.statut,Source:D.source});qto(el,{Longueur:len,Epaisseur:w.ep,Hauteur:w.h})}
  // ouvertures : vide dans le mur, rempli par la porte ou la fenêtre
  for(const o of D.ops||[]){const M=W[o.wall];if(!M)continue;const w=M.w,ow=Math.abs(o.c1-o.c0),u=Math.min(o.c0,o.c1)-Math.min(w.a,w.b);
    const olp=E(`IFCLOCALPLACEMENT(${M.lp},${AX(P3(u,0,o.al||0))})`),op=E(`IFCOPENINGELEMENT(${gid()},${own},'Ouverture',$,$,${olp},${shape(box(ow,w.ep+0.1,o.h,ow/2,0))},$,.OPENING.)`);
    E(`IFCRELVOIDSELEMENT(${gid()},${own},$,$,${M.el},${op})`);
    const flp=E(`IFCLOCALPLACEMENT(${olp},${AX(P3(0,0,0))})`),door=o.type==='door';
    const fe=door?E(`IFCDOOR(${gid()},${own},'Porte',$,$,${flp},${shape(box(ow,0.05,o.h,ow/2,0))},$,${f(o.h)},${f(ow)},.DOOR.,$,$)`)
                 :E(`IFCWINDOW(${gid()},${own},${q('Fenêtre')},$,$,${flp},${shape(box(ow,0.06,o.h,ow/2,0))},$,${f(o.h)},${f(ow)},.WINDOW.,$,$)`);
    E(`IFCRELFILLSELEMENT(${gid()},${own},$,$,${op},${fe})`);inStorey.push(fe);pset(fe,'Pset_Oeil3D',{Statut:D.statut,Source:D.source,Allege:door?null:o.al});qto(fe,{Largeur:ow,Hauteur:o.h})}
  // éléments (meubles, équipements, éléments captés) avec leurs mesures et leur statut
  for(const it of D.items||[]){const ang=-(it.rot||0)*Math.PI/180;
    const el=E(`IFCFURNITURE(${gid()},${own},${q(it.nom)},${q(it.cls)},$,${place(it.x,-it.y,it.z||0,ang)},${shape(box(it.w,it.d,it.h,0,0))},${q(it.id)},$)`);inStorey.push(el);
    const m=it.mes||{},st=k=>m[k]&&m[k].statut;pset(el,'Pset_Oeil3D',{Classe:it.cls,Source:it.vid?'video':D.source,Statut:st('largeur')||D.statut,Statut_largeur:st('largeur'),Statut_profondeur:st('profondeur'),Statut_hauteur:st('hauteur'),
      Methode:m.largeur&&m.largeur.methode,Confiance:m.largeur&&m.largeur.confiance,Hauteur_pose:it.z||0});
    qto(el,{Largeur:it.w,Profondeur:it.d,Hauteur:it.h})}
  E(`IFCRELCONTAINEDINSPATIALSTRUCTURE(${gid()},${own},$,$,(${inStorey.join(',')||'$'}),${sto})`);
  const head=`ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(('ViewDefinition [ReferenceView]'),'2;1');\nFILE_NAME(${q((D.nom||'maquette')+'.ifc')},'${new Date().toISOString().slice(0,19)}',('caso'),('caso'),'caso Oeil 3D','caso Oeil 3D','');\nFILE_SCHEMA(('IFC4'));\nENDSEC;\nDATA;\n`;
  return head+L.join('\n')+'\nENDSEC;\nEND-ISO-10303-21;\n';
}
window.oeilIFC=oeilIFC;if(typeof module!=='undefined')module.exports=oeilIFC;
})();

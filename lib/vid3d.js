/* casô — Rénovation par vidéo : la pièce filmée en tournant sur soi-même, sans service extérieur.
   Suivi de la caméra (jsfeat, MIT), profondeur métrique (Depth Anything V2 Metric Indoor Small, converti en ONNX),
   surfaces et objets (DETR panoptique, déjà utilisé par la Rénovation). Le résultat remplit la Rénovation comme une
   série de photos : un mur = la meilleure image de la vidéo, ses quatre coins et sa longueur mesurée.
   Chargé à la demande par lib/m3d.html (script classique dans le même document : RNV, busy, v2Sess… sont partagés). */
(function(){
const $=s=>document.querySelector(s);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const LOG=(...a)=>{if(window.__vdebug)console.log('[vid]',...a);};
// fonctions et état du module 3D (lib/m3d.html les garde dans sa portée : il les passe à l'appel)
let RNV,busy,busyStep,tick,t,toast,fmt,rnvDetect,rnvRender,rnvMake,v2Sess,vidFurnish;
/* =====================================================================
   1. ALGÈBRE
   ===================================================================== */
function jacobiEig(A,n){ // A symétrique n×n (tableau plat), renvoie {vals,vecs (colonnes)}
  const a=A.slice(),v=new Float64Array(n*n);for(let i=0;i<n;i++)v[i*n+i]=1;
  for(let sweep=0;sweep<60;sweep++){
    let off=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)off+=a[i*n+j]*a[i*n+j];
    if(off<1e-20)break;
    for(let p=0;p<n;p++)for(let q=p+1;q<n;q++){
      const apq=a[p*n+q];if(Math.abs(apq)<1e-30)continue;
      const th=(a[q*n+q]-a[p*n+p])/(2*apq);
      const t=Math.sign(th||1)/(Math.abs(th)+Math.sqrt(th*th+1)),c=1/Math.sqrt(t*t+1),s=t*c;
      for(let k=0;k<n;k++){const akp=a[k*n+p],akq=a[k*n+q];a[k*n+p]=c*akp-s*akq;a[k*n+q]=s*akp+c*akq;}
      for(let k=0;k<n;k++){const apk=a[p*n+k],aqk=a[q*n+k];a[p*n+k]=c*apk-s*aqk;a[q*n+k]=s*apk+c*aqk;}
      for(let k=0;k<n;k++){const vkp=v[k*n+p],vkq=v[k*n+q];v[k*n+p]=c*vkp-s*vkq;v[k*n+q]=s*vkp+c*vkq;}
    }
  }
  const vals=[];for(let i=0;i<n;i++)vals.push(a[i*n+i]);return {vals,vecs:v};
}
// rotation R (ligne majeure) telle que q ≈ R p, méthode de Horn (quaternions)
function hornRot(P,Q,idx){
  let Sxx=0,Sxy=0,Sxz=0,Syx=0,Syy=0,Syz=0,Szx=0,Szy=0,Szz=0;
  for(const i of idx){const px=P[i*3],py=P[i*3+1],pz=P[i*3+2],qx=Q[i*3],qy=Q[i*3+1],qz=Q[i*3+2];
    Sxx+=px*qx;Sxy+=px*qy;Sxz+=px*qz;Syx+=py*qx;Syy+=py*qy;Syz+=py*qz;Szx+=pz*qx;Szy+=pz*qy;Szz+=pz*qz;}
  const N=[Sxx+Syy+Szz,Syz-Szy,Szx-Sxz,Sxy-Syx, Syz-Szy,Sxx-Syy-Szz,Sxy+Syx,Szx+Sxz, Szx-Sxz,Sxy+Syx,-Sxx+Syy-Szz,Syz+Szy, Sxy-Syx,Szx+Sxz,Syz+Szy,-Sxx-Syy+Szz];
  const {vals,vecs}=jacobiEig(N,4);let b=0;for(let i=1;i<4;i++)if(vals[i]>vals[b])b=i;
  const w=vecs[0*4+b],x=vecs[1*4+b],y=vecs[2*4+b],z=vecs[3*4+b];
  return [1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w), 2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w), 2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)];
}
const mmul=(A,B)=>{const C=new Array(9);for(let i=0;i<3;i++)for(let j=0;j<3;j++)C[i*3+j]=A[i*3]*B[j]+A[i*3+1]*B[3+j]+A[i*3+2]*B[6+j];return C;};
const mT=A=>[A[0],A[3],A[6],A[1],A[4],A[7],A[2],A[5],A[8]];
const rotAngle=R=>Math.acos(Math.max(-1,Math.min(1,(R[0]+R[4]+R[8]-1)/2)));
const I3=[1,0,0,0,1,0,0,0,1];
function solve3(M,v){const d=(a)=>a[0]*(a[4]*a[8]-a[5]*a[7])-a[1]*(a[3]*a[8]-a[5]*a[6])+a[2]*(a[3]*a[7]-a[4]*a[6]);
  const D=d(M);if(Math.abs(D)<1e-9)return null;const r=[];for(let c=0;c<3;c++){const m=Array.from(M);for(let k=0;k<3;k++)m[k*3+c]=v[k];r.push(d(m)/D);}return r;}
const pct=(arr,p)=>{if(!arr.length)return NaN;const s=Float64Array.from(arr).sort();return s[Math.min(s.length-1,Math.max(0,Math.floor(p*(s.length-1))))];};
const median=a=>pct(a,0.5);

/* =====================================================================
   2. LECTURE DE LA VIDÉO + SUIVI DE LA ROTATION (jsfeat, Lucas-Kanade)
   ===================================================================== */
function waitEv(t,ev,ms){return new Promise((res,rej)=>{const to=setTimeout(()=>rej(new Error('timeout '+ev)),ms);t.addEventListener(ev,()=>{clearTimeout(to);res();},{once:true});t.addEventListener('error',()=>{clearTimeout(to);rej(new Error('decode'));},{once:true});});}
const TRACK_LONG=320, KEY_LONG=800, MAX_KEYS=14, KEY_ANGLE=9*Math.PI/180;

async function readAndTrack(file,onStep){
  const url=URL.createObjectURL(file);const v=document.createElement('video');
  v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');v.preload='auto';v.src=url;
  try{
    await waitEv(v,'loadedmetadata',20000);
    try{await v.play();v.pause();}catch(e){}
    const dur=v.duration;if(!isFinite(dur)||dur<=0)throw new Error('duration');
    const vw=v.videoWidth,vh=v.videoHeight;if(!vw||!vh)throw new Error('decode');
    const ts=TRACK_LONG/Math.max(vw,vh), tw=Math.round(vw*ts), th=Math.round(vh*ts);
    const ks=Math.min(1,KEY_LONG/Math.max(vw,vh)), kw=Math.round(vw*ks), kh=Math.round(vh*ks);
    const tc=document.createElement('canvas');tc.width=tw;tc.height=th;const tx=tc.getContext('2d',{willReadFrequently:true});
    const kc=document.createElement('canvas');kc.width=kw;kc.height=kh;const kx=kc.getContext('2d',{willReadFrequently:true});
    const fps=Math.min(10,300/dur), n=Math.max(2,Math.floor(dur*fps));
    let fR=0.72; // focale / grand côté (téléphone, ~26 mm équivalent)
    const pyrA=new jsfeat.pyramid_t(3),pyrB=new jsfeat.pyramid_t(3);
    pyrA.allocate(tw,th,jsfeat.U8_t|jsfeat.C1_t);pyrB.allocate(tw,th,jsfeat.U8_t|jsfeat.C1_t);
    let prev=pyrA,curr=pyrB;
    const corners=[];for(let i=0;i<tw*th;i++)corners.push(new jsfeat.keypoint_t(0,0,0,0));
    jsfeat.yape06.laplacian_threshold=18;jsfeat.yape06.min_eigen_value_threshold=12;
    const MAXP=400;let tracks=[];let nextId=0;
    const frames=[]; // {t, obs: Map id->[x,y]}
    const keys=[];   // {fi, img:ImageData, w,h}
    const relPairs=[]; // pour la focale : [{a,b,ids}]
    let C=I3.slice(), lastKeyC=null; const Cs=[];
    const fT=()=>fR*Math.max(tw,th);
    const bearing=(x,y,f)=>{const X=(x-tw/2)/f,Y=(y-th/2)/f,n=Math.hypot(X,Y,1);return [X/n,Y/n,1/n];};
    for(let i=0;i<n;i++){
      const t=Math.min(dur-0.03,i/fps);
      const p=waitEv(v,'seeked',10000);v.currentTime=t;await p;
      tx.drawImage(v,0,0,tw,th);
      const id=tx.getImageData(0,0,tw,th);
      jsfeat.imgproc.grayscale(id.data,tw,th,curr.data[0]);curr.build(curr.data[0],true);
      const obs=new Map();
      if(i>0&&tracks.length){
        const cnt=tracks.length,pxy=new Float32Array(cnt*2),cxy=new Float32Array(cnt*2),st=new Uint8Array(cnt);
        const bxy=new Float32Array(cnt*2),st2=new Uint8Array(cnt);
        tracks.forEach((tr,k)=>{pxy[k*2]=tr.x;pxy[k*2+1]=tr.y;});
        jsfeat.optical_flow_lk.track(prev,curr,pxy,cxy,cnt,21,30,st,0.01,0.0001);
        jsfeat.optical_flow_lk.track(curr,prev,cxy,bxy,cnt,21,30,st2,0.01,0.0001);
        const keep=[];
        for(let k=0;k<cnt;k++){
          const x=cxy[k*2],y=cxy[k*2+1];
          if(!st[k]||!st2[k]||x<4||y<4||x>tw-5||y>th-5)continue;
          if(Math.hypot(bxy[k*2]-pxy[k*2],bxy[k*2+1]-pxy[k*2+1])>0.8)continue;
          keep.push({id:tracks[k].id,x,y});
        }
        // rotation relative (RANSAC 2 points)
        const ids=keep.map(k=>k.id), prevObs=frames[i-1].obs;
        const R=relRotation(ids.map(id=>prevObs.get(id)),keep.map(k=>[k.x,k.y]),tw,th,fT());
        if(R){C=mmul(R.R,C);const inl=R.inl.map(j=>ids[j]);
          const ok=new Set(inl);tracks=keep.filter(k=>ok.has(k.id));}
        else{tracks=keep;}
      }
      // réalimentation des points
      if(tracks.length<MAXP*0.6){
        const cnt=jsfeat.yape06.detect(curr.data[0],corners,6);
        const cand=corners.slice(0,cnt).sort((a,b)=>b.score-a.score);
        const grid=new Set(tracks.map(t=>((t.y/12)|0)*1000+((t.x/12)|0)));
        for(const c of cand){if(tracks.length>=MAXP)break;const g=((c.y/12)|0)*1000+((c.x/12)|0);if(grid.has(g))continue;grid.add(g);tracks.push({id:nextId++,x:c.x,y:c.y});}
      }
      tracks.forEach(t=>obs.set(t.id,[t.x,t.y]));
      frames.push({t,obs});Cs.push(C.slice());
      // image clé
      const isLast=i===n-1;
      if(!lastKeyC||rotAngle(mmul(C,mT(lastKeyC)))>KEY_ANGLE||(isLast&&rotAngle(mmul(C,mT(lastKeyC)))>KEY_ANGLE*0.45)){
        if(keys.length<MAX_KEYS||isLast){
          if(keys.length>=MAX_KEYS)keys.pop();
          kx.drawImage(v,0,0,kw,kh);keys.push({fi:i,img:kx.getImageData(0,0,kw,kh),w:kw,h:kh});lastKeyC=C.slice();
        }
      }
      const tmp=prev;prev=curr;curr=tmp;
      onStep('read',i+1,n);
      if(i%4===0)await sleep(0);
    }
    // ---- focale : celle qui explique le mieux les points suivis sur des écarts de 10 à 25° ----
    const pairs=[];
    for(let a=0;a<frames.length;a+=2){
      for(let b=a+2;b<frames.length;b++){
        const ang=rotAngle(mmul(Cs[b],mT(Cs[a])));
        if(ang>0.17){const ids=[...frames[b].obs.keys()].filter(id=>frames[a].obs.has(id));if(ids.length>=25)pairs.push({a,b,ids});break;}
      }
    }
    if(pairs.length>=3){
      let best=fR,bestE=Infinity;
      for(let r=0.5;r<=1.15;r+=0.01){
        const f=r*Math.max(tw,th);let e=0,m=0;
        for(const pr of pairs){
          const P=[],Q=[];pr.ids.forEach(id=>{P.push(...bearing(...frames[pr.a].obs.get(id),f));Q.push(...bearing(...frames[pr.b].obs.get(id),f));});
          const idx=[...Array(pr.ids.length).keys()];const R=hornRot(P,Q,idx);
          const errs=[];for(const j of idx){const p=[P[j*3],P[j*3+1],P[j*3+2]];const q=[R[0]*p[0]+R[1]*p[1]+R[2]*p[2],R[3]*p[0]+R[4]*p[1]+R[5]*p[2],R[6]*p[0]+R[7]*p[1]+R[8]*p[2]];
            errs.push(Math.acos(Math.min(1,q[0]*Q[j*3]+q[1]*Q[j*3+1]+q[2]*Q[j*3+2]))*f);}
          e+=median(errs);m++;
        }
        e/=m;if(e<bestE){bestE=e;best=r;}
      }
      LOG('focale',best.toFixed(2),'erreur',bestE.toFixed(3),'paires',pairs.length);
      fR=best;
      // recalcul de toutes les rotations avec cette focale
      let C2=I3.slice();const Cs2=[C2.slice()];
      for(let i=1;i<frames.length;i++){
        const ids=[...frames[i].obs.keys()].filter(id=>frames[i-1].obs.has(id));
        if(ids.length>=8){const f=fT();const P=[],Q=[];ids.forEach(id=>{P.push(...bearing(...frames[i-1].obs.get(id),f));Q.push(...bearing(...frames[i].obs.get(id),f));});
          C2=mmul(hornRot(P,Q,[...Array(ids.length).keys()]),C2);}
        Cs2.push(C2.slice());
      }
      for(let i=0;i<Cs.length;i++)Cs[i]=Cs2[i];
    }
    const total=rotAngle(mmul(Cs[Cs.length-1],mT(Cs[0])));
    LOG('images',n,'clés',keys.length,'rotation totale',(total*180/Math.PI).toFixed(0)+'°');
    return {dur,vw,vh,fR,keys:keys.map(k=>({...k,C:Cs[k.fi]}))};
  }finally{URL.revokeObjectURL(url);}
}
function relRotation(A,B,w,h,f){
  const n=A.length;if(n<10)return null;
  const P=new Float64Array(n*3),Q=new Float64Array(n*3);
  for(let i=0;i<n;i++){
    let X=(A[i][0]-w/2)/f,Y=(A[i][1]-h/2)/f,l=Math.hypot(X,Y,1);P[i*3]=X/l;P[i*3+1]=Y/l;P[i*3+2]=1/l;
    X=(B[i][0]-w/2)/f;Y=(B[i][1]-h/2)/f;l=Math.hypot(X,Y,1);Q[i*3]=X/l;Q[i*3+1]=Y/l;Q[i*3+2]=1/l;
  }
  const thr=1.5/f;let best=null,bestN=0;
  const inl=R=>{const o=[];for(let i=0;i<n;i++){const px=P[i*3],py=P[i*3+1],pz=P[i*3+2];
    const qx=R[0]*px+R[1]*py+R[2]*pz,qy=R[3]*px+R[4]*py+R[5]*pz,qz=R[6]*px+R[7]*py+R[8]*pz;
    const d=Math.hypot(qx-Q[i*3],qy-Q[i*3+1],qz-Q[i*3+2]);if(d<thr)o.push(i);}return o;};
  for(let it=0;it<120;it++){
    const a=(Math.random()*n)|0,b=(Math.random()*n)|0;if(a===b)continue;
    const R=hornRot(P,Q,[a,b]);const o=inl(R);if(o.length>bestN){bestN=o.length;best=o;}
    if(bestN>n*0.9)break;
  }
  if(!best||bestN<8)return null;
  let R=hornRot(P,Q,best);const o=inl(R);if(o.length>=8)R=hornRot(P,Q,o);
  return {R,inl:o.length>=8?o:best};
}

/* =====================================================================
   3. MODÈLES (ONNX Runtime Web, dans l'appareil)
   ===================================================================== */
const LAB={};// libellés COCO panoptique
'0:N/A,1:person,2:bicycle,3:car,15:bench,27:backpack,28:umbrella,31:handbag,33:suitcase,44:bottle,46:wine glass,47:cup,51:bowl,62:chair,63:couch,64:potted plant,65:bed,67:dining table,70:toilet,72:tv,73:laptop,74:mouse,75:remote,76:keyboard,77:cell phone,78:microwave,79:oven,80:toaster,81:sink,82:refrigerator,84:book,85:clock,86:vase,88:teddy bear,92:banner,93:blanket,100:cardboard,104:cloth,105:clothes,107:counter,108:cupboard,109:curtain,110:desk-stuff,112:door-stuff,114:floor-marble,115:floor-other,116:floor-stone,117:floor-tile,118:floor-wood,119:flower,123:furniture-other,130:light,131:mat,133:mirror-stuff,138:net,141:pillow,156:shelf,161:stairs,165:table,168:towel,171:wall-brick,172:wall-concrete,173:wall-other,174:wall-panel,175:wall-stone,176:wall-tile,177:wall-wood,180:window-blind,181:window-other,186:ceiling,188:cabinet,189:table,190:floor-other,191:pavement,195:paper,199:wall-other,200:rug'
 .split(',').forEach(s=>{const [k,v]=s.split(':');LAB[+k]=v;});
const FLOOR=new Set([114,115,116,117,118,131,190,191,200]);
const WALL=new Set([171,172,173,174,175,176,177,199]);
const CEIL=new Set([186]);
const DOOR=new Set([112]);
const WIND=new Set([180,181]);
// objets gardés : type 3D, nom français, épaisseur minimale (m)
const OBJ={
  65:['bed','Lit',0.9],63:['sofa','Canapé',0.8],62:['chair','Chaise',0.42],15:['sofa','Banc',0.4],
  67:['table','Table',0.6],165:['table','Table',0.6],189:['table','Table',0.6],110:['desk','Bureau',0.5],
  82:['fridge','Réfrigérateur',0.6],78:['microwave','Micro-ondes',0.35],79:['oven','Four',0.55],80:['other','Grille-pain',0.2],
  72:['tv','Télévision',0.08],73:['other','Ordinateur portable',0.25],70:['toilet','WC',0.6],81:['sink','Lavabo',0.4],
  64:['plant','Plante',0.3],86:['other','Vase',0.12],85:['other','Horloge',0.05],84:['other','Livre',0.15],
  44:['other','Bouteille',0.08],47:['other','Tasse',0.08],51:['other','Bol',0.12],
  27:['bag','Sac à dos',0.25],31:['bag','Sac',0.2],33:['bag','Valise',0.25],
  98:['cabinet','Meuble',0.4],108:['cabinet','Placard',0.45],188:['cabinet','Meuble',0.4],107:['cabinet','Comptoir',0.5],
  156:['shelf','Étagère',0.3],123:['cabinet','Meuble',0.4],100:['box','Carton',0.25],
  109:['curtain','Rideau',0.08],130:['ceiling_light','Lumière',0.1],133:['mirror','Miroir',0.03],66:['mirror','Miroir',0.03],
  88:['other','Peluche',0.2],141:['other','Coussin',0.15]
};

const MEAN=[0.485,0.456,0.406],STD=[0.229,0.224,0.225];
function canvasOf(img){const c=document.createElement('canvas');c.width=img.width;c.height=img.height;c.getContext('2d').putImageData(img,0,0);return c;}
/* =====================================================================
   4. NUAGE DE POINTS → PIÈCE
   ===================================================================== */
// échelle commune : une même direction vue par deux images clés voisines doit être à la même distance
function alignScales(keys,fR){
  const sc=[1];
  const ray=(k,u,v)=>{const f=fR*Math.max(k.w,k.h);return [(u-k.w/2)/f,(v-k.h/2)/f,1];};
  for(let j=1;j<keys.length;j++){
    const a=keys[j-1],b=keys[j],fb=fR*Math.max(b.w,b.h),rat=[];
    for(let v=10;v<a.h-10;v+=14)for(let u=10;u<a.w-10;u+=14){
      const r=ray(a,u,v),wn=Math.hypot(...r);
      const w=[a.C[0]*r[0]+a.C[3]*r[1]+a.C[6]*r[2],a.C[1]*r[0]+a.C[4]*r[1]+a.C[7]*r[2],a.C[2]*r[0]+a.C[5]*r[1]+a.C[8]*r[2]];
      const c=[b.C[0]*w[0]+b.C[1]*w[1]+b.C[2]*w[2],b.C[3]*w[0]+b.C[4]*w[1]+b.C[5]*w[2],b.C[6]*w[0]+b.C[7]*w[1]+b.C[8]*w[2]];
      if(c[2]<=0.2)continue;const ub=fb*c[0]/c[2]+b.w/2,vb=fb*c[1]/c[2]+b.h/2;
      if(ub<12||vb<12||ub>b.w-12||vb>b.h-12)continue;
      const da=a.depth(u,v),db=b.depth(ub,vb);if(!(da>0.3&&db>0.3))continue;
      const ra=da*wn, rb=db*Math.hypot((ub-b.w/2)/fb,(vb-b.h/2)/fb,1);
      rat.push(ra/rb);
    }
    sc.push(rat.length>=40?sc[j-1]*median(rat):sc[j-1]);
    LOG('échelle',j,rat.length,(rat.length?median(rat):1).toFixed(3));
  }
  const g=Math.exp(sc.reduce((s,x)=>s+Math.log(x),0)/sc.length);
  keys.forEach((k,i)=>{const s=sc[i]/g,d0=k.depth;k.depth=(u,v)=>d0(u,v)*s;});
}
function buildCloud(keys,fR){
  alignScales(keys,fR);
  const P=[],N=[],COL=[],LBL=[],SEG=[];
  keys.forEach((k,ki)=>{
    const f=fR*Math.max(k.w,k.h),cx=k.w/2,cy=k.h/2,C=k.C,step=Math.max(3,Math.round(Math.max(k.w,k.h)/150));
    const d=k.img.data;
    for(let v=step;v<k.h-step;v+=step)for(let u=step;u<k.w-step;u+=step){
      const z=k.depth(u,v);if(!(z>0.25&&z<14))continue;
      const zl=k.depth(u-step,v),zr=k.depth(u+step,v),zu=k.depth(u,v-step),zd=k.depth(u,v+step);
      if(Math.max(Math.abs(zl-zr),Math.abs(zu-zd))/z>0.22)continue; // bord d'objet
      const X=(u-cx)/f*z,Y=(v-cy)/f*z;
      // normale locale (voisins à droite et en bas)
      const Xr=(u+step-cx)/f*zr,Yr=(v-cy)/f*zr,Xd=(u-cx)/f*zd,Yd=(v+step-cy)/f*zd;
      const a=[Xr-X,Yr-Y,zr-z],b=[Xd-X,Yd-Y,zd-z];let nn=cross(a,b);const nl=Math.hypot(...nn)||1;nn=nn.map(q=>q/nl);
      if(nn[0]*X+nn[1]*Y+nn[2]*z>0)nn=nn.map(q=>-q);
      N.push(C[0]*nn[0]+C[3]*nn[1]+C[6]*nn[2], C[1]*nn[0]+C[4]*nn[1]+C[7]*nn[2], C[2]*nn[0]+C[5]*nn[1]+C[8]*nn[2]);
      // monde = Cᵀ · caméra
      P.push(C[0]*X+C[3]*Y+C[6]*z, C[1]*X+C[4]*Y+C[7]*z, C[2]*X+C[5]*Y+C[8]*z);
      const o=(v*k.w+u)*4;COL.push(d[o],d[o+1],d[o+2]);
      const [lab,sg]=k.seg.get(u,v);LBL.push(lab);SEG.push(sg<0?-1:ki*100+sg);
    }
  });
  return {P:Float32Array.from(P),N:Float32Array.from(N),COL:Uint8Array.from(COL),LBL:Int16Array.from(LBL),SEG:Int32Array.from(SEG),n:LBL.length};
}
function fitPlane(pts,guess,maxAng,thr,iters){ // pts: [[x,y,z]], guess: normale attendue
  let best=null,bestN=0;const n=pts.length;if(n<30)return null;
  const cosMax=Math.cos(maxAng);
  for(let it=0;it<iters;it++){
    const a=pts[(Math.random()*n)|0],b=pts[(Math.random()*n)|0],c=pts[(Math.random()*n)|0];
    const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
    let nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0];const l=Math.hypot(nx,ny,nz);if(l<1e-6)continue;
    nx/=l;ny/=l;nz/=l;if(nx*guess[0]+ny*guess[1]+nz*guess[2]<0){nx=-nx;ny=-ny;nz=-nz;}
    if(nx*guess[0]+ny*guess[1]+nz*guess[2]<cosMax)continue;
    const dd=nx*a[0]+ny*a[1]+nz*a[2];let cnt=0;for(const p of pts)if(Math.abs(nx*p[0]+ny*p[1]+nz*p[2]-dd)<thr)cnt++;
    if(cnt>bestN){bestN=cnt;best=[nx,ny,nz,dd];}
  }
  if(!best)return null;
  // affinage (ACP des points retenus)
  const inl=pts.filter(p=>Math.abs(best[0]*p[0]+best[1]*p[1]+best[2]*p[2]-best[3])<thr);
  const m=[0,0,0];inl.forEach(p=>{m[0]+=p[0];m[1]+=p[1];m[2]+=p[2];});m[0]/=inl.length;m[1]/=inl.length;m[2]/=inl.length;
  const S=new Float64Array(9);inl.forEach(p=>{const d=[p[0]-m[0],p[1]-m[1],p[2]-m[2]];for(let i=0;i<3;i++)for(let j=0;j<3;j++)S[i*3+j]+=d[i]*d[j];});
  const {vals,vecs}=jacobiEig(S,3);let k=0;for(let i=1;i<3;i++)if(vals[i]<vals[k])k=i;
  let nn=[vecs[k],vecs[3+k],vecs[6+k]];if(nn[0]*guess[0]+nn[1]*guess[1]+nn[2]*guess[2]<0)nn=nn.map(x=>-x);
  return {n:nn,d:nn[0]*m[0]+nn[1]*m[1]+nn[2]*m[2],count:inl.length};
}
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const l=Math.hypot(...a);return a.map(x=>x/l);};
const hex=(r,g,b)=>'#'+[r,g,b].map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('');
let expo=1;
function medColor(cl,idx){if(!idx.length)return null;const r=[],g=[],b=[];for(const i of idx){r.push(cl.COL[i*3]);g.push(cl.COL[i*3+1]);b.push(cl.COL[i*3+2]);}return hex(median(r)*expo,median(g)*expo,median(b)*expo);}

function reconstruct(cl){
  const notes=[];
  const pt=i=>[cl.P[i*3],cl.P[i*3+1],cl.P[i*3+2]];
  const sample=(set,max)=>{const a=[];for(let i=0;i<cl.n;i++)if(set.has(cl.LBL[i]))a.push(i);
    if(a.length>max){const s=a.length/max;const b=[];for(let k=0;k<max;k++)b.push(a[Math.floor(k*s)]);return b;}return a;};
  // ---- verticale : sol (et plafond) ----
  const up0=[0,-1,0];
  const fl=sample(FLOOR,4000).map(pt), ce=sample(CEIL,4000).map(pt);
  let up=up0,floorD=null,src='';
  // les murs sont verticaux : la verticale est perpendiculaire à leurs normales
  const wIdx=[];for(let i=0;i<cl.n;i++)if(WALL.has(cl.LBL[i])||DOOR.has(cl.LBL[i])||WIND.has(cl.LBL[i]))wIdx.push(i);
  if(wIdx.length>400){
    const S=new Float64Array(9);for(const i of wIdx){const n=[cl.N[i*3],cl.N[i*3+1],cl.N[i*3+2]];if(Math.abs(n[1])>0.6)continue;for(let a=0;a<3;a++)for(let b=0;b<3;b++)S[a*3+b]+=n[a]*n[b];}
    const {vals,vecs}=jacobiEig(S,3);const o=[0,1,2].sort((a,b)=>vals[a]-vals[b]);
    let u=[vecs[o[0]],vecs[3+o[0]],vecs[6+o[0]]];if(u[1]>0)u=u.map(x=>-x);
    if(vals[o[0]]<0.35*vals[o[1]]&&-u[1]>0.7){up=u;src='murs';}
  }
  const pf=fitPlane(fl,up,0.35,0.04,400);
  if(pf&&pf.count>300&&(src!=='murs'||pf.n[0]*up[0]+pf.n[1]*up[1]+pf.n[2]*up[2]>0.985)){up=pf.n;floorD=pf.d;src+='+sol';}
  else if(src!=='murs'){const pc=fitPlane(ce,up0.map(x=>-x),0.75,0.04,400);if(pc&&pc.count>150){up=pc.n.map(x=>-x);src='plafond';}}
  LOG('verticale par',src||'défaut','sol',pf&&pf.count,'up',up.map(x=>x.toFixed(2)).join(','));
  // hauteurs
  const H=new Float32Array(cl.n);for(let i=0;i<cl.n;i++)H[i]=up[0]*cl.P[i*3]+up[1]*cl.P[i*3+1]+up[2]*cl.P[i*3+2];
  let camH;
  if(floorD===null&&fl.length>80){const hs=fl.map(p=>up[0]*p[0]+up[1]*p[1]+up[2]*p[2]);floorD=median(hs);}
  if(floorD!==null){camH=-floorD;}
  else{const hs=[];for(let i=0;i<cl.n;i+=3)hs.push(H[i]);const lo=pct(hs,0.02);camH=-lo;notes.push('Sol peu visible : sa hauteur est estimée.');}
  for(let i=0;i<cl.n;i++)H[i]+=camH; // sol à 0
  // ---- axes horizontaux : « nord » = direction de départ de la caméra ----
  let north=[0,0,1];const dn=north[0]*up[0]+north[1]*up[1]+north[2]*up[2];north=norm(north.map((x,k)=>x-dn*up[k]));
  let east=cross(north,up);
  const XE=new Float32Array(cl.n),ZS=new Float32Array(cl.n);
  for(let i=0;i<cl.n;i++){const p=pt(i);XE[i]=p[0]*east[0]+p[1]*east[1]+p[2]*east[2];ZS[i]=-(p[0]*north[0]+p[1]*north[1]+p[2]*north[2]);}
  // ---- plafond (plat, un pan ou deux pans) ----
  const ceIdx=[];for(let i=0;i<cl.n;i++)if(CEIL.has(cl.LBL[i])&&H[i]>1.6)ceIdx.push(i);
  // ---- orientation des murs (Manhattan), par les normales ----
  const NX=new Float32Array(cl.n),NZ=new Float32Array(cl.n);
  for(let i=0;i<cl.n;i++){const n=[cl.N[i*3],cl.N[i*3+1],cl.N[i*3+2]];NX[i]=n[0]*east[0]+n[1]*east[1]+n[2]*east[2];NZ[i]=-(n[0]*north[0]+n[1]*north[1]+n[2]*north[2]);}
  const wl=[];for(let i=0;i<cl.n;i++)if((WALL.has(cl.LBL[i])||DOOR.has(cl.LBL[i])||WIND.has(cl.LBL[i])||cl.LBL[i]===109)&&H[i]>0.2&&Math.hypot(NX[i],NZ[i])>0.8)wl.push(i);
  let s4=0,c4=0;for(const i of wl){const a=Math.atan2(NZ[i],NX[i]);s4+=Math.sin(4*a);c4+=Math.cos(4*a);}
  const bestT=-Math.atan2(s4,c4)/4;
  {const c=Math.cos(bestT),s=Math.sin(bestT);for(let i=0;i<cl.n;i++){let x=c*XE[i]-s*ZS[i],z=s*XE[i]+c*ZS[i];XE[i]=x;ZS[i]=z;x=c*NX[i]-s*NZ[i];z=s*NX[i]+c*NZ[i];NX[i]=x;NZ[i]=z;}}
  LOG('points',cl.n,'murs',wl.length,'rotation des murs',(bestT*180/Math.PI).toFixed(1));
  // ---- position des 4 murs : chaque famille de murs par l'orientation de ses points ----
  const side=(axis,sign)=>{
    const A=axis==='x'?XE:ZS,NA=axis==='x'?NX:NZ;const h=new Map();let tot=0;
    for(const i of wl){if(Math.abs(NA[i])<0.85)continue;const v=A[i];if(v*sign<=0.2)continue;const b=Math.round(v/0.05);h.set(b,(h.get(b)||0)+1);tot++;}
    let bb=null,bc=0,mx=0;const sm=new Map();for(const [b] of h){const c3=(h.get(b)||0)+(h.get(b-1)||0)+(h.get(b+1)||0);sm.set(b,c3);mx=Math.max(mx,c3);}
    for(const [b,c3] of sm){if(c3>=mx*0.35&&(bb===null||b*sign>bb*sign)){bb=b;bc=c3;}}
    const all=[];for(let i=0;i<cl.n;i+=2){const v=A[i];if(v*sign>0)all.push(v*sign);}
    let far=all.length>50?pct(all,0.99)*sign:0.6*sign;
    if(Math.abs(far)<0.6)far=0.6*sign;
    const seen=bb!==null&&bc>=Math.max(40,wl.length*0.02);
    let pos=seen?bb*0.05:far;
    if(seen&&Math.abs(far)>Math.abs(pos)+0.25){/* points au-delà du mur : on garde le mur, ce sont des reflets ou des erreurs */}
    return {pos,seen,support:bc};
  };
  const W_=side('x',-1),E_=side('x',1),N_=side('z',-1),S_=side('z',1);
  LOG('murs O/E/N/S',[W_,E_,N_,S_].map(w=>w.pos.toFixed(2)+(w.seen?'':'?')+'('+w.support+')').join(' '));
  const cx=(W_.pos+E_.pos)/2,cz=(N_.pos+S_.pos)/2,width=E_.pos-W_.pos,depth=S_.pos-N_.pos;
  for(let i=0;i<cl.n;i++){XE[i]-=cx;ZS[i]-=cz;}
  const camX=-cx,camZ=-cz;
  // ---- plafond ----
  let wallH=2.5,ridge=2.5,ctype='flat',axis='z',hNote='';
  let ceil=null;
  if(ceIdx.length>150){
    const cs=ceIdx.length>3000?ceIdx.filter((_,k)=>k%Math.ceil(ceIdx.length/3000)===0):ceIdx;
    const hs=cs.map(i=>H[i]);const flat=median(hs);const madF=median(hs.map(h=>Math.abs(h-flat)));
    let best={mad:madF};
    // faîtage n'importe où, pente propre à chaque côté : h = R - sL·max(0,x0-a) - sR·max(0,a-x0)
    for(const ax of ['x','z']){
      const A=ax==='x'?XE:ZS,half=(ax==='x'?width:depth)/2;
      for(let x0=-half;x0<=half+1e-6;x0+=0.1){
        const M=new Float64Array(9),v=new Float64Array(3);
        for(const i of cs){const l=Math.max(0,x0-A[i]),r=Math.max(0,A[i]-x0),f=[1,-l,-r];for(let p=0;p<3;p++){v[p]+=f[p]*H[i];for(let q=0;q<3;q++)M[p*3+q]+=f[p]*f[q];}}
        const sol=solve3(M,v);if(!sol)continue;let [R,sL,sR]=sol;
        sL=Math.min(1.5,Math.max(0,sL));sR=Math.min(1.5,Math.max(0,sR));if(sL<0.05&&sR<0.05)continue;
        // R recalé une fois les pentes bornées
        R=median(cs.map(i=>H[i]+sL*Math.max(0,x0-A[i])+sR*Math.max(0,A[i]-x0)));
        const mad=median(cs.map(i=>Math.abs(H[i]-(R-sL*Math.max(0,x0-A[i])-sR*Math.max(0,A[i]-x0)))));
        if(mad<best.mad)best={mad,ax,x0,R,sL,sR,half};
      }
    }
    LOG('plafond : plat',madF.toFixed(3),'pentes',best.ax?best.mad.toFixed(3)+' '+best.ax+' x0='+best.x0.toFixed(1)+' sL='+best.sL.toFixed(2)+' sR='+best.sR.toFixed(2):'—');
    if(best.ax&&best.mad<madF*0.8&&madF-best.mad>0.015){
      const hL=best.R-best.sL*(best.x0+best.half),hR=best.R-best.sR*(best.half-best.x0);
      ceil={type:'tent',axis:best.ax,x0:+best.x0.toFixed(2),R:+best.R.toFixed(2),sL:+best.sL.toFixed(3),sR:+best.sR.toFixed(3)};
      ctype='tent';ridge=best.R;wallH=Math.min(hL,hR);
    }else{wallH=ridge=flat;}
    LOG('plafond',ctype,'murs',wallH.toFixed(2),'faîtage',ridge.toFixed(2));
  }else{
    const hs=[];for(const i of wl)hs.push(H[i]);const top=pct(hs,0.99);
    if(top>2.2){wallH=ridge=top;hNote='Plafond peu visible : hauteur tirée du haut des murs.';}
    else{hNote='Plafond non visible : hauteur supposée de 2,50 m.';}
  }
  if(hNote)notes.push(hNote);
  wallH=Math.max(1.9,Math.min(8,wallH));ridge=Math.max(wallH,Math.min(10,ridge));
  const ceilAt=(x,z)=>{if(!ceil)return wallH;const a=ceil.axis==='x'?x:z;return Math.max(wallH,ceil.R-ceil.sL*Math.max(0,ceil.x0-a)-ceil.sR*Math.max(0,a-ceil.x0));};
  // ---- couleurs : la vidéo est souvent sous-exposée ; murs et plafond servent de référence ----
  {const lum=[];for(let i=0;i<cl.n;i++)if(WALL.has(cl.LBL[i])||CEIL.has(cl.LBL[i]))lum.push(0.3*cl.COL[i*3]+0.59*cl.COL[i*3+1]+0.11*cl.COL[i*3+2]);
   const ref=lum.length>200?pct(lum,0.9):0;expo=ref>40?Math.min(1.7,Math.max(1,225/ref)):1;LOG('exposition',expo.toFixed(2));}
  // ---- couleurs ----
  const wallCol=medColor(cl,wl)||'#e8e4dc';
  const flIdx=[];for(let i=0;i<cl.n;i++)if(FLOOR.has(cl.LBL[i]))flIdx.push(i);
  const floorCol=medColor(cl,flIdx)||'#c8c0b0';const ceilCol=medColor(cl,ceIdx)||'#f0eee8';
  const fl2=new Map();for(const i of flIdx)fl2.set(cl.LBL[i],(fl2.get(cl.LBL[i])||0)+1);
  let flLab=0,flc=0;for(const [k,c] of fl2)if(c>flc){flc=c;flLab=k;}
  const pattern=flc>=0.6*flIdx.length?({117:'tiles',118:'wood',200:'carpet',131:'carpet',116:'tiles',114:'tiles'}[flLab]||'plain'):'plain';
  // ---- ouvertures ----
  const walls={west:{seen:W_.seen,dist:i=>XE[i]+width/2,along:i=>ZS[i]},east:{seen:E_.seen,dist:i=>width/2-XE[i],along:i=>ZS[i]},
               north:{seen:N_.seen,dist:i=>ZS[i]+depth/2,along:i=>XE[i]},south:{seen:S_.seen,dist:i=>depth/2-ZS[i],along:i=>XE[i]}};
  const openings=[];
  for(const [type,set] of [['door',DOOR],['window',WIND]]){
    const idx=[];for(let i=0;i<cl.n;i++)if(set.has(cl.LBL[i]))idx.push(i);
    LOG('ouvertures',type,idx.length,Object.keys(walls).map(wn=>wn+':'+idx.filter(i=>Math.abs(walls[wn].dist(i))<0.4).length).join(' '));
    for(const wn in walls){
      const w=walls[wn];const pts=idx.filter(i=>Math.abs(w.dist(i))<0.4).map(i=>[w.along(i),H[i],i]);if(pts.length<25)continue;
      pts.sort((a,b)=>a[0]-b[0]);
      let grp=[pts[0]];const groups=[];
      for(let k=1;k<pts.length;k++){if(pts[k][0]-pts[k-1][0]>0.35){groups.push(grp);grp=[];}grp.push(pts[k]);}
      groups.push(grp);
      for(const g of groups){if(g.length<20)continue;
        const al=g.map(p=>p[0]),hs=g.map(p=>p[1]);const a0=pct(al,0.04),a1=pct(al,0.96),h0=pct(hs,0.04),h1=pct(hs,0.96);
        if(a1-a0<0.35||h1-h0<0.4)continue;
        const o={type,wall:wn,along:+((a0+a1)/2).toFixed(2),width:+(a1-a0).toFixed(2),label:type==='door'?'Porte':'Fenêtre'};
        if(type==='door'){o.height=+Math.min(wallH,Math.max(1.8,h1)).toFixed(2);o.color=medColor(cl,g.map(p=>p[2]));}
        else{o.sill=+Math.max(0,h0).toFixed(2);o.height=+Math.min(wallH-o.sill,h1-h0).toFixed(2);}
        if(!w.seen)w.seen=true;
        openings.push(o);
      }
    }
  }
  // ---- objets ----
  const segs=new Map();
  for(let i=0;i<cl.n;i++){const sg=cl.SEG[i];if(sg<0||!OBJ[cl.LBL[i]])continue;let s=segs.get(sg);if(!s){s={lab:cl.LBL[i],idx:[]};segs.set(sg,s);}s.idx.push(i);}
  const boxOf=idx=>{const xs=idx.map(i=>XE[i]),zs=idx.map(i=>ZS[i]),hs=idx.map(i=>H[i]);
    return {x0:pct(xs,0.1),x1:pct(xs,0.9),z0:pct(zs,0.1),z1:pct(zs,0.9),y0:pct(hs,0.03),y1:pct(hs,0.97)};};
  let cands=[];
  for(const [sg,s] of segs){
    if(s.idx.length<25)continue;
    // on garde le cœur du segment (le masque déborde sur ce qui est derrière)
    const mx=median(s.idx.map(i=>XE[i])),mz=median(s.idx.map(i=>ZS[i]));
    const dd=s.idx.map(i=>Math.hypot(XE[i]-mx,ZS[i]-mz));const md=median(dd);
    const core=s.idx.filter((i,k)=>dd[k]<=Math.max(0.35,2.2*md));
    if(core.length<25)continue;
    cands.push({type:OBJ[s.lab][0],lab:s.lab,idx:core,b:boxOf(core)});
  }
  // fusion des vues d'un même objet (même type, emprises qui se chevauchent)
  const ov=(a,b)=>{const ix=Math.max(0,Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0)),iz=Math.max(0,Math.min(a.z1,b.z1)-Math.max(a.z0,b.z0));
    const A=Math.max(0.01,(a.x1-a.x0)*(a.z1-a.z0)),B=Math.max(0.01,(b.x1-b.x0)*(b.z1-b.z0));return ix*iz/Math.min(A,B);};
  let merged=true;
  while(merged){merged=false;
    outer:for(let a=0;a<cands.length;a++)for(let b=a+1;b<cands.length;b++){
      const A=cands[a],B=cands[b];if(A.type!==B.type)continue;
      const cA=[(A.b.x0+A.b.x1)/2,(A.b.z0+A.b.z1)/2],cB=[(B.b.x0+B.b.x1)/2,(B.b.z0+B.b.z1)/2];
      if(ov(A.b,B.b)>0.5||Math.hypot(cA[0]-cB[0],cA[1]-cB[1])<0.25){
        A.idx=A.idx.concat(B.idx);A.b=boxOf(A.idx);cands.splice(b,1);merged=true;break outer;}
    }
  }
  const objects=[];let nearCam=0;
  for(const c of cands){
    const [type,name,minT]=OBJ[c.lab];const b=c.b;
    if(c.idx.length<40)continue;
    let x0=b.x0,x1=b.x1,z0=b.z0,z1=b.z1,y0=b.y0,y1=b.y1;
    if(y1-y0<0.04)continue;
    const onFloor=['bed','sofa','chair','table','desk','fridge','cabinet','toilet','oven','shelf','plant'].includes(type);
    // ce qui est sous l'appareil (la personne qui filme, son lit, son siège) n'est pas reconstruit
    if(Math.hypot((x0+x1)/2-camX,(z0+z1)/2-camZ)<0.95&&y1<camH+0.2){nearCam++;continue;}
    if(type==='oven'&&y0>0.35){c.type2='microwave';}
    if(type==='bed'&&y0<=1.0){ // lit vu en partie : complété à 0,90 × 1,90 m, tête de lit du côté vu
      y0=0;y1=Math.min(Math.max(y1,0.45),0.65);
      const vx=(x0+x1)/2-camX,vz=(z0+z1)/2-camZ;
      if(Math.abs(vz)>=Math.abs(vx)){const cxb=(x0+x1)/2;x0=cxb-Math.max(0.45,(x1-x0)/2);x1=cxb+Math.max(0.45,(x1-x0)/2);
        if(vz<0){z1=Math.max(z1,z0+0.15);z0=Math.min(z0,z1-1.9);c.rot=180;}else{z0=Math.min(z0,z1-0.15);z1=Math.max(z1,z0+1.9);c.rot=0;}}
      else{const czb=(z0+z1)/2;z0=czb-Math.max(0.45,(z1-z0)/2);z1=czb+Math.max(0.45,(z1-z0)/2);
        if(vx<0){x0=Math.min(x0,x1-1.9);c.rot=-90;}else{x1=Math.max(x1,x0+1.9);c.rot=90;}}
    }
    if(type==='sofa'&&y0<=0.7)y0=0; // on ne voit que le dessus : il repose au sol
    if(onFloor&&y0>0.35)continue;            // « posé au sol » mais flottant : fausse détection
    if(type==='ceiling_light'){ // lumière : seulement ce qui est au plafond, à sa taille
      const top=c.idx.filter(i=>H[i]>wallH*0.75);if(top.length<12)continue;
      const xs=top.map(i=>XE[i]),zs=top.map(i=>ZS[i]);let lx=pct(xs,0.15),hx=pct(xs,0.85),lz=pct(zs,0.15),hz=pct(zs,0.85);
      let lw=Math.min(1.4,Math.max(0.2,hx-lx)),ld=Math.min(1.4,Math.max(0.2,hz-lz));if(lw>0.5&&ld>0.5){if(lw>=ld)ld=0.25;else lw=0.25;}
      objects.push({n:top.length,cls:'F06.electricite_et_eclairage.plafonniers',type:'ceiling_light',label:'Lumière',x:+((lx+hx)/2).toFixed(2),z:+((lz+hz)/2).toFixed(2),y:+(median(top.map(i=>H[i]))-0.06).toFixed(2),w:+lw.toFixed(2),d:+ld.toFixed(2),h:0.07,rotation:0,color:'#f2f2f2'});continue;}
    if(Math.max(x1-x0,z1-z0)>Math.max(width,depth)*0.6&&type!=='curtain')continue;
    if(y0<0.25&&type!=='ceiling_light')y0=0;
    // face vue seulement : on prolonge vers l'arrière jusqu'à l'épaisseur minimale
    const mx=(x0+x1)/2-camX,mz=(z0+z1)/2-camZ;
    if(Math.abs(mx)>Math.abs(mz)){if(x1-x0<minT){if(mx>0)x1=x0+minT;else x0=x1-minT;}}
    else{if(z1-z0<minT){if(mz>0)z1=z0+minT;else z0=z1-minT;}}
    // dans la pièce
    x0=Math.max(-width/2,x0);x1=Math.min(width/2,x1);z0=Math.max(-depth/2,z0);z1=Math.min(depth/2,z1);
    if(x1-x0<0.05||z1-z0<0.03)continue;
    if(type==='curtain'&&(y1-y0<0.8||y0>1.6))continue; // un rideau descend bas
    if(type==='curtain'){ // un rideau pend contre un mur
      const c0=(x0+x1)/2,c1=(z0+z1)/2;const dl={west:c0+width/2,east:width/2-c0,north:c1+depth/2,south:depth/2-c1};
      const wn=Object.keys(dl).sort((a,b)=>dl[a]-dl[b])[0];
      if(dl[wn]<1.2){if(wn==='west'){x0=-width/2+0.02;x1=x0+0.12;}else if(wn==='east'){x1=width/2-0.02;x0=x1-0.12;}
        else if(wn==='north'){z0=-depth/2+0.02;z1=z0+0.12;}else{z1=depth/2-0.02;z0=z1-0.12;}}
    }
    let w=x1-x0,d=z1-z0,rot=0;const cxo=(x0+x1)/2,czo=(z0+z1)/2;
    // orientation : dos vers le mur le plus proche
    const dW=cxo+width/2,dE=width/2-cxo,dN=czo+depth/2,dS=depth/2-czo;const mn=Math.min(dW,dE,dN,dS);
    const back=mn===dN?'north':mn===dS?'south':mn===dW?'west':'east';
    if(type==='bed'){ // tête de lit : du côté vu (lit complété) sinon contre le mur au bout du grand côté
      if(c.rot!==undefined){rot=c.rot;if(rot===90||rot===-90)[w,d]=[d,w];}
      else if(w>d){rot=dW<dE?90:-90;[w,d]=[d,w];}else{rot=dN<dS?0:180;}
    }else if(['fridge','cabinet','wardrobe','tv','sofa','shelf','microwave','oven','sink','toilet','mirror','curtain'].includes(type)){
      rot={north:0,south:180,west:90,east:-90}[back];if(rot===90||rot===-90)[w,d]=[d,w];
    }
    let t2=c.type2||type;if(type==='ceiling_light'&&y0<wallH-0.8)t2='lamp';
    objects.push({n:c.idx.length,cls:(OBJ[c.lab]&&OBJ[c.lab].tax)||null,cmp:type==='bed'&&c.rot!==undefined?1:0,type:t2,label:c.type2?'Micro-ondes / four':name,x:+cxo.toFixed(2),z:+czo.toFixed(2),y:+y0.toFixed(2),w:+w.toFixed(2),d:+d.toFixed(2),h:+(y1-y0).toFixed(2),rotation:rot,color:medColor(cl,c.idx)});
  }
  // repères de taille connue (posés au sol) : hauteur observée → hauteur standard
  const REF=Object.assign({table:[0.75,'table'],desk:[0.75,'bureau'],chair:[0.88,'chaise'],sofa:[0.85,'canapé'],sink:[0.85,'lavabo']},TREF);
  const refs=[];
  for(const o of objects){const r=REF[o.type];if(r&&o.y<0.05&&o.h>0.15)refs.push({k:r[0]/o.h,name:r[1]});}
  for(const o of openings)if(o.type==='door'&&o.height>1)refs.push({k:2.04/o.height,name:'porte'});
  if(window.__vdebug)window.__dbg={XE:Array.from(XE),ZS:Array.from(ZS),H:Array.from(H),cam:[camX,camZ,camH]};
  // poteaux : une colonne de points continue du sol au plafond, loin des murs (le modèle de reconnaissance ne les connaît pas)
  {const cell=0.1,h0=0.3,h1=wallH-0.15,nb=Math.max(4,Math.floor((h1-h0)/0.25)),g=new Map();
   for(let i=0;i<cl.n;i++){const h=H[i];if(h<h0||h>h1)continue;const x=XE[i],z=ZS[i];if(Math.abs(x)>width/2-0.35||Math.abs(z)>depth/2-0.35)continue;
     const k=Math.round(x/cell)+','+Math.round(z/cell);let c=g.get(k);if(!c){c={b:new Set(),idx:[]};g.set(k,c);}c.b.add(Math.min(nb-1,Math.floor((h-h0)/(h1-h0)*nb)));c.idx.push(i);}
   const col=new Map([...g].filter(([k,c])=>c.b.size>=Math.ceil(nb*0.8)));const done=new Set();
   for(const k0 of col.keys()){if(done.has(k0))continue;const q=[k0],cells=[];done.add(k0);
     while(q.length){const k=q.pop();cells.push(k);const [a,b]=k.split(',').map(Number);for(const [da,db] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const kk=(a+da)+','+(b+db);if(col.has(kk)&&!done.has(kk)){done.add(kk);q.push(kk);}}}
     const xs=cells.map(k=>+k.split(',')[0]*cell),zs=cells.map(k=>+k.split(',')[1]*cell),ex=Math.max(...xs)-Math.min(...xs)+cell,ez=Math.max(...zs)-Math.min(...zs)+cell;
     if(cells.length<2||ex>0.8||ez>0.8)continue;const cxp=(Math.max(...xs)+Math.min(...xs))/2,czp=(Math.max(...zs)+Math.min(...zs))/2;
     if(Math.hypot(cxp-camX,czp-camZ)<0.8)continue;
     const idx=[].concat(...cells.map(k=>col.get(k).idx));
     objects.push({n:idx.length,cls:'F01.structure.poteaux',type:'pillar',label:'Poteau',x:+cxp.toFixed(2),z:+czp.toFixed(2),y:0,w:+Math.max(0.2,ex).toFixed(2),d:+Math.max(0.2,ez).toFixed(2),h:+ceilAt(cxp,czp).toFixed(2),rotation:0,color:medColor(cl,idx)});
     LOG('poteau',cxp.toFixed(2),czp.toFixed(2),ex.toFixed(2),ez.toFixed(2));}}
  // un même objet complété depuis plusieurs vues : on garde le plus vu
  for(let a=0;a<objects.length;a++)for(let b=objects.length-1;b>a;b--){
    const A=objects[a],B=objects[b];if(A.type!==B.type)continue;
    const ext=o=>{const r=o.rotation===90||o.rotation===-90;const w=r?o.d:o.w,d=r?o.w:o.d;return {x0:o.x-w/2,x1:o.x+w/2,z0:o.z-d/2,z1:o.z+d/2};};
    if(ov(ext(A),ext(B))>0.3){if((B.n||0)>(A.n||0))objects[a]=B;objects.splice(b,1);}
  }
  objects.forEach(o=>delete o.n);
  if(nearCam)notes.push('Ce qui est juste sous l\'appareil (toi, ton lit) n\'est pas reconstruit.');
  const unseen=['west','east','north','south'].filter(k=>!walls[k].seen).map(k=>({west:'gauche',east:'droit',north:'du fond',south:'derrière toi'})[k]);
  if(unseen.length)notes.push('Mur'+(unseen.length>1?'s':'')+' non vu'+(unseen.length>1?'s':'')+' : '+unseen.join(', ')+'.');
  return {
    room:{width:+width.toFixed(2),depth:+depth.toFixed(2),wallHeight:+wallH.toFixed(2),ceiling:Object.assign({type:ctype,ridgeHeight:+ridge.toFixed(2)},ceil||{}),
      wallColor:wallCol,ceilingColor:ceilCol,floor:{color:floorCol,pattern,tileSize:0.3},
      seen:{west:walls.west.seen,east:walls.east.seen,north:walls.north.seen,south:walls.south.seen}},
    camera:{x:+camX.toFixed(2),z:+camZ.toFixed(2),y:+camH.toFixed(2)},
    xf:{up,east,north,t:bestT,cx,cz,camH},
    openings,objects,notes,refs
  };
}


/* ---------- bibliothèque de l'œil 3D (lib/oeil/taxonomie.json) : classes, formes, poses, repères de taille ---------- */
let TAX=null,CLS={};const TREF={};
async function taxLoad(){if(TAX)return TAX;try{const r=await fetch('lib/oeil/taxonomie.json');if(r.ok)TAX=await r.json()}catch(e){}
  if(!TAX)return null;
  for(const f of TAX.familles)for(const c of f.categories)for(const x of c.classes){CLS[x.id]=x;
    const shape=x.sk&&!['floor','wall','ceiling','window','door','defect','plate','stairs'].includes(x.sk);
    if(shape&&x.detr)for(const id of x.detr)if(!OBJ[id]||!OBJ[id].tax)OBJ[id]=Object.assign([x.sk,x.lab||x.nom,x.minT||(x.dim&&x.dim[1])||0.3],{tax:x.id});
    if(x.ref&&x.ref.h&&!x.ref.mesure&&x.pose==='sol'&&x.sk&&!TREF[x.sk])TREF[x.sk]=[x.ref.h,(x.lab||x.nom).toLowerCase()];}
  return TAX}
/* ---------- modèles : séances de casô (empreinte vérifiée, travail en arrière-plan) ---------- */
async function runDepth(key){
  const V=await v2Sess('depm');if(!V)throw new Error('profondeur');
  const s=518/Math.max(key.w,key.h);
  const W=Math.max(140,Math.round(key.w*s/14)*14),H=Math.max(140,Math.round(key.h*s/14)*14);
  const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(canvasOf(key.img),0,0,W,H);
  const d=x.getImageData(0,0,W,H).data,t=new Float32Array(3*W*H);
  for(let i=0;i<W*H;i++)for(let ch=0;ch<3;ch++)t[ch*W*H+i]=(d[i*4+ch]/255-MEAN[ch])/STD[ch];
  const o=await V.run({pixel_values:{t:'float32',d:t,s:[1,3,H,W]}},['depth']);
  const D=o.depth.d,sx=W/key.w,sy=H/key.h;
  return (u,v)=>{const xi=Math.min(W-1,Math.max(0,Math.round(u*sx))),yi=Math.min(H-1,Math.max(0,Math.round(v*sy)));return D[yi*W+xi];};
}
async function runDetr(key){
  const V=await v2Sess('detr');if(!V)throw new Error('detr');
  // grand côté 608 (au-delà de 640, les masques du modèle exporté ne sont plus justes ; à 512, les fenêtres échappent), côtés multiples de 32
  const s=608/Math.max(key.w,key.h),w=Math.max(32,Math.round(key.w*s/32)*32),h=Math.max(32,Math.round(key.h*s/32)*32);
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(canvasOf(key.img),0,0,w,h);
  const d=x.getImageData(0,0,w,h).data,t=new Float32Array(3*w*h);
  for(let i=0;i<w*h;i++)for(let ch=0;ch<3;ch++)t[ch*w*h+i]=(d[i*4+ch]/255-MEAN[ch])/STD[ch];
  const out=await V.run({pixel_values:{t:'float32',d:t,s:[1,3,h,w]},pixel_mask:{t:'int64',d:new BigInt64Array(4096).fill(1n),s:[1,64,64]}},['logits','pred_masks']);
  const lg=out.logits.d,NQ=out.logits.s[1],NC=out.logits.s[2],mk=out.pred_masks.d,mh=out.pred_masks.s[2],mw=out.pred_masks.s[3];
  const keep=[];
  for(let q=0;q<NQ;q++){
    let mx=-Infinity;for(let c2=0;c2<NC;c2++)mx=Math.max(mx,lg[q*NC+c2]);
    let sum=0;const p=new Float32Array(NC);for(let c2=0;c2<NC;c2++){p[c2]=Math.exp(lg[q*NC+c2]-mx);sum+=p[c2];}
    let bl=0;for(let c2=1;c2<NC-1;c2++)if(p[c2]>p[bl])bl=c2;
    const sc=p[bl]/sum;if(bl===0||sc<(bl<92?0.7:0.5))continue;keep.push({q,label:bl,score:sc});
  }
  const seg=new Int16Array(mw*mh).fill(-1);
  for(let i=0;i<mw*mh;i++){let best=-1,bv=0.25;for(let k=0;k<keep.length;k++){const m=1/(1+Math.exp(-mk[keep[k].q*mw*mh+i]));const v2=m*keep[k].score;if(m>0.5&&v2>bv){bv=v2;best=k;}}seg[i]=best;}
  return {keep,get:(u,v)=>{const xi=Math.min(mw-1,Math.max(0,Math.floor(u/key.w*mw))),yi=Math.min(mh-1,Math.max(0,Math.floor(v/key.h*mh)));const k=seg[yi*mw+xi];return k<0?[0,-1]:[keep[k].label,k];}};
}

/* ---------- pièce → murs de la Rénovation : meilleure image de la vidéo, 4 coins reprojetés, longueur mesurée ---------- */
function mkToWorld(spec){const X=spec.xf,c=Math.cos(X.t),s=Math.sin(X.t);
  return (x,y,z)=>{const x0=x+X.cx,z0=z+X.cz,xe=c*x0+s*z0,zs=-s*x0+c*z0,yy=y-X.camH;
    return [X.east[0]*xe+X.up[0]*yy-X.north[0]*zs,X.east[1]*xe+X.up[1]*yy-X.north[1]*zs,X.east[2]*xe+X.up[2]*yy-X.north[2]*zs];};}
function wallsFor(spec,keys,fR){
  const r=spec.room,W=r.width,D=r.depth,H=r.wallHeight,toWorld=mkToWorld(spec);
  // chaque mur vu de l'intérieur : coin gauche puis coin droit (au sol)
  const ends={north:[[-W/2,-D/2],[W/2,-D/2]],east:[[W/2,-D/2],[W/2,D/2]],south:[[W/2,D/2],[-W/2,D/2]],west:[[-W/2,D/2],[-W/2,-D/2]]};
  const order=['west','north','east','south'].filter(k=>r.seen[k]);
  // ordre de la vidéo : on tourne vers la droite ; la suite commence après le mur non vu
  let st=0;for(let i=0;i<order.length;i++){const a=['west','north','east','south'],ia=a.indexOf(order[i]),ip=a.indexOf(order[(i+order.length-1)%order.length]);if((ip+1)%4!==ia){st=i;break;}}
  const seq=order.slice(st).concat(order.slice(0,st));
  const out=[];
  for(const k of seq){
    const [A,B]=ends[k],L=Math.hypot(B[0]-A[0],B[1]-A[1]);
    const corners=[[A[0],H,A[1]],[B[0],H,B[1]],[B[0],0,B[1]],[A[0],0,A[1]]].map(p=>toWorld(...p));
    let best=null;
    keys.forEach((key,ki)=>{
      const f=fR*Math.max(key.w,key.h),C=key.C;
      const proj=P=>{const q=[C[0]*P[0]+C[1]*P[1]+C[2]*P[2],C[3]*P[0]+C[4]*P[1]+C[5]*P[2],C[6]*P[0]+C[7]*P[1]+C[8]*P[2]];return q[2]>0.15?[f*q[0]/q[2]+key.w/2,f*q[1]/q[2]+key.h/2]:null;};
      const q=corners.map(proj);if(q.some(p=>!p))return;
      let inn=0,tot=0;for(let i=0;i<=8;i++)for(let j=0;j<=4;j++){const x=A[0]+(B[0]-A[0])*i/8,z=A[1]+(B[1]-A[1])*i/8,p=proj(toWorld(x,H*j/4,z));tot++;if(p&&p[0]>=0&&p[1]>=0&&p[0]<key.w&&p[1]<key.h)inn++;}
      const fr=inn/tot,cxq=(q[0][0]+q[1][0]+q[2][0]+q[3][0])/4/key.w-0.5,sc=fr-0.4*Math.abs(cxq);
      if(fr>=0.2&&(!best||sc>best.sc))best={sc,ki,q};
    });
    if(best){out.push({k,L,ki:best.ki,q:best.q});LOG('mur',k,L.toFixed(2),'image',best.ki,'score',best.sc.toFixed(2));}
  }
  return out;
}

/* ---------- écran de calcul : la pièce apparaît en nuage de points (façon LiDAR), toutes les étapes affichées ---------- */
// écran de chargement de casô (#busy) : le logo animé et l'étape en cours, une seule à la fois ; le nuage en fond, discret
const OV={el:null};
function ovOpen(){ovClose();busy(true,'vst_read');const bl=document.getElementById('busy-l');if(bl){OV.blv=bl.style.display;bl.style.display='none';}OV.el=true;}
function ovClose(){if(!OV.el)return;OV.el=null;const bl=document.getElementById('busy-l');if(bl)bl.style.display=OV.blv||'';}
function ovStep(k,v){busyStep(k,v);}
function ovDone(txt){ovClose();try{busy(false)}catch(e){}if(txt)try{toast(txt)}catch(e){}}
function ovFail(msg){ovClose();try{busy(false)}catch(e){}try{toast(msg)}catch(e){}}
// points : monde de la 1re image clé (y vers le bas) ; couleur selon la hauteur, du bleu (sol) au rouge (plafond)
function ovAdd(P,n){for(let i=0;i<n;i++)OV.pts.push(P[i*3],P[i*3+1],P[i*3+2]);ovRange();}
function ovRange(){const p=OV.pts,n=p.length/3;if(!n)return;const hs=[],c=[0,0,0],st=Math.max(1,Math.floor(n/3000));
  for(let i=0;i<n;i+=st){const h=OV.up[0]*p[i*3]+OV.up[1]*p[i*3+1]+OV.up[2]*p[i*3+2]+OV.camH;hs.push(h);c[0]+=p[i*3];c[1]+=p[i*3+1];c[2]+=p[i*3+2];}
  const m=hs.length;OV.c=c.map(x=>x/m);OV.h0=pct(hs,0.03);OV.h1=pct(hs,0.97);let r=0;for(let i=0;i<n;i+=st)r=Math.max(r,Math.hypot(p[i*3]-OV.c[0],p[i*3+1]-OV.c[1],p[i*3+2]-OV.c[2]));OV.r=Math.min(r,9);}
function hcol(t2){const h=0.68*(1-Math.max(0,Math.min(1,t2))),f=(n)=>{const k=(n+h*12)%12;return 0.5-0.5*Math.max(-1,Math.min(k-3,9-k,1));};return [f(0)*255,f(8)*255,f(4)*255];}
function ovDraw(){
  const cv=OV.cv,dpr=Math.min(2,window.devicePixelRatio||1),W=Math.round(cv.clientWidth*dpr),H=Math.round(cv.clientHeight*dpr);if(!W||!H)return;
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;OV.img=null;}
  const x=cv.getContext('2d');if(!OV.img){OV.img=x.createImageData(W,H);OV.zb=new Float32Array(W*H);}
  const d=OV.img.data,zb=OV.zb;d.fill(0);zb.fill(1e9);
  const p=OV.pts,n=p.length/3;OV.yaw+=0.0035;
  if(n&&OV.c){
    const u=OV.up,a=Math.abs(u[0])<0.9?[1,0,0]:[0,0,1],e1=norm(cross(u,a)),e2=cross(u,e1);
    const fw=[0,1,2].map(k=>Math.cos(OV.yaw)*e1[k]+Math.sin(OV.yaw)*e2[k]),dist=OV.r*1.9+1;
    const cp=[0,1,2].map(k=>OV.c[k]-fw[k]*dist*0.8+u[k]*dist*0.5),fz=norm([0,1,2].map(k=>OV.c[k]-cp[k])),rx=norm(cross(fz,u)),uy=cross(rx,fz),F=Math.min(W,H)*0.95;
    OV.proj=(q)=>{const dx=q[0]-cp[0],dy=q[1]-cp[1],dz=q[2]-cp[2],z=dx*fz[0]+dy*fz[1]+dz*fz[2];if(z<0.1)return null;
      return [W/2+F*(dx*rx[0]+dy*rx[1]+dz*rx[2])/z,H/2-F*(dx*uy[0]+dy*uy[1]+dz*uy[2])/z,z];};
    const st=Math.max(1,Math.floor(n/45000)),s2=dpr>1.5?2:1,dh=Math.max(0.3,OV.h1-OV.h0);
    for(let i=0;i<n;i+=st){const q=OV.proj([p[i*3],p[i*3+1],p[i*3+2]]);if(!q)continue;const X=q[0]|0,Y=q[1]|0;if(X<0||Y<0||X>=W-s2||Y>=H-s2)continue;
      const h=u[0]*p[i*3]+u[1]*p[i*3+1]+u[2]*p[i*3+2]+OV.camH,c=hcol((h-OV.h0)/dh);
      for(let yy=0;yy<s2;yy++)for(let xx=0;xx<s2;xx++){const o=(Y+yy)*W+X+xx;if(q[2]<zb[o]){zb[o]=q[2];d[o*4]=c[0];d[o*4+1]=c[1];d[o*4+2]=c[2];d[o*4+3]=255;}}}
  }
  x.putImageData(OV.img,0,0);
  // murs et ouvertures reconnus, en jaune casô
  if(OV.wire&&OV.proj){x.lineWidth=2*dpr;for(const [a2,b2,col,dash] of OV.wire){const A=OV.proj(a2),B=OV.proj(b2);if(!A||!B)continue;x.strokeStyle=col;x.setLineDash(dash?[6*dpr,6*dpr]:[]);x.beginPath();x.moveTo(A[0],A[1]);x.lineTo(B[0],B[1]);x.stroke();}x.setLineDash([]);}
}
function ovRoom(cl,spec){
  const P=cl.P,n=cl.n,st=Math.max(1,Math.floor(n/60000));OV.pts=[];for(let i=0;i<n;i+=st)OV.pts.push(P[i*3],P[i*3+1],P[i*3+2]);
  OV.up=spec.xf.up;OV.camH=spec.xf.camH;ovRange();
  const r=spec.room,W=r.width,D=r.depth,H=r.wallHeight,tw=mkToWorld(spec),Y='#ffc21a',G='#8b95a3',L=[];
  const cor=[[-W/2,-D/2],[W/2,-D/2],[W/2,D/2],[-W/2,D/2]],side=['north','east','south','west'];
  for(let i=0;i<4;i++){const a=cor[i],b=cor[(i+1)%4],seen=r.seen[side[i]];
    L.push([tw(a[0],0,a[1]),tw(b[0],0,b[1]),seen?Y:G,!seen],[tw(a[0],H,a[1]),tw(b[0],H,b[1]),seen?Y:G,!seen],[tw(a[0],0,a[1]),tw(a[0],H,a[1]),Y,false]);}
  for(const o of spec.openings){const w0=o.width/2,s0=o.type==='door'?0:(o.sill||0),h1=s0+(o.height||1);let A,B;
    if(o.wall==='north'){A=[o.along-w0,-D/2];B=[o.along+w0,-D/2];}else if(o.wall==='south'){A=[o.along-w0,D/2];B=[o.along+w0,D/2];}
    else if(o.wall==='west'){A=[-W/2,o.along-w0];B=[-W/2,o.along+w0];}else{A=[W/2,o.along-w0];B=[W/2,o.along+w0];}
    const q=[tw(A[0],s0,A[1]),tw(B[0],s0,B[1]),tw(B[0],h1,B[1]),tw(A[0],h1,A[1])];for(let k=0;k<4;k++)L.push([q[k],q[(k+1)%4],'#ffffff',false]);}
  OV.wire=L;
}
function ovPreview(key,fR){ // points d'une vue dès que sa profondeur est connue
  const f=fR*Math.max(key.w,key.h),C=key.C,stp=Math.max(4,Math.round(Math.max(key.w,key.h)/110)),out=[];
  for(let v=stp;v<key.h-stp;v+=stp)for(let u=stp;u<key.w-stp;u+=stp){const z=key.depth(u,v);if(!(z>0.25&&z<12))continue;const X=(u-key.w/2)/f*z,Yc=(v-key.h/2)/f*z;
    out.push(C[0]*X+C[3]*Yc+C[6]*z,C[1]*X+C[4]*Yc+C[7]*z,C[2]*X+C[5]*Yc+C[8]*z);}
  ovAdd(out,out.length/3);
}


/* ---------- œil 3D : ce que la base d'apprentissage garde de chaque élément ---------- */
function oeilEnrich(spec,tr,oe){
  const R=spec.room,W=R.width,D=R.depth,tw=mkToWorld(spec),objs=spec.objects;
  // corrections apprises : classes rejetées à répétition, tailles corrigées
  if(oe&&oe.ex&&oe.ex.length){const by={};for(const e of oe.ex){(by[e.cls]=by[e.cls]||[]).push(e)}
    for(let i=objs.length-1;i>=0;i--){const o=objs[i],L=by[o.cls];if(!L)continue;const del=L.filter(e=>e.t==='del').length,made=(oe.n&&oe.n[o.cls])||0;
      if(del>=3&&made>0&&del/made>=0.6){spec.notes.push((o.label||'Élément')+' écarté : supprimé à chaque fois lors des corrections précédentes.');objs.splice(i,1);continue}
      const sz=L.filter(e=>e.t==='size'&&e.r);if(sz.length>=2){const m=k=>median(sz.map(e=>e.r[k]));o.w=+(o.w*m(0)).toFixed(2);o.d=+(o.d*m(1)).toFixed(2);o.h=+(o.h*m(2)).toFixed(2);o.appris=sz.length}}}
  const scaled=spec.notes.some(n=>/Échelle calée/.test(n));
  objs.forEach((o,i)=>{
    o.id='v'+String(i+1).padStart(2,'0')+'_'+(o.cls?o.cls.split('.').pop():o.type);
    const conf=Math.min(0.95,0.25+Math.log10(Math.max(10,o.n||10))/5)*(scaled?1:0.8),meth=scaled?'profondeur (modèle) + échelle par repères de taille':'profondeur (modèle) seule';
    const M=(v,st)=>({v:+(+v).toFixed(2),u:'m',methode:meth,confiance:+conf.toFixed(2),statut:st||'estimee'});
    o.mes={largeur:M(o.w,o.cmp?'supposee':''),profondeur:M(o.d,o.cmp?'supposee':''),hauteur:M(o.h),hauteur_pose:M(o.y||0)};
    if(o.appris)o.mes.correction={exemples:o.appris,statut:'appris'};
  });
  // relations spatiales (graphe de scène)
  const box=o=>{const r=o.rotation===90||o.rotation===-90,w=r?o.d:o.w,d=r?o.w:o.d;return{x0:o.x-w/2,x1:o.x+w/2,z0:o.z-d/2,z1:o.z+d/2,y0:o.y||0,y1:(o.y||0)+o.h}};
  const ovl=(a,b)=>Math.max(0,Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0))*Math.max(0,Math.min(a.z1,b.z1)-Math.max(a.z0,b.z0));
  for(const o of objs){const b=box(o),rel=[{r:'appartient_piece',a:'piece'}];
    if(o.type==='ceiling_light')rel.push({r:'suspendu_plafond'});
    else if(b.y0<0.05)rel.push({r:'pose_sol'});
    else{let best=null,bv=0;for(const p of objs){if(p===o)continue;const q=box(p),v=ovl(b,q);if(v>bv&&Math.abs(q.y1-b.y0)<0.15){bv=v;best=p}}if(best)rel.push({r:'pose_sur',a:best.id});}
    const dw=Math.min(b.x0+W/2,W/2-b.x1,b.z0+D/2,D/2-b.z1);if(dw<0.15&&b.y0>0.3&&o.type!=='ceiling_light')rel.push({r:'fixe_mur'});
    for(const p of objs){if(p!==o&&Math.hypot(p.x-o.x,p.z-o.z)<0.9)rel.push({r:'proche_de',a:p.id})}
    o.rel=rel;}
  // vignette de l'image source (gardée dans l'appareil, pour les corrections)
  for(const o of objs){let best=null;const P=tw(o.x,(o.y||0)+o.h/2,o.z);
    tr.keys.forEach(k=>{const f=tr.fR*Math.max(k.w,k.h),C=k.C,q=[C[0]*P[0]+C[1]*P[1]+C[2]*P[2],C[3]*P[0]+C[4]*P[1]+C[5]*P[2],C[6]*P[0]+C[7]*P[1]+C[8]*P[2]];if(q[2]<0.3)return;
      const u=f*q[0]/q[2]+k.w/2,v=f*q[1]/q[2]+k.h/2;if(u<0||v<0||u>=k.w||v>=k.h)return;const dc=Math.hypot(u/k.w-0.5,v/k.h-0.5);if(!best||dc<best.dc)best={dc,k,u,v,s:Math.max(24,f*Math.max(o.w,o.h)/q[2])}});
    if(best){try{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),s2=best.s;x.drawImage(canvasOf(best.k.img),best.u-s2/2,best.v-s2/2,s2,s2,0,0,64,64);o.src=c.toDataURL('image/jpeg',0.6)}catch(e){}}}
  spec.graphe={piece:{largeur:{v:W,u:'m',statut:'estimee'},profondeur:{v:D,u:'m',statut:'estimee'},hauteur:{v:R.wallHeight,u:'m',statut:R.ceiling&&R.ceiling.type!=='flat'?'estimee':'estimee'},murs_vus:R.seen},
    elements:objs.map(o=>({id:o.id,cls:o.cls,rel:o.rel}))};
}

/* ---------- parcours ---------- */
const loadScript=src=>new Promise((ok,ko)=>{const e=document.createElement('script');e.src=src;e.onload=ok;e.onerror=()=>ko(new Error(src));document.head.appendChild(e);});
async function vidRun(file,ctx){
  ({RNV,busy,busyStep,tick,t,toast,fmt,rnvDetect,rnvRender,rnvMake,v2Sess,vidFurnish}=ctx);
  ovOpen();ovStep('vst_read');await tick();
  try{
    if(!window.jsfeat)await loadScript('lib/jsfeat-min.js');
    await taxLoad();
    let tr;try{tr=await readAndTrack(file,(k,i,n)=>{if(i===1||i%3===0||i===n)ovStep('vst_read',{i,n});});}catch(e){LOG(e);throw {k:'vid_fail'};}
    if(tr.keys.length<2)throw {k:'vid_few'};
    const n=tr.keys.length;
    ovStep('vst_load');await tick();if(!(await v2Sess('depm'))||!(await v2Sess('detr')))throw {k:'vid_fail'};
    for(let i=0;i<n;i++){ovStep('vst_dep',{i:i+1,n});await tick();tr.keys[i].depth=await runDepth(tr.keys[i]);}
    for(let i=0;i<n;i++){ovStep('vst_seg',{i:i+1,n});await tick();tr.keys[i].seg=await runDetr(tr.keys[i]);}
    ovStep('vst_room');await tick();
    const cl=buildCloud(tr.keys,tr.fR);let spec=reconstruct(cl);
    // échelle calée sur des objets de taille connue (table, chaise, porte…) quand il y en a au moins deux
    const ks=spec.refs.map(r=>r.k).filter(k=>k>0.4&&k<2.5);
    if(ks.length>=2){const k=median(ks);const names=[...new Set(spec.refs.map(r=>r.name))].join(', ');if(Math.abs(k-1)>0.06){for(let i=0;i<cl.P.length;i++)cl.P[i]*=k;spec=reconstruct(cl);}spec.notes.unshift('Échelle calée sur des objets de taille connue ('+names+').');}
    window.__vidSpec=spec;
    try{oeilEnrich(spec,tr,ctx.oe3||null)}catch(e){LOG('enrich',e)}
    const ws=wallsFor(spec,tr.keys,tr.fR);if(!ws.length)throw {k:'vid_few'};
    const H=spec.room.wallHeight;
    RNV.walls=ws.map(w=>{const key=tr.keys[w.ki],cv=canvasOf(key.img),th=document.createElement('canvas'),s=112/Math.max(cv.width,cv.height);th.width=Math.round(cv.width*s);th.height=Math.round(cv.height*s);th.getContext('2d').drawImage(cv,0,0,th.width,th.height);
      return {cv,q:w.q.map(p=>[p[0],p[1]]),url:cv.toDataURL('image/jpeg',0.8),th:th.toDataURL('image/jpeg',0.7),pts:[],Lser:w.L,turn:1,ser:1,vid:1};});
    if(window.__vdebug)window.__vidWalls=RNV.walls;
    RNV.serH=H;RNV.serCam=spec.camera.y;RNV.H=H;RNV.Hset=0;RNV.cur=0;
    // repérage habituel de chaque mur (portes, fenêtres, prises, lumières), comme pour la série de photos
    ovStep('sst_det');await tick();
    for(const w of RNV.walls){try{await rnvDetect(w)}catch(e){}w.pts=(w.pts||[]).filter(p=>!(p.auto&&p.k==='light'))}
    // maquette 3D directement : la Rénovation enchaîne ses propres étapes sur le même écran
    await rnvMake();
    // chaque objet capté prend sa place dans la maquette (taille, couleur, orientation)
    if(vidFurnish){busy(true,'vst_furn');const bl=document.getElementById('busy-l');if(bl)bl.style.display='none';await tick();try{vidFurnish(spec,ws[0].k)}catch(e){LOG(e)}}
    const f2=x=>fmt(x,2);ovDone(t('vid_sum',{w:f2(spec.room.width),d:f2(spec.room.depth),h:f2(H)}));
  }catch(e){try{busy(false)}catch(_){}try{console.error(e)}catch(_){}ovFail(t((e&&e.k)||'vid_fail'));}
}
window.vidRun=vidRun;
})();

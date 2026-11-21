/* casô · La marque de l'artisan : l'appli prend la couleur de son logo, et l'ouverture montre son logo.
   - la couleur vient de Mon entreprise (couleur choisie dans le module Devis) ou, sinon, du logo lui-même ;
   - elle est éclaircie si besoin pour que le texte foncé posé dessus reste lisible (boutons, onglets) ;
   - un logo noir, blanc ou gris garde le jaune casô ;
   - ce qu'il faut pour l'ouverture (petit logo, couleur, initiales) est gardé à part, en clair, dans caso_marque :
     l'ouverture s'affiche avant que le coffre ne soit ouvert. Rien de tout ça sans compte. */
const MQ_KEY='caso_marque';
const mqHex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mqRgb=h=>{h=String(h).replace('#','');return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
function mqHsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;
 if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s,l]}
function mqDeHsl(h,s,l){const f=n=>{const k=(n+h/30)%12,a=s*Math.min(l,1-l);return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return mqHex(f(0)*255,f(8)*255,f(4)*255)}
const mqLum=h=>{const [r,g,b]=mqRgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b};
/* contraste avec le texte foncé des boutons (#18181a) */
const mqContraste=h=>(mqLum(h)+.05)/(mqLum('#18181a')+.05);

/* couleur dominante d'un logo : la teinte la plus présente parmi les pixels colorés (ni blancs, ni noirs, ni gris) */
function mqExtraire(img){const W=64,q=img.naturalWidth/img.naturalHeight||1,c=document.createElement('canvas');
 c.width=q>=1?W:Math.max(8,Math.round(W*q));c.height=q>=1?Math.max(8,Math.round(W/q)):W;
 const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,c.width,c.height);
 const px=x.getImageData(0,0,c.width,c.height).data,bins={};
 for(let i=0;i<px.length;i+=4){if(px[i+3]<128)continue;const R=px[i],G=px[i+1],B=px[i+2],[h,s,l]=mqHsl(R,G,B);
  if(l>.93||l<.08||s<.22)continue;const k=Math.round(h/24)%15,w=s*(1-Math.abs(l-.5)),b=bins[k]||(bins[k]={w:0,r:0,g:0,b:0});
  b.w+=w;b.r+=R*w;b.g+=G*w;b.b+=B*w}
 const best=Object.values(bins).sort((a,b)=>b.w-a.w)[0];
 return best&&best.w>.5?mqHex(best.r/best.w,best.g/best.w,best.b/best.w):''}

/* couleur de l'appli à partir de celle de la marque : même teinte, assez vive, assez claire pour le texte foncé */
function mqAccent(hex){if(!/^#[0-9a-f]{6}$/i.test(hex||''))return null;
 let [h,s,l]=mqHsl(...mqRgb(hex));if(s<.2)return null;
 s=Math.max(s,.55);l=Math.max(l,.45);let a=mqDeHsl(h,s,l);
 while(mqContraste(a)<4.5&&l<.9){l+=.02;a=mqDeHsl(h,s,l)}
 return{acc:a,accD:mqDeHsl(h,s,Math.max(.2,l-.18))}}
function mqAppliquer(m){const r=document.documentElement.style;
 if(m&&m.acc){r.setProperty('--acc',m.acc);r.setProperty('--acc-d',m.accD)}else{r.removeProperty('--acc');r.removeProperty('--acc-d')}}

/* initiales de l'entreprise, comme dans le menu profil (« RR » pour Rosso Rénovation) */
const mqInitiales=n=>String(n||'').replace(/\b(sarl|sas|sasu|eurl|ei|sa|et|de|du|des|la|le|les)\b/gi,' ').trim().split(/[\s'’-]+/)
 .filter(w=>/\p{L}/u.test(w)).slice(0,2).map(w=>w.match(/\p{L}/u)[0].toUpperCase()).join('');
const mqCompte=()=>{try{return !!(accountGet()||(typeof getSync==='function'&&(getSync()||{}).token))}catch(e){return false}};
function mqImage(src){return new Promise((ok,ko)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=ko;i.src=src})}
/* petit logo pour l'ouverture (240 px au plus, PNG pour garder la transparence) */
function mqPetit(img){const k=Math.min(1,240/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement('canvas');
 c.width=Math.max(1,Math.round(img.naturalWidth*k));c.height=Math.max(1,Math.round(img.naturalHeight*k));c.getContext('2d').drawImage(img,0,0,c.width,c.height);return c.toDataURL('image/png')}

let mqCle=null;
/* à chaque enregistrement : si le logo, la couleur ou le nom ont changé, on recalcule et on garde pour l'ouverture */
async function marqueMaj(){
 if(!mqCompte()){try{localStorage.removeItem(MQ_KEY)}catch(e){}mqAppliquer(null);mqCle=null;return}
 const p=(typeof db!=='undefined'&&db&&db.prof)||{},logo=typeof rcImg==='function'&&rcImg(p.logo)?p.logo:'';
 const cle=[p.couleur||'',logo.length,logo.slice(-48),p.nom||''].join('|');if(cle===mqCle)return;mqCle=cle;
 let c=/^#[0-9a-f]{6}$/i.test(p.couleur||'')?p.couleur:'',l='';
 if(logo){try{const i=await mqImage(logo);if(!c)c=mqExtraire(i);l=mqPetit(i)}catch(e){}}
 const a=mqAccent(c),m={c,acc:a&&a.acc,accD:a&&a.accD,l,ini:mqInitiales(p.nom),n:String(p.nom||'').slice(0,60)};
 if(cle!==mqCle)return;
 try{if(m.l||m.ini||m.acc)localStorage.setItem(MQ_KEY,JSON.stringify(m));else localStorage.removeItem(MQ_KEY)}catch(e){}
 mqAppliquer(m)}

{const s=window.save;if(typeof s==='function'&&!s.mq){const w=function(){const r=s.apply(this,arguments);try{marqueMaj()}catch(e){}return r};w.mq=1;window.save=w}}
setTimeout(()=>{try{marqueMaj()}catch(e){}},0);

'use strict';
/* Sauvegardes du serveur casô (aucune dépendance).

   Une sauvegarde est un seul fichier daté, dans le dossier « sauvegardes » des données. Elle contient les fichiers
   du serveur (données de chaque espace, comptes, apprentissage du chat, veille), compressés, puis chiffrés en AES-256-GCM quand une
   phrase secrète est donnée (variable CASO_CLE_SAUVEGARDE). La clé est dérivée de cette phrase par scrypt, avec un
   sel propre à chaque fichier. Sans la phrase, le fichier est illisible : il peut alors être copié ailleurs.

   Format : « CASOSV1 », une ligne d'en-tête JSON, puis le contenu (suivi des 16 octets d'authentification s'il est chiffré).
   L'en-tête est lui aussi authentifié : une sauvegarde modifiée est refusée à la lecture.

   En ligne de commande, depuis la racine du dépôt :
     node serveur/sauvegarde.js lister
     node serveur/sauvegarde.js creer
     node serveur/sauvegarde.js verifier <nom | derniere>
     node serveur/sauvegarde.js restaurer <nom | derniere>
   Le dossier des données est celui du serveur (DATA_DIR, sinon APP_HOME/donnees, sinon serveur/donnees). */
const fs=require('fs'),path=require('path'),crypto=require('crypto'),zlib=require('zlib');
const chiffre=require('./chiffre.js');

const FICHIERS=['data.json','comptes.json','appris.json','incompris.json','veille.json'];
/* Les données d'une entreprise sont dans espaces/<espace>/data.json. Le data.json à la racine est l'ancien rangement :
   il n'est sauvegardé que s'il n'y a encore aucun espace (sinon c'est une vieille copie, plus à jour). */
const ESPACE=/^espaces\/[a-z0-9]{1,24}\/data\.json$/;
const connu=f=>FICHIERS.includes(f)||ESPACE.test(f);
function espaces(dir){let l=[];try{l=fs.readdirSync(path.join(dir,'espaces'))}catch(e){return[]}
 return l.filter(n=>/^[a-z0-9]{1,24}$/.test(n)).sort().map(n=>'espaces/'+n+'/data.json').filter(f=>fs.existsSync(path.join(dir,f)))}
const aPrendre=dir=>{const e=espaces(dir);return (e.length?FICHIERS.filter(f=>f!=='data.json'):FICHIERS).concat(e)};
const MAGIE=Buffer.from('CASOSV1\n');
const NOM=/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z\.caso$/;
const SCRYPT={N:1<<15,r:8,p:1,maxmem:128*1024*1024};

const dossier=dir=>path.join(dir,'sauvegardes');
const nomDe=d=>d.toISOString().replace(/\.\d+Z$/,'Z').replace(/:/g,'-')+'.caso';
const pro=(f,...a)=>new Promise((ok,ko)=>f(...a,(e,v)=>e?ko(e):ok(v)));
const err=(code,msg)=>Object.assign(new Error(msg),{code});

/* Crée une sauvegarde de ce qui existe dans dir. Rend {nom, chemin, chiffre, octets, fichiers}. */
async function creer(dir,o={}){
 const le=o.date||new Date(),D=dossier(dir),fichiers={};
 // tout passe par la mémoire : au-delà de 100 Mo de données, on s'arrête plutôt que de faire tomber le serveur
 const liste=aPrendre(dir);
 let total=0;for(const f of liste){try{total+=fs.statSync(path.join(dir,f)).size}catch(e){}}
 if(total>(o.max||100e6))throw err('gros','Données trop volumineuses pour ce format de sauvegarde ('+Math.round(total/1e6)+' Mo).');
 for(const f of liste){try{fichiers[f]=fs.readFileSync(path.join(dir,f)).toString('base64')}catch(e){if(e.code!=='ENOENT')throw e}}
 const noms=Object.keys(fichiers);
 if(!noms.length)return null;                                   // rien à sauvegarder
 const clair=await pro(zlib.gzip,Buffer.from(JSON.stringify({v:1,le:le.toISOString(),fichiers})));
 const tete={v:1,le:le.toISOString(),fichiers:noms,chiffre:!!o.cle,sha256:crypto.createHash('sha256').update(clair).digest('hex')};
 let corps=clair;
 if(o.cle){
  const sel=crypto.randomBytes(16),iv=crypto.randomBytes(12);tete.sel=sel.toString('base64');tete.iv=iv.toString('base64');
  const k=await pro(crypto.scrypt,String(o.cle),sel,32,SCRYPT),c=crypto.createCipheriv('aes-256-gcm',k,iv);
  c.setAAD(Buffer.from(JSON.stringify(tete)));
  corps=Buffer.concat([c.update(clair),c.final(),c.getAuthTag()])}
 fs.mkdirSync(D,{recursive:true});
 const nom=nomDe(le),chemin=path.join(D,nom),tmp=chemin+'.tmp';
 await fs.promises.writeFile(tmp,Buffer.concat([MAGIE,Buffer.from(JSON.stringify(tete)+'\n'),corps]));
 await fs.promises.rename(tmp,chemin);
 return{nom,chemin,chiffre:!!o.cle,octets:fs.statSync(chemin).size,fichiers:noms}}

function decouper(buf){
 if(buf.length<MAGIE.length||!buf.subarray(0,MAGIE.length).equals(MAGIE))throw err('format','Ce fichier n\'est pas une sauvegarde casô.');
 const fin=buf.indexOf(10,MAGIE.length);if(fin<0||fin>MAGIE.length+4096)throw err('format','En-tête de sauvegarde illisible.');
 const brut=buf.subarray(MAGIE.length,fin).toString('utf8');let tete;
 try{tete=JSON.parse(brut)}catch(e){throw err('format','En-tête de sauvegarde illisible.')}
 return{tete,brut,corps:buf.subarray(fin+1)}}

/* Lit une sauvegarde. Rend {le, chiffre, fichiers:{nom:Buffer}}. Erreur « cle » si la phrase secrète manque ou est fausse,
   « abime » si le contenu a changé depuis sa création. */
function lire(chemin,o={}){
 const {tete,brut,corps}=decouper(fs.readFileSync(chemin));let clair=corps;
 if(tete.chiffre){
  if(!o.cle)throw err('cle','Cette sauvegarde est chiffrée : il faut la phrase secrète (CASO_CLE_SAUVEGARDE).');
  if(corps.length<17)throw err('abime','Sauvegarde abîmée.');
  const k=crypto.scryptSync(String(o.cle),Buffer.from(tete.sel,'base64'),32,SCRYPT);
  const d=crypto.createDecipheriv('aes-256-gcm',k,Buffer.from(tete.iv,'base64'));
  d.setAAD(Buffer.from(brut));d.setAuthTag(corps.subarray(corps.length-16));
  try{clair=Buffer.concat([d.update(corps.subarray(0,corps.length-16)),d.final()])}
  catch(e){throw err('cle','Phrase secrète incorrecte, ou sauvegarde abîmée.')}}
 if(crypto.createHash('sha256').update(clair).digest('hex')!==tete.sha256)throw err('abime','Sauvegarde abîmée : son contenu a changé.');
 let j;try{j=JSON.parse(zlib.gunzipSync(clair).toString('utf8'))}catch(e){throw err('abime','Sauvegarde abîmée.')}
 const fichiers={};
 for(const f of Object.keys(j.fichiers||{}))if(connu(f))fichiers[f]=Buffer.from(j.fichiers[f],'base64');
 return{le:tete.le,chiffre:!!tete.chiffre,fichiers}}

/* Lit la sauvegarde et contrôle que chaque fichier est du JSON valide. */
function verifier(chemin,o={}){
 const s=lire(chemin,o),liste=[];
 for(const f of Object.keys(s.fichiers)){
  /* un fichier chiffré au repos (serveur/chiffre.js) se contrôle à son format ; sa clé n'est pas celle des sauvegardes */
  if(!chiffre.estChiffre(s.fichiers[f]))try{JSON.parse(s.fichiers[f].toString('utf8'))}catch(e){throw err('abime','Dans la sauvegarde, '+f+' n\'est pas lisible.')}
  liste.push({nom:f,octets:s.fichiers[f].length})}
 return{ok:true,le:s.le,chiffre:s.chiffre,fichiers:liste}}

/* Liste les sauvegardes, la plus récente d'abord (seul l'en-tête est lu). */
function lister(dir){
 const D=dossier(dir);let noms=[];try{noms=fs.readdirSync(D).filter(n=>NOM.test(n))}catch(e){return[]}
 return noms.sort().reverse().map(nom=>{
  const chemin=path.join(D,nom);let chiffre=null,le=null,octets=0;
  try{octets=fs.statSync(chemin).size;const fd=fs.openSync(chemin,'r'),b=Buffer.alloc(4200),n=fs.readSync(fd,b,0,b.length,0);fs.closeSync(fd);
   const t=decouper(b.subarray(0,n)).tete;chiffre=!!t.chiffre;le=t.le}catch(e){}
  return{nom,chemin,octets,le,chiffre}})}

const trouver=(dir,nom)=>{const l=lister(dir);
 if(!nom||nom==='derniere')return l[0]||null;
 return NOM.test(String(nom))?l.find(x=>x.nom===nom)||null:null};

/* Garde les « jours » plus récentes, plus la dernière de chaque mois sur « mois » mois. Rend les noms supprimés. */
function elaguer(dir,o={}){
 const jours=o.jours||14,mois=o.mois||6,l=lister(dir),garde=new Set(l.slice(0,jours).map(x=>x.nom)),vus=[];
 for(const x of l){const m=x.nom.slice(0,7);if(!vus.includes(m)){vus.push(m);if(vus.length<=mois)garde.add(x.nom)}}
 const out=[];for(const x of l)if(!garde.has(x.nom)){try{fs.unlinkSync(x.chemin);out.push(x.nom)}catch(e){}}
 return out}

/* Remet les fichiers d'une sauvegarde dans dir. Les fichiers en place sont d'abord rangés dans « avant-restauration-… » :
   rien n'est écrasé, on peut revenir en arrière. Rend {le, fichiers, avant}. */
function restaurer(chemin,dir,o={}){
 verifier(chemin,o);
 const s=lire(chemin,o),avant=path.join(dir,'avant-restauration-'+nomDe(o.date||new Date()).replace('.caso',''));
 fs.mkdirSync(avant,{recursive:true});
 // l'ancien data.json de la racine n'est déplacé que si la sauvegarde date de l'ancien rangement : il sera alors repris par le serveur
 const vieille=!Object.keys(s.fichiers).some(f=>ESPACE.test(f));
 for(const f of FICHIERS.filter(f=>vieille||f!=='data.json').concat(espaces(dir))){
  try{fs.mkdirSync(path.dirname(path.join(avant,f)),{recursive:true});fs.renameSync(path.join(dir,f),path.join(avant,f))}catch(e){if(e.code!=='ENOENT')throw e}}
 for(const f of Object.keys(s.fichiers)){const cible=path.join(dir,f),tmp=cible+'.tmp';fs.mkdirSync(path.dirname(cible),{recursive:true});fs.writeFileSync(tmp,s.fichiers[f]);fs.renameSync(tmp,cible)}
 return{le:s.le,fichiers:Object.keys(s.fichiers),avant}}

module.exports={creer,lire,verifier,lister,trouver,elaguer,restaurer,dossier,espaces,FICHIERS,NOM};

if(require.main===module){
 const dir=process.env.DATA_DIR||(process.env.APP_HOME?path.join(process.env.APP_HOME,'donnees'):path.join(__dirname,'donnees'));
 const cle=process.env.CASO_CLE_SAUVEGARDE||'',[action,arg]=process.argv.slice(2);
 const choisir=()=>{const x=trouver(dir,arg);if(!x)throw err('absente','Sauvegarde introuvable dans '+dossier(dir)+'.');return x};
 (async()=>{
  if(action==='lister'){const l=lister(dir);if(!l.length)console.log('Aucune sauvegarde dans '+dossier(dir)+'.');
   l.forEach(x=>console.log(x.nom+'  '+Math.ceil(x.octets/1024)+' Ko  '+(x.chiffre?'chiffrée':'en clair')))}
  else if(action==='creer'){const r=await creer(dir,{cle});console.log(r?'Sauvegarde créée : '+r.nom+(r.chiffre?' (chiffrée)':' (en clair : CASO_CLE_SAUVEGARDE absente)'):'Rien à sauvegarder.')}
  else if(action==='verifier'){const x=choisir(),r=verifier(x.chemin,{cle});console.log('Sauvegarde lisible : '+x.nom+' — '+r.fichiers.map(f=>f.nom).join(', '))}
  else if(action==='restaurer'){const x=choisir(),r=restaurer(x.chemin,dir,{cle});
   console.log('Restauré depuis '+x.nom+' : '+r.fichiers.join(', ')+'\nLes fichiers d\'avant sont dans '+r.avant+'.\nArrête le serveur avant de restaurer, puis relance-le.')}
  else console.log('Usage : node serveur/sauvegarde.js lister | creer | verifier <nom|derniere> | restaurer <nom|derniere>')
 })().catch(e=>{console.error(e.message);process.exit(1)})}

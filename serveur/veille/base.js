/* casô : veille réglementaire — la base des textes
   - un fichier « veille.json » dans le dossier de données, sa copie « veille.json.bak », les textes d'origine dans « veille-preuves/ »
   - une ancienne version n'est jamais écrasée : elle va dans « historique »
   Fiche : {id, titre, numero, source, url, datePub, dateVigueur, dateVerif, articles, ancienne, nouvelle, categorie, priorite,
            pros, modules, actions, validation ('attente'|'valide'|'refuse'), bloque, raisons, empreinte, preuve, historique} */
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');

const sha=s=>crypto.createHash('sha256').update(String(s)).digest('hex');
const court=(s,n)=>String(s==null?'':s).replace(/\s+/g,' ').trim().slice(0,n);
const a=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);

function ouvrir(dir,opts={}){
 const maintenant=opts.maintenant||(()=>new Date()),log=opts.log||console.error;
 const F=path.join(dir,'veille.json'),BAK=F+'.bak',PR=path.join(dir,'veille-preuves');
 const vide=()=>({textes:{},journal:[],dernierPassage:'',erreurs:0});
 const lire1=f=>{const d=JSON.parse(fs.readFileSync(f,'utf8'));if(!d||typeof d!=='object'||!d.textes||typeof d.textes!=='object')throw new Error('forme');
  return Object.assign(vide(),d)};
 let d=vide();
 try{d=lire1(F)}catch(e){if(e.code!=='ENOENT'){
  try{d=lire1(BAK);log('[casô] veille : base illisible, reprise de la copie')}catch(e2){log('[casô] veille : base et copie illisibles, départ à vide')}}}

 const le=()=>maintenant().toISOString();
 function preuve(emp,texte){try{fs.mkdirSync(PR,{recursive:true});const p=path.join(PR,emp+'.txt');if(!fs.existsSync(p))fs.writeFileSync(p,String(texte||''))}catch(e){log('[casô] veille : preuve non écrite')}return emp+'.txt'}
 const trace=(f,par)=>f.historique.push({le:le(),empreinte:f.empreinte,titre:f.titre,dateVigueur:f.dateVigueur,categorie:f.categorie,par});

 function recevoir(b){
  const idSource=court(b.idSource,200),id=b.source+':'+idSource,texte=String(b.texte||''),titre=court(b.titre,400);
  const emp=sha(titre+'|'+texte+'|'+(b.dateVigueur||'')),extrait=court(b.resume||texte,2000);
  if(!a(d.textes,id)){
   d.textes[id]={id,titre,numero:court(b.numero,60),source:b.source,url:b.url||'',datePub:b.datePub||'',dateVigueur:b.dateVigueur||'',dateVerif:'',
    articles:[],ancienne:'',nouvelle:extrait,categorie:'',priorite:'',pros:[],modules:[],actions:[],validation:'attente',bloque:false,raisons:[],
    empreinte:emp,preuve:preuve(emp,texte),historique:[]};
   return {id,etat:'nouveau'}}
  const f=d.textes[id];
  if(f.empreinte===emp)return {id,etat:'inchange'};
  trace(f,'source');
  Object.assign(f,{titre,url:b.url||f.url,datePub:b.datePub||f.datePub,dateVigueur:b.dateVigueur||'',ancienne:f.nouvelle,nouvelle:extrait,
   empreinte:emp,preuve:preuve(emp,texte),validation:'attente'});
  return {id,etat:'modifie'}}

 const garde=p=>{const o=Object.assign({},p);delete o.id;delete o.historique;delete o.empreinte;delete o.preuve;return o};
 const lire=id=>a(d.textes,id)?d.textes[id]:null;
 /* changement gardé dans l'historique */
 function noter(id,patch,par){const f=lire(id);if(!f)return null;trace(f,court(par,40));Object.assign(f,garde(patch));return f}
 /* première lecture d'un texte neuf : rien à garder avant */
 function completer(id,patch){const f=lire(id);if(!f)return null;Object.assign(f,garde(patch));return f}
 function vu(id,date){const f=lire(id);if(f)f.dateVerif=date}
 function liste(fi={}){return Object.keys(d.textes).map(k=>d.textes[k])
  .filter(f=>(!fi.categorie||f.categorie===fi.categorie)&&(!fi.validation||f.validation===fi.validation)&&(fi.bloque===undefined||!!f.bloque===!!fi.bloque))
  .sort((x,y)=>x.datePub<y.datePub?1:x.datePub>y.datePub?-1:0)}
 function journal(type,detail){d.journal.push({le:le(),type:court(type,40),detail});if(d.journal.length>2000)d.journal.splice(0,d.journal.length-2000);if(type==='erreur')d.erreurs++}
 const etat=()=>({textes:Object.keys(d.textes).length,dernierPassage:d.dernierPassage,erreurs:d.erreurs});
 function passage(iso){d.dernierPassage=iso}
 function enregistrer(){fs.mkdirSync(dir,{recursive:true});const t=F+'.tmp';fs.writeFileSync(t,JSON.stringify(d));fs.renameSync(t,F);
  try{fs.copyFileSync(F,BAK)}catch(e){log('[casô] veille : copie non écrite')}}
 return {recevoir,lire,liste,noter,completer,vu,journal,etat,passage,enregistrer};
}

module.exports={ouvrir,sha,court};

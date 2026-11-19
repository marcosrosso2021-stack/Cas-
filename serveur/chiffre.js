'use strict';
/* Chiffrement au repos des données du serveur casô (aucune dépendance).

   Ce qui est chiffré : le data.json de chaque espace (équipe, fiches partagées, devis envoyés, signatures, clés de notification)
   et comptes.json (comptes Google / Outlook : e-mails, SIRET, sessions).
   Clé : dérivée par scrypt de la phrase secrète CASO_CLE_DONNEES (variable Clever Cloud), une fois au démarrage.
   Chaque écriture : AES-256-GCM, vecteur aléatoire de 12 octets. Le nom du fichier (ex. « espaces/e1/data.json ») est authentifié :
   un fichier recopié d'un espace à un autre est refusé.

   Format : « CASOCH1 » (7 octets), vecteur (12), étiquette d'authentification (16), puis le contenu chiffré.
   Sans phrase : rien ne change, les fichiers restent en clair (poste du bureau, essais).
   Passage : un fichier encore en clair est lu normalement, puis réécrit chiffré au démarrage.

   Limite : le serveur garde la clé en mémoire pour servir les pages de signature, de facture et les e-mails.
   Le chiffrement protège une copie volée du stockage ou d'un disque ; il ne remplace pas le chiffrement de bout en bout.
   Phrase perdue = données du serveur illisibles (les sauvegardes aussi) : la garder ailleurs, comme CASO_CLE_SAUVEGARDE. */
const fs=require('fs'),crypto=require('crypto');

const MAGIE=Buffer.from('CASOCH1'),IV=12,TAG=16;
const SCRYPT={N:1<<15,r:8,p:1,maxmem:128*1024*1024};
const SEL=Buffer.from('casô · données du serveur · v1');
const cles=new Map();

function err(code,message){const e=new Error(message);e.code=code;return e}
function cleDe(phrase){
 phrase=String(phrase||'');if(!phrase)return null;
 if(phrase.length<12)throw err('cle_courte','CASO_CLE_DONNEES est trop courte : 12 caractères au moins.');
 if(!cles.has(phrase))cles.set(phrase,crypto.scryptSync(phrase,SEL,32,SCRYPT));
 return cles.get(phrase)}

const estChiffre=buf=>Buffer.isBuffer(buf)&&buf.length>=MAGIE.length+IV+TAG&&buf.subarray(0,MAGIE.length).equals(MAGIE);

/* Un coffre lié à une phrase (vide = pas de chiffrement). nom = chemin relatif du fichier, authentifié. */
function creer(phrase){
 const k=cleDe(phrase);
 function chiffrer(texte,nom){
  const clair=Buffer.from(String(texte),'utf8');if(!k)return clair;
  const iv=crypto.randomBytes(IV),c=crypto.createCipheriv('aes-256-gcm',k,iv);c.setAAD(Buffer.from(String(nom)));
  const corps=Buffer.concat([c.update(clair),c.final()]);
  return Buffer.concat([MAGIE,iv,c.getAuthTag(),corps])}
 function dechiffrer(buf,nom){
  if(!estChiffre(buf))return buf.toString('utf8');
  if(!k)throw err('cle','Les données du serveur sont chiffrées : il faut la phrase secrète CASO_CLE_DONNEES.');
  const iv=buf.subarray(MAGIE.length,MAGIE.length+IV),tag=buf.subarray(MAGIE.length+IV,MAGIE.length+IV+TAG);
  const d=crypto.createDecipheriv('aes-256-gcm',k,iv);d.setAAD(Buffer.from(String(nom)));d.setAuthTag(tag);
  try{return Buffer.concat([d.update(buf.subarray(MAGIE.length+IV+TAG)),d.final()]).toString('utf8')}
  catch(e){throw err('cle','Données du serveur illisibles : phrase CASO_CLE_DONNEES incorrecte, ou fichier abîmé ('+nom+').')}}
 /* lit un fichier : { texte, chiffre } ou null s'il n'existe pas */
 function lire(chemin,nom){
  let buf;try{buf=fs.readFileSync(chemin)}catch(e){if(e.code==='ENOENT')return null;throw e}
  return{texte:dechiffrer(buf,nom),chiffre:estChiffre(buf),octets:buf.length}}
 /* écrit un fichier sans jamais laisser un état à moitié écrit (fichier temporaire puis renommage) */
 function ecrireSync(chemin,texte,nom){const t=chemin+'.tmp';fs.writeFileSync(t,chiffrer(texte,nom));fs.renameSync(t,chemin)}
 async function ecrire(chemin,texte,nom){const t=chemin+'.tmp',b=chiffrer(texte,nom);await fs.promises.writeFile(t,b);await fs.promises.rename(t,chemin);return b.length}
 return{actif:!!k,chiffrer,dechiffrer,lire,ecrire,ecrireSync}}

module.exports={creer,estChiffre,MAGIE};

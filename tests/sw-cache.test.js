// Le service worker doit effacer TOUTES les anciennes versions de l'appli (caso-app-*), pas une seule.
// La ligne de nettoyage est écrite 'caso-'+'app-' pour qu'un remplacement global du numéro de version ne la touche pas.
const fs=require('fs'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');
let ko=0;const ok=(c,m)=>{console.log((c?'OK   ':'ECHEC ')+m);if(!c)ko++};
const v=(s.match(/const CACHE='caso-app-(\d+)'/)||[])[1];
ok(!!v,'numéro de version présent : caso-app-'+v);
const m=s.match(/startsWith\(([^)]*)\)/);
ok(m&&/^'caso-'\s*\+\s*'app-'$/.test(m[1].trim()),'nettoyage de toutes les anciennes versions : startsWith('+(m&&m[1])+')');
console.log(ko?ko+' échec(s)':'0 échec(s)');process.exit(ko?1:0);

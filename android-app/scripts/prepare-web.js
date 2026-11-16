/*
 * Prépare le dossier www de l'enveloppe à partir du site casô (racine du dépôt).
 * Copie du site telle quelle : le pointage automatique (dossier pointage/) y est déjà.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');
const app = path.join(__dirname, '..');
const www = path.join(app, 'www');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

const files = fs.readdirSync(root).filter(f =>
  /\.(html|webmanifest|png|ico|svg|json)$/.test(f) || f === 'sw.js');
files.forEach(f => fs.copyFileSync(path.join(root, f), path.join(www, f)));

// bibliothèques hébergées et module 3D (lib/), moteur du chat (chat/), traductions de l'interface (i18n/) : copiés tels quels
['lib', 'chat', 'i18n', 'pointage'].forEach(d => {
  if (fs.existsSync(path.join(root, d))) fs.cpSync(path.join(root, d), path.join(www, d), { recursive: true });
});

// le pointage (pointage/) fait partie du site : l'appli Android le charge comme le site web

console.log('www prêt :', fs.readdirSync(www).length, 'fichiers');

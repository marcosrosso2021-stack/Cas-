/*
 * Prépare le dossier www de l'enveloppe à partir du site casô (racine du dépôt).
 * Le site lui-même n'est jamais modifié : les deux scripts du pointage
 * automatique sont ajoutés seulement à la copie qui part dans l'appli.
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

['pointage-auto.js', 'caso-native.js'].forEach(f =>
  fs.copyFileSync(path.join(app, 'web', f), path.join(www, f)));

const idx = path.join(www, 'index.html');
let html = fs.readFileSync(idx, 'utf8');
if (html.indexOf('caso-native.js') === -1) {
  const tag = '<script src="pointage-auto.js"></script>\n<script src="caso-native.js"></script>\n';
  const i = html.lastIndexOf('</body>');
  if (i === -1) throw new Error('index.html : balise </body> introuvable');
  html = html.slice(0, i) + tag + html.slice(i);
  fs.writeFileSync(idx, html);
}
console.log('www prêt :', fs.readdirSync(www).length, 'fichiers');

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

// bibliothèques hébergées (lib/) et moteur du chat (chat/) : copiés tels quels
['lib', 'chat'].forEach(d => {
  if (fs.existsSync(path.join(root, d))) fs.cpSync(path.join(root, d), path.join(www, d), { recursive: true });
});

['pointage-auto.js', 'caso-native.js'].forEach(f =>
  fs.copyFileSync(path.join(app, 'web', f), path.join(www, f)));

const idx = path.join(www, 'index.html');
let html = fs.readFileSync(idx, 'utf8');
if (html.indexOf('caso-native.js') === -1) {
  // lancés par le coffre, après l'appli (type text/x-caso), juste avant le script de démarrage
  const tag = '<script type="text/x-caso" data-src="pointage-auto.js"></script>\n<script type="text/x-caso" data-src="caso-native.js"></script>\n';
  const b = html.indexOf('<script>/* démarrage : le coffre');
  const i = b !== -1 ? b : html.lastIndexOf('</body>');
  if (i === -1) throw new Error('index.html : balise </body> introuvable');
  html = html.slice(0, i) + tag + html.slice(i);
  fs.writeFileSync(idx, html);
}
console.log('www prêt :', fs.readdirSync(www).length, 'fichiers');

/*
 * Ajoute au projet iPhone généré par Capacitor : les textes de demande de position
 * et le démarrage précoce du gestionnaire de zones (iOS ne livre les passages
 * qu'à un gestionnaire déjà créé quand l'appli est relancée en arrière-plan).
 * Sans danger si lancé deux fois.
 */
const fs = require('fs');
const path = require('path');

const ios = path.join(__dirname, '..', 'ios', 'App', 'App');
if (!fs.existsSync(ios)) throw new Error('Projet iPhone absent : lancer d\'abord « npx cap add ios ».');

// Info.plist
const plistPath = path.join(ios, 'Info.plist');
let plist = fs.readFileSync(plistPath, 'utf8');
const keys = {
  NSLocationWhenInUseUsageDescription: 'casô utilise ta position pour savoir quand tu arrives sur un chantier et quand tu en pars.',
  NSFaceIDUsageDescription: 'casô utilise Face ID pour ouvrir tes données sur cet iPhone.',
  NSLocationAlwaysAndWhenInUseUsageDescription: 'casô note tout seul ton arrivée et ton départ du chantier, même appli fermée. Aucune position n\'est conservée.'
};
Object.keys(keys).forEach(k => {
  if (plist.indexOf('<key>' + k + '</key>') === -1)
    plist = plist.replace(/<\/dict>\s*<\/plist>\s*$/, '\t<key>' + k + '</key>\n\t<string>' + keys[k] + '</string>\n</dict>\n</plist>\n');
});
fs.writeFileSync(plistPath, plist);

// AppDelegate : le gestionnaire de zones démarre dès le lancement
const adPath = path.join(ios, 'AppDelegate.swift');
let ad = fs.readFileSync(adPath, 'utf8');
if (ad.indexOf('CasoGeoCore') === -1) {
  ad = ad.replace(/import Capacitor\n/, 'import Capacitor\nimport CasoGeofence\n');
  const re = /(func application\(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions:[^\n]*\{\n)/;
  if (!re.test(ad)) throw new Error('AppDelegate.swift : didFinishLaunchingWithOptions introuvable');
  ad = ad.replace(re, '$1        CasoGeoCore.shared.start()\n');
  fs.writeFileSync(adPath, ad);
}
console.log('Projet iPhone préparé.');

/*
 * Ajoute au projet Android généré par Capacitor : le plugin de zones,
 * les permissions de localisation, les deux récepteurs et la bibliothèque
 * Google de géorepérage. Sans danger si lancé deux fois.
 */
const fs = require('fs');
const path = require('path');

const APP_ID = 'fr.caso.app';
const app = path.join(__dirname, '..');
const android = path.join(app, 'android');
const javaDir = path.join(android, 'app', 'src', 'main', 'java', ...APP_ID.split('.'));
const nativeDir = path.join(app, 'native');

if (!fs.existsSync(android)) throw new Error('Projet Android absent : lancer d\'abord « npx cap add android ».');

fs.mkdirSync(javaDir, { recursive: true });
fs.readdirSync(nativeDir).filter(f => f.endsWith('.java')).forEach(f =>
  fs.copyFileSync(path.join(nativeDir, f), path.join(javaDir, f)));
console.log('Java copié dans', javaDir);

const manifestPath = path.join(android, 'app', 'src', 'main', 'AndroidManifest.xml');
let m = fs.readFileSync(manifestPath, 'utf8');
// les données de l'appli (devis, clients, jeton) ne doivent pas partir dans une sauvegarde adb ou cloud
if (/android:allowBackup="true"/.test(m)) {
  m = m.replace(/android:allowBackup="true"/, 'android:allowBackup="false"');
  fs.writeFileSync(manifestPath, m);
  console.log('allowBackup désactivé');
}
if (m.indexOf('caso-geo') === -1) {
  const perms =
    '    <!-- caso-geo -->\n' +
    '    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n' +
    '    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />\n' +
    '    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />\n' +
    '    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />\n';
  const recv =
    '        <receiver android:name=".GeofenceReceiver" android:exported="false" />\n' +
    '        <receiver android:name=".BootReceiver" android:exported="true">\n' +
    '            <intent-filter>\n' +
    '                <action android:name="android.intent.action.BOOT_COMPLETED" />\n' +
    '                <action android:name="android.intent.action.MY_PACKAGE_REPLACED" />\n' +
    '            </intent-filter>\n' +
    '        </receiver>\n';
  if (m.indexOf('</application>') === -1 || m.indexOf('</manifest>') === -1) throw new Error('AndroidManifest.xml inattendu');
  m = m.replace('</application>', recv + '    </application>');
  m = m.replace('</manifest>', perms + '</manifest>');
  fs.writeFileSync(manifestPath, m);
  console.log('AndroidManifest.xml mis à jour');
}

const gradlePath = path.join(android, 'app', 'build.gradle');
let g = fs.readFileSync(gradlePath, 'utf8');
if (g.indexOf('play-services-location') === -1) {
  const re = /\ndependencies\s*\{/;
  if (!re.test(g)) throw new Error('app/build.gradle : bloc dependencies introuvable');
  g = g.replace(re, "\ndependencies {\n    implementation 'com.google.android.gms:play-services-location:21.3.0'");
  fs.writeFileSync(gradlePath, g);
  console.log('build.gradle mis à jour');
}

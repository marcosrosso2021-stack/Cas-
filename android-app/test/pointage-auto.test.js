const assert = require('assert');
const P = require('../web/pointage-auto.js');

const BASE = { lat: 46.0, lng: 2.0 };
const M_LAT = 111320, M_LNG = 111320 * Math.cos(BASE.lat * Math.PI / 180);
const at = (dx, dy) => ({ lat: BASE.lat + dy / M_LAT, lng: BASE.lng + dx / M_LNG });
const T0 = Date.UTC(2026, 10, 9, 6, 0, 0); // 07:00 heure de Paris
const min = (m, s = 0) => T0 + m * 60000 + s * 1000;

const sites = { s1: Object.assign({ radius: 100 }, at(0, 0)) };
const plan = [{ id: 'a1', siteId: 's1', start: min(60), end: min(60 + 240) }];
const ctx = { sites, plan };

function run(events) {
  let state = P.initial(), all = [], gpsOn = false, log = [];
  for (const ev of events) {
    const r = P.step(state, ev, ctx);
    state = r.state;
    for (const e of r.effects) {
      all.push(e);
      if (e.type === 'gps_on') gpsOn = true;
      if (e.type === 'gps_off') gpsOn = false;
    }
    log.push(gpsOn);
  }
  return { state, effects: all, gpsOn, log };
}
const fix = (t, x, y, acc = 10) => Object.assign({ type: 'fix', at: t, acc }, at(x, y));
const records = r => r.effects.filter(e => e.type === 'record');

// 1. Journée normale : arrivée, présence, sortie
{
  const r = run([
    { type: 'tick', at: min(10) },                      // trop tôt : rien
    { type: 'tick', at: min(16) },                      // 44 min avant : le GPS s'allume
    fix(min(40), -900, 0), fix(min(55), -300, 0),
    { type: 'enter', at: min(58), siteId: 's1' },
    fix(min(58, 5), -80, 0), fix(min(58, 35), -40, 0), fix(min(59, 10), -20, 0), // dans la zone depuis 58:05
    { type: 'tick', at: min(120) },
    { type: 'exit', at: min(300), siteId: 's1' },
    fix(min(300, 20), 160, 0)
  ]);
  const rec = records(r);
  assert.strictEqual(rec.length, 2);
  assert.strictEqual(rec[0].kind, 'in');
  assert.strictEqual(rec[0].at, min(58));               // l'heure d'arrivée est celle de l'alerte d'entrée dans la zone
  assert.strictEqual(rec[1].kind, 'out');
  assert.strictEqual(rec[1].at, min(300));
  assert.strictEqual(r.gpsOn, false);
  assert.strictEqual(r.state.phase, 'idle');
  // GPS éteint pendant toute la présence sur place
  assert.strictEqual(r.log[r.log.length - 4], false);   // au tick de 120 min
}
console.log('ok  journée normale, GPS éteint sur place');

// 2. Avant l'heure d'armement : le GPS n'est jamais allumé
{
  const r = run([{ type: 'tick', at: min(0) }, { type: 'tick', at: min(14) }]);
  assert.strictEqual(r.effects.length, 0);
}
console.log('ok  rien avant la fenêtre');

// 3. Passage en voiture dans la zone : pas d'arrivée
{
  const r = run([
    { type: 'tick', at: min(20) },
    fix(min(50), -150, 0),
    fix(min(50, 20), -50, 0),   // dans la zone
    fix(min(50, 40), 60, 0),    // dedans encore
    fix(min(51, 0), 250, 0),    // ressorti avant 60 s cumulées
  ]);
  assert.strictEqual(records(r).length, 0);
  assert.strictEqual(r.state.phase, 'travel');
}
console.log('ok  passage en voiture ignoré');

// 4. Position imprécise ignorée
{
  const r = run([
    { type: 'tick', at: min(20) },
    fix(min(58), 0, 0, 300), fix(min(60), 0, 0, 300), fix(min(62), 0, 0, 300)
  ]);
  assert.strictEqual(records(r).length, 0);
}
console.log('ok  position imprécise ignorée');

// 5. Fausse alerte de sortie : la personne est toujours sur place
{
  const r = run([
    { type: 'tick', at: min(20) },
    { type: 'enter', at: min(58), siteId: 's1' },
    fix(min(58, 10), 10, 0), fix(min(59, 20), 20, 0),
    { type: 'exit', at: min(150), siteId: 's1' },
    fix(min(150, 15), 90, 0)    // toujours dans les 100 m
  ]);
  assert.strictEqual(records(r).filter(e => e.kind === 'out').length, 0);
  assert.strictEqual(r.state.phase, 'onsite');
  assert.strictEqual(r.gpsOn, false);
}
console.log('ok  fausse sortie annulée');

// 6. Sortie sans position fiable : enregistrée, à vérifier
{
  const r = run([
    { type: 'tick', at: min(20) },
    { type: 'enter', at: min(58), siteId: 's1' },
    fix(min(58, 10), 10, 0), fix(min(59, 20), 20, 0),
    { type: 'exit', at: min(250), siteId: 's1' },
    { type: 'tick', at: min(262) }
  ]);
  const out = records(r).find(e => e.kind === 'out');
  assert.ok(out && out.flag === 'a_verifier' && out.at === min(250));
  assert.strictEqual(r.gpsOn, false);
}
console.log('ok  sortie sans signal : à vérifier');

// 7. Sortie jamais détectée : clôture à la fin prévue + 90 min
{
  const r = run([
    { type: 'tick', at: min(20) },
    { type: 'enter', at: min(58), siteId: 's1' },
    fix(min(58, 10), 10, 0), fix(min(59, 20), 20, 0),
    { type: 'tick', at: min(60 + 240 + 91) }
  ]);
  const out = records(r).find(e => e.kind === 'out');
  assert.ok(out && out.flag === 'a_verifier' && out.at === plan[0].end);
}
console.log('ok  sortie oubliée clôturée');

// 8. Absence : le GPS s'éteint tout seul
{
  const r = run([
    { type: 'tick', at: min(20) },
    { type: 'tick', at: min(60 + 121) }
  ]);
  assert.strictEqual(records(r).length, 0);
  assert.strictEqual(r.gpsOn, false);
  assert.strictEqual(r.state.done.a1, 'absent');
  // un rendez-vous absent ne se relance pas
  const r2 = P.step(r.state, { type: 'tick', at: min(60 + 130) }, ctx);
  assert.strictEqual(r2.effects.length, 0);
}
console.log('ok  absence : GPS éteint, pas de relance');

// ---------- Version PWA ----------
function runPwa(events) {
  let state = P.initial(), all = [];
  for (const ev of events) {
    const r = P.stepPwa(state, ev, ctx);
    state = r.state;
    all.push(...r.effects);
  }
  return { state, effects: all };
}
const open = (t, x, y, acc = 10) => Object.assign({ type: 'open', at: t, acc }, at(x, y));
const pushes = r => r.effects.filter(e => e.type === 'push');

// 9. PWA, journée normale : notification de début, ouverture sur place, notification de fin, ouverture dehors
{
  const r = runPwa([
    { type: 'tick', at: min(30) },              // trop tôt pour la notification de début
    { type: 'tick', at: min(60) },              // heure du rendez-vous : notification de début
    { type: 'tick', at: min(61) },              // pas de doublon
    open(min(65), 30, 0),                        // l'ouvrier ouvre casô sur place : arrivée
    { type: 'tick', at: min(300) },             // fin prévue : notification de fin
    { type: 'tick', at: min(301) },
    open(min(305), 400, 0)                       // ouvre dehors 5 min plus tard : sortie
  ]);
  assert.deepStrictEqual(pushes(r).map(p => p.kind), ['start', 'end']);
  const rec = records(r);
  assert.strictEqual(rec.length, 2);
  assert.strictEqual(rec[0].at, min(65));
  assert.strictEqual(rec[1].at, min(305));
  assert.strictEqual(rec[1].flag, 'estime');
  assert.strictEqual(r.state.phase, 'idle');
}
console.log('ok  PWA : journée normale');

// 10. PWA : encore sur place à la fin, une relance, puis sortie tardive datée à la fin prévue
{
  const r = runPwa([
    { type: 'tick', at: min(60) },
    open(min(62), 10, 0),
    { type: 'tick', at: min(300) },
    open(min(310), 20, 0),                       // appui sur la notification, toujours dans la zone
    { type: 'tick', at: min(360) },             // relance unique
    { type: 'tick', at: min(361) },
    open(min(370), 500, 0)                       // dehors 70 min après la fin prévue
  ]);
  assert.deepStrictEqual(pushes(r).map(p => p.kind), ['start', 'end', 'follow']);
  const out = records(r).find(e => e.kind === 'out');
  assert.ok(out && out.at === plan[0].end && out.flag === 'estime');
}
console.log('ok  PWA : relance unique, sortie tardive datée à la fin prévue');

// 11. PWA : aucune réponse, clôture à la fin prévue, sans notification en double
{
  const r = runPwa([
    { type: 'tick', at: min(60) },
    open(min(62), 10, 0),
    { type: 'tick', at: min(300) },
    { type: 'tick', at: min(360) },
    { type: 'tick', at: min(60 + 240 + 91) },
    { type: 'tick', at: min(60 + 240 + 92) }
  ]);
  const out = records(r).filter(e => e.kind === 'out');
  assert.strictEqual(out.length, 1);
  assert.ok(out[0].at === plan[0].end && out[0].flag === 'estime');
  assert.strictEqual(pushes(r).length, 3);
}
console.log('ok  PWA : clôture estimée sans réponse');

// 12. PWA : ouverture hors zone ou position imprécise : pas d'arrivée ; absence sans arrivée
{
  const r = runPwa([
    { type: 'tick', at: min(60) },
    open(min(65), 600, 0),                       // dehors
    open(min(66), 0, 0, 300),                    // imprécise
    { type: 'tick', at: min(60 + 121) }
  ]);
  assert.strictEqual(records(r).length, 0);
  assert.strictEqual(r.state.done.a1, 'absent');
  // plus de notification de début une fois l'absence actée
  const r2 = P.stepPwa(r.state, { type: 'tick', at: min(60 + 130) }, ctx);
  assert.strictEqual(r2.effects.length, 0);
}
console.log('ok  PWA : hors zone, imprécis, absence');

// ---------- Appli installée : zones du système ----------
const sites2 = { s1: sites.s1, s2: Object.assign({ radius: 100 }, at(500, 0)) };
const plan2 = [
  { id: 'a1', siteId: 's1', start: min(60), end: min(300) },
  { id: 'a2', siteId: 's2', start: min(330), end: min(450) }
];
function runNative(events, p = plan2) {
  let state = P.initial(), all = [];
  const c = { sites: sites2, plan: p };
  for (const ev of events) {
    const r = P.stepNative(state, ev, c);
    state = r.state;
    all.push(...r.effects);
  }
  return { state, effects: all };
}
const zn = (type, t, siteId = 's1') => ({ type, at: t, siteId });
const tk = t => ({ type: 'tick', at: t });

// 13. Journée normale, heures réelles du système
{
  const r = runNative([zn('enter', min(58)), zn('dwell', min(59)), tk(min(120)), zn('exit', min(300)), tk(min(311))]);
  const rec = records(r);
  assert.strictEqual(rec.length, 2);
  assert.deepStrictEqual([rec[0].kind, rec[0].at], ['in', min(58)]);
  assert.deepStrictEqual([rec[1].kind, rec[1].at], ['out', min(300)]);
  assert.ok(!rec[0].flag && !rec[1].flag);
  assert.strictEqual(r.state.phase, 'idle');
}
console.log('ok  installée : journée normale, heures réelles');

// 14. Passage en voiture : entrée sans présence de 60 s
{
  const r = runNative([zn('enter', min(50)), zn('exit', min(50, 30)), tk(min(100))]);
  assert.strictEqual(records(r).length, 0);
  const r2 = runNative([zn('enter', min(50)), tk(min(90))]);
  assert.strictEqual(records(r2).length, 0);
  assert.strictEqual(r2.state.pendingInAt, null);
}
console.log('ok  installée : passage en voiture ignoré');

// 15. Fausse sortie : retour en moins de 10 min, puis vraie sortie
{
  const r = runNative([
    zn('enter', min(58)), zn('dwell', min(59)),
    zn('exit', min(150)), zn('enter', min(153)),
    zn('exit', min(300)), tk(min(320))
  ]);
  const out = records(r).filter(e => e.kind === 'out');
  assert.strictEqual(out.length, 1);
  assert.strictEqual(out[0].at, min(300));
}
console.log('ok  installée : fausse sortie annulée');

// 16. Sortie jamais reçue : clôture à la fin prévue, à vérifier
{
  const r = runNative([zn('enter', min(58)), zn('dwell', min(59)), tk(min(60 + 240 + 91))]);
  const out = records(r).find(e => e.kind === 'out');
  assert.ok(out && out.flag === 'a_verifier' && out.at === min(300));
}
console.log('ok  installée : sortie oubliée clôturée');

// 17. Sortie traitée tard, au réveil, avec la bonne heure ; enchaînement sur un 2e chantier
{
  const r = runNative([
    zn('enter', min(58)), zn('dwell', min(59)), zn('exit', min(300)),
    zn('enter', min(325), 's2'), zn('dwell', min(326), 's2'),
    zn('exit', min(440), 's2'), tk(min(460))
  ]);
  const rec = records(r).map(e => [e.kind, e.siteId, e.at]);
  assert.deepStrictEqual(rec, [
    ['in', 's1', min(58)], ['out', 's1', min(300)],
    ['in', 's2', min(325)], ['out', 's2', min(440)]
  ]);
}
console.log('ok  installée : réveil tardif et deux chantiers');

// 18. Chantier hors planning ignoré ; rendez-vous déjà pointé non rouvert
{
  const r = runNative([zn('enter', min(58), 's9'), zn('dwell', min(59), 's9')]);
  assert.strictEqual(records(r).length, 0);
  const r2 = runNative([
    zn('enter', min(58)), zn('dwell', min(59)), zn('exit', min(200)), tk(min(215)),
    zn('enter', min(230)), zn('dwell', min(231))
  ]);
  assert.strictEqual(records(r2).filter(e => e.kind === 'in').length, 1);
}
console.log('ok  installée : hors planning et pas de doublon');

console.log('\ntous les tests passent');

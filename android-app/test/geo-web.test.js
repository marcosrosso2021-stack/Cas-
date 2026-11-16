const assert = require('assert');
const W = require('../../pointage/geo-web.js');

const M_LAT = 111320;
const site = { id: 'c1', lat: 48.85, lng: 2.35, radius: 100 };
const at = (dy, acc = 20) => ({ coords: { latitude: 48.85 + dy / M_LAT, longitude: 2.35, accuracy: acc } });

function mk(perm = 'granted', saved = null) {
  const t = { now: 1000000, pos: at(500), calls: 0, perm, saved, fail: false };
  const g = W.create({
    geo: { getCurrentPosition: (ok, ko) => { t.calls++; t.fail ? ko({}) : ok(t.pos); } },
    perm: async () => t.perm,
    now: () => t.now,
    load: () => t.saved,
    store: o => { t.saved = JSON.parse(JSON.stringify(o)); }
  });
  t.g = g;
  return t;
}
const drain = async t => (await t.g.drainEvents()).events.map(e => [e.type, e.site]);

(async () => {
  let t = mk();
  assert.deepStrictEqual(await drain(t), []);
  assert.strictEqual(t.calls, 0);
  console.log('ok  sans zone : la position n\'est jamais lue');

  await t.g.setGeofences({ sites: [site] });
  assert.deepStrictEqual(await drain(t), []);
  t.pos = at(30); t.now += 60000;
  assert.deepStrictEqual(await drain(t), [['enter', 'c1']]);
  t.now += 30000;
  assert.deepStrictEqual(await drain(t), [], 'pas encore 60 s');
  t.now += 40000;
  assert.deepStrictEqual(await drain(t), [['dwell', 'c1']]);
  t.now += 60000;
  assert.deepStrictEqual(await drain(t), [], 'rien de nouveau tant qu\'on reste');
  t.pos = at(400); t.now += 60000;
  assert.deepStrictEqual(await drain(t), [['exit', 'c1']]);
  assert.deepStrictEqual(await drain(t), []);
  console.log('ok  entrée, présence confirmée à 60 s, sortie');

  t = mk(); await t.g.setGeofences({ sites: [site] });
  t.pos = at(20, 400);
  assert.deepStrictEqual(await drain(t), [], 'position trop floue : ignorée');
  t.fail = true;
  assert.deepStrictEqual(await drain(t), [], 'position indisponible : rien');
  console.log('ok  position floue ou absente : ignorée');

  t = mk('prompt'); await t.g.setGeofences({ sites: [site] }); t.pos = at(10);
  assert.deepStrictEqual(await drain(t), []);
  assert.strictEqual(t.calls, 0, 'sans autorisation, aucune lecture');
  assert.deepStrictEqual(await t.g.status(), { location: 'prompt', background: 'prompt' });
  await t.g.ensurePermissions();
  assert.strictEqual(t.calls, 0, 'ensurePermissions ne demande rien sans geste');
  await t.g.openSettings();
  assert.strictEqual(t.calls, 1, 'le bouton Autoriser déclenche la demande');
  console.log('ok  autorisation : demandée seulement par le bouton');

  t = mk(); await t.g.setGeofences({ sites: [site] }); t.pos = at(10);
  await drain(t);
  const saved = t.saved; assert.ok(saved.in.c1);
  const t2 = mk('granted', saved); await t2.g.setGeofences({ sites: [site] }); t2.pos = at(10); t2.now = t.now + 70000;
  assert.deepStrictEqual(await drain(t2), [['dwell', 'c1']], 'l\'état survit à une fermeture de casô');
  await t2.g.clearGeofences(); t2.pos = at(900);
  assert.deepStrictEqual(await drain(t2), []);
  console.log('ok  état gardé entre deux ouvertures, zones effaçables');

  console.log('\ntous les tests passent');
})().catch(e => { console.error('KO', e); process.exit(1); });

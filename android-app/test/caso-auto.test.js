/* Tests du pont casô <-> zones Android, avec de faux téléphones. */
const assert = require('assert');
const P = require('../web/pointage-auto.js');
const CasoAuto = require('../web/caso-native.js');

const today = '2026-11-09';
const ts = (hm, day = today) => new Date(day + 'T' + hm + ':00').getTime();
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function mk(o = {}) {
  const db = {
    people: o.people || [{ id: 'u1', nom: 'Karim' }],
    chantiers: [], pts: o.pts || [], clients: [],
    events: o.events || [{ id: 'e1', t: 'rdv', d: today, a: '08:00', b: '12:00', who: ['u1'], adr: '12 rue des Lilas, Paris', title: 'Pose' }]
  };
  let n = 0;
  const calls = { set: [], clear: 0, ensure: 0, settings: 0, fetch: 0, change: 0 };
  const q = [], holder = {};
  let perm = o.perm || { location: 'granted', background: 'granted' };
  const G = {
    status: async () => ({ ...perm }),
    ensurePermissions: async () => { calls.ensure++; if (o.after) perm = o.after; return { ...perm }; },
    setGeofences: async a => { calls.set.push(a); },
    clearGeofences: async () => { calls.clear++; },
    drainEvents: async () => ({ events: q.splice(0) }),
    openSettings: async () => { calls.settings++; }
  };
  const clock = { t: ts('07:00') };
  const env = {
    P, G,
    db: () => db, sync: () => o.sync || {}, account: () => o.account || {},
    agToday: () => today,
    agAdd: (d, k) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + k); return x.toISOString().slice(0, 10); },
    agDayEvents: d => db.events.filter(e => e.d === d),
    agChFor: e => { if (e.ch) return e.ch; const id = 'c' + (++n); db.chantiers.push({ id, nom: e.adr }); e.ch = id; return id; },
    lastEv: p => db.pts.filter(x => x.p === p).sort((a, b) => a.ts - b.ts).slice(-1)[0] || null,
    uid: () => 'x' + (++n), save: () => {}, esc,
    fmtT: t => new Date(t).toTimeString().slice(0, 5),
    fmtH: ms => { const m = Math.round(ms / 60000); return Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0'); },
    fetch: async () => {
      calls.fetch++;
      if (o.geoFail) return { ok: false };
      return { ok: true, json: async () => ({ features: [{ geometry: { coordinates: [2.35, 48.85] } }] }) };
    },
    online: () => !o.offline, now: () => clock.t,
    load: () => null, store: s => { holder.s = JSON.parse(JSON.stringify(s)); },
    onChange: () => { calls.change++; }
  };
  return { A: CasoAuto.create(env), db, G, q, calls, clock, env, holder };
}
const ev = (type, hm, site = 'c1') => ({ type, ts: ts(hm), site });

const tests = [];
const t = (name, fn) => tests.push([name, fn]);

t('journée normale : zone inscrite, entrée et sortie aux heures du système', async () => {
  const m = mk();
  await m.A.run();
  assert.strictEqual(m.calls.set.length, 1);
  const z = m.calls.set[0].sites[0];
  assert.deepStrictEqual([z.id, z.lat, z.lng, z.radius], ['c1', 48.85, 2.35, 100]);
  assert.strictEqual(m.A.status().k, 'next');
  assert.strictEqual(m.A.status().at, ts('08:00'));
  m.q.push(ev('enter', '07:58'), ev('dwell', '07:59'), ev('exit', '12:00'));
  m.clock.t = ts('12:15');
  await m.A.run();
  assert.strictEqual(m.db.pts.length, 2);
  const [a, b] = m.db.pts;
  assert.deepStrictEqual([a.t, a.ts, a.c, a.p, a.note], ['in', ts('07:58'), 'c1', 'u1', 'automatique (GPS)']);
  assert.deepStrictEqual([b.t, b.ts], ['out', ts('12:00')]);
  assert.ok(m.calls.change >= 1);
  assert.deepStrictEqual([m.A.status().k, m.A.status().total], ['done', (4 * 60 + 2) * 60000]);
  assert.ok(m.A.card().includes('Terminé') && m.A.card().includes('4 h 02'));
});

t('sur place : l\'état affiche le chantier et l\'heure d\'arrivée', async () => {
  const m = mk();
  await m.A.run();
  m.q.push(ev('enter', '07:58'), ev('dwell', '07:59'));
  m.clock.t = ts('08:30');
  await m.A.run();
  const s = m.A.status();
  assert.deepStrictEqual([s.k, s.site, s.since], ['onsite', '12 rue des Lilas, Paris', ts('07:58')]);
  const html = m.A.card();
  assert.ok(html.includes('Sur place') && html.includes('depuis 07:58') && html.includes('Pointage automatique'));
});

t('la zone n\'est cherchée qu\'une fois et inscrite une seule fois par jour', async () => {
  const m = mk();
  await m.A.run(); await m.A.run(); await m.A.run();
  assert.strictEqual(m.calls.fetch, 1);
  assert.strictEqual(m.calls.set.length, 1);
});

t('plusieurs personnes : seule la personne de ce téléphone est suivie', async () => {
  const people = [{ id: 'u1', nom: 'Karim' }, { id: 'u2', nom: 'Luc' }];
  const m1 = mk({ people });
  await m1.A.run();
  assert.strictEqual(m1.A.status().k, 'noone');
  assert.strictEqual(m1.calls.set.length, 0);
  assert.strictEqual(m1.A.active(), false);
  const m2 = mk({ people, sync: { user: 'luc' }, events: [{ id: 'e1', t: 'rdv', d: today, a: '08:00', who: ['u2'], adr: 'rue A' }] });
  await m2.A.run();
  assert.strictEqual(m2.A.status().k, 'next');
  const m3 = mk({ people, sync: { user: 'luc' } }); // le rendez-vous est pour Karim
  await m3.A.run();
  assert.strictEqual(m3.A.status().k, 'none');
  const m4 = mk({ people, account: { prenom: 'Karim Dupont' } });
  await m4.A.run();
  assert.strictEqual(m4.A.status().k, 'next');
});

t('adresse introuvable : indiqué, aucune zone, pointage manuel conservé', async () => {
  const m = mk({ geoFail: true });
  await m.A.run();
  assert.strictEqual(m.A.status().k, 'nogeo');
  assert.strictEqual(m.calls.set.length, 0);
  assert.strictEqual(m.A.active(), false);
  assert.ok(m.A.line().includes('Adresse introuvable'));
});

t('sans internet : pas de recherche, pas de zone', async () => {
  const m = mk({ offline: true });
  await m.A.run();
  assert.strictEqual(m.calls.fetch, 0);
  assert.strictEqual(m.A.status().k, 'nogeo');
});

t('autorisation « Toujours » refusée : bouton, une seule demande par jour, réglages', async () => {
  const bad = { location: 'granted', background: 'denied' };
  const m = mk({ perm: bad });
  await m.A.run();
  assert.strictEqual(m.calls.ensure, 1);
  assert.strictEqual(m.A.status().k, 'perm');
  assert.strictEqual(m.A.active(), false);
  assert.ok(m.A.card().includes('CasoAuto.fix()'));
  await m.A.run();
  assert.strictEqual(m.calls.ensure, 1);          // pas de harcèlement
  await m.A.fix();                                 // l'utilisateur touche « Autoriser »
  assert.strictEqual(m.calls.ensure, 2);
  assert.strictEqual(m.calls.settings, 1);         // toujours refusée : ouvre les réglages
});

t('autorisation accordée après coup : l\'état se corrige tout seul', async () => {
  const m = mk({ perm: { location: 'granted', background: 'denied' }, after: { location: 'granted', background: 'granted' } });
  await m.A.run();
  assert.strictEqual(m.A.status().k, 'next');
  assert.strictEqual(m.A.active(), true);
  assert.strictEqual(m.calls.settings, 0);
});

t('pointage manuel déjà fait : pas de doublon', async () => {
  const m = mk({ pts: [{ id: 'm1', c: 'c1', p: 'u1', t: 'in', ts: ts('07:50'), note: '' }] });
  await m.A.run();
  m.q.push(ev('enter', '07:58'), ev('dwell', '07:59'));
  m.clock.t = ts('08:30');
  await m.A.run();
  assert.strictEqual(m.db.pts.length, 1);
});

t('deux chantiers dans la journée : entrées et sorties dans l\'ordre', async () => {
  const events = [
    { id: 'e1', t: 'rdv', d: today, a: '08:00', b: '10:00', who: ['u1'], adr: 'Chantier A' },
    { id: 'e2', t: 'rdv', d: today, a: '10:30', b: '12:00', who: ['u1'], adr: 'Chantier B' }
  ];
  const m = mk({ events });
  await m.A.run();
  m.q.push(ev('enter', '07:58', 'c1'), ev('dwell', '07:59', 'c1'), ev('exit', '10:05', 'c1'),
    ev('enter', '10:25', 'c2'), ev('dwell', '10:26', 'c2'), ev('exit', '12:00', 'c2'));
  m.clock.t = ts('12:20');
  await m.A.run();
  assert.deepStrictEqual(m.db.pts.map(p => [p.t, p.c, p.ts]), [
    ['in', 'c1', ts('07:58')], ['out', 'c1', ts('10:05')],
    ['in', 'c2', ts('10:25')], ['out', 'c2', ts('12:00')]
  ]);
});

t('entrée manuelle oubliée sur un autre chantier : sa sortie est écrite à l\'arrivée', async () => {
  const m = mk({ pts: [{ id: 'm1', c: 'cX', p: 'u1', t: 'in', ts: ts('06:30'), note: '' }] });
  await m.A.run();
  m.q.push(ev('enter', '07:58'), ev('dwell', '07:59'));
  m.clock.t = ts('08:30');
  await m.A.run();
  assert.deepStrictEqual(m.db.pts.map(p => [p.t, p.c, p.ts]), [
    ['in', 'cX', ts('06:30')], ['out', 'cX', ts('07:58')], ['in', 'c1', ts('07:58')]
  ]);
  assert.ok(m.db.pts[1].note.includes('changement de chantier'));
});

t('passage en voiture et chantier hors planning : rien n\'est écrit', async () => {
  const m = mk();
  await m.A.run();
  m.q.push(ev('enter', '07:50'), ev('exit', '07:50'), ev('enter', '09:00', 'c9'), ev('dwell', '09:01', 'c9'));
  m.clock.t = ts('09:30');
  await m.A.run();
  assert.strictEqual(m.db.pts.length, 0);
});

t('l\'état survit à un redémarrage de l\'appli', async () => {
  const m = mk();
  await m.A.run();
  m.q.push(ev('enter', '07:58'), ev('dwell', '07:59'));
  m.clock.t = ts('08:30');
  await m.A.run();
  assert.ok(m.holder.s);
  const A2 = CasoAuto.create({ ...m.env, load: () => JSON.parse(JSON.stringify(m.holder.s)) });
  assert.strictEqual(A2.active(), false);          // pas encore de calcul
  await A2.run();
  assert.strictEqual(A2.status().k, 'onsite');
  assert.strictEqual(A2.active(), true);
  assert.strictEqual(m.db.pts.length, 1);          // pas de doublon au redémarrage
});

t('rafraîchissement : seulement quand quelque chose change', async () => {
  const m = mk();
  await m.A.run();
  const c = m.calls.change;
  await m.A.run(); await m.A.run();
  assert.strictEqual(m.calls.change, c);
});

t('texte : noms échappés, zone affichée, pointage manuel effacé seulement si actif', async () => {
  const m = mk({ events: [{ id: 'e1', t: 'rdv', d: today, a: '08:00', who: ['u1'], adr: '<img src=x onerror=alert(1)>' }] });
  await m.A.run();
  const html = m.A.card();
  assert.ok(!html.includes('<img') && html.includes('&lt;img'));
  assert.ok(m.A.zone(m.db.chantiers[0]).includes('Zone 100 m'));
  assert.strictEqual(m.A.zone({ nom: 'sans zone' }), '');
  assert.strictEqual(m.A.active(), true);
});

t('rendez-vous sans adresse ou sans heure : ignoré', async () => {
  const m = mk({ events: [
    { id: 'e1', t: 'rdv', d: today, a: '08:00', who: ['u1'] },
    { id: 'e2', t: 'rdv', d: today, who: ['u1'], adr: 'rue B' },
    { id: 'e3', t: 'off', d: today, a: '08:00', who: ['u1'], adr: 'rue C' }
  ] });
  await m.A.run();
  assert.strictEqual(m.A.status().k, 'none');
  assert.strictEqual(m.calls.set.length, 0);
  assert.strictEqual(m.calls.clear, 1);
});

t('traductions : chaque texte du code existe dans les 9 langues', async () => {
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'web', 'caso-native.js'), 'utf8');
  const used = [];
  for (const call of src.matchAll(/\bT\(([^)]*)\)/g)) for (const q of call[1].matchAll(/'([^']+)'/g)) used.push(q[1]);
  assert.ok(used.length >= 14, 'textes trouvés : ' + used.length);
  used.forEach(u => assert.ok(CasoAuto.K.includes(u), 'texte sans traduction : ' + u));
  CasoAuto.K.forEach(k => assert.ok(used.includes(k), 'traduction inutilisée : ' + k));
  assert.deepStrictEqual(Object.keys(CasoAuto.TR).sort(), ['ar', 'en', 'es', 'it', 'pl', 'pt', 'ro', 'ru', 'tr']);
  Object.keys(CasoAuto.TR).forEach(l => {
    assert.strictEqual(CasoAuto.TR[l].length, CasoAuto.K.length, l);
    CasoAuto.TR[l].forEach((v, i) => {
      assert.ok(v && v.trim(), l + ' vide : ' + CasoAuto.K[i]);
      if (!['Zone', 'Absent'].includes(CasoAuto.K[i])) assert.notStrictEqual(v, CasoAuto.K[i], l + ' non traduit : ' + CasoAuto.K[i]);
    });
  });
});

t('traductions : une traduction déjà présente dans casô n\'est jamais écrasée', async () => {
  const data = { en: { Zone: 'Area' }, ru: {}, xx: {} };
  CasoAuto.addTranslations(data);
  assert.strictEqual(data.en.Zone, 'Area');
  assert.strictEqual(data.en['Sur place'], 'On site');
  assert.strictEqual(data.ru['Sur place'], 'На объекте');
  assert.strictEqual(Object.keys(data.xx).length, 0);
});

t('la journée en liste : fait, en cours, à venir', async () => {
  const events = [
    { id: 'e1', t: 'rdv', d: today, a: '08:00', b: '10:00', who: ['u1'], adr: 'Chantier A' },
    { id: 'e2', t: 'rdv', d: today, a: '10:30', b: '12:00', who: ['u1'], adr: 'Chantier B' },
    { id: 'e3', t: 'rdv', d: today, a: '14:00', b: '16:00', who: ['u1'], adr: 'Chantier C' }
  ];
  const m = mk({ events });
  await m.A.run();
  m.q.push(ev('enter', '07:58', 'c1'), ev('dwell', '07:59', 'c1'), ev('exit', '10:05', 'c1'),
    ev('enter', '10:25', 'c2'), ev('dwell', '10:26', 'c2'));
  m.clock.t = ts('11:00');
  await m.A.run();
  assert.deepStrictEqual(m.A.rows().map(r => [r.k, r.name]), [['done', 'Chantier A'], ['now', 'Chantier B'], ['todo', 'Chantier C']]);
  const html = m.A.card();
  assert.ok(html.includes('au-row done') && html.includes('au-row now') && html.includes('au-row todo'));
  assert.ok(html.includes('07:58 – 10:05') && html.includes('14:00'));
  assert.ok(html.includes('depuis 10:25'));
});

t('un seul rendez-vous en cours : pas de liste en double', async () => {
  const m = mk();
  await m.A.run();
  assert.ok(!m.A.card().includes('au-list'));
});

t('un rendez-vous sans arrivée est « Absent » une fois dépassé', async () => {
  const events = [
    { id: 'e1', t: 'rdv', d: today, a: '08:00', b: '09:00', who: ['u1'], adr: 'Chantier A' },
    { id: 'e2', t: 'rdv', d: today, a: '14:00', b: '16:00', who: ['u1'], adr: 'Chantier B' }
  ];
  const m = mk({ events });
  m.clock.t = ts('11:00');
  await m.A.run();
  assert.deepStrictEqual(m.A.rows().map(r => r.k), ['absent', 'todo']);
  assert.ok(m.A.card().includes('Absent'));
});

t('libellés : « Prochain chantier » avant l\'heure, « Attendu sur place » après, « Demain »', async () => {
  const m = mk();
  await m.A.run();
  assert.ok(m.A.card().includes('Prochain chantier') && !m.A.card().includes('Attendu sur place'));
  m.clock.t = ts('08:20');
  await m.A.run();
  assert.ok(m.A.card().includes('Attendu sur place'));
  const tomorrow = '2026-11-10';
  const m2 = mk({ events: [{ id: 'e1', t: 'rdv', d: tomorrow, a: '08:00', who: ['u1'], adr: 'Chantier A' }] });
  await m2.A.run();
  const s = m2.A.status();
  assert.deepStrictEqual([s.k, s.tomorrow], ['next', true]);
  assert.ok(m2.A.card().includes('Demain 08:00'));
});

t('mode sombre : la carte n\'utilise que les couleurs de casô', async () => {
  const hex = CasoAuto.CSS.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  // seules des teintes translucides (8 chiffres) ou des valeurs de secours dans var(--x,#...) sont permises
  const bare = CasoAuto.CSS.replace(/var\(--[a-z-]+,[^)]*\)/g, '').match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  bare.forEach(h => assert.strictEqual(h.length, 9, 'couleur fixe opaque : ' + h));
  assert.ok(hex.length > 0);
});

(async () => {
  let fail = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log('ok  ' + name); }
    catch (e) { fail++; console.log('KO  ' + name + '\n    ' + (e && e.message)); }
  }
  console.log(fail ? '\n' + fail + ' test(s) en échec' : '\ntous les tests passent');
  process.exit(fail ? 1 : 0);
})();

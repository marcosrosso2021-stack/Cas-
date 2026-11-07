/*
 * Test de bout en bout : le vrai index.html de casô (copie préparée dans www)
 * dans un navigateur, avec un faux Android qui simule les zones.
 * Lancer : node scripts/prepare-web.js && node test/e2e.js   (demande playwright)
 */
const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const WWW = path.join(__dirname, '..', 'www');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const SHOTS = process.env.SHOTS_DIR;

function serve() {
  return new Promise(ok => {
    const s = http.createServer((req, res) => {
      const f = path.join(WWW, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+$/, '/index.html'));
      if (!f.startsWith(WWW) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
      res.end(fs.readFileSync(f));
    }).listen(0, '127.0.0.1', () => ok(s));
  });
}

/* faux téléphone Android, installé avant le chargement de la page */
function fakeAndroid(opts) {
  window.__calls = { set: [], clear: 0, ensure: 0, settings: 0 };
  window.__q = [];
  window.__perm = opts.perm;
  const G = {
    status: async () => ({ ...window.__perm }),
    ensurePermissions: async () => { window.__calls.ensure++; return { ...window.__perm }; },
    setGeofences: async a => { window.__calls.set.push(a); },
    clearGeofences: async () => { window.__calls.clear++; },
    drainEvents: async () => ({ events: window.__q.splice(0) }),
    openSettings: async () => { window.__calls.settings++; }
  };
  if (opts.native) window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', registerPlugin: () => G };
  try { localStorage.setItem('caso_test', '1'); } catch (e) {}
}

async function open(browser, base, opts) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: opts.locale || 'fr-FR' });
  await ctx.route('https://data.geopf.fr/**', r => r.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ features: [{ geometry: { coordinates: [2.35, 48.85] } }] })
  }));
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date('2026-11-09T09:00:00') }); // horloge fixe : lundi 9 h
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.message || e)));
  await page.addInitScript(fakeAndroid, opts);
  await page.goto(base + '/index.html');
  await page.waitForFunction(() => typeof go === 'function' && typeof db === 'object' && !document.body.classList.contains('starting'), null, { timeout: 15000 }).catch(() => {});
  return { ctx, page, errors };
}

/* une personne, un rendez-vous aujourd'hui qui a commencé il y a 1 h */
async function seed(page) {
  return page.evaluate(() => {
    const now = new Date(), a = new Date(now.getTime() - 60 * 60000), b = new Date(now.getTime() + 180 * 60000);
    const hm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    db.people = [{ id: 'u1', nom: 'Karim' }];
    db.chantiers = db.chantiers || [];
    db.events = [{ id: 'e1', t: 'rdv', d: agToday(), a: hm(a), b: hm(b), who: ['u1'], adr: '12 rue des Lilas, Paris', title: 'Pose', at: Date.now() }];
    save();
    return { now: now.getTime() };
  });
}
const ptText = page => page.evaluate(() => { go('pt'); return document.getElementById('ptBody').innerText; });

(async () => {
  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch();
  let fail = 0;
  const check = async (name, fn) => {
    try { await fn(); console.log('ok  ' + name); } catch (e) { fail++; console.log('KO  ' + name + '\n    ' + (e && e.message)); }
  };

  await check('site web : aucune trace du pointage automatique', async () => {
    const { ctx, page, errors } = await open(browser, base, { native: false, perm: {} });
    assert.strictEqual(await page.evaluate(() => typeof window.CasoAuto), 'undefined');
    await seed(page);
    await page.evaluate(() => { db.chantiers = [{ id: 'w1', nom: 'Chantier web' }]; save(); });
    const txt = await ptText(page);
    assert.ok(txt.includes('Pointer') && !txt.includes('Pointage automatique'));
    assert.ok(await page.evaluate(() => !!document.getElementById('ptC')));
    assert.deepStrictEqual(errors, []);
    await ctx.close();
  });

  await check('appli Android : journée complète dans l\'écran Pointage', async () => {
    const { ctx, page, errors } = await open(browser, base, { native: true, perm: { location: 'granted', background: 'granted' } });
    await page.waitForFunction(() => !!window.CasoAuto);
    const { now } = await seed(page);

    await page.evaluate(() => CasoAuto.run());
    const calls = await page.evaluate(() => window.__calls);
    assert.strictEqual(calls.set.length, 1);
    assert.deepStrictEqual(calls.set[0].sites.map(s => [s.lat, s.lng, s.radius]), [[48.85, 2.35, 100]]);
    assert.ok(await page.evaluate(() => CasoAuto.active()));

    let txt = await ptText(page);
    assert.ok(txt.includes('Pointage automatique') && txt.includes('Prochain chantier'), txt.slice(0, 200));
    assert.ok(!(await page.evaluate(() => !!document.getElementById('ptC'))), 'le pointage manuel doit être masqué');
    assert.ok(!txt.includes('Pointer ici'));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'pointage-prochain.png') });

    const cid = await page.evaluate(() => db.chantiers[0].id);
    await page.evaluate(([n, c]) => {
      window.__q.push({ site: c, type: 'enter', ts: n - 58 * 60000 }, { site: c, type: 'dwell', ts: n - 57 * 60000 });
    }, [now, cid]);
    await page.evaluate(() => CasoAuto.run());
    txt = await ptText(page);
    assert.ok(txt.includes('Sur place'), txt.slice(0, 200));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'pointage-sur-place.png') });

    await page.evaluate(([n, c]) => { window.__q.push({ site: c, type: 'exit', ts: n - 12 * 60000 }); }, [now, cid]);
    await page.evaluate(() => CasoAuto.run());
    const pts = await page.evaluate(() => db.pts.map(p => [p.t, p.p, p.ts, p.note]));
    assert.deepStrictEqual(pts.map(p => p.slice(0, 2)), [['in', 'u1'], ['out', 'u1']]);
    assert.strictEqual(pts[0][2], now - 58 * 60000);
    assert.strictEqual(pts[1][2], now - 12 * 60000);
    assert.ok(pts.every(p => p[3] === 'automatique (GPS)'));

    const heures = await page.evaluate(() => { go('pt'); ptPage('h'); return document.getElementById('ptBody').innerText; });
    assert.ok(heures.includes('0 h 46') || heures.includes('0 h 45'), heures.slice(0, 300));
    const journal = await page.evaluate(() => { ptPage('j'); return document.getElementById('ptBody').innerText; });
    assert.ok(journal.includes('Entrée') && journal.includes('Sortie') && journal.includes('automatique (GPS)'), journal.slice(0, 400));
    const zone = await page.evaluate(() => { ptPage('set'); return document.getElementById('ptBody').innerText; });
    assert.ok(zone.includes('Zone 100 m'));
    assert.deepStrictEqual(errors, []);
    await ctx.close();
  });

  await check('autorisation manquante : carte avec « Autoriser », pointage manuel conservé', async () => {
    const { ctx, page, errors } = await open(browser, base, { native: true, perm: { location: 'granted', background: 'denied' } });
    await page.waitForFunction(() => !!window.CasoAuto);
    await seed(page);
    await page.evaluate(() => CasoAuto.run());
    const txt = await ptText(page);
    assert.ok(txt.includes('Toujours') && txt.includes('Autoriser'), txt.slice(0, 200));
    assert.ok(await page.evaluate(() => !!document.getElementById('ptC')), 'le pointage manuel reste disponible');
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'pointage-autorisation.png') });
    await page.evaluate(() => { go('pt'); ptPage('go'); });
    await page.getByRole('button', { name: 'Autoriser' }).click();
    await page.waitForFunction(() => window.__calls.settings === 1, null, { timeout: 5000 });
    assert.deepStrictEqual(errors, []);
    await ctx.close();
  });

  for (const [loc, a, b] of [['en-US', 'Automatic clocking', 'Next job site'], ['ru-RU', 'Автоматический учёт времени', 'Следующий объект'], ['ar-MA', 'الحضور التلقائي', 'الورشة التالية']]) {
    await check('langue ' + loc + ' : la carte est traduite, le nom du chantier ne l\'est pas', async () => {
      const { ctx, page, errors } = await open(browser, base, { native: true, locale: loc, perm: { location: 'granted', background: 'granted' } });
      await page.waitForFunction(() => !!window.CasoAuto);
      await seed(page);
      await page.evaluate(() => CasoAuto.run());
      const txt = await ptText(page);
      assert.ok(txt.includes(a) && txt.includes(b), txt.slice(0, 300));
      assert.ok(txt.includes('12 rue des Lilas, Paris'));
      assert.ok(!txt.includes('Prochain chantier') && !txt.includes('Pointage automatique'));
      if (SHOTS && loc === 'en-US') await page.screenshot({ path: path.join(SHOTS, 'pointage-en.png') });
      assert.deepStrictEqual(errors, []);
      await ctx.close();
    });
  }

  await browser.close();
  srv.close();
  console.log(fail ? '\n' + fail + ' test(s) en échec' : '\ntous les tests de bout en bout passent');
  process.exit(fail ? 1 : 0);
})();

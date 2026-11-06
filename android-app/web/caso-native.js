/*
 * casô · pointage automatique (appli Android)
 * Chargé seulement dans l'appli installée : sur le site web, ce fichier ne fait rien.
 *
 * Ce que fait ce fichier, sans aucun écran :
 *  1. cherche les rendez-vous de la personne (aujourd'hui et demain) avec une adresse ;
 *  2. trouve les coordonnées de l'adresse (service de l'État, une seule fois par chantier) ;
 *  3. inscrit ces zones auprès d'Android ;
 *  4. à chaque réveil, lit les passages notés par Android et les donne au moteur ;
 *  5. écrit les entrées et sorties dans le pointage existant de casô.
 */
(function () {
  'use strict';
  var Cap = window.Capacitor;
  if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform() || Cap.getPlatform() !== 'android') return;
  if (!window.CasoPointage) return;

  var G = Cap.registerPlugin('CasoGeofence');
  var KEY = 'caso_geo_state';
  var DAY = 24 * 3600 * 1000;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  function store() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  var st = load() || { state: CasoPointage.initial(), sig: '', asked: 0 };
  var busy = false;

  /* Qui tient ce téléphone : l'utilisateur de l'entreprise, sinon le prénom du compte,
     sinon l'unique personne de la liste. */
  function meId() {
    try {
      var P = db.people || [];
      var u = String((getSync() || {}).user || '').trim().toLowerCase();
      var a = (typeof accountGet === 'function' && accountGet()) || {};
      var n = u || String(a.prenom || '').split(' ')[0].toLowerCase() || String((db.me && db.me.prenom) || '').toLowerCase();
      var f = P.filter(function (p) { return String(p.nom || '').toLowerCase() === n; })[0];
      if (f) return f.id;
      if (P.length === 1) return P[0].id;
    } catch (e) {}
    return null;
  }

  function ts(day, hm) { return new Date(day + 'T' + hm + ':00').getTime(); }

  /* Rendez-vous des 2 derniers jours, d'aujourd'hui et de demain pour cette personne. */
  function buildPlan(me) {
    var today = agToday(), plan = [], todayIds = {}, tomorrowIds = {};
    for (var k = -2; k <= 1; k++) {
      var d = agAdd(today, k);
      agDayEvents(d).forEach(function (e) {
        if (e.t !== 'rdv' || !e.a || (e.who || []).indexOf(me) < 0) return;
        var cl = e.cid && (db.clients || []).filter(function (c) { return c.id === e.cid; })[0];
        if (!(e.ch || e.adr || (cl && cl.adr))) return;
        var cid = agChFor(e);
        var start = ts(d, e.a), end = e.b ? ts(d, e.b) : start + 3600000;
        plan.push({ id: e.id + ':' + d, siteId: cid, start: start, end: end, addr: e.adr || (cl && cl.adr) || '' });
        if (k === 0) todayIds[cid] = true;
        if (k === 1) tomorrowIds[cid] = true;
      });
    }
    return { plan: plan, upcoming: Object.keys(todayIds).concat(Object.keys(tomorrowIds)) };
  }

  async function geocode(c, addr) {
    if (c.geo || navigator.onLine === false) return;
    var q = addr || c.nom;
    if (!q) return;
    try {
      var r = await fetch('https://data.geopf.fr/geocodage/search?limit=1&q=' + encodeURIComponent(q));
      if (!r.ok) return;
      var j = await r.json();
      var f = (j.features || [])[0];
      if (!f || !f.geometry || !f.geometry.coordinates) return;
      c.geo = { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] };
      if (!c.rayon) c.rayon = 100;
      save();
    } catch (e) {}
  }

  function chantier(id) { return (db.chantiers || []).filter(function (c) { return c.id === id; })[0]; }

  /* Écrit dans le pointage de casô, sans doublon avec un pointage fait à la main. */
  function write(fx, me) {
    var last = typeof lastEv === 'function' ? lastEv(me) : null;
    if (last && last.t === fx.kind && (fx.kind === 'out' || last.c === fx.siteId) && Math.abs(last.ts - fx.at) < 12 * 3600 * 1000) return;
    db.pts.push({
      id: uid(), c: fx.siteId, p: me, t: fx.kind, ts: fx.at,
      note: 'automatique (GPS)' + (fx.flag === 'a_verifier' ? ' · à vérifier' : '')
    });
    save();
    try { if (typeof renderPt === 'function') renderPt(); } catch (e) {}
  }

  function apply(ev, ctx, me) {
    var r = CasoPointage.stepNative(st.state, ev, ctx);
    st.state = r.state;
    r.effects.forEach(function (fx) { if (fx.type === 'record') write(fx, me); });
  }

  async function perms() {
    try {
      var s = await G.status();
      if (s.location === 'granted' && s.background === 'granted') return;
      if (Date.now() - (st.asked || 0) < DAY) return;
      st.asked = Date.now(); store();
      await G.ensurePermissions();
    } catch (e) {}
  }

  async function run() {
    if (busy) return;
    busy = true;
    try {
      if (typeof db === 'undefined' || !db.people || !db.chantiers || !db.pts) return;
      var me = meId();
      if (!me) return;

      var built = buildPlan(me), sites = {}, list = [];
      var ids = {};
      built.plan.forEach(function (p) { ids[p.siteId] = p.addr; });
      for (var cid in ids) {
        var c = chantier(cid);
        if (!c) continue;
        await geocode(c, ids[cid]);
        if (c.geo) sites[cid] = { lat: c.geo.lat, lng: c.geo.lng, radius: c.rayon || 100 };
      }
      built.upcoming.forEach(function (cid) {
        if (sites[cid] && !list.some(function (s) { return s.id === cid; })) {
          list.push({ id: cid, lat: sites[cid].lat, lng: sites[cid].lng, radius: sites[cid].radius });
        }
      });

      if (list.length) await perms();

      var sig = agToday() + JSON.stringify(list);
      if (sig !== st.sig) {
        if (list.length) await G.setGeofences({ sites: list }); else await G.clearGeofences();
        st.sig = sig;
      }

      var r = await G.drainEvents();
      var evs = (r.events || []).slice().sort(function (a, b) { return a.ts - b.ts; });
      var ctx = { sites: sites, plan: built.plan };
      evs.forEach(function (e) { apply({ type: e.type, at: e.ts, siteId: e.site }, ctx, me); });
      apply({ type: 'tick', at: Date.now() }, ctx, me);
      store();
    } catch (e) {
    } finally {
      busy = false;
    }
  }

  setTimeout(run, 3000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) run(); });
  setInterval(function () { if (!document.hidden) run(); }, 60000);
})();

/*
 * Zones de chantier pour le site casô (iPhone, navigateur) : même contrat que le plugin Android
 * (status, ensurePermissions, setGeofences, clearGeofences, drainEvents, openSettings),
 * mais la position n'est lue que casô ouvert, une fois par passage de drainEvents.
 * Rien ne tourne en arrière-plan, et rien n'est lu s'il n'y a aucune zone.
 */
(function (root) {
  'use strict';
  var DWELL = 60000, MAX_ACC = 100;

  function dist(a, b) { // mètres
    var R = 6371000, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lng - a.lng) * r;
    var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) +
      Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // env : geo (navigator.geolocation), perm() -> Promise('granted'|'denied'|'prompt'), now(), load(), store(o)
  function create(env) {
    var sites = [], q = [], st = env.load() || {};
    st.in = st.in || {};

    function save() { try { env.store(st); } catch (e) {} }
    function fix() {
      return new Promise(function (ok) {
        try {
          env.geo.getCurrentPosition(function (p) {
            ok({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy });
          }, function () { ok(null); }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
        } catch (e) { ok(null); }
      });
    }
    async function status() {
      var p = 'prompt';
      try { p = await env.perm(); } catch (e) {}
      return { location: p, background: p }; // casô ouvert suffit : pas d'autorisation « Toujours » sur le web
    }
    async function poll() {
      if (!sites.length) return;
      var s = await status();
      if (s.location !== 'granted') return;
      var f = await fix();
      if (!f || !(f.acc <= MAX_ACC)) return;
      var now = env.now();
      sites.forEach(function (z) {
        var inside = dist(f, z) <= z.radius, t = st.in[z.id];
        if (inside && !t) { st.in[z.id] = { at: now, dwell: false }; q.push({ site: z.id, type: 'enter', ts: now }); }
        else if (inside && t && !t.dwell && now - t.at >= DWELL) { t.dwell = true; q.push({ site: z.id, type: 'dwell', ts: now }); }
        else if (!inside && t) { delete st.in[z.id]; q.push({ site: z.id, type: 'exit', ts: now }); }
      });
      save();
    }

    return {
      status: status,
      ensurePermissions: status, // sans geste de la personne, on ne demande rien
      openSettings: function () { return fix(); }, // le bouton « Autoriser » : la lecture de la position fait apparaître la demande
      setGeofences: async function (a) { sites = (a && a.sites) || []; },
      clearGeofences: async function () { sites = []; },
      drainEvents: async function () { await poll(); return { events: q.splice(0) }; }
    };
  }

  var api = { create: create, dist: dist };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CasoGeoWeb = api;
})(typeof self !== 'undefined' ? self : this);

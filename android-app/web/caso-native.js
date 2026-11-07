/*
 * casô · pointage automatique (appli Android)
 *
 * Ce fichier relie trois choses : l'agenda de casô, les zones surveillées par
 * Android et le pointage existant. Il n'a aucun écran propre : il fournit une
 * carte d'état à l'écran Pointage (window.CasoAuto) et écrit dans db.pts.
 *
 * Sur le site web il ne fait rien : window.CasoAuto n'existe pas.
 *
 * Tout ce dont il dépend est injecté (env), ce qui permet de le tester sans téléphone.
 */
(function (root) {
  'use strict';

  var DAY = 24 * 3600 * 1000;

  /* Traductions des textes de ce fichier, dans les 9 langues de casô.
     La clé est le texte français tel qu'il est écrit dans le code. */
  var K = ['Pointage automatique', 'Sur place', 'depuis', 'Sortie en cours de confirmation', 'Prochain chantier',
    'Adresse introuvable', 'Autorise la position « Toujours » pour pointer tout seul.', 'Autoriser',
    'Ce téléphone n’est lié à aucune personne. Ajoute ton prénom dans Personnes.',
    'Aucun chantier prévu avec une adresse.', 'Zone'];
  var TR = {
    en: ['Automatic clocking', 'On site', 'since', 'Exit being confirmed', 'Next job site', 'Address not found',
      'Allow location “Always” to clock in automatically.', 'Allow',
      'This phone isn’t linked to anyone. Add your first name under People.',
      'No job site planned with an address.', 'Zone'],
    pt: ['Ponto automático', 'No local', 'desde', 'Saída em confirmação', 'Próxima obra', 'Morada não encontrada',
      'Autoriza a posição «Sempre» para picar o ponto automaticamente.', 'Autorizar',
      'Este telemóvel não está associado a nenhuma pessoa. Adiciona o teu nome próprio em Pessoas.',
      'Nenhuma obra prevista com morada.', 'Zona'],
    es: ['Fichaje automático', 'En la obra', 'desde', 'Salida pendiente de confirmar', 'Próxima obra', 'Dirección no encontrada',
      'Permite la ubicación «Siempre» para fichar automáticamente.', 'Permitir',
      'Este teléfono no está vinculado a ninguna persona. Añade tu nombre en Personas.',
      'Ninguna obra prevista con dirección.', 'Zona'],
    it: ['Timbratura automatica', 'In cantiere', 'dalle', 'Uscita in fase di conferma', 'Prossimo cantiere', 'Indirizzo non trovato',
      'Consenti la posizione «Sempre» per timbrare automaticamente.', 'Consenti',
      'Questo telefono non è collegato a nessuna persona. Aggiungi il tuo nome in Persone.',
      'Nessun cantiere previsto con un indirizzo.', 'Zona'],
    ro: ['Pontaj automat', 'Pe șantier', 'de la', 'Ieșire în curs de confirmare', 'Următorul șantier', 'Adresa nu a fost găsită',
      'Permite locația „Întotdeauna” pentru pontaj automat.', 'Permite',
      'Acest telefon nu este asociat niciunei persoane. Adaugă-ți prenumele în Persoane.',
      'Niciun șantier programat cu adresă.', 'Zonă'],
    tr: ['Otomatik puantaj', 'Şantiyede', 'giriş:', 'Çıkış onay bekliyor', 'Sıradaki şantiye', 'Adres bulunamadı',
      'Otomatik puantaj için konuma «Her zaman» izni ver.', 'İzin ver',
      'Bu telefon hiçbir kişiyle eşleşmedi. Adını Kişiler bölümüne ekle.',
      'Adresi olan planlı şantiye yok.', 'Bölge'],
    pl: ['Automatyczny czas pracy', 'Na budowie', 'od', 'Wyjście oczekuje na potwierdzenie', 'Następna budowa', 'Nie znaleziono adresu',
      'Zezwól na lokalizację „Zawsze”, aby rejestrować czas pracy automatycznie.', 'Zezwól',
      'Ten telefon nie jest przypisany do żadnej osoby. Dodaj swoje imię w sekcji Osoby.',
      'Brak zaplanowanych budów z adresem.', 'Strefa'],
    ar: ['الحضور التلقائي', 'في الورشة', 'منذ', 'الخروج قيد التأكيد', 'الورشة التالية', 'لم يتم العثور على العنوان',
      'اسمح بالموقع «دائمًا» لتسجيل الحضور تلقائيًا.', 'السماح',
      'هذا الهاتف غير مرتبط بأي شخص. أضف اسمك الشخصي في الأشخاص.',
      'لا توجد ورشة مخطط لها بعنوان.', 'منطقة'],
    ru: ['Автоматический учёт времени', 'На объекте', 'с', 'Уход ожидает подтверждения', 'Следующий объект', 'Адрес не найден',
      'Разреши геопозицию «Всегда», чтобы время учитывалось автоматически.', 'Разрешить',
      'Этот телефон не привязан ни к одному человеку. Добавь своё имя в разделе «Люди».',
      'Нет запланированных объектов с адресом.', 'Зона']
  };

  /* Ajoute ces textes au dictionnaire de casô, sans écraser une traduction qui existe déjà. */
  function addTranslations(data) {
    Object.keys(TR).forEach(function (l) {
      var d = data[l];
      if (!d) return;
      K.forEach(function (k, i) { if (!(k in d)) d[k] = TR[l][i]; });
    });
  }

  function create(env) {
    var P = env.P, G = env.G;
    var st = env.load() || {};
    if (!st.state) st.state = P.initial();
    st.sig = st.sig || '';
    st.asked = st.asked || 0;
    st.zones = st.zones || 0;
    var busy = false;
    var view = { me: null, plan: [], sites: {}, missing: [] };

    function store() { env.store(st); }
    function T(s) { return env.T ? env.T(s) : s; }

    /* ---------- qui tient ce téléphone ---------- */
    function meId() {
      var db = env.db(), P0 = db.people || [];
      var u = String((env.sync() || {}).user || '').trim().toLowerCase();
      var a = env.account() || {};
      var n = u || String(a.prenom || '').split(' ')[0].toLowerCase() ||
        String((db.me && db.me.prenom) || '').toLowerCase();
      var f = P0.filter(function (p) { return String(p.nom || '').toLowerCase() === n; })[0];
      if (f) return f.id;
      if (P0.length === 1) return P0[0].id;
      return null;
    }

    /* ---------- rendez-vous de la personne : 2 jours passés, aujourd'hui, demain ---------- */
    function at(day, hm) { return new Date(day + 'T' + hm + ':00').getTime(); }
    function buildPlan(me) {
      var db = env.db(), today = env.agToday(), plan = [], upcoming = [];
      for (var k = -2; k <= 1; k++) {
        var d = env.agAdd(today, k);
        env.agDayEvents(d).forEach(function (e) {
          if (e.t !== 'rdv' || !e.a || (e.who || []).indexOf(me) < 0) return;
          var cl = e.cid && (db.clients || []).filter(function (c) { return c.id === e.cid; })[0];
          if (!(e.ch || e.adr || (cl && cl.adr))) return;
          var cid = env.agChFor(e);
          var start = at(d, e.a), end = e.b ? at(d, e.b) : start + 3600000;
          plan.push({ id: e.id + ':' + d, siteId: cid, start: start, end: end, addr: e.adr || (cl && cl.adr) || '' });
          if (k >= 0 && upcoming.indexOf(cid) < 0) upcoming.push(cid);
        });
      }
      return { plan: plan, upcoming: upcoming };
    }

    function chantier(id) { return (env.db().chantiers || []).filter(function (c) { return c.id === id; })[0]; }
    function siteName(id) { var c = chantier(id); return c ? c.nom : ''; }

    /* ---------- coordonnées du chantier : une seule recherche par chantier ---------- */
    async function geocode(c, addr) {
      if (c.geo || !env.online()) return;
      var q = addr || c.nom;
      if (!q) return;
      try {
        var r = await env.fetch('https://data.geopf.fr/geocodage/search?limit=1&q=' + encodeURIComponent(q));
        if (!r.ok) return;
        var j = await r.json();
        var f = (j.features || [])[0];
        if (!f || !f.geometry || !f.geometry.coordinates) return;
        c.geo = { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] };
        if (!c.rayon) c.rayon = 100;
        env.save();
      } catch (e) {}
    }

    /* ---------- écriture dans le pointage existant ---------- */
    function write(fx, me) {
      var db = env.db(), last = env.lastEv(me);
      if (last && last.t === fx.kind && (fx.kind === 'out' || last.c === fx.siteId) &&
        Math.abs(last.ts - fx.at) < 12 * 3600 * 1000) return false;
      var flag = fx.flag === 'a_verifier' ? ' · à vérifier' : '';
      if (fx.kind === 'in' && last && last.t === 'in' && last.c !== fx.siteId) {
        db.pts.push({ id: env.uid(), c: last.c, p: me, t: 'out', ts: fx.at, note: 'automatique (changement de chantier)' });
      }
      db.pts.push({ id: env.uid(), c: fx.siteId, p: me, t: fx.kind, ts: fx.at, note: 'automatique (GPS)' + flag });
      env.save();
      return true;
    }

    function apply(ev, ctx, me) {
      var r = P.stepNative(st.state, ev, ctx), wrote = false;
      st.state = r.state;
      r.effects.forEach(function (fx) {
        if (fx.type !== 'record') return;
        if (write(fx, me)) wrote = true;
        st.since = fx.kind === 'in' ? fx.at : null;
      });
      return wrote;
    }

    /* ---------- autorisations ---------- */
    function granted(s) { return s && s.location === 'granted' && s.background === 'granted'; }
    async function perms() {
      try {
        var s = await G.status();
        if (!granted(s) && env.now() - st.asked > DAY) {
          st.asked = env.now(); store();
          s = await G.ensurePermissions();
        }
        st.permBad = !granted(s);
      } catch (e) {}
    }
    async function fix() {
      try {
        var s = await G.ensurePermissions();
        if (!granted(s)) await G.openSettings();
      } catch (e) {}
      run();
    }

    /* ---------- cycle : à chaque réveil ---------- */
    function signature() { return JSON.stringify([status(), st.zones]); }

    async function run() {
      if (busy) return;
      busy = true;
      var before = '', wrote = false;
      try {
        var db = env.db();
        if (!db || !db.people || !db.chantiers || !db.pts) return;
        before = signature();
        var me = meId();
        view.me = me;
        if (!me) return;

        var built = buildPlan(me), sites = {}, list = [], addr = {};
        built.plan.forEach(function (p) { addr[p.siteId] = p.addr; });
        for (var cid in addr) {
          var c = chantier(cid);
          if (!c) continue;
          await geocode(c, addr[cid]);
          if (c.geo) sites[cid] = { lat: c.geo.lat, lng: c.geo.lng, radius: c.rayon || 100 };
        }
        view.plan = built.plan; view.sites = sites;
        view.missing = built.upcoming.filter(function (cid) { return !sites[cid]; });
        built.upcoming.forEach(function (cid) {
          if (sites[cid]) list.push({ id: cid, lat: sites[cid].lat, lng: sites[cid].lng, radius: sites[cid].radius });
        });
        st.zones = list.length;

        if (list.length) await perms(); else st.permBad = false;

        var sig = env.agToday() + JSON.stringify(list);
        if (sig !== st.sig) {
          if (list.length) await G.setGeofences({ sites: list }); else await G.clearGeofences();
          st.sig = sig;
        }

        var r = await G.drainEvents();
        var evs = (r.events || []).slice().sort(function (a, b) { return a.ts - b.ts; });
        var ctx = { sites: sites, plan: built.plan };
        evs.forEach(function (e) { if (apply({ type: e.type, at: e.ts, siteId: e.site }, ctx, me)) wrote = true; });
        if (apply({ type: 'tick', at: env.now() }, ctx, me)) wrote = true;
        store();
      } catch (e) {
      } finally {
        busy = false;
        if (wrote || (before && before !== signature())) env.onChange();
      }
    }

    /* ---------- ce que voit la personne ---------- */
    function status() {
      var now = env.now(), s = st.state;
      if (!view.me) return { k: 'noone' };
      if (st.permBad) return { k: 'perm' };
      if (s.phase === 'onsite') return { k: 'onsite', site: siteName(s.siteId), since: st.since };
      if (s.phase === 'leaving') return { k: 'leaving', site: siteName(s.siteId) };
      if (view.missing.length) return { k: 'nogeo', site: siteName(view.missing[0]) };
      var nx = view.plan.filter(function (p) {
        return !s.done[p.id] && p.end > now && view.sites[p.siteId];
      }).sort(function (a, b) { return a.start - b.start; })[0];
      if (nx) return { k: 'next', site: siteName(nx.siteId), at: nx.start };
      return { k: 'none' };
    }

    /* Le pointage manuel s'efface seulement quand l'automatique tourne vraiment. */
    function active() { return !!view.me && !st.permBad && st.zones > 0; }

    function body() {
      var s = status(), e = env.esc;
      switch (s.k) {
        case 'onsite':
          return '<div class="tot"><span>' + T('Sur place') + ' · <span data-noi18n>' + e(s.site) + '</span></span>' +
            (s.since ? '<b data-noi18n>' + T('depuis') + ' ' + env.fmtT(s.since) + '</b>' : '') + '</div>';
        case 'leaving':
          return '<div class="mut">' + T('Sortie en cours de confirmation') + ' · <span data-noi18n>' + e(s.site) + '</span></div>';
        case 'next':
          return '<div class="tot"><span data-noi18n>' + e(s.site) + '</span><b data-noi18n>' + env.fmtT(s.at) + '</b></div>' +
            '<div class="mut">' + T('Prochain chantier') + '</div>';
        case 'nogeo':
          return '<div class="mut">' + T('Adresse introuvable') + ' · <span data-noi18n>' + e(s.site) + '</span></div>';
        case 'perm':
          return '<div class="mut">' + T('Autorise la position « Toujours » pour pointer tout seul.') + '</div>' +
            '<button class="btn" onclick="CasoAuto.fix()">' + T('Autoriser') + '</button>';
        case 'noone':
          return '<div class="mut">' + T('Ce téléphone n’est lié à aucune personne. Ajoute ton prénom dans Personnes.') + '</div>';
        default:
          return '<div class="mut">' + T('Aucun chantier prévu avec une adresse.') + '</div>';
      }
    }
    function card() {
      return '<div class="card"><h2><span class="hi"><svg class="i"><use href="#i-helmet"/></svg></span>' +
        T('Pointage automatique') + '</h2>' + body() + '</div>';
    }
    function line() { return '<div style="margin:8px 0">' + body() + '</div>'; }
    function zone(c) {
      return c && c.geo ? '<div class="mut">' + T('Zone') + ' ' + (c.rayon || 100) + ' m</div>' : '';
    }

    return { run: run, fix: fix, status: status, active: active, card: card, line: line, zone: zone, state: function () { return st; } };
  }

  /* ---------- branchement réel, seulement dans l'appli Android ---------- */
  function boot() {
    var Cap = root.Capacitor;
    if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform() || Cap.getPlatform() !== 'android') return;
    if (!root.CasoPointage) return;
    var KEY = 'caso_geo_state';
    if (typeof I18N_DATA !== 'undefined') {
      addTranslations(I18N_DATA);
      if (typeof I18N !== 'undefined') I18N.rx = {};
    }
    var api = create({
      P: root.CasoPointage,
      G: Cap.registerPlugin('CasoGeofence'),
      db: function () { return db; },
      sync: function () { return getSync(); },
      account: function () { return accountGet(); },
      agToday: function () { return agToday(); },
      agAdd: function (d, n) { return agAdd(d, n); },
      agDayEvents: function (d) { return agDayEvents(d); },
      agChFor: function (e) { return agChFor(e); },
      lastEv: function (p) { return lastEv(p); },
      uid: function () { return uid(); },
      save: function () { save(); },
      esc: function (s) { return esc(s); },
      fmtT: function (t) { return fmtT(t); },
      T: function (s) { return typeof i18nT === 'function' ? i18nT(s) : s; },
      fetch: function (u) { return root.fetch(u); },
      online: function () { return root.navigator.onLine !== false; },
      now: function () { return Date.now(); },
      load: function () { try { return JSON.parse(root.localStorage.getItem(KEY)); } catch (e) { return null; } },
      store: function (s) { try { root.localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} },
      onChange: function () {
        var s = root.document.getElementById('s-pt');
        if (s && s.classList.contains('on') && typeof renderPt === 'function') renderPt();
      }
    });
    root.CasoAuto = api;
    root.setTimeout(api.run, 3000);
    root.document.addEventListener('visibilitychange', function () { if (!root.document.hidden) api.run(); });
    root.setInterval(function () { if (!root.document.hidden) api.run(); }, 60000);
  }

  if (typeof module === 'object' && module.exports) module.exports = { create: create, K: K, TR: TR, addTranslations: addTranslations };
  else boot();
})(typeof self !== 'undefined' ? self : this);

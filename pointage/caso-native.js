/*
 * casô · pointage automatique (appli Android)
 *
 * Ce fichier relie trois choses : l'agenda de casô, les zones surveillées par
 * Android et le pointage existant. Il n'a aucun écran propre : il fournit la
 * carte du jour à l'écran Pointage (window.CasoAuto) et écrit dans db.pts.
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
  var K = ["Pointage automatique", "Sur place", "depuis", "Départ en cours", "Prochain chantier", "Attendu sur place", "Demain", "Terminé", "Absent", "Adresse introuvable", "Autorisation requise", "Autorise la position « Toujours » pour pointer tout seul.", "Autoriser", "Ce téléphone n’est lié à aucune personne. Ajoute ton prénom dans Personnes.", "Zone", "Autorise la position pour pointer tout seul quand casô est ouvert.", "GPS actif", "Aucun chantier prévu aujourd’hui ou demain avec une adresse.", "GPS activé", "GPS refusé", "GPS pas encore activé", "Activer le GPS"];
  var TR = {
    en: ["Automatic clocking", "On site", "since", "Leaving", "Next job site", "Expected on site", "Tomorrow", "Done", "Absent", "Address not found", "Permission needed", "Allow location “Always” to clock in automatically.", "Allow", "This phone isn’t linked to anyone. Add your first name under People.", "Zone", "Allow location to clock in automatically while casô is open.", "GPS on", "No job site with an address planned today or tomorrow.", "GPS on", "GPS refused", "GPS not turned on yet", "Turn on GPS"],
    pt: ["Ponto automático", "No local", "desde", "A sair", "Próxima obra", "Esperado no local", "Amanhã", "Concluído", "Ausente", "Morada não encontrada", "Autorização necessária", "Autoriza a posição «Sempre» para picar o ponto automaticamente.", "Autorizar", "Este telemóvel não está associado a nenhuma pessoa. Adiciona o teu nome próprio em Pessoas.", "Zona", "Autoriza a posição para picar o ponto automaticamente com o casô aberto.", "GPS ativo", "Nenhuma obra com morada prevista hoje ou amanhã.", "GPS ativado", "GPS recusado", "GPS ainda não ativado", "Ativar o GPS"],
    es: ["Fichaje automático", "En la obra", "desde", "Saliendo", "Próxima obra", "Esperado en la obra", "Mañana", "Terminado", "Ausente", "Dirección no encontrada", "Permiso necesario", "Permite la ubicación «Siempre» para fichar automáticamente.", "Permitir", "Este teléfono no está vinculado a ninguna persona. Añade tu nombre en Personas.", "Zona", "Permite la ubicación para fichar automáticamente con casô abierto.", "GPS activo", "Ninguna obra con dirección prevista hoy o mañana.", "GPS activado", "GPS rechazado", "GPS aún no activado", "Activar el GPS"],
    it: ["Timbratura automatica", "In cantiere", "dalle", "In uscita", "Prossimo cantiere", "Atteso in cantiere", "Domani", "Terminato", "Assente", "Indirizzo non trovato", "Autorizzazione necessaria", "Consenti la posizione «Sempre» per timbrare automaticamente.", "Consenti", "Questo telefono non è collegato a nessuna persona. Aggiungi il tuo nome in Persone.", "Zona", "Consenti la posizione per timbrare automaticamente con casô aperto.", "GPS attivo", "Nessun cantiere con indirizzo previsto oggi o domani.", "GPS attivo", "GPS rifiutato", "GPS non ancora attivo", "Attiva il GPS"],
    ro: ["Pontaj automat", "Pe șantier", "de la", "Pleacă", "Următorul șantier", "Așteptat pe șantier", "Mâine", "Terminat", "Absent", "Adresa nu a fost găsită", "Permisiune necesară", "Permite locația „Întotdeauna” pentru pontaj automat.", "Permite", "Acest telefon nu este asociat niciunei persoane. Adaugă-ți prenumele în Persoane.", "Zonă", "Permite locația pentru pontaj automat cât timp casô este deschis.", "GPS activ", "Niciun șantier cu adresă planificat azi sau mâine.", "GPS activat", "GPS refuzat", "GPS încă neactivat", "Activează GPS-ul"],
    tr: ["Otomatik puantaj", "Şantiyede", "giriş:", "Çıkıyor", "Sıradaki şantiye", "Şantiyede bekleniyor", "Yarın", "Bitti", "Yok", "Adres bulunamadı", "İzin gerekli", "Otomatik puantaj için konuma «Her zaman» izni ver.", "İzin ver", "Bu telefon hiçbir kişiyle eşleşmedi. Adını Kişiler bölümüne ekle.", "Bölge", "casô açıkken otomatik giriş için konuma izin ver.", "GPS açık", "Bugün veya yarın adresli şantiye yok.", "GPS açık", "GPS reddedildi", "GPS henüz açılmadı", "GPS'i aç"],
    pl: ["Automatyczny czas pracy", "Na budowie", "od", "Wychodzi", "Następna budowa", "Oczekiwany na budowie", "Jutro", "Zakończone", "Nieobecny", "Nie znaleziono adresu", "Wymagane zezwolenie", "Zezwól na lokalizację „Zawsze”, aby rejestrować czas pracy automatycznie.", "Zezwól", "Ten telefon nie jest przypisany do żadnej osoby. Dodaj swoje imię w sekcji Osoby.", "Strefa", "Zezwól na lokalizację, aby rejestrować czas automatycznie, gdy casô jest otwarte.", "GPS włączony", "Brak budowy z adresem na dziś lub jutro.", "GPS włączony", "GPS odrzucony", "GPS jeszcze nie włączony", "Włącz GPS"],
    ar: ["الحضور التلقائي", "في الورشة", "منذ", "يغادر", "الورشة التالية", "في انتظاره بالورشة", "غدًا", "انتهى", "غائب", "لم يتم العثور على العنوان", "الإذن مطلوب", "اسمح بالموقع «دائمًا» لتسجيل الحضور تلقائيًا.", "السماح", "هذا الهاتف غير مرتبط بأي شخص. أضف اسمك الشخصي في الأشخاص.", "منطقة", "اسمح بالموقع للتسجيل التلقائي أثناء فتح casô.", "GPS مفعّل", "لا ورشة بعنوان مقررة اليوم أو غداً.", "GPS مفعّل", "GPS مرفوض", "GPS غير مفعّل بعد", "تفعيل GPS"],
    ru: ["Автоматический учёт времени", "На объекте", "с", "Уходит", "Следующий объект", "Ожидается на объекте", "Завтра", "Завершено", "Отсутствует", "Адрес не найден", "Нужно разрешение", "Разреши геопозицию «Всегда», чтобы время учитывалось автоматически.", "Разрешить", "Этот телефон не привязан ни к одному человеку. Добавь своё имя в разделе «Люди».", "Зона", "Разрешите геолокацию для автоматического учёта, пока casô открыт.", "GPS включён", "На сегодня или завтра нет объектов с адресом.", "GPS включён", "GPS запрещён", "GPS ещё не включён", "Включить GPS"]
  };

  /* Ajoute ces textes au dictionnaire de casô, sans écraser une traduction qui existe déjà. */
  function addTranslations(data) {
    Object.keys(TR).forEach(function (l) {
      var d = data[l];
      if (!d) return;
      K.forEach(function (k, i) { if (!(k in d)) d[k] = TR[l][i]; });
    });
  }

  /* Style de la carte : couleurs de casô, translucides pour suivre le mode sombre. */
  var CSS =
    '.au{padding:18px}' +
    '.au-cap{font:600 11px/1 var(--mono,ui-monospace,monospace);letter-spacing:.08em;text-transform:uppercase;color:var(--mut)}' +
    '.au-pill{display:inline-flex;align-items:center;gap:8px;margin:12px 0 10px;padding:6px 12px;border-radius:999px;font-weight:700;font-size:14px;background:var(--soft);color:var(--mut)}' +
    '.au-pill i{flex:none;width:9px;height:9px;border-radius:50%;background:currentColor}' +
    '.au-pill.on{background:#16854a24;color:var(--ok,#16854a)}' +
    '.au-pill.wait{background:#ffc21a33;color:var(--ink)}' +
    '.au-pill.bad{background:#c6282820;color:var(--ko,#c62828)}' +
    '.au-name{font-size:22px;font-weight:800;line-height:1.2;overflow-wrap:anywhere}' +
    '.au-sub{margin-top:4px;font-size:15px;color:var(--mut);font-variant-numeric:tabular-nums}' +
    '.au-big{font-size:34px;font-weight:800;line-height:1.1;font-variant-numeric:tabular-nums}' +
    '.au-btn{margin-top:14px}' +
    '.au-list{margin-top:16px;border-top:1px solid var(--line)}' +
    '.au-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}' +
    '.au-row:last-child{border-bottom:0;padding-bottom:0}' +
    '.au-dot{flex:none;width:10px;height:10px;border-radius:50%;border:2px solid var(--line)}' +
    '.au-row.done .au-dot{background:var(--ok,#16854a);border-color:var(--ok,#16854a)}' +
    '.au-row.now .au-dot{background:var(--acc,#ffc21a);border-color:var(--acc-d,#c99700)}' +
    '.au-row.absent .au-dot{border-color:var(--ko,#c62828)}' +
    '.au-n{flex:1;min-width:0;font-weight:600;overflow-wrap:anywhere}' +
    '.au-t{flex:none;font-size:14px;color:var(--mut);font-variant-numeric:tabular-nums}' +
    '.au-row.now .au-t{color:var(--ink);font-weight:700}';

  function create(env) {
    var P = env.P, G = env.G;
    var st = env.load() || {};
    if (!st.state) st.state = P.initial();
    st.sig = st.sig || '';
    st.asked = st.asked || 0;
    st.zones = st.zones || 0;
    st.log = st.log || {};
    var busy = false;
    var view = { me: null, plan: [], sites: {}, missing: [] };

    function store() { env.store(st); }
    function T(s) { return env.T ? env.T(s) : s; }

    /* ---------- qui tient ce téléphone ---------- */
    /* le téléphone d'un collaborateur (équipe d'un patron) ou celui de l'artisan lui-même */
    function proprio() { var r = (env.sync() || {}).role; return !(r === 'ouvrier' || r === 'chef'); }
    function meId() {
      var db = env.db(), P0 = db.people || [];
      var u = String((env.sync() || {}).user || '').trim().toLowerCase();
      var a = env.account() || {};
      var n = u || String(a.prenom || '').split(' ')[0].toLowerCase() ||
        String((db.me && db.me.prenom) || '').toLowerCase();
      var f = P0.filter(function (p) { return p.moi || (n && String(p.nom || '').toLowerCase().split(' ')[0] === n); })[0];
      if (f) return f.id;
      if (P0.length === 1 && (!proprio() || !n)) return P0[0].id;
      /* l'artisan lui-même : sa fiche « moi » est créée la première fois (elle n'apparaît pas dans Mon équipe) */
      if (proprio() && (a.prenom || (db.me && db.me.prenom))) {
        var me = { id: 'moi', nom: String(a.prenom || db.me.prenom).split(' ')[0], moi: true, role: 'patron', at: env.now() };
        if (!P0.some(function (p) { return p.id === 'moi'; })) { (db.people = P0).push(me); env.save(); }
        return 'moi';
      }
      return null;
    }

    /* ---------- rendez-vous de la personne : 2 jours passés, aujourd'hui, demain ---------- */
    function at(day, hm) { return new Date(day + 'T' + hm + ':00').getTime(); }
    function buildPlan(me) {
      var db = env.db(), today = env.agToday(), plan = [], upcoming = [];
      for (var k = -2; k <= 1; k++) {
        var d = env.agAdd(today, k);
        env.agDayEvents(d).forEach(function (e) {
          /* rendez-vous de cette personne ; un rendez-vous sans équipe cochée est celui de l'artisan (le chat n'en coche pas) */
          var who = e.who || [];
          if (e.t !== 'rdv' || !e.a || (who.indexOf(me) < 0 && !(who.length === 0 && me === 'moi'))) return;
          var cl = e.cid && (db.clients || []).filter(function (c) { return c.id === e.cid; })[0];
          if (!(e.ch || e.adr || (cl && cl.adr))) return;
          var cid = env.agChFor(e);
          var start = at(d, e.a), end = e.b ? at(d, e.b) : start + 3600000;
          plan.push({ id: e.id + ':' + d, siteId: cid, start: start, end: end, addr: e.adr || (cl && cl.adr) || '' });
          if (k >= 0 && upcoming.indexOf(cid) < 0) upcoming.push(cid);
        });
      }
      /* chantiers « GPS toujours » : surveillés chaque jour de 6 h à 20 h, même sans rendez-vous au planning
         (une arrivée et un départ par jour ; pas d'« attendu » ni d'« absent » : personne n'y est attendu à une heure précise) */
      (db.chantiers || []).forEach(function (c) {
        if (!c.toujours || !(c.adr || c.geo)) return;
        for (var j = -2; j <= 1; j++) {
          var dj = env.agAdd(today, j);
          plan.push({ id: 'tj:' + c.id + ':' + dj, siteId: c.id, start: at(dj, '06:00'), end: at(dj, '20:00'), addr: c.adr || '', toujours: true });
        }
        if (upcoming.indexOf(c.id) < 0) upcoming.push(c.id);
      });
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
        var l = st.log[fx.apptId] || (st.log[fx.apptId] = {});
        l[fx.kind] = fx.at;
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
    function signature() { return JSON.stringify([status(), todayRows(), st.zones]); }

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

        /* état de l'autorisation, affiché même sans chantier prévu (sans rien demander à l'usager) */
        try { var gs = await G.status(); st.gps = granted(gs) ? 'on' : (gs && gs.location === 'denied' ? 'denied' : 'off'); } catch (e) {}
        var built = buildPlan(me), sites = {}, list = [], addr = {};
        built.plan.forEach(function (p) { addr[p.siteId] = p.addr; });
        for (var cid in addr) {
          var c = chantier(cid);
          if (!c) continue;
          await geocode(c, addr[cid]);
          if (c.geo) sites[cid] = { lat: c.geo.lat, lng: c.geo.lng, radius: c.rayon || 100 };
        }
        var n3 = 0;
        (db.chantiers || []).forEach(function (c) { if (!c.geo && c.adr && n3 < 3) { n3++; geocode(c, c.adr); } });
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

    /* ---------- la journée ---------- */
    function todayRows() {
      var day = env.agToday(), s0 = at(day, '00:00'), s1 = s0 + DAY, s = st.state;
      return view.plan.filter(function (p) { return p.start >= s0 && p.start < s1 && (!p.toujours || (st.log[p.id] && st.log[p.id].in)); })
        .sort(function (a, b) { return a.start - b.start; })
        .map(function (p) {
          var l = st.log[p.id] || {}, k = 'todo';
          if (l.out) k = 'done'; else if (l.in) k = 'now';
          else if (s.done[p.id] === 'absent' || p.end + P.DEFAULTS.endGraceMin * 60000 < env.now()) k = 'absent';
          return { k: k, name: siteName(p.siteId), start: p.start, in: l.in || null, out: l.out || null };
        });
    }

    function status() {
      var now = env.now(), s = st.state;
      if (!view.me) return { k: 'noone' };
      if (st.permBad) return { k: 'perm' };
      if (s.phase === 'onsite') return { k: 'onsite', site: siteName(s.siteId), since: st.since };
      if (s.phase === 'leaving') return { k: 'leaving', site: siteName(s.siteId) };
      if (view.missing.length) return { k: 'nogeo', site: siteName(view.missing[0]) };
      var nx = view.plan.filter(function (p) {
        return !p.toujours && !s.done[p.id] && p.end > now && view.sites[p.siteId];
      }).sort(function (a, b) { return a.start - b.start; })[0];
      if (nx) return { k: 'next', site: siteName(nx.siteId), at: nx.start, tomorrow: nx.start >= at(env.agToday(), '00:00') + DAY };
      var tj = []; view.plan.forEach(function (p) { if (p.toujours && view.sites[p.siteId] && tj.indexOf(p.siteId) < 0) tj.push(p.siteId); });
      if (tj.length && !todayRows().length) return { k: 'watch', site: tj.map(siteName).join(' · ') };
      var rows = todayRows();
      if (rows.length) {
        var total = 0;
        rows.forEach(function (r) { if (r.in && r.out) total += r.out - r.in; });
        return { k: 'done', total: total };
      }
      return { k: 'none' };
    }

    /* Le pointage manuel s'efface seulement quand l'automatique tourne vraiment. */
    function active() { return !!view.me && !st.permBad && st.zones > 0; }

    /* ---------- ce que voit la personne ---------- */
    function pill(cls, text) { return '<div class="au-pill ' + cls + '" role="status"><i></i>' + text + '</div>'; }
    function nm(site) { return '<div class="au-name" data-noi18n>' + env.esc(site) + '</div>'; }
    function sub(text) { return '<div class="au-sub" data-noi18n>' + text + '</div>'; }

    function head(s) {
      switch (s.k) {
        case 'onsite':
          return pill('on', T('Sur place')) + nm(s.site) + (s.since ? sub(T('depuis') + ' ' + env.fmtT(s.since)) : '');
        case 'leaving':
          return pill('wait', T('Départ en cours')) + nm(s.site);
        case 'next':
          return pill('wait', s.at > env.now() ? T('Prochain chantier') : T('Attendu sur place')) + nm(s.site) +
            sub((s.tomorrow ? T('Demain') + ' ' : '') + env.fmtT(s.at));
        case 'watch':
          return pill('wait', T('GPS actif')) + nm(s.site);
        case 'done':
          return pill('', T('Terminé')) + (s.total ? '<div class="au-big" data-noi18n>' + env.fmtH(s.total) + '</div>' : '');
        case 'nogeo':
          return pill('bad', T('Adresse introuvable')) + nm(s.site);
        case 'perm':
          return pill('bad', T('Autorisation requise')) + '<div class="au-sub">' +
            T(env.web ? 'Autorise la position pour pointer tout seul quand casô est ouvert.' : 'Autorise la position « Toujours » pour pointer tout seul.') + '</div>' +
            '<button class="btn au-btn" onclick="CasoAuto.fix()">' + T('Autoriser') + '</button>';
        case 'noone':
          return '<div class="au-sub">' + T('Ce téléphone n’est lié à aucune personne. Ajoute ton prénom dans Personnes.') + '</div>';
        default:
          return gpsLine() + '<div class="au-sub">' + T('Aucun chantier prévu aujourd’hui ou demain avec une adresse.') + '</div>';
      }
    }

    /* état du GPS de ce téléphone, et le bouton pour l'activer */
    function gpsLine() {
      if (st.gps === 'on') return pill('on', T('GPS activé'));
      return pill('bad', st.gps === 'denied' ? T('GPS refusé') : T('GPS pas encore activé')) +
        '<button class="btn au-btn" onclick="CasoAuto.fix()">' + T('Activer le GPS') + '</button>';
    }
    function rowRight(r) {
      if (r.k === 'done') return env.fmtT(r.in) + ' – ' + env.fmtT(r.out);
      if (r.k === 'now') return T('Sur place');
      if (r.k === 'absent') return T('Absent');
      return env.fmtT(r.start);
    }
    function list(s) {
      var rows = todayRows();
      if (!rows.length || (rows.length === 1 && s.k !== 'done')) return '';
      return '<div class="au-list">' + rows.map(function (r) {
        return '<div class="au-row ' + r.k + '"><i class="au-dot"></i><span class="au-n" data-noi18n>' + env.esc(r.name) +
          '</span><span class="au-t" data-noi18n>' + rowRight(r) + '</span></div>';
      }).join('') + '</div>';
    }

    function card() {
      var s = status();
      return '<div class="card au"><div class="au-cap">' + T('Pointage automatique') + '</div>' + head(s) + list(s) + '</div>';
    }
    function line() { return '<div class="au-line">' + head(status()) + '</div>'; }
    function zone(c) {
      return c && c.geo ? '<div class="mut">' + T('Zone') + ' ' + (c.rayon || 100) + ' m</div>' : '';
    }

    return {
      run: run, fix: fix, status: status, active: active, card: card, line: line, zone: zone, gpsLine: gpsLine,
      gps: function () { return st.gps || null; },
      rows: todayRows, state: function () { return st; }
    };
  }

  /* ---------- branchement réel, seulement dans l'appli Android ---------- */
  function boot() {
    var Cap = root.Capacitor, G, web = false;
    if (!root.CasoPointage) return;
    if (Cap && Cap.isNativePlatform && Cap.isNativePlatform() && (Cap.getPlatform() === 'android' || Cap.getPlatform() === 'ios')) {
      G = Cap.registerPlugin('CasoGeofence');
    } else if (root.CasoGeoWeb && root.navigator && root.navigator.geolocation && root.matchMedia &&
      (root.matchMedia('(pointer: coarse)').matches || root.navigator.maxTouchPoints > 0)) {
      // téléphone ou tablette, site ouvert : la position n'est lue que casô ouvert
      web = true;
      G = root.CasoGeoWeb.create({
        geo: root.navigator.geolocation,
        perm: function () {
          return root.navigator.permissions && root.navigator.permissions.query
            ? root.navigator.permissions.query({ name: 'geolocation' }).then(function (r) { return r.state; })
            : Promise.resolve('prompt');
        },
        now: function () { return Date.now(); },
        load: function () { try { return JSON.parse(root.localStorage.getItem('caso_geoweb')); } catch (e) { return null; } },
        store: function (o) { try { root.localStorage.setItem('caso_geoweb', JSON.stringify(o)); } catch (e) {} }
      });
    } else return;
    var KEY = 'caso_geo_state';
    if (typeof I18N_DATA !== 'undefined') {
      addTranslations(I18N_DATA);
      if (typeof I18N !== 'undefined') I18N.rx = {};
    }
    var style = root.document.createElement('style');
    style.textContent = CSS;
    root.document.head.appendChild(style);
    var api = create({
      P: root.CasoPointage,
      G: G,
      web: web,
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
      fmtH: function (ms) { return fmtH(ms); },
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

  if (typeof module === 'object' && module.exports) module.exports = { create: create, K: K, TR: TR, CSS: CSS, addTranslations: addTranslations };
  else boot();
})(typeof self !== 'undefined' ? self : this);

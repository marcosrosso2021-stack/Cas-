/*
 * casô · pointage automatique par zones
 *
 * Aucun bouton, aucun écran. Le moteur ne lit pas le GPS en continu :
 * il décide quand l'allumer et quand l'éteindre.
 *
 *   veille  ->  trajet  ->  sur place  ->  sortie  ->  veille
 *   GPS éteint  GPS bas     GPS éteint     1 position   GPS éteint
 *               conso       (alerte de     pour confirmer
 *                           sortie seule)  puis arrêt
 *
 * Le moteur est pur : il reçoit un évènement, renvoie un nouvel état et une
 * liste d'effets à exécuter (allumer/éteindre le GPS, armer une zone,
 * enregistrer une entrée ou une sortie). Il ne touche ni au GPS ni au
 * stockage, ce qui permet de le brancher sur l'appli native (zones du
 * système) et de le tester sans téléphone.
 *
 * Évènements : { type:'tick', at }
 *              { type:'enter'|'exit', at, siteId }   (zones du système)
 *              { type:'fix', at, lat, lng, acc }      (position, GPS allumé)
 * ctx        : { sites:{id:{lat,lng,radius}}, plan:[{id,siteId,start,end}], cfg? }
 * Les temps sont en millisecondes.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CasoPointage = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DEFAULTS = {
    armBeforeMin: 45,      // le GPS s'allume 45 min avant le rendez-vous
    lateGraceMin: 120,     // sans arrivée 2 h après l'heure prévue : absence, GPS éteint
    dwellInSec: 60,        // il faut rester 60 s dans la zone : un passage en voiture ne compte pas
    exitMarginM: 25,       // la zone de sortie est plus large que la zone d'entrée
    maxAccM: 80,           // position plus imprécise que 80 m : ignorée
    leavingTimeoutMin: 10, // sortie sans position fiable en 10 min : enregistrée, à vérifier
    endGraceMin: 90,       // pas de sortie 90 min après la fin prévue : clôturée, à vérifier
    earlyMin: 120,         // appli installée : une arrivée jusqu'à 2 h avant l'heure prévue compte
    reenterGraceMin: 10,   // appli installée : sortie suivie d'un retour en moins de 10 min = fausse sortie
    pendingMaxMin: 30,     // appli installée : entrée sans présence de 60 s au bout de 30 min = simple passage
    followUpMin: 60,       // PWA : une seule relance 60 min après la fin prévue
    tapWindowMin: 60       // PWA : au-delà de 60 min après la fin prévue, la sortie est datée à la fin prévue
  };

  function rad(d) { return d * Math.PI / 180; }
  function dist(a, b) {
    var R = 6371000;
    var dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    var h = Math.pow(Math.sin(dLat / 2), 2) +
      Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.pow(Math.sin(dLng / 2), 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function initial() {
    return { phase: 'idle', apptId: null, siteId: null, pendingInAt: null, pendingOutAt: null, done: {}, pushed: {} };
  }
  function clone(s) {
    return { phase: s.phase, apptId: s.apptId, siteId: s.siteId, pendingInAt: s.pendingInAt,
      pendingOutAt: s.pendingOutAt, done: Object.assign({}, s.done), pushed: Object.assign({}, s.pushed) };
  }
  function toIdle(s) { s.phase = 'idle'; s.apptId = null; s.siteId = null; s.pendingInAt = null; s.pendingOutAt = null; }

  function findAppt(plan, id) {
    for (var i = 0; i < plan.length; i++) if (plan[i].id === id) return plan[i];
    return null;
  }
  function openAppt(plan, done, now, cfg) {
    var best = null;
    for (var i = 0; i < plan.length; i++) {
      var a = plan[i];
      if (done[a.id]) continue;
      if (now >= a.start - cfg.armBeforeMin * 60000 && now <= a.start + cfg.lateGraceMin * 60000) {
        if (!best || a.start < best.start) best = a;
      }
    }
    return best;
  }

  function step(state, ev, ctx) {
    var cfg = Object.assign({}, DEFAULTS, ctx.cfg || {});
    var s = clone(state), fx = [], now = ev.at;
    var site = s.siteId ? ctx.sites[s.siteId] : null;
    var appt = s.apptId ? findAppt(ctx.plan, s.apptId) : null;

    function record(kind, at, flag) {
      var r = { type: 'record', kind: kind, siteId: s.siteId, apptId: s.apptId, at: at };
      if (flag) r.flag = flag;
      fx.push(r);
    }

    if (s.phase === 'idle') {
      if (ev.type === 'tick') {
        var a = openAppt(ctx.plan, s.done, now, cfg);
        if (a) {
          s.phase = 'travel'; s.apptId = a.id; s.siteId = a.siteId;
          fx.push({ type: 'arm_enter', siteId: a.siteId });
          fx.push({ type: 'gps_on', accuracy: 'low' });
        }
      }
    } else if (s.phase === 'travel') {
      if (ev.type === 'tick') {
        if (appt && now > appt.start + cfg.lateGraceMin * 60000) {
          s.done[s.apptId] = 'absent';
          fx.push({ type: 'disarm', siteId: s.siteId }, { type: 'gps_off' });
          toIdle(s);
        }
      } else if (ev.type === 'enter' && ev.siteId === s.siteId) {
        if (s.pendingInAt == null) s.pendingInAt = now;
        fx.push({ type: 'gps_on', accuracy: 'high' });
      } else if (ev.type === 'fix' && site && ev.acc <= cfg.maxAccM) {
        var d = dist(ev, site);
        if (d <= site.radius) {
          if (s.pendingInAt == null) s.pendingInAt = now;
          if (now - s.pendingInAt >= cfg.dwellInSec * 1000) {
            record('in', s.pendingInAt);
            fx.push({ type: 'gps_off' });
            fx.push({ type: 'disarm', siteId: s.siteId });
            fx.push({ type: 'arm_exit', siteId: s.siteId, radius: site.radius + cfg.exitMarginM });
            s.phase = 'onsite'; s.pendingInAt = null;
          }
        } else {
          s.pendingInAt = null;
        }
      }
    } else if (s.phase === 'onsite') {
      if (ev.type === 'exit' && ev.siteId === s.siteId) {
        s.phase = 'leaving'; s.pendingOutAt = now;
        fx.push({ type: 'gps_on', accuracy: 'high' });
      } else if (ev.type === 'tick' && appt && now > appt.end + cfg.endGraceMin * 60000) {
        record('out', appt.end, 'a_verifier');
        s.done[s.apptId] = 'ok';
        fx.push({ type: 'disarm', siteId: s.siteId });
        toIdle(s);
      }
    } else if (s.phase === 'leaving') {
      if (ev.type === 'fix' && site && ev.acc <= cfg.maxAccM) {
        if (dist(ev, site) > site.radius) {
          record('out', s.pendingOutAt);
          s.done[s.apptId] = 'ok';
          fx.push({ type: 'gps_off' }, { type: 'disarm', siteId: s.siteId });
          toIdle(s);
        } else {
          // fausse alerte : toujours dans la zone
          s.phase = 'onsite'; s.pendingOutAt = null;
          fx.push({ type: 'gps_off' });
        }
      } else if (ev.type === 'tick' && now - s.pendingOutAt > cfg.leavingTimeoutMin * 60000) {
        record('out', s.pendingOutAt, 'a_verifier');
        s.done[s.apptId] = 'ok';
        fx.push({ type: 'gps_off' }, { type: 'disarm', siteId: s.siteId });
        toIdle(s);
      }
    }
    return { state: s, effects: fx };
  }

  /*
   * Version PWA (sans appli installée) : aucune position en arrière-plan.
   * Le serveur envoie des notifications, la position n'est lue que quand la
   * personne ouvre casô (appui sur la notification ou ouverture normale).
   *
   * Évènements : { type:'tick', at }                       (le serveur, chaque minute)
   *              { type:'open', at, lat, lng, acc }        (casô s'ouvre, position lue)
   * Effet en plus : { type:'push', kind:'start'|'end'|'follow', apptId, siteId, at }
   *
   * Arrivée : à l'ouverture dans la zone. Sortie : à l'ouverture hors de la zone,
   * sinon clôture à la fin prévue. Toute sortie PWA est marquée 'estime'.
   */
  function stepPwa(state, ev, ctx) {
    var cfg = Object.assign({}, DEFAULTS, ctx.cfg || {});
    var s = clone(state), fx = [], now = ev.at, MIN = 60000;
    var site = s.siteId ? ctx.sites[s.siteId] : null;
    var appt = s.apptId ? findAppt(ctx.plan, s.apptId) : null;

    function push(kind, a) {
      var k = a.id + ':' + kind;
      if (s.pushed[k]) return;
      s.pushed[k] = now;
      fx.push({ type: 'push', kind: kind, apptId: a.id, siteId: a.siteId, at: now });
    }
    function out(at) {
      fx.push({ type: 'record', kind: 'out', siteId: s.siteId, apptId: s.apptId, at: at, flag: 'estime' });
      s.done[s.apptId] = 'ok';
      toIdle(s);
    }

    if (s.phase === 'idle') {
      if (ev.type === 'open' && ev.acc <= cfg.maxAccM) {
        var a = openAppt(ctx.plan, s.done, now, cfg), asite = a && ctx.sites[a.siteId];
        if (a && asite && dist(ev, asite) <= asite.radius) {
          s.phase = 'onsite'; s.apptId = a.id; s.siteId = a.siteId;
          fx.push({ type: 'record', kind: 'in', siteId: a.siteId, apptId: a.id, at: now });
        }
      } else if (ev.type === 'tick') {
        ctx.plan.forEach(function (p) {
          if (!s.done[p.id] && now > p.start + cfg.lateGraceMin * MIN) s.done[p.id] = 'absent';
        });
        var b = openAppt(ctx.plan, s.done, now, cfg);
        if (b && now >= b.start) push('start', b);
      }
    } else if (s.phase === 'onsite') {
      if (ev.type === 'open' && ev.acc <= cfg.maxAccM && site && dist(ev, site) > site.radius) {
        out(appt && now - appt.end > cfg.tapWindowMin * MIN ? appt.end : now);
      } else if (ev.type === 'tick' && appt) {
        if (now > appt.end + cfg.endGraceMin * MIN) {
          out(appt.end);
        } else {
          if (now >= appt.end) push('end', appt);
          if (now >= appt.end + cfg.followUpMin * MIN) push('follow', appt);
        }
      }
    }
    return { state: s, effects: fx };
  }

  /*
   * Version appli Android installée, sans lecture du GPS par casô.
   * Les zones sont surveillées par le système, qui note l'heure de chaque passage
   * même quand casô est fermé. casô traite ces passages au réveil, avec leurs
   * heures réelles.
   *
   * Évènements : { type:'enter'|'dwell'|'exit', at, siteId }
   *                'dwell' = présence confirmée par le système (60 s dans la zone)
   *              { type:'tick', at }
   * Une sortie n'est enregistrée qu'après 10 min sans retour dans la zone.
   */
  function stepNative(state, ev, ctx) {
    var cfg = Object.assign({}, DEFAULTS, ctx.cfg || {});
    var s = clone(state), fx = [], now = ev.at, MIN = 60000;

    function rec(kind, at, flag) {
      var r = { type: 'record', kind: kind, siteId: s.siteId, apptId: s.apptId, at: at };
      if (flag) r.flag = flag;
      fx.push(r);
    }
    function apptFor(siteId, t) {
      var best = null;
      for (var i = 0; i < ctx.plan.length; i++) {
        var p = ctx.plan[i];
        if (p.siteId !== siteId || s.done[p.id]) continue;
        if (t >= p.start - cfg.earlyMin * MIN && t <= p.end + cfg.endGraceMin * MIN) {
          if (!best || p.start < best.start) best = p;
        }
      }
      return best;
    }
    function again() {
      var r = stepNative(s, ev, ctx);
      return { state: r.state, effects: fx.concat(r.effects) };
    }

    if (s.phase === 'idle') {
      if (ev.type === 'enter') {
        if (apptFor(ev.siteId, now)) { s.siteId = ev.siteId; s.pendingInAt = now; }
      } else if (ev.type === 'dwell') {
        var a = apptFor(ev.siteId, now);
        if (a) {
          var at = (s.pendingInAt != null && s.siteId === ev.siteId) ? s.pendingInAt : now;
          s.apptId = a.id; s.siteId = a.siteId; s.pendingInAt = null; s.phase = 'onsite';
          rec('in', at);
        }
      } else if (ev.type === 'exit') {
        if (s.siteId === ev.siteId) { s.pendingInAt = null; s.siteId = null; }
      } else if (ev.type === 'tick') {
        if (s.pendingInAt != null && now - s.pendingInAt > cfg.pendingMaxMin * MIN) { s.pendingInAt = null; s.siteId = null; }
      }
    } else if (s.phase === 'onsite') {
      var appt = findAppt(ctx.plan, s.apptId);
      if (ev.type === 'exit' && ev.siteId === s.siteId) {
        s.phase = 'leaving'; s.pendingOutAt = now;
      } else if (ev.type === 'tick' && appt && now > appt.end + cfg.endGraceMin * MIN) {
        rec('out', appt.end, 'a_verifier');
        s.done[s.apptId] = 'ok';
        toIdle(s);
      }
    } else if (s.phase === 'leaving') {
      var back = (ev.type === 'enter' || ev.type === 'dwell') && ev.siteId === s.siteId &&
        now - s.pendingOutAt <= cfg.reenterGraceMin * MIN;
      if (back) {
        s.phase = 'onsite'; s.pendingOutAt = null;
      } else if (now - s.pendingOutAt >= cfg.reenterGraceMin * MIN) {
        rec('out', s.pendingOutAt);
        s.done[s.apptId] = 'ok';
        toIdle(s);
        return again();
      }
    }
    return { state: s, effects: fx };
  }

  return { DEFAULTS: DEFAULTS, initial: initial, step: step, stepPwa: stepPwa, stepNative: stepNative, dist: dist };
});

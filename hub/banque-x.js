/* ============================================================
   Numidea Labs — « Ma banque, sans piège » (hub/lanterne/banque.html,
   2026-11-27): the book's eleven exercises, rebuilt from PR #14's banking
   course (hub/banque.js there) for the Librairie. Loaded by hub/lanterne.js
   like the web3 labs (the atlas's "labs"), when an exercise comes near; its
   bridge is window.NUMIDEA_W3X (t, lang, onLang, reduce, emit, atlas).
   Without it every exercise stays readable as the page drew it (all the
   steps, the answers, the reasons), its controls disabled, and the
   district's question still works.
   Each lab is LABS[kind](root, api), by [data-lab="<kind>"]; it reports
   its end once, as numidea:exercise { atlas, id, done: true }, which the
   atlas counts (Encre comes from hub/game.js, as for every book). No XP,
   rank or seal of its own: the site has one progression.
   Storage: none, except the emergency card, written to 'numidea-bank-card'
   only while « Garder sur cet appareil » is ticked, and erased on « Effacer »
   or when unticked. It holds the reader's own numbers: never sent, never part
   of the save. Nothing moves by itself; every change answers a press.
   ============================================================ */
(function () {
  'use strict';
  var A = window.NUMIDEA_W3X;
  if (!A || window.NUMIDEA_BQX_ON) return;
  window.NUMIDEA_BQX_ON = true;
  var d = document;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };
  var K = 'lant.at.banque.x.';
  var t = function (k, v) { var s = A.t(K + k) || ''; return v ? s.replace(/\{(\w+)\}/g, function (m, x) { return v[x] != null ? v[x] : m; }) : s; };
  var press = function (b, on) { b.setAttribute('aria-pressed', String(!!on)); };
  var show = function (n, on) { if (n) n.hidden = !on; };
  var CARD = 'numidea-bank-card';

  var api = function (root) {
    var board = root.closest('[data-lt-id]'), id = board && board.getAttribute('data-lt-id'), fin = false;
    return {
      id: id,
      /* a progress line in the district's result slot (never the end) */
      say: function (msg) { if (id && window.lanterne && window.lanterne.tell) window.lanterne.tell(A.atlas, id, msg, false); },
      done: function (msg) { if (fin || !id) return; fin = true; A.emit('numidea:exercise', { atlas: A.atlas, id: id, done: true, msg: msg || A.said() }); },
      lang: function (fn) { A.onLang(fn); }
    };
  };
  var enable = function (root) { $$('button, input', root).forEach(function (b) { b.disabled = false; }); };

  /* a run of steps (lien, urgence, familles): one step shown at a time, « Continuer » once the step is solved */
  var run = function (root, steps, end) {
    var all = $$('[data-step]', root), i = 0;
    var go = function (n) { i = n; all.forEach(function (s, k) { s.hidden = k !== i; }); var h = $('.bq-ask', all[i]); if (h && n) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: false }); } };
    all.forEach(function (s, k) {
      var nx = $('[data-act="next"]', s);
      var solved = function () { if (nx) { nx.hidden = false; } else if (end) end(); };
      if (nx) nx.addEventListener('click', function () { go(k + 1); });
      steps[s.getAttribute('data-st')](s, solved);
    });
    go(0);
  };
  /* a pick: try first, then why; a wrong pick stays to read, the right one solves */
  var pick = function (s, ok, also) {
    var os = $$('.bq-opt', s), fbs = $$('[data-fb]', s);
    fbs.forEach(function (f) { f.hidden = true; });
    os.forEach(function (o, j) {
      o.addEventListener('click', function () {
        os.forEach(function (x) { press(x, x === o); });
        fbs.forEach(function (f) { f.hidden = f.getAttribute('data-fb') !== String(j); });
        if (also) also(j);
        if (o.hasAttribute('data-ok')) ok();
      });
    });
  };
  /* genuine or scam: a vote marks the card and says why */
  var vote = function (card, cb) {
    var v = card.getAttribute('data-v'), out = $('[data-verdict]', card), said = false;
    show(out, false);
    $$('[data-vote]', card).forEach(function (b) {
      b.addEventListener('click', function () {
        if (said) return; said = true;
        var right = b.getAttribute('data-vote') === v;
        $$('[data-vote]', card).forEach(function (x) { press(x, x === b); x.disabled = true; });
        card.classList.add(right ? 'is-right' : 'is-wrong');
        show($('.bq-verdict__ok', out), right); show($('.bq-verdict__no', out), !right); show(out, true);
        cb(right);
      });
    });
  };

  var LABS = {
    /* porte: the three doors; done once each is opened */
    doors: function (root, x) {
      var bs = $$('[data-door]', root), ps = $$('[data-door-p]', root), seen = {};
      var paint = function () { var n = Object.keys(seen).length; x.say(t('seenLeft', { n: n, N: 3 })); if (n === 3) x.done(); };
      ps.forEach(function (p) { p.hidden = true; });
      bs.forEach(function (b, i) {
        b.addEventListener('click', function () {
          bs.forEach(function (y) { press(y, y === b); });
          ps.forEach(function (p) { p.hidden = p.getAttribute('data-door-p') !== String(i); });
          seen[i] = 1; paint();
        });
      });
    },
    /* acces: six steps, two traps; a press on a normal step says so */
    traps: function (root, x) {
      var n = 0, out = $('[data-o="n"]', root);
      $$('[data-why]', root).forEach(function (w) { w.hidden = true; });
      $$('[data-trap]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.getAttribute('aria-pressed') === 'true') return;
          var trap = b.getAttribute('data-trap') === '1';
          press(b, true); b.classList.add(trap ? 'is-trap' : 'is-safe');
          show($('[data-why]', b.parentNode), true);
          if (trap) { n++; out.textContent = String(n); x.say(t('trapsLeft', { n: n })); if (n === 2) x.done(); }
        });
      });
    },
    /* solde: the phone's zones and their reading; done once the four zones of the account are read */
    dash: function (root, x) {
      var tips = $$('[data-tip-p]', root), seen = {}, NEED = ['bal', 'avail', 'pend', 'inT'], hint = $('.bq-hint', root);
      var view = function (v) {
        $$('[data-view]', root).forEach(function (b) { press(b, b.getAttribute('data-view') === v); });
        $$('[data-view-p]', root).forEach(function (p) { p.hidden = p.getAttribute('data-view-p') !== v; });
      };
      tips.forEach(function (p) { p.hidden = true; });
      $$('[data-view]', root).forEach(function (b) { b.addEventListener('click', function () { view(b.getAttribute('data-view')); }); });
      $$('[data-tip]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-tip');
          $$('[data-tip]', root).forEach(function (y) { press(y, y === b); });
          tips.forEach(function (p) { p.hidden = p.getAttribute('data-tip-p') !== k; });
          show(hint, false);
          seen[k] = 1;
          var n = NEED.filter(function (z) { return seen[z]; }).length;
          x.say(t('seenLeft', { n: n, N: NEED.length }));
          if (n === NEED.length) x.done();
        });
      });
      view('acc');
    },
    /* alerte: five switches; the phone shows what each would say; done at three or more with the new-device one */
    alerts: function (root, x) {
      var on = {}, out = $('[data-o="n"]', root), empty = $('.bq-empty', root), rule = $('.bq-rule', root);
      var paint = function () {
        var n = Object.keys(on).length;
        $$('[data-note]', root).forEach(function (li) { li.hidden = !on[li.getAttribute('data-note')]; });
        out.textContent = String(n); show(empty, !n); show(rule, n > 0);
        if (n >= 3 && on[3]) x.done(); else x.say(t('alertsLeft'));
      };
      $$('[data-alert]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-alert');
          if (on[k]) delete on[k]; else on[k] = 1;
          press(b, !!on[k]); paint();
        });
      });
      show(rule, false); $$('[data-note]', root).forEach(function (li) { li.hidden = true; });
      out.textContent = '0';
    },
    /* lien: first move, the owner of an address, five links to sort */
    link: function (root, x) {
      var fake = $('[data-fake]', root), rule = $('.bq-rule', $('[data-step="1"]', root)), done2 = $('.bq-rule', $('[data-step="2"]', root));
      show(rule, false); show(done2, false);
      run(root, {
        pick: function (s, ok) {
          if (s.getAttribute('data-step') === '0') { pick(s, ok, function (j) { show(fake, j === 0); }); return; }
          var ps = $$('.bq-url__p', s), fbs = $$('[data-fb]', s);
          fbs.forEach(function (f) { f.hidden = true; });
          ps.forEach(function (p, j) {
            p.addEventListener('click', function () {
              ps.forEach(function (y) { press(y, y === p); });
              fbs.forEach(function (f) { f.hidden = f.getAttribute('data-fb') !== String(j); });
              if (p.hasAttribute('data-ok')) { show(rule, true); ok(); }
            });
          });
        },
        vote: function (s) {
          var cards = $$('[data-card]', s), n = 0, good = 0, out = $('[data-o="votes"]', s);
          cards.forEach(function (c) {
            vote(c, function (right) {
              n++; if (right) good++;
              out.textContent = t('votes', { n: good }); x.say(t('votes', { n: good }));
              if (n === cards.length) { show(done2, true); x.done(); }
            });
          });
        }
      });
    },
    /* urgence: which message rushes you, its five levers, then the scammer's own message */
    press: function (root, x) {
      run(root, {
        pick: function (s, ok) { pick(s, ok); },
        tap: function (s, ok) {
          var hit = 0, out = $('[data-o="lev"]', s), calm = $('[data-calm]', s), dn = $('[data-done]', s);
          $$('[data-lever]', s).forEach(function (b) {
            b.addEventListener('click', function () {
              if (b.getAttribute('aria-pressed') === 'true') return;
              if (b.getAttribute('data-lever') !== '1') { b.classList.add('is-calm'); show(calm, true); return; }
              press(b, true); b.classList.add('is-hit'); hit++; out.textContent = String(hit); show(calm, false);
              if (hit === 5) { show(dn, true); ok(); }
            });
          });
        },
        build: function (s) {
          var slots = $$('[data-slot]', s), out = $('[data-o="pr"]', s), msg = $('[data-o="msg"]', s), more = $('[data-more]', s), dn = $('[data-done]', s);
          var sync = function () {
            var sum = 0, all = true, words = [];
            slots.forEach(function (sl) {
              var on = $('[aria-pressed="true"]', sl);
              if (on) { sum += +on.getAttribute('data-w'); words.push(on.textContent); } else all = false;
            });
            out.textContent = String(sum); msg.textContent = words.length ? words.join(' · ') : '…';
            var win = all && sum >= 5;
            show(more, all && !win); show(dn, win);
            if (win) x.done();
          };
          slots.forEach(function (sl) {
            var os = $$('.bq-opt', sl);
            os.forEach(function (o) { o.addEventListener('click', function () { os.forEach(function (y) { press(y, y === o); }); sync(); }); });
          });
          x.lang(sync);
        }
      });
    },
    /* familles: the overpayment sale, scam and sign pairs, their common string */
    over: function (root, x) {
      var ledger = $('[data-ledger]', root);
      run(root, {
        pick: function (s, ok) {
          if (s.getAttribute('data-step') === '0') { pick(s, ok, function (j) { show(ledger, j === 0); }); return; }
          pick(s, function () { x.done(); });
        },
        pairs: function (s, ok) {
          var a = null, got = 0, no = $('[data-no]', s), dn = $('[data-done]', s);
          var as = $$('[data-a]', s), bs = $$('[data-b]', s);
          as.forEach(function (b) { b.addEventListener('click', function () { if (b.classList.contains('is-matched')) return; a = b; as.forEach(function (y) { press(y, y === b); }); show(no, false); }); });
          bs.forEach(function (b) {
            b.addEventListener('click', function () {
              if (!a || b.classList.contains('is-matched')) return;
              if (a.getAttribute('data-a') === b.getAttribute('data-b')) {
                [a, b].forEach(function (y) { y.classList.add('is-matched'); press(y, false); y.disabled = true; });
                a = null; got++; show(no, false);
                if (got === as.length) { show(dn, true); ok(); }
              } else show(no, true);
            });
          });
        }
      });
    },
    /* rappel: the call, one turn at a time; the trap ends it badly, the official number ends it well */
    call: function (root, x) {
      var nodes = $$('[data-node]', root), replay = $('[data-act="replay"]', root);
      var go = function (n) {
        nodes.forEach(function (nd) { nd.hidden = nd.getAttribute('data-node') !== n; });
        $$('[data-w]', root).forEach(function (w) { w.hidden = true; });
        $$('.bq-opt', root).forEach(function (o) { press(o, false); });
        show(replay, n === 'lose' || n === 'win');
        var cur = $('[data-node="' + n + '"]', root); if (cur) { cur.setAttribute('tabindex', '-1'); cur.focus({ preventScroll: true }); }
        if (n === 'win') x.done();
      };
      $$('.bq-opt', root).forEach(function (o) {
        o.addEventListener('click', function () {
          var to = o.getAttribute('data-go');
          if (to === 'bad') { var nd = o.closest('[data-node]'), i = $$('.bq-opt', nd).indexOf(o); press(o, true); $$('[data-w]', nd).forEach(function (w) { w.hidden = w.getAttribute('data-w') !== String(i); }); return; }
          go(to);
        });
      });
      replay.addEventListener('click', function () { go('n0'); });
      nodes.forEach(function (nd) { nd.hidden = nd.getAttribute('data-node') !== 'n0'; });
      $$('[data-w]', root).forEach(function (w) { w.hidden = true; });
    },
    /* reglages: eight settings, ticked for this visit only */
    check: function (root, x) {
      var n = 0, out = $('[data-o="n"]', root), dn = $('[data-done]', root);
      $$('[data-check]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          var on = b.getAttribute('aria-pressed') !== 'true'; press(b, on); n += on ? 1 : -1;
          out.textContent = String(n); show(dn, n === 8);
          x.say(t('checkLeft', { n: n })); if (n === 8) x.done();
        });
      });
    },
    /* carte: the form fills the card; printed, or kept on this device only when ticked */
    card: function (root, x) {
      var form = $('[data-form]', root), keep = $('[data-keep]', root), state = $('[data-o="state"]', root);
      var fields = $$('[data-f]', form), read = function () { var o = {}; fields.forEach(function (f) { o[f.getAttribute('data-f')] = f.value.trim(); }); return o; };
      var store = { get: function () { try { return JSON.parse(localStorage.getItem(CARD) || 'null'); } catch (e) { return null; } },
        set: function (v) { try { localStorage.setItem(CARD, JSON.stringify(v)); } catch (e) {} },
        del: function () { try { localStorage.removeItem(CARD); } catch (e) {} } };
      var paint = function () {
        var v = read();
        if (v.last4 && !/^\d{0,4}$/.test(v.last4)) { v.last4 = v.last4.replace(/\D/g, '').slice(0, 4); $('[data-f="last4"]', form).value = v.last4; }
        Object.keys(v).forEach(function (k) { var o = $('[data-o="' + k + '"]', root); if (o) o.textContent = v[k]; });
        if (keep.checked) { store.set(v); state.textContent = t('keepNote'); } else state.textContent = '';
        if (v.tel1) x.done();
      };
      var old = store.get();
      if (old && typeof old === 'object') { fields.forEach(function (f) { var k = f.getAttribute('data-f'); if (typeof old[k] === 'string') f.value = old[k].slice(0, 80); }); keep.checked = true; }
      form.addEventListener('input', paint);
      form.addEventListener('submit', function (e) { e.preventDefault(); });
      keep.addEventListener('change', function () { if (!keep.checked) store.del(); paint(); });
      $('[data-act="forget"]', root).addEventListener('click', function () { fields.forEach(function (f) { f.value = ''; }); keep.checked = false; store.del(); paint(); });
      $('[data-act="print"]', root).addEventListener('click', function () {
        state.textContent = t('printNote');
        d.documentElement.classList.add('bq-printing');
        var off = function () { d.documentElement.classList.remove('bq-printing'); window.removeEventListener('afterprint', off); };
        window.addEventListener('afterprint', off);
        setTimeout(function () { window.print(); setTimeout(off, 1000); }, 30);
      });
      x.lang(paint);
      paint();
    },
    /* quiz: twelve messages, one at a time; done at the end of a run, whatever the score */
    quiz: function (root, x) {
      var items = $$('[data-qi]', root), i = -1, score = 0, streak = 0, nx = $('[data-act="next"]', root), meter = $('[data-run]', root), end = $('[data-end]', root);
      var o = function (k) { return $('[data-o="' + k + '"]', root); };
      var fresh = function () {
        items.forEach(function (it) {
          var c = it.cloneNode(true); it.parentNode.replaceChild(c, it);
        });
        items = $$('[data-qi]', root);
        items.forEach(function (it) {
          it.classList.remove('is-right', 'is-wrong'); it.hidden = true;
          $$('[data-vote]', it).forEach(function (b) { b.disabled = false; press(b, false); });
          vote(it, function (right) {
            if (right) { score++; streak++; } else streak = 0;
            o('score').textContent = String(score); o('streak').textContent = String(streak);
            show(nx, true); nx.focus({ preventScroll: true });
          });
        });
      };
      var step = function () {
        i++; show(nx, false);
        items.forEach(function (it, k) { it.hidden = k !== i; });
        if (i >= items.length) {
          show(meter, false); show(end, true);
          var tier = score === 12 ? 2 : score >= 9 ? 1 : 0;
          $$('[data-tier]', end).forEach(function (p) { p.hidden = p.getAttribute('data-tier') !== String(tier); });
          o('end').textContent = t('quizDone', { n: score });
          x.done(t('quizDone', { n: score }));
          return;
        }
        o('i').textContent = String(i + 1);
      };
      var start = function () {
        i = -1; score = 0; streak = 0; fresh();
        o('score').textContent = '0'; o('streak').textContent = '0';
        show(meter, true); show(end, false); show($('[data-act="start"]', root).parentNode, false);
        step(); var q = items[0]; if (q) { q.setAttribute('tabindex', '-1'); q.focus({ preventScroll: true }); }
      };
      items.forEach(function (it) { it.hidden = true; });
      $('[data-act="start"]', root).addEventListener('click', start);
      $('[data-act="restart"]', root).addEventListener('click', start);
      nx.addEventListener('click', function () { step(); var q = items[i]; if (q) { q.setAttribute('tabindex', '-1'); q.focus({ preventScroll: true }); } });
      x.lang(function () { if (!end.hidden) o('end').textContent = t('quizDone', { n: score }); });
    }
  };

  $$('[data-lab]').forEach(function (root) {
    var fn = LABS[root.getAttribute('data-lab')]; if (!fn) return;
    enable(root);
    root.classList.add('is-live');
    try { fn(root, api(root)); } catch (e) { /* a lab that fails stays as drawn: the district still has its question and « Je passe l'exercice » */ }
  });
})();

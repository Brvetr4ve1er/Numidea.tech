/* ============================================================
   Numidea Labs — the web3 course's labs (hub/manuel.html #web3, the nine
   modules of web3x/SPEC.md, 2026-11-21). Loaded by hub/app.js 13e only, the
   first time a module opens or once the page is idle; without it every lab
   stays in its still state (its figure, its facts, its controls disabled)
   and the tabs, stamps and questions of every set still work (they are
   app.js 13's).
   Each lab is one function in LABS, by the kind its root names
   ([data-lab="<kind>"]): LABS[kind] = function (root, api) { … }. A root
   whose kind has no function yet stays as the page drew it (the shell's
   placeholder). A lab's controls carry `disabled` and sit under [data-x],
   which app.js 13b's enabler and its brief binders skip: a lab never
   writes the brief. Conventions inside a lab: inputs [data-f="<name>"],
   buttons [data-act="<name>"], outputs [data-o="<name>"] (textContent
   only), one live line per lab. Nothing leaves the device and nothing
   touches a chain: the browser's own SubtleCrypto and one Keccak written
   here, each checked against published test vectors before it is shown.
   Nothing moves by itself: every change answers a key or a press, at once.
   ============================================================ */
(function () {
  'use strict';
  var A = window.NUMIDEA_W3X;
  if (!A || window.NUMIDEA_W3X_ON) return;
  window.NUMIDEA_W3X_ON = true;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- hashKit (SPEC §4.2) ----------------
     sha256: the browser's (a secure context only); keccak256 and sha3_256: one Keccak-f[1600] sponge, rate 1088 bits,
     padding 0x01 (Keccak, as Ethereum uses it) or 0x06 (the NIST standard, FIPS 202), on 64-bit lanes as BigInt */
  var hashKit = (function () {
    var enc = function (s) { return new TextEncoder().encode(s); };
    var hex = function (bytes) { var o = ''; for (var i = 0; i < bytes.length; i++) o += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16); return o; };
    var subtle = window.crypto && window.crypto.subtle && window.isSecureContext !== false ? window.crypto.subtle : null;
    var sha256 = function (text) { return subtle ? subtle.digest('SHA-256', enc(text)).then(function (b) { return hex(new Uint8Array(b)); }) : Promise.reject(new Error('no SubtleCrypto')); };
    var B = window.BigInt, M64 = B ? (B(1) << B(64)) - B(1) : null;
    var RC = ['0000000000000001', '0000000000008082', '800000000000808A', '8000000080008000', '000000000000808B', '0000000080000001', '8000000080008081', '8000000000008009',
      '000000000000008A', '0000000000000088', '0000000080008009', '000000008000000A', '000000008000808B', '800000000000008B', '8000000000008089', '8000000000008003',
      '8000000000008002', '8000000000000080', '000000000000800A', '800000008000000A', '8000000080008081', '8000000000008080', '0000000080000001', '8000000080008008'].map(function (h) { return B ? B('0x' + h) : 0; });
    // rotation offsets r[x][y] (FIPS 202, Table 2)
    var ROT = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
    var rol = function (v, n) { if (!n) return v; var k = B(n); return ((v << k) | (v >> (B(64) - k))) & M64; };
    var permute = function (S) {
      var x, y, C = [], D = [], T = [];
      for (var r = 0; r < 24; r++) {
        for (x = 0; x < 5; x++) C[x] = S[x] ^ S[x + 5] ^ S[x + 10] ^ S[x + 15] ^ S[x + 20];
        for (x = 0; x < 5; x++) D[x] = C[(x + 4) % 5] ^ rol(C[(x + 1) % 5], 1);
        for (x = 0; x < 5; x++) for (y = 0; y < 5; y++) S[x + 5 * y] ^= D[x];
        for (x = 0; x < 5; x++) for (y = 0; y < 5; y++) T[y + 5 * ((2 * x + 3 * y) % 5)] = rol(S[x + 5 * y], ROT[x][y]);
        for (x = 0; x < 5; x++) for (y = 0; y < 5; y++) S[x + 5 * y] = T[x + 5 * y] ^ ((~T[(x + 1) % 5 + 5 * y] & M64) & T[(x + 2) % 5 + 5 * y]);
        S[0] ^= RC[r];
      }
    };
    var sponge = function (text, pad) {
      if (!B) return '';
      var m = enc(text), rate = 136, len = Math.ceil((m.length + 1) / rate) * rate, p = new Uint8Array(len), S = [], i, j;
      p.set(m); p[m.length] = pad; p[len - 1] |= 0x80;
      for (i = 0; i < 25; i++) S[i] = B(0);
      for (var off = 0; off < len; off += rate) {
        for (i = 0; i < rate / 8; i++) { var lane = B(0); for (j = 7; j >= 0; j--) lane = (lane << B(8)) | B(p[off + i * 8 + j]); S[i] ^= lane; }
        permute(S);
      }
      var out = new Uint8Array(32);
      for (i = 0; i < 4; i++) { var v = S[i]; for (j = 0; j < 8; j++) { out[i * 8 + j] = Number(v & B(255)); v >>= B(8); } }
      return hex(out);
    };
    var keccak256 = function (text) { return sponge(text, 0x01); };
    var sha3_256 = function (text) { return sponge(text, 0x06); };
    // the Hamming distance of two hex digests of the same length
    var bits = function (a, b) { var n = 0; for (var i = 0; i < a.length && i < b.length; i++) { var x = parseInt(a[i], 16) ^ parseInt(b[i], 16); while (x) { n += x & 1; x >>= 1; } } return n; };
    // SHA-256("abc") (NIST CSRC example), Keccak-256("") (Ethereum's empty hash), SHA3-256("") (NIST CSRC example)
    var V = { sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', keccak: 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470', sha3: 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a' };
    var tested = null;
    var selfTest = function () {
      if (tested) return tested;
      var k = false, s3 = false;
      try { k = keccak256('') === V.keccak; s3 = sha3_256('') === V.sha3; } catch (e) {}
      tested = sha256('abc').then(function (h) { return h === V.sha256; }, function () { return false; }).then(function (s) { return { sha256: s, keccak: k, sha3: s3 }; });
      return tested;
    };
    return { sha256: sha256, keccak256: keccak256, sha3_256: sha3_256, bits: bits, selfTest: selfTest, hasSubtle: !!subtle };
  })();

  /* ---------------- the api a lab gets ---------------- */
  var api = {
    t: A.t, lang: A.lang, onLang: A.onLang, reduce: A.reduce, hashKit: hashKit,
    // a live line says one thing per change (emptied first, so the same words are said again)
    say: function (el, text) { if (!el) return; if (el.textContent !== text) { el.textContent = ''; el.textContent = text; } },
    // a number in the page's language: U+202F groups and a comma in French, a comma group in English, Western digits in Arabic
    num: function (n, dec) {
      var l = A.lang(), s = Number(n).toFixed(dec || 0), parts = s.split('.');
      var g = l === 'en' ? ',' : l === 'ar' ? ',' : ' ';
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, g);
      return parts.join(l === 'en' || l === 'ar' ? '.' : ',');
    },
    // what a lab says to the page (numidea:one, numidea:bin, numidea:step), listened to inside one root
    on: function (root, kind, fn) { document.addEventListener('numidea:' + kind, function (e) { if (e.detail && e.detail.el && root.contains(e.detail.el)) fn(e.detail); }); },
    // a radiogroup inside a lab: roving tabindex, the arrows (flipped in RTL), Home and End; it never writes the brief
    radios: function (g, fn) {
      var rs = $$('[role="radio"]', g), vis = function () { return rs.filter(function (r) { return !r.hidden; }); };
      var pick = function (v, focus) {
        rs.forEach(function (r) { var on = Number(r.getAttribute('data-v')) === v; r.setAttribute('aria-checked', String(on)); r.tabIndex = on ? 0 : -1; if (on && focus) r.focus(); });
        A.emit('numidea:one', { el: g, f: g.getAttribute('data-f'), i: v }); fn(v);
      };
      rs.forEach(function (r) {
        r.disabled = false;
        r.addEventListener('click', function () { pick(Number(r.getAttribute('data-v'))); });
        r.addEventListener('keydown', function (e) {
          var rtl = document.documentElement.getAttribute('dir') === 'rtl', vs = vis(), n = vs.length, i = vs.indexOf(r);
          var to = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : e.key === 'ArrowRight' ? i + (rtl ? -1 : 1) : e.key === 'ArrowLeft' ? i + (rtl ? 1 : -1) : e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : null;
          if (to === null) return;
          e.preventDefault(); pick(Number(vs[(to + n) % n].getAttribute('data-v')), true);
        });
      });
      return pick;
    }
  };

  /* ---------------- the labs: one function per kind ---------------- */
  var LABS = {};

  /* 1.4 · Empreinte, clé, signature: a word, its digest live (SHA-256 by the browser, Keccak-256 and SHA3-256 here), the
     hex characters that changed since the last version marked, the bits that changed counted (measured, never promised),
     and the two Keccak-family digests side by side. Each function is checked against its vector first; one that fails
     loses its radio; without SubtleCrypto (not https), SHA-256 says so and the two others still work. */
  LABS.hash = function (root, api) {
    var inp = $('[data-hash-in]', root), out = $('[data-hash-out]', root), bitsEl = $('[data-hash-bits]', root), g = $('[data-f="alg"]', root);
    var cmpB = $('[data-act="cmp"]', root), cmp = $('[data-hash-cmp]', root), noC = $('[data-hash-nocrypto]', root), K = 'web3c.mods.0.items.3.lab.hash.';
    var alg = 0, prev = null, ok = { sha256: true, keccak: true, sha3: true }, raf = 0, seq = 0;
    var fns = [function (s) { return hashKit.sha256(s); }, function (s) { return Promise.resolve(hashKit.keccak256(s)); }, function (s) { return Promise.resolve(hashKit.sha3_256(s)); }];
    var NAMES = ['sha256', 'keccak', 'sha3'];
    // the digest in eight groups of eight; the characters that changed since the last digest of the same function marked
    var paint = function (h) {
      out.textContent = '';
      for (var i = 0; i < 64; i += 8) {
        var grp = document.createElement('span'); grp.className = 'st-hash__g';
        for (var j = i; j < i + 8; j++) {
          var ch = h[j] || '';
          if (prev && prev.length === h.length && prev[j] !== ch) { var mk = document.createElement('mark'); mk.textContent = ch; grp.appendChild(mk); }
          else grp.appendChild(document.createTextNode(ch));
        }
        out.appendChild(grp); if (i < 56) out.appendChild(document.createTextNode(' '));
      }
    };
    var run = function () {
      raf = 0;
      var s = inp.value, my = ++seq, name = NAMES[alg];
      if (!ok[name]) { out.textContent = '—'; api.say(bitsEl, ''); if (noC) noC.hidden = name !== 'sha256'; return; }
      if (noC) noC.hidden = true;
      fns[alg](s).then(function (h) {
        if (my !== seq) return;
        paint(h);
        api.say(bitsEl, prev && prev.length === h.length && prev !== h ? api.t(K + 'bits').replace('{n}', hashKit.bits(prev, h)) : '');
        prev = h;
      }, function () { if (my === seq) { out.textContent = '—'; if (noC) noC.hidden = false; } });
      if (cmp && !cmp.hidden) {
        var kk = $('[data-o="keccak"]', cmp), s3 = $('[data-o="sha3"]', cmp);
        kk.textContent = ok.keccak ? hashKit.keccak256(s).match(/.{8}/g).join(' ') : '—';
        s3.textContent = ok.sha3 ? hashKit.sha3_256(s).match(/.{8}/g).join(' ') : '—';
      }
    };
    var soon = function () { if (!raf) raf = requestAnimationFrame(run); };
    var choose = api.radios(g, function (v) { alg = v; prev = null; run(); });
    inp.disabled = false; if (cmpB) cmpB.disabled = false;
    inp.addEventListener('input', soon);
    if (cmpB) cmpB.addEventListener('click', function () { var on = cmpB.getAttribute('aria-pressed') !== 'true'; cmpB.setAttribute('aria-pressed', String(on)); cmp.hidden = !on; run(); });
    hashKit.selfTest().then(function (r) {
      ok = r;
      // a function that fails its vector is not offered (SHA-256 without SubtleCrypto stays, and says why)
      $$('[role="radio"]', g).forEach(function (b, i) { if (i > 0 && !r[NAMES[i]]) b.hidden = true; });
      if (!r.sha256 && hashKit.hasSubtle) $$('[role="radio"]', g)[0].hidden = true;
      if (!r.sha256 && r.keccak) choose(1); else run();
    });
    root.classList.add('is-live');
  };

  /* ================ modules 1, 2 and 3: the phase-1 labs (SPEC §5) ================
     The maths first, in one object with no page in it (kit), so a test can run it outside a browser (enh/test-m123.mjs
     checks it against published vectors and against node's own crypto). A digest function is passed in: the page passes
     hashKit.sha256 (SubtleCrypto), a test passes its own. */
  var kit = (function () {
    var enc = function (s) { return new TextEncoder().encode(s); };
    var hex = function (buf) { var b = new Uint8Array(buf), o = ''; for (var i = 0; i < b.length; i++) o += (b[i] < 16 ? '0' : '') + b[i].toString(16); return o; };
    // Merkle (2.1): parent = digest of the two child digests written one after the other (hex text); an odd row pairs
    // its last digest with a copy of itself, as Bitcoin does. levels[0] = the leaves' digests, the last = [root]
    var merkle = function (hs, sha) {
      var levels = [hs.slice()];
      var up = function (row) {
        if (row.length < 2) return Promise.resolve(levels);
        var jobs = []; for (var i = 0; i < row.length; i += 2) jobs.push(sha(row[i] + (i + 1 < row.length ? row[i + 1] : row[i])));
        return Promise.all(jobs).then(function (r) { levels.push(r); return up(r); });
      };
      return up(hs);
    };
    // the nodes a light wallet is given to check leaf `at` (its own digest, the sibling at each level, the root)
    var proof = function (levels, at) {
      var keep = ['0-' + at], i = at;
      for (var l = 0; l < levels.length - 1; l++) { var s = i ^ 1; keep.push(l + '-' + (s < levels[l].length ? s : i)); i = i >> 1; }
      keep.push('root-0'); return keep;
    };
    // three demo blocks (2.1): block hash = digest of "prev\nroot\nnonce"; blocks 2 and 3 hash a fixed line as their root
    var GEN = new Array(65).join('0'), NONCES = [2083, 917, 4410];
    var blocks = function (root, sha) {
      return Promise.all([sha('bloc 2'), sha('bloc 3')]).then(function (r) {
        var out = [{ prev: GEN, root: root, nonce: NONCES[0] }, { root: r[0], nonce: NONCES[1] }, { root: r[1], nonce: NONCES[2] }];
        return sha(GEN + '\n' + root + '\n' + NONCES[0]).then(function (h1) { out[0].h = h1; out[1].prev = h1; return sha(h1 + '\n' + r[0] + '\n' + NONCES[1]); })
          .then(function (h2) { out[1].h = h2; out[2].prev = h2; return sha(h2 + '\n' + r[1] + '\n' + NONCES[2]); })
          .then(function (h3) { out[2].h = h3; return out; });
      });
    };
    // proof of work (2.2): nonces from..from+count-1 of "text nonce"; the first whose digest starts with `zeros` hex zeros
    var mine = function (text, from, count, zeros, sha) {
      var p = new Array(zeros + 1).join('0'), jobs = [];
      for (var n = from; n < from + count; n++) jobs.push(sha(text + ' ' + n));
      return Promise.all(jobs).then(function (hs) { for (var i = 0; i < hs.length; i++) if (hs[i].indexOf(p) === 0) return { nonce: from + i, hash: hs[i] }; return null; });
    };
    // proof of stake (2.2): the index a draw r in [0, total) falls on, each weight a stretch of the line
    var pick = function (ws, r) { for (var i = 0, acc = 0; i < ws.length; i++) { acc += ws[i]; if (r < acc) return i; } return -1; };
    // a fair whole number in [0, n): the browser's random source, without the modulo's bias
    var randInt = function (n, rnd) { var lim = Math.floor(4294967296 / n) * n, x; do { x = rnd(); } while (x >= lim); return x % n; };
    // the honest share of the deposits, in percent, and whether it reaches two thirds
    var share = function (ds, out) { var tot = 0, ok = 0; ds.forEach(function (d, i) { tot += d; if (out.indexOf(i) < 0) ok += d; }); return { p: Math.round(100 * ok / tot), final: 3 * ok >= 2 * tot }; };
    // delegated stake (2.2): the three candidates with the most votes (at least one), ties to the lower number
    var top3 = function (vs) { return vs.map(function (v, i) { return [v, i]; }).filter(function (x) { return x[0] > 0; }).sort(function (a, b) { return b[0] - a[0] || a[1] - b[1]; }).slice(0, 3).map(function (x) { return x[1]; }); };
    // byzantine (2.2): ten validators; a block is committed with more than two thirds of the votes (7 of 10)
    var bft = function (faulty, n) { n = n || 10; var v = n - faulty; return { v: v, ok: 3 * v > 2 * n }; };
    // gossip (1.3): the copy most nodes hold, and how many hold it
    var agree = function (copies) { var c = {}, best = null; copies.forEach(function (k) { c[k] = (c[k] || 0) + 1; if (best === null || c[k] > c[best]) best = k; }); return { maj: best, a: c[best] }; };
    // BIP-39 (3.2): the four words the lab uses and their places in the standard's English list (0, 1, 3, 2047)
    var bip = {
      IDX: { abandon: 0, ability: 1, about: 3, zoo: 2047 },
      test: function () { var w = []; for (var i = 0; i < 11; i++) w.push('abandon'); w.push('about'); return w; },
      bits: function (i) { var s = i.toString(2); while (s.length < 11) s = '0' + s; return s; },
      // twelve words → 132 bits → 16 bytes of entropy and a 4-bit checksum (ENT / 32)
      split: function (idx) { var s = idx.map(bip.bits).join(''), e = new Uint8Array(16); for (var i = 0; i < 16; i++) e[i] = parseInt(s.slice(i * 8, i * 8 + 8), 2); return { ent: e, cs: parseInt(s.slice(128), 2) }; },
      // valid when the checksum is the first 4 bits of SHA-256(entropy); digest(bytes) → Promise<ArrayBuffer>
      check: function (words, digest) { var x = bip.split(words.map(function (w) { return bip.IDX[w]; })); return digest(x.ent).then(function (d) { return (new Uint8Array(d)[0] >> 4) === x.cs; }); },
      // the seed: PBKDF2-HMAC-SHA512, 2048 rounds, salt "mnemonic" + passphrase (NFKD), 512 bits
      seed: function (words, pass, subtle) {
        var nf = function (s) { return s.normalize ? s.normalize('NFKD') : s; };
        return subtle.importKey('raw', enc(nf(words.join(' '))), 'PBKDF2', false, ['deriveBits'])
          .then(function (k) { return subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-512', salt: enc(nf('mnemonic' + pass)), iterations: 2048 }, k, 512); }).then(hex);
      }
    };
    // a credential (3.3): its fields in one fixed order, as the text that is signed
    var canon = function (o) { var r = {}; ['name', 'deg', 'year', 'grade'].forEach(function (k) { if (o[k] != null) r[k] = String(o[k]); }); return JSON.stringify(r); };
    var signKit = function (subtle) {
      var A = { name: 'ECDSA', namedCurve: 'P-256' }, S = { name: 'ECDSA', hash: 'SHA-256' };
      return {
        pair: function () { return subtle.generateKey(A, false, ['sign', 'verify']); },
        sign: function (priv, text) { return subtle.sign(S, priv, enc(text)).then(hex); },
        verify: function (pub, sigHex, text) { var b = new Uint8Array(sigHex.length / 2); for (var i = 0; i < b.length; i++) b[i] = parseInt(sigHex.substr(i * 2, 2), 16); return subtle.verify(S, pub, b, enc(text)); }
      };
    };
    return { merkle: merkle, proof: proof, blocks: blocks, mine: mine, pick: pick, randInt: randInt, share: share, top3: top3, bft: bft, agree: agree, bip: bip, canon: canon, signKit: signKit, hex: hex };
  })();

  /* ---- what every lab of these modules shares ---- */
  var subtle = window.crypto && window.crypto.subtle && window.isSecureContext !== false ? window.crypto.subtle : null;
  var o = function (root, n) { return $('[data-o="' + n + '"]', root); };
  // in Arabic an amount and its Latin unit ("476.19 B", "5.97 A", "21000 gwei") are one left-to-right isolate (U+2066…2069,
  // SPEC §9's <bdi dir=ltr> as text), so the sentence's period and words stay on their side (rev1)
  var isoAr = function (s) { return A.lang() !== 'ar' ? s : String(s).replace(/(\u2066)?([−-]?\d(?:[\d.,\u202f\u00a0]*\d)?[ \u00a0\u202f][A-Za-z]{1,6})(?![A-Za-z\u2069])/g, function (m, pre, x) { return pre ? m : '\u2066' + x + '\u2069'; }); };
  var tf = function (s, v) { return isoAr(Object.keys(v).reduce(function (a, k) { return a.split('{' + k + '}').join(String(v[k])); }, s)); };
  // a line written from a template ([data-tpl] + data-tpl-<var>): French baked, written again in the page's language
  // A value the generator baked is French ("0,25", "42 000"): outside French it is written with a point and comma
  // groups, as the labs' own numbers are, until a lab sets it again (setTpl marks the element). "@key" is a word.
  var bakedV = function (x) { return A.lang() === 'fr' ? x : x.replace(/(\d),(\d)/g, '$1.$2').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?!\d))/g, '$1,'); };
  var fillTpl = function (root) {
    $$('[data-tpl]', root).forEach(function (el) {
      var v = {}; [].forEach.call(el.attributes, function (a) { if (a.name.indexOf('data-tpl-') === 0) v[a.name.slice(9)] = a.value.charAt(0) === '@' ? A.t(a.value.slice(1)) : el._tplJs ? a.value : bakedV(a.value); });
      var s = tf(A.t(el.getAttribute('data-tpl')), v); if (s && el.textContent !== s) el.textContent = s;
    });
  };
  // a lab goes live: its controls enabled (but those it keeps off), its still-state parts hidden by .is-live
  var live = function (root) { $$('button[disabled],input[disabled]', root).forEach(function (el) { el.disabled = false; }); root.classList.add('is-live'); fillTpl(root); A.onLang(function () { fillTpl(root); }); };
  var btn = function (root, n) { return $('[data-act="' + n + '"]', root); };
  var noCrypto = function (root) { var n = o(root, 'nocrypto'); if (n) n.hidden = false; };
  var sha = function (s) { return hashKit.sha256(s); };
  var tone = function (el, no) { if (el) el.classList.toggle('is-no', !!no); };

  /* 1.1 · webs: where a message lives in each web, and what an event does to it. A change of web or event is a cut: the
     figure takes data-web / data-ev and CSS strikes what is gone; the post typed stays in the page (never stored). */
  LABS.webs = function (root, api) {
    var K = 'web3c.mods.0.items.0.lab.', inp = $('[data-f="post"]', root), fig = $('.st-webs__fig', root), say = o(root, 'say'), w = 2, ev = null;
    var paint = function () {
      var txt = inp.value.trim() || api.t(K + 'post.ph');
      $$('[data-o="post"]', root).forEach(function (x) { x.textContent = txt; });
      root.setAttribute('data-web', w); fig.setAttribute('data-ev', ev == null ? '' : String(ev));
      $$('[data-gone-on]', fig).forEach(function (x) {
        var pw = Number(x.closest('[data-w]').getAttribute('data-w'));
        x.classList.toggle('is-gone', ev != null && pw === w && x.getAttribute('data-gone-on').split(',').indexOf(String(ev)) > -1);
      });
      $$('[data-act="ev"]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(ev != null && Number(b.getAttribute('data-v')) === ev)); });
    };
    live(root);
    api.radios($('[data-f="web"]', root), function (v) { w = v; ev = null; api.say(say, ''); paint(); });
    $$('[data-act="ev"]', root).forEach(function (b) {
      b.addEventListener('click', function () { ev = Number(b.getAttribute('data-v')); paint(); api.say(say, api.t(K + 'res.' + w + '.' + ev)); });
    });
    inp.addEventListener('input', paint);
    api.onLang(function () { paint(); if (ev != null) say.textContent = api.t(K + 'res.' + w + '.' + ev); });
    paint();
  };

  /* 1.2 · trust: the four hidden points of trust on the public chain's map; a press finds one (never unfound), its
     sentence written beside it, the count said; all four found, the ring is inked whole (still no centre) */
  LABS.trust = function (root, api) {
    var K = 'web3c.mods.0.items.1.lab.', found = [false, false, false, false], say = o(root, 'say'), ring = o(root, 'ring'), dots = $$('i', ring);
    var paint = function () {
      var n = 0;
      found.forEach(function (f, i) { var p = o(root, 'pt' + i); p.textContent = f ? api.t(K + 'pts.' + i + '.v') : ''; p.classList.toggle('is-on', f); if (f) n++; });
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i % 2 === 0 && i / 2 < n); });
      ring.classList.toggle('is-full', n === 4);
      return n;
    };
    live(root);
    $$('[data-act="pt"]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = Number(b.getAttribute('data-v')); if (found[i]) return;
        found[i] = true; b.setAttribute('aria-pressed', 'true');
        api.say(say, api.t(K + 'count').replace('{n}', paint()));
      });
    });
    api.onLang(paint);
  };

  /* 1.3 · gossip: seven copies of one ledger. Broadcast adds a line to every plugged node; node 4 can be tampered
     with (its fingerprint changes, the node is marked odd); node 6 can be unplugged (it misses lines and catches up
     when plugged back); one central server instead, where a tampered line has nothing to be compared with. The
     fingerprints are SHA-256 of each copy's lines; agreement compares the copies themselves. */
  LABS.gossip = function (root, api) {
    var K = 'web3c.mods.0.items.2.lab.', say = o(root, 'say'), cards = $$('.st-gos__card[data-node]', root);
    var st = { sent: 0, tam: false, off: false, missed: 0, central: false }, seq = 0;
    var tl = function (k) { return api.t(K + k); };
    var line = function (n) { return tl('newLine') + (n > 1 ? ' (' + n + ')' : ''); };
    var hist = function (i) {
      var h = [0, 1, 2].map(function (j) { return tl('lines.' + j); }), got = st.sent - (i === 5 && st.off ? st.missed : 0);
      for (var n = 1; n <= got; n++) h.push(line(n));
      if (st.tam && (st.central ? i === -1 : i === 3)) h[0] = tl('tampered');
      return h;
    };
    var lines = function (ol, h, fresh) {
      ol.textContent = '';
      // the first line (the one a cheat rewrites) stays in view; past three lines, a gap, then the last two
      var show = h.length > 3 ? [h[0], '…'].concat(h.slice(-2)) : h;
      show.forEach(function (x, j, a) {
        var li = document.createElement('li'), b = document.createElement('bdi'); b.textContent = x; li.appendChild(b);
        if (h.length > 3 && j === 1) li.className = 'st-gos__gap';
        if (fresh && j === a.length - 1) { var v = document.createElement('span'); v.className = 'st-gos__ok'; v.textContent = ' ' + tl('valid'); li.appendChild(v); }
        ol.appendChild(li);
      });
    };
    var tip = function (el, h, my) { if (!subtle) { el.textContent = '—'; return; } sha(h.join('\n')).then(function (d) { if (my === seq) el.textContent = d.slice(0, 8); }, function () { el.textContent = '—'; }); };
    var render = function () {
      var my = ++seq;
      o(root, 'ring').hidden = st.central; o(root, 'central').hidden = !st.central;
      if (st.central) { var c = hist(-1); lines(o(root, 'clines'), c, st.sent > 0); tip(o(root, 'ctip'), c, my); return { a: 1, n: 1 }; }
      var hs = cards.map(function (c, i) { return hist(i); }), ks = hs.map(function (h) { return h.join('\n'); }), g = kit.agree(ks);
      cards.forEach(function (card, i) {
        var off = i === 5 && st.off, odd = !off && ks[i] !== g.maj, mk = o(card, 'mark');
        lines(o(card, 'lines'), hs[i], st.sent > 0 && !(off && st.missed > 0));
        tip(o(card, 'tip'), hs[i], my);
        card.classList.toggle('is-odd', odd); card.classList.toggle('is-off', off);
        mk.textContent = odd ? tl('odd') : off ? tl('off') : '';
      });
      return { a: g.a, n: 7 };
    };
    var agreeL = function (r) { return tl('say.agree').replace('{a}', r.a).replace('{n}', r.n); };
    var label = function () {
      btn(root, 'tamper').textContent = st.tam ? api.t('web3c.x.reset') : tl('tamper');
      btn(root, 'plug').textContent = tl(st.off ? 'plug' : 'unplug');
      btn(root, 'central').textContent = tl(st.central ? 'ring' : 'central');
      btn(root, 'plug').disabled = st.central;
    };
    live(root); if (!subtle) noCrypto(root);
    btn(root, 'go').addEventListener('click', function () {
      st.sent++; if (st.off) st.missed++;
      var r = render(); tone(say, st.tam && !st.central);
      api.say(say, st.central ? line(st.sent) : agreeL(r) + (st.off ? ' ' + tl('say.missed').replace('{k}', st.missed) : '') + (st.tam ? ' ' + tl('say.odd') : ''));
    });
    btn(root, 'tamper').addEventListener('click', function () {
      st.tam = !st.tam; var r = render(); label();
      tone(say, st.tam); api.say(say, st.tam ? (st.central ? tl('say.central') : agreeL(r) + ' ' + tl('say.odd')) : agreeL(r));
    });
    btn(root, 'plug').addEventListener('click', function () {
      var k = st.missed; st.off = !st.off; if (!st.off) st.missed = 0;
      var r = render(); label(); tone(say, false);
      api.say(say, st.off ? agreeL(r) : tl('say.caught').replace('{k}', k));
    });
    btn(root, 'central').addEventListener('click', function () { st.central = !st.central; st.tam = false; render(); label(); api.say(say, ''); });
    api.onLang(function () { render(); label(); });
    render(); label();
  };

  /* 2.1 · merkle: four operations (five in odd mode) hashed in pairs up to a root; the root sits in block 1, whose hash
     block 2 carries. A node whose digest differs from the same tree at its defaults is marked; once the root differs,
     the link between blocks 1 and 2 breaks. "Prove operation 3" dims all but what a light wallet is given. */
  LABS.merkle = function (root, api) {
    var K = 'web3c.mods.1.items.0.lab.', ins = $$('[data-f="leaf"]', root), say = o(root, 'say'), tree = o(root, 'tree');
    var odd = false, proving = false, seq = 0, intact = null, def = {};
    var defaults = function () { var d = [0, 1, 2, 3].map(function (i) { return api.t(K + 'leaves.' + i); }); d.push(api.t(K + 'leaf5')); return d; };
    var levelsOf = function (texts) { return Promise.all(texts.map(sha)).then(function (hs) { return kit.merkle(hs, sha); }); };
    var node = function (l, i, last) { return $('[data-n="' + (l === last ? 'root-0' : l + '-' + i) + '"]', tree); };
    var prep = function () {
      var d = defaults();
      return Promise.all([levelsOf(d.slice(0, 4)), levelsOf(d)]).then(function (r) { def = { even: r[0], odd: r[1] }; return kit.blocks(r[0][r[0].length - 1][0], sha); }).then(function (b) { def.blocks = b; });
    };
    var render = function () {
      var my = ++seq, texts = ins.slice(0, odd ? 5 : 4).map(function (x) { return x.value; });
      root.setAttribute('data-odd', odd ? '1' : '0');
      $('[data-lvl="2"]', tree).hidden = !odd; $('[data-n="1-2"]', tree).hidden = !odd; $('[data-n="0-4"]', tree).hidden = !odd;
      o(root, 'oddcap').hidden = !odd;
      return levelsOf(texts).then(function (lv) {
        if (my !== seq) return;
        var D = odd ? def.odd : def.even, last = lv.length - 1, keep = proving ? kit.proof(lv, 2) : null;
        lv.forEach(function (row, l) { row.forEach(function (h, i) {
          var n = node(l, i, last); if (!n) return;
          o(n, 'h').textContent = h.slice(0, 8);
          n.classList.toggle('is-changed', h !== D[l][i]);
          n.classList.toggle('is-dim', !!keep && keep.indexOf(l === last ? 'root-0' : l + '-' + i) < 0);
        }); });
        var rt = lv[last][0];
        return kit.blocks(rt, sha).then(function (b) {
          if (my !== seq) return;
          var cards = $$('[data-blk]', root);
          cards.forEach(function (c, i) {
            var x = i === 0 ? b[0] : def.blocks[i];
            o(c, 'prev').textContent = x.prev.slice(0, 8); o(c, 'root').textContent = x.root.slice(0, 8); o(c, 'bh').textContent = x.h.slice(0, 8);
          });
          var ok = b[0].h === def.blocks[1].prev;
          $('[data-link="0"]', root).classList.toggle('is-broken', !ok);
          $$('[data-blk="0"]', root).forEach(function (c) { c.classList.toggle('is-changed', !ok); });
          if (ok !== intact) { intact = ok; if (!proving) { tone(say, !ok); api.say(say, api.t(K + (ok ? 'intact' : 'broken'))); } }
        });
      });
    };
    var reset = function () {
      var d = defaults(); ins.forEach(function (x, i) { x.value = d[i]; });
      odd = false; proving = false; intact = null;
      btn(root, 'prove').setAttribute('aria-pressed', 'false'); btn(root, 'prove').disabled = false; btn(root, 'odd').textContent = api.t(K + 'add5');
      return prep().then(render);
    };
    live(root);
    if (!subtle) { noCrypto(root); $$('button,input', root).forEach(function (x) { x.disabled = true; }); return; }
    ins.forEach(function (x) { x.addEventListener('input', function () { render(); }); });
    btn(root, 'odd').addEventListener('click', function () {
      odd = !odd; btn(root, 'odd').textContent = api.t(K + (odd ? 'rm5' : 'add5'));
      // the proof's sentence counts two digests: it is offered on the four-operation tree only
      if (odd && proving) { proving = false; btn(root, 'prove').setAttribute('aria-pressed', 'false'); }
      btn(root, 'prove').disabled = odd; render();
    });
    btn(root, 'prove').addEventListener('click', function () {
      proving = !proving; btn(root, 'prove').setAttribute('aria-pressed', String(proving));
      render(); tone(say, !proving && intact === false); api.say(say, proving ? api.t(K + 'proved') : api.t(K + (intact === false ? 'broken' : 'intact')));
    });
    btn(root, 'reset').addEventListener('click', function () { reset().then(function () { tone(say, false); api.say(say, api.t(K + 'intact')); }); });
    api.onLang(function () { reset(); });
    reset();
  };

  /* 2.2 · consensus: four ways to choose the next block, one panel at a time (a cut). Work: SHA-256 over "text nonce"
     for nonce = 0, 1, 2… in chunks of 400 a frame until the digest starts with the zeros asked (1 to 4), with a stop;
     one hash verifies. Stake: ten deposits, a proposer drawn by deposit (crypto.getRandomValues), a cheat cut and
     excluded, a vote that finalises at two thirds. Delegated: ten votes over six candidates, the top three produce in
     turn. Byzantine: ten validators, a round commits with seven honest votes. */
  LABS.consensus = function (root, api) {
    var K = 'web3c.mods.1.items.1.lab.', say = o(root, 'say'), tl = function (k) { return api.t(K + k); };
    live(root);
    /* work */
    var zr = $('[data-f="zeros"]', root), tries = o(root, 'tries'), hashEl = o(root, 'hash'), mb = btn(root, 'mine'), sb = btn(root, 'stop'), vb = btn(root, 'verify');
    var run = 0, found = null, text = function () { return tl('pow.block') + ' · ' + api.t('web3c.mods.1.items.0.lab.leaves.0'); };
    var paintZ = function () { o(root, 'zeros').textContent = zr.value; zr.setAttribute('aria-valuetext', zr.value); };
    var showHash = function (r, z) {
      hashEl.textContent = '';
      var n = document.createElement('span'); n.className = 'st-cons__nonce'; n.textContent = 'nonce ' + r.nonce + ' ';
      var m = document.createElement('mark'); m.textContent = r.hash.slice(0, z);
      hashEl.appendChild(n); hashEl.appendChild(m); hashEl.appendChild(document.createTextNode(r.hash.slice(z, 32) + '…'));
    };
    var stop = function () { run++; mb.disabled = false; sb.disabled = true; tries.removeAttribute('aria-hidden'); };
    var clearW = function () { stop(); found = null; vb.disabled = true; hashEl.textContent = ''; tries.textContent = ''; };
    sb.disabled = true; vb.disabled = true; hashEl.textContent = ''; paintZ();
    if (!subtle) { mb.disabled = true; tries.textContent = api.t('web3c.x.noCrypto'); }
    zr.addEventListener('input', function () { paintZ(); clearW(); });
    mb.addEventListener('click', function () {
      clearW(); var my = ++run, z = Number(zr.value), t0 = text(), at = 0;
      mb.disabled = true; sb.disabled = false; tries.setAttribute('aria-hidden', 'true');
      var step = function () {
        if (my !== run) return;
        kit.mine(t0, at, 400, z, sha).then(function (r) {
          if (my !== run) return;
          if (r) {
            stop(); found = { nonce: r.nonce, z: z, text: t0 }; vb.disabled = false; showHash(r, z);
            tries.textContent = tl('pow.tries').replace('{n}', api.num(r.nonce + 1));
            api.say(say, tl('pow.found').replace('{n}', r.nonce).replace('{h}', r.hash.slice(0, 16) + '…'));
            return;
          }
          at += 400; tries.textContent = tl('pow.tries').replace('{n}', api.num(at));
          requestAnimationFrame(step);
        }, function () { stop(); tries.textContent = api.t('web3c.x.noCrypto'); });
      };
      requestAnimationFrame(step);
    });
    sb.addEventListener('click', function () { stop(); api.say(say, tries.textContent); });
    vb.addEventListener('click', function () {
      if (!found) return;
      sha(found.text + ' ' + found.nonce).then(function (h) { if (h.indexOf(new Array(found.z + 1).join('0')) === 0) api.say(say, tl('pow.verified')); });
    });
    /* stake */
    var D = [32, 32, 64, 32, 96, 32, 64, 32, 32, 64], discs = $$('.st-cons__disc', root), out = [], slot = 0;
    var rnd = function () { var a = new Uint32Array(1); window.crypto.getRandomValues(a); return a[0]; };
    btn(root, 'slot').addEventListener('click', function () {
      var ws = D.map(function (d, i) { return out.indexOf(i) < 0 ? d : 0; }), tot = ws.reduce(function (a, b) { return a + b; }, 0);
      var i = kit.pick(ws, kit.randInt(tot, rnd)); slot++;
      discs.forEach(function (d, j) { d.classList.toggle('is-on', j === i); });
      api.say(say, tl('pos.slotSay').replace('{s}', slot).replace('{n}', i + 1));
    });
    var cheat = btn(root, 'cheat');
    cheat.addEventListener('click', function () {
      if (out.indexOf(3) > -1) return;
      out.push(3); cheat.setAttribute('aria-pressed', 'true'); discs[3].classList.add('is-cut'); discs[3].classList.remove('is-on');
      api.say(say, tl('pos.slashed'));
    });
    btn(root, 'vote').addEventListener('click', function () {
      var r = kit.share(D, out);
      o(root, 'bar').style.setProperty('--p', r.p / 100);
      api.say(say, tl('pos.final').replace('{p}', r.p) + (r.final ? ' · ' + tl('pos.done') : ''));
    });
    /* delegated stake */
    var votes = [0, 0, 0, 0, 0, 0], cands = $$('[data-c]', root), left = o(root, 'left');
    var paintV = function () {
      var sum = votes.reduce(function (a, b) { return a + b; }, 0), top = kit.top3(votes);
      cands.forEach(function (c, i) { o(c, 'v').textContent = votes[i]; c.classList.toggle('is-prod', top.indexOf(i) > -1); });
      $$('[data-act="plus"]', root).forEach(function (b) { b.disabled = sum >= 10; });
      $$('[data-act="minus"]', root).forEach(function (b) { b.disabled = votes[Number(b.getAttribute('data-v'))] === 0; });
      $$('li', o(root, 'turns')).forEach(function (li, k) { li.textContent = top.length === 3 ? String(top[k % 3] + 1) : '—'; });
      left.setAttribute('data-tpl-n', String(10 - sum)); fillTpl(left.parentNode);
      return top;
    };
    $$('[data-act="plus"],[data-act="minus"]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = Number(b.getAttribute('data-v')), sum = votes.reduce(function (a, c) { return a + c; }, 0);
        if (b.getAttribute('data-act') === 'plus' && sum < 10) votes[i]++; else if (b.getAttribute('data-act') === 'minus' && votes[i] > 0) votes[i]--;
        var top = paintV(); api.say(say, left.textContent + (top.length === 3 ? ' · ' + top.map(function (x) { return x + 1; }).join(', ') : ''));
        if (b.disabled) (b.getAttribute('data-act') === 'plus' ? $('[data-act="minus"][data-v="' + i + '"]', root) : $('[data-act="plus"][data-v="' + i + '"]', root)).focus();
      });
    });
    paintV();
    /* byzantine */
    var fr = $('[data-f="faulty"]', root), fl = o(root, 'faultyL'), vs = $$('li', o(root, 'votes'));
    var paintB = function () {
      var f = Number(fr.value); fl.setAttribute('data-tpl-n', String(f)); fillTpl(fl.parentNode);
      fr.setAttribute('aria-valuetext', fl.textContent);
      vs.forEach(function (li, i) { li.classList.toggle('is-on', i < 10 - f); });
    };
    fr.addEventListener('input', paintB);
    btn(root, 'round').addEventListener('click', function () { var r = kit.bft(Number(fr.value)); tone(say, !r.ok); api.say(say, tl(r.ok ? 'bft.commit' : 'bft.fail').replace('{v}', r.v)); });
    paintB();
    /* the panels */
    api.radios($('[data-f="tab"]', root), function (v) { root.setAttribute('data-tab', String(v)); stop(); api.say(say, ''); });
    api.onLang(function () { paintZ(); paintV(); paintB(); clearW(); });
  };

  /* bins (2.3, 3.1, 3.4): the course's sorting rows, answers kept in memory for this visit (never in the brief);
     a press paints the row's reason and the score and says numidea:bin (2.3's triangle inks the edge pressed) */
  LABS.bins = function (root, api) {
    var ol = $('[data-bins-x]', root), rows = $$('[data-bin-row]', ol), score = $('[data-bin-score]', root), a = rows.map(function () { return -1; });
    ol._bins = a;
    var paint = function () {
      var n = 0, any = false;
      rows.forEach(function (row, r) {
        var ok = Number(row.getAttribute('data-bin-ok')), b = a[r], why = $('[data-bin-why]', row);
        $$('[data-bin]', row).forEach(function (x) { x.setAttribute('aria-pressed', String(Number(x.getAttribute('data-bin')) === b)); });
        row.classList.toggle('is-on', b > -1); row.classList.toggle('is-match', b === ok); row.classList.toggle('is-off', b > -1 && b !== ok);
        if (b > -1) { any = true; if (b === ok) n++; }
        var okLab = (($('[data-bin="' + ok + '"]', row) || {}).textContent || '').trim();
        why.textContent = b < 0 ? '' : (b === ok ? api.t('fiche.match') : api.t('fiche.other').replace('{b}', okLab)) + ' ' + api.t(why.getAttribute('data-why-k'));
      });
      var s = any ? api.t(score.getAttribute('data-score-k')).replace('{n}', n) : '';
      if (score.textContent !== s) score.textContent = s;
    };
    rows.forEach(function (row, r) {
      $$('[data-bin]', row).forEach(function (x) {
        x.addEventListener('click', function () { a[r] = Number(x.getAttribute('data-bin')); paint(); A.emit('numidea:bin', { el: ol, row: r, bin: a[r] }); });
      });
    });
    // 2.3: the triangle. Bin 0 keeps safe + decentralised (gives up scale, corner 1), bin 1 safe + scale (gives up
    // decentralisation, corner 2), bin 2 scale + decentralised (gives up safety, corner 0)
    var tri = $('[data-tri]', root), given = o(root, 'given'), lastBin = -1, GIVE = [1, 2, 0];
    var paintTri = function () {
      if (!tri) return;
      tri.setAttribute('data-edge', lastBin < 0 ? '' : String(lastBin));
      $$('[data-c]', tri).forEach(function (c) { c.classList.toggle('is-dim', lastBin > -1 && Number(c.getAttribute('data-c')) === GIVE[lastBin]); });
      given.textContent = lastBin < 0 ? '' : api.t('web3c.mods.1.items.2.lab.given').replace('{c}', api.t('web3c.mods.1.items.2.lab.corners.' + GIVE[lastBin]));
    };
    if (tri) api.on(root, 'bin', function (d) { lastBin = d.bin; paintTri(); });
    live(root);
    api.onLang(function () { paint(); paintTri(); });
  };

  /* 2.4 · routes: five ways for a hundred small transfers, one row of the table at a time (a cut); the road's picture
     is the chosen route's own drawing */
  LABS.routes = function (root, api) {
    var K = 'web3c.mods.1.items.3.lab.', say = o(root, 'say'), rows = $$('tr[data-r]', root), slot = o(root, 'pic');
    var heads = function () { $$('td[data-head-k]', root).forEach(function (td) { td.setAttribute('data-head', api.t(td.getAttribute('data-head-k'))); }); };
    var show = function (v, speak) {
      root.setAttribute('data-route', String(v));
      rows.forEach(function (r) { r.classList.toggle('is-on', Number(r.getAttribute('data-r')) === v); });
      var p = $('[data-pic="' + v + '"]', rows[v]); slot.textContent = ''; if (p) slot.appendChild(p.cloneNode(true));
      if (speak) api.say(say, api.t(K + 'step').replace('{i}', v + 1).replace('{v}', api.t(K + 'k.' + v)));
    };
    live(root); heads();
    api.radios($('[data-f="route"]', root), function (v) { show(v, true); });
    api.onLang(heads);
    show(0, false);
  };

  /* 3.2 · bip39: the standard's public test phrase, one word changed at a time among two fixed words (no text field:
     the lab can never hold a phrase the visitor chose). The checksum is rebuilt from the twelve indices; the seed
     (PBKDF2-HMAC-SHA512) is made only for the intact test phrase, with two fixed sample passphrases. Self-test, silent:
     the test phrase with the standard's own vector passphrase must give the published seed (c55257c3…), and the two
     single changes that pass (word 2 → ability, word 8 → zoo) must pass; else the seed part is removed. */
  LABS.bip39 = function (root, api) {
    var K = 'web3c.mods.2.items.1.lab.', say = o(root, 'say'), T = kit.bip.test(), cur = T.slice(), at = -1, changed = -1, pass = 0, lastSeed = null;
    var chips = $$('[data-act="word"]', root), alt = o(root, 'alt'), altG = $('[data-f="alt"]', root), opts = $$('[role="radio"]', altG), seedB = btn(root, 'seed');
    var tl = function (k) { return api.t(K + k); };
    var digest = function (b) { return subtle.digest('SHA-256', b); };
    var PASS = ['', 'atelier'];
    var name = function (i) { return tl('swap') + ' · ' + tf(tl('word'), { n: i + 1 }) + ' · ' + cur[i]; };
    var paint = function () {
      chips.forEach(function (c, i) {
        var w = cur[i], li = c.parentNode;
        o(c, 'w').textContent = w; o(c, 'b').textContent = kit.bip.bits(kit.bip.IDX[w]);
        o(c, 'i').setAttribute('data-tpl-i', String(kit.bip.IDX[w]));
        o(c, 'test').hidden = w !== T[i]; li.classList.toggle('is-changed', w !== T[i]);
        c.setAttribute('aria-label', name(i)); c.setAttribute('aria-expanded', String(at === i));
      });
      fillTpl(root);
      seedB.disabled = changed > -1 || !subtle; o(root, 'seedOnly').hidden = changed < 0;
      if (at > -1) {
        o(root, 'altL').textContent = tf(tl('altL'), { n: at + 1 });
        o(root, 'back').textContent = tf(tl('back'), { w: T[at] });
        var v = cur[at] === 'ability' ? 1 : cur[at] === 'zoo' ? 2 : 0;
        opts.forEach(function (r) { var on = Number(r.getAttribute('data-v')) === v; r.setAttribute('aria-checked', String(on)); r.tabIndex = on ? 0 : -1; });
      }
    };
    var check = function () {
      if (!subtle) return;
      kit.bip.check(cur, digest).then(function (ok) { tone(say, !ok); api.say(say, ok ? tl('sumOk') + (changed > -1 ? ' ' + tl('lucky') : '') : tl('sumBad')); });
    };
    live(root);
    chips.forEach(function (c, i) {
      c.addEventListener('click', function () { at = at === i ? -1 : i; alt.hidden = at < 0; paint(); if (at > -1) { var f = $('[role="radio"][tabindex="0"]', altG); if (f) f.focus(); } });
    });
    alt.addEventListener('keydown', function (e) { if (e.key === 'Escape' && at > -1) { var c = chips[at]; at = -1; alt.hidden = true; paint(); c.focus(); } });
    api.radios(altG, function (v) {
      if (at < 0) return;
      cur = T.slice(); changed = -1;
      if (v > 0) { cur[at] = v === 1 ? 'ability' : 'zoo'; changed = at; }
      lastSeed = null; o(root, 'seed').textContent = '—';
      paint(); check();
    });
    api.radios($('[data-f="pass"]', root), function (v) { pass = v; });
    seedB.addEventListener('click', function () {
      if (changed > -1 || !subtle) return;
      var p = pass;
      kit.bip.seed(T, PASS[p], subtle).then(function (h) {
        o(root, 'seed').textContent = h.slice(0, 32) + '…';
        api.say(say, tl('seedL') + ' ' + h.slice(0, 32) + '…' + (lastSeed !== null && lastSeed !== p ? ' ' + tl('other') : ''));
        lastSeed = p;
      });
    });
    api.onLang(paint);
    paint();
    if (!subtle) { noCrypto(root); chips.forEach(function (c) { c.disabled = true; }); return; }
    // the standard's vector passphrase, kept out of the page's words: it is never shown
    var VP = String.fromCharCode(84, 82, 69, 90, 79, 82), two = T.slice(), eight = T.slice();
    two[1] = 'ability'; eight[7] = 'zoo';
    Promise.all([kit.bip.seed(T, VP, subtle), kit.bip.check(T, digest), kit.bip.check(two, digest), kit.bip.check(eight, digest)]).then(function (r) {
      if (r[0].indexOf('c55257c3') !== 0 || !r[1] || !r[2] || !r[3]) { var s = $('.st-b39__seed', root); if (s) s.hidden = true; }
    }, function () { var s = $('.st-b39__seed', root); if (s) s.hidden = true; });
  };

  /* 3.3 · vc: an issuer signs a four-field card (ECDSA P-256, the browser's own; the private key never leaves memory
     and is dropped when the page goes), the holder keeps it and may change the year or hide a field, the verifier
     checks what is shown against the signature: valid, changed, or a field missing (a plain signature covers all) */
  LABS.vc = function (root, api) {
    var K = 'web3c.mods.2.items.2.lab.vc.', say = o(root, 'say'), F = ['name', 'deg', 'year', 'grade'], card = o(root, 'card');
    var sk = subtle ? kit.signKit(subtle) : null, keys = null, sig = null, base = null, year = null, hide = false;
    var tl = function (k) { return api.t(K + k); };
    var vals = function () { var v = {}; F.forEach(function (f) { v[f] = tl('vals.' + f); }); if (year != null) v.year = String(year); return v; };
    var paint = function () {
      var v = vals();
      F.forEach(function (f) { o(card, f).textContent = v[f]; });
      card.setAttribute('data-issued', sig ? '1' : '0');
      $('[data-f="grade"]', card).classList.toggle('is-hidden', hide);
      $('[data-f="year"]', card).classList.toggle('is-edited', base != null && year !== base);
      o(card, 'sig').textContent = sig ? sig.slice(0, 16) + '…' : '—';
      btn(root, 'hide').setAttribute('aria-pressed', String(hide));
    };
    var drop = function () { keys = null; sig = null; base = null; year = null; hide = false; };
    live(root);
    if (!sk) { noCrypto(root); $$('button', root).forEach(function (b) { b.disabled = true; }); return; }
    btn(root, 'issue').addEventListener('click', function () {
      year = null; hide = false; var v = vals();
      (keys ? Promise.resolve(keys) : sk.pair()).then(function (k) { keys = k; return sk.sign(k.privateKey, kit.canon(v)); }).then(function (s) {
        sig = s; base = Number(v.year); year = base; paint(); api.say(say, '');
      });
    });
    btn(root, 'edit').addEventListener('click', function () { if (!sig) { api.say(say, tl('need')); return; } year++; paint(); });
    btn(root, 'hide').addEventListener('click', function () { if (!sig) { api.say(say, tl('need')); return; } hide = !hide; paint(); });
    btn(root, 'show').addEventListener('click', function () {
      if (!sig) { api.say(say, tl('need')); return; }
      var v = vals(); if (hide) delete v.grade;
      sk.verify(keys.publicKey, sig, kit.canon(v)).then(function (ok) { tone(say, !ok); api.say(say, tl(ok ? 'ok' : hide ? 'hidden' : 'bad')); });
    });
    window.addEventListener('pagehide', function () { drop(); paint(); });
    // a card signed in one language does not read in another: a switch starts over
    api.onLang(function () { drop(); paint(); api.say(say, ''); });
    paint();
  };

  /* W3X-M456 */
  /* ================ modules 4, 5 and 6: the phase-1 labs (SPEC §5) ================
     The maths first, in one object with no page in it (kit2): enh/test-m456.mjs runs it outside a browser against
     known values (Bitcoin's issuance sum, EIP-1559's fee and base-fee rules, ethereum.org's JSON-RPC examples), and
     enh/w3x-labs-m456.mjs bakes the still states from it, so the page without script shows the same numbers. */
  var kit2 = (function () {
    var B = window.BigInt;
    var copy = function (o) { return JSON.parse(JSON.stringify(o)); };
    // 4.1 · one account's ETH (in tenths: 1,0 = 10), a token contract's three rows, the WETH contract's row (tenths).
    // Any send needs ETH for its fee; the fee itself is not counted (the lab prints no fee figure)
    var bal = {
      init: function () { return { eth: 10, tok: [120, 40, 0], weth: 0, fee: false }; },
      act: function (s, a, v) {
        var n = copy(s);
        if (a === 'empty') { n.eth = 0; return { s: n, r: 'empty' }; }
        if (s.eth <= 0) return { s: s, r: 'blocked' };
        if (a === 'eth') { if (s.eth < 2) return { s: s, r: 'low' }; n.eth -= 2; n.fee = true; return { s: n, r: 'eth' }; }
        if (a === 'tok') { if (s.tok[0] < 50) return { s: s, r: 'lowTok' }; n.tok[0] -= 50; n.tok[1] += 50; n.fee = true; return { s: n, r: 'tok' }; }
        var m = a === 'wrap' ? Math.min(v, s.eth) : Math.min(v, s.weth);
        if (m <= 0) return { s: s, r: 'none' };
        if (a === 'wrap') { n.eth -= m; n.weth += m; } else { n.weth -= m; n.eth += m; }
        n.fee = true; return { s: n, r: 'wrap' };
      }
    };
    // 4.2 · one transfer on four ledgers. Holders 0, 1, 2. ERC-721: the owner of tokens #1–#3. ERC-1155: type 1
    // (interchangeable) and type 7 (unique), a quantity per holder. SPL: one token account per holder, the mint's supply
    var led = {
      init: function () { return { e20: [100, 50, 0], e721: [0, 1, 2], e1155: { 1: [100, 50, 0], 7: [1, 0, 0] }, spl: [100, 50, 0], uri: false }; },
      send: function (s, tab, from, to, x, batch) {
        if (from === to) return { s: s, err: 'same' };
        var n = copy(s), q = Number(x);
        if (tab === 1) { if (s.e721[q] !== from) return { s: s, err: 'notOwner' }; n.e721[q] = to; return { s: n, ev: ['Transfer', [from, to, q + 1]] }; }
        if (!(q >= 1)) return { s: s, err: 'lowBal' };
        if (tab === 0 || tab === 3) {
          var k = tab === 0 ? 'e20' : 'spl';
          if (s[k][from] < q) return { s: s, err: 'lowBal' };
          n[k][from] -= q; n[k][to] += q;
          return { s: n, ev: tab === 0 ? ['Transfer', [from, to, q]] : ['spl', [from, to, q]] };
        }
        if (s.e1155[1][from] < q || (batch && s.e1155[7][from] < 1)) return { s: s, err: 'lowBal' };
        n.e1155[1][from] -= q; n.e1155[1][to] += q;
        if (batch) { n.e1155[7][from] -= 1; n.e1155[7][to] += 1; return { s: n, ev: ['TransferBatch', [from, from, to, [1, 7], [q, 1]]] }; }
        return { s: n, ev: ['TransferSingle', [from, from, to, 1, q]] };
      }
    };
    // a whole number of base units shown with d decimals: [integer part, fraction without its trailing zeros]
    var units = function (v, d) {
      var s = String(v), neg = s[0] === '-'; if (neg) s = s.slice(1);
      while (s.length <= d) s = '0' + s;
      return [(neg ? '-' : '') + s.slice(0, s.length - d), s.slice(s.length - d).replace(/0+$/, '')];
    };
    // 4.3 · Bitcoin's issuance as its code writes it: 50 coins (5 000 000 000 satoshis) a block, shifted right by one
    // every 210 000 blocks, nothing after 64 halvings (floor division by 2^e is the shift for a positive integer)
    var btc = {
      ERA: 210000,
      sub: function (h) { var e = Math.floor(h / 210000); return e >= 64 ? 0 : Math.floor(5e9 / Math.pow(2, e)); },
      // the satoshis created by the blocks below height h
      supply: function (h) { var s = 0, e = 0; while (e < 64 && (e + 1) * 210000 <= h) { s += 210000 * Math.floor(5e9 / Math.pow(2, e)); e++; } if (e < 64) s += (h - e * 210000) * Math.floor(5e9 / Math.pow(2, e)); return s; },
      // the curve's corners: the supply at each era's first block, to the last era that issues anything (33 of them)
      pts: function () { var p = [], e = 0; for (; e <= 33; e++) p.push([e * 210000, btc.supply(e * 210000)]); return p; }
    };
    // continuous issuance and burn (examples): S(t) = start + (issue − burn) × t, burn = use × 1,5 × issue / 100
    var flow = function (issue, use, start, T) { var burn = use * 1.5 * issue / 100, net = issue - burn, p = []; for (var t = 0; t <= T; t++) p.push([t, start + net * t]); return { burn: burn, net: net, pts: p }; };
    // vesting with a cliff (OpenZeppelin's linear curve, counted from the start): nothing before the cliff
    var vest = function (total, cliff, dur, m) { return m < cliff ? 0 : Math.floor(total * Math.min(1, m / dur)); };
    // 5.1 · the stack machine: PUSH1 a · PUSH1 b · ADD · PUSH1 c · MUL, gas from ethereum.org's table (3, 3, 3, 3, 5)
    var evm = function (a, b, c) {
      var P = [['PUSH1', a, 3], ['PUSH1', b, 3], ['ADD', null, 3], ['PUSH1', c, 3], ['MUL', null, 5]], st = [], g = 0;
      return P.map(function (p) {
        if (p[0] === 'PUSH1') st.push(p[1]); else { var y = st.pop(), x = st.pop(); st.push(p[0] === 'ADD' ? x + y : x * y); }
        g += p[2]; return { op: p[0] + (p[1] != null ? ' ' + p[1] : ''), stack: st.slice(), gas: g };
      });
    };
    // 5.1 (static) · Solana's lanes, simplified: a transaction that touches an account another one writes (or writes one
    // another reads) waits behind it in that one's lane; one that touches nothing in common opens a lane of its own
    var lanes = function (txs) {
      var hit = function (a, b) { return a.some(function (x) { return b.some(function (y) { return x[1] === y[1] && (x[0] === 'w' || y[0] === 'w'); }); }); };
      var L = [];
      txs.forEach(function (t, i) { var at = -1; L.forEach(function (l, j) { if (at < 0 && l.some(function (k) { return hit(txs[k], t); })) at = j; }); if (at < 0) L.push([i]); else L[at].push(i); });
      return L;
    };
    // 5.4 · EIP-1559 in wei (BigInt): the tip paid is min(tip, max − base); burnt = gas × base; total = gas × (base + tip paid)
    var GW = B ? B(1000000000) : 0;
    var toWei = function (s) { s = String(s == null ? '' : s).trim().replace(',', '.'); if (!/^\d*(\.\d*)?$/.test(s) || s === '' || s === '.') return null; var p = s.split('.'); return B(p[0] || '0') * GW + B(((p[1] || '') + '000000000').slice(0, 9)); };
    var fee = function (gas, base, tip, max) {
      var G = B(gas); if (max < base) return { under: true };
      var room = max - base, tp = tip < room ? tip : room;
      return { under: false, paidTip: tp, total: G * (base + tp), burnt: G * base, val: G * tp, back: G * (max - base - tp) };
    };
    // the next block's base fee (EIP-1559): up by base × (used − target) / target / 8 (at least 1 wei), down likewise
    var nextBase = function (base, used, limit) {
      var T = limit / B(2), d;
      if (used === T) return base;
      if (used > T) { d = base * (used - T) / T / B(8); return base + (d > B(1) ? d : B(1)); }
      return base - base * (T - used) / T / B(8);
    };
    // 6.2 · ethereum.org's two JSON-RPC examples (fetched 2026-11-21; the account shortened, SPEC §1.6)
    var RPC = [
      { req: '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}', res: '{"id":83,"jsonrpc":"2.0","result":"0x4b7"}', hex: '0x4b7' },
      { req: '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x407d73…7100c1", "latest"],"id":1}', res: '{"id":1,"jsonrpc":"2.0","result":"0x0234c8a3397aab58"}', hex: '0x0234c8a3397aab58' }
    ];
    // a small seeded generator (xorshift32): the same numbers on every visit, in every browser
    var xs = function (seed) { var x = seed >>> 0 || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x; }; };
    // 6.4 (static) · 500 mock blocks, 0–3 transfers each among three addresses; the transfers that touch address a
    var idx = function (seed, a) {
      var r = xs(seed), blocks = [], hits = 0;
      for (var b = 0; b < 500; b++) { var n = r() % 4, tx = []; for (var k = 0; k < n; k++) { var f = r() % 3, t = (f + 1 + r() % 2) % 3; tx.push([f, t]); if (f === a || t === a) hits++; } blocks.push(tx); }
      return { blocks: blocks, hits: hits };
    };
    // 6.4 · the oracle. The outside temperature walks (seeded) by up to ±0,5 °C a tick of 10 minutes; each operator
    // reads it within ±0,2 °C (one lies: 80 °C); the value kept is the median; the chain's copy is updated when it is
    // off by more than dev % or when hb minutes have passed since its last update. Spread: half the readings' range.
    var med = function (a) { var s = a.slice().sort(function (x, y) { return x - y; }), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
    var r2 = function (v) { return Math.round(v * 100) / 100; };
    var oracle = {
      SEED: 20261121,
      init: function () { return { t: 0, out: 18, on: 18, last: 0, agg: 18, spread: 0, why: -1, hist: [{ out: 18, on: 18, agg: 18, spread: 0 }], k: 0 }; },
      // the k-th tick's draws, the same whatever the settings: one for the walk, seven for the readings
      draws: function (k) { var r = xs(oracle.SEED + k * 7919), u = function () { return r() / 4294967296; }, w = u(), n = []; for (var i = 0; i < 7; i++) n.push(u()); return { w: w, n: n }; },
      tick: function (s, o) {
        var d = oracle.draws(s.k + 1), n = copy(s);
        n.k++; n.t += 10; n.out = Math.round((s.out + (d.w - 0.5)) * 10) / 10;
        var rd = []; for (var i = 0; i < o.ops; i++) rd.push(r2(n.out + (d.n[i] - 0.5) * 0.4));
        if (o.liar) rd[0] = 80;
        n.agg = r2(med(rd)); n.spread = r2((Math.max.apply(null, rd) - Math.min.apply(null, rd)) / 2);
        if (Math.abs(n.agg - s.on) / s.on * 100 > o.dev) { n.on = n.agg; n.last = n.t; n.why = 0; }
        else if (n.t - s.last >= o.hb) { n.on = n.agg; n.last = n.t; n.why = 1; }
        else n.why = 2;
        n.hist.push({ out: n.out, on: n.on, agg: n.agg, spread: n.spread }); if (n.hist.length > 12) n.hist.shift();
        return n;
      },
      // what the contract does with the chain's value: refuse it when too old or too uncertain
      check: function (s, o) { return { stale: s.t - s.last > o.age, wide: s.agg > 0 && s.spread / s.agg * 100 > o.conf }; }
    };
    // a plot's path in a 320 × 180 box (no lettering: the labels are HTML): line, step, or area down to the floor
    var path = function (pts, xr, yr, kind) {
      var X = function (x) { return Math.round((4 + (x - xr[0]) / (xr[1] - xr[0]) * 312) * 10) / 10; }, Y = function (y) { return Math.round((176 - (y - yr[0]) / (yr[1] - yr[0]) * 172) * 10) / 10; };
      var d = '';
      pts.forEach(function (p, i) {
        if (!i) d += 'M' + X(p[0]) + ' ' + Y(p[1]);
        else if (kind === 'step') d += 'H' + X(p[0]) + 'V' + Y(p[1]);
        else d += 'L' + X(p[0]) + ' ' + Y(p[1]);
      });
      if (kind === 'area' && pts.length) d += 'V' + Y(yr[0]) + 'H' + X(pts[0][0]) + 'Z';
      return d;
    };
    var Y = function (y, yr) { return Math.round((176 - (y - yr[0]) / (yr[1] - yr[0]) * 172) * 10) / 10; };
    return { bal: bal, led: led, units: units, btc: btc, flow: flow, vest: vest, evm: evm, lanes: lanes, toWei: toWei, fee: fee, nextBase: nextBase, RPC: RPC, xs: xs, idx: idx, med: med, oracle: oracle, path: path, Y: Y };
  })();

  /* ---- what the labs of modules 4–6 share: numbers in the page's language (U+202F groups and a comma in French) ---- */
  var grpS = function (i) { var g = A.lang() === 'fr' ? ' ' : ','; return String(i).replace('-', '−').replace(/\B(?=(\d{3})+(?!\d))/g, g); };
  var decS = function (i, f) { return grpS(i) + (f ? (A.lang() === 'fr' ? ',' : '.') + f : ''); };
  var unitsS = function (v, d) { var u = kit2.units(v, d); return decS(u[0], u[1]); };
  // a number with at most two decimals, trailing zeros dropped
  var nS = function (v) { var s = (Math.round(v * 100) / 100).toFixed(2).split('.'); return decS(s[0], s[1].replace(/0+$/, '')); };
  var setTpl = function (el, v) { if (!el) return; el._tplJs = true; Object.keys(v).forEach(function (k) { el.setAttribute('data-tpl-' + k, String(v[k])); }); };
  var setD = function (root, n, d) { var p = o(root, n); if (p) p.setAttribute('d', d); };
  // a button that is about to be disabled hands the focus on first
  var keepFocus = function (b, to) { if (b && b.disabled && document.activeElement === b && to) to.focus(); };

  /* 4.1 · balances: one account's ETH on the chain's own ledger, a token contract's rows, the WETH contract. A token
     send changes a row of the contract, not the account; every send takes its fee in ETH, so an account without ETH
     sends nothing at all. Wrapping moves ETH into the WETH contract, which writes as many WETH in its own table. */
  LABS.balances = function (root, api) {
    var K = 'web3c.mods.3.items.0.lab.', say = o(root, 'say'), s = kit2.bal.init(), wr = $('[data-f="wrap"]', root), acct = $('.st-bal__acct', root);
    var tl = function (k) { return api.t(K + k); };
    var paint = function (marks) {
      marks = marks || [];
      setTpl(o(root, 'eth'), { v: api.num(s.eth / 10, 1) }); o(root, 'fee').hidden = !s.fee;
      s.tok.forEach(function (v, i) { var c = o(root, 't' + i); c.textContent = grpS(v); c.parentNode.classList.toggle('is-changed', marks.indexOf('t' + i) > -1); });
      acct.classList.toggle('is-changed', marks.indexOf('eth') > -1); acct.classList.toggle('is-empty', s.eth <= 0);
      o(root, 'wrow').hidden = s.weth <= 0; o(root, 'wnone').hidden = s.weth > 0;
      o(root, 'weth').textContent = api.num(s.weth / 10, 1) + ' WETH';
      $('.st-bal__weth', root).classList.toggle('is-changed', marks.indexOf('weth') > -1);
      var w = api.num(Number(wr.value) / 10, 1); setTpl(o(root, 'wrapL'), { v: w }); wr.setAttribute('aria-valuetext', w + ' ETH');
      fillTpl(root);
    };
    var go = function (a) {
      var r = kit2.bal.act(s, a, Number(wr.value)); s = r.s;
      paint({ eth: ['eth'], tok: ['t0', 't1'], wrap: ['eth', 'weth'] }[r.r]);
      var m = { eth: tl('say.eth'), tok: tl('say.tok'), wrap: tf(tl('say.wrap'), { v: api.num(s.weth / 10, 1) }), blocked: tl('blocked'), low: tl('low'), lowTok: tl('lowTok') }[r.r];
      tone(say, /^(blocked|low|lowTok)$/.test(r.r)); api.say(say, m || '');
    };
    live(root);
    ['eth', 'tok', 'wrap', 'unwrap', 'empty'].forEach(function (a) { btn(root, a).addEventListener('click', function () { go(a); }); });
    btn(root, 'reset').addEventListener('click', function () { s = kit2.bal.init(); paint(); tone(say, false); api.say(say, ''); });
    wr.addEventListener('input', function () { paint(); });
    api.onLang(function () { paint(); });
    paint();
  };

  /* 4.2 · ledgers: the same transfer on four ledgers (a cut from one to the next). The cells it changed are marked and
     the event the contract would emit is written as the standard names it; ERC-20's decimals change only what a wallet
     shows; ERC-721's link can be changed by its contract while the number and the owner stay. */
  LABS.ledgers = function (root, api) {
    var K = 'web3c.mods.3.items.1.lab.', say = o(root, 'say'), s = kit2.led.init(), tab = 0, from = 0, to = 1, id = 0, dec = 0, marks = [];
    var amt = $('[data-f="amount"]', root), RAW = window.BigInt ? window.BigInt('1500000000000000000') : 0;
    var H = function (i) { return api.t(K + 'holders.' + i); };
    var set = function (n, v) { var c = o(root, n); if (!c) return; c.textContent = v; var cell = c.closest('td') || c; cell.classList.toggle('is-changed', marks.indexOf(n) > -1); };
    var paint = function () {
      root.setAttribute('data-tab', String(tab));
      s.e20.forEach(function (v, i) { set('e20-' + i, grpS(v)); });
      s.e721.forEach(function (h, i) { set('o721-' + i, H(h)); });
      [1, 7].forEach(function (t) { s.e1155[t].forEach(function (v, i) { set('e1155-' + t + '-' + i, grpS(v)); }); });
      s.spl.forEach(function (v, i) { set('spl-' + i, grpS(v)); });
      o(root, 'uri').textContent = 'https://exemple.org/nft/1' + (s.uri ? '-v2' : '') + '.json';
      root.setAttribute('data-uri', s.uri ? '1' : '0'); btn(root, 'uri').setAttribute('aria-pressed', String(s.uri));
      o(root, 'shown').textContent = unitsS(RAW, [18, 6, 0][dec]);
    };
    var evText = function (ev) {
      var a = ev[1];
      if (ev[0] === 'Transfer') return 'Transfer(' + H(a[0]) + ', ' + H(a[1]) + ', ' + a[2] + ')';
      if (ev[0] === 'TransferSingle') return 'TransferSingle(' + H(a[0]) + ', ' + H(a[1]) + ', ' + H(a[2]) + ', 1, ' + a[4] + ')';
      if (ev[0] === 'TransferBatch') return 'TransferBatch(' + H(a[0]) + ', ' + H(a[1]) + ', ' + H(a[2]) + ', [1, 7], [' + a[4][0] + ', 1])';
      return 'instruction Transfer · ' + H(a[0]) + ' → ' + H(a[1]) + ' · ' + a[2];
    };
    var send = function (batch) {
      var q = Math.floor(Number(amt.value)), r = kit2.led.send(s, tab, from, to, tab === 1 ? id : q, batch);
      if (r.err) { tone(say, true); api.say(say, api.t(K + r.err)); return; }
      s = r.s;
      marks = tab === 0 ? ['e20-' + from, 'e20-' + to] : tab === 1 ? ['o721-' + id] : tab === 3 ? ['spl-' + from, 'spl-' + to]
        : ['e1155-1-' + from, 'e1155-1-' + to].concat(batch ? ['e1155-7-' + from, 'e1155-7-' + to] : []);
      paint(); var e = evText(r.ev); o(root, 'ev').textContent = e;
      tone(say, false); api.say(say, api.t(K + 'event') + ' : ' + e);
    };
    live(root);
    api.radios($('[data-f="tab"]', root), function (v) { tab = v; marks = []; o(root, 'ev').textContent = '—'; paint(); api.say(say, ''); });
    api.radios($('[data-f="from"]', root), function (v) { from = v; });
    api.radios($('[data-f="to"]', root), function (v) { to = v; });
    api.radios($('[data-f="id"]', root), function (v) { id = v; });
    api.radios($('[data-f="dec"]', root), function (v) { dec = v; paint(); tone(say, false); api.say(say, tf(api.t(K + 'dec.say'), { d: [18, 6, 0][v] })); });
    btn(root, 'send').addEventListener('click', function () { send(false); });
    btn(root, 'batch').addEventListener('click', function () { send(true); });
    btn(root, 'uri').addEventListener('click', function () { s.uri = !s.uri; marks = ['uri']; paint(); tone(say, false); api.say(say, api.t(K + 'uri.cap')); });
    api.onLang(function () { paint(); });
    paint();
  };

  /* 4.3 · supply, panel A: three ways an amount of units can change, drawn as the units in existence over time; no value
     anywhere. The cap: Bitcoin's own schedule, height by height; the two others are labelled examples. */
  LABS.supply = function (root, api) {
    var K = 'web3c.mods.3.items.2.lab.supply.', say = o(root, 'say'), m = 0, hR = $('[data-f="height"]', root), iR = $('[data-f="issue"]', root), uR = $('[data-f="use"]', root);
    var XR = [0, 6930000], YR = [0, 2.2e15], CAP = 2.1e15, PTS = kit2.btc.pts(), START = 2000, T = 20;
    var tl = function (k) { return api.t(K + k); };
    var paint = function () {
      root.setAttribute('data-model', String(m));
      var sum = '';
      if (m === 0) {
        var h = Number(hR.value), sup = kit2.btc.supply(h), x = kit2.path([[h, 0]], XR, YR, 'line').split(' ')[0].slice(1);
        setD(root, 'line', kit2.path(PTS, XR, YR, 'line'));
        setD(root, 'guide', 'M4 ' + kit2.Y(CAP, YR) + 'H316'); setD(root, 'mark', 'M' + x + ' 4V176');
        setTpl(o(root, 'h'), { h: grpS(h) }); setTpl(o(root, 'sub'), { s: unitsS(kit2.btc.sub(h), 8) });
        hR.setAttribute('aria-valuetext', grpS(h));
        sum = tf(tl('sum0'), { u: unitsS(sup, 8) });
      } else {
        var n = Number(iR.value), u = m === 2 ? Number(uR.value) : 0, f = kit2.flow(n, u, START, T), YF = [0, 4000];
        setD(root, 'line', kit2.path(f.pts, [0, T], YF, 'line'));
        setD(root, 'guide', m === 2 ? kit2.path(kit2.flow(n, 0, START, T).pts, [0, T], YF, 'line') : '');
        setD(root, 'mark', '');
        setTpl(o(root, 'issue'), { n: n }); iR.setAttribute('aria-valuetext', String(n));
        setTpl(o(root, 'use'), { n: u }); uR.setAttribute('aria-valuetext', u + ' %');
        setTpl(o(root, 'net'), { s: (f.net > 0 ? '+' : '') + nS(f.net) });
        sum = tf(tl('after'), { u: nS(START + f.net * T), s: grpS(START) });
      }
      fillTpl(root);
      o(root, 'sum').textContent = sum;
      return sum;
    };
    live(root);
    api.radios($('[data-f="model"]', root), function (v) { m = v; tone(say, false); api.say(say, tl('k.' + v) + ' · ' + paint()); });
    [hR, iR, uR].forEach(function (r) { r.addEventListener('input', function () { paint(); api.say(say, ''); }); });
    api.onLang(paint);
    paint();
  };

  /* 5.1 · evm: five instructions run one press at a time; the stack grows and shrinks, gas adds up from the table
     (PUSH1 3, ADD 3, MUL 5). Memory holds a value during the run and is wiped at the end of the transaction; storage
     keeps the result. The same three numbers give the same result on every node. */
  LABS.evm = function (root, api) {
    var K = 'web3c.mods.4.items.0.lab.evm.', say = o(root, 'say'), ins = ['a', 'b', 'c'].map(function (f) { return $('[data-f="' + f + '"]', root); });
    var run = kit2.evm(2, 3, 4), at = 0, wiped = false, N = 5;
    var prev = btn(root, 'prev'), next = btn(root, 'next'), rs = btn(root, 'restart');
    var paint = function () {
      root.setAttribute('data-at', String(at));
      $$('[data-op]', root).forEach(function (li, i) { li.textContent = run[i].op; li.classList.toggle('is-on', i === at - 1); li.classList.toggle('is-done', i < at - 1); });
      var st = at ? run[at - 1].stack : [], ol = o(root, 'stack'); ol.textContent = '';
      st.slice().reverse().forEach(function (v, i) { var li = document.createElement('li'); li.textContent = String(v); if (!i) li.className = 'is-top'; ol.appendChild(li); });
      setTpl(o(root, 'gas'), { g: at ? run[at - 1].gas : 0 });
      o(root, 'mem').textContent = at >= 3 && !wiped ? String(run[2].stack[0]) : '—';
      o(root, 'store').textContent = at === N ? String(run[N - 1].stack[0]) : '—';
      prev.disabled = at === 0; next.disabled = at === N; btn(root, 'endTx').disabled = at < 3 || wiped;
      fillTpl(root);
    };
    var speak = function () { tone(say, false); api.say(say, at ? tf(api.t('web3c.x.step'), { i: at, n: N, s: run[at - 1].op }) + (at === N ? ' · ' + tf(api.t(K + 'done'), { r: run[N - 1].stack[0], g: run[N - 1].gas }) : '') : ''); };
    live(root);
    next.addEventListener('click', function () { if (at < N) at++; paint(); keepFocus(next, rs); speak(); });
    prev.addEventListener('click', function () { if (at > 0) at--; if (at < 3) wiped = false; paint(); keepFocus(prev, next); speak(); });
    rs.addEventListener('click', function () { at = 0; wiped = false; paint(); api.say(say, ''); });
    btn(root, 'again').addEventListener('click', function () {
      var v = ins.map(function (x) { var n = Math.floor(Number(x.value)); n = isFinite(n) ? Math.max(0, Math.min(99, n)) : 0; x.value = String(n); return n; });
      run = kit2.evm(v[0], v[1], v[2]); at = 0; wiped = false; paint(); api.say(say, '');
    });
    btn(root, 'endTx').addEventListener('click', function () { wiped = true; paint(); keepFocus(btn(root, 'endTx'), next.disabled ? rs : next); tone(say, false); api.say(say, api.t(K + 'memSay')); });
    api.onLang(paint);
    paint();
  };

  /* 5.2 · vyper: eight things Vyper leaves out on purpose; a press gives the reason its documentation gives */
  LABS.vyper = function (root, api) {
    var K = 'web3c.mods.4.items.1.lab.vy.', say = o(root, 'say'), bs = $$('[data-act="vy"]', root);
    live(root);
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = Number(b.getAttribute('data-v'));
        bs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        api.say(say, api.t(K + 'k.' + v) + ' · ' + api.t(K + (v === 5 || v === 6 ? 'gas' : 'read')));
      });
    });
  };

  /* 5.3 · pipeline: five stations from the draft to the real network, the stake at each; a mock local chain at the third;
     the way to the main network waits for the tests and a second reader (our advised order) */
  LABS.pipeline = function (root, api) {
    var K = 'web3c.mods.4.items.2.lab.', say = o(root, 'say'), st = 0, blocks = 0, ts = $('[data-f="tests"]', root), rv = $('[data-f="review"]', root);
    var tl = function (k) { return api.t(K + k); };
    var paint = function () {
      root.setAttribute('data-st', String(st));
      o(root, 'what').textContent = tl('what.' + st);
      var sk = o(root, 'stake'); sk.textContent = tl('stake.' + st); sk.setAttribute('data-k', st < 2 ? '0' : st < 4 ? '1' : '2');
      o(root, 'local').hidden = st !== 2;
      setTpl(o(root, 'blocks'), { n: blocks }); fillTpl(root);
    };
    live(root);
    var pick = api.radios($('[data-f="st"]', root), function (v) { st = v; paint(); tone(say, false); api.say(say, tl('st.' + v) + ' · ' + tl('stake.' + v)); });
    btn(root, 'send').addEventListener('click', function () { blocks++; paint(); tone(say, false); api.say(say, o(root, 'blocks').textContent); });
    btn(root, 'lreset').addEventListener('click', function () { blocks = 0; paint(); tone(say, false); api.say(say, o(root, 'blocks').textContent); });
    [ts, rv].forEach(function (c) { c.disabled = false; });
    btn(root, 'go').addEventListener('click', function () {
      if (!(ts.checked && rv.checked)) { tone(say, true); api.say(say, tl('gate.wait')); return; }
      pick(4); tone(say, false); api.say(say, tl('gate.ok'));
    });
    api.onLang(paint);
    paint();
  };

  /* 5.4 · fee: EIP-1559's receipt from four numbers (gas, base fee, tip, maximum), in gwei and ETH, never a currency */
  LABS.fee = function (root, api) {
    var K = 'web3c.mods.4.items.3.lab.fee.', say = o(root, 'say'), F = function (n) { return $('[data-f="' + n + '"]', root); };
    var work = function () {
      var g = Number(F('gas').value), b = kit2.toWei(F('base').value), t = kit2.toWei(F('tip').value), m = kit2.toWei(F('max').value);
      var ok = isFinite(g) && g >= 0 && Math.floor(g) === g && b !== null && t !== null && m !== null;
      var r = ok ? kit2.fee(g, b, t, m) : null;
      root.setAttribute('data-under', r && r.under ? '1' : '0');
      o(root, 'rc').hidden = !r || r.under; o(root, 'under').hidden = !(r && r.under);
      if (!r || r.under) return r;
      setTpl(o(root, 'paidTip'), { t: unitsS(r.paidTip, 9) });
      setTpl(o(root, 'total'), { g: unitsS(r.total, 9), e: unitsS(r.total, 18) });
      setTpl(o(root, 'burnt'), { b: unitsS(r.burnt, 9) }); setTpl(o(root, 'val'), { v: unitsS(r.val, 9) }); setTpl(o(root, 'back'), { r: unitsS(r.back, 9) });
      fillTpl(root); return r;
    };
    live(root);
    ['gas', 'base', 'tip', 'max'].forEach(function (n) { F(n).addEventListener('input', function () { var r = work(); if (r && r.under) { tone(say, true); api.say(say, api.t(K + 'under')); } else api.say(say, ''); }); });
    $$('[data-act="preset"]', root).forEach(function (b) { b.addEventListener('click', function () { F('gas').value = b.getAttribute('data-v'); work(); tone(say, false); api.say(say, o(root, 'total').textContent); }); });
    btn(root, 'ex').addEventListener('click', function () { F('gas').value = '21000'; F('base').value = '10'; F('tip').value = '2'; F('max').value = '12'; work(); tone(say, false); api.say(say, api.t(K + 'exSay')); });
    api.onLang(work);
    work();
  };

  /* 6.1 · dapp: reading goes site → public client → node, and no wallet is asked; writing goes site → wallet client →
     wallet, which asks the visitor (refused: error 4001). The phone's four steps, one press at a time. */
  LABS.dapp = function (root, api) {
    var K = 'web3c.mods.5.items.0.lab.', say = o(root, 'say'), ADDR = ['0x3f9a…b21c', '0x8d04…e7a5'], ai = 0, at = 1, N = 4;
    var REQ = '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}', RES = '{"jsonrpc":"2.0","id":1,"result":"0x4b7"}';
    var tl = function (k) { return api.t(K + k); }, ask = o(root, 'ask'), code = o(root, 'code'), go = o(root, 'go'), sendB = btn(root, 'send');
    var mob = $('.st-dapp__mob', root), mp = btn(root, 'mprev'), mn = btn(root, 'mnext'), mr = btn(root, 'mrestart');
    var paintAddr = function () { setTpl(o(root, 'addr'), { a: ADDR[ai] }); fillTpl(root); };
    var paintMob = function () {
      mob.setAttribute('data-at', String(at));
      $$('[data-step]', mob).forEach(function (li, i) { li.classList.toggle('is-on', i + 1 === at); li.classList.toggle('is-done', i + 1 < at); });
      mp.disabled = at <= 1; mn.disabled = at >= N;
    };
    var close = function () { ask.hidden = true; };
    live(root);
    btn(root, 'read').addEventListener('click', function () {
      close(); go.hidden = true; root.setAttribute('data-path', 'read');
      o(root, 'req').textContent = REQ; code.textContent = RES; code.classList.remove('is-no');
      tone(say, false); api.say(say, tl('readSay'));
    });
    sendB.addEventListener('click', function () {
      go.hidden = true; root.setAttribute('data-path', 'write'); o(root, 'req').textContent = '—'; code.textContent = '…'; code.classList.remove('is-no');
      ask.hidden = false; api.say(say, ''); o(root, 'askT').focus();
    });
    btn(root, 'reject').addEventListener('click', function () {
      close(); code.textContent = '{ code: 4001, message: "User Rejected Request" }'; code.classList.add('is-no');
      sendB.focus(); tone(say, true); api.say(say, tl('rejected'));
    });
    btn(root, 'accept').addEventListener('click', function () {
      close(); code.textContent = '{"jsonrpc":"2.0","id":2,"result":"0x5c1e…a904"}'; go.hidden = false;
      sendB.focus(); tone(say, false); api.say(say, tl('accepted'));
    });
    ask.addEventListener('keydown', function (e) { if (e.key === 'Escape') btn(root, 'reject').click(); });
    btn(root, 'acct').addEventListener('click', function () { ai ^= 1; paintAddr(); tone(say, false); api.say(say, tl('acctSay') + ' ' + o(root, 'addr').textContent); });
    var stepSay = function () { tone(say, false); api.say(say, tf(api.t('web3c.x.step'), { i: at, n: N, s: tl('mobile.steps.' + (at - 1)) })); };
    mn.addEventListener('click', function () { if (at < N) at++; paintMob(); keepFocus(mn, mr); stepSay(); });
    mp.addEventListener('click', function () { if (at > 1) at--; paintMob(); keepFocus(mp, mn); stepSay(); });
    mr.addEventListener('click', function () { at = 1; paintMob(); stepSay(); });
    api.onLang(paintAddr);
    paintAddr(); paintMob();
  };

  /* 6.2 · rpc: ask a node (ethereum.org's two examples, decoded), which block a tag names, what a full node has kept
     compared with an archive node, and who sees the question (one's own node, or a provider that can go down) */
  LABS.rpc = function (root, api) {
    var K = 'web3c.mods.5.items.1.lab.', say = o(root, 'say'), m = 0, arch = 0, who = 0, down = false, back = $('[data-f="back"]', root), downB = btn(root, 'down');
    var tl = function (k) { return api.t(K + k); };
    // the buyer path's own line for a node that does not answer, as the page wrote it (by key, in the page's language)
    var downT = function () { return o(root, 'downL').textContent.trim(); };
    var paintM = function () { o(root, 'req').textContent = kit2.RPC[m].req; o(root, 'res').textContent = down && who === 1 ? '—' : kit2.RPC[m].res; o(root, 'dec').textContent = ''; };
    var archRes = function () {
      var n = Number(back.value), lab = n === 0 ? tl('arch.now') : n === 1000 ? tl('arch.gen') : tf(tl('arch.back'), { n: grpS(n) });
      o(root, 'backL').textContent = tf(tl('arch.back'), { n: grpS(n) }); back.setAttribute('aria-valuetext', lab);
      var fail = arch === 0 && n > 128, r = o(root, 'arch'); r.textContent = tl(fail ? 'arch.fail' : 'arch.ok'); r.classList.toggle('is-no', fail);
      o(root, 'disk').textContent = tl('arch.disk.' + arch); root.setAttribute('data-arch', String(arch));
      return fail;
    };
    var paintWho = function () {
      root.setAttribute('data-who', String(who)); root.setAttribute('data-down', down && who === 1 ? '1' : '0');
      o(root, 'whoT').textContent = tl(who ? 'who.prov' : 'who.mine');
      downB.disabled = who !== 1; downB.setAttribute('aria-pressed', String(down));
      o(root, 'downL').hidden = !(down && who === 1);
      paintM();
    };
    live(root);
    api.radios($('[data-f="method"]', root), function (v) { m = v; paintM(); api.say(say, ''); });
    btn(root, 'decode').addEventListener('click', function () {
      if (down && who === 1) { tone(say, true); api.say(say, downT()); return; }
      var t = tl(m ? 'dec.bal' : 'dec.block'); o(root, 'dec').textContent = t; tone(say, false); api.say(say, t);
    });
    var tag = 0, tagV = function () { o(root, 'tagv').textContent = tl('tags.v.' + tag); };
    api.radios($('[data-f="tag"]', root), function (v) {
      var at = [9, 7, 2][v]; tag = v;
      $$('[data-blk]', root).forEach(function (b, i) { b.classList.toggle('is-tag', i === at); b.classList.toggle('is-past', i < at); });
      o(root, 'tagv').textContent = tl('tags.v.' + v); tone(say, false); api.say(say, tl('tags.k.' + v) + ' · ' + tl('tags.v.' + v));
    });
    api.radios($('[data-f="arch"]', root), function (v) { arch = v; var f = archRes(); tone(say, f); api.say(say, o(root, 'arch').textContent); });
    back.addEventListener('input', archRes);
    back.addEventListener('change', function () { var f = archRes(); tone(say, f); api.say(say, o(root, 'arch').textContent); });
    api.radios($('[data-f="who"]', root), function (v) { who = v; if (!v) down = false; paintWho(); keepFocus(downB, null); tone(say, false); api.say(say, o(root, 'whoT').textContent); });
    downB.addEventListener('click', function () { down = !down; paintWho(); tone(say, down); api.say(say, down ? downT() : o(root, 'whoT').textContent); });
    api.onLang(function () { archRes(); paintWho(); tagV(); });
    archRes(); paintWho(); tagV();
  };

  /* 6.3 · ipfs: a file found by its fingerprint, kept only by the nodes that pin it; a clean-up drops every copy nobody
     pinned, and the token whose image pointed at it then shows an empty frame */
  LABS.ipfs = function (root, api) {
    var K = 'web3c.mods.5.items.2.lab.', say = o(root, 'say'), has = [false, false, false], pin = [false, false, false], fetched = false, NM = ['A', 'B', 'C'];
    var tl = function (k) { return api.t(K + k); }, pins = $$('[data-act="pin"]', root);
    var paint = function () {
      $$('[data-node]', root).forEach(function (li, i) { li.classList.toggle('has-file', has[i]); li.classList.toggle('is-pinned', has[i] && pin[i]); });
      pins.forEach(function (b, i) { b.setAttribute('aria-pressed', String(pin[i])); b.disabled = !has[i]; });
      var any = has.some(Boolean); root.setAttribute('data-any', any ? '1' : '0'); o(root, 'broken').hidden = any; o(root, 'pic').hidden = !any;
    };
    live(root);
    btn(root, 'add').addEventListener('click', function () { has[0] = true; paint(); tone(say, false); api.say(say, tl('keep.added')); });
    btn(root, 'get').addEventListener('click', function () {
      var at = has.indexOf(true);
      if (at < 0) { tone(say, true); api.say(say, tl('keep.lost')); return; }
      if (!fetched) { fetched = true; has = [true, true, true]; }
      paint(); tone(say, false); api.say(say, tf(tl('keep.found'), { n: NM[at] }));
    });
    pins.forEach(function (b, i) { b.addEventListener('click', function () { if (!has[i]) return; pin[i] = !pin[i]; paint(); api.say(say, ''); }); });
    btn(root, 'gc').addEventListener('click', function () {
      has = has.map(function (h, i) { return h && pin[i]; }); pin = pin.map(function (p, i) { return p && has[i]; });
      paint(); pins.forEach(function (b) { keepFocus(b, btn(root, 'get')); });
      var gone = !has.some(Boolean); tone(say, gone); api.say(say, tl('keep.gcSay') + (gone ? ' ' + tl('nft.broken') : ''));
    });
    paint();
  };

  /* 6.4 · oracle: a temperature from outside, carried onto the chain by one or seven operators (the median kept);
     the chain's copy moves when it is off by more than the threshold or when the heartbeat has passed; the contract
     refuses a value too old or too uncertain. Every change answers a press; nothing runs on a timer. */
  LABS.oracle = function (root, api) {
    var K = 'web3c.mods.5.items.3.lab.orc.', say = o(root, 'say'), s = kit2.oracle.init(), op = { ops: 7, liar: false, dev: 2, hb: 30, age: 60, conf: 5 };
    var tl = function (k) { return api.t(K + k); }, R = function (n) { return $('[data-f="' + n + '"]', root); }, liarB = btn(root, 'liar');
    var t1 = function (v) { return decS.apply(null, (Math.round(v * 10) / 10).toFixed(1).split('.')); };
    var paintR = function () {
      op.dev = Number(R('dev').value); op.hb = Number(R('hb').value); op.age = Number(R('age').value); op.conf = Number(R('conf').value);
      setTpl(o(root, 'devL'), { p: nS(op.dev) }); setTpl(o(root, 'hbL'), { m: op.hb }); setTpl(o(root, 'ageL'), { m: op.age }); setTpl(o(root, 'confL'), { p: nS(op.conf) });
      fillTpl(root);
      ['dev', 'hb', 'age', 'conf'].forEach(function (n) { R(n).setAttribute('aria-valuetext', o(root, n + 'L').textContent); });
    };
    var paint = function () {
      root.setAttribute('data-ops', String(op.ops)); root.setAttribute('data-liar', op.liar ? '1' : '0');
      liarB.setAttribute('aria-pressed', String(op.liar));
      setTpl(o(root, 'out'), { v: t1(s.out) }); setTpl(o(root, 'on'), { v: t1(s.on) });
      var h = s.hist, ys = []; h.forEach(function (p) { ys.push(p.out, p.on, p.agg - p.spread, p.agg + p.spread); });
      var yr = [Math.floor(Math.min.apply(null, ys)) - 1, Math.ceil(Math.max.apply(null, ys)) + 1], xr = [0, 11], off = 12 - h.length;
      var P = function (k) { return h.map(function (p, i) { return [i + off, p[k]]; }); };
      setD(root, 'outP', kit2.path(P('out'), xr, yr, 'line'));
      setD(root, 'onP', kit2.path(P('on'), xr, yr, 'step'));
      var up = h.map(function (p, i) { return [i + off, p.agg + p.spread]; }), lo = h.map(function (p, i) { return [i + off, p.agg - p.spread]; }).reverse();
      setD(root, 'band', kit2.path(up.concat(lo), xr, yr, 'line') + 'Z');
      o(root, 'ymax').textContent = yr[1] + ' °C'; o(root, 'ymin').textContent = yr[0] + ' °C';
      o(root, 'why').textContent = s.why < 0 ? '' : tl('why.' + s.why);
      var c = kit2.oracle.check(s, op); o(root, 'stale').hidden = !c.stale; o(root, 'wide').hidden = !c.wide;
      fillTpl(root);
      o(root, 'sum').textContent = o(root, 'out').textContent + ' · ' + o(root, 'on').textContent;
      return c;
    };
    live(root);
    api.radios($('[data-f="ops"]', root), function (v) { op.ops = v ? 1 : 7; paint(); api.say(say, ''); });
    ['dev', 'hb', 'age', 'conf'].forEach(function (n) { R(n).addEventListener('input', function () { paintR(); paint(); }); });
    btn(root, 'tick').addEventListener('click', function () {
      s = kit2.oracle.tick(s, op); var c = paint();
      var m = o(root, 'on').textContent + ' · ' + tl('why.' + s.why) + (c.stale ? ' · ' + tl('stale') : '') + (c.wide ? ' · ' + tl('wide') : '');
      tone(say, c.stale || c.wide); api.say(say, m);
    });
    liarB.addEventListener('click', function () { op.liar = !op.liar; paint(); tone(say, false); api.say(say, tl('liar') + ' · ' + api.t(op.liar ? 'web3c.x.on' : 'web3c.x.off')); });
    btn(root, 'reset').addEventListener('click', function () { s = kit2.oracle.init(); op.liar = false; paint(); tone(say, false); api.say(say, ''); });
    api.onLang(function () { paintR(); paint(); });
    paintR(); paint();
  };
  /* /W3X-M456 */
  /* W3X-M789 */
  /* ================ modules 7, 8 and 9: the phase-1 labs (SPEC §5) ================
     The maths first, in one object with no page in it (kit3): enh/test-m789.mjs runs it outside a browser against the
     spec's checked values and independent computations (x · y = k with and without the 0,3 % fee, Aave's health factor,
     the quadratic cost n², the sandwich of 9.1, the bridge's invariant), and enh/w3x-labs-m789.mjs bakes the still states
     from it, so the page without script shows the same numbers. Every amount is "unités" or the invented tokens A and B. */
  var kit3 = (function () {
    var copy = function (o) { return JSON.parse(JSON.stringify(o)); };
    var r2 = function (v) { return Math.round(v * 100) / 100; };
    // 7.1 · a constant-product pool (Uniswap's x · y = k): what one trade of dx returns, with the fee taken on the way in
    // (0,3 %: 997/1000 of dx counts) or none (fee 0, 9.1's sandwich); the price impact is the fee-free one, 1 − x / (x + dx)
    var amm = {
      X: 100, Y: 10000,
      out: function (x, y, dx, fee) { var d = dx * (1 - (fee == null ? 0.003 : fee)); return y * d / (x + d); },
      impact: function (x, dx) { return dx > 0 ? 1 - x / (x + dx) : 0; },
      // your trade of dx shown at the pool's state, then someone else's trade of `pre` A filled first: your trade passes
      // only if what you get is at least (1 − tol) of what you were shown
      front: function (dx, tol, pre) {
        var shown = amm.out(amm.X, amm.Y, dx), o1 = amm.out(amm.X, amm.Y, pre), x1 = amm.X + pre, y1 = amm.Y - o1;
        var got = amm.out(x1, y1, dx), ok = got >= (1 - tol / 100) * shown - 1e-9;
        return { shown: shown, got: got, ok: ok, pre: o1, pool: ok ? [x1 + dx, y1 - got] : [x1, y1] };
      },
      // the curve's corners, x from 40 to 200
      pts: function () { var p = []; for (var x = 40; x <= 200; x += 4) p.push([x, amm.X * amm.Y / x]); return p; },
      // an order book: the sale of q A walks down the bids [quantity, price]; [what was filled, B received, levels used]
      book: function (bids, q) { var left = q, got = 0, used = 0; bids.forEach(function (b) { if (left <= 0) return; var f = Math.min(left, b[0]); got += f * b[1]; left -= f; used++; }); return { filled: q - left, got: got, used: used }; },
      // impermanent loss: a pool of two halves at a price change of r, against keeping the tokens: 2√r / (1 + r) − 1
      gap: function (r) { return 2 * Math.sqrt(r) / (1 + r) - 1; }
    };
    // 7.2 · Aave's health factor: collateral × liquidation threshold / debt (∞ with no debt), the collateral's value moved
    var hf = function (coll, thr, debt, move) { return debt > 0 ? coll * (1 + move / 100) * thr / debt : Infinity; };
    // 7.2 (static) · a two-slope rate curve with demo parameters (base 0, slope 1 = 4, slope 2 = 60, optimum 80): its shape only
    var rate = function (u) { return u <= 80 ? 4 * u / 80 : 4 + 60 * (u - 80) / 20; };
    // 7.3 · three stablecoin designs, a press at a time. Card 0: a reserve that pays 10 a press (100, or 70 when it is
    // incomplete). Card 1: collateral of 200 for 100 tokens, down p %. Card 2: the algorithm mints sister tokens to defend
    // the peg; each step their value halves, so it must mint twice as many (100, 200, 400…); the peg breaks at step 4
    var stable = {
      init: function (gap) { return { res: gap ? 70 : 100, tok: 100, paid: 0, gap: !!gap }; },
      run: function (s) { if (s.res <= 0 || s.tok <= 0) return { s: s, end: true }; var n = copy(s), q = Math.min(10, n.res, n.tok); n.res -= q; n.tok -= q; n.paid += q; return { s: n, end: n.res <= 0 || n.tok <= 0 }; },
      vault: function (p) { var c = 200 * (1 - p / 100); return { c: r2(c), state: c < 100 ? 'under' : p >= 40 ? 'warn' : 'ok' }; },
      algo: function (k) { var minted = 0; for (var i = 0; i < k; i++) minted += 100 * Math.pow(2, i); return { minted: minted, value: Math.pow(0.5, k), peg: k < 4 }; }
    };
    // 7.4 · the stack of dependencies: layer i adds its own lines; the count after each layer (1, 4, 8, 11, 14)
    var stack = function (deps, n) { var c = 0; for (var i = 0; i < n; i++) c += deps[i].length; return c; };
    // 7.4 (static) · a perpetual contract's funding: who pays whom for a gap (contract price over the reference, %)
    var perp = function (gap) { return gap > 0 ? 'up' : gap < 0 ? 'down' : 'flat'; };
    // 8.1 · the vote and its execution. Six members (weights 30, 25, 20, 10, 10, 5, an example); a choice per member
    // (−1 none, 0 for, 1 against, 2 abstain); a multisig of 5 whose threshold must be 1–5 (Safe's rule: never 0, never
    // above the number of owners); a timelock in the on-chain mode
    var dao = {
      W: [30, 25, 20, 10, 10, 5],
      tally: function (ch) { var t = [0, 0, 0]; ch.forEach(function (c, i) { if (c >= 0) t[c] += dao.W[i]; }); return t; },
      passed: function (ch) { var t = dao.tally(ch); return t[0] > t[1]; },
      thr: function (t, d) { var n = t + d; return n < 1 ? { t: t, err: 'zero' } : n > 5 ? { t: t, err: 'tooHigh' } : { t: n }; },
      // the stations a mode walks: off-chain skips the wait (the signers execute), on-chain waits for the timelock
      stations: function (mode) { return mode === 0 ? [0, 1, 2, 4] : [0, 1, 2, 3, 4]; }
    };
    // 8.2 · one community, four rules. Balances 1 000, 100, 50, 20, 10 (an example); a preference each (0 for, 1 against);
    // a strength 1–5. Token-weighted: votes = balance. Delegation: member 5 counts 0 until it delegates to itself; a
    // member who delegates hands its balance to a delegate who votes for. Quadratic: 100 credits each, v = strength × 2
    // votes cost v² credits; split: member 1 as ten accounts of 100 credits, each voting 10. Soulbound: one badge, one vote
    var votes = {
      BAL: [1000, 100, 50, 20, 10],
      init: function () { return { pref: [1, 0, 0, 0, 0], care: [2, 5, 4, 4, 5], deleg: [false, false, false, false, false], self5: false, split: false }; },
      sum: function (v, s) { var f = 0, c = 0; v.forEach(function (x, i) { if (s.pref[i] === 0) f += x; else c += x; }); return [f, c]; },
      token: function (s) { return votes.sum(votes.BAL, s); },
      big: function () { return votes.BAL[0] / votes.BAL.reduce(function (a, b) { return a + b; }, 0); },
      deleg: function (s) {
        var f = 0, c = 0;
        votes.BAL.forEach(function (b, i) {
          if (s.deleg[i]) { f += b; return; }
          var w = i === 4 && !s.self5 ? 0 : b;
          if (s.pref[i] === 0) f += w; else c += w;
        });
        return [f, c];
      },
      qv: function (care) { var v = care * 2; return { v: v, cost: v * v }; },
      quad: function (s) {
        var f = 0, c = 0;
        s.care.forEach(function (k, i) { var v = i === 0 && s.split ? 100 : votes.qv(k).v; if (s.pref[i] === 0) f += v; else c += v; });
        return [f, c];
      },
      sbt: function (s) { return votes.sum([1, 1, 1, 1, 1], s); },
      all: function (s) { return [votes.token(s), votes.deleg(s), votes.quad(s), votes.sbt(s)]; },
      pass: function (r) { return r[0] > r[1]; }
    };
    // 8.3 (static) · linear vesting over 48 months (OpenZeppelin's curve, no cliff): the share released at month m
    var vest = function (m) { return Math.min(1, Math.max(0, m / 48)); };
    // 9.1 · five known traps, as small machines
    var traps = {
      // reentrancy: a vault of 10 where your share is 1. Paying first: each payment calls you back before the share is
      // zeroed, so you take 1 again until the vault is empty (ten payments). Zeroing first: the second call finds 0
      re: function (fixed) {
        var v = 10, s = 1, out = [];
        if (fixed) { s = 0; v -= 1; out.push({ v: v, s: s, paid: 1, line: 0, back: true, zero: true }); out.push({ v: v, s: s, paid: 0, line: -1, stop: true }); return out; }
        while (v > 0) { v -= 1; out.push({ v: v, s: v > 0 ? s : 0, paid: 1, line: 0, back: v > 0 }); }
        return out;
      },
      // an 8-bit counter: before 0.8.0 (or unchecked) it wraps modulo 256; since 0.8.0 it reverts
      of: function (n, d, checked) { var m = n + d; if (m >= 0 && m <= 255) return { n: m }; return checked ? { n: n, revert: true } : { n: (m + 256) % 256, wrap: true }; },
      // the sandwich on 100 A / 10 000 B with no fee: the bot buys with 5 A before you, you trade 10 A, the bot sells
      // what it bought; with a 0,5 % tolerance your trade is refused and the bot sells back into the untouched pool
      sw: function (tol) {
        var o = function (x, y, d) { return y * d / (x + d); };
        var alone = o(100, 10000, 10), b1 = o(100, 10000, 5), x = 105, y = 10000 - b1;
        var mine = o(x, y, 10), ok = tol == null || mine >= (1 - tol / 100) * alone;
        if (ok) { x += 10; y -= mine; } else mine = 0;
        var back = o(y, x, b1);
        return { alone: alone, bot: b1, mine: mine, ok: ok, back: back };
      },
      // the manipulated oracle: a price read from one pool triples for one transaction (100 → 300); the borrowing limit
      // is 80 × the price; a price averaged over 30 blocks (one pushed) barely moves (an example rule)
      or: function (safe) { var p = safe ? (29 * 100 + 300) / 30 : 300; return { p0: 100, l0: 8000, p: r2(p), l: Math.round(80 * p) }; },
      // access control: three functions; with roles and a 3-of-5 multisig, one stolen key opens nothing
      ac: function (msig, act) {
        var tags = msig ? ['locked', 'locked', 'locked'] : ['locked', 'locked', 'open'];
        if (act === 'steal' && !msig) tags = ['open', 'open', 'open'];
        return { tags: tags, r: act === 'anyone' ? (msig ? 'refused' : 'minted') : act === 'steal' ? (msig ? 'none' : 'all') : '' };
      }
    };
    // 9.2 · the net of five layers: which layer catches each of the twelve bugs (an example split); a bug falls through
    // to the bin when its layer is off; two bugs no layer catches
    var sieve = {
      MAP: [0, 0, 1, 1, 1, 2, 2, 3, 4, 4, -1, -1],
      go: function (on) { var at = sieve.MAP.map(function (l) { return l >= 0 && on[l] ? l : -1; }); var a = at.filter(function (l) { return l >= 0; }).length; return { at: at, caught: a, passed: at.length - a }; }
    };
    // 9.2 (static) · a toy fuzzer: 256 draws in 0–1 000 000 from a seeded generator (xorshift32), the boundaries 0, 1 and
    // 1 000 000 forced into three of the positions; the hidden bug fails at amount = 0; the first failure is reported
    var fuzz = function (seed) {
      var x = seed >>> 0 || 1, r = function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x; };
      var v = []; for (var i = 0; i < 256; i++) v.push(1 + r() % 1000000);
      var pos = []; while (pos.length < 3) { var q = r() % 256; if (pos.indexOf(q) < 0) pos.push(q); }
      v[pos[0]] = 0; v[pos[1]] = 1; v[pos[2]] = 1000000;
      for (var k = 0; k < 256; k++) if (v[k] === 0) return { i: k + 1, v: 0, runs: v };
      return { i: 0, runs: v };
    };
    // 9.3 · a lock-then-mint bridge. The vault on A and the represented tokens on B start equal (30, an example); a
    // crossing moves 10 both sides; a forged message mints 50 on B with nothing locked, then the attacker brings them back
    // and empties the vault; a bug in the bridge's contract empties the vault in any mode
    var bridge = {
      init: function () { return { a: 30, b: 30, broken: false }; },
      go: function (s) { if (s.broken) return s; var n = copy(s); n.a += 10; n.b += 10; return n; },
      back: function (s) { if (s.broken || s.b < 10 || s.a < 10) return s; var n = copy(s); n.a -= 10; n.b -= 10; return n; },
      fake: function (s) { if (s.broken) return s; var n = copy(s), took = Math.min(50, n.a); n.b += 50 - took; n.a -= took; n.broken = true; return n; },
      bug: function (s) { var n = copy(s); n.a = 0; n.broken = true; return n; },
      // does a forged message pass? mode 0: stolen ≥ threshold of 9; mode 1: both required verifiers stolen (the range
      // takes the four optional first, then the two required); mode 2: no outside keys
      pass: function (mode, stolen, thr) { if (mode === 0) return stolen >= thr; if (mode === 1) return stolen >= 6; return false; },
      req: function (stolen) { return Math.max(0, stolen - 4); }
    };
    // a plot's path in a 320 × 180 box, as kit2 draws it
    var X = function (x, xr) { return Math.round((4 + (x - xr[0]) / (xr[1] - xr[0]) * 312) * 10) / 10; };
    var Y = function (y, yr) { return Math.round((176 - (y - yr[0]) / (yr[1] - yr[0]) * 172) * 10) / 10; };
    var path = function (pts, xr, yr) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + X(p[0], xr) + ' ' + Y(p[1], yr); }).join(''); };
    return { amm: amm, hf: hf, rate: rate, stable: stable, stack: stack, perp: perp, dao: dao, votes: votes, vest: vest, traps: traps, sieve: sieve, fuzz: fuzz, bridge: bridge, X: X, Y: Y, path: path, r2: r2 };
  })();

  /* ---- what the labs of modules 7–9 share: two decimals, a signed whole number, a press-driven step machine ---- */
  var f2 = function (v) { var s = (Math.round(v * 100) / 100).toFixed(2).split('.'); return decS(s[0], s[1]); };
  var sgn = function (v) { return v > 0 ? '+' + grpS(v) : grpS(v); };
  var pct = function (v) { return f2(v * 100); };
  var setVar = function (el, n, v) { if (el) el.style.setProperty(n, String(v)); };
  var stepSayT = function (api, i, n, s) { return tf(api.t('web3c.x.step'), { i: i, n: n, s: s }); };
  // prev / next / restart on one machine: at 0 is the start (nothing done), at n the end; fn(at) paints
  var stepper = function (root, pre, n, fn) {
    var at = 0, P = btn(root, pre + 'prev'), N = btn(root, pre + 'next'), R = btn(root, pre + 'restart');
    var paint = function (said) { P.disabled = at <= 0; N.disabled = at >= n(); fn(at, said); };
    N.addEventListener('click', function () { if (at < n()) at++; paint(true); keepFocus(N, R); });
    P.addEventListener('click', function () { if (at > 0) at--; paint(true); keepFocus(P, N); });
    R.addEventListener('click', function () { at = 0; paint(true); });
    return { paint: paint, set: function (v) { at = v; paint(false); }, at: function () { return at; } };
  };

  /* 7.1 · amm: a pool of 100 A and 10 000 B (invented tokens) priced by x · y = k. The amount brought slides the dot along
     the curve: what comes out (fee of 0,3 % included), the average price, the impact (without the fee). Someone else's
     trade of 5 A first: within the tolerance, yours is filled; beyond it, refused, and the dot stays */
  LABS.amm = function (root, api) {
    var K = 'web3c.mods.6.items.0.lab.', say = o(root, 'say'), inR = $('[data-f="in"]', root), tolR = $('[data-f="tol"]', root);
    var XR = [40, 200], YR = [0, 25000], A0 = kit3.amm;
    var dot = function (x, y) { return 'M' + kit3.X(x, XR) + ' ' + kit3.Y(y, YR) + 'h0.01'; };
    var paint = function (front) {
      var n = Number(inR.value), out = A0.out(A0.X, A0.Y, n), tol = Number(tolR.value);
      setTpl(o(root, 'inL'), { n: grpS(n) }); inR.setAttribute('aria-valuetext', grpS(n) + ' A');
      setTpl(o(root, 'out'), { b: f2(out) }); setTpl(o(root, 'avg'), { p: n ? f2(out / n) : '—' }); setTpl(o(root, 'impact'), { p: pct(A0.impact(A0.X, n)) });
      setTpl(o(root, 'tolL'), { p: nS(tol) }); tolR.setAttribute('aria-valuetext', nS(tol) + ' %');
      var at = front && front.ok ? front.pool : [A0.X + n, A0.Y - out];
      setD(root, 'dot', dot(at[0], at[1]));
      root.setAttribute('data-front', front ? (front.ok ? 'fill' : 'cancel') : '');
      fillTpl(root);
    };
    live(root);
    setD(root, 'curve', kit3.path(A0.pts(), XR, YR)); setD(root, 'dot0', dot(A0.X, A0.Y));
    inR.addEventListener('input', function () { paint(); tone(say, false); api.say(say, o(root, 'out').textContent + ' · ' + o(root, 'impact').textContent); });
    tolR.addEventListener('input', function () { paint(); api.say(say, ''); });
    btn(root, 'front').addEventListener('click', function () {
      var n = Number(inR.value); if (!n) { tone(say, true); api.say(say, api.t(K + 'none')); return; }
      var f = A0.front(n, Number(tolR.value), 5); paint(f);
      tone(say, !f.ok); api.say(say, tf(api.t(K + 'got'), { b: f2(f.got) }) + ' ' + api.t(K + (f.ok ? 'fill' : 'cancel')));
    });
    api.onLang(function () { paint(); });
    paint();
  };

  /* 7.2 · hf: Aave's health factor on a fixed deposit (10 000 units, threshold 80 %): what is borrowed and how the
     collateral's value moves set the gauge; under 1, anyone may liquidate. The rule's chips are text only */
  LABS.hf = function (root, api) {
    var K = 'web3c.mods.6.items.1.lab.hf.', say = o(root, 'say'), dR = $('[data-f="debt"]', root), mR = $('[data-f="move"]', root), g = $('.st-hf__gauge', root);
    var paint = function () {
      var d = Number(dR.value), m = Number(mR.value), h = kit3.hf(10000, 0.8, d, m), hs = isFinite(h) ? f2(h) : '—';
      setTpl(o(root, 'debtL'), { n: grpS(d) }); dR.setAttribute('aria-valuetext', grpS(d));
      setTpl(o(root, 'moveL'), { p: sgn(m) }); mR.setAttribute('aria-valuetext', sgn(m) + ' %');
      setTpl(o(root, 'hf'), { h: hs });
      var low = isFinite(h) && h < 1;
      setVar(g, '--hf', isFinite(h) ? Math.min(h, 3) / 3 : 1);
      root.classList.toggle('is-risk', low); o(root, 'risk').hidden = !low; o(root, 'liq').hidden = !low;
      o(root, 'state').textContent = api.t(K + (low ? 'risk' : 'safe')).split(/[.:]/)[0];
      fillTpl(root);
      return o(root, 'hf').textContent + ' · ' + (low ? api.t(K + 'risk') : api.t(K + 'safe'));
    };
    live(root);
    [dR, mR].forEach(function (r) { r.addEventListener('input', function () { var s = paint(); tone(say, root.classList.contains('is-risk')); api.say(say, s); }); });
    api.radios($('[data-f="rule"]', root), function (v) { o(root, 'rule').textContent = api.t(K + 'rule.v.' + v); tone(say, false); api.say(say, api.t(K + 'rule.k.' + v) + ' · ' + api.t(K + 'rule.v.' + v)); });
    api.onLang(function () { paint(); o(root, 'rule').textContent = api.t(K + 'rule.v.' + Number($('[data-f="rule"] [aria-checked="true"]', root).getAttribute('data-v'))); });
    paint();
  };

  /* 7.3 · stable: three cards, what holds each one's value. A reserve paid out ten at a time (complete, or 70 %); a
     collateral of 200 for 100 tokens losing value; an algorithm minting sister tokens whose value halves each step */
  LABS.stable = function (root, api) {
    var K = 'web3c.mods.6.items.2.lab.', say = o(root, 'say'), dR = $('[data-f="drop"]', root), gapB = btn(root, 'gap');
    var c0 = kit3.stable.init(false), k2 = 0, N2 = 6;
    var paint0 = function () {
      setTpl(o(root, 'res'), { r: grpS(c0.res), t: grpS(c0.tok) }); setTpl(o(root, 'paid'), { n: grpS(c0.paid) });
      setVar($('.st-stab__c0', root), '--res', c0.res / 100); setVar($('.st-stab__c0', root), '--paid', c0.paid / 100);
      var empty = c0.gap && c0.res <= 0; o(root, 'empty').hidden = !empty; $('.st-stab__c0', root).classList.toggle('is-broken', empty);
      btn(root, 'run0').disabled = c0.res <= 0 || c0.tok <= 0; gapB.setAttribute('aria-pressed', String(c0.gap));
    };
    var paint1 = function () {
      var p = Number(dR.value), v = kit3.stable.vault(p);
      setTpl(o(root, 'vault'), { c: nS(v.c), t: 100 }); setTpl(o(root, 'dropL'), { p: grpS(p) }); dR.setAttribute('aria-valuetext', grpS(p) + ' %');
      setVar($('.st-stab__c1', root), '--coll', v.c / 200);
      o(root, 'warn').hidden = v.state !== 'warn'; o(root, 'under').hidden = v.state !== 'under';
      $('.st-stab__c1', root).classList.toggle('is-broken', v.state === 'under');
      return v;
    };
    var paint2 = function () {
      var a = kit3.stable.algo(k2); setTpl(o(root, 'sister'), { s: grpS(a.minted) });
      var c = $('.st-stab__c2', root); c.setAttribute('data-k', String(k2)); setVar(c, '--val', a.value);
      o(root, 'spiral').hidden = a.peg; c.classList.toggle('is-broken', !a.peg);
      btn(root, 'run2').disabled = k2 >= N2;
      return a;
    };
    var paint = function () { paint0(); paint1(); paint2(); fillTpl(root); };
    live(root);
    btn(root, 'run0').addEventListener('click', function () {
      var r = kit3.stable.run(c0); c0 = r.s; paint(); keepFocus(btn(root, 'run0'), gapB);
      var empty = c0.gap && c0.res <= 0; tone(say, empty); api.say(say, o(root, 'paid').textContent + (empty ? ' · ' + api.t(K + 'empty') : ''));
    });
    gapB.addEventListener('click', function () { c0 = kit3.stable.init(!c0.gap); paint(); tone(say, false); api.say(say, o(root, 'res').textContent); });
    dR.addEventListener('input', function () { var v = paint1(); fillTpl(root); tone(say, v.state === 'under'); api.say(say, o(root, 'vault').textContent + (v.state === 'ok' ? '' : ' · ' + api.t(K + v.state))); });
    btn(root, 'run2').addEventListener('click', function () {
      if (k2 < N2) k2++; var a = paint2(); fillTpl(root); keepFocus(btn(root, 'run2'), btn(root, 'reset'));
      tone(say, !a.peg); api.say(say, o(root, 'sister').textContent + (a.peg ? '' : ' · ' + api.t(K + 'spiral')));
    });
    btn(root, 'reset').addEventListener('click', function () { c0 = kit3.stable.init(false); k2 = 0; dR.value = '0'; paint(); tone(say, false); api.say(say, ''); });
    api.onLang(paint);
    paint();
  };

  /* 7.4 · stack: each press puts one more layer on the native asset, and the list of what one depends on grows (1, 4, 8,
     11, 14); a press when the stack is full starts again. An incident at the bottom reaches every layer above, one
     after the other on a wide screen (a cut each, 83 ms apart: one step of the grid), all at once under reduced motion */
  LABS.stack = function (root, api) {
    var K = 'web3c.mods.6.items.3.lab.', say = o(root, 'say'), n = 1, N = 5, timers = [], addB = btn(root, 'add');
    var deps = [0, 1, 2, 3, 4].map(function (i) { return $$('[data-d="' + i + '"] li', root).length; });
    var clear = function () { timers.forEach(clearTimeout); timers = []; $$('[data-l]', root).forEach(function (l) { l.classList.remove('is-hit'); }); };
    var paint = function () {
      $$('[data-l]', root).forEach(function (l) { l.classList.toggle('is-on', Number(l.getAttribute('data-l')) < n); });
      $$('[data-d]', root).forEach(function (l) { l.classList.toggle('is-on', Number(l.getAttribute('data-d')) < n); });
      if (n < N) o(root, 'next').textContent = api.t(K + 'layers.' + n);
      o(root, 'addL').hidden = n >= N; o(root, 'next').hidden = n >= N; o(root, 'again').hidden = n < N;
      setTpl(o(root, 'count'), { n: kit3.stack(deps.map(function (k) { return new Array(k); }), n) }); fillTpl(root);
    };
    live(root);
    addB.addEventListener('click', function () { clear(); n = n < N ? n + 1 : 1; paint(); tone(say, false); api.say(say, api.t(K + 'layers.' + (n - 1)) + ' · ' + o(root, 'count').textContent); });
    btn(root, 'shock').addEventListener('click', function () {
      clear(); var ls = $$('[data-l]', root).filter(function (l) { return l.classList.contains('is-on'); });
      var wide = window.matchMedia && window.matchMedia('(min-width: 720px)').matches;
      ls.forEach(function (l, i) { if (api.reduce || !wide || !i) l.classList.add('is-hit'); else timers.push(setTimeout(function () { l.classList.add('is-hit'); }, 83 * i)); });
      tone(say, true); api.say(say, api.t(K + 'shockSay'));
    });
    api.onLang(paint);
    paint();
  };

  /* 8.1 · dao: from the vote to the transfer, station by station. Off-chain: signatures (no fee), a result that moves
     nothing, signers of a multisig who must reach a threshold (never 0, never above the five owners). On-chain: a
     transaction per vote, a timelock that lets the ones who disagree leave, then the contract executes */
  LABS.dao = function (root, api) {
    var K = 'web3c.mods.7.items.0.lab.', say = o(root, 'say'), mode = 0, ch = [-1, -1, -1, -1, -1, -1], moved = false, signed = [false, false, false, false, false], thr = 3, left = false, at = 0;
    var tl = function (k) { return api.t(K + k); };
    var list = function () { return kit3.dao.stations(mode); };
    var nSigned = function () { return signed.filter(Boolean).length; };
    var P = btn(root, 'prev'), N = btn(root, 'next'), R = btn(root, 'restart');
    var paint = function () {
      var L = list(), s = L[at]; root.setAttribute('data-mode', String(mode)); root.setAttribute('data-at', String(s));
      $$('[data-stn]', root).forEach(function (li) { var i = Number(li.getAttribute('data-stn')), w = L.indexOf(i); li.classList.toggle('is-on', i === s); li.classList.toggle('is-done', w > -1 && w < at); li.classList.toggle('is-skip', w < 0); });
      $$('[data-s]', root).forEach(function (p) { p.hidden = Number(p.getAttribute('data-s')) !== s; });
      ch.forEach(function (c, i) { o(root, 'c' + i).textContent = c < 0 ? '—' : tl('choice.' + c); o(root, 'n' + i).textContent = c < 0 ? '' : tl(mode ? 'tx' : 'sig'); });
      o(root, 'm1b').hidden = !moved; o(root, 'c1b').textContent = moved && ch[0] >= 0 ? tl('choice.' + ch[0]) : '—';
      var t = kit3.dao.tally(ch); $$('[data-o="tally"]', root).forEach(function (el) { setTpl(el, { f: t[0], c: t[1], a: t[2] }); });
      var ok = kit3.dao.passed(ch), v = o(root, 'verdict'); v.textContent = tl(ok ? 'passed' : 'rejected'); v.classList.toggle('is-no', !ok);
      $$('[data-act="sg"]', root).forEach(function (b, i) { b.setAttribute('aria-pressed', String(signed[i])); });
      setTpl(o(root, 'thr'), { t: thr }); setTpl(o(root, 'signed'), { n: nSigned(), t: thr });
      o(root, 'left').hidden = !left;
      $$('[data-ev]', root).forEach(function (el) { el.textContent = tl('end.v.' + mode + '.' + el.getAttribute('data-ev')); });
      P.disabled = at <= 0; N.disabled = at >= L.length - 1;
      fillTpl(root);
    };
    var go = function (to) {
      at = to; paint(); var L = list(), s = L[at];
      tone(say, false); api.say(say, stepSayT(api, at + 1, L.length, tl('st.' + s)) + (s === 4 ? ' · ' + tl('exec') : ''));
    };
    live(root);
    // Next is refused at the result while the proposal is rejected, or (off-chain) while too few signers have confirmed
    N.addEventListener('click', function () {
      var s = list()[at], why = s !== 2 ? '' : !kit3.dao.passed(ch) ? tl('rejected') : mode === 0 && nSigned() < thr ? tf(tl('short'), { n: nSigned(), t: thr }) : '';
      if (why) { tone(say, true); api.say(say, why); return; }
      if (at < list().length - 1) go(at + 1); keepFocus(N, R);
    });
    P.addEventListener('click', function () { if (at > 0) go(at - 1); keepFocus(P, N); });
    R.addEventListener('click', function () { left = false; go(0); });
    api.radios($('[data-f="mode"]', root), function (v) { mode = v; left = false; at = 0; paint(); tone(say, false); api.say(say, tl('mode.k.' + v) + ' · ' + stepSayT(api, 1, list().length, tl('st.0'))); });
    $$('[data-act="m"]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = Number(b.getAttribute('data-v')); ch[i] = ch[i] < 2 ? ch[i] + 1 : 0; paint();
        tone(say, false); api.say(say, tf(tl('member'), { n: i + 1, v: kit3.dao.W[i] }) + ' · ' + tl('choice.' + ch[i]) + ' · ' + tl(mode ? 'tx' : 'sig'));
      });
    });
    btn(root, 'move').addEventListener('click', function () { moved = true; paint(); tone(say, false); api.say(say, tl('moved')); });
    $$('[data-act="sg"]', root).forEach(function (b, i) { b.addEventListener('click', function () { signed[i] = !signed[i]; paint(); tone(say, false); api.say(say, tf(tl('signer'), { n: i + 1 }) + ' · ' + api.t(signed[i] ? 'web3c.x.on' : 'web3c.x.off') + ' · ' + o(root, 'signed').textContent); }); });
    [['thrm', -1], ['thrp', 1]].forEach(function (a) {
      btn(root, a[0]).addEventListener('click', function () { var r = kit3.dao.thr(thr, a[1]); thr = r.t; paint(); tone(say, !!r.err); api.say(say, r.err ? tl(r.err) : o(root, 'thr').textContent); });
    });
    btn(root, 'leave').addEventListener('click', function () { left = true; paint(); tone(say, false); api.say(say, tl('left')); });
    api.onLang(paint);
    paint();
  };

  /* 8.2 · votes: five members, the same preferences, four rules. Token-weighted; delegation (member 5 counts 0 until it
     delegates to itself; the others may hand their balance to a delegate who votes for); quadratic (v votes cost v²
     of 100 credits; the big holder split into ten accounts); soulbound (one badge each, which cannot be given) */
  LABS.votes = function (root, api) {
    var K = 'web3c.mods.7.items.1.lab.', say = o(root, 'say'), tab = 0, s = kit3.votes.init();
    var tl = function (k) { return api.t(K + k); };
    var res = function (r) { return tf(tl('result'), { r: tl(kit3.votes.pass(r) ? 'pass' : 'fail') }) + ' · ' + tf(tl('score'), { f: grpS(r[0]), c: grpS(r[1]) }); };
    var paint = function () {
      root.setAttribute('data-tab', String(tab));
      var all = kit3.votes.all(s);
      setTpl(o(root, 'big'), { p: Math.round(kit3.votes.big() * 100) });
      s.care.forEach(function (k, i) {
        setTpl(o(root, 'care' + i), { s: k });
        var q = kit3.votes.qv(k); setTpl(o(root, 'q' + i), { v: i === 0 && s.split ? 100 : q.v, c: i === 0 && s.split ? '10 × 100' : q.cost });
        setTpl(o(root, 'cr' + i), { c: i === 0 && s.split ? 0 : 100 - q.cost });
        btn(root, 'cm' + i).disabled = k <= 1 || (i === 0 && s.split); btn(root, 'cp' + i).disabled = k >= 5 || (i === 0 && s.split);
      });
      $$('[data-act="deleg"]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(s.deleg[Number(b.getAttribute('data-v'))])); });
      btn(root, 'self').setAttribute('aria-pressed', String(s.self5)); o(root, 'zero').hidden = s.self5;
      btn(root, 'split').setAttribute('aria-pressed', String(s.split));
      o(root, 'result').textContent = res(all[tab]); o(root, 'result').classList.toggle('is-no', !kit3.votes.pass(all[tab]));
      all.forEach(function (r, i) { var c = o(root, 'cmp' + i); c.textContent = res(r); c.classList.toggle('is-no', !kit3.votes.pass(r)); });
      fillTpl(root);
    };
    var speak = function (extra) { tone(say, false); api.say(say, (extra ? extra + ' · ' : '') + o(root, 'result').textContent); };
    live(root);
    api.radios($('[data-f="tab"]', root), function (v) { tab = v; paint(); speak(tl('tabs.' + v)); });
    s.pref.forEach(function (_, i) { api.radios($('[data-f="pref' + i + '"]', root), function (v) { s.pref[i] = v; paint(); speak(tf(tl('member'), { n: i + 1 }) + ' · ' + tl('pref.' + v)); }); });
    s.care.forEach(function (_, i) {
      [['cm', -1], ['cp', 1]].forEach(function (a) { var b = btn(root, a[0] + i); b.addEventListener('click', function () { s.care[i] = Math.max(1, Math.min(5, s.care[i] + a[1])); paint(); keepFocus(b, btn(root, (a[1] < 0 ? 'cp' : 'cm') + i)); speak(o(root, 'care' + i).textContent); }); });
    });
    $$('[data-act="deleg"]', root).forEach(function (b) { b.addEventListener('click', function () { var i = Number(b.getAttribute('data-v')); s.deleg[i] = !s.deleg[i]; paint(); speak(tf(tl('member'), { n: i + 1 }) + ' · ' + tl('deleg') + ' · ' + api.t(s.deleg[i] ? 'web3c.x.on' : 'web3c.x.off')); }); });
    btn(root, 'self').addEventListener('click', function () { s.self5 = !s.self5; paint(); speak(tf(tl('member'), { n: 5 }) + ' · ' + tl('self') + ' · ' + api.t(s.self5 ? 'web3c.x.on' : 'web3c.x.off')); });
    btn(root, 'split').addEventListener('click', function () { s.split = !s.split; paint(); speak(s.split ? tl('splitSay') : ''); });
    btn(root, 'give').addEventListener('click', function () { tone(say, true); api.say(say, tl('refused')); });
    btn(root, 'reset').addEventListener('click', function () {
      s = kit3.votes.init(); s.pref.forEach(function (v, i) { var g = $('[data-f="pref' + i + '"]', root); $$('[role="radio"]', g).forEach(function (r) { var on = Number(r.getAttribute('data-v')) === v; r.setAttribute('aria-checked', String(on)); r.tabIndex = on ? 0 : -1; }); });
      paint(); tone(say, false); api.say(say, '');
    });
    api.onLang(paint);
    paint();
  };

  /* 8.3 · legal: three ways to stand (no form, a Wyoming DAO LLC, a Wyoming DUNA), four events, the line the sources
     allow for each; a DUNA needs at least 100 members. The Algeria card is above, always shown; a press goes to it */
  LABS.legal = function (root, api) {
    var K = 'web3c.mods.7.items.2.lab.', say = o(root, 'say'), card = 0, ev = 0, size = 0;
    var paint = function () {
      root.setAttribute('data-card', String(card));
      o(root, 'size').hidden = card !== 2;
      var t = api.t(K + 'res.' + card + '.' + ev) + (card === 2 ? ' ' + api.t(K + 'size.' + (size ? 'ok' : 'no')) : '');
      tone(say, card === 2 && !size); api.say(say, t);
    };
    live(root);
    api.radios($('[data-f="card"]', root), function (v) { card = v; paint(); });
    api.radios($('[data-f="ev"]', root), function (v) { ev = v; paint(); });
    api.radios($('[data-f="size"]', root), function (v) { size = v; paint(); });
    btn(root, 'dz').addEventListener('click', function () {
      var c = document.getElementById('m83-dz'); if (!c) return;
      if (c.scrollIntoView) c.scrollIntoView({ block: 'center', behavior: api.reduce ? 'instant' : 'smooth' });
      c.focus({ preventScroll: true });
    });
    api.onLang(paint);
    // the line baked in French, written once in the page's language (quietly: nothing was pressed yet)
    say.textContent = api.t(K + 'res.' + card + '.' + ev);
  };

  /* 9.1 · traps: five known mistakes in French pseudo-code, one at a time. Reentrancy step by step (pay first: the vault
     empties; zero first: the second call finds nothing); an 8-bit counter that wraps or reverts; a sandwich on a pool
     without fee; a price read from one pool, pushed for one transaction; a function no one guarded, a key with every power */
  LABS.traps = function (root, api) {
    var K = 'web3c.mods.8.items.0.lab.', say = o(root, 'say'), tab = 0, fixed = false, run = kit3.traps.re(false);
    var n8 = 254, chk = false, tol = false, safe = false, msig = false;
    var tl = function (k) { return api.t(K + k); };
    var bits = function (n) { var b = n.toString(2); return ('00000000' + b).slice(-8); };
    live(root);
    // reentrancy
    var codeK = function () { return fixed ? 're.fixed.' : 're.code.'; };
    var R = stepper(root, 'r', function () { return run.length; }, function (at, said) {
      var r = at ? run[at - 1] : { v: 10, s: 1, line: -1 };
      setTpl(o(root, 'rev'), { v: r.v, s: r.s }); setVar($('.st-trap__vault', root), '--v', r.v / 10);
      $$('[data-o^="code"]', root).forEach(function (li, i) { li.textContent = tl(codeK() + i); li.classList.toggle('is-on', at > 0 && !r.stop && r.line === i); });
      $('.st-trap__caller', root).classList.toggle('is-on', !!r.back); $('.st-trap__vault', root).classList.toggle('is-broken', !fixed && at === run.length);
      fillTpl(root);
      if (!said) return;
      // the corrected run's first step zeroes, pays, and is called back (re.zeroPaid); "empty" only where the vault is (rev1)
      var m = !at ? '' : r.stop ? tl('re.stop') : r.zero ? tf(tl('re.zeroPaid'), { v: r.v }) : r.back ? tf(tl('re.paid'), { v: r.v }) + ' ' + tl('re.back') : r.v === 0 ? tf(tl('re.paid'), { v: r.v }) + ' ' + tl('re.end') : tf(tl('re.paid'), { v: r.v });
      tone(say, !fixed && at === run.length); api.say(say, at ? stepSayT(api, at, run.length, m) : '');
    });
    btn(root, 'refix').addEventListener('click', function () { fixed = !fixed; run = kit3.traps.re(fixed); btn(root, 'refix').setAttribute('aria-pressed', String(fixed)); R.set(0); tone(say, false); api.say(say, fixed ? tl('re.fix') : ''); });
    // overflow
    var paintOf = function () { setTpl(o(root, 'dial'), { n: n8 }); o(root, 'bits').textContent = bits(n8); fillTpl(root); };
    api.radios($('[data-f="ofmode"]', root), function (v) { chk = v === 1; tone(say, false); api.say(say, tl('of.mode.k.' + v)); });
    [['ofp', 1], ['ofm', -1]].forEach(function (a) {
      btn(root, a[0]).addEventListener('click', function () {
        var r = kit3.traps.of(n8, a[1], chk); n8 = r.n; paintOf();
        tone(say, !!(r.wrap || r.revert)); api.say(say, r.revert ? tl('of.revert') : r.wrap ? tf(tl('of.wrap'), { n: r.n }) : o(root, 'dial').textContent);
      });
    });
    // sandwich
    var sw = kit3.traps.sw(null);
    var S = stepper(root, 's', function () { return 4; }, function (at, said) {
      root.setAttribute('data-sw', String(at));
      $$('[data-sws]', root).forEach(function (li) { var i = Number(li.getAttribute('data-sws')); li.classList.toggle('is-on', i === at - 1); li.classList.toggle('is-done', i < at - 1); });
      setTpl(o(root, 'sw0'), { b: f2(sw.bot) }); setTpl(o(root, 'sw1'), { b: f2(sw.mine) }); setTpl(o(root, 'sw2'), { b: f2(sw.bot), a: f2(sw.back) });
      o(root, 'sw1').hidden = !sw.ok; o(root, 'sw1no').hidden = sw.ok; o(root, 'swr').hidden = !sw.ok; o(root, 'swrno').hidden = sw.ok;
      fillTpl(root);
      if (!said || !at) { if (said) api.say(say, ''); return; }
      var li = $('[data-sws="' + (at - 1) + '"]', root), txt = [].map.call(li.querySelectorAll('[data-o]:not([hidden])'), function (x) { return x.textContent; }).join(' ');
      tone(say, at === 2 && !sw.ok); api.say(say, stepSayT(api, at, 4, txt));
    });
    btn(root, 'swtol').addEventListener('click', function () { tol = !tol; sw = kit3.traps.sw(tol ? 0.5 : null); btn(root, 'swtol').setAttribute('aria-pressed', String(tol)); S.set(0); tone(say, false); api.say(say, ''); });
    // oracle
    var O = stepper(root, 'o', function () { return 3; }, function (at, said) {
      var r = kit3.traps.or(safe), up = at >= 1;
      setTpl(o(root, 'orp'), { p: up ? nS(r.p) : grpS(r.p0) }); setTpl(o(root, 'orl'), { l: grpS(up ? r.l : r.l0) });
      $$('[data-ors]', root).forEach(function (li) { var i = Number(li.getAttribute('data-ors')); li.classList.toggle('is-on', i === at - 1); li.classList.toggle('is-done', i < at - 1); li.classList.toggle('is-struck', safe && i > 0); });
      o(root, 'held').hidden = !(safe && up); $('.st-trap__or', root).classList.toggle('is-broken', !safe && at >= 2);
      fillTpl(root);
      if (!said) return;
      tone(say, !safe && at >= 2); api.say(say, at ? stepSayT(api, at, 3, safe && at > 1 ? tl('or.held') : tl('or.steps.' + (at - 1))) + ' · ' + o(root, 'orp').textContent : '');
    });
    btn(root, 'orsafe').addEventListener('click', function () { safe = !safe; btn(root, 'orsafe').setAttribute('aria-pressed', String(safe)); O.set(0); tone(say, false); api.say(say, ''); });
    // access control
    var paintAc = function (a) { var r = kit3.traps.ac(msig, a); r.tags.forEach(function (t, i) { var el = o(root, 'tag' + i); el.textContent = tl('ac.' + t); el.setAttribute('data-t', t); }); return r; };
    ['anyone', 'steal'].forEach(function (a) { btn(root, a).addEventListener('click', function () { var r = paintAc(a); tone(say, r.r === 'minted' || r.r === 'all'); api.say(say, tl('ac.' + r.r)); }); });
    btn(root, 'msig').addEventListener('click', function () { msig = !msig; btn(root, 'msig').setAttribute('aria-pressed', String(msig)); paintAc(''); tone(say, false); api.say(say, tl('ac.msig') + ' · ' + api.t(msig ? 'web3c.x.on' : 'web3c.x.off')); });
    api.radios($('[data-f="tab"]', root), function (v) { tab = v; root.setAttribute('data-tab', String(v)); tone(say, false); api.say(say, tl('tabs.' + v)); });
    api.onLang(function () { R.paint(false); paintOf(); S.paint(false); O.paint(false); paintAc(''); });
    R.paint(false); paintOf(); S.paint(false); O.paint(false); paintAc('');
  };

  /* 9.2 · sieve: twelve bugs, five layers that each catch some (an example split); a layer switched off lets its bugs
     fall to the bin, "deployed"; two bugs no layer catches. Placing is a cut: no bug falls on screen */
  LABS.sieve = function (root, api) {
    var K = 'web3c.mods.8.items.1.lab.', say = o(root, 'say'), on = [true, true, true, true, true];
    var bugs = $$('[data-bug]', root), bag = o(root, 'bag');
    var paintOn = function () { $$('[data-act="on"]', root).forEach(function (b, i) { b.setAttribute('aria-pressed', String(on[i])); o(root, 'onv' + i).textContent = api.t(on[i] ? 'web3c.x.on' : 'web3c.x.off'); b.closest('li').classList.toggle('is-off', !on[i]); }); };
    var place = function (r) { bugs.forEach(function (b, i) { var at = r ? r.at[i] : null; (at === null ? bag : at < 0 ? o(root, 'tbin') : o(root, 't' + at)).appendChild(b); }); root.classList.toggle('is-run', !!r); };
    live(root);
    $$('[data-act="on"]', root).forEach(function (b, i) { b.addEventListener('click', function () { on[i] = !on[i]; paintOn(); place(null); tone(say, false); api.say(say, api.t(K + 'layers.' + i) + ' · ' + api.t(on[i] ? 'web3c.x.on' : 'web3c.x.off')); }); });
    btn(root, 'go').addEventListener('click', function () { var r = kit3.sieve.go(on); place(r); tone(say, false); api.say(say, tf(api.t(K + 'caught'), { a: r.caught, p: r.passed })); });
    btn(root, 'reset').addEventListener('click', function () { on = [true, true, true, true, true]; paintOn(); place(null); tone(say, false); api.say(say, ''); });
    api.onLang(paintOn);
    paintOn(); place(null);
  };

  /* 9.3 · bridge: lock on A, mint on B, and the equality that should always hold. Who confirms the lock: a group of
     signers (a threshold of 9, a demo value), verifiers the application chose (two required, four optional), or B
     itself (a light client). Stolen keys at the threshold forge a message; a bug in the contract empties the vault */
  LABS.bridge = function (root, api) {
    var K = 'web3c.mods.8.items.2.lab.', say = o(root, 'say'), s = kit3.bridge.init(), mode = 0, THR = 5, sR = $('[data-f="steal"]', root);
    var tl = function (k) { return api.t(K + k); };
    var paint = function () {
      root.setAttribute('data-mode', String(mode)); root.classList.toggle('is-broken', s.broken);
      setTpl(o(root, 'vault'), { n: s.a }); setTpl(o(root, 'wrapped'), { n: s.b }); setTpl(o(root, 'inv'), { a: s.a, b: s.b });
      o(root, 'broken').hidden = !s.broken;
      var n = Number(sR.value);
      sR.max = mode === 1 ? '6' : '9'; sR.disabled = mode === 2; if (mode === 2) { sR.value = '0'; n = 0; }
      setTpl(o(root, 'stealL'), { n: n }); sR.setAttribute('aria-valuetext', String(n));
      $$('[data-sig]', root).forEach(function (c, i) { c.classList.toggle('is-stolen', mode === 0 && i < n); });
      // mode 1: the range takes the four optional verifiers first, then the two required
      $$('[data-ver]', root).forEach(function (c) { var k = Number(c.getAttribute('data-ver')); c.classList.toggle('is-stolen', mode === 1 && (k >= 2 ? k - 2 < n : 4 + k < n)); });
      setTpl(o(root, 'req'), { n: kit3.bridge.req(mode === 1 ? n : 0) });
      btn(root, 'go').disabled = s.broken; btn(root, 'back').disabled = s.broken || s.b < 10;
      fillTpl(root);
    };
    live(root);
    btn(root, 'go').addEventListener('click', function () { s = kit3.bridge.go(s); paint(); tone(say, false); api.say(say, tl('goSay') + ' ' + o(root, 'inv').textContent); });
    btn(root, 'back').addEventListener('click', function () { s = kit3.bridge.back(s); paint(); keepFocus(btn(root, 'back'), btn(root, 'go')); tone(say, false); api.say(say, tl('backSay') + ' ' + o(root, 'inv').textContent); });
    // a new mode starts from a fresh bridge (rev1: a break in one mode no longer carries into the next), and says so when it was used
    api.radios($('[data-f="mode"]', root), function (v) { var used = s.broken || s.a !== kit3.bridge.init().a || s.b !== kit3.bridge.init().b; mode = v; s = kit3.bridge.init(); sR.value = '0'; paint(); tone(say, false); api.say(say, (mode === 2 ? tl('light') : tl('mode.k.' + v)) + (used ? ' ' + tl('fresh') : '')); });
    sR.addEventListener('input', function () {
      var n = Number(sR.value);
      if (kit3.bridge.pass(mode, n, THR) && !s.broken) { s = kit3.bridge.fake(s); paint(); tone(say, true); api.say(say, tl('fake') + ' ' + tl('broken')); return; }
      paint(); tone(say, false);
      api.say(say, mode === 1 ? o(root, 'req').textContent + (n >= 6 ? '' : ' · ' + tl('reqSay')) : o(root, 'stealL').textContent + (s.broken ? '' : ' · ' + tl('refused')));
    });
    btn(root, 'bug').addEventListener('click', function () { s = kit3.bridge.bug(s); paint(); keepFocus(btn(root, 'go'), btn(root, 'reset')); tone(say, true); api.say(say, tl('bugSay') + ' ' + tl('broken')); });
    btn(root, 'reset').addEventListener('click', function () { s = kit3.bridge.init(); sR.value = '0'; paint(); tone(say, false); api.say(say, ''); });
    api.onLang(paint);
    paint();
  };
  /* /W3X-M789 */
  /* ---------------- wiring: each root once, its kind's function if it has one ---------------- */
  var wire = function () {
    $$('[data-lab]', A.root || document).forEach(function (root) {
      var kind = root.getAttribute('data-lab'), fn = LABS[kind];
      if (!fn || root._lab) return;
      root._lab = true;
      try { fn(root, api); } catch (e) { root._lab = false; }
    });
  };
  wire();
  // every templated line of the course, inside a lab or in a still figure beside it, in the page's language
  var course = typeof document.getElementById === 'function' ? document.getElementById('web3') : null;
  // a bare number baked in French ([data-num], a still figure's labels): written in the page's format, while untouched
  var fillNum = function (root) {
    $$('[data-num]', root).forEach(function (el) {
      var fr = el.getAttribute('data-num-fr');
      if (fr == null) { fr = el.textContent; el.setAttribute('data-num-fr', fr); el._num = fr; }
      if (el.textContent !== el._num) return;
      el._num = bakedV(fr); el.textContent = el._num;
    });
  };
  if (course) { fillTpl(course); fillNum(course); A.onLang(function () { fillTpl(course); fillNum(course); }); }
  window.NUMIDEA_W3X.labs = LABS; window.NUMIDEA_W3X.wire = wire; window.NUMIDEA_W3X.hashKit = hashKit; window.NUMIDEA_W3X.kit = kit; window.NUMIDEA_W3X.kit2 = kit2; window.NUMIDEA_W3X.kit3 = kit3;
})();

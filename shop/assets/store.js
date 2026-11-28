/* Tr4velerz Studio store: the bag (localStorage "tr4.bag"), the add buttons, ?add=<id>[:<option>] deep links,
   the bag page and its WhatsApp order. Prices are read from window.TR4 (assets/catalog.js, generated from
   scripts/shop-data.mjs), never from the page. The WhatsApp number comes from config.js (CMF_CONFIG.whatsapp). */
(function () {
  'use strict';
  var D = window.TR4 || { products: {}, t: {} };
  var L = document.body.getAttribute('data-lang') || 'fr';
  var T = D.t[L] || D.t.fr || {};
  var WA = ((window.CMF_CONFIG && window.CMF_CONFIG.whatsapp) || D.wa || '').replace(/\D/g, '');
  var KEY = 'tr4.bag';

  function read() { try { var b = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(b) ? b : []; } catch (e) { return []; } }
  function write(b) { try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) {} count(); }
  function clean(b) {
    return b.filter(function (x) { return x && D.products[x.id]; }).map(function (x) {
      var p = D.products[x.id], q = Math.max(1, Math.min(p.max || 5, parseInt(x.qty, 10) || 1));
      var o = p.options ? (p.options[x.opt] ? x.opt : Object.keys(p.options)[0]) : null;
      return { id: x.id, opt: o, qty: q };
    });
  }
  function add(id, opt) {
    if (!D.products[id]) return false;
    var b = clean(read()), hit = b.filter(function (x) { return x.id === id && x.opt === (opt || null); })[0];
    if (hit) hit.qty += 1; else b.push({ id: id, opt: opt || null, qty: 1 });
    write(clean(b)); return true;
  }
  function count() {
    var n = clean(read()).reduce(function (s, x) { return s + x.qty; }, 0);
    document.querySelectorAll('[data-bag-count]').forEach(function (el) { el.textContent = n; });
  }
  function money(n) {
    var s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, L === 'en' ? ',' : ' ');
    return s + ' ' + (T.da || 'DA');
  }
  function waUrl(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }

  /* add buttons */
  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-add'), sel = document.querySelector('[data-opt="' + id + '"]');
      if (!add(id, sel ? sel.value : null)) return;
      btn.setAttribute('data-in', '');
      var label = btn.textContent; btn.textContent = btn.getAttribute('data-added') + ' ✓';
      setTimeout(function () { btn.removeAttribute('data-in'); btn.textContent = label; }, 1400);
      var bb = document.querySelector('.bagbtn'); if (bb) { bb.classList.remove('bump'); void bb.offsetWidth; bb.classList.add('bump'); }
    });
  });

  /* waitlist links take the live number */
  if (WA) document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = waUrl(a.getAttribute('data-wa')); });

  /* ?add=id or ?add=id:option, then on to the bag */
  var q = new URLSearchParams(location.search).get('add');
  if (q) { var parts = q.split(':'); add(parts[0], parts[1]); }
  count();

  /* the bag page */
  var sac = document.querySelector('[data-sac]');
  if (!sac) return;
  var list = sac.querySelector('[data-sac-list]'), empty = sac.querySelector('[data-sac-empty]'), tot = sac.querySelector('[data-sac-total]'),
      sum = sac.querySelector('[data-sac-sum]'), form = sac.querySelector('[data-order]');

  function render() {
    var b = clean(read()); list.textContent = '';
    empty.hidden = b.length > 0; tot.hidden = form.hidden = b.length === 0;
    var total = 0;
    b.forEach(function (x, i) {
      var p = D.products[x.id], line = p.price * x.qty; total += line;
      var li = document.createElement('li'); li.className = 'line';
      var img = document.createElement('img'); img.alt = ''; img.width = 72; img.height = 72;
      img.src = p.img ? '/' + p.img : '/assets/kuro/' + p.kuro + '.webp'; if (!p.img) img.className = 'is-kuro';
      var mid = document.createElement('div');
      var h = document.createElement('p'); h.className = 'line__name'; h.textContent = p.name[L] || p.name.fr; mid.appendChild(h);
      if (x.opt && p.options) { var o = document.createElement('p'); o.className = 'line__opt'; o.textContent = p.options[x.opt][L]; mid.appendChild(o); }
      var ctl = document.createElement('div'); ctl.className = 'line__ctl';
      function btn(txt, lab, fn, cls) { var e = document.createElement('button'); e.type = 'button'; e.textContent = txt; e.setAttribute('aria-label', lab); if (cls) e.className = cls; e.addEventListener('click', fn); return e; }
      var n = document.createElement('span'); n.className = 'g-num'; n.textContent = x.qty; n.setAttribute('aria-label', (T.qty || '') + ' ' + x.qty);
      ctl.append(
        btn('−', (T.qty || '') + ' −1', function () { var c = clean(read()); c[i].qty -= 1; if (c[i].qty < 1) c.splice(i, 1); write(c); render(); }),
        n,
        btn('+', (T.qty || '') + ' +1', function () { var c = clean(read()); c[i].qty += 1; write(clean(c)); render(); }),
        btn(T.remove || '×', T.remove || 'remove', function () { var c = clean(read()); c.splice(i, 1); write(c); render(); }, 'rm')
      );
      mid.appendChild(ctl);
      var pr = document.createElement('b'); pr.className = 'line__price g-num'; pr.textContent = money(line);
      li.append(img, mid, pr); list.appendChild(li);
    });
    sum.textContent = money(total);
    return { b: b, total: total };
  }
  render();
  window.addEventListener('storage', function (e) { if (e.key === KEY) render(); });

  function ref() {
    var d = new Date(), p = function (v) { return String(v).padStart(2, '0'); };
    var r = ''; var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (var i = 0; i < 4; i++) r += abc[Math.floor(Math.random() * abc.length)];
    return 'T-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + r;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = form.querySelector('[data-order-err]'), f = T.form || {}, miss = [];
    var v = function (n) { return (form.elements[n].value || '').trim(); };
    ['name', 'phone', 'wilaya', 'addr'].forEach(function (k) { if (!v(k)) miss.push(f[k]); });
    if (miss.length) { err.textContent = (T.need || '') + ' ' + miss.join(', '); err.hidden = false; form.elements[['name', 'phone', 'wilaya', 'addr'].filter(function (k) { return !v(k); })[0]].focus(); return; }
    err.hidden = true;
    var st = render(), pay = form.elements.pay.value, r = ref();
    var lines = st.b.map(function (x) {
      var p = D.products[x.id];
      return '• ' + x.qty + ' × ' + (p.name[L] || p.name.fr) + (x.opt && p.options ? ' (' + p.options[x.opt][L] + ')' : '') + ' = ' + money(p.price * x.qty);
    });
    var msg = [T.hi, '', T.ref + ' ' + r].concat(lines).concat([
      T.total + ' : ' + money(st.total), '',
      f.name + ' : ' + v('name'), f.phone + ' : ' + v('phone'), f.wilaya + ' : ' + v('wilaya'), f.addr + ' : ' + v('addr'),
      f.pay + ' : ' + ((T.pays || {})[pay] || pay)
    ]).join('\n');
    var done = form.querySelector('[data-order-done]');
    form.querySelector('[data-order-msg]').textContent = msg; done.hidden = false;
    var a = document.createElement('a'); a.href = waUrl(msg); a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
  });
  var cp = form.querySelector('[data-copy]');
  cp.addEventListener('click', function () {
    var pre = form.querySelector('[data-order-msg]'), label = cp.textContent;
    var ok = function () { cp.textContent = cp.getAttribute('data-copied') + ' ✓'; setTimeout(function () { cp.textContent = label; }, 1400); };
    if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent).then(ok, function () { sel(pre); });
    else sel(pre);
  });
  function sel(el) { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
})();

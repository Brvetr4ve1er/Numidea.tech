// TEMPORARY (removed before PR 46 leaves draft): find what crashes WebKit on
// hub/ at phone widths. Each variant loads the page fresh, applies one
// removal, then scrolls it the way vbugs does; a crash is a closed target.
import { serve, launch } from '../scripts/lib/serve.mjs';
const srv = await serve();
const b = await launch();
const sections = await (async () => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(srv.base + '/hub/', { waitUntil: 'domcontentloaded' });
  const ids = await p.evaluate(() => [...document.querySelectorAll('main section[id], body > section[id], section[id]')].filter((s) => !s.parentElement.closest('section[id]')).map((s) => s.id));
  await p.close();
  return ids;
})();
const css = (c) => ({ css: c });
const V = [
  ['baseline', {}],
  ['no animation', css('*,*::before,*::after{animation:none!important}')],
  ['minus #work', { js: 'document.getElementById("work")?.remove()' }],
  ['no case tracks', { js: 'document.querySelectorAll(".st-case__track").forEach(e=>e.remove())' }],
  ['no filter', css('*,*::before,*::after{filter:none!important}')],
];
const variants = []; for (let i = 0; i < 4; i++) for (const v of V) variants.push([v[0] + ' #' + (i + 1), v[1]]);
// the two WebKit escapes: their boxes, as WebKit lays them out
for (const [w, lang, path, sel, box] of [[1024, 'ar', '/hub/', '#tech b.st-stat', 'p'], [1440, 'fr', '/hub/bible/', '.says-list li', 'ul']]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.addInitScript((l) => localStorage.setItem('numidea-lang', l), lang);
  await p.goto(srv.base + path, { waitUntil: 'networkidle' });
  console.log('BOX', w, lang, path, JSON.stringify(await p.evaluate(([sel, box]) => [...document.querySelectorAll(sel)].map((e) => { const r = e.getBoundingClientRect(), q = e.closest(box).getBoundingClientRect(), c = getComputedStyle(e);
    return { t: e.textContent.slice(0, 24), e: [r.left, r.top, r.right, r.bottom].map(Math.round), box: [q.left, q.top, q.right, q.bottom].map(Math.round), ff: c.fontFamily.slice(0, 40), lh: c.lineHeight, fs: c.fontSize }; }), [sel, box])));
  await p.close();
}
for (const [w, lang] of [[390, 'ar'], [360, 'fr']]) {
  for (const [name, v] of variants) {
    let p;
    try {
      p = await b.newPage({ viewport: { width: w, height: 800 } });
      await p.addInitScript((l) => localStorage.setItem('numidea-lang', l), lang);
      await p.goto(srv.base + '/hub/', { waitUntil: 'networkidle', timeout: 60000 });
      if (v.css) await p.addStyleTag({ content: v.css });
      if (v.js) await p.evaluate(v.js);
      await p.evaluate(async () => { document.documentElement.style.scrollBehavior = 'auto'; const H = document.body.scrollHeight; for (let y = 0; y < H; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
      await p.waitForTimeout(1500);
      const h = await p.evaluate(() => document.body.scrollHeight);
      console.log(`ok      ${w}/${lang} ${name} (height ${h})`);
    } catch (e) {
      console.log(`CRASH   ${w}/${lang} ${name}: ${String(e.message).split('\n')[0]}`);
    } finally { try { await p?.close(); } catch {} }
  }
}
await b.close();
await srv.close?.();
process.exit(0);

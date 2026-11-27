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
const variants = [
  ['baseline', {}],
  ['no filter/backdrop', css('*,*::before,*::after{filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}')],
  ['no mask/clip', css('*,*::before,*::after{mask:none!important;-webkit-mask:none!important;clip-path:none!important}')],
  ['no animation', css('*,*::before,*::after{animation:none!important}')],
  ['no will-change/transform3d', css('*,*::before,*::after{will-change:auto!important}')],
  ['no position:sticky/fixed', css('*{position:static!important}')],
  ['no mix-blend', css('*,*::before,*::after{mix-blend-mode:normal!important;isolation:auto!important}')],
  ['no video', { js: 'document.querySelectorAll("video").forEach(v=>v.remove())' }],
  ['no canvas', { js: 'document.querySelectorAll("canvas").forEach(v=>v.remove())' }],
  ['no images', { js: 'document.querySelectorAll("img,picture,svg image").forEach(v=>v.remove())' }],
  ['no box-shadow/text-shadow', css('*,*::before,*::after{box-shadow:none!important;text-shadow:none!important}')],
  ['no bg images', css('*,*::before,*::after{background-image:none!important}')],
  ...sections.map((id) => ['minus #' + id, { js: `document.getElementById(${JSON.stringify(id)})?.remove()` }]),
];
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

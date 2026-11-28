#!/usr/bin/env node
// TEMPORARY diagnostic (reverted before review): where WebKit's page process dies on /hub/.
import { serve, launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';

const srv = await serve(ROOT, { compress: false, fallback404: true });
const b = await launch();
for (let rep = 0; rep < 3; rep++) for (const rm of ['fixed']) for (const [w, lang] of [[768, 'fr'], [390, 'ar'], [360, 'fr'], [360, 'ar']]) {
  const p = await b.newPage({ viewport: { width: w, height: w < 600 ? 800 : 900 }, reducedMotion: 'no-preference' });
  await p.addInitScript(([l, rm]) => {
    localStorage.setItem('numidea-lang', l);
    if (rm === 'nosting') sessionStorage.setItem('numidea-sting', '1');
    const css = rm === 'noblur' ? '.st-sting__g{filter:none!important}' : rm === 'noanim' ? '.st-sting *{animation:none!important}' : '';
    if (css) document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); });
  }, [lang, rm]);
  let last = 'load';
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log(`  [${w}/${lang}/${rm}] console.${m.type()}: ${m.text().slice(0, 200)}`); });
  p.on('pageerror', (e) => console.log(`  [${w}/${lang}/${rm}] pageerror: ${e.message.slice(0, 200)}`));
  p.on('crash', () => console.log(`  [${w}/${lang}/${rm}] CRASH after: ${last}`));
  try {
    await p.goto(srv.base + '/hub/', { waitUntil: 'networkidle' });
    last = 'networkidle';
    const H = await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; return document.body.scrollHeight; });
    for (let y = 0; y < H; y += 400) {
      last = `scroll ${y}/${H}: ` + await p.evaluate((y) => { scrollTo(0, y); const e = document.elementFromPoint(innerWidth / 2, innerHeight / 2); const s = e && e.closest('section,[id]'); return (s ? s.tagName.toLowerCase() + '#' + s.id + '.' + [...s.classList].join('.') : '?'); }, y);
      await p.waitForTimeout(60);
    }
    console.log(`ok ${w}/${lang}/${rm} H=${H}`);
  } catch (e) {
    console.log(`FAIL ${w}/${lang}/${rm}: ${e.message.split('\n')[0]} | last: ${last}`);
  }
  await p.close().catch(() => {});
}
await b.close(); await srv.close?.();
process.exit(0);

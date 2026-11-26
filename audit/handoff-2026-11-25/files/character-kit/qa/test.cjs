// Playwright check for the kit preview. Run: node qa/test.cjs (from the kit folder or anywhere).
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), OUT = __dirname;
const types = { html: 'text/html', js: 'text/javascript', css: 'text/css', json: 'application/json', webp: 'image/webp', woff2: 'font/woff2' };
(async () => {
  const b = await chromium.launch(); const errs = [];
  async function page(vw, vh, reduce) {
    const ctx = await b.newContext({ viewport: { width: vw, height: vh }, reducedMotion: reduce ? 'reduce' : 'no-preference' });
    await ctx.route('http://kit.test/**', r => {
      const u = new URL(r.request().url()); let f = path.join(ROOT, decodeURIComponent(u.pathname)); if (f.endsWith(path.sep)) f += 'index.html';
      if (!fs.existsSync(f)) { errs.push('404 ' + u.pathname); return r.fulfill({ status: 404, body: '' }); }
      r.fulfill({ body: fs.readFileSync(f), contentType: types[f.split('.').pop()] || 'application/octet-stream' });
    });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push('pageerror ' + e.message));
    p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text()); });
    await p.goto('http://kit.test/'); await p.waitForSelector('[data-ready]'); return p;
  }
  const p = await page(1440, 900);
  console.log(await p.textContent('#stats'));
  await p.evaluate(() => [...document.images].forEach(i => { i.loading = 'eager'; }));
  await p.waitForTimeout(1500);
  const broken = await p.evaluate(() => [...document.images].filter(i => i.getAttribute('src') && !(i.complete && i.naturalWidth)).map(i => i.getAttribute('src')));
  console.log('broken imgs', broken.length, broken.slice(0, 5));
  const seen = await p.evaluate(async () => {
    const c = document.querySelector('[data-action="y.wave"]'); const img = c.querySelector('[data-base]'); const s = new Set();
    c.querySelector('button').click(); for (let i = 0; i < 30; i++) { s.add(img.getAttribute('src')); await new Promise(r => setTimeout(r, 60)); } return [...s];
  });
  console.log('wave frames', seen.map(s => s.split('/').pop()));
  const blink = await p.evaluate(async () => {
    const c = document.querySelector('[data-action="y.blink"]'); const o = c.querySelector('[data-over]'); c.querySelector('button').click();
    await new Promise(r => setTimeout(r, 40)); const a = [o.style.opacity, (o.getAttribute('src') || '').split('/').pop()];
    await new Promise(r => setTimeout(r, 300)); return a.concat(o.style.opacity);
  });
  console.log('blink overlay [during opacity, frame, after opacity]', blink);
  const btns = await p.$$('#sceneChips button'); const res = [];
  for (const [i, bt] of btns.entries()) {
    await bt.click(); await p.waitForTimeout(450);
    res.push(await p.evaluate(() => { const s = document.getElementById('sceneStage'); return s.dataset.scene + ' face=' + s.querySelector('[data-kit=face]').src.split('/').pop() + ' word=' + s.querySelector('[data-kit=word]').textContent; }));
    if ([0, 5, 11, 13, 15, 19].includes(i)) await p.locator('#sceneStage').screenshot({ path: OUT + '/scene-' + i + '.jpg', quality: 78 });
  }
  console.log(res.join('\n'));
  for (const id of ['joy', 'angry', 'sleepy']) { await p.locator('#reactChips button', { hasText: id }).first().click(); await p.waitForTimeout(500); }
  await p.locator('#reactions').screenshot({ path: OUT + '/reactions.jpg', quality: 78 });
  await p.locator('#actions').screenshot({ path: OUT + '/actions.jpg', quality: 70 });
  const m = await page(390, 844); await m.waitForTimeout(600);
  console.log('mobile overflow', await m.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  await m.locator('#sceneStage').screenshot({ path: OUT + '/m-scene.jpg', quality: 78 });
  const r = await page(1280, 800, true);
  const rr = await r.evaluate(() => { const c = document.querySelector('[data-action="y.wave"]'); c.querySelector('button').click(); return c.querySelector('[data-base]').getAttribute('src').split('/').pop(); });
  console.log('reduced-motion wave jumps to', rr);
  console.log('errors', errs);
  await b.close();
})();

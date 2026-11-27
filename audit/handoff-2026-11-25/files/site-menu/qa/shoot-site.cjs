const { chromium } = require('playwright');
const path = require('path');
const dir = process.argv[2], out = process.argv[3];
(async () => {
  const b = await chromium.launch();
  const url = 'http://nl.test/index.html'; const fs=require('fs');
  const serve = async ctx => ctx.route('http://nl.test/**', r => { const u=new URL(r.request().url()); const f=path.resolve(dir, '.'+u.pathname); if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) return r.fulfill({status:200,contentType:'text/html',body:'<h1>'+u.pathname+'</h1>'}); const ext=path.extname(f); r.fulfill({status:200,body:fs.readFileSync(f),contentType:{'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.woff2':'font/woff2'}[ext]}); });
  const errs = [];
  // desktop
  let c = await b.newContext({ viewport: { width: 1440, height: 900 } }); await serve(c); await serve(c); let p = await c.newPage();
  p.on('pageerror', e => errs.push('desk ' + e.message)); p.on('console', m => m.type() === 'error' && errs.push('desk console ' + m.text()));
  await p.goto(url);
  for (const [n, ms] of [['d-i1', 700], ['d-i2', 850], ['d-i3', 650], ['d-i4', 250]]) { await p.waitForTimeout(ms); await p.screenshot({ path: out + '/' + n + '.png' }); }
  await p.waitForTimeout(900); await p.screenshot({ path: out + '/d-rest.png' });
  const box = await p.locator('.nl-item').nth(3).boundingBox();
  await p.mouse.move(200, 200); await p.mouse.move(box.x + box.width/2, box.y + box.height/2, { steps: 8 }); await p.waitForTimeout(400);
  await p.screenshot({ path: out + '/d-hover4.png' });
  await p.keyboard.press('6'); await p.waitForTimeout(400); await p.screenshot({ path: out + '/d-key6.png' });
  const t = await p.locator('.nl-item').nth(1).boundingBox();
  await p.mouse.move(t.x + 40, t.y + 30); await p.waitForTimeout(250);
  const nav = p.waitForEvent('framenavigated').catch(() => null);
  await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(330); await p.screenshot({ path: out + '/d-go.png' });
  await p.waitForTimeout(600); errs.push('after click url: ' + p.url());
  // revisit in same session: intro skipped
  await p.goto(url); await p.waitForTimeout(300); errs.push('revisit class: ' + await p.getAttribute('.nl-menu', 'class'));
  await c.close();
  // mobile
  c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }); await serve(c); p = await c.newPage();
  p.on('pageerror', e => errs.push('mob ' + e.message));
  await p.goto(url); await p.waitForTimeout(3600); await p.screenshot({ path: out + '/m-rest.png', fullPage: true });
  await c.close();
  // reduced motion
  c = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }); await serve(c); p = await c.newPage();
  p.on('pageerror', e => errs.push('rm ' + e.message));
  await p.goto(url); await p.waitForTimeout(400); await p.screenshot({ path: out + '/r-rest.png' });
  errs.push('rm class: ' + await p.getAttribute('.nl-menu', 'class'));
  await c.close();
  // no JS
  c = await b.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false }); await serve(c); p = await c.newPage();
  await p.goto(url); await p.waitForTimeout(400); await p.screenshot({ path: out + '/n-rest.png' }); await c.close();
  await b.close(); console.log(errs.join('\n'));
})();

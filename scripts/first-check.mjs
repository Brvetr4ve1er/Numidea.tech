#!/usr/bin/env node
/**
 * Proves assets/home-first.css (scripts/build-first.mjs) is enough for the
 * home above <main>: `npm run first:check`. For the French, English and
 * Arabic home, in both themes, at phone and desktop widths, it loads the page
 * twice, once as served and once with assets/styles.css refused (what a
 * visitor sees before the full sheet lands), and compares the computed style
 * of every element above <main>, with its ::before and ::after. Any
 * difference fails: the first paint would change when the full sheet
 * arrives. It also fails when the served page fetched styles.css from the
 * head, ahead of the first paint.
 */
import { pathToFileURL } from 'node:url';
import { ROOT } from './site.mjs';
import { serve, launch } from './lib/serve.mjs';

const PAGES = ['', 'en/', 'ar/'];
const THEMES = ['arcanum', 'daylight'];
const WIDTHS = [[360, 740], [390, 844], [820, 1180], [1440, 900]];

async function snapshot(browser, url, theme, [width, height], refuse) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('numidea-theme', t); sessionStorage.setItem('nl-intro-seen', '1'); } catch (e) {} }, theme);
  if (refuse) await ctx.route(/\/assets\/styles\.css/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // app.js gives the header button its classes when the browser is idle: wait for them
  await page.waitForFunction(() => { const c = document.querySelector('.nav-cta'); return !c || c.classList.contains('btn'); }, null, { timeout: 5000 }).catch(() => {});
  const out = await page.evaluate(() => {
    const main = document.querySelector('main');
    const above = [...document.querySelectorAll('body *')].filter((e) => e !== main && !main.contains(e)
      && (e.contains(main) || (main.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING)) && e.tagName !== 'LINK' && e.tagName !== 'SCRIPT');
    const name = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.classList.length ? '.' + [...e.classList].join('.') : '');
    const rows = {};
    [document.documentElement, document.body, ...above].forEach((e, i) => {
      for (const pseudo of [null, '::before', '::after']) {
        const cs = getComputedStyle(e, pseudo);
        if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
        const o = {};
        for (const p of cs) o[p] = cs.getPropertyValue(p);
        rows[i + ' ' + name(e) + (pseudo || '')] = o;
      }
    });
    return rows;
  });
  await ctx.close();
  return out;
}

export async function firstCheck() {
  const site = await serve(ROOT, { compress: false, fallback404: true });
  const browser = await launch();
  let bad = 0, runs = 0;
  try {
    for (const w of WIDTHS) for (const theme of THEMES) for (const p of PAGES) {
      const url = site.base + '/' + p;
      const full = await snapshot(browser, url, theme, w, false);
      const first = await snapshot(browser, url, theme, w, true);
      const diffs = [];
      for (const k of Object.keys(full)) {
        if (!first[k]) { diffs.push(`${k}: missing`); continue; }
        // the page's own height comes from <main>, which the refused sheet lays out differently
        const pageBox = /^[01] (html|body)\b/.test(k);
        for (const prop of Object.keys(full[k])) if (full[k][prop] !== first[k][prop] && !(pageBox && /^(height|block-size|perspective-origin|transform-origin)$/.test(prop))) diffs.push(`${k} ${prop}: ${first[k][prop]} → ${full[k][prop]}`);
      }
      runs++;
      const label = `${p || 'fr/'} ${theme} ${w[0]}×${w[1]}`;
      if (diffs.length) { bad++; console.log(`✗ ${label}: ${diffs.length} differences\n  ` + diffs.slice(0, 12).join('\n  ')); }
      else console.log(`✓ ${label}: ${Object.keys(full).length} boxes identical without styles.css`);
    }
  } finally { await browser.close(); site.close(); }
  return { bad, runs };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { bad, runs } = await firstCheck();
  console.log(bad ? `✗ ${bad} of ${runs} runs differ` : `✓ all ${runs} runs: the first screen needs nothing from styles.css`);
  process.exit(bad ? 1 : 0);
}

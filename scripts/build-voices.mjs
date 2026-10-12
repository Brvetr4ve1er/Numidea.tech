#!/usr/bin/env node
/**
 * Client voices on the landing page — `node scripts/build-voices.mjs`
 * (`--check` exits 1 when index.html differs; check.mjs runs the same test).
 *
 * Fills the <!-- SLOT:voices --> region in #work from scripts/voices-data.mjs.
 * With no voices the region stays empty: no heading, no placeholder. Each
 * quote keeps the language it was given in (lang attribute), whatever the
 * page language; only the section heading is translated (work.voicesH).
 * Project sheets show the same quotes (build-scene.mjs).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './site.mjs';
import { VOICES, VOICE_CLIENTS, validate } from './voices-data.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const RE = /(<!-- SLOT:voices -->)[\s\S]*?(<!-- \/SLOT:voices -->)/;

export function renderVoices(list = VOICES) {
  if (!list.length) return '';
  const figs = list.map((v) => `
      <figure class="voice" lang="${v.lang}" dir="${v.lang === 'ar' ? 'rtl' : 'ltr'}">
        <blockquote><p>${esc(v.quote)}</p></blockquote>
        <figcaption>${v.name ? `<b>${esc(v.name)}</b>, ` : ''}${esc(v.role)} · ${esc(VOICE_CLIENTS[v.client])}</figcaption>
      </figure>`).join('');
  return `
    <div class="voices reveal">
      <h3 class="voices-h" data-i18n="work.voicesH">Ce qu'en disent nos clients</h3>
      <div class="voices-grid">${figs}
      </div>
    </div>
    `;
}

export function applyVoices(html, list = VOICES) {
  if (!RE.test(html)) throw new Error('index.html has no <!-- SLOT:voices --> region');
  return html.replace(RE, `$1${renderVoices(list)}$2`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errs = validate();
  if (errs.length) { console.error('✗ scripts/voices-data.mjs:\n  ' + errs.join('\n  ')); process.exit(1); }
  const file = join(ROOT, 'index.html'), html = readFileSync(file, 'utf8'), want = applyVoices(html);
  if (process.argv.includes('--check')) {
    console.log(html === want ? '✓ voices region matches scripts/voices-data.mjs' : '✗ voices region is stale (run: npm run build)');
    process.exit(html === want ? 0 : 1);
  }
  writeFileSync(file, want);
  console.log(`✓ index.html voices region: ${VOICES.length} voice${VOICES.length === 1 ? '' : 's'}`);
}

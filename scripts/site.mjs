/**
 * The site, described once. Data only — importing this module has no side
 * effects, so every script (check, themes-check, bump, stage, audit, sweep,
 * generators) can share it.
 *
 *  PAGES        HTML entry pages: stamped by bump, checked by check/validate
 *  EXTRA_PAGES  pages that are checked for references but are not entries
 *  DEPLOY       exactly what is published (GitHub Pages, Netlify, Vercel all
 *               build _site/ from this list with scripts/stage-site.mjs)
 *  NOT_DEPLOYED repository folders that must never be published, local tool
 *               state included: .netlify/ (`netlify link`) and .vercel/
 *               (`vercel pull`, which `vercel build` needs) exist where the
 *               mirrors build, so check.mjs must accept them
 */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
/* The canonical host: every canonical, og:url, hreflang, sitemap, robots and
   JSON-LD URL names it. Vercel for now (owner decision 2026-11-10); a custom
   domain replaces it later, and this is the one line to change. */
export const BASE = 'https://numidea-tech.vercel.app/';
/* The GitHub Pages mirror, served under the repository subpath. Never
   canonical: it only decides where the Pages staging roots its 404 links
   (stage-site.mjs --pages) and what the monitor and the audit probe. */
export const PAGES_BASE = 'https://brvetr4ve1er.github.io/Numidea.tech/';
export const LANGS = ['fr', 'en', 'ar'];
export const THEMES = ['arcanum', 'daylight'];

/* the legal page exists only once scripts/build-legal.mjs had every owner
   field; until then nothing may link to it and it is not deployed */
export const LEGAL_PUBLISHED = existsSync(join(ROOT, 'legal/index.html'));

/* the landing page is three static pages, one per language: index.html
   (French, the template) and en/, ar/ written from it by build-lang.mjs;
   the price guide likewise: tarifs/ and en/tarifs/, ar/tarifs/, written by
   build-tarifs.mjs */
export const PAGES = ['index.html', 'en/index.html', 'ar/index.html', 'tarifs/index.html', 'en/tarifs/index.html', 'ar/tarifs/index.html',
  '404.html', 'hub/index.html', 'hub/bible/index.html', 'hub/brand/almaflow/index.html', 'hub/brand/traveler/index.html', 'hub/brand/numidea/index.html', 'hub/brand/exploration/index.html',
  'scene/index.html', 'workspacehq/index.html']
  .concat(LEGAL_PUBLISHED ? ['legal/index.html'] : []);
export const EXTRA_PAGES = ['workspacehq/embed/trailer.html', 'workspacehq/embed/walkthrough.html', 'workspacehq/embed/console.html'];

export const DEPLOY = ['index.html', 'en', 'ar', 'tarifs', '404.html', 'robots.txt', 'sitemap.xml', 'google35d412133786d0cb.html', 'assets', 'scene', 'hub', 'workspacehq']
  .concat(LEGAL_PUBLISHED ? ['legal'] : []);
// file names never published even inside a deployed folder: a folder's own
// notes and the manifest the WorkspaceHQ design-system export ships. Every
// walker (stage, deploy-files, check, build-legal) asks isDeploySkipped(),
// which ignores case: the embed's export spells its notes readme.md
export const DEPLOY_SKIP = ['README.md', '_ds_manifest.json', '.DS_Store'];
export const isDeploySkipped = (name) => DEPLOY_SKIP.some((s) => s.toLowerCase() === String(name).toLowerCase());
export const NOT_DEPLOYED = ['.git', '.github', '.claude', '.tmp', '.netlify', '.vercel', 'node_modules', '_site', 'audit', 'campaign', 'knowledge-base', 'scripts', 'shop',
  'legal-preview', 'legal', 'BRAND.md', 'README.md', 'RELEASE.md', 'IMPROVEMENTS.md', 'LICENSE', 'NOTICE.md', 'OWNER-CONTENT.md', 'package.json', 'package-lock.json',
  'netlify.toml', 'vercel.json', '.gitattributes', '.gitignore', '.nvmrc', '.graphifyignore', 'graphify-out'];

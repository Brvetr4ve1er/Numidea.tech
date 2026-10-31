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
export const BASE = 'https://brvetr4ve1er.github.io/Numidea.tech/';
export const LANGS = ['fr', 'en', 'ar'];
export const THEMES = ['arcanum', 'noir', 'daylight', 'mono', 'altneon', 'engineering'];

/* the legal page exists only once scripts/build-legal.mjs had every owner
   field; until then nothing may link to it and it is not deployed */
export const LEGAL_PUBLISHED = existsSync(join(ROOT, 'legal/index.html'));

/* the landing page is three static pages, one per language: index.html
   (French, the template) and en/, ar/ written from it by build-lang.mjs */
export const PAGES = ['index.html', 'en/index.html', 'ar/index.html', '404.html', 'hub/index.html', 'scene/index.html', 'workspacehq/index.html']
  .concat(LEGAL_PUBLISHED ? ['legal/index.html'] : []);
export const EXTRA_PAGES = ['workspacehq/embed/trailer.html', 'workspacehq/embed/walkthrough.html', 'workspacehq/embed/console.html'];

export const DEPLOY = ['index.html', 'en', 'ar', '404.html', 'robots.txt', 'sitemap.xml', 'assets', 'scene', 'hub', 'workspacehq']
  .concat(LEGAL_PUBLISHED ? ['legal'] : []);
// file names never published even inside a deployed folder: a folder's own
// notes and the manifest the WorkspaceHQ design-system export ships. Every
// walker (stage, deploy-files, check, build-legal) asks isDeploySkipped(),
// which ignores case: the embed's export spells its notes readme.md
export const DEPLOY_SKIP = ['README.md', '_ds_manifest.json', '.DS_Store'];
export const isDeploySkipped = (name) => DEPLOY_SKIP.some((s) => s.toLowerCase() === String(name).toLowerCase());
export const NOT_DEPLOYED = ['.git', '.github', '.claude', '.tmp', '.netlify', '.vercel', 'node_modules', '_site', 'audit', 'campaign', 'knowledge-base', 'scripts',
  'legal-preview', 'legal', 'BRAND.md', 'README.md', 'RELEASE.md', 'IMPROVEMENTS.md', 'LICENSE', 'NOTICE.md', 'OWNER-CONTENT.md', 'package.json', 'package-lock.json',
  'netlify.toml', 'vercel.json', '.gitattributes', '.gitignore', '.nvmrc', '.graphifyignore', 'graphify-out'];

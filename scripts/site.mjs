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
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
/* The canonical host: every canonical, og:url, hreflang, sitemap, robots and
   JSON-LD URL names it. The studio's own domain since 2026-11-16 (owner
   decision; the Vercel address, https://numidea-tech.vercel.app/, was the
   canonical from 2026-11-10 and redirects here since 2026-11-18). This is
   the one line to change. */
export const BASE = 'https://www.numedialab.dev/';
/* The GitHub Pages mirror, served under the repository subpath. Never
   canonical: it only decides where the Pages staging roots its 404 links
   (stage-site.mjs --pages) and what the monitor and the audit probe. */
export const PAGES_BASE = 'https://brvetr4ve1er.github.io/Numidea.tech/';
export const LANGS = ['fr', 'en', 'ar'];
export const THEMES = ['arcanum', 'daylight'];

/* the legal page exists only once scripts/build-legal.mjs had every owner
   field; until then nothing may link to it and it is not deployed */
export const LEGAL_PUBLISHED = existsSync(join(ROOT, 'legal/index.html'));

/* La Librairie Lanterne (hub/lanterne/, 2026-11-21): the shelf and one page per atlas, written by build-hub.mjs
   (scripts/lib/lanterne.mjs). An atlas is a page once its data file exists (hub/src/lanterne/atlases/<slug>.json) and
   its book is on the shelf (hub/src/lanterne/shelf.json); the second web3 volume (the nine modules, web3-modules) is a
   book of its own there since 2026-11-22 (owner decision: publish it), shown on the web3 card as its second volume.
   hub/manuel.html stays an entry: the old manual's address, now a forwarding stub (noindex). */
const LANT_SRC = join(ROOT, 'hub/src/lanterne');
export const LANTERNE_ATLASES = (() => { try { return JSON.parse(readFileSync(join(LANT_SRC, 'shelf.json'), 'utf8')).shelves.flatMap((s) => s.books.map((b) => b.slug)).filter((slug) => existsSync(join(LANT_SRC, 'atlases', slug + '.json'))); } catch (e) { return []; } })();
/* « La boîte à outils » (2026-11-22): the Librairie's tools page, built from hub/src/lanterne/apps.json once it exists */
export const LANTERNE_TOOLS = existsSync(join(LANT_SRC, 'apps.json')) ? ['hub/lanterne/outils.html'] : [];
/* « Les enquêtes de nuit » (2026-11-23): the night stall as a game, built from hub/src/lanterne/enquetes.json once it exists */
export const LANTERNE_GAMES = existsSync(join(LANT_SRC, 'enquetes.json')) ? ['hub/lanterne/enquetes.html'] : [];
/* Kūro's episode « Le dernier départ » (2026-11-27): a Librairie page once its episode file exists (scripts/lib/kuro.mjs) */
export const LANTERNE_EPISODES = existsSync(join(ROOT, 'hub/kuro/ep01-dernier-depart.json')) ? ['hub/lanterne/kuro.html'] : [];
export const LANTERNE_PAGES = ['hub/lanterne/index.html', ...LANTERNE_ATLASES.map((s) => `hub/lanterne/${s}.html`), ...LANTERNE_TOOLS, ...LANTERNE_GAMES, ...LANTERNE_EPISODES];

/* the landing page is three static pages, one per language: index.html
   (French, the template) and en/, ar/ written from it by build-lang.mjs;
   the price guide likewise: tarifs/ and en/tarifs/, ar/tarifs/, written by
   build-tarifs.mjs */
export const PAGES = ['index.html', 'en/index.html', 'ar/index.html', 'tarifs/index.html', 'en/tarifs/index.html', 'ar/tarifs/index.html',
  '404.html', 'hub/index.html', 'hub/manuel.html', ...LANTERNE_PAGES, 'hub/monde.html', 'hub/fabrique.html', 'hub/bible/index.html', 'hub/brand/almaflow/index.html', 'hub/brand/alliance/index.html', 'hub/brand/traveler/index.html', 'hub/brand/numidea/index.html', 'hub/brand/exploration/index.html',
  'scene/index.html', 'workspacehq/index.html', 'comptoir/index.html']
  .concat(LEGAL_PUBLISHED ? ['legal/index.html'] : []);
export const EXTRA_PAGES = ['workspacehq/embed/trailer.html', 'workspacehq/embed/walkthrough.html', 'workspacehq/embed/console.html'];

export const DEPLOY = ['index.html', 'en', 'ar', 'tarifs', 'comptoir', '404.html', 'robots.txt', 'sitemap.xml', 'google35d412133786d0cb.html', 'assets', 'scene', 'hub', 'workspacehq']
  .concat(LEGAL_PUBLISHED ? ['legal'] : []);
// file names never published even inside a deployed folder: a folder's own
// notes and the manifest the WorkspaceHQ design-system export ships. Every
// walker (stage, deploy-files, check, build-legal) asks isDeploySkipped(),
// which ignores case: the embed's export spells its notes readme.md
export const DEPLOY_SKIP = ['README.md', '_ds_manifest.json', '.DS_Store'];
export const isDeploySkipped = (name) => DEPLOY_SKIP.some((s) => s.toLowerCase() === String(name).toLowerCase());
export const NOT_DEPLOYED = ['.git', '.github', '.claude', '.tmp', '.netlify', '.vercel', 'node_modules', '_site', 'audit',
  // what is left of the second volume's holding folder (« Le web3, sans fumée », the nine modules): published since 2026-11-22 as
  // hub/lanterne/web3-modules.html, its labs (hub/web3x.js), art and strings moved back; only the verbatim cut (chapters.html) and its README stay
  'lanterne-later', 'campaign', 'knowledge-base', 'scripts', 'shop', 'social',
  'legal-preview', 'legal', 'BRAND.md', 'README.md', 'RELEASE.md', 'IMPROVEMENTS.md', 'LICENSE', 'NOTICE.md', 'OWNER-CONTENT.md', 'package.json', 'package-lock.json',
  // api/: Vercel serverless functions (api/yasser.js, the bible's « talk to him »), built by Vercel from the repo root, never copied to _site
  'api',
  'netlify.toml', 'vercel.json', '.gitattributes', '.gitignore', '.nvmrc', '.graphifyignore', 'graphify-out'];

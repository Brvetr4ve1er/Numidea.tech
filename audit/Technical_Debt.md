# Technical Debt Register

Ranked. "Accepted" = documented cost, cheaper than its cure — do not "fix" casually.

## High

**D-01 · Conventions are enforced by discipline, not tooling.**
The two invariants that break silently (i18n key ×3 balance; orphan `data-i18n`
refs) were checked by ad-hoc one-liners each session. → Cured in this audit:
`npm run check` (`scripts/check.mjs`) now validates both, plus asset existence
and stale `?v=` stamps. Run before every commit; wire into CI later if wanted.

**D-02 · Project data is quadruplicated.**
The same 7 projects live in: `index.html` static cards (needed — SEO/no-JS),
`assets/app.js` `PROJECTS[]` (explorer), `scene/app.js` `SHEETS[]` (drawings),
`scripts/shots.mjs` `PROJECTS{}` (capture). URLs/accents verified in sync today,
but every project change is a 4-file edit. **Accepted for now** (each consumer
needs a different shape; a shared JSON would reintroduce a fetch/build step).
Mitigation: the sync checklist lives in `Architecture.md`; `npm run check`
verifies URL agreement across the three JS sources.

## Medium

**D-03 · Manual cache-bust stamps.** Every content change requires bumping
`?v=` in 4 HTML files; forgetting one re-creates the "THE WEBSITE DIDN'T
UPDATE" class of bug. → Cured: `npm run bump` rewrites all stamps atomically.

**D-04 · `package-lock.json` is committed *and* gitignored.** The ignore line is
dead (file already tracked) and misleads contributors. → Fixed: line removed;
lockfile stays committed for reproducible `npm install`.

**D-05 · README structure drift.** The repo-layout block predates `hub/`,
`scene/`, `scripts/`, `knowledge-base/`, `vercel.json`. → Fixed in this pass.

## Low / accepted

**D-06 · `hub/style.css` carries an RTL rule for a page that's EN-only** and the
main stylesheet keeps a documented "premium pass" additive layer that overrides
some earlier declarations (`body::before` defined twice by design). Both are
intentional layering, cheap, and self-documented — leave.

**D-07 · Decorative hero terminal metrics** (`99.9% · 38ms · 100`) and
`numidealabs.com` — content debt, not code debt; owner call (Findings F-09).

**D-08 · No test suite.** For a static site of this size, the browser audit
script + `npm run check` is the right-sized substitute; a Playwright test rig
would cost more than it protects. Revisit only if interactive surface grows
(e.g. real backend forms, checkout).

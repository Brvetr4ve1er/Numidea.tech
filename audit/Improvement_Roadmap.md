> **Historical snapshot (2026-07-31).** Not deployed. Where this file disagrees with README.md, BRAND.md or the code, those win. Current owner to-dos live in OWNER-CONTENT.md.

# Improvement Roadmap

## Applied in this audit pass (bug fixes covered by standing directives)

Your standing rules — "no bugs or visual hiccups allowed", "all deployments are
on Netlify", "add the real links to the hub" — pre-approve these:

| # | Fix | Finding |
| --- | --- | --- |
| 1 | Tokenize hero lede / founder bio / art-cover colors → Daylight theme readable everywhere | F-01/02/03 |
| 2 | `almaflowclim.fr` → `almaflowclim.netlify.app` in the services proof line (fr/en/ar) | F-04 |
| 3 | Hub footer: wire the 20 dead `#` links to the verified URLs, pending-disable the rest, remove Read.cv | F-05 |
| 4 | Mobile menu: stagger delay for the 6th link | F-06 |
| 5 | 404 page: host-aware asset/home paths (works at any depth, on Pages and Vercel) | F-07 |
| 6 | Real Open Graph card: 1200×630 PNG + absolute `og:url`/`og:image` + dimensions | F-08 |
| 7 | Scene: arrow keys mirror in RTL | F-10 |
| 8 | `npm run check` (i18n balance, orphans, assets, stamp freshness, URL sync) + `npm run bump` (atomic cache-bust) | D-01/03 |
| 9 | `.gitignore` lockfile line removed; README structure updated | D-04/05 |

[2026-10: fix 6's PNG has since been replaced by `assets/og.jpg`, rendered by
`scripts/build-og.mjs` (`og.svg`/`og.png` removed).]

## Needs your decision (nothing done)

1. **S-01 — knowledge-base is public** (repo + deployed site). Exclude from the
   Pages artifact / move to a private repo / accept knowingly. *Recommended:
   private repo — its own README frames it as internal.*
   [2026-10: resolved — `knowledge-base/`, `audit/` and `scripts/` are never deployed;
   only the `scripts/site.mjs` DEPLOY paths are published.]
2. **F-09 — decorative claims**: `numidealabs.com`, `99.9% uptime · 38ms · 100
   Lighthouse` in the hero terminal. Keep, soften, or replace with the real URL.
   [2026-10: the hero deploy terminal has been removed.]
3. **Hosting**: finish the Vercel import (dashboard → Import Project → this repo,
   production branch `claude/numidea-labs-landing-c4jokc`, framework "Other", no
   build command, output `./`). Unlocks cache headers, security headers, CSP.
   [2026-10: GitHub Pages is canonical; Netlify and Vercel are mirrors that build
   `_site/` with `scripts/stage-site.mjs`.]
4. **Supabase leads**: still blocked on deleting the paused `FELINEKKI` project
   in your dashboard (Settings → General → Delete project); then I create
   `numidea-labs-leads`, apply the insert-only RLS schema, and fill the two
   config constants in `index.html`.
   [2026-10: the contact form hands off by `mailto:` with the lead source attached;
   nothing is stored.]

## Later (worth it, not urgent)

- **Focus trap for the mobile overlay menu** (F-11) and arrow-key navigation in
  the theme menu (A-03) — finish the a11y story the modal already sets.
- **Lazy-load the Arabic font family** on first switch to AR (P-01) — saves
  ~90 KB for the LTR majority.
- **Organization/LocalBusiness JSON-LD** alongside the existing FAQ schema —
  name, area served, languages, founder — cheap local-SEO win once the final
  domain exists.
- **Case-study `story` content**: the explorer supports per-project
  problem/approach/outcome in three languages; only the scaffolding exists.
  Filling Bordj Steel + Alliance Travel first would make the two strongest
  references actually sell.
  [2026-10: the explorer is gone; project sheets are generated in `scene/` by
  `scripts/build-scene.mjs` from `scripts/scene-data.mjs`.]
- **Doctor Cherfia / Étoile de l'Est**: when they ship, one URL in
  `scripts/shots.mjs`, `npm run shots`, swap the card cover — the pipeline and
  the honest-status idiom are already built for it.
  [2026-10: delivered client sites are Bordj Steel, Alliance Travel, AlmaFlowClim and
  Nomara Voyages; Glaive Store is a portfolio demo (never a client) and WorkspaceHQ is
  the studio's own product.]
- **Branch rename** `claude/…` → `main` (cosmetic; must update pages.yml +
  Pages settings + Vercel in one change).

## Explicitly not recommended

- Framework/bundler migration, CSS/JS minification, test suite (see D-08),
  splitting the stylesheets — each costs the zero-build property and buys
  nothing measurable at this scale.

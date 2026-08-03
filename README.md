# Numidea Labs

**Rooted in Numidia, built on ideas.**

A development studio out of **Bordj Bou Arréridj, Algeria** that designs, builds,
ships and maintains digital products — and answers when they break. No middlemen
between you and the people typing the code.

> We build the software your business has been *waiting* for.

---

## What we build

| Offer | The promise |
| --- | --- |
| **Sites & applications** | Bespoke websites and web apps — fast, ranked, conversion-built, front-end to cloud. |
| **Automation & data** | Scrapers, lead pipelines, market-intelligence systems, internal tools, integrations. |
| **Brand & design systems** | Logos, visual identity, design systems, motion — the full kit. |
| **Strategy & consulting** | Market audits, funnel analysis, competitive intelligence, growth roadmaps. |
| **The Preview** *(signature)* | A real, working demo of your project — up front, before you pay for it. |

## How we work

1. **You talk to the builder.** Whoever scopes it, ships it.
2. **One team owns the whole chain.** Design → code → deploy.
3. **We answer when it breaks.** Deadlines kept, replies in under 24h.

---

## This repository — the landing page

The marketing site is a **zero-dependency static build**: hand-written HTML, CSS
and vanilla JavaScript, no framework, no build step. Open `index.html` and it runs.

```
index.html            # the landing page
404.html              # designed not-found page (host-aware paths)
assets/
  styles.css          # design tokens (Arcanum + 4 alt themes) + layout
  app.js              # i18n, nav, count-ups, reveal, project explorer, form
  previews/*.webp     # committed screenshots of the live client sites
  favicon.svg         # gradient signature mark
  og.svg / og.png     # social share image (SVG source → rasterized PNG)
  cv_*.pdf            # founder résumé (linked from the founder section)
hub/                  # VOIDSPLUNKER.std — personal portfolio subsite (own CSS/JS)
scene/                # "engineering drawing" project showcase (own CSS/JS)
scripts/
  shots.mjs           # capture live-site screenshots  → npm run shots
  check.mjs           # repo invariant checks          → npm run check
  bump.mjs            # bump all ?v= cache stamps      → npm run bump
knowledge-base/       # internal institutional memory (markdown)
audit/                # full codebase audit — start at Executive_Summary.md
vercel.json           # Vercel-ready hosting config (headers, clean URLs)
.github/workflows/
  pages.yml           # auto-deploys the site to GitHub Pages on push
```

## A/B/C deployments

One codebase, three hosts, three variants — detected at runtime from the
hostname (override with `?variant=b` or `window.NUMIDEA_VARIANT`):

| Variant | Host | Hypothesis under test | What differs |
| --- | --- | --- | --- |
| **a** | GitHub Pages | control | Proof-first atelier, dark Arcanum |
| **b** | Vercel | a clean, conventional surface reads as more trustworthy to local businesses | Daylight default + decoration stripped (no grain/honeycomb/mesh, flat cards, crisp corners) + plain-spoken hero |
| **c** | Netlify | a concrete risk-free offer converts better than a craft narrative | Offer-first hero ("built before you pay") + the signature Preview offer promoted above the fold |

The variant is resolved **before first paint** by an inline script in
`index.html` (so B never flashes dark), then read back by `app.js`.
Variant-only markup lives in the HTML behind `[data-variant-only]`, so it
works with JS disabled and needs no DOM injection. Per-variant copy is
supplied as whole fr/en/ar sets in the `COPY` map.

Every contact-form handoff carries `variant` in the mailto body, so leads
stay attributable with no backend at all. Config: `vercel.json` and
`netlify.toml` mirror each other (no build, security headers, immutable
assets).

**Before committing:** `npm run check` validates the i18n dictionary (every key
×3), asset references, cache-stamp uniformity and project-URL sync. After any
CSS/JS change, `npm run bump` refreshes the cache-bust stamps on every page.

### Live preview (GitHub Pages)

Every push to the working branch auto-publishes to GitHub Pages via
`.github/workflows/pages.yml`. The live URL:

```
https://brvetr4ve1er.github.io/Numidea.tech/
```

One-time setup (required once — the workflow's token cannot enable Pages
itself): repo **Settings → Pages → Build and deployment → Source:
GitHub Actions**. After that, the URL refreshes ~1 minute after each push.

### Run it locally

```bash
# any static server works — pick one
python3 -m http.server 8000
#   or
npx serve .
```

Then open <http://localhost:8000>. (Opening `index.html` directly works too,
but a server is recommended so fonts and relative paths resolve cleanly.)

### Design system — Arcanum (+ 4 alt themes)

- **Color:** one tokenised palette that reskins per theme. **Arcanum** ships
  applied by default — arcane-blue space (`--void` `#0A1420`) with brass-gold as
  the flourish (`--crimson` `#E6B450`) and electric teal as rationed neon
  (`--teal` `#34D0E8`). Four more ship in the switcher: Neon Noir, Daylight,
  Monochrome, Alt-neon. Every rule reads `var(--token)`, so a theme is a swap.
- **Type:** Geist for display/body, Geist Mono for data, Cinzel /
  Cinzel Decorative for the engraved-Deco flourishes, IBM Plex Sans Arabic for
  the RTL experience.
- **Rule:** gradients are *light* (glows, beds, duotone), never chrome. One flourish
  per screen, then discipline.

### Features

- **Trilingual** — French (default), English, Arabic — with a natively **mirrored
  RTL** experience, not a translated afterthought.
- **Accessible** — skip link, visible teal focus rings, full keyboard tab order,
  semantic landmarks, `prefers-reduced-motion` honored on every animation.
- **Crafted states** — designed form validation in the interface's voice, a
  success state, count-up stats, scroll-reveal, glass navbar with a crimson
  scroll-progress line.
- **Custom favicon + OG share image** built from the gradient signature.

---

## Project previews

Each project card shows a **committed screenshot** of the live site
(`assets/previews/<slug>.webp`, ~10 KB each). Projects that aren't live yet
fall back automatically to an **Arcanum abstract cover** (inline SVG, brass +
arcane-blue) — so a card is never broken or empty.

To (re)generate screenshots as sites ship or change:

```bash
npm install
npx playwright install chromium   # one-time browser download
npm run shots                     # capture all live URLs
npm run shots -- almaflowclim     # or a single project
```

Live URLs live in the `PROJECTS` map at the top of
[`scripts/shots.mjs`](scripts/shots.mjs). When a site goes live, set its URL
there (and swap that card's `.thumb--art` cover for an `<img class="shot">` in
`index.html`), run `npm run shots`, and commit the new `.webp`. Captures are
taken at 1280×800 (16:10), retina, then optimised to WebP. `node_modules` is
git-ignored — only the lightweight `.webp` outputs are committed.

---

## Contact

**hello@numidealabs.com** · Bordj Bou Arréridj, DZ · response in under 24h
(in French, English, or Arabic).

---

*Built in Bordj Bou Arréridj, with black coffee and TypeScript.*

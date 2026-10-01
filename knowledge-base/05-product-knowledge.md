---
domain: 05 — Product Knowledge
status: rich
owner: Design & development lead (N) + Data Specialist (D)
last_updated: 2026-06-22
sources: [index.html, assets/app.js (i18n + EXTRA), README.md, scripts/shots.mjs]
tags: [services, products, projects, portfolio, tech-stack, architecture]
---

# Domain 5 — Product Knowledge

Numidea Labs sells **services** (productized into a catalog), not a SaaS product.
The "product portfolio" is the **service catalog** + the **client project portfolio**.

## KB-05-001 · Service catalog — three families

### Family I — **The Build** ("What you open, click, and buy through")
| Code | Service | Promise | Stack / proof |
| --- | --- | --- | --- |
| f1 ★ | **Sites & web apps** (flagship) | "The obvious choice." | React · Next.js · Vite · Tailwind · Vercel. Proof: Doctor Cherfia, almaflowclim, Étoile de l'Est |
| f2 | **Identity & visual systems** | "Trust before the first word." | Logos, color, type, motion, full design-system kit |
| c1 | Store & booking (capability) | "From visit to checkout." | WhatsApp pay, cash flows, headless Shopify |
| c2 | Graphic & social design (capability) | "You scroll, you stop." | Social packs, carousels, infographics, print |

### Family II — **The Engine** ("Your moat — the machinery almost no local studio builds")
| Code | Service | Promise | Stack / proof |
| --- | --- | --- | --- |
| f3 ★ | **Automation & pipelines** (flagship) | "Kill the grind." | Python · Playwright · APIs · Claude. Proof: Playwright→Claude pipeline (scrape → FR/AR enrich → demo-gen → per-company ZIP) |
| f4 ★ | **Market & product intelligence** (flagship) | "See the market clearly." | Scrape Maps/Facebook/Ouedkniss/Jumia/Instagram → structured, scored, queryable. Stat: 54 leads enriched |
| c3 | Data science & analytics (capability) | "Signal in the noise." | Econometric modeling, time-series, forecasting, dashboards |

### Family III — **The Mind** ("Strategy, systems, and tools that compound")
| Code | Service | Promise | Stack / proof |
| --- | --- | --- | --- |
| f5 ★ | **Strategy & growth consulting** (flagship) | "Data, not vibes." | Market audits, funnel analysis, positioning, roadmaps. Stat: 544,634 requests analyzed; 35% refusal rate (Schengen) |
| c4 | Knowledge systems (capability) | "A company that remembers." | Obsidian/PARA + Zettelkasten, RAG-ready bases |
| c5 | Custom AI tools & skills (capability) | "The software that builds your software." | Claude-powered internal tools/generators |

`confidence: verified` (from the live services section + i18n dictionary).

---

## KB-05-002 · Signature offer — **"The Preview" (L'Aperçu)**

- **What:** A real, working demo of the client's project, **built up front, before
  payment**. The client sees it live in the meeting, then decides.
- **Promise:** "Zero risk. Just the proof."
- **Importance:** This is the company's core sales mechanism and primary
  differentiator — it converts the brand's "proof over promises" value into a
  concrete funnel step. It is powered by the Family II automation pipeline
  (demo-generation at scale).
- **Risk:** Unpaid pre-work; only viable because automation drives the cost of a demo
  toward zero. If the pipeline breaks or demand scales, the unit economics need
  watching (see Domain 10 / 14). `confidence: verified` (offer) / `inferred` (econ).

---

## KB-05-003 · Client project portfolio

| # | Project | Sector / type | Domain | Live? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Doctor Cherfia Clinic** | Healthcare · Next.js | doctorcherfia.dz | ❌ Soon | Booking-ready clinic platform |
| 2 | **Alliance Travel** | Travel · Growth | alliance-travel.dz | ❌ Soon | Brand + funnel + Schengen-visa market strategy (BBA agency) |
| 3 | **almaflowclim.fr** | Industrial · Web | almaflowclim.fr | ✅ **Live** | Static site engineered to convert quote requests. *Only confirmed-live project (HTTP 200).* |
| 4 | **Hamma Sat IPTV** | Streaming · Commerce | hammasat.tv | ❌ Soon | Streaming storefront w/ WhatsApp checkout, Algerian buyer |
| 5 | **Étoile de l'Est** | PWA · Supabase | etoile-est.app | ❌ Soon | Offline-first progressive web app |

> 🔴 GAP: Client contacts, contract values, project dates, outcomes/metrics, and
> testimonials are undocumented. The "projects shipped" proof-stat count is not
> pinned to a number in the artifacts.

`confidence: verified` for names/sectors/live-status; `unknown` for commercials.

---

## KB-05-004 · Technical architecture & stack

**Declared stack (from the Stack section):**
- **Front:** React, Next.js, Vite, TypeScript, Tailwind
- **Back:** Node, Python, FastAPI, PostgreSQL
- **Cloud:** Vercel, Docker, Cloudflare, GitHub Actions
- **Data:** Playwright, Pandas, Supabase, REST/APIs
- **Mobile:** PWA, React Native, Expo
- **AI:** Claude (Anthropic) for automation/intelligence/tooling

**The landing page itself** (this repo) is a deliberate **zero-dependency static
build**: hand-written HTML/CSS/vanilla JS, no framework, no build step. Auto-deploys
to GitHub Pages via `.github/workflows/pages.yml` on push. Screenshot tooling
(`scripts/shots.mjs`) uses Playwright + sharp, dev-only (`node_modules` git-ignored).

---

## KB-05-005 · Product/feature history (this repo)

See Domain 13 for full decision context. Feature evolution of the site:
i18n trilingual + RTL → accessibility pass → Neon Noir design system → **type system
swap (Geist)** → **multi-theme switcher** → **Arcanum rebrand** → **brand-voice
rewrite** → **committed project-preview system** → **service-glyph redesign +
per-service micro-animations**.

## KB-05-006 · Roadmap (open items, from session)

- Capture real screenshots for the 4 not-live projects as they ship.
- Source real team photos (replace initials).
- WCAG AA contrast audit on the Arcanum brass-on-navy palette.
- **Wire the contact form to actually deliver leads** (currently a front-end demo —
  see Domain 7 / 14, this is the highest-priority functional gap).

> 🔴 GAP: No formal product roadmap or prioritization framework exists.

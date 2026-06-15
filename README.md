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
index.html            # the page
assets/
  styles.css          # design tokens (Neon Noir v2) + layout
  app.js              # i18n, nav, count-ups, reveal-on-scroll, form states
  favicon.svg         # gradient signature mark
  og.svg              # social share image
```

### Run it locally

```bash
# any static server works — pick one
python3 -m http.server 8000
#   or
npx serve .
```

Then open <http://localhost:8000>. (Opening `index.html` directly works too,
but a server is recommended so fonts and relative paths resolve cleanly.)

### Design system — Neon Noir v2

- **Color:** deep navy/maroon space (`--void` `#0D1A2F`), crimson for the shout
  (`--crimson` `#BD0927`), teal as rationed neon (`--teal` `#09D8C7`).
- **Type:** Bodoni Moda + Cormorant italic do the shouting; Space Grotesk for body,
  Space Mono for data; Aref Ruqaa + IBM Plex Arabic for the RTL experience.
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

## Contact

**hello@numidealabs.com** · Bordj Bou Arréridj, DZ · response in under 24h
(in French, English, or Arabic).

---

*Built in Bordj Bou Arréridj, with black coffee and TypeScript.*

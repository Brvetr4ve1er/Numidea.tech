# Findings — bugs, defects & inconsistencies

*Every finding verified against the code at commit `a9fd6da`; nothing speculative.*
Severity: **P1** breaks a user-visible promise · **P2** visible flaw in a real path ·
**P3** cosmetic/latent.

## P1

### F-01 · Daylight theme: hero lede is near-invisible
`assets/styles.css:266` — `.lede{…color:#CCD7DE…}` is a **hard-coded light gray**,
not a token. On the light Daylight theme (`--void:#F4F6F9`) the hero paragraph
renders light-gray-on-light — measured contrast ≈ 1.3:1 (WCAG minimum is 4.5:1).
**Fix:** tokenize (`color:var(--body-strong)` defined per theme, or reuse `--ice`
at reduced opacity via `color-mix`).

### F-02 · Daylight theme: founder bio references a token that doesn't exist
`assets/styles.css:410` — `.fd-bio{color:var(--body,#C7D5E2)}`. No `--body` token
is defined anywhere in the codebase, so the fallback `#C7D5E2` (light gray)
always wins → unreadable on Daylight. **Fix:** same tokenization as F-01.

### F-03 · Daylight theme: "soon" project covers are white-on-white
`.proj .thumb--art` backgrounds use `var(--grad-noir)` (white-ish in Daylight)
while `.thumb--art .cover` (styles.css:358) and `.detail-art .cover` (:714) use
hard-coded near-white `rgba(234,242,244,…)` text. The two not-yet-live cards
(Doctor Cherfia, Étoile de l'Est) show invisible titles in Daylight, in both the
work grid and the explorer detail view. **Fix:** `color:var(--ice)` (flips to
dark ink in Daylight) + tokenized text-shadow.

### F-04 · Services proof line still says `almaflowclim.fr`
`assets/app.js` — `'f1.proof'` in **all three languages** cites
`almaflowclim.fr`, a domain that does not exist. You corrected this earlier
(all deployments are Netlify; the work grid, explorer, scene and shots pipeline
all correctly use `almaflowclim.netlify.app`). This line is the last leftover.
**Fix:** replace with the real reference in fr/en/ar.

## P2

### F-05 · Hub footer: 20 dead `href="#"` links + a removed service still listed
`hub/index.html` footer nav & social row — Behance/Dribbble/GitHub/LinkedIn/… all
point at `#` (jump-to-top; looks broken on click), while the **real, verified
URLs already exist 60 lines up** in the archive grid. The footer also still
lists **Read.cv**, which was removed from the grid because the service is dead.
**Fix:** wire footer links to the same verified URLs; render unverified ones with
the same `data-pending` disabled idiom as the grid; drop Read.cv.

### F-06 · Mobile menu stagger skips the 6th link
`styles.css:242-246` defines `nth-of-type(1)…(5)` animation delays, but the menu
has **6 links** (FAQ was added later). "Contact" gets no delay and pops in
before the others. **Fix:** add the `(6)` rule and shift the `.lang` delay.

### F-07 · 404 page breaks for nested paths
GitHub Pages serves `404.html` for *any* missing URL, including nested ones
(`/Numidea.tech/foo/bar`). Its `href="assets/…"`, `href="index.html"` references
are **relative**, so for nested misses the stylesheet, favicon and both links
resolve to the wrong path → unstyled page, broken "back home". **Fix:** absolute
paths are host-dependent (Pages serves under `/Numidea.tech/`, Vercel under `/`);
the robust static fix is a tiny inline `<script>` that rewrites the two `href`s
off `location.pathname`, or inlining the small amount of CSS the page needs and
using a JS-computed home link.

### F-08 · Open Graph image will not render on social platforms
`index.html` — `og:image` is (a) a **relative** URL, which the OG protocol does
not allow (scrapers resolve nothing), and (b) an **SVG**, which Facebook,
LinkedIn and X all refuse for preview images. Sharing the site currently
produces a text-only card. **Fix:** export a 1200×630 PNG/WebP of the OG art,
reference it with an absolute URL, add `og:url` + `og:image:width/height`.
(Needs the final production hostname — decide Vercel vs Pages first.)

## P3

### F-09 · Hero terminal claims `deploy → numidealabs.com`
The domain isn't registered/live. It's a decorative prop, but the site's whole
positioning is "honest statuses". Consider the real Pages/Vercel URL, or buy the
domain. Same section shows `99.9% uptime · 38ms TTFB · 100 Lighthouse` —
unverifiable-as-stated; keep only if you're comfortable defending them.

### F-10 · Scene page arrow keys ignore RTL
`scene/app.js:229` — `ArrowRight` always advances. In Arabic (RTL) the spatial
metaphor is reversed; `ArrowLeft` should advance. One-line swap keyed off `dir`.

### F-11 · Mobile overlay menu lacks a focus trap
The portfolio modal traps focus correctly; the full-screen mobile menu does not
(Tab can reach content behind the overlay). Low impact (mobile + keyboard is a
narrow intersection) but inconsistent with the modal's standard.

### F-12 · `hub/` has no `og:image` and hard-codes `EST — MMXXV` / tape "created in 2025"
Fine if intentional (archival flavour); listed so it's a decision, not an oversight.

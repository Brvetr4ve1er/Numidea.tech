# Numidea Labs — Engineering Surface

> **Cool near-black. Technical sans. Monospace as texture. Real artifacts.**

Register: Linear · Vercel · Resend · Raycast. Not a magazine, not signage —
a tool that happens to be well made.

---

## 1 · Why this and not the last two

Two earlier directions were built and rejected, and both failures were
informative:

| Direction | Why it failed |
| --- | --- |
| **Industrial signage** — screaming orange field, 45% coverage, uppercase | Loud, not beautiful. Orange at field scale reads cheap on screen. |
| **Editorial serif** — Instrument Serif on warm cream, huge whitespace | Beautiful, wrong category. Serif + warm paper is the uniform of specialty coffee and skincare — it read as a food brand, not a software studio. |

The category signal for a developer studio is not typography restraint. It's
**cool near-black, a technical sans, monospace used as texture, and real
build artifacts on the page.**

## 2 · Colour

```
midnight (default)   bg #08090A   panel #0E1011   edge #1D2023
graphite             bg #111315   panel #181A1D   edge #282C30
daylight             bg #FBFBFC   panel #FFFFFF   edge #E3E5E9

accent  #F93E06   the studio orange, carried through every rebuild
ok      #3ECF8E   functional only — live status dots and badges
```

Cool greys, not warm. The accent appears on the primary button, the headline's
last clause, the kicker square, and live-status marks — nowhere else.

## 3 · Type

| Role | Face |
| --- | --- |
| Interface & headings | **Geist** 400/500/600, tight tracking (−.028em on headings) |
| Code, labels, data | **Geist Mono** 400/500 — domains, statuses, figures, versions, terminal |
| RTL | **IBM Plex Sans Arabic**, tracking reset to 0 |

Monospace is not decoration here — it marks the things a developer would
actually read as data: domains, durations, counts, build indices.

## 4 · The artifacts

**The terminal** in the hero is the real deploy sequence for this repository —
checkout, configure-pages, upload-artifact, deploy, 18s, live. It replaces the
fake terminal removed earlier (which showed a domain that does not exist).

**Project cards** carry the real domain in a browser chrome bar, a build index
(`03/07`), and an honest status pill — green *Live* or a plain *Bientôt* for
the two that have not shipped.

**The grid** behind the page is a 64px engineering grid, masked so it fades
before the fold.

## 5 · Construction

```
Grid     max 1200 · gutter clamp(20 → 40)
Space    8 / 16 / 24 / 32 / 48 / 72 / 112 / 160
Radius   6 / 10 / 16
Borders  1px, always var(--edge)
Motion   180ms interface, 450ms reveal, 10px rise. no bounce.
```

## 6 · Measured

| Check | Result |
| --- | --- |
| Body contrast (midnight / graphite / daylight) | 17.3 / 16.6 / 18.7 : 1 |
| Lede | 7.8 / 8.4 / 6.8 : 1 |
| Card copy on panel | 7.5 / 7.9 / 7.0 : 1 |
| Horizontal overflow, 1440 / 390 | none |
| Project images loaded | 5 / 5 |
| JS errors | none |

## 7 · The logo

Swap point in `index.html`:

```html
<a class="logo" href="#top">
  <!-- SWAP POINT: replace .brick with the delivered mark -->
  <span class="brick">N</span>numidea<i>labs</i>
</a>
```

Interim mark is an accent square with `N`. Replace `.brick` with an inline
`<svg>`; the lockup, gap and dark/light inversion already work.

## 8 · Open

- **The logo** — you're drawing it.
- **Founder portrait** — still a monogram placeholder.
- **Case-study depth** — the explorer supports per-project
  problem/approach/outcome in three languages; only scaffolding exists.

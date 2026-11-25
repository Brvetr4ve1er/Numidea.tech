# The owner's standing rules and art direction

Collected from project memory and thread decisions, 2026-11-24 to 2026-11-26. Owner: Br4ve (GitHub `Brvetr4ve1er`), who is also Yasser, the founder.

## Process

1. **This Claude project does not publish** (2026-11-26). The separate publishing session does all merging to the trunk, deploys, branch deletions and settings.
2. **One trunk:** `claude/numidea-labs-landing-c4jokc`. Every change goes in by PR to it. `main` is a retired old ancestor (last touched 2026-10-07): never target it. `master` is an unrelated July 2025 Next.js prototype.
3. **Publish path:** Vercel preview of the trunk, then `npm run verify` (11 gates), then publish that exact deployment, with the owner's explicit go. Never publish from a side or release branch.
4. **Long runs** (full verify, builds over 10 min) run in the cloud right away (owner chose this 2026-11-24, re-ask after 2026-12-24).
5. **Credits:** zero Magnific credits (about 237 left). Stock via Magnific is not free either (40 per item). Build assets in code instead. Reading or importing existing creations is fine.
6. **Secrets:** never handle API keys. The owner adds them in Vercel.
7. **Feedback style:** blunt and prioritized. Say what's weak. Don't claim something looks right without rendering it (a board shipped unrendered once and the owner caught it).

## Content

- Copy is **French-first**, with EN and AR (RTL). Arabic needs a native reader before it's treated as final.
- **Clients:** Nomara Voyages stays listed. Alliance Travel → https://alliancetravel.app/ (live). Bordj Steel, AlmaFlowClim, Nomara keep their netlify.app links until the owner gives new domains (old guesses bordj-steel.com, alliance-travel.dz, nomaravoyages.com were NXDOMAIN; almaflowclim.fr is someone else). Glaive Store is the studio's own demo.
- Don't name the image tool or model under `hub/` (check.mjs enforces it).

## Characters

- **Yasser** appears only as artwork or animation, never a photo. Canon: deep brown skin, black hair worn loose or tied up (locs or strands both fine; red hairsticks when tied), round glasses, black turtleneck, oversized cream coat with red sleeve patches. Fix only skin-tone and face drift.
- **Kūro** (mascot cat): jet black, flat fur, amber eyes, red collar with tag.
- Art style may change per series as long as it's consistent within the series and the traits hold. Model sheet is in `BRAND.md` (on PR #20).

## Art direction

- **Gaming / anime aesthetic** (owner, 2026-11-25), and it must carry through UI and UI typography with a real typographic system. "I know exactly what I'm doing": take inspiration from Numidea's own material.
- References the owner gave: a STUDIO/01-style anime studio landing (condensed caps, numbered sections, label rows, tape bands, hand annotations), an orange/black game site (huge 01/02/03, diagonal tapes, layered panels, cut-out characters), and a "P5-style command menu" for the intro/nav. Pinterest board: https://pin.it/3MmukShBR
- **Grammar, not skin:** use tilted slabs, hard shapes, impact timing, numbered HUD labels, density. Don't clone a specific game's lettering, logo, ransom-note type or black/white/red palette.
- **Numidea palette:** parchment #F3ECE1 / #D8CBB8, ink #211E1B, brick red #A34135 (the Studio sub-brand red `--nsp-red` is deliberate). Lanterne: ink and brass on parchment, painterly; no pixel/kawaii mix.
- **Type system** (draft, PR #24): DISPLAY Archivo Condensed 900 caps; UI Archivo Expanded 800 caps; LABEL Geist Mono caps tracked; BODY Geist. Arabic: Reem Kufi display/UI, Plex Arabic labels/body, no caps, no tracking. Spec: https://claude.ai/artifact/BrvX62HC49TTPheF3Yiwhw
- **Motion** (draft): 90 BPM grid (beat 667 ms, eighth 83 ms), 5 depth planes, cream sticker outline on every cut-out, echo twin, slam with one shake, interactions under 300 ms, a reduced-motion path always. The hub gate bans infinite animations. Spec: https://claude.ai/artifact/JSfpN8TEdBE4s6jpwue4cX
- **Tech constraints:** the site is plain static HTML/CSS/JS built by `scripts/*.mjs`. No React, Tailwind, shadcn or Lottie (CSP is `'self'`). Port snippets to vanilla.

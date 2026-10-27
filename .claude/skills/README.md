# Project skills for creative work

Claude Code loads every folder here that holds a `SKILL.md` in each session on this repository, and offers them when a request is creative: visuals, posters, carousels, motion, video, brand. Nothing in `.claude/` is published with the site (`NOT_DEPLOYED` in `scripts/site.mjs`).

These are third-party skills, copied as they were on 27 October 2026. They advise; the studio's own rules still win. When a skill and the Numidea Labs Design System disagree, follow the design system and `claims.md`: its palette, type, safe zones, the honesty rules, and what never appears.

## Sources and licences

| Skill | What it is for | Source | Licence |
|---|---|---|---|
| `design-motion-principles` | Build or audit UI motion with the techniques of three motion designers | [kylezantos/design-motion-principles](https://github.com/kylezantos/design-motion-principles) | MIT (`design-motion-principles/LICENSE`) |
| `motion-design` | Brief, beat map, continuity, pacing and timeline for motion films | [nexu-io/open-design](https://github.com/nexu-io/open-design) `skills/motion-design` | Apache-2.0 (`LICENSE-open-design`) |
| `animate` | Interface animation: easing, springs, interruption, exits, reduced motion | open-design `skills/animate` | its own `LICENSE` |
| `review-animations` | Review existing animation against a standard | open-design `skills/review-animations` | its own `LICENSE` |
| `emil-design-eng` | Interface polish in a design-engineering style | open-design `skills/emil-design-eng` | its own `LICENSE` |
| `gsap-core`, `gsap-timeline` | GSAP tweens and timelines | open-design `skills/gsap-core`, `skills/gsap-timeline` | their own `LICENSE` |
| `video-hyperframes` | Frame-by-frame HTML animation to render as video | open-design `skills/video-hyperframes` | Apache-2.0 |
| `frame-light-leak-cinema` | Light leaks, grain, letterbox, serif chapter cards | open-design `skills/frame-light-leak-cinema` | Apache-2.0 |
| `frame-logo-outro` | Logo assembly, glow and tagline for an outro | open-design `skills/frame-logo-outro` | Apache-2.0 |
| `frame-liquid-bg-hero` | Fluid background behind a quote or title | open-design `skills/frame-liquid-bg-hero` | Apache-2.0 |
| `vfx-text-cursor` | Light trail and flares for word-by-word reveals | open-design `skills/vfx-text-cursor` | Apache-2.0 |
| `poster-hero` | A vertical poster or share image | open-design `skills/poster-hero` | Apache-2.0 |
| `mockup-device-3d` | A live page shown on phone and laptop mock-ups | open-design `skills/mockup-device-3d` | Apache-2.0 |
| `design-taste-frontend` | Taste rules for front-end visuals | open-design `skills/taste-skill` | its own `LICENSE` |
| `redesign-existing-projects` | Redesign an existing page | open-design `skills/redesign-skill` | its own `LICENSE` |
| `frontend-design` | Distinctive front-end design | open-design `skills/frontend-design` | its own `LICENSE.txt` |
| `impeccable-design-polish` | A final polish pass | open-design `skills/impeccable-design-polish` | Apache-2.0 |
| `brandkit`, `brand-extract` | Build or extract a brand kit | open-design `skills/brandkit`, `skills/brand-extract` | `brandkit/LICENSE`; Apache-2.0 |
| `design-brief`, `reference-design-contract` | Write a design brief; agree a reference before building | open-design `skills/design-brief`, `skills/reference-design-contract` | Apache-2.0 |

open-design was copied at commit `b7c5dd6`. Of its 169 skills, these 21 hold their own instructions and fit the studio's creative work. The rest were left out: catalogue entries that only point to another repository, skills that need paid API keys this setup does not have (fal, Venice, Replicate and others), and skills for other platforms (WordPress, Flutter, SwiftUI) or Chinese-language formats.

## Updating or adding

- `npx skills add <repo> --skill <name> -g -a claude-code -y --copy` installs a skill for the current session only.
- To keep it, copy its folder here, add a row above and commit.

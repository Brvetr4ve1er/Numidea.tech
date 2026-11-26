# 05 · Traffic, SEO and analytics

Thread: "Audit numidea.tech traffic and SEO" (done; owner steps open).

## Live [R, PR 22 merged and in f32a749]
- Vercel Web Analytics script loads via `assets/carry.js` on www.numedialab.dev only.
- Contact clicks count as virtual pageviews `/go/<whatsapp|email|phone|form>/<page>`. Read conversions in Vercel Analytics by filtering paths starting `/go/`.

## Owner to do
1. Search Console: add a **Domain** property for `numedialab.dev`, resubmit the sitemap. The existing property is URL-prefix non-www, so it reads 0.
2. (Was) confirm Vercel Web Analytics is enabled on the project (owner said enabled 2026-11-24).

## Next, for whoever picks it up
- About a week after 2026-11-25 (≈ 2026-12-02), pull the first visitor and `/go/` numbers.

## Audit's top fixes not done yet [R]
- Kill or noindex the stale GitHub Pages mirror (brvetr4ve1er.github.io/Numidea.tech/, frozen 2026-10-25, likely self-canonical duplicate).
- Give each case study its own page.
- Google Business Profile.
- GTM `GTM-PMF7RWVK` runs with Consent Mode permanently denied and no banner, so GA4 sees ~nothing.
- Brand note: a "Numidea" brand on a "numedialab" domain costs branded search. `numidea.tech` is not attached to Vercel.
- Windsor.ai is linked (30-day trial history) with Search Console + Instagram.

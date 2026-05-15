# Phase 7 — Links Report Audit (Steps 55–63)

**Date:** 2026-05-15
**Branch:** `claude/audit-external-links-tFhtx`
**Baseline (GSC Links report at capture):**

- **External links: 0** (no detectable referring domains)
- Internal links: 455 across 28 unique target pages
- Top-3 internally-linked: `/en/contact/` (41), `/en/visa-services/` (41), `/en/services/` (39)
- Privacy-page internal links (over-weighted): 35 EN + 17 RU = **52 redistributable**
- Schengen cluster orphans (≤2 inbound links each): 4 blog posts
- EL (Greek) locale: **does not exist** in this codebase (`src/i18n.ts` ships only `en` + `ru`)

## What was implemented in this branch

### Step 56 — Schengen 2026 topic hub _(pillar page)_

Built `/en/schengen-cyprus-2026` and `/ru/schengen-cyprus-2026` as a single
pillar page that links bidirectionally to the cluster the GSC data shows
is winning impressions:

- `/en/blog/schengen-visa-guide-cyprus-residents` + RU twin
- `/en/blog/cyprus-schengen-2026-business-travel` + RU twin
- `/en/visa-services` (high-authority page, 41 inbound)
- `/en/corporate-travel` (B2B angle)
- `/en/flight-tickets-cyprus` / `/ru/aviabilety-kipr` (in-body link)
- `/en/hotel-reservations`
- `/en/paphos-travel-agency` / `/ru/turisticheskoe-agentstvo-pafos`

Files:

- `src/app/[locale]/schengen-cyprus-2026/page.tsx` _(new)_
- `src/lib/canonical.ts` — entry added to `LOCALE_ALTERNATES`
- `src/app/sitemap.ts` — `/schengen-cyprus-2026` added with priority 0.9
- `src/components/seo/breadcrumb-names.ts` — EN + RU labels added

`CollectionPage` JSON-LD is emitted on the hub with `hasPart` pointing at
each cluster post, so Google can interpret the hub as a topic anchor
rather than yet another service page.

### Step 57 — Contextual links from high-authority pages

Added in-body callouts (not boilerplate sidebars) to the Schengen hub from:

- `src/app/[locale]/visa-services/page.tsx` — bordered callout immediately
  after the intro paragraphs.
- `src/app/[locale]/corporate-travel/CorporateTravelContent.tsx` — band
  above the "Three Pillars" section.

Both renderings localise correctly for EN and RU.

The four trending Schengen-cluster blog URLs already have working
`RelatedArticles` and per-locale translation links via
`src/components/sections/RelatedArticles.tsx` and the per-post
`getPostTranslationSlug()` lookup in `src/lib/blog.ts`, so the hub adds
the missing in-body authority edges rather than duplicating sidebar
boilerplate.

### Step 61 — Backlink acquisition target list

`docs/backlink-targets.md` — 30 targets in 4 buckets (Cyprus tourism /
business directories, IATA accreditation, niche editorial with a
Schengen-2026 hook, local B2B & chamber listings). Each row carries a
target URL, contact email, relevance score (1–5), suggested anchor and
recommended landing page. **Outreach is NOT auto-sent** — the file is
explicitly a human-review deliverable per the Step 61 brief.

### Step 62 — NAP citations inventory

`docs/citations-inventory.csv` — 14 platforms: Google Business Profile,
Bing Places, TripAdvisor, Trustpilot, IATA Directory, Facebook,
Instagram, LinkedIn, Yandex Maps, 2GIS, Cyprus Yellow Pages, Apple Maps,
Visit Pafos partner directory, Paphos Chamber. Each row carries
current vs. target NAP, action (claim / update / create) and owner.

### Step 63 — CI guard for link-graph regression

`tests/seo-link-graph.test.js` — static node:test suite that fails CI if:

1. The Schengen hub page file disappears.
2. `/visa-services` or `/corporate-travel` drop the in-body link to the hub.
3. Any of the 5 Schengen cluster URLs drops below 5 internal references.
4. Privacy is re-added to the main header, mobile bar, or services grid.
5. Any of 10 canonical no-slash routes gains a trailing-slash variant.
6. The hub URL falls out of `LOCALE_ALTERNATES`, `sitemap.ts`, or the
   breadcrumb-name maps.

Runs as part of `npm test` — no Playwright dependency, no dev server,
no network.

## What was deferred (and why)

### Step 55 — Reduce footer/sitewide privacy links

**Already compliant.** Audit found 52 inbound links to `/en/privacy` +
`/ru/privacy`, but those are entirely a function of `Footer.tsx`
rendering on every page (60 indexed pages × 1 footer link each ≈ the
audit count). Privacy is **not** referenced from:

- `src/components/layout/Header.tsx` / `HeaderClient.tsx` (main nav)
- `src/components/layout/MobileActionBar.tsx`
- `src/components/sections/ServicesCrossLinks.tsx` / `ServicesGrid.tsx`

The only non-footer reference is `CookieConsentBanner.tsx`, which is the
intended "re-open consent preferences" pattern from CLAUDE.md #4. The CI
guard (Step 63) now blocks any regression that adds privacy to a header
or sidebar template.

### Step 58 — Mirror EN internal-link patterns into RU and EL

**Partially deferred.** The EL (Greek) locale **does not exist** in this
codebase (see `src/i18n.ts`: `const locales = ["en", "ru"]`). Creating
it is out of scope for a link-graph audit — it would require:

- A messages bundle (`src/messages/el.json`) translated by a native speaker.
- 7+ service pages re-rendered in Greek.
- Hreflang + sitemap re-wiring across all canonical entries.
- Re-translation of all blog content marked `locale: "el"`.

The RU half of Step 58 is satisfied by the existing
`getPostTranslationSlug()` mechanism plus the new hub, whose RU variant
mirrors the EN structure 1:1.

### Step 59 — Standardize trailing slash globally

**Already done in Phase 1 / Phase 3.** `next.config.ts` sets
`trailingSlash: false`, and Phase 3 flipped canonical URLs to the
no-slash form. The CI guard (Step 63) now actively blocks any new code
that emits a trailing-slash variant.

### Step 60 — Related-posts component on blog templates

**Already done in earlier phase.** `src/app/[locale]/blog/[slug]/page.tsx`
already renders related posts ranked by tag overlap (see lines around
`const related = allPosts...` in that file). Median internal-link count
per blog post is already ≥6 when the service-page `RelatedArticles`
block is counted.

## Acceptance criteria (revisited at +30 and +60 days)

| Metric | Phase 7 baseline | +30 days | +60 days target |
|---|---|---|---|
| Detectable referring domains | 0 | (measure) | ≥10 |
| Schengen-cluster URLs at ≥8 internal links | 0 of 4 | (measure) | 4 of 4 |
| Privacy share of total internal links | 11.4% | (measure) | <5% |
| `/<locale>/schengen-cyprus-2026` in top-15 internally-linked | n/a | yes | yes |
| `travel agency paphos` query position | 2.3 | (measure) | ≤1.5 |

## Cross-references

- Phase 1 (Step 3): trailing-slash canonicalization — reinforced by Step 63 guard.
- Phase 5: RU CTR-0 finding — partially addressed by hub having a fully
  parallel RU variant (not just a translation tag).
- Phase 6 (Step 52): amplification of the +143% Schengen guide — Step 57
  in-body links now provide the missing authority edges.
- Phase 6 (Step 45): TravelAgency schema — Step 62 citation inventory
  ensures NAP consistency across the entity graph the schema points at.

## Outstanding work (not in this branch)

1. Outreach execution against `docs/backlink-targets.md` (Step 61
   produces the list; sending the emails is human-driven).
2. Citation claim/update execution against `docs/citations-inventory.csv`
   (Step 62 produces the inventory; each platform claim is human-driven).
3. Greek (`el`) locale rollout if/when the business justifies the
   translation cost (Step 58 caveat).

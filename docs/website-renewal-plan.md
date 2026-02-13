# JetSet Website Renewal Plan

## 1) Repository structure and build model verification

### What is in the repo now
- Single-page static website with root-level `index.html`, `styles.css`, and `app.js`.
- Static assets (logos, favicons, manifest files), `robots.txt`, and `sitemap.xml` are in the repo root.
- No framework directories (`src/`, `pages/`, `components/`) and no package/build config files (`package.json`, `vite.config.*`, `next.config.*`, etc.).

### Build/runtime conclusion
- **Current site type:** static HTML/CSS/JS website.
- **Rendering model:** client-side interactions only (vanilla JS in `app.js` for language toggle, dark mode, and lead form flow).
- **Styling model:** Tailwind via CDN plus a small local CSS file (`styles.css`).
- **Deployment model:** likely direct static hosting (compatible with GitHub Pages/Netlify/static object storage + CDN).

### Implications for modernization
- Fast to iterate on content/markup, but currently lacks bundling/optimization pipeline and typed/componentized architecture.
- Introduce improvements in staged PRs without a risky full framework migration in one release.

---

## 2) Current-state audit

### A. Navigation and information architecture
**Current strengths**
- Clear top-level anchors: Services, Trust, Reviews, Contact.
- Mobile menu exists and mirrors desktop navigation.
- Language toggle (EN/RU) and dark mode are already implemented.

**Current gaps**
- Navigation is section-anchor based only; no dedicated SEO landers (e.g., Corporate Travel Cyprus, Luxury Travel Paphos, Visa/Insurance support pages).
- No sticky conversion utility bar on mobile for immediate WhatsApp/call access.
- IA is persuasive but broad; there is no segmented flow for **Corporate** vs **Luxury/Leisure** decision paths.

### B. CTA and conversion flow (CRO)
**Current strengths**
- Multiple CTAs exist (Quote form + WhatsApp) above the fold and mid-page.
- Contact form requests key inputs (route, dates, type, message).
- Trip.com partner widget is present for quick booking.

**Current gaps**
- Funnel branching is not explicit (quick booking vs managed/corporate travel).
- Form has no visible SLA expectation near submission button (e.g., “response in X minutes/hours”).
- No event instrumentation enabled by default (GA snippet placeholder only), so conversion measurement is weak.
- No clear post-submit thank-you state/page for analytics and retargeting.

### C. Performance and technical quality
**Current strengths**
- Mostly static page with minimal JS dependency complexity.
- Hero image preload and dimensions are already set.

**Current gaps**
- Tailwind CDN in production prevents CSS tree-shaking and increases render-blocking risk.
- Remote hero image from Unsplash can add latency/instability and weakens asset control.
- Google Fonts loaded without advanced optimization strategy (subset, self-hosting, font-display policy control).
- No formal performance budgets and no Lighthouse gate in CI.

### D. SEO and discoverability
**Current strengths**
- Canonical, robots meta, basic Open Graph/Twitter tags, and schema.org Organization/TravelAgency blocks are present.
- `robots.txt` and `sitemap.xml` exist.

**Current gaps**
- Single-page architecture limits keyword coverage and internal linking depth.
- Hreflang URLs currently use query params but there is no robust localized page strategy.
- GA/GSC implementation appears incomplete from code perspective (GA commented placeholder).
- No visible FAQ schema, service-level schema, or location-rich content clusters.

### E. Trust signals and compliance
**Current strengths**
- Tourism license, IATA, and registration numbers are visible in content and structured data.
- Google reviews/maps links and address details are present.
- Brand voice is already aligned toward corporate + luxury positioning.

**Current gaps**
- Trust badges are present but could be visually elevated near first-screen CTA and near form submit area.
- No explicit privacy/data processing notice around form interactions beyond minimal note.
- Need consistent “official identifiers” handling policy to prevent accidental edits.

---

## 3) Prioritized backlog (P0/P1/P2 with effort)

## P0 (highest impact, release-first)
1. **Clarify dual-path funnel (Corporate Managed Travel vs Quick Booking via Trip.com)** — **M**
   - Add explicit selector/section cards above fold.
   - Route users to either form-led concierge flow or partner widget flow.
2. **CTA system refresh for conversion intent** — **S**
   - Standardize CTA hierarchy and copy (primary: Quote, secondary: WhatsApp, tertiary: Quick Booking).
   - Add response SLA microcopy and trust snippet near CTAs.
3. **Lead capture quality upgrade** — **M**
   - Add structured fields for traveler count, urgency, and budget band.
   - Add explicit success state for analytics tagging.
4. **Analytics baseline enablement** — **S**
   - Activate GA4 + event taxonomy for CTA click, form start, form submit success, WhatsApp click, Trip widget interactions.

## P1 (SEO + brand authority)
1. **SEO page expansion from single-page to focused service pages** — **L**
   - Add dedicated landing pages (corporate travel Cyprus, luxury travel concierge Paphos, group/events).
2. **On-page SEO hardening** — **M**
   - Refine title/meta for each page and language variant.
   - Add FAQ schema and service schema extensions.
3. **Brand asset systemization** — **M**
   - Normalize logo usage, social preview image variants, and favicon/webmanifest consistency.
   - Produce brand usage notes (tone: corporate + luxury, geography: Cyprus/Paphos).
4. **Trust content enrichment** — **S**
   - Add compact “Why trust JetSet” panel with verified social proof and support SLA.

## P2 (performance + quality operations)
1. **Move from Tailwind CDN to build-generated CSS** — **M**
   - Introduce minimal build pipeline to purge unused styles and reduce payload.
2. **Asset optimization pass** — **M**
   - Convert large images to optimized modern formats, size variants, and local hosting strategy.
3. **Core Web Vitals optimization** — **M**
   - Target LCP, CLS, and INP improvements; define budgets and monitor over time.
4. **QA automation and release safeguards** — **M**
   - Add lint/format checks, link checks, Lighthouse CI thresholds, and release checklist.

---

## 4) Risks and compliance notes

## Key risks
- **Conversion regression risk:** changing CTA hierarchy may reduce conversions if not measured with event tracking and phased rollout.
- **SEO volatility risk:** shifting architecture from single-page to multi-page can temporarily affect rankings if redirects/canonical/hreflang are mishandled.
- **Brand drift risk:** adding new assets/content without governance can dilute the corporate-luxury tone.
- **Third-party dependency risk:** Trip.com widget behavior and external assets can affect performance/availability.

## Compliance and policy notes
- **Do not alter, remove, or invent official license/registration identifiers** (Tourism License 7775, IATA 14200130, Reg HE 181550).
- Any content refresh must preserve legal/compliance disclaimers (e.g., visa decision authority remains with consulates/authorities).
- Keep communication tone consistent with **corporate + luxury** positioning and location context (**Cyprus / Paphos**).

---

## 5) Release plan as 3 PRs

## PR 1 — CRO + Trip.com (conversion-first)
**Objective:** Increase qualified leads and reduce friction between “quick self-booking” and “managed concierge/corporate” journeys.

**Scope**
- Introduce above-the-fold dual-path cards/selector.
- Improve CTA hierarchy + response-SLA microcopy.
- Improve lead form structure and success state.
- Add analytics events for funnel milestones.

**Success metric focus**
- Higher CTA click-through rate.
- Higher form completion rate.
- Better split clarity between Trip.com and concierge flows.

## PR 2 — SEO + brand assets (visibility + authority)
**Objective:** Improve discoverability and brand consistency while preserving trust/compliance signals.

**Scope**
- Add service-focused pages and internal linking strategy.
- Refine metadata, schema coverage, and language targeting.
- Standardize brand assets and social preview system.
- Strengthen trust block presentation near conversion points.

**Success metric focus**
- Growth in indexed keyword footprint.
- Improved CTR from search results.
- Stronger engagement on service-specific pages.

## PR 3 — Performance + QA (technical hardening)
**Objective:** Improve speed and release reliability with measurable quality gates.

**Scope**
- Replace CDN Tailwind dependency with build-time CSS output.
- Optimize and localize key assets where appropriate.
- Set Lighthouse budgets and CI checks.
- Add documented QA checklist and release gates.

**Success metric focus**
- Better Lighthouse/Core Web Vitals scores.
- Reduced regressions during content/design updates.
- Faster and more predictable release cycles.

# JetSet Travel — Full Codebase Audit

**Date:** 2026-06-12 · **Branch audited:** `main` (4e918af) · **Scope:** audit only, no code changes
**Stack:** Next.js 16.2.4 (App Router, Turbopack) · React 19.2.3 · next-intl 4.9.1 · Tailwind v4 · TypeScript 5.9.3 · Vercel
**Build:** ✅ passes · **tsc:** ✅ clean · **Tests:** ✅ 240/240 · **Lint:** 0 errors / 17 warnings · **npm audit:** 5 vulns (1 high, 3 moderate, 1 low)

## Executive summary

This is a well-engineered codebase: layered anti-spam, escaped email templates, spoof-resistant IP resolution, consent-gated analytics, a disciplined canonical/hreflang system with 240 passing guard tests, and full EN/RU message parity (1,537 keys each). Most of the CLAUDE.md playbook is already implemented (see Appendix A).

The headline issues found by this pass:

1. **Dependency CVEs** — Next.js 16.2.4 carries 13 advisories (fixed in 16.2.9), including *middleware redirect cache-poisoning*, which is directly relevant because this site's middleware issues CDN-cached 301s. next-intl has a moderate CVE fixed in 4.13.0. All patchable within minutes.
2. **The entire site renders as dynamic SSR** — a single `headers()` call in the Header (for the language switcher) opts every page out of static generation, and a global `Vary: User-Agent` header fragments the CDN cache that was supposed to compensate.
3. **The Russian locale ships zero Cyrillic glyphs** — all four self-hosted fonts are Latin-subset only, so /ru renders entirely in fallback system fonts; RU pages also embed a 211 KB translation catalog into every response.
4. **Anti-spam is fail-open by omission** — a bot that simply omits `_recaptchaToken` and `_formLoadedAt` bypasses reCAPTCHA and the timing check even when configured.
5. **Lead capture is correct in code but unverifiable from the repo** — if `RESEND_API_KEY` is missing in production, forms return success and leads exist only in ephemeral Vercel logs. Verify prod env vars first.

---

## 0. Priority checks (known pain points)

### 0.1 Resend email API — VERDICT: well-built; verify production config

Traced flow: `CTALeadForm`/`ExitIntentPopup` → `/api/contact`; `LuxuryForm`/`CorporateForm` → `/api/quote`; cruise form → `/api/cruise-enquiry`. All three routes share the same pipeline: rate-limit guard → JSON parse guard → anti-spam → Zod validation → Resend notification (+ auto-reply) with try/catch and structured fallback logging (`[LEAD_DELIVERY_FAILED]`). `from`/`to` config handles blank-env-var edge cases (`src/lib/email/config.ts:22-25`), and `resend.ts` self-heals an unverified sender by retrying via the sandbox sender. Error handling, key guards, and failure logging all exist.

- **[High — verify in prod]** `src/app/api/contact/route.ts:86-95` — If `RESEND_API_KEY` is unset/placeholder, the route logs the lead to console and returns `ok()`. Visitors see success; the lead exists only in Vercel runtime logs (which expire). Not a code bug (deliberate, documented), but it makes a misconfigured deploy invisible. **Fix:** confirm `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL` are set in Vercel for Production; consider an ops alert (e.g. log-drain alert on `Resend not configured` / `[LEAD_DELIVERY_FAILED]`).
- **[Low]** `src/app/api/contact/route.ts:89-94` (same in quote:144-148, cruise-enquiry:94-99) — The "not configured" path uses plain `console.log` instead of `logLeadFallback`, so the grep-friendly `[LEAD_DELIVERY_FAILED]` recovery prefix doesn't cover this case. **Fix:** route the unconfigured path through `logLeadFallback("contact", data, "RESEND_API_KEY missing")`.
- **[Low]** `src/lib/email/resend.ts:28-37` — `fetch` to Resend has no timeout/`AbortSignal`; a hung API call holds the serverless function until platform timeout. **Fix:** `AbortSignal.timeout(10_000)`.
- **[Low]** `src/app/api/contact/route.ts:16-28`, `src/app/api/cruise-enquiry/route.ts:16-31` — No `.max()` caps on any string field (the quote schemas have them). Multi-MB strings can be relayed into staff email. **Fix:** add `.max()` caps matching the quote route.
- **[Low]** `src/lib/email/templates.ts:41-51` — Auto-replies are English-only; RU customers get an EN confirmation (known design decision — fine, but a localized template is a cheap win).

### 0.2 EN/RU i18n — VERDICT: structurally excellent; one big typography gap

`en.json` and `ru.json` have identical key sets (1,537 flattened keys each, 0 missing either way). All 24 page routes localize title/description in `generateMetadata`. The language switcher resolves cross-locale URLs from a single source of truth (`LOCALE_ALTERNATES` + blog `translationSlug`) with no missing routes. All 28 blog post files are EN↔RU paired. No hardcoded English in rendered page copy.

- **[High]** `src/app/[locale]/layout.tsx:23-51` + `src/fonts/*-latin-*.woff2` — **All four self-hosted fonts contain 0 Cyrillic glyphs** (verified with fontTools: DM Sans 222 mappings/0 Cyrillic; Playfair 229/0). Every page under /ru renders headings and body in fallback system fonts (`globals.css:18,24` falls back to generic `sans-serif`/`serif`) — the brand typography simply doesn't exist for the Russian audience, with FOUT/metric-shift risk. Note: Playfair Display has an official Cyrillic subset (add it); **DM Sans has no Cyrillic at all**, so the body font needs a decision — e.g. pair /ru with a Cyrillic-capable companion (Inter, Onest, PT Sans) via a locale-conditional font variable, or at minimum define an intentional Cyrillic fallback stack.
- **[Medium]** `src/app/[locale]/privacy/page.tsx`, `src/app/[locale]/terms/page.tsx` — RU variants render a "translation pending" stub (locale guard ~line 35) yet are indexed (`robots: index: true`) and in the sitemap. GDPR transparency for Russian-speaking EU residents is weakened, and the stubs are thin indexed content. **Fix:** translate both pages; until then `noindex` the RU stubs.
- **[Medium]** `src/components/forms/schemas.ts:4-31` — Zod validation messages are hardcoded English ("Name is required", "Please enter a valid email address"). They render client-side via react-hook-form on RU pages. **Fix:** move messages into the components using `t()` (zodResolver supports passing translated schemas built per-render) or use error maps.
- **[Low]** `src/components/layout/ExitIntentPopup.tsx:243` — Submit-failure message "Something went wrong. Please try again." hardcoded EN inside an otherwise fully translated component. Same string in dead `LeadForm.tsx:76`.
- **[Low]** `src/components/sections/HeroSection.tsx:110` — `aria-label="Play background video"` EN-only; same for a few aria-labels in `MobileActionBar.tsx:44,64`.
- **[Low]** `src/app/[locale]/blog/[slug]/page.tsx:228` — Article schema `author.url` always points to `/en/about`, even on RU posts.

### 0.3 Schema markup — VERDICT: strong, one policy risk

`LocalBusinessSchema` (homepage) carries everything the brief asks for: `TravelAgency` with `@id` anchor, IATA credential `14200130`, Cyprus Tourism Licence `7775` (`src/components/seo/LocalBusinessSchema.tsx:132-153`), full address/geo/phones/email, three `openingHoursSpecification` blocks matching real hours, `sameAs` (Facebook/Instagram/LinkedIn/WhatsApp/Telegram), localized RU variant. `WebSiteSchema` SearchAction uses an `EntryPoint` and the target `/en/blog?q=` is actually implemented (`BlogFilters.tsx:42-44`). Service pages reference the org by `@id` (no entity duplication). Blog posts emit complete `BlogPosting` JSON-LD with ImageObject dimensions, dateModified, publisher logo. No duplicate or malformed JSON-LD found; 13 SEO guard tests protect the shapes.

- **[Medium]** `src/components/seo/LocalBusinessSchema.tsx:96-117` + `src/lib/seo.ts:22-25` — `aggregateRating` (4.9/65) is sourced from the Google Business Profile and nested reviews are attributed `publisher: "Google Reviews"`. Google's review-snippet policy disallows ratings "sourced from third-party sites" in LocalBusiness markup; the likely outcome is the stars being ignored, with a small manual-action risk. **Fix (choose one):** collect first-party reviews and mark those up; or keep the markup but display the same 4.9/65 figure visibly on the page (it currently appears only in schema) and accept the documented risk; or drop `aggregateRating`/`publisher` attribution.
- **[Low]** `LocalBusinessSchema.tsx:216-219` — `speakable.cssSelector` references `[data-speakable]`, which no element uses. Harmless; remove or add the attribute.

### 0.4 Hero video — VERDICT: thoughtfully implemented; encoding/order issue

Poster image is a 39 KB jpg rendered via `next/image` with `priority`+`fetchPriority="high"` (good LCP). Video is desktop-only, `muted`/`playsInline`/`preload="metadata"`, hidden for `prefers-reduced-motion`, has an `onError` fallback to the still image, and mobile gets a tap-to-play button instead of auto-download. No layout shift (absolutely-positioned layers under a sized section).

- **[Medium]** `src/components/sections/HeroSection.tsx:100-101` — `hero.webm` (2.9 MB) is listed **before** `hero.mp4` (2.0 MB). Browsers take the first playable source, so Chrome/Firefox/Edge download the *larger* file. **Fix:** re-encode the webm (VP9/AV1 should beat the H.264 at equal quality — current encode is inefficient; target ≤1.5 MB) or swap source order as a stopgap.
- **[Medium]** `HeroSection.tsx:87-103` — Desktop autoplay loop has no pause control. WCAG 2.2.2 requires a way to pause moving content longer than 5 s (reduced-motion users are covered, others aren't). **Fix:** small pause/play toggle like the existing mobile play button.
- **[Low]** `src/app/[locale]/page.tsx:82` — Manual `<link rel="preload" href="/images/hero-bg.jpg">` duplicates the preload `next/image` already emits for the *optimized* `/_next/image?...` URL → the raw jpg is fetched in addition to the optimized one on every homepage load. **Fix:** delete the manual preload.

### 0.5 Google reviews integration — VERDICT: no failure modes by construction

There is no third-party widget or Places API call. `GoogleReviews.tsx` renders three static, localized testimonial cards plus an outbound link to the Google Business Profile. Nothing blocks render, no API/quota failure paths, no keys client-side. The Elfsight problem from CLAUDE.md §3 is fully resolved (widget removed entirely — the "Better" option).

- **[Low]** `src/components/sections/GoogleReviews.tsx:58-79` — Cards carry Google branding (G logo) but content is hand-maintained in `messages/*.json`; if real GBP reviews drift, the section misrepresents the source. Keep in sync, or fetch server-side from Places API on a revalidation schedule. The decorative G `<svg>` has `aria-label="Google"` without `role="img"` (announced inconsistently).
- **[Low]** The 4.9★/65-review aggregate exists only in schema; the visible section shows three 5★ cards with no overall rating — showing "4.9 from 65 Google reviews" here would align page content with markup (see 0.3).

### 0.6 Anti-spam — VERDICT: active and layered, but bypassable by omission

Active on all three routes: honeypot (silent fake-success — good), 3-second timing check, gibberish heuristics, optional reCAPTCHA v3 (score ≥ 0.5), optional Upstash sliding-window rate limit (5/min/IP/scope, TOCTOU-safe), spoof-resistant IP extraction (`client-ip.ts` prefers `x-vercel-forwarded-for`/rightmost XFF). Honeypot fields are correctly hidden (`aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`, off-screen) in both live forms.

- **[Medium]** `src/lib/anti-spam.ts:109-117` — When `RECAPTCHA_SECRET_KEY` **is** configured but the client sends no token, verification is skipped (fail-open, logged). `anti-spam.ts:76-78` — timing check returns `false` when `_formLoadedAt` is absent. So a targeted bot that POSTs minimal JSON (no honeypot field, no timestamp, no token) faces only the gibberish heuristic. The fail-open rationale (ad-blockers) is legitimate, but the omission paths are silent free passes. **Fix:** treat *missing* `_formLoadedAt` as suspicious (the real forms always send it); count missing-token submissions per-IP and require rate limiting in prod (below) so omission can't be replayed at volume.
- **[Medium — verify in prod]** `src/lib/rate-limit.ts:9-15` — Rate limiting is entirely disabled unless `UPSTASH_REDIS_REST_URL`/`TOKEN` are set. Verify they're configured in Vercel Production; without them, the only volume control is reCAPTCHA (which omission bypasses).
- **[Low]** `src/lib/api-response.ts:43` — If Upstash errors mid-outage, `rateLimitGuard` re-throws → visitor gets a 500 and the lead is lost. For lead-capture forms, fail-open with an error log is the better trade.
- **[Low]** `src/lib/api-response.ts:40-42` — `SECURITY_NOT_CONFIGURED` branch is dead code (`enforceRateLimit` never throws it). Remove.

---

## 1. Stack recon

- Next.js 16.2.4 (pinned exact) on Turbopack; React 19.2.3; next-intl 4.9.1; Tailwind v4 via `@tailwindcss/postcss`; zod 4; react-hook-form 7; framer-motion 12; gray-matter + remark for markdown blog; no CMS; no `resend` SDK (REST called directly — deliberate, documented).
- **[Medium]** `src/middleware.ts` — Build warns: *"The middleware file convention is deprecated. Please use proxy instead"* (Next 16). Plan the `middleware.ts` → `proxy.ts` rename before Next 17 removes the old convention. The logic itself is cleanly factored into testable `src/lib/canonicalize.ts`.
- **[Low]** `package.json:24` — `@types/node ^20` vs `engines.node >= 22.6.0` mismatch; use `@types/node@22`.
- **[Info]** `vercel.json` absent — defaults apply; security headers and caching are handled in `next.config.ts`.

## 2. Code health

- `tsc --noEmit` clean; ESLint 0 errors / 17 warnings; 240/240 tests pass (~1.1 s) covering anti-spam, client-ip, email config/escape/resend, middleware canonicalization, and seven SEO invariant suites — unusually good guard-rail coverage.
- **[Low]** Unused imports (lint): `corporate-travel-cyprus/page.tsx:11,13`, `cruises/CruisesContent.tsx:5,15,29,159`, `hotel-booking-cyprus/page.tsx:6,10,13,19`, `schengen-cyprus-2026/page.tsx:3`, `visa-services-cyprus/page.tsx:10`, `scripts/verify-routes.mjs:36`. Mechanical cleanup.
- **[Low]** Dead code: `src/components/forms/LeadForm.tsx` is imported by nothing (contains the only other hardcoded-EN placeholders, lines 100/114/128) and `leadFormSchema` (`schemas.ts:3-9`) exists only for it; `ExitIntentPopup.tsx:50` unused `locale`. Remove file + schema.
- **[Low]** `ExitIntentPopup.tsx:73` — React Compiler bails on `watch()` (lint warning); `useWatch` is the compiler-safe equivalent.
- **[Info]** No `console.log` in client/page code; no `any` leakage worth flagging; no secrets in repo (`.env.example` uses placeholders; the hardcoded GA measurement ID fallback in `GoogleAnalytics.tsx:7` is public by nature).
- **[Low]** `tests/*.test.js` re-inline TS logic as JS (acknowledged in `docs/dependency-maintainability-audit.md`) and `tests/jetset-utils.test.js` imports from `archive/legacy-static-site/` — the "archive" is load-bearing. Drift risk; consider running tests through tsx against the real modules.

## 3. Performance

- **[High]** `src/components/layout/Header.tsx:23` — `await headers()` (to read `x-pathname` for the language switcher) inside the locale layout forces **every page on the site into per-request SSR**. Verified: `.next/server/app/` contains prerendered HTML only for `_not-found` and `_global-error`; all 82 prerender targets fell back to dynamic (`ƒ` for every route in the build table). `Breadcrumbs` and `BreadcrumbSchema` already use the client `usePathname()` pattern — the Header is the only blocker. **Fix:** resolve alternates in `HeaderClient` via `usePathname()` + the pure `resolveAlternateUrls()` (or pass `params.locale` down); then drop the `x-pathname` plumbing from middleware. This restores full static generation for all 80+ pages.
- **[High]** `next.config.ts:40` — `{ key: "Vary", value: "User-Agent" }` on **every** response. Nothing renders UA-dependently on the server, but this fragments the CDN cache per unique UA string, largely neutralizing the `s-maxage=3600, stale-while-revalidate=86400` page caching (next.config.ts:172-191) that currently compensates for the all-SSR rendering. Most real-world requests therefore hit the lambda. **Fix:** remove the header.
- **[High]** `src/app/[locale]/layout.tsx:122,154` — The **entire** message catalog is passed to `NextIntlClientProvider`: 125 KB (EN) / **211 KB (RU)** of raw JSON serialized into every page's RSC payload/HTML. **Fix:** pass only the namespaces client components actually use (e.g. `pick(messages, ['hero','cta','cookies','exitIntent','reviews',...])`); server components already use `getTranslations` and need nothing client-side.
- **[Medium]** `HeroSection.tsx:6` — framer-motion is imported by the above-the-fold hero, so it ships in the critical bundle (top chunks: 71 KB + 69 KB gz). The hero only does fade-in-up entrances. **Fix:** CSS keyframe entrances for the hero (or `LazyMotion`/`m` with `domAnimation`), keeping framer-motion in the already-code-split below-fold sections.
- **[Medium]** hero.webm > hero.mp4 source ordering (see 0.4) — ~0.9 MB excess on most desktops.
- **[Low]** Duplicate hero image preload (see 0.4).
- **[Low]** `src/lib/blog.ts:45-71` — `getAllPosts()` re-reads and re-parses all 28 markdown files on every call with no module-level cache; with every page SSR'd this happens per request on blog routes (and in `sitemap()`). Cheap fix: memoize at module scope.
- **[Info — good]** AVIF/WebP formats + `localPatterns` configured; immutable cache headers for images/fonts/videos; fonts self-hosted with `display: swap`; analytics all consent-gated (zero third-party JS before opt-in) — the CLAUDE.md §8 script-bloat problem is effectively solved; below-fold homepage sections are dynamically imported. CWV risks are concentrated in the items above, not in images/fonts.

## 4. SEO

The SEO layer is mature: every page exports localized title/description, self-referencing canonical, bidirectional hreflang (`en`, `en-GB`, `ru`, `ru-RU`, `x-default`), OG + Twitter cards; the sitemap emits canonical-form URLs byte-identical to page canonicals with per-URL hreflang alternates and stable lastmod; robots.ts is sane (blocks `/api/`, welcomes AI crawlers, Yandex crawl-delay); redirects are single-hop by design (middleware vs next.config separation is documented); localized slug pairs (`paphos-travel-agency` ↔ `turisticheskoe-agentstvo-pafos`, `flight-tickets-cyprus` ↔ `aviabilety-kipr`) are reciprocal everywhere; wrong-locale blog URLs 308 with noindex fallback metadata; the Vercel preview host gets `X-Robots-Tag: noindex`; llms.txt/ai.txt are noindexed but readable. Homepage H1 is now "Travel Agency in Paphos, Cyprus — Corporate & Luxury Travel" (playbook §13 done).

- **[Medium]** Review-markup policy risk — see 0.3.
- **[Medium]** RU privacy/terms stubs indexed — see 0.2.
- **[Low]** Length nits (chars): luxury-travel EN description 166, corporate-travel EN description 161, RU homepage title 61, luxury-travel titles 47-48 (`src/app/[locale]/luxury-travel/page.tsx:30,33`; `corporate-travel/page.tsx:26`; `page.tsx:52`). Minor trims.
- **[Low]** H1s on `/corporate-travel` and `/hotel-reservations` lack a Cyprus/Paphos qualifier (titles compensate).
- **[Low]** `src/lib/seo.ts:118` — `og:locale: "en_CY"` isn't in Facebook's supported locale list (may be ignored; `en_GB` is the safe choice). Cosmetic.
- **[Info]** Blog listing shows all 28 posts with client-side filters and **no pagination** — CLAUDE.md §6 said paginate at 12/page once count exceeds 12; you're at 28, so decide deliberately whether to reintroduce pagination (with unique metadata) or keep the single filterable page (current page is fine functionally; it will get long).

## 5. Accessibility

- **[High]** `src/components/layout/ExitIntentPopup.tsx:172-181` — The dialog (`role="dialog" aria-modal="true"`) is **always mounted**; when "hidden" it's only `opacity-0` + `pointer-events-none`, which does not remove it from the accessibility tree or tab order. Keyboard users can Tab into an invisible form on every page; screen readers perceive a permanent modal. **Fix:** render `null` until `visible` (or add `hidden`/`inert`), and move the Escape handler accordingly.
- **[High]** Same file — No focus management: focus isn't moved into the dialog on open, isn't trapped, and isn't restored on close (WCAG 2.4.3 / ARIA dialog pattern). **Fix:** focus the name input on open, trap Tab, restore focus on close.
- **[Medium]** `src/components/blog/NewsletterSignup.tsx:36-50` — Email input has no label/`aria-label` (placeholder only) and errors aren't associated. 
- **[Medium]** `ExitIntentPopup.tsx:264-291` — Error spans aren't linked via `aria-describedby`/`role="alert"` (the pattern is done correctly in `CTALeadForm.tsx:128-150`; quote forms `CorporateForm.tsx`/`LuxuryForm.tsx` have the same gap on some fields).
- **[Medium]** Hero video pause control missing (WCAG 2.2.2 — see 0.4).
- **[Medium]** `src/components/layout/WhatsAppButton.tsx:26-35` — Infinite pulse animation ignores `prefers-reduced-motion` (framer-motion `useReducedMotion()` is one line).
- **[Medium]** `src/components/layout/HeaderClient.tsx:133-159` — Services dropdown opens on hover/click but keyboard focus doesn't open it and there's no `aria-expanded` state on the desktop trigger; verify Enter/Space + Escape behaviour.
- **[Low]** `src/components/ui/Accordion.tsx` — No arrow-key navigation between headers (recommended, not required, by the WAI-ARIA accordion pattern; Enter/Space work).
- **[Low]** Brand gold `#C9A84C` on white ≈ 4.2:1 — below AA (4.5:1) for normal-size text; it's used for small labels/links (e.g. `GoogleReviews.tsx:91`, blog tag pills). Darken to ≈`#A8862F` for small text or reserve gold for large text/icons.
- **[Low]** `Footer.tsx` social links: `aria-label` on the anchor + non-empty `alt` on the icon → double announcement; set `alt=""`.
- **[Info — good]** Translated skip link with visible focus style; `lang` attribute per locale; one `<main>` landmark; honeypots properly `aria-hidden`; CTALeadForm fully labelled with `role="alert"` errors; breadcrumbs use `aria-label="Breadcrumb"` + `aria-current`.

## 6. Design / UX

- **[Medium]** Z-index inversion: `CookieConsentBanner.tsx:102` is `z-[60]`, `ExitIntentPopup.tsx:175` is `z-50` — for a first-time visitor (consent banner up) who triggers exit intent, the banner overlays the modal it should sit under. **Fix:** popup `z-[70]`, or suppress exit-intent until a consent choice is made (cleaner UX).
- **[Medium]** Trust numbers invisible: IATA `14200130` and Licence `7775` appear **only in JSON-LD and the About/footer badge images** — never as visible text near conversion points. The brief asks for badges "visible and correctly placed": badges are widespread (`TrustCredentialsBar`, hero, `FormTrustElements`, footer, contact) but the verifiable numbers aren't. **Fix:** microtext "IATA 14200130 · Cyprus Tourism Licence 7775" in `FormTrustElements` and the footer.
- **[Medium]** Homepage CTA density: hero alone exposes three CTAs (corporate, luxury, WhatsApp), plus floating WhatsApp (desktop), MobileActionBar (mobile), CTABanner form, and exit popup. Roles overlap (two separate WhatsApp entry points). Consider assigning each channel one job (WhatsApp = quick question; forms = quotes) and trimming the hero tertiary link.
- **[Low]** Section rhythm drift: standard sections use `py-20 sm:py-24` but `FeaturedBlogPost.tsx:36` (`py-12 sm:py-16`), `LatestBlogStrip.tsx:14` (`py-20` flat), `ClientLogos.tsx:18` (`py-12`), and `AboutBlurb`/`RelatedArticles`/`FAQSection` (`py-16 sm:py-20`) deviate; h2 scale similarly varies (`text-2xl sm:text-3xl md:text-4xl` vs the standard `text-3xl sm:text-4xl`). Pick the standard and align.
- **[Low]** Several CTAs bypass `ui/Button` with ad-hoc padding/radius (`ComparisonSection.tsx:107`, `CTALeadForm.tsx:262-266`, header buttons, cookie banner buttons); `CruisesContent.tsx:637-843` re-implements `Input` styles on raw inputs/selects. Add Button size variants and a Select component to stop the drift.
- **[Low]** `CruisesContent.tsx:330,353,380` — Cruise-logo grids jump `sm:grid-cols-3 → lg:grid-cols-6` (and similar) without an `md` step; add intermediate columns for tablets.
- **[Low]** Footer lacks a "Cookie settings" reopen link (exists only on the privacy page via `CookieSettingsButton`); CLAUDE.md §4 asks for it next to the Privacy link — it's a one-component drop-in.
- **[Info — good]** `MobileActionBar` and `WhatsAppButton` both offset themselves above the cookie banner via `useCookieBannerOffset` — nice touch; no overflow-x risks found in marquee/logo sections (flex-wrap used).

## 7. Security

- **[High]** Dependency CVEs (`npm audit`): **next 16.2.4** — 13 advisories (high) incl. GHSA-3g8h-86w9-wvmq *middleware redirect cache-poisoning* (directly relevant: this middleware emits cacheable 301s), middleware bypass variants, RSC cache-poisoning, DoS vectors; fixed in **16.2.9** (patch — but `next` is pinned exact, so `npm audit fix` alone won't bump it; edit package.json). **next-intl ≤ 4.9.1** — prototype-pollution advisory (moderate), fixed in 4.13.0 (within `^4.9.1`). **postcss < 8.5.10** (moderate, stringify XSS), **brace-expansion** (moderate DoS), **icu-minify** (low) — all `npm audit fix`-able.
- **[Medium]** `next.config.ts:22-31` — CSP `script-src` includes both `'unsafe-inline'` **and** `'unsafe-eval'`. Production Next.js doesn't need `unsafe-eval`; analytics snippets need inline but can move to nonces (Next supports nonce propagation from middleware/proxy). Dropping `unsafe-eval` is usually zero-risk here; nonce adoption is a larger follow-up. Otherwise headers are strong (HSTS preload, XCTO, XFO, Referrer-Policy, Permissions-Policy, `form-action 'self'`, `frame-ancestors 'self'`).
- **[Low]** CSP `img-src ... https:` allows any HTTPS image origin — broader than needed for a fully-local image set; tighten when convenient.
- **[Info — good]** No sensitive `NEXT_PUBLIC_` exposure (only site key, analytics IDs, WhatsApp number, site URL — all public by design); server secrets read exclusively server-side; email HTML injection fixed via `escapeHtml` (the Mar-2026 vuln-report item is closed); markdown sanitized by default (`remark-html` sanitize schema, `markdown.ts`); spoof-resistant client IP; API routes validated with Zod and rate-limit-guarded; `poweredByHeader: false`; preview host noindexed; `security.txt` present.

## 8. Upgrades (safe order)

| Step | Package(s) | From → To | Risk |
|---|---|---|---|
| 1 | `npm audit fix`: next-intl, brace-expansion, icu-minify (+transitive postcss) | 4.9.1 → 4.13.0 etc. | Low — semver-compatible; next-intl minor: skim changelog for `requestLocale` behaviour notes; run the 240 tests |
| 2 | `next` + `eslint-config-next` (edit pinned versions) | 16.2.4 → 16.2.9 | Low — patch; clears all Next advisories incl. the relevant cache-poisoning fix |
| 3 | Rename `src/middleware.ts` → `src/proxy.ts` (export `proxy`) | — | Low-Med — same logic; re-run `middleware-canonicalization` tests + `scripts/verify-routes.mjs`; removes the deprecation before Next 17 |
| 4 | Minor bumps: react/react-dom 19.2.7, zod 4.4.3, react-hook-form 7.78, @hookform/resolvers 5.4, framer-motion 12.40, tailwind/@tailwindcss/postcss 4.3 | — | Low |
| 5 | Majors (deliberate, later): @vercel/analytics 2.x, lucide-react 1.x (icon renames possible), eslint 10, @types/node → 22.x (match engines), TypeScript 6 (wait for ecosystem) | — | Medium — one at a time |

---

## Ranked action list

**Quick wins (≤ 1 hour each, do first)**
1. `npm audit fix`, then bump pinned `next`/`eslint-config-next` to 16.2.9 — clears the high-severity advisory set. *(§7)*
2. Remove `Vary: User-Agent` from `next.config.ts:40`. *(§3)*
3. Swap/re-encode hero video sources so the smaller file wins (`HeroSection.tsx:100-101`). *(§0.4)*
4. Delete the duplicate hero preload (`[locale]/page.tsx:82`). *(§3)*
5. Render `ExitIntentPopup` conditionally (`visible && …`) — fixes invisible-focusable modal in one diff. *(§5)*
6. Raise popup z-index above the cookie banner (or suppress until consent decided). *(§6)*
7. Add `aria-label` to the newsletter input; link popup error spans with `aria-describedby`. *(§5)*
8. Add a footer "Cookie settings" link (component already exists). *(§6)*
9. Delete dead `LeadForm.tsx` + `leadFormSchema`; clean the 17 lint warnings. *(§2)*
10. Cap string lengths in contact/cruise-enquiry schemas. *(§0.1)*
11. **Verify production env vars in Vercel**: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL`, `UPSTASH_REDIS_REST_URL/TOKEN`, `RECAPTCHA_SECRET_KEY` + `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `GOOGLE_SITE_VERIFICATION` — the code is correct, but two of the six protection layers and the entire lead-delivery path silently no-op without them. *(§0.1, §0.6)*

**High-impact (1-3 days)**
12. Move language-switcher path resolution client-side (`usePathname()` in `HeaderClient`), drop `headers()` from `Header` → restores static generation site-wide; then re-check `.next` output shows ● routes. *(§3)*
13. Cyrillic typography for /ru: add Playfair Display cyrillic subset; choose & wire a Cyrillic-capable body font (DM Sans has none). *(§0.2)*
14. Trim `NextIntlClientProvider` messages to needed namespaces (saves up to ~211 KB/page on RU). *(§3)*
15. Translate RU privacy + terms (or noindex the stubs meanwhile). *(§0.2, §4)*
16. Anti-spam hardening: flag missing `_formLoadedAt`, monitor missing-token rate, confirm Upstash live in prod; make limiter outages fail-open. *(§0.6)*
17. Focus trap + initial focus for the exit popup; hero video pause control; reduced-motion for the WhatsApp pulse. *(§5)*
18. Localize zod error messages + popup error string. *(§0.2)*
19. Decide the review-markup policy question (first-party reviews vs. visible aggregate vs. dropping aggregateRating). *(§0.3)*

**Scheduled / structural**
20. `middleware.ts` → `proxy.ts` migration with the dependency bumps. *(§8)*
21. CSP hardening: drop `'unsafe-eval'`, plan nonce-based inline scripts. *(§7)*
22. framer-motion out of the critical hero path (CSS entrances or LazyMotion). *(§3)*
23. Design-system alignment: Button/Select variants, section padding + h2 scale, cruise grid md steps. *(§6)*
24. Show IATA/licence numbers as visible text near forms and in the footer. *(§6)*
25. Keyboard support for the Services dropdown; accordion arrow keys. *(§5)*
26. Memoize blog file reads; add Resend fetch timeout; unify unconfigured-Resend logging through `logLeadFallback`. *(§0.1, §3)*
27. Decide blog pagination strategy now that the listing holds 28 posts (CLAUDE.md §6 threshold was 12). *(§4)*

---

## Appendix A — CLAUDE.md playbook status (verified in code)

| # | Task | Status |
|---|---|---|
| 1 | Remove Product schema from homepage | ✅ Done — only TravelAgency/WebSite/BlogPosting/Service/Breadcrumb/FAQ schemas exist |
| 2 | Trim Paphos meta description | ✅ Done — page now uses a different, in-range description |
| 3 | Elfsight branding link | ✅ Done — Elfsight removed entirely; native server-rendered reviews section |
| 4 | GDPR cookie consent | ✅ Mostly — banner with 3 categories, default-deny, scripts gated; ❗footer reopen link missing (privacy page only); cookie lifetime 365 d vs playbook's 6 months |
| 5 | Exit-intent once per session | ◐ Partial — session cookies for dismissed/submitted ✅, contact/quote excluded ✅; ❗fires on mobile (scroll-up trigger) though playbook says don't; no 30 s arming delay; /faq not excluded (`ExitIntentPopup.tsx:37`) |
| 6 | Blog pagination | ✅ N/A as written (no pagination) — but post count is now 28 > 12; revisit (see §4) |
| 7 | Honeypot fields hidden | ✅ Done — both live forms compliant; server rejects silently |
| 8 | Reduce external scripts | ✅ Done — analytics consent-gated, reCAPTCHA lazyOnload, Elfsight gone |
| 9 | Russian blog translations | ✅ Done — 28 posts fully paired EN↔RU with hreflang + sitemap alternates |
| 10 | AggregateRating in TravelAgency | ✅ Done (`LocalBusinessSchema.tsx:96-102`) — see §0.3 policy caveat |
| 11 | BreadcrumbList on interior pages | ✅ Done — site-wide via layout (`BreadcrumbSchema.tsx`) |
| 12 | Twitter cards on all pages | ✅ Done — every page via `buildPageMetadata` |
| 13 | Keyword-rich homepage H1 | ✅ Done — exact suggested H1 implemented (hero.title) |
| 14 | FAQ in main nav | ✅ Done (`HeaderClient.tsx:17`) |
| 15 | Article schema with author | ✅ Done — full BlogPosting JSON-LD per post |
| 16 | rel=noopener on _blank | ✅ Done — zero unsafe `target="_blank"` in src/ |
| 17 | Blog → service interlinks | ✅ Done — `TAG_TO_SERVICES` related-services block + `ServicesCrossLinks` |
| 18 | Publishing cadence | ✅ On track — 28 posts incl. several playbook-priority topics |

## Appendix B — what was checked and found healthy

Build passes clean on Node 22 · 240/240 tests · tsc clean · single-hop redirect architecture with unit tests · canonical/sitemap byte-parity · hreflang reciprocity incl. localized slug pairs · robots.txt/llms.txt/ai.txt/humans.txt with correct noindex headers · security headers (HSTS preload, XCTO, XFO, Permissions-Policy) · email HTML escaping · sanitized markdown rendering · spoof-resistant IP handling · consent-gated GA4/Yandex/FB Pixel/Clarity/Vercel Analytics · honeypot + timing + gibberish + reCAPTCHA v3 + Upstash rate-limit stack · self-healing Resend sender fallback · lead-loss prevention via structured fallback logs · skip link, landmarks, translated a11y strings · image optimization (AVIF/WebP, localPatterns, immutable caching) · self-hosted subset fonts (Latin) · code-split below-fold homepage · functional sitelinks SearchAction (`/en/blog?q=`) · IATA 14200130 + Licence 7775 in structured data · no secret leakage; clean `.env.example`.

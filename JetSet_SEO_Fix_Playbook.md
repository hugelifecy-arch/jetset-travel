# JetSet Travel — SEO Fix Playbook for Claude Code

**Date:** 2026-03-10
**Scope:** All SEO issues identified in live audit of www.jetset-travel.com (EN + RU)
**Codebase:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, next-intl
**Deployment:** Vercel (jetset-travel.vercel.app → www.jetset-travel.com)

---

## How to Use This Playbook

Each prompt below is a self-contained task for Claude Code. Run them in order — some later tasks depend on earlier ones. After each prompt, verify the build still passes with `npm run build`.

**Conventions:**
- 🔴 = Critical (indexation-blocking)
- 🟠 = High priority (directly impacts rankings)
- 🟡 = Medium priority (improves quality signals)
- 🟢 = Low priority (polish/best practice)

---

## Phase 1 — Critical Indexation Fixes (Prompts 1–4)

### Prompt 1 🔴 — Add Google Search Console Verification

**Context:** The site has Yandex (`yandex_b808235c3efb2a47.html`) and Mail.ru verification but ZERO Google Search Console verification — no meta tag, no HTML file. This is likely why Google still shows stale metadata ("AIR TICKETS - HOTELS - MONEY TRANSFERS") and has not re-crawled the new site.

**Files to edit:**
- `src/app/layout.tsx` (root layout metadata)
- `src/app/[locale]/layout.tsx` (locale layout metadata)

```
Add Google Search Console verification to the site.

1. In `src/app/layout.tsx`, add a `google` key to the `verification` object inside the exported `metadata`:
   verification: {
     yandex: "c693997a9fde5229",
     google: "PLACEHOLDER_GSC_TOKEN",
   },

2. In `src/app/[locale]/layout.tsx`, inside the `generateMetadata` function return object, add the same `google` key to the existing `verification` object:
   verification: {
     yandex: "c693997a9fde5229",
     google: "PLACEHOLDER_GSC_TOKEN",
   },

3. Add a comment above each: // TODO: Replace PLACEHOLDER_GSC_TOKEN with actual Google Search Console verification token

This outputs <meta name="google-site-verification" content="..."> in the HTML head. The site owner will replace the placeholder after verifying in GSC.

Run `npm run build` to confirm no errors.
```

---

### Prompt 2 🔴 — Add Google Analytics (GA4) via GTM-style Script

**Context:** The site only has Vercel Analytics. No Google Analytics means no integration with Google Search Console's performance data, no audience insights, and no conversion tracking. GA4 is essential for SEO monitoring.

**Files to create/edit:**
- `src/components/analytics/GoogleAnalytics.tsx` (new)
- `src/app/[locale]/layout.tsx`

```
Add a Google Analytics (GA4) component that respects cookie consent.

1. Create `src/components/analytics/GoogleAnalytics.tsx`:
   - Import `Script` from `next/script`
   - Accept a `measurementId` prop (string)
   - Render two Script tags:
     a. External: `https://www.googletagmanager.com/gtag/js?id=${measurementId}` with strategy="afterInteractive"
     b. Inline: the standard gtag config snippet with strategy="afterInteractive"
   - The component should check if `measurementId` is truthy before rendering anything
   - Read the measurement ID from `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Export as default

2. In `src/app/[locale]/layout.tsx`:
   - Import GoogleAnalytics from `@/components/analytics/GoogleAnalytics`
   - Add <GoogleAnalytics /> inside the <body> tag, right after the <Analytics /> (Vercel) component
   - The component reads the env var internally, so no props needed in the layout

3. Add a comment in GoogleAnalytics.tsx: // TODO: Set NEXT_PUBLIC_GA_MEASUREMENT_ID env var in Vercel dashboard (format: G-XXXXXXXXXX)

Do NOT add it to any .env file (secrets should stay in Vercel dashboard).
Run `npm run build` to confirm.
```

---

### Prompt 3 🔴 — Fix Blog Post Hreflang (Broken Cross-Language References)

**Context:** The sitemap and blog post pages generate hreflang alternates pointing to BOTH `/en/blog/<slug>` and `/ru/blog/<slug>` for every post, regardless of whether the post exists in both languages. For example, the Russian post `kak-vybrat-turagenstvo-pafos` generates a hreflang pointing to `/en/blog/kak-vybrat-turagenstvo-pafos` which doesn't exist (returns 404). Broken hreflang confuses Google and damages indexation.

**Files to edit:**
- `src/app/sitemap.ts`
- `src/app/[locale]/blog/[slug]/page.tsx`
- `src/lib/blog.ts`

```
Fix broken hreflang on blog posts. Currently, all blog posts generate hreflang alternates for both EN and RU using the same slug, even when the post only exists in one language. This causes 404 hreflang targets.

1. In `src/lib/blog.ts`, add a new helper function `getPostTranslationSlug(slug: string): { en?: string; ru?: string }`:
   - Given a slug, find the post
   - Check if a translation exists:
     * Look for a `translationSlug` field in the frontmatter (we'll add this for paired posts)
     * If found, return both locale slugs
     * If NOT found, return only the post's own locale slug
   - Export this function

2. In `src/lib/blog.ts`, update the `BlogPostFrontmatter` interface to add an optional field:
   translationSlug?: string;  // slug of the equivalent post in the other language

3. In `src/app/sitemap.ts`, update the `blogPages` section:
   - For each published post, check if `translationSlug` exists in frontmatter
   - If YES: generate proper cross-language alternates:
     * en → `/en/blog/${enSlug}`
     * ru → `/ru/blog/${ruSlug}`
   - If NO: generate alternates pointing ONLY to the post's own locale:
     * For an EN-only post: `en: .../en/blog/${slug}`, `x-default: .../en/blog/${slug}` — do NOT include `ru` key
     * For a RU-only post: `ru: .../ru/blog/${slug}` — do NOT include `en` or `x-default` keys
   - The `url` field should remain the full URL of the post in its own locale

4. In `src/app/[locale]/blog/[slug]/page.tsx`, update the `generateMetadata` function:
   - Currently line 43 uses `localizedAlternates(locale, `/blog/${slug}`)` which generates both en/ru hreflang
   - Instead, check if the post has a `translationSlug`:
     * If YES: use `localizedAlternates(locale, `/blog/${slug}`, { en: `/blog/${enSlug}`, ru: `/blog/${ruSlug}` })`
     * If NO: set alternates manually with only canonical for the current locale, no cross-language hreflang:
       alternates: {
         canonical: `/${locale}/blog/${slug}`,
       }

Run `npm run build` to verify. Check that `getPublishedPosts()` still returns all posts correctly.
```

---

### Prompt 4 🔴 — Force Google Re-crawl via Cache-Busting Headers

**Context:** Google is still showing the OLD site metadata. Even after the above fixes, we need to signal freshness to crawlers.

**Files to edit:**
- `next.config.ts`

```
Add cache-control headers for HTML pages that encourage Google to re-crawl.

In `next.config.ts`, inside the `headers()` function, add a new entry BEFORE the existing entries:

{
  source: "/:locale(en|ru)/:path*",
  headers: [
    {
      key: "Cache-Control",
      value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  ],
},

This tells CDN to cache for 1 hour but lets browsers always check for fresh content. It also signals to Google that content is fresh.

Also add a header for the root redirect:
{
  source: "/",
  headers: [
    {
      key: "Cache-Control",
      value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  ],
},

Run `npm run build` to verify.
```

---

## Phase 2 — Content & Translation Bugs (Prompts 5–8)

### Prompt 5 🟠 — Fix Russian Footer Double Copyright

**Context:** The Footer component renders `© {year} {t("copyright")}`. The English translation is `"JetSet Travel Cyprus. All rights reserved."` (correct). The Russian translation is `"© 2026 JetSet Travel Cyprus. Все права защищены."` which already contains `©` and the year, producing `"© 2026 © 2026 JetSet Travel Cyprus..."` on the live site.

**File to edit:**
- `src/messages/ru.json`

```
Fix the double copyright symbol in the Russian footer.

In `src/messages/ru.json`, find the "footer" section and change:
  "copyright": "© 2026 JetSet Travel Cyprus. Все права защищены."
to:
  "copyright": "JetSet Travel Cyprus. Все права защищены."

This matches the English pattern where the component template adds the © symbol and year dynamically. The current Russian string causes "© 2026 © 2026 JetSet Travel Cyprus" to render on the live site.

Run `npm run build` to verify.
```

---

### Prompt 6 🟠 — Fix Russian ServicesGrid Double Arrow

**Context:** The `ServicesGrid.tsx` component renders `{t("learnMore")} →` (appending an HTML arrow entity). The English translation is `"Learn more"` (no arrow — correct). The Russian translation at line 74 of `ru.json` is `"Подробнее →"` which already contains an arrow, producing `"Подробнее → →"` on the live site.

**File to edit:**
- `src/messages/ru.json`

```
Fix the double arrow on Russian service cards.

In `src/messages/ru.json`, in the "services" section (around line 74), find:
  "learnMore": "Подробнее →"
and change it to:
  "learnMore": "Подробнее"

The arrow `→` is already appended by the ServicesGrid component via `&rarr;`, so including it in the translation string causes a double arrow "Подробнее → →" on the Russian version of the site.

Run `npm run build` to verify.
```

---

### Prompt 7 🟠 — Translate Hardcoded English Image Alt Text

**Context:** Several components have image `alt` attributes hardcoded in English that are NOT pulled from translations. On Russian pages, this means Google sees English alt text on a Russian page, which confuses language signals and hurts Russian SEO. Affected components:

- `src/components/sections/ServicesGrid.tsx` — 5 service images with English alt text
- `src/components/sections/HeroSection.tsx` — hero background + trust badges (IATA, Tourism)
- `src/components/sections/TrustCredentialsBar.tsx` — likely has similar issues

**Files to edit:**
- `src/components/sections/ServicesGrid.tsx`
- `src/components/sections/HeroSection.tsx`
- `src/messages/en.json`
- `src/messages/ru.json`

```
Move all hardcoded English image alt text to the translation system so Russian pages get Russian alt text.

1. In `src/components/sections/ServicesGrid.tsx`:
   - The `serviceItems` array has hardcoded `imageAlt` strings in English
   - Add alt text keys to the translation system instead
   - For each service item, change `imageAlt` to `imageAltKey` with a translation key like `"flights.imageAlt"`, `"hotels.imageAlt"`, etc.
   - In the Image component, change `alt={service.imageAlt}` to `alt={t(`${service.titleKey}.imageAlt`)}`

2. Add the following translation keys to `src/messages/en.json` under the "services" section:
   For each service (flights, hotels, visa, luxury, corporate), add an "imageAlt" key:
   "flights": {
     ... existing keys ...,
     "imageAlt": "Flight booking service - JetSet Travel Paphos Cyprus"
   },
   "hotels": {
     ... existing keys ...,
     "imageAlt": "Hotel reservation service - luxury and business hotels worldwide"
   },
   "visa": {
     ... existing keys ...,
     "imageAlt": "Visa services and application assistance in Paphos Cyprus"
   },
   "luxury": {
     ... existing keys ...,
     "imageAlt": "Luxury travel planning - premium holidays from Cyprus"
   },
   "corporate": {
     ... existing keys ...,
     "imageAlt": "Corporate travel management for Cyprus businesses"
   }

3. Add the Russian equivalents to `src/messages/ru.json` under the same "services" section:
   "flights": {
     ... existing keys ...,
     "imageAlt": "Бронирование авиабилетов — JetSet Travel Пафос Кипр"
   },
   "hotels": {
     ... existing keys ...,
     "imageAlt": "Бронирование отелей — люкс и бизнес-отели по всему миру"
   },
   "visa": {
     ... existing keys ...,
     "imageAlt": "Визовые услуги и помощь с оформлением в Пафосе, Кипр"
   },
   "luxury": {
     ... existing keys ...,
     "imageAlt": "Планирование премиального отдыха — элитные туры с Кипра"
   },
   "corporate": {
     ... existing keys ...,
     "imageAlt": "Управление корпоративными поездками для компаний Кипра"
   }

4. In `src/components/sections/HeroSection.tsx`:
   - The hero image alt text "Aerial view of the Mediterranean coastline in Cyprus with turquoise waters" is hardcoded
   - The IATA badge alt "IATA Accredited Travel Agent" and tourism badge alt "Cyprus Tourism Organisation Licensed" are hardcoded
   - This component uses `useTranslations`. Add alt text keys to the "hero" namespace in both en.json and ru.json:
     EN: "heroImageAlt": "Aerial view of the Mediterranean coastline in Cyprus with turquoise waters"
         "iataAlt": "IATA Accredited Travel Agent"
         "tourismAlt": "Cyprus Tourism Organisation Licensed"
     RU: "heroImageAlt": "Вид с воздуха на средиземноморское побережье Кипра с бирюзовой водой"
         "iataAlt": "Аккредитованный агент IATA"
         "tourismAlt": "Лицензия Кипрской организации по туризму"
   - Replace the hardcoded strings with translation calls

Remove the now-unused `imageAlt` field from the `serviceItems` array in ServicesGrid.tsx.

Run `npm run build` to verify. Check that TypeScript is happy with the changes.
```

---

### Prompt 8 🟡 — Create Russian Blog Content (5 Articles)

**Context:** There are 10 published English blog posts but only 1 Russian post (`kak-vybrat-turagenstvo-pafos`). For Russian SEO (Google.ru + Yandex), we need at least 5 substantive Russian articles targeting high-value keywords.

**Files to create in `content/blog/`:**

```
Create 5 new Russian blog posts as markdown files in `content/blog/`. Each must follow the exact frontmatter format used by the existing posts. Here is the format:

---
title: "..."
description: "..."
date: "2026-03-10"
author: "JetSet Travel Team"
slug: "..."
image: "/images/blog/[reuse-an-existing-image].jpg"
category: "..."
tags:
  - tag1
  - tag2
locale: "ru"
status: "published"
---

Create these 5 articles (each 800-1200 words of quality Russian content):

1. `content/blog/korporativnye-komandirovki-kipr-gid.md`
   - Title: "Корпоративные командировки на Кипр: полное руководство для бизнеса"
   - Category: "corporate-travel"
   - Tags: кипр, корпоративные поездки, бизнес
   - Image: reuse `/images/blog/corporate-travel-tips-cyprus.jpg`
   - Content: Guide on corporate travel to/from Cyprus — visa requirements for business travelers, best hotels for meetings in Paphos/Limassol, IATA-agent advantages, invoicing/compliance, 24/7 support value proposition. Include practical tips for Russian-speaking business travelers.

2. `content/blog/shengenskaya-viza-dlya-zhitelej-kipra.md`
   - Title: "Шенгенская виза для жителей Кипра: пошаговое руководство 2026"
   - Category: "visas-guides"
   - Tags: виза, шенген, кипр
   - Image: reuse `/images/blog/schengen-visa-guide.jpg`
   - Content: Step-by-step Schengen visa guide for Cyprus residents — documents needed, appointment booking, processing times, tips for approval, how JetSet helps coordinate. Target keywords: "шенгенская виза Кипр", "виза для жителей Кипра".

3. `content/blog/luchshie-kruizy-iz-limassola-2026.md`
   - Title: "Лучшие круизы из Лимассола в 2026 году: маршруты и советы"
   - Category: "cruises"
   - Tags: круизы, лимассол, средиземноморье
   - Image: reuse `/images/blog/cruises-limassol-2026.jpg`
   - Content: Complete Russian guide to cruises from Limassol — cruise lines, popular routes (Greece, Egypt, Israel), booking tips, cabin selection, what to pack, JetSet booking advantages. Target: "круизы из Лимассола", "круизы Кипр 2026".

4. `content/blog/premialnyj-otdykh-sredizemnomorye-2026.md`
   - Title: "Премиальный отдых в Средиземноморье: топ направления 2026"
   - Category: "luxury"
   - Tags: люкс, средиземноморье, отдых
   - Image: reuse `/images/blog/luxury-mediterranean-destinations-2026.jpg`
   - Content: Top luxury Mediterranean destinations for 2026 — Santorini, Amalfi Coast, Côte d'Azur, Dubrovnik, Maldives overwater alternatives. Emphasize JetSet's concierge-level planning. Target: "премиальный отдых средиземноморье", "элитный отдых 2026".

5. `content/blog/digital-nomady-kipr-gid.md`
   - Title: "Цифровые кочевники на Кипре: виза, жизнь и практический гид"
   - Category: "cyprus"
   - Tags: цифровые кочевники, кипр, виза
   - Image: reuse `/images/blog/digital-nomads-cyprus.jpg`
   - Content: Russian guide for digital nomads in Cyprus — Digital Nomad Visa details, cost of living, coworking spaces in Paphos/Limassol, internet quality, tax implications, community. Target: "цифровые кочевники Кипр", "фриланс виза Кипр".

Write high-quality, native-sounding Russian content (not machine-translated). Use proper Russian punctuation (« » for quotes, — for dashes). Include 2-3 internal links to relevant JetSet service pages (e.g., `/ru/visa-services`, `/ru/corporate-travel`, `/ru/cruises`) naturally within each article.

Run `npm run build` to verify all posts are picked up by the blog system.
```

---

## Phase 3 — Schema & Structured Data Enhancements (Prompts 9–12)

### Prompt 9 🟠 — Add Facebook to LocalBusinessSchema sameAs

**Context:** JetSet has a Facebook page (https://www.facebook.com/JETSETCYPRUS/) with 1,135+ followers, but it's not referenced in the `sameAs` array of the LocalBusinessSchema. This weakens the entity signal to Google.

**File to edit:**
- `src/components/seo/LocalBusinessSchema.tsx`

```
Update the LocalBusinessSchema to include the Facebook page and improve social presence signals.

In `src/components/seo/LocalBusinessSchema.tsx`, find the `sameAs` array (currently line 112-115) and expand it:

sameAs: [
  "https://www.facebook.com/JETSETCYPRUS/",
  "https://wa.me/35799478073",
  "https://t.me/jetsetnotis",
],

Put Facebook first as it's the most authoritative social signal for Google's Knowledge Graph.

Run `npm run build` to verify.
```

---

### Prompt 10 🟡 — Add Organization Schema to About Page

**Context:** The About page (`src/app/[locale]/about/page.tsx`) has no structured data at all — it relies only on the global layout. Adding an Organization schema here strengthens the entity signal since About pages are where Google expects to find authoritative business information.

**Files to edit:**
- `src/app/[locale]/about/page.tsx`

```
Add Organization JSON-LD schema to the About page.

In `src/app/[locale]/about/page.tsx`:

1. Import JsonLd from `@/components/seo/JsonLd`
2. Import `getLocale` from `next-intl/server`

3. At the end of the returned JSX (before the closing fragment), add:

const locale = await getLocale();
const isRussian = locale === "ru";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JetSet K&K Travel Ltd",
  alternateName: ["JetSet Travel Cyprus", "ДжетСет Трэвел Кипр"],
  url: "https://www.jetset-travel.com",
  logo: "https://www.jetset-travel.com/images/jetset-logo.svg",
  description: isRussian
    ? "Аккредитованное IATA туристическое агентство в Пафосе, Кипр. Более 20 лет опыта в корпоративных и премиальных путешествиях."
    : "IATA-accredited travel agency in Paphos, Cyprus. Over 20 years of experience in corporate and luxury travel.",
  foundingDate: "2006",
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paphos",
      addressCountry: "CY",
    },
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "26A Agapinoros",
    addressLocality: "Paphos",
    postalCode: "8049",
    addressCountry: "CY",
  },
  telephone: "+357-99-478-073",
  email: "info@jetset.com.cy",
  legalName: "JetSet K&K Travel Ltd",
  taxID: "HE 181550",
  sameAs: [
    "https://www.facebook.com/JETSETCYPRUS/",
    "https://wa.me/35799478073",
    "https://t.me/jetsetnotis",
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "IATA Accreditation",
      recognizedBy: {
        "@type": "Organization",
        name: "International Air Transport Association",
      },
    },
  ],
};

<JsonLd data={orgSchema} />

Note: The About page is a server component using async/await pattern. Make sure to get the locale at the top of the component function (it likely already does via params).

Run `npm run build` to verify.
```

---

### Prompt 11 🟡 — Add ContactPoint Schema to Contact Page

**Context:** The Contact page has no structured data. Adding ContactPoint schema helps Google understand your communication channels and can power direct "Call" or "Message" actions in search results.

**File to edit:**
- `src/app/[locale]/contact/page.tsx` or the main content component

```
Add ContactPoint JSON-LD to the Contact page.

Find the Contact page's main server component (either `src/app/[locale]/contact/page.tsx` or its content component).

Add a JSON-LD script with this schema at the bottom of the returned JSX:

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "JetSet Travel Cyprus",
  url: "https://www.jetset-travel.com",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+357-99-478-073",
      contactType: "customer service",
      areaServed: ["CY", "GR", "RU", "AE", "GB"],
      availableLanguage: ["English", "Russian", "Greek"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
    {
      "@type": "ContactPoint",
      telephone: "+357-99-478-073",
      contactType: "emergency",
      contactOption: "TollFree",
      description: "24/7 WhatsApp support for travel disruptions",
      availableLanguage: ["English", "Russian"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "26A Agapinoros",
    addressLocality: "Paphos",
    postalCode: "8049",
    addressCountry: "CY",
  },
};

Import and use the JsonLd component from `@/components/seo/JsonLd`.

Run `npm run build` to verify.
```

---

### Prompt 12 🟡 — Add Yandex Metrica Script

**Context:** The site has Yandex Webmaster verification (`yandex_b808235c3efb2a47.html`) but no Yandex Metrica analytics. For Russian-language SEO on Yandex, Metrica is as important as GA4 is for Google — it signals to Yandex that the site is actively monitored and provides behavioral data that Yandex uses for ranking.

**Files to create/edit:**
- `src/components/analytics/YandexMetrica.tsx` (new)
- `src/app/[locale]/layout.tsx`

```
Add Yandex Metrica analytics component.

1. Create `src/components/analytics/YandexMetrica.tsx`:
   - Import `Script` from `next/script`
   - Read counter ID from `process.env.NEXT_PUBLIC_YANDEX_METRICA_ID`
   - If no ID is set, render nothing
   - Render the standard Yandex Metrica initialization script with:
     * clickmap: true
     * trackLinks: true
     * accurateTrackBounce: true
     * webvisor: true
   - Also render the noscript fallback image tag
   - Use strategy="afterInteractive"
   - Export as default

2. In `src/app/[locale]/layout.tsx`:
   - Import YandexMetrica from `@/components/analytics/YandexMetrica`
   - Add <YandexMetrica /> after the GoogleAnalytics component (from Prompt 2) inside <body>

3. Add a comment: // TODO: Set NEXT_PUBLIC_YANDEX_METRICA_ID env var in Vercel dashboard

Standard Yandex Metrica snippet structure:
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(COUNTER_ID, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });

Noscript: <img src="https://mc.yandex.ru/watch/COUNTER_ID" style="position:absolute; left:-9999px;" alt="" />

Run `npm run build` to verify.
```

---

## Phase 4 — Google Business Profile & Link Fixes (Prompts 13–14)

### Prompt 13 🟠 — Fix Google Business Profile Links

**Context:** All Google Reviews links across the site point to a generic Maps search URL (`https://www.google.com/maps/search/?api=1&query=JETSET%20TRAVEL%20AGENCY%20Paphos`) instead of a direct Google Business Profile place link. This generic URL may not resolve correctly and doesn't give Google a clear entity signal.

**Files to edit:**
- `src/components/sections/GoogleReviews.tsx`
- `src/components/sections/InlineTestimonial.tsx`

```
Update Google Business Profile links from generic search URLs to the proper format.

1. In `src/components/sections/GoogleReviews.tsx`, find the constant:
   const GOOGLE_REVIEWS_URL = "https://www.google.com/maps/search/?api=1&query=JETSET%20TRAVEL%20AGENCY%20Paphos";

   Change it to:
   const GOOGLE_REVIEWS_URL = "https://www.google.com/maps/place/JetSet+Travel+Agency/@34.7604,32.4224,17z/";

   Add a comment above: // TODO: Replace with actual Google Place ID URL once GBP is claimed (format: https://www.google.com/maps/place/?q=place_id:ChIJ...)

2. In `src/components/sections/InlineTestimonial.tsx`, find and update the same URL pattern.

3. Search for any other files containing "maps/search/?api=1&query=JETSET" and update them too. These are likely in:
   - `src/app/[locale]/luxury-travel/page.tsx`
   - `src/app/[locale]/paphos-travel-agency/page.tsx`
   - `src/app/[locale]/turisticheskoe-agentstvo-pafos/page.tsx`

Use the same updated URL everywhere for consistency.

Run `npm run build` to verify.
```

---

### Prompt 14 🟢 — Update Google Maps Embeds with Proper Place Data

**Context:** The contact page and Paphos travel agency pages embed Google Maps using generic query-based embed URLs (`maps.google.com/maps?q=26A+Agapinoros...`). These sometimes show incorrect pins. Using the proper embed API with coordinates is more reliable.

**Files to edit:**
- `src/app/[locale]/contact/ContactContent.tsx`
- `src/app/[locale]/paphos-travel-agency/page.tsx`
- `src/app/[locale]/turisticheskoe-agentstvo-pafos/page.tsx`

```
Update Google Maps embed URLs to use consistent coordinates.

In all files containing Google Maps iframes, standardize the embed URL to:
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d815.4!2d32.4224!3d34.7604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ1JzM3LjQiTiAzMsKwMjUnMjAuNiJF!5e0!3m2!1sen!2scy!4v1700000000000

The files to update are:
1. `src/app/[locale]/contact/ContactContent.tsx` — find the maps.google.com embed
2. `src/app/[locale]/paphos-travel-agency/page.tsx` — find the google.com/maps/embed
3. `src/app/[locale]/turisticheskoe-agentstvo-pafos/page.tsx` — find the google.com/maps/embed

For the Russian pages, use `!2sru!2scy` instead of `!2sen!2scy` in the embed URL to show the map in Russian.

Also ensure all map iframes have:
- loading="lazy"
- A proper title attribute: title="JetSet Travel Paphos Office Location" (EN) / title="Офис JetSet Travel в Пафосе" (RU)

Run `npm run build` to verify.
```

---

## Phase 5 — Technical SEO Polish (Prompts 15–18)

### Prompt 15 🟡 — Add Missing Pages to Sitemap

**Context:** The sitemap in `src/app/sitemap.ts` includes most pages but may be missing some of the newer Russian-slug pages and cross-locale pairs. Verify completeness.

**File to edit:**
- `src/app/sitemap.ts`

```
Audit and update the sitemap to ensure every page in the site is included.

Check every directory under `src/app/[locale]/` and verify each has a corresponding entry in `src/app/sitemap.ts`.

Current directories in the app:
- about ✓ (in pages array)
- aviabilety-kipr ✓ (in crossLocalePageDefs as ru for flight-tickets-cyprus)
- blog ✓ (in pages array)
- bronirovanie-otelej-kipr ✓ (in crossLocalePageDefs as ru for hotel-booking-cyprus)
- contact ✓
- corporate-travel ✓
- corporate-travel-cyprus ✓ (in crossLocalePageDefs)
- cruises ✓
- faq ✓
- flight-tickets-cyprus ✓ (in crossLocalePageDefs)
- hotel-booking-cyprus ✓ (in crossLocalePageDefs)
- hotel-reservations ✓
- korporativnye-poezdki-kipr ✓ (in crossLocalePageDefs)
- luxury-travel ✓
- luxury-travel-cyprus ✓ (in crossLocalePageDefs)
- luxusnyy-otdykh-kipr ✓ (in crossLocalePageDefs)
- paphos-travel-agency ✓ (handled in crossLocalePages comment)
- privacy ✓
- quote ✓
- services ✓
- terms ✓
- turisticheskoe-agentstvo-pafos ✓ (in crossLocalePageDefs)
- visa-services ✓
- visa-services-cyprus ✓ (in crossLocalePageDefs)
- vizovye-uslugi-kipr ✓ (in crossLocalePageDefs)

Verify all cross-locale page definitions are present and correct. If any are missing, add them.

Also verify that the `pages` array and `crossLocalePageDefs` together cover every route. The `paphos-travel-agency` / `turisticheskoe-agentstvo-pafos` pair should be in the crossLocalePageDefs array (not in a comment).

Run `npm run build` to verify sitemap generates correctly.
```

---

### Prompt 16 🟡 — Optimize Meta Descriptions for CTR

**Context:** While all pages have meta descriptions, some can be improved for click-through rate by including stronger calls-to-action and differentiators. Focus on the highest-traffic pages.

**Files to edit:**
- `src/app/[locale]/page.tsx` (homepage)
- `src/app/[locale]/corporate-travel/page.tsx`
- `src/app/[locale]/visa-services/page.tsx`

```
Optimize meta descriptions on the 3 highest-priority pages for better click-through rate in Google results.

1. Homepage (`src/app/[locale]/page.tsx`):
   EN current: "IATA-accredited travel agency in Paphos, Cyprus. Corporate travel management, luxury holidays, flight booking, hotel reservations, and visa services. 24/7 support. 20+ years experience."
   EN optimized (under 160 chars): "IATA-accredited travel agency in Paphos, Cyprus. Corporate travel, luxury holidays & visa services. 24/7 WhatsApp support. Free quote in 2 hours."

   RU current: "Аккредитованное IATA турагентство в Пафосе, Кипр. Корпоративные поездки, люкс-отдых, авиабилеты, бронирование отелей, визовые услуги. Поддержка 24/7. Более 20 лет опыта."
   RU optimized (under 160 chars): "Аккредитованное IATA турагентство в Пафосе. Корпоративные поездки, премиальный отдых, визы. Поддержка 24/7 в WhatsApp. Бесплатное предложение за 2 часа."

2. Corporate Travel (`src/app/[locale]/corporate-travel/page.tsx`):
   Update EN description to include "Free consultation" and "clean invoicing"
   Update RU description to include "бесплатная консультация" and "прозрачная отчётность"
   Keep under 160 characters each.

3. Visa Services (`src/app/[locale]/visa-services/page.tsx`):
   Update EN description to include "Schengen, UK, US visa assistance" if not already
   Update RU description to include "Шенген, Великобритания" for keyword targeting

Run `npm run build` to verify.
```

---

### Prompt 17 🟢 — Add Breadcrumb Microdata to Non-Homepage Pages

**Context:** The BreadcrumbSchema component exists and is included in the locale layout. Verify it generates correct JSON-LD for all page types, especially the cross-locale pages with different EN/RU slugs.

**File to check:**
- `src/components/seo/BreadcrumbSchema.tsx`
- `src/components/seo/breadcrumb-names.ts`

```
Audit the BreadcrumbSchema component to ensure correct breadcrumb generation for all pages.

1. Check `src/components/seo/breadcrumb-names.ts` to verify it has display names for ALL page slugs in BOTH languages, including:
   - aviabilety-kipr
   - bronirovanie-otelej-kipr
   - korporativnye-poezdki-kipr
   - luxusnyy-otdykh-kipr
   - vizovye-uslugi-kipr
   - turisticheskoe-agentstvo-pafos
   - corporate-travel-cyprus
   - visa-services-cyprus
   - luxury-travel-cyprus
   - flight-tickets-cyprus
   - hotel-booking-cyprus

2. Check `src/components/seo/BreadcrumbSchema.tsx` to verify:
   - It reads the current path and generates proper BreadcrumbList JSON-LD
   - The breadcrumb URLs use the CANONICAL_ORIGIN (not relative paths)
   - Blog post breadcrumbs include: Home > Blog > [Post Title]

3. If any slugs are missing from the breadcrumb names mapping, add them with proper EN and RU display names.

Run `npm run build` to verify.
```

---

### Prompt 18 🟢 — Add Preconnect/DNS-Prefetch for External Resources

**Context:** The locale layout has preconnect for `wa.me` and dns-prefetch for `maps.google.com`, but is missing preconnects for other critical external resources that will be loaded (Google Analytics, Yandex Metrica, Google Fonts if any, reCAPTCHA).

**File to edit:**
- `src/app/[locale]/layout.tsx`

```
Add preconnect and dns-prefetch hints for all external resources used by the site.

In `src/app/[locale]/layout.tsx`, inside the <head> tag, add these resource hints:

<!-- Analytics preconnects -->
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://www.google-analytics.com" />
<link rel="dns-prefetch" href="https://mc.yandex.ru" />

<!-- reCAPTCHA (if used) -->
<link rel="dns-prefetch" href="https://www.google.com" />

Keep the existing preconnect for wa.me and dns-prefetch for maps.google.com.

Order them logically: analytics first, then maps, then messaging.

Run `npm run build` to verify.
```

---

## Phase 6 — Post-Deploy Manual Steps (NOT Claude Code — for Site Owner)

These steps cannot be automated and must be done manually by the site owner after deploying the code changes:

### Step A — Google Search Console Setup
1. Go to https://search.google.com/search-console/
2. Add property: `https://www.jetset-travel.com`
3. Verify via HTML meta tag (use the token from Prompt 1)
4. Update the `PLACEHOLDER_GSC_TOKEN` in both layout files with the real token
5. Submit sitemap: `https://www.jetset-travel.com/sitemap.xml`
6. Use URL Inspection to request indexing of:
   - `/en` (homepage)
   - `/ru` (Russian homepage)
   - `/en/corporate-travel`
   - `/ru/corporate-travel`
   - All blog posts

### Step B — Google Analytics Setup
1. Create a GA4 property at https://analytics.google.com
2. Get the Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to Vercel environment variables: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
4. Redeploy

### Step C — Yandex Setup
1. Verify site in Yandex Webmaster: https://webmaster.yandex.com
2. Submit sitemap in Yandex Webmaster
3. Create Yandex Metrica counter at https://metrica.yandex.com
4. Add counter ID to Vercel env: `NEXT_PUBLIC_YANDEX_METRICA_ID=XXXXXXXX`
5. Redeploy

### Step D — Google Business Profile
1. Claim or update GBP at https://business.google.com
2. Set website URL to `https://www.jetset-travel.com`
3. Update business hours, photos, services
4. Get the Place ID from GBP and update the Google Reviews links (Prompt 13) with the real Place ID URL
5. Request reviews from recent clients

### Step E — Submit to Directories
1. CyprusInfo.ai (already listed — verify URL is current)
2. Cyprus Yellow Pages
3. TripAdvisor (create/claim listing)
4. Yandex Maps / 2GIS (for Russian audience)
5. ACTA (Association of Cyprus Travel & Tourism Agents) directory

---

## Verification Checklist

After completing all prompts, run these checks:

```bash
# Build check
npm run build

# Verify sitemap includes all pages
# After deploy, fetch https://www.jetset-travel.com/sitemap.xml and check:
# - All EN pages present
# - All RU pages present
# - All blog posts present
# - Hreflang alternates correct (no broken cross-references)

# Verify robots.txt
# After deploy, fetch https://www.jetset-travel.com/robots.txt and check:
# - Sitemap URL present
# - No accidental disallow rules

# Structured data validation
# After deploy, test these URLs in Google Rich Results Test:
# https://search.google.com/test/rich-results
# - Homepage (LocalBusiness + WebSite + Review schemas)
# - About page (Organization schema)
# - Contact page (ContactPoint schema)
# - FAQ page (FAQPage schema)
# - Any service page (Service schema)
# - Blog post (Article schema)
```

---

## Summary of All Changes

| # | Priority | Fix | Files |
|---|----------|-----|-------|
| 1 | 🔴 | Google Search Console verification | layout.tsx (×2) |
| 2 | 🔴 | Google Analytics GA4 | New component + layout |
| 3 | 🔴 | Fix broken blog hreflang | sitemap.ts, blog page, blog.ts |
| 4 | 🔴 | Cache-busting headers | next.config.ts |
| 5 | 🟠 | Fix RU double copyright | ru.json |
| 6 | 🟠 | Fix RU double arrow | ru.json |
| 7 | 🟠 | Translate image alt text | ServicesGrid, HeroSection, en/ru.json |
| 8 | 🟡 | 5 Russian blog articles | 5 new .md files |
| 9 | 🟠 | Facebook in sameAs | LocalBusinessSchema.tsx |
| 10 | 🟡 | About page Organization schema | about/page.tsx |
| 11 | 🟡 | Contact page ContactPoint schema | contact page |
| 12 | 🟡 | Yandex Metrica | New component + layout |
| 13 | 🟠 | Fix GBP links | GoogleReviews, InlineTestimonial, +3 pages |
| 14 | 🟢 | Maps embed fix | ContactContent, 2 agency pages |
| 15 | 🟡 | Sitemap completeness | sitemap.ts |
| 16 | 🟡 | CTR-optimized meta descriptions | 3 page files |
| 17 | 🟢 | Breadcrumb audit | BreadcrumbSchema, breadcrumb-names |
| 18 | 🟢 | Preconnect hints | locale layout.tsx |

# JETSET TRAVEL CYPRUS — MASTER CLAUDE CODE PLAYBOOK
## Complete Full-Stack Audit → Fix → Upgrade → SEO Domination

**Site:** www.jetset-travel.com  
**Stack:** Next.js (App Router) · Vercel · Tailwind CSS  
**Repo:** github.com/hugelifecy-arch/jetset-travel  
**Business:** JetSet K&K Travel Ltd · IATA 14200130 · Tourism Licence 7775  
**Address:** 26A Agapinoros, 8049 Paphos, Cyprus  
**Phones:** +357 99 478 073 · +357 99 310 993  
**Email:** info@jetset.com.cy  
**Languages:** English (/en) · Russian (/ru)  
**Goal:** Google Top 3 for all target keywords in both EN and RU

---

# TABLE OF CONTENTS

- [PART A — CRITICAL AUDIT FINDINGS](#part-a--critical-audit-findings)
- [PART B — PHASE 1: SEO FOUNDATIONS (Week 1)](#part-b--phase-1-seo-foundations)
- [PART C — PHASE 2: SCHEMA & STRUCTURED DATA (Week 1)](#part-c--phase-2-schema--structured-data)
- [PART D — PHASE 3: META TAGS & HEAD OPTIMIZATION (Week 1-2)](#part-d--phase-3-meta-tags--head-optimization)
- [PART E — PHASE 4: NEW LANDING PAGES (Week 2-3)](#part-e--phase-4-new-landing-pages)
- [PART F — PHASE 5: RUSSIAN LANGUAGE SEO (Week 2-3)](#part-f--phase-5-russian-language-seo)
- [PART G — PHASE 6: TECHNICAL FIXES & PERFORMANCE (Week 3-4)](#part-g--phase-6-technical-fixes--performance)
- [PART H — PHASE 7: UX & CONVERSION UPGRADES (Week 4-5)](#part-h--phase-7-ux--conversion-upgrades)
- [PART I — PHASE 8: CONTENT & BLOG INFRASTRUCTURE (Week 5-6)](#part-i--phase-8-content--blog-infrastructure)
- [PART J — PHASE 9: INTERNAL LINKING OVERHAUL (Week 6)](#part-j--phase-9-internal-linking-overhaul)
- [PART K — PHASE 10: FULL LINK AUDIT & REPAIR (Week 6)](#part-k--phase-10-full-link-audit--repair)
- [PART L — MANUAL TASKS (Not Claude Code)](#part-l--manual-tasks)

---

# PART A — CRITICAL AUDIT FINDINGS

## What Google Currently Shows for www.jetset-travel.com

```
Title:    "JETSET TRAVEL AGENCY - AIR TICKETS - HOTELS - MONEY TRANSFERS - CERTIFYING OFFICER"
Snippet:  "AIR TICKETS - HOTELS - MONEY TRANSFERS - CERTIFYING OFFICER"
```

This is STALE legacy data. The actual site title is "Travel Agency in Paphos, Cyprus | JetSet Travel — IATA Accredited" — but Google is using old cached data because:
1. No sitemap.xml exists → Google doesn't know what pages to crawl
2. No robots.txt → No crawler directives
3. No canonical tags → Google doesn't know the preferred URL
4. Old domain jetset.com.cy may still have cached content

## Full Error List

| # | Issue | Severity | Category |
|---|-------|----------|----------|
| 1 | No sitemap.xml | CRITICAL | Technical SEO |
| 2 | No robots.txt | CRITICAL | Technical SEO |
| 3 | No hreflang tags (EN↔RU) | CRITICAL | International SEO |
| 4 | No canonical tags on any page | CRITICAL | Technical SEO |
| 5 | Zero Schema.org structured data | CRITICAL | Rich Results |
| 6 | No TravelAgency schema | CRITICAL | Rich Results |
| 7 | No LocalBusiness schema | CRITICAL | Local SEO |
| 8 | No BreadcrumbList schema | HIGH | Rich Results |
| 9 | No FAQPage schema on FAQ page | HIGH | Rich Results |
| 10 | No AggregateRating / Review schema | HIGH | Rich Results |
| 11 | No Organization schema | HIGH | Rich Results |
| 12 | H1 "Travel Managed. Luxury Delivered." has zero keywords | HIGH | On-Page SEO |
| 13 | No Open Graph meta tags | HIGH | Social/Sharing |
| 14 | No Twitter Card meta tags | HIGH | Social/Sharing |
| 15 | No GDPR cookie consent banner | HIGH | Legal/Compliance |
| 16 | /en/paphos-travel-agency page missing (#1 keyword) | CRITICAL | Content Gap |
| 17 | /en/corporate-travel-cyprus page missing | CRITICAL | Content Gap |
| 18 | /en/luxury-travel-cyprus page missing | HIGH | Content Gap |
| 19 | /en/visa-services-cyprus page missing | HIGH | Content Gap |
| 20 | /en/flight-tickets-cyprus page missing | HIGH | Content Gap |
| 21 | /en/hotel-booking-cyprus page missing | MEDIUM | Content Gap |
| 22 | /en/iata-accredited-agent page missing | MEDIUM | Content Gap |
| 23 | All Russian landing pages missing from Google | CRITICAL | International SEO |
| 24 | Russian pages have zero indexation anywhere | CRITICAL | International SEO |
| 25 | No Google Maps embed on contact page | HIGH | Local SEO |
| 26 | FAQ page has questions without answers | HIGH | Content/UX |
| 27 | No breadcrumb navigation | MEDIUM | UX/SEO |
| 28 | "Flight Booking" footer link goes to /en/contact not dedicated page | MEDIUM | Internal Links |
| 29 | No cross-linking between service pages | HIGH | Internal Links |
| 30 | Blog is empty/thin — zero organic traffic contribution | HIGH | Content |
| 31 | No image WebP optimization | MEDIUM | Performance |
| 32 | Hero image 3840w without responsive srcset | MEDIUM | Performance |
| 33 | No lazy loading confirmed on below-fold images | MEDIUM | Performance |
| 34 | Trust badges too small on mobile | LOW | UX |
| 35 | No exit-intent lead capture | LOW | Conversion |
| 36 | Nav header may have contrast issues on scroll | LOW | UX |
| 37 | Domain split: jetset.com.cy vs jetset-travel.com | HIGH | SEO Authority |
| 38 | Google Business Profile shows legacy Russian branding | CRITICAL | Local SEO |
| 39 | NAP inconsistency across directories | HIGH | Local SEO |
| 40 | No Yandex Webmaster submission | HIGH | Russian SEO |
| 41 | No TripAdvisor listing | MEDIUM | Off-Page SEO |
| 42 | No service-area pages (Limassol, Nicosia, Larnaca) | MEDIUM | Content Gap |
| 43 | About page thin on content | LOW | Content |
| 44 | No 404 page optimization | LOW | UX |

---

# PART B — PHASE 1: SEO FOUNDATIONS

## PROMPT 1: Sitemap.xml + Robots.txt

```
PROJECT: JetSet Travel Cyprus (www.jetset-travel.com)
STACK: Next.js App Router on Vercel
REPO: github.com/hugelifecy-arch/jetset-travel

TASK: Create sitemap.xml and robots.txt for SEO crawling.

STEP 1 — Create /app/sitemap.ts (or sitemap.xml/route.ts) that dynamically generates sitemap.xml containing ALL pages:

English pages:
  https://www.jetset-travel.com/en                     priority 1.0  changefreq weekly
  https://www.jetset-travel.com/en/corporate-travel     priority 0.9  changefreq monthly
  https://www.jetset-travel.com/en/luxury-travel        priority 0.9  changefreq monthly
  https://www.jetset-travel.com/en/hotel-reservations   priority 0.8  changefreq monthly
  https://www.jetset-travel.com/en/visa-services        priority 0.8  changefreq monthly
  https://www.jetset-travel.com/en/cruises              priority 0.7  changefreq monthly
  https://www.jetset-travel.com/en/about                priority 0.6  changefreq monthly
  https://www.jetset-travel.com/en/contact              priority 0.7  changefreq monthly
  https://www.jetset-travel.com/en/blog                 priority 0.7  changefreq weekly
  https://www.jetset-travel.com/en/faq                  priority 0.6  changefreq monthly
  https://www.jetset-travel.com/en/quote                priority 0.7  changefreq monthly
  https://www.jetset-travel.com/en/services             priority 0.8  changefreq monthly
  https://www.jetset-travel.com/en/privacy              priority 0.3  changefreq yearly
  https://www.jetset-travel.com/en/terms                priority 0.3  changefreq yearly

Russian pages (mirror all /en pages with /ru prefix):
  https://www.jetset-travel.com/ru                      priority 1.0
  https://www.jetset-travel.com/ru/corporate-travel     priority 0.9
  https://www.jetset-travel.com/ru/luxury-travel        priority 0.9
  https://www.jetset-travel.com/ru/hotel-reservations   priority 0.8
  https://www.jetset-travel.com/ru/visa-services        priority 0.8
  https://www.jetset-travel.com/ru/cruises              priority 0.7
  https://www.jetset-travel.com/ru/about                priority 0.6
  https://www.jetset-travel.com/ru/contact              priority 0.7
  https://www.jetset-travel.com/ru/blog                 priority 0.7
  https://www.jetset-travel.com/ru/faq                  priority 0.6
  https://www.jetset-travel.com/ru/quote                priority 0.7
  https://www.jetset-travel.com/ru/services             priority 0.8
  https://www.jetset-travel.com/ru/privacy              priority 0.3
  https://www.jetset-travel.com/ru/terms                priority 0.3

IMPORTANT: When new landing pages are added later (paphos-travel-agency, corporate-travel-cyprus, etc.), they must be added to this sitemap too. Design the sitemap generation to be easily extensible — ideally loop through an array of page configs.

Include <xhtml:link rel="alternate" hreflang="en"> and <xhtml:link rel="alternate" hreflang="ru"> for each URL pair inside the sitemap.

STEP 2 — Create /app/robots.ts (or robots.txt/route.ts):

User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Sitemap: https://www.jetset-travel.com/sitemap.xml

STEP 3 — Verify both are accessible:
  https://www.jetset-travel.com/sitemap.xml
  https://www.jetset-travel.com/robots.txt

STEP 4 — Deploy to Vercel and test both URLs load correctly.
```

---

## PROMPT 2: Hreflang Tags on All Pages

```
PROJECT: JetSet Travel Cyprus
TASK: Add hreflang tags to every page for EN/RU bilingual SEO.

Every page must have these in the <head>:

<link rel="alternate" hreflang="en" href="https://www.jetset-travel.com/en{path}" />
<link rel="alternate" hreflang="ru" href="https://www.jetset-travel.com/ru{path}" />
<link rel="alternate" hreflang="x-default" href="https://www.jetset-travel.com/en{path}" />

WHERE {path} is the page path after the locale prefix.

IMPLEMENTATION:
Find the root layout.tsx (or the layout that wraps all pages) and add hreflang tags dynamically based on the current locale and pathname.

For example, if the user is on /en/corporate-travel, the head must contain:
  <link rel="alternate" hreflang="en" href="https://www.jetset-travel.com/en/corporate-travel" />
  <link rel="alternate" hreflang="ru" href="https://www.jetset-travel.com/ru/corporate-travel" />
  <link rel="alternate" hreflang="x-default" href="https://www.jetset-travel.com/en/corporate-travel" />

Use Next.js metadata API or generateMetadata() to inject these.

Also add the html lang attribute:
  <html lang="en"> for /en pages
  <html lang="ru"> for /ru pages

VERIFY: View page source on every page and confirm hreflang tags are present and correct.
Deploy to Vercel.
```

---

## PROMPT 3: Canonical Tags + URL Normalization

```
PROJECT: JetSet Travel Cyprus
TASK: Add canonical URLs to every page and handle URL normalization.

STEP 1 — Add <link rel="canonical"> to every page via the root layout or generateMetadata():

For /en/corporate-travel:
  <link rel="canonical" href="https://www.jetset-travel.com/en/corporate-travel" />

For /ru/corporate-travel:
  <link rel="canonical" href="https://www.jetset-travel.com/ru/corporate-travel" />

Rules:
- Always use https://www.jetset-travel.com (with www)
- Never include trailing slashes
- Always include the full absolute URL
- The canonical must match the current page URL exactly

STEP 2 — Add trailing slash redirect middleware:
If someone visits /en/corporate-travel/ (with trailing slash), 301 redirect to /en/corporate-travel

STEP 3 — Add www redirect:
If someone visits jetset-travel.com (without www), 301 redirect to www.jetset-travel.com
(This may need Vercel project settings or next.config.js redirect rules)

STEP 4 — Add root redirect:
/ should 301 redirect to /en (the default locale)

STEP 5 — Handle the old domain:
Add a redirect rule: jetset.com.cy → www.jetset-travel.com (this will need DNS config — note it as a manual task if not possible in code)

Deploy and verify canonical tags appear correctly on every page.
```

---

# PART C — PHASE 2: SCHEMA & STRUCTURED DATA

## PROMPT 4: Schema.org JSON-LD (All Types)

```
PROJECT: JetSet Travel Cyprus
TASK: Add comprehensive Schema.org JSON-LD structured data to the entire site.

Create a component (e.g., components/StructuredData.tsx or components/JsonLd.tsx) that injects JSON-LD scripts into the page <head>.

SCHEMA 1 — TravelAgency + LocalBusiness (on EVERY page):
{
  "@context": "https://schema.org",
  "@type": ["TravelAgency", "LocalBusiness"],
  "@id": "https://www.jetset-travel.com/#organization",
  "name": "JetSet Travel Cyprus",
  "alternateName": "JetSet K&K Travel Ltd",
  "url": "https://www.jetset-travel.com",
  "logo": "https://www.jetset-travel.com/images/jetset-logo.svg",
  "image": "https://www.jetset-travel.com/images/hero-bg.jpg",
  "description": "IATA-accredited travel agency in Paphos, Cyprus. Corporate travel management, luxury travel planning, flight booking, hotel reservations, visa services, and cruise booking. Serving Cyprus since 2006.",
  "telephone": ["+357 99 478 073", "+357 99 310 993"],
  "email": "info@jetset.com.cy",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "26A Agapinoros",
    "addressLocality": "Paphos",
    "postalCode": "8049",
    "addressCountry": "CY"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 34.7754,
    "longitude": 32.4244
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer",
  "areaServed": [
    {"@type": "City", "name": "Paphos"},
    {"@type": "City", "name": "Limassol"},
    {"@type": "City", "name": "Nicosia"},
    {"@type": "City", "name": "Larnaca"},
    {"@type": "Country", "name": "Cyprus"}
  ],
  "sameAs": [
    "https://t.me/jetsetnotis",
    "https://wa.me/35799478073"
  ],
  "founder": {
    "@type": "Person",
    "name": "Notis"
  },
  "foundingDate": "2006",
  "legalName": "JetSet K&K Travel Ltd",
  "taxID": "HE 181550",
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "IATA Accreditation",
      "recognizedBy": {
        "@type": "Organization",
        "name": "International Air Transport Association"
      }
    }
  ],
  "knowsLanguage": ["en", "ru", "el"]
}

SCHEMA 2 — WebSite with SearchAction (on homepage only):
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "JetSet Travel Cyprus",
  "url": "https://www.jetset-travel.com",
  "inLanguage": ["en", "ru"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.jetset-travel.com/en/blog?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

SCHEMA 3 — BreadcrumbList (on EVERY page except homepage):
Generate dynamically based on URL path.
Example for /en/corporate-travel:
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.jetset-travel.com/en"},
    {"@type": "ListItem", "position": 2, "name": "Corporate Travel", "item": "https://www.jetset-travel.com/en/corporate-travel"}
  ]
}

SCHEMA 4 — Service (on each service page):
For /en/corporate-travel:
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Corporate Travel Management",
  "provider": {"@id": "https://www.jetset-travel.com/#organization"},
  "areaServed": {"@type": "Country", "name": "Cyprus"},
  "description": "Policy-compliant corporate travel management for Cyprus businesses. Flight booking, hotel reservations, 24/7 disruption support, and clean invoicing.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "EUR"
  }
}

Create similar Service schemas for: luxury-travel, hotel-reservations, visa-services, cruises.

SCHEMA 5 — AggregateRating (on homepage):
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": "https://www.jetset-travel.com/#organization",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "3",
    "bestRating": "5",
    "worstRating": "1"
  }
}

NOTE: Update reviewCount as real Google reviews accumulate.

SCHEMA 6 — Review (on homepage, for each testimonial):
{
  "@context": "https://schema.org",
  "@type": "Review",
  "author": {"@type": "Person", "name": "Maria K."},
  "datePublished": "2025-09",
  "reviewBody": "We had a last-minute cancellation during a critical meeting week in Frankfurt. JetSet rerouted our entire 4-person team the same day.",
  "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5"},
  "itemReviewed": {"@id": "https://www.jetset-travel.com/#organization"}
}

Add similar for Andreas P. (2025-06) and Dmitry S. (2025-03).

SCHEMA 7 — FAQPage (on /en/faq and /ru/faq):
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is JetSet Travel IATA accredited?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. JetSet Travel is a fully IATA-accredited travel agency (IATA code: 14200130) based in Paphos, Cyprus. This means we issue tickets directly through the Global Distribution System and you get guaranteed fares with full consumer protection."
      }
    },
    {
      "@type": "Question",
      "name": "What services does JetSet Travel offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer corporate travel management, luxury travel planning, flight booking, hotel reservations, visa services, cruise booking, and 24/7 travel disruption support. We serve both corporate and leisure clients across Cyprus and internationally."
      }
    },
    {
      "@type": "Question",
      "name": "Where is JetSet Travel located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our office is at 26A Agapinoros, 8049 Paphos, Cyprus. We serve clients across all Cyprus cities including Paphos, Limassol, Nicosia, and Larnaca, as well as international clients."
      }
    },
    {
      "@type": "Question",
      "name": "Does JetSet Travel provide visa assistance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We provide comprehensive visa assistance including document checklists, application guidance, and coordination support for Schengen visas, UK visas, US visas, UAE visas, and business visas for all nationalities."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly does JetSet Travel respond to quote requests?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our average response time is under 2 hours during business hours. For urgent corporate travel needs, we offer 24/7 WhatsApp support with real-time rebooking capability."
      }
    },
    {
      "@type": "Question",
      "name": "Can JetSet Travel help with corporate travel for my company?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. We provide full corporate travel management including policy-compliant bookings, consolidated invoicing, duty of care compliance, negotiated corporate rates, and 24/7 disruption handling. We serve 520+ corporate clients across law, finance, healthcare, technology, and real estate sectors."
      }
    }
  ]
}

Create a Russian version for /ru/faq with translated questions and answers.

IMPLEMENTATION:
- Create a reusable JsonLd component that accepts schema data as props
- Import and use it in each page's layout or page component
- The Organization/LocalBusiness schema goes in the root layout (every page)
- Service schemas go on their respective service pages
- FAQ schema goes on /en/faq and /ru/faq
- BreadcrumbList goes on every page except homepage
- AggregateRating + Reviews go on homepage

VERIFY: Use Google's Rich Results Test (https://search.google.com/test/rich-results) to validate each page.
Deploy to Vercel.
```

---

# PART D — PHASE 3: META TAGS & HEAD OPTIMIZATION

## PROMPT 5: Meta Tags, OG Tags, Twitter Cards for All Pages

```
PROJECT: JetSet Travel Cyprus
TASK: Add optimized meta titles, descriptions, Open Graph tags, and Twitter Card tags to every page in both EN and RU.

Use Next.js generateMetadata() or the metadata export in each page file.

=== ENGLISH PAGES ===

PAGE: /en (Homepage)
  title: "Travel Agency in Paphos, Cyprus | JetSet Travel — IATA Accredited"
  description: "IATA-accredited travel agency in Paphos, Cyprus. Corporate travel, luxury holidays, flights, hotels, visa services & 24/7 support. Serving Cyprus since 2006. Get a free quote."
  og:title: "JetSet Travel Cyprus — Your IATA-Accredited Travel Partner in Paphos"
  og:description: "Corporate travel management, luxury holidays, flight booking, hotel reservations & visa services. 24/7 WhatsApp support. 520+ corporate clients."
  og:image: "https://www.jetset-travel.com/images/hero-bg.jpg"
  og:url: "https://www.jetset-travel.com/en"
  og:type: "website"
  og:locale: "en_GB"
  og:locale:alternate: "ru_RU"
  og:site_name: "JetSet Travel Cyprus"
  twitter:card: "summary_large_image"
  twitter:title: "JetSet Travel Cyprus — IATA Accredited Travel Agency Paphos"
  twitter:description: "Corporate & luxury travel management from Paphos, Cyprus. Flights, hotels, visas, 24/7 support."
  twitter:image: "https://www.jetset-travel.com/images/hero-bg.jpg"

PAGE: /en/corporate-travel
  title: "Corporate Travel Management Cyprus | Business Travel — JetSet Travel"
  description: "Corporate travel management for Cyprus businesses. Policy-compliant bookings, clean invoicing, 24/7 disruption support, negotiated rates. IATA accredited. Paphos, Limassol, Nicosia."
  og:title: "Corporate Travel Management Cyprus — JetSet Travel"
  og:description: "Policy-compliant itineraries, clean invoicing, 24/7 rebooking. IATA accredited corporate TMC serving all Cyprus."

PAGE: /en/luxury-travel
  title: "Luxury Travel Agency Cyprus | Premium Holidays — JetSet Travel Paphos"
  description: "Luxury travel planning from Cyprus. Suite-level hotels, private transfers, curated multi-city journeys, honeymoon packages. Your premium travel partner since 2006."
  og:title: "Luxury Travel from Cyprus — JetSet Travel"
  og:description: "Bespoke luxury holidays, private transfers, 5-star hotels. Curated by your personal travel team in Paphos."

PAGE: /en/hotel-reservations
  title: "Hotel Reservations Cyprus | Corporate & Leisure Rates — JetSet Travel"
  description: "Hotel reservations worldwide with negotiated corporate rates. Luxury hotels, business hotels, resort bookings. Clean invoicing. JetSet Travel Paphos, Cyprus."
  og:title: "Hotel Reservations — JetSet Travel Cyprus"
  og:description: "Negotiated hotel rates for corporate and leisure. Worldwide booking with compliant invoicing."

PAGE: /en/visa-services
  title: "Visa Services Cyprus | Schengen, UK, US Visa Help — JetSet Travel Paphos"
  description: "Professional visa services in Paphos, Cyprus. Schengen visa, UK visa, US visa, business visa assistance. Document preparation, application guidance. Free consultation."
  og:title: "Visa Services — JetSet Travel Paphos"
  og:description: "Expert visa assistance: Schengen, UK, US, UAE. Document checklists and application coordination."

PAGE: /en/cruises
  title: "Cruise Booking Cyprus | Mediterranean Cruises — JetSet Travel Paphos"
  description: "Book cruises from Cyprus. Mediterranean, Greek Islands, Caribbean. All major cruise lines. IATA accredited. JetSet Travel, Paphos."
  og:title: "Cruise Booking from Cyprus — JetSet Travel"
  og:description: "Mediterranean and worldwide cruise booking from Cyprus. All major cruise lines."

PAGE: /en/about
  title: "About JetSet Travel Cyprus | IATA Accredited Since 2006 — Paphos"
  description: "JetSet K&K Travel Ltd — IATA accredited travel agency in Paphos, Cyprus since 2006. Tourism Licence 7775. 520+ corporate clients. Meet our team."
  og:title: "About JetSet Travel — 20+ Years in Paphos, Cyprus"
  og:description: "IATA accredited since 2006. Tourism Licence 7775. 520+ corporate clients across Cyprus."

PAGE: /en/contact
  title: "Contact JetSet Travel Paphos | Get a Free Quote — Cyprus"
  description: "Contact JetSet Travel at 26A Agapinoros, Paphos, Cyprus. Call +357 99 478 073, WhatsApp, or request a free quote. Average response: under 2 hours."
  og:title: "Contact JetSet Travel Paphos"
  og:description: "26A Agapinoros, 8049 Paphos. Call +357 99 478 073 or WhatsApp for a free travel quote."

PAGE: /en/blog
  title: "Travel Blog | Cyprus Travel Tips & Guides — JetSet Travel"
  description: "Travel tips, Cyprus guides, visa information, flight deals, and corporate travel insights from JetSet Travel Paphos."

PAGE: /en/faq
  title: "FAQ | JetSet Travel Cyprus — Common Travel Questions Answered"
  description: "Frequently asked questions about JetSet Travel Cyprus. IATA accreditation, visa services, corporate travel, booking process, and more. Paphos travel agency."

PAGE: /en/quote
  title: "Get a Free Travel Quote | JetSet Travel Cyprus — Paphos"
  description: "Request a free travel quote from JetSet Travel. Corporate travel, luxury holidays, flights, hotels, visas. Average response under 2 hours."

PAGE: /en/services
  title: "Travel Services | Corporate, Luxury, Flights, Hotels, Visas — JetSet Travel Cyprus"
  description: "Full-service travel agency in Paphos, Cyprus. Corporate travel, luxury holidays, flight booking, hotel reservations, visa services, cruises. IATA accredited."

=== RUSSIAN PAGES ===

PAGE: /ru (Homepage)
  title: "Турагентство в Пафосе, Кипр | JetSet Travel — Аккредитация IATA"
  description: "Турагентство с аккредитацией IATA в Пафосе, Кипр. Корпоративные поездки, люкс отдых, авиабилеты, отели, визовые услуги. Работаем с 2006 года. Бесплатная консультация."
  og:locale: "ru_RU"
  og:locale:alternate: "en_GB"

PAGE: /ru/corporate-travel
  title: "Корпоративные Поездки Кипр | Деловой Туризм — JetSet Travel"
  description: "Управление корпоративными поездками на Кипре. Бронирование в соответствии с политикой компании, чистые счета, поддержка 24/7. Аккредитация IATA. Пафос, Лимассол, Никосия."

PAGE: /ru/luxury-travel
  title: "Люкс Турагентство Кипр | Премиум Отдых — JetSet Travel Пафос"
  description: "Планирование люкс путешествий с Кипра. Отели высшего класса, приватные трансферы, индивидуальные маршруты. Ваш премиум партнёр с 2006 года."

PAGE: /ru/hotel-reservations
  title: "Бронирование Отелей Кипр | Корпоративные Тарифы — JetSet Travel"
  description: "Бронирование отелей по всему миру с корпоративными тарифами. Люкс отели, бизнес отели. Чистые счета. JetSet Travel Пафос, Кипр."

PAGE: /ru/visa-services
  title: "Визовые Услуги Кипр | Шенген, UK, US Виза — JetSet Travel Пафос"
  description: "Профессиональные визовые услуги в Пафосе, Кипр. Шенгенская виза, виза UK, US, бизнес виза. Подготовка документов. Бесплатная консультация."

PAGE: /ru/cruises
  title: "Круизы из Кипра | Средиземноморские Круизы — JetSet Travel Пафос"
  description: "Бронирование круизов с Кипра. Средиземноморье, Греческие острова, Карибы. Все крупные круизные линии."

PAGE: /ru/about
  title: "О JetSet Travel Кипр | Аккредитация IATA с 2006 — Пафос"
  description: "JetSet K&K Travel Ltd — турагентство с аккредитацией IATA в Пафосе, Кипр с 2006 года. Лицензия 7775. 520+ корпоративных клиентов."

PAGE: /ru/contact
  title: "Контакты JetSet Travel Пафос | Бесплатная Консультация — Кипр"
  description: "Свяжитесь с JetSet Travel: 26A Агапинорос, Пафос, Кипр. Звоните +357 99 478 073, WhatsApp. Ответ в течение 2 часов."

PAGE: /ru/faq
  title: "Вопросы и Ответы | JetSet Travel Кипр — Частые Вопросы"
  description: "Часто задаваемые вопросы о JetSet Travel Кипр. Аккредитация IATA, визовые услуги, корпоративные поездки, процесс бронирования."

PAGE: /ru/blog
  title: "Блог о Путешествиях | Советы и Гиды по Кипру — JetSet Travel"
  description: "Советы по путешествиям, гиды по Кипру, визовая информация, акции на авиабилеты от JetSet Travel Пафос."

ALSO ADD TO ALL PAGES:
  <meta name="geo.region" content="CY-06" />
  <meta name="geo.placename" content="Paphos" />
  <meta name="geo.position" content="34.7754;32.4244" />
  <meta name="ICBM" content="34.7754, 32.4244" />

Deploy to Vercel. Verify by viewing page source on each page.
```

---

# PART E — PHASE 4: NEW LANDING PAGES

## PROMPT 6: Create /en/paphos-travel-agency (THE #1 Money Page)

```
PROJECT: JetSet Travel Cyprus
TASK: Create a new SEO landing page at /en/paphos-travel-agency — this is the single most important page for ranking #1 for "travel agency paphos".

Create the route: /app/[locale]/paphos-travel-agency/page.tsx

PAGE METADATA:
  title: "Travel Agency in Paphos | IATA Accredited — JetSet Travel Cyprus"
  description: "Looking for a trusted travel agency in Paphos? JetSet Travel is IATA accredited with 20+ years experience. Flights, hotels, visa services, corporate & luxury travel. Visit us at 26A Agapinoros."

PAGE CONTENT STRUCTURE:
Match the existing site design system (Tailwind, same typography, same color scheme, same component patterns).

SECTION 1 — Hero
  H1: "Trusted Travel Agency in Paphos, Cyprus"
  Subtext: "IATA-accredited since 2006. Corporate travel, luxury holidays, flights, hotels, visa services — everything handled by one accountable team in Paphos."
  CTA buttons: "Get a Free Quote" → /en/quote  |  "Call Us" → tel:+35799478073
  Background: Use the same hero image pattern as homepage or a Paphos-themed image

SECTION 2 — "Full-Service Travel Agency in Paphos"
  H2: "Full-Service Travel Agency in Paphos"
  Content (200 words): Describe JetSet as the premier travel agency in Paphos, mention IATA accreditation code 14200130, Tourism Licence 7775, 20+ years of operation from 26A Agapinoros. Mention serving both corporate clients and leisure travellers in English and Russian. Include natural keyword variations: "travel agent in Paphos", "Paphos travel agency", "IATA travel agent Paphos".

SECTION 3 — "Our Travel Services in Paphos"
  H2: "Our Travel Services in Paphos"
  6 service cards (same design as homepage) linking to respective service pages:
  - Corporate Travel → /en/corporate-travel
  - Luxury Travel → /en/luxury-travel
  - Flight Booking → /en/corporate-travel (or future flights page)
  - Hotel Reservations → /en/hotel-reservations
  - Visa Services → /en/visa-services
  - Cruise Booking → /en/cruises

SECTION 4 — "Why Paphos Businesses Choose JetSet"
  H2: "Why Paphos Businesses Choose JetSet"
  4 value props with icons:
  - IATA Accredited — direct ticket issuance, guaranteed fares
  - 24/7 WhatsApp Support — real-time disruption handling
  - Bilingual Service — English and Russian
  - 20+ Years Experience — trusted by 520+ corporate clients
  Stats bar: 520+ Corporate Clients | 20+ Years | 24/7 Support | 98% Satisfaction

SECTION 5 — "Visit Our Paphos Office"
  H2: "Visit Our Paphos Office"
  - Address: 26A Agapinoros, 8049 Paphos, Cyprus
  - Phone: +357 99 478 073
  - Email: info@jetset.com.cy
  - Opening Hours: Mon-Fri 9:00-18:00
  - Google Maps embed (iframe) centered on the office location: 34.7754, 32.4244
  - Trust badges: IATA logo, Tourism Organisation logo

SECTION 6 — "What Our Paphos Clients Say"
  H2: "What Our Paphos Clients Say"
  Reuse the 3 testimonials from homepage (Maria K., Andreas P., Dmitry S.) with star ratings

SECTION 7 — FAQ
  H2: "Frequently Asked Questions About Travel Agencies in Paphos"
  Use an accordion/expandable UI. Include these Q&As:

  Q: "Is JetSet Travel the only IATA-accredited agency in Paphos?"
  A: "JetSet Travel is one of the few fully IATA-accredited travel agencies in Paphos (code: 14200130). IATA accreditation means we issue airline tickets directly through the Global Distribution System, giving you access to the best available fares with full consumer protection."

  Q: "What areas does JetSet Travel serve from Paphos?"
  A: "While our office is in Paphos, we serve clients across all of Cyprus including Limassol, Nicosia, and Larnaca. We also handle international corporate travel and luxury holidays for clients worldwide."

  Q: "Does JetSet Travel offer Russian-language service?"
  A: "Yes. We provide full bilingual service in English and Russian, making us the go-to travel agency in Paphos for the Russian-speaking community."

  Q: "How do I get a travel quote from JetSet?"
  A: "You can request a free quote through our website, WhatsApp (+357 99 478 073), or by visiting our Paphos office at 26A Agapinoros. Our average response time is under 2 hours."

  Q: "Why should I use a travel agency instead of booking online?"
  A: "A professional travel agency like JetSet saves you time (we compare all options for you), money (IATA negotiated rates + corporate deals), and stress (24/7 support when things go wrong). Plus you get one clean invoice instead of receipts from multiple platforms."

  Add FAQPage schema for these questions (see Schema prompt above).

SECTION 8 — CTA
  H2: "Ready to Work with Paphos's Trusted Travel Agency?"
  Quote form (same as homepage form) or link to /en/quote
  WhatsApp and phone quick links

INTERNAL LINKS to include on this page:
  → /en/corporate-travel
  → /en/luxury-travel
  → /en/visa-services
  → /en/hotel-reservations
  → /en/cruises
  → /en/about
  → /en/contact
  → /en/faq

Add this page to the sitemap.xml.
Add it to the footer Quick Links section.
Add breadcrumb: Home > Travel Agency Paphos

Deploy to Vercel.
```

---

## PROMPT 7: Create /en/corporate-travel-cyprus

```
PROJECT: JetSet Travel Cyprus
TASK: Create a new SEO landing page at /en/corporate-travel-cyprus targeting "corporate travel cyprus" and "business travel cyprus" keywords.

Create route: /app/[locale]/corporate-travel-cyprus/page.tsx

METADATA:
  title: "Corporate Travel Agency Cyprus | Business Travel Management — JetSet Travel"
  description: "Corporate travel management across Cyprus. Policy-compliant bookings, 24/7 disruption support, clean invoicing. IATA accredited. Serving Paphos, Limassol, Nicosia & Larnaca."

CONTENT STRUCTURE (match existing site design):

H1: "Corporate Travel Management Across Cyprus"
Subtext: "From Paphos to Nicosia — one IATA-accredited team managing all your business travel with policy compliance, consolidated invoicing, and 24/7 disruption support."

H2: "Corporate Travel Services for Cyprus Businesses"
  200 words covering: flight booking, hotel reservations, ground transport, visa coordination for business travellers. Naturally include "corporate travel Cyprus", "business travel agency Cyprus", "travel management company Cyprus".

H2: "Cities We Serve Across Cyprus"
  Cards for: Paphos (HQ), Limassol, Nicosia, Larnaca — each with brief description of business activity and how JetSet serves corporate clients there.

H2: "How Corporate Travel Management Works"
  5-step process:
  1. Tell us your route, dates, and policy requirements
  2. We search GDS + negotiated rates for best options
  3. You approve — we book and issue tickets
  4. We send one clean invoice to your finance team
  5. 24/7 support — if anything changes, we handle it

H2: "Industries We Serve"
  Grid: Law | Finance | Technology | Healthcare | Real Estate | Import/Export | Shipping | Professional Services

H2: "Corporate Travel Comparison: DIY vs JetSet"
  Two-column comparison table (same as homepage "Why Not Book Yourself" section)

H2: "Corporate Travel FAQs for Cyprus Companies"
  5 Q&As with FAQPage schema:
  - "How much does corporate travel management cost?"
  - "Do you offer monthly invoicing?"
  - "Can you manage travel for teams of 50+ people?"
  - "Do you handle visa requirements for business travel?"
  - "What happens if a flight is cancelled?"

CTA: "Book a Corporate Travel Consultation" → /en/contact?type=corporate

Internal links to: /en/visa-services, /en/hotel-reservations, /en/paphos-travel-agency, /en/about

Add to sitemap.xml. Add breadcrumb. Deploy.
```

---

## PROMPT 8: Create /en/visa-services-cyprus

```
PROJECT: JetSet Travel Cyprus
TASK: Create SEO landing page at /en/visa-services-cyprus targeting "visa services cyprus" and "schengen visa paphos".

Create route: /app/[locale]/visa-services-cyprus/page.tsx

METADATA:
  title: "Visa Services Cyprus | Schengen & Business Visa Assistance — JetSet Travel"
  description: "Professional visa services in Paphos, Cyprus. Schengen visa, UK visa, US visa, business & tourist visa assistance. Document preparation and application guidance."

CONTENT:

H1: "Visa Services in Cyprus — Expert Application Assistance"

H2: "Visa Types We Assist With"
  Cards: Schengen Visa | UK Visa | US Visa | UAE Visa | Business Visa | Tourist Visa | Student Visa
  Each with brief description of requirements and processing time.

H2: "How Our Visa Service Works"
  5-step process: Consultation → Document Checklist → Application Preparation → Submission Coordination → Follow-up

H2: "Schengen Visa from Cyprus — Complete Guide"
  300 words: Requirements, documents needed, processing time, cost, tips for approval. This section targets the high-volume keyword "schengen visa from cyprus".

H2: "Common Visa Requirements by Destination"
  Table with key destinations and their requirements summary.

H2: "Visa FAQs"
  8 Q&As with FAQPage schema covering processing times, costs, refusals, Schengen rules, multiple-entry visas, etc.

H2: "Why Use a Travel Agent for Visa Applications"
  Benefits: We know what embassies want, we prepare bulletproof documentation, we coordinate appointments, we handle complex cases.

CTA: "Get Visa Assistance" → /en/contact?type=visa

Internal links to: /en/corporate-travel, /en/paphos-travel-agency, /en/contact
Add to sitemap. Deploy.
```

---

## PROMPT 9: Create /en/luxury-travel-cyprus, /en/flight-tickets-cyprus, /en/hotel-booking-cyprus

```
PROJECT: JetSet Travel Cyprus
TASK: Create 3 more SEO landing pages. Use the same design system and patterns as the pages above.

PAGE 1: /en/luxury-travel-cyprus
  title: "Luxury Travel Agency Cyprus | Premium Holidays — JetSet Travel"
  description: "Luxury travel planning from Cyprus. 5-star hotels, private transfers, bespoke itineraries, honeymoon packages. Your premium travel partner in Paphos."
  H1: "Luxury Travel Agency in Cyprus — Bespoke Premium Holidays"
  Sections: Luxury service overview, Popular destinations (Maldives, Santorini, Dubai, Seychelles, Swiss Alps), What's included (private transfers, suite upgrades, concierge), Honeymoon & celebration travel, Luxury travel FAQs, CTA
  Internal links: /en/hotel-reservations, /en/cruises, /en/paphos-travel-agency

PAGE 2: /en/flight-tickets-cyprus
  title: "Flight Tickets from Cyprus | Paphos & Larnaca Flights — JetSet Travel"
  description: "Book flights from Cyprus with IATA-accredited JetSet Travel. Best fares from Paphos (PFO) and Larnaca (LCA) airports. Business class deals, group bookings."
  H1: "Flight Tickets from Cyprus — Best Fares from Paphos & Larnaca"
  Sections: Why book through IATA agent, Flights from Paphos Airport (PFO) — major routes, Flights from Larnaca Airport (LCA), Business & first class, Group bookings, Flight booking FAQs, CTA
  Internal links: /en/corporate-travel, /en/luxury-travel, /en/paphos-travel-agency

PAGE 3: /en/hotel-booking-cyprus
  title: "Hotel Booking Cyprus | Corporate & Leisure Rates — JetSet Travel"
  description: "Hotel reservations in Cyprus and worldwide. Negotiated corporate rates, luxury hotel partners. Clean invoicing. JetSet Travel Paphos."
  H1: "Hotel Booking in Cyprus — Corporate & Leisure Rates"
  Sections: Why book through agent, Hotels in Paphos, Hotels in Limassol, Corporate hotel programs, Luxury hotel partners, FAQs, CTA
  Internal links: /en/corporate-travel, /en/luxury-travel, /en/paphos-travel-agency

Add all 3 to sitemap.xml. Add breadcrumbs. Deploy.
```

---

# PART F — PHASE 5: RUSSIAN LANGUAGE SEO

## PROMPT 10: Create All Russian Landing Pages

```
PROJECT: JetSet Travel Cyprus
TASK: Create Russian-language equivalents for ALL new landing pages. This is CRITICAL — Russian search has zero visibility currently.

For EACH English landing page created in Prompts 6-9, create the Russian equivalent at the /ru/ prefix with FULLY TRANSLATED content (not just machine translation — natural, fluent Russian).

PAGES TO CREATE:

1. /ru/turisticheskoe-agentstvo-pafos (= /en/paphos-travel-agency)
   title: "Турагентство в Пафосе, Кипр | JetSet Travel — Аккредитация IATA"
   description: "Ищете надёжное турагентство в Пафосе? JetSet Travel — аккредитация IATA, 20+ лет опыта. Авиабилеты, отели, визы, корпоративные и люкс поездки. 26A Агапинорос, Пафос."
   H1: "Надёжное Турагентство в Пафосе, Кипр"
   Translate all sections from English equivalent. FAQPage schema in Russian.

2. /ru/korporativnye-poezdki-kipr (= /en/corporate-travel-cyprus)
   title: "Корпоративные Поездки Кипр | Деловой Туризм — JetSet Travel"
   description: "Управление корпоративными поездками на Кипре. Бронирование, чистые счета, поддержка 24/7. IATA. Пафос, Лимассол, Никосия, Ларнака."
   H1: "Корпоративные Поездки по Кипру"

3. /ru/vizovye-uslugi-kipr (= /en/visa-services-cyprus)
   title: "Визовые Услуги Кипр | Шенгенская Виза Пафос — JetSet Travel"
   description: "Профессиональные визовые услуги в Пафосе, Кипр. Шенгенская виза, UK, US, бизнес виза. Подготовка документов. Бесплатная консультация."
   H1: "Визовые Услуги на Кипре — Помощь с Оформлением"

4. /ru/luxusnyy-otdykh-kipr (= /en/luxury-travel-cyprus)
   title: "Люкс Отдых Кипр | Премиум Путешествия — JetSet Travel Пафос"
   H1: "Люкс Турагентство на Кипре — Премиум Отдых"

5. /ru/aviabilety-kipr (= /en/flight-tickets-cyprus)
   title: "Авиабилеты из Кипра | Рейсы из Пафоса и Ларнаки — JetSet Travel"
   H1: "Авиабилеты из Кипра — Лучшие Цены из Пафоса и Ларнаки"

6. /ru/bronirovanie-otelej-kipr (= /en/hotel-booking-cyprus)
   title: "Бронирование Отелей Кипр | Корпоративные Тарифы — JetSet Travel"
   H1: "Бронирование Отелей на Кипре"

IMPORTANT:
- Each Russian page must have hreflang tags pointing to its English equivalent and vice versa
- Each must have proper lang="ru" in the html tag
- Each must have Russian FAQPage schema where applicable
- Each must have BreadcrumbList schema in Russian ("Главная > Турагентство Пафос")
- Add ALL to sitemap.xml with hreflang alternates

Update the sitemap generator to include all new Russian pages.
Deploy to Vercel.
```

---

# PART G — PHASE 6: TECHNICAL FIXES & PERFORMANCE

## PROMPT 11: Image Optimization

```
PROJECT: JetSet Travel Cyprus
TASK: Optimize all images for performance and SEO.

STEP 1 — Audit all images in /public/images/ and any other image directories. List every image with its current file size and format.

STEP 2 — Ensure all <Image> components use Next.js Image optimization:
  - Use next/image for all images
  - Set appropriate width/height or use fill with sizes prop
  - Add descriptive alt text with keywords for every image:

  Hero image: alt="Aerial view of Mediterranean coastline in Paphos, Cyprus — JetSet Travel"
  Flights service: alt="Flight booking service — JetSet Travel agency Paphos Cyprus"
  Hotels service: alt="Hotel reservation service — luxury and business hotels worldwide"
  Visa service: alt="Visa application assistance services in Paphos Cyprus"
  Luxury service: alt="Luxury travel planning — premium holidays from Cyprus"
  Corporate service: alt="Corporate travel management for businesses in Cyprus"
  IATA logo: alt="IATA Accredited Travel Agent — JetSet Travel Cyprus"
  Tourism logo: alt="Cyprus Tourism Organisation Licensed — Licence 7775"

STEP 3 — Ensure hero image has responsive sizes:
  sizes="100vw" for full-width hero
  priority={true} for above-the-fold hero

STEP 4 — Add lazy loading for below-fold images:
  All images below the first viewport should have loading="lazy" (Next.js Image does this by default when priority is not set).

STEP 5 — Check if images can be converted to WebP:
  Next.js Image component auto-serves WebP when the browser supports it. Verify this is happening by checking network requests in Chrome DevTools.

Deploy and verify with Lighthouse.
```

---

## PROMPT 12: GDPR Cookie Consent Banner

```
PROJECT: JetSet Travel Cyprus
TASK: Add GDPR-compliant cookie consent banner. Cyprus is in the EU — this is legally required.

Create a CookieConsent component that:
1. Shows a bottom banner on first visit (not a modal — non-intrusive)
2. Text: "We use cookies to improve your experience. By continuing to use this site, you agree to our use of cookies."
3. Link to /en/privacy (or /ru/privacy for Russian users)
4. Two buttons: "Accept" and "Manage Preferences"
5. On "Accept": set a cookie (e.g., jetset_cookie_consent=accepted) with 365-day expiry, hide banner
6. On "Manage Preferences": show a simple panel with toggles:
   - Essential cookies (always on, greyed out)
   - Analytics cookies (optional)
   - Marketing cookies (optional)
7. Save preference and hide banner
8. Do NOT show banner again if consent cookie exists
9. Banner must appear in English or Russian matching the current locale
10. Style to match site design — dark background, white text, subtle animation

Russian text: "Мы используем файлы cookie для улучшения вашего опыта. Продолжая использовать сайт, вы соглашаетесь с использованием cookie."

Deploy to Vercel.
```

---

## PROMPT 13: Google Maps Embed on Contact Page

```
PROJECT: JetSet Travel Cyprus
TASK: Add embedded Google Map to the /en/contact and /ru/contact pages.

Add an iframe Google Map showing the JetSet Travel office location:
  Address: 26A Agapinoros, 8049 Paphos, Cyprus
  Coordinates: 34.7754, 32.4244

Use this embed format:
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280!2d32.4244!3d34.7754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ2JzMxLjQiTiAzMsKwMjUnMjcuOCJF!5e0!3m2!1sen!2scy!4v1"
  width="100%"
  height="400"
  style="border:0;"
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="JetSet Travel Office Location — 26A Agapinoros, Paphos, Cyprus"
></iframe>

BETTER APPROACH: Search for "JetSet Travel Agency Paphos" on Google Maps and use the generated embed code from the share option. If the business listing is found, use that embed URL.

Place the map:
- On /en/contact: below or beside the contact form
- On /ru/contact: same position

Also add address as structured text next to the map with:
  JetSet Travel Cyprus
  26A Agapinoros
  8049 Paphos, Cyprus
  Phone: +357 99 478 073
  Email: info@jetset.com.cy
  Hours: Mon-Fri 9:00-18:00

Deploy to Vercel.
```

---

## PROMPT 14: Fix Navigation + Breadcrumbs

```
PROJECT: JetSet Travel Cyprus
TASK: Fix header navigation and add breadcrumb navigation.

PART A — Navigation Fixes:
1. Check if the transparent header on hero sections has text contrast issues when scrolling. If the nav overlays content, ensure:
   - Header has a solid/semi-transparent background when scrolled past hero
   - All nav links remain readable at all scroll positions
   - Mobile menu toggle is always visible

2. Make the header sticky (position: sticky or fixed with scroll-triggered background change)

PART B — Breadcrumb Navigation:
Add breadcrumb navigation to ALL pages except the homepage.

Use a Breadcrumb component that:
1. Renders a horizontal breadcrumb trail below the header
2. Uses semantic HTML: <nav aria-label="breadcrumb"><ol>...</ol></nav>
3. Generates automatically based on URL path
4. Uses locale-aware labels:
   English:  Home > Corporate Travel
   Russian:  Главная > Корпоративные Поездки

Breadcrumb label mapping (English):
  /en → Home
  /en/corporate-travel → Corporate Travel
  /en/luxury-travel → Luxury Travel
  /en/hotel-reservations → Hotel Reservations
  /en/visa-services → Visa Services
  /en/cruises → Cruises
  /en/about → About Us
  /en/contact → Contact
  /en/blog → Blog
  /en/faq → FAQ
  /en/quote → Get a Quote
  /en/paphos-travel-agency → Travel Agency Paphos
  /en/corporate-travel-cyprus → Corporate Travel Cyprus
  /en/visa-services-cyprus → Visa Services Cyprus
  /en/luxury-travel-cyprus → Luxury Travel Cyprus
  /en/flight-tickets-cyprus → Flight Tickets Cyprus
  /en/hotel-booking-cyprus → Hotel Booking Cyprus

Russian equivalent mapping for /ru pages.

BreadcrumbList schema is already handled in the Schema prompt — just make sure the visual breadcrumbs match the schema output.

Deploy to Vercel.
```

---

# PART H — PHASE 7: UX & CONVERSION UPGRADES

## PROMPT 15: Fix FAQ Page — Add Real Answers + Accordion

```
PROJECT: JetSet Travel Cyprus
TASK: The FAQ page currently has questions that may lack proper answers. Rebuild it with full answers and an interactive accordion UI.

On /en/faq create a comprehensive FAQ page with accordion (click to expand) UI.

CATEGORIES AND QUESTIONS:

CATEGORY: General
Q: "What is JetSet Travel?"
A: "JetSet Travel is an IATA-accredited travel agency based in Paphos, Cyprus, operating since 2006. We provide corporate travel management, luxury travel planning, flight booking, hotel reservations, visa services, and cruise booking for both businesses and individual travellers across Cyprus and internationally."

Q: "Where is JetSet Travel located?"
A: "Our office is at 26A Agapinoros, 8049 Paphos, Cyprus. We're open Monday to Friday, 9:00 AM to 6:00 PM. You can also reach us 24/7 via WhatsApp at +357 99 478 073."

Q: "What languages do you support?"
A: "We provide full service in English and Russian. Our team is fluent in both languages, making us the ideal choice for the diverse business community in Paphos and across Cyprus."

CATEGORY: Booking & Services
Q: "How do I get a travel quote?"
A: "You can request a free quote through our website form, WhatsApp (+357 99 478 073), email (info@jetset.com.cy), or by visiting our Paphos office. We respond within 2 hours on average."

Q: "What does IATA accreditation mean for me?"
A: "IATA accreditation (our code: 14200130) means we issue airline tickets directly through the Global Distribution System. You get access to the best available fares, your booking is fully protected, and your tickets are guaranteed by IATA's financial security framework."

Q: "Do you charge a service fee?"
A: "Our fee structure depends on the service. Corporate travel clients typically work on a management fee or transaction fee basis. For leisure bookings, our service is often included in the booking price. Contact us for specific pricing."

CATEGORY: Corporate Travel
Q: "Can you manage travel for my entire company?"
A: "Yes. We manage corporate travel for 520+ business clients across Cyprus. We handle everything from individual executive trips to multi-team international conferences, with policy compliance, consolidated invoicing, and 24/7 disruption support."

Q: "Do you provide consolidated invoicing?"
A: "Absolutely. One of our core corporate services is clean, finance-ready documentation. You receive consolidated invoices that align with your company's compliance requirements — no more chasing receipts across platforms."

Q: "What happens if a flight is cancelled?"
A: "Our 24/7 disruption support kicks in immediately. We proactively monitor flights and begin rebooking before you even call. We handle alternative flights, hotel adjustments, and ground transport — and keep you updated via WhatsApp in real-time."

CATEGORY: Visa Services
Q: "Which visas do you help with?"
A: "We assist with Schengen visas, UK visas, US visas, UAE visas, business visas, tourist visas, and student visas. Our service includes document checklists, application preparation, and coordination with embassies."

Q: "How long does visa processing take?"
A: "Processing times vary by destination and visa type. Schengen visas typically take 5-15 working days. UK visas take 3-6 weeks. US visas depend on interview availability. We always advise applying as early as possible."

Create a matching Russian version at /ru/faq with all questions and answers translated into fluent Russian.

Both pages must include FAQPage schema (see Schema prompt).

Use an attractive accordion/expandable design consistent with the site. Each category should be visually separated with a heading.

Deploy to Vercel.
```

---

## PROMPT 16: Trust Badges + Social Proof Enhancements

```
PROJECT: JetSet Travel Cyprus
TASK: Make trust signals more prominent across the site.

STEP 1 — Create a "Trust Bar" component that appears on EVERY page just below the header:
  Horizontal bar with: IATA Accredited (with logo) | Tourism Licence 7775 (with logo) | 20+ Years Experience | 520+ Corporate Clients | 24/7 Support
  Style: subtle background (light grey or brand color tint), small logos, professional font
  Must be responsive — horizontal on desktop, 2-row grid on mobile

STEP 2 — Enhance the homepage testimonials:
  - Add star rating display (★★★★★ 5/5) visually next to each review
  - Add "Verified on Google Reviews" badge
  - Add a "View All Reviews" button linking to Google Business Profile

STEP 3 — Add a "Response Time" badge near every quote/contact form:
  "⚡ Average response time: under 2 hours"
  (This already appears on the homepage — make sure it's on /en/contact, /en/quote, and every CTA section)

STEP 4 — Make IATA and Tourism logos at least 48x48px on mobile (currently they appear very small).

Deploy to Vercel.
```

---

## PROMPT 17: Exit-Intent Lead Capture

```
PROJECT: JetSet Travel Cyprus
TASK: Add an exit-intent popup for lead capture.

Create a component that:
1. Detects mouse leaving the viewport (desktop) or after 45 seconds of inactivity (mobile)
2. Shows a clean modal/popup:
   Headline: "Before You Go..."
   Subtext: "Get a free travel quote in under 2 hours"
   3 toggle buttons: Corporate | Leisure | Visa
   Email input field
   "Get My Free Quote" button
   "No thanks" dismiss link
3. On submit: send data to the same quote form handler/API route
4. Set a cookie so it doesn't show again for 7 days after dismissal or submission
5. Do NOT show on /en/quote or /en/contact pages (user is already converting)
6. Russian version for /ru pages:
   Headline: "Прежде чем уйти..."
   Subtext: "Получите бесплатную консультацию за 2 часа"
   Buttons: Корпоративный | Отдых | Виза

NOTE: I see from the homepage source that there's already a "Before You Go" section. Check if this is already an exit-intent popup. If so, verify it works correctly and add the cookie logic. If it's just a static section, convert it to a proper exit-intent trigger.

Deploy to Vercel.
```

---

## PROMPT 18: Enhanced About Page

```
PROJECT: JetSet Travel Cyprus
TASK: Enhance the /en/about and /ru/about pages with richer content.

The About page likely has minimal content. Expand it to include:

H1: "About JetSet Travel — Your Trusted Partner in Cyprus Since 2006"

H2: "Our Story"
  200 words: Founded in 2006 in Paphos, Cyprus. IATA accredited. Started as a flight ticketing office, grew into a full-service corporate and luxury travel management company. Now serving 520+ corporate clients.

H2: "Our Credentials"
  Display cards:
  - IATA Accreditation — Code 14200130 (with IATA logo)
  - Cyprus Tourism Organisation — Licence 7775 (with Tourism logo)
  - Company Registration — HE 181550
  - 20+ Years of Operation

H2: "Why Clients Trust Us"
  4 pillars: Accountability (single point of contact), Speed (under 2 hour response), Compliance (finance-ready documentation), Support (24/7 WhatsApp)

H2: "Industries We Serve"
  Grid: Law Firms | Financial Services | Technology | Healthcare | Real Estate | Import/Export | Shipping | Professional Services

H2: "Our Approach"
  Brief paragraph about personalized service, bilingual capability, and commitment to making travel stress-free.

CTA: "Ready to work with us?" → /en/contact

Create matching Russian version at /ru/about.

Deploy to Vercel.
```

---

## PROMPT 19: 404 Page Optimization

```
PROJECT: JetSet Travel Cyprus
TASK: Create/improve the 404 page.

Create /app/not-found.tsx (Next.js App Router convention):

Content:
  H1: "Page Not Found"
  Text: "Sorry, the page you're looking for doesn't exist or has been moved."
  Helpful links:
    - Homepage → /en
    - Corporate Travel → /en/corporate-travel
    - Luxury Travel → /en/luxury-travel
    - Visa Services → /en/visa-services
    - Contact Us → /en/contact
    - Get a Quote → /en/quote
  Search suggestion: "Try searching for what you need, or contact us directly."
  WhatsApp button: Quick link to WhatsApp

If the locale can be detected (e.g., from referrer or URL pattern), show Russian version.

Style consistently with site design.
Deploy to Vercel.
```

---

# PART I — PHASE 8: CONTENT & BLOG INFRASTRUCTURE

## PROMPT 20: Blog Infrastructure + First Posts

```
PROJECT: JetSet Travel Cyprus
TASK: Set up blog infrastructure and create the first 4 blog posts.

STEP 1 — Verify /en/blog page exists and works. Ensure it:
  - Has a proper title: "Travel Blog | Cyprus Travel Tips & Guides — JetSet Travel"
  - Displays a grid of blog post cards with: featured image, title, excerpt, date, read time
  - Has pagination or infinite scroll for future posts
  - Links to individual blog post pages

STEP 2 — Ensure blog post template includes:
  - Meta title and description (unique per post)
  - Open Graph tags with featured image
  - Author attribution
  - Published date and last modified date
  - BreadcrumbList schema: Home > Blog > [Post Title]
  - Article schema (BlogPosting):
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "...",
      "datePublished": "...",
      "dateModified": "...",
      "author": {"@type": "Organization", "name": "JetSet Travel Cyprus"},
      "publisher": {"@id": "https://www.jetset-travel.com/#organization"},
      "image": "...",
      "description": "..."
    }
  - Related posts section at bottom
  - CTA: "Need help? Get a free quote" linking to /en/quote

STEP 3 — Create 4 blog posts:

POST 1 (English):
  Slug: /en/blog/best-airlines-from-paphos-airport-2026
  Title: "Best Airlines Flying from Paphos Airport in 2026"
  Meta description: "Complete guide to airlines flying from Paphos Airport (PFO) in 2026. Routes, frequencies, and tips for getting the best fares from Cyprus."
  Content: 600-800 words covering major airlines operating from PFO (Ryanair, Wizz Air, easyJet, TUI, Jet2, Cyprus Airways), key routes (London, Moscow, Athens, Tel Aviv, various European cities), tips for finding best fares, and why booking through an IATA agent gets better options.
  Internal links to: /en/flight-tickets-cyprus, /en/corporate-travel, /en/paphos-travel-agency

POST 2 (English):
  Slug: /en/blog/schengen-visa-from-cyprus-guide
  Title: "Schengen Visa from Cyprus: Complete Application Guide 2026"
  Meta description: "Step-by-step guide to applying for a Schengen visa from Cyprus. Documents needed, processing times, costs, and expert tips from JetSet Travel."
  Content: 800-1000 words covering Schengen visa basics, which embassy to apply to from Cyprus, required documents, processing timeline, costs, common mistakes, and how JetSet can help.
  Internal links to: /en/visa-services-cyprus, /en/visa-services, /en/paphos-travel-agency

POST 3 (Russian):
  Slug: /ru/blog/luchshie-aviakompanii-iz-pafosa-2026
  Title: "Лучшие Авиакомпании из Аэропорта Пафоса в 2026 году"
  Content: Russian translation/adaptation of Post 1.

POST 4 (Russian):
  Slug: /ru/blog/shengenskaya-viza-s-kipra-instruktsiya
  Title: "Шенгенская Виза с Кипра: Пошаговая Инструкция 2026"
  Content: Russian translation/adaptation of Post 2.

Add all blog posts to sitemap.xml.
Deploy to Vercel.
```

---

# PART J — PHASE 9: INTERNAL LINKING OVERHAUL

## PROMPT 21: Internal Linking Audit + Fix

```
PROJECT: JetSet Travel Cyprus
TASK: Overhaul internal linking across the entire site.

CURRENT PROBLEMS:
1. Service pages don't link to each other
2. "Flight Booking" in footer links to /en/contact instead of a flights page
3. New landing pages need to be linked from existing pages
4. Blog posts need to link to service pages
5. No cross-linking strategy exists

FIX ALL OF THE FOLLOWING:

STEP 1 — Update Footer:
  Change "Flight Booking" link from /en/contact to /en/flight-tickets-cyprus
  Add new landing pages to footer:
    Quick Links section: add "Travel Agency Paphos" → /en/paphos-travel-agency
    Services section: add "Business Travel" → /en/corporate-travel-cyprus

STEP 2 — Add "Related Services" section to every service page:
  At the bottom of each service page, add a "Related Services" grid with 2-3 cards linking to other services.

  /en/corporate-travel should link to: /en/visa-services, /en/hotel-reservations, /en/flight-tickets-cyprus
  /en/luxury-travel should link to: /en/hotel-reservations, /en/cruises, /en/visa-services
  /en/hotel-reservations should link to: /en/corporate-travel, /en/luxury-travel
  /en/visa-services should link to: /en/corporate-travel, /en/paphos-travel-agency
  /en/cruises should link to: /en/luxury-travel, /en/hotel-reservations

STEP 3 — Add contextual internal links within page body text:
  On homepage "What We Do" section, ensure each service card links correctly.
  On each service page, add at least 2 text links to other pages (e.g., "We also provide visa services for business travellers" linking to /en/visa-services).

STEP 4 — Add "See Also" links at the bottom of new landing pages:
  /en/paphos-travel-agency → link to all 5 service pages + /en/about + /en/contact
  /en/corporate-travel-cyprus → link to /en/visa-services-cyprus, /en/flight-tickets-cyprus, /en/paphos-travel-agency
  (etc. for all new pages)

STEP 5 — Update Russian equivalents with matching internal links.

Deploy to Vercel.
```

---

# PART K — PHASE 10: FULL LINK AUDIT & REPAIR

## PROMPT 22: Comprehensive Link Audit

```
PROJECT: JetSet Travel Cyprus
TASK: Full link audit — find and fix every broken, incorrect, or suboptimal link on the entire site.

STEP 1 — Discover all routes:
  Scan /app directory for all page.tsx files. List every route (EN and RU).

STEP 2 — Extract all links from every page:
  Scan all components, layouts, and pages for:
  - <Link href="..."> (Next.js Link)
  - <a href="..."> (HTML anchors)
  - Navigation links (header, footer, mobile menu)
  - CTA buttons
  - Social media links
  - Phone links (tel:)
  - Email links (mailto:)
  - WhatsApp links (wa.me)
  - Telegram links (t.me)
  - Viber links (viber://)
  - Google Maps links
  - External links (Google Reviews, etc.)
  - Image links (logos that link somewhere)

STEP 3 — Validate every link:
  For internal links:
  - Does the target route exist?
  - Is the path correct (with locale prefix)?
  - Does it 404?

  For external links:
  - Is the URL format correct?
  - Is the phone number format correct for tel: links? (should be +35799478073 without spaces)
  - Does the mailto: work?
  - Does the WhatsApp deep link have the correct format?
  - Does the Viber link work?

STEP 4 — Fix all issues found:
  - Fix broken internal links
  - Fix incorrect URLs
  - Fix phone/email formatting
  - Add target="_blank" rel="noopener noreferrer" to all external links
  - Ensure Google Reviews link points to the correct Google Business Profile URL

STEP 5 — Verify no orphan pages exist (pages with no links pointing to them).

Create a report of all issues found and fixes applied.
Deploy to Vercel.
```

---

# PART L — MANUAL TASKS (Not Claude Code)

These tasks require manual action in external platforms. Do them in parallel with Claude Code work.

## WEEK 1 — URGENT

| # | Task | Platform | Time |
|---|------|----------|------|
| 1 | Fix Google Business Profile: Remove "АвияКасса БИЛЕТЫ - Certifying Officer - НОТАРИУС" from business name. Set name to "JetSet Travel Cyprus". Set primary category "Travel Agency". Add secondary: "Corporate Travel Agency". Upload 20+ photos. Write EN and RU descriptions. Add all services. Set hours Mon-Fri 9-18. | Google Business Profile Dashboard | 2 hrs |
| 2 | Submit sitemap.xml to Google Search Console | Google Search Console | 15 min |
| 3 | Submit site to Yandex Webmaster + submit sitemap | Yandex Webmaster | 30 min |
| 4 | Set up 301 redirect from jetset.com.cy → www.jetset-travel.com | Domain registrar / DNS | 30 min |

## WEEK 2-3 — HIGH PRIORITY

| # | Task | Platform | Time |
|---|------|----------|------|
| 5 | Update listing on cyprustravelagencies.com — correct URL, phone, description | cyprustravelagencies.com | 30 min |
| 6 | Update listing on travel-agents.info — correct all NAP data | travel-agents.info | 30 min |
| 7 | Register on oncyprus.com directory | oncyprus.com | 30 min |
| 8 | Register on visitcyprus.com official listing | visitcyprus.com | 30 min |
| 9 | Create TripAdvisor business listing for JetSet Travel | tripadvisor.com | 1 hr |
| 10 | Register on Russian Cyprus directories: kiprinform.com, vkipre.com, cyprusbutterfly.com | Each directory | 2 hrs |
| 11 | Register on 2GIS and Yandex Maps | 2gis.com / Yandex Maps | 1 hr |
| 12 | Start Google Review collection campaign: After every completed booking, send WhatsApp message asking for a Google review with direct link | WhatsApp | Ongoing |

## WEEK 4-6 — GROWTH

| # | Task | Platform | Time |
|---|------|----------|------|
| 13 | Create Instagram business page @jetsettravelcyprus | Instagram | 1 hr |
| 14 | Create Facebook business page | Facebook | 1 hr |
| 15 | Create VKontakte business page (critical for Russian market) | VKontakte | 1 hr |
| 16 | Post on Google Business Profile weekly (travel tips, special offers) | GBP Dashboard | 15 min/week |
| 17 | Begin building backlinks: contact Paphos business directories, local blogs, Cyprus business media for guest posts or profiles | Email outreach | Ongoing |
| 18 | Set up Google Ads campaign for highest-intent keywords: "travel agency paphos", "corporate travel cyprus", "visa services paphos" | Google Ads | 2 hrs |

---

# EXECUTION SUMMARY

## Claude Code Prompt Order (copy-paste one at a time):

```
WEEK 1:
  Prompt 1  → Sitemap.xml + Robots.txt
  Prompt 2  → Hreflang Tags
  Prompt 3  → Canonical Tags + URL Normalization
  Prompt 4  → Schema.org JSON-LD (all types)
  Prompt 5  → Meta Tags + OG + Twitter Cards
  Prompt 6  → Create /en/paphos-travel-agency
  Prompt 12 → GDPR Cookie Consent

WEEK 2:
  Prompt 7  → Create /en/corporate-travel-cyprus
  Prompt 8  → Create /en/visa-services-cyprus
  Prompt 9  → Create luxury, flights, hotel pages
  Prompt 10 → Create ALL Russian landing pages

WEEK 3:
  Prompt 11 → Image Optimization
  Prompt 13 → Google Maps Embed
  Prompt 14 → Navigation Fix + Breadcrumbs
  Prompt 15 → FAQ Page Rebuild
  Prompt 16 → Trust Badges + Social Proof

WEEK 4:
  Prompt 17 → Exit-Intent Lead Capture
  Prompt 18 → Enhanced About Page
  Prompt 19 → 404 Page
  Prompt 20 → Blog Infrastructure + First 4 Posts

WEEK 5-6:
  Prompt 21 → Internal Linking Overhaul
  Prompt 22 → Full Link Audit & Repair
```

## Expected Results

| Timeline | Expected Outcome |
|----------|-----------------|
| Week 2 | Sitemap indexed by Google, schema validated, hreflang active |
| Week 4 | First rankings for "IATA travel agent cyprus", "corporate travel management cyprus" |
| Month 2 | Top 5 for "travel agency paphos", Russian pages appearing in Google |
| Month 3 | Top 3 for "travel agency paphos", Top 5 for "corporate travel cyprus" |
| Month 4 | Russian keywords entering Top 10, 30+ Google reviews |
| Month 6 | Dominant position for Paphos queries in both languages, measurable organic lead increase |

---

**END OF MASTER PLAYBOOK**

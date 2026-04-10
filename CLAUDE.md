# CLAUDE.md — JetSet Travel Website Correction Playbook
# Project: www.jetset-travel.com
# Stack: Next.js, deployed on Vercel (assumed)
# Languages: English (/en), Russian (/ru)
# Last audited: 2026-04-10

## Project Context

JetSet Travel is an IATA-accredited travel agency based in Paphos, Cyprus.
The website serves two audiences: corporate travel managers and luxury leisure travellers.
It runs on Next.js with bilingual support (EN/RU), structured data, and SSR/SSG pages.
The site is generally well-built. This playbook addresses specific issues found during audit.

---

## CRITICAL — Fix Immediately

### 1. Remove incorrect Product schema from homepage

**File:** `app/en/page.tsx` (or wherever homepage structured data is injected)

The homepage has `@type: Product` schema with the page title as the product name.
A travel agency homepage is not a product. This causes schema conflicts and may trigger
Google Search Console warnings or prevent rich results from appearing.

**Action:**
- Find the `<script type="application/ld+json">` block that contains `"@type": "Product"`
- Delete the entire Product schema block
- Keep the existing `TravelAgency`, `WebSite`, and `Review` schemas
- Validate at https://search.google.com/test/rich-results after deployment

**Expected structured data on homepage after fix:**
- TravelAgency (primary business entity)
- WebSite (with SearchAction sitelinks search box)
- Review x3 (individual reviews — see task #10 for further improvement)

---

### 2. Trim Paphos local page meta description to under 160 characters

**File:** `app/en/paphos-travel-agency/page.tsx` (or head metadata export)

**Current (184 chars):**
```
Looking for a trusted travel agency in Paphos? JetSet Travel is IATA accredited with 20+ years experience. Corporate travel, flights, hotels, visa services. Visit us at 26A Agapinoros.
```

**Replace with (~155 chars):**
```
Trusted IATA-accredited travel agency in Paphos. 20+ years experience in corporate travel, flights, hotels & visa services. Visit us or get a free quote.
```

---

### 3. Fix Elfsight free-tier branding link on homepage

**File:** Homepage component where the Elfsight Google Reviews widget is rendered

The Elfsight widget injects a visible "Free Google Reviews Widget" link pointing to
`elfsight.com`. This is a dofollow outbound link on your most important page, leaking
link equity to a third party.

**Options (pick one):**
- **Best:** Upgrade to Elfsight paid plan to remove branding
- **Better:** Replace Elfsight entirely with a custom Google Reviews component that
  fetches reviews via Google Places API and renders them server-side
- **Minimum:** If you keep free Elfsight, add CSS to hide the branding link and add
  `rel="nofollow sponsored"` via a MutationObserver — but this may violate Elfsight ToS

---

### 4. Add GDPR cookie consent banner

**File:** Create `components/CookieConsent.tsx` and add to `app/layout.tsx`

The site loads Google Analytics/GTM, Elfsight, and other third-party scripts that set
cookies, but has zero cookie consent mechanism. All visitors from Cyprus (EU) are covered
by GDPR.

**Action:**
- Install a consent management library (e.g., `cookie-consent-banner`, or use a service like Cookiebot/CookieYes)
- Block all non-essential scripts (GA, GTM, Elfsight) until user grants consent
- Implement consent categories: Necessary, Analytics, Marketing
- Store consent preference in a cookie with 6-month expiry
- Add a link to re-open consent preferences in the footer (near Privacy Policy link)
- Update Privacy Policy page to describe cookies used

**Script blocking pattern for Next.js:**
```tsx
// In layout.tsx or a client component
// Only load GTM after consent
{hasAnalyticsConsent && (
  <Script
    src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXX"
    strategy="afterInteractive"
  />
)}
```

---

## HIGH PRIORITY — Within 2 Weeks

### 5. Configure exit-intent popup to fire only once per session

**File:** Component rendering the "Before You Go..." dialog (likely `components/ExitIntent.tsx` or similar)

The exit-intent popup markup exists on every page (confirmed on homepage and blog).
Firing on every page visit, including repeat visitors, hurts engagement.

**Action:**
- Add `sessionStorage` check: only show popup once per browser session
- Do NOT show on /contact, /quote, or /faq pages (user is already engaged)
- Do NOT show on mobile (exit-intent doesn't work well on touch devices)
- Add a 30-second delay before arming the trigger (don't show to bouncers who leave in <5s)

```tsx
// Pseudocode
useEffect(() => {
  if (sessionStorage.getItem('exitShown')) return;
  if (isMobile()) return;
  if (['/en/contact', '/en/quote', '/en/faq'].includes(pathname)) return;

  const timer = setTimeout(() => {
    document.addEventListener('mouseleave', handleExitIntent);
  }, 30000);

  return () => clearTimeout(timer);
}, []);

const handleExitIntent = (e) => {
  if (e.clientY < 10) {
    setShowPopup(true);
    sessionStorage.setItem('exitShown', 'true');
    document.removeEventListener('mouseleave', handleExitIntent);
  }
};
```

---

### 6. Remove blog pagination until article count exceeds 12

**File:** `app/en/blog/page.tsx`

Currently 6 articles with pagination active, creating a thin second page.

**Action:**
- Show all articles on a single page until count > 12
- When re-enabling pagination, use 12 articles per page
- Ensure paginated pages have `rel="next"` / `rel="prev"` and unique meta descriptions

---

### 7. Verify honeypot form fields are properly hidden

**File:** Form components (homepage form + exit popup form)

Found 2 honeypot inputs including one named "Website". Verify:

```tsx
<input
  type="text"
  name="b_website"              // or whatever the honeypot name is
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
/>
```

- Must be invisible to visual users AND screen readers (`aria-hidden="true"`)
- Must not be autofilled by browsers (`autoComplete="off"`)
- Must be outside of tab order (`tabIndex={-1}`)
- Server-side: reject submission if this field has any value

---

### 8. Audit and reduce external scripts

**File:** `app/layout.tsx`, individual page components

Currently loading 19 external scripts + 29 inline scripts.

**Action:**
- List all scripts with `performance.getEntriesByType('resource').filter(r => r.initiatorType === 'script')`
- For each script, classify as: Essential (GTM, Next.js runtime), Deferrable (Elfsight, analytics), Removable
- Move deferrable scripts to `strategy="lazyOnload"` in Next.js Script component
- Consider replacing Elfsight with a static/SSR solution to eliminate its runtime JS entirely
- Target: reduce to under 12 external scripts

---

## MEDIUM PRIORITY — Within 1 Month

### 9. Add Russian translations for all blog posts

**File:** `app/ru/blog/` directory

The blog currently exists only in English. Russian-speaking users in Cyprus are a significant
audience (confirmed by your bilingual service offering and Russian homepage).

**Action:**
- For each existing English blog post, create a Russian version at the `/ru/blog/[slug]` path
- Add hreflang alternates linking EN and RU versions of each post
- Add Russian blog posts to the sitemap (currently only EN blog URLs are present)
- Going forward, publish every blog post in both languages simultaneously

---

### 10. Replace standalone Review schemas with AggregateRating

**File:** Homepage structured data component

**Current:** 3 separate `@type: Review` schemas
**Should be:** AggregateRating nested inside the TravelAgency schema

```json
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "JetSet Travel Cyprus",
  "url": "https://www.jetset-travel.com",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "47",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Maria K." },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "..."
    }
  ]
}
```

This enables Google to show star ratings in your search listing.

---

### 11. Add BreadcrumbList structured data to all interior pages

**File:** Create `components/BreadcrumbSchema.tsx`, include in page layouts

Visual breadcrumbs exist on the blog but lack structured data markup.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.jetset-travel.com/en"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://www.jetset-travel.com/en/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title"
    }
  ]
}
```

Add to: all service pages, blog listing, individual blog posts, about, contact, FAQ, quote.

---

### 12. Ensure Twitter Card meta tags are on all pages

**File:** Metadata exports in each page file, or a shared SEO component

Homepage has 4 Twitter tags. Verify every page includes:
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Page Title]" />
<meta name="twitter:description" content="[Page Description]" />
<meta name="twitter:image" content="[Page OG Image or Default]" />
```

In Next.js, use the metadata export:
```tsx
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    title: '...',
    description: '...',
    images: ['...'],
  },
};
```

---

## LOWER PRIORITY — Ongoing

### 13. Make homepage H1 keyword-rich

**File:** Homepage hero section component

**Current H1:** "Travel Managed. Luxury Delivered."
**Suggested H1:** "Travel Agency in Paphos, Cyprus — Corporate & Luxury Travel"
**Keep current text as:** A styled `<p>` subtitle below the H1

This is the single highest-impact on-page SEO change available. The current H1 contains
zero searchable keywords.

---

### 14. Add FAQ page to main navigation

**File:** `components/Navigation.tsx` (or header component)

The FAQ page has 19 well-structured questions with FAQPage schema — excellent for
long-tail traffic. But it's only accessible from the footer.

**Action:**
- Add "FAQ" to the Services dropdown in the main nav, or as a standalone nav item
- Consider adding a "FAQ" link in the mobile hamburger menu

---

### 15. Add Article schema with author info to blog posts

**File:** Blog post layout/template component

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Blog Post Title",
  "author": {
    "@type": "Person",
    "name": "Nontari Kalaitsidis",
    "url": "https://www.jetset-travel.com/en/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "JetSet Travel Cyprus",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.jetset-travel.com/images/jetset-logo.svg"
    }
  },
  "datePublished": "2026-04-01",
  "dateModified": "2026-04-01",
  "image": "..."
}
```

This builds E-E-A-T signals (Experience, Expertise, Authority, Trust) for Google.

---

### 16. Add rel="noopener noreferrer" to all external target="_blank" links

**File:** Global search across components

Found 1 unsafe external link. Run a project-wide search:
```bash
grep -rn 'target="_blank"' --include="*.tsx" --include="*.jsx" | grep -v "noopener"
```

Fix pattern:
```tsx
<a href="..." target="_blank" rel="noopener noreferrer">
```

---

### 17. Interlink blog posts to relevant service pages

**File:** Individual blog post content files

**Linking map:**
- "Digital Nomads in Cyprus" → link to /en/visa-services
- "Best Time to Visit Cyprus" → link to /en/luxury-travel and /en/hotel-reservations
- "Cruises from Limassol" → link to /en/cruises
- "Business Travelers Guide Limassol" → link to /en/corporate-travel
- "Limassol Corporate Retreat" → link to /en/corporate-travel and /en/hotel-reservations
- "Luxury Mediterranean Destinations" → link to /en/luxury-travel

Each blog post should have at least 2 internal links to service pages.

---

### 18. Blog publishing cadence

Target 2-4 new posts per month. Priority topics (based on keyword opportunity):

- "Cheapest flights from Paphos to London 2026"
- "Cyprus Schengen visa requirements for [nationality]"
- "Best hotels in Paphos for business travellers"
- "How to plan a corporate retreat in Cyprus"
- "Paphos to Dubai flights — routes, airlines, prices"
- "Travel insurance for Cyprus visitors — do you need it?"
- "Larnaca vs Paphos airport — which to fly from"

Every post should target one primary keyword, include FAQ schema, and link to
at least 2 service pages.

---

## Validation Checklist (After All Fixes)

Run these after deploying changes:

- [ ] Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Schema.org Validator: https://validator.schema.org/
- [ ] Google Search Console: Check for manual actions, coverage errors, schema warnings
- [ ] PageSpeed Insights: Run for both mobile and desktop on homepage + 2 service pages
- [ ] GDPR cookie scanner: https://www.cookiebot.com/en/cookie-scanner/
- [ ] Lighthouse audit in Chrome DevTools (Performance, Accessibility, SEO, Best Practices)
- [ ] Sitemap: Verify all new/changed URLs are present in /sitemap.xml
- [ ] Hreflang: Verify Russian blog URLs are in sitemap with correct alternates
- [ ] Mobile: Test exit-intent popup does NOT fire on mobile devices

---

## Current Site Stats (Baseline — April 2026)

- Page load: 394ms DOMContentLoaded, 60ms TTFB
- Resources: 37 total
- External scripts: 19
- Images: 33 (all with alt text)
- JSON-LD schemas (homepage): 6
- Aria labels: 63
- Sitemap URLs: 60
- Languages: EN, RU (with x-default)
- Blog posts: 6
- Service pages: 7 (flights, hotels, cruises, visa, luxury, corporate, paphos)

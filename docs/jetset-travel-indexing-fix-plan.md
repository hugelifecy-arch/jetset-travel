# Jetset-Travel.com — Google Indexing Fix Plan

## Context

Google Search Console (last update: 3/31/2026) reports **68 pages not indexed** out of 76 total known pages (only 8 indexed). This document contains tasks for Claude Code to fix the technical issues in the Next.js codebase, followed by manual steps the site owner needs to perform in Google Search Console.

---

## PART 1: Code Fixes (for Claude Code)

### Task 1: Fix robots.txt — Unblock static assets

**Problem:** 2 font files in `/_next/static/media/` are blocked by robots.txt. This prevents Googlebot from rendering pages properly, which can hurt indexing of ALL pages.

**Action:** Open the `robots.txt` file (or the mechanism generating it — in Next.js this is usually `public/robots.txt` or `app/robots.ts`/`app/robots.js`).

Update it to look like this:

```
User-agent: *
Allow: /_next/static/
Disallow: /_next/data/
Disallow: /api/

Sitemap: https://www.jetset-travel.com/sitemap.xml
```

Key points:
- Explicitly `Allow: /_next/static/` so fonts, CSS, and JS are accessible to Googlebot
- Keep blocking `/_next/data/` (internal Next.js JSON data routes) and `/api/` (API routes)
- Include the sitemap URL

---

### Task 2: Add 301 redirects for /luxury → /luxury-travel

**Problem:** 2 URLs return 404:
- `/en/luxury`
- `/luxury`

These should redirect to the existing luxury travel pages.

**Action:** In `next.config.js` (or `next.config.mjs`/`next.config.ts`), add permanent redirects:

```js
// Inside the Next.js config object
async redirects() {
  return [
    {
      source: '/luxury',
      destination: '/en/luxury-travel',
      permanent: true, // 301
    },
    {
      source: '/en/luxury',
      destination: '/en/luxury-travel',
      permanent: true, // 301
    },
    {
      source: '/ru/luxury',
      destination: '/ru/luxury-travel',
      permanent: true, // 301
    },
  ];
},
```

If redirects already exist in the config, merge these into the existing array.

---

### Task 3: Fix duplicate /en/en path redirect

**Problem:** `https://www.jetset-travel.com/en/en` exists as a redirect URL, indicating a routing bug where the language prefix is doubled.

**Action:** Add a redirect rule to catch doubled locale prefixes:

```js
{
  source: '/en/en/:path*',
  destination: '/en/:path*',
  permanent: true,
},
{
  source: '/ru/ru/:path*',
  destination: '/ru/:path*',
  permanent: true,
},
{
  source: '/en/en',
  destination: '/en',
  permanent: true,
},
{
  source: '/ru/ru',
  destination: '/ru',
  permanent: true,
},
```

Also investigate the internationalization (i18n) middleware or routing logic for the root cause. Check if the language switcher or any internal links are prepending the locale when it's already present.

---

### Task 4: Fix ?lang= parameter URLs

**Problem:** URLs like `/?lang=en`, `/en?lang=en`, and `/?lang=ru` are being discovered by Google. These create duplicate content signals.

**Action — Option A (Recommended): Redirect query param URLs to clean paths**

In Next.js middleware (`middleware.ts` or `middleware.js`):

```ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const lang = searchParams.get('lang');

  // Redirect ?lang= parameter URLs to clean locale paths
  if (lang && (lang === 'en' || lang === 'ru')) {
    const cleanPath = pathname === '/' ? `/${lang}` : `/${lang}${pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = cleanPath;
    url.searchParams.delete('lang');
    return NextResponse.redirect(url, 301);
  }

  // ... rest of existing middleware logic
}
```

If middleware already exists, integrate this logic at the top before other checks.

**Action — Option B: Add canonical tags (if redirects cause issues)**

Ensure every page has a proper canonical tag pointing to the clean URL version. See Task 6.

---

### Task 5: Generate a comprehensive XML sitemap

**Problem:** 53 pages are "Discovered - currently not indexed" — Google hasn't crawled them yet. A proper sitemap will help Google prioritize crawling.

**Action:** If using Next.js App Router, create `app/sitemap.ts`:

```ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.jetset-travel.com';

  // Core pages in both languages
  const enPages = [
    '', '/about', '/blog', '/contact', '/services', '/faq', '/terms', '/quote',
    '/cruises', '/flight-tickets-cyprus', '/hotel-booking-cyprus', '/hotel-reservations',
    '/luxury-travel', '/luxury-travel-cyprus', '/corporate-travel-cyprus',
    '/visa-services', '/visa-services-cyprus', '/paphos-travel-agency',
  ];

  const enBlogPosts = [
    '/blog/best-time-visit-cyprus-monthly-guide',
    '/blog/business-travelers-guide-limassol',
    '/blog/corporate-travel-tips-cyprus',
    '/blog/cruises-from-limassol-2026',
    '/blog/cyprus-schengen-2026-business-travel',
    '/blog/digital-nomads-cyprus-guide',
    '/blog/limassol-corporate-retreat-guide',
    '/blog/luxury-mediterranean-destinations-2026',
    '/blog/schengen-visa-guide-cyprus-residents',
    '/blog/travel-agency-paphos-guide',
  ];

  const ruPages = [
    '', '/about', '/blog', '/contact', '/services', '/faq', '/terms', '/quote',
    '/cruises', '/aviabilety-kipr', '/bronirovanie-otelej-kipr', '/hotel-reservations',
    '/luxury-travel', '/luxusnyy-otdykh-kipr', '/corporate-travel', '/korporativnye-poezdki-kipr',
    '/visa-services', '/vizovye-uslugi-kipr', '/turisticheskoe-agentstvo-pafos',
  ];

  const ruBlogPosts = [
    '/blog/delovoj-gid-po-limassolu',
    '/blog/digital-nomady-kipr-gid',
    '/blog/kipr-v-shengene-2026-delovye-poezdki',
    '/blog/korporativnye-komandirovki-kipr-gid',
    '/blog/korporativnyj-retrit-v-limassole',
    '/blog/luchshee-vremya-dlya-poseshcheniya-kipra',
    '/blog/premialnyj-otdykh-sredizemnomorye-2026',
    '/blog/shengenskaya-viza-dlya-zhitelej-kipra',
  ];

  const now = new Date().toISOString();

  const urls: MetadataRoute.Sitemap = [];

  // English pages
  [...enPages, ...enBlogPosts].forEach((path) => {
    urls.push({
      url: `${baseUrl}/en${path}`,
      lastModified: now,
      changeFrequency: path.startsWith('/blog/') ? 'monthly' : 'weekly',
      priority: path === '' ? 1.0 : path.startsWith('/blog/') ? 0.7 : 0.8,
    });
  });

  // Russian pages
  [...ruPages, ...ruBlogPosts].forEach((path) => {
    urls.push({
      url: `${baseUrl}/ru${path}`,
      lastModified: now,
      changeFrequency: path.startsWith('/blog/') ? 'monthly' : 'weekly',
      priority: path === '' ? 0.9 : path.startsWith('/blog/') ? 0.6 : 0.7,
    });
  });

  return urls;
}
```

If the site uses Pages Router or a different sitemap approach, adapt accordingly. The key is that ALL 53+ pages that should be indexed appear in the sitemap with the correct canonical `https://www.` URLs.

---

### Task 6: Ensure proper canonical tags and hreflang on every page

**Problem:** Duplicate URL variants (with/without www, with ?lang= params, doubled locale paths) confuse Google.

**Action:** In the root layout or `_app` component, ensure every page outputs:

```html
<link rel="canonical" href="https://www.jetset-travel.com/en/current-page" />
<link rel="alternate" hreflang="en" href="https://www.jetset-travel.com/en/current-page" />
<link rel="alternate" hreflang="ru" href="https://www.jetset-travel.com/ru/current-page" />
<link rel="alternate" hreflang="x-default" href="https://www.jetset-travel.com/en/current-page" />
```

In Next.js App Router, this is done via the `metadata` export or `generateMetadata` function:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const locale = params.locale; // 'en' or 'ru'
  const path = /* current path without locale */;
  const baseUrl = 'https://www.jetset-travel.com';

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}${path}`,
      languages: {
        'en': `${baseUrl}/en${path}`,
        'ru': `${baseUrl}/ru${path}`,
        'x-default': `${baseUrl}/en${path}`,
      },
    },
    // ... other metadata
  };
}
```

---

### Task 7: Ensure proper HTTP→HTTPS and www redirects at server/hosting level

**Problem:** 9 redirect URLs exist due to http://, non-www, and root domain variations. These are expected, but verify they are 301 (permanent) not 302 (temporary).

**Action:** Check the hosting configuration (Vercel, Netlify, etc.) or `next.config.js`:

- `http://jetset-travel.com` → 301 → `https://www.jetset-travel.com`
- `http://www.jetset-travel.com` → 301 → `https://www.jetset-travel.com`
- `https://jetset-travel.com` → 301 → `https://www.jetset-travel.com`
- Root `/` → 301 → `/en` (or use locale detection)

If on Vercel, these are typically handled automatically. If not, add to `next.config.js`:

```js
async redirects() {
  return [
    // Root to default locale
    {
      source: '/',
      destination: '/en',
      permanent: true,
    },
    // ... other redirects from Tasks 2-4
  ];
},
```

---

## PART 2: Manual Steps in Google Search Console

These steps must be performed by the site owner directly in GSC after the code fixes are deployed.

### Step 1: Submit the XML Sitemap

1. Go to **Google Search Console** → **Indexing** → **Sitemaps**
2. Enter `sitemap.xml` in the "Add a new sitemap" field
3. Click **Submit**
4. Verify it shows "Success" status and the correct number of discovered URLs

### Step 2: Request Indexing for High-Priority Pages

Use the **URL Inspection tool** (top search bar in GSC) to request indexing for your most important pages first:

1. `https://www.jetset-travel.com/en` (homepage)
2. `https://www.jetset-travel.com/en/services`
3. `https://www.jetset-travel.com/en/flight-tickets-cyprus`
4. `https://www.jetset-travel.com/en/hotel-booking-cyprus`
5. `https://www.jetset-travel.com/en/cruises`
6. `https://www.jetset-travel.com/en/corporate-travel-cyprus`
7. `https://www.jetset-travel.com/en/luxury-travel`
8. `https://www.jetset-travel.com/en/visa-services`
9. `https://www.jetset-travel.com/en/blog`
10. `https://www.jetset-travel.com/ru` (Russian homepage)

For each URL: paste it → click "Request Indexing" → wait for confirmation. Note: there is a daily quota (~10-12 requests/day), so spread these across a few days.

### Step 3: Validate Fixes for Each Issue Category

After deploying code changes, go back to the **Page indexing** report and click "VALIDATE FIX" for each issue:

1. **Page with redirect** → Validate Fix
2. **Not found (404)** → Validate Fix
3. **Blocked by robots.txt** → Validate Fix
4. **Discovered - currently not indexed** → Validate Fix
5. **Crawled - currently not indexed** → Validate Fix

This tells Google to re-check these URLs and speeds up the re-crawling process.

### Step 4: Verify robots.txt Update

1. Go to `https://www.jetset-travel.com/robots.txt` in your browser to confirm changes are live
2. In GSC, use the **URL Inspection tool** on one of the font URLs to verify it's no longer blocked:
   - `https://www.jetset-travel.com/_next/static/media/dm_sans_latin_wght_italic-s.p.d34d5dcc.woff2`

### Step 5: Monitor Progress

- Check the Page indexing report weekly for 4-6 weeks
- The "Discovered - currently not indexed" count should steadily decrease
- New pages should appear in the "Indexed" count
- If pages remain stuck after 4 weeks, consider building more external backlinks

---

## Summary Checklist

| # | Task | Type | Priority |
|---|------|------|----------|
| 1 | Fix robots.txt — allow /_next/static/ | Code | HIGH |
| 2 | Add 301 redirects for /luxury → /luxury-travel | Code | HIGH |
| 3 | Fix /en/en doubled locale redirect | Code | MEDIUM |
| 4 | Redirect ?lang= param URLs to clean paths | Code | MEDIUM |
| 5 | Generate comprehensive XML sitemap | Code | HIGH |
| 6 | Add canonical + hreflang tags to all pages | Code | HIGH |
| 7 | Verify HTTP/www redirects are 301 | Code | LOW |
| 8 | Submit sitemap in GSC | Manual (GSC) | HIGH |
| 9 | Request indexing for top 10 pages | Manual (GSC) | HIGH |
| 10 | Validate fixes in GSC | Manual (GSC) | HIGH |
| 11 | Monitor weekly for 4-6 weeks | Manual (GSC) | ONGOING |

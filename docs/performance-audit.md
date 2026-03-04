# Next.js Performance Audit — JetSet Travel Cyprus

**Date:** 2026-03-03
**Scope:** next.config.ts, dependencies, components, Core Web Vitals

Recommendations are sorted by **estimated impact** (High → Low).

---

## 1. next.config.ts Review

### Image Optimisation
- **AVIF + WebP enabled** (`formats: ["image/avif", "image/webp"]`) — good.
- No `deviceSizes` / `imageSizes` overrides — defaults are fine for this project.
- `remotePatterns` is not configured, but all images are local (`/images/`) so no issue.

### Compression
- **No explicit `compress: true`** — this is already the default in Next.js, so gzip/brotli compression is active. No action needed.

### Caching Headers
- **No `Cache-Control` headers for static assets.** Next.js automatically sets long-lived cache headers for `/_next/static/*` files (hashed filenames), but **public folder assets** (`/images/*`, `/videos/*`, `/fonts/*`) get no caching headers by default.

> **Recommendation (HIGH):** Add `Cache-Control` headers for static assets in `next.config.ts`:
> ```ts
> {
>   source: "/images/:path*",
>   headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
> },
> {
>   source: "/videos/:path*",
>   headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
> },
> {
>   source: "/fonts/:path*",
>   headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
> },
> ```

### Security Headers
- HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy — all present and correct.

---

## 2. Dependency Audit

### Unused Dependencies (remove from package.json)

| Package | Size (approx.) | Status |
|---------|----------------|--------|
| `next-seo` | ~15 KB | **Never imported** — project uses native Next.js `generateMetadata` API |
| `@fontsource-variable/dm-sans` | ~200 KB | **Never imported** — fonts are loaded via `next/font/local` with WOFF2 files |
| `@fontsource-variable/playfair-display` | ~300 KB | **Never imported** — same as above |

> **Recommendation (HIGH):** Remove these three unused packages. They add dead weight to `node_modules` and slow down `npm install` in CI. They do not affect the client bundle (not imported), but they should still be cleaned up.

### Large Dependencies to Consider

| Package | Bundle Impact | Note |
|---------|---------------|------|
| `framer-motion` | ~46 KB gzipped | Used in 7 files. Loaded on every page because HeroSection uses it. See section 3 for lazy-loading recommendations. |
| `zod` | ~14 KB gzipped | Used for form validation. No alternative needed — it tree-shakes well. |
| `react-hook-form` | ~9 KB gzipped | Only loaded on pages with forms. Appropriate size. |

### Markdown Libraries (gray-matter, unified, remark-parse, remark-html)
- All imported only in `src/lib/blog.ts` and `src/lib/markdown.ts`
- These are server-only files (use `fs` module) — they do **not** ship to the client bundle.
- No action needed.

---

## 3. Component-Level Recommendations

### 3a. Dynamic Imports — No Usage Found

**Zero files** use `next/dynamic` or `React.lazy`. This is the biggest optimisation opportunity.

> **Recommendation (HIGH):** Lazy-load below-fold sections on the homepage with `next/dynamic`:
>
> In `src/app/[locale]/page.tsx`:
> ```tsx
> import dynamic from "next/dynamic";
>
> const ServicesGrid   = dynamic(() => import("@/components/sections/ServicesGrid"));
> const TrustSection   = dynamic(() => import("@/components/sections/TrustSection"));
> const ComparisonSection = dynamic(() => import("@/components/sections/ComparisonSection"));
> const GoogleReviews  = dynamic(() => import("@/components/sections/GoogleReviews"));
> const ClientLogos    = dynamic(() => import("@/components/sections/ClientLogos"));
> const CTABanner      = dynamic(() => import("@/components/sections/CTABanner"));
> ```
>
> This defers loading framer-motion (~46 KB) and all below-fold section code until they're actually rendered. The hero stays eagerly loaded (it's above the fold).

### 3b. Image Usage — Excellent

- **All images use `next/image`** — no raw `<img>` tags found anywhere in `src/`.
- All images have explicit `width`/`height` or `fill` + `sizes` attributes.
- Hero image has `priority={true}`.
- Below-fold images use `loading="lazy"`.
- **No action needed.**

### 3c. Client vs Server Components

**29 of 79 files (37%)** have `"use client"`. Most need it (forms, animations, state), but these do not:

| Component | Why it could be a Server Component |
|-----------|-----------------------------------|
| `src/components/seo/HreflangTags.tsx` | Uses `usePathname` for canonical/hreflang links. Could be computed server-side via page params instead. |
| `src/components/seo/BreadcrumbSchema.tsx` | Uses `usePathname` for JSON-LD breadcrumbs. Same — derivable from server-side route params. |
| `src/app/[locale]/HtmlLangSetter.tsx` | **Dead code.** The layout already sets `<html lang={locale}>` server-side. This component is never imported. |

> **Recommendation (MEDIUM):** Delete `HtmlLangSetter.tsx` (dead code). Refactor `HreflangTags` and `BreadcrumbSchema` to accept `locale` and `pathname` as props from the server layout/page, removing the need for `"use client"`.

**Footer.tsx** uses `"use client"` for `useTranslations` and `useLocale`. These are `next-intl` client hooks. Converting to server component would require switching to `getTranslations` (server). This is a valid optimisation but moderate effort — the Footer renders static links and images.

> **Recommendation (LOW):** Consider converting `Footer.tsx` to a server component using `getTranslations` + passing `locale` as a prop. Low priority since Footer is below the fold and lazy-hydrated.

---

## 4. Core Web Vitals Assessment

### Largest Contentful Paint (LCP)

| Factor | Status |
|--------|--------|
| Hero image `priority={true}` | ✅ Set correctly |
| `<link rel="preload" as="image" href="/images/hero-bg.jpg">` | ✅ Present in homepage |
| Image format (AVIF/WebP) | ✅ Configured in next.config |
| Font `display: "swap"` | ✅ Prevents FOIT blocking LCP |
| Header logo `priority={true}` | ✅ Set correctly |

**LCP is well optimised.** The hero image is preloaded, prioritised, and served in modern formats.

> **Recommendation (LOW):** Verify hero-bg.jpg file size. If > 200 KB, consider generating a smaller placeholder or using `placeholder="blur"` with a blurDataURL for perceived performance.

### Cumulative Layout Shift (CLS)

| Factor | Status |
|--------|--------|
| All images have width/height or fill+sizes | ✅ No layout shift from images |
| Fonts use `display: "swap"` | ⚠️ Font swap can cause minor CLS |
| Video conditionally rendered (desktop-only) | ✅ Does not shift layout on mobile |
| Cookie consent banner | ⚠️ Potential CLS source — appears after load |

**CLS is good overall.** Two minor concerns:

> **Recommendation (LOW):** For the `CookieConsentBanner`, ensure it uses a fixed/sticky position (not pushing content down). If it's a bottom banner, it likely doesn't shift content — verify this is the case.

### First Input Delay / Interaction to Next Paint (INP)

| Factor | Status |
|--------|--------|
| framer-motion loaded eagerly | ⚠️ ~46 KB JS parsed on load |
| No heavy computations on main thread | ✅ |
| reCAPTCHA loaded with `strategy="lazyOnload"` | ✅ Deferred correctly |
| No blocking third-party scripts | ✅ |
| Video on desktop: uses native `<video>` | ✅ Not JS-heavy |

**INP is acceptable**, but the lack of code-splitting (no `next/dynamic`) means the initial JS bundle is larger than it needs to be.

> **Recommendation (HIGH):** Dynamic imports (section 3a above) would reduce initial JS parse time and improve INP on slower devices.

---

## 5. Summary — All Recommendations by Priority

### HIGH Impact

| # | Issue | Fix | Est. Savings |
|---|-------|-----|-------------|
| 1 | **No dynamic imports** — all below-fold sections eagerly loaded | Use `next/dynamic` for ServicesGrid, TrustSection, ComparisonSection, GoogleReviews, ClientLogos, CTABanner | ~50-80 KB less initial JS |
| 2 | **No Cache-Control for public assets** | Add immutable cache headers for `/images/*`, `/videos/*`, `/fonts/*` in `next.config.ts` headers | Faster repeat visits |
| 3 | **Unused dependencies** in package.json | Remove `next-seo`, `@fontsource-variable/dm-sans`, `@fontsource-variable/playfair-display` | Cleaner deps, faster CI installs |

### MEDIUM Impact

| # | Issue | Fix | Est. Savings |
|---|-------|-----|-------------|
| 4 | **SEO components are client-side unnecessarily** | Refactor `HreflangTags` and `BreadcrumbSchema` to accept props from server, remove `"use client"` | Less client JS, faster hydration |
| 5 | **Dead code: `HtmlLangSetter.tsx`** | Delete the file — `<html lang={locale}>` is already set server-side in the layout | Code hygiene |

### LOW Impact

| # | Issue | Fix | Note |
|---|-------|-----|------|
| 6 | **Footer is a client component** | Convert to server component with `getTranslations` | Below-fold, low urgency |
| 7 | **Verify hero image file size** | Compress if > 200 KB; consider `placeholder="blur"` | Already preloaded + prioritised |
| 8 | **Cookie banner CLS** | Verify it doesn't shift content (likely fine if fixed/sticky position) | Minor concern |

---

## What's Already Done Well

- All images use `next/image` with proper attributes — no raw `<img>` tags
- Fonts are self-hosted via `next/font/local` with WOFF2 + `display: "swap"`
- `lucide-react` uses named imports (tree-shakeable)
- Markdown processing is server-only
- reCAPTCHA uses `strategy="lazyOnload"`
- Security headers are comprehensive
- Hero image has `priority` + preload link
- Video is conditionally loaded (desktop-only, on-demand on mobile)
- AVIF + WebP image formats configured

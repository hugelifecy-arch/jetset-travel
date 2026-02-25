# CLAUDE.md — JetSet Travel Cyprus

This file provides AI assistants with the context needed to work effectively in this codebase.

---

## Project Overview

**JetSet Travel Cyprus** is a full-stack Next.js travel agency website targeting corporate and luxury travellers based in Paphos, Cyprus. It supports English and Russian audiences, handles lead generation via contact/quote forms, and integrates email delivery and rate limiting for its API routes.

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.9 (strict mode)
- **UI:** React 19 + Tailwind CSS 4
- **Deployment:** GitHub Pages (static-ish via CI) + serverless edge/API routes
- **Domain:** https://www.jetset-travel.com

---

## Repository Structure

```
/
├── src/
│   ├── app/
│   │   ├── [locale]/            # All pages under dynamic locale segment
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── layout.tsx       # Locale layout (NextIntlClientProvider)
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── corporate-travel/
│   │   │   ├── hotel-reservations/
│   │   │   ├── luxury-travel/
│   │   │   ├── quote/
│   │   │   ├── visa-services/
│   │   │   └── HtmlLangSetter.tsx
│   │   ├── api/
│   │   │   ├── contact/route.ts # Contact form API
│   │   │   └── quote/route.ts   # Quote form API (rate-limited)
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Root redirect (→ /en or /ru)
│   │   ├── robots.ts            # Auto-generated robots.txt
│   │   └── sitemap.ts           # Auto-generated sitemap.xml
│   ├── components/
│   │   ├── forms/
│   │   │   ├── LeadForm.tsx     # Reusable hero lead form
│   │   │   └── schemas.ts       # Zod validation schemas
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Sticky nav + EN/RU toggle + mobile menu
│   │   │   ├── Footer.tsx       # Multi-column footer
│   │   │   └── WhatsAppButton.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx  # Full-screen hero (video bg desktop, img mobile)
│   │   │   ├── ServicesGrid.tsx
│   │   │   ├── TrustSection.tsx
│   │   │   ├── GoogleReviews.tsx
│   │   │   ├── ClientLogos.tsx
│   │   │   └── CTABanner.tsx
│   │   ├── seo/
│   │   │   ├── LocalBusinessSchema.tsx  # Schema.org TravelAgency structured data
│   │   │   └── meta.ts
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── lib/
│   │   ├── email/resend.ts      # Resend email service wrapper
│   │   ├── utils/cn.ts          # Tailwind class utility (clsx + twMerge)
│   │   ├── seo.ts               # Canonical URL + hreflang helpers
│   │   └── rate-limit.ts        # Upstash Redis rate limiter
│   ├── messages/
│   │   ├── en.json              # English translations
│   │   └── ru.json              # Russian translations
│   ├── types/                   # Shared TypeScript types
│   ├── fonts/                   # Local WOFF2 font files
│   ├── i18n.ts                  # next-intl config (getRequestConfig)
│   └── proxy.ts                 # Locale middleware/proxy
├── public/images/               # Static assets (logo, OG image, hero bg)
├── tests/
│   └── jetset-utils.test.js     # Node.js native test runner (unit tests)
├── docs/
│   ├── acceptance-criteria.md
│   ├── release-checklist.md
│   └── website-renewal-plan.md
├── .github/workflows/
│   └── deploy-pages.yml         # GitHub Pages CI/CD
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

Legacy static files (`index.html`, `app.js`, `styles.css`, `jetset-utils.js`) remain in the root but are superseded by the Next.js app.

---

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint check
node --test tests/jetset-utils.test.js  # Run unit tests
```

There is no `npm test` script; tests run directly with the Node.js native test runner.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose | Required |
|---|---|---|
| `RESEND_API_KEY` | Transactional email (Resend) | Yes for email |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp CTA link phone number | No (defaults to `35799000000`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL | No (defaults to `https://www.jetset-travel.com`) |
| `UPSTASH_REDIS_REST_URL` | Rate limiter backend URL | Yes for quote API |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiter auth token | Yes for quote API |

Both `RESEND_API_KEY` and Upstash variables have graceful fallbacks—the app runs without them but email delivery and rate limiting are disabled.

---

## Architecture & Key Conventions

### Routing

All user-facing pages live under `src/app/[locale]/`. The `[locale]` segment is either `en` or `ru`. The root `src/app/page.tsx` redirects visitors to the appropriate locale.

Middleware in `src/proxy.ts` handles locale detection and deduplication redirects (e.g., `/en/en/...` → `/en/...`).

### Internationalisation (i18n)

- **Library:** `next-intl` 4.x
- **Config:** `src/i18n.ts` — server-side `getRequestConfig` loads the correct JSON file
- **Messages:** `src/messages/en.json` and `src/messages/ru.json`
- **Usage in components:** `useTranslations('namespace')` hook on the client; `getTranslations` on the server

When adding new UI copy, add keys to **both** `en.json` and `ru.json`. Keep key names namespaced (e.g., `hero.title`, `nav.contact`).

### Styling

- **Tailwind CSS 4** (PostCSS-based, no `tailwind.config.js` plugins needed for v4)
- Custom brand tokens defined in `tailwind.config.ts`:
  - `brand-navy`: `#1B2A4A` — primary dark
  - `brand-gold`: `#C9A84C` — accent / CTA
  - `brand-light`: `#EBF2FA` — light background
  - `brand-dark`: `#0F1A2E` — darker background
- **Fonts:** Playfair Display (display/headings), DM Sans (body) — loaded from local WOFF2 files with `font-display: swap`
- Use `cn()` from `src/lib/utils/cn.ts` for conditional class composition

### Forms & Validation

- **React Hook Form** + **Zod** schemas in `src/components/forms/schemas.ts`
- Three schemas: `leadFormSchema`, `contactSchema`, `QuoteSchema`
- `QuoteSchema` includes a honeypot `company` field (must remain empty to pass validation)
- Server-side API routes re-validate with the same Zod schemas — never trust client-side validation alone

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | Contact form → Resend emails (notification + auto-reply) |
| `/api/quote` | POST | Quote request → rate-limited (5 req/60 s per IP), email/CRM TODO |

Both routes return `{ success/ok: true }` on success and `{ error, details? }` on failure with appropriate HTTP status codes (400 validation, 429 rate limit, 500 server error).

### SEO

- Each page exports a `generateMetadata` function using helpers from `src/lib/seo.ts`
- `LocalBusinessSchema` component injects Schema.org `TravelAgency` JSON-LD
- `src/app/robots.ts` and `src/app/sitemap.ts` auto-generate crawl directives
- OG image: `https://www.jetset-travel.com/images/jetset-og-image.jpg` (1200×630)
- Hreflang: `en` / `ru` + `x-default` on every page

### Security Headers

Configured in `next.config.ts` for all routes:

- `Strict-Transport-Security` — 2-year HSTS with preload
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

Vercel preview deployments receive `X-Robots-Tag: noindex` automatically.

---

## Compliance — Do Not Modify

The following identifiers are **official and must not be changed** anywhere in the codebase (footer, schema, docs):

| Identifier | Value |
|---|---|
| Tourism License | **7775** |
| IATA Accreditation | **14200130** |
| Cyprus Company Registration | **HE 181550** |
| Office Address | 26A Agapinoros Street, 8049 Paphos, Cyprus |
| Primary Phone | +357 99 478 073 |
| Secondary Phone | +357 99 310 993 |
| Email | INFO@JETSET.COM.CY |

Visa-related content must include a disclaimer that decisions rest with consulates/authorities.

---

## Testing

Tests use the **Node.js built-in test runner** (`node:test`). There is no Jest or Vitest.

```bash
node --test tests/jetset-utils.test.js
```

Current coverage in `tests/jetset-utils.test.js`:
- `isValidEmail()` — email format validation
- `validateLeadPayload()` — required field presence
- `buildMailtoHref()` — mailto link encoding

When adding utilities to `jetset-utils.js` (legacy layer) or pure TS utility functions, add corresponding tests in `tests/`.

---

## CI/CD & Deployment

- **GitHub Actions** workflow: `.github/workflows/deploy-pages.yml`
- Triggers on push to `master`
- Generates a deployment stamp (git SHA + timestamp + run ID)
- Uploads the repo as a GitHub Pages artifact and deploys
- **Custom domain:** `jetset-travel.com` → `www.jetset-travel.com` via CNAME + edge proxy

For pre-merge checks and rollback procedures see `docs/release-checklist.md`.

---

## Active Development Roadmap

Three planned PRs from `docs/website-renewal-plan.md`:

| PR | Focus | Key Work |
|---|---|---|
| PR 1 | CRO + Trip.com | Dual-path conversion funnel, analytics event tracking |
| PR 2 | SEO + Brand Assets | Service landing page metadata, expanded structured data |
| PR 3 | Performance + QA | Lighthouse targets, CSS build optimisation, CI quality gates |

**Outstanding TODO in code:**
- `src/app/api/quote/route.ts` — email/CRM delivery after quote validation (currently only validates and rate-limits; no email is sent)

---

## Common Patterns

### Adding a new page

1. Create `src/app/[locale]/<slug>/page.tsx`
2. Export `generateMetadata` using `src/lib/seo.ts` helpers
3. Use `getTranslations` (server) or `useTranslations` (client)
4. Add translation keys to both `en.json` and `ru.json`
5. Add the URL to `src/app/sitemap.ts`

### Adding a new translated string

1. Add the key to `src/messages/en.json`
2. Add the Russian equivalent to `src/messages/ru.json`
3. Use via `t('namespace.key')` in the component

### Adding a new form field

1. Update the relevant Zod schema in `src/components/forms/schemas.ts`
2. Update the React Hook Form registration in the component
3. Update the API route handler to expect/validate the new field
4. Add translation keys for label and validation messages

### Adding a new API route

1. Create `src/app/api/<name>/route.ts`
2. Use Zod for input validation
3. Add rate limiting if the endpoint is public-facing (see `src/lib/rate-limit.ts`)
4. Return consistent `{ ok/success: boolean, error?: string }` shape

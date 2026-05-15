# Canonical root strategy

Phase 6 Step 53. Locks in which URL is the canonical homepage so Google
does not split equity between `/` and `/{locale}`.

## Decision

**`/{locale}` is the canonical homepage. `/` is a 301 hop and is never
emitted in any internal link, sitemap entry, `<link rel="canonical">`,
hreflang `alternates`, or `og:url`.**

The chosen locale at the root is resolved per-request from the
`Accept-Language` header (see `src/middleware.ts` → `pickPreferredLocale`).
The redirect carries `Vary: Accept-Language` so shared caches do not
serve a wrong-locale 301 to another visitor.

## Why not the opposite (canonical = `/`, locales = alternates)

GSC Performance data has consistently shown the locale-prefixed URL
winning impressions: `/en` beats `/en/` 24:12, `/en` beats `/` for
"travel agency paphos", and the hreflang cluster already lives on the
locale-prefixed URLs. Inverting the canonical now would invalidate the
Phase 3 work that flipped the canonical to the no-trailing-slash form
and would require regenerating every `<link rel="alternate">`.

## How the strategy is enforced in code

- **`src/middleware.ts`** — every `/` hit returns `301 → /{locale}`,
  with `Vary: Accept-Language` on the redirect response.
- **`src/lib/canonical.ts` → `getCanonicalUrl`** — root translates to
  `/{locale}` (no trailing slash) for every consumer.
- **`src/app/sitemap.ts`** — the homepage entry is emitted as `/en` and
  `/ru`, never `/`.
- **`src/app/[locale]/layout.tsx`** — `localizedAlternates(locale)` for
  the locale root uses `getCanonicalUrl("", loc)` → `/{locale}`, and
  emits `x-default` → `/en`.
- **Internal links** — Header, Footer, language switcher, breadcrumbs
  and CTA buttons all build URLs with the `/${locale}` prefix; no
  component emits a bare `/` link to its own homepage.

## Phase 6 acceptance check

GSC "Top pages" for the brand query "jetset travel" should show only
ONE homepage row (`/en` or `/ru` per device locale). If `/` reappears
as a separate row alongside `/en`, the root redirect chain has been
broken upstream of Next.js (CDN, edge function, host header
canonicalisation) — re-verify with `curl -sI https://www.jetset-travel.com/`
and expect `HTTP/2 301` with `Location: /en` (or `/ru`).

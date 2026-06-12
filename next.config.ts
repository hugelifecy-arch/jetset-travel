import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const VERCEL_HOST = "jetset-travel.vercel.app";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://connect.facebook.net https://www.clarity.ms https://www.google.com https://www.gstatic.com https://www.recaptcha.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://mc.yandex.ru https://connect.facebook.net https://*.clarity.ms https://vitals.vercel-insights.com https://vercel.live",
      "frame-src 'self' https://www.google.com https://www.youtube.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Phase 3: canonical URL form has NO trailing slash across the site
  // (see src/lib/canonical.ts). GSC Performance data confirmed Google
  // currently selects the no-slash form for nearly every ranking URL
  // (homepage /en beats /en/ 24:12, /en/blog/cruises-from-limassol-2026
  // beats its slashed twin 21:6, /en/blog/cyprus-schengen-2026-business-
  // travel beats its slashed twin 11:6). Next.js automatically issues a
  // single 308 from /path/ → /path for any page route that arrives with
  // a trailing slash, so the redirects below only need to handle
  // destination-specific bridges (locale slug swaps, retired stubs, the
  // wrong-folder fix).
  trailingSlash: false,
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
        search: "",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Host canonicalization (apex → www), `/en/en → /en`, trailing-slash,
    // and `?lang=` stripping all live in `src/middleware.ts` so they happen
    // in a single 301 hop. Keep only destination-specific redirects here.
    //
    // Order matters: `next.config.ts` redirects run BEFORE middleware. Any
    // rule added here that the middleware would also match will create a
    // redirect chain and re-trigger Google Search Console's "Page with
    // redirect" validation failure.
    return [
      // Phase 3 — wrong-folder critical fix (5 clicks, 1,865 impressions).
      // GSC Performance shows the RU folder is currently serving an EN-only
      // slug. Send it to the EN equivalent (where its translation actually
      // lives) instead of 404ing.
      {
        source: "/ru/blog/cyprus-schengen-2026-business-travel",
        destination: "/en/blog/cyprus-schengen-2026-business-travel",
        permanent: true,
      },
      // Bare-path bridges (legacy inbound links from before the locale split).
      {
        source: "/luxury",
        destination: "/en/luxury-travel",
        permanent: true,
      },
      {
        source: "/en/luxury",
        destination: "/en/luxury-travel",
        permanent: true,
      },
      {
        source: "/ru/luxury",
        destination: "/ru/luxury-travel",
        permanent: true,
      },
      // Cross-locale SEO slug bridges. Each service page has a localised
      // slug; off-locale visits used to be handled by a server-component
      // `redirect()` call on every request, which forces Next to build and
      // render a stub page just to emit a 307. Catching them here collapses
      // each off-locale hit into a single 308 at the edge.
      {
        source: "/ru/paphos-travel-agency",
        destination: "/ru/turisticheskoe-agentstvo-pafos",
        permanent: true,
      },
      {
        source: "/en/turisticheskoe-agentstvo-pafos",
        destination: "/en/paphos-travel-agency",
        permanent: true,
      },
      {
        source: "/ru/flight-tickets-cyprus",
        destination: "/ru/aviabilety-kipr",
        permanent: true,
      },
      {
        source: "/en/aviabilety-kipr",
        destination: "/en/flight-tickets-cyprus",
        permanent: true,
      },
      // Consolidate the four cross-locale "cyprus" landing pages onto the
      // Latin slug in BOTH locales. The transliterated Russian slugs were
      // duplicate landing pages with no content (pure redirect stubs); they
      // looped against the EN-slug page's `redirect("/ru/<ru-slug>")` and
      // showed up in GSC as "Redirect error" / "Discovered — not indexed".
      // After this consolidation the canonical Russian URL is the same
      // Latin slug as English (mirrors /ru/visa-services, /ru/about, etc.).
      {
        source: "/en/vizovye-uslugi-kipr",
        destination: "/en/visa-services-cyprus",
        permanent: true,
      },
      {
        source: "/ru/vizovye-uslugi-kipr",
        destination: "/ru/visa-services-cyprus",
        permanent: true,
      },
      {
        source: "/en/luxusnyy-otdykh-kipr",
        destination: "/en/luxury-travel-cyprus",
        permanent: true,
      },
      {
        source: "/ru/luxusnyy-otdykh-kipr",
        destination: "/ru/luxury-travel-cyprus",
        permanent: true,
      },
      {
        source: "/en/korporativnye-poezdki-kipr",
        destination: "/en/corporate-travel-cyprus",
        permanent: true,
      },
      {
        source: "/ru/korporativnye-poezdki-kipr",
        destination: "/ru/corporate-travel-cyprus",
        permanent: true,
      },
      {
        source: "/en/bronirovanie-otelej-kipr",
        destination: "/en/hotel-booking-cyprus",
        permanent: true,
      },
      {
        source: "/ru/bronirovanie-otelej-kipr",
        destination: "/ru/hotel-booking-cyprus",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:locale(en|ru)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:file(.+\\.(?:ico|png|svg|webmanifest|webp|jpg|jpeg|gif|woff|woff2|ttf|otf|mp4|webm))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Step 6 — non-content text files (AI/LLM discovery + humans.txt)
        // stay reachable but must never be indexed as standalone "pages".
        // X-Robots-Tag: noindex keeps them out of web search while leaving
        // them fully readable to AI crawlers (which ignore noindex). They
        // are deliberately absent from sitemap.xml; this is the belt-and-
        // braces signal so GSC can't surface them as thin results.
        source: "/:file(ai\\.txt|llms\\.txt|llms-full\\.txt|humans\\.txt)",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/:path*",
        has: [{ type: "host", value: VERCEL_HOST }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);

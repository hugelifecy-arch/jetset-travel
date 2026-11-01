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
      // reCAPTCHA v3 fetches https://www.google.com/recaptcha/api2/clr from the
      // page itself; without it every page logged a CSP violation (audit F-08).
      // Sources per https://developers.google.com/recaptcha/docs/faq (CSP).
      // GA4 sends hits to analytics.google.com / www.google.com /g/collect and
      // www.googletagmanager.com; without these every hit was blocked and GA
      // never received data. Hosts per Google's "Analytics without any Ads
      // features" list: https://developers.google.com/tag-platform/tag-manager/csp
      // (*.google.com also covers the reCAPTCHA path above). Ads endpoints
      // (*.g.doubleclick.net) stay blocked: no advertising consent is asked.
      "connect-src 'self' https://www.google.com/recaptcha/ https://www.googletagmanager.com https://*.google.com https://www.google-analytics.com https://*.google-analytics.com https://mc.yandex.ru https://connect.facebook.net https://*.clarity.ms https://vitals.vercel-insights.com https://vercel.live",
      "frame-src 'self' https://www.google.com https://recaptcha.google.com/recaptcha/ https://www.youtube.com",
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
  // Canonical URL form has NO trailing slash (src/lib/canonical.ts).
  // `skipTrailingSlashRedirect` turns off Next's built-in /path/ → /path
  // 308, which ran BEFORE the proxy and so turned every slashed retired URL
  // into a two-hop chain (308 strip, then the redirect). The proxy
  // (src/proxy.ts → src/lib/canonicalize.ts) now strips the slash itself,
  // together with host, locale and retired-URL fixes, in one 301.
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
        search: "",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // No `redirects()` here on purpose. Every redirect (apex → www, trailing
  // slash, /en/en, ?lang=, bare paths, retired and merged URLs, wrong-locale
  // blog slugs) is resolved by the proxy in a single 301 hop; the
  // destination table lives in src/lib/redirects.ts. Config redirects run
  // before the proxy, answer 308 and would re-create redirect chains.
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

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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://connect.facebook.net https://www.clarity.ms https://*.elfsight.com https://static.elfsight.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://mc.yandex.ru https://*.elfsight.com https://connect.facebook.net https://*.clarity.ms https://vitals.vercel-insights.com https://vercel.live",
      "frame-src 'self' https://www.google.com https://*.elfsight.com https://www.youtube.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  { key: "Vary", value: "User-Agent" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Canonical URL form is WITH a trailing slash across the site
  // (see src/lib/canonical.ts). Next.js issues the non-slash → slash
  // redirect for any page route that isn't already handled in middleware.
  trailingSlash: true,
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
      {
        source: "/luxury",
        destination: "/en/luxury-travel/",
        permanent: true,
      },
      {
        source: "/en/luxury",
        destination: "/en/luxury-travel/",
        permanent: true,
      },
      {
        source: "/ru/luxury",
        destination: "/ru/luxury-travel/",
        permanent: true,
      },
      // Cross-locale SEO slug bridges. Each service page has a localised
      // slug; off-locale visits used to be handled by a server-component
      // `redirect()` call on every request, which forces Next to build and
      // render a stub page just to emit a 307. Catching them here collapses
      // each off-locale hit into a single 308 at the edge.
      {
        source: "/ru/paphos-travel-agency",
        destination: "/ru/turisticheskoe-agentstvo-pafos/",
        permanent: true,
      },
      {
        source: "/en/turisticheskoe-agentstvo-pafos",
        destination: "/en/paphos-travel-agency/",
        permanent: true,
      },
      {
        source: "/ru/flight-tickets-cyprus",
        destination: "/ru/aviabilety-kipr/",
        permanent: true,
      },
      {
        source: "/en/aviabilety-kipr",
        destination: "/en/flight-tickets-cyprus/",
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

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
    return [
      // Redirect non-www to www — but skip robots.txt, sitemap.xml,
      // and Yandex verification files so they're accessible on the apex domain.
      {
        source: "/((?!robots\\.txt|sitemap\\.xml|llms\\.txt|llms-full\\.txt|yandex_).*)",
        has: [{ type: "host", value: "jetset-travel.com" }],
        destination: "https://www.jetset-travel.com/:path*",
        permanent: true,
      },
      // Root "/" redirect is handled by middleware (with Accept-Language detection)
      // /luxury → /luxury-travel redirects (404 fix)
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
      { source: "/en/en", destination: "/en", statusCode: 301 },
      { source: "/en/en/:path*", destination: "/en/:path*", statusCode: 301 },
      { source: "/ru/ru", destination: "/ru", statusCode: 301 },
      { source: "/ru/ru/:path*", destination: "/ru/:path*", statusCode: 301 },
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

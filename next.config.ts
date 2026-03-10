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
];

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Redirect non-www to www (Yandex needs consistent Host)
      {
        source: "/:path*",
        has: [{ type: "host", value: "jetset-travel.com" }],
        destination: "https://www.jetset-travel.com/:path*",
        permanent: true,
      },
      { source: "/", destination: "/en", statusCode: 301 },
      { source: "/en/en", destination: "/en", statusCode: 301 },
      { source: "/en/en/:path*", destination: "/en/:path*", statusCode: 301 },
      { source: "/ru/ru", destination: "/ru", statusCode: 301 },
      { source: "/ru/ru/:path*", destination: "/ru/:path*", statusCode: 301 },
    ];
  },
  async headers() {
    return [
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

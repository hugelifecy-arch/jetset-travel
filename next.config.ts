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
  env: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY ?? "",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: true },
      { source: "/en/en", destination: "/en", permanent: true },
      { source: "/en/en/:path*", destination: "/en/:path*", permanent: true },
      { source: "/ru/ru", destination: "/ru", permanent: true },
      { source: "/ru/ru/:path*", destination: "/ru/:path*", permanent: true },
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

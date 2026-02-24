"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Globe } from "lucide-react";

const navKeys = [
  { href: "/services", key: "services" },
  { href: "/corporate", key: "corporate" },
  { href: "/luxury", key: "luxury" },
  { href: "/visas", key: "visas" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 bg-brand-navy border-b-2 border-brand-gold">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Image
              src="/images/jetset-logo.svg"
              alt="JetSet Travel Cyprus"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navKeys.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="px-3 py-2 text-sm font-medium text-white/80 hover:text-brand-gold transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Right side: language toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <Globe className="h-4 w-4 text-white/60" />
              <Link
                href="/en"
                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                  locale === "en"
                    ? "font-bold text-brand-gold"
                    : "font-medium text-white/60 hover:text-white"
                }`}
              >
                EN
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href="/ru"
                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                  locale === "ru"
                    ? "font-bold text-brand-gold"
                    : "font-medium text-white/60 hover:text-white"
                }`}
              >
                RU
              </Link>
            </div>

            <Link
              href={`/${locale}/contact`}
              className="rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              {t("getQuote")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-brand-navy">
          <nav className="px-4 py-4 space-y-1">
            {navKeys.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="block px-3 py-2.5 text-base font-medium text-white/80 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-white/60" />
                <Link
                  href="/en"
                  className={`px-2 py-1 rounded text-sm ${
                    locale === "en"
                      ? "font-bold text-brand-gold"
                      : "font-medium text-white/60"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  EN
                </Link>
                <Link
                  href="/ru"
                  className={`px-2 py-1 rounded text-sm ${
                    locale === "ru"
                      ? "font-bold text-brand-gold"
                      : "font-medium text-white/60"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  RU
                </Link>
              </div>

              <Link
                href={`/${locale}/contact`}
                className="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy"
                onClick={() => setMobileOpen(false)}
              >
                {t("getQuote")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

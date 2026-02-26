"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Globe, Phone } from "lucide-react";

const navKeys = [
  { href: "/corporate-travel", key: "corporate" },
  { href: "/luxury-travel", key: "luxury" },
  { href: "/visa-services", key: "visas" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/faq", key: "faq" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();

  // Build the same page path in the other locale
  const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, "") || "";
  const enHref = `/en${pathWithoutLocale}`;
  const ruHref = `/ru${pathWithoutLocale}`;

  return (
    <header className="sticky top-0 z-50 bg-brand-navy border-b-2 border-brand-gold">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Image
              src="/images/jetset-logo.svg"
              alt="JetSet Travel Cyprus - Home"
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

          {/* Right side: phone + language toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+35799478073"
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-brand-gold transition-colors"
              aria-label="Call JetSet Travel"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+357 99 478 073</span>
            </a>
            <span className="text-white/20">|</span>
            <nav aria-label="Language selection" className="flex items-center gap-1 text-sm">
              <Globe className="h-4 w-4 text-white/60" />
              <Link
                href={enHref}
                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                  locale === "en"
                    ? "font-bold text-brand-gold underline underline-offset-4"
                    : "font-normal text-white/50 hover:text-white"
                }`}
                aria-current={locale === "en" ? "page" : undefined}
                aria-label="English"
                title="English"
              >
                EN
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href={ruHref}
                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                  locale === "ru"
                    ? "font-bold text-brand-gold underline underline-offset-4"
                    : "font-normal text-white/50 hover:text-white"
                }`}
                aria-current={locale === "ru" ? "page" : undefined}
                aria-label="Русский"
                title="Русский"
              >
                RU
              </Link>
            </nav>

            <Link
              href={`/${locale}/contact`}
              className="rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              {t("getQuote")}
            </Link>
          </div>

          {/* Mobile: language switcher + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <nav aria-label="Language selection" className="flex items-center gap-1 text-sm">
              <Link
                href={enHref}
                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                  locale === "en"
                    ? "font-bold text-brand-gold underline underline-offset-4"
                    : "font-normal text-white/50 hover:text-white"
                }`}
                aria-current={locale === "en" ? "page" : undefined}
                aria-label="English"
                title="English"
              >
                EN
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href={ruHref}
                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                  locale === "ru"
                    ? "font-bold text-brand-gold underline underline-offset-4"
                    : "font-normal text-white/50 hover:text-white"
                }`}
                aria-current={locale === "ru" ? "page" : undefined}
                aria-label="Русский"
                title="Русский"
              >
                RU
              </Link>
            </nav>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-white"
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
              <nav aria-label="Language selection" className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-white/60" />
                <Link
                  href={enHref}
                  className={`px-2 py-1 rounded text-sm transition-colors ${
                    locale === "en"
                      ? "font-bold text-brand-gold underline underline-offset-4"
                      : "font-normal text-white/50 hover:text-white"
                  }`}
                  aria-current={locale === "en" ? "page" : undefined}
                  aria-label="English"
                  title="English"
                  onClick={() => setMobileOpen(false)}
                >
                  EN
                </Link>
                <Link
                  href={ruHref}
                  className={`px-2 py-1 rounded text-sm transition-colors ${
                    locale === "ru"
                      ? "font-bold text-brand-gold underline underline-offset-4"
                      : "font-normal text-white/50 hover:text-white"
                  }`}
                  aria-current={locale === "ru" ? "page" : undefined}
                  aria-label="Русский"
                  title="Русский"
                  onClick={() => setMobileOpen(false)}
                >
                  RU
                </Link>
              </nav>

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

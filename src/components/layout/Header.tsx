"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Globe, Phone, ChevronDown } from "lucide-react";

/** Service sub-links for the "Services" dropdown */
const serviceLinks = [
  { href: "/corporate-travel", key: "corporate" },
  { href: "/luxury-travel", key: "luxury" },
  { href: "/cruises", key: "cruises" },
  { href: "/visa-services", key: "visas" },
  { href: "/hotel-reservations", key: "hotels" },
  { href: "/services", key: "allServices" },
] as const;

/** Top-level nav items (excluding Services dropdown and FAQ) */
const topLevelLinks = [
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Cross-locale slug mapping for pages with different slugs per locale
  const crossLocaleSlugMap: Record<string, string> = {
    "/paphos-travel-agency": "/turisticheskoe-agentstvo-pafos",
    "/turisticheskoe-agentstvo-pafos": "/paphos-travel-agency",
    "/corporate-travel-cyprus": "/korporativnye-poezdki-kipr",
    "/korporativnye-poezdki-kipr": "/corporate-travel-cyprus",
    "/visa-services-cyprus": "/vizovye-uslugi-kipr",
    "/vizovye-uslugi-kipr": "/visa-services-cyprus",
    "/luxury-travel-cyprus": "/luxusnyy-otdykh-kipr",
    "/luxusnyy-otdykh-kipr": "/luxury-travel-cyprus",
    "/flight-tickets-cyprus": "/aviabilety-kipr",
    "/aviabilety-kipr": "/flight-tickets-cyprus",
    "/hotel-booking-cyprus": "/bronirovanie-otelej-kipr",
    "/bronirovanie-otelej-kipr": "/hotel-booking-cyprus",
  };

  // Build the same page path in the other locale
  const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, "") || "";
  const enPath = crossLocaleSlugMap[pathWithoutLocale] && locale === "ru" ? crossLocaleSlugMap[pathWithoutLocale] : pathWithoutLocale;
  const ruPath = crossLocaleSlugMap[pathWithoutLocale] && locale === "en" ? crossLocaleSlugMap[pathWithoutLocale] : pathWithoutLocale;
  const enHref = `/en${enPath}`;
  const ruHref = `/ru${ruPath}`;

  // Close mobile menu on route change (adjust state during render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setServicesOpen(false);
  }

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll detection: transparent on hero → solid background on scroll
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Desktop hover handlers with a small delay to prevent flicker
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setServicesOpen(true);
  };
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setServicesOpen(false), 150);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b-2 border-brand-gold transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || mobileOpen
          ? "bg-brand-navy shadow-lg"
          : "bg-brand-navy/70 backdrop-blur-md"
      }`}
    >
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
            {/* Services Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((prev) => !prev)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/80 hover:text-brand-gold transition-colors"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                {t("services")}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {servicesOpen && (
                <div className="absolute left-0 top-full mt-1 w-56 rounded-lg bg-brand-navy border border-white/10 shadow-xl py-2">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={`/${locale}${link.href}`}
                      className="block px-4 py-2.5 text-sm text-white/80 hover:text-brand-gold hover:bg-white/5 transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Top-level links: About, Blog, Contact */}
            {topLevelLinks.map((link) => (
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
              href={`/${locale}/quote`}
              className="rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              {t("getQuote")}
            </Link>
          </div>

          {/* Mobile: hamburger only (language switcher moved inside menu) */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
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
          <nav className="px-4 py-4 pb-16 sm:pb-24 space-y-1">
            {/* Home link */}
            <Link
              href={`/${locale}`}
              className="block px-3 py-3 text-base font-medium text-white/80 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors min-h-[44px] flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              {t("home")}
            </Link>

            {/* Services section with tap-to-expand */}
            <div>
              <button
                type="button"
                onClick={() => setServicesOpen((prev) => !prev)}
                className="flex items-center justify-between w-full px-3 py-3 text-base font-medium text-white/80 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors min-h-[44px]"
                aria-expanded={servicesOpen}
              >
                {t("services")}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {servicesOpen && (
                <div className="ml-4 border-l border-white/10 pl-3 space-y-0.5">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={`/${locale}${link.href}`}
                      className="block px-3 py-3 text-sm font-medium text-white/60 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors min-h-[44px] flex items-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(link.key)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Top-level links */}
            {topLevelLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="block px-3 py-3 text-base font-medium text-white/80 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors min-h-[44px] flex items-center"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}

            {/* Footer: single language switcher + Get a Quote CTA */}
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
              <nav aria-label="Language selection" className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-white/60" />
                <Link
                  href={enHref}
                  className={`px-2 py-2 rounded text-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
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
                  className={`px-2 py-2 rounded text-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
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
                href={`/${locale}/quote`}
                className="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy min-h-[44px] flex items-center"
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

"use client";

import { useState, useRef, useEffect, useMemo, type FocusEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Globe, Phone, ChevronDown } from "lucide-react";
import { resolveAlternateUrls } from "@/lib/i18n-route-resolver";
import { useCookieBannerOffset } from "@/hooks/useCookieBannerOffset";
import { MOBILE_MENU_EVENT } from "@/hooks/useMobileMenuOpen";

/** Service sub-links for the "Services" dropdown. Flights has a different
    slug per locale (see LOCALE_ALTERNATES in lib/canonical.ts). FAQ stays
    last: it is help, not a service. */
const serviceLinks = [
  { href: "/corporate-travel", key: "corporate" },
  { href: "/luxury-travel", key: "luxury" },
  { href: "/vip-services", key: "vip" },
  { href: { en: "/flight-tickets-cyprus", ru: "/aviabilety-kipr" }, key: "flights" },
  { href: "/cruises", key: "cruises" },
  { href: "/visa-services", key: "visas" },
  { href: "/hotel-reservations", key: "hotels" },
  { href: "/services", key: "allServices" },
  { href: "/faq", key: "faq" },
] as const;

function serviceHref(
  href: (typeof serviceLinks)[number]["href"],
  locale: string,
): string {
  const path = typeof href === "string" ? href : locale === "ru" ? href.ru : href.en;
  return `/${locale}${path}`;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Top-level nav items (excluding Services dropdown and FAQ) */
const topLevelLinks = [
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export default function HeaderClient() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  // Height of the cookie banner while it is showing (0 otherwise): the open
  // mobile menu ends above it so no item can sit hidden behind it.
  const cookieBannerOffset = useCookieBannerOffset();

  // The language-switcher URLs are resolved from the canonical alternates
  // map (LOCALE_ALTERNATES + the checked-in blog slug-pair map), so they're
  // always no-slash canonical and `null` if no counterpart exists. Resolution
  // is client-safe and runs off usePathname() — the previous server-side
  // `headers()` read forced the whole site into per-request SSR.
  // See `lib/i18n-route-resolver.ts`.
  const alternates = useMemo(() => resolveAlternateUrls(pathname), [pathname]);
  const enHref = alternates.en;
  const ruHref = alternates.ru;

  // The Private & Family Office page bans quote CTAs and allows exactly two
  // CTA styles (PRIVATE_OFFICE_PAGE_SPEC §2.4, §9) — on it, the header CTA
  // becomes the page's own primary action instead of "Get a Quote".
  const onPrivatePage = pathname.endsWith("/private");
  const ctaHref = onPrivatePage ? "#introduction" : `/${locale}/quote`;
  const ctaLabel = onPrivatePage ? t("requestIntroduction") : t("getQuote");

  // Close mobile menu on route change (adjust state during render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setServicesOpen(false);
  }

  // Close desktop dropdown when clicking outside
  // Skip when mobile menu is open — mobile has its own toggle and this
  // handler would unmount service links before the click event fires.
  useEffect(() => {
    if (mobileOpen) return;

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
  }, [mobileOpen]);

  // Escape closes the open menu and returns focus to the button that opened
  // it. Tab is kept inside the open mobile menu (its toggle included).
  useEffect(() => {
    if (!mobileOpen && !servicesOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (mobileOpen) {
          setMobileOpen(false);
          setServicesOpen(false);
          mobileToggleRef.current?.focus();
        } else {
          const focusWasInside = dropdownRef.current?.contains(document.activeElement);
          setServicesOpen(false);
          if (focusWasInside) servicesButtonRef.current?.focus();
        }
        return;
      }

      if (e.key !== "Tab" || !mobileOpen) return;
      const toggle = mobileToggleRef.current;
      const panel = mobileMenuRef.current;
      if (!toggle || !panel) return;
      const focusables = [
        toggle,
        ...panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !focusables.includes(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, servicesOpen]);

  // Tell the mobile Call/WhatsApp bar to step aside while the menu is open.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(MOBILE_MENU_EVENT, { detail: { open: mobileOpen } }),
    );
  }, [mobileOpen]);

  // Desktop dropdown: close when keyboard focus moves out of it.
  const handleDropdownBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setServicesOpen(false);
    }
  };

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
  // When a mouse user hovers the button and then clicks it, the hover has
  // already opened the menu; a plain toggle would close it again. A click
  // that follows a hover-open within a moment keeps the menu open.
  const hoverOpenedAtRef = useRef(0);
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    hoverOpenedAtRef.current = Date.now();
    setServicesOpen(true);
  };
  const handleServicesClick = () => {
    if (Date.now() - hoverOpenedAtRef.current < 800) {
      setServicesOpen(true);
      return;
    }
    setServicesOpen((prev) => !prev);
  };
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setServicesOpen(false), 150);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b-2 border-brand-gold transition-shadow duration-300 ${
        scrolled || mobileOpen
          ? "bg-brand-navy shadow-lg"
          : "bg-brand-navy"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Image
              src="/images/jetset-logo.png"
              alt={tCommon("logoAlt")}
              // 600×180 raster served through next/image (AVIF/WebP, resized). The old
              // SVG was a 207 KB wrapper around a base64 PNG, preloaded on every page (F-13).
              width={133}
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
              onBlur={handleDropdownBlur}
            >
              <button
                ref={servicesButtonRef}
                type="button"
                onClick={handleServicesClick}
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
                      key={link.key}
                      href={serviceHref(link.href, locale)}
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

            {/* Private Clients — last position before the CTA, same nav
                style with no highlight (PRIVATE_OFFICE_PAGE_SPEC §1.2). The
                former white/60 made it look disabled. */}
            <Link
              href={`/${locale}/private`}
              className="px-3 py-2 text-sm font-medium text-white/80 hover:text-brand-gold transition-colors"
            >
              {t("privateClients")}
            </Link>
          </nav>

          {/* Right side: phone + language toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+35799478073"
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-brand-gold transition-colors"
              title="Call JetSet Travel"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span>+357 99 478 073</span>
            </a>
            <span className="text-white/20">|</span>
            <nav aria-label="Language selection" className="flex items-center gap-1 text-sm">
              <Globe className="h-4 w-4 text-white/60" />
              {enHref && (
                <Link
                  href={enHref}
                  hrefLang="en"
                  className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                    locale === "en"
                      ? "font-bold text-brand-gold underline underline-offset-4"
                      : "font-normal text-white/70 hover:text-white"
                  }`}
                  aria-current={locale === "en" ? "page" : undefined}
                  aria-label="EN – English"
                  title="English"
                >
                  EN
                </Link>
              )}
              {enHref && ruHref && <span className="text-white/30">|</span>}
              {ruHref && (
                <Link
                  href={ruHref}
                  hrefLang="ru"
                  className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                    locale === "ru"
                      ? "font-bold text-brand-gold underline underline-offset-4"
                      : "font-normal text-white/70 hover:text-white"
                  }`}
                  aria-current={locale === "ru" ? "page" : undefined}
                  aria-label="RU – Русский"
                  title="Русский"
                >
                  RU
                </Link>
              )}
            </nav>

            <Link
              href={ctaHref}
              className="rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile: hamburger only (language switcher moved inside menu) */}
          <div className="md:hidden flex items-center gap-2">
            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
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
      {/* Scrolls on its own and ends above the cookie banner (the Call /
          WhatsApp bar is hidden while it is open), so every item can be
          reached and no focused item is covered. */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-navigation"
          className="md:hidden overflow-y-auto overscroll-contain border-t border-white/10 bg-brand-navy"
          style={{ maxHeight: `calc(100dvh - 4rem - 2px - ${cookieBannerOffset}px)` }}
        >
          <nav className="px-4 py-4 space-y-1">
            {/* Home link */}
            <Link
              href={`/${locale}`}
              className="flex items-center px-3 py-3 text-base font-medium text-white/80 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors min-h-[44px]"
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
                      key={link.key}
                      href={serviceHref(link.href, locale)}
                      className="flex items-center px-3 py-3 text-sm font-medium text-white/60 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors min-h-[44px]"
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
                className="flex items-center px-3 py-3 text-base font-medium text-white/80 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors min-h-[44px]"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}

            {/* Private Clients — last position before the CTA, same nav
                style with no highlight (PRIVATE_OFFICE_PAGE_SPEC §1.2) */}
            <Link
              href={`/${locale}/private`}
              className="flex items-center px-3 py-3 text-base font-medium text-white/80 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors min-h-[44px]"
              onClick={() => setMobileOpen(false)}
            >
              {t("privateClients")}
            </Link>

            {/* Footer: single language switcher + Get a Quote CTA */}
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
              <nav aria-label="Language selection" className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-white/60" />
                {enHref && (
                  <Link
                    href={enHref}
                    hrefLang="en"
                    className={`px-2 py-2 rounded text-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      locale === "en"
                        ? "font-bold text-brand-gold underline underline-offset-4"
                        : "font-normal text-white/70 hover:text-white"
                    }`}
                    aria-current={locale === "en" ? "page" : undefined}
                    aria-label="English"
                    title="English"
                    onClick={() => setMobileOpen(false)}
                  >
                    EN
                  </Link>
                )}
                {ruHref && (
                  <Link
                    href={ruHref}
                    hrefLang="ru"
                    className={`px-2 py-2 rounded text-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      locale === "ru"
                        ? "font-bold text-brand-gold underline underline-offset-4"
                        : "font-normal text-white/70 hover:text-white"
                    }`}
                    aria-current={locale === "ru" ? "page" : undefined}
                    aria-label="Русский"
                    title="Русский"
                    onClick={() => setMobileOpen(false)}
                  >
                    RU
                  </Link>
                )}
              </nav>

              <Link
                href={ctaHref}
                className="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy min-h-[44px] flex items-center"
                onClick={() => setMobileOpen(false)}
              >
                {ctaLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const tCookies = useTranslations("cookies");

  const quickLinks = [
    { href: `/${locale}/about`, label: t("aboutUs") },
    { href: `/${locale}/services`, label: t("ourServices") },
    { href: `/${locale}/corporate-travel`, label: t("corporateTravel") },
    { href: `/${locale}/faq`, label: t("faq") },
    { href: `/${locale}/blog`, label: t("blog") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  const paphosSlug =
    locale === "ru" ? "turisticheskoe-agentstvo-pafos" : "paphos-travel-agency";
  const flightsSlug =
    locale === "ru" ? "aviabilety-kipr" : "flight-tickets-cyprus";

  const serviceLinks = [
    { href: `/${locale}/${flightsSlug}`, label: t("flightBooking") },
    { href: `/${locale}/hotel-reservations`, label: t("hotelReservations") },
    { href: `/${locale}/cruises`, label: t("cruises") },
    { href: `/${locale}/visa-services`, label: t("visaAssistance") },
    { href: `/${locale}/luxury-travel`, label: t("luxuryTravel") },
    { href: `/${locale}/private`, label: t("privateClients") },
    { href: `/${locale}/${paphosSlug}`, label: t("travelAgencyPaphos") },
  ];
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {/* Col 1: Logo + Tagline + Accreditation */}
          <div className="space-y-4">
            <Link href={`/${locale}`}>
              <Image
                src="/images/jetset-logo.svg"
                alt={tCommon("logoAlt")}
                width={140}
                height={40}
                className="h-10 w-auto"
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">
              {t("tagline")}
            </p>
            <div className="text-xs text-white/50 space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/iata-logo.png"
                  alt={tCommon("iataAlt")}
                  width={52}
                  height={52}
                  className="h-[52px] w-[52px] rounded-lg object-contain bg-white p-1"
                  loading="lazy"
                />
                <p>{t("iataAccredited")}</p>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/tourism-logo.png"
                  alt={tCommon("ctoAlt")}
                  width={52}
                  height={52}
                  className="h-[52px] w-[52px] rounded-lg object-contain bg-white p-1"
                  loading="lazy"
                />
                <p>{t("cyprusTourism")}</p>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">
              {t("services")}
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">
              {t("contactUs")}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a
                  href="tel:+35799478073"
                  className="hover:text-brand-gold transition-colors"
                >
                  +357 99 478 073
                </a>
                {" / "}
                <a
                  href="tel:+35799310993"
                  className="hover:text-brand-gold transition-colors"
                >
                  +357 99 310 993
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@jetset.com.cy"
                  className="hover:text-brand-gold transition-colors"
                >
                  info@jetset.com.cy
                </a>
              </li>
              <li className="leading-relaxed">
                <span>{t("location")}</span>{" "}
                <a
                  href="https://maps.app.goo.gl/nA8De9MqgLmUphZ49"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors underline"
                >
                  {t("viewMap")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Company legal info */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 text-center">
          <p className="text-xs text-white/50">
            {t("companyLegal")}
          </p>
        </div>
      </div>

      {/* Bottom bar: copyright + social icons */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50">
            <p>
              &copy; {new Date().getFullYear()} {t("copyright")}
            </p>
            <span className="hidden sm:inline" aria-hidden="true">|</span>
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-brand-gold transition-colors"
            >
              {t("privacyPolicy")}
            </Link>
            <span className="hidden sm:inline" aria-hidden="true">|</span>
            <Link
              href={`/${locale}/terms`}
              className="hover:text-brand-gold transition-colors"
            >
              {t("termsOfService")}
            </Link>
            <span className="hidden sm:inline" aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("open-cookie-settings"))
              }
              className="hover:text-brand-gold transition-colors"
            >
              {tCookies("reopenSettings")}
            </button>
          </div>
          <div className="flex items-center gap-1">
            <a
              href="https://www.facebook.com/JETSETCYPRUS/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2"
            >
              <Image
                src="/images/icons/facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
                className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </a>
            <a
              href="https://www.instagram.com/jetsetcyprus"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2"
            >
              <Image
                src="/images/icons/instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
                className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/jetsetcyprus"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on LinkedIn"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2"
            >
              <Image
                src="/images/icons/linkedin.svg"
                alt="LinkedIn"
                width={20}
                height={20}
                className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </a>
            <a
              href={`https://wa.me/35799478073?text=${locale === "ru" ? encodeURIComponent("Здравствуйте JetSet, мне нужна помощь с...") : encodeURIComponent("Hi JetSet, I'd like help with...")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2"
            >
              <Image
                src="/images/icons/whatsapp.svg"
                alt="WhatsApp"
                width={20}
                height={20}
                className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </a>
            <a
              href="https://t.me/jetsetnotis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on Telegram"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2"
            >
              <Image
                src="/images/icons/telegram.svg"
                alt="Telegram"
                width={20}
                height={20}
                className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </a>
            <a
              href="viber://chat?number=35799478073"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on Viber"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2"
            >
              <Image
                src="/images/icons/viber.svg"
                alt="Viber"
                width={20}
                height={20}
                className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

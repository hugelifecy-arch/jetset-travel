"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

export default function Footer() {
  const locale = useLocale();

  const quickLinks = [
    { href: `/${locale}/about`, label: "About Us" },
    { href: `/${locale}/hotel-reservations`, label: "Our Services" },
    { href: `/${locale}/corporate-travel`, label: "Corporate Travel" },
    { href: `/${locale}/contact`, label: "Contact" },
  ];

  const serviceLinks = [
    { href: `/${locale}/contact`, label: "Flight Booking" },
    { href: `/${locale}/hotel-reservations`, label: "Hotel Reservations" },
    { href: `/${locale}/visa-services`, label: "Visa Assistance" },
    { href: `/${locale}/luxury-travel`, label: "Luxury Travel" },
  ];
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Logo + Tagline + Accreditation */}
          <div className="space-y-4">
            <Image
              src="/images/jetset-logo.svg"
              alt="JetSet Travel Cyprus"
              width={140}
              height={40}
              className="h-10 w-auto brightness-0 invert"
              loading="lazy"
            />
            <p className="text-sm text-white/70 leading-relaxed">
              Your trusted travel partner in Cyprus. Premium travel services for
              corporate and leisure clients since 2006.
            </p>
            <div className="text-xs text-white/50 space-y-1">
              <p>IATA Accredited Agent</p>
              <p>Cyprus Tourism Organisation Licensed</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">
              Quick Links
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
              Services
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
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a
                  href="tel:+35799478073"
                  className="hover:text-brand-gold transition-colors"
                >
                  +357 99 478 073 / +357 99 310 993
                </a>
              </li>
              <li>
                <a
                  href="mailto:INFO@JETSET.COM.CY"
                  className="hover:text-brand-gold transition-colors"
                >
                  INFO@JETSET.COM.CY
                </a>
              </li>
              <li className="leading-relaxed">26A Agapinoros, 8049 Paphos, Cyprus</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar: copyright + social icons */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-white/50">
            <p>
              &copy; {new Date().getFullYear()} JetSet Travel Cyprus. All rights
              reserved.
            </p>
            <span className="hidden sm:inline" aria-hidden="true">|</span>
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-brand-gold transition-colors"
            >
              {locale === "ru" ? "Политика конфиденциальности" : "Privacy Policy"}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/35799478073"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
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
              aria-label="Telegram"
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
              aria-label="Viber"
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

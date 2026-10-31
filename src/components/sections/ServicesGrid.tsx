import Image from "next/image";
import Link from "next/link";
import {
  Plane,
  Briefcase,
  Palmtree,
  FileCheck,
  Building2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const serviceItems = [
  {
    icon: Plane,
    titleKey: "flights",
    href: { en: "/flight-tickets-cyprus", ru: "/aviabilety-kipr" },
    image: "/images/services/flights.jpg",
  },
  {
    icon: Building2,
    titleKey: "hotels",
    href: { en: "/hotel-reservations", ru: "/hotel-reservations" },
    image: "/images/services/hotels.jpg",
  },
  {
    icon: FileCheck,
    titleKey: "visa",
    href: { en: "/visa-services", ru: "/visa-services" },
    image: "/images/services/visa.jpg",
  },
  {
    icon: Palmtree,
    titleKey: "luxury",
    href: { en: "/luxury-travel", ru: "/luxury-travel" },
    image: "/images/services/luxury.jpg",
  },
  {
    icon: Briefcase,
    titleKey: "corporate",
    href: { en: "/corporate-travel", ru: "/corporate-travel" },
    image: "/images/services/corporate.jpg",
  },
] as const;

export default function ServicesGrid() {
  const locale = useLocale();
  const t = useTranslations("services");

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-navy/70">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {serviceItems.map((service) => (
            <div
              key={service.titleKey}
             className="reveal-up">
              <Link
                href={`/${locale}${service.href[locale as "en" | "ru"] ?? service.href.en}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-navy/10 bg-brand-light/40 shadow-card transition-all hover:-translate-y-1 hover:shadow-luxury"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={t(`${service.titleKey}.imageAlt`)}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 shadow-sm">
                    <service.icon className="h-5 w-5 text-brand-gold" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold text-brand-navy">
                    {t(`${service.titleKey}.title`)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-navy/70">
                    {t(`${service.titleKey}.description`)}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-brand-gold-ink group-hover:underline">
                    {t(`${service.titleKey}.cta`)} &rarr;
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Labour & VFR fares (Oct 2026 campaign): text links, so the
            five-card grid above keeps its layout. */}
        <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm leading-relaxed text-brand-navy/80 sm:text-base">
            {t("labourStrip")}
          </p>
          <div className="flex flex-shrink-0 flex-wrap gap-x-5 gap-y-2">
            <Link
              href={`/${locale}/labour-vfr-flights-cyprus`}
              className="text-sm font-semibold text-brand-gold-ink hover:underline"
            >
              {t("labourVfr.cta")} &rarr;
            </Link>
            <Link
              href={`/${locale}/seasonal-staff-travel-cyprus`}
              className="text-sm font-semibold text-brand-gold-ink hover:underline"
            >
              {t("seasonalStaff.cta")} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

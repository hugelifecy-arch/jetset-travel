"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Plane,
  Briefcase,
  Palmtree,
  FileCheck,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

const serviceItems = [
  {
    icon: Plane,
    titleKey: "flights",
    href: "/corporate-travel",
    image: "/images/services/flights.jpg",
    imageAlt: "Flight booking service - JetSet Travel Paphos Cyprus",
  },
  {
    icon: Building2,
    titleKey: "hotels",
    href: "/hotel-reservations",
    image: "/images/services/hotels.jpg",
    imageAlt: "Hotel reservation service - luxury and business hotels worldwide",
  },
  {
    icon: FileCheck,
    titleKey: "visa",
    href: "/visa-services",
    image: "/images/services/visa.jpg",
    imageAlt: "Visa services and application assistance in Paphos Cyprus",
  },
  {
    icon: Palmtree,
    titleKey: "luxury",
    href: "/luxury-travel",
    image: "/images/services/luxury.jpg",
    imageAlt: "Luxury travel planning - premium holidays from Cyprus",
  },
  {
    icon: Briefcase,
    titleKey: "corporate",
    href: "/corporate-travel",
    image: "/images/services/corporate.jpg",
    imageAlt: "Corporate travel management for Cyprus businesses",
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

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {serviceItems.map((service, i) => (
            <motion.div
              key={service.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/${locale}${service.href}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-navy/10 bg-brand-light/40 shadow-card transition-all hover:-translate-y-1 hover:shadow-luxury"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
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
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-navy/65">
                    {t(`${service.titleKey}.description`)}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-brand-gold group-hover:underline">
                    {t("learnMore")} &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

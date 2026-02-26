"use client";

import Link from "next/link";
import { Briefcase, Palmtree, FileCheck, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

const serviceItems = [
  { icon: Briefcase, titleKey: "corporate", href: "/corporate-travel" },
  { icon: Palmtree, titleKey: "luxury", href: "/luxury-travel" },
  { icon: FileCheck, titleKey: "visa", href: "/visa-services" },
  { icon: Building2, titleKey: "hotels", href: "/hotel-reservations" },
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

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                className="group flex h-full flex-col rounded-2xl border border-brand-navy/10 bg-brand-light/40 p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-luxury"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/15">
                  <service.icon className="h-6 w-6 text-brand-gold" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-brand-navy">
                  {t(`${service.titleKey}.title`)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-navy/65">
                  {t(`${service.titleKey}.description`)}
                </p>
                <span className="mt-4 text-sm font-semibold text-brand-gold group-hover:underline">
                  {t("learnMore")} &rarr;
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

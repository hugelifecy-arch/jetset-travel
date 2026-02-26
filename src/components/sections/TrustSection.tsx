"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TrustSection() {
  const t = useTranslations("trust");

  const bulletKeys = ["bullet1", "bullet2", "bullet3"] as const;

  const stats = [
    { valueKey: "statClientsValue", labelKey: "statClients" },
    { valueKey: "statExperienceValue", labelKey: "statExperience" },
    { valueKey: "statSupportValue", labelKey: "statSupport" },
    { valueKey: "statSatisfactionValue", labelKey: "statSatisfaction", contextKey: "statSatisfactionContext" },
  ] as const;

  return (
    <section className="bg-brand-light py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Why corporates choose us */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-brand-navy/70">
              {t("subtitle")}
            </p>

            <ul className="mt-8 space-y-5">
              {bulletKeys.map((key) => (
                <li key={key} className="flex gap-4">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-none text-brand-gold" />
                  <span className="text-base leading-relaxed text-brand-navy/80">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Trust badge images */}
            <div className="mt-8 flex items-center gap-6">
              <Image
                src="/images/iata-logo.jpg"
                alt="IATA Accredited Travel Agent"
                width={80}
                height={80}
                className="h-16 w-auto rounded object-contain"
              />
              <Image
                src="/images/tourism-logo.jpg"
                alt="Cyprus Tourism Organisation Licensed"
                width={80}
                height={80}
                className="h-16 w-auto rounded object-contain"
              />
            </div>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {stats.map((stat) => (
              <div
                key={stat.labelKey}
                className="rounded-2xl border border-brand-navy/10 bg-white p-6 text-center shadow-card"
              >
                <p className="font-display text-4xl font-bold text-brand-gold">
                  {t(stat.valueKey)}
                </p>
                <p className="mt-2 text-sm font-medium text-brand-navy/70">
                  {t(stat.labelKey)}
                </p>
                {"contextKey" in stat && stat.contextKey && (
                  <p className="mt-1 text-xs text-brand-navy/40">
                    {t(stat.contextKey)}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

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
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 lg:items-center">
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

          </motion.div>

          {/* Right: Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4 sm:gap-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {stats.map((stat) => (
              <div
                key={stat.labelKey}
                className="rounded-2xl border border-brand-navy/10 bg-white p-4 sm:p-6 text-center shadow-card"
              >
                <p className="font-display text-3xl font-bold text-brand-gold sm:text-4xl">
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

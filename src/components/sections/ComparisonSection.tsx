"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function ComparisonSection() {
  const locale = useLocale();
  const t = useTranslations("comparison");

  const diyItems = [
    t("diy1"),
    t("diy2"),
    t("diy3"),
    t("diy4"),
    t("diy5"),
  ];

  const jetsetItems = [
    t("jetset1"),
    t("jetset2"),
    t("jetset3"),
    t("jetset4"),
    t("jetset5"),
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            className="font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-lg text-brand-navy/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {/* DIY Column */}
          <motion.div
            className="rounded-2xl border border-red-200 bg-red-50/50 p-5 sm:p-6 md:p-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-display text-xl font-bold text-brand-navy">
              {t("diyTitle")}
            </h3>
            <ul className="mt-6 space-y-4">
              {diyItems.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-brand-navy/70">
                  <span className="shrink-0 text-red-500" aria-hidden="true">&#10060;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* JetSet Column */}
          <motion.div
            className="rounded-2xl border border-green-200 bg-green-50/50 p-5 sm:p-6 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-display text-xl font-bold text-brand-navy">
              {t("jetsetTitle")}
            </h3>
            <ul className="mt-6 space-y-4">
              {jetsetItems.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-brand-navy/80">
                  <span className="shrink-0 text-green-600" aria-hidden="true">&#9989;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-lg font-semibold text-brand-navy">
            {t("ctaText")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3 text-base font-semibold text-brand-navy shadow-luxury transition-opacity hover:opacity-90"
          >
            {t("ctaButton")} &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

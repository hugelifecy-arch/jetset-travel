"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import CTALeadForm from "@/components/forms/CTALeadForm";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "35799478073";

export default function CTABanner() {
  const locale = useLocale();
  const t = useTranslations("cta");

  return (
    <section className="bg-brand-navy py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            {t("subtitle")}
          </p>

          <div className="mt-10">
            <CTALeadForm />
          </div>

          <div className="mt-8 text-sm text-white/50">
            <p>{t("orContactDirectly")}</p>
            <div className="mt-2 flex items-center justify-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${locale === "ru" ? encodeURIComponent("Здравствуйте, JetSet! Мне нужна помощь с организацией поездки.") : encodeURIComponent("Hi JetSet, I need help")}`}
                className="text-white/70 underline transition-colors hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <span className="text-white/30">|</span>
              <a
                href="tel:+35799478073"
                className="text-white/70 underline transition-colors hover:text-white"
              >
                +357 99 478 073
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

export default function CTABanner() {
  const locale = useLocale();
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
            Ready to simplify your corporate travel?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Send us your route, dates, and budget — we&apos;ll reply with the
            best options and clear rules.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/${locale}/quote`}
              className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-4 text-base font-semibold text-brand-navy shadow-luxury transition-opacity hover:opacity-90"
            >
              Request a Quote
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

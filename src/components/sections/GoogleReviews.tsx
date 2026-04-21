"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const reviewKeys = ["review1", "review2", "review3"] as const;

export default function GoogleReviews() {
  const t = useTranslations("reviews");

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

        {/* Native testimonial cards */}
        <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {reviewKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col rounded-2xl border border-brand-navy/10 bg-brand-light/40 p-6 shadow-card"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-brand-gold text-brand-gold"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-navy/80">
                &ldquo;{t(`${key}.text`)}&rdquo;
              </blockquote>
              <div className="mt-5 flex items-center gap-3 border-t border-brand-navy/10 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                  {t(`${key}.name`).charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">
                    {t(`${key}.name`)}
                  </p>
                  <p className="text-xs text-brand-navy/60">
                    {t(`${key}.role`)} — {t(`${key}.company`)}
                  </p>
                </div>
                <svg
                  className="ml-auto h-4 w-4"
                  viewBox="0 0 24 24"
                  aria-label="Google"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* "View all reviews" link */}
        <div className="mt-8 text-center">
          <a
            href="https://www.google.com/search?q=JetSet+Travel+Agency+-+Paphos#lrd=0x14e706ec2d62587f:0x4161901d9b64e1b4,1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold/80"
          >
            {t("viewAllReviews")} &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

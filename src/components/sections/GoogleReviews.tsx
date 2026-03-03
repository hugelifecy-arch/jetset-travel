"use client";

import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=JETSET%20TRAVEL%20AGENCY%20Paphos";

const reviews = [
  {
    key: "review1",
    name: "Maria K.",
    company: "Technology Firm, Limassol",
    avatarInitials: "MK",
    rating: 5,
    date: "2025-09",
  },
  {
    key: "review2",
    name: "Andreas P.",
    company: "Private Client",
    avatarInitials: "AP",
    rating: 5,
    date: "2025-06",
  },
  {
    key: "review3",
    name: "Dmitry S.",
    company: "Import/Export SME, Paphos",
    avatarInitials: "DS",
    rating: 5,
    date: "2025-03",
  },
];

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating
              ? "fill-brand-gold text-brand-gold"
              : "fill-transparent text-brand-navy/20"
          }`}
        />
      ))}
    </div>
  );
}

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

        {/* Review cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.figure
              key={review.key}
              className="flex flex-col rounded-2xl border border-brand-navy/10 bg-brand-light/40 p-6 shadow-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <StarRating rating={review.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-navy/80">
                &ldquo;{t(`${review.key}.text`)}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-brand-navy/10 pt-4">
                <div className="flex items-center gap-3">
                  {/* Avatar with initials */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white">
                    {review.avatarInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">
                      {review.name}
                    </p>
                    {review.company && (
                      <p className="text-xs text-brand-navy/50">
                        {review.company}
                      </p>
                    )}
                    <p className="text-xs text-brand-navy/60">
                      {t(`${review.key}.role`)}
                    </p>
                  </div>
                </div>
                {/* Star rating line with Google link */}
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-brand-gold text-sm" aria-hidden="true">
                    ★★★★★
                  </span>
                  <span className="text-xs text-brand-navy/60">
                    {review.rating}/5 {t("via")}{" "}
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-brand-navy transition-colors"
                    >
                      Google Reviews
                    </a>
                  </span>
                </div>
                {review.date && (
                  <p className="mt-1 text-xs text-brand-navy/30">
                    {t("posted")} {review.date}
                  </p>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-navy/20 bg-white px-6 py-3 text-sm font-semibold text-brand-navy shadow-sm transition-colors hover:bg-brand-navy hover:text-white"
          >
            {t("viewAllReviews")}
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-navy/60 underline underline-offset-2 transition-colors hover:text-brand-navy"
          >
            {t("readMoreOnGoogle")}
          </a>
        </div>
      </div>
    </section>
  );
}

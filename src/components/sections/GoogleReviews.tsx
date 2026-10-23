import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { REVIEW_AGGREGATE } from "@/lib/seo";

// Quote cards were removed: the earlier homepage quotes could not be traced
// to published Google reviews (see audit note in app/[locale]/page.tsx).
// Only the verifiable aggregate is shown, with a link to the reviews
// themselves. Re-add quotes only when copied verbatim from Google with the
// reviewer's name as shown there.
export default function GoogleReviews() {
  const t = useTranslations("reviews");

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-navy/70">
          {t("subtitle")}
        </p>

        {/* The aggregate the TravelAgency schema claims, shown on-page so
            the markup matches visible content (single source of truth:
            REVIEW_AGGREGATE in lib/seo.ts). */}
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-brand-navy/10 bg-brand-light/40 px-6 py-8 shadow-card">
          <div className="flex items-center justify-center gap-1" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="h-5 w-5 fill-brand-gold text-brand-gold" />
            ))}
          </div>
          <p className="mt-3 text-base font-semibold text-brand-navy">
            {t("aggregateLine", {
              rating: REVIEW_AGGREGATE.ratingValue,
              count: REVIEW_AGGREGATE.reviewCount,
            })}
          </p>
          <a
            href="https://www.google.com/search?q=JetSet+Travel+Agency+-+Paphos#lrd=0x14e706ec2d62587f:0x4161901d9b64e1b4,1"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold-ink transition-colors hover:text-brand-navy"
          >
            {t("viewAllReviews")} &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

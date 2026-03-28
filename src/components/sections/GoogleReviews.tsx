"use client";

import Script from "next/script";
import { useTranslations } from "next-intl";

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

        {/* Elfsight Google Reviews Widget */}
        <div className="mt-10 sm:mt-14">
          <Script
            src="https://static.elfsight.com/platform/platform.js"
            strategy="lazyOnload"
          />
          <div
            className="elfsight-app-37063581-926c-4328-b8f6-9ed56f0648ac"
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { Scale, Landmark, HeartPulse, Monitor, Building } from "lucide-react";
import { useTranslations } from "next-intl";

const industryIcons = [
  { icon: Scale, key: "law" },
  { icon: Landmark, key: "finance" },
  { icon: HeartPulse, key: "healthcare" },
  { icon: Monitor, key: "technology" },
  { icon: Building, key: "realEstate" },
] as const;

export default function ClientLogos() {
  const t = useTranslations("clients");

  return (
    <section className="border-y border-brand-navy/10 bg-brand-light/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-navy/50">
          {t("trustedBy")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {industryIcons.map((industry) => (
            <div
              key={industry.key}
              className="flex flex-col items-center gap-2 text-brand-navy/40"
            >
              <industry.icon className="h-8 w-8" strokeWidth={1.5} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t(industry.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

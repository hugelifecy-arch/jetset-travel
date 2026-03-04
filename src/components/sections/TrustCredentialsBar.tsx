"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Clock, Users, HeartHandshake, Award } from "lucide-react";

export default function TrustCredentialsBar() {
  const t = useTranslations("credentialsBar");

  return (
    <section className="bg-brand-light/60 border-y border-brand-navy/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10 lg:gap-x-14">
          {/* IATA Badge */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/iata-logo.jpg"
              alt="IATA"
              width={72}
              height={72}
              className="h-16 w-16 rounded-lg object-contain sm:h-[72px] sm:w-[72px]"
            />
            <span className="text-sm font-medium text-brand-navy/80">
              {t("iataAccredited")}
            </span>
          </div>

          {/* Cyprus Tourism Badge */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/tourism-logo.jpg"
              alt="Cyprus Tourism Organisation"
              width={72}
              height={72}
              className="h-16 w-16 rounded-lg object-contain sm:h-[72px] sm:w-[72px]"
            />
            <span className="text-sm font-medium text-brand-navy/80">
              {t("cyprusTourism")}
            </span>
          </div>

          {/* Divider - hidden on mobile */}
          <div className="hidden lg:block h-10 w-px bg-brand-navy/10" aria-hidden="true" />

          {/* 20+ Years Experience */}
          <div className="flex items-center gap-2.5">
            <Award className="h-6 w-6 flex-none text-brand-gold" />
            <span className="text-sm font-medium text-brand-navy/80">
              {t("experience")}
            </span>
          </div>

          {/* 520+ Corporate Clients */}
          <div className="flex items-center gap-2.5">
            <Users className="h-6 w-6 flex-none text-brand-gold" />
            <span className="text-sm font-medium text-brand-navy/80">
              {t("clients")}
            </span>
          </div>

          {/* 24/7 Support */}
          <div className="flex items-center gap-2.5">
            <Clock className="h-6 w-6 flex-none text-brand-gold" />
            <span className="text-sm font-medium text-brand-navy/80">
              {t("support")}
            </span>
          </div>

          {/* 98% Satisfaction */}
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="h-6 w-6 flex-none text-brand-gold" />
            <span className="text-sm font-medium text-brand-navy/80">
              {t("satisfaction")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

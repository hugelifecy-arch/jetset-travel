import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle,
  Info,
  Luggage,
  MapPin,
  PlaneLanding,
  PlaneTakeoff,
  RefreshCw,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buildPageMetadata, CANONICAL_ORIGIN } from "@/lib/seo";
import {
  LABOUR_VFR_DESTINATIONS,
  LABOUR_VFR_LAST_UPDATED,
  LABOUR_VFR_PATH,
  SEASONAL_STAFF_PATH,
  labourVfrWhatsAppHref,
} from "@/lib/labour-vfr";
import ServiceSchema from "@/components/seo/ServiceSchema";
import FAQSection from "@/components/sections/FAQSection";
import RelatedArticles from "@/components/sections/RelatedArticles";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import WhatsAppCtaLink from "@/components/ui/WhatsAppCtaLink";

/*
 * Labour & VFR flights from Cyprus (Oct 2026 campaign). Main permanent
 * landing page for people working in Cyprus who travel home to Manila,
 * Kathmandu, Dhaka and Delhi, and for their employers.
 *
 * Copy rules (owner brief): the agency's commercial access to special fares
 * with Qatar Airways, Emirates and Gulf Air is owner-confirmed; everything
 * else is limited to what airlines publish. No prices, no guaranteed
 * discounts, no baggage allowances, no eligibility promises — each fare's
 * conditions are checked per booking. Enquiries are WhatsApp-only.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "labourVfrPage" });
  return buildPageMetadata({
    locale,
    routePath: LABOUR_VFR_PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords:
      locale === "ru"
        ? [
            "трудовые тарифы Кипр",
            "тарифы VFR Кипр",
            "авиабилеты Кипр Манила",
            "авиабилеты Кипр Катманду",
            "авиабилеты Кипр Дакка",
            "авиабилеты Кипр Дели",
            "специальные тарифы Qatar Airways Emirates Gulf Air",
          ]
        : [
            "labour fares Cyprus to Manila",
            "VFR flights Cyprus Philippines",
            "labour fares Cyprus to Kathmandu",
            "VFR fares Cyprus Nepal",
            "labour fares Cyprus to Dhaka",
            "VFR fares Cyprus Bangladesh",
            "labour fares Cyprus to Delhi",
            "VFR flights Cyprus India",
          ],
  });
}

const FARE_TYPES = ["labour", "vfr", "ethnic", "published", "promo", "private"] as const;
const QUALIFY = [1, 2, 3, 4, 5] as const;
const AIRLINES = ["qatar", "emirates", "gulfair"] as const;
const RETURN_POINTS = [1, 2, 3, 4] as const;
const CHECKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const STEPS = [1, 2, 3, 4] as const;
const FAQS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const WHY: ReadonlyArray<{ key: string; icon: LucideIcon }> = [
  { key: "why1", icon: BadgeCheck },
  { key: "why2", icon: MapPin },
  { key: "why3", icon: RefreshCw },
  { key: "why4", icon: Users },
];

export default async function LabourVfrFlightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "labourVfrPage" });
  const lang = locale === "ru" ? "ru" : "en";
  const newTabHint = t("newTabHint");

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gold">
              {t("heroLabel")}
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/85" data-speakable>
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppCtaLink
                href={labourVfrWhatsAppHref(null, locale)}
                newTabHint={newTabHint}
                trackRegion="labour_vfr_hero"
              >
                {t("heroCta")}
              </WhatsAppCtaLink>
              <a
                href="#destinations"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t("heroSecondary")}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-6 text-sm text-white/70">{t("heroNote")}</p>
          </div>
        </div>
      </section>

      {/* Destination quick links */}
      <nav aria-label={t("destNavLabel")} className="border-b border-brand-navy/10 bg-brand-light">
        <ul className="mx-auto flex max-w-7xl list-none flex-wrap gap-2 px-4 py-4 sm:px-6 lg:px-8">
          {LABOUR_VFR_DESTINATIONS.map((d) => (
            <li key={d.key}>
              <a
                href={`#${d.key}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-gold"
              >
                <PlaneLanding className="h-4 w-4 text-brand-gold-ink" aria-hidden="true" />
                {d.city[lang]} ({d.iata})
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* In short — answer-first summary for readers and AI search */}
      <section className="bg-white py-14 sm:py-16" aria-labelledby="lv-summary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-brand-navy/10 border-l-4 border-l-brand-gold bg-brand-light/60 p-6 sm:p-8">
            <h2 id="lv-summary" className="font-display text-2xl font-bold text-brand-navy">
              {t("summaryTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-brand-navy/80" data-speakable>
              {t("summaryText")}
            </p>
          </div>
        </div>
      </section>

      {/* What Labour and VFR fares are */}
      <section className="bg-white pb-16 sm:pb-20" aria-labelledby="lv-fares">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="lv-fares" className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {t("faresTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-navy/75">{t("faresIntro")}</p>
          </div>
          <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FARE_TYPES.map((k) => (
              <div
                key={k}
                className={`rounded-2xl border p-6 ${
                  k === "labour" || k === "vfr"
                    ? "border-brand-gold/40 bg-brand-gold/5"
                    : "border-brand-navy/10 bg-white"
                }`}
              >
                <dt className="font-display text-lg font-bold text-brand-navy">
                  {t(`fareTypes.${k}.name`)}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-brand-navy/75">
                  {t(`fareTypes.${k}.text`)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mx-auto mt-8 flex max-w-3xl gap-3 rounded-xl bg-brand-light/60 p-4 text-sm leading-relaxed text-brand-navy/80">
            <Info className="mt-0.5 h-5 w-5 flex-none text-brand-gold-ink" aria-hidden="true" />
            <span>{t("faresNote")}</span>
          </p>
        </div>
      </section>

      {/* Who may qualify */}
      <section className="bg-brand-light py-16 sm:py-20" aria-labelledby="lv-qualify">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 id="lv-qualify" className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {t("qualifyTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-navy/75">{t("qualifyIntro")}</p>
            <p className="mt-4 leading-relaxed text-brand-navy/75">{t("qualifyDocs")}</p>
          </div>
          <ul className="list-none space-y-3 p-0">
            {QUALIFY.map((n) => (
              <li key={n} className="flex gap-3 rounded-xl bg-white p-4 shadow-card">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-none text-brand-gold-ink" aria-hidden="true" />
                <span className="leading-relaxed text-brand-navy/85">{t(`qualify${n}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Airlines */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="lv-airlines">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="lv-airlines" className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {t("airlinesTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-navy/75">{t("airlinesIntro")}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {AIRLINES.map((k) => (
              <div key={k} className="flex flex-col rounded-2xl border border-brand-navy/10 p-6 shadow-card">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold-ink">
                  <PlaneTakeoff className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-brand-navy">{t(`airlines.${k}.name`)}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-gold-ink">{t(`airlines.${k}.hub`)}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-navy/75">{t(`airlines.${k}.text`)}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 flex max-w-3xl gap-3 rounded-xl bg-brand-light/60 p-4 text-sm leading-relaxed text-brand-navy/80">
            <Info className="mt-0.5 h-5 w-5 flex-none text-brand-gold-ink" aria-hidden="true" />
            <span>{t("airlinesNote")}</span>
          </p>
        </div>
      </section>

      {/* Destinations */}
      <section
        id="destinations"
        className="scroll-mt-24 bg-brand-light py-16 sm:py-20"
        aria-labelledby="lv-destinations"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="lv-destinations" className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {t("destTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-navy/75">{t("destIntro")}</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {LABOUR_VFR_DESTINATIONS.map((d) => (
              <article
                key={d.key}
                id={d.key}
                aria-labelledby={`lv-dest-${d.key}`}
                className="scroll-mt-24 flex flex-col rounded-2xl bg-white p-6 shadow-card sm:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold-ink">
                  {d.country[lang]} · {d.iata}
                </p>
                <h3 id={`lv-dest-${d.key}`} className="mt-2 font-display text-2xl font-bold text-brand-navy">
                  {t(`destinations.${d.key}.title`)}
                </h3>
                <p className="mt-3 leading-relaxed text-brand-navy/80">{t(`destinations.${d.key}.text`)}</p>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="rounded-xl bg-brand-light/60 p-4">
                    <dt className="font-semibold text-brand-navy">{t("routingLabel")}</dt>
                    <dd className="mt-1 leading-relaxed text-brand-navy/80">{t(`destinations.${d.key}.routing`)}</dd>
                  </div>
                  <div className="rounded-xl bg-brand-light/60 p-4">
                    <dt className="font-semibold text-brand-navy">{t("returnLabel")}</dt>
                    <dd className="mt-1 leading-relaxed text-brand-navy/80">{t(`destinations.${d.key}.return`)}</dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <WhatsAppCtaLink
                    href={labourVfrWhatsAppHref(d.key, locale)}
                    newTabHint={newTabHint}
                    trackRegion={`labour_vfr_${d.key}`}
                  >
                    {t(`destinations.${d.key}.cta`)}
                  </WhatsAppCtaLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Return flights to Cyprus */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="lv-return">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 id="lv-return" className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {t("returnTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-navy/75">{t("returnP1")}</p>
            <p className="mt-4 leading-relaxed text-brand-navy/75">{t("returnP2")}</p>
          </div>
          <ul className="list-none space-y-3 p-0">
            {RETURN_POINTS.map((n) => (
              <li key={n} className="flex gap-3 rounded-xl border border-brand-navy/10 p-4">
                <PlaneLanding className="mt-0.5 h-5 w-5 flex-none text-brand-gold-ink" aria-hidden="true" />
                <span className="leading-relaxed text-brand-navy/85">{t(`returnPoint${n}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Baggage and fare conditions */}
      <section className="bg-brand-light py-16 sm:py-20" aria-labelledby="lv-checks">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <Luggage className="mt-1 hidden h-10 w-10 flex-none text-brand-gold-ink sm:block" aria-hidden="true" />
            <div>
              <h2 id="lv-checks" className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
                {t("checksTitle")}
              </h2>
              <p className="mt-4 leading-relaxed text-brand-navy/75">{t("checksIntro")}</p>
            </div>
          </div>
          <ul className="mt-10 grid list-none gap-3 p-0 sm:grid-cols-2">
            {CHECKS.map((n) => (
              <li key={n} className="flex gap-3 rounded-xl bg-white p-4 shadow-card">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-none text-brand-gold-ink" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-brand-navy/85">{t(`check${n}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why book through a local agency */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="lv-why">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="lv-why" className="text-center font-display text-3xl font-bold text-brand-navy sm:text-4xl">
            {t("whyTitle")}
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ key, icon: Icon }) => (
              <div key={key} className="rounded-2xl border border-brand-navy/10 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold-ink">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy">{t(`${key}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-navy/75">{t(`${key}Text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-navy py-16 text-white sm:py-20" aria-labelledby="lv-steps">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="lv-steps" className="text-center font-display text-3xl font-bold sm:text-4xl">
            {t("stepsTitle")}
          </h2>
          <ol className="mt-12 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((n) => (
              <li key={n} className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold font-semibold text-brand-navy"
                  aria-hidden="true"
                >
                  {n}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{t(`step${n}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{t(`step${n}Text`)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <WhatsAppCtaLink
              href={labourVfrWhatsAppHref(null, locale)}
              newTabHint={newTabHint}
              trackRegion="labour_vfr_steps"
            >
              {t("stepsCta")}
            </WhatsAppCtaLink>
          </div>
        </div>
      </section>

      {/* Employers → seasonal staff page */}
      <section className="bg-white py-14" aria-labelledby="lv-employers">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-5 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <Briefcase className="h-10 w-10 flex-none text-brand-gold-ink" aria-hidden="true" />
          <div className="flex-1">
            <h2 id="lv-employers" className="font-display text-2xl font-bold text-brand-navy">
              {t("employerTitle")}
            </h2>
            <p className="mt-1 text-brand-navy/75">{t("employerText")}</p>
          </div>
          <Link
            href={`/${locale}${SEASONAL_STAFF_PATH}`}
            className="inline-flex min-h-11 items-center rounded-full border border-brand-navy/20 px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/5"
          >
            {t("employerCta")}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <FAQSection
        title={t("faqTitle")}
        background="light"
        items={FAQS.map((n) => ({ question: t(`faq${n}Q`), answer: t(`faq${n}A`) }))}
      />

      <RelatedArticles locale={locale} tags={["labour-vfr", "seasonal-staff", "airports", "аэропорты"]} />
      <ServicesCrossLinks locale={locale} include={["seasonalStaff", "flights", "paphos"]} />

      {/* Closing CTA */}
      <section className="bg-brand-navy py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">{t("ctaText")}</p>
          <div className="mt-8 flex justify-center">
            <WhatsAppCtaLink
              href={labourVfrWhatsAppHref(null, locale)}
              newTabHint={newTabHint}
              trackRegion="labour_vfr_closing"
            >
              {t("ctaWhatsApp")}
            </WhatsAppCtaLink>
          </div>
        </div>
      </section>

      <ServiceSchema
        locale={locale}
        name={t("schemaName")}
        description={t("schemaDescription")}
        url={`${CANONICAL_ORIGIN}/${locale}${LABOUR_VFR_PATH}`}
        serviceType={t("schemaServiceType")}
        dateModified={LABOUR_VFR_LAST_UPDATED}
        audience={{ "@type": "PeopleAudience", audienceType: t("schemaAudience") }}
      />
    </>
  );
}

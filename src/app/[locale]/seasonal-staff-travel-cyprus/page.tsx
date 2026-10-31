import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  CheckCircle,
  ClipboardList,
  FileText,
  Info,
  Luggage,
  PlaneLanding,
  PlaneTakeoff,
  Route,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buildPageMetadata, CANONICAL_ORIGIN } from "@/lib/seo";
import {
  LABOUR_VFR_DESTINATIONS,
  LABOUR_VFR_LAST_UPDATED,
  LABOUR_VFR_PATH,
  SEASONAL_STAFF_PATH,
  employerWhatsAppHref,
} from "@/lib/labour-vfr";
import ServiceSchema from "@/components/seo/ServiceSchema";
import FAQSection from "@/components/sections/FAQSection";
import RelatedArticles from "@/components/sections/RelatedArticles";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import WhatsAppCtaLink from "@/components/ui/WhatsAppCtaLink";

/*
 * Seasonal staff flights for employers (Oct 2026 campaign): hotel general
 * managers, restaurant owners and HR teams arranging flights home after the
 * season and back to Cyprus before the next one. Linked from the Corporate
 * Travel page. Same copy rules as the Labour/VFR page: no prices, no
 * guaranteed fares, no invented eligibility — WhatsApp-only enquiries.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seasonalStaffPage" });
  return buildPageMetadata({
    locale,
    routePath: SEASONAL_STAFF_PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords:
      locale === "ru"
        ? [
            "перелёты для сезонного персонала Кипр",
            "авиабилеты для сотрудников отеля Кипр",
            "трудовые тарифы для персонала Кипр",
            "перелёты персонала Филиппины Кипр",
            "перелёты персонала Непал Кипр",
            "турагентство для иностранных работников Кипр",
          ]
        : [
            "seasonal worker flight bookings Cyprus",
            "special flights for hotel employees Cyprus",
            "labour flight tickets for staff Cyprus",
            "hotel staff flights Philippines Cyprus",
            "hotel employees flights Nepal Cyprus",
            "hotel employees flights Bangladesh Cyprus",
            "hotel staff flights India Cyprus",
            "travel agency for foreign workers Cyprus",
          ],
  });
}

const SERVICES: ReadonlyArray<{ key: string; icon: LucideIcon }> = [
  { key: "svcHome", icon: PlaneTakeoff },
  { key: "svcReturn", icon: PlaneLanding },
  { key: "svcGroup", icon: Users },
  { key: "svcFares", icon: CheckCircle },
  { key: "svcBaggage", icon: Luggage },
  { key: "svcItinerary", icon: Route },
  { key: "svcInvoice", icon: FileText },
];
const SEND = [1, 2, 3, 4, 5, 6] as const;
const STEPS = [1, 2, 3, 4] as const;
const WHY = [1, 2, 3, 4] as const;
const FAQS = [1, 2, 3, 4, 5, 6, 7] as const;

export default async function SeasonalStaffTravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "seasonalStaffPage" });
  const lang = locale === "ru" ? "ru" : "en";
  const newTabHint = t("newTabHint");
  const whatsappHref = employerWhatsAppHref(locale);

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
              <WhatsAppCtaLink href={whatsappHref} newTabHint={newTabHint} trackRegion="seasonal_staff_hero">
                {t("heroCta")}
              </WhatsAppCtaLink>
              <a
                href="#what-to-send"
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

      {/* In short */}
      <section className="bg-white py-14 sm:py-16" aria-labelledby="ss-summary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-brand-navy/10 border-l-4 border-l-brand-gold bg-brand-light/60 p-6 sm:p-8">
            <h2 id="ss-summary" className="font-display text-2xl font-bold text-brand-navy">
              {t("summaryTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-brand-navy/80" data-speakable>
              {t("summaryText")}
            </p>
          </div>
        </div>
      </section>

      {/* What we arrange */}
      <section className="bg-white pb-16 sm:pb-20" aria-labelledby="ss-services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="ss-services" className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {t("servicesTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-navy/75">{t("servicesIntro")}</p>
          </div>
          <ul className="mt-12 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ key, icon: Icon }) => (
              <li key={key} className="rounded-2xl border border-brand-navy/10 p-6 shadow-card">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold-ink">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy">{t(`${key}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-navy/75">{t(`${key}Text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Typical staff routes */}
      <section className="bg-brand-light py-16 sm:py-20" aria-labelledby="ss-routes">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="ss-routes" className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {t("routesTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-navy/75">{t("routesIntro")}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {LABOUR_VFR_DESTINATIONS.map((d) => (
              <div key={d.key} className="rounded-2xl bg-white p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold-ink">
                  {d.city[lang]} · {d.iata}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-brand-navy">
                  {t(`routes.${d.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-navy/80">{t(`routes.${d.key}.text`)}</p>
                <Link
                  href={`/${locale}${LABOUR_VFR_PATH}#${d.key}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-brand-gold-ink hover:text-brand-navy"
                >
                  {t("routeLink", { city: d.city[lang] })}
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 flex max-w-3xl gap-3 rounded-xl bg-white p-4 text-sm leading-relaxed text-brand-navy/80">
            <Info className="mt-0.5 h-5 w-5 flex-none text-brand-gold-ink" aria-hidden="true" />
            <span>{t("routesNote")}</span>
          </p>
        </div>
      </section>

      {/* Example season plan */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="ss-example">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <CalendarRange className="mt-1 hidden h-10 w-10 flex-none text-brand-gold-ink sm:block" aria-hidden="true" />
            <div>
              <h2 id="ss-example" className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
                {t("exampleTitle")}
              </h2>
              <p className="mt-4 leading-relaxed text-brand-navy/75">{t("exampleP1")}</p>
              <p className="mt-4 leading-relaxed text-brand-navy/75">{t("exampleP2")}</p>
              <p className="mt-4 text-sm italic text-brand-navy/60">{t("exampleNote")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What to send us */}
      <section
        id="what-to-send"
        className="scroll-mt-24 bg-brand-light py-16 sm:py-20"
        aria-labelledby="ss-send"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <ClipboardList className="h-10 w-10 text-brand-gold-ink" aria-hidden="true" />
            <h2 id="ss-send" className="mt-4 font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {t("sendTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-navy/75">{t("sendIntro")}</p>
            <p className="mt-4 text-sm leading-relaxed text-brand-navy/70">{t("sendPrivacy")}</p>
            <div className="mt-8">
              <WhatsAppCtaLink href={whatsappHref} newTabHint={newTabHint} trackRegion="seasonal_staff_send">
                {t("sendCta")}
              </WhatsAppCtaLink>
            </div>
          </div>
          <ul className="list-none space-y-3 p-0">
            {SEND.map((n) => (
              <li key={n} className="flex gap-3 rounded-xl bg-white p-4 shadow-card">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-none text-brand-gold-ink" aria-hidden="true" />
                <span className="leading-relaxed text-brand-navy/85">{t(`send${n}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-navy py-16 text-white sm:py-20" aria-labelledby="ss-steps">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="ss-steps" className="text-center font-display text-3xl font-bold sm:text-4xl">
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
        </div>
      </section>

      {/* Why a local IATA agency */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="ss-why">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="ss-why" className="text-center font-display text-3xl font-bold text-brand-navy sm:text-4xl">
            {t("whyTitle")}
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((n) => (
              <div key={n} className="rounded-2xl border border-brand-navy/10 p-6">
                <h3 className="text-lg font-bold text-brand-navy">{t(`why${n}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-navy/75">{t(`why${n}Text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual travellers → Labour/VFR page */}
      <section className="bg-brand-light py-14" aria-labelledby="ss-individuals">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-5 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <UserRound className="h-10 w-10 flex-none text-brand-gold-ink" aria-hidden="true" />
          <div className="flex-1">
            <h2 id="ss-individuals" className="font-display text-2xl font-bold text-brand-navy">
              {t("individualTitle")}
            </h2>
            <p className="mt-1 text-brand-navy/75">{t("individualText")}</p>
          </div>
          <Link
            href={`/${locale}${LABOUR_VFR_PATH}`}
            className="inline-flex min-h-11 items-center rounded-full border border-brand-navy/20 bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/5"
          >
            {t("individualCta")}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <FAQSection
        title={t("faqTitle")}
        items={FAQS.map((n) => ({ question: t(`faq${n}Q`), answer: t(`faq${n}A`) }))}
      />

      <RelatedArticles locale={locale} tags={["seasonal-staff", "labour-vfr", "corporate"]} />
      <ServicesCrossLinks locale={locale} include={["labourVfr", "corporate", "paphos"]} />

      {/* Closing CTA */}
      <section className="bg-brand-navy py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">{t("ctaText")}</p>
          <div className="mt-8 flex justify-center">
            <WhatsAppCtaLink href={whatsappHref} newTabHint={newTabHint} trackRegion="seasonal_staff_closing">
              {t("ctaWhatsApp")}
            </WhatsAppCtaLink>
          </div>
        </div>
      </section>

      <ServiceSchema
        locale={locale}
        name={t("schemaName")}
        description={t("schemaDescription")}
        url={`${CANONICAL_ORIGIN}/${locale}${SEASONAL_STAFF_PATH}`}
        serviceType={t("schemaServiceType")}
        dateModified={LABOUR_VFR_LAST_UPDATED}
        audience={{ "@type": "BusinessAudience", audienceType: t("schemaAudience") }}
      />
    </>
  );
}

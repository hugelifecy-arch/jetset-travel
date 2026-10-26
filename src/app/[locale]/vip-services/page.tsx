import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Plane,
  PlaneTakeoff,
  Sailboat,
  Home,
  Hotel,
  Ship,
  Info,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buildPageMetadata, SERVICE_LAST_UPDATED } from "@/lib/seo";
import ServiceSchema from "@/components/seo/ServiceSchema";
import FAQSection from "@/components/sections/FAQSection";
import RelatedArticles from "@/components/sections/RelatedArticles";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import VipAirportForm from "@/components/forms/VipAirportForm";

/*
 * VIP services hub (Oct 2026 UX audit, item 15). Before this page the VIP
 * offer lived only in blog posts. Every fact here comes from the
 * fact-checked guides it links to (VIP airport service, private jet &
 * yacht charter, villas, luxury cruises) and from owner-confirmed services:
 * no prices, no guarantees, no named partners beyond what those guides say.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vipPage" });
  return buildPageMetadata({
    locale,
    routePath: "/vip-services",
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords:
      locale === "ru"
        ? ["VIP-обслуживание аэропорт Ларнака", "VIP Пафос аэропорт", "аренда частного самолёта Кипр", "аренда яхты Кипр", "люксовые виллы Кипр", "VIP-услуги Кипр"]
        : ["VIP airport service Larnaca", "VIP Paphos airport", "private jet charter Cyprus", "yacht charter Cyprus", "luxury villas Cyprus", "VIP travel Cyprus"],
  });
}

type Service = {
  icon: LucideIcon;
  key: "airport" | "jet" | "yacht" | "villas" | "hotels" | "cruises";
  href: (locale: string) => string;
  linkKey: "readGuide" | "seeService";
};

const BLOG = (locale: string, en: string, ru: string) =>
  `/${locale}/blog/${locale === "ru" ? ru : en}`;

const services: Service[] = [
  {
    icon: PlaneTakeoff,
    key: "airport",
    href: (l) => BLOG(l, "vip-airport-service-larnaca-paphos", "vip-obsluzhivanie-aeroport-larnaka-pafos"),
    linkKey: "readGuide",
  },
  {
    icon: Plane,
    key: "jet",
    href: (l) => BLOG(l, "private-jet-yacht-charter-cyprus", "chastnyj-samolet-i-yakhta-s-kipra"),
    linkKey: "readGuide",
  },
  {
    icon: Sailboat,
    key: "yacht",
    href: (l) => BLOG(l, "private-jet-yacht-charter-cyprus", "chastnyj-samolet-i-yakhta-s-kipra"),
    linkKey: "readGuide",
  },
  {
    icon: Home,
    key: "villas",
    href: (l) => BLOG(l, "private-villa-holidays-mykonos-santorini-crete", "villy-mikonos-santorini-krit-s-kipra"),
    linkKey: "readGuide",
  },
  {
    icon: Hotel,
    key: "hotels",
    href: (l) => `/${l}/hotel-reservations`,
    linkKey: "seeService",
  },
  {
    icon: Ship,
    key: "cruises",
    href: (l) => BLOG(l, "luxury-cruises-from-cyprus-2027", "lyuks-kruizy-s-kipra-2027"),
    linkKey: "readGuide",
  },
];

export default async function VipServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "vipPage" });
  const whatsappHref = `https://wa.me/35799478073?text=${encodeURIComponent(t("whatsappMessage"))}`;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-brand-navy text-white">
        <Image
          src="/images/vip/blue-lagoon-yachts.jpg"
          alt={t("heroImageAlt")}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        {/* Darker on the text side only, so the photo stays visible */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-navy/85 via-brand-navy/65 to-brand-navy/40 md:bg-gradient-to-r md:from-brand-navy/90 md:via-brand-navy/60 md:to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gold">
              {t("heroLabel")}
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-xl" data-speakable>
              {t("heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#vip-airport-request"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90"
              >
                {t("heroCtaVip")}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/${locale}/quote?type=luxury`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t("heroCtaTrip")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What we arrange */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="vip-arrange">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="vip-arrange" className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {t("introTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-navy/75" data-speakable>
              {t("introText")}
            </p>
          </div>
          <ul className="mt-12 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li
                key={s.key}
                className="flex flex-col rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-card transition-shadow hover:shadow-luxury"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold-ink">
                  <s.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-brand-navy">{t(`${s.key}Title`)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-navy/75">{t(`${s.key}Text`)}</p>
                <Link
                  href={s.href(locale)}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-brand-gold-ink hover:text-brand-navy"
                >
                  {t(s.linkKey)}
                  <span className="sr-only">: {t(`${s.key}Title`)}</span>
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* VIP airport request */}
      <section
        id="vip-airport-request"
        className="scroll-mt-24 bg-brand-light py-16 sm:py-20"
        aria-labelledby="vip-airport-form-title"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="vip-airport-form-title" className="font-display text-3xl font-bold text-brand-navy">
            {t("formTitle")}
          </h2>
          <p className="mt-3 leading-relaxed text-brand-navy/75">{t("formSubtitle")}</p>
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-card sm:p-8">
            <VipAirportForm />
          </div>
        </div>
      </section>

      {/* Good to know */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="vip-facts">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 id="vip-facts" className="font-display text-3xl font-bold text-brand-navy">
            {t("factsTitle")}
          </h2>
          <ul className="mt-8 list-none space-y-4 p-0">
            {(["fact1", "fact2", "fact3", "fact4"] as const).map((k) => (
              <li key={k} className="flex gap-3 rounded-xl bg-brand-light/60 p-4 text-brand-navy/80">
                <Info className="mt-0.5 h-5 w-5 flex-none text-brand-gold-ink" aria-hidden="true" />
                <span className="leading-relaxed">{t(k)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-navy py-16 text-white sm:py-20" aria-labelledby="vip-steps">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="vip-steps" className="text-center font-display text-3xl font-bold sm:text-4xl">
            {t("stepsTitle")}
          </h2>
          <ol className="mt-12 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {([1, 2, 3, 4] as const).map((n) => (
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

      {/* Discretion → private clients */}
      <section className="bg-white py-14" aria-labelledby="vip-private">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-5 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <ShieldCheck className="h-10 w-10 flex-none text-brand-gold-ink" aria-hidden="true" />
          <div className="flex-1">
            <h2 id="vip-private" className="font-display text-2xl font-bold text-brand-navy">
              {t("privateTitle")}
            </h2>
            <p className="mt-1 text-brand-navy/75">{t("privateText")}</p>
          </div>
          <Link
            href={`/${locale}/private`}
            className="inline-flex min-h-[44px] items-center rounded-full border border-brand-navy/20 px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/5"
          >
            {t("privateCta")}
          </Link>
        </div>
      </section>

      <FAQSection
        title={t("faqTitle")}
        items={[1, 2, 3, 4, 5].map((n) => ({ question: t(`faq${n}Q`), answer: t(`faq${n}A`) }))}
      />

      <RelatedArticles locale={locale} tags={["vip", "luxury", "private-jet"]} />
      <ServicesCrossLinks locale={locale} include={["luxury", "cruises", "hotels"]} />

      {/* Closing CTA */}
      <section className="bg-brand-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-navy/75">{t("ctaText")}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/${locale}/quote?type=luxury`}
              className="inline-flex min-h-[44px] items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90"
            >
              {t("ctaQuote")}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-full border border-brand-navy/20 px-8 py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/5"
            >
              {t("ctaWhatsApp")}
            </a>
          </div>
        </div>
      </section>

      <ServiceSchema
        locale={locale}
        name={t("schemaName")}
        description={t("schemaDescription")}
        url={`https://www.jetset-travel.com/${locale}/vip-services`}
        serviceType="VIP Travel Services"
        dateModified={SERVICE_LAST_UPDATED}
      />
    </>
  );
}

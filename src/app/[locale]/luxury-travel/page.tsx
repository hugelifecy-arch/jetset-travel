import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import {
  Palmtree,
  Mountain,
  Building2,
  Heart,
  Quote,
  ArrowRight,
} from "lucide-react";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/luxury-travel",
    title:
      locale === "ru"
        ? "Премиальный отдых и путешествия из Кипра | JetSet Travel"
        : "Luxury Travel Planning Cyprus | Premium Holidays & Private Transfers | JetSet",
    description:
      locale === "ru"
        ? "Индивидуальные программы премиального отдыха с Кипра. Отели уровня люкс, личные трансферы, эксклюзивные маршруты. Спланируйте путешествие с JetSet Travel."
        : "Curated luxury travel experiences from Cyprus. Suite-level hotels, private transfers, bespoke multi-city journeys. Plan your premium getaway with JetSet Travel.",
  });
}

export default async function LuxuryTravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "luxuryPage" });

  const categories = [
    {
      icon: Palmtree,
      title: t("islandsTitle"),
      description: t("islandsDesc"),
    },
    {
      icon: Mountain,
      title: t("skiTitle"),
      description: t("skiDesc"),
    },
    {
      icon: Building2,
      title: t("cityTitle"),
      description: t("cityDesc"),
    },
    {
      icon: Heart,
      title: t("honeymoonTitle"),
      description: t("honeymoonDesc"),
    },
  ];

  const editorials = [
    {
      title: t("listenTitle"),
      description: t("listenDesc"),
      align: "left" as const,
      image: "/images/luxury/listen.jpg",
    },
    {
      title: t("accessTitle"),
      description: t("accessDesc"),
      align: "right" as const,
      image: "/images/luxury/access.jpg",
    },
  ];

  const destinations = [
    {
      name: t("maldivesName"),
      tagline: t("maldivesTagline"),
      description: t("maldivesDesc"),
      image: "/images/luxury/maldives.jpg",
    },
    {
      name: t("tuscanyName"),
      tagline: t("tuscanyTagline"),
      description: t("tuscanyDesc"),
      image: "/images/luxury/tuscany.jpg",
    },
    {
      name: t("dubaiName"),
      tagline: t("dubaiTagline"),
      description: t("dubaiDesc"),
      image: "/images/luxury/dubai.jpg",
    },
  ];

  return (
    <>
      {/* Full-width Hero */}
      <section className="relative bg-brand-navy text-white py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-6">
            {t("heroLabel")}
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            {t("heroSubtitle")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center rounded-full bg-brand-gold px-10 py-4 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
          >
            {t("planJourney")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Experience Category Cards */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("categoriesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("categoriesSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="group p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <cat.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {cat.title}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Alternating Sections */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          {editorials.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <div className="aspect-[4/3] rounded-2xl relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
                  {item.title}
                </h2>
                <p className="text-brand-navy/60 leading-relaxed text-lg">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destination Cards */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("destTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("destSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.name}
                className="group rounded-2xl overflow-hidden border border-brand-navy/10 hover:shadow-luxury transition-shadow"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-white text-lg font-display font-bold drop-shadow-lg">
                    {dest.name}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-1">
                    {dest.tagline}
                  </p>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">
                    {dest.name}
                  </h3>
                  <p className="text-brand-navy/60 text-sm leading-relaxed">
                    {dest.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull-quote Testimonial */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="h-12 w-12 text-brand-gold/40 mx-auto mb-8" />
          <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-8">
            &ldquo;{t("testimonial")}&rdquo;
          </blockquote>
          <div>
            <p className="text-brand-gold font-semibold">{t("testimonialAuthor")}</p>
            <p className="text-white/50 text-sm">{t("testimonialLocation")}</p>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <ServicesCrossLinks locale={locale} exclude="luxury" />

      {/* Enquiry CTA */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-brand-navy/60 max-w-2xl mx-auto mb-8">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/contact?type=luxury`}
              className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              {t("ctaEnquiry")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/35799478073?text=${locale === "ru" ? encodeURIComponent("Здравствуйте, меня интересует премиальный отдых.") : encodeURIComponent("Hi, I'm interested in a luxury travel experience.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-brand-navy/20 px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5 transition-colors"
            >
              {t("ctaWhatsApp")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

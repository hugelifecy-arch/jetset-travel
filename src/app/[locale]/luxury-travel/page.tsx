import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import {
  Palmtree,
  Mountain,
  Building2,
  Heart,
  Quote,
  ArrowRight,
} from "lucide-react";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import ReviewSchema from "@/components/seo/ReviewSchema";
import ServiceSchema from "@/components/seo/ServiceSchema";
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
        ? "Люкс Турагентство Пафос | Премиум Отдых — JetSet Travel Кипр"
        : "Luxury Travel Agency Paphos | Premium Holiday Planning — JetSet Travel Cyprus",
    description:
      locale === "ru"
        ? "Планирование люкс-путешествий из Пафоса, Кипр. Эксклюзивные отели, частные трансферы, индивидуальные маршруты. Бесплатная консультация."
        : "Luxury travel planning from Paphos, Cyprus. Curated premium holidays, private transfers, suite-level hotels, and bespoke multi-city journeys. Get a free consultation.",
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
      imageAlt: "Luxury resort poolside lounge at sunset",
    },
    {
      title: t("accessTitle"),
      description: t("accessDesc"),
      align: "right" as const,
      image: "/images/luxury/access.jpg",
      imageAlt: "Exclusive infinity pool overlooking the ocean",
    },
  ];

  const destinations = [
    {
      name: t("maldivesName"),
      tagline: t("maldivesTagline"),
      description: t("maldivesDesc"),
      price: t("maldivesPrice"),
      image: "/images/luxury/maldives.jpg",
      imageAlt: "Aerial view of overwater bungalows in the Maldives",
      slug: "maldives",
    },
    {
      name: t("santoriniName"),
      tagline: t("santoriniTagline"),
      description: t("santoriniDesc"),
      price: t("santoriniPrice"),
      image: "/images/luxury/santorini.jpg",
      imageAlt: "White-washed buildings overlooking the Santorini caldera at sunset",
      slug: "santorini",
    },
    {
      name: t("dubaiName"),
      tagline: t("dubaiTagline"),
      description: t("dubaiDesc"),
      price: t("dubaiPrice"),
      image: "/images/luxury/dubai.jpg",
      imageAlt: "Dubai skyline with Burj Khalifa at sunset",
      slug: "dubai",
    },
    {
      name: t("swissAlpsName"),
      tagline: t("swissAlpsTagline"),
      description: t("swissAlpsDesc"),
      price: t("swissAlpsPrice"),
      image: "/images/luxury/swiss-alps.jpg",
      imageAlt: "Snow-capped Swiss Alps with luxury chalet in the foreground",
      slug: "swiss-alps",
    },
    {
      name: t("seychellesName"),
      tagline: t("seychellesTagline"),
      description: t("seychellesDesc"),
      price: t("seychellesPrice"),
      image: "/images/luxury/seychelles.jpg",
      imageAlt: "Pristine beach with granite boulders in the Seychelles",
      slug: "seychelles",
    },
    {
      name: t("tuscanyName"),
      tagline: t("tuscanyTagline"),
      description: t("tuscanyDesc"),
      price: t("tuscanyPrice"),
      image: "/images/luxury/tuscany.jpg",
      imageAlt: "Rolling Tuscan hills with vineyards and a villa",
      slug: "tuscany",
    },
  ];

  return (
    <>
      {/* Full-width Hero */}
      <section className="relative bg-brand-navy text-white min-h-[400px] flex items-center overflow-hidden">
        <Image
          src="/images/services/luxury.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative w-full py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
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
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    loading="lazy"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <Link
                key={dest.name}
                href={`/${locale}/contact?type=luxury&destination=${dest.slug}`}
                className="group rounded-2xl overflow-hidden border border-brand-navy/10 hover:shadow-luxury transition-shadow block"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.imageAlt}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-3 right-3 bg-brand-navy/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {dest.price}
                  </div>
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
              </Link>
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
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-brand-gold text-sm" aria-hidden="true">★★★★★</span>
            <span className="text-white/40 text-xs">
              5/5{" "}
              <a
                href="https://www.google.com/maps/search/?api=1&query=JETSET%20TRAVEL%20AGENCY%20Paphos"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white/60 transition-colors"
              >
                via Google Reviews
              </a>
            </span>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <ServicesCrossLinks locale={locale} include={["hotels", "cruises", "corporate"]} />

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

      <ServiceSchema
        name="Luxury Travel Planning"
        description="Curated luxury travel experiences from Cyprus. Suite-level hotels, private transfers, bespoke multi-city journeys, island getaways, and honeymoon planning."
        url={`https://www.jetset-travel.com/${locale}/luxury-travel`}
      />
      <ReviewSchema
        reviews={[
          {
            author: t("testimonialAuthor"),
            reviewBody: t("testimonial"),
            ratingValue: 5,
          },
        ]}
      />
    </>
  );
}

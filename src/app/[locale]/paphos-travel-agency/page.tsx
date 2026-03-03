import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  MessageCircle,
  Languages,
  Briefcase,
  Palmtree,
  Hotel,
  FileText,
  Ship,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Star,
} from "lucide-react";
import CTABanner from "@/components/sections/CTABanner";
import ServiceSchema from "@/components/seo/ServiceSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/paphos-travel-agency",
    title:
      locale === "ru"
        ? "Туристическое агентство в Пафосе, Кипр | JetSet Travel — Аккредитация IATA"
        : "Travel Agency in Paphos, Cyprus | JetSet Travel — IATA Accredited Agent",
    description:
      locale === "ru"
        ? "Ищете надёжное туристическое агентство в Пафосе? JetSet Travel — аккредитация IATA, 20+ лет опыта. Корпоративные поездки, авиабилеты, отели, визовые услуги. Посетите нас: Агапинорос 26А."
        : "Looking for a trusted travel agency in Paphos? JetSet Travel is IATA accredited with 20+ years experience. Corporate travel, flights, hotels, visa services. Visit us at 26A Agapinoros.",
    languagePaths: {
      en: "/paphos-travel-agency",
      ru: "/turisticheskoe-agentstvo-pafos",
    },
  });
}

const benefits = [
  {
    icon: ShieldCheck,
    titleKey: "benefit1Title",
    descKey: "benefit1Desc",
  },
  {
    icon: Clock,
    titleKey: "benefit2Title",
    descKey: "benefit2Desc",
  },
  {
    icon: MessageCircle,
    titleKey: "benefit3Title",
    descKey: "benefit3Desc",
  },
  {
    icon: Languages,
    titleKey: "benefit4Title",
    descKey: "benefit4Desc",
  },
] as const;

const services = [
  {
    icon: Briefcase,
    titleKey: "serviceCorporateTitle",
    descKey: "serviceCorporateDesc",
    href: "/corporate-travel",
  },
  {
    icon: Palmtree,
    titleKey: "serviceLuxuryTitle",
    descKey: "serviceLuxuryDesc",
    href: "/luxury-travel",
  },
  {
    icon: Hotel,
    titleKey: "serviceHotelsTitle",
    descKey: "serviceHotelsDesc",
    href: "/hotel-reservations",
  },
  {
    icon: FileText,
    titleKey: "serviceVisaTitle",
    descKey: "serviceVisaDesc",
    href: "/visa-services",
  },
  {
    icon: Ship,
    titleKey: "serviceCruisesTitle",
    descKey: "serviceCruisesDesc",
    href: "/cruises",
  },
] as const;

const testimonials = [
  {
    key: "review1",
    name: "Maria K.",
    company: "Technology Firm, Limassol",
    avatarInitials: "MK",
    rating: 5,
  },
  {
    key: "review2",
    name: "Andreas P.",
    company: "Private Client",
    avatarInitials: "AP",
    rating: 5,
  },
  {
    key: "review3",
    name: "Dmitry S.",
    company: "Import/Export SME, Paphos",
    avatarInitials: "DS",
    rating: 5,
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

export default async function PaphosTravelAgencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "paphosPage" });
  const tReviews = await getTranslations({ locale, namespace: "reviews" });

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
              {t("heroLabel")}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-2xl leading-relaxed">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/quote`}
                className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                {locale === "ru" ? "Получить предложение" : "Get a Free Quote"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {locale === "ru" ? "Связаться с нами" : "Contact Us"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose JetSet */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("whyTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("whySubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.titleKey}
                className="p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {t(benefit.titleKey)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(benefit.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Travel Services in Paphos */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("servicesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("servicesSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.titleKey}
                href={`/${locale}${service.href}`}
                className="group p-8 rounded-2xl border border-brand-navy/10 bg-white hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {t(service.titleKey)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed mb-4">
                  {t(service.descKey)}
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-brand-gold group-hover:gap-2 transition-all">
                  {t("viewService")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How to Find Us */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("findTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("findSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-brand-navy/10 shadow-card">
              <iframe
                title="JetSet Travel Paphos Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.5!2d32.4195!3d34.7587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s26A+Agapinoros+Street%2C+8049+Paphos%2C+Cyprus!5e0!3m2!1sen!2s!4v1700000000000"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Contact Details */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy mb-1">
                    {t("addressLabel")}
                  </p>
                  <p className="text-brand-navy/70 text-sm">
                    {t("address")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex-shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy mb-1">
                    {t("phoneLabel")}
                  </p>
                  <p className="text-brand-navy/70 text-sm">
                    <a href="tel:+35799478073" className="hover:text-brand-gold transition-colors">
                      {t("phone1")}
                    </a>
                  </p>
                  <p className="text-brand-navy/70 text-sm">
                    <a href="tel:+35799310993" className="hover:text-brand-gold transition-colors">
                      {t("phone2")}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex-shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy mb-1">
                    {t("emailLabel")}
                  </p>
                  <p className="text-brand-navy/70 text-sm">
                    <a href="mailto:INFO@JETSET.COM.CY" className="hover:text-brand-gold transition-colors">
                      {t("email")}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex-shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy mb-1">
                    {t("hoursLabel")}
                  </p>
                  <p className="text-brand-navy/70 text-sm">{t("hoursMF")}</p>
                  <p className="text-brand-navy/70 text-sm">{t("hoursSat")}</p>
                  <p className="text-brand-navy/70 text-sm">{t("hoursSun")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("testimonialsTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("testimonialsSubtitle")}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((review) => (
              <figure
                key={review.key}
                className="flex flex-col rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-card"
              >
                <StarRating rating={review.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-navy/80">
                  &ldquo;{tReviews(`${review.key}.text`)}&rdquo;
                </blockquote>
                <figcaption className="mt-5 border-t border-brand-navy/10 pt-4">
                  <div className="flex items-center gap-3">
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
                        {tReviews(`${review.key}.role`)}
                      </p>
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://www.google.com/maps/search/JetSet+Travel+Agency+Paphos+Cyprus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-navy/60 underline underline-offset-2 transition-colors hover:text-brand-navy"
            >
              {tReviews("readMoreOnGoogle")}
            </a>
          </div>
        </div>
      </section>

      {/* CTA with Quote Form */}
      <CTABanner />

      {/* Structured Data */}
      <ServiceSchema
        name="Travel Agency in Paphos, Cyprus"
        description="IATA-accredited travel agency in Paphos, Cyprus with 20+ years experience. Corporate travel management, luxury holidays, hotel reservations, visa services, and cruise bookings. Located at 26A Agapinoros Street, 8049 Paphos."
        url={`https://www.jetset-travel.com/${locale}/paphos-travel-agency`}
      />
    </>
  );
}

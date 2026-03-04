import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import {
  Hotel,
  Building,
  CalendarDays,
  Star,
  BadgeCheck,
  Headphones,
  Users,
  ArrowRight,
  MapPin,
} from "lucide-react";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import InlineTestimonial from "@/components/sections/InlineTestimonial";
import ServiceSchema from "@/components/seo/ServiceSchema";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/hotel-reservations",
    title:
      locale === "ru"
        ? "Бронирование Отелей Кипр | Корпоративные Тарифы — JetSet Travel Пафос"
        : "Hotel Booking Cyprus | Negotiated Corporate Rates — JetSet Travel Paphos",
    description:
      locale === "ru"
        ? "Бронирование отелей по всему миру с корпоративными скидками. Качественные отели под ваш бюджет и стандарты. JetSet Travel, Пафос, Кипр."
        : "Hotel reservations worldwide with negotiated corporate rates. Quality hotels matched to your budget and standards. Book through JetSet Travel, Paphos, Cyprus.",
  });
}

export default async function HotelReservationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hotelPage" });

  const serviceTypes = [
    {
      icon: Hotel,
      title: t("leisureTitle"),
      description: t("leisureDesc"),
    },
    {
      icon: Building,
      title: t("businessTitle"),
      description: t("businessDesc"),
    },
    {
      icon: CalendarDays,
      title: t("extendedTitle"),
      description: t("extendedDesc"),
    },
  ];

  const benefits = [
    {
      icon: Star,
      title: t("ratesTitle"),
      description: t("ratesDesc"),
    },
    {
      icon: BadgeCheck,
      title: t("vettedTitle"),
      description: t("vettedDesc"),
    },
    {
      icon: Headphones,
      title: t("supportTitle"),
      description: t("supportDesc"),
    },
  ];

  const destinations = [
    t("dest1"),
    t("dest2"),
    t("dest3"),
    t("dest4"),
    t("dest5"),
    t("dest6"),
    t("dest7"),
    t("dest8"),
    t("dest9"),
    t("dest10"),
  ];

  const groupBenefits = [
    t("groupBenefit1"),
    t("groupBenefit2"),
    t("groupBenefit3"),
    t("groupBenefit4"),
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-navy text-white min-h-[380px] flex items-center overflow-hidden">
        <Image
          src="/images/services/hotels.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative w-full py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
                {t("heroLabel")}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {t("heroTitle")}
              </h1>
              <p className="text-lg text-white/70 mb-8 max-w-2xl">
                {t("heroSubtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
                >
                  {t("findHotel")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href={`https://wa.me/35799478073?text=${locale === "ru" ? encodeURIComponent("Здравствуйте, мне нужна помощь с бронированием отеля.") : encodeURIComponent("Hi, I need help booking a hotel.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  {t("whatsappUs")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Service Type Cards */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("typesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("typesSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceTypes.map((service) => (
              <div
                key={service.title}
                className="group p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {service.title}
                </h3>
                <p className="text-brand-navy/60 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Book Through Us */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("whyTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("whySubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white p-8 rounded-2xl shadow-card"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-5">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {benefit.title}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preferred Destinations Strip */}
      <section className="py-16 bg-white border-y border-brand-navy/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
              {t("destTitle")}
            </h2>
            <p className="text-brand-navy/60 text-sm">
              {t("destSubtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {destinations.map((dest) => (
              <span
                key={dest}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-light text-brand-navy text-sm font-medium border border-brand-navy/10 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-gold" />
                {dest}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonial */}
      <section className="py-16 bg-brand-light">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-8 text-center">
            {t("testimonialTitle")}
          </h2>
          <InlineTestimonial
            quote={t("testimonial1Quote")}
            author={t("testimonial1Author")}
            role={t("testimonial1Role")}
            date="2025-06"
          />
        </div>
      </section>

      {/* Group Bookings Callout */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("groupTitle")}
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                {t("groupDesc")}
              </p>
              <ul className="space-y-3 mb-8">
                {groupBenefits.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-white/80"
                  >
                    <BadgeCheck className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                {t("groupCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="flex-1 w-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/hotel/group-event.jpg"
                  alt="Hotel conference setup for group bookings and corporate events"
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <ServicesCrossLinks locale={locale} include={["corporate", "luxury", "cruises"]} />
      <ServiceSchema
        name="Hotel Reservations"
        description="Negotiated hotel rates worldwide for corporate and leisure travelers. Quality accommodations matched to your budget, standards, and location needs. Group bookings and extended stays."
        url={`https://www.jetset-travel.com/${locale}/hotel-reservations`}
      />
    </>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  ShieldCheck,
  Heart,
  Scale,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";
import JsonLd from "@/components/seo/JsonLd";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/about",
    title:
      locale === "ru"
        ? "О компании JetSet Travel Кипр | 20+ лет — IATA"
        : "About JetSet Travel Cyprus | 20+ Years — IATA",
    description:
      locale === "ru"
        ? "JetSet K&K Travel Ltd, основана в 2006 году в Пафосе, Кипр. Аккредитация IATA (14200130), туристическая лицензия 7775. Обслуживаем 520+ корпоративных клиентов с удовлетворённостью 98%."
        : "JetSet K&K Travel Ltd, established 2006 in Paphos, Cyprus. IATA accredited (14200130), Tourism Licence 7775. Serving 520+ corporate clients with 98% satisfaction.",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  const values = [
    {
      icon: Eye,
      title: t("transparencyTitle"),
      description: t("transparencyDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("reliabilityTitle"),
      description: t("reliabilityDesc"),
    },
    {
      icon: Heart,
      title: t("personalisationTitle"),
      description: t("personalisationDesc"),
    },
    {
      icon: Scale,
      title: t("accountabilityTitle"),
      description: t("accountabilityDesc"),
    },
  ];

  const team = [
    {
      name: t("member1Name"),
      role: t("member1Role"),
      bio: t("member1Bio"),
      photo: "/images/nontari-kalaitsidis.jpg",
    },
    {
      name: t("member2Name"),
      role: t("member2Role"),
      bio: t("member2Bio"),
      photo: "/images/maro-kokkinou.jpg",
    },
  ];

  const isRussian = locale === "ru";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JetSet K&K Travel Ltd",
    alternateName: ["JetSet Travel Cyprus", "ДжетСет Трэвел Кипр"],
    url: "https://www.jetset-travel.com",
    logo: "https://www.jetset-travel.com/images/jetset-logo.svg",
    description: isRussian
      ? "Аккредитованное IATA туристическое агентство в Пафосе, Кипр. Более 20 лет опыта в корпоративных и премиальных путешествиях."
      : "IATA-accredited travel agency in Paphos, Cyprus. Over 20 years of experience in corporate and luxury travel.",
    foundingDate: "2006",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Paphos",
        addressCountry: "CY",
      },
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "26A Agapinoros",
      addressLocality: "Paphos",
      postalCode: "8049",
      addressCountry: "CY",
    },
    telephone: "+357-99-478-073",
    email: "info@jetset.com.cy",
    legalName: "JetSet K&K Travel Ltd",
    taxID: "HE 181550",
    sameAs: [
      "https://www.facebook.com/JETSETCYPRUS/",
      "https://wa.me/35799478073",
      "https://t.me/jetsetnotis",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "IATA Accreditation",
        recognizedBy: {
          "@type": "Organization",
          name: "International Air Transport Association",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={orgSchema} />
      {/* Hero */}
      <section className="relative bg-brand-navy text-white min-h-[320px] sm:min-h-[380px] flex items-center overflow-hidden">
        <Image
          src="/images/services/about.jpg"
          alt="JetSet Travel office in Paphos, Cyprus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative w-full py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
              {t("heroLabel")}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story — two columns */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1">
              <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
                {t("storyLabel")}
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-6">
                {t("storyTitle")}
              </h2>
              <div className="space-y-4 text-brand-navy/70 leading-relaxed">
                <p>
                  {t("storyP1")}
                </p>
                <p>
                  {t("storyP2")}
                </p>
                <p>
                  {t("storyP3")}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/paphos-cityscape.jpg"
                  alt={t("storyImageAlt")}
                  width={800}
                  height={450}
                  className="object-cover w-full h-full rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("accreditationsTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("accreditationsSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* IATA Badge */}
            <div className="flex flex-col items-center text-center p-5 sm:p-6 md:p-8 rounded-2xl bg-white border border-brand-navy/10 hover:shadow-luxury transition-shadow">
              <div className="w-24 h-24 relative mb-6">
                <Image
                  src="/images/iata-logo.jpg"
                  alt="IATA Accredited Agent"
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">
                {t("iataTitle")}
              </h3>
              <p className="text-brand-navy/60 text-sm leading-relaxed">
                {t("iataDescription")}
              </p>
            </div>

            {/* Tourism License */}
            <div className="flex flex-col items-center text-center p-5 sm:p-6 md:p-8 rounded-2xl bg-white border border-brand-navy/10 hover:shadow-luxury transition-shadow">
              <div className="w-24 h-24 relative mb-6">
                <Image
                  src="/images/tourism-logo.jpg"
                  alt="Cyprus Tourism Organisation Licensed"
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">
                {t("ctoTitle")}
              </h3>
              <p className="text-brand-navy/60 text-sm leading-relaxed">
                {t("ctoDescription")}
              </p>
            </div>

            {/* 20 Years Badge */}
            <div className="flex flex-col items-center text-center p-5 sm:p-6 md:p-8 rounded-2xl bg-white border border-brand-navy/10 hover:shadow-luxury transition-shadow">
              <div className="w-24 h-24 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                <span className="text-brand-gold font-display text-3xl font-bold">
                  20+
                </span>
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">
                {t("yearsTitle")}
              </h3>
              <p className="text-brand-navy/60 text-sm leading-relaxed">
                {t("yearsDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("valuesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("valuesSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="group p-6 sm:p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {value.title}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("teamTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("teamSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-brand-navy/10 overflow-hidden hover:shadow-luxury transition-shadow"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={450}
                    height={600}
                    className="object-cover object-top w-full h-full"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-brand-navy mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-gold text-sm font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-brand-navy/60 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("milestonesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("milestonesSubtitle")}
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-brand-gold/20" />
            {[
              { year: t("milestone1Year"), title: t("milestone1Title"), desc: t("milestone1Desc") },
              { year: t("milestone2Year"), title: t("milestone2Title"), desc: t("milestone2Desc") },
              { year: t("milestone3Year"), title: t("milestone3Title"), desc: t("milestone3Desc") },
              { year: t("milestone4Year"), title: t("milestone4Title"), desc: t("milestone4Desc") },
              { year: t("milestone5Year"), title: t("milestone5Title"), desc: t("milestone5Desc") },
            ].map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                  index % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 sm:left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-gold border-4 border-white z-10 mt-1" />
                {/* Content card */}
                <div className={`ml-12 sm:ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:ml-auto"
                }`}>
                  <span className="text-brand-gold font-display text-2xl font-bold">
                    {milestone.year}
                  </span>
                  <h3 className="text-lg font-bold text-brand-navy mt-1 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-brand-navy/60 text-sm leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Info */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("officeTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("officeSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-gold/10 text-brand-gold flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-brand-navy mb-1">{t("officeAddress")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-gold/10 text-brand-gold flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-brand-navy">{t("officePhone1")}</p>
                  <p className="text-brand-navy/60">{t("officePhone2")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-gold/10 text-brand-gold flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-brand-navy">{t("officeEmail")}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-gold/10 text-brand-gold flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-brand-navy mb-2">{t("officeHoursTitle")}</p>
                  <div className="space-y-1 text-sm text-brand-navy/70">
                    <p>{t("officeSchedule")}</p>
                    <p>{t("officeScheduleWed")}</p>
                    <p>{t("officeScheduleSat")}</p>
                    <p>{t("officeScheduleSun")}</p>
                    <p className="text-brand-gold font-medium mt-2">{t("officeWhatsApp")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <ServicesCrossLinks locale={locale} include={["corporate", "contact", "paphos"]} />

      {/* CTA */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              {t("ctaContact")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/quote`}
              className="inline-flex items-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {t("ctaQuote")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

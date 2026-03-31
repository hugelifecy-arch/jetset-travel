import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
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
} from "lucide-react";
import CTABanner from "@/components/sections/CTABanner";
import GoogleReviews from "@/components/sections/GoogleReviews";
import ServiceSchema from "@/components/seo/ServiceSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const crossLocalePaths = {
    en: "/paphos-travel-agency",
    ru: "/turisticheskoe-agentstvo-pafos",
  };

  if (locale === "en") {
    return buildPageMetadata({
      locale: "en",
      routePath: "/paphos-travel-agency",
      title: "Travel Agency in Paphos, Cyprus | JetSet Travel — IATA Accredited Agent",
      description:
        "Looking for a trusted travel agency in Paphos? JetSet Travel is IATA accredited with 20+ years experience. Corporate travel, flights, hotels, visa services. Visit us at 26A Agapinoros.",
      keywords: ["travel agent Paphos Cyprus", "best travel agency in Paphos", "IATA travel agent Paphos", "travel agency Paphos Cyprus", "corporate travel agency Paphos"],
      languagePaths: crossLocalePaths,
    });
  }

  return buildPageMetadata({
    locale: "ru",
    routePath: "/turisticheskoe-agentstvo-pafos",
    title:
      "Турагентство в Пафосе, Кипр | JetSet Travel — Аккредитация IATA",
    description:
      "Ищете надёжное турагентство в Пафосе? JetSet Travel — аккредитация IATA, более 20 лет опыта. Корпоративные поездки, авиабилеты, отели, визовые услуги. Ул. Агапинорос, 26А.",
    keywords: ["турагентство Пафос", "турагентство с IATA Пафос", "лучшее турагентство в Пафосе для бизнеса", "туристическое агентство Пафос Кипр", "корпоративное турагентство Кипр"],
    languagePaths: crossLocalePaths,
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


export default async function TuristicheskoeAgentstvoPafosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === "en") {
    redirect("/en/paphos-travel-agency");
  }

  const t = await getTranslations({ locale, namespace: "turistAgentPage" });

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
                Получить предложение
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Почему Выбирают JetSet в Пафосе */}
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

      {/* Наши Услуги в Пафосе */}
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

      {/* Как Нас Найти */}
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
                title="Офис JetSet Travel в Пафосе"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d550.9363089741603!2d32.41889941969174!3d34.76763619960539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14e706ec2d62587f%3A0x4161901d9b64e1b4!2sJetSet%20Travel%20Agency%20-%20Paphos!5e1!3m2!1sen!2s!4v1774692196854!5m2!1sen!2s"
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
                    <a href="mailto:info@jetset.com.cy" className="hover:text-brand-gold transition-colors">
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

      {/* Google Reviews via Elfsight */}
      <GoogleReviews />

      {/* CTA with Quote Form */}
      <CTABanner />

      {/* Structured Data */}
      <ServiceSchema
        locale={locale}
        name="Турагентство в Пафосе, Кипр — JetSet Travel"
        description="Аккредитованное IATA турагентство в Пафосе, Кипр с более чем 20-летним опытом. Корпоративные поездки, авиабилеты, бронирование отелей, визовые услуги и круизы. Ул. Агапинорос, 26А, 8049 Пафос."
        url="https://www.jetset-travel.com/ru/turisticheskoe-agentstvo-pafos"
      />
    </>
  );
}

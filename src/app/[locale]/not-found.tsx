import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import {
  Home,
  Briefcase,
  Mail,
  FileText,
  BookOpen,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

function getLocaleFromHeaders(headersList: Headers): string {
  const pathname =
    headersList.get("x-next-url") ??
    headersList.get("x-invoke-path") ??
    headersList.get("referer") ??
    "";
  if (pathname.includes("/ru")) return "ru";
  return "en";
}

export default async function NotFound() {
  const headersList = await headers();
  const locale = getLocaleFromHeaders(headersList);
  const t = await getTranslations({ locale, namespace: "notFound" });

  const whatsappText =
    locale === "ru"
      ? encodeURIComponent(
          "Здравствуйте, JetSet! Мне нужна помощь с организацией поездки."
        )
      : encodeURIComponent("Hi JetSet, I need help");

  const links = [
    {
      href: `/${locale}`,
      icon: Home,
      title: t("homepage"),
      description: t("homepageDesc"),
    },
    {
      href: `/${locale}/services`,
      icon: Briefcase,
      title: t("services"),
      description: t("servicesDesc"),
    },
    {
      href: `/${locale}/contact`,
      icon: Mail,
      title: t("contact"),
      description: t("contactDesc"),
    },
    {
      href: `/${locale}/quote`,
      icon: FileText,
      title: t("quote"),
      description: t("quoteDesc"),
    },
    {
      href: `/${locale}/blog`,
      icon: BookOpen,
      title: t("blog"),
      description: t("blogDesc"),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-display text-8xl md:text-9xl font-bold text-brand-gold/20 select-none mb-4">
            {t("errorCode")}
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-brand-gold font-semibold mb-6">
            {t("subtitle")}
          </p>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
      </section>

      {/* Helpful Links */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy text-center mb-12">
            {t("linksTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-start gap-4 p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex-shrink-0 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <link.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy group-hover:text-brand-gold transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-brand-navy/60 mt-1">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle className="h-10 w-10 text-[#25D366] mx-auto mb-4" />
          <p className="text-lg md:text-xl font-semibold text-brand-navy mb-6">
            {t("whatsappCta")}
          </p>
          <a
            href={`https://wa.me/35799478073?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#20BD5A] transition-colors"
          >
            {t("whatsappButton")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}

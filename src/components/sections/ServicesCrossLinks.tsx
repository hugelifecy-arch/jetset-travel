import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Plane,
  Hotel,
  FileText,
  Palmtree,
  Briefcase,
  Ship,
  Phone,
  Info,
  MapPin,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ServiceKey =
  | "corporate"
  | "luxury"
  | "hotels"
  | "visa"
  | "flights"
  | "cruises"
  | "contact"
  | "about"
  | "paphos";

interface ServiceLink {
  key: ServiceKey;
  href: string | ((locale: string) => string);
  icon: LucideIcon;
}

const allServices: ServiceLink[] = [
  { key: "corporate", href: "/corporate-travel", icon: Briefcase },
  { key: "luxury", href: "/luxury-travel/", icon: Palmtree },
  { key: "cruises", href: "/cruises", icon: Ship },
  { key: "hotels", href: "/hotel-reservations", icon: Hotel },
  { key: "visa", href: "/visa-services", icon: FileText },
  { key: "flights", href: (locale: string) => locale === "ru" ? "/aviabilety-kipr" : "/flight-tickets-cyprus", icon: Plane },
  { key: "contact", href: "/contact", icon: Phone },
  { key: "about", href: "/about", icon: Info },
  { key: "paphos", href: (locale: string) => locale === "ru" ? "/turisticheskoe-agentstvo-pafos" : "/paphos-travel-agency", icon: MapPin },
];

const servicesByKey = new Map(allServices.map((s) => [s.key, s]));

export default async function ServicesCrossLinks({
  locale,
  exclude,
  include,
}: {
  locale: string;
  exclude?: string;
  include?: ServiceKey[];
}) {
  const t = await getTranslations({ locale, namespace: "services" });

  const services = include
    ? include.map((k) => servicesByKey.get(k)).filter(Boolean) as ServiceLink[]
    : allServices.filter((s) => s.key !== exclude).slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            {t("exploreMore")}
          </h2>
          <p className="text-brand-navy/60 max-w-2xl mx-auto">
            {t("exploreMoreSubtitle")}
          </p>
        </div>
        <div className={`grid grid-cols-1 gap-8 ${services.length === 2 ? "sm:grid-cols-2 max-w-4xl mx-auto" : "sm:grid-cols-3"}`}>
          {services.map((service) => {
            const resolvedHref = typeof service.href === "function" ? service.href(locale) : service.href;
            return (
            <Link
              key={service.key}
              href={`/${locale}${resolvedHref}`}
              className="group p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">
                {t(`${service.key}.title`)}
              </h3>
              <p className="text-brand-navy/60 text-sm leading-relaxed mb-4">
                {t(`${service.key}.description`)}
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-brand-gold group-hover:gap-2 transition-all">
                {t(`${service.key}.cta`)}
                <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          );
          })}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

/*
 * Homepage "VIP & luxury" band (Oct 2026 UX audit, item 14): the home page
 * spoke mainly to corporate buyers; this gives luxury and VIP visitors a
 * clear path to the VIP services page and the luxury trip request.
 * Items mirror owner-confirmed services only.
 */
const ITEMS = ["item1", "item2", "item3", "item4", "item5", "item6"] as const;

export default function VipLuxurySection() {
  const locale = useLocale();
  const t = useTranslations("homeVip");

  return (
    <section className="bg-brand-navy py-20 text-white sm:py-24" aria-labelledby="home-vip-title">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
          <Image
            src="/images/vip/aphrodite-rock-paphos.jpg"
            alt={t("imageAlt")}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold">{t("label")}</p>
          <h2 id="home-vip-title" className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/85">{t("text")}</p>
          <ul className="mt-8 grid list-none gap-3 p-0 sm:grid-cols-2">
            {ITEMS.map((k) => (
              <li key={k} className="flex items-start gap-2.5 text-white/90">
                <Check className="mt-0.5 h-5 w-5 flex-none text-brand-gold" aria-hidden="true" />
                <span>{t(k)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/vip-services`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90"
            >
              {t("cta")}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={`/${locale}/quote?type=luxury`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

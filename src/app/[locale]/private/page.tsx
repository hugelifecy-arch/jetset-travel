import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { buildPageMetadata, SERVICE_LAST_UPDATED } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import PrivateIntroductionForm from "./PrivateIntroductionForm";

/*
 * Private & Family Office Travel — deliberately quieter than the rest of
 * the site. Per the page spec: no quote CTAs, no budget dropdowns, no
 * urgency badges, no emojis, minimal accent colour. Dark navy palette,
 * generous whitespace, exactly two CTA styles ("Request an introduction",
 * "Call the principal").
 *
 * Imagery: hero and marine slots use the best licensed low-key images in
 * the repo (dusk skyline, blue-hour Mediterranean), heavily darkened and
 * desaturated to stay quiet. The only aircraft photo in the repo is a
 * branded commercial airliner — wrong register for private aviation, so:
 * TODO(images): supply one licensed dark/low-saturation private-jet image
 * (cabin or apron at dusk) for the aviation divider band above "Scope";
 * it currently uses an elegant dark gradient block.
 *
 * Name spellings confirmed by the owner (2026-07): EN "Nontari
 * Kalaitsidis", EL "Νοντάρι Καλαϊτσίδης", RU "Нодари Калаицидис".
 */

const PHONE_DISPLAY = "+357 99 478073";
const PHONE_HREF = "tel:+35799478073";
const WHATSAPP_HREF = "https://wa.me/35799478073";
const EMAIL = "info@jetset.com.cy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/private",
    title:
      locale === "ru"
        ? "Тревел-услуги для частных клиентов и семейных офисов на Кипре | JetSet Travel"
        : "Private & Family Office Travel Services in Cyprus | JetSet Travel",
    description:
      locale === "ru"
        ? "Конфиденциальное управление поездками для частных клиентов, семей и семейных офисов на Кипре. Частная авиация, яхты, VIP-услуги. Лимассол и Пафос."
        : "Discreet, principal-led travel management for private clients, families and family offices in Cyprus. Private aviation, yacht charter, VIP airport services, consolidated billing. Limassol & Paphos.",
  });
}

export default async function PrivateClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privatePage" });
  const tForms = await getTranslations({ locale, namespace: "forms" });

  const pillars = [1, 2, 3].map((i) => ({
    title: t(`pillar${i}Title`),
    body: t(`pillar${i}Body`),
  }));

  const scope = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
    title: t(`scope${i}Title`),
    description: t(`scope${i}Desc`),
  }));

  const officeModel = [1, 2, 3, 4].map((i) => ({
    title: t(`office${i}Title`),
    description: t(`office${i}Desc`),
  }));

  const cases = [1, 2, 3].map((i) => t(`case${i}`));

  const steps = [1, 2, 3, 4].map((i) => ({
    title: t(`step${i}Title`),
    description: t(`step${i}Desc`),
  }));

  return (
    <div className="bg-brand-dark text-white">
      {/* Hero — dusk skyline, darkened and desaturated to a quiet backdrop */}
      <section className="relative overflow-hidden bg-brand-dark">
        <Image
          src="/images/luxury/dubai.jpg"
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover opacity-40 saturate-50"
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/40 to-brand-dark"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.08),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-5xl px-4 py-28 sm:px-6 lg:px-8 lg:py-44">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.25em] text-brand-gold/80">
            {t("heroEyebrow")}
          </p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/60 lg:text-xl">
            {t("heroSubtitle")}
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#introduction"
              className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90"
            >
              {t("ctaPrimary")}
            </a>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
      </section>

      {/* Discretion — three pillars */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <h2 className="font-display text-3xl sm:text-4xl">
            {t("discretionTitle")}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
            {t("discretionIntro")}
          </p>
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <h3 className="text-base font-semibold text-white">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal-led */}
      <section className="border-t border-white/10 bg-brand-navy/40">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <h2 className="font-display text-3xl sm:text-4xl">
            {t("principalTitle")}
          </h2>
          <div className="mt-8 max-w-3xl space-y-6 text-lg leading-relaxed text-white/60">
            <p>{t("principalBody1")}</p>
            <p>{t("principalBody2")}</p>
          </div>
          <div className="mt-10 flex items-center gap-5">
            <Image
              src="/images/nontari-kalaitsidis.jpg"
              alt={`${t("principalName")} — ${t("principalRole")}`}
              width={64}
              height={64}
              loading="lazy"
              className="h-16 w-16 rounded-full object-cover saturate-[.85]"
            />
            <p className="text-sm tracking-wide text-white/50">
              {t("principalName")} · {t("principalRole")} ·{" "}
              <a
                href={PHONE_HREF}
                className="transition-colors hover:text-brand-gold"
              >
                {PHONE_DISPLAY}
              </a>{" "}
              ·{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="transition-colors hover:text-brand-gold"
              >
                {EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* TODO(images): aviation divider band — gradient until the owner
          supplies a licensed private-jet image (see header comment) */}
      <div
        aria-hidden="true"
        className="h-40 border-t border-white/10 bg-gradient-to-r from-brand-dark via-brand-navy to-brand-dark md:h-56"
      />

      {/* Scope of services */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <h2 className="font-display text-3xl sm:text-4xl">
            {t("scopeTitle")}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
            {t("scopeIntro")}
          </p>
          <dl className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {scope.map((item) => (
              <div key={item.title}>
                <dt className="text-base font-semibold text-white">
                  {item.title}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/60">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Family office operating model */}
      <section className="border-t border-white/10 bg-brand-navy/40">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <h2 className="font-display text-3xl sm:text-4xl">
            {t("officeTitle")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/60">
            {t("officeIntro")}
          </p>
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
            {officeModel.map((item) => (
              <div key={item.title}>
                <h3 className="text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marine divider band — blue-hour Mediterranean, darkened */}
      <div
        aria-hidden="true"
        className="relative h-40 overflow-hidden border-t border-white/10 md:h-56"
      >
        <Image
          src="/images/destinations/med.jpg"
          alt=""
          fill
          loading="lazy"
          className="object-cover object-center opacity-35 saturate-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-transparent to-brand-dark/60" />
      </div>

      {/* Selected situations */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <h2 className="font-display text-3xl sm:text-4xl">
            {t("casesTitle")}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
            {t("casesIntro")}
          </p>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {cases.map((body, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-8"
              >
                <p className="text-sm leading-relaxed text-white/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional intermediaries */}
      <section className="border-t border-white/10 bg-brand-navy/40">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <h2 className="font-display text-3xl sm:text-4xl">
            {t("intermediariesTitle")}
          </h2>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/60">
            {t("intermediariesBody")}
          </p>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/80">
            {t("intermediariesLine")}
          </p>
        </div>
      </section>

      {/* How engagement works */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <h2 className="font-display text-3xl sm:text-4xl">
            {t("engagementTitle")}
          </h2>
          <ol className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span
                  aria-hidden="true"
                  className="font-display text-2xl text-brand-gold/60"
                >
                  {index + 1}
                </span>
                <h3 className="mt-3 text-base font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* References note */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-sm leading-relaxed text-white/50">
            {t("referencesNote")}
          </p>
        </div>
      </section>

      {/* Contact / Request an introduction */}
      <section
        id="introduction"
        className="scroll-mt-20 border-t border-white/10 bg-brand-navy/40"
      >
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <h2 className="font-display text-3xl sm:text-4xl">
            {t("contactTitle")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {t("contactBody")}
          </p>
          <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <PrivateIntroductionForm
                labels={{
                  name: t("formName"),
                  organisation: t("formOrg"),
                  email: t("formEmail"),
                  phone: t("formPhone"),
                  method: t("formMethod"),
                  methodPhone: t("formMethodPhone"),
                  methodEmail: t("formMethodEmail"),
                  methodWhatsApp: t("formMethodWhatsApp"),
                  message: t("formMessage"),
                  optional: t("formOptional"),
                  submit: t("formSubmit"),
                  submitting: t("formSubmitting"),
                  success: t("formSuccess"),
                  error: t("formError"),
                  required: tForms("required"),
                  invalidEmail: tForms("invalidEmail"),
                }}
              />
            </div>
            {/* Direct contact block */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                <p className="text-base font-semibold text-white">
                  {t("principalName")} — {t("principalRole")}
                </p>
                <div className="mt-5 space-y-2.5 text-sm text-white/70">
                  <p>
                    <a
                      href={PHONE_HREF}
                      className="transition-colors hover:text-brand-gold"
                    >
                      {PHONE_DISPLAY}
                    </a>
                    {" · "}
                    <a
                      href={WHATSAPP_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-brand-gold"
                    >
                      WhatsApp
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="transition-colors hover:text-brand-gold"
                    >
                      {EMAIL}
                    </a>
                  </p>
                  <p className="text-white/50">{t("directLocation")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet footer note */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-xs leading-relaxed text-white/40">
            {t("footerNote")}
          </p>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Private & Family Office Travel",
          description:
            "Discreet, principal-led travel management for private clients, families and family offices in Cyprus. Private aviation, yacht charter, VIP airport services, consolidated billing.",
          url: `https://www.jetset-travel.com/${locale}/private`,
          serviceType: "Private & Family Office Travel Management",
          dateModified: SERVICE_LAST_UPDATED,
          provider: {
            "@id": "https://www.jetset-travel.com/#organization",
          },
          // Per the page spec: areaServed Cyprus, and no priceRange / offers.
          areaServed: { "@type": "Country", name: "Cyprus" },
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: `https://www.jetset-travel.com/${locale}/private`,
            servicePhone: "+357-99-478-073",
            availableLanguage: [
              { "@type": "Language", name: "English" },
              { "@type": "Language", name: "Greek" },
              { "@type": "Language", name: "Russian" },
            ],
          },
        }}
      />
    </div>
  );
}

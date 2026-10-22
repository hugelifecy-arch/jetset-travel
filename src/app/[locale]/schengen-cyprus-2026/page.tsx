import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { buildPageMetadata, CANONICAL_ORIGIN } from "@/lib/seo";
import { ArrowRight, FileText, Briefcase, Calendar, ShieldCheck, Plane, MapPin } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import CTABanner from "@/components/sections/CTABanner";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";

/**
 * Cyprus + Schengen topic hub (Phase 7 — Step 56). Status facts re-verified 22 Oct 2026.
 *
 * Pillar page for the Schengen-accession cluster surfaced by GSC: the
 * +143% impressions surge on /en/blog/schengen-visa-guide-cyprus-residents,
 * the newly-ranking /en/blog/cyprus-schengen-2026-business-travel, and
 * their Russian counterparts. Before this hub these posts had ≤2 inbound
 * internal links each, so Google was sending real traffic to URLs the
 * site itself signalled as low-priority.
 *
 * Bidirectional linking pattern:
 *  hub ↔ /visa-services       (visa-services already carries the cluster
 *                              tags in its RelatedArticles block)
 *  hub ↔ /corporate-travel    (B2B angle on accession)
 *  hub →  4 cluster blog posts (EN + RU)
 *  hub ←  in-body contextual link from each high-authority service page
 *         (Step 57; added in the same commit)
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    routePath: "/schengen-cyprus-2026",
    title:
      locale === "ru"
        ? "Кипр в Шенгене? Статус на октябрь 2026 и сроки (2027)"
        : "Is Cyprus in Schengen? EU Vote & 2027 Timeline (Oct 2026)",
    description:
      locale === "ru"
        ? "Пока нет. На октябрь 2026 года Кипр вне Шенгенской зоны, вступление ожидается в 2027 году. Что это значит для правила 90/180, виз, EES и ETIAS."
        : "Not yet. In October 2026 Cyprus is still outside Schengen and now expects to join in 2027. What it means for the 90/180-day rule, visas, EES and ETIAS.",
    keywords:
      locale === "ru"
        ? [
            "Кипр Шенген 2026",
            "когда Кипр войдет в Шенген",
            "вступление Кипра в Шенген",
            "шенген Кипр",
            "Cyprus Schengen 2026",
          ]
        : [
            "Cyprus Schengen 2026",
            "is Cyprus in Schengen",
            "Cyprus Schengen accession",
            "Schengen Cyprus business travel",
            "Cyprus joining Schengen",
          ],
  });
}

interface ClusterLink {
  href: string;
  title: string;
  description: string;
  badge?: string;
}

export default async function SchengenCyprus2026Hub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === "ru";

  const hubUrl = `${CANONICAL_ORIGIN}/${locale}/schengen-cyprus-2026`;

  const clusterPosts: ClusterLink[] = isRu
    ? [
        {
          href: `/${locale}/blog/kipr-v-shengene-2026-delovye-poezdki`,
          title: "Кипр и Шенген: статус на октябрь 2026 — гид для деловых поездок",
          description:
            "Гид для корпоративных тревел-менеджеров: что действует сейчас, что изменится после вступления, правило 90/180 и политика командировок.",
          badge: "Гид",
        },
        {
          href: `/${locale}/blog/shengenskaya-viza-dlya-zhitelej-kipra`,
          title: "Шенгенская виза для жителей Кипра: пошаговое руководство 2026",
          description:
            "Полный гид по оформлению Шенгенской визы для резидентов Кипра: документы, сроки, требования консульств.",
          badge: "Виза",
        },
      ]
    : [
        {
          href: `/${locale}/blog/cyprus-schengen-2026-business-travel`,
          title: "Cyprus Schengen Status (October 2026): Business Travel Guide",
          description:
            "What applies now, what changes after accession, the 90/180-day rule, and how corporate travel managers should prepare.",
          badge: "Business",
        },
        {
          href: `/${locale}/blog/schengen-visa-guide-cyprus-residents`,
          title: "Complete Schengen Visa Guide for Cyprus Residents",
          description:
            "Documents, processing timelines, consulate requirements and how IATA agents streamline approval for non-EU residents.",
          badge: "Visa",
        },
      ];

  const serviceLinks: ClusterLink[] = isRu
    ? [
        {
          href: `/${locale}/visa-services`,
          title: "Визовые услуги",
          description:
            "Шенген, UK, US — подготовка документов и сопровождение от IATA-аккредитованного агентства.",
        },
        {
          href: `/${locale}/corporate-travel`,
          title: "Корпоративные поездки",
          description:
            "Тревел-программы для B2B: подготовка политики командировок к вступлению Кипра в Шенген.",
        },
      ]
    : [
        {
          href: `/${locale}/visa-services`,
          title: "Visa Services",
          description:
            "Schengen, UK, and US visa support — document preparation from an IATA-accredited agency.",
        },
        {
          href: `/${locale}/corporate-travel`,
          title: "Corporate Travel",
          description:
            "B2B travel programmes — get your corporate travel policy ready for Cyprus joining Schengen.",
        },
      ];

  /* Verified 22 Oct 2026 against the sources listed under "Short answer".
     Update STATUS_DATE and these entries together when the status changes. */
  const milestones = isRu
    ? [
        {
          when: "2023",
          what: "Кипр начинает использовать Шенгенскую информационную систему (SIS) — один из технических шагов к вступлению.",
        },
        {
          when: "Октябрь 2025",
          what: "В 29 странах Шенгена запускается система въезда/выезда ЕС (EES). Кипр её не использует: паспорта по-прежнему штампуются вручную.",
        },
        {
          when: "10 октября 2026",
          what: "Заместитель министра по вопросам миграции: Кипр рассчитывает полностью вступить в Шенген в течение 2027 года; оставшиеся шесть мер планируется завершить к началу ноября 2026.",
        },
        {
          when: "IV квартал 2026 (ожидается)",
          what: "Запуск ETIAS — электронного разрешения на въезд для безвизовых путешественников в 30 европейских стран, включая Кипр (20 евро). Точную дату ЕС объявит заранее.",
        },
        {
          when: "Далее",
          what: "Кипр уведомляет Еврокомиссию о технической готовности; решение принимает Совет ЕС единогласно. Дата не назначена; главный спорный вопрос — контроль на линии разграничения (Зелёной линии).",
        },
        {
          when: "2027 (ожидается)",
          what: "Полноправное членство в Шенгене: проверки на рейсах между Кипром и странами Шенгена отменяются с даты, указанной в решении Совета.",
        },
      ]
    : [
        {
          when: "2023",
          what: "Cyprus starts using the Schengen Information System (SIS), one of the technical steps towards accession.",
        },
        {
          when: "October 2025",
          what: "The EU Entry/Exit System (EES) starts in the 29 Schengen countries. Cyprus does not use it: passports are still stamped by hand.",
        },
        {
          when: "10 October 2026",
          what: "Deputy Migration Minister: Cyprus expects to join Schengen in full during 2027, after completing six remaining actions by early November 2026.",
        },
        {
          when: "Q4 2026 (expected)",
          what: "ETIAS travel authorisation starts for visa-exempt visitors to 30 European countries, Cyprus included (EUR 20). The EU will announce the exact date in advance.",
        },
        {
          when: "Next",
          what: "Cyprus notifies the European Commission that it is technically ready; the EU Council then decides by unanimity. No date has been set; the main open issue is checks at the Green Line.",
        },
        {
          when: "2027 (expected)",
          what: "Full Schengen membership: checks on flights between Cyprus and Schengen countries end from the date set in the Council decision.",
        },
      ];

  const STATUS_DATE = isRu ? "22 октября 2026" : "22 October 2026";
  const sources = [
    {
      href: "https://cyprus-mail.com/2026/10/10/cyprus-to-be-fully-integrated-into-schengen-area-by-next-year",
      label: isRu ? "Cyprus Mail, 10.10.2026 — заявление заместителя министра" : "Cyprus Mail, 10 Oct 2026 — Deputy Minister's statement",
    },
    {
      href: "https://travel-europe.europa.eu/ees/what-is-the-ees",
      label: isRu ? "ЕС: страны, использующие EES" : "EU: countries using the EES",
    },
    {
      href: "https://travel-europe.europa.eu/etias/about-etias/who-should-apply",
      label: isRu ? "ЕС: кому нужен ETIAS" : "EU: who needs ETIAS",
    },
    {
      href: "https://cyprusinuk.com/visa-information/",
      label: isRu ? "Высокая комиссия Кипра в Лондоне: въезд по шенгенской визе" : "Cyprus High Commission (UK): entry with a Schengen visa",
    },
  ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${hubUrl}#collection`,
    name: isRu
      ? "Кипр и Шенген — статус и сроки вступления"
      : "Cyprus and Schengen — status and timeline",
    url: hubUrl,
    dateModified: "2026-10-22",
    inLanguage: isRu ? "ru-RU" : "en-GB",
    isPartOf: { "@id": `${CANONICAL_ORIGIN}#website` },
    about: [
      { "@type": "Country", name: "Cyprus" },
      { "@type": "Thing", name: "Schengen Area" },
    ],
    hasPart: clusterPosts.map((p) => ({
      "@type": "WebPage",
      url: `${CANONICAL_ORIGIN}${p.href}`,
      name: p.title,
    })),
  };

  return (
    <>
      <JsonLd data={collectionSchema} />

      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
            {isRu ? "Статус на " + STATUS_DATE : "Status as of " + STATUS_DATE}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {isRu
              ? "Кипр в Шенгене? Статус в 2026 году"
              : "Is Cyprus in Schengen? Status in 2026"}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {isRu
              ? "Что действует сейчас и что изменится после вступления — для жителей, бизнес-путешественников и корпоративных тревел-менеджеров. От IATA-аккредитованного агентства."
              : "What applies today and what will change after accession — for residents, business travellers and corporate travel managers. From an IATA-accredited agency."}
          </p>
        </div>
      </section>

      {/* Short answer: the question people search for, answered first */}
      <section className="py-14 lg:py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/5 p-6 sm:p-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy">
              {isRu ? "Коротко: пока нет" : "Short answer: not yet"}
            </h2>
            <p className="mt-3 text-brand-navy/80 leading-relaxed">
              {isRu
                ? "Кипр — член ЕС, но пока не входит в Шенгенскую зону; вне её остаются только Кипр и Ирландия. 10 октября 2026 года заместитель министра по вопросам миграции Николас Иоаннидис заявил, что Кипр рассчитывает полностью вступить в Шенген в течение 2027 года. Дата решения Совета ЕС, для которого нужно единогласное согласие стран ЕС, уже входящих в Шенген, не назначена."
                : "Cyprus is an EU member but not yet part of the Schengen Area; it and Ireland are the only EU countries outside it. On 10 October 2026 Deputy Migration Minister Nicholas Ioannides said Cyprus expects to join Schengen in full during 2027. No date has been set for the EU Council decision, which needs the unanimous agreement of the EU countries already in Schengen."}
            </p>
            <h3 className="mt-6 font-semibold text-brand-navy">
              {isRu ? "Что это значит сегодня" : "What this means today"}
            </h3>
            <ul className="mt-3 space-y-2 list-disc pl-5 text-brand-navy/80 leading-relaxed">
              {(isRu
                ? [
                    "На рейсах между Кипром и странами Шенгена по-прежнему проходят паспортный контроль.",
                    "Дни на Кипре не засчитываются в шенгенский лимит 90 из 180 дней: краткосрочное пребывание на Кипре считается отдельно.",
                    "С действующей двукратной или многократной шенгенской визой можно въехать на Кипр без кипрской визы — до 90 дней в любые 180 дней (кроме граждан Турции и Азербайджана).",
                    "Система EES на Кипре не используется: паспорта штампуются вручную.",
                    "Кипрский вид на жительство не заменяет шенгенскую визу: если вашему гражданству нужна виза в Шенген, она нужна и сейчас.",
                    "ETIAS (ожидается в IV квартале 2026, 20 евро) будет распространяться и на Кипр. Владельцам кипрского ВНЖ из безвизовых стран (включая граждан Великобритании, живущих на Кипре по Соглашению о выходе) ETIAS понадобится для поездок в другие страны, но не для возвращения на Кипр.",
                  ]
                : [
                    "Flights between Cyprus and Schengen countries still have passport checks.",
                    "Days in Cyprus do not count towards the Schengen 90-in-180-day limit; short stays in Cyprus are counted separately.",
                    "With a valid double- or multiple-entry Schengen visa you can enter Cyprus without a Cyprus visa, for up to 90 days in any 180 (not for citizens of Turkey and Azerbaijan).",
                    "The EES is not used in Cyprus: passports are stamped by hand.",
                    "A Cyprus residence permit does not replace a Schengen visa: if your nationality needs one for Schengen, you still need it today.",
                    "ETIAS (expected in Q4 2026, EUR 20) will also cover Cyprus. Visa-exempt holders of a Cyprus residence permit, UK nationals living here under the Withdrawal Agreement included, will need ETIAS for trips to other European countries, but not to return to Cyprus.",
                  ]
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-brand-navy/70">
              {isRu ? "Проверено " + STATUS_DATE + ". Источники: " : "Checked " + STATUS_DATE + ". Sources: "}
              {sources.map((src, i) => (
                <span key={src.href}>
                  <a
                    href={src.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-brand-navy hover:text-brand-gold-ink"
                  >
                    {src.label}
                  </a>
                  {i < sources.length - 1 ? "; " : "."}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* Milestone timeline */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-8 text-center">
            {isRu ? "Хронология и ожидаемые сроки" : "Timeline and expected dates"}
          </h2>
          <ol className="space-y-4">
            {milestones.map((m, i) => (
              <li
                key={i}
                className="flex gap-4 p-5 rounded-xl border border-brand-navy/10 bg-brand-light"
              >
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">
                    {m.when}
                  </p>
                  <p className="text-sm text-brand-navy/70 mt-1">{m.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cluster posts */}
      <section className="py-16 lg:py-20 bg-brand-light">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-3 text-center">
            {isRu ? "Подробные гиды" : "In-depth guides"}
          </h2>
          <p className="text-brand-navy/70 text-center mb-10 max-w-2xl mx-auto">
            {isRu
              ? "Подробные материалы по каждому аспекту вступления Кипра в Шенген — обновляются по мере появления новой информации."
              : "Deep-dives on every angle of Cyprus's Schengen accession — kept up to date as new information emerges."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clusterPosts.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group flex flex-col p-6 rounded-2xl bg-white border border-brand-navy/10 hover:border-brand-gold/40 hover:shadow-luxury transition-all"
              >
                {p.badge && (
                  <span className="inline-block self-start text-xs uppercase tracking-wider font-semibold text-brand-gold-ink bg-brand-gold/10 px-2.5 py-1 rounded-full mb-3">
                    {p.badge}
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-brand-navy leading-snug">
                  {p.title}
                </h3>
                <p className="text-sm text-brand-navy/70 mt-2 leading-relaxed">
                  {p.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-navy group-hover:text-brand-gold transition-colors">
                  {isRu ? "Читать гид" : "Read the guide"}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Service interlinks */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-3 text-center">
            {isRu ? "Связанные услуги JetSet" : "Related JetSet services"}
          </h2>
          <p className="text-brand-navy/70 text-center mb-10 max-w-2xl mx-auto">
            {isRu
              ? "Готовитесь к вступлению Кипра в Шенген? Эти услуги помогут подготовиться заранее."
              : "Preparing for Cyprus joining Schengen? These services help you get ahead now."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceLinks.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex items-start gap-4 p-6 rounded-2xl border border-brand-navy/10 bg-brand-light hover:border-brand-gold/40 transition-colors"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                  {s.href.includes("visa") ? (
                    <FileText className="h-5 w-5 text-brand-gold" />
                  ) : (
                    <Briefcase className="h-5 w-5 text-brand-gold" />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-navy">
                    {s.title}
                  </h3>
                  <p className="text-sm text-brand-navy/70 mt-1.5 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* In-body anchor links so the hub also passes equity to flights/hotels */}
          <div className="mt-10 p-6 rounded-xl bg-brand-light border border-brand-navy/10">
            <h3 className="font-display text-lg font-bold text-brand-navy flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-gold" />
              {isRu ? "Планируете поездку?" : "Planning a trip?"}
            </h3>
            <p className="text-sm text-brand-navy/70 mt-2 leading-relaxed">
              {isRu ? (
                <>
                  Мы помогаем с{" "}
                  <Link
                    href={`/${locale}/aviabilety-kipr`}
                    className="text-brand-navy font-semibold underline hover:text-brand-gold"
                  >
                    авиабилетами из Кипра
                  </Link>
                  ,{" "}
                  <Link
                    href={`/${locale}/hotel-reservations`}
                    className="text-brand-navy font-semibold underline hover:text-brand-gold"
                  >
                    бронированием отелей
                  </Link>{" "}
                  и{" "}
                  <Link
                    href={`/${locale}/turisticheskoe-agentstvo-pafos`}
                    className="text-brand-navy font-semibold underline hover:text-brand-gold"
                  >
                    индивидуальными маршрутами из Пафоса
                  </Link>
                  .
                </>
              ) : (
                <>
                  We handle{" "}
                  <Link
                    href={`/${locale}/flight-tickets-cyprus`}
                    className="text-brand-navy font-semibold underline hover:text-brand-gold"
                  >
                    flights from Cyprus
                  </Link>
                  ,{" "}
                  <Link
                    href={`/${locale}/hotel-reservations`}
                    className="text-brand-navy font-semibold underline hover:text-brand-gold"
                  >
                    hotel reservations
                  </Link>{" "}
                  and{" "}
                  <Link
                    href={`/${locale}/paphos-travel-agency`}
                    className="text-brand-navy font-semibold underline hover:text-brand-gold"
                  >
                    bespoke itineraries from our Paphos office
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* What changes for residents */}
      <section className="py-16 lg:py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">
            {isRu ? "Что изменится после вступления" : "What will change once Cyprus joins"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-gold flex-shrink-0 mt-1" />
              <p className="text-sm text-white/80 leading-relaxed">
                {isRu
                  ? "Граждане ЕС: поездки между Кипром и 29 странами Шенгена без паспортного контроля на внутренних рейсах."
                  : "EU citizens: travel between Cyprus and the other Schengen countries without passport checks on internal flights."}
              </p>
            </div>
            <div className="flex gap-3">
              <Plane className="h-6 w-6 text-brand-gold flex-shrink-0 mt-1" />
              <p className="text-sm text-white/80 leading-relaxed">
                {isRu
                  ? "Граждане третьих стран: дни на Кипре будут суммироваться с днями в других странах Шенгена в лимите 90 из 180."
                  : "Non-EU visitors: days in Cyprus will count together with days in other Schengen countries towards the 90-in-180-day limit."}
              </p>
            </div>
            <div className="flex gap-3">
              <Briefcase className="h-6 w-6 text-brand-gold flex-shrink-0 mt-1" />
              <p className="text-sm text-white/80 leading-relaxed">
                {isRu
                  ? "Визы: шенгенская виза будет действовать и для Кипра вместо отдельной национальной кипрской визы."
                  : "Visas: a Schengen visa will cover Cyprus too, instead of Cyprus's separate national visa."}
              </p>
            </div>
            <div className="flex gap-3">
              <FileText className="h-6 w-6 text-brand-gold flex-shrink-0 mt-1" />
              <p className="text-sm text-white/80 leading-relaxed">
                {isRu
                  ? "Жители Кипра без гражданства ЕС: кипрский ВНЖ позволит ездить в другие страны Шенгена без визы до 90 дней в любые 180 дней."
                  : "Non-EU residents of Cyprus: a Cyprus residence permit will allow visa-free trips to other Schengen countries for up to 90 days in any 180."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />

      <ServicesCrossLinks locale={locale} include={["visa", "corporate", "flights", "hotels"]} />
    </>
  );
}

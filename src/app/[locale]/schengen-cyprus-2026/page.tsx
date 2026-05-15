import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, SERVICE_LAST_UPDATED, CANONICAL_ORIGIN } from "@/lib/seo";
import { ArrowRight, FileText, Briefcase, Calendar, ShieldCheck, Plane, MapPin } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import CTABanner from "@/components/sections/CTABanner";
import ServicesCrossLinks from "@/components/sections/ServicesCrossLinks";

/**
 * Cyprus + Schengen 2026 topic hub (Phase 7 — Step 56).
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
        ? "Кипр и Шенген 2026: статус, сроки, влияние на поездки — JetSet"
        : "Cyprus & Schengen 2026: Accession Status, Timeline & Travel Impact",
    description:
      locale === "ru"
        ? "Что нужно знать о вступлении Кипра в Шенгенскую зону в 2026: сроки, влияние на бизнес-поездки, визы, корпоративные политики. Гид от IATA-агентства."
        : "Everything Cyprus residents and businesses need to know about Schengen accession in 2026 — timeline, visa impact, corporate travel policy updates. From an IATA-accredited agency.",
    keywords:
      locale === "ru"
        ? [
            "Кипр Шенген 2026",
            "вступление Кипра в Шенген",
            "шенген Кипр",
            "Cyprus Schengen 2026",
          ]
        : [
            "Cyprus Schengen 2026",
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
  const isRu = locale === "ru";

  const hubUrl = `${CANONICAL_ORIGIN}/${locale}/schengen-cyprus-2026`;

  const clusterPosts: ClusterLink[] = isRu
    ? [
        {
          href: `/${locale}/blog/kipr-v-shengene-2026-delovye-poezdki`,
          title: "Кипр и Шенген 2026: статус вступления — деловые поездки",
          description:
            "Подробный гид для корпоративных тревел-менеджеров: голосование Совета ЕС, правило 90/180 и обновление политики командировок.",
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
          title: "Cyprus Schengen Accession Status (May 2026 Update)",
          description:
            "What corporate travel managers need to know: EU Council vote, 90/180-day rule, and how to update your travel policy now.",
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
            "Тревел-программы для B2B: обновление политики командировок под Шенген 2026.",
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
            "B2B travel programmes — adjust your corporate travel policy for Schengen 2026.",
        },
      ];

  const milestones = isRu
    ? [
        {
          when: "Q1 2026",
          what: "Завершение технических требований (VIS, EES, Шенгенская информационная система).",
        },
        {
          when: "Май 2026",
          what: "Аэропорты Ларнаки и Пафоса работают с системой Entry/Exit (EES).",
        },
        {
          when: "Ожидается 2026",
          what: "Решение Совета ЕС о полноправном членстве Кипра в Шенгенской зоне.",
        },
        {
          when: "Дата X + 6 мес.",
          what: "Отмена внутренних пограничных проверок для рейсов внутри Шенгена.",
        },
      ]
    : [
        {
          when: "Q1 2026",
          what: "Technical requirements completed (VIS, EES, Schengen Information System).",
        },
        {
          when: "May 2026",
          what: "Larnaca and Paphos airports operating the Entry/Exit System (EES).",
        },
        {
          when: "Expected 2026",
          what: "Council of the EU vote on Cyprus's full Schengen membership.",
        },
        {
          when: "X + 6 months",
          what: "Internal border checks removed for intra-Schengen flights.",
        },
      ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${hubUrl}#collection`,
    name: isRu
      ? "Кипр и Шенген 2026 — тематический хаб"
      : "Cyprus & Schengen 2026 — topic hub",
    url: hubUrl,
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
            {isRu ? "Тематический хаб" : "Topic hub"}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {isRu
              ? "Кипр и Шенген 2026"
              : "Cyprus & Schengen 2026"}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {isRu
              ? "Что вступление Кипра в Шенгенскую зону значит для жителей, бизнес-путешественников и корпоративных тревел-менеджеров — гид от IATA-аккредитованного агентства."
              : "What Cyprus's accession to the Schengen Area means for residents, business travellers and corporate travel managers — from an IATA-accredited agency."}
          </p>
        </div>
      </section>

      {/* Milestone timeline */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-8 text-center">
            {isRu ? "Сроки вступления" : "Accession timeline"}
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
          <p className="text-brand-navy/60 text-center mb-10 max-w-2xl mx-auto">
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
                  <span className="inline-block self-start text-xs uppercase tracking-wider font-semibold text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-full mb-3">
                    {p.badge}
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-brand-navy leading-snug">
                  {p.title}
                </h3>
                <p className="text-sm text-brand-navy/60 mt-2 leading-relaxed">
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
          <p className="text-brand-navy/60 text-center mb-10 max-w-2xl mx-auto">
            {isRu
              ? "Если вы готовитесь к Шенгену 2026, эти услуги помогут вам подготовиться сейчас."
              : "If you're preparing for Schengen 2026, these services help you get ahead now."}
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
                  <p className="text-sm text-brand-navy/60 mt-1.5 leading-relaxed">
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
            {isRu ? "Что изменится для жителей Кипра" : "What changes for Cyprus residents"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-gold flex-shrink-0 mt-1" />
              <p className="text-sm text-white/80 leading-relaxed">
                {isRu
                  ? "Граждане ЕС/Кипра: безвизовый въезд во все 30 стран Шенгена с национальным удостоверением."
                  : "EU / Cypriot nationals: ID-card travel across all 30 Schengen states without internal checks."}
              </p>
            </div>
            <div className="flex gap-3">
              <Plane className="h-6 w-6 text-brand-gold flex-shrink-0 mt-1" />
              <p className="text-sm text-white/80 leading-relaxed">
                {isRu
                  ? "Граждане третьих стран: правило 90/180 применяется ко всему пребыванию в Шенгене, включая Кипр."
                  : "Third-country nationals: the 90/180-day rule applies to all Schengen time, Cyprus included."}
              </p>
            </div>
            <div className="flex gap-3">
              <Briefcase className="h-6 w-6 text-brand-gold flex-shrink-0 mt-1" />
              <p className="text-sm text-white/80 leading-relaxed">
                {isRu
                  ? "Корпоративные клиенты: единая Шенгенская мультивиза вместо отдельной кипрской."
                  : "Corporate clients: a single Schengen multi-entry visa replaces the separate Cyprus visa."}
              </p>
            </div>
            <div className="flex gap-3">
              <FileText className="h-6 w-6 text-brand-gold flex-shrink-0 mt-1" />
              <p className="text-sm text-white/80 leading-relaxed">
                {isRu
                  ? "Жители Кипра без гражданства ЕС: подача в любое консульство Шенгена в Никосии."
                  : "Cyprus residents without EU citizenship: apply at any Schengen consulate in Nicosia."}
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

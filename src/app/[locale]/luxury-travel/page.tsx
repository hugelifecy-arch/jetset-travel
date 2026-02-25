import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/seo";
import Link from "next/link";
import {
  Palmtree,
  Mountain,
  Building2,
  Heart,
  Quote,
  ArrowRight,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      absolute:
        locale === "ru"
          ? "Элитный отдых из Кипра | Индивидуальные путешествия | JetSet Travel"
          : "Luxury Holiday Planning Cyprus | Bespoke Leisure Travel | JetSet Travel",
    },
    description:
      locale === "ru"
        ? "Эксклюзивные путешествия с частными трансферами, отелями класса люкс и индивидуальными маршрутами. Ваш премиальный партнёр на Кипре."
        : "Curated luxury holidays with private transfers, suite-level hotels, and bespoke multi-city itineraries. Your premium travel partner in Cyprus.",
    alternates: localizedAlternates(locale, "/luxury-travel"),
  };
}

const categories = [
  {
    icon: Palmtree,
    title: "Private Islands",
    description:
      "Overwater villas, barefoot luxury, and seclusion in the world's most pristine archipelagos.",
  },
  {
    icon: Mountain,
    title: "Ski & Alpine",
    description:
      "Chalets in Courchevel, lodges in Zermatt, and helicopter transfers to untouched powder.",
  },
  {
    icon: Building2,
    title: "City Breaks",
    description:
      "Five-star suites in London, Paris, and New York with VIP restaurant reservations and private tours.",
  },
  {
    icon: Heart,
    title: "Honeymoon",
    description:
      "Bespoke romantic escapes with sunset dinners, spa rituals, and once-in-a-lifetime excursions.",
  },
];

const editorials = [
  {
    title: "We Listen Before We Book",
    description:
      "Every luxury trip starts with a conversation — not a search engine. We learn how you travel, what excites you, and what you avoid. Then we design an itinerary that feels personal, not templated. Whether it's a quiet retreat or a celebration, we shape every detail around you.",
    align: "left" as const,
  },
  {
    title: "Access Others Cannot Offer",
    description:
      "Through our preferred partnerships with leading hotel groups, private villa networks, and concierge services, we unlock room upgrades, late checkouts, resort credits, and exclusive experiences that aren't available to the public. Our IATA accreditation and industry relationships mean you get more for the same price.",
    align: "right" as const,
  },
];

const destinations = [
  {
    name: "Maldives",
    tagline: "Overwater serenity",
    description:
      "Private water villas, coral reef snorkelling, and candlelit beach dinners in the Indian Ocean.",
  },
  {
    name: "Tuscany",
    tagline: "Rolling hills & fine wine",
    description:
      "Restored farmhouse stays, vineyard tours, and truffle-hunting excursions in the Italian countryside.",
  },
  {
    name: "Dubai",
    tagline: "Modern opulence",
    description:
      "Skyline suites, desert safaris, and world-class dining in the city that redefines luxury.",
  },
];

export default async function LuxuryTravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      {/* Full-width Hero */}
      <section className="relative bg-brand-navy text-white py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-6">
            Luxury Travel
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            The World, Curated for You
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Bespoke journeys designed around your desires — not a catalogue.
            From private islands to alpine retreats, we craft experiences that
            stay with you.
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center rounded-full bg-brand-gold px-10 py-4 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
          >
            Plan Your Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Experience Category Cards */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Experiences We Craft
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              Four categories of travel, each designed with obsessive attention
              to detail.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="group p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <cat.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {cat.title}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Alternating Sections */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          {editorials.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <div
                  className={`aspect-[4/3] rounded-2xl ${
                    index === 0
                      ? "bg-gradient-to-br from-brand-navy to-brand-dark"
                      : "bg-gradient-to-br from-brand-gold/20 to-brand-gold/5"
                  } flex items-center justify-center`}
                >
                  <span className="text-6xl opacity-30">
                    {index === 0 ? "✦" : "◆"}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
                  {item.title}
                </h2>
                <p className="text-brand-navy/60 leading-relaxed text-lg">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destination Cards */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Featured Destinations
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              A glimpse of where we can take you — each trip fully bespoke.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.name}
                className="group rounded-2xl overflow-hidden border border-brand-navy/10 hover:shadow-luxury transition-shadow"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-brand-navy/80 to-brand-dark flex items-center justify-center">
                  <span className="text-white/20 text-5xl font-display font-bold">
                    {dest.name}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-1">
                    {dest.tagline}
                  </p>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">
                    {dest.name}
                  </h3>
                  <p className="text-brand-navy/60 text-sm leading-relaxed">
                    {dest.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull-quote Testimonial */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="h-12 w-12 text-brand-gold/40 mx-auto mb-8" />
          <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-8">
            &ldquo;JetSet turned our anniversary into something
            extraordinary. The villa in Santorini, the private sunset
            cruise, the restaurant they found tucked in the cliffs — every
            moment was perfect.&rdquo;
          </blockquote>
          <div>
            <p className="text-brand-gold font-semibold">Elena & Dimitris K.</p>
            <p className="text-white/50 text-sm">Limassol, Cyprus</p>
          </div>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Begin Your Journey
          </h2>
          <p className="text-brand-navy/60 max-w-2xl mx-auto mb-8">
            Tell us about your dream trip — no obligations, no templates. Just
            a conversation about where the world can take you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              Send an Enquiry
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/35799478073?text=Hi%2C%20I%27m%20interested%20in%20a%20luxury%20travel%20experience."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-brand-navy/20 px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/seo";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Hotel Reservations — Negotiated Rates Worldwide from Cyprus",
    description:
      "Book hotels worldwide with negotiated rates through JetSet Travel Cyprus. Leisure resorts, business accommodation, extended stays, and group bookings.",
    alternates: localizedAlternates(locale, "/hotel-reservations"),
  };
}

const serviceTypes = [
  {
    icon: Hotel,
    title: "Leisure Hotels & Resorts",
    description:
      "From beachfront all-inclusive resorts to boutique city hotels — we find the perfect match for every holiday style and budget.",
  },
  {
    icon: Building,
    title: "Business Accommodation",
    description:
      "Convenient locations near conference centres and offices, with corporate rates, express check-in, and reliable Wi-Fi guaranteed.",
  },
  {
    icon: CalendarDays,
    title: "Extended & Long Stays",
    description:
      "Serviced apartments and apart-hotels for relocations, project assignments, or longer trips — fully furnished with weekly housekeeping.",
  },
];

const benefits = [
  {
    icon: Star,
    title: "Negotiated Rates",
    description:
      "Our direct partnerships with hotel chains and independent properties mean you get rates and perks not available on public booking sites.",
  },
  {
    icon: BadgeCheck,
    title: "Vetted Properties",
    description:
      "Every hotel we recommend has been reviewed for quality, location, and guest feedback. No surprises on arrival.",
  },
  {
    icon: Headphones,
    title: "Full Support",
    description:
      "Changes, cancellations, special requests, and complaints — we handle everything with the hotel on your behalf.",
  },
];

const destinations = [
  "London",
  "Dubai",
  "Paris",
  "Athens",
  "Moscow",
  "New York",
  "Maldives",
  "Rome",
  "Barcelona",
  "Istanbul",
];

export default async function HotelReservationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
              Hotel Reservations
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Hotels & Long Stays, Handled for You
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-2xl">
              Whether it&apos;s a weekend city break, a two-week resort holiday,
              or a three-month corporate relocation — we book the right property
              at the best rate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                Find a Hotel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/35799478073?text=Hi%2C%20I%20need%20help%20booking%20a%20hotel."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Service Type Cards */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Accommodation for Every Need
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              We don&apos;t just book hotels — we match you with the right type
              of stay for the right occasion.
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
              Why Book Through Us
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              Online booking engines show you prices. We show you value.
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
              Preferred Destinations
            </h2>
            <p className="text-brand-navy/60 text-sm">
              Hotels we book most frequently — with the best negotiated rates.
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

      {/* Group Bookings Callout */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Group Bookings & Events
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Planning a corporate retreat, wedding block, sports team trip,
                or conference? We negotiate group rates, manage room blocks, and
                coordinate with the hotel for meeting rooms, catering, and
                special arrangements.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "10+ rooms at negotiated group rates",
                  "Dedicated group coordinator",
                  "Meeting rooms & event space sourcing",
                  "Rooming lists & individual billing options",
                ].map((item) => (
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
                Request a Group Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-gold/10 to-brand-dark flex items-center justify-center">
                <Users className="h-20 w-20 text-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

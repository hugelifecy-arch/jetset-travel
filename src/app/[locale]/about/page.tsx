import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  ShieldCheck,
  Heart,
  Scale,
  ArrowRight,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "About Us — IATA-Accredited Travel Agency in Cyprus",
    description:
      "Learn about JetSet Travel Cyprus — our story, IATA accreditation, CTO licence, core values, and the team behind premium travel services in Paphos since 2006.",
  };
}

const values = [
  {
    icon: Eye,
    title: "Transparency",
    description:
      "No hidden fees, no fine print. We show you exactly what you pay for and why — every quote, every invoice, every time.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    description:
      "When we say we'll deliver, we deliver. From instant confirmations to 24/7 emergency support, you can count on us.",
  },
  {
    icon: Heart,
    title: "Personalisation",
    description:
      "No two trips are the same because no two travellers are. We listen first, then design an experience tailored to you.",
  },
  {
    icon: Scale,
    title: "Accountability",
    description:
      "We own every booking from start to finish. If something goes wrong, we fix it — no excuses, no runaround.",
  },
];

const team = [
  {
    name: "Maria Georgiou",
    role: "Founder & Managing Director",
    bio: "With over 20 years in the travel industry, Maria founded JetSet to bring world-class service to Cyprus.",
  },
  {
    name: "Andreas Ioannou",
    role: "Corporate Travel Manager",
    bio: "Andreas oversees all corporate accounts, ensuring compliance, speed, and cost-efficiency for every business client.",
  },
  {
    name: "Elena Christodoulou",
    role: "Luxury Travel Consultant",
    bio: "Elena crafts bespoke luxury itineraries, drawing on her network of premium hotel and experience partners worldwide.",
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
            About JetSet Travel
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Your Trusted Travel Partner in Cyprus
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Since 2006, we&apos;ve been helping individuals and businesses
            travel smarter, safer, and with confidence.
          </p>
        </div>
      </section>

      {/* Our Story — two columns */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
                Our Story
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
                From a Small Office in Paphos to a Nationwide Partner
              </h2>
              <div className="space-y-4 text-brand-navy/70 leading-relaxed">
                <p>
                  JetSet Travel was founded in 2006 with a simple belief: travel
                  should be personal, transparent, and handled by people who
                  genuinely care about getting it right.
                </p>
                <p>
                  What started as a two-person office in Paphos has grown into
                  one of Cyprus&apos;s most trusted travel agencies — serving
                  corporate clients, luxury travellers, and families across the
                  island. Over 20 years later, that founding principle hasn&apos;t
                  changed.
                </p>
                <p>
                  We hold full IATA accreditation and are licensed by the Cyprus
                  Tourism Organisation, giving our clients the confidence that
                  their bookings are protected, compliant, and competitively
                  priced.
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-navy to-brand-dark flex items-center justify-center">
                <span className="text-white/20 text-6xl font-display font-bold">
                  JetSet
                </span>
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
              Accreditations & Trust
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              Our credentials ensure your bookings are protected, compliant, and
              backed by industry-leading standards.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* IATA Badge */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-brand-navy/10 hover:shadow-luxury transition-shadow">
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
                IATA Accredited
              </h3>
              <p className="text-brand-navy/60 text-sm leading-relaxed">
                Internationally recognised accreditation for airline ticketing
                and travel services.
              </p>
            </div>

            {/* Tourism License */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-brand-navy/10 hover:shadow-luxury transition-shadow">
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
                CTO Licensed
              </h3>
              <p className="text-brand-navy/60 text-sm leading-relaxed">
                Licensed by the Cyprus Tourism Organisation — fully regulated
                and compliant.
              </p>
            </div>

            {/* 15 Years Badge */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-brand-navy/10 hover:shadow-luxury transition-shadow">
              <div className="w-24 h-24 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                <span className="text-brand-gold font-display text-3xl font-bold">
                  15+
                </span>
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">
                Years of Service
              </h3>
              <p className="text-brand-navy/60 text-sm leading-relaxed">
                Trusted by thousands of clients across Cyprus since 2006.
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
              What We Stand For
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              Four principles that guide every booking, every conversation, and
              every decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="group p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all"
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
              Meet the Team
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              The people behind your travel — experienced, dedicated, and always
              a phone call away.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-brand-navy/10 overflow-hidden hover:shadow-luxury transition-shadow"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-brand-navy/80 to-brand-dark flex items-center justify-center">
                  <span className="text-white/20 text-5xl font-display font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
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

      {/* CTA */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Whether it&apos;s a business trip or the holiday of a lifetime —
            we&apos;d love to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/quote`}
              className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              Get a Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

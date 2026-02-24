"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Clock,
  FileText,
  Phone,
  UserCheck,
  PlaneTakeoff,
  ChevronDown,
  Check,
  ArrowRight,
} from "lucide-react";

const pillars = [
  {
    icon: Zap,
    title: "Speed",
    description:
      "Fast quotes within 30 minutes during business hours. Last-minute itinerary changes handled in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance",
    description:
      "Full VAT-compliant invoicing, travel policy enforcement, and detailed expense reporting for every trip.",
  },
  {
    icon: Clock,
    title: "Reliability",
    description:
      "24/7 emergency support line for travellers abroad. Dedicated account manager for your organisation.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Us Your Needs",
    description:
      "Share your travel policy, preferred airlines, hotel tiers, and budget guidelines.",
  },
  {
    number: "02",
    title: "We Build Your Profile",
    description:
      "A dedicated account manager sets up your company profile with negotiated rates and approval workflows.",
  },
  {
    number: "03",
    title: "Book With Confidence",
    description:
      "Request trips via email, phone, or WhatsApp. We handle booking, ticketing, and confirmations.",
  },
  {
    number: "04",
    title: "Travel & Report",
    description:
      "Travellers receive full itineraries. Finance gets clean invoices and monthly spending reports.",
  },
];

const coverageLeft = [
  "International & domestic flights",
  "Hotel reservations worldwide",
  "Airport transfers & car hire",
  "Travel insurance policies",
  "Multi-city & complex itineraries",
  "Loyalty programme management",
];

const coverageRight = [
  "Conference & event travel",
  "Group bookings (10+ travellers)",
  "Visa assistance & documentation",
  "Rail & ferry tickets",
  "Emergency rebooking & cancellations",
  "Monthly expense consolidation",
];

const faqs = [
  {
    question: "Do you provide VAT-compliant invoices?",
    answer:
      "Yes. Every booking comes with a detailed, VAT-compliant invoice suitable for EU tax reporting. We can also provide consolidated monthly invoices for easier accounting and integrate with your expense management system.",
  },
  {
    question: "Can you enforce our company travel policy?",
    answer:
      "Absolutely. During onboarding we configure your policy rules — preferred airlines, hotel star ratings, cabin classes, and budget caps. Our system flags any out-of-policy requests for approval before booking.",
  },
  {
    question: "How do you handle urgent or last-minute bookings?",
    answer:
      "We offer 24/7 emergency support for corporate clients. Urgent requests are prioritised, and our IATA-accredited status means we can issue tickets instantly without waiting for third-party confirmations.",
  },
  {
    question: "What is your cancellation and rebooking policy?",
    answer:
      "We manage all cancellations and changes on your behalf at no additional service fee. You only pay any airline or hotel penalties that apply. We also proactively monitor fare changes and rebook when savings are available.",
  },
];

export default function CorporateTravelPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
              Corporate Travel
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Corporate Travel Management That Works for Your Finance Team
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-2xl">
              IATA-accredited agency in Cyprus delivering fast quotes, clean
              invoices, and 24/7 support for businesses that need travel done
              right.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                Request a Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/35799478073?text=Hi%2C%20I%27d%20like%20to%20discuss%20corporate%20travel%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Why Businesses Choose JetSet
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              Three pillars that make corporate travel effortless for your team
              and transparent for your finance department.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="text-center p-8 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-6">
                  <pillar.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {pillar.title}
                </h3>
                <p className="text-brand-navy/60 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              How It Works
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              From onboarding to your first trip — we make the process seamless.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="text-5xl font-bold text-brand-gold/20 font-display">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-brand-navy mt-2 mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              What We Cover
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              A full-service corporate travel solution — everything your
              business needs under one roof.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 max-w-3xl mx-auto">
            <ul className="space-y-4">
              {coverageLeft.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-brand-navy/80">{item}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-4">
              {coverageRight.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-brand-navy/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-brand-navy/10 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-brand-navy pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-brand-gold flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-brand-navy/60 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold mb-6">
            <PlaneTakeoff className="h-8 w-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Streamline Your Corporate Travel?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Join law firms, tech companies, and enterprises across Cyprus who
            trust JetSet for reliable, cost-effective business travel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              Get a Free Quote
            </Link>
            <a
              href="https://wa.me/35799478073?text=Hi%2C%20I%27d%20like%20to%20set%20up%20a%20corporate%20travel%20account."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Set Up an Account
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

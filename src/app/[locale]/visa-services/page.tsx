import type { Metadata } from "next";
import Link from "next/link";
import {
  FileCheck,
  Clock,
  Download,
  MessageCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Visa Services — Application Assistance for Cyprus Travellers",
  description:
    "Expert visa assistance from Cyprus — document preparation, embassy submissions, and appointment scheduling for UK, US, Canada, UAE, and more.",
};

const visaCards = [
  {
    flag: "🇬🇧",
    country: "United Kingdom",
    processing: "15 working days",
    difficulty: "Medium",
    difficultyColor: "bg-yellow-100 text-yellow-800",
  },
  {
    flag: "🇺🇸",
    country: "United States",
    processing: "3–6 weeks",
    difficulty: "Hard",
    difficultyColor: "bg-red-100 text-red-800",
  },
  {
    flag: "🇨🇦",
    country: "Canada",
    processing: "4–8 weeks",
    difficulty: "Hard",
    difficultyColor: "bg-red-100 text-red-800",
  },
  {
    flag: "🇦🇪",
    country: "UAE (Dubai)",
    processing: "3–5 working days",
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
  },
  {
    flag: "🇦🇺",
    country: "Australia",
    processing: "4–6 weeks",
    difficulty: "Hard",
    difficultyColor: "bg-red-100 text-red-800",
  },
  {
    flag: "🇨🇳",
    country: "China",
    processing: "5–7 working days",
    difficulty: "Medium",
    difficultyColor: "bg-yellow-100 text-yellow-800",
  },
];

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Tell Us Your Destination",
    description:
      "Share where you're going, your nationality, and travel dates. We assess the requirements immediately.",
  },
  {
    number: "02",
    icon: FileCheck,
    title: "Document Preparation",
    description:
      "We provide a personalised checklist and review every document before submission to avoid delays.",
  },
  {
    number: "03",
    icon: Clock,
    title: "Application Submission",
    description:
      "We submit your application to the embassy or visa centre, handling forms, fees, and appointment scheduling.",
  },
  {
    number: "04",
    icon: ArrowRight,
    title: "Visa Collection & Travel",
    description:
      "Once approved, we arrange collection and send you a confirmation. You're ready to fly.",
  },
];

const documents = [
  "Valid passport (6+ months validity)",
  "Passport-sized photographs (recent)",
  "Completed visa application form",
  "Travel insurance certificate",
  "Flight reservation confirmation",
  "Hotel booking or accommodation proof",
  "Bank statements (last 3–6 months)",
  "Employment letter or business registration",
  "Invitation letter (if applicable)",
  "Previous visa copies (if applicable)",
];

export default function VisaServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
              Visa Services
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Visa Assistance, Done Right
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-2xl">
              Navigating visa requirements can be stressful. We handle the
              paperwork, appointments, and follow-ups so you can focus on your
              trip.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              Check Your Visa Requirements
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Destination Visa Cards */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Popular Visa Destinations
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              Processing times and difficulty levels for the most requested
              visas from Cyprus.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visaCards.map((visa) => (
              <div
                key={visa.country}
                className="p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{visa.flag}</span>
                    <h3 className="text-lg font-bold text-brand-navy">
                      {visa.country}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${visa.difficultyColor}`}
                  >
                    {visa.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-navy/60">
                  <Clock className="h-4 w-4 text-brand-gold" />
                  <span>Processing: {visa.processing}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              How We Help
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              A simple four-step process from enquiry to approved visa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
                  Step {step.number}
                </span>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
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

      {/* Document Checklist Download Box */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-light rounded-2xl p-8 md:p-12 border border-brand-navy/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex-shrink-0">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
                  Document Checklist
                </h2>
                <p className="text-brand-navy/60">
                  Prepare these documents before your visa consultation. The
                  exact requirements vary by destination.
                </p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {documents.map((doc) => (
                <li key={doc} className="flex items-start gap-3">
                  <FileCheck className="h-4 w-4 text-brand-gold flex-shrink-0 mt-1" />
                  <span className="text-brand-navy/80 text-sm">{doc}</span>
                </li>
              ))}
            </ul>
            <p className="text-brand-navy/40 text-xs">
              This is a general checklist. We will provide a personalised list
              based on your nationality and destination after your initial
              consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-brand-light">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 p-6 rounded-xl bg-white border border-brand-navy/10">
            <ShieldAlert className="h-5 w-5 text-brand-navy/40 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                <strong className="text-brand-navy">Disclaimer:</strong> JetSet
                Travel Cyprus assists with visa application preparation and
                submission. Final visa decisions are made solely by the
                respective embassy or consulate. We do not guarantee visa
                approval. Processing times are estimates and may vary based on
                embassy workload, seasonality, and individual circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Visa Help? Message Us Now
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Send us your destination and travel dates on WhatsApp. We&apos;ll
            respond with requirements and next steps within the hour.
          </p>
          <a
            href="https://wa.me/35799478073?text=Hi%2C%20I%20need%20help%20with%20a%20visa%20application."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

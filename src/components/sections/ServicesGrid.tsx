"use client";

import Link from "next/link";
import { Briefcase, Palmtree, FileCheck, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

export default function ServicesGrid() {
  const locale = useLocale();

  const services = [
    {
      icon: Briefcase,
      title: "Corporate Travel",
      description:
        "Policy-compliant itineraries, clean invoicing, and 24/7 disruption rebooking for executive and team travel.",
      href: `/${locale}/corporate-travel`,
    },
    {
      icon: Palmtree,
      title: "Luxury Leisure",
      description:
        "Curated premium holidays, private transfers, suite-level hotels, and bespoke multi-city journeys.",
      href: `/${locale}/luxury-travel`,
    },
    {
      icon: FileCheck,
      title: "Visa Services",
      description:
        "Document checklists, application guidance, and coordination support for business and tourist visas.",
      href: `/${locale}/visa-services`,
    },
    {
      icon: Building2,
      title: "Hotels",
      description:
        "Negotiated rates at quality hotels worldwide — matched to your location, standards, and budget priorities.",
      href: `/${locale}/hotel-reservations`,
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            What We Do
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-navy/70">
            Everything you need — handled by one accountable team.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={service.href}
                className="group flex h-full flex-col rounded-2xl border border-brand-navy/10 bg-brand-light/40 p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-luxury"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/15">
                  <service.icon className="h-6 w-6 text-brand-gold" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-brand-navy">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-navy/65">
                  {service.description}
                </p>
                <span className="mt-4 text-sm font-semibold text-brand-gold group-hover:underline">
                  Learn more &rarr;
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

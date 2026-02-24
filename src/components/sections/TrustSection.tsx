"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const bullets = [
  "Finance-ready invoices and documentation aligned to corporate compliance requirements.",
  "Dedicated account management with single-point accountability for every trip.",
  "24/7 disruption handling — rebooking, rerouting, and real-time updates on WhatsApp.",
];

const stats = [
  { value: "500+", label: "Corporate Clients" },
  { value: "15+", label: "Years Experience" },
  { value: "24/7", label: "Support Available" },
  { value: "98%", label: "Client Satisfaction" },
];

export default function TrustSection() {
  return (
    <section className="bg-brand-light py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Why corporates choose us */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
              Why Corporates Choose Us
            </h2>
            <p className="mt-4 text-lg text-brand-navy/70">
              Licensed, accountable, and documentation-ready — for teams that
              can&apos;t afford travel mistakes.
            </p>

            <ul className="mt-8 space-y-5">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-4">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-none text-brand-gold" />
                  <span className="text-base leading-relaxed text-brand-navy/80">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-brand-navy/10 bg-white p-6 text-center shadow-card"
              >
                <p className="font-display text-4xl font-bold text-brand-gold">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-brand-navy/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

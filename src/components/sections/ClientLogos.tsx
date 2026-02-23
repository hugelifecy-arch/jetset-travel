"use client";

import { Scale, Landmark, HeartPulse, Monitor, Building } from "lucide-react";

const industries = [
  { icon: Scale, label: "Law" },
  { icon: Landmark, label: "Finance" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Monitor, label: "Technology" },
  { icon: Building, label: "Real Estate" },
];

export default function ClientLogos() {
  return (
    <section className="border-y border-brand-navy/10 bg-brand-light/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-navy/50">
          Trusted by teams across industries
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {industries.map((industry) => (
            <div
              key={industry.label}
              className="flex flex-col items-center gap-2 text-brand-navy/40"
            >
              <industry.icon className="h-8 w-8" strokeWidth={1.5} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {industry.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

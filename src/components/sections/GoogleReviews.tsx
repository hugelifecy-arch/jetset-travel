"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Operations Manager",
    role: "Corporate client",
    text: "We had a cancellation on a meeting week. JetSet rerouted the team the same day and kept finance happy with clean documentation.",
  },
  {
    name: "Private Client",
    role: "Luxury leisure",
    text: "They understood our preferences instantly — hotel, transfers, and details. We arrived relaxed, everything was handled.",
  },
  {
    name: "Founder",
    role: "SME client",
    text: "Fast response on WhatsApp, clear options, no confusion. When plans changed, the solution was already in motion.",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-5 w-5 fill-brand-gold text-brand-gold"
        />
      ))}
    </div>
  );
}

export default function GoogleReviews() {
  {/* TODO: Replace with Elfsight embed code for live Google Reviews */}
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-navy/70">
            Real feedback from corporate and leisure travellers.
          </p>
        </div>

        {/* Review cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.figure
              key={review.name}
              className="flex flex-col rounded-2xl border border-brand-navy/10 bg-brand-light/40 p-6 shadow-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <StarRating />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-navy/80">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-brand-navy/10 pt-4">
                <p className="text-sm font-semibold text-brand-navy">
                  {review.name}
                </p>
                <p className="text-xs text-brand-navy/60">{review.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

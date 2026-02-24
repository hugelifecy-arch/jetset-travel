"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or contact us via WhatsApp.");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
            Contact Us
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Have a question, need a quote, or want to discuss your travel plans?
            We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Two-column: Info Card + Form */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Navy Info Card */}
            <div className="bg-brand-navy text-white rounded-2xl p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-8">
                  JetSet Travel Cyprus
                </h2>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Office Address</p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        26A Agapinoros, 8049 Paphos, Cyprus
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Telephone</p>
                      <a
                        href="tel:+35799478073"
                        className="block text-white/70 text-sm hover:text-brand-gold transition-colors"
                      >
                        +357 99 478 073
                      </a>
                      <a
                        href="tel:+35799310993"
                        className="block text-white/70 text-sm hover:text-brand-gold transition-colors"
                      >
                        +357 99 310 993
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <a
                        href="mailto:INFO@JETSET.COM.CY"
                        className="text-white/70 text-sm hover:text-brand-gold transition-colors"
                      >
                        INFO@JETSET.COM.CY
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Office Hours</p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Monday – Friday: 09:00 – 18:00
                        <br />
                        Saturday: 10:00 – 14:00
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <a
                href="https://wa.me/35799478073?text=Hi%2C%20I%27d%20like%20to%20discuss%20my%20travel%20plans."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white hover:bg-[#22c35e] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Right: Contact Form */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold mb-6">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-brand-navy/60 max-w-sm">
                    Thank you for reaching out. We&apos;ll get back to you
                    within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-2">
                      Send Us a Message
                    </h2>
                    <p className="text-brand-navy/60 text-sm">
                      Fill in the form below and we&apos;ll respond as soon as
                      possible.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-brand-navy mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-brand-navy mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-brand-navy mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                      placeholder="+357 ..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-brand-navy mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register("message")}
                      className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors resize-none"
                      placeholder="Tell us about your travel needs..."
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-500">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Embed */}
      <section className="bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Find Us
            </h2>
            <p className="text-brand-navy/60">
              Visit our office at 26A Agapinoros, 8049 Paphos, Cyprus.
            </p>
          </div>
codex/update-contact-details-and-address-53r6h7
          <div className="overflow-hidden rounded-2xl border border-brand-navy/10 bg-white shadow-sm">
            <iframe
              title="JetSet Travel Cyprus office location"
              src="https://www.google.com/maps?q=26A+Agapinoros,+8049+Paphos,+Cyprus&output=embed"
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-5 text-center">
            <a
              href="https://maps.app.goo.gl/iXHtVt8w6mXcPSN58"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
            >
              Open in Google Maps
            </a>

          <div className="aspect-[16/7] rounded-2xl bg-gradient-to-br from-brand-navy/10 to-brand-navy/5 border border-brand-navy/10 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-brand-navy/20 mx-auto mb-3" />
              <p className="text-brand-navy/40 text-sm font-semibold">
                Google Maps Embed
              </p>
              <p className="text-brand-navy/30 text-xs mt-1">
                26A Agapinoros, 8049 Paphos, Cyprus
              </p>
            </div>
 main
          </div>
        </div>
      </section>

      {/* IATA + Tourism Strip */}
      <section className="py-12 bg-white border-t border-brand-navy/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 relative">
                <Image
                  src="/images/iata-logo.jpg"
                  alt="IATA Accredited Agent"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-navy">
                  IATA Accredited
                </p>
                <p className="text-xs text-brand-navy/50">
                  International Air Transport Association
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-brand-navy/10" />
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 relative">
                <Image
                  src="/images/tourism-logo.jpg"
                  alt="Cyprus Tourism Organisation Licensed"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-navy">
                  CTO Licensed
                </p>
                <p className="text-xs text-brand-navy/50">
                  Cyprus Tourism Organisation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

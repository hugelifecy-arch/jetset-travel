"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  Palmtree,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Zod Schemas                                                        */
/* ------------------------------------------------------------------ */

const corporateSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Please enter a valid business email"),
  phone: z.string().min(5, "Phone number is required"),
  travellers: z.string().min(1, "Number of travellers is required"),
  travelDates: z.string().min(1, "Travel dates are required"),
  destinations: z.string().min(2, "Destinations are required"),
  invoiceRequired: z.boolean(),
  notes: z.string().optional(),
});

const luxurySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(5, "Phone number is required"),
  destinations: z.string().min(2, "Destinations are required"),
  dates: z.string().min(1, "Travel dates are required"),
  groupSize: z.string().min(1, "Group size is required"),
  budget: z.string().min(1, "Please select a budget range"),
  specialRequirements: z.string().optional(),
});

type CorporateFormData = z.infer<typeof corporateSchema>;
type LuxuryFormData = z.infer<typeof luxurySchema>;

/* ------------------------------------------------------------------ */
/*  Shared Styles                                                      */
/* ------------------------------------------------------------------ */

const inputClasses =
  "w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors";
const labelClasses = "block text-sm font-semibold text-brand-navy mb-2";
const errorClasses = "mt-1.5 text-sm text-red-500";

/* ------------------------------------------------------------------ */
/*  Corporate Form                                                     */
/* ------------------------------------------------------------------ */

function CorporateForm({ onSuccess }: { onSuccess: () => void }) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CorporateFormData>({
    resolver: zodResolver(corporateSchema),
    defaultValues: { invoiceRequired: false },
  });

  const onSubmit = async (data: CorporateFormData) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "corporate", ...data }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      onSuccess();
    } catch {
      setSubmitError("Something went wrong. Please try again or contact us via WhatsApp.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="companyName" className={labelClasses}>
            Company Name *
          </label>
          <input
            id="companyName"
            type="text"
            {...register("companyName")}
            className={inputClasses}
            placeholder="Your company"
          />
          {errors.companyName && (
            <p className={errorClasses}>{errors.companyName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="corp-email" className={labelClasses}>
            Business Email *
          </label>
          <input
            id="corp-email"
            type="email"
            {...register("email")}
            className={inputClasses}
            placeholder="you@company.com"
          />
          {errors.email && (
            <p className={errorClasses}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="corp-phone" className={labelClasses}>
            Phone *
          </label>
          <input
            id="corp-phone"
            type="tel"
            {...register("phone")}
            className={inputClasses}
            placeholder="+357 ..."
          />
          {errors.phone && (
            <p className={errorClasses}>{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="travellers" className={labelClasses}>
            Number of Travellers *
          </label>
          <input
            id="travellers"
            type="text"
            {...register("travellers")}
            className={inputClasses}
            placeholder="e.g. 4"
          />
          {errors.travellers && (
            <p className={errorClasses}>{errors.travellers.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="travelDates" className={labelClasses}>
            Travel Dates *
          </label>
          <input
            id="travelDates"
            type="text"
            {...register("travelDates")}
            className={inputClasses}
            placeholder="e.g. 15 Mar – 20 Mar 2026"
          />
          {errors.travelDates && (
            <p className={errorClasses}>{errors.travelDates.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="corp-destinations" className={labelClasses}>
            Destinations *
          </label>
          <input
            id="corp-destinations"
            type="text"
            {...register("destinations")}
            className={inputClasses}
            placeholder="e.g. London, Frankfurt"
          />
          {errors.destinations && (
            <p className={errorClasses}>{errors.destinations.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={false}
          onClick={(e) => {
            const input = document.getElementById(
              "invoiceRequired"
            ) as HTMLInputElement;
            if (input) {
              input.click();
            }
            const btn = e.currentTarget;
            const isChecked = btn.getAttribute("aria-checked") === "true";
            btn.setAttribute("aria-checked", String(!isChecked));
          }}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-navy/20 transition-colors aria-[checked=true]:bg-brand-gold"
        >
          <span className="inline-block h-4 w-4 rounded-full bg-white transition-transform translate-x-1 aria-checked:translate-x-6" />
        </button>
        <input
          id="invoiceRequired"
          type="checkbox"
          {...register("invoiceRequired")}
          className="sr-only"
        />
        <label
          htmlFor="invoiceRequired"
          className="text-sm text-brand-navy cursor-pointer"
        >
          VAT invoice required
        </label>
      </div>

      <div>
        <label htmlFor="corp-notes" className={labelClasses}>
          Additional Notes
        </label>
        <textarea
          id="corp-notes"
          rows={4}
          {...register("notes")}
          className={`${inputClasses} resize-none`}
          placeholder="Any special requirements or preferences..."
        />
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            Submit Corporate Enquiry
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Luxury Form                                                        */
/* ------------------------------------------------------------------ */

function LuxuryForm({ onSuccess }: { onSuccess: () => void }) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LuxuryFormData>({
    resolver: zodResolver(luxurySchema),
  });

  const onSubmit = async (data: LuxuryFormData) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "luxury", ...data }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      onSuccess();
    } catch {
      setSubmitError("Something went wrong. Please try again or contact us via WhatsApp.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="lux-name" className={labelClasses}>
            Full Name *
          </label>
          <input
            id="lux-name"
            type="text"
            {...register("name")}
            className={inputClasses}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className={errorClasses}>{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lux-email" className={labelClasses}>
            Email *
          </label>
          <input
            id="lux-email"
            type="email"
            {...register("email")}
            className={inputClasses}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className={errorClasses}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="lux-phone" className={labelClasses}>
            Phone *
          </label>
          <input
            id="lux-phone"
            type="tel"
            {...register("phone")}
            className={inputClasses}
            placeholder="+357 ..."
          />
          {errors.phone && (
            <p className={errorClasses}>{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lux-destinations" className={labelClasses}>
            Destinations *
          </label>
          <input
            id="lux-destinations"
            type="text"
            {...register("destinations")}
            className={inputClasses}
            placeholder="e.g. Maldives, Santorini"
          />
          {errors.destinations && (
            <p className={errorClasses}>{errors.destinations.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="lux-dates" className={labelClasses}>
            Travel Dates *
          </label>
          <input
            id="lux-dates"
            type="text"
            {...register("dates")}
            className={inputClasses}
            placeholder="e.g. June 2026"
          />
          {errors.dates && (
            <p className={errorClasses}>{errors.dates.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="groupSize" className={labelClasses}>
            Group Size *
          </label>
          <input
            id="groupSize"
            type="text"
            {...register("groupSize")}
            className={inputClasses}
            placeholder="e.g. 2 adults, 1 child"
          />
          {errors.groupSize && (
            <p className={errorClasses}>{errors.groupSize.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="budget" className={labelClasses}>
          Budget Range *
        </label>
        <select
          id="budget"
          {...register("budget")}
          className={inputClasses}
          defaultValue=""
        >
          <option value="" disabled>
            Select a budget range
          </option>
          <option value="under-2k">Under &euro;2,000</option>
          <option value="2k-5k">&euro;2,000 – &euro;5,000</option>
          <option value="5k-10k">&euro;5,000 – &euro;10,000</option>
          <option value="10k-plus">&euro;10,000+</option>
        </select>
        {errors.budget && (
          <p className={errorClasses}>{errors.budget.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="specialRequirements" className={labelClasses}>
          Special Requirements
        </label>
        <textarea
          id="specialRequirements"
          rows={4}
          {...register("specialRequirements")}
          className={`${inputClasses} resize-none`}
          placeholder="Dietary needs, accessibility, special occasions..."
        />
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            Submit Luxury Enquiry
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Success Screen                                                     */
/* ------------------------------------------------------------------ */

function SuccessScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 lg:py-24">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-gold/10 mb-8">
        <CheckCircle className="h-10 w-10 text-brand-gold" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
        Enquiry Received!
      </h2>
      <p className="text-brand-navy/60 text-lg max-w-md mb-8">
        We&apos;ll be in touch within 1 hour during business hours. For
        immediate assistance, reach us on WhatsApp.
      </p>
      <a
        href="https://wa.me/35799478073?text=Hi%2C%20I%20just%20submitted%20a%20quote%20request%20on%20your%20website."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white hover:bg-[#22c35e] transition-colors"
      >
        <MessageCircle className="h-5 w-5" />
        Chat on WhatsApp
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function QuoteContent() {
  const [branch, setBranch] = useState<"corporate" | "luxury" | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
            Get a Quote
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Tell Us How You Travel
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Select your travel type below and we&apos;ll tailor a quote to your
            exact needs.
          </p>
        </div>
      </section>

      {/* Form Area */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {success ? (
            <SuccessScreen />
          ) : branch === null ? (
            /* Step 1: Choose Branch */
            <div>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
                  What type of travel?
                </h2>
                <p className="text-brand-navy/60">
                  Choose the option that best describes your needs.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => setBranch("corporate")}
                  className="group flex flex-col items-center text-center p-10 rounded-2xl border-2 border-brand-navy/10 hover:border-brand-gold hover:shadow-luxury transition-all"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">
                    Corporate Travel
                  </h3>
                  <p className="text-brand-navy/60 text-sm leading-relaxed">
                    Business trips, conferences, group bookings with VAT invoicing
                    and travel policy compliance.
                  </p>
                </button>

                <button
                  onClick={() => setBranch("luxury")}
                  className="group flex flex-col items-center text-center p-10 rounded-2xl border-2 border-brand-navy/10 hover:border-brand-gold hover:shadow-luxury transition-all"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                    <Palmtree className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">
                    Luxury Leisure
                  </h3>
                  <p className="text-brand-navy/60 text-sm leading-relaxed">
                    Bespoke holidays, honeymoons, private villas, and curated
                    experiences worldwide.
                  </p>
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Form */
            <div>
              <button
                onClick={() => setBranch(null)}
                className="inline-flex items-center gap-2 text-sm text-brand-navy/60 hover:text-brand-gold transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to selection
              </button>

              <div className="mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gold mb-3">
                  {branch === "corporate" ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <Palmtree className="h-4 w-4" />
                  )}
                  {branch === "corporate"
                    ? "Corporate Travel"
                    : "Luxury Leisure"}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
                  {branch === "corporate"
                    ? "Corporate Travel Enquiry"
                    : "Luxury Travel Enquiry"}
                </h2>
                <p className="text-brand-navy/60 text-sm">
                  Fill in the details below and we&apos;ll prepare a tailored
                  quote for you.
                </p>
              </div>

              {branch === "corporate" ? (
                <CorporateForm onSuccess={() => setSuccess(true)} />
              ) : (
                <LuxuryForm onSuccess={() => setSuccess(true)} />
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

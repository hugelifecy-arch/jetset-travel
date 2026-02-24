"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone/WhatsApp is required"),
  route: z.string().min(5, "Please provide route details"),
});

type LeadFormValues = z.infer<typeof schema>;

export default function LeadForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LeadFormValues) => {
    setSubmitError(null);
    setSubmitted(false);

    const response = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to submit quote request");
    }

    setSubmitted(true);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          await onSubmit(data);
        } catch {
          setSubmitError("Something went wrong. Please try again.");
        }
      })}
      className="space-y-4"
    >
      <div className="space-y-1">
        <input
          {...register("name")}
          placeholder="Name"
          className="input w-full"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div className="space-y-1">
        <input
          {...register("phone")}
          placeholder="Phone / WhatsApp"
          className="input w-full"
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && (
          <span className="text-sm text-red-500">{errors.phone.message}</span>
        )}
      </div>

      <div className="space-y-1">
        <textarea
          {...register("route")}
          placeholder="Route details (from/to, dates, travelers, cabin class)"
          className="input min-h-28 w-full"
          aria-invalid={Boolean(errors.route)}
        />
        {errors.route && (
          <span className="text-sm text-red-500">{errors.route.message}</span>
        )}
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      {submitted && (
        <p className="text-sm text-green-600">
          Thanks! We&apos;ll get back to you shortly.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-brand-gold px-5 py-3 font-semibold text-brand-navy disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Get a Quote"}
      </button>
    </form>
  );
}

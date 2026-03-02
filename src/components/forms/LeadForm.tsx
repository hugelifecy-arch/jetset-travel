"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { leadFormSchema, type LeadFormValues } from "@/components/forms/schemas";
import { getRecaptchaToken } from "@/lib/recaptcha";

export default function LeadForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const formLoadedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormValues) => {
    setSubmitError(null);
    setSubmitted(false);

    const recaptchaToken = await getRecaptchaToken("quote");
    const response = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        website: honeypotRef.current?.value || "",
        _formLoadedAt: formLoadedAt.current,
        _recaptchaToken: recaptchaToken,
      }),
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
      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input
          type="text"
          ref={honeypotRef}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="space-y-1">
        <Input
          {...register("name")}
          placeholder="Name"
          className="input"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div className="space-y-1">
        <Input
          {...register("phone")}
          placeholder="Phone / WhatsApp"
          className="input"
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && (
          <span className="text-sm text-red-500">{errors.phone.message}</span>
        )}
      </div>

      <div className="space-y-1">
        <Textarea
          {...register("route")}
          placeholder="Route details (from/to, dates, travelers, cabin class)"
          className="input min-h-28"
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

      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Get a Quote"}
      </Button>
    </form>
  );
}

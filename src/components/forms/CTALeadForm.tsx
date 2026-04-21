"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  ctaLeadFormSchema,
  type CTALeadFormValues,
} from "@/components/forms/schemas";
import { Input, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { getRecaptchaToken } from "@/lib/recaptcha";
import FormTrustElements from "@/components/forms/FormTrustElements";

export default function CTALeadForm() {
  const t = useTranslations("cta");
  const tCommon = useTranslations("common");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formLoadedAt = useRef(Date.now());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CTALeadFormValues>({
    resolver: zodResolver(ctaLeadFormSchema),
  });

  const onSubmit = async (data: CTALeadFormValues) => {
    setSubmitError(null);
    try {
      const recaptchaToken = await getRecaptchaToken("contact");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          _formLoadedAt: formLoadedAt.current,
          _recaptchaToken: recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      reset();
    } catch {
      setSubmitError(t("error"));
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl bg-white/10 px-8 py-12 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <svg
            className="h-8 w-8 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-green-400">{t("success")}</p>
      </div>
    );
  }

  const inputClass =
    "bg-white border-white/20 text-brand-navy placeholder:text-brand-navy/50 focus:border-brand-gold focus:ring-brand-gold";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl rounded-2xl bg-white/5 p-4 backdrop-blur-sm sm:p-6 md:p-8"
    >
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input
          type="text"
          {...register("website")}
          tabIndex={-1}
          autoComplete="off"
          aria-label="Website"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-1 text-left">
          <Input
            {...register("name")}
            placeholder={t("fullName")}
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <span className="text-sm text-red-400">{errors.name.message}</span>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1 text-left">
          <Input
            type="email"
            {...register("email")}
            placeholder={t("email")}
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <span className="text-sm text-red-400">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1 text-left">
          <Input
            type="tel"
            {...register("phone")}
            placeholder={t("phonePlaceholder")}
            className={inputClass}
          />
        </div>

        {/* Travel Type */}
        <div className="space-y-1 text-left">
          <select
            {...register("travelType")}
            aria-label={t("travelType")}
            className={cn(
              "w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-brand-navy outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
            )}
          >
            <option value="">{t("selectTravelType")}</option>
            <option value="corporate">
              {t("travelTypeOptions.corporate")}
            </option>
            <option value="luxury">{t("travelTypeOptions.luxury")}</option>
            <option value="visa">{t("travelTypeOptions.visa")}</option>
            <option value="hotel">{t("travelTypeOptions.hotel")}</option>
            <option value="other">{t("travelTypeOptions.other")}</option>
          </select>
        </div>

        {/* Approximate Dates */}
        <div className="space-y-1 text-left sm:col-span-2">
          <Input
            {...register("dates")}
            placeholder={t("datesPlaceholder")}
            className={inputClass}
          />
        </div>

        {/* Message */}
        <div className="space-y-1 text-left sm:col-span-2">
          <Textarea
            {...register("message")}
            rows={3}
            placeholder={t("messagePlaceholder")}
            className={inputClass}
          />
        </div>
      </div>

      {submitError && (
        <p className="mt-4 text-left text-sm text-red-400">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-gold px-8 py-4 text-base font-semibold text-brand-navy shadow-luxury transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </button>

      <div className="mt-5">
        <FormTrustElements
          responseTime={t("responseTime")}
          freeConsultation={t("freeConsultation")}
          trustLicence={t("trustLicence")}
          trustClients={t("trustClients")}
          iataImageAlt={tCommon("iataAlt")}
          variant="light"
        />
      </div>
    </form>
  );
}

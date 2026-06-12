"use client";

import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { useFormMessages } from "@/components/forms/useFormMessages";
import { trackLead } from "@/lib/analytics/fbpixel";
import FormTrustElements from "@/components/forms/FormTrustElements";
import {
  inputClasses,
  labelClasses,
  errorClasses,
  type QuoteTFunction,
} from "./shared";

/* Validation messages come from the `forms` namespace so they localize;
   errors render directly under their field, so the generic strings stay
   unambiguous. */
const buildLuxurySchema = (m: { required: string; invalidEmail: string }) =>
  z.object({
    name: z.string().min(2, m.required),
    email: z.string().email(m.invalidEmail),
    phone: z.string().min(5, m.required),
    destinations: z.string().min(2, m.required),
    dates: z.string().min(1, m.required),
    groupSize: z.string().min(1, m.required),
    budget: z.string().min(1, m.required),
    specialRequirements: z.string().optional(),
  });

type LuxuryFormData = z.infer<ReturnType<typeof buildLuxurySchema>>;

export default function LuxuryForm({
  onSuccess,
  t,
}: {
  onSuccess: () => void;
  t: QuoteTFunction;
}) {
  const tCommon = useTranslations("common");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formLoadedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const formMessages = useFormMessages();
  const schema = useMemo(
    () => buildLuxurySchema(formMessages),
    [formMessages],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LuxuryFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LuxuryFormData) => {
    setSubmitError(null);
    try {
      const recaptchaToken = await getRecaptchaToken("quote");
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "luxury",
          ...data,
          website: honeypotRef.current?.value || "",
          _formLoadedAt: formLoadedAt.current,
          _recaptchaToken: recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      trackLead({ content_name: "Luxury Quote", content_category: "luxury" });
      onSuccess();
    } catch {
      setSubmitError(t("submitError"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="lux-name" className={labelClasses}>
            {t("fullName")} *
          </label>
          <input
            id="lux-name"
            type="text"
            {...register("name")}
            className={inputClasses}
            placeholder={t("namePlaceholder")}
          />
          {errors.name && (
            <p className={errorClasses}>{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lux-email" className={labelClasses}>
            {t("email")} *
          </label>
          <input
            id="lux-email"
            type="email"
            {...register("email")}
            className={inputClasses}
            placeholder={t("emailPlaceholder")}
          />
          {errors.email && (
            <p className={errorClasses}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="lux-phone" className={labelClasses}>
            {t("phone")} *
          </label>
          <input
            id="lux-phone"
            type="tel"
            {...register("phone")}
            className={inputClasses}
            placeholder={t("phonePlaceholder")}
          />
          {errors.phone && (
            <p className={errorClasses}>{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lux-destinations" className={labelClasses}>
            {t("luxuryDest")} *
          </label>
          <input
            id="lux-destinations"
            type="text"
            {...register("destinations")}
            className={inputClasses}
            placeholder={t("luxuryDestPlaceholder")}
          />
          {errors.destinations && (
            <p className={errorClasses}>{errors.destinations.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="lux-dates" className={labelClasses}>
            {t("luxuryDates")} *
          </label>
          <input
            id="lux-dates"
            type="text"
            {...register("dates")}
            className={inputClasses}
            placeholder={t("luxuryDatesPlaceholder")}
          />
          {errors.dates && (
            <p className={errorClasses}>{errors.dates.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="groupSize" className={labelClasses}>
            {t("groupSize")} *
          </label>
          <input
            id="groupSize"
            type="text"
            {...register("groupSize")}
            className={inputClasses}
            placeholder={t("groupSizePlaceholder")}
          />
          {errors.groupSize && (
            <p className={errorClasses}>{errors.groupSize.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="budget" className={labelClasses}>
          {t("budgetRange")} *
        </label>
        <select
          id="budget"
          {...register("budget")}
          className={inputClasses}
          defaultValue=""
        >
          <option value="" disabled>
            {t("selectBudget")}
          </option>
          <option value="under-2k">{t("budgetUnder2k")}</option>
          <option value="2k-5k">{t("budget2k5k")}</option>
          <option value="5k-10k">{t("budget5k10k")}</option>
          <option value="10k-plus">{t("budget10kPlus")}</option>
        </select>
        {errors.budget && (
          <p className={errorClasses}>{errors.budget.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="specialRequirements" className={labelClasses}>
          {t("specialRequirements")}
        </label>
        <textarea
          id="specialRequirements"
          rows={4}
          {...register("specialRequirements")}
          className={`${inputClasses} resize-none`}
          placeholder={t("specialReqPlaceholder")}
        />
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          t("submitting")
        ) : (
          <>
            {t("submitLuxury")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </button>

      <div className="mt-4">
        <FormTrustElements
          responseTime={t("responseTime")}
          freeConsultation={t("freeConsultation")}
          trustLicence={t("trustLicence")}
          trustClients={t("trustClients")}
          iataImageAlt={tCommon("iataAlt")}
          variant="dark"
        />
      </div>
    </form>
  );
}

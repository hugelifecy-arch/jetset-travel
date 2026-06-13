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
const buildCorporateSchema = (m: { required: string; invalidEmail: string }) =>
  z.object({
    companyName: z.string().min(2, m.required),
    email: z.string().email(m.invalidEmail),
    phone: z.string().min(5, m.required),
    travellers: z.string().min(1, m.required),
    travelDates: z.string().min(1, m.required),
    destinations: z.string().min(2, m.required),
    invoiceRequired: z.boolean(),
    notes: z.string().optional(),
  });

type CorporateFormData = z.infer<ReturnType<typeof buildCorporateSchema>>;

export default function CorporateForm({
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
    () => buildCorporateSchema(formMessages),
    [formMessages],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CorporateFormData>({
    resolver: zodResolver(schema),
    defaultValues: { invoiceRequired: false },
  });

  const onSubmit = async (data: CorporateFormData) => {
    setSubmitError(null);
    try {
      const recaptchaToken = await getRecaptchaToken("quote");
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "corporate",
          ...data,
          website: honeypotRef.current?.value || "",
          _formLoadedAt: formLoadedAt.current,
          _recaptchaToken: recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      trackLead({ content_name: "Corporate Quote", content_category: "corporate" });
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
          <label htmlFor="companyName" className={labelClasses}>
            {t("companyName")} *
          </label>
          <input
            id="companyName"
            type="text"
            {...register("companyName")}
            className={inputClasses}
            placeholder={t("companyPlaceholder")}
          />
          {errors.companyName && (
            <p className={errorClasses}>{errors.companyName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="corp-email" className={labelClasses}>
            {t("businessEmail")} *
          </label>
          <input
            id="corp-email"
            type="email"
            {...register("email")}
            className={inputClasses}
            placeholder={t("businessEmailPlaceholder")}
          />
          {errors.email && (
            <p className={errorClasses}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="corp-phone" className={labelClasses}>
            {t("phone")} *
          </label>
          <input
            id="corp-phone"
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
          <label htmlFor="travellers" className={labelClasses}>
            {t("travellers")} *
          </label>
          <input
            id="travellers"
            type="text"
            {...register("travellers")}
            className={inputClasses}
            placeholder={t("travellersPlaceholder")}
          />
          {errors.travellers && (
            <p className={errorClasses}>{errors.travellers.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="travelDates" className={labelClasses}>
            {t("travelDates")} *
          </label>
          <input
            id="travelDates"
            type="text"
            {...register("travelDates")}
            className={inputClasses}
            placeholder={t("datesPlaceholder")}
          />
          {errors.travelDates && (
            <p className={errorClasses}>{errors.travelDates.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="corp-destinations" className={labelClasses}>
            {t("destinations")} *
          </label>
          <input
            id="corp-destinations"
            type="text"
            {...register("destinations")}
            className={inputClasses}
            placeholder={t("destPlaceholder")}
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
          {t("vatInvoice")}
        </label>
      </div>

      <div>
        <label htmlFor="corp-notes" className={labelClasses}>
          {t("additionalNotes")}
        </label>
        <textarea
          id="corp-notes"
          rows={4}
          {...register("notes")}
          className={`${inputClasses} resize-none`}
          placeholder={t("notesPlaceholder")}
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
            {t("submitCorporate")}
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

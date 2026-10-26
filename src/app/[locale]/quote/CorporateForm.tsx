"use client";

import { useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { useFormMessages } from "@/components/forms/useFormMessages";
import { trackLead } from "@/lib/analytics/fbpixel";
import { trackFormError, trackFormSuccess } from "@/lib/analytics/gtag";
import FormTrustElements from "@/components/forms/FormTrustElements";
import {
  inputClasses,
  labelClasses,
  errorClasses,
  type QuoteTFunction,
} from "./shared";
import { enquiryAttribution } from "@/lib/attribution";
import { useEnquiryStart } from "@/lib/analytics/useEnquiryStart";
import { createLazyResolver } from "@/components/forms/lazyResolver";
import type { CorporateFormData } from "./validation";

export default function CorporateForm({
  onSuccess,
  t,
}: {
  onSuccess: () => void;
  t: QuoteTFunction;
}) {
  const markEnquiryStart = useEnquiryStart("corporate_quote");
  const tCommon = useTranslations("common");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formLoadedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const formMessages = useFormMessages();
  // zod (in ./validation) is fetched on first focus/submit, not with the page.
  const validation = useMemo(
    () =>
      createLazyResolver<CorporateFormData>(() =>
        import("./validation").then((m) => m.corporateResolver(formMessages)),
      ),
    [formMessages],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CorporateFormData>({
    resolver: validation.resolver,
    defaultValues: { invoiceRequired: false },
  });
  // Single source of truth for the VAT switch: the form value. The previous
  // version flipped aria-checked by hand, so clicking the label toggled the
  // checkbox without updating the switch (audit F-15).
  const invoiceRequired = useWatch({ control, name: "invoiceRequired" });

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
          locale: document.documentElement.lang,
          _attribution: enquiryAttribution(),
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      trackFormSuccess("corporate_quote");
      trackLead({ content_name: "Corporate Quote", content_category: "corporate" });
      onSuccess();
    } catch {
      trackFormError("corporate_quote", "network_or_server");
      setSubmitError(t("submitError"));
    }
  };

  return (
    <form
      onFocus={() => {
        markEnquiryStart();
        validation.preload();
      }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
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
          aria-checked={Boolean(invoiceRequired)}
          aria-labelledby="invoiceRequired-label"
          onClick={() =>
            setValue("invoiceRequired", !invoiceRequired, { shouldDirty: true })
          }
          className="group relative inline-flex h-6 w-11 items-center rounded-full bg-brand-navy/20 transition-colors aria-[checked=true]:bg-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          <span className="inline-block h-4 w-4 rounded-full bg-white transition-transform translate-x-1 group-aria-[checked=true]:translate-x-6" />
        </button>
        <input
          id="invoiceRequired"
          type="checkbox"
          tabIndex={-1}
          aria-hidden="true"
          {...register("invoiceRequired")}
          className="sr-only"
        />
        <label
          id="invoiceRequired-label"
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

      {submitError && <p className="text-sm text-red-700">{submitError}</p>}

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

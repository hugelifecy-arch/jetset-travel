"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle } from "lucide-react";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { useFormMessages } from "@/components/forms/useFormMessages";
import { trackLead } from "@/lib/analytics/fbpixel";
import { trackFormError, trackFormSuccess } from "@/lib/analytics/gtag";
import { enquiryAttribution } from "@/lib/attribution";
import { useEnquiryStart } from "@/lib/analytics/useEnquiryStart";
import { FLIGHT_NUMBER_PATTERN, VIP_AIRPORTS, VIP_SERVICES } from "@/lib/quote-schemas";
import { focusAndReveal } from "@/lib/focus-reveal";

/*
 * VIP airport quick request: meet & assist at Larnaca (LCA) or Paphos (PFO).
 * Posts `type: "vip"` to /api/quote with the same anti-spam fields (honeypot,
 * load timestamp, reCAPTCHA "quote" action) and analytics as the other quote
 * forms: generate_lead only after the server accepts the request, and no
 * personal data in any analytics call. Reusable on any page; pass onSuccess
 * to show your own confirmation, otherwise a short one renders in place.
 */

const inputClasses =
  "w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/70 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors aria-[invalid=true]:border-red-700";
const labelClasses = "block text-sm font-semibold text-brand-navy mb-2";
const helpClasses = "mt-1.5 text-xs text-brand-navy/70";
const errorClasses = "mt-1.5 text-sm text-red-700";
const choiceClasses =
  "flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-brand-navy/20 px-4 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:border-brand-gold has-[:checked]:border-brand-gold has-[:checked]:bg-brand-gold/10 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#2E86C1]";
const radioClasses = "h-4 w-4 shrink-0 accent-brand-gold-ink";

const buildVipSchema = (m: { required: string; invalidEmail: string; flightNumberInvalid: string }) =>
  z.object({
    name: z.string().trim().min(2, m.required).max(80),
    email: z.string().trim().email(m.invalidEmail).max(120),
    phone: z.string().trim().min(5, m.required).max(30),
    airport: z.enum(VIP_AIRPORTS, { message: m.required }),
    service: z.enum(VIP_SERVICES, { message: m.required }),
    date: z.string().trim().min(1, m.required).max(80),
    flightNumber: z.string().trim().max(12, m.flightNumberInvalid)
      .regex(FLIGHT_NUMBER_PATTERN, m.flightNumberInvalid).optional(),
    passengers: z.string().trim().min(1, m.required).max(20),
    notes: z.string().trim().max(2000).optional(),
  });

type VipFormData = z.infer<ReturnType<typeof buildVipSchema>>;

/** Visual (DOM) order, used to focus the first field with an error. */
const FIELD_ORDER: ReadonlyArray<keyof VipFormData> = [
  "airport", "service", "date", "flightNumber", "passengers", "name", "email", "phone", "notes",
];

export default function VipAirportForm({ onSuccess }: { onSuccess?: () => void }) {
  const t = useTranslations("vipForm");
  const markEnquiryStart = useEnquiryStart("vip_airport_request");
  const id = useId();
  const fid = (name: string) => `${id}-${name}`;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const formLoadedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);

  const formMessages = useFormMessages();
  const schema = useMemo(
    () => buildVipSchema({ ...formMessages, flightNumberInvalid: t("flightNumberInvalid") }),
    [formMessages, t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VipFormData>({
    resolver: zodResolver(schema),
    // onInvalid moves focus so the field isn't left under the sticky header.
    shouldFocusError: false,
  });

  useEffect(() => {
    if (sent) focusAndReveal(sentRef.current);
  }, [sent]);

  const onInvalid = (invalid: FieldErrors<VipFormData>) => {
    const first = FIELD_ORDER.find((name) => invalid[name]);
    if (first) focusAndReveal(formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`));
  };

  /** aria wiring for a field: invalid flag plus help/error descriptions. */
  const describe = (name: keyof VipFormData, help?: boolean) => {
    const ids = [help ? fid(`${name}-help`) : null, errors[name] ? fid(`${name}-error`) : null]
      .filter(Boolean)
      .join(" ");
    return {
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": ids || undefined,
    } as const;
  };
  /** Radio groups: the fieldset carries the help/error description. */
  const groupDescribedBy = (name: keyof VipFormData, help?: boolean) =>
    describe(name, help)["aria-describedby"];
  const fieldError = (name: keyof VipFormData) =>
    errors[name] ? (
      <p id={fid(`${name}-error`)} className={errorClasses}>
        {errors[name]?.message}
      </p>
    ) : null;

  const onSubmit = async (data: VipFormData) => {
    setSubmitError(null);
    try {
      const recaptchaToken = await getRecaptchaToken("quote");
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "vip",
          ...data,
          website: honeypotRef.current?.value || "",
          _formLoadedAt: formLoadedAt.current,
          _recaptchaToken: recaptchaToken,
          locale: document.documentElement.lang,
          _attribution: enquiryAttribution(),
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      trackFormSuccess("vip_airport_request");
      trackLead({ content_name: "VIP Airport Service", content_category: "vip" });
      if (onSuccess) onSuccess();
      else setSent(true);
    } catch {
      trackFormError("vip_airport_request", "network_or_server");
      setSubmitError(t("submitError"));
    }
  };

  if (sent) {
    return (
      <div
        ref={sentRef}
        role="status"
        tabIndex={-1}
        className="flex items-start gap-3 rounded-2xl border border-brand-gold/40 bg-brand-gold/5 p-6"
      >
        <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-brand-gold-ink" aria-hidden="true" />
        <div>
          <p className="font-semibold text-brand-navy">{t("successTitle")}</p>
          <p className="mt-1 text-sm text-brand-navy/70">{t("successMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onFocus={markEnquiryStart}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="space-y-5"
    >
      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" ref={honeypotRef} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <fieldset aria-describedby={groupDescribedBy("airport", true)}>
          <legend className={labelClasses}>{t("airport")} *</legend>
          <div className="grid grid-cols-1 gap-2">
            {VIP_AIRPORTS.map((code) => (
              <label key={code} className={choiceClasses}>
                <input type="radio" value={code} {...register("airport")} className={radioClasses} />
                {t(`airport${code}`)}
              </label>
            ))}
          </div>
          <p id={fid("airport-help")} className={helpClasses}>{t("airportHelp")}</p>
          {fieldError("airport")}
        </fieldset>

        <fieldset aria-describedby={groupDescribedBy("service")}>
          <legend className={labelClasses}>{t("service")} *</legend>
          <div className="grid grid-cols-1 gap-2">
            {VIP_SERVICES.map((service) => (
              <label key={service} className={choiceClasses}>
                <input type="radio" value={service} {...register("service")} className={radioClasses} />
                {t(service === "arrival" ? "serviceArrival" : service === "departure" ? "serviceDeparture" : "serviceBoth")}
              </label>
            ))}
          </div>
          {fieldError("service")}
        </fieldset>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={fid("date")} className={labelClasses}>{t("date")} *</label>
          <input
            id={fid("date")}
            type="text"
            maxLength={80}
            {...register("date")}
            {...describe("date", true)}
            className={inputClasses}
            placeholder={t("datePlaceholder")}
          />
          <p id={fid("date-help")} className={helpClasses}>{t("dateHelp")}</p>
          {fieldError("date")}
        </div>
        <div>
          <label htmlFor={fid("flightNumber")} className={labelClasses}>
            {t("flightNumber")} <span className="font-normal text-brand-navy/70">({t("optional")})</span>
          </label>
          <input
            id={fid("flightNumber")}
            type="text"
            maxLength={12}
            autoCapitalize="characters"
            autoComplete="off"
            {...register("flightNumber")}
            {...describe("flightNumber", true)}
            className={inputClasses}
            placeholder={t("flightNumberPlaceholder")}
          />
          <p id={fid("flightNumber-help")} className={helpClasses}>{t("flightNumberHelp")}</p>
          {fieldError("flightNumber")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={fid("passengers")} className={labelClasses}>{t("passengers")} *</label>
          <input
            id={fid("passengers")}
            type="text"
            maxLength={20}
            {...register("passengers")}
            {...describe("passengers")}
            className={inputClasses}
            placeholder={t("passengersPlaceholder")}
          />
          {fieldError("passengers")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={fid("name")} className={labelClasses}>{t("name")} *</label>
          <input
            id={fid("name")}
            type="text"
            autoComplete="name"
            maxLength={80}
            {...register("name")}
            {...describe("name")}
            className={inputClasses}
            placeholder={t("namePlaceholder")}
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor={fid("email")} className={labelClasses}>{t("email")} *</label>
          <input
            id={fid("email")}
            type="email"
            autoComplete="email"
            maxLength={120}
            {...register("email")}
            {...describe("email")}
            className={inputClasses}
            placeholder={t("emailPlaceholder")}
          />
          {fieldError("email")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={fid("phone")} className={labelClasses}>{t("phone")} *</label>
          <input
            id={fid("phone")}
            type="tel"
            autoComplete="tel"
            maxLength={30}
            {...register("phone")}
            {...describe("phone")}
            className={inputClasses}
            placeholder={t("phonePlaceholder")}
          />
          {fieldError("phone")}
        </div>
      </div>

      <div>
        <label htmlFor={fid("notes")} className={labelClasses}>
          {t("notes")} <span className="font-normal text-brand-navy/70">({t("optional")})</span>
        </label>
        <textarea
          id={fid("notes")}
          rows={3}
          maxLength={2000}
          {...register("notes")}
          className={`${inputClasses} resize-none`}
          placeholder={t("notesPlaceholder")}
        />
      </div>

      {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          t("submitting")
        ) : (
          <>
            {t("submit")}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}

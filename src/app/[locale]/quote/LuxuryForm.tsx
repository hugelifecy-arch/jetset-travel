"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Hotel,
  House,
  Plane,
  PlaneLanding,
  Sailboat,
  Ship,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
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
import { TRIP_TYPES, type TripType } from "@/lib/quote-schemas";
import { focusAndReveal } from "@/lib/focus-reveal";

/*
 * Luxury trip request as a 3-step wizard (audit item 18):
 *   1. what to arrange (multi-select cards) → 2. trip details → 3. contact.
 * One react-hook-form instance holds every step, so going Back keeps what was
 * typed. Each Next validates only that step's fields; the final submit sends
 * the same luxury payload as before plus `tripTypes`, with the unchanged
 * anti-spam fields and analytics (generate_lead only after server success).
 */

const TRIP_OPTIONS: ReadonlyArray<{ value: TripType; labelKey: string; Icon: LucideIcon }> = [
  { value: "cruise", labelKey: "tripCruise", Icon: Ship },
  { value: "villa", labelKey: "tripVilla", Icon: House },
  { value: "vip-airport", labelKey: "tripVip", Icon: PlaneLanding },
  { value: "private-jet", labelKey: "tripJet", Icon: Plane },
  { value: "yacht", labelKey: "tripYacht", Icon: Sailboat },
  { value: "hotel", labelKey: "tripHotel", Icon: Hotel },
  { value: "other", labelKey: "tripOther", Icon: Sparkles },
];

/* Validation messages come from the `forms` namespace so they localize;
   errors render directly under their field, so the generic strings stay
   unambiguous. */
const buildLuxurySchema = (m: { required: string; invalidEmail: string; tripTypes: string }) =>
  z.object({
    tripTypes: z.array(z.enum(TRIP_TYPES)).min(1, m.tripTypes).max(TRIP_TYPES.length),
    destinations: z.string().trim().min(2, m.required).max(200),
    dates: z.string().trim().min(1, m.required).max(80),
    groupSize: z.string().trim().min(1, m.required).max(50),
    budget: z.string().min(1, m.required),
    name: z.string().trim().min(2, m.required).max(80),
    email: z.string().trim().email(m.invalidEmail).max(120),
    phone: z.string().trim().min(5, m.required).max(30),
    specialRequirements: z.string().trim().max(2000).optional(),
  });

type LuxuryFormData = z.infer<ReturnType<typeof buildLuxurySchema>>;

const STEP_FIELDS: ReadonlyArray<ReadonlyArray<keyof LuxuryFormData>> = [
  ["tripTypes"],
  ["destinations", "dates", "groupSize", "budget"],
  ["name", "email", "phone", "specialRequirements"],
];
const LAST_STEP = STEP_FIELDS.length - 1;

/* Focus rings come from the site-wide *:focus-visible rule (globals.css). */
const fieldClasses = `${inputClasses} aria-[invalid=true]:border-red-700`;
const primaryButton =
  "inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
const secondaryButton =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-brand-navy/20 px-5 py-3 text-sm font-semibold text-brand-navy hover:border-brand-gold transition-colors";

export default function LuxuryForm({
  onSuccess,
  t,
}: {
  onSuccess: () => void;
  t: QuoteTFunction;
}) {
  const markEnquiryStart = useEnquiryStart("luxury_quote");
  const tCommon = useTranslations("common");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const formLoadedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const stepTopRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepChanged = useRef(false);

  const formMessages = useFormMessages();
  const schema = useMemo(
    () => buildLuxurySchema({ ...formMessages, tripTypes: t("tripTypesError") }),
    [formMessages, t],
  );
  const {
    register,
    control,
    trigger,
    getFieldState,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LuxuryFormData>({
    resolver: zodResolver(schema),
    // Focus is moved by revealFirstError so the field isn't left under the sticky header.
    shouldFocusError: false,
    defaultValues: {
      tripTypes: [],
      destinations: "",
      dates: "",
      groupSize: "",
      budget: "",
      name: "",
      email: "",
      phone: "",
      specialRequirements: "",
    },
  });

  // Move focus to the new step's heading (it announces "Step 2 of 3 …") so
  // keyboard and screen-reader users land at the top of the new content.
  useEffect(() => {
    if (!stepChanged.current) return;
    focusAndReveal(headingRef.current, { scrollTarget: stepTopRef.current, block: "start" });
  }, [step]);

  const goToStep = (next: number) => {
    stepChanged.current = true;
    setStep(next);
  };

  /** Focus the first invalid field of the given names (in step order). */
  const revealFirstError = (names: ReadonlyArray<keyof LuxuryFormData>) => {
    const first = names.find((name) => getFieldState(name).invalid);
    if (!first) return;
    const control = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    // The trip-type error sits under the step heading: show the step from its top.
    if (first === "tripTypes") focusAndReveal(control, { scrollTarget: stepTopRef.current, block: "start" });
    else focusAndReveal(control);
  };

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    if (await trigger([...fields])) goToStep(Math.min(step + 1, LAST_STEP));
    else revealFirstError(fields);
  };

  /** Re-check a field as it is edited, but only once it is showing an error. */
  const field = (name: keyof LuxuryFormData) =>
    register(name, {
      onChange: () => {
        if (getFieldState(name).invalid) void trigger(name);
      },
    });

  /** aria wiring so an error is announced with its field. */
  const a11y = (name: keyof LuxuryFormData, id: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-error` : undefined,
  });
  const fieldError = (name: keyof LuxuryFormData, id: string) =>
    errors[name] ? (
      <p id={`${id}-error`} className={errorClasses}>
        {errors[name]?.message}
      </p>
    ) : null;

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
          locale: document.documentElement.lang,
          _attribution: enquiryAttribution(),
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      trackFormSuccess("luxury_quote");
      trackLead({ content_name: "Luxury Quote", content_category: "luxury" });
      onSuccess();
    } catch {
      trackFormError("luxury_quote", "network_or_server");
      setSubmitError(t("submitError"));
    }
  };

  // A field from an earlier step can only fail here if it was edited after
  // that step was passed; take the visitor back to it.
  const onInvalid = (invalid: FieldErrors<LuxuryFormData>) => {
    const target = STEP_FIELDS.findIndex((fields) => fields.some((name) => invalid[name]));
    if (target !== -1 && target !== step) goToStep(target);
    else revealFirstError(STEP_FIELDS[step]);
  };

  const onFormSubmit =
    step < LAST_STEP
      ? (event: FormEvent<HTMLFormElement>) => {
          // Enter in a field (or the Next button) advances instead of submitting.
          event.preventDefault();
          void goNext();
        }
      : handleSubmit(onSubmit, onInvalid);

  const headingId = "lux-step-heading";
  const stepTitle = [t("step1Title"), t("step2Title"), t("step3Title")][step];
  const stepHint = step === 0 ? t("step1Hint") : step === 1 ? t("step2Hint") : null;

  return (
    <form ref={formRef} onFocus={markEnquiryStart} onSubmit={onFormSubmit} noValidate className="space-y-6">
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

      {/* Progress */}
      <div ref={stepTopRef} className="scroll-mt-28">
        <div className="flex gap-2" aria-hidden="true">
          {STEP_FIELDS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors motion-reduce:transition-none ${
                i <= step ? "bg-brand-gold" : "bg-brand-navy/10"
              }`}
            />
          ))}
        </div>
        <h3
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="mt-5 text-xl md:text-2xl font-bold text-brand-navy"
        >
          <span className="block font-sans text-xs font-semibold uppercase tracking-wider text-brand-gold-ink mb-2">
            {t("stepProgress", { current: step + 1, total: STEP_FIELDS.length })}
          </span>
          <span className="sr-only">: </span>
          {stepTitle}
        </h3>
        {stepHint && (
          <p id="lux-step-hint" className="mt-2 text-sm text-brand-navy/70">
            {stepHint}
          </p>
        )}
      </div>

      {step === 0 && (
        <Controller
          control={control}
          name="tripTypes"
          render={({ field: { value, onChange, ref } }) => {
            const selected = new Set(value ?? []);
            const toggle = (type: TripType) => {
              const next = TRIP_TYPES.filter((option) =>
                option === type ? !selected.has(option) : selected.has(option),
              );
              onChange(next);
              if (getFieldState("tripTypes").invalid) void trigger("tripTypes");
            };
            return (
              <fieldset
                aria-labelledby={headingId}
                aria-describedby={
                  ["lux-step-hint", errors.tripTypes ? "lux-tripTypes-error" : ""]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                {/* Above the cards so it is in view on phones, next to the question. */}
                {errors.tripTypes && (
                  <p id="lux-tripTypes-error" role="alert" className="mb-3 text-sm text-red-700">
                    {errors.tripTypes.message}
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TRIP_OPTIONS.map(({ value: type, labelKey, Icon }, index) => (
                    <label
                      key={type}
                      className={`group relative flex min-h-[96px] cursor-pointer items-center gap-3 rounded-2xl border-2 border-brand-navy/10 p-4 transition-colors hover:border-brand-gold has-[:checked]:border-brand-gold has-[:checked]:bg-brand-gold/5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#2E86C1] ${
                        type === "other"
                          ? "col-span-2 sm:col-span-3 flex-row justify-center min-h-[64px]"
                          : "flex-col justify-center text-center"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="tripTypes"
                        value={type}
                        checked={selected.has(type)}
                        onChange={() => toggle(type)}
                        ref={index === 0 ? ref : undefined}
                        aria-invalid={errors.tripTypes ? true : undefined}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full border border-brand-navy/25 bg-white group-has-[:checked]:border-brand-gold-ink group-has-[:checked]:bg-brand-gold-ink"
                      >
                        <Check className="h-3.5 w-3.5 text-white opacity-0 group-has-[:checked]:opacity-100" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold-ink transition-colors group-has-[:checked]:bg-brand-gold group-has-[:checked]:text-brand-navy"
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-semibold leading-snug text-brand-navy">
                        {t(labelKey)}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          }}
        />
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="lux-destinations" className={labelClasses}>
                {t("luxuryDest")} *
              </label>
              <input
                id="lux-destinations"
                type="text"
                maxLength={200}
                {...field("destinations")}
                {...a11y("destinations", "lux-destinations")}
                className={fieldClasses}
                placeholder={t("luxuryDestPlaceholder")}
              />
              {fieldError("destinations", "lux-destinations")}
            </div>
            <div>
              <label htmlFor="lux-dates" className={labelClasses}>
                {t("luxuryDates")} *
              </label>
              <input
                id="lux-dates"
                type="text"
                maxLength={80}
                {...field("dates")}
                {...a11y("dates", "lux-dates")}
                className={fieldClasses}
                placeholder={t("luxuryDatesPlaceholder")}
              />
              {fieldError("dates", "lux-dates")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="groupSize" className={labelClasses}>
                {t("groupSize")} *
              </label>
              <input
                id="groupSize"
                type="text"
                maxLength={50}
                {...field("groupSize")}
                {...a11y("groupSize", "groupSize")}
                className={fieldClasses}
                placeholder={t("groupSizePlaceholder")}
              />
              {fieldError("groupSize", "groupSize")}
            </div>
            <div>
              <label htmlFor="budget" className={labelClasses}>
                {t("budgetRange")} *
              </label>
              <select
                id="budget"
                {...field("budget")}
                {...a11y("budget", "budget")}
                className={fieldClasses}
              >
                <option value="" disabled>
                  {t("selectBudget")}
                </option>
                <option value="under-2k">{t("budgetUnder2k")}</option>
                <option value="2k-5k">{t("budget2k5k")}</option>
                <option value="5k-10k">{t("budget5k10k")}</option>
                <option value="10k-plus">{t("budget10kPlus")}</option>
              </select>
              {fieldError("budget", "budget")}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label htmlFor="lux-name" className={labelClasses}>
              {t("fullName")} *
            </label>
            <input
              id="lux-name"
              type="text"
              autoComplete="name"
              maxLength={80}
              {...field("name")}
              {...a11y("name", "lux-name")}
              className={fieldClasses}
              placeholder={t("namePlaceholder")}
            />
            {fieldError("name", "lux-name")}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="lux-email" className={labelClasses}>
                {t("email")} *
              </label>
              <input
                id="lux-email"
                type="email"
                autoComplete="email"
                maxLength={120}
                {...field("email")}
                {...a11y("email", "lux-email")}
                className={fieldClasses}
                placeholder={t("emailPlaceholder")}
              />
              {fieldError("email", "lux-email")}
            </div>
            <div>
              <label htmlFor="lux-phone" className={labelClasses}>
                {t("phone")} *
              </label>
              <input
                id="lux-phone"
                type="tel"
                autoComplete="tel"
                maxLength={30}
                {...field("phone")}
                {...a11y("phone", "lux-phone")}
                className={fieldClasses}
                placeholder={t("phonePlaceholder")}
              />
              {fieldError("phone", "lux-phone")}
            </div>
          </div>

          <div>
            <label htmlFor="specialRequirements" className={labelClasses}>
              {t("specialRequirements")}
            </label>
            <textarea
              id="specialRequirements"
              rows={4}
              maxLength={2000}
              {...field("specialRequirements")}
              className={`${fieldClasses} resize-none`}
              placeholder={t("specialReqPlaceholder")}
            />
          </div>
        </div>
      )}

      {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}

      <div className="flex items-center gap-3 sm:justify-between">
        {step > 0 && (
          <button type="button" onClick={() => goToStep(step - 1)} className={secondaryButton}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t("back")}
          </button>
        )}
        {step < LAST_STEP ? (
          <button key="next" type="submit" className={`${primaryButton} flex-1 sm:flex-none sm:ml-auto`}>
            {t("next")}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            disabled={isSubmitting}
            className={`${primaryButton} flex-1 sm:flex-none sm:ml-auto`}
          >
            {isSubmitting ? (
              t("submitting")
            ) : (
              <>
                {t("submitLuxury")}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>

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

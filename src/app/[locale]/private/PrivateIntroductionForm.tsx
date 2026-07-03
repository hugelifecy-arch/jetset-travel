"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getRecaptchaToken } from "@/lib/recaptcha";

/*
 * Deliberately stripped-down enquiry form for the Private & Family Office
 * Travel page: name, organisation (optional), email, phone (optional),
 * preferred contact method, message (optional). Per the page spec there is
 * no budget field, no travel-date field and no trip-type dropdown.
 *
 * All strings arrive as props from the server page so this client
 * component ships no extra message namespace in the RSC payload.
 */

export interface PrivateFormLabels {
  name: string;
  organisation: string;
  email: string;
  phone: string;
  method: string;
  methodPhone: string;
  methodEmail: string;
  methodWhatsApp: string;
  message: string;
  optional: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  required: string;
  invalidEmail: string;
}

function createSchema(labels: PrivateFormLabels) {
  return z.object({
    name: z.string().min(2, labels.required),
    organisation: z.string().optional(),
    email: z.string().email(labels.invalidEmail),
    phone: z.string().optional(),
    contactMethod: z.enum(["phone", "email", "whatsapp"], {
      message: labels.required,
    }),
    message: z.string().optional(),
  });
}

type PrivateFormData = z.infer<ReturnType<typeof createSchema>>;

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold";

export default function PrivateIntroductionForm({
  labels,
}: {
  labels: PrivateFormLabels;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formLoadedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrivateFormData>({
    resolver: zodResolver(createSchema(labels)),
  });

  const onSubmit = async (data: PrivateFormData) => {
    setSubmitError(null);
    try {
      const recaptchaToken = await getRecaptchaToken("private_enquiry");
      const res = await fetch("/api/private-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypotRef.current?.value || "",
          _formLoadedAt: formLoadedAt.current,
          _recaptchaToken: recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      setSubmitted(true);
    } catch {
      setSubmitError(labels.error);
    }
  };

  if (submitted) {
    return (
      <p
        role="status"
        className="max-w-xl text-lg leading-relaxed text-white/80"
      >
        {labels.success}
      </p>
    );
  }

  const contactMethods = [
    { value: "phone", label: labels.methodPhone },
    { value: "email", label: labels.methodEmail },
    { value: "whatsapp", label: labels.methodWhatsApp },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
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

      <div>
        <label
          htmlFor="private-name"
          className="mb-2 block text-sm font-medium text-white/80"
        >
          {labels.name}
        </label>
        <input
          id="private-name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "private-name-error" : undefined}
          {...register("name")}
          className={inputClass}
        />
        {errors.name && (
          <p
            id="private-name-error"
            role="alert"
            className="mt-1.5 text-sm text-red-400"
          >
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="private-organisation"
          className="mb-2 block text-sm font-medium text-white/80"
        >
          {labels.organisation}{" "}
          <span className="font-normal text-white/50">
            ({labels.optional})
          </span>
        </label>
        <input
          id="private-organisation"
          type="text"
          autoComplete="organization"
          {...register("organisation")}
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="private-email"
          className="mb-2 block text-sm font-medium text-white/80"
        >
          {labels.email}
        </label>
        <input
          id="private-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "private-email-error" : undefined}
          {...register("email")}
          className={inputClass}
        />
        {errors.email && (
          <p
            id="private-email-error"
            role="alert"
            className="mt-1.5 text-sm text-red-400"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="private-phone"
          className="mb-2 block text-sm font-medium text-white/80"
        >
          {labels.phone}{" "}
          <span className="font-normal text-white/50">
            ({labels.optional})
          </span>
        </label>
        <input
          id="private-phone"
          type="tel"
          autoComplete="tel"
          {...register("phone")}
          className={inputClass}
        />
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-white/80">
          {labels.method}
        </legend>
        <div className="flex flex-wrap gap-6">
          {contactMethods.map((method) => (
            <label
              key={method.value}
              className="inline-flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                value={method.value}
                aria-describedby={
                  errors.contactMethod ? "private-method-error" : undefined
                }
                {...register("contactMethod")}
                className="h-4 w-4 accent-brand-gold focus:ring-brand-gold"
              />
              <span className="text-sm text-white/80">{method.label}</span>
            </label>
          ))}
        </div>
        {errors.contactMethod && (
          <p
            id="private-method-error"
            role="alert"
            className="mt-1.5 text-sm text-red-400"
          >
            {errors.contactMethod.message}
          </p>
        )}
      </fieldset>

      <div>
        <label
          htmlFor="private-message"
          className="mb-2 block text-sm font-medium text-white/80"
        >
          {labels.message}{" "}
          <span className="font-normal text-white/50">
            ({labels.optional})
          </span>
        </label>
        <textarea
          id="private-message"
          rows={4}
          {...register("message")}
          className={`${inputClass} resize-none`}
        />
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-400">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}

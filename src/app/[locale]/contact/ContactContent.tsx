"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getRecaptchaToken } from "@/lib/recaptcha";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Calendar,
} from "lucide-react";
import FormTrustElements from "@/components/forms/FormTrustElements";

function createContactSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t("nameMinLength")),
    email: z.string().email(t("invalidEmail")),
    phone: z.string().min(8, t("phoneRequired")),
    companyName: z.string().optional(),
    travelType: z.string().optional(),
    contactMethod: z.string().optional(),
    message: z.string().optional(),
  });
}

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

const inputClass =
  "w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors";

export default function ContactContent() {
  const locale = useLocale();
  const t = useTranslations("contactPage");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formLoadedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const contactSchema = createContactSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: "+357 ",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    try {
      const recaptchaToken = await getRecaptchaToken("contact");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypotRef.current?.value || "",
          _formLoadedAt: formLoadedAt.current,
          _recaptchaToken: recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch {
      setSubmitError(t("submitError"));
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
            {t("heroLabel")}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Two-column: Info Card + Form */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Navy Info Card */}
            <div className="bg-brand-navy text-white rounded-2xl p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-8">
                  JetSet Travel Cyprus
                </h2>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">{t("officeAddress")}</p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        26A Agapinoros, 8049 Paphos, Cyprus
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">{t("telephone")}</p>
                      <a
                        href="tel:+35799478073"
                        className="block text-white/70 text-sm hover:text-brand-gold transition-colors"
                      >
                        +357 99 478 073
                      </a>
                      <a
                        href="tel:+35799310993"
                        className="block text-white/70 text-sm hover:text-brand-gold transition-colors"
                      >
                        +357 99 310 993
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">{t("email")}</p>
                      <a
                        href="mailto:info@jetset.com.cy"
                        className="text-white/70 text-sm hover:text-brand-gold transition-colors"
                      >
                        info@jetset.com.cy
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">{t("officeHours")}</p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {t("schedule")}
                        <br />
                        {t("scheduleWed")}
                        <br />
                        {t("scheduleSat")}
                        <br />
                        {t("scheduleSun")}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <a
                href={`https://wa.me/35799478073?text=${locale === "ru" ? encodeURIComponent("Здравствуйте, я хотел бы обсудить мои планы на поездку.") : encodeURIComponent("Hi, I'd like to discuss my travel plans.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white hover:bg-[#22c35e] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {t("chatWhatsApp")}
              </a>
            </div>

            {/* Right: Contact Form */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold mb-6">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-3">
                    {t("successTitle")}
                  </h3>
                  <p className="text-brand-navy/60 max-w-sm">
                    {t("successMessage")}
                  </p>
                </div>
              ) : (
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

                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-2">
                      {t("formTitle")}
                    </h2>
                    <p className="text-brand-navy/60 text-sm">
                      {t("formSubtitle")}
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-brand-navy mb-2"
                    >
                      {t("fullName")} *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      className={inputClass}
                      placeholder={t("namePlaceholder")}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-brand-navy mb-2"
                    >
                      {t("emailAddress")} *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={inputClass}
                      placeholder={t("emailPlaceholder")}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-brand-navy mb-2"
                    >
                      {t("phoneNumber")} *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className={inputClass}
                      placeholder={t("phonePlaceholder")}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-semibold text-brand-navy mb-2"
                    >
                      {t("companyName")}
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      {...register("companyName")}
                      className={inputClass}
                      placeholder={t("companyPlaceholder")}
                    />
                  </div>

                  {/* Travel Type */}
                  <div>
                    <label
                      htmlFor="travelType"
                      className="block text-sm font-semibold text-brand-navy mb-2"
                    >
                      {t("travelType")}
                    </label>
                    <select
                      id="travelType"
                      {...register("travelType")}
                      className={inputClass}
                    >
                      <option value="">{t("selectTravelType")}</option>
                      <option value="corporate">{t("travelTypeCorporate")}</option>
                      <option value="luxury">{t("travelTypeLuxury")}</option>
                      <option value="visa">{t("travelTypeVisa")}</option>
                      <option value="hotel">{t("travelTypeHotel")}</option>
                      <option value="other">{t("travelTypeOther")}</option>
                    </select>
                  </div>

                  {/* Preferred Contact Method */}
                  <fieldset>
                    <legend className="block text-sm font-semibold text-brand-navy mb-2">
                      {t("contactMethod")}
                    </legend>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="whatsapp"
                          {...register("contactMethod")}
                          className="h-4 w-4 border-brand-navy/30 text-brand-gold focus:ring-brand-gold"
                        />
                        <span className="text-sm text-brand-navy">{t("contactWhatsApp")}</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="phone"
                          {...register("contactMethod")}
                          className="h-4 w-4 border-brand-navy/30 text-brand-gold focus:ring-brand-gold"
                        />
                        <span className="text-sm text-brand-navy">{t("contactPhone")}</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="email"
                          {...register("contactMethod")}
                          className="h-4 w-4 border-brand-navy/30 text-brand-gold focus:ring-brand-gold"
                        />
                        <span className="text-sm text-brand-navy">{t("contactEmailOption")}</span>
                      </label>
                    </div>
                  </fieldset>

                  {/* Message / Trip Details */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-brand-navy mb-2"
                    >
                      {t("tripDetails")}
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      {...register("message")}
                      className={`${inputClass} resize-none`}
                      placeholder={t("tripDetailsPlaceholder")}
                    />
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-500">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      t("bookingConsultation")
                    ) : (
                      <>
                        {t("bookConsultation")}
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="mt-4">
                    <FormTrustElements
                      responseTime={t("responseTime")}
                      freeConsultation={t("freeConsultation")}
                      trustLicence={t("trustLicence")}
                      trustClients={t("trustClients")}
                      variant="dark"
                    />
                  </div>

                  {/* How It Works */}
                  <div className="border-t border-brand-navy/10 pt-5 mt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-navy/50 mb-3">
                      {t("howItWorks")}
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-sm text-brand-navy/60">
                      <span className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold/15 text-[10px] font-bold text-brand-gold">1</span>
                        {t("howStep1")}
                      </span>
                      <span className="hidden sm:inline text-brand-navy/30">&rarr;</span>
                      <span className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold/15 text-[10px] font-bold text-brand-gold">2</span>
                        {t("howStep2")}
                      </span>
                      <span className="hidden sm:inline text-brand-navy/30">&rarr;</span>
                      <span className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold/15 text-[10px] font-bold text-brand-gold">3</span>
                        {t("howStep3")}
                      </span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Calendly Scheduling Section */}
      <section className="bg-brand-light py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Calendar className="mx-auto h-10 w-10 text-brand-gold mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
              {t("calendlyTitle")}
            </h2>
            <p className="text-brand-navy/60 mb-8">
              {t("calendlySubtitle")}
            </p>
            {/* TODO: Replace with actual Calendly URL once set up by the business owner */}
            <a
              href="https://calendly.com/jetset-travel/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy px-8 py-4 text-sm font-semibold text-white hover:bg-brand-navy/90 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              {t("calendlyButton")}
            </a>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("findUs")}
            </h2>
            <p className="text-brand-navy/60">
              {t("findUsSubtitle")}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-brand-navy/10 shadow-sm">
            <iframe
              title="JetSet Travel Paphos Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d815.4!2d32.4224!3d34.7604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ1JzM3LjQiTiAzMsKwMjUnMjAuNiJF!5e0!3m2!1sen!2scy!4v1700000000000"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Contact details below map */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-brand-navy">{t("officeAddress")}</p>
                <p className="text-sm text-brand-navy/60">{t("mapAddress")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-brand-navy">{t("telephone")}</p>
                <p className="text-sm text-brand-navy/60">{t("mapPhone")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-brand-navy">{t("email")}</p>
                <a href="mailto:info@jetset.com.cy" className="text-sm text-brand-navy/60 hover:text-brand-gold transition-colors">
                  {t("mapEmail")}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-brand-navy">{t("officeHours")}</p>
                <p className="text-sm text-brand-navy/60 leading-relaxed">
                  {t("mapHoursLine1")}<br />
                  {t("mapHoursLine2")}<br />
                  {t("mapHoursLine3")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://maps.google.com/?q=26A+Agapinoros+8049+Paphos+Cyprus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy/90 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              {t("getDirections")}
            </a>
          </div>
        </div>
      </section>

      {/* IATA + Tourism Strip */}
      <section className="py-12 bg-white border-t border-brand-navy/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 relative">
                <Image
                  src="/images/iata-logo.jpg"
                  alt="IATA Accredited Agent"
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-navy">
                  {t("iataAccredited")}
                </p>
                <p className="text-xs text-brand-navy/50">
                  {t("iataOrg")}
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-brand-navy/10" />
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 relative">
                <Image
                  src="/images/tourism-logo.jpg"
                  alt="Cyprus Tourism Organisation Licensed"
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-navy">
                  {t("ctoLicensed")}
                </p>
                <p className="text-xs text-brand-navy/50">
                  {t("ctoOrg")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

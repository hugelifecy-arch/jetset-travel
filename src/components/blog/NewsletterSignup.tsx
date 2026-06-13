"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";

export default function NewsletterSignup() {
  const t = useTranslations("blogPage");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-brand-light">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="h-8 w-8 text-brand-gold mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-brand-navy mb-2">
          {t("newsletterTitle")}
        </h2>
        <p className="text-brand-navy/60 mb-6">
          {t("newsletterSubtitle")}
        </p>
        {submitted ? (
          <p className="text-brand-gold font-semibold">
            {t("newsletterSuccess")}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletterPlaceholder")}
              aria-label={t("newsletterPlaceholder")}
              required
              className="flex-1 px-4 py-3 rounded-xl border border-brand-navy/10 bg-white text-sm text-brand-navy placeholder:text-brand-navy/40 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-gold text-brand-navy text-sm font-semibold hover:bg-brand-gold/90 transition-colors whitespace-nowrap"
            >
              {t("newsletterButton")}
            </button>
          </form>
        )}
        <p className="text-xs text-brand-navy/40 mt-3">
          {t("newsletterGdpr")}
        </p>
      </div>
    </section>
  );
}

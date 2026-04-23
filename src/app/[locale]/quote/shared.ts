import type { useTranslations } from "next-intl";

export const inputClasses =
  "w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors";
export const labelClasses = "block text-sm font-semibold text-brand-navy mb-2";
export const errorClasses = "mt-1.5 text-sm text-red-500";

export type QuoteTFunction = ReturnType<typeof useTranslations<"quotePage">>;

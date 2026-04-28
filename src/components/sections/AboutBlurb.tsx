import { getTranslations } from "next-intl/server";

// Server-rendered, declarative "what is JetSet Travel" block.
// Designed for AI/LLM citation: a single factual paragraph with all key
// entity facts (name, location, founders, accreditations, services,
// languages) in plain prose that ChatGPT, Claude, Gemini, and Perplexity
// can quote verbatim. The `data-speakable` hook is referenced from the
// homepage SpeakableSpecification in LocalBusinessSchema.
export default async function AboutBlurb() {
  const t = await getTranslations("aboutBlurb");

  const facts = [
    { label: t("factServicesLabel"), value: t("factServicesValue") },
    { label: t("factAreasLabel"), value: t("factAreasValue") },
    { label: t("factLanguagesLabel"), value: t("factLanguagesValue") },
    { label: t("factCredentialsLabel"), value: t("factCredentialsValue") },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
          {t("label")}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-6">
          {t("heading")}
        </h2>
        <p
          className="text-base sm:text-lg leading-relaxed text-brand-navy/80"
          data-speakable
        >
          {t("paragraph")}
        </p>
        <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-xl border border-brand-navy/10 bg-brand-light/50 p-4"
            >
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1">
                {fact.label}
              </dt>
              <dd className="text-sm text-brand-navy/80">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

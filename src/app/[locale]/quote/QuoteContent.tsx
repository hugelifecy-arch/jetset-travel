"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type Ref } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Building2,
  Palmtree,
  PlaneLanding,
  CheckCircle,
  MessageCircle,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import CorporateForm from "./CorporateForm";
import LuxuryForm from "./LuxuryForm";
import VipAirportForm from "@/components/forms/VipAirportForm";
import FormTrustElements from "@/components/forms/FormTrustElements";
import type { QuoteTFunction } from "./shared";
import { focusAndReveal } from "@/lib/focus-reveal";

function SuccessScreen({
  t,
  headingRef,
}: {
  t: QuoteTFunction;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const locale = useLocale();
  const whatsAppText =
    locale === "ru"
      ? "Здравствуйте, я только что отправил запрос на предложение на вашем сайте."
      : "Hi, I just submitted a quote request on your website.";
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 lg:py-24">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-gold/10 mb-8">
        <CheckCircle className="h-10 w-10 text-brand-gold" />
      </div>
      <h2 ref={headingRef} tabIndex={-1} className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
        {t("successTitle")}
      </h2>
      <p className="text-brand-navy/70 text-lg max-w-md mb-8">
        {t("successMessage")}
      </p>
      <a
        href={`https://wa.me/35799478073?text=${encodeURIComponent(whatsAppText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-brand-dark hover:bg-[#22c35e] transition-colors"
      >
        <MessageCircle className="h-5 w-5" />
        {t("successWhatsApp")}
      </a>
    </div>
  );
}

type QuoteBranch = "corporate" | "luxury" | "vip" | null;

const BRANCHES: ReadonlyArray<{
  id: Exclude<QuoteBranch, null>;
  Icon: LucideIcon;
  title: string;
  desc: string;
  enquiry: string;
}> = [
  { id: "corporate", Icon: Building2, title: "corporateTitle", desc: "corporateDesc", enquiry: "corporateEnquiry" },
  { id: "luxury", Icon: Palmtree, title: "luxuryTitle", desc: "luxuryDesc", enquiry: "luxuryEnquiry" },
  { id: "vip", Icon: PlaneLanding, title: "vipTitle", desc: "vipDesc", enquiry: "vipEnquiry" },
];

export default function QuoteContent() {
  const type = useSearchParams().get("type");
  const initialBranch = type === "corporate" || type === "luxury" || type === "vip" ? type : null;
  return <QuoteFlow key={initialBranch ?? "selection"} initialBranch={initialBranch} />;
}

export function QuoteFlow({ initialBranch }: { initialBranch: QuoteBranch }) {
  const t = useTranslations("quotePage");
  const tCommon = useTranslations("common");
  const [branch, setBranch] = useState<QuoteBranch>(initialBranch);
  const [success, setSuccess] = useState(false);
  const active = BRANCHES.find((option) => option.id === branch);

  // The option cards, the form and the success message replace each other in
  // place; move focus to the new view's heading (instead of letting it fall
  // back to the page body) and scroll the view's top into sight.
  const viewRef = useRef<HTMLDivElement>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const selectionHeadingRef = useRef<HTMLHeadingElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const branchChanged = useRef(false);
  useEffect(() => {
    if (!branchChanged.current) return;
    const heading = (branch ? formHeadingRef : selectionHeadingRef).current;
    focusAndReveal(heading, { scrollTarget: viewRef.current, block: "start" });
  }, [branch]);
  useEffect(() => {
    if (success) focusAndReveal(successHeadingRef.current, { scrollTarget: viewRef.current, block: "start" });
  }, [success]);
  const chooseBranch = (next: QuoteBranch) => {
    branchChanged.current = true;
    setBranch(next);
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

      {/* Form Area */}
      <section className="py-20 bg-white">
        <div
          ref={viewRef}
          className={`scroll-mt-24 mx-auto px-4 sm:px-6 lg:px-8 ${
            branch === null && !success ? "max-w-5xl" : "max-w-3xl"
          }`}
        >
          {success ? (
            <SuccessScreen t={t} headingRef={successHeadingRef} />
          ) : !active ? (
            /* Step 1: Choose Branch */
            <div>
              <div className="text-center mb-12">
                <h2
                  ref={selectionHeadingRef}
                  tabIndex={-1}
                  className="text-2xl md:text-3xl font-bold text-brand-navy mb-3"
                >
                  {t("typeTitle")}
                </h2>
                <p className="text-brand-navy/70">
                  {t("typeSubtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {BRANCHES.map(({ id, Icon, title, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => chooseBranch(id)}
                    className="group flex items-start gap-4 text-left p-5 sm:flex-col sm:items-center sm:text-center sm:p-8 rounded-2xl border-2 border-brand-navy/10 hover:border-brand-gold hover:shadow-luxury transition-all"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-flex shrink-0 items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-brand-gold/10 text-brand-gold-ink sm:mb-2 group-hover:bg-brand-gold group-hover:text-brand-navy transition-colors"
                    >
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </span>
                    <span>
                      <span className="block font-display text-lg sm:text-xl font-bold text-brand-navy mb-1 sm:mb-2">
                        {t(title)}
                      </span>
                      <span className="block text-brand-navy/70 text-sm leading-relaxed">
                        {t(desc)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Step 2: Form */
            <div>
              <button
                type="button"
                onClick={() => chooseBranch(null)}
                className="inline-flex min-h-[44px] items-center gap-2 text-sm text-brand-navy/70 hover:text-brand-gold-ink transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("backToSelection")}
              </button>

              <div className="mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gold-ink mb-3">
                  <active.Icon className="h-4 w-4" aria-hidden="true" />
                  {t(active.title)}
                </div>
                <h2
                  ref={formHeadingRef}
                  tabIndex={-1}
                  className="text-2xl md:text-3xl font-bold text-brand-navy mb-2"
                >
                  {t(active.enquiry)}
                </h2>
                <p className="text-brand-navy/70 text-sm">
                  {active.id === "vip" ? t("vipFormSubtitle") : t("formSubtitle")}
                </p>
              </div>

              {active.id === "corporate" ? (
                <CorporateForm onSuccess={() => setSuccess(true)} t={t} />
              ) : active.id === "luxury" ? (
                <LuxuryForm onSuccess={() => setSuccess(true)} t={t} />
              ) : (
                <>
                  <VipAirportForm onSuccess={() => setSuccess(true)} />
                  <div className="mt-6">
                    <FormTrustElements
                      responseTime={t("responseTime")}
                      freeConsultation={t("freeConsultation")}
                      trustLicence={t("trustLicence")}
                      trustClients={t("trustClients")}
                      iataImageAlt={tCommon("iataAlt")}
                      variant="dark"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

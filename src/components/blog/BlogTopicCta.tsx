import { ArrowRight } from "lucide-react";
import type { BlogCtaTopic } from "@/lib/blog-topic-cta";
import TopicCtaLink from "./TopicCtaLink";
import WhatsAppGlyph from "@/components/ui/WhatsAppGlyph";

export interface BlogTopicCtaCopy {
  eyebrow: string;
  title: string;
  text: string;
  button: string;
  whatsappLabel: string;
  newTabHint: string;
}

/**
 * Topic-matched call to action placed inside a blog article (between two
 * H2 sections). Rendered outside the `prose` wrapper so typography styles
 * don't leak in. A plain <div>, not <aside>: axe flags complementary
 * landmarks nested inside <article> (landmark-complementary-is-top-level).
 */
export default function BlogTopicCta({
  topic,
  copy,
  serviceHref,
  whatsappHref,
}: {
  topic: BlogCtaTopic;
  copy: BlogTopicCtaCopy;
  serviceHref: string;
  whatsappHref: string;
}) {
  return (
    <div
      className="my-12 rounded-2xl border border-brand-navy/10 border-l-4 border-l-brand-gold bg-brand-light p-6 sm:p-8"
      data-track-region="blog_inline_cta"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold-ink mb-2">
        {copy.eyebrow}
      </p>
      <p className="font-display text-xl sm:text-2xl font-bold leading-snug text-brand-navy">
        {copy.title}
      </p>
      <p className="mt-2 text-base leading-relaxed text-brand-navy/80">{copy.text}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <TopicCtaLink
          href={serviceHref}
          ctaType="generic"
          topic={topic}
          placement="inline"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90"
        >
          {copy.button}
          <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
        </TopicCtaLink>
        <TopicCtaLink
          href={whatsappHref}
          external
          ctaType="whatsapp_quick_quote"
          topic={topic}
          placement="inline"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-navy/20 bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/5"
        >
          <WhatsAppGlyph className="h-[18px] w-[18px] flex-shrink-0 text-[#128C7E]" />
          {copy.whatsappLabel}
          <span className="sr-only"> {copy.newTabHint}</span>
        </TopicCtaLink>
      </div>
    </div>
  );
}

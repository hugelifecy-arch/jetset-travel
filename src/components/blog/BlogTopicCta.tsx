import { ArrowRight } from "lucide-react";
import type { BlogCtaTopic } from "@/lib/blog-topic-cta";
import TopicCtaLink from "./TopicCtaLink";

export interface BlogTopicCtaCopy {
  eyebrow: string;
  title: string;
  text: string;
  button: string;
  whatsappLabel: string;
  newTabHint: string;
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={className}>
      <path
        fill="currentColor"
        d="M27.2 4.8A13.73 13.73 0 0 0 16.04 1C8.28 1 1.96 7.3 1.95 15.07c0 2.47.65 4.88 1.88 6.99L1 31l9.2-2.79a14.07 14.07 0 0 0 5.82 1.29h.01c7.76 0 14.08-6.31 14.1-14.08A13.98 13.98 0 0 0 27.2 4.8Zm-11.16 22.3h-.01a11.7 11.7 0 0 1-5.95-1.62l-.43-.25-5.46 1.65 1.67-5.31-.28-.45a11.58 11.58 0 0 1-1.8-6.15c.01-6.41 5.24-11.63 11.66-11.63 3.11 0 6.03 1.2 8.23 3.4a11.57 11.57 0 0 1 3.41 8.24c-.02 6.42-5.24 11.62-11.64 11.62Zm6.4-8.75c-.35-.17-2.05-1.02-2.37-1.14-.32-.12-.55-.17-.78.17-.23.35-.9 1.14-1.1 1.38-.2.23-.4.26-.75.09-.35-.17-1.46-.54-2.79-1.71a10.36 10.36 0 0 1-1.94-2.4c-.2-.35-.02-.54.15-.72.15-.15.35-.4.52-.6.17-.2.23-.34.35-.57.12-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.06-2.57-.28-.67-.57-.58-.78-.59l-.67-.01c-.23 0-.6.09-.92.43-.32.35-1.2 1.17-1.2 2.86 0 1.69 1.23 3.32 1.4 3.55.17.23 2.4 3.67 5.81 5.15.81.35 1.44.56 1.94.72.82.26 1.57.22 2.16.13.66-.1 2.05-.84 2.34-1.66.29-.82.29-1.52.2-1.66-.09-.14-.32-.23-.67-.4Z"
      />
    </svg>
  );
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

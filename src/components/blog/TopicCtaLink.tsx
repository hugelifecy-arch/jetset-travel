"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackCTAClick, type CTAType } from "@/lib/analytics/gtag";
import type { BlogCtaTopic } from "@/lib/blog-topic-cta";

export type TopicCtaPlacement = "inline" | "end";

/**
 * A blog CTA button that records a cta_click with the topic and placement
 * only (pushEvent() checks analytics consent). WhatsApp links are also
 * counted by ContactClickTracker as click_whatsapp, via data-track-region on
 * the surrounding block. The prefilled WhatsApp URL is never sent.
 */
export default function TopicCtaLink({
  href,
  external = false,
  ctaType,
  topic,
  placement,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  ctaType: CTAType;
  topic: BlogCtaTopic;
  placement: TopicCtaPlacement;
  className?: string;
  children: ReactNode;
}) {
  const onClick = () =>
    trackCTAClick({
      location: "blog",
      cta_type: ctaType,
      destination: external ? "whatsapp" : href,
      topic,
      placement,
    });

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

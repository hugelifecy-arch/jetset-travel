"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TocItem } from "@/lib/article-headings";

export interface TocLabels {
  /** Visible heading / toggle text: "Contents". */
  title: string;
  /** Accessible name of the nav landmark. */
  navLabel: string;
}

/* Links are plain #fragment anchors: globals.css gives <html> smooth
   scrolling only under prefers-reduced-motion: no-preference, and the
   article headings carry scroll-margin-top for the sticky header, so
   navigation, focus start point and the URL hash all stay native. */

const DESKTOP_QUERY = "(min-width: 1280px)";
/** A section counts as current once its heading passes this share of the viewport. */
const READING_LINE = 0.3;

/**
 * Desktop (≥1280 px) contents list, sticky beside the article. The current
 * section is highlighted with colour and a border only, so nothing reflows.
 */
export function TocSidebar({ items, labels }: { items: TocItem[]; labels: TocLabels }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const update = () => {
      const line = window.innerHeight * READING_LINE;
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > line) break;
        current = heading.id;
      }
      setActiveId(current);
    };

    let observer: IntersectionObserver | null = null;
    let settleTimer: number | undefined;
    // IntersectionObserver only reports headings that cross the reading line.
    // A long jump (scrollbar drag, End key) can skip every heading, so
    // recheck once scrolling settles.
    const onScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(update, 120);
    };

    const start = () => {
      if (observer) return;
      observer = new IntersectionObserver(update, {
        rootMargin: `0px 0px -${100 - READING_LINE * 100}% 0px`,
        threshold: [0, 1],
      });
      headings.forEach((heading) => observer?.observe(heading));
      window.addEventListener("scroll", onScroll, { passive: true });
    };
    const stop = () => {
      observer?.disconnect();
      observer = null;
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settleTimer);
    };
    const onMediaChange = () => (mql.matches ? start() : stop());

    onMediaChange();
    mql.addEventListener("change", onMediaChange);
    return () => {
      stop();
      mql.removeEventListener("change", onMediaChange);
    };
  }, [items]);

  return (
    <nav
      aria-label={labels.navLabel}
      className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-gold-ink">
        {labels.title}
      </p>
      <ol className="border-l border-brand-navy/10">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "true" : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-4 pr-1 text-sm leading-snug transition-colors focus-visible:outline-offset-[-2px] ${
                  active
                    ? "border-brand-gold bg-brand-light/70 text-brand-navy"
                    : "border-transparent text-brand-navy/70 hover:border-brand-navy/30 hover:text-brand-navy"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Phone and tablet contents box at the top of the article, closed by default.
 */
export function TocDisclosure({ items, labels }: { items: TocItem[]; labels: TocLabels }) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <nav
      aria-label={labels.navLabel}
      className="mb-10 rounded-2xl border border-brand-navy/10 bg-brand-light/60"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl px-5 py-3 text-left font-semibold text-brand-navy"
      >
        <span>{labels.title}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <ol
        id={listId}
        hidden={!open}
        className="list-decimal space-y-0.5 pb-4 pl-10 pr-5 text-brand-navy/80 marker:text-sm marker:text-brand-navy/70"
      >
        {items.map((item) => (
          <li key={item.id} className="pl-1">
            <a
              href={`#${item.id}`}
              className="block min-h-11 py-2 leading-snug text-brand-navy underline-offset-4 hover:text-brand-gold-ink hover:underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import WhatsAppGlyph from "./WhatsAppGlyph";

type Variant = "primary" | "outline" | "onDark";

/* Navy text on WhatsApp green is ~8:1 (white on #25D366 is only ~2:1). */
const VARIANTS: Record<Variant, string> = {
  primary: "bg-[#25D366] text-brand-navy hover:bg-[#20BD5A]",
  outline: "border border-brand-navy/20 bg-white text-brand-navy hover:bg-brand-navy/5",
  onDark: "border border-white/30 text-white hover:bg-white/10",
};

/**
 * WhatsApp call to action (wa.me deep link with a prefilled message). wa.me
 * opens the app on phones and WhatsApp Web / Desktop on computers.
 *
 * `trackRegion` is read by ContactClickTracker, which sends click_whatsapp
 * with `link_region` (consent-gated). It names the button, never the visitor.
 */
export default function WhatsAppCtaLink({
  href,
  children,
  newTabHint,
  trackRegion,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  /** Screen-reader hint, e.g. "(opens WhatsApp in a new tab)". */
  newTabHint: string;
  trackRegion: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track-region={trackRegion}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors",
        VARIANTS[variant],
        className,
      )}
    >
      <WhatsAppGlyph
        className={cn("h-5 w-5 flex-shrink-0", variant === "outline" && "text-[#128C7E]")}
      />
      {children}
      <span className="sr-only"> {newTabHint}</span>
    </a>
  );
}

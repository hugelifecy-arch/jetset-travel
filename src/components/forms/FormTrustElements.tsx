import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface FormTrustElementsProps {
  responseTime: string;
  freeConsultation: string;
  trustLicence: string;
  trustClients: string;
  iataImageAlt: string;
  variant?: "light" | "dark";
}

export default function FormTrustElements({
  responseTime,
  freeConsultation,
  trustLicence,
  trustClients,
  iataImageAlt,
  variant = "dark",
}: FormTrustElementsProps) {
  const isLight = variant === "light";

  return (
    <div className="space-y-3">
      {/* Response time + free consultation */}
      <div
        className={cn(
          "flex flex-col items-center gap-1 text-center text-xs sm:flex-row sm:justify-center sm:gap-3",
          isLight ? "text-white/60" : "text-brand-navy/50"
        )}
      >
        <span>{responseTime}</span>
        <span className={cn("hidden sm:inline", isLight ? "text-white/30" : "text-brand-navy/20")}>
          |
        </span>
        <span>{freeConsultation}</span>
      </div>

      {/* Mini trust bar */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium",
          isLight ? "text-white/50" : "text-brand-navy/45"
        )}
      >
        <span className="flex items-center gap-1.5">
          <Image
            src="/images/iata-logo.png"
            alt={iataImageAlt}
            width={16}
            height={16}
            className="h-4 w-4 rounded-sm object-contain"
          />
          IATA
        </span>
        <span
          className={cn(
            "h-3 w-px",
            isLight ? "bg-white/20" : "bg-brand-navy/15"
          )}
        />
        <span>{trustLicence}</span>
        <span
          className={cn(
            "h-3 w-px",
            isLight ? "bg-white/20" : "bg-brand-navy/15"
          )}
        />
        <span>{trustClients}</span>
      </div>
    </div>
  );
}

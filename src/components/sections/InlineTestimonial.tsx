import { Star } from "lucide-react";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=JETSET%20TRAVEL%20AGENCY%20Paphos";

interface InlineTestimonialProps {
  quote: string;
  author: string;
  role: string;
  rating?: number;
  date?: string;
  viaLabel?: string;
  postedLabel?: string;
}

export default function InlineTestimonial({
  quote,
  author,
  role,
  rating = 5,
  date,
  viaLabel = "on",
  postedLabel = "Posted",
}: InlineTestimonialProps) {
  return (
    <figure className="rounded-2xl border border-brand-navy/10 bg-brand-light/50 p-6 md:p-8">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-brand-gold text-brand-gold"
                : "fill-transparent text-brand-navy/20"
            }`}
          />
        ))}
      </div>
      <blockquote className="text-sm leading-relaxed text-brand-navy/80 italic">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{author}</p>
          <p className="text-xs text-brand-navy/60">{role}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span className="text-brand-gold text-xs" aria-hidden="true">
              ★★★★★
            </span>
            <span className="text-xs text-brand-navy/50">
              {viaLabel}{" "}
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-brand-navy transition-colors"
              >
                Google
              </a>
            </span>
          </div>
          {date && (
            <p className="text-xs text-brand-navy/30 mt-0.5">
              {postedLabel} {date}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

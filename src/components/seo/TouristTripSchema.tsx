import JsonLd from "./JsonLd";

interface TouristTripSchemaProps {
  /** Display name of the trip / tour, e.g. "Mediterranean Cruise from Limassol". */
  name: string;
  description: string;
  /** Canonical page URL where the offer can be requested. */
  url: string;
  /** Hero image for the trip — used by Google Tour/Trip rich results. */
  image: string;
  /** ITSO 4217 currency code. Defaults to EUR — match JetSet's billing currency. */
  priceCurrency?: string;
  /** Minimum quoted starting price. Real number from the offer catalog. */
  lowPrice?: string;
  /** Ordered list of itinerary places (departure → ports of call → return). */
  itinerary: Array<{ name: string; description?: string }>;
  /** Touring destinations / regions covered, e.g. ["Mediterranean", "Greek Islands"]. */
  touristType?: string[];
  /** ISO 8601 duration (e.g. "P7D" for a 7-day cruise). Optional — only set
   *  when a fixed-length offer is being described. */
  duration?: string;
  /** Offer validity window. Both inclusive. Use ISO date strings. */
  validFrom?: string;
  validThrough?: string;
}

/**
 * TouristTrip JSON-LD — Phase 6 Step 49.
 *
 * Use for cruise / tour offering pages. Google's travel SERP surface
 * supports TouristTrip + Offer for review-rich snippets, price drops, and
 * destination carousels. Provider is referenced by `@id` so this trip
 * inherits the homepage TravelAgency entity (aggregateRating, IATA cred,
 * contact info) without duplicating fields.
 */
export default function TouristTripSchema({
  name,
  description,
  url,
  image,
  priceCurrency = "EUR",
  lowPrice,
  itinerary,
  touristType,
  duration,
  validFrom,
  validThrough,
}: TouristTripSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description,
    url,
    image,
    ...(touristType && touristType.length > 0 && { touristType }),
    ...(duration && { duration }),
    itinerary: {
      "@type": "ItemList",
      itemListElement: itinerary.map((place, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristDestination",
          name: place.name,
          ...(place.description && { description: place.description }),
        },
      })),
    },
    provider: {
      "@id": "https://www.jetset-travel.com/#organization",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency,
      ...(lowPrice && { price: lowPrice, lowPrice }),
      availability: "https://schema.org/InStock",
      ...(validFrom && { validFrom }),
      ...(validThrough && { validThrough }),
      seller: {
        "@id": "https://www.jetset-travel.com/#organization",
      },
    },
  };

  return <JsonLd data={schema} />;
}

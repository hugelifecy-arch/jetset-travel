import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Server-side schemas for every form that POSTs to /api/quote.       */
/*  Kept out of the route file so tests/quote-schemas.test.js can      */
/*  exercise them without a Next server (relative imports only).       */
/* ------------------------------------------------------------------ */

/** What a luxury enquiry can ask us to arrange (step 1 of the wizard). */
export const TRIP_TYPES = [
  "cruise",
  "villa",
  "vip-airport",
  "private-jet",
  "yacht",
  "hotel",
  "other",
] as const;
export type TripType = (typeof TRIP_TYPES)[number];

export const VIP_AIRPORTS = ["LCA", "PFO"] as const;
export type VipAirport = (typeof VIP_AIRPORTS)[number];

export const VIP_SERVICES = ["arrival", "departure", "both"] as const;
export type VipService = (typeof VIP_SERVICES)[number];

/** Letters, digits and spaces only (e.g. "A3 612", "W6 4271"). */
export const FLIGHT_NUMBER_PATTERN = /^[A-Za-z0-9 -]*$/;

export const CorporateSchema = z.object({
  type: z.literal("corporate"),
  companyName: z.string().min(2).max(120),
  email: z.string().email().max(120),
  phone: z.string().min(5).max(30),
  travellers: z.string().min(1).max(50),
  travelDates: z.string().min(1).max(200),
  destinations: z.string().min(2).max(200),
  invoiceRequired: z.boolean(),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const LuxurySchema = z.object({
  type: z.literal("luxury"),
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().min(5).max(30),
  destinations: z.string().min(2).max(200),
  dates: z.string().min(1).max(80),
  groupSize: z.string().min(1).max(50),
  budget: z.string().min(1).max(50),
  specialRequirements: z.string().max(2000).optional().or(z.literal("")),
  // Optional so luxury payloads sent before the 3-step wizard still validate.
  tripTypes: z.array(z.enum(TRIP_TYPES)).max(TRIP_TYPES.length).optional(),
});

export const VipSchema = z.object({
  type: z.literal("vip"),
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().min(5).max(30),
  airport: z.enum(VIP_AIRPORTS),
  service: z.enum(VIP_SERVICES),
  date: z.string().min(1).max(80),
  flightNumber: z.string().max(12).regex(FLIGHT_NUMBER_PATTERN).optional(),
  passengers: z.string().min(1).max(20),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const LeadSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(5).max(30),
  route: z.string().min(3).max(200),
});

/**
 * Order matters: z.union returns the first matching member. The typed
 * schemas come first and the untyped quick-lead schema stays last, so every
 * payload that validated before VIP was added resolves to the same member.
 */
export const QuoteSchema = z.union([CorporateSchema, LuxurySchema, VipSchema, LeadSchema]);

export type QuoteData = z.infer<typeof QuoteSchema>;

/* ------------------------------------------------------------------ */
/*  Staff-email labels (English: the office inbox reads English)       */
/* ------------------------------------------------------------------ */

export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  cruise: "Cruise",
  villa: "Villa",
  "vip-airport": "VIP airport service",
  "private-jet": "Private jet",
  yacht: "Yacht charter",
  hotel: "Five-star hotel",
  other: "Something else",
};

export const VIP_AIRPORT_LABELS: Record<VipAirport, string> = {
  LCA: "Larnaca (LCA)",
  PFO: "Paphos (PFO)",
};

export const VIP_SERVICE_LABELS: Record<VipService, string> = {
  arrival: "Arrival",
  departure: "Departure",
  both: "Arrival and departure",
};

/** Unique trip types in the canonical order, as a readable list. */
export function formatTripTypes(tripTypes: readonly TripType[] | undefined): string {
  if (!tripTypes?.length) return "";
  const chosen = new Set(tripTypes);
  return TRIP_TYPES.filter((type) => chosen.has(type))
    .map((type) => TRIP_TYPE_LABELS[type])
    .join(", ");
}

/** Label used in the notification subject ("New VIP Quote Request — …"). */
export function quoteTypeLabel(data: QuoteData): "Corporate" | "Luxury" | "VIP" | "Quick" {
  if (!("type" in data)) return "Quick";
  if (data.type === "corporate") return "Corporate";
  if (data.type === "vip") return "VIP";
  return "Luxury";
}

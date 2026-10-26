/* ------------------------------------------------------------------ */
/*  Plain constants shared by the quote forms (client) and the        */
/*  /api/quote schemas (server). Kept free of zod so a client form    */
/*  can import them without pulling zod into the route chunk that     */
/*  Next.js prefetches from the home page (see forms/lazyResolver).   */
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

/** Letters, digits, spaces and hyphens (e.g. "A3 612", "A3-612"). */
export const FLIGHT_NUMBER_PATTERN = /^[A-Za-z0-9 -]*$/;

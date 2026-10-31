/**
 * Topic-matched calls to action for blog posts.
 *
 * Each post gets one topic from its slug, tags and category (first matching
 * rule wins, so the order below matters: the insurance guide is tagged
 * "visa" and "cruises", the VIP guide "luxury" and "flights"). The topic
 * picks the service page the CTA links to and the copy under
 * `blogTopicCta.topics.<messageKey>` in src/messages/{en,ru}.json.
 *
 * Pure data and functions, no Next imports, so tests/ can import it.
 */

export const BLOG_CTA_TOPICS = [
  "labour-vfr",
  "vip-airport",
  "private-jet-yacht",
  "villas",
  "insurance",
  "cruises",
  "digital-nomads",
  "visa-schengen",
  "corporate",
  "flights-airports",
  "luxury",
  "best-time",
  "general",
] as const;

export type BlogCtaTopic = (typeof BLOG_CTA_TOPICS)[number];
export type BlogCtaLocale = "en" | "ru";

export interface BlogCtaTopicConfig {
  /** Key under blogTopicCta.topics in the message files. */
  messageKey: string;
  /** Service page path without the locale prefix, per locale. */
  servicePath: Record<BlogCtaLocale, string>;
}

const QUOTE = { en: "/quote", ru: "/quote" };
// VIP airport service, jet and yacht charter and villas → the VIP services page.
const VIP_SERVICES_PAGE = { en: "/vip-services", ru: "/vip-services" };

export const BLOG_CTA_CONFIG: Record<BlogCtaTopic, BlogCtaTopicConfig> = {
  "labour-vfr": {
    messageKey: "labourVfr",
    servicePath: { en: "/labour-vfr-flights-cyprus", ru: "/labour-vfr-flights-cyprus" },
  },
  "vip-airport": { messageKey: "vipAirport", servicePath: VIP_SERVICES_PAGE },
  "private-jet-yacht": { messageKey: "privateJetYacht", servicePath: VIP_SERVICES_PAGE },
  villas: { messageKey: "villas", servicePath: VIP_SERVICES_PAGE },
  insurance: { messageKey: "insurance", servicePath: QUOTE },
  cruises: { messageKey: "cruises", servicePath: { en: "/cruises", ru: "/cruises" } },
  "digital-nomads": {
    messageKey: "digitalNomads",
    servicePath: { en: "/visa-services", ru: "/visa-services" },
  },
  "visa-schengen": {
    messageKey: "visaSchengen",
    servicePath: { en: "/visa-services", ru: "/visa-services" },
  },
  corporate: {
    messageKey: "corporate",
    servicePath: { en: "/corporate-travel", ru: "/corporate-travel" },
  },
  "flights-airports": {
    messageKey: "flightsAirports",
    servicePath: { en: "/flight-tickets-cyprus", ru: "/aviabilety-kipr" },
  },
  luxury: { messageKey: "luxury", servicePath: { en: "/luxury-travel", ru: "/luxury-travel" } },
  "best-time": { messageKey: "bestTime", servicePath: QUOTE },
  general: { messageKey: "general", servicePath: QUOTE },
};

interface TopicRule {
  topic: BlogCtaTopic;
  /** Exact tag matches (tags are compared lower-cased). */
  tags?: readonly string[];
  /** Substrings of the slug. */
  slug?: readonly string[];
  categories?: readonly string[];
  /** Every one of these tags must be present. */
  allTags?: readonly string[];
}

const RULES: readonly TopicRule[] = [
  // Before flights/corporate: the winter staff-flights posts are tagged
  // "flights" and "seasonal-staff" but belong to the Labour/VFR service.
  {
    topic: "labour-vfr",
    tags: ["labour-vfr", "vfr", "labour fares", "тарифы labour/vfr"],
    slug: ["labour", "vfr", "winter-staff-flights", "aviabilety-domoj"],
  },
  {
    topic: "vip-airport",
    slug: ["vip-airport", "vip-obsluzhivanie"],
    allTags: ["vip", "airport"],
  },
  { topic: "vip-airport", allTags: ["vip", "аэропорт"] },
  {
    topic: "private-jet-yacht",
    tags: ["private-jet", "yacht", "yachts", "частный самолёт", "частный самолет", "яхты", "яхта"],
    slug: ["private-jet", "yacht", "samolet", "yakht"],
  },
  { topic: "villas", tags: ["villas", "villa", "виллы", "вилла"], slug: ["villa", "villy"] },
  {
    topic: "insurance",
    tags: ["insurance", "travel-insurance", "страховка", "страхование"],
    slug: ["insurance", "strakhovk"],
  },
  {
    topic: "cruises",
    tags: ["cruise", "cruises", "круиз", "круизы"],
    categories: ["cruises"],
    slug: ["cruise", "kruiz"],
  },
  {
    topic: "digital-nomads",
    tags: ["digital-nomad", "digital-nomads", "цифровые кочевники"],
    slug: ["digital-nomad"],
  },
  {
    topic: "visa-schengen",
    tags: ["visa", "visas", "schengen", "виза", "визы", "шенген"],
    categories: ["visas-guides"],
    slug: ["schengen", "shengen", "visa", "viza"],
  },
  {
    topic: "corporate",
    tags: [
      "corporate", "business", "business-travel", "corporate-retreat", "mice",
      "корпоративные", "корпоративные поездки", "деловые поездки", "бизнес", "корпоративный ретрит",
    ],
    categories: ["corporate-travel"],
    slug: ["corporate", "business", "korporativn", "delovoj"],
  },
  {
    topic: "flights-airports",
    tags: ["flights", "flight", "airports", "airport", "авиабилеты", "аэропорты", "аэропорт"],
    slug: ["airport", "aeroport", "flight", "aviabilet"],
  },
  { topic: "luxury", tags: ["luxury", "люкс"], categories: ["luxury"], slug: ["luxury", "lyuks"] },
  { topic: "best-time", slug: ["best-time", "luchshee-vremya"], tags: ["weather", "погода", "seasons", "сезоны"] },
];

export interface BlogCtaPostInfo {
  slug: string;
  tags?: readonly unknown[];
  category?: string;
}

function matches(rule: TopicRule, slug: string, tags: Set<string>, category: string): boolean {
  if (rule.allTags) return rule.allTags.every((t) => tags.has(t)) || (rule.slug ?? []).some((s) => slug.includes(s));
  return (
    (rule.tags ?? []).some((t) => tags.has(t)) ||
    (rule.slug ?? []).some((s) => slug.includes(s)) ||
    (rule.categories ?? []).includes(category)
  );
}

/** The CTA topic for a post; "general" when nothing more specific fits. */
export function resolveBlogCtaTopic(post: BlogCtaPostInfo): BlogCtaTopic {
  const slug = post.slug.toLowerCase();
  const tags = new Set((post.tags ?? []).map((t) => String(t).trim().toLowerCase()));
  const category = (post.category ?? "").toLowerCase();
  return RULES.find((rule) => matches(rule, slug, tags, category))?.topic ?? "general";
}

/** Locale-prefixed service page for a topic, e.g. "/ru/aviabilety-kipr". */
export function blogCtaServiceHref(topic: BlogCtaTopic, locale: string): string {
  const loc: BlogCtaLocale = locale === "ru" ? "ru" : "en";
  return `/${loc}${BLOG_CTA_CONFIG[topic].servicePath[loc]}`;
}

export const JETSET_WHATSAPP_NUMBER = "35799478073";

/** wa.me chat link with a prefilled message (the message names the topic). */
export function whatsappChatHref(message: string): string {
  return `https://wa.me/${JETSET_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

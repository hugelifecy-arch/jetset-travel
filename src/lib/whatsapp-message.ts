/**
 * Page-aware prefilled WhatsApp messages (audit item 17).
 *
 * The floating WhatsApp button and the mobile action bar open a chat whose
 * first message matches the page the visitor is on, e.g. the VIP airport
 * guide pre-fills "…I'm interested in VIP airport service (meet & assist).
 * My dates: ". The visitor finishes the sentence, the office sees what the
 * enquiry is about without a round of questions.
 *
 * Privacy: the URL only ever carries this fixed text; nothing about the
 * visitor is added. Whatever they type is theirs to send.
 *
 * The texts live here (not in src/messages) so this module stays a pure,
 * client-safe function covered by tests/whatsapp-message.test.js without
 * shipping either message catalogue to the browser.
 */

export const WHATSAPP_PHONE = "35799478073";

export type WhatsAppTopic =
  | "vip"
  | "jet-yacht"
  | "cruise"
  | "villa"
  | "visa"
  | "schengen"
  | "corporate"
  | "luxury"
  | "private"
  | "hotel"
  | "flights"
  | "paphos"
  | "quote"
  | "contact"
  | "generic";

/** First path segment after the locale → topic (EN and RU slugs). */
const PAGE_TOPICS: Record<string, WhatsAppTopic> = {
  "luxury-travel": "luxury",
  "vip-services": "vip",
  "luxury-travel-cyprus": "luxury",
  cruises: "cruise",
  private: "private",
  "visa-services": "visa",
  "hotel-reservations": "hotel",
  "hotel-booking-cyprus": "hotel",
  "flight-tickets-cyprus": "flights",
  "aviabilety-kipr": "flights",
  "corporate-travel": "corporate",
  "corporate-travel-cyprus": "corporate",
  "paphos-travel-agency": "paphos",
  "turisticheskoe-agentstvo-pafos": "paphos",
  "schengen-cyprus-2026": "schengen",
  quote: "quote",
  contact: "contact",
};

/**
 * Blog post slug keywords, checked in order (first match wins): the more
 * specific services come first, so "luxury-cruises-…" is a cruise and
 * "cyprus-schengen-2026-business-travel" is a visa question.
 */
const BLOG_KEYWORDS: ReadonlyArray<readonly [WhatsAppTopic, readonly string[]]> = [
  ["vip", ["vip-airport", "vip-obsluzhivanie"]],
  ["jet-yacht", ["private-jet", "chastnyj-samolet"]],
  ["cruise", ["cruise", "kruiz"]],
  ["villa", ["villa", "villy"]],
  ["visa", ["visa", "viza", "schengen", "shengen", "digital-nomad"]],
  ["corporate", ["corporate", "korporativ", "business-travel", "komandirov", "delov"]],
  ["luxury", ["luxury", "lyuks", "premialn"]],
  ["paphos", ["travel-agency-paphos", "turagenstvo-pafos"]],
];

const MESSAGES: Record<"en" | "ru", Record<WhatsAppTopic, string>> = {
  en: {
    vip: "Hi JetSet, I'm interested in VIP airport service (meet & assist). My dates: ",
    "jet-yacht": "Hi JetSet, I'm interested in a private jet or yacht charter. My dates: ",
    cruise: "Hi JetSet, I'm interested in a cruise. My dates: ",
    villa: "Hi JetSet, I'm looking for a luxury villa. My dates: ",
    visa: "Hi JetSet, I'd like help with a visa. Destination and travel dates: ",
    schengen: "Hi JetSet, I have a question about Schengen travel from Cyprus. My trip: ",
    corporate: "Hi JetSet, I'd like to discuss corporate travel for our company. Company: ",
    luxury: "Hi JetSet, I'm planning a luxury trip. Destination and dates: ",
    private: "Hi JetSet, I'd like to request an introduction to your private client service.",
    hotel: "Hi JetSet, I'd like help booking a hotel. Destination and dates: ",
    flights: "Hi JetSet, I'd like a quote for flights. Route and dates: ",
    paphos: "Hi JetSet, I'd like help planning a trip with your Paphos office. Details: ",
    quote: "Hi JetSet, I'd like a travel quote. Details: ",
    contact: "Hi JetSet, I have a question: ",
    generic: "Hi JetSet, I'd like help with...",
  },
  ru: {
    vip: "Здравствуйте, JetSet! Меня интересует VIP-обслуживание в аэропорту (встреча и сопровождение). Мои даты: ",
    "jet-yacht": "Здравствуйте, JetSet! Меня интересует аренда частного самолёта или яхты. Мои даты: ",
    cruise: "Здравствуйте, JetSet! Меня интересует круиз. Мои даты: ",
    villa: "Здравствуйте, JetSet! Хочу арендовать виллу для отдыха. Мои даты: ",
    visa: "Здравствуйте, JetSet! Нужна помощь с визой. Страна и даты поездки: ",
    schengen: "Здравствуйте, JetSet! У меня вопрос о поездке в Шенгенскую зону с Кипра. Моя поездка: ",
    corporate: "Здравствуйте, JetSet! Хотим обсудить корпоративное обслуживание поездок. Компания: ",
    luxury: "Здравствуйте, JetSet! Планирую премиальное путешествие. Направление и даты: ",
    private: "Здравствуйте, JetSet! Хочу узнать больше о вашем сервисе для частных клиентов.",
    hotel: "Здравствуйте, JetSet! Нужна помощь с бронированием отеля. Направление и даты: ",
    flights: "Здравствуйте, JetSet! Нужны авиабилеты. Маршрут и даты: ",
    paphos: "Здравствуйте, JetSet! Обращаюсь в ваш офис в Пафосе: нужна помощь с поездкой. Детали: ",
    quote: "Здравствуйте, JetSet! Хочу получить предложение по поездке. Детали: ",
    contact: "Здравствуйте, JetSet! У меня вопрос: ",
    generic: "Здравствуйте JetSet, мне нужна помощь с...",
  },
};

/** Topic for a locale-prefixed pathname such as "/ru/blog/kruizy-…". */
export function whatsAppTopic(pathname: string | null | undefined): WhatsAppTopic {
  const segments = (pathname ?? "").split(/[?#]/)[0].split("/").filter(Boolean);
  // segments[0] is the locale; the page slug follows it.
  const page = segments[1]?.toLowerCase();
  if (!page) return "generic";
  if (page === "blog") {
    const slug = segments[2]?.toLowerCase();
    if (!slug) return "generic";
    for (const [topic, keywords] of BLOG_KEYWORDS) {
      if (keywords.some((keyword) => slug.includes(keyword))) return topic;
    }
    return "generic";
  }
  return PAGE_TOPICS[page] ?? "generic";
}

/** Prefilled chat text for the page and language the visitor is viewing. */
export function whatsAppMessage(pathname: string | null | undefined, locale: string): string {
  return MESSAGES[locale === "ru" ? "ru" : "en"][whatsAppTopic(pathname)];
}

/** wa.me link with the page-aware prefilled text. */
export function whatsAppHref(pathname: string | null | undefined, locale: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsAppMessage(pathname, locale))}`;
}

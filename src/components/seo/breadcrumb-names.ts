export const PATH_DISPLAY_NAMES: Record<string, Record<string, string>> = {
  en: {
    about: "About Us",
    contact: "Contact",
    "corporate-travel": "Corporate Travel",
    "hotel-reservations": "Hotel Reservations",
    "luxury-travel": "Luxury Travel",
    cruises: "Cruises",
    quote: "Get a Quote",
    "visa-services": "Visa Services",
    services: "All Services",
    faq: "FAQ",
    blog: "Blog",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    "paphos-travel-agency": "Travel Agency in Paphos",
    "corporate-travel-cyprus": "Corporate Travel Cyprus",
    "visa-services-cyprus": "Visa Services Cyprus",
    "luxury-travel-cyprus": "Luxury Travel Cyprus",
    "flight-tickets-cyprus": "Flight Tickets Cyprus",
    "hotel-booking-cyprus": "Hotel Booking Cyprus",
    "schengen-cyprus-2026": "Cyprus & Schengen 2026",
  },
  ru: {
    about: "О нас",
    contact: "Контакты",
    "corporate-travel": "Корпоративные поездки",
    "hotel-reservations": "Бронирование отелей",
    "luxury-travel": "Элитный отдых",
    cruises: "Круизы",
    quote: "Запросить предложение",
    "visa-services": "Визовые услуги",
    services: "Все услуги",
    faq: "Часто задаваемые вопросы",
    blog: "Блог",
    privacy: "Политика конфиденциальности",
    terms: "Условия использования",
    "turisticheskoe-agentstvo-pafos": "Турагентство в Пафосе",
    "aviabilety-kipr": "Авиабилеты Кипр",
    // The four "*-cyprus" landing pages share their Latin slug across both
    // locales (the transliterated Russian counterparts were retired). Russian
    // breadcrumb labels for them live below under their Latin slug keys.
    "corporate-travel-cyprus": "Корпоративные поездки Кипр",
    "visa-services-cyprus": "Визовые услуги Кипр",
    "luxury-travel-cyprus": "Люкс отдых Кипр",
    "hotel-booking-cyprus": "Бронирование отелей Кипр",
    "schengen-cyprus-2026": "Кипр и Шенген 2026",
  },
};

/**
 * Convert a URL slug to a human-readable title.
 * Used as a fallback when a slug is not found in PATH_DISPLAY_NAMES
 * (e.g. dynamic blog post slugs like "cyprus-travel-guide" → "Cyprus Travel Guide").
 */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getHomeName(locale: string): string {
  return locale === "ru" ? "Главная" : "Home";
}

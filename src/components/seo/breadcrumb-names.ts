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
  },
};

export function getHomeName(locale: string): string {
  return locale === "ru" ? "Главная" : "Home";
}

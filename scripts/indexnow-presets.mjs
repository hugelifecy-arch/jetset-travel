/**
 * Named URL lists for scripts/indexnow.mjs (`--preset <name>`).
 * Paths only; the script prefixes https://www.jetset-travel.com.
 * tests/indexnow.test.js checks every path is a live sitemap URL, so a
 * preset can never submit a redirect or a 404.
 */
export const INDEXNOW_PRESETS = {
  // Bing Webmaster, Oct 2026: sitemap pages Bing had not indexed yet.
  priority: [
    // EN
    "/en/vip-services",
    "/en/labour-vfr-flights-cyprus",
    "/en/seasonal-staff-travel-cyprus",
    "/en/blog/winter-staff-flights-cyprus-2026-2027",
    "/en/blog/luxury-cruises-from-cyprus-2027",
    "/en/blog/private-jet-yacht-charter-cyprus",
    "/en/blog/vip-airport-service-larnaca-paphos",
    // RU
    "/ru/corporate-travel",
    "/ru/luxury-travel",
    "/ru/vip-services",
    "/ru/hotel-reservations",
    "/ru/quote",
    "/ru/faq",
    "/ru/corporate-travel-cyprus",
    "/ru/luxury-travel-cyprus",
    "/ru/hotel-booking-cyprus",
    "/ru/labour-vfr-flights-cyprus",
    "/ru/seasonal-staff-travel-cyprus",
    "/ru/aviabilety-kipr",
    "/ru/blog/aviabilety-domoj-s-kipra-zima-2026-2027",
    "/ru/blog/larnaka-ili-pafos-aeroport-2026",
    "/ru/blog/strakhovka-dlya-poezdki-na-kipr-2026",
    "/ru/blog/chastnyj-samolet-i-yakhta-s-kipra",
    "/ru/blog/lyuks-kruizy-s-kipra-2027",
    "/ru/blog/vip-obsluzhivanie-aeroport-larnaka-pafos",
    "/ru/blog/villy-mikonos-santorini-krit-s-kipra",
    "/ru/blog/korporativnye-komandirovki-kipr-gid",
  ],
};

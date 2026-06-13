/**
 * EN ↔ RU blog post slug pairs — the client-safe mirror of the per-post
 * `translationSlug` frontmatter in `content/blog/*.md`.
 *
 * Why this exists: the header's language switcher must resolve the
 * cross-locale URL of the *current* page on the client (it renders on every
 * page, and reading the pathname server-side via `headers()` forced the
 * whole site into per-request SSR — see AUDIT_REPORT.md §3). Static routes
 * resolve through `LOCALE_ALTERNATES`, which is already a plain object;
 * blog posts resolve through this map.
 *
 * Keep in sync with frontmatter: `tests/blog-translation-pairs.test.js`
 * fails CI whenever a post's `translationSlug` is added, removed, or
 * changed without updating this map.
 */
export const BLOG_SLUG_PAIRS_EN_TO_RU: Record<string, string> = {
  "best-time-visit-cyprus-monthly-guide": "luchshee-vremya-dlya-poseshcheniya-kipra",
  "business-travelers-guide-limassol": "delovoj-gid-po-limassolu",
  "corporate-travel-management-cyprus-cost-2026": "korporativnye-komandirovki-kipr-stoimost-2026",
  "corporate-travel-policy-template-cyprus": "shablon-politiki-komandirovok-kipr",
  "corporate-travel-tips-cyprus": "korporativnye-komandirovki-kipr-gid",
  "cruises-from-limassol-2026": "luchshie-kruizy-iz-limassola-2026",
  "cyprus-schengen-2026-business-travel": "kipr-v-shengene-2026-delovye-poezdki",
  "digital-nomads-cyprus-guide": "digital-nomady-kipr-gid",
  "limassol-corporate-retreat-guide": "korporativnyj-retrit-v-limassole",
  "luxury-mediterranean-destinations-2026": "premialnyj-otdykh-sredizemnomorye-2026",
  "luxury-travel-cyprus-2026-guide": "lyuks-puteshestviya-s-kipra-2026-gid",
  "private-villa-holidays-mykonos-santorini-crete": "villy-mikonos-santorini-krit-s-kipra",
  "schengen-visa-guide-cyprus-residents": "shengenskaya-viza-dlya-zhitelej-kipra",
  "travel-agency-paphos-guide": "kak-vybrat-turagenstvo-pafos",
};

const RU_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(BLOG_SLUG_PAIRS_EN_TO_RU).map(([en, ru]) => [ru, en]),
);

/**
 * Returns the slug of the paired translation for `slug` in `targetLocale`,
 * or `null` when the post has no counterpart (or the slug is unknown).
 * Looking up a slug in its own locale returns the slug itself.
 */
export function getPairedBlogSlug(
  slug: string,
  targetLocale: "en" | "ru",
): string | null {
  if (targetLocale === "ru") {
    if (slug in RU_TO_EN) return slug; // already a RU slug
    return BLOG_SLUG_PAIRS_EN_TO_RU[slug] ?? null;
  }
  if (slug in BLOG_SLUG_PAIRS_EN_TO_RU) return slug; // already an EN slug
  return RU_TO_EN[slug] ?? null;
}

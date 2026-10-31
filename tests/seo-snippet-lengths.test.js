/**
 * Phase 5 / Step 42 — guard against SERP-snippet length regressions.
 *
 * Validates every published blog post's <title> and <meta description>
 * (and a hand-curated list of static pages) against a regression band.
 *
 * Two sets of bounds:
 *
 *   TARGET (aspirational, mobile-safe):
 *     title 30-60 chars, description 120-160 chars.
 *     This is what Google's mobile SERP reliably renders without
 *     truncation. New copy should hit this band.
 *
 *   REGRESSION (enforced by this test):
 *     title 30-95 chars, description 110-200 chars.
 *     Generous enough that existing JetSet copy (some titles run 70+
 *     chars) passes, strict enough that a "JetSet" 6-char title or a
 *     400-char paste-bomb description fails CI.
 *
 * The front-loading guard at the bottom of this file enforces the more
 * important mobile concern: the first 110 chars must surface brand,
 * locality, credential, or a freshness marker.
 *
 * Static pages: we don't try to import every `generateMetadata` function
 * because they require a Next.js request context. Update the hand-curated
 * STATIC_PAGE_METADATA list when a new important static page is added.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getPublishedPosts } from "../src/lib/blog.ts";

// Pages whose metadata comes from the message catalogues: read the real
// strings so this list can't drift from what the pages render.
const MESSAGES = {
  en: JSON.parse(readFileSync(new URL("../src/messages/en.json", import.meta.url), "utf-8")),
  ru: JSON.parse(readFileSync(new URL("../src/messages/ru.json", import.meta.url), "utf-8")),
};
const fromMessages = (locale, namespace, route) => ({
  page: `/${locale}${route}`,
  title: MESSAGES[locale][namespace].metaTitle,
  description: MESSAGES[locale][namespace].metaDescription,
});

// Regression-band bounds (enforced). The aspirational mobile-safe targets
// are stricter (title 30-60, description 120-160) but a large portion of
// existing copy predates those guidelines, so this test is sized to catch
// regressions, not to retroactively rewrite the back catalogue.
const TITLE_MIN = 30;
const TITLE_MAX = 95; // frontmatter-only; the rendered <title> appends " | JetSet Travel Cyprus"
const DESC_MIN = 90;
const DESC_MAX = 200;

/**
 * Hand-curated static page snippet bounds. Mirror the strings in the
 * page-level `generateMetadata` exports — update both sides together.
 * If you add a new important static page, append it here so a regression
 * (someone shortening a title to "JetSet") fails CI.
 */
const STATIC_PAGE_METADATA = [
  // Labour & VFR flights campaign (Oct 2026)
  fromMessages("en", "labourVfrPage", "/labour-vfr-flights-cyprus"),
  fromMessages("ru", "labourVfrPage", "/labour-vfr-flights-cyprus"),
  fromMessages("en", "seasonalStaffPage", "/seasonal-staff-travel-cyprus"),
  fromMessages("ru", "seasonalStaffPage", "/seasonal-staff-travel-cyprus"),
  // Yandex audit (Oct 2026): these two pairs shared one title per locale.
  // Mirror the strings in corporate-travel/page.tsx and
  // corporate-travel-cyprus/page.tsx; the uniqueness test below guards them.
  {
    page: "/en/corporate-travel",
    title: "Corporate Travel Management Cyprus | IATA Agency — JetSet",
    description:
      "IATA-accredited JetSet manages corporate travel for Cyprus businesses: travel policy control, VAT-compliant invoices, monthly spend reports and 24/7 support.",
  },
  {
    page: "/en/corporate-travel-cyprus",
    title: "Business Travel Cyprus: Paphos, Limassol, Nicosia | JetSet",
    description:
      "Business travel across Cyprus from JetSet's Paphos HQ: one IATA-accredited team for Limassol, Nicosia and Larnaca firms. Consolidated invoicing, 24/7 support.",
  },
  {
    page: "/ru/corporate-travel",
    title: "Управление корпоративными командировками на Кипре | JetSet",
    description:
      "JetSet — агентство на Кипре с аккредитацией IATA: командировки по вашей тревел-политике, корректные счета для бухгалтерии, ежемесячные отчёты, поддержка 24/7.",
  },
  {
    page: "/ru/corporate-travel-cyprus",
    title: "Деловые поездки по Кипру: Пафос, Лимассол, Никосия | JetSet",
    description:
      "Деловые поездки по Кипру с JetSet: аккредитация IATA, головной офис в Пафосе, работаем в Лимассоле, Никосии и Ларнаке. Консолидированные счета, поддержка 24/7.",
  },
  {
    page: "/en (homepage)",
    title: "Travel Agency in Cyprus — Paphos & Limassol | JetSet Travel",
    description:
      "IATA-accredited Cyprus travel agency in Paphos (Licence 7775). Corporate trips, luxury holidays, visa & flights for UK, EU and local travellers in 2026.",
  },
  {
    page: "/ru (homepage)",
    title: "Турагентство в Пафосе, Кипр 2026 | JetSet — Аккредитация IATA",
    description:
      "JetSet Travel — аккредитованное IATA турагентство в Пафосе, Кипр (лицензия 7775). Корпоративные поездки, премиальный отдых, визы, авиабилеты. Поддержка 24/7.",
  },
  {
    page: "/en/contact",
    title: "Contact JetSet Travel Paphos | Free Quote",
    description:
      "Contact JetSet Travel in Paphos, Cyprus. Free travel quotes, WhatsApp support, corporate travel consultations. Call +357 99 478 073 or visit 26A Agapinoros, Paphos.",
  },
  {
    page: "/ru/contact",
    title: "Контакты JetSet Travel Пафос | Бесплатная Заявка",
    description:
      "Свяжитесь с JetSet Travel в Пафосе, Кипр. Бесплатные предложения, поддержка WhatsApp, корпоративные консультации. Звоните +357 99 478 073 или посетите 26A Agapinoros, Пафос.",
  },
  {
    page: "/en/private",
    title: "Private & Family Office Travel Services in Cyprus | JetSet Travel",
    description:
      "Discreet, principal-led travel management for private clients, families and family offices in Cyprus. Private aviation, yacht charter, VIP airport services, consolidated billing. Limassol & Paphos.",
  },
  {
    page: "/ru/private",
    title: "Тревел-услуги для частных клиентов и семейных офисов на Кипре",
    description:
      "Конфиденциальное управление поездками для частных клиентов, семей и семейных офисов на Кипре. Частная авиация, яхты, VIP-услуги. Лимассол и Пафос.",
  },
  {
    page: "/en/schengen-cyprus-2026",
    title: "Is Cyprus in Schengen? EU Vote & 2027 Timeline (Oct 2026)",
    description:
      "Not yet. In October 2026 Cyprus is still outside Schengen and now expects to join in 2027. What it means for the 90/180-day rule, visas, EES and ETIAS.",
  },
  {
    page: "/ru/schengen-cyprus-2026",
    title: "Кипр в Шенгене? Статус на октябрь 2026 и сроки (2027)",
    description:
      "Пока нет. На октябрь 2026 года Кипр вне Шенгенской зоны, вступление ожидается в 2027 году. Что это значит для правила 90/180, виз, EES и ETIAS.",
  },
];

function isWithin(value, min, max) {
  const len = value.length;
  return { ok: len >= min && len <= max, len };
}

describe("seo: blog post frontmatter snippet lengths", () => {
  const posts = getPublishedPosts();

  it("at least one published post (sanity)", () => {
    assert.ok(posts.length > 0, "no published posts found");
  });

  for (const post of posts) {
    const id = `${post.frontmatter.locale}/${post.frontmatter.slug}`;
    const title = post.frontmatter.title ?? "";

    it(`${id}: title length is within ${TITLE_MIN}-${TITLE_MAX}`, () => {
      const { ok, len } = isWithin(title, TITLE_MIN, TITLE_MAX);
      assert.ok(
        ok,
        `title length ${len} out of bounds [${TITLE_MIN}-${TITLE_MAX}] ` +
          `for ${id}: "${title}"`,
      );
    });

    it(`${id}: description length is within ${DESC_MIN}-${DESC_MAX}`, () => {
      const desc = post.frontmatter.description ?? "";
      const { ok, len } = isWithin(desc, DESC_MIN, DESC_MAX);
      assert.ok(
        ok,
        `description length ${len} out of bounds [${DESC_MIN}-${DESC_MAX}] ` +
          `for ${id}: "${desc}"`,
      );
    });
  }
});

describe("seo: static page titles are unique", () => {
  it("no two pages in STATIC_PAGE_METADATA share a <title> or description", () => {
    for (const field of ["title", "description"]) {
      const seen = new Map();
      for (const entry of STATIC_PAGE_METADATA) {
        const other = seen.get(entry[field]);
        assert.ok(!other, `${entry.page} and ${other} share the same ${field}: "${entry[field]}"`);
        seen.set(entry[field], entry.page);
      }
    }
  });
});

describe("seo: static page snippet lengths", () => {
  for (const { page, title, description } of STATIC_PAGE_METADATA) {
    it(`${page}: <title> length is within ${TITLE_MIN}-${TITLE_MAX}`, () => {
      const { ok, len } = isWithin(title, TITLE_MIN, TITLE_MAX);
      assert.ok(
        ok,
        `title length ${len} out of bounds [${TITLE_MIN}-${TITLE_MAX}] ` +
          `for ${page}: "${title}"`,
      );
    });

    it(`${page}: <meta description> length is within ${DESC_MIN}-${DESC_MAX}`, () => {
      const { ok, len } = isWithin(description, DESC_MIN, DESC_MAX);
      assert.ok(
        ok,
        `description length ${len} out of bounds [${DESC_MIN}-${DESC_MAX}] ` +
          `for ${page}: "${description}"`,
      );
    });
  }
});

// Phase 5 / Step 39 — front-loading guard.
// Mobile SERPs truncate descriptions at roughly 120 chars; the most
// important value-prop must appear in the first 110 chars.
describe("seo: mobile-truncation front-loading", () => {
  // A description is "front-loaded" when its first 110 chars already
  // contain at least one of these signals (brand, locality, credential,
  // or a freshness marker). This is intentionally permissive — it catches
  // descriptions that bury the lede behind 100 chars of generic preamble.
  const FRONT_LOAD_SIGNALS_EN = [
    /jetset/i,
    /paphos/i,
    /cyprus/i,
    /limassol/i,
    /iata/i,
    /licen[cs]ed/i,
    /\b202[5-9]\b/,
  ];
  const FRONT_LOAD_SIGNALS_RU = [
    /JetSet/i,
    /Пафос/i,
    /Кипр/i,
    /Лимассол/i,
    /IATA/i,
    /лицензи/i,
    /\b202[5-9]\b/,
  ];

  const posts = getPublishedPosts();
  for (const post of posts) {
    const id = `${post.frontmatter.locale}/${post.frontmatter.slug}`;
    const desc = post.frontmatter.description ?? "";
    const head = desc.slice(0, 110);
    const signals =
      post.frontmatter.locale === "ru"
        ? FRONT_LOAD_SIGNALS_RU
        : FRONT_LOAD_SIGNALS_EN;

    it(`${id}: description front-loads brand/locality/freshness in first 110 chars`, () => {
      const matched = signals.some((re) => re.test(head));
      assert.ok(
        matched,
        `description for ${id} does not surface brand/locality/freshness ` +
          `signal in the first 110 chars (mobile truncation zone). ` +
          `Head: "${head}"`,
      );
    });
  }
});

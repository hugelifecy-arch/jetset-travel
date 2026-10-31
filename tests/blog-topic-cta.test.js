/**
 * Topic-matched blog CTAs (src/lib/blog-topic-cta.ts): every post maps to the
 * expected topic, every topic links to a real route, and every topic has
 * complete copy in both message files.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  BLOG_CTA_CONFIG,
  BLOG_CTA_TOPICS,
  blogCtaServiceHref,
  resolveBlogCtaTopic,
  whatsappChatHref,
} from "../src/lib/blog-topic-cta.ts";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const blogDir = join(repoRoot, "content", "blog");
const messages = {
  en: JSON.parse(readFileSync(join(repoRoot, "src", "messages", "en.json"), "utf-8")),
  ru: JSON.parse(readFileSync(join(repoRoot, "src", "messages", "ru.json"), "utf-8")),
};

function posts() {
  return readdirSync(blogDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => matter(readFileSync(join(blogDir, f), "utf-8")).data);
}

const EXPECTED = {
  "vip-airport-service-larnaca-paphos": "vip-airport",
  "vip-obsluzhivanie-aeroport-larnaka-pafos": "vip-airport",
  "private-jet-yacht-charter-cyprus": "private-jet-yacht",
  "chastnyj-samolet-i-yakhta-s-kipra": "private-jet-yacht",
  "private-villa-holidays-mykonos-santorini-crete": "villas",
  "villy-mikonos-santorini-krit-s-kipra": "villas",
  "travel-insurance-cyprus-visitors-guide": "insurance",
  "strakhovka-dlya-poezdki-na-kipr-2026": "insurance",
  "cruises-from-limassol-2026": "cruises",
  "luchshie-kruizy-iz-limassola-2026": "cruises",
  "luxury-cruises-from-cyprus-2027": "cruises",
  "lyuks-kruizy-s-kipra-2027": "cruises",
  "digital-nomads-cyprus-guide": "digital-nomads",
  "digital-nomady-kipr-gid": "digital-nomads",
  "schengen-visa-guide-cyprus-residents": "visa-schengen",
  "shengenskaya-viza-dlya-zhitelej-kipra": "visa-schengen",
  "cyprus-schengen-2026-business-travel": "visa-schengen",
  "kipr-v-shengene-2026-delovye-poezdki": "visa-schengen",
  "corporate-travel-tips-cyprus": "corporate",
  "korporativnye-komandirovki-kipr-gid": "corporate",
  "business-travelers-guide-limassol": "corporate",
  "delovoj-gid-po-limassolu": "corporate",
  "limassol-corporate-retreat-guide": "corporate",
  "korporativnyj-retrit-v-limassole": "corporate",
  "larnaca-vs-paphos-airport-2026": "flights-airports",
  "larnaka-ili-pafos-aeroport-2026": "flights-airports",
  "luxury-travel-cyprus-2026-guide": "luxury",
  "lyuks-puteshestviya-s-kipra-2026-gid": "luxury",
  "luxury-mediterranean-destinations-2026": "luxury",
  "premialnyj-otdykh-sredizemnomorye-2026": "luxury",
  "best-time-visit-cyprus-monthly-guide": "best-time",
  "luchshee-vremya-dlya-poseshcheniya-kipra": "best-time",
  "travel-agency-paphos-guide": "general",
  "winter-staff-flights-cyprus-2026-2027": "labour-vfr",
  "aviabilety-domoj-s-kipra-zima-2026-2027": "labour-vfr",
  "kak-vybrat-turagenstvo-pafos": "general",
};

describe("resolveBlogCtaTopic", () => {
  it("maps the current posts to the expected topics", () => {
    const bySlug = new Map(posts().map((p) => [p.slug, p]));
    for (const [slug, topic] of Object.entries(EXPECTED)) {
      const post = bySlug.get(slug);
      assert.ok(post, `missing post ${slug}`);
      assert.equal(resolveBlogCtaTopic(post), topic, slug);
    }
  });

  it("gives both halves of a translation pair the same topic", () => {
    const all = posts();
    const bySlug = new Map(all.map((p) => [p.slug, p]));
    for (const post of all) {
      const pair = post.translationSlug && bySlug.get(post.translationSlug);
      if (!pair) continue;
      assert.equal(resolveBlogCtaTopic(post), resolveBlogCtaTopic(pair), `${post.slug} ↔ ${pair.slug}`);
    }
  });

  it("falls back to general and tolerates odd tag values", () => {
    assert.equal(resolveBlogCtaTopic({ slug: "something-else" }), "general");
    assert.equal(resolveBlogCtaTopic({ slug: "x", tags: [2026, " Cruises "] }), "cruises");
    assert.equal(resolveBlogCtaTopic({ slug: "x", category: "visas-guides" }), "visa-schengen");
  });
});

describe("blogCtaServiceHref", () => {
  it("links every topic to a route that exists under src/app/[locale]", () => {
    for (const topic of BLOG_CTA_TOPICS) {
      for (const locale of ["en", "ru"]) {
        const href = blogCtaServiceHref(topic, locale);
        assert.ok(href.startsWith(`/${locale}/`), href);
        const segment = href.slice(locale.length + 2).split(/[/#?]/)[0];
        assert.ok(
          existsSync(join(repoRoot, "src", "app", "[locale]", segment, "page.tsx")),
          `${topic}/${locale}: no route for ${href}`,
        );
      }
    }
  });

  it("uses the localized flights page", () => {
    assert.equal(blogCtaServiceHref("flights-airports", "en"), "/en/flight-tickets-cyprus");
    assert.equal(blogCtaServiceHref("flights-airports", "ru"), "/ru/aviabilety-kipr");
    assert.equal(blogCtaServiceHref("general", "ru"), "/ru/quote");
  });
});

describe("blogTopicCta messages", () => {
  const FIELDS = ["title", "text", "button", "whatsapp", "endTitle", "endText"];

  for (const locale of ["en", "ru"]) {
    it(`has complete ${locale} copy for every topic`, () => {
      const ns = messages[locale].blogTopicCta;
      for (const key of ["eyebrow", "whatsappLabel", "newTabHint"]) assert.ok(ns[key], key);
      for (const topic of BLOG_CTA_TOPICS) {
        const copy = ns.topics[BLOG_CTA_CONFIG[topic].messageKey];
        assert.ok(copy, `${locale}: no copy for ${topic}`);
        for (const field of FIELDS) assert.ok(copy[field]?.trim(), `${locale}/${topic}.${field}`);
      }
      assert.ok(messages[locale].blogPage.tocTitle && messages[locale].blogPage.tocNavLabel);
    });

    it(`${locale} copy makes no 24/7, response-time or price promises`, () => {
      const text = JSON.stringify(messages[locale].blogTopicCta);
      assert.doesNotMatch(text, /24\/7|within \d|under \d+ hours?|guarantee|гарант|в течение \d|€|\$|from \d/i);
    });
  }
});

describe("whatsappChatHref", () => {
  it("builds a wa.me chat link with the message URL-encoded", () => {
    assert.equal(
      whatsappChatHref("Hi JetSet, VIP & more?"),
      "https://wa.me/35799478073?text=Hi%20JetSet%2C%20VIP%20%26%20more%3F",
    );
    assert.match(whatsappChatHref("Здравствуйте"), /^https:\/\/wa\.me\/35799478073\?text=%D0%97/);
  });
});

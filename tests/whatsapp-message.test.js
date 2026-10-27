/**
 * Page-aware WhatsApp prefill (src/lib/whatsapp-message.ts): every service
 * page and blog post maps to the right topic, in both languages, and the
 * link never carries anything but the fixed text.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import {
  whatsAppTopic,
  whatsAppMessage,
  whatsAppHref,
} from "../src/lib/whatsapp-message.ts";

describe("whatsAppTopic", () => {
  const pages = {
    "/en/luxury-travel": "luxury",
    "/en/vip-services": "vip",
    "/ru/vip-services": "vip",
    "/ru/luxury-travel-cyprus": "luxury",
    "/en/cruises": "cruise",
    "/ru/private": "private",
    "/en/visa-services": "visa",
    "/en/hotel-reservations": "hotel",
    "/ru/hotel-booking-cyprus": "hotel",
    "/en/flight-tickets-cyprus": "flights",
    "/ru/aviabilety-kipr": "flights",
    "/en/corporate-travel": "corporate",
    "/en/corporate-travel-cyprus/": "corporate",
    "/en/paphos-travel-agency": "paphos",
    "/ru/turisticheskoe-agentstvo-pafos": "paphos",
    "/en/schengen-cyprus-2026": "schengen",
    "/en/quote": "quote",
    "/ru/quote?type=vip": "quote",
    "/en/contact": "contact",
    "/en": "generic",
    "/ru/": "generic",
    "/en/about": "generic",
    "/en/blog": "generic",
    "": "generic",
  };
  for (const [path, topic] of Object.entries(pages)) {
    it(`${path || "(empty)"} → ${topic}`, () => assert.equal(whatsAppTopic(path), topic));
  }
  it("handles a missing pathname", () => {
    assert.equal(whatsAppTopic(null), "generic");
    assert.equal(whatsAppTopic(undefined), "generic");
  });

  const posts = {
    "vip-airport-service-larnaca-paphos": "vip",
    "vip-obsluzhivanie-aeroport-larnaka-pafos": "vip",
    "private-jet-yacht-charter-cyprus": "jet-yacht",
    "chastnyj-samolet-i-yakhta-s-kipra": "jet-yacht",
    "cruises-from-limassol-2026": "cruise",
    "luxury-cruises-from-cyprus-2027": "cruise",
    "lyuks-kruizy-s-kipra-2027": "cruise",
    "private-villa-holidays-mykonos-santorini-crete": "villa",
    "villy-mikonos-santorini-krit-s-kipra": "villa",
    "schengen-visa-guide": "visa",
    "cyprus-schengen-2026-business-travel": "visa",
    "shengenskaya-viza-dlya-zhitelej-kipra": "visa",
    "kipr-v-shengene-2026-delovye-poezdki": "visa",
    "corporate-travel-tips-cyprus": "corporate",
    "korporativnyj-retrit-v-limassole": "corporate",
    "business-travelers-guide-limassol": "corporate",
    "larnaca-vs-paphos-airport-2026": "generic",
  };
  for (const [slug, topic] of Object.entries(posts)) {
    for (const locale of ["en", "ru"]) {
      it(`/${locale}/blog/${slug} → ${topic}`, () => {
        assert.equal(whatsAppTopic(`/${locale}/blog/${slug}`), topic);
      });
    }
  }

  it("covers every current blog post without throwing", () => {
    const slugs = readdirSync(new URL("../content/blog/", import.meta.url))
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
    assert.ok(slugs.length > 0);
    for (const slug of slugs) assert.equal(typeof whatsAppTopic(`/en/blog/${slug}`), "string");
  });
});

describe("whatsAppMessage", () => {
  it("uses the VIP airport text from the brief", () => {
    assert.equal(
      whatsAppMessage("/en/blog/vip-airport-service-larnaca-paphos", "en"),
      "Hi JetSet, I'm interested in VIP airport service (meet & assist). My dates: ",
    );
    assert.match(whatsAppMessage("/ru/blog/vip-obsluzhivanie-aeroport-larnaka-pafos", "ru"), /VIP-обслуживание в аэропорту/);
  });

  it("keeps the existing generic texts as the fallback", () => {
    assert.equal(whatsAppMessage("/en", "en"), "Hi JetSet, I'd like help with...");
    assert.equal(whatsAppMessage("/ru", "ru"), "Здравствуйте JetSet, мне нужна помощь с...");
  });

  it("answers in Russian only for the ru locale", () => {
    assert.match(whatsAppMessage("/ru/cruises", "ru"), /круиз/);
    assert.match(whatsAppMessage("/en/cruises", "en"), /cruise/);
    assert.match(whatsAppMessage("/en/cruises", "de"), /cruise/);
  });

  it("has a non-empty text for every topic in both languages", () => {
    const paths = ["/x/luxury-travel", "/x/cruises", "/x/private", "/x/visa-services", "/x/hotel-reservations",
      "/x/flight-tickets-cyprus", "/x/corporate-travel", "/x/paphos-travel-agency", "/x/schengen-cyprus-2026",
      "/x/quote", "/x/contact", "/x/blog/vip-airport", "/x/blog/private-jet", "/x/blog/villa", "/x"];
    for (const locale of ["en", "ru"]) {
      for (const path of paths) {
        const text = whatsAppMessage(path, locale);
        assert.ok(text.trim().length > 10, `${locale} ${path}`);
        if (locale === "ru") assert.match(text, /[а-яё]/i, `${path} should be Russian`);
      }
    }
  });
});

describe("whatsAppHref", () => {
  it("links to the office number with only the encoded prefill", () => {
    const href = whatsAppHref("/en/cruises?email=leak@example.com#x", "en");
    const url = new URL(href);
    assert.equal(url.origin + url.pathname, "https://wa.me/35799478073");
    assert.deepEqual([...url.searchParams.keys()], ["text"]);
    assert.equal(url.searchParams.get("text"), "Hi JetSet, I'm interested in a cruise. My dates: ");
    assert.ok(!href.includes("leak"));
  });
});

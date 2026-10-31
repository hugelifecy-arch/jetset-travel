/**
 * Labour & VFR flights campaign (Oct 2026): WhatsApp-only enquiries with the
 * owner-approved prefills, both pages registered for SEO in both languages,
 * and copy that stays within what is verified (no prices or guarantees, no
 * Gulf Air to Kathmandu, no Gulf airline flights from Paphos).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  LABOUR_VFR_DESTINATIONS,
  LABOUR_VFR_PATH,
  SEASONAL_STAFF_PATH,
  employerWhatsAppHref,
  employerWhatsAppMessage,
  labourVfrWhatsAppHref,
  labourVfrWhatsAppMessage,
} from "../src/lib/labour-vfr.ts";
import { whatsAppMessage } from "../src/lib/whatsapp-message.ts";
import { CANONICAL_ORIGIN, LOCALE_ALTERNATES } from "../src/lib/canonical.ts";
import { resolveAlternateUrls } from "../src/lib/i18n-route-resolver.ts";
import sitemap from "../src/app/sitemap.ts";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const read = (...p) => readFileSync(join(repoRoot, ...p), "utf-8");
const messages = {
  en: JSON.parse(read("src", "messages", "en.json")),
  ru: JSON.parse(read("src", "messages", "ru.json")),
};

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]],
  );
}

describe("labour-vfr: WhatsApp prefills", () => {
  it("covers exactly the four priority destinations", () => {
    assert.deepEqual(
      LABOUR_VFR_DESTINATIONS.map((d) => `${d.key}:${d.iata}`),
      ["manila:MNL", "kathmandu:KTM", "dhaka:DAC", "delhi:DEL"],
    );
  });

  it("uses the owner-approved English wording per destination", () => {
    for (const city of ["Manila", "Kathmandu", "Dhaka", "Delhi"]) {
      assert.equal(
        labourVfrWhatsAppMessage(city.toLowerCase(), "en"),
        `Hello JetSet Travel, I would like a special Labour/VFR flight quotation from Cyprus to ${city}. Please advise the available fares.`,
      );
    }
    assert.equal(
      employerWhatsAppMessage("en"),
      "Hello JetSet Travel, I manage employees in Cyprus and would like a quotation for seasonal staff flights and return travel.",
    );
  });

  it("answers in Russian on Russian pages, with the city in the accusative", () => {
    assert.match(labourVfrWhatsAppMessage("manila", "ru"), /^Здравствуйте, JetSet Travel!.*с Кипра в Манилу\./);
    assert.match(labourVfrWhatsAppMessage("dhaka", "ru"), /в Дакку\./);
    assert.match(employerWhatsAppMessage("ru"), /сезонного персонала/);
  });

  it("matches the floating button text on the two pages", () => {
    assert.equal(labourVfrWhatsAppMessage(null, "en"), whatsAppMessage(`/en${LABOUR_VFR_PATH}`, "en"));
    assert.equal(labourVfrWhatsAppMessage(null, "ru"), whatsAppMessage(`/ru${LABOUR_VFR_PATH}`, "ru"));
    assert.equal(employerWhatsAppMessage("ru"), whatsAppMessage(`/ru${SEASONAL_STAFF_PATH}`, "ru"));
  });

  it("builds wa.me links to the office number carrying only the encoded text", () => {
    const href = labourVfrWhatsAppHref("kathmandu", "en");
    const url = new URL(href);
    assert.equal(url.origin + url.pathname, "https://wa.me/35799478073");
    assert.deepEqual([...url.searchParams.keys()], ["text"]);
    assert.equal(url.searchParams.get("text"), labourVfrWhatsAppMessage("kathmandu", "en"));
    assert.match(employerWhatsAppHref("ru"), /^https:\/\/wa\.me\/35799478073\?text=%D0%97/);
  });

  it("rejects an unknown destination", () => {
    assert.throws(() => labourVfrWhatsAppMessage("london", "en"));
  });
});

describe("labour-vfr: routes and SEO registration", () => {
  const entries = sitemap();
  const byUrl = new Map(entries.map((e) => [e.url, e]));

  for (const path of [LABOUR_VFR_PATH, SEASONAL_STAFF_PATH]) {
    it(`${path} exists as an app route`, () => {
      assert.ok(existsSync(join(repoRoot, "src", "app", "[locale]", path.slice(1), "page.tsx")));
    });

    for (const locale of ["en", "ru"]) {
      it(`/${locale}${path} is in the sitemap with EN/RU hreflang`, () => {
        const entry = byUrl.get(`${CANONICAL_ORIGIN}/${locale}${path}`);
        assert.ok(entry, "missing sitemap entry");
        assert.equal(entry.alternates.languages.en, `${CANONICAL_ORIGIN}/en${path}`);
        assert.equal(entry.alternates.languages.ru, `${CANONICAL_ORIGIN}/ru${path}`);
        assert.equal(entry.alternates.languages["x-default"], `${CANONICAL_ORIGIN}/en${path}`);
      });

      it(`/${locale}${path} has a language-switcher counterpart`, () => {
        assert.ok(LOCALE_ALTERNATES[`/${locale}${path}`]);
        const alt = resolveAlternateUrls(`/${locale}${path}`);
        assert.equal(alt.en, `${CANONICAL_ORIGIN}/en${path}`);
        assert.equal(alt.ru, `${CANONICAL_ORIGIN}/ru${path}`);
      });
    }
  }

  it("the winter article is published in both languages and paired", () => {
    const sitemapUrls = entries.map((e) => e.url);
    assert.ok(sitemapUrls.includes(`${CANONICAL_ORIGIN}/en/blog/winter-staff-flights-cyprus-2026-2027`));
    assert.ok(sitemapUrls.includes(`${CANONICAL_ORIGIN}/ru/blog/aviabilety-domoj-s-kipra-zima-2026-2027`));
    const alt = resolveAlternateUrls("/en/blog/winter-staff-flights-cyprus-2026-2027");
    assert.equal(alt.ru, `${CANONICAL_ORIGIN}/ru/blog/aviabilety-domoj-s-kipra-zima-2026-2027`);
  });

  it("the article links to both service pages in each language", () => {
    const en = read("content", "blog", "winter-staff-flights-cyprus-2026-2027.md");
    const ru = read("content", "blog", "aviabilety-domoj-s-kipra-zima-2026-2027.md");
    for (const [body, locale] of [[en, "en"], [ru, "ru"]]) {
      assert.ok(body.includes(`](/${locale}${LABOUR_VFR_PATH}`), `${locale}: no link to Labour/VFR page`);
      assert.ok(body.includes(`](/${locale}${SEASONAL_STAFF_PATH})`), `${locale}: no link to employer page`);
    }
  });

  it("Corporate Travel, Flights, Services, homepage, nav and footer link to the new pages", () => {
    const links = [
      [["src", "app", "[locale]", "corporate-travel", "CorporateTravelContent.tsx"], SEASONAL_STAFF_PATH],
      [["src", "app", "[locale]", "flight-tickets-cyprus", "FlightPageContent.tsx"], LABOUR_VFR_PATH],
      [["src", "app", "[locale]", "services", "page.tsx"], LABOUR_VFR_PATH],
      [["src", "app", "[locale]", "services", "page.tsx"], SEASONAL_STAFF_PATH],
      [["src", "components", "sections", "ServicesGrid.tsx"], LABOUR_VFR_PATH],
      [["src", "components", "layout", "HeaderClient.tsx"], LABOUR_VFR_PATH],
      [["src", "components", "layout", "Footer.tsx"], LABOUR_VFR_PATH],
      [["src", "components", "layout", "Footer.tsx"], SEASONAL_STAFF_PATH],
    ];
    for (const [file, path] of links) {
      assert.ok(read(...file).includes(path), `${file.join("/")} does not link to ${path}`);
    }
  });
});

describe("labour-vfr: page copy", () => {
  for (const ns of ["labourVfrPage", "seasonalStaffPage"]) {
    it(`${ns} has the same keys in EN and RU, none empty`, () => {
      const en = new Map(flatten(messages.en[ns]));
      const ru = new Map(flatten(messages.ru[ns]));
      assert.deepEqual([...en.keys()].sort(), [...ru.keys()].sort());
      for (const [k, v] of [...en, ...ru]) assert.ok(String(v).trim(), `${ns}.${k} is empty`);
    });

    for (const locale of ["en", "ru"]) {
      it(`${locale} ${ns} makes no price, discount or guarantee claims`, () => {
        const text = JSON.stringify(messages[locale][ns]);
        assert.doesNotMatch(
          text,
          /€|\$|£|\d+\s?(?:kg|кг)\b|guarantee|гарант|cheapest guaranteed|\d+\s?%|24\/7|lowest price|самые низкие/i,
        );
      });
    }
  }

  for (const locale of ["en", "ru"]) {
    it(`${locale}: Gulf Air is never offered to Kathmandu`, () => {
      const kathmandu = messages[locale].labourVfrPage.destinations.kathmandu;
      const routing = kathmandu.routing;
      assert.match(routing, /Qatar Airways/);
      assert.match(routing, /Emirates/);
      assert.match(routing, locale === "en" ? /Gulf Air does not fly/ : /Gulf Air в Катманду не летает/);
      assert.doesNotMatch(kathmandu.text, /Gulf Air/);
    });

    it(`${locale}: says the journeys start at Larnaca, not Paphos`, () => {
      const note = messages[locale].labourVfrPage.airlinesNote;
      assert.match(note, locale === "en" ? /None of the three airlines flies from Paphos/ : /не летает из Пафоса/);
    });
  }
});

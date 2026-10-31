/**
 * Bing Webmaster (Oct 2026) indexed Russian blog slugs under /en/blog/ and
 * English slugs under /ru/blog/. Each must 301 to the translated article
 * in the requested locale (never to the blog index), in one hop.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getPublishedPosts } from "../src/lib/blog.ts";
import {
  BLOG_SLUG_PAIRS_EN_TO_RU,
  wrongLocaleBlogRedirects,
} from "../src/lib/blog-translation-pairs.ts";

const redirects = wrongLocaleBlogRedirects();
const bySource = new Map(redirects.map((r) => [r.source, r]));
const published = new Map(getPublishedPosts().map((p) => [`/${p.frontmatter.locale}/blog/${p.frontmatter.slug}`, p]));

// The URLs Bing reported, with the article each must land on.
const BING_REPORTED = {
  "/en/blog/korporativnyj-retrit-v-limassole": "/en/blog/limassol-corporate-retreat-guide",
  "/en/blog/lyuks-puteshestviya-s-kipra-2026-gid": "/en/blog/luxury-travel-cyprus-2026-guide",
  "/en/blog/villy-mikonos-santorini-krit-s-kipra": "/en/blog/private-villa-holidays-mykonos-santorini-crete",
  "/en/blog/kak-vybrat-turagenstvo-pafos": "/en/blog/travel-agency-paphos-guide",
  "/en/blog/shengenskaya-viza-dlya-zhitelej-kipra": "/en/blog/schengen-visa-guide-cyprus-residents",
  "/en/blog/luchshie-kruizy-iz-limassola-2026": "/en/blog/cruises-from-limassol-2026",
  "/en/blog/premialnyj-otdykh-sredizemnomorye-2026": "/en/blog/luxury-mediterranean-destinations-2026",
  "/ru/blog/luxury-travel-cyprus-2026-guide": "/ru/blog/lyuks-puteshestviya-s-kipra-2026-gid",
  "/ru/blog/luxury-mediterranean-destinations-2026": "/ru/blog/premialnyj-otdykh-sredizemnomorye-2026",
  "/ru/blog/best-time-visit-cyprus-monthly-guide": "/ru/blog/luchshee-vremya-dlya-poseshcheniya-kipra",
  "/ru/blog/business-travelers-guide-limassol": "/ru/blog/delovoj-gid-po-limassolu",
  "/ru/blog/cyprus-schengen-2026-business-travel": "/ru/blog/kipr-v-shengene-2026-delovye-poezdki",
  "/ru/blog/cruises-from-limassol-2026": "/ru/blog/luchshie-kruizy-iz-limassola-2026",
};

describe("blog: wrong-locale slugs 301 to the translated article", () => {
  for (const [source, destination] of Object.entries(BING_REPORTED)) {
    it(`${source} -> ${destination} (301)`, () => {
      const r = bySource.get(source);
      assert.ok(r, `no redirect for ${source}`);
      assert.equal(r.destination, destination);
      assert.equal(r.statusCode, 301);
    });
  }

  it("covers both directions of every translated pair", () => {
    assert.equal(redirects.length, Object.keys(BLOG_SLUG_PAIRS_EN_TO_RU).length * 2);
  });

  it("every destination is a published post in the requested locale, never the blog index", () => {
    for (const r of redirects) {
      const sourceLocale = r.source.split("/")[1];
      assert.ok(r.destination.startsWith(`/${sourceLocale}/blog/`), r.destination);
      assert.notEqual(r.destination, `/${sourceLocale}/blog`);
      const post = published.get(r.destination);
      assert.ok(post, `${r.source} -> ${r.destination} is not a published post`);
      assert.equal(post.frontmatter.locale, sourceLocale);
    }
  });

  it("no source is itself a live URL in its own locale", () => {
    for (const r of redirects) assert.ok(!published.has(r.source), `${r.source} is a real post URL`);
  });

  it("next.config.ts uses the generated list and no longer has a 308 copy of the Schengen rule", () => {
    const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf-8");
    assert.match(config, /\.\.\.wrongLocaleBlogRedirects\(\)/);
    assert.doesNotMatch(config, /source:\s*"\/ru\/blog\/cyprus-schengen-2026-business-travel"/);
  });
});

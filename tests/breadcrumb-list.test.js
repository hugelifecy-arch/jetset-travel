/**
 * Blog posts render their own breadcrumb trail (with the post title) and the
 * layout-level Breadcrumbs / BreadcrumbSchema skip them, so each page has one
 * breadcrumb nav and one BreadcrumbList (axe landmark-unique).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { breadcrumbListSchema, isBlogPostSegments } from "../src/components/seo/breadcrumb-list.ts";

describe("isBlogPostSegments", () => {
  it("matches /<locale>/blog/<slug> only", () => {
    assert.equal(isBlogPostSegments(["blog", "vip-airport-service-larnaca-paphos"]), true);
    assert.equal(isBlogPostSegments(["blog"]), false);
    assert.equal(isBlogPostSegments(["blog", "a", "b"]), false);
    assert.equal(isBlogPostSegments(["cruises", "x"]), false);
  });
});

describe("breadcrumbListSchema", () => {
  it("numbers the items from 1 and makes the URLs absolute", () => {
    const schema = breadcrumbListSchema(
      [
        { name: "Главная", href: "/ru" },
        { name: "Блог", href: "/ru/blog" },
        { name: "VIP-обслуживание в аэропортах", href: "/ru/blog/vip-obsluzhivanie-aeroport-larnaka-pafos" },
      ],
      "https://www.jetset-travel.com",
    );
    assert.deepEqual(schema, {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: "https://www.jetset-travel.com/ru" },
        { "@type": "ListItem", position: 2, name: "Блог", item: "https://www.jetset-travel.com/ru/blog" },
        {
          "@type": "ListItem",
          position: 3,
          name: "VIP-обслуживание в аэропортах",
          item: "https://www.jetset-travel.com/ru/blog/vip-obsluzhivanie-aeroport-larnaka-pafos",
        },
      ],
    });
  });
});

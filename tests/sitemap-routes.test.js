/**
 * sitemap.xml is generated from the route folders and blog content, never a
 * hand-kept list. These tests pin that: every indexable page is listed,
 * nothing else is, and the hreflang derived from routes + redirects agrees
 * with LOCALE_ALTERNATES (the language switcher's map).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sitemap from "../src/app/sitemap.ts";
import { CANONICAL_ORIGIN, LOCALE_ALTERNATES } from "../src/lib/canonical.ts";
import { PAGE_LAST_MODIFIED } from "../src/lib/page-dates.ts";
import { discoverPageRoutes, indexableStaticPages } from "../src/lib/page-routes.ts";
import { resolvePathRedirect } from "../src/lib/redirects.ts";
import { NOINDEX_LOCALE_PATHS } from "../src/lib/seo.ts";
import { getPublishedPosts } from "../src/lib/blog.ts";

const entries = sitemap();
const locs = entries.map((e) => e.url);
const paths = locs.map((u) => new URL(u).pathname);

describe("sitemap: static pages come from the route folders", () => {
  const routes = discoverPageRoutes();

  it("finds the landing pages added since the last hand-kept list", () => {
    for (const r of [
      "",
      "/labour-vfr-flights-cyprus",
      "/seasonal-staff-travel-cyprus",
      "/schengen-cyprus-2026",
      "/paphos-travel-agency",
      "/turisticheskoe-agentstvo-pafos",
      "/flight-tickets-cyprus",
      "/aviabilety-kipr",
      "/blog",
    ]) {
      assert.ok(routes.includes(r), `route folder ${r || "(root)"} not discovered`);
    }
  });

  it("matches every src/app/[locale]/*/page.tsx folder, and nothing dynamic", () => {
    const dir = fileURLToPath(new URL("../src/app/[locale]/", import.meta.url));
    const folders = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("["))
      .filter((d) => readdirSync(join(dir, d.name)).includes("page.tsx"))
      .map((d) => `/${d.name}`);
    assert.deepEqual(routes.filter((r) => r !== "" && !r.slice(1).includes("/")), folders.sort());
    assert.ok(!routes.some((r) => r.includes("[")), "dynamic segments must not be listed");
  });

  it("every route folder has a lastmod in src/lib/page-dates.ts", () => {
    for (const r of routes) {
      assert.ok(r in PAGE_LAST_MODIFIED, `add "${r}" to PAGE_LAST_MODIFIED in src/lib/page-dates.ts`);
    }
  });

  it("lists every indexable (route, locale) and only those", () => {
    const expected = new Set(indexableStaticPages().map((p) => p.path));
    const staticPaths = paths.filter((p) => !/^\/(en|ru)\/blog\/./.test(p));
    assert.deepEqual(new Set(staticPaths), expected);
    for (const r of routes) {
      for (const l of ["en", "ru"]) {
        const p = `/${l}${r}`;
        const shouldList = !resolvePathRedirect(p) && !NOINDEX_LOCALE_PATHS.has(p);
        assert.equal(paths.includes(p), shouldList, `${p}: listed=${paths.includes(p)}, expected ${shouldList}`);
      }
    }
  });

  it("discovers nested folders and route groups, skips dynamic/private/parallel ones", () => {
    const root = mkdtempSync(join(tmpdir(), "routes-"));
    try {
      const page = (p) => {
        mkdirSync(join(root, p), { recursive: true });
        writeFileSync(join(root, p, "page.tsx"), "export default function P() { return null; }");
      };
      page(".");
      page("new-landing");
      page("guides/visa");
      page("(marketing)/promo");
      page("[slug]");
      page("_private");
      page("@modal/login");
      mkdirSync(join(root, "no-page"), { recursive: true });
      assert.deepEqual(discoverPageRoutes(root), ["", "/guides/visa", "/new-landing", "/promo"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("sitemap: only canonical, indexable URLs", () => {
  it("has no duplicates", () => {
    assert.equal(new Set(locs).size, locs.length);
  });

  it("has no query strings, fragments, API routes or text files", () => {
    for (const u of locs) {
      const url = new URL(u);
      assert.equal(url.search, "", `${u} has a query string`);
      assert.equal(url.hash, "", `${u} has a fragment`);
      assert.ok(!url.pathname.startsWith("/api/"), `${u} is an API route`);
      assert.ok(!/\.(txt|xml|json)$/.test(url.pathname), `${u} is a file, not a page`);
      assert.match(url.pathname, /^\/(en|ru)(\/|$)/, `${u} is not locale-prefixed`);
    }
  });

  it("stays far below the 50,000-URL limit", () => {
    assert.ok(entries.length < 50000);
  });

  it("lists every published post once", () => {
    for (const post of getPublishedPosts()) {
      const p = `/${post.frontmatter.locale}/blog/${post.frontmatter.slug}`;
      assert.ok(paths.includes(p), `${p} missing`);
    }
  });
});

describe("sitemap: lastmod is per page, not the build time", () => {
  it("every entry carries a YYYY-MM-DD date that is not in the future", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const e of entries) {
      assert.match(String(e.lastModified), /^\d{4}-\d{2}-\d{2}$/, `${e.url} lastmod=${e.lastModified}`);
      assert.ok(String(e.lastModified) <= today, `${e.url} lastmod ${e.lastModified} is in the future`);
    }
  });

  it("uses more than one date", () => {
    assert.ok(new Set(entries.map((e) => e.lastModified)).size > 3);
  });
});

describe("sitemap: hreflang derived from routes agrees with LOCALE_ALTERNATES", () => {
  for (const [key, entry] of Object.entries(LOCALE_ALTERNATES)) {
    if (NOINDEX_LOCALE_PATHS.has(key)) continue;
    it(key, () => {
      const e = entries.find((x) => x.url === `${CANONICAL_ORIGIN}${key}`);
      assert.ok(e, `${key} is in LOCALE_ALTERNATES but not in the sitemap`);
      const langs = e.alternates.languages;
      for (const l of ["en", "ru"]) {
        const want = entry[l] && !NOINDEX_LOCALE_PATHS.has(entry[l]) ? `${CANONICAL_ORIGIN}${entry[l]}` : undefined;
        assert.equal(langs[l], want, `${key} hreflang=${l}`);
      }
      assert.equal(langs["x-default"], langs.en ?? langs.ru);
    });
  }
});

describe("blog: a draft translation is not an hreflang target", () => {
  it("getPostTranslationSlug treats a draft counterpart as untranslated", () => {
    const root = mkdtempSync(join(tmpdir(), "blog-"));
    try {
      mkdirSync(join(root, "content", "blog"), { recursive: true });
      const post = (slug, locale, status, translationSlug) =>
        writeFileSync(
          join(root, "content", "blog", `${slug}.md`),
          `---\ntitle: T\ndescription: D\ndate: "2026-01-01"\nauthor: A\nslug: ${slug}\nimage: /i.jpg\ncategory: cyprus\ntags: []\nlocale: ${locale}\nstatus: ${status}\ntranslationSlug: ${translationSlug}\n---\nBody\n`,
        );
      post("live-en", "en", "published", "draft-ru");
      post("draft-ru", "ru", "draft", "live-en");
      post("pair-en", "en", "published", "pair-ru");
      post("pair-ru", "ru", "published", "pair-en");
      const blogTs = fileURLToPath(new URL("../src/lib/blog.ts", import.meta.url));
      const out = execFileSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          `const b = await import(${JSON.stringify(blogTs)});
           console.log(JSON.stringify([b.getPostTranslationSlug("live-en"), b.getPostTranslationSlug("pair-ru")]));`,
        ],
        { cwd: root, encoding: "utf8", env: { ...process.env, NODE_ENV: "test" } },
      );
      assert.deepEqual(JSON.parse(out), [{ en: "live-en" }, { en: "pair-en", ru: "pair-ru" }]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

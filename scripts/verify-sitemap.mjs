#!/usr/bin/env node
/**
 * Fetch every <loc> in sitemap.xml and check that it is a clean, indexable,
 * canonical page. Prints a pass/fail table and exits 1 on any failure.
 *
 *   node scripts/verify-sitemap.mjs                      # live site
 *   node scripts/verify-sitemap.mjs --base http://localhost:3000   # a local `next start`
 *
 * With --base, the sitemap and every page are fetched from that origin, but
 * the <loc>, canonical and hreflang URLs are still compared as written
 * (they are absolute https://www.jetset-travel.com URLs in any environment).
 *
 * Checks per URL:
 *   200        HTTP status is 200
 *   noRedir    the response is not a redirect (fetched with redirect: "manual")
 *   canonical  <link rel="canonical"> equals the <loc> exactly
 *   indexable  no "noindex" in <meta name="robots"> or the X-Robots-Tag header
 *   title      <title> exists and no other sitemap URL has the same title
 *   hreflang   the page lists itself under its own language; every alternate
 *              it lists links back to it (reciprocal); the page's alternates
 *              match the sitemap's <xhtml:link> alternates for that <loc>
 * Plus robots.txt: has a Sitemap: line, no obsolete Host: / Crawl-delay:.
 */

const ORIGIN = "https://www.jetset-travel.com";
const argIndex = process.argv.indexOf("--base");
const BASE = (argIndex > -1 ? process.argv[argIndex + 1] : ORIGIN).replace(/\/+$/, "");
const CONCURRENCY = 8;

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

/** Map an absolute production URL to the origin being tested. */
const toBase = (url) => {
  const u = new URL(url);
  return `${BASE}${u.pathname}${u.search}`;
};

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*"([^"]*)"/g)) out[m[1].toLowerCase()] = decode(m[2]);
  return out;
}

function parsePage(html) {
  const head = html.split(/<\/head>/i)[0];
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const canonical = links.filter((l) => l.rel === "canonical").map((l) => l.href);
  const alternates = {};
  for (const l of links) {
    if (l.rel === "alternate" && l.hreflang && l.href) alternates[l.hreflang] = l.href;
  }
  const robots = [...head.matchAll(/<meta\b[^>]*>/gi)]
    .map((m) => attrs(m[0]))
    .filter((m) => ["robots", "googlebot", "yandex"].includes((m.name || "").toLowerCase()))
    .map((m) => m.content || "");
  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return {
    canonical,
    alternates,
    robots,
    title: titleMatch ? decode(titleMatch[1]).trim() : "",
  };
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
    const block = m[1];
    const loc = decode(block.match(/<loc>([^<]+)<\/loc>/)[1].trim());
    const alternates = {};
    for (const a of block.matchAll(/<xhtml:link\b[^>]*>/g)) {
      const at = attrs(a[0]);
      if (at.hreflang && at.href) alternates[at.hreflang] = at.href;
    }
    return { loc, alternates };
  });
}

async function fetchPage(url) {
  const res = await fetch(toBase(url), { redirect: "manual", headers: { "User-Agent": "jetset-verify-sitemap/1.0" } });
  const html = res.status === 200 ? await res.text() : "";
  return {
    status: res.status,
    location: res.headers.get("location"),
    xRobots: res.headers.get("x-robots-tag") || "",
    ...parsePage(html),
  };
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

/** The hreflang code a URL represents on its own page (ru for /ru/..., else en). */
const ownLang = (url) => (new URL(url).pathname.startsWith("/ru") ? "ru" : "en");

const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
if (sitemapRes.status !== 200) {
  console.error(`sitemap.xml returned HTTP ${sitemapRes.status}`);
  process.exit(1);
}
const entries = parseSitemap(await sitemapRes.text());
const pages = new Map();
const results = await mapLimit(entries, CONCURRENCY, (e) => fetchPage(e.loc));
entries.forEach((e, i) => pages.set(e.loc, results[i]));

// Alternates that are not themselves in the sitemap still need fetching
// for the reciprocity check.
const extra = [
  ...new Set(results.flatMap((p) => Object.values(p.alternates)).filter((u) => !pages.has(u))),
];
const extraResults = await mapLimit(extra, CONCURRENCY, (u) => fetchPage(u));
extra.forEach((u, i) => pages.set(u, extraResults[i]));

const titleCount = new Map();
for (const e of entries) {
  const t = pages.get(e.loc).title;
  if (t) titleCount.set(t, (titleCount.get(t) || 0) + 1);
}

const rows = entries.map(({ loc, alternates: smAlts }) => {
  const p = pages.get(loc);
  const problems = [];
  const ok200 = p.status === 200;
  if (!ok200) problems.push(`HTTP ${p.status}`);
  const noRedir = !(p.status >= 300 && p.status < 400);
  if (!noRedir) problems.push(`redirects to ${p.location}`);
  const canonical = p.canonical.length === 1 && p.canonical[0] === loc;
  if (ok200 && !canonical) problems.push(`canonical=${p.canonical.join(" , ") || "missing"}`);
  const robots = [...p.robots, p.xRobots].join(" ");
  const indexable = ok200 && !/noindex|none/i.test(robots);
  if (ok200 && !indexable) problems.push(`robots="${robots.trim()}"`);
  const titleOk = !!p.title && titleCount.get(p.title) === 1;
  if (ok200 && !p.title) problems.push("no <title>");
  else if (ok200 && !titleOk) problems.push(`duplicate title "${p.title}"`);

  let hreflangOk = ok200;
  if (ok200) {
    const own = ownLang(loc);
    if (p.alternates[own] !== loc) {
      hreflangOk = false;
      problems.push(`no self hreflang=${own}`);
    }
    for (const [lang, href] of Object.entries(p.alternates)) {
      if (href === loc) continue;
      const target = pages.get(href);
      if (!target || target.status !== 200) {
        hreflangOk = false;
        problems.push(`hreflang=${lang} -> ${href} is HTTP ${target?.status}`);
      } else if (!Object.values(target.alternates).includes(loc)) {
        hreflangOk = false;
        problems.push(`hreflang=${lang} -> ${new URL(href).pathname} does not link back`);
      }
    }
    const pageKeys = Object.keys(p.alternates).sort().join(",");
    const smKeys = Object.keys(smAlts).sort().join(",");
    const same =
      pageKeys === smKeys && Object.entries(smAlts).every(([k, v]) => p.alternates[k] === v);
    if (Object.keys(smAlts).length && !same) {
      hreflangOk = false;
      problems.push("page hreflang differs from sitemap alternates");
    }
  }

  return { path: new URL(loc).pathname, ok200, noRedir, canonical, indexable, titleOk, hreflangOk, problems };
});

const mark = (b) => (b ? "PASS" : "FAIL");
const w = Math.max(...rows.map((r) => r.path.length), 4);
const cols = ["200", "noRedir", "canonical", "indexable", "title", "hreflang"];
console.log(`Base: ${BASE}  ·  ${rows.length} sitemap URLs (+${extra.length} alternates fetched)\n`);
console.log(`${"URL".padEnd(w)}  ${cols.map((c) => c.padEnd(9)).join(" ")} result`);
console.log(`${"-".repeat(w)}  ${cols.map(() => "-".repeat(9)).join(" ")} ------`);
for (const r of rows) {
  const checks = [r.ok200, r.noRedir, r.canonical, r.indexable, r.titleOk, r.hreflangOk];
  const pass = checks.every(Boolean);
  console.log(`${r.path.padEnd(w)}  ${checks.map((c) => mark(c).padEnd(9)).join(" ")} ${pass ? "PASS" : "FAIL"}`);
  if (!pass) for (const msg of r.problems) console.log(`${"".padEnd(w)}    ↳ ${msg}`);
}

// robots.txt
const robotsTxt = await (await fetch(`${BASE}/robots.txt`)).text();
const robotsProblems = [];
if (!/^Sitemap:\s*https:\/\/www\.jetset-travel\.com\/sitemap\.xml\s*$/im.test(robotsTxt)) robotsProblems.push("missing Sitemap: line");
if (/^Host:/im.test(robotsTxt)) robotsProblems.push("obsolete Host: line");
if (/^Crawl-delay:/im.test(robotsTxt)) robotsProblems.push("obsolete Crawl-delay: line");
console.log(`\nrobots.txt: ${robotsProblems.length ? `FAIL (${robotsProblems.join(", ")})` : "PASS"}`);

const failed = rows.filter((r) => r.problems.length).length;
console.log(`\n${rows.length - failed}/${rows.length} URLs pass all checks${failed ? `, ${failed} FAIL` : ""}.`);
process.exit(failed || robotsProblems.length ? 1 : 0);

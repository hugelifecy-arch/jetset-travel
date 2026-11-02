#!/usr/bin/env node
/**
 * Suggest a per-page, per-locale last content change for the static pages
 * in src/app/sitemap.ts, from git history.
 *
 * A page "changed" when a commit changed its actual content:
 *   - the page's own copy in src/messages/<locale>.json (its namespaces), or
 *   - code lines in its route folder (and, for the homepage, the section
 *     components it renders) other than imports, comments and blank lines.
 * Metadata alone (<title>, meta description, keywords: anything inside
 * generateMetadata, or metaTitle/metaDescription keys) is NOT a content
 * change: Google reads <lastmod> as "the main content changed".
 * Shared chrome (header, footer, CTA banner, cross-link blocks) is NOT
 * counted: it is on every page and would push every date to the same day,
 * which is exactly what the sitemap must not do.
 *
 * Usage:  node scripts/suggest-lastmod.mjs          # print a table
 *         node scripts/suggest-lastmod.mjs --json   # machine-readable
 * Needs full git history (in a shallow clone: git fetch --unshallow).
 * Copy the dates into src/lib/page-dates.ts (used by the sitemap and by
 * the pages' structured-data dateModified); from then on, bump a page's
 * date by hand in the same commit as its content change.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const git = (...args) =>
  execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
  });

if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
  console.error("Shallow clone: run `git fetch --unshallow` first, dates would be wrong.");
  process.exit(2);
}

const APP = "src/app/[locale]";

/** Route folder (relative to APP) that renders each locale of a sitemap path. */
const ROUTES = {
  "": { en: ".", ru: "." },
  "/paphos-travel-agency|/turisticheskoe-agentstvo-pafos": { en: "paphos-travel-agency", ru: "turisticheskoe-agentstvo-pafos" },
  "/flight-tickets-cyprus|/aviabilety-kipr": { en: "flight-tickets-cyprus", ru: "aviabilety-kipr" },
};

const sitemapSrc = readFileSync("src/app/sitemap.ts", "utf8");
const staticPaths = [...sitemapSrc.matchAll(/\{\s*path:\s*"([^"]*)"/g)].map((m) => m[1]);
const pageKeys = [
  ...staticPaths,
  ...Object.keys(ROUTES).filter((k) => k.includes("|")),
];

/** Files whose code counts as the page's content. */
function filesFor(dir) {
  if (dir === ".") {
    // Homepage: page.tsx + the section components it imports.
    const page = `${APP}/page.tsx`;
    const src = readFileSync(page, "utf8");
    const sections = [...src.matchAll(/@\/components\/sections\/(\w+)/g)]
      .map((m) => `src/components/sections/${m[1]}.tsx`)
      .filter((f) => existsSync(f) && !/CTABanner|ServicesCrossLinks/.test(f));
    return [page, ...sections];
  }
  const root = `${APP}/${dir}`;
  if (!existsSync(root)) return [];
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) {
        if (!name.startsWith("[")) walk(p); // skip /blog/[slug]
      } else if (/\.(tsx?|jsx?)$/.test(name)) out.push(p);
    }
  };
  walk(root);
  // Content components imported from a sibling route (e.g. aviabilety-kipr
  // renders flight-tickets-cyprus/FlightPageContent).
  for (const f of [...out]) {
    for (const m of readFileSync(f, "utf8").matchAll(/from\s+"\.\.\/([\w-]+)\/(\w+)"/g)) {
      const sib = `${APP}/${m[1]}/${m[2]}.tsx`;
      if (existsSync(sib) && !out.includes(sib)) out.push(sib);
    }
  }
  return out;
}

const SHARED_NAMESPACES = new Set(["cta", "services", "common", "nav", "footer", "forms", "cookies", "exitIntent", "mobileBar"]);

function namespacesIn(files) {
  const ns = new Set();
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/namespace:\s*"(\w+)"|useTranslations\(\s*"(\w+)"/g)) ns.add(m[1] ?? m[2]);
  }
  for (const s of SHARED_NAMESPACES) ns.delete(s);
  return ns;
}

const isNoise = (line) => {
  const t = line.slice(1).trim();
  return (
    t === "" ||
    t.startsWith("import ") ||
    t.startsWith("//") ||
    t.startsWith("/*") ||
    t.startsWith("*") ||
    t.startsWith("*/") ||
    /^}\s*from\s+"/.test(t) ||
    // Where the date comes from is not content (page-dates.ts is the source).
    /^dateModified[=:]\s*\{?(pageLastModified\(|SERVICE_LAST_UPDATED|LABOUR_VFR_LAST_UPDATED)/.test(t) ||
    /^[\w,\s{}]+,?$/.test(t) // lines inside a multi-line import list
  );
};

/** Latest commit date (YYYY-MM-DD) that changed real code in `files`. */
function codeDate(files) {
  if (!files.length) return null;
  const log = git("log", "--format=%H %cs", "--", ...files).trim().split("\n").filter(Boolean);
  for (const row of log) {
    const [sha, date] = row.split(" ");
    const diff = git("show", "--format=", "--unified=0", sha, "--", ...files);
    let inMetadata = false;
    const changed = [];
    for (const l of diff.split("\n")) {
      // git labels each hunk with its enclosing top-level declaration.
      if (l.startsWith("@@")) {
        inMetadata = /generateMetadata/.test(l);
        continue;
      }
      if (inMetadata) continue;
      if ((l.startsWith("+") || l.startsWith("-")) && !l.startsWith("+++") && !l.startsWith("---")) changed.push(l);
    }
    if (changed.some((l) => !isNoise(l))) return date;
  }
  return null;
}

/** A namespace's visible copy: everything except its <title>/description keys. */
const content = (ns) =>
  ns && typeof ns === "object"
    ? Object.fromEntries(Object.entries(ns).filter(([k]) => !/^meta(Title|Description|Keywords)$/.test(k)))
    : ns;

/** Map namespace -> latest commit date where its JSON value changed, per locale. */
function namespaceDates(locale) {
  const file = `src/messages/${locale}.json`;
  const shas = git("log", "--format=%H %cs", "--", file).trim().split("\n").filter(Boolean);
  const show = (rev) => {
    try {
      return JSON.parse(git("show", `${rev}:${file}`));
    } catch {
      return {};
    }
  };
  const dates = new Map();
  for (const row of shas) {
    const [sha, date] = row.split(" ");
    const after = show(sha);
    const before = show(`${sha}^`);
    for (const ns of new Set([...Object.keys(after), ...Object.keys(before)])) {
      if (dates.has(ns)) continue;
      if (JSON.stringify(content(after[ns])) !== JSON.stringify(content(before[ns]))) dates.set(ns, date);
    }
  }
  return dates;
}

const nsDates = { en: namespaceDates("en"), ru: namespaceDates("ru") };
const max = (...ds) => ds.filter(Boolean).sort().at(-1) ?? null;

const rows = [];
for (const key of pageKeys) {
  const route = ROUTES[key] ?? { en: key.slice(1), ru: key.slice(1) };
  const out = { page: key || "/" };
  for (const locale of ["en", "ru"]) {
    const files = filesFor(route[locale]);
    const ns = namespacesIn(files);
    const code = codeDate(files);
    const copy = max(...[...ns].map((n) => nsDates[locale].get(n)));
    out[locale] = max(code, copy);
    out[`${locale}Basis`] = `code ${code ?? "-"}, copy ${copy ?? "-"} [${[...ns].join(",")}]`;
  }
  rows.push(out);
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  for (const r of rows) {
    console.log(`${r.page.padEnd(52)} en ${r.en}  ru ${r.ru}`);
    console.log(`${"".padEnd(52)} en: ${r.enBasis}`);
    console.log(`${"".padEnd(52)} ru: ${r.ruBasis}`);
  }
}

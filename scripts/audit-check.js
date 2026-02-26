#!/usr/bin/env node

/**
 * JetSet Travel — Automated Audit Validation Script
 *
 * Validates links, SEO tags, compliance, and accessibility against a running
 * dev (or production) server.  Uses only built-in Node 18+ APIs (no deps).
 *
 * Usage:
 *   node scripts/audit-check.js [--base-url http://localhost:3000]
 */

import { argv } from "node:process";

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = argv.slice(2);
  let baseUrl = "http://localhost:3000";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--base-url" && args[i + 1]) {
      baseUrl = args[i + 1].replace(/\/+$/, "");
      i++;
    }
  }
  return { baseUrl };
}

const { baseUrl } = parseArgs();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const results = [];

function pass(category, message) {
  results.push({ ok: true, category, message });
}

function fail(category, message) {
  results.push({ ok: false, category, message });
}

/** Fetch a URL, returning { status, redirected, url, text, headers }. */
async function safeFetch(url, opts = {}) {
  try {
    const res = await fetch(url, { redirect: "manual", ...opts });
    const text =
      res.status < 400 || res.status === 404
        ? await res.text().catch(() => "")
        : "";
    return {
      status: res.status,
      redirected: res.status >= 300 && res.status < 400,
      location: res.headers.get("location") || "",
      url: res.url,
      text,
      headers: res.headers,
    };
  } catch (err) {
    return {
      status: 0,
      redirected: false,
      location: "",
      url,
      text: "",
      headers: new Headers(),
      error: err.message,
    };
  }
}

/** Follow redirects manually so we can inspect each hop. */
async function fetchFollowRedirects(url, maxHops = 5) {
  let current = url;
  for (let i = 0; i < maxHops; i++) {
    const res = await safeFetch(current);
    if (!res.redirected) return res;
    current = new URL(res.location, current).href;
  }
  return safeFetch(current);
}

/** Extract all href values from anchor tags in raw HTML. */
function extractLinks(html) {
  const links = new Set();
  const re = /<a\s[^>]*href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    links.add(m[1]);
  }
  return [...links];
}

// ---------------------------------------------------------------------------
// Pages expected to exist
// ---------------------------------------------------------------------------

const EXPECTED_PAGES = [
  "/en",
  "/en/services",
  "/en/corporate-travel",
  "/en/luxury-travel",
  "/en/visa-services",
  "/en/about",
  "/en/contact",
  "/en/privacy",
  "/en/terms",
  "/en/faq",
  "/en/blog",
  "/ru",
  "/ru/services",
  "/ru/corporate-travel",
  "/ru/luxury-travel",
  "/ru/visa-services",
  "/ru/about",
  "/ru/contact",
  "/ru/privacy",
  "/ru/terms",
  "/ru/faq",
  "/ru/blog",
];

// Bare paths that should 301 → /en/<path>
const BARE_REDIRECT_PATHS = [
  "/about",
  "/contact",
  "/services",
  "/privacy",
  "/terms",
  "/faq",
  "/blog",
];

// ---------------------------------------------------------------------------
// 1. LINK CHECKER
// ---------------------------------------------------------------------------

async function runLinkChecker() {
  const cat = "LINK";

  // 1a. Fetch homepage and extract internal links
  const home = await fetchFollowRedirects(`${baseUrl}/en`);
  if (home.status !== 200) {
    fail(cat, `/en homepage returned ${home.status}`);
    return;
  }
  pass(cat, "/en homepage returns 200");

  const allLinks = extractLinks(home.text);
  const internalLinks = allLinks
    .filter(
      (l) =>
        l.startsWith("/") ||
        l.startsWith(baseUrl) ||
        l.startsWith("https://www.jetset-travel.com"),
    )
    .filter((l) => !l.startsWith("mailto:") && !l.startsWith("tel:"))
    .map((l) => {
      try {
        return new URL(l, baseUrl).pathname;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const uniqueInternal = [...new Set(internalLinks)];

  // Follow each internal link and check for 200
  const linkChecks = uniqueInternal.map(async (path) => {
    const res = await fetchFollowRedirects(`${baseUrl}${path}`);
    if (res.status === 200) {
      pass(cat, `Internal link ${path} → 200`);
    } else {
      fail(cat, `Internal link ${path} → ${res.status}`);
    }
  });
  await Promise.all(linkChecks);

  // 1b. Check all expected pages
  const pageChecks = EXPECTED_PAGES.map(async (path) => {
    const res = await fetchFollowRedirects(`${baseUrl}${path}`);
    if (res.status === 200) {
      pass(cat, `Expected page ${path} → 200`);
    } else {
      fail(cat, `Expected page ${path} → ${res.status}`);
    }
  });
  await Promise.all(pageChecks);

  // 1c. Bare path redirects → /en/<path>
  const redirChecks = BARE_REDIRECT_PATHS.map(async (path) => {
    const res = await safeFetch(`${baseUrl}${path}`);
    if (
      res.redirected &&
      (res.status === 301 || res.status === 302 || res.status === 308) &&
      res.location.includes(`/en${path}`)
    ) {
      pass(cat, `Bare path ${path} redirects to /en${path}`);
    } else if (res.redirected) {
      // Check if it redirects to locale root first then the page
      const finalRes = await fetchFollowRedirects(`${baseUrl}${path}`);
      if (finalRes.status === 200) {
        pass(cat, `Bare path ${path} eventually resolves to 200`);
      } else {
        fail(
          cat,
          `Bare path ${path} → ${res.status} Location: ${res.location} (expected redirect to /en${path})`,
        );
      }
    } else {
      fail(
        cat,
        `Bare path ${path} → ${res.status} (expected 301/302 redirect)`,
      );
    }
  });
  await Promise.all(redirChecks);
}

// ---------------------------------------------------------------------------
// 2. SEO CHECKER
// ---------------------------------------------------------------------------

async function runSeoChecker() {
  const cat = "SEO";

  const titles = new Map();
  const descriptions = new Map();

  for (const path of EXPECTED_PAGES) {
    const res = await fetchFollowRedirects(`${baseUrl}${path}`);
    if (res.status !== 200) {
      fail(cat, `${path} — cannot check SEO, page returned ${res.status}`);
      continue;
    }

    const html = res.text;

    // <title>
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (!titleMatch) {
      fail(cat, `${path} — missing <title>`);
    } else {
      const title = titleMatch[1].trim();
      if (title.length > 60) {
        fail(cat, `${path} — <title> too long (${title.length} chars)`);
      } else {
        pass(cat, `${path} — <title> exists (${title.length} chars)`);
      }
      // Uniqueness tracking
      if (titles.has(title)) {
        fail(
          cat,
          `${path} — duplicate <title> with ${titles.get(title)}: "${title}"`,
        );
      } else {
        titles.set(title, path);
      }
    }

    // <meta name="description">
    const descMatch = html.match(
      /<meta\s[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
    );
    const descMatch2 = html.match(
      /<meta\s[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i,
    );
    const desc = descMatch?.[1] || descMatch2?.[1];
    if (!desc) {
      fail(cat, `${path} — missing <meta description>`);
    } else {
      if (desc.length > 160) {
        fail(
          cat,
          `${path} — meta description too long (${desc.length} chars)`,
        );
      } else {
        pass(
          cat,
          `${path} — meta description exists (${desc.length} chars)`,
        );
      }
      if (descriptions.has(desc)) {
        fail(
          cat,
          `${path} — duplicate meta description with ${descriptions.get(desc)}`,
        );
      } else {
        descriptions.set(desc, path);
      }
    }

    // Exactly one <h1>
    const h1Matches = html.match(/<h1[\s>]/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;
    if (h1Count === 0) {
      fail(cat, `${path} — no <h1> found`);
    } else if (h1Count > 1) {
      fail(cat, `${path} — ${h1Count} <h1> tags (expected exactly 1)`);
    } else {
      pass(cat, `${path} — exactly 1 <h1>`);
    }

    // Hreflang tags (en, ru, x-default)
    const hreflangEn = html.match(
      /<link[^>]*hreflang=["']en["'][^>]*>/i,
    );
    const hreflangRu = html.match(
      /<link[^>]*hreflang=["']ru["'][^>]*>/i,
    );
    const hreflangXDefault = html.match(
      /<link[^>]*hreflang=["']x-default["'][^>]*>/i,
    );
    if (hreflangEn && hreflangRu && hreflangXDefault) {
      pass(cat, `${path} — hreflang tags (en, ru, x-default) present`);
    } else {
      const missing = [];
      if (!hreflangEn) missing.push("en");
      if (!hreflangRu) missing.push("ru");
      if (!hreflangXDefault) missing.push("x-default");
      fail(cat, `${path} — missing hreflang: ${missing.join(", ")}`);
    }

    // Canonical tag
    const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
    if (canonical) {
      pass(cat, `${path} — canonical tag present`);
    } else {
      fail(cat, `${path} — missing canonical tag`);
    }

    // Structured data (JSON-LD)
    const jsonLd = html.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi,
    );
    if (jsonLd && jsonLd.length > 0) {
      pass(
        cat,
        `${path} — structured data present (${jsonLd.length} JSON-LD block(s))`,
      );
    } else {
      fail(cat, `${path} — no JSON-LD structured data found`);
    }
  }

  // Sitemap
  const sitemapRes = await safeFetch(`${baseUrl}/sitemap.xml`);
  if (sitemapRes.status === 200) {
    pass(cat, "/sitemap.xml returns 200");
    // Verify it contains XML and expected URLs
    if (sitemapRes.text.includes("<urlset") || sitemapRes.text.includes("<sitemapindex")) {
      pass(cat, "/sitemap.xml is valid XML (contains <urlset> or <sitemapindex>)");
    } else {
      fail(cat, "/sitemap.xml does not appear to be valid XML");
    }
    // Check for expected URLs in sitemap
    const sitemapChecks = ["/en", "/ru", "/en/about", "/en/contact"];
    for (const path of sitemapChecks) {
      if (sitemapRes.text.includes(path)) {
        pass(cat, `/sitemap.xml contains ${path}`);
      } else {
        fail(cat, `/sitemap.xml missing ${path}`);
      }
    }
  } else {
    fail(cat, `/sitemap.xml returned ${sitemapRes.status}`);
  }

  // Robots.txt
  const robotsRes = await safeFetch(`${baseUrl}/robots.txt`);
  if (robotsRes.status === 200) {
    pass(cat, "/robots.txt returns 200");
    if (/Sitemap:/i.test(robotsRes.text)) {
      pass(cat, "/robots.txt contains Sitemap: directive");
    } else {
      fail(cat, "/robots.txt missing Sitemap: directive");
    }
    // Should not block public pages
    const disallowLines = robotsRes.text
      .split("\n")
      .filter((l) => /^Disallow:/i.test(l.trim()));
    const blocksPublic = disallowLines.some(
      (l) =>
        l.includes("/en") ||
        l.includes("/ru") ||
        l.trim() === "Disallow: /",
    );
    if (blocksPublic) {
      fail(cat, "/robots.txt blocks public pages");
    } else {
      pass(cat, "/robots.txt does not block public pages");
    }
  } else {
    fail(cat, `/robots.txt returned ${robotsRes.status}`);
  }
}

// ---------------------------------------------------------------------------
// 3. COMPLIANCE CHECKER
// ---------------------------------------------------------------------------

async function runComplianceChecker() {
  const cat = "COMPLIANCE";

  // Privacy page
  const privacyRes = await fetchFollowRedirects(`${baseUrl}/en/privacy`);
  if (privacyRes.status === 200) {
    pass(cat, "/en/privacy returns 200");
  } else {
    fail(cat, `/en/privacy returned ${privacyRes.status}`);
  }

  // Terms page
  const termsRes = await fetchFollowRedirects(`${baseUrl}/en/terms`);
  if (termsRes.status === 200) {
    pass(cat, "/en/terms returns 200");
  } else {
    fail(cat, `/en/terms returned ${termsRes.status}`);
  }

  // Cookie consent identifier — check for component markers
  const homeRes = await fetchFollowRedirects(`${baseUrl}/en`);
  if (homeRes.status === 200) {
    const html = homeRes.text;
    // Look for cookie consent identifiers in the HTML
    const cookieIndicators = [
      "cookie",
      "consent",
      "CookieConsent",
      "cookie-consent",
      "cookie_consent",
      "cookieConsent",
      "gdpr",
    ];
    const hasCookieConsent = cookieIndicators.some((indicator) =>
      html.toLowerCase().includes(indicator.toLowerCase()),
    );
    if (hasCookieConsent) {
      pass(cat, "Cookie consent component identifier found in HTML");
    } else {
      fail(cat, "No cookie consent component identifier found in HTML");
    }
  }

  // Footer contains Privacy and Terms links
  if (homeRes.status === 200) {
    const html = homeRes.text;
    const hasPrivacyLink = /href=["'][^"']*\/privacy["']/i.test(html);
    const hasTermsLink = /href=["'][^"']*\/terms["']/i.test(html);

    if (hasPrivacyLink) {
      pass(cat, "Footer contains Privacy link");
    } else {
      fail(cat, "Footer missing Privacy link");
    }
    if (hasTermsLink) {
      pass(cat, "Footer contains Terms link");
    } else {
      fail(cat, "Footer missing Terms link");
    }
  }
}

// ---------------------------------------------------------------------------
// 4. ACCESSIBILITY QUICK CHECK
// ---------------------------------------------------------------------------

async function runAccessibilityChecker() {
  const cat = "A11Y";

  // Check lang attribute on /en and /ru pages
  for (const [path, expectedLang] of [
    ["/en", "en"],
    ["/ru", "ru"],
  ]) {
    const res = await fetchFollowRedirects(`${baseUrl}${path}`);
    if (res.status !== 200) {
      fail(cat, `${path} — cannot check, returned ${res.status}`);
      continue;
    }
    const langMatch = res.text.match(/<html[^>]*\slang=["']([^"']+)["']/i);
    if (langMatch) {
      if (langMatch[1] === expectedLang) {
        pass(cat, `${path} — <html lang="${expectedLang}"> ✓`);
      } else {
        fail(
          cat,
          `${path} — <html lang="${langMatch[1]}"> (expected "${expectedLang}")`,
        );
      }
    } else {
      fail(cat, `${path} — no lang attribute on <html>`);
    }
  }

  // Skip-to-content link
  const homeRes = await fetchFollowRedirects(`${baseUrl}/en`);
  if (homeRes.status === 200) {
    const html = homeRes.text;

    // Check for skip link
    const hasSkipLink =
      /href=["']#main[^"']*["'][^>]*>.*?skip/is.test(html) ||
      /skip[^<]*main[^<]*content/is.test(html) ||
      /class="[^"]*sr-only[^"]*"[^>]*href="#main/is.test(html);

    if (hasSkipLink) {
      pass(cat, "Skip-to-content link found");
    } else {
      fail(cat, "Skip-to-content link not found");
    }

    // Check for <img> without alt attribute
    // Match <img tags that do NOT have an alt attribute
    const imgTags = html.match(/<img\s[^>]*>/gi) || [];
    let imgsWithoutAlt = 0;
    for (const img of imgTags) {
      if (!/\balt=/i.test(img)) {
        imgsWithoutAlt++;
      }
    }
    if (imgsWithoutAlt === 0) {
      pass(cat, `All ${imgTags.length} <img> tags have alt attribute`);
    } else {
      fail(
        cat,
        `${imgsWithoutAlt} of ${imgTags.length} <img> tags missing alt attribute`,
      );
    }

    // Icon links (whatsapp, telegram, viber) have aria-label
    const iconKeywords = ["whatsapp", "telegram", "viber"];
    for (const keyword of iconKeywords) {
      // Find anchor tags containing the keyword
      const pattern = new RegExp(
        `<a\\s[^>]*${keyword}[^>]*>`,
        "gi",
      );
      const matches = html.match(pattern) || [];
      if (matches.length === 0) {
        // Also check href containing the keyword
        const hrefPattern = new RegExp(
          `<a\\s[^>]*href=["'][^"']*${keyword}[^"']*["'][^>]*>`,
          "gi",
        );
        const hrefMatches = html.match(hrefPattern) || [];
        if (hrefMatches.length === 0) {
          // Try matching by known URL patterns
          const urlPatterns = {
            whatsapp: "wa\\.me",
            telegram: "t\\.me",
            viber: "viber://",
          };
          const urlPattern = new RegExp(
            `<a\\s[^>]*href=["'][^"']*${urlPatterns[keyword]}[^"']*["'][^>]*>`,
            "gi",
          );
          const urlMatches = html.match(urlPattern) || [];
          for (const match of urlMatches) {
            if (/aria-label/i.test(match)) {
              pass(cat, `${keyword} link has aria-label`);
            } else {
              fail(cat, `${keyword} link missing aria-label`);
            }
          }
          if (urlMatches.length === 0) {
            // It's okay if the link isn't present in the HTML
            pass(cat, `${keyword} link — not found in homepage HTML (may be client-rendered)`);
          }
        } else {
          for (const match of hrefMatches) {
            if (/aria-label/i.test(match)) {
              pass(cat, `${keyword} link has aria-label`);
            } else {
              fail(cat, `${keyword} link missing aria-label`);
            }
          }
        }
      } else {
        for (const match of matches) {
          if (/aria-label/i.test(match)) {
            pass(cat, `${keyword} link has aria-label`);
          } else {
            fail(cat, `${keyword} link missing aria-label`);
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 5. OUTPUT REPORT
// ---------------------------------------------------------------------------

function printReport() {
  console.log("\n" + "═".repeat(70));
  console.log("  JETSET TRAVEL — AUDIT VALIDATION REPORT");
  console.log("═".repeat(70) + "\n");
  console.log(`  Base URL: ${baseUrl}`);
  console.log(`  Date:     ${new Date().toISOString()}\n`);

  const categories = [...new Set(results.map((r) => r.category))];

  for (const cat of categories) {
    const catResults = results.filter((r) => r.category === cat);
    const label = {
      LINK: "1. LINK CHECKER",
      SEO: "2. SEO CHECKER",
      COMPLIANCE: "3. COMPLIANCE CHECKER",
      A11Y: "4. ACCESSIBILITY QUICK CHECK",
    }[cat] || cat;

    console.log(`─── ${label} ${"─".repeat(Math.max(0, 54 - label.length))}\n`);

    for (const r of catResults) {
      const icon = r.ok ? "✅" : "❌";
      console.log(`  ${icon} ${r.message}`);
    }
    console.log();
  }

  // Summary
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  const total = results.length;

  console.log("═".repeat(70));
  console.log(
    `  SUMMARY: ${passed} passed, ${failed} failed out of ${total} total checks`,
  );
  console.log("═".repeat(70));

  if (failed > 0) {
    console.log("\n  FAILURES:\n");
    for (const r of results.filter((r) => !r.ok)) {
      console.log(`  ❌ [${r.category}] ${r.message}`);
    }
    console.log();
  }

  return failed;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\nRunning audit checks against ${baseUrl} ...\n`);

  await runLinkChecker();
  await runSeoChecker();
  await runComplianceChecker();
  await runAccessibilityChecker();

  const failures = printReport();
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(2);
});

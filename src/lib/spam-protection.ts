/**
 * Anti-spam protection — server-side validation layers.
 *
 * Layers implemented:
 *   1. Honeypot field ("website_url") — hidden input bots auto-fill
 *   2. Time-based validation — rejects submissions made in under 3 seconds
 *   3. Gibberish detection — rejects names/messages with unrealistic patterns
 *   4. Google reCAPTCHA v3 — invisible score-based bot detection (gracefully optional)
 *
 * Usage: call `runSpamChecks(body, ip)` from API routes before processing.
 * Failed submissions should be silently accepted (HTTP 200, no processing)
 * to avoid tipping off bots.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SpamCheck {
  name: string;
  passed: boolean;
  detail?: string;
}

export interface SpamCheckResult {
  isSpam: boolean;
  checks: SpamCheck[];
  recaptchaScore: number | null;
  summary: string;
}

export interface SpamFields {
  website_url?: string;
  _timestamp?: number;
  _recaptchaToken?: string;
}

/* ------------------------------------------------------------------ */
/*  1. Honeypot                                                        */
/* ------------------------------------------------------------------ */

function checkHoneypot(fields: SpamFields): SpamCheck {
  const filled = Boolean(fields.website_url);
  return {
    name: "honeypot",
    passed: !filled,
    detail: filled ? "Honeypot field was filled" : undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  2. Time-based validation                                           */
/* ------------------------------------------------------------------ */

const MIN_SUBMIT_TIME_MS = 3000;

function checkTimestamp(fields: SpamFields): SpamCheck {
  if (fields._timestamp == null) {
    // If no timestamp provided (e.g. JS disabled), pass gracefully
    return { name: "timestamp", passed: true, detail: "No timestamp provided" };
  }

  const elapsed = Date.now() - fields._timestamp;
  const tooFast = elapsed < MIN_SUBMIT_TIME_MS;

  return {
    name: "timestamp",
    passed: !tooFast,
    detail: tooFast
      ? `Submitted in ${elapsed}ms (minimum ${MIN_SUBMIT_TIME_MS}ms)`
      : undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  3. Gibberish detection                                             */
/* ------------------------------------------------------------------ */

const VOWELS = /[aeiouyаеёиоуыэюя]/i;

function hasVowels(str: string): boolean {
  return VOWELS.test(str);
}

function hasLongStringWithoutSpaces(str: string, maxLen: number = 30): boolean {
  return str.split(/\s+/).some((word) => word.length > maxLen);
}

function checkGibberish(body: Record<string, unknown>): SpamCheck {
  const reasons: string[] = [];

  // Check name fields
  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : typeof body.companyName === "string"
        ? body.companyName.trim()
        : null;

  if (name) {
    // Name should contain at least one space (first + last) — skip for company names
    if (typeof body.name === "string" && !name.includes(" ") && name.length > 1) {
      reasons.push(`Name has no spaces: "${name}"`);
    }

    // Name should have vowels
    if (!hasVowels(name)) {
      reasons.push(`Name has no vowels: "${name}"`);
    }

    // No single word longer than 30 chars
    if (hasLongStringWithoutSpaces(name)) {
      reasons.push(`Name has long unbroken string: "${name}"`);
    }
  }

  // Check company name specifically for vowels
  if (typeof body.companyName === "string" && body.companyName.trim()) {
    const company = body.companyName.trim();
    if (!hasVowels(company)) {
      reasons.push(`Company has no vowels: "${company}"`);
    }
    if (hasLongStringWithoutSpaces(company)) {
      reasons.push(`Company has long unbroken string: "${company}"`);
    }
  }

  // Check message / notes / route / specialRequirements fields
  const messageFields = ["message", "notes", "route", "specialRequirements"];
  for (const field of messageFields) {
    const val = body[field];
    if (typeof val === "string" && val.trim().length > 20) {
      const trimmed = val.trim();

      // Single long string with no spaces or punctuation
      if (!trimmed.includes(" ") && !/[.,!?;:\-()]/.test(trimmed)) {
        reasons.push(`${field} is a single long string with no spaces or punctuation`);
      }

      // Any word longer than 30 chars with no spaces
      if (hasLongStringWithoutSpaces(trimmed)) {
        reasons.push(`${field} has long unbroken string`);
      }
    }
  }

  return {
    name: "gibberish",
    passed: reasons.length === 0,
    detail: reasons.length > 0 ? reasons.join("; ") : undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  4. reCAPTCHA v3 verification                                       */
/* ------------------------------------------------------------------ */

const RECAPTCHA_THRESHOLD = 0.5;

async function checkRecaptcha(
  fields: SpamFields
): Promise<{ check: SpamCheck; score: number | null }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const token = fields._recaptchaToken;

  // Gracefully skip if not configured
  if (!secret || !token) {
    return {
      check: {
        name: "recaptcha",
        passed: true,
        detail: !secret
          ? "reCAPTCHA not configured (skipped)"
          : "No token provided (skipped)",
      },
      score: null,
    };
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });

    if (!res.ok) {
      console.error("[spam] reCAPTCHA API returned", res.status);
      // Don't block on API failure — pass gracefully
      return {
        check: { name: "recaptcha", passed: true, detail: `API error ${res.status}` },
        score: null,
      };
    }

    const data = (await res.json()) as {
      success: boolean;
      score?: number;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return {
        check: {
          name: "recaptcha",
          passed: false,
          detail: `Verification failed: ${data["error-codes"]?.join(", ") ?? "unknown"}`,
        },
        score: 0,
      };
    }

    const score = data.score ?? 0;
    const passed = score >= RECAPTCHA_THRESHOLD;

    return {
      check: {
        name: "recaptcha",
        passed,
        detail: `Score ${score} (threshold ${RECAPTCHA_THRESHOLD})`,
      },
      score,
    };
  } catch (err) {
    console.error("[spam] reCAPTCHA verification error:", err);
    // Don't block on network failure — pass gracefully
    return {
      check: { name: "recaptcha", passed: true, detail: "Network error (skipped)" },
      score: null,
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Aggregate runner                                                   */
/* ------------------------------------------------------------------ */

/**
 * Extract spam-protection fields from the raw request body,
 * returning the cleaned body (without spam fields) and the extracted fields.
 */
export function extractSpamFields(body: Record<string, unknown>): {
  cleanBody: Record<string, unknown>;
  spamFields: SpamFields;
} {
  const { website_url, _timestamp, _recaptchaToken, ...cleanBody } = body;

  return {
    cleanBody,
    spamFields: {
      website_url: typeof website_url === "string" ? website_url : undefined,
      _timestamp: typeof _timestamp === "number" ? _timestamp : undefined,
      _recaptchaToken:
        typeof _recaptchaToken === "string" ? _recaptchaToken : undefined,
    },
  };
}

/**
 * Run all spam checks on the submission. Returns an aggregate result.
 * The `body` parameter should be the full raw body (before stripping spam fields).
 */
export async function runSpamChecks(
  body: Record<string, unknown>,
  spamFields: SpamFields
): Promise<SpamCheckResult> {
  const honeypot = checkHoneypot(spamFields);
  const timestamp = checkTimestamp(spamFields);
  const gibberish = checkGibberish(body);
  const { check: recaptcha, score: recaptchaScore } =
    await checkRecaptcha(spamFields);

  const checks = [honeypot, timestamp, gibberish, recaptcha];
  const isSpam = checks.some((c) => !c.passed);

  const failed = checks.filter((c) => !c.passed).map((c) => c.name);
  const summary = isSpam
    ? `SPAM — failed: ${failed.join(", ")}`
    : "PASSED all checks";

  return { isSpam, checks, recaptchaScore, summary };
}

/**
 * Build an HTML summary of spam checks for inclusion in notification emails.
 */
export function spamChecksSummaryHtml(result: SpamCheckResult): string {
  const rows = result.checks
    .map((c) => {
      const status = c.passed ? "PASS" : "FAIL";
      const color = c.passed ? "#22c55e" : "#ef4444";
      return `<tr>
        <td style="padding:4px 8px;border:1px solid #e5e7eb;color:${color};font-weight:600">${status}</td>
        <td style="padding:4px 8px;border:1px solid #e5e7eb">${c.name}</td>
        <td style="padding:4px 8px;border:1px solid #e5e7eb;font-size:12px;color:#666">${c.detail ?? "—"}</td>
      </tr>`;
    })
    .join("");

  return `
    <div style="margin-top:16px;padding-top:12px;border-top:2px solid #e5e7eb">
      <p style="font-size:12px;color:#888;font-weight:600;margin-bottom:6px">SPAM PROTECTION CHECKS</p>
      <table style="border-collapse:collapse;width:100%;font-size:12px">
        ${rows}
      </table>
      ${result.recaptchaScore != null ? `<p style="font-size:11px;color:#888;margin-top:4px">reCAPTCHA score: ${result.recaptchaScore}</p>` : ""}
    </div>`;
}

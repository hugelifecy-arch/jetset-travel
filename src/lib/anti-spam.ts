/* ------------------------------------------------------------------ */
/*  Server-side anti-spam utilities                                    */
/* ------------------------------------------------------------------ */

/**
 * Detect gibberish / random strings in form text fields.
 * Uses multiple signals: no spaces in long text, random case mixing,
 * low vowel ratio. Requires 2+ signals to flag as gibberish.
 * Skips non-Latin text (e.g. Russian) gracefully.
 */
export function isGibberish(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length < 8) return false;

  /* Only analyse Latin alphabetic characters */
  const alphaOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  if (alphaOnly.length < 6) return false;

  /* Signal 1 — long single token with no spaces (ignore emails) */
  const hasNoSpaces =
    !trimmed.includes(" ") && !trimmed.includes("@");
  const isLong = trimmed.length > 15;

  /* Signal 2 — random case mixing (e.g. "JbpIUbHwXq") */
  let caseChanges = 0;
  for (let i = 1; i < alphaOnly.length; i++) {
    const prevUp = alphaOnly[i - 1] !== alphaOnly[i - 1].toLowerCase();
    const currUp = alphaOnly[i] !== alphaOnly[i].toLowerCase();
    if (prevUp !== currUp) caseChanges++;
  }
  const hasRandomCase = caseChanges / (alphaOnly.length - 1) > 0.35;

  /* Signal 3 — low vowel ratio */
  const vowelCount = (alphaOnly.match(/[aeiouAEIOU]/g) || []).length;
  const hasLowVowels = vowelCount / alphaOnly.length < 0.12;

  /* Flag if long-no-spaces + (random case OR low vowels),
     or both random case AND low vowels */
  if (hasNoSpaces && isLong && (hasRandomCase || hasLowVowels)) return true;
  if (hasRandomCase && hasLowVowels) return true;

  return false;
}

/** Free-text fields worth checking for gibberish */
const GIBBERISH_FIELDS = [
  "name",
  "message",
  "companyName",
  "notes",
  "specialRequirements",
  "route",
  "destinations",
] as const;

/**
 * Return the first field name that contains gibberish, or null if clean.
 */
export function findGibberishField(
  data: Record<string, unknown>,
): string | null {
  for (const field of GIBBERISH_FIELDS) {
    const val = data[field];
    if (typeof val === "string" && isGibberish(val)) {
      return field;
    }
  }
  return null;
}

/**
 * Time-based validation — reject if form was submitted faster than
 * 3 seconds after page load (bots fill forms instantly).
 */
export function isSubmittedTooFast(formLoadedAt: unknown): boolean {
  if (typeof formLoadedAt !== "number" || formLoadedAt <= 0) return false;
  return Date.now() - formLoadedAt < 3000;
}

/**
 * Verify a reCAPTCHA v3 token with Google.
 *
 * In development: returns true when credentials are missing so local
 * dev doesn't require Google credentials.
 *
 * In production: returns false (fail-closed) when credentials are
 * missing, so a misconfigured deploy rejects submissions rather than
 * silently accepting all spam. Warnings are logged at module load
 * (below) and on every request.
 */
const recaptchaConfigured = Boolean(
  process.env.RECAPTCHA_SECRET_KEY &&
    process.env.RECAPTCHA_SECRET_KEY !== "your_recaptcha_secret_key",
);

if (!recaptchaConfigured && process.env.NODE_ENV === "production") {
  console.error(
    "[anti-spam] RECAPTCHA_SECRET_KEY is not set. " +
      "reCAPTCHA verification will fail-closed in production.",
  );
}

export async function verifyRecaptcha(token: unknown): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey || secretKey === "your_recaptcha_secret_key") {
    // Fail-closed in production so silent misconfiguration can't
    // disable bot protection. In development allow the form through.
    return process.env.NODE_ENV !== "production";
  }

  if (typeof token !== "string" || !token) {
    return false; // reCAPTCHA IS configured but no token supplied
  }

  try {
    const res = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
      },
    );
    const data = (await res.json()) as { success?: boolean; score?: number };
    return data.success === true && (data.score ?? 1) >= 0.5;
  } catch (err) {
    console.error("[anti-spam] reCAPTCHA verification error:", err);
    // Fail-closed on transient network errors in production so an
    // attacker who can disrupt reCAPTCHA requests can't bypass the
    // check. In development, let the user through.
    return process.env.NODE_ENV !== "production";
  }
}

/* ------------------------------------------------------------------ */
/*  Convenience — run all anti-spam checks on a raw request body       */
/* ------------------------------------------------------------------ */

export interface AntiSpamResult {
  blocked: boolean;
  /** If blocked is true, the reason (for logging, not user-facing) */
  reason?: string;
  /** True when the honeypot was triggered — caller should return
   *  a fake-success response to avoid tipping off the bot */
  silentReject?: boolean;
}

export async function runAntiSpamChecks(
  body: Record<string, unknown>,
): Promise<AntiSpamResult> {
  /* 1. Honeypot */
  if (body.website) {
    return { blocked: true, reason: "honeypot", silentReject: true };
  }

  /* 2. Time-based */
  if (isSubmittedTooFast(body._formLoadedAt)) {
    return { blocked: true, reason: "too_fast" };
  }

  /* 3. reCAPTCHA */
  const captchaOk = await verifyRecaptcha(body._recaptchaToken);
  if (!captchaOk) {
    return { blocked: true, reason: "recaptcha_failed" };
  }

  /* 4. Gibberish */
  const gibberishField = findGibberishField(body as Record<string, unknown>);
  if (gibberishField) {
    return { blocked: true, reason: `gibberish:${gibberishField}` };
  }

  return { blocked: false };
}

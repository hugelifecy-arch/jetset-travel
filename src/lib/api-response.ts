/**
 * Shared response helpers for the lead-capture API routes.
 *
 * All three endpoints (/api/contact, /api/quote, /api/cruise-enquiry) speak
 * the same JSON envelope so clients can treat them uniformly:
 *   success → { success: true }
 *   failure → { success: false, error: string } with an HTTP status
 * In practice the form clients only read `res.ok` (the HTTP status), but a
 * consistent body keeps the contract predictable and avoids leaking
 * validation internals.
 */
import { NextResponse } from "next/server";
import { enforceRateLimit } from "./rate-limit";

export function ok() {
  return NextResponse.json({ success: true });
}

export function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

/**
 * Enforce the per-endpoint rate limit. Returns a 429 Response when the
 * request is throttled, or null when it may proceed.
 *
 * Limiter-backend failures (Upstash outage, network error) FAIL OPEN: these
 * are lead-capture endpoints, and dropping a legitimate enquiry costs more
 * than letting one window of submissions through unthrottled. The error is
 * logged so ops can see the outage; honeypot/timing/reCAPTCHA/gibberish
 * checks still run for every request.
 */
export async function rateLimitGuard(
  ip: string,
  scope: string,
): Promise<NextResponse | null> {
  try {
    await enforceRateLimit(ip, scope);
    return null;
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMIT") {
      return fail("Too many requests. Please try again later.", 429);
    }
    console.error(
      `[rate-limit] backend error — allowing request (fail-open) [${scope}]:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Remove the client-injected anti-spam meta fields (honeypot + timing +
 * reCAPTCHA token) before schema validation, so they don't trip strict
 * schemas or land in the email payload.
 */
export function stripMetaFields(
  body: Record<string, unknown>,
): Record<string, unknown> {
  const rest = { ...body };
  delete rest.website;
  delete rest._formLoadedAt;
  delete rest._recaptchaToken;
  return rest;
}

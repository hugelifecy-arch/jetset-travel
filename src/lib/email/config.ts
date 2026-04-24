/**
 * Central email-address config for transactional mail.
 *
 * `from` defaults to a sender on the verified `jetset-travel.com`
 * Resend domain. Resend's sandbox sender (`onboarding@resend.dev`)
 * cannot be used here: it is restricted to delivering to the Resend
 * account owner's own address and returns 403 when we try to notify
 * `info@jetset.com.cy`. Override RESEND_FROM_EMAIL only if you move
 * to a different verified domain.
 *
 * `to` defaults to the inbox the office actually monitors; override
 * via CONTACT_EMAIL if that ever changes.
 *
 * Nullish coalescing (`??`) is NOT enough here: a Vercel env var that
 * is declared but left blank arrives as an empty string, which skips
 * the `??` fallback and leaks `from: ""` / `to: ""` into the Resend
 * payload. Resend then rejects the send with a 422 and the office
 * never receives the lead. Treat empty/whitespace-only values as
 * unset so the defaults actually kick in.
 */
export function envOrDefault(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const FROM_EMAIL = envOrDefault(
  process.env.RESEND_FROM_EMAIL,
  "JetSet Travel <noreply@jetset-travel.com>",
);

export const TO_EMAIL = envOrDefault(
  process.env.CONTACT_EMAIL,
  "info@jetset.com.cy",
);

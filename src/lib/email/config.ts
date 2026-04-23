/**
 * Central email-address config for transactional mail.
 *
 * `from` defaults to Resend's always-available sandbox sender
 * (`onboarding@resend.dev`) so the form works the moment a
 * RESEND_API_KEY is set — even before the operator has verified
 * a custom domain in the Resend dashboard. Set RESEND_FROM_EMAIL
 * to a verified sender (e.g. "JetSet Travel <noreply@jetset-travel.com>")
 * for production deliverability.
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
  "JetSet Travel <onboarding@resend.dev>",
);

export const TO_EMAIL = envOrDefault(
  process.env.CONTACT_EMAIL,
  "info@jetset.com.cy",
);

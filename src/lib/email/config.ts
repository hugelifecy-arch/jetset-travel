/**
 * Central email-address config for transactional mail.
 *
 * `from` defaults to `quotes@jetset-travel.com` — the local-part
 * matches what these emails actually are (quote-request notifications),
 * and it pairs naturally with `reply_to: info@jetset.com.cy` so replies
 * land in the office inbox. The `jetset-travel.com` domain is verified
 * in Resend with SPF + DKIM, so sends from this address deliver
 * directly without falling through the sandbox-sender safety net in
 * `resend.ts`.
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
  "JetSet Travel <quotes@jetset-travel.com>",
);

export const TO_EMAIL = envOrDefault(
  process.env.CONTACT_EMAIL,
  "info@jetset.com.cy",
);

/**
 * Central email-address config for transactional mail.
 *
 * `from` defaults to a sender on the verified `jetset-travel.com`
 * Resend domain. Resend's sandbox sender (`onboarding@resend.dev`)
 * cannot be used here: it is restricted to delivering to the Resend
 * account owner's own address and returns 403 when we try to notify
 * `info@jetset.com.cy`. If RESEND_FROM_EMAIL points at the sandbox
 * sender we ignore it and fall back to the verified-domain default,
 * logging a warning so the operator fixes their env config.
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

const DEFAULT_FROM_EMAIL = "JetSet Travel <noreply@jetset-travel.com>";

function resolveFromEmail(): string {
  const configured = envOrDefault(process.env.RESEND_FROM_EMAIL, DEFAULT_FROM_EMAIL);
  if (configured.toLowerCase().includes("onboarding@resend.dev")) {
    console.warn(
      "[email/config] RESEND_FROM_EMAIL is set to Resend's sandbox sender " +
        "(onboarding@resend.dev), which can only deliver to the Resend " +
        "account owner. Ignoring it and falling back to " +
        `${DEFAULT_FROM_EMAIL}. Verify jetset-travel.com at ` +
        "resend.com/domains and update the env var.",
    );
    return DEFAULT_FROM_EMAIL;
  }
  return configured;
}

export const FROM_EMAIL = resolveFromEmail();

export const TO_EMAIL = envOrDefault(
  process.env.CONTACT_EMAIL,
  "info@jetset.com.cy",
);

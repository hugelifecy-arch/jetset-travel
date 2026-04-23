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
 */
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "JetSet Travel <onboarding@resend.dev>";

export const TO_EMAIL = process.env.CONTACT_EMAIL ?? "info@jetset.com.cy";

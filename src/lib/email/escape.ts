/**
 * Escape untrusted user-supplied strings before interpolating them into
 * HTML email templates. Without this, attackers can inject arbitrary
 * HTML (links, styles, scripts-in-email-clients-that-render-them) into
 * notification and auto-reply emails sent to staff and to the user's
 * claimed email address — a phishing vector since messages appear to
 * come from a JetSet-owned sender.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Shared HTML builders for the transactional emails sent by the lead-capture
 * routes (/api/contact, /api/quote, /api/cruise-enquiry). Centralising these
 * keeps the staff-notification table and visitor auto-reply visually
 * consistent across every form and removes the markup triplication that
 * previously lived in each route handler.
 *
 * Values passed to `emailRow` are HTML-escaped. The `intro` passed to
 * `autoReplyEmail` is raw HTML and must NOT contain untrusted input.
 */
import { escapeHtml } from "./escape";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "35799478073";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jetset-travel.com";

const TH = 'style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb"';
const TD = 'style="padding:8px 12px;border:1px solid #e5e7eb"';

/** A single label/value table row; the value is HTML-escaped. */
export function emailRow(label: string, value: string): string {
  return `<tr><td ${TH}>${label}</td><td ${TD}>${escapeHtml(value)}</td></tr>`;
}

/** Staff-notification email wrapping a pre-joined string of `emailRow`s. */
export function notificationEmail(heading: string, rowsHtml: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0b1d3a">${heading}</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rowsHtml}
      </table>
    </div>`;
}

/**
 * Visitor auto-reply email. `intro` is the route-specific confirmation
 * sentence(s) as raw HTML; the greeting, WhatsApp CTA and footer are shared.
 */
export function autoReplyEmail(name: string, intro: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <h2 style="color:#0b1d3a">Thank you, ${escapeHtml(name)}!</h2>
      ${intro}
      <p>For urgent enquiries you can reach us directly on WhatsApp:</p>
      <p><a href="https://wa.me/${WHATSAPP_NUMBER}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">Chat on WhatsApp</a></p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="font-size:12px;color:#888">JetSet Travel Cyprus &mdash; <a href="${SITE_URL}">${SITE_URL}</a></p>
    </div>`;
}

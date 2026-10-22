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
import { attributionRows } from "@/lib/attribution-fields";

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

/**
 * Staff-notification email wrapping a pre-joined string of `emailRow`s.
 * `attribution` is the untrusted `_attribution` object from the request body;
 * when it holds anything usable, a "How they found us" block is appended
 * (page, first page of the visit, referrer, campaign tags). Staff email only.
 */
export function notificationEmail(heading: string, rowsHtml: string, attribution?: unknown): string {
  const sourceRows = attributionRows(attribution);
  const sourceHtml = sourceRows.length
    ? `<tr><td colspan="2" style="padding:12px 12px 6px;font-weight:700;color:#0b1d3a;border:1px solid #e5e7eb;background:#f8fafc">How they found us</td></tr>` +
      sourceRows.map(([label, value]) => emailRow(label, value)).join("")
    : "";
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0b1d3a">${heading}</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rowsHtml}${sourceHtml}
      </table>
    </div>`;
}

export type EmailLocale = "en" | "ru";

/** Normalise an untrusted `locale` value from a request body. */
export function emailLocale(value: unknown): EmailLocale {
  return value === "ru" ? "ru" : "en";
}

/**
 * Visitor auto-reply email. `intro` is the route-specific confirmation
 * sentence(s) as raw HTML; the greeting, WhatsApp CTA and footer are shared.
 */
export function autoReplyEmail(name: string, intro: string, locale: EmailLocale = "en"): string {
  const ru = locale === "ru";
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <h2 style="color:#0b1d3a">${ru ? "Спасибо" : "Thank you"}, ${escapeHtml(name)}!</h2>
      ${intro}
      <p>${ru ? "По срочным вопросам пишите нам в WhatsApp:" : "For urgent enquiries you can reach us directly on WhatsApp:"}</p>
      <p><a href="https://wa.me/${WHATSAPP_NUMBER}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">${ru ? "Написать в WhatsApp" : "Chat on WhatsApp"}</a></p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="font-size:12px;color:#888">JetSet Travel Cyprus &mdash; <a href="${SITE_URL}/${locale}">${SITE_URL}/${locale}</a></p>
    </div>`;
}

export type AutoReplyKind = "contact" | "quote" | "cruise" | "private";

/**
 * Subject + intro per form and language. English strings are unchanged from
 * the pre-audit routes. Russian strings need a native-speaker review before
 * release (project rule for RU copy). Response-time promises mirror the
 * existing English text and must be confirmed by the office (audit F-12).
 */
const AUTO_REPLY_COPY: Record<AutoReplyKind, Record<EmailLocale, { subject: string; intro: string }>> = {
  contact: {
    en: {
      subject: "JetSet Travel — Your message is received",
      intro: "<p>We've received your message and will get back to you within <strong>1 hour</strong> during business hours.</p>",
    },
    ru: {
      subject: "JetSet Travel — мы получили ваше сообщение",
      intro: "<p>Мы получили ваше сообщение и ответим в течение <strong>1 часа</strong> в рабочее время.</p>",
    },
  },
  quote: {
    en: {
      subject: "JetSet Travel — Your quote request is received",
      intro: "<p>We've received your quote request and will get back to you within <strong>1 hour</strong> during business hours.</p>",
    },
    ru: {
      subject: "JetSet Travel — мы получили ваш запрос",
      intro: "<p>Мы получили ваш запрос и ответим в течение <strong>1 часа</strong> в рабочее время.</p>",
    },
  },
  cruise: {
    en: {
      subject: "JetSet Travel — Your cruise enquiry is received",
      intro: "<p>We've received your cruise enquiry and our cruise specialist will review your preferences and get back to you within <strong>24 hours</strong> with personalized options.</p>",
    },
    ru: {
      subject: "JetSet Travel — мы получили ваш запрос на круиз",
      intro: "<p>Мы получили ваш запрос на круиз. Наш специалист изучит ваши пожелания и в течение <strong>24 часов</strong> пришлёт персональные варианты.</p>",
    },
  },
  private: {
    en: {
      subject: "JetSet Travel — Your introduction request is received",
      intro: "<p>Thank you for your introduction request. You will hear from us personally, usually within the day.</p>",
    },
    ru: {
      subject: "JetSet Travel — мы получили ваш запрос",
      intro: "<p>Благодарим за запрос. Мы свяжемся с вами лично — как правило, в течение дня.</p>",
    },
  },
};

/** Localised visitor acknowledgement for one form. */
export function visitorAutoReply(kind: AutoReplyKind, locale: EmailLocale, name: string) {
  const copy = AUTO_REPLY_COPY[kind][locale];
  return { subject: copy.subject, html: autoReplyEmail(name, copy.intro, locale) };
}

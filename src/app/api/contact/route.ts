/**
 * POST /api/contact — Contact form handler.
 *
 * Anti-spam protection layers:
 *   1. Rate limiting — 3 requests per IP per hour (in-memory)
 *   2. Honeypot field — hidden "website" and "website_url" inputs
 *   3. Time-based validation — rejects submissions under 3 seconds
 *   4. Gibberish detection — validates name/message patterns
 *   5. Google reCAPTCHA v3 — invisible score-based verification
 *
 * Spam submissions are silently accepted (HTTP 200) but not processed,
 * to avoid tipping off bots. Rejection reasons are logged server-side.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { sendResendEmail } from "@/lib/email/resend";
import {
  extractSpamFields,
  runSpamChecks,
  spamChecksSummaryHtml,
} from "@/lib/spam-protection";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  message: z.string().optional(),
  travelType: z.string().optional(),
  contactMethod: z.string().optional(),
  dates: z.string().optional(),
  website: z.string().optional(), // legacy honeypot — must remain empty
});

/* ------------------------------------------------------------------ */
/*  Rate limiting (in-memory, 3 requests per IP per hour)              */
/* ------------------------------------------------------------------ */

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitMap.get(ip) || []).filter(
    (t) => t > windowStart
  );

  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, timestamps);
    return false;
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "35799478073";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jetset-travel.com";

function notificationHtml(
  data: z.infer<typeof contactSchema>,
  spamSummaryHtml: string
): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0b1d3a">${data.travelType ? "New Quote Request" : "New Contact Message"}</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Name</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Email</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.email}</td></tr>
        ${data.phone ? `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Phone</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.phone}</td></tr>` : ""}
        ${data.companyName ? `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Company</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.companyName}</td></tr>` : ""}
        ${data.travelType ? `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Travel Type</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.travelType}</td></tr>` : ""}
        ${data.contactMethod ? `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Preferred Contact</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.contactMethod}</td></tr>` : ""}
        ${data.dates ? `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Dates</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.dates}</td></tr>` : ""}
        ${data.message ? `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Message</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.message}</td></tr>` : ""}
      </table>
      ${spamSummaryHtml}
    </div>`;
}

function autoReplyHtml(name: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <h2 style="color:#0b1d3a">Thank you, ${name}!</h2>
      <p>We've received your message and will get back to you within <strong>1 hour</strong> during business hours.</p>
      <p>For urgent enquiries you can reach us directly on WhatsApp:</p>
      <p><a href="https://wa.me/${WHATSAPP_NUMBER}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">Chat on WhatsApp</a></p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="font-size:12px;color:#888">JetSet Travel Cyprus &mdash; <a href="${SITE_URL}">${SITE_URL}</a></p>
    </div>`;
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  /* Rate limiting */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    console.log(`[contact] RATE LIMITED — IP: ${ip}`);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let rawBody: Record<string, unknown>;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  /* Extract spam-protection fields before Zod validation */
  const { cleanBody, spamFields } = extractSpamFields(rawBody);

  const result = contactSchema.safeParse(cleanBody);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const data = result.data;

  /* Legacy honeypot — silently accept to avoid tipping off bots */
  if (data.website) {
    console.log(`[contact] SPAM REJECTED — legacy honeypot filled (IP: ${ip})`);
    return NextResponse.json({ success: true });
  }

  /* Run all spam checks (honeypot, timestamp, gibberish, reCAPTCHA) */
  const spamResult = await runSpamChecks(cleanBody as Record<string, unknown>, spamFields);

  if (spamResult.isSpam) {
    console.log(`[contact] SPAM REJECTED — ${spamResult.summary} (IP: ${ip})`);
    /* Silently accept to avoid tipping off bots */
    return NextResponse.json({ success: true });
  }

  console.log(`[contact] ${spamResult.summary} — from: ${data.name} <${data.email}> (IP: ${ip})`);

  const apiKey = process.env.RESEND_API_KEY;
  const spamSummary = spamChecksSummaryHtml(spamResult);

  if (!apiKey || apiKey === "re_your_key_here") {
    console.log("[contact] Resend not configured – logging submission");
    console.log("[contact] From:", data.name, data.email);
    if (data.travelType) console.log("[contact] Travel Type:", data.travelType);
    if (data.dates) console.log("[contact] Dates:", data.dates);
    if (data.message) console.log("[contact] Message:", data.message);
    return NextResponse.json({ success: true });
  }

  try {
    await sendResendEmail(apiKey, {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: "info@jetset.com.cy",
      reply_to: data.email,
      subject: data.travelType
        ? `New Quote Request — ${data.name} (${data.travelType})`
        : `New Contact Message — ${data.name}`,
      html: notificationHtml(data, spamSummary),
    });

    await sendResendEmail(apiKey, {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: data.email,
      subject: "JetSet Travel — Your message is received",
      html: autoReplyHtml(data.name),
    });
  } catch (err) {
    console.error("[contact] Email send error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

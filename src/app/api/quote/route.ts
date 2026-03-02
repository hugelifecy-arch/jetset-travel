/**
 * POST /api/quote — Quote request form handler.
 *
 * Anti-spam protection layers:
 *   1. Rate limiting — Upstash Redis (existing) + in-memory fallback (3/IP/hour)
 *   2. Honeypot field — hidden "website_url" input
 *   3. Time-based validation — rejects submissions under 3 seconds
 *   4. Gibberish detection — validates name/company/message patterns
 *   5. Google reCAPTCHA v3 — invisible score-based verification
 *
 * Spam submissions are silently accepted (HTTP 200) but not processed,
 * to avoid tipping off bots. Rejection reasons are logged server-side.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sendResendEmail } from "@/lib/email/resend";
import {
  extractSpamFields,
  runSpamChecks,
  spamChecksSummaryHtml,
} from "@/lib/spam-protection";

/* ------------------------------------------------------------------ */
/*  Schemas — one per form that POSTs to /api/quote                    */
/* ------------------------------------------------------------------ */

const CorporateSchema = z.object({
  type: z.literal("corporate"),
  companyName: z.string().min(2).max(120),
  email: z.string().email().max(120),
  phone: z.string().min(5).max(30),
  travellers: z.string().min(1).max(50),
  travelDates: z.string().min(1).max(200),
  destinations: z.string().min(2).max(200),
  invoiceRequired: z.boolean(),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

const LuxurySchema = z.object({
  type: z.literal("luxury"),
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().min(5).max(30),
  destinations: z.string().min(2).max(200),
  dates: z.string().min(1).max(80),
  groupSize: z.string().min(1).max(50),
  budget: z.string().min(1).max(50),
  specialRequirements: z.string().max(2000).optional().or(z.literal("")),
});

const LeadSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(5).max(30),
  route: z.string().min(3).max(200),
});

const QuoteSchema = z.union([CorporateSchema, LuxurySchema, LeadSchema]);

type QuoteData = z.infer<typeof QuoteSchema>;

/* ------------------------------------------------------------------ */
/*  In-memory rate limiting fallback (3 requests per IP per hour)      */
/* ------------------------------------------------------------------ */

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function checkInMemoryRateLimit(ip: string): boolean {
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

const TD = 'style="padding:8px 12px;border:1px solid #e5e7eb"';
const TH = 'style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb"';

function row(label: string, value: string): string {
  return `<tr><td ${TH}>${label}</td><td ${TD}>${value}</td></tr>`;
}

function notificationHtml(data: QuoteData, spamSummaryHtml: string): string {
  let heading: string;
  let rows: string;

  if ("type" in data && data.type === "corporate") {
    heading = "New Corporate Quote Request";
    rows =
      row("Company", data.companyName) +
      row("Email", data.email) +
      row("Phone", data.phone) +
      row("Travellers", data.travellers) +
      row("Travel Dates", data.travelDates) +
      row("Destinations", data.destinations) +
      row("VAT Invoice Required", data.invoiceRequired ? "Yes" : "No") +
      (data.notes ? row("Notes", data.notes) : "");
  } else if ("type" in data && data.type === "luxury") {
    heading = "New Luxury Quote Request";
    rows =
      row("Name", data.name) +
      row("Email", data.email) +
      row("Phone", data.phone) +
      row("Destinations", data.destinations) +
      row("Dates", data.dates) +
      row("Group Size", data.groupSize) +
      row("Budget", data.budget) +
      (data.specialRequirements ? row("Special Requirements", data.specialRequirements) : "");
  } else {
    heading = "New Quick Quote Request";
    rows =
      row("Name", data.name) +
      row("Phone", data.phone) +
      row("Route / Details", data.route);
  }

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0b1d3a">${heading}</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows}
      </table>
      ${spamSummaryHtml}
    </div>`;
}

function autoReplyHtml(name: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <h2 style="color:#0b1d3a">Thank you, ${name}!</h2>
      <p>We've received your quote request and will get back to you within <strong>1 hour</strong> during business hours.</p>
      <p>For urgent enquiries you can reach us directly on WhatsApp:</p>
      <p><a href="https://wa.me/${WHATSAPP_NUMBER}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">Chat on WhatsApp</a></p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="font-size:12px;color:#888">JetSet Travel Cyprus &mdash; <a href="${SITE_URL}">${SITE_URL}</a></p>
    </div>`;
}

function getContactName(data: QuoteData): string {
  if ("type" in data && data.type === "corporate") return data.companyName;
  return data.name;
}

function getEmail(data: QuoteData): string | undefined {
  if ("email" in data && data.email) return data.email;
  return undefined;
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  const rawBody = await req.json().catch(() => null);
  if (!rawBody) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

  /* Rate limiting — Upstash Redis (primary) + in-memory fallback */
  try {
    await enforceRateLimit(ip);
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMIT") {
      console.log(`[quote] RATE LIMITED (Upstash) — IP: ${ip}`);
      return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
    }
    throw error;
  }

  if (!checkInMemoryRateLimit(ip)) {
    console.log(`[quote] RATE LIMITED (in-memory) — IP: ${ip}`);
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  /* Extract spam-protection fields before Zod validation */
  const { cleanBody, spamFields } = extractSpamFields(rawBody as Record<string, unknown>);

  const parsed = QuoteSchema.safeParse(cleanBody);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;

  /* Run all spam checks (honeypot, timestamp, gibberish, reCAPTCHA) */
  const spamResult = await runSpamChecks(cleanBody as Record<string, unknown>, spamFields);
  const contactName = getContactName(data);
  const email = getEmail(data);

  if (spamResult.isSpam) {
    console.log(`[quote] SPAM REJECTED — ${spamResult.summary} (IP: ${ip}, name: ${contactName})`);
    /* Silently accept to avoid tipping off bots */
    return NextResponse.json({ ok: true });
  }

  const quoteType =
    "type" in data ? (data.type === "corporate" ? "Corporate" : "Luxury") : "Quick";

  console.log(`[quote] ${spamResult.summary} — ${quoteType} from: ${contactName} (IP: ${ip})`);

  const apiKey = process.env.RESEND_API_KEY;
  const spamSummary = spamChecksSummaryHtml(spamResult);

  if (!apiKey || apiKey === "re_your_key_here") {
    console.log("[quote] Resend not configured – logging submission");
    console.log("[quote] Type:", quoteType);
    console.log("[quote] From:", contactName, email || "(no email)");
    console.log("[quote] Data:", JSON.stringify(data));
    return NextResponse.json({ ok: true });
  }

  try {
    await sendResendEmail(apiKey, {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: "info@jetset.com.cy",
      reply_to: email,
      subject: `New ${quoteType} Quote Request — ${contactName}`,
      html: notificationHtml(data, spamSummary),
    });

    if (email) {
      await sendResendEmail(apiKey, {
        from: "JetSet Travel <noreply@jetset-travel.com>",
        to: email,
        subject: "JetSet Travel — Your quote request is received",
        html: autoReplyHtml(contactName),
      });
    }
  } catch (err) {
    console.error("[quote] Email send error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

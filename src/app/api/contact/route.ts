import { NextResponse } from "next/server";
import { z } from "zod";
import { sendResendEmail } from "@/lib/email/resend";
import { runAntiSpamChecks } from "@/lib/anti-spam";

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
});

/* ------------------------------------------------------------------ */
/*  Rate limiting (in-memory, 5 requests per IP per hour)              */
/* ------------------------------------------------------------------ */

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

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

function notificationHtml(data: z.infer<typeof contactSchema>): string {
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
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  /* ---- Anti-spam checks (honeypot, timestamp, reCAPTCHA, gibberish) ---- */
  const spam = await runAntiSpamChecks(body);
  if (spam.blocked) {
    if (spam.silentReject) {
      /* Honeypot — return fake success so bots don't adapt */
      return NextResponse.json({ success: true });
    }
    console.log(`[contact] Spam blocked: ${spam.reason}`, ip);
    return NextResponse.json(
      { error: "Submission rejected." },
      { status: 400 },
    );
  }

  /* Strip anti-spam meta-fields before Zod validation */
  const { website: _hp, _formLoadedAt: _ts, _recaptchaToken: _rc, ...formFields } = body;

  const result = contactSchema.safeParse(formFields);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const data = result.data;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_key_here") {
    console.log("[contact] Resend not configured – logging submission");
    console.log("[contact] From:", data.name, data.email);
    if (data.travelType) console.log("[contact] Travel Type:", data.travelType);
    if (data.dates) console.log("[contact] Dates:", data.dates);
    if (data.message) console.log("[contact] Message:", data.message);
    // TODO: Connect to email service (Resend, SendGrid, or Nodemailer) to send to info@jetset.com.cy
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
      html: notificationHtml(data),
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

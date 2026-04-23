import { NextResponse } from "next/server";
import { z } from "zod";
import { sendResendEmail } from "@/lib/email/resend";
import { FROM_EMAIL, TO_EMAIL } from "@/lib/email/config";
import { escapeHtml } from "@/lib/email/escape";
import { runAntiSpamChecks } from "@/lib/anti-spam";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";

export const runtime = "nodejs";

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
  travelers: z.string().optional(),
  urgency: z.string().optional(),
  budget: z.string().optional(),
  contactMethod: z.string().optional(),
  dates: z.string().optional(),
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "35799478073";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jetset-travel.com";

function notificationHtml(data: z.infer<typeof contactSchema>): string {
  const TH = 'style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb"';
  const TD = 'style="padding:8px 12px;border:1px solid #e5e7eb"';
  const row = (label: string, value: string) =>
    `<tr><td ${TH}>${label}</td><td ${TD}>${escapeHtml(value)}</td></tr>`;

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0b1d3a">${data.travelType ? "New Quote Request" : "New Contact Message"}</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${row("Name", data.name)}
        ${row("Email", data.email)}
        ${data.phone ? row("Phone", data.phone) : ""}
        ${data.companyName ? row("Company", data.companyName) : ""}
        ${data.travelType ? row("Travel Type", data.travelType) : ""}
        ${data.travelers ? row("Travelers", data.travelers) : ""}
        ${data.urgency ? row("Urgency", data.urgency) : ""}
        ${data.budget ? row("Budget Band", data.budget) : ""}
        ${data.contactMethod ? row("Preferred Contact", data.contactMethod) : ""}
        ${data.dates ? row("Dates", data.dates) : ""}
        ${data.message ? row("Message", data.message) : ""}
      </table>
    </div>`;
}

function autoReplyHtml(name: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <h2 style="color:#0b1d3a">Thank you, ${escapeHtml(name)}!</h2>
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
  const ip = getClientIp(request);

  try {
    await enforceRateLimit(ip, "contact");
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMIT") {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    if (error instanceof Error && error.message === "SECURITY_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 503 }
      );
    }
    throw error;
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
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: data.email,
      subject: data.travelType
        ? `New Quote Request — ${data.name} (${data.travelType})`
        : `New Contact Message — ${data.name}`,
      html: notificationHtml(data),
    });
  } catch (err) {
    console.error("[contact] Notification email failed:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 },
    );
  }

  /* Auto-reply is a nice-to-have; don't fail the submission if it
     can't go out (e.g. visitor's mailbox rejects our sender). The
     lead is already safely in the office inbox. */
  try {
    await sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: data.email,
      subject: "JetSet Travel — Your message is received",
      html: autoReplyHtml(data.name),
    });
  } catch (err) {
    console.error("[contact] Auto-reply email failed (non-fatal):", err);
  }

  return NextResponse.json({ success: true });
}

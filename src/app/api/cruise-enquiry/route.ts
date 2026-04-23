import { NextResponse } from "next/server";
import { z } from "zod";
import { sendResendEmail } from "@/lib/email/resend";
import { escapeHtml } from "@/lib/email/escape";
import { runAntiSpamChecks } from "@/lib/anti-spam";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const cruiseEnquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  destination: z.string().optional(),
  cruiseLine: z.string().optional(),
  dates: z.string().optional(),
  duration: z.string().optional(),
  adults: z.string().optional(),
  children: z.string().optional(),
  cabin: z.string().optional(),
  budget: z.string().optional(),
  occasion: z.string().optional(),
  requirements: z.string().optional(),
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "35799478073";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jetset-travel.com";

function notificationHtml(data: z.infer<typeof cruiseEnquirySchema>): string {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    data.phone ? ["Phone", data.phone] : null,
    data.country ? ["Country", data.country] : null,
    data.destination ? ["Destination", data.destination] : null,
    data.cruiseLine ? ["Cruise Line", data.cruiseLine] : null,
    data.dates ? ["Travel Dates", data.dates] : null,
    data.duration ? ["Duration", data.duration] : null,
    data.adults ? ["Adults", data.adults] : null,
    data.children ? ["Children", data.children] : null,
    data.cabin ? ["Cabin Preference", data.cabin] : null,
    data.budget ? ["Budget", data.budget] : null,
    data.occasion ? ["Special Occasion", data.occasion] : null,
    data.requirements ? ["Requirements", data.requirements] : null,
  ].filter(Boolean) as [string, string][];

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0b1d3a">New Cruise Enquiry</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">${label}</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
    </div>`;
}

function autoReplyHtml(name: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <h2 style="color:#0b1d3a">Thank you, ${escapeHtml(name)}!</h2>
      <p>We've received your cruise enquiry and our cruise specialist will review your preferences and get back to you within <strong>24 hours</strong> with personalized options.</p>
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
    await enforceRateLimit(ip, "cruise-enquiry");
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

  /* Anti-spam checks */
  const spam = await runAntiSpamChecks(body);
  if (spam.blocked) {
    if (spam.silentReject) {
      return NextResponse.json({ success: true });
    }
    console.log(`[cruise-enquiry] Spam blocked: ${spam.reason}`, ip);
    return NextResponse.json(
      { error: "Submission rejected." },
      { status: 400 }
    );
  }

  /* Strip anti-spam meta-fields before Zod validation */
  const { website: _hp, _formLoadedAt: _ts, _recaptchaToken: _rc, ...formFields } = body;

  const result = cruiseEnquirySchema.safeParse(formFields);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const data = result.data;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_key_here") {
    console.log("[cruise-enquiry] Resend not configured – logging submission");
    console.log("[cruise-enquiry] From:", data.name, data.email);
    if (data.destination) console.log("[cruise-enquiry] Destination:", data.destination);
    if (data.cruiseLine) console.log("[cruise-enquiry] Cruise Line:", data.cruiseLine);
    if (data.dates) console.log("[cruise-enquiry] Dates:", data.dates);
    return NextResponse.json({ success: true });
  }

  try {
    await sendResendEmail(apiKey, {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: "info@jetset.com.cy",
      reply_to: data.email,
      subject: `New Cruise Enquiry — ${data.name}${data.destination ? ` (${data.destination})` : ""}`,
      html: notificationHtml(data),
    });

    await sendResendEmail(apiKey, {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: data.email,
      subject: "JetSet Travel — Your cruise enquiry is received",
      html: autoReplyHtml(data.name),
    });
  } catch (err) {
    console.error("[cruise-enquiry] Email send error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sendResendEmail } from "@/lib/email/resend";

const QuoteSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(5).max(30),
  email: z.string().email().max(120).optional().or(z.literal("")),
  travelType: z.enum(["Corporate", "Luxury / Leisure", "Group / Event"]),
  route: z.string().min(3).max(200),
  dates: z.string().min(2).max(80),
  message: z.string().max(2000).optional().or(z.literal("")),
  // Honeypot field must be empty
  company: z.string().max(0).optional().or(z.literal("")),
});

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "35799478073";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jetset-travel.com";

function notificationHtml(data: z.infer<typeof QuoteSchema>): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0b1d3a">New Quote Request</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Name</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Phone</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.phone}</td></tr>
        ${data.email ? `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Email</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.email}</td></tr>` : ""}
        <tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Travel Type</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.travelType}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Route</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.route}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Dates</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.dates}</td></tr>
        ${data.message ? `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Message</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.message}</td></tr>` : ""}
      </table>
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

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = QuoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;

  /* Honeypot — silently accept to avoid tipping off bots */
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

  try {
    await enforceRateLimit(ip);
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMIT") {
      return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
    }

    throw error;
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_key_here") {
    console.log("[quote] Resend not configured – logging submission");
    console.log("[quote] From:", data.name, data.phone, data.email || "(no email)");
    console.log("[quote] Travel Type:", data.travelType);
    console.log("[quote] Route:", data.route);
    console.log("[quote] Dates:", data.dates);
    if (data.message) console.log("[quote] Message:", data.message);
    return NextResponse.json({ ok: true });
  }

  try {
    await sendResendEmail(apiKey, {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: "info@jetset.com.cy",
      reply_to: data.email || undefined,
      subject: `New Quote Request — ${data.name} (${data.travelType})`,
      html: notificationHtml(data),
    });

    if (data.email) {
      await sendResendEmail(apiKey, {
        from: "JetSet Travel <noreply@jetset-travel.com>",
        to: data.email,
        subject: "JetSet Travel — Your quote request is received",
        html: autoReplyHtml(data.name),
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

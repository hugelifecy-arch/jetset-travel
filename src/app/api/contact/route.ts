import { NextResponse } from "next/server";
import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "35799000000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jetset-travel.com";

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }
}

function notificationHtml(data: z.infer<typeof contactSchema>): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0b1d3a">New Contact Message</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Name</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Email</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.email}</td></tr>
        ${data.phone ? `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Phone</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.phone}</td></tr>` : ""}
        <tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">Message</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${data.message}</td></tr>
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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const result = contactSchema.safeParse(body);

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
    console.log("[contact] Message:", data.message);
    return NextResponse.json({ success: true });
  }

  try {
    await sendEmail(apiKey, {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: "info@jetset-travel.com",
      reply_to: data.email,
      subject: `New Contact Message — ${data.name}`,
      html: notificationHtml(data),
    });

    await sendEmail(apiKey, {
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

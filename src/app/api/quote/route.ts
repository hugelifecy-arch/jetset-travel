import { NextResponse } from "next/server";
import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Schemas                                                            */
/* ------------------------------------------------------------------ */

const baseFields = {
  email: z.string().email(),
  phone: z.string().min(5),
  destinations: z.string().min(2),
  notes: z.string().optional(),
};

const corporateSchema = z.object({
  type: z.literal("corporate"),
  companyName: z.string().min(2),
  ...baseFields,
  travellers: z.string().min(1),
  travelDates: z.string().min(1),
  invoiceRequired: z.boolean().optional(),
});

const luxurySchema = z.object({
  type: z.literal("luxury"),
  name: z.string().min(2),
  ...baseFields,
  dates: z.string().min(1),
  groupSize: z.string().min(1),
  budget: z.string().min(1),
  specialRequirements: z.string().optional(),
});

const quoteSchema = z.discriminatedUnion("type", [
  corporateSchema,
  luxurySchema,
]);

type QuoteData = z.infer<typeof quoteSchema>;

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

function displayName(data: QuoteData): string {
  return data.type === "corporate" ? data.companyName : data.name;
}

/** Build an HTML table of all submitted fields */
function buildFieldsTable(data: QuoteData): string {
  const labels: Record<string, string> = {
    type: "Quote Type",
    companyName: "Company Name",
    name: "Name",
    email: "Email",
    phone: "Phone",
    destinations: "Destinations",
    travellers: "Travellers",
    travelDates: "Travel Dates",
    invoiceRequired: "Invoice Required",
    dates: "Travel Dates",
    groupSize: "Group Size",
    budget: "Budget",
    specialRequirements: "Special Requirements",
    notes: "Notes",
  };

  const rows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb">${labels[k] ?? k}</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${String(v)}</td></tr>`
    )
    .join("");

  return `<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">${rows}</table>`;
}

function notificationHtml(data: QuoteData): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0b1d3a">New ${data.type === "corporate" ? "Corporate" : "Luxury"} Quote Request</h2>
      <p>From: <strong>${displayName(data)}</strong> (${data.email})</p>
      ${buildFieldsTable(data)}
    </div>`;
}

function autoReplyHtml(data: QuoteData): string {
  const name = data.type === "corporate" ? data.companyName : data.name;
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <h2 style="color:#0b1d3a">Thank you, ${name}!</h2>
      <p>We've received your ${data.type} travel quote request and a member of our team will be in touch within <strong>1 hour</strong> during business hours.</p>
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

  const result = quoteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const data = result.data;
  const name = displayName(data);
  const typeLabel = data.type === "corporate" ? "Corporate" : "Luxury";
  const subject = `New ${typeLabel} Quote — ${name}`;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_key_here") {
    console.log("[quote] Resend not configured – logging submission");
    console.log(`[quote] ${typeLabel} from ${name} (${data.email})`);
    console.log("[quote] Data:", JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  }

  try {
    await sendEmail(apiKey, {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: "info@jetset-travel.com",
      reply_to: data.email,
      subject,
      html: notificationHtml(data),
    });

    await sendEmail(apiKey, {
      from: "JetSet Travel <noreply@jetset-travel.com>",
      to: data.email,
      subject: "JetSet Travel — Your request is received",
      html: autoReplyHtml(data),
    });
  } catch (err) {
    console.error("[quote] Email send error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

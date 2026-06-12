import { z } from "zod";
import { sendResendEmail } from "@/lib/email/resend";
import { FROM_EMAIL, TO_EMAIL } from "@/lib/email/config";
import { logLeadFallback } from "@/lib/email/lead-log";
import { emailRow, notificationEmail, autoReplyEmail } from "@/lib/email/templates";
import { runAntiSpamChecks } from "@/lib/anti-spam";
import { getClientIp } from "@/lib/client-ip";
import { ok, fail, rateLimitGuard, stripMetaFields } from "@/lib/api-response";

export const runtime = "nodejs";

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
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildNotification(data: QuoteData): string {
  let heading: string;
  let rows: string;

  if ("type" in data && data.type === "corporate") {
    heading = "New Corporate Quote Request";
    rows =
      emailRow("Company", data.companyName) +
      emailRow("Email", data.email) +
      emailRow("Phone", data.phone) +
      emailRow("Travellers", data.travellers) +
      emailRow("Travel Dates", data.travelDates) +
      emailRow("Destinations", data.destinations) +
      emailRow("VAT Invoice Required", data.invoiceRequired ? "Yes" : "No") +
      (data.notes ? emailRow("Notes", data.notes) : "");
  } else if ("type" in data && data.type === "luxury") {
    heading = "New Luxury Quote Request";
    rows =
      emailRow("Name", data.name) +
      emailRow("Email", data.email) +
      emailRow("Phone", data.phone) +
      emailRow("Destinations", data.destinations) +
      emailRow("Dates", data.dates) +
      emailRow("Group Size", data.groupSize) +
      emailRow("Budget", data.budget) +
      (data.specialRequirements ? emailRow("Special Requirements", data.specialRequirements) : "");
  } else {
    heading = "New Quick Quote Request";
    rows =
      emailRow("Name", data.name) +
      emailRow("Phone", data.phone) +
      emailRow("Route / Details", data.route);
  }

  return notificationEmail(heading, rows);
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
  const ip = getClientIp(req);

  const limited = await rateLimitGuard(ip, "quote");
  if (limited) return limited;

  let rawBody: Record<string, unknown>;
  try {
    const json = await req.json();
    if (!json || typeof json !== "object") throw new Error("not an object");
    rawBody = json as Record<string, unknown>;
  } catch {
    return fail("Invalid input", 400);
  }

  /* ---- Anti-spam checks (honeypot, timestamp, reCAPTCHA, gibberish) ---- */
  const spam = await runAntiSpamChecks(rawBody);
  if (spam.blocked) {
    if (spam.silentReject) {
      return ok(); // honeypot — fake success
    }
    console.log(`[quote] Spam blocked: ${spam.reason}`, ip);
    return fail("Submission rejected.", 400);
  }

  const parsed = QuoteSchema.safeParse(stripMetaFields(rawBody));
  if (!parsed.success) {
    return fail("Invalid input", 400);
  }

  const data = parsed.data;
  const contactName = getContactName(data);
  const email = getEmail(data);
  const quoteType =
    "type" in data ? (data.type === "corporate" ? "Corporate" : "Luxury") : "Quick";

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_key_here") {
    /* Same grep-friendly prefix as delivery failures so a misconfigured
       deploy's leads can be recovered from logs with one search. */
    logLeadFallback("quote", data as Record<string, unknown>, "RESEND_API_KEY not configured");
    return ok();
  }

  /* Notification email. See /api/contact for the rationale — failures
     here (unverified domain, sandbox-sender restrictions, etc.) must
     not surface as a generic error to the visitor. The lead is logged
     to stderr under a grep-friendly prefix for recovery from Vercel
     logs until the Resend config is corrected. */
  let deliveryOk = true;
  try {
    await sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject: `New ${quoteType} Quote Request — ${contactName}`,
      html: buildNotification(data),
    });
  } catch (err) {
    deliveryOk = false;
    logLeadFallback("quote", data as Record<string, unknown>, err);
  }

  if (email && deliveryOk) {
    try {
      await sendResendEmail(apiKey, {
        from: FROM_EMAIL,
        to: email,
        subject: "JetSet Travel — Your quote request is received",
        html: autoReplyEmail(
          contactName,
          "<p>We've received your quote request and will get back to you within <strong>1 hour</strong> during business hours.</p>",
        ),
      });
    } catch (err) {
      console.error("[quote] Auto-reply email failed (non-fatal):", err);
    }
  }

  return ok();
}

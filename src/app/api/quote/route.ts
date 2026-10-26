import { readJsonObject } from "@/lib/json-body";
import { sendResendEmail } from "@/lib/email/resend";
import { FROM_EMAIL, TO_EMAIL } from "@/lib/email/config";
import { logLeadDeliveryFailure } from "@/lib/email/lead-log";
import { emailRow, notificationEmail, emailLocale, visitorAutoReply } from "@/lib/email/templates";
import { runAntiSpamChecks } from "@/lib/anti-spam";
import { getClientIp } from "@/lib/client-ip";
import { ok, fail, rateLimitGuard, stripMetaFields } from "@/lib/api-response";
import {
  QuoteSchema,
  formatTripTypes,
  quoteTypeLabel,
  VIP_AIRPORT_LABELS,
  VIP_SERVICE_LABELS,
  type QuoteData,
} from "@/lib/quote-schemas";

export const runtime = "nodejs";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildNotification(data: QuoteData, attribution: unknown): string {
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
      (data.tripTypes?.length ? emailRow("Trip Types", formatTripTypes(data.tripTypes)) : "") +
      emailRow("Destinations", data.destinations) +
      emailRow("Dates", data.dates) +
      emailRow("Group Size", data.groupSize) +
      emailRow("Budget", data.budget) +
      (data.specialRequirements ? emailRow("Special Requirements", data.specialRequirements) : "");
  } else if ("type" in data && data.type === "vip") {
    heading = "New VIP Airport Service Request";
    rows =
      emailRow("Name", data.name) +
      emailRow("Email", data.email) +
      emailRow("Phone", data.phone) +
      emailRow("Airport", VIP_AIRPORT_LABELS[data.airport]) +
      emailRow("Service", VIP_SERVICE_LABELS[data.service]) +
      emailRow("Date", data.date) +
      (data.flightNumber ? emailRow("Flight Number", data.flightNumber) : "") +
      emailRow("Passengers", data.passengers) +
      (data.notes ? emailRow("Notes", data.notes) : "");
  } else {
    heading = "New Quick Quote Request";
    rows =
      emailRow("Name", data.name) +
      emailRow("Phone", data.phone) +
      emailRow("Route / Details", data.route);
  }

  return notificationEmail(heading, rows, attribution);
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

  const input = await readJsonObject(req);
  if (!input.ok) return fail(input.error, input.status);
  const rawBody = input.body;
  // Language of the page the visitor submitted from (EN/RU auto-reply).
  const locale = emailLocale(rawBody.locale);

  /* ---- Anti-spam checks (honeypot, timestamp, reCAPTCHA, gibberish) ---- */
  const spam = await runAntiSpamChecks(rawBody, "quote");
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
  const quoteType = quoteTypeLabel(data);

  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey || apiKey === "re_your_key_here") {
    logLeadDeliveryFailure("quote", "RESEND_API_KEY not configured");
    return fail("Unable to deliver your enquiry. Please try again or contact us directly.", 503);
  }

  // Acknowledgement requires provider acceptance; logs are not durable lead storage.
  try {
    await sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject: `New ${quoteType} Quote Request — ${contactName}`,
      html: buildNotification(data, rawBody._attribution),
    });
  } catch (err) {
    logLeadDeliveryFailure("quote", err);
    return fail("Unable to deliver your enquiry. Please try again or contact us directly.", 503);
  }

  if (email) {
    try {
      const reply = visitorAutoReply("quote", locale, contactName);
      await sendResendEmail(apiKey, {
        from: FROM_EMAIL,
        to: email,
        // Replies to the acknowledgement must reach the monitored office inbox,
        // not the sending address (audit F-11).
        reply_to: TO_EMAIL,
        subject: reply.subject,
        html: reply.html,
      });
    } catch (err) {
      logLeadDeliveryFailure("quote-auto-reply", err);
    }
  }

  return ok();
}

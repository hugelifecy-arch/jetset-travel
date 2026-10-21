import { z } from "zod";
import { readJsonObject } from "@/lib/json-body";
import { sendResendEmail } from "@/lib/email/resend";
import { FROM_EMAIL, TO_EMAIL } from "@/lib/email/config";
import { logLeadDeliveryFailure } from "@/lib/email/lead-log";
import { emailRow, notificationEmail, emailLocale, visitorAutoReply } from "@/lib/email/templates";
import { runAntiSpamChecks } from "@/lib/anti-spam";
import { getClientIp } from "@/lib/client-ip";
import { ok, fail, rateLimitGuard, stripMetaFields } from "@/lib/api-response";

export const runtime = "nodejs";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

/* Max lengths mirror the quote route's caps so an oversized payload can't
   be relayed into a multi-megabyte staff email. */
const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().max(30).optional(),
  companyName: z.string().max(120).optional(),
  message: z.string().max(2000).optional(),
  travelType: z.string().max(50).optional(),
  travelers: z.string().max(50).optional(),
  urgency: z.string().max(50).optional(),
  budget: z.string().max(50).optional(),
  contactMethod: z.string().max(50).optional(),
  dates: z.string().max(200).optional(),
});

function buildNotification(data: z.infer<typeof contactSchema>, attribution: unknown): string {
  const rows = [
    emailRow("Name", data.name),
    emailRow("Email", data.email),
    data.phone ? emailRow("Phone", data.phone) : "",
    data.companyName ? emailRow("Company", data.companyName) : "",
    data.travelType ? emailRow("Travel Type", data.travelType) : "",
    data.travelers ? emailRow("Travelers", data.travelers) : "",
    data.urgency ? emailRow("Urgency", data.urgency) : "",
    data.budget ? emailRow("Budget Band", data.budget) : "",
    data.contactMethod ? emailRow("Preferred Contact", data.contactMethod) : "",
    data.dates ? emailRow("Dates", data.dates) : "",
    data.message ? emailRow("Message", data.message) : "",
  ].join("");

  return notificationEmail(
    data.travelType ? "New Quote Request" : "New Contact Message",
    rows,
    attribution,
  );
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const limited = await rateLimitGuard(ip, "contact");
  if (limited) return limited;

  const input = await readJsonObject(request);
  if (!input.ok) return fail(input.error, input.status);
  const body = input.body;
  // Language of the page the visitor submitted from (EN/RU auto-reply).
  const locale = emailLocale(body.locale);

  /* ---- Anti-spam checks (honeypot, timestamp, reCAPTCHA, gibberish) ---- */
  const spam = await runAntiSpamChecks(body, "contact");
  if (spam.blocked) {
    if (spam.silentReject) {
      /* Honeypot — return fake success so bots don't adapt */
      return ok();
    }
    console.log(`[contact] Spam blocked: ${spam.reason}`, ip);
    return fail("Submission rejected.", 400);
  }

  const result = contactSchema.safeParse(stripMetaFields(body));
  if (!result.success) {
    return fail("Validation failed.", 400);
  }

  const data = result.data;

  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey || apiKey === "re_your_key_here") {
    logLeadDeliveryFailure("contact", "RESEND_API_KEY not configured");
    return fail("Unable to deliver your enquiry. Please try again or contact us directly.", 503);
  }

  // Acknowledgement requires provider acceptance; logs are not durable lead storage.
  try {
    await sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: data.email,
      subject: data.travelType
        ? `New Quote Request — ${data.name} (${data.travelType})`
        : `New Contact Message — ${data.name}`,
      html: buildNotification(data, body._attribution),
    });
  } catch (err) {
    logLeadDeliveryFailure("contact", err);
    return fail("Unable to deliver your enquiry. Please try again or contact us directly.", 503);
  }

  // A failed visitor acknowledgement must not duplicate a delivered staff notification.
  try {
    const reply = visitorAutoReply("contact", locale, data.name);
    await sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: data.email,
      // Replies to the acknowledgement must reach the monitored office inbox,
      // not the sending address (audit F-11).
      reply_to: TO_EMAIL,
      subject: reply.subject,
      html: reply.html,
    });
  } catch (err) {
    logLeadDeliveryFailure("contact-auto-reply", err);
  }

  return ok();
}

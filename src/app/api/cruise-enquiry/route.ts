import { z } from "zod";
import { readJsonObject } from "@/lib/json-body";
import { sendResendEmail } from "@/lib/email/resend";
import { FROM_EMAIL, TO_EMAIL } from "@/lib/email/config";
import { logLeadDeliveryFailure } from "@/lib/email/lead-log";
import { emailRow, notificationEmail, autoReplyEmail } from "@/lib/email/templates";
import { runAntiSpamChecks } from "@/lib/anti-spam";
import { getClientIp } from "@/lib/client-ip";
import { ok, fail, rateLimitGuard, stripMetaFields } from "@/lib/api-response";

export const runtime = "nodejs";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

/* Max lengths mirror the quote route's caps so an oversized payload can't
   be relayed into a multi-megabyte staff email. */
const cruiseEnquirySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().max(30).optional(),
  country: z.string().max(80).optional(),
  destination: z.string().max(120).optional(),
  cruiseLine: z.string().max(120).optional(),
  dates: z.string().max(200).optional(),
  duration: z.string().max(50).optional(),
  adults: z.string().max(20).optional(),
  children: z.string().max(20).optional(),
  cabin: z.string().max(80).optional(),
  budget: z.string().max(50).optional(),
  occasion: z.string().max(120).optional(),
  requirements: z.string().max(2000).optional(),
});

function buildNotification(data: z.infer<typeof cruiseEnquirySchema>): string {
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

  return notificationEmail(
    "New Cruise Enquiry",
    rows.map(([label, value]) => emailRow(label, value)).join(""),
  );
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const limited = await rateLimitGuard(ip, "cruise-enquiry");
  if (limited) return limited;

  const input = await readJsonObject(request);
  if (!input.ok) return fail(input.error, input.status);
  const body = input.body;

  /* Anti-spam checks */
  const spam = await runAntiSpamChecks(body, "cruise_enquiry");
  if (spam.blocked) {
    if (spam.silentReject) {
      return ok();
    }
    console.log(`[cruise-enquiry] Spam blocked: ${spam.reason}`, ip);
    return fail("Submission rejected.", 400);
  }

  const result = cruiseEnquirySchema.safeParse(stripMetaFields(body));
  if (!result.success) {
    return fail("Validation failed.", 400);
  }

  const data = result.data;

  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey || apiKey === "re_your_key_here") {
    logLeadDeliveryFailure("cruise-enquiry", "RESEND_API_KEY not configured");
    return fail("Unable to deliver your enquiry. Please try again or contact us directly.", 503);
  }

  // Acknowledgement requires provider acceptance; logs are not durable lead storage.
  try {
    await sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: data.email,
      subject: `New Cruise Enquiry — ${data.name}${data.destination ? ` (${data.destination})` : ""}`,
      html: buildNotification(data),
    });
  } catch (err) {
    logLeadDeliveryFailure("cruise-enquiry", err);
    return fail("Unable to deliver your enquiry. Please try again or contact us directly.", 503);
  }

  try {
    await sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: data.email,
      subject: "JetSet Travel — Your cruise enquiry is received",
      html: autoReplyEmail(
        data.name,
        "<p>We've received your cruise enquiry and our cruise specialist will review your preferences and get back to you within <strong>24 hours</strong> with personalized options.</p>",
      ),
    });
  } catch (err) {
    logLeadDeliveryFailure("cruise-enquiry-auto-reply", err);
  }

  return ok();
}

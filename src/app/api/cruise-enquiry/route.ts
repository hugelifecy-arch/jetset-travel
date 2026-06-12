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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request body.", 400);
  }

  /* Anti-spam checks */
  const spam = await runAntiSpamChecks(body);
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

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_key_here") {
    /* Same grep-friendly prefix as delivery failures so a misconfigured
       deploy's leads can be recovered from logs with one search. */
    logLeadFallback("cruise-enquiry", data, "RESEND_API_KEY not configured");
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
      reply_to: data.email,
      subject: `New Cruise Enquiry — ${data.name}${data.destination ? ` (${data.destination})` : ""}`,
      html: buildNotification(data),
    });
  } catch (err) {
    deliveryOk = false;
    logLeadFallback("cruise-enquiry", data, err);
  }

  if (deliveryOk) {
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
      console.error("[cruise-enquiry] Auto-reply email failed (non-fatal):", err);
    }
  }

  return ok();
}

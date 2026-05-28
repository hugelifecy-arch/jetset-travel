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
    console.log("[cruise-enquiry] Resend not configured – logging submission");
    console.log("[cruise-enquiry] From:", data.name, data.email);
    if (data.destination) console.log("[cruise-enquiry] Destination:", data.destination);
    if (data.cruiseLine) console.log("[cruise-enquiry] Cruise Line:", data.cruiseLine);
    if (data.dates) console.log("[cruise-enquiry] Dates:", data.dates);
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

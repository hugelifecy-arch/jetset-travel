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

/* Deliberately minimal — the Private & Family Office page asks only who is
   enquiring and how they prefer to be contacted. No budget, dates or trip
   type. Max lengths mirror the other lead routes' caps so an oversized
   payload can't be relayed into a multi-megabyte staff email. */
const privateEnquirySchema = z.object({
  name: z.string().min(2).max(80),
  organisation: z.string().max(120).optional(),
  email: z.string().email().max(120),
  phone: z.string().max(30).optional(),
  contactMethod: z.enum(["phone", "email", "whatsapp"]),
  message: z.string().max(2000).optional(),
});

function buildNotification(data: z.infer<typeof privateEnquirySchema>): string {
  const rows = [
    ["Name", data.name],
    data.organisation ? ["Organisation / Family Office", data.organisation] : null,
    ["Email", data.email],
    data.phone ? ["Phone", data.phone] : null,
    ["Preferred Contact", data.contactMethod],
    data.message ? ["Message", data.message] : null,
  ].filter(Boolean) as [string, string][];

  return notificationEmail(
    "Private Clients — Introduction Request",
    rows.map(([label, value]) => emailRow(label, value)).join(""),
  );
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const limited = await rateLimitGuard(ip, "private-enquiry");
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
    console.log(`[private-enquiry] Spam blocked: ${spam.reason}`, ip);
    return fail("Submission rejected.", 400);
  }

  const result = privateEnquirySchema.safeParse(stripMetaFields(body));
  if (!result.success) {
    return fail("Validation failed.", 400);
  }

  const data = result.data;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_key_here") {
    /* Same grep-friendly prefix as delivery failures so a misconfigured
       deploy's leads can be recovered from logs with one search. */
    logLeadFallback("private-enquiry", data, "RESEND_API_KEY not configured");
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
      subject: "Private Clients — Introduction Request",
      html: buildNotification(data),
    });
  } catch (err) {
    deliveryOk = false;
    logLeadFallback("private-enquiry", data, err);
  }

  if (deliveryOk) {
    try {
      await sendResendEmail(apiKey, {
        from: FROM_EMAIL,
        to: data.email,
        subject: "JetSet Travel — Your introduction request is received",
        html: autoReplyEmail(
          data.name,
          "<p>Thank you for your introduction request. You will hear from us personally, usually within the day.</p>",
        ),
      });
    } catch (err) {
      console.error("[private-enquiry] Auto-reply email failed (non-fatal):", err);
    }
  }

  return ok();
}

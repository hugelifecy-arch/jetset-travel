import { z } from "zod";
import { createPrivateEnquirySchema } from "@/lib/private-enquiry-schema";
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

/* Deliberately minimal — the Private & Family Office page asks only who is
   enquiring and how they prefer to be contacted. No budget, dates or trip
   type. Max lengths mirror the other lead routes' caps so an oversized
   payload can't be relayed into a multi-megabyte staff email. */
const privateEnquirySchema = createPrivateEnquirySchema({
  required: "Required", invalidEmail: "Invalid email", invalidPhone: "Invalid phone",
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

  const input = await readJsonObject(request);
  if (!input.ok) return fail(input.error, input.status);
  const body = input.body;

  /* Anti-spam checks */
  const spam = await runAntiSpamChecks(body, "private_enquiry");
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

  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey || apiKey === "re_your_key_here") {
    logLeadDeliveryFailure("private-enquiry", "RESEND_API_KEY not configured");
    return fail("Unable to deliver your enquiry. Please try again or contact us directly.", 503);
  }

  // Acknowledgement requires provider acceptance; logs are not durable lead storage.
  try {
    await sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: data.email,
      subject: "Private Clients — Introduction Request",
      html: buildNotification(data),
    });
  } catch (err) {
    logLeadDeliveryFailure("private-enquiry", err);
    return fail("Unable to deliver your enquiry. Please try again or contact us directly.", 503);
  }

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
    logLeadDeliveryFailure("private-enquiry-auto-reply", err);
  }

  return ok();
}

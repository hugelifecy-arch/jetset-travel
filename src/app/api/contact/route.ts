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

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  message: z.string().optional(),
  travelType: z.string().optional(),
  travelers: z.string().optional(),
  urgency: z.string().optional(),
  budget: z.string().optional(),
  contactMethod: z.string().optional(),
  dates: z.string().optional(),
});

function buildNotification(data: z.infer<typeof contactSchema>): string {
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
  );
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const limited = await rateLimitGuard(ip, "contact");
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request body.", 400);
  }

  /* ---- Anti-spam checks (honeypot, timestamp, reCAPTCHA, gibberish) ---- */
  const spam = await runAntiSpamChecks(body);
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

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_key_here") {
    console.log("[contact] Resend not configured – logging submission");
    console.log("[contact] From:", data.name, data.email);
    if (data.travelType) console.log("[contact] Travel Type:", data.travelType);
    if (data.dates) console.log("[contact] Dates:", data.dates);
    if (data.message) console.log("[contact] Message:", data.message);
    return ok();
  }

  /* Notification email. If Resend rejects the send (unverified domain,
     sandbox sender can only reach the account owner, invalid API key,
     etc.) we must NOT show the visitor a generic error — the form
     already validated their input and passed anti-spam. Log the full
     lead to stderr under a grep-friendly prefix so ops can recover
     it from Vercel logs, then return success. The lead is not lost;
     delivery resumes automatically the moment Resend is configured
     correctly. */
  let deliveryOk = true;
  try {
    await sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: data.email,
      subject: data.travelType
        ? `New Quote Request — ${data.name} (${data.travelType})`
        : `New Contact Message — ${data.name}`,
      html: buildNotification(data),
    });
  } catch (err) {
    deliveryOk = false;
    logLeadFallback("contact", data, err);
  }

  /* Auto-reply is a nice-to-have; don't fail the submission if it
     can't go out (e.g. visitor's mailbox rejects our sender). Skip
     entirely if the notification itself failed — the sandbox sender
     can't reach arbitrary visitor addresses anyway, and retrying
     just produces a second error in the log for the same root cause. */
  if (deliveryOk) {
    try {
      await sendResendEmail(apiKey, {
        from: FROM_EMAIL,
        to: data.email,
        subject: "JetSet Travel — Your message is received",
        html: autoReplyEmail(
          data.name,
          "<p>We've received your message and will get back to you within <strong>1 hour</strong> during business hours.</p>",
        ),
      });
    } catch (err) {
      console.error("[contact] Auto-reply email failed (non-fatal):", err);
    }
  }

  return ok();
}

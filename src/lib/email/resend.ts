import { Resend } from "resend";

type EmailPayload = {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: string | string[];
  [key: string]: unknown;
};

/**
 * Send a transactional email via the Resend SDK.
 *
 * Accepts snake_case `reply_to` (kept for backwards-compat with the
 * previous fetch-based helper) and forwards it to the SDK's
 * camelCase `replyTo`. Any SDK-level error is re-thrown with the
 * full payload serialized so the caller's log line actually tells
 * us why the send failed (unverified domain, invalid API key, etc.).
 */
export async function sendResendEmail(
  apiKey: string,
  payload: Record<string, unknown>,
) {
  const { reply_to, ...rest } = payload as EmailPayload;

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    ...rest,
    ...(reply_to !== undefined ? { replyTo: reply_to } : {}),
  } as Parameters<typeof resend.emails.send>[0]);

  if (error) {
    throw new Error(`Resend API error: ${JSON.stringify(error)}`);
  }

  return data;
}

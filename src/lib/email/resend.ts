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
    throw new Error(
      `Resend API error (${error.name ?? "unknown"}): ${error.message}`,
    );
  }

  return data;
}

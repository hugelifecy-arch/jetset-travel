/**
 * Send a transactional email via the Resend HTTP API.
 *
 * We call Resend directly with `fetch` instead of the `resend` SDK so
 * the package doesn't need to be installed at runtime (and so its
 * transitive dependencies aren't pulled into the bundle or audit
 * surface). The REST API accepts snake_case `reply_to`, matching what
 * the callers already pass, so no payload transformation is needed.
 *
 * Self-healing on an unverified sender: if Resend rejects the
 * configured `from:` with a 403 "domain not verified" response — the
 * common failure mode when Vercel still has RESEND_FROM_EMAIL pointing
 * at a domain whose DKIM/SPF records aren't live yet — retry once
 * with the sandbox sender `onboarding@resend.dev`. The sandbox always
 * delivers to the Resend account owner's inbox (the office inbox at
 * info@jetset.com.cy), so office-bound notifications still land
 * instead of dropping into the [LEAD_DELIVERY_FAILED] log. Visitor-
 * bound auto-replies will still 403 under the sandbox's
 * owner-only-delivery rule, but those are already caught non-fatally
 * by the callers.
 *
 * Throws on any non-2xx response (including a failed sandbox retry)
 * with the status and response body so the caller's log line explains
 * why the send failed.
 */
const SANDBOX_FROM = "JetSet Travel <onboarding@resend.dev>";

async function postEmail(apiKey: string, payload: Record<string, unknown>) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function sendResendEmail(
  apiKey: string,
  payload: Record<string, unknown>,
) {
  const response = await postEmail(apiKey, payload);

  if (response.ok) {
    return response.json();
  }

  const errorText = await response.text();
  const from = typeof payload.from === "string" ? payload.from : "";
  const senderRejected =
    response.status === 403 &&
    /not verif|verify/i.test(errorText) &&
    from !== "" &&
    !from.includes("onboarding@resend.dev");

  if (!senderRejected) {
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }

  const retry = await postEmail(apiKey, { ...payload, from: SANDBOX_FROM });

  if (retry.ok) {
    console.warn(
      `[resend] sender "${from}" rejected (403, unverified); delivered via sandbox sender`,
    );
    return retry.json();
  }

  const retryText = await retry.text();
  throw new Error(
    `Resend API error (${response.status}): ${errorText} — sandbox retry also failed (${retry.status}): ${retryText}`,
  );
}

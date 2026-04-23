/**
 * Send a transactional email via the Resend HTTP API.
 *
 * We call Resend directly with `fetch` instead of the `resend` SDK so
 * the package doesn't need to be installed at runtime (and so its
 * transitive dependencies aren't pulled into the bundle or audit
 * surface). The REST API accepts snake_case `reply_to`, matching what
 * the callers already pass, so no payload transformation is needed.
 *
 * Throws on any non-2xx response with the status and response body so
 * the caller's log line explains why the send failed (unverified
 * domain, invalid API key, validation error, etc.).
 */
export async function sendResendEmail(
  apiKey: string,
  payload: Record<string, unknown>,
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

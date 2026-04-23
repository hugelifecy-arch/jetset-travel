/**
 * Structured lead logging.
 *
 * When Resend delivery fails (e.g. sandbox sender can only reach the
 * Resend account owner, or the domain isn't verified yet), we still
 * need the office to get the lead. Write every field of the submission
 * to stderr under a grep-friendly prefix so ops can recover it from
 * Vercel logs until the email config is fixed.
 */
export function logLeadFallback(
  scope: string,
  data: Record<string, unknown>,
  err: unknown,
) {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === "") continue;
    safe[key] = value;
  }

  console.error(
    `[LEAD_DELIVERY_FAILED][${scope}] ${JSON.stringify(safe)} :: ${
      err instanceof Error ? err.message : String(err)
    }`,
  );
}

/** Operational diagnostics only: contact details and travel requests are not logs. */
export function logLeadDeliveryFailure(scope: string, err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  const providerStatus = message.match(/Resend API error \((\d{3})\)/)?.[1];
  console.error("[LEAD_DELIVERY_FAILED]", {
    scope,
    reason: message === "RESEND_API_KEY not configured" ? "missing_configuration" : "provider_failure",
    ...(providerStatus ? { providerStatus } : {}),
  });
}

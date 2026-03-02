/* ------------------------------------------------------------------ */
/*  Client-side reCAPTCHA v3 helper                                    */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Get a reCAPTCHA v3 token for the given action.
 * Returns null when reCAPTCHA is not configured or the script hasn't loaded.
 */
export async function getRecaptchaToken(
  action: string = "submit",
): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey || siteKey === "your_recaptcha_site_key") return null;

  try {
    if (!window.grecaptcha) return null;

    await new Promise<void>((resolve) => {
      window.grecaptcha!.ready(() => resolve());
    });

    return await window.grecaptcha.execute(siteKey, { action });
  } catch {
    return null;
  }
}

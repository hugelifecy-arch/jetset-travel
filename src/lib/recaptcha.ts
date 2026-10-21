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

const LOAD_TIMEOUT_MS = 8_000;

function siteKey(): string | null {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!key || key === "your_recaptcha_site_key") return null;
  return key;
}

let loading: Promise<boolean> | null = null;

/**
 * Load Google's reCAPTCHA v3 script once, on demand.
 *
 * The script used to load on every page and cost ~2 s of main-thread time on
 * a mid-range phone. It now loads when a visitor starts using a form (see
 * RecaptchaOnFormFocus) or, at the latest, when a form is submitted.
 * Resolves true when `window.grecaptcha` is available.
 */
export function loadRecaptcha(): Promise<boolean> {
  const key = siteKey();
  if (!key || typeof document === "undefined") return Promise.resolve(false);
  if (window.grecaptcha) return Promise.resolve(true);
  if (loading) return loading;

  loading = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
    script.async = true;
    script.onload = () => resolve(Boolean(window.grecaptcha));
    script.onerror = () => {
      // Allow a later attempt (e.g. at submit) if the network blipped.
      script.remove();
      loading = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return loading;
}

/**
 * Get a reCAPTCHA v3 token for the given action.
 * Returns null when reCAPTCHA is not configured or could not be loaded
 * within the timeout.
 */
export async function getRecaptchaToken(
  action: string = "submit",
): Promise<string | null> {
  const key = siteKey();
  if (!key) return null;

  try {
    if (!window.grecaptcha) {
      const loaded = await Promise.race([
        loadRecaptcha(),
        new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), LOAD_TIMEOUT_MS)),
      ]);
      if (!loaded || !window.grecaptcha) return null;
    }

    return await new Promise<string | null>((resolve) => {
      const timeout = window.setTimeout(() => resolve(null), LOAD_TIMEOUT_MS);
      window.grecaptcha!.ready(() => {
        window.grecaptcha!.execute(key, { action })
          .then(resolve, () => resolve(null))
          .finally(() => window.clearTimeout(timeout));
      });
    });
  } catch {
    return null;
  }
}

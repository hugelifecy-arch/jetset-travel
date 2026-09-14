export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE_DAYS = 365;
const CONSENT_STORAGE_KEY = "cookie-consent-sync";

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

export const ACCEPT_ALL: CookiePreferences = {
  essential: true,
  analytics: true,
  marketing: true,
};

export function getConsentPreferences(): CookiePreferences | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(match.slice(COOKIE_NAME.length + 1)));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const prefs = parsed as Record<string, unknown>;
    if (prefs.essential !== true || typeof prefs.analytics !== "boolean" ||
      typeof prefs.marketing !== "boolean") return null;
    return { essential: true, analytics: prefs.analytics, marketing: prefs.marketing };
  } catch {
    return null;
  }
}

export function setConsentPreferences(prefs: CookiePreferences): void {
  if (typeof document === "undefined") return;
  const previous = getConsentPreferences();
  const value = encodeURIComponent(JSON.stringify(prefs));
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  // Cookies do not emit storage events. This signal carries no visitor data;
  // the shared cookie remains the source of truth.
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Restricted storage must not prevent saving the cookie or withdrawing consent.
  }
  window.dispatchEvent(new Event("cookie-consent-change"));
  if (consentWasWithdrawn(previous, prefs)) {
    // Unmounting next/script does not stop an initialized tracker. Start a fresh
    // document with the saved preference so denied scripts are never mounted.
    window.location.reload();
  }
}

export function hasConsent(category: keyof CookiePreferences): boolean {
  const prefs = getConsentPreferences();
  if (!prefs) return category === "essential";
  return prefs[category];
}

function consentWasWithdrawn(
  previous: CookiePreferences | null,
  next: CookiePreferences | null,
): boolean {
  return Boolean(
    (previous?.analytics && !next?.analytics) ||
    (previous?.marketing && !next?.marketing),
  );
}

/** Subscribe once in the persistent cookie banner, including restored/open tabs. */
export function subscribeConsentChanges(callback: () => void): () => void {
  let previous = getConsentPreferences();
  const onLocalChange = () => {
    // setConsentPreferences owns the reload for this tab.
    previous = getConsentPreferences();
    callback();
  };
  const onExternalChange = () => {
    const next = getConsentPreferences();
    const withdrawn = consentWasWithdrawn(previous, next);
    previous = next;
    if (withdrawn) window.location.reload();
    callback();
    // Existing tracker components subscribe to this event to pick up new grants.
    window.dispatchEvent(new Event("cookie-consent-change"));
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY || event.key === null) onExternalChange();
  };
  const onVisible = () => {
    if (document.visibilityState === "visible") onExternalChange();
  };
  window.addEventListener("cookie-consent-change", onLocalChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener("pageshow", onExternalChange);
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    window.removeEventListener("cookie-consent-change", onLocalChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("pageshow", onExternalChange);
    document.removeEventListener("visibilitychange", onVisible);
  };
}

export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE_DAYS = 365;

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
    return JSON.parse(decodeURIComponent(match.split("=")[1]));
  } catch {
    return null;
  }
}

export function setConsentPreferences(prefs: CookiePreferences): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(prefs));
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  window.dispatchEvent(new Event("cookie-consent-change"));
}

export function hasConsent(category: keyof CookiePreferences): boolean {
  const prefs = getConsentPreferences();
  if (!prefs) return category === "essential";
  return prefs[category];
}

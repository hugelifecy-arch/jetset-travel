import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ACCEPT_ALL, DEFAULT_PREFERENCES, getConsentPreferences, hasConsent,
  setConsentPreferences, subscribeConsentChanges,
} from "../src/lib/cookie-consent.ts";

let browser, page, cookie, reloads, writes, cleanups;
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
const saveCookie = prefs => {
  cookie = prefs === null ? "" : "cookie_consent=" + encodeURIComponent(JSON.stringify(prefs));
};
const storageEvent = key => Object.assign(new Event("storage"), { key });
beforeEach(() => {
  cookie = ""; reloads = []; writes = []; cleanups = [];
  page = new EventTarget();
  Object.defineProperty(page, "cookie", {
    get: () => cookie,
    set: value => { cookie = value.split(";")[0]; },
  });
  page.visibilityState = "visible";
  browser = new EventTarget();
  browser.location = { reload: () => reloads.push(getConsentPreferences()) };
  browser.localStorage = { setItem: (key, value) => writes.push([key, value]) };
  Object.defineProperty(globalThis, "document", { configurable: true, value: page });
  Object.defineProperty(globalThis, "window", { configurable: true, value: browser });
});
afterEach(() => {
  for (const cleanup of cleanups) cleanup();
  for (const [name, original] of [["window", originalWindow], ["document", originalDocument]]) {
    if (original) Object.defineProperty(globalThis, name, original);
    else delete globalThis[name];
  }
});
const watch = callback => {
  const cleanup = subscribeConsentChanges(callback);
  cleanups.push(cleanup);
  return cleanup;
};

describe("cookie consent lifecycle", () => {
  it("does not reload on initial rejection, acceptance, or unchanged choices", () => {
    watch(() => {});
    setConsentPreferences(DEFAULT_PREFERENCES);
    setConsentPreferences(ACCEPT_ALL);
    setConsentPreferences(ACCEPT_ALL);
    assert.equal(reloads.length, 0);
    assert.equal(hasConsent("analytics"), true);
    assert.equal(writes[0][0], "cookie-consent-sync");
  });

  for (const category of ["analytics", "marketing"]) {
    it(`persists withdrawal of ${category} before reloading exactly once`, () => {
      saveCookie(ACCEPT_ALL);
      watch(() => {});
      const next = { ...ACCEPT_ALL, [category]: false };
      setConsentPreferences(next);
      assert.deepEqual(reloads, [next]);
      assert.equal(hasConsent(category), false);
      // Simulate a new document booting with the persisted choice.
      const unsubscribe = watch(() => {});
      browser.dispatchEvent(new Event("pageshow"));
      assert.equal(reloads.length, 1);
      unsubscribe();
    });
  }

  it("withdraws even when localStorage is blocked", () => {
    saveCookie(ACCEPT_ALL);
    browser.localStorage.setItem = () => { throw new Error("Storage blocked"); };
    setConsentPreferences(DEFAULT_PREFERENCES);
    assert.deepEqual(reloads, [DEFAULT_PREFERENCES]);
  });

  it("reloads another open tab when the shared cookie loses consent", () => {
    saveCookie(ACCEPT_ALL);
    watch(() => {});
    saveCookie(DEFAULT_PREFERENCES);
    browser.dispatchEvent(storageEvent("cookie-consent-sync"));
    browser.dispatchEvent(storageEvent("cookie-consent-sync"));
    assert.deepEqual(reloads, [DEFAULT_PREFERENCES]);
  });

  it("notifies existing trackers of a grant in another tab without reloading", () => {
    saveCookie(DEFAULT_PREFERENCES);
    watch(() => {});
    let granted = false;
    browser.addEventListener("cookie-consent-change", () => { granted = hasConsent("analytics"); });
    saveCookie(ACCEPT_ALL);
    browser.dispatchEvent(storageEvent("cookie-consent-sync"));
    assert.equal(granted, true);
    assert.equal(reloads.length, 0);
  });

  it("rechecks consent when a suspended tab becomes visible", () => {
    saveCookie(ACCEPT_ALL);
    watch(() => {});
    saveCookie(DEFAULT_PREFERENCES);
    page.visibilityState = "hidden";
    page.dispatchEvent(new Event("visibilitychange"));
    assert.equal(reloads.length, 0);
    page.visibilityState = "visible";
    page.dispatchEvent(new Event("visibilitychange"));
    assert.deepEqual(reloads, [DEFAULT_PREFERENCES]);
  });

  it("clears active trackers when a restored page finds expired consent", () => {
    saveCookie(ACCEPT_ALL);
    watch(() => {});
    saveCookie(null);
    browser.dispatchEvent(new Event("pageshow"));
    assert.deepEqual(reloads, [null]);
    assert.equal(hasConsent("analytics"), false);
  });

  it("ignores unrelated storage changes and removes listeners on cleanup", () => {
    saveCookie(ACCEPT_ALL);
    let notifications = 0;
    const cleanup = watch(() => { notifications++; });
    saveCookie(DEFAULT_PREFERENCES);
    browser.dispatchEvent(storageEvent("unrelated"));
    assert.equal(reloads.length, 0);
    cleanup();
    browser.dispatchEvent(storageEvent("cookie-consent-sync"));
    browser.dispatchEvent(new Event("pageshow"));
    browser.dispatchEvent(new Event("cookie-consent-change"));
    page.dispatchEvent(new Event("visibilitychange"));
    assert.equal(reloads.length, 0);
    assert.equal(notifications, 0);
  });

  it("denies optional consent for malformed or non-boolean stored values", () => {
    for (const value of [null, [], "yes", { analytics: "false", marketing: true },
      { essential: true, analytics: "true", marketing: false }]) {
      saveCookie(value);
      assert.equal(getConsentPreferences(), null);
      assert.equal(hasConsent("analytics"), false);
      assert.equal(hasConsent("marketing"), false);
      assert.equal(hasConsent("essential"), true);
    }
    cookie = "cookie_consent=%invalid";
    assert.equal(getConsentPreferences(), null);
  });
});

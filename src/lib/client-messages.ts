/**
 * Namespaces that CLIENT components consume via `useTranslations("...")`.
 *
 * The locale layout passes only these namespaces to NextIntlClientProvider.
 * Server components render through `getTranslations`/request-scoped
 * `useTranslations` and don't need their messages serialized to the client,
 * so the 19 page-content namespaces (aboutPage, visaPage, …) stay out of the
 * RSC payload — roughly a 70% cut of the per-page message weight
 * (EN ~114KB → ~36KB, RU ~122KB → ~37KB at the time of writing).
 *
 * Keep in sync with the components: `tests/client-messages.test.js` scans
 * every `"use client"` file for useTranslations("ns") literals and fails CI
 * when a namespace is consumed client-side but missing from this list.
 */
export const CLIENT_NAMESPACES = [
  "blogPage",
  "clients",
  "common",
  "comparison",
  "contactPage",
  "cookies",
  "corporatePage",
  "credentialsBar",
  "cruisesPage",
  "cta",
  "exitIntent",
  "footer",
  "forms",
  "hero",
  "mobileBar",
  "nav",
  "quotePage",
  "reviews",
  "services",
  "trust",
] as const;

type Messages = Record<string, unknown>;

export function pickClientMessages(messages: Messages): Messages {
  const picked: Messages = {};
  for (const ns of CLIENT_NAMESPACES) {
    if (ns in messages) picked[ns] = messages[ns];
  }
  return picked;
}

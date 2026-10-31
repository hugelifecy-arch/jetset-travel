/**
 * Labour & VFR flights campaign (Oct 2026): the four priority destinations
 * and the WhatsApp prefills used by the Labour/VFR service page, the
 * seasonal-staff employer page and the winter blog article.
 *
 * Enquiries for this service are WhatsApp-only (no forms): every button opens
 * a chat with a fixed, destination-specific first message so the office sees
 * the route without a round of questions. The URL only ever carries this
 * fixed text — nothing about the visitor is added.
 *
 * Pure data and functions, no Next imports, so tests/ can import it.
 */
import { WHATSAPP_PHONE, whatsAppTopicMessage } from "./whatsapp-message.ts";

/** Route paths after the locale. Same Latin slug in EN and RU (site convention for "*-cyprus" pages). */
export const LABOUR_VFR_PATH = "/labour-vfr-flights-cyprus";
export const SEASONAL_STAFF_PATH = "/seasonal-staff-travel-cyprus";

/** Content review date for both pages (schema dateModified + sitemap lastmod). */
export const LABOUR_VFR_LAST_UPDATED = "2026-10-31";

export type LabourVfrLocale = "en" | "ru";

export const LABOUR_VFR_DESTINATION_KEYS = ["manila", "kathmandu", "dhaka", "delhi"] as const;
export type LabourVfrDestinationKey = (typeof LABOUR_VFR_DESTINATION_KEYS)[number];

export interface LabourVfrDestination {
  key: LabourVfrDestinationKey;
  /** IATA airport code of the destination. */
  iata: string;
  city: Record<LabourVfrLocale, string>;
  country: Record<LabourVfrLocale, string>;
}

export const LABOUR_VFR_DESTINATIONS: readonly LabourVfrDestination[] = [
  {
    key: "manila",
    iata: "MNL",
    city: { en: "Manila", ru: "Манила" },
    country: { en: "Philippines", ru: "Филиппины" },
  },
  {
    key: "kathmandu",
    iata: "KTM",
    city: { en: "Kathmandu", ru: "Катманду" },
    country: { en: "Nepal", ru: "Непал" },
  },
  {
    key: "dhaka",
    iata: "DAC",
    city: { en: "Dhaka", ru: "Дакка" },
    country: { en: "Bangladesh", ru: "Бангладеш" },
  },
  {
    key: "delhi",
    iata: "DEL",
    city: { en: "Delhi", ru: "Дели" },
    country: { en: "India", ru: "Индия" },
  },
];

/** Russian city names in the accusative after «в» (в Манилу, в Катманду…). */
const RU_TO_CITY: Record<LabourVfrDestinationKey, string> = {
  manila: "в Манилу",
  kathmandu: "в Катманду",
  dhaka: "в Дакку",
  delhi: "в Дели",
};

function loc(locale: string): LabourVfrLocale {
  return locale === "ru" ? "ru" : "en";
}

/**
 * Prefilled WhatsApp text for a Labour/VFR fare request. With a destination
 * it is the owner-approved per-city wording; without one it asks for the
 * destination and dates (floating button, general CTAs).
 */
export function labourVfrWhatsAppMessage(
  destination: LabourVfrDestinationKey | null,
  locale: string,
): string {
  const l = loc(locale);
  if (destination) {
    const d = LABOUR_VFR_DESTINATIONS.find((x) => x.key === destination);
    if (!d) throw new Error(`Unknown Labour/VFR destination: ${destination}`);
    return l === "ru"
      ? `Здравствуйте, JetSet Travel! Прошу рассчитать специальный тариф Labour/VFR на перелёт с Кипра ${RU_TO_CITY[destination]}. Подскажите, пожалуйста, какие тарифы доступны.`
      : `Hello JetSet Travel, I would like a special Labour/VFR flight quotation from Cyprus to ${d.city.en}. Please advise the available fares.`;
  }
  // Same text as the floating WhatsApp button on the Labour/VFR page.
  return whatsAppTopicMessage("labour-vfr", l);
}

/** Prefilled WhatsApp text for employers arranging seasonal staff flights. */
export function employerWhatsAppMessage(locale: string): string {
  return whatsAppTopicMessage("seasonal-staff", locale);
}

/** wa.me chat link (opens the app on phones, WhatsApp Web/Desktop on computers). */
export function whatsAppChatLink(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function labourVfrWhatsAppHref(
  destination: LabourVfrDestinationKey | null,
  locale: string,
): string {
  return whatsAppChatLink(labourVfrWhatsAppMessage(destination, locale));
}

export function employerWhatsAppHref(locale: string): string {
  return whatsAppChatLink(employerWhatsAppMessage(locale));
}

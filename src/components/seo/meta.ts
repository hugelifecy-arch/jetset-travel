import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/seo";

export function buildLocalizedMetadata(locale: string, routePath = ""): Pick<Metadata, "alternates"> {
  return {
    alternates: localizedAlternates(locale, routePath),
  };
}

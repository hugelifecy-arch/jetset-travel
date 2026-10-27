"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Map as MapIcon, MapPin } from "lucide-react";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d550.9363089741603!2d32.41889941969174!3d34.76763619960539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14e706ec2d62587f%3A0x4161901d9b64e1b4!2sJetSet%20Travel%20Agency%20-%20Paphos!5e1!3m2!1sen!2s!4v1774692196854!5m2!1sen!2s";
export const MAP_LINK_URL = "https://maps.app.goo.gl/nA8De9MqgLmUphZ49";

/**
 * Office map that makes no third-party request until the visitor asks for
 * it. The Google Maps iframe used to load as soon as it scrolled into view,
 * before cookie consent (37 requests to 6 Google hosts). Until "Show map" is
 * pressed this renders a local placeholder only.
 */
export default function OfficeMap() {
  const t = useTranslations("contactPage");
  const [showMap, setShowMap] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // The button disappears when the map loads: keep keyboard focus on the map.
  useEffect(() => {
    if (showMap) iframeRef.current?.focus();
  }, [showMap]);

  if (showMap) {
    return (
      <div className="overflow-hidden rounded-2xl border border-brand-navy/10 shadow-sm">
        <iframe
          ref={iframeRef}
          title={t("mapTitle")}
          src={MAP_EMBED_URL}
          width="100%"
          height="400"
          style={{ border: 0, borderRadius: "12px" }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-[400px] items-center justify-center overflow-hidden rounded-2xl border border-brand-navy/10 bg-white shadow-sm">
      {/* Decorative street-grid pattern drawn in CSS: no image request. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgb(27_42_74/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(27_42_74/0.06)_1px,transparent_1px)] bg-[size:36px_36px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[38%] w-3 -skew-x-12 bg-brand-navy/[0.04]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[58%] h-3 -skew-y-3 bg-brand-navy/[0.04]"
      />

      <div className="relative mx-4 flex max-w-lg flex-col items-center rounded-2xl bg-white/95 px-6 py-7 text-center shadow-luxury">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/15">
          <MapPin className="h-6 w-6 text-brand-gold-ink" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-semibold text-brand-navy">
          {t("mapAddress")}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-brand-navy/70">
          {t("mapNotice")}
        </p>
        <div className="mt-5 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white sm:whitespace-nowrap transition-colors hover:bg-brand-navy/90"
          >
            <MapIcon className="h-4 w-4" aria-hidden="true" />
            {t("showMap")}
          </button>
          <a
            href={MAP_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-brand-navy/20 px-5 py-2.5 text-sm font-semibold text-brand-navy sm:whitespace-nowrap transition-colors hover:bg-brand-light"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {t("openInGoogleMaps")}
          </a>
        </div>
      </div>
    </div>
  );
}

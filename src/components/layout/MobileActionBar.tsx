"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCookieBannerOffset } from "@/hooks/useCookieBannerOffset";
import { trackCTAClick, trackWhatsAppClick } from "@/lib/analytics/gtag";

export default function MobileActionBar() {
  const [footerVisible, setFooterVisible] = useState(false);
  const locale = useLocale();
  const t = useTranslations("mobileBar");
  const cookieOffset = useCookieBannerOffset();

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (footerVisible) return null;

  const whatsappText =
    locale === "ru"
      ? encodeURIComponent("Здравствуйте JetSet, мне нужна помощь с...")
      : encodeURIComponent("Hi JetSet, I'd like help with...");

  return (
    <div
      className="fixed inset-x-0 z-50 md:hidden transition-[bottom] duration-300 ease-in-out"
      style={{ bottom: `${cookieOffset}px` }}
    >
      <div className="flex bg-brand-navy/90 backdrop-blur-sm border-t border-white/10">
        <a
          href="tel:+35799478073"
          aria-label="Call JetSet Travel"
          onClick={() =>
            trackCTAClick({
              location: "mobile_action_bar",
              cta_type: "phone_call",
              destination: "tel:+35799478073",
            })
          }
          className="flex flex-1 items-center justify-center gap-2 py-3 text-white active:bg-white/10 transition-colors min-h-[44px]"
        >
          <Phone className="h-5 w-5" />
          <span className="text-sm font-medium">{t("call")}</span>
        </a>

        <div className="w-px bg-white/10" />

        <a
          href={`https://wa.me/35799478073?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact via WhatsApp"
          onClick={() => trackWhatsAppClick("mobile_action_bar", "generic")}
          className="flex flex-1 items-center justify-center gap-2 py-3 text-white active:bg-white/10 transition-colors min-h-[44px]"
        >
          <Image
            src="/images/icons/whatsapp.svg"
            alt="WhatsApp"
            width={20}
            height={20}
            className="brightness-0 invert h-5 w-5"
          />
          <span className="text-sm font-medium">{t("whatsapp")}</span>
        </a>
      </div>
    </div>
  );
}

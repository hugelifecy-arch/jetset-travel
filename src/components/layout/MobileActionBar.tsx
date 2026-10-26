"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCookieBannerOffset } from "@/hooks/useCookieBannerOffset";
import { trackCTAClick, trackTelegramClick, trackWhatsAppClick } from "@/lib/analytics/gtag";
import { whatsAppHref } from "@/lib/whatsapp-message";
import { TELEGRAM_URL } from "@/lib/telegram";

export default function MobileActionBar() {
  const [footerVisible, setFooterVisible] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
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

  return (
    <div
      className="fixed inset-x-0 z-50 md:hidden transition-[bottom] duration-300 ease-in-out"
      style={{ bottom: `${cookieOffset}px` }}
    >
      <div className="flex bg-brand-navy/90 backdrop-blur-sm border-t border-white/10">
        <a
          href="tel:+35799478073"
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
          href={whatsAppHref(pathname, locale)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick("mobile_action_bar", "generic")}
          className="flex flex-1 items-center justify-center gap-2 py-3 text-white active:bg-white/10 transition-colors min-h-[44px]"
        >
          <Image
            src="/images/icons/whatsapp.svg"
            alt=""
            width={20}
            height={20}
            className="brightness-0 invert h-5 w-5"
          />
          <span className="text-sm font-medium">{t("whatsapp")}</span>
        </a>

        {/* Telegram for Russian-speaking visitors (/ru pages only). */}
        {locale === "ru" && (
          <>
            <div className="w-px bg-white/10" />
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackTelegramClick("mobile_action_bar")}
              className="flex flex-1 items-center justify-center gap-2 py-3 text-white active:bg-white/10 transition-colors min-h-[44px]"
            >
              <Image
                src="/images/icons/telegram.svg"
                alt=""
                width={20}
                height={20}
                className="brightness-0 invert h-5 w-5"
              />
              <span className="text-sm font-medium">{t("telegram")}</span>
            </a>
          </>
        )}
      </div>
    </div>
  );
}

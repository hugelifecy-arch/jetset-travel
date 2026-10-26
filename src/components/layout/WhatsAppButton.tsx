"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useCookieBannerOffset } from "@/hooks/useCookieBannerOffset";
import { trackTelegramClick, trackWhatsAppClick } from "@/lib/analytics/gtag";
import { whatsAppHref } from "@/lib/whatsapp-message";
import { TELEGRAM_URL } from "@/lib/telegram";

/** Floating size and gap shared by the WhatsApp and Telegram buttons. */
const BUTTON_PX = 48;
const GAP_PX = 12;

export default function WhatsAppButton() {
  const locale = useLocale();
  const pathname = usePathname();
  const cookieOffset = useCookieBannerOffset();
  const bottom = 24 + cookieOffset;

  return (
    <>
      {/* Russian-speaking visitors often prefer Telegram: offer it above
          WhatsApp on /ru pages (desktop; phones use the action bar). */}
      {locale === "ru" && (
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать нам в Telegram"
          onClick={() => trackTelegramClick("floating_button")}
          className="fixed right-4 sm:right-6 z-50 hidden md:flex items-center justify-center rounded-full bg-white shadow-lg transition-[bottom,transform] duration-300 ease-in-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 w-12 h-12"
          style={{ bottom: `${bottom + BUTTON_PX + GAP_PX}px` }}
        >
          {/* The icon is a circle with the plane cut out; masking it over
              Telegram blue on a white button gives the familiar logo. */}
          <span
            aria-hidden="true"
            className="block w-12 h-12 bg-[#229ED9]"
            style={{
              WebkitMask: "url(/images/icons/telegram.svg) center / contain no-repeat",
              mask: "url(/images/icons/telegram.svg) center / contain no-repeat",
            }}
          />
        </a>
      )}
      <a
        href={whatsAppHref(pathname, locale)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={locale === "ru" ? "Написать нам в WhatsApp" : "Contact us on WhatsApp"}
        onClick={() => trackWhatsAppClick("footer", "floating_button")}
        className="soft-pulse fixed right-4 sm:right-6 z-50 hidden md:flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5A] transition-[bottom] duration-300 ease-in-out w-12 h-12"
        style={{ bottom: `${bottom}px` }}
      >
        <Image
          src="/images/icons/whatsapp.svg"
          alt="WhatsApp"
          width={28}
          height={28}
          className="brightness-0 invert w-7 h-7 md:w-6 md:h-6"
        />
      </a>
    </>
  );
}

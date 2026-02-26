"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function MobileActionBar() {
  const [footerVisible, setFooterVisible] = useState(false);
  const t = useTranslations("mobileBar");

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
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      <div className="flex bg-brand-navy/90 backdrop-blur-sm border-t border-white/10">
        <a
          href="tel:+35799478073"
          aria-label="Call JetSet Travel"
          className="flex flex-1 items-center justify-center gap-2 py-3 text-white active:bg-white/10 transition-colors min-h-[44px]"
        >
          <Phone className="h-5 w-5" />
          <span className="text-sm font-medium">{t("call")}</span>
        </a>

        <div className="w-px bg-white/10" />

        <a
          href="https://wa.me/35799478073"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact via WhatsApp"
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
      </div>
    </div>
  );
}

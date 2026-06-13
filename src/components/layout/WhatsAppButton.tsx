"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useCookieBannerOffset } from "@/hooks/useCookieBannerOffset";
import { trackWhatsAppClick } from "@/lib/analytics/gtag";

export default function WhatsAppButton() {
  const locale = useLocale();
  const cookieOffset = useCookieBannerOffset();
  const prefersReducedMotion = useReducedMotion();
  const whatsappText =
    locale === "ru"
      ? encodeURIComponent("Здравствуйте JetSet, мне нужна помощь с...")
      : encodeURIComponent("Hi JetSet, I'd like help with...");

  return (
    <motion.a
      href={`https://wa.me/35799478073?text=${whatsappText}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      onClick={() => trackWhatsAppClick("footer", "floating_button")}
      className="fixed right-4 sm:right-6 z-50 hidden md:flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5A] transition-[bottom] duration-300 ease-in-out w-12 h-12"
      style={{ bottom: `${24 + cookieOffset}px` }}
      animate={prefersReducedMotion ? undefined : { scale: [1, 1.1, 1] }}
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }
      }
      whileHover={prefersReducedMotion ? undefined : { scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      <Image
        src="/images/icons/whatsapp.svg"
        alt="WhatsApp"
        width={28}
        height={28}
        className="brightness-0 invert w-7 h-7 md:w-6 md:h-6"
      />
    </motion.a>
  );
}

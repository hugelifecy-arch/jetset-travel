"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";

export default function WhatsAppButton() {
  const locale = useLocale();
  const whatsappText =
    locale === "ru"
      ? encodeURIComponent("Здравствуйте, JetSet, мне нужна помощь")
      : encodeURIComponent("Hi JetSet, I need help");

  return (
    <motion.a
      href={`https://wa.me/35799478073?text=${whatsappText}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 hidden md:flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5A] transition-colors md:w-12 md:h-12"
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      <Image
        src="/images/icons/whatsapp.svg"
        alt=""
        role="presentation"
        width={28}
        height={28}
        className="brightness-0 invert w-7 h-7 md:w-6 md:h-6"
      />
    </motion.a>
  );
}

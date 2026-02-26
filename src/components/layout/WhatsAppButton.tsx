"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/35799478073?text=Hi%20JetSet%2C%20I%20need%20help"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
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
        alt="WhatsApp"
        width={28}
        height={28}
        className="brightness-0 invert w-7 h-7 md:w-6 md:h-6"
      />
    </motion.a>
  );
}

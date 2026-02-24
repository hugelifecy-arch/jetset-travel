import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us — JetSet Travel Cyprus, Paphos",
  description:
    "Get in touch with JetSet Travel Cyprus in Paphos. Call, email, or WhatsApp us for corporate travel, luxury holidays, visa assistance, and hotel bookings.",
};

export default function ContactPage() {
  return <ContactContent />;
}

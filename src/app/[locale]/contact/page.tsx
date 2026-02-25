import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Contact Us — JetSet Travel Cyprus, Paphos",
    description:
      "Get in touch with JetSet Travel Cyprus in Paphos. Call, email, or WhatsApp us for corporate travel, luxury holidays, visa assistance, and hotel bookings.",
  };
}

export default function ContactPage() {
  return <ContactContent />;
}

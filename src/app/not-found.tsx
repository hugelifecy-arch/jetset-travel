import Link from "next/link";
import { Home, Briefcase, Palmtree, FileText, Phone, MessageSquare } from "lucide-react";

const links = [
  { href: "/en", label: "Homepage", icon: Home },
  { href: "/en/corporate-travel", label: "Corporate Travel", icon: Briefcase },
  { href: "/en/luxury-travel", label: "Luxury Travel", icon: Palmtree },
  { href: "/en/visa-services", label: "Visa Services", icon: FileText },
  { href: "/en/contact", label: "Contact Us", icon: Phone },
  { href: "/en/quote", label: "Get a Quote", icon: MessageSquare },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center py-20">
        <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-4">
          404
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
          Page Not Found
        </h1>
        <p className="text-brand-navy/60 text-lg mb-10 max-w-lg mx-auto">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved. Try one of the links below or contact us directly.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-brand-navy/10 bg-white hover:shadow-lg hover:border-brand-gold/30 transition-all text-sm font-medium text-brand-navy"
            >
              <link.icon className="h-5 w-5 text-brand-gold" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/35799478073"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
          >
            WhatsApp Us
          </a>
          <a
            href="tel:+35799478073"
            className="inline-flex items-center rounded-full border border-brand-navy/20 px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5 transition-colors"
          >
            Call +357 99 478 073
          </a>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/corporate", label: "Corporate Travel" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services#flights", label: "Flight Booking" },
  { href: "/services#hotels", label: "Hotel Reservations" },
  { href: "/visas", label: "Visa Assistance" },
  { href: "/luxury", label: "Luxury Travel" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Logo + Tagline + Accreditation */}
          <div className="space-y-4">
            <Image
              src="/images/jetset-logo.svg"
              alt="JetSet Travel Cyprus"
              width={140}
              height={40}
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="text-sm text-white/70 leading-relaxed">
              Your trusted travel partner in Cyprus. Premium travel services for
              corporate and leisure clients since 2007.
            </p>
            <div className="text-xs text-white/50 space-y-1">
              <p>IATA Accredited Agent</p>
              <p>Cyprus Tourism Organisation Licensed</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a
                  href="tel:+35725123456"
                  className="hover:text-brand-gold transition-colors"
                >
                  +357 25 123 456
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@jetsettravel.cy"
                  className="hover:text-brand-gold transition-colors"
                >
                  info@jetsettravel.cy
                </a>
              </li>
              <li className="leading-relaxed">Limassol, Cyprus</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar: copyright + social icons */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} JetSet Travel Cyprus. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/35799478073"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <Image
                src="/images/icons/whatsapp.svg"
                alt="WhatsApp"
                width={20}
                height={20}
                className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="https://t.me/jetsettravelcy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <Image
                src="/images/icons/telegram.svg"
                alt="Telegram"
                width={20}
                height={20}
                className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="viber://chat?number=35799478073"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Viber"
            >
              <Image
                src="/images/icons/viber.svg"
                alt="Viber"
                width={20}
                height={20}
                className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

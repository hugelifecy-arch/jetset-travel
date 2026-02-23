"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe } from "lucide-react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/corporate", label: "Corporate" },
  { href: "/luxury", label: "Luxury" },
  { href: "/visas", label: "Visas" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "RU">("EN");

  return (
    <header className="sticky top-0 z-50 bg-brand-navy border-b-2 border-brand-gold">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/jetset-logo.svg"
              alt="JetSet Travel Cyprus"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-white/80 hover:text-brand-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: language toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <Globe className="h-4 w-4 text-white/60" />
              <button
                onClick={() => setLang("EN")}
                className={`px-1.5 py-0.5 rounded text-xs font-medium transition-colors ${
                  lang === "EN"
                    ? "text-brand-gold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                EN
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => setLang("RU")}
                className={`px-1.5 py-0.5 rounded text-xs font-medium transition-colors ${
                  lang === "RU"
                    ? "text-brand-gold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                RU
              </button>
            </div>

            <Link
              href="/contact"
              className="rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-brand-navy">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-base font-medium text-white/80 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-white/60" />
                <button
                  onClick={() => setLang("EN")}
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    lang === "EN" ? "text-brand-gold" : "text-white/60"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("RU")}
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    lang === "RU" ? "text-brand-gold" : "text-white/60"
                  }`}
                >
                  RU
                </button>
              </div>

              <Link
                href="/contact"
                className="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy"
                onClick={() => setMobileOpen(false)}
              >
                Get a Quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

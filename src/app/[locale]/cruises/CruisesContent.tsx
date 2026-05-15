"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Globe,
  Package,
  MessageSquare,
  BadgeCheck,
  Tag,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Calendar,
  MapPin,
  Ship,
  Users,
  Heart,
  Compass,
  Waves,
  Briefcase,
  Anchor,
  Phone,
  Send,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Accordion from "@/components/ui/Accordion";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const tier1Lines = [
  { name: "Royal Caribbean", logo: "/images/cruise-logos/royal-caribbean.png" },
  { name: "MSC Cruises", logo: "/images/cruise-logos/msc-cruises.png" },
  { name: "Norwegian Cruise Line", logo: "/images/cruise-logos/norwegian.png" },
  { name: "Carnival Cruise Line", logo: "/images/cruise-logos/carnival.png" },
  { name: "Princess Cruises", logo: "/images/cruise-logos/princess.png" },
  { name: "Celebrity Cruises", logo: "/images/cruise-logos/celebrity.png" },
];

const tier2Lines = [
  { name: "Costa Cruises", logo: "/images/cruise-logos/costa.png" },
  { name: "Holland America Line", logo: "/images/cruise-logos/holland-america.png" },
  { name: "Disney Cruise Line", logo: "/images/cruise-logos/disney.png" },
  { name: "Explora Journeys", logo: "/images/cruise-logos/explora-journeys.png" },
];

const tier3Lines = [
  { name: "Cunard", logo: "/images/cruise-logos/cunard.png" },
  { name: "Oceania", logo: "/images/cruise-logos/oceania.png" },
  { name: "Azamara", logo: "/images/cruise-logos/azamara.png" },
  { name: "Windstar", logo: "/images/cruise-logos/windstar.png" },
  { name: "Silversea", logo: "/images/cruise-logos/silversea.png" },
  { name: "Seabourn", logo: "/images/cruise-logos/seabourn.png" },
  { name: "Celestyal", logo: "/images/cruise-logos/celestyal.png" },
  { name: "Virgin Voyages", logo: "/images/cruise-logos/virgin-voyages.png" },
  { name: "P&O Cruises", logo: "/images/cruise-logos/po-cruises.png" },
  { name: "Ponant", logo: "/images/cruise-logos/ponant.png" },
];

const destinations = [
  "caribbean", "med", "alaska", "northern", "asia",
  "australia", "southAmerica", "middleEast", "worldCruises",
] as const;

const destinationImages: Record<(typeof destinations)[number], string> = {
  caribbean: "/images/destinations/caribbean.jpg",
  med: "/images/destinations/med.jpg",
  alaska: "/images/destinations/alaska.jpg",
  northern: "/images/destinations/northern.jpg",
  asia: "/images/destinations/asia.jpg",
  australia: "/images/destinations/australia.jpg",
  southAmerica: "/images/destinations/south-america.jpg",
  middleEast: "/images/destinations/middle-east.jpg",
  worldCruises: "/images/destinations/world-cruises.jpg",
};

const newShips = [
  { line: "Royal Caribbean", ship: "Legend of the Seas", pax: "7,600", cls: "Icon Class", when: "July 2026", detail: "World's largest ship. 28 restaurants, Category 6 waterpark, Crown's Edge skywalk.", sails: "Barcelona, Rome, Fort Lauderdale" },
  { line: "Norwegian", ship: "Norwegian Luna", pax: "3,571", cls: "Prima Plus Class", when: "March 2026", detail: "The Haven (123 suites), Aqua Slidecoaster, 10-story Drop slide.", sails: "Caribbean, Mediterranean" },
  { line: "MSC", ship: "MSC World Asia", pax: "6,758", cls: "World Class", when: "2026", detail: "Asia-focused mega-ship for the Pacific region.", sails: "Asia-Pacific" },
  { line: "Viking", ship: "Viking Libra", pax: "998", cls: "First hydrogen-powered cruise ship", when: "December 2026", detail: "Zero-emission capable. Industry-leading sustainability.", sails: "Mediterranean, Northern Europe" },
  { line: "Disney", ship: "Disney Adventure", pax: "6,700", cls: "Homeporting Singapore", when: "2026", detail: "Largest international Disney ship. 7 themed zones.", sails: "Year-round Asia" },
  { line: "Regent", ship: "Seven Seas Prestige", pax: "850", cls: "First Prestige Class", when: "December 2026", detail: "40% more space per guest. All-inclusive ultra-luxury.", sails: "Caribbean, Mediterranean" },
  { line: "Explora Journeys", ship: "Explora III", pax: "~1,000", cls: "Wellness-focused luxury", when: "2026", detail: "Mediterranean, Northern Europe, Iceland, Greenland.", sails: "Mediterranean, Northern Europe" },
  { line: "Four Seasons", ship: "Four Seasons I", pax: "190", cls: "Ultra-luxury yacht", when: "Spring 2026", detail: "The most exclusive new ship at sea.", sails: "Mediterranean, Greek Islands" },
  { line: "Celebrity", ship: "Celebrity Xcel", pax: "3,276", cls: "Edge Class", when: "2026", detail: "Caribbean debut, European summer. 110-day Grand Voyage option.", sails: "Caribbean, Europe" },
  { line: "Windstar", ship: "Star Seeker", pax: "224", cls: "First new-build in history", when: "2026", detail: "All-suite yacht for intimate voyages.", sails: "Caribbean, Alaska, Japan, SE Asia" },
];

const cruiseTypes = [
  { key: "family", icon: Users },
  { key: "luxuryCruise", icon: Ship },
  { key: "romance", icon: Heart },
  { key: "adventure", icon: Compass },
  { key: "river", icon: Waves },
  { key: "groupCruise", icon: Briefcase },
  { key: "worldCruiseType", icon: Anchor },
] as const;

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                   */
/* ------------------------------------------------------------------ */

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const numericTarget = parseInt(target.replace(/[^0-9]/g, ""), 10) || 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = numericTarget / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numericTarget) {
              setCount(numericTarget);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [numericTarget]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function CruisesContent({ locale }: { locale: string }) {
  const t = useTranslations("cruisesPage");
  const [shipScrollIdx, setShipScrollIdx] = useState(0);
  const shipContainerRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    destination: "",
    cruiseLine: "",
    dates: "",
    duration: "",
    adults: "2",
    children: "0",
    cabin: "",
    budget: "",
    occasion: "",
    requirements: "",
    website: "", // honeypot
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const scrollShips = useCallback((dir: "left" | "right") => {
    const container = shipContainerRef.current;
    if (!container) return;
    const cardWidth = 320;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const newScroll = dir === "left"
      ? Math.max(0, container.scrollLeft - cardWidth)
      : Math.min(maxScroll, container.scrollLeft + cardWidth);
    container.scrollTo({ left: newScroll, behavior: "smooth" });
    setShipScrollIdx(Math.round(newScroll / cardWidth));
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    try {
      const res = await fetch("/api/cruise-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _formLoadedAt: Date.now() }),
      });
      if (res.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const whyCards = [
    { key: "whyGlobal", icon: Globe },
    { key: "whyPackages", icon: Package },
    { key: "whyExpert", icon: MessageSquare },
    { key: "whyIata", icon: BadgeCheck },
    { key: "whyPrice", icon: Tag },
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* SECTION 1: Hero                                               */}
      {/* ============================================================ */}
      <section className="relative bg-brand-navy text-white min-h-[380px] flex items-center overflow-hidden">
        <Image
          src="/images/services/cruises.jpg"
          alt={t("heroImageAlt")}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative w-full py-24 lg:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-6">
              {t("heroLabel")}
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-10">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href="#cruise-enquiry"
                className="inline-flex items-center rounded-full bg-brand-gold px-8 py-4 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors shadow-lg hover:shadow-xl"
              >
                {t("heroCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="tel:+35799478073"
                className="inline-flex items-center rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <Phone className="mr-2 h-4 w-4" />
                {t("heroCall")}
              </a>
            </div>
            {/* Stats ticker */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50">
              <span>{t("statPassengers")}</span>
              <span className="hidden sm:inline" aria-hidden="true">|</span>
              <span>{t("statLines")}</span>
              <span className="hidden sm:inline" aria-hidden="true">|</span>
              <span>{t("statDestinations")}</span>
              <span className="hidden sm:inline" aria-hidden="true">|</span>
              <span>{t("statDepartures")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: Why Book with JetSet                               */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("whyTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("whySubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whyCards.map((card) => (
              <div
                key={card.key}
                className="group p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold mb-5 group-hover:bg-brand-gold group-hover:text-white transition-colors mx-auto">
                  <card.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {t(`${card.key}Title`)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(`${card.key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: Cruise Lines                                       */}
      {/* ============================================================ */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("cruiseLinesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("cruiseLinesSubtitle")}
            </p>
          </div>

          {/* Tier 1 — Large logos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
            {tier1Lines.map((line) => (
              <a
                key={line.name}
                href="#cruise-enquiry"
                className="group flex items-center justify-center p-4 rounded-xl bg-white border border-brand-navy/10 hover:border-brand-gold/40 hover:shadow-luxury transition-all"
                title={`${t("enquireAbout")} ${line.name}`}
              >
                <div className="relative h-14 w-full">
                  <Image
                    src={line.logo}
                    alt={line.name}
                    fill
                    sizes="(max-width: 640px) 40vw, (max-width: 1024px) 28vw, 140px"
                    className="object-contain group-hover:scale-105 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </a>
            ))}
          </div>

          {/* Tier 2 — Medium logos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {tier2Lines.map((line) => (
              <a
                key={line.name}
                href="#cruise-enquiry"
                className="group flex items-center justify-center p-4 rounded-xl bg-white border border-brand-navy/10 hover:border-brand-gold/40 hover:shadow-card transition-all"
                title={`${t("enquireAbout")} ${line.name}`}
              >
                <div className="relative h-14 w-full">
                  <Image
                    src={line.logo}
                    alt={line.name}
                    fill
                    sizes="(max-width: 640px) 40vw, 200px"
                    className="object-contain group-hover:scale-105 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </a>
            ))}
          </div>

          {/* Tier 3 — "We also book" grid */}
          <div>
            <p className="text-sm font-semibold text-brand-navy/50 uppercase tracking-wider mb-4 text-center">
              {t("alsoBook")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {tier3Lines.map((line) => (
                <a
                  key={line.name}
                  href="#cruise-enquiry"
                  className="group flex items-center justify-center p-4 rounded-xl bg-white border border-brand-navy/5 hover:border-brand-gold/30 transition-all"
                  title={`${t("enquireAbout")} ${line.name}`}
                >
                  <div className="relative h-12 w-full">
                    <Image
                      src={line.logo}
                      alt={line.name}
                      fill
                      sizes="(max-width: 640px) 40vw, (max-width: 1024px) 28vw, 180px"
                      className="object-contain group-hover:scale-105 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: Explore by Destination                             */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("destinationsTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("destinationsSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <a
                key={dest}
                href="#cruise-enquiry"
                className="group rounded-2xl overflow-hidden border border-brand-navy/10 hover:shadow-luxury transition-all"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={destinationImages[dest]}
                    alt={t(`${dest}Title`)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-white text-lg font-display font-bold drop-shadow-lg">
                    {t(`${dest}Title`)}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-brand-navy mb-2">
                    {t(`${dest}Title`)}
                  </h3>
                  <p className="text-brand-navy/60 text-sm leading-relaxed mb-4">
                    {t(`${dest}Desc`)}
                  </p>
                  <div className="flex flex-col gap-1.5 text-xs text-brand-navy/50">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-brand-gold" />
                      {t("bestSeason")}: {t(`${dest}Season`)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-brand-gold" />
                      {t(`${dest}Ports`)}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: New Ships 2026                                     */}
      {/* ============================================================ */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("newShipsTitle")}
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              {t("newShipsSubtitle")}
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center justify-end gap-2 mb-6">
            <button
              onClick={() => scrollShips("left")}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/20 hover:bg-white/10 transition-colors"
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollShips("right")}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/20 hover:bg-white/10 transition-colors"
              aria-label="Scroll right"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Horizontal scrollable cards */}
          <div
            ref={shipContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {newShips.map((ship) => (
              <div
                key={ship.ship}
                className="flex-shrink-0 w-[300px] sm:w-[320px] snap-start rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"
              >
                <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">
                  {ship.line}
                </p>
                <h3 className="text-xl font-bold mb-1">{ship.ship}</h3>
                <p className="text-white/50 text-xs mb-4">
                  {ship.pax} {t("passengers")} &middot; {ship.cls}
                </p>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {ship.detail}
                </p>
                <div className="flex flex-col gap-1.5 text-xs text-white/50">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-gold" />
                    {t("scheduledDebut")}: {ship.when}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-brand-gold" />
                    {ship.sails}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: Cruise Types / Experiences                         */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("cruiseTypesTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("cruiseTypesSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cruiseTypes.map((type) => (
              <a
                key={type.key}
                href="#cruise-enquiry"
                className="group p-6 rounded-2xl border border-brand-navy/10 hover:shadow-luxury hover:border-brand-gold/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold mb-5 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <type.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {t(`${type.key}Title`)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(`${type.key}Desc`)}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7: How It Works                                       */}
      {/* ============================================================ */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("howItWorksTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("howItWorksSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold text-brand-navy font-bold text-xl mb-6">
                  {step}
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-3">
                  {t(`step${step}Title`)}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  {t(`step${step}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8: Cruise Enquiry Form                                */}
      {/* ============================================================ */}
      <section id="cruise-enquiry" className="py-20 bg-white scroll-mt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("formTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("formSubtitle")}
            </p>
          </div>

          {formStatus === "success" ? (
            <div className="text-center py-12 bg-brand-light rounded-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                <Check className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold text-brand-navy mb-2">{t("formSuccess")}</p>
              <p className="text-brand-navy/60 text-sm">{t("formPreferCall")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleFormChange}
                />
              </div>

              {/* Personal details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cruise-name" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formName")} *</label>
                  <input
                    id="cruise-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder={t("namePlaceholder")}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="cruise-email" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formEmail")} *</label>
                  <input
                    id="cruise-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder={t("emailPlaceholder")}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="cruise-phone" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formPhone")}</label>
                  <input
                    id="cruise-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder={t("phonePlaceholder")}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="cruise-country" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formCountry")}</label>
                  <input
                    id="cruise-country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleFormChange}
                    placeholder={t("countryPlaceholder")}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Cruise preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cruise-destination" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formDestination")}</label>
                  <select
                    id="cruise-destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors bg-white"
                  >
                    <option value="">{t("destNotSure")}</option>
                    {destinations.map((d) => (
                      <option key={d} value={d}>{t(`${d}Title`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="cruise-line" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formCruiseLine")}</label>
                  <select
                    id="cruise-line"
                    name="cruiseLine"
                    value={formData.cruiseLine}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors bg-white"
                  >
                    <option value="">{t("lineNotSure")}</option>
                    <option value="any">{t("lineAny")}</option>
                    {[...tier1Lines, ...tier2Lines].map((l) => (
                      <option key={l.name} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="cruise-dates" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formDates")}</label>
                  <input
                    id="cruise-dates"
                    name="dates"
                    type="text"
                    value={formData.dates}
                    onChange={handleFormChange}
                    placeholder={t("datesPlaceholder")}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="cruise-duration" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formDuration")}</label>
                  <select
                    id="cruise-duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors bg-white"
                  >
                    <option value="">{t("lineNotSure")}</option>
                    <option value="3-5">{t("duration3_5")}</option>
                    <option value="7">{t("duration7")}</option>
                    <option value="10-14">{t("duration10_14")}</option>
                    <option value="15+">{t("duration15plus")}</option>
                    <option value="world">{t("durationWorld")}</option>
                  </select>
                </div>
              </div>

              {/* Guests & cabin */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="cruise-adults" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formAdults")}</label>
                  <input
                    id="cruise-adults"
                    name="adults"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.adults}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="cruise-children" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formChildren")}</label>
                  <input
                    id="cruise-children"
                    name="children"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.children}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="cruise-cabin" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formCabin")}</label>
                  <select
                    id="cruise-cabin"
                    name="cabin"
                    value={formData.cabin}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors bg-white"
                  >
                    <option value="">{t("cabinNotSure")}</option>
                    <option value="inside">{t("cabinInside")}</option>
                    <option value="ocean-view">{t("cabinOceanView")}</option>
                    <option value="balcony">{t("cabinBalcony")}</option>
                    <option value="suite">{t("cabinSuite")}</option>
                    <option value="haven">{t("cabinHaven")}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cruise-budget" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formBudget")}</label>
                  <select
                    id="cruise-budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors bg-white"
                  >
                    <option value="">{t("budgetFlexible")}</option>
                    <option value="under-1k">{t("budgetUnder1k")}</option>
                    <option value="1k-2500">{t("budget1k_2500")}</option>
                    <option value="2500-5k">{t("budget2500_5k")}</option>
                    <option value="5k-10k">{t("budget5k_10k")}</option>
                    <option value="10k+">{t("budget10kPlus")}</option>
                  </select>
                </div>
              </div>

              {/* Occasion & requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cruise-occasion" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formOccasion")}</label>
                  <select
                    id="cruise-occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors bg-white"
                  >
                    <option value="">{t("occasionNone")}</option>
                    <option value="honeymoon">{t("occasionHoneymoon")}</option>
                    <option value="anniversary">{t("occasionAnniversary")}</option>
                    <option value="birthday">{t("occasionBirthday")}</option>
                    <option value="group">{t("occasionGroup")}</option>
                    <option value="other">{t("occasionOther")}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cruise-requirements" className="block text-sm font-semibold text-brand-navy mb-1.5">{t("formRequirements")}</label>
                  <textarea
                    id="cruise-requirements"
                    name="requirements"
                    rows={1}
                    value={formData.requirements}
                    onChange={handleFormChange}
                    placeholder={t("requirementsPlaceholder")}
                    className="w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="inline-flex items-center rounded-full bg-brand-gold px-10 py-4 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors disabled:opacity-60 shadow-lg"
                >
                  {formStatus === "submitting" ? (
                    <>{t("formSubmitting")}</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t("formSubmit")}
                    </>
                  )}
                </button>
                {formStatus === "error" && (
                  <p className="mt-4 text-red-600 text-sm">{t("formError")}</p>
                )}
                <p className="mt-4 text-brand-navy/50 text-sm">{t("formPreferCall")}</p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9: Industry Stats Bar                                 */}
      {/* ============================================================ */}
      <section className="py-16 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">{t("statsTitle")}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[1, 2, 3, 4].map((i) => {
              const val = t(`stat${i}Value`);
              const suffix = val.replace(/[0-9]/g, "");
              return (
                <div key={i}>
                  <p className="text-4xl md:text-5xl font-bold text-brand-gold mb-2">
                    <AnimatedCounter target={val} suffix={suffix} />
                  </p>
                  <p className="text-white/60 text-sm">{t(`stat${i}Label`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 10: FAQ                                               */}
      {/* ============================================================ */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t("faqTitle")}
            </h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">
              {t("faqSubtitle")}
            </p>
          </div>
          <Accordion
            items={Array.from({ length: 12 }, (_, i) => ({
              question: t(`faq${i + 1}Q`),
              answer: t(`faq${i + 1}A`),
            }))}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* Disclaimer + Final CTA                                        */}
      {/* ============================================================ */}
      <section className="py-4 bg-white border-t border-brand-navy/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-brand-navy/40 text-center leading-relaxed">
            {t("disclaimer")}
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#cruise-enquiry"
              className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              {t("ctaQuote")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/35799478073?text=${locale === "ru" ? encodeURIComponent("Здравствуйте, меня интересует бронирование круиза.") : encodeURIComponent("Hi, I'm interested in booking a cruise.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {t("ctaWhatsApp")}
            </a>
          </div>
        </div>
      </section>

      {/* Schema.org FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: Array.from({ length: 12 }, (_, i) => ({
              "@type": "Question",
              name: t(`faq${i + 1}Q`),
              acceptedAnswer: {
                "@type": "Answer",
                text: t(`faq${i + 1}A`),
              },
            })),
          }),
        }}
      />

    </>
  );
}

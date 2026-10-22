import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-navy": "#1B2A4A",
        "brand-gold": "#C9A84C",
        // Gold for TEXT on white / light backgrounds. brand-gold text on white
        // is 2.3:1; this darker gold is 5.7:1 on white and 5.1:1 on
        // brand-light (WCAG AA 4.5:1). On navy, keep brand-gold (6.2:1).
        "brand-gold-ink": "#7D6319",
        "brand-light": "#EBF2FA",
        "brand-dark": "#0F1A2E",
      },
      fontFamily: {
        // Cyrillic subsets follow the brand faces; per-glyph fallback routes
        // only Cyrillic text to them (DM Sans has no Cyrillic).
        sans: [
          "var(--font-dm-sans)",
          "var(--font-inter-cyrillic)",
          "DM Sans",
          "sans-serif",
        ],
        display: [
          "var(--font-playfair)",
          "var(--font-playfair-cyrillic)",
          "Playfair Display",
          "serif",
        ],
      },
      boxShadow: {
        luxury: "0 4px 20px rgba(27, 42, 74, 0.15)",
        card: "0 2px 12px rgba(27, 42, 74, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

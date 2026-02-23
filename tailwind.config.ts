import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-navy": "#1B2A4A",
        "brand-gold": "#C9A84C",
        "brand-light": "#EBF2FA",
        "brand-dark": "#0F1A2E",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
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

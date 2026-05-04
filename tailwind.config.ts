import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        app: "var(--bg-app)",
        card: "var(--bg-card)",
        tertiary: "var(--bg-tertiary)",
        hover: "var(--bg-hover)",
        default: "var(--border-default)",
        active: "var(--border-active)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        "app-reverse": "var(--text-app)",
        gold: {
          DEFAULT: "var(--gold)",
          dim: "var(--gold-dim)",
          bg: "var(--gold-bg)",
        },
      },
      fontFamily: {
        amiri: ["Amiri", "serif"],
        scheherazade: ["Scheherazade New", "serif"],
        uthmani: ["Uthmanic", "serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

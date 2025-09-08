import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        brand: {
          primary: "#16a34a",
          hover: "#14532d",
          ring: "#34d399",
        },
        surface: {
          1: "#0b0f14",
          2: "#0f1620",
          3: "#141b26",
        },
      },
      boxShadow: {
        'glow': "0 0 0 1px rgba(52, 211, 153, .20), 0 0 24px rgba(52,211,153,.10)",
      },
      keyframes: {
        "light-flow": {
          "0%": { transform: "translateY(-100%)", opacity: "0%" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0%" },
        },
      },
      animation: {
        "light-flow": "light-flow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
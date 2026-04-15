import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff8f1",
          100: "#ffedd8",
          200: "#ffd7ae",
          300: "#ffb978",
          400: "#ff8e3c",
          500: "#ff741a",
          600: "#f0560c",
          700: "#c73f0c",
          800: "#9e3411",
          900: "#7f2d12"
        },
        accent: {
          orange: "#ff8a00",
          yellow: "#ffc107",
          mist: "#fffcf8",
          slate: "#2b2b2b"
        }
      },
      boxShadow: {
        panel: "0 22px 60px rgba(26, 47, 42, 0.12)"
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f48323",
        dark: "#3c414c",
        titleBar: "#31343c",
        text: "#5a5a61",
        link: "#414141",
        muted: "#8a8d94",
        border: "#e9e9e9",
        surface: "#ffffff",
        surfaceAlt: "#fafafa",
        surfaceSoft: "#fbfbfb",
        footer: "#3c414c",
        footerBottom: "#2c2f36",

        ink: "#3c414c",
        stone: "#5a5a61",
        paper: "#ffffff",
        "paper-alt": "#fafafa",
        charcoal: "#3c414c",
        brand: {
          DEFAULT: "#3c414c",
          light: "#5a5a61",
          950: "#2c2f36",
          accent: "#f48323",
          "accent-dark": "#d9701a"
        }
      },
      fontFamily: {
        heading: ["var(--font-roboto)", "sans-serif"],
        body: ["var(--font-ubuntu)", "sans-serif"],
        accent: ["var(--font-abril)", "serif"]
      },
      borderRadius: {
        card: "10px",
        pill: "30px"
      }
    }
  },
  plugins: []
};

export default config;

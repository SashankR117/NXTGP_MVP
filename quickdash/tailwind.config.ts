import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blinkit: {
          yellow: "#F4C430",
          "yellow-light": "#FFF9E6",
          green: "#0C831F",
          "green-hover": "#096918",
          "green-light": "#E8F5E9",
          bg: "#F4F5F8",
          card: "#FFFFFF",
          border: "#E5E7EB",
          dark: "#1F2937",
          gray: "#6B7280",
          "gray-light": "#9CA3AF",
          badge: "#F3F4F6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        blinkit: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "blinkit-lg": "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

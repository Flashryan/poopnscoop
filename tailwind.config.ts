import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#14110f",
        grass: "#1b5e3a",
        clay: "#b35b2b",
        cream: "#f7f2ea",
        fog: "#e6ded3",
        sky: "#d7e7ef",
      },
    },
  },
  plugins: [],
};

export default config;

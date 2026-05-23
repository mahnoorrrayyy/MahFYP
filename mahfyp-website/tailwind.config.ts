import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:  "#FDFAF7",
        plum: {
          50:  "#F9F4F8",
          100: "#F0E2EC",
          200: "#DEB9D1",
          500: "#A0527E",
          700: "#6E2B55",
          900: "#2D1133",
        },
        gold: "#C9956C",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
      },
        colors: {
          sidebar: {
            DEFAULT: "#0f172a",
            hover: "#1e293b",
            active: "#2d6a4f",
          },
          accent: {
            DEFAULT: "#2d6a4f",
            light: "#d8f3dc",
          },
        },
      boxShadow: {
        card: "0 4px 24px rgba(15, 23, 42, 0.06)",
        soft: "0 2px 12px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

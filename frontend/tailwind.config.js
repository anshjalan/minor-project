/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f5f9",
          100: "#dce7ef",
          500: "#0f766e",
          600: "#0b5f59",
          700: "#134e4a",
          900: "#0f172a"
        },
        accent: "#f97316"
      },
      boxShadow: {
        card: "0 18px 40px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};


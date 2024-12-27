/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "custom-dark1": "#2a2a2a",
        "custom-dark2": "#2e2e2e",
      },
      colors: {
        "dark-blue": "#04074F",
        "blue1": "#213478",
        "blue2": "#483B70",
        "btn-blue1": "#243A73",
        "btn-blue2": "#446ED9",
        "btn-red1": "#F13B3B",
        "btn-red2": "#732424",
        "form-pink": "#A23951"
      },
    },
  },
  plugins: [],
};

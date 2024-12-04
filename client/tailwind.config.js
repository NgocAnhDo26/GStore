/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "custom-dark1": "#2a2a2a",
        "custom-dark2": "#2e2e2e",
      },
    },
  },
  plugins: [],
};

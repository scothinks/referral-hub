/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        opera: {
          red: '#cc0f16',
          'red-dark': '#a50c12',
          'red-light': 'rgba(204, 15, 22, 0.1)'
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      maxHeight: {
        'filter-menu': '500px'
      },
      width: {
        'filter-menu': '320px'
      },
      spacing: {
        'filter-spacing': '1.5rem'
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#07174a',
        red: {
          DEFAULT: '#c02031',
          600: '#a01828',
        },
        'red-glow': 'rgba(192, 32, 49, 0.4)',
        'off-white': '#f8f9fc',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

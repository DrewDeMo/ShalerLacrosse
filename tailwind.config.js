/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        navy: '#061649',
        red: {
          DEFAULT: '#ad1d34',
          600: '#8a1729',
          light: '#c92744',
        },
        'red-glow': 'rgba(173, 29, 52, 0.4)',
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

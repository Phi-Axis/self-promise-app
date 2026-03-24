/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#faf8f6',
          100: '#f5f1ed',
          200: '#ebe4dd',
          300: '#e1d7cc',
          400: '#d7cabb',
          500: '#cdbaaa',
          600: '#c3ad99',
          700: '#b99a88',
          800: '#af8777',
          900: '#a57466',
        },
      },
    },
  },
  plugins: [],
}

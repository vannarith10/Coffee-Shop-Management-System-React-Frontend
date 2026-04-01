/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add your coffee-shop colors, fonts, etc. here later
      colors: {
        primary: '#14b83d',
        'background-light': '#f6f8f6',
        'background-dark': '#112115',
        'coffee-accent': '#7c2d12',
        'cream-accent': '#fef3c7',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
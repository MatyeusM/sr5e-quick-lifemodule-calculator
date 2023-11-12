/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['"Exo 2"', 'sans-serif'],
    },
    minWidth: {
      '1/3': '33%',
    },
    extend: {},
  },
  plugins: [],
}

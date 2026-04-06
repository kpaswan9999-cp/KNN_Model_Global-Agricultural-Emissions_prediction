/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B4332',
        secondary: '#2D6A4F',
        accent: '#F4A261',
        background: '#0A1612',
        surface: '#132E23',
        text: '#E8F5E9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

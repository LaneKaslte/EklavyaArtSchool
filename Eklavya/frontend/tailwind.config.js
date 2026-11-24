/** @type {import('tailwindcss').Config} */
// Mahabharata palette: parchment & teak ink, kumkum red, temple gold,
// peacock green, Krishna indigo, maroon silk, peacock blue.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"EB Garamond"', 'Georgia', 'serif'],
        hand: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        deva: ['"Tiro Devanagari Sanskrit"', '"Noto Serif Devanagari"', 'serif'],
      },
      colors: {
        white: '#FBF6EA',
        paper: '#F4EAD5',
        ink: '#2A1D14',
        gold: '#C08A2E',
        paint: {
          coral: '#A8392A',
          marigold: '#C08A2E',
          teal: '#2F6B5E',
          violet: '#2F3E6E',
          sky: '#2D5F7A',
          rose: '#7B2D3B',
        },
      },
    },
  },
  plugins: [],
}

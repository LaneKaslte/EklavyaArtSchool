/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Mukta', 'system-ui', 'sans-serif'],
        hand: ['"Yatra One"', 'Georgia', 'serif'],
      },
      colors: {
        // Mahabharat theme: parchment, kumkum maroon, saffron, temple gold, peacock blue.
        // Token names are kept from the earlier palette so every page picks up the theme.
        paper: '#FBF3E2', // aged parchment
        ink: '#2A0F0F', // deep kumkum brown
        paint: {
          coral: '#D9631E', // saffron (bhagwa)
          marigold: '#C8962E', // temple gold
          teal: '#1D6A72', // peacock feather
          violet: '#8C1C33', // royal maroon
          sky: '#2C4F8C', // Krishna blue
          rose: '#C24E72', // lotus
        },
      },
    },
  },
  plugins: [],
}

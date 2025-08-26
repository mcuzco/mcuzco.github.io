/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sand': '#F4EAE0',
        'champagne': '#F7EFE5',
        'taupe': '#B8AFA0',
        'mushroom': '#A49A8F',
        'sage-green': '#A3B18A',
        'moss-green': '#8A9A5B',
        'terracotta': '#E2725B',
        'charcoal-gray': '#36454F',
      },
    },
  },
  plugins: [],
}
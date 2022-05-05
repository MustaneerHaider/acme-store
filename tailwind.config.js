module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        quick: ['Quicksand', 'san-serif'],
        roboto: ['Roboto Slab', 'san-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}

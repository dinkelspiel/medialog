/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        'color': '#FFFBFE',
        'card': '#FAF1F0',
        'secondary': '#E6BEB7',
        'secondary-hover': '#DFADA4',
        'secondary-active': '#EBCCC6'
      },
      lineHeight: {
        '13': '3.25rem',
      }
    },
  },
  plugins: [],
}


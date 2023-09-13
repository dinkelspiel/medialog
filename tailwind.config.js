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
        'secondary': '#d1857b',
        'secondary-hover': '#c6685d',
        'secondary-active': '#d6938a'
      },
      lineHeight: {
        '13': '3.25rem',
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue"
  ],
  theme: {
    extend: {
      colors: {
        'color': '#FFFBFE',
        'card': '#FAF1F0',
        'card-hover': '#F2DBD9',
        'card-active': '#EDCDC9',
        'secondary': '#d1857b',
        'secondary-hover': '#c6685d',
        'secondary-active': '#d6938a',
        'outline': '#E6BEB7',
        'modal': 'rgba(15, 23, 42, 0.3)'
      },
      lineHeight: {
        '13': '3.25rem',
      }
    },
  },
  plugins: [],
}


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
        'card': '#FAF1F0'
      },
    },
  },
  plugins: [],
}


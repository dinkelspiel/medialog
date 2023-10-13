/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue"
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'background': '#FFFBFE',
        'card': '#FAF1F0',
        'card-hover': '#F2DBD9',
        'card-active': '#EDCDC9',
        'secondary': '#d1857b',
        'secondary-hover': '#c6685d',
        'secondary-active': '#d6938a',
        'outline': '#E6BEB7',
        'text': '#1C1B1F',
        'text-gray': '#A3A3A3',
        'modal': 'rgba(15, 23, 42, 0.3)',
        dark: {
            'background': '#0C111E',
            'card': '#181D29',
            'card-hover': '#222939',
            'card-active': '#0e121a',
            'secondary': '#5A55EC',
            'secondary-hover': '#6763f0',
            'secondary-active': '#433fd4',
            'outline': '#394155',
            'text': '#F3F2FF',
            'text-gray': '#8A91A1',
            'modal': 'rgba(15, 23, 42, 0.3)',
        }
      },
      lineHeight: {
        '13': '3.25rem',
      }
    },
  },
  plugins: [],
}


import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        'dm-serif': ['"DM Serif Display"', 'serif'],
        geist: ['Geist', 'sans-serif'],
      },
      colors: {
        'base-50': 'rgba(var(--base-50), var(--tw-bg-opacity, 1))',
        'base-100': 'rgba(var(--base-100), var(--tw-bg-opacity, 1))',
        'base-200': 'rgba(var(--base-200), var(--tw-bg-opacity, 1))',
        'base-300': 'rgba(var(--base-300), var(--tw-bg-opacity, 1))',
        'base-400': 'rgba(var(--base-400), var(--tw-bg-opacity, 1))',
        'base-500': 'rgba(var(--base-500), var(--tw-bg-opacity, 1))',
        'base-600': 'rgba(var(--base-600), var(--tw-bg-opacity, 1))',
        'base-700': 'rgba(var(--base-700), var(--tw-bg-opacity, 1))',
        'base-800': 'rgba(var(--base-800), var(--tw-bg-opacity, 1))',
        'base-900': 'rgba(var(--base-900), var(--tw-bg-opacity, 1))',
        'base-950': 'rgba(var(--base-950), var(--tw-bg-opacity, 1))',

        border: 'hsl(var(--base-100))',
        input: 'hsl(var(--base-100))',
        ring: 'hsl(var(--base-950))',
        background: 'hsl(var(--white))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--base-50))',
          foreground: 'hsl(var(--base-900))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--base-500))',
        },
        accent: {
          DEFAULT: 'hsl(var(--base-50))',
          foreground: 'hsl(var(--base-900))',
        },
        popover: {
          DEFAULT: 'hsl(var(--base-50))',
          foreground: 'hsl(var(--base-950))',
        },
        card: {
          DEFAULT: 'hsl(var(--base-50))',
          foreground: 'hsl(var(--base-950))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;

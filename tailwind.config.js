/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F3F8',
          100: '#DDE4EE',
          200: '#C0CDDB',
          300: '#97AABF',
          400: '#7E94AE',
          500: '#5A7090',
          600: '#2A3F5C',
          700: '#1A2D45',
          800: '#0F1F35',
          900: '#081020',
          950: '#0A0F1A',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FAFBFC',
          200: '#F5F7FA',
          300: '#EDF1F6',
        },
        gold: {
          400: '#C0CDDB',
          500: '#97AABF',
          600: '#7E94AE',
          700: '#5A7090',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

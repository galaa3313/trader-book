/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070D',
          900: '#0A0E1A',
          850: '#0E1424',
          800: '#121A2E',
          700: '#1A2238',
          600: '#252E47',
          500: '#3A4361',
          400: '#5A6485',
          300: '#8893B4',
          200: '#B4BDD6',
          100: '#DDE3F2',
        },
        neon: {
          green: '#22F5A2',
          mint: '#7EFFD0',
          cyan: '#5BD7FF',
          blue: '#5B8DFF',
          violet: '#A98BFF',
          pink: '#FF7AC2',
          amber: '#FFC25C',
          red: '#FF5870',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 24px -4px rgba(34, 245, 162, 0.45)',
        'glow-cyan': '0 0 24px -4px rgba(91, 215, 255, 0.45)',
        'glow-violet': '0 0 24px -4px rgba(169, 139, 255, 0.45)',
        'glow-red': '0 0 24px -4px rgba(255, 88, 112, 0.45)',
        'card': '0 8px 32px -8px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'ticker': 'ticker 30s linear infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

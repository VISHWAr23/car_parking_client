/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        emerald: {
          350: '#34d399',
          400: '#10b981',
          500: '#059669',
        },
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(24px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to:   { transform: 'scale(1)',    opacity: '1' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)',    opacity: '1'   },
          '50%':       { transform: 'scale(1.08)', opacity: '0.6' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      animation: {
        'slide-up':   'slide-up 0.3s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':    'fade-in 0.25s ease',
        'scale-in':   'scale-in 0.2s cubic-bezier(0.16,1,0.3,1)',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
        shimmer:      'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080808',
        surface: '#0f0f0f',
        'surface-2': '#161616',
        'surface-3': '#1e1e1e',
        border: '#262626',
        'border-bright': '#333333',
        accent: '#818cf8',
        'accent-2': '#6366f1',
        'accent-dim': 'rgba(99,102,241,0.12)',
        muted: '#525252',
        'muted-bright': '#737373',
        fg: '#f5f5f5',
        'fg-dim': '#a3a3a3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}


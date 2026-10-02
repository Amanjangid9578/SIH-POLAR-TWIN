/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        polar: {
          bg: '#0B101D',
          dark: '#080C16',
          card: '#161F33',
          cardHover: '#1c2842',
          surface: '#121A2D',
          border: 'rgba(0, 242, 254, 0.15)',
          borderGlow: 'rgba(0, 242, 254, 0.45)',
          cyan: '#00F2FE',
          blue: '#4FACFE',
          ice: '#70E1F5',
          alert: '#FF4B4B',
          warning: '#FFB800',
          success: '#10B981',
          textMuted: '#8B949E',
          textLight: '#E6EDF3',
          frost: 'rgba(255, 255, 255, 0.04)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace', 'Consolas'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(0, 242, 254, 0.4)',
        'glow-blue': '0 0 20px -5px rgba(79, 172, 254, 0.4)',
        'glow-alert': '0 0 20px -5px rgba(255, 75, 75, 0.4)',
        'glow-warning': '0 0 20px -5px rgba(255, 184, 0, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}

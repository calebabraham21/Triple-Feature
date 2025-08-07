/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cinema-black': '#0a0a0a',
        'cinema-dark': '#1a1a1a',
        'cinema-gray': '#2a2a2a',
        'cinema-light': '#3a3a3a',
        'accent-red': '#ff4444',
        'accent-blue': '#4a9eff',
        'accent-purple': '#8b5cf6',
        'accent-gold': '#fbbf24',
      },
      fontFamily: {
        'cinema': ['Orbitron', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #ff4444, 0 0 10px #ff4444, 0 0 15px #ff4444' },
          '100%': { boxShadow: '0 0 10px #ff4444, 0 0 20px #ff4444, 0 0 30px #ff4444' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

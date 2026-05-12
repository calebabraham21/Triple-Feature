/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial palette
        'paper': '#f9f7f4',      // warm off-white page background
        'frame': '#fdfcfb',      // cards, surfaces, modals
        'ink': '#1e1b18',        // primary text + interactive elements
        'fog': '#847e7a',        // secondary text, metadata
        'ash': '#ccc8c3',        // borders
        'smoke': '#eae8e5',      // subtle dividers, skeleton bg
        'reel': '#221f1c',       // dark hero backgrounds + loading overlay
        // Legacy compat (About/Terms pages still reference these)
        'cinema-black': '#221f1c',
        'cinema-dark': '#2d2926',
        'cinema-gray': '#3d3834',
        'cinema-light': '#4d4844',
        'accent-red': '#c0392b',
        'accent-blue': '#2563eb',
        'accent-purple': '#7c3aed',
        'accent-gold': '#d97706',
      },
      fontFamily: {
        'cinema': ['DM Mono', 'monospace'],
        'sans': ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          'text-shadow': '0 1px 3px rgba(0,0,0,0.35)',
        },
        '.text-shadow': {
          'text-shadow': '0 2px 8px rgba(0,0,0,0.45)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 16px rgba(0,0,0,0.55)',
        },
        '.text-shadow-none': {
          'text-shadow': 'none',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

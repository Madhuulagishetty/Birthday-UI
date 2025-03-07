/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      sans: ['Roboto', 'sans-serif'],
      keyframes: {
        'move-left': {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-10px)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        'move-left': 'move-left 1.5s ease-in-out infinite'
      }
    }

    },
  
  plugins: [],
}
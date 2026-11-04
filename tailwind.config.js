/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        oak: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        forest: {
          50: '#f4f7f5',
          100: '#e5ece7',
          200: '#cdd9d1',
          300: '#a7beb0',
          400: '#7a9d8a',
          500: '#58816a',
          600: '#436653',
          700: '#365243',
          800: '#2c4237',
          900: '#24372e',
          950: '#0e1713',
        },
        slatebg: {
          dark: '#0B0F12',
          card: '#12171D',
          border: '#1F2937',
          hover: '#1B232D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
        'luxury-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.06)',
        'glow-oak': '0 0 25px -5px rgba(34, 197, 94, 0.3)',
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b8d0ff',
          300: '#8bb0ff',
          400: '#5b87ff',
          500: '#3562f6',
          600: '#2547dd',
          700: '#1f39b3',
          800: '#1e348f',
          900: '#1d2f71',
        },
      },
    },
  },
  plugins: [],
};

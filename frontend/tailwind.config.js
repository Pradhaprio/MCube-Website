/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#dfe6ff',
          200: '#c2d0ff',
          300: '#9eb4ff',
          400: '#6f8cff',
          500: '#3b63ff',
          600: '#2248ea',
          700: '#1331ba',
          800: '#0d247f',
          900: '#081957',
          950: '#050d32'
        },
        accent: {
          50: '#fdf8ea',
          100: '#f9efc9',
          200: '#f2df97',
          300: '#ebcb66',
          400: '#e2b94a',
          500: '#d6a531',
          600: '#bb8422',
          700: '#97651c',
          800: '#7b531d',
          900: '#68461d'
        }
      },
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        lift: '0 20px 48px rgba(8, 25, 87, 0.16)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at 18% 20%, rgba(255,255,255,0.18), transparent 26%), radial-gradient(circle at 82% 18%, rgba(230,197,122,0.34), transparent 24%), linear-gradient(135deg, #050d32 0%, #0d247f 48%, #163fd0 100%)'
      }
    }
  },
  plugins: []
};

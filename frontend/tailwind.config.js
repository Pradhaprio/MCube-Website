/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff7f7',
          100: '#d8ecec',
          200: '#b3d9d8',
          300: '#7cbfbc',
          400: '#4ca3a0',
          500: '#2f8786',
          600: '#226d6c',
          700: '#1f5757',
          800: '#1e4748',
          900: '#1d3d3e'
        },
        accent: {
          50: '#fff6ec',
          100: '#ffe9cf',
          200: '#ffd09b',
          300: '#ffb060',
          400: '#ff8d2f',
          500: '#ff7013',
          600: '#f25709',
          700: '#c93e0a',
          800: '#a03112',
          900: '#812b12'
        }
      },
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        lift: '0 16px 40px rgba(16, 37, 55, 0.12)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top right, rgba(255,255,255,0.25), transparent 45%), linear-gradient(135deg, #1d3d3e 0%, #2f8786 55%, #ff8d2f 100%)'
      }
    }
  },
  plugins: []
};

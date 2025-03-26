/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#734b9c',
          light: '#8a6bb5',
          pastel: '#e9e1f2',
          ultraLight: '#f7f3fc'
        },
        accent: {
          yellow: '#fdc234',
          yellowPastel: '#fef7d9',
          yellowText: '#c69c2b',
          orange: '#fe8342',
          orangePastel: '#feeadd',
          orangeText: '#cc6a3c',
          blue: '#5b9bd5',
          bluePastel: '#e1eefa',
          blueText: '#4a93c4'
        },
        success: {
          DEFAULT: '#22c55e',
          pastel: '#dcfce7',
          text: '#1a9b48'
        },
        warning: {
          DEFAULT: '#eab308',
          pastel: '#fef9c3',
          text: '#b38b06'
        },
        error: {
          DEFAULT: '#ef4444',
          pastel: '#fee2e2',
          text: '#c63030'
        },
        info: {
          DEFAULT: '#3b82f6',
          pastel: '#f5f9ff',
          text: '#2563eb'
        },
        // gray: {
        //   50: '#fdfeff',
        //   100: '#fafbfc',
        //   200: '#f5f7f9',
        //   300: '#f0f3f5',
        //   400: '#e9eef2',
        //   500: '#d1d9e0',
        //   600: '#a0adb8',
        //   700: '#6e7b87',
        //   800: '#3f4d59',
        //   900: '#1a2937'
        // }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      boxShadow: {
        subtle: '0 2px 6px rgba(0, 0, 0, 0.03)',
        soft: '0 4px 10px rgba(0, 0, 0, 0.02)',
        hover: '0 6px 14px rgba(0, 0, 0, 0.04)',
        modal: '0 10px 25px rgba(0, 0, 0, 0.08)'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      }
    },
    animation: {
      fadeIn: 'fadeIn 0.3s ease-in-out'
    },
  },
  plugins: [],
};
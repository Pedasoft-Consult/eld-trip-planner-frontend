/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Primary brand colors - Red, White, Black theme
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Main red
          600: '#dc2626', // Primary red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Secondary colors
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827', // Near black
        },
        // Accent red
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Status colors with red theme
        success: {
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
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-red': 'pulseRed 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseRed: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      boxShadow: {
        'red': '0 0 0 3px rgba(239, 68, 68, 0.1)',
        'red-lg': '0 10px 25px rgba(239, 68, 68, 0.15)',
        'black': '0 0 0 3px rgba(0, 0, 0, 0.1)',
        'black-lg': '0 10px 25px rgba(0, 0, 0, 0.15)',
      },
      borderColor: {
        'red-focus': '#dc2626',
        'black-focus': '#111827',
      },
      ringColor: {
        'red': '#dc2626',
        'black': '#111827',
      },
      backgroundColor: {
        'red-50': '#fef2f2',
        'red-100': '#fee2e2',
        'red-500': '#ef4444',
        'red-600': '#dc2626',
        'red-700': '#b91c1c',
        'black': '#000000',
        'black-900': '#111827',
        'white': '#ffffff',
      },
      textColor: {
        'red-600': '#dc2626',
        'red-700': '#b91c1c',
        'black': '#000000',
        'black-900': '#111827',
        'white': '#ffffff',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        'screen-2xl': '1536px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    // Custom plugin for red/white/black theme utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.btn-red': {
          backgroundColor: theme('colors.red.600'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.red.700'),
          },
          '&:focus': {
            boxShadow: theme('boxShadow.red'),
          },
        },
        '.btn-black': {
          backgroundColor: theme('colors.black'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.gray.800'),
          },
          '&:focus': {
            boxShadow: theme('boxShadow.black'),
          },
        },
        '.btn-white': {
          backgroundColor: theme('colors.white'),
          color: theme('colors.black'),
          border: `1px solid ${theme('colors.gray.300')}`,
          '&:hover': {
            backgroundColor: theme('colors.gray.50'),
          },
          '&:focus': {
            boxShadow: theme('boxShadow.red'),
          },
        },
        '.input-red-focus': {
          '&:focus': {
            borderColor: theme('colors.red.600'),
            boxShadow: theme('boxShadow.red'),
          },
        },
        '.card-red': {
          border: `1px solid ${theme('colors.red.200')}`,
          backgroundColor: theme('colors.white'),
        },
        '.text-gradient-red': {
          background: `linear-gradient(135deg, ${theme('colors.red.600')}, ${theme('colors.red.800')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-gradient-red': {
          background: `linear-gradient(135deg, ${theme('colors.red.500')}, ${theme('colors.red.700')})`,
        },
        '.border-red-focus': {
          borderColor: theme('colors.red.600'),
        },
        '.ring-red': {
          '--tw-ring-color': theme('colors.red.600'),
        },
        '.shadow-red-glow': {
          boxShadow: `0 0 20px ${theme('colors.red.500')}40`,
        },
        '.scrollbar-red': {
          scrollbarColor: `${theme('colors.red.600')} ${theme('colors.red.100')}`,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('colors.red.100'),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.red.600'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme('colors.red.700'),
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
  // Safelist important classes that might be generated dynamically
  safelist: [
    'bg-red-50',
    'bg-red-100',
    'bg-red-500',
    'bg-red-600',
    'bg-red-700',
    'text-red-600',
    'text-red-700',
    'text-red-800',
    'border-red-200',
    'border-red-500',
    'ring-red-500',
    'ring-red-600',
    'focus:ring-red-500',
    'focus:border-red-600',
    'hover:bg-red-50',
    'hover:bg-red-700',
    'hover:text-red-700',
  ],
}

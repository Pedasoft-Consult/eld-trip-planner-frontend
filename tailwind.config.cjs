/** @type {import('tailwindcss').Config} */
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
        // Primary trucking colors - Orange/Amber from sunset
        primary: {
          50: '#fefcf3',
          100: '#fef7e2',
          200: '#feebc8',
          300: '#fdd89f',
          400: '#fbb360',
          500: '#f7941d', // Main orange from image
          600: '#e67e00', // Primary orange
          700: '#c56500',
          800: '#a04f00',
          900: '#7c3e00',
        },
        // Secondary colors - Blue from sky
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Sky blue
          600: '#0284c7', // Primary blue
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Accent colors - Warm earth tones from road/landscape
        accent: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ebe0d1',
          300: '#ddc9b0',
          400: '#d4b894',
          500: '#c9a876', // Warm earth tone
          600: '#b8956a',
          700: '#9e7f56',
          800: '#7d6447',
          900: '#5f4d37',
        },
        // Truck colors - Deep blues and grays
        truck: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Container/truck color
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Road colors - Warm grays
        road: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c', // Road surface
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Status colors maintaining trucking theme
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
          50: '#fefcf3',
          100: '#fef7e2',
          200: '#feebc8',
          300: '#fdd89f',
          400: '#fbb360',
          500: '#f7941d', // Using primary orange for warnings
          600: '#e67e00',
          700: '#c56500',
          800: '#a04f00',
          900: '#7c3e00',
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
      backgroundImage: {
        'trucking-hero': "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0ic2t5R3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjc5NDFkO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y3OTQxZDtzdG9wLW9wYWNpdHk6MC44IiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwZWE1ZTk7c3RvcC1vcGFjaXR5OjAuNiIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjc2t5R3JhZGllbnQpIi8+Cjwvc3ZnPgo=')",
        'trucking-overlay': "linear-gradient(135deg, rgba(247, 148, 29, 0.9) 0%, rgba(14, 165, 233, 0.8) 100%)",
        'sunset-gradient': "linear-gradient(135deg, #f7941d 0%, #e67e00 25%, #0ea5e9 75%, #0284c7 100%)",
        'road-gradient': "linear-gradient(180deg, #78716c 0%, #44403c 100%)",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-orange': 'pulseOrange 2s infinite',
        'truck-drive': 'truckDrive 3s ease-in-out infinite',
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
        pulseOrange: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        truckDrive: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'orange': '0 0 0 3px rgba(247, 148, 29, 0.1)',
        'orange-lg': '0 10px 25px rgba(247, 148, 29, 0.15)',
        'blue': '0 0 0 3px rgba(14, 165, 233, 0.1)',
        'blue-lg': '0 10px 25px rgba(14, 165, 233, 0.15)',
        'truck': '0 4px 12px rgba(100, 116, 139, 0.2)',
        'sunset': '0 8px 32px rgba(247, 148, 29, 0.3)',
      },
      borderColor: {
        'orange-focus': '#e67e00',
        'blue-focus': '#0284c7',
      },
      ringColor: {
        'orange': '#e67e00',
        'blue': '#0284c7',
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
    // Custom plugin for trucking theme utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.btn-trucking': {
          background: `linear-gradient(135deg, ${theme('colors.primary.500')}, ${theme('colors.primary.600')})`,
          color: theme('colors.white'),
          border: 'none',
          '&:hover': {
            background: `linear-gradient(135deg, ${theme('colors.primary.600')}, ${theme('colors.primary.700')})`,
            transform: 'translateY(-1px)',
          },
          '&:focus': {
            boxShadow: theme('boxShadow.orange'),
          },
        },
        '.btn-secondary-trucking': {
          background: `linear-gradient(135deg, ${theme('colors.secondary.500')}, ${theme('colors.secondary.600')})`,
          color: theme('colors.white'),
          '&:hover': {
            background: `linear-gradient(135deg, ${theme('colors.secondary.600')}, ${theme('colors.secondary.700')})`,
          },
          '&:focus': {
            boxShadow: theme('boxShadow.blue'),
          },
        },
        '.btn-outline-trucking': {
          backgroundColor: 'transparent',
          color: theme('colors.primary.600'),
          border: `2px solid ${theme('colors.primary.600')}`,
          '&:hover': {
            backgroundColor: theme('colors.primary.50'),
            color: theme('colors.primary.700'),
          },
          '&:focus': {
            boxShadow: theme('boxShadow.orange'),
          },
        },
        '.card-trucking': {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme('colors.primary.200')}`,
          boxShadow: theme('boxShadow.sunset'),
        },
        '.card-glass': {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.text-gradient-sunset': {
          background: `linear-gradient(135deg, ${theme('colors.primary.600')}, ${theme('colors.secondary.600')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-trucking-pattern': {
          backgroundImage: `
            radial-gradient(circle at 1px 1px, ${theme('colors.primary.200')} 1px, transparent 0),
            linear-gradient(135deg, ${theme('colors.primary.50')}, ${theme('colors.secondary.50')})
          `,
          backgroundSize: '20px 20px, 100% 100%',
        },
        '.trucking-hero-bg': {
          background: theme('backgroundImage.trucking-hero'),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
        '.navbar-trucking': {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme('colors.primary.200')}`,
        },
        '.sidebar-trucking': {
          background: `linear-gradient(180deg, ${theme('colors.white')}, ${theme('colors.primary.50')})`,
          borderRight: `1px solid ${theme('colors.primary.200')}`,
        },
        '.input-trucking': {
          borderColor: theme('colors.primary.300'),
          '&:focus': {
            borderColor: theme('colors.primary.500'),
            boxShadow: theme('boxShadow.orange'),
          },
        },
        '.status-driving': {
          backgroundColor: theme('colors.error.500'),
          color: theme('colors.white'),
        },
        '.status-on-duty': {
          backgroundColor: theme('colors.primary.500'),
          color: theme('colors.white'),
        },
        '.status-off-duty': {
          backgroundColor: theme('colors.truck.500'),
          color: theme('colors.white'),
        },
        '.status-sleeper': {
          backgroundColor: theme('colors.secondary.500'),
          color: theme('colors.white'),
        },
        '.scrollbar-trucking': {
          scrollbarColor: `${theme('colors.primary.500')} ${theme('colors.primary.100')}`,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('colors.primary.100'),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.primary.500'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme('colors.primary.600'),
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
  // Safelist important classes that might be generated dynamically
  safelist: [
    'bg-primary-50',
    'bg-primary-100',
    'bg-primary-500',
    'bg-primary-600',
    'bg-primary-700',
    'bg-secondary-50',
    'bg-secondary-500',
    'bg-secondary-600',
    'text-primary-600',
    'text-primary-700',
    'text-primary-800',
    'text-secondary-600',
    'border-primary-200',
    'border-primary-500',
    'ring-primary-500',
    'ring-secondary-500',
    'focus:ring-primary-500',
    'focus:border-primary-600',
    'hover:bg-primary-50',
    'hover:bg-primary-700',
    'hover:text-primary-700',
  ],
}

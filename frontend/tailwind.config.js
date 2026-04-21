/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'page-bg': '#FFFFFF',
        'section-alt': '#F7F7F5',
        'card-surface': '#FAFAF8',
        'input-bg': '#F4F4F2',
        'dark-section': '#111111',
        'dark-footer': '#111111',

        // Text
        'text-primary': '#111111',
        'text-secondary': '#555555',
        'text-muted': '#888888',
        'text-disabled': '#BBBBBB',
        'text-on-dark': '#FFFFFF',
        'text-on-dark-muted': 'rgba(255,255,255,0.55)',

        // Accent
        'accent-primary': '#1A1A1A',
        'accent-hover': '#333333',
        'blue-cta': '#0066FF',
        'blue-hover': '#0052CC',

        // Status
        'success': '#16A34A',
        'error': '#DC2626',
        'warning': '#D97706',
        'whatsapp': '#25D366',

        // Borders
        'border-default': '#E8E8E6',
        'border-strong': '#D0D0CC',
      },
      backgroundColor: {
        'glass': 'rgba(255,255,255,0.80)',
      },
      backdropBlur: {
        'glass': 'blur(20px)',
      },
      fontFamily: {
        'sans': ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        'serif': ['DM Serif Display', 'serif'],
      },
      fontSize: {
        'hero-display': ['72px', { lineHeight: '1.05', letterSpacing: '-1px' }],
        'hero-sub': ['20px', { lineHeight: '1.5', fontWeight: '300' }],
        'section-title': ['48px', { lineHeight: '1.1', letterSpacing: '-0.5px' }],
        'section-sub': ['18px', { lineHeight: '1.6' }],
        'card-title': ['18px', { lineHeight: '1.2' }],
        'card-body': ['14px', { lineHeight: '1.6' }],
        'nav-link': ['15px', { lineHeight: '1', fontWeight: '500' }],
        'button': ['15px', { lineHeight: '1', fontWeight: '500', letterSpacing: '0.02em' }],
        'caption': ['13px', { lineHeight: '1.5' }],
        'badge': ['11px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'full': '999px',
        'pill': '999px',
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
        'glass': '0 8px 40px rgba(0,0,0,0.10)',
        'nav-scrolled': '0 1px 0 rgba(0,0,0,0.08)',
        'button': '0 2px 8px rgba(0,0,0,0.10)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}

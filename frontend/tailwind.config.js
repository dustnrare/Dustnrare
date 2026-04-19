/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:        '#0a0a0a',
          elevated:  '#111111',
          surface:   '#1a1a1a',
          gold:      '#C9A84C',
          'gold-lt': '#D4B85A',
          'gold-dk': '#A88B3D',
          text:      '#F5F0E8',
          'text-s':  '#B8B0A4',
          muted:     '#6B635C',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['Poppins', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        ultra:  '0.5em',
      },
      animation: {
        'fade-up':       'fadeUp 0.8s ease forwards',
        'slow-zoom':     'slowZoom 18s ease-in-out infinite alternate',
        'marquee':       'marquee 25s linear infinite',
        'scroll-line':   'scrollLine 2s ease-in-out infinite',
        'shimmer':       'shimmer 3s ease-in-out infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'slide-up':      'slideUp 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
        'fade-in-scale': 'fadeInScale 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        slowZoom: {
          from: { transform: 'scale(1)' },
          to:   { transform: 'scale(1.06)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        scrollLine: {
          '0%, 100%': { opacity: 0.3, transform: 'scaleY(0.5)' },
          '50%':      { opacity: 1,   transform: 'scaleY(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(201,168,76,0.1)' },
          '50%':      { boxShadow: '0 0 30px rgba(201,168,76,0.25)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(40px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInScale: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to:   { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

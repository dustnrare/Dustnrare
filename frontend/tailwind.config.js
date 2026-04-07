/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          beige:    '#EAE3DC',
          sage:     '#C7D3C0',
          lavender: '#D8D4E8',
          offwhite: '#F8F7F5',
          pink:     '#E8D4D8',
          gold:     '#b8965a',
          text:     '#2a2622',
          mid:      '#6b635c',
          light:    '#9e958e',
        }
      },
      fontFamily: {
        serif:  ['Playfair Display', 'Georgia', 'serif'],
        sans:   ['Poppins', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        ultra:  '0.5em',
      },
      animation: {
        'fade-up':     'fadeUp 0.8s ease forwards',
        'slow-zoom':   'slowZoom 18s ease-in-out infinite alternate',
        'marquee':     'marquee 20s linear infinite',
        'scroll-line': 'scrollLine 2s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
}

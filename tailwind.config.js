/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        yellow:   '#FFD100',
        black:    '#0F0F0F',
        surface:  '#161616',
        surface2: '#1E1E1E',
        border:   '#2E2E2E',
        white:    '#F0EFE8',
        'white-d':'#A8A49C',
        red:      '#D62828',
        green:    '#22C55E',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        label:   ['"Barlow Condensed"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

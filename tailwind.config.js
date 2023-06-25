/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily:{
        mulish: ['var(--font-mulish)']
      },
      backgroundColor: {
        'bgp-default': '#f8f8f8',
        'pink-old': '#ff296d',
        'overlay': 'rgba(0,0,0,0.4)',
        'key-color': 'rgba(63, 173, 228, 0.1450980392)',
        'color-default': '#3face4'
      },
      borderWidth:{
        'bdr-one': '1px'
      },
      colors: {
        'font-color-2': '#495057',
        'font-color-3': '#444',
        'color-young-gray': '#eee',
        'color-default': '#3face4',
        'red-default': '#ff0000',
        'bdr-bottom': 'rgba(0,0,0,0.1)',
        'pink-old': '#ff296d',
        'color-grey-white': '#f7f5f5'
      },
      boxShadow:{
        'shadow-menu': '0 2px 3px -1px rgba(0, 0, 0, 0.3)'
      }
    },
  },
  plugins: [],
}

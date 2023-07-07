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
        'gray-search': '#f9f9f9', 
        'pink-old': '#ff296d',
        'overlay': 'rgba(0,0,0,0.4)',
        'pop-up': 'rgba(0,0,0,0.6)',
        'key-color': 'rgba(63, 173, 228, 0.1450980392)',
        'color-default': '#3face4',
        'color-default-old': '#288bbc', 
        'green-success-young': '#2cc20e30',
        'cyan-table': '#f0ffff',
        'table-hover': '#d9f9f9',
        'pink': '#f85084',
        'orange': '#FFA500',
        'red': '#ff0000'
      },
      borderWidth:{
        'bdr-one': '1px'
      },
      colors: {
        'font-color-2': '#495057',
        'font-color-3': '#444',
        'font-color-4': '#111',
        'color-young-gray': '#eee',
        'color-default': '#3face4',
        'color-default-old': '#288bbc',
        'red-default': '#ff0000',
        'bdr-bottom': 'rgba(0,0,0,0.1)',
        'pink-old': '#ff296d',
        'color-grey-white': '#f7f5f5',
        'green': '#0ab110',
        'green-success': '#47d400',
        'border-success': '#7ec86f27',
        'pink': '#f85084',
        'orange': '#FFA500',
        'orange-young': '#fa9c1b'
      },
      boxShadow:{
        'shadow-menu': '0 2px 3px -1px rgba(0, 0, 0, 0.3)'
      },
      screens: {
        'mobile': '0px',
        'tablet': '918px',
        'max-info-card-mobile': '568px'
      }
    },
  },
  plugins: [],
}

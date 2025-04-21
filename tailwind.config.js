/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#ff5c35',
          '50': '#fff5f2',
          '100': '#ffece5',
          '200': '#ffd0c2',
          '300': '#ffb49f',
          '400': '#ff7c58',
          '500': '#ff5c35', 
          '600': '#e65330',
          '700': '#bf4528',
          '800': '#983720',
          '900': '#7c2d1a',
        },
        'dark': {
          'bg': '#121212',
          'card': '#1e1e1e',
          'text': '#e0e0e0',
          'border': '#303030',
          'accent': '#ff7c58', 
        }
      },
    },
  },
  plugins: [],
}
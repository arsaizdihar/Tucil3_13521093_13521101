/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        circular: ['CircularStd', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [require('daisyui')],
}

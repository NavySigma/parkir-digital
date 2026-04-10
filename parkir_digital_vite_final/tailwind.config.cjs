/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9', // blue-500 like
        accent: '#0b84ff'
      }
    },
  },
  plugins: [],
}
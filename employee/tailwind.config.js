/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custNav': '#455a77',
        'custDash':'#2c3a70'
      },
    },
  },
  plugins: [],
}


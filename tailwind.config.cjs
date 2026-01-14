/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void-black': '#050505',
        'door-pink': '#FF69B4',
        'pm-blue': 'rgba(30, 144, 255, 0.1)',
        'design-purple': 'rgba(147, 51, 234, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

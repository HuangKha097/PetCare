/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F4D35E",
        "primary-dark": "#d6b541",
        surface: "#f5f7f6",
        "surface-container-low": "#eff1f0",
        "surface-container-lowest": "#ffffff",
        "on-background": "#2c2f2f",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        'xl': '3rem',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}

<<<<<<< HEAD
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

=======
 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Ejemplo de color personalizado (azul Tailwind)
        secondary: "#facc15", // Amarillo para botones o destacados
      },
    },
  },
  plugins: [],
}
>>>>>>> 238dc3016fbae2ad179df19d606791c34c6ca42d

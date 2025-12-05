/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blue
        blue: {
          base: "#2C46B1",
          dark: "#2C4091",
        },
        // Grayscale
        white: "#FFFFFF",
        gray: {
          100: "#F9F9FB",
          200: "#E4E6EC",
          300: "#CDCFD5",
          400: "#74798B",
          500: "#4D505C",
          600: "#1F2025",
        },
        // Feedback
        danger: "#B12C4D",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
      fontSize: {
        'xs': ['10px', { lineHeight: '14px', letterSpacing: '0' }],
        'sm': ['12px', { lineHeight: '16px', letterSpacing: '0' }],
        'md': ['14px', { lineHeight: '18px', letterSpacing: '0' }],
        'lg': ['18px', { lineHeight: '24px', letterSpacing: '0' }],
        'xl': ['24px', { lineHeight: '32px', letterSpacing: '0' }],
      },
      fontWeight: {
        normal: '400',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
}
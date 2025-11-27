/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2C46B1", // Blue
          foreground: "#FFFFFF",
          dark: "#2C4091", // Blue Dark
        },
        secondary: {
          DEFAULT: "#E4E6EC", // Gray 200
          foreground: "#4D505C", // Gray 500
        },
        destructive: {
          DEFAULT: "#B12C4D", // Red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F9F9FB", // Gray 100
          foreground: "#74798B", // Gray 400
        },
        accent: {
          DEFAULT: "#F9F9FB", // Gray 100
          foreground: "#1F2025", // Gray 600
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2025",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2025",
        },
        gray: {
          100: "#F9F9FB",
          200: "#E4E6EC",
          300: "#CDCFD5",
          400: "#74798B",
          500: "#4D505C",
          600: "#1F2025",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}
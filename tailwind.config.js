import { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "ibm-plex-sans": ["IBM Plex Sans", "sans-serif"],
        "bebas-neue": ["var(--bebas-neue)"],
      },
      colors: {
        primary: "var(--primary)",
        primaryForeground: "var(--primary-foreground)",
        secondary: "var(--secondary)",
        secondaryForeground: "var(--secondary-foreground)",
        accent: "var(--accent)",
        accentForeground: "var(--accent-foreground)",
        muted: "var(--muted)",
        mutedForeground: "var(--muted-foreground)",
        card: "var(--card)",
        cardForeground: "var(--card-foreground)",
        popover: "var(--popover)",
        popoverForeground: "var(--popover-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        destructive: "var(--destructive)",
        sidebar: "var(--sidebar)",
        sidebarForeground: "var(--sidebar-foreground)",
        sidebarPrimary: "var(--sidebar-primary)",
        sidebarPrimaryForeground: "var(--sidebar-primary-foreground)",
        sidebarAccent: "var(--sidebar-accent)",
        sidebarAccentForeground: "var(--sidebar-accent-foreground)",
        sidebarBorder: "var(--sidebar-border)",
        sidebarRing: "var(--sidebar-ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        xs: "480px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        pattern: "url('/images/pattern.webp')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

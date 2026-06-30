import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Clinical, precise palette — "clear" lab vernacular
        ink: "#0E1A22",        // near-black, blue undertone
        muted: "#5B6B73",
        faint: "#8A9AA1",
        line: "#E3E9EC",
        surface: "#FFFFFF",
        canvas: "#F6F8F9",
        clinic: {
          50: "#ECF7F8",
          100: "#D3EDEF",
          200: "#A7DBDF",
          400: "#3FAEB4",
          500: "#0D7D87",  // primary
          600: "#0A636B",
          700: "#084B51",
        },
        pass: "#15803D",
        passbg: "#E8F4EC",
        hold: "#B45309",
        holdbg: "#FBF1E3",
        fail: "#B91C1C",
        failbg: "#FBEAEA",
        info: "#1E5F9E",
        infobg: "#E9F0F8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,26,34,0.04), 0 1px 1px rgba(14,26,34,0.03)",
        pop: "0 8px 28px rgba(14,26,34,0.10)",
      },
      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};
export default config;

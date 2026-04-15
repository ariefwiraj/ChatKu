import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        foreground: "#f0f0f5",
        surface: {
          DEFAULT: "#12121a",
          elevated: "#1a1a28",
        },
        border: "#2a2a3d",
        primary: {
          DEFAULT: "#6c5ce7",
          hover: "#5a4bd1",
        },
        secondary: {
          DEFAULT: "#00cec9",
          hover: "#00b5b0",
        },
        accent: "#a29bfe",
        muted: "#8888a0",
        botBubble: "#1e1e2e",
        success: "#00b894",
        error: "#ff6b6b",
        warning: "#fdcb6e",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #6c5ce7, #00cec9)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(108, 92, 231, 0.3)",
        card: "0 4px 24px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "float": "float 15s ease-in-out infinite",
        "bounce-dot": "bounce-dot 1.4s infinite ease-in-out both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

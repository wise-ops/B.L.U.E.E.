import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bluee: {
          steel: "#4682b4",
          orange: "#e86100",
          olive: "#556b2f",
          navy: "#1a1f2e",
        },
      },
    },
  },
  plugins: [],
};
export default config;

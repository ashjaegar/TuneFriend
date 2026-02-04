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
                neonBlue: "#00f3ff",
                neonPurple: "#bd00ff",
                darkBg: "#050505",
            },
            fontFamily: {
                sans: ["var(--font-outfit)"],
            },
        },
    },
    plugins: [],
};
export default config;

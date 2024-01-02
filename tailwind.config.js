/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
    ],
    darkMode: "class",
    theme: {
        fontFamily: {
            flowCircular: ["Flow Circular", "sans-serif"]
        },
        extend: {
            colors: {
                background: "#FFFBFE",
                card: "#FAF1F0",
                "card-hover": "#F2DBD9",
                "card-active": "#EDCDC9",
                secondary: "#d1857b",
                "secondary-hover": "#c6685d",
                "secondary-active": "#d6938a",
                outline: "#E6BEB7",
                text: "#1C1B1F",
                "text-gray": "#A3A3A3"
            },
            lineHeight: {
                13: "3.25rem",
            },
        },
    },
    plugins: [],
};

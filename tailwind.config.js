/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            colors: {
                // Mocha theme (dark)
                'cat-base-dark': '#1e1e2e',
                'cat-fg-dark': '#cdd6f4',
                'cat-green-dark': '#a6e3a1',
                'cat-peach-dark': '#fab387',

                // Latte theme (light)
                'cat-base-light': '#eff1f5',
                'cat-fg-light': '#4c4f69',
                'cat-green-light': '#40a02b',
                'cat-peach-light': '#fe640b',
            },
            fontFamily: {
                mono: ['Fira Mono', 'monospace'],
            },
        },
    },
    plugins: [],
};

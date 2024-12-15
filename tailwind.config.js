/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            colors: {
                'cat-base': '#1e1e2e',
                'cat-fg': '#cdd6f4',
                'cat-green': '#a6e3a1',
                'cat-peach': '#fab387',
            },
            fontFamily: {
                mono: ['Fira Mono', 'monospace'],
            },
        },
    },
    plugins: [],
};

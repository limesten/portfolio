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
    plugins: [
        function({ addUtilities }) {
            addUtilities({
                '.scrollbar-custom': {
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgb(76 79 105 / 0.2)',
                        borderRadius: '4px',
                    },
                    '.dark &::-webkit-scrollbar-thumb': {
                        background: 'rgb(205 214 244 / 0.2)',
                    },
                },
                '.selected': {
                    '@apply bg-cat-fg-light/20 dark:bg-cat-fg-dark/20': {},
                },
            });
        },
    ],
};

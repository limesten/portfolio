/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            height: {
                '15p': '15%',
                '28p': '28.33%',
            },
            colors: {
                // Mocha theme (dark)
                'cat-base-dark': 'rgb(30, 30, 46)',
                'cat-fg-dark': 'rgb(205, 214, 244)',
                'cat-green-dark': 'rgb(166, 227, 161)',
                'cat-peach-dark': 'rgb(250, 179, 135)',

                // Latte theme (light)
                'cat-base-light': 'rgb(239, 241, 245)',
                'cat-fg-light': 'rgb(76, 79, 105)',
                'cat-green-light': 'rgb(64, 160, 43)',
                'cat-peach-light': 'rgb(254, 100, 11)',
                'cat-accent': 'rgb(76, 79, 105)',
            },
            fontFamily: {
                mono: ['Fira Mono', 'monospace'],
            },
        },
    },
    plugins: [
        function({ addComponents }) {
            addComponents({
                '.scrollbar-custom::-webkit-scrollbar': {
                    'width': '8px',
                },
                '.scrollbar-custom::-webkit-scrollbar-track': {
                    'background': 'transparent',
                },
                '.scrollbar-custom::-webkit-scrollbar-thumb': {
                    'background': 'rgb(76 79 105 / 0.2)',
                    'border-radius': '4px',
                },
                '.dark .scrollbar-custom::-webkit-scrollbar-thumb': {
                    'background': 'rgb(205 214 244 / 0.2)',
                },
                '.selected': {
                    'background-color': 'rgb(76 79 105 / 0.2)',
                },
                '.dark .selected': {
                    'background-color': 'rgb(205 214 244 / 0.2)',
                },
                '.decorating-text': {
                    'position': 'absolute',
                    'padding': '0 0.1rem',
                    'width': 'fit-content',
                    'z-index': '10',
                },
                '.decorating-text p': {
                    'position': 'relative',
                    'z-index': '2',
                    'background-color': 'rgb(239, 241, 245)',
                },
                '.dark .decorating-text p': {
                    'background-color': 'rgb(30, 30, 46)',
                },
                '.decorating-text div': {
                    'position': 'relative',
                    'z-index': '1',
                    'background-color': 'rgb(239, 241, 245)',
                    'height': '0.5ch',
                    'top': '-1ch',
                    'left': '-2px',
                    'width': '104%',
                },
                '.dark .decorating-text div': {
                    'background-color': 'rgb(30, 30, 46)',
                },
                '.list-index': {
                    'bottom': '-12px',
                    'right': '8px',
                    'align-self': 'flex-end',
                    'padding': '0 4px',
                    'background-color': 'rgb(239, 241, 245)',
                },
                '.dark .list-index': {
                    'background-color': 'rgb(30, 30, 46)',
                },
            });
        },
    ],
};

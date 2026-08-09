module.exports = {
    multipass: true,
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    // The icons are sized by CSS class, so the viewBox has to stay.
                    removeViewBox: false,
                },
            },
        },
    ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['light', 'dark', 'cupcake'],
    },
};


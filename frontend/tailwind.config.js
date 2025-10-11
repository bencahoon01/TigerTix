/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
            },
            boxShadow: {
                'inset': 'inset 0 3px 6px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(0, 0, 0, 0.3)',
            },
            colors: {
                green: {
                    300: '#4ade80',
                    400: '#22c55e',
                    500: '#16a34a',
                    600: '#15803d',
                    700: '#166534',
                    800: '#14532d'
                }
            }
        },
    },
    plugins: [],
}

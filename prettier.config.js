/** @type {import("prettier").Config} */
const config = {
    useTabs: true,
    trailingComma: 'none',
    printWidth: 100,
    plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
    overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
    tailwindStylesheet: './src/app.css',
		bracketSpacing: true
};

export default config;
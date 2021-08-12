import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			"postcss": true
		})
	],

	kit: {
		adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			optimizeDeps: {
				exclude: ['svelte-kit-cookie-session'],
			},
			resolve: {
				alias: {
					$stores: resolve('./src/stores'),
					$shared: resolve('./production/shared'),
				},
			},
		},
	}
};

export default config;
// Workaround until SvelteKit uses Vite 2.3.8 (and it's confirmed to fix the Tailwind JIT problem)
const mode = process.env.NODE_ENV;
const dev = mode === "development";
process.env.TAILWIND_MODE = dev ? "watch" : "build";
// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			// use relative URLs similar to an anchor tag <a href="/products/1"></a>
			// do not include group layout folders in the path such as /(app)/products/1
			// entries: [
			// 	'/products/1972-martin-d-28',
			// 	'/products/preston-thompson-d-ba-brazilian-rosewood-d28-natural'
			// ]
		}
	},
	preprocess: vitePreprocess()
};

export default config;

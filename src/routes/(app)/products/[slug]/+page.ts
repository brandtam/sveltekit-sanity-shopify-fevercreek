import type { PageLoad } from './$types';
import { client } from '$lib/utils/sanity';

export const load = (async ({ fetch, params }) => {
	const product = await client.fetch(
		`*[_type == "product" && store.slug.current == '${params.slug}']`
	);

	if (product) {
		return {
			product: product[0].store
		};
	}
	return {
		status: 500,
		body: new Error('Internal Server Error')
	};
}) satisfies PageLoad;

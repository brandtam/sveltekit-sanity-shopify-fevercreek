import type { LayoutServerLoad } from './$types';
import { client } from '$lib/utils/sanity';

export const load = (async () => {
	const data = await client.fetch(`*[_type == "product"]`);

	if (data) {
		return {
			products: data
		};
	}
	return {
		status: 500,
		body: new Error('Internal Server Error')
	};
}) satisfies LayoutServerLoad;

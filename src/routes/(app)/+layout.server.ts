import type { LayoutServerLoad } from './$types';
import { client } from '$lib/utils/sanity';

export const load = (async () => {
	const data = await client.fetch(`*[_type == "products"]`);

	if (data) {
		console.log(`data: ${JSON.stringify(data)}`);
		return {
			settings: data
		};
	}
	return {
		status: 500,
		body: new Error('Internal Server Error')
	};
}) satisfies LayoutServerLoad;

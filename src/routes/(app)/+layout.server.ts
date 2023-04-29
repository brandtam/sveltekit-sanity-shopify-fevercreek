import type { LayoutServerLoad } from './$types';
import { client } from '$lib/utils/sanity';

export const load = (async () => {
	const sanityProducts = async () => {
		const data = await client.fetch(
			`*[_type == "product" && store.status == 'active']{
				...,
				store {
					...,
					title,
					variants[]->
				}
			}`
		);
		if (data) {
			return data;
		}
		return {
			status: 500,
			body: new Error('Failed to fetch products')
		};
	};

	return {
		products: sanityProducts()
	};
}) satisfies LayoutServerLoad;

import type { LayoutServerLoad } from './$types';
import { client } from '$lib/utils/sanity';

export const load = (async () => {
	const sanityProducts = async () => {
		try {
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
			return data;
		} catch (error) {
			console.error(error);
		}
	};

	return {
		products: sanityProducts()
	};
}) satisfies LayoutServerLoad;

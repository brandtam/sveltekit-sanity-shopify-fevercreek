import type { LayoutServerLoad } from './$types';
import { client } from '$lib/utils/sanity';
// import { createShopifyCart } from '$lib/utils/shopify';

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

	// const shopifyCart = async () => {
	// 	const data = await createShopifyCart();

	// 	if (data.body.data.cartCreate.cart) {
	// 		return data.body.data.cartCreate.cart;
	// 	}
	// 	return {
	// 		status: 500,
	// 		body: new Error('Failed to fetch cart')
	// 	};
	// };

	return {
		// shopifyCart: shopifyCart(),
		products: sanityProducts()
	};
}) satisfies LayoutServerLoad;

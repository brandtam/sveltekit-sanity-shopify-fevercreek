// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type ShopifyProduct = {
		id: string;
		title: string;
		description: string;
		images: {
			edges: {
				node: {
					id: string;
					originalSrc: string;
					altText: string;
				};
			}[];
		};
		priceRange: {
			minVariantPrice: {
				amount: string;
				currencyCode: string;
			};
		};
	};
	type ShopifyProductVariant = {
		id: string;
		title: string;
		price: string;
	};
	type ShopifyFetch = {
		query: string;
		variables?: Record<string, unknown>;
	};
	type ShopifyCartLine = {
		cartId?: number;
		lineId?: number;
		variantId: number;
		quantity: number;
	};
	type ShopifyCart = {
		checkoutUrl: string;
		id: string;
		lines: ShopifyCartLine[];
	};
	type Product = {
		id: string;
		title: string;
		description: string;
		image: string;
		price: string;
	};
	type CartItem = {
		product: Product;
		variantId: string;
		quantity: number;
	};
	type Cart = {
		id: string;
		subtotal: number;
		lines: [CartItem];
	};
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

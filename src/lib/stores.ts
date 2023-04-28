import { writable, get } from 'svelte/store';
// import { createShopifyCart } from '$lib/utils/shopify';

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

// const cart = shopifyCart();

export const openSide = writable<boolean>(false);
export const cartCount = writable<number>(0);
export const cartSubtotal = writable<number>(0);
export const cartItemsStore = writable<CartLineItem[]>([]);
export const cartStore = writable<Cart | null>(null);
export const shopCart = writable<ShopifyCart>();

// add to cart
export const addToCartItemsStore = (lineItem: CartLineItem) => {
	const { variantId, quantity } = lineItem;
	cartCount.update((n) => n + quantity);
	cartSubtotal.update((n) => n + quantity * Number(lineItem.price));

	const items = get(cartItemsStore);
	const itemPosition = items.findIndex((item) => item.variantId === variantId);

	if (itemPosition !== -1) {
		items[itemPosition].quantity += quantity;
	} else {
		items.push(lineItem);
	}
	cartItemsStore.update(() => {
		return items;
	});
};

// remove from cart
export const removeFromCartStore = (variantId: string, quantity: number) => {
	const items = get(cartItemsStore);
	const itemPosition = items.findIndex((item) => item.variantId === variantId);

	cartCount.update((n) => n - quantity);
	cartSubtotal.update((n) => n - quantity * Number(items[itemPosition].price));

	if (itemPosition !== -1) {
		if (items[itemPosition].quantity <= quantity) {
			items.splice(itemPosition, 1);
		} else {
			items[itemPosition].quantity -= quantity;
		}
		cartItemsStore.update(() => {
			return items;
		});
	} else {
		console.log('item not found');
	}
};

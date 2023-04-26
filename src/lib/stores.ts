import { writable, get } from 'svelte/store';

export const openSide = writable<boolean>(false);
export const cartCount = writable<number>(0);
export const cartItemsStore = writable<CartItem[]>([]);
export const cartStore = writable<Cart | null>(null);

// add to cart
export const addToCartItemsStore = (product: Product, variantId: string, quantity: number) => {
	cartCount.update((n) => n + quantity);

	const items = get(cartItemsStore);
	const itemPosition = items.findIndex((item) => item.variantId === variantId);

	if (itemPosition !== -1) {
		items[itemPosition].quantity += quantity;
	} else {
		items.push({ product, variantId, quantity });
	}
	cartItemsStore.update(() => {
		return items;
	});
};

// remove from cart
export const removeFromCartStore = (variantId: string, quantity: number) => {
	cartCount.update((n) => n - quantity);

	const items = get(cartItemsStore);
	const itemPosition = items.findIndex((item) => item.variantId === variantId);

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

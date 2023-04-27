import { goto } from '$app/navigation';
import { addToCartItemsStore, removeFromCartStore } from '$lib/stores';

export function addToCart(lineItem: CartLineItem) {
	addToCartItemsStore(lineItem);
	// Why this needs a timeout to work is beyond me
	setTimeout(() => goto('/cart'), 0);
}

export function removeFromCart({ variantId, quantity }: RemoveLineItem) {
	removeFromCartStore(variantId, quantity);
}

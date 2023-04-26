import { goto } from '$app/navigation';
import { addToCartItemsStore, removeFromCartStore } from '$lib/stores';

export function addToCart({ product, variantId, quantity }: CartItem) {
	console.log('product', product);
	addToCartItemsStore(product, variantId, quantity);
	// Why this needs a timeout to work is beyond me
	setTimeout(() => goto('/cart'), 0);
}

export function removeFromCart({ variantId, quantity }: CartItem) {
	removeFromCartStore(variantId, quantity);
}

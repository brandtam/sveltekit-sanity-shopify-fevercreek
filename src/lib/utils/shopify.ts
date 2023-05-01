const storeUrl = import.meta.env.VITE_SHOPIFY_DOMAIN;
const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION;
const accessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN;
const shopifyEndpoint = `https://${storeUrl}/api/${apiVersion}/graphql.json`;
import { shopCart } from '$lib/stores';
import { goto } from '$app/navigation';

export async function shopifyFetch({ query, variables }: ShopifyFetch) {
	try {
		const result = await fetch(shopifyEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': accessToken
			},
			body: { query, variables } && JSON.stringify({ query, variables })
		});

		return {
			status: result.status,
			body: await result.json()
		};
	} catch (error) {
		console.error('Error:', error);
		return {
			status: 500,
			error: 'Error receiving data'
		};
	}
}

export async function getAllProducts() {
	return shopifyFetch({
		query: `{
			products(sortKey: TITLE, first: 100) {
					edges{
						node {
								id
								handle
								availableForSale
								title
								description
								descriptionHtml
								options {
										id
										name
										values
								}
								priceRange {
										maxVariantPrice {
												amount
												currencyCode
										}
										minVariantPrice {
												amount
												currencyCode
										}
								}
								variants(first: 250) {
										pageInfo {
												hasNextPage
												hasPreviousPage
										}
										edges {
												node {
														id
														title
														sku
														availableForSale
														requiresShipping
														selectedOptions {
																name
																value
														}
														priceV2 {
																amount
																currencyCode
														}
														compareAtPriceV2 {
																amount
																currencyCode
														}
												}
										}
								}
								images(first: 20) {
										pageInfo {
												hasNextPage
												hasPreviousPage
										}
										edges {
												node {
												originalSrc
												altText
												width
												height
												}
										}
								}
						}
				}
			}
		}`
	});
}

export async function getAllCollections() {
	return shopifyFetch({
		query: `{
				collections(first: 100) {
							edges {
								node {
										handle
										products(
												first: 100,
												sortKey: TITLE

										) {
												edges{
														node {
																id
																handle
																availableForSale
																title
																description
																descriptionHtml
																options {
																		id
																		name
																		values
																}
																priceRange {
																		maxVariantPrice {
																				amount
																				currencyCode
																		}
																		minVariantPrice {
																				amount
																				currencyCode
																		}
																}
																variants(first: 250) {
																		pageInfo {
																				hasNextPage
																				hasPreviousPage
																		}
																		edges {
																				node {
																						id
																						title
																						sku
																						availableForSale
																						requiresShipping
																						selectedOptions {
																								name
																								value
																						}
																						priceV2 {
																								amount
																								currencyCode
																						}
																						compareAtPriceV2 {
																								amount
																								currencyCode
																						}
																				}
																		}
																}
																images(first: 20) {
																		pageInfo {
																				hasNextPage
																				hasPreviousPage
																		}
																		edges {
																				node {
																						originalSrc
																						altText
																						width
																						height
																				}
																		}
																}
														}
												}
										}
								}
						}
				}
		}`
	});
}

export async function loadCart(cartId: string) {
	return shopifyFetch({
		query: `
				query GetCart($cartId: ID!) {
					cart(id: $cartId) {
						checkoutUrl
							estimatedCost {
									totalAmount {
									amount
									}
							}
							lines(first: 100) {
									edges {
									node {
											id
											quantity
											estimatedCost {
											subtotalAmount {
													amount
													currencyCode
											}
											totalAmount {
													amount
													currencyCode
											}
											}
											merchandise {
											... on ProductVariant {
													id
													title
													product {
															images(first: 1) {
																	edges {
																		node {
																			originalSrc
																			altText
																			width
																			height
																		}
																	}
																}
															title
													}
											}
											}
									}
									}
							}
						}
				}
			`,
		variables: { cartId }
	});
}

export async function getProduct(handle: string) {
	return shopifyFetch({
		query: `
				query getProduct($handle: String!) {
						productByHandle(handle: $handle) {
								id
								handle
								availableForSale
								title
								description
								descriptionHtml
								options {
								id
								name
								values
								}
								priceRange {
								maxVariantPrice {
										amount
										currencyCode
								}
								minVariantPrice {
										amount
										currencyCode
								}
								}
								variants(first: 250) {
								pageInfo {
										hasNextPage
										hasPreviousPage
								}
								edges {
										node {
										id
										title
										sku
										availableForSale
										requiresShipping
										selectedOptions {
												name
												value
										}
										priceV2 {
												amount
												currencyCode
										}
										compareAtPriceV2 {
												amount
												currencyCode
										}
										}
								}
								}
								images(first: 20) {
								pageInfo {
										hasNextPage
										hasPreviousPage
								}
								edges {
										node {
										originalSrc
										altText
										width
										height
										}
								}
								}
						}
				}
		`,
		variables: {
			handle
		}
	});
}

export async function shopifyCreateCart() {
	try {
		const response = await shopifyFetch({
			query: `
				mutation calculateCart($lineItems: [CartLineInput!]) {
					cartCreate(input: { lines: $lineItems }) {
						cart {
							checkoutUrl
							id
							cost {
								totalAmount {
									amount
								}
							}
							totalQuantity
							lines(first: 100) {
								edges {
									node {
										id
										quantity
										merchandise {
											... on ProductVariant {
												id
												title
												priceV2 {
													amount
												}
												product {
													id
													title
													handle
													totalInventory
													images(first: 1) {
														edges {
															node {
																originalSrc
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			`,
			variables: {}
		});
		const cart = response.body.data.cartCreate.cart;
		shopCart.set(cart);
		return cart;
	} catch (error) {
		console.log(error);
	}
}

export async function shopifyUpdateCart({
	cartId,
	lineId,
	variantId,
	quantity
}: ShopifyCartLineInput) {
	try {
		const response = await shopifyFetch({
			query: `
			mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
				cartLinesUpdate(cartId: $cartId, lines: $lines) {
					cart {
						checkoutUrl
						id
						cost {
							totalAmount {
								amount
							}
						}
						totalQuantity
						lines(first: 100) {
							edges {
								node {
									id
									quantity
									merchandise {
										... on ProductVariant {
											id
											title
											priceV2 {
												amount
											}
											product {
												id
												title
												handle
												totalInventory
												images(first: 1) {
													edges {
														node {
															originalSrc
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
					userErrors {
						field
						message
					}
				}
			}
		`,
			variables: {
				cartId: cartId,
				lines: [
					{
						id: lineId,
						merchandiseId: variantId,
						quantity: quantity
					}
				]
			}
		});
		const cart = response.body.data.cartLinesUpdate.cart;
		shopCart.set(cart);
	} catch (error) {
		console.error(error);
	}
}

export async function shopifyAddToCart({ cartId, variantId, quantity = 1 }: ShopifyCartAdd) {
	try {
		const response = await shopifyFetch({
			query: `
				mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
					cartLinesAdd(cartId: $cartId, lines: $lines) {
						cart {
							checkoutUrl
							id
							cost {
								totalAmount {
									amount
								}
							}
							totalQuantity
							lines(first: 100) {
								edges {
									node {
										id
										quantity
										merchandise {
											... on ProductVariant {
												id
												title
												priceV2 {
													amount
												}
												product {
													id
													title
													handle
													totalInventory
													images(first: 1) {
														edges {
															node {
																originalSrc
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			`,
			variables: {
				cartId: cartId,
				lines: [
					{
						merchandiseId: variantId,
						quantity: quantity
					}
				]
			}
		});
		const cart = response.body.data.cartLinesAdd.cart;
		shopCart.set(cart);

		setTimeout(() => goto('/cart'), 0);
	} catch (error) {
		console.log('shopifyAddToCart error', error);
	}
}

export async function shopifyRemoveCartLines({ cartId, lineIds }: ShopifyCartLines) {
	return shopifyFetch({
		query: `
			mutation cartLinesRemove($cartId: ID!, $lines: [ID!]!) {
				cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
					userErrors {
						field
						message
					}
				}
			}
		`,
		variables: {
			cartId: cartId,
			lineIds: [lineIds]
		}
	});
}

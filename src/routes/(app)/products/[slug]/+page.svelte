<script lang="ts">
	import type { PageData } from './$types';
	import { shopifyAddToCart } from '$lib/utils/shopify';
	import { shopCart } from '$lib/stores';

	export let data: PageData;
	$: ({ product } = data);

	let selected: number = 1;
	let openAccordion: number = 0;

	function toggleAccordion(index: number) {
		if (openAccordion === index) {
			openAccordion = 0;
		} else {
			openAccordion = index;
		}
	}

	function addToCartHandler(lineItem) {
		shopifyAddToCart($shopCart.id, lineItem.variantId, lineItem.quantity);
	}
</script>

<main class="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
	<div class="mx-auto max-w-2xl lg:max-w-none">
		<!-- Product -->
		<div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
			<!-- Image gallery -->
			<div class="flex flex-col-reverse">
				<!-- Image selector -->
				<div class="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
					<div class="grid grid-cols-4 gap-6" aria-orientation="horizontal" role="tablist">
						<button
							on:click={() => (selected = 1)}
							id="tabs-2-tab-1"
							class="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
							aria-controls="tabs-2-panel-1"
							role="tab"
							type="button"
						>
							<span class="sr-only">Main Image</span>
							<span class="absolute inset-0 overflow-hidden rounded-md">
								<img
									src={product.previewImageUrl}
									alt=""
									class="h-full w-full object-cover object-center"
								/>
							</span>
							<span
								class="{selected === 1
									? 'ring-indigo-500'
									: 'ring-transparent'} pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
								aria-hidden="true"
							/>
						</button>

						<!-- More images... -->
					</div>
				</div>

				<div class="aspect-h-1 aspect-w-1 w-full">
					<!-- Tab panel, show/hide based on tab state. -->
					<div id="tabs-2-panel-1" aria-labelledby="tabs-2-tab-1" role="tabpanel" tabindex="0">
						<img
							src={product.previewImageUrl}
							alt="Alt Text"
							class="h-full w-full object-cover object-center sm:rounded-lg"
						/>
					</div>

					<!-- More images... -->
				</div>
			</div>

			<!-- Product info -->
			<div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
				<h1 class="text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>

				{#if product.variants.length > 1 && product.priceRange.minVariantPrice != product.priceRange.maxVariantPrice}
					<div class="mt-3">
						<h2 class="sr-only">Product information</h2>
						<p class="text-3xl tracking-tight text-gray-900">
							${product.priceRange.minVariantPrice.toFixed(2)} - ${product.priceRange.maxVariantPrice.toFixed(
								2
							)}
						</p>
					</div>
				{:else}
					<div class="mt-3">
						<h2 class="sr-only">Product information</h2>
						<p class="text-3xl tracking-tight text-gray-900">
							${product.variants[0].store.price.toFixed(2)}
						</p>
					</div>
				{/if}

				<div class="mt-6">
					<h3 class="sr-only">Description</h3>

					<div class="space-y-6 text-base text-gray-700">
						<p>
							{@html product.descriptionHtml}
						</p>
					</div>
				</div>

				<form class="mt-6">
					{#each product.variants as variant}
						<div class="mt-10 flex">
							<button
								on:click={() =>
									addToCartHandler({
										variantId: variant.store.gid,
										quantity: 1,
										image: product.previewImageUrl,
										productTitle: product.title,
										variantTitle: variant.store.title,
										price: variant.store.price,
										productHandle: product.slug.current
									})}
								type="submit"
								class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
								>Add to bag</button
							>
							<!-- <button
								type="button"
								class="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
							>
								<svg
									class="h-6 w-6 flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
									/>
								</svg>
								<span class="sr-only">Add to favorites</span>
							</button> -->
						</div>
					{/each}
				</form>

				<section aria-labelledby="details-heading" class="mt-12">
					<h2 id="details-heading" class="sr-only">Additional details</h2>

					<div class="divide-y divide-gray-200 border-t">
						<div>
							<h3>
								<!-- Expand/collapse question button -->
								<button
									on:click={() => toggleAccordion(1)}
									type="button"
									class="group relative flex w-full items-center justify-between py-6 text-left"
									aria-controls="disclosure-1"
									aria-expanded="false"
								>
									<span
										class="{openAccordion === 1
											? 'text-indigo-600'
											: 'text-gray-900'} text-sm font-medium">Specs</span
									>
									<span class="ml-6 flex items-center">
										<svg
											class="{openAccordion === 1
												? 'hidden'
												: 'block'} h-6 w-6 text-gray-400 group-hover:text-gray-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M12 4.5v15m7.5-7.5h-15"
											/>
										</svg>
										<svg
											class="{openAccordion === 1
												? 'block'
												: 'hidden'} h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
										</svg>
									</span>
								</button>
							</h3>
							<div
								class="{openAccordion === 1 ? 'block' : 'hidden'} prose prose-sm pb-6"
								id="disclosure-1"
							>
								<ul>
									<li>Top Wood:</li>
									<li>Back & Sides Wood:</li>
									<li>Fingerboard Wood:</li>
									<li>Nut Width:</li>
									<li>Bridge Spacing:</li>
								</ul>
							</div>
						</div>

						<!-- More sections... -->
					</div>
				</section>
			</div>
		</div>

		<!-- <section
			aria-labelledby="related-heading"
			class="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
		>
			<h2 id="related-heading" class="text-xl font-bold text-gray-900">Customers also bought</h2>

			<div
				class="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
			>
				<div>
					<div class="relative">
						<div class="relative h-72 w-full overflow-hidden rounded-lg">
							<img
								src="https://tailwindui.com/img/ecommerce-images/product-page-03-related-product-01.jpg"
								alt="Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls."
								class="h-full w-full object-cover object-center"
							/>
						</div>
						<div class="relative mt-4">
							<h3 class="text-sm font-medium text-gray-900">Zip Tote Basket</h3>
							<p class="mt-1 text-sm text-gray-500">White and black</p>
						</div>
						<div
							class="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4"
						>
							<div
								aria-hidden="true"
								class="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
							/>
							<p class="relative text-lg font-semibold text-white">$140</p>
						</div>
					</div>
					<div class="mt-6">
						<a
							href="#"
							class="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
							>Add to bag<span class="sr-only">, Zip Tote Basket</span></a
						>
					</div>
				</div> -->

		<!-- More products... -->
		<!-- </div>
		</section> -->
	</div>
</main>

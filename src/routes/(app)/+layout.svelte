<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../../app.css';

	export let data;
</script>

<Header products={data.products} />

<slot />

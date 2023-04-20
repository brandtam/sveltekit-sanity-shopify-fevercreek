<script lang="ts">
	export let data;
	console.log(`data: ${JSON.stringify(data)}`);
	// const { greeting } = data.settings[0];
</script>

<h1 class="text-lg">{data}</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

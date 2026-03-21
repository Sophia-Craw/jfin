<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from "mode-watcher"
    import Sidebar from '$lib/components/ui/sidebar/sidebar.svelte';
    import SidebarProvider from '$lib/components/ui/sidebar/sidebar-provider.svelte';
    import SidebarTrigger from '$lib/components/ui/sidebar/sidebar-trigger.svelte';
    import AppSidebar from '$lib/components/app-sidebar.svelte';
    import Player from '$lib/components/Player.svelte';
    import { onMount } from 'svelte';
    import { currentLib } from '$lib/stores.js';
    import { page } from '$app/state';

	let { data, children } = $props();

	onMount(() => {
		currentLib.set(page.params.id || "")
	})
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />
<SidebarProvider>
	<AppSidebar data={data} />
	<main>
		<!-- <div class="top-bar">
			<SidebarTrigger />
		</div> -->
		{@render children()}
		<Player />
	</main>
</SidebarProvider>

<style> 
	/* .top-bar {
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		padding-top: 10px;
		padding-bottom: 10px;
		padding-left: 21px;
		background-image: linear-gradient(#0a0a0a, #0a0a0a, transparent);
	} */

	:root {
		overflow-x: hidden;
		padding-bottom: 100px;
	}
</style>
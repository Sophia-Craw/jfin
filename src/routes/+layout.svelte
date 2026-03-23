<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher } from "mode-watcher";
	import Sidebar from "$lib/components/ui/sidebar/sidebar.svelte";
	import SidebarProvider from "$lib/components/ui/sidebar/sidebar-provider.svelte";
	import SidebarTrigger from "$lib/components/ui/sidebar/sidebar-trigger.svelte";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import Player from "$lib/components/Player.svelte";
	import { onMount } from "svelte";
	import { currentLib } from "$lib/stores.js";
	import { page } from "$app/state";
	import Button from "$lib/components/ui/button/button.svelte";
	import { ArrowLeft, ArrowRight, DiscAlbum, Music, Search, User } from "@lucide/svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import InputGroup from "$lib/components/ui/input-group/input-group.svelte";
	import InputGroupInput from "$lib/components/ui/input-group/input-group-input.svelte";
	import InputGroupAddon from "$lib/components/ui/input-group/input-group-addon.svelte";
	import Dialog from "$lib/components/ui/dialog/dialog.svelte";
	import DialogTrigger from "$lib/components/ui/dialog/dialog-trigger.svelte";
	import DialogContent from "$lib/components/ui/dialog/dialog-content.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import Item from "$lib/components/ui/item/item.svelte";
	import ItemMedia from "$lib/components/ui/item/item-media.svelte";
	import ItemContent from "$lib/components/ui/item/item-content.svelte";
	import ItemTitle from "$lib/components/ui/item/item-title.svelte";
	import ItemDescription from "$lib/components/ui/item/item-description.svelte";
    import ToggleGroup from "$lib/components/ui/toggle-group/toggle-group.svelte";
    import ToggleGroupItem from "$lib/components/ui/toggle-group/toggle-group-item.svelte";
    import DialogHeader from "$lib/components/ui/dialog/dialog-header.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Cover from "$lib/components/Cover.svelte";
    import Kbd from "$lib/components/ui/kbd/kbd.svelte";
    import KbdGroup from "$lib/components/ui/kbd/kbd-group.svelte";
    import { goto } from "$app/navigation";

	let { data, children } = $props();

	onMount(() => {
		currentLib.set(page.params.id || "");
	});

	let dialogOpen = $state(false);
	let query = $state("");
	let currLib = $state("");

	let filter = $state("MusicAlbum");

	onMount(() => {
		currentLib.subscribe((l) => {
			currLib = l;
		});

		console.log(data.searchItems)
	});

	const openSearch = (e: KeyboardEvent) => {
		if ((e.metaKey || e.ctrlKey) && e.key == "k") {
			e.preventDefault()
			goto(`/library/${currLib}`)
			dialogOpen = true
		}
	}
</script>

<svelte:window onkeydown={openSearch}></svelte:window>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Jfin</title>
</svelte:head>

<div
	class="fixed left-64 right-0 top-0 bg-linear-to-b from-background to-transparent flex justify-between p-4 pl-12 pr-12 z-20"
>
	<div class="flex bg-blend-lighten gap-2">
		<Button
			variant="outline"
			class="cursor-pointer"
			onclick={() => {
				window.history.back();
			}}
		>
			<ArrowLeft />
		</Button>
		<Button
			variant="outline"
			class="cursor-pointer"
			onclick={() => {
				window.history.forward();
			}}
		>
			<ArrowRight />
		</Button>
	</div>
	<div>
		<!-- <InputGroup>
			<InputGroupInput placeholder="Search..." />
			<InputGroupAddon>
				<Search />
			</InputGroupAddon>
		</InputGroup> -->
		<Dialog bind:open={dialogOpen}>
			<DialogTrigger>
				<Button
					onclick={() => {
						goto(`/library/${currLib}`)
						dialogOpen = true	
					}}
					variant="outline"
					class="flex justify-start gap-2 cursor-pointer w-60"
				>
					<Search />
					Search...
					<KbdGroup>
						<Kbd>⌘</Kbd>
						<Kbd>K</Kbd>
					</KbdGroup>
				</Button>
			</DialogTrigger>
			<DialogContent class="flex flex-col p-12 h-160">
				<DialogHeader>
					<Label>
						<Search />
						Search your library.
					</Label>
				</DialogHeader>
				<div class="flex flex-col gap-2">
					<Input bind:value={query} placeholder="Search..." />
					<Separator />
					<ToggleGroup type="single" variant="outline">
						<ToggleGroupItem class={filter === "MusicAlbum" ? "cursor-pointer bg-secondary" : "cursor-pointer"} value="MusicAlbum" onclick={() => {filter = "MusicAlbum"}}>
							<DiscAlbum />
							Albums
						</ToggleGroupItem>
						<ToggleGroupItem class={filter === "MusicArtist" ? "cursor-pointer bg-secondary" : "cursor-pointer"} value="MusicArtist" onclick={() => {filter = "MusicArtist"}}>
							<User />
							Artists
						</ToggleGroupItem>
						<ToggleGroupItem class={filter === "Audio" ? "cursor-pointer bg-secondary" : "cursor-pointer"} value="Audio" onclick={() => {filter = "Audio"}}>
							<Music />
							Tracks
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
				<div class="overflow-y-scroll">
					{#each data.searchItems.Items as item}
						{#if item.Name.includes(query)}
							{#if item.Type === filter}
								{#if item.Type === "MusicAlbum"}
									<a href="/album/{item.Id}">
										<Item
											class="hover:bg-secondary cursor-pointer"
											onclick={() => {
												dialogOpen = false;
											}}
										>
											<ItemMedia variant="image">
												<img
													src="/api/cover/{item.Id}"
													alt=""
													class="rounded object-cover"
												/>
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{item.Name}</ItemTitle>
												<ItemDescription
													>{item.AlbumArtist}</ItemDescription
												>
											</ItemContent>
										</Item>
									</a>
								{/if}
								{#if item.Type === "MusicArtist"}
									<a href="/artist/{item.Name}">
										<Item
											class="hover:bg-secondary cursor-pointer"
											onclick={() => {
												dialogOpen = false;
											}}
										>
											<ItemMedia variant="image" class="object-cover rounded-full">
												<Cover album={item} type="artist" />
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{item.Name}</ItemTitle>
											</ItemContent>
										</Item>
									</a>
								{/if}
								{#if item.Type === "Audio"}
									<a href="/album/{item.AlbumId}">
										<Item
											class="hover:bg-secondary cursor-pointer"
											onclick={() => {
												dialogOpen = false;
											}}
										>
											<ItemMedia variant="image">
												<img
													src="/api/cover/{item.AlbumId}"
													alt=""
													class="rounded object-cover"
												/>
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{item.Name}</ItemTitle>
												<ItemDescription
													>{item.AlbumArtist}</ItemDescription
												>
											</ItemContent>
										</Item>
									</a>
								{/if}
							{/if}
						{/if}
					{/each}
				</div>
			</DialogContent>
		</Dialog>
	</div>
</div>

<ModeWatcher />
<SidebarProvider>
	<AppSidebar {data} />
	<main>
		<!-- <div class="top-bar">
			<SidebarTrigger />
		</div> -->
		{@render children()}
		<Player />
	</main>
</SidebarProvider>

<style>
	:root {
		overflow-x: hidden;
		padding-bottom: 100px;
	}
</style>

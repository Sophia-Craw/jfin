<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.png";
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
	import {
		ArrowLeft,
		ArrowRight,
		DiscAlbum,
		LibraryBig,
		Music,
		Search,
		User,
	} from "@lucide/svelte";
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
	import { goto, invalidateAll } from "$app/navigation";
	import AlertDialog from "$lib/components/ui/alert-dialog/alert-dialog.svelte";
	import AlertDialogContent from "$lib/components/ui/alert-dialog/alert-dialog-content.svelte";
	import AlertDialogHeader from "$lib/components/ui/alert-dialog/alert-dialog-header.svelte";
	import AlertDialogTitle from "$lib/components/ui/alert-dialog/alert-dialog-title.svelte";
	import Field from "$lib/components/ui/field/field.svelte";
	import AlertDialogFooter from "$lib/components/ui/alert-dialog/alert-dialog-footer.svelte";
	import AlertDialogAction from "$lib/components/ui/alert-dialog/alert-dialog-action.svelte";
	import Spinner from "$lib/components/ui/spinner/spinner.svelte";
	import { enhance } from "$app/forms";
	import { toast, Toaster } from "svelte-sonner";
	import { AlertDialogDescription } from "$lib/components/ui/alert-dialog/index.js";
    import AspectRatio from "$lib/components/ui/aspect-ratio/aspect-ratio.svelte";
	import Logo from "$lib/assets/favicon.png"

	let { data, children } = $props();
	let authLoading = $state(false);

	let dialogOpen = $state(false);
	let query = $state("");
	let currLib = $state("");

	let filter = $state("MusicAlbum");

	let selectedLib = $state("");

	onMount(() => {
		currentLib.set(data.User.Lib || page.params.id || "");

		if (data.User.Lib) {
			goto("/library/" + data.User.Lib)
		}

		currentLib.subscribe((l) => {
			currLib = l;
		});
	});

	const openSearch = (e: KeyboardEvent) => {
		if (
			(e.metaKey || e.ctrlKey) &&
			e.key == "k"
		) {
			e.preventDefault();
			goto(`/library/${currLib}`);
			dialogOpen = true;
		}
	};
</script>

<svelte:window onkeydown={openSearch} />

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Jfin</title>
</svelte:head>

<Toaster theme="system" />

<div id="draggable" class="fixed top-0 left-0 right-0 p-1.5 bg-background z-1000 flex flex-row-reverse gap-1 pr-3">
	<Label class="font-extrabold">Jfin</Label>
	<img class="w-5 h-5 object-contain" src={Logo} alt="">
</div>

<AlertDialog open={data.User.Name ? false : true}>
	<AlertDialogContent class="w-80">
		<AlertDialogHeader>
			<AlertDialogTitle>Login to Jellyfin</AlertDialogTitle>
		</AlertDialogHeader>
		<form
			action="?/login"
			method="POST"
			class="flex flex-col gap-2"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type !== "success") {
						authLoading = false;
						toast.message("Failed to login...");
						await update();
					} else {
						await update();
					}
				};
			}}
			onsubmit={() => {
				authLoading = true;
			}}
		>
			<Input
				required
				name="address"
				type="text"
				placeholder="Jellyfin Address"
			/>
			<Separator />
			<Input required name="user" type="text" placeholder="User" />
			<Input
				required
				name="password"
				type="password"
				placeholder="Password"
			/>
			<AlertDialogFooter>
				<AlertDialogAction
					type="submit"
					disabled={authLoading ? true : false}
					class="cursor-pointer"
				>
					{#if authLoading}
						<Spinner />
					{/if}
					Login
				</AlertDialogAction>
			</AlertDialogFooter>
		</form>
	</AlertDialogContent>
</AlertDialog>

<AlertDialog open={data.User.Id && data.User.Lib === ""}>
	<AlertDialogContent>
		<AlertDialogHeader class="flex gap-2">
			<LibraryBig class="relative top-3" />
			<div>
				<AlertDialogTitle>
					Select a library.
				</AlertDialogTitle>
				<AlertDialogDescription>
					This will be your default library.
				</AlertDialogDescription>
			</div>
		</AlertDialogHeader>
		<Separator />
		<form
			action="?/libset"
			method="post"
			use:enhance={async () => {
				return async ({ result, update }) => {
					if (result.type !== "success") {
						toast.message("Failed to set library...");
						await update();
					} else {
						await invalidateAll()
						await goto("/library/" + result.data?.message)
					}
				};
			}}
		>
			<input type="hidden" name="lib" bind:value={selectedLib}>
			{#each data.Libraries.Items as lib}
				<Item class={lib.Id === selectedLib ? "cursor-pointer bg-secondary" : "cursor-pointer hover:bg-secondary"} onclick={() => {
					selectedLib = lib.Id
				}}>
					<ItemMedia variant="image">
						<!-- <img
							src="/api/cover/{lib.Id}"
							alt=""
							class="rounded object-cover"
						/> -->
						<Cover album={lib} type="embedded" />
					</ItemMedia>
					<ItemContent>
						<ItemTitle>{lib.Name}</ItemTitle>
					</ItemContent>
				</Item>
			{/each}
			<AlertDialogFooter class="p-2">
				<AlertDialogAction disabled={ selectedLib ? false : true } class="cursor-pointer" type="submit">
					Choose
				</AlertDialogAction>
			</AlertDialogFooter>
		</form>
	</AlertDialogContent>
</AlertDialog>

<div
	class="fixed left-64 right-0 top-0 bg-linear-to-b from-background to-transparent flex justify-between p-4 pl-12 pt-12 pr-12 z-20"
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
						goto(`/library/${currLib}`);
						dialogOpen = true;
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
						<ToggleGroupItem
							class={filter === "MusicAlbum"
								? "cursor-pointer bg-secondary"
								: "cursor-pointer"}
							value="MusicAlbum"
							onclick={() => {
								filter = "MusicAlbum";
							}}
						>
							<DiscAlbum />
							Albums
						</ToggleGroupItem>
						<ToggleGroupItem
							class={filter === "MusicArtist"
								? "cursor-pointer bg-secondary"
								: "cursor-pointer"}
							value="MusicArtist"
							onclick={() => {
								filter = "MusicArtist";
							}}
						>
							<User />
							Artists
						</ToggleGroupItem>
						<ToggleGroupItem
							class={filter === "Audio"
								? "cursor-pointer bg-secondary"
								: "cursor-pointer"}
							value="Audio"
							onclick={() => {
								filter = "Audio";
							}}
						>
							<Music />
							Tracks
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
				<div class="overflow-y-scroll">
					{#each data.searchItems?.Items as item}
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
												<ItemTitle
													>{item.Name}</ItemTitle
												>
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
											<ItemMedia
												variant="image"
												class="object-cover rounded-full"
											>
												<Cover
													album={item}
													type="artist"
												/>
											</ItemMedia>
											<ItemContent>
												<ItemTitle
													>{item.Name}</ItemTitle
												>
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
												<ItemTitle
													>{item.Name}</ItemTitle
												>
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

<div class="app">
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
</div>


<style>
	:root {
		overflow-x: hidden;
		padding-bottom: 100px;
		background-color: black;
	}

	.app {
		position: relative;
		top: 20px;
	}

	#draggable {
		-webkit-app-region: drag;
	}
</style>

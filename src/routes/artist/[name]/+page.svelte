<script lang="ts">
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import { fade } from 'svelte/transition';
    import Placeholder from "$lib/assets/PlaceholderArtist.png"
    import { onMount } from 'svelte';
    import Item from '$lib/components/ui/item/item.svelte';
    import ItemHeader from '$lib/components/ui/item/item-header.svelte';
    import Cover from '$lib/components/Cover.svelte';
    import ItemContent from '$lib/components/ui/item/item-content.svelte';
    import ItemTitle from '$lib/components/ui/item/item-title.svelte';
    import ItemDescription from '$lib/components/ui/item/item-description.svelte';
    import Label from '$lib/components/ui/label/label.svelte';

    const { data } = $props() 

    let banner = $state("");
    
    onMount(() => {
        banner = "/api/cover/" + data.ArtistInfo.Id
    })
</script>

<main class="flex flex-col gap-2">
    <div class="w-full">
        {#key data.ArtistInfo.Name}
            <img in:fade={{duration: 500}} class="h-70 object-cover w-dvw mask-b-from-1 md:object-center blur-md" onerror={() => {banner = "/api/cover/" + data.ArtistAlbums.Items[0].Id}} src={banner} alt="">
        {/key}
    </div>
    <div class="flex p-20 pb-4 pt-3">
        <h1 class="text-6xl font-extrabold bg-background sticky top-0">{data.ArtistInfo.Name}</h1>
    </div>
    <Separator />
    <div class="p-5 pl-20 pr-20 text-zinc-500">
        <Label class="font-extrabold">Albums: {data.ArtistAlbums.Items.length}</Label>
    </div>
    <div class="flex flex-wrap p-12 pt-0 pl-14 pr-14">
        {#each data.ArtistAlbums.Items as album}
            <a href={"/album/" + album.Id}>
                <Item class="hover:opacity-50 pt-0">
                    <ItemHeader>
                        <Cover album={album} type={"library"} />
                    </ItemHeader>
                    <ItemContent class="w-0">
                        <ItemTitle class="flex w-full text-center justify-center">{album.Name}</ItemTitle>
                        <ItemDescription class="text-center">{album.AlbumArtist}</ItemDescription>
                    </ItemContent>
                </Item>
            </a>
        {/each}
    </div>
</main>
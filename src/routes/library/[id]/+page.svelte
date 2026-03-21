<script>
    import { navigating, page } from '$app/state';
    import Cover from '$lib/components/Cover.svelte';
    import ItemContent from '$lib/components/ui/item/item-content.svelte';
    import ItemDescription from '$lib/components/ui/item/item-description.svelte';
    import ItemHeader from '$lib/components/ui/item/item-header.svelte';
    import ItemTitle from '$lib/components/ui/item/item-title.svelte';
    import Item from '$lib/components/ui/item/item.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
    import { currentLib } from '$lib/stores.js';
    import { onMount } from 'svelte';

    const { data } = $props()

    onMount(() => {
        currentLib.set(page.params.id || "")
    })
</script>

<main>
    <h1 class="sticky top-0 p-4 m-0 font-extrabold text-3xl bg-black w-full z-3 border-b-2">Albums</h1>
    <div class="flex flex-wrap mt-5">
        {#each data.Items as album}
            <a href={"/album/" + album.Id}>
                <Item class="hover:opacity-50">
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

<style>
    main {
        padding: 20px;
        padding-left: 2rem;
        padding-right: 2rem;
    }

    /* h1 {
        position: sticky;
        top: 0;
        font-size: 1.5rem;
        font-weight: 800;
        display: flex;
        gap: 12px;
        background-color: #0a0a0a;
        padding: 12px;
        padding-left: 0;
        z-index: 3;
        border-style: none;
        border-bottom-style: solid;
        border-width: 1px;
    } */

    /* .album-list {
        display: flex;
        gap: 12px;
        padding-top: 20px;
        flex-wrap: wrap;
    } */
</style>
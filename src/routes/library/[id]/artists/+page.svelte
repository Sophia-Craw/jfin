<script>
    import Cover from '$lib/components/Cover.svelte';
    import ItemContent from '$lib/components/ui/item/item-content.svelte';
    import ItemDescription from '$lib/components/ui/item/item-description.svelte';
    import ItemHeader from '$lib/components/ui/item/item-header.svelte';
    import ItemTitle from '$lib/components/ui/item/item-title.svelte';
    import Item from '$lib/components/ui/item/item.svelte';

    const { data } = $props()
</script>

<main>
    <h1 class="sticky top-0 p-4 m-0 font-extrabold text-3xl bg-black w-full z-3 border-b-2">Artists</h1>
    <div class="flex flex-wrap mt-5">
        {#each data.Items as artist}
            <a href={"/artist/" + artist.Name}>
                <Item class="hover:opacity-50">
                    <ItemHeader>
                        <Cover album={artist} type={"artist"} />
                    </ItemHeader>
                    <ItemContent class="w-0">
                        <h1 class="text-center">{artist.Name}</h1>
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
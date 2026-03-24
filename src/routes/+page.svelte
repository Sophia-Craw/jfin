<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import Cover from "$lib/components/Cover.svelte";
    import ItemContent from "$lib/components/ui/item/item-content.svelte";
    import ItemDescription from "$lib/components/ui/item/item-description.svelte";
    import ItemHeader from "$lib/components/ui/item/item-header.svelte";
    import ItemTitle from "$lib/components/ui/item/item-title.svelte";
    import Item from "$lib/components/ui/item/item.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import { currentLib } from "$lib/stores";
    import { DiscAlbum, Library } from "@lucide/svelte";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    const { data } = $props();
</script>

<main class="mt-20">

    <div class="flex flex-col gap-12 pl-3 pr-3 justify-center">
        <div class="flex flex-col gap-1">
            <Label>
                <Library />
                Libraries
            </Label>
            <div class="flex gap-4 pt-3 flex-wrap">
                {#each data.Libraries.Items as item}
                    <a href={"/library/" + item.Id}>
                        <div class="item">
                            <Cover album={item} type="library" />
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </div>
</main>

<style>
    main {
        padding: 20px;
        padding-left: 2rem;
        padding-right: 2rem;
    }

    .item {
        transition: 0.12s;
        cursor: pointer;
    }

    .item:hover {
        opacity: 50%;
    }
</style>

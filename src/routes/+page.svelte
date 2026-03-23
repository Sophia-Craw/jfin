<script>
    import Label from "$lib/components/ui/label/label.svelte";
    import { Library } from "@lucide/svelte";

    const { data } = $props()
</script>


<main>
    <Label>
        <Library />
        Libraries
    </Label>
    <div class="library-list">
        {#each data.Libraries.Items as item}
            {#if item.Type == "Folder"}
                <a href={"/library/" + item.Id}>
                    <div class="item">
                        <img class="lib-cover" src={"/api/cover/" + item.Id} alt="">
                    </div>
                </a>
            {/if}
        {/each}
    </div>
</main>

<style>
    main {
        padding: 20px;
        padding-left: 2rem;
        padding-right: 2rem;
        width: 100dvw;
    }

    .library-list {
        display: flex;
        gap: 12px;
        padding-top: 20px;
        flex-wrap: wrap;
    }

    .item {
        transition: 0.12s;
        cursor: pointer;
    }

    .item:hover {
        opacity: 50%;
    }

    .lib-cover {
        width: 230px;
        height: 130px;
        border-radius: 12px;
        object-fit: cover;
    }
</style>
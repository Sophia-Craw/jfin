<script lang="ts">
    import { fade } from "svelte/transition";
    import Skeleton from "./ui/skeleton/skeleton.svelte";
    import PlaceholderArtist from "$lib/assets/PlaceholderArtist.png";
    import PlaceholderAlbum from "$lib/assets/PlaceholderAlbum.png";

    const { album, type } = $props();

    let loaded = $state(false);
    let error = $state(false);
</script>

{#if !loaded && type !== "artist"}
    <Skeleton class="size-42" />
{/if}

{#if !loaded && type == "artist"}
    <Skeleton class="size-42 rounded-full" />
{/if}

{#if type !== "artist"}
    {#key loaded}
        <img
            in:fade={{ duration: 500 }}
            src={error
                ? PlaceholderAlbum
                : type === "album"
                ? "/api/cover/" + album.AlbumId
                : "/api/cover/" + album.Id}
            onload={() => {
                loaded = true;
            }}
            onerror={() => {
                error = true;
            }}
            class={type !== "album" ? "album-cover" : "album-cover-static"}
            style={loaded ? "" : "display: none"}
            alt=""
        />
    {/key}
{:else if type !== "embedded"}
    {#key loaded}
        <img
            in:fade={{ duration: 500 }}
            src={error ? PlaceholderArtist : `/api/cover/${album.Id}`}
            onload={() => {
                loaded = true;
            }}
            onerror={() => {
                error = true;
            }}
            class="artist-cover"
            style={loaded ? "" : "display: none;"}
            alt=""
        />        
    {/key}
{/if}

<style>
    .album-cover {
        width: 170px;
        height: 170px;
        min-width: 170px;
        min-height: 170px;
        border-radius: 8px;
        transition: 0.12s;
        cursor: pointer;
        margin-left: auto;
        margin-right: auto;
    }

    .artist-cover {
        width: 170px;
        height: 170px;
        min-width: 170px;
        min-height: 170px;
        border-radius: 500px;
        transition: 0.12s;
        cursor: pointer;
        margin-left: auto;
        margin-right: auto;
    }

    .album-cover-static {
        width: 170px;
        height: 170px;
        min-width: 170px;
        min-height: 170px;
        border-radius: 8px;
        transition: 0.12s;
    }
</style>

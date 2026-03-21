<script lang="ts">
    import Cover from '$lib/components/Cover.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import Slider from '$lib/components/ui/slider/slider.svelte';
    import TableBody from '$lib/components/ui/table/table-body.svelte';
    import TableCell from '$lib/components/ui/table/table-cell.svelte';
    import TableHead from '$lib/components/ui/table/table-head.svelte';
    import TableHeader from '$lib/components/ui/table/table-header.svelte';
    import TableRow from '$lib/components/ui/table/table-row.svelte';
    import Table from '$lib/components/ui/table/table.svelte';
    import { currentPlaying, queue, startingIndex } from '$lib/stores.js';
    import type { Track } from '$lib/types.js';
    import { onMount } from 'svelte';

    const { data } = $props()

    let currTrack: string = $state("")

    onMount(() => {
        currentPlaying.subscribe((t) => {
            currTrack = t.Id

            console.log(t)
        })
    })

    const handleTrackSelect = (tk: Track, index: number) => {
        queue.set(data.Tracks.Items)
        startingIndex.set(index)
        currentPlaying.set(tk)
    }
</script>

<main>
    <div class="info-root">
        <div class="image">
            <!-- <img class="glow-img" src={"/api/cover/" + data.AlbumInfo[0].AlbumId} alt=""> -->
            <Cover album={data.AlbumInfo[0]} type="album" />
        </div>
        <div class="info">
            <a href="/artist/{data.AlbumInfo[0].AlbumArtist}">
                <p class="hover:underline">{data.AlbumInfo[0].AlbumArtist}</p>
            </a>
            <h1>{data.AlbumInfo[0].Album}</h1>
        </div>
    </div>
    <Separator />
    <Table style="width: 72dvw; min-width: 72dvw; max-width: 72dvw ;">
        <TableHeader>
            <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Album</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {#each data.Tracks.Items as track, idx}
                <TableRow onclick={() => {handleTrackSelect(track, idx)}} style={`transition: 0.12s; cursor: pointer; color: ${currTrack === track.Id ? "#ff8d6c" : "white"};`}>
                    <TableCell style={currTrack === track.Id ? `color: #ff8d6c;` : `color: gray`}>{currTrack === track.Id ? "▶" : idx + 1}</TableCell>
                    <TableCell>{track.Name}</TableCell>
                    <TableCell style={currTrack === track.Id ? `color: #ff8d6c;` : `color: gray`}>{track.Artists[0]}</TableCell>
                    <TableCell style={currTrack === track.Id ? `color: #ff8d6c;` : `color: gray`}>{track.Album}</TableCell>
                </TableRow>
            {/each}
        </TableBody>
    </Table>
</main>

<style>
    main {
        padding: 20px;
        padding-left: 3rem;
        padding-right: 3rem;
    }

    h1 {
        font-size: 3rem;
        font-weight: 800;
    }

    .info-root {
        padding: 20px;
        display: flex;
        gap: 20px;
    }

    /* .cover {
        position: relative;
        width: 224px;
        height: 224px;
        min-width: 14rem;
        min-height: 14rem;
        border-radius: 12px;
        z-index: 2;
        object-fit: cover;
    } */

    /* .glow-img {
        width: 14rem;
        height: 14rem;
        position: absolute;
        z-index: 1;
        filter: blur(100px) opacity(50%);
    } */

    .info {
        display: flex;
        flex-direction: column-reverse;
    }
</style>

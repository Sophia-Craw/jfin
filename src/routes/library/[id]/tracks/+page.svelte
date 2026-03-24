<script lang="ts">
    import { page } from "$app/state";
    import TableBody from "$lib/components/ui/table/table-body.svelte";
    import TableCell from "$lib/components/ui/table/table-cell.svelte";
    import TableHead from "$lib/components/ui/table/table-head.svelte";
    import TableHeader from "$lib/components/ui/table/table-header.svelte";
    import TableRow from "$lib/components/ui/table/table-row.svelte";
    import Table from "$lib/components/ui/table/table.svelte";
    import { currentPlaying, queue, startingIndex } from "$lib/stores";
    import type { Track } from "$lib/types.js";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    const { data } = $props();

    let currTrack = $state("");

    onMount(() => {
        currentPlaying.subscribe((t) => {
            currTrack = t.Id;
        });
    });

    const handleTrackSelect = (tk: Track, index: number) => {
        queue.set(data.Items);
        startingIndex.set(index);
        currentPlaying.set(tk);
    };
</script>

<main in:fade={{ duration: 500 }} class="flex flex-col gap-2 w-dvw pl-12 pr-75 pb-12">
    <h1
        class="sticky top-0 pt-26 p-12 pl-0 pb-4 m-0 font-extrabold text-3xl bg-background w-full z-3 border-b-2"
    >
        All Tracks
    </h1>
    <Table>
        <TableHeader class="bg-background">
            <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Album</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {#each data.Items as track, idx}
                <TableRow
                    onclick={() => {
                        handleTrackSelect(track, idx);
                    }}
                    style={`transition: 0.12s; cursor: pointer; color: ${currTrack === track.Id ? "#ff8d6c" : "white"};`}
                >
                    <TableCell
                        style={currTrack === track.Id
                            ? `color: #ff8d6c;`
                            : `color: gray`}
                        >{currTrack === track.Id ? "▶" : idx + 1}</TableCell
                    >
                    <TableCell>{track.Name}</TableCell>
                    <TableCell
                        style={currTrack === track.Id
                            ? `color: #ff8d6c;`
                            : `color: gray`}>{track.Artists[0]}</TableCell
                    >
                    <TableCell
                        style={currTrack === track.Id
                            ? `color: #ff8d6c;`
                            : `color: gray`}>{track.Album}</TableCell
                    >
                </TableRow>
            {/each}
        </TableBody>
    </Table>
</main>

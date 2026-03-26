<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";
    import DropdownMenuContent from "$lib/components/ui/dropdown-menu/dropdown-menu-content.svelte";
    import DropdownMenuItem from "$lib/components/ui/dropdown-menu/dropdown-menu-item.svelte";
    import DropdownMenuTrigger from "$lib/components/ui/dropdown-menu/dropdown-menu-trigger.svelte";
    import DropdownMenu from "$lib/components/ui/dropdown-menu/dropdown-menu.svelte";
    import TableBody from "$lib/components/ui/table/table-body.svelte";
    import TableCell from "$lib/components/ui/table/table-cell.svelte";
    import TableHead from "$lib/components/ui/table/table-head.svelte";
    import TableHeader from "$lib/components/ui/table/table-header.svelte";
    import TableRow from "$lib/components/ui/table/table-row.svelte";
    import Table from "$lib/components/ui/table/table.svelte";
    import { currentPlaying, queue, startingIndex } from "$lib/stores";
    import type { Track } from "$lib/types.js";
    import { Album, DiscAlbum, List, ListPlus, MoreHorizontal } from "@lucide/svelte";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import { fade } from "svelte/transition";

    const { data } = $props();

    let currTrack = $state("");

    let que: Array<Track> = $state([{
        Name: "",
        Id: "",
        AlbumId: "",
        AlbumArtist: "",
        Album: ""
    }])

    onMount(() => {
        currentPlaying.subscribe((t) => {
            currTrack = t.Id;
        });

        queue.subscribe((q) => {
            que = q
        })
    });

    const handleTrackSelect = (tk: Track, index: number) => {
        queue.set(data.Items);
        startingIndex.set(index);
        currentPlaying.set(tk);
    };

    const addToQueue = (track: Track) => {
        que.push(track)
        queue.set(que)
    }
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
                <TableHead></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {#each data.Items as track, idx}
                <TableRow style={`transition: 0.12s; cursor: pointer; color: ${currTrack === track.Id ? "#ff8d6c" : "white"};`}>
                    <TableCell
                        style={currTrack === track.Id
                            ? `color: #ff8d6c;`
                            : `color: gray`}
                        >{currTrack === track.Id ? "▶" : idx + 1}</TableCell
                    >
                    <TableCell
                        onclick={() => {
                            handleTrackSelect(track, idx);
                        }}
                    >
                        {track.Name}
                    </TableCell>
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
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="secondary" class="hover:cursor-pointer">
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent class="relative w-50 right-12">
                                <DropdownMenuItem class="hover:cursor-pointer" onclick={() => {
                                    goto("/album/" + track.AlbumId)
                                }}>
                                    <DiscAlbum />
                                    Go to Album
                                </DropdownMenuItem>
                                <DropdownMenuItem class="hover:cursor-pointer" onclick={() => {
                                    addToQueue(track)
                                    toast.message("Added " + track.Name + " to the queue.")
                                }}>
                                    <ListPlus />
                                    Add to Queue
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            {/each}
        </TableBody>
    </Table>
</main>

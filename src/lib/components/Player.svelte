<script lang="ts">
    import { currentPlaying, queue, startingIndex } from "$lib/stores";
    import type { Track } from "$lib/types";
    import { onMount } from "svelte";
    import Placeholder from "$lib/assets/PlaceholderAlbum.png";
    import Slider from "./ui/slider/slider.svelte";
    import {
        Album,
        DiscAlbum,
        List,
        MoreHorizontal,
        Pause,
        Play,
        Repeat,
        Repeat1,
        SkipBack,
        SkipForward,
        Trash,
        Volume,
        Volume2,
        VolumeOff,
    } from "@lucide/svelte";
    import Button from "./ui/button/button.svelte";
    import Popover from "./ui/popover/popover.svelte";
    import PopoverTrigger from "./ui/popover/popover-trigger.svelte";
    import PopoverContent from "./ui/popover/popover-content.svelte";
    import Item from "./ui/item/item.svelte";
    import ItemMedia from "./ui/item/item-media.svelte";
    import ItemContent from "./ui/item/item-content.svelte";
    import ItemTitle from "./ui/item/item-title.svelte";
    import ItemDescription from "./ui/item/item-description.svelte";
    import Separator from "./ui/separator/separator.svelte";
    import ItemActions from "./ui/item/item-actions.svelte";
    import DropdownMenu from "./ui/dropdown-menu/dropdown-menu.svelte";
    import DropdownMenuTrigger from "./ui/dropdown-menu/dropdown-menu-trigger.svelte";
    import DropdownMenuContent from "./ui/dropdown-menu/dropdown-menu-content.svelte";
    import DropdownMenuItem from "./ui/dropdown-menu/dropdown-menu-item.svelte";
    import { goto } from "$app/navigation";

    let audio: HTMLAudioElement;
    let currTime = $state(0);
    let duration = $state(0);
    let playState = $state(true);
    let mute = $state(false);
    let volume = $state(1);

    let repeat = $state(0);

    let track: Track = $state({
        Name: "",
        Id: "",
        Album: "",
        AlbumArtist: "",
        AlbumId: "",
    });

    let pos = 0;
    let openq = $state(false);
    let que: Array<Track> = $state([
        {
            Name: "",
            Id: "",
            Album: "",
            AlbumArtist: "",
            AlbumId: "",
        },
    ]);

    let cover: HTMLImageElement;

    let scrubPct = $derived(duration > 0 ? (currTime / duration) * 100 : 0);
    let volumePct = $derived(volume * 100);

    onMount(() => {
        currentPlaying.subscribe((t) => {
            console.log(pos);
            track = t;
            if (audio) {
                duration = audio.duration;
                cover.src = t.AlbumId ? "/api/cover/" + t.AlbumId : Placeholder;
                audio.src = "/api/track/" + t.Id + "/stream";
                audio.play();
            }
        });

        startingIndex.subscribe((i) => {
            pos = i;
        });

        queue.subscribe((list) => {
            que = list;
        });
    });

    const handleEnd = () => {
        console.log(pos);
        if (repeat === 1) {
            pos++;
            if (pos >= que.length) {
                pos = 0;
            }
            currentPlaying.set(que[pos]);
        } else {
            pos++;
            if (pos >= que.length) {
                return;
            }
            currentPlaying.set(que[pos]);
        }
    };

    const handleForward = () => {
        handleEnd();
    };

    const handleBack = () => {
        console.log(pos);
        if (repeat === 1) {
            pos--;
            if (pos <= 0) {
                pos = que.length;
            }
            currentPlaying.set(que[pos]);
        } else {
            pos--;
            if (pos! < 0) {
                pos = 0;
            }
            currentPlaying.set(que[pos]);
        }
    };

    const removeTrackFromQueue = (track: Track) => {
        if (track) {
            que = que.filter((t) => t.Id !== track.Id)
        }
    }
</script>

<audio
    bind:this={audio}
    bind:paused={playState}
    bind:currentTime={currTime}
    bind:volume
    bind:muted={mute}
    loop={repeat === 2 ? true : false}
    bind:duration
    onended={handleEnd}
></audio>

<main>
    <div class="track-info">
        <div class="cover-container">
            <img bind:this={cover} src={Placeholder} class="cover" alt="" />
        </div>
        <div class="info">
            <a href={"/album/" + track.AlbumId}>
                <h3>{track.Name ? track.Name : ""}</h3>
            </a>
            <a href="/artist/{track.AlbumArtist}">
                <p>{track.AlbumArtist ? track.AlbumArtist : ""}</p>
            </a>
        </div>
    </div>
    <div class="controls">
        <div class="scrubber">
            <input
                class="slider"
                type="range"
                bind:value={currTime}
                max={duration}
                disabled={playState ? true : false}
                step={1}
                style="--range-progress: {scrubPct}%"
            />
        </div>
        <div class="control">
            <div>
                <Button
                    style="cursor: pointer;"
                    variant={repeat > 0 ? "secondary" : "ghost"}
                    onclick={() => {
                        if (repeat === 2) {
                            repeat = 0;
                        } else {
                            repeat++;
                        }
                    }}
                >
                    {#if repeat < 2}
                        <Repeat fill={"white"} stroke={"white"} />
                    {:else}
                        <Repeat1 fill={"white"} stroke={"white"} />
                    {/if}
                </Button>
            </div>
            <div class="main-controls">
                <Button
                    style="cursor: pointer;"
                    variant="ghost"
                    onclick={handleBack}
                >
                    <SkipBack fill={"white"} stroke={"white"} />
                </Button>
                <Button
                    style="cursor: pointer;"
                    onclick={() => {
                        playState ? audio.play() : audio.pause();
                    }}
                >
                    {#if playState}
                        <Play fill={"black"} stroke={"black"} />
                    {:else}
                        <Pause fill={"black"} stroke={"black"} />
                    {/if}
                </Button>
                <Button
                    style="cursor: pointer;"
                    variant="ghost"
                    onclick={handleForward}
                >
                    <SkipForward fill={"white"} stroke={"white"} />
                </Button>
            </div>
            <div>
                {#if que.length > 0 && track.Id}
                    <Popover bind:open={openq}>
                        <PopoverTrigger>
                            <Button style="cursor: pointer;" variant={openq ? "secondary" : "ghost"}>
                                <List fill={"white"} stroke={"white"} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-100">
                            <Item variant="default" class="overflow-hidden">
                                <ItemMedia variant="image">
                                    <img
                                        src="/api/cover/{track.AlbumId}"
                                        alt={track.Name}
                                        width="32"
                                        height="32"
                                        class="size-8 rounded object-cover"
                                    />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle class="line-clamp-1"
                                        >{track.Name} -
                                        <span class="text-muted-foreground"
                                            >{track.Album}</span
                                        ></ItemTitle
                                    >
                                    <ItemDescription class="line-clamp-1"
                                        >{track.AlbumArtist}</ItemDescription
                                    >
                                </ItemContent>
                                <Separator />
                                <div class="overflow-x-scroll max-h-100 w-full ">
                                    {#each que as qTrack, idx}
                                        <Item class="p-0">
                                            <ItemContent class="flex flex-nowrap p-2 cursor-pointer hover:bg-secondary transition-normal rounded-md w-full" onclick={() => {
                                                currentPlaying.set(qTrack)
                                                startingIndex.set(idx)
                                            }}>
                                                <ItemTitle
                                                    class="line-clamp-1"
                                                    style={track.Id === qTrack.Id
                                                        ? "color: #ff8d6c;"
                                                        : "color: inherit;"}
                                                    >{qTrack.Name} -
                                                    <span class="text-muted-foreground"
                                                        >{qTrack.Album}</span
                                                    ></ItemTitle
                                                >
                                                <ItemDescription class="line-clamp-1"
                                                    >{qTrack.AlbumArtist}</ItemDescription
                                                >
                                            </ItemContent>
                                            <ItemActions>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Button variant="ghost" class="cursor-pointer">
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent class="w-50">
                                                        <DropdownMenuItem class="cursor-pointer" onclick={() => {
                                                            goto("/album/" + qTrack.AlbumId)
                                                        }}>
                                                            <DiscAlbum />
                                                            Go to Album
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem variant="destructive" class="cursor-pointer" onclick={() => {
                                                            removeTrackFromQueue(qTrack)
                                                        }}>
                                                            <Trash />
                                                            Remove from queue
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </ItemActions>
                                        </Item>
                                    {/each}
                                </div>
                            </Item>
                        </PopoverContent>
                    </Popover>
                {:else}
                    <Button style="cursor: pointer;" variant="ghost">
                        <List fill={"white"} stroke={"white"} />
                    </Button>
                {/if}
            </div>
        </div>
    </div>
    <div class="volume-controls">
        <Button
            style="cursor: pointer"
            variant="outline"
            onclick={() => {
                mute = !mute;
            }}
        >
            {#if mute}
                <VolumeOff fill={"white"} stroke={"white"} />
            {:else}
                <Volume2 fill={"white"} stroke={"white"} />
            {/if}
        </Button>
        <input
            disabled={mute}
            class="volume-slider"
            bind:value={volume}
            step={0.1}
            max={1}
            min={0}
            type="range"
            id=""
            style="--range-progress: {volumePct}%"
        />
    </div>
</main>

<style>
    main {
        bottom: 0;
        left: 250px;
        right: 0;
        position: fixed;
        /* background-image: linear-gradient(transparent, #0a0a0a, #0a0a0a); */
        background-color: #0a0a0a;
        padding: 12px;
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        justify-content: space-between;
        border: none;
        border-top-style: solid;
        border-width: 1px;
        border-color: #3434348a;
    }

    .track-info {
        display: flex;
        gap: 12px;
        width: 200px;
        overflow: hidden;
        mask: linear-gradient(
            90deg,
            white,
            white,
            white,
            white,
            white,
            white,
            transparent
        );
    }

    .cover {
        width: 60px;
        height: 60px;
        min-width: 60px;
        min-height: 60px;
        border-radius: 8px;
    }

    h3 {
        font-size: 1.2rem;
        font-weight: 800;
        white-space: nowrap;
    }

    h3:hover {
        text-decoration: underline;
    }

    p {
        color: gray;
        white-space: nowrap;
    }

    p:hover {
        text-decoration: underline;
    }

    .info {
        position: relative;
        top: 4px;
    }

    .controls {
        display: flex;
        flex-direction: column;
        /* gap: 5px; */
    }

    .slider {
        width: 400px;
    }

    .control {
        display: flex;
        justify-content: space-between;
    }

    .main-controls {
        display: flex;
        gap: 5px;
    }

    .volume-controls {
        display: flex;
        gap: 5px;
        padding: 12px;
    }

    .volume-slider {
        width: 100px;
    }

    .volume-slider:disabled {
        opacity: 50%;
    }

    /* 1. Reset Slider */
    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
    }

    input[type="range"]:focus {
        outline: none;
    }

    /* WEBKIT */

    input[type="range"]::-webkit-slider-runnable-track {
        height: 0.3rem;
        border-radius: 500px;
        background: linear-gradient(
            to right,
            #ffffff 0,
            #ffffff var(--range-progress, 0%),
            #1c1c1c var(--range-progress, 0%),
            #1c1c1c 100%
        );
    }

    /* Thumb */
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        margin-top: -2px;
        background-color: #ffffff;
        height: 0.6rem;
        width: 0.6rem;
        border-radius: 50%;
        border: 2px solid white;
    }

    /* FIREFOX */

    /* Track */
    input[type="range"]::-moz-range-track {
        background: #343434;
        height: 0.3rem;
        border-radius: 9999px;
        cursor: pointer;
    }

    /* Thumb */
    input[type="range"]::-moz-range-thumb {
        background-color: #ffffff;
        height: 0.3rem;
        width: 0.3rem;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: 0.12s;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb:hover {
        height: 0.5rem;
        width: 0.5rem;
    }

    input[type="range"]::-moz-range-progress {
        background-color: #ffffff;
        border-radius: 500px;
        height: 0.3rem;
    }
</style>

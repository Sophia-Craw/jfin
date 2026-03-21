import { writable } from "svelte/store";
import type { Track } from "./types";
import { page } from "$app/state";

export const currentLib = writable<string>("")

export const currentPlaying = writable<Track>({
    Name: "",
    Id: "",
    Album: "",
    AlbumArtist: "",
    AlbumId: ""
})
export const queue = writable<Array<Track>>([{
    Name: "",
    Id: "",
    Album: "",
    AlbumArtist: "",
    AlbumId: ""
}])

export const startingIndex = writable<number>(0);
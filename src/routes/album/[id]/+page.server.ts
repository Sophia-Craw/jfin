import { API_KEY, JELLYFIN_ADDRESS } from '$env/static/private';
import type { Track } from '$lib/types.js';


export const load = async ({ params }) => {
    const resp = await fetch(`${JELLYFIN_ADDRESS}/Items?parentId=${params.id}&recursive=true&api_key=${API_KEY}`)
    const tracks = await resp.json()

    const album = await fetch(`${JELLYFIN_ADDRESS}/Items?parentId=${params.id}&api_key=${API_KEY}`)
    const info = await album.json()

    return {
        AlbumInfo: info.Items as Array<Track>,
        Tracks: tracks
    }
};
import type { Track } from '$lib/types.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, cookies }) => {

    const user = cookies.get("user") ? JSON.parse(cookies.get("user") || "") : ""

    const resp = await fetch(`${user.User.Address}/Items?parentId=${params.id}&recursive=true&api_key=${user.User.Token}`)
    const tracks = await resp.json()

    const album = await fetch(`${user.User.Address}/Items?parentId=${params.id}&api_key=${user.User.Token}`)
    const info = await album.json()

    if (cookies.get("user")) {
        return {
            AlbumInfo: info.Items as Array<Track>,
            Tracks: tracks
        }
    } else {
        return redirect(301, "/")
    }
};
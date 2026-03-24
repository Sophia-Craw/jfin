import { redirect } from '@sveltejs/kit';

export const load = async ({ params, cookies }) => {

    const user = cookies.get("user") ? JSON.parse(cookies.get("user") || "") : ""

    const resp = await fetch(`${user.User.Address}/Artists/${params.name}?api_key=${user.User.Token}`)
    const data = await resp.json()

    const albumResp = await fetch(`${user.User.Address}/Items?ArtistIds=${data.Id}&IncludeItemTypes=MusicAlbum&recursive=true&api_key=${user.User.Token}`)
    const albumData = await albumResp.json()

    if (cookies.get("user")) {
        return {
            ArtistInfo: data,
            ArtistAlbums: albumData
        }
    } else {
        return redirect(301, "/")
    }
};
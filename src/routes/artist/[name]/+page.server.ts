import { API_KEY, JELLYFIN_ADDRESS } from '$env/static/private';

export const load = async ({ params }) => {
    const resp = await fetch(`${JELLYFIN_ADDRESS}/Artists/${params.name}?api_key=${API_KEY}`)
    const data = await resp.json()

    const albumResp = await fetch(`${JELLYFIN_ADDRESS}/Items?ArtistIds=${data.Id}&IncludeItemTypes=MusicAlbum&recursive=true&api_key=${API_KEY}`)
    const albumData = await albumResp.json()

    return {
        ArtistInfo: data,
        ArtistAlbums: albumData
    }
};
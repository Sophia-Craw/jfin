import { API_KEY, JELLYFIN_ADDRESS } from "$env/static/private";


export const load = async ({ params }) => {
    const resp = await fetch(`${JELLYFIN_ADDRESS}/Items?api_key=${API_KEY}`)
    const data = await resp.json()

    const itemResp = await fetch(`https://jellyfin.sink.cat/Items?parentId=${params.id}&recursive=true&api_key=${API_KEY}`)
    const itemData = await itemResp.json()

    return {
        Libraries: data,
        searchItems: itemData
    }
};
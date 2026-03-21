import { API_KEY, JELLYFIN_ADDRESS } from "$env/static/private";


export const load = async () => {
    const resp = await fetch(`${JELLYFIN_ADDRESS}/Items?api_key=${API_KEY}`)
    const data = await resp.json()

    return data
};
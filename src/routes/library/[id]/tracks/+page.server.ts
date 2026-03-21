import { API_KEY, JELLYFIN_ADDRESS } from '$env/static/private';

export const load = async ({ params }) => {
    const resp = await fetch(`${JELLYFIN_ADDRESS}/Items?parentId=${params.id}&recursive=true&IncludeItemTypes=Audio&api_key=${API_KEY}`)
    const data = await resp.json()

    return data
};
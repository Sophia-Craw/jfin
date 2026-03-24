import { redirect } from '@sveltejs/kit';

export const load = async ({ params, cookies }) => {

    const user = cookies.get("user") ? JSON.parse(cookies.get("user") || "") : ""

    const resp = await fetch(`${user.User.Address}/Items?parentId=${params.id}&recursive=true&IncludeItemTypes=MusicAlbum&api_key=${user.User.Token}`)
    const albums = await resp.json()

    if (cookies.get("user")) {
        return albums
    } else {
        return redirect(301, "/")
    }
};
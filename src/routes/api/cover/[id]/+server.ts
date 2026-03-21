import { JELLYFIN_ADDRESS } from '$env/static/private';


export async function GET({ params }) {
    const resp = await fetch(JELLYFIN_ADDRESS + "/Items/" + params.id + "/Images/Primary")
    const data = resp.body;

    const headers = {
        "Content-Type": "image/jpeg"
    }

    return new Response(data, {
        headers: headers
    })
}
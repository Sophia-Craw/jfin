
export async function GET({ params, cookies }) {

    const user = cookies.get("user") ? JSON.parse(cookies.get("user") || "") : ""

    const resp = await fetch(`${user.User.Address}/Items/${params.id}/Download?api_key=${user.User.Token}`)

    const headers = {
        "Content-Type": "audio/mpeg",
        "Accept-Ranges": resp.headers.get("Accept-Ranges") || "bytes",
        "Content-Range": resp.headers.get("Content-Range")!,
        "Content-Length": resp.headers.get("Content-Length")!
    }

    if (cookies.get("user")) {
        return new Response(await resp.body, {
            status: await resp.status === 206 ? 206 : 200,
            headers: headers
        })
    } else {
        return new Response(JSON.stringify({message: "Forbidden"}), {
            status: 403
        })
    }
}
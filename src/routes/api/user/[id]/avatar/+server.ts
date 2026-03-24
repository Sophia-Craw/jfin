
export async function GET({ params, cookies }) {

    const user = cookies.get("user") ? JSON.parse(cookies.get("user") || "") : ""

    const resp = await fetch(`${user.User.Address}/UserImage?userId=${params.id}&api_key=${user.User.Token}`)
    const data = await resp.body

    if (cookies.get("user")) {
        return new Response(data, {
            headers: {
                "Content-Type": "image/jpeg"
            }
        })
    } else {
        return new Response(JSON.stringify({message: "Forbidden"}), {
            status: 403
        })
    }
}
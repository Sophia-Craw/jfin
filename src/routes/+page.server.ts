
export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData()
        const address = data.get("address")
        const username = data.get("user")
        const password = data.get("password")

        const resp = await fetch(`${address}/Users/AuthenticateByName`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `MediaBrowser Client="jfin", Device="Browser", DeviceId="34523423234", Version="1.0.0"`
            },
            body: JSON.stringify({
                "Username": username,
                "Pw": password
            })
        })

        if (resp.status !== 403) {
            const data = await resp.json()
            
            if (data.AccessToken) {
                cookies.set("user", JSON.stringify({
                    User: {
                        Name: data.User.Name,
                        Id: data.User.Id,
                        Address: address,
                        Token: data.AccessToken
                    }
                }), { path: "/" })
                return { success: true }
            } else {
                return { success: false }
            }
        } else {
            return { success: false }
        }
    }
}
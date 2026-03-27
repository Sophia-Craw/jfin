import { deviceID } from '$lib/client.js'

export const actions = {

    libset: async ({ request, cookies }) => {
        if (cookies.get("user")) {
            const user = cookies.get("user") ? JSON.parse(cookies.get("user") || "") : ""
            const data = await request.formData()
            const lib = data.get("lib")

            user.User.Lib = lib
            cookies.set("user", JSON.stringify(user), {path: "/", secure: false, httpOnly: true, sameSite: "lax", maxAge: 2592000})

            return {
                success: true,
                message: lib
            }
        } else {
            return {
                success: false
            }
        }
    },

    login: async ({ cookies, request }) => {
        const data = await request.formData()
        const address = data.get("address")
        const username = data.get("user")
        const password = data.get("password")

        const resp = await fetch(`${address}/Users/AuthenticateByName`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `MediaBrowser Client="jfin", Device="Browser", DeviceId="${deviceID}", Version="1.0.0"`
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
                        Token: data.AccessToken,
                        Lib: ""
                    }
                }), { path: "/", secure: false, httpOnly: true, sameSite: "lax", maxAge: 2592000 })
                return { success: true }
            } else {
                return { success: false }
            }
        } else {
            return { success: false }
        }
    }
}
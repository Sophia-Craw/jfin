
export const load = async ({ params, cookies }) => {

    const user = cookies.get("user") ? JSON.parse(cookies.get("user") || "") : {}

    if (!cookies.get("user")) {
        return {
            Libraries: [],
            searchItems: [],
            User: {}
        }
    }
    
    const resp = await fetch(`${user.User.Address}/UserViews?UserId=${user.User.Id}`, {
        headers: {
            "Authorization": `MediaBrowser Token="${user.User.Token}", Client="jfin", Device="Browser", DeviceId="34523423234", Version="1.0.0"`
        }
    })
    const data = await resp.json()


    const itemResp = await fetch(`${user.User.Address}/Items?userId=${user.User.Id}&ParentId=${params.id !== undefined || params.id !== null ? params.id : ""}&Recursive=true`, {
        headers: {
            "Authorization": `MediaBrowser Token="${user.User.Token}", Client="jfin", Device="Browser", DeviceId="34523423234", Version="1.0.0"`
        }
    })
    const itemData = await itemResp.json()

    if (cookies.get("user") && resp.ok) {
        return {
            Libraries: data,
            searchItems: itemData,
            User: cookies.get("user") ? JSON.parse(cookies.get("user") || "").User : {}
        }
    }
};
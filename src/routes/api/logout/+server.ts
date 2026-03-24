import { redirect } from '@sveltejs/kit'

export async function GET({ cookies }) {
    cookies.delete("user", {path: "/"})
    return redirect(301, "/")
}
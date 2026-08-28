import type { LayoutServerLoad } from "./$types";
import auth from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals, request, url }) => {
    const user = locals.user;

    if (!user) {
        const result = await auth.api.signInSocial({
            headers: request.headers,
            body: {
                provider: "discord",
                callbackURL: url.pathname + url.search
            }
        });

        locals.user = user;
        redirect(303, result.url);
    }

    return {
        user: {
            name: user.name,
            image: user.image
        }
    }
}
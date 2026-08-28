import auth from "$lib/server/auth";
import { building } from "$app/env";
import { svelteKitHandler } from "better-auth/svelte-kit";

export async function handle({ event, resolve }) {
    const session = await auth.api.getSession({
        headers: event.request.headers
    })

    if (session) {
        event.locals.user = session.user;
        event.locals.session = session.session;
    }

    const response = await svelteKitHandler({
        event,
        resolve,
        auth,
        building 
    });

    // sniff sniff
    response.headers.set("x-content-type-options", "nosniff");

    return response;
}

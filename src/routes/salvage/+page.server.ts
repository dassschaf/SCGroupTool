import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
    return {
        params: params,
        user: locals.user
    }
};
import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { DATABASE_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from "$app/env/private";
import { getRequestEvent } from "$app/server";
import { Pool } from "pg";

export default betterAuth({

    database: new Pool({
        connectionString: DATABASE_URL
    }),

    socialProviders: {
        discord: {
            clientId: DISCORD_CLIENT_ID as string,
            clientSecret: DISCORD_CLIENT_SECRET as string
        }
    },

    plugins: [
        sveltekitCookies(getRequestEvent) // <- should be the last plugin in the array
    ]
});
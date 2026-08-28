import { defineEnvVars } from "@sveltejs/kit/env";
import { building } from "$app/env";
import * as z from "zod";

export const variables = defineEnvVars({
    DISCORD_CLIENT_ID: {
        schema: building ? z.optional(z.string()) : z.string()
    },

    DISCORD_CLIENT_SECRET: {
        schema: building ? z.optional(z.string()) : z.string()
    },

    DATABASE_URL: {
        schema: building ? z.optional(z.string()) : z.string()
    }
});
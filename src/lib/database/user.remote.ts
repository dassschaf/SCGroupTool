import { getRequestEvent, query } from "$app/server"
import { sql } from 'bun';
import * as z from 'zod';
import { error } from "@sveltejs/kit";
import type { userSchema } from "better-auth";

export const getUserInfo = query(z.string(), async (userid) => {
    const { locals } = getRequestEvent();
    if (!locals.user) error(401, "Unauthorized: You are not logged in.");

    return [await sql<typeof userSchema>`
        SELECT * FROM "user" WHERE user.id = ${userid};
    `];
});

export const searchUserByName = query (z.string(), async (username) => {
    const { locals } = getRequestEvent();
    if (!locals.user) error(401, "Unauthorized: You are not logged in.");

    return await sql<typeof userSchema>`
        SELECT * FROM "user" WHERE user.name LIKE '%${username}%';
    `;
});


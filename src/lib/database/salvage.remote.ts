import { getRequestEvent, query } from "$app/server"
import { sql } from 'bun';
import * as z from 'zod';
import { error } from "@sveltejs/kit";

// Get a list of all owned salvage runs including overview info
export const getJoinedSalvageRuns = query(async () =>
{
    const { locals } = getRequestEvent();
    if (!locals.user) error(401, 'Unauthorized');

    return await sql<{
        id: number,
        owner_name: string,
        owner_image: string,
        created_at: Date,
        member_count: number,
        profit: number
    }[]>`
        SELECT
            s.id as id,
            u.name as owner_name,
            u.image as owner_image,
            s.created_at as created_at,
            COUNT(distinct m.user_id) as member_count,
            SUM(ces.cargo_amount * ces.price_per_unit - ces.fees) as profit
        FROM "salvage_runs" s
                 JOIN "user" u on s.owner_id = u.id
                 JOIN "salvage_run_membership" m on s.id = m.salvage_run_id
                 JOIN "cargo_event_summary" ces on s.id = ces.salvage_run_id
        WHERE m.user_id = ${locals.user.id}
        GROUP BY s.id, u.id;
    `;
});

export const isOwner = query(
    z.object({
        salvage_run_id: z.number().int().positive(),
        user_id: z.string()
    }),
    async ({ salvage_run_id, user_id }) =>
    {
        return await sql<boolean>`
            SELECT (s.owner_id = '${user_id}')
            FROM salvage_runs s
            WHERE s.id = ${salvage_run_id};
        `;
    }
);

export const getSalvageRunById = query(z.number().int().positive(), async (id) => {

})

// Create a salvage run as the current user, returning the ID of the new salvage run.
export const createSalvageRun = query(async () => {
    const { locals } = getRequestEvent();
    if (!locals.user) error(401, "Unauthorized: You are not logged in.");

    // create salvage run
    let id = await sql<number>`
        INSERT INTO salvage_runs (owner_id)
        VALUES ('${locals.user.id}')
        RETURNING id;
   `;

    // add owner's membership to salvage run
    let count = await sql<number>`
        INSERT INTO salvage_run_membership (salvage_run_id, user_id) 
        VALUES (${id}, '${locals.user.id}');
    `;

    return id;
});

// Add another user to the salvage run
export const addUserToSalvageRun = query(
    z.object({
        salvage_run_id: z.number().int().positive(),
        user_id: z.string()
    }),
    async ({ salvage_run_id, user_id }) => {
        const { locals } = getRequestEvent();
        if (!locals.user) error(401, "Unauthorized: Not logged in.");

        if (await sql<string>`SELECT owner_id FROM salvage_runs WHERE id = ${salvage_run_id}` !== user_id)
            error(401, "Unauthorized: You do not own the salvage run.")

        return await sql<number>`
            INSERT INTO salvage_run_membership (salvage_run_id, user_id) 
            VALUES (${salvage_run_id}, '${user_id}');
        `;
    }
);
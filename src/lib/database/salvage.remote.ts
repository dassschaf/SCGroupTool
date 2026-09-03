import {command, getRequestEvent, query} from "$app/server"
import {sql} from 'bun';
import * as z from 'zod';
import {error} from "@sveltejs/kit";

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
        profit?: number,
        is_finished: boolean
    }[]>`
        SELECT
            s.id as id,
            u.name as owner_name,
            u.image as owner_image,
            s.created_at as created_at,
            COUNT(DISTINCT m.user_id) as member_count,
            SUM(DISTINCT ces.cargo_amount * ces.price_per_unit - ces.fees) - SUM(cf.fees) as profit,
            s.is_finished as is_finished
        FROM "salvage_runs" s
                 JOIN "user" u on s.owner_id = u.id
                 JOIN "salvage_run_membership" m on s.id = m.salvage_run_id
                 LEFT JOIN "cargo_event_summary" ces on s.id = ces.salvage_run_id
                 LEFT JOIN public.claim_fees cf on s.id = cf.salvage_run_id
        WHERE m.user_id = ${locals.user.id}
        GROUP BY s.id, u.id, cf.salvage_run_id;
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

export const getSalvageRunOwnerInfo = query(
    z.number().int().positive(),
    async (srid) =>
    {
        let result = await sql<{
            name: string,
            image: string,
            id: string
        }[]>`
            SELECT
                u.name as name,
                u.image as image,
                u.id as id
            FROM
                salvage_runs s
                JOIN "user" u ON s.owner_id = u.id
            WHERE
                s.id = ${srid}
        `;

        return result[0];
    }
);

export const getSalvageRunMemberList = query(
    z.number().int().positive(),
    async (srid) => {
        return await sql<{
            name: string,
            image: string,
            was_paid: boolean,
						id: string
        }[]>`
            SELECT
                u.name,
                u.image,
                srm.was_paid,
                u.id
            FROM
                salvage_run_membership srm
                JOIN "user" u ON srm.user_id = u.id
                JOIN salvage_runs s ON srm.salvage_run_id = s.id
            WHERE
                srm.salvage_run_id = ${srid} -- and 
                -- srm.user_id != s.owner_id
        `;
    }
);

export const getSalvageRunFinancialOverview = query(z.number().int().positive(), async (srid) => {

    let claims = await sql<{
        fees: number,
        comment: string
    }[]>`
        SELECT
            fees,
            comment
        FROM claim_fees
        WHERE salvage_run_id = ${srid}
    `;

    let event_fees = await sql<{
        fees: number,
        type: string,
        station_name: string,
        system_name: string
    }[]>`
        SELECT
            ce.fees,
            ce.type,
            st.name as station_name,
            st.system as system_name
        FROM cargo_event ce
            JOIN stations st ON ce.station_id = st.id
        WHERE
            ce.salvage_run_id = ${srid}
    `;

    let sales_revenue = await sql<{
        revenue: number,
        cargo_name: string,
        station_name: string,
        system_name: string
    }[]>`
        SELECT
            ce.price_per_unit * cl.amount as revenue,
            ct.name as cargo_name,
            st.name as station_name,
            st.system as system_name
        FROM
            cargo_event ce
                JOIN cargo_lot cl on ce.id = cl.consumed_by_id
                JOIN cargo_types ct on ct.id = cl.cargo_type_id
                JOIN stations st on ce.station_id = st.id
        WHERE
            ce.type = 'SELL' and ce.price_per_unit > 0
            and ce.salvage_run_id = ${srid};
    `;

    return {
        claims: claims,
        event_fees: event_fees,
        sales_revenue: sales_revenue,
        profit:
            claims.reduce((sum, claim) => sum -= claim.fees, 0)
        +   event_fees.reduce((sum, event) => sum -= event.fees, 0)
        +   sales_revenue.reduce((sum, sale) => sum += sale.revenue, 0)
    }

});


// Create a salvage run as the current user, returning the ID of the new salvage run.
export const createSalvageRun = command(async () => {
    const { locals } = getRequestEvent();
    if (!locals.user) error(401, "Unauthorized: You are not logged in.");

    // create salvage run
    let result = (await sql<{
        id: number
    }[]>`
        INSERT INTO salvage_runs (owner_id)
        VALUES (${locals.user.id})
        RETURNING id;
   `)[0];

    // add owner's membership to salvage run
    let count = await sql<number>`
        INSERT INTO salvage_run_membership (salvage_run_id, user_id) 
        VALUES (${result.id}, ${locals.user.id}); 
    `;

    return result.id;
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
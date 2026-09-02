import type { PageServerLoad } from "./$types";
import {
    getSalvageRunFinancialOverview,
    getSalvageRunMemberList,
    getSalvageRunOwnerInfo
} from "$lib/database/salvage.remote";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, params }) => {
    let id = Number(params.id);

    if (Number.isNaN(id))
        error(500, "Cannot parse ID to number.");

    console.log(id);

    return {
        // logged-in user info
        user: locals.user,

        // salvage-run info
        id: id,
        owner: await getSalvageRunOwnerInfo(id),
        memberList: await getSalvageRunMemberList(id),
        financialOverview: await getSalvageRunFinancialOverview(id)
    };
};
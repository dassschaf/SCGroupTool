import type { PageServerLoad } from "./$types";
import {
	getSalvageRunFinancialOverview,
	getSalvageRunMemberList,
	getSalvageRunOwner
} from "$lib/database/salvage.remote";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = Number(params.id);

	if (Number.isNaN(id)) {
		error(500, "Cannot parse ID to number.");
	}

	return {
		// logged-in user info
		user: locals.user,

		// salvage-run info
		id: id
	};
};

import type { PageServerLoad } from "./$types"
import { isSalvageRunMember } from "$lib/database/salvage.remote"

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = Number(params.id);

	if (Number.isNaN(id))
		error(500, "Cannot parse ID to number.")

	if (!isSalvageRunMember({ srid: id, user_id: locals.user.id }))
		error(403, "You are not logged in.")

}
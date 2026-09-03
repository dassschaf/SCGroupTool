import type { PageServerLoad } from "./$types";
import {
    getSalvageRunFinancialOverview,
    getSalvageRunMemberList,
    getSalvageRunOwnerInfo
} from "$lib/database/salvage.remote";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, params }) => {
    const id = Number(params.id);

    if (Number.isNaN(id))
        error(500, "Cannot parse ID to number.");

		const financialOverview = await getSalvageRunFinancialOverview(id);
		const numRows = Math.max(financialOverview.sales_revenue.length, financialOverview.claims.length + financialOverview.event_fees.length);

		const tableRows: {
			sales?: {
				cargo_name: string,
				revenue: number,
				station_name: string,
				system_name: string
			},

			expenses?: {
				type: string,
				comment: string,
				comment_sub: string,
				fees: number
			}
		}[] = [];

		for (let i = 0; i < numRows; i++) {
			let row = {
				sales: financialOverview.sales_revenue[i],
				expenses: (i >= financialOverview.claims.length) ?
					{
						type: (financialOverview.event_fees[i - financialOverview.claims.length].type === "SELL") ? "Sales fees" : "Refining fees",
						comment: financialOverview.event_fees[i - financialOverview.claims.length].station_name,
						comment_sub: financialOverview.event_fees[i - financialOverview.claims.length].system_name,
						fees: financialOverview.event_fees[i - financialOverview.claims.length].fees
					}
					:
					{
						type: "Claim",
						comment: financialOverview.claims[i].comment,
						comment_sub: "",
						fees: financialOverview.claims[i].fees
					}
			};
			tableRows.push(row);
		}

    return {
			// logged-in user info
			user: locals.user,

			// salvage-run info
			id: id,
			owner: await getSalvageRunOwnerInfo(id),
			memberList: await getSalvageRunMemberList(id),
			financialOverview: financialOverview,
			financialOverviewRows: tableRows
		};
};
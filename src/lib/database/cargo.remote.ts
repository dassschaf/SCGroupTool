import { getRequestEvent, query, form } from "$app/server";
import { sql } from "bun";
import * as z from "zod";
import { error } from "@sveltejs/kit";
import { isSalvageRunMember } from "$lib/database/salvage.remote";

export const getCargoLotsBySRID = query(z.number().int().positive(), async (srid) => {
	const { locals } = getRequestEvent();
	if (!locals.user) error(401, "Unauthorized");

	// check whether the user submitting the request is a member of the salvage run
	if (!(await isSalvageRunMember({ srid: srid, user_id: locals.user.id })))
		error(401, "You are no member of this salvage run (#" + srid + ")!");

	return sql<
		{
			id: number;
			amount: number;
			cargo_name: string;
			is_commodity: boolean;
			is_refinable: boolean;
			station_name: string;
			system_name: string;
			consumed_by_id: number;
			is_consumed: boolean;
			added_by: string;
		}[]
	>`
		SELECT 
			cl.id,
			cl.amount,
			ct.name as cargo_name,
			ct.is_commodity,
			ct.is_refinable,
			st.name as station_name,
			st.system as system_name,
			cle.event_id,
			cl.added_by,
			(cle.event_id is not null) as is_consumed
		FROM cargo_lot cl
			LEFT JOIN cargo_lot_event cle ON cl.id = cle.lot_id
			JOIN cargo_types ct ON cl.cargo_type_id = ct.id
			JOIN stations st ON cl.station_id = st.id
		WHERE 
			cl.salvage_run_id = ${srid}
		AND cle.type = 'CONSUME'
	`;
});

export const getRefineryEventsBySRID = query(z.number().int().positive(), async (srid) => {
	const { locals } = getRequestEvent();
	if (!locals.user) error(401, "Unauthorized");

	// check whether the user submitting the request is a member of the salvage run
	if (!(await isSalvageRunMember({ srid: srid, user_id: locals.user.id })))
		error(401, "You are no member of this salvage run (#" + srid + ")!");

	return sql<
		{
			id: number;
			station_name: string;
			system_name: string;
			created_at: Date;
			finishes_at: Date;
			fees: number;
			consumed_cargo_amount: number;
			consumed_cargo_type: string;
			created_cargo_amount: number;
			created_cargo_type: string;
			created_cargo_id: number;
			added_by: string;
		}[]
	>`
		SELECT
			ce.id,
			st.name as station_name,
			st.system as system_name,
			ce.created_at,
			ce.finishes_at,
			ce.fees,
			ce.added_by,
			SUM(cl_in.amount) as consumed_cargo_amount,
			ct_in.name as consumed_cargo_type,
			cl_out.amount as created_cargo_amount,
			ct_out.name as created_cargo_type,
			ct_out.id as created_cargo_id
		FROM cargo_event ce
				 JOIN stations st ON ce.station_id = st.id
				 LEFT JOIN cargo_lot_event cle_in on cle_in.event_id = ce.id
				 LEFT JOIN cargo_lot cl_in on ce.id = cle_in.lot_id 
				 JOIN cargo_types ct_in on cl_in.cargo_type_id = ct_in.id
				 LEFT JOIN cargo_lot_event cle_out on cle_out.event_id = ce.id
				 LEFT JOIN cargo_lot cl_out on cle_out.lot_id = cl_out.id
				 JOIN cargo_types ct_out on cl_out.cargo_type_id = ct_out.id
		WHERE ce.salvage_run_id = ${srid} AND ce.type = 'REFINE'
				AND cle_in.type = 'CONSUME' AND cle_out.type = 'CREATE'
		GROUP BY ce.id, st.id, cl_in.id, ct_in.id, cl_out.id, ct_out.id;
	`;
});

export const getSalesEventsBySRID = query(z.number().int().positive(), async (srid) => {
	const { locals } = getRequestEvent();
	if (!locals.user) error(401, "Unauthorized");

	// check whether the user submitting the request is a member of the salvage run
	if (!(await isSalvageRunMember({ srid: srid, user_id: locals.user.id })))
		error(401, "You are no member of this salvage run (#" + srid + ")!");

	return sql<
		{
			id: number;
			station_name: string;
			system_name: string;
			created_at: Date;
			fees: number;
			price_per_unit: number;
			consumed_cargo_amount: number;
			consumed_cargo_type: string;
			added_by: string;
		}[]
	>`
		SELECT
			ce.id,
			st.name as station_name,
			st.system as system_name,
			ce.created_at,
			ce.fees,
			ce.price_per_unit,
			ce.added_by,
			SUM(cl.amount) as consumed_cargo_amount,
			ct.name as consumed_cargo_type
		FROM cargo_event ce
				JOIN stations st ON ce.station_id = st.id
			LEFT JOIN cargo_lot_event cle on ce.id = cle.event_id
			LEFT JOIN cargo_lot cl on cle.lot_id = cl.id
				JOIN cargo_types ct on cl.cargo_type_id = ct.id
		WHERE ce.salvage_run_id = ${srid} AND ce.type = 'SELL' AND cle.type = 'CONSUME'
		GROUP BY cl.id, ce.id, st.id, ct.id;
	`;
});

export const addCargoLot = form(
	z.object({
		cargo_type: z.number().int().positive(),
		station: z.number().int().positive(),
		amount: z.number().int().positive(),
		srid: z.number().int().positive()
	}),
	async ({ cargo_type, station, amount, srid }) => {
		const { locals } = getRequestEvent();
		if (!locals.user) error(401, "Unauthorized");

		// check whether the user submitting the request is a member of the salvage run
		if (!(await isSalvageRunMember({ srid: srid, user_id: locals.user.id })))
			error(401, "You are no member of this salvage run (#" + srid + ")!");

		// insert new record
		return sql`
		INSERT INTO cargo_lot (cargo_type_id, salvage_run_id, station_id, amount, consumed_by_id, added_by)
		VALUES (${cargo_type}, ${srid}, ${station}, ${amount}, NULL, ${locals.user.id})
	`;
	}
);

export const addRefineryEvent = form(
	z.object({
		consumed_ids: z.array(z.number().int().positive()),
		cargo_yield: z.number().int().positive(),
		cargo_type: z.number().int().positive(),
		station: z.number().int().positive(),
		srid: z.number().int().positive(),
		end_time_iso: z.iso.datetime(),
		fees: z.number().int().positive()
	}),
	async ({ consumed_ids, cargo_yield, cargo_type, station, srid, end_time_iso, fees }) => {
		// check if the user is logged in
		const { locals } = getRequestEvent();
		if (!locals.user) error(401, "Unauthorized");
		const user_id = locals.user.id;

		// check whether the user submitting the request is a member of the salvage run
		if (!(await isSalvageRunMember({ srid: srid, user_id: locals.user.id })))
			error(401, "You are no member of this salvage run (#" + srid + ")!");

		// get the start/end times
		const start_time = new Date(Date.now());
		const end_time = new Date(end_time_iso);

		// create resulting cargo lot
		const lot_id = (
			await sql<
				{
					id: number;
				}[]
			>`
		INSERT INTO cargo_lot (cargo_type_id, salvage_run_id, station_id, amount, added_by) 
		VALUES (${cargo_type}, ${srid}, ${station}, ${cargo_yield}, ${user_id})
		RETURNING id
	`
		)[0].id;

		// create refinery event
		const event_id = (
			await sql<
				{
					id: number;
				}[]
			>`
		INSERT INTO cargo_event (salvage_run_id, station_id, type, created_at, finishes_at, fees, price_per_unit, added_by)
		VALUES (${srid}, ${station}, 'REFINE', ${start_time}, ${end_time}, ${fees}, 0, ${user_id})
		RETURNING id
	`
		)[0].id;

		// create consumption row
		for (const lot_id in consumed_ids)
			await sql`
				INSERT INTO cargo_lot_event (lot_id, event_id, type) 
				VALUES (${lot_id}, ${event_id}, 'CONSUME');
			`;
	}
);

export const addSellEvent = form(
	z.object({
		consumed_ids: z.array(z.number().int().positive()),
		price_per_unit: z.number().int().positive(),
		fees: z.number().int().positive(),
		station: z.number().int().positive(),
		srid: z.number().int().positive()
	}),
	async ({ consumed_ids, price_per_unit, fees, station, srid }) => {
		// check if the user is logged in
		const { locals } = getRequestEvent();
		if (!locals.user) error(401, "Unauthorized");
		const user_id = locals.user.id;

		// check whether the user submitting the request is a member of the salvage run
		if (!(await isSalvageRunMember({ srid: srid, user_id: locals.user.id })))
			error(401, "You are no member of this salvage run (#" + srid + ")!");

		// record current time for the sale event
		const current_time = new Date(Date.now());

		// create sell event
		const event_id = (
			await sql<
				{
					id: number;
				}[]
			>`
			INSERT INTO cargo_event (salvage_run_id, station_id, type, created_at, fees, price_per_unit, added_by) 
			VALUES (${srid}, ${station}, 'SELL', ${current_time}, ${fees}, ${price_per_unit}, ${user_id})
			RETURNING id
		`
		)[0].id;

		// create consumption row
		for (const lot_id in consumed_ids)
			await sql`
				INSERT INTO cargo_lot_event (lot_id, event_id, type)
				VALUES (${lot_id}, ${event_id}, 'CONSUME');
			`;
	}
);

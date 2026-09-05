import { getRequestEvent, query } from "$app/server";
import { sql } from "bun";
import * as z from "zod";
import { error } from "@sveltejs/kit";

export const getCargoLotsBySRID = query(z.number().int().positive(), (srid) => {
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
			cl.consumed_by_id,
			(cl.consumed_by_id is not null) as is_consumed
		FROM cargo_lot cl
			JOIN cargo_types ct ON cl.cargo_type_id = ct.id
			JOIN stations st ON cl.station_id = st.id
		WHERE 
			cl.salvage_run_id = ${srid}
	`;
});

export const getRefineryEventsBySRID = query(z.number().int().positive(), async (srid) => {
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
		}[]
	>`
		SELECT
			ce.id,
			st.name as station_name,
			st.system as system_name,
			ce.created_at,
			ce.finishes_at,
			ce.fees,
			SUM(cl_in.amount) as consumed_cargo_amount,
			ct_in.name as consumed_cargo_type,
			cl_out.amount as created_cargo_amount,
			ct_out.name as created_cargo_type
		FROM cargo_event ce
				 JOIN stations st ON ce.station_id = st.id
				 LEFT JOIN cargo_lot cl_in on ce.id = cl_in.consumed_by_id
				 JOIN cargo_types ct_in on cl_in.cargo_type_id = ct_in.id
				 LEFT JOIN cargo_lot cl_out on ce.created_cargo_lot_id = cl_out.id
				 JOIN cargo_types ct_out on cl_out.cargo_type_id = ct_out.id
		WHERE ce.salvage_run_id = ${srid} AND ce.type = 'REFINE'
		GROUP BY ce.id, st.id, cl_in.id, ct_in.id, cl_out.id, ct_out.id;
	`;
});

export const getSalesEventsBySRID = query(z.number().int().positive(), async (srid) => {
	return sql<
		{
			id: number;
			station_name: string;
			system_name: string;
			created_at: Date;
			finishes_at: Date;
			fees: number;
			price_per_unit: number;
			consumed_cargo: number;

		}[]
	>`
		SELECT
			ce.id,
			st.name as station_name,
			st.system as system_name,
			ce.created_at,
			ce.finishes_at,
			ce.fees,
			ce.price_per_unit,
			SUM(cl.amount) as consumed_cargo_amount,
			ct.name as cargo_type
		FROM cargo_event ce
				JOIN stations st ON ce.station_id = st.id
			LEFT JOIN public.cargo_lot cl on ce.id = cl.consumed_by_id
				JOIN cargo_types ct on cl.cargo_type_id = ct.id
		WHERE ce.salvage_run_id = ${srid} AND ce.type = 'SELL'
		GROUP BY cl.consumed_by_id, ce.id, st.id, ct.id;
	`;
});

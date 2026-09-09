import { query } from "$app/server";
import { sql } from "bun";

enum LandingPadSizes {
	S = "S",
	M = "M",
	L = "L",
	XL = "XL"
}

// Get a list of all stations currently in the database
export const getStations = query(async () => {
	return await sql<{
		id: number,
		name: string,
		system: string,
		largest_pad: LandingPadSizes,
		has_refinery: boolean,
		has_market: boolean
	}[]>`
		SELECT
			id,
			name,
			system,
			largest_pad,
			has_refinery,
			has_market
		FROM
			stations;
	`;
});

// Get a list of all cargo types currently in the database
export const getCargoTypes = query(async () => {
	return await sql<{
		id: number,
		name: string,
		is_refinable: boolean,
		is_commodity: boolean
	}[]>`
		SELECT
			id,
			name,
			is_refinable,
			is_commodity
		FROM 
			cargo_types;
	`;
})
CREATE VIEW "cargo_event_summary" AS
SELECT
    ce.id as id,
    ce.salvage_run_id as salvage_run_id,
    st.name as station_name,
    st.system as station_system,
    ce.type as event_type,
    SUM(cl.amount) as cargo_amount,
    ce.fees as fees,
    ce.price_per_unit as price_per_unit,
    ce.created_at as created_at,
    coalesce(ce.finishes_at, ce.created_at) as finishes_at
FROM "cargo_event" ce
         JOIN "cargo_lot" cl ON ce.id = cl.consumed_by_id
         JOIN "cargo_types" ct ON cl.cargo_type_id = ct.id
         JOIN "stations" st ON ce.station_id = st.id
GROUP BY cl.consumed_by_id, ce.id, st.id;

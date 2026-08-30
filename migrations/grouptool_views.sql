CREATE VIEW "salvage_run_summary" AS
SELECT
    s.id as id,
    s.owner_id as owner_id,
    s.created_at as created_at,
    COUNT(DISTINCT m.user_id) as member_count,
    SUM(ces.cargo_amount * ces.price_per_unit) as revenue,
    SUM(ces.fees) as fees,
    SUM(ces.cargo_amount * ces.price_per_unit - ces.fees) as profit
FROM "salvage_runs" s
         JOIN salvage_run_membership m ON s.id = m.salvage_run_id
         JOIN cargo_event_summary ces on s.id = ces.salvage_run_id
GROUP BY m.salvage_run_id, ces.salvage_run_id, s.id;

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
    coalesce(ce.finishes_at, NULL) as finishes_at
FROM "cargo_event" ce
         JOIN "cargo_lot" cl ON ce.id = cl.consumed_by_id
         JOIN "cargo_types" ct ON cl.cargo_type_id = ct.id
         JOIN "stations" st ON ce.station_id = st.id
GROUP BY cl.consumed_by_id, ce.id, st.id;

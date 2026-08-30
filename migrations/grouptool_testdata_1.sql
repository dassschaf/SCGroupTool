INSERT INTO salvage_runs (owner_id)
VALUES ('...') -- update matching your actual user
RETURNING id;
INSERT INTO salvage_run_membership (salvage_run_id, user_id)
VALUES (1, "..."); -- update matching your actual user as well

INSERT INTO cargo_lot (salvage_run_id, cargo_type_id, station_id, amount)
VALUES (1, 1, 1, 123);
INSERT INTO cargo_lot (salvage_run_id, cargo_type_id, station_id, amount)
VALUES (1, 1, 1, 234);
INSERT INTO cargo_lot (salvage_run_id, cargo_type_id, station_id, amount)
VALUES (1, 4, 1, 123);
INSERT INTO cargo_lot (salvage_run_id, cargo_type_id, station_id, amount)
VALUES (1, 4, 1, 234);

INSERT INTO cargo_event (salvage_run_id, station_id, type, finishes_at, fees, price_per_unit)
VALUES (1, 1, 'REFINE', now() + interval '10 hour', 1234, 0);
UPDATE cargo_lot SET consumed_by_id = 1 WHERE id = 1;

INSERT INTO cargo_event (salvage_run_id, station_id, type, created_at, finishes_at, fees, price_per_unit)
VALUES (1, 1, 'SELL', now(), now(), 1234, 8000);
UPDATE cargo_lot SET consumed_by_id = 2 WHERE id = 2;
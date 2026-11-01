INSERT INTO salvage_runs (owner_id, is_finished)
VALUES ('7RXibAsQhynmsrRNJXw9R3zed6Pfy8Kt', false),
       ('7RXibAsQhynmsrRNJXw9R3zed6Pfy8Kt', true);

INSERT INTO salvage_run_membership (salvage_run_id, user_id)
VALUES (2, '7RXibAsQhynmsrRNJXw9R3zed6Pfy8Kt'),
       (1, '7RXibAsQhynmsrRNJXw9R3zed6Pfy8Kt');

INSERT INTO cargo_lot (salvage_run_id, cargo_type_id, station_id, amount)
VALUES (1, 1, 1, 123),
       (1, 1, 1, 234),
       (1, 4, 1, 123),
       (1, 4, 1, 234),
       (1, 5, 1, 30);

INSERT INTO cargo_event (salvage_run_id, station_id, type, finishes_at, fees, price_per_unit)
VALUES (1, 1, 'REFINE', now() + interval '10 hour', 1234, 0),
       (1, 1, 'SELL', now(), 1234, 8000);

INSERT INTO cargo_lot_event (lot_id, event_id, type)
VALUES (1, 1, 'CONSUME'),
       (2, 2, 'CONSUME'),
       (5, 1, 'CREATE');

INSERT INTO claim_fees (salvage_run_id, fees, ship, system)
VALUES (1, 20000, '890 Jump', 'Stanton'),
       (1, 500, 'C2 Hercules', 'Stanton');
CREATE TABLE salvage_runs
(
    id         INT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    owner      TEXT        NOT NULL
        REFERENCES "user" (id),

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT now()

);

-- m:n relationship
CREATE TABLE salvage_run_membership
(
    salvage_run_id INT
        REFERENCES "salvage_runs" (id),

    user_id        TEXT NOT NULL
        REFERENCES "user" (id),

    PRIMARY KEY (salvage_run_id, user_id)
);

CREATE TABLE cargo_types
(
    id           INT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    name         TEXT NOT NULL,

    is_refinable BOOL DEFAULT (false),

    is_commodity BOOL DEFAULT (false)
);

INSERT INTO cargo_types (name, is_refinable) VALUES
                                                 ('Construction Salvage', true),
                                                 ('Construction Pieces', true),
                                                 ('Construction Rubble', true);
INSERT INTO cargo_types (name, is_commodity) VALUES
                                                 ('Refined Construction Materials', true);

CREATE TABLE stations
(
    id           INT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    name         TEXT NOT NULL,

    has_refinery BOOL DEFAULT (false),

    has_market   BOOL DEFAULT (false)
);

CREATE TABLE cargo_lot
(
    id          INT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    cargo_type  INT
        NOT NULL
        REFERENCES "cargo_types" (id),

    salvage_run INT
        NOT NULL
        REFERENCES "salvage_runs" (id),

    station     INT
        NOT NULL
        REFERENCES "stations" (id),

    amount      INT
        NOT NULL
);

CREATE TABLE cargo_event_type (
                                  id  INT
                                      GENERATED ALWAYS AS IDENTITY
                                      PRIMARY KEY,

    name TEXT NOT NULL
                              UNIQUE
);

INSERT INTO cargo_event_type (name) VALUES ('REFINE', 'SELL');

CREATE TABLE cargo_event (
                             id  INT
                                 GENERATED ALWAYS AS IDENTITY
                                 PRIMARY KEY,

    salvage_run INT
        REFERENCES salvage_runs(id),

    station INT
                         REFERENCES "stations" (id),

    type CARGO_EVENT_TYPE,

    created_at TIMESTAMPTZ
                         NOT NULL
                         DEFAULT now(),

    finishes_at TIMESTAMPTZ,

    fees INT,

    price_per_unit INT
);

CREATE TABLE cargo_event_consumption (
    lot_id INT
                                     REFERENCES "cargo_lot" (id),

    event_id INT
                                     REFERENCES "cargo_event" (id),

    PRIMARY KEY (lot_id, event_id)
);

CREATE TABLE cargo_event_creation (
    event_id INT
                                  REFERENCES "cargo_event" (id),
    lot_ID INT
                                  REFERENCES "cargo_lot" (id),
    available_at TIMESTAMPTZ
)


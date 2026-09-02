CREATE TABLE salvage_runs
(
    id         INT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    owner_id   TEXT
        NOT NULL
        REFERENCES "user" (id),

    created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT now(),

    is_finished bool
        NOT NULL
        DEFAULT false
);

-- m:n relationship
CREATE TABLE salvage_run_membership
(
    salvage_run_id INT
        REFERENCES "salvage_runs" (id)
        ON DELETE CASCADE,

    user_id        TEXT NOT NULL
        REFERENCES "user" (id),

    was_paid BOOL
        DEFAULT(false),

    PRIMARY KEY (salvage_run_id, user_id)
);

CREATE TABLE cargo_types
(
    id           INT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    name         TEXT
        NOT NULL,

    is_refinable BOOL
        DEFAULT (false),

    is_commodity BOOL
        DEFAULT (false)
);

-- seed cargo types into the database
INSERT INTO cargo_types (name, is_refinable)
VALUES ('Construction Salvage', true),
       ('Construction Pieces', true),
       ('Construction Rubble', true);

INSERT INTO cargo_types (name, is_commodity)
VALUES ('Refined Construction Materials', true),
       ('Construction Materials', true);


CREATE TYPE landing_pad_size AS ENUM ('S', 'M', 'L', 'XL');

CREATE TYPE system_enum AS ENUM ('Stanton', 'Nyx', 'Pyro');


CREATE TABLE stations
(
    id           INT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    name         TEXT
        NOT NULL,

    system       system_enum,

    largest_pad  landing_pad_size
        NOT NULL,

    has_refinery BOOL
        DEFAULT (false),

    has_market   BOOL
        DEFAULT (false)
);

-- seed the (important) stations from the game into the database
INSERT INTO stations (name, system, has_refinery, has_market, largest_pad)
VALUES ('Grim Hex', 'Stanton', false, true, 'XL'),
       ('ARC-L1 Wide Forest Station', 'Stanton', true, true, 'L'),
       ('ARC-L2 Lively Pathway Station', 'Stanton', true, true, 'L'),
       ('ARC-L3 Modern Express Station', 'Stanton', false, true, 'L'),
       ('ARC-L4 Faint Glen Station', 'Stanton', false, true, 'L'),
       ('ARC-L5 Yellow Core Station', 'Stanton', false, true, 'L'),
       ('CRU-L1 Ambitious Dream Station', 'Stanton', true, true, 'L'),
       ('CRU-L4 Shallow Field Station', 'Stanton', false, true, 'L'),
       ('CRU-L5 Beautiful Glen Station', 'Stanton', false, true, 'L'),
       ('HUR-L1 Green Glen Station', 'Stanton', true, true, 'L'),
       ('HUR-L2 Faithful Dream Station', 'Stanton', true, true, 'L'),
       ('HUR-L3 Thundering Express Station', 'Stanton', false, true, 'L'),
       ('HUR-L4 Melodic Fields Station', 'Stanton', false, true, 'L'),
       ('HUR-L5 High Course Station', 'Stanton', false, true, 'L'),
       ('MIC-L1 Shallow Frontier Station', 'Stanton', true, true, 'L'),
       ('MIC-L2 Long Forest Station', 'Stanton', true, true, 'L'),
       ('MIC-L3 Endless Odyssey Station', 'Stanton', false, true, 'L'),
       ('MIC-L4 Red Crossroads Station', 'Stanton', false, true, 'L'),
       ('MIC-L5 Modern Icarus Station', 'Stanton', false, true, 'L'),
       ('Orison', 'Stanton', false, true, 'XL'),
       ('Lorville', 'Stanton', false, true, 'XL'),
       ('New Babbage', 'Stanton', false, true, 'XL'),
       ('Area18', 'Stanton', false, true, 'XL'),
       ('Nyx Gateway', 'Stanton', false, true, 'L'),
       ('Pyro Gateway', 'Stanton', false, true, 'L'),
       ('Terra Gateway', 'Stanton', false, true, 'L'),
       ('Levski', 'Nyx', true, true, 'XL'),
       ('Pyro Gateway', 'Nyx', false, true, 'L'),
       ('Stanton Gateway', 'Nyx', false, true, 'L'),
       ('Ruin Station', 'Pyro', true, true, 'L'),
       ('Stanton Gateway', 'Pyro', false, true, 'L'),
       ('Nyx Gateway', 'Pyro', false, true, 'L');

-- cargo event type can be an enum instead of a table
CREATE TYPE cargo_event_type AS ENUM ('REFINE', 'SELL');

CREATE TABLE cargo_event
(
    id             INT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    salvage_run_id INT
        REFERENCES salvage_runs (id)
        ON DELETE CASCADE,

    station_id     INT
        REFERENCES "stations" (id),

    type        cargo_event_type,

    created_at     TIMESTAMPTZ
        NOT NULL
        DEFAULT now(),

    finishes_at    TIMESTAMPTZ,

    fees           INT,

    price_per_unit INT
);

CREATE TABLE cargo_lot
(
    id             INT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    cargo_type_id  INT
        NOT NULL
        REFERENCES "cargo_types" (id)
        ON DELETE CASCADE,

    salvage_run_id INT
        NOT NULL
        REFERENCES "salvage_runs" (id)
        ON DELETE CASCADE,

    station_id     INT
        NOT NULL
        REFERENCES "stations" (id),

    amount         INT
        NOT NULL,

    -- reference to event iff. consumed
    consumed_by_id INT
        REFERENCES "cargo_event" (id) ON DELETE CASCADE
        DEFAULT (NULL)
);

CREATE TABLE claim_fees (
    id             INT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    salvage_run_id INT
        NOT NULL
        REFERENCES "salvage_runs" (id),

    fees INT
        NOT NULL
        CHECK (fees >= 0),

    comment TEXT
        DEFAULT('--')
);

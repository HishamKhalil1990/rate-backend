DROP TABLE IF EXISTS formstable;
CREATE TABLE formstable(
    id SERIAL PRIMARY KEY,
    warehouse VARCHAR(255) not null,
    answers json not null,
    note text,
    username VARCHAR(255) not null,
);
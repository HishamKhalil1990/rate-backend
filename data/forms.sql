DROP TABLE IF EXISTS formstable;
CREATE TABLE formstable(
    id SERIAL PRIMARY KEY,
    warehouse VARCHAR(255) not null,
    visit VARCHAR(255) not null,
    answers VARCHAR(255) not null,
    note text,
    username VARCHAR(255) not null
);
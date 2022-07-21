DROP TABLE IF EXISTS userstable;
CREATE TABLE userstable(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) not null,
    pass VARCHAR(255) not null,
);
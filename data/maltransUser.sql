DROP TABLE IF EXISTS maltransUsertable;
CREATE TABLE maltransUsertable(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) not null,
    pass VARCHAR(255) not null,
    email VARCHAR(255) not null
);
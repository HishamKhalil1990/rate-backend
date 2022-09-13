DROP TABLE IF EXISTS supervisorUsertable;
CREATE TABLE supervisorUsertable(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) not null,
    pass VARCHAR(255) not null
    cardcode VARCHAR(255) not null
);
CREATE DATABASE shares OWNER admin;

\connect shares;

CREATE TABLE users (
        id SERIAL NOT NULL, 
        username VARCHAR(22) NOT NULL, 
        email VARCHAR(250) NOT NULL, 
        password VARCHAR(65) NOT NULL, 
        PRIMARY KEY (id), 
        UNIQUE (username), 
        UNIQUE (email)
);

CREATE TABLE files (
        url VARCHAR(31) NOT NULL, 
        file VARCHAR(500) NOT NULL, 
        date_created TIMESTAMP WITHOUT TIME ZONE, 
        PRIMARY KEY (url)
);

INSERT INTO users (id, username, email, password) VALUES (0, 'cpwhcwqxhfkb96cajmiyo', 'admin', 'a');

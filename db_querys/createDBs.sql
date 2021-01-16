-- run this query if the database got corrupted

CREATE TABLE IF NOT EXISTS passwords (
   name TEXT,
   username TEXT NOT NULL,
   password TEXT NOT NULL,
   url TEXT NOT NULL,
   level INTEGER,
   icon TEXT,
   database TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dabatases (
   id INTEGER,
   name TEXT,
   username TEXT NOT NULL,
   password TEXT NOT NULL,
   level INTEGER
);

CREATE TABLE IF NOT EXISTS masterkey (
   name TEXT,
   username TEXT NOT NULL,
   level INTEGER
);


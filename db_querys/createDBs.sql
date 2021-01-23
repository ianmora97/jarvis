-- run this query if the database get corrupted


--Create table Passwords
CREATE TABLE IF NOT EXISTS passwords (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   db INTEGER NOT NULL,
   name TEXT NOT NULL,
   username TEXT NOT NULL,
   password TEXT NOT NULL,
   url TEXT NOT NULL,
   level INTEGER DEFAULT 0,
   icon TEXT
);

--Create table databases
CREATE TABLE IF NOT EXISTS databases (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT,
   nameid TEXT,
);

--Create table masterkey
CREATE TABLE IF NOT EXISTS masterkey (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT,
   password TEXT NOT NULL
);

--query testings
SELECT db, COUNT(*) as cant FROM passwords GROUP BY db;


SELECT db, COUNT(*) as cant FROM passwords INNER JOIN databases ON passwords.db = databases.name GROUP BY db;


SELECT databases.name as db, COUNT(passwords.db) as cant, nameid FROM databases LEFT JOIN passwords ON passwords.db = databases.name GROUP BY databases.name ORDER BY cant DESC, db ASC;
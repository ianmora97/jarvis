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
   nameid TEXT
);

--Create table masterkey
CREATE TABLE IF NOT EXISTS masterkey (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT,
   password TEXT NOT NULL
);

--New databases
insert into databases(name,nameid) values('Internet','Internet');
insert into databases(name,nameid) values('Emails','Emails');

--New Entrys
insert into passwords(db,name,username,password,url,level,icon) values('Internet','example','John Doe','12345','example.com',1,"<i class='fa fa-globe' style='color: #00790a;'></i>");
insert into passwords(db,name,username,password,url,level,icon) values('Emails','example','John Doe','12345','example.com',1,"<i class='fa fa-globe' style='color: #00790a;'></i>");


--query testings
SELECT databases.name as db, COUNT(passwords.db) as cant, nameid FROM databases LEFT JOIN passwords ON passwords.db = databases.name GROUP BY databases.name ORDER BY cant DESC, db ASC;
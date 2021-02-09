var sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./databases/passafe.db");
var myArgs = process.argv.slice(2);

async function wipeDatabase() {
    db.serialize(()=>{
        db.run('DROP TABLE passwords')
        .run('DROP TABLE databases')
        .run('DROP TABLE masterkey');
        console.log('TABLES DROPED')
    });
}

async function createDatabases() {
    db.serialize(()=>{
        var dbs = `CREATE TABLE IF NOT EXISTS databases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            nameid TEXT
        )`
        var ps = `CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            db INTEGER NOT NULL,
            name TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            url TEXT NOT NULL,
            level INTEGER DEFAULT 0,
            icon TEXT
        )`
        var mk = `CREATE TABLE IF NOT EXISTS masterkey (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            password TEXT NOT NULL
        )`
        db.run(dbs)
        .run(ps)
        .run(mk);
        console.log('TABLES CREATED')
    })
}
async function insertDbs() {
    db.serialize(()=>{
        var sql = `insert into databases(name,nameid) values('Internet','Internet'),('Social','Social')`;
        db.run(sql)
        console.log('INSERTED ROWS')
    })
}
function wipe(){
    wipeDatabase().then(()=>{
        createDatabases().then(()=>{
            console.log('\nTask exacuted correctly')
        })
    })
}
function wipeandinsert() {
    wipeDatabase().then(()=>{
        createDatabases().then(()=>{
            insertDbs().then(()=>{
                console.log('\nTask exacuted correctly')
            })
        })
    })
}
function main() {
    switch (myArgs[0]) {
        case 'help':
            console.log(`w     Wipe and Create Tables`)
            console.log(`ci    Wipe, Create Tables and Insert Examples DB`)
            console.log(`help  See commands`)
            break;
        case 'w':
            console.log('Running...')
            setTimeout(() => {
                wipe()
            }, 1000);
            break;
        case 'ci':
            console.log('Running...')
            setTimeout(() => {
                wipeandinsert()
            }, 1000);
            break;
        default:
            console.log(`w     Wipe and Create Tables`)
            console.log(`ci    Wipe, Create Tables and Insert Examples DB`)
            console.log(`help  See commands`)
            break;
    }
}
main();
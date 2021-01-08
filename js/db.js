var sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('database.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

function get() {
    db.all("SELECT * FROM passwords", function(err, row) {
        console.log(row);
    });
    db.serialize(function() {
    });
}
/*db.serialize(function() {
    db.run("CREATE TABLE if not exists lorem (info TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
});*/


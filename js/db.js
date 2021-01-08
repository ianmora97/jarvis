var sqlite3 = require('sqlite3').verbose();
const path = `${__dirname}/assets/sqlite.db`;
let db = new sqlite3.Database('databases/databases.db');

function getPasswords() {
    db.all("SELECT * FROM passwords", [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            $('#socialmediatable').append(
                '<tr>'+
                '<td>'+row.id+'</td>'+ 
                '<td>'+row.id+'</td>'+ 
                '<td>'+row.name+'</td>'+ 
                '<td>'+row.username+'</td>'+ 
                '<td>'+row.password+'</td>'+ 
                '<td>'+row.url+'</td>'+ 
                '<td>'+row.level+'</td>'+ 
                '</tr>'
            );
        });
    });
}

function getDatabases() {
    db.all("SELECT * FROM databases", [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row);
        });
    });
}

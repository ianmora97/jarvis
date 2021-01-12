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
                '<td><input class="custom-checkbox" type="checkbox" name="all" id="marcar"></td>'+ 
                '<td>'+row.icon+' '+row.name+'</td>'+ 
                '<td role="button" class="btn-to-clip" data-clipboard-text="'+row.username+'">'+row.username+'</td>'+ 
                '<td role="button" class="btn-to-clip" data-clipboard-text="'+decrypt(row.password,z_masterkey)+'">***********</td>'+ 
                '<td role="button" class="btn-to-clip" data-clipboard-text="'+row.url+'">'+row.url+'</td>'+ 
                '<td>'+row.level+'</td>'+ 
                '</tr>'
            );
        });
    });
}
function addEntry() {
    getInfo_addEntry().then((arr)=>{
        console.log(arr);
        db.run('INSERT INTO passwords(name,username,password,url,level,icon,database) VALUES(?,?,?,?,?,?,?)', arr, (err) =>{
            console.log('entry');
            if (err) {
                console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
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

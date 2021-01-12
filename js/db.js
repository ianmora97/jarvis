var sqlite3 = require('sqlite3').verbose();
const path = `${__dirname}/assets/sqlite.db`;
let db = new sqlite3.Database('databases/databases.db');

function getPasswords() {
    db.all("SELECT * FROM passwords", [], (err, rows) => {
        if (err) {
            throw err;
        }
        $('#socialmediatable').html('');
        rows.forEach((row) => {
            $('#socialmediatable').append(
                // onmouseover="fillEntryInfoButton('+row.name+','+row.username+','+row.url+','+row.level+')"
                '<tr >'+
                '<td><input class="custom-checkbox" type="checkbox" name="all" id="marcar"></td>'+ 
                '<td>'+row.icon+' '+row.name+'</td>'+ 
                '<td role="button" class="btn-to-clip" data-clipboard-text="'+row.username+'">'+row.username+'</td>'+ 
                '<td role="button" class="btn-to-clip" data-clipboard-text="'+decrypt(row.password,z_masterkey)+'">***********</td>'+ 
                '<td role="button" class="btn-to-clip" data-clipboard-text="'+row.url+'"><a href="#" class="text-info">'+row.url+'</a></td>'+ 
                '<td>'+row.level+'</td>'+ 
                '</tr>'
            );
        });
    });
}
function addEntry() {
    getInfo_addEntry().then((arr)=>{
        db.run('INSERT INTO passwords(name,username,password,url,level,icon,database) VALUES(?,?,?,?,?,?,?)', arr, (err) =>{
            if (err) {
                console.log(err.message);
            }
            
            getPasswords();
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

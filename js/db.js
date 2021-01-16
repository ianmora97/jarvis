var sqlite3 = require("sqlite3").verbose();
const path = `${__dirname}/assets/sqlite.db`;
let db = new sqlite3.Database("databases/databases.db");

/*
    !UI
*/
function checkLevel(level) {
    switch (level) {
        case 1:
            return "class='bg-danger text-white' ";
        case 2:
            return "class='bg-warning text-white' ";
        case 3:
            return "class='bg-success text-white' ";
        case 4:
            return "class='text-white' style='background-color:#1d53d1;'";
        case 5:
            return "class='text-white' style='background-color:#660da6;'";
        default:
            return "class='bg-light text-white'";
    }
}
function writeDatasonRows(r) {
    return ' data-name="'+r.name+'" data-username="'+r.username+'" data-password="'+
    r.password+'" data-url="'+r.url+'" data-level="'+r.level+'" data-icon="'+r.icon+'" data-id="'+r.rowid+'"';
}

/*
    !DAOs
*/
var z_passwords_All = [];
function getPasswords() {
    z_passwords_All = [];
    db.all("SELECT rowid,name,username,password,icon,url,level FROM passwords", [], (err, rows) => {
        if (err) {
            throw err;
        }
        $("#socialmediatable").html("");
        rows.forEach((row) => {
            z_passwords_All.push(row);
            if(row.level == 5){
                $("#socialmediatable").append(
                    "<tr id='id_"+row.rowid+"'>" +
                        '<td><input class="custom-checkbox" type="checkbox" name="checked[]" id="marcar"></td>' +
                        '<td>*******</td>' +
                        '<td>*******</td>' +
                        '<td>*******</td>' +
                        '<td>*******</td>' +
                        '<td>*******</td>' +
                        '<td class="text-center"><button type="button" class="btn btn-danger btn-sm" onclick="showLevelTR('+row.rowid+')"><i class="fa fa-eye text-white"></i></button>'+
                        "</td>" +
                        "</tr>"
                );
            }
            else{
                $("#socialmediatable").append(
                    "<tr >" +
                        '<td><input class="custom-checkbox" type="checkbox" name="checked[]" id="marcar_'+row.rowid+'"></td>' +
                        "<td role='button' data-toggle='modal' data-target='#updateEntryModal' "+writeDatasonRows(row)+"><i class='fa fa-pencil'></i></td>" +
                        "<td>" +
                        row.icon +
                        " " +
                        row.name +
                        "</td>" +
                        '<td role="button" class="btn-to-clip" data-clipboard-text="' +
                        row.username +
                        '">' +
                        row.username +
                        "</td>" +
                        '<td role="button" class="btn-to-clip" data-clipboard-text="' +
                        decrypt(row.password, z_masterkey) +
                        '">***********</td>' +
                        '<td role="button" class="btn-to-clip" data-clipboard-text="' +
                        row.url +
                        '"><a href="#" class="text-info">' +
                        row.url +
                        "</a></td>" +
                        "<td class='text-center' >" +
                        row.level +
                        "</td>" +
                        "</tr>"
                );
            }
        });
    });
}
function addEntry() {
    getInfo_addEntry().then((arr) => {
        db.run(
            "INSERT INTO passwords(name,username,password,url,level,icon,database) VALUES(?,?,?,?,?,?,?)",
            arr,
            (err) => {
                if (err) {
                    console.log(err.message);
                }

                getPasswords();
            }
        );
    });
}
function UpdateEntry() {
    getInfo_Updatentry().then((arr) => {
        db.run(
            "UPDATE passwords SET name = ?, username = ?, password = ?, url = ? ,level = ? ,icon = ? where rowid = ?",
            arr,
            (err) => {
                if (err) {
                    console.log(err.message);
                }

                getPasswords();
            }
        );
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
function askMasterkey() {
    getMasterkey().then((pass)=>{
        db.all("SELECT password FROM masterkey where name = 'main'", [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                if(decrypt(row.password,'keyDecryptForAllPasswords1234!') == pass){
                    unlockWorkspace();
                }else{
                    failtoUnlock();
                }
            });
        });
    });
}
function askMasterkeyVerify() {
    getMasterkey().then((pass)=>{
        db.all("SELECT password FROM masterkey where name = 'main'", [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                if(decrypt(row.password,'keyDecryptForAllPasswords1234!') == pass){
                    printChangeValues();
                }else{
                    failtoUnlock();
                }
            });
        });
    });
}


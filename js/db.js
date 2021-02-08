var sqlite3 = require("sqlite3").verbose();
const path = require('path')

let db = new sqlite3.Database(path.join(__dirname,'/databases/passafe.db'), (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to Passafe SQlite database.');
});
require('dotenv').config({ path: path.join(__dirname,'.env') });

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
    r.password+'" data-url="'+r.url+'" data-level="'+r.level+'" data-icon="'+r.icon+'" data-id="'+r.id+'" data-bd="'+r.db+'"';
}

/*
    !DAOs
*/
var z_passwords_All = [];
function getPasswords() {
        fillDatabases().then(()=>{
            z_passwords_All = [];
            db.all("SELECT id,name,username,password,icon,url,level,db FROM passwords", [], (err, rows) => {
                if (err) {
                    throw err;
                }
                $('#spinerToHide').hide()
                
                setTimeout(() => {
                    let cont = 2;
                    let entero = 0;
                    rows.forEach((row) => {
                        fillsearchtable(row)
                        let database = '#'+row.db.replace(/ /g, "_")+'_Table';
                        z_passwords_All.push(row);
                        if(row.level == 5){
                            $(database).append(
                                '<tr id="id_tr_'+row.id+'" class="animate__animated animate__slideInRight" id="tr-animate-'+row.id+'">' +
                                    '<td>**</td>' +
                                    '<td>**</td>' +
                                    '<td>***********</td>' +
                                    '<td>***********</td>' +
                                    '<td>***********</td>' +
                                    '<td>***********</td>' +
                                    '<td class="text-center"><button type="button" class="btn btn-danger btn-sm m-0 py-0" onclick="showLevelTR('+row.id+')"><i class="fa fa-eye text-white"></i></button>'+
                                    "</td>" +
                                    "</tr>"
                            );
                        }
                        else{
                            let temp = localStorage.getItem('l_master_key')
                            $(database).append(
                                '<tr onclick="printInfotoFooter(\''+row.id+'\')" class="animate__animated animate__slideInRight" id="tr-animate-'+row.id+'">' +
                                    "<td role='button' data-toggle='modal' data-target='#updateEntryModal' "+writeDatasonRows(row)+"><i class='fas fa-pen'></i></td>" +
                                    "<td>"+row.icon+"</td>"+
                                    "<td style='padding-left: 0 !important;'>" +
                                    row.name +
                                    "</td>" +
                                    '<td role="button" class="btn-to-clip" data-clipboard-text="' +
                                    row.username +
                                    '">' +
                                    row.username +
                                    "</td>" +
                                    '<td role="button" class="btn-to-clip" data-clipboard-text="' +
                                    decrypt(row.password, temp) +
                                    '">***********</td>' +
                                    '<td class="text-info" role="button" onclick="openExternalLink(\''+row.url+'\')">'+
                                    row.url +
                                    "</td>" +
                                    "<td class='text-center' >" +
                                    row.level +
                                    "</td>" +
                                "</tr>"+
                                "<script>"+
                                "$('#tr-animate-"+row.id+"').css('animation-duration', '"+entero+"."+cont+"s');"+
                                "</script>"
                            );
                        }
                        cont+=2;
                        if(cont == 10){
                            cont = 0;
                            entero+=1;
                        }
                    });
                
                    datatablesRunAfterInsertRows();
                    var table = $('#tabletofind').DataTable({
                        "paging": false,
                        "info": false,
                        "columnDefs": [
                            { "orderable": false, "targets": [0, 1] },
                            { "orderable": true, "targets": [2, 3, 4, 5] }
                        ]
                    });
                    $('#tabletofind_filter').css('display','none');
                }, 2000);
            });
        });
}
function datatablesRunAfterInsertRows() {
    db.all("SELECT * FROM databases", [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        rows.forEach((row) => {
            let database = '#'+row.nameid+'_TableOrder';
            var table = $(database).DataTable({
                "paging": false,
                "info": false,
                "columnDefs": [
                    { "orderable": false, "targets": [0, 1, 5] },
                    { "orderable": true, "targets": [2, 3, 4, 6] }
                ]
            });
            // let info = table.page.info();
            $(database+'_filter').css('display','none');
            // $('#'+row.nameid+'_infoDataTable').html('Showing '+(info.recordsDisplay)+' of '+info.recordsTotal);
            //style="height:76vh; overflow-y:auto;"
            $('#table-res-'+row.nameid).css('height','76vh')
            $('#table-res-'+row.nameid).css('overflow-y','auto')
        });
    });
}

function addEntry() {
    getInfo_addEntry().then((arr) => {
        db.run(
            "INSERT INTO passwords(name,username,password,url,level,icon,db) VALUES(?,?,?,?,?,?,?)",
            arr,
            (err) => {
                if (err) {
                    console.log(err.message);
                }
                cleanDatabasesTables();
                getPasswords();
            }
        );
    });
}
function addDatabase() {
    getInfo_addDatabase().then((arr) => {
        db.run(
            "INSERT INTO databases(name,nameid) VALUES(?,?)",
            arr,
            (err) => {
                if (err) {
                    console.log(err.message);
                }
                cleanDatabasesTables();
                getPasswords();
            }
        );
    });
}
function safeMasterkey() {
    getinfo_addMasterkey().then((arr) => {
        let pass = encrypt(arr,process.env.APP_KEY);
		
        db.run(
            "INSERT INTO masterkey(name,password) VALUES('main',?)",
            [pass],
            (err) => {
                if (err) {
                    console.log(err.message);
                }
                z_masterkey = arr;
                unlockAfterAddMasterkey();
            }
        );
    });
}
function configMasterkeychange() { // !change the masterkey password
    db.serialize(() => {
        $('#spinnerWaiterconfigMasterkey').show();
        let current = $('#configMasterkeyNameinputCurrent').val();
        let getFromdb = "";
        db.all("SELECT password FROM masterkey where name = 'main'", [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                getFromdb = decrypt(row.password,process.env.APP_KEY);
            });
            if(current == getFromdb){
                let newp = $('#configMasterkeyNameinputNew').val();
                let conf = $('#configMasterkeyNameinputConfirm').val();
                
                if(newp == conf){
                    if(current != newp){
                        let newpass = encrypt(newp,process.env.APP_KEY);
                        db.run(
                            "UPDATE masterkey SET password = ? WHERE name = 'main'",
                            [newpass],
                            (err) => {
                                if (err) {
                                    console.log(err.message);
                                }
                                z_masterkey = newp;
                                setTimeout(() => {
                                    $('#configMasterkey').modal('hide');
                                    $('#spinnerWaiterconfigMasterkey').hide();
                                    $('#close_masterchanged').addClass('show');
                                }, 1000);
                                setTimeout(() => {
                                    $('#configMasterkeyNameinputCurrent').val('')
                                    $('#configMasterkeyNameinputNew').val('');
                                    $('#configMasterkeyNameinputConfirm').val('');
                                    $('#close_masterchanged').removeClass('show');
                                }, 2000);
                            }
                        );
                    }else{
                        fail_newSame();
                    }
                }else{
                    fail_notEqual();
                }
            }else{
                fail_currentnotEqual();
            }
        });
        
    });
}
function UpdateEntry() {
    getInfo_Updatentry().then((arr) => {
        db.run(
            "UPDATE passwords SET name = ?, username = ?, password = ?, url = ? ,level = ? ,icon = ? where id = ?",
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
var z_databases_all = [];
function getDatabases() {

    z_databases_all = [];
    db.all("SELECT * FROM databases", [], (err, rows) => {
        if (err) {
            throw err;
        }
        $("#databases_addentry").html('');
        $("#deleteDatabaseNameinput").html('');
        if(rows.length == 0){
            $('#addentrybutton').addClass('disabled')
            $('#addentrybutton').prop('disabled','disabled')

            $('#deleteDatabaseButton').addClass('disabled')
            $('#deleteDatabaseButton').prop('disabled','disabled')

            $('#reloadlvl5pass').addClass('disabled')
            $('#reloadlvl5pass').prop('disabled','disabled')
        }else{
            $('#addentrybutton').removeClass('disabled')
            $('#addentrybutton').prop('disabled',false)

            $('#deleteDatabaseButton').removeClass('disabled')
            $('#deleteDatabaseButton').prop('disabled',false)

            $('#reloadlvl5pass').removeClass('disabled')
            $('#reloadlvl5pass').prop('disabled',false)
        }
        rows.forEach((row) => {
            z_databases_all.push(row);
            $("#databases_addentry").append(
                '<option value="'+row.name+'">'+row.name+'</option>'
            );
            $("#deleteDatabaseNameinput").append(
                '<option value="'+row.name+'">'+row.name+'</option>'
            );
        });
    });
}
function deleteConfirmDatabase() {
    getinfo_deleteDatabaseAsk().then((pass) => {
        db.all("SELECT password FROM masterkey where name = 'main'", [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                if(decrypt(row.password,process.env.APP_KEY) == pass){
                    deleteDatabase();
                }else{
                    failDeleteDatabase();
                }
            });
        });
    });
}
function deleteDatabase(){
    db.serialize(() => {
        getinfo_deleteDatabase().then((arr) => {
            db.run(
                "DELETE FROM databases where name = ?",
                [arr],
                (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                    db.run(
                        "DELETE FROM passwords where db = ?",
                        [arr],
                        (err) => {
                            if (err) {
                                console.log(err.message);
                            }
                            databaseDeletedSuccess();
                        }
                    );
                }
            );
        });
    });
}
function cleanDatabasesTables() {
    db.all("SELECT * FROM databases", [], (err, rows) => {
        if (err) {
            throw err;
        }

        rows.forEach((row) => {
            $("#"+row.nameid+"_Table").html('');
        });
    });
}
async function cleanDatabasesTablesAsync() {
    db.all("SELECT * FROM databases", [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            $("#"+row.nameid+"_Table").html('');
        });
    });
}
async function fillDatabases() {
        $("#list_databases").html('');
        $("#nav-tabContent").html('');
        $('#tableidresponsivesearch').html('');
        db.all("SELECT databases.name as db, COUNT(passwords.db) as cant, nameid FROM databases LEFT JOIN passwords ON passwords.db = databases.name GROUP BY databases.name ORDER BY cant DESC, db ASC", [], (err_2, r) => {
            if (err_2) {
                throw err_2;
            }
            let c = 0;
            if(r.length == 0){
                $('#list_databases').append(`
                    <div class="d-flex flex-column" style="z-index:1;">
                    <button type="button" class="btn mx-auto fa-2x">🤔</button>
                    <p class="text-white mx-auto text-center"><strong>No databases!</strong><br> Add databases</p>
                    </div>
                `);
                $('#nav-tabContent').append(`
                    <div class="d-flex flex-column">
                    <button type="button" class="btn mx-auto fa-3x">🤔</button>
                    <p class="text-muted mx-auto text-center"><strong>No Passwords!</strong><br> Add databases first</p>
                    </div>
                `);
            }
            $('#tableidresponsivesearch').html(`
                <table class="table border-top-0 table-hover table-striped" id="tabletofind" data-order="[[ 3, &quot;asc&quot; ]]">
                <thead class="bg-primary border-top-0 p-0 text-white">
                <tr>
                <th class="th-custom">Database</th>
                <th class="th-custom" style="width:30px; padding-right: 0 !important;">&nbsp;</th>
                <th class="th-custom" style="padding-left: 0 !important;" data-class-name="priority">Name</th>
                <th class="th-custom">User</th>
                <th class="th-custom">Password</th>
                <th class="th-custom">URL</th>
                <th class="th-custom" class="text-center" style="width:70px;">Level</th>
                </tr>
                </thead>
                <tbody id="tbody_tabletofind">

                </tbody>
                </table>
            `);
            r.forEach((row) => {
                if(!c){
                    $('#nameoftableon').text(row.nameid);
                    $("#list_databases").append(
                        `<a class="list-group-item dbs list-group-item-action d-flex justify-content-between align-items-center border-0 active pr-1" 
                        id="list-${row.nameid}-list" data-toggle="tab" href="#list-${row.nameid}" role="tab" 
                        aria-controls="${row.nameid}" onclick="setForSearchValue('${'#list-'+row.nameid}',event)">
                        <div class="d-block">
                            ${row.db}
                            
                        </div>
                        <span>
                            <span class="badge badge-danger text-white badge-pill mr-3">${row.cant}</span>
                            <i class="fa fa-chevron-right text-muted"></i>
                        </span>
                        </a>`
                    );
                    
                    $("#nav-tabContent").append(
                        `<div class="tab-pane fade show active" id="list-${row.nameid}" role="tabpanel" aria-labelledby="list-${row.nameid}-list">
                        <div class="table-responsive border-top-0 " id="table-res-${row.nameid}" >
                        <table class="table border-top-0 table-hover m-0" id="${row.nameid}_TableOrder" data-order="[[ 3, &quot;asc&quot; ]]">
                        <thead class="bg-primary border-top-0 p-0 text-white">
                        <tr>
                        <th class="th-custom"  style="width:15px;">&nbsp;</th>
                        <th class="th-custom"  style="width:15px; padding-right: 0 !important;">&nbsp;</th>
                        <th class="th-custom"  style="padding-left: 0 !important;" data-class-name="priority">Name</th>
                        <th class="th-custom" >User</th>
                        <th class="th-custom" >Password</th>
                        <th class="th-custom" >URL</th>
                        <th class="th-custom"  class="text-center" style="width:50px;">Level</th>
                        </tr>
                        </thead>
                        <tbody id="${row.nameid}_Table" class="">

                        </tbody>
                        </table>
                        </div> 
                        <div class="skeleton-tr"></div>
                        <div class="skeleton-tr"></div>
                        <div class="skeleton-tr"></div>
                        </div>`
                    );
                }else{
                    $("#list_databases").append(
                        `<a class="list-group-item dbs list-group-item-action d-flex justify-content-between align-items-center border-0 pr-1" 
                        id="list-${row.nameid}-list" data-toggle="tab" href="#list-${row.nameid}" role="tab" 
                        aria-controls="${row.nameid}" onclick="setForSearchValue('${'#list-'+row.nameid}',event)">
                        <div class="d-block">
                            ${row.db}
                        
                        </div>
                        <span>
                            <span class="badge badge-danger text-white badge-pill mr-3">${row.cant}</span>
                            <i class="fa fa-chevron-right text-muted"></i>
                        </span>
                        </a>`
                    );
                    $("#nav-tabContent").append(
                        `<div class="tab-pane fade" id="list-${row.nameid}" role="tabpanel" aria-labelledby="list-${row.nameid}-list">
                        <div class="table-responsive border-top-0 " id="table-res-${row.nameid}">
                        <table class="table border-top-0 table-hover m-0" id="${row.nameid}_TableOrder" data-order="[[ 3, &quot;asc&quot; ]]">
                        <thead class="bg-primary border-top-0 p-0 text-white">
                        <tr>
                        <th class="th-custom" style="width:30px;">&nbsp;</th>
                        <th class="th-custom" style="width:30px;">&nbsp;</th>
                        <th class="th-custom" data-class-name="priority">Name</th>
                        <th class="th-custom">User</th>
                        <th class="th-custom">Password</th>
                        <th class="th-custom">URL</th>
                        <th class="th-custom" class="text-center" style="width:50px;">Level</th>
                        </tr>
                        </thead>
                        <tbody id="${row.nameid}_Table" class="">

                        </tbody>
                        </table>
                        </div>
                        <div class="skeleton-tr"></div>
                        <div class="skeleton-tr"></div>
                        <div class="skeleton-tr"></div>
                        </div>`
                    );
                }
                
                c+=1;
            });
            
        });
        $( "div" ).remove( ".skeleton-list-a" );
}
function fillsearchtable(row) {
    $('#tbody_tabletofind').append(`
        <tr>
            <td>${row.db}</td>
            <td style="padding-right: 0 !important;">${row.icon}</td>
            <td style="padding-left: 0 !important;">${row.name}</td>
            <td role="button" class="btn-to-clip" data-clipboard-text="${row.username}">${row.username}</td>
            <td role="button" class="btn-to-clip" data-clipboard-text="${decrypt(row.password,localStorage.getItem('l_master_key'))}">******</td>
            <td class="text-info" role="button" onclick="openExternalLink('${row.url}')">${row.url}</td>
            <td class="text-center">${row.level}</td>
        </tr>
    `);
}
function askMasterkey() {
    getMasterkey().then((pass)=>{
        db.all("SELECT password FROM masterkey where name = 'main'", [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                if(decrypt(row.password,process.env.APP_KEY) == pass){
                    localStorage.setItem('l_master_key',pass);
                    z_masterkey = pass;
                    unlockWorkspace(pass);
                }else{
                    failtoUnlock();
                }
            });
        });
    });
}
function askMasterkeyVerify() {
    getMasterkeyVerifyCon().then((pass)=>{
        db.all("SELECT password FROM masterkey where name = 'main'", [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                if(decrypt(row.password,process.env.APP_KEY) == pass){
                    printChangeValues();
                }else{
                    failtoUnlock();
                }
            });
        });
    });
}
async function isMasterKey() {
    db.all("SELECT COUNT(*) as cnt FROM masterkey where name = 'main'", [], (err, rows) => {
        if (err) {
            throw err;
        }
        z_checkMasterkeyExists = rows[0].cnt == 1;
        
    });
}
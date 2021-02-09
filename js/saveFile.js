const { rejects } = require('assert');
var fs = require('fs');

var sf_passwords = [];
var sf_databases = [];
function selectAll() {
    sf_passwords = [];
    sf_databases = [];
    db.serialize(()=>{
        db.all("SELECT * FROM passwords", [], (err, rows) => {
            if (err) {
                console.log(err);
            }
            rows.forEach((row) => {
                sf_passwords.push(row)
            });
        }).all("SELECT * FROM databases", [], (err, rows) => {
            if (err) {
                console.log(err);
            }
            rows.forEach((row) => {
                sf_databases.push(row)
            });
            //todo
        });
    })
}
function openmakeFile() {
    $('#saveModal').modal('show')
    selectAll()
}
function reviewInfo() {
    $('#reviewInfoPanel').html('')
    sf_passwords = [];
    sf_databases = [];
    db.serialize(()=>{
        db.all("SELECT * FROM passwords", [], (err, rows) => {
            if (err) {
                console.log(err);
            }
            rows.forEach((row) => {
                sf_passwords.push(row)
            });
        }).all("SELECT * FROM databases", [], (err, rows) => {
            if (err) {
                console.log(err);
            }
            rows.forEach((row) => {
                sf_databases.push(row)
            });
            
            $('#reviewInfoPanel').append(`<span class="text-info">[</span>`)
            sf_passwords.forEach((row)=>{
                $('#reviewInfoPanel').append(`<br>
                    <span class="pl-2"><span class="text-warning">{</span></span> <br>
                    <span class="pl-4"><span class="text-danger">"id"</span>: <span class="text-info">${row.id}</span>, </span><br>
                    <span class="pl-4"><span class="text-danger">"name"</span>: <span style="color:#4ccc3b;">"${row.name}"</span>, </span><br>
                    <span class="pl-4"><span class="text-danger">"database"</span>: <span style="color:#4ccc3b;">"${row.db}"</span>, </span><br>
                    <span class="pl-4"><span class="text-danger">"user"</span>: <span style="color:#4ccc3b;">"${row.username}"</span>, </span><br>
                    <span class="pl-4"><span class="text-danger">"pass"</span>: <span style="color:#4ccc3b;">"******"</span>, </span><br>
                    <span class="pl-4"><span class="text-danger">"url"</span>: <span style="color:#4ccc3b;">"${row.url}"</span> </span><br>
                    <span class="pl-4"><span class="text-danger">"level"</span>: <span class="text-info">${row.level}</span> </span><br>
                    <span class="pl-2"><span class="text-warning">}</span>, </span>
                `)
            })
            $('#reviewInfoPanel').append(`<span class="text-info">]</span>`)
        });
    })
    
}
function makeFile() {
    let filename = $('#inputNameFileCustom').val()
    if(filename == ''){
        animateReturn('#inputNameFileCustom','shakeX');
        
    }else{
        let fileContent = {
            db: sf_databases,
            pass: sf_passwords
        };
        let filepath = `${filename}_Custom.json`;
        sf_passwords = [];
        sf_databases = [];
        db.serialize(()=>{
            db.all("SELECT * FROM passwords", [], (err, rows) => {
                if (err) {
                    console.log(err);
                }
                rows.forEach((row) => {
                    sf_passwords.push(row)
                });
            }).all("SELECT * FROM databases", [], (err, rows) => {
                if (err) {
                    console.log(err);
                }
                rows.forEach((row) => {
                    sf_databases.push(row)
                });
                fileContent = JSON.stringify(fileContent)
                fs.writeFile(filepath, fileContent, (err) => {
                    if (err) throw err;
                    $('#close_saveFileAlert').addClass('show')
                    $('#saveModal').modal('hide')
                    setTimeout(() => {
                        $('#close_saveFileAlert').removeClass('show')
                    }, 2500);
                }); 
            });
        })
    }
}
var rf_passwords =[];
var rf_dbs = [];
function readFile() {
    $('#readPanelAll').html('')
    rf_passwords =[];
    rf_dbs = [];
    let name = $('#customFile').val()
    let splited = name.split('.');
    let typesplited = splited[splited.length -1];
    if(typesplited == 'json'){
        var fileToLoad = document.getElementById("customFile").files[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent){
            var textFromFileLoaded = fileLoadedEvent.target.result;
            let text = JSON.stringify(JSON.parse(textFromFileLoaded),null,2)
            text = JSON.parse(text)
            if(text.db && text.pass){
                $('#borderfileuploadpanel').removeClass('borderfileuploadpanelred')
                $('#filenameRead').html(name.split('\\')[2])
                $('#customFileLabel').text(name.split('\\')[2])
                $('#buttonLoadFiletoDatabase').prop('disabled',false)
                let db = text.db;
                let pass = text.pass;
                rf_passwords = pass;
                rf_dbs = db;
                $('#readPanelAll').append(`<span class="text-muted">1&nbsp;|&nbsp;</span><span class="text-info">[</span><br>`)
                let cant = 2;
                pass.forEach((row)=>{
                    $('#readPanelAll').append(`
                        <span class="text-muted">${cant < 10 ? `${cant++}&nbsp;`:cant++}| </span><span class="pl-2"><span class="text-warning">{</span></span> <br>
                        <span class="text-muted">${cant < 10 ? `${cant++}&nbsp;`:cant++}| </span><span class="pl-4"><span class="text-danger">"id"</span>: <span class="text-info">${row.id}</span>, </span><br>
                        <span class="text-muted">${cant < 10 ? `${cant++}&nbsp;`:cant++}| </span><span class="pl-4"><span class="text-danger">"name"</span>: <span style="color:#4ccc3b;">"${row.name}"</span>, </span><br>
                        <span class="text-muted">${cant < 10 ? `${cant++}&nbsp;`:cant++}| </span><span class="pl-4"><span class="text-danger">"database"</span>: <span style="color:#4ccc3b;">"${row.db}"</span>, </span><br>
                        <span class="text-muted">${cant < 10 ? `${cant++}&nbsp;`:cant++}| </span><span class="pl-4"><span class="text-danger">"user"</span>: <span style="color:#4ccc3b;">"${row.username}"</span>, </span><br>
                        <span class="text-muted">${cant < 10 ? `${cant++}&nbsp;`:cant++}| </span><span class="pl-4"><span class="text-danger">"pass"</span>: <span style="color:#4ccc3b;">"******"</span>, </span><br>
                        <span class="text-muted">${cant < 10 ? `${cant++}&nbsp;`:cant++}| </span><span class="pl-4"><span class="text-danger">"url"</span>: <span style="color:#4ccc3b;">"${row.url}"</span> </span><br>
                        <span class="text-muted">${cant < 10 ? `${cant++}&nbsp;`:cant++}| </span><span class="pl-4"><span class="text-danger">"level"</span>: <span class="text-info">${row.level}</span> </span><br>
                        <span class="text-muted">${cant < 10 ? `${cant++}&nbsp;`:cant++}| </span><span class="pl-2"><span class="text-warning">}</span>, </span><br>
                    `)
                })
                $('#readPanelAll').append(`<span class="text-muted">${cant++}| </span><span class="text-info">]</span>`)
            }else{
                $('#filenameRead').html('<i class="fas fa-exclamation text-danger"></i> Not a database File')
                $('#borderfileuploadpanel').addClass('borderfileuploadpanelred')
            }
        };
        fileReader.readAsText(fileToLoad, "UTF-8");
    }
}

function loadDataToDatabase() {
    $('#spinerloadtodatabase').show()
    db.serialize(()=>{
        let databasesfirst = new Promise((resolve, reject)=>{
            let cont = 0;
            rf_dbs.forEach((row)=>{
                setTimeout(() => {            
                    db.run(
                        `INSERT INTO databases(name,nameid) VALUES('${row.name}','${row.nameid}')`,
                        [],
                        (err) => {
                            if (err) {
                                let m = `${err.message}`;
                                if(m.includes('UNIQUE constraint')){
                                    $('#pushToastContainer').append(`
                                        <div class="toast toast-i show" id="toast-item-${row.nameid}">
                                        <div class="toast-header">
                                        <i class="fas fa-exclamation-triangle mr-2 text-warning"></i>
                                        <strong class="mr-auto">Database</strong>
                                        </div>
                                        <div class="toast-body">
                                            "${capFL(row.name)}" already exists, but passwords are beign loading!
                                        </div>
                                        </div>
                                    `)
                                    animateReturn(`#toast-item-${row.nameid}`,'fadeInUp')
                                    setTimeout(() => {
                                        animateReturn(`#toast-item-${row.nameid}`,'fadeOut')
                                        setTimeout(() => {
                                            $(`#toast-item-${row.nameid}`).remove()
                                        }, 1000);
                                    }, 6000);
                                }else{
                                    reject('not_db_file')
                                }
                            }else{
                                $('#pushToastContainer').append(`
                                    <div class="toast toast-i show" id="toast-item-${row.nameid}">
                                    <div class="toast-header">
                                    <i class="fa fa-check-square mr-2 text-success"></i>
                                    <strong class="mr-auto">Database</strong>
                                    </div>
                                    <div class="toast-body">
                                        "${capFL(row.name)}" loaded!
                                    </div>
                                    </div>
                                `)
                                animateReturn(`#toast-item-${row.nameid}`,'fadeInUp')
                                setTimeout(() => {
                                    animateReturn(`#toast-item-${row.nameid}`,'fadeOut')
                                    setTimeout(() => {
                                        $(`#toast-item-${row.nameid}`).remove()
                                    }, 1000);
                                }, 5000);
                            }
                        }
                        
                    );
                }, 500);
                cont+=1;
                if(rf_dbs.length == cont){
                    resolve('this')
                }
            })
        })
        databasesfirst.then((mes)=>{
            let passwordspromise = new Promise((resolve,reject)=>{
                let cont = 0;
                rf_passwords.forEach((row)=>{
                    setTimeout(() => {
                        db.run(
                            `INSERT INTO passwords(name,username,password,url,level,icon,db) VALUES("${row.name}","${row.username}","${row.password}","${row.url}",${row.level},"${row.icon}","${row.db}")`,
                            [],
                            (err) => {
                                if (err) {
                                    console.log(err.message)
                                    let m = `${err.message}`;
                                    if(m.includes('UNIQUE constraint')){
                                        $('#pushToastContainer').append(`
                                            <div class="toast toast-i show" id="toast-item-passwords-${row.id}">
                                            <div class="toast-header">
                                            <i class="fas fa-exclamation-triangle mr-2 text-warning"></i>
                                            <strong class="mr-auto">Passwords</strong>
                                            </div>
                                            <div class="toast-body">
                                                "${capFL(row.name)}" already exists, but passwords are beign loading!
                                            </div>
                                            </div>
                                        `)
                                        animateReturn(`#toast-item-passwords-${row.id}`,'fadeInUp')
                                        setTimeout(() => {
                                            animateReturn(`#toast-item-passwords-${row.id}`,'fadeOut')
                                            setTimeout(() => {
                                                $(`#toast-item-passwords-${row.id}`).remove()
                                            }, 1000);
                                        }, 6000);
                                    }else{
                                        reject('not_db_file')
                                    }
                                }else{
                                    $('#pushToastContainer').append(`
                                        <div class="toast toast-i show" id="toast-item-passwords-${row.id}">
                                        <div class="toast-header">
                                        <i class="fa fa-check-square mr-2 text-success"></i>
                                        <strong class="mr-auto">Passwords</strong>
                                        </div>
                                        <div class="toast-body">
                                            ${row.icon} "${capFL(row.name)}" loaded to ${row.db}!
                                        </div>
                                        </div>
                                    `)
                                    animateReturn(`#toast-item-passwords-${row.id}`,'fadeInUp')
                                    setTimeout(() => {
                                        animateReturn(`#toast-item-passwords-${row.id}`,'fadeOut')
                                        setTimeout(() => {
                                            $(`#toast-item-passwords-${row.id}`).remove()
                                        }, 1000);
                                    }, 5000);
                                }
                            }
                            
                        );
                    }, 500);
                    cont+=1;
                    if(rf_passwords.length == cont){
                        resolve('this')
                    }
                })
            })
            passwordspromise.then((pms)=>{
                $('#uploadDataModal').modal('hide')
                setTimeout(() => {
                    getPasswords();
                    getDatabases();
                }, 2000);
                $('#spinerloadtodatabase').hide()
                
            })
        })
    })
}
function capFL(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


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
    rf_passwords =[];
    rf_dbs = [];
    $('#filenameRead').html($('#customFile').val())
    var fileToLoad = document.getElementById("customFile").files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        let text = JSON.stringify(JSON.parse(textFromFileLoaded),null,2)
        text = JSON.parse(text)
        let db = text.db;
        let pass = text.pass;
        rf_passwords = pass;
        rf_dbs = db;
        $('#readPanelAll').append(`<span class="text-info">[</span><br>`)
        pass.forEach((row)=>{
            $('#readPanelAll').append(`
                <span class="pl-2"><span class="text-warning">{</span></span> <br>
                <span class="pl-4"><span class="text-danger">"id"</span>: <span class="text-info">${row.id}</span>, </span><br>
                <span class="pl-4"><span class="text-danger">"name"</span>: <span style="color:#4ccc3b;">"${row.name}"</span>, </span><br>
                <span class="pl-4"><span class="text-danger">"database"</span>: <span style="color:#4ccc3b;">"${row.db}"</span>, </span><br>
                <span class="pl-4"><span class="text-danger">"user"</span>: <span style="color:#4ccc3b;">"${row.username}"</span>, </span><br>
                <span class="pl-4"><span class="text-danger">"pass"</span>: <span style="color:#4ccc3b;">"******"</span>, </span><br>
                <span class="pl-4"><span class="text-danger">"url"</span>: <span style="color:#4ccc3b;">"${row.url}"</span> </span><br>
                <span class="pl-4"><span class="text-danger">"level"</span>: <span class="text-info">${row.level}</span> </span><br>
                <span class="pl-2"><span class="text-warning">}</span>, </span><br>
            `)
        })
        $('#readPanelAll').append(`<span class="text-info">]</span>`)
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function loadDataToDatabase() {
    db.serialize(()=>{
        rf_dbs.forEach((row)=>{
            db.run(
                `INSERT INTO databases(name,nameid) VALUES('${row.name}','${row.nameid}')`,
                [],
                (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                    
                }
            );
        })
    })
}



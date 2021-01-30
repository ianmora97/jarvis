var z_masterkey = "";
var z_checkMasterkeyExists;
var clipboard = new ClipboardJS('.btn-to-clip');

function eventsOnLoad(event) {
    openModalEntry();
    openModalEdit();
    getIconSelected();
    getIconSelectedUpdate();
    checkLoginInit();
    typeEntertoUnlock();
    tryAgain();
    popoverGenPass();
    popovericonselect();
    deleteDatabaseEvents();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}
function checkCheckedEdit() {
    $("#edit_copyUser").click(function () {
        let Options = $("[id*=marcar_]");

        for (let i = 0; i < Options.length; i++) {
            if (Options[i].checked) {
                //CopiarUsuario
            }
        }
    });
}
function setForSearchValue(name) {
    $('#nameoftableon').text(name);
}
function searchinTables() {
    let stable = $('#nameoftableon').text();
    let idtable = '#'+stable+'_TableOrder';
    let table = $(idtable).DataTable();
    let val = $('#searchBarTables').val();           
    let result = table.search( val ).draw();
    console.log(result);
}
function checkLoginInit() {
    db.all("SELECT COUNT(*) as cnt FROM masterkey where name = 'main'", [], (err, rows) => {
        if (err) {
            throw err;
        }
        z_checkMasterkeyExists = rows[0].cnt == 1;
        if(z_checkMasterkeyExists){
            $('#masterKey').modal('show');
        }else{
            $('#addMasterKey').modal('show');
        }
    });
}
function openModaladddatabase() {
    $('#addDatabase').modal('show');
}


function fillEntryInfoButton(name,user,url,level) {
    $('#entryInfo').append(name);
}

function typeEntertoUnlock() {
    $('#passwordKeyMasterUnlock').on('keyup',function (event){
        if(event.which == 13){
            askMasterkey();
        }
    });
}

async function getMasterkey() {
    return $('#passwordKeyMasterUnlock').val();
}


async function getinfo_addMasterkey(){
    return $('#passwordKeyMasterAddMasterKey').val();
}
/*
    !Tables
*/
var tempIdToShow;
function showLevelTR(id) {
    console.log('a');
    tempIdToShow = id;
    $('#masterKey').modal('show');
    $('#showPassMasterKeyButton').show();
    $('#askMasterKeyButton').hide();
}
function printChangeValues() {
    $('#showPassMasterKeyButton').hide();
    $('#askMasterKeyButton').show();
    let id = tempIdToShow;
    for(let i=0;i<z_passwords_All.length;i++){
        if(z_passwords_All[i].rowid == id){
            $('#id_'+id).html('');
            let row = z_passwords_All[i];
            $('#id_'+id).append(
                '<td><input class="custom-checkbox" type="checkbox" name="all" id="marcar"></td>' +
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
                "<td  class='text-center'>" +
                row.level +
                "</td>"
            );

        }
    }
    $('#masterKey').modal('hide');
}


/*
    !Forms
*/
function rangeLevelNumber(val) {
    $("#valor").html(val);
}
var lastPasswordEntry;
function verifyPassword(val) {
    let v = Math.ceil(val.length / 30 * 100);
    if(val.length > 30){
        $("#modal_entryPassword").val(lastPasswordEntry);
    }else{
        lastPasswordEntry = val;
        $("#passwordsafe").css("width",v + "%");
        if(v <= 33){
            setBackground("#passwordsafe","bg-danger");
        }else if(v > 33 && v <= 66){
            setBackground("#passwordsafe","bg-warning");
        }else if(v > 66){
            setBackground("#passwordsafe","bg-success");
        }
    }
    
}
function setBackground(id,string){
    $(id).addClass(string);
    if(string == "bg-success"){
        $(id).removeClass("bg-warning");
        $(id).removeClass("bg-danger");
    }
    if(string == "bg-warning"){
        $(id).removeClass("bg-success");
        $(id).removeClass("bg-danger");
    }
    if(string == "bg-danger"){
        $(id).removeClass("bg-success");
        $(id).removeClass("bg-warning");
    }
}

function generatePassButton() {
    $("#i_gear").addClass('fa-spin');

    let v1 = "abcdefghijklmnopqrstuvwxyz";
    let v2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let v3 = "1234567890";
    let v4 = "!@#$%^&*()+<>";   

    let lower = $('.popover #lowercaseCheck')[0].checked;
    let upper = $('.popover #uppercaseCheck')[0].checked;
    let number = $('.popover #numbersCheck')[0].checked;
    let chars = $('.popover #charactersCheck')[0].checked;     
    setTimeout(() => {
        let vec = [];
        lower && vec.push(v1);
        upper && vec.push(v2);
        number && vec.push(v3);
        chars && vec.push(v4);
    
        generatePassword(vec).then((pass)=>{
            setTimeout(()=>{
                $("#modal_entryPassword").val(pass);
                verifyPassword(pass);
                $("#i_gear").removeClass('fa-spin');
            },1000);
        });
    }, 1000);
}

function getIconSelected() {
    $('#dropdownIcons .col button').on('click', function(){
        console.log('click');
        let icon = $(this).html();
        $('#iconSelected').html('');
        $('#iconSelected').html(icon);
    });
}

/*
    !UPDATEs
*/

function generatePassButtonUpdate() {
    
    $("#i_gearUpdate").addClass('fa-spin');

    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var  pass = "";
    for (var x = 0; x < 25; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    
    setTimeout(()=>{
        $("#Updatemodal_entryPassword").val(pass);
        verifyPasswordUpdate(pass);
        $("#i_gearUpdate").removeClass('fa-spin');
    },1000);
    
}
function getIconSelectedUpdate() {
    $('#dropdownIconsUpdate button').on('click', function(){
        let icon = $(this).html();
        $('#iconSelectedUpdate').html('');
        $('#iconSelectedUpdate').html(icon);
    });
}

var lastPasswordEntryUpdate;
function verifyPasswordUpdate(val) {
    let v = Math.ceil(val.length / 30 * 100);
    if(val.length > 30){
        $("#Updatemodal_entryPassword").val(lastPasswordEntryUpdate);
    }else{
        lastPasswordEntryUpdate = val;
        $("#passwordsafeUpdate").css("width",v + "%");
        if(v <= 33){
            setBackground("#passwordsafeUpdate","bg-danger");
        }else if(v > 33 && v <= 66){
            setBackground("#passwordsafeUpdate","bg-warning");
        }else if(v > 66){
            setBackground("#passwordsafeUpdate","bg-success");
        }
    }
    
}
document.addEventListener("DOMContentLoaded", eventsOnLoad);
var z_masterkey = "1234";
var clipboard = new ClipboardJS('.btn-to-clip');

function eventsOnLoad(event) {
    openModalEntry();
    openModalEdit();
    getIconSelected();
    getIconSelectedUpdate();
    openBlockLogin();
    typeEntertoUnlock();
    tryAgain();
    popoverGenPass();
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


function popoverGenPass() {
    $("#gearGeneratePass").popover({
        html: true,
        sanitize: false,
        content: function() {
              return $('#popover-content-genpass').html();
        }
    });

    $("#gearGeneratePass").on("shown.bs.popover",function(){
        $(".popover-content input").on("change",function(){
            if(this.checked){
                this.setAttribute("checked","checked");
            }else{
                this.removeAttribute("checked");
            }
            $("#gearGeneratePass").html($(".popover-content").html());
        });
    });  
}

function openBlockLogin() {
    $('#masterKey').modal('show'); 
}
function closeAlert(e) {
    $('#close_addNewEntryAlert').removeClass('show');
}

function openModalEntry() {
    $('#addentrybutton').on('click',()=>{
        $('#addEntryModal').modal('show');   
    });
}

function openModalEdit() { // !modal for update a password
    $('#updateEntryModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal

        let id = button.data('id') 
        let name = button.data('name') 
        let username = button.data('username') 
        let password = button.data('password') 
        let url = button.data('url') 
        let level = button.data('level') 
        let icon = button.data('icon')

        $('#updateRowID').val(id)
        $('#Updatemodal_entryName').val(name)
        $('#Updatemodal_entryUsername').val(username)
        $('#Updatemodal_entryPassword').val(decrypt(password,z_masterkey))
        verifyPasswordUpdate(decrypt(password,z_masterkey));
        $('#Updatemodal_entryUrl').val(url)
        $('#Updatemodal_entryLevel').val(level)
        $('#iconSelectedUpdate').html('')
        $('#iconSelectedUpdate').html(icon)
      })
}

function changeDatabase(db) {
    $("#modal_EntryDatabase").val(db);
}
function fillEntryInfoButton(name,user,url,level) {
    $('#entryInfo').append(name);
}
/*
    !Master Key Workspace
*/


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
function changeVisPassButtonUnlock() {
    let type = $("#passwordKeyMasterUnlock").attr('type');
    if(type == 'password'){
        $("#passwordKeyMasterUnlock").attr('type','text');
        $("#eyeChangePassUnlock").html('');
        $("#eyeChangePassUnlock").html('<i class="fa fa-eye"></i>');
    }
    else{
        $("#passwordKeyMasterUnlock").attr('type','password');
        $("#eyeChangePassUnlock").html('');
        $("#eyeChangePassUnlock").html('<i class="fa fa-eye-slash">');
    }
    $("#passwordKeyMasterUnlock").html();
}
function tryAgain() {
    $('#passwordKeyMasterUnlock').on('keyup',function (event){
        $("#passwordKeyMasterUnlock").removeClass('is-invalid');
    });
}
function failtoUnlock() {
    $('#spinnerWaiterMasterKey').show();
    setTimeout(() => {
        $("#passwordKeyMasterUnlock").addClass('is-invalid');
        $("#contentModalUnlockWorkSpace").addClass('animate__animated animate__shakeX');
        $('#spinnerWaiterMasterKey').hide();
    }, 1000);
}
function lockWorkspace() {
    $('#block_workSpace').addClass('animate__animated animate__backOutDown');
    
    
    setTimeout(() => {
        $('#block_workSpace').removeClass('animate__animated animate__backOutDown');
        $('#blankButtonScreen').addClass('d-flex');
        $('#blankButtonScreen').show();
    }, 1000);

    $('#masterKey').removeClass('animate__animated animate__bounceOutDown');
    $('#masterKey').addClass('animate__animated animate__bounceInUp');
    setTimeout(() => {
        $('#masterKey').modal('show');
    }, 600);
}
function unlockWorkspace() {

    $('#block_workSpace').addClass('animate__animated animate__backInUp');

    $('#blankButtonScreen').addClass('animate__animated animate__backOutUp');
    $('#block_workSpace').show();
    setTimeout(() => {

        $('#blankButtonScreen').removeClass('animate__animated animate__backOutUp ');
        $('#blankButtonScreen').removeClass('d-flex');
        $('#blankButtonScreen').hide();
    }, 700);
    setTimeout(() => {
        $('#block_workSpace').removeClass('animate__animated animate__backOutDown');
        $('#block_workSpace').removeClass('animate__animated animate__backInUp');
    }, 1000);
    $('#spinnerWaiterMasterKey').show();
    
    getPasswords();
    getDatabases();
    $('#masterKey').removeClass('animate__animated animate__bounceInUp');
    $('#masterKey').addClass('animate__animated animate__bounceOutDown');
    setTimeout(() => {
        $('#masterKey').removeClass('animate__animated animate__bounceOutDown');
        $('#spinnerWaiterMasterKey').hide();
        $('#masterKey').modal('hide');
        $("#modal_entryPassword").val('');

    }, 700);
}
/*
    !BD
*/
async function getInfo_addEntry() {
    $('#spinnerWaiterAddEntry').show();
    let name,username,password,url,level,icon,database;
    name = $("#modal_entryName").val();
    username = $("#modal_entryUsername").val();
    password = $("#modal_entryPassword").val();

    //thing to encrypt passwords
    password = encrypt(password,z_masterkey);

    url = $("#modal_entryUrl").val();
    level = parseInt($("#modal_entryLevel").val());
    icon = $("#iconSelected").html();
    icon = icon.replace(/\"/g, "\'");
    database = $( "#databases_addentry option:selected" ).text();
    setTimeout(() => {
        $('#spinnerWaiterAddEntry').hide();
        $('#addEntryModal').modal('hide');
        $('#close_addNewEntryAlert').addClass('show');
    }, 600);
    setTimeout(() => {
        $('#close_addNewEntryAlert').removeClass('show');
        cleanInputs();
    }, 2000);
    return [name,username,password,url,level,icon,database];
}
function cleanInputs() {
    $("#modal_entryName").val('');
    $("#modal_entryUsername").val('');
    $("#modal_entryPassword").val('');
    $("#modal_entryUrl").val('');
    $("#modal_entryLevel").val('');
    $("#iconSelected").html('<i class="fa fa-key"></i>');
}
async function getInfo_Updatentry() {
    $('#spinnerWaiterUpdateEntry').show();
    let name,username,password,url,level,icon,database;

    let id = $("#updateRowID").val();
    name = $("#Updatemodal_entryName").val();
    username = $("#Updatemodal_entryUsername").val();
    password = $("#Updatemodal_entryPassword").val();

    //thing to encrypt passwords
    password = encrypt(password,z_masterkey);

    url = $("#Updatemodal_entryUrl").val();
    level = parseInt($("#Updatemodal_entryLevel").val());
    icon = $("#iconSelectedUpdate").html();
    icon = icon.replace(/\"/g, "\'");

    setTimeout(() => {
        $('#spinnerWaiterUpdateEntry').hide();
        $('#updateEntryModal').modal('hide');
        $('#close_addNewEntryAlert').addClass('show');
    }, 600);
    setTimeout(() => {
        $('#close_addNewEntryAlert').removeClass('show');
    }, 2000);

    return [name,username,password,url,level,icon,id];
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
function changeVisPassButton() {
    let type = $("#modal_entryPassword").attr('type');
    if(type == 'password'){
        $("#modal_entryPassword").attr('type','text');
        $("#eyeChangePass").html('');
        $("#eyeChangePass").html('<i class="fa fa-eye"></i>');
    }
    else{
        $("#modal_entryPassword").attr('type','password');
        $("#eyeChangePass").html('');
        $("#eyeChangePass").html('<i class="fa fa-eye-slash">');
    }
    $("#modal_entryPassword").html();
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
    $('#dropdownIcons button').on('click', function(){
        let icon = $(this).html();
        $('#iconSelected').html('');
        $('#iconSelected').html(icon);
    });
}

/*
    !UPDATEs
*/
function changeVisPassButtonUpdate() {
    let type = $("#Updatemodal_entryPassword").attr('type');
    if(type == 'password'){
        $("#Updatemodal_entryPassword").attr('type','text');
        $("#eyeChangePassUpdate").html('');
        $("#eyeChangePassUpdate").html('<i class="fa fa-eye"></i>');
    }
    else{
        $("#Updatemodal_entryPassword").attr('type','password');
        $("#eyeChangePassUpdate").html('');
        $("#eyeChangePassUpdate").html('<i class="fa fa-eye-slash">');
    }
    $("#Updatemodal_entryPassword").html();
}
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
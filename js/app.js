var z_masterkey = "1234";
var clipboard = new ClipboardJS('.btn-to-clip');

function eventsOnLoad(event) {
    getPasswords();
    openModalEntry();
    getIconSelected();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}
function copy(el) {
    let pass = $(el).data('pass') + "";
    pass = String(pass);
    console.log(typeof pass);
    pass.select();
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
} 

function openModalEntry() {
    $('#addentrybutton').on('click',()=>{
        $('#addEntryModal').modal('show');   
    });
}
function changeDatabase(db) {
    $("#modal_EntryDatabase").val(db);
}
/*
    !BD
*/
async function getInfo_addEntry() {
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
    database = $("#modal_EntryDatabase").val();

    return [name,username,password,url,level,icon,database];
}



/*
    !Forms
*/
function rangeLevelNumber(val) {
    $("#valor").html(val);
}
var lastPasswordEntry;
function verifyPassword(val) {
    let v = Math.ceil(val.length / 25 * 100);
    if(val.length > 25){
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

    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var  pass = "";
    for (var x = 0; x < 25; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    
    setTimeout(()=>{
        $("#modal_entryPassword").val(pass);
        verifyPassword(pass);
        $("#i_gear").removeClass('fa-spin');
    },1000);
    
}
function getIconSelected() {
    $('#dropdownIcons button').on('click', function(){
        let icon = $(this).html();
        $('#iconSelected').html('');
        $('#iconSelected').html(icon);
    });
}
document.addEventListener("DOMContentLoaded", eventsOnLoad);
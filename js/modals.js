/*
    ! modals.js is the file for modals, everything releated to
    ! modals goes here.
*/

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


function openModalEntry() {
    $('#addentrybutton').on('click',()=>{
        $('#addEntryModal').modal('show');   
    });
}
function openModaldeletedatabase() {
    $('#deleteDatabase').modal('show');
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
    }, 3000);
    return [name,username,password,url,level,icon,database];
}
async function getInfo_addDatabase() {
    $('#spinnerWaiterAddDatabase').show();
    let name,nameid;
    name = $("#addDatabaseNameinput").val();
    nameid = name.replace(/ /g, "_");
    setTimeout(() => {
        $('#spinnerWaiterAddDatabase').hide();
        $('#addDatabase').modal('hide');
        $('#close_addNewDatabase').addClass('show');
    }, 600);
    setTimeout(() => {
        $('#close_addNewDatabase').removeClass('show');
        $("#addDatabaseNameinput").val('');
        getDatabases()
    }, 3000);
    return [name,nameid];
}
function cleanInputs() {
    $("#modal_entryName").val('');
    $("#modal_entryUsername").val('');
    $("#modal_entryPassword").val('');
    $("#passwordsafe").css('width',0);
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
function checkDeleteDatabase() {
    $('#spinnerWaiterdeleteDatabaseCheck').show();
    $('#deleteDatabaseNameinput').attr('disabled','on')
    setTimeout(() => {
        $('#spinnerWaiterdeleteDatabaseCheck').hide();
        $('#confirmDatabaseTobeDelete').show()
        $('#buttondeleteDatabaseModalCheck').hide() //check button turn hide
        
        $('#buttondeleteDatabaseModal').attr('disabled','on') //delete button turn disabled until type something
        $('#buttondeleteDatabaseModal').show()
        
        $('#confirmDatabaseTobeDelete').addClass('animate__animated animate__bounceIn');
    }, 300);
    setTimeout(() => {
        $('#confirmDatabaseTobeDelete').removeClass('animate__animated animate__bounceIn');
    }, 2000);
}
function deleteDatabaseEvents() {
    $('#deleteDatabaseNameinputconfirm').on('keyup',function (event){
        let l=$('#deleteDatabaseNameinputconfirm').val().length
        if(l>0){
            $('#buttondeleteDatabaseModal').removeAttr('disabled')
        }else{
            $('#buttondeleteDatabaseModal').attr('disabled','on')
        }
    })
    $('#cancelClosedeleteDatabase').on('click',function(){
        setTimeout(() => {
            $('#buttondeleteDatabaseModal').removeAttr('disabled')
            $('#buttondeleteDatabaseModalCheck').show() 
            $('#confirmDatabaseTobeDelete').hide()
            $('#deleteDatabaseNameinput').removeAttr('disabled')
            $('#buttondeleteDatabaseModal').hide()
            $('#deleteDatabaseNameinputconfirm').val('')
        }, 1000);
    })
}
async function getinfo_deleteDatabaseAsk() {
    return $( "#deleteDatabaseNameinputconfirm").val();
}

async function getinfo_deleteDatabase() {
    return $( "#deleteDatabaseNameinput option:selected" ).text();
}

function databaseDeletedSuccess() {
    //database deleted
    
    $('#spinnerWaiterdeleteDatabase').show();
    
    setTimeout(() => {
        $('#spinnerWaiterdeleteDatabase').hide();
        $('#deleteDatabase').modal('hide');
        $('#close_deleteDatabase').addClass('show');
        
    }, 600);
    setTimeout(() => {
        $('#buttondeleteDatabaseModal').removeAttr('disabled')
        $('#buttondeleteDatabaseModalCheck').show() 
        $('#confirmDatabaseTobeDelete').hide()
        $('#deleteDatabaseNameinput').removeAttr('disabled')
        $('#buttondeleteDatabaseModal').hide()
        $('#deleteDatabaseNameinputconfirm').val('')
        $('#close_deleteDatabase').removeClass('show');
        cleanDatabasesTablesAsync().then(()=>{
            getPasswords();
            getDatabases();
        });
    }, 2000);
}
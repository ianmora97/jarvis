/*
    ! ui.js is the file for UI channges in DOM, everything releated to
    ! movements or any animations goes here.
*/
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
function changeVisPassButtonAddMasterkey() {
    let type = $("#passwordKeyMasterAddMasterKey").attr('type');
    if(type == 'password'){
        $("#passwordKeyMasterAddMasterKey").attr('type','text');
        $("#eyeChangePassAddMasterkey").html('');
        $("#eyeChangePassAddMasterkey").html('<i class="fa fa-eye"></i>');
    }
    else{
        $("#passwordKeyMasterAddMasterKey").attr('type','password');
        $("#eyeChangePassAddMasterkey").html('');
        $("#eyeChangePassAddMasterkey").html('<i class="fa fa-eye-slash">');
    }
    $("#passwordKeyMasterAddMasterKey").html();
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

    $('#addMasterKey').removeClass('animate__animated animate__bounceInUp');
    setTimeout(() => {
        $('#masterKey').removeClass('animate__animated animate__bounceOutDown');
        $('#spinnerWaiterMasterKey').hide();
        $('#masterKey').modal('hide');
        $("#passwordKeyMasterUnlock").val('');

    }, 700);
}
function unlockAfterAddMasterkey() {
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
    $('#spinnerWaiteraddMasterKey').show();
    
    getPasswords();
    getDatabases();
    $('#addMasterKey').removeClass('animate__animated animate__bounceInUp');
    $('#addMasterKey').addClass('animate__animated animate__bounceOutDown');

    $('#masterKey').removeClass('animate__animated animate__bounceInUp');
    setTimeout(() => {
        $('#addMasterKey').removeClass('animate__animated animate__bounceOutDown');
        $('#spinnerWaiteraddMasterKey').hide();
        $('#addMasterKey').modal('hide');
        $("#passwordKeyMasterAddMasterKey").val('');

    }, 700);
}
function closeAlert(e) {
    $('#close_addNewEntryAlert').removeClass('show');
}
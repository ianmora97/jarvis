const { resolve } = require("path");
const { ipcRenderer } = require('electron')

var z_masterkey = "";
var z_checkMasterkeyExists;
var clipboard = new ClipboardJS('.btn-to-clip');

function eventsOnLoad(event) {
    changeModalsOS();
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
    matchPasswordsType();
    // changeTabsonShow();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    $(function () {

    })
    
}
function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'OSX';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
    return os;
}
function changeModalsOS() {
    let os = getOS();
    if(os == 'OSX'){
        $('div[data-modal="header"]').removeClass('modal-header');
        $('div[data-modal="header"]').addClass('modal-header-mac');

        $('div[data-modal="header"]').find('span').addClass('order-2');
        $('div[data-modal="header"]').find('button').addClass('order-1');

        $('div[data-modal="header"]').find('button').removeClass('button-close');
        $('div[data-modal="header"]').find('button').addClass('button-close-mac');

        $('div[data-modal="header"]').find('button').html('<i class="fas fa-circle" style="color:#e65d5d;"></i>');
    }else if(os == 'Windows'){

    }
}
function changeTabsonShow() { // !shows the prev and new tabs *Not working*
    $('a.dbs').on('shown.bs.tab', function (event) {
        let newly = event.target // newly activated tab
        let prev = event.relatedTarget // previous active tab
    })
}
function setForSearchValue(name,e) {
    e.target
    
    // $(this).tab('show')
    // $(name).html('Showing '+(info.recordsTotal)+' of '+info.recordsTotal);
    

}

function printInfotoFooter(id) { // ! Shows the information of the entry below the tables
    for(let i=0;i<z_passwords_All.length;i++){
        if(z_passwords_All[i].id == id){
            let row = z_passwords_All[i];
            let link ='';
            if(row.url.includes('https://')){
                link = row.url;
            }else{
                link = 'https://'+row.url;
            }
            $('#entryInfo').html(`
                ${row.icon}
                <small class="sr-only">${row.id}</small>
                <strong>Name:</strong> ${row.name} | 
                <strong>User:</strong> ${row.username} | 
                <span role="button" class="text-info" onclick="openExternalLink('${link}')">${link}</span> | 
                <button type="button" class="btn btn-light py-0 btn-sm">
                    Level <span class="badge badge-primary">${row.level}</span>
                </button>
            `);
        }
    }
}
function searchonfind() {
    var table = $('#tabletofind').DataTable();
    let val = $('#searchBarTablesModal').val();           
    let result = table.search( val ).draw();
}
function closeModalSearch() {
    $('#modalfindintables').removeClass('animate__animated animate__bounceInRight');
    $('#modalfindintables').addClass('animate__animated animate__bounceOutRight');
    setTimeout(() => {
        $('#modalfindintables').removeClass('animate__animated animate__bounceOutRight');
        $('#modalfindintables').modal('hide');
    }, 600);
}
function searchinTables() {
    $('#modalfindintables').addClass('animate__animated animate__bounceInRight');
    $('#modalfindintables').modal('show');
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
    $('#passwordKeyMasterUnlockPassword').on('keyup',function (event){
        if(event.which == 13){
            askMasterkeyVerify();
        }
    });
}
function openExternalLink(url) {
    ipcRenderer.send('open-url', url);
}
async function getMasterkey() {
    return $('#passwordKeyMasterUnlock').val();
}
async function getMasterkeyVerifyCon() {
    return $('#passwordKeyMasterUnlockPassword').val();
}


async function getinfo_addMasterkey(){
    return $('#passwordKeyMasterAddMasterKey').val();
}

async function getinfo_changeMasterkey() {
    setTimeout(() => {
        let newp = $('#configMasterkeyNameinputNew').val();
        let conf = $('#configMasterkeyNameinputConfirm').val();
        
        if(newp == conf){
            resolve($('#configMasterkeyNameinputNew').val()); 
        }else{
            resolve('new_not_equal');
        }
        
    }, 1000);
    
}
function fail_notEqual() {
    
    setTimeout(() => {
        $("#configMasterkeyNameinputNew").addClass('is-invalid');
        $("#configMasterkeyNameinputConfirm").addClass('is-invalid');
        $("#feedbackPassMatch").show();
        $("#contentModalUnlockWorkSpaceconfigmasterkey").addClass('animate__animated animate__shakeX');
        $('#spinnerWaiterconfigMasterkey').hide();
    }, 1000);
    setTimeout(() => {
        $("#contentModalUnlockWorkSpaceconfigmasterkey").removeClass('animate__animated animate__shakeX');
    }, 2000);
}
function fail_currentnotEqual() {
    
    setTimeout(() => {
        $("#configMasterkeyNameinputCurrent").addClass('is-invalid');
        $("#feedbackPassCurrent").show();
        $("#contentModalUnlockWorkSpaceconfigmasterkey").addClass('animate__animated animate__shakeX');
        $('#spinnerWaiterconfigMasterkey').hide();
    }, 1000);
    setTimeout(() => {
        $("#contentModalUnlockWorkSpaceconfigmasterkey").removeClass('animate__animated animate__shakeX');
    }, 2000);
}
function fail_newSame() {
    setTimeout(() => {
        $("#feedbackPassSame").show();
        $("#contentModalUnlockWorkSpaceconfigmasterkey").addClass('animate__animated animate__shakeX');
        $('#spinnerWaiterconfigMasterkey').hide();
    }, 1000);
    setTimeout(() => {
        $("#contentModalUnlockWorkSpaceconfigmasterkey").removeClass('animate__animated animate__shakeX');
    }, 2000);
}
function matchPasswordsType() {
    $('#configMasterkeyNameinputNew').on('keyup',function () {
        $("#configMasterkeyNameinputNew").removeClass('is-invalid');
        $("#configMasterkeyNameinputConfirm").removeClass('is-invalid');
        $("#feedbackPassMatch").hide();
        $("#feedbackPassSame").hide();
    });
    $('#configMasterkeyNameinputConfirm').on('keyup',function () {
        $("#configMasterkeyNameinputNew").removeClass('is-invalid');
        $("#configMasterkeyNameinputConfirm").removeClass('is-invalid');
        $("#feedbackPassMatch").hide();
        $("#feedbackPassSame").hide();
    });
    $('#configMasterkeyNameinputCurrent').on('keyup',function () {
        $("#configMasterkeyNameinputCurrent").removeClass('is-invalid');
        $("#feedbackPassCurrent").hide();
        $("#feedbackPassSame").hide();
    });
}
/*
    !Tables
*/
var tempIdToShow;
function showLevelTR(id) {
    tempIdToShow = id;
    $('#passwordKeyMasterUnlockPassword').val('');
    $('#showallFormgroup').hide();
    $('#showPasswordConfirmFormgroup').show();
    $('#masterKey').modal('show');
    $('#showPassMasterKeyButton').show();

    $('#askMasterKeyButton').hide();
}
function printChangeValues() {
    $('#showPassMasterKeyButton').hide();
    $('#askMasterKeyButton').show();
    let id = tempIdToShow;
    for(let i=0;i<z_passwords_All.length;i++){
        if(z_passwords_All[i].id == id){
            $('#id_tr_'+id).html('');
            let row = z_passwords_All[i];
            $('#id_tr_'+id).append(
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
    $('#showallFormgroup').show();
    $('#showPasswordConfirmFormgroup').hide();
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
    $(document).on('click','.btn-icon', function(){
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
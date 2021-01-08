function eventsOnLoad(event) {
    getPasswords();
    openModalEntry();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}


function openModalEntry() {
    $('#addentrybutton').on('click',()=>{
        $('#addEntryModal').modal('show');   
    });
}
document.addEventListener("DOMContentLoaded", eventsOnLoad);
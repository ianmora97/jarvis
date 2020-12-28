const {app, BrowserWindow, systemPreferences } = require('electron');
console.log(systemPreferences.getMediaAccessStatus('microphone'));
function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences:{
            nodeIntegration: true
        }
    })
    //win.removeMenu();
    win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow();
    }
});
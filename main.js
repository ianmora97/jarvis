const {app, BrowserWindow, systemPreferences, Tray } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1500,
        height: 800,
        show: false,
        resizable: false,
        icon: 'images/icon.png',
        webPreferences:{
            nodeIntegration: true
        }
    })
    win.once('ready-to-show', () => {
        win.show()
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

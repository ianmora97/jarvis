const {app, BrowserWindow, systemPreferences, Tray, shell } = require('electron');
const path = require('path')
function createWindow() {
    const win = new BrowserWindow({
        width: 1500,
        height: 800,
        show: false,
        resizable: false,
        webPreferences:{
            nodeIntegration: true
        }
    })
    win.once('ready-to-show', () => {
        win.show()
    })
    win.setIcon(path.join(__dirname, '/images/ico.png'));
    win.removeMenu();
    win.loadFile(path.join(__dirname,"index.html"));
}

app.whenReady().then(()=>{
    createWindow();
    app.on('activate',()=>{
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow();
        }
    });    
});

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});


const { app, BrowserWindow , screen} = require('electron')
const path = require('path')

function createWindow () {

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const windowOptions = {
    width: width,
    minWidth: 680,
    height: height,
    title: app.getName(),
    webPreferences: {
      nodeIntegration: true
    }
  }

  if (process.platform === 'linux') {
    windowOptions.icon = path.join(__dirname, '/assets/icon.png');
  }
  // Create the browser window.
  const win = new BrowserWindow(windowOptions);

  // and load the index.html of the app.
  win.removeMenu();
  win.loadFile('index.html');

  // Open the DevTools.
  // win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

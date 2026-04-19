const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

// Handle "slouch" events to trigger native desktop notification.
// Registered once at the module level so that reopening the window on macOS
// (via the 'activate' event) does not stack duplicate listeners.
ipcMain.on('trigger-alert', (event) => {
  new Notification({
    title: 'PostureGuard Alert 🧘',
    body: 'You are slouching! Please sit up straight.',
    silent: false
  }).show();
  // Inform the renderer that the notification was sent.
  event.sender.send('alert-shown', { timestamp: Date.now() });
});

function createWindow() {
  const preloadPath = path.join(app.getAppPath(), 'preload.js');
  const productionIndexPath = path.join(app.getAppPath(), 'out', 'index.html');

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      // Security hardening: keep Node.js out of the renderer process.
      // All Node/Electron access must go through the contextBridge in preload.js.
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: preloadPath,
    },
    autoHideMenuBar: true,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(productionIndexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();

  // Setup auto-start
  app.setLoginItemSettings({
    openAtLogin: true, // You can make this dynamic via IPC and user settings
    path: app.getPath('exe')
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

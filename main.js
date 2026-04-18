const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const serve = require('electron-serve');

const loadURL = serve({ directory: 'out' });

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
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  } else {
    loadURL(mainWindow);
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

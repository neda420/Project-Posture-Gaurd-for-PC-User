const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const serve = require('electron-serve');

const loadURL = serve({ directory: 'out' });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    // Customize title bar for a modern look if needed
    autoHideMenuBar: true,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  } else {
    loadURL(mainWindow);
  }

  // Handle "slouch" events to trigger native desktop notification
  ipcMain.on('trigger-alert', (event, arg) => {
    new Notification({
      title: 'PostureGuard Alert 🧘',
      body: 'You are slouching! Please sit up straight.',
      silent: false
    }).show();
  });

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

const electronUpdater = require('electron-updater');
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const Store = require('electron-store');

// First instantiate the class
const store = new Store({
  // We'll call our data file 'user-preferences'
  name: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 800, height: 600 },
  },
  // encryptionKey: 'encryption key', // use node-keytar to store the encryption key safely
  // fileExtension: '',
});

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

if (isDev) {
  const devTools = require('electron-devtools-installer');
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

function createWindow(width, height) {
  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // The BrowserWindow class extends the node.js core EventEmitter class, so we use that API
  // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let { width, height } = mainWindow.getBounds();
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
  });

  // Load from localhost if in development
  // Otherwise load index.html file
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // Open DevTools if in dev mode
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

// Create a new browser window by invoking the createWindow
// function once the Electron application is initialized.
// Install REACT_DEVELOPER_TOOLS as well if isDev
app.whenReady().then(() => {
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }

  let { width, height } = store.get('windowBounds');

  createWindow(width, height);
});

// Add a new listener that tries to quit the application when
// it no longer has any open windows. This listener is a no-op
// on macOS due to the operating system's window management behavior.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Add a new listener that creates a new browser window only if
// when the application has no visible windows after being activated.
// For example, after launching the application for the first time,
// or re-launching the already running application.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('ready', () => {
  electronUpdater.autoUpdater.checkForUpdatesAndNotify();
});

// The code above has been adapted from a starter example in the Electron docs:
// https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file

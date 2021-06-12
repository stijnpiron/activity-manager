const electronUpdater = require('electron-updater');
const { app, BrowserWindow, dialog, Menu } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const Store = require('electron-store');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

function logMessage(text) {
  log.info(text);
}

const isMac = process.platform === 'darwin';

const menuItems = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: 'Activity Manager',
          submenu: [
            // { role: 'about' },
            // { type: 'separator' },
            // { role: 'services' },
            // { type: 'separator' },
            // { role: 'hide' },
            // { role: 'hideothers' },
            // { role: 'unhide' },
            // { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
  },
  // { role: 'editMenu' }
  // {
  //   label: 'Edit',
  //   submenu: [
  //     { role: 'undo' },
  //     { role: 'redo' },
  //     { type: 'separator' },
  //     { role: 'cut' },
  //     { role: 'copy' },
  //     { role: 'paste' },
  //     ...(isMac
  //       ? [
  //           { role: 'pasteAndMatchStyle' },
  //           { role: 'delete' },
  //           { role: 'selectAll' },
  //           { type: 'separator' },
  //           {
  //             label: 'Speech',
  //             submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
  //           },
  //         ]
  //       : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
  //   ],
  // },
  // { role: 'viewMenu' }
  // {
  //   label: 'View',
  //   submenu: [
  //     { role: 'reload' },
  //     { role: 'forceReload' },
  //     { role: 'toggleDevTools' },
  //     { type: 'separator' },
  //     { role: 'resetZoom' },
  //     { role: 'zoomIn' },
  //     { role: 'zoomOut' },
  //     { type: 'separator' },
  //     { role: 'togglefullscreen' },
  //   ],
  // },
  // { role: 'windowMenu' }
  // {
  //   label: 'Window',
  //   submenu: [
  //     { role: 'minimize' },
  //     { role: 'zoom' },
  //     ...(isMac
  //       ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
  //       : [{ role: 'close' }]),
  //   ],
  // },
  // {
  //   role: 'help',
  //   submenu: [
  //     {
  //       label: 'Learn More',
  //       click: async () => {
  //         const { shell } = require('electron');
  //         await shell.openExternal('https://electronjs.org');
  //       },
  //     },
  //   ],
  // },
];

// add logging to the app
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
logMessage('App starting...');

// first instantiate the class
const store = new Store({
  // we'll call our data file 'user-preferences'
  name: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 800, height: 600 },
  },
  // encryptionKey: 'encryption key', // use node-keytar to store the encryption key safely
  // fileExtension: '',
});

// conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

// handle creating/removing shortcuts on Windows when installing/uninstalling.
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
    height,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    width,
  });

  // the BrowserWindow class extends the node.js core EventEmitter class, so we use that API
  // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
  mainWindow.on('resize', () => {
    // the event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    const { width, height } = mainWindow.getBounds();
    // now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
  });

  // load from localhost if in development
  // otherwise load index.html file
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // remove menu bar as there is no need to have one
  mainWindow.removeMenu();

  const menu = Menu.buildFromTemplate(menuItems);
  Menu.setApplicationMenu(menu);

  // open DevTools if in dev mode
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

// create a new browser window by invoking the createWindow
// function once the Electron application is initialized.
// install REACT_DEVELOPER_TOOLS as well if isDev
app.whenReady().then(() => {
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }

  const { width, height } = store.get('windowBounds');

  createWindow(width, height);
});

// add a new listener that tries to quit the application when
// it no longer has any open windows. This listener is a no-op
// on macOS due to the operating system's window management behavior.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// add a new listener that creates a new browser window only if
// when the application has no visible windows after being activated.
// for example, after launching the application for the first time,
// or re-launching the already running application.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const checkForUpdates = () => {
  // no need for quitAndInstall => https://github.com/electron-userland/electron-builder/issues/2977#issuecomment-397887981
  autoUpdater.checkForUpdatesAndNotify();
};

app.on('ready', async () => {
  // check for updates every m minutes
  const m = 15;
  checkForUpdates();
  setInterval(checkForUpdates, m * 60000);
});

autoUpdater.on('checking-for-update', () => {
  logMessage('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  logMessage(`Update available: ${info.version}`);
});

autoUpdater.on('update-not-available', () => {
  logMessage(`No update not available`);
});

autoUpdater.on('error', (err) => {
  logMessage(`Error in auto-updater: ${typeof err === 'string' ? err : JSON.stringify(err)}`);
});

autoUpdater.on('download-progress', (progressObj) => {
  let message = `Download speed: ${progressObj.bytesPerSecond}`;
  message = `${message} - Downloaded ${progressObj.percent}%`;
  message = `${message} (${progressObj.transferred}/${progressObj.total})`;
  logMessage(message);
});

autoUpdater.on('update-downloaded', (info) => {
  logMessage(`Update downloaded`);

  const dialogOpts = {
    buttons: ['Restart', 'Later'],
    detail: 'A new version has been downloaded. Restart the application to apply the updates.',
    message: 'New version available',
    title: 'Application Update',
    type: 'info',
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// the code above has been adapted from a starter example in the Electron docs:
// https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file

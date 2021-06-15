/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/**
 * this module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import log from 'electron-log';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import 'regenerator-runtime/runtime';
import MenuBuilder from './menu';

const logMessage = (text: string): void => {
  log.info(text);
};
logMessage('App starting...');

// const isMac = pro  cess.platform === 'darwin';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// first instantiate the class
const store = new Store({
  // we'll call our data file 'user-preferences'
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { height: 600, width: 800 },
  },
  name: 'user-preferences',
  // encryptionKey: 'encryption key', // use node-keytar to store the encryption key safely
  // fileExtension: '',
});

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(logMessage);
};

// handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = async ({ height, width }): Promise<void> => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => path.join(RESOURCES_PATH, ...paths);

  mainWindow = new BrowserWindow({
    height,
    icon: getAssetPath('icon.png'),
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
    width,
  });

  // the BrowserWindow class extends the node.js core EventEmitter class, so we use that API
  // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
  mainWindow.on('resize', () => {
    // the event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    const { height: newHeight, width: newWidth } = mainWindow.getBounds();
    // now that we have them, save them using the `set` method.
    store.set('windowBounds', { height: newHeight, width: newWidth });
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * add event listeners...
 */

app.on('window-all-closed', () => {
  // respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const getHeightAndWidth = () => {
  const { height, width } = store.get('windowBounds');

  return { height, width };
};

app.on('ready', () => {
  createWindow(getHeightAndWidth());

  mainWindow.webContents.on('did-frame-finish-load', async () => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      // await installExtensions();
    }
  });
});

app.on('activate', () => {
  // on macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow(getHeightAndWidth());
  }
});

ipcMain.on('shutdown', async () => {
  if (
    dialog.showMessageBoxSync({
      message: 'Are you sure you want to exit?',
      title: 'Exit App',
      type: 'warning',
      buttons: ['Cancel', 'Ok'],
    })
  ) {
    app.quit();
  }
});

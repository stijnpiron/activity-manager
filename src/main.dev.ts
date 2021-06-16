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
import fs from 'fs';
import path from 'path';
import 'regenerator-runtime/runtime';
import MenuBuilder from './menu';

const logMessage = (text: string): void => {
  log.info(text);
};
logMessage('App starting...');

// const isMac = pro  cess.platform === 'darwin';
const isDev = process.env.NODE_ENV === 'development';
const debugProd = process.env.DEBUG_PROD === 'true';
const isProd = process.env.NODE_ENV === 'production';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// first instantiate the class
const encryptionKey = isDev
  ? undefined
  : '%;5}CG{*V/p:?a8Wm)Grgr9CxEGBE=_wD4RQ9v9fkv9[a(jjd{hg5H2f$B?N$.%LXjA[a!;Y}8]M2Pez{4T.t/pNELGyz789iW*HR*N}:TEzXRv.)diHggzim!)Y.zfG';

const appSettingsStore = new Store({
  // we'll call our data file 'user-preferences'
  defaults: {
    // 800x600 is the default size of our window
    appSettings: {
      cwd: 'userData',
      fileExtension: 'kam',
      periods: [],
      windowBounds: { height: 768, width: 1366 },
    },
  },
  fileExtension: 'kam',
  name: 'settings',
});

const appSettings = appSettingsStore.get('appSettings');

// clean data on DEV environment on startup, comment out following if to persist data
// change name const if another filename is wanted.
if (isDev) {
  const period = '2021-2';

  const currentPeriodStore = new Store({
    cwd: appSettings.cwd,
    encryptionKey,
    fileExtension: appSettings.fileExtension,
    name: period,
  });
  currentPeriodStore.clear();

  // add seedData to file storage for testing purposes
  const seedFile = path.join(__dirname, '../seed.json');

  if (fs.existsSync(seedFile)) {
    const seedData = require(seedFile);
    currentPeriodStore.set(seedData);
  }
}

let mainWindow: BrowserWindow | null = null;

if (isProd) {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDev || debugProd) {
  require('electron-debug')();
}

const installExtensions = (): Promise<any> => {
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

const createWindow = ({ height, width }: { height: number; width: number }): void => {
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
    if (mainWindow) {
      const { height: newHeight, width: newWidth } = mainWindow.getBounds();
      // now that we have them, save them using the `set` method.
      appSettingsStore.set('windowBounds', { height: newHeight, width: newWidth });
    }
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

const getHeightAndWidth = (): { height: number; width: number } => {
  const { height, width } = appSettings.windowBounds;

  return { height, width };
};

app.on('ready', () => {
  createWindow(getHeightAndWidth());

  if (mainWindow) {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      if (isDev || debugProd) {
        installExtensions();
      }
    });
  }
});

app.on('activate', () => {
  // on macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow(getHeightAndWidth());
  }
});

// handle shutdown requests
ipcMain.on('shutdown', (): void => {
  if (
    dialog.showMessageBoxSync({
      buttons: ['Cancel', 'Ok'],
      message: 'Are you sure you want to exit?',
      title: 'Exit App',
      type: 'warning',
    })
  ) {
    app.quit();
  }
});

ipcMain.on(
  'app-settings',
  (event) => (event.returnValue = { ...appSettings, dataLocation: appSettings.cwd, encryptionKey }),
);
ipcMain.on('get-periods', (event) => (event.returnValue = [...appSettings.periods]));

ipcMain.on('add-period', (_, period) => {
  const currentPeriods = [...appSettings.periods.filter((p) => p !== period)];
  const newPeriods = [...currentPeriods, period].sort();
  console.info({ currentPeriods, newPeriods });
  appSettingsStore.set('appSettings.periods', [...appSettings.periods.filter((p) => p !== period), period]);
});

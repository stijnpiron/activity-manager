import App from 'App/App';
import { ipcRenderer } from 'electron';
import React from 'react';
import { render } from 'react-dom';
import pjson from '../package.json';
import './index.css';

const shutdown = (): void => ipcRenderer.send('shutdown', 'now');

const saveNewPeriod = (period: string): void => ipcRenderer.send('add-period', period);

const getPeriods = (): string[] => ipcRenderer.sendSync('get-periods');

const { encryptionKey, fileExtension, dataLocation } = ipcRenderer.sendSync('app-settings');

const title = 'Kazou - Activity Manager';
const { version } = pjson;

const appProps = {
  dataProps: { dataLocation, encryptionKey, fileExtension },
  getPeriods,
  saveNewPeriod,
  shutdown,
  title,
  version,
};

render(<App {...appProps} />, document.getElementById('root'));

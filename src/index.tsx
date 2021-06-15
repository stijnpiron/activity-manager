import App from 'App/App';
import { ipcRenderer } from 'electron';
import React from 'react';
import { render } from 'react-dom';
import pjson from '../package.json';
import './index.css';

const shutdown = (): void => {
  ipcRenderer.send('shutdown', 'now');
};
const title = 'Kazou - Activity Manager';
const { version } = pjson;

const appProps = { shutdown, title, version };

render(<App {...appProps} />, document.getElementById('root'));

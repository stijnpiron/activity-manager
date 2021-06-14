import App from 'components/App/App';
import React from 'react';
import ReactDOM from 'react-dom';
import pjson from '../package.json';
import './index.css';

// TODO: find a fix to enable app shutdown initiated from React
// const shutdown = (): void => ipcRenderer.send('shutdown');
const shutdown = (): void => {
  console.info('shutdown not implemented');
};

ReactDOM.render(
  <React.StrictMode>
    <App title="Kazou - Activity Manager" version={pjson.version} shutdown={shutdown} />
  </React.StrictMode>,
  document.getElementById('root'),
);

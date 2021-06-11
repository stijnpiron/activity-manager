import App from 'components/App/App';
import React from 'react';
import ReactDOM from 'react-dom';
import pjson from '../package.json';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App title="Kazou - Activity Manager" version={pjson.version} />
  </React.StrictMode>,
  document.getElementById('root'),
);

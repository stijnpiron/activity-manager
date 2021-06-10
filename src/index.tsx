import App from 'components/App/App';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const pjson = require('../package.json');

ReactDOM.render(
  <React.StrictMode>
    <App title="Kazou - Activity Manager" version={pjson.version} />
  </React.StrictMode>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { headerInfo } from './data/personalInfo';

document.title = `${headerInfo.name}'s Resume`;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);



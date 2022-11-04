import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-quill/dist/quill.snow.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import log from 'loglevel';
import Modal from 'react-modal';
import {
  Twitter,
  Discord,
  Metamask,
  Phantom,
  Martian,
  setApiBaseUrl,
} from '@ecnft/wl-user-core';

console.log(`${process.env.REACT_APP_NAME}:v${process.env.REACT_APP_VERSION}`);

log.setLevel(process.env.NODE_ENV === 'production' ? 'WARN' : 'DEBUG');

if (!process.env.REACT_APP_API_BASE_URL) throw new Error('config required');

setApiBaseUrl(process.env.REACT_APP_API_BASE_URL);

Modal.setAppElement('#root');
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

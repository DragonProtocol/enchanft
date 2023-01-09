// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import Extension from './container/Extension';

const app = document.createElement('div');
app.id = 'u3-extension-root';

document.body.appendChild(app);

app.style.display = 'none';

const toggle = () => {
  if (app.style.display === 'none') {
    app.style.display = 'block';
  } else {
    app.style.display = 'none';
  }
};

const root = ReactDOM.createRoot(document.getElementById('u3-extension-root'));
root.render(
  <React.StrictMode>
    <Extension onClose={() => toggle()} />
  </React.StrictMode>
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { token, message } = request;
  if (message === 'clicked_browser_action') {
    toggle();
    if (token) {
      root.render(
        <React.StrictMode>
          <Extension token={token} onClose={() => toggle()} />
        </React.StrictMode>
      );
    }
  }
});

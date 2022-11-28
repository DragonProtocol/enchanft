/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 10:00:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-10 17:42:47
 * @Description: file description
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserView, MobileView } from 'react-device-detect'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ExternalLinkRiskWarning, {
  isExternalLinkRiskWarningUrl,
  startExternalLinkNavigationListener,
} from './ExternalLinkRiskWarning';

// 当前地址是否是外链警告地址，不是的话开启外链跳转监听器
if (!isExternalLinkRiskWarningUrl) {
  startExternalLinkNavigationListener();
}
// import MobileRedirect from './MobileRedirect'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {isExternalLinkRiskWarningUrl ? <ExternalLinkRiskWarning /> : <App />}

    {/* <BrowserView>
      <App />
    </BrowserView>
    <MobileView>
      <MobileRedirect />
    </MobileView> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

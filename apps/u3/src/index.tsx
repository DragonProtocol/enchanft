/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 10:00:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-12 17:31:50
 * @Description: file description
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import ExternalLinkRiskWarning, {
//   isExternalLinkRiskWarningUrl,
//   startExternalLinkNavigationListener,
// } from './ExternalLinkRiskWarning';

// 当前地址是否是外链警告地址，不是的话开启外链跳转监听器
// if (!isExternalLinkRiskWarningUrl) {
//   startExternalLinkNavigationListener();
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* {isExternalLinkRiskWarningUrl ? <ExternalLinkRiskWarning /> : <App />} */}
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
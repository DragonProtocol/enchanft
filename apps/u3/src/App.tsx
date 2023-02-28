/*
 * @Author:
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 10:51:29
 * @Description:
 */
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import {
  WlUserReactProvider,
  handleAuthFailed,
  setApiBaseUrl,
} from '@ecnft/wl-user-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Layout from './components/layout/Index';
import { store } from './store/store';
import GlobalStyle from './GlobalStyle';

import { authorizers } from './utils/wlUserReact';
import { API_BASE_URL } from './constants';
import {
  injectHandleAxiosResponse401,
  injectStore,
  injectWlUserReactContextValue,
} from './services/api/request';

import Poster from './components/home/Poster';

dayjs.extend(relativeTime);

injectStore(store);
setApiBaseUrl(API_BASE_URL || '');
injectHandleAxiosResponse401(handleAuthFailed);

Modal.setAppElement('#root');
function App() {
  return (
    <Poster data="1" />
    //   <WlUserReactProvider
    //     theme="dark"
    //     authorizers={authorizers}
    //     valueChange={(value) => injectWlUserReactContextValue(value)}
    //   >
    //     <ReduxProvider store={store}>
    //       <GlobalStyle />
    //       <BrowserRouter>
    //         <Layout />
    //       </BrowserRouter>
    //     </ReduxProvider>
    //   </WlUserReactProvider>
  );
}

export default App;

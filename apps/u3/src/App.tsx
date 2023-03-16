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
import { Us3rProfileProvider } from '@us3r-network/profile';
import { Us3rThreadProvider } from '@us3r-network/thread';
import { Us3rAuthProvider, AuthToolType } from '@us3r-network/authkit';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Layout from './components/layout/Index';
import { store } from './store/store';
import GlobalStyle from './GlobalStyle';

import { authorizers } from './utils/wlUserReact';
import { API_BASE_URL, CERAMIC_HOST } from './constants';
import {
  injectHandleAxiosResponse401,
  injectStore,
  injectWlUserReactContextValue,
} from './services/api/request';

const authToolTypes = [
  AuthToolType.metamask_wallet,
  AuthToolType.phantom_wallet,
];

dayjs.extend(relativeTime);

injectStore(store);
setApiBaseUrl(API_BASE_URL || '');
injectHandleAxiosResponse401(handleAuthFailed);

Modal.setAppElement('#root');
function App() {
  return (
    <Us3rProfileProvider ceramicHost={CERAMIC_HOST}>
      <Us3rThreadProvider ceramicHost={CERAMIC_HOST}>
        <Us3rAuthProvider
          authConfig={{ authToolTypes }}
          themeConfig={{ themeType: 'dark' }}
        >
          <WlUserReactProvider
            theme="dark"
            authorizers={authorizers}
            valueChange={(value) => injectWlUserReactContextValue(value)}
          >
            <ReduxProvider store={store}>
              <GlobalStyle />
              <BrowserRouter>
                <Layout />
              </BrowserRouter>
            </ReduxProvider>
          </WlUserReactProvider>
        </Us3rAuthProvider>
      </Us3rThreadProvider>
    </Us3rProfileProvider>
  );
}

export default App;

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
import { Us3rProfileProvider } from '@us3r-network/profile';
import { Us3rThreadProvider } from '@us3r-network/thread';
import { Us3rAuthProvider, AuthToolType } from '@us3r-network/authkit';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Layout from './components/layout/Index';
import { store } from './store/store';
import GlobalStyle from './GlobalStyle';

import { CERAMIC_HOST } from './constants';
import { injectStore, injectU3Token } from './services/api/request';
import U3LoginProvider from './contexts/U3LoginContext';

const authToolTypes = [
  AuthToolType.metamask_wallet,
  AuthToolType.phantom_wallet,
];

dayjs.extend(relativeTime);

injectStore(store);

Modal.setAppElement('#root');
function App() {
  return (
    <Us3rProfileProvider ceramicHost={CERAMIC_HOST}>
      <Us3rThreadProvider ceramicHost={CERAMIC_HOST}>
        <Us3rAuthProvider
          authConfig={{ authToolTypes }}
          themeConfig={{ themeType: 'dark' }}
        >
          <U3LoginProvider
            u3LoginSuccess={(token) => {
              injectU3Token(token);
            }}
          >
            <ReduxProvider store={store}>
              <GlobalStyle />
              <BrowserRouter>
                <Layout />
              </BrowserRouter>
            </ReduxProvider>
          </U3LoginProvider>
        </Us3rAuthProvider>
      </Us3rThreadProvider>
    </Us3rProfileProvider>
  );
}

export default App;
